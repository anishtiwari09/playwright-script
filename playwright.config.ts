import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 300_000,
  retries: process.env.CI ? 2 : 1,
  fullyParallel: false,
  workers: 1,
  reporter: 'html',

  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    navigationTimeout: 30000,
    actionTimeout: 15000,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
    permissions: ['geolocation'],
  },

  projects: [
    {
      name: 'setup',
      testMatch: /seed\.spec\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /seed\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
      testIgnore: /seed\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
      testIgnore: /seed\.spec\.ts/,
    },
  ],
});
