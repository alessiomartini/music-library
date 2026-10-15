import { useVoicePrefs } from '../lib/prefs';
import { artistRange, keyShift, noteName, parseNote, rangeShift } from '../lib/vocalRange';
import { transposeKeyLabel, shouldPreferFlats, type ChordSystem } from '../lib/theory';
import type { ArtistInfo } from '../lib/artist';

interface Props {
  /** Keys the song may be in: the known key, or the candidates. */
  keys: string[];
  artist?: ArtistInfo;
  system: ChordSystem;
  /** Applies a transposition (only for songs with a chart). */
  onApply?: (semitones: number) => void;
}

/** Suggests the key to sing a song in, from the artist's range and the user's comfortable range. */
export function KeySuggestion({ keys, artist, system, onApply }: Props) {
  const [voice] = useVoicePrefs();
  const low = parseNote(voice.comfortableLow);
  const high = parseNote(voice.comfortableHigh);
  const range = artistRange(artist);
  if (!keys.length || !range) return null;
  const italian = system === 'it';
  if (low === null || high === null || low >= high) {
    return (
      <p className="key-suggestion">
        Set your comfortable range under <strong>My voice</strong> on the home page to get a suggested key.
      </p>
    );
  }
  const shift = rangeShift(range, { low, high });
  const move = keyShift(shift);
  const suggested = keys.map((k) => transposeKeyLabel(k, shift, system, shouldPreferFlats(k)));
  const octaves = Math.round((shift - move) / 12);
  return (
    <div className="key-suggestion">
      <strong>Suggested key for your voice: {suggested.join(' or ')}</strong>{' '}
      ({move === 0 ? 'as recorded' : `${move > 0 ? '+' : ''}${move} semitones`}
      {octaves !== 0 && `, ${octaves > 0 ? 'one octave up' : 'one octave down'}`.replace('one', Math.abs(octaves) === 1 ? 'one' : String(Math.abs(octaves)))})
      {onApply && move !== 0 && (
        <button type="button" onClick={() => onApply(move)}>
          Apply
        </button>
      )}
      <span className="key-suggestion-basis">
        {' '}
        Singer's range ≈ {noteName(range.low, italian)}–{noteName(range.high, italian)} ({range.basis}, Wikidata), your
        comfortable range {noteName(low, italian)}–{noteName(high, italian)}. An estimate: the song's actual melody
        may sit higher or lower.
      </span>
    </div>
  );
}
