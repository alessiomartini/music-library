import type { Song } from '../../lib/types';

export const yourSong: Song = {
  slug: 'your-song',
  title: 'Your Song',
  artist: 'Elton John',
  composer: 'Elton John / Bernie Taupin',
  originalKey: 'C',
  capo: 3,
  timeSignature: '4/4',
  tempoBpm: 80,
  tempoMarking: 'Moderately',
  links: {
    spotify: 'https://open.spotify.com/search/Your%20Song%20Elton%20John',
    youtube: 'https://www.youtube.com/watch?v=YfQPHbITuJM',
  },
  history:
    "Bernie Taupin wrote the lyrics at the breakfast table in about ten minutes; Elton John set them to music " +
    'shortly after. Released in 1970, it became his breakthrough single and launched his career — despite its ' +
    "reputation as a classic love song, John has said it's really about the love between friends.",
  notes:
    'Chords shown "as played" with a capo on the 3rd fret (sounds in Eb). ' +
    'The engraved lead sheet is a best-effort draft transcription of the whole song, from memory ' +
    '(verify by ear before relying on it, especially away from the opening phrase); tempo is an approximate indication.',
  leadSheet: [
    {
      label: 'Verse 1',
      measures: [
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: "It's", chord: 'C' },
            { pitch: 'e/4', duration: '8', lyric: 'a' },
            { pitch: 'f/4', duration: '8', lyric: 'lit' },
            { pitch: 'g/4', duration: '8', lyric: 'tle' },
            { pitch: 'a/4', duration: 'q', lyric: 'bit' },
            { pitch: 'g/4', duration: 'q', lyric: 'fun', chord: 'Dm7' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'd/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'ny,' },
            { pitch: 'd/4', duration: 'q', lyric: 'this' },
            { pitch: 'c/4', duration: 'h', lyric: 'feel-ing', chord: 'C/E' },
          ],
          bass: [{ pitch: 'e/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'in', chord: 'F' },
            { pitch: 'f/4', duration: 'hd', lyric: 'side' },
          ],
          bass: [{ pitch: 'f/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: "I'm", chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: 'not' },
            { pitch: 'e/4', duration: '8', lyric: 'one' },
            { pitch: 'f/4', duration: '8', lyric: 'of' },
            { pitch: 'g/4', duration: 'q', lyric: 'those', chord: 'Dm7' },
            { pitch: 'f/4', duration: 'q', lyric: 'who' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'd/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'can', chord: 'Am7' },
            { pitch: 'e/4', duration: '8', lyric: 'eas' },
            { pitch: 'd/4', duration: '8', lyric: 'i' },
            { pitch: 'e/4', duration: '8', lyric: 'ly' },
            { pitch: 'c/4', duration: 'qd', lyric: 'hide' },
          ],
          bass: [{ pitch: 'a/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'I', chord: 'Dm7' },
            { pitch: 'd/4', duration: '8', lyric: "don't" },
            { pitch: 'e/4', duration: '8', lyric: 'have' },
            { pitch: 'f/4', duration: '8', lyric: 'much' },
            { pitch: 'g/4', duration: 'q', lyric: 'mon', chord: 'F' },
            { pitch: 'f/4', duration: 'q', lyric: 'ey' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'but', chord: 'C' },
            { pitch: 'd/4', duration: 'q', lyric: 'if', chord: 'G/B' },
            { pitch: 'c/4', duration: 'q', lyric: 'I' },
            { pitch: 'd/4', duration: 'q', lyric: 'did', chord: 'Am7' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'q' },
            { pitch: 'b/3', duration: 'h' },
            { pitch: 'a/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: "I'd", chord: 'F' },
            { pitch: 'f/4', duration: '8', lyric: 'buy' },
            { pitch: 'g/4', duration: '8', lyric: 'a' },
            { pitch: 'a/4', duration: '8', lyric: 'big' },
            { pitch: 'g/4', duration: 'q', lyric: 'house', chord: 'C/E' },
            { pitch: 'e/4', duration: 'q', lyric: 'where we' },
          ],
          bass: [
            { pitch: 'f/3', duration: 'h' },
            { pitch: 'e/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'both', chord: 'Dm7' },
            { pitch: 'd/4', duration: 'q', lyric: 'could' },
            { pitch: 'c/4', duration: 'h', lyric: 'live', chord: 'F' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'If', chord: 'C' },
            { pitch: 'e/4', duration: '8', lyric: 'I' },
            { pitch: 'f/4', duration: '8', lyric: 'was' },
            { pitch: 'g/4', duration: '8', lyric: 'a' },
            { pitch: 'a/4', duration: 'q', lyric: 'sculp', chord: 'Dm7' },
            { pitch: 'g/4', duration: 'q', lyric: 'tor, but' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'd/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'then', chord: 'C/E' },
            { pitch: 'd/4', duration: 'q', lyric: 'a' },
            { pitch: 'c/4', duration: 'q', lyric: 'gain', chord: 'F' },
            { pitch: 'c/4', duration: 'q', lyric: 'no' },
          ],
          bass: [
            { pitch: 'e/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'Or', chord: 'C' },
            { pitch: 'e/4', duration: '8', lyric: 'a' },
            { pitch: 'f/4', duration: '8', lyric: 'man' },
            { pitch: 'g/4', duration: '8', lyric: 'who' },
            { pitch: 'a/4', duration: 'q', lyric: 'makes', chord: 'Dm7' },
            { pitch: 'g/4', duration: 'q', lyric: 'po' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'd/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: '-tions in a' },
            { pitch: 'e/4', duration: 'q', lyric: "trav'ling", chord: 'Am7' },
            { pitch: 'd/4', duration: 'h', lyric: 'show' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'q' },
            { pitch: 'a/3', duration: 'hd' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'I', chord: 'Dm7' },
            { pitch: 'd/4', duration: '8', lyric: 'know' },
            { pitch: 'e/4', duration: '8', lyric: "it's" },
            { pitch: 'f/4', duration: '8', lyric: 'not' },
            { pitch: 'g/4', duration: 'q', lyric: 'much', chord: 'F' },
            { pitch: 'f/4', duration: 'q', lyric: 'but' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: "it's" },
            { pitch: 'e/4', duration: 'q', lyric: 'the', chord: 'C' },
            { pitch: 'd/4', duration: 'q', lyric: 'best', chord: 'G/B' },
            { pitch: 'c/4', duration: 'q', lyric: 'I' },
          ],
          bass: [
            { pitch: 'f/3', duration: 'q' },
            { pitch: 'c/3', duration: 'q' },
            { pitch: 'b/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'can' },
            { pitch: 'c/4', duration: 'hd', lyric: 'do', chord: 'Am7' },
          ],
          bass: [{ pitch: 'a/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'c/4', duration: '8', lyric: 'My', chord: 'F' },
            { pitch: 'e/4', duration: '8', lyric: 'gift' },
            { pitch: 'f/4', duration: '8', lyric: 'is' },
            { pitch: 'g/4', duration: '8', lyric: 'my' },
            { pitch: 'a/4', duration: 'q', lyric: 'song', chord: 'C/E' },
            { pitch: 'g/4', duration: 'q', lyric: 'and this' },
          ],
          bass: [
            { pitch: 'f/3', duration: 'h' },
            { pitch: 'e/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: "one's", chord: 'Dm7' },
            { pitch: 'e/4', duration: 'q', lyric: 'for' },
            { pitch: 'c/4', duration: 'h', lyric: 'you', chord: 'F' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
      ],
    },
    {
      label: 'Chorus',
      measures: [
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'And', chord: 'F' },
            { pitch: 'e/4', duration: '8', lyric: 'you' },
            { pitch: 'f/4', duration: '8', lyric: 'can' },
            { pitch: 'g/4', duration: '8', lyric: 'tell' },
            { pitch: 'a/4', duration: '8', lyric: 'ev' },
            { pitch: 'g/4', duration: '8', lyric: 'ry' },
            { pitch: 'f/4', duration: '8', lyric: 'bo', chord: 'C/E' },
            { pitch: 'e/4', duration: '8', lyric: 'dy' },
          ],
          bass: [
            { pitch: 'f/3', duration: 'hd' },
            { pitch: 'e/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'this' },
            { pitch: 'g/4', duration: '8', lyric: 'is' },
            { pitch: 'a/4', duration: 'q', lyric: 'your', chord: 'Dm7' },
            { pitch: 'g/4', duration: 'h', lyric: 'song' },
          ],
          bass: [
            { pitch: 'e/3', duration: 'q' },
            { pitch: 'd/3', duration: 'hd' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'It', chord: 'F' },
            { pitch: 'e/4', duration: '8', lyric: 'may' },
            { pitch: 'f/4', duration: '8', lyric: 'be' },
            { pitch: 'g/4', duration: '8', lyric: 'quite' },
            { pitch: 'a/4', duration: '8', lyric: 'sim' },
            { pitch: 'g/4', duration: '8', lyric: 'ple' },
            { pitch: 'f/4', duration: 'q', lyric: 'but', chord: 'C/E' },
          ],
          bass: [
            { pitch: 'f/3', duration: 'hd' },
            { pitch: 'e/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'now' },
            { pitch: 'f/4', duration: '8', lyric: 'that' },
            { pitch: 'g/4', duration: 'q', lyric: "it's" },
            { pitch: 'f/4', duration: 'h', lyric: 'done', chord: 'Dm7' },
          ],
          bass: [
            { pitch: 'e/3', duration: 'hd' },
            { pitch: 'd/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'I', chord: 'F' },
            { pitch: 'e/4', duration: 'q', lyric: 'hope' },
            { pitch: 'f/4', duration: 'q', lyric: 'you' },
            { pitch: 'g/4', duration: 'q', lyric: "don't" },
          ],
          bass: [{ pitch: 'f/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'mind,', chord: 'G' },
            { pitch: 'a/4', duration: 'q', lyric: 'I' },
            { pitch: 'g/4', duration: 'q', lyric: 'hope' },
            { pitch: 'f/4', duration: 'q', lyric: 'you' },
          ],
          bass: [{ pitch: 'g/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: "don't" },
            { pitch: 'd/4', duration: 'h', lyric: 'mind', chord: 'Em7' },
            { pitch: 'e/4', duration: 'q', lyric: '', chord: 'A7' },
          ],
          bass: [
            { pitch: 'e/3', duration: 'hd' },
            { pitch: 'a/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'That', chord: 'Dm7' },
            { pitch: 'd/4', duration: '8', lyric: 'I' },
            { pitch: 'e/4', duration: '8', lyric: 'put' },
            { pitch: 'f/4', duration: '8', lyric: 'down' },
            { pitch: 'e/4', duration: '8', lyric: 'in' },
            { pitch: 'f/4', duration: 'q', lyric: 'words', chord: 'F' },
            { pitch: 'g/4', duration: '8', lyric: 'how', chord: 'C' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'hd' },
            { pitch: 'f/3', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: '8', lyric: 'won', chord: 'G/B' },
            { pitch: 'f/4', duration: '8', lyric: 'der' },
            { pitch: 'e/4', duration: 'q', lyric: 'ful' },
            { pitch: 'f/4', duration: 'q', lyric: 'life', chord: 'Am7' },
            { pitch: 'g/4', duration: 'q', lyric: 'is' },
          ],
          bass: [
            { pitch: 'b/3', duration: 'h' },
            { pitch: 'a/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'while', chord: 'D7sus4/F#' },
            { pitch: 'e/4', duration: 'q', lyric: "you're" },
            { pitch: 'd/4', duration: '8', lyric: 'in', chord: 'Bb/F' },
            { pitch: 'd/4', duration: '8', lyric: 'the' },
            { pitch: 'c/4', duration: 'q', lyric: 'world', chord: 'F' },
          ],
          bass: [
            { pitch: 'f#/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'C' }],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
      ],
    },
  ],
};
