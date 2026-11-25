# lispeln — estado para retomar (si la sesión se corta)

Rama: `claude/friendly-shannon-rx5ipy` (repo enzotiktok2212-lab/enzo-animar-claude). Plantilla: `pieces/schluck/`.
El usuario duerme: seguir solo, sin preguntar, hasta mandar el vídeo final (solo el MP4, `SendUserFile` attach). Calidad = vídeos recientes (schluck/frauenstadt): sombras, AO, luz realista, personajes detallados, acciones claras, todo centrado.

## Hecho
- Análisis (`analisis.md`), guion (`skript*.txt`), voz del usuario (`audio/voz-original.mp3`).
- Voz recortada `audio/voz-sin-silencios.wav` (94,87 s) y `audio/words.json` alineado con `align_nw.py` (no usar prep_audio para alinear: el ceceo rompe la alineación).
- Copiados scripts y motor de schluck; `src/lcast.js` (reparto) y `src/lsets.js` (escenarios nuevos).

## Pendiente (en orden)
- Hecho: planos (72) revisados al 12 % y 85 %, mezcla `renders/mezcla-final.wav` (−12,5 LUFS, campanitas, fundido) — NO está en git (renders/ ignorado): si se perdió, rehacer con `node cues.mjs`, `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav`, `python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav` y fundido de 1 s al final (afade st=94.9).
- Render lanzado con `nohup ./watchdog.sh > renders/watchdog.log 2>&1 &` (2877 fotogramas). Si el contenedor se reinició: `python3 armar.py`, rehacer la mezcla si falta y relanzar el vigilante. Al terminar ejecuta finish.sh → `renders/lispeln.mp4`.
- ✅ Terminado: renders/lispeln.mp4 (95,9 s, 1080×1920) enviado al usuario el 25-11-2026. Pendiente solo si lo pide: descripción, comentario fijado y portadas.
