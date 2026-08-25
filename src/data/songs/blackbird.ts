import type { Song } from '../../lib/types';

export const blackbird: Song = {
  slug: 'blackbird',
  title: 'Blackbird',
  artist: 'The Beatles (Lennon–McCartney)',
  originalKey: 'G',
  timeSignature: '4/4',
  sections: [
    {
      label: 'Strofa 1',
      lines: [
        '[G]Blackbird singing in the [Am7]dead of [G/B]night',
        '[C]Take these broken [G/B]wings and [A7sus4]learn to [G/B]fly [G]',
        '[G]All your life, you [Am7]were only [G/B]waiting',
        '[C]For this [G/B]moment to a[A7sus4]rise [G/B] [G]',
      ],
    },
    {
      label: 'Strofa 2',
      lines: [
        '[G]Blackbird singing in the [Am7]dead of [G/B]night',
        '[C]Take these sunken [G/B]eyes and [A7sus4]learn to [G/B]see [G]',
        '[G]All your life, you [Am7]were only [G/B]waiting',
        '[C]For this [G/B]moment to be [A7sus4]free [G/B] [G]',
      ],
    },
    {
      label: 'Ponte (strumentale)',
      lines: ['[Am]  [G/B]  [C]  [D]  [G] [Bm] [C] [D]'],
    },
  ],
  melody: [
    {
      label: 'Voce — inizio Strofa 1 (bozza)',
      timeSignature: '4/4',
      measures: [
        { notes: [
          { pitch: 'd/4', duration: '8', lyric: 'Black' },
          { pitch: 'b/4', duration: '8', lyric: 'bird' },
          { pitch: 'a/4', duration: '8', lyric: 'sing' },
          { pitch: 'g/4', duration: '8', lyric: 'ing' },
          { pitch: 'a/4', duration: 'q', lyric: 'in' },
          { pitch: 'b/4', duration: 'q', lyric: 'the' },
        ] },
        { notes: [
          { pitch: 'a/4', duration: 'q', lyric: 'dead' },
          { pitch: 'g/4', duration: 'h', lyric: 'of night' },
        ] },
      ],
    },
  ],
  notes: 'Melodia: bozza del solo incipit, da verificare/completare per orecchio. Fingerstyle, ma qui riportati solo gli accordi armonici.',
};
