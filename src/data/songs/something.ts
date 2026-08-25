import type { Song } from '../../lib/types';

export const something: Song = {
  slug: 'something',
  title: 'Something',
  artist: 'The Beatles',
  composer: 'George Harrison',
  originalKey: 'C',
  timeSignature: '4/4',
  tempoBpm: 66,
  tempoMarking: 'Slowly',
  links: {
    spotify: 'https://open.spotify.com/search/Something%20The%20Beatles',
    youtube: 'https://www.youtube.com/watch?v=UelDrZ1aFeY',
  },
  notes:
    'The engraved lead sheet is a draft transcription of the opening phrase only ' +
    '(verify by ear before relying on it); tempo is an approximate indication.',
  sections: [
    {
      label: 'Verse 1',
      lines: [
        '[C]Something in the [Cmaj7]way she [C7]moves [F]',
        '[D7]Attracts me [D7/F#]like no [G]other [Gaug]lover',
        '[C]Something in the [Cmaj7]way she [C7]woos [F]me',
        "[D7]I don't want to [D7/F#]leave her [G]now [Gaug]",
        '[C]You know I be[Cmaj7]lieve and [C7]how [F] [F6]',
      ],
    },
    {
      label: 'Bridge',
      lines: [
        "[A]Somewhere in her [D]smile she knows [Bm]that I don't [E7]need no other lover",
        '[A]Something in her [D]style that shows me [Am7] [D7]',
      ],
    },
    {
      label: 'Verse 2',
      lines: [
        "[C]You're asking [Cmaj7]me will my [C7]love [F]grow",
        "[D7]I don't [D7/F#]know, I don't [G]know [Gaug]",
        '[C]You stick a[Cmaj7]round now it [C7]may show [F]',
        '[D7]I don’t [D7/F#]know, I don’t [G]know [Gaug]',
      ],
    },
  ],
  leadSheet: [
    {
      label: 'Verse 1 (opening)',
      measures: [
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'Some', chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: 'thing' },
            { pitch: 'e/4', duration: '8', lyric: 'in' },
            { pitch: 'g/4', duration: 'q', lyric: 'the' },
            { pitch: 'e/4', duration: 'q', lyric: 'way', chord: 'Cmaj7' },
          ],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'she' },
            { pitch: 'c/4', duration: 'hd', lyric: 'moves', chord: 'C7' },
          ],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
      ],
    },
  ],
};
