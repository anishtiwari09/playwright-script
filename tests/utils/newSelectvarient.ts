import { Page, expect } from "@playwright/test";

export async function selectVariant(page: Page) {
    console.log('Selecting variants');
    await expect(page).toHaveURL(/\/p\//);
    await expect(page).not.toHaveURL(/international|global-e/i);

    // 1. Target all colors
    const colorOptions = page.locator('[role="radiogroup"] [role="radio"]');
    const colorCount = await colorOptions.count();

    if (colorCount > 0) {
        console.log(`Found ${colorCount} colors. Picking one randomly...`);
        
        // Pick a random number between 0 and (colorCount - 1)
        const randomColorIndex = Math.floor(Math.random() * colorCount);
        const selectedColor = colorOptions.nth(randomColorIndex);
        
        await expect(selectedColor).toBeVisible({ timeout: 30000 });
        
        // Get the label to see what we are clicking in logs
        const colorName = await selectedColor.getAttribute('aria-label') || `Index ${randomColorIndex}`;
        console.log(`Selected Color: ${colorName}`);
        
        await selectedColor.click();
    } else {
        console.log('No specific color options found.');
    }
    
    await page.waitForLoadState('domcontentloaded');

    // 2. Target all available sizes (Bypassing anything with "unavailable")
    const allSizes = page.locator('button[role="radio"], [role="radio"]');
    const availableSizes = allSizes.filter({ 
        hasNot: page.locator('[aria-label*="unavailable"]') 
    }).filter({ 
        hasNotText: /out of stock|sold out/i 
    }).filter({
        hasNot: page.locator('.disabled, .out-of-stock, [aria-disabled="true"]')
    });

    await expect(availableSizes.first()).toBeVisible({ timeout: 15000 });
    const sizeCount = await availableSizes.count();
    
    console.log(`Found ${sizeCount} available sizes. Picking one randomly...`);

    // 3. Pick a random number between 0 and (sizeCount - 1)
    const randomSizeIndex = Math.floor(Math.random() * sizeCount);
    const selectedSize = availableSizes.nth(randomSizeIndex);

    const sizeName = await selectedSize.getAttribute('aria-label') || `Index ${randomSizeIndex}`;
    console.log(`Selected Size: ${sizeName}`);

    // Use dispatchEvent to ensure click triggers despite strike-out overlays
    await selectedSize.dispatchEvent('click');
    
    // 4. Add to bag
    const addToBag = page.getByRole('button', { name: /add to bag/i });
    await expect(addToBag).toBeEnabled({ timeout: 15000 });
    await addToBag.click();
    console.log('Product added to bag successfully.');
}
