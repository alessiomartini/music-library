import { describe, expect, it } from 'vitest';
import {
  SCORE_PPQ,
  assertValidScore,
  eventEnd,
  isValidScore,
  validateScore,
  type Score,
} from './score';

const voiceEvents: Score['parts'][number]['events'] = [
  {
    kind: 'note',
    start: 0,
    duration: 480,
    pitch: 60,
    lyrics: [{ verse: '1', text: 'You', syllabic: 'single' }],
  },
  { kind: 'note', start: 480, duration: 480, pitch: 62 },
];

function createScore(overrides: Partial<Score> = {}): Score {
  return {
    ppq: SCORE_PPQ,
    originalKey: 'C',
    timeSignature: { numerator: 4, denominator: 4 },
    measures: [{ start: 0, duration: SCORE_PPQ * 4 }],
    tempo: { bpm: 96 },
    parts: [{ id: 'voice', name: 'Voice', role: 'voice', events: voiceEvents }],
    harmony: [{ start: 0, duration: SCORE_PPQ * 2, root: 0, quality: 'major' }],
    ...overrides,
  };
}

describe('symbolic score model', () => {
  it('accepts valid note and rest events', () => {
    const score = createScore({
      parts: [
        {
          id: 'voice',
          name: 'Voice',
          role: 'voice',
          events: [...voiceEvents, { kind: 'rest', start: 960, duration: 480 }],
        },
      ],
    });

    expect(isValidScore(score)).toBe(true);
    expect(eventEnd(score.parts[0].events[0])).toBe(480);
  });

  it('rejects invalid timing and pitch values', () => {
    const score = createScore({
      parts: [
        {
          id: 'voice',
          name: 'Voice',
          role: 'voice',
          events: [{ kind: 'note', start: -1, duration: 0, pitch: 128 }],
        },
      ],
    });

    const issues = validateScore(score);
    expect(issues.some((issue) => issue.path.endsWith('.start'))).toBe(true);
    expect(issues.some((issue) => issue.path.endsWith('.duration'))).toBe(true);
    expect(issues.some((issue) => issue.path.endsWith('.pitch'))).toBe(true);
  });

  it('rejects lyrics on rests and on non-voice parts', () => {
    const score = createScore({
      parts: [
        {
          id: 'bass',
          name: 'Bass',
          role: 'bass',
          events: [
            { kind: 'rest', start: 0, duration: 480, lyrics: [] } as never,
            { kind: 'note', start: 480, duration: 480, pitch: 40, lyrics: [{ verse: '1', text: 'low' }] },
          ],
        },
      ],
    });

    const issues = validateScore(score);
    expect(issues.some((issue) => issue.message.includes('rests must not contain lyrics'))).toBe(true);
    expect(issues.some((issue) => issue.message.includes('only allowed on voice'))).toBe(true);
  });

  it('rejects overlapping events in a part but accepts simultaneous events across parts', () => {
    const overlapping = createScore({
      parts: [
        {
          id: 'voice',
          name: 'Voice',
          role: 'voice',
          events: [
            { kind: 'note', start: 0, duration: 600, pitch: 60 },
            { kind: 'rest', start: 480, duration: 480 },
          ],
        },
      ],
    });
    expect(validateScore(overlapping).some((issue) => issue.message.includes('must not overlap'))).toBe(true);

    const simultaneous = createScore({
      parts: [
        { id: 'voice', name: 'Voice', role: 'voice', events: [{ kind: 'note', start: 0, duration: 480, pitch: 60 }] },
        { id: 'bass', name: 'Bass', role: 'bass', events: [{ kind: 'note', start: 0, duration: 480, pitch: 36 }] },
      ],
    });
    expect(isValidScore(simultaneous)).toBe(true);
  });

  it('keeps harmony independent and allows changes between and across notes', () => {
    const score = createScore({
      parts: [{ id: 'voice', name: 'Voice', role: 'voice', events: voiceEvents }],
      harmony: [
        { start: 240, duration: 240, root: 7, quality: 'dominant7' },
        { start: 480, duration: 960, root: 9, quality: 'minor', slashBass: 4 },
      ],
    });

    expect(isValidScore(score)).toBe(true);
    expect(score.parts[0].events[0]).not.toHaveProperty('harmony');
    expect(score.harmony[1].start).toBe(480);
  });

  it('accepts supported chord qualities and rejects display-specific or unknown qualities', () => {
    const supportedQualities = [
      'major',
      'minor',
      'dominant7',
      'sus4',
      'dominant7sus4',
      'major6',
      'major7',
      'minor7',
      'halfDiminished7',
      'augmented',
    ] as const;
    supportedQualities.forEach((quality) => {
      expect(isValidScore(createScore({ harmony: [{ start: 0, duration: 480, root: 0, quality }] }))).toBe(true);
    });
    expect(
      validateScore(createScore({ harmony: [{ start: 0, duration: 480, root: 0, quality: 'm7b5' as never }] })),
    ).toContainEqual(expect.objectContaining({ path: 'harmony[0].quality' }));
    expect(
      validateScore(createScore({ harmony: [{ start: 0, duration: 480, root: 0, quality: '' as never }] })),
    ).toContainEqual(expect.objectContaining({ path: 'harmony[0].quality' }));
  });

  it('requires ordered non-overlapping harmony events', () => {
    const sequential = createScore({
      harmony: [
        { start: 0, duration: 480, root: 0, quality: 'major' },
        { start: 480, duration: 480, root: 7, quality: 'dominant7' },
      ],
    });
    expect(isValidScore(sequential)).toBe(true);

    const overlapping = createScore({
      harmony: [
        { start: 0, duration: 600, root: 0, quality: 'major' },
        { start: 480, duration: 480, root: 7, quality: 'dominant7' },
      ],
    });
    expect(validateScore(overlapping).some((issue) => issue.message.includes('must not overlap'))).toBe(true);
  });

  it('validates full measure durations while allowing a shorter pickup first measure', () => {
    const threeFour = createScore({
      timeSignature: { numerator: 3, denominator: 4 },
      measures: [
        { start: 0, duration: SCORE_PPQ * 3 },
        { start: SCORE_PPQ * 3, duration: SCORE_PPQ * 3 },
      ],
    });
    expect(isValidScore(threeFour)).toBe(true);

    const sixEight = createScore({
      timeSignature: { numerator: 6, denominator: 8 },
      measures: [{ start: 0, duration: SCORE_PPQ * 3 }],
    });
    expect(isValidScore(sixEight)).toBe(true);

    const pickup = createScore({
      measures: [
        { start: 0, duration: SCORE_PPQ },
        { start: SCORE_PPQ, duration: SCORE_PPQ * 4 },
      ],
    });
    expect(isValidScore(pickup)).toBe(true);

    const invalidNormalMeasure = createScore({
      measures: [
        { start: 0, duration: SCORE_PPQ * 4 },
        { start: SCORE_PPQ * 4, duration: SCORE_PPQ * 2 },
      ],
    });
    expect(validateScore(invalidNormalMeasure).some((issue) => issue.path === 'measures[1].duration')).toBe(true);

    const gap = createScore({
      measures: [
        { start: 0, duration: SCORE_PPQ * 4 },
        { start: SCORE_PPQ * 5, duration: SCORE_PPQ * 4 },
      ],
    });
    expect(validateScore(gap).some((issue) => issue.path === 'measures[1].start')).toBe(true);
  });

  it('requires at least one measure', () => {
    const score = createScore({ measures: [] });

    expect(validateScore(score)).toContainEqual(expect.objectContaining({ path: 'measures' }));
  });

  it('supports multiple lyrics on one note', () => {
    const score = createScore({
      parts: [
        {
          id: 'voice',
          name: 'Voice',
          role: 'voice',
          events: [
            {
              kind: 'note',
              start: 0,
              duration: 480,
              pitch: 60,
              lyrics: [
                { verse: '1', text: 'some', syllabic: 'begin' },
                { verse: '2', text: 'two', syllabic: 'single', elision: ' ' },
              ],
            },
          ],
        },
      ],
    });

    expect(isValidScore(score)).toBe(true);
  });

  it('allows lyric continuation without text but rejects meaningless lyric objects', () => {
    const continuation = createScore({
      parts: [
        {
          id: 'voice',
          name: 'Voice',
          role: 'voice',
          events: [{ kind: 'note', start: 0, duration: 480, pitch: 60, lyrics: [{ verse: '1', melisma: 'continue' }] }],
        },
      ],
    });
    expect(isValidScore(continuation)).toBe(true);

    const meaningless = createScore({
      parts: [
        {
          id: 'voice',
          name: 'Voice',
          role: 'voice',
          events: [{ kind: 'note', start: 0, duration: 480, pitch: 60, lyrics: [{ verse: '1' }] }],
        },
      ],
    });
    expect(validateScore(meaningless).some((issue) => issue.message.includes('text or a melisma'))).toBe(true);
  });

  it('validates tie chains across event and measure boundaries', () => {
    const score = createScore({
      parts: [
        {
          id: 'voice',
          name: 'Voice',
          role: 'voice',
          events: [
            { kind: 'note', start: 0, duration: 3840, pitch: 60, tie: { id: 'held', type: 'start' } },
            { kind: 'note', start: 3840, duration: 480, pitch: 60, tie: { id: 'held', type: 'stop' } },
          ],
        },
      ],
    });

    expect(isValidScore(score)).toBe(true);
    expect(() =>
      assertValidScore({
        ...score,
        parts: [
          {
            ...score.parts[0],
            events: [
              { kind: 'note', start: 0, duration: 480, pitch: 60, tie: { id: 'bad', type: 'start' } },
            ],
          },
        ],
      }),
    ).toThrow('must connect at least two');
  });

  it('keeps pitch values suitable for later chromatic transposition', () => {
    const score = createScore({
      parts: [{ id: 'voice', name: 'Voice', role: 'voice', events: [{ kind: 'note', start: 0, duration: 480, pitch: 60 }] }],
    });

    expect(isValidScore(score)).toBe(true);
    expect(score.parts[0].events[0]).toMatchObject({ kind: 'note', pitch: 60 });
    expect((score.parts[0].events[0] as { pitch: number }).pitch + 2).toBe(62);
  });
});
