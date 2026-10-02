import { test, expect } from '@playwright/test';

test('Publicar una reseña con calificación', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('qa.puntosabor@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('prueba123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('radio', { name: 'Explorer role' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByRole('textbox', { name: 'Search by name, district, or' }).click();
  await page.getByRole('textbox', { name: 'Search by name, district, or' }).fill('Pollo');
  await page.getByRole('button', { name: 'Explore' }).click();

  await page.getByRole('link', { name: 'Review El Brasero' }).click();
  await page.getByRole('radio', { name: '5 /' }).click();

  const comentario = `Excelente lugar, muy recomendado ${Date.now()}`;
  await page.getByRole('textbox', { name: 'Review' }).click();
  await page.getByRole('textbox', { name: 'Review' }).fill(comentario);
  await page.getByRole('button', { name: 'Send review' }).click();

  await expect(page).toHaveURL(/\/huariques\/1\/reviews/);
  await expect(page.getByText(comentario)).toBeVisible();
});