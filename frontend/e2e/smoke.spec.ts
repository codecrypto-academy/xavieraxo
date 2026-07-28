import { expect, test } from '@playwright/test';

test.describe('Smoke frontend (sin wallet)', () => {
  test('home muestra marca y acceso (wallet o modo capturas)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Supply Chain Tracker').first()).toBeVisible();
    const connect = page.getByRole('button', { name: 'Conectar MetaMask' });
    const dashboardCard = page.getByRole('heading', { name: 'Dashboard', exact: true });
    await expect(connect.or(dashboardCard)).toBeVisible();
  });

  test('registro renderiza formulario', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Registro de Usuario' })).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Registrarse' })).toBeVisible();
  });

  test('trazabilidad muestra buscador de token', async ({ page }) => {
    await page.goto('/traceability');
    await expect(page.getByRole('heading', { name: 'Trazabilidad de Tokens' })).toBeVisible();
    await expect(page.getByLabel('ID del token')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rastrear' })).toBeVisible();
  });

  test('transferencias muestra titulo principal', async ({ page }) => {
    await page.goto('/transfers');
    await expect(page.getByRole('heading', { level: 1, name: 'Transferencias' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Nueva Transferencia' })).toBeVisible();
  });

  test('tokens muestra titulo principal', async ({ page }) => {
    await page.goto('/tokens');
    await expect(page.getByRole('heading', { level: 1, name: 'Tokens' })).toBeVisible();
  });

  test('dashboard no queda colgado sin cuenta', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: 15_000,
    });
  });

  test('admin sin cuenta: denegado o panel en modo capturas', async ({ page }) => {
    await page.goto('/admin');
    const denied = page.getByRole('heading', { name: 'Acceso Denegado' });
    const adminTitle = page.getByRole('heading', { name: 'Panel de Administración' });
    await expect(denied.or(adminTitle)).toBeVisible({ timeout: 15_000 });
  });

  test('perfil no queda colgado sin cuenta', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Mi Perfil' })).toBeVisible({
      timeout: 15_000,
    });
  });
});
