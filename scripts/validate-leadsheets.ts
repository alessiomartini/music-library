/**
 * Structural validator for the chord charts.
 *
 * Catches the mistakes that are invisible in the data but obvious once a bar
 * is laid out: measures that don't add up, duration codes nothing can space,
 * chord symbols the transposer can't parse, and stray lyric fields.
 *
 * Run with:  npm run validate
 */
import { songs } from '../src/data/songs';
import { convertChord } from '../src/lib/theory';

const BEAT_VALUE: Record<string, number> = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25, '32': 0.125 };

function beats(duration: string): number | null {
  const dotted = duration.endsWith('d');
  const base = BEAT_VALUE[dotted ? duration.slice(0, -1) : duration];
  if (base === undefined) return null;
  return dotted ? base * 1.5 : base;
}

interface Problem {
  song: string;
  where: string;
  message: string;
}

const problems: Problem[] = [];
function report(song: string, where: string, message: string) {
  problems.push({ song, where, message });
}

for (const song of songs) {
  if (!song.leadSheet?.length) {
    report(song.title, '-', 'no chart');
    continue;
  }

  const [num, den] = song.timeSignature.split('/').map(Number);
  const expectedBeats = num * (4 / den);

  for (const system of song.leadSheet) {
    system.measures.forEach((measure, i) => {
      const where = `${system.label} m${i + 1}`;

      if (measure.melody.length === 0) {
        report(song.title, where, 'bar is empty');
        return;
      }

      let total = 0;
      for (const [j, n] of measure.melody.entries()) {
        const b = beats(n.duration);
        if (b === null) {
          report(song.title, where, `[${j}]: unknown duration "${n.duration}"`);
          continue;
        }
        total += b;

        if (n.lyric !== undefined && n.lyric.trim() === '') {
          report(song.title, where, `[${j}]: empty lyric string (drop the field instead)`);
        }
        if (n.rest && n.lyric) {
          report(song.title, where, `[${j}]: lyric on a rest is never sung`);
        }
        if (n.chord && convertChord(n.chord, 0, 'en', false) === n.chord.slice(0, 0)) {
          report(song.title, where, `[${j}]: chord "${n.chord}" did not convert`);
        }
      }

      if (Math.abs(total - expectedBeats) > 1e-9) {
        report(song.title, where, `adds up to ${total} beats, expected ${expectedBeats}`);
      }
    });
  }
}

const bySong = new Map<string, Problem[]>();
for (const p of problems) {
  if (!bySong.has(p.song)) bySong.set(p.song, []);
  bySong.get(p.song)!.push(p);
}

for (const song of songs) {
  const found = bySong.get(song.title) ?? [];
  const measures = song.leadSheet?.reduce((n, s) => n + s.measures.length, 0) ?? 0;
  const lyrics =
    song.leadSheet?.reduce(
      (n, s) => n + s.measures.reduce((m, x) => m + x.melody.filter((y) => y.lyric).length, 0),
      0,
    ) ?? 0;
  const status = found.length === 0 ? 'OK  ' : 'FAIL';
  console.log(`${status} ${song.title}  (${measures} bars, ${lyrics} lyric syllables)`);
  for (const p of found) console.log(`       ${p.where}: ${p.message}`);
}

console.log(
  problems.length === 0
    ? `\nAll ${songs.length} songs pass.`
    : `\n${problems.length} problem(s) across ${bySong.size} song(s).`,
);
process.exit(problems.length === 0 ? 0 : 1);
