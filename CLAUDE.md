# Proyecto: videos storytime de muñecos de bloques en 3D

Este proyecto se usa **solo** para hacer un tipo de video: storytimes verticales (9:16) en primera persona, en un mundo 3D de juguete con personajes de bloques, cortes cada ~2 s, cámara siempre en movimiento, subtítulos de una palabra amarilla y pop-ups de dinero.

**Canal «In dieser Stadt» (alemán)**: usa primero la skill `in-dieser-stadt` (`.claude/skills/in-dieser-stadt/SKILL.md`); en ritmo (~1,2 s por plano), motor (`pieces/schutzengel/`) y trato con el usuario manda sobre lo de abajo. En un contenedor nuevo: `./preparar-entorno.sh`.

Antes de planificar o animar cualquier video:
1. Lee `plugins/animate/skills/animate/styles/blocky-3d/PRODUCCION.md` (el encargo detallado del usuario: **manda sobre lo demás**), `STYLE.md` (el estilo, con medidas) y `REFERENCIA.md` (el análisis plano por plano y la fórmula de guion en 13 bloques).
2. Usa la skill `animate` (`plugins/animate/skills/animate/SKILL.md`) con `"style": "blocky-3d"`.
3. El idioma de trabajo con el usuario es el español.

Reglas fijas de este formato:
- Narración del usuario: recortar todos los silencios (pausas → ~70 ms) y sincronizar todo con el tiempo de cada palabra.
- Plano medio ~2 s **con cambio de entorno**, lo que se ve ilustra literalmente lo que se dice, nunca dos encuadres iguales seguidos, nunca cámara quieta.
- **Transiciones variadas entre planos** (barrido, zoom, destello, deslizamiento, giro, iris, golpe de zoom), cada una con su efecto de sonido; zooms con su efecto.
- Efectos de sonido realistas y variados para cada acción, **≥1 cada 1,5 s**.
- Zooms de velocidades distintas. **Zoom lento = riser de tensión + viñeta que se cierra + golpe dramático al final**; golpes de zoom rápidos con impacto.
- **Risers + golpe dramático en los momentos clave** (el gancho siempre, revelaciones, frases importantes), con zoom lento y viñeta. Van en una **pista de tensión aparte** (−27 LUFS, ducking suave ratio 1.5): se oyen claros de principio a fin sin tapar la narración.
- Música de fondo del usuario a velocidad original, en bucle si hace falta, cortada al final del video, a **−24 LUFS** (≈14 dB por debajo de la voz; el usuario la bajó después de que TikTok silenciara un video). Entregar **solo la versión con música** (el usuario no quiere dos versiones).
- **Los efectos de sonido nunca tapan la narración**: −30 LUFS, banda de voz recortada y ducking; ≥14 dB por debajo de la voz incluso en su pico. Mezclar con `mezclar.sh`.
- Personajes articulados (codos, rodillas, cuello) con físicas y gestos reales; la emoción se ve en la cara.
- Mucho detalle en ropa, caras, objetos y fondos; saturación alta.
- **Lo principal en el centro** (25–62 % de la altura); subtítulo a ~74 % sin tapar a nadie.
- Subtítulo: una palabra a la vez, `#E2FD07` con contorno negro, pop 20 %→112 %→100 % en 3 fotogramas. **Todo el texto en pantalla en el idioma de la narración.**
- Cada número dicho aparece en el mundo (pop-up, teléfono, cartel).
- Guion: regla absurda → me afecta → el pueblo se adapta → mi invento → el poder contraataca → caos → pista → guarida secreta → botón → celebración → giro final peor.
- Personajes y nombres inventados para cada video; sin logos, marcas de agua ni nombres de otros creadores o juegos.
- El video de referencia y sus fotogramas nunca se suben al repo.

## Encargo fijo del usuario (27-11-2026) para todos los vídeos siguientes
Motor de los vídeos de mejor calidad (cerveza `schluck`, vape `dampf`, `frauenstadt`, `statue` → plantilla `schutzengel`) y mejorarlo un poco cada vez: más sombra, luz y ambiente, cielo y ambiente mucho más realistas, casas y todo más detallado, ambientes variados, físicas añadidas poco a poco. Cambio de escena cada 1,2–1,3 s; 4 cambios en los primeros 5 s; la 1.ª escena en la ciudad con zoom rápido y una acción concreta que explique el vídeo; todo centrado; transición distinta en cada corte con su sonido; revisar siempre que no haya errores. Detalle en la skill `in-dieser-stadt` §0b.
