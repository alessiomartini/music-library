import type { ArtistInfo } from './artist';

/** A pitch range in MIDI note numbers (C4 = 60). */
export interface PitchRange {
  low: number;
  high: number;
}

const LETTERS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ITALIAN: Record<string, string> = { do: 'C', re: 'D', mi: 'E', fa: 'F', sol: 'G', la: 'A', si: 'B' };

/** Parses "E2", "Bb4", "F#3" or Italian "Mi2", "Sib4", "Fa#3" to a MIDI number. */
export function parseNote(raw: string): number | null {
  const m = raw.trim().match(/^(do|re|mi|fa|sol|la|si|[a-g])(#|b|♯|♭)?(-?\d)$/i);
  if (!m) return null;
  const letter = ITALIAN[m[1].toLowerCase()] ?? m[1].toUpperCase();
  const accidental = m[2] === '#' || m[2] === '♯' ? 1 : m[2] === 'b' || m[2] === '♭' ? -1 : 0;
  return LETTERS[letter] + accidental + 12 * (Number(m[3]) + 1);
}

const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const NAMES_IT = ['Do', 'Do#', 'Re', 'Mib', 'Mi', 'Fa', 'Fa#', 'Sol', 'Lab', 'La', 'Sib', 'Si'];

export function noteName(midi: number, italian = false): string {
  return `${(italian ? NAMES_IT : NAMES)[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

/**
 * Typical singing range of each Wikidata voice type. These are textbook
 * approximations, not measurements of the singer.
 */
const VOICE_TYPES: Record<string, [string, string]> = {
  soprano: ['C4', 'A5'],
  'mezzo-soprano': ['A3', 'F5'],
  contralto: ['F3', 'D5'],
  alto: ['F3', 'D5'],
  countertenor: ['E3', 'E5'],
  tenor: ['C3', 'A4'],
  baritone: ['A2', 'F4'],
  'bass-baritone': ['F2', 'E4'],
  bass: ['E2', 'E4'],
};

/** Rough fallback when only the singer's sex is known. */
const BY_SEX: Record<'male' | 'female', [string, string]> = { male: ['A2', 'G4'], female: ['F3', 'D5'] };

export interface ArtistRange extends PitchRange {
  /** How the range was obtained, for display. */
  basis: string;
}

/** Approximate vocal range of an artist, from their voice type or, failing that, their sex. */
export function artistRange(artist: ArtistInfo | undefined): ArtistRange | null {
  const voice = artist?.voiceType?.toLowerCase();
  const pair = voice && VOICE_TYPES[voice] ? VOICE_TYPES[voice] : artist?.sex ? BY_SEX[artist.sex] : null;
  if (!pair) return null;
  const basis = voice && VOICE_TYPES[voice] ? `voice type: ${voice}` : `typical ${artist!.sex} voice`;
  return { low: parseNote(pair[0])!, high: parseNote(pair[1])!, basis };
}

/**
 * Semitones to move a song so the artist's range sits centred in the user's
 * range: the song's middle lands on the middle of the user's voice.
 */
export function rangeShift(artist: PitchRange, user: PitchRange): number {
  return Math.round((user.low + user.high - (artist.low + artist.high)) / 2);
}

/** Transposition (in −6…+5) that takes a key to the same key moved by `shift` semitones. */
export function keyShift(shift: number): number {
  const s = ((shift % 12) + 12) % 12;
  return s > 5 ? s - 12 : s;
}

