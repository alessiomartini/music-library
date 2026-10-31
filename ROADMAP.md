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
- [x] Emoji degli strumenti usati nelle cover (433 cover su 1860, dove il canale o la nota nominano lo strumento)
- [ ] Range vocale dell'artista per trasporre al range comodo dell'utente
- [ ] Link YouTube diretti (oggi ricerca) — serve accesso di rete a YouTube
- [ ] Tonalità ed estensione vocale di ogni canzone
- [x] Range vocale misurato dalla registrazione: 1743 canzoni su 1904
- [ ] Range vocale per le 161 canzoni senza video abbinabile automaticamente (scelta a mano del video)
- [x] Link all'analisi Hooktheory (TheoryTab) nella pagina canzone, dove la pagina è verificata (153 canzoni)
- [x] Import Spotify automatico ogni lunedì (GitHub Action), attivo quando ci sono i 3 secret Spotify
- [x] Originali vs cover: correzioni a mano (`originals.ts`), versioni tradotte con link nella pagina dell'originale
- [x] Filtri della lista: inglese, italiano, altre lingue, jazz standards; link a Wikipedia nella pagina canzone
- [x] Filtri Classica / Non classica (78 brani classici, compresi 3 arrivati dalle cover YouTube)
- [x] Istogramma del range vocale: oltre al range comodo, a righe la parte dell'estensione completa che non è comoda (da *My voice*)
- [ ] Cover non ancora trovate: canzoni senza pagina Wikipedia (~680) da controllare
- [ ] Tonalità dall'audio: 64% esatte sulle 265 canzoni con tonalità nota (accompagnamento + profilo Krumhansl); non pubblicata
- [ ] Hooktheory Trends API (canzoni con la stessa progressione): serve un account Hooktheory di Alessio
- [x] Suggerimento di tonalità dalla distribuzione misurata (oggi dal tipo di voce)
- [ ] Schede Testo / Accordi a battute / Lead sheet
- [x] Suggerimento automatico della tonalità dal range vocale (Mi2–Sib4)
- [ ] Trascrivere altri brani come Score (oggi solo 2), con la pipeline di `music-library-offline`

## Idee
- [ ] Registri della voce separati nell'istogramma: voce di petto, mista, di testa, falsetto (ognuno col suo range e colore), al posto della sola coppia comodo / estensione completa

## Decisioni e cose provate

Emoji degli strumenti: il modello dati non aveva strumenti. Aggiunto `instruments` opzionale a `SpotifyVersion` e `YoutubeCover`; se manca, `src/lib/instruments.ts` lo ricava con parole chiave esplicite nel nome del canale o nella nota (chitarra/guitar/12-string/nylon-string, piano, violin, drums, sax, ukulele). Non si deduce nulla dall'artista o dalla canzone. Restano senza emoji le cover di Allie Sherlock, Fabio Rodrigues e Paolo Pilo (a meno che la nota nomini lo strumento): serve il dato da Alessio, da mettere a mano in `instruments`.

Suggerimento di tonalità dalla distribuzione misurata: tra le trasposizioni da −24 a +24 semitoni sceglie quella che mette più tempo cantato (istogramma per tempo) nel range comodo, a parità la più piccola (verso l'alto per prima); senza dati misurati resta il tipo di voce. Scartato per ora: pesare anche l'istogramma per numero di note o penalizzare le note fuori dal range *full* ma non comode (si potrebbe, ma è una scelta da fare con l'uso); la distribuzione non distingue i registri (voce di petto/falsetto), vedi idea già in lista. La stima resta approssimata: la registrazione misurata può essere in una tonalità diversa dal grafico.

Suggerimento automatico dal range vocale (Mi2–Sib4 di default): la logica c'era già (`measuredShift`, ripiego su `rangeShift` dal tipo di voce); in questo passo solo test dei casi limite (parità → verso l'alto, brano più largo del range, adattamento esatto), suggerimento mostrato anche quando la tonalità è ignota (solo semitoni) e «✓ applied» al posto del pulsante Apply quando la trasposizione è già in uso. Algoritmo invariato: minimizza il tempo cantato fuori range, a parità il minimo spostamento assoluto. Limite risolto subito dopo: l'ortografia dell'etichetta (es. «La#» invece di «Sib») seguiva la tonalità originale.

Ortografia delle tonalità trasposte: ora decide la tonalità di arrivo (maggiori F, Sib, Mib, Lab, Reb, Solb con i bemolli, le altre con i diesis; le minori seguono la relativa maggiore), non quella originale. Vale per l'etichetta della tonalità, il suggerimento, l'elenco della tonalità preferita e gli accordi nella vista trasposta (stesso `preferFlats`). Solb/Fa# maggiore: scelto Solb (coerente con Mib minore ai bemolli); Fa# minore ai diesis. Dati delle canzoni non toccati.

Documento di progetto lungo (rappresentazione musicale, rendering, trasposizione, range vocale): [`docs/DESIGN.md`](docs/DESIGN.md).

## Log
- 2026-10-31: 🤖 suggerimento di tonalità dal range vocale: test dei casi limite, suggerimento anche senza tonalità nota, «applied» quando già in uso; tonalità e accordi trasposti scritti secondo la tonalità di arrivo (Sib, non La#)
- 2026-10-20: 🤖 suggerimento di tonalità basato sulla distribuzione misurata del tempo cantato (con ripiego sul tipo di voce) e indicazione della base usata nella pagina canzone
- 2026-10-19: filtri Classica / Non classica; nell'istogramma del range vocale anche la parte non comoda dell'estensione (a righe); idea: registri della voce separati; le note del sito ora vanno nel backend unico `site-notes` (prima restavano solo nel browser), con l'autore (`?sono-alessio` segna il browser di Alessio); 🤖 emoji degli strumenti accanto alle cover YouTube (433 su 1860, da canale e nota); installabile come app a sé dal telefono (manifest con nome, icona e perimetro propri)
- 2026-10-18: docs/FUTURE-ARCHITECTURE.md rinominato docs/DESIGN.md (protocollo unico: niente file FUTURE-ARCHITECTURE); note isolate tolte dagli istogrammi; cover corrette con l'originale e versioni tradotte; filtri per lingua e jazz standards; import Spotify automatico; range vocale misurato per 1743 canzoni; link all'analisi Hooktheory nella pagina canzone
- 2026-10-15 (notte): range vocale dalla registrazione (Demucs + pYIN) su 3 canzoni, due istogrammi nella pagina canzone
- 2026-10-15 (notte): note storiche da Wikipedia per 1243 canzoni (script `fetch:history`, it per le canzoni italiane, en altrimenti)
- 2026-10-15 (sera): foto degli artisti e tipo di voce da Wikipedia/Wikidata/Commons, controllo a campione e override degli omonimi, filtro delle foto non dell'artista
- 2026-10-15 (sera): canzoni dei medley e dei video su un artista di Paolo Pilo e chitarradisagio, individuate dalle trascrizioni automatiche e dai commenti (+208 canzoni)
- 2026-10-15: import Spotify/Instagram con versioni su una scheda; link Spotify/YouTube per tutte le canzoni, bollino versioni, copertine album; creata la roadmap per Projects Overview; tonalità dal web con candidate, autori delle cover Instagram; cover YouTube (Pilo, chitarradisagio, Allie Sherlock, Fabio Rodrigues), range vocale e suggerimento tonalità
