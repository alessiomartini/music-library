import type { Song } from '../../lib/types';

export const yesterday: Song = {
  slug: 'yesterday',
  title: 'Yesterday',
  artist: 'The Beatles',
  composer: 'Lennon–McCartney',
  originalKey: 'F',
  timeSignature: '4/4',
  tempoBpm: 96,
  tempoMarking: 'Slowly',
  links: {
    spotify: 'https://open.spotify.com/search/Yesterday%20The%20Beatles',
    youtube: 'https://www.youtube.com/watch?v=U6bftfiTums',
  },
  notes:
    'The engraved lead sheet is a draft transcription of the opening phrase only ' +
    '(verify by ear before relying on it); tempo is an approximate indication.',
  sections: [
    {
      label: 'Verse 1',
      lines: [
        '[F]Yesterday, all my [Em7]troubles seemed so [A7]far a[Dm]way',
        "[Dm/C]Now it [Bb6]looks as though they're [F]here to [C7]stay",
        '[F]Oh, I be[Gm7]lieve in [C7]yesterday',
      ],
    },
    {
      label: 'Verse 2',
      lines: [
        "[F]Suddenly, I'm [Em7]not half the man I [A7]used to [Dm]be",
        "[Dm/C]There's a [Bb6]shadow hanging [F]over [C7]me",
        '[F]Oh, yesterday came [Gm7]sud[C7]denly',
      ],
    },
    {
      label: 'Bridge',
      lines: [
        "[F]Why she had to [Fmaj7]go, I don't [Bm7b5]know, she wouldn't [E7]say",
        '[Am]I said [D7]something [Gm]wrong, now I [C7]long for [F]yesterday',
      ],
    },
    {
      label: 'Verse 3',
      lines: [
        '[F]Yesterday, love was [Em7]such an easy [A7]game to [Dm]play',
        '[Dm/C]Now I [Bb6]need a place to [F]hide a[C7]way',
        '[F]Oh, I be[Gm7]lieve in [C7]yester[F]day',
      ],
    },
  ],
  leadSheet: [
    {
      label: 'Verse 1 (opening)',
      measures: [
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'Yes', chord: 'F' },
            { pitch: 'e/4', duration: '8', lyric: 'ter' },
            { pitch: 'd/4', duration: '8', lyric: 'day,' },
            { pitch: 'c/4', duration: 'q', lyric: 'all' },
            { pitch: 'c/4', duration: 'q', lyric: 'my' },
          ],
          bass: [{ pitch: 'f/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'trou', chord: 'Em7' },
            { pitch: 'e/4', duration: 'q', lyric: 'bles' },
            { pitch: 'f/4', duration: 'h', lyric: 'seemed' },
          ],
          bass: [{ pitch: 'e/3', duration: 'w' }],
        },
      ],
    },
  ],
};
