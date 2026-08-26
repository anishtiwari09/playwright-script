import { Page, expect } from '@playwright/test';

export async function recoverOutOfStock(page: Page): Promise<boolean> {
  // Target out of stock modal header or messaging
  const modalHeader = page.locator(':has-text("Sorry, all the items in your bag are currently out of stock"), :has-text("out of stock"), [data-testid*="out-of-stock"]').first();

  try {
    // Wait up to 5 seconds for the network request to finish and show the modal
    await modalHeader.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Out-of-stock/no inventory modal detected! Recovering...');

    // 1. Click "Back to Bag" or "Return to Bag" button
    const backToBagBtn = page.locator('button:has-text("Back to Bag"), button:has-text("Return to Bag"), button:has-text("View Bag"), a:has-text("Back to Bag")').first();
    if (await backToBagBtn.isVisible().catch(() => false)) {
      await backToBagBtn.click({ force: true }).catch(() => {});
    }

    // 2. Wait for navigation back to cart or bag page
    await page.waitForURL(/\/(cart|bag)/, { timeout: 40000 }).catch(() => {});

    // 3. Look for and click the remove/delete button for the out-of-stock item
    const removeButton = page.locator('button[aria-label="remove"], button:has-text("Remove"), .cart-item-remove, [data-testid*="remove"]').first();
    if (await removeButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      console.log('Removing out-of-stock item from bag...');
      await removeButton.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    }

    // 4. Return to Graphic Tees PLP to select a fresh product
    console.log('Navigating back to Graphic Tees PLP to select a new product...');
    await page.goto('https://alpha.cofe.dxl.com/c/graphic-tees', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForURL(/\/c\//, { timeout: 30000 }).catch(() => {});

    return true; // Successfully recovered and returned to PLP!
  } catch (error) {
    // If the modal does not show up, the items are in stock.
    return false;
  }
}
