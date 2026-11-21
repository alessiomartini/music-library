# Claude Code instructions

Static React/TypeScript personal song library on GitHub Pages: song metadata, Spotify/YouTube/Instagram
imports, rankings, vocal-range tools, and a normalized `Score` model (VexFlow staff notation) for the songs
transcribed so far. `README.md` describes current behavior; for the source of truth, read the code.

## Design document

`docs/DESIGN.md` is the long-term design but is partly outdated: it still opens by describing a move away
from a chord/lyric chart (the legacy `LeadSheet*` model is already removed), and parts of its roadmap are
done or paused (lead sheets and the single-staff view are on hold, see `ROADMAP.md`). Trust the code and
README over it, and do not treat planned features as implemented. Do not rewrite it unless asked.

## Architecture decisions to keep

- The web app stays static. Normalized JSON is the published score format; the runtime uses the
  normalized TypeScript `Score` model.
- Audio recordings are the primary offline source for new scores. MusicXML is only an optional offline
  source/interchange format. Heavy audio, source separation and ML stay out of the browser, in the sibling
  repo `music-library-offline` (pipeline and intermediates).
- Harmony is an independent timed layer, never a `ScorePart`. All parts and harmony share one timeline.
  Voice, bass and instrumental material are explicit parts.
- Lyrics attach to vocal notes (syllabification, melisma, multiple lines/elements, elision as in the model).
- Each media item is one recording with one external URL; never store raw iframe HTML. Embedded playback
  depends on the provider and falls back to a plain link; Spotify is never embedded.
- Reuse existing music-theory code (`src/lib/`). Do not keep the legacy data model only for compatibility
  when a requested migration chunk replaces it.

## Score-model migration chunks

Planned sequence: foundation, one-song slice, three-song validation, all-song migration, audio-first
pipeline. When asked to implement a migration chunk, implement only that chunk and stop; do not start later
phases. Do not silently resolve decisions marked **OPEN QUESTION** in `docs/DESIGN.md`; report them. Fix
problems the chunk exposes only if the chunk needs it, otherwise report them. Other work (imports, UI,
ranking, data fetching) has no such limit.

## Verification

After relevant changes run `npm run build`, `npm run lint`, `npm run validate` and the relevant tests
(`npm test`). For UI changes check the flow with `npm run dev`. Fix failures caused by your change and
report pre-existing ones separately.

## Music data

Check pitches, timing, measures, lyrics, harmony, part assignment and transposition when changing score
data (musical correctness matters as much as code). Do not alter unrelated songs or mass-convert songs
without an explicit request. Do not commit large ML models, audio files or local MusicXML to this repo.
The site is public: no listening counts, dates or other personal data in `src/data/`.

## Completion report

End each task with 3-4 lines: status (done / partial / blocked), checks run with results (build, lint,
validate, tests), and known issues or open questions.
