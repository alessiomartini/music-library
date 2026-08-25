import { useState } from 'react';
import { ALL_KEYS_SHARP, keyName, semitoneDiff, shouldPreferFlats, type ChordSystem } from '../lib/theory';

interface Props {
  originalKey: string;
  preferredKey: string;
  note: string;
  system: ChordSystem;
  onSave: (preferredKey: string, note: string) => void;
  onApply: (semitones: number) => void;
}

export function KeyPreference({ originalKey, preferredKey, note, system, onSave, onApply }: Props) {
  const [draftKey, setDraftKey] = useState(preferredKey);
  const [draftNote, setDraftNote] = useState(note);
  const preferFlats = shouldPreferFlats(originalKey);

  function handleSave() {
    onSave(draftKey, draftNote);
  }

  function handleApply() {
    if (!draftKey) return;
    onApply(semitoneDiff(originalKey, draftKey));
  }

  return (
    <div className="key-preference">
      <h3>Tonalità preferita per cantarla</h3>
      <div className="key-preference-row">
        <select value={draftKey} onChange={(e) => setDraftKey(e.target.value)}>
          <option value="">— non impostata —</option>
          {ALL_KEYS_SHARP.map((_, i) => {
            const label = keyName(i, system, preferFlats);
            return (
              <option key={label} value={label}>
                {label}
              </option>
            );
          })}
        </select>
        <button type="button" onClick={handleApply} disabled={!draftKey}>
          Applica trasposizione
        </button>
      </div>
      <textarea
        placeholder="Note libere, es. 'meglio un tono sotto per la mia voce'…"
        value={draftNote}
        onChange={(e) => setDraftNote(e.target.value)}
        rows={2}
      />
      <button type="button" className="save-btn" onClick={handleSave}>
        Salva preferenza
      </button>
    </div>
  );
}
