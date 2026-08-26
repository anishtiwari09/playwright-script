// pages/PDPPage.ts
import { Page, expect } from '@playwright/test';
export class checkoutForm {
    constructor(private page: Page) {}

    async goToCheckoutFromDrawer() {
        const drawer = this.page.locator('[role="dialog"]');
        await expect(drawer).toBeVisible({ timeout: 15000 });
        const checkoutBtn = drawer.getByRole('button', { name: /checkout/i });
        await checkoutBtn.waitFor({ state: 'visible', timeout: 20000 });
        await checkoutBtn.scrollIntoViewIfNeeded();
        
        await Promise.all([
            this.page.waitForURL(/.*\/checkout.*/, { timeout: 30000 }),
            checkoutBtn.click()
        ]);
    }
}
