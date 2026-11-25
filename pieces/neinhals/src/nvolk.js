// NEINHALS — reparto propio (nadie se parece al vídeo de referencia):
// ich (Luca, ≈15): pelo castaño claro con tupé, sudadera naranja con capucha y cordones, vaqueros claros, zapatillas blancas con suela verde.
// der Mann (Schwiegersohn): camisa de cuadros verde, barba corta castaña. die Schwiegermutter: rulos lilas, rebeca rosa, perlas, bolso.
// Mama: moño castaño, delantal amarillo con flores sobre jersey azul. Nachbar (Herr Vogt): polo blanco, gafas de sol, bigote, reloj dorado.
// Timo: gorra roja al revés, camiseta negra con raya amarilla. Freundin (Jana): coleta rubia, top verde menta, pendientes de aro.
// Marco (el abusón): pelo negro de pinchos, chaqueta universitaria azul con mangas blancas y «M». Herr Kranich (el anciano): pelo blanco,
// traje color crema, pajarita roja, bastón dorado, sombrero. Arbeiter: mono azul, casco amarillo. Bürgermeister: traje gris, cadena dorada, bigote.
import { THREE, mat, box, cyl, sphere, textPlane } from './engine.js';
import { mk, hairS, glasses, mustache, cap, shades, topHat } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
export function makeLuca(scene) { return mk(scene, S({ seed: 9601, scale: .92, skin: 0xf2c6a2, shirt: 0xff7a1a, shirt2: 0xff7a1a, cuffs: 0xe8620a, pants: 0x7aa0d0, shoes: 0xf6f6f2, sole: 0x2ab86a, hair: 0x9a6a3a, hairBuild: hairS(0x9a6a3a, 'swoop'),
  torsoDetail: sp => { box(2.1, 2.06, 1.12, mat(0xff7a1a, { roughness: .85 }), .14, sp, 0, 1.02, 0); box(1.6, .7, .1, mat(0xe8620a), .05, sp, 0, .5, .57); for (const s of [-1, 1]) { cyl(.05, .05, .7, mat(0xffffff), 6, sp, s * .25, 1.6, .6); sphere(.08, mat(0xffffff), sp, s * .25, 1.24, .6, 6, 4); }
    const hood = box(1.9, .5, .6, mat(0xe8620a, { roughness: .9 }), .2, sp, 0, 2.0, -.5); },
  face: { iris: '#4a7a3a', browColor: '#7a4a22', blush: .3, freckles: true } })); }
export function makeMann(scene) { const tT = check('#2a8a4a', '#1a5a2a'); return mk(scene, S({ seed: 9602, scale: 1.0, skin: 0xe8b08c, shirtMap: tT, shirt2: null, cuffs: 0x1a5a2a, pants: 0x4a4e5a, shoes: 0x5a3a22, hair: 0x6a4a2a, hairBuild: hairS(0x6a4a2a, 'fringe'),
  face: { iris: '#3a2a1a', browColor: '#5a3a1a', blush: .2 } }), [o => { box(1.36, .5, .3, mat(0x6a4a2a, { roughness: .9 }), .15, o.head, 0, .3, .55); }]); }
export function makeSchwieger(scene) { return mk(scene, S({ seed: 9603, scale: .86, skin: 0xf4cfb6, shirt: 0xff8ab8, shirt2: 0xff8ab8, cuffs: 0xffffff, pants: 0x8a6ab8, skirt: true, shoes: 0xb8323a, hair: 0xc8a8e8, hairBuild: hairS(0xc8a8e8, 'curly'),
  torsoDetail: sp => { box(2.12, 2.06, 1.12, mat(0xff8ab8, { roughness: .95 }), .14, sp, 0, 1.02, 0); for (let k = 0; k < 9; k++) sphere(.09, mat(0xffffff, { roughness: .2 }), sp, -.4 + k * .1, 1.75 - Math.sin(k / 8 * Math.PI) * .25, .6, 6, 4); },
  face: { iris: '#3a5a8a', browColor: '#8a7a9a', blush: .5, lips: '#c8304a' } }), [o => glasses(o.head)]); }
export function makeMama(scene) { return mk(scene, S({ seed: 9604, scale: .9, skin: 0xe8b896, shirt: 0x3a6ad8, shirt2: 0x3a6ad8, cuffs: 0x2a5ac8, pants: 0x2a3a5a, shoes: 0xf4f4f4, hair: 0x6a3a1a, hairBuild: hairS(0x6a3a1a, 'bun'),
  torsoDetail: sp => { box(1.7, 2.0, .1, mat(0xffd23f, { roughness: .8 }), .05, sp, 0, .9, .57); for (let k = 0; k < 5; k++) sphere(.12, mat([0xff5a8a, 0xffffff][k % 2]), sp, -.5 + k * .25, .6 + (k % 2) * .5, .64, 6, 4); },
  face: { iris: '#4a3a2a', browColor: '#5a2a10', blush: .4, lips: '#c84a5a' } })); }
export function makeVogt(scene) { return mk(scene, S({ seed: 9605, scale: 1.02, skin: 0xd8a07a, shirt: 0xffffff, shirt2: 0xd8a07a, cuffs: 0xffffff, pants: 0xc8b48a, shoes: 0x6a3a1a, hair: 0x3a2214, hairBuild: hairS(0x3a2214, 'swoop'), sleeveShort: true,
  torsoDetail: sp => { box(2.1, 2.06, 1.12, mat(0xffffff, { roughness: .7 }), .14, sp, 0, 1.02, 0); box(.9, .3, .1, mat(0xe8e8e8), .02, sp, 0, 1.9, .58); for (let k = 0; k < 2; k++) sphere(.06, mat(0x1a1a1a), sp, 0, 1.6 - k * .25, .6, 6, 4); },
  face: { iris: '#2a2a2a', browColor: '#3a2214', blush: .2 } }), [o => shades(o.head), o => mustache(o.head, 0x3a2214), o => { cyl(.42, .42, .2, mat(0xf2c230, { metalness: .9, roughness: .2 }), 14, o.aL.el, 0, -.9, 0); }]); }
export function makeTimo(scene) { return mk(scene, S({ seed: 9606, scale: .95, skin: 0xc68b5e, shirt: 0x1a1a22, shirt2: 0x1a1a22, cuffs: 0x1a1a22, pants: 0x3a4a6a, shoes: 0xd8323a, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'fringe'), sleeveShort: true,
  torsoDetail: sp => { box(2.1, 2.06, 1.12, mat(0x1a1a22, { roughness: .8 }), .14, sp, 0, 1.02, 0); box(2.12, .3, 1.14, mat(0xffd23f), .02, sp, 0, 1.2, 0); },
  face: { iris: '#2a1a10', browColor: '#1a120c', blush: .2 } }), [o => { const c = cap(o.head, 0xd8323a, 0xffffff); }, o => { o.head.children.filter(m => m.geometry && m.geometry.type === 'BoxGeometry').slice(-1); }]); }
export function makeJana(scene) { return mk(scene, S({ seed: 9607, scale: .88, skin: 0xf4cfb6, shirt: 0x7ae8c0, shirt2: 0xf4cfb6, cuffs: 0x7ae8c0, pants: 0xf4f4f4, shoes: 0xff8ad0, hair: 0xf0c850, hairBuild: hairS(0xf0c850, 'pony'), sleeveShort: true,
  face: { iris: '#3a7ab8', browColor: '#c8a040', blush: .5, lips: '#e04a6a' } }), [o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.18, .04, 6, 14), mat(0xf2c230, { metalness: .9, roughness: .2 })); r.position.set(s * .74, .3, 0); r.rotation.y = Math.PI / 2; o.head.add(r); } }]); }
export function makeMarco(scene) { return mk(scene, S({ seed: 9608, scale: .96, skin: 0xf0c4a2, shirt: 0x1a3a8a, shirt2: 0xf4f4f4, cuffs: 0xf4f4f4, pants: 0x1a1a24, shoes: 0x1a1a1a, sole: 0xffffff, hair: 0x101010, hairBuild: hairS(0x101010, 'spiky'),
  torsoDetail: sp => { box(2.12, 2.06, 1.12, mat(0x1a3a8a, { roughness: .7 }), .14, sp, 0, 1.02, 0); box(2.14, .2, 1.14, mat(0xf4f4f4), .02, sp, 0, .12, 0); const l = textPlane(.6, .6, 64, 64, (c, w, h) => { c.fillStyle = '#f4f4f4'; c.font = '700 56px Cap'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('M', 32, 36); }); l.position.set(-.55, 1.45, .58); sp.add(l); },
  face: { iris: '#5a3a1a', browColor: '#101010', blush: .15 } })); }
export function makeKranich(scene) { return mk(scene, S({ seed: 9609, scale: .9, skin: 0xf2cfb4, shirt: 0xf0e4c8, shirt2: 0xf0e4c8, cuffs: 0xffffff, pants: 0xf0e4c8, shoes: 0x5a3a22, hair: 0xf4f4f4, hairBuild: hairS(0xf4f4f4, 'swoop'),
  torsoDetail: sp => { box(2.12, 2.06, 1.12, mat(0xf0e4c8, { roughness: .6 }), .14, sp, 0, 1.02, 0); box(.6, 1.6, .1, mat(0xffffff), .02, sp, 0, 1.2, .57); const b = box(.6, .26, .14, mat(0xd8202a), .05, sp, 0, 1.92, .62); sphere(.1, mat(0xd8202a), sp, 0, 1.92, .66, 6, 4); for (let k = 0; k < 3; k++) sphere(.07, mat(0xd9a531, { metalness: .8 }), sp, .5, 1.3 - k * .3, .6, 6, 4); },
  face: { iris: '#3a5a7a', browColor: '#f4f4f4', blush: .3 } }), [o => mustache(o.head, 0xf4f4f4), o => { const m = mat(0xf0e4c8, { roughness: .5 }); cyl(1.0, 1.0, .08, m, 28, o.head, 0, 1.28, 0); cyl(.68, .7, .7, m, 24, o.head, 0, 1.66, 0); cyl(.71, .71, .18, mat(0x6a3a1a), 24, o.head, 0, 1.4, 0); }]); }
export function makeArbeiter(scene, i = 0) { return mk(scene, S({ seed: 9610 + i, scale: .98, skin: [0xd8a07a, 0x8a5a3a, 0xf2c4a0][i % 3], shirt: 0x2a5ab8, shirt2: 0x2a5ab8, cuffs: 0x1a4a98, pants: 0x2a5ab8, shoes: 0x3a2a1a, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'bald'),
  torsoDetail: sp => { box(2.1, 2.06, 1.12, mat(0x2a5ab8, { roughness: .8 }), .14, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.3, 2.0, .1, mat(0x1a4a98), .02, sp, s * .5, 1.0, .58); box(.7, .5, .1, mat(0x1a4a98), .02, sp, 0, 1.3, .6); },
  face: { iris: '#3a2a1a', browColor: '#2a1a10', blush: .2 } }), [o => { const m = mat(0xffd21a, { roughness: .4 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.78, 20, 10, 0, 6.283, 0, 1.4), m); c.position.y = 1.02; c.scale.y = .78; o.head.add(c); box(1.8, .1, 1.8, m, .05, o.head, 0, 1.08, .1); }]); }
export function makeBM(scene) { return mk(scene, S({ seed: 9620, scale: 1.04, skin: 0xf0bc98, shirt: 0x6a6e7a, shirt2: 0x6a6e7a, cuffs: 0xffffff, pants: 0x5a5e6a, shoes: 0x1a1a1a, hair: 0xb8b8b8, hairBuild: hairS(0xb8b8b8, 'swoop'),
  torsoDetail: sp => { box(2.12, 2.06, 1.12, mat(0x6a6e7a, { roughness: .6 }), .14, sp, 0, 1.02, 0); box(.6, 1.7, .1, mat(0xffffff), .02, sp, 0, 1.1, .57); box(.22, 1.2, .12, mat(0xd8202a), .02, sp, 0, 1.2, .62);
    const gm = mat(0xf2c230, { metalness: .9, roughness: .2 }); for (let k = 0; k < 13; k++) { const a = k / 12 * Math.PI; sphere(.1, gm, sp, Math.cos(a) * .8, 1.95 - Math.sin(a) * .7, .6, 6, 4); } const md = cyl(.32, .32, .08, gm, 16, sp, 0, 1.1, .66); md.rotation.x = Math.PI / 2; },
  face: { iris: '#2a3a5a', browColor: '#9a9a9a', blush: .35 } }), [o => mustache(o.head, 0x9a9a9a), o => topHat(o.head, 0x1a1a22, 0xd8202a)]); }
// cuadros para camisas
import { canvasTex } from './engine.js';
function check(a, b) { const t = canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let i = 0; i < 4; i++) { c.globalAlpha = .55; c.fillRect(i * 16, 0, 7, h); c.fillRect(0, i * 16, w, 7); } c.globalAlpha = 1; }, true); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); return t; }
