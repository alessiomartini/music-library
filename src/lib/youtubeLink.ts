/** Direct YouTube links for the original recording of a song, with a search link as fallback. */

export interface YoutubeCandidate {
  id: string;
  title: string;
  channel: string;
}

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/^the /, '').trim();

const mainArtist = (artist: string) => artist.split(/,| ft\. | feat\. | & | and /i)[0].trim();

// Versions that are not the original recording, unless the song title itself says so.
const UNWANTED = ['live', 'cover', 'karaoke', 'lyrics', 'lyric', 'reaction', 'tutorial', 'lesson', 'instrumental', 'remix', 'acoustic', 'chords', 'testo', 'sped up', 'slowed', 'reverb', '8d', 'nightcore', 'performs', 'performance', 'concert', 'session', 'sessions', 'medley'];

const has = (haystack: string, needle: string) => ` ${haystack} `.includes(` ${needle} `);

/** True when the candidate looks like the original recording of `title` by `artist`. */
export function matchesOriginal(c: YoutubeCandidate, title: string, artist: string): boolean {
  const song = norm(title.replace(/\([^)]*\)|\[[^\]]*\]/g, ' ')) || norm(title);
  const t = norm(c.title);
  const ch = norm(c.channel);
  if (!song || !has(t, song)) return false;
  const full = norm(title);
  // An "Official Lyrics Video" is the original audio, so it passes when the channel check below holds.
  const official = has(t, 'official');
  if (UNWANTED.some((w) => has(t, w) && !has(full, w) && !(official && (w === 'lyrics' || w === 'lyric')))) return false;
  const a = norm(mainArtist(artist));
  if (!a) return false;
  const topicOrVevo = ch.endsWith(' topic') || ch.endsWith('vevo');
  if (topicOrVevo) return ch.includes(a.split(' ')[0]);
  // Otherwise the channel itself must be the artist's: a title naming the artist is not enough,
  // since fan uploads of live shows and covers do that too.
  const compact = (x: string) => x.replace(/ /g, '');
  if (compact(ch).includes(compact(a)) || (ch.length > 3 && compact(a).includes(compact(ch)))) return true;
  // Official uploads on label channels (Rhino, Defected, UMG...): the title must name the artist
  // and say "official" (official video/audio/music video/visualizer); the exclusions above still apply.
  return official && has(t, a);
}

/** First candidate accepted by `matchesOriginal`, or undefined. */
export function pickOriginal(cands: YoutubeCandidate[], title: string, artist: string): YoutubeCandidate | undefined {
  return cands.find((c) => matchesOriginal(c, title, artist));
}

/** Direct watch link when the video id is known, else a YouTube search. */
export function youtubeLink(direct: Record<string, string>, slug: string, title: string, artist: string): string {
  const id = direct[slug];
  return id ? `https://www.youtube.com/watch?v=${id}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${artist}`)}`;
}
