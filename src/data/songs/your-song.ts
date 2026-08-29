import type { Song } from '../../lib/types';

export const yourSong: Song = {
  slug: 'your-song',
  title: 'Your Song',
  artist: 'Elton John',
  composer: 'Elton John / Bernie Taupin',
  originalKey: 'C',
  capo: 3,
  soundingKey: 'Eb',
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
    'The lead sheet shows chords and lyrics over the rhythm of the vocal line — bar layout, ' +
    'note values and rests — but no melody pitches: the chords were checked against a published ' +
    'edition, the melodic contour was not, so it is left out rather than shown wrongly. ' +
    'Tempo is an approximate indication.',
  leadSheet: [
    {
      // Instrumental: the chords sit over a held C in the bass, which is what
      // the slash chords spell out. Shown as chord-over-rest (the same way
      // Blackbird's instrumental bridge is notated) rather than guessing at
      // the piano figure's exact rhythm.
      label: 'Intro',
      measures: [
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'C' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'F/C' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'G/C' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'F/C' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
      ],
    },
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
            { pitch: 'g/4', duration: 'q', lyric: 'fun', chord: 'Fmaj7' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'ny,' },
            { pitch: 'd/4', duration: 'q', lyric: 'this', chord: 'G' },
            { pitch: 'c/4', duration: 'h', lyric: 'feel-ing' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'q' },
            { pitch: 'g/4', duration: 'hd' },
          ],
        },
        {
          melody: [
            { pitch: 'a/4', duration: 'q', lyric: 'in', chord: 'Em' },
            { pitch: 'f/4', duration: 'hd', lyric: 'side' },
          ],
          bass: [{ pitch: 'e/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: "I'm", chord: 'Am' },
            { pitch: 'd/4', duration: '8', lyric: 'not' },
            { pitch: 'e/4', duration: '8', lyric: 'one' },
            { pitch: 'f/4', duration: '8', lyric: 'of' },
            { pitch: 'g/4', duration: 'q', lyric: 'those', chord: 'Am/G' },
            { pitch: 'f/4', duration: 'q', lyric: 'who' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'can', chord: 'Am/F#' },
            { pitch: 'e/4', duration: '8', lyric: 'eas' },
            { pitch: 'd/4', duration: '8', lyric: 'i' },
            { pitch: 'e/4', duration: '8', lyric: 'ly', chord: 'F' },
            { pitch: 'c/4', duration: 'qd', lyric: 'hide' },
          ],
          bass: [
            { pitch: 'f#/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'I', chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: "don't" },
            { pitch: 'e/4', duration: '8', lyric: 'have' },
            { pitch: 'f/4', duration: '8', lyric: 'much' },
            { pitch: 'g/4', duration: 'q', lyric: 'mon', chord: 'G' },
            { pitch: 'f/4', duration: 'q', lyric: 'ey' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'but', chord: 'E' },
            { pitch: 'd/4', duration: 'q', lyric: 'if' },
            { pitch: 'c/4', duration: 'q', lyric: 'I' },
            { pitch: 'd/4', duration: 'q', lyric: 'did', chord: 'Am' },
          ],
          bass: [
            { pitch: 'e/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: "I'd", chord: 'C' },
            { pitch: 'f/4', duration: '8', lyric: 'buy' },
            { pitch: 'g/4', duration: '8', lyric: 'a' },
            { pitch: 'a/4', duration: '8', lyric: 'big' },
            { pitch: 'g/4', duration: 'q', lyric: 'house', chord: 'Dm7' },
            { pitch: 'e/4', duration: 'q', lyric: 'where we' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'both', chord: 'F' },
            { pitch: 'd/4', duration: 'q', lyric: 'could' },
            { pitch: 'c/4', duration: 'h', lyric: 'live', chord: 'G' },
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
            { pitch: 'e/4', duration: '8', lyric: 'If', chord: 'C' },
            { pitch: 'e/4', duration: '8', lyric: 'I' },
            { pitch: 'f/4', duration: '8', lyric: 'was' },
            { pitch: 'g/4', duration: '8', lyric: 'a' },
            { pitch: 'a/4', duration: 'q', lyric: 'sculp', chord: 'Fmaj7' },
            { pitch: 'g/4', duration: 'q', lyric: 'tor, but' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'then', chord: 'G' },
            { pitch: 'd/4', duration: 'q', lyric: 'a' },
            { pitch: 'c/4', duration: 'q', lyric: 'gain', chord: 'Em' },
            { pitch: 'c/4', duration: 'q', lyric: 'no' },
          ],
          bass: [
            { pitch: 'g/4', duration: 'h' },
            { pitch: 'e/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'Or', chord: 'Am' },
            { pitch: 'e/4', duration: '8', lyric: 'a' },
            { pitch: 'f/4', duration: '8', lyric: 'man' },
            { pitch: 'g/4', duration: '8', lyric: 'who' },
            { pitch: 'a/4', duration: 'q', lyric: 'makes', chord: 'Am/G' },
            { pitch: 'g/4', duration: 'q', lyric: 'po' },
          ],
          bass: [
            { pitch: 'a/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: '-tions in a', chord: 'Am/F#' },
            { pitch: 'e/4', duration: 'q', lyric: "trav'ling", chord: 'F' },
            { pitch: 'd/4', duration: 'h', lyric: 'show' },
          ],
          bass: [
            { pitch: 'f#/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'I', chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: 'know' },
            { pitch: 'e/4', duration: '8', lyric: "it's" },
            { pitch: 'f/4', duration: '8', lyric: 'not' },
            { pitch: 'g/4', duration: 'q', lyric: 'much', chord: 'G' },
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
            { pitch: 'd/4', duration: 'q', lyric: 'best', chord: 'E' },
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
            { pitch: 'c/4', duration: 'hd', lyric: 'do', chord: 'Am' },
          ],
          bass: [{ pitch: 'a/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'c/4', duration: '8', lyric: 'My', chord: 'C' },
            { pitch: 'e/4', duration: '8', lyric: 'gift' },
            { pitch: 'f/4', duration: '8', lyric: 'is' },
            { pitch: 'g/4', duration: '8', lyric: 'my' },
            { pitch: 'a/4', duration: 'q', lyric: 'song', chord: 'Dm7' },
            { pitch: 'g/4', duration: 'q', lyric: 'and this' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'd/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: "one's", chord: 'F' },
            { pitch: 'e/4', duration: 'q', lyric: 'for' },
            { pitch: 'c/4', duration: 'h', lyric: 'you', chord: 'G' },
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
            { pitch: 'f/4', duration: '8', lyric: 'And', chord: 'G' },
            { pitch: 'e/4', duration: '8', lyric: 'you' },
            { pitch: 'f/4', duration: '8', lyric: 'can' },
            { pitch: 'g/4', duration: '8', lyric: 'tell' },
            { pitch: 'a/4', duration: '8', lyric: 'ev' },
            { pitch: 'g/4', duration: '8', lyric: 'ry' },
            { pitch: 'f/4', duration: '8', lyric: 'bo', chord: 'Am' },
            { pitch: 'e/4', duration: '8', lyric: 'dy' },
          ],
          bass: [
            { pitch: 'g/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'this', chord: 'Dm7' },
            { pitch: 'g/4', duration: '8', lyric: 'is' },
            { pitch: 'a/4', duration: 'q', lyric: 'your' },
            { pitch: 'g/4', duration: 'h', lyric: 'song', chord: 'F' },
          ],
          bass: [
            { pitch: 'd/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: '8', lyric: 'It', chord: 'G/B' },
            { pitch: 'e/4', duration: '8', lyric: 'may' },
            { pitch: 'f/4', duration: '8', lyric: 'be' },
            { pitch: 'g/4', duration: '8', lyric: 'quite' },
            { pitch: 'a/4', duration: '8', lyric: 'sim' },
            { pitch: 'g/4', duration: '8', lyric: 'ple' },
            { pitch: 'f/4', duration: 'q', lyric: 'but', chord: 'Am' },
          ],
          bass: [
            { pitch: 'b/4', duration: 'h' },
            { pitch: 'a/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'now', chord: 'Dm7' },
            { pitch: 'f/4', duration: '8', lyric: 'that' },
            { pitch: 'g/4', duration: 'q', lyric: "it's" },
            { pitch: 'f/4', duration: 'h', lyric: 'done', chord: 'F' },
          ],
          bass: [
            { pitch: 'd/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'I', chord: 'Am' },
            { pitch: 'e/4', duration: 'q', lyric: 'hope' },
            { pitch: 'f/4', duration: 'q', lyric: 'you' },
            { pitch: 'g/4', duration: 'q', lyric: "don't" },
          ],
          bass: [{ pitch: 'a/4', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'mind,', chord: 'Am/G' },
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
            { pitch: 'd/4', duration: '8', lyric: 'That', chord: 'Am/F#' },
            { pitch: 'd/4', duration: '8', lyric: 'I' },
            { pitch: 'e/4', duration: '8', lyric: 'put' },
            { pitch: 'f/4', duration: '8', lyric: 'down' },
            { pitch: 'e/4', duration: '8', lyric: 'in' },
            { pitch: 'f/4', duration: 'q', lyric: 'words', chord: 'F6' },
            { pitch: 'g/4', duration: '8', lyric: 'how', chord: 'C' },
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
            { pitch: 'f/4', duration: 'q', lyric: 'life', chord: 'F6' },
            { pitch: 'g/4', duration: 'q', lyric: 'is' },
          ],
          bass: [
            { pitch: 'c/4', duration: 'h' },
            { pitch: 'f/4', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'while', chord: 'F' },
            { pitch: 'e/4', duration: 'q', lyric: "you're" },
            { pitch: 'd/4', duration: '8', lyric: 'in', chord: 'G' },
            { pitch: 'd/4', duration: '8', lyric: 'the', chord: 'Gsus4' },
            { pitch: 'c/4', duration: 'q', lyric: 'world', chord: 'G' },
          ],
          bass: [
            { pitch: 'f/4', duration: 'h' },
            { pitch: 'g/4', duration: 'h' },
          ],
        },
        {
          melody: [{ pitch: 'c/4', duration: 'w', rest: true, chord: 'C' }],
          bass: [{ pitch: 'c/4', duration: 'w' }],
        },
      ],
    },
  ],
};
