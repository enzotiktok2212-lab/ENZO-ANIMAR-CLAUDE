// Tür — reparto propio y los Fellriesen.
// Narrador (12): piel morena, rizos negros cortos, impermeable rojo con capucha, vaqueros, botas de agua amarillas, mochila verde con parches.
// Mila (6): coletas pelirrojas con lazos azules, peto vaquero sobre camiseta de rayas rojas y blancas.
// Mama: delantal de flores, pañuelo verde. Herr Fuchs: chaleco de punto verde, gorra de cuadros, bastón. Su madre: gafas redondas, chal lila, moño gris.
// Fellriesen: pelo gris ceniza enmarañado con mechones de musgo, brazos larguísimos, flequillo que tapa los ojos, sonrisa enorme de dientes humanos planos.
import { THREE, mat, box, cyl, sphere, canvasTex, checkTex, character, CUSTOM_FACES, RNG, faceTexture } from './engine.js';
import { mk, hairS, glasses } from './props.js';
import { robloxify } from './roblox.js';

const knit = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 2; for (let x = 0; x < w; x += 8) for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y + 6); c.lineTo(x + 8, y); c.stroke(); } }, true);
const stripesT = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let y = 0; y < h; y += 12) c.fillRect(0, y, w, 6); }, true);
const floral = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#f4e8d0'; c.fillRect(0, 0, w, h); const r = RNG(3); for (let i = 0; i < 14; i++) { const x = r() * w, y = r() * h; c.fillStyle = ['#e8607a', '#f2c23a', '#7ab8e8'][i % 3]; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + Math.cos(k * 1.256) * 3, y + Math.sin(k * 1.256) * 3, 2.4, 0, 7); c.fill(); } } }, true);
function curlsShort(col) { return (h) => { const m = mat(col, { roughness: .7 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.03, .62, 1.03); h.add(c); const r = RNG(21);
  for (let i = 0; i < 26; i++) { const a = r() * 6.283, y = 1.05 + r() * .35, rr = .5 + r() * .18; if (Math.sin(a) > .6 && y < 1.15) continue; sphere(.17 + r() * .06, m, h, Math.cos(a) * rr, y, Math.sin(a) * rr, 8, 6); } }; }
function pigtails(col, bow) { return (h) => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.03, .64, 1.03); h.add(c);
  box(1.36, .3, .28, m, .12, h, 0, 1.1, .5); for (const s of [-1, 1]) { const t = new THREE.Group(); t.position.set(s * .8, .95, -.1); h.add(t); sphere(.3, m, t, s * .2, -.2, 0, 12, 10); const tail = cyl(.2, .1, .9, m, 10, t, s * .3, -.7, 0); tail.rotation.z = s * .3; const b = box(.5, .25, .15, mat(bow), .08, t, 0, .05, .05); } }; }
function hood(col) { return o => { const m = mat(col, { roughness: .4 }); const hd = box(1.6, .9, .7, m, .3, o.spine, 0, 2.05, -.62); hd.rotation.x = .35; }; }
function raincoat(sp) { const m = mat(0xd8283a, { roughness: .35, metalness: .05 }); box(2.12, 2.1, 1.14, m, .14, sp, 0, 1.0, 0); for (let i = 0; i < 4; i++) box(.2, .14, .06, mat(0xf2c23a), .03, sp, .32, .4 + i * .44, .6); for (const s of [-1, 1]) box(.6, .45, .08, mat(0xb81e2e), .05, sp, s * .55, .45, .6); box(.06, 1.9, .05, mat(0x8a1420), 0, sp, 0, 1.0, .59); }
function backpackG(o) { const g = new THREE.Group(); g.position.set(0, 1.0, -.78); o.spine.add(g); const m = mat(0x2f8a4a, { roughness: .8 }); box(1.7, 1.9, .75, m, .28, g, 0, 0, 0); box(1.4, .7, .25, m, .12, g, 0, -.35, -.45); box(1.72, .5, .78, mat(0x1f6a3a), .14, g, 0, .8, 0);
  for (const [x, y, c] of [[-.4, -.2, 0xf2c23a], [.45, .3, 0x2a6ad8], [.3, -.5, 0xff7a2a]]) box(.4, .4, .06, mat(c), .08, g, x, y, -.4); for (const s of [-1, 1]) { box(.24, 1.9, .08, mat(0x1f4a2a), .03, o.spine, s * .55, 1.05, .6); box(.3, .7, .3, mat(0x1f4a2a), .1, g, s * .9, .2, .2); } o.props.pack = g; }
export function makeKid(scene) {
  return mk(scene, { seed: 601, scale: .84, skin: 0x8d5a3b, skinCss: '#8d5a3b', shirt: 0xd8283a, shirt2: 0xd8283a, cuffs: 0xb81e2e, pants: 0x3a5a8e, shoes: 0xf2c23a, sole: 0x3a3a3a, socks: 0xf2c23a, hair: 0x141414, hairBuild: curlsShort(0x141414), noBelt: true, torsoDetail: raincoat,
    face: { iris: '#3a2210', browColor: '#141414', blush: .15 } }, [hood(0xd8283a), backpackG, o => { for (const lg of [o.lL, o.lR]) { box(1.0, .9, 1.02, mat(0xf2c23a, { roughness: .3 }), .1, lg.kn, 0, -.5, 0); } }]);
}
export function makeMila(scene) {
  return mk(scene, { seed: 602, scale: .62, headScale: 1.08, skin: 0x8d5a3b, skinCss: '#8d5a3b', shirtMap: stripesT('#f4f4f4', '#d8323a'), shirt2: null, cuffs: 0xf4f4f4, pants: 0x4a78b8, shoes: 0x8d5a3b, sole: 0x7a4a2e, hair: 0xd8642a, hairBuild: pigtails(0xd8642a, 0x2a7ad8), noBelt: true,
    torsoDetail: sp => { const d = mat(0x4a78b8, { roughness: .8 }); box(1.6, 1.2, 1.12, d, .1, sp, 0, .55, 0); for (const s of [-1, 1]) { box(.24, 1.2, .06, d, .02, sp, s * .5, 1.5, .58); sphere(.08, mat(0xf2c23a, { metalness: .7 }), sp, s * .5, 1.95, .62, 8, 6); } box(.6, .4, .05, d, .03, sp, 0, .9, .58); },
    face: { iris: '#3a2210', browColor: '#a8481a', freckles: 1, blush: .5 } });
}
export function makeMom(scene) {
  return mk(scene, { seed: 603, skin: 0xa86a42, skinCss: '#a86a42', shirt: 0x6a8ab8, shirt2: 0x6a8ab8, pants: 0x4a3a5a, skirt: 0x4a3a5a, apron: 0xf4e8d0, shoes: 0x3a2a1a, hair: 0x1a1210, hairBuild: hairS(0x1a1210, 'bun'),
    face: { iris: '#2a1608', browColor: '#1a1210', blush: .2 } }, [o => { const m = mat(0x2f8a5a, { roughness: .8 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.76, 24, 12, 0, 6.283, 0, 1.25), m); c.position.y = 1.02; c.scale.set(1.04, .7, 1.06); o.head.add(c); box(.5, .4, .2, m, .1, o.head, .4, .7, -.7); },
    o => { const a = box(1.5, 1.6, .08, new THREE.MeshStandardMaterial({ map: floral }), .04, o.spine, 0, .9, .6); }]);
}
export function makeFuchs(scene) {
  return mk(scene, { seed: 604, scale: 1.0, skin: 0xf2c8a8, skinCss: '#f2c8a8', shirt: 0xf4f0e6, shirt2: 0xf4f0e6, pants: 0x5a4a3a, shoes: 0x3a2a1a, hair: 0xd8d8d8, hairBuild: hairS(0xd8d8d8, 'bald'),
    torsoDetail: sp => { const v = mat(0xffffff, { map: knit('#3a7a4a', 'rgba(0,0,0,.18)') }); for (const s of [-1, 1]) box(.72, 1.8, 1.12, v, .1, sp, s * .66, .95, 0); box(2.06, 1.8, .5, v, .1, sp, 0, .95, -.32); for (let i = 0; i < 4; i++) sphere(.07, mat(0x5a3a1a), sp, .32, .35 + i * .35, .6, 8, 6); },
    face: { iris: '#4a6a8a', browColor: '#d8d8d8', bags: .5 } }, [o => { const m = mat(0xffffff, { map: checkTex('#8a6a4a', '#5a4430', 6) }); box(1.5, .36, 1.42, m, .18, o.head, 0, 1.28, -.02); const pk = box(1.3, .12, .6, m, .06, o.head, 0, 1.12, .84); pk.rotation.x = .18; for (const s of [-1, 1]) box(.3, .35, .3, mat(0xd8d8d8), .1, o.head, s * .68, .8, -.1); },
    o => { const c = cyl(.08, .08, 3.6, mat(0x5a3a1e), 8, o.aR.hand, 0, -1.6, .2); const h = new THREE.Mesh(new THREE.TorusGeometry(.3, .08, 6, 12, Math.PI), mat(0x5a3a1e)); h.position.set(.3, .1, .2); o.aR.hand.add(h); o.props.cane = c; }]);
}
export function makeOma(scene) {
  return mk(scene, { seed: 605, scale: .92, skin: 0xf2d0b8, skinCss: '#f2d0b8', shirt: 0xb898d8, shirt2: 0xb898d8, pants: 0x5a4a6a, skirt: 0x5a4a6a, shoes: 0x3a2a3a, hair: 0xc8c8cc, hairBuild: hairS(0xc8c8cc, 'bun'),
    face: { iris: '#5a7a9a', browColor: '#c8c8cc', blush: .3 } }, [o => glasses(o.head), o => { const s = box(2.3, .8, 1.3, mat(0x9a6ac8, { roughness: 1, map: knit('#9a6ac8', 'rgba(0,0,0,.2)') }), .3, o.spine, 0, 1.8, 0); }]);
}
// ---------- Fellriesen: larguiruchos, encorvados, creepy (rig propio, compatible con applyPose) ----------
CUSTOM_FACES.creep = (c, s) => { const open = s.open || 0; c.clearRect(0, 0, 512, 512);
  // piel negra con brillo húmedo y venas
  
  c.strokeStyle = 'rgba(70,20,24,.55)'; c.lineWidth = 3; const r = RNG(77); for (let k = 0; k < 14; k++) { let x = r() * 512, y = r() * 200; c.beginPath(); c.moveTo(x, y); for (let q = 0; q < 5; q++) { x += (r() - .5) * 40; y += 14 + r() * 18; c.lineTo(x, y); } c.stroke(); }
  // cuencas hundidas, bordes rojizos, pupila blanca diminuta que brilla
  for (const x of [176, 336]) { const g = c.createRadialGradient(x, 175, 2, x, 175, 78); g.addColorStop(0, '#000'); g.addColorStop(.55, '#050303'); g.addColorStop(.8, 'rgba(110,20,24,.85)'); g.addColorStop(1, 'rgba(12,10,10,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, 175, 78, 62, x < 256 ? -.25 : .25, 0, 7); c.fill();
    const p = c.createRadialGradient(x + (x < 256 ? 6 : -6), 178, 0, x, 178, 17); p.addColorStop(0, '#ffffff'); p.addColorStop(.3, 'rgba(255,252,240,1)'); p.addColorStop(.55, 'rgba(255,240,220,.45)'); p.addColorStop(1, 'rgba(255,240,220,0)'); c.fillStyle = p; c.beginPath(); c.arc(x, 178, 17, 0, 7); c.fill(); }
  // sonrisa de oreja a oreja: encías rojas y dientes humanos planos amarillentos
  const y0 = 335, h0 = 72 + open * 120; c.fillStyle = '#2a0406'; c.beginPath(); c.moveTo(28, y0 - 60); c.quadraticCurveTo(256, y0 + 40, 484, y0 - 60); c.quadraticCurveTo(256, y0 + h0 + 46, 28, y0 - 60); c.fill();
  c.save(); c.clip(); c.fillStyle = '#7a1418'; c.fillRect(0, y0 - 80, 512, 50);
  for (let i = 0; i < 17; i++) { const x = 40 + i * 25.5, t = 1 - Math.pow((x + 12 - 256) / 228, 2); const top = y0 - 60 + 100 * t * .5; c.fillStyle = ['#e8dcb0', '#d8c890', '#efe6c4'][i % 3]; c.beginPath(); c.roundRect(x, top - 4, 23, 42, 4); c.fill(); c.strokeStyle = '#5a4428'; c.lineWidth = 2; c.stroke();
    const bot = top + 34 + open * 96 + 34 * t; c.fillStyle = ['#e0d4a8', '#efe6c4', '#cfc08a'][i % 3]; c.beginPath(); c.roundRect(x + 1, bot, 22, 40, 4); c.fill(); c.stroke(); }
  c.fillStyle = 'rgba(200,220,230,.6)'; for (const x of [150, 300, 380]) { c.fillRect(x, y0 + 20 + open * 60, 5, 30 + open * 30); } c.restore();
  c.strokeStyle = '#000'; c.lineWidth = 7; c.beginPath(); c.moveTo(28, y0 - 60); c.quadraticCurveTo(256, y0 + 40, 484, y0 - 60); c.stroke(); for (const s2 of [-1, 1]) { c.beginPath(); c.moveTo(256 + s2 * 228, y0 - 60); c.lineTo(256 + s2 * 246, y0 - 88); c.stroke(); } };
const FURS = [[0x111010, 0x0e0c0c], [0x141212, 0x100e0e], [0x0f0e0e, 0x121010]];
export function makeBeast(scene, i = 0, sc = 3.6) { const [furHex, skinHex] = FURS[i % 3]; const r = RNG(60 + i);
  const fur = mat(furHex, { roughness: .95 }), skin = mat(skinHex, { roughness: .25, metalness: .25 }), dark = mat(0x2a0a0c, { roughness: .6 }), nail = mat(0x8a7a5a, { roughness: .4 });
  const root = new THREE.Group(); scene.add(root); const hips = new THREE.Group(); hips.position.y = 2.05; root.add(hips); const spine = new THREE.Group(); hips.add(spine);
  const limb = (parent, len, rTop, rBot, m, y0 = 0) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, len, 8), m); c.position.y = y0 - len / 2; parent.add(c); return c; };
  // torso: pecho estrecho y costillas marcadas, joroba
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(.42, .26, 1.5, 10), skin); chest.position.set(0, .8, 0); chest.scale.z = .62; spine.add(chest);
  for (let k = 0; k < 5; k++) { const rib = new THREE.Mesh(new THREE.TorusGeometry(.36 - k * .02, .03, 4, 14, Math.PI), dark); rib.position.set(0, 1.1 - k * .14, .12); rib.rotation.set(0, 0, Math.PI); rib.scale.set(1, .5, 1); spine.add(rib); }
  const hump = new THREE.Mesh(new THREE.SphereGeometry(.42, 12, 10), fur); hump.position.set(0, 1.45, -.18); hump.scale.set(1.1, .9, .8); spine.add(hump);
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(.3, 10, 8), fur); pelvis.scale.set(1.1, .6, .7); spine.add(pelvis);
  // cuello largo y cabeza alargada
  const neck = new THREE.Group(); neck.position.set(0, 1.62, .05); spine.add(neck); const nk = limb(neck, .55, .1, .13, skin, .55); nk.position.y = .27;
  const head = new THREE.Group(); head.position.y = .52; neck.add(head); const hm = new THREE.Mesh(new THREE.SphereGeometry(.42, 18, 14), skin); hm.scale.set(.86, 1.42, .86); hm.position.y = .42; head.add(hm);
  const ft0 = faceTexture({ custom: 'creep', open: 0 }); const faceMat = new THREE.MeshStandardMaterial({ map: ft0, emissive: 0xffffff, emissiveMap: ft0, emissiveIntensity: .9, transparent: true, roughness: .3, metalness: .2, polygonOffset: true, polygonOffsetFactor: -2 });
  const face = new THREE.Mesh(new THREE.CylinderGeometry(.385, .385, .95, 24, 1, true, -1.0, 2.0), faceMat); face.position.y = .42; face.scale.set(.96, 1, 1.0); face.scale.set(.96, 1, 1.0); head.add(face);
  // brazos larguísimos y finos con dedos largos
  const arm = (s) => { const sh = new THREE.Group(); sh.position.set(s * .42, 1.42, 0); spine.add(sh); sphere(.12, skin, sh, 0, 0, 0, 8, 6); limb(sh, 1.25, .08, .07, skin, 0);
    const el = new THREE.Group(); el.position.y = -1.25; sh.add(el); sphere(.08, skin, el, 0, 0, 0, 8, 6); limb(el, 1.2, .07, .05, skin, 0); const hand = new THREE.Group(); hand.position.y = -1.2; el.add(hand); const palm = box(.16, .22, .08, skin, .03, hand, 0, -.08, 0);
    for (let f = 0; f < 4; f++) { const fg = new THREE.Group(); fg.position.set(-.06 + f * .04, -.18, 0); fg.rotation.z = (f - 1.5) * .12; hand.add(fg); limb(fg, .42 + (f === 1 || f === 2 ? .08 : 0), .018, .012, skin, 0); const n = new THREE.Mesh(new THREE.ConeGeometry(.018, .06, 4), nail); n.position.y = -.48; n.rotation.x = Math.PI; fg.add(n); fg.rotation.x = .25; }
    for (let k = 0; k < 7; k++) { const st = new THREE.Mesh(new THREE.ConeGeometry(.03, .45 + r() * .4, 4), fur); st.position.set((r() - .5) * .14, -.3 - r() * .9, (r() - .5) * .14); st.rotation.x = Math.PI; sh.add(st); }
    return { sh, el, hand }; };
  const leg = (s) => { const hp = new THREE.Group(); hp.position.set(s * .2, 0, 0); hips.add(hp); limb(hp, 1.02, .1, .07, fur, 0); const kn = new THREE.Group(); kn.position.y = -1.0; hp.add(kn); sphere(.08, skin, kn, 0, 0, 0, 8, 6); limb(kn, 1.0, .07, .045, skin, 0);
    const foot = box(.14, .06, .5, skin, .02, kn, 0, -1.02, .16); for (let f = 0; f < 3; f++) { const t = new THREE.Mesh(new THREE.ConeGeometry(.02, .14, 4), nail); t.position.set(-.04 + f * .04, -1.04, .45); t.rotation.x = Math.PI / 2; kn.add(t); }
    for (let k = 0; k < 6; k++) { const st = new THREE.Mesh(new THREE.ConeGeometry(.035, .4 + r() * .3, 4), fur); st.position.set((r() - .5) * .18, -.25 - r() * .7, (r() - .5) * .18); st.rotation.x = Math.PI; hp.add(st); } return { hp, kn, shoe: foot }; };
  // mechones colgando de hombros y espalda
  for (let k = 0; k < 24; k++) { const hh = .6 + r() * .7; const st = new THREE.Mesh(new THREE.ConeGeometry(.045, hh, 4), fur); const a = r() * 6.283; st.position.set(Math.cos(a) * .36, 1.55 - hh / 2 - r() * .3, Math.sin(a) * .26); st.rotation.set(Math.PI + (r() - .5) * .3, 0, (r() - .5) * .3); spine.add(st); }
  const aL = arm(-1), aR = arm(1), lL = leg(-1), lR = leg(1);
  root.scale.setScalar(sc * (.95 + (i % 3) * .05));
  const spec = { scale: root.scale.x, skinCss: '#c8c2b8' };
  const o = { root, hips, spine, neck, head, face, faceMat, aL, aR, lL, lR, spec, props: {}, seed: 700 + i, isBeast: true };
  o.setFace = (f) => { const t = faceTexture({ custom: 'creep', open: Math.round((f.open || 0) * 10) / 10 }); if (faceMat.map !== t) { faceMat.map = t; faceMat.emissiveMap = t; faceMat.needsUpdate = true; } };
  o.unmask = null; root.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; }
