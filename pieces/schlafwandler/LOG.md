# schlafwandler — registro para retomar

- Voz: `audio/voz-original.mp3` → se quitó «Wer ist das bei dir?» (29,40–30,75 s; el usuario prefiere la llamada a la acción como afirmación) → `audio/voz-editada.wav` → `prep_audio.py … .08` → `audio/voz-sin-silencios.wav`, `audio/words.json` (222,0 s; DUR = 222.8).
- Motor: copia de `schluck` (base visual preferida: schluck/dampf/frauenstadt). Escenarios propios en `src/swelt.js` (Mondtal de noche con puertas que se abren, Mondstollen, cuartos de Ben y Lena, dormitorio, cocina, consulta); reparto en `src/svolk.js` (pijamas, guantes, ampollas, faroles, palas, ojos rojos, tierra en los pies).
- Planos: `src/p/a.js` (0–47,15), `b.js` (47,15–97,95), `c.js` (97,95–146,41), `d.js` (146,41–222,8). Corte cada ~1,2 s; 4 escenas en los primeros 5 s. `python3 armar.py` → `src/index.js`.
- Encuadre vertical estrecho: los dos personajes de una conversación casi en el eje de la cámara; cenitales por debajo del techo (cocina: y < 16); las filas de `march()` se extienden detrás de la cabeza (z0 = primera fila).
- Revisión: `node mids.mjs "http://pieza/index.html?ss=1" review all .55`; `python3 sheet.py review`.
- Audio: `node cues.mjs` → `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` → `python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav`.
- Render: `./render.sh` (idempotente, en segundo plano) → `./finish.sh` → `renders/schlafwandler.mp4`. Entregar SOLO el vídeo.

## Estado
- [x] análisis, guion, voz y tiempos
- [x] motor, escenarios y reparto
- [x] planos a–d escritos
- [x] revisión de todos los planos
- [x] mezcla (renders/mezcla-final.wav, −12,8 LUFS)
- [ ] render (lanzado; ./render.sh es idempotente, luego ./finish.sh)

## 2026-11-25
- Render completo (6684 fotogramas, 2 tandas por límite de 2 h) y finish.sh → renders/schlafwandler.mp4 (222,8 s). Entregado.
