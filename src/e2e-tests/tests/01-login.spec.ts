import { test, expect } from '@playwright/test';

test('Login exitoso con credenciales válidas', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');

  await page.getByRole('link', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('qa.puntosabor@gmail.com');

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('prueba123');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/role/);
});

test('Login falla con contraseña incorrecta', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');
  await page.getByRole('link', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('qa.puntosabor@gmail.com');

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('claveincorrecta');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Credenciales inválidas')).toBeVisible();
});

test('Login falla con correo no registrado (mismo mensaje genérico por seguridad)', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');
  await page.getByRole('link', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('noexiste12345@gmail.com');

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('noexiste');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Credenciales inválidas')).toBeVisible();
});