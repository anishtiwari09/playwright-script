import { Page, expect, Locator } from '@playwright/test';

export class ExpCheckoutPage {

    private async safeClick(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.scrollIntoViewIfNeeded();
        try {

            await locator.click({ timeout: 10000 });
        } catch (error) {
            // If blocked by an overlay, force the click
            console.log("Standard click failed, attempting force click...");
            await locator.click({ force: true });
        }
    }

    readonly payPalIframe;
    readonly payPalButton;



    constructor(private page: Page) {
        // Initialize them here after 'page' is ready
        this.payPalIframe = this.page.frameLocator('iframe[name*="__zoid__paypal_buttons__"]');
        this.payPalButton = this.payPalIframe.locator('.paypal-buttons');
    }

    async selectPayPal(email: string, pass: string) {
      const frame = this.page.frameLocator(
  'iframe[name*="__zoid__paypal_buttons__"]'
)

const paypalBtn = frame.locator(
  'div[role="link"][data-funding-source="paypal"]'
)

        await paypalBtn.waitFor({ state: 'visible', timeout: 30000 });
        await expect(paypalBtn).toBeVisible();
        const [payPalPopup] = await Promise.all([this.page.context().waitForEvent('page'), paypalBtn.click()]);
        await payPalPopup.waitForLoadState('networkidle');
        console.log('Starting PayPal Login...');
        const emailField = payPalPopup.getByPlaceholder('Email or mobile number');
        await emailField.waitFor({ state: 'visible', timeout: 30000 });
        await emailField.click();
        await emailField.fill(email);
        const nextButton = payPalPopup.getByRole('button', { name: /Next/i });
        await nextButton.waitFor({ state: 'visible', timeout: 10000 });
        await nextButton.scrollIntoViewIfNeeded();
        await nextButton.click();
        const passField = payPalPopup.getByPlaceholder('Password');
        await passField.waitFor({ state: 'visible', timeout: 30000 });
        await passField.click();
        await passField.fill('');
        await passField.fill(pass);
        const loginBtn = payPalPopup.getByRole('button', { name: /Log In|Log In/i });
        await loginBtn.waitFor({ state: 'visible', timeout: 10000 });
        await loginBtn.scrollIntoViewIfNeeded();
        await loginBtn.click();
        const shipAddress = payPalPopup.locator('[data-testid="ship-to-address"], #shippingAddress, .shipping-address');
        await shipAddress.first().waitFor({ state: 'visible', timeout: 30000 });

        const continueBtn = payPalPopup.getByRole('button', { name: /Review Order/i });
        await continueBtn.waitFor({ state: 'visible', timeout: 20000 });
        await expect(continueBtn).toBeVisible();
        await continueBtn.scrollIntoViewIfNeeded();
        await continueBtn.click();
        return payPalPopup;

    }

    async selectAfterpayAndOpenPopup(email: string, pass: string) {
        const afterPayLogo = this.page.getByRole('img', {name: /afterpay/i});
        await afterPayLogo.waitFor({ state: 'visible', timeout: 30000 });
        const [afterPayPopup] = await Promise.all([this.page.context().waitForEvent('page'), afterPayLogo.click()]);

        console.log('Starting Afterpay Login...');

        const emailInput = afterPayPopup.getByTestId('login-identity-input');

        await emailInput.waitFor({ state: 'visible', timeout: 30000 });
        await expect(emailInput).toBeVisible();
        await emailInput.fill(email);

        const continueBtn = afterPayPopup.getByRole('button', { name: /Continue/i });
        await continueBtn.waitFor({ state: 'visible', timeout: 30000 });
        await continueBtn.click();
        const passInput = afterPayPopup.locator('input[type="password"], #password-input');
        await passInput.waitFor({ state: 'visible', timeout: 80000 });
        await passInput.fill(pass);
        await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
        await continueBtn.scrollIntoViewIfNeeded();
        await afterPayPopup.waitForTimeout(300);
        await continueBtn.click();

        const deliveryLabel = await afterPayPopup.locator('label').filter({ hasText: 'Standard Delivery' });
        await deliveryLabel.waitFor({ state: 'visible', timeout: 30000 });
        await deliveryLabel.click();
        const logContButton = afterPayPopup.getByRole('button', { name: /Continue/i });
        await logContButton.waitFor({ state: 'visible', timeout: 10000 });
        await logContButton.scrollIntoViewIfNeeded();
        await afterPayPopup.waitForTimeout(300);
        await logContButton.click();


    }
    async AfterpayreviewAndPlaceOrder() {
        await this.page.waitForURL(/.*step=review.*/, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const AftPayplaceOrderBtn = this.page.getByRole('button', { name: /Place Your Order/i }).nth(0);
        await AftPayplaceOrderBtn.waitFor({ state: 'visible', timeout: 30000 });
        await expect(AftPayplaceOrderBtn).toBeEnabled();
        await AftPayplaceOrderBtn.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await AftPayplaceOrderBtn.click();

    }


    async placeOrder() {

        await this.page.waitForURL(/.*step=review.*/, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const placeOrderBtn = this.page.getByRole('button', { name: /Place Your Order/i }).nth(0);
        await placeOrderBtn.waitFor({ state: 'visible', timeout: 30000 });
        await expect(placeOrderBtn).toBeEnabled();
        await placeOrderBtn.scrollIntoViewIfNeeded();
        await Promise.all([this.page.waitForURL('**/success**', { timeout: 100000 }), this.safeClick(placeOrderBtn)]);


    }
}