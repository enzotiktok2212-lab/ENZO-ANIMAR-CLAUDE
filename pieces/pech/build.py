# Construye src/main.js a partir de bloques reutilizados de Bodensteuer (ciudad, dormitorio, capa 2D, render) y de los body_*.js de esta pieza.
import re
import os; os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))
B = open('../../bodensteuer/src/main.js').read().split('\n'); L = lambda a, b: '\n'.join(B[a - 1:b])
head = """// Pech — ~72 planos sincronizados con audio/words.json (1080×1920, 30 fps).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane, checkTex } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, noiseTex, stripes, screen, txt, building, skyscraper, tree, lamp, hydrant, bench, fountain, pool, makeExtra, limo, phoneProp } from './props.js';
import { B, gold, glass, label, makeFinn, makeBuddy, makeLightningMan, makeTycoon, makeDriver, makeBusDriver, makeMechanic, makeOfficer, makeClerkL, makeBanker, bus, sportsCar, jet, villa, rainSet, stormCloud, bolt, rainbow, suburb, country, lottoBooth, pechAmtFront, pechAmtIn, bath, vault, freeCard, ticket, wrench, phoneFall } from './pech.js';
"""
h2 = L(9, 20).replace('const DUR = 121.5', 'const DUR = 125.79').replace('sun.shadow.mapSize.set(4096, 4096)', 'sun.shadow.mapSize.set(2048, 2048)')
city = L(22, 33) + '\n' + L(36, 39)
bed = L(53, 57).replace('const BX = 1000, KX = 1100, WX = 1200, OX = 1300, SX = 1400;', 'const BX = 1000;') + '\n' + L(58, 67)
bed = bed.replace("const L = new THREE.PointLight(0xffe8c8, 500, 70, 2); L.position.set(0, 18, 4); g.add(L); }",
  "const L = new THREE.PointLight(0xffe8c8, 500, 70, 2); L.position.set(0, 18, 4); g.add(L); BED.userData.L = L;\n"
  "  const night = textPlane(9, 7, 180, 140, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#0a1240'); s.addColorStop(1, '#2a3a8a'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; for (let i = 0; i < 40; i++) c.fillRect((i * 53) % w, (i * 37) % (h * .7), 2, 2); c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(140, 36, 18, 0, 7); c.fill(); }, .5); night.position.set(2, 12, -13.55); g.add(night); BED.userData.night = night;\n"
  "  const ns2 = new THREE.Group(); ns2.position.set(0, 0, -9); g.add(ns2); box(3.4, 4.4, 3, mat(0xd8a868), .2, ns2, 0, 2.2, 0); cyl(.5, .7, .4, mat(0xff8a23), 12, ns2, -.8, 4.6, -.6); cyl(.08, .08, 1.6, mat(0x333333), 6, ns2, -.8, 5.6, -.6); cyl(.6, 1, 1, mat(0xfff4c0, { emissive: 0xffc870, emissiveIntensity: .5 }), 16, ns2, -.8, 6.6, -.6);\n"
  "  const lampL = new THREE.PointLight(0xffb060, 0, 30, 2); lampL.position.set(-.8, 7, -8); g.add(lampL); BED.userData.lampL = lampL; }")
assert 'lampL' in bed
badge2d = L(169, 180)
cap = L(183, 189)
tail = '\n'.join(B[373:])
tail = tail.replace("CUES.push({ t: .05, s: 'riser', g: .9, d: 3.3 }); CUES.push({ t: 3.42, s: 'braam', g: 1 });   // gancho",
  "CUES.push({ t: .25, s: 'riser', g: .9, d: +(st(7) - .3).toFixed(3) }); CUES.push({ t: st(7) - .02, s: 'braam', g: 1 });   // gancho: riser hasta \"1 Million\"")
tail = tail.replace("if (s.zoom === 'slow' || (i === 0 || i === 1)) { const e = s.zoom === 'slow' ? easeI", "if (s.zoom === 'slow' || T < st(7)) { const e = s.zoom === 'slow' ? easeI")
tail = tail.replace("easeIn(clamp(T / 3.4))", "easeIn(clamp(T / st(7)))")
tail = tail.replace("L = { lt, k: clamp(lt / d), T, d, t1: s.t1 }", "L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 }")
assert "t0: s.t0" in tail
assert "st(7) - .02" in tail and "T < st(7)" in tail, 'tail'
key = r"""const KEY = /^(Stadt|bezahlt|Pech|Bus|100|Euro|Regen|500|Haus|zerstört|1|Million|Pechvögel|Reichsten|Nachbar|dreimal|Blitz|Villa|reichste|Privatjet|Pool|50|Millionen|ich|Finn|Problem|nie|Gutes|Schulbus|Endlich|Limousine|umsonst|0|Gewitter|klitschnass|Regenbogen|Lotterielos|verlieren|Jackpot|Kind|gesperrten|Sparkonto|pleite|Freund|Handy|Klo|10000|10\.000|Sportwagen|reicht's|Pech-Amt|Gesicht|lachen|0%|fassen|letztes|Bus|Motor|Mechaniker|10|Sekunden|Freikarte|lebenslange|geschlagen|reich|perfekt|Schlechtes|Handy|Nachricht|Glückwunsch|Pechvogel|erstarre|Glück|Milliarde|Konto|froh)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);"""
parts = [head, h2, '// ---------- ciudad ----------', city, bed, open('body_sets.js').read(), open('body_util.js').read(), '// ---------- capa 2D ----------', badge2d, key, cap, open('body_shots.js').read(), tail]
open('main.js', 'w').write('\n'.join(parts) + '\n')
print('ok', sum(p.count('\n') for p in parts))
