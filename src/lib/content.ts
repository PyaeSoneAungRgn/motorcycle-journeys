import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { toGalleryItem, type GalleryItem } from './gallery';
import { getRouteGeometry } from './routes';
import type { MapRoute } from './map-types';

export type Ride = CollectionEntry<'rides'>;
export type Vlog = CollectionEntry<'vlogs'>;
export type Post = CollectionEntry<'posts'>;
export type Photo = CollectionEntry<'photos'>;
export type Place = CollectionEntry<'places'>;

export async function getRides(): Promise<Ride[]> {
  const rides = await getCollection('rides');
  return rides.sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());
}

export async function getVlogs(): Promise<Vlog[]> {
  const vlogs = await getCollection('vlogs');
  const sorted = vlogs.sort((a, b) => {
    const date = b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
    return date !== 0 ? date : b.data.episode - a.data.episode;
  });

  // Multi-part films share a `series`: keep the parts together, in episode
  // order, at the position of the newest part.
  const groups = new Map<string, Vlog[]>();
  for (const vlog of sorted) {
    const key = vlog.data.series ?? vlog.id;
    const group = groups.get(key);
    if (group) group.push(vlog);
    else groups.set(key, [vlog]);
  }

  return [...groups.values()].flatMap((group) =>
    group.sort((a, b) => a.data.episode - b.data.episode),
  );
}

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPhotos(): Promise<Photo[]> {
  const photos = await getCollection('photos');
  return photos.sort(
    (a, b) => (a.data.takenAt?.valueOf() ?? 0) - (b.data.takenAt?.valueOf() ?? 0),
  );
}

export async function getPlaces(): Promise<Place[]> {
  const places = await getCollection('places');
  return places.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function toMapRoute(ride: Ride): MapRoute {
  return {
    id: ride.id,
    name: ride.data.title,
    region: `${ride.data.region}, ${ride.data.country}`,
    label: ride.data.mapLabel ?? ride.data.region,
    distanceKm: ride.data.distanceKm,
    days: ride.data.days,
    geometry: getRouteGeometry(ride.id).coordinates,
    stops: ride.data.stops,
  };
}

export function photosForRide(
  photos: Photo[],
  rideId: string,
  limit?: number,
): GalleryItem[] {
  const items = photos.filter((photo) => photo.data.ride?.id === rideId).map(toGalleryItem);
  return typeof limit === 'number' ? items.slice(0, limit) : items;
}

export function findVlogForRide(vlogs: Vlog[], rideId: string): Vlog | undefined {
  return vlogsForRide(vlogs, rideId)[0];
}

export function vlogsForRide(vlogs: Vlog[], rideId: string): Vlog[] {
  return vlogs
    .filter((vlog) => vlog.data.ride.id === rideId)
    .sort((a, b) => a.data.episode - b.data.episode);
}

export function stillsForVlog(
  photos: Photo[],
  vlog: Vlog,
  rideId: string,
  limit = 3,
): GalleryItem[] {
  const byFile = new Map(photos.map((photo) => [photo.data.file, photo]));
  const chosen = vlog.data.stills.flatMap((file) => {
    const photo = byFile.get(file);
    return photo ? [toGalleryItem(photo)] : [];
  });
  return chosen.length > 0 ? chosen : photosForRide(photos, rideId, limit);
}

export function neighbours<T extends { id: string }>(items: T[], id: string) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    previous: items[(index - 1 + items.length) % items.length],
    next: items[(index + 1) % items.length],
  };
}

export function totalDistance(rides: Ride[]): number {
  return rides.reduce((total, ride) => total + ride.data.distanceKm, 0);
}

/** Earliest journey year, used for the “Since” and “EST.” labels. */
export function journalSince(rides: Ride[]): number {
  if (rides.length === 0) return new Date().getFullYear();
  return Math.min(...rides.map((ride) => ride.data.startDate.getFullYear()));
}
