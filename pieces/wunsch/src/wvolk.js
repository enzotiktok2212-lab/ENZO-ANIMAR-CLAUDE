// WUNSCH — reparto propio (distinto del vídeo de referencia y de los demás vídeos del canal).
// Ich (12, el que más duerme): pelo castaño revuelto con remolino, pijama azul noche con estrellas amarillas / de día sudadera verde lima y vaqueros.
// Mia (5, mi hermana): dos coletas rubias con gomas rojas, pijama rosa de lunares / de día vestido amarillo con chaqueta roja.
// Oma Hilde: moño gris, gafas, rebeca verde musgo, delantal de flores, guantes de jardín. Mama: melena castaña, pijama lila. Papa: barba, pijama de cuadros verdes.
// Herr Graufeld: alto y delgado, traje gris marengo, chistera gris, bigote fino, raya engominada. Emma: melena rubia larga, chaqueta rosa.
// Ben: gorra negra del revés, sudadera negra con capucha, cadena. Lea: media melena negra, gafas, jersey morado. Herr Becker: granjero, sombrero de paja, peto vaquero.
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, mustache, cap, hoodie, chain, topHat, suit, jacket } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const pj = (a, b, kind = 'dots') => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b;
  if (kind === 'dots') { for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) { c.beginPath(); c.arc(x * 22 + (y % 2) * 11 + 6, y * 22 + 8, 4.5, 0, 7); c.fill(); } }
  else if (kind === 'check') { c.globalAlpha = .5; for (let i = 0; i < 6; i++) { c.fillRect(i * 22, 0, 11, h); c.fillRect(0, i * 22, w, 11); } c.globalAlpha = 1; }
  else if (kind === 'stars') { for (let i = 0; i < 9; i++) { const x = (i * 47) % 128 + 8, y = (i * 71) % 128 + 8, s = 7; c.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283 - 1.57, r = k % 2 ? s * .45 : s; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.fill(); } }
  else if (kind === 'flowers') { for (let i = 0; i < 12; i++) { const x = (i * 37) % 128, y = (i * 53) % 128; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + Math.cos(k * 1.26) * 4, y + Math.sin(k * 1.26) * 4, 3, 0, 7); c.fill(); } c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); c.fillStyle = b; } } }, true);
const pantsMap = (ch, t) => { for (const lg of [ch.lL, ch.lR]) { const m = lg.hp.children[0].material; m.map = t; m.color.setHex(0xffffff); m.needsUpdate = true; } };
const pjTop = (pip = 0xffffff) => sp => { for (const s of [-1, 1]) { const l = box(.6, .5, .1, mat(pip, { roughness: .8 }), .05, sp, s * .32, 1.82, .56); l.rotation.z = s * .5; } for (let k = 0; k < 4; k++) sphere(.08, mat(pip), sp, 0, .4 + k * .4, .56, 8, 6); box(.5, .5, .06, mat(pip, { roughness: .8 }), .03, sp, -.55, 1.25, .55); };
const slippers = col => o => { for (const lg of [o.lL, o.lR]) box(1.06, .5, 1.4, mat(col, { roughness: 1 }), .2, lg.kn, 0, -.82, .16); };
const beard = col => o => { const m = mat(col, { roughness: .9 }); box(1.34, .6, .4, m, .18, o.head, 0, .22, .5); box(.9, .2, .14, m, .05, o.head, 0, .44, .66); for (const s of [-1, 1]) box(.24, .7, .9, m, .08, o.head, s * .62, .5, .1); };
const cardigan = (col, shirt) => sp => { box(2.1, 2.06, 1.12, mat(col, { roughness: .95 }), .14, sp, 0, 1.0, 0); box(.6, 1.8, .06, mat(shirt), .02, sp, 0, 1.2, .57); for (let k = 0; k < 4; k++) sphere(.09, mat(0xe8d8b0), sp, -.38, .4 + k * .4, .6, 8, 6); for (const s of [-1, 1]) box(.5, .4, .06, mat(col, { roughness: 1 }), .03, sp, s * .6, .6, .58); };
// remolino del protagonista (mechones sueltos arriba)
const ichHair = h => { hairS(0x6a3a1a, 'fringe')(h); const m = mat(0x6a3a1a, { roughness: .6 }); for (let i = 0; i < 5; i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(.16, .6, 5), m); t.position.set(-.2 + i * .1, 1.42, -.1 - i * .06); t.rotation.set(-.6 + i * .2, 0, -.5 + i * .25); h.add(t); } };
// dos coletas con gomas rojas (Mia)
const zoepfe = col => h => { hairS(col, 'fringe')(h); const m = mat(col, { roughness: .55 }), r = mat(0xe8202a, { roughness: .4 }); for (const s of [-1, 1]) { const t = sphere(.34, m, h, s * .86, .95, -.15, 10, 8); t.scale.set(.8, 1.3, .8); const t2 = sphere(.26, m, h, s * 1.02, .5, -.15, 10, 8); t2.scale.set(.8, 1.4, .8); const g = new THREE.Mesh(new THREE.TorusGeometry(.2, .07, 6, 12), r); g.position.set(s * .78, 1.2, -.15); g.rotation.z = s * .9; h.add(g); } };
const strawHat = o => { const m = mat(0xe8c86a, { roughness: .9 }); cyl(1.5, 1.5, .12, m, 28, o.head, 0, 1.3, 0); cyl(.74, .8, .9, m, 24, o.head, 0, 1.75, 0); cyl(.82, .82, .22, mat(0xc8302a), 24, o.head, 0, 1.45, 0); };
const latzhose = (col, shirt) => sp => { box(2.1, 2.06, 1.12, mat(shirt, { roughness: .9 }), .14, sp, 0, 1.0, 0); box(1.7, 1.0, 1.16, mat(col, { roughness: .8 }), .1, sp, 0, .55, 0); box(1.1, .9, .08, mat(col, { roughness: .8 }), .05, sp, 0, 1.3, .58); for (const s of [-1, 1]) { box(.24, 1.1, .08, mat(col), .03, sp, s * .55, 1.6, .58); sphere(.1, mat(0xd9a531, { metalness: .8 }), sp, s * .55, 1.15, .62, 8, 6); } };
const apron = sp => { box(1.6, 1.4, .08, mat(0xffffff, { map: pj('#f4f0e4', '#e8586a', 'flowers'), roughness: .9 }), .05, sp, 0, .6, .6); };
const dress = col => sp => { box(2.1, 2.06, 1.12, mat(col, { roughness: .85 }), .14, sp, 0, 1.0, 0); box(1.4, .22, 1.16, mat(0xffffff), .05, sp, 0, 1.95, 0); };

export function makeIch(scene) { const t = pj('#1e2a5a', '#ffd23f', 'stars'); const o = mk(scene, S({ seed: 9801, scale: .8, skin: 0xf4cba8, shirt: 0x1e2a5a, shirtMap: t, cuffs: 0xffd23f, pants: 0x1e2a5a, shoes: 0xf4cba8, sole: 0xd8a888, hair: 0x6a3a1a, hairBuild: ichHair,
  torsoDetail: pjTop(0xffd23f), face: { iris: '#4a7a3a', browColor: '#5a2a10', blush: .45, freckles: 1 } }), [slippers(0x2a3a7a)]); pantsMap(o, t); return o; }
export function makeIchT(scene) { return mk(scene, S({ seed: 9802, scale: .8, skin: 0xf4cba8, shirt: 0x8ad82a, shirt2: 0x8ad82a, cuffs: 0x6ab81a, pants: 0x3a5a9a, shoes: 0xf4f4f4, sole: 0xe8202a, hair: 0x6a3a1a, hairBuild: ichHair,
  torsoDetail: hoodie(0x8ad82a, 0xffffff), face: { iris: '#4a7a3a', browColor: '#5a2a10', blush: .45, freckles: 1 } })); }
export function makeMia(scene) { const t = pj('#ff9ac8', '#ffffff', 'dots'); const o = mk(scene, S({ seed: 9803, scale: .58, skin: 0xfbd9c3, shirt: 0xff9ac8, shirtMap: t, cuffs: 0xffffff, pants: 0xff9ac8, shoes: 0xfbd9c3, sole: 0xe8b8a0, hair: 0xf2c84a, hairBuild: zoepfe(0xf2c84a),
  torsoDetail: pjTop(0xffffff), face: { iris: '#3a7ac8', browColor: '#c89a2a', blush: .65 } }), [slippers(0xff5a9a)]); pantsMap(o, t); return o; }
export function makeMiaT(scene) { return mk(scene, S({ seed: 9804, scale: .58, skin: 0xfbd9c3, shirt: 0xffd23f, shirt2: 0xe8202a, cuffs: 0xe8202a, pants: 0xfbd9c3, skirt: 0xffd23f, shoes: 0xe8202a, sole: 0xffffff, hair: 0xf2c84a, hairBuild: zoepfe(0xf2c84a),
  torsoDetail: jacket(0xe8202a, 0xffd23f), face: { iris: '#3a7ac8', browColor: '#c89a2a', blush: .65 } })); }
export function makeOma(scene) { return mk(scene, S({ seed: 9805, scale: .84, skin: 0xf4cdb6, shirt: 0x5a7a3a, shirt2: 0x5a7a3a, cuffs: 0x4a6a2a, pants: 0x6a5a4a, skirt: 0x6a5a4a, shoes: 0x5a3a22, hair: 0xd8d8e0, hairBuild: hairS(0xd8d8e0, 'bun'),
  torsoDetail: sp => { cardigan(0x5a7a3a, 0xf4f0e4)(sp); apron(sp); }, face: { iris: '#4a6a9a', browColor: '#c8c8cc', blush: .7, bags: 1 } }), [o => glasses(o.head)]); }
export function makeMama(scene) { const t = pj('#b89ae8', '#ffffff', 'dots'); const o = mk(scene, S({ seed: 9806, scale: .92, skin: 0xf0c4a2, shirt: 0xb89ae8, shirtMap: t, cuffs: 0xffffff, pants: 0xb89ae8, shoes: 0xf0c4a2, sole: 0xd8a888, hair: 0x6a3a1a, hairBuild: hairS(0x6a3a1a, 'long'),
  torsoDetail: pjTop(0xffffff), face: { iris: '#4a3a2a', browColor: '#4a2a10', blush: .5 } }), [slippers(0xf4b8d0)]); pantsMap(o, t); return o; }
export function makePapa(scene) { const t = pj('#3a7a4a', '#d8f0c0', 'check'); const o = mk(scene, S({ seed: 9807, scale: 1.0, skin: 0xe8b090, shirt: 0x3a7a4a, shirtMap: t, cuffs: 0xd8f0c0, pants: 0x3a7a4a, shoes: 0xe8b090, sole: 0xc89070, hair: 0x3a2214, hairBuild: hairS(0x3a2214, 'swoop'),
  torsoDetail: pjTop(0xd8f0c0), face: { iris: '#3a2a1a', browColor: '#2a1608', blush: .35 } }), [beard(0x3a2214), slippers(0x5a3a22)]); pantsMap(o, t); return o; }
export function makeGraufeld(scene) { return mk(scene, S({ seed: 9808, scale: 1.1, skin: 0xe8d0c0, shirt: 0x4a4a52, shirt2: 0x4a4a52, cuffs: 0xffffff, pants: 0x3a3a42, shoes: 0x0e0e12, sole: 0x2a2a2a, hair: 0x7a7a82, hairBuild: hairS(0x7a7a82, 'swoop'),
  torsoDetail: suit(0x4a4a52, 0xf4f4f4, 0x6a1a2a), face: { iris: '#6a6a72', browColor: '#3a3a42', blush: 0 } }), [o => mustache(o.head, 0x3a3a42), o => topHat(o.head, 0x5a5a62, 0x2a2a30)]); }
export function makeEmma(scene) { return mk(scene, S({ seed: 9809, scale: .86, skin: 0xf6d2b8, shirt: 0xffffff, shirt2: 0xff7ab8, cuffs: 0xff7ab8, pants: 0xf4f0e8, shoes: 0xffffff, sole: 0xff7ab8, hair: 0xf2d27a, hairBuild: hairS(0xf2d27a, 'long'),
  torsoDetail: jacket(0xff7ab8, 0xffffff), face: { iris: '#3a8ac8', browColor: '#c8a050', blush: .55 } })); }
export function makeBen(scene) { return mk(scene, S({ seed: 9810, scale: .9, skin: 0xc68b5e, shirt: 0x1a1a1e, shirt2: 0x1a1a1e, cuffs: 0x1a1a1e, pants: 0x5a6a8a, shoes: 0xf4f4f4, sole: 0xe8202a, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'fringe'),
  torsoDetail: sp => { hoodie(0x1a1a1e, 0xffffff)(sp); chain(sp); }, face: { iris: '#3a2410', browColor: '#1a120c', blush: .2 } }), [o => cap(o.head, 0x1a1a1e, 0xffd23f), o => { o.head.children[o.head.children.length - 1].rotation.y = Math.PI; }]); }
export function makeLea(scene) { return mk(scene, S({ seed: 9811, scale: .86, skin: 0xf2c4a0, shirt: 0x7a3ac8, shirt2: 0x7a3ac8, cuffs: 0x5a2aa8, pants: 0x2a2a34, shoes: 0x1a1a1a, sole: 0xf4f4f4, hair: 0x14100c, hairBuild: hairS(0x14100c, 'fringe'),
  face: { iris: '#3a2410', browColor: '#14100c', blush: .45 } }), [o => glasses(o.head), o => { const m = mat(0x14100c, { roughness: .55 }); for (const s of [-1, 1]) box(.34, 1.3, 1.1, m, .12, o.head, s * .7, .5, -.05); box(1.5, 1.2, .3, m, .12, o.head, 0, .55, -.7); }]); }
export function makeBecker(scene) { return mk(scene, S({ seed: 9812, scale: 1.02, skin: 0xe8a888, shirt: 0xc8302a, shirt2: 0xc8302a, cuffs: 0xc8302a, pants: 0x3a5a9a, shoes: 0x5a3a1a, hair: 0xa8a8a8, hairBuild: hairS(0xa8a8a8, 'swoop'),
  torsoDetail: latzhose(0x3a5a9a, 0xc8302a), face: { iris: '#3a5a7a', browColor: '#8a8a8a', blush: .7 } }), [o => mustache(o.head, 0xb8b8b8), strawHat]); }
