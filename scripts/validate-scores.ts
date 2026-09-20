/**
 * Structural validator for published song scores.
 *
 * Catches mistakes that are invisible in the data but would break rendering,
 * transposition, or analysis: malformed score envelopes, overlapping or
 * misordered events, chord symbols the transposer can't parse.
 *
 * A song with no score yet is reported as PENDING, not FAIL: that's an
 * expected, temporary state during incremental migration (see
 * docs/FUTURE-ARCHITECTURE.md), not a data defect. Only a *present but
 * malformed* score fails the run.
 *
 * Run with:  npm run validate
 */
import { songs } from '../src/data/songs';
import { validateScore } from '../src/lib/score';

interface Problem {
  song: string;
  where: string;
  message: string;
}

const problems: Problem[] = [];
function report(song: string, where: string, message: string) {
  problems.push({ song, where, message });
}

const pending: string[] = [];

for (const song of songs) {
  if (!song.score) {
    pending.push(song.title);
    continue;
  }
  for (const issue of validateScore(song.score)) {
    report(song.title, `score.${issue.path}`, issue.message);
  }
}

const bySong = new Map<string, Problem[]>();
for (const p of problems) {
  if (!bySong.has(p.song)) bySong.set(p.song, []);
  bySong.get(p.song)!.push(p);
}

for (const song of songs) {
  if (!song.score) {
    console.log(`PEND ${song.title}  (no score published yet)`);
    continue;
  }
  const found = bySong.get(song.title) ?? [];
  const events = song.score.parts.reduce((n, part) => n + part.events.length, 0);
  const harmonyEvents = song.score.harmony.length;
  const status = found.length === 0 ? 'OK  ' : 'FAIL';
  console.log(`${status} ${song.title}  (${events} events, ${harmonyEvents} harmony events)`);
  for (const p of found) console.log(`       ${p.where}: ${p.message}`);
}

const validated = songs.length - pending.length;
console.log(
  problems.length === 0
    ? `\n${validated}/${songs.length} songs have a valid score (${pending.length} pending: ${pending.join(', ') || 'none'}).`
    : `\n${problems.length} problem(s) across ${bySong.size} song(s).`,
);
process.exit(problems.length === 0 ? 0 : 1);
