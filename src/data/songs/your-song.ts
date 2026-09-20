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
    'The score (melody, lyrics, and harmony) was transcribed from the original recording through an ' +
    'audio-first pipeline — source separation, automatic melody and harmony extraction — and is not yet ' +
    'checked against a published edition. Treat pitches and chords as a close but unverified transcription.',
};
