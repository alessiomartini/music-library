import { describe, expect, it } from 'vitest';
import { photoForYear, type ArtistPhoto } from './artist';

const p = (year: number | undefined, main = false): ArtistPhoto => ({ url: `u${year}`, page: `p${year}`, year, credit: '', license: '', main });

describe('photoForYear', () => {
  it('picks the dated photo closest to the song year', () => {
    expect(photoForYear([p(undefined, true), p(1970), p(1985), p(2001)], 1983)?.year).toBe(1985);
  });
  it('falls back to the main image without a year or dated photos', () => {
    expect(photoForYear([p(1970), p(undefined, true)])?.main).toBe(true);
    expect(photoForYear([p(undefined, true)], 1990)?.main).toBe(true);
    expect(photoForYear([], 1990)).toBeUndefined();
  });
});
