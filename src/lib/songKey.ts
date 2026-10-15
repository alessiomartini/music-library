import { keyIndex, parseChord } from './theory';

/** Where a key estimate came from. */
export interface KeySource {
  source: string;
  url: string;
  /** The key this source gives, normalized (see `normalizeKey`). */
  key: string;
  votes?: number;
}

/**
 * A song's key as found on the web: a `key` when the trusted sources agree,
 * otherwise the `candidates` (most supported first).
 */
export interface KeyEstimate {
  key?: string;
  candidates?: string[];
  sources: KeySource[];
}

// Conventional spelling of each key: major and minor tonics by chromatic index.
const MAJOR = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MINOR = ['Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];

/**
 * Normalizes a key label ("G", "Em", "A#", "Gbm", "F# minor") to one spelling
 * per key ("G", "Em", "Bb", "F#m", "F#m"), or null when it isn't a plain
 * major/minor key.
 */
export function normalizeKey(raw: string): string | null {
  const label = raw.trim().replace(/♯/g, '#').replace(/♭/g, 'b').replace(/\s*(minor|min)$/i, 'm').replace(/\s*(major|maj)$/i, '');
  const chord = parseChord(label);
  if (!chord || (chord.quality !== '' && chord.quality !== 'm') || chord.bass) return null;
  const index = keyIndex(label);
  return chord.quality === 'm' ? MINOR[index] : MAJOR[index];
}
