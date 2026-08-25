import { useEffect, useRef } from 'react';
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Accidental,
  Dot,
  Annotation,
  StaveConnector,
} from 'vexflow';
import type { LeadSheetNote, LeadSheetSystem } from '../lib/types';
import { convertChord, transposePitch, type ChordSystem } from '../lib/theory';

interface Props {
  system: LeadSheetSystem;
  timeSignature: string;
  semitones: number;
  preferFlats: boolean;
  chordSystem: ChordSystem;
  tempo?: { bpm: number; marking?: string };
}

const MEASURE_WIDTH = 190;
const FIRST_MEASURE_EXTRA = 60;
const MEASURE_GAP = 14;
const STAVE_X = 10;
const TREBLE_Y = 60;
const BASS_Y = 178;
const SYSTEM_HEIGHT = 260;

function toStaveNote(n: LeadSheetNote, semitones: number, preferFlats: boolean, clef: 'treble' | 'bass') {
  if (n.rest) {
    return new StaveNote({ keys: [clef === 'bass' ? 'd/3' : 'b/4'], duration: n.duration + 'r', clef });
  }
  const pitch = transposePitch(n.pitch, semitones, preferFlats);
  const accidental = pitch.split('/')[0].slice(1);
  const note = new StaveNote({ keys: [pitch], duration: n.duration.replace('d', ''), clef });
  if (accidental === '#' || accidental === 'b' || accidental === 'n') {
    note.addModifier(new Accidental(accidental));
  }
  if (n.duration.endsWith('d')) {
    Dot.buildAndAttach([note], { all: true });
  }
  return note;
}

export function LeadSheetStaff({ system, timeSignature, semitones, preferFlats, chordSystem, tempo }: Props) {
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
    let firstTrebleStave: Stave | null = null;
    let firstBassStave: Stave | null = null;

    system.measures.forEach((measure, i) => {
      const measureWidth = MEASURE_WIDTH + (i === 0 ? FIRST_MEASURE_EXTRA : 0);
      const trebleStave = new Stave(x, TREBLE_Y, measureWidth);
      const bassStave = new Stave(x, BASS_Y, measureWidth);

      if (i === 0) {
        trebleStave.addClef('treble').addTimeSignature(timeSignature);
        bassStave.addClef('bass').addTimeSignature(timeSignature);
        if (tempo) {
          trebleStave.setTempo({ duration: 'q', bpm: tempo.bpm, name: tempo.marking }, -18);
        }
        firstTrebleStave = trebleStave;
        firstBassStave = bassStave;
      }

      trebleStave.setContext(context).draw();
      bassStave.setContext(context).draw();

      const trebleNotes = measure.melody.map((n) => toStaveNote(n, semitones, preferFlats, 'treble'));
      const bassNotes = measure.bass.map((n) => toStaveNote(n, semitones, preferFlats, 'bass'));

      measure.melody.forEach((n, idx) => {
        if (!n.chord) return;
        const text = convertChord(n.chord, semitones, chordSystem, preferFlats);
        const annotation = new Annotation(text);
        annotation.setFont('Arial', 12, 'bold');
        annotation.setVerticalJustification(Annotation.VerticalJustify.TOP);
        trebleNotes[idx].addModifier(annotation);
      });

      const beats = timeSignature.split('/').map(Number);
      const trebleVoice = new Voice({ numBeats: beats[0], beatValue: beats[1] });
      trebleVoice.setStrict(false);
      trebleVoice.addTickables(trebleNotes);

      const bassVoice = new Voice({ numBeats: beats[0], beatValue: beats[1] });
      bassVoice.setStrict(false);
      bassVoice.addTickables(bassNotes);

      const formatWidth = trebleStave.getNoteEndX() - trebleStave.getNoteStartX() - 10;
      new Formatter().joinVoices([trebleVoice, bassVoice]).format([trebleVoice, bassVoice], formatWidth);
      trebleVoice.draw(context, trebleStave);
      bassVoice.draw(context, bassStave);

      // Lyrics under the melody notes.
      const svg = container.querySelector('svg');
      measure.melody.forEach((n, idx) => {
        if (!n.lyric || !svg) return;
        const noteX = trebleNotes[idx].getAbsoluteX();
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(noteX));
        text.setAttribute('y', String(TREBLE_Y + 65));
        text.setAttribute('font-size', '10.5');
        text.setAttribute('class', 'melody-lyric');
        text.textContent = n.lyric;
        svg.appendChild(text);
      });

      x += measureWidth + MEASURE_GAP;
    });

    if (firstTrebleStave && firstBassStave) {
      new StaveConnector(firstTrebleStave, firstBassStave).setType('brace').setContext(context).draw();
      new StaveConnector(firstTrebleStave, firstBassStave).setType('singleLeft').setContext(context).draw();
    }
  }, [system, timeSignature, semitones, preferFlats, chordSystem, tempo]);

  return (
    <div className="lead-sheet-system">
      <div className="lead-sheet-system-label">{system.label}</div>
      <div ref={containerRef} className="lead-sheet-canvas" />
    </div>
  );
}
