# neinhals — registro para retomar

- Voz: `audio/voz-original.mp3` → `audio/voz-sin-silencios.wav`, `audio/words.json` (174,8 s; DUR = 175.6). Hecho.
- Motor: copia de `schluck` (mismo motor e iluminación que `frauenstadt`/`schluck`); `src/main.js` adaptado; escenarios nuevos en `src/nwelt.js`, reparto en `src/nvolk.js`; cuellos con `hals()` de `src/hals.js`.
- Planos: `src/p/a.js` (0–58,9 s), `b.js` (58,9–94,7), `c.js` (94,7–147,5), `d.js` (147,5–175,6). `python3 armar.py` → `src/index.js`.
- Revisión: `node mids.mjs http://pieza/index.html review all .12` y `review60 all .6`; `python3 sheet.py`.
- Audio: `node cues.mjs` → `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` → `python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav`.
- Render: `./render.sh` (idempotente, en segundo plano) → `./finish.sh` → `renders/neinhals.mp4`. Entregar SOLO el vídeo (SendUserFile, attach).
- Encargo del usuario: primeros 5 s = 4 escenas (cortes cada ~1,2 s); todo centrado; en la 1.ª escena varias personas con cuellos de distintos largos y a una le crece el cuello de golpe, bien visible.

## Estado
- [x] voz y tiempos
- [x] motor, escenarios y reparto base
- [x] planos a–d escritos (revisión en curso)
- [x] revisión de todos los planos (12 % y 60 %)
- [x] mezcla (renders/mezcla-final.wav, −12,5 LUFS; rehacer si cambian los efectos)
- [ ] render (lanzado: ./render.sh en segundo plano; si se corta, relanzar ./render.sh y luego ./finish.sh)
- [ ] entrega
