import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getPhoto } from './photos';

export type GalleryItem = {
  image: ImageMetadata;
  alt: string;
  caption: string;
  location: string;
  film?: string;
  full: string;
  ride?: string;
};

export function toGalleryItem(photo: CollectionEntry<'photos'>): GalleryItem {
  const image = getPhoto(photo.data.file);
  return {
    image,
    alt: photo.data.alt,
    caption: photo.data.caption,
    location: photo.data.location,
    film: photo.data.film,
    full: image.src,
    ride: photo.data.ride?.id,
  };
}
