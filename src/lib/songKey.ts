import { keyIndex, parseChord } from './theory';
import type { Score } from './score';

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

// --- Key estimated from chords --------------------------------------------

/** A chord as the estimator needs it: root pitch class, quality, and how long it sounds. */
export interface KeyChord {
  /** Pitch class of the root, 0 = C. */
  root: number;
  /** Semantic quality as in `ChordQuality` (score.ts); unknown qualities count as major triads. */
  quality: string;
  /** Any positive weight: ticks, beats, number of occurrences. */
  duration: number;
}

/** Result of `estimateKeyFromChords`; the key is an estimate, never a fact. */
export interface ChordKeyEstimate {
  /** Normalized key label ("C", "Am", "Bb", ...). */
  key: string;
  /** Runner-up key, usually the relative or the dominant/subdominant neighbour. */
  runnerUp: string;
  /** Score gap between the best and the runner-up, as a share of the total chord time (0..~1). */
  margin: number;
}

const CHORD_TONES: Record<string, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dominant7: [0, 4, 7, 10],
  sus4: [0, 5, 7],
  dominant7sus4: [0, 5, 7, 10],
  major6: [0, 4, 7, 9],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  halfDiminished7: [0, 3, 6, 10],
  augmented: [0, 4, 8],
};
const MINOR_QUALITIES = new Set(['minor', 'minor7', 'halfDiminished7']);
const DOMINANT_QUALITIES = new Set(['major', 'dominant7', 'dominant7sus4', 'sus4']);

// Scale degrees (semitones above the tonic). Minor allows the raised 7th (harmonic minor's leading tone).
const MAJOR_SCALE = new Set([0, 2, 4, 5, 7, 9, 11]);
const MINOR_SCALE = new Set([0, 2, 3, 5, 7, 8, 10, 11]);

function scoreKey(chords: KeyChord[], tonic: number, minor: boolean): number {
  const scale = minor ? MINOR_SCALE : MAJOR_SCALE;
  let fit = 0;
  let tonicTime = 0;
  let dominantTime = 0;
  for (const chord of chords) {
    const tones = CHORD_TONES[chord.quality] ?? CHORD_TONES.major;
    const rel = (chord.root - tonic + 12) % 12;
    // Each chord tone inside the scale supports the key, each one outside counts against it;
    // the root matters more than the other tones.
    let chordFit = 0;
    tones.forEach((interval, i) => {
      const inScale = scale.has((rel + interval) % 12);
      const weight = i === 0 ? 2 : 1;
      chordFit += inScale ? weight : -weight;
    });
    fit += (chord.duration * chordFit) / (tones.length + 1);
    // Tonic chord with the right third, and the dominant (major in either mode: harmonic minor).
    if (rel === 0 && MINOR_QUALITIES.has(chord.quality) === minor && chord.quality !== 'sus4') tonicTime += chord.duration;
    if (rel === 7 && DOMINANT_QUALITIES.has(chord.quality)) dominantTime += chord.duration;
  }
  const total = chords.reduce((n, c) => n + c.duration, 0);
  let score = fit + 1.5 * tonicTime + 0.5 * dominantTime;
  // Songs usually start and end on the tonic.
  const first = chords[0];
  const last = chords[chords.length - 1];
  for (const edge of [first, last]) {
    if ((edge.root - tonic + 12) % 12 === 0 && MINOR_QUALITIES.has(edge.quality) === minor) score += 0.08 * total;
  }
  return score;
}

/**
 * Estimates the key of a chord sequence (in time order) by testing all 24
 * major/minor keys: chord tones inside the scale add to the score, chromatic
 * ones subtract; time spent on the tonic chord (and, less, on the dominant)
 * and a first/last chord on the tonic break the tie between a major key and
 * its relative minor. Returns null for an empty sequence. A heuristic: borrowed
 * chords are tolerated but a modulating song gets one (the dominant) key.
 */
export function estimateKeyFromChords(chords: KeyChord[]): ChordKeyEstimate | null {
  const usable = chords.filter((c) => c.duration > 0 && Number.isFinite(c.root));
  if (usable.length === 0) return null;
  const total = usable.reduce((n, c) => n + c.duration, 0);
  const scored: { key: string; score: number }[] = [];
  for (let tonic = 0; tonic < 12; tonic++) {
    scored.push({ key: MAJOR[tonic], score: scoreKey(usable, tonic, false) });
    scored.push({ key: MINOR[tonic], score: scoreKey(usable, tonic, true) });
  }
  scored.sort((a, b) => b.score - a.score);
  return { key: scored[0].key, runnerUp: scored[1].key, margin: (scored[0].score - scored[1].score) / total };
}

/** Key estimated from a score's harmony layer (a cross-check for `score.originalKey`, never a replacement). */
export function estimateScoreKey(score: Pick<Score, 'harmony'>): ChordKeyEstimate | null {
  return estimateKeyFromChords(
    score.harmony.map((h) => ({ root: h.root, quality: h.quality, duration: h.duration })),
  );
}
