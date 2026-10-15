/**
 * Looks up each song artist on Wikidata (SPARQL) and their photos on
 * Wikimedia Commons, and writes src/data/songs/artists.ts.
 *
 * - The artist is the musician or group whose Wikipedia page (en, it, pt, es,
 *   fr; with a "(singer)"/"(band)"… qualifier when needed) has that name.
 * - Photos are Commons files that "depict" the artist (structured data), with
 *   the date they were taken when Commons knows it, so a song page can show
 *   the artist around the year of the song. The Wikidata main image comes
 *   first. Every photo keeps its author and licence for the credit line.
 * - Voice type (Wikidata P412) and sex are kept for vocal-range estimates.
 *
 * Responses are cached in node_modules/.cache/artists/.
 *
 * Run with:  npm run fetch:artists
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { songs } from '../src/data/songs';
import type { ArtistInfo, ArtistPhoto } from '../src/lib/artist';

const OUT = 'src/data/songs/artists.ts';
const CACHE = 'node_modules/.cache/artists';
const UA = 'music-library/1.0 (https://github.com/alessiomartini/music-library; personal project)';
mkdirSync(CACHE, { recursive: true });
const run = promisify(execFile);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET (or POST form data) with an on-disk cache; curl honours the sandbox HTTPS_PROXY. */
async function get(url: string, form?: Record<string, string>, pause = 1000): Promise<string | null> {
  const file = `${CACHE}/${createHash('sha1').update(url + JSON.stringify(form ?? {})).digest('hex')}`;
  if (existsSync(file)) return readFileSync(file, 'utf8');
  // Wikimedia throttles shared IPs hard at times: back off up to ~5 min, for up to ~2 h.
  for (let attempt = 0; attempt < 30; attempt++) {
    await sleep(Math.min(pause * 2 ** attempt, 300_000));
    const args = ['-s', '-m', '90', '-A', UA, '-H', 'Accept: application/json', '-w', '\n%{http_code}'];
    for (const [k, v] of Object.entries(form ?? {})) args.push('--data-urlencode', `${k}=${v}`);
    const out = await run('curl', [...args, url], { maxBuffer: 64 << 20 }).then((r) => r.stdout).catch(() => '');
    const status = Number(out.slice(out.lastIndexOf('\n') + 1));
    const body = out.slice(0, out.lastIndexOf('\n'));
    if (status === 200 && body.startsWith('{')) { writeFileSync(file, body); return body; }
    if (status === 404) { writeFileSync(file, '{}'); return '{}'; }
    console.log(`  HTTP ${status || 'error'} for ${url.slice(0, 60)}…, retrying`);
  }
  // Give up loudly rather than write a partial artists file.
  throw new Error(`Could not fetch ${url}`);
}

// Wikipedia summary descriptions that mark a page as a musician or musical group.
const MUSICAL = /singer|songwriter|band|musician|rapper|composer|group|duo|trio|guitarist|pianist|\bdj\b|producer|orchestra|choir|cantante|cantautore|gruppo|musicista|compositore|chitarrista|pianista|produttore|coro|cantora|cantor|banda|compositor|músic|chanteu|groupe/i;
const QUALIFIERS: Record<string, string[]> = {
  en: ['', ' (band)', ' (singer)', ' (musician)', ' (rapper)', ' (group)', ' (composer)'],
  it: ['', ' (cantante)', ' (gruppo musicale)', ' (rapper)', ' (cantautore)', ' (musicista)'],
  pt: ['', ' (cantor)', ' (cantora)', ' (banda)'],
  es: ['', ' (cantante)', ' (banda)'],
  fr: ['', ' (chanteur)', ' (chanteuse)', ' (groupe)'],
};

/** Wikidata id of the musician or group a Wikipedia page of that name is about. */
async function findArtist(name: string): Promise<string | null> {
  for (const [lang, quals] of Object.entries(QUALIFIERS)) {
    for (const qual of quals) {
      const title = encodeURIComponent(`${name}${qual}`.replace(/ /g, '_'));
      const body = await get(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`);
      const page = body ? (JSON.parse(body) as { type?: string; description?: string; extract?: string; wikibase_item?: string }) : {};
      if (page.type === 'standard' && page.wikibase_item && MUSICAL.test(`${page.description ?? ''} ${(page.extract ?? '').slice(0, 200)}`)) {
        return page.wikibase_item;
      }
    }
  }
  return null;
}

interface Claim { mainsnak: { datavalue?: { value: string | { id: string } } } }
async function entity(qid: string): Promise<{ claims: Record<string, Claim[]>; labels: Record<string, { value: string }> } | null> {
  const body = await get(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`, undefined, 3000);
  return body ? (JSON.parse(body).entities?.[qid] ?? null) : null;
}
const claimValues = (e: { claims: Record<string, Claim[]> }, prop: string) =>
  (e.claims[prop] ?? []).map((c) => c.mainsnak.datavalue?.value).filter((v) => v !== undefined);

const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

interface ImageInfo {
  title: string;
  imageinfo?: { thumburl: string; descriptionurl: string; mime: string; extmetadata?: Record<string, { value: string }> }[];
}

function photo(p: ImageInfo): ArtistPhoto | null {
  const ii = p.imageinfo?.[0];
  if (!ii || !/^image\/(jpeg|png)$/.test(ii.mime)) return null;
  const m = ii.extmetadata ?? {};
  const year = Number(strip(m.DateTimeOriginal?.value ?? '').match(/\b(1[89]\d\d|20\d\d)\b/)?.[1]) || undefined;
  return {
    url: ii.thumburl,
    page: ii.descriptionurl,
    ...(year && { year }),
    credit: strip(m.Artist?.value ?? '').slice(0, 80) || 'Unknown author',
    license: strip(m.LicenseShortName?.value ?? '') || 'see file page',
  };
}

const IMAGE_PROPS = '&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=320&iiextmetadatafilter=DateTimeOriginal|LicenseShortName|Artist';

async function photos(qid: string, mainImage?: string): Promise<ArtistPhoto[]> {
  const found: ArtistPhoto[] = [];
  if (mainImage) {
    const title = `File:${decodeURIComponent(mainImage.split('/Special:FilePath/')[1] ?? '')}`;
    const body = await get(`https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}${IMAGE_PROPS}`);
    const pages = body ? Object.values((JSON.parse(body).query?.pages ?? {}) as Record<string, ImageInfo>) : [];
    const main = pages[0] && photo(pages[0]);
    if (main) found.push({ ...main, main: true });
  }
  const body = await get(`https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(`haswbstatement:P180=${qid}`)}&gsrnamespace=6&gsrlimit=40${IMAGE_PROPS}`);
  const pages = body ? Object.values((JSON.parse(body).query?.pages ?? {}) as Record<string, ImageInfo>) : [];
  for (const p of pages) {
    const ph = photo(p);
    if (ph?.year && !found.some((f) => f.page === ph.page)) found.push(ph);
  }
  // Keep the main image plus at most one dated photo per year.
  const perYear = new Map<number, ArtistPhoto>();
  for (const ph of found) if (!ph.main && ph.year && !perYear.has(ph.year)) perYear.set(ph.year, ph);
  return [...found.filter((f) => f.main), ...[...perYear.values()].sort((a, b) => a.year! - b.year!)];
}

/** "Rihanna, Kanye West" → ["Rihanna, Kanye West", "Rihanna"]: try the full credit, then the first name. */
const nameVariants = (artist: string) => [...new Set([artist, artist.split(/, | ft\. | feat\. /)[0]])];

const artists = [...new Set(songs.map((s) => s.artist))];
const out: Record<string, ArtistInfo> = {};
const voiceLabels = new Map<string, string>();
let done = 0;
for (const artist of artists) {
  for (const name of nameVariants(artist)) {
    const qid = await findArtist(name);
    if (!qid) continue;
    const e = await entity(qid);
    if (!e) break;
    const image = claimValues(e, 'P18')[0] as string | undefined;
    const sexId = (claimValues(e, 'P21')[0] as { id: string } | undefined)?.id;
    const sex = sexId === 'Q6581097' ? 'male' : sexId === 'Q6581072' ? 'female' : undefined;
    const voiceId = (claimValues(e, 'P412')[0] as { id: string } | undefined)?.id;
    if (voiceId && !voiceLabels.has(voiceId)) voiceLabels.set(voiceId, (await entity(voiceId))?.labels.en?.value ?? '');
    const voiceType = voiceId ? voiceLabels.get(voiceId) : undefined;
    out[artist] = {
      name,
      wikidata: qid,
      ...(voiceType && { voiceType }),
      ...(sex && { sex }),
      photos: await photos(qid, image && `/Special:FilePath/${encodeURIComponent(image)}`),
    };
    break;
  }
  if (++done % 25 === 0) console.log(`${done}/${artists.length}`);
}

const q = (v: unknown) => JSON.stringify(v);
writeFileSync(OUT, [
  "import type { ArtistInfo } from '../../lib/artist';",
  '',
  '// Generated by scripts/fetch-artists.ts (Wikidata, Wikimedia Commons). Do not edit by hand.',
  'export const artists: Record<string, ArtistInfo> = {',
  ...Object.keys(out).sort().map((k) => `  ${q(k)}: ${q(out[k])},`),
  '};',
  '',
].join('\n'));
const withPhoto = Object.values(out).filter((a) => a.photos.length).length;
console.log(`${artists.length} artists → ${Object.keys(out).length} on Wikidata, ${withPhoto} with photos → ${OUT}`);
