import { useVoicePrefs } from '../lib/prefs';
import { noteName, parseNote, type VocalProfile } from '../lib/vocalRange';
import type { ChordSystem } from '../lib/theory';

interface Props {
  profile: VocalProfile;
  system: ChordSystem;
}

/** Same axis for every song (C2–C6, which holds every range measured so far), so songs compare at a glance. */
const AXIS_LOW = 36;
const AXIS_HIGH = 84;
const NOTES = Array.from({ length: AXIS_HIGH - AXIS_LOW + 1 }, (_, i) => AXIS_LOW + i);

const pct = (share: number) => `${Math.round(share * 100)}%`;

/**
 * The notes sung in the recording, as sung (not transposed): for each note, one bar
 * for its share of the singing time and one for its share of the sung notes (how many
 * times it is sung). The user's comfortable range is shaded behind the bars, the rest of
 * their full range (reachable, not comfortable) is hatched.
 */
export function VocalHistogram({ profile, system }: Props) {
  const [voice] = useVoicePrefs();
  const italian = system === 'it';
  const comfortLow = parseNote(voice.comfortableLow);
  const comfortHigh = parseNote(voice.comfortableHigh);
  const fullLow = parseNote(voice.fullLow);
  const fullHigh = parseNote(voice.fullHigh);
  const time = profile.histogram;
  const count = profile.countHistogram;
  const max = Math.max(...NOTES.map((n) => Math.max(time[n] ?? 0, count[n] ?? 0)));
  const height = (share = 0) => `${max ? (share / max) * 100 : 0}%`;
  const name = (n: number) => noteName(n, italian);

  return (
    <div className="vocal-profile">
      <h2>Vocal range</h2>
      <p className="vocal-summary">
        Sung from <strong>{name(profile.low)}</strong> to <strong>{name(profile.high)}</strong>, mostly between{' '}
        {name(profile.coreLow)} and {name(profile.coreHigh)}.
      </p>
      <p className="vocal-legend">
        <span className="vocal-swatch time" /> share of the singing time{' '}
        <span className="vocal-swatch count" /> share of the sung notes (how many times){' '}
        <span className="vocal-swatch comfortable" /> your comfortable range{' '}
        <span className="vocal-swatch reachable" /> your full range, not comfortable
      </p>
      <div
        className="vocal-bars"
        role="img"
        aria-label={`Vocal histogram: ${NOTES.filter((n) => time[n] || count[n])
          .map((n) => `${name(n)} ${pct(time[n] ?? 0)} of the time, ${pct(count[n] ?? 0)} of the notes`)
          .join('; ')}`}
      >
        {NOTES.map((n) => {
          const comfortable = comfortLow !== null && comfortHigh !== null && n >= comfortLow && n <= comfortHigh;
          const reachable = !comfortable && fullLow !== null && fullHigh !== null && n >= fullLow && n <= fullHigh;
          return (
            <div
              key={n}
              className={`vocal-col${comfortable ? ' comfortable' : reachable ? ' reachable' : ''}`}
              title={`${name(n)}: ${pct(time[n] ?? 0)} of the singing time, ${pct(count[n] ?? 0)} of the sung notes`}
            >
              <div className="vocal-bar-area">
                <div className="vocal-bar time" style={{ height: height(time[n]) }} />
                <div className="vocal-bar count" style={{ height: height(count[n]) }} />
              </div>
              <span className="vocal-label">{n % 12 === 0 ? name(n) : ''}</span>
            </div>
          );
        })}
      </div>
      <p className="vocal-note">
        Measured from the{' '}
        <a href={`https://www.youtube.com/watch?v=${profile.source}`} target="_blank" rel="noreferrer noopener">
          recording
        </a>{' '}
        ({Math.round(profile.seconds)} s of singing, {profile.notes} notes), in the original key: the voice is separated
        from the instruments and its pitch tracked automatically, so treat it as an estimate. Your ranges come from My voice
        on the home page (set the full range to see the hatched part).
      </p>
    </div>
  );
}
