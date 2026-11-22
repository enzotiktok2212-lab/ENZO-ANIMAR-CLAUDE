# ⏳ VÍDEO PENDIENTE — `flaschen` («In dieser Stadt sitzt jeder auf einer Flasche»)

Estado (22-11-2026): **análisis y guion terminados y aprobados por el usuario. Falta TODO lo demás.**
El usuario retoma en otra sesión y manda directamente la voz de ElevenLabs.

## Hecho
- `analisis.md`: análisis del vídeo de referencia (89 s, historia hasta 84,8 s, ~1,1–1,2 s por plano), escenas en orden, por qué se hizo viral.
- Gancho elegido por el usuario (variante 3 de 6): «In dieser Stadt sitzt jeder auf einer Flasche. Und niemand hat mir je gesagt, warum.»
- `skript.txt` (alemán, 317 palabras), `skript_es.txt` (traducción), `skript_elevenlabs.txt` (Eleven v3, etiquetas de tono por frase).
- Cambios frente al original: Bus → Straßenbahn, Friseur → Zahnarzt, Marktplatz → Domplatz, Opa 40 J. → Oma 52 J., Bürgermeister → Bürgermeisterin, «ein Mann» → ein Bäcker, 100 → 300 Jahre, luz verde → lila.

## Siguiente paso (al recibir la voz)
1. Guardar la voz en `pieces/flaschen/audio/voz-original.mp3`.
2. Copiar la plantilla `pieces/adrian/` (scripts, `src/`, `audio/{campanita-recortada.wav,musica.mp3,musica-fondo.wav}`); cambiar DUR, puerto y nombres (ver skill `.claude/skills/in-dieser-stadt/SKILL.md` §3).
3. Whisper: `pip install faster-whisper` y el modelo small desde npm `@skillninja/shortmovie-telop-model-p0..p3` (unir `model.bin.part0..3` en `/home/user/whisper-small/model`, con los json de p0). Transcribir → `prep_audio.py voz raw skript.txt audio .055`.
4. Planos según las escenas de `analisis.md` (mismas escenas, otra ciudad/reparto/ángulo), cortes 1,2–1,8 s (nunca ≥2 s), transiciones variadas con efecto distinto cada una.
5. Revisión de TODOS los planos al 12 % y 60 % antes del render; mezcla (música −24 LUFS, campanita 0 s y cada ~10 s); render; mandar **solo el vídeo**.

## Escenas a construir (del original, en orden)
plaza llena de gente en botellas (gancho, zoom lento) · tranvía · clase · dentista · abuela «52 JAHRE» · queja en la plaza · compra online de la silla («BESTELLT ✓») · llega el paquete · saca botella del suelo → agujero · se sienta («PERFEKT») · silencio, la ciudad mira · panadero se cae · policía + bocadillos · alcaldesa saca su botella → luz lila · «KORKEN!» · cueva con ojos lila, «VOR 300 JAHREN» · el agujero burbujea · «FLASCHE REIN!» · la botella rueda, la ciudad persigue · la atrapa, «PLOPP!» · «JEDEN TAG» · silla en el sótano · de noche «KLOPF» desde abajo.

El vídeo de referencia NO está en el repo (regla). Si hace falta volver a verlo, pedírselo al usuario.
