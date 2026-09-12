import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePhotoOrder } from '../lib/photo-order';
import { memoryBreaks } from '../data/memories';
import assets from '../data/generated-assets.json';

test('discovers supported formats and sorts numbered filenames naturally', () => {
  assert.deepEqual(resolvePhotoOrder(['10.jpg', '2.PNG', '1.webp', 'notes.txt', '3.jpeg'], [], 4), ['1.webp', '2.PNG', '3.jpeg', '10.jpg']);
});
test('explicit sequence wins without mutating its input', () => {
  const order = ['2.jpg', '1.jpg'];
  assert.deepEqual(resolvePhotoOrder(['1.jpg', '2.jpg'], order, 2), order);
  assert.deepEqual(order, ['2.jpg', '1.jpg']);
});
test('rejects missing, duplicate and incomplete collections', () => {
  assert.throws(() => resolvePhotoOrder(['1.jpg']), /Expected 37/);
  assert.throws(() => resolvePhotoOrder(['1.jpg', '1.jpg'], [], 2), /Duplicate/);
  assert.throws(() => resolvePhotoOrder(['1.jpg', '2.jpg'], ['1.jpg', '1.jpg'], 2), /Duplicate/);
  assert.throws(() => resolvePhotoOrder(['1.jpg', '2.jpg'], ['1.jpg', '3.jpg'], 2), /Missing/);
  assert.throws(() => resolvePhotoOrder(['1.jpg', '2.jpg'], ['1.jpg'], 2), /every photo/);
});
test('generated collection is complete, sized, responsive, and has the correct milestones', () => {
  assert.equal(assets.photos.length, 37);
  assert.equal(new Set(assets.photos.map(p => p.filename)).size, 37);
  for (const photo of assets.photos) {
    assert.ok(photo.width > 0 && photo.height > 0);
    assert.ok(photo.variants.length > 0);
    assert.ok(photo.variants.every(v => v.width <= photo.width));
    assert.match(photo.placeholder, /^data:image\/webp;base64,/);
  }
  assert.deepEqual(Object.keys(memoryBreaks).map(Number), [5, 10, 15, 19, 24, 29, 34]);
});
