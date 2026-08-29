import type { LeadSheetMeasure, LeadSheetSystem } from '../lib/types';
import { convertChord, type ChordSystem } from '../lib/theory';

interface Props {
  systems: LeadSheetSystem[];
  semitones: number;
  preferFlats: boolean;
  chordSystem: ChordSystem;
}

/** Beats a duration code is worth, so a syllable can be given horizontal
 * room in proportion to how long it is held. Without a staff there are no
 * note values to read, but keeping the spacing proportional still shows
 * which words rush past and which sit on a long note. */
const BEATS: Record<string, number> = {
  w: 4,
  hd: 3,
  h: 2,
  qd: 1.5,
  q: 1,
  '8d': 0.75,
  '8': 0.5,
  '16': 0.25,
};

function beatsOf(duration: string): number {
  return BEATS[duration] ?? 1;
}

function Measure({
  measure,
  semitones,
  preferFlats,
  chordSystem,
}: {
  measure: LeadSheetMeasure;
  semitones: number;
  preferFlats: boolean;
  chordSystem: ChordSystem;
}) {
  return (
    <div className="chart-measure">
      {measure.melody.map((note, i) => (
        <span className="chart-cell" key={i} style={{ flexGrow: beatsOf(note.duration) }}>
          <span className="chart-chord">
            {note.chord ? convertChord(note.chord, semitones, chordSystem, preferFlats) : ' '}
          </span>
          <span className="chart-lyric">{note.lyric ?? ' '}</span>
        </span>
      ))}
    </div>
  );
}

export function LeadSheetChart({ systems, semitones, preferFlats, chordSystem }: Props) {
  return (
    <div className="chart">
      {systems.map((system) => (
        <section className="chart-system" key={system.label}>
          <h3 className="chart-section-label">{system.label}</h3>
          <div className="chart-measures">
            {system.measures.map((measure, i) => (
              <Measure
                key={i}
                measure={measure}
                semitones={semitones}
                preferFlats={preferFlats}
                chordSystem={chordSystem}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
