import type { Song } from '../../lib/types';

export const blackbird: Song = {
  slug: 'blackbird',
  title: 'Blackbird',
  artist: 'The Beatles',
  composer: 'Lennon–McCartney',
  originalKey: 'G',
  timeSignature: '4/4',
  tempoBpm: 96,
  tempoMarking: 'Gently',
  links: {
    spotify: 'https://open.spotify.com/search/Blackbird%20The%20Beatles',
    youtube: 'https://www.youtube.com/watch?v=TxYCG0eZQuc',
  },
  history:
    'Paul McCartney recorded it solo — just voice, acoustic guitar, tapping foot, and a recording of a blackbird — ' +
    'for the White Album (1968). He has said it was inspired by the civil rights movement in the United States, ' +
    'written as an message of hope to a Black woman facing discrimination ("you were only waiting for this ' +
    'moment to arise"). The intricate fingerpicking pattern was influenced by Bach.',
};
