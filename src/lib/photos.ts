import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('../assets/photos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const byName = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, image]) => [path.split('/').pop() ?? path, image]),
);

const available = [...byName.keys()].sort();

/**
 * Resolve a photo filename from content to its optimised Astro asset.
 * Throws loudly at build time so a typo can never ship a broken page.
 */
export function getPhoto(filename: string): ImageMetadata {
  const image = byName.get(filename);
  if (!image) {
    throw new Error(
      `Unknown photograph "${filename}". Available files:\n  ${available.join('\n  ')}`,
    );
  }
  return image;
}
