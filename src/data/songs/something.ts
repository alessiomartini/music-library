import type { Song } from '../../lib/types';

export const something: Song = {
  slug: 'something',
  title: 'Something',
  artist: 'The Beatles (George Harrison)',
  originalKey: 'C',
  timeSignature: '4/4',
  sections: [
    {
      label: 'Strofa 1',
      lines: [
        '[C]Something in the [Cmaj7]way she [C7]moves [F]',
        '[D7]Attracts me [D7/F#]like no [G]other [Gaug]lover',
        '[C]Something in the [Cmaj7]way she [C7]woos [F]me',
        "[D7]I don't want to [D7/F#]leave her [G]now [Gaug]",
        '[C]You know I be[Cmaj7]lieve and [C7]how [F] [F6]',
      ],
    },
    {
      label: 'Ritornello',
      lines: [
        "[A]Somewhere in her [D]smile she knows [Bm]that I don't [E7]need no other lover",
        '[A]Something in her [D]style that shows me [Am7] [D7]',
      ],
    },
    {
      label: 'Strofa 2',
      lines: [
        "[C]You're asking [Cmaj7]me will my [C7]love [F]grow",
        "[D7]I don't [D7/F#]know, I don't [G]know [Gaug]",
        '[C]You stick a[Cmaj7]round now it [C7]may show [F]',
        '[D7]I don’t [D7/F#]know, I don’t [G]know [Gaug]',
      ],
    },
  ],
  melody: [
    {
      label: 'Voce — inizio Strofa 1 (bozza)',
      timeSignature: '4/4',
      measures: [
        { notes: [
          { pitch: 'e/4', duration: 'q', lyric: 'Some' },
          { pitch: 'd/4', duration: '8', lyric: 'thing' },
          { pitch: 'e/4', duration: '8', lyric: 'in' },
          { pitch: 'g/4', duration: 'q', lyric: 'the' },
          { pitch: 'e/4', duration: 'q', lyric: 'way' },
        ] },
        { notes: [
          { pitch: 'd/4', duration: 'q', lyric: 'she' },
          { pitch: 'c/4', duration: 'h', lyric: 'moves' },
        ] },
      ],
    },
  ],
  notes: 'Melodia: bozza del solo incipit, da verificare/completare per orecchio.',
};
