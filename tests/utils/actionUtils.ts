import { Locator, Page } from '@playwright/test';
import { autoClick, autoFill, autoWaitFor, healLocator } from './autoHeal';

export async function safeClick(page: Page, locator: Locator | string, fallbacks: string[] = []) {
  await autoClick(page, locator, fallbacks);
}

export async function safeFill(page: Page, locator: Locator | string, value: string, fallbacks: string[] = []) {
  await autoFill(page, locator, value, fallbacks);
}

export async function safeWaitFor(page: Page, locator: Locator | string, fallbacks: string[] = []) {
  return await autoWaitFor(page, locator, fallbacks);
}

export async function waitForNavigation(page: Page, locator: Locator | string, fallbacks: string[] = []) {
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    safeClick(page, locator, fallbacks)
  ]);
}

export { autoClick, autoFill, autoWaitFor, healLocator };
