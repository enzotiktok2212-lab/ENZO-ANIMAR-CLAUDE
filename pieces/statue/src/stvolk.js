// STATUE — reparto propio (distinto del original): Finn (yo): gorro de lana naranja, gafas redondas, sudadera turquesa; Jonas: rizos negros, sudadera granate;
// Mia: chaqueta verde con capucha, melena castaña con pinza amarilla, mochila morada / el sexto día: vestido azul claro y moño con lazo;
// mi Ex (coleta rubia, top rosa) y su novio (gorra, chaqueta vaquera); el Bürgermeister (gvolk); la Lehrerin (moño gris, chaqueta roja);
// mi Cousin (gordito, cascos verdes, camiseta de rayas); el Sucher del gancho (camisa amarilla, ramo de flores); niños y extras.
import { THREE, mat, box, cyl, sphere } from './engine.js';
import { mk, hairS, glasses, cap, hoodie, jacket, headphones } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const beanie = col => o => { const m = mat(col, { roughness: 1 }); const b = sphere(.98, m, o.head, 0, 1.38, -.1, 16, 10); b.scale.set(1, .62, 1); const r = cyl(1.0, 1.0, .3, mat(col, { roughness: 1 }), 18, o.head, 0, 1.3, -.06); sphere(.26, mat(0xffffff, { roughness: 1 }), o.head, 0, 2.05, -.1, 10, 8); };
const clip = col => o => { box(.5, .22, .2, mat(col, { roughness: .4 }), .08, o.head, .55, 1.25, .45).rotation.z = -.4; };
const backpack = col => o => { const g = new THREE.Group(); o.spine.add(g); box(1.6, 1.8, .8, mat(col, { roughness: .8 }), .3, g, 0, 1.0, -.95); box(1.2, .7, .3, mat(col, { roughness: .8 }), .15, g, 0, .6, -1.45); for (const s_ of [-1, 1]) box(.2, 1.9, .14, mat(0x3a1a6a), .05, g, s_ * .55, 1.1, .58); o.pack = g; };
const ribbon = col => o => { const m = mat(col, { roughness: .6 }); for (const s of [-1, 1]) { const b = box(.55, .45, .2, m, .15, o.head, s * .32, 1.6, -.85); b.rotation.z = s * .4; } sphere(.16, m, o.head, 0, 1.6, -.88, 8, 6); };
const flowers = o => { const g = new THREE.Group(); o.aR.hand.add(g); g.position.set(0, -.5, .5); cyl(.08, .14, 1.6, mat(0x3a8a3a), 6, g, 0, .4, 0); for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28; sphere(.3, mat([0xe8325a, 0xffd23f, 0xff8ad0][k % 3], { roughness: .7 }), g, Math.cos(a) * .35, 1.35 + (k % 2) * .15, Math.sin(a) * .35, 8, 6); } box(.7, .5, .7, mat(0xf4f0e0, { roughness: .9 }), .1, g, 0, .6, 0); o.flowers = g; g.visible = false; };
const stripesT = (a, b) => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? a : b; x.fillRect(0, i * 8, 64, 8); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };

export const makeFinn = scene => mk(scene, S({ seed: 9601, scale: .92, skin: 0xf2c4a0, shirt: 0x1aa0a0, shirt2: 0x1aa0a0, cuffs: 0x1aa0a0, pants: 0x2a3a5a, shoes: 0xf4f4f4, sole: 0x1a1a1a, hair: 0x6a3a1a, hairBuild: hairS(0x6a3a1a, 'fringe'),
  torsoDetail: hoodie(0x1aa0a0, 0xffffff), face: { iris: '#3a6a8a', browColor: '#6a3a1a', blush: .35, freckles: 1 } }), [beanie(0xff7a1a), o => glasses(o.head)]);
export const makeJonas = scene => mk(scene, S({ seed: 9602, scale: .95, skin: 0xc68b5e, shirt: 0x8a1a2a, shirt2: 0x8a1a2a, cuffs: 0x8a1a2a, pants: 0x1a1a24, shoes: 0x1a1a1a, sole: 0xf4f4f4, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'curly'),
  torsoDetail: hoodie(0x8a1a2a, 0xf4f4f4), face: { iris: '#2a1a10', browColor: '#1a120c', blush: .25 } }));
export const makeMia = scene => mk(scene, S({ seed: 9603, scale: .86, skin: 0xf4cfb6, shirt: 0x2ab86a, shirt2: 0x2ab86a, cuffs: 0x2ab86a, pants: 0x4a6aa8, shoes: 0xf4f4f4, sole: 0xe8325a, hair: 0x5a2e14, hairBuild: hairS(0x5a2e14, 'long'),
  torsoDetail: jacket(0x2ab86a, 0xf4f4f4), face: { iris: '#5a3a1a', browColor: '#4a2410', blush: .55, freckles: 1 } }), [clip(0xffd23f), backpack(0x7a3ad8)]);
export const makeMiaKleid = scene => mk(scene, S({ seed: 9604, scale: .86, skin: 0xf4cfb6, shirt: 0x9ad0f4, shirt2: 0xf4cfb6, sleeveShort: true, cuffs: 0x9ad0f4, pants: 0xf4cfb6, skirt: 0x9ad0f4, shoes: 0xf4f4f4, sole: 0x9ad0f4, hair: 0x5a2e14, hairBuild: hairS(0x5a2e14, 'bun'),
  face: { iris: '#5a3a1a', browColor: '#4a2410', blush: .7, freckles: 1 } }), [ribbon(0xffd23f)]);
export const makeEx = scene => mk(scene, S({ seed: 9605, scale: .86, skin: 0xf4cfb6, shirt: 0xff8ad0, shirt2: 0xff8ad0, cuffs: 0xff8ad0, pants: 0xf4f4f4, shoes: 0xf4f4f4, sole: 0xff8ad0, hair: 0xe8c060, hairBuild: hairS(0xe8c060, 'pony'), face: { iris: '#3a6a9a', browColor: '#b8904a', blush: .5 } }));
export const makeExFreund = scene => mk(scene, S({ seed: 9606, scale: .98, skin: 0xeab08a, shirt: 0x4a6aa8, shirt2: 0x4a6aa8, cuffs: 0x4a6aa8, pants: 0x1a1a24, shoes: 0x1a1a1a, hair: 0x3a2214, hairBuild: hairS(0x3a2214, 'swoop'),
  torsoDetail: jacket(0x4a6aa8, 0xf4f4f4), face: { iris: '#3a2410', browColor: '#3a2214' } }), [o => cap(o.head, 0x1a1a24, 0xffffff)]);
export const makeLehrerin = scene => mk(scene, S({ seed: 9607, scale: 1.0, skin: 0xf0c4a4, shirt: 0xc81e2a, shirt2: 0xc81e2a, cuffs: 0xf4f4f4, pants: 0x2a2a30, skirt: 0x2a2a30, shoes: 0x1a1a1a, hair: 0x9a9aa0, hairBuild: hairS(0x9a9aa0, 'bun'),
  torsoDetail: jacket(0xc81e2a, 0xf4f4f4), face: { iris: '#3a3a3a', browColor: '#6a6a6a', bags: 1 } }), [o => glasses(o.head)]);
export const makeCousin = scene => mk(scene, S({ seed: 9608, scale: 1.0, skin: 0xf4cfb6, shirt: 0xffffff, shirtMap: stripesT('#ff7a1a', '#ffffff'), shirt2: 0xff7a1a, cuffs: 0xff7a1a, pants: 0x6a6a72, shoes: 0x2a6ad8, hair: 0xe0b850, hairBuild: hairS(0xe0b850, 'spiky'), girth: 1.25, face: { iris: '#3a6a8a', browColor: '#c8a040', blush: .5 } }), [o => headphones(o.head, 0x2ab86a)]);
export const makeSucher = scene => mk(scene, S({ seed: 9609, scale: .96, skin: 0xd8a07a, shirt: 0xffd23f, shirt2: 0xffd23f, cuffs: 0xffffff, pants: 0x2a3a5a, shoes: 0x8a5a32, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'swoop'), face: { iris: '#2a1a10', browColor: '#2a1a10', blush: .3 } }), [flowers]);
export const makeKind = (scene, i) => { const sh = [0xd8323a, 0x2a6ad8, 0xffd23f, 0x8ad84a][i % 4], hr = [0xe0b850, 0x1a120c, 0xb8441a, 0x6a3a1a][i % 4];
  return mk(scene, S({ seed: 9620 + i, scale: .66 + (i % 2) * .05, skin: [0xf4cfb6, 0xc68b5e, 0xf2c4a0, 0x8a5a3a][i % 4], shirt: sh, shirt2: sh, cuffs: sh, sleeveShort: true, pants: [0x4a6aa8, 0x2a2a30][i % 2], shoes: 0xf4f4f4, hair: hr, hairBuild: hairS(hr, ['spiky', 'pony', 'fringe', 'curly'][i % 4]), face: { iris: '#3a2410', browColor: hex(hr), blush: .5 } }), i % 2 ? [o => cap(o.head, 0x2ab86a, 0xffffff)] : []); };
