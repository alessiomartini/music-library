/**
 * Structural validator for the engraved lead sheets.
 *
 * Catches the kinds of mistakes that are invisible in the data but obvious on
 * the staff: measures that don't add up to a full bar, pitches VexFlow can't
 * render, chord symbols the transposer can't parse, melody notes outside a
 * singable range, and bass notes low enough to collide with the lyric line.
 *
 * Run with:  npm run validate
 */
import { songs } from '../src/data/songs';
import { convertChord } from '../src/lib/theory';
import type { LeadSheetNote, Song } from '../src/lib/types';

const BEAT_VALUE: Record<string, number> = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25, '32': 0.125 };
const PITCH_RE = /^[a-g](#|b|n)?\/[0-9]$/;
const STEPS = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

/** Absolute diatonic position, for range comparisons. */
function diatonic(pitch: string): number {
  const [name, octave] = pitch.split('/');
  return Number(octave) * 7 + STEPS.indexOf(name[0]);
}

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

// A singable melody range, and the depth past which a bass note grows enough
// ledger lines to crowd the lyric line beneath the staff.
const MELODY_LOW = diatonic('a/3');
const MELODY_HIGH = diatonic('c/6');
const BASS_LOW = diatonic('c/4');

function checkVoice(
  song: Song,
  where: string,
  voice: 'melody' | 'bass',
  notes: LeadSheetNote[],
  expectedBeats: number,
) {
  if (notes.length === 0) {
    if (voice === 'melody') report(song.title, where, 'melody is empty');
    return;
  }

  let total = 0;
  for (const [i, n] of notes.entries()) {
    const b = beats(n.duration);
    if (b === null) {
      report(song.title, where, `${voice}[${i}]: unknown duration "${n.duration}"`);
      continue;
    }
    total += b;

    if (!n.rest) {
      if (!PITCH_RE.test(n.pitch)) {
        report(song.title, where, `${voice}[${i}]: malformed pitch "${n.pitch}"`);
      } else {
        const d = diatonic(n.pitch);
        if (voice === 'melody' && (d < MELODY_LOW || d > MELODY_HIGH)) {
          report(song.title, where, `${voice}[${i}]: pitch ${n.pitch} outside a singable range`);
        }
        if (voice === 'bass' && d < BASS_LOW) {
          report(song.title, where, `${voice}[${i}]: pitch ${n.pitch} sits too low under the staff`);
        }
      }
    }

    if (n.lyric !== undefined && n.lyric.trim() === '') {
      report(song.title, where, `${voice}[${i}]: empty lyric string (drop the field instead)`);
    }
    if (voice === 'bass' && n.lyric) {
      report(song.title, where, `${voice}[${i}]: lyric on a bass note is never rendered`);
    }
    if (n.rest && n.lyric) {
      report(song.title, where, `${voice}[${i}]: lyric on a rest is never sung`);
    }

    if (n.chord) {
      const converted = convertChord(n.chord, 0, 'en', false);
      if (!converted || converted === n.chord.slice(0, 0)) {
        report(song.title, where, `${voice}[${i}]: chord "${n.chord}" did not convert`);
      }
    }
  }

  if (Math.abs(total - expectedBeats) > 1e-9) {
    report(song.title, where, `${voice} adds up to ${total} beats, expected ${expectedBeats}`);
  }
}

for (const song of songs) {
  if (!song.leadSheet?.length) {
    report(song.title, '-', 'no lead sheet');
    continue;
  }

  const [num, den] = song.timeSignature.split('/').map(Number);
  const expectedBeats = num * (4 / den);

  for (const system of song.leadSheet) {
    system.measures.forEach((measure, i) => {
      const where = `${system.label} m${i + 1}`;
      checkVoice(song, where, 'melody', measure.melody, expectedBeats);
      if (measure.bass.length > 0) {
        checkVoice(song, where, 'bass', measure.bass, expectedBeats);
      }
    });
  }
}

// Summary
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
  console.log(`${status} ${song.title}  (${measures} measures, ${lyrics} lyric syllables)`);
  for (const p of found) console.log(`       ${p.where}: ${p.message}`);
}

console.log(
  problems.length === 0
    ? `\nAll ${songs.length} songs pass.`
    : `\n${problems.length} problem(s) across ${bySong.size} song(s).`,
);
process.exit(problems.length === 0 ? 0 : 1);
