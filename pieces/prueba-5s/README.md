# prueba-5s — los 3 primeros planos del formato blocky-3d

Recrea 0–5,1 s del video de referencia (ver `styles/blocky-3d/REFERENCIA.md`, planos 1–3) con personajes y textos propios:
dron sobre la avenida (1,1 s) → acera a ras de suelo, el vecino paga "−$10" en cada paso (2,6 s) → push-in al ayuntamiento (1,4 s).

- `index.html` + `main.js`: escena three.js (r169) hecha solo con código; `window.renderAt(t)` dibuja el instante t (determinista).
- `render.mjs`: renderiza fotograma a fotograma con Playwright (reloj virtual, 30 fps).
- `score.py`: música y efectos sintetizados (sin voz).

```bash
npm i                                   # three@0.169.0 y la fuente Fredoka
python3 -m http.server 8765 &
node render.mjs http://127.0.0.1:8765/index.html frames
python3 score.py score.wav
ffmpeg -framerate 30 -i frames/f%04d.png -i score.wav -af loudnorm=I=-17:TP=-1.5:LRA=4 -c:v libx264 -crf 16 -pix_fmt yuv420p -c:a aac -shortest renders/prueba-5s.mp4
```
