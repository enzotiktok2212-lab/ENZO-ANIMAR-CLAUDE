// CODEWORT — reparto (distinto del original): Mats (yo, 12): pelo rubio oscuro, sudadera verde bosque con cordones, vaqueros;
// Ida (7): coletas pelirrojas, pijama azul cielo con estrellas, peluche de conejo; Mama: melena castaña, abrigo de invierno camel con bufanda roja
// (en la oficina: rebeca gris y blusa); la Cosa = Mama con la sonrisa hasta las orejas; Papa (Montage): chaleco naranja y casco;
// Frau Kessler: rulos, gafas, rebeca verde menta; los Brandt (5); Herr Pohl (gafas, bigote, chaleco de punto) y su máscara de goma; compañeros y amigos.
import { THREE, mat, box, cyl, sphere } from './engine.js';
import { mk, hairS, glasses, mustache, hoodie, jacket } from './props.js';
import { pjT } from './svolk.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const coat = (col, scarf) => sp => { const m = mat(col, { roughness: .85 }); box(2.2, 2.3, 1.2, m, .16, sp, 0, .95, 0); for (const s of [-1, 1]) { box(.5, .9, .08, mat(col, { roughness: .9 }), .04, sp, s * .6, .3, .61); } for (let k = 0; k < 3; k++) for (const s of [-1, 1]) sphere(.08, mat(0x3a2414), sp, s * .3, .6 + k * .5, .63, 6, 4);
  const sc = mat(scarf, { roughness: 1 }); const r = new THREE.Mesh(new THREE.TorusGeometry(.62, .24, 8, 16), sc); r.rotation.x = Math.PI / 2; r.position.y = 2.05; sp.add(r); box(.5, 1.2, .25, sc, .1, sp, .35, 1.5, .62); };
const cardigan = (col, shirt = 0xf4f0e8) => sp => { box(2.1, 2.06, 1.12, mat(col, { roughness: .95 }), .14, sp, 0, 1.0, 0); box(.6, 1.8, .06, mat(shirt), .02, sp, 0, 1.2, .57); for (let k = 0; k < 4; k++) sphere(.09, mat(0x3a2414), sp, -.38, .4 + k * .4, .6, 8, 6); };
const vest = (col, shirt) => sp => { box(2.12, 2.0, 1.14, mat(col, { roughness: 1 }), .14, sp, 0, 1.0, 0); const v = box(.8, .9, .06, mat(shirt), .02, sp, 0, 1.7, .58); v.rotation.z = Math.PI / 4; box(.25, 1.2, .07, mat(0x6a2a2a), .02, sp, 0, 1.2, .6); };
const hivis = sp => { box(2.14, 2.0, 1.16, mat(0xff7a1a, { roughness: .6 }), .14, sp, 0, 1.0, 0); for (const y of [.5, 1.1]) box(2.18, .22, 1.2, mat(0xe8e8e0, { roughness: .2, metalness: .4 }), .04, sp, 0, y, 0); };
const helmet = col => o => { const m = mat(col, { roughness: .35 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.8, 20, 10, 0, 6.283, 0, 1.45), m); c.position.y = 1.15; c.scale.set(1, .7, 1); o.head.add(c); box(1.7, .1, 1.9, m, .05, o.head, 0, 1.12, .15); };
const pigtails = col => h => { hairS(col, 'fringe')(h); const m = mat(col, { roughness: .55 }); for (const s of [-1, 1]) { sphere(.32, m, h, s * .78, 1.0, -.2, 10, 8); const t = box(.36, .9, .36, m, .14, h, s * .92, .45, -.2); t.rotation.z = s * .25; sphere(.12, mat(0xffd23f), h, s * .8, .95, -.2, 6, 4); } };
const longHair = col => h => { hairS(col, 'long')(h); const m = mat(col, { roughness: .5 }); box(1.4, .55, .5, m, .22, h, .05, 1.15, .4).rotation.z = -.12; box(1.5, 1.6, .6, m, .25, h, 0, .3, -.6); };
const curlyWhite = h => { const m = mat(0xf2f0ec, { roughness: .9 }); for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283; sphere(.34, m, h, Math.cos(a) * .62, 1.1 + (i % 3) * .12, Math.sin(a) * .62, 10, 8); } sphere(.6, m, h, 0, 1.45, 0, 12, 8); };
const curlers = o => { for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 1.6 - .3; const c = cyl(.17, .17, .55, mat([0xff8ab0, 0x8ad0ff, 0xffd23f][k % 3], { roughness: .4 }), 10, o.head, Math.cos(a) * .5, 1.5, Math.sin(a) * .4 - .1); c.rotation.z = Math.PI / 2; c.rotation.y = a; } };
const beard = col => o => { const m = mat(col, { roughness: .9 }); box(1.34, .6, .4, m, .18, o.head, 0, .22, .5); for (const s of [-1, 1]) box(.24, .7, .9, m, .08, o.head, s * .62, .5, .1); };
const pjTop = (col, trim = 0xffffff) => sp => { const m = mat(trim, { roughness: .7 }); box(.7, .12, .06, m, .02, sp, 0, 2.0, .57); for (let k = 0; k < 3; k++) sphere(.08, m, sp, 0, .6 + k * .45, .58, 6, 4); };
const starPJ = () => pjT('#8ac4f0', '#fff6c0', 'dots');

export const makeMats = scene => mk(scene, S({ seed: 7101, scale: .92, skin: 0xf2c6a2, shirt: 0x2e5e3a, shirt2: 0x2e5e3a, cuffs: 0x2e5e3a, pants: 0x34466a, shoes: 0xf4f4f4, sole: 0xd8323a, hair: 0x8a6a3a, hairBuild: hairS(0x8a6a3a, 'swoop'),
  torsoDetail: hoodie(0x2e5e3a, 0xf4f4f4), face: { iris: '#3a5a3a', browColor: '#6a4a24', blush: .3, freckles: 1 } }));
export function makeIda(scene) { const t = starPJ(); const o = mk(scene, S({ seed: 7102, scale: .7, skin: 0xf4cdb0, shirt: 0x8ac4f0, shirtMap: t, cuffs: 0xffffff, pants: 0x8ac4f0, shoes: 0xf4cdb0, sole: 0xe0b090, hair: 0xb8501a, hairBuild: pigtails(0xb8501a),
  torsoDetail: pjTop(0x8ac4f0), face: { iris: '#4a6a2a', browColor: '#8a3a10', blush: .6, freckles: 1 } })); o.root.traverse(m => { if (m.isMesh && m.material.color && m.material.color.getHex() === 0x8ac4f0 && !m.material.map) { m.material = m.material.clone(); m.material.map = t; m.material.color.set(0xffffff); } }); return o; }
export const makeMama = scene => mk(scene, S({ seed: 7103, scale: 1.0, skin: 0xf2c4a4, shirt: 0xc89a62, shirt2: 0xc89a62, cuffs: 0xc89a62, pants: 0x2a2a34, shoes: 0x3a2414, hair: 0x6a3418, hairBuild: longHair(0x6a3418),
  torsoDetail: coat(0xc89a62, 0xb8262e), face: { iris: '#4a3018', browColor: '#4a2410', blush: .35 } }));
export const makeMamaB = scene => mk(scene, S({ seed: 7104, scale: 1.0, skin: 0xf2c4a4, shirt: 0x8a8a92, shirt2: 0x8a8a92, cuffs: 0x8a8a92, pants: 0x2a2a34, shoes: 0x3a2414, hair: 0x6a3418, hairBuild: longHair(0x6a3418),
  torsoDetail: cardigan(0x8a8a92, 0xf4f0f4), face: { iris: '#4a3018', browColor: '#4a2410', blush: .35 } }));
export const makePapa = scene => mk(scene, S({ seed: 7105, scale: 1.05, skin: 0xe8b090, shirt: 0x3a4a6a, shirt2: 0x3a4a6a, cuffs: 0x3a4a6a, pants: 0x3a3a42, shoes: 0x3a2414, hair: 0x4a2a14, hairBuild: hairS(0x4a2a14, 'fringe'),
  torsoDetail: hivis, face: { iris: '#3a2a1a', browColor: '#3a2010', blush: .3 } }), [helmet(0xffd200), beard(0x4a2a14)]);
export const makeKessler = scene => mk(scene, S({ seed: 7106, scale: .9, skin: 0xf4cdb8, shirt: 0x8ad8b8, shirt2: 0x8ad8b8, cuffs: 0x8ad8b8, pants: 0x6a4a6a, skirt: 0x6a4a6a, shoes: 0x3a2414, hair: 0xf2f0ec, hairBuild: curlyWhite,
  torsoDetail: cardigan(0x8ad8b8, 0xf4e8f0), face: { iris: '#4a6a8a', browColor: '#c8c8c8', blush: .6, bags: 1 } }), [o => glasses(o.head), curlers]);
export const makePohl = scene => mk(scene, S({ seed: 7107, scale: 1.05, skin: 0xf0c0a0, shirt: 0xe8e4d8, shirt2: 0xe8e4d8, cuffs: 0xe8e4d8, pants: 0x5a4a3a, shoes: 0x3a2414, hair: 0x7a5a3a, hairBuild: hairS(0x7a5a3a, 'swoop'),
  torsoDetail: vest(0x8a6a3a, 0xe8e4d8), face: { iris: '#3a4a5a', browColor: '#5a3a1a', blush: .4 } }), [o => glasses(o.head), o => mustache(o.head, 0x5a3a1a)]);
// los Brandt: padre (barba), madre (moño), tres hijos
const BR = [
  [7110, 1.05, 0xe8b898, 0x5a3a6a, 0x2a2a3a, 0x3a2414, 'swoop', 0, 0], [7111, 1.0, 0xf4cdb0, 0xd86a8a, 0x3a3a4a, 0xc8a050, 'bun', 0, 1],
  [7112, .82, 0xf4cdb0, 0x3a9ad8, 0x2a3a5a, 0xc8a050, 'spiky', 0, 0], [7113, .74, 0xf4cdb0, 0xf2b33d, 0x3a3a5a, 0xc8a050, 'pony', 0, 1], [7114, .62, 0xf4cdb0, 0x8ad84a, 0x3a3a5a, 0xc8a050, 'fringe', 0, 0]];
export const makeBrandt = (scene, i) => { const [seed, sc, sk, sh, pa, hr, st, bd, girl] = BR[i]; return mk(scene, S({ seed, scale: sc, skin: sk, shirt: sh, shirt2: sh, cuffs: sh, pants: pa, shoes: 0x2a2a2a, hair: hr, hairBuild: hairS(hr, st),
  torsoDetail: i === 0 ? jacket(sh, 0xf4f4f4) : hoodie(sh, 0xffffff), face: { iris: '#3a4a5a', blush: .4 }, ...(girl && i === 1 ? { skirt: pa } : {}) }), bd ? [beard(0x3a2414)] : []); };
// compañeros de clase / amigos (ropa variada)
const KC = [[0xd8323a, 0xe0b850, 'spiky', 0xf2c6a2], [0x2a6ad8, 0x1a120c, 'fringe', 0xc68b5e], [0xffd23f, 0xb8441a, 'pony', 0xf4cdb0], [0x8ad84a, 0x6a3a1a, 'curly', 0x8d5a3b], [0xb84ad8, 0x1a120c, 'bun', 0xf2c6a2], [0xf28a2a, 0x3a2414, 'swoop', 0xe8b090], [0x2ab8a8, 0xe0b850, 'long', 0xf4cdb0], [0x5a5a6a, 0x1a120c, 'fringe', 0xa8693f]];
export const makeKid = (scene, i) => { const [sh, hr, st, sk] = KC[i % KC.length]; return mk(scene, S({ seed: 7200 + i, scale: .86 + (i % 3) * .03, skin: sk, shirt: sh, shirt2: sh, cuffs: sh, pants: [0x2a3a5a, 0x3a3a42, 0x5a4a3a][i % 3], shoes: [0xf4f4f4, 0x1a1a1a, 0xd8323a][i % 3], hair: hr, hairBuild: hairS(hr, st),
  torsoDetail: i % 2 ? hoodie(sh, 0xffffff) : null, face: { blush: .35, freckles: i % 3 === 0 ? 1 : 0 } })); };
// los «Anrufer» del bosque: ropa normal pero pálidos; la cara se pone con kitFace y la sonrisa con { creep }
const CL = [[0xd8d0c8, 0x6a5a8a, 0x3a3a42, 0xe8e8e8, 'bald', .95], [0xd8ccc4, 0x3a5a3a, 0x2a2a34, 0x4a3a2a, 'swoop', 1.05], [0xdcd0c6, 0x8a3a3a, 0x2a2a34, 0x3a2a1a, 'long', 1.0], [0xd8d0c8, 0x3a6a8a, 0x2a3a5a, 0xb8501a, 'fringe', .78]];
export const makeCaller = (scene, i) => { const [sk, sh, pa, hr, st, sc] = CL[i % CL.length]; return mk(scene, S({ seed: 7300 + i, scale: sc, skin: sk, shirt: sh, shirt2: sh, cuffs: sh, pants: pa, shoes: 0x1a1a1a, hair: hr, hairBuild: hairS(hr, st), torsoDetail: i === 2 ? coat(sh, 0x2a2a2a) : cardigan(sh), face: { iris: '#1a1a1a', blush: 0 } }), i === 0 ? [o => glasses(o.head)] : []); };
