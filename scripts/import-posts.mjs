#!/usr/bin/env node
/**
 * Import the legacy VitePress blog into the Astro site.
 *
 *   pnpm posts:import
 *
 * Reads `old-blog/posts/*.md`, keeps the original filenames (so the old
 * `/posts/<slug>` URLs keep working), rewrites production URLs to
 * root-relative ones, and copies the referenced blog media and the Yati
 * Myanmar font into `public/assets/`. Photos and screenshots are resized to
 * a sane 1600px long edge so the archive does not ship 10 MB originals.
 *
 * The output is committed: this is a one-way migration, not a runtime
 * dependency on the old blog folder.
 */
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const sourceDir = path.join(root, 'old-blog/posts');
const targetDir = path.join(root, 'src/content/posts');
const assetDir = path.join(root, 'old-blog/public/assets');
const publicAssetDir = path.join(root, 'public/assets');

if (!existsSync(sourceDir)) {
  console.error(`Missing legacy posts at ${sourceDir}`);
  process.exit(1);
}

function ogImage(head) {
  if (!Array.isArray(head)) return undefined;
  for (const entry of head) {
    const [tag, attributes] = entry ?? [];
    if (tag === 'meta' && attributes?.property === 'og:image' && attributes.content) {
      return String(attributes.content);
    }
  }
  return undefined;
}

function dateString(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid post date: ${value}`);
  return date.toISOString().slice(0, 10);
}

function rewriteUrls(text) {
  return (
    text
      .replaceAll('https://pyaesoneaung.dev/assets/', '/assets/')
      .replaceAll('http://pyaesoneaung.dev/assets/', '/assets/')
      .replaceAll('https://pyaesoneaung.dev/posts/', '/posts/')
      .replaceAll('http://pyaesoneaung.dev/posts/', '/posts/')
      // Old top-level post links (the previous site redirects these to /posts/).
      .replace(/https?:\/\/pyaesoneaung\.dev\/([a-z0-9][\w-]*)(?=[)"'\s<>]|$)/g, (match, slug) => {
        const target = slugAliases.get(slug) ?? slug;
        return legacySlugs.has(target) ? `/posts/${target}` : match;
      })
      // Old YouTube embeds: use the privacy-enhanced host and lazy-load them.
      .replaceAll('https://www.youtube.com/embed/', 'https://www.youtube-nocookie.com/embed/')
      .replace(/<iframe\b(?![^>]*\bloading=)/g, '<iframe loading="lazy"')
      .replace(/<video\b(?![^>]*\bpreload=)/g, '<video preload="metadata"')
      .replace(/<video\b(?![^>]*\bplaysinline\b)/g, '<video playsinline')
  );
}

await mkdir(targetDir, { recursive: true });
await mkdir(path.join(publicAssetDir, 'img/blog'), { recursive: true });
await mkdir(path.join(publicAssetDir, 'font'), { recursive: true });

const files = (await readdir(sourceDir)).filter((file) => file.endsWith('.md')).sort();
const legacySlugs = new Set(files.map((file) => file.replace(/\.md$/, '')));
// The old post itself links to /fliament, a typo in the original article.
const slugAliases = new Map([['fliament', 'filament']]);
const referencedAssets = new Set();
const imported = [];

for (const file of files) {
  const raw = await readFile(path.join(sourceDir, file), 'utf8');
  const { data: frontmatter, content } = matter(raw);

  if (!frontmatter.title) throw new Error(`${file} has no title`);
  if (!frontmatter.date) throw new Error(`${file} has no date`);
  if (!frontmatter.description) throw new Error(`${file} has no description`);

  const body = rewriteUrls(content).replace(/^\n+/, '');
  for (const match of body.matchAll(/\/assets\/img\/blog\/[^)"'\s<>?#]+/g)) {
    referencedAssets.add(match[0]);
  }

  const data = {
    title: String(frontmatter.title),
    date: dateString(frontmatter.date),
    description: String(frontmatter.description),
  };

  const image = ogImage(frontmatter.head);
  if (image) data.image = rewriteUrls(image);

  await writeFile(path.join(targetDir, file), matter.stringify(body, data), 'utf8');
  imported.push({ file, title: data.title, date: data.date });
}

// Keep only the media the imported posts actually use — the old folder also
// contains macOS metadata and a few unused screenshots.
const blogTarget = path.join(publicAssetDir, 'img/blog');
await rm(blogTarget, { recursive: true, force: true });
await mkdir(blogTarget, { recursive: true });

async function copyMedia(source, target) {
  const extension = path.extname(source).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
    await cp(source, target, { force: true });
    return;
  }

  const image = sharp(source, { failOn: 'none' }).rotate().resize({
    width: 1600,
    height: 1600,
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (extension === '.png') {
    await image.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(target);
  } else {
    await image.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(target);
  }
}

const missing = [];
for (const asset of referencedAssets) {
  const relative = asset.replace(/^\//, '');
  const source = path.join(root, 'old-blog/public', relative);
  const target = path.join(root, 'public', relative);
  if (!existsSync(source)) {
    missing.push(asset);
    continue;
  }
  await mkdir(path.dirname(target), { recursive: true });
  await copyMedia(source, target);
}

await mkdir(path.join(publicAssetDir, 'font'), { recursive: true });
await cp(path.join(assetDir, 'font/yati.ttf'), path.join(publicAssetDir, 'font/yati.ttf'), {
  force: true,
});

console.log(`Imported ${imported.length} posts into src/content/posts`);
console.log(`Copied ${referencedAssets.size - missing.length} referenced assets and Yati into public/assets`);
if (missing.length) {
  console.warn(`\n${missing.length} referenced asset(s) missing:`);
  for (const asset of missing) console.warn(`  ${asset}`);
  process.exitCode = 1;
}

for (const post of imported) {
  console.log(`  ${post.date}  ${post.file.replace(/\.md$/, '')}  — ${post.title}`);
}
