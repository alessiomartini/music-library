import { useState } from 'react';
import { useFeedbackNotes } from '../lib/prefs';
import type { FeedbackNote } from '../lib/prefs';

export function FeedbackBox() {
  const [notes, setNotes] = useFeedbackNotes();
  const [draft, setDraft] = useState('');
  const [open, setOpen] = useState(false);

  function addNote() {
    const text = draft.trim();
    if (!text) return;
    const note: FeedbackNote = { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() };
    setNotes([note, ...notes]);
    setDraft('');
  }

  function toggleDone(id: string) {
    setNotes(notes.map((n) => (n.id === id ? { ...n, done: !n.done } : n)));
  }

  function remove(id: string) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  const pending = notes.filter((n) => !n.done).length;

  return (
    <div className={`feedback-box ${open ? 'open' : ''}`}>
      <button type="button" className="feedback-toggle" onClick={() => setOpen((o) => !o)}>
        📝 Site improvement notes {pending > 0 ? `(${pending})` : ''}
      </button>
      {open && (
        <div className="feedback-panel">
          <div className="feedback-add">
            <textarea
              placeholder="Add an idea or a bug to fix…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote();
              }}
              rows={2}
            />
            <button type="button" onClick={addNote}>
              Add
            </button>
          </div>
          <ul className="feedback-list">
            {notes.length === 0 && <li className="feedback-empty">No notes yet.</li>}
            {notes.map((n) => (
              <li key={n.id} className={n.done ? 'done' : ''}>
                <label>
                  <input type="checkbox" checked={n.done} onChange={() => toggleDone(n.id)} />
                  <span>{n.text}</span>
                </label>
                <button type="button" className="remove-btn" onClick={() => remove(n.id)} aria-label="Delete note">
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
