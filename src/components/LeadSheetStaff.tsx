import { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Dot, Annotation, Stem } from 'vexflow';
import type { LeadSheetNote, LeadSheetSystem } from '../lib/types';
import { convertChord, transposePitch, type ChordSystem } from '../lib/theory';

interface Props {
  system: LeadSheetSystem;
  timeSignature: string;
  semitones: number;
  preferFlats: boolean;
  chordSystem: ChordSystem;
  showBass: boolean;
  tempo?: { bpm: number; marking?: string };
}

const MEASURE_WIDTH = 150;
const FIRST_MEASURE_EXTRA = 48;
const MEASURE_GAP = 12;
const STAVE_X = 8;
const ROW_HEIGHT = 168;
const ROW_HEADER = 58;
const BOTTOM_PADDING = 24;

function toStaveNote(n: LeadSheetNote, semitones: number, preferFlats: boolean, stemDirection: number) {
  if (n.rest) {
    return new StaveNote({ keys: ['b/4'], duration: n.duration.replace('d', '') + 'r' });
  }
  const pitch = transposePitch(n.pitch, semitones, preferFlats);
  const accidental = pitch.split('/')[0].slice(1);
  const note = new StaveNote({
    keys: [pitch],
    duration: n.duration.replace('d', ''),
    stemDirection,
    autoStem: false,
  });
  if (accidental === '#' || accidental === 'b' || accidental === 'n') {
    note.addModifier(new Accidental(accidental));
  }
  if (n.duration.endsWith('d')) {
    Dot.buildAndAttach([note], { all: true });
  }
  return note;
}

/** Greedily pack measure indices into rows that fit within `availWidth`. */
function packRows(measureCount: number, availWidth: number): number[][] {
  const rows: number[][] = [];
  let current: number[] = [];
  let currentWidth = STAVE_X;

  for (let i = 0; i < measureCount; i++) {
    const w = MEASURE_WIDTH + (current.length === 0 ? FIRST_MEASURE_EXTRA : 0);
    if (current.length > 0 && currentWidth + w + MEASURE_GAP > availWidth) {
      rows.push(current);
      current = [];
      currentWidth = STAVE_X;
    }
    const actualW = MEASURE_WIDTH + (current.length === 0 ? FIRST_MEASURE_EXTRA : 0);
    current.push(i);
    currentWidth += actualW + MEASURE_GAP;
  }
  if (current.length > 0) rows.push(current);
  return rows;
}

export function LeadSheetStaff({ system, timeSignature, semitones, preferFlats, chordSystem, showBass, tempo }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setThemeTick((t) => t + 1);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container || width <= 0) return;
    container.innerHTML = '';

    // Resolve theme colors to literal values: VexFlow writes colors as raw
    // SVG presentation attributes, and var(...) inside those is unreliable
    // on some mobile browsers, so bake in the actual computed color instead.
    const computed = getComputedStyle(container);
    const melodyColor = computed.getPropertyValue('--melody-color').trim() || '#08060d';
    const bassColor = computed.getPropertyValue('--bass-color').trim() || '#b45309';

    // Leave a right-hand margin so wide chord annotations near the end of a
    // row (e.g. "Re7sus4/Fa#") have room to spill without hitting the edge.
    const contentWidth = Math.max(MEASURE_WIDTH + FIRST_MEASURE_EXTRA, width - 65);
    const rows = packRows(system.measures.length, contentWidth);
    const totalHeight = rows.length * ROW_HEIGHT + BOTTOM_PADDING;

    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, totalHeight);
    const context = renderer.getContext();

    rows.forEach((rowMeasureIdxs, rowIdx) => {
      let x = STAVE_X;
      const staveY = rowIdx * ROW_HEIGHT + ROW_HEADER;

      rowMeasureIdxs.forEach((measureIdx, posInRow) => {
        const measure = system.measures[measureIdx];
        const isFirstInRow = posInRow === 0;
        const measureWidth = MEASURE_WIDTH + (isFirstInRow ? FIRST_MEASURE_EXTRA : 0);
        const stave = new Stave(x, staveY, measureWidth);

        if (isFirstInRow) {
          stave.addClef('treble').addTimeSignature(timeSignature);
          if (tempo && rowIdx === 0) {
            stave.setTempo({ duration: 'q', bpm: tempo.bpm, name: tempo.marking }, -18);
          }
        }
        stave.setContext(context).draw();

        const melodyNotes = measure.melody.map((n) => toStaveNote(n, semitones, preferFlats, Stem.UP));
        melodyNotes.forEach((note) => note.setStyle({ fillStyle: melodyColor, strokeStyle: melodyColor }));

        measure.melody.forEach((n, idx) => {
          if (!n.chord) return;
          const text = convertChord(n.chord, semitones, chordSystem, preferFlats);
          const annotation = new Annotation(text);
          annotation.setFont('Arial', 12, 'bold');
          annotation.setVerticalJustification(Annotation.VerticalJustify.TOP);
          melodyNotes[idx].addModifier(annotation);
        });

        const beats = timeSignature.split('/').map(Number);
        const melodyVoice = new Voice({ numBeats: beats[0], beatValue: beats[1] });
        melodyVoice.setStrict(false);
        melodyVoice.addTickables(melodyNotes);

        const voices = [melodyVoice];
        if (showBass && measure.bass.length > 0) {
          const bassNotes = measure.bass.map((n) => toStaveNote(n, semitones, preferFlats, Stem.DOWN));
          bassNotes.forEach((note) => note.setStyle({ fillStyle: bassColor, strokeStyle: bassColor }));
          const bassVoice = new Voice({ numBeats: beats[0], beatValue: beats[1] });
          bassVoice.setStrict(false);
          bassVoice.addTickables(bassNotes);
          voices.push(bassVoice);
        }

        const formatWidth = stave.getNoteEndX() - stave.getNoteStartX() - 10;
        new Formatter().joinVoices(voices).format(voices, formatWidth);
        voices.forEach((voice) => voice.draw(context, stave));

        // Lyrics under the melody notes.
        const svg = container.querySelector('svg');
        measure.melody.forEach((n, idx) => {
          if (!n.lyric || !svg) return;
          const noteX = melodyNotes[idx].getAbsoluteX();
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', String(noteX));
          text.setAttribute('y', String(staveY + 65));
          text.setAttribute('font-size', '10.5');
          text.setAttribute('class', 'melody-lyric');
          text.textContent = n.lyric;
          svg.appendChild(text);
        });

        x += measureWidth + MEASURE_GAP;
      });
    });
  }, [system, timeSignature, semitones, preferFlats, chordSystem, showBass, tempo, width, themeTick]);

  return (
    <div className="lead-sheet-system">
      <div className="lead-sheet-system-label">{system.label}</div>
      <div ref={wrapperRef} className="lead-sheet-canvas-wrapper">
        <div ref={canvasRef} className="lead-sheet-canvas" />
      </div>
    </div>
  );
}
