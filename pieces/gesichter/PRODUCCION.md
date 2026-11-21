# Gesichter — encargo de producción detallado

Este documento es el *prompt* completo del vídeo. Se aplica entero. Donde contradiga a `blocky-3d/PRODUCCION.md`, manda este.

## 0. Entradas
- **Voz:** `audio/voz-original.mp3` (ElevenLabs, alemán, 172,0 s).
  - **Recortada:** `audio/voz-sin-silencios.wav`, **153,1 s**. Cada pausa queda en ~80 ms, con 40 ms de margen y fundidos de 8 ms.
  - **Tiempos de cada palabra:** `audio/words.json` (Whisper alineado con `skript.txt`; 520 palabras).
- **Campanita:** el sonido que mande el usuario. Suena **en el fotograma 0 (0 ms)** y luego **cada ~10 s**, siempre al empezar una frase importante (tabla del §6).
- **Música de fondo:** la pista del usuario, si la manda.
- **Referencia:** el storytime de terror de bloques (2:43, unas 130 escenas). Análisis en `analisis.md`. **No se sube al repo.**

## 1. Formato e imagen
- **Formato:** 1080×1920 nativo, 30 fps, 153,1 s (4.594 fotogramas).
- **Estilo:** mundo 3D de juguete con personajes de bloques tipo Roblox, **más detallado que la referencia** en todo:
  - **Ropa:** cuellos, costuras, botones, tirantes, cordones, parches, estampados (cuadros, rayas, punto de lana).
  - **Caras:** cejas, iris, brillos, pecas, rubor, lágrimas, sudor.
  - **Objetos:** con piezas (la radio con dial, LED y antena; el cortacésped con ruedas y bolsa; la jaula con radios y candado).
  - **Edificios:** entramado, contraventanas, jardineras con flores, toldos a rayas, letreros en alemán.
- **Etalonaje:**
  - saturación ×1,45;
  - **nitidez +55 %** (filtro de enfoque en el shader);
  - **viñeta 0,42** (se cierra hasta ~0,75 en los zooms lentos);
  - bloom en lo que brilla (velas, faroles, luna, LED de la radio);
  - niebla mínima (≤ 0,001).
- **Composición:**
  - **Lo principal siempre en el centro**, entre el 25 % y el 62 % de la altura.
  - El subtítulo va a ~74 % de la altura y **nunca tapa a un personaje ni la acción**.
  - Lo secundario puede ir fuera del centro.
- **Texto en pantalla:** todo en alemán (BÄCKEREI, SEIT 2004, FESTHALLE, KUNST, MAUER, STADT, 13…). Cada número que se dice aparece en el mundo:
  - 20 Jahre → letrero "SEIT 2004" y pop-up "20 JAHRE";
  - 13 → tarta con "13" y pop-up;
  - 2 Jahre → pop-up;
  - 100 Jahre → pop-up sobre la muralla.

## 2. Ritmo y montaje
- **Un plano cada ~1,9 s** (rango 1,2–2,6 s; ninguno pasa de 2,8 s). Son **unos 80 planos**.
- **Con cada plano cambia el entorno o el punto de vista de forma clara.** Nunca hay dos encuadres iguales seguidos.
- **Lo que se ve ilustra literalmente lo que se dice en ese instante.**
- **En cada plano hay siempre al menos un personaje haciendo algo**, también en los planos de objetos: alguien sostiene la radio, empuja el cortacésped, cuelga la cara, señala o reacciona.
- **Cámara siempre en movimiento, como si alguien grabara:** acercamiento lento (+2–7 % por segundo), travelling lateral, subida o bajada, dron o leve balanceo de mano. Los cambios de perspectiva son lentos dentro del plano.
- **Gancho casi igual que la referencia, pero con un golpe de zoom rápido en el fotograma 0 + campanita.**
  - **Plano 1:** el narrador camina hacia cámara por la calle empedrada con vecinos que sonríen todos igual.
  - **Plano 2:** la multitud camina en grupo.
  - **Plano 3:** el pueblo visto desde arriba.
  - **Plano 4:** un cartel de "VERMISST" (desaparecido) en una farola.
- **Transiciones entre planos, variadas y cada una con su efecto** (no se repite la misma dos veces seguidas):
  | transición | duración | sonido |
  |---|---|---|
  | barrido rápido con desenfoque | 6 fotogramas | whoosh corto |
  | zoom a través | 6 | swoosh ascendente |
  | destello blanco | 4 | flash / clic |
  | deslizamiento lateral | 6 | swipe |
  | giro (90° + desenfoque) | 8 | remolino |
  | iris que se cierra en el sujeto | 8 | pop grave |
  | corte seco con golpe de zoom | 0 | impacto |
- **Zooms de velocidades distintas, cada uno con su sonido:**
  - **Lento (tensión):** +15–35 % en 1,5–3 s. Lleva riser, viñeta que se cierra y golpe dramático al terminar. Unos 8 en el vídeo, en las revelaciones.
  - **Medio:** +8–15 % en ~1 s, con whoosh suave.
  - **Golpe rápido:** +25–60 % en 0,2 s, con impacto y una sacudida de 2–3 fotogramas.
  - **Alejamiento rápido:** −30 % en 0,3 s, con swoosh invertido.
- **Entradas animadas** de objetos y carteles: escalado con muelle (0 → 115 % → 100 %), caída con rebote, deslizamiento o "pop" con partículas. Se usan para la radio, el letrero, el pan, la tarta, la jaula, las caras en los ganchos y el pop-up de los números.

## 3. Personajes (diseño propio, distinto del original)
| personaje | aspecto | accesorio que lo identifica |
|---|---|---|
| **Narrador** (12, sin nombre) | rizos castaño oscuro, piel morena clara, pecas, sudadera verde bosque con capucha y **parche de zorro**, vaqueros remangados, zapatillas rojas | **mochila marrón con la antena de la radio** |
| **Lenny** | flequillo negro recto, **gafas redondas**, camiseta de rugby azul marino a rayas blancas, **tirantes rojos**, pantalón caqui | **lápiz detrás de la oreja**; sonrisa demasiado perfecta (pista) |
| **Mama** | **trenza rubia larga**, pañuelo rojo, chaleco de lana gris sobre camisa de cuadros verdes | **cascos de radio con micrófono**; está en la Funkhütte junto a la Mauer |
| **Papa** | barba pelirroja, **gorro de lana mostaza**, abrigo de leñador a cuadros rojos y negros con remiendos | ojeras; viene de lejos |
| **El falso Papa** | la misma cara, pero con ropa demasiado limpia (cuadros rojos y blancos, pantalón azul, gorro amarillo) | sonrisa fija; saluda demasiado rato |
| **Herr Brandt** | calvo, bigote blanco enorme, camisa amarilla pálida, tirantes verdes, pantalón corto tirolés | cortacésped rojo sobre tierra pelada |
| **Panadero** | piel oscura, gorro alto blanco, delantal enharinado, bigote negro | barra de pan |
| **Cazadores** | capa gris con capucha, cuerda al cinto | farol encendido |
| **Vecinos** | 10 variantes: ropa, color, peinado, piel y accesorio distintos (gorra, gafas, corbata); nunca dos iguales en un plano | **todos con la misma sonrisa copiada** |
| **Sin cara** | cabeza negra, brillante y mojada, sin ojos, con una boca enorme de dientes que se abre y cierra | — |

**Movimiento:**
- Esqueleto articulado: cuello, hombros, **codos**, muñecas, caderas y **rodillas**.
- Andar con contrapeso y bote; correr inclinado.
- Agacharse, saltar y aterrizar con amortiguación.
- Telas y pelo con un poco de retardo.
- **Cuando tocan algo, la mano llega al objeto y el objeto se mueve con la mano.**

**Cara:** cambia en el momento exacto de la palabra (miedo, tristeza, lágrimas, sonrisa forzada, sorpresa, enfado). Lip-sync con las palabras en los diálogos.

**Acciones predeterminadas (biblioteca):**
- andar, correr, quedarse de pie rígido;
- hablar por radio (mano en el dial y radio a la cara);
- empujar el cortacésped;
- vender o enseñar el pan;
- reír todos a la vez y cortar en seco;
- de pie mirando a la pared;
- llorar (hombros que tiemblan, lágrimas);
- tirar agua (parábola de gotas);
- descolgar o colgar la cara;
- escupir;
- saludar con la mano en bucle;
- agarrar la mano y tirar;
- abrazar;
- apretar el hombro;
- arrancarse la cara.

## 4. Escenarios (cambian casi en cada plano)
- **Calle empedrada** de casas de entramado con faroles y montañas nevadas al fondo.
- **Vorstadt**, con el jardín pelado de Herr Brandt.
- **Bäckerei** "SEIT 2004", con un pretzel colgado.
- **Festhalle** por fuera y por dentro: parqué, mesas largas con velas, lámparas de araña, cortina roja y la **pared de ganchos con las caras colgadas**.
- **Mauer** en las montañas: piedra gris azulada, puerta de hierro remachada de dos hojas, torres con tejado cónico azul y la Funkhütte al lado. *(Distinta de la referencia, donde era un muro oscuro remachado.)*
- **Funkhütte de Mama** por dentro: radio de válvulas con pantalla verde, mapa de la Mauer, estufa y foto del narrador.
- **Dachboden:** vigas, ventana redonda con luna, mesa con la radio y una vela.
- **Wohnzimmer a oscuras:** luz azul de luna, sofá, cuadros, gente mirando a la pared.
- **Kunstraum:** pizarra "KUNST — Thema: Meine Familie", tarros de agua de colores, caballetes.
- **Calle nevada** con la jaula sobre un carro.
- **Wasserturm:** chapa oxidada, escalera, rayos de luz por las rendijas, un clavo.
- **Negro total** (final).
- **Colores por actos:**
  - día cálido;
  - noche azul;
  - interior dorado (Festhalle);
  - nieve gris;
  - naranja oxidado (Wasserturm);
  - negro.

## 5. Sonido
- **Voz** recortada, delante de todo (−16 LUFS).
- **Campanita** (sonido de firma): en 0 ms y cada ~10 s (§6), unos 3 dB por debajo de la voz.
- **Efectos realistas en cada acción y al menos uno cada 1,5 s de media, variados.** Nunca se repite el mismo tres veces seguidas; si se repite, cambia el tono o la velocidad.
  - **Ejemplos:** pasos en adoquín y en nieve, cortacésped, campanilla de la puerta de la panadería, risas sincronizadas que se cortan, ruido de radio con estática, puerta de hierro que se cierra, gotas de agua, salpicadura, jaula con ruedas, escupitajo, viento, abucheo, multitud corriendo, eco metálico en el depósito, latido del corazón, clic al descolgar la cara, golpe grave.
- **Cada transición y cada zoom llevan su efecto.**
- **Risers y golpes dramáticos** en una pista de tensión aparte (−27 LUFS), en el gancho y en las revelaciones (§6).
- **Los efectos nunca tapan la voz:** van a −30 LUFS, con la banda de la voz recortada y ducking; siempre ≥14 dB por debajo de la voz.
- **Música:** −24 LUFS. Se entrega solo la versión con música.
- **Mezcla final:** ≈ −13 LUFS, pico ≤ −0,7 dBFS.

## 6. Campanita, risers y momentos clave
- **Campanita** (al empezar estas frases): 0,00 · 9,51 · 20,09 · 30,79 · 40,63 · 49,93 · 60,01 · 70,23 · 80,06 · 89,56 · 99,73 · 109,12 · 119,09 · 128,76 · 138,98 · 147,83 s.
- **Riser + zoom lento + viñeta + golpe dramático:**
  | segundo | momento |
  |---|---|
  | 0–3,6 | gancho |
  | 3,8–7,0 | "gefressen" |
  | 38,99–43,3 | las dos reglas |
  | 60,0–64,9 | las caras en los ganchos y "nur Maul" |
  | 72,66–73,7 | Papa en la jaula |
  | 82,24–83,0 | "mit Papas Gesicht" |
  | 97,40–99,4 | "Nichts… mein Gesicht" |
  | 133,48–136,2 | Lenny se quita la cara |
  | 147,83–152,9 | "meine eigene Stimme" |

## 7. Tabla de planos (tiempos sobre la voz recortada)
Transiciones: **W** barrido · **Z** zoom a través · **F** destello · **S** deslizamiento · **R** giro · **I** iris · **C** corte con golpe de zoom.

| # | t (s) | se dice | entorno y encuadre | acción | cámara | → |
|---|---|---|---|---|---|---|
| 1 | 0,00–1,98 | In dieser Stadt bin ich der einzige Mensch. | calle empedrada de día, plano medio frontal | el narrador camina hacia cámara entre vecinos | **golpe de zoom en el fotograma 0** + retroceso con él | W |
| 2 | 1,98–3,70 | Alle anderen sehen nur so aus. | la misma calle, contrapicado de la multitud | 6 vecinos caminan al paso y sonríen igual | travelling lateral | Z |
| 3 | 3,70–5,40 | Denn jedes Gesicht hier gehörte mal jemandem, | farola con el cartel "VERMISST" con una cara | una vecina pasa por delante y lo tapa | acercamiento lento al cartel (riser) | C |
| 4 | 5,40–7,10 | den sie gefressen haben. | primer plano de un vecino | su sonrisa se ensancha demasiado | **zoom lento + golpe** | F |
| 5 | 7,10–9,51 | Die letzten Menschen leben hinter der Mauer in den Bergen. | gran plano de la Mauer con montañas nevadas | centinelas con farol caminan arriba | dron que avanza | S |
| 6 | 9,51–10,80 | Und ich bin ihr Spion. | el narrador, pequeño, delante de la puerta de hierro | mira hacia arriba y se ajusta la mochila | grúa que sube | R |
| 7 | 10,80–13,30 | Weil ich klein bin. Und die Kleinen kontrolliert keiner. | calle: dos cazadores pasan a su lado | lo miran de reojo y siguen; él traga saliva | travelling a su altura | W |
| 8 | 13,30–15,00 | Jede Nacht funke ich Mama an, | Dachboden de noche, plano medio | gira el dial y el LED se enciende; la vela parpadea | acercamiento lento | I |
| 9 | 15,00–16,30 | sobald die Jäger losziehen. | ventana redonda: abajo los cazadores salen con faroles | el narrador espía tras la ventana | subjetiva desde atrás | Z |
| 10 | 16,30–18,20 | So schließt die Mauer rechtzeitig das Tor. | la puerta de hierro de la Mauer | dos guardias empujan las hojas, que se cierran | contrapicado que sigue el cierre | C |
| 11 | 18,20–18,80 | „Noch am Leben." | Dachboden, primer plano | susurra a la radio con la mano en la boca | push-in | S |
| 12 | 18,80–20,05 | „Bleib versteckt, Schatz." | Funkhütte | Mama sonríe triste con los cascos y toca la foto del narrador | órbita lenta | W |
| 13 | 20,05–21,45 | Sie machen uns alles nach. | calle: un vecino imita a otro | copia el saludo de su vecino un segundo tarde | travelling | F |
| 14 | 21,45–22,60 | Nur ein bisschen falsch. | detalle: dos vecinos se dan la mano | se dan la mano con la izquierda y la derecha cruzadas | golpe de zoom | R |
| 15 | 22,60–24,75 | Herr Brandt mäht den ganzen Tag Rasen. | Vorstadt, jardín de Herr Brandt | empuja el cortacésped feliz | travelling lateral | Z |
| 16 | 24,75–26,10 | Obwohl da kein Gras mehr ist. | picado sobre la tierra pelada | el cortacésped levanta polvo; ni una brizna | grúa que sube | S |
| 17 | 26,10–27,70 | Die Bäckerei verkauft | fachada de la Bäckerei (toldo, pretzel) | un cliente sale con una barra | acercamiento | W |
| 18 | 27,70–29,15 | seit zwanzig Jahren dasselbe Brot. | interior: mostrador con la barra | el panadero la levanta orgulloso; pop-up **20 JAHRE** | golpe de zoom | C |
| 19 | 29,15–30,80 | Reingebissen hat nie jemand. | primer plano de la barra entera y polvorienta | una mano la gira: ni un mordisco; una telaraña | macro con travelling | I |
| 20 | 30,80–31,80 | Alle lachen gleichzeitig. | plaza frente a la Festhalle | 8 vecinos se ríen a la vez con la boca enorme | alejamiento rápido | F |
| 21 | 31,80–33,70 | Und hören gleichzeitig auf. | los mismos | se callan en seco; el narrador, en medio, fuerza una risa | zoom medio al narrador | W |
| 22 | 33,70–35,20 | Und nachts stehen sie im Dunkeln, | Wohnzimmer a oscuras | una familia de 3 de pie, inmóvil | travelling lateral lento | Z |
| 23 | 35,20–36,50 | das Gesicht zur Wand. | detrás de ellos: tres nucas frente a la pared | el reloj de pared hace tic-tac | push-in | S |
| 24 | 36,50–37,70 | Also stehe ich auch. | casa del narrador, de noche | él también, de pie mirando la pared, con los ojos muy abiertos | órbita | C |
| 25 | 37,70–38,95 | Ich habe zwei Regeln. | el narrador mirando a cámara en el desván | levanta dos dedos; pop-up **2** | golpe de zoom | R |
| 26 | 38,95–40,63 | Nie weinen, denn sie können es nicht. | baño: frente al espejo | se seca una lágrima con rabia antes de que caiga | zoom lento (riser) | I |
| 27 | 40,63–42,00 | Und niemand darf mein Herz hören, | primer plano del pecho (sudadera) | se tapa el pecho; el corazón late (pulso visual) | acercamiento | F |
| 28 | 42,00–43,35 | denn sie haben keins. | un vecino se abre la chaqueta | dentro, oscuridad | **golpe dramático** | W |
| 29 | 43,35–45,15 | Deshalb lasse ich keinen an mich ran. | patio del colegio | el narrador come solo en un banco; otros niños lejos | travelling | Z |
| 30 | 45,15–45,85 | Außer Lenny. | aparece Lenny | se sienta de un salto a su lado y sonríe | golpe de zoom | S |
| 31 | 45,85–47,10 | Er sitzt immer links von mir. | aula, Lenny en el pupitre de la izquierda | Lenny saluda | travelling lateral | R |
| 32 | 47,10–49,85 | Und er ist der Einzige, der im richtigen Moment lacht. | aula: el profesor hace un chiste | los demás se ríen tarde; Lenny ríe justo a tiempo con el narrador | zoom medio a Lenny | W |
| 33 | 49,85–51,10 | Als unser Hund starb, | Dachboden: la radio | el narrador escucha la noticia y baja la cabeza; un collar de perro en la mesa | push-in | I |
| 34 | 51,10–52,50 | kamen mir im Unterricht die Tränen. | Kunstraum | el narrador pinta y le tiembla el labio; asoma una lágrima | zoom lento | C |
| 35 | 52,50–54,00 | Doch bevor jemand hinsah, | Kunstraum: dos compañeros giran la cabeza hacia él | giro sincronizado | travelling | Z |
| 36 | 54,00–55,55 | kippte mir Lenny Pinselwasser ins Gesicht. | primer plano | Lenny vuelca el tarro; el agua de colores le salpica la cara | golpe de zoom + gotas | F |
| 37 | 55,55–56,95 | „Ups." Und ganz leise: | Lenny | se tapa la boca y finge torpeza | alejamiento rápido | S |
| 38 | 56,95–58,20 | „Ich pass auf dich auf." | los dos de perfil | Lenny le susurra al oído; el narrador abre mucho los ojos | acercamiento lento | W |
| 39 | 58,20–60,00 | Einmal im Monat ist Festnacht. | Festhalle por fuera, al atardecer | la multitud entra con faroles | dron que baja | R |
| 40 | 60,00–61,80 | Dann hängen alle ihre Gesichter an Haken. | Festhalle por dentro, pared de los ganchos | un vecino se quita la cara y la cuelga (clic) | zoom lento (riser) | C |
| 41 | 61,80–62,50 | Wie Jacken. | fila de caras colgadas | otra mano cuelga otra cara | travelling por la fila | Z |
| 42 | 62,50–64,95 | Darunter: schwarz, nass, nur Maul. | primer plano de una cabeza sin cara | la boca de dientes se abre; gotea | **zoom lento + golpe** | F |
| 43 | 64,95–66,90 | Kinder behalten ihr Gesicht bis dreizehn. | fila de niños con cara, junto a padres sin cara | los niños se agarran la cara; pop-up **13** | travelling | S |
| 44 | 66,90–68,40 | Dann ziehen sie es vor allen ab. | escenario de la Festhalle | un chico se arranca la cara ante el público, que aplaude | contrapicado | W |
| 45 | 68,40–70,23 | Und im Frühling werde ich dreizehn. | calendario de pared con flores | el narrador marca "13" con miedo | golpe de zoom | I |
| 46 | 70,23–72,40 | Letzten Winter brachten die Jäger einen Käfig. | calle nevada | los cazadores tiran del carro con la jaula; nieve | travelling | R |
| 47 | 72,40–73,80 | Drin saß mein Papa. | jaula de cerca | Papa se agarra a los barrotes | **zoom lento + golpe** | C |
| 48 | 73,80–75,00 | Er hatte mich gesucht. | Papa | recorre la multitud con la mirada | push-in | Z |
| 49 | 75,00–76,20 | Und jetzt sah er mich. | subjetiva: el narrador entre la gente | sus miradas se cruzan | golpe de zoom | F |
| 50 | 76,20–77,80 | Er spuckte mir vor die Füße. | los pies del narrador en la nieve | cae el escupitajo; él da un respingo | picado | S |
| 51 | 77,80–80,00 | „Monster." Als würde er mich nicht kennen. | Papa | gira la cara con desprecio fingido; le cae una lágrima de lado | órbita lenta | W |
| 52 | 80,00–82,20 | Am nächsten Morgen zog gegenüber ein Mann ein. | la casa de enfrente, de mañana | un hombre baja cajas de un carro | travelling | Z |
| 53 | 82,20–83,10 | Mit Papas Gesicht. | primer plano del falso Papa | se gira: sonrisa fija | **zoom lento + golpe** | C |
| 54 | 83,10–84,05 | Er winkte mir. | desde la ventana del narrador | el falso Papa saluda | push-in | R |
| 55 | 84,05–84,90 | Viel zu lange. | el mismo saludo, acelerado | sigue saludando en bucle | golpe de zoom | I |
| 56 | 84,90–86,05 | Und ich winkte zurück. | el narrador tras la ventana | saluda con una sonrisa rota | acercamiento lento | W |
| 57 | 86,05–87,20 | Ich habe nicht geweint. | primer plano del narrador | aprieta los labios; los ojos brillan | macro | F |
| 58 | 87,20–89,50 | Nachts fragte Mama, ob ich ihn gesehen hätte. „Nein." | Funkhütte / Dachboden alternados | Mama pregunta; él cierra los ojos y dice "Nein" | travelling | Z |
| 59 | 89,50–91,50 | Dann kam mein dreizehnter Geburtstag. | la cocina | una tarta con "13" y velas; manos sin cara la empujan hacia él | entrada con muelle | S |
| 60 | 91,50–93,55 | Die ganze Stadt wartete in der Halle. | Festhalle llena | todos sentados lo miran a la vez | dron que retrocede | R |
| 61 | 93,55–94,30 | Ohne Gesichter. | el público | todas las cabezas son negras | golpe de zoom | C |
| 62 | 94,30–96,50 | „Zieh es ab", sagten sie. Alle gleichzeitig. | fila de bocas | las bocas se mueven a la vez | travelling por la fila | W |
| 63 | 96,50–97,40 | Ich zog. | el narrador en el escenario | se agarra la cara con las dos manos y tira | push-in | F |
| 64 | 97,40–99,45 | Nichts. Es war einfach nur mein Gesicht. | primer plano | la cara no sale; se le estira la piel; terror | **zoom lento + golpe** | I |
| 65 | 99,45–102,30 | Und zum ersten Mal seit zwei Jahren weinte ich. | el narrador solo bajo el foco | se le saltan las lágrimas y le tiemblan los hombros; pop-up **2 JAHRE** | acercamiento lento | Z |
| 66 | 102,30–104,10 | Jedes Maul im Saal ging auf. | el público | todas las bocas se abren a la vez | alejamiento rápido | C |
| 67 | 104,10–106,00 | Doch plötzlich packte jemand meine Hand. | detalle de las manos | una mano con manga de rayas agarra la suya | golpe de zoom | S |
| 68 | 106,00–107,30 | Lenny. „Lauf!" | Lenny en primer plano | tira de él | travelling rápido | W |
| 69 | 107,30–109,10 | Hinter uns rief die ganze Stadt. | calle: los dos corren hacia cámara; detrás, la multitud sin cara | carrera | travelling hacia atrás | R |
| 70 | 109,10–110,25 | „Komm zurück, Kumpel!" | el falso Papa al frente de la multitud | grita con la boca abierta | golpe de zoom | F |
| 71 | 110,25–111,20 | Mit Papas Stimme. | el narrador corriendo | mira atrás con dolor | push-in | Z |
| 72 | 111,20–113,05 | Wir versteckten uns im alten Wasserturm. | exterior del Wasserturm al anochecer | suben por la escalera | grúa que sube | I |
| 73 | 113,05–114,95 | „Du wusstest es", flüsterte ich. | interior del Wasserturm | sentados, jadeando; el narrador lo mira | órbita lenta | S |
| 74 | 114,95–117,30 | „Ich sitze links von dir. Ich höre dein Herz." | Lenny | se señala la oreja; pulso del corazón | acercamiento lento | W |
| 75 | 117,30–119,05 | „Und warum hast du mich nicht verraten?" | el narrador | ceño de duda | push-in | C |
| 76 | 119,05–120,60 | „Weil du mein bester Freund bist." | Lenny | sonrisa cálida, demasiado perfecta | zoom medio | F |
| 77 | 120,60–123,20 | Ich umarmte ihn. Endlich war ich nicht mehr allein. | los dos | abrazo fuerte; luz cálida por las rendijas | órbita | Z |
| 78 | 123,20–126,30 | „Ich komme mit", sagte er. „Sag mir nur, wie man durchs Tor kommt." | Lenny | le pone la mano en el hombro y le mira serio | travelling | R |
| 79 | 126,30–128,00 | Also erzählte ich ihm alles. | el narrador | habla y gesticula; asiente | push-in | S |
| 80 | 128,00–131,15 | Den Weg. Wie Mama mich nennt. Und was ich ins Funkgerät sage. | insertos: dibuja el mapa en el polvo → la radio | el dedo traza el camino; toca la radio | golpe de zoom en cada palabra | W |
| 81 | 131,15–133,40 | Er drückte meine Schulter. „Ich pass auf dich auf." | Lenny | aprieta su hombro; sonrisa | acercamiento | I |
| 82 | 133,40–136,25 | Dann zog er sein Gesicht ab und hängte es an einen Nagel. | Lenny de pie | se arranca la cara (cabeza negra) y la cuelga en el clavo | **zoom lento + golpe** | C |
| 83 | 136,25–138,90 | Die ganze Stadt hatte es von Anfang an gewusst. | exterior del Wasserturm | la multitud sin cara rodea la torre en silencio | dron que retrocede | F |
| 84 | 138,90–141,00 | Hundert Jahre lang fanden sie die Mauer nicht. | la Mauer en las montañas de noche | la nieve sopla; pop-up **100 JAHRE** | dron | Z |
| 85 | 141,00–143,70 | Sie brauchten nur jemanden, der ihnen den Weg verrät. | la carretera de montaña | la multitud con faroles avanza por el camino | travelling | S |
| 86 | 143,70–145,40 | Dann wurde alles schwarz. | el narrador | cae al suelo; fundido a negro | iris que se cierra | — |
| 87 | 145,40–147,80 | Mein Funkgerät knisterte. „Schatz, bist du da?" | casi negro: solo el LED de la radio en la mochila | la radio parpadea | push-in | F |
| 88 | 147,80–150,10 | Und über mir hörte ich meine eigene Stimme. | contrapicado oscuro | una figura sin cara sostiene la radio con la cara del narrador puesta | **zoom lento** | C |
| 89 | 150,10–153,12 | „Hi Mama! Ich komme nach Hause! Mach das Tor auf!" | Funkhütte | Mama sonríe y corre a la palanca; la puerta de hierro empieza a abrirse | acercamiento a la puerta + **golpe final** | — |

Los planos de más de 2,6 s (5, 19, 32, 39, 44, 46, 51, 58, 62, 69, 77, 78, 80, 82–85, 89) se parten en 2 o 3 encuadres o entornos dentro del mismo tramo (por ejemplo, 80 = mapa → Mama → radio). Así **la media se queda en ~1,9 s (unos 82 cortes)**.

## 8. Comprobación antes de entregar
- Cortes medidos: media 1,7–2,1 s, ninguno > 2,8 s, cada uno con transición y efecto.
- Efectos: ≥ 1 cada 1,5 s. Campanita en 0 ms y cada ~10 s.
- Hoja de contactos: sujeto centrado y sin subtítulo encima en cada plano. Todo el texto en alemán.
- Sonoridad medida (voz, música, efectos y tensión por separado).
- Nitidez, saturación y viñeta aplicadas.
