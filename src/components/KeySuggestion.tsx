import { useVoicePrefs } from '../lib/prefs';
import { artistRange, keyShift, measuredShift, noteName, parseNote, rangeShift, type VocalProfile } from '../lib/vocalRange';
import { transposedKeyLabel, type ChordSystem } from '../lib/theory';
import type { ArtistInfo } from '../lib/artist';

interface Props {
  /** Keys the song may be in: the known key, or the candidates. */
  keys: string[];
  artist?: ArtistInfo;
  /** Range measured from the recording: when present it is preferred to the artist's voice type. */
  profile?: VocalProfile;
  system: ChordSystem;
  /** Applies a transposition (only for songs with a chart). */
  onApply?: (semitones: number) => void;
  /** Transposition currently applied to the chart, to tell when the suggestion is already in use. */
  current?: number;
}

/** Suggests the key to sing a song in, from the artist's range and the user's comfortable range. */
export function KeySuggestion({ keys, artist, profile, system, onApply, current }: Props) {
  const [voice] = useVoicePrefs();
  const low = parseNote(voice.comfortableLow);
  const high = parseNote(voice.comfortableHigh);
  const range = artistRange(artist);
  if (!range && !profile) return null;
  const italian = system === 'it';
  if (low === null || high === null || low >= high) {
    return (
      <p className="key-suggestion">
        Set your comfortable range under <strong>My voice</strong> on the home page to get a suggested key.
      </p>
    );
  }
  const measured = profile ? measuredShift(profile.histogram, { low, high }) : null;
  const shift = measured ? measured.shift : rangeShift(range!, { low, high });
  const move = keyShift(shift);
  const suggested = keys.map((k) => transposedKeyLabel(k, shift, system));
  const octaves = Math.round((shift - move) / 12);
  return (
    <div className="key-suggestion">
      <strong>Suggested {suggested.length ? `key for your voice: ${suggested.join(' or ')}` : 'transposition for your voice'}</strong>{' '}
      ({move === 0 ? 'as recorded' : `${move > 0 ? '+' : ''}${move} semitones`}
      {octaves !== 0 && `, ${octaves > 0 ? 'one octave up' : 'one octave down'}`.replace('one', Math.abs(octaves) === 1 ? 'one' : String(Math.abs(octaves)))})
      {onApply && current !== undefined && keyShift(current) === move && move !== 0 ? (
        <span> ✓ applied</span>
      ) : (
        onApply &&
        move !== 0 && (
          <button type="button" onClick={() => onApply(move)}>
            Apply
          </button>
        )
      )}
      <span className="key-suggestion-basis">
        {' '}
        {measured ? (
          <>
            Based on the range measured from the recording: {Math.round(measured.share * 100)}% of the singing time
            falls in your comfortable range {noteName(low, italian)}–{noteName(high, italian)} (
            {Math.round(measured.currentShare * 100)}% as recorded).
          </>
        ) : (
          <>
            Singer's range ≈ {noteName(range!.low, italian)}–{noteName(range!.high, italian)} ({range!.basis}, Wikidata),
            your comfortable range {noteName(low, italian)}–{noteName(high, italian)}. An estimate: the song's actual
            melody may sit higher or lower.
          </>
        )}
      </span>
    </div>
  );
}
