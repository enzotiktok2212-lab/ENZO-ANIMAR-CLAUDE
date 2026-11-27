# Checklist (antes de render y antes de entregar)

## Guion
- [ ] Gancho idéntico al original (traducido); resto parafraseado con datos, números, lugares, comidas y nombres cambiados.
- [ ] Traducción al español entregada; guion en bloque para copiar.
- [ ] Etiquetas de ElevenLabs solo donde hacen falta (gritos/onomatopeyas), Eleven v3.

## Audio de la voz
- [ ] Silencios recortados (~55 ms de margen), sin atropellarse.
- [ ] `words.json` en orden, sin palabras sin pareja raras; onomatopeyas alineadas a sus golpes.

## Cada plano (mirar al 12 % y al 60 %)
- [ ] Ilustra literalmente la frase; misma escena que el original con otra ciudad, otro reparto, otro ángulo.
- [ ] La cámara se mueve (acercar/alejar/lateral/grúa).
- [ ] Todos los personajes hacen una acción concreta; caras con la emoción de la frase.
- [ ] Nadie de espaldas sin motivo.
- [ ] Nadie tapado (objetos, cajas, dinero, mesas, carteles, números, pop-ups, otros personajes).
- [ ] Nadie cortado por los bordes; personajes enteros cuando importa.
- [ ] Cámara no dentro de paredes, casas, coches, furgonetas ni muebles (imagen negra o de un color).
- [ ] Lo principal centrado (25–62 %) y por encima del subtítulo (74 %).
- [ ] Números sobre cabezas legibles y sin solaparse con carteles.
- [ ] Interiores no quemados a blanco; noche no demasiado oscura.
- [ ] Fondo vivo: casas/edificios, gente; nada de horizonte vacío.
- [ ] Gancho: regla visible en el fotograma 0, centrado, zoom lento hacia el sujeto.

## Mezcla y entrega
- [ ] Todos los efectos de `cues.json` existen en `sfx.LIB` (crear alias).
- [ ] Música −24 LUFS, efectos bajo la voz, campanitas 0 s y cada ≤10 s, fundido final 1 s.
- [ ] Fotogramas = ceil(DUR·30); `finish.sh` sin errores; duración del MP4 = DUR.
- [ ] Mandar solo el vídeo; recordar al usuario que escuche la mezcla.
- [ ] Commit + push del código (nunca vídeos, referencia ni capturas).

## Portadas
- [ ] Sujeto centrado, texto centrado entre personajes, sin tapar caras ni números.
- [ ] Todo lo importante entre y = 240 y 1680 px; arriba y abajo vacío.
