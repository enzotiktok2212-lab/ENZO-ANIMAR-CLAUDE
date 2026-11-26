# schutzengel — registro para retomar

- Guion aprobado: `skript.txt` / `skript_es.txt` / `skript_elevenlabs.txt` (sin preguntas al espectador). Voz: `audio/voz-original.mp3` → `prep_audio.py … .055` → `audio/voz-sin-silencios.wav`, `audio/words.json` (161,6 s; DUR = 162.4).
- Encargo del usuario para este vídeo: corte cada ~1,2 s; 4 cambios de escena en los primeros 5 s; primer plano con golpe de zoom y acción clara que muestre de qué va (bebé al que le aparecen dos ángeles opuestos); todo centrado; transiciones y efectos distintos; movimientos de cámara que se noten; calidad como schluck/schlafwandler/dampf/frauenstadt o mejor, más fluidez y detalle.
- Motor: copia de `schlafwandler` (base schluck). Mundo nuevo `src/engwelt.js` (angelitos por tipo, alas grandes con plumas, aureola en llamas, Tod, Leben, rayos, sombra, plumas, brasas, selva, Säuglingsstation, escalera de Herr Vogel, Gründerfest, coches, pintada); reparto `src/engvolk.js`.
- Planos: `src/p/a.js` (0–31,9) hechos; `b.js` (31,9–70,3), `c.js` (70,3–118,8), `d.js` (118,8–162,4) pendientes. `python3 armar.py` → `src/index.js`.
- Revisión: `node mids.mjs "http://pieza/index.html?ss=1" rv all .5` y `python3 sheet.py rv`.
- Luego: `node cues.mjs` → alias de efectos que falten en `sfx.py` → `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` → `python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-marca.wav` → fundido final → `./render.sh` (segundo plano, idempotente) → `./finish.sh` → mandar SOLO el vídeo.

## Estado
- [x] análisis, guion, voz y tiempos
- [x] motor, mundo y reparto
- [x] planos a–d escritos (131) y revisados
- [x] mezcla (renders/mezcla-final.wav, −12,6 LUFS; regenerar con los comandos de arriba si el contenedor es nuevo: alias 'crack' ya en sfx.py, campanitas en marca.py)
- [x] render REPARTIDO (≈6 s/fotograma, 4872 fotogramas): aquí `./rango.sh 0 406 4` (idempotente; relanzar si se corta);
  11 sesiones hijas renderizan 406-812 … 4466-4872 y suben `partes-render/p*.mp4` a las ramas `claude/schutzengel-render-1…11`.
  Si una sesión falla (límite de uso), reenviarle el mensaje. Al terminar: `git fetch origin claude/schutzengel-render-N`, `git checkout origin/claude/schutzengel-render-N -- pieces/schutzengel/partes-render` (o `git archive`), `./juntar.sh partes-render`,
  comprobar 4872 fotogramas, regenerar la mezcla si falta (ver arriba) y `./finish.sh` → renders/schutzengel.mp4
- [x] entrega (26-11, 11:20): vídeo + portada (src/p/z_cover.js + node cover.mjs) + descripción de TikTok
- Entrega final: vídeo + portada + descripción de TikTok (lo pidió el usuario).
