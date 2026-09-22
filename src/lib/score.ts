export const SCORE_PPQ = 960 as const;
export const MIN_MIDI_PITCH = 0 as const;
export const MAX_MIDI_PITCH = 127 as const;

export type ScoreTicks = number;
export type MidiPitch = number;
export type PitchClass = number;

export type ScorePartRole = 'voice' | 'bass' | 'instrument';

export type LyricSyllabic = 'single' | 'begin' | 'middle' | 'end';
export type LyricMelisma = 'start' | 'continue' | 'stop';

export interface ScoreLyric {
  verse: string;
  text?: string;
  syllabic?: LyricSyllabic;
  melisma?: LyricMelisma;
  elision?: string;
}

export type TieType = 'start' | 'continue' | 'stop';

export interface ScoreTie {
  id: string;
  type: TieType;
}

export interface TimedEvent {
  start: ScoreTicks;
  duration: ScoreTicks;
}

export interface ScoreNoteEvent extends TimedEvent {
  kind: 'note';
  pitch: MidiPitch;
  lyrics?: ScoreLyric[];
  tie?: ScoreTie;
}

export interface ScoreRestEvent extends TimedEvent {
  kind: 'rest';
}

export type ScoreEvent = ScoreNoteEvent | ScoreRestEvent;

export interface ScorePart {
  id: string;
  name: string;
  role: ScorePartRole;
  events: ScoreEvent[];
}

export interface ScoreTimeSignature {
  numerator: number;
  denominator: number;
}

export interface ScoreMeasure {
  start: ScoreTicks;
  duration: ScoreTicks;
}

export interface ScoreTempo {
  bpm: number;
}

/** Semantic chord qualities; display-specific suffixes belong to theory/presentation code. */
export type ChordQuality =
  | 'major'
  | 'minor'
  | 'dominant7'
  | 'sus4'
  | 'dominant7sus4'
  | 'major6'
  | 'major7'
  | 'minor7'
  | 'halfDiminished7'
  | 'augmented';

export interface HarmonyEvent extends TimedEvent {
  root: PitchClass;
  quality: ChordQuality;
  slashBass?: PitchClass;
}

export type LyricSyncMethod = 'midi-native' | 'derived';

export interface Score {
  ppq: typeof SCORE_PPQ;
  originalKey: string;
  timeSignature: ScoreTimeSignature;
  measures: ScoreMeasure[];
  tempo: ScoreTempo;
  parts: ScorePart[];
  harmony: HarmonyEvent[];
  // How closely lyric timing tracks real per-syllable timestamps: 'midi-native'
  // for a MIDI-first score (parsed directly from a karaoke MIDI's own lyric
  // events, see docs/FUTURE-ARCHITECTURE.md), 'derived' or absent for the
  // audio-first path (forced alignment). Gates ScoreViewer's held-syllable
  // ("_") marks, which rely on MIDI-first's note-level lyric granularity and
  // read as noise on audio-first's coarser transcription.
  lyricSyncMethod?: LyricSyncMethod;
}

export interface ScoreValidationIssue {
  path: string;
  message: string;
}

export function eventEnd(event: TimedEvent): number {
  return event.start + event.duration;
}

export function isValidMidiPitch(value: unknown): value is MidiPitch {
  return isInteger(value) && value >= MIN_MIDI_PITCH && value <= MAX_MIDI_PITCH;
}

export function isValidPitchClass(value: unknown): value is PitchClass {
  return isInteger(value) && value >= 0 && value <= 11;
}

export function isValidChordQuality(value: unknown): value is ChordQuality {
  return value === 'major' || value === 'minor' || value === 'dominant7' || value === 'sus4' ||
    value === 'dominant7sus4' || value === 'major6' || value === 'major7' || value === 'minor7' ||
    value === 'halfDiminished7' || value === 'augmented';
}

export function validateScore(score: unknown): ScoreValidationIssue[] {
  const issues: ScoreValidationIssue[] = [];
  if (!isRecord(score)) {
    return [{ path: 'score', message: 'must be an object' }];
  }

  if (score.ppq !== SCORE_PPQ) {
    issue(issues, 'ppq', `must be ${SCORE_PPQ}`);
  }
  if (typeof score.originalKey !== 'string' || score.originalKey.trim() === '') {
    issue(issues, 'originalKey', 'must be a non-empty string');
  }

  validateTimeSignature(score.timeSignature, issues);
  validateMeasures(score.measures, score.timeSignature, issues);
  validateTempo(score.tempo, issues);

  if (!Array.isArray(score.parts)) {
    issue(issues, 'parts', 'must be an array');
  } else {
    const ids = new Set<string>();
    score.parts.forEach((part, index) => {
      validatePart(part, `parts[${index}]`, ids, issues);
    });
  }

  if (!Array.isArray(score.harmony)) {
    issue(issues, 'harmony', 'must be an array');
  } else {
    let previousEvent: HarmonyEvent | undefined;
    score.harmony.forEach((event, index) => {
      validateHarmony(event, `harmony[${index}]`, issues);
      if (isHarmonyEvent(event)) {
        if (previousEvent && event.start < previousEvent.start) {
          issue(issues, `harmony[${index}]`, 'events must be ordered by start');
        }
        if (previousEvent && event.start < eventEnd(previousEvent)) {
          issue(issues, `harmony[${index}]`, 'harmony events must not overlap');
        }
        previousEvent = event;
      }
    });
  }

  return issues;
}

export function isValidScore(score: unknown): score is Score {
  return validateScore(score).length === 0;
}

export function assertValidScore(score: unknown): asserts score is Score {
  const issues = validateScore(score);
  if (issues.length > 0) {
    throw new Error(issues.map(({ path, message }) => `${path}: ${message}`).join('\n'));
  }
}

function validateTimeSignature(value: unknown, issues: ScoreValidationIssue[]) {
  if (!isRecord(value)) {
    issue(issues, 'timeSignature', 'must be an object');
    return;
  }
  if (!isPositiveInteger(value.numerator)) {
    issue(issues, 'timeSignature.numerator', 'must be a positive integer');
  }
  if (!isPositiveInteger(value.denominator) || !isPowerOfTwo(value.denominator)) {
    issue(issues, 'timeSignature.denominator', 'must be a positive power of two');
  }
}

function validateMeasures(value: unknown, timeSignature: unknown, issues: ScoreValidationIssue[]) {
  if (!Array.isArray(value)) {
    issue(issues, 'measures', 'must be an array');
    return;
  }
  if (value.length === 0) {
    issue(issues, 'measures', 'must contain at least one measure');
    return;
  }
  let previousEnd = 0;
  const expectedDuration = isRecord(timeSignature) ? measureDuration(timeSignature) : null;
  value.forEach((measure, index) => {
    const path = `measures[${index}]`;
    if (!isRecord(measure)) {
      issue(issues, path, 'must be an object');
      return;
    }
    validateTiming(measure, path, issues);
    if (isValidStart(measure.start) && isPositiveInteger(measure.duration)) {
      if (index === 0 && measure.start !== 0) {
        issue(issues, `${path}.start`, 'the first measure must start at zero');
      }
      if (index > 0 && measure.start !== previousEnd) {
        issue(issues, `${path}.start`, 'measures must be contiguous');
      }
      if (expectedDuration !== null) {
        const isPickup = index === 0 && measure.duration < expectedDuration;
        if (!isPickup && measure.duration !== expectedDuration) {
          issue(issues, `${path}.duration`, `must be ${expectedDuration} ticks for the score time signature`);
        }
      }
      previousEnd = eventEnd({ start: measure.start, duration: measure.duration });
    }
  });
}

function validateTempo(value: unknown, issues: ScoreValidationIssue[]) {
  if (!isRecord(value) || typeof value.bpm !== 'number' || !Number.isFinite(value.bpm) || value.bpm <= 0) {
    issue(issues, 'tempo.bpm', 'must be a positive finite number');
  }
}

function validatePart(
  value: unknown,
  path: string,
  ids: Set<string>,
  issues: ScoreValidationIssue[],
) {
  if (!isRecord(value)) {
    issue(issues, path, 'must be an object');
    return;
  }
  if (typeof value.id !== 'string' || value.id.trim() === '') {
    issue(issues, `${path}.id`, 'must be a non-empty string');
  } else if (ids.has(value.id)) {
    issue(issues, `${path}.id`, 'must be unique');
  } else {
    ids.add(value.id);
  }
  if (typeof value.name !== 'string' || value.name.trim() === '') {
    issue(issues, `${path}.name`, 'must be a non-empty string');
  }
  if (value.role !== 'voice' && value.role !== 'bass' && value.role !== 'instrument') {
    issue(issues, `${path}.role`, 'must be voice, bass, or instrument');
  }
  if (!Array.isArray(value.events)) {
    issue(issues, `${path}.events`, 'must be an array');
    return;
  }

  let previousEvent: ScoreEvent | undefined;
  value.events.forEach((event, index) => {
    const eventPath = `${path}.events[${index}]`;
    validateEvent(event, eventPath, value.role === 'voice', issues);
    if (isScoreEvent(event)) {
      if (previousEvent && event.start < previousEvent.start) {
        issue(issues, eventPath, 'events must be ordered by start');
      }
      if (previousEvent && event.start < eventEnd(previousEvent)) {
        issue(issues, eventPath, 'events in a part must not overlap');
      }
      previousEvent = event;
    }
  });
  validateTies(value.events, path, issues);
}

function validateEvent(value: unknown, path: string, isVoice: boolean, issues: ScoreValidationIssue[]) {
  if (!isRecord(value)) {
    issue(issues, path, 'must be an object');
    return;
  }
  validateTiming(value, path, issues);

  if (value.kind === 'note') {
    if (!isValidMidiPitch(value.pitch)) {
      issue(issues, `${path}.pitch`, `must be an integer from ${MIN_MIDI_PITCH} to ${MAX_MIDI_PITCH}`);
    }
    if (value.lyrics !== undefined) {
      if (!isVoice) {
        issue(issues, `${path}.lyrics`, 'lyrics are only allowed on voice parts');
      }
      validateLyrics(value.lyrics, `${path}.lyrics`, issues);
    }
    if (value.tie !== undefined) {
      validateTie(value.tie, `${path}.tie`, issues);
    }
  } else if (value.kind === 'rest') {
    if ('pitch' in value) {
      issue(issues, `${path}.pitch`, 'rests must not contain a pitch');
    }
    if ('lyrics' in value) {
      issue(issues, `${path}.lyrics`, 'rests must not contain lyrics');
    }
    if ('tie' in value) {
      issue(issues, `${path}.tie`, 'rests must not contain tie information');
    }
  } else {
    issue(issues, `${path}.kind`, 'must be note or rest');
  }
}

function validateHarmony(value: unknown, path: string, issues: ScoreValidationIssue[]) {
  if (!isRecord(value)) {
    issue(issues, path, 'must be an object');
    return;
  }
  validateTiming(value, path, issues);
  if (!isValidPitchClass(value.root)) {
    issue(issues, `${path}.root`, 'must be an integer pitch class from 0 to 11');
  }
  if (!isValidChordQuality(value.quality)) {
    issue(issues, `${path}.quality`, 'must be a supported normalized chord quality');
  }
  if (value.slashBass !== undefined && !isValidPitchClass(value.slashBass)) {
    issue(issues, `${path}.slashBass`, 'must be an integer pitch class from 0 to 11');
  }
}

function validateLyrics(value: unknown, path: string, issues: ScoreValidationIssue[]) {
  if (!Array.isArray(value)) {
    issue(issues, path, 'must be an array');
    return;
  }
  value.forEach((lyric, index) => {
    const lyricPath = `${path}[${index}]`;
    if (!isRecord(lyric)) {
      issue(issues, lyricPath, 'must be an object');
      return;
    }
    if (typeof lyric.verse !== 'string' || lyric.verse.trim() === '') {
      issue(issues, `${lyricPath}.verse`, 'must be a non-empty string');
    }
    if (lyric.text !== undefined && typeof lyric.text !== 'string') {
      issue(issues, `${lyricPath}.text`, 'must be a string when present');
    }
    if (lyric.syllabic !== undefined && !['single', 'begin', 'middle', 'end'].includes(lyric.syllabic as string)) {
      issue(issues, `${lyricPath}.syllabic`, 'has an invalid value');
    }
    if (lyric.melisma !== undefined && !['start', 'continue', 'stop'].includes(lyric.melisma as string)) {
      issue(issues, `${lyricPath}.melisma`, 'has an invalid value');
    }
    if (lyric.elision !== undefined && typeof lyric.elision !== 'string') {
      issue(issues, `${lyricPath}.elision`, 'must be a string when present');
    }
    const hasText = typeof lyric.text === 'string' && lyric.text.trim() !== '';
    const hasMelisma = lyric.melisma === 'start' || lyric.melisma === 'continue' || lyric.melisma === 'stop';
    if (!hasText && !hasMelisma) {
      issue(issues, lyricPath, 'must contain text or a melisma continuation marker');
    }
  });
}

function validateTie(value: unknown, path: string, issues: ScoreValidationIssue[]) {
  if (!isRecord(value)) {
    issue(issues, path, 'must be an object');
    return;
  }
  if (typeof value.id !== 'string' || value.id.trim() === '') {
    issue(issues, `${path}.id`, 'must be a non-empty string');
  }
  if (value.type !== 'start' && value.type !== 'continue' && value.type !== 'stop') {
    issue(issues, `${path}.type`, 'must be start, continue, or stop');
  }
}

function validateTies(events: unknown[], path: string, issues: ScoreValidationIssue[]) {
  const chains = new Map<string, { index: number; event: ScoreNoteEvent; type: TieType }[]>();
  events.forEach((value, index) => {
    if (!isScoreNoteEvent(value) || value.tie === undefined) return;
    const chain = chains.get(value.tie.id) ?? [];
    chain.push({ index, event: value, type: value.tie.type });
    chains.set(value.tie.id, chain);
  });

  for (const [id, chain] of chains) {
    if (chain.length < 2) {
      issue(issues, `${path}.events[${chain[0].index}].tie`, `tie "${id}" must connect at least two note events`);
      continue;
    }
    for (let i = 0; i < chain.length; i += 1) {
      const current = chain[i];
      const previous = chain[i - 1];
      const next = chain[i + 1];
      if (i > 0 && current.index !== previous.index + 1) {
        issue(issues, `${path}.events[${current.index}].tie`, `tie "${id}" events must be contiguous`);
      }
      if (i > 0 && current.event.pitch !== previous.event.pitch) {
        issue(issues, `${path}.events[${current.index}].tie`, `tie "${id}" must keep the same pitch`);
      }
      if (i > 0 && current.event.start !== eventEnd(previous.event)) {
        issue(issues, `${path}.events[${current.index}].tie`, `tie "${id}" events must be contiguous in time`);
      }
      if (i === 0 && current.type !== 'start') {
        issue(issues, `${path}.events[chain[0].index].tie`, `tie "${id}" must begin with start`);
      }
      if (i === chain.length - 1 && current.type !== 'stop') {
        issue(issues, `${path}.events[chain[chain.length - 1].index].tie`, `tie "${id}" must end with stop`);
      }
      if (i > 0 && i < chain.length - 1 && current.type !== 'continue') {
        issue(issues, `${path}.events[${current.index}].tie`, `tie "${id}" middle events must continue`);
      }
      if (next && current.type === 'stop') {
        issue(issues, `${path}.events[${current.index}].tie`, `tie "${id}" cannot continue after stop`);
      }
    }
  }
}

function validateTiming(value: Record<string, unknown>, path: string, issues: ScoreValidationIssue[]) {
  if (!isValidStart(value.start)) {
    issue(issues, `${path}.start`, 'must be a non-negative integer');
  }
  if (!isPositiveInteger(value.duration)) {
    issue(issues, `${path}.duration`, 'must be a positive integer');
  }
}

function isScoreEvent(value: unknown): value is ScoreEvent {
  return isRecord(value) && (value.kind === 'note' || value.kind === 'rest');
}

function isHarmonyEvent(value: unknown): value is HarmonyEvent {
  return isRecord(value) && isValidStart(value.start) && isPositiveInteger(value.duration) &&
    isValidPitchClass(value.root) && isValidChordQuality(value.quality);
}

function isScoreNoteEvent(value: unknown): value is ScoreNoteEvent {
  return isRecord(value) && value.kind === 'note' && typeof value.tie === 'object' && value.tie !== null;
}

function isValidStart(value: unknown): value is number {
  return isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return isInteger(value) && value > 0;
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

function isPowerOfTwo(value: unknown): value is number {
  return isPositiveInteger(value) && (value & (value - 1)) === 0;
}

function measureDuration(timeSignature: Record<string, unknown>): number | null {
  if (!isPositiveInteger(timeSignature.numerator) ||
      !isPositiveInteger(timeSignature.denominator) ||
      !isPowerOfTwo(timeSignature.denominator)) {
    return null;
  }
  const duration = timeSignature.numerator * SCORE_PPQ * 4 / timeSignature.denominator;
  return Number.isInteger(duration) ? duration : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function issue(issues: ScoreValidationIssue[], path: string, message: string) {
  issues.push({ path, message });
}
