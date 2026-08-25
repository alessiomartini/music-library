# Song Library

Personal song library in lead-sheet form (Real Book / fake-book style): melody on the
staff, chord symbols, a simple bass line, lyrics, meter, tempo, vocal range, and links
to Spotify/YouTube.

## Features

- Lyrics with chords aligned above the syllables (full song text).
- An engraved lead-sheet excerpt: melody + chord symbols + bass line on a grand staff
  (VexFlow), with the song's meter and tempo marking.
- Chord notation system selectable: Italian (Do Re Mi...) or English (C D E...).
- Real-time transposition (chords, key label, and the engraved melody/bass all move
  together).
- Vocal range (lowest–highest note), computed from the transcribed excerpt.
- Spotify and YouTube links per song.
- Preferred key to sing each song in, with a free-form note, saved in the browser.
- A "site improvement notes" box to jot down ideas/bugs, saved in the browser.

Songs are defined in `src/data/songs/`. To add one, create a file following the
existing ones and export it from `src/data/songs/index.ts`.

The engraved lead sheet only covers the opening phrase of each song (a draft
transcription to verify/complete by ear) — tempo is an approximate indication, and the
vocal range reflects only that excerpt. Full lyrics and chords are given below it. Key
preferences and feedback notes live only in the browser's `localStorage`, not on a
server.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
