import { mkdir, readdir, readFile, writeFile, access, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { resolvePhotoOrder } from '../lib/photo-order';
import { photoOrder, memoryOverrides, memoryQuestions } from '../data/memories';
import { content } from '../data/content';

type PreparedPhoto = {
  id: number; filename: string; src: string; width: number; height: number;
  variants: { src: string; width: number }[]; placeholder: string;
  caption: string; note: string; alt: string; fingerprint?: string;
};

async function main() {
  const land = JSON.parse(await readFile('data/world-land.geojson', 'utf8')) as { features: { geometry: { type: string; coordinates: number[][][] | number[][][][] } }[] };
  const paths = land.features.flatMap(feature => {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates as number[][][]] : feature.geometry.coordinates as number[][][][];
    return polygons.map(polygon => polygon.map(ring => ring.map(([lon, lat], index) => `${index ? 'L' : 'M'}${((lon + 180) / 360 * 1000).toFixed(1)},${((90 - lat) / 180 * 500).toFixed(1)}`).join('') + 'Z').join(''));
  });
  await mkdir('public', { recursive: true });
  await writeFile('public/world-map.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500"><path fill="#566c71" stroke="#80908b" stroke-width="0.3" d="${paths.join('')}"/></svg>`);
  const input = path.resolve('photo');
  const output = path.resolve('public/photos');
  await mkdir(output, { recursive: true });
  const files = resolvePhotoOrder(await readdir(input), photoOrder);
  const cached: { photos: PreparedPhoto[] } = await readFile('data/generated-assets.json', 'utf8').then(text => JSON.parse(text), () => ({ photos: [] }));
  const photos: PreparedPhoto[] = [];
  for (const [index, file] of files.entries()) {
    const source = path.join(input, file);
    const info = await stat(source);
    const fingerprint = `${file}:${index}:${info.size}:${info.mtimeMs}:pipeline-2:sharp-${sharp.versions.sharp}`;
    const old = cached.photos.find(photo => photo.fingerprint === fingerprint);
    const override = memoryOverrides[file] || {};
    const copy = { caption: override.caption ?? memoryQuestions[index % memoryQuestions.length], note: override.note ?? '', alt: override.alt ?? `Personal photograph ${index + 1} from our two years together` };
    if (old && await Promise.all([old.src, ...old.variants.map(v => v.src)].map(src => access(path.join('public', src)).then(() => true, () => false))).then(results => results.every(Boolean))) {
      photos.push({ ...old, ...copy });
      continue;
    }
    const metadata = await sharp(source).metadata();
    const swapped = [5, 6, 7, 8].includes(metadata.orientation || 1);
    const width = (swapped ? metadata.height : metadata.width)!;
    const height = (swapped ? metadata.width : metadata.height)!;
    const id = String(index + 1).padStart(2, '0');
    const widths = [...new Set([480, 800, 1200, 1600].map(size => Math.min(size, width)))];
    const variants = await Promise.all(widths.map(async size => {
      const name = `${id}-${size}.webp`;
      await sharp(source).rotate().resize({ width: size, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(output, name));
      return { src: `/photos/${name}`, width: size };
    }));
    const fallback = `/photos/${id}.jpg`;
    await sharp(source).rotate().resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join('public', fallback));
    const placeholder = await sharp(source).rotate().resize({ width: 24 }).webp({ quality: 35 }).toBuffer();
    photos.push({ id: index + 1, filename: file, src: fallback, width, height, variants,
      placeholder: `data:image/webp;base64,${placeholder.toString('base64')}`,
      ...copy, fingerprint });
  }
  const keep = new Set(photos.flatMap(photo => [path.basename(photo.src), ...photo.variants.map(v => path.basename(v.src))]));
  for (const file of await readdir(output)) {
    if (/^\d{2}(?:-\d+\.webp|\.jpg)$/.test(file) && !keep.has(file)) await unlink(path.join(output, file));
  }
  const musicExists = content.music.src.startsWith('/') && !content.music.src.includes('..')
    ? await access(path.join('public', content.music.src)).then(() => true, () => false) : false;
  await writeFile('data/generated-assets.json', JSON.stringify({ photos, musicExists }, null, 2));
  console.log(`Prepared ${photos.length} memories. Music ${musicExists ? 'available' : 'not supplied; player hidden'}.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
