import type { Song } from '../../lib/types';

export const something: Song = {
  slug: 'something',
  title: 'Something',
  artist: 'The Beatles',
  composer: 'George Harrison',
  originalKey: 'C',
  timeSignature: '4/4',
  tempoBpm: 66,
  tempoMarking: 'Slowly',
  links: {
    spotify: 'https://open.spotify.com/search/Something%20The%20Beatles',
    youtube: 'https://www.youtube.com/watch?v=UelDrZ1aFeY',
  },
  history:
    "George Harrison's most celebrated Beatles composition, and the only Harrison song released as a Beatles " +
    "A-side single (from Abbey Road, 1969). Frank Sinatra called it \"the greatest love song of the past fifty " +
    'years" and performed it often — though he long, mistakenly, introduced it as a Lennon–McCartney song.',
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
            { duration: 'q', lyric: 'Some', chord: 'C' },
            { duration: '8', lyric: 'thing' },
            { duration: '8', lyric: 'in' },
            { duration: 'q', lyric: 'the' },
            { duration: 'q', lyric: 'way', chord: 'Cmaj7' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'she' },
            { duration: 'hd', lyric: 'moves', chord: 'C7' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'At', chord: 'D7' },
            { duration: '8', lyric: 'tracts' },
            { duration: 'q', lyric: 'me' },
            { duration: 'q', lyric: 'like', chord: 'D7/F#' },
            { duration: 'q', lyric: 'no' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'oth', chord: 'G' },
            { duration: 'q', lyric: 'er' },
            { duration: 'q', lyric: 'lov', chord: 'Gaug' },
            { duration: 'q', lyric: 'er' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'Some', chord: 'C' },
            { duration: '8', lyric: 'thing' },
            { duration: '8', lyric: 'in' },
            { duration: 'q', lyric: 'the' },
            { duration: 'q', lyric: 'way', chord: 'Cmaj7' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'she' },
            { duration: 'q', lyric: 'woos', chord: 'C7' },
            { duration: 'h', lyric: 'me', chord: 'F' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'I', chord: 'D7' },
            { duration: '8', lyric: "don't" },
            { duration: '8', lyric: 'want' },
            { duration: '8', lyric: 'to' },
            { duration: 'q', lyric: 'leave', chord: 'D7/F#' },
            { duration: 'q', lyric: 'her' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'now', chord: 'G' },
            { duration: 'hd', rest: true, chord: 'Gaug' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'You', chord: 'C' },
            { duration: '8', lyric: 'know' },
            { duration: '8', lyric: 'I' },
            { duration: '8', lyric: 'be' },
            { duration: 'q', lyric: 'lieve', chord: 'Cmaj7' },
            { duration: 'q', lyric: 'and' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'how', chord: 'C7' },
            { duration: 'q', rest: true, chord: 'F' },
            { duration: 'h', rest: true, chord: 'F6' },
          ],
        },
      ],
    },
    {
      label: 'Bridge',
      measures: [
        {
          melody: [
            { duration: '8', lyric: 'Some', chord: 'A' },
            { duration: '8', lyric: 'where' },
            { duration: '8', lyric: 'in' },
            { duration: '8', lyric: 'her' },
            { duration: 'q', lyric: 'smile', chord: 'D' },
            { duration: 'q', lyric: 'she' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'knows' },
            { duration: 'q', lyric: 'that', chord: 'Bm' },
            { duration: 'q', lyric: 'I' },
            { duration: 'q', lyric: "don't" },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'need', chord: 'E7' },
            { duration: '8', lyric: 'no' },
            { duration: '8', lyric: 'oth' },
            { duration: '8', lyric: 'er' },
            { duration: 'q', lyric: 'lov' },
            { duration: 'q', lyric: 'er' },
          ],
        },
        {
          melody: [
            { duration: '8', lyric: 'Some', chord: 'A' },
            { duration: '8', lyric: 'thing' },
            { duration: '8', lyric: 'in' },
            { duration: '8', lyric: 'her' },
            { duration: 'q', lyric: 'style', chord: 'D' },
            { duration: 'q', lyric: 'that' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'shows' },
            { duration: 'h', lyric: 'me', chord: 'Am7' },
            { duration: 'q', rest: true, chord: 'D7' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { duration: 'q', lyric: "You're", chord: 'C' },
            { duration: '8', lyric: 'ask' },
            { duration: '8', lyric: 'ing' },
            { duration: 'q', lyric: 'me', chord: 'Cmaj7' },
            { duration: 'q', lyric: 'will' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'my' },
            { duration: 'q', lyric: 'love', chord: 'C7' },
            { duration: 'h', lyric: 'grow', chord: 'F' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'I', chord: 'D7' },
            { duration: 'h', lyric: "don't" },
            { duration: 'q', lyric: 'know,', chord: 'D7/F#' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'I' },
            { duration: 'q', lyric: "don't", chord: 'G' },
            { duration: 'h', lyric: 'know', chord: 'Gaug' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'You', chord: 'C' },
            { duration: '8', lyric: 'stick' },
            { duration: '8', lyric: 'a' },
            { duration: 'q', lyric: 'round', chord: 'Cmaj7' },
            { duration: 'q', lyric: 'now' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'it' },
            { duration: 'q', lyric: 'may', chord: 'C7' },
            { duration: 'h', lyric: 'show', chord: 'F' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'I', chord: 'D7' },
            { duration: 'h', lyric: "don't" },
            { duration: 'q', lyric: 'know,', chord: 'D7/F#' },
          ],
        },
        {
          melody: [
            { duration: 'q', lyric: 'I' },
            { duration: 'q', lyric: "don't", chord: 'G' },
            { duration: 'h', lyric: 'know', chord: 'Gaug' },
          ],
        },
      ],
    },
  ],
};
