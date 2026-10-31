import { describe, expect, it } from 'vitest';
import {
  convertChord,
  formatChord,
  keyIndex,
  keyName,
  parseChord,
  semitoneDiff,
  transposeChord,
  shouldPreferFlats,
  targetPrefersFlats,
  transposeKeyLabel,
  transposedKeyLabel,
} from './theory';

describe('parseChord', () => {
  it('parses English and Italian roots with qualities', () => {
    expect(parseChord('Cmaj7')).toMatchObject({ root: 'C', quality: 'maj7', bass: null });
    expect(parseChord('Dm')).toMatchObject({ root: 'D', quality: 'm', bass: null });
    expect(parseChord('Do')).toMatchObject({ root: 'C', quality: '', bass: null });
    expect(parseChord('Rem7')).toMatchObject({ root: 'D', quality: 'm7', bass: null });
  });

  it('normalizes supported sharp and flat spellings', () => {
    expect(parseChord('F#')?.root).toBe('F#');
    expect(parseChord('Bb')?.root).toBe('A#');
    expect(parseChord('Do#')?.root).toBe('C#');
    expect(parseChord('Solb')?.root).toBe('F#');
    expect(parseChord('C##')?.root).toBe('C##');
  });

  it('parses slash chords and preserves their bass note', () => {
    expect(parseChord('Dm/C')).toMatchObject({ root: 'D', quality: 'm', bass: 'C' });
    expect(parseChord('Bb/F')).toMatchObject({ root: 'A#', quality: '', bass: 'F' });
    expect(parseChord('Rem/Fa')).toMatchObject({ root: 'D', quality: 'm', bass: 'F' });
  });

  it('returns null for text that is not a chord root', () => {
    expect(parseChord('lyrics')).toBeNull();
  });
});

describe('chord formatting and transposition', () => {
  it('converts representative chords between English and Italian notation', () => {
    expect(convertChord('C', 0, 'it', false)).toBe('Do');
    expect(convertChord('Dm', 0, 'it', false)).toBe('Rem');
    expect(convertChord('Bb/F', 0, 'it', true)).toBe('Sib/Fa');
    expect(formatChord(parseChord('Rem')!, 'en')).toBe('Dm');
  });

  it('transposes roots and slash basses together', () => {
    const chord = parseChord('Dm/C')!;
    const transposed = transposeChord(chord, 2, false);

    expect(transposed).toMatchObject({ root: 'E', quality: 'm', bass: 'D' });
    expect(chord).toMatchObject({ root: 'D', quality: 'm', bass: 'C' });
  });

  it('supports positive and negative shifts with requested spelling', () => {
    expect(convertChord('C', 4, 'en', false)).toBe('E');
    expect(convertChord('C', -3, 'en', false)).toBe('A');
    expect(convertChord('Bb/F', -2, 'en', true)).toBe('Ab/Eb');
    expect(convertChord('Bb/F', 0, 'en', true)).toBe('Bb/F');
  });
});

describe('key helpers', () => {
  it('transposes key labels in both notation systems', () => {
    expect(transposeKeyLabel('Bb', 2, 'en', true)).toBe('C');
    expect(transposeKeyLabel('Am', -3, 'en', false)).toBe('F#m');
    expect(transposeKeyLabel('Do', 7, 'it', false)).toBe('Sol');
  });

  it('computes key indexes and shortest semitone distances', () => {
    expect(keyIndex('Bb')).toBe(10);
    expect(keyIndex('Sol')).toBe(7);
    expect(semitoneDiff('C', 'F')).toBe(5);
    expect(semitoneDiff('C', 'G')).toBe(-5);
    expect(semitoneDiff('C', 'F#')).toBe(6);
    expect(semitoneDiff('F#', 'C')).toBe(6);
  });

  it('uses requested sharp or flat spellings for generated key names', () => {
    expect(keyName(1, 'en', false)).toBe('C#');
    expect(keyName(1, 'en', true)).toBe('Db');
    expect(keyName(1, 'it', true)).toBe('Reb');
  });
});

describe('key spelling by target key', () => {
  it('spells the 12 major targets with their conventional names', () => {
    const expected = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    expected.forEach((name, i) => expect(transposedKeyLabel('C', i, 'en')).toBe(name));
  });
  it('spells the 12 minor targets by their relative major', () => {
    const expected = ['Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];
    expected.forEach((name, i) => expect(transposedKeyLabel('Cm', i, 'en')).toBe(name));
  });
  it('does not depend on the original key spelling', () => {
    expect(transposedKeyLabel('F#', 4, 'en')).toBe('Bb');
    expect(transposedKeyLabel('E', -3, 'en')).toBe('Db');
    expect(transposedKeyLabel('Bb', 2, 'en')).toBe('C');
    expect(transposedKeyLabel('Fa', -5, 'it')).toBe('Do');
    expect(transposedKeyLabel('Sol', 3, 'it')).toBe('Sib');
    expect(transposedKeyLabel('Mim', 3, 'it')).toBe('Solm');
    expect(transposedKeyLabel('Fa', 9, 'it')).toBe('Re');
  });
  it('the suggested key for a song in G moved -4 is Eb, not D#', () => {
    expect(transposedKeyLabel('G', -4, 'en')).toBe('Eb');
    expect(transposedKeyLabel('D', -4, 'it')).toBe('Sib');
  });
  it('flags flat targets for chord spelling', () => {
    expect(targetPrefersFlats('C', 3)).toBe(true);
    expect(targetPrefersFlats('Cm', 3)).toBe(true);
    expect(targetPrefersFlats('C', 2)).toBe(false);
    expect(shouldPreferFlats('Bbm')).toBe(true);
    expect(shouldPreferFlats('G#m')).toBe(false);
    expect(shouldPreferFlats('Cmaj7')).toBe(false);
  });
});
