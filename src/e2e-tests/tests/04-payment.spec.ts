import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test('Pagar suscripción Premium con tarjeta válida activa la membresía', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('qa.pago4@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('prueba123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('radio', { name: 'Explorer role' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).not.toHaveURL(/\/role/);

  await page.getByRole('link', { name: 'Plans' }).click();
  await page.waitForURL(/\/plans/);
  await expect(page.getByRole('button', { name: 'Choose Premium' })).toBeVisible();
  await page.getByRole('button', { name: 'Choose Premium' }).click();

  await page.waitForURL(/planId=premium/);

  // Espera a que cargue el precio real del plan antes de llenar el formulario
  await expect(page.getByRole('button', { name: 'Pay S/' })).not.toHaveText(/S\/\s*0(\D|$)/, { timeout: 20000 });

  await page.getByRole('textbox', { name: 'Cardholder' }).click();
  await page.getByRole('textbox', { name: 'Cardholder' }).fill('Carla Dipes');
  await page.getByRole('textbox', { name: 'Card Number' }).click();
  await page.getByRole('textbox', { name: 'Card Number' }).fill('4111111111111111');
  await page.getByLabel('Month').selectOption('12');
  await page.getByLabel('Year').selectOption('2029');
  await page.getByRole('textbox', { name: 'CVV' }).click();
  await page.getByRole('textbox', { name: 'CVV' }).fill('123');
  await page.getByRole('button', { name: 'Pay S/' }).click();

  await expect(page.getByText('Payment Successful!')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Your membership has been activated.')).toBeVisible();
  await expect(page.getByText(/Transaction ID:/)).toBeVisible();
});
