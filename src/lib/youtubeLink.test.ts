import { describe, expect, it } from 'vitest';
import { matchesOriginal, pickOriginal, youtubeLink } from './youtubeLink';

const c = (title: string, channel: string, id = 'abc') => ({ id, title, channel });

describe('youtubeLink', () => {
  it('uses the direct video when known', () => {
    expect(youtubeLink({ s: 'dQw4w9WgXcQ' }, 's', 'T', 'A')).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });
  it('falls back to a search link when absent', () => {
    expect(youtubeLink({}, 's', 'Yesterday', 'The Beatles')).toBe('https://www.youtube.com/results?search_query=Yesterday%20The%20Beatles');
  });
});

describe('matchesOriginal', () => {
  it('accepts the artist channel, Topic and VEVO', () => {
    expect(matchesOriginal(c('Yesterday (Remastered 2009)', 'The Beatles'), 'Yesterday', 'The Beatles')).toBe(true);
    expect(matchesOriginal(c('Yesterday', 'The Beatles - Topic'), 'Yesterday', 'The Beatles')).toBe(true);
    expect(matchesOriginal(c('Hello', 'AdeleVEVO'), 'Hello', 'Adele')).toBe(true);
  });
  it('rejects covers, live, lyrics and wrong artists', () => {
    expect(matchesOriginal(c('Yesterday - cover', 'Someone'), 'Yesterday', 'The Beatles')).toBe(false);
    expect(matchesOriginal(c('The Beatles - Yesterday (Live)', 'The Beatles'), 'Yesterday', 'The Beatles')).toBe(false);
    expect(matchesOriginal(c('Yesterday (Official Lyrics Video)', 'The Beatles'), 'Yesterday', 'The Beatles')).toBe(true);
    expect(matchesOriginal(c('Yesterday lyrics', 'The Beatles'), 'Yesterday', 'The Beatles')).toBe(false);
    expect(matchesOriginal(c('The Beatles - Yesterday', 'A fan'), 'Yesterday', 'The Beatles')).toBe(false);
    expect(matchesOriginal(c('Etta James Performs "At Last" at the 1993 Induction', 'Rock & Roll Hall of Fame'), 'At Last', 'Etta James')).toBe(false);
    expect(matchesOriginal(c('Yesterday', 'Other Band'), 'Yesterday', 'The Beatles')).toBe(false);
    expect(matchesOriginal(c('Tomorrow', 'The Beatles'), 'Yesterday', 'The Beatles')).toBe(false);
  });
  it('accepts official uploads on label channels only with artist and "official" in the title', () => {
    expect(matchesOriginal(c('Rick Astley - Never Gonna Give You Up (Official Music Video)', 'Rhino'), 'Never Gonna Give You Up', 'Rick Astley')).toBe(true);
    expect(matchesOriginal(c('Rick Astley - Never Gonna Give You Up (Official Audio)', 'Defected Records'), 'Never Gonna Give You Up', 'Rick Astley')).toBe(true);
    expect(matchesOriginal(c('Never Gonna Give You Up', 'Rhino'), 'Never Gonna Give You Up', 'Rick Astley')).toBe(false);
    expect(matchesOriginal(c('Rick Astley - Never Gonna Give You Up', 'Rhino'), 'Never Gonna Give You Up', 'Rick Astley')).toBe(false);
    expect(matchesOriginal(c('Official Music Video - Never Gonna Give You Up', 'Rhino'), 'Never Gonna Give You Up', 'Rick Astley')).toBe(false);
    expect(matchesOriginal(c('Rick Astley - Never Gonna Give You Up (Official Live Performance)', 'Rhino'), 'Never Gonna Give You Up', 'Rick Astley')).toBe(false);
    expect(matchesOriginal(c('Rick Astley - Never Gonna Give You Up (Official Cover)', 'Some Fan'), 'Never Gonna Give You Up', 'Rick Astley')).toBe(false);
    expect(matchesOriginal(c('Rick Astley - Never Gonna Give You Up (Official Karaoke)', 'Rhino'), 'Never Gonna Give You Up', 'Rick Astley')).toBe(false);
  });
  it('allows live when the song is live', () => {
    expect(matchesOriginal(c('Live and Let Die', 'Paul McCartney'), 'Live and Let Die', 'Paul McCartney')).toBe(true);
  });
  it('picks the first accepted candidate', () => {
    expect(pickOriginal([c('x', 'y', '1'), c('Yesterday', 'The Beatles', '2')], 'Yesterday', 'The Beatles')?.id).toBe('2');
  });
});
