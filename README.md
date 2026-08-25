# Libreria di canzoni

Libreria personale di canzoni con testo, accordi e linea melodica sul pentagramma.

## Funzionalità

- Testo con accordi allineati sopra le sillabe.
- Sistema accordi selezionabile: italiano (Do Re Mi...) o inglese (C D E...).
- Trasposizione in tempo reale (anche della linea melodica).
- Linea melodica sul pentagramma (VexFlow), trasposta insieme agli accordi.
- Tonalità preferita per cantare ogni brano, con nota libera, salvata nel browser.
- Box "Note per migliorare il sito" per annotare idee/bug, salvato nel browser.

I brani sono definiti in `src/data/songs/`. Per aggiungerne uno nuovo, crea un file
sul modello degli altri ed esportalo da `src/data/songs/index.ts`.

Le trascrizioni delle melodie sono bozze dell'incipit vocale (da verificare/completare
per orecchio); i dati di preferenza tonalità e le note del feedback box vivono solo
nel `localStorage` del browser, non su un server.

## Sviluppo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
