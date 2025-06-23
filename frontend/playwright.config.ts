import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Mudei para false para evitar conflitos
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 2, // Apenas 1 worker para evitar conflitos
  reporter: "html",
  use: {
    baseURL: "https://petworking.local",
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
    actionTimeout: 15000, // 15 segundos para ações
    navigationTimeout: 30000, // 30 segundos para navegação
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
