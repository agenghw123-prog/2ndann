import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('test-results/visual', { recursive: true });
const browser = await chromium.launch();
for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['small-mobile', 320, 740], ['tablet', 768, 1024]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4173/');
  await page.screenshot({ path: `test-results/visual/${label}-hero.png` });
  for (const id of ['memory-1', 'someday', 'letter']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    if (id === 'memory-1') await page.locator('#memory-1 img').evaluate(img => img.decode());
    if (id !== 'memory-1') {
      await expect(page.locator('.memory-counter')).toHaveCount(0);
      await expect(page.locator('.story-progress a[aria-current]')).toHaveAttribute('href', '#future');
    }
    await page.screenshot({ path: `test-results/visual/${label}-${id}.png` });
  }
  await page.close();
}
await browser.close();
