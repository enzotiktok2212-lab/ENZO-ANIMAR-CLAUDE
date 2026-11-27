# Motor (three.js) — API y recetas (según `pieces/goon/src/`)

## Archivos
| archivo | qué tiene |
|---|---|
| `engine.js` | `W=1080,H=1920,FPS=30`, `makeRenderer`, `makeComposer` (bloom, grade: `vig, flash, sat, sharp, lift, sepia, blurAmt, dir`), `character()` articulado (cadera, columna, cuello, hombros, codos, manos, rodillas), `applyPose(ch, {lean,twist,headX/Y/Z,aLx/aLz/aLe,aRx/aRz/aRe,lLx,lLk,lRx,lRk,hipY,crouch,sx})`, `box/cyl/sphere/textPlane/canvasTex/mat`, `outline`, `RNG, lerp, clamp, easeIn/Out/InOut, spring`, `walkPose/runPose/idlePose` |
| `vivo.js` | caras del kit (`loadKitFaces`, `kitFace(ch,'kid'|'hero'|'girl'|'plain'|'mustache'|'villain')`, `EYE`, `MOUTH`, `kitLips`), `GEST` (shock, cheer, point, shrug, cower, sneak, listen, facepalm, think, cross, hold…), `actuar(ch, lt, [[t, pose, {dur}]], {T, extra})`, `caminar(ch, lt, {x,z,ry,speed,run,accel,stopAt,T,extra})`, `saltar`, `shiver`, `aire`, `bandada`, `camaraEnMano` |
| `props.js` | `mk(scene, spec, acc)`, peinados `hairS`, accesorios (`glasses, mustache, cap, shades, headphones…`), `tree, lamp, bench, rathaus, fountain, skyscraper, building` |
| `gort.js` | **Hufenbach** (pueblo alemán de entramado: plaza, Rathaus con cúpula, cafés, fuente, carretera, casa familiar con ventana y cortinas, bloque), `townhouse(parent,x,z,wid,floors,ci,rot,{shop})`, `zimmer`, `baeckerei`, `treppe`, vehículos (`taxi, tractor, fireTruck`) |
| `gvolk.js` | reparto reutilizable (`makeKumpel(i)` ×8, `makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makeOma, makeMayor, makePapa, makeJonas…`) |
| `wsets.js / svsets.js / hsets.js / gsets.js` | escenarios de piezas anteriores (calle ORT, Bolzplatz, estadio, salón de fiestas, Knast, celda, Apotheke, Drogerie, sótano, puente y Bahnhof, `crowd()` instanciada, `polizei/fleet/polDrone/polDog`, `wurstWagen`, `boxPile`, `numSprite/numTex`) |
| `main.js` | escena, luces, `day/sunset/night/inside`, `hideAll`, `put/show/attach`, cámara, capa 2D, subtítulos, transiciones, `CUES` |
| `p/a.js…d.js` | los planos; `armar.py` los inserta en `//@@PLANOS@@` → `index.js` |
| `p/z_cover.js` | `window.renderCover(v)` para las portadas |

## Definir un plano
```js
// shot(t0, transición, zoom, fn, sfx)
// transición: 'Z' zoom, 'W' barrido, 'F' destello, 'S' deslizar, 'R' giro, 'I' iris, 'C' golpe; zoom: null | 'punch' | 'slow'
shot(12.01, 'F', null, L => { town();                       // L.lt tiempo local, L.k 0..1, L.T absoluto
  const c = put(pfeif, -6, 0, 10, .2); num(c, 0, 1);          // personaje + número encima
  actuar(c, L.lt, [[0, 'idle'], [.1, 'cheer', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  orb(L.k, V(-6, 3.4, 10), null, [14, .2, .1, 46], [12, .1, .1, 46]);   // órbita: [dist, yaw, pitch, fov] inicio→fin
  sh(V(-6, 0, 10), 30); }, [[0, 'flash', .4], [.2, 'sparkle', .5]]);
```
- **Encuadre**: `orbit(c, d, yaw, pitch, fov)` deja el centro al ~42 % de la altura (yaw 0 = cámara en +z). `onFace(ch, dist, dy, side, fov, k, dist2)` = frontal a la cara según su `ry`. `cm([px,py,pz,tx,ty,tz,fov],[…], k)` = interpolación libre. **Vertical estrecho: el sujeto casi en el eje de la cámara.**
- Personaje mirando a cámara: su `ry` debe apuntar hacia la cámara (`faceTo(pos, camPos)`).
- `talk(ch, T, a, b, expr)` mueve la boca con las palabras entre a y b. `grin`, `laughF`, `sweat`, `confetti`, `confRain`, `dust`, `fireworks`.
- 2D: `badge(kind,text,x,y,k,a,sc)` (`big/red/green/gold/num/tag`), `badge3(kind,text,pos3D,k)`, `bubble(ch,text,k)`. Pon los badges a `H*.15–.3` sin tapar caras.
- Zoom `'slow'` añade riser + braam automáticamente; `'punch'` = golpe de zoom.
- Multitudes grandes: `herd(make, n)` o `crowd(scene, n)` (InstancedMesh). Números sobre multitud: `crowdOn(T, mode, n)` con `NUMX`.
- Escenarios lejanos se colocan en X separadas (p. ej. `KX=700, ZLX=1000…`) y `use('KEY')` los muestra.

## Rendimiento
- Sin MSAA + SMAA, bloom a media resolución, sombras 2048, capturas JPEG 95, AO apagado en exteriores.
- ~36–40 fotogramas/min con 4 procesos.

## Herramientas
- `node mids.mjs http://localhost:<p>/index.html review all .12` y `review60 all .6` → `python3 sheet.py review` (hojas de 10).
- `node cues.mjs` → `audio/cues.json`, `audio/shots.json`.
- `python3 sfx.py …` (LIB de efectos sintetizados + alias; `fill_gaps` cada ≤1,1 s), `mezclar.sh`, `marca.py` (campanitas), `finish.sh`.
- `prep_audio.py voz raw skript out .055` (margen de silencio), `transcribir.py` (faster-whisper small local).
