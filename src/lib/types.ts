import type { Score } from './score';
import type { KeyEstimate } from './songKey';

/** One Spotify recording of a song; `artist` is who plays it (performers, for classical pieces). */
export interface SpotifyVersion {
  url: string;
  artist: string;
  /** What sets it apart, e.g. "Live", "Acoustic", "2009 Remaster". */
  note?: string;
  /** Cover art of the album the recording is on (Spotify CDN). */
  albumImage?: string;
  /** Release year of the album the recording is on. */
  year?: number;
}

export interface SongLinks {
  spotify?: string;
  /** Other Spotify recordings (versions, covers) liked or saved in a playlist. */
  spotifyVersions?: SpotifyVersion[];
  /** YouTube covers (artist = who plays it). */
  youtubeVersions?: SpotifyVersion[];
  youtube?: string;
  /** Where to consult the published sheet music this transcription was
   * checked against. A link to the publisher/retailer page, not a copy of
   * the sheet itself — the notation is under copyright and can't be
   * redistributed here. */
  sheetMusic?: string;
  /** Direct chords/lyrics page; without it the page links to a site search. */
  accordiESpartiti?: string;
  ultimateGuitar?: string;
  /** Posts saved in Alessio's Instagram "piano" collection. */
  instagram?: string[];
}

/** A short excerpt of a song's Wikipedia article (scripts/fetch-history.ts). */
export interface SongHistory {
  /** 2–4 sentences from the lead of the article (CC BY-SA 4.0). */
  text: string;
  url: string;
  /** Wikipedia language edition, e.g. "it". */
  lang: string;
}

export interface Song {
  slug: string;
  title: string;
  artist: string;
  composer?: string;
  /** Home key, English spelling, e.g. "G", "Eb", "Dm". */
  originalKey?: string;
  /** Fret for an *optional* capo that puts the song under easier shapes.
   * The chart is always written in `originalKey`; this is only a suggestion
   * for players who want it, never an assumption that it is in use. */
  capo?: number;
  /** Non-standard guitar tuning, e.g. "Drop D" or "D A D G A D". */
  tuning?: string;
  timeSignature?: string;
  tempoBpm?: number;
  tempoMarking?: string; // e.g. "Moderately"
  /** Normalized symbolic score: melody, lyrics and harmony. Absent until the
   * song has been transcribed through the audio-first pipeline. */
  score?: Score;
  /** Path to JSON score file (alternative to inline score). */
  scorePath?: string;
  links: SongLinks;
  /** Cover art of the album of the main Spotify recording. */
  albumImage?: string;
  /** Year the song came out: earliest release among its Spotify recordings. */
  year?: number;
  /** Key found on the web (scripts/fetch-keys.ts) for songs without a curated `originalKey`. */
  keyEstimate?: KeyEstimate;
  /** Classical piece: no chord-site links. */
  classical?: boolean;
  /** Background/trivia shown in a "History & trivia" section. */
  history?: string;
  notes?: string;
}
