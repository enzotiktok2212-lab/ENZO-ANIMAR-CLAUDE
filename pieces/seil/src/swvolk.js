// SEIL — reparto propio (distinto de la referencia: allí el narrador era rubio de azul y June pelirroja con kimono rosa).
// Ich (el Rufer, 12): pelo castaño oscuro rizado, pañuelo mostaza al cuello, chaqueta verde musgo con bolsillos, pantalón marrón, botas; trompetilla de latón.
// Lotte (12): dos trenzas rubias con lazos rojos, vestido azul cielo con cuello blanco y lunares, medias rojas.
// Der alte Fischer: barba blanca, sombrero de agua amarillo, chubasquero amarillo, botas altas verdes.
// Braut (vestido blanco y velo), Bräutigam (chaleco gris, pajarita), Standesbeamtin (toga negra), dos Chirurgen (verde, gorro, mascarilla),
// Mutter con bebé, el Suppenesser (bigote, chaleco), la Oma del pueblo (moño blanco, chal violeta).
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, mustache } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const fin = o => { o.root.traverse(m => { if (m.isMesh) m.castShadow = true; }); return o; };
const curly = col => h => { hairS(col, 'curly')(h); const m = mat(col, { roughness: .6 }); for (let k = 0; k < 7; k++) sphere(.3, m, h, -.6 + k * .2, 1.42 + (k % 2) * .12, .35 - (k % 3) * .25, 8, 6); };
const braids = col => h => { hairS(col, 'fringe')(h); const m = mat(col, { roughness: .55 }), rb = mat(0xd8202a, { roughness: .5 });
  for (const s of [-1, 1]) { for (let k = 0; k < 6; k++) sphere(.24 - k * .012, m, h, s * (.82 + k * .02), .55 - k * .36, -.25, 8, 6); const b = box(.46, .26, .2, rb, .06, h, s * .86, .7, -.2); b.rotation.z = s * .5; } };
const scarf = col => o => { const m = mat(col, { roughness: 1 }); const r = new THREE.Mesh(new THREE.TorusGeometry(.78, .26, 8, 18), m); r.rotation.x = Math.PI / 2; r.position.set(0, 2.15, 0); o.spine.add(r); box(.5, 1.1, .2, m, .08, o.spine, .32, 1.6, .62).rotation.z = .15; };
const mossJacket = sp => { const j = mat(0x4a6a2a, { roughness: .8 }); box(2.12, 2.06, 1.14, j, .16, sp, 0, 1.02, 0); for (const s of [-1, 1]) { box(.7, .55, .1, mat(0x3a5a1e), .05, sp, s * .55, .55, .6); box(.12, .12, .05, mat(0xd8b040, { metalness: .7 }), .02, sp, s * .55, .85, .66); } box(.08, 1.9, .06, mat(0x2a3a12), .02, sp, 0, 1.02, .6); };
const dressBlue = sp => { const t = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#7ab8f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { c.beginPath(); c.arc(6 + i * 13 + (j % 2) * 6, 6 + j * 13, 2.4, 0, 7); c.fill(); } });
  box(2.1, 2.06, 1.12, mat(0xffffff, { map: t, roughness: .8 }), .14, sp, 0, 1.02, 0); for (const s of [-1, 1]) { const c = box(.7, .3, .5, mat(0xffffff), .1, sp, s * .42, 2.0, .4); c.rotation.z = s * .4; } };
const sou = o => { const m = mat(0xf2c81a, { roughness: .5 }); cyl(.95, 1.1, .7, m, 18, o.head, 0, 1.5, -.05); const br = cyl(1.6, 1.6, .1, m, 20, o.head, 0, 1.18, -.2); br.rotation.x = -.15; };
const beard = col => o => { const m = mat(col, { roughness: 1 }); box(1.3, .9, .5, m, .25, o.head, 0, -.15, .45); box(1.1, .35, .3, m, .12, o.head, 0, .2, .62); };
const raincoat = sp => { const m = mat(0xf2c81a, { roughness: .45 }); box(2.16, 2.1, 1.16, m, .16, sp, 0, 1.0, 0); for (let k = 0; k < 4; k++) box(.25, .12, .06, mat(0x2a2a2a), .02, sp, .12, .35 + k * .42, .6); box(2.2, .3, 1.2, mat(0xd8a810), .1, sp, 0, 2.0, 0); };
const veil = o => { const vm = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .5, roughness: .6, side: THREE.DoubleSide, depthWrite: false });  for (let k = 0; k < 7; k++) sphere(.14, mat([0xffffff, 0xff8ad0][k % 2]), o.head, -.6 + k * .2, 1.45, -.1, 6, 4); };
const gown = sp => { box(2.1, 2.06, 1.12, mat(0xfbf8f2, { roughness: .5 }), .14, sp, 0, 1.02, 0); for (let k = 0; k < 5; k++) sphere(.08, mat(0xf4e0a0, { metalness: .5 }), sp, -.4 + k * .2, 1.9, .58, 6, 4); };
const waistcoat = sp => { box(2.1, 2.06, 1.12, mat(0xf8f8f8, { roughness: .6 }), .14, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.78, 1.9, 1.15, mat(0x6a6a72, { roughness: .6 }), .12, sp, s * .66, .98, 0); const bt = box(.6, .22, .1, mat(0x1a1a22), .05, sp, 0, 2.0, .6); };
const scrubs = sp => { box(2.1, 2.06, 1.12, mat(0x3ab89a, { roughness: .8 }), .14, sp, 0, 1.02, 0); box(.9, .5, .05, mat(0x2a9a7a), .03, sp, 0, 1.75, .58); };
const surgCap = col => o => { const m = mat(col, { roughness: .9 }); const c = sphere(1.0, m, o.head, 0, 1.25, -.05, 16, 8); c.scale.y = .5; box(1.2, .62, .2, mat(0x9adcf0, { roughness: .9 }), .15, o.head, 0, -.2, .72); };
const robe = sp => { box(2.2, 2.1, 1.2, mat(0x1a1a22, { roughness: .7 }), .16, sp, 0, 1.0, 0); box(.9, .25, .1, mat(0xffffff), .04, sp, 0, 2.0, .62); };
const shawl = col => o => { const m = mat(col, { roughness: 1 }); box(2.5, .9, 1.4, m, .3, o.spine, 0, 1.75, 0); box(.9, 1.2, .2, m, .1, o.spine, 0, 1.2, .64).rotation.z = .1; };

export const makeIch = scene => fin(mk(scene, S({ seed: 9801, scale: .78, skin: 0xf0c4a0, shirt: 0x4a6a2a, shirt2: 0x4a6a2a, cuffs: 0x3a5a1e, pants: 0x7a5a3a, shoes: 0x4a2a14, sole: 0x2a1a0a, hair: 0x3a2214, hairBuild: curly(0x3a2214),
  torsoDetail: mossJacket, face: { iris: '#4a7a3a', browColor: '#2a160a', blush: .45, freckles: 1 } }), [scarf(0xe8b020)]));
export const makeLotte = scene => fin(mk(scene, S({ seed: 9802, scale: .76, skin: 0xf8d8c0, shirt: 0x7ab8f0, shirt2: 0x7ab8f0, cuffs: 0xffffff, sleeveShort: true, pants: 0xd8202a, skirt: 0x7ab8f0, shoes: 0x2a2a30, sole: 0x1a1a1a, hair: 0xf0c860, hairBuild: braids(0xf0c860),
  torsoDetail: dressBlue, face: { iris: '#2a7ad8', browColor: '#c8a040', blush: .6, freckles: 1 } })));
export const makeFischer = scene => fin(mk(scene, S({ seed: 9803, scale: .96, skin: 0xe8b090, shirt: 0xf2c81a, shirt2: 0xf2c81a, cuffs: 0xd8a810, pants: 0x2a3a4a, shoes: 0x2a8a4a, sole: 0x1a5a2a, hair: 0xf0f0f0, hairBuild: hairS(0xf0f0f0, 'bald'),
  torsoDetail: raincoat, face: { iris: '#4a7aa8', browColor: '#f0f0f0', blush: .5 } }), [sou, beard(0xf4f4f4)]));
export const makeBraut = scene => fin(mk(scene, S({ seed: 9804, scale: .9, skin: 0xd8a07a, shirt: 0xfbf8f2, shirt2: 0xfbf8f2, cuffs: 0xfbf8f2, pants: 0xfbf8f2, skirt: 0xfbf8f2, shoes: 0xfbf8f2, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'bun'), torsoDetail: gown, face: { iris: '#3a2410', browColor: '#2a1a10', blush: .55 } }), [veil]));
export const makeBraeutigam = scene => fin(mk(scene, S({ seed: 9805, scale: .96, skin: 0xf2c4a0, shirt: 0x6a6a72, shirt2: 0xf8f8f8, cuffs: 0xf8f8f8, pants: 0x4a4a52, shoes: 0x1a1a1a, hair: 0xb8441a, hairBuild: hairS(0xb8441a, 'swoop'), torsoDetail: waistcoat, face: { iris: '#3a6a8a', browColor: '#8a3010', blush: .4, freckles: 1 } })));
export const makeBeamtin = scene => fin(mk(scene, S({ seed: 9806, scale: .92, skin: 0xf4cfb6, shirt: 0x1a1a22, shirt2: 0x1a1a22, cuffs: 0xffffff, pants: 0x1a1a22, skirt: 0x1a1a22, shoes: 0x1a1a1a, hair: 0x8a8a92, hairBuild: hairS(0x8a8a92, 'bun'), torsoDetail: robe, face: { iris: '#3a3a3a', browColor: '#6a6a72', blush: .3 } }), [o => glasses(o.head)]));
export const makeChirurg = (scene, i) => fin(mk(scene, S({ seed: 9807 + i, scale: .95, skin: [0xc68b5e, 0xf2c4a0][i % 2], shirt: 0x3ab89a, shirt2: 0x3ab89a, cuffs: 0x3ab89a, pants: 0x3ab89a, shoes: 0xf4f4f4, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'bald'), torsoDetail: scrubs, face: { iris: '#3a2410', browColor: '#2a1a10' } }), [surgCap(i ? 0x2a6ad8 : 0x3ab89a)]));
export const makeSuppe = scene => fin(mk(scene, S({ seed: 9809, scale: 1.0, skin: 0xeab08a, shirt: 0xf4f0e4, shirt2: 0xf4f0e4, cuffs: 0xf4f0e4, pants: 0x5a3a2a, shoes: 0x2a1a10, hair: 0x6a3a1a, hairBuild: hairS(0x6a3a1a, 'swoop'),
  torsoDetail: sp => { box(2.1, 2.06, 1.12, mat(0xf4f0e4), .14, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.8, 1.9, 1.15, mat(0xa8322a, { roughness: .8 }), .12, sp, s * .65, .98, 0); box(1.4, .9, .06, mat(0xffffff), .04, sp, 0, 1.6, .6); }, face: { iris: '#3a2410', browColor: '#4a2410', blush: .5 } }), [o => mustache(o.head, 0x4a2410)]));
export const makeOma = scene => fin(mk(scene, S({ seed: 9810, scale: .84, skin: 0xf2cfb4, shirt: 0x8a4a9a, shirt2: 0x8a4a9a, cuffs: 0x6a3a7a, pants: 0x3a2a3a, skirt: 0x3a2a3a, shoes: 0x2a1a1a, hair: 0xf0f0f0, hairBuild: hairS(0xf0f0f0, 'bun'), face: { iris: '#5a6a8a', browColor: '#d8d8d8', blush: .4 } }), [shawl(0x6a2a7a), o => glasses(o.head)]));
export const makeMutter = scene => fin(mk(scene, S({ seed: 9811, scale: .9, skin: 0x8a5a3a, shirt: 0xff8a3a, shirt2: 0xff8a3a, cuffs: 0xd86a1a, pants: 0x2a3a5a, shoes: 0xf4f4f4, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'pony'), face: { iris: '#2a1a10', browColor: '#1a120c', blush: .3 } })));
// bebé envuelto en una manta (fardo) para llevar en brazos
export function wickel(col = 0xff8ad0) { const g = new THREE.Group(); const m = mat(col, { roughness: 1 }); box(2.0, .9, .95, m, .4, g, -.3, 0, 0); const h = sphere(.5, mat(0xf4cfb6, { roughness: .6 }), g, .95, .12, .08, 12, 10);
  for (const s of [-1, 1]) sphere(.065, mat(0x1a1a1a), g, .95 + s * .17, .2, .55, 6, 4); const mo = box(.2, .1, .05, mat(0x8a2a2a), .03, g, .95, -.04, .57); g.userData.mouth = mo; const cap = sphere(.54, m, g, 1.05, .32, -.05, 12, 8); cap.scale.set(1, .75, 1);
  sphere(.16, mat(0xff9ab0), g, .95, .02, .55, 6, 4).scale.set(1, .5, .3); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; }
