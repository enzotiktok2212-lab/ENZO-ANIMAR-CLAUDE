# namen — registro para retomar
Rama `claude/charming-euler-5lnaoi`. Lee la skill `.claude/skills/in-dieser-stadt/SKILL.md` (§0b: encargo fijo del 27-11) y este archivo.
Contenedor nuevo: `cd /home/user/ENZO-ANIMAR-CLAUDE && ./preparar.sh && cd pieces/namen && ln -sfn ../schutzengel/node_modules node_modules`.

- Guion: `skript.txt` / `skript_es.txt` / `skript_elevenlabs.txt`. Voz: `audio/voz-original.mp3` → `prep_audio.py … .055` → `audio/voz-sin-silencios.wav` (93,4 s), `audio/words.json` (HUSS alineados a los golpes con `../huss/huss_onsets.py`). DUR = 94.1.
- Motor: el de ebbe (cielo con nubes, AO, DOF, ss 1.5) + física de monedas/balón. Mundo `src/nwelt.js` (Rufingen con la NAMENSBANK, villa con jacuzzi de oro, Krass Center fuera/dentro, Digga Gym, mi calle, fiesta, cancha vieja y cancha de oro); reparto `src/nvolk.js`.
- Planos: `src/p/a.js` (0–24), `b.js` (24–46), `c.js` (46–94,1): 98 planos, revisados. `python3 armar.py` → `src/index.js`. Revisión: `./rv.sh rv .5`.
- Mezcla: `node cues.mjs; python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.wav renders/mezcla.wav; python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-marca.wav; ffmpeg -y -i renders/mezcla-marca.wav -af afade=t=out:st=93.1:d=1 renders/mezcla-final.wav` (−12,6 LUFS).
- Render REPARTIDO (2823 fotogramas, ~13 s/fotograma por proceso): aquí `./rango.sh 0 315 4`; 8 sesiones hijas: 315-628, 628-941, 941-1254, 1254-1567, 1567-1880, 1880-2193, 2193-2506, 2506-2823 → suben `pieces/namen/renders/partes/p*.mp4` a `claude/namen-render-1…8`.
  Al terminar: para N en 1..8 `git fetch origin claude/namen-render-N && git checkout origin/claude/namen-render-N -- pieces/namen/renders/partes`; `./trozos.sh 0 315`; `./juntar.sh renders/partes`; comprobar 2823 fotogramas; `./finish.sh` → renders/namen.mp4; mandar SOLO el vídeo.
