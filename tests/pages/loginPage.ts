import { Page, Locator } from '@playwright/test';
import { autoFill, autoClick } from '../utils/autoHeal';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly continueBtn: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('#username');
        this.continueBtn = page.getByRole('button', { name: 'Continue', exact: true });

        this.passwordInput = page.locator('#password');
        this.loginBtn = page.getByRole('button', { name: 'Continue' });
    }

    async login(email: string, pass: string) {
        await this.emailInput.waitFor({ state: 'visible', timeout: 20000 });
        await this.emailInput.fill(email);

        await this.continueBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.continueBtn.scrollIntoViewIfNeeded();
        await this.continueBtn.click();

        await this.passwordInput.waitFor({ state: 'visible', timeout: 20000 });
        await this.passwordInput.fill(pass);

        await this.continueBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.continueBtn.scrollIntoViewIfNeeded();
        await this.continueBtn.click();

        // Wait for login to complete
        await this.page.waitForURL(url => url.href.includes('glCountry=US') || url.href.includes('lastAction=login') || url.pathname === '/', { timeout: 30000 }).catch(() => {});
    }
}
