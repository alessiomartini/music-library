import type { Score } from './score';

export interface SongLinks {
  spotify?: string;
  youtube?: string;
  /** Where to consult the published sheet music this transcription was
   * checked against. A link to the publisher/retailer page, not a copy of
   * the sheet itself — the notation is under copyright and can't be
   * redistributed here. */
  sheetMusic?: string;
}

export interface Song {
  slug: string;
  title: string;
  artist: string;
  composer?: string;
  /** Home key, English spelling, e.g. "G", "Eb", "Dm". */
  originalKey: string;
  /** Fret for an *optional* capo that puts the song under easier shapes.
   * The chart is always written in `originalKey`; this is only a suggestion
   * for players who want it, never an assumption that it is in use. */
  capo?: number;
  /** Non-standard guitar tuning, e.g. "Drop D" or "D A D G A D". */
  tuning?: string;
  timeSignature: string;
  tempoBpm: number;
  tempoMarking?: string; // e.g. "Moderately"
  /** Normalized symbolic score: melody, lyrics and harmony. Absent until the
   * song has been transcribed through the audio-first pipeline. */
  score?: Score;
  /** Path to JSON score file (alternative to inline score). */
  scorePath?: string;
  links: SongLinks;
  /** Background/trivia shown in a "History & trivia" section. */
  history?: string;
  notes?: string;
}
