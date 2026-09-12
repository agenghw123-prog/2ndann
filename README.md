# Two years of us

A mobile-first anniversary and birthday love letter. Ten chapters, 37 personal photographs, a small atlas of future travels, and a secret final note. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. The finished site is fully static.

## Run locally

Use Node.js 24 LTS. On this Windows machine, `powershell -ExecutionPolicy Bypass -File .\start.ps1` finds the portable Node runtime installed under `%LOCALAPPDATA%\codex-runtimes`, installs dependencies if necessary, prepares photographs, and starts the development server. Open `http://localhost:3000`.

With Node available on your PATH:

```sh
npm ci
npm run dev
```

Photo preparation runs before development and production builds. Allow it to finish before opening the page. Original photos are never changed.

## Make it yours

- `data/content.ts`: edit `[HER NAME]`, `[MY NAME]`, optional ISO anniversary/birthday dates, chapter copy, destination notes, and music settings. Empty dates stay hidden. The default dedication stays “For my favorite person.” until her name is set.
- `data/memories.ts`: add captions, personal notes, and alt descriptions under `memoryOverrides`, keyed by original filename. Leave `photoOrder` empty for natural filename sorting, or list all 37 filenames in your chosen sequence. The filenames are not treated as capture dates.
- `photo/`: source photographs. JPG, JPEG, PNG, and WebP are supported, case-insensitively. Keep exactly 37 files. Wrong counts, missing files, and duplicate sequence entries produce clear build errors.
- `public/music/our-song.mp3`: add your own song here, or change `content.music.src` to another local path under `public/`. Rebuild after adding it. With no song, the button is hidden. Music never autoplays; playback starts only on a click and fades toward the configured volume. Some mobile browsers control audio volume at the system level.

The build emits responsive WebP variants, JPEG fallbacks, dimensions, and tiny placeholders. It corrects EXIF orientation and strips metadata from generated images. The original `photo/` folder is not included in the exported website. Each photo keeps its full aspect ratio.

## Build and preview

### Publish automatically with GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and publishes the website whenever you push to `main`. It reads the correct base path from GitHub Pages, so a project URL, account-level Pages URL, or configured custom domain works without editing the code.

1. Push the project source, including `photo/`, `package-lock.json`, and `.github/`, to your GitHub repository. Generated files and `node_modules/` are excluded by `.gitignore`.
2. Open the repository's **Settings → Pages** and select **GitHub Actions** under **Build and deployment → Source**.
3. Open **Actions → Publish anniversary website → Run workflow**, choosing `main`. Later pushes to `main` trigger it automatically.
4. When the workflow succeeds, open the published URL shown in the deployment or **Settings → Pages**.

GitHub Free supports Pages from public repositories. Pages from private repositories requires an eligible paid plan. See [GitHub's Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

If the first run fails while reading Pages settings, complete step 2 and rerun it. No personal access token needs to be stored in the workflow. The workflow uploads only the `out/` website to Pages.

### Other static hosts and local preview

```sh
npm run build
npm run preview
```

Open `http://localhost:4173`. Upload the contents of `out/` to your static host. No Node server, image service, account, or API key is needed at runtime. Use HTTP hosting rather than double-clicking `index.html`.

For a host serving under a subdirectory, set the base path **before building**:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/anniversary'
npm run build
```

Serve `out/` at `/anniversary/`. All photo, map, music, and framework paths include that prefix. For GitHub Pages, place a `.nojekyll` file beside the deployed `index.html`, so `_next/` files are served. For root hosting, clear the variable and rebuild. Do not upload your source photo folder along with the export.

Search-engine indexing is disabled in the page metadata; this is not password protection. No analytics or third-party map requests are included.

## Checks

```sh
npm run assets
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

Browser tests serve the production export and cover desktop, phone, and tablet sizes, memory progression in both directions, map/selector synchronization, keyboard dialog behavior, deferred image loading, absent music, and the story with JavaScript disabled. The reduced-motion preference removes animations and smooth scrolling.

`npm run test:subdirectory` additionally checks a real `/anniversary/` export and the optional music player with a temporary silent audio fixture. It verifies no autoplay, volume fade, pause, and error recovery, then removes its fixture and restores the root-hosted export. It refuses to overwrite an existing song.

For a real iPhone release check, confirm layout with Safari’s changing browser bars and test the supplied song with the phone’s volume controls.

## Assets and design

Only the supplied personal photographs are used. Cormorant Garamond and Inter are bundled locally through Fontsource (SIL Open Font License; licenses are in the respective font packages).

The map uses Natural Earth’s public-domain 1:110m land geometry, stored in `data/world-land.geojson` and converted into a lightweight local SVG during the build. Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson . Natural Earth terms: https://www.naturalearthdata.com/about/terms-of-use/ . The projection is equirectangular; nearby markers can be selected precisely using the destination dropdown or the closer-look control.
