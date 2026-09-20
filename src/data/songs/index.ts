import type { Song } from '../../lib/types';
import { yourSong } from './your-song';
import { yesterday } from './yesterday';
import { blackbird } from './blackbird';
import { something } from './something';
import { amaraTerraMia } from './amara-terra-mia';
import yourSongScore from './your-song.json';

export const songs: Song[] = [
  {
    ...yourSong,
    score: yourSongScore as any,
  },
  yesterday,
  blackbird,
  something,
  amaraTerraMia,
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((s) => s.slug === slug);
}
