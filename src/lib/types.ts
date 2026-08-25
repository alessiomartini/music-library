export interface MelodyNote {
  /** VexFlow pitch, e.g. "c#/4", or "r" not used — use `rest: true` instead. */
  pitch: string;
  /** VexFlow duration, e.g. "q", "h", "8", "qd" (dotted quarter). */
  duration: string;
  rest?: boolean;
  /** Syllable/word sung on this note, shown under the staff. */
  lyric?: string;
}

export interface MelodyMeasure {
  notes: MelodyNote[];
}

export interface MelodyLine {
  label: string; // e.g. "Voce - Strofa"
  timeSignature: string; // e.g. "4/4"
  measures: MelodyMeasure[];
}

export interface SongSection {
  label: string; // "Strofa 1", "Ritornello", ...
  /** Lines in ChordPro-ish syntax: "[C]Some [G]lyrics here" */
  lines: string[];
}

export interface Song {
  slug: string;
  title: string;
  artist: string;
  /** Home key, English spelling, e.g. "G", "Eb", "Dm". */
  originalKey: string;
  capo?: number;
  timeSignature?: string;
  sections: SongSection[];
  melody?: MelodyLine[];
  notes?: string;
}
