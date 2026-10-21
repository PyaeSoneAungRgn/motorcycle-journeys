import { chromium } from 'playwright-core';
import { mkdir, rm } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = '.qa';

const pages = [
  '/',
  '/photos',
  '/rides',
  '/rides/nan-loop',
  '/rides/chiang-mai-pai',
  '/rides/da-nang-hai-van',
  '/rides/doi-inthanon',
  '/rides/daibutsu',
  '/vlogs',
  '/vlogs/vn-hai-van',
  '/vlogs/di-highest-spot',
  '/vlogs/db-ep-01-ride',
  '/vlogs/db-ep-02-daibutsu',
  '/places',
  '/atlas',
  '/about',
  '/posts',
  '/posts/dear-chiang-mai',
  '/posts/blueprint',
];

const failures = [];
const consoleErrors = [];

function fail(message) {
  failures.push(message);
  console.log(`  ✗ ${message}`);
}

function ok(message) {
  console.log(`  ✓ ${message}`);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const text = message.text();
  if (/ytimg|youtube|basemaps|cartocdn|favicon/i.test(text)) return;
  // Third-party YouTube embeds probe the Compute Pressure API, which Chrome
  // blocks for cross-origin frames and reports on the host console.
  if (/compute-pressure|permissions policy/i.test(text)) return;
  if (/status of 404/.test(text) && page.url().endsWith('/does-not-exist')) return;
  consoleErrors.push({ url: page.url(), text });
});

page.on('pageerror', (error) => {
  const text = String(error);
  if (/ytimg|youtube|basemaps|cartocdn|compute-pressure|permissions policy/i.test(text)) return;
  consoleErrors.push({ url: page.url(), text });
});

console.log('\nPages');
for (const path of pages) {
  const response = await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const status = response?.status() ?? 0;
  if (status !== 200) {
    fail(`${path} returned ${status}`);
    continue;
  }

  const title = await page.title();
  const headings = await page.locator('h1').count();
  if (headings !== 1) fail(`${path} has ${headings} h1 elements`);
  if (!title || title.includes('undefined')) fail(`${path} has an empty title`);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) fail(`${path} overflows horizontally by ${overflow}px`);

  ok(`${path} — “${title}”`);
}

console.log('\n404');
{
  const response = await page.goto(`${BASE}/does-not-exist`, { waitUntil: 'load' });
  if (response?.status() !== 404) fail(`404 route returned ${response?.status()}`);
  const text = await page.locator('h1').innerText();
  if (!/Wrong turn/i.test(text)) fail('404 page copy missing');
  else ok('404 renders with status 404');
}

console.log('\nHome time lapses');
{
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  const count = await page.locator('.home-timelapses .timelapse').count();
  if (!count) fail('home page has no time-lapse section');
  else {
    const src = await page.locator('.home-timelapses video').first().getAttribute('src');
    if (!src?.startsWith('/videos/')) fail('home time lapse has no local video');
    else ok(`home aggregates ${count} time lapse(s)`);
  }
}

console.log('\nWhite-only theme');
{
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const scheme = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('color-scheme'),
  );
  if (bg !== 'rgb(255, 255, 255)') fail(`dark preference changes the page background to ${bg}`);
  else ok('page stays white under a dark OS preference');
  if (!scheme.includes('light')) fail(`color-scheme is not pinned to light (${scheme})`);
  await page.emulateMedia({ colorScheme: 'light' });
}

console.log('\nInteractions');
await page.goto(`${BASE}/photos`, { waitUntil: 'load' });
await page.waitForTimeout(400);
{
  const total = await page.locator('.photo-item').count();
  await page.locator('.photo-item').first().click();
  await page.waitForSelector('dialog[open]', { timeout: 4000 });
  const firstCounter = await page.locator('[data-lightbox-count]').innerText();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const secondCounter = await page.locator('[data-lightbox-count]').innerText();
  if (firstCounter === secondCounter) fail('lightbox arrow navigation did not advance');
  else ok(`lightbox opens and advances (${firstCounter} → ${secondCounter})`);
  const imageSrc = await page.locator('[data-lightbox-img]').getAttribute('src');
  if (!imageSrc) fail('lightbox image has no source');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  if (await page.locator('dialog[open]').count()) fail('lightbox did not close on Escape');
  else ok('lightbox closes on Escape');

  for (const [rideId, name] of [
    ['nan-loop', 'Nan Loop'],
    ['chiang-mai-pai', 'Chiang Mai & Pai'],
    ['da-nang-hai-van', 'Da Nang & Hai Van'],
    ['doi-inthanon', 'Doi Inthanon'],
    ['daibutsu', 'Daibutsu'],
  ]) {
    const filterButton = page.locator(`[data-filter="${rideId}"]`);
    await filterButton.click();
    await page.waitForTimeout(200);
    const visible = await page.locator('.photo-item:not([hidden])').count();
    const label = await filterButton.innerText();
    const expected = Number(label.replace(/\D+/g, '')) || 0;
    if (visible !== expected) fail(`${name} filter shows ${visible} photos, chip says ${expected}`);
    else ok(`${name} filter shows ${visible} photographs`);
    if (visible >= total) fail(`${name} filter did not hide photographs from the other ride`);
  }
  await page.locator('[data-filter="all"]').click();
  await page.waitForTimeout(200);
  const restored = await page.locator('.photo-item:not([hidden])').count();
  if (restored !== total) fail(`“All” restored ${restored} of ${total} photos`);
  else ok('“All” restores every photograph');
}

await page.goto(`${BASE}/places`, { waitUntil: 'load' });
{
  const cards = await page.locator('.place-card').count();
  if (cards !== 13) fail(`other places lists ${cards} films`);
  else ok('other places lists 13 films');

  const href = await page.locator('.place-card').first().getAttribute('href');
  if (!href?.startsWith('https://www.youtube.com/watch?v=')) {
    fail('other places card does not link to YouTube');
  } else {
    ok('other places cards open the film on YouTube');
  }
}

await page.goto(`${BASE}/atlas`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
{
  const mapReady = await page
    .waitForSelector('[data-map][data-map-ready="true"]', { timeout: 15000 })
    .then(() => true)
    .catch(() => false);
  if (!mapReady) fail('atlas map did not render');
  else {
    if (await page.locator('.map-shell.map-failed').count()) fail('map reported a load failure');

    const requests = await page.evaluate(
      () =>
        performance
          .getEntriesByType('resource')
          .filter((entry) => entry.name.includes('openfreemap.org')).length,
    );
    if (requests < 1) fail('vector basemap did not load');
    else ok(`vector basemap loaded (${requests} tile/style requests)`);

    const routeCount = await page.locator('[data-route-focus]').count();
    const firstRoute = page.locator('[data-route-focus]').first();
    const pinsBefore = await page.locator('.map-pin').count();
    const permanentLabels = await page.locator('.map-label').count();
    if (permanentLabels) fail(`atlas still shows ${permanentLabels} permanent route labels`);
    else ok('atlas shows route lines without permanent labels');

    if (routeCount === 1) {
      if ((await firstRoute.getAttribute('aria-pressed')) !== 'true') {
        fail('the only route is not marked as selected');
      } else ok('the only route is selected by default');
      if (pinsBefore < 3) fail(`atlas shows only ${pinsBefore} pins on load`);
      else ok(`atlas opens with ${pinsBefore} numbered stops`);
    } else {
      if ((await firstRoute.getAttribute('aria-pressed')) !== 'false') {
        fail('atlas auto-selected a route even though there are several');
      } else ok(`atlas opens with all ${routeCount} routes visible and none selected`);
      if (pinsBefore !== 0) fail(`atlas shows ${pinsBefore} pins before a route is selected`);
      else ok('atlas keeps stop pins hidden until a route is selected');
    }

    await firstRoute.click();
    await page.waitForTimeout(900);
    if ((await firstRoute.getAttribute('aria-pressed')) !== 'true') {
      fail('route did not become selected');
    } else ok('selecting a route marks it and reveals its stops');
    const pinsAfter = await page.locator('.map-pin').count();
    if (pinsAfter < 3) fail(`selected route shows only ${pinsAfter} pins`);
    else ok(`selected route reveals ${pinsAfter} numbered stops`);

    await firstRoute.click();
    await page.waitForTimeout(700);
    if ((await firstRoute.getAttribute('aria-pressed')) !== 'false') {
      fail('route toggle did not clear the map');
    } else ok('route toggle clears the selection');

    await firstRoute.click();
    await page.waitForTimeout(900);
    const pinsRestored = await page.locator('.map-pin').count();
    if (pinsRestored < 3) fail(`re-selected route shows only ${pinsRestored} pins`);
    else ok(`route re-selection restores ${pinsRestored} numbered stops`);

    const daNangRoute = page.locator('[data-route-focus="da-nang-hai-van"]');
    await daNangRoute.click();
    await page.waitForTimeout(900);
    const daNangPins = await page.locator('.map-pin').count();
    if (daNangPins !== 7) fail(`Da Nang route shows ${daNangPins} pins`);
    else ok('Da Nang route shows 7 numbered stops');

    const doiRoute = page.locator('[data-route-focus="doi-inthanon"]');
    await doiRoute.click();
    await page.waitForTimeout(900);
    const doiPins = await page.locator('.map-pin').count();
    if (doiPins !== 5) fail(`Doi Inthanon route shows ${doiPins} pins`);
    else ok('Doi Inthanon route shows 5 numbered stops');
  }
}

await page.goto(`${BASE}/vlogs`, { waitUntil: 'load' });
{
  const vlogLinks = await page.$$eval('a[href^="/vlogs/"]', (links) => links.length);
  if (!vlogLinks) {
    ok('no films published yet — embed test skipped');
  } else {
    await page.locator('a[href^="/vlogs/"]').first().click();
    await page.locator('[data-play]').click();
    await page.waitForSelector('.player iframe', { timeout: 5000 });
    const src = await page.locator('.player iframe').getAttribute('src');
    if (!src?.includes('youtube-nocookie.com/embed/')) fail('video facade did not load embed');
    else ok('video facade swaps to a privacy-friendly YouTube embed');
  }
}

await page.goto(`${BASE}/rides/nan-loop`, { waitUntil: 'load' });
{
  const clips = await page.locator('.clip-card').count();
  if (clips !== 3) fail(`short film section shows ${clips} clips`);
  else ok('short film section shows 3 clips');

  await page.locator('[data-clip-play]').first().click();
  await page.waitForSelector('.clip-card__video', { timeout: 5000 });
  const src = await page.locator('.clip-card__video').getAttribute('src');
  if (!src?.startsWith('/videos/')) fail('short film did not load a local video');
  else ok('short film plays from a local MP4');

  await page.evaluate(() => document.querySelector('#time-lapse').scrollIntoView());
  await page.waitForTimeout(1200);
  const timeLapse = await page.evaluate(() => {
    const video = document.querySelector('[data-timelapse-video]');
    if (!video) return null;
    return {
      src: video.currentSrc || video.src,
      muted: video.muted,
      loop: video.loop,
      paused: video.paused,
    };
  });

  if (!timeLapse) fail('time-lapse video is missing');
  else if (!timeLapse.src.includes('/videos/')) fail('time-lapse did not load a local video');
  else if (!timeLapse.muted || !timeLapse.loop) fail('time-lapse is not muted/looping');
  else {
    await page.locator('[data-timelapse-toggle]').click();
    await page.waitForTimeout(400);
    const paused = await page.evaluate(
      () => document.querySelector('[data-timelapse-video]').paused,
    );
    if (paused === timeLapse.paused) fail('time-lapse pause control did not change state');
    else ok('time-lapse is muted, looping and pauses on demand');
  }
}

await page.goto(`${BASE}/rides/chiang-mai-pai`, { waitUntil: 'load' });
{
  const clips = await page.locator('.clip-card').count();
  if (clips !== 3) fail(`Chiang Mai short film section shows ${clips} clips`);
  else ok('Chiang Mai page shows 3 short films');

  const episodes = await page.locator('.vlog-card').count();
  if (episodes !== 5) fail(`Chiang Mai page shows ${episodes} episodes`);
  else ok('Chiang Mai page lists 5 films');

  await page.locator('[data-clip-play]').first().click();
  await page.waitForSelector('.clip-card__video', { timeout: 5000 });
  const clipSrc = await page.locator('.clip-card__video').getAttribute('src');
  if (!clipSrc?.startsWith('/videos/cm-clip-')) fail('Chiang Mai short film did not load a local video');
  else ok('Chiang Mai short film plays from a local MP4');

  await page.evaluate(() => document.querySelector('#time-lapse').scrollIntoView());
  await page.waitForTimeout(1000);

  const timeLapseCount = await page.locator('[data-timelapse-video]').count();
  if (timeLapseCount !== 2) fail(`Chiang Mai page shows ${timeLapseCount} time lapses`);
  else ok('Chiang Mai page shows 2 time lapses');

  const timeLapse = await page.evaluate(() => {
    const video = document.querySelector('[data-timelapse-video]');
    return video ? { src: video.currentSrc || video.src, muted: video.muted, loop: video.loop } : null;
  });
  if (!timeLapse) fail('Chiang Mai time-lapse video is missing');
  else if (!timeLapse.src.includes('/videos/cm-timelapse-sunset.mp4')) {
    fail('Chiang Mai time-lapse did not load the local video');
  } else if (!timeLapse.muted || !timeLapse.loop) {
    fail('Chiang Mai time-lapse is not muted/looping');
  } else ok('Chiang Mai time-lapse loads muted and looping');

  const chiangDao = await page.evaluate(() => {
    const video = [...document.querySelectorAll('[data-timelapse-video]')].find((item) =>
      item.getAttribute('src')?.includes('cm-timelapse-chiang-dao.mp4'),
    );
    return video ? { src: video.getAttribute('src'), muted: video.muted, loop: video.loop } : null;
  });
  if (!chiangDao) fail('Chiang Dao time lapse is missing');
  else if (!chiangDao.muted || !chiangDao.loop) fail('Chiang Dao time lapse is not muted/looping');
  else ok('Chiang Dao time lapse is present and loops');
}

await page.goto(`${BASE}/rides/da-nang-hai-van`, { waitUntil: 'load' });
{
  const clips = await page.locator('.clip-card').count();
  if (clips !== 1) fail(`Da Nang short film section shows ${clips} clips`);
  else ok('Da Nang page shows 1 short film');

  const episodes = await page.locator('.ride-vlog .player').count();
  if (episodes !== 1) fail(`Da Nang page shows ${episodes} film players`);
  else ok('Da Nang page shows 1 film player');

  await page.locator('[data-clip-play]').first().click();
  await page.waitForSelector('.clip-card__video', { timeout: 5000 });
  const clipSrc = await page.locator('.clip-card__video').getAttribute('src');
  if (!clipSrc?.includes('/videos/vn-hai-van-ride.mp4')) {
    fail('Da Nang short film did not load a local video');
  } else ok('Da Nang short film plays from a local MP4');

  const timeLapses = await page.locator('[data-timelapse-video]').count();
  if (timeLapses !== 0) fail(`Da Nang page unexpectedly shows ${timeLapses} time lapses`);
  else ok('Da Nang page has no time-lapse section');
}

await page.goto(`${BASE}/rides/doi-inthanon`, { waitUntil: 'load' });
{
  const clips = await page.locator('.clip-card').count();
  if (clips !== 2) fail(`Doi Inthanon short film section shows ${clips} clips`);
  else ok('Doi Inthanon page shows 2 short films');

  const episodes = await page.locator('.ride-vlog .player').count();
  if (episodes !== 1) fail(`Doi Inthanon page shows ${episodes} film players`);
  else ok('Doi Inthanon page shows 1 film player');

  await page.locator('[data-clip-play]').first().click();
  await page.waitForSelector('.clip-card__video', { timeout: 5000 });
  const clipSrc = await page.locator('.clip-card__video').getAttribute('src');
  if (!clipSrc?.includes('/videos/di-clip-garden.mp4')) {
    fail('Doi Inthanon short film did not load a local video');
  } else ok('Doi Inthanon short film plays from a local MP4');

  const timeLapses = await page.locator('[data-timelapse-video]').count();
  if (timeLapses !== 0) fail(`Doi Inthanon page unexpectedly shows ${timeLapses} time lapses`);
  else ok('Doi Inthanon page has no time-lapse section');
}

console.log('\nWriting');
{
  await page.goto(`${BASE}/posts`, { waitUntil: 'load' });
  const rows = await page.locator('.post-row').count();
  if (rows < 30) fail(`writing archive lists ${rows} posts`);
  else ok(`writing archive lists ${rows} posts`);

  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  const homeRows = await page.locator('.home-writing .post-row').count();
  if (homeRows !== 3) fail(`home page shows ${homeRows} writing pieces, expected 3`);
  else ok('home page shows the latest three pieces of writing');

  const response = await page.goto(`${BASE}/posts/dear-chiang-mai`, { waitUntil: 'load' });
  if (response?.status() !== 200) {
    fail(`old post URL /posts/dear-chiang-mai returned ${response?.status()}`);
  } else if (!/Dear Chiang Mai/.test(await page.title())) {
    fail('old post URL has the wrong title');
  } else {
    ok('old post URL /posts/dear-chiang-mai resolves');
  }

  const images = await page.$$eval('.post-prose img', (items) =>
    items.map((img) => ({ src: img.getAttribute('src'), width: img.naturalWidth })),
  );
  const broken = images.filter((image) => !image.width);
  if (!images.length) fail('post has no inline images');
  else if (broken.length) fail(`${broken.length} post image(s) failed (${broken[0].src})`);
  else ok(`${images.length} inline post images load from local assets`);

  const embeds = await page.$$eval('.post-prose iframe', (frames) =>
    frames.map((frame) => frame.getAttribute('src')),
  );
  if (!embeds.length) fail('post has no video embeds');
  else if (embeds.some((src) => !src?.includes('youtube-nocookie.com'))) {
    fail('post video embeds are not privacy-friendly');
  } else ok(`${embeds.length} video embeds use youtube-nocookie.com`);

  const proseFont = await page.evaluate(
    () => getComputedStyle(document.querySelector('.post-prose')).fontFamily,
  );
  if (!/Yati/.test(proseFont)) fail('post prose is missing the Yati Myanmar fallback');
  else ok('post prose includes the Yati Myanmar fallback');

  await page.goto(`${BASE}/posts/blueprint`, { waitUntil: 'load' });
  const codeBg = await page.evaluate(
    () => getComputedStyle(document.querySelector('.post-prose pre')).backgroundColor,
  );
  if (codeBg === 'rgb(255, 255, 255)') fail('code blocks are not on the warm paper background');
  else ok('code blocks use the light paper theme');
}

console.log('\nResponsive');
for (const width of [360, 390, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const path of [
    '/',
    '/photos',
    '/rides',
    '/rides/chiang-mai-pai',
    '/rides/da-nang-hai-van',
    '/rides/doi-inthanon',
    '/rides/daibutsu',
    '/vlogs',
    '/places',
    '/atlas',
    '/posts',
    '/posts/dear-chiang-mai',
  ]) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) fail(`${path} overflows at ${width}px by ${overflow}px`);
  }
  ok(`no horizontal overflow at ${width}px`);
}

async function settle(target) {
  await target.evaluate(async () => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 160));
    }
    await new Promise((resolve) => setTimeout(resolve, 450));
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  });
  await target.waitForTimeout(650);
}

console.log('\nScreenshots');
await page.setViewportSize({ width: 1440, height: 1000 });
for (const [path, name] of [
  ['/', 'home-desktop'],
  ['/photos', 'photos-desktop'],
  ['/rides/nan-loop', 'ride-desktop'],
  ['/rides/chiang-mai-pai', 'ride-chiang-mai-desktop'],
  ['/rides/da-nang-hai-van', 'ride-da-nang-desktop'],
  ['/rides/doi-inthanon', 'ride-doi-inthanon-desktop'],
  ['/rides/daibutsu', 'ride-daibutsu-desktop'],
  ['/vlogs', 'vlogs-desktop'],
  ['/places', 'places-desktop'],
  ['/atlas', 'atlas-desktop'],
  ['/about', 'about-desktop'],
  ['/posts', 'writing-desktop'],
  ['/posts/dear-chiang-mai', 'post-desktop'],
]) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await settle(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  ok(`${OUT}/${name}.png`);
}

await page.setViewportSize({ width: 390, height: 844 });
for (const [path, name] of [
  ['/', 'home-mobile'],
  ['/photos', 'photos-mobile'],
  ['/places', 'places-mobile'],
  ['/atlas', 'atlas-mobile'],
  ['/posts', 'writing-mobile'],
  ['/posts/dear-chiang-mai', 'post-mobile'],
]) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await settle(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  ok(`${OUT}/${name}.png`);
}

console.log('\nInternal links');
{
  await page.setViewportSize({ width: 1440, height: 1000 });
  const links = new Set();
  for (const path of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
    const hrefs = await page.$$eval('a[href]', (anchors) =>
      anchors.map((anchor) => anchor.getAttribute('href')),
    );
    hrefs.forEach((href) => {
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
      if (href.startsWith('http') && !href.startsWith(BASE)) return;
      links.add(href.startsWith('/') ? href : new URL(href, `${BASE}${path}`).pathname);
    });
  }

  let broken = 0;
  for (const link of links) {
    const response = await context.request.get(`${BASE}${link}`, { maxRedirects: 3 });
    if (response.status() >= 400) {
      broken += 1;
      fail(`broken internal link ${link} (${response.status()})`);
    }
  }
  if (!broken) ok(`${links.size} internal links resolve`);
}

await browser.close();

console.log('\nConsole errors');
if (consoleErrors.length) {
  consoleErrors.forEach((entry) => fail(`console: ${entry.url} — ${entry.text}`));
} else {
  ok('no console errors');
}

console.log(`\n${failures.length ? `${failures.length} failure(s)` : 'All checks passed'}`);
process.exit(failures.length ? 1 : 0);
