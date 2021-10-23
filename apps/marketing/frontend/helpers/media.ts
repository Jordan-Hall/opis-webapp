import { getStrapiURL } from './api';

export function getStrapiMedia(media: { url: string; }): string {
  const imageUrl = media.url.startsWith("/")
    ? getStrapiURL(media.url)
    : media.url;
  return imageUrl;
}
