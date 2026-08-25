import type { Song } from '../../lib/types';

export const amaraTerraMia: Song = {
  slug: 'amara-terra-mia',
  title: 'Amara terra mia',
  artist: 'Domenico Modugno',
  originalKey: 'Am',
  timeSignature: '4/4',
  notes:
    'Brano trascritto a memoria: testo e accordi sono una bozza da verificare/correggere ' +
    'con lo spartito originale prima di considerarli definitivi.',
  sections: [
    {
      label: 'Strofa 1',
      lines: [
        '[Am]Amara terra [Dm]mia, amara e [E7]bella',
        '[Am]cosa ti [Dm]resta o [E7]terra delle [Am]tue promesse',
        '[C]lasciato hai il [G]mare e [Am]vai chissà [Dm]dove',
        '[E7]cercando il [Am]pane, il [Dm]pane della [E7]sopravvi[Am]venza',
      ],
    },
    {
      label: 'Strofa 2',
      lines: [
        '[Am]Amara terra [Dm]mia, amara e [E7]sola',
        '[Am]e cosa [Dm]tieni in [E7]serbo, o mia [Am]terra amara',
        '[C]per chi ti [G]lascia e [Am]cerca la for[Dm]tuna',
        '[E7]lontano dal tuo [Am]sole e dal tuo [Dm]mare, [E7]terra a[Am]mara',
      ],
    },
  ],
  melody: [
    {
      label: 'Voce — inizio Strofa 1 (bozza)',
      timeSignature: '4/4',
      measures: [
        { notes: [
          { pitch: 'a/4', duration: 'q', lyric: 'A-' },
          { pitch: 'a/4', duration: '8', lyric: 'ma-' },
          { pitch: 'g/4', duration: '8', lyric: 'ra' },
          { pitch: 'f/4', duration: 'q', lyric: 'ter-' },
          { pitch: 'e/4', duration: 'q', lyric: 'ra' },
        ] },
        { notes: [
          { pitch: 'a/4', duration: 'q', lyric: 'mi-' },
          { pitch: 'e/4', duration: 'h', lyric: 'a' },
        ] },
      ],
    },
  ],
};
