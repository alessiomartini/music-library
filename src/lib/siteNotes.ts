// Notes go to the shared, write-only site-notes Worker (repo alessiomartini/site-notes);
// Claude reads them from its D1 and turns them into ROADMAP items.
const ENDPOINT = 'https://site-notes.alemarti-2001.workers.dev/music-library/notes';
const AUTHOR_KEY = 'site-notes.author';

/**
 * 'alessio' when this browser is marked as Alessio's: opening any page with `?sono-alessio`
 * marks it, for every alessiomartini.github.io site (they share localStorage). A label, not a login.
 */
export function noteAuthor(): string | undefined {
  try {
    if (new URLSearchParams(location.search).has('sono-alessio')) localStorage.setItem(AUTHOR_KEY, 'alessio');
    return localStorage.getItem(AUTHOR_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Sends one note; false when it could not be sent (it stays queued locally). */
export async function sendNote(text: string, page: string): Promise<boolean> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, page, author: noteAuthor() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
