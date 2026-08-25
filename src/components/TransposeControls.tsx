import { shouldPreferFlats, transposeKeyLabel, type ChordSystem } from '../lib/theory';

interface Props {
  originalKey: string;
  semitones: number;
  onSemitonesChange: (n: number) => void;
  system: ChordSystem;
  onSystemChange: (s: ChordSystem) => void;
  capo?: number;
}

export function TransposeControls({ originalKey, semitones, onSemitonesChange, system, onSystemChange, capo }: Props) {
  const preferFlats = shouldPreferFlats(originalKey);
  const displayedKey = transposeKeyLabel(originalKey, semitones, system, preferFlats);

  return (
    <div className="transpose-controls">
      <div className="control-group">
        <span className="control-label">Tonalità</span>
        <button type="button" onClick={() => onSemitonesChange(semitones - 1)} aria-label="Trasponi giù">
          −
        </button>
        <span className="current-key">
          {displayedKey}
          {capo ? <span className="capo-hint"> (capotasto {capo})</span> : null}
        </span>
        <button type="button" onClick={() => onSemitonesChange(semitones + 1)} aria-label="Trasponi su">
          +
        </button>
        {semitones !== 0 && (
          <button type="button" className="reset-btn" onClick={() => onSemitonesChange(0)}>
            reset
          </button>
        )}
      </div>

      <div className="control-group">
        <span className="control-label">Accordi</span>
        <div className="toggle-pair">
          <button
            type="button"
            className={system === 'it' ? 'active' : ''}
            onClick={() => onSystemChange('it')}
          >
            Italiano
          </button>
          <button
            type="button"
            className={system === 'en' ? 'active' : ''}
            onClick={() => onSystemChange('en')}
          >
            Inglese
          </button>
        </div>
      </div>
    </div>
  );
}
