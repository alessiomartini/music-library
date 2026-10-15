/**
 * Finds each song's Wikipedia article and writes a short excerpt of its lead
 * (2–4 sentences) with the link to the source to src/data/songs/history.ts.
 *
 * - First Wikidata: an item whose performer (P175) or composer (P86) is the
 *   artist found by fetch-artists and whose label is the song title. Its
 *   Italian article is used for Italian songs (language, country or artist
 *   Italian), the English one otherwise, the other when one is missing.
 * - Otherwise Wikipedia search ("<title>" <artist>, then with "(song)" /
 *   "(brano musicale)"): the page must be titled like the song and its lead
 *   must name the artist and say it is a song.
 * - No article, no entry: nothing is written without a source.
 *
 * Text is from Wikipedia (CC BY-SA 4.0); the page shows the link and licence.
 * Responses are cached in node_modules/.cache/history/.
 *
 * Run with:  npm run fetch:history
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { songs } from '../src/data/songs';
import { artists } from '../src/data/songs/artists';
import type { SongHistory } from '../src/lib/types';

const OUT = 'src/data/songs/history.ts';
const CACHE = 'node_modules/.cache/history';
const UA = 'music-library/1.0 (https://github.com/alessiomartini/music-library; personal project)';
mkdirSync(CACHE, { recursive: true });
const run = promisify(execFile);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET with an on-disk cache and back-off on throttling; curl honours a sandbox HTTPS_PROXY. */
async function get(url: string): Promise<any> {
  const file = `${CACHE}/${createHash('sha1').update(url).digest('hex')}`;
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  for (let attempt = 0; attempt < 30; attempt++) {
    await sleep(Math.min(250 * 2 ** attempt, 300_000));
    const out = await run('curl', ['-s', '-m', '90', '-A', UA, '-H', 'Accept: application/json', '-w', '\n%{http_code}', url], { maxBuffer: 64 << 20 })
      .then((r) => r.stdout).catch(() => '');
    const status = Number(out.slice(out.lastIndexOf('\n') + 1));
    const body = out.slice(0, out.lastIndexOf('\n'));
    if (status === 200 && body.startsWith('{')) { writeFileSync(file, body); return JSON.parse(body); }
    if (status === 404) { writeFileSync(file, '{}'); return {}; }
    console.log(`  HTTP ${status || 'error'} for ${url.slice(0, 70)}…, retrying`);
  }
  throw new Error(`Could not fetch ${url}`);
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
/** "Let It Be - Remastered 2009" / "Yesterday (song)" → "let it be" / "yesterday". */
const bare = (title: string) => norm(title.replace(/\s+-\s+.*$/, '').replace(/\s*[([].*?[)\]]/g, ''));
const mainArtist = (artist: string) => artist.split(/,| ft\. | feat\. | & | e /)[0].trim();

interface Summary { type?: string; title?: string; description?: string; extract?: string; content_urls?: { desktop: { page: string } } }
const summary = (lang: string, title: string): Promise<Summary> =>
  get(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);

const NOT_A_SONG = /\b(album|soundtrack|video game|discography|film|videogioco|discografia|colonna sonora)\b/i;
const SONG = /\b(song|single|ballad|track|anthem|hymn|aria|canzone|brano|singolo|ballata|inno|canto|composizione|composition|piece)\b/i;

/** Wikidata items whose label is the title and whose performer/composer is the artist. */
async function fromWikidata(title: string, qid: string, italianArtist: boolean): Promise<{ lang: string; title: string } | null> {
  for (const prop of ['P175', 'P86']) {
    const q = `${title.replace(/["()]/g, ' ')} haswbstatement:${prop}=${qid}`;
    const hits = (await get(`https://www.wikidata.org/w/api.php?action=query&list=search&format=json&srlimit=10&srsearch=${encodeURIComponent(q)}`)).query?.search ?? [];
    if (!hits.length) continue;
    const ids = hits.map((h: { title: string }) => h.title).join('|');
    const ents = (await get(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels|aliases|sitelinks|claims&ids=${ids}`)).entities ?? {};
    for (const e of Object.values(ents) as any[]) {
      const names = [...Object.values(e.labels ?? {}), ...Object.values(e.aliases ?? {}).flat()].map((l: any) => bare(l.value));
      if (!names.includes(bare(title))) continue;
      const values = (p: string) => (e.claims?.[p] ?? []).map((c: any) => c.mainsnak.datavalue?.value?.id);
      const italian = values('P407').includes('Q652') || values('P495').includes('Q38') || italianArtist;
      for (const lang of italian ? ['it', 'en'] : ['en', 'it']) {
        const page = e.sitelinks?.[`${lang}wiki`]?.title;
        if (page) return { lang, title: page };
      }
    }
  }
  return null;
}

/** Wikipedia search fallback: a page titled like the song whose lead names the artist and says it's a song. */
async function fromSearch(title: string, artist: string, italian: boolean): Promise<{ lang: string; title: string } | null> {
  const who = norm(mainArtist(artist));
  for (const lang of italian ? ['it', 'en'] : ['en', 'it']) {
    const hits = (await get(`https://${lang}.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=5&srsearch=${encodeURIComponent(`"${title}" ${mainArtist(artist)}`)}`)).query?.search ?? [];
    for (const h of hits as { title: string }[]) {
      if (bare(h.title) !== bare(title)) continue;
      const s = await summary(lang, h.title);
      const lead = `${s.description ?? ''} ${s.extract ?? ''}`;
      if (s.type === 'standard' && norm(lead).includes(who) && SONG.test(lead)) return { lang, title: h.title };
    }
  }
  return null;
}

/** The first 2–4 sentences of the lead, about 200–600 characters. */
function excerpt(text: string): string {
  // Split after . ! ? followed by a capital, but not after initials or common abbreviations.
  const sentences = text.replace(/\s+/g, ' ').trim().split(/(?<=(?<!\b(?:[A-Z]|Jr|Sr|St|Mr|Mrs|Dr|vs|ca|feat))[.!?])\s+(?=[A-Z"«“À-Ý])/);
  let out = '';
  for (const [i, s] of sentences.entries()) {
    if (i >= 4 || (i >= 2 && out.length >= 200) || (i >= 1 && out.length + s.length > 600)) break;
    out += (out ? ' ' : '') + s;
  }
  return out;
}

const italianArtists = new Map<string, boolean>();
async function isItalian(qid?: string): Promise<boolean> {
  if (!qid) return false;
  if (!italianArtists.has(qid)) {
    const e = (await get(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`)).entities?.[qid];
    const values = (p: string) => (e?.claims?.[p] ?? []).map((c: any) => c.mainsnak.datavalue?.value?.id);
    italianArtists.set(qid, values('P27').includes('Q38') || values('P495').includes('Q38') || /Italian/.test(e?.descriptions?.en?.value ?? ''));
  }
  return italianArtists.get(qid)!;
}

const out: Record<string, SongHistory> = {};
let done = 0;
async function lookUp(song: (typeof songs)[number]) {
  const qid = artists[song.artist]?.wikidata;
  const italian = await isItalian(qid);
  const page = (qid && await fromWikidata(song.title, qid, italian)) || await fromSearch(song.title, song.artist, italian);
  if (page) {
    const s = await summary(page.lang, page.title);
    // A song title that redirects to its album, or a page about an album, film or game, is not the song's article.
    // So is the work a piece belongs to: "Lacrimosa (Requiem)" → the Requiem.
    const work = song.title.match(/\((.*?)\)/)?.[1];
    const aboutSong = bare(s.title ?? '') === bare(page.title) && !(NOT_A_SONG.test(s.description ?? '') && !SONG.test(s.description ?? ''))
      && !(work && bare(work) === bare(s.title ?? ''));
    const text = s.type === 'standard' && s.extract && aboutSong ? excerpt(s.extract) : '';
    if (text && s.content_urls) out[song.slug] = { text, url: s.content_urls.desktop.page, lang: page.lang };
  }
  if (++done % 50 === 0) console.log(`${done}/${songs.length}, ${Object.keys(out).length} found`);
}
const queue = [...songs];
await Promise.all(Array.from({ length: 3 }, async () => { while (queue.length) await lookUp(queue.shift()!); }));

const q = (v: unknown) => JSON.stringify(v);
writeFileSync(OUT, [
  "import type { SongHistory } from '../../lib/types';",
  '',
  '// Generated by scripts/fetch-history.ts from Wikipedia (text CC BY-SA 4.0). Do not edit by hand.',
  'export const songHistory: Record<string, SongHistory> = {',
  ...Object.keys(out).sort().map((k) => `  ${q(k)}: ${q(out[k])},`),
  '};',
  '',
].join('\n'));
console.log(`${songs.length} songs → ${Object.keys(out).length} Wikipedia excerpts → ${OUT}`);
