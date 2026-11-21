# Prompt de producción — blocky-3d (versión detallada)

Este es el encargo estándar para cada video de este proyecto. Se aplica entero salvo que el usuario diga otra cosa. Completa a `STYLE.md` (medidas del look) y `REFERENCIA.md` (análisis del video de referencia). **Donde este documento y STYLE.md se contradicen, manda este** (es lo que pidió el usuario después de ver la primera prueba).

---

## 0. Entradas
- **Narración ya grabada** (un MP3/WAV de ElevenLabs u otro) + **el texto exacto** del guion.
- Idioma: el de la narración. **Todo el texto en pantalla (subtítulos, carteles, pantallas, pop-ups) va en ese idioma.**

## 1. Audio de la voz
1. **Recortar todos los silencios**: cada pausa de la voz se reduce a ~70 ms (40 ms de margen a cada lado de cada frase, fundidos de 8 ms para que no haga clic). Ni una pausa larga en todo el video.
2. **Tiempo de cada palabra**: con faster-whisper si está disponible; si no, alinear el texto exacto con los tramos de voz (programación dinámica por sílabas, cortes en la puntuación). Guardar `words.json` (`[inicio, fin, palabra, tramo]`).
3. Todo lo demás (cortes, subtítulos, efectos, gestos) se sincroniza con esos tiempos.

## 2. Ritmo y montaje
- **Cambio de plano cada ~2 s** (rango 1,2–2,6 s) y **cambio de entorno** con él: cada plano nuevo enseña otro lugar u otro punto de vista claramente distinto. Nunca dos planos seguidos con el mismo encuadre.
- **Lo que se ilustra es lo que se dice en ese momento**: cada plano dibuja literalmente la frase que suena (si dice "50 euros", se ve el cobro de 50 €; si dice "tiró el reloj a la basura", se ve el reloj volando al cubo).
- **Transiciones entre planos, variadas**, cada una con su efecto de sonido. Repertorio (no repetir la misma dos veces seguidas):
  | transición | duración | sonido |
  |---|---|---|
  | barrido rápido (whip pan) con desenfoque de movimiento | 6 fotogramas | whoosh corto |
  | zoom a través (el plano entra acercándose desde el anterior) | 6 | swoosh ascendente |
  | destello blanco | 4 | flash / clic de cámara |
  | deslizamiento lateral (empuja la imagen) | 6 | swipe |
  | giro (roll 90° + desenfoque) | 8 | remolino |
  | iris / círculo que se cierra en el sujeto | 8 | pop grave |
  | corte seco con golpe de zoom | 0 | impacto / thump |
- **Zooms de velocidades distintas**, acercamientos y alejamientos, cada uno con su sonido:
  | tipo | velocidad | sonido | imagen |
  |---|---|---|---|
  | **lento (tensión)** | +15–35 % de escala en 1,5–3 s, ease-in (va acelerando) | **riser** (sonido de tensión que sube) durante todo el zoom y **golpe dramático** (impacto grave/"braam") justo al terminar | **viñeta** que se cierra mientras dura (de 0,3 a ~0,75) y se abre con el golpe |
  | medio | +8–15 % en ~1 s | whoosh suave | — |
  | rápido / golpe de zoom | +25–60 % en 0,15–0,3 s | impacto / thump / "boom" | sacudida de 2–3 fotogramas |
  | alejamiento rápido | −30 % en 0,3 s | swoosh invertido | — |
  Usar los lentos en los momentos de revelación o tensión (unos 6–10 por video), no en todos los planos.
- **Cámara nunca quieta**: push-in lento (+2–7 %/s) por defecto; track, tilt, dron, golpe de zoom, balanceo de mano según el plano.

## 3. Imagen (más detalle que la referencia)
- Mundo 3D de juguete con personajes de bloques, **muy saturado** (grading: saturación ×1,2, viñeta suave), bloom en todo lo que brilla, niebla de profundidad, sombras suaves.
- **Todo modelado con detalle**: ropa con cuellos, bolsillos, cremalleras, botones, cordones, puños y suelas; peinados con mechones; accesorios con piezas (gafas con montura, lupa con lente, bigotes, gorros); edificios con contraventanas, alféizares con flores, tejados de teja, chimeneas, buhardillas, toldos a rayas, farolas con jaula de cristal; interiores con estanterías llenas, carteles, máquinas con manómetro, vajilla.
- **Fondos variados y llenos**: cada entorno tiene profundidad (primer término, sujeto, fondo) y vida (gente al fondo, luces, humo, vapor, pájaros, coches).
- **Composición: lo principal va en el centro** (entre el 25 % y el 62 % de la altura). Los subtítulos van más abajo (≈74 % de la altura) y **nunca tapan al personaje ni la acción**. Lo secundario puede ir fuera del centro.

## 4. Personajes
- Diseñados a partir de la descripción del guion (edad, oficio, rasgo que importa a la historia), con colores dominantes distintos entre sí y un accesorio que los identifica. Se mantienen idénticos en todo el video.
- **Esqueleto articulado**: cadera, columna, cuello, hombros, **codos**, muñecas, caderas, **rodillas**. Nada se mueve como una pieza rígida entera cuando debería doblarse.
- **Movimientos reales y físicas**: andar con contrapeso de brazos y bote de cadera; correr inclinado; saltar con anticipación (agacharse), impulso, vuelo con gravedad y aterrizaje con amortiguación; objetos lanzados en parábola con rotación y rebote; telas y pelo con un pequeño retardo (seguimiento); impactos con aplastar-estirar.
- **Gestos coherentes con la emoción** y **cara que la muestra**: cejas, párpados, mirada, boca (sonrisa, mueca, ceño, bostezo, grito, ojos cerrados), rubor, sudor, venas de enfado. La expresión cambia en el momento exacto de la palabra que la provoca.
- Cuando tocan algo, la mano llega al objeto (contacto real), lo agarra y el objeto se mueve con la mano.

## 5. Entradas de animación
Objetos que aparecen en escena entran animados (no de golpe): escalado con muelle (0 → 115 % → 100 %), caída con rebote, deslizamiento desde fuera, giro, "pop" con partículas. Carteles, precios, pop-ups, relojes, tazas, iconos.

## 6. Sonido
- **Voz** (recortada) encima de todo.
- **Música de fondo**: la pista que mande el usuario, a **velocidad original**, durante todo el video; si es más corta, **vuelve a empezar** al terminar (empalme de 60 ms) y **se corta al final del video** con un fundido de 1 s. Nivel: **música −24 LUFS** (voz −16 LUFS, ducking suave ratio 1.5), unos 14 dB por debajo de la voz. Historia: primero −29, el usuario la pidió más alta (−19) y después más baja (−24) cuando TikTok silenció el audio del video. **Entregar solo la versión con música** (el usuario no quiere dos versiones). Si no hay pista, se compone una en código.
- **Efectos realistas para cada acción** (dinero → monedas/caja registradora; botón → clic; pasos sobre adoquín; taza → porcelana; reloj → tic-tac, campanadas; puerta, bostezo, golpe, salto, caída, multitud, gallo, cuco…).
- **Los efectos nunca tapan la narración** (regla del usuario): pista de efectos a −30 LUFS, recorte de −6 dB en la banda de la voz (900 y 2400 Hz) y ducking (ratio 4) mientras habla; medido, incluso en su momento más fuerte quedan **≥14 dB por debajo de la voz**. La mezcla se hace con `pieces/<pieza>/mezclar.sh` y se comprueba midiendo voz/música/efectos por separado.
- **Al menos un efecto cada 1,5 s** de media, **variados** (nunca el mismo efecto tres veces seguidas; variar tono y velocidad cuando se repite).
- Cada transición y cada zoom con su efecto.
- Mezcla final ≈ −13 LUFS integrados, pico ≤ −0,7 dBFS, la voz siempre delante.

## 7. Subtítulos y texto
- Una palabra a la vez, sincronizada con la voz; relleno `#E2FD07`, contorno negro, sombra; pop 20 % → 112 % → 100 % en 3 fotogramas; palabras clave (números, nombres, golpes) 1,35× más grandes.
- Posición: centrados, ≈74 % de la altura.
- Todo número que se dice aparece en el mundo (pop-up, cartel, pantalla, pizarra), en el idioma del video.

## 8. Comprobación antes de entregar
- Cortes medidos: media 1,6–2,2 s, ninguno > 2,8 s, cada uno con transición + efecto.
- Densidad de efectos: ≥ 1 cada 1,5 s.
- Sujeto principal centrado y sin subtítulo encima en cada plano (hoja de contactos).
- Texto en el idioma correcto en todos los carteles.
- Sonoridad medida.

## 9. Risers en los momentos clave (regla del usuario)
- El **gancho** siempre lleva riser desde el primer segundo hasta el golpe dramático; también cada revelación o frase decisiva.
- Riser + golpe dramático (braam) + zoom lento + viñeta que se cierra, sincronizados: el golpe cae justo en la palabra/corte de la revelación.
- Mezcla: risers y golpes van en una **pista de tensión separada** a −27 LUFS con ducking suave (ratio 1.5) y −3 dB en 1,5 kHz: se oyen enteros, de principio a fin, sin hacer ininteligible la narración. El resto de efectos sigue a −30 LUFS con ducking fuerte.

## 10. Encargo ampliado (Bodensteuer, noviembre 2026)
- **Render a 1080×1920 nativo** (motor con `W = 1080, H = 1920`), 30 fps. Los textos 2D se escalan con `U = W / 720`.
- **En cada plano siempre hay personajes haciendo una acción**, también en los insertos (teléfono, pantalla, placa, máquina): alguien sostiene, mira, señala, toca o reacciona en el mismo encuadre.
- **Cada personaje con aspecto distinto**: color de ropa, prenda (chaqueta, sudadera, traje), peinado (pinchos, flequillo, rizos, moño, coleta, largo, calvo), color de pelo, tono de piel y accesorio (gafas, gorra, auriculares, chistera, cadena). Nunca dos extras iguales en el mismo plano.
- **Más detalle que la referencia** en todo: ropa con cremallera, cuello, bolsillos, botones y solapas; accesorios con piezas; fachadas con alféizares con flores, contraventanas, toldos con flecos, rótulos de tienda en el idioma del video; interiores llenos (estanterías, pósters, lámparas, vajilla, herramientas).
- **Cambio de entorno cada ~2 s** (no solo de encuadre): calle, interior, cielo, despacho, sala secreta... alternando día/noche cuando la historia lo pide.
- **Teléfonos y pantallas**: el teléfono se sostiene delante del pecho con la cara del personaje visible encima; nunca tapa la cara ni queda debajo del subtítulo.
- **Pop-ups pegados al mundo**: se proyectan después de colocar la cámara, encima de la cabeza del personaje que paga, con el aro brillante en el suelo.
- **Transcripción**: si no hay faster-whisper con modelo, el modelo Whisper small (CTranslate2) está publicado en npm como `@skillninja/shortmovie-telop-model-p0…p3` (se concatenan las 4 partes de `model.bin`).

## 11. Encargo ampliado (Meins, noviembre 2026)
- **Arranque**: el primer fotograma ya es un golpe de zoom rápido con un "ding".
- **Sin neblina y con color**: niebla mínima (densidad ≤ 0,001), saturación ×1,45, interiores con luz moderada (hemisférica ≈ 1, puntos ≈ 240) para que nada se queme a blanco.
- **Velocidad de render**: sin AO en exteriores (y donde no aporta), sombras 2048, capturas JPEG calidad 95. Script `resume` idempotente + comprobación programada cada 20 min para reanudar si el contenedor se reinicia.
- **Bocadillos de cómic** con la palabra que dice un personaje (en el idioma del video), anclados encima de su cabeza.
