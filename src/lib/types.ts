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
  /** Engraved lead sheet: melody + chord symbols + bass line, by section. */
  leadSheet?: LeadSheetSystem[];
  links: SongLinks;
  /** Background/trivia shown in a "History & trivia" section. */
  history?: string;
  notes?: string;
}
