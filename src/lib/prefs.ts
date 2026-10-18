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

/** The user's voice, as note names ("E2", "Sib4"); empty when not set. */
export interface VoicePrefs {
  /** Range the user sings in comfortably: what key suggestions aim for. */
  comfortableLow: string;
  comfortableHigh: string;
  /** Full range, chest and falsetto included (optional, for reference). */
  fullLow: string;
  fullHigh: string;
}

// Defaults to Alessio's range (17 Sep 2026); each browser can change it.
export function useVoicePrefs() {
  return useLocalStorage<VoicePrefs>('voice-prefs', { comfortableLow: 'Mi2', comfortableHigh: 'Sib4', fullLow: '', fullHigh: '' });
}

export interface GlobalPrefs {
  system: ChordSystem;
}

const DEFAULT_GLOBAL_PREFS: GlobalPrefs = { system: 'it' };

export function useGlobalPrefs() {
  return useLocalStorage<GlobalPrefs>('global-prefs', DEFAULT_GLOBAL_PREFS);
}

export interface FeedbackNote {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
  /** Page it was written on (the hash route). */
  page?: string;
  /** Sent to site-notes; unsent notes are retried. */
  sent?: boolean;
}

export function useFeedbackNotes() {
  return useLocalStorage<FeedbackNote[]>('feedback-notes', []);
}
