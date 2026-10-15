import { useVoicePrefs } from '../lib/prefs';
import { parseNote } from '../lib/vocalRange';

/** Where the user enters their voice range, kept in this browser. */
export function VoiceSettings() {
  const [voice, setVoice] = useVoicePrefs();
  const field = (key: keyof typeof voice, placeholder: string) => (
    <input
      type="text"
      className={voice[key] && parseNote(voice[key]) === null ? 'invalid' : ''}
      value={voice[key]}
      placeholder={placeholder}
      size={5}
      onChange={(e) => setVoice({ ...voice, [key]: e.target.value })}
      aria-label={placeholder}
    />
  );
  return (
    <details className="voice-settings">
      <summary>My voice</summary>
      <p>
        Comfortable range {field('comfortableLow', 'Mi2')} – {field('comfortableHigh', 'Sib4')}
      </p>
      <p>
        Full range (optional) {field('fullLow', 'Re2')} – {field('fullHigh', 'Do5')}
      </p>
      <p className="voice-settings-hint">
        Note names like Mi2, Sib4 or E2, Bb4. Song pages then suggest a key that puts the singer's range in your
        comfortable range. Saved in this browser only.
      </p>
    </details>
  );
}
