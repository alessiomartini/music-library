/** Hand-curated corrections for scripts/import-spotify.ts, keyed by Spotify track id. */
export interface Override {
  /** Not a song for this library. */
  skip?: boolean;
  title?: string;
  artist?: string;
  classical?: boolean;
  /** Attach to this existing library song. */
  slug?: string;
  /** Never merge with a same-title song (a different song that shares the title). */
  separate?: boolean;
}

/** First-credited artists that make a track a classical piece (composer as artist, no chord-site links). */
export const classicalComposers = new Set([
  'Anton Webern',
  'Antonio Vivaldi',
  'Camille Saint-Saëns',
  'Charles Gounod',
  'Claude Debussy',
  'Dmitri Shostakovich',
  'Edward Elgar',
  'Erik Satie',
  'Felix Mendelssohn',
  'Franz Liszt',
  'Franz Schubert',
  'Frédéric Chopin',
  'George Frideric Handel',
  'Gioachino Rossini',
  'Jean Sibelius',
  'Johann Sebastian Bach',
  'Jorge Morel',
  'Karl Jenkins',
  'Ladislav Kupkovic',
  'Ludwig van Beethoven',
  'Pyotr Ilyich Tchaikovsky',
  'Robert Schumann',
  'Roland Dyens',
  'Sergei Rachmaninoff',
  'Wolfgang Amadeus Mozart',
]);

export const overrides: Record<string, Override> = {
  // Classical: short work titles in the style of the existing library entries.
  '7lCqzDWT6GPECGp0TzMnR7': { title: 'Die Forelle, D. 550' },
  '126F4IqzqgRSArBiO8yEuK': { title: 'Piano Trio No. 2, D. 929: II. Andante con moto' },
  '6pWoP3mTpvxst9VrBKsCYg': { title: 'Fantasia in F minor, D. 940' },
  '4yiIbaEVZuFctVbWI68P9n': { title: 'Fantasia in F minor, D. 940' },
  '1Cze6qOgsF59CJhF2qWEMQ': { title: 'Piano Sonata in C minor, D. 958: IV. Allegro' },
  '0vn3HaXWDrMWsW4yKofMRs': { title: 'Symphony No. 2, Op. 27: III. Adagio', artist: 'Sergei Rachmaninoff', classical: true },
  '1VXTtqcjdhofFgrvz19FMJ': { title: 'Symphony No. 2, Op. 27: III. Adagio' },
  '7HDqxZ13HhwtwCEGAlz3Gz': { title: 'Waltz Op. 64 No. 2' },
  '7okKvdleT3J4My0srfGEWG': { title: 'Waltz Op. 64 No. 2' },
  '4Cdqa3xwvMc5NrLo2nnQTV': { title: 'Waltz Op. 69 No. 2' },
  '71MpmxCJ1TW05c7Fvv1SfI': { title: 'Waltz in A minor, Op. posth.' },
  '7Fo7PmFuA11TCRwD2fOvtL': { title: 'Grande valse brillante, Op. 18' },
  '5WYAjlqPvLXiVZcVZvHxCX': { title: 'Étude Op. 10 No. 3 "Tristesse"' },
  '2MMm5gCJ7z9HgYGcDcuwdb': { title: 'Nocturne Op. 27 No. 2' },
  '7eiTrJ0Q60aF5XeUqgUoDB': { title: 'Cello Sonata, Op. 65: III. Largo' },
  '1MHkrzApuTiaDNJqY4m9IW': { title: 'Prelude Op. 28 No. 6' },
  '1EGFCxKCQ3isMnlPzEW8G1': { slug: 'nocturne-op-9-no-1' },
  '20EV5Syo7BZ9LWfqouNPyV': { slug: 'song-without-words-op-67-no-2' },
  '2hNhsPZVVOr0SOqShooaEJ': { title: 'Valse sentimentale, Op. 51 No. 6' },
  '1upQiytDIEZfl9ItruoXuC': { title: 'Sarabande (Keyboard Suite, HWV 437)' },
  '6iui7GXTxMRSlexoOCLL8S': { title: 'Träumerei (Kinderszenen, Op. 15 No. 7)', artist: 'Robert Schumann', classical: true },
  '4SbAXtlOJ0eCL0XwFVi0Ij': { title: 'Träumerei (Kinderszenen, Op. 15 No. 7)' },
  '1kof0mlRSrLyGP4vdS2hjh': { title: 'Träumerei (Kinderszenen, Op. 15 No. 7)' },
  '3MV9u27GAg3GZAvpeeBYGx': { title: 'Bittendes Kind (Kinderszenen, Op. 15 No. 4)' },
  '6CqxOPgADuFf8lKKXx7Jsd': { title: 'Fröhlicher Landmann (Album für die Jugend, Op. 68 No. 10)' },
  '3rRe7Kq4f7KJWAmAcDACLI': { title: 'Wilder Reiter (Album für die Jugend, Op. 68 No. 8)' },
  '1Uf9cT6BIRr333uIZ64H0T': { title: 'Palladio: I. Allegretto' },
  '3tRT6unYEvgBTbAdAWPSVp': { slug: 'prelude-in-c-minor-bwv-847' },
  '2zroUyG80xataKpq0JaYtX': { title: 'Siciliano (Flute Sonata, BWV 1031)' },
  '2yfPOfxj9nWrFAQtvyP8J6': { title: 'Solfeggietto in C minor', artist: 'Carl Philipp Emanuel Bach', classical: true },
  '5VPHCoZskR2TyrubMtersz': { title: 'Symphony No. 25, K. 183: I. Allegro con brio' },
  '23lDDFpPqVktmCcUhc0ytw': { slug: 'lacrimosa-requiem' },
  '5WQ0WJJihKicN8eax9mtkX': { title: 'Piano Concerto No. 23, K. 488: II. Adagio' },
  '35BWqTyAufkiowBK26ssGQ': { slug: 'piano-sonata-k-545' },
  '56IjDZaIBAPEMpILBVGiMW': { title: 'Piano Sonata K. 283: I. Allegro' },
  '2kyEgPaAW8wdpvevPnkf0Z': { title: 'Ave Maria (Bach–Gounod)' },
  '3XIGtjlniVGZgYuvZ1A9CF': { slug: 'pathetique-sonata-op-13' },
  '0HXkeWXAYYPoR0wml4gtgu': { slug: 'pathetique-sonata-op-13' },
  '703iyFFCGrfBxVIFQ1MZ7O': { slug: 'tempest-sonata-op-31-no-2' },
  '1PT3zNAnVCN2CjeYaTcQH7': { title: 'The Barber of Seville: Overture' },
  '3QaPlDueCFnbJdPCeK0RbM': { slug: 'william-tell-overture' },
  '0jOnZhF75V68VsBObWx2XO': { title: 'The Swan (The Carnival of the Animals)' },
  '0P7UwPB9vL74bD6gzYaKIu': { title: "Salut d'Amour, Op. 12" },
  '0R2qyLsZ2RGLTVuWYqaRWS': { title: 'Langsamer Satz' },
  '5UNRvB2ENgfVg6wB57NbIr': { title: 'Granen, Op. 75 No. 5' },
  '0pjCsB0XNSyqM9UazlTODC': { slug: 'waltz-no-2' },
  '2Hnurh1BcigGbCGFOb4Uid': { title: 'La campanella, S. 141 No. 3' },
  '3Nd9wTStUxHHBWkbrENCVL': { slug: 'liebestraum-no-3' },
  '4820SC1xnUaabzzYQTDkP2': { title: 'Gnossienne No. 1' },
  '1PDF4KlVztuqlVfrLt3FEr': { title: 'Arabesque No. 1' },
  '15p1shEFbxSlTTwxdGMggG': { title: 'Arabesque No. 1' },
  '0ROMalDdNg3L2HoZP4qFyJ': { slug: 'winter-the-four-seasons' },
  '1v9vRBvm5aqDN3M2Y4lHVY': { title: 'Souvenir' },
  '2jCIkSbrPIHGzLTLHztbcS': { title: 'Capricho árabe', artist: 'Francisco Tárrega', classical: true },
  '2Eie2WmbIoujBGuEFBNld5': { title: 'Tango en Skaï' },
  '0C98fO2u3SCuro95WEqp23': { title: 'Chaconne (Partita No. 2, BWV 1004)' },

  // Library songs under another title.
  '4qGfJb2KByjvzrwo8HNibg': { slug: 'garota-de-ipanema' },
  '4tH4bnfPsSWTpzqV0ux4IQ': { slug: 'tutti-quanti-voglion-fare-il-jazz' },
  '2dAOKHKapOngJv8sMI8GGZ': { slug: 'tutti-quanti-voglion-fare-il-jazz' },

  // Different songs that share a title with another liked song.
  '4v7DCN09hgXkKazefkznDQ': { separate: true }, // Lonely — Akon (vs Justin Bieber)
  '5jr6pG3khBcBXZRm8NogSe': { separate: true }, // Baby I'm Yours — Breakbot (vs Arctic Monkeys)
  '0TOCRIo2NjnhVLVQc1vdG6': { separate: true }, // Losers — YOUNGTONES (vs Laxxard)
  '1tHpYheOUwVgKIgNzH4BvI': { separate: true }, // Estate — Jovanotti (vs Bruno Martino)
  '6aVjoOuDQV65LxinwWiig4': { separate: true }, // Estate — Erlend Øye
  '2Syd1e3FwLxL8CBiOZNmVe': { separate: true }, // Inverno — Post Nebbia (vs De André)
  '6qB6EMEcAo0l3dVxZSvxpC': { separate: true }, // Desaparecido — Daniele Silvestri (vs Manu Chao)
  '6FZDfxM3a3UCqtzo5pxSLZ': { separate: true }, // Without Me — Halsey (vs Eminem)
  '5p7ujcrUXASCNwRaWNHR1C': { separate: true }, // Without Me — Halsey
  '22vgEDb5hykfaTwLuskFGD': { separate: true }, // Sucker — Jonas Brothers (vs Ellie Dixon)
  '4hQ6UGyWQIGJmHSo0J88JW': { separate: true }, // Back to You — Selena Gomez (vs Louis Tomlinson)

  // Same song under a different title.
  '1XyL3J7eTTKnxRZAM3LqIT': { title: "Beggin'" },
  '4mn2kNTqiGLwaUR8JdhJ1l': { title: 'The House of the Rising Sun' },

  // Song credited to its original artist rather than the liked cover.
  '1BqCvJF4uP54B0leMFo8F1': { artist: 'Paolo Conte' },
  '01FFgrZHoHWRcQWFolElUm': { artist: 'Suzanne Vega' },
  '1vxw6aYJls2oq3gW0DujAo': { artist: 'Gnarls Barkley' },
  '7eXrGBrl1mBKhxlWX0IoOQ': { title: "Beggin'", artist: 'The Four Seasons' },
  '6XQHlsNu6so4PdglFkJQRJ': { artist: 'Ryan Gosling & Emma Stone' },
  '0y1QJc3SJVPKJ1OvFmFqe6': { title: 'Way Down We Go' },

  // Credits padded with session/featured musicians.
  '6IiuxVcMXNZS1YkSmag1z6': { artist: 'Luciano Pavarotti' },
  '7dbBEYOhi91qDhMJ960nmd': { artist: 'Lucio Dalla' },
  '1TfqLAPs4K3s2rJMoCokcS': { artist: 'Eurythmics' },
};
