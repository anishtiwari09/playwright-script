import { test as setup } from '@playwright/test';
import { changeCountryToUS } from '../utils/changeCountry';

setup('set US country', async ({ page }) => {
  await page.goto('/');

  await changeCountryToUS(page);

  // Save cookies + localStorage
  await page.context().storageState({ path: 'usState.json' });
});