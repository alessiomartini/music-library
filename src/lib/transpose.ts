import type { Score, ScoreEvent, ScoreNoteEvent, ScorePart, HarmonyEvent, MidiPitch, PitchClass } from './score';

/**
 * Transpose a Score by the given number of semitones.
 * Returns a new Score object with all pitches and harmony roots shifted.
 */
export function transposeScore(score: Score, semitones: number): Score {
  if (semitones === 0) {
    return score;
  }

  const normalizedSemitones = ((semitones % 12) + 12) % 12;

  const transposedParts: ScorePart[] = score.parts.map((part) => ({
    ...part,
    events: part.events.map((event) => transposeEvent(event, normalizedSemitones)),
  }));

  const transposedHarmony: HarmonyEvent[] = score.harmony.map((event) => transposeHarmonyEvent(event, normalizedSemitones));

  // Calculate new original key
  const newOriginalKey = transposeKeyLabel(score.originalKey, normalizedSemitones);

  return {
    ...score,
    originalKey: newOriginalKey,
    parts: transposedParts,
    harmony: transposedHarmony,
  };
}

function transposeEvent(event: ScoreEvent, semitones: number): ScoreEvent {
  if (event.kind === 'rest') {
    return { ...event };
  }
  return transposeNoteEvent(event, semitones);
}

function transposeNoteEvent(event: ScoreNoteEvent, semitones: number): ScoreNoteEvent {
  const newPitch = clampMidiPitch(event.pitch + semitones);
  return {
    ...event,
    pitch: newPitch,
    lyrics: event.lyrics ? [...event.lyrics] : undefined,
    tie: event.tie ? { ...event.tie } : undefined,
  };
}

function transposeHarmonyEvent(event: HarmonyEvent, semitones: number): HarmonyEvent {
  const newRoot = ((event.root + semitones) % 12 + 12) % 12 as PitchClass;
  const newSlashBass = event.slashBass !== undefined
    ? ((event.slashBass + semitones) % 12 + 12) % 12
    : undefined;

  return {
    ...event,
    root: newRoot,
    slashBass: newSlashBass as PitchClass | undefined,
  };
}

function clampMidiPitch(pitch: number): MidiPitch {
  if (pitch < 0) return 0;
  if (pitch > 127) return 127;
  return pitch as MidiPitch;
}

/**
 * Transpose a key label (e.g., "Eb", "C#m", "F") by semitones.
 * Returns the transposed key label in the same format (major/minor).
 */
export function transposeKeyLabel(keyLabel: string, semitones: number): string {
  const normalizedSemitones = ((semitones % 12) + 12) % 12;

  // Parse key label: note + optional 'm' for minor
  const match = keyLabel.match(/^([A-G][#b]?)(m?)$/);
  if (!match) {
    console.warn(`Could not parse key label: ${keyLabel}`);
    return keyLabel;
  }

  const [, note, minor] = match;
  const isMinor = minor === 'm';

  // Convert note to pitch class
  const noteToPc: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11,
  };

  const pc = noteToPc[note];
  if (pc === undefined) {
    console.warn(`Unknown note: ${note}`);
    return keyLabel;
  }

  const newPc = (pc + normalizedSemitones) % 12;

  // Convert back to note name - prefer flats for flat keys, sharps for sharp keys
  const pcToNoteSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const pcToNoteFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  // Determine if we should use sharps or flats based on the original key
  const useFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb',
    'Fm', 'Bbm', 'Ebm', 'Abm', 'Dbm', 'Gbm', 'Cbm'].some(k => keyLabel.startsWith(k.replace('m', '')));

  const newNote = useFlats ? pcToNoteFlat[newPc] : pcToNoteSharp[newPc];

  return `${newNote}${isMinor ? 'm' : ''}`;
}