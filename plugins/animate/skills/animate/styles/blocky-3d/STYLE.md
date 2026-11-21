# blocky-3d — storytime de muñecos de bloques en 3D

Estilo medido de un video de referencia (análisis completo plano por plano en [REFERENCIA.md](REFERENCIA.md)). **Estado: especificación medida; el kit 3D todavía no está construido** (ver "Cómo se construye" al final).

Lo que es: un mundo 3D de juguete, brillante y limpio, con personajes de bloques (cabeza cúbica, torso, brazos y piernas rectangulares), cámara que **nunca está quieta**, cortes secos cada ~2 s, una voz en off en primera persona y **subtítulos de una palabra** en el centro. Cada número que dice el narrador aparece en el mundo como pop-up, pantalla o cartel.

**La regla de oro:** *cada 2 segundos, un plano nuevo desde otro punto de vista; dentro del plano, la cámara siempre se acerca.*

## 1. Imagen

### Render
- **3D real con perspectiva**, lente angular (FOV vertical ~55–70°), muy a menudo **cámara baja** (a la altura de la rodilla o del suelo) mirando un poco hacia arriba: hace que los personajes y edificios parezcan grandes.
- **Iluminación de día de juguete**: sol cálido arriba a un lado + mucha luz de cielo azul de relleno. Sombras suaves y cortas, nunca negras. Oclusión ambiental suave en las esquinas.
- **Bloom/resplandor** en todo lo emisivo: pop-ups, pantallas, neones, botón, monedas, el destello de la idea. Es la firma del look.
- **Niebla atmosférica azulada** en la lejanía (los rascacielos del fondo se aclaran hacia el cielo).
- **Profundidad de campo**: leve en primeros planos (el fondo se ablanda).
- **Superficies**: plásticas, satinadas, casi sin textura. Detalles por geometría (ventanas, toldos a rayas, bordes biselados) y no por textura. Algún material con textura sutil (madera del suelo, ladrillo, copa de árbol "grumosa").
- **Colores saturados y claros**, nada sucio, nada gris oscuro de día. La noche y la sala secreta son la excepción: azul marino + neón verde/cian.

### Paleta medida (hex)
| uso | color |
|---|---|
| cielo | `#439BFE` (degradado a `#BFE3FF` en el horizonte) |
| asfalto | `#264174` (azul marino, no gris) con línea central amarilla `#E8D23A` |
| fachadas | lila `#BBC9FD`, rosa `#F7C6DC`, menta `#C8F0E0`, blanco azulado `#E8F0FF`; ladrillo `#B5564A` |
| rascacielos de fondo | cian cristal `#7FD4FF` con franjas `#4FB8F5` |
| árboles | copa `#247E37`–`#4CB64A`, tronco `#6B4A2E` |
| piel de los personajes | `#FBD9C3` (también tonos `#8D5A3B`, `#C68B5E`) |
| chaqueta del héroe (ejemplo) | `#FF8A23` naranja, camiseta `#FFFFFF`, vaquero `#5D6BAD` |
| interior cocina | pared crema `#EBE2C7`, damero rojo `#F04A3C` / blanco `#F4F0F0` (a ojo) |
| dormitorio | pared a rayas cian `#5CC8E0`, suelo madera `#B07A45`, sábanas a rayas amarillo/azul |
| despacho del poder | morado `#5839A4`, oro `#E9C23A` |
| sala secreta / noche | fondo `#0E2230`–`#1B3A4A`, neón verde `#22E39A`, cian `#3FE8FF` |
| pop-up de cobro | píldora rosa `#FF5A85` con halo blanco, moneda `#FFFB56`→`#F5C400` |
| pop-up "gratis" | píldora verde `#2EE69A` con halo blanco |
| subtítulo | relleno **`#E2FD07`** (medido), contorno negro grueso |

### Personajes
- **Proporción de muñeco de bloques**: cabeza cúbica ≈ ancho de hombros × 0,55; torso 2 unidades de ancho × 2 de alto × 1 de fondo; brazos y piernas 1×2×1. Cabeza ≈ 1/4 de la altura total.
- **Cara plana dibujada** sobre el frente del cubo: dos ojos ovalados negros, cejas cortas, boca de una línea. Pecas opcionales. **Las expresiones cambian por corte** (feliz ^^, susto con ojos redondos y boca "o", ceño con cejas en V, preocupado con boca ondulada).
- **Accesorios grandes y legibles** definen a cada personaje: gafas de aviador, chistera, cadena de oro, gorra, pelo en bloque con pinchos. Cada personaje tiene **un color dominante** (el héroe naranja, el rico blanco, el alcalde morado).
- **Diseño propio**: los personajes de cada video se inventan para ese video (nombre, color, accesorio). No copiar los del video de referencia.

### Física y animación de personajes
- **Rígidos por piezas**: las extremidades rotan desde el hombro/cadera, sin doblarse. Caminar = balanceo de brazos y piernas opuestos ±30–35°, ~2 pasos/s, ligero bote del cuerpo.
- **Saludo**: un brazo arriba oscilando. **Susto**: brazos un poco abiertos, pequeño salto hacia atrás. **Pensar**: mano a la barbilla.
- **Idle**: nunca del todo quietos: respiración/balanceo leve de 1–2 px, giro suave de cabeza.
- **Vuelo**: cuerpo inclinado 20–30° hacia delante, piernas juntas, llamas azul-cian con bloom bajo los pies, estela.
- **Gags físicos**: caídas exageradas con rebote (cae al agua → salpicadura de esferas blancas; se estrella en un árbol → se queda encajado).
- **Vehículos absurdos** hechos de objetos cotidianos (silla de oficina que rueda, lavadora con hélice, zancos).

### Escenarios recurrentes
1. **Avenida principal** recta con perspectiva central y un edificio de poder al fondo (ayuntamiento con columnas y cúpula dorada). Toldos a rayas, farolas, árboles, hidrantes rojos, rascacielos de cristal detrás.
2. **Dormitorio** del héroe (cama con sábanas a rayas, estantería con libros de colores, ventana, alfombra a rayas).
3. **Cocina / interiores** con suelo damero.
4. **Taller** con póster del espacio y mesa de trabajo.
5. **Despacho del villano** (morado y oro, pantalla con gráfico).
6. **Plaza** con fuente frente al edificio de poder.
7. **Noche + guarida secreta** de neón con una máquina y un botón rojo gigante.

## 2. Cámara y montaje

### Ritmo de corte
- Plano medio **2,0 s** (rango útil 1,0–3,0 s). Solo el remate final y algún plano de acumulación pasan de 3 s.
- **Cortes secos** siempre. Nada de fundidos.
- **Corte en cada frase o media frase**; nunca dos planos seguidos con el mismo encuadre o altura de cámara.
- Un video de 2:25 tiene ~70 planos. Para un video de 60 s: ~30 planos.

### Movimiento dentro del plano (todos los planos se mueven)
| tipo | uso | medida |
|---|---|---|
| **push-in lento** | personajes, objetos, edificios (≈70 % de los planos) | +2 a +7 %/s, suavizado (ease-out). Arranca ya en movimiento |
| **track / dolly** | gente caminando, volando, coches | la cámara viaja con el sujeto o se retira delante de él |
| **tilt arriba** | zancos, despegues, rascacielos, "mira qué alto" | 30–70° en 1,5–2,5 s |
| **dron aéreo** | apertura y planos de escala | bajando y avanzando |
| **golpe de zoom** | reacción fuerte, remate | acercamiento a la cara en ~0,3 s, mantener, volver |
| **balanceo de mano** | a ras de suelo | ±1–2° de roll lento |

### Tipos de plano (variar en este orden aproximado)
gran plano aéreo → contrapicado a ras de suelo → plano entero frontal del personaje → plano medio/primer plano de reacción → **inserto** (teléfono, pantalla, cartel, objeto) → plano lateral en movimiento → picado 3/4 de interior.

## 3. Texto y gráficos en pantalla

### Subtítulos (siempre)
- **Una palabra a la vez**, sincronizada con la voz.
- Fuente redondeada muy gruesa en minúsculas (clase "Fredoka / Baloo / Lilita"; con fuentes del sistema: la redondeada más gruesa disponible), relleno `#E2FD07`, **contorno negro de ~12 % de la altura de la letra** y sombra suave.
- Posición: centro horizontal; vertical en el **tercio medio-bajo** (≈62–66 % de la altura) o, si la cara/acción está ahí, arriba (≈24 %). Altura de letra ≈ 3,5–4,5 % de la altura del cuadro; las **palabras clave** (cantidades, "ridiculously", "helicopter", "appeared") ≈ 1,4× más grandes.
- **Animación de entrada**: escala 20 % → 112 % → 100 % en 3 fotogramas (pop con rebote). Sin animación de salida: la siguiente palabra la reemplaza.

### Pop-ups de dinero (el elemento gráfico clave)
- Píldora rosa con **moneda amarilla** a la izquierda y texto blanco grueso "−$10"; halo blanco brillante (bloom); una flechita/triángulo abajo apuntando al personaje.
- Aparece **sobre la cabeza** o junto al cuerpo con escala 0 → 115 % → 100 % en ~4 fotogramas; se queda flotando y subiendo despacio; se desvanece.
- Debajo del personaje, **aro rosa brillante con partículas** en el suelo al cobrar.
- Variante positiva: píldora verde "FREE" y aro verde.

### Pantallas dentro del mundo
- **Teléfono** (UI simple: barra superior rosa con título, moneda, número grande, botón cian) en inserto con las manos de bloque del héroe.
- **Carteles/pantallas** rojo-rosa con amarillo "NEW RULE!", gráficos de líneas, contadores "$0". Texto en mayúscula gruesa, emisivo, con bloom.
- Todo número que dice el narrador se ve escrito en alguna superficie.

## 4. Sonido
- Voz en off en primera persona, rápida (~2,5–3 palabras/s), expresiva, con pausas mínimas.
- Música de fondo suave y continua (casual/lo-fi alegre), sin silencios; baja bajo la voz.
- SFX: ding/caja registradora por pop-up, whoosh en vuelos y cortes rápidos, "boing"/golpes en gags, brillo en la idea, alarma/zumbido en la sala secreta, campanita de notificación.
- Mezcla final ≈ **−19 a −16 LUFS**, rango dinámico corto (≈3–4 LU).

## 5. Fórmula de guion (ver bloques medidos en REFERENCIA.md)
1. **Gancho con regla absurda** ("En mi pueblo, ___ cuesta ___"). Primera frase en 1 s.
2. Presentación "Me llamo ___".
3. Cómo me afecta (mañana cotidiana, contador subiendo).
4. Cómo se adapta el pueblo (3 inventos absurdos + 1 contraste).
5. Mi invento (idea con destello → construcción → funciona).
6. Todos lo copian.
7. El poder contraataca con una regla nueva escrita en pantallas.
8. Caos (3 gags rápidos).
9. Pista: el poderoso no paga.
10. Investigación de noche → guarida secreta → máquina → botón.
11. Clímax: mira alrededor, nadie vigila, pulsa.
12. Celebración (confeti, héroe aclamado).
13. **Giro final**: a la mañana siguiente una notificación trae una regla nueva y peor; reacción con golpe de zoom y frase seca.

## 6. Checklist por fotograma (además de grammar/FRAME.md)
1. ¿La cámara se mueve en este plano? (Si no: push-in.)
2. ¿Es un punto de vista distinto al del plano anterior?
3. ¿El plano dura 1–3 s y corta con la frase?
4. ¿Hay **una** palabra de subtítulo amarilla con contorno negro y no tapa la cara?
5. ¿El dato/número que se dice está visible en el mundo?
6. ¿El personaje tiene expresión acorde a la frase?
7. ¿Hay bloom en lo emisivo y niebla en el fondo?
8. ¿Colores claros y saturados (o noche azul + neón si es la guarida)?
9. ¿El mundo está vivo (gente al fondo, coches, árboles, algo que se mueve)?
10. Sin marcas de agua, logos ni nombres de otros creadores o juegos.

## 7. Cómo se construye (plan del kit)
El resto de estilos son canvas 2D. Este necesita **WebGL**, y la skill exige un solo `index.html` sin librerías ni URLs, así que el kit será un **mini-motor 3D escrito a mano** (es viable porque todo el mundo son cajas):
- primitivas: caja con bisel redondeado, cilindro, esfera, plano; instancias para ventanas, árboles, gente;
- luz: sol direccional + hemisférica cielo/suelo, sombra con shadow map suave, AO aproximado en esquinas;
- post: bloom (umbral + desenfoque separable), niebla exponencial, viñeta leve, DOF opcional;
- personaje articulado de 6 piezas (cabeza, torso, 2 brazos, 2 piernas) con pivotes, caras como textura dibujada en un canvas 2D (expresiones), accesorios;
- cámara con funciones `push`, `track`, `tilt`, `drone`, `punch` (golpe de zoom) y `roll` de mano;
- capa 2D encima para subtítulos de una palabra y pop-ups (canvas 2D compuesto sobre el WebGL);
- `TIMELINE.gpu = true` para que `export.mjs` y `review.mjs` usen la GPU.

## No igualado todavía
- Calidad de render exacta (motor comercial con iluminación global): el kit la aproxima con hemisférica + AO + bloom.
- Voz: depende del conector de voz o de la grabación del usuario.
