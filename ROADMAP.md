# Roadmap

<!--
Letto automaticamente da Projects Overview (https://alessiomartini.github.io/projects-overview/):
ogni titolo "##" è una fase, le checkbox "- [ ]" / "- [x]" danno la percentuale di avanzamento,
"## Log" è il diario (una riga per giorno, la più recente in alto).
-->

## Fatto
- [x] Metadati delle canzoni, ricerca, link a Spotify/YouTube/spartiti
- [x] Score normalizzato e visualizzazione su pentagramma (VexFlow)
- [x] Trasposizione e tonalità preferita
- [x] Link diretti ad Accordi&Spartiti e Ultimate Guitar

- [x] Import di Spotify (preferiti e playlist) e Instagram, versioni multiple su una scheda
- [x] Link Spotify/YouTube per tutte le canzoni, bollino con il numero di versioni, copertine degli album

- [x] Tonalità dal web (Hooktheory, Ultimate Guitar) con tonalità candidate quando incerta
- [x] Nome dell'autore delle cover Instagram, bollino che conta solo le cover

- [x] Cover YouTube di Paolo Pilo, chitarradisagio, Allie Sherlock, Fabio Rodrigues (+768 canzoni nuove)
- [x] Range vocale comodo dell'utente e suggerimento di tonalità dal tipo di voce dell'artista (codice)
- [x] Foto degli artisti all'epoca della canzone e tipo di voce da Wikidata (872/995 artisti, override a mano degli omonimi)
- [x] Istogrammi del range vocale misurato dalla registrazione (per tempo cantato e per numero di note), validati su 3 canzoni
- [x] Note storiche dalla voce Wikipedia della canzone (1243/1979 canzoni, link e licenza CC BY-SA)
- [x] Video dedicati a un artista e medley (Paolo Pilo, chitarradisagio): 314 voci dalle trascrizioni e dai commenti, col minuto

## Da fare
- [ ] Emoji degli strumenti usati nelle cover
- [ ] Range vocale dell'artista per trasporre al range comodo dell'utente
- [ ] Link YouTube diretti (oggi ricerca) — serve accesso di rete a YouTube
- [ ] Tonalità ed estensione vocale di ogni canzone
- [x] Range vocale misurato dalla registrazione: 1743 canzoni su 1904
- [ ] Range vocale per le 161 canzoni senza video abbinabile automaticamente (scelta a mano del video)
- [x] Link all'analisi Hooktheory (TheoryTab) nella pagina canzone, dove la pagina è verificata (153 canzoni)
- [x] Import Spotify automatico ogni lunedì (GitHub Action), attivo quando ci sono i 3 secret Spotify
- [ ] Hooktheory Trends API (canzoni con la stessa progressione): serve un account Hooktheory di Alessio
- [ ] Suggerimento di tonalità dalla distribuzione misurata (oggi dal tipo di voce)
- [ ] Schede Testo / Accordi a battute / Lead sheet
- [ ] Suggerimento automatico della tonalità dal range vocale (Mi2–Sib4)
- [ ] Trascrivere altri brani come Score (oggi solo 2), con la pipeline di `music-library-offline`

## Decisioni e cose provate

Documento di progetto lungo (rappresentazione musicale, rendering, trasposizione, range vocale): [`docs/FUTURE-ARCHITECTURE.md`](docs/FUTURE-ARCHITECTURE.md).

## Log
- 2026-10-18: range vocale misurato per 1743 canzoni; link all'analisi Hooktheory nella pagina canzone
- 2026-10-15 (notte): range vocale dalla registrazione (Demucs + pYIN) su 3 canzoni, due istogrammi nella pagina canzone
- 2026-10-15 (notte): note storiche da Wikipedia per 1243 canzoni (script `fetch:history`, it per le canzoni italiane, en altrimenti)
- 2026-10-15 (sera): foto degli artisti e tipo di voce da Wikipedia/Wikidata/Commons, controllo a campione e override degli omonimi, filtro delle foto non dell'artista
- 2026-10-15 (sera): canzoni dei medley e dei video su un artista di Paolo Pilo e chitarradisagio, individuate dalle trascrizioni automatiche e dai commenti (+208 canzoni)
- 2026-10-15: import Spotify/Instagram con versioni su una scheda; link Spotify/YouTube per tutte le canzoni, bollino versioni, copertine album; creata la roadmap per Projects Overview; tonalità dal web con candidate, autori delle cover Instagram; cover YouTube (Pilo, chitarradisagio, Allie Sherlock, Fabio Rodrigues), range vocale e suggerimento tonalità
