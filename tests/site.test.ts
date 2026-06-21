import { expect, test } from '@playwright/test';

test('home page lists works', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Bingji Guo' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Works' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Monuments' }).first()).toBeVisible();
	await expect(page.getByRole('link', { name: 'VOCAB 101' }).first()).toBeVisible();
});

test('work page shows title with year, metadata, and description', async ({ page }) => {
	await page.goto('/works/monuments');
	await expect(page.getByRole('heading', { name: 'Monuments (2026)' })).toBeVisible();
	await expect(page.getByText('Interactive website, permanent web archive')).toBeVisible();
});

test('statement page renders both languages', async ({ page }) => {
	await page.goto('/statement');
	await expect(page.getByRole('heading', { name: 'English' })).toBeVisible();
	await expect(page.getByRole('heading', { name: '中文' })).toBeVisible();
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

test('series navigation disables arrows at the ends', async ({ page }) => {
	await page.goto('/works/vocab-101');
	const prev = page.getByRole('button', { name: 'Previous work' });
	const next = page.getByRole('button', { name: 'Next work' });
	await expect(prev).toBeDisabled();
	await expect(next).toBeEnabled();
	await next.click();
	await expect(next).toBeDisabled();
	await expect(prev).toBeEnabled();
});

test('series image opens a full-screen lightbox on every slide', async ({ page }) => {
	await page.goto('/works/vocab-101');
	const viewport = page.viewportSize();
	if (!viewport) throw new Error('no viewport');

	// First slide: open lightbox and assert it fills the viewport.
	await page.locator('.series-slide').first().locator('.zoom-trigger').click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const box = await dialog.boundingBox();
	expect(box).not.toBeNull();
	expect(box!.width).toBeGreaterThanOrEqual(viewport.width - 1);
	expect(box!.height).toBeGreaterThanOrEqual(viewport.height - 1);
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();

	// Advance to the second slide and confirm its image also zooms.
	await page.getByRole('button', { name: 'Next work' }).click();
	await page.locator('.series-slide').nth(1).locator('.zoom-trigger').click();
	await expect(page.getByRole('dialog')).toBeVisible();
});

test('single-work image opens a lightbox', async ({ page }) => {
	await page.goto('/works/untitled-fuji');
	await page.locator('.zoom-trigger').first().click();
	await expect(page.getByRole('dialog')).toBeVisible();
});
