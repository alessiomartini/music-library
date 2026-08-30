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
          melody: [{ duration: 'w', rest: true, chord: 'Eb' }],
        },
        {
          melody: [{ duration: 'w', rest: true, chord: 'Ab/Eb' }],
        },
        {
          melody: [{ duration: 'w', rest: true, chord: 'Bb/Eb' }],
        },
        {
          melody: [{ duration: 'w', rest: true, chord: 'Ab/Eb' }],
        },
      ],
    },
    {
      label: 'Verse 1',
      measures: [
        {
          melody: [
            { duration: '8', lyric: "It's", chord: 'Eb' },
            { duration: '8', lyric: 'a' },
            { duration: '8', lyric: 'lit' },
            { duration: '8', lyric: 'tle' },
            { duration: 'q', lyric: 'bit' },
            { duration: 'q', lyric: 'fun', chord: 'Abmaj7' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'ny,' },
            { duration: 'q', lyric: 'this', chord: 'Bb' },
            { duration: 'h', lyric: 'feel-ing' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'in', chord: 'Gm' },
            { duration: 'hd', lyric: 'side' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: "I'm", chord: 'Cm' },
            { duration: '8', lyric: 'not' },
            { duration: '8', lyric: 'one' },
            { duration: '8', lyric: 'of' },
            { duration: 'q', lyric: 'those', chord: 'Cm/Bb' },
            { duration: 'q', lyric: 'who' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'can', chord: 'Cm/A' },
            { duration: '8', lyric: 'eas' },
            { duration: '8', lyric: 'i' },
            { duration: '8', lyric: 'ly', chord: 'Ab' },
            { duration: 'qd', lyric: 'hide' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'I', chord: 'Eb' },
            { duration: '8', lyric: "don't" },
            { duration: '8', lyric: 'have' },
            { duration: '8', lyric: 'much' },
            { duration: 'q', lyric: 'mon', chord: 'Bb' },
            { duration: 'q', lyric: 'ey' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'but', chord: 'G' },
            { duration: 'q', lyric: 'if' },
            { duration: 'q', lyric: 'I' },
            { duration: 'q', lyric: 'did', chord: 'Cm' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: "I'd", chord: 'Eb' },
            { duration: '8', lyric: 'buy' },
            { duration: '8', lyric: 'a' },
            { duration: '8', lyric: 'big' },
            { duration: 'q', lyric: 'house', chord: 'Fm7' },
            { duration: 'q', lyric: 'where we' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'both', chord: 'Ab' },
            { duration: 'q', lyric: 'could' },
            { duration: 'h', lyric: 'live', chord: 'Bb' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { duration: '8', lyric: 'If', chord: 'Eb' },
            { duration: '8', lyric: 'I' },
            { duration: '8', lyric: 'was' },
            { duration: '8', lyric: 'a' },
            { duration: 'q', lyric: 'sculp', chord: 'Abmaj7' },
            { duration: 'q', lyric: 'tor, but' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'then', chord: 'Bb' },
            { duration: 'q', lyric: 'a' },
            { duration: 'q', lyric: 'gain', chord: 'Gm' },
            { duration: 'q', lyric: 'no' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'Or', chord: 'Cm' },
            { duration: '8', lyric: 'a' },
            { duration: '8', lyric: 'man' },
            { duration: '8', lyric: 'who' },
            { duration: 'q', lyric: 'makes', chord: 'Cm/Bb' },
            { duration: 'q', lyric: 'po' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: '-tions in a', chord: 'Cm/A' },
            { duration: 'q', lyric: "trav'ling", chord: 'Ab' },
            { duration: 'h', lyric: 'show' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'I', chord: 'Eb' },
            { duration: '8', lyric: 'know' },
            { duration: '8', lyric: "it's" },
            { duration: '8', lyric: 'not' },
            { duration: 'q', lyric: 'much', chord: 'Bb' },
            { duration: 'q', lyric: 'but' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: "it's" },
            { duration: 'q', lyric: 'the' },
            { duration: 'q', lyric: 'best', chord: 'G' },
            { duration: 'q', lyric: 'I' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'can' },
            { duration: 'hd', lyric: 'do', chord: 'Cm' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'My', chord: 'Eb' },
            { duration: '8', lyric: 'gift' },
            { duration: '8', lyric: 'is' },
            { duration: '8', lyric: 'my' },
            { duration: 'q', lyric: 'song', chord: 'Fm7' },
            { duration: 'q', lyric: 'and this' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: "one's", chord: 'Ab' },
            { duration: 'q', lyric: 'for' },
            { duration: 'h', lyric: 'you', chord: 'Bb' },
          ],
        },
      ],
    },
    {
      label: 'Chorus',
      measures: [
        {
          melody: [
            { duration: '8', lyric: 'And', chord: 'Bb' },
            { duration: '8', lyric: 'you' },
            { duration: '8', lyric: 'can' },
            { duration: '8', lyric: 'tell' },
            { duration: '8', lyric: 'ev' },
            { duration: '8', lyric: 'ry' },
            { duration: '8', lyric: 'bo', chord: 'Cm' },
            { duration: '8', lyric: 'dy' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'this', chord: 'Fm7' },
            { duration: '8', lyric: 'is' },
            { duration: 'q', lyric: 'your' },
            { duration: 'h', lyric: 'song', chord: 'Ab' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'It', chord: 'Bb/D' },
            { duration: '8', lyric: 'may' },
            { duration: '8', lyric: 'be' },
            { duration: '8', lyric: 'quite' },
            { duration: '8', lyric: 'sim' },
            { duration: '8', lyric: 'ple' },
            { duration: 'q', lyric: 'but', chord: 'Cm' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'now', chord: 'Fm7' },
            { duration: '8', lyric: 'that' },
            { duration: 'q', lyric: "it's" },
            { duration: 'h', lyric: 'done', chord: 'Ab' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'I', chord: 'Cm' },
            { duration: 'q', lyric: 'hope' },
            { duration: 'q', lyric: 'you' },
            { duration: 'q', lyric: "don't" },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'mind,', chord: 'Cm/Bb' },
            { duration: 'q', lyric: 'I' },
            { duration: 'q', lyric: 'hope' },
            { duration: 'q', lyric: 'you' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: "don't" },
            { duration: 'h', lyric: 'mind' },
            { duration: 'q' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'That', chord: 'Cm/A' },
            { duration: '8', lyric: 'I' },
            { duration: '8', lyric: 'put' },
            { duration: '8', lyric: 'down' },
            { duration: '8', lyric: 'in' },
            { duration: 'q', lyric: 'words', chord: 'Ab6' },
            { duration: '8', lyric: 'how', chord: 'Eb' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'won' },
            { duration: '8', lyric: 'der' },
            { duration: 'q', lyric: 'ful' },
            { duration: 'q', lyric: 'life', chord: 'Ab6' },
            { duration: 'q', lyric: 'is' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'while', chord: 'Ab' },
            { duration: 'q', lyric: "you're" },
            { duration: '8', lyric: 'in', chord: 'Bb' },
            { duration: '8', lyric: 'the', chord: 'Bbsus4' },
            { duration: 'q', lyric: 'world', chord: 'Bb' },
          ],
        },
        {
          melody: [{ duration: 'w', rest: true, chord: 'Eb' }],
        },
      ],
    },
  ],
};
