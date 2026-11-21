/**
 * Matching rules for covers found on MusicBrainz (scripts/fetch-musicbrainz-covers.ts).
 * Precision over recall: a cover is accepted only when the recording belongs to the same
 * MusicBrainz work (same work id) as the original recording, and the work itself is
 * identified unambiguously (exact normalized title AND the original artist tied to it).
 */

export interface MbWork {
  id: string;
  title: string;
  score: number;
  /** Names of artists related to the work as writers (composer, lyricist, writer...). */
  writers: string[];
  /** Ids of the recordings that perform the work (from the search result's relations). */
  recordingIds: string[];
}

export interface MbRecording {
  id: string;
  title: string;
  /** Joined artist credit, e.g. "A feat. B". */
  artist: string;
  /** Individual credited artist names. */
  artists: string[];
  year?: number;
}

/** A recording of the same work by someone else (stored in src/data/songs/knownCovers.ts). */
export interface KnownCover {
  artist: string;
  year?: number;
  /** MusicBrainz recording id: https://musicbrainz.org/recording/<id>. */
  id: string;
}

export const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ø/g, 'o').replace(/æ/g, 'ae')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();

const words = (s: string) => new Set(norm(s).split(' ').filter((w) => w.length > 2));

/** Individual artist names of a library song ("A, B", "A & B", "A feat. B"). */
export function artistNames(artist: string): string[] {
  return artist.split(/\s*(?:,|&|\band\b|\bfeat\.?|\bfeaturing\b|\bwith\b|\bx\b)\s*/i).map((a) => a.trim()).filter(Boolean);
}

/** True when two artist names are the same normalized name (or one contains the other as whole words). */
export function sameArtist(a: string, b: string): boolean {
  const x = norm(a).replace(/^the /, '');
  const y = norm(b).replace(/^the /, '');
  if (!x || !y) return false;
  if (x === y) return true;
  const wx = words(a);
  const wy = words(b);
  if (!wx.size || !wy.size) return false;
  const [small, big] = wx.size <= wy.size ? [wx, wy] : [wy, wx];
  return small.size >= 2 && [...small].every((w) => big.has(w));
}

/** Title without trailing "(...)" / "- Remastered 2009" style decorations. */
export function baseTitle(title: string): string {
  return norm(title.replace(/\s*[([].*?[)\]]\s*$/, '').replace(/\s+-\s+.*$/, ''));
}

/**
 * Picks the one MusicBrainz work that is this song, or undefined when it is not
 * unambiguous. The title must match exactly (after normalization) and the original artist
 * must be tied to the work: as a writer, or as the artist of one of its recordings.
 */
export function pickWork(
  title: string,
  artist: string,
  works: MbWork[],
  originalRecordingIds: ReadonlySet<string>,
): MbWork | undefined {
  const names = artistNames(artist);
  const ok = works.filter(
    (w) =>
      w.score >= 90 &&
      norm(w.title) === norm(title) &&
      (w.writers.some((wr) => names.some((n) => sameArtist(n, wr))) || w.recordingIds.some((r) => originalRecordingIds.has(r))),
  );
  return ok.length === 1 ? ok[0] : undefined;
}

const SKIP_TITLE = /karaoke|tribute|made famous|originally performed|backing track|in the style of|instrumental version|ringtone|lullaby version|cover version/i;
const SKIP_ARTIST = /^(various artists|\[?unknown\]?|\[?anonymous\]?|\[?traditional\]?|karaoke|.*\bkaraoke\b.*|.*\btribute\b.*)$/i;

/**
 * Covers among the recordings of a work: recordings by artists other than the original one,
 * with the song's own title (decorations like "(live)" allowed), one per artist (earliest).
 */
export function pickCovers(title: string, artist: string, recordings: MbRecording[], max = 20): KnownCover[] {
  const names = artistNames(artist);
  const byArtist = new Map<string, KnownCover>();
  for (const r of recordings) {
    if (baseTitle(r.title) !== baseTitle(title) || SKIP_TITLE.test(r.title)) continue;
    if (SKIP_ARTIST.test(r.artist.trim()) || r.artists.some((a) => SKIP_ARTIST.test(a.trim()))) continue;
    if (r.artists.some((a) => names.some((n) => sameArtist(n, a))) || names.some((n) => sameArtist(n, r.artist))) continue;
    const key = norm(r.artist);
    const prev = byArtist.get(key);
    const cover: KnownCover = { artist: r.artist, ...(r.year && { year: r.year }), id: r.id };
    if (!prev || (r.year && (!prev.year || r.year < prev.year))) byArtist.set(key, cover);
  }
  return [...byArtist.values()].sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.artist.localeCompare(b.artist)).slice(0, max);
}
