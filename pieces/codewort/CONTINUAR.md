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
- [ ] mundo y reparto
- [ ] planos a (0–50) b (50–106) c (106–164) d (164–225.6)
- [ ] revisión de todos los planos
- [ ] mezcla
- [ ] render (`watchdog.sh` / `rango.sh`) y `finish.sh` → renders/codewort.mp4
- [ ] entrega (solo el vídeo)
