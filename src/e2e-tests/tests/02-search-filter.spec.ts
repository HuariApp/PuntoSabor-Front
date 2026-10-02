import { test, expect } from '@playwright/test';

test('Búsqueda con resultados: filtra por categoría Pollo', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');

  await page.getByRole('textbox', { name: 'Search by name, district, or' }).click();
  await page.getByRole('textbox', { name: 'Search by name, district, or' }).fill('Pollo');
  await page.getByRole('button', { name: 'Explore' }).click();

  await expect(page).toHaveURL(/\/results/);

  const cards = page.locator('article.card--category');
  await expect(cards.first()).toBeVisible();
  await expect(cards).toHaveCount(2);
});

test('Búsqueda sin resultados muestra "0 hallazgos"', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');

  await page.getByRole('textbox', { name: 'Search by name, district, or' }).click();
  await page.getByRole('textbox', { name: 'Search by name, district, or' }).fill('asdasdasd123');
  await page.getByRole('button', { name: 'Explore' }).click();

  await expect(page).toHaveURL(/\/results\?q=asdasdasd123/);
  await expect(page.getByText('0 hallazgos')).toBeVisible();
  await expect(page.locator('article.card--category')).toHaveCount(0);
});