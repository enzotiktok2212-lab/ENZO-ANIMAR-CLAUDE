// GOON — reparto propio (nadie se parece al vídeo de referencia):
// Ich (≈11): pelo pelirrojo revuelto, pecas, chubasquero amarillo con capucha bajada y cremallera, vaqueros, zapatillas rojas, mochila verde.
// Polizisten: uniforme azul marino con bandas reflectantes y gorra de plato con escudo (cada uno con otra cara y pelo).
// Tante Helga (panadera, ≈55): moño rubio, delantal enharinado, blusa rosa. Nachbar Herr Pfeiffer: albornoz granate, calvo, nariz roja, pañuelo en el bolsillo.
// Apothekerin: bata blanca, coleta negra, gafas. Häftling: traje de rayas, rapado. Brutzel-Willi (carrito): delantal de rayas, gafas de sol, bigote.
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, mustache, shades } from './props.js';
import { FONT } from './sets.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const stripesT = (a, b, n = 4) => canvasTex(32, 32, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let y = 0; y < h; y += 32 / n) c.fillRect(0, y, w, 16 / n); }, true);
const messy = col => h => { const m = mat(col, { roughness: .8 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .65, 1.05); h.add(c);
  for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283, t = new THREE.Mesh(new THREE.ConeGeometry(.22, .6, 5), m); t.position.set(Math.cos(a) * .45, 1.36, Math.sin(a) * .45); t.rotation.set(Math.sin(a) * .9, 0, -Math.cos(a) * .9); h.add(t); }
  for (let i = -2; i <= 2; i++) { const f = box(.28, .42, .24, m, .1, h, i * .24, 1.12, .55); f.rotation.set(-.4, 0, i * .15); } };
const bunH = col => h => { const m = mat(col, { roughness: .6 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .64, 1.04); h.add(c); sphere(.48, m, h, 0, 1.55, -.35, 14, 10); };
const ponyH = col => h => { const m = mat(col, { roughness: .45 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .66, 1.04); h.add(c); sphere(.3, m, h, 0, 1.15, -.65, 10, 8); const p = box(.32, 1.3, .32, m, .14, h, 0, .5, -.82); p.rotation.x = .2; };
const raincoat = (col) => sp => { const m = mat(col, { roughness: .35 }); box(2.16, 2.1, 1.16, m, .16, sp, 0, 1.0, 0); box(.08, 2.0, .06, mat(0x2a2a2a), 0, sp, 0, 1.0, .6); for (const s of [-1, 1]) box(.6, .5, .08, m, .06, sp, s * .6, .5, .6);
  const hd = box(1.8, .7, .8, m, .3, sp, 0, 2.05, -.55); hd.rotation.x = .35; for (let k = 0; k < 4; k++) box(.18, .1, .06, mat(0x2a2a2a), .02, sp, .14, 1.6 - k * .38, .62); };
const backpack = col => o => { const g = new THREE.Group(); g.position.set(0, 1.1, -.62); o.spine.add(g); box(1.5, 1.7, .6, mat(col, { roughness: .8 }), .2, g, 0, 0, -.1); box(1.2, .7, .3, mat(0x2a2a3a), .1, g, 0, -.4, -.35); for (const s of [-1, 1]) box(.16, 1.6, .1, mat(0x2a2a3a), .03, g, s * .55, .1, .3); };
const uniformP = sp => { const m = mat(0x1a2a4a, { roughness: .55 }); box(2.14, 2.1, 1.16, m, .14, sp, 0, 1.02, 0); for (const y of [.55, 1.35]) box(2.18, .18, 1.2, mat(0xd8f040, { emissive: 0x8aa020, emissiveIntensity: .35 }), .03, sp, 0, y, 0);
  const st = canvasTex(64, 32, (c, w, h) => { c.fillStyle = '#1a2a4a'; c.fillRect(0, 0, w, h); c.font = `700 16px ${FONT}`; c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.fillText('POLIZEI', w / 2, 21); }); const p = new THREE.Mesh(new THREE.PlaneGeometry(1.3, .6), mat(0xffffff, { map: st })); p.position.set(0, 1.75, .59); sp.add(p);
  box(.4, .5, .06, mat(0xe9c23a, { metalness: .8 }), .02, sp, -.5, 1.25, .6); };
const policeCap = o => { const m = mat(0x1a2a4a, { roughness: .5 }); cyl(.78, .72, .5, m, 20, o.head, 0, 1.45, 0); cyl(.86, .86, .12, m, 20, o.head, 0, 1.72, 0); const v = box(1.1, .08, .5, mat(0x0a0a10, { roughness: .2 }), .03, o.head, 0, 1.24, .65); v.rotation.x = .25; box(1.6, .12, .1, mat(0xd8f040), .02, o.head, 0, 1.44, .74); sphere(.16, mat(0xe9c23a, { metalness: .8 }), o.head, 0, 1.55, .76, 8, 6); };
const apronF = sp => { const m = mat(0xfbfaf6, { roughness: 1 }); box(1.7, 2.0, .08, m, .03, sp, 0, .95, .58); for (let k = 0; k < 6; k++) sphere(.12, mat(0xf0ead8, { transparent: true, opacity: .8 }), sp, -.5 + k * .2, .4 + (k % 3) * .4, .64, 6, 4); };
const robe = col => sp => { const m = mat(col, { roughness: 1 }); box(2.2, 2.12, 1.2, m, .16, sp, 0, 1.0, 0); const v = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.1, 3), mat(0xf0c09c)); v.position.set(0, 1.6, .58); v.rotation.x = Math.PI; v.scale.z = .1; sp.add(v); box(2.24, .2, 1.24, mat(0xe8d8b0), .04, sp, 0, .7, 0);
  const tb = sphere(.25, mat(0xffffff, { roughness: 1, flatShading: true }), sp, .62, 1.55, .66, 6, 5); box(.6, .5, .08, m, .04, sp, .6, 1.3, .62); };
const labcoat = sp => { const m = mat(0xf8f8fc, { roughness: .7 }); box(2.16, 2.1, 1.16, m, .14, sp, 0, 1.02, 0); box(.5, 1.6, .06, mat(0x7ac8e8), .02, sp, 0, 1.3, .6); for (const s of [-1, 1]) box(.55, .5, .06, m, .04, sp, s * .62, .55, .61); };
const prison = sp => { box(2.12, 2.1, 1.14, mat(0xffffff, { map: stripesT('#f4f4f4', '#1a1a22', 5), roughness: .8 }), .14, sp, 0, 1.0, 0); const n = canvasTex(64, 32, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.font = `700 22px ${FONT}`; c.fillStyle = '#1a1a22'; c.textAlign = 'center'; c.fillText('0815', w / 2, 24); }); const p = new THREE.Mesh(new THREE.PlaneGeometry(.9, .45), mat(0xffffff, { map: n })); p.position.set(-.45, 1.5, .58); sp.add(p); };
const stripeApron = sp => { box(2.1, 2.06, 1.12, mat(0xf4f4f4, { roughness: .8 }), .14, sp, 0, 1.0, 0); box(1.6, 1.9, .08, mat(0xffffff, { map: canvasTex(32, 32, (c, w, h) => { for (let x = 0; x < w; x += 8) { c.fillStyle = (x / 8) % 2 ? '#d8282a' : '#ffffff'; c.fillRect(x, 0, 8, h); } }) }), .03, sp, 0, .9, .58); };

export function makeKid(scene) { return mk(scene, S({ seed: 6101, scale: .78, skin: 0xf6cfb0, shirt: 0xf6c81a, shirt2: 0xf6c81a, cuffs: 0xe0b010, pants: 0x3a5a9a, shoes: 0xe8322a, sole: 0xffffff, hair: 0xd8642a, hairBuild: messy(0xd8642a),
  torsoDetail: raincoat(0xf6c81a), face: { iris: '#3a7a4a', browColor: '#b8501a', blush: .45, freckles: 1 } }), [backpack(0x3a9a4a)]); }
export function makeCop(scene, i) { const L = [[0xeab08a, 0x3a2410, 'plain'], [0x8a5a3a, 0x101010, 'buzz'], [0xf4c8a8, 0xd8a840, 'plain'], [0xc68b5e, 0x2a1a10, 'plain']][i % 4];
  return mk(scene, S({ seed: 6110 + i, scale: 1.0 + (i % 2) * .05, skin: L[0], shirt: 0x1a2a4a, shirt2: 0x1a2a4a, cuffs: 0xd8f040, pants: 0x1a2a4a, shoes: 0x0a0a10, hair: L[1], hairBuild: hairS(L[1], L[2]),
    torsoDetail: uniformP, face: { iris: ['#3a2410', '#2a1a10', '#3a6a9a', '#4a3a1a'][i % 4], browColor: hex(L[1]) } }), [policeCap, ...(i % 2 ? [o => mustache(o.head, L[1])] : [])]); }
export function makeHelga(scene) { return mk(scene, S({ seed: 6102, scale: .9, skin: 0xf4cdb0, shirt: 0xff9ac0, shirt2: 0xff9ac0, cuffs: 0xffffff, pants: 0x4a4a5a, shoes: 0xf4f4f4, hair: 0xf0d080, hairBuild: bunH(0xf0d080), sleeveShort: true,
  torsoDetail: sp => { box(2.1, 2.06, 1.12, mat(0xff9ac0, { roughness: .8 }), .14, sp, 0, 1.0, 0); apronF(sp); }, face: { iris: '#3a6a9a', browColor: '#c8a050', blush: .6 } }), [o => { for (const s of [-1, 1]) sphere(.12, mat(0xe9c23a, { metalness: .9 }), o.head, s * .72, .2, .05, 8, 6); }]); }
export function makePfeiffer(scene) { return mk(scene, S({ seed: 6103, scale: 1.02, skin: 0xf0b898, shirt: 0x7a1a2a, shirt2: 0x7a1a2a, cuffs: 0xe8d8b0, pants: 0x3a3a48, shoes: 0x6a4a30, hair: 0x8a8070, hairBuild: h => { const m = mat(0x8a8070, { roughness: .9 }); for (const s of [-1, 1]) box(.24, .55, .9, m, .1, h, s * .66, .9, -.12); box(1.2, .5, .3, m, .12, h, 0, .9, -.6); },
  torsoDetail: robe(0x7a1a2a), face: { iris: '#5a4a3a', browColor: '#6a6050', blush: .3 } }), [o => { sphere(.2, mat(0xe85a5a), o.head, 0, .62, .72, 10, 8); }]); }
export function makeApothekerin(scene) { return mk(scene, S({ seed: 6104, scale: .92, skin: 0xd8a07a, shirt: 0xf8f8fc, shirt2: 0xf8f8fc, cuffs: 0xf8f8fc, pants: 0x3a4a6a, shoes: 0xf4f4f4, hair: 0x101010, hairBuild: ponyH(0x101010),
  torsoDetail: labcoat, face: { iris: '#2a1a10', browColor: '#101010' } }), [o => glasses(o.head)]); }
export function makeHaeftling(scene) { return mk(scene, S({ seed: 6105, scale: 1.0, skin: 0xe8b48c, shirt: 0xf4f4f4, shirtMap: stripesT('#f4f4f4', '#1a1a22', 5), shirt2: null, cuffs: 0x1a1a22, pants: 0xf4f4f4, shoes: 0x2a2a2a, hair: 0x3a2a1a, hairBuild: hairS(0x3a2a1a, 'plain'),
  torsoDetail: prison, face: { iris: '#4a3a1a', browColor: '#3a2a1a' } }), [o => { const m = mat(0x3a2a1a); box(1.0, .2, .1, m, .04, o.head, 0, .3, .66); }]); }
export function makeWilli(scene) { return mk(scene, S({ seed: 6106, scale: 1.08, skin: 0xc8865a, shirt: 0xf4f4f4, shirt2: 0xf4f4f4, cuffs: 0xd8282a, pants: 0x2a2a34, shoes: 0x1a1a1a, hair: 0x1a1008, hairBuild: hairS(0x1a1008, 'swoop'),
  torsoDetail: stripeApron, face: { iris: '#2a1a10', browColor: '#1a1008' } }), [o => mustache(o.head, 0x1a1008), o => shades(o.head, 0x111111, 0x2a2a2a)]); }
