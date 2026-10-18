import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://127.0.0.1:5180' },
  webServer: {
    command: 'npm run dev -- --port 5180 --strictPort',
    url: 'http://127.0.0.1:5180',
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'webkit',
      use: {
        channel: undefined,
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'desktop',
      use: {
        channel: process.env.CI ? undefined : 'chrome',
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: 'mobile',
      use: {
        channel: process.env.CI ? undefined : 'chrome',
        viewport: { width: 375, height: 812 },
      },
    },
  ],
});
