import type { Song } from '../../lib/types';

export const blackbird: Song = {
  slug: 'blackbird',
  title: 'Blackbird',
  artist: 'The Beatles',
  composer: 'Lennon–McCartney',
  originalKey: 'G',
  timeSignature: '4/4',
  tempoBpm: 96,
  tempoMarking: 'Gently',
  links: {
    spotify: 'https://open.spotify.com/search/Blackbird%20The%20Beatles',
    youtube: 'https://www.youtube.com/watch?v=TxYCG0eZQuc',
  },
  notes:
    'Fingerstyle guitar part reduced here to its harmony (chords) and vocal melody. ' +
    'The engraved lead sheet is a draft transcription of the opening phrase only ' +
    '(verify by ear before relying on it); tempo is an approximate indication.',
  sections: [
    {
      label: 'Verse 1',
      lines: [
        '[G]Blackbird singing in the [Am7]dead of [G/B]night',
        '[C]Take these broken [G/B]wings and [A7sus4]learn to [G/B]fly [G]',
        '[G]All your life, you [Am7]were only [G/B]waiting',
        '[C]For this [G/B]moment to a[A7sus4]rise [G/B] [G]',
      ],
    },
    {
      label: 'Verse 2',
      lines: [
        '[G]Blackbird singing in the [Am7]dead of [G/B]night',
        '[C]Take these sunken [G/B]eyes and [A7sus4]learn to [G/B]see [G]',
        '[G]All your life, you [Am7]were only [G/B]waiting',
        '[C]For this [G/B]moment to be [A7sus4]free [G/B] [G]',
      ],
    },
    {
      label: 'Bridge (instrumental)',
      lines: ['[Am]  [G/B]  [C]  [D]  [G] [Bm] [C] [D]'],
    },
  ],
  leadSheet: [
    {
      label: 'Verse 1 (opening)',
      measures: [
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'Black', chord: 'G' },
            { pitch: 'b/4', duration: '8', lyric: 'bird' },
            { pitch: 'a/4', duration: '8', lyric: 'sing' },
            { pitch: 'g/4', duration: '8', lyric: 'ing' },
            { pitch: 'a/4', duration: 'q', lyric: 'in' },
            { pitch: 'b/4', duration: 'q', lyric: 'the' },
          ],
          bass: [{ pitch: 'g/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'dead', chord: 'Am7' },
            { pitch: 'g/4', duration: 'hd', lyric: 'of night', chord: 'G/B' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'b/3', duration: 'h' },
          ],
        },
      ],
    },
  ],
};
