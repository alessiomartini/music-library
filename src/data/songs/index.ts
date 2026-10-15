import type { Score } from '../../lib/score';
import type { Song, SongLinks } from '../../lib/types';
import { loadScoreJson, ScoreJsonValidationError } from '../../lib/scoreLoader';
import { yourSong } from './your-song';
import { yesterday } from './yesterday';
import { blackbird } from './blackbird';
import { something } from './something';
import { amaraTerraMia } from './amara-terra-mia';
import { annaEMarco } from './anna-e-marco';
import { savedSongs } from './saved';
import { chordSiteLinks } from './chordSiteLinks';
import { spotifyLinks, spotifySongs } from './spotify';
import { songKeys } from './keys';
import yourSongScoreJson from './your-song.json';
import eCercaScoreJson from './e-cerca-e-me-capi.json';
import annaEMarcoScoreJson from './anna-e-marco.json';

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

const allSongs: Song[] = [
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
  {
    ...annaEMarco,
    score: tryLoadScoreJson('Anna e Marco', annaEMarcoScoreJson),
  },
  ...savedSongs,
  ...spotifySongs,
];

// The best liked Spotify recording replaces a Spotify search link, never a
// curated track link; the other recordings are listed as versions.
function spotifyFor(s: Song): Partial<SongLinks> {
  const liked = spotifyLinks[s.slug];
  if (!liked) return {};
  const spotify = !s.links.spotify || s.links.spotify.includes('/search/') ? liked[0].url : s.links.spotify;
  const spotifyVersions = liked.filter((v) => v.url !== spotify);
  return spotifyVersions.length ? { spotify, spotifyVersions } : { spotify };
}

const query = (s: Song) => encodeURIComponent(`${s.title} ${s.artist}`);

/** Every song links to Spotify and YouTube: its own recording when known, else a search. */
function withLinks(s: Song): Song {
  const links = { ...chordSiteLinks[s.slug], ...s.links, ...spotifyFor(s) };
  links.spotify ??= `https://open.spotify.com/search/${query(s)}`;
  links.youtube ??= `https://www.youtube.com/results?search_query=${query(s)}`;
  const liked = spotifyLinks[s.slug];
  const albumImage = s.albumImage ?? (liked?.find((v) => v.url === links.spotify) ?? liked?.[0])?.albumImage;
  const keyEstimate = s.originalKey ? undefined : songKeys[s.slug];
  return { ...s, links, ...(albumImage && { albumImage }), ...(keyEstimate && { keyEstimate }) };
}

const words = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);

/** Covers of a song: Spotify versions by other artists, and saved Instagram posts. */
export function coverCount(s: Song): number {
  const own = new Set(words(s.artist));
  const spotifyCovers = (s.links.spotifyVersions ?? []).filter((v) => !words(v.artist).some((w) => own.has(w)));
  return spotifyCovers.length + (s.links.instagram?.length ?? 0);
}

export const songs: Song[] = allSongs.map(withLinks);

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((s) => s.slug === slug);
}
