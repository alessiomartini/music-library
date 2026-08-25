import { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Dot, Annotation, Stem } from 'vexflow';
import type { LeadSheetMeasure, LeadSheetNote, LeadSheetSystem } from '../lib/types';
import { convertChord, transposePitch, type ChordSystem } from '../lib/theory';

interface Props {
  systems: LeadSheetSystem[];
  timeSignature: string;
  semitones: number;
  preferFlats: boolean;
  chordSystem: ChordSystem;
  showBass: boolean;
}

// The staff/notation is rendered at STAFF_SCALE and shrunk to fit via the
// SVG viewBox, while chord and lyric text sizes are set in "virtual" units
// (their real size / STAFF_SCALE) so their FINAL rendered size stays put
// (or grows) regardless of how small the notation itself gets.
const STAFF_SCALE = 0.6;
const CHORD_FONT_FINAL = 11;
const LYRIC_FONT_FINAL = 12;
const SECTION_LABEL_FONT_FINAL = 12;
const CHORD_FONT = CHORD_FONT_FINAL / STAFF_SCALE;
const LYRIC_FONT = LYRIC_FONT_FINAL / STAFF_SCALE;
const SECTION_LABEL_FONT = SECTION_LABEL_FONT_FINAL / STAFF_SCALE;

const MIN_MEASURE_WIDTH = 60;
const MEASURE_PADDING = 22;
const FIRST_MEASURE_EXTRA = 46;
const MEASURE_GAP = 10;
const STAVE_X = 6;
const ROW_HEADER = 30; // room above the staff for chord symbols
const STAFF_BOTTOM = 40; // staff top to its bottom line, at default line spacing
// Lyric text is compensated back up to LYRIC_FONT_FINAL real pixels regardless
// of STAFF_SCALE, so the virtual-unit gap/height around it must grow as the
// staff shrinks to still reserve enough *real* pixel room for the glyphs.
const LYRIC_GAP = 22; // gap between the lowest content (staff or bass) and the lyric baseline
const LYRIC_HEIGHT = 26; // space reserved below the lyric baseline before the next row
const TOP_PADDING = 8;
// Extra room above a row that starts a new section, for its inline label
// (e.g. "Chorus") — sections flow continuously on one staff, just breaking
// to a new row and getting a small marker instead of a separate box.
const SECTION_LABEL_HEIGHT = 26;
// Rough average glyph width for the lyric font, in virtual units — lyric
// syllables aren't VexFlow modifiers, so their width has to be estimated
// by hand when sizing a measure.
const LYRIC_CHAR_WIDTH = LYRIC_FONT * 0.56;

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

interface MeasureVoices {
  melodyNotes: StaveNote[];
  bassNotes: StaveNote[];
  voices: Voice[];
}

function buildMeasureVoices(
  measure: LeadSheetMeasure,
  timeSignature: string,
  semitones: number,
  preferFlats: boolean,
  chordSystem: ChordSystem,
  showBass: boolean,
): MeasureVoices {
  const beats = timeSignature.split('/').map(Number);

  const melodyNotes = measure.melody.map((n) => toStaveNote(n, semitones, preferFlats, Stem.UP));
  measure.melody.forEach((n, idx) => {
    if (!n.chord) return;
    const text = convertChord(n.chord, semitones, chordSystem, preferFlats);
    const annotation = new Annotation(text);
    annotation.setFont('Arial', CHORD_FONT, 'bold');
    annotation.setVerticalJustification(Annotation.VerticalJustify.TOP);
    melodyNotes[idx].addModifier(annotation);
  });
  const melodyVoice = new Voice({ numBeats: beats[0], beatValue: beats[1] });
  melodyVoice.setStrict(false);
  melodyVoice.addTickables(melodyNotes);

  const voices = [melodyVoice];
  let bassNotes: StaveNote[] = [];
  if (showBass && measure.bass.length > 0) {
    bassNotes = measure.bass.map((n) => toStaveNote(n, semitones, preferFlats, Stem.DOWN));
    const bassVoice = new Voice({ numBeats: beats[0], beatValue: beats[1] });
    bassVoice.setStrict(false);
    bassVoice.addTickables(bassNotes);
    voices.push(bassVoice);
  }

  return { melodyNotes, bassNotes, voices };
}

/** Greedily pack measures into rows that fit within `availWidth`, using
 * each measure's own natural content width (dense measures get more room,
 * sparse ones less, so labels never have to collide to fit a fixed slot).
 * `breakBefore[i]` forces measure i to start a fresh row (used at section
 * boundaries so a section's label always sits at the start of a row). */
function packRows(measureWidths: number[], breakBefore: boolean[], availWidth: number): number[][] {
  const rows: number[][] = [];
  let current: number[] = [];
  let currentWidth = STAVE_X;

  for (let i = 0; i < measureWidths.length; i++) {
    const w = measureWidths[i] + (current.length === 0 ? FIRST_MEASURE_EXTRA : 0);
    const mustBreak = current.length > 0 && breakBefore[i];
    if (current.length > 0 && (mustBreak || currentWidth + w + MEASURE_GAP > availWidth)) {
      rows.push(current);
      current = [];
      currentWidth = STAVE_X;
    }
    const actualW = measureWidths[i] + (current.length === 0 ? FIRST_MEASURE_EXTRA : 0);
    current.push(i);
    currentWidth += actualW + MEASURE_GAP;
  }
  if (current.length > 0) rows.push(current);
  return rows;
}

export function LeadSheetStaff({ systems, timeSignature, semitones, preferFlats, chordSystem, showBass }: Props) {
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

    // Sections flow continuously on one staff rather than as separate boxes:
    // flatten every section's measures into one list, remembering which
    // measure starts a new section so it can get an inline label and a
    // forced row break instead of its own header/container.
    const flatMeasures = systems.flatMap((sys) =>
      sys.measures.map((measure, j) => ({ measure, sectionLabel: j === 0 ? sys.label : undefined })),
    );
    const measures = flatMeasures.map((f) => f.measure);
    const breakBefore = flatMeasures.map((f) => f.sectionLabel !== undefined);

    // Each measure gets exactly the width its own notes/chords/lyrics need,
    // instead of a fixed slot — a busy measure won't force its chord labels
    // to collide, and a sparse one won't waste row space.
    const measureWidths = measures.map((measure) => {
      const { voices } = buildMeasureVoices(measure, timeSignature, semitones, preferFlats, chordSystem, showBass);
      const minWidth = new Formatter().joinVoices(voices).preCalculateMinTotalWidth(voices);
      // Lyric syllables aren't VexFlow modifiers, so preCalculateMinTotalWidth
      // doesn't know about them — approximate the extra room a long syllable
      // (e.g. "trav'ling", "where we") needs beyond its note's own slot.
      const lyricPadding = measure.melody.reduce((sum, n) => {
        const extraChars = n.lyric?.length ?? 0;
        return sum + extraChars * LYRIC_CHAR_WIDTH;
      }, 0);
      return Math.max(MIN_MEASURE_WIDTH, minWidth + MEASURE_PADDING + lyricPadding);
    });

    // Leave a right-hand margin so wide chord annotations near the end of a
    // row have room to spill without hitting the edge.
    const contentWidth = Math.max(MIN_MEASURE_WIDTH + FIRST_MEASURE_EXTRA, width / STAFF_SCALE - 30);
    const rows = packRows(measureWidths, breakBefore, contentWidth);

    // Render with a generous placeholder height, then shrink to the real
    // measured height once every row's actual vertical extent is known.
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, rows.length * 200 + 40);
    const context = renderer.getContext();
    context.scale(STAFF_SCALE, STAFF_SCALE);

    let currentY = TOP_PADDING;

    const svg = container.querySelector('svg');

    rows.forEach((rowMeasureIdxs) => {
      const sectionLabel = flatMeasures[rowMeasureIdxs[0]].sectionLabel;
      let x = STAVE_X;
      const staveY = currentY + (sectionLabel ? SECTION_LABEL_HEIGHT : 0) + ROW_HEADER;
      let rowBottom = staveY + STAFF_BOTTOM;
      const rowMelodyNotes: { notes: StaveNote[]; measure: LeadSheetMeasure }[] = [];

      if (sectionLabel && svg) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', String(STAVE_X));
        label.setAttribute('y', String(currentY + SECTION_LABEL_HEIGHT - 6));
        label.setAttribute('font-size', String(SECTION_LABEL_FONT));
        label.setAttribute('font-family', 'Arial, sans-serif');
        label.setAttribute('font-weight', '700');
        label.setAttribute('class', 'lead-sheet-section-label');
        label.textContent = sectionLabel;
        svg.appendChild(label);
      }

      rowMeasureIdxs.forEach((measureIdx, posInRow) => {
        const measure = measures[measureIdx];
        const isFirstInRow = posInRow === 0;
        const measureWidth = measureWidths[measureIdx] + (isFirstInRow ? FIRST_MEASURE_EXTRA : 0);
        const stave = new Stave(x, staveY, measureWidth);

        if (isFirstInRow) {
          stave.addClef('treble').addTimeSignature(timeSignature);
        }
        stave.setContext(context).draw();

        const { melodyNotes, voices } = buildMeasureVoices(
          measure,
          timeSignature,
          semitones,
          preferFlats,
          chordSystem,
          showBass,
        );
        melodyNotes.forEach((note) => note.setStyle({ fillStyle: melodyColor, strokeStyle: melodyColor }));
        if (voices.length > 1) {
          voices[1].getTickables().forEach((note) => (note as StaveNote).setStyle({ fillStyle: bassColor, strokeStyle: bassColor }));
        }

        const formatWidth = stave.getNoteEndX() - stave.getNoteStartX() - 8;
        new Formatter().joinVoices(voices).format(voices, formatWidth);
        voices.forEach((voice) => voice.draw(context, stave));

        // Measure how far this measure's content actually extends downward
        // (bass notes/ledger lines can go well past the staff), so the
        // lyric line below never collides with it.
        voices.forEach((voice) => {
          const bb = voice.getBoundingBox();
          if (bb) rowBottom = Math.max(rowBottom, bb.getY() + bb.getH());
        });

        rowMelodyNotes.push({ notes: melodyNotes, measure });
        x += measureWidth + MEASURE_GAP;
      });

      const lyricY = rowBottom + LYRIC_GAP;
      rowMelodyNotes.forEach(({ notes, measure }) => {
        measure.melody.forEach((n, idx) => {
          if (!n.lyric || !svg) return;
          const noteX = notes[idx].getAbsoluteX();
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', String(noteX));
          text.setAttribute('y', String(lyricY));
          text.setAttribute('font-size', String(LYRIC_FONT));
          text.setAttribute('font-family', 'Arial, sans-serif');
          text.setAttribute('font-weight', '600');
          text.setAttribute('class', 'melody-lyric');
          text.textContent = n.lyric;
          svg.appendChild(text);
        });
      });

      currentY = lyricY + LYRIC_HEIGHT;
    });

    renderer.resize(width, (currentY + 8) * STAFF_SCALE);
  }, [systems, timeSignature, semitones, preferFlats, chordSystem, showBass, width, themeTick]);

  return (
    <div className="lead-sheet-system">
      <div ref={wrapperRef} className="lead-sheet-canvas-wrapper">
        <div ref={canvasRef} className="lead-sheet-canvas" />
      </div>
    </div>
  );
}
