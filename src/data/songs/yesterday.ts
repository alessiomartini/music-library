import type { Song } from '../../lib/types';

export const yesterday: Song = {
  slug: 'yesterday',
  title: 'Yesterday',
  artist: 'The Beatles (Lennon–McCartney)',
  originalKey: 'F',
  timeSignature: '4/4',
  sections: [
    {
      label: 'Strofa 1',
      lines: [
        '[F]Yesterday, all my [Em7]troubles seemed so [A7]far a[Dm]way',
        "[Dm/C]Now it [Bb6]looks as though they're [F]here to [C7]stay",
        '[F]Oh, I be[Gm7]lieve in [C7]yesterday',
      ],
    },
    {
      label: 'Strofa 2',
      lines: [
        "[F]Suddenly, I'm [Em7]not half the man I [A7]used to [Dm]be",
        "[Dm/C]There's a [Bb6]shadow hanging [F]over [C7]me",
        '[F]Oh, yesterday came [Gm7]sud[C7]denly',
      ],
    },
    {
      label: 'Ponte',
      lines: [
        "[F]Why she had to [Fmaj7]go, I don't [Bm7b5]know, she wouldn't [E7]say",
        '[Am]I said [D7]something [Gm]wrong, now I [C7]long for [F]yesterday',
      ],
    },
    {
      label: 'Strofa 3',
      lines: [
        '[F]Yesterday, love was [Em7]such an easy [A7]game to [Dm]play',
        '[Dm/C]Now I [Bb6]need a place to [F]hide a[C7]way',
        '[F]Oh, I be[Gm7]lieve in [C7]yester[F]day',
      ],
    },
  ],
  melody: [
    {
      label: 'Voce — inizio Strofa 1 (bozza)',
      timeSignature: '4/4',
      measures: [
        { notes: [
          { pitch: 'f/4', duration: 'q', lyric: 'Yes' },
          { pitch: 'e/4', duration: '8', lyric: 'ter' },
          { pitch: 'd/4', duration: '8', lyric: 'day,' },
          { pitch: 'c/4', duration: 'q', lyric: 'all' },
          { pitch: 'c/4', duration: 'q', lyric: 'my' },
        ] },
        { notes: [
          { pitch: 'd/4', duration: 'q', lyric: 'trou' },
          { pitch: 'e/4', duration: 'q', lyric: 'bles' },
          { pitch: 'f/4', duration: 'h', lyric: 'seemed' },
        ] },
      ],
    },
  ],
  notes: 'Melodia: bozza del solo incipit, da verificare/completare per orecchio.',
};
