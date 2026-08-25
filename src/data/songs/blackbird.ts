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
    'Fingerstyle guitar part reduced here to its harmony (chords) and vocal melody; the instrumental bridge ' +
    'shows chords only (rests), since it has no vocal line. The engraved lead sheet is a best-effort draft ' +
    'transcription of the whole song, from memory (verify by ear before relying on it, especially away from ' +
    'the opening phrase); tempo is an approximate indication.',
  leadSheet: [
    {
      label: 'Verse 1',
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
        {
          melody: [
            { pitch: 'c/5', duration: 'q', lyric: 'Take', chord: 'C' },
            { pitch: 'b/4', duration: 'q', lyric: 'these' },
            { pitch: 'a/4', duration: '8', lyric: 'bro' },
            { pitch: 'g/4', duration: '8', lyric: 'ken' },
            { pitch: 'a/4', duration: 'q', lyric: 'wings', chord: 'G/B' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'hd' },
            { pitch: 'b/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'b/4', duration: 'q', lyric: 'and' },
            { pitch: 'a/4', duration: 'q', lyric: 'learn', chord: 'A7sus4' },
            { pitch: 'g/4', duration: '8', lyric: 'to' },
            { pitch: 'a/4', duration: '8', lyric: 'fly', chord: 'G/B' },
            { pitch: 'a/4', duration: 'q', rest: true, chord: 'G' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'b/3', duration: 'q' },
            { pitch: 'g/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'd/5', duration: 'q', lyric: 'All', chord: 'G' },
            { pitch: 'b/4', duration: 'q', lyric: 'your' },
            { pitch: 'a/4', duration: 'q', lyric: 'life,' },
            { pitch: 'b/4', duration: 'q', lyric: 'you' },
          ],
          bass: [{ pitch: 'g/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'were', chord: 'Am7' },
            { pitch: 'g/4', duration: '8', lyric: 'on' },
            { pitch: 'a/4', duration: '8', lyric: 'ly' },
            { pitch: 'b/4', duration: 'q', lyric: 'wait', chord: 'G/B' },
            { pitch: 'a/4', duration: 'q', lyric: 'ing' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'b/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'c/5', duration: 'q', lyric: 'For', chord: 'C' },
            { pitch: 'b/4', duration: 'q', lyric: 'this' },
            { pitch: 'a/4', duration: '8', lyric: 'mo', chord: 'G/B' },
            { pitch: 'g/4', duration: '8', lyric: 'ment' },
            { pitch: 'a/4', duration: 'q', lyric: 'to' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'b/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: '8', lyric: 'a' },
            { pitch: 'a/4', duration: '8', lyric: 'rise', chord: 'A7sus4' },
            { pitch: 'b/4', duration: 'qd', rest: true, chord: 'G/B' },
            { pitch: 'g/4', duration: 'qd', rest: true, chord: 'G' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'b/3', duration: 'q' },
            { pitch: 'g/3', duration: 'q' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
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
        {
          melody: [
            { pitch: 'c/5', duration: 'q', lyric: 'Take', chord: 'C' },
            { pitch: 'b/4', duration: 'q', lyric: 'these' },
            { pitch: 'a/4', duration: '8', lyric: 'sun' },
            { pitch: 'g/4', duration: '8', lyric: 'ken' },
            { pitch: 'a/4', duration: 'q', lyric: 'eyes', chord: 'G/B' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'hd' },
            { pitch: 'b/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'b/4', duration: 'q', lyric: 'and' },
            { pitch: 'a/4', duration: 'q', lyric: 'learn', chord: 'A7sus4' },
            { pitch: 'g/4', duration: '8', lyric: 'to' },
            { pitch: 'a/4', duration: '8', lyric: 'see', chord: 'G/B' },
            { pitch: 'a/4', duration: 'q', rest: true, chord: 'G' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'b/3', duration: 'q' },
            { pitch: 'g/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'd/5', duration: 'q', lyric: 'All', chord: 'G' },
            { pitch: 'b/4', duration: 'q', lyric: 'your' },
            { pitch: 'a/4', duration: 'q', lyric: 'life,' },
            { pitch: 'b/4', duration: 'q', lyric: 'you' },
          ],
          bass: [{ pitch: 'g/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'were', chord: 'Am7' },
            { pitch: 'g/4', duration: '8', lyric: 'on' },
            { pitch: 'a/4', duration: '8', lyric: 'ly' },
            { pitch: 'b/4', duration: 'q', lyric: 'wait', chord: 'G/B' },
            { pitch: 'a/4', duration: 'q', lyric: 'ing' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'b/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'c/5', duration: 'q', lyric: 'For', chord: 'C' },
            { pitch: 'b/4', duration: 'q', lyric: 'this' },
            { pitch: 'a/4', duration: '8', lyric: 'mo', chord: 'G/B' },
            { pitch: 'g/4', duration: '8', lyric: 'ment' },
            { pitch: 'a/4', duration: 'q', lyric: 'to' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'b/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'be' },
            { pitch: 'a/4', duration: 'q', lyric: 'free', chord: 'A7sus4' },
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'G/B' },
            { pitch: 'g/4', duration: 'q', rest: true, chord: 'G' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'b/3', duration: 'q' },
            { pitch: 'g/3', duration: 'q' },
          ],
        },
      ],
    },
    {
      label: 'Bridge (instrumental — chords only)',
      measures: [
        {
          melody: [
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'Am' },
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'G/B' },
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'C' },
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'D' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'q' },
            { pitch: 'b/3', duration: 'q' },
            { pitch: 'c/3', duration: 'q' },
            { pitch: 'd/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'G' },
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'Bm' },
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'C' },
            { pitch: 'b/4', duration: 'q', rest: true, chord: 'D' },
          ],
          bass: [
            { pitch: 'g/3', duration: 'q' },
            { pitch: 'b/3', duration: 'q' },
            { pitch: 'c/3', duration: 'q' },
            { pitch: 'd/3', duration: 'q' },
          ],
        },
      ],
    },
  ],
};
