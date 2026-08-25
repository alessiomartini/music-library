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
    'The engraved lead sheet is a best-effort draft transcription of the whole song, from memory ' +
    '(verify by ear before relying on it, especially away from the opening phrase); tempo is an approximate indication.',
  leadSheet: [
    {
      label: 'Verse 1',
      measures: [
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'Some', chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: 'thing' },
            { pitch: 'e/4', duration: '8', lyric: 'in' },
            { pitch: 'g/4', duration: 'q', lyric: 'the' },
            { pitch: 'e/4', duration: 'q', lyric: 'way', chord: 'Cmaj7' },
          ],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'she' },
            { pitch: 'c/4', duration: 'hd', lyric: 'moves', chord: 'C7' },
          ],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'At', chord: 'D7' },
            { pitch: 'e/4', duration: '8', lyric: 'tracts' },
            { pitch: 'f/4', duration: 'q', lyric: 'me' },
            { pitch: 'f#/4', duration: 'q', lyric: 'like', chord: 'D7/F#' },
            { pitch: 'g/4', duration: 'q', lyric: 'no' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'f#/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'oth', chord: 'G' },
            { pitch: 'a/4', duration: 'q', lyric: 'er' },
            { pitch: 'g/4', duration: 'q', lyric: 'lov', chord: 'Gaug' },
            { pitch: 'e/4', duration: 'q', lyric: 'er' },
          ],
          bass: [{ pitch: 'g/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'Some', chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: 'thing' },
            { pitch: 'e/4', duration: '8', lyric: 'in' },
            { pitch: 'g/4', duration: 'q', lyric: 'the' },
            { pitch: 'e/4', duration: 'q', lyric: 'way', chord: 'Cmaj7' },
          ],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'she' },
            { pitch: 'c/4', duration: 'q', lyric: 'woos', chord: 'C7' },
            { pitch: 'c/4', duration: 'h', lyric: 'me', chord: 'F' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: '8', lyric: 'I', chord: 'D7' },
            { pitch: 'e/4', duration: '8', lyric: "don't" },
            { pitch: 'f/4', duration: '8', lyric: 'want' },
            { pitch: 'g/4', duration: '8', lyric: 'to' },
            { pitch: 'f#/4', duration: 'q', lyric: 'leave', chord: 'D7/F#' },
            { pitch: 'g/4', duration: 'q', lyric: 'her' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'f#/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'now', chord: 'G' },
            { pitch: 'g/4', duration: 'hd', rest: true, chord: 'Gaug' },
          ],
          bass: [{ pitch: 'g/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: '8', lyric: 'You', chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: 'know' },
            { pitch: 'e/4', duration: '8', lyric: 'I' },
            { pitch: 'f/4', duration: '8', lyric: 'be' },
            { pitch: 'g/4', duration: 'q', lyric: 'lieve', chord: 'Cmaj7' },
            { pitch: 'f/4', duration: 'q', lyric: 'and' },
          ],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'how', chord: 'C7' },
            { pitch: 'e/4', duration: 'q', rest: true, chord: 'F' },
            { pitch: 'e/4', duration: 'h', rest: true, chord: 'F6' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'q' },
            { pitch: 'f/3', duration: 'hd' },
          ],
        },
      ],
    },
    {
      label: 'Bridge',
      measures: [
        {
          melody: [
            { pitch: 'a/4', duration: '8', lyric: 'Some', chord: 'A' },
            { pitch: 'b/4', duration: '8', lyric: 'where' },
            { pitch: 'c#/5', duration: '8', lyric: 'in' },
            { pitch: 'b/4', duration: '8', lyric: 'her' },
            { pitch: 'a/4', duration: 'q', lyric: 'smile', chord: 'D' },
            { pitch: 'g/4', duration: 'q', lyric: 'she' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'd/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'knows' },
            { pitch: 'e/4', duration: 'q', lyric: 'that', chord: 'Bm' },
            { pitch: 'd/4', duration: 'q', lyric: 'I' },
            { pitch: 'c/4', duration: 'q', lyric: "don't" },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'b/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'b/4', duration: '8', lyric: 'need', chord: 'E7' },
            { pitch: 'c/5', duration: '8', lyric: 'no' },
            { pitch: 'b/4', duration: '8', lyric: 'oth' },
            { pitch: 'a/4', duration: '8', lyric: 'er' },
            { pitch: 'g/4', duration: 'q', lyric: 'lov' },
            { pitch: 'f/4', duration: 'q', lyric: 'er' },
          ],
          bass: [{ pitch: 'e/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'a/4', duration: '8', lyric: 'Some', chord: 'A' },
            { pitch: 'b/4', duration: '8', lyric: 'thing' },
            { pitch: 'c#/5', duration: '8', lyric: 'in' },
            { pitch: 'b/4', duration: '8', lyric: 'her' },
            { pitch: 'a/4', duration: 'q', lyric: 'style', chord: 'D' },
            { pitch: 'g/4', duration: 'q', lyric: 'that' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'd/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'f/4', duration: 'q', lyric: 'shows' },
            { pitch: 'e/4', duration: 'h', lyric: 'me', chord: 'Am7' },
            { pitch: 'e/4', duration: 'q', rest: true, chord: 'D7' },
          ],
          bass: [
            { pitch: 'a/3', duration: 'h' },
            { pitch: 'd/3', duration: 'h' },
          ],
        },
      ],
    },
    {
      label: 'Verse 2',
      measures: [
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: "You're", chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: 'ask' },
            { pitch: 'e/4', duration: '8', lyric: 'ing' },
            { pitch: 'g/4', duration: 'q', lyric: 'me', chord: 'Cmaj7' },
            { pitch: 'f/4', duration: 'q', lyric: 'will' },
          ],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'my' },
            { pitch: 'd/4', duration: 'q', lyric: 'love', chord: 'C7' },
            { pitch: 'c/4', duration: 'h', lyric: 'grow', chord: 'F' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'I', chord: 'D7' },
            { pitch: 'e/4', duration: 'h', lyric: "don't" },
            { pitch: 'f#/4', duration: 'q', lyric: 'know,', chord: 'D7/F#' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'f#/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'I' },
            { pitch: 'a/4', duration: 'q', lyric: "don't", chord: 'G' },
            { pitch: 'g/4', duration: 'h', lyric: 'know', chord: 'Gaug' },
          ],
          bass: [{ pitch: 'g/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'You', chord: 'C' },
            { pitch: 'd/4', duration: '8', lyric: 'stick' },
            { pitch: 'e/4', duration: '8', lyric: 'a' },
            { pitch: 'g/4', duration: 'q', lyric: 'round', chord: 'Cmaj7' },
            { pitch: 'f/4', duration: 'q', lyric: 'now' },
          ],
          bass: [{ pitch: 'c/3', duration: 'w' }],
        },
        {
          melody: [
            { pitch: 'e/4', duration: 'q', lyric: 'it' },
            { pitch: 'd/4', duration: 'q', lyric: 'may', chord: 'C7' },
            { pitch: 'c/4', duration: 'h', lyric: 'show', chord: 'F' },
          ],
          bass: [
            { pitch: 'c/3', duration: 'h' },
            { pitch: 'f/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'd/4', duration: 'q', lyric: 'I', chord: 'D7' },
            { pitch: 'e/4', duration: 'h', lyric: "don't" },
            { pitch: 'f#/4', duration: 'q', lyric: 'know,', chord: 'D7/F#' },
          ],
          bass: [
            { pitch: 'd/3', duration: 'h' },
            { pitch: 'f#/3', duration: 'h' },
          ],
        },
        {
          melody: [
            { pitch: 'g/4', duration: 'q', lyric: 'I' },
            { pitch: 'a/4', duration: 'q', lyric: "don't", chord: 'G' },
            { pitch: 'g/4', duration: 'h', lyric: 'know', chord: 'Gaug' },
          ],
          bass: [{ pitch: 'g/3', duration: 'w' }],
        },
      ],
    },
  ],
};
