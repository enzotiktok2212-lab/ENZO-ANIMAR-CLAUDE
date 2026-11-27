# seil — nota para retomar (si la sesión se corta)
Rama `claude/amazing-cray-iw6mx2`. Tarea programada horaria «Retomar vídeo seil» (trig_01Lg6NomcvKc33V2kdUy2TzW): **desactivarla al entregar**.
Reglas: skill `.claude/skills/in-dieser-stadt/SKILL.md` (§10 = lo último). Respuestas muy cortas en español; no contar el progreso; al terminar mandar SOLO el vídeo.
Guion: `skript.txt` (alemán, sin preguntas al espectador), `skript_es.txt`, `skript_elevenlabs.txt`. Análisis: `analisis.md` (referencia sin audio; texto por OCR).
Voz: `audio/voz-original.mp3` → transcribir.py → `audio/raw_words.json` → `prep_audio.py … .055` → `audio/voz-sin-silencios.wav`, `audio/words.json`.
Plantilla: copia de `pieces/schutzengel/` (motor HQ). Mundo nuevo `src/swwelt.js` (pradera plana, cuerda de ropa, pueblos bajos, Rufer con trompetilla, torre de personas con manivela), reparto `src/swvolk.js`.
Planos `src/p/a–d.js`; `python3 armar.py` → `src/index.js`. Servidor: `node serve.mjs` o `python3 -m http.server 8790` en la pieza.
Revisión: `node mids.mjs "http://localhost:8790/index.html?ss=1" rv all .5` + `python3 sheet.py rv`.
Audio: `node cues.mjs` → alias que falten en `sfx.py` → `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` → `python3 marca.py …` → fundido final.
Render repartido (ver skill §10): `./rango.sh A B 4` + sesiones hijas (`claude/seil-render-N`) → `./juntar.sh partes-render` → `./finish.sh` → renders/seil.mp4.

## Estado
- [x] análisis, guion
- [x] voz recortada y tiempos (194,6 s; DUR = 195.4; 998/999 corregidos a mano en words.json)
- [x] mundo y reparto (src/swwelt.js, src/swvolk.js)
- [ ] planos a b c d
- [ ] revisión de todos los planos
- [ ] mezcla
- [ ] render y finish.sh
- [ ] entrega (solo el vídeo) y desactivar la tarea programada
