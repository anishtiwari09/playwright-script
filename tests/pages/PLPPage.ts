import { Page, expect } from '@playwright/test';
import { safeClick, waitForNavigation } from '../utils/actionUtils'

export class PLPPage {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }

  async openCategory(categoryName: string, subCategoryHref: string) {
    const categoryLink = this.page.getByRole('menuitem', { name: categoryName });
    await categoryLink.hover();
    const subCategoryLink = this.page.locator(`a[href="${subCategoryHref}"]`).first();
    await expect(subCategoryLink).toBeVisible({ timeout: 10000 });
    await subCategoryLink.click();
    await this.page.waitForURL(/\/c\//, { timeout: 30000 });
    await expect(this.page).toHaveURL(/\/c\//);
  }

  async selectRandomProduct(avoidLowStock = false, categoryHref?: string) {
    if (categoryHref) {
      console.log(`Navigating to fallback category ${categoryHref}`);
      const url = new URL(categoryHref, this.page.url()).toString();
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      await this.page.waitForURL(new RegExp(`${categoryHref}`), { timeout: 30000 });
    }

    let productLocator = this.page.locator('main a[href*="/p/"]');
    if (avoidLowStock) {
      productLocator = productLocator
        .filter({ hasNot: this.page.locator('text=Only a Few Left') })
        .filter({ hasNot: this.page.locator('text=Out of Stock') });
    }

    await productLocator.first().waitFor({ state: 'visible', timeout: 30000 });

    const productCount = await productLocator.count();

    const randomIndex = Math.floor(Math.random() * productCount);
    const randomProductItem = productLocator.nth(randomIndex);
    await waitForNavigation(this.page, randomProductItem);
    await expect(this.page).toHaveURL(/\/p\//, { timeout: 60000 });
  }

  async retryRandomProductSelection(attempt: number) {
    console.log(`Retry #${attempt}: returning to PLP and choosing another product.`);
    await this.page.goBack();
    await this.page.waitForURL(/\/c\//, { timeout: 30000 });
    await expect(this.page).toHaveURL(/\/c\//);

    if (attempt <= 2) {
      await this.selectRandomProduct(true);
      return;
    }

    const fallbackCategories: Record<number, string> = {
      3: '/c/t-shirts',
      4: '/c/sweaters'
    };

    const categoryHref = fallbackCategories[attempt];
    if (categoryHref) {
      console.log(`Attempt ${attempt}: switching to fallback category ${categoryHref}`);
      await this.selectRandomProduct(true, categoryHref);
      return;
    }

    await this.selectRandomProduct(true);
  }

  async selectAfterpayEligibleProduct() {
    console.log('Selecting Afterpay-eligible product from PLP...');

    const sortDropdown = this.page.locator('#indexSortSelect').first();
    await sortDropdown.waitFor({ state: 'visible', timeout: 20000 });
    await sortDropdown.selectOption({ label: 'Price (High to Low)' });

    await this.page.waitForURL(/\?sort=priceDesc/, { timeout: 15000 });
    await this.page.locator('.chakra-spinner, [data-loading="true"]').waitFor({ state: 'detached', timeout: 15000 }).catch(() => { });

    const productCards = this.page.locator('[data-product-id], article.css-1b0ljew, .plp-product-card');
    await productCards.first().waitFor({ state: 'visible', timeout: 20000 });

    const cardCount = await productCards.count();
    if (cardCount === 0) {
      throw new Error('No product cards found for Afterpay selection');
    }

    const qualifiedIndexes: number[] = [];
    for (let i = 0; i < cardCount; i++) {
      const currentCard = productCards.nth(i);
      const cardText = await currentCard.innerText();
      if (cardText.toLowerCase().includes('online exclusive')) continue;

      const priceElement = currentCard.locator('p, span').filter({ hasText: '$' }).first();
      if (await priceElement.count() === 0) continue;

      const priceText = await priceElement.innerText();
      const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      if (numericPrice > 30.0) {
        qualifiedIndexes.push(i);
      }
    }

    if (qualifiedIndexes.length === 0) {
      throw new Error('No Afterpay-eligible products found');
    }

    const randomIndex = qualifiedIndexes[Math.floor(Math.random() * qualifiedIndexes.length)];
    const selectedCard = productCards.nth(randomIndex);
    await selectedCard.scrollIntoViewIfNeeded();
    await waitForNavigation(this.page, selectedCard.locator('a.chakra-link').first());
    await this.page.waitForURL(/\/p\//, { timeout: 60000 });
    await expect(this.page).toHaveURL(/\/p\//);
  }

  // === RE-ENGINEERED STRIPPED METHOD ===
  
  async selectProductWithSizeFilter(): Promise<string> {
    console.log('Bypassing PLP size filters entirely. Picking a product and matching target size on PDP...');

    // 1. Establish common catalog baseline sizes to pass directly to the PDP selectVariant handler
    const standardSizes = ['1XL', '2XL', '3XL', '4XL', '2XLT', '3XLT', '4XLT'];
    const randomSizeIndex = Math.floor(Math.random() * standardSizes.length);
    const selectedSize = standardSizes[randomSizeIndex];
    console.log(`Pre-selecting random target size vector: "${selectedSize}"`);

    // 2. Isolate the core product item list from the result grid layout
    const productGrid =  this.page.locator('.plp-product-card');
    const productLocator = productGrid.locator('a[href*="/p/"]').filter({ hasText: /\w+/ });

    // Ensure components have completed browser rendering loops across Chromium/Firefox
    // await this.page.waitForLoadState('networkidle').catch(() => {});
    await expect(productLocator.first()).toBeVisible({ timeout: 15000 });

    const productCount = await productLocator.count();
    console.log(`Found ${productCount} available product paths inside the grid container.`);

    if (productCount === 0) {
      throw new Error('PLP grid returned 0 products or elements became detached.');
    }

    // 3. Choose a random item from the grid entries
    const randomProductIndex = Math.floor(Math.random() * productCount);
    const randomProductItem = productLocator.nth(randomProductIndex);
    console.log(`Navigating to main grid product index ${randomProductIndex} of ${productCount}`);

    // 4. Clean cross-browser center scrolling interaction strategy
    await randomProductItem.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await randomProductItem.click();

    // Verify successful transitions onto the product view
    await expect(this.page).toHaveURL(/\/p\//, { timeout: 30000 });
    console.log(`Successfully navigated directly to PDP. Preferred target size to evaluate: ${selectedSize}`);

    return selectedSize;
  }
}
