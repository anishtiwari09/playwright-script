import { Page } from '@playwright/test';
import { safeClick } from '../utils/actionUtils';

export class CartDrawer {
  constructor(private page: Page) {}

  async waitForOpen() {
    await this.page.locator('.chakra-modal__content').waitFor({ state: 'visible' });
  }

  async goToCheckout() {
    const drawer = this.page.locator('.chakra-modal__content');

    await drawer.locator('footer').scrollIntoViewIfNeeded();

    const checkoutBtn = drawer.locator('[data-ge-checkout-button="true"]');

    await Promise.all([
      this.page.waitForURL('**/checkout'),
      safeClick(this.page, checkoutBtn)
    ]);
  }
}