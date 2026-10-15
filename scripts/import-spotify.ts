/**
 * Imports Alessio's Spotify Liked Songs and playlists as light song entries.
 *
 * Input is one or more Exportify CSVs (https://exportify.app); a track in
 * several of them counts once. Output is src/data/songs/spotify.ts:
 *   - `spotifyLinks`: the liked recordings of songs already in the library,
 *     best first (the first replaces a Spotify search link, never a curated
 *     track link; the rest become `links.spotifyVersions`);
 *   - `spotifySongs`: one light entry per song not in the library yet.
 *
 * Recordings of the same song (remasters, live/acoustic takes, remixes,
 * covers) collapse onto one entry, keyed by cleaned-up title: the best one is
 * `links.spotify`, the others `links.spotifyVersions`. Local files have no
 * Spotify link and are skipped. Hand-curated fixes live in
 * scripts/spotify-overrides.ts.
 *
 * Run with:  npm run import:spotify -- liked.csv guitar.csv ...
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { songs } from '../src/data/songs';
import { spotifySongs as previousImport } from '../src/data/songs/spotify';
import { classicalComposers, overrides } from './spotify-overrides';

const OUT = 'src/data/songs/spotify.ts';

interface Track {
  id: string;
  rawTitle: string;
  artists: string[];
  popularity: number;
  released: string;
  /** This recording's song title and artist, after cleanup and overrides. */
  title: string;
  artist: string;
  curated: boolean;
  classical: boolean;
}

interface Entry {
  key: string;
  /** Existing library song this entry is attached to, if any. */
  slug?: string;
  tracks: Track[];
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== '')) rows.push(row);
  return rows;
}

/** Exportify joins artists with "," and escapes commas inside names as "\,". */
function splitArtists(field: string): string[] {
  return field.split(/(?<!\\),/).map((a) => a.replace(/\\,/g, ',').trim()).filter(Boolean);
}

/** Drops version/feature decorations: "X - 2009 Remaster", "X (feat. Y)". */
function cleanTitle(raw: string, classical: boolean): string {
  let t = raw.replace(/（/g, ' (').replace(/）/g, ')');
  if (classical) return t.replace(/\s+-\s+Remastered.*$/i, '').trim();
  t = t.replace(/\s+[-–]\s+.*$/, '');
  t = t.replace(/\s*\((feat\.|featuring |with |con |prod\.|remix|live|edit|piano version|humming|demo|waltz version|from )[^)]*\)/gi, '');
  t = t.replace(/\s+feat\.\s.*$/i, '');
  return t.replace(/\s+/g, ' ').trim();
}

/** Artists credited only as features ("(feat. Y)", "(with Y)") or remixers ("X - Y Remix") are dropped. */
function mainArtists(raw: string, artists: string[]): string[] {
  const credits = [...raw.matchAll(/\((?:feat\.|with|con)\s([^)]*)\)|\sfeat\.\s(.*)$|\s[-–]\s(.*)$/gi)]
    .map((m) => (m[1] ?? m[2] ?? m[3]).toLowerCase());
  const main = artists.filter((a) => !credits.some((f) => f.includes(a.toLowerCase())));
  return main.length ? main : artists.slice(0, 1);
}

export function norm(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(s: string): string {
  return norm(s).replace(/ and /g, ' ').replace(/\s+/g, '-');
}

const csvPaths = process.argv.slice(2);
if (!csvPaths.length) {
  console.error('usage: npm run import:spotify -- liked.csv [playlist.csv ...]');
  process.exit(1);
}
const records: Record<string, string>[] = [];
for (const path of csvPaths) {
  const [header, ...rows] = parseCsv(readFileSync(path, 'utf8'));
  for (const name of ['Track URI', 'Track Name', 'Artist Name(s)', 'Popularity', 'Album Release Date']) {
    if (!header.includes(name)) throw new Error(`${path} has no "${name}" column — is this an Exportify export?`);
  }
  for (const row of rows) records.push(Object.fromEntries(header.map((h, i) => [h, row[i] ?? ''])));
}

// The library as it stands without a previous run of this import.
const previousSlugs = new Set(previousImport.map((s) => s.slug));
const library = songs.filter((s) => !previousSlugs.has(s.slug));
const libraryBySlug = new Map(library.map((s) => [s.slug, s]));
const libraryByTitle = new Map<string, string[]>();
for (const s of library) {
  const k = norm(s.title);
  libraryByTitle.set(k, [...(libraryByTitle.get(k) ?? []), s.slug]);
}

const entries = new Map<string, Entry>();
const seen = new Set<string>();
let skipped = 0;
let local = 0;
for (const r of records) {
  const uri = r['Track URI'];
  if (seen.has(uri)) continue;
  seen.add(uri);
  if (!uri.startsWith('spotify:track:')) { local++; continue; }
  const id = uri.slice('spotify:track:'.length);
  const rawTitle = r['Track Name'];
  const artists = splitArtists(r['Artist Name(s)']);
  const o = overrides[id] ?? {};
  if (o.skip) { skipped++; continue; }
  const classical = o.classical ?? classicalComposers.has(artists[0]);
  const title = o.title ?? cleanTitle(rawTitle, classical);
  const artist = o.artist ?? (classical ? artists[0] : mainArtists(rawTitle, artists).join(', '));
  const track: Track = {
    id, rawTitle, artists, title, artist, classical,
    popularity: Number(r['Popularity']) || 0,
    released: r['Album Release Date'],
    curated: Boolean(o.title || o.artist),
  };

  // Attach to an existing song: explicit override, else same title (covers
  // and versions of a library song are that song's recordings).
  let slug = o.slug;
  if (slug === undefined && !o.separate) {
    const candidates = libraryByTitle.get(norm(title)) ?? [];
    if (candidates.length === 1) slug = candidates[0];
  }
  if (slug && !libraryBySlug.has(slug)) throw new Error(`override for ${track.id}: unknown slug "${slug}"`);

  const key = slug ? `slug:${slug}` : o.separate ? `${norm(title)}|${norm(artist)}` : norm(title);
  const entry = entries.get(key) ?? { key, slug, tracks: [] };
  entry.tracks.push(track);
  entries.set(key, entry);
}

const trackUrl = (t: Track) => `https://open.spotify.com/track/${t.id}`;
const q = (s: string) => JSON.stringify(s);

/**
 * The recording that names a new song and gets linked: a hand-curated one,
 * else the library song's own artist's, then the earliest released (the
 * original rather than a cover), preferring an undecorated title.
 */
function rankTracks(e: Entry): Track[] {
  const owner = e.slug ? norm(libraryBySlug.get(e.slug)!.artist) : undefined;
  const rank = (t: Track) => [
    t.curated ? 0 : 1,
    owner !== undefined && t.artists.some((a) => owner.includes(norm(a))) ? 0 : 1,
    t.released,
    t.title === t.rawTitle ? 0 : 1,
    -t.popularity,
  ];
  return [...e.tracks].sort((a, b) => {
    const [x, y] = [rank(a), rank(b)];
    const i = x.findIndex((v, k) => v !== y[k]);
    return i < 0 ? 0 : x[i] < y[i] ? -1 : 1;
  });
}
const bestTrack = (e: Entry) => rankTracks(e)[0];

/** What sets a recording apart: "Live", "Acoustic", "2009 Remaster"… */
function versionNote(t: Track): string | undefined {
  const dash = t.rawTitle.match(/\s[-–]\s(.*)$/)?.[1];
  const paren = t.rawTitle.match(/\(((?:live|remix|piano version|humming|demo|waltz version)[^)]*)\)/i)?.[1];
  const note = (dash ?? paren)?.replace(/^feat\..*$/i, '').trim();
  return note || undefined;
}

/** Who plays a recording: its performers for a classical piece, else its main artists. */
const performer = (t: Track) =>
  t.classical ? t.artists.filter((a) => a !== t.artist).join(', ') || t.artist : mainArtists(t.rawTitle, t.artists).join(', ');

const version = (t: Track) => {
  const note = versionNote(t);
  return `{ url: ${q(trackUrl(t))}, artist: ${q(performer(t))}${note ? `, note: ${q(note)}` : ''} }`;
};

/** Ranked recordings, minus ones that would read the same (same performer and note, e.g. a reissue). */
function distinctVersions(e: Entry): Track[] {
  const seenLabels = new Set<string>();
  return rankTracks(e).filter((t) => {
    const label = `${norm(performer(t))}|${versionNote(t) ?? ''}`;
    if (seenLabels.has(label)) return false;
    seenLabels.add(label);
    return true;
  });
}


const links: [string, Entry][] = [];
const newSongs: Entry[] = [];
const usedSlugs = new Set(library.map((s) => s.slug));
for (const e of entries.values()) {
  if (e.slug) {
    links.push([e.slug, e]);
  } else {
    newSongs.push(e);
  }
}
const named = newSongs.map((e) => distinctVersions(e)).sort((a, b) => a[0].title.localeCompare(b[0].title, 'it'));

const songLines: string[] = [];
for (const [t, ...others] of named) {
  let slug = slugify(t.title);
  if (!slug || usedSlugs.has(slug)) slug = `${slugify(t.title) || 'song'}-${slugify(t.artist)}`;
  if (usedSlugs.has(slug)) throw new Error(`slug collision: ${slug}`);
  usedSlugs.add(slug);
  songLines.push(
    '  {',
    `    slug: ${q(slug)},`,
    `    title: ${q(t.title)},`,
    `    artist: ${q(t.artist)},`,
    ...(t.classical ? ['    classical: true,'] : []),
    ...(others.length
      ? [
        '    links: {',
        `      spotify: ${q(trackUrl(t))},`,
        '      spotifyVersions: [',
        ...others.map((v) => `        ${version(v)},`),
        '      ],',
        '    },',
      ]
      : [`    links: { spotify: ${q(trackUrl(t))} },`]),
    '  },',
  );
}

const out = [
  "import type { Song, SpotifyVersion } from '../../lib/types';",
  '',
  `// Generated by scripts/import-spotify.ts from the Spotify Liked Songs and playlist exports`,
  `// (${seen.size} tracks). Edit scripts/spotify-overrides.ts and re-run instead of editing here.`,
  '',
  '/** Liked recordings of songs that were already in the library, best first. */',
  'export const spotifyLinks: Record<string, SpotifyVersion[]> = {',
  ...links.sort(([a], [b]) => a.localeCompare(b)).flatMap(([slug, e]) => [
    `  ${q(slug)}: [`,
    ...distinctVersions(e).map((t) => `    ${version(t)},`),
    '  ],',
  ]),
  '};',
  '',
  '/** Liked songs not otherwise in the library. */',
  'export const spotifySongs: Song[] = [',
  ...songLines,
  '];',
  '',
].join('\n');
writeFileSync(OUT, out);
console.log(`${seen.size} tracks (${local} local files), ${skipped} skipped → ${links.length} links to existing songs, ${newSongs.length} new songs → ${OUT}`);

if (process.env.SPOTIFY_IMPORT_REPORT) {
  for (const e of entries.values()) {
    const b = bestTrack(e);
    const tag = e.slug ? `→ ${e.slug}` : b.classical ? 'NEW C' : 'NEW';
    console.log(`${tag}\t${b.title}\t${b.artist}`);
    for (const t of e.tracks) console.log(`\t\t${t.id}\t${t.released}\t${t.rawTitle} | ${t.artists.join(', ')}`);
  }
}
