# statue — nota para retomar (si la sesión se corta)
Pieza: `pieces/statue/` (rama `claude/sleepy-volta-4aciy2`). Voz recortada en `audio/voz-sin-silencios.wav`, `audio/words.json` (165,6 s).
Estado y pasos que faltan (hacer en orden, saltar los ya hechos):
1. Revisión de planos: `python3 armar.py`; capturas con 4 procesos `node mids.mjs "http://pieza/index.html?ss=1" rvN <lista> .6`; `python3 sheet.py rvN`; corregir encuadres en `src/p/a–d.js`.
2. Audio: `node cues.mjs` → `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` → `python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav`.
3. Render: `./render.sh` en segundo plano (idempotente: si se corta, relanzarlo continúa donde iba). Comprobar fotogramas en `renders/frames/` (4968 = ceil(165,6·30)).
4. `./finish.sh` → `renders/statue.mp4`; mandar SOLO el vídeo al usuario (SendUserFile, attach) y recordarle escuchar la mezcla.
