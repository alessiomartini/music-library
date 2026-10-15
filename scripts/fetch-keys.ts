/**
 * Looks up each song's key on the web and writes src/data/songs/keys.ts.
 *
 * Sources, most to least trusted:
 *   - Hooktheory TheoryTab (hand analysis of the recording);
 *   - Ultimate Guitar "Official" transcriptions (transcribed from the recording);
 *   - Ultimate Guitar user chord/tab pages (votes-weighted; often transposed
 *     to easier shapes, so only a hint).
 * When the trusted sources agree (or only one has an answer) the song gets a
 * `key`; otherwise it gets the `candidates` in order of support. Classical
 * pieces and songs with a curated `originalKey` are skipped.
 *
 * Raw responses are cached in node_modules/.cache/keys/ so re-runs only
 * fetch what is missing.
 *
 * Run with:  npm run fetch:keys
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { songs } from '../src/data/songs';
import { normalizeKey, type KeyEstimate, type KeySource } from '../src/lib/songKey';

const OUT = 'src/data/songs/keys.ts';
const CACHE = 'node_modules/.cache/keys';
const UA = 'Mozilla/5.0 (music-library key lookup)';
mkdirSync(CACHE, { recursive: true });

const run = promisify(execFile);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get(url: string): Promise<string | null> {
  const file = `${CACHE}/${createHash('sha1').update(url).digest('hex')}`;
  if (existsSync(file)) {
    const cached = readFileSync(file, 'utf8');
    return cached === '\u0000404' ? null : cached;
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    await sleep(700);
    // curl rather than fetch: it honours the HTTPS_PROXY of sandboxed environments.
    const res = await run('curl', ['-s', '-L', '-m', '30', '-A', UA, '-w', '\n%{http_code}', url], { maxBuffer: 64 << 20 })
      .then(({ stdout }) => ({ status: Number(stdout.slice(stdout.lastIndexOf('\n') + 1)), text: stdout.slice(0, stdout.lastIndexOf('\n')) }))
      .catch(() => null);
    if (res?.status === 404) { writeFileSync(file, '\u0000404'); return null; }
    if (res && res.status >= 200 && res.status < 300) { writeFileSync(file, res.text); return res.text; }
    await sleep(3000 * (attempt + 1));
  }
  return null;
}

function norm(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
}
const slug = (s: string) => norm(s).replace(/ and /g, ' ').replace(/\s+/g, '-');
const mainArtist = (artist: string) => artist.split(/,| ft\. | feat\. | & /)[0].trim();

const artistMatches = (candidate: string, artist: string) => {
  const a = norm(candidate);
  return norm(artist).split(' ').filter((w) => w.length > 2).some((w) => a.includes(w)) || norm(artist).includes(a);
};
const titleMatches = (candidate: string, title: string) => {
  const [a, b] = [norm(candidate), norm(title)];
  return a === b || a.startsWith(`${b} `) || b.startsWith(`${a} `);
};

async function hooktheory(title: string, artist: string): Promise<KeySource | null> {
  const url = `https://www.hooktheory.com/theorytab/view/${slug(mainArtist(artist))}/${slug(title)}`;
  const html = await get(url);
  const m = html?.match(/>Key ([A-G][#b♯♭]?) (Major|Minor|Dorian|Mixolydian|Phrygian|Lydian|Locrian)</);
  if (!m) return null;
  const key = normalizeKey(`${m[1]}${m[2] === 'Minor' ? 'm' : ''}`);
  return key && (m[2] === 'Major' || m[2] === 'Minor') ? { source: 'Hooktheory', url, key } : null;
}

interface UgResult { song_name: string; artist_name: string; type: string | null; tonality_name: string | null; votes: number | null; tab_url: string }

async function ultimateGuitar(title: string, artist: string): Promise<KeySource[]> {
  const url = `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(`${title} ${mainArtist(artist)}`)}`;
  const html = await get(url);
  const m = html?.match(/class="js-store" data-content="([^"]+)"/);
  if (!m) return [];
  const json = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'");
  let results: UgResult[] = [];
  try { results = JSON.parse(json).store.page.data.results ?? []; } catch { return []; }
  return results
    .filter((r) => r.tonality_name && r.type && ['Official', 'Chords', 'Tabs', 'Ukulele Chords'].includes(r.type))
    .filter((r) => titleMatches(r.song_name, title) && artistMatches(r.artist_name, artist))
    .flatMap((r) => {
      const key = normalizeKey(r.tonality_name!);
      return key ? [{ source: r.type === 'Official' ? 'Ultimate Guitar (official)' : 'Ultimate Guitar', url: r.tab_url, key, votes: r.votes ?? 0 }] : [];
    });
}

function decide(sources: KeySource[]): KeyEstimate | null {
  if (!sources.length) return null;
  const trusted = sources.filter((s) => s.source !== 'Ultimate Guitar');
  const support = new Map<string, number>();
  for (const s of sources) {
    const weight = s.source === 'Ultimate Guitar' ? 1 + Math.log2(1 + (s.votes ?? 0)) : 20;
    support.set(s.key, (support.get(s.key) ?? 0) + weight);
  }
  const ranked = [...support.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const keep = (list: KeySource[]) => list.map(({ source, url, key }) => ({ source, url, key }));
  const trustedKeys = new Set(trusted.map((s) => s.key));
  if (trustedKeys.size === 1) return { key: [...trustedKeys][0], sources: keep(trusted) };
  // No trusted source, or trusted sources disagree: list what the sources say.
  const best = (key: string) => sources.filter((s) => s.key === key).sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))[0];
  return { candidates: ranked.slice(0, 3), sources: keep(ranked.slice(0, 3).map(best)) };
}

const targets = songs.filter((s) => !s.classical && !s.originalKey);
const out: Record<string, KeyEstimate> = {};
let done = 0;
for (const s of targets) {
  const [ht, ug] = await Promise.all([hooktheory(s.title, s.artist), ultimateGuitar(s.title, s.artist)]);
  const estimate = decide([...(ht ? [ht] : []), ...ug]);
  if (estimate) out[s.slug] = estimate;
  if (++done % 50 === 0) console.log(`${done}/${targets.length}`);
}

const q = (v: unknown) => JSON.stringify(v);
const lines = Object.keys(out).sort().map((slugKey) => {
  const e = out[slugKey];
  const head = e.key ? `key: ${q(e.key)}` : `candidates: ${q(e.candidates)}`;
  const src = e.sources.map((s) => `{ source: ${q(s.source)}, url: ${q(s.url)}, key: ${q(s.key)} }`).join(', ');
  return `  ${q(slugKey)}: { ${head}, sources: [${src}] },`;
});
writeFileSync(OUT, [
  "import type { KeyEstimate } from '../../lib/songKey';",
  '',
  '// Generated by scripts/fetch-keys.ts (Hooktheory, Ultimate Guitar). Do not edit by hand.',
  'export const songKeys: Record<string, KeyEstimate> = {',
  ...lines,
  '};',
  '',
].join('\n'));
const sure = Object.values(out).filter((e) => e.key).length;
console.log(`${targets.length} songs → ${sure} with a key, ${Object.keys(out).length - sure} with candidates, ${targets.length - Object.keys(out).length} not found → ${OUT}`);
