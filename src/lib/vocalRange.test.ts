import { describe, expect, it } from 'vitest';
import { artistRange, keyShift, noteName, parseNote, rangeShift } from './vocalRange';

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
