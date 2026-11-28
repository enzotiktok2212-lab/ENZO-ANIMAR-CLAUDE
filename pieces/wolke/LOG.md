# wolke — registro para retomar
Rama `claude/elegant-tesla-78bsem`. Skill `.claude/skills/in-dieser-stadt/SKILL.md`. Contenedor nuevo: `cd /home/user/ENZO-ANIMAR-CLAUDE && ./preparar.sh && cd pieces/wolke && ln -sfn ../schutzengel/node_modules node_modules`.
- Guion: vape a los 18 (adultos). `skript*.txt`. Voz `audio/voz-original.mp3` → `prep_audio.py … .055` → `audio/voz-sin-silencios.wav` (115,4 s), `audio/words.json`. DUR = 116.1.
- Motor: el de namen (cielo, AO, DOF, ss 1.5) + humo de dampf (vape.js). Ojo: el GTAO pintaba los sprites de humo de negro → se esconden durante el pase AO (main.js).
- Mundo: Rufingen (RATHAUS, escenario del Vape-Tag en z=-26, sin fuente), casa con ventana (FX) con calle, mi cuarto (KX), cuarto de Marlon (MX), cocina (UX), cueva (HX, en a.js), calle (SX; valla de Marlon en z=-40). Reparto: wvolk.js (Flocke, Bruder, Marlon) + Papa/Oma (gvolk), Mama/Genau (nvolk).
- Planos: src/p/a.js (0–39), b.js (39–70), c.js (70–116): 104 planos. `python3 armar.py`; revisión `N=110 ./rv.sh rv .5`.
- Pendiente: revisión final → cues/sfx/mezcla → render → finish → portadas (src/p/z_cover.js) + descripción.
