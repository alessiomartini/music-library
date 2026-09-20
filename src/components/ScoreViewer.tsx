import { useEffect, useRef, useState } from 'react';
import type { Score, ScorePart, ScoreNoteEvent } from '../lib/score';
import { transposeScore } from '../lib/transpose';

// VexFlow types - we'll import dynamically
let Vex: any = null;

async function loadVexFlow() {
  if (Vex) return Vex;
  const mod = await import('vexflow');
  Vex = mod.default ?? mod;
  return Vex;
}

interface ScoreViewerProps {
  score: Score;
  semitones?: number;
  preferFlats?: boolean;
  chordSystem?: 'english' | 'italian';
}

function pitchClassToNoteName(pc: number, preferFlats: boolean): string {
  const sharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  return preferFlats ? flats[pc] : sharps[pc];
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

        // Clear container
        container.innerHTML = '';

        // VexFlow setup
        const VF = Vex.Flow;

        // Calculate layout dimensions
        const numMeasures = transposedScore.measures.length;
        const measuresPerLine = Math.max(4, Math.min(8, Math.floor(window.innerWidth / 200)));
        const numLines = Math.ceil(numMeasures / measuresPerLine);
        const width = Math.min(800, container.clientWidth || 800);

        const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
        renderer.resize(width, numLines * 140 + 60);
        const context = renderer.getContext();
        context.setFont('Arial', 10);

        const voiceMap = new Map<string, any>();

        let y = 40;
        const staveHeight = 100;
        const stavePadding = 20;

        // Group measures by line
        for (let line = 0; line < numLines; line++) {
          const startMeasure = line * measuresPerLine;
          const endMeasure = Math.min(startMeasure + measuresPerLine, numMeasures);
          void endMeasure;

          // Create staves for each part on this line
          let currentY = y;

          for (const part of transposedScore.parts) {
            const clef = getClefForPart(part);

            const stave = new VF.Stave(40, currentY, width - 80, {
              clef: clef,
              auto_beam: true,
            });

            // Add time signature to first stave of first line
            if (line === 0 && part === transposedScore.parts[0]) {
              stave.addTimeSignature(`${transposedScore.timeSignature.numerator}/${transposedScore.timeSignature.denominator}`);
              // Add key signature
              const keySpec = transposedScore.originalKey;
              stave.addKeySignature(keySpec.replace('m', ''));
            }

            stave.setContext(context).draw();
            currentY += staveHeight + stavePadding;

            // Create voice for this part on this line
            const voice = new VF.Voice({
              num_beats: transposedScore.timeSignature.numerator,
              beat_value: transposedScore.timeSignature.denominator,
              resolution: VF.RESOLUTION,
            });
            voice.setStrict(false);
            voiceMap.set(`${part.id}-${line}`, { voice, stave, part });
          }

          y = currentY + 40; // Space for chord symbols above
        }

        // Process each part's events and assign to voices
        for (const part of transposedScore.parts) {
          const partEvents = part.events.filter((e): e is ScoreNoteEvent => e.kind === 'note');

          // Group events by measure
          const eventsByMeasure = new Map<number, ScoreNoteEvent[]>();
          for (const event of partEvents) {
            // Find which measure this event belongs to
            let measureIndex = 0;
            for (let i = 0; i < transposedScore.measures.length; i++) {
              const m = transposedScore.measures[i];
              if (event.start >= m.start && event.start < m.start + m.duration) {
                measureIndex = i;
                break;
              }
            }
            if (!eventsByMeasure.has(measureIndex)) {
              eventsByMeasure.set(measureIndex, []);
            }
            eventsByMeasure.get(measureIndex)!.push(event);
          }

          // Add events to voices
          for (const [measureIndex, events] of eventsByMeasure) {
            const line = Math.floor(measureIndex / measuresPerLine);
            const voiceData = voiceMap.get(`${part.id}-${line}`);
            if (!voiceData) continue;

            const { voice } = voiceData;

            for (const event of events) {
              const { note: noteName, octave } = midiToVexFlowNote(event.pitch);
              const duration = ticksToVexFlowDuration(event.duration, score.ppq);

              const vfNote = new VF.StaveNote({
                keys: [`${noteName}/${octave}`],
                duration: duration,
                clef: getClefForPart(part),
              });

              // Add lyrics if present
              if (event.lyrics && event.lyrics.length > 0) {
                const lyric = event.lyrics[0];
                if (lyric.text) {
                  // Position lyric below note
                  const modifier = new VF.Annotation(lyric.text)
                    .setFont('Arial', 10)
                    .setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM);
                  vfNote.addModifier(modifier, 0);
                }
              }

              // Add tie if present
              if (event.tie) {
                // Tie handling would go here
              }

              voice.addTickable(vfNote);
            }
          }
        }

        // Add harmony/chord symbols
        // Create a separate voice for chord symbols on the first part's staves
        for (let line = 0; line < numLines; line++) {
          const firstPart = transposedScore.parts[0];
          const voiceData = voiceMap.get(`${firstPart.id}-${line}`);
          if (!voiceData) continue;

          const { stave: _stave } = voiceData;
          const startMeasure = line * measuresPerLine;
          const endMeasure = Math.min(startMeasure + measuresPerLine, transposedScore.measures.length);
          void _stave;

          // Add chord symbols above the stave
          for (const harmonyEvent of transposedScore.harmony) {
            const measureIndex = transposedScore.measures.findIndex(m =>
              harmonyEvent.start >= m.start && harmonyEvent.start < m.start + m.duration
            );
            if (measureIndex < startMeasure || measureIndex >= endMeasure) continue;

            const rootName = pitchClassToNoteName(harmonyEvent.root, preferFlats);
            const qualitySuffix = chordQualityToSuffix(harmonyEvent.quality);
            let chordSymbol = `${rootName}${qualitySuffix}`;
            if (harmonyEvent.slashBass !== undefined) {
              const bassName = pitchClassToNoteName(harmonyEvent.slashBass, preferFlats);
              chordSymbol += `/${bassName}`;
            }

            // Position chord symbol above the measure
            // We'll add it as an annotation to a hidden note at the beginning of the measure

            const annotation = new VF.Annotation(chordSymbol)
              .setFont('Arial', 12, 'bold')
              .setVerticalJustification(VF.Annotation.VerticalJustify.TOP)
              .setMarginTop(-30);

            // Create a hidden note to attach the annotation
            const hiddenNote = new VF.StaveNote({
              keys: ['B/4'],
              duration: 'w',
              clef: 'treble',
            });
            hiddenNote.addModifier(annotation, 0);
            hiddenNote.setStyle({ fillStyle: 'transparent', strokeStyle: 'transparent' });
            voiceData.voice.addTickable(hiddenNote);
          }
        }

        // Format and draw all voices
        const formatter = new VF.Formatter();
        const allVoices = Array.from(voiceMap.values()).map(v => v.voice);
        formatter.joinVoices(allVoices);
        formatter.format(allVoices, width - 100);

        for (const { voice, stave } of voiceMap.values()) {
          voice.draw(context, stave);
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
    <div className="score-viewer" ref={containerRef} style={{ overflowX: 'auto' }}>
      {!rendered && <div className="score-viewer-loading">Loading score…</div>}
    </div>
  );
}