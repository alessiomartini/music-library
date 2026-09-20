# Song Library

`music-library` is a static personal song library. Song metadata (title,
artist, key, capo/tuning, meter, tempo, links, history) is always present;
the musical content itself is either a normalized **Score** (real pitched
melody, lyrics, and an independent harmony layer, rendered as staff notation)
or, for songs not yet transcribed, absent — there is no chord/lyric-only
chart fallback.

## Current Features

- Song metadata including title, artist, composer, key, capo/tuning, meter,
  tempo, history, and notes where provided.
- A normalized symbolic `Score` (see `src/lib/score.ts`): pitched melody
  events, lyrics with syllabification, and an independent timed harmony
  layer, all on a shared integer-tick timeline (960 ticks per quarter note).
- `ScoreViewer` (`src/components/ScoreViewer.tsx`) renders a `Score` as real
  staff notation with VexFlow: clef, key/time signature, noteheads, lyrics
  under the voice line, and chord symbols positioned proportionally above
  each measure from the harmony layer. It lays out one VexFlow `Voice` per
  (part, measure) — a VexFlow `Voice`'s tick budget is exactly one measure,
  so this is the layout that keeps VexFlow's internal tick math valid;
  cramming a whole line of measures into one `Voice` previously crashed the
  renderer.
- Italian or English chord notation, applied to both the score's harmony
  layer and the displayed key.
- Chromatic transposition of the score (melody pitches, harmony roots and
  slash-bass, displayed key) via `src/lib/transpose.ts`.
- A manually selected preferred singing key with an optional note.
- External Spotify, YouTube, and sheet-music links where present in a song's
  data.
- Browser-local site-improvement notes.
- Light/dark appearance support through the user's system color preference.

## Current Limitations

Only **Your Song** and **E cerca 'e me capi** currently have a published
`Score` — they were transcribed through the audio-first offline pipeline (see
below). **Yesterday**, **Blackbird**, **Something**, and **Amara terra mia**
have song metadata only; their page shows a "no score published yet" message
and no chart. There is intentionally no legacy chord/lyric-only chart to fall
back to — migrating the rest of the songs means transcribing them through the
same offline pipeline, not reviving the old format.

The published scores are machine-transcribed (source separation + automatic
melody/harmony extraction) and not checked against a published edition;
treat pitches and chords as a close but unverified transcription.

`ScoreViewer`'s layout is functional but not typeset: multi-line pieces
divide measures evenly per line rather than balancing them, chord symbols are
placed by proportional x-position rather than true rhythmic alignment, and
there's no beaming/tie rendering yet (`ScoreNoteEvent.tie` is not drawn).
There is no automatic vocal-range analysis, pitch-distribution analysis,
automatic key recommendation, or embedded recording/cover players yet — see
[Future Architecture](docs/FUTURE-ARCHITECTURE.md).

## Song Data

Songs are TypeScript constants in:

```text
src/data/songs/
```

collected by `src/data/songs/index.ts`. A song's fixed metadata (title,
artist, links, history, ...) lives in a `.ts` file; a song with a published
score has its normalized JSON asset (e.g. `your-song.json`) imported and
validated through `loadScoreJson` (`src/lib/scoreLoader.ts`) at module load
time, which the `.ts` file's `score` field is then set to. An invalid score
asset logs an error and is treated as absent rather than crashing the app —
see `src/data/songs/index.ts`'s `tryLoadScoreJson`.

To add a song with a score, produce its normalized JSON in the
`music-library-offline` pipeline (below), copy it into `src/data/songs/`, and
wire it into `index.ts` the way `your-song.json` and `e-cerca-e-me-capi.json`
are. To add a song without a score yet, just add its metadata `.ts` file with
no `score` field — it will show the "no score published yet" state until
transcribed.

## Score Data Source: `music-library-offline`

Song scores are **not** authored by hand in this repository. They come from
a separate, sibling repository, `music-library-offline`, which holds source
recordings and an audio-first transcription pipeline:

```text
recording -> source separation (Demucs) -> vocal melody transcription
          -> lyric alignment -> harmony extraction (lv-chordia, ML chord
          recognition) -> MusicXML assembly (music21) -> normalized JSON
```

Its `pipeline/` is one generic, slug-parameterized script per step
(`separate.py`, `transcribe_vocals.py`, `align_lyrics.py`,
`extract_harmony.py`, `assemble_musicxml.py`, `musicxml_to_json.py`) driven
by a small per-song config at `songs/<slug>.json` — not a per-song copy of
the scripts. `output/json/*.json` in that repo is the transfer point: copy
those files into this repo's `src/data/songs/` verbatim (they're already in
the versioned Score JSON envelope this repo's `loadScoreJson` expects).

**Harmony extraction switched to lv-chordia (2026-09-20):** an ML chord
recognition model (openmirlab/lv-chordia, MIT-licensed, ISMIR 2019
ensemble+HMM model, weights bundled with the package) replaced a hand-rolled
librosa chroma-template-per-beat matcher, which had no temporal smoothing
and produced noisier chord boundaries.

**Harmony tick-tiling fix (2026-09-20, applies regardless of extractor):**
the harmony extractor and the MusicXML-to-JSON converter both used to round
each chord event's `start` and `duration` independently from real timing.
Two independent roundings of dependent quantities can each land on either
side of `.5`, which produced stray one-tick gaps/overlaps between
consecutive chords and failed `validateScore`'s overlap check. Fixed by
deriving `duration = nextEvent.start - event.start` from the already-rounded
starts instead, in both `extract_harmony.py` and the MusicXML round-trip in
`musicxml_to_json.py` (which had the same independent-rounding pattern a
second time) — this guarantees exact tiling by construction rather than by
retrying rounding heuristics. The same work also stopped serializing `null`
for absent optional fields (`tie`, `melisma`, `elision`, `lyrics`,
`slashBass`); the JSON schema treats "optional" as "key absent", not `null`,
and the null values were failing schema validation.

## Persistence

The application has no backend or database. Browser-local preferences and
notes are stored in `localStorage`, including chord notation preference,
per-song transposition and preferred-key notes, and site-improvement notes.
This data is local to one browser profile and is not synchronized between
devices or users.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub
Pages on every push to `main`. The `github-pages` environment on GitHub has a
**custom deployment branch policy** (Settings → Environments →
`github-pages`) that must explicitly list a branch before it's allowed to
deploy — this is separate from anything in this repository's files. As of
2026-09-20 that policy allows `main`. If deploys start silently failing at
the `deploy` job (build succeeds, deploy is rejected with "Branch ... is not
allowed to deploy to github-pages due to environment protection rules"),
check that policy first before assuming a code or workflow problem.

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

`npm run validate` (`scripts/validate-scores.ts`) structurally validates
every song's `Score` (via `validateScore` in `src/lib/score.ts`): timing,
overlap, pitch range, lyric, tie, and harmony checks. A song with no score
yet is reported `PEND`, not `FAIL` — that's an expected, temporary state
during incremental migration, not a data defect. Only a present-but-malformed
score fails the run and the exit code.

## Future Architecture

See [Future Architecture](docs/FUTURE-ARCHITECTURE.md) for the full design:
vocal-range analysis, automatic key recommendation, original-recording/cover
media, in-app stem playback (play a song with vocals or instrumentals
excluded, reusing the offline pipeline's existing Demucs separation), and the
rest of the symbolic-score roadmap beyond what's implemented today.
