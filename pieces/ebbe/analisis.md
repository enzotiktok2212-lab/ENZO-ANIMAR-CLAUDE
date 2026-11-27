# ebbe — análisis de la referencia («una vez cada 100 años, el océano se retira»)

Referencia: 576×1024, 30 fps, 126,6 s (122 s de historia + 4 s de cierre de TikTok). Narración en **español** (re-subida de @robloxdafilms). Transcripción: `transcripcion_referencia.txt`.
Cortes: 177 saltos de imagen detectados (umbral 11), muchos por movimientos rápidos de cámara → **un plano real cada ~0,9 s** (casi uno por palabra clave). Ráfagas de 0,3 s en la huida y en la ola.

## Estructura
| tramo | s | qué pasa | mini-gancho |
|---|---|---|---|
| Gancho | 0–9 | regla: cada 100 años el mar se retira un día; todo el pueblo en el muro al atardecer, escaleras por los acantilados | «cada 100 años» + imagen imposible |
| Mundo | 9–23 | el agua se va kilómetros; barcos naufragados, niños en arrecifes; el señor Finch y su cofre lleno de arena; la única regla: volver antes del atardecer (cartel) | regla con consecuencia |
| Giro 1 | 23–29 | «pero aquí viene lo extraño»: las gaviotas se van tierra adentro | presagio |
| Protagonista | 29–45 | Cens colecciona conchas (cientos), «el pasatiempo más aburrido»; el abuelo le da la caracola de generaciones: «cuando el mar vaya a volver, las conchas cantan» | defecto = solución (sembrado) |
| Día | 45–62 | corales, huesos de ballena, barco pirata; camina 5 km más lejos que nadie; al mediodía las conchas cantan todas | la pista se cumple |
| Revelación | 62–72 | el mar estaba cogiendo aire para la ola más grande en 100 años; el pueblo está a km | zoom lento + riser |
| Clímax | 72–108 | grita, nadie le oye → caracola del abuelo → trepa al mástil → sopla (trueno) → todos corren, escaleras, la ola es una pared verde → él corre 5 km → mamá le agarra la muñeca → ¡BUM! contra el acantilado | ráfaga de planos cortos |
| Final | 108–122 | agua 30 m al aire, lluvia sobre el pueblo; todas las familias a salvo; la caracola cuelga en el ayuntamiento; «dentro de 100 años, al mediodía, alguien la hará sonar. Por si acaso.» | final circular |

## Por qué se hizo viral
1. **La imagen es espectacular** (lo principal): un mundo de muñecos de bloques con luz y agua casi reales — el contraste «juguete + cine» para el pulgar en el fotograma 0 (atardecer con el pueblo entero mirando al mar).
2. **Regla mágica + número** en la primera frase (cada 100 años, un día) → «¿y yo qué haría?».
3. **El defecto es la solución**: el hobby «más aburrido del mundo» (conchas) salva al pueblo; la pista del abuelo se siembra y se paga.
4. **Presagio** (gaviotas) y **revelación** (el mar cogía aire) → tensión creciente.
5. **Final familiar** (mamá le salva) + **final circular** («por si acaso») → guardados y comentarios.
Patrón de RPM alto del canal: fantasía con regla + número, chico raro que se vuelve héroe, final emotivo con la familia, ~2:00. Sin villano: el «villano» es la ola.

Palabras clave: 100 años, océano, escaleras, acantilados, kilómetros, naufragados, regla, atardecer, gaviotas, conchas, caracola, cantar, mediodía, ola, pared, mástil, sopló, trueno, corrieron, mamá, bum, 30 metros, lluvia, ayuntamiento.
Conectores: pero, cuando, entonces, después, y, antes de, detrás de mí.

## Estilo de imagen (lo que hay que replicar)
Es **render de cine (tipo Blender Cycles / Unreal) con muñecos Roblox sencillos**. Lo que lo hace «brutal»:
- **Luz física**: sol duro con sombras nítidas y largas, rebote cálido en la arena, cielo azul profundo con **nubes volumétricas** (cúmulos con luz y sombra propias), atardecer naranja-rosa con el sol en cuadro y halo.
- **Materiales realistas** en el mundo (los muñecos no): arena con **ondas de marea** (relieve + charcos que reflejan el cielo), conchas y piedras esparcidas, roca de acantilado estratificada, óxido en los cascos, madera gastada, coral con color.
- **Agua de verdad**: reflejos del cielo, transparencia verde con el sol atravesando la ola, espuma blanca, salpicaduras en partículas, lluvia.
- **Profundidad de campo fuerte**: fondo y primer plano desenfocados (tilt-shift), sensación de maqueta.
- **Escala épica**: planos generales enormes (pueblo entero, km de fondo marino, ola pared) alternados con primeros planos de caras.
- **Cámara**: gran angular bajo a ras de suelo, contrapicados al mástil, cenitales sobre la escalera, travellings rápidos detrás de los que corren, cámara en mano en la huida.
- **Personajes**: Roblox básico (cabeza blanca lisa, ojos y cejas 2D dibujados a línea, ropa con arrugas), abuelo con pelo blanco y gafas, mamá con pelo rubio; multitudes con camisetas de rayas (pueblo marinero).
- **Grading**: contraste medio, saturación natural (no chillona), tonos cálidos en arena y fríos en cielo/agua, ligera neblina en el horizonte.
- **Formato**: la imagen va en una franja central ~3:4 con el mismo vídeo desenfocado arriba y abajo (relleno). Subtítulo: una o dos palabras blancas con contorno negro, la palabra clave en **rojo**.

### Cómo lo hago en nuestro motor (three.js, plantilla `schutzengel`)
- Tono **AgX** (`?tm=agx`), exposición algo más baja, saturación 1,15 (no 1,38), bloom solo en sol/espuma.
- Cielo: shader con gradiente + sol con halo + **nubes volumétricas falsas** (sprites con luz/sombra por normal) y atardecer para el gancho.
- Arena: plano grande con **mapa de normales de ondas** generado por código + charcos con reflejo (`Reflector`/`Water` de three/addons) + conchas y piedras instanciadas.
- Mar y ola: malla desplazada con material transmisivo verde, espuma por textura de ruido, partículas de salpicadura y lluvia.
- Sombras de sol de alta resolución (`PCFSoftShadowMap`, mapa 4096), AO y DOF más fuerte (apertura mayor) para el look maqueta.
- Pueblo costero alemán propio (Ostsee: casas de ladrillo rojo, tejados de paja/teja, faro, muelle, banderines) en lugar del pueblo mediterráneo del original.
- Subtítulos: mantener los del canal (#E2FD07) salvo que el usuario quiera el rojo del original.

## Cambios para que no parezca copia
Ciudad: «Möwensand», pueblo del Mar del Norte (Wattenmeer: el mar se retira de verdad allí → muy creíble en Alemania), faro rojo y blanco, casas de ladrillo con tejado de paja. Protagonista: **Jonte** (en vez de Cens). Vecino: **Herr Brösel** (en vez de Finch), cofre **lleno de algas**. Conchas: **dreihundertzwölf**. Caminata: **6 km**. Salpicadura: **40 m**. Cartel: «VOR SONNENUNTERGANG ZURÜCK AN LAND». Cartel final: «NÄCHSTE EBBE: MITTAGS BLASEN».
