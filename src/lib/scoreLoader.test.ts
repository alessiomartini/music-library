import { describe, expect, it } from 'vitest';
import {
  SCORE_JSON_SCHEMA_VERSION,
  ScoreJsonValidationError,
  loadScoreJson,
} from './scoreLoader';

const scoreJson = {
  schemaVersion: SCORE_JSON_SCHEMA_VERSION,
  score: {
    ppq: 960,
    originalKey: 'C',
    timeSignature: { numerator: 4, denominator: 4 },
    measures: [{ start: 0, duration: 3840 }],
    tempo: { bpm: 96 },
    parts: [
      {
        id: 'voice',
        name: 'Voice',
        role: 'voice',
        events: [
          {
            kind: 'note',
            start: 0,
            duration: 960,
            pitch: 60,
            lyrics: [{ verse: '1', text: 'You', syllabic: 'single' }],
            tie: { id: 'held-note', type: 'start' },
          },
          {
            kind: 'note',
            start: 960,
            duration: 960,
            pitch: 60,
            tie: { id: 'held-note', type: 'stop' },
          },
        ],
      },
      {
        id: 'bass',
        name: 'Bass',
        role: 'bass',
        events: [{ kind: 'rest', start: 0, duration: 960 }],
      },
    ],
    harmony: [
      { start: 0, duration: 1920, root: 0, quality: 'major' },
      { start: 1920, duration: 1920, root: 7, quality: 'dominant7', slashBass: 2 },
    ],
  },
} as const;

describe('score JSON loader', () => {
  it('loads a versioned JSON document into a normalized score', () => {
    const score = loadScoreJson(scoreJson);

    expect(score.originalKey).toBe('C');
    expect(score.parts[0].events[0]).toMatchObject({
      kind: 'note',
      pitch: 60,
      lyrics: [{ verse: '1', text: 'You' }],
      tie: { id: 'held-note', type: 'start' },
    });
    expect(score.parts[1].events[0]).toEqual({ kind: 'rest', start: 0, duration: 960 });
    expect(score.harmony).toEqual([
      { start: 0, duration: 1920, root: 0, quality: 'major' },
      { start: 1920, duration: 1920, root: 7, quality: 'dominant7', slashBass: 2 },
    ]);
  });

  it('rejects unsupported schema versions and malformed top-level documents', () => {
    expect(() => loadScoreJson({ schemaVersion: 2, score: scoreJson.score })).toThrow(
      'schemaVersion: must be supported version 1',
    );
    expect(() => loadScoreJson({ schemaVersion: 1 })).toThrow('score: must be an object');
    expect(() => loadScoreJson(null)).toThrow('$: must be an object');
  });

  it('reports domain validation paths for malformed score data', () => {
    const malformed = {
      ...scoreJson,
      score: {
        ...scoreJson.score,
        parts: [
          {
            ...scoreJson.score.parts[0],
            events: [{ kind: 'note', start: -1, duration: 0, pitch: 128 }],
          },
        ],
        harmony: [{ start: 0, duration: 480, root: 0, quality: 'm7' }],
      },
    };

    try {
      loadScoreJson(malformed);
      throw new Error('expected loader to reject malformed score');
    } catch (error) {
      expect(error).toBeInstanceOf(ScoreJsonValidationError);
      expect((error as ScoreJsonValidationError).issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: 'score.parts[0].events[0].start' }),
          expect.objectContaining({ path: 'score.parts[0].events[0].duration' }),
          expect.objectContaining({ path: 'score.parts[0].events[0].pitch' }),
          expect.objectContaining({ path: 'score.harmony[0].quality' }),
        ]),
      );
    }
  });

  it('rejects invalid event kinds, lyrics, ties, and missing required fields', () => {
    const malformed = {
      ...scoreJson,
      score: {
        ...scoreJson.score,
        originalKey: '',
        parts: [
          {
            ...scoreJson.score.parts[0],
            events: [
              {
                kind: 'note',
                start: 0,
                duration: 480,
                lyrics: [{ verse: '1' }],
                tie: { id: '', type: 'middle' },
              },
            ],
          },
        ],
      },
    };

    expect(() => loadScoreJson(malformed)).toThrow('score.originalKey: must be a non-empty string');
    expect(() => loadScoreJson(malformed)).toThrow('score.parts[0].events[0].lyrics');
    expect(() => loadScoreJson(malformed)).toThrow('score.parts[0].events[0].tie');
    expect(() =>
      loadScoreJson({
        ...scoreJson,
        score: {
          ...scoreJson.score,
          parts: [{ ...scoreJson.score.parts[0], events: [{ kind: 'unknown', start: 0, duration: 480 }] }],
        },
      }),
    ).toThrow('score.parts[0].events[0].kind: must be note or rest');
  });
});
