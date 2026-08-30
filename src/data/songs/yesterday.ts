import type { Song } from '../../lib/types';

export const yesterday: Song = {
  slug: 'yesterday',
  title: 'Yesterday',
  artist: 'The Beatles',
  composer: 'Lennon–McCartney',
  originalKey: 'F',
  // Not a capo: McCartney tuned the whole guitar down a tone and fingered
  // the song in G, which is why it sounds in F.
  tuning: 'Down a whole step (D G C F A D) — fingered in G, sounds in F',
  timeSignature: '4/4',
  tempoBpm: 96,
  tempoMarking: 'Slowly',
  links: {
    spotify: 'https://open.spotify.com/search/Yesterday%20The%20Beatles',
    youtube: 'https://www.youtube.com/watch?v=U6bftfiTums',
  },
  history:
    "Paul McCartney reportedly woke up with the entire melody in his head and worried he'd subconsciously " +
    'copied it from somewhere; he first sang it with placeholder lyrics ("Scrambled eggs..."). It is the only ' +
    'Beatles recording made by a single band member (McCartney, with a string quartet), and holds the Guinness ' +
    'World Record for the most-covered song in history.',
  notes:
    'Chords and lyrics only, divided into bars; within a bar, syllables are spaced roughly in ' +
    'proportion to how long they are held. These chords were written from memory and have not been ' +
    'checked against a published edition — verify them by ear before relying on them. The melody is ' +
    'left out for the same reason. Tempo is an approximate indication.',
  leadSheet: [
    {
      label: 'Verse 1',
      measures: [
        {
          melody: [
            { duration: 'q', lyric: 'Yes', chord: 'F' },
            { duration: '8', lyric: 'ter' },
            { duration: '8', lyric: 'day,' },
            { duration: 'q', lyric: 'all' },
            { duration: 'q', lyric: 'my' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'trou', chord: 'Em7' },
            { duration: 'q', lyric: 'bles' },
            { duration: 'h', lyric: 'seemed' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'so' },
            { duration: '8', lyric: 'far', chord: 'A7' },
            { duration: 'q', lyric: 'a' },
            { duration: 'h', lyric: 'way', chord: 'Dm' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'Now', chord: 'Dm/C' },
            { duration: 'q', lyric: 'it' },
            { duration: 'q', lyric: 'looks', chord: 'Bb6' },
            { duration: 'q', lyric: 'as' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'though' },
            { duration: '8', lyric: "they're" },
            { duration: 'hd', lyric: 'here', chord: 'F' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'to' },
            { duration: 'hd', lyric: 'stay', chord: 'C7' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'Oh,', chord: 'F' },
            { duration: 'q', lyric: 'I' },
            { duration: '8', lyric: 'be', chord: 'Gm7' },
            { duration: '8', lyric: 'lieve' },
            { duration: 'q', lyric: 'in' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'yes', chord: 'C7' },
            { duration: 'q', lyric: 'ter' },
            { duration: 'h', lyric: 'day' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { duration: 'q', lyric: 'Sud', chord: 'F' },
            { duration: '8', lyric: 'den' },
            { duration: '8', lyric: 'ly,' },
            { duration: 'q', lyric: "I'm" },
            { duration: 'q', lyric: 'not' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'half', chord: 'Em7' },
            { duration: 'q', lyric: 'the' },
            { duration: 'q', lyric: 'man' },
            { duration: 'q', lyric: 'I' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'used', chord: 'A7' },
            { duration: 'q', lyric: 'to' },
            { duration: 'h', lyric: 'be', chord: 'Dm' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: "There's", chord: 'Dm/C' },
            { duration: 'q', lyric: 'a' },
            { duration: 'q', lyric: 'shadow', chord: 'Bb6' },
            { duration: 'q', lyric: 'hang' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'ing' },
            { duration: '8', lyric: 'o' },
            { duration: 'q', lyric: 'ver', chord: 'F' },
            { duration: 'h', lyric: 'me', chord: 'C7' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'Oh,', chord: 'F' },
            { duration: '8', lyric: 'yes' },
            { duration: '8', lyric: 'ter' },
            { duration: 'q', lyric: 'day' },
            { duration: 'q', lyric: 'came' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'sud', chord: 'Gm7' },
            { duration: 'q', lyric: 'den', chord: 'C7' },
            { duration: 'h', lyric: 'ly' },
          ],
        },
      ],
    },
    {
      label: 'Bridge',
      measures: [
        {
          melody: [
            { duration: 'q', lyric: 'Why', chord: 'F' },
            { duration: 'q', lyric: 'she' },
            { duration: 'q', lyric: 'had' },
            { duration: 'q', lyric: 'to' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'go,', chord: 'Fmaj7' },
            { duration: 'q', lyric: 'I' },
            { duration: 'q', lyric: "don't", chord: 'Bm7b5' },
            { duration: 'q', lyric: 'know,' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'she' },
            { duration: '8', lyric: 'would' },
            { duration: '8', lyric: "n't" },
            { duration: 'h', lyric: 'say', chord: 'E7' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'I', chord: 'Am' },
            { duration: 'q', lyric: 'said' },
            { duration: '8', lyric: 'some', chord: 'D7' },
            { duration: '8', lyric: 'thing' },
            { duration: 'q', lyric: 'wrong,' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'now', chord: 'Gm' },
            { duration: 'q', lyric: 'I' },
            { duration: 'q', lyric: 'long', chord: 'C7' },
            { duration: 'q', lyric: 'for' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'yes', chord: 'F' },
            { duration: 'q', lyric: 'ter' },
            { duration: 'h', lyric: 'day' },
          ],
        },
      ],
    },
    {
      label: 'Verse 3',
      measures: [
        {
          melody: [
            { duration: 'q', lyric: 'Yes', chord: 'F' },
            { duration: '8', lyric: 'ter' },
            { duration: '8', lyric: 'day,' },
            { duration: 'q', lyric: 'love' },
            { duration: 'q', lyric: 'was' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'such', chord: 'Em7' },
            { duration: 'q', lyric: 'an' },
            { duration: 'q', lyric: 'eas' },
            { duration: 'q', lyric: 'y' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'game', chord: 'A7' },
            { duration: 'q', lyric: 'to' },
            { duration: 'h', lyric: 'play', chord: 'Dm' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'Now', chord: 'Dm/C' },
            { duration: 'q', lyric: 'I' },
            { duration: 'q', lyric: 'need', chord: 'Bb6' },
            { duration: 'q', lyric: 'a' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'place' },
            { duration: '8', lyric: 'to' },
            { duration: 'q', lyric: 'hide', chord: 'F' },
            { duration: 'q', lyric: 'a' },
            { duration: 'q', lyric: 'way', chord: 'C7' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'Oh,', chord: 'F' },
            { duration: 'q', lyric: 'I' },
            { duration: '8', lyric: 'be', chord: 'Gm7' },
            { duration: '8', lyric: 'lieve' },
            { duration: 'q', lyric: 'in' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'yes', chord: 'C7' },
            { duration: 'q', lyric: 'ter' },
            { duration: 'h', lyric: 'day', chord: 'F' },
          ],
        },
      ],
    },
  ],
};
