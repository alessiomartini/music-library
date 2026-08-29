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
  history:
    "Paul McCartney reportedly woke up with the entire melody in his head and worried he'd subconsciously " +
    'copied it from somewhere; he first sang it with placeholder lyrics ("Scrambled eggs..."). It is the only ' +
    'Beatles recording made by a single band member (McCartney, with a string quartet), and holds the Guinness ' +
    'World Record for the most-covered song in history.',
  notes:
    'The engraved lead sheet is a best-effort draft transcription of the whole song, from memory ' +
    '(verify by ear before relying on it, especially away from the opening phrase); tempo is an approximate indication.',
  leadSheet: [
    {
      label: 'Verse 1',
      measures: [
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'Yes', chord: 'F' },
            { pitch: 'e/4', duration: '8', lyric: 'ter' },
            { pitch: 'd/4', duration: '8', lyric: 'day,' },
            { pitch: 'c/4', duration: 'q', lyric: 'all' },
            { pitch: 'c/4', duration: 'q', lyric: 'my' },
          ],
          bass: [{ pitch: 'f/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'trou', chord: 'Em7' },
            { pitch: 'e/4', duration: 'q', lyric: 'bles' },
            { pitch: 'f/4', duration: 'h', lyric: 'seemed' },
          ],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'g/4', duration: '8', lyric: 'so' },
            { pitch: 'a/4', duration: '8', lyric: 'far', chord: 'A7' },
            { pitch: 'g/4', duration: 'q', lyric: 'a' },
            { pitch: 'f/4', duration: 'h', lyric: 'way', chord: 'Dm' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'c/4', duration: 'q', lyric: 'Now', chord: 'Dm/C' },
            { pitch: 'd/4', duration: 'q', lyric: 'it' },
            { pitch: 'e/4', duration: 'q', lyric: 'looks', chord: 'Bb6' },
            { pitch: 'f/4', duration: 'q', lyric: 'as' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'bb/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'though' },
            { pitch: 'f/4', duration: '8', lyric: "they're" },
            { pitch: 'g/4', duration: 'hd', lyric: 'here', chord: 'F' },
          ],
          bass: [{ pitch: 'f/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'to' },
            { pitch: 'e/4', duration: 'hd', lyric: 'stay', chord: 'C7' },
          ],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'Oh,', chord: 'F' },
            { pitch: 'e/4', duration: 'q', lyric: 'I' },
            { pitch: 'd/4', duration: '8', lyric: 'be', chord: 'Gm7' },
            { pitch: 'e/4', duration: '8', lyric: 'lieve' },
            { pitch: 'f/4', duration: 'q', lyric: 'in' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'yes', chord: 'C7' },
            { pitch: 'f/4', duration: 'q', lyric: 'ter' },
            { pitch: 'e/4', duration: 'h', lyric: 'day' },
          ],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'Sud', chord: 'F' },
            { pitch: 'e/4', duration: '8', lyric: 'den' },
            { pitch: 'd/4', duration: '8', lyric: 'ly,' },
            { pitch: 'c/4', duration: 'q', lyric: "I'm" },
            { pitch: 'c/4', duration: 'q', lyric: 'not' },
          ],
          bass: [{ pitch: 'f/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'half', chord: 'Em7' },
            { pitch: 'e/4', duration: 'q', lyric: 'the' },
            { pitch: 'f/4', duration: 'q', lyric: 'man' },
            { pitch: 'g/4', duration: 'q', lyric: 'I' },
          ],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'used', chord: 'A7' },
            { pitch: 'g/4', duration: 'q', lyric: 'to' },
            { pitch: 'f/4', duration: 'h', lyric: 'be', chord: 'Dm' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'c/4', duration: 'q', lyric: "There's", chord: 'Dm/C' },
            { pitch: 'd/4', duration: 'q', lyric: 'a' },
            { pitch: 'e/4', duration: 'q', lyric: 'shadow', chord: 'Bb6' },
            { pitch: 'f/4', duration: 'q', lyric: 'hang' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'bb/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'ing' },
            { pitch: 'f/4', duration: '8', lyric: 'o' },
            { pitch: 'g/4', duration: 'q', lyric: 'ver', chord: 'F' },
            { pitch: 'f/4', duration: 'h', lyric: 'me', chord: 'C7' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'c/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'Oh,', chord: 'F' },
            { pitch: 'e/4', duration: '8', lyric: 'yes' },
            { pitch: 'd/4', duration: '8', lyric: 'ter' },
            { pitch: 'e/4', duration: 'q', lyric: 'day' },
            { pitch: 'f/4', duration: 'q', lyric: 'came' },
          ],
          bass: [{ pitch: 'f/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'sud', chord: 'Gm7' },
            { pitch: 'e/4', duration: 'q', lyric: 'den', chord: 'C7' },
            { pitch: 'f/4', duration: 'h', lyric: 'ly' },
          ],
          bass: [
            { pitch: 'g/4', duration: 'h' },
            { pitch: 'c/4', duration: 'h' },
          ],
        },
      ],
    },
    {
      label: 'Bridge',
      measures: [
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'Why', chord: 'F' },
            { pitch: 'g/4', duration: 'q', lyric: 'she' },
            { pitch: 'f/4', duration: 'q', lyric: 'had' },
            { pitch: 'e/4', duration: 'q', lyric: 'to' },
          ],
          bass: [{ pitch: 'f/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'go,', chord: 'Fmaj7' },
            { pitch: 'e/4', duration: 'q', lyric: 'I' },
            { pitch: 'd/4', duration: 'q', lyric: "don't", chord: 'Bm7b5' },
            { pitch: 'e/4', duration: 'q', lyric: 'know,' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'b/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'she' },
            { pitch: 'g/4', duration: '8', lyric: 'would' },
            { pitch: 'a/4', duration: '8', lyric: "n't" },
            { pitch: 'g/4', duration: 'h', lyric: 'say', chord: 'E7' },
          ],
          bass: [
            { pitch: 'b/4', duration: 'h' },
            { pitch: 'e/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'I', chord: 'Am' },
            { pitch: 'g/4', duration: 'q', lyric: 'said' },
            { pitch: 'f/4', duration: '8', lyric: 'some', chord: 'D7' },
            { pitch: 'e/4', duration: '8', lyric: 'thing' },
            { pitch: 'd/4', duration: 'q', lyric: 'wrong,' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'now', chord: 'Gm' },
            { pitch: 'f/4', duration: 'q', lyric: 'I' },
            { pitch: 'g/4', duration: 'q', lyric: 'long', chord: 'C7' },
            { pitch: 'f/4', duration: 'q', lyric: 'for' },
          ],
          bass: [
            { pitch: 'g/4', duration: 'h' },
            { pitch: 'c/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'yes', chord: 'F' },
            { pitch: 'e/4', duration: 'q', lyric: 'ter' },
            { pitch: 'd/4', duration: 'h', lyric: 'day' },
          ],
          bass: [{ pitch: 'f/4', duration: 'w' }],
        },
      ],
    },
    {
      label: 'Verse 3',
      measures: [
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'Yes', chord: 'F' },
            { pitch: 'e/4', duration: '8', lyric: 'ter' },
            { pitch: 'd/4', duration: '8', lyric: 'day,' },
            { pitch: 'c/4', duration: 'q', lyric: 'love' },
            { pitch: 'c/4', duration: 'q', lyric: 'was' },
          ],
          bass: [{ pitch: 'f/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'such', chord: 'Em7' },
            { pitch: 'e/4', duration: 'q', lyric: 'an' },
            { pitch: 'f/4', duration: 'q', lyric: 'eas' },
            { pitch: 'g/4', duration: 'q', lyric: 'y' },
          ],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'game', chord: 'A7' },
            { pitch: 'g/4', duration: 'q', lyric: 'to' },
            { pitch: 'f/4', duration: 'h', lyric: 'play', chord: 'Dm' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'c/4', duration: 'q', lyric: 'Now', chord: 'Dm/C' },
            { pitch: 'd/4', duration: 'q', lyric: 'I' },
            { pitch: 'e/4', duration: 'q', lyric: 'need', chord: 'Bb6' },
            { pitch: 'f/4', duration: 'q', lyric: 'a' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'bb/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'place' },
            { pitch: 'f/4', duration: '8', lyric: 'to' },
            { pitch: 'g/4', duration: 'q', lyric: 'hide', chord: 'F' },
            { pitch: 'f/4', duration: 'q', lyric: 'a' },
            { pitch: 'e/4', duration: 'q', lyric: 'way', chord: 'C7' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'c/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'Oh,', chord: 'F' },
            { pitch: 'e/4', duration: 'q', lyric: 'I' },
            { pitch: 'd/4', duration: '8', lyric: 'be', chord: 'Gm7' },
            { pitch: 'e/4', duration: '8', lyric: 'lieve' },
            { pitch: 'f/4', duration: 'q', lyric: 'in' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'yes', chord: 'C7' },
            { pitch: 'f/4', duration: 'q', lyric: 'ter' },
            { pitch: 'e/4', duration: 'h', lyric: 'day', chord: 'F' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
      ],
    },
  ],
};
