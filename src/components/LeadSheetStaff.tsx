import { useEffect, useRef } from 'react';
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

const MEASURE_WIDTH = 190;
const FIRST_MEASURE_EXTRA = 55;
const MEASURE_GAP = 14;
const STAVE_X = 10;
const STAVE_Y = 60;
const SYSTEM_HEIGHT = 220;

const MELODY_COLOR = 'var(--melody-color, #08060d)';
const BASS_COLOR = 'var(--bass-color, #b45309)';

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

export function LeadSheetStaff({ system, timeSignature, semitones, preferFlats, chordSystem, showBass, tempo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const width =
      system.measures.length * (MEASURE_WIDTH + MEASURE_GAP) + FIRST_MEASURE_EXTRA + 20;
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, SYSTEM_HEIGHT);
    const context = renderer.getContext();

    let x = STAVE_X;

    system.measures.forEach((measure, i) => {
      const measureWidth = MEASURE_WIDTH + (i === 0 ? FIRST_MEASURE_EXTRA : 0);
      const stave = new Stave(x, STAVE_Y, measureWidth);

      if (i === 0) {
        stave.addClef('treble').addTimeSignature(timeSignature);
        if (tempo) {
          stave.setTempo({ duration: 'q', bpm: tempo.bpm, name: tempo.marking }, -18);
        }
      }
      stave.setContext(context).draw();

      const melodyNotes = measure.melody.map((n) => toStaveNote(n, semitones, preferFlats, Stem.UP));
      melodyNotes.forEach((note) => note.setStyle({ fillStyle: MELODY_COLOR, strokeStyle: MELODY_COLOR }));

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
      let bassNotes: StaveNote[] = [];
      if (showBass && measure.bass.length > 0) {
        bassNotes = measure.bass.map((n) => toStaveNote(n, semitones, preferFlats, Stem.DOWN));
        bassNotes.forEach((note) => note.setStyle({ fillStyle: BASS_COLOR, strokeStyle: BASS_COLOR }));
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
        text.setAttribute('y', String(STAVE_Y + 65));
        text.setAttribute('font-size', '10.5');
        text.setAttribute('class', 'melody-lyric');
        text.textContent = n.lyric;
        svg.appendChild(text);
      });

      x += measureWidth + MEASURE_GAP;
    });
  }, [system, timeSignature, semitones, preferFlats, chordSystem, showBass, tempo]);

  return (
    <div className="lead-sheet-system">
      <div className="lead-sheet-system-label">{system.label}</div>
      <div ref={containerRef} className="lead-sheet-canvas" />
    </div>
  );
}
