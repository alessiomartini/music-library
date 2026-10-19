import { describe, expect, it } from 'vitest';
import { inferInstruments } from './instruments';

describe('inferInstruments', () => {
  it('reads the channel name and the note', () => {
    expect(inferInstruments('chitarradisagio')).toEqual(['guitar']);
    expect(inferInstruments('Someone', 'Morricone on 12-string')).toEqual(['guitar']);
    expect(inferInstruments('Someone', 'piano and guitar')).toEqual(['guitar', 'piano']);
  });
  it('never guesses', () => {
    expect(inferInstruments('Allie Sherlock', 'Queen chords')).toEqual([]);
    expect(inferInstruments('Paolo Pilo')).toEqual([]);
  });
});
