import { expect, test } from '@playwright/test';

test('home page lists works', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Bingji Guo' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Works' })).toBeVisible();
	await expect(page.getByRole('link', { name: "That's Totally Me" }).first()).toBeVisible();
	await expect(page.getByRole('link', { name: 'Room Tour' }).first()).toBeVisible();
});

test('work opens a full-screen black viewer with info and a close button', async ({ page }) => {
	await page.goto('/works/room-tour');
	const viewer = page.locator('.viewer');
	await expect(viewer).toBeVisible();

	// Fills the viewport.
	const viewport = page.viewportSize();
	if (!viewport) throw new Error('no viewport');
	const box = await viewer.boundingBox();
	expect(box).not.toBeNull();
	expect(box!.width).toBeGreaterThanOrEqual(viewport.width - 1);
	expect(box!.height).toBeGreaterThanOrEqual(viewport.height - 1);

	// Black background.
	await expect(viewer).toHaveCSS('background-color', 'rgb(0, 0, 0)');

	// Info in the corner.
	await expect(page.locator('.viewer-info')).toContainText('Room Tour');
	await expect(page.locator('.viewer-info')).toContainText('Crayon on wall');

	// Close returns to the homepage.
	await page.getByRole('link', { name: 'Close and return home' }).click();
	await expect(page).toHaveURL('/');
	await expect(page.getByRole('heading', { name: 'Works' })).toBeVisible();
});

test('clicking a work card from the homepage opens the viewer', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Room Tour' }).first().click();
	await expect(page).toHaveURL('/works/room-tour');
	await expect(page.locator('.viewer')).toBeVisible();
});

test('statement page renders both languages', async ({ page }) => {
	await page.goto('/statement');
	await expect(page.getByRole('heading', { name: 'English' })).toBeVisible();
	await expect(page.getByRole('heading', { name: '中文' })).toBeVisible();
});

test('unknown work returns 404', async ({ page }) => {
	const response = await page.goto('/works/does-not-exist');
	expect(response?.status()).toBe(404);
});

test('viewer info collapses to the corner and expands again', async ({ page }) => {
	await page.goto('/works/untitled-fuji');
	await expect(page.locator('.viewer-info-body')).toBeVisible();
	await page.getByRole('button', { name: 'Hide details' }).click();
	await expect(page.locator('.viewer-info-body')).toHaveCount(0);
	await page.getByRole('button', { name: 'Show details' }).click();
	await expect(page.locator('.viewer-info-body')).toBeVisible();
});

test('navigation buttons are labelled and bounded at the global ends', async ({ page }) => {
	// Untitled (SPACE) leads the portfolio, so its slide has no Previous.
	await page.goto('/works/untitled-space');
	await expect(page.locator('.viewer-nav-prev')).toHaveCount(0);
	await expect(page.locator('.viewer-nav-next .viewer-nav-label')).toHaveText("That's Totally Me");

	// Arm is the last work, so its slide has no Next.
	await page.goto('/works/arm');
	await expect(page.locator('.viewer-nav-next')).toHaveCount(0);
});

test('next continues across works', async ({ page }) => {
	await page.goto('/works/untitled-space');
	await expect(page.locator('.viewer-info')).toContainText('Crayon on window frame');

	await page.getByRole('button', { name: /^Next:/ }).click();
	await expect(page).toHaveURL('/works/thats-totally-me');
	await expect(page.locator('.viewer-info')).toContainText("That's Totally Me");
});

test('previous continues back to the prior work', async ({ page }) => {
	await page.goto('/works/thats-totally-me');
	await page.getByRole('button', { name: /^Previous:/ }).click();
	await expect(page).toHaveURL('/works/untitled-space');
	await expect(page.locator('.viewer-info')).toContainText('Crayon on window frame');
	await expect(page.locator('.viewer-stage img')).toBeVisible();
});
