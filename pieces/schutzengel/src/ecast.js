// EINPACKEN — reparto propio (nadie se parece al vídeo de referencia).
// Mats (yo, ≈17): pelo negro rizado, cinta de sudor verde en la frente, camiseta de tirantes mostaza, muñequeras verdes, joggers gris oscuro, zapatillas verdes.
// Herr Krause (jefe de la Brötchenburg): tupé castaño, bigote, gafas, camisa blanca, chaleco verde con chapa, corbata roja aparte (se puede envolver).
import { THREE, mat, box, cyl, sphere, textPlane } from './engine.js';
import { mk, hairS, glasses, mustache, cap, shades } from './props.js';
import { drawLogo } from './esets.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
export function makeMats(scene) { return mk(scene, S({ seed: 7101, scale: .92, skin: 0xc68b5e, shirt: 0xe8b830, shirt2: 0xc68b5e, cuffs: 0xc68b5e, pants: 0x3a3e4a, shoes: 0x2ab86a, sole: 0xf4f4f4, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'curly'), sleeveShort: true,
  torsoDetail: sp => { box(2.1, 2.06, 1.12, mat(0xe8b830, { roughness: .8 }), .14, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.5, .5, 1.14, mat(0xc68b5e, { roughness: .7 }), .1, sp, s * .85, 1.85, 0); box(1.1, .5, .05, mat(0x1e7a5a), .02, sp, 0, 1.3, .57); },
  face: { iris: '#2a1a10', browColor: '#1a120c', blush: .2 } }), [o => { box(1.5, .26, 1.5, mat(0x2ab86a, { roughness: .9 }), .1, o.head, 0, 1.12, 0); }, o => { for (const a of [o.aL, o.aR]) { const w = cyl(.44, .44, .3, mat(0x2ab86a, { roughness: .9 }), 12, a.el, 0, -.6, 0); } }]); }
export function makeChef(scene) { return mk(scene, S({ seed: 7102, scale: 1.0, skin: 0xf0bc98, shirt: 0xffffff, shirt2: 0xffffff, cuffs: 0xffffff, pants: 0x2a3a3a, shoes: 0x1a1a1a, hair: 0x5a3418, hairBuild: hairS(0x5a3418, 'swoop'),
  torsoDetail: sp => { box(2.1, 2.06, 1.12, mat(0xffffff, { roughness: .6 }), .14, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.72, 1.8, 1.16, mat(0x1e7a5a, { roughness: .6 }), .1, sp, s * .66, .92, 0); box(2.12, .8, 1.16, mat(0x1e7a5a), .1, sp, 0, .4, 0);
    const b = textPlane(.5, .5, 64, 64, (c, w, h) => drawLogo(c, w / 2, h / 2, 30)); b.position.set(-.62, 1.4, .6); sp.add(b); },
  face: { iris: '#3a2a1a', browColor: '#4a2a10', blush: .4 } }), [o => mustache(o.head, 0x4a2a10), o => glasses(o.head)]); }
// Extras de fiesta: combinaciones distintas de piel, pelo, peinado, ropa y accesorio (ninguno igual a otro).
const SK = [0xf2c4a0, 0xd8a07a, 0x8a5a3a, 0xf4cfb6, 0xc68b5e, 0xeab08a, 0x6a4028, 0xf0b088];
const HC = [0x1a120c, 0x6a3a1a, 0xe0b850, 0xb8441a, 0x3a2214, 0xf0f0f0, 0x8a5a2a, 0x2a1a10];
const HS = ['fringe', 'pony', 'long', 'swoop', 'curly', 'spiky', 'bun', 'bald'];
const SH = [0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0xff8ad0, 0xf4f4f4, 0x6a3ad8, 0xff8a3a, 0x1aa0a0, 0x8a8e96, 0xe86a9a, 0x3a8a4a];
const PA = [0x2a3a5a, 0x1a1a24, 0xc8b48a, 0x4a6aa8, 0x6a6a72, 0x3a4a3a];
export function makeExtra(scene, i) { const r = k => (i * 7 + k * 13 + Math.floor(i / 3) * 5) % 97;
  const skin = SK[r(1) % SK.length], hair = HC[r(2) % HC.length], st = HS[(i * 3 + 1) % HS.length], shirt = SH[(i * 5 + 2) % SH.length], pants = PA[r(4) % PA.length];
  const acc = [[], [o => glasses(o.head)], [o => cap(o.head, SH[(i + 4) % SH.length], 0xffffff)], [o => shades(o.head)], [], [o => mustache(o.head, hair)]][i % 6];
  return mk(scene, S({ seed: 7200 + i, scale: .86 + (i % 4) * .04, skin, shirt, shirt2: shirt, cuffs: shirt, pants, shoes: [0xf4f4f4, 0x1a1a1a, 0xd8323a, 0x2a6ad8][i % 4], hair, hairBuild: hairS(hair, st), sleeveShort: i % 2 === 0,
    face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hair), blush: .35 } }), acc); }
