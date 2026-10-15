import { useVoicePrefs } from '../lib/prefs';
import { noteName, parseNote, type VocalProfile } from '../lib/vocalRange';
import type { ChordSystem } from '../lib/theory';

interface Props {
  profile: VocalProfile;
  /** Current transposition of the song, so the bars move with the key. */
  semitones: number;
  system: ChordSystem;
}

const pct = (share: number) => `${Math.round(share * 100)}%`;

/**
 * The notes sung in the recording, twice: weighted by how long each is sung
 * and by how many times. The user's comfortable range is shaded behind the bars.
 */
export function VocalHistogram({ profile, semitones, system }: Props) {
  const [voice] = useVoicePrefs();
  const italian = system === 'it';
  const comfortLow = parseNote(voice.comfortableLow);
  const comfortHigh = parseNote(voice.comfortableHigh);
  const notes = Array.from({ length: profile.high - profile.low + 1 }, (_, i) => profile.low + i);
  const outside = (h: Record<string, number>) =>
    Object.entries(h).reduce((sum, [n, share]) => (Number(n) < profile.low || Number(n) > profile.high ? sum + share : sum), 0);
  const name = (n: number) => noteName(n + semitones, italian);

  const chart = (title: string, h: Record<string, number>, unit: string) => {
    const max = Math.max(...notes.map((n) => h[n] ?? 0));
    return (
      <figure className="vocal-histogram">
        <figcaption>{title}</figcaption>
        <div className="vocal-bars" role="img" aria-label={`${title}: ${notes.map((n) => `${name(n)} ${pct(h[n] ?? 0)}`).join(', ')}`}>
          {notes.map((n) => {
            const sounding = n + semitones;
            const comfortable = comfortLow !== null && comfortHigh !== null && sounding >= comfortLow && sounding <= comfortHigh;
            const labelled = n === profile.low || n === profile.high || sounding % 12 === 0;
            return (
              <div key={n} className={`vocal-col${comfortable ? ' comfortable' : ''}`} title={`${name(n)}: ${pct(h[n] ?? 0)} ${unit}`}>
                <div className="vocal-bar-area">
                  <div className="vocal-bar" style={{ height: `${max ? ((h[n] ?? 0) / max) * 100 : 0}%` }} />
                </div>
                <span className="vocal-label">{labelled ? name(n) : ''}</span>
              </div>
            );
          })}
        </div>
        {outside(h) >= 0.01 && <p className="vocal-note">Plus {pct(outside(h))} on rarer notes outside this range.</p>}
      </figure>
    );
  };

  return (
    <div className="vocal-profile">
      <h2>Vocal range</h2>
      <p className="vocal-summary">
        Sung from <strong>{name(profile.low)}</strong> to <strong>{name(profile.high)}</strong>, mostly between{' '}
        {name(profile.coreLow)} and {name(profile.coreHigh)}
        {semitones !== 0 && ` (in the transposed key, ${semitones > 0 ? '+' : ''}${semitones})`}.
      </p>
      {chart('By time sung', profile.histogram, 'of the singing time')}
      {chart('By times sung', profile.countHistogram, 'of the sung notes')}
      <p className="vocal-note">
        Measured from the{' '}
        <a href={`https://www.youtube.com/watch?v=${profile.source}`} target="_blank" rel="noreferrer noopener">
          recording
        </a>{' '}
        ({Math.round(profile.seconds)} s of singing, {profile.notes} notes): the voice is separated from the instruments and
        its pitch tracked automatically, so treat it as an estimate. Shaded: your comfortable range (My voice).
      </p>
    </div>
  );
}
