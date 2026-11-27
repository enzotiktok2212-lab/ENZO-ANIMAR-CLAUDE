# dickkopf — nota para retomar (si la sesión se corta)
Rama `claude/epic-maxwell-w3hhv5`. Tres tareas programadas «Retomar dickkopf (A/B/C)» = comprobación cada 1 h 20: **desactivarlas al entregar**.
El usuario duerme: **no preguntar nada**; hacerlo todo y mandar SOLO el vídeo (SendUserFile, attach) y recordarle escuchar la mezcla.
Encargo: «In dieser Stadt wird dein Kopf mit jedem HUSS größer» (réplica de la referencia en inglés, 62 s). Movimiento de cámara en TODOS los planos,
corte cada ~1,1 s (ráfagas en los HUSS), cada personaje con una acción, todo centrado, revisar todos los planos antes del render.
Voz: `audio/voz-original.mp3` → `audio/voz-sin-silencios.wav`, `audio/words.json` (94,06 s; DUR = 94.6). HUSS en 2,09 · 3,26 · 3,68 · 4,00 · 35,21 · 88,07 s.
Motor: plantilla de `codewort`/`statue` (`src/main.js`, Hufenbach de `gort.js`). Reparto `src/dvolk.js`, atrezo `src/dwelt.js`. Planos `src/p/a.js` (0–30), `b.js` (30–60), `c.js` (60–94,6); `python3 armar.py`.
`codewort` quedó a medias (voz lista, falta mundo y planos): retomarlo después de entregar dickkopf.

## Estado
- [x] análisis, guion, voz recortada y tiempos
- [x] reparto y atrezo
- [x] planos a, b, c (73 planos)
- [x] revisión de todos los planos
- [x] mezcla: renders/mezcla-final.wav (−12,6 LUFS). Si falta (contenedor nuevo): node cues.mjs; python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav; python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav
- [ ] render EN MARCHA desde 03:3x UTC en calidad máxima (ss 1.5 + AO; 2838 fotogramas, ~2–3 h). Relanzar si se para: `nohup setsid ./watchdog.sh > renders/watchdog.log 2>&1 < /dev/null &` y `finish.sh` → renders/dickkopf.mp4
- [ ] entrega (solo el vídeo) y desactivar las tareas programadas
