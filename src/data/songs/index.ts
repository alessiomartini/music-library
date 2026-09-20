import type { Song } from '../../lib/types';
import { yourSong } from './your-song';
import { yesterday } from './yesterday';
import { blackbird } from './blackbird';
import { something } from './something';
import { amaraTerraMia } from './amara-terra-mia';
import yourSongScore from './your-song.json';
import eCercaScore from './e-cerca-e-me-capi.json';

export const songs: Song[] = [
  {
    ...yourSong,
    score: yourSongScore as any,
  },
  {
    slug: 'e-cerca-e-me-capi',
    title: "E cerca 'e me capi",
    artist: 'Pino Daniele',
    composer: 'Pino Daniele',
    originalKey: 'Bb',
    capo: 1,
    timeSignature: '4/4',
    tempoBpm: 112,
    tempoMarking: 'Moderato',
    links: {
      spotify: 'https://open.spotify.com/search/E%20cerca%20e%20me%20capi%20Pino%20Daniele',
      youtube: 'https://www.youtube.com/watch?v=gBfnI31x8Mw',
    },
    history: "E cerca 'e me capi is one of Pino Daniele's most beloved songs, blending Neapolitan tradition with blues and jazz influences.",
    score: eCercaScore as any,
  },
  yesterday,
  blackbird,
  something,
  amaraTerraMia,
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((s) => s.slug === slug);
}
