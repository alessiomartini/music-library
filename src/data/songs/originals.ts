import type { Song } from '../../lib/types';

/**
 * Hand-checked corrections of who recorded a song first, applied on top of every
 * import (src/data/songs/index.ts). A song imported from Spotify takes the artist of
 * the liked recording, which can be a cover: here it gets the original artist and
 * recording (the liked one stays among the versions) and its translated versions.
 */
export const originals: Record<string, Partial<Song>> = {
  'prince-ali': {
    artist: 'Robin Williams',
    composer: 'Alan Menken, Howard Ashman',
    year: 1992,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273d6cfbe6229dc73b8f6773196',
    links: { spotify: 'https://open.spotify.com/track/6q2r0n2ph4w2p7fLbh5TKK' },
    translations: [
      { language: 'it', title: 'Il principe Alì', artist: 'Gigi Proietti', spotify: 'https://open.spotify.com/track/4Y6xHMJ3B5u07aOJN7aknC' },
    ],
  },
  'tutti-quanti-voglion-fare-il-jazz': {
    title: "Ev'rybody Wants to Be a Cat",
    artist: 'Phil Harris, Scatman Crothers',
    composer: 'Floyd Huddleston, Al Rinker',
    year: 1970,
    links: { spotify: 'https://open.spotify.com/track/2dAOKHKapOngJv8sMI8GGZ' },
    translations: [
      { language: 'it', title: 'Tutti quanti voglion fare jazz', artist: 'Gli Aristogatti, cast italiano', spotify: 'https://open.spotify.com/track/4tH4bnfPsSWTpzqV0ux4IQ' },
    ],
  },
  'dream-a-little-dream-of-me': {
    // Jazz standard: first recorded by Ozzie Nelson and his Orchestra (1931), before Ella
    // Fitzgerald & Louis Armstrong (1950) and The Mamas & the Papas (1968).
    artist: 'Ozzie Nelson',
    standard: true,
    composer: 'Fabian Andre, Wilbur Schwandt, Gus Kahn',
    year: 1931,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b27335615e2dd4b391098c3b13e0',
    links: { spotify: 'https://open.spotify.com/track/79APCLkgANxex7RrcLpPvs' },
  },
  '7000-caffe': {
    artist: 'Alex Britti',
    year: 2003,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b27307c69a6565cedce2afcec106',
    links: { spotify: 'https://open.spotify.com/track/1GP4fEnrraiQqSplIi8i4E' },
  },
  'ci-vuole-un-fisico-bestiale': {
    // Neri per Caso: cover (they mostly record covers).
    artist: 'Luca Carboni',
    year: 1991,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b2737b82ffc475bc2651229b924f',
    links: { spotify: 'https://open.spotify.com/track/4FW2zzZcmS4GK5GznpYUyV' },
  },
  'con-la-mani': {
    title: 'Con le mani',
    artist: 'Zucchero',
    year: 1987,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b2739e13cf9336b920a70a8be639',
    links: { spotify: 'https://open.spotify.com/track/6YyvSHhRZFaoE04mwkw5cY' },
  },
  'je-so-pazzo': {
    artist: 'Pino Daniele',
    year: 1979,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b2738e294353ae08999f295ef9e6',
    links: { spotify: 'https://open.spotify.com/track/3QDZ1rWJBMCu9ptRVkPQUa' },
  },
  'via-con-me': {
    artist: 'Paolo Conte',
    year: 1981,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b27335737e351a0d474459d5ee74',
    links: { spotify: 'https://open.spotify.com/track/2P2rhs7AtvqUzerhAZDbNu' },
  },
  'senza-fine': {
    artist: 'Gino Paoli',
    year: 1961,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273732342705698fda3b008afd2',
    links: { spotify: 'https://open.spotify.com/track/2gmEnlP6D1LhpwwjUhKhxP' },
  },
  'luz-negra': {
    // Stefano Bollani: cover.
    artist: 'Nelson Cavaquinho',
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273db63a8d00abe60a80e8f15af',
    links: { spotify: 'https://open.spotify.com/track/4T2BMaxfT3ghpyCIQM0esz' },
  },
  'crudelia-de-mon': {
    title: 'Cruella De Vil',
    artist: 'Bill Lee',
    composer: 'Mel Leven',
    year: 1961,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b2739734b880ec5742822e49db80',
    links: { spotify: 'https://open.spotify.com/track/2tkIIkF3CPqsmYhsncNEGN' },
    translations: [
      { language: 'it', title: 'Crudelia De Mon', artist: 'La carica dei 101, versione italiana' },
    ],
  },
  'siamo-tuoi-amici': {
    title: "That's What Friends Are For (The Vulture Song)",
    artist: 'The Jungle Book cast',
    composer: 'Richard M. Sherman, Robert B. Sherman',
    year: 1967,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273d897c1143b832479966b407d',
    links: { spotify: 'https://open.spotify.com/track/35mtjM30xXExEbkEj3z1a0' },
    translations: [
      { language: 'it', title: 'Siamo tuoi amici', artist: 'Luigi Pavese', spotify: 'https://open.spotify.com/track/45ZpsNrZrZa3xrpibhzlZv' },
    ],
  },
  'sweet-home-chicago': {
    // The Blues Brothers: cover.
    artist: 'Robert Johnson',
    year: 1936,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b2731dbb341963b1e8bd7eb57885',
    links: { spotify: 'https://open.spotify.com/track/2wPHe2ecCdkT0ly0km12g4' },
  },
  'hallelujah': {
    // Jeff Buckley: cover (1994).
    artist: 'Leonard Cohen',
    year: 1984,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b2731324dce973eaebfe380d73a5',
    links: { spotify: 'https://open.spotify.com/track/7yzbimr8WVyAtBX3Eg6UL9' },
  },
  'i-say-a-little-prayer': {
    // Aretha Franklin: cover (1968).
    artist: 'Dionne Warwick',
    year: 1967,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273f881362541025be2ec0ffb20',
    links: { spotify: 'https://open.spotify.com/track/05XkMS2YVNfPNXepMScPRJ' },
  },
  'cry-baby': {
    // Janis Joplin: cover (1971).
    artist: 'Garnet Mimms & The Enchanters',
    year: 1963,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b2735f6d8d7ad64a419468941dac',
    links: { spotify: 'https://open.spotify.com/track/5G0yErsdIKfplod526gygr' },
  },
  'genova-per-noi': {
    // Written by Paolo Conte, first recorded by Bruno Lauzi.
    artist: 'Bruno Lauzi',
    year: 1975,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273754cd9eae242c3ddbd8c7ad4',
    links: { spotify: 'https://open.spotify.com/track/4xrsuV5Ch3yfjDHLfGAbUT' },
  },
  'how-long-will-i-love-you': {
    // Ellie Goulding: cover (2013).
    artist: 'The Waterboys',
    year: 1990,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273c030614083e1c32b834383b4',
    links: { spotify: 'https://open.spotify.com/track/0wXUUVBlu7BIJTkdRY4eOk' },
  },
  'torn': {
    // Natalie Imbruglia: cover (1997).
    artist: 'Ednaswap',
    year: 1995,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273f761450df60207bdf0b65038',
    links: { spotify: 'https://open.spotify.com/track/3Ko0HG4tuWVE7Q9do59z4m' },
  },
  'oye-como-va': {
    // Santana: cover (1970).
    artist: 'Tito Puente',
    year: 1962,
    albumImage: 'https://i.scdn.co/image/ab67616d0000b273cd3bc05eb8cea8fa7d10fcf5',
    links: { spotify: 'https://open.spotify.com/track/73uEbChpBB29ttwVnwuNVE' },
  },
  // Jazz standards recorded by a later artist: the composer stands for the song, as for Autumn Leaves.
  'georgia-on-my-mind': { artist: 'Hoagy Carmichael' },
  'smoke-gets-in-your-eyes': { artist: 'Jerome Kern' },
  'fly-me-to-the-moon': { artist: 'Bart Howard' },
  'all-the-things-you-are': { artist: 'Jerome Kern' },
  'brazil': { artist: 'Ary Barroso' },
  'manha-de-carnaval': { artist: 'Luiz Bonfá' },
  'summertime': { artist: 'George Gershwin' },
  // Same title as a standard in Wikipedia's lists, but a different song.
  swing: { standard: false },
};
