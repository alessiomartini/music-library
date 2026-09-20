import { useEffect, useRef, useState } from 'react';
import type { Score, ScoreEvent, ScoreMeasure, ScorePart } from '../lib/score';
import { transposeScore } from '../lib/transpose';
import { keyName, type ChordSystem as TheoryChordSystem } from '../lib/theory';

// VexFlow types - we'll import dynamically. VexFlow 5's ESM build exports
// classes (Renderer, Stave, Voice, ...) directly on the module namespace —
// there is no nested `.Flow` object like in older VexFlow versions.
let Vex: any = null;

async function loadVexFlow() {
  if (Vex) return Vex;
  Vex = await import('vexflow');
  return Vex;
}

interface ScoreViewerProps {
  score: Score;
  semitones?: number;
  preferFlats?: boolean;
  chordSystem?: 'english' | 'italian';
}

function chordQualityToSuffix(quality: string): string {
  const map: Record<string, string> = {
    'major': '',
    'minor': 'm',
    'dominant7': '7',
    'major7': 'maj7',
    'minor7': 'm7',
    'halfDiminished7': 'm7b5',
    'diminished7': 'dim7',
    'augmented': 'aug',
    'sus4': 'sus4',
    'dominant7sus4': '7sus4',
    'major6': '6',
  };
  return map[quality] ?? '';
}

function midiToVexFlowNote(midi: number): { note: string; octave: number } {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const pc = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return { note: noteNames[pc], octave };
}

function ticksToVexFlowDuration(ticks: number, ppq: number): string {
  const quarterNotes = ticks / ppq;
  if (quarterNotes >= 4) return 'w';
  if (quarterNotes >= 3) return 'hd';
  if (quarterNotes >= 2) return 'h';
  if (quarterNotes >= 1.5) return 'qd';
  if (quarterNotes >= 1) return 'q';
  if (quarterNotes >= 0.75) return '8d';
  if (quarterNotes >= 0.5) return '8';
  if (quarterNotes >= 0.25) return '16';
  return '16';
}

function getClefForPart(part: ScorePart): 'treble' | 'bass' | 'alto' {
  switch (part.role) {
    case 'voice':
    case 'instrument':
      return 'treble';
    case 'bass':
      return 'bass';
    default:
      return 'treble';
  }
}

function harmonyChordSymbol(
  h: { root: number; quality: string; slashBass?: number },
  system: TheoryChordSystem,
  preferFlats: boolean,
): string {
  let symbol = `${keyName(h.root, system, preferFlats)}${chordQualityToSuffix(h.quality)}`;
  if (h.slashBass !== undefined) {
    symbol += `/${keyName(h.slashBass, system, preferFlats)}`;
  }
  return symbol;
}

export function ScoreViewer({ score, semitones = 0, preferFlats = false, chordSystem = 'english' }: ScoreViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function render() {
      try {
        await loadVexFlow();
        if (!mounted) return;

        const container = containerRef.current;
        if (!container) return;

        // Transpose score if needed
        const transposedScore = semitones !== 0 ? transposeScore(score, semitones) : score;
        const theorySystem: TheoryChordSystem = chordSystem === 'italian' ? 'it' : 'en';

        // Clear container
        container.innerHTML = '';

        // VexFlow setup
        const VF = Vex;
        const ts = transposedScore.timeSignature;
        const measures = transposedScore.measures;
        const numMeasures = measures.length;

        // One Voice per (part, measure): a VexFlow Voice's tick budget is
        // exactly one measure's worth of beats, so this is the only grouping
        // that keeps the tick math (and therefore the formatter) correct.
        // Cramming a whole line's events into one Voice — the previous
        // approach — silently produced invalid tick totals and crashed.
        const measureWidth = 190;
        const totalWidth = Math.min(900, container.clientWidth || 900);
        const measuresPerLine = Math.max(1, Math.min(4, Math.floor((totalWidth - 40) / measureWidth)));
        const numLines = Math.ceil(numMeasures / measuresPerLine);
        const partHeight = 100;
        const chordRowHeight = 30;
        const linePadding = 40;
        const lineHeight = transposedScore.parts.length * partHeight + chordRowHeight + linePadding;

        const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
        renderer.resize(totalWidth, numLines * lineHeight + 20);
        const context = renderer.getContext();
        context.setFont('Arial', 10);

        function eventsForMeasure(part: ScorePart, measure: ScoreMeasure): ScoreEvent[] {
          return part.events
            .filter((e) => e.start >= measure.start && e.start < measure.start + measure.duration)
            .sort((a, b) => a.start - b.start);
        }

        let y = 10 + chordRowHeight;
        for (let line = 0; line < numLines; line++) {
          const startMeasure = line * measuresPerLine;
          const endMeasure = Math.min(startMeasure + measuresPerLine, numMeasures);

          let partY = y;
          for (const [partIndex, part] of transposedScore.parts.entries()) {
            const clef = getClefForPart(part);
            let x = 20;

            for (let m = startMeasure; m < endMeasure; m++) {
              const measure = measures[m];
              const stave = new VF.Stave(x, partY, measureWidth);
              if (m === startMeasure) stave.addClef(clef);
              if (line === 0 && m === 0 && partIndex === 0) {
                stave.addTimeSignature(`${ts.numerator}/${ts.denominator}`);
                stave.addKeySignature(transposedScore.originalKey.replace('m', ''));
              }
              stave.setContext(context).draw();

              const voice = new VF.Voice({ num_beats: ts.numerator, beat_value: ts.denominator });
              voice.setStrict(false);

              const measureEvents = eventsForMeasure(part, measure);
              if (measureEvents.length === 0) {
                voice.addTickable(new VF.GhostNote({ duration: 'w' }));
              } else {
                for (const event of measureEvents) {
                  const duration = ticksToVexFlowDuration(event.duration, score.ppq);
                  if (event.kind === 'rest') {
                    voice.addTickable(new VF.StaveNote({ keys: ['b/4'], duration: `${duration}r`, clef }));
                    continue;
                  }
                  const { note: noteName, octave } = midiToVexFlowNote(event.pitch);
                  const vfNote = new VF.StaveNote({ keys: [`${noteName}/${octave}`], duration, clef });
                  const lyric = event.lyrics?.[0];
                  if (lyric?.text) {
                    vfNote.addModifier(
                      new VF.Annotation(lyric.text)
                        .setFont('Arial', 10)
                        .setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM),
                      0,
                    );
                  }
                  voice.addTickable(vfNote);
                }
              }

              new VF.Formatter().joinVoices([voice]).format([voice], measureWidth - 20);
              voice.draw(context, stave);

              // Chord symbols above the top part only. Positioned
              // proportionally within the measure rather than through
              // VexFlow's tickable system: harmony segment lengths rarely
              // land on a standard notated duration, and forcing them into
              // the Voice's tick budget is what caused the previous crash.
              if (partIndex === 0) {
                const harmonyHere = transposedScore.harmony.filter(
                  (h) => h.start < measure.start + measure.duration && h.start + h.duration > measure.start,
                );
                if (harmonyHere.length > 0) {
                  const contentStart = stave.getNoteStartX();
                  const contentWidth = stave.getNoteEndX() - contentStart;
                  context.save();
                  context.setFont('Arial', 12, 'bold');
                  for (const h of harmonyHere) {
                    const relStart = Math.max(0, h.start - measure.start);
                    const chordX = contentStart + (relStart / measure.duration) * contentWidth;
                    context.fillText(harmonyChordSymbol(h, theorySystem, preferFlats), chordX, stave.getYForTopText(1));
                  }
                  context.restore();
                }
              }

              x += measureWidth;
            }
            partY += partHeight;
          }
          y = partY + linePadding;
        }

        setRendered(true);
        setError(null);
      } catch (err) {
        console.error('ScoreViewer render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render score');
      }
    }

    render();

    return () => {
      mounted = false;
    };
  }, [score, semitones, preferFlats, chordSystem]);

  if (error) {
    return (
      <div className="score-viewer error" role="alert">
        <p>Error rendering score: {error}</p>
      </div>
    );
  }

  return (
    <div className="score-viewer" style={{ overflowX: 'auto' }}>
      {!rendered && <div className="score-viewer-loading">Loading score…</div>}
      {/* VexFlow draws directly into this node's DOM; it must never also be a
          React-rendered-children container, or React's reconciliation and
          VexFlow's direct innerHTML writes fight over the same nodes. */}
      <div ref={containerRef} />
    </div>
  );
}