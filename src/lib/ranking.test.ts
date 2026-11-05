import { describe, expect, it } from 'vitest';
import { percentiles, score } from './ranking';

describe('ranking', () => {
  it('percentiles with ties', () => {
    const p = percentiles(new Map([['a', 1], ['b', 5], ['c', 5], ['d', 9]]));
    expect(p.get('a')).toBe(0);
    expect(p.get('d')).toBe(100);
    expect(p.get('b')).toBeCloseTo(50);
    expect(p.get('c')).toBeCloseTo(50);
  });
  it('mix is 0.7 mine + 0.3 global, falling back to mine', () => {
    expect(score('mix', 100, 0)).toBeCloseTo(70);
    expect(score('mix', 40, undefined)).toBe(40);
    expect(score('mine', 40, 90)).toBe(40);
    expect(score('global', 40, 90)).toBe(90);
  });
});
