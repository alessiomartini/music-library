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
  history:
    'Paul McCartney recorded it solo — just voice, acoustic guitar, tapping foot, and a recording of a blackbird — ' +
    'for the White Album (1968). He has said it was inspired by the civil rights movement in the United States, ' +
    'written as an message of hope to a Black woman facing discrimination ("you were only waiting for this ' +
    'moment to arise"). The intricate fingerpicking pattern was influenced by Bach.',
  notes:
    'Chords and lyrics only, divided into bars; within a bar, syllables are spaced roughly in ' +
    'proportion to how long they are held. The fingerstyle guitar part is reduced to its harmony, and ' +
    'the instrumental bridge shows bars with chords but no words. These chords were written from ' +
    'memory and have not been checked against a published edition — verify them by ear before relying ' +
    'on them. Tempo is an approximate indication.',
  leadSheet: [
    {
      label: 'Verse 1',
      measures: [
        {
          melody: [
            { duration: '8', lyric: 'Black', chord: 'G' },
            { duration: '8', lyric: 'bird' },
            { duration: '8', lyric: 'sing' },
            { duration: '8', lyric: 'ing' },
            { duration: 'q', lyric: 'in' },
            { duration: 'q', lyric: 'the' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'dead', chord: 'Am7' },
            { duration: 'hd', lyric: 'of night', chord: 'G/B' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'Take', chord: 'C' },
            { duration: 'q', lyric: 'these' },
            { duration: '8', lyric: 'bro' },
            { duration: '8', lyric: 'ken' },
            { duration: 'q', lyric: 'wings', chord: 'G/B' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'and' },
            { duration: 'q', lyric: 'learn', chord: 'A7sus4' },
            { duration: '8', lyric: 'to' },
            { duration: '8', lyric: 'fly', chord: 'G/B' },
            { duration: 'q', rest: true, chord: 'G' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'All', chord: 'G' },
            { duration: 'q', lyric: 'your' },
            { duration: 'q', lyric: 'life,' },
            { duration: 'q', lyric: 'you' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'were', chord: 'Am7' },
            { duration: '8', lyric: 'on' },
            { duration: '8', lyric: 'ly' },
            { duration: 'q', lyric: 'wait', chord: 'G/B' },
            { duration: 'q', lyric: 'ing' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'For', chord: 'C' },
            { duration: 'q', lyric: 'this' },
            { duration: '8', lyric: 'mo', chord: 'G/B' },
            { duration: '8', lyric: 'ment' },
            { duration: 'q', lyric: 'to' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'a' },
            { duration: '8', lyric: 'rise', chord: 'A7sus4' },
            { duration: 'qd', rest: true, chord: 'G/B' },
            { duration: 'qd', rest: true, chord: 'G' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { duration: '8', lyric: 'Black', chord: 'G' },
            { duration: '8', lyric: 'bird' },
            { duration: '8', lyric: 'sing' },
            { duration: '8', lyric: 'ing' },
            { duration: 'q', lyric: 'in' },
            { duration: 'q', lyric: 'the' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'dead', chord: 'Am7' },
            { duration: 'hd', lyric: 'of night', chord: 'G/B' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'Take', chord: 'C' },
            { duration: 'q', lyric: 'these' },
            { duration: '8', lyric: 'sun' },
            { duration: '8', lyric: 'ken' },
            { duration: 'q', lyric: 'eyes', chord: 'G/B' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'and' },
            { duration: 'q', lyric: 'learn', chord: 'A7sus4' },
            { duration: '8', lyric: 'to' },
            { duration: '8', lyric: 'see', chord: 'G/B' },
            { duration: 'q', rest: true, chord: 'G' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'All', chord: 'G' },
            { duration: 'q', lyric: 'your' },
            { duration: 'q', lyric: 'life,' },
            { duration: 'q', lyric: 'you' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'were', chord: 'Am7' },
            { duration: '8', lyric: 'on' },
            { duration: '8', lyric: 'ly' },
            { duration: 'q', lyric: 'wait', chord: 'G/B' },
            { duration: 'q', lyric: 'ing' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'For', chord: 'C' },
            { duration: 'q', lyric: 'this' },
            { duration: '8', lyric: 'mo', chord: 'G/B' },
            { duration: '8', lyric: 'ment' },
            { duration: 'q', lyric: 'to' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'be' },
            { duration: 'q', lyric: 'free', chord: 'A7sus4' },
            { duration: 'q', rest: true, chord: 'G/B' },
            { duration: 'q', rest: true, chord: 'G' },
          ],
        },
      ],
    },
    {
      label: 'Bridge (instrumental — chords only)',
      measures: [
        {
          melody: [
            { duration: 'q', rest: true, chord: 'Am' },
            { duration: 'q', rest: true, chord: 'G/B' },
            { duration: 'q', rest: true, chord: 'C' },
            { duration: 'q', rest: true, chord: 'D' },
          ],
        },
        {
          melody: [
            { duration: 'q', rest: true, chord: 'G' },
            { duration: 'q', rest: true, chord: 'Bm' },
            { duration: 'q', rest: true, chord: 'C' },
            { duration: 'q', rest: true, chord: 'D' },
          ],
        },
      ],
    },
  ],
};
