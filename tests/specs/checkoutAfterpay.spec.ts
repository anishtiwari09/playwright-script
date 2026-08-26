import { test, expect } from '../fixtures/newCheckbaseTest';
import testData from '../data/testData.json';

test.describe('checkout', () => {
    test.setTimeout(190_000);
    //test.describe.configure({ mode: 'serial' });



    test.use({checkoutOptions: {addressType: 'Standard', isLoggedIn: false, paymentMethod: 'Afterpay'}});
    test('Standard Address Afterpay order', async ({ checkoutReady, billingPage, confirmationPage }) => {

        checkoutReady;

        await billingPage.selectafterPay();
        await billingPage.selectAfterpayAndOpenPopup(testData.payment.afterpay.email, testData.payment.afterpay.pass);
        await billingPage.AfterpayreviewAndPlaceOrder();
        const orderId = await confirmationPage.verifyOrderSuccess();
        expect(orderId).toBeTruthy();

    });


    test.describe('PO Box order group', () => {
        test.use({ checkoutOptions: { addressType: 'POBox', paymentMethod: 'Afterpay' } });

        test ('PO address Afterpay order', async ({ checkoutReady, billingPage, confirmationPage }) => {

            checkoutReady;
            await billingPage.selectafterPay();
            await billingPage.selectAfterpayAndOpenPopup(testData.payment.afterpay.email, testData.payment.afterpay.pass);
            await billingPage.AfterpayreviewAndPlaceOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();


        });

     });

        test.describe('US Outlying Afterpay order', () => {
            test.use({ checkoutOptions: { addressType: 'US Outlying', paymentMethod: 'Afterpay' } });

            test ('US Outlying Afterpay order', async ({ checkoutReady, billingPage, confirmationPage }) => {

                checkoutReady;

                await billingPage.selectafterPay();
                await billingPage.selectAfterpayAndOpenPopup(testData.payment.afterpay.email, testData.payment.afterpay.pass);
                await billingPage.AfterpayreviewAndPlaceOrder();
                const orderId = await confirmationPage.verifyOrderSuccess();
                expect(orderId).toBeTruthy();

            });
        });

        test.describe('STS Afterpay order', () => {
        test.use({ checkoutOptions: { addressType: 'STS', paymentMethod: 'Afterpay' } });
        test ('STS Afterpay order', async ({ checkoutReady, billingPage, confirmationPage }) => {


            checkoutReady;

            await billingPage.selectafterPay();
            await billingPage.selectAfterpayAndOpenPopup(testData.payment.afterpay.email, testData.payment.afterpay.pass);
            await billingPage.fillBillingAddress();
            await billingPage.AfterpayreviewAndPlaceOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();


        });
    });


   
        test.describe('Express Checkout Tests', () => {
        test.use({ checkoutOptions: {addressType: 'Standard', isLoggedIn: false, paymentMethod: 'Afterpay'}});

       test ('Exp Afterpay order', async ({ expressAfterPayReady, expCheckout, confirmationPage }) => {


            expressAfterPayReady;

            await expCheckout.selectAfterpayAndOpenPopup(testData.payment.afterpay.email, testData.payment.afterpay.pass);
            await expCheckout.AfterpayreviewAndPlaceOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();
            


        });
    });

        
        test.describe('Login STS Afterpay order', () => {
        test.use({ checkoutOptions: { addressType: 'STS', isLoggedIn: true, paymentMethod: 'Afterpay' } });

        test ('STS Afterpay order', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {


        checkoutReady;

        await billingPage.selectafterPay();
        await billingPage.selectAfterpayAndOpenPopup(testData.payment.afterpay.email, testData.payment.afterpay.pass);
        await billingPage.fillBillingAddress();
        await billingPage.AfterpayreviewAndPlaceOrder();
        const orderId = await confirmationPage.verifyOrderSuccess();
        expect(orderId).toBeTruthy();


        });
   


    });

         test.describe('Logged-in user Standard checkout', () => {
        // This triggers the login logic in your checkoutReady fixture
        test.use({ checkoutOptions: { addressType: 'Standard', isLoggedIn: true, paymentMethod: 'Afterpay' }});

        test ('Logged-in Afterpay Standard order', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {
            // The fixture 'checkoutReady' has already logged in and reached the billing page
            checkoutReady;

        await billingPage.selectafterPay();
        await billingPage.selectAfterpayAndOpenPopup(testData.payment.afterpay.email, testData.payment.afterpay.pass);
        await billingPage.AfterpayreviewAndPlaceOrder();
        const orderId = await confirmationPage.verifyOrderSuccess();
        expect(orderId).toBeTruthy();
        });

    });



});








