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
};
