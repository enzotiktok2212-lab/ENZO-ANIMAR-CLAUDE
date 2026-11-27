// DAMPF — reparto propio (nadie se parece al vídeo de referencia).
// Ich (Timo, ≈16, pulmones débiles): flequillo rubio oscuro, pecas, sudadera naranja con cordones, vaqueros oscuros, zapatillas blancas, inhalador azul.
// Lehrerin Frau Kessler: moño castaño, gafas rojas, rebeca morada sobre blusa blanca, falda gris.
// Beamter (Regierung): traje gris, corbata azul, calvo con gafas. Nebelmaschinen-Mann: barba, gorro de lana verde, chaqueta de cuadros.
import { THREE, mat, box, cyl, sphere } from './engine.js';
import { mk, hairS, glasses, mustache, cap, hoodie, suit, jacket } from './props.js';
const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
export function makeTimo(scene) { return mk(scene, S({ seed: 8101, scale: .9, skin: 0xf2c4a0, shirt: 0xff7a1a, shirt2: 0xff7a1a, cuffs: 0xe8600a, pants: 0x2a3a5a, shoes: 0xf4f4f4, sole: 0xd8323a, hair: 0x8a6a3a, hairBuild: hairS(0x8a6a3a, 'fringe'),
  torsoDetail: hoodie(0xff7a1a, 0xffffff), face: { iris: '#3a6a8a', browColor: '#6a4a24', freckles: 1, blush: .3 } })); }
export function makeKessler(scene) { return mk(scene, S({ seed: 8102, scale: .95, skin: 0xeab08a, shirt: 0x7a3ab8, shirt2: 0x7a3ab8, cuffs: 0x5a2a98, pants: 0x5a5a66, skirt: 0x5a5a66, shoes: 0x3a1a1a, hair: 0x5a3418, hairBuild: hairS(0x5a3418, 'bun'),
  torsoDetail: sp => { box(2.08, 2.04, 1.1, mat(0x7a3ab8, { roughness: .9 }), .14, sp, 0, 1.02, -.02); box(.62, 1.9, .06, mat(0xffffff), .02, sp, 0, 1.05, .55); for (let i = 0; i < 4; i++) sphere(.06, mat(0xffd23f, { metalness: .7 }), sp, .4, .4 + i * .42, .58, 8, 6); },
  face: { iris: '#3a2a1a', browColor: '#4a2a10', blush: .35 } }), [o => { const g = glasses(o.head); g && g.traverse && g.traverse(m => { if (m.isMesh && m.material.color) m.material = mat(0xd8323a, { roughness: .3 }); }); }]); }
export function makeBeamter(scene) { return mk(scene, S({ seed: 8103, scale: 1.0, skin: 0xf0bc98, shirt: 0x6a6e78, shirt2: 0x6a6e78, cuffs: 0xffffff, pants: 0x4a4e58, shoes: 0x1a1a1a, hair: 0x3a2a1a, hairBuild: hairS(0x3a2a1a, 'bald'),
  torsoDetail: suit(0x6a6e78, 0xffffff, 0x2a5ad8), face: { iris: '#2a3a4a', browColor: '#3a2a1a' } }), [o => glasses(o.head)]); }
export function makeNebelmann(scene) { return mk(scene, S({ seed: 8104, scale: 1.0, skin: 0xd8a07a, shirt: 0xb8322a, shirt2: 0xb8322a, cuffs: 0x8a2a1a, pants: 0x3a3a2a, shoes: 0x5a3a1a, hair: 0x4a2a14, hairBuild: hairS(0x4a2a14, 'fringe'),
  torsoDetail: jacket(0xb8322a, 0x2a2a2a), face: { iris: '#3a2a1a', browColor: '#3a2010' } }), [o => mustache(o.head, 0x4a2a14), o => { box(1.42, .5, 1.32, mat(0x2a8a4a, { roughness: 1 }), .2, o.head, 0, 1.4, 0); sphere(.22, mat(0xffffff, { roughness: 1 }), o.head, 0, 1.75, 0, 10, 8); }]); }
// inhalador azul (para Timo)
export function inhaler(parent) { const g = new THREE.Group(); parent.add(g); box(.42, .8, .3, mat(0x2a7ad8, { roughness: .35 }), .1, g, 0, .4, 0); const m = box(.36, .3, .5, mat(0xe8eef4, { roughness: .4 }), .08, g, 0, -.05, .18); box(.3, .2, .05, mat(0x1a1a22), .03, g, 0, -.05, .44); return g; }
