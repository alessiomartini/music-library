// Core music-theory utilities: chord parsing, transposition, and
// conversion between the English (C D E F G A B) and Italian
// (Do Re Mi Fa Sol La Si) chord-naming systems.

export type ChordSystem = 'en' | 'it';

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Every spelling (sharp or flat, in either language) a root can appear as,
// mapped to its chromatic index (0 = C).
const NOTE_TO_INDEX: Record<string, number> = {
  C: 0, 'B#': 0,
  'C#': 1, Db: 1,
  D: 2,
  'D#': 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, 'E#': 5,
  'F#': 6, Gb: 6,
  G: 7,
  'G#': 8, Ab: 8,
  A: 9,
  'A#': 10, Bb: 10,
  B: 11, Cb: 11,
};

const IT_TO_EN_ROOT: Record<string, string> = {
  Do: 'C', Re: 'D', Mi: 'E', Fa: 'F', Sol: 'G', La: 'A', Si: 'B',
};
const EN_TO_IT_ROOT: Record<string, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si',
};

// Keys whose major scale is conventionally spelled with flats.
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm']);

export interface ParsedChord {
  root: string; // English spelling, e.g. "F#"
  quality: string; // everything after the root, e.g. "m7", "sus4", ""
  bass: string | null; // English spelling of slash-bass note, if any
  original: string;
}

const ITALIAN_ROOT_RE = /^(Do|Re|Mi|Fa|Sol|La|Si)(#{1,2}|b{1,2})?/;
const ENGLISH_ROOT_RE = /^([A-G])(#{1,2}|b{1,2})?/;

function parseRoot(text: string): { root: string; rest: string } | null {
  const itMatch = text.match(ITALIAN_ROOT_RE);
  if (itMatch) {
    const base = IT_TO_EN_ROOT[itMatch[1]];
    const accidental = itMatch[2] ?? '';
    return { root: base + accidental, rest: text.slice(itMatch[0].length) };
  }
  const enMatch = text.match(ENGLISH_ROOT_RE);
  if (enMatch) {
    return { root: enMatch[1] + (enMatch[2] ?? ''), rest: text.slice(enMatch[0].length) };
  }
  return null;
}

/** Parse a chord symbol written in either notation system into a
 * normalized, English-rooted representation. Returns null if the text
 * doesn't look like a chord at all (e.g. plain lyric punctuation). */
export function parseChord(raw: string): ParsedChord | null {
  const text = raw.trim();
  const [main, slashBass] = text.split('/');
  const rootParsed = parseRoot(main);
  if (!rootParsed) return null;

  let bass: string | null = null;
  if (slashBass) {
    const bassParsed = parseRoot(slashBass);
    bass = bassParsed ? bassParsed.root : slashBass;
  }

  return {
    root: normalizeAccidentals(rootParsed.root),
    quality: rootParsed.rest,
    bass: bass ? normalizeAccidentals(bass) : null,
    original: raw,
  };
}

function normalizeAccidentals(spelling: string): string {
  const idx = NOTE_TO_INDEX[spelling];
  if (idx === undefined) return spelling;
  return SHARP_NAMES[idx];
}

function indexOfNote(spelling: string): number {
  return NOTE_TO_INDEX[spelling] ?? 0;
}

function spellNote(index: number, preferFlats: boolean): string {
  const i = ((index % 12) + 12) % 12;
  return preferFlats ? FLAT_NAMES[i] : SHARP_NAMES[i];
}

/** Shift a chord by a number of semitones (can be negative). `preferFlats`
 * controls whether the result is spelled with sharps or flats. */
export function transposeChord(chord: ParsedChord, semitones: number, preferFlats: boolean): ParsedChord {
  const newRootIdx = indexOfNote(chord.root) + semitones;
  const newRoot = spellNote(newRootIdx, preferFlats);
  const newBass = chord.bass ? spellNote(indexOfNote(chord.bass) + semitones, preferFlats) : null;
  return { ...chord, root: newRoot, bass: newBass };
}

/** Render a parsed chord in the requested notation system. */
export function formatChord(chord: ParsedChord, system: ChordSystem): string {
  const rootName = system === 'it' ? toItalianRoot(chord.root) : chord.root;
  const bassName = chord.bass ? (system === 'it' ? toItalianRoot(chord.bass) : chord.bass) : null;
  const quality = system === 'it' ? italianizeQuality(chord.quality) : chord.quality;
  return rootName + quality + (bassName ? '/' + bassName : '');
}

function toItalianRoot(spelling: string): string {
  const base = spelling[0];
  const accidental = spelling.slice(1);
  return (EN_TO_IT_ROOT[base] ?? base) + accidental;
}

// Italian charts conventionally still use "m" for minor and standard
// extension numbers/abbreviations (m7, maj7, sus4, dim, aug...), so we
// mostly pass the quality through unchanged. The one common variant is
// writing minor as "-" instead of "m"; we keep "m" for clarity/consistency.
function italianizeQuality(quality: string): string {
  return quality;
}

/** Convenience: transpose + reformat a raw chord string in one step. */
export function convertChord(raw: string, semitones: number, system: ChordSystem, preferFlats: boolean): string {
  const parsed = parseChord(raw);
  if (!parsed) return raw;
  const transposed = semitones !== 0 ? transposeChord(parsed, semitones, preferFlats) : parsed;
  return formatChord(transposed, system);
}

/** Transpose a key label (e.g. "Am", "Eb") and format it in a system. */
export function transposeKeyLabel(key: string, semitones: number, system: ChordSystem, preferFlats: boolean): string {
  const parsed = parseChord(key);
  if (!parsed) return key;
  const t = semitones !== 0 ? transposeChord(parsed, semitones, preferFlats) : parsed;
  return formatChord(t, system);
}

/** Shortest semitone distance (in [-6, 5]) to go from one key to another. */
export function semitoneDiff(from: string, to: string): number {
  const diff = (keyIndex(to) - keyIndex(from) + 12) % 12;
  return diff > 6 ? diff - 12 : diff;
}

export const ALL_KEYS_SHARP = SHARP_NAMES;
export const ALL_KEYS_FLAT = FLAT_NAMES;

export function keyIndex(key: string): number {
  const parsed = parseRoot(key);
  return parsed ? indexOfNote(normalizeAccidentals(parsed.root)) : 0;
}

export function keyName(index: number, system: ChordSystem, preferFlats: boolean): string {
  const spelling = spellNote(index, preferFlats);
  return system === 'it' ? toItalianRoot(spelling) : spelling;
}

export function shouldPreferFlats(key: string): boolean {
  return FLAT_KEYS.has(key);
}

/** Transpose a VexFlow-style pitch string, e.g. "f#/4" -> "g/4". */
export function transposePitch(pitch: string, semitones: number, preferFlats: boolean): string {
  const [note, octaveStr] = pitch.split('/');
  const letter = note[0].toUpperCase();
  const accidental = note.slice(1).replace('n', '');
  const spelling = letter + accidental.replace(/x/g, '##');
  const idx = indexOfNote(spelling);
  const shifted = idx + semitones;
  const octave = parseInt(octaveStr, 10);
  const octaveShift = Math.floor(shifted / 12);
  const newSpelling = spellNote(shifted, preferFlats);
  const vexAccidental = newSpelling.slice(1).replace('#', '#').replace('b', 'b');
  return `${newSpelling[0].toLowerCase()}${vexAccidental}/${octave + octaveShift}`;
}

/** Absolute semitone index of a VexFlow-style pitch (for comparing/sorting pitches). */
export function pitchAbsoluteIndex(pitch: string): number {
  const [note, octaveStr] = pitch.split('/');
  const letter = note[0].toUpperCase();
  const accidental = note.slice(1).replace('n', '').replace(/x/g, '##');
  const idx = indexOfNote(letter + accidental);
  return parseInt(octaveStr, 10) * 12 + idx;
}

/** Human-readable scientific pitch label, e.g. "f#/4" -> "F#4". */
export function pitchLabel(pitch: string, preferFlats: boolean): string {
  const [note, octaveStr] = pitch.split('/');
  const letter = note[0].toUpperCase();
  const accidental = note.slice(1).replace('n', '').replace(/x/g, '##');
  const idx = indexOfNote(letter + accidental);
  return `${spellNote(idx, preferFlats)}${octaveStr}`;
}
