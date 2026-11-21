// Augen (Stumm) — reparto propio (nadie se parece al vídeo de referencia).
// Ich (18): pelo castaño oscuro despeinado, jersey de punto verde azulado con franja crema, pantalón de pana marrón, botas. Ich de niño (7) igual pero pequeño, peto.
// Mama: pelo cobrizo recogido en moño bajo, rebeca mostaza sobre blusa blanca, falda larga azul marino, bastón. Frau Wendt: rizos blancos, blusa lila, gafas, broche.
// Timo: gorro de lana rojo, chaqueta naranja, pecas. Timos Mutter: melena castaña, delantal verde. Hilde: muy mayor, pañuelo gris en la cabeza, chal marrón, encorvada.
// Vecinos mudos: 8 variantes (chaquetas, gorros, pañuelos, barbas). Todos llevan colgada al cuello una pizarrita pequeña.
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, mustache } from './props.js';
import { knit, plaid, curtain, mullet, buzz, messyBun, sidePart, baldSides, curlyTop, longBangs, beret, bucket } from './gvolk.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const knitSweater = (col, band) => sp => { const m = mat(0xffffff, { roughness: 1, map: knit(hex(col), 'rgba(0,0,0,.18)') }); box(2.14, 2.08, 1.16, m, .16, sp, 0, 1.02, 0);
  box(2.18, .36, 1.2, mat(band, { roughness: 1 }), .05, sp, 0, 1.42, 0); for (let k = 0; k < 7; k++) box(.18, .18, .05, mat(col), .04, sp, -.75 + k * .25, 1.42, .62); box(1.1, .3, 1.1, mat(col, { roughness: 1 }), .12, sp, 0, 2.05, 0); box(2.16, .3, 1.18, mat(col, { roughness: 1 }), .1, sp, 0, .12, 0); };
const cardigan = (col, blouse) => sp => { box(1.95, 2.0, 1.08, mat(blouse, { roughness: .8 }), .12, sp, 0, 1.0, 0); const m = mat(0xffffff, { roughness: 1, map: knit(hex(col), 'rgba(0,0,0,.15)') });
  for (const s of [-1, 1]) box(.82, 2.04, 1.14, m, .14, sp, s * .62, 1.0, 0); box(2.1, 2.04, .4, m, .14, sp, 0, 1.0, -.38); for (let k = 0; k < 4; k++) sphere(.08, mat(0x8a5a2a), sp, .26, 1.7 - k * .4, .6, 6, 4);
  for (const s of [-1, 1]) box(.5, .3, .06, m, .04, sp, s * .3, 1.95, .55); };
const shawl = col => sp => { box(2.1, 2.0, 1.12, mat(0x6a5a4a, { roughness: 1 }), .14, sp, 0, 1.0, 0); const m = mat(0xffffff, { roughness: 1, map: plaid(hex(col), 'rgba(0,0,0,.35)') }); const s = box(2.4, 1.0, 1.4, m, .3, sp, 0, 1.7, 0); const t = box(.8, 1.2, .2, m, .1, sp, 0, 1.0, .65); t.rotation.z = .1; };
const apron = (col, dress) => sp => { box(2.04, 2.04, 1.1, mat(dress, { roughness: .8 }), .14, sp, 0, 1.0, 0); box(1.5, 1.7, .08, mat(col, { roughness: .9 }), .04, sp, 0, .9, .56); box(1.9, .12, 1.14, mat(col), .03, sp, 0, .4, 0); };
const parka = (col, fur) => sp => { box(2.2, 2.1, 1.2, mat(col, { roughness: .6 }), .2, sp, 0, 1.02, 0); box(.08, 1.9, .05, mat(0x2a2a2a), 0, sp, 0, 1.0, .62); for (const s of [-1, 1]) box(.55, .45, .06, mat(col), .04, sp, s * .55, .55, .62); box(1.7, .4, 1.3, mat(fur, { roughness: 1 }), .2, sp, 0, 2.05, 0); };
// pizarrita colgada al cuello con un cordel (los mudos la llevan siempre)
const slate = o => { const g = new THREE.Group(); g.position.set(0, .55, .66); o.spine.add(g); box(1.2, .85, .08, mat(0x1f2a26, { roughness: .9 }), .03, g, 0, 0, 0); for (const [x, y, w, h] of [[0, .46, 1.32, .1], [0, -.46, 1.32, .1], [-.62, 0, .1, .9], [.62, 0, .1, .9]]) box(w, h, .12, mat(0x8a5a2a), .02, g, x, y, 0);
  for (const s of [-1, 1]) { const c = cyl(.02, .02, 1.5, mat(0xd8c8a8), 4, g, s * .4, .8, -.25); c.rotation.set(-.4, 0, s * -.3); } for (let k = 0; k < 3; k++) box(.6 - k * .12, .05, .02, mat(0xe8e8e0), 0, g, -.1, .2 - k * .2, .05); o.props.slate = g; };
const kerchief = col => o => { const m = mat(col, { roughness: 1 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.76, 24, 12, 0, 6.283, 0, 1.6), m); c.position.y = .9; c.scale.set(1.02, .82, 1.04); o.head.add(c); box(.5, .4, .3, m, .12, o.head, 0, .05, .45).rotation.x = .5; };
const beanie = col => o => { const m = mat(col, { roughness: 1 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.76, 24, 12, 0, 6.283, 0, 1.4), m); c.position.y = 1.0; c.scale.set(1.02, .9, 1.02); o.head.add(c); cyl(.78, .78, .35, mat(col), 24, o.head, 0, 1.02, 0); sphere(.24, mat(0xf4f4f0, { roughness: 1 }), o.head, 0, 1.75, 0, 10, 8); };
const lowBun = col => (h, _m, hs) => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.71, 24, 12, 0, 6.283, 0, 1.45), m); c.position.y = .98; c.scale.set(1.02, .7, 1.04); h.add(c); sphere(.4, m, h, 0, .7, -.72, 14, 10); for (const s of [-1, 1]) box(.22, .6, .5, m, .1, h, s * .66, .78, .1); };
const whiteCurls = col => (h) => { const m = mat(col, { roughness: 1 }); for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283; sphere(.3, m, h, Math.cos(a) * .6, 1.05 + (i % 3) * .12, Math.sin(a) * .55 - .05, 10, 8); } sphere(.5, m, h, 0, 1.32, 0, 12, 8); };
const brooch = o => sphere(.12, mat(0x8a3ad8, { metalness: .5, roughness: .2 }), o.spine, -.5, 1.8, .62, 8, 6);

export function makeIch(scene, kid = false) { return mk(scene, S({ seed: kid ? 3102 : 3101, scale: kid ? .62 : .9, skin: 0xe8b48c, shirt: 0x2a7a7a, shirt2: 0x2a7a7a, cuffs: 0xe8dcc0, pants: kid ? 0x3a5a9a : 0x7a5a3a, shoes: 0x5a3a1a, sole: 0x2a1a0a, hair: 0x3a2214, hairBuild: curtain(0x3a2214),
  torsoDetail: kid ? apron(0x3a5a9a, 0xf2c23a) : knitSweater(0x2a7a7a, 0xe8dcc0), face: { iris: '#4a6a3a', browColor: '#3a2214', blush: .35 } })); }
export function makeMama(scene) { return mk(scene, S({ seed: 3103, scale: .88, skin: 0xf0c4a2, shirt: 0xd8a030, shirt2: 0xd8a030, cuffs: 0xc08a20, pants: 0x1c2a4a, shoes: 0x3a2a1a, hair: 0x7a3418, hairBuild: longBangs(0x7a3418),
  skirt: 0x1c2a4a, torsoDetail: cardigan(0xd8a030, 0xf8f4ec), face: { iris: '#4a6a3a', browColor: '#8a3a20', blush: .45 } })); }
export function makeWendt(scene) { return mk(scene, S({ seed: 3104, scale: .82, skin: 0xf4d0b8, shirt: 0xb898d8, shirt2: 0xb898d8, cuffs: 0x9878b8, pants: 0x4a4a6a, shoes: 0x2a2a3a, hair: 0xf2f2f2, hairBuild: whiteCurls(0xf2f2f2),
  skirt: 0x5a4a7a, face: { iris: '#5a7a9a', browColor: '#cfcfcf', blush: .5 } }), [o => glasses(o.head), brooch]); }
export function makeTimo(scene) { return mk(scene, S({ seed: 3105, scale: .9, skin: 0xf6d2b8, shirt: 0xff7a1a, shirt2: 0xff7a1a, cuffs: 0xd85a10, pants: 0x2a3a5a, shoes: 0xf4f4f4, hair: 0xd8902a, hairBuild: hairS(0xd8902a, 'fringe'),
  torsoDetail: parka(0xff7a1a, 0xf4ecd8), face: { iris: '#3a6a9a', browColor: '#b8701a', freckles: 1, blush: .5 } }), [beanie(0xd8283a)]); }
export function makeTimoMutter(scene) { return mk(scene, S({ seed: 3106, scale: .86, skin: 0xeab08a, shirt: 0xf4e8d8, shirt2: 0xf4e8d8, cuffs: 0xe8d8c0, pants: 0x6a4a3a, shoes: 0x3a2a1a, hair: 0x6a3a1a, hairBuild: longBangs(0x6a3a1a),
  skirt: 0x8a5a3a, torsoDetail: apron(0x3a9a5a, 0xf4e8d8), face: { iris: '#5a3a1a', browColor: '#5a2a10', blush: .4 } })); }
export function makeHilde(scene) { return mk(scene, S({ seed: 3107, scale: .78, skin: 0xf0c8b0, shirt: 0x6a5a4a, shirt2: 0x6a5a4a, cuffs: 0x5a4a3a, pants: 0x3a3a3a, shoes: 0x2a1a10, hair: 0xd8d8d8, hairBuild: hairS(0xd8d8d8, 'bun'),
  skirt: 0x4a3a2a, torsoDetail: shawl(0x8a5a3a), face: { iris: '#6a7a8a', browColor: '#d0d0d0', blush: .4 } }), [kerchief(0x8a8a92)]); }
const NB = [ // piel, pelo, peinado, ropa (torsoDetail), extras, cara, pantalón
  [0xeab08a, 0x5a3a1e, sidePart(0x5a3a1e), knitSweater(0xd8323a, 0xf4f4f0), [o => mustache(o.head, 0x5a3a1e)], 'mustache', 0x3a3a4a, 0xd8323a],
  [0xf0c4a2, 0xf2d070, messyBun(0xf2d070), cardigan(0x5ab8e8, 0xffffff), [], 'girl', 0x4a3a6a, 0x5ab8e8],
  [0x8d5a3b, 0x101010, buzz(0x101010), parka(0x3a8a4a, 0xe8e0d0), [o => glasses(o.head)], 'plain', 0x2a2a3a, 0x3a8a4a],
  [0xf4cfb6, 0xe0e0e0, baldSides(0xe0e0e0), knitSweater(0x8a5ad8, 0xf2c23a), [beret(0x2a2a4a)], 'mustache', 0x5a4a3a, 0x8a5ad8],
  [0xc68b5e, 0x2a1a10, curlyTop(0x2a1a10), apron(0xf2a23a, 0xe85a8a), [], 'girl', 0x3a3a4a, 0xe85a8a],
  [0xe0b090, 0x8a5a2a, mullet(0x8a5a2a), parka(0x2a5aa8, 0xf4ecd8), [bucket(0x5a7a3a)], 'hero', 0x2a3a4a, 0x2a5aa8],
  [0xf6d2b8, 0x3a2a1a, hairS(0x3a2a1a, 'pony'), cardigan(0x3aa88a, 0xf8f0e0), [], 'girl', 0x5a3a3a, 0x3aa88a],
  [0xa86a42, 0x1a1008, hairS(0x1a1008, 'spiky'), knitSweater(0xf2c23a, 0x2a5aa8), [], 'kid', 0x2a2a4a, 0xf2c23a],
];
export function makeNachbar(scene, i) { const [sk, hc, hb, td, acc, face, pa, arm] = NB[i % NB.length];
  const c = mk(scene, S({ seed: 3110 + i, scale: .86 + (i % 3) * .05, skin: sk, shirt: arm, shirt2: arm, cuffs: arm, pants: pa, shoes: 0x2a2a2a, hair: hc, hairBuild: hb, torsoDetail: td, skirt: face === 'girl' ? pa : undefined,
    face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hc), blush: .35 } }), [...acc, slate]); c.kit = face; return c; }
