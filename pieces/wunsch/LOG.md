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
1. Revisión: HECHA (3 pasadas).
2. Audio: HECHO (renders/mezcla-final.wav, -12,5 LUFS; si el contenedor es nuevo, regenerarla con sfx.py + marca.py + fundido 1 s).
3. Render: `setsid nohup ./watchdog.sh >> renders/watchdog.log 2>&1 < /dev/null & disown` (si `pgrep -f watchdog.sh` no da nada y faltan fotogramas, relanzarlo) (idempotente, al acabar ejecuta finish.sh → renders/wunsch.mp4).
4. Portadas (`src/p/z_cover.js` + `node cover.mjs`) y descripción (`descripcion.md`).
5. Entregar vídeo + portada + descripción (SendUserFile) y desactivar la tarea programada.
- Render lanzado 28-11 03:21 UTC con watchdog (≈4 s/fotograma, ~6 h).
- 28-11 07:36 UTC: la sesión se reinició y el render se paró en 248/5280; relanzado (≈3,4 s/fotograma → listo ≈ 12:30 UTC).
- Portadas hechas: `renders/portada-2.png` (la buena) y `portada-1.png`. Descripción en `descripcion.md`. Entregar: renders/wunsch.mp4 + portada-2.png + descripción.
