# lispeln — estado para retomar (si la sesión se corta)

Rama: `claude/friendly-shannon-rx5ipy` (repo enzotiktok2212-lab/enzo-animar-claude). Plantilla: `pieces/schluck/`.
El usuario duerme: seguir solo, sin preguntar, hasta mandar el vídeo final (solo el MP4, `SendUserFile` attach). Calidad = vídeos recientes (schluck/frauenstadt): sombras, AO, luz realista, personajes detallados, acciones claras, todo centrado.

## Hecho
- Análisis (`analisis.md`), guion (`skript*.txt`), voz del usuario (`audio/voz-original.mp3`).
- Voz recortada `audio/voz-sin-silencios.wav` (94,87 s) y `audio/words.json` alineado con `align_nw.py` (no usar prep_audio para alinear: el ceceo rompe la alineación).
- Copiados scripts y motor de schluck; `src/lcast.js` (reparto) y `src/lsets.js` (escenarios nuevos).

## Pendiente (en orden)
1. `src/main.js` (montaje en el scratchpad: head.js + sets.js + partes genéricas de schluck/src/main.js) y planos en `src/p/a.js…d.js` (≈75 planos, lista en este archivo más abajo).
2. `python3 armar.py`; revisión `node mids.mjs http://pieza/index.html review all .12` y `review60 all .6`, `python3 sheet.py review`; corregir.
3. DUR = 95.9 en `render.sh`, `watchdog.sh`, `mezclar.sh` (D=), `sfx.py` (DUR =); campanitas en `marca.py` (0 s y ≤10 s al empezar frase).
4. Audio: `node cues.mjs` → `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` (ver cómo lo hizo schluck) → `marca.py` → `renders/mezcla-final.wav`.
5. Render: `nohup ./watchdog.sh > renders/watchdog.log 2>&1 &` (relanza solo y ejecuta finish.sh). Vídeo: `renders/lispeln.mp4`.
6. Commit + push (nunca renders/, review/). Mandar solo el vídeo.
