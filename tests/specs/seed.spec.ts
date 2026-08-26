import { test, expect } from '../fixtures/newCheckbaseTest';

// Configure environment options for seed hydration
test.use({
    checkoutOptions: {
        addressType: 'Standard',
        isLoggedIn: false,
        paymentMethod: 'Afterpay'
    }
});

test('seed setup', async ({ checkoutReady, page }) => {
    // checkoutReady fixture executes automatically during fixture resolution
    console.log('Seed setup running: validating checkout environment hydration...');

    // Verify that the browser successfully reached the checkout / billing step
    await expect(page).toHaveURL(/checkout/, { timeout: 30000 });

    console.log('Seed completed successfully. Agent environment is hydrated at:', page.url());
});
