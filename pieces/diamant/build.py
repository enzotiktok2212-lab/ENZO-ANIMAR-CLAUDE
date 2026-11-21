# Construye src/main.js: cabecera, capa 2D y render de Pech + escenarios y planos propios (body_*.js).
import os, re; os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))
P = open('../../pech/src/main.js').read().split('\n'); L = lambda a, b: '\n'.join(P[a - 1:b])
head = """// Diamant — ~69 planos sincronizados con audio/words.json (1080×1920, 30 fps).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane, checkTex } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, noiseTex, stripes, screen, txt, tree, makeExtra } from './props.js';
import { B, gold, glass, label, makeMats, makeGrimm, makeMayor, makeNoble, makeLady, makeBeggar, makeSuitor, makeGirl, makeSweeper2, town, desert, classroom, tankIn, tank, diamondRain, crowd, rubberSheet, chest, loaf, cat, shovel, carriage, pencil } from './diam.js';
"""
h2 = L(9, 20).replace('const DUR = 125.79', 'const DUR = 119.46')
two = L(156, 167)
cap = '\n'.join(l for l in P[169:175])
key = r"""const KEY = /^(Stadt|Diamanten|wertlos|300|Kilometer|Himmel|tödliche|Kugeln|Sirenen|Bunker|verkehrt|Reiche|Holzknöpfen|Brot|Bettler|Katzen|faustgroßen|Bleistift|Antrag|geweint|Holz|Villa|Mats|16|Diamantenkehrer|Millionen|Gully|Kutschen|Gummi|Metall|zerspringt|Baron|Grimm|Wüste|regnet|reichste|Königreich|Panzer|Marktplatz|50|Tonnen|Mittag|brenne|Bürgermeister|Müllkippe|Müll|gedemütigt|500|schwarz|Taifun|Bowlingkugeln|lachte|wertlosen|zerquetschen|Panik|abprallen|Gummiband|Mühle|Menge|Himmel|Ping|Trampolin|zurück|Bumm|Milliarden|Grimms|Krach|Stahl|Papier|explodierte|Umhang|Fetzen|nie|Truhe|10\.000|gerettet|Vermögen|lächelte|Sauerteigbrot|Held|50-Karat-Diamanten)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);"""
tail = '\n'.join(P[426:])
tail = tail.replace("CUES.push({ t: .25, s: 'riser', g: .9, d: +(st(7) - .3).toFixed(3) }); CUES.push({ t: st(7) - .02, s: 'braam', g: 1 });   // gancho: riser hasta \"1 Million\"",
  "CUES.push({ t: .25, s: 'riser', g: .9, d: +(st(2) - .3).toFixed(3) }); CUES.push({ t: st(2) - .02, s: 'braam', g: 1 });   // gancho: riser hasta \"Denn wenn…\"")
tail = tail.replace("T < st(7)", "T < st(2)").replace("clamp(T / st(7))", "clamp(T / st(2))")
assert "st(2) - .02" in tail and "T < st(2)" in tail and "t0: s.t0" in tail, 'tail'
parts = [head, h2, open('body_sets.js').read(), open('body_util.js').read(), '// ---------- capa 2D ----------', two, key, cap, open('body_shots.js').read(), tail]
open('main.js', 'w').write('\n'.join(parts) + '\n'); print('ok')
