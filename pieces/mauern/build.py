# Construye src/main.js: cabecera, capa 2D y render de Pech + escenarios y planos propios (body_*.js).
import os, re; os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))
P = open('../../pech/src/main.js').read().split('\n'); L = lambda a, b: '\n'.join(P[a - 1:b])
head = """// Mauern — ~85 planos sincronizados con audio/words.json (1080×1920, 30 fps).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane, checkTex } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, noiseTex, stripes, screen, txt, tree, makeExtra } from './props.js';
import { B, gold, glass, label } from './diam.js';
import { world, training, nightField, basement, mouth, nape, sea, stoneTex } from './world.js';
import { makeGiant, makeSkinless, makeSmiler, makeMine, makeMetal, steamFor, makeHero, makeMom, makeDad, makeSoldier, makeCaptain, makeBuddy, makeBig, makeTall, makeLady } from './giants.js';
"""
h2 = L(9, 20).replace('const DUR = 125.79', 'const DUR = 160.35')
two = L(156, 167)
cap = '\n'.join(l for l in P[169:175])
key = r"""const KEY = /^(Stadt|Mauern|hundert|Jahren|niemand|Riesen|Augen|Grinsen|Essen|Menschen|Arm|Kopf|Nacken|Vater|Schlüssel|Keller|nie|rote|Hand|Haut|Muskeln|Dampf|Tritt|Tor|Felsbrocken|Bus|Haus|Mutter|Riese|breitesten|Soldat|rennen|Armee|Haken|Schwertern|Luft|Hauptmann|kleinste|40|Stiefel|Freund|Maul|dunkel|nass|wütend|Riesennacken|winzig|Kopf|Felsen|Loch|Monat|Himmel|Metallhaut|Uhrzeit|Blitz|gefesselt|Feld|Bäumen|Grinsende|Fünf|nichts|Faust|Glockenschlag|stehen|um|fraßen|weinte|Leben|zurück|Kellertür|Buch|Foto|Mensch|Frau|Erster|Wasser|Mutter|Schiff)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);"""
tail = '\n'.join(P[426:])
tail = tail.replace("CUES.push({ t: .25, s: 'riser', g: .9, d: +(st(7) - .3).toFixed(3) }); CUES.push({ t: st(7) - .02, s: 'braam', g: 1 });   // gancho: riser hasta \"1 Million\"",
  "CUES.push({ t: .25, s: 'riser', g: .9, d: +(st(2) - .3).toFixed(3) }); CUES.push({ t: st(2) - .02, s: 'braam', g: 1 });   // gancho")
tail = tail.replace("T < st(7)", "T < st(2)").replace("clamp(T / st(7))", "clamp(T / st(2))")
tail = tail.replace("  composer.render();", "  sky.sky.position.copy(camera.position); composer.render();")
assert "sky.sky.position.copy" in tail
assert "st(2) - .02" in tail and "T < st(2)" in tail and "t0: s.t0" in tail, 'tail'
COVER = open('cover.js').read()
parts = [head, h2, open('body_sets.js').read(), open('body_util.js').read(), '// ---------- capa 2D ----------', two, key, cap, open('body_shots.js').read(), tail, COVER]
open('main.js', 'w').write('\n'.join(parts) + '\n'); print('ok')
