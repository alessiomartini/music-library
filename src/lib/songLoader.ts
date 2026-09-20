import { loadScoreJson } from './scoreLoader';
import type { Score } from './score';
import type { Song } from './types';

export interface LoadedSongData {
  song: Song;
  score: Score | null;
}

/**
 * Load a song's score from a JSON file.
 * Returns the parsed and validated Score, or null if not found/error.
 */
export async function loadSongScore(song: Song): Promise<Score | null> {
  // Check if song has a scorePath property (for JSON files)
  const scorePath = (song as any).scorePath as string | undefined;

  if (!scorePath) {
    return null;
  }

  try {
    const response = await fetch(scorePath);
    if (!response.ok) {
      console.warn(`Failed to load score from ${scorePath}: ${response.statusText}`);
      return null;
    }
    const json = await response.json();
    return loadScoreJson(json);
  } catch (error) {
    console.error(`Error loading score from ${scorePath}:`, error);
    return null;
  }
}

/**
 * Check if a song has a score available (either inline or via path).
 */
export function hasScore(song: Song): boolean {
  return !!(song as any).score || !!(song as any).scorePath;
}