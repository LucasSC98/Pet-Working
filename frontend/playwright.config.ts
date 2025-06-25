import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 2,
  reporter: "html",
  use: {
    baseURL: "https://petworking.local",
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    extraHTTPHeaders: {
      Accept: "*/*",
    },
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--ignore-certificate-errors",
            "--ignore-ssl-errors",
            "--disable-web-security",
          ],
        },
      },
    },
  ],
});
