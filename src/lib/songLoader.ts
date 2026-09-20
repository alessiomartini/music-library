import { loadScoreJson } from './scoreLoader';
import type { Score } from './score';
import type { Song } from './types';

export interface LoadedSongData {
  song: Song;
  score: Score | null;
}

/**
 * Load a song's score, either already inline on the song or fetched from
 * its scorePath JSON file. Returns the validated Score, or null if neither
 * is present or loading fails.
 */
export async function loadSongScore(song: Song): Promise<Score | null> {
  if (song.score) {
    return song.score;
  }

  const scorePath = song.scorePath;

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
  return !!song.score || !!song.scorePath;
}