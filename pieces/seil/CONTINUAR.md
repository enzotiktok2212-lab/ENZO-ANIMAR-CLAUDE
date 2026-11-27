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
- [x] análisis, guion, voz (194,6 s; DUR = 195.4; 5862 fotogramas)
- [x] mundo y reparto (src/swwelt.js, src/swvolk.js)
- [x] planos a b c d (159) y revisión al 12 % y 60 %
- [x] mezcla: renders/mezcla-final.wav (−12,7 LUFS). Si el contenedor es nuevo, regenerarla:
  `python3 armar.py; node cues.mjs; python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav; python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-m.wav; ffmpeg -y -i renders/mezcla-m.wav -af "afade=t=out:st=194.4:d=1" renders/mezcla-final.wav`
- [x] render REPARTIDO (~1,7 s/fotograma con 4 procesos): aquí `./rango.sh 0 2000 4` (idempotente; relanzar si se corta);
  sesiones hijas: render-1 2000-3300 (session_017B1yBoZ3WA3LEGCzfajepd), render-2 3300-4600 (session_017B1yBnZRoUqb75BWbHyEMB), render-3 4600-5862 (session_017B1yBp9nJwzQw41oqLkoCy);
  suben `pieces/seil/partes-render/p*.mp4` a `claude/seil-render-N`. Al terminar: `git fetch origin claude/seil-render-N` y `git checkout origin/claude/seil-render-N -- pieces/seil/partes-render`
  (los tres), `./juntar.sh partes-render`, comprobar 5862 fotogramas (si falta un tramo: `./rango.sh A B 4` aquí), `./finish.sh` → renders/seil.mp4
- [x] (27-11, 04:45) entrega: SOLO el vídeo (SendUserFile, attach) + recordar escuchar la mezcla; desactivar la tarea programada trig_01Lg6NomcvKc33V2kdUy2TzW
