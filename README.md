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
- Accordi&Spartiti and Ultimate Guitar links on every non-classical song:
  the direct chords page from `src/data/songs/chordSiteLinks.ts` (slug → URL,
  checked against title and artist; for UG the most-voted "Chords" version),
  otherwise a site search built from title + artist (`src/lib/chordLinks.ts`).
- Links to the Instagram posts saved for a song (`links.instagram`).
- Songs may be "light" entries without key/meter/tempo/score; the page then
  hides the transpose and key-preference controls.
- Text search by title or artist on the home page.
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
treat pitches and chords as a close but unverified transcription. **Anna e Marco**'s
melody is probably written an octave too high: the measurement from the
recording finds the same most-sung notes an octave lower (C4/D4/Bb3 vs
C5/D5/Bb4), which also fits Lucio Dalla's voice. Karaoke MIDI files often
double the melody an octave up.

`ScoreViewer`'s layout is functional but not typeset: multi-line pieces
divide measures evenly per line rather than balancing them, chord symbols are
placed by proportional x-position rather than true rhythmic alignment, and
there's no beaming/tie rendering yet (`ScoreNoteEvent.tie` is not drawn).
There is no automatic vocal-range analysis, pitch-distribution analysis,
automatic key recommendation, or embedded recording/cover players yet — see
[Future Architecture](docs/FUTURE-ARCHITECTURE.md).

## Song Data

`src/data/songs/saved.ts` holds light entries (title, artist, Instagram post
links, `classical` flag) for the pieces in Alessio's Instagram "piano" saved
collection, curated by hand from the post captions of the 2026-10-15 data
export (the export zip and the curation script stay outside the repo).

`src/data/songs/spotify.ts` is generated from Alessio's Spotify Liked Songs
and playlists ([Exportify](https://exportify.app) CSV exports, kept outside
the repo; pass every CSV each time):

```bash
npm run import:spotify -- liked.csv guitar.csv piano.csv ...
```

The same CSVs can be downloaded from the Spotify Web API instead of Exportify:
`npm run fetch:spotify` writes Liked Songs and Alessio's own playlists to
`node_modules/.cache/spotify-csv/` (setup in the header of
`scripts/fetch-spotify.ts`). `.github/workflows/spotify-import.yml` does this
every Monday, runs the import and the checks, commits to main and deploys.

Recordings of a song already in the library give it a direct track link
(`spotifyLinks`, replacing a Spotify search link but never a curated track
link); every other song becomes a light entry (`spotifySongs`). Versions and
covers of one song collapse onto a single entry: the best recording is
`links.spotify`, the others `links.spotifyVersions`, listed on the song page
under "Other versions" together with its Instagram posts. Local files have no
Spotify link and are skipped. The import also keeps each recording's album
cover (`albumImage`, shown on the song page).

`src/data/songs/originals.ts` corrects, by hand, songs whose imported artist
is a cover (a liked Spotify recording by Neri per Caso, Stefano Bollani, Jeff
Buckley...): it sets the original artist and recording, which stays first, and
lists translated versions (Italian Disney dubs...) shown on the original's page
under "In other languages", with links to the recording and to its lyrics.
Jazz standards sung by a later artist take the composer as artist.

`src/data/songs/songInfo.ts` (`npm run fetch:song-info`) holds each song's
language (Wikidata, else the Wikipedia edition, else the artist's country) and
the jazz-standard flag (Wikipedia's lists of jazz standards), used by the list
filters English / Italian / Other languages / Jazz standards.

Every song links to Spotify and YouTube: its own recording when known,
otherwise a title + artist search. The home list shows a badge with the number
of covers (Spotify versions by other artists + Instagram posts); Instagram
covers are named after the account that posted them
(`npm run fetch:instagram-authors`, public oEmbed).

`src/data/songs/youtubeCovers.ts` lists YouTube covers (Paolo Pilo on
accordoTV, chitarradisagio, Allie Sherlock, Fabio Rodrigues and single
covers), matched to songs from the video titles by hand and via the Deezer
search API; a covered song missing from the library becomes a light entry
(`src/lib/youtubeCovers.ts`). Song pages group a performer's videos. Medleys and
videos about an artist or a genre list one entry per song played, identified
from the videos' automatic transcripts (`yt-dlp --write-auto-subs`) or from
viewers' timestamp comments, with the minute in the note ("medley, from 3:20").

`src/data/songs/artists.ts` (`npm run fetch:artists`: Wikipedia, Wikidata,
Wikimedia Commons) gives each artist a photo, chosen closest to the song's
year, and a Wikidata voice type; with the comfortable range set under
"My voice" (default Mi2–Sib4), song pages suggest a key that centres the
singer's typical range in it. No suggestion without a known voice type
(variants such as "lyric tenor" count as their base type). Dated Commons photos
are kept only when taken while the artist was alive or active and named after
them (no plaques, monuments, sleeves or signatures). Wrong Wikipedia matches
(namesakes) are fixed by hand in `scripts/artist-overrides.ts`; re-run the
fetch after editing it (responses are cached in `node_modules/.cache/artists`).

`src/data/songs/history.ts` (`npm run fetch:history`) gives 1243 songs a short
excerpt (2–4 sentences of the lead) of their Wikipedia article, shown under
"History & trivia" with the link to the article and the CC BY-SA 4.0 licence.
The article is found through Wikidata (an item whose performer or composer is
the song's artist and whose label is the title; Italian article for Italian
songs, English otherwise) or, failing that, Wikipedia search (title match, the
lead must name the artist and say it is a song). Redirects to an album and
pages about albums, films or games are rejected; no article, no entry.

`src/data/songs/vocalRanges.ts` (`npm run import:vocal-ranges`, from
`music-library-offline/output/vocal/`) holds the sung notes measured from a
song's recording (Demucs vocal stem + pYIN pitch tracking, see that repo). The
song page shows one histogram with two bars per note: share of the singing time
and share of the sung notes (how many times each is sung). The axis is the same
for every song (C2–C6) and the notes are as sung in the recording, never
transposed, so songs can be compared at a glance; the comfortable range from
"My voice" is shaded. So far measured: Your Song, E cerca 'e me capi, Anna e Marco.

`src/data/songs/keys.ts` holds the key of songs without a curated
`originalKey`, looked up by `npm run fetch:keys` on Hooktheory (hand
analysis) and Ultimate Guitar (official transcriptions; user chord pages as a
hint). When the trusted sources agree the song shows "Key", otherwise
"Possible keys" with each source's answer. Hand-curated
fixes (classical titles, same-title different songs, credits) are in
`scripts/spotify-overrides.ts`; re-run the import after editing them.

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
