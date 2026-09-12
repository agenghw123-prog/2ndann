export function resolvePhotoOrder(files: string[], order: string[] = [], expected = 37): string[] {
  const supported = files.filter(file => /\.(jpe?g|png|webp)$/i.test(file));
  if (new Set(supported).size !== supported.length) throw new Error('Duplicate photo filenames.');
  if (supported.length !== expected) throw new Error(`Expected ${expected} photos; found ${supported.length}.`);
  if (!order.length) return supported.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  if (new Set(order).size !== order.length) throw new Error('Duplicate filenames in photoOrder.');
  const missing = order.filter(file => !supported.includes(file));
  if (missing.length) throw new Error(`Missing photos: ${missing.join(', ')}`);
  if (order.length !== supported.length) throw new Error('photoOrder must list every photo exactly once.');
  return [...order];
}
