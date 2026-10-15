/** A Wikimedia Commons photo of an artist. */
export interface ArtistPhoto {
  /** Thumbnail URL (320 px wide). */
  url: string;
  /** Commons file page (licence and full credits). */
  page: string;
  /** Year the photo was taken, when Commons knows it. */
  year?: number;
  credit: string;
  license: string;
  /** The artist's main Wikidata image. */
  main?: boolean;
}

/** What Wikidata and Commons know about a song's artist (scripts/fetch-artists.ts). */
export interface ArtistInfo {
  /** Name that matched on Wikidata. */
  name: string;
  wikidata: string;
  /** Wikidata voice type (P412), e.g. "baritone". */
  voiceType?: string;
  sex?: 'male' | 'female';
  photos: ArtistPhoto[];
}

/**
 * The photo closest in time to the song: the dated photo nearest its year,
 * else the main image (or the first photo).
 */
export function photoForYear(photos: ArtistPhoto[], year?: number): ArtistPhoto | undefined {
  const dated = photos.filter((p) => p.year);
  if (year && dated.length) {
    return dated.reduce((a, b) => (Math.abs(b.year! - year) < Math.abs(a.year! - year) ? b : a));
  }
  return photos.find((p) => p.main) ?? photos[0];
}
