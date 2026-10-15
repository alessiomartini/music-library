import type { Song } from './types';

const query = (song: Song) => encodeURIComponent(`${song.title} ${song.artist}`);

export const accordiESpartitiUrl = (song: Song) =>
  song.links.accordiESpartiti ?? `https://www.accordiespartiti.it/?s=${encodeURIComponent(song.title)}`;

export const ultimateGuitarUrl = (song: Song) =>
  song.links.ultimateGuitar ??
  `https://www.ultimate-guitar.com/search.php?search_type=title&value=${query(song)}`;
