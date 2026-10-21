import type { Photo } from './content';
import { getPhoto } from './photos';

function shuffled<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

/**
 * Pick a random landscape, a random portrait and one more photograph for the home
 * strip. Runs at build time, so rebuild the site for a new selection.
 */
export function pickRandomPhotos(
  photos: Photo[],
  count = 3,
  random: () => number = Math.random,
): Photo[] {
  if (photos.length <= count) return [...photos];

  const landscape: Photo[] = [];
  const portrait: Photo[] = [];

  photos.forEach((photo) => {
    const image = getPhoto(photo.data.file);
    (image.width >= image.height ? landscape : portrait).push(photo);
  });

  const picked: Photo[] = [];
  const add = (candidates: Photo[]) => {
    const next = candidates.find((photo) => !picked.some((item) => item.id === photo.id));
    if (next) picked.push(next);
  };

  add(shuffled(landscape, random));
  add(shuffled(portrait, random));
  add(shuffled(photos, random));

  for (const photo of shuffled(photos, random)) {
    if (picked.length >= count) break;
    if (!picked.some((item) => item.id === photo.id)) picked.push(photo);
  }

  return picked.slice(0, count);
}
