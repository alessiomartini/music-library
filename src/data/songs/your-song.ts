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
  notes:
    'Chords shown "as played" with a capo on the 3rd fret (sounds in Eb). ' +
    'The engraved lead sheet is a draft transcription of the opening phrase only ' +
    '(verify by ear before relying on it); tempo is an approximate indication.',
  sections: [
    {
      label: 'Verse 1',
      lines: [
        "[C]It's a little bit [Dm7]funny, this [C/E]feeling in[F]side",
        "[C]I'm not one of [Dm7]those who can [Am7]easily hide",
        "[Dm7]I don't have much [F]money but [C]boy [G/B]if I [Am7]did",
        "[F]I'd buy a big [C/E]house where we [Dm7]both could [F]live",
      ],
    },
    {
      label: 'Verse 2',
      lines: [
        "[C]If I was a [Dm7]sculptor, but [C/E]then a[F]gain, no",
        "[C]Or a man who [Dm7]makes potions in a [Am7]traveling show",
        "[Dm7]I know it's not [F]much but it's [C]the [G/B]best I can [Am7]do",
        "[F]My gift is my [C/E]song and this [Dm7]one's for [F]you",
      ],
    },
    {
      label: 'Chorus',
      lines: [
        "[F]And you can tell every[C/E]body this is [Dm7]your song",
        "[F]It may be quite simple [C/E]but now that it's [Dm7]done",
        "[F]I hope you don't [G]mind, I hope you don't [Em7]mind [A7]",
        "[Dm7]That I put down in [F]words [C]how [G/B]wonderful [Am7]life is [D7sus4/F#]while you're [Bb/F]in the [F]world [C]",
      ],
    },
  ],
  leadSheet: [
    {
      label: 'Verse 1 (opening)',
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
      ],
    },
  ],
};
