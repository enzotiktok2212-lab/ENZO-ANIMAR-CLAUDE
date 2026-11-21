# Schlafstadt — "Die Stadt ohne Morgen"

- Formato: 9:16, 30 fps, **135,2 s** (voz de ElevenLabs con los silencios recortados: 144,9 s → 135,2 s).
- Estilo: blocky-3d, con `styles/blocky-3d/PRODUCCION.md` como encargo.
- Idioma de pantalla: **alemán**.
- Voz: `audio/voz-sin-silencios.wav`. Tiempo de cada palabra en `audio/words.json` (alineado por sílabas a los 80 tramos de voz: faster-whisper no puede descargar su modelo en este entorno, así que el margen es de ±0,15 s).

## Personajes (rediseño con aspecto alemán, a petición del usuario)
| personaje | diseño final |
|---|---|
| **Finn** (11) | pelo rubio pajizo revuelto, ojos azules, pecas; camisa de Trachten a cuadros rojos y blancos, **Lederhosen** de cuero con tirantes y puente bordado con edelweiss, calcetines altos de lana, zapatos Haferl; la **lupa de relojero del abuelo** en una cinta en la frente |
| **Opa** (relojero) | **Janker de loden** gris con solapas verdes y botones de asta, chaleco verde, pajarita, cadena de reloj; gafas redondas, bigote de morsa blanco, cejas pobladas; gorra plana (despierto) / gorro de dormir a cuadros (en la cama 9) |
| **Herr Wachter** | camarero de Kaffeehaus: chaleco negro, camisa blanca con ligas en los brazos, pajarita, **delantal blanco largo**, pelo negro engominado con raya al medio y patillas; el bigote torcido son las agujas del reloj del ayuntamiento |
| vecinos | mujeres con **Dirndl** (corpiño, blusa de mangas abullonadas, delantal, trenzas en corona) y hombres con **Tracht** y **sombrero tirolés** con Gamsbart; todos con ojeras |
| Nachtwächter | capa oscura, sombrero de ala ancha, farol y alabarda: los vigilantes del pueblo |
| ciudad | **casas de entramado (Fachwerk)** y fachadas pastel, jardineras con geranios, letreros de pretzel colgantes, muralla medieval, relojes de cuco de la Selva Negra en el taller |

El diseño anterior queda abajo como referencia.

## Personajes (primera versión, sustituida)
| personaje | diseño | colores | rasgo |
|---|---|---|---|
| **Finn** (11) | sudadera amarilla con capucha, bufanda roja, vaqueros, zapatillas rojas, pelo castaño revuelto, pecas | amarillo `#FFC23A` + rojo | la **lupa de relojero del abuelo** en la frente; ojeras leves |
| **Opa** (relojero) | chaleco marrón con cadena de reloj, pajarita azul, camisa blanca, gafas redondas, pelo blanco a los lados, bigote blanco | marrón + blanco | duerme en la **cama nº 9** con gorro de dormir azul |
| **Herr Wachter** (café) | alto, chaleco burdeos de rayas, pajarita negra, delantal, pelo negro engominado | burdeos + negro | **el bigote torcido son las agujas del reloj del ayuntamiento** (una larga, una corta, eje dorado); ojos muy abiertos, sin ojeras; siempre con taza |
| vecinos | 6 variantes de color | pastel | **ojeras hasta la barbilla**, párpados caídos, andar encorvado |

## Entornos (cambian casi en cada plano)
Calle de casas alemanas en noche eterna · Marktplatz con el **Rathausturm sin agujas** (y la puertecita del cuco) · **Schlafgarten** (15 camas numeradas, seto, arco con letrero) · Café Wachter por fuera (neón, pizarra "KAFFEE 8 €") · Café por dentro (barra de mármol, cafetera cromada, estanterías, pizarra) · habitación de bebés · prado de las ovejas disfrazadas · trastienda del mercado negro de almohadas · cuarto de Finn · taller del relojero · callejón con cubo de basura · interior de la torre (engranajes) · tejados al amanecer.

## Música
`audio/musica-fondo.mp3`: la pista del usuario a velocidad original (128,0 s), que vuelve a empezar al terminar y se corta a 135,17 s con un fundido de 1 s. Está a −29 LUFS con un ducking suave bajo la voz (voz −16 LUFS). La premezcla de voz y música mide −14,9 LUFS.

## Zooms lentos
En 9 planos (11, 17, 23, 28, 37, 50, 55, 68, 79): un riser durante el zoom, una viñeta que se cierra y un golpe dramático al terminar. En el resto de planos el zoom es medio o rápido.

## Tabla de planos (tiempos en el audio recortado)
Transiciones: **W** barrido · **Z** zoom a través · **F** destello · **S** deslizamiento · **R** giro · **I** iris · **C** corte con golpe de zoom. Cada una con su efecto.

| # | t (s) | lo que se dice | entorno / encuadre | acción y física | texto en el mundo | sonidos | → |
|---|---|---|---|---|---|---|---|
| 1 | 0,00–3,01 | In dieser Stadt wachst du nie wieder auf, wenn du einschläfst. | dron bajando sobre la ciudad en noche eterna, luna enorme | un vecino cabecea en un banco, se duerme y una red lo levanta | — | viento nocturno, campanilla lejana, "zzz" | Z |
| 2 | 3,01–5,14 | Hier hat jeder Augenringe bis zum Kinn. | primer plano de un vecino, push-in a la cara | párpados caídos, ojeras hasta la barbilla; parpadeo lento | — | parpadeo, bostezo contenido | W |
| 3 | 5,14–6,45 | Auf der Straße zu gähnen | calle a ras de adoquín | una vecina bosteza enorme (boca abierta, brazos estirados) | — | bostezo | C |
| 4 | 6,45–7,81 | kostet fünfzig Euro. | contrapicado: un vigilante con silbato aparece | pop-up "−50 €", el vigilante le arranca un ticket | **−50 €** · "GÄHNEN VERBOTEN" | silbato + caja registradora | S |
| 5 | 7,81–9,45 | Babys kriegen kein Schlaflied, | habitación de bebé, cuna | una madre cierra un libro de nanas tachado | "SCHLAFLIED ✕" | móvil de cuna, clic | F |
| 6 | 9,45–10,86 | sie kriegen ein Weck-Lied. | primer plano de la cuna | un despertador gigante suena; el bebé abre los ojos de golpe | — | despertador (riiing) | W |
| 7 | 10,86–12,20 | Die Schafe laufen verkleidet herum, | prado junto a la muralla | ovejas con bigote falso, sombrero y gafas caminan de pie | — | balido apagado, pasos de pezuña | Z |
| 8 | 12,20–13,61 | damit sie keiner zählt. | plano medio: alguien señala para contarlas | la oveja se pone las gafas y silba disimulando | "1… 2…?" | silbido, contador | R |
| 9 | 13,61–15,36 | Kissen gibt es nur im Hinterhof, | patio trasero oscuro, farol | un vendedor con gabardina mira a los lados | — | pasos, maullido | I |
| 10 | 15,36–16,39 | unterm Ladentisch. | inserto bajo el mostrador | saca una almohada brillante, entrada con muelle | "PSST!" | crujido de tela, "pop" | W |
| 11 | 16,39–18,38 | Der Rathausturm hat keine Zeiger. | Marktplatz, contrapicado del Rathausturm, push-in a la esfera · **ZOOM LENTO** (riser + viñeta → golpe dramático) | esfera sin agujas, solo el eje | — | tic-tac hueco, viento | Z |
| 12 | 18,38–20,57 | Und seit zwölf Jahren ist es Nacht. | cielo: un calendario arranca hojas a toda velocidad | la luna no se mueve | **12 JAHRE** | hojas pasando, búho | F |
| 13 | 20,57–22,38 | Kaffee gibt es nur bei Herrn Wachter. | Café Wachter por fuera, neón | cola larga de vecinos con ojeras | **CAFÉ WACHTER** | zumbido del neón, murmullo | S |
| 14 | 22,38–23,50 | Acht Euro die Tasse. | inserto: la pizarra de precio | "8 €" entra con muelle; monedas caen | **KAFFEE 8 €** | monedas + caja registradora | C |
| 15 | 23,50–24,91 | Und wer trotzdem einschläft? | callejón: un hombre se queda dormido de pie | cabeceo, se tambalea | — | ronquido, "zzz" | W |
| 16 | 24,91–27,15 | Der kommt in den Schlafgarten am Marktplatz. | dos vigilantes lo llevan en camilla al Schlafgarten (plano general) | lo acuestan en una cama, le ponen gorro | **SCHLAFGARTEN** | ruedas de camilla, pasos | Z |
| 17 | 27,15–27,90 | Für immer. | push rápido a la cara del durmiente · **ZOOM LENTO** (riser + viñeta → golpe dramático) | la manta se sube sola | — | golpe grave (boom) | F |
| 18 | 27,90–30,45 | Finn war elf und hatte noch nie die Sonne gesehen. | cuarto de Finn, ventana negra | Finn pega la cara al cristal; póster del sol en la pared | póster "SONNE?" | vaho en el cristal, suspiro | W |
| 19 | 30,45–32,51 | Sein Opa, der Uhrmacher der Stadt, | taller del relojero: relojes por todas partes (recuerdo, tono cálido) | Opa ajusta un reloj con lupa, guiña a Finn | — | tic-tacs en capas, cuco | I |
| 20 | 32,51–34,38 | lag in Bett Nummer neun im Schlafgarten. | Schlafgarten, picado sobre la cama 9 | Finn junto a la cama, Opa dormido sonriendo | número **9** | grillos, respiración lenta | S |
| 21 | 34,38–37,08 | Und die Sonne geht nur auf, wenn der Turm sieben schlägt. | maqueta/diagrama: la torre da 7 campanadas y sale el sol (visión) | el sol sube con muelle | **7** | 7 campanadas rápidas | Z |
| 22 | 37,08–39,62 | Finn. Opas Taschenuhr war stehen geblieben, | manos de Finn abren la tapa del reloj de bolsillo | la tapa salta, el segundero no se mueve | — | clic de tapa, silencio de tic | C |
| 23 | 39,62–41,27 | um 6:59 Uhr. | macro de la esfera · **ZOOM LENTO** (riser + viñeta → golpe dramático) | agujas en 6:59, golpe de zoom | **6:59** | golpe metálico | W |
| 24 | 41,27–43,11 | Eine Minute vor Sonnenaufgang. | Finn mira hacia la torre, el horizonte apenas rosado | Finn aprieta el reloj contra el pecho | — | viento, nota de piano | R |
| 25 | 43,11–44,60 | Herr Wachter war der Einzige in der Stadt | café por dentro, Wachter aparece por detrás de la cafetera | entrada con giro, sonrisa | — | vapor de cafetera, campanilla de puerta | S |
| 26 | 44,60–45,99 | ohne Augenringe. | primer plano: ojos abiertísimos, sin ojeras | parpadea muy rápido | — | "bling" | C |
| 27 | 45,99–47,61 | Er trank den ganzen Tag Kaffee. | montaje: 4 tazas seguidas, cada una vacía en un trago | sorbo, taza al fregadero | contador **☕×4** | sorbos, porcelana | W |
| 28 | 47,61–49,66 | Und er hatte einen schiefen Schnurrbart. | macro del bigote (las agujas), push-in · **ZOOM LENTO** (riser + viñeta → golpe dramático) | el bigote se tuerce un poco | — | "boing" metálico | Z |
| 29 | 49,66–50,64 | „Kaffee, Kleiner? | Wachter se inclina sobre la barra hacia Finn | ofrece taza, sonrisa torcida | — | taza sobre mármol | S |
| 30 | 50,64–52,55 | Oder willst du schlafen wie dein Opa?" | contraplano: Finn, ceño | Finn aprieta los puños | — | gruñido bajo | C |
| 31 | 52,55–53,86 | Er sah auf Opas Uhr und | Wachter mira el reloj en la mano de Finn | se le congela la sonrisa, ojo izquierdo tiembla | — | tic | W |
| 32 | 53,86–54,96 | warf sie in den Müll. | se lo arranca y lo lanza: parábola con giro al cubo de basura | rebote en el borde, cae dentro | — | whoosh + lata | F |
| 33 | 54,96–56,30 | Als Finn sie wieder herausfischte, | callejón, Finn mete medio cuerpo en el cubo | sale con el reloj y una piel de plátano | — | rebuscar basura | Z |
| 34 | 56,30–57,63 | lachte Herr Wachter. | Wachter ríe a carcajadas, cabeza hacia atrás | hombros sacudidos | — | risa grave | C |
| 35 | 57,63–58,88 | Sein Schnurrbart zuckte, | macro del bigote | da dos saltos | — | resorte | W |
| 36 | 58,88–60,28 | tick, tick: eine Seite lang, | macro: se marca el lado largo | el lado largo se ilumina | — | tick, tick | C |
| 37 | 60,28–62,25 | die andere kurz, wie bei einer Uhr. | macro → superposición de una esfera de reloj detrás del bigote · **ZOOM LENTO** (riser + viñeta → golpe dramático) | encaje perfecto | — | "ding" de descubrimiento | Z |
| 38 | 62,25–64,26 | „Opa, ich bring dir den Tag zurück." | Schlafgarten, Finn junto a la cama 9 cogiendo la mano de Opa | determinación, mirada a la torre | — | latido + cuerda | F |
| 39 | 64,26–66,43 | In der Nacht fasste Finn einen Entschluss: | cuarto de Finn, lámpara, plan dibujado en la pared | Finn traza flechas | — | lápiz, papel | W |
| 40 | 66,43–68,79 | Er würde Herrn Wachter den Schnurrbart abreißen. | el plano: dibujo de Wachter con el bigote tachado | Finn da un golpe en el dibujo | — | golpe en la pared | S |
| 41 | 68,79–70,76 | Seine Waffe: Opas Spieldose, | inserto: caja de música de madera con dorados | entra con muelle, brillo | — | caja de música (2 notas) | I |
| 42 | 70,76–72,62 | das letzte Schlaflied der Stadt. | Finn la guarda en la sudadera, push-in | sonrisa decidida | — | cremallera | W |
| 43 | 72,62–74,85 | Im vollen Café klappte Finn sie auf, | café lleno, Finn en el centro abre la caja | la tapa se abre, notas brillantes salen flotando | notas ♪ | campanilla de puerta, murmullo, clic de tapa | Z |
| 44 | 74,85–76,30 | und das verbotene Lied | las notas recorren el local | los clientes se giran | — | nana de caja de música | S |
| 45 | 76,30–77,69 | erfüllte den ganzen Raum. | plano general desde el techo | las notas llenan todo | — | nana + "aaah" | R |
| 46 | 77,69–78,93 | Gähnen. Gähnen. | dos clientes bostezan uno tras otro | bocas enormes, brazos estirados | — | bostezo, bostezo | C |
| 47 | 78,93–79,61 | Gähnen. | un tercero bosteza contra la cámara | golpe de zoom a la boca | — | bostezo grave | W |
| 48 | 79,61–81,67 | „Mach das aus! Mach das aus!" | Wachter grita detrás de la barra | señala, venas de enfado | — | grito, taza tintinea | C |
| 49 | 81,67–83,26 | Herr Wachter trank, schlug sich ins | se bebe una taza de un trago | se da una bofetada (la cabeza gira) | — | sorbo + bofetada | C |
| 50 | 83,26–84,92 | Gesicht, hielt dagegen … | primer plano: párpados que caen y él los sube · **ZOOM LENTO** (riser + viñeta → golpe dramático) | lucha contra el sueño, sudor | — | tensión (cuerda) | Z |
| 51 | 84,92–86,40 | und gähnte so riesig | el bostezo empieza | la boca se abre más y más | — | bostezo que crece | C |
| 52 | 86,40–87,91 | wie noch nie in seinem Leben. | contrapicado, el bostezo llena el cuadro; el bigote se suelta | | — | bostezo épico + "pling" | W |
| 53 | 87,91–89,40 | Finn sprang über die Theke | Finn salta la barra (anticipación, salto, vuelo) | tazas vuelan | — | salto, porcelana | C |
| 54 | 89,40–91,11 | und riss an Herrn Wachters Schnurrbart. | Finn tira del bigote con las dos manos | se estira, ¡riiip! se suelta | — | tirón + rasgado | F |
| 55 | 91,11–93,23 | Das waren die Zeiger vom Rathausturm. | macro de las agujas en la mano de Finn, la torre al fondo · **ZOOM LENTO** (riser + viñeta → golpe dramático) | las agujas brillan | — | campanada lejana | Z |
| 56 | 93,23–95,58 | Vor zwölf Jahren hatte er sie abgerissen, | flashback (tono sepia): Wachter trepa la torre y arranca las agujas | tirón, chispas | **vor 12 Jahren** | metal crujiendo | R |
| 57 | 95,58–97,20 | auf 6:59 gestellt | flashback: pone las agujas en 6:59 | | **6:59** | clic de ajuste | S |
| 58 | 97,20–98,78 | und sich ins Gesicht geklebt. | flashback: se las pega bajo la nariz frente a un espejo | sonrisa maligna | — | cinta adhesiva | F |
| 59 | 98,78–100,17 | Nie wieder Morgen. | la ciudad en noche, el sol bloqueado | | — | golpe grave | W |
| 60 | 100,17–101,97 | Wer schläft, wacht nicht auf. | Schlafgarten lleno | las camas se multiplican | — | ronquidos | S |
| 61 | 101,97–103,95 | Und wer nicht schlafen kann, kauft Kaffee. | caja registradora de Wachter llena de billetes | billetes salen volando | **8 € · 8 € · 8 €** | caja registradora ×3 | C |
| 62 | 103,95–106,00 | Finns Opa war ihm auf die Schliche gekommen. | flashback: Opa con su lupa mira el bigote de Wachter | Opa frunce el ceño | — | tic + "hmm" | Z |
| 63 | 106,00–108,30 | Am nächsten Tag war Kamille in seinem Kaffee. | Wachter echa flores de manzanilla en la taza de Opa | Opa bosteza y se duerme | "KAMILLE" | cucharilla, bostezo | F |
| 64 | 108,30–109,65 | „Gib das zurück, Bengel!" | Wachter salta la barra persiguiendo a Finn | | — | grito, golpe | W |
| 65 | 109,65–110,98 | Finn rannte zum Turm, | calle: Finn corre hacia cámara, la torre al fondo | carrera con brazos, la bufanda ondea | — | pasos rápidos en adoquín | S |
| 66 | 110,98–112,51 | die halbe Stadt hinter ihm her. | dron trasero: una multitud con ojeras lo sigue | | — | multitud, gritos | Z |
| 67 | 112,51–113,74 | Er setzte die Zeiger ein. | dentro de la torre, engranajes; Finn encaja las agujas | clic | — | engranajes, clic metálico | C |
| 68 | 113,74–115,42 | Sechs Uhr neunundfünfzig. | la esfera por fuera: 6:59, push-in · **ZOOM LENTO** (riser + viñeta → golpe dramático) | el minutero tiembla | **6:59** | tic … tic | C |
| 69 | 115,42–116,30 | Sieben. | el minutero salta a las 7, golpe de zoom | | **7:00** | ¡CLAC! + primera campanada | F |
| 70 | 116,30–118,35 | Und zum ersten Mal seit zwölf Jahren | tejados: el horizonte se enciende de naranja | el cielo cambia de azul noche a rosa | — | campanadas 2–7, coro | Z |
| 71 | 118,35–119,52 | ging die Sonne auf. | el sol asoma detrás de la torre (bloom enorme) | rayos | — | "aaah" luminoso | W |
| 72 | 119,52–121,18 | „Die Sonne! Die Sonne! | la gente en la calle se tapa los ojos y señala | | — | gritos alegres | S |
| 73 | 121,18–122,86 | Seht doch, die Sonne!" | niños saltando, sombras largas por primera vez | saltos con física | — | risas, pájaros | C |
| 74 | 122,86–125,04 | Im Schlafgarten wachten die Schläfer auf. | Schlafgarten al sol: las mantas salen volando | se incorporan estirándose | — | gallo, estiramientos | Z |
| 75 | 125,04–127,52 | „Mensch, was für ein guter Schlaf!" | un vecino se estira con una sonrisa enorme | | — | crujido de espalda, risa | W |
| 76 | 127,52–129,57 | „Opa! Opa! Opa!" | Finn corre a la cama 9, Opa se incorpora y lo abraza | abrazo con levantamiento | — | pasos, risa de Opa | F |
| 77 | 129,57–131,00 | Herr Wachter hängte sich an den Zeiger, | torre: Wachter colgado del minutero | patalea | — | metal que cruje | S |
| 78 | 131,00–132,60 | um die Nacht zurückzuholen, | tira hacia atrás, la aguja baja un poco | sudor, mueca | — | esfuerzo, crujido | C |
| 79 | 132,60–135,17 | und die Uhr klemmte ihn im Kuckuckstürchen ein. | la puertecita del cuco se abre, lo atrapa y lo deja asomando; el cuco sale encima de su cabeza · **ZOOM LENTO** (riser + viñeta → golpe dramático) | se cierra de golpe, plumas | — | ¡CUCÚ! + portazo | — |

**Recuento:** 79 planos, media 1,71 s (el máximo es el plano 1, de 3,0 s, abriendo la historia). Hay un efecto por transición (78) más los de acción (unos 120), es decir, ≈1,5 efectos por segundo.
