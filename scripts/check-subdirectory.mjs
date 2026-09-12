// Integration check for the optional music branch and a static subdirectory deployment.
// Restores a root-hosted build and removes only its own temporary audio fixture.
import { createServer } from 'node:http';
import { readFile, writeFile, unlink, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium, expect } from '@playwright/test';

const root = process.cwd();
const song = path.join(root, 'public/music/our-song.mp3');
const prefix = '/anniversary';
let createdSong = false;
let server;
let browser;
function build(basePath) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_BASE_PATH: basePath };
    const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { stdio: 'inherit', env });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Build exited ${code}`)));
  });
}
function assets() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'scripts/prepare-assets.ts'], { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Assets exited ${code}`)));
  });
}
try {
  const existing = await stat(song).then(() => true, () => false);
  if (existing) throw new Error('This fixture check requires the default music path to be empty; it will not overwrite your song.');
  await mkdir(path.dirname(song), { recursive: true });
  // A silent WAV, identified by its MIME type by the test server. No copyrighted music is needed.
  const samples = 44100 * 3;
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(44100, 24); wav.writeUInt32LE(88200, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(samples * 2, 40);
  await writeFile(song, wav, { flag: 'wx' }); createdSong = true;
  await assets();
  await build(prefix);
  const exportRoot = path.resolve('out');
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(`${prefix}/`)) { response.writeHead(404); response.end(); return; }
      const relative = pathname.slice(prefix.length).replace(/^\//, '') || 'index.html';
      const file = path.resolve(exportRoot, relative.endsWith('/') ? `${relative}index.html` : relative);
      if (!file.startsWith(exportRoot + path.sep)) { response.writeHead(403); response.end(); return; }
      const data = await readFile(file);
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.mp3': 'audio/wav' };
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': data.length });
      response.end(data);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise(resolve => server.listen(4175, '127.0.0.1', resolve));
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const failures = [];
  const browserErrors = [];
  const audioRequests = [];
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  page.on('pageerror', error => browserErrors.push(error.message));
  page.on('request', request => { if (request.url().includes('/music/')) audioRequests.push(request.url()); });
  await page.goto(`http://127.0.0.1:4175${prefix}/`);
  await expect(page.locator('h1')).toContainText('Anniversary');
  await expect(page.locator('audio')).toHaveJSProperty('paused', true);
  expect(audioRequests).toHaveLength(0);
  await page.getByRole('button', { name: 'play our song' }).click();
  await expect(page.getByRole('button', { name: 'pause our song' })).toHaveAttribute('aria-pressed', 'true');
  try {
    await expect.poll(() => page.locator('audio').evaluate(audio => audio.volume)).toBeCloseTo(.25, 2);
  } catch (error) {
    console.error('Audio diagnostics:', await page.locator('audio').evaluate(audio => ({ volume: audio.volume, paused: audio.paused, time: audio.currentTime, ready: audio.readyState, network: audio.networkState, error: audio.error?.message })), browserErrors);
    throw error;
  }
  await page.getByRole('button', { name: 'pause our song' }).click();
  await expect(page.locator('audio')).toHaveJSProperty('paused', true);
  expect(audioRequests.every(url => url.includes(`${prefix}/music/`))).toBe(true);
  await page.locator('#memory-1 img').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('#memory-1 img').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator('#memory-1 img').evaluate(img => img.currentSrc)).toContain(`${prefix}/photos/`);
  await page.locator('#destination').selectOption('bali');
  await expect(page.locator('.destination-note h3')).toContainText('Bali');
  const svg = await page.request.get(`http://127.0.0.1:4175${prefix}/world-map.svg`);
  expect(svg.ok()).toBe(true);
  expect(failures).toEqual([]);
  expect(browserErrors).toEqual([]);

  // Browser playback refusal must leave a usable retry button and a clear status.
  await page.evaluate(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Test refusal', 'NotAllowedError')); });
  await page.getByRole('button', { name: 'play our song' }).click();
  await expect(page.getByRole('status')).toContainText('Tap to try again');
  await expect(page.getByRole('button', { name: 'play our song' })).toBeEnabled();
  await page.reload();
  await page.route('**/music/our-song.mp3', route => route.fulfill({ status: 404, body: 'Test missing audio' }));
  await page.getByRole('button', { name: 'play our song' }).click();
  await expect(page.getByRole('status')).toContainText(/unavailable|couldn’t play/);
  await expect(page.getByRole('button', { name: 'play our song' })).toBeEnabled();
  console.log('PASS: subdirectory assets, no autoplay/preload, music playback/fade/pause, denied playback, missing audio, and map selection.');
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  if (createdSong) {
    await unlink(song);
    await assets();
    await build('');
    console.log('Restored the root-hosted export. Temporary audio removed.');
  }
}
