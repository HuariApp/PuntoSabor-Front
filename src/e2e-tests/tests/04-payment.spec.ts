import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test('Pago con tarjeta válida es rechazado por el sistema (hallazgo de QA)', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('qa.puntosabor@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('prueba123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('radio', { name: 'Explorer role' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.goto('https://punto-sabor-front.vercel.app/memberships/payment?planId=premium');

  const payButton = page.locator('button.pay-action');
  await expect(payButton).not.toHaveText(/S\/\s*0(\D|$)/, { timeout: 20000 });

  await page.getByRole('textbox', { name: 'Cardholder' }).fill('Carla Dipes');
  await page.getByRole('textbox', { name: 'Card Number' }).fill('4111111111111111');
  await page.getByLabel('Month').selectOption('12');
  await page.getByLabel('Year').selectOption('2029');
  await page.getByRole('textbox', { name: 'CVV' }).fill('123');

  await payButton.click();

  // HALLAZGO: con datos de tarjeta válidos (Luhn válido, fecha vigente, CVV
  // correcto), el sistema muestra un bloque "Error" genérico sin detalle
  // (el campo errorList llega vacío desde el backend) y el pago no se
  // completa. Se documenta el comportamiento real observado.
  await expect(page.locator('.ps-alert--error')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Payment Successful!')).toHaveCount(0);
});