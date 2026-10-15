/**
 * Hand-checked corrections for scripts/fetch-artists.ts, keyed by song artist:
 * the right Wikidata id when the Wikipedia lookup finds a namesake, or null
 * when the right artist has no Wikidata entry (or it can't be told apart).
 * Checked by hand on 2026-10-15 against the Wikidata label and description.
 */
export const artistOverrides: Record<string, string | null> = {
  // Namesakes: an American band, a French band, a Dutch singer, a Portuguese singer...
  Calcutta: 'Q24066841', // Italian singer-songwriter Edoardo D'Erme
  Celeste: 'Q76642775', // British singer ("Strange")
  'Dave, Central Cee': 'Q27909736', // English rapper Santan Dave
  'Elisa, Francesco De Gregori': 'Q166164', // Elisa Toffoli
  Mannarino: 'Q3610116', // Alessandro Mannarino (was a disambiguation page)
  Nitro: 'Q19979505', // Italian rapper Nitro, not the glam metal band
  Prince: 'Q7542', // Prince himself, not Prince and the Revolution
  ROSALÍA: 'Q28843759', // capitalised name the lookup can't find
  'Vittorio De Scalzi': 'Q4015351', // himself, not New Trolls
  // Wrong match and no right entry to use.
  'Aaron Smith': null, // a Nashville drummer, not the "Dancin" DJ
  Anonymous: null,
  Doe: null,
  Holden: null,
  'James Smith': null, // LL Cool J's real name, not the English singer
  Lay: null,
  Mazzariello: null, // a family-name item
  NOIA: null,
  'Ollie, X Ambassadors': null, // an Estonian singer
  'Party Pupils': null, // a discography page
  'Peachy!, Shiloh': null, // a Japanese voice actress
  Random: null, // a band, not the Italian rapper
  Stealth: null,
  'The Big Push': null, // an album
  Traditional: null, // the concept of tradition
  Turi: null, // a Bhangra band
  'USA for Africa': null, // the song "We Are the World"
};

/** Names that are common words: Commons files named after them show trains, oases, queens... keep the main image only. */
export const mainPhotoOnly = new Set(['Train', 'Passenger', 'Oasis', 'Queen', 'Cream', 'America', 'Berlin', 'Journey', 'Survivor', 'Toto']);
