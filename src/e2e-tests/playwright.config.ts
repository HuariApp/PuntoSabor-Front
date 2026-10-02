import { defineConfig, devices } from '@playwright/test';
 
/**
 * Configuración de Playwright para los System Tests de PuntoSabor (sección 6.1.4).
 * Apunta directo al Front ya desplegado en Vercel.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://punto-sabor-front.vercel.app',
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});