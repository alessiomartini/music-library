import { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Dot } from 'vexflow';
import type { MelodyLine } from '../lib/types';
import { transposePitch } from '../lib/theory';

interface Props {
  melody: MelodyLine;
  semitones: number;
  preferFlats: boolean;
}

const MEASURE_WIDTH = 200;
const FIRST_MEASURE_EXTRA = 50;
const MEASURE_GAP = 16;
const STAVE_X = 10;
const STAVE_Y = 20;

function toStaveNote(pitch: string, duration: string, rest: boolean | undefined) {
  if (rest) {
    return new StaveNote({ keys: ['b/4'], duration: duration + 'r' });
  }
  const [note] = pitch.split('/');
  const accidental = note.slice(1);
  const note_ = new StaveNote({ keys: [pitch], duration });
  if (accidental === '#' || accidental === 'b' || accidental === 'n') {
    note_.addModifier(new Accidental(accidental));
  }
  if (duration.endsWith('d')) {
    Dot.buildAndAttach([note_], { all: true });
  }
  return note_;
}

export function MelodyStaff({ melody, semitones, preferFlats }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const width =
      melody.measures.length * (MEASURE_WIDTH + MEASURE_GAP) + FIRST_MEASURE_EXTRA + 20;
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, 150);
    const context = renderer.getContext();

    let x = STAVE_X;
    melody.measures.forEach((measure, i) => {
      const measureWidth = MEASURE_WIDTH + (i === 0 ? FIRST_MEASURE_EXTRA : 0);
      const stave = new Stave(x, STAVE_Y, measureWidth);
      if (i === 0) {
        stave.addClef('treble').addTimeSignature(melody.timeSignature);
      }
      stave.setContext(context).draw();

      const notes = measure.notes.map((n) => {
        const duration = n.duration.replace('d', '') + (n.duration.endsWith('d') ? 'd' : '');
        const pitch = n.rest ? n.pitch : transposePitch(n.pitch, semitones, preferFlats);
        return toStaveNote(pitch, duration, n.rest);
      });

      const beats = melody.timeSignature.split('/').map(Number);
      const voice = new Voice({ numBeats: beats[0], beatValue: beats[1] });
      voice.setStrict(false);
      voice.addTickables(notes);

      const formatWidth = stave.getNoteEndX() - stave.getNoteStartX() - 10;
      new Formatter().joinVoices([voice]).format([voice], formatWidth);
      voice.draw(context, stave);

      // Lyrics under the notes.
      const svg = container.querySelector('svg');
      measure.notes.forEach((n, idx) => {
        if (!n.lyric || !svg) return;
        const noteEl = notes[idx];
        const noteX = noteEl.getAbsoluteX();
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(noteX));
        text.setAttribute('y', '128');
        text.setAttribute('font-size', '10.5');
        text.setAttribute('class', 'melody-lyric');
        text.textContent = n.lyric;
        svg.appendChild(text);
      });

      x += measureWidth + MEASURE_GAP;
    });
  }, [melody, semitones, preferFlats]);

  return (
    <div className="melody-staff">
      <div className="melody-staff-label">{melody.label}</div>
      <div ref={containerRef} className="melody-staff-canvas" />
    </div>
  );
}
