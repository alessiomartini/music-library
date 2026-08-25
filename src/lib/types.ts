export interface LeadSheetNote {
  /** VexFlow pitch, e.g. "c#/4". Ignored when `rest` is set. */
  pitch: string;
  /** VexFlow duration, e.g. "q", "8", "h", "qd" (dotted quarter). */
  duration: string;
  rest?: boolean;
  /** Syllable/word sung on this note, shown under the staff. */
  lyric?: string;
  /** Chord symbol (English notation) that starts sounding on this note. */
  chord?: string;
}

export interface LeadSheetMeasure {
  melody: LeadSheetNote[];
  bass: LeadSheetNote[];
}

export interface LeadSheetSystem {
  label: string; // "Verse 1", "Chorus", ...
  measures: LeadSheetMeasure[];
}

export interface SongSection {
  label: string; // "Verse 1", "Chorus", ...
  /** Lines in ChordPro-ish syntax: "[C]Some [G]lyrics here" */
  lines: string[];
}

export interface SongLinks {
  spotify?: string;
  youtube?: string;
}

export interface Song {
  slug: string;
  title: string;
  artist: string;
  composer?: string;
  /** Home key, English spelling, e.g. "G", "Eb", "Dm". */
  originalKey: string;
  capo?: number;
  timeSignature: string;
  tempoBpm: number;
  tempoMarking?: string; // e.g. "Moderately"
  /** Full lyrics + chords, in ChordPro-ish text form. */
  sections: SongSection[];
  /** Engraved lead-sheet excerpt: melody + chord symbols + bass line. */
  leadSheet?: LeadSheetSystem[];
  links: SongLinks;
  notes?: string;
}
