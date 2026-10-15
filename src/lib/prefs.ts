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

export function useVoicePrefs() {
  return useLocalStorage<VoicePrefs>('voice-prefs', { comfortableLow: '', comfortableHigh: '', fullLow: '', fullHigh: '' });
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
}

export function useFeedbackNotes() {
  return useLocalStorage<FeedbackNote[]>('feedback-notes', []);
}
