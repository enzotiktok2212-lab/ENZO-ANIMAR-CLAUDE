// EBBE — reparto propio (nadie se parece al vídeo de referencia).
// Jonte (yo, 12): rizos rubio oscuro, Friesennerz amarillo abierto sobre camiseta de rayas marineras azul y blanca, vaqueros remangados, botas de agua rojas, cubo verde para conchas.
// Opa Hinrich: barba blanca de capitán, gorra Elbsegler azul marino con visera negra, jersey de lana azul de cuello alto, pipa.
// Mama Frauke: coleta rubia, chubasquero verde oliva, bufanda de rayas roja. Papa Ole: barba castaña, chaqueta de aguas naranja, gorro de lana.
// Herr Brösel: bajito y redondo, calvo con bigote canoso, tirantes rojos, camisa a cuadros, pantalón de pesca (waders) verde.
// Lütte Kids: niños del pueblo (capuchas de colores, gorras); vecinos con rayas, chubasqueros y gorros de pescador.
import { THREE, mat, box, cyl, sphere } from './engine.js';
import { mk, hairS, glasses, mustache, cap } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const fin = o => { o.root.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
// camiseta de rayas marineras
const streifen = (a, b, n = 7) => sp => { for (let k = 0; k < n; k++) box(2.1, 2.06 / n + .01, 1.12, mat(k % 2 ? b : a, { roughness: .8 }), k === 0 || k === n - 1 ? .12 : 0, sp, 0, .02 + 2.06 / n * (k + .5), 0); };
// Friesennerz: chubasquero brillante, abierto (deja ver lo de dentro), capucha a la espalda, botones de presión
const nerz = (col, inner, n = 7) => sp => { streifen(inner[0], inner[1], n)(sp); const j = mat(col, { roughness: .22, metalness: .0 });
  for (const s of [-1, 1]) { box(.78, 2.1, 1.18, j, .12, sp, s * .68, 1.02, 0); for (let k = 0; k < 3; k++) sphere(.07, mat(0xf4f4f4, { metalness: .6 }), sp, s * .36, .5 + k * .55, .6, 6, 4); }
  box(2.14, 2.1, .52, j, .12, sp, 0, 1.02, -.34); const hd = box(1.7, .7, .7, j, .3, sp, 0, 2.05, -.62); hd.rotation.x = .35; box(2.18, .36, 1.2, j, .1, sp, 0, .18, 0);
  for (const s of [-1, 1]) { const c = box(.6, .28, .5, j, .08, sp, s * .5, 2.04, .38); c.rotation.z = s * .5; box(.55, .5, .06, j, .05, sp, s * .66, .7, .62); } };
const jerseyHals = col => sp => { const j = mat(col, { roughness: .95 }); box(2.12, 2.06, 1.14, j, .16, sp, 0, 1.02, 0); cyl(.68, .72, .5, j, 14, sp, 0, 2.1, 0); for (let k = 0; k < 9; k++) box(.06, 1.8, .05, mat(0x000000, { transparent: true, opacity: .12 }), 0, sp, -.8 + k * .2, 1, .58); box(2.14, .3, 1.16, j, .1, sp, 0, .2, 0); };
const rainJacket = (col, scarf) => sp => { const j = mat(col, { roughness: .35 }); box(2.12, 2.06, 1.14, j, .16, sp, 0, 1.02, 0); box(.08, 1.9, .06, mat(0x2a2a2a), .02, sp, 0, 1, .59); for (const s of [-1, 1]) box(.55, .5, .06, j, .05, sp, s * .6, .65, .6); box(2.16, .3, 1.18, j, .1, sp, 0, .18, 0);
  if (scarf) { for (let k = 0; k < 4; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.62, .16, 6, 16), mat(k % 2 ? 0xf4f4f4 : scarf, { roughness: .95 })); r.rotation.x = Math.PI / 2; r.position.set(0, 2.02 + k * .02, .05); r.scale.y = 1.2; sp.add(r); } box(.4, 1.1, .2, mat(scarf, { roughness: .95 }), .08, sp, .3, 1.4, .62); } };
const karo = (a, b) => sp => { for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) box(2.12 / 4 + .01, 2.06 / 6 + .01, 1.14, mat((i + j) % 2 ? a : b, { roughness: .9 }), 0, sp, -.795 + j * .53, .17 + i * .343, 0); };
const traeger = col => sp => { for (const s of [-1, 1]) box(.24, 2.1, 1.2, mat(col, { roughness: .6 }), .03, sp, s * .5, 1.02, 0); };
// gorra Elbsegler (de capitán): copa azul, visera negra brillante, cordón dorado
export function elbsegler(head, col = 0x1a2a4a) { const g = new THREE.Group(); g.position.set(0, 1.3, 0); head.add(g); cyl(.88, .82, .5, mat(col, { roughness: .8 }), 20, g, 0, .1, 0); const top = cyl(.95, .9, .14, mat(col, { roughness: .8 }), 20, g, 0, .38, 0);
  const v = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .08, 20, 1, false, -1.2, 2.4), mat(0x111111, { roughness: .2 })); v.position.set(0, -.12, .25); v.scale.z = 1.2; g.add(v); const c = new THREE.Mesh(new THREE.TorusGeometry(.86, .04, 4, 24, Math.PI * .7), mat(0xd8b040, { metalness: .8, roughness: .3 })); c.rotation.set(Math.PI / 2, 0, Math.PI * .15); c.position.y = -.05; g.add(c); return g; }
export function strickmuetze(head, col, bom = 0xffffff) { const g = new THREE.Group(); g.position.set(0, 1.25, 0); head.add(g); const m = sphere(.86, mat(col, { roughness: 1 }), g, 0, .1, 0, 16, 10); m.scale.y = .85; cyl(.88, .88, .36, mat(col, { roughness: 1 }), 16, g, 0, -.15, 0); sphere(.3, mat(bom, { roughness: 1 }), g, 0, .85, 0, 8, 6); return g; }
const bart = (col, big = 1) => o => { const b = box(1.2 * big, .8 * big, .5, mat(col, { roughness: .95 }), .3, o.head, 0, -.55, .5); for (const s of [-1, 1]) box(.3, .9 * big, .5, mat(col, { roughness: .95 }), .15, o.head, s * .55, -.2, .45); box(.9, .2, .2, mat(col, { roughness: .95 }), .1, o.head, 0, -.2, .72); };
const pfeife = o => { const g = new THREE.Group(); g.position.set(.35, -.45, .75); o.head.add(g); const p = cyl(.05, .05, .7, mat(0x2a1a0a), 6, g, 0, 0, .3); p.rotation.x = Math.PI / 2; cyl(.16, .13, .34, mat(0x5a3014, { roughness: .6 }), 10, g, 0, .1, .66); };
const eimer = col => o => { const g = new THREE.Group(); o.aR.hand.add(g); g.position.set(0, -1.2, 0); cyl(.6, .45, 1.1, mat(col, { roughness: .45 }), 14, g, 0, 0, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.55, .04, 4, 16, Math.PI), mat(0x3a3a3a)); h.position.y = .5; g.add(h); for (let k = 0; k < 4; k++) sphere(.18, mat([0xf4dcc4, 0xff9aa8, 0xe8d8c8, 0xf0c8a8][k], { roughness: .4 }), g, -.25 + k * .17, .5, (k % 2 - .5) * .3, 8, 6); o.props.eimer = g; };
const stiefel = col => o => { for (const l of [o.lL, o.lR].filter(Boolean)) { if (!l.knee && !l.kn) continue; } };
export function makeJonte(scene) { return fin(mk(scene, S({ seed: 9601, scale: .78, skin: 0xf6d2b4, shirt: 0xffd21a, shirt2: 0xffd21a, cuffs: 0xe8b800, pants: 0x4a6aa8, shoes: 0xd8202a, sole: 0x8a1010, hair: 0xb8883a, hairBuild: hairS(0xb8883a, 'curly'),
  torsoDetail: nerz(0xffd21a, [0x1a3a8a, 0xf4f4f4], 7), face: { iris: '#3a7ab8', browColor: '#8a5a22', blush: .5, freckles: 1 } }), [eimer(0x2aa04a)])); }
export function makeOpa(scene) { return fin(mk(scene, S({ seed: 9602, scale: .9, skin: 0xeec0a0, shirt: 0x1a2a4a, shirt2: 0x1a2a4a, cuffs: 0x14203a, pants: 0x2a2a32, shoes: 0x2a1a0e, hair: 0xf0f0f0, hairBuild: hairS(0xf0f0f0, 'bald'),
  torsoDetail: jerseyHals(0x1a2a4a), face: { iris: '#4a7aa8', browColor: '#e8e8e8', blush: .45, bags: .2 } }), [o => elbsegler(o.head), bart(0xf2f2f2, 1.1), pfeife])); }
export function makeMama(scene) { return fin(mk(scene, S({ seed: 9603, scale: .9, skin: 0xf4cba8, shirt: 0x6a7a3a, shirt2: 0x6a7a3a, cuffs: 0x5a6a2a, pants: 0x2a3a5a, shoes: 0xffd21a, sole: 0x3a3a3a, hair: 0xe8c068, hairBuild: hairS(0xe8c068, 'pony'),
  torsoDetail: rainJacket(0x6a7a3a, 0xc8202a), face: { iris: '#3a7ab8', browColor: '#a8803a', blush: .45 } }))); }
export function makePapa(scene) { return fin(mk(scene, S({ seed: 9604, scale: 1.0, skin: 0xe8b890, shirt: 0xff7a1a, shirt2: 0xff7a1a, cuffs: 0xe05a0a, pants: 0x2a3a4a, shoes: 0x1a1a1a, hair: 0x6a4020, hairBuild: hairS(0x6a4020, 'fringe'),
  torsoDetail: rainJacket(0xff7a1a), face: { iris: '#5a4a2a', browColor: '#5a3418', blush: .3 } }), [bart(0x6a4020, .9), o => strickmuetze(o.head, 0x2a4a7a, 0xffd23f)])); }
export function makeBroesel(scene) { return fin(mk(scene, S({ seed: 9605, scale: .86, skin: 0xf0c0a0, shirt: 0xc8302a, shirt2: 0xc8302a, cuffs: 0xa8201a, pants: 0x3a6a3a, shoes: 0x2a4a2a, hair: 0xd8d8d8, hairBuild: hairS(0xd8d8d8, 'bald'),
  torsoDetail: sp => { karo(0xc8302a, 0xf4e8d8)(sp); traeger(0xd82020)(sp); box(2.3, 1.3, 1.3, mat(0x3a6a3a, { roughness: .4 }), .3, sp, 0, .55, 0); for (const s of [-1, 1]) box(.24, 1.2, .1, mat(0x2a4a2a), .02, sp, s * .5, 1.4, .64); }, face: { iris: '#3a5a2a', browColor: '#c8c8c8', blush: .6 } }), [o => mustache(o.head, 0xd8d8d8), o => glasses(o.head)])); }
// vecinos: pescadores, señoras con chubasquero, niños con capucha (todos distintos)
const VSK = [0xf2c4a0, 0xd8a07a, 0x8a5a3a, 0xf4cfb6, 0xc68b5e, 0xeab08a, 0x6a4028, 0xf0b088];
const VHC = [0x1a120c, 0x6a3a1a, 0xe0b850, 0xb8441a, 0x3a2214, 0xf0f0f0, 0x8a5a2a, 0xd8c8a0];
const VHS = ['fringe', 'pony', 'long', 'swoop', 'curly', 'spiky', 'bun', 'bald'];
const RAIN = [0xffd21a, 0xd8202a, 0x2a6ad8, 0xff7a1a, 0x2a9a5a, 0x1a2a4a, 0xff8ad0, 0x6a7a3a];
const STR = [[0x1a3a8a, 0xf4f4f4], [0xc8202a, 0xf4f4f4], [0x1a1a2a, 0xe8e0d0], [0x2a7a8a, 0xf4f4f4]];
export function makeNachbar(scene, i) { const r = k => (i * 7 + k * 13 + Math.floor(i / 3) * 5) % 97; const skin = VSK[r(1) % VSK.length], hair = VHC[r(2) % VHC.length], st = VHS[(i * 3 + 1) % VHS.length];
  const kind = i % 4, kid = i % 5 === 3, sc = kid ? .7 + (i % 3) * .04 : .86 + (i % 4) * .04; const col = RAIN[(i * 3 + 2) % RAIN.length], s2 = STR[i % STR.length];
  const torso = kind === 0 ? streifen(s2[0], s2[1], 7) : kind === 1 ? nerz(col, s2, 7) : kind === 2 ? rainJacket(col, i % 3 ? null : 0xf4f4f4) : jerseyHals([0x1a2a4a, 0x6a2a2a, 0x2a4a3a, 0x8a8478][i % 4]);
  const acc = [[], [o => strickmuetze(o.head, RAIN[(i + 3) % RAIN.length], 0xffffff)], [o => cap(o.head, RAIN[(i + 5) % RAIN.length], 0xffffff)], [o => glasses(o.head)], [o => elbsegler(o.head, [0x1a2a4a, 0x2a2a2a][i % 2])], [o => mustache(o.head, hair)], [bart(hair, .9)]][i % 7];
  return fin(mk(scene, S({ seed: 9700 + i, scale: sc, skin, shirt: col, shirt2: col, cuffs: col, pants: [0x2a3a5a, 0x1a1a24, 0xc8b48a, 0x4a6aa8, 0x6a6a72, 0x3a4a3a][r(4) % 6], shoes: [0xffd21a, 0x1a1a1a, 0xd8202a, 0x2a6a3a][i % 4], hair, hairBuild: hairS(hair, kid && st === 'bald' ? 'fringe' : st),
    torsoDetail: torso, face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hair), blush: .4 } }), acc)); }
