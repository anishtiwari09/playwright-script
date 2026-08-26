import { test as base, expect } from '@playwright/test';
import accountData from '../data/accounts.json';
import testData from '../data/testData.json';
import { changeCountryToUS } from '../utils/changeCountry';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/loginPage';
import { PDPPage } from '../pages/PDPPage';
import { PLPPage } from '../pages/PLPPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { BillingPage } from '../pages/billingPage';
import { ExpCheckoutPage } from '../pages/expCheckout';
import { ConfirmationPage } from '../pages/orderConfirmation';

export type CheckoutOptions = {
    addressType: 'Standard' | 'POBox' | 'US Outlying' | 'STS'; isLoggedIn?: boolean; paymentMethod?: 'Standard' | 'Afterpay';
}

type MyFixtures = {
    checkoutReady: void;
    isPaypalLoginRequired: boolean;
    expressPaypalReady: void;
    expressAfterPayReady: void;
    checkoutOptions: CheckoutOptions;
    checkoutLoggedInReady: void;
    plp: PLPPage;
    pdp: PDPPage;
    checkoutPage: CheckoutPage;
    billingPage: BillingPage;
    expCheckout: ExpCheckoutPage;
    confirmationPage: ConfirmationPage;
};

const testAccounts = accountData.accounts;

export const test = base.extend<MyFixtures>({
    checkoutOptions: [{ addressType: 'Standard', isLoggedIn: false, paymentMethod: 'Standard' }, { option: true }],
    isPaypalLoginRequired: [false, { option: true }],


    checkoutReady: async ({ page, context, checkoutOptions  }, use, testInfo) => {
        test.setTimeout(300_000);
        await context.clearCookies().catch(() => {});
        try {



        const home = new HomePage(page);
        const loginPage = new LoginPage(page);
        const plp = new PLPPage(page);
        const pdp = new PDPPage(page);
        const checkoutPage = new CheckoutPage(page);
        const { addressType, isLoggedIn, paymentMethod  } = checkoutOptions;

        // 1. Open home page natively
        console.log(`Worker ${testInfo.workerIndex}: navigating to home page`);
        try {
            await home.open();
            console.log(`Worker ${testInfo.workerIndex}: home opened successfully`);
        } catch (err) {
            console.error(`Worker ${testInfo.workerIndex}: home.open failed`, err);
            try {
                const screenshotPath = `test-results/home-open-fail-${testInfo.workerIndex}-${Date.now()}.png`;
                await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
                console.log('Saved screenshot to', screenshotPath);
            } catch (screenshotErr) {
                console.error('Failed to capture screenshot after home.open failure', screenshotErr);
            }
            throw err;
        }


        //Using modulo (%) ensures it wraps around if we have more workers than accounts
        const accountIndex = testInfo.workerIndex % testAccounts.length;
        const currentAccount = testAccounts[accountIndex];

        // 2. Clear state strictly after domain is established to avoid SecurityError
        await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });

        await home.acceptCookies();

        // 3. Force US state via UI
        await changeCountryToUS(page);

        // 4. Force US state via Storage fallback
        await page.evaluate(() => {
            localStorage.setItem('country', 'US');
            localStorage.setItem('currency', 'USD');
        });

        //await home.goToLogin();

        if (checkoutOptions.isLoggedIn) {
            console.log(`Worker ${testInfo.workerIndex} logging in with: ${currentAccount.email}`);
            await home.goToLogin(); // Navigates to login page
            await loginPage.login(currentAccount.email, currentAccount.pass);
        }

        // Only select store for STS (Store To Ship) checkout
        if (addressType === 'STS') {
            await home.selectMystore();
        }

        // 5. Navigate to PLP
        await page.getByRole('menuitem', { name: 'SHIRTS' }).hover();
        const graphicTeesLink = page.locator('a[href="/c/graphic-tees"]').first();
        await graphicTeesLink.waitFor({ state: 'visible', timeout: 15000 });
        await graphicTeesLink.click();

        await page.waitForURL(/\/c\//);


        // DYNAMIC PRODUCT SELECTION LOGIC
        if (paymentMethod === 'Afterpay') {
            console.log('Afterpay mode: Sorting PLP from High to Low and picking a random eligible item...');

            const sortDropdown = page.locator('#indexSortSelect').first();
            await sortDropdown.waitFor({ state: 'visible' });
            await sortDropdown.selectOption({ label: 'Price (High to Low)' });

            //Wait for the URL parameters to cleanly reflect the sort change
            await page.waitForURL(/\?sort=priceDesc/, { timeout: 15000 });

            //Wait for any active Chakra skeleton loading screens to disappear
            await page.locator('.chakra-spinner, [data-loading="true"]').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});

            //Target the product container cards via explicit class names or raw article blocks
            const productCards = page.locator('[data-product-id], article.css-1b0ljew, .plp-product-card');

            //Force Playwright to actively wait until the first new card is visible and attached to the DOM
            await page.waitForFunction(() => {
                const cards = document.querySelectorAll('[data-product-id], article.css-1b0ljew, .plp-product-card');
                return cards.length > 0;
            }, { timeout: 20000 }).catch(() => {});

            const cardCount = await productCards.count();
            console.log(`Grid successfully hydrated. Parsing through ${cardCount} available product cards...`);

            const qualifiedCardIndexes: number[] = [];

            for (let i = 0; i < cardCount; i++) {
                const currentCard = productCards.nth(i);
                const cardText = await currentCard.innerText().catch(() => '');

                // Skip items marked as Online Exclusive
                if (cardText.toLowerCase().includes('online exclusive')) {
                    continue;
                }

                let numericPrice = 0;
                const priceElement = currentCard.locator('p, span').filter({ hasText: '$' }).first();
                if (await priceElement.count() > 0) {
                    const priceText = await priceElement.innerText().catch(() => '');
                    numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                } else {
                    const priceMatches = cardText.match(/\$?\s*([0-9]+\.[0-9]{2})/);
                    if (priceMatches) {
                        numericPrice = parseFloat(priceMatches[1]);
                    }
                }

                if (numericPrice > 30.00 || numericPrice === 0) {
                    qualifiedCardIndexes.push(i);
                }
            }

            if (qualifiedCardIndexes.length === 0 && cardCount > 0) {
                qualifiedCardIndexes.push(0);
            }

            expect(qualifiedCardIndexes.length).toBeGreaterThan(0);

            const randomIndex = qualifiedCardIndexes[Math.floor(Math.random() * qualifiedCardIndexes.length)];
            const finalSelectedCard = productCards.nth(randomIndex);

            console.log(`Randomly selected valid index ${randomIndex}. Navigating to product page...`);

            await finalSelectedCard.scrollIntoViewIfNeeded();


            // Dismiss Global-e or promotional overlays if present before clicking
            const globaleOverlay = page.locator('#globalePopupWrapper, .globale_overlay');
            if (await globaleOverlay.isVisible().catch(() => false)) {
                await page.locator('.globale_popup_close, [data-testid="close-button"]').click().catch(() => {});
            }

            const productLink = finalSelectedCard.locator('a.chakra-link').first();
            await productLink.click({ force: true });


            await page.waitForURL(/\/p\//, { timeout: 60000 });
        }

        let preferredSize: string | undefined;
        if (paymentMethod !== 'Afterpay') {
            // Use size filter to avoid out-of-stock products
            preferredSize = await plp.selectProductWithSizeFilter();
            await page.waitForURL(/\/p\//, { timeout: 60000 });
        }



        // 6. Select Variant & Proceed with retry logic for out-of-stock popup after Continue to Payment
        const maxProceedRetries = 5;
        let proceeded = false;

        for (let attempt = 1; attempt <= maxProceedRetries; attempt++) {
            console.log(`Selection attempt ${attempt}`);
            // Pass the preferred size to ensure the same size is selected on PDP
            await pdp.selectVariantAndCheckout(preferredSize);
            await checkoutPage.waitForCheckoutPage();

            if (!checkoutOptions.isLoggedIn) {
                const workerId = testInfo.workerIndex;  // Generate unique ID and Email for the Guest session
                const guestEmail = testData.guestEmails[workerId % testData.guestEmails.length];
                console.log(`Worker ${workerId} checking out as Guest: ${guestEmail}`);

                await page.locator('.chakra-spinner, [data-loading="true"]').waitFor({ state: 'detached' }).catch(() => {});

                if (addressType === 'STS') {
                    console.log(`Guest user: Handling STS selection.`);
                    await checkoutPage.selectSts(guestEmail);
                } else {
                    const address = testData.addresses[checkoutOptions.addressType];
                    await checkoutPage.fillAddressForm(checkoutOptions.addressType, guestEmail, address);
                }
            } else {
                console.log(`Logged-in user: Handling ${addressType} selection.`);
                await page.locator('.chakra-spinner, [data-loading="true"]').waitFor({ state: 'detached' }).catch(() => {});

                if (addressType === 'STS') {
                    await checkoutPage.selectSts(currentAccount.email);
                } else if (addressType === 'Standard') {
                    const stsCheckbox = page.locator('.chakra-checkbox__control');
                    const isChecked = await stsCheckbox.getAttribute('data-checked');

                    if (isChecked !== null) {
                        console.log('STS is active (data-checked found). Clicking to toggle OFF...');
                        await stsCheckbox.click();
                    } else {
                        console.log('STS was already inactive.');
                    }
                }
            }

            // Attempt to continue to payment; method returns false if out-of-stock modal was handled
            const ok = await checkoutPage.selectShippingAndContinue();
            if (ok) {
                proceeded = true;
                break;
            }

            console.log('Proceed to payment failed due to out-of-stock. Selecting another product from PLP with size filter and retrying.');
            // Pick a new product with size filter to avoid low-stock items
            preferredSize = await plp.selectProductWithSizeFilter();
            await page.waitForURL(/\/p\//, { timeout: 60000 });
        }

        if (!proceeded) {
            throw new Error('Unable to proceed to payment after multiple retries.');
        }

        await use();
        } finally {
            await page.close().catch(() => {});
        }
    },





    expressPaypalReady: async ({ page, context, isPaypalLoginRequired }, use, testInfo) => {

        test.setTimeout(300_000);
        await context.clearCookies().catch(() => {});

        try {
            const home = new HomePage(page);
            const loginPage = new LoginPage(page);
            const plp = new PLPPage(page);
            const pdp = new PDPPage(page);
            const checkoutPage = new CheckoutPage(page);

            // Reach the site
            console.log(`expressPaypalReady: navigating to home page (worker ${testInfo.workerIndex})`);
            try {
                await home.open();
                console.log('expressPaypalReady: home opened');
            } catch (err) {
                console.error('expressPaypalReady: home.open failed', err);
                await page.screenshot({ path: `test-results/expressPaypal-home-open-fail-${testInfo.workerIndex}-${Date.now()}.png` }).catch(() => {});
                throw err;
            }
            await page.evaluate(() => { localStorage.clear();  sessionStorage.clear(); });
            await home.acceptCookies();

            // Force US parameters
            await changeCountryToUS(page);
            await page.evaluate(() => { localStorage.setItem('country', 'US'); localStorage.setItem('currency', 'USD'); });
            const accountIndex = testInfo.workerIndex % testAccounts.length;
            const currentAccount = testAccounts[accountIndex];

             if (isPaypalLoginRequired) {
                await home.goToLogin();
                await loginPage.login(currentAccount.email, currentAccount.pass);
            }

            await plp.openCategory('SHIRTS', '/c/graphic-tees');
            await plp.selectRandomProduct();
            await page.waitForURL(/\/p\//, { timeout: 60000 });
            await pdp.selectVariantAndCheckout();
            await checkoutPage.waitForCheckoutPage();

            await use();
        } finally {
            await page.close().catch(() => {});
        }
    },

    expressAfterPayReady: async ({ page, context, checkoutOptions }, use, testInfo) => {
        test.setTimeout(300_000);
        await context.clearCookies().catch(() => {});

        try {
            const home = new HomePage(page);
            const plp = new PLPPage(page);
            const pdp = new PDPPage(page);
            const checkoutPage = new CheckoutPage(page);

            // Reach the site
            console.log(`expressAfterPayReady: navigating to home page (worker ${testInfo.workerIndex})`);
            try {
                await home.open();
                console.log('expressAfterPayReady: home opened');
            } catch (err) {
                console.error('expressAfterPayReady: home.open failed', err);
                await page.screenshot({ path: `test-results/expressAfterpay-home-open-fail-${testInfo.workerIndex}-${Date.now()}.png` }).catch(() => {});
                throw err;
            }
            await page.evaluate(() => { localStorage.clear();  sessionStorage.clear(); });
            await home.acceptCookies();

            // Force US parameters
            await changeCountryToUS(page);
            await page.evaluate(() => { localStorage.setItem('country', 'US'); localStorage.setItem('currency', 'USD'); });

            // Only select store for STS (Store To Ship) scenarios
            if (checkoutOptions.addressType === 'STS') {
                await home.selectMystore();
            }

            await plp.openCategory('SHIRTS', '/c/graphic-tees');
            await plp.selectRandomProduct();
            await page.waitForURL(/\/p\//, { timeout: 30000 });
            await pdp.selectVariantAndCheckout();
            await checkoutPage.waitForCheckoutPage();

            await use();
        } finally {
            await page.close().catch(() => {});
        }
    },


    plp: async ({ page }, use) => { await use(new PLPPage(page)); },
    pdp: async ({ page }, use) => { await use(new PDPPage(page)); },
    checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
    billingPage: async ({ page }, use) => { await use(new BillingPage(page)); },
    confirmationPage: async ({ page }, use) => { await use(new ConfirmationPage(page)); },
    expCheckout: async ({ page }, use) => { await use(new ExpCheckoutPage(page)); },
});

export { expect } from '@playwright/test';
