Hola. Seguimos con mis vídeos de TikTok para Alemania (canal «In dieser Stadt»). Respóndeme siempre en español, con una o dos palabras salvo que te pida más, y dame la traducción de todo lo que esté en alemán.

## Repo y arranque
- Repo `enzotiktok2212-lab/enzo-animar-claude`, rama **`claude/trusting-newton-0hk9y9`**. Antes de cada push: `git fetch` + `git rebase`. Haz commit y push de todo.
- Lee y sigue al pie de la letra `ENCARGO-NUEVO-CHAT.md` (sobre todo «Lecciones») y `CLAUDE.md`.
- Plantilla: **`pieces/teddy/`** (el último vídeo terminado; antes `pieces/goon/`). Copia sus scripts (`index.html`, `render.sh`, `render2.mjs`, `mids.mjs`, `sheet.py`, `cues.mjs`, `sfx.py`, `mezclar.sh`, `marca.py`, `finish.sh`, `cover.mjs`, `prep_audio.py`, `armar.py`) y su motor `src/`. Cambia la duración, el puerto (`render.sh`, `cues.mjs`, `cover.mjs`) y los nombres.
- Whisper small: `pip install faster-whisper`; el modelo sale de npm `@skillninja/shortmovie-telop-model-p0..p3` (se unen las partes de `model.bin` en `/home/user/whisper-small/model`). Script: `plugins/animate/skills/animate/tools/transcribir.py`.
- Los vídeos finales, el vídeo de referencia y las capturas de revisión **nunca** se suben al repo.
- El contenedor se reinicia si la sesión queda inactiva: lanza el render como tarea en segundo plano de la sesión (Bash con run_in_background) y deja una comprobación con send_later; `render.sh` es idempotente.

## Flujo
1. Te mando un vídeo viral de referencia (como archivo **MP4**, no MP3: los links de TikTok no funcionan aquí). Lo analizas **mirando sus fotogramas** (hoja de 1 imagen por segundo) (cortes, transcripción, escenas y por qué se hizo viral).
2. Guion en alemán con traducción. El gancho se traduce igual; el resto se parafrasea **y se cambian datos, números, comidas, lugares y nombres** para que no parezca una copia. Personajes y ciudad distintos al original.
3. Te mando la voz de ElevenLabs. Recortas silencios (`prep_audio.py ... .055`, dinámico pero sin atropellarse) y sincronizas cada palabra.
4. Escenas: las **mismas escenas que el original**, plano a plano, pero con otra ciudad, otros personajes y otro ángulo. Ciudad bonita, viva y detallada (casas y edificios llenando el fondo, nada de «monte» vacío, mucha gente). **Cada personaje hace una acción concreta** que ilustra la frase (nadie se queda parado), con gestos y caras que cambian. **Cada plano tiene movimiento de cámara** (acercar, alejar o lateral); cortes más rápidos cuando la historia lo pide. El gancho es dinámico desde el fotograma 0, muy ilustrativo, con zoom lento acercándose y lo principal centrado, **igual que el gancho del original** (mismo tipo de plano y mismo orden). No repitas al mismo personaje en dos planos seguidos del gancho.
5. **Revisas TODOS los planos (al 12 % y al 60 %) antes del render**: nadie de espaldas sin motivo, nadie tapado ni cortado, la cámara nunca dentro de objetos o paredes, lo principal centrado y por encima de los subtítulos (74 %), los carteles sin tapar caras, sin zonas quemadas ni demasiado brillantes (ojo con focos y luces pegadas a la cámara en los primeros planos).
6. Mezcla: música −24 LUFS, efectos que no tapan la voz, campanitas cada ~10 s. Render (unas 2 h para 2:15) y `finish.sh`. Dime cuánto va a durar el render y no me cuentes el progreso.
7. Cuando esté listo, mándame **solo el vídeo**. La descripción, el comentario fijado y las portadas los pido yo aparte.

## Portadas
- 1080×1920, el texto **centrado entre los personajes**.
- Todo lo importante dentro de la zona central 3:4 (y de 240 a 1680 px). Arriba y abajo solo cielo o suelo vacíos.

## Qué me paga más (RPM)
- **Unos $3 o más:** Schlafstadt, «10 Lügen», «10 Neins», Mauern (gigantes), superpoderes (3,61) y «1 € por hora de sueño». Todos son **fantasía con una regla mágica**, un niño débil o diferente que se vuelve héroe, un villano sobrenatural que roba algo y un final emotivo con la familia; duran 2:15–3:00.
- **$1,5–2:** terror o violencia (monstruos, sangre, matar), temas reales delicados (racismo), comedia absurda de dinero o normas sin héroe, memes y deporte (brainrots, Huss, Gänse). Casi todos mis vídeos son réplicas, así que la copia no es la causa: es el tema.
- Lo último hecho es «Teddy» (`pieces/teddy/`): colegio-trampa con director osito y juicio de clase (violencia insinuada). Antes «Goonen» (`pieces/goon/`).

## Ahora
Te voy a mandar varios vídeos virales recientes (MP4). Analízalos y puntúa cada uno según ese patrón de RPM y su potencial viral. Al final dime los **2 mejores para hacer**, con el porqué.
