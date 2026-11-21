// Gesichter — reparto propio (nada calcado de la referencia).
// Narrador (sudadera verde con parche de zorro, rizos castaños, mochila con la radio), Lenny (gafas redondas,
// camiseta de rugby azul marino, flequillo negro, lápiz en la oreja), Mama (trenza rubia, pañuelo rojo, chaleco de lana),
// Papa (barba pelirroja, gorro mostaza, abrigo de leñador), Herr Brandt (calvo, bigote blanco, tirantes verdes),
// cazadores (capa gris con capucha y farol), vecinos variados. Cualquiera puede "quitarse la cara" (unmask).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, checkTex, CUSTOM_FACES, faceTexture, RNG } from './engine.js';
import { mk, hairS, hoodie, jacket, suit, glasses, mustache, cap, FONT, txt } from './props.js';

// ---------- caras especiales ----------
// "Maul": cabeza negra y mojada, sin ojos, con una boca enorme de dientes.
CUSTOM_FACES.maul = (c, s) => { const open = s.open ?? .6; c.clearRect(0, 0, 512, 512);
  const g = c.createRadialGradient(200, 150, 10, 256, 260, 300); g.addColorStop(0, 'rgba(70,80,95,.9)'); g.addColorStop(.25, 'rgba(10,12,16,.95)'); g.addColorStop(1, 'rgba(0,0,0,1)'); c.fillStyle = g; c.fillRect(0, 0, 512, 512);
  for (const [x, y, r] of [[150, 110, 26], [330, 90, 16], [210, 70, 10], [400, 170, 12]]) { c.fillStyle = 'rgba(200,220,255,.35)'; c.beginPath(); c.ellipse(x, y, r, r * .5, -.5, 0, 7); c.fill(); }
  const my = 300, rx = 200, ry = 40 + 150 * open; c.fillStyle = '#3a0408'; c.beginPath(); c.ellipse(256, my, rx, ry, 0, 0, 7); c.fill();
  c.fillStyle = '#7a0a14'; c.beginPath(); c.ellipse(256, my + ry * .5, rx * .55, ry * .35, 0, 0, 7); c.fill();
  c.fillStyle = '#f2ecd8'; c.save(); c.beginPath(); c.ellipse(256, my, rx, ry, 0, 0, 7); c.clip();
  for (let i = 0; i < 13; i++) { const x = 256 - rx + i * rx * 2 / 12; const top = my - ry * Math.sqrt(Math.max(0, 1 - ((x - 256) / rx) ** 2)); c.beginPath(); c.moveTo(x - 15, top - 2); c.lineTo(x + 15, top - 2); c.lineTo(x, top + 36 + (i % 2) * 14); c.fill();
    const bot = my + ry * Math.sqrt(Math.max(0, 1 - ((x - 256) / rx) ** 2)); c.beginPath(); c.moveTo(x - 15, bot + 2); c.lineTo(x + 15, bot + 2); c.lineTo(x, bot - 32 - (i % 2) * 12); c.fill(); }
  c.restore(); c.strokeStyle = 'rgba(160,190,220,.5)'; c.lineWidth = 5; c.beginPath(); c.ellipse(256, my, rx + 3, ry + 3, 0, 3.6, 5.8); c.stroke();
  c.fillStyle = 'rgba(180,200,230,.55)'; for (const [x, y, l] of [[120, 340, 60], [390, 330, 80], [300, 420, 50]]) { c.fillRect(x - 4, y, 8, l); c.beginPath(); c.arc(x, y + l, 7, 0, 7); c.fill(); } };
// cara "copiada": sonrisa algo demasiado ancha, ojos fijos (el pueblo)
const copyFace = (extra = {}) => ({ mouth: 'grin', eyes: 'open', look: [0, 0], blush: 0, ...extra });

const BLACK = () => mat(0x07080b, { roughness: .12, metalness: .35, emissive: 0x05060a });
// quitar / poner la cara: k=0 cara normal, k=1 cabeza negra con boca
function addUnmask(o) {
  const lathe = o.head.children.find(c => c.isMesh && c.geometry && c.geometry.type === 'LatheGeometry');
  const skinM = lathe ? lathe.material : null, blk = BLACK();
  const hair = o.head.children.filter(c => c !== lathe && c !== o.face && !(c.isMesh && c.material === skinM));
  o.unmask = (k, open = .6) => { const on = k > .5; if (lathe) lathe.material = on ? blk : skinM; hair.forEach(h => h.visible = !on);
    if (on) { o.face.material.map = faceTexture({ custom: 'maul', open: Math.round(open * 10) / 10 }); o.face.material.needsUpdate = true; o._masked = true; }
    else if (o._masked) { o._masked = false; o.setFace({}); } };
  return o;
}
const M = (scene, spec, acc = []) => addUnmask(mk(scene, spec, acc));

// ---------- accesorios ----------
const brass = () => mat(0xc89a3a, { metalness: .75, roughness: .3 });
export function radio(parent, s = 1) { const g = new THREE.Group(); g.scale.setScalar(s); parent.add(g);
  box(1.3, .9, .55, mat(0x4a5a3a, { roughness: .55 }), .1, g, 0, 0, 0); box(1.1, .5, .05, mat(0x1a1e18), .03, g, -.05, .05, .29);
  for (let i = 0; i < 5; i++) box(.06, .38, .02, mat(0x5a6a48), 0, g, -.45 + i * .12, .05, .31);
  const dial = cyl(.13, .13, .08, brass(), 16, g, .42, .12, .3); dial.rotation.x = Math.PI / 2; const d2 = cyl(.09, .09, .08, mat(0x222222), 12, g, .42, -.2, .3); d2.rotation.x = Math.PI / 2;
  const led = sphere(.05, new THREE.MeshBasicMaterial({ color: 0xff3a2a, toneMapped: false }), g, .42, .33, .3, 8, 6); g.userData.led = led;
  const ant = cyl(.025, .03, 1.6, mat(0x9aa0a8, { metalness: .8, roughness: .25 }), 6, g, -.5, .9, 0); ant.rotation.z = .25; sphere(.06, mat(0x9aa0a8, { metalness: .8 }), g, -.7, 1.68, 0, 8, 6);
  box(1.0, .12, .12, mat(0x2a2a2a), .05, g, 0, .52, 0); return g; }
function backpack(col) { return o => { const g = new THREE.Group(); g.position.set(0, 1.0, -.75); o.spine.add(g); const m = mat(col, { roughness: .85 });
  box(1.6, 1.8, .7, m, .25, g, 0, 0, 0); box(1.3, .7, .22, m, .12, g, 0, -.35, -.42); box(1.62, .5, .74, mat(0x4a2e1a), .12, g, 0, .78, 0); box(.3, .2, .2, brass(), .05, g, 0, .5, -.38);
  const ant = cyl(.025, .03, 1.5, mat(0x9aa0a8, { metalness: .8 }), 6, g, .55, 1.4, 0); ant.rotation.z = -.15; sphere(.06, mat(0x9aa0a8, { metalness: .8 }), g, .66, 2.15, 0, 8, 6);
  for (const s of [-1, 1]) { box(.24, 1.9, .08, mat(0x4a2e1a), .03, o.spine, s * .55, 1.05, .56); } o.props.pack = g; }; }
const foxPatch = canvasTex(64, 64, (c) => { c.fillStyle = '#f2ead8'; c.beginPath(); c.arc(32, 32, 30, 0, 7); c.fill(); c.fillStyle = '#e8762a'; c.beginPath(); c.moveTo(12, 14); c.lineTo(24, 26); c.lineTo(40, 26); c.lineTo(52, 14); c.lineTo(50, 36); c.lineTo(32, 52); c.lineTo(14, 36); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(20, 38); c.lineTo(32, 50); c.lineTo(44, 38); c.lineTo(32, 42); c.fill(); c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(25, 32, 3, 0, 7); c.arc(39, 32, 3, 0, 7); c.fill(); c.beginPath(); c.arc(32, 49, 3, 0, 7); c.fill(); });
const rugby = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let y = 0; y < h; y += 16) c.fillRect(0, y + 10, w, 6); }, true);
const knit = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 2; for (let x = 0; x < w; x += 8) for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y + 6); c.lineTo(x + 8, y); c.stroke(); } }, true);
const flannel = (a, b) => checkTex(a, b, 4, '#111');
function curlyHair(col) { return (h) => { const m = mat(col, { roughness: .7 }); const capM = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.3), m); capM.position.y = 1.0; capM.scale.set(1.04, .66, 1.04); h.add(capM);
  const r = RNG(5); for (let i = 0; i < 26; i++) { const a = r() * 6.283, y = 1.05 + r() * .45, rr = .52 + r() * .2; if (Math.sin(a) > .55 && y < 1.2) continue; sphere(.2 + r() * .1, m, h, Math.cos(a) * rr, y, Math.sin(a) * rr, 10, 8); }
  for (let i = -2; i <= 2; i++) sphere(.2, m, h, i * .22, 1.18, .55, 10, 8); }; }
function lennyHair(col) { return (h) => { const m = mat(col, { roughness: .35 }); const capM = new THREE.Mesh(new THREE.SphereGeometry(.71, 28, 12, 0, 6.283, 0, 1.35), m); capM.position.y = 1.0; capM.scale.set(1.03, .66, 1.03); h.add(capM);
  box(1.36, .34, .3, m, .12, h, 0, 1.1, .5); box(1.38, .9, .34, m, .14, h, 0, .9, -.5); for (const s of [-1, 1]) box(.22, .6, .9, m, .08, h, s * .66, .9, -.05);
  const p = cyl(.05, .05, .9, mat(0xffc83a), 6, h, .72, .95, .05); p.rotation.x = Math.PI / 2; p.rotation.z = .2; const tip = new THREE.Mesh(new THREE.ConeGeometry(.05, .14, 6), mat(0xf2d2a8)); tip.position.set(.72, .95, .55); tip.rotation.x = Math.PI / 2; h.add(tip); }; }
function braid(col) { return (h) => { const m = mat(col, { roughness: .5 }); const capM = new THREE.Mesh(new THREE.SphereGeometry(.72, 28, 12, 0, 6.283, 0, 1.3), m); capM.position.y = 1.0; capM.scale.set(1.03, .64, 1.03); h.add(capM);
  box(1.38, .7, .3, m, .12, h, 0, .95, -.5); for (let i = 0; i < 6; i++) { const s = sphere(.2 - i * .015, m, h, .55 - i * .02, .5 - i * .26, -.35 + i * .02, 10, 8); s.scale.set(1, 1.15, 1); } sphere(.12, mat(0xd8323a), h, .45, -1.05, -.25, 8, 6);
  for (const s of [-1, 1]) box(.24, .55, .7, m, .1, h, s * .66, .85, -.08); }; }
function beanie(col, y = 1.1) { return o => { const m = mat(col, { roughness: .95, map: knit('#' + col.toString(16).padStart(6, '0'), 'rgba(0,0,0,.15)') }); const c = new THREE.Mesh(new THREE.SphereGeometry(.76, 24, 12, 0, 6.283, 0, 1.4), m); c.position.y = y; c.scale.set(1.0, .85, 1.0); o.head.add(c);
  const brim = cyl(.76, .76, .32, m, 28, o.head, 0, y - .02, 0); sphere(.22, m, o.head, 0, y + .72, 0, 12, 10); }; }
function beard(col) { return o => { const m = mat(col, { roughness: .8 }); box(1.2, .55, .3, m, .14, o.head, 0, .18, .58); for (const s of [-1, 1]) box(.24, .7, .9, m, .08, o.head, s * .6, .45, .2); box(.7, .16, .12, m, .05, o.head, 0, .44, .68); }; }
function hood(col) { return o => { const m = mat(col, { roughness: .95 }); const hd = new THREE.Mesh(new THREE.SphereGeometry(.92, 24, 14, 0, 6.283, 0, 1.75), m); hd.position.set(0, .85, -.12); hd.scale.set(1.0, 1.05, 1.05); o.head.add(hd); box(1.7, .6, .3, m, .12, o.head, 0, 1.55, .3).rotation.x = -.5; }; }
function cloak(col) { return o => { const g = new THREE.Group(); g.position.set(0, 2.0, -.55); o.spine.add(g); const m = mat(col, { roughness: .95, side: THREE.DoubleSide }); box(2.7, 4.2, .14, m, .05, g, 0, -2.0, -.12).rotation.x = .1; for (const s of [-1, 1]) box(.5, 3.8, .14, m, .04, g, s * 1.3, -1.8, .5); o.props.cloak = g; }; }
export function lanternProp(parent) { const g = new THREE.Group(); parent.add(g); const k = mat(0x1a1a1e, { metalness: .7, roughness: .35 }); box(.6, .1, .6, k, .03, g, 0, .5, 0); box(.6, .1, .6, k, .03, g, 0, -.5, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(.03, .03, 1, k, 4, g, sx * .27, 0, sz * .27);
  const fl = sphere(.2, new THREE.MeshBasicMaterial({ color: 0xffc860, toneMapped: false }), g, 0, 0, 0, 10, 8); fl.scale.y = 1.4; const ring = new THREE.Mesh(new THREE.TorusGeometry(.2, .04, 6, 12, Math.PI), k); ring.position.y = .65; g.add(ring);
  const l = new THREE.PointLight(0xffb050, 14, 18, 1.6); g.add(l); g.userData.light = l; return g; }

// ---------- reparto ----------
export function makeHero(scene) {   // narrador (12): rizos castaño oscuro, piel morena clara, sudadera verde bosque con parche de zorro, vaqueros remangados, zapatillas rojas, mochila con radio
  return M(scene, { seed: 401, scale: .84, skin: 0xd9a47a, skinCss: '#d9a47a', shirt: 0x2f6a3e, shirt2: 0x2f6a3e, cuffs: 0x24552f, pants: 0x3a5a8e, shoes: 0xd8323a, sole: 0xf4f4f4, socks: 0xf4f4f4, hair: 0x3a2214, hairBuild: curlyHair(0x3a2214), noBelt: true,
    torsoDetail: sp => { hoodie(0x2f6a3e, 0xf2ead8)(sp); const p = new THREE.Mesh(new THREE.CircleGeometry(.3, 24), new THREE.MeshStandardMaterial({ map: foxPatch })); p.position.set(-.5, 1.4, .575); sp.add(p); },
    face: { iris: '#5a3a1a', browColor: '#2a1608', blush: .2, freckles: 1 } }, [backpack(0x8a5a32), o => { for (const lg of [o.lL, o.lR]) box(1.0, .22, 1.03, mat(0x5a7ab0), .05, lg.kn, 0, -.6, 0); }]);
}
export function makeLenny(scene) {   // Lenny: flequillo negro recto, gafas redondas, camiseta de rugby azul marino con rayas blancas, tirantes rojos, pantalón caqui, lápiz en la oreja; sonrisa demasiado perfecta
  return M(scene, { seed: 402, scale: .86, skin: 0xf3d6c0, skinCss: '#f3d6c0', shirtMap: rugby('#1d2f5a', '#f4f4f4'), shirt2: 0x1d2f5a, cuffs: 0xf4f4f4, pants: 0xb8a070, shoes: 0x5a3a22, sole: 0x2a1a10, hair: 0x14141a, hairBuild: lennyHair(0x14141a), noBelt: true,
    torsoDetail: sp => { for (const s of [-1, 1]) { box(.22, 2.06, .06, mat(0xc8323a), .03, sp, s * .5, 1.02, .56); box(.22, 2.06, .06, mat(0xc8323a), .03, sp, s * .5, 1.02, -.56); sphere(.06, brass(), sp, s * .5, .3, .6, 8, 6); }
      box(1.0, .3, .1, mat(0xf4f4f4), .05, sp, 0, 1.98, .5); box(.25, .5, .06, mat(0xf4f4f4), .02, sp, 0, 1.7, .56); },
    face: { iris: '#3a5a8a', browColor: '#14141a', blush: .3 } }, [o => glasses(o.head)]);
}
export function makeMom(scene) {   // Mama: trenza rubia larga, pañuelo rojo, chaleco de lana gris sobre camisa a cuadros verdes, auriculares de radio
  return M(scene, { seed: 403, skin: 0xf0c8a6, skinCss: '#f0c8a6', shirtMap: flannel('#3a7a4a', '#24502e'), shirt2: null, cuffs: 0x24502e, pants: 0x4a4038, shoes: 0x3a2a1a, hair: 0xe8c86a, hairBuild: braid(0xe8c86a),
    torsoDetail: sp => { const v = mat(0x8a8a90, { roughness: 1, map: knit('#8a8a90', 'rgba(0,0,0,.18)') }); for (const s of [-1, 1]) box(.75, 1.9, 1.12, v, .1, sp, s * .65, .98, 0); box(2.06, 1.9, .5, v, .1, sp, 0, .98, -.32); for (let i = 0; i < 4; i++) sphere(.07, mat(0x5a3a22), sp, .32, .4 + i * .4, .6, 8, 6);
      const sc = box(1.5, .4, 1.2, mat(0xd8323a, { roughness: .9 }), .18, sp, 0, 2.05, 0); const k = box(.5, .7, .1, mat(0xd8323a), .1, sp, .3, 1.7, .6); k.rotation.z = .3; },
    face: { iris: '#4a8a5a', browColor: '#b8963a', blush: .35 } }, [o => { const b = new THREE.Mesh(new THREE.TorusGeometry(.74, .06, 6, 24, Math.PI), mat(0x2a2a2e)); b.position.y = .72; o.head.add(b); for (const s of [-1, 1]) { const e = cyl(.3, .3, .2, mat(0x2a2a2e), 16, o.head, s * .74, .72, 0); e.rotation.z = Math.PI / 2; }
    const mic = cyl(.03, .03, .8, mat(0x2a2a2e), 6, o.head, -.62, .38, .4); mic.rotation.x = 1.2; sphere(.08, mat(0x1a1a1a), o.head, -.55, .25, .78, 8, 6); }]);
}
export function makeDad(scene, copy = false) {   // Papa: barba pelirroja corta, gorro mostaza, abrigo de leñador a cuadros rojos y negros. La "copia": mismo cuerpo, ropa demasiado limpia y sonrisa fija
  return M(scene, { seed: copy ? 405 : 404, scale: 1.06, skin: 0xf2c8a8, skinCss: '#f2c8a8', shirtMap: copy ? checkTex('#c8323a', '#e8e8e8', 4) : flannel('#c8323a', '#1a1a1a'), shirt2: null, cuffs: copy ? 0xe8e8e8 : 0x1a1a1a, pants: copy ? 0x2a3a6a : 0x4a3a2a, shoes: copy ? 0x111111 : 0x5a3a1e, hair: 0xb8521e, hairBuild: hairS(0xb8521e, 'bald'),
    face: copy ? copyFace({ iris: '#3a6a8a', browColor: '#8a3a12' }) : { iris: '#3a6a8a', browColor: '#8a3a12', bags: .4 } }, [beard(0xb8521e), beanie(copy ? 0xe8b83a : 0xd89a2a), o => { if (copy) return; for (const [x, y] of [[-.4, .5], [.5, 1.3]]) box(.4, .35, .06, mat(0x6a4a2a), .03, o.spine, x, y, .56); }]);
}
export function makeBrandt(scene) {   // Herr Brandt: calvo, bigote blanco enorme, camisa amarilla pálida, tirantes verdes, pantalón corto tirolés, calcetines altos
  return M(scene, { seed: 406, scale: 1.0, skin: 0xf6d2b8, skinCss: '#f6d2b8', shirt: 0xf4e8a8, shirt2: 0xf4e8a8, sleeveShort: true, pants: 0x6a4426, shorts: true, socks: 0xf0ece0, shoes: 0x3a2a1a, hair: 0xe8e8e8, hairBuild: hairS(0xe8e8e8, 'bald'),
    torsoDetail: sp => { for (const s of [-1, 1]) { box(.24, 2.05, .06, mat(0x2f6a3e), .03, sp, s * .55, 1.02, .56); box(.24, 2.05, .06, mat(0x2f6a3e), .03, sp, s * .55, 1.02, -.56); } box(1.4, .3, .08, mat(0x2f6a3e), .04, sp, 0, 1.45, .6); },
    face: copyFace({ iris: '#6a6a6a', browColor: '#e8e8e8' }) }, [o => mustache(o.head, 0xf4f4f4), o => { for (const s of [-1, 1]) box(.3, .3, .3, mat(0xe8e8e8), .1, o.head, s * .66, .85, -.1); }]);
}
export function makeBaker(scene) {   // panadero: gorro alto blanco, delantal enharinado, bigote negro, piel oscura
  return M(scene, { seed: 407, skin: 0x8d5a3b, skinCss: '#8d5a3b', shirt: 0xf4f4f4, shirt2: 0xf4f4f4, pants: 0x2a2a30, skirt: null, shoes: 0x1a1a1a, hair: 0x111111, hairBuild: hairS(0x111111, 'fringe'),
    torsoDetail: sp => { box(1.7, 1.9, .08, mat(0xf4ead8, { roughness: 1 }), .04, sp, 0, .9, .56); for (let i = 0; i < 3; i++) sphere(.07, mat(0xcccccc), sp, -.6, 1.2 + i * .3, .56, 8, 6); },
    face: copyFace({ iris: '#2a1608', browColor: '#111' }) }, [o => { const m = mat(0xffffff, { roughness: .9 }); cyl(.78, .7, .9, m, 24, o.head, 0, 1.7, 0); for (let i = 0; i < 5; i++) sphere(.4, m, o.head, Math.cos(i * 1.256) * .45, 2.2, Math.sin(i * 1.256) * .45, 12, 8); }, o => mustache(o.head, 0x111111)]);
}
export function makeHunter(scene, i = 0) {   // cazador: capa gris con capucha, cinturón con cuerdas, guantes de cuero, farol
  const o = M(scene, { seed: 410 + i, scale: 1.12, skin: [0xe8c0a0, 0xa86a42][i % 2], skinCss: ['#e8c0a0', '#a86a42'][i % 2], shirt: 0x5a5e66, shirt2: 0x4a4e56, cuffs: 0x3a2a1a, pants: 0x3a3e46, shoes: 0x2a1e14, belt: 0x5a3a1e, hair: 0x2a2a2a, hairBuild: hairS(0x2a2a2a, 'bald'),
    torsoDetail: sp => { const r = new THREE.Mesh(new THREE.TorusGeometry(.6, .1, 6, 16), mat(0xb8986a, { roughness: 1 })); r.position.set(.9, .3, .4); r.rotation.y = 1.2; sp.add(r); },
    face: copyFace({ mouth: 'flat', iris: '#202020', eyes: 'half', browColor: '#2a2a2a' }) }, [hood(0x5a5e66), cloak(0x4a4e56)]);
  const l = lanternProp(o.aL.hand); l.position.set(0, -1.1, 0); o.props.lantern = l; return o;
}
// vecinos: ropa, pelo, piel y accesorio distintos; todos con la misma sonrisa copiada
const FOLK = [
  [0xd8323a, 0x2a2a3a, 0x3a2214, 'curly', 0xf6d2b8, 'none'], [0x2a7ad8, 0x4a3a2a, 0xe8c86a, 'pony', 0xc68b5e, 'none'], [0x8a5ad8, 0x2a2a3a, 0x111111, 'swoop', 0x8d5a3b, 'cap'],
  [0xf2a83a, 0x3a5a3a, 0xb8521e, 'bun', 0xf0c4a2, 'glasses'], [0x2ea89a, 0x3a3a5a, 0xe8e8e8, 'bald', 0xf6d2b8, 'tie'], [0xd85a9a, 0x2a2a3a, 0x5a3a1a, 'long', 0xd9a47a, 'none'],
  [0x6a8a2a, 0x4a3a2a, 0x2a1a10, 'spiky', 0x8d5a3b, 'cap'], [0xe8e0d0, 0x5a3a6a, 0x9a9aa0, 'fringe', 0xf0c4a2, 'glasses'], [0x3a4a8a, 0x8a6a4a, 0x111111, 'curly', 0x6a4028, 'tie'], [0xc8783a, 0x2a3a4a, 0xd8b86a, 'swoop', 0xf6d2b8, 'none']];
export function makeFolk(scene, i) { const [sh, pa, hr, st, sk, acc] = FOLK[i % FOLK.length]; const css = '#' + sk.toString(16).padStart(6, '0');
  const A = []; if (acc === 'cap') A.push(o => cap(o.head, [0x2a2a2a, 0xd8323a][i % 2])); if (acc === 'glasses') A.push(o => glasses(o.head)); if (acc === 'tie') A.push(o => box(.2, .9, .05, mat(0xd8323a), .02, o.spine, 0, 1.45, .56));
  return M(scene, { seed: 420 + i, scale: .95 + (i % 3) * .05, skin: sk, skinCss: css, shirt: sh, shirt2: sh, pants: pa, shoes: [0x2a2a3a, 0x5a3a22, 0xf4f4f4][i % 3], hair: hr, hairBuild: hairS(hr, st), skirt: i % 4 === 1 ? pa : null, torsoDetail: i % 3 === 0 ? jacket(sh, 0xf4f4f4, null) : (i % 3 === 1 ? null : suit(sh, 0xf4f4f4, null)),
    face: copyFace({ iris: ['#2a1608', '#3a6a8a', '#4a8a5a'][i % 3], browColor: '#' + hr.toString(16).padStart(6, '0') }) }, A);
}
// cara colgada en un gancho: placa curva con la cara pintada
export function hungFace(parent, spec) { const g = new THREE.Group(); parent.add(g); const sk = mat(spec.skin ?? 0xf6d2b8, { roughness: .5, side: THREE.DoubleSide });
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(.66, .66, 1.2, 24, 1, true, -1.2, 2.4), sk); g.add(shell);
  const f = new THREE.Mesh(new THREE.CylinderGeometry(.665, .665, 1.0, 24, 1, true, -1.05, 2.1), new THREE.MeshStandardMaterial({ map: faceTexture({ skin: spec.css, mouth: 'grin', eyes: 'open', ...spec.face }), transparent: true, polygonOffset: true, polygonOffsetFactor: -2 })); g.add(f);
  if (spec.hair != null) { const hm = mat(spec.hair, { roughness: .6 }); const hc = new THREE.Mesh(new THREE.SphereGeometry(.7, 20, 8, -1.3, 2.6, 0, 1.0), hm); hc.position.y = .35; hc.scale.y = .6; g.add(hc); }
  return g; }
