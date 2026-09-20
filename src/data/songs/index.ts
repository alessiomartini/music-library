import type { Score } from '../../lib/score';
import type { Song } from '../../lib/types';
import { loadScoreJson, ScoreJsonValidationError } from '../../lib/scoreLoader';
import { yourSong } from './your-song';
import { yesterday } from './yesterday';
import { blackbird } from './blackbird';
import { something } from './something';
import { amaraTerraMia } from './amara-terra-mia';
import yourSongScoreJson from './your-song.json';
import eCercaScoreJson from './e-cerca-e-me-capi.json';

// Score JSON assets are curated offline data, not application code: a
// malformed one (e.g. mid-curation) must not crash every page. Fall back to
// no score rather than throwing, and surface the problem in the console so
// it gets fixed at the source.
function tryLoadScoreJson(title: string, json: unknown): Score | undefined {
  try {
    return loadScoreJson(json);
  } catch (error) {
    if (error instanceof ScoreJsonValidationError) {
      console.error(`Invalid score JSON for "${title}":\n${error.message}`);
    } else {
      throw error;
    }
    return undefined;
  }
}

export const songs: Song[] = [
  {
    ...yourSong,
    score: tryLoadScoreJson('Your Song', yourSongScoreJson),
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
    score: tryLoadScoreJson("E cerca 'e me capi", eCercaScoreJson),
  },
  yesterday,
  blackbird,
  something,
  amaraTerraMia,
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((s) => s.slug === slug);
}
