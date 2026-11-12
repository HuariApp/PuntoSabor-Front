import { test, expect } from '@playwright/test';

async function mockSearchResults(page, query, results, delay = 0) {
  await page.route('**/huariques?*', async route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get('q') !== query) {
      await route.continue();
      return;
    }

    if (delay) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    await route.fulfill({ json: results });
  });
}

test('Búsqueda con resultados: filtra por categoría Pollo', async ({ page }) => {
  await page.goto('https://punto-sabor-front.vercel.app/');

  await page.getByRole('textbox', { name: 'Search by name, district, or' }).click();
  await page.getByRole('textbox', { name: 'Search by name, district, or' }).fill('Pollo');
  await page.getByRole('button', { name: 'Explore' }).click();

  await expect(page).toHaveURL(/\/results/);

  const cards = page.locator('article.card--category');
  await expect(cards.first()).toBeVisible();
  await expect(cards).toHaveCount(2);
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('Búsqueda sin resultados muestra recomendaciones al terminar la carga', async ({ page }) => {
  const query = 'asdasdasd123';
  await mockSearchResults(page, query, [], 750);
  await page.goto('https://punto-sabor-front.vercel.app/');

  const searchRequest = page.waitForRequest(request => {
    const url = new URL(request.url());
    return url.pathname.endsWith('/huariques') && url.searchParams.get('q') === query;
  });
  await page.getByRole('textbox', { name: 'Search by name, district, or' }).click();
  await page.getByRole('textbox', { name: 'Search by name, district, or' }).fill(query);
  await page.getByRole('button', { name: 'Explore' }).click();

  await expect(page).toHaveURL(new RegExp(`/results\\?q=${query}`));
  await searchRequest;
  const emptyState = page.getByRole('status');
  await expect(emptyState).toHaveCount(0);
  await expect(page.getByText('0 results')).toBeVisible();
  await expect(emptyState).toBeVisible();
  await expect(emptyState.getByRole('heading', { name: 'No huariques found' })).toBeVisible();
  await expect(emptyState.getByRole('link', { name: 'Browse categories' })).toHaveAttribute('href', '/categories');
  await expect(emptyState.getByRole('link', { name: 'View map' })).toHaveAttribute('href', '/map');
  await expect(page.locator('article.card--category')).toHaveCount(0);
});

test('Estado vacío presenta sus textos en español', async ({ page }) => {
  const query = 'sin-resultados';
  await page.addInitScript(() => localStorage.setItem('ps-locale', 'es'));
  await mockSearchResults(page, query, []);
  await page.goto('https://punto-sabor-front.vercel.app/');

  await page.getByRole('textbox', { name: 'Busca por nombre, distrito o categoría…' }).fill(query);
  await page.getByRole('button', { name: 'Explorar' }).click();

  const emptyState = page.getByRole('status');
  await expect(emptyState.getByRole('heading', { name: 'No encontramos huariques' })).toBeVisible();
  await expect(emptyState.getByRole('link', { name: 'Explorar categorías' })).toBeVisible();
  await expect(emptyState.getByRole('link', { name: 'Ver mapa' })).toBeVisible();
});