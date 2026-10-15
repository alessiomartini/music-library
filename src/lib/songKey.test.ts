import { describe, expect, it } from 'vitest';
import { normalizeKey } from './songKey';

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
