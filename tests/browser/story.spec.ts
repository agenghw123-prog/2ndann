import { test, expect } from '@playwright/test';

test('all memories and chapters render without overflow or browser errors', async ({ page }) => {
  const errors: string[] = [];
  const missing: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Anniversary');
  await expect(page.locator('[data-memory]')).toHaveCount(37);
  await expect(page.locator('[data-break-after]')).toHaveCount(7);
  await expect(page.locator('#destination option')).toHaveCount(14);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const id of ['intro', 'memory-1', 'memory-19', 'memory-37', 'today', 'someday', 'your-month', 'letter']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
});

test('memory counter follows forward and backward scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const id of [1, 19, 37, 7]) {
    await page.locator(`#memory-${id}`).evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(page.locator('.memory-counter strong')).toHaveText(`${String(id).padStart(2, '0')} / 37`);
  }
  await page.locator('#today').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect(page.locator('.memory-counter')).toHaveCount(0);
});

test('destination selection and keyboard-accessible secret note work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#destination').selectOption('kyoto');
  await expect(page.locator('.destination-note h3')).toContainText('Kyoto');
  await expect(page.getByRole('button', { name: 'Kyoto, Japan', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const london = page.getByRole('button', { name: 'London, United Kingdom', exact: true });
  await london.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#destination')).toHaveValue('london');
  await page.getByRole('button', { name: 'A closer look +' }).click();
  await expect(page.getByRole('button', { name: 'View the world −' })).toHaveAttribute('aria-pressed', 'true');
  const trigger = page.getByRole('button', { name: 'one last thing…' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('I’d still choose you.');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('entry defers photo downloads and does not show an absent song', async ({ page }) => {
  const photos: string[] = [];
  page.on('request', request => { if (/\/photos\//.test(request.url())) photos.push(request.url()); });
  await page.goto('/');
  await page.waitForTimeout(1800);
  expect(photos.length).toBeLessThan(6);
  await expect(page.locator('.music-player')).toHaveCount(0);
  const first = page.locator('#memory-1 img');
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveJSProperty('complete', true);
  expect(await first.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
});

test('the full letter remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('[data-memory]')).toHaveCount(37);
  await expect(page.locator('#letter h2').first()).toBeVisible();
  // Playwright's text matcher intentionally skips noscript elements.
  expect(await page.locator('#someday noscript').evaluate(el => el.textContent)).toContain('Kyoto');
  await context.close();
});

test('reduced motion removes decoration animation and slow photos keep their space', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/photos/**', async route => { await new Promise(resolve => setTimeout(resolve, 700)); await route.continue(); });
  await page.goto('/');
  expect(await page.locator('.scroll-arrow').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  const photo = page.locator('#memory-1 img');
  const before = await photo.boundingBox();
  await photo.scrollIntoViewIfNeeded();
  await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const after = await photo.boundingBox();
  expect(after!.height).toBeCloseTo(before!.height, 0);
  expect(after!.width).toBeCloseTo(before!.width, 0);
});
