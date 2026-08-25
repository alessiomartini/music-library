import type { LeadSheetSystem } from './types';
import { pitchAbsoluteIndex, pitchLabel, transposePitch } from './theory';

/** Lowest/highest sung pitch across all melody notes in a lead sheet,
 * transposed by `semitones` and displayed as scientific pitch labels. */
export function computeVocalRange(
  systems: LeadSheetSystem[] | undefined,
  semitones: number,
  preferFlats: boolean,
): { low: string; high: string } | null {
  if (!systems || systems.length === 0) return null;

  let lowPitch: string | null = null;
  let highPitch: string | null = null;
  let lowIdx = Infinity;
  let highIdx = -Infinity;

  for (const system of systems) {
    for (const measure of system.measures) {
      for (const note of measure.melody) {
        if (note.rest) continue;
        const idx = pitchAbsoluteIndex(note.pitch);
        if (idx < lowIdx) {
          lowIdx = idx;
          lowPitch = note.pitch;
        }
        if (idx > highIdx) {
          highIdx = idx;
          highPitch = note.pitch;
        }
      }
    }
  }

  if (!lowPitch || !highPitch) return null;

  return {
    low: pitchLabel(transposePitch(lowPitch, semitones, preferFlats), preferFlats),
    high: pitchLabel(transposePitch(highPitch, semitones, preferFlats), preferFlats),
  };
}
