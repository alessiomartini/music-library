/** Instruments shown as emoji next to a cover. One mapping, used everywhere. */
export type Instrument = 'guitar' | 'piano' | 'violin' | 'drums' | 'voice' | 'sax' | 'ukulele';

export const INSTRUMENTS: Record<Instrument, { emoji: string; label: string }> = {
  guitar: { emoji: '🎸', label: 'guitar' },
  piano: { emoji: '🎹', label: 'piano' },
  violin: { emoji: '🎻', label: 'violin' },
  drums: { emoji: '🥁', label: 'drums' },
  voice: { emoji: '🎤', label: 'voice' },
  sax: { emoji: '🎷', label: 'saxophone' },
  ukulele: { emoji: '🪕', label: 'ukulele' },
};

// Conservative keyword rules: a word must say the instrument outright
// (channel name or note). Nothing is inferred from the artist or the song.
const RULES: [Instrument, RegExp][] = [
  ['guitar', /\b(chitarr\w*|guitars?|12-string|nylon-string)\b/i],
  ['piano', /\b(pianos?|pianoforte)\b/i],
  ['violin', /\b(violin\w*|violino)\b/i],
  ['drums', /\b(drums?|batteria)\b/i],
  ['sax', /\b(sax|saxophone)\b/i],
  ['ukulele', /\bukulele\b/i],
];

/** Instruments named by the performer (channel) and the note of a cover. */
export function inferInstruments(...texts: (string | undefined)[]): Instrument[] {
  const text = texts.filter(Boolean).join(' ');
  return RULES.filter(([, re]) => re.test(text)).map(([i]) => i);
}
