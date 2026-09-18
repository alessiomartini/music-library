# Future Architecture: Symbolic Lead Sheets and Vocal Analysis

## 1. Purpose

This document records the planned evolution of `music-library` from its current
chord-and-text-oriented representation into a real symbolic lead-sheet / score
representation.

The goal is to preserve the current strengths of the application while making
the music data capable of representing:

- real melodic notes;
- multiple musical lines;
- lyrics;
- harmony;
- meter and timing;
- chromatic transposition;
- Italian and English chord notation;
- vocal-range analysis;
- personalized key recommendations;
- reliable rendering of actual notation.

This is a **DESIGN DOCUMENT**, not an implementation specification for the
current codebase. Nothing described as proposed, planned, or future in this
document should be treated as already implemented. The current application
must continue to be described and changed according to the code that actually
exists in the repository.

## 2. Current Project State

### Technology and deployment

The current application is a static client-side web application using:

- React `^19.2.8`;
- React DOM `^19.2.8`;
- TypeScript `~6.0.2`;
- Vite `^8.2.2`;
- React Router DOM `^7.18.2`;
- `oxlint` for linting;
- `esbuild` for bundling the standalone validator.

There is no backend, API, database, authentication system, or server-side
application. Song data is imported into the frontend bundle. Browser-local
preferences are stored in `localStorage`.

`src/main.tsx` uses `HashRouter`. The routes are:

- `/` for the song library;
- `/songs/:slug` for a song page.

Hash routing is appropriate for the current GitHub Pages deployment because it
does not require server-side route rewriting.

Vite is configured with the base path `/music-library/`. The GitHub Actions
workflow in `.github/workflows/deploy.yml` runs on pushes to `main` (and the
currently configured feature branch) and on manual dispatch. It checks out the
repository, installs dependencies with `npm ci`, runs `npm run build`, uploads
`dist` as a Pages artifact, and deploys it with the GitHub Pages deployment
action.

### Current directory structure

The relevant current structure is:

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── FeedbackBox.tsx
│   ├── KeyPreference.tsx
│   ├── LeadSheetChart.tsx
│   └── TransposeControls.tsx
├── data/
│   └── songs/
│       ├── amara-terra-mia.ts
│       ├── blackbird.ts
│       ├── index.ts
│       ├── something.ts
│       ├── yesterday.ts
│       └── your-song.ts
├── lib/
│   ├── prefs.ts
│   ├── storage.ts
│   ├── theory.ts
│   └── types.ts
└── pages/
    ├── Home.tsx
    └── SongPage.tsx

scripts/
└── validate-leadsheets.ts
```

### Current data model

`src/lib/types.ts` defines the current `Song` type. It contains metadata such
as `slug`, `title`, `artist`, optional `composer`, `originalKey`, optional
`capo` and `tuning`, `timeSignature`, `tempoBpm`, optional `tempoMarking`,
external links, optional history, and optional notes.

It optionally contains `leadSheet: LeadSheetSystem[]`. The current nested
types are:

```ts
interface LeadSheetSystem {
  label: string;
  measures: LeadSheetMeasure[];
}

interface LeadSheetMeasure {
  melody: LeadSheetNote[];
}

interface LeadSheetNote {
  duration: string;
  rest?: boolean;
  lyric?: string;
  chord?: string;
}
```

Despite the names used in some comments and documentation, the current
`LeadSheetNote` does **not** store pitch. It stores a duration code, optional
rest flag, optional lyric text, and an optional chord symbol. The current
`LeadSheetMeasure.melody` is therefore a sequence of timed text/rest events,
not a sequence of pitched musical notes. There is no current `bass` field and
no current representation of an independent instrumental line.

The song data currently contains five songs:

- `Your Song` by Elton John;
- `Yesterday` by The Beatles;
- `Blackbird` by The Beatles;
- `Something` by The Beatles;
- `Amara terra mia` by Domenico Modugno.

Their data is stored as TypeScript constants in `src/data/songs/` and collected
by `src/data/songs/index.ts`. A new song currently requires a new data file and
an explicit addition to the `songs` array.

### Current theory utilities

`src/lib/theory.ts` currently owns the music-theory logic used by the UI. It:

- parses English and Italian chord roots;
- accepts common sharp, flat, and double-accidental spellings;
- normalizes note names to chromatic indexes;
- parses slash-bass chords;
- transposes chord roots and slash-bass notes by semitones;
- formats chord roots in English (`C`, `D`, etc.) or Italian (`Do`, `Re`,
  etc.);
- transposes key labels;
- calculates a shortest semitone difference between keys;
- chooses a flat-oriented or sharp-oriented spelling based on a fixed set of
  keys;
- contains helpers for VexFlow-style pitch strings, pitch comparison, and
  human-readable pitch labels.

The pitch helpers exist in the utility module, but the current song data and
renderer do not use them to represent or render actual melody pitches.

### Current pages and components

`Home.tsx` renders the static list of songs and links to each slug.

`SongPage.tsx`:

- resolves a song by route slug;
- displays metadata, optional capo/tuning, key, meter, tempo, history, notes,
  and external links;
- reads per-song and global preferences;
- supports semitone transposition and Italian/English chord display;
- renders `LeadSheetChart` when a lead sheet exists;
- renders `KeyPreference` for a locally saved preferred singing key.

`TransposeControls.tsx` changes the per-song semitone offset and the global
chord notation system. The displayed key is recalculated from the original
key.

`KeyPreference.tsx` lets the user choose a key, calculate a semitone
difference, apply the transposition, and save a free-form note.

`FeedbackBox.tsx` is a browser-local list of site improvement notes. It is
mounted globally by `App.tsx`.

### Current persistence

`src/lib/storage.ts` provides a generic `useLocalStorage` hook. It reads and
writes JSON values and falls back to the initial value if storage is
unavailable or unreadable.

`src/lib/prefs.ts` currently stores:

- global chord notation preference under `global-prefs`;
- per-song semitone offset, preferred key, and note under
  `song-prefs:<slug>`;
- feedback notes under `feedback-notes`.

These values are local to one browser profile. They are not song metadata and
are not synchronized to a server.

### Current rendering

`src/components/LeadSheetChart.tsx` renders sections, measures, and cells as
HTML elements. It uses flex growth derived from duration codes to give longer
events more horizontal space. It displays converted chord text above lyric
text.

The current `LeadSheetChart` is **not a real notation renderer**. It does not
draw a staff, notes, rests, clefs, key signatures, or actual pitched melody.
There is no `vexflow` dependency in `package.json`, and the current component
does not consume MusicXML or a notation document. The README describes an
engraved/VexFlow lead sheet, but that description does not match the current
implementation: the implementation is an HTML/CSS chord-and-lyric chart.

### Current validation

`npm run validate` bundles and runs `scripts/validate-leadsheets.ts`. The
validator currently checks:

- that each song has a lead sheet;
- that a measure is not empty;
- that duration codes are recognized;
- that measure durations add up to the expected number of beats from the
  time signature;
- that lyric fields are not empty strings;
- that a rest does not also contain lyric text;
- that chord strings can be processed by the current chord conversion helper.

The validator reports results per song and exits with a failure code if any
problem is found. It does not validate pitches, staff notation, part
relationships, ties, MusicXML, or independent musical lines because those
concepts are not in the current data model.

### Current limitations

The current design is useful for a lightweight chord/lyric library, but it has
important limitations:

- `LeadSheetNote` has no pitch information;
- harmony is attached directly to a text/melody event;
- there is no independent bass, voice, or instrument part;
- the renderer is not staff notation;
- vocal range cannot be derived from the current data;
- the current song charts are partial and some are explicitly described as
  written from memory or needing verification;
- timing is represented by string duration codes rather than a richer rhythmic
  model;
- there is no MusicXML parser or score asset pipeline;
- the current preferences support a manually selected preferred key, not an
  automatic vocal recommendation;
- the current application does not perform audio transcription or machine
  learning in the browser.

## 3. Problem With the Current Representation

The current representation is effectively:

```text
lyrics/rests with duration + an optional chord label
```

That is sufficient for laying out approximate chord symbols above lyrics, but
it is not a symbolic musical score.

A real score or lead sheet must distinguish between at least:

- musical time and measure structure;
- one or more timed musical parts;
- pitched notes and rests;
- lyrics attached to the vocal line;
- harmony events that may span notes or begin independently;
- instrumental material;
- notation details such as ties, key signatures, and rhythmic interpretation.

The conceptual difference is important:

```text
lyrics + chords + durations
```

describes a presentation-oriented chart, whereas:

```text
pitched events in multiple parts + independent harmony events + timing
```

describes music that can be analyzed, transposed, validated, and rendered as
notation.

Potential material in one song includes:

- a voice melody;
- a bass line;
- an instrumental intro;
- guitar or piano riffs;
- instrumental embellishments;
- chord symbols or other harmony annotations.

These may occur at the same time without belonging to the same logical line.
The current `melody` array cannot represent those relationships cleanly. In
particular, attaching `chord: "Dm7"` to one melody event implies that harmony
starts and belongs to that event. In actual music, a chord can begin between
melody notes, last across several notes, change while a note is held, or be
present during an instrumental passage.

Harmony should therefore be an independent timed layer. A note may coincide
with a harmony event, but it should not own the harmony event as a property.
This gives the future model enough information to represent voice, bass,
instrumental material, and harmony independently while keeping them aligned on
the same musical timeline.

## 4. Proposed Future Architecture

The intended future architecture separates offline music preparation from the
static web application.

### Offline transcription / curation pipeline

```text
MP3 or MIDI
  -> source separation when needed
  -> audio-to-MIDI transcription
  -> quantization / musical interpretation
  -> harmony analysis
  -> MusicXML generation
  -> validation
  -> human correction / curation
  -> final score asset
```

The exact steps depend on whether MIDI is already available. The output of
this process should be a curated symbolic score asset, not an assumption that
an automatic transcription is perfect.

### Web application

```text
MusicXML / score asset
  -> parser / normalization
  -> internal TypeScript score model
  -> transposition
  -> analysis
  -> rendering
```

The web application should remain fully static. Heavy audio transcription,
source separation, and machine-learning inference should not run in the
browser. Python tooling for those tasks should live in a separate project,
repository, or clearly separated tooling environment and should not become
part of the browser bundle.

The frontend should consume prepared score assets and perform lightweight
parsing, normalization, analysis, transposition, and display work.

## 5. Music Representation and File Format

MusicXML is the proposed persistent interchange and score format.

MusicXML is attractive for this project because it can represent:

- real pitches;
- durations;
- measures;
- multiple parts;
- lyrics;
- key signatures;
- time signatures;
- tempo;
- harmony and chord symbols;
- ties and related notation;
- data compatible with established music-notation tools.

MIDI should primarily be treated as an intermediate representation rather than
necessarily the final storage format consumed by the web app. MIDI is useful
for transcription and playback-oriented workflows, but it does not by itself
carry all of the notation and editorial meaning needed for a curated lead
sheet.

The intended conceptual pipeline is:

```text
MIDI
  -> interpreted / quantized musical structure
  -> MusicXML
  -> human correction
  -> final published score
```

MusicXML should not necessarily become the object model used directly
throughout React. It is an interchange and persistence format. The frontend
should likely normalize it into a smaller, stable TypeScript model so that
transposition, analysis, UI state, and rendering adapters do not depend on
every detail of the MusicXML document structure.

## 6. Internal TypeScript Model

The future application should introduce a normalized internal score model.
This is a design proposal, not an implementation of `src/lib/types.ts`.

### Proposed concepts

`Score` would likely contain:

- original key;
- time signature and measure structure;
- tempo;
- parts;
- harmony events;
- metadata;
- possibly source and editorial information.

`ScorePart` would likely contain:

- stable `id`;
- display `name`;
- semantic `role`;
- ordered timed events;
- visibility or display metadata where appropriate.

Potential semantic roles include:

- `voice`;
- `bass`;
- `instrument`;
- `harmony`.

`ScoreNote` would likely contain:

- pitch;
- duration;
- rest state;
- lyric, when applicable;
- tie information;
- timing position or offset;
- any information needed to preserve notation meaning.

`HarmonyEvent` would likely contain:

- time position;
- duration or end position, if needed;
- root;
- chord quality;
- optional slash-bass note;
- any notation-specific interpretation.

The exact names, units, and timing representation remain subject to design
work. The key architectural principle is that musical semantics must be
explicit. A future score should not force a structure such as:

```ts
note.chord = 'Dm7';
```

when the harmony is an independent timed layer. A voice note, a bass note, an
instrumental note, and a harmony event can align in time without being
properties of one another.

The internal model must remain compatible with the current chord features:

- Italian and English chord notation are display concerns over a normalized
  chord representation;
- sharps and flats must be preserved or deterministically respelled;
- slash chords must remain supported;
- transposition must operate on pitches and harmony consistently.

## 7. Rendering Strategy

The proposed replacement for the current HTML/CSS pseudo-score is a real
MusicXML notation renderer. The current candidate direction is an
OpenSheetMusicDisplay / VexFlow-based solution.

This direction is attractive because it offers:

- MusicXML input;
- real staff notation;
- browser support;
- compatibility with TypeScript and React integration;
- potential styling or selection of individual parts and notes.

The renderer should be treated as an adapter around the normalized score
model, not as the owner of the application's musical semantics. The
application should be able to transpose and analyze a score without depending
on DOM-specific rendering details.

The desired visual distinction is between the voice and instrumental material.
For example:

- the voice should be the visually dominant or default part;
- bass and instrumental material may use distinct visual treatments;
- secondary parts should be possible to show or hide;
- the viewer may eventually offer a simplified lead-sheet view and a more
  complete score view.

Exact colors and styling are not decided here. Existing CSS variables provide
an application palette, but no future part-color contract should be inferred
from those variables until the rendering design is finalized.

## 8. Parts and Musical Roles

The future score model should represent multiple lines with explicit semantic
roles. Possible parts include:

- Voice;
- Bass;
- Piano intro;
- Guitar riff;
- Other instrumental material.

The role should be explicit rather than inferred from the part's position in
the score, track order, or a filename. Explicit roles support consistent
analysis and UI behavior even when a song has a different number or order of
parts.

Possible future UI capabilities include:

- show or hide individual parts;
- emphasize the voice;
- reduce the visual prominence of instrumental embellishments;
- switch between a simplified lead-sheet view and a more complete score view.

These are future possibilities, not current requirements or current
features. The first implementation should avoid adding UI state before the
underlying part semantics are reliable.

## 9. Transposition

The current project already supports chromatic transposition of key labels and
chord symbols. The future architecture must generalize that behavior to the
actual symbolic score.

For a transposition by `n` semitones:

- every pitched note is shifted by `n`;
- harmony roots are shifted by `n`;
- slash-bass notes are shifted by `n`;
- the displayed key is shifted consistently;
- all parts remain aligned in musical time.

This must work for:

- voice;
- bass;
- instrumental lines;
- harmony.

The existing user-visible behavior should be preserved:

- Italian chord notation;
- English chord notation;
- sharps and flats;
- slash chords;
- sensible enharmonic spelling.

`src/lib/theory.ts` should be reused and extended rather than replaced by
duplicated music logic. The future design may split responsibilities into
more focused modules, but there should remain one coherent source of truth for
pitch indexes, chord parsing, spelling, and transposition rules.

Transposition should operate on a normalized score before rendering and
analysis. Vocal-range calculations and key recommendations must therefore
observe the shifted voice part, not only a separately shifted display label.

## 10. Vocal Range and Vocal Distribution

Once the voice part contains real pitches, vocal analysis can be derived from
the score. Potential derived values include:

- lowest sung pitch;
- highest sung pitch;
- vocal range;
- distribution of sung pitches.

A small histogram could visualize the voice's pitch distribution. The
distribution should ideally be duration-weighted rather than based only on
the number of note events. A pitch held for a long time should contribute more
weight than a pitch appearing briefly in a rapid passage.

Conceptually, the weight for a pitch can be proportional to the amount of
singing time spent on that pitch. The exact treatment of ties, repeated notes,
grace notes, and rests must be defined when the symbolic model is designed.

The vocal range should be derived from the score where possible, rather than
manually entered as song metadata. A possible future derived structure is:

```text
vocalAnalysis
  - minPitch
  - maxPitch
  - pitchHistogram
  - totalWeightedDuration
  - other derived statistics, if later useful
```

This structure is proposed only. It must not be added to the current `Song`
type without a corresponding implementation plan and validation strategy.

## 11. User-Specific Vocal Range

The future application should allow a user to provide their own vocal range,
for example:

```text
E2 - Bb4
```

This is a user preference or local profile value, not song metadata. It should
be stored locally in the browser alongside other user-specific preferences,
unless a future product decision introduces an account or synchronization
system.

The design should distinguish between:

- full vocal range;
- comfortable range.

The stated example describes a full range and may include chest and falsetto
registers. No specific comfortable range should be assumed without an
explicit user-provided value or a later product decision.

**OPEN QUESTION:** Should the first version ask only for a full range, or
should the data model already support a separate comfortable range so that the
recommendation algorithm can become more realistic later?

## 12. Automatic Key Recommendation

The planned recommendation feature should evaluate possible chromatic
transpositions using:

- the song's vocal pitch distribution;
- the song's original key;
- the user's vocal range;
- optionally, a future comfortable range.

For each candidate transposition, the conceptual process is:

1. Shift every voice pitch by the candidate number of semitones.
2. Determine which shifted notes are inside the user's allowed range.
3. Assign a cost based on how close frequently sung notes are to the limits of
   the range.
4. Strongly penalize notes outside the user's allowed range.
5. Weight the cost by singing time or pitch frequency.

The intended principle is:

> Frequently sung notes should lie in the singer's comfortable central region,
> while rare or extreme notes may be allowed closer to the edges of the
> maximum range.

This is a conceptual objective, not a final mathematical formula. The
algorithm should not simply minimize the total range, and it should not
require every note to be near the center. It should account for musical
distribution and distinguish common notes from rare extremes.

The recommendation should be transparent to the user. A future UI could show:

- the recommended key;
- the number of semitones of transposition;
- the shifted vocal histogram and range;
- possibly which notes are responsible for the recommendation.

The recommendation must be presented as guidance, not as an opaque or
authoritative answer. The user should be able to inspect and override it.

## 13. Visualization Concept

A possible future `SongPage` flow is:

```text
song metadata
  -> transpose controls
  -> score
  -> vocal-range histogram
  -> recommended key
  -> user vocal profile
  -> history / notes / links
```

The exact layout is not fixed. The important UX principle is that key
recommendation should be explainable visually rather than behaving like a
black box. The user should be able to understand the relationship between
their range, the song's vocal distribution, and the proposed transposition.

Secondary parts may be visible in the score viewer but should not obscure the
voice analysis. The UI should make clear whether a chart is a simplified view
or a more complete score.

## 14. Offline Audio-to-Score Pipeline

The planned Python-based offline tooling is intended to provide a practical
semi-automatic workflow for producing curated score data. It is not intended
to guarantee perfect automatic transcription.

### 14.1 MIDI available

The preferred pipeline is:

```text
MIDI
  -> inspect tracks
  -> identify voice / bass / instrumental material
  -> quantize / clean
  -> derive or verify harmony
  -> MusicXML
  -> manual correction
  -> validation
```

Track identity should be treated as input that may require human inspection.
The pipeline must not assume that a MIDI track order reliably identifies the
voice or bass.

### 14.2 MIDI unavailable

When MIDI is unavailable, the proposed pipeline is:

```text
MP3
  -> source separation
  -> isolated vocals
  -> isolated bass / accompaniment where useful
  -> audio-to-MIDI transcription
  -> quantization / cleanup
  -> alignment
  -> harmony analysis
  -> MusicXML
  -> manual correction
  -> validation
```

The key insight is that source separation should happen **before vocal
transcription** when the goal is to recover a lead melody from a full mixed
recording. The isolated vocal signal is still imperfect, but transcription
quality can be materially different from transcribing a complete mix.

The offline project should output durable, inspectable artifacts and should
make it possible to repeat or improve the workflow without adding its runtime
dependencies to the browser application.

## 15. Candidate Open-Source Tools for the Offline Pipeline

These are candidate tools, not permanently selected dependencies:

- **Demucs**: candidate source-separation tool for producing vocal, bass, and
  accompaniment stems from a mixed recording.
- **Basic Pitch**: candidate audio-to-MIDI transcription tool, particularly
  useful as a starting point for melodic material.
- **MT3 or similar systems**: candidate multi-track or multi-instrument
  transcription systems where more than one line is required.
- **music21**: candidate Python library for symbolic music manipulation,
  inspection, and MIDI/MusicXML conversion.

Automatic transcription quality is expected to be imperfect. These tools may
miss notes, misidentify octaves, produce incorrect rhythms, confuse
instruments, or produce unsuitable harmony. They must therefore be treated as
pipeline components whose output requires inspection, correction, and
validation, not as authoritative score generators.

No tool listed here should be added to the current frontend dependency graph
merely because it appears in this design document.

## 16. Human Curation Is Part of the Workflow

The published score is intended to be a curated symbolic representation, not
necessarily a raw machine transcription.

The expected workflow is:

```text
automatic extraction
  -> inspection
  -> correction
  -> validation
  -> publication
```

The quality of the final score must not depend on the assumption that an
open-source audio transcription system is perfectly accurate. Human review is
part of the data-production process and should remain possible even if the
automatic pipeline changes tools later.

Human correction may include:

- correcting pitches or octaves;
- correcting rhythmic values and quantization;
- assigning lyrics to the correct voice notes;
- identifying or correcting parts;
- correcting harmony and slash-bass notation;
- adding or removing instrumental material;
- checking the final result against a trusted source or by ear.

## 17. Validation

The current validator is intentionally small and validates the current
chord-chart representation. It checks lead-sheet presence, empty measures,
duration codes, measure duration sums, empty lyrics, lyrics on rests, and
chord conversion.

The future validator should evolve to validate the richer symbolic
representation. Potential checks include:

- valid pitches;
- valid durations;
- correct measure lengths;
- consistent timing and offsets;
- legal ties;
- valid parts and unique part identifiers;
- valid harmony events;
- lyrics attached to appropriate vocal notes;
- consistency between key/time-signature metadata and score content;
- transposition-safe representation;
- valid or supported MusicXML structures.

Validation should run both on curated assets and, where practical, on
normalized data generated during the build. It should produce actionable
locations such as song, part, measure, and event rather than only a generic
failure.

These checks are future design goals. They are not present in
`scripts/validate-leadsheets.ts` today.

## 18. Backward Compatibility / Migration Strategy

Migration does not have to be a big-bang rewrite. A staged approach is
possible:

1. Introduce a new score representation without changing every existing song.
2. Convert one song into the new representation as a reference asset.
3. Add parsing, normalization, and validation for the new representation.
4. Support old and new representations temporarily if that reduces migration
   risk.
5. Replace the renderer after enough data has been migrated and verified.
6. Convert existing songs one by one, preserving their metadata and editorial
   notes.
7. Remove the legacy representation only after all required songs and UI paths
   use the new model.

Supporting both representations temporarily may increase code complexity and
requires an explicit compatibility boundary. A direct conversion may be
simpler but makes it harder to isolate errors and compare old and new output.
Existing song data should not be silently rewritten while implementing
unrelated features.

**OPEN QUESTION:** Should the migration use an explicit legacy adapter for
the current `LeadSheetSystem` model, or should all existing songs be converted
before the new score renderer is introduced?

**OPEN QUESTION:** Should old charts remain displayable indefinitely as a
fallback, or should the legacy format have a defined removal milestone?

## 19. Likely Future File / Directory Structure

The following is a possible organization, clearly labeled as **PROPOSED**.
It is not a final list of filenames and should not be implemented merely by
creating empty files.

```text
src/
├── ...
├── components/
│   ├── ScoreViewer.tsx
│   ├── VocalRangeChart.tsx
│   ├── KeyRecommendation.tsx
│   ├── PartVisibilityControls.tsx
│   └── ...
├── data/
│   └── songs/
│       ├── ...
│       └── <song assets>
├── lib/
│   ├── theory.ts
│   ├── score.ts
│   ├── scoreParser.ts
│   ├── transpose.ts
│   ├── vocalAnalysis.ts
│   ├── keyRecommendation.ts
│   └── validation.ts
└── ...
```

Possible song assets could include MusicXML files, normalized JSON generated
from MusicXML, metadata, or a combination. The exact asset boundary depends on
the answers to the open questions below.

An offline project might have a separate structure such as:

```text
offline-score-tools/
├── scripts/
├── pipeline/
├── corrections/
├── generated/
└── README.md
```

This is also only a conceptual proposal. It should not be introduced into the
frontend repository without deciding whether it belongs in this repository or
in a separate repository.

## 20. Open Questions

The following decisions remain unresolved:

1. Is MusicXML the final stored asset format, or should a normalized JSON
   representation also be committed?
2. Should the application parse MusicXML at runtime, or should MusicXML be
   converted into a smaller static JSON asset during build time?
3. How should colors and styles of parts be represented?
4. How much of OpenSheetMusicDisplay should be exposed or customized?
5. How should harmony be represented internally?
6. How should rhythmic quantization be handled?
7. How should tuplets, dotted rhythms, ties, pickup measures, repeats, and
   other advanced notation be handled?
8. Should the first user vocal profile contain only a full range, or full plus
   comfortable range?
9. What exact cost function should be used for key recommendation?
10. Should instrumental parts be rendered by default or be optional?
11. How should existing songs be migrated?
12. Should the offline transcription project be a separate repository?
13. Should the normalized score preserve all MusicXML notation details, or only
   the subset required by the application's supported views?
14. Should analysis use sounding pitch, notated pitch, or an explicit
   transposition/instrument model for non-concert-pitch instruments?
15. How should editorial corrections and source provenance be stored?

These questions should be resolved explicitly in future design work. Future
sessions must not silently turn one of these alternatives into an assumed
requirement.

## 21. Suggested Implementation Phases

This roadmap is a planning aid only. It does not authorize implementation as
part of creating this document.

### Phase 1

Design and finalize the symbolic score representation, including timing,
parts, harmony, lyrics, pitch spelling, and supported notation scope.

### Phase 2

Introduce MusicXML support and test the parser/normalizer with one carefully
curated song.

### Phase 3

Introduce proper score rendering and compare it with the curated source
MusicXML.

### Phase 4

Implement full-score transposition for voice, bass, instrumental parts, and
harmony.

### Phase 5

Migrate existing songs incrementally and validate each migrated asset.

### Phase 6

Build vocal analysis, including range and duration-weighted pitch
distribution.

### Phase 7

Build the local user vocal profile.

### Phase 8

Build automatic key recommendation with explainable UI output.

### Phase 9

Build and iterate on the offline transcription and curation pipeline.

## Rules for Future AI Sessions

- Read `README.md` and this document before making architectural changes.
- Treat this document as design context, not as proof that a feature already
  exists.
- Keep CURRENT IMPLEMENTATION and PROPOSED FUTURE ARCHITECTURE separate in
  plans, code, and explanations.
- Do not introduce new musical concepts without updating the architecture and
  documentation and, when implementation begins, the types and validator.
- Reuse existing music-theory logic where possible.
- Preserve Italian/English notation, sharps/flats, slash chords, and
  transposition.
- Avoid unnecessary rewrites.
- Keep the web app static.
- Keep heavy transcription and machine-learning processing out of the browser.
- Treat automatic transcription as an input to human curation, not as
  guaranteed truth.
- Run `npm run build`, `npm run lint`, and `npm run validate` after relevant
  implementation work.
- Do not modify unrelated song data.
- Keep generated bundles, credentials, model files, and unnecessary artifacts
  out of the repository.
- Mark unresolved design decisions as **OPEN QUESTION** instead of silently
  deciding them.
- Do not implement a feature solely because it is described as planned here;
  confirm scope before changing the application.

STATUS: DESIGN / NOT YET IMPLEMENTED

Date of creation: 2026-09-18
