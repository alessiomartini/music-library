/**
 * Downloads Alessio's Spotify Liked Songs and his own playlists as
 * Exportify-style CSVs, the input of scripts/import-spotify.ts, so the import
 * runs without exporting by hand (.github/workflows/spotify-import.yml runs it weekly).
 *
 * Needs a Spotify app (developer.spotify.com/dashboard, redirect URI
 * http://127.0.0.1:8888/callback) and these environment variables:
 *   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET   from the app's settings
 *   SPOTIFY_REFRESH_TOKEN                      printed once by  npm run fetch:spotify -- --login
 *
 * Run with:  npm run fetch:spotify [-- outDir]   (default node_modules/.cache/spotify-csv)
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';

const REDIRECT = 'http://127.0.0.1:8888/callback';
const SCOPES = 'user-library-read playlist-read-private playlist-read-collaborative';
const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
if (!id || !secret) throw new Error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (see the header of this script)');

async function token(body: Record<string, string>) {
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  });
  if (!r.ok) throw new Error(`Spotify token: ${r.status} ${await r.text()}`);
  return (await r.json()) as { access_token: string; refresh_token?: string };
}

/** One-time: opens the consent page and prints the refresh token to store as a secret. */
async function login() {
  const url = `https://accounts.spotify.com/authorize?${new URLSearchParams({ client_id: id!, response_type: 'code', redirect_uri: REDIRECT, scope: SCOPES })}`;
  console.log(`Open this URL, accept, and come back here:\n${url}`);
  const code = await new Promise<string>((resolve) => {
    const server = createServer((req, res) => {
      const c = new URL(req.url ?? '', REDIRECT).searchParams.get('code');
      res.end(c ? 'Done, you can close this tab.' : 'No code in the URL.');
      if (c) { server.close(); resolve(c); }
    }).listen(8888, '127.0.0.1');
  });
  const t = await token({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT });
  console.log(`\nSPOTIFY_REFRESH_TOKEN=${t.refresh_token}\n(keep it secret: store it as a GitHub Actions secret)`);
}

interface ApiTrack {
  uri: string;
  name: string;
  artists: { name: string }[];
  popularity?: number;
  album: { release_date: string; images: { url: string }[] };
}

async function pages<T>(url: string, auth: string): Promise<T[]> {
  const items: T[] = [];
  for (let next: string | null = url; next; ) {
    const r = await fetch(next, { headers: { Authorization: auth } });
    if (r.status === 429) { await new Promise((s) => setTimeout(s, 1000 * Number(r.headers.get('Retry-After') ?? 5))); continue; }
    if (!r.ok) throw new Error(`${next}: ${r.status} ${await r.text()}`);
    const page = (await r.json()) as { items: T[]; next: string | null };
    items.push(...page.items);
    next = page.next;
  }
  return items;
}

const cell = (s: string) => `"${s.replace(/"/g, '""')}"`;
/** Exportify's columns, as import-spotify.ts reads them; commas inside an artist name are escaped. */
function csv(tracks: (ApiTrack | null)[]): string {
  const rows = [['Track URI', 'Track Name', 'Artist Name(s)', 'Popularity', 'Album Release Date', 'Album Image URL']];
  for (const t of tracks) {
    if (!t?.uri) continue;
    rows.push([t.uri, t.name, t.artists.map((a) => a.name.replace(/,/g, '\\,')).join(','), String(t.popularity ?? 0),
      t.album.release_date, t.album.images[0]?.url ?? '']);
  }
  return rows.map((r) => r.map(cell).join(',')).join('\n') + '\n';
}

async function main() {
  if (process.argv.includes('--login')) return login();
  if (!refresh) throw new Error('Set SPOTIFY_REFRESH_TOKEN (run  npm run fetch:spotify -- --login  once)');
  const out = process.argv[2] ?? 'node_modules/.cache/spotify-csv';
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const auth = `Bearer ${(await token({ grant_type: 'refresh_token', refresh_token: refresh })).access_token}`;

  const liked = await pages<{ track: ApiTrack }>('https://api.spotify.com/v1/me/tracks?limit=50', auth);
  writeFileSync(`${out}/liked.csv`, csv(liked.map((i) => i.track)));
  console.log(`liked: ${liked.length} tracks`);
  const me = (await (await fetch('https://api.spotify.com/v1/me', { headers: { Authorization: auth } })).json()) as { id: string };
  const playlists = await pages<{ id: string; name: string; owner: { id: string } }>('https://api.spotify.com/v1/me/playlists?limit=50', auth);
  for (const p of playlists.filter((p) => p.owner.id === me.id)) {
    // Items can be podcast episodes; only tracks have an album.
    const items = await pages<{ item: ApiTrack | null }>(`https://api.spotify.com/v1/playlists/${p.id}/items?limit=50`, auth);
    writeFileSync(`${out}/playlist-${p.id}.csv`, csv(items.map((i) => (i.item?.album ? i.item : null))));
    console.log(`${p.name}: ${items.length} items`);
  }
}

main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
