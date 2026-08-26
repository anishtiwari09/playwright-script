import { Page, expect } from '@playwright/test';
import { selectVariant } from '../utils/selectVariant';
import { PLPPage } from './PLPPage';
import { autoWaitFor } from '../utils/autoHeal';

export class PDPPage {
    readonly page: Page;
  constructor(page: Page) { this.page = page;}

  async addProductToCart(preferredSize?: string) {
    return await selectVariant(this.page, preferredSize);
  }

  async selectVariantAndCheckout(preferredSize?: string) {
    const maxRetries = 5;
    const plp = new PLPPage(this.page);

    console.log('Refreshing the PDP page once to stabilize variant availability...');
    await this.page.reload();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const addedToCart = await this.addProductToCart(preferredSize);
      if (addedToCart) {
        await this.proceedToCheckout();
        return;
      }

      if (attempt === maxRetries) {
        throw new Error('Unable to find an in-stock PDP variant after multiple PLP retries.');
      }

      await plp.retryRandomProductSelection(attempt);
    }
  }

  async proceedToCheckout() {
    const checkoutBtn = await autoWaitFor(this.page, "button[data-ge-checkout-button='true']", [
      "button[data-ge-checkout-button='true']",
      'button:has-text("Checkout")',
      'button:has-text("Proceed to Checkout")',
      '[data-testid*="checkout"]'
    ], { timeout: 15000 });
    await checkoutBtn.dispatchEvent('click');
  }
}

