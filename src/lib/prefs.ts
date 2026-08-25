import { useLocalStorage } from './storage';
import type { ChordSystem } from './theory';

export interface SongPrefs {
  semitones: number;
  preferredKey: string; // e.g. "G", empty if not set
  note: string;
}

const DEFAULT_SONG_PREFS: SongPrefs = { semitones: 0, preferredKey: '', note: '' };

export function useSongPrefs(slug: string) {
  return useLocalStorage<SongPrefs>(`song-prefs:${slug}`, DEFAULT_SONG_PREFS);
}

export interface GlobalPrefs {
  system: ChordSystem;
  showBass: boolean;
}

const DEFAULT_GLOBAL_PREFS: GlobalPrefs = { system: 'it', showBass: true };

export function useGlobalPrefs() {
  return useLocalStorage<GlobalPrefs>('global-prefs', DEFAULT_GLOBAL_PREFS);
}

export interface FeedbackNote {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export function useFeedbackNotes() {
  return useLocalStorage<FeedbackNote[]>('feedback-notes', []);
}
