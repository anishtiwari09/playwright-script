import { test, expect } from '../fixtures/newCheckbaseTest';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('checkout', () => {
    test.setTimeout(800_000);
    //test.describe.configure({ mode: 'serial' });

    


    test ('Standard Address CC order', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {
        
         checkoutReady;

        
        await billingPage.fillCreditCardDetails(testInfo.workerIndex);
        await billingPage.verifyReviewAndPlaceOrder();
        await billingPage.placeOrder();
        const orderId = await confirmationPage.verifyOrderSuccess();
        expect(orderId).toBeTruthy();


    });


    test.describe('PO Box order group', () => {
        test.use({ checkoutOptions: { addressType: 'POBox' } });

        test ('PO address CC order', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {

            checkoutReady;
            await billingPage.fillCreditCardDetails(testInfo.workerIndex);
            await billingPage.verifyReviewAndPlaceOrder();
            await billingPage.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();


        });
    });


    test.describe('US Outlying CC order', () => {
        test.use({ checkoutOptions: { addressType: 'US Outlying' } });

        test.only('US Outlying CC order', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {

            await billingPage.waitForBillingPage();
            
            await billingPage.fillCreditCardDetails(testInfo.workerIndex);
            await billingPage.verifyReviewAndPlaceOrder();
            await billingPage.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();


        });
    });

        test.describe('STS CC order', () => {
        test.use({ checkoutOptions: { addressType: 'STS', isLoggedIn: false } });

        test.only('STS CC order', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {

            checkoutReady;
            
            await billingPage.fillCreditCardDetails(testInfo.workerIndex);
            await billingPage.fillBillingAddress();
            await billingPage.verifyReviewAndPlaceOrder();
            await billingPage.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();


        });
    });

     test.describe('Logged-in user checkout', () => {
        // This triggers the login logic in your checkoutReady fixture
        test.use({ checkoutOptions: { addressType: 'Standard', isLoggedIn: true }});

        test ('Logged-in CC order', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {
            // The fixture 'checkoutReady' has already logged in and reached the billing page
            checkoutReady;
            

            await billingPage.enterCVVAndPlaceOrder(testInfo.workerIndex);
            await billingPage.verifyReviewAndPlaceOrder();
            await billingPage.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();
        });

    });
        
        
        test.describe('Login STS CC order', () => {
        test.use({ checkoutOptions: { addressType: 'STS', isLoggedIn: true } });

        test ('STS CC order', async ({ checkoutReady, billingPage, confirmationPage }, testInfo) => {


            checkoutReady;

            await billingPage.enterCVVAndPlaceOrder(testInfo.workerIndex);
            await billingPage.fillBillingAddress();
            await billingPage.verifyReviewAndPlaceOrder();
            await billingPage.placeOrder();
            const orderId = await confirmationPage.verifyOrderSuccess();
            expect(orderId).toBeTruthy();


        });
   


    });


    
});








