# ebbe — registro para retomar (si se corta la sesión o se acaban los créditos)

Rama: `claude/chat-videos-in-dieser-stadt-lesp9e`. Lee primero la skill `.claude/skills/in-dieser-stadt/SKILL.md` y este archivo.
En un contenedor nuevo: `cd /home/user/ENZO-ANIMAR-CLAUDE && ./preparar-entorno.sh` y `cd pieces/ebbe && ln -sfn ../schutzengel/node_modules node_modules`.

## Encargo del usuario para este vídeo
- Ambiente MUY realista y detallado (como la referencia: luz de cine, nubes, agua con reflejos, arena con ondas, DOF); personajes detallados.
- Primeros 5 s: 4 cambios de escena. La escena fija «In dieser Stadt» con **zoom rápido + zoom lento después** (`zoom: 'hook'`) y una acción clara y relevante (el mar retirándose / gente bajando).
- Transiciones distintas en cada cambio, cada una con su efecto de sonido propio que se oiga bien (gain .8 en `TRS`).
- En 0 s: `audio/sonido-inicio.mp3` (sonido del usuario) por debajo de la voz, **en lugar de la campanita** en 0 s; las campanitas siguen en el resto (cada ~10 s).

## Hecho
- Voz: `audio/voz-original.mp3` → `prep_audio.py … .055` → `audio/voz-sin-silencios.wav` (143,25 s), `audio/words.json`. DUR = 144.1.
- Mundo `src/ebwelt.js` (cielo con nubes + reflejos, arena, acantilado, Möwensand, pecios, arrecifes, huesos, barco pirata, ola, salpicadura, lluvia, arcoíris, gaviotas, cuarto de Jonte, salón de Opa, Rathaus), reparto `src/ebvolk.js`, motor `src/main.js`.

- Planos (106) escritos y revisados (3 pasadas); mezcla hecha (`renders/mezcla-final.wav`, -12,5 LUFS; si el contenedor es nuevo, regenerarla con sfx.py + marca.py + fundido final 1 s).
- Render: `nohup ./watchdog.sh > renders/watchdog.log 2>&1 &` (idempotente; al acabar ejecuta finish.sh -> renders/ebbe.mp4). Luego mandar SOLO el vídeo.

## Render repartido (lanzado 27-11 06:46 UTC, ~6 fotogramas/min por sesión)
- Aquí: `./rango.sh 0 433 4` (log en renders/rango-local.log).
- 9 sesiones hijas renderizan 433-866, 866-1299, 1299-1732, 1732-2165, 2165-2598, 2598-3031, 3031-3464, 3464-3897, 3897-4323 y suben `pieces/ebbe/renders/partes/p*.mp4` a `claude/ebbe-render-1…9`.
- Al terminar: para N en 1..9: `git fetch origin claude/ebbe-render-N && git checkout origin/claude/ebbe-render-N -- pieces/ebbe/renders/partes` (o `git archive`); `./juntar.sh renders/partes`; comprobar 4323 fotogramas; `./finish.sh` → renders/ebbe.mp4; mandar SOLO el vídeo.

## Pendiente (en orden)
1. Prueba de look (`src/p/a.js` provisional) → ajustar luz y materiales.
2. Planos `src/p/a.js…d.js` (~120, corte ~1,2 s) → `python3 armar.py`.
3. Revisión de todos los planos: `node mids.mjs "http://pieza/index.html?ss=1" rv all .5` + `python3 sheet.py rv`.
4. Audio: `node cues.mjs` → alias en `sfx.py` → `python3 sfx.py …` → `marca.py` (sin campanita en 0; sonido-inicio en 0) → fundido.
5. Render repartido (`rango.sh`, `trozos.sh`, `juntar.sh`) o `watchdog.sh` → `finish.sh` → mandar SOLO el vídeo.
