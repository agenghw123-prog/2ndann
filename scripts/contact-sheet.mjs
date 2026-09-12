// Optional inspection utility: npm exec node scripts/contact-sheet.mjs
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
const { photos } = JSON.parse(await readFile('data/generated-assets.json', 'utf8'));
await mkdir('test-results', { recursive: true });
for (let start = 0; start < photos.length; start += 10) {
  const group = photos.slice(start, start + 10);
  const tiles = await Promise.all(group.map(async (photo, index) => {
    const tile = await sharp(`public${photo.src}`).resize(280, 320, { fit: 'contain', background: '#f5f0e7' }).extend({ bottom: 35, background: '#f5f0e7' }).composite([{ input: Buffer.from(`<svg width="280" height="35"><text x="12" y="24" font-size="20" fill="#463e36">${photo.id}</text></svg>`), top: 320, left: 0 }]).toBuffer();
    return { input: tile, top: Math.floor(index / 5) * 355, left: (index % 5) * 280 };
  }));
  await sharp({ create: { width: 1400, height: 710, channels: 3, background: '#f5f0e7' } }).composite(tiles).jpeg().toFile(`test-results/contact-${start + 1}.jpg`);
}
