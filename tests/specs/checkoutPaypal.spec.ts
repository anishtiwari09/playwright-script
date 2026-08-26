import { test, expect } from '../fixtures/newCheckbaseTest';
import testData from '../data/testData.json';




test.describe('checkout', () => {


    test.only('Standard Address Paypal order @paypal', async ({ checkoutReady, billingPage, confirmationPage }) => {

        checkoutReady;
        await billingPage.selectPayPal();
        await billingPage.selectPayPalAndOpenPopup(testData.payment.paypal.email, testData.payment.paypal.pass);
        await billingPage.placeOrder();
        const orderId = await confirmationPage.verifyOrderSuccess();
        expect(orderId).toBeTruthy();

    });


    test.describe('PO Box order group', () => {
        test.use({ checkoutOptions: { addressType: 'POBox' } });

        test ('PO address Paypal order @paypal', async ({ checkoutReady, billingPage, confirmationPage }) => {

            checkoutReady;
            await billingPage.selectPayPal();
            await billingPage.selectPayPalAndOpenPopup(testData.payment.paypal.email, testData.payment.paypal.pass);
            await billingPage.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();

        });


    });

    test.describe('US Outlying Paypal order', () => {
        test.use({ checkoutOptions: { addressType: 'US Outlying' } });
        test ('US Outlying Paypal order @paypal', async ({ checkoutReady, billingPage, confirmationPage }) => {

            checkoutReady;
            await billingPage.selectPayPal();
            await billingPage.selectPayPalAndOpenPopup(testData.payment.paypal.email, testData.payment.paypal.pass);
            await billingPage.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();

        });

    });

    test.describe('STS Paypal order', () => {
        test.use({ checkoutOptions: { addressType: 'STS' } });
        test ('STS Paypal order @paypal', async ({ checkoutReady, billingPage, confirmationPage }) => {


            checkoutReady;

            
            await billingPage.selectPayPal();
            await billingPage.selectPayPalAndOpenPopup(testData.payment.paypal.email, testData.payment.paypal.pass);
            await billingPage.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();

        });
    });

    test.describe('Guest User Tests', () => {
    test.use({ isPaypalLoginRequired: false });
    test.only('Exp Paypal order @paypal', async ({ expressPaypalReady, billingPage, expCheckout, confirmationPage }) => {


            expressPaypalReady;
        
            await expCheckout.selectPayPal(testData.payment.paypal.email, testData.payment.paypal.pass);
            await expCheckout.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();
            


        });
    });

        test.describe('Logged-in user Standard checkout', () => {
        // This triggers the login logic in your checkoutReady fixture
        test.use({ checkoutOptions: { addressType: 'Standard', isLoggedIn: true }});

        test ('Logged-in Paypal Standard order @paypal', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {
            // The fixture 'checkoutReady' has already logged in and reached the billing page
        checkoutReady;

        await billingPage.selectPayPal();
        await billingPage.selectPayPalAndOpenPopup(testData.payment.paypal.email, testData.payment.paypal.pass);
        await billingPage.placeOrder();
        const orderId = await confirmationPage.verifyOrderSuccess();
        expect(orderId).toBeTruthy();

        });

    });

        test.describe('Login STS Paypal order', () => {
        test.use({ checkoutOptions: { addressType: 'STS', isLoggedIn: true } });

        test('STS Paypal order @paypal', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {


        checkoutReady;

        await billingPage.selectPayPal();
        await billingPage.selectPayPalAndOpenPopup(testData.payment.paypal.email, testData.payment.paypal.pass);
        await billingPage.placeOrder();
        const orderId = await confirmationPage.verifyOrderSuccess();
        expect(orderId).toBeTruthy();


        });
   


    });

    test.describe('Logged User Tests', () => {
    test.use({ isPaypalLoginRequired: true });
    test ('Loggedusr Exp Paypal order @paypal', async ({ expressPaypalReady, expCheckout, confirmationPage }) => {


            expressPaypalReady;
        
            await expCheckout.selectPayPal(testData.payment.paypal.email, testData.payment.paypal.pass);
            await expCheckout.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();
            


        });
    });



});







