import type { PhotoPoolItem } from '../lib/photo-pool';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function readPool(): PhotoPoolItem[] {
  const node = document.getElementById('home-photo-pool');
  if (!node?.textContent) return [];

  try {
    const data: unknown = JSON.parse(node.textContent);
    return Array.isArray(data) ? (data as PhotoPoolItem[]) : [];
  } catch {
    return [];
  }
}

const strip = document.querySelector<HTMLElement>('[data-random-photos]');
const figures = strip
  ? Array.from(strip.querySelectorAll<HTMLElement>('.photo-strip__item'))
  : [];
const pool = readPool();

if (strip && figures.length > 0 && pool.length > figures.length) {
  // The build already picked a set. Exclude it so a refresh visibly changes.
  const shown = new Set(figures.map((figure) => figure.dataset.photoId).filter(Boolean));
  const unseen = pool.filter((photo) => !shown.has(photo.id));
  const candidates = unseen.length >= figures.length ? unseen : pool;

  const landscape = candidates.filter((photo) => photo.width >= photo.height);
  const portrait = candidates.filter((photo) => photo.width < photo.height);

  const picked: PhotoPoolItem[] = [];
  const add = (photos: PhotoPoolItem[]) => {
    const next = photos.find((photo) => !picked.includes(photo));
    if (next) picked.push(next);
  };

  // Mirror the build-time composition: a landscape, a portrait, then any frame.
  add(shuffle(landscape));
  add(shuffle(portrait));
  add(shuffle(candidates));

  for (const photo of shuffle(candidates)) {
    if (picked.length >= figures.length) break;
    if (!picked.includes(photo)) picked.push(photo);
  }

  figures.forEach((figure, index) => {
    const photo = picked[index];
    if (!photo) return;

    const link = figure.querySelector<HTMLAnchorElement>('a[data-photo]');
    const image = figure.querySelector<HTMLImageElement>('img');
    const location = figure.querySelector<HTMLElement>('.loc');
    const film = location?.nextElementSibling;

    if (link) {
      link.href = photo.full;
      link.dataset.full = photo.full;
      link.dataset.caption = photo.caption;
      link.dataset.location = photo.location;
      link.dataset.film = photo.film ?? '';
      link.dataset.alt = photo.alt;
      if (photo.ride) link.dataset.ride = photo.ride;
      else delete link.dataset.ride;
      link.setAttribute('aria-label', `Open photograph: ${photo.caption}, ${photo.location}`);
    }

    if (image) {
      // srcset first so the browser does not fetch the fallback needlessly.
      image.srcset = photo.srcset;
      image.src = photo.src;
      image.alt = photo.alt;
      image.width = photo.width;
      image.height = photo.height;
    }

    if (location) location.textContent = photo.location;
    if (film) film.textContent = photo.film ?? '';
    figure.dataset.photoId = photo.id;
  });
}
