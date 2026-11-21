import { describe, expect, it } from 'vitest';
import { estimateKeyFromChords, normalizeKey, type KeyChord } from './songKey';
import { keyIndex } from './theory';

describe('normalizeKey', () => {
  it('spells each key one way', () => {
    expect(normalizeKey('G')).toBe('G');
    expect(normalizeKey('A#')).toBe('Bb');
    expect(normalizeKey('Gb')).toBe('F#');
    expect(normalizeKey('Gbm')).toBe('F#m');
    expect(normalizeKey('D#m')).toBe('Ebm');
    expect(normalizeKey('E minor')).toBe('Em');
    expect(normalizeKey('Bb Major')).toBe('Bb');
  });

  it('rejects labels that are not plain keys', () => {
    expect(normalizeKey('G7')).toBeNull();
    expect(normalizeKey('C/G')).toBeNull();
    expect(normalizeKey('')).toBeNull();
  });
});

// "C Am7 G7" -> chords of one unit each, from plain symbols.
function seq(text: string, durations: number[] = []): KeyChord[] {
  return text.split(/\s+/).map((symbol, i) => {
    const m = symbol.match(/^([A-G][#b]?)(.*)$/)!;
    const quality =
      { '': 'major', m: 'minor', '7': 'dominant7', m7: 'minor7', maj7: 'major7', m7b5: 'halfDiminished7', sus4: 'sus4' }[m[2]] ?? 'major';
    return { root: keyIndex(m[1]), quality, duration: durations[i] ?? 1 };
  });
}

describe('estimateKeyFromChords', () => {
  it('finds C major from C-Am-F-G', () => {
    expect(estimateKeyFromChords(seq('C Am F G C Am F G'))?.key).toBe('C');
  });

  it('finds A minor from Am-Dm-E7-Am', () => {
    expect(estimateKeyFromChords(seq('Am Dm E7 Am'))?.key).toBe('Am');
  });

  it('tells a major key from its relative minor by where the song rests', () => {
    // Same four chords, different home: ends on C vs ends on Am.
    expect(estimateKeyFromChords(seq('Am F G C'))?.key).toBe('C');
    expect(estimateKeyFromChords(seq('C F G Am F E7 Am'))?.key).toBe('Am');
  });

  it('is transposition-equivariant', () => {
    const base = seq('G Em C D G Em C D7 G');
    for (const shift of [0, 1, 5, 8]) {
      const moved = base.map((c) => ({ ...c, root: (c.root + shift) % 12 }));
      expect(estimateKeyFromChords(moved)?.key).toBe(['G', 'Ab', 'C', 'Eb'][[0, 1, 5, 8].indexOf(shift)]);
    }
  });

  it('tolerates a borrowed chord (bVII, iv in major)', () => {
    expect(estimateKeyFromChords(seq('C Bb F C G C F Fm C'))?.key).toBe('C');
    expect(estimateKeyFromChords(seq('D C G D D C G D'))?.key).toBe('D');
  });

  it('uses the duration of each chord', () => {
    // Mostly C-G-Am-F; a short D7 excursion must not move the key.
    expect(estimateKeyFromChords(seq('C G Am F D7 G C', [4, 4, 4, 4, 1, 1, 4]))?.key).toBe('C');
  });

  it('handles jazz seventh chords (ii-V-I)', () => {
    expect(estimateKeyFromChords(seq('Dm7 G7 Cmaj7 Cmaj7'))?.key).toBe('C');
    expect(estimateKeyFromChords(seq('Bm7b5 E7 Am7 Am7'))?.key).toBe('Am');
  });

  it('returns null without usable chords', () => {
    expect(estimateKeyFromChords([])).toBeNull();
    expect(estimateKeyFromChords([{ root: 0, quality: 'major', duration: 0 }])).toBeNull();
  });

  it('reports a runner-up and a margin', () => {
    const est = estimateKeyFromChords(seq('C Am F G C Am F G'))!;
    expect(est.runnerUp).not.toBe('C');
    expect(est.margin).toBeGreaterThan(0);
  });
});
