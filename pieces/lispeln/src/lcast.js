// LISPELN — reparto propio (nadie se parece al vídeo de referencia).
// Ich (Jonte, ≈12): pelo castaño con remolino, pecas, chaqueta bomber verde oliva con cremallera y parche, camiseta blanca, vaqueros, zapatillas rojas.
// Bester Freund (Bela): gordito, pelo pelirrojo rizado, peto vaquero sobre camiseta a rayas naranja, zapatillas verdes.
// Lehrerin (Frau Kessler): joven, melena negra corta con flequillo recto, blazer rojo con collar de perlas, falda negra.
// Verkäufer (Spieleladen): gamer con cresta verde, cascos con micro, sudadera morada con un mando dibujado.
// Bürgermeister (Herr Zischler): alto y delgado, traje burdeos de tres piezas, cadena de oro de alcalde, bigote enroscado gris, raya al lado.
// Porsche-Mann: camisa rosa, chaleco azul marino, gafas de sol en la cabeza, pelo engominado.
// Polizisten: gcast.makeCop. Extras: ecast.makeExtra (personajes Roblox reales).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane } from './engine.js';
import { mk, hairS, glasses, mustache, cap, shades, headphones } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });

// ---------- peinados ----------
const cowlick = col => h => { const m = mat(col, { roughness: .7 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .66, 1.05); h.add(c);
  for (let i = -2; i <= 2; i++) { const f = box(.3, .42, .26, m, .1, h, i * .25, 1.1, .54); f.rotation.set(-.3, 0, i * -.18); }
  const t = new THREE.Mesh(new THREE.ConeGeometry(.16, .55, 6), m); t.position.set(.15, 1.55, -.2); t.rotation.set(-.5, 0, -.4); h.add(t); const t2 = t.clone(); t2.position.set(-.05, 1.52, -.3); t2.rotation.set(-.7, 0, .3); h.add(t2); };
const redCurls = col => h => { const m = mat(col, { roughness: .85 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.22), m); c.position.y = 1.0; c.scale.set(1.06, .58, 1.06); h.add(c);
  for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283, r = .52 + (i % 2) * .14; sphere(.21, m, h, Math.cos(a) * r, 1.16 + (i % 3) * .1, Math.sin(a) * r * .95, 10, 8); } for (let i = -2; i <= 2; i++) sphere(.19, m, h, i * .23, 1.2, .56, 10, 8); };
const bob = col => h => { const m = mat(col, { roughness: .35 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 26, 13, 0, 6.283, 0, 1.35), m); c.position.y = 1.0; c.scale.set(1.06, .72, 1.06); h.add(c);
  box(1.36, .34, .26, m, .08, h, 0, 1.06, .56); for (const s of [-1, 1]) box(.3, 1.2, 1.0, m, .14, h, s * .7, .5, -.08); box(1.42, 1.24, .4, m, .16, h, 0, .5, -.52); };
const mohawk = col => h => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.25), mat(0x2a1a10, { roughness: .9 })); c.position.y = .98; c.scale.set(1.04, .58, 1.04); h.add(c);
  for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.ConeGeometry(.17, .7, 6), m); s.position.set(0, 1.5 - Math.abs(k - 2.5) * .05, .5 - k * .22); s.rotation.x = -.3 + k * .12; h.add(s); } };
const sidePart = col => h => { const m = mat(col, { roughness: .45 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.28), m); c.position.y = 1.0; c.scale.set(1.05, .62, 1.05); h.add(c);
  const sw = box(1.0, .3, .5, m, .14, h, .12, 1.22, .38); sw.rotation.z = -.18; box(.06, .05, .9, mat(0xd8c8b8), 0, h, -.32, 1.33, .1); for (const s of [-1, 1]) box(.2, .55, .7, m, .08, h, s * .7, .75, -.1); };
const slick = col => h => { const m = mat(col, { roughness: .2, metalness: .1 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .68, 1.08); h.add(c); const q = box(1.2, .36, .7, m, .16, h, 0, 1.24, .3); q.rotation.x = -.2; };
// ---------- ropa ----------
const bomber = (col, patch) => sp => { const j = mat(col, { roughness: .55 }); box(2.16, 2.1, 1.18, j, .2, sp, 0, 1.0, -.01); box(.5, 1.9, .06, mat(0xf8f8f4), .02, sp, 0, 1.05, .57);
  box(.05, 1.9, .07, mat(0xc8c8c8, { metalness: .8, roughness: .2 }), 0, sp, -.28, 1.05, .6); const rib = mat(0x2a2a2a, { roughness: .9 }); box(2.22, .26, 1.22, rib, .08, sp, 0, .12, 0); box(1.3, .22, .9, rib, .08, sp, 0, 2.06, 0);
  const p = textPlane(.5, .5, 64, 64, (c, w, h) => { c.fillStyle = patch; c.beginPath(); c.arc(32, 32, 28, 0, 7); c.fill(); c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.stroke(); c.fillStyle = '#ffffff'; c.font = '700 30px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('★', 32, 34); }); p.position.set(.62, 1.55, .6); sp.add(p); };
const dungaree = (den, tee1, tee2) => sp => { const st = canvasTex(32, 32, (c, w, h) => { for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? tee2 : tee1; c.fillRect(0, i * 8, w, 8); } }, true); st.repeat.set(1, 3);
  box(2.14, 2.08, 1.14, mat(0xffffff, { map: st, roughness: .8 }), .16, sp, 0, 1.0, 0); const d = mat(den, { roughness: .8 }); box(1.7, 1.2, 1.18, d, .12, sp, 0, .55, 0); box(1.1, .5, .08, d, .05, sp, 0, .9, .6);
  for (const s of [-1, 1]) { box(.24, 1.0, .08, d, .03, sp, s * .5, 1.6, .58); box(.24, 1.0, .08, d, .03, sp, s * .5, 1.6, -.58); sphere(.08, mat(0xd8c040, { metalness: .8 }), sp, s * .5, 1.18, .63, 6, 4); } };
const blazer = (col, pearl) => sp => { const j = mat(col, { roughness: .5 }); box(2.12, 2.08, 1.14, mat(0x1a1a1a, { roughness: .6 }), .14, sp, 0, 1.0, 0); for (const s of [-1, 1]) { box(.82, 2.08, 1.16, j, .12, sp, s * .66, 1.0, 0); const l = box(.36, .9, .06, j, .03, sp, s * .32, 1.6, .6); l.rotation.z = s * .45; }
  box(2.12, 2.08, .5, j, .12, sp, 0, 1.0, -.33); for (let k = 0; k < 11; k++) { const a = Math.PI * (k / 10); sphere(.07, mat(pearl, { roughness: .2, metalness: .3 }), sp, Math.cos(a) * .42, 2.0 - Math.sin(a) * .36, .5 + Math.sin(a) * .08, 8, 6); } };
const gamerHoodie = (col) => sp => { const j = mat(col, { roughness: .85 }); box(2.16, 2.1, 1.16, j, .2, sp, 0, 1.0, -.01); box(1.36, .55, .1, j, .1, sp, 0, .45, .6); const hd = box(1.66, .6, .64, j, .24, sp, 0, 2.0, -.56); hd.rotation.x = -.3;
  const p = textPlane(1.1, .7, 110, 70, (c, w, h) => { c.fillStyle = '#7aff6a'; c.beginPath(); c.roundRect(8, 14, 94, 44, 22); c.fill(); c.fillStyle = '#1a1a24'; c.fillRect(22, 32, 18, 6); c.fillRect(28, 26, 6, 18); c.beginPath(); c.arc(78, 30, 5, 0, 7); c.arc(88, 40, 5, 0, 7); c.fill(); }); p.position.set(0, 1.35, .6); sp.add(p); };
const threePiece = (col, vest) => sp => { const j = mat(col, { roughness: .45 }); box(2.1, 2.08, 1.12, mat(0xf8f8f4), .12, sp, 0, 1.0, 0); box(1.1, 1.7, 1.15, mat(vest, { roughness: .5 }), .08, sp, 0, .95, .01);
  for (const s of [-1, 1]) { box(.74, 2.08, 1.16, j, .12, sp, s * .68, 1.0, 0); const l = box(.34, 1.0, .06, j, .03, sp, s * .36, 1.55, .6); l.rotation.z = s * .4; } box(2.12, 2.08, .5, j, .12, sp, 0, 1.0, -.33);
  box(.18, .7, .05, mat(0x1a1a3a), .02, sp, 0, 1.6, .6); for (let k = 0; k < 3; k++) sphere(.06, mat(0xd8b040, { metalness: .9 }), sp, 0, 1.15 - k * .3, .61, 6, 4); };
// cadena de alcalde (Amtskette): eslabones de oro y medallón con escudo
const amtskette = sp => { const g = mat(0xf0c030, { metalness: .95, roughness: .18 }); for (let k = 0; k < 15; k++) { const a = Math.PI * (k / 14); const l = new THREE.Mesh(new THREE.TorusGeometry(.09, .03, 6, 10), g); l.position.set(Math.cos(a) * .72, 2.04 - Math.sin(a) * .62, .58 + Math.sin(a) * .06); l.rotation.y = a; sp.add(l); }
  const md = cyl(.3, .3, .07, g, 20, sp, 0, 1.25, .66); md.rotation.x = Math.PI / 2; const e = textPlane(.42, .42, 64, 64, (c, w, h) => { c.fillStyle = '#c8202a'; c.beginPath(); c.moveTo(12, 10); c.lineTo(52, 10); c.lineTo(52, 34); c.quadraticCurveTo(32, 60, 12, 34); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(28, 14, 8, 36); }); e.position.set(0, 1.25, .705); sp.add(e); };
const vestShirt = sp => { box(2.1, 2.08, 1.12, mat(0xffa8c8, { roughness: .7 }), .12, sp, 0, 1.0, 0); const v = mat(0x1a2a5a, { roughness: .6 }); for (const s of [-1, 1]) box(.7, 1.9, 1.16, v, .1, sp, s * .5, .95, 0); box(2.12, 1.9, .5, v, .1, sp, 0, .95, -.33); };
const curlStache = (col) => o => { const m = mat(col, { roughness: .7 }); for (const s of [-1, 1]) { const b = box(.44, .16, .12, m, .06, o.head, s * .22, .5, .7); b.rotation.z = s * -.15; const t = new THREE.Mesh(new THREE.TorusGeometry(.11, .05, 6, 10, 4.4), m); t.position.set(s * .5, .58, .7); t.rotation.z = s > 0 ? 3.6 : -.4; o.head.add(t); } };
const headset = col => o => { headphones(o.head, col); const mic = box(.06, .06, .6, mat(0x1a1a1a), .02, o.head, -.68, .45, .35); mic.rotation.y = .5; sphere(.09, mat(0x1a1a1a), o.head, -.55, .45, .66, 8, 6); };
const shadesUp = o => { box(1.25, .08, .1, mat(0x222222, { metalness: .6 }), .02, o.head, 0, 1.36, .52).rotation.x = -.5; for (const s of [-1, 1]) { const l = box(.46, .28, .06, mat(0x111111, { roughness: .05, metalness: .6 }), .04, o.head, s * .29, 1.34, .5); l.rotation.x = -.5; } };

export function makeJonte(scene) { return mk(scene, S({ seed: 9101, scale: .84, skin: 0xf2c6a2, shirt: 0x5a6a2a, shirt2: 0x5a6a2a, cuffs: 0x2a2a2a, pants: 0x3a5a9a, shoes: 0xe8322a, sole: 0xffffff, hair: 0x7a4a22, hairBuild: cowlick(0x7a4a22),
  torsoDetail: bomber(0x5a6a2a, '#e8322a'), face: { iris: '#4a6a2a', browColor: '#5a3418', blush: .4, freckles: 1 } })); }
export function makeBela(scene) { return mk(scene, S({ seed: 9102, scale: .82, skin: 0xf6d6bc, shirt: 0xff8a2a, shirt2: 0xff8a2a, cuffs: 0xff8a2a, pants: 0x3a5aa8, shoes: 0x2ab86a, sole: 0xffffff, hair: 0xc8501a, hairBuild: redCurls(0xc8501a), sleeveShort: true, belly: 1,
  torsoDetail: dungaree(0x3a5aa8, '#ff8a2a', '#ffd8a8'), face: { iris: '#3a7ab8', browColor: '#a8401a', blush: .6, freckles: 1 } })); }
export function makeKessler(scene) { return mk(scene, S({ seed: 9103, scale: .95, skin: 0xe8b48c, shirt: 0xd8202a, shirt2: 0xd8202a, cuffs: 0xd8202a, pants: 0x1a1a1a, shoes: 0x1a1a1a, hair: 0x14100c, hairBuild: bob(0x14100c), skirt: 0x1a1a1a,
  torsoDetail: blazer(0xd8202a, 0xf8f4ec), face: { iris: '#3a2410', browColor: '#14100c', blush: .35, lips: '#c8303a' } }), [o => { for (const s of [-1, 1]) sphere(.1, mat(0xf8f4ec, { roughness: .2 }), o.head, s * .72, .25, .05, 8, 6); }]); }
export function makeZocker(scene) { return mk(scene, S({ seed: 9104, scale: 1.0, skin: 0xd8a07a, shirt: 0x6a3ad8, shirt2: 0x6a3ad8, cuffs: 0x4a2ab8, pants: 0x1a1a24, shoes: 0xf4f4f4, hair: 0x5aff4a, hairBuild: mohawk(0x5aff4a),
  torsoDetail: gamerHoodie(0x6a3ad8), face: { iris: '#2a1a10', browColor: '#2a1a10' } }), [headset(0x1a1a24)]); }
export function makeZischler(scene) { return mk(scene, S({ seed: 9105, scale: 1.12, skin: 0xf0c0a0, shirt: 0x7a1a2a, shirt2: 0x7a1a2a, cuffs: 0xf8f8f4, pants: 0x7a1a2a, shoes: 0x1a1010, hair: 0x9a9aa2, hairBuild: sidePart(0x9a9aa2),
  torsoDetail: sp => { threePiece(0x7a1a2a, 0x4a0e18)(sp); amtskette(sp); }, face: { iris: '#4a5a7a', browColor: '#8a8a92', blush: .55, bags: 1 } }), [curlStache(0x9a9aa2)]); }
export function makePorscheMann(scene) { return mk(scene, S({ seed: 9106, scale: 1.02, skin: 0xc68b5e, shirt: 0xffa8c8, shirt2: 0xffa8c8, cuffs: 0xffa8c8, pants: 0xe8dcc0, shoes: 0x6a3a1a, hair: 0x1a120c, hairBuild: slick(0x1a120c),
  torsoDetail: vestShirt, face: { iris: '#2a1a10', browColor: '#1a120c' } }), [shadesUp]); }
