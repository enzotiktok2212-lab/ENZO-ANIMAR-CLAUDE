# Estado de producción — keller (para reanudar)
El usuario está durmiendo: terminar el vídeo completo sin preguntar y mandarle SOLO el mp4 (SendUserFile, attach).
Al reanudar: leer este archivo, `git log`, y seguir el siguiente paso pendiente.

## Hecho
- Guion, voz (audio/voz-sin-silencios.wav, words.json, frases.txt), sets (src/ksets.js), reparto (src/kcast.js), gancho en src/p/a.js.

## Hecho también
- Gancho continuo, planos completos (a–d.js), revisión 12/50/60 %, mezcla renders/mezcla-final.wav (campanitas).

## Pendiente (en orden)
1. Gancho continuo SIN cortes (petición del usuario): ciudad → puerta de la casa de Thomas → pasillo → escalera → sótano bajo la casa → maqueta → vuelve a la ciudad (mismo espacio conectado).
2. Planos 15,35 s → 129,15 s (src/p/b.js, c.js, d.js) siguiendo el original.
3. Revisión al 12 % y 60 % (mids.mjs + sheet.py), corregir.
4. (render en marcha) Audio ya hecho: node cues.mjs → sfx.py → marca.py (campanitas 0 y cada ≤10 s) → render.sh (puerto 8795) → finish.sh → renders/keller.mp4
5. Mandar solo el vídeo. Commit + push (rama claude/trusting-newton-0hk9y9).

## TERMINADO
Vídeo renders/keller.mp4 enviado al usuario (129,15 s). No hay nada pendiente.
