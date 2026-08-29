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
  history:
    'Written by Domenico Modugno — the Sicilian-born singer-songwriter best known internationally for ' +
    '"Nel blu dipinto di blu" ("Volare") — the song mourns the mass emigration from southern Italy in the ' +
    "postwar decades, a subject close to Modugno's own roots. Its folk-rooted, plaintive tone contrasts with " +
    'the upbeat pop for which he is more widely remembered.',
  notes:
    'Transcribed from memory: lyrics, chords and melody are a best-effort draft to be checked against the ' +
    'original score, especially away from the opening phrase; tempo is an approximate indication. Lyrics are ' +
    'kept in the original Italian.',
  leadSheet: [
    {
      label: 'Verse 1',
      measures: [
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'A-', chord: 'Am' },
            { pitch: 'a/4', duration: '8', lyric: 'ma-' },
            { pitch: 'g/4', duration: '8', lyric: 'ra' },
            { pitch: 'f/4', duration: 'q', lyric: 'ter-' },
            { pitch: 'e/4', duration: 'q', lyric: 'ra' },
          ],
          bass: [{ pitch: 'a/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'mi-', chord: 'Dm' },
            { pitch: 'e/4', duration: 'hd', lyric: 'a' },
          ],
          bass: [{ pitch: 'd/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: '8', lyric: 'a' },
            { pitch: 'g/4', duration: '8', lyric: 'ma' },
            { pitch: 'f/4', duration: 'q', lyric: 'ra' },
            { pitch: 'e/4', duration: 'q', lyric: 'e', chord: 'E7' },
            { pitch: 'e/4', duration: 'q', lyric: 'bel' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'e/4', duration: 'h' },
          ],
        },
        {
          melody: [{ pitch: 'a/4', duration: 'w', lyric: 'la' }],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: '8', lyric: 'co', chord: 'Am' },
            { pitch: 'g/4', duration: '8', lyric: 'sa' },
            { pitch: 'f/4', duration: 'q', lyric: 'ti' },
            { pitch: 'e/4', duration: 'q', lyric: 'res', chord: 'Dm' },
            { pitch: 'f/4', duration: 'q', lyric: 'ta' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: '8', lyric: 'o' },
            { pitch: 'a/4', duration: '8', lyric: 'ter', chord: 'E7' },
            { pitch: 'g/4', duration: 'q', lyric: 'ra' },
            { pitch: 'f/4', duration: 'q', lyric: 'del' },
            { pitch: 'e/4', duration: 'q', lyric: 'le' },
          ],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'tue', chord: 'Am' },
            { pitch: 'g/4', duration: '8', lyric: 'pro' },
            { pitch: 'f/4', duration: '8', lyric: 'mes' },
            { pitch: 'e/4', duration: 'h', lyric: 'se' },
          ],
          bass: [{ pitch: 'a/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'c/5', duration: '8', lyric: 'la', chord: 'C' },
            { pitch: 'b/4', duration: '8', lyric: 'scia' },
            { pitch: 'a/4', duration: '8', lyric: 'to' },
            { pitch: 'g/4', duration: '8', lyric: 'hai' },
            { pitch: 'f/4', duration: 'q', lyric: 'il' },
            { pitch: 'g/4', duration: 'q', lyric: 'ma', chord: 'G' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 're' },
            { pitch: 'e/4', duration: '8', lyric: 'e' },
            { pitch: 'a/4', duration: 'q', lyric: 'vai', chord: 'Am' },
            { pitch: 'g/4', duration: 'q', lyric: 'chis' },
            { pitch: 'f/4', duration: 'q', lyric: 'sà' },
          ],
          bass: [
            { pitch: 'g/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'do', chord: 'Dm' },
            { pitch: 'd/4', duration: 'hd', lyric: 've' },
          ],
          bass: [{ pitch: 'd/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'cer', chord: 'E7' },
            { pitch: 'f/4', duration: '8', lyric: 'can' },
            { pitch: 'g/4', duration: '8', lyric: 'do' },
            { pitch: 'f/4', duration: '8', lyric: 'il' },
            { pitch: 'a/4', duration: 'q', lyric: 'pa', chord: 'Am' },
            { pitch: 'g/4', duration: 'q', lyric: 'ne,' },
          ],
          bass: [
            { pitch: 'e/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'il' },
            { pitch: 'e/4', duration: '8', lyric: 'pa', chord: 'Dm' },
            { pitch: 'f/4', duration: 'q', lyric: 'ne' },
            { pitch: 'e/4', duration: 'q', lyric: 'del' },
            { pitch: 'd/4', duration: 'q', lyric: 'la' },
          ],
          bass: [{ pitch: 'd/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'so', chord: 'E7' },
            { pitch: 'f/4', duration: '8', lyric: 'prav' },
            { pitch: 'g/4', duration: 'q', lyric: 'vi' },
            { pitch: 'a/4', duration: 'q', lyric: 'ven', chord: 'Am' },
            { pitch: 'a/4', duration: 'q', lyric: 'za' },
          ],
          bass: [
            { pitch: 'e/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'A-', chord: 'Am' },
            { pitch: 'a/4', duration: '8', lyric: 'ma-' },
            { pitch: 'g/4', duration: '8', lyric: 'ra' },
            { pitch: 'f/4', duration: 'q', lyric: 'ter-' },
            { pitch: 'e/4', duration: 'q', lyric: 'ra' },
          ],
          bass: [{ pitch: 'a/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'mi-', chord: 'Dm' },
            { pitch: 'e/4', duration: 'hd', lyric: 'a,' },
          ],
          bass: [{ pitch: 'd/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: '8', lyric: 'a' },
            { pitch: 'g/4', duration: '8', lyric: 'ma' },
            { pitch: 'f/4', duration: 'q', lyric: 'ra' },
            { pitch: 'e/4', duration: 'q', lyric: 'e', chord: 'E7' },
            { pitch: 'e/4', duration: 'q', lyric: 'so' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'e/4', duration: 'h' },
          ],
        },
        {
          melody: [{ pitch: 'a/4', duration: 'w', lyric: 'la' }],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'e', chord: 'Am' },
            { pitch: 'g/4', duration: '8', lyric: 'co' },
            { pitch: 'f/4', duration: '8', lyric: 'sa' },
            { pitch: 'e/4', duration: 'q', lyric: 'tie', chord: 'Dm' },
            { pitch: 'f/4', duration: 'q', lyric: 'ni' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: '8', lyric: 'in' },
            { pitch: 'a/4', duration: '8', lyric: 'ser', chord: 'E7' },
            { pitch: 'g/4', duration: 'q', lyric: 'bo,' },
            { pitch: 'f/4', duration: 'q', lyric: 'o' },
            { pitch: 'e/4', duration: 'q', lyric: 'mia' },
          ],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'ter', chord: 'Am' },
            { pitch: 'g/4', duration: '8', lyric: 'ra' },
            { pitch: 'f/4', duration: '8', lyric: 'a' },
            { pitch: 'e/4', duration: 'h', lyric: 'ma' },
          ],
          bass: [{ pitch: 'a/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'c/5', duration: '8', lyric: 'per', chord: 'C' },
            { pitch: 'b/4', duration: '8', lyric: 'chi' },
            { pitch: 'a/4', duration: '8', lyric: 'ti' },
            { pitch: 'g/4', duration: '8', lyric: 'las' },
            { pitch: 'f/4', duration: 'q', lyric: 'cia', chord: 'G' },
            { pitch: 'g/4', duration: 'q', lyric: 'e' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'a/4', duration: '8', lyric: 'cer', chord: 'Am' },
            { pitch: 'g/4', duration: '8', lyric: 'ca' },
            { pitch: 'f/4', duration: 'q', lyric: 'la' },
            { pitch: 'e/4', duration: 'q', lyric: 'for', chord: 'Dm' },
            { pitch: 'd/4', duration: 'q', lyric: 'tu' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [{ pitch: 'd/4', duration: 'w', lyric: 'na' }],
          bass: [{ pitch: 'd/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'lon', chord: 'E7' },
            { pitch: 'f/4', duration: '8', lyric: 'ta' },
            { pitch: 'g/4', duration: '8', lyric: 'no' },
            { pitch: 'f/4', duration: '8', lyric: 'dal' },
            { pitch: 'a/4', duration: 'q', lyric: 'tuo', chord: 'Am' },
            { pitch: 'g/4', duration: 'q', lyric: 'so' },
          ],
          bass: [
            { pitch: 'e/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'le' },
            { pitch: 'e/4', duration: '8', lyric: 'e' },
            { pitch: 'f/4', duration: 'q', lyric: 'dal' },
            { pitch: 'e/4', duration: 'q', lyric: 'tuo', chord: 'Dm' },
            { pitch: 'd/4', duration: 'q', lyric: 'ma' },
          ],
          bass: [{ pitch: 'd/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 're,', chord: 'E7' },
            { pitch: 'f/4', duration: '8', lyric: 'ter' },
            { pitch: 'g/4', duration: 'q', lyric: 'ra' },
            { pitch: 'a/4', duration: 'q', lyric: 'a', chord: 'Am' },
            { pitch: 'a/4', duration: 'q', lyric: 'ma' },
          ],
          bass: [
            { pitch: 'e/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
      ],
    },
  ],
};
