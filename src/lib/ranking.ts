import type { Song } from './types';

export type Order = 'mix' | 'mine' | 'global';
export const MIX_MINE = 0.7;

/** Spotify track ids of every recording linked to a song. */
export function trackIds(s: Song): string[] {
  const urls = [s.links.spotify, ...(s.links.spotifyVersions ?? []).map((v) => v.url), ...(s.translations ?? []).map((t) => t.spotify)];
  return urls.flatMap((u) => u?.match(/\/track\/(\w+)/)?.[1] ?? []);
}

/** Percentile 0-100 of each value among all of them; ties share the average rank. */
export function percentiles<K>(values: Map<K, number>): Map<K, number> {
  const sorted = [...values.values()].sort((a, b) => a - b);
  const n = sorted.length;
  const first = new Map<number, number>();
  const last = new Map<number, number>();
  sorted.forEach((v, i) => { if (!first.has(v)) first.set(v, i); last.set(v, i); });
  return new Map([...values].map(([k, v]) => [k, n < 2 ? 50 : ((first.get(v)! + last.get(v)!) / 2 / (n - 1)) * 100]));
}

/** Global score: percentile of the best Spotify popularity among a song's recordings (songs without one are absent). */
export function globalScores(songs: Song[], popularity: Record<string, number>): Map<string, number> {
  const raw = new Map<string, number>();
  for (const s of songs) {
    const p = Math.max(0, ...trackIds(s).map((id) => popularity[id] ?? 0));
    if (p > 0) raw.set(s.slug, p);
  }
  return percentiles(raw);
}

/** Order key of a song; missing "mine" counts as 0, missing "global" falls back to "mine" in the mix. */
export function score(order: Order, mine?: number, global?: number): number {
  if (order === 'mine') return mine ?? 0;
  if (order === 'global') return global ?? 0;
  return global === undefined ? (mine ?? 0) : MIX_MINE * (mine ?? 0) + (1 - MIX_MINE) * global;
}
