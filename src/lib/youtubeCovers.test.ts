import { describe, expect, it } from 'vitest';
import { attachYoutubeCovers } from './youtubeCovers';
import type { Song } from './types';

const song = (slug: string, title: string, artist: string): Song => ({ slug, title, artist, links: {} });

describe('attachYoutubeCovers', () => {
  const library = [song('creep', 'Creep', 'Radiohead'), song('estate', 'Estate', 'Bruno Martino'), song('estate-jovanotti', 'Estate', 'Jovanotti')];

  it('attaches by title and artist', () => {
    const { songs, added } = attachYoutubeCovers(library, [
      { id: 'a', by: 'Allie Sherlock', song: 'Creep', artist: 'Radiohead' },
      { id: 'b', by: 'X', song: 'Estate', artist: 'Jovanotti' },
    ]);
    expect(added).toHaveLength(0);
    expect(songs[0].links.youtubeVersions?.[0]).toEqual({ url: 'https://www.youtube.com/watch?v=a', artist: 'Allie Sherlock' });
    expect(songs[2].links.youtubeVersions).toHaveLength(1);
    expect(songs[1].links.youtubeVersions).toBeUndefined();
  });

  it('creates one new song per title and artist', () => {
    const { added } = attachYoutubeCovers(library, [
      { id: 'a', by: 'A', song: 'Layla', artist: 'Derek and the Dominos' },
      { id: 'b', by: 'B', song: 'Layla', artist: 'Derek and the Dominos' },
      { id: 'c', by: 'C', song: 'Creep', artist: 'Stone Temple Pilots' },
    ]);
    // A different song with a library title gets its own entry.
    expect(added.map((s) => s.slug)).toEqual(['layla', 'creep-stone-temple-pilots']);
    expect(added[0].links.youtubeVersions).toHaveLength(2);
  });
});
