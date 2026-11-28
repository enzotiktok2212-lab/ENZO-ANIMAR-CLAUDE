# wunsch — registro para retomar (si se corta la sesión o se acaban los créditos)

Rama: `claude/serene-fermat-wv1k1e` (repo enzo-animar-claude). Skill: `.claude/skills/in-dieser-stadt/SKILL.md`.
Contenedor nuevo: `cd /home/user/ENZO-ANIMAR-CLAUDE && ./preparar-entorno.sh && cd pieces/wunsch && ln -sfn ../schutzengel/node_modules node_modules`.
Hay una tarea programada cada hora («Retomar vídeo wunsch») que lee este archivo y sigue.

## Encargo del usuario
- Guion: regla de los deseos (no el tiempo). Emma/Ben/Lea en los primeros 20 s + pregunta «Und du? Was würdest du dir wünschen?».
- 4 escenas en los primeros 5 s; la 1.ª («In dieser Stadt») centrada: dos personas durmiendo en diagonal, se levantan de golpe, una antes, y celebra.
- Acciones claras en cada plano, muchos efectos realistas, mejor calidad y ambiente. Render en ESTA sesión (no repartir en otros chats).
- Entrega: vídeo + portada + descripción juntos.

## Hecho
- Voz `audio/voz-original.mp3` → `audio/voz-sin-silencios.wav` (175,2 s), `audio/words.json`. DUR = 176.0 (5280 fotogramas).
- Código: `src/main_top.js` (propio) + `src/main_rest.js` (común) → `python3 mk_main.py` → `src/main.js`; planos `src/p/a–d.js` → `python3 armar.py` → `src/index.js`.
- Mundo `src/wwelt.js`, reparto `src/wvolk.js`. 116 planos escritos.

## Pendiente (en orden)
1. Revisión: `node mids.mjs "http://pieza/index.html?ss=1" <dir> all .12` y `.6` + `python3 sheet.py <dir>`; corregir.
2. Audio: `node cues.mjs` → alias que falten en `sfx.py` → `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` → `python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-marca.wav` → fundido 1 s → `renders/mezcla-final.wav`.
3. Render: `nohup ./watchdog.sh > renders/watchdog.log 2>&1 &` (idempotente, al acabar ejecuta finish.sh → renders/wunsch.mp4).
4. Portadas (`src/p/z_cover.js` + `node cover.mjs`) y descripción (`descripcion.md`).
5. Entregar vídeo + portada + descripción (SendUserFile) y desactivar la tarea programada.
