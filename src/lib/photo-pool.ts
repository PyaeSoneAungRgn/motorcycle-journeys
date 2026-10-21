import { getImage } from 'astro:assets';
import type { Photo } from './content';
import { getPhoto } from './photos';

/**
 * Everything the home page needs to swap a photograph in the strip without a
 * round trip. The widths match the archive grid so the optimised files are
 * shared between the two pages instead of being generated twice.
 */
export interface PhotoPoolItem {
  id: string;
  src: string;
  srcset: string;
  width: number;
  height: number;
  full: string;
  alt: string;
  caption: string;
  location: string;
  film?: string;
  ride?: string;
}

export async function buildPhotoPool(photos: Photo[]): Promise<PhotoPoolItem[]> {
  return Promise.all(
    photos.map(async (photo) => {
      const image = getPhoto(photo.data.file);
      const optimised = await getImage({
        src: image,
        widths: [400, 640, 900, 1200],
      });

      return {
        id: photo.id,
        src: optimised.src,
        srcset: optimised.srcSet.attribute,
        width: image.width,
        height: image.height,
        full: image.src,
        alt: photo.data.alt,
        caption: photo.data.caption,
        location: photo.data.location,
        film: photo.data.film,
        ride: photo.data.ride?.id,
      };
    }),
  );
}
