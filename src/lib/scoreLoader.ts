import {
  assertValidScore,
  type Score,
  type ScoreValidationIssue,
  validateScore,
} from './score';

export const SCORE_JSON_SCHEMA_VERSION = 1 as const;

export interface ScoreJsonDocument {
  schemaVersion: typeof SCORE_JSON_SCHEMA_VERSION;
  score: Score;
}

export class ScoreJsonValidationError extends Error {
  readonly issues: ScoreValidationIssue[];

  constructor(issues: ScoreValidationIssue[]) {
    super(issues.map(({ path, message }) => `${path}: ${message}`).join('\n'));
    this.name = 'ScoreJsonValidationError';
    this.issues = issues;
  }
}

export function loadScoreJson(value: unknown): Score {
  if (!isRecord(value)) {
    throw new ScoreJsonValidationError([{ path: '$', message: 'must be an object' }]);
  }
  if (value.schemaVersion !== SCORE_JSON_SCHEMA_VERSION) {
    throw new ScoreJsonValidationError([
      {
        path: 'schemaVersion',
        message: `must be supported version ${SCORE_JSON_SCHEMA_VERSION}`,
      },
    ]);
  }
  if (!isRecord(value.score)) {
    throw new ScoreJsonValidationError([{ path: 'score', message: 'must be an object' }]);
  }

  const issues = validateScore(value.score);
  if (issues.length > 0) {
    throw new ScoreJsonValidationError(issues.map((issue) => ({ ...issue, path: `score.${issue.path}` })));
  }

  assertValidScore(value.score);
  return normalizeScore(value.score);
}

function normalizeScore(score: Record<string, unknown>): Score {
  const value = score as unknown as Score;
  return {
    ...value,
    timeSignature: { ...value.timeSignature },
    measures: value.measures.map((measure) => ({ ...measure })),
    tempo: { ...value.tempo },
    parts: value.parts.map((part) => ({
      ...part,
      events: part.events.map((event) => {
        if (event.kind === 'rest') return { ...event };
        return {
          ...event,
          lyrics: event.lyrics?.map((lyric) => ({ ...lyric })),
          tie: event.tie ? { ...event.tie } : undefined,
        };
      }),
    })),
    harmony: value.harmony.map((event) => ({ ...event })),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
