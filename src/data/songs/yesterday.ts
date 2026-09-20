import type { Song } from '../../lib/types';

export const yesterday: Song = {
  slug: 'yesterday',
  title: 'Yesterday',
  artist: 'The Beatles',
  composer: 'Lennon–McCartney',
  originalKey: 'F',
  // Not a capo: McCartney tuned the whole guitar down a tone and fingered
  // the song in G, which is why it sounds in F.
  tuning: 'Down a whole step (D G C F A D) — fingered in G, sounds in F',
  timeSignature: '4/4',
  tempoBpm: 96,
  tempoMarking: 'Slowly',
  links: {
    spotify: 'https://open.spotify.com/search/Yesterday%20The%20Beatles',
    youtube: 'https://www.youtube.com/watch?v=U6bftfiTums',
  },
  history:
    "Paul McCartney reportedly woke up with the entire melody in his head and worried he'd subconsciously " +
    'copied it from somewhere; he first sang it with placeholder lyrics ("Scrambled eggs..."). It is the only ' +
    'Beatles recording made by a single band member (McCartney, with a string quartet), and holds the Guinness ' +
    'World Record for the most-covered song in history.',
};
