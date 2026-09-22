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

// Shared offscreen canvas for measuring rendered text width (lyrics), so
// measure widths can be sized to actually fit their content instead of
// guessing from character count.
let measureCanvas: HTMLCanvasElement | null = null;
function measureTextWidth(text: string, font: string): number {
  if (!measureCanvas) measureCanvas = document.createElement('canvas');
  const ctx = measureCanvas.getContext('2d');
  if (!ctx) return text.length * 6;
  ctx.font = font;
  return ctx.measureText(text).width;
}

const MIN_EVENT_WIDTH = 34;
const EMPTY_MEASURE_WIDTH = 60;
const MEASURE_MIN_WIDTH = 90;
const MEASURE_END_PADDING = 20;
// Extra room reserved on the first measure of each line for the clef,
// key signature, and (on the very first line) time signature.
const LINE_START_EXTRA_WIDTH = 55;
const CHORD_GAP = 18;
// A note this short or shorter (in quarter notes) gets beamed to its
// neighbors instead of an individual flag, matching normal engraving.
const BEAM_ELIGIBLE_MAX_QUARTER_NOTES = 0.5;

// Minimum horizontal space an event needs so its notehead and (if present)
// lyric annotation don't collide with its neighbors. Wider for longer
// durations (roughly proportional to sqrt of the note value, as in
// conventional music engraving) and widened further to fit the lyric text.
function eventSlotWidth(event: ScoreEvent, ppq: number): number {
  const quarterNotes = event.duration / ppq;
  const base = Math.max(MIN_EVENT_WIDTH, 20 + Math.sqrt(quarterNotes) * 26);
  const lyricText = event.kind === 'rest' ? undefined : event.lyrics?.[0]?.text;
  if (!lyricText) return base;
  const lyricWidth = measureTextWidth(lyricText, '10px Arial') + 12;
  return Math.max(base, lyricWidth);
}

// Groups consecutive eighth-note-or-shorter events into beam groups the way
// conventional engraving does: a group never crosses a beat boundary, and a
// rest (or a longer note) breaks the current group. Returns arrays of
// VexFlow StaveNotes ready to pass to `new VF.Beam(...)`; groups of a single
// note are omitted (an isolated short note keeps its own flag).
function computeBeamGroups(
  measureEvents: ScoreEvent[],
  vfNotes: unknown[],
  measureStart: number,
  ppq: number,
  ticksPerBeat: number,
): unknown[][] {
  const groups: unknown[][] = [];
  let current: unknown[] = [];
  let currentBeat: number | null = null;

  function flush() {
    if (current.length > 1) groups.push(current);
    current = [];
    currentBeat = null;
  }

  measureEvents.forEach((event, i) => {
    const quarterNotes = event.duration / ppq;
    const eligible = event.kind !== 'rest' && quarterNotes <= BEAM_ELIGIBLE_MAX_QUARTER_NOTES;
    if (!eligible) {
      flush();
      return;
    }
    const beat = Math.floor((event.start - measureStart) / ticksPerBeat);
    if (currentBeat !== null && beat !== currentBeat) flush();
    currentBeat = beat;
    current.push(vfNotes[i]);
  });
  flush();
  return groups;
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
        function eventsForMeasure(part: ScorePart, measure: ScoreMeasure): ScoreEvent[] {
          return part.events
            .filter((e) => e.start >= measure.start && e.start < measure.start + measure.duration)
            .sort((a, b) => a.start - b.start);
        }

        function harmonyForMeasure(measure: ScoreMeasure) {
          return transposedScore.harmony.filter(
            (h) => h.start < measure.start + measure.duration && h.start + h.duration > measure.start,
          );
        }

        // Each measure gets exactly as much width as its densest part needs
        // (notes + any lyrics under them), instead of a fixed width — this is
        // what keeps dense measures and long lyrics from overlapping. Also
        // reserve enough room for that measure's chord symbols packed
        // side-by-side, so fast harmony changes don't collide either.
        const measureWidths: number[] = measures.map((measure) => {
          let widest = MEASURE_MIN_WIDTH;
          for (const part of transposedScore.parts) {
            const events = eventsForMeasure(part, measure);
            const content =
              events.length === 0
                ? EMPTY_MEASURE_WIDTH
                : events.reduce((sum, e) => sum + eventSlotWidth(e, score.ppq), 0);
            widest = Math.max(widest, content + MEASURE_END_PADDING);
          }
          const harmonyWidth = harmonyForMeasure(measure).reduce(
            (sum, h) => sum + measureTextWidth(harmonyChordSymbol(h, theorySystem, preferFlats), 'bold 12px Arial') + CHORD_GAP,
            0,
          );
          widest = Math.max(widest, harmonyWidth + MEASURE_END_PADDING);
          return widest;
        });

        // Pack measures into lines by actual accumulated width (available
        // container width), instead of a fixed measure count per line, so
        // the number of measures per line adapts to both the screen width
        // and how much room each measure's content needs.
        const availableWidth = Math.max(320, container.clientWidth || 900);
        const lines: { start: number; end: number; width: number }[] = [];
        {
          let start = 0;
          while (start < numMeasures) {
            let width = 20 + measureWidths[start] + LINE_START_EXTRA_WIDTH;
            let end = start + 1;
            while (end < numMeasures && width + measureWidths[end] <= availableWidth) {
              width += measureWidths[end];
              end++;
            }
            lines.push({ start, end, width: width + 20 });
            start = end;
          }
        }
        const numLines = lines.length;
        const totalWidth = Math.max(availableWidth, ...lines.map((l) => l.width));
        const partHeight = 100;
        const chordRowHeight = 30;
        const linePadding = 40;
        const lineHeight = transposedScore.parts.length * partHeight + chordRowHeight + linePadding;

        const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
        renderer.resize(totalWidth, numLines * lineHeight + 20);
        const context = renderer.getContext();
        context.setFont('Arial', 10);

        let y = 10 + chordRowHeight;
        for (const { start: startMeasure, end: endMeasure } of lines) {
          let partY = y;
          let lastChordEndX = -Infinity;
          for (const [partIndex, part] of transposedScore.parts.entries()) {
            const clef = getClefForPart(part);
            let x = 20;

            for (let m = startMeasure; m < endMeasure; m++) {
              const measure = measures[m];
              const staveWidth = measureWidths[m] + (m === startMeasure ? LINE_START_EXTRA_WIDTH : 0);
              const stave = new VF.Stave(x, partY, staveWidth);
              if (m === startMeasure) stave.addClef(clef);
              if (startMeasure === 0 && m === 0 && partIndex === 0) {
                stave.addTimeSignature(`${ts.numerator}/${ts.denominator}`);
                stave.addKeySignature(transposedScore.originalKey.replace('m', ''));
              }
              stave.setContext(context).draw();

              const voice = new VF.Voice({ num_beats: ts.numerator, beat_value: ts.denominator });
              voice.setStrict(false);

              const measureEvents = eventsForMeasure(part, measure);
              const vfNotesInOrder: unknown[] = [];
              if (measureEvents.length === 0) {
                voice.addTickable(new VF.GhostNote({ duration: 'w' }));
              } else {
                for (const event of measureEvents) {
                  const duration = ticksToVexFlowDuration(event.duration, score.ppq);
                  if (event.kind === 'rest') {
                    const vfRest = new VF.StaveNote({ keys: ['b/4'], duration: `${duration}r`, clef });
                    vfNotesInOrder.push(vfRest);
                    voice.addTickable(vfRest);
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
                  vfNotesInOrder.push(vfNote);
                  voice.addTickable(vfNote);
                }
              }

              new VF.Formatter()
                .joinVoices([voice])
                .format([voice], stave.getNoteEndX() - stave.getNoteStartX());
              voice.draw(context, stave);

              if (measureEvents.length > 0) {
                const ticksPerBeat = (score.ppq * 4) / ts.denominator;
                const beamGroups = computeBeamGroups(measureEvents, vfNotesInOrder, measure.start, score.ppq, ticksPerBeat);
                for (const group of beamGroups) {
                  new VF.Beam(group).setContext(context).draw();
                }
              }

              // Chord symbols above the top part only. Positioned
              // proportionally within the measure rather than through
              // VexFlow's tickable system: harmony segment lengths rarely
              // land on a standard notated duration, and forcing them into
              // the Voice's tick budget is what caused the previous crash.
              if (partIndex === 0) {
                const harmonyHere = harmonyForMeasure(measure);
                if (harmonyHere.length > 0) {
                  const contentStart = stave.getNoteStartX();
                  const contentWidth = stave.getNoteEndX() - contentStart;
                  const chordFont = 'bold 12px Arial';
                  context.save();
                  context.setFont('Arial', 12, 'bold');
                  for (const h of harmonyHere) {
                    const symbol = harmonyChordSymbol(h, theorySystem, preferFlats);
                    const relStart = Math.max(0, h.start - measure.start);
                    const proposedX = contentStart + (relStart / measure.duration) * contentWidth;
                    // Never let this chord symbol start before the previous
                    // one (in this line) has finished, even if the measure
                    // widened for note/lyric content rather than harmony.
                    const chordX = Math.max(proposedX, lastChordEndX);
                    context.fillText(symbol, chordX, stave.getYForTopText(1));
                    lastChordEndX = chordX + measureTextWidth(symbol, chordFont) + CHORD_GAP;
                  }
                  context.restore();
                }
              }

              x += staveWidth;
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

    // Re-render on resize (sidebar toggle, window resize, orientation
    // change, ...) so the measure-per-line count keeps matching the actual
    // available width. Observes the wrapper, not the VexFlow-drawn container
    // itself, since the container's own width follows its drawn content.
    let resizeTimeout: number | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const wrapper = containerRef.current?.parentElement;
    if (wrapper && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (!mounted) return;
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
          if (mounted) render();
        }, 150);
      });
      resizeObserver.observe(wrapper);
    }

    return () => {
      mounted = false;
      resizeObserver?.disconnect();
      window.clearTimeout(resizeTimeout);
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