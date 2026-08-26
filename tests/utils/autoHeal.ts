import { Page, FrameLocator, Locator, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface HealOptions {
  timeout?: number;
  state?: 'visible' | 'attached' | 'detached' | 'hidden';
  force?: boolean;
}

export interface HealReportEntry {
  timestamp: string;
  primarySelector: string;
  healedSelector: string;
  pageUrl: string;
}

const REPORT_PATH = path.join(process.cwd(), 'test-results', 'auto-healing-report.json');

/**
 * Log healed locator occurrences to a JSON report for maintenance tracking.
 */
function logHealingReport(entry: HealReportEntry) {
  try {
    const dir = path.dirname(REPORT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let reports: HealReportEntry[] = [];
    if (fs.existsSync(REPORT_PATH)) {
      try {
        const content = fs.readFileSync(REPORT_PATH, 'utf-8');
        reports = JSON.parse(content);
      } catch {
        reports = [];
      }
    }
    reports.push(entry);
    fs.writeFileSync(REPORT_PATH, JSON.stringify(reports, null, 2));
  } catch (err) {
    console.error('Failed to write auto-healing report:', err);
  }
}

/**
 * Automatically generates dynamic fallback selectors if explicit ones are omitted.
 * Only targets specific interactive elements (button, input, a, role) to avoid matching outer wrappers.
 */
export function generateSmartFallbacks(selectorStr: string): string[] {
  const fallbacks: string[] = [];

  // ID based (#first_name) -> input[name="first_name"], [placeholder*="first name" i]
  if (selectorStr.startsWith('#')) {
    const idVal = selectorStr.replace('#', '');
    fallbacks.push(`input[name="${idVal}"]`);
    fallbacks.push(`[data-testid*="${idVal}"]`);
    fallbacks.push(`input[id*="${idVal}"]`);
    const wordClean = idVal.replace(/[-_]/g, ' ');
    fallbacks.push(`[placeholder*="${wordClean}" i]`);
    fallbacks.push(`[aria-label*="${wordClean}" i]`);
  }

  // Name attribute based (input[name="street_name"]) -> #street_name, [placeholder*="street" i]
  if (selectorStr.includes('name=')) {
    const match = selectorStr.match(/name=["']?([^"']+)["']/);
    if (match) {
      const nameVal = match[1];
      fallbacks.push(`#${nameVal}`);
      fallbacks.push(`[data-testid*="${nameVal}"]`);
      fallbacks.push(`input[id*="${nameVal}"]`);
      const wordClean = nameVal.replace(/[-_]/g, ' ');
      fallbacks.push(`[placeholder*="${wordClean}" i]`);
      fallbacks.push(`[aria-label*="${wordClean}" i]`);
    }
  }

  // Button text based (button:has-text("Continue"))
  if (selectorStr.includes('has-text(') || selectorStr.includes('text=')) {
    const match = selectorStr.match(/(?:has-text\(|text=)["']?([^"'\)]+)["']?/);
    if (match) {
      const textVal = match[1];
      fallbacks.push(`[role="button"]:has-text("${textVal}")`);
      fallbacks.push(`button:has-text("${textVal}")`);
      fallbacks.push(`a:has-text("${textVal}")`);
      fallbacks.push(`input[type="submit"][value*="${textVal}" i]`);
    }
  }

  // Class based (.chakra-checkbox__control)
  if (selectorStr.startsWith('.')) {
    const classVal = selectorStr.replace('.', '');
    fallbacks.push(`[class*="${classVal}"]`);
    fallbacks.push(`[role="checkbox"]`);
  }

  return fallbacks;
}

/**
 * Resolves a locator auto-healing if the primary selector fails.
 */
export async function healLocator(
  target: Page | FrameLocator,
  primary: string | Locator,
  explicitFallbacks: string[] = [],
  options: HealOptions = {}
): Promise<Locator> {
  const timeout = options.timeout ?? 8000;
  const state = options.state ?? 'visible';

  let primaryLoc: Locator;
  let primaryDesc: string;

  if (typeof primary === 'string') {
    primaryLoc = target.locator(primary);
    primaryDesc = primary;
  } else {
    primaryLoc = primary;
    primaryDesc = primary.toString();
  }

  // Try primary locator first
  try {
    await primaryLoc.first().waitFor({ state, timeout });
    return primaryLoc.first();
  } catch (error) {
    console.warn(`\n⚠️  [AutoHeal] Primary locator failed: "${primaryDesc}". Initiating auto-healing search...`);
  }

  // Prepare candidate fallback selectors
  const candidates = [...explicitFallbacks];
  if (typeof primary === 'string') {
    const dynamicFallbacks = generateSmartFallbacks(primary);
    dynamicFallbacks.forEach(fb => {
      if (!candidates.includes(fb) && fb !== primary) {
        candidates.push(fb);
      }
    });
  }

  // Try each fallback candidate
  for (const fallback of candidates) {
    try {
      const fallbackLoc = target.locator(fallback).first();
      await fallbackLoc.waitFor({ state, timeout: 3000 });

      const url = 'url' in target ? (target as Page).url() : 'iframe';
      console.log(`✅ [AutoHeal SUCCESS] Healed locator! Primary "${primaryDesc}" -> Healed with "${fallback}"`);

      logHealingReport({
        timestamp: new Date().toISOString(),
        primarySelector: primaryDesc,
        healedSelector: fallback,
        pageUrl: url
      });

      return fallbackLoc;
    } catch {
      // Continue to next fallback candidate
    }
  }

  console.error(`❌ [AutoHeal FAILED] Could not heal locator "${primaryDesc}" using candidates: ${JSON.stringify(candidates)}`);
  return primaryLoc.first();
}

/**
 * Auto-healing click action
 */
export async function autoClick(
  target: Page | FrameLocator,
  primary: string | Locator,
  fallbacks: string[] = [],
  options: HealOptions = {}
): Promise<void> {
  const loc = await healLocator(target, primary, fallbacks, options);
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  try {
    await loc.click({ timeout: options.timeout ?? 10000 });
  } catch (err) {
    console.log(`[AutoHeal] Standard click blocked on "${primary.toString()}". Retrying with force click...`);
    await loc.click({ force: true });
  }
}

/**
 * Auto-healing fill action
 */
export async function autoFill(
  target: Page | FrameLocator,
  primary: string | Locator,
  value: string,
  fallbacks: string[] = [],
  options: HealOptions = {}
): Promise<void> {
  const loc = await healLocator(target, primary, fallbacks, options);
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  await loc.fill(value);
}

/**
 * Auto-healing wait action
 */
export async function autoWaitFor(
  target: Page | FrameLocator,
  primary: string | Locator,
  fallbacks: string[] = [],
  options: HealOptions = {}
): Promise<Locator> {
  return await healLocator(target, primary, fallbacks, options);
}
