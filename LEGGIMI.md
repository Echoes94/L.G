# Sito L.G. — Gabriele Lucesole

Sito statico di 3 pagine: HTML, CSS e JavaScript, senza build né dipendenze.
Per vederlo apri `index.html` nel browser. Per pubblicarlo carica l'intera cartella `sito/` su qualsiasi hosting (Netlify, Vercel, GitHub Pages, il tuo hosting).

## Struttura

| File | Contenuto |
|---|---|
| `index.html` | Home (testo di Home.txt, allineato al tono della Sales page) |
| `metodo-efo.html` | Metodo EFO® (testo della Sales page) |
| `chi-sono.html` | Chi sono ("Il viaggio più importante") |
| `assets/css/style.css` | Colori, font e stile (palette e tipografia delle linee guida) |
| `assets/js/main.js` | Menu mobile, indice dei capitoli e movimento |
| `assets/img/` | Ritratto in 3 misure, logo/favicon, immagine di condivisione |
| `assets/fonts/` | Font del sito (Playfair Display, Merriweather, Inter); qui vanno anche i file di Ogg quando avrai la licenza web |

## Cose da aggiornare a mano

- **Posti disponibili.** In `metodo-efo.html` cerca `restano <strong>2 posti</strong>` e cambia il numero ogni mese.
- **P.IVA e privacy policy.** In fondo a ogni pagina c'è il commento `DA COMPLETARE`: aggiungi lì la P.IVA e il link alla privacy policy.
- **Font Ogg.** I file ricevuti sono una versione TRIAL: contengono solo lettere senza accenti e cifre (niente à, è, ?, virgole…) e la licenza è solo di prova. Per questo i titoli usano Playfair Display, il secondo font del brand. Quando avrai Ogg con licenza web:
  1. metti i file `.woff2` in `assets/fonts/` con i nomi `Ogg-Regular.woff2` e `Ogg-Italic.woff2`;
  2. in cima a `assets/css/style.css` togli il commento al blocco `@font-face`.
- **Indirizzo del sito.** Quando avrai il dominio, aggiungi `<link rel="canonical">` e rendi assoluto `og:image` (es. `https://tuodominio.it/assets/img/og-image.jpg`) nelle 3 pagine.

## Prenotazione

Tutti i pulsanti "Prenota" aprono un'email a gabriele.lucesole@gmail.com con oggetto "Sessione gratuita di professional coaching". Se in futuro userai un calendario (Calendly, Cal.com…), sostituisci l'indirizzo `mailto:` con il link del calendario: cerca `mailto:gabriele.lucesole@gmail.com?subject=` nelle 3 pagine.

## Accessibilità

- Contrasti verificati WCAG AA: sugli sfondi scuri pulsanti e link usano l'Azzurro ghiaccio, il Blu elettrico solo sugli sfondi chiari (sul nero non raggiunge il contrasto minimo).
- Navigabile da tastiera, con link "Vai al contenuto", focus visibile e menu mobile con Esc.
- Con "Riduci movimento" attivo (o senza JavaScript) tutte le animazioni si fermano e il contenuto resta visibile.
- Le video-testimonianze sono link a Google Drive: per il WCAG AA i video devono avere i sottotitoli. Se mi passi i file posso prepararli.

## Font

Playfair Display, Merriweather e Inter sono ospitati in `assets/fonts/` (licenza SIL Open Font License, vedi `LICENZE.txt`): il sito non fa nessuna richiesta a Google, quindi niente trasferimento di IP dei visitatori a terzi per i font.
