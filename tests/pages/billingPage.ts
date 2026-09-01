import { Page, expect, Locator } from '@playwright/test';



export class BillingPage {
    
    constructor(private page: Page) { }


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

    async waitForBillingPage() {

    await this.page.waitForURL('**/checkout?step=billing**', { timeout: 60000 });
    const paymentHeader = this.page.locator('p[aria-label="Payment Method"]');
    await expect(paymentHeader).toBeVisible({ timeout: 30000 });
    await expect(this.page).toHaveURL(/step=billing/);
    
    // 3. Complete structural state syncing
    //await this.page.waitForLoadState('domcontentloaded');
    }

    async enterCVVAndPlaceOrder(workerIndex: number) {

    const cvvs = ['123', '111', '222', '333'];
    const uniqueCVV = cvvs[workerIndex % cvvs.length];
    
    const cvvInput = this.page.locator('#securityCode'); 
    await cvvInput.waitFor({ state: 'visible'});
    
    await cvvInput.fill(uniqueCVV);
    await cvvInput.blur();
    await expect(cvvInput).toHaveValue(uniqueCVV);
    console.log(`Worker ${workerIndex} using unique CVV: ${uniqueCVV}`);


  }

async fillCreditCardDetails(workerIndex: number = 0) {
    const paymentContainer = this.page.locator('p[aria-label="Payment Method"]');
    await paymentContainer.waitFor({ state: 'visible' });

    // FIX: Locate the iframe container first, then find the input inside it
    // Adjust '#cardNumber-container' if your HTML container has a different ID
    const cardFrame = this.page.locator('#number-container').frameLocator('iframe');
    await cardFrame.locator('#number').waitFor({ state: 'visible' });
    await cardFrame.locator('#number').fill('4111111111111111');

    const expiryInput = this.page.locator('#expiryDate');
    await expiryInput.click();
    await expiryInput.fill('12/32');

    const cvvFrame = this.page.locator('#securityCode-container').frameLocator('iframe');
    const cvvInput = cvvFrame.locator('#securityCode');
    await cvvInput.waitFor({ state: 'visible' });
    await cvvInput.fill('123');

    const nameInput = this.page.locator('#creditCardUserName');
    await nameInput.scrollIntoViewIfNeeded();
    await nameInput.fill(`Deepak Worker${workerIndex}`);

    await expect(cardFrame.locator('#number')).toHaveValue('4111111111111111');
    await expect(expiryInput).toHaveValue('12/32');
    await expect(cvvInput).toHaveValue('123');
    await expect(nameInput).toHaveValue(`Deepak Worker${workerIndex}`);
}


    async fillBillingAddress() {

        await this.page.locator('#first_name').fill('Deepak');
        await this.page.locator('#last_name').fill('Patel');

        const addressInput = this.page.locator('input[name="street_name"]')
        await addressInput.scrollIntoViewIfNeeded();
        await addressInput.click();
        await this.page.waitForTimeout(500);
        await addressInput.pressSequentially('1 New York St', { delay: 100 });
        const suggestion = this.page.locator('.pac-container, [role="listbox"]').filter({ hasText: /04462|Millinocket/i }).first();
        await this.page.waitForTimeout(2000);
  
    const zipInput = this.page.locator('input[name="postcode"]');
    if (await zipInput.inputValue() === '') {
        await this.page.locator('select[name="state"]').selectOption({ value: 'ME' }); // Or 'AK'
        await this.page.locator('input[name="city"]').fill('Kotzebue');
        await zipInput.fill('04462');
    }
    const phoneInput = this.page.locator('input[name="phone_number"]');
    await phoneInput.scrollIntoViewIfNeeded();
    await phoneInput.fill('9986292867');
    await expect(this.page.locator('#first_name')).toHaveValue('Deepak');
    await expect(this.page.locator('#last_name')).toHaveValue('Patel');
    await expect(addressInput).toHaveValue('1 New York St');
    await expect(zipInput).toHaveValue('04462');
    await expect(phoneInput).toHaveValue(/998[\-\s]?629[\-\s]?2867/);
    }
    async selectPayPal() {

        // 1. Ensure the container section is fully visible and ready
    const paymentContainer = this.page.locator('text=Payment Method');
    await paymentContainer.waitFor({ state: 'visible' });

    // 2. Click the image element directly—Playwright fires the pointer event exactly in its bounds
    await this.page.locator('img[alt="Paypal"]').click();

    // 3. Verify the underlying state updates
    await expect(this.page.locator('input[value="paypal"]')).toBeChecked();


    }


    async selectPayPalAndOpenPopup(email: string, pass: string) {
        await this.selectPayPal();


const payPalPopupPromise = this.page.context().waitForEvent('page');

await this.page
  .locator('iframe[name*="zoid__paypal_buttons"]')
  .contentFrame()
  .getByRole('link', { name: 'Pay with PayPal' })
  .click();

const payPalPopup = await payPalPopupPromise;

await payPalPopup.waitForLoadState('networkidle');

console.log('Starting PayPal Login...');

const emailField = payPalPopup.locator('#email');
await emailField.waitFor({ state: 'visible', timeout: 30000 });
await emailField.fill(email);

const nextBtn = payPalPopup.locator('#btnNext');
await nextBtn.waitFor({ state: 'visible', timeout: 15000 });
await nextBtn.scrollIntoViewIfNeeded();
await nextBtn.click();

const passField = payPalPopup.locator('#password');
await passField.waitFor({ state: 'visible', timeout: 30000 });
await passField.fill(pass);

const loginBtn = payPalPopup.locator('#btnLogin');
await loginBtn.waitFor({ state: 'visible', timeout: 15000 });
await loginBtn.scrollIntoViewIfNeeded();
await loginBtn.click();
        const shipAddress = payPalPopup.locator('[data-testid="ship-to-address"], #shippingAddress, .shipping-address');
        await shipAddress.first().waitFor({ state: 'visible', timeout: 30000 });

        const continueBtn = payPalPopup.getByTestId('submit-button-initial');
        await continueBtn.waitFor({ state: 'visible', timeout: 20000 });
        await continueBtn.scrollIntoViewIfNeeded();
        await continueBtn.click();
        return payPalPopup;


    }

    async applyGiftCard(code: string) {
        const giftInput = this.page.locator('input[name="giftCardNumber"]');
        if (await giftInput.isVisible()) {
            await giftInput.fill(code);
            await this.page.click('button#apply-gift-card');
        }
    }

    async verifyReviewAndPlaceOrder() {
        const reviewBtn = this.page.getByRole('button', { name: /Review your order/i });

        await reviewBtn.scrollIntoViewIfNeeded();
        await expect(reviewBtn).toBeVisible();
        await expect(reviewBtn).toBeEnabled();
        await reviewBtn.click({ force: true });
    }
    async placeOrder() {

        const placeOrderBtn = this.page.getByRole('button', { name: /Place Your Order/i }).nth(0);
        await placeOrderBtn.waitFor({ state: 'visible', timeout: 30000 });
        await expect(placeOrderBtn).toBeEnabled();
        await placeOrderBtn.scrollIntoViewIfNeeded();

        await Promise.all([

            this.page.waitForURL('**/success**', { timeout: 100000 }),
            this.safeClick(placeOrderBtn)
        ]);


    }



    //Afterpay

    async selectafterPay() {

        const afterPayLogo = this.page.locator('img[alt="AfterPay"]');
        await afterPayLogo.waitFor({ state: 'visible' });
        await expect(afterPayLogo).toBeVisible();
        const afterPayOption = this.page.getByLabel('AfterPay payment method');
        await afterPayOption.click();
        await expect(afterPayOption).toBeVisible();

    }

    async selectAfterpayAndOpenPopup(email: string, pass: string) {
        await this.selectafterPay();

        const afterPayButton = this.page.locator('#afterpay-express-button');
        await expect(afterPayButton).toBeVisible();

        const [afterPayPopup] = await Promise.all([
            this.page.context().waitForEvent('page'),
            afterPayButton.click()
        ]);

        // Wait for the popup to be ready
        await afterPayPopup.waitForLoadState('load');
        console.log('Starting Afterpay Login...');

        const emailInput = afterPayPopup.getByTestId('login-identity-input');

        await emailInput.waitFor({ state: 'visible', timeout: 30000 });
        await emailInput.fill(email);

        const continueBtn = afterPayPopup.getByRole('button', { name: /Continue/i });
        await continueBtn.waitFor({ state: 'visible', timeout: 30000 });
        await continueBtn.click();
        const passInput = afterPayPopup.locator('input[type="password"], #password-input');
        await passInput.waitFor({ state: 'visible', timeout: 80000 });
        await passInput.fill(pass);

        const logContButton = afterPayPopup.getByRole('button', { name: /Continue/i });
        await logContButton.waitFor({ state: 'visible', timeout: 30000 });
        await afterPayPopup.waitForTimeout(300);
        await logContButton.click();

        const confirmBtn = afterPayPopup.getByRole('button', { name: /Confirm/i });
        await confirmBtn.waitFor({ state: 'visible', timeout: 20000 });
        await confirmBtn.click();
        await afterPayPopup.waitForEvent('close').catch(() => console.log('Afterpay window closed automatically.'));
        await this.page.waitForURL(url => url.href.includes('step=billing'), {
            timeout: 30000
        });

        await this.page.waitForURL(/.*step=billing.*/, { waitUntil: 'commit', timeout: 30000 });
    }
    async AfterpayreviewAndPlaceOrder() {
        const reviewOrderBtn = this.page.getByRole('button', { name: /Review Your Order/i });
        await reviewOrderBtn.waitFor({ state: 'visible', timeout: 40000 });
        await expect(reviewOrderBtn).toBeVisible();
        await expect(reviewOrderBtn).toBeEnabled();
        await reviewOrderBtn.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await reviewOrderBtn.click();
        await this.page.waitForURL(/.*step=review.*/, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const AftPayplaceOrderBtn = this.page.getByRole('button', { name: /Place Your Order/i }).nth(0);
        await AftPayplaceOrderBtn.waitFor({ state: 'visible', timeout: 30000 });
        await expect(AftPayplaceOrderBtn).toBeEnabled();
        await AftPayplaceOrderBtn.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await AftPayplaceOrderBtn.click();

    }


}
