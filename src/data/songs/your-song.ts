import type { Song } from '../../lib/types';

export const yourSong: Song = {
  slug: 'your-song',
  title: 'Your Song',
  artist: 'Elton John',
  composer: 'Elton John / Bernie Taupin',
  originalKey: 'Eb',
  // Optional: a capo here lets you finger the song in C instead of Eb.
  // The chart is written in the song's own key and stays that way unless
  // you transpose it yourself.
  capo: 3,
  timeSignature: '4/4',
  tempoBpm: 68,
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
    'Chords and lyrics only, divided into bars. The chords were checked against a published ' +
    'edition, which writes the song in C for a capo on the 3rd fret; they are given here in the ' +
    'key the record is actually in. The melody is deliberately left out, since that part of the ' +
    'transcription was never verified. Within a bar, syllables are spaced roughly in proportion ' +
    'to how long they are held. Tempo is an approximate indication.',
  leadSheet: [
    {
      // Instrumental: the chords sit over a held Eb in the bass, which is
      // what the slash chords spell out.
      label: 'Intro',
      measures: [
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'Eb' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'Ab/Eb' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'Bb/Eb' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'Ab/Eb' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
      ],
    },
    {
      label: 'Verse 1',
      measures: [
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: "It's", chord: 'Eb' },
            { pitch: 'e/4', duration: '8', lyric: 'a' },
            { pitch: 'f/4', duration: '8', lyric: 'lit' },
            { pitch: 'g/4', duration: '8', lyric: 'tle' },
            { pitch: 'a/4', duration: 'q', lyric: 'bit' },
            { pitch: 'g/4', duration: 'q', lyric: 'fun', chord: 'Abmaj7' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'ny,' },
            { pitch: 'd/4', duration: 'q', lyric: 'this', chord: 'Bb' },
            { pitch: 'c/4', duration: 'h', lyric: 'feel-ing' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'q' },
            { pitch: 'g/4', duration: 'hd' },
          ],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'in', chord: 'Gm' },
            { pitch: 'f/4', duration: 'hd', lyric: 'side' },
          ],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: "I'm", chord: 'Cm' },
            { pitch: 'd/4', duration: '8', lyric: 'not' },
            { pitch: 'e/4', duration: '8', lyric: 'one' },
            { pitch: 'f/4', duration: '8', lyric: 'of' },
            { pitch: 'g/4', duration: 'q', lyric: 'those', chord: 'Cm/Bb' },
            { pitch: 'f/4', duration: 'q', lyric: 'who' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'can', chord: 'Cm/A' },
            { pitch: 'e/4', duration: '8', lyric: 'eas' },
            { pitch: 'd/4', duration: '8', lyric: 'i' },
            { pitch: 'e/4', duration: '8', lyric: 'ly', chord: 'Ab' },
            { pitch: 'c/4', duration: 'qd', lyric: 'hide' },
          ],
          bass: [
            { pitch: 'f#/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'I', chord: 'Eb' },
            { pitch: 'd/4', duration: '8', lyric: "don't" },
            { pitch: 'e/4', duration: '8', lyric: 'have' },
            { pitch: 'f/4', duration: '8', lyric: 'much' },
            { pitch: 'g/4', duration: 'q', lyric: 'mon', chord: 'Bb' },
            { pitch: 'f/4', duration: 'q', lyric: 'ey' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'but', chord: 'G' },
            { pitch: 'd/4', duration: 'q', lyric: 'if' },
            { pitch: 'c/4', duration: 'q', lyric: 'I' },
            { pitch: 'd/4', duration: 'q', lyric: 'did', chord: 'Cm' },
          ],
          bass: [
            { pitch: 'e/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: "I'd", chord: 'Eb' },
            { pitch: 'f/4', duration: '8', lyric: 'buy' },
            { pitch: 'g/4', duration: '8', lyric: 'a' },
            { pitch: 'a/4', duration: '8', lyric: 'big' },
            { pitch: 'g/4', duration: 'q', lyric: 'house', chord: 'Fm7' },
            { pitch: 'e/4', duration: 'q', lyric: 'where we' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'both', chord: 'Ab' },
            { pitch: 'd/4', duration: 'q', lyric: 'could' },
            { pitch: 'c/4', duration: 'h', lyric: 'live', chord: 'Bb' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'If', chord: 'Eb' },
            { pitch: 'e/4', duration: '8', lyric: 'I' },
            { pitch: 'f/4', duration: '8', lyric: 'was' },
            { pitch: 'g/4', duration: '8', lyric: 'a' },
            { pitch: 'a/4', duration: 'q', lyric: 'sculp', chord: 'Abmaj7' },
            { pitch: 'g/4', duration: 'q', lyric: 'tor, but' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'then', chord: 'Bb' },
            { pitch: 'd/4', duration: 'q', lyric: 'a' },
            { pitch: 'c/4', duration: 'q', lyric: 'gain', chord: 'Gm' },
            { pitch: 'c/4', duration: 'q', lyric: 'no' },
          ],
          bass: [
            { pitch: 'g/4', duration: 'h' },
            { pitch: 'e/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'Or', chord: 'Cm' },
            { pitch: 'e/4', duration: '8', lyric: 'a' },
            { pitch: 'f/4', duration: '8', lyric: 'man' },
            { pitch: 'g/4', duration: '8', lyric: 'who' },
            { pitch: 'a/4', duration: 'q', lyric: 'makes', chord: 'Cm/Bb' },
            { pitch: 'g/4', duration: 'q', lyric: 'po' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: '-tions in a', chord: 'Cm/A' },
            { pitch: 'e/4', duration: 'q', lyric: "trav'ling", chord: 'Ab' },
            { pitch: 'd/4', duration: 'h', lyric: 'show' },
          ],
          bass: [
            { pitch: 'f#/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'I', chord: 'Eb' },
            { pitch: 'd/4', duration: '8', lyric: 'know' },
            { pitch: 'e/4', duration: '8', lyric: "it's" },
            { pitch: 'f/4', duration: '8', lyric: 'not' },
            { pitch: 'g/4', duration: 'q', lyric: 'much', chord: 'Bb' },
            { pitch: 'f/4', duration: 'q', lyric: 'but' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: "it's" },
            { pitch: 'e/4', duration: 'q', lyric: 'the' },
            { pitch: 'd/4', duration: 'q', lyric: 'best', chord: 'G' },
            { pitch: 'c/4', duration: 'q', lyric: 'I' },
          ],
          bass: [
            { pitch: 'g/4', duration: 'h' },
            { pitch: 'e/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'can' },
            { pitch: 'c/4', duration: 'hd', lyric: 'do', chord: 'Cm' },
          ],
          bass: [{ pitch: 'a/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'c/4', duration: '8', lyric: 'My', chord: 'Eb' },
            { pitch: 'e/4', duration: '8', lyric: 'gift' },
            { pitch: 'f/4', duration: '8', lyric: 'is' },
            { pitch: 'g/4', duration: '8', lyric: 'my' },
            { pitch: 'a/4', duration: 'q', lyric: 'song', chord: 'Fm7' },
            { pitch: 'g/4', duration: 'q', lyric: 'and this' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: "one's", chord: 'Ab' },
            { pitch: 'e/4', duration: 'q', lyric: 'for' },
            { pitch: 'c/4', duration: 'h', lyric: 'you', chord: 'Bb' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
      ],
    },
    {
      label: 'Chorus',
      measures: [
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'And', chord: 'Bb' },
            { pitch: 'e/4', duration: '8', lyric: 'you' },
            { pitch: 'f/4', duration: '8', lyric: 'can' },
            { pitch: 'g/4', duration: '8', lyric: 'tell' },
            { pitch: 'a/4', duration: '8', lyric: 'ev' },
            { pitch: 'g/4', duration: '8', lyric: 'ry' },
            { pitch: 'f/4', duration: '8', lyric: 'bo', chord: 'Cm' },
            { pitch: 'e/4', duration: '8', lyric: 'dy' },
          ],
          bass: [
            { pitch: 'g/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'this', chord: 'Fm7' },
            { pitch: 'g/4', duration: '8', lyric: 'is' },
            { pitch: 'a/4', duration: 'q', lyric: 'your' },
            { pitch: 'g/4', duration: 'h', lyric: 'song', chord: 'Ab' },
          ],
          bass: [
            { pitch: 'd/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'It', chord: 'Bb/D' },
            { pitch: 'e/4', duration: '8', lyric: 'may' },
            { pitch: 'f/4', duration: '8', lyric: 'be' },
            { pitch: 'g/4', duration: '8', lyric: 'quite' },
            { pitch: 'a/4', duration: '8', lyric: 'sim' },
            { pitch: 'g/4', duration: '8', lyric: 'ple' },
            { pitch: 'f/4', duration: 'q', lyric: 'but', chord: 'Cm' },
          ],
          bass: [
            { pitch: 'b/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'now', chord: 'Fm7' },
            { pitch: 'f/4', duration: '8', lyric: 'that' },
            { pitch: 'g/4', duration: 'q', lyric: "it's" },
            { pitch: 'f/4', duration: 'h', lyric: 'done', chord: 'Ab' },
          ],
          bass: [
            { pitch: 'd/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'I', chord: 'Cm' },
            { pitch: 'e/4', duration: 'q', lyric: 'hope' },
            { pitch: 'f/4', duration: 'q', lyric: 'you' },
            { pitch: 'g/4', duration: 'q', lyric: "don't" },
          ],
          bass: [{ pitch: 'a/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'mind,', chord: 'Cm/Bb' },
            { pitch: 'a/4', duration: 'q', lyric: 'I' },
            { pitch: 'g/4', duration: 'q', lyric: 'hope' },
            { pitch: 'f/4', duration: 'q', lyric: 'you' },
          ],
          bass: [{ pitch: 'g/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: "don't" },
            { pitch: 'd/4', duration: 'h', lyric: 'mind' },
            { pitch: 'e/4', duration: 'q' },
          ],
          bass: [{ pitch: 'g/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'That', chord: 'Cm/A' },
            { pitch: 'd/4', duration: '8', lyric: 'I' },
            { pitch: 'e/4', duration: '8', lyric: 'put' },
            { pitch: 'f/4', duration: '8', lyric: 'down' },
            { pitch: 'e/4', duration: '8', lyric: 'in' },
            { pitch: 'f/4', duration: 'q', lyric: 'words', chord: 'Ab6' },
            { pitch: 'g/4', duration: '8', lyric: 'how', chord: 'Eb' },
          ],
          bass: [
            { pitch: 'f#/4', duration: 'h' },
            { pitch: 'f/4', duration: 'q' },
            { pitch: 'c/4', duration: 'q' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: '8', lyric: 'won' },
            { pitch: 'f/4', duration: '8', lyric: 'der' },
            { pitch: 'e/4', duration: 'q', lyric: 'ful' },
            { pitch: 'f/4', duration: 'q', lyric: 'life', chord: 'Ab6' },
            { pitch: 'g/4', duration: 'q', lyric: 'is' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'while', chord: 'Ab' },
            { pitch: 'e/4', duration: 'q', lyric: "you're" },
            { pitch: 'd/4', duration: '8', lyric: 'in', chord: 'Bb' },
            { pitch: 'd/4', duration: '8', lyric: 'the', chord: 'Bbsus4' },
            { pitch: 'c/4', duration: 'q', lyric: 'world', chord: 'Bb' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'Eb' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
      ],
    },
  ],
};
