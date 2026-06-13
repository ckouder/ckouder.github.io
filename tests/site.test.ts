import { expect, test } from '@playwright/test';

test('home page lists works', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Bingji Guo' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Works' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Monuments' })).toBeVisible();
});

test('work page shows title with year, metadata, and description', async ({ page }) => {
	await page.goto('/works/monuments');
	await expect(page.getByRole('heading', { name: 'Monuments (2026)' })).toBeVisible();
	await expect(page.getByText('Interactive website, permanent web archive')).toBeVisible();
});

test('statement page renders', async ({ page }) => {
	await page.goto('/statement');
	await expect(page.getByRole('heading', { name: 'Artist Statement' })).toBeVisible();
});

test('about page has contact links', async ({ page }) => {
	await page.goto('/about');
	await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
});

test('unknown work returns 404', async ({ page }) => {
	const response = await page.goto('/works/does-not-exist');
	expect(response?.status()).toBe(404);
});
