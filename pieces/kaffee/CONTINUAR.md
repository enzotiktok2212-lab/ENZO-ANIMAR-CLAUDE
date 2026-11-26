# kaffee — cómo continuar (traspaso entre chats)

Rama: `claude/eager-goldberg-osa0qm` del repo `enzotiktok2212-lab/enzo-animar-claude`. Carpeta: `pieces/kaffee/`.
Antes de nada, lee la skill `.claude/skills/in-dieser-stadt/SKILL.md` (reglas del canal) y este archivo.

## Qué es
Vídeo «In dieser Stadt macht dich Kaffee reich» (réplica muy reescrita del formato `dampf`, vape, 500 mil vistas).
Guion final aprobado: `skript.txt` (alemán), `skript_es.txt` (español), `skript_elevenlabs.txt`. Voz del usuario: `audio/voz-original.mp3`.
Base visual pedida por el usuario: **`dampf`, `frauenstadt` y `schluck`** (motor, luz, sombras, ambiente). Plantilla de código: `pieces/schluck/`.
Reglas extra del usuario para este vídeo: cambio de escena cada ~1,2 s; 4 escenas en los primeros 5 s (una con «In dieser Stadt» y acción clara: dinero al beber);
todos los personajes con acciones visibles; todo centrado y dentro de la pantalla; ambiente nuevo y más detallado.

## Hecho
- Audio: `audio/raw_words.json` (faster-whisper), `audio/words.json`, `audio/voz-sin-silencios.wav` (194,5 s), `audio/cues.json`.
  Mezcla: `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` →
  `python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-marca.wav` →
  `ffmpeg -y -i renders/mezcla-marca.wav -af "afade=t=out:st=193.5:d=1" renders/mezcla-final.wav` (≈ −12,7 LUFS). `renders/` no se sube: hay que regenerarla.
  Todos los efectos existen (alias añadidos al final de `sfx.py`, bloque «KAFFEE: alias»).
- Mundo nuevo: `src/kaffee.js` (tazas, Kanne, Kaffeezähler de muñeca, HUD, lata de Oma, paquetes Tchibo/Jacobs/Melitta, corona, Brötchen, crucero…),
  `src/kwelt.js` (Röstheim: Altstadt de entramado en otoño con cafés y terrazas, fuente-cafetera, tranvía; Café Bohne, tienda Tchibo, salón de Jacky y el de París,
  iglesia, sótano de Oma, cocina de Oma con tele, plató RTV 24, el mar con el MS ESPRESSO), `src/kvolk.js` (Noah/ich, Oma Gerda, Jacky, Dr. Brenner, Pfarrer, Rentner, Jugendliche…).
- `src/main.js` (motor de schluck adaptado; `S.sort` por t0; `resetProps()` para render determinista) y **163 planos** en `src/p/a.js … f.js` (media 1,19 s). `python3 armar.py` → `src/index.js`.

## Revisión en curso (al 60 %, planos 1–30 vistos): problemas a corregir
Problema general: **la cámara queda demasiado cerca** y **la taza tapa la cara** al beber de frente. Arreglos:
- Plano 1 (fila delante de la fuente): girar a los vecinos `ry ≈ .7` (como en schluck) para que la taza no tape la cara; cámara más lejos y algo más alta.
- Plano 2 (vecina en la terraza): cámara dentro de la nube de billetes y demasiado cerca: `dcam` más lejos (14) y yaw ≈ −.6; menos billetes delante.
- Plano 4 (abuelo en el banco): más lejos; Plano 4b (`f.js`, 4.35, móvil): **el móvil se ve de espaldas** → no adjuntarlo a la mano: `show(PHONE, …)` mirando a cámara.
- Plano 5 (espresso): quemado a blanco → taza de color (roja), cámara algo más lejos, menos DOF.
- Plano 7 (Kanne): la Kanne tapa la cara → Kanne a escala .6 y cámara de lado (yaw −1.2).
- Plano 8 (+800 €): billetes y gente delante de la cara → `FACES.push(ch)` también en `prost`, cámara más lejos.
- Plano 9 (20 tazas): la pirámide queda entre cámara y señora → ponerla al lado, más atrás, y abrir el plano.
- Plano 11 (villa, «Einen Tag lang…»): billete enorme delante; Plano 12 bien; Plano 13 («Heute würde ich…» en la cama): **la cámara no ve al personaje** (solo la manta/cama): revisar posición de la cama de `zimmerF` (cama en (-7, 0, -4)) y la cámara.
- Plano 14 (zoom a mi cara en la cama): igual, no se ve la cara.
- Planos 16–17 (Oma): bien de encuadre pero muy cerca; 17: la Kanne de flores tapa la mitad de la cara → moverla a la izquierda.
- Plano 20/22 (pizarra de la LEYENDA): **la cafetera de cobre de la fuente tapa la pizarra** → poner la pizarra en otro sitio (p. ej. (0, 0, 30) mirando a −z, o junto al Maibaum/catedral) o la cámara por debajo de la cafetera.
- Plano 21 (pirámide de 50): cámara demasiado cerca del toldo; Plano 23–24: el fortachón tapado por su propio brazo/taza; abrir el plano.
Pendiente: ver los planos 31–163 (`review60/sheet3.jpg` …) y los del 12 % (`review/`).

## Cómo revisar
```
cd pieces/kaffee && npm install && python3 armar.py
node mids.mjs http://pieza/index.html review all .12 & node mids.mjs http://pieza/index.html review60 all .6 &
python3 sheet.py review60     # hojas de 10 planos en review60/sheetN.jpg
```
(`review/`, `review60/` y `renders/` están en `.gitignore`.) Un plano suelto: `node mids.mjs http://pieza/index.html rv 5,6,7 .6`.

## Después de la revisión
`./render.sh` (4 procesos, idempotente; ~5 s por fotograma y proceso → 5835 fotogramas ≈ 2 h) o `nohup ./watchdog.sh > renders/watchdog.log 2>&1 &`,
regenerar la mezcla (arriba) y `./finish.sh` → `renders/kaffee.mp4`. Mandar **solo el vídeo** al usuario y recordarle escuchar la mezcla.
Luego, si los pide: descripción de TikTok, comentario fijado y portadas (`src/p/z_cover.js` + `node cover.mjs`).

## Estado (25-11, tarde): TERMINADO
Revisión completa de los 163 planos, render repartido en 12 sesiones (`rango.sh`, `trozos.sh`, `juntar.sh`; ramas temporales `claude/epic-bell-yeiyfh-render-1…11`, se pueden borrar), `renders/kaffee.mp4` (194,5 s) entregado con portadas (`src/p/z_cover.js`) y descripción (`tiktok.txt`).
