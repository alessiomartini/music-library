/**
 * Language and jazz-standard flag of every song, for the list filters.
 * Writes src/data/songs/songInfo.ts.
 *
 * - Language: the song's Wikidata item (from its Wikipedia page in history.ts),
 *   "language of work" (P407/P364); else "it" when its Wikipedia page is the
 *   Italian one; else the artist's country (P495, P27 on Wikidata): Italy -> "it",
 *   English-speaking countries -> "en". Unknown otherwise. Instrumentals: "zxx".
 * - Jazz standard: the title appears in Wikipedia's lists of jazz standards and the
 *   song is old enough (a newer song can share the title); src/data/songs/originals.ts
 *   corrects the rest by hand (`standard: false`).
 *
 * Responses are cached in node_modules/.cache/song-info/.
 *
 * Run with:  npm run fetch:song-info
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { songs } from '../src/data/songs';
import { songHistory } from '../src/data/songs/history';
import { artists } from '../src/data/songs/artists';

const OUT = 'src/data/songs/songInfo.ts';
const CACHE = 'node_modules/.cache/song-info';
const UA = 'music-library/1.0 (https://github.com/alessiomartini/music-library; personal project)';
mkdirSync(CACHE, { recursive: true });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get(url: string): Promise<any> {
  const file = `${CACHE}/${createHash('sha1').update(url).digest('hex')}`;
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  for (let attempt = 0; attempt < 12; attempt++) {
    await sleep(Math.min(500 * 2 ** attempt, 120_000));
    const r = await fetch(url, { headers: { 'User-Agent': UA } }).catch(() => null);
    if (r?.ok) {
      const body = await r.text();
      writeFileSync(file, body);
      return JSON.parse(body);
    }
    console.log(`  HTTP ${r?.status ?? 'error'} for ${url.slice(0, 70)}…, retrying`);
  }
  throw new Error(`Could not fetch ${url}`);
}

const wikidata = (params: Record<string, string>) =>
  get(`https://www.wikidata.org/w/api.php?${new URLSearchParams({ ...params, format: 'json' })}`);
const claimIds = (e: any, p: string): string[] =>
  (e?.claims?.[p] ?? []).map((c: any) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);

// Wikidata language items -> ISO 639-1 (English variants count as English).
const LANGUAGE: Record<string, string> = {
  Q1860: 'en', Q7976: 'en', Q7979: 'en', Q1328785: 'en', Q652: 'it', Q1321: 'es', Q5146: 'pt', Q750553: 'pt',
  Q150: 'fr', Q188: 'de', Q13955: 'ar', Q33390: 'nap', Q22282914: 'zxx',
};
// Countries -> the language their artists sing in when the song itself doesn't say.
const COUNTRY: Record<string, string> = {
  Q38: 'it', Q30: 'en', Q145: 'en', Q16: 'en', Q408: 'en', Q27: 'en', Q664: 'en', Q766: 'en', Q174193: 'en',
  Q29: 'es', Q96: 'es', Q414: 'es', Q739: 'es', Q155: 'pt', Q45: 'pt', Q142: 'fr', Q183: 'de',
};

const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Mn}/gu, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const bare = (title: string) => norm(title.replace(/\s*[([].*?[)\]]/g, ''));

async function main() {
  const list = songs.filter((s) => !s.classical);

  // 1. Song items via their Wikipedia page.
  const songItem: Record<string, any> = {};
  const bySite: Record<string, [string, string][]> = {};
  for (const s of list) {
    const m = songHistory[s.slug]?.url.match(/^https:\/\/(\w+)\.wikipedia\.org\/wiki\/(.+)$/);
    if (m) (bySite[`${m[1]}wiki`] ??= []).push([s.slug, decodeURIComponent(m[2]).replace(/_/g, ' ')]);
  }
  for (const [site, pages] of Object.entries(bySite)) {
    for (let i = 0; i < pages.length; i += 50) {
      const chunk = pages.slice(i, i + 50);
      const r = await wikidata({ action: 'wbgetentities', sites: site, titles: chunk.map(([, t]) => t).join('|'), props: 'claims|sitelinks', sitefilter: site });
      const byTitle = new Map<string, any>();
      for (const e of Object.values<any>(r.entities ?? {})) if (e.sitelinks?.[site]) byTitle.set(e.sitelinks[site].title, e);
      for (const [slug, t] of chunk) if (byTitle.has(t)) songItem[slug] = byTitle.get(t);
    }
  }

  // 2. Artists' countries.
  const artistIds = [...new Set(list.map((s) => artists[s.artist]?.wikidata).filter(Boolean))] as string[];
  const country: Record<string, string[]> = {};
  for (let i = 0; i < artistIds.length; i += 50) {
    const r = await wikidata({ action: 'wbgetentities', ids: artistIds.slice(i, i + 50).join('|'), props: 'claims' });
    for (const [id, e] of Object.entries<any>(r.entities ?? {})) country[id] = [...claimIds(e, 'P495'), ...claimIds(e, 'P27')];
  }

  // 3. Wikipedia's lists of jazz standards: titles in quotes, linked or not.
  const standards = new Set<string>();
  for (const page of ['List of pre-1920 jazz standards', 'List of 1920s jazz standards', 'List of 1930s jazz standards',
    'List of 1940s jazz standards', 'List of post-1950 jazz standards']) {
    const r = await get(`https://en.wikipedia.org/w/api.php?${new URLSearchParams({ action: 'parse', page, prop: 'wikitext', format: 'json', formatversion: '2' })}`);
    for (const m of (r.parse?.wikitext ?? '').matchAll(/"\[\[(?:[^\]|]*\|)?([^\]]+)\]\]"|"([^"\n[\]]{2,60})"/g)) {
      standards.add(bare(m[1] ?? m[2]));
    }
  }

  const info: Record<string, { language?: string; standard?: true }> = {};
  for (const s of list) {
    const langs = [...claimIds(songItem[s.slug], 'P407'), ...claimIds(songItem[s.slug], 'P364')].map((q) => LANGUAGE[q]).filter(Boolean);
    const fromCountry = (country[artists[s.artist]?.wikidata ?? ''] ?? []).map((q) => COUNTRY[q]).find(Boolean);
    const language = langs[0] ?? (songHistory[s.slug]?.lang === 'it' ? 'it' : fromCountry);
    // A title in the lists can be a newer song with the same name ("All of Me", John Legend, 2013):
    // the song's own Wikidata date decides.
    const dates = (songItem[s.slug]?.claims?.P577 ?? []).map((c: any) => Number(c.mainsnak?.datavalue?.value?.time?.slice(1, 5))).filter(Boolean);
    const standard = standards.has(bare(s.title)) && !(dates.length && Math.min(...dates) > 1975);
    if (language || standard) info[s.slug] = { ...(language && { language }), ...(standard && { standard: true as const }) };
  }

  const lines = Object.entries(info).sort(([a], [b]) => a.localeCompare(b)).map(([slug, v]) => `  ${JSON.stringify(slug)}: ${JSON.stringify(v)},`);
  writeFileSync(OUT, [
    "import type { SongInfo } from '../../lib/types';",
    '',
    '// Generated by scripts/fetch-song-info.ts (Wikidata, Wikipedia lists of jazz standards). Do not edit by hand.',
    'export const songInfo: Record<string, SongInfo> = {',
    ...lines,
    '};',
    '',
  ].join('\n'));
  const count = (f: (v: (typeof info)[string]) => boolean) => Object.values(info).filter(f).length;
  console.log(`${list.length} songs: en ${count((v) => v.language === 'en')}, it ${count((v) => v.language === 'it')}, ` +
    `other ${count((v) => !!v.language && !['en', 'it'].includes(v.language))}, unknown ${list.length - count((v) => !!v.language)}, ` +
    `standards ${count((v) => !!v.standard)} → ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
