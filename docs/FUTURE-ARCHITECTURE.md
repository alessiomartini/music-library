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

**This section was rewritten on 2026-09-20: the legacy `LeadSheetChart` /
`LeadSheetSystem` chord-and-lyric chart described in earlier revisions of
this document has been removed entirely. `Score`/`ScoreViewer` (VexFlow
staff notation) is now the only chart representation — see the top-level
[README](../README.md) for the current, authoritative state.** The relevant
current structure is:

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── FeedbackBox.tsx
│   ├── KeyPreference.tsx
│   ├── ScoreViewer.tsx
│   └── TransposeControls.tsx
├── data/
│   └── songs/
│       ├── amara-terra-mia.ts
│       ├── blackbird.ts
│       ├── e-cerca-e-me-capi.json
│       ├── index.ts
│       ├── something.ts
│       ├── yesterday.ts
│       ├── your-song.json
│       └── your-song.ts
├── lib/
│   ├── prefs.ts
│   ├── storage.ts
│   ├── theory.ts
│   ├── transpose.ts
│   ├── types.ts
│   ├── score.ts
│   ├── scoreLoader.ts
│   ├── songLoader.ts
│   └── ...
└── pages/
    ├── Home.tsx
    └── SongPage.tsx

scripts/
└── validate-scores.ts
```

### Current data model

`src/lib/types.ts` defines the current `Song` type. It contains metadata such
as `slug`, `title`, `artist`, optional `composer`, `originalKey`, optional
`capo` and `tuning`, `timeSignature`, `tempoBpm`, optional `tempoMarking`,
external links, optional history, and optional notes. It optionally contains
`score?: Score` — the normalized symbolic score defined in `src/lib/score.ts`
(§6 below is the design this type now implements: pitched notes, lyrics,
ties, and an independent harmony layer on the shared tick timeline). There is
no other chart field: a song with no `score` has no chart at all.

The song data currently contains six songs, only two of which have a
published score:

- `Your Song` by Elton John — has a score (`your-song.json`);
- `E cerca 'e me capi` by Pino Daniele — has a score
  (`e-cerca-e-me-capi.json`);
- `Yesterday` by The Beatles — metadata only, no score yet;
- `Blackbird` by The Beatles — metadata only, no score yet;
- `Something` by The Beatles — metadata only, no score yet;
- `Amara terra mia` by Domenico Modugno — metadata only, no score yet.

Their data is stored as TypeScript constants in `src/data/songs/` and collected
by `src/data/songs/index.ts`. A new song currently requires a new data file and
an explicit addition to the `songs` array. A song's score JSON is produced by
the `music-library-offline` sibling repository's pipeline (see the README's
"Score Data Source" section) and copied in verbatim; it is not hand-authored
in this repository.

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
- loads and renders `ScoreViewer` when the song has a `score`, otherwise shows
  a "no score published yet" message;
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

`src/components/ScoreViewer.tsx` is a real staff-notation renderer, built on
`vexflow` (a real dependency in `package.json`). It lays out one VexFlow
`Voice` per `(part, measure)` and one `Stave` per measure — a VexFlow `Voice`
tracks exactly one measure's tick budget, and grouping several measures'
events into one `Voice` (the component's first version) made VexFlow's
internal tick/resolution math produce `NaN` and crash. Chord symbols from the
harmony layer are drawn as plain text at a proportional x-position within
each measure's stave, rather than through VexFlow's tickable system — an
arbitrary harmony-segment duration rarely lands on a standard notated
duration, so forcing it into a `Voice`'s tick budget reintroduces the same
class of crash. This means chord placement is visually proportional, not
tied to precise rhythmic notation. Lyrics are drawn as note annotations
below the voice part. Ties (`ScoreNoteEvent.tie`) are not yet drawn.

### Current validation

`npm run validate` bundles and runs `scripts/validate-scores.ts`. For each
song with a `score`, it runs `validateScore` (`src/lib/score.ts`), which
checks: timing/ordering and non-overlap of events within a part and within
the harmony layer, valid pitches, valid ties, valid lyrics (verse, syllabic,
melisma, elision), valid harmony (root, quality, slash bass), and consistent
measures against the time signature. A song with no `score` is reported
`PEND`, not a failure — expected during incremental migration. The validator
does not currently re-check the legacy chord/lyric-chart rules described in
earlier revisions of this document, because that representation no longer
exists.

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
- there is no MusicXML parser, published normalized score asset, or integrated
  score viewer;
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
the same musical timeline. Harmony is an independent timed layer aligned to the
same musical timeline as the score parts.

All musical parts and harmony events must live on one shared musical timeline:

```text
                    shared musical timeline
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
           Voice          Bass       Instruments
             │             │             │
             └──────────── Harmony ──────┘
```

This common timeline is a decided architectural requirement. It is necessary
for simultaneous parts, harmony alignment, transposition, rendering, vocal
analysis, future playback or alignment, and measure and rhythmic validation.
The Step 1.0 timeline decisions are:

- time is measured in integer ticks;
- one quarter note equals 960 ticks (`PPQ = 960`);
- every event has an absolute `start` position and a positive integer
  `duration` in ticks;
- events in different parts or in the harmony layer are simultaneous when
  their absolute positions overlap, without requiring them to share array
  indexes;
- measures have explicit absolute start positions and durations derived from
  the score's time-signature metadata;
- a pickup measure is represented by its shorter explicit duration and an
  absolute start at tick zero; it is not padded with synthetic silence.

All parts and harmony events therefore use the same integer coordinate system.
Measure-relative positions may be derived for notation, but are not an
alternative storage coordinate. Floating-point seconds are not part of the
symbolic score model.

## 4. Proposed Future Architecture

The intended future architecture separates offline music preparation from the
static web application.

### Audio-first offline transcription / curation pipeline

The standard path begins with a recording, not with an assumption that a
complete MusicXML file is available:

```text
audio recording
    ↓
offline source separation
    ↓
┌────────────────────────┬────────────────────────┐
│ vocal stem              │ accompaniment stem(s)  │
│ ↓                       │ ↓                      │
│ melody transcription    │ harmony analysis       │
│ pitch, rhythm, rests    │ timed HarmonyEvent[]    │
│ lyrics / alignment      │                        │
└───────────────┬────────┴────────────────────────┘
                ↓
        human curation and validation
                ↓
        normalized symbolic score
                ↓
        normalized JSON asset
                ↓
        web application
```

Source separation may produce an isolated or improved vocal stem, an
accompaniment/instrumental stem, and optionally useful additional stems such
as bass. The exact separation strategy and tools remain implementation
choices. Automatic vocal transcription, lyric recognition/alignment, and
harmony analysis are expected to be imperfect and require human correction.

MIDI may be used as an intermediate when useful for a particular tool:

```text
audio → MIDI → further processing
```

or a tool may produce symbolic musical information directly:

```text
audio → symbolic transcription → further processing
```

Neither route is an architectural requirement. The requirement is
audio-to-symbolic musical information followed by curation. The output should
be a curated normalized JSON score asset, not an assumption that automatic
transcription is authoritative.

For `Your Song`, the intended reference workflow is:

```text
Your Song recording
    ↓
source separation
    ↓
vocal stem + accompaniment
    ↓
vocal melody + lyrics      harmony
    └──────────────┬──────────┘
                   ↓
             human curation
                   ↓
             normalized JSON
                   ↓
             application Score
```

The `Your Song` reference workflow is explicitly restarted from the recording
itself. The previously obtained MusicXML is not the source of truth for the
new reference score and must not drive its transcription, curation, or golden
asset. It may remain in the separate offline repository only as an optional
comparison, inspection, or historical reference artifact. The new reference
asset must be derived from the audio-first workflow above.

### Web application

```text
JSON score asset
    ↓
load / parse
    ↓
internal score model
    ↓
transposition
    ↓
analysis
    ↓
rendering
```

The web application should remain fully static. Heavy audio transcription,
source separation, and machine-learning inference should not run in the
browser. Python tooling for those tasks should live in a separate project,
repository, or clearly separated tooling environment and should not become
part of the browser bundle.

The frontend should consume normalized JSON score assets and perform
lightweight loading, parsing, analysis, transposition, and display work. The
browser should not need a MusicXML parser merely to display a published song.

The web repository contains the React application, TypeScript source,
normalized JSON score assets, song metadata, media URL/provider metadata,
validation code, rendering, transposition, and future vocal-analysis and
recommendation logic. It should not contain raw audio, large models,
transcription working files, generated intermediate audio, or local MusicXML
working files.

The separate offline repository contains source recordings and provenance,
source separation, vocal transcription and lyric-alignment workflows, harmony
analysis, optional MIDI or MusicXML intermediates, manual corrections,
validation/preparation tools, and conversion to normalized JSON. Large models,
audio files, and generated intermediates remain offline and should only be
committed when explicitly justified.

### Selected recordings and covers

Each song should be able to reference media independently of its musical
score. The planned model associates each song with exactly one selected
original/reference recording and zero or more selected covers. These references
exist so that the user can easily access a recording of the original song and
interesting interpretations curated by the project author.

The structural rule is:

```text
Song
└── media
    ├── original: one media item
    └── covers: array of media items
```

Each media item represents one recording and contains exactly one external URL.
The original may contain a title and/or description when useful. Each cover
should identify its artist and may also contain a title, description, or note.
The original does not need a separate artist field because its artist is
already available from `Song.artist`; when a `MediaItem` represents a cover,
artist information is required.
Every item also contains normalized provider/platform information when that
information is needed to determine how it can be embedded. A cover may, for
example, be described as an acoustic cover, live version, piano arrangement,
vocal cover, or unusual interpretation; these are editorial examples, not
mandatory semantic fields.

The original recording is a single selected reference recording. The data model
must not contain multiple original recordings unless a future design explicitly
changes this requirement. A cover must not contain separate Spotify, YouTube,
Instagram, or other platform links for the same recording.

When a provider supports embedding, the preferred experience is to play or
watch the original recording or cover inside the website. The application
should determine how to render an item from its normalized provider/type. The
model should contain URL and provider information, not raw iframe HTML; the
frontend is responsible for deciding whether and how to embed it. If a
provider cannot be embedded, the UI should gracefully fall back to a normal
external link rather than breaking the page.

Potential embedded providers may include YouTube, Instagram, and other future
providers with suitable embedding mechanisms. This is not a final provider
list. Spotify is explicitly out of scope for embedded playback and must not be
part of the embedded-player system. It may be represented as a plain optional
external link in a future version, but it is not necessary for the original or
cover model.

Embedded external players should ideally be loaded only when useful or
requested rather than eagerly loading many third-party embeds on every
SongPage. This is especially important when a song has multiple covers. The
final implementation should avoid many simultaneously loaded third-party
players when a lighter interaction pattern is practical.

## 5. Music Representation and File Format

The web repository's canonical stored score format is normalized JSON.
Audio recordings are the primary offline source for new curation. MusicXML is
an optional offline source, authoring, inspection, and interchange format.
The distinction is intentional:

```text
recording
= primary source for offline transcription and analysis

MusicXML
= optional rich authoring/inspection/interchange format

JSON
= normalized application data format
```

When a reliable file is available, MusicXML is useful because it can
represent:

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

MIDI may be useful as an intermediate representation for a particular
transcription tool or song, but it is not required. It does not by itself
carry all of the notation and editorial meaning needed for a curated lead
sheet, and the offline workflow may also produce symbolic information without
MIDI.

The normalized JSON should represent the subset required by the application:
pitches, durations and timing, measures, parts, lyrics, harmony, key, meter,
tempo, notation information required by the renderer, and metadata required
for correct analysis and transposition. It does not need to reproduce every
possible source feature. Information loss during offline curation is
acceptable only when the discarded information is outside the supported
application score model and the curation decision is recorded.

Lyrics in the normalized JSON must preserve musical meaning rather than use a
single `lyric?: string` field as the conceptual target. A future vocal note
should instead support `lyrics?: Lyric[]`, allowing zero, one, or multiple
lyric elements on the same note. Here, `verse` means the identifier of the
lyric line, verse, or vocal text line; it does not mean the actual textual
content of that verse. The actual lyric text is stored in `text`. This allows
multiple lyric lines to coexist on the same musical note. Each lyric may also
contain syllabification, melisma/word-extension relationships, and elision
information. A conceptual model is:

```ts
interface Lyric {
  verse: string;
  text?: string;
  syllabic?: 'single' | 'begin' | 'middle' | 'end';
  melisma?: 'start' | 'continue' | 'stop';
  elision?: string;
}
```

These exact names and fields are not finalized, but the semantic capabilities
are decided requirements. The model must represent ordinary one-syllable
lyrics, words divided across notes, words spanning notes, multiple verses or
lyric lines, multiple lyric elements on one note, and lyric elisions.

Conceptual examples include:

```text
Ordinary lyric:
C4 -> "You"
D4 -> "are"
E4 -> "..."

Word spanning several notes / melisma:
C4 -> "love" + melisma:start
D4 -> melisma:continue
E4 -> melisma:stop

Word divided across notes:
C4 -> "some" + syllabic:begin
D4 -> "thing" + syllabic:end

Multiple verses:
note:
    verse 1 -> "Yesterday"
    verse 2 -> "Something"
```

Multiple lyric elements on one note are allowed for elisions and other cases
where more than one syllable is associated with a note. These lyrics remain
associated with vocal notes on the shared musical timeline; they are not
independent timeline events.

This model is inspired by the relevant MusicXML semantics: `syllabic` values
such as `single`, `begin`, `middle`, and `end`; multiple lyric elements for
different lyric lines; `extend` for word extensions or melismas; and `elision`
for multiple syllables associated with one note. The concepts are normalized
into the application's simpler JSON model:

```text
MusicXML
    ↓
semantic normalization
    ↓
JSON lyrics model
```

The JSON does not need to preserve every MusicXML presentation or formatting
attribute. It must preserve lyric-to-note association, verse or lyric-line
identity, syllable boundaries, melisma relationships, same-note
multiple-lyric relationships, and enough information for correct rendering.

The first versioned JSON envelope and its loader boundary are implemented as
domain infrastructure. As of 2026-09-20, two songs (Your Song, E cerca 'e me
capi) have a real published score JSON asset produced by the
`music-library-offline` audio-first pipeline and loaded/rendered by the
application; the other four songs have none yet. MusicXML files should not
normally be committed as published score assets in the frontend repository.

The normalized score uses the same integer-tick representation at rest in JSON
and at runtime. JSON may use compact scalar fields for tick positions and
durations, but it must not encode symbolic time as floating-point seconds.
The property names and asset envelope are defined by the first loader boundary
below; future schema versions may evolve them explicitly. The timing semantics
are fixed by this document.

The first JSON asset envelope is versioned and has this shape:

```json
{
  "schemaVersion": 1,
  "score": {
    "ppq": 960,
    "originalKey": "C",
    "timeSignature": { "numerator": 4, "denominator": 4 },
    "measures": [{ "start": 0, "duration": 3840 }],
    "tempo": { "bpm": 96 },
    "parts": [],
    "harmony": []
  }
}
```

The `score` object uses the normalized domain fields already defined above:
absolute integer-tick timing, note/rest event discriminants, normalized
sounding pitch, attached lyrics and ties, and semantic harmony qualities such
as `major` or `dominant7`. `schemaVersion: 1` is the only supported version
for the first loader; unsupported versions must be rejected rather than
silently reinterpreted. The loader validates the external envelope first,
then runs the domain validator and returns an independent normalized `Score`
value. It does not fetch assets, render them, or parse MusicXML.

## 6. Internal TypeScript Model

The future application should introduce a normalized internal score model.
This is a design proposal, not an implementation of `src/lib/types.ts`.

### Proposed concepts

`Score` contains:

- original key;
- a fixed ticks-per-quarter-note value of 960;
- explicit time-signature metadata and a measure list;
- tempo;
- parts;
- an independent timed harmony layer;
- metadata;
- possibly source and editorial information.

`ScorePart` contains:

- stable `id`;
- display `name`;
- semantic `role`;
- ordered timed events;
- optional non-semantic display metadata only where needed by the renderer
  adapter.

Potential semantic roles include:

- `voice`;
- `bass`;
- `instrument`;
- other instrumental material.

Harmony is not a `ScorePart`, is not a sequence of notes, and does not have to
correspond one-to-one with any particular part or melody note. A harmony event
may start between two melody notes, last across several melody notes, change
while a melody note is held, or exist during an instrumental passage. The
conceptual structure is:

```text
Score
├── parts[]
│   ├── Voice
│   ├── Bass
│   ├── Instrument
│   └── ...
│
└── harmony[]
    ├── HarmonyEvent
    ├── HarmonyEvent
    └── ...
```

All parts and harmony events use the shared musical timeline described above.
The first implementation treats each `ScorePart` as an ordered monophonic
event stream: events in one part must have positive durations and must not
overlap. Simultaneous events are supported across parts and between a part and
harmony. Polyphonic lanes within one part are deferred rather than encoded
implicitly.

The event model has two discriminated variants:

- a pitched note event with an integer `pitch` and optional `lyrics[]`;
- a rest event with no pitch or lyrics.

Both variants carry an absolute `start` tick and positive integer `duration`.
Zero-duration events are not allowed. An event may span a measure boundary;
measure boundaries do not split its musical meaning.

Pitch is represented as a sounding concert-pitch MIDI-style integer: MIDI note
number 60 is middle C (C4). This is an internal numeric pitch identity, not a
requirement to use MIDI files or MusicXML pitch fields at runtime. It supports
ordering, chromatic transposition, vocal analysis, and deterministic
comparison. Renderer adapters derive a notated name and octave from the
integer plus score/key spelling policy. The first model does not represent
instrument-specific transposition; all pitches are sounding pitches.

Notation-level ties are represented explicitly on note events with a tie
continuation identity and start/stop role. A single event with a long duration
is preferred for one sustained semantic note. Tied events are used only when
notation or a measure/voice boundary requires segmentation; adjacent segments
in a tie chain must have the same pitch and contiguous time. A tie may cross a
measure boundary. A rest cannot participate in a tie.

`lyrics[]` is allowed only on pitched events in a vocal part. Each lyric
element carries the already-resolved semantic fields `verse`, optional `text`,
syllabic state, melisma state, and optional elision; presentation fields such
as font, placement, and line spacing remain renderer concerns.

### Minimum notation scope for the first score implementation

The first score model supports pitched notes, rests, integer-tick durations,
explicit measures, one score-level time signature, one initial clef per
part where rendering needs it, one score-level key signature, one constant
tempo, dotted rhythms represented by their exact tick duration, and explicit
notation ties.

The first implementation defers tuplets, repeats and jumps, mid-score
time-signature changes, tempo changes, grace notes, fermatas, beam-group
preservation, and other advanced MusicXML presentation details. These are not
implicitly supported merely because MusicXML can represent them. Quantization
from source material remains an offline curation concern and must produce
valid integer ticks.

Songs should also have a separate media association, conceptually along these
lines:

```ts
interface MediaItem {
  platform: MediaPlatform;
  url: string;
  title?: string;
  artist?: string;
  description?: string;
}

interface SongMedia {
  original: MediaItem;
  covers: MediaItem[];
}
```

These exact TypeScript names and fields are not finalized. The important
constraints are that `original` is one media item, `covers` is an array that
may contain zero, one, or many items, and every `MediaItem` has exactly one
external URL. Provider information should be normalized rather than inferred
repeatedly from arbitrary UI code. The model must not store raw iframe HTML.
The frontend should decide whether and how to embed each item, with a normal
external-link fallback when embedding is unsupported. This media system is
planned and is not part of the current `Song` type or application.

`HarmonyEvent` contains:

- absolute start position;
- positive duration;
- normalized chromatic root;
- chord quality;
- optional slash-bass note;
- any notation-specific interpretation.

`HarmonyEvent` belongs to the independent `Score.harmony[]` layer, not to
`Score.parts[]`. Its root and optional slash bass are normalized pitch-class
integers in the range 0-11 and transpose modulo twelve; its quality is an
explicit semantic value such as `major`, `minor`, or `dominant7`. A theory or
renderer adapter may map that value to the existing chord-symbol quality
strings for display. English and Italian names are display formatting choices.
The key architectural principle is that musical semantics must be explicit. A
future score should not force a structure such as:

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

### Song, score, media, and local-preference boundaries

The future domain boundaries are explicit:

- `Song` owns stable song metadata, editorial metadata, external links, and
  the association to its score and media; it does not own user-local state.
- `Score` owns independently analyzable and transposable musical content:
  parts, timed note/rest events, measures, and independent harmony.
- `Media` owns the selected original recording and cover references, each with
  one external URL and provider information as defined elsewhere in this
  document.
- User-local preferences such as transposition, notation choice, vocal
  profile, and feedback notes remain outside `Song`, persisted through the
  browser-local preference/storage boundary.

The score must be usable by transposition and analysis without rendering and
must not depend on React, DOM nodes, iframe markup, or other UI details.

## 7. Rendering Strategy

The proposed replacement for the current HTML/CSS pseudo-score is a real
lead-sheet renderer consuming the normalized application score model. The
first user-facing score viewer should intentionally center on the vocal
melody, lyrics, harmony, and meter. Piano notation, full accompaniment,
cello/string parts, arbitrary instrumental parts, and full orchestration are
future extensions rather than dependencies of the first viewer.

The current candidate direction for a later notation renderer is an
OpenSheetMusicDisplay / VexFlow-based solution.

This direction is attractive because it offers:

- real staff notation;
- browser support;
- compatibility with TypeScript and React integration;
- potential styling or selection of individual parts and notes.

The intended architecture is:

```text
JSON
 ↓
normalized Score
 ↓
renderer adapter
 ↓
OpenSheetMusicDisplay / VexFlow or another suitable renderer
```

The normalized score may be converted to MusicXML in memory for an OSMD
adapter if that becomes technically convenient. This is an implementation
detail, not a requirement that MusicXML files exist in the deployed
application. The application's source-of-truth score data is normalized JSON;
the rendering library is an implementation detail.

The renderer should be treated as an adapter around the normalized score
model, not as the owner of the application's musical semantics. The
application should be able to transpose and analyze a score without depending
on DOM-specific rendering details.

The first viewer should make the voice and independent harmony clear. Later
views may distinguish instrumental material. For example:

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

Harmony remains a separate timed annotation layer in the score viewer. It may
be rendered alongside parts on the shared timeline, but it must not be modeled
as another musical part.

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
  -> original recording
  -> covers
  -> history / notes / links
```

The exact layout is not fixed. The important UX principle is that key
recommendation should be explainable visually rather than behaving like a
black box. The user should be able to understand the relationship between
their range, the song's vocal distribution, and the proposed transposition.

Secondary parts may be visible in the score viewer but should not obscure the
voice analysis. The UI should make clear whether a chart is a simplified view
or a more complete score.

The original recording should be clearly distinguished from covers. A possible
future presentation is:

```text
Original recording
[embedded player]

Covers

Artist A - Acoustic cover
[embedded player]

Artist B - Live version
[embedded player]

Artist C - Piano arrangement
[embedded player]
```

This is only a UI concept; the visual layout is not finalized. Players should
be embedded when supported and should otherwise provide a normal external link.

## 14. Offline Audio-to-Score Pipeline

The planned offline tooling should provide a practical semi-automatic
audio-first workflow for producing curated score data. It is not intended to
guarantee perfect automatic transcription.

Source separation may produce an improved vocal stem, accompaniment stem(s),
and optionally additional useful stems such as bass. The vocal path should
recover melody pitch, rhythm, rests where musically meaningful, lyrics, and
lyric alignment. The accompaniment path should recover independent timed
harmony events, including root, semantic quality, optional slash bass, and
duration. Both paths require human curation.

MIDI is optional. A particular tool may use:

```text
audio -> MIDI -> further processing
```

or:

```text
audio -> symbolic transcription -> further processing
```

Neither route is required by the architecture. MusicXML may be used as an
optional authoring or inspection artifact, or as a source when a reliable
complete file happens to exist. It is not the canonical offline starting
point.

The offline project should output durable, inspectable intermediate and final
artifacts without adding its runtime dependencies to the browser application.
The final normalized JSON is transferred to and committed in the web project.

## 15. Tooling choices remain open

Specific source-separation, vocal-transcription, lyric-recognition, alignment,
and harmony-analysis tools are implementation choices. Candidate tools may be
evaluated experimentally, but no tool is selected by this architecture.

Automatic systems may miss notes, misidentify octaves, produce incorrect
rhythms, confuse instruments, misrecognize lyrics, or produce unsuitable
harmony. Their output requires inspection, correction, and validation.

No offline tool or model should be added to the frontend dependency graph
merely because it is evaluated in the separate repository.

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
- valid or supported normalized JSON score structures.

Validation should run both on curated assets and, where practical, on
normalized data generated during the build. It should produce actionable
locations such as song, part, measure, and event rather than only a generic
failure.

These checks are future design goals. They are not present in
`scripts/validate-leadsheets.ts` today.

## 18. Backward Compatibility / Migration Strategy

Migration does not have to be a big-bang rewrite. The preferred staged
approach is:

1. Define the new normalized JSON/`Score` model.
2. Create one high-quality reference song.
3. Validate its JSON.
4. Render it.
5. Test transposition.
6. Test vocal analysis.
7. Only then migrate the remaining songs incrementally.
8. Remove the legacy representation only after all required songs and UI paths
   use the new model.

Supporting both representations temporarily may increase code complexity and
requires an explicit compatibility boundary. A direct conversion may be
simpler but makes it harder to isolate errors and compare old and new output.
Existing song data should not be silently rewritten while implementing
unrelated features.

The reference song is a validation or golden asset for the new architecture,
not authorization to mass-convert all existing songs before the model,
rendering, transposition, and analysis have been checked.

The migration will use an explicit legacy adapter / parallel representation
while the new score model is introduced. The adapter is a compatibility
boundary for the existing `LeadSheetSystem` data and current chart; it is not
permission to infer pitches or silently convert incomplete legacy charts.
Existing songs remain on the legacy representation until each song is
explicitly migrated and validated.

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
│       ├── index.ts
│       ├── your-song.json
│       ├── yesterday.json
│       └── ...
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

The web repository should contain normalized JSON score assets, plus song
metadata and media URL/provider metadata. The exact path and Vite/static-asset
arrangement may change; `.json` does not have to live exactly in
`src/data/songs/`. MusicXML is a local offline source/interchange artifact and
should not normally be committed to the web repository.

An offline project might have a separate structure such as:

```text
offline-score-tools/
├── input/
├── working/
│   ├── midi/
│   ├── audio/
│   └── musicxml/
├── output/
│   └── json/
├── corrections/
├── pipeline/
├── generated/
└── README.md
```

This is also only a conceptual proposal. MusicXML can live in `working/` or
another local working area, while final JSON assets are transferred or
committed to the web project. Large ML models, audio files, generated
intermediate files, and local working MusicXML should not be placed in the
frontend repository without a specific reason.

## 20. Open Questions

The following decisions remain unresolved:

1. What exact JSON schema should be used for the normalized score?
2. How should colors and styles of parts be represented?
3. How much of OpenSheetMusicDisplay should be exposed or customized?
4. How should rhythmic quantization be handled in the offline curation
   workflow before values are converted to the fixed tick grid?
5. Should the first user vocal profile contain only a full range, or full plus
   comfortable range?
6. What exact cost function should be used for key recommendation?
7. Should instrumental parts be rendered by default or be optional?
8. Should the offline transcription project be a separate repository?
9. Should the normalized score preserve all MusicXML notation details, or only
   the subset required by the application's supported views?
10. How should editorial corrections and source provenance be stored?
11. Which providers should be supported for embedded playback in the first
   implementation?
12. How should unsupported or non-embeddable URLs fall back to normal external
   links?
13. Should the original recording always be shown as an embedded player, or
   only when the provider supports embedding?
14. Should cover ordering be manually specified?
15. Should covers have optional semantic tags such as acoustic, live, or
   instrumental?
16. Should embeds be lazy-loaded, click-to-load, or always visible when
   technically possible?
17. Should `platform` be explicitly stored, or inferred from the URL during
   parsing?
18. Which source-separation tool or strategy gives sufficiently reliable
   vocal and accompaniment stems?
19. Which vocal transcription workflow gives sufficiently reliable melody
   pitches, rhythms, and rests?
20. How should lyrics be recognized and aligned to sung notes, given that
   speech-to-text alone does not solve sung-lyric alignment?
21. When is MIDI useful as an intermediate for a particular song, and when is
   direct symbolic transcription preferable?
22. How should harmony recognition be performed and corrected when chord
   quality or slash bass is ambiguous?
23. How much manual correction is required before a score is publishable?
24. How should accompaniment be represented when harmony is ambiguous?
25. Should an instrumental stem always be separated into additional
   sub-stems, or only when the reference score needs them?
26. How should audio-derived scores be validated against the recording and
   curated musical expectations?

The following are resolved architectural decisions, not open questions:

- JSON is the format committed to the frontend repository.
- Audio recordings are the primary offline source for new score curation.
- MusicXML is an optional offline source, authoring, inspection, and
  interchange format; it is not a required starting point.
- The audio-first offline workflow produces curated symbolic information and
  normalized JSON; the web app consumes JSON and does not require runtime
  MusicXML parsing.
- Harmony is an independent timed layer, not a `ScorePart`, and all parts and
  harmony events share one musical timeline.
- The shared timeline uses integer ticks at 960 ticks per quarter note, with
  absolute event positions, positive durations, explicit measures, and
  pickup measures represented by their actual shorter duration.
- Score events are pitched-note or rest variants; zero-duration events are
  invalid, and the first implementation uses non-overlapping monophonic
  streams within each part.
- Pitches are sounding concert-pitch MIDI-style integers; ties are explicit
  notation relationships and may cross measure boundaries.
- The first notation scope supports notes, rests, dotted durations, explicit
  measures, initial clefs, a score-level key signature, a constant tempo, and
  ties; advanced notation listed above is deferred.
- A temporary legacy adapter keeps the existing `LeadSheetSystem` and chart
  usable while songs are migrated explicitly in later phases.
- The normalized lyric model supports lyric attachment to vocal notes,
  syllabification, melismas, multiple lyric lines, multiple lyric elements per
  note, and elisions.

These questions should be resolved explicitly in future design work. Future
sessions must not silently turn one of these alternatives into an assumed
requirement.

## 21. Suggested Implementation Phases

This roadmap is a planning aid only. It does not authorize implementation as
part of creating this document.

### Phase 1

Finalize the symbolic score model, including the shared timeline, parts,
independent harmony, timing, lyric attachment and syllabification, melismas,
multiple lyric lines where supported, pitch spelling, and supported notation
scope.

### Phase 2

Create the normalized JSON score representation and its loader/normalization
boundary.

### Phase 3

Prepare the audio-first offline workflow for source recordings, including
inspectable provenance and intermediate artifacts.

### Phase 4

Separate the reference recording into a vocal stem and accompaniment or
instrumental stem(s), using a tool and strategy that remain open questions.

### Phase 5

Transcribe and curate the reference vocal melody, timing, and musically
meaningful rests from the separated vocal audio, with human verification.

### Phase 6

Recognize and align lyrics to the verified vocal notes as a separate curated
step. Automatic lyric recognition is not assumed to solve sung-lyric
alignment.

### Phase 7

Extract and curate independent harmony from accompaniment material, including
root, semantic quality, optional slash bass, timing, and human correction.

### Phase 8

Create and validate the first golden normalized JSON asset for the voice,
lyrics, harmony, and meter scope.

### Phase 9

Integrate the first normalized asset into the web application and render the
initial voice-centered score view.

### Phase 10

Implement score transposition for vocal melody, harmony roots, slash bass,
and displayed key.

### Phase 11

Build vocal analysis, including range and duration-weighted pitch
distribution.

### Phase 12

Build the local user vocal profile.

### Phase 13

Build automatic key recommendation with explainable UI output.

### Phase 14

Migrate remaining songs incrementally, extend the offline workflow as needed,
and remove the legacy score representation only after all required songs and
UI paths use the validated model.

The original-recording and covers media system remains a separate planned
feature and may be implemented alongside these phases without becoming part
of the symbolic-score ingestion path.

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

STATUS: PARTIALLY IMPLEMENTED — Phases 1-9 done for 2 of 6 songs (score model,
JSON envelope/loader, and a working ScoreViewer are live; Phases 10-14 —
transposition is done, vocal analysis / key recommendation / remaining-song
migration are not). Sections 2 and 17 above describe the current
implementation; the rest of this document remains design intent. See the
top-level README for the authoritative current-state summary.

Last updated: 2026-09-20
