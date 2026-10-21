# Pyae Sone Aung — Motorcycle Journals

A white-only, vintage-editorial site for travel photographs and motorcycle films, with an
interactive road atlas. Built with Astro 7 and static-deployed.

The journal has five entries. **The Nan Loop** is five days around Nan province, northern
Thailand, from the bridge at Sapan and the Piang So sky road to Doi Phu Kha and the rice fields
of Pua. **Chiang Mai & Pai** is a New Year run north — coffee above Mae Rim, cherry blossoms at
Khun Chang Khian, the canyon at Pai and the mountains of Chiang Dao. **Da Nang & Hai Van Pass**
is two days in central Vietnam, from the Dragon Bridge and the Lady Buddha on Son Tra to the
climb over the pass. **Doi Inthanon** is a day loop from Chiang Mai to the highest spot in
Thailand. **Daibutsu** is a day run south from Chiang Mai to the teal Great Buddha at Doi Phra
Chan in Lampang. Chiang Mai & Pai and Da Nang & Hai Van Pass are point-to-point; Doi Inthanon
and Daibutsu are day loops.

**Other places** is the separate archive of one-off films that never became a journalled trip —
Mon Jam, Samoeng Forest, Mae Kampong, Doi Pui, Doi Kham and the old city gate. They carry their
own coordinates and dates, but no route, distance or episode number.

The design is deliberately quiet: warm white paper, ink and sepia, Newsreader for display,
Inter for interface, IBM Plex Mono for coordinates and metadata. There is **no dark theme** —
`color-scheme: light` is set at the root and no `prefers-color-scheme` rules exist.

The old personal blog is still here, kept quietly at `/posts` and at its original
`/posts/<slug>` addresses.

## Stack

- **Astro 7** (static output, no UI framework, no Tailwind)
- **MapLibre GL JS + OpenFreeMap Positron** for the key-free vector basemap
- **Astro Fonts API** self-hosting Newsreader, Inter and IBM Plex Mono
- **astro:assets + sharp** for responsive AVIF/WebP imagery
- **Content collections** (Zod-validated rides, vlogs, places, writing and photographs)
- **pnpm**

### Why MapLibre instead of Leaflet

The original plan used Leaflet with CARTO raster tiles. CARTO now returns `API KEY REQUIRED` for
those basemaps, so the atlas uses OpenFreeMap's Positron style — a pale, label-light
OpenStreetMap-derived vector basemap — rendered with MapLibre. It is key-free, self-hostable and
much closer to the vintage-paper brief.

## Getting started

Requires Node **22.22+** and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # writes dist/
pnpm preview      # serve the production build
```

In sandboxed environments Astro telemetry may fail writing to `~/Library/Preferences/astro`.
Prefix commands with `ASTRO_TELEMETRY_DISABLED=1` if needed.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Static production build |
| `pnpm preview` | Preview the build locally |
| `pnpm check` | Astro + TypeScript diagnostics |
| `pnpm routes` | Regenerate route geometry from OSRM (dev only) |
| `pnpm posts:import` | Re-import the legacy blog from `old-blog/posts/` (one-way) |
| `pnpm qa` | Browser QA against a running preview (see below) |

## Current content

- **5 rides:** the Nan Loop (13–17 October 2026, 287 km, five days, 13 stops), Chiang Mai & Pai
  (28 December 2025 – 3 January 2026, 448 km, seven days, 8 stops), Da Nang & Hai Van Pass
  (20–21 September 2025, 63 km, two days, 7 stops), Doi Inthanon (10 May 2025, 206 km, one day,
  5 stops) and Daibutsu (14 December 2024, 236 km, one day, 3 stops). The Thai trips used a Honda
  Wave and a Yamaha QBIX; Vietnam used a rental scooter.
- **75 photographs** across the five trips (27 Nan, 22 Chiang Mai, 15 Da Nang, 5 Doi Inthanon,
  6 Daibutsu), with locations and capture dates taken from the originals' EXIF.
- **11 short films** (2:49 total) — self-hosted, click-to-play clips. The Nan Loop has five (the
  temple lights, the road north, the bridge in the rain, the Ban Piang So ridge and the road
  to Pua); Chiang Mai has three (Pai canyon,
  the New Year gathering and the First Valley fireplace); Da Nang has one (the ride to the pass);
  Doi Inthanon has two (the royal gardens and the pagoda in fog).
- **3 time lapses** (1:32 total) — *Yud Vela cafe* over the Nan valley, *Last sunset of 2025*
  over Pai and *Clouds over Chiang Dao*. All three aggregate on the home page and appear on their
  ride pages.
- **9 long-form episodes** (6:39 total) — five from Chiang Mai & Pai (including the Pai sunset
  short), two from the Daibutsu day ride, plus the Da Nang to Hai Van Pass and Doi Inthanon
  episodes on YouTube, with local posters, episode-specific stills and a privacy-friendly
  click-to-load player.
- **13 one-off films** (7:10) — day rides around Chiang Mai, from Mon Jam and Samoeng Forest to
  Mae Kampong, Doi Pui, Doi Kham and Tha Phae Gate, kept outside the numbered journal in
  **Other places** and linked to YouTube.
- **30 pieces of writing** from the old blog — Laravel, PHP and tooling notes plus a few travel
  stories — kept at their original `/posts/<slug>` URLs.

There is no CMS; everything is file-based.

```
src/content/rides/nan-loop.md        the Nan Loop, its stops and journal text
src/content/rides/chiang-mai-pai.md  the Chiang Mai & Pai trip
src/content/rides/da-nang-hai-van.md the Da Nang & Hai Van Pass trip
src/content/rides/doi-inthanon.md    the Doi Inthanon day loop
src/content/rides/daibutsu.md        the Daibutsu day ride to Doi Phra Chan
src/data/photos.json                 the photograph archive
src/data/places.json                 one-off place films, dates and coordinates
src/assets/photos/*.jpg              optimised photos and film posters (1600px long edge)
src/data/routes/*.json               committed road geometry, one file per ride
src/content/vlogs/*.md               one Markdown file per long-form film
src/components/PlaceCard.astro       the outside-link card used by Other places
src/pages/places.astro               the Other places index
public/videos/*.mp4                  web-ready clips and time lapses
src/content/posts/*.md               legacy blog posts, filename = slug
public/assets/img/blog/*             images used by the imported posts
public/assets/font/yati.ttf          Myanmar face for the writing archive
```

### Rides

Frontmatter is validated by `src/content.config.ts`:

```yaml
title: 'The Nan Loop'
summary: 'Five days around Nan province…'
region: 'Nan Province'
mapLabel: 'Nan Loop'          # short label on the atlas
country: 'Thailand'
season: 'October 2026'
startDate: 2026-10-13
endDate: 2026-10-17
distanceKm: 287
days: 5
bike: 'Honda Wave'
cover: 'nan-khun-nan.jpg'     # filename in src/assets/photos
featured: true
loop: true                     # false = point-to-point (used by the journey labels)
youtube: '…'                  # optional film for this ride
stops:
  - name: 'Sapan Bridge'
    lat: 19.1928
    lng: 101.1983
    note: 'The bridge over the river at Sapan.'
```

The Markdown body is rendered in the editorial prose column. The home “Since” stat, the hero
stamp and the footer year are derived from the earliest ride's `startDate`, so they update
automatically when an older trip is added.

### Short films

Short clips are attached to a ride in its frontmatter and self-hosted from `public/videos/`:

```yaml
clips:
  - title: 'Lights on the water'
    file: 'nan-lights.mp4'
    poster: 'nan-clip-lights.jpg'
    duration: '00:12'
    orientation: 'landscape'
    note: 'The temple grounds after dark, Nan'
    alt: 'A lake of blue and gold lights beneath a lit tree at night'
```

The short-film cards sit above the time lapse and photo archive on each ride page. They show a
poster and a play button, then swap to a native `<video controls>` element on click, so nothing is
downloaded until a visitor presses play. Clips are kept at 720p H.264 (AAC stereo audio) and
trimmed to 11–29 seconds (roughly 3–6 MB each).

### Time lapse

Each ride can carry one or more wide time lapses:

```yaml
timeLapses:
  - title: 'Yud Vela cafe'
    file: 'nan-timelapse-yud-vela.mp4'
    poster: 'nan-timelapse-yud-vela.jpg'
    duration: '00:31'
    note: 'Clouds moving over the valley'
    alt: 'Fog and clouds moving across a green valley seen from a cafe'
```

Each time lapse is silent, 1080p H.264, loops, and uses `preload="none"`. It autoplays muted only
while at least a third of the frame is in view, pauses when scrolled away, and has a single
Pause/Play control. With `prefers-reduced-motion: reduce`, it stays on the poster until the visitor
presses Play. The files are about 6–7 MB each and are only fetched when the section is reached.

On the home page, time lapses from every ride are aggregated into one section: the first item plays
automatically, and any additional items render as poster/play cards in a two-column grid. Adding a
new ride with a `timeLapses` entry automatically adds it to the home section, newest trip first.

### Photographs

Each entry needs an `id`, a `file` that exists in `src/assets/photos`, and real alt text:

```json
{
  "id": "nan-sky-road",
  "file": "nan-sky-road.jpg",
  "alt": "An empty asphalt road leading toward layered forested mountains",
  "caption": "The Piang So sky road",
  "location": "Piang So, Nan",
  "coords": [19.361, 101.1872],
  "ride": "nan-loop",
  "takenAt": "2026-10-15T12:38:45+07:00",
  "featured": true
}
```

- `ride` is optional; photographs without one appear under **Elsewhere** on `/photos`.
- Unknown filenames fail the build with a list of available files (`src/lib/photos.ts`).
- `alt` is required; it is used by the grid and the lightbox.
- Photos are sorted oldest-first by `takenAt`, so the gallery follows the trip.
- Source images are kept at 1600px on the long edge; Astro generates the responsive variants.
- The home page shows three random photographs — a landscape, a portrait and one more — and
  re-picks them on every page load (`src/scripts/random-photos.ts`). The build-time pick from
  `src/lib/random-photos.ts` remains as the no-JS fallback.

### Long-form films

Long-form episodes live in `src/content/vlogs/*.md` and use a click-to-load YouTube facade:

```yaml
title: 'Cherry blossoms at Khun Chang Khian'
episode: 2
publishedAt: 2026-02-28
duration: '51:36'
youtubeId: '…'
poster: 'cm-khun-chang-khian-blossoms.jpg'   # local poster, not a YouTube thumbnail
stills:                                       # optional, in order
  - 'cm-khun-chang-khian-blossoms.jpg'
  - 'cm-khun-chang-khian-house.jpg'
  - 'cm-khun-chang-khian-sign.jpg'
ride: 'chiang-mai-pai'
series: '…'                       # optional, groups multi-part films
location: 'Khun Chang Khian, Chiang Mai'
coords: [18.8399, 98.8981]
summary: '…'
featured: false
```

The player only loads `youtube-nocookie.com` after a visitor presses play, so no YouTube cookies are
set before that. A ride can have any number of episodes: the ride page shows a single embedded
player when there is one, and a grid of episode cards when there are several. Episodes that share a
`series` are kept together in episode order, at the position of the newest part, so a two-part film
reads Part 1 then Part 2 rather than newest first. `stills` picks the photographs shown on that
episode's page; without it the page falls back to the first three ride photographs. The Vlogs page
automatically switches from the empty state to the episode layout as soon as the first entry exists.

The Vlogs empty state links to the first ride's short clips so the moving-image work is still
reachable while the long-form episode is being edited.

### Other places

`/places` is the archive of one-off films that are not part of a ride and not numbered as
episodes: short day rides around Chiang Mai, each with a place, a date, coordinates and a local
poster. Cards link straight to the film on YouTube rather than loading a player on the page.

Entries live in `src/data/places.json` and are validated by the `places` collection:

```json
{
  "id": "mon-jam",
  "title": "Mon Jam",
  "location": "Mae Rim, Chiang Mai",
  "region": "Chiang Mai Province",
  "country": "Thailand",
  "coords": [18.9484, 98.7945],
  "publishedAt": "2024-11-25",
  "duration": "1:53:01",
  "youtubeId": "…",
  "poster": "pl-mon-jam.jpg",
  "summary": "Lavender beds and a long view over the Mae Rim valley."
}
```

- `poster` is a local 16:9 still in `src/assets/photos` (a YouTube thumbnail, resized to 1600px).
- `coords` and `region` are kept so the places can be added to a map later.
- Adding an entry immediately adds it to `/places`, newest first.

### Writing (the old blog)

The former VitePress blog now lives at `/posts` and `/posts/<slug>`. Posts are ordinary Markdown
in `src/content/posts/`, validated by `src/content.config.ts`:

```yaml
title: 'Dear Chiang Mai'
date: 2025-06-26
description: '…'                                       # archive row and meta description
image: '/assets/img/blog/dear-chiang-mai-img-2.jpg'    # optional social preview
draft: false                                           # optional; hides the post
```

The filename is the slug, so `dear-chiang-mai.md` keeps the old URL
`https://pyaesoneaung.dev/posts/dear-chiang-mai`. The archive is linked quietly from the home page
and the footer rather than the primary navigation.

The articles were imported from `old-blog/posts/`:

```bash
pnpm posts:import
```

The script keeps the original filenames, rewrites old `pyaesoneaung.dev/assets` and post URLs to
root-relative links, switches YouTube embeds to lazy-loaded `youtube-nocookie.com` players, and
copies the referenced media and `yati.ttf` into `public/assets/`. Photos and screenshots are
resized to a 1600px long edge (the original blog shipped a few 8000px files); GIFs and MP4s are
copied untouched. It overwrites `src/content/posts/`, so treat the imported copies as the source
once the old blog is retired.

Burmese text falls back to Yati through a unicode-range `@font-face`, while Latin text keeps
Newsreader and Inter. Code blocks use Shiki's `github-light` theme, restyled onto the warm paper
background.

### Adding another trip

1. Put the new photographs in `src/assets/photos/`.
2. Add a Markdown file under `src/content/rides/`, with stops and a cover filename.
3. Add the photo entries to `src/data/photos.json`, pointing `ride` at the new ride id.
4. Run `pnpm routes <ride-id>` to generate `src/data/routes/<ride-id>.json` from the stops
   (omit the id to rebuild every ride).
5. Add a vlog entry per film, with `stills` if the episode page should show specific photographs.

## Routes & the atlas

`scripts/fetch-routes.mjs` reads each ride's `stops`, calls the public OSRM demo server, simplifies
the LineString and writes `src/data/routes/<ride-id>.json`. That output is committed, so builds
never depend on a router or an API key. The script is dev-only; respect OSRM's rate limits.

With one ride, the atlas selects it automatically, reveals the numbered stops and disables
the "all routes" reset. With more rides, the atlas opens with all lines visible and the route
selector dims the others.

- Route names live in the atlas selector; hovering a route line shows its number, name and distance in a small tooltip.
- Atlas lines are drawn solid, heavier than the single-route maps, and backed by a wide paper halo so
  several routes stay legible over the basemap; the selected route grows further and the rest step back.
- Scroll zoom is off; drag and +/- controls are provided.
- If the basemap fails, the route remains drawn on the paper background and a note appears.
- Without JavaScript, the map area explains itself and the stop list remains readable.

Map attribution is rendered by MapLibre and must remain visible: © OpenStreetMap contributors,
OpenFreeMap and OpenMapTiles. If you swap the basemap, update `src/scripts/map.ts` and the credit
lines in the footer and `CREDITS.md`.

## Fonts

Fonts are declared in `astro.config.mjs` and fetched from Fontsource **at build time**, then served
locally from `/_astro/fonts` with preloads and generated fallback metrics. The build needs network
access the first time; Astro caches the files. For fully offline builds, install the
`@fontsource-variable/*` packages and import them from `src/styles/global.css` instead.

The writing archive adds one local face: Yati, a Myanmar typeface served from
`public/assets/font/yati.ttf` and scoped with `unicode-range` to Myanmar code points. It is a
fallback in the display, body and code stacks, so Latin text is unaffected.

## QA

```bash
pnpm build
pnpm preview --port 4321
pnpm qa
```

`scripts/qa.mjs` uses `playwright-core` with the system Chrome (override with `CHROME_PATH` or
`BASE_URL`). It checks every page for status/title/single-`h1`/overflow, verifies the lightbox,
photo filter, short-film playback, time-lapse controls, atlas multi-route behaviour, the writing
archive and old post URLs (including their inline images and embeds), white-only theme and internal
links, captures screenshots in `.qa/`, and fails on console errors.

## Deployment

The output is fully static (`dist/`), with no adapter. Deploy to Vercel, Netlify, Cloudflare Pages
or any static host. Set the Node version to 22.22+ for the build, and keep `site` in
`astro.config.mjs` in sync with the production domain.

## Notes

- Maps need network access at runtime; route geometry is committed and does not.
- Short clips and the time lapse are self-hosted; long-form films still use YouTube's
  privacy-enhanced embed.
- The writing archive keeps the old posts' media: YouTube embeds use `youtube-nocookie.com` and
  load lazily; Anchor.fm podcast embeds load directly, as they did on the old blog.
- MapLibre is code-split and only fetched on pages with a map, when the map approaches the viewport.
- Photographs © Pyae Sone Aung, 2024–2026. All rights reserved.
- No analytics, cookies, comments, search or CMS.
- The vintage treatment is CSS-based (sepia/desaturation plus a subtle grain overlay); hovering a
  photograph reveals its full colour.
