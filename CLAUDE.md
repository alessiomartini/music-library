# Claude Code instructions

## Project

Static React/TypeScript `music-library` application deployed to GitHub Pages.

The current implementation is a chord/lyrics-oriented song library. The
project is planned to migrate toward a normalized symbolic score
representation. The detailed architecture and roadmap are documented in
[`docs/FUTURE-ARCHITECTURE.md`](docs/FUTURE-ARCHITECTURE.md).

## Source of truth

For current behavior, inspect the actual source code and `README.md`.

For future architecture, use `docs/FUTURE-ARCHITECTURE.md`. Do not treat
planned features as already implemented.

## Implementation workflow

Implement the project incrementally in small, independently verifiable
chunks. A session must implement only the chunk explicitly requested by the
user; do not proactively implement later roadmap phases.

Do not silently resolve decisions still marked as **OPEN QUESTION** in the
future architecture. When a current chunk exposes a problem, fix it only if
necessary for that chunk; otherwise report it and stop.

The intended migration sequence is:

```text
foundation
→ one-song vertical slice
→ three-song validation
→ all-song migration
→ audio-first offline transcription pipeline
```

Keep changes focused, use small commits or checkpoints where appropriate, and
inspect `git status` and `git diff` before finishing. Commit automatically
after each chunk is complete and verification has passed — see Git
workflow below.

## Architecture rules

Preserve these established decisions:

- The web application remains static.
- Normalized JSON is the published score format in the web repository.
- Audio recordings are the primary offline source for new score curation.
- MusicXML is an optional offline source, authoring, inspection, and
  interchange format.
- The runtime application uses a normalized TypeScript `Score` model.
- Harmony is an independent timed layer, never a `ScorePart`.
- All score parts and harmony events share one musical timeline.
- Voice, bass, and instrumental material are explicit musical parts.
- Lyrics are associated with vocal notes and support the decided
  syllabification, melisma, multiple-line, multiple-element, and elision
  semantics.
- Heavy audio transcription, source separation, and ML processing stay outside
  the browser.
- Reuse existing music-theory logic where appropriate.

Do not preserve the legacy music-data model merely for compatibility when the
requested migration chunk explicitly replaces it. Avoid unnecessary rewrites
and song-specific special cases.

## Verification

After relevant changes, run:

```bash
npm run build
npm run lint
npm run validate
```

Also run relevant unit or integration tests. If a command fails, determine
whether the failure was introduced by the current change, fix failures that
belong to the current chunk, and report pre-existing failures separately.

For UI changes, run `npm run dev` and inspect the affected flow in a browser.

## Music-data changes

Treat musical correctness as seriously as software correctness. When changing
score data, verify pitches, timing, measures, lyrics, harmony, part
assignment, and transposition behavior.

Do not silently alter unrelated song data or mass-convert all songs without an
explicit migration request.

## External media

The planned media model is:

```text
song
└── media
    ├── original: one recording
    └── covers: zero or more recordings
```

Each media item represents exactly one recording and exactly one external URL.
Do not store raw iframe HTML in song data. Embedded playback is
provider-dependent and should gracefully fall back to a normal external link.
Spotify is not an embedded-player requirement.

## Files and dependencies

- Do not commit credentials or generated bundles.
- Do not commit large ML models, audio files, or local MusicXML working files
  to the web repository unless explicitly requested.
- Avoid unrelated formatting changes.
- Add dependencies only when required by the current chunk.
- Inspect `git diff` before finishing.

## Completion report

At the end of every chunk, report:

```text
CHUNK:
STATUS:

FILES CHANGED:

IMPLEMENTED:

TESTS RUN:

BUILD:
LINT:
VALIDATE:

KNOWN ISSUES:

ARCHITECTURAL DECISIONS / OPEN QUESTIONS:
```

Do not claim completion if relevant verification fails. After completing the
requested chunk, stop and wait for the next explicit instruction.

## Git workflow

Before committing, inspect:

```bash
git status
git diff
```

Commit automatically once a chunk is complete and its verification (build,
lint, validate, relevant tests) has passed — do not wait for the user to ask
for that specific commit. Still never commit credentials, generated
artifacts, or changes unrelated to the current chunk (see Files and
dependencies), and never push, deploy, or merge without an explicit request.
The goal is a robust, incremental migration where mistakes are detected while
they are still cheap to fix, with a commit boundary at every verified chunk.
