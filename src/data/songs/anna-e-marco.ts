import type { Song } from '../../lib/types';

export const annaEMarco: Song = {
  slug: 'anna-e-marco',
  title: 'Anna e Marco',
  artist: 'Lucio Dalla',
  composer: 'Lucio Dalla',
  originalKey: 'Bb',
  timeSignature: '4/4',
  tempoBpm: 120,
  links: {},
  notes:
    'The score (melody, lyrics, and harmony) was transcribed through the MIDI-first offline pipeline: ' +
    'notes and per-syllable lyric timing come directly from a karaoke-style source MIDI (no audio, no ML ' +
    'transcription) — see docs/FUTURE-ARCHITECTURE.md. Key, tempo, and chord qualities are a first automatic ' +
    'pass and have not been checked against a published edition or by ear against the recording yet.',
};
