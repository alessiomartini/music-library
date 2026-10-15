import type { Song, SpotifyVersion } from './types';

/** One YouTube video of someone playing a song. */
export interface YoutubeCover {
  /** YouTube video id. */
  id: string;
  /** Who plays it (channel or performer). */
  by: string;
  /** The song: title and its original artist. */
  song: string;
  artist: string;
  note?: string;
  /** Library song to attach to, when title matching would not find it. */
  slug?: string;
}

const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ø/g, 'o').replace(/æ/g, 'ae')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
const words = (s: string) => new Set(norm(s).split(' ').filter((w) => w.length > 2));
const slugify = (s: string) => norm(s).replace(/ and /g, ' ').replace(/\s+/g, '-');

/**
 * Attaches YouTube covers to library songs (same title, and same artist when
 * several songs share the title) and creates light entries for the songs the
 * library doesn't have yet.
 */
export function attachYoutubeCovers(songs: Song[], covers: YoutubeCover[]): { songs: Song[]; added: Song[] } {
  const bySlug = new Map(songs.map((s) => [s.slug, s]));
  const byTitle = new Map<string, Song[]>();
  for (const s of songs) byTitle.set(norm(s.title), [...(byTitle.get(norm(s.title)) ?? []), s]);
  const extra = new Map<string, SpotifyVersion[]>();
  const added = new Map<string, Song>();

  for (const c of covers) {
    const link: SpotifyVersion = { url: `https://www.youtube.com/watch?v=${c.id}`, artist: c.by, ...(c.note && { note: c.note }) };
    const sameTitle = byTitle.get(norm(c.song)) ?? [];
    const artist = words(c.artist);
    const match =
      (c.slug && bySlug.get(c.slug)) ||
      sameTitle.find((s) => [...words(s.artist)].some((w) => artist.has(w))) ||
      (sameTitle.length === 1 ? sameTitle[0] : undefined);
    let slug = match?.slug;
    if (!slug) {
      const key = `${norm(c.song)}|${norm(c.artist)}`;
      let song = added.get(key);
      if (!song) {
        let newSlug = slugify(c.song);
        if (bySlug.has(newSlug) || [...added.values()].some((a) => a.slug === newSlug)) newSlug = `${newSlug}-${slugify(c.artist)}`;
        song = { slug: newSlug, title: c.song, artist: c.artist, links: {} };
        added.set(key, song);
      }
      slug = song.slug;
    }
    extra.set(slug, [...(extra.get(slug) ?? []), link]);
  }

  const withCovers = (s: Song): Song =>
    extra.has(s.slug) ? { ...s, links: { ...s.links, youtubeVersions: [...(s.links.youtubeVersions ?? []), ...extra.get(s.slug)!] } } : s;
  return { songs: songs.map(withCovers), added: [...added.values()].map(withCovers) };
}
