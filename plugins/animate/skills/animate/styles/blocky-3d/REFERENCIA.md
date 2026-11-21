# Análisis plano por plano del video de referencia

Video de referencia: 576×1024 (9:16), 30 fps, 145,1 s, AAC estéreo 44,1 kHz. El archivo y los fotogramas extraídos se quedan **fuera del repo** (regla de `new-style.md`). Aquí solo hay mediciones y descripciones.

Género: **storytime en primera persona en un mundo de muñecos de bloques en 3D** ("en mi pueblo tocar el suelo cuesta 10 $"). Un narrador cuenta una regla absurda del mundo, cómo la vive él, cómo el pueblo se adapta, cómo el gobierno contraataca, cómo el héroe descubre el secreto, lo rompe, el pueblo celebra, y un **giro final** que reinicia el problema en peor.

## Números globales (medidos)

| medida | valor |
|---|---|
| planos | **71** (detección de escena ffmpeg, umbral 0,25, confirmado a ojo) |
| duración media de plano | **2,04 s** (mediana 1,97 s) |
| reparto | <1 s: 3 · 1–1,5 s: 14 · 1,5–2 s: 19 · 2–2,5 s: 20 · 2,5–3 s: 10 · >3 s: 5 |
| plano más largo | el último (5,96 s, el remate) y el de la cocina (3,9 s) |
| transiciones | **100 % cortes secos**. Ni fundidos ni barridos. El plano nuevo empieza ya con la cámara en movimiento |
| cámara quieta | **nunca**. Todos los planos tienen movimiento |
| empuje lento (push-in) medido en planos con personaje | **+2 % a +7 % de escala por segundo** (factor/s 1,02–1,07); en total 5–35 % a lo largo del plano |
| subtítulos | **una palabra a la vez**, cambia con cada palabra hablada (~2,5–3 palabras/s) |
| sonoridad | **−18,8 LUFS** integrado, rango 3,5 LU (mezcla muy plana, voz siempre encima) |
| silencios | ninguno ≥0,25 s por debajo de −35 dB: la música no para nunca |

## Cómo cambian los planos

- **Corte en cada frase**, a veces en cada media frase. Regla práctica: *un plano por idea*, 1,5–2,5 s.
- **Cambio de punto de vista en casi cada corte**: gran plano general aéreo → contrapicado a ras de suelo → plano medio frontal → inserto del teléfono → plano detalle. Rara vez dos planos seguidos con el mismo encuadre.
- **Insertos de objeto** (teléfono, gráfico, cartel, botón, zapatos) para cada número o dato. El número que dice el narrador aparece *escrito en el mundo* (pantalla, cartel, pop-up).
- **Planos reacción** del héroe en primer plano cuando le pasa algo (cara cambia: ojos de susto, ceño fruncido, boca abierta).
- **Golpe de zoom dentro del plano** en reacciones fuertes (último plano: se acerca rápido a la cara y vuelve a abrir).

## Tabla de planos

Tiempos en segundos. Cámara: *push* = avance lento; *track* = la cámara viaja con el sujeto; *contrapicado* = cámara baja mirando arriba; *cenital* = desde arriba.

| # | inicio–fin | dur | encuadre / qué se ve | cámara | función |
|---|---|---|---|---|---|
| 1 | 0,00–1,10 | 1,1 | gran plano aéreo de la avenida principal con el ayuntamiento al fondo | dron bajando y avanzando rápido | gancho: el mundo |
| 2 | 1,10–3,70 | 2,6 | ras de suelo en la acera; un vecino camina hacia cámara, cada paso un pop-up "−$10" y aro rosa en el suelo | contrapicado, track hacia atrás, ligero balanceo | la regla, mostrada |
| 3 | 3,70–5,07 | 1,4 | ayuntamiento frontal, guardias en la puerta | push frontal | quién manda |
| 4 | 5,07–6,77 | 1,7 | acera a nivel de suelo pasando junto a farola, hidrante, árbol | dolly rápido a ras de suelo | "cada centímetro" |
| 5 | 6,77–8,57 | 1,8 | centro de la calle, multitud caminando hacia cámara con pop-ups | push leve | todos pagan |
| 6 | 8,57–11,10 | 2,5 | inserto del teléfono "MY BANK — BALANCE" el saldo baja y se pone rojo | push leve | el dato en pantalla |
| 7 | 11,10–12,87 | 1,8 | héroe plano entero saludando, plaza detrás | push +18 % | presentación del héroe |
| 8 | 12,87–15,20 | 2,3 | héroe plano medio, cara preocupada, entra un pop-up desde la derecha | push lento | "ridículamente caro" |
| 9 | 15,20–17,03 | 1,8 | dormitorio en picado 3/4, héroe se despereza en la cama | push lento | su mañana |
| 10 | 17,03–19,20 | 2,2 | contrapicado de los pies pisando la alfombra, pop-up, panorámica a la cara de susto | tilt arriba | el primer paso cuesta |
| 11 | 19,20–20,27 | 1,1 | lateral bajo, héroe dando un paso | track lateral | otro paso |
| 12 | 20,27–22,47 | 2,2 | frontal, héroe con ojos de susto, otro pop-up | push leve | repetición cómica |
| 13 | 22,47–26,33 | 3,9 | cocina en picado (suelo damero rojo/blanco), héroe pequeño entra; pop-up "−$80" grande arriba | push +10 % | acumulación |
| 14 | 26,33–29,07 | 2,7 | primer plano del héroe con ceño, teléfono con saldo 13 $ → 3 $ | push +15 % | "casi en la ruina" |
| 15 | 29,07–32,40 | 3,3 | calle: vecino rodando en silla de oficina hacia cámara; arriba vuela una lavadora-helicóptero | push leve | la gente se adapta |
| 16 | 32,40–34,87 | 2,5 | contrapicado extremo de un vecino en zancos gigantes | tilt arriba siguiendo | invento 2 |
| 17 | 34,87–37,77 | 2,9 | avenida ancha, fila de gente en sillas de oficina hacia cámara | push | invento 1 en masa |
| 18 | 37,77–38,90 | 1,1 | contrapicado del cielo, lavadora-helicóptero pasa | giro/tilt rápido | invento 3 |
| 19 | 38,90–41,20 | 2,3 | plano medio del vecino dentro de la lavadora, saluda | track con él | remate del invento |
| 20 | 41,20–42,20 | 1,0 | calle lateral, peatona pasa junto a un coche | pan | "y otra gente…" |
| 21 | 42,20–43,67 | 1,5 | acera, peatona caminando normal con pop-ups | push leve | camina pagando |
| 22 | 43,67–46,97 | 3,3 | rico con traje blanco y cadena de oro, billetes y pop-ups vuelan alrededor | push lento | contraste: al rico no le importa |
| 23 | 46,97–48,80 | 1,8 | taller del héroe, plano medio; destello de idea (bloom blanco enorme) | push + flash | la idea |
| 24 | 48,80–50,67 | 1,9 | por encima del hombro, héroe trabajando en la mesa, chispas | push | construcción |
| 25 | 50,67–52,80 | 2,1 | inserto de los zapatos-cohete caseros sobre el banco | push +27 % | el invento |
| 26 | 52,80–53,80 | 1,0 | calle, héroe frontal con los zapatos puestos | push | "de algún modo…" |
| 27 | 53,80–55,27 | 1,5 | despegue: humo, llamas azules, la cámara sube con él | tilt arriba | "…funcionó" |
| 28 | 55,27–57,57 | 2,3 | el héroe vuela sobre los tejados, 3/4 trasero | track aéreo | libertad |
| 29 | 57,57–60,07 | 2,5 | avenida, el héroe vuela bajo hacia cámara y pasa | track hacia atrás | "sin pagar ni un dólar" |
| 30 | 60,07–62,93 | 2,9 | otros vecinos despegan con botas-cohete | push leve | lo copian |
| 31 | 62,93–65,47 | 2,5 | plaza con fuente y ayuntamiento, cielo lleno de gente volando | push +17 % | escala del cambio |
| 32 | 65,47–67,80 | 2,3 | despacho morado, pantalla con gráfico de ingresos cayendo en rojo "$4,000,000" | push +16 % | el gobierno pierde |
| 33 | 67,80–69,67 | 1,9 | alcalde (chistera) tras su mesa "MAYOR", cara enfadada | push +12 % | el antagonista |
| 34 | 69,67–70,67 | 1,0 | ayuntamiento contrapicado, aparecen drones | push | "a la mañana siguiente" |
| 35 | 70,67–72,87 | 2,2 | avenida, drones gigantes con pantallas "NEW RULE!" | push +35 % | la contraofensiva |
| 36 | 72,87–74,43 | 1,6 | detalle de un altavoz del dron | push al altavoz | anuncio |
| 37 | 74,43–76,80 | 2,4 | pantalla del dron "NEW RULE! FLYING LICENSE $1,000" a pantalla completa | push/deriva | la nueva regla escrita |
| 38 | 76,80–78,90 | 2,1 | por detrás del héroe volando, drones delante | track | el precio |
| 39 | 78,90–80,27 | 1,4 | plano general, todos caen en pánico | push | caos |
| 40 | 80,27–82,13 | 1,9 | uno se estrella en un árbol | pan | gag 1 |
| 41 | 82,13–84,33 | 2,2 | casa con piscina; uno cae al agua salpicando | push leve | gag 2 |
| 42 | 84,33–86,83 | 2,5 | fachada de rascacielos de cristal; uno queda colgado en la antena de arriba | tilt arriba largo | gag 3 |
| 43 | 86,83–89,60 | 2,8 | héroe primer plano, ceño, mira de reojo | push | "noté algo raro" |
| 44 | 89,60–92,53 | 2,9 | alcalde con guardias caminando por la acera | push | la pista |
| 45 | 92,53–94,93 | 2,4 | alcalde camina frente al cartel "GROUND TAX $0" | track con él | no paga |
| 46 | 94,93–95,83 | 0,9 | noche: limusina negra con luces | pan | cambio a noche |
| 47 | 95,83–97,90 | 2,1 | noche aérea: el héroe vuela siguiendo los coches hasta el ayuntamiento | track aéreo | persecución |
| 48 | 97,90–98,97 | 1,1 | muro de pantallas LED que es una puerta secreta | push | el escondite |
| 49 | 98,97–101,37 | 2,4 | sala secreta neón (verde/cian), el héroe de espaldas mira la máquina | push | descubrimiento |
| 50 | 101,37–103,07 | 1,7 | la máquina gigante llena de monedas de oro, botón rojo delante | push hacia la máquina | el secreto |
| 51 | 103,07–105,53 | 2,5 | macro de monedas de oro cayendo dentro del cristal | deriva vertical | "recoge cada pago" |
| 52 | 105,53–108,77 | 3,2 | botón rojo gigante con placa "DISABLE GROUND TAX" | push rápido al botón | el objetivo |
| 53 | 108,77–110,47 | 1,7 | detalle extremo de la placa iluminada | deriva lateral | tensión |
| 54 | 110,47–111,43 | 1,0 | héroe primer plano mirando a los lados | push | "miré alrededor" |
| 55 | 111,43–113,37 | 1,9 | sala de vigilancia vacía (monitores) | pan | "sin guardias" |
| 56 | 113,37–114,60 | 1,2 | monitores apagados | pan | "sin cámaras" |
| 57 | 114,60–114,93 | 0,3 | destello del botón | — | golpe |
| 58 | 114,93–116,50 | 1,6 | la mano del héroe pulsa el botón | push | la acción |
| 59 | 116,50–118,43 | 1,9 | la máquina se ilumina (bloom blanco) | push +18 % | efecto |
| 60 | 118,43–119,87 | 1,4 | pantallas de la ciudad se ponen verdes | pan | "toda pantalla" |
| 61 | 119,87–121,70 | 1,8 | noche: calle, la pantalla gigante se pone verde | push | el cambio se ve |
| 62 | 121,70–123,33 | 1,6 | máquina, contador "$0", "tax disabled" | push | resultado |
| 63 | 123,33–125,17 | 1,8 | día: la gente se baja de las sillas, pop-ups verdes "FREE" | push | liberación |
| 64 | 125,17–127,13 | 2,0 | el de los zancos los tira | tilt | liberación 2 |
| 65 | 127,13–129,50 | 2,4 | multitud caminando, confeti | track atrás | "por primera vez en años" |
| 66 | 129,50–131,60 | 2,1 | calle con árbol, todos caminan, pop-ups "FREE" | push | todos libres |
| 67 | 131,60–133,93 | 2,3 | frente al ayuntamiento, multitud levanta al héroe, confeti | push | "el mayor héroe" |
| 68 | 133,93–135,63 | 1,7 | dormitorio, el héroe duerme | push | coda: a la mañana siguiente |
| 69 | 135,63–136,70 | 1,1 | POV teléfono: notificación "GOVERNMENT — NEW TAX INTRODUCED" | push | el giro llega |
| 70 | 136,70–139,17 | 2,5 | héroe sentado en la cama leyendo el teléfono; inserto "BREATHING: $1 PER SECOND" | push | la nueva regla |
| 71 | 139,17–145,13 | 6,0 | héroe sentado, cara cada vez más asustada; **golpe de zoom** a la cara y vuelta; pop-up "−$1" | push rápido + retirada | remate: "¿me estás tomando el pelo?" |

## Estructura narrativa (la fórmula)

| bloque | tiempo | % | contenido |
|---|---|---|---|
| 1. Gancho + regla | 0–11 s | 8 % | "En mi pueblo, X cuesta Y". Se muestra la regla con 4–5 planos y un número en pantalla |
| 2. Presentación | 11–15 s | 3 % | "Me llamo ___ y aquí…" saludo a cámara |
| 3. Cómo me afecta | 15–29 s | 10 % | su mañana: cada acción cobra; acumulación de números; casi en la ruina |
| 4. Cómo se adapta el pueblo | 29–47 s | 12 % | 3 inventos absurdos + el rico al que no le importa |
| 5. Mi solución | 47–60 s | 9 % | idea (destello), construcción, invento, funciona |
| 6. Se extiende | 60–65 s | 4 % | todos lo copian |
| 7. El poder contraataca | 65–79 s | 10 % | el gobierno pierde dinero (gráfico), alcalde enfadado, nueva regla escrita en pantallas |
| 8. Caos | 79–87 s | 6 % | 3 gags de caídas |
| 9. La pista | 87–95 s | 6 % | el héroe ve que el alcalde no paga |
| 10. Investigación | 95–108 s | 9 % | noche, persecución, sala secreta, máquina, botón |
| 11. Clímax | 108–123 s | 10 % | mira alrededor, nadie vigila, pulsa, todo se pone verde |
| 12. Celebración | 123–134 s | 8 % | todos libres, confeti, héroe aclamado |
| 13. Giro final | 134–145 s | 8 % | notificación: un impuesto nuevo y peor; reacción; frase seca |

## Sonido

- **Voz en off** continua, joven, rápida y expresiva, en primera persona. Las palabras clave (cantidades, verbos fuertes) se marcan más grandes en el subtítulo.
- **Música de fondo** suave y constante (tipo lo-fi / juego casual), sin silencios, bajo la voz.
- **Efectos**: un "ding/caja registradora" en cada pop-up de dinero, "whoosh" en despegues, explosión de luz en la idea y en el botón, gritos/caídas en los gags, campanita de notificación en el teléfono.
- **Mezcla**: −18,8 LUFS, rango 3,5 LU; la voz manda siempre.
