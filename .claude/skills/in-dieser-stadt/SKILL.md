---
name: in-dieser-stadt
description: Produce a German TikTok storytime for the channel «In dieser Stadt» — 3D Roblox-style block characters, 9:16 1080×1920 30 fps, one-word yellow captions — from a viral reference video and the user's ElevenLabs voice. Covers analysis, German script with Spanish translation, ElevenLabs tags, silence trimming, word sync, shot-by-shot 3D build in the repo's three.js engine, full frame review, SFX/music mix, render, TikTok description and covers. Use for any request about these storytimes, a new viral reference, a script, a voice to sync, covers or RPM.
---

# «In dieser Stadt» — storytimes 3D en alemán

Esta skill recoge **todo lo aprendido en los ~50 vídeos** del canal (de `schlafstadt`, el primero, a `schutzengel` y `statue`, los últimos). Catálogo con temas, duraciones, RPM y lecciones de cada uno: [references/catalogo.md](references/catalogo.md). API del motor y recetas de código: [references/motor.md](references/motor.md). Checklist de revisión: [references/checklist.md](references/checklist.md).

Documentos del repo que siguen siendo la referencia detallada (léelos al empezar):
- `CLAUDE.md`, `ENCARGO-NUEVO-CHAT.md` (lecciones), `MENSAJE-NUEVO-CHAT.md`
- `plugins/animate/skills/animate/styles/blocky-3d/PRODUCCION.md` (encargo del usuario: **manda sobre lo demás**), `STYLE.md`, `REFERENCIA.md`, `PLAYBOOK-roblox-kit.md`

## 0. Reglas de trato con el usuario (fijas)
- Habla **en español**, respuestas de **una o dos palabras** salvo que pida más; usa la menor cantidad de texto posible. Traduce siempre al español todo lo que esté en alemán.
- **No cuentes el progreso del render.** Da una estimación de duración al lanzarlo (≈ 36–40 fotogramas/min con 4 procesos → 2:15 de vídeo ≈ 1 h 50 min).
- **Entrega (cambio del usuario, nov 2026)**: cuando el vídeo esté listo, manda **el vídeo junto con su portada y su descripción ya hechas** (SendUserFile, `display: attach`). Ten las portadas y la descripción preparadas mientras se renderiza.
- El usuario no oye lo que tú no puedes oír: recuérdale escuchar la mezcla.
- Cuando el usuario diga "ya puedes renderizar", **no hagas más revisiones**: lanza el render.
- Rama: **la rama de desarrollo que indique la sesión** (en el chat «videos in dieser Stadt»: `claude/chat-videos-in-dieser-stadt-lesp9e`) del repo `enzotiktok2212-lab/enzo-animar-claude`; ya contiene todo el trabajo de las ramas anteriores (`trusting-newton`, `friendly-newton`, `sleepy-volta`…). Antes de cada push: `git fetch` + `git rebase`. Commit y push de todo (el hook lo exige), **nunca** los vídeos finales (>100 MB), el vídeo de referencia, sus fotogramas ni las capturas de revisión (`review/`, `review60/` → `.gitignore`).

## 1. Flujo completo
1. **Referencia** (MP4 que manda el usuario; los links de TikTok no se pueden abrir aquí):
   - copia al scratchpad, `ffprobe`, transcripción con `plugins/animate/skills/animate/tools/transcribir.py ref.mp4 raw.json --lang de --txt t.txt`;
   - cortes con diferencia de fotogramas (`fps=15,scale=36:64,gray`, umbral 10–12) → nº de cortes y media por plano;
   - hojas de contacto (2 fps, 10×4) para ver **cada escena**;
   - `pieces/<nombre>/analisis.md`: estructura por tramos, **por qué se hizo viral** (la razón principal primero), palabras clave, causalidad/conectores, mini-ganchos.
2. **Guion** (`skript.txt` alemán + `skript_es.txt`):
   - **gancho** (~primeros 10 s) traducido tal cual; si el usuario lo pide, ofrece **5–6 variantes** del gancho con pros/contras y una recomendación;
   - el resto **parafraseado** y con **datos cambiados** (números, años, precios, comidas, lugares, horas, vehículos, nombres) para que no parezca copia; misma estructura y escenas;
   - frases cortas, conectores (denn, deshalb, aber, dann, als, während, plötzlich, jetzt), nada de relleno;
   - cada número del guion se verá en pantalla;
   - si hay onomatopeyas o gritos (p. ej. «HUSS!»), escribe el guion de ElevenLabs con **etiquetas solo en esas partes**: `[excited][shouting][very fast]` delante, y repite `[very fast]` cada dos repeticiones. Las etiquetas requieren **Eleven v3**.
   - Entrega el guion **en un bloque para copiar**.
   - **Llamada a la acción en los primeros ~20 s**, nunca al final, y nunca como orden («comenta», «marca a alguien»): una **mini pregunta al espectador que forme parte de la historia** y le dé un motivo para responder Mejor si pregunta por **otra persona que el espectador conozca** (es lo que más se comenta) y el narrador da su propia respuesta justo después, como modelo (`neinhals`: «Jeder kennt so jemanden, der zu allem Nein sagt… Wer ist das bei dir? — Bei mir? Ganz klar: meine Mama.»). Se puede añadir una **segunda, a mitad del vídeo, muy sutil**: una frase-pensamiento sin pregunta que el espectador quiera completar (`neinhals`: «Ich weiß sofort, wen ich als Erstes hier reinstelle.»).
   - **Marcas reales sí**, pero siempre **hablando bien de ellas** (le da valor comercial al vídeo), p. ej. «Wer will denn bitte keinen Porsche?».
   - Ejemplos en serie: **máximo tres**, de menos a más, coherentes entre sí, y que vuelvan más tarde en la historia (callback).
3. **Voz** (`audio/voz-original.mp3`; el contenedor se reinicia si la sesión queda inactiva: lanza los procesos largos con `run_in_background` y deja una comprobación con `send_later`; `render.sh` es idempotente):
   - si hay partes a acelerar, pásalas con `atempo` sin cambiar tono (`huss/acelerar_huss.py`) y manda **una prueba** antes de seguir;
   - transcribe (`raw_words.json`), recorta silencios con `prep_audio.py voz raw skript.txt audio .055` (margen 55 ms: dinámico sin atropellar);
   - revisa `words.json` (orden, palabras sin pareja, onomatopeyas por golpes de energía: `huss/huss_onsets.py`).
4. **Producción** (copia la plantilla, ver §3): planos en `src/p/a.js…d.js` sincronizados con `words.json`, `python3 armar.py` → `src/index.js`.
5. **Revisión de TODOS los planos** (§5) con `node mids.mjs URL review all .12` y `review60 all .6`, `python3 sheet.py`. Corrige y repite hasta que todo esté bien.
6. **Audio**: `node cues.mjs` → comprueba que todos los efectos existen en `sfx.LIB` (crea alias si faltan) → `python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav` → `python3 marca.py …` (campanitas) → fundido final 1 s.
7. **Render**: `./render.sh` (4 procesos, idempotente). Para correcciones, borra **solo** los fotogramas de esos planos y relanza (o `node render2.mjs URL renders/frames ini fin`). `./finish.sh` → `renders/<nombre>.mp4`.
8. **Entrega**: solo el MP4. Luego, si los pide: descripción (empieza por «In dieser Stadt…», sin spoiler, con traducción, hashtags `#indieserstadt #storytime #roblox #animation`), comentario fijado sin spoiler y **portadas**.

## 2. Imagen (reglas del usuario)
- 1080×1920, 30 fps. Plano medio **1,1–2 s**, con **cambio de entorno**; ráfagas más rápidas cuando la historia lo pide (cuentas, golpes, «HUSS»).
- **Lo que se ve ilustra literalmente lo que se dice.** Apóyate en el original: **las mismas escenas**, pero otra ciudad, otros personajes, otro ángulo y detallitos propios para que «parezca nuevo aunque ya lo hayas visto».
- **Gancho igual que el del original** (mismo tipo de plano y mismo orden); no repitas al mismo personaje en dos planos seguidos del gancho.
- **Gancho**: profundo, rápido y muy ilustrativo desde el fotograma 0 (golpe de zoom + swoosh); la regla absurda **ya visible**; lo principal **centrado** y con **zoom lento acercándose**; mucha gente, ciudad viva. El 2.º plano también lleno de vida.
- **Cada plano tiene movimiento de cámara** (acercar, alejar, lateral, grúa, travelling); zooms lentos (riser + viñeta + golpe) en revelaciones.
- **Cada personaje hace una acción concreta** que ilustra la frase (nadie parado), con caras que cambian con la emoción. Personajes distintos (ropa, pelo, piel, accesorio) y **distintos del original**.
- **Ciudad propia, bonita y detallada**: casas de entramado alemanas, edificios rellenando el fondo, **nunca "puro monte"**, gente con números/acciones, farolas, flores, toldos.
- Lo principal entre el **25 y el 62 %** de la altura; subtítulo al **74 %** (una palabra, `#E2FD07`, contorno negro, pop 20→112→100 %). Ningún cartel o pop-up tapa caras (sube los `badge` a `H*.3` si chocan).
- Todo el texto en pantalla en **alemán**; todo número dicho aparece en el mundo.

## 3. Plantilla y motor
- **Contenedor nuevo**: lanza primero `./preparar-entorno.sh` (faster-whisper + modelo small desde npm, `npm install` de la plantilla; comprueba ffmpeg y Playwright). Tarda ~1 min.
- **Motor gráfico (el mejor hasta hoy)**: el de `schluck` → `frauenstadt` → `schlafwandler` → **`schutzengel`** (base visual que el usuario prefiere: schluck/dampf/frauenstadt). three.js r170 con sombras suaves, AO, profundidad de campo (`BokehPass`), bloom, entorno PMREM `RoomEnvironment`, tono `neutral` (`?tm=agx|aces`), supermuestreo `?ss=1.5`, saturación 1,38 y nitidez en `grade`. Para revisar usa `?ss=1` (más rápido); el render final va con los valores por defecto.
- Copia **la última pieza terminada** (mira `git log` en `pieces/`; hoy **`pieces/schutzengel/`**, antes `statue`, `schlafwandler`, `kaffee`, `schluck`): `index.html, serve.mjs, render.sh, render2.mjs, rango.sh, trozos.sh, juntar.sh, watchdog.sh, mids.mjs, sheet.py, cues.mjs, sfx.py, mezclar.sh, marca.py, finish.sh, cover.mjs, prep_audio.py, armar.py, package.json`, `src/*.js`, `src/caras/`, `audio/{campanita-recortada.wav,musica.mp3,musica-fondo.wav}`, y `node_modules` (o `npm install`).
- Cambia: `DUR` en `src/main.js`, la duración en `render.sh`/`mezclar.sh`/`sfx.py` (`DUR =`), el **puerto** (`render.sh`, `cues.mjs`, `cover.mjs`, servidor `python3 -m http.server <puerto>`), el nombre en `finish.sh`, las horas de campanita en `marca.py` (0 s y cada ≤10 s al empezar frase).
- Escenarios y reparto nuevos van en archivos propios (`gsets.js`, `gcast.js`…). Detalles del API: [references/motor.md](references/motor.md).

## 4. Sonido
- Voz delante (−16 LUFS). Música `audio/musica-fondo.wav` en bucle **a −24 LUFS** (solo versión con música). Efectos −30 LUFS con banda de voz recortada y ducking: **nunca tapan la voz**. Risers/braam en pista de tensión (−27). Mezcla ≈ −12,5 LUFS.
- ≥1 efecto cada ~1,5 s (`fill_gaps`), variados y realistas; campanita en 0 s y cada ~10 s.

## 5. Revisión antes del render (obligatoria)
Mira cada hoja de 10 planos (al 12 % y al 60 %) y corrige: **nadie de espaldas sin motivo**, **nadie tapado** (por objetos, otros personajes, cajas, dinero, números, carteles), **nadie cortado**, **cámara nunca dentro de paredes, casas, coches o vehículos** (sale negro o un color plano), personajes no atravesándose, lo principal centrado y por encima del subtítulo, números legibles y sin solaparse, interiores no quemados a blanco ni zonas demasiado brillantes (ojo con focos o luces pegadas a la cámara en primeros planos). Detalle en [references/checklist.md](references/checklist.md).

## 6. Portadas (`src/p/z_cover.js` + `node cover.mjs`)
- 1080×1920, dos versiones. Sujeto principal **centrado**; el texto **centrado entre los personajes** (no separado arriba) y sin tapar caras ni números.
- **Todo lo importante dentro de la zona central 3:4 (y = 240 a 1680 px)**; arriba y abajo solo cielo o suelo vacíos (TikTok recorta). Nitidez 1.5, saturación 1.55, viñeta .6.

## 7. Qué paga más (RPM) — elegir temas
- **≈ $3 o más**: fantasía con **regla mágica + número** (`schlafstadt`, `zehn-neins`, `zehn-luegen`, `traumsammler`, `mauern`, `meins` 3,61 $), niño débil/diferente que se vuelve héroe, villano sobrenatural que roba algo, final emotivo con la familia, 2:15–3:00.
- **$1,5–2 o sin adicionales**: terror/violencia/sangre (monstruos, `dunkel`, `augen`, `tuer`, `spiegelbild`, `abschluss`), temas reales delicados (`haende`), comedia absurda de dinero/normas sin héroe (`bodensteuer`, `pech`, `diamant`, `stadtvideos`), memes/deporte (`tierwurf`, `huss`, `gaense`). Insinuación sexual (`gaense`, `goon`): muchas vistas, RPM esperado bajo.
- Casi todos los vídeos son réplicas: la copia no explica el RPM; **el tema sí**. Al elegir entre referencias, puntúa cada una con este patrón + potencial viral y recomienda **las 2 mejores** con el porqué.

## 8. Lecciones de `einpacken` (fijas)
- **Multitudes: solo personajes Roblox reales** (extras de `makeExtra` en `ecast.js`, con gorro y baile). Nunca la multitud instanciada de bloques simples (se ve pobre y atraviesa el suelo).
- **Onomatopeyas del original (HUSS)**: el usuario puede pedir usar las del vídeo de referencia. Se quitan del guion de ElevenLabs, se aísla la voz con Demucs (`npm i demucs`, `node node_modules/demucs/dist/cli.js`; segunda pasada solo sobre los trozos), se pone una puerta entre golpes y se insertan con `huss_insert.py` (mismo nivel que la voz, corte en el silencio tras la palabra, sin acelerar). Mandar una prueba de audio antes de seguir.
- Acelerar **solo** lo que pida el usuario (p. ej. el gancho a 1,1×).
- Encuadre vertical estrecho: dos personajes a ambos lados de un mostrador no caben en horizontal; desplázalos en x y pon la cámara de lado o alta. Nunca la cámara dentro de un personaje o de la campana de la cocina.
- Objetos de primer plano (cronómetros, relojes) por encima del subtítulo (súbelos sobre un paquete y apunta la cámara más abajo).

## 9. Lecciones de `adrian` (fijas)
- **Guion**: el gancho igual; el resto parafraseado pero **sin añadir hechos que no estén en el original** y sin cortar nada (más duración = mejor RPM, pero solo con lo que hay). Versión ElevenLabs v3 con **etiquetas de tono por frase** (`[mischievously]`, `[sad]`, `[whispers]`, `[shouting]`…).
- **Calidad**: supermuestreo `?ss=1.5` (por defecto en `main.js`), bordes gruesos (personajes 3, escenarios 2,2, atrezo 1,8), nitidez 1,6, bloom mínimo, adoquín fino; ~100 fotogramas/min con 4 procesos.
- **Encuadre**: nunca la cámara dentro de casas (las fachadas de `townhouse` tienen 20 de fondo), ni detrás de la cabeza, ni objetos (megáfono, foto, carteles) delante de la cara; personajes sentados con `sitY`; las clases necesitan pared del fondo.
- **Portadas**: escenario distinto al vídeo, otras tipografías y colores (`@fontsource/luckiest-guy`, `lilita-one`), pegatinas 2D, AO activado, círculo rojo intenso **ajustado solo al protagonista** (calculado con `proj`) y sin cruzarlo, personajes alrededor bien visibles señalando, nada tapando al protagonista; texto entre y = 240 y 1680.

## 10. Lecciones de `schluck` → `schutzengel` (fijas, las más recientes)
- **Ritmo**: corte cada **~1,2 s**; **4 escenas distintas en los primeros 5 s**, la 1.ª con golpe de zoom y una acción clara que explique la regla (bebé con dos ángeles opuestos, cuello que crece de golpe, dinero al beber).
- **Llamada a la acción como afirmación**, no como pregunta (en `schlafwandler` el usuario quitó «Wer ist das bei dir?»; en `schutzengel`, guion sin preguntas al espectador).
- **Cámara no demasiado cerca** y nada tapando la cara al beber o comer (taza, jarra, Kanne): gira al personaje `ry ≈ .7` o pon la cámara de lado; nada de cámara dentro de nubes de billetes; colores fuertes en objetos que se queman a blanco.
- Mundo y reparto nuevos en archivos propios por episodio (`engwelt.js`/`engvolk.js`, `kwelt.js`/`kvolk.js`, `swelt.js`/`svolk.js`); `resetProps()` para que el render sea determinista y `S.sort` por `t0`.
- **Render repartido** (≈6 s/fotograma con la calidad máxima en swiftshader; 2:40 ≈ 4.900 fotogramas): aquí `./rango.sh 0 N 4`; para ir más rápido crea **sesiones hijas** (`create_session`) que rendericen cada una un tramo con `./rango.sh A B 4`, lo codifiquen con `./trozos.sh A B` (CRF 12) y lo suban a ramas `claude/<pieza>-render-N`; luego `git checkout origin/claude/<pieza>-render-N -- pieces/<pieza>/partes-render`, `./juntar.sh partes-render`, comprobar el nº de fotogramas y `./finish.sh`.
- Render en una sola sesión: `nohup ./watchdog.sh > renders/watchdog.log 2>&1 &` (relanza `render.sh` si se cae o se atasca 8 min y al acabar ejecuta `finish.sh`), más un `send_later` para comprobarlo. Pon en `watchdog.sh` la `DUR` del vídeo.
- Deja siempre en la pieza un `LOG.md`/`CONTINUAR.md` con el estado y los comandos que faltan, por si el contenedor se reinicia o el chat cambia.
