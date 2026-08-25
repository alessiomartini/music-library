import type { Song } from '../../lib/types';

export const amaraTerraMia: Song = {
  slug: 'amara-terra-mia',
  title: 'Amara terra mia',
  artist: 'Domenico Modugno',
  composer: 'Domenico Modugno',
  originalKey: 'Am',
  timeSignature: '4/4',
  tempoBpm: 100,
  tempoMarking: 'Moderato',
  links: {
    spotify: 'https://open.spotify.com/track/4w1aaqoCHbY8FY58GG5uWI',
    youtube: 'https://www.youtube.com/watch?v=oRa39T_O4yU',
  },
  notes:
    'Transcribed from memory: lyrics and chords are a draft to be checked against the ' +
    'original score. The engraved lead sheet covers only the opening phrase; tempo is ' +
    'an approximate indication. Lyrics are kept in the original Italian.',
  sections: [
    {
      label: 'Verse 1',
      lines: [
        '[Am]Amara terra [Dm]mia, amara e [E7]bella',
        '[Am]cosa ti [Dm]resta o [E7]terra delle [Am]tue promesse',
        '[C]lasciato hai il [G]mare e [Am]vai chissà [Dm]dove',
        '[E7]cercando il [Am]pane, il [Dm]pane della [E7]sopravvi[Am]venza',
      ],
    },
    {
      label: 'Verse 2',
      lines: [
        '[Am]Amara terra [Dm]mia, amara e [E7]sola',
        '[Am]e cosa [Dm]tieni in [E7]serbo, o mia [Am]terra amara',
        '[C]per chi ti [G]lascia e [Am]cerca la for[Dm]tuna',
        '[E7]lontano dal tuo [Am]sole e dal tuo [Dm]mare, [E7]terra a[Am]mara',
      ],
    },
  ],
  leadSheet: [
    {
      label: 'Verse 1 (opening)',
      measures: [
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'A-', chord: 'Am' },
            { pitch: 'a/4', duration: '8', lyric: 'ma-' },
            { pitch: 'g/4', duration: '8', lyric: 'ra' },
            { pitch: 'f/4', duration: 'q', lyric: 'ter-' },
            { pitch: 'e/4', duration: 'q', lyric: 'ra' },
          ],
          bass: [{ pitch: 'a/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'mi-', chord: 'Dm' },
            { pitch: 'e/4', duration: 'hd', lyric: 'a' },
          ],
          bass: [{ pitch: 'd/3', duration: 'w' }],
        },
      ],
    },
  ],
};
