import { Page , expect} from '@playwright/test';
import { recoverOutOfStock } from '../utils/outOfStockRecovery';
import { autoFill, autoWaitFor, autoClick } from '../utils/autoHeal';

type AddressData = {
  email: string;
  firstName: string;
  lastName: string;
  streetName: string;
  city: string;
  state: string;
  postcode: string;
  phoneNumber: string;
};

export class CheckoutPage {
  constructor(private page: Page) {}

  async waitForCheckoutPage() {
    await this.page.waitForURL('**/checkout', { timeout: 600000 });
    await expect(this.page.locator('body')).toContainText('$', { timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillAddressForm(addressType: string, email: string, address: AddressData) {
    const emailInput = await autoWaitFor(this.page, '#email', ['input[name="email"]', 'input[type="email"]']);
    await emailInput.fill(email);
    await expect(emailInput).toHaveValue(email);
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');

    // First Name, Last Name
    const firstNameInput = await autoWaitFor(this.page, '#first_name', ['input[name="firstName"]', 'input[name="first_name"]']);
    await firstNameInput.fill(address.firstName);

    const lastNameInput = await autoWaitFor(this.page, '#last_name', ['input[name="lastName"]', 'input[name="last_name"]']);
    await lastNameInput.fill(address.lastName);

    // Street Name
    const addressInput = await autoWaitFor(this.page, 'input[name="street_name"]', [
      'input[name="street_name"]',
      '#street_name',
      'input[name="address1"]',
      '#address'
    ]);
    await addressInput.scrollIntoViewIfNeeded();
    await addressInput.click();
    await addressInput.fill(address.streetName);

    // City
    const cityInput = await autoWaitFor(this.page, 'input[name="city"]', ['#city', 'input[name="cityName"]']);
    await cityInput.click();
    await cityInput.fill(address.city);

    // State
    const stateSelect = await autoWaitFor(this.page, 'select[name="state"]', ['#state', 'select']).catch(() => null);
    if (stateSelect) {
      await stateSelect.selectOption({ value: address.state }).catch(() => {});
    }

    // Zip Code
    const zipInput = await autoWaitFor(this.page, 'input[name="postcode"]', [
      'input[name="postcode"]',
      '#postcode',
      'input[name="zip"]',
      '#zip'
    ]);
    await zipInput.scrollIntoViewIfNeeded();
    await zipInput.click();
    await zipInput.fill(address.postcode);

    // Phone Number
    const phoneInput = await autoWaitFor(this.page, 'input[name="phone_number"]', [
      'input[name="phone_number"]',
      '#phone_number',
      'input[type="tel"]',
      '#phone'
    ]);
    await phoneInput.scrollIntoViewIfNeeded();
    await phoneInput.click();
    await phoneInput.fill(address.phoneNumber);
    await phoneInput.press('Tab');
    await this.page.waitForTimeout(500);

    // Ensure Zip Code is retained; if a site event cleared it, fill again
    const expectedZip = address.postcode.split('-')[0];
    if ((await zipInput.inputValue()).trim() === '') {
      console.log(`Zip Code was reset by page script, re-filling ${address.postcode}...`);
      await zipInput.click();
      await zipInput.fill(address.postcode);
      await zipInput.press('Tab');
    }

    // Ensure Phone Number is retained; if a site event cleared it, fill again
    if ((await phoneInput.inputValue()).trim() === '') {
      console.log(`Phone Number was reset by page script, re-filling ${address.phoneNumber}...`);
      await phoneInput.click();
      await phoneInput.fill(address.phoneNumber);
      await phoneInput.press('Tab');
    }

    // Assertions to verify full address completeness
    await expect(firstNameInput).toHaveValue(address.firstName);
    await expect(lastNameInput).toHaveValue(address.lastName);
    await expect(addressInput).toHaveValue(address.streetName);
    await expect(cityInput).toHaveValue(address.city);

    const phoneDigits = address.phoneNumber.replace(/\D/g, '');
    const phonePattern = new RegExp(phoneDigits.split('').join('[\\-\\s]?'));

    await expect(zipInput).toHaveValue(new RegExp(expectedZip), { timeout: 10000 });
    await expect(phoneInput).toHaveValue(phonePattern, { timeout: 10000 });
  }

async selectSts(email: string) {
    const emailInput = this.page.locator('input[name="email"]');
    const stsToggle = this.page.locator('.chakra-checkbox__control');

    try {
        await emailInput.fill(email, { timeout: 5000 });
        await this.page.keyboard.press('Tab');
        console.log('Guest email filled.');
    } catch (e) {
        console.log('Email field not found; proceeding as Logged-in user.');
    }

    // 2. Handle STS Toggle with Chakra UI
    // Ensure the toggle is visible before checking state
    await stsToggle.waitFor({ state: 'visible' });
    
    // Check if the toggle is ALREADY active to prevent unchecking it
    const isChecked = await stsToggle.getAttribute('data-checked');
    if (isChecked === null) {
        await stsToggle.click();
        console.log('STS toggle activated.');
    }

    await expect(stsToggle).toBeVisible();
    await expect(stsToggle).toHaveClass(/chakra-checkbox__control/);
}

  private async refreshStsToggleCycle() {
    const stsToggle = this.page.locator('.chakra-checkbox__control');
    if (await stsToggle.count() === 0) return;

    await stsToggle.waitFor({ state: 'visible', timeout: 20000 });
    const currentlyChecked = await stsToggle.getAttribute('data-checked') !== null;

    if (currentlyChecked) {
      await stsToggle.click();
      await this.page.waitForTimeout(500);
    }

    const nowUnchecked = await stsToggle.getAttribute('data-checked') === null;
    if (nowUnchecked) {
      await stsToggle.click();
      await this.page.waitForTimeout(1500);
    }

    await this.page.locator('.chakra-spinner, [data-loading="true"], .loading, .spinner').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }



  async selectShippingAndContinue(): Promise<boolean> {
    const shippingContainer = this.page.getByLabel('shipping-options');
    const firstShippingMethod = shippingContainer.getByRole('button').first();

    await this.page.locator('.chakra-spinner, [data-loading="true"], .loading, .spinner').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});

    try {
      await firstShippingMethod.waitFor({ state: 'visible', timeout: 60000 });
    } catch (error) {
      console.log('Shipping method not visible; refreshing STS toggle and retrying.', error);
      await this.refreshStsToggleCycle();
      await firstShippingMethod.waitFor({ state: 'visible', timeout: 60000 });
    }

    await firstShippingMethod.scrollIntoViewIfNeeded();
    try {
      await firstShippingMethod.click();
    } catch (error) {
      console.log('Shipping method click failed; retrying with force.', error);
      await firstShippingMethod.click({ force: true });
    }

    await this.page.locator('.chakra-spinner, [data-loading="true"], .loading, .spinner').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
    await this.page.waitForTimeout(800);

    let continueToPaymentBtn = this.page.getByRole('button', { name: /continue to payment/i }).first();
    if (await continueToPaymentBtn.count() === 0) {
      continueToPaymentBtn = this.page.locator('button:has-text("Continue to Payment")').first();
    }

    await continueToPaymentBtn.waitFor({ state: 'visible', timeout: 60000 });
    await continueToPaymentBtn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);

    if (!(await continueToPaymentBtn.isEnabled())) {
      console.log('Continue to Payment button not enabled; waiting one more second.');
      await this.page.waitForTimeout(5000);
    }

    await expect(continueToPaymentBtn).toBeEnabled();
    try {
      await continueToPaymentBtn.click();
    } catch (error) {
      console.log('Continue to Payment click failed; retrying with force', error);
      await continueToPaymentBtn.click({ force: true });
    }

    // After clicking Continue to Payment the app may show an out-of-stock modal.
    // Use the shared util to detect and recover; if recovered return false so caller retries.
    try {
      if (await recoverOutOfStock(this.page)) return false;
    } catch (e) {
      // ignore and proceed
    }

    return true;
  }


async selectEXPayPal() {
  const frame = this.page.frameLocator('iframe[name*="paypal"]');

  const paypalLink = frame.getByRole('link', { name: /paypal/i });

  await expect(paypalLink).toBeVisible({ timeout: 20000 });

  await paypalLink.click();
}

}
