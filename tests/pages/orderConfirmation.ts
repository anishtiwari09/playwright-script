import { Page, expect } from '@playwright/test';

export class ConfirmationPage {
    constructor(private page: Page) {}
    async ConfirmationPage() {
    await this.page.waitForURL('**/success', { timeout: 60000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

    async verifyOrderSuccess() {
       
        await expect(this.page).toHaveURL(/\/success/, { timeout: 60000 });
       
        const thankYouMsg = this.page.getByText(/Thank you for your order!/i);
        await expect(thankYouMsg).toBeVisible({ timeout: 70000 });

        
        const orderIdLocator = this.page.getByText(/Your order number is/i);
        await expect(orderIdLocator).toBeVisible();
        
        const fullText = await orderIdLocator.innerText();
        const orderId = fullText.split('is ')[1];
        console.log(`Successfully placed order: ${orderId}`);
        return orderId;
    }
}