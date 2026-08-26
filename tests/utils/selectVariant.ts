import { Page, expect } from "@playwright/test";
import { recoverOutOfStock } from './outOfStockRecovery';
import { autoWaitFor, autoClick } from './autoHeal';

export async function selectVariant(page: Page, preferredSize?: string) {
    console.log(`Selecting variants${preferredSize ? ` with preferred size: ${preferredSize}` : ''}`);
    await expect(page).toHaveURL(/\/p\//);
    await expect(page).not.toHaveURL(/international|global-e/i);

    // Find color groups distinctly
    const colorOptions = page.locator('div[data-swatch-global-index]');

    if (await colorOptions.count() > 0) {
        console.log('Color found');
        await expect(colorOptions.first()).toBeVisible({ timeout: 30000 });
        await colorOptions.first().click();
    } else {
        console.log('color selected..');
    }

    await page.waitForLoadState('domcontentloaded');

    // === FIX 1: Isolate the sizes container explicitly so it does not blend with color swatches ===
    const sizeOptionsLocator = await autoWaitFor(page, 'button[role="radio"][aria-disabled="false"]', [
        'button[role="radio"][aria-disabled="false"]',
        'button[data-size]',
        '[data-testid*="size"] button'
    ], { timeout: 40000 });

    const sizeOptions = page.locator('button[role="radio"][aria-disabled="false"]');

    // If a preferred size is specified, try to select it
    if (preferredSize) {
        console.log(`Attempting to select preferred size: ${preferredSize}`);
        const sizeCount = await sizeOptions.count();

        let sizeSelected = false;
        for (let i = 0; i < sizeCount; i++) {
            const currentSize = sizeOptions.nth(i);
            const sizeText = await currentSize.innerText();

            if (sizeText.trim().toLowerCase() === preferredSize.trim().toLowerCase()) {
                console.log(`Found and selecting preferred size: ${sizeText.trim()}`);
                await currentSize.click();
                sizeSelected = true;
                break;
            }
        }

        if (!sizeSelected) {
            console.log(`Preferred size "${preferredSize}" not found among available options, selecting first available size`);
            await sizeOptions.first().click();
        }
    } else {
        // Default behavior - select first available size
        await sizeOptions.first().click();
    }

    await sizeOptions.first().waitFor({ state: 'visible', timeout: 4000 }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    // Add to bag with auto-healing
    const addToBag = await autoWaitFor(page, 'button:has-text("Add to Bag")', [
        'button:has-text("Add to Bag")',
        'button:has-text("ADD TO CART")',
        '[data-testid*="add-to-bag"]'
    ], { timeout: 60000 });

    await expect(addToBag).toBeEnabled({ timeout: 60000 });
    await addToBag.click();

    // Handle out-of-stock bag popup via shared util
    if (await recoverOutOfStock(page)) {
        return false;
    }

    console.log('Product added to bag successfully.');
    return true;
}
