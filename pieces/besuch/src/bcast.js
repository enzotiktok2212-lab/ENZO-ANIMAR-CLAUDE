// Besuchstag — reparto propio (distinto del vídeo de referencia).
// Ich (13): pelo castaño ondulado con tupé, plumífero azul petróleo con franjas, bufanda mostaza, vaqueros oscuros, botas marrones.
// Mia (6): trenzas rubias, gorro blanco con pompón lila, abrigo lila con botones, leotardos azul marino, botas blancas.
// Papa: barba castaña, gafas, jersey noruego verde con banda blanca, vaqueros. Mama: moño caoba, rebeca crema, delantal a cuadros rojo.
// Opa Heinrich (visitante): gorra plana, bigote blanco, chaqueta de punto azul marino, bufanda granate. Oma Liesel (visitante): moño blanco, abrigo verde.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG } from './engine.js';
import { mk, hairS, glasses, mustache } from './props.js';
import { flatCap } from './cast.js';
const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const knitBand = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; c.fillRect(0, 20, w, 18); c.fillStyle = a; for (let x = 0; x < w; x += 8) { c.beginPath(); c.moveTo(x, 24); c.lineTo(x + 4, 29); c.lineTo(x, 34); c.lineTo(x - 4, 29); c.fill(); } }, true);
const check = (a, b) => canvasTex(32, 32, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let y = 0; y < h; y += 8) for (let x = (y / 8) % 2 * 8; x < w; x += 16) c.fillRect(x, y, 8, 8); }, true);
function wavy(col) { return h => { const m = mat(col, { roughness: .6 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .7, 1.05); h.add(c);
  for (let i = 0; i < 7; i++) { const t = box(.42, .34, .5, m, .16, h, -.6 + i * .2, 1.42 - Math.abs(i - 3) * .03, .28 - (i % 2) * .1); t.rotation.set(-.4, 0, (i - 3) * .12); }
  const q = box(.9, .4, .5, m, .2, h, .2, 1.3, .55); q.rotation.set(-.6, .1, -.3); box(1.36, .6, .36, m, .16, h, 0, .9, -.54); for (const s of [-1, 1]) box(.22, .5, .7, m, .1, h, s * .66, .9, -.05); }; }
function braids(col) { return h => { const m = mat(col, { roughness: .55 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .68, 1.04); h.add(c);
  for (let i = -2; i <= 2; i++) { const f = box(.3, .32, .2, m, .1, h, i * .24, 1.1, .58); f.rotation.x = -.3; }
  for (const s of [-1, 1]) { for (let k = 0; k < 4; k++) sphere(.2 - k * .015, m, h, s * (.72 + k * .02), .55 - k * .32, -.05, 10, 8); sphere(.1, mat(0xb88ae8), h, s * .78, -.55, -.05, 8, 6); } }; }
const bobble = (col, pom) => o => { const m = mat(col, { roughness: 1 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.8, 24, 12, 0, 6.283, 0, 1.45), m); c.position.y = 1.0; c.scale.set(1, .85, 1); o.head.add(c); cyl(.82, .82, .3, mat(col, { roughness: 1 }), 24, o.head, 0, 1.05, 0); sphere(.32, mat(pom, { roughness: 1 }), o.head, 0, 1.78, 0, 12, 10); };
const puffer = (a, b) => sp => { const m = mat(a, { roughness: .35 }), n = mat(b, { roughness: .35 }); box(2.24, 2.12, 1.24, m, .3, sp, 0, 1.0, 0); for (const y of [.35, .95, 1.55]) box(2.3, .12, 1.3, n, .06, sp, 0, y, 0); box(.08, 2, .06, mat(0x1a1a1a), 0, sp, 0, 1.0, .64); box(1.5, .5, 1.3, m, .2, sp, 0, 2.1, 0); };
const scarf = col => sp => { const m = mat(col, { roughness: 1 }); const r = new THREE.Mesh(new THREE.TorusGeometry(.62, .2, 8, 20), m); r.rotation.x = Math.PI / 2; r.position.set(0, 2.08, .05); sp.add(r); box(.4, 1.1, .2, m, .08, sp, .4, 1.5, .7).rotation.z = .1; for (let k = 0; k < 4; k++) box(.06, .2, .05, m, 0, sp, .28 + k * .08, .9, .72); };
const coat = (a, btn) => sp => { const m = mat(a, { roughness: .7 }); box(2.2, 2.1, 1.22, m, .2, sp, 0, 1.0, 0); for (let k = 0; k < 3; k++) for (const s of [-1, 1]) sphere(.09, mat(btn), sp, s * .25, 1.6 - k * .45, .64, 8, 6); const col = box(1.7, .4, 1.3, mat(a, { roughness: .9 }), .16, sp, 0, 2.05, 0); };
const norweger = sp => { box(2.14, 2.08, 1.16, mat(0xffffff, { roughness: 1, map: knitBand('#2a5a3a', '#f4f0e6') }), .14, sp, 0, 1.0, 0); box(1.4, .5, 1.2, mat(0x2a5a3a, { roughness: 1 }), .16, sp, 0, 2.05, 0); };
const cardigan = (a, b) => sp => { box(2.14, 2.06, 1.14, mat(a, { roughness: 1 }), .14, sp, 0, 1.0, 0); box(.5, 2.0, .06, mat(b), .02, sp, 0, 1.0, .58); for (let k = 0; k < 4; k++) sphere(.08, mat(0x8a5a3a), sp, .3, 1.7 - k * .4, .6, 6, 4); };
const apron = sp => { const m = mat(0xffffff, { roughness: 1, map: check('#ffffff', '#d8323a') }); box(1.6, 1.4, .08, m, .03, sp, 0, .8, .62); };

export function makeNoah(scene) { return mk(scene, S({ seed: 5101, scale: .86, skin: 0xf2c8a8, shirt: 0x1f7a8c, shirt2: 0x1f7a8c, cuffs: 0x15586a, pants: 0x2a3550, shoes: 0x6a4428, sole: 0x3a2414, hair: 0x7a4a24, hairBuild: wavy(0x7a4a24),
  torsoDetail: sp => { puffer(0x1f7a8c, 0x15586a)(sp); scarf(0xe8a820)(sp); }, face: { iris: '#3a6a9a', browColor: '#5a3418', blush: .4 } })); }
export function makeMia(scene) { return mk(scene, S({ seed: 5102, scale: .62, skin: 0xf6d2b8, shirt: 0x9a7ad8, shirt2: 0x9a7ad8, cuffs: 0xf4f0e8, pants: 0x2a2f5a, shoes: 0xf6f6f6, sole: 0xc8c8d8, hair: 0xf0c860, hairBuild: braids(0xf0c860),
  torsoDetail: coat(0x9a7ad8, 0xffd23f), face: { iris: '#4a8ad8', browColor: '#c8a040', blush: .7, freckles: 1 } }), [bobble(0xf6f2ea, 0xb88ae8)]); }
export function makePapaB(scene) { return mk(scene, S({ seed: 5103, scale: 1.0, skin: 0xe8b090, shirt: 0x2a5a3a, shirt2: 0x2a5a3a, cuffs: 0xf4f0e6, pants: 0x3a4a6a, shoes: 0x4a3020, sole: 0x2a1a10, hair: 0x5a3a20, hairBuild: hairS(0x5a3a20, 'fringe'),
  torsoDetail: norweger, face: { iris: '#4a6a3a', browColor: '#4a2a14', blush: .35 } }), [o => glasses(o.head), o => { const m = mat(0x5a3a20, { roughness: .9 }); box(1.3, .6, .32, m, .14, o.head, 0, .16, .56); for (const s of [-1, 1]) box(.24, .7, .8, m, .1, o.head, s * .62, .4, .2); }]); }
export function makeMamaB(scene) { return mk(scene, S({ seed: 5104, scale: .92, skin: 0xf2c4a4, shirt: 0xeadcc0, shirt2: 0xeadcc0, cuffs: 0xd8c8a8, pants: 0x5a4a6a, shoes: 0xd8a080, sole: 0x8a5a3a, hair: 0x8a3a1e, hairBuild: hairS(0x8a3a1e, 'bun'),
  torsoDetail: sp => { cardigan(0xeadcc0, 0xd84a5a)(sp); apron(sp); }, face: { iris: '#5a3a1a', browColor: '#6a2a10', blush: .5 } }), [o => { for (const s of [-1, 1]) sphere(.09, mat(0xe9c23a, { metalness: .9 }), o.head, s * .7, .25, .05, 8, 6); }]); }
export function makeOpa(scene) { return mk(scene, S({ seed: 5105, scale: .96, skin: 0xf0c4a8, shirt: 0x24305a, shirt2: 0x24305a, cuffs: 0x1a2240, pants: 0x7a6a50, shoes: 0x3a2a1a, hair: 0xf0f0f0, hairBuild: hairS(0xf0f0f0, 'bald'),
  torsoDetail: sp => { cardigan(0x24305a, 0xf4f0e6)(sp); scarf(0x8a1a2a)(sp); }, face: { iris: '#5a7a9a', browColor: '#e8e8e8', blush: .5, bags: 1 } }), [o => mustache(o.head, 0xf4f4f4), o => flatCap(o.head, 0x6a5a48), o => { const m = mat(0xf0f0f0); for (const s of [-1, 1]) box(.22, .45, .7, m, .08, o.head, s * .66, .75, -.15); }]); }
export function makeOmaB(scene) { return mk(scene, S({ seed: 5106, scale: .86, skin: 0xf4d0b8, shirt: 0x3a7a5a, shirt2: 0x3a7a5a, cuffs: 0xf4f0e8, pants: 0x5a5a6a, shoes: 0x8a2a3a, hair: 0xf2f2f2, hairBuild: hairS(0xf2f2f2, 'bun'),
  torsoDetail: coat(0x3a7a5a, 0xe9c23a), face: { iris: '#4a6a8a', browColor: '#d8d8d8', blush: .6 } }), [o => glasses(o.head)]); }
// niños y vecinos para las escenas del pueblo
const KIDS = [[0xd8a07a, 0xe85a3a, 0x3a2214, 'curly'], [0xf2c8a0, 0x3ab86a, 0xe0b850, 'pony'], [0x8a5a3a, 0xffd23f, 0x101010, 'fringe'], [0xf4c6a6, 0x3a6ad8, 0xb8441a, 'long']];
export function makeKind(scene, i) { const [sk, co, hc, st] = KIDS[i % 4]; return mk(scene, S({ seed: 5120 + i, scale: .66 + (i % 2) * .06, skin: sk, shirt: co, shirt2: co, cuffs: 0xffffff, pants: 0x2a2a3a, shoes: 0xf4f4f4, sole: 0xc8c8c8, hair: hc, hairBuild: hairS(hc, st),
  torsoDetail: puffer(co, 0xffffff), face: { iris: '#3a2410', browColor: hex(hc), blush: .6 } }), i % 2 ? [] : [bobble([0xd8323a, 0xffd23f][i % 2 ? 1 : 0], 0xffffff)]); }
