# Claude Code instructions

## Project

Vite/TypeScript music-library application with lead-sheet validation.

## Verification

- Install with `npm ci` when needed.
- Run `npm run build`, `npm run lint`, and `npm run validate` after relevant changes.
- Use `npm run dev` for UI changes and inspect the affected flow in a browser.

## Workflow

- Read `README.md` and the affected component/data/script first.
- Preserve music data formats and validation rules; test representative valid and
  invalid lead sheets.
- Do not commit credentials, generated bundles, or unrelated formatting.
- Inspect `git diff` and report verification results before committing.
