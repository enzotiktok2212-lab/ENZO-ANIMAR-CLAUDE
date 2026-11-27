# codewort — nota para retomar (si la sesión se corta)
Rama `claude/wizardly-meitner-4vfi67`. Tarea programada horaria «Retomar vídeo codewort» (trig_01USJsx6D4FUfkbN4GH5hykX): desactivarla al entregar.
Encargo del usuario (26-11, noche): motor de statue/frauenstadt/schluck/dampf mejorado (más fluido, ambiente realista **copiado del original**:
pueblo de casas de madera con porche junto a un bosque de abetos, calle mojada con farolas, interiores cálidos); **4 cambios de escena en los primeros 5 s**;
en «In dieser Stadt» golpe de zoom rápido con una acción sorprendente; transiciones distintas con su efecto; efectos realistas; todo **centrado**;
en cada plano alguien haciendo una acción; revisar todo antes del render. Mandar SOLO el vídeo al terminar.
Voz: `audio/voz-original.mp3` → `audio/voz-sin-silencios.wav`, `audio/words.json` (224,9 s; DUR = 225.6).
Mundo: `src/cwelt.js` (Siedlung, casa por dentro, Kammer, Büro), reparto `src/cvolk.js`. Planos `src/p/a–d.js`; `python3 armar.py`.

## Estado
- [x] análisis, guion, voz recortada y tiempos
- [x] mundo y reparto
- [x] planos a (0–50) b (50–106) c (106–164) d (164–225.6)
- [x] revisión de todos los planos (50 % y 12 %)
- [x] mezcla (renders/mezcla-final.wav, −12,8 LUFS; regenerar: node cues.mjs → python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav → python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav)
- [x] render (terminado 08:30, repartido) (ss=1.25 sin AO (con AO iba a 14 fotogramas/min); `nohup ./watchdog.sh > renders/watchdog.log &` lo relanza y llama a finish.sh; / `rango.sh`) y `finish.sh` → renders/codewort.mp4
- [x] entrega (27-11, 08:30): solo el vídeo; tarea horaria desactivada

## Render repartido (27-11, 06:42)
- Aquí: `nohup ./rango.sh 0 1128 4 > renders/rango.log 2>&1 &` (idempotente; relanzar si se corta).
- Sesiones hijas (sonnet): 1128-2256 → rama claude/codewort-render-1 (session_01KrFL2CeUGdRYFJm5V2kepS), 2256-3384 → -2 (session_01KrFL2DqAjsjVtQDanhydmi), 3384-4512 → -3 (session_01KrFL2ABN3xCgTnCHRovDQo), 4512-5640 → -4 (session_01KrFL2Bws1oYkdD2RWfw5ik), 5640-6768 → -5 (session_01KrFL2DhrhRhUwAALHxqKqA). Suben `pieces/codewort/partes-render/p*.mp4`.
- Al terminar todo: para cada N `git fetch origin claude/codewort-render-N` y `git checkout FETCH_HEAD -- pieces/codewort/partes-render` (o git archive), `./juntar.sh partes-render`, comprobar 6768 fotogramas, `./finish.sh` → renders/codewort.mp4, mandar SOLO el vídeo, desactivar la tarea programada horaria.
