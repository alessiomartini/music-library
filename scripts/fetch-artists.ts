/**
 * Looks up each song artist on Wikidata (SPARQL) and their photos on
 * Wikimedia Commons, and writes src/data/songs/artists.ts.
 *
 * - The artist is the Wikidata musician or musical group whose label matches
 *   the song's artist name (most-linked one when several match).
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
    console.log(`  HTTP ${status || 'error'} for ${url.slice(0, 60)}…, retrying`);
  }
  // Give up loudly rather than write a partial artists file.
  throw new Error(`Could not fetch ${url}`);
}

const MUSIC_OCCUPATIONS = [
  'Q177220', 'Q488111', 'Q639669', 'Q36834', 'Q2252262', 'Q855091', 'Q486748', 'Q130857', 'Q183945',
  'Q753110', 'Q15981151', 'Q158852', 'Q1259917', 'Q1198887', 'Q2865819', 'Q12800682', 'Q584301', 'Q806349',
].map((q) => `wd:${q}`).join(' ');
const LANGS = ['en', 'it', 'es', 'fr', 'pt', 'de'];

interface Binding { [k: string]: { value: string } | undefined }

async function sparql(names: string[]): Promise<Binding[]> {
  const values = names.flatMap((n) => LANGS.map((l) => `${JSON.stringify(n)}@${l}`)).join(' ');
  const query = `SELECT ?item ?name ?links ?img ?voiceLabel ?sex WHERE {
    VALUES ?name { ${values} }
    ?item rdfs:label ?name .
    { ?item wdt:P106 ?occ . VALUES ?occ { ${MUSIC_OCCUPATIONS} } }
    UNION { ?item wdt:P31/wdt:P279* ?group . VALUES ?group { wd:Q215380 wd:Q2088357 wd:Q5741069 } }
    ?item wikibase:sitelinks ?links .
    OPTIONAL { ?item wdt:P18 ?img }
    OPTIONAL { ?item wdt:P412 ?voice . ?voice rdfs:label ?voiceLabel . FILTER(LANG(?voiceLabel) = "en") }
    OPTIONAL { ?item wdt:P21 ?sex }
  }`;
  // The query service may throttle hard (one request a minute): pace and retry slowly.
  const body = await get('https://query.wikidata.org/sparql', { query, format: 'json' }, 65_000);
  return body ? (JSON.parse(body).results.bindings as Binding[]) : [];
}

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
const allNames = [...new Set(artists.flatMap(nameVariants))];
const best = new Map<string, { qid: string; links: number; img?: string; voice?: string; sex?: string }>();
const BATCH = 80;
for (let i = 0; i < allNames.length; i += BATCH) {
  for (const b of await sparql(allNames.slice(i, i + BATCH))) {
    const name = b.name!.value;
    const qid = b.item!.value.split('/').pop()!;
    const links = Number(b.links!.value);
    const cur = best.get(name);
    if (!cur || links > cur.links) {
      best.set(name, { qid, links, img: b.img?.value, voice: b.voiceLabel?.value, sex: b.sex?.value.split('/').pop() });
    } else if (cur.qid === qid) {
      cur.img ??= b.img?.value; cur.voice ??= b.voiceLabel?.value; cur.sex ??= b.sex?.value.split('/').pop();
    }
  }
  console.log(`wikidata ${Math.min(i + BATCH, allNames.length)}/${allNames.length}`);
}

const out: Record<string, ArtistInfo> = {};
let done = 0;
for (const artist of artists) {
  const name = nameVariants(artist).find((n) => best.has(n));
  if (name) {
    const w = best.get(name)!;
    const sex = w.sex === 'Q6581097' ? 'male' : w.sex === 'Q6581072' ? 'female' : undefined;
    out[artist] = {
      name,
      wikidata: w.qid,
      ...(w.voice && { voiceType: w.voice }),
      ...(sex && { sex }),
      photos: await photos(w.qid, w.img),
    };
  }
  if (++done % 50 === 0) console.log(`commons ${done}/${artists.length}`);
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
