#!/usr/bin/env node
/**
 * Generate road-following route geometry for every ride, once.
 *
 *   pnpm routes
 *
 * Uses the public OSRM demo server (OpenStreetMap data). The output is
 * committed so production builds never depend on a third-party router.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

const RIDES_DIR = 'src/content/rides';
const OUT_DIR = 'src/data/routes';
const OSRM = 'https://router.project-osrm.org/route/v1/driving';
const DELAY_MS = 1200;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function route(stops, attempt = 1) {
  const coords = stops.map((stop) => `${stop.lng},${stop.lat}`).join(';');
  const url = `${OSRM}/${coords}?overview=simplified&geometries=geojson&continue_straight=false`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'pyaesoneaung.dev-route-builder/1.0' },
      signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) {
      throw new Error(`OSRM error: ${data.code ?? 'unknown'}`);
    }
    return data.routes[0];
  } catch (error) {
    if (attempt >= 3) throw error;
    console.warn(`  retry ${attempt + 1}/3 (${error.message})`);
    await sleep(2500 * attempt);
    return route(stops, attempt + 1);
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const only = process.argv[2];
  const files = (await readdir(RIDES_DIR))
    .filter((file) => file.endsWith('.md'))
    .filter((file) => !only || file === `${only}.md`);
  files.sort();

  for (const file of files) {
    const id = file.replace(/\.md$/, '');
    const raw = await readFile(join(RIDES_DIR, file), 'utf8');
    const { data } = matter(raw);
    const stops = data.stops ?? [];

    if (stops.length < 2) {
      console.warn(`- ${id}: fewer than two stops, skipping`);
      continue;
    }

    console.log(`- ${id}: ${stops.length} stops, ${stops[0].name} → ${stops.at(-1).name}`);
    const result = await route(stops);
    const coordinates = result.geometry.coordinates.map(([lng, lat]) => [
      Number(lng.toFixed(5)),
      Number(lat.toFixed(5)),
    ]);

    await writeFile(
      join(OUT_DIR, `${id}.json`),
      `${JSON.stringify({ type: 'LineString', coordinates })}\n`,
      'utf8',
    );

    const km = Math.round(result.distance / 1000);
    const declared = Number(data.distanceKm ?? 0);
    const drift = declared ? Math.round(((declared - km) / declared) * 100) : 0;
    console.log(
      `  ${coordinates.length} points · OSRM ${km} km · journal ${declared || '—'} km${
        declared ? ` (${drift > 0 ? '+' : ''}${drift}% journal)` : ''
      }`,
    );

    await sleep(DELAY_MS);
  }

  console.log('Done. Route geometry written to', OUT_DIR);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
