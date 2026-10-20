import { describe, expect, it } from 'vitest';
import { artistRange, keyShift, measuredShift, noteName, parseNote, rangeShift } from './vocalRange';

describe('parseNote', () => {
  it('reads English and Italian names', () => {
    expect(parseNote('C4')).toBe(60);
    expect(parseNote('E2')).toBe(40);
    expect(parseNote('Mi2')).toBe(40);
    expect(parseNote('Bb4')).toBe(70);
    expect(parseNote('Sib4')).toBe(70);
    expect(parseNote('Fa#3')).toBe(54);
    expect(parseNote('H2')).toBeNull();
  });
  it('round-trips through noteName', () => {
    expect(noteName(70)).toBe('Bb4');
    expect(noteName(40, true)).toBe('Mi2');
  });
});

describe('artistRange', () => {
  it('uses the voice type only', () => {
    expect(artistRange({ name: 'x', wikidata: 'Q', voiceType: 'baritone', photos: [] })).toMatchObject({ low: 45, high: 65 });
    expect(artistRange({ name: 'x', wikidata: 'Q', voiceType: 'lyric tenor', photos: [] })).toMatchObject({ low: 48, high: 69 });
    expect(artistRange({ name: 'x', wikidata: 'Q', voiceType: 'bass-baritone', photos: [] })).toMatchObject({ low: 41, high: 64 });
    expect(artistRange({ name: 'x', wikidata: 'Q', voiceType: 'falsetto', photos: [] })).toBeNull();
    expect(artistRange({ name: 'x', wikidata: 'Q', sex: 'female', photos: [] })).toBeNull();
    expect(artistRange({ name: 'x', wikidata: 'Q', photos: [] })).toBeNull();
  });
});

describe('rangeShift', () => {
  it('centres the artist range in the user range', () => {
    // Baritone A2–F4 (45–65) into E2–Bb4 (40–70): already centred.
    expect(rangeShift({ low: 45, high: 65 }, { low: 40, high: 70 })).toBe(0);
    // Female F3–D5 (53–74) into E2–Bb4: eight semitones down.
    expect(rangeShift({ low: 53, high: 74 }, { low: 40, high: 70 })).toBe(-8);
  });
  it('keyShift folds to −6…+5', () => {
    expect(keyShift(-8)).toBe(4);
    expect(keyShift(7)).toBe(-5);
    expect(keyShift(-12)).toBe(0);
  });
});

describe('measuredShift', () => {
  const user = { low: 48, high: 60 };
  it('keeps the song as recorded when it already fits', () => {
    expect(measuredShift({ '50': 0.5, '58': 0.5 }, user)).toEqual({ shift: 0, share: 1, currentShare: 1 });
  });
  it('moves the sung time into the comfortable range, by the smallest shift', () => {
    const r = measuredShift({ '53': 0.5, '62': 0.5 }, user)!;
    expect(r.shift).toBe(-2);
    expect(r.share).toBe(1);
    expect(r.currentShare).toBe(0.5);
  });
  it('prefers the share of time over the extremes', () => {
    // one rare high note must not drag the whole song down
    const r = measuredShift({ '50': 0.9, '72': 0.1 }, user)!;
    expect(r.shift).toBe(0);
    expect(r.share).toBeCloseTo(0.9);
  });
  it('returns null without data', () => {
    expect(measuredShift({}, user)).toBeNull();
  });
});
