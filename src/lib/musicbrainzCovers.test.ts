import { describe, expect, it } from 'vitest';
import { artistNames, baseTitle, pickCovers, pickWork, sameArtist, type MbRecording, type MbWork } from './musicbrainzCovers';

const work = (o: Partial<MbWork>): MbWork => ({ id: 'w', title: 'Hallelujah', score: 100, writers: [], recordingIds: [], ...o });
const rec = (o: Partial<MbRecording> & { artist: string }): MbRecording => ({ id: o.artist, title: 'Hallelujah', artists: [o.artist], ...o });

describe('pickWork', () => {
  it('accepts a work whose writer is the original artist', () => {
    const w = work({ id: 'a', writers: ['Leonard Cohen'] });
    expect(pickWork('Hallelujah', 'Leonard Cohen', [w, work({ id: 'b', writers: ['Someone Else'] })], new Set())?.id).toBe('a');
  });
  it('accepts a work that includes a recording by the original artist', () => {
    const w = work({ id: 'a', recordingIds: ['r1'] });
    expect(pickWork('Hallelujah', 'Jeff Buckley', [w], new Set(['r1']))?.id).toBe('a');
  });
  it('rejects ambiguity, low scores and other titles', () => {
    const a = work({ id: 'a', writers: ['Leonard Cohen'] });
    const b = work({ id: 'b', writers: ['Leonard Cohen'] });
    expect(pickWork('Hallelujah', 'Leonard Cohen', [a, b], new Set())).toBeUndefined();
    expect(pickWork('Hallelujah', 'Leonard Cohen', [{ ...a, score: 80 }], new Set())).toBeUndefined();
    expect(pickWork('Hallelujah Chorus', 'Leonard Cohen', [a], new Set())).toBeUndefined();
    expect(pickWork('Hallelujah', 'Leonard Cohen', [work({ writers: ['Other'] })], new Set())).toBeUndefined();
  });
});

describe('pickCovers', () => {
  it('keeps other artists, one per artist (earliest), and drops the original, karaoke and other titles', () => {
    const covers = pickCovers('Hallelujah', 'Leonard Cohen', [
      rec({ artist: 'Leonard Cohen', year: 1984 }),
      rec({ artist: 'Jeff Buckley', year: 1994, id: 'j1' }),
      rec({ artist: 'Jeff Buckley', year: 1993, id: 'j0', title: 'Hallelujah (live)' }),
      rec({ artist: 'Rufus Wainwright', year: 2001 }),
      rec({ artist: 'Karaoke Kings', year: 2005 }),
      rec({ artist: 'Hits Band', year: 2005, title: 'Hallelujah (Karaoke Version)' }),
      rec({ artist: 'Medley Band', year: 2005, title: 'Hallelujah / Something' }),
      rec({ artist: 'Various Artists', year: 2005 }),
    ]);
    expect(covers.map((c) => [c.artist, c.year, c.id])).toEqual([['Jeff Buckley', 1993, 'j0'], ['Rufus Wainwright', 2001, 'Rufus Wainwright']]);
  });
  it('treats a collaboration with the original artist as not a cover', () => {
    expect(pickCovers('Hallelujah', 'Leonard Cohen', [rec({ artist: 'Leonard Cohen & Band', artists: ['Leonard Cohen', 'Band'] })])).toEqual([]);
  });
});

describe('helpers', () => {
  it('normalizes', () => {
    expect(artistNames('Phil Harris, Scatman Crothers')).toEqual(['Phil Harris', 'Scatman Crothers']);
    expect(sameArtist('The Beatles', 'Beatles')).toBe(true);
    expect(sameArtist('Pino Daniele', 'pino  daniele')).toBe(true);
    expect(baseTitle('Hallelujah (Live) ')).toBe('hallelujah');
    expect(baseTitle('Yesterday - Remastered 2009')).toBe('yesterday');
  });
});
