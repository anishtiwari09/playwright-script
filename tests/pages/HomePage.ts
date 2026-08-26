import { Page } from '@playwright/test';
import { safeClick, autoClick, autoFill, autoWaitFor } from '../utils/actionUtils';

export class HomePage {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }

  async open() {
    const url = 'https://alpha.cofe.dxl.com/';

    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (error) {
      console.log('HomePage.open: domcontentloaded failed, retrying with load', error);
      await this.page.goto(url, { waitUntil: 'load', timeout: 60000 });
    }

    const currentUrl = this.page.url();
    if (currentUrl === 'about:blank' || currentUrl === '') {
      throw new Error(`Navigation to ${url} returned a blank page.`);
    }
  }

  async acceptCookies() {
    await this.page.waitForLoadState('domcontentloaded');
    const cookiesLoc = await autoWaitFor(this.page, '#onetrust-accept-btn-handler', [
      '#onetrust-accept-btn-handler',
      'button:has-text("Accept")',
      'button:has-text("Accept All Cookies")',
      '[id*="onetrust"] button'
    ], { timeout: 60000 }).catch(() => null);

    if (cookiesLoc) {
      await safeClick(this.page, cookiesLoc).catch(() => {});
      await this.page.locator('.onetrust-pc-dark-filter').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    }
  }

  async goToLogin() {
    // 1. Click the Account/Guest button (uses the 'title="Account"' attribute from your HTML)
    const accountBtn = this.page.getByRole('button', { name: /Account|Hi Guest/i });
    await accountBtn.waitFor({ state: 'visible' });
    await accountBtn.click();

    // 2. Click the Sign In link that appears in the dropdown
    const modalSignInBtn = this.page.getByRole('button', { name: 'Sign In', exact: true });
    await modalSignInBtn.waitFor({ state: 'visible' });
    await modalSignInBtn.click();
  }

  async selectMystore() {
    // 1. Click 'Set Location' and wait for the modal
    const setLocationBtn = this.page.getByRole('button', { name: /My Store/i });
    await setLocationBtn.waitFor({ state: 'visible', timeout: 20000 });
    await setLocationBtn.scrollIntoViewIfNeeded();
    await setLocationBtn.click();

    // 2. Fill the input field
    const searchInput = this.page.getByRole('textbox', { name: 'City, State or Zip Code*' });
    await searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await searchInput.clear();
    await searchInput.fill('dedham');

    // 3. Select distance and click search
    await this.page.getByLabel('Distance in Miles*').selectOption('200');
    const findStoresBtn = this.page.getByRole('button', { name: 'Find Stores' });
    await findStoresBtn.waitFor({ state: 'visible', timeout: 10000 });
    await findStoresBtn.click();

    // 4. Wait for store results to appear instead of hardcoded 3-second delay
    const setMyStoreBtn = this.page.getByRole('button', { name: 'Set as My Store' }).first();
    await setMyStoreBtn.waitFor({ state: 'visible', timeout: 15000 });

    // 5. Bring keyboard focus to bypass chat bubble overlay
    await setMyStoreBtn.scrollIntoViewIfNeeded();
    await setMyStoreBtn.focus();
    await this.page.keyboard.press('Enter');

    // 6. Wait for modal to close
    await this.page.waitForTimeout(500);
  }

  async openCategory(categoryName: string, subCategoryHref: string) {
    const catItem = await autoWaitFor(this.page, `[role="menuitem"]:has-text("${categoryName}")`, [
      `[role="menuitem"]:has-text("${categoryName}")`,
      `a:has-text("${categoryName}")`
    ]);
    await catItem.hover();

    const subCatItem = await autoWaitFor(this.page, `a[href="${subCategoryHref}"]`, [
      `a[href="${subCategoryHref}"]`,
      `a[href*="${subCategoryHref}"]`
    ]);
    await subCatItem.click();
    await this.page.waitForURL(/\/c\//, { timeout: 30000 });
  }
}
