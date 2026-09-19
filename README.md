# Song Library

`music-library` is a static personal song library with a chord-and-lyrics-oriented
lead-sheet-style representation. It provides song metadata, chord symbols,
lyrics, meter, tempo, transposition controls, and browser-local notes and
preferences.

## Current Features

- Song metadata including title, artist, composer, key, capo/tuning, meter,
  tempo, history, and notes where provided.
- Chord symbols and lyric text arranged by section and measure.
- An HTML/CSS `LeadSheetChart` that spaces chart entries according to duration
  codes.
- Italian or English chord notation.
- Chromatic transposition of chord symbols and the displayed key, including
  slash-bass chord notation.
- A manually selected preferred singing key with an optional note.
- External Spotify, YouTube, and sheet-music links where present in a song's
  data.
- Browser-local site-improvement notes.
- Light/dark appearance support through the user's system color preference.

## Current Limitations

The current lead-sheet representation stores mainly duration codes, rests,
lyrics, and chord symbols. `LeadSheetNote` does not contain real melody pitch,
and the application does not currently represent independent bass or
instrumental parts.

`LeadSheetChart` is an HTML/CSS chart, not a true engraved staff notation
renderer. The project does not currently use VexFlow or MusicXML in the
application. It does not provide automatic vocal-range analysis, pitch
distribution analysis, automatic key recommendation, or embedded recording and
cover players.

The current musical data is partly preliminary. Some charts are explicitly
written from memory, melodies are deliberately omitted, tempos are approximate,
and data may be incomplete or require verification against a published source
or by ear. The current representation is not intended to claim a complete,
verified transcription.

## Song Data

Songs are currently defined as TypeScript constants in:

```text
src/data/songs/
```

The current collection is assembled in:

```text
src/data/songs/index.ts
```

To add a song, create a TypeScript data file following the existing `Song`
structure, export the song, and add it to the `songs` array in
`src/data/songs/index.ts`. The current repository contains five songs.

## Persistence

The application has no backend or database. Browser-local preferences and
notes are stored in `localStorage`, including chord notation preference,
per-song transposition and preferred-key notes, and site-improvement notes.
This data is local to one browser profile and is not synchronized between
devices or users.

## Future Architecture

The project is planned to evolve from the current chord-and-lyrics chart into
a symbolic lead-sheet/score system. Planned directions include normalized JSON
score assets, real pitched melody notes, multiple musical parts, an independent
timed harmony layer on a shared musical timeline, proper score rendering,
complete-score transposition, vocal-range and pitch-distribution analysis,
user-specific vocal-range-based key recommendation, and one selected original
recording plus multiple selected covers with embedded media where supported.

The future offline workflow is conceptually:

```text
offline:
MIDI / MP3
  -> transcription / curation
  -> MusicXML
  -> normalized JSON

web:
JSON
  -> application Score
  -> rendering / transposition / analysis
```

MusicXML is planned as a local/offline authoring and interchange format, not
the runtime or published score format for the web application. These are
planned features, not current implementation. See
[Future Architecture](docs/FUTURE-ARCHITECTURE.md) for the detailed design and
roadmap.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Validation

```bash
npm run lint
npm run validate
```
