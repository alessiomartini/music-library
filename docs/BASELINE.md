# Project Baseline

## Baseline date

2026-09-19

## Git state

- Branch: `main`
- HEAD: `a7aece235d91aa7fe90236deed299aaadae36dca`
- Working tree: not clean before this task
- Pre-existing changes: `CLAUDE.md`, `README.md`, and
  `docs/FUTURE-ARCHITECTURE.md`

The pre-existing documentation changes were preserved and are not part of this
baseline commit.

## Verification results

| Command | Result | Notes |
| --- | --- | --- |
| `npm ci` | PASS | Installed the declared dependencies; audit reported no vulnerabilities. |
| `npm run build` | PASS | TypeScript build and Vite production build completed successfully. |
| `npm run lint` | PASS | `oxlint` completed without reported issues. |
| `npm run validate` | PASS | All 5 current songs passed lead-sheet validation. |

## Current architecture snapshot

- Static React/TypeScript/Vite application using `HashRouter`, with `/` and
  `/songs/:slug` routes.
- Dependencies and scripts are declared in `package.json`; the validation
  script bundles `scripts/validate-leadsheets.ts` with esbuild.
- Songs are TypeScript constants in `src/data/songs/` and are collected by
  `src/data/songs/index.ts`. The current `Song` model uses metadata, links,
  optional notes/history, and optional `LeadSheetSystem[]`.
- The legacy lead-sheet model stores duration codes, rests, lyric strings, and
  chord strings. It does not store melody pitch or independent parts.
- `LeadSheetChart` renders an HTML/CSS chord-and-lyrics chart. It is not a
  staff-notation renderer and does not use VexFlow or MusicXML.
- `src/lib/theory.ts` parses and formats English/Italian chords, handles
  accidentals and slash bass, and transposes chords and key labels.
- `src/lib/storage.ts` and `src/lib/prefs.ts` store browser-local preferences,
  per-song settings, and feedback notes in `localStorage`; there is no
  backend synchronization.
- `scripts/validate-leadsheets.ts` checks current lead-sheet presence,
  duration and measure rules, lyric/rest constraints, and chord conversion.
- Current limitations relevant to migration include absent pitches, richer
  timing, independent parts, score rendering, automatic vocal analysis, and
  key recommendation.

## Baseline conclusion

The repository is a suitable starting point for Phase 0.2. The baseline build,
lint, and validation commands all pass, and no application failures require
attention before continuing.

The working tree is not clean because of the pre-existing documentation
changes listed above. Those changes are unrelated to this baseline report and
remain outside this commit.
