// TEDDY — reparto: doce alumnos de un internado-trampa (estética de anime escolar en bloques) + el director osito.
// Ich (Nico): pelo castaño revuelto con un mechón de punta, americana negra sobre sudadera verde, pantalón gris.
// Mira (patinadora): melena azul larga con horquilla, uniforme marinero blanco/azul, falda azul.
// Ollie (tenista): pelo rojo en punta, americana blanca abierta sobre camiseta negra, pendientes, cinta de tenis.
// Koch: tupé negro alto, chaqueta de cocinero blanca con botones dobles, pañuelo rojo.
// Hackerin: media melena morada, gafas redondas grandes, sudadera enorme turquesa.
// Zopf-Mädchen: trenza larga rubio fresa, chaqueta negra corta, falda roja de cuadros, lazo.
// Kopfhörer-Mädchen: pelo lila largo, chaqueta negra, auriculares rojos, corbata morada.
// Extras: motero con tupé y abrigo largo, chico rico rubio con gafas y traje blanco, fan con gafas y mochila, jugadora de pelo negro con lazo rojo, nadadora morena con chándal.
// Director Teddy: osito mitad rosa mitad gris, coronita dorada, un ojo de botón y un ojo de corazón rojo que brilla.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG } from './engine.js';
import { mk, glasses, headphones, suit } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const plaidSk = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; c.globalAlpha = .6; for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 6, h); c.fillRect(0, i * 16, w, 6); } }, true);
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const plaid = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; c.globalAlpha = .5; for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 5, h); c.fillRect(0, i * 16, w, 5); } }, true);
const cap0 = (m, h, sy = .66) => { const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, sy, 1.05); h.add(c); return c; };

// ---------- peinados ----------
const messyAhoge = col => h => { const m = mat(col, { roughness: .55 }); cap0(m, h, .7); for (let i = -2; i <= 2; i++) { const f = box(.3, .5, .26, m, .1, h, i * .26, 1.1, .54); f.rotation.set(-.3, 0, i * .14); }
  for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283, s = new THREE.Mesh(new THREE.ConeGeometry(.22, .5, 5), m); s.position.set(Math.cos(a) * .55, 1.18, Math.sin(a) * .55 - .1); s.rotation.set(Math.sin(a) * .9, 0, -Math.cos(a) * .9); h.add(s); }
  const ah = new THREE.Mesh(new THREE.ConeGeometry(.12, .8, 5), m); ah.position.set(.05, 1.75, .1); ah.rotation.set(-.5, 0, -.3); h.add(ah); box(1.3, .7, .36, m, .14, h, 0, .9, -.54); };
const longBlue = col => h => { const m = mat(col, { roughness: .45 }); cap0(m, h, .7); for (const s of [-1, 1]) { const f = box(.6, .45, .26, m, .12, h, s * .32, 1.12, .54); f.rotation.set(-.3, 0, s * .32); box(.32, 2.0, .9, m, .14, h, s * .68, .1, -.1); }
  box(1.4, 2.3, .42, m, .16, h, 0, .05, -.55); const clip = box(.4, .1, .1, mat(0xffd23f, { metalness: .6, roughness: .3 }), .03, h, -.45, 1.18, .62); clip.rotation.z = .4; };
const redSpikes = col => h => { const m = mat(col, { roughness: .5 }); cap0(m, h, .6); for (let i = 0; i < 9; i++) { const a = i / 9 * 3.6 + 2.6, s = new THREE.Mesh(new THREE.ConeGeometry(.26, .9, 5), m); s.position.set(Math.cos(a) * .5, 1.3, Math.sin(a) * .5 - .15); s.rotation.set(-Math.sin(a) * .9 - .3, 0, -Math.cos(a) * .9); h.add(s); }
  for (let i = -1; i <= 1; i++) { const s = new THREE.Mesh(new THREE.ConeGeometry(.24, .8, 5), m); s.position.set(i * .32, 1.45, .3); s.rotation.x = .6; h.add(s); } };
const pompadour = col => h => { const m = mat(col, { roughness: .35 }); cap0(m, h, .6); const p = box(1.1, .7, 1.5, m, .3, h, 0, 1.45, .55); p.rotation.x = -.25; for (const s of [-1, 1]) box(.24, .7, .9, m, .08, h, s * .66, .8, -.1); };
const bobPurple = col => h => { const m = mat(col, { roughness: .5 }); cap0(m, h, .72); for (let i = -2; i <= 2; i++) { const f = box(.3, .55, .24, m, .1, h, i * .26, 1.08, .55); f.rotation.x = -.25; } for (const s of [-1, 1]) box(.34, 1.1, 1.0, m, .14, h, s * .66, .55, -.08); box(1.4, 1.2, .4, m, .16, h, 0, .55, -.55); };
const braid = col => h => { const m = mat(col, { roughness: .5 }); cap0(m, h, .7); for (const s of [-1, 1]) { const f = box(.6, .45, .26, m, .12, h, s * .32, 1.12, .54); f.rotation.set(-.3, 0, s * .32); }
  for (let k = 0; k < 7; k++) { const b = sphere(.26 - k * .012, m, h, Math.sin(k * 1.4) * .06, .6 - k * .38, -.8 - k * .03, 10, 8); b.scale.set(1, 1.2, 1); } sphere(.16, mat(0xd8283a), h, 0, .9, -.75, 8, 6);
  const bow = box(.7, .3, .12, mat(0xd8283a), .06, h, 0, 1.45, -.4); bow.rotation.x = .4; };
const longLilac = col => h => { const m = mat(col, { roughness: .4 }); cap0(m, h, .7); for (const s of [-1, 1]) { const f = box(.62, .5, .26, m, .12, h, s * .3, 1.1, .54); f.rotation.set(-.3, 0, s * .28); box(.3, 2.3, .8, m, .14, h, s * .7, 0, -.1); }
  box(1.4, 2.7, .44, m, .16, h, 0, -.1, -.55); const br = box(.14, .9, .14, m, .05, h, -.55, .2, .5); br.rotation.z = .1; sphere(.08, mat(0x1a1a1a), h, -.55, -.25, .5, 6, 4); };
const tallPomp = col => h => { const m = mat(col, { roughness: .35 }); cap0(m, h, .55); const p = box(1.0, .6, 2.2, m, .28, h, 0, 1.4, .8); p.rotation.x = -.12; for (const s of [-1, 1]) box(.2, .8, .9, m, .06, h, s * .66, .8, -.1); };
const blondPart = col => h => { const m = mat(col, { roughness: .35 }); cap0(m, h, .64); const s = box(1.0, .36, 1.0, m, .16, h, .16, 1.38, .1); s.rotation.z = -.16; for (let i = 0; i < 3; i++) { const f = box(.3, .55, .24, m, .1, h, .1 + i * .22, 1.05, .56); f.rotation.z = .3; } };
const fanBowl = col => h => { const m = mat(col, { roughness: .6 }); cap0(m, h, .74); box(1.38, .42, .3, m, .14, h, 0, 1.12, .52); };
const himeBlack = col => h => { const m = mat(col, { roughness: .3 }); cap0(m, h, .72); box(1.3, .4, .26, m, .1, h, 0, 1.12, .55); for (const s of [-1, 1]) box(.3, 1.0, .5, m, .1, h, s * .66, .55, .3); box(1.4, 2.5, .44, m, .16, h, 0, 0, -.55); for (const s of [-1, 1]) box(.3, 2.2, .7, m, .1, h, s * .68, .05, -.2);
  const b = box(.9, .4, .14, mat(0xd8283a), .08, h, 0, 1.55, -.3); b.rotation.x = .5; };
const shortBrown = col => h => { const m = mat(col, { roughness: .6 }); cap0(m, h, .64); for (let i = -2; i <= 2; i++) { const f = box(.3, .4, .24, m, .1, h, i * .26, 1.14, .53); f.rotation.set(-.4, 0, i * .2); } sphere(.24, m, h, 0, 1.0, -.75, 10, 8); };

// ---------- ropa ----------
const blazer = (col, inner, hood) => sp => { const j = mat(col, { roughness: .6 }); for (const s of [-1, 1]) box(.72, 2.04, 1.14, j, .1, sp, s * .67, 1.02, 0); box(2.08, 2.04, .5, j, .1, sp, 0, 1.02, -.32); box(.62, 2.0, .06, mat(inner, { roughness: .9 }), .02, sp, 0, 1.02, .56);
  for (const s of [-1, 1]) { const l = box(.34, 1.1, .06, j, .02, sp, s * .38, 1.5, .6); l.rotation.z = s * .35; box(.4, .26, .05, mat(0x000000, { transparent: true, opacity: .2 }), .01, sp, s * .62, .55, .6); sphere(.07, mat(0xd9a531, { metalness: .8 }), sp, s * .36, .7, .6, 6, 4); }
  if (hood) { const hd = box(1.5, .5, .5, mat(inner, { roughness: .9 }), .2, sp, 0, 2.05, -.5); hd.rotation.x = .3; for (const s of [-1, 1]) cyl(.04, .04, .7, mat(0xffffff), 6, sp, s * .16, 1.6, .62); } };
const sailor = (top, collar, tie) => sp => { box(2.06, 2.04, 1.1, mat(top, { roughness: .7 }), .12, sp, 0, 1.02, 0); const c = box(2.1, .5, 1.16, mat(collar), .08, sp, 0, 1.9, -.02); box(1.2, .9, .06, mat(collar), .04, sp, 0, 2.1, -.6);
  for (const s of [-1, 1]) { const v = box(.2, 1.0, .06, mat(collar), .02, sp, s * .32, 1.55, .58); v.rotation.z = s * .5; box(.1, .9, .07, mat(0xffffff), .01, sp, s * .36, 1.55, .6).rotation.z = s * .5; } box(.5, .34, .1, mat(tie), .06, sp, 0, 1.2, .6); };
const chef = () => sp => { const w = mat(0xfbfbf8, { roughness: .8 }); box(2.12, 2.06, 1.14, w, .12, sp, 0, 1.02, 0); for (const s of [-1, 1]) for (let k = 0; k < 3; k++) sphere(.08, mat(0x1a1a1a), sp, s * .4, 1.6 - k * .45, .6, 6, 4); box(1.2, .3, 1.1, mat(0xd8283a), .1, sp, 0, 2.05, .1); };
const bigHoodie = col => sp => { const j = mat(col, { roughness: .9 }); box(2.24, 2.12, 1.22, j, .2, sp, 0, 1.0, -.02); box(1.4, .55, .1, j, .1, sp, 0, .45, .63); const hd = box(1.7, .62, .66, j, .24, sp, 0, 2.0, -.58); hd.rotation.x = .3; for (const s of [-1, 1]) cyl(.04, .04, .8, mat(0xffffff), 6, sp, s * .22, 1.55, .64); };
const shortJacket = (col, inner) => sp => { box(2.04, 2.0, 1.08, mat(inner, { roughness: .8 }), .12, sp, 0, 1.0, 0); const j = mat(col, { roughness: .5 }); for (const s of [-1, 1]) box(.7, 1.3, 1.16, j, .1, sp, s * .68, 1.4, 0); box(2.1, 1.3, .5, j, .1, sp, 0, 1.4, -.34); };
const darkJacketTie = (col, tie) => sp => { const j = mat(col, { roughness: .55 }); box(2.08, 2.06, 1.12, j, .12, sp, 0, 1.02, 0); box(.5, 1.0, .06, mat(0xf4f0f8), .02, sp, 0, 1.5, .57); box(.18, .85, .05, mat(tie), .02, sp, 0, 1.42, .6); };
const longCoat = col => sp => { const j = mat(col, { roughness: .7 }); box(2.16, 2.1, 1.16, j, .12, sp, 0, 1.02, 0); box(.6, 2.0, .06, mat(0xf4f4f4), .02, sp, 0, 1.02, .58); for (const s of [-1, 1]) { const c = box(.7, .3, .6, j, .08, sp, s * .5, 2.0, .3); c.rotation.z = s * .5; } };
const track = (col, pipe) => sp => { const j = mat(col, { roughness: .45 }); box(2.1, 2.08, 1.12, j, .14, sp, 0, 1.02, -.01); box(.07, 1.95, .06, mat(0xd8d8d8, { metalness: .7 }), 0, sp, 0, 1.02, .58); for (const s of [-1, 1]) box(.08, 2.0, .06, mat(pipe), 0, sp, s * 1.06, 1.02, .2); };
const earrings = col => o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 14), mat(col, { metalness: .9, roughness: .2 })); r.position.set(s * .7, .22, .05); r.rotation.y = Math.PI / 2; o.head.add(r); } };
const headband = col => o => { const b = new THREE.Mesh(new THREE.TorusGeometry(.7, .09, 6, 26), mat(col)); b.rotation.x = Math.PI / 2; b.position.y = 1.02; b.scale.z = .95; o.head.add(b); };
const roundGlasses = col => o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.26, .045, 6, 22), mat(col)); r.position.set(s * .3, .75, .66); o.head.add(r); } box(.2, .05, .05, mat(col), 0, o.head, 0, .78, .66); };
const backpack = col => o => { box(1.7, 1.9, .8, mat(col, { roughness: .8 }), .2, o.spine, 0, 1.1, -.95); box(1.2, .8, .3, mat(col * 0 + 0xffd23f), .1, o.spine, 0, .7, -1.4); };

export function makeIch(scene) { return mk(scene, S({ seed: 2101, scale: .92, skin: 0xf2c4a2, shirt: 0x1a1c24, shirt2: 0x1a1c24, cuffs: 0x2a8a4a, pants: 0x5a5e68, shoes: 0xd83a3a, sole: 0xf4f4f4, hair: 0x22306a, hairBuild: messyAhoge(0x22306a),
  torsoDetail: blazer(0x1a1c24, 0x2a8a4a, true), face: { iris: '#3a4a8a', browColor: '#22306a', blush: .3 } })); }
export function makeMira(scene) { return mk(scene, S({ seed: 2102, scale: .88, skin: 0xf8d6c0, shirt: 0xf8f8fc, shirt2: 0xf8f8fc, cuffs: 0x2a3a8a, pants: 0xf8d6c0, shoes: 0x2a3a8a, sole: 0x1a1a1a, socks: 0x1a1a3a, shorts: true, skirt: 0x2a5a4a, hair: 0x2a3a9a, hairBuild: longBlue(0x2a3a9a),
  torsoDetail: sailor(0xf8f8fc, 0x2a5a4a, 0xff6aa8), face: { iris: '#2a5ac8', browColor: '#2a4ab8', blush: .6 } }), [earrings(0xd8dce4)]); }
export function makeOllie(scene) { return mk(scene, S({ seed: 2103, scale: .97, skin: 0xf0c09c, shirt: 0xf6f6f2, shirt2: 0xf6f6f2, cuffs: 0xf6f6f2, pants: 0x2a2a34, shoes: 0xf4f4f4, sole: 0xd8283a, hair: 0xe0302a, hairBuild: redSpikes(0xe0302a),
  torsoDetail: blazer(0xf6f6f2, 0x1a1a1a, false), face: { iris: '#6a4a2a', browColor: '#b8201a', blush: .3 } }), [earrings(0xd8dce4), headband(0x1a1a1a)]); }
export function makeKoch(scene) { return mk(scene, S({ seed: 2104, scale: .9, skin: 0xe8b08a, shirt: 0xfbfbf8, shirt2: 0xfbfbf8, cuffs: 0xfbfbf8, pants: 0x3a3a46, shoes: 0x1a1a1a, hair: 0x1a1414, hairBuild: pompadour(0x1a1414),
  torsoDetail: chef(), face: { iris: '#3a2a1a', browColor: '#1a1414', blush: .4, freckles: 1 } })); }
export function makeHackerin(scene) { return mk(scene, S({ seed: 2105, scale: .8, headScale: 1.05, skin: 0xf6d2bc, shirt: 0x1ab8b0, shirt2: 0x1ab8b0, cuffs: 0x169a94, pants: 0x2a2a3a, shoes: 0xf4f4f4, sole: 0x1ab8b0, hair: 0x8a4ad8, hairBuild: bobPurple(0x8a4ad8),
  torsoDetail: bigHoodie(0x1ab8b0), face: { iris: '#6a3ab8', browColor: '#6a3ab8', blush: .55 } }), [roundGlasses(0x1a1a1a)]); }
export function makeZopf(scene) { return mk(scene, S({ seed: 2106, scale: .9, skin: 0xf6d0b6, shirt: 0xf4f4f4, shirt2: 0x1a1a22, cuffs: 0x1a1a22, pants: 0xf6d0b6, shoes: 0x1a1a1a, sole: 0x1a1a1a, socks: 0x1a1a22, shorts: true, skirt: 0xc8283a, hair: 0xf0b088, hairBuild: braid(0xf0b088),
  torsoDetail: shortJacket(0x1a1a22, 0xf4f4f4), face: { iris: '#4a7ad8', browColor: '#d89870', blush: .5 } })); }
export function makeStille(scene) { return mk(scene, S({ seed: 2107, scale: .9, skin: 0xf6d8c4, shirt: 0x24202c, shirt2: 0x24202c, cuffs: 0x24202c, pants: 0xf6d8c4, shoes: 0x3a2a24, sole: 0x1a1a1a, socks: 0x24202c, shorts: true, skirt: 0x3a2a3a, hair: 0xf4a8c8, hairBuild: longLilac(0xf4a8c8),
  torsoDetail: darkJacketTie(0x24202c, 0x6a3a9a), face: { iris: '#d83a6a', browColor: '#e890b0', blush: .2 } }), [o => headphones(o.head, 0xd8283a)]); }
export function makeBiker(scene) { return mk(scene, S({ seed: 2108, scale: 1.08, skin: 0xe0a07a, shirt: 0x2a2a2a, shirt2: 0x6a4a2a, cuffs: 0x6a4a2a, pants: 0x2a2a3a, shoes: 0x1a1a1a, hair: 0x5a3a1e, hairBuild: tallPomp(0x5a3a1e),
  torsoDetail: longCoat(0x6a4a2a), face: { iris: '#5a3a1a', browColor: '#3a2410' } })); }
export function makeReich(scene) { return mk(scene, S({ seed: 2109, scale: 1.0, skin: 0xf6d8c0, shirt: 0xf8f8f8, shirt2: 0xf8f8f8, cuffs: 0xf8f8f8, pants: 0xf8f8f8, shoes: 0x8a5a2a, hair: 0xf0d870, hairBuild: blondPart(0xf0d870),
  torsoDetail: suit(0xf8f8f8, 0x1a3a6a, 0x1a1a1a), face: { iris: '#4a7ab8', browColor: '#c8a848' } }), [o => glasses(o.head)]); }
export function makeFan(scene) { return mk(scene, S({ seed: 2110, scale: .96, skin: 0xf2c8a8, shirt: 0xf4f0e0, shirt2: 0xf4f0e0, cuffs: 0xd8d0b8, pants: 0x3a5a8a, shoes: 0x6a4a2a, hair: 0x2a2018, hairBuild: fanBowl(0x2a2018),
  torsoDetail: sp => { box(2.3, 2.1, 1.3, mat(0xf4f0e0), .3, sp, 0, 1.0, 0); }, face: { iris: '#3a2a1a', browColor: '#2a2018', blush: .5 } }), [roundGlasses(0x1a1a1a), backpack(0x6a8a3a)]); }
export function makeSpielerin(scene) { return mk(scene, S({ seed: 2111, scale: .9, skin: 0xfae0d0, shirt: 0xf4f4f8, shirt2: 0xf4f4f8, cuffs: 0xd8283a, pants: 0xfae0d0, shoes: 0x1a1a1a, socks: 0x1a1a1a, shorts: true, skirt: 0x1a1a22, hair: 0x101014, hairBuild: himeBlack(0x101014),
  torsoDetail: darkJacketTie(0x1a1a22, 0xd8283a), face: { iris: '#c8202a', browColor: '#101014', blush: .3 } })); }
export function makeSchwimmerin(scene) { return mk(scene, S({ seed: 2112, scale: .9, skin: 0xc8885a, shirt: 0xf4f4f4, shirt2: 0x2a7ad8, cuffs: 0x2a7ad8, pants: 0xc8885a, shoes: 0xf4f4f4, sole: 0x2a7ad8, shorts: true, socks: 0xf4f4f4, hair: 0x4a2a14, hairBuild: shortBrown(0x4a2a14),
  torsoDetail: track(0x2a7ad8, 0xffffff), face: { iris: '#3a2410', browColor: '#3a2010', blush: .4 } })); }
// familia (solo en fotos / recuerdos)
export function makeMama(scene) { return mk(scene, S({ seed: 2120, skin: 0xf2c4a2, shirt: 0xf28a6a, shirt2: 0xf28a6a, cuffs: 0xd86a4a, pants: 0x3a4a6a, shoes: 0x6a4a2a, hair: 0x6a3a1e, hairBuild: shortBrown(0x6a3a1e), face: { iris: '#5a3a1a', browColor: '#5a3418', blush: .4 } })); }
export function makePapa(scene) { return mk(scene, S({ seed: 2121, scale: 1.04, skin: 0xf0bc98, shirtMap: plaid('#3a6ab8', '#ffffff'), shirt2: null, cuffs: 0x2a4a8a, pants: 0x8a7a5a, shoes: 0x3a2a1a, hair: 0x5a3a1e, hairBuild: blondPart(0x5a3a1e), face: { iris: '#4a6a8a', browColor: '#4a2a14', blush: .3 } }), [o => glasses(o.head)]); }

// ---------- el director: Teddy ----------
// teddy.pose({ aL, aR (brazos: 0 abajo, 1.6 al frente, 2.8 arriba), aLz, aRz, lean, headY, headZ, mouth 0..1, glow, legs (fase de paso), hop (altura) })
export function makeTeddy(scene) {
  const root = new THREE.Group(); scene.add(root); const pink = mat(0xffa6c8, { roughness: .85 }), grey = mat(0x8a8e9a, { roughness: .85 }), cream = mat(0xfff2ea, { roughness: .9 }), dk = mat(0x2a1a22);
  const half = (r, m, side, parent, y, sx = 1, sy = 1, sz = 1) => { const g = new THREE.SphereGeometry(r, 24, 16, side < 0 ? 0 : Math.PI, Math.PI); const s = new THREE.Mesh(g, m); s.position.y = y; s.scale.set(sx, sy, sz); parent.add(s); return s; };
  // SphereGeometry phi empieza en +x... rotamos para que la costura quede en el plano x = 0 (izquierda rosa, derecha gris)
  const body = new THREE.Group(); body.position.y = 1.5; root.add(body);
  for (const [m, s] of [[pink, 1], [grey, -1]]) { const h = half(1.35, m, s, body, 0, 1, 1.05, .92); h.rotation.y = Math.PI / 2; }
  const belly = sphere(.95, cream, body, 0, -.1, .62, 20, 14); belly.scale.set(1, 1.05, .5);
  const bow = new THREE.Group(); bow.position.set(0, .95, 1.05); body.add(bow); for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.ConeGeometry(.28, .5, 4), mat(0xd8283a)); b.rotation.z = s * Math.PI / 2; b.position.x = s * .25; bow.add(b); } sphere(.13, mat(0xd8283a), bow, 0, 0, 0, 8, 6);
  const neck = new THREE.Group(); neck.position.y = 1.15; body.add(neck);
  const head = new THREE.Group(); head.position.y = 1.15; neck.add(head);
  for (const [m, s] of [[pink, 1], [grey, -1]]) { const h = half(1.45, m, s, head, 0, 1.08, .95, .95); h.rotation.y = Math.PI / 2; }
  for (const s of [-1, 1]) { const e = sphere(.52, s < 0 ? pink : grey, head, s * 1.05, 1.15, -.1, 16, 12); e.scale.z = .55; const ei = sphere(.32, s < 0 ? mat(0xff7aa8) : mat(0x6a6e7a), head, s * 1.07, 1.15, .1, 12, 8); ei.scale.z = .3; }
  const snout = sphere(.62, cream, head, 0, -.38, 1.12, 18, 12); snout.scale.set(1.1, .78, .7); sphere(.2, dk, head, 0, -.18, 1.55, 10, 8).scale.set(1.3, .8, .8);
  // boca: media luna oscura que se abre
  const mouth = new THREE.Group(); mouth.position.set(0, -.62, 1.42); head.add(mouth); const mo = sphere(.34, mat(0x3a0a14), mouth, 0, 0, 0, 14, 10); mo.scale.set(1.3, .25, .4); const tongue = sphere(.18, mat(0xff5a7a), mouth, 0, -.05, .05, 10, 8); tongue.scale.set(1.2, .5, .5);
  const teeth = box(.6, .1, .1, mat(0xffffff), .03, mouth, 0, .05, .12);
  // ojo izquierdo (rosa): botón negro con brillo; ojo derecho (gris): corazón rojo que brilla
  const eyeL = new THREE.Group(); eyeL.position.set(-.55, .25, 1.3); head.add(eyeL); const bt = cyl(.3, .3, .12, mat(0x14101a, { roughness: .3 }), 20, eyeL, 0, 0, 0); bt.rotation.x = Math.PI / 2; sphere(.08, mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: .6 }), eyeL, .1, .1, .08, 6, 4);
  const lid = box(.7, .3, .2, pink, .1, eyeL, 0, .3, .05); lid.visible = false;
  const heartS = new THREE.Shape(); heartS.moveTo(0, -.35); heartS.bezierCurveTo(-.5, 0, -.42, .38, -.18, .38); heartS.bezierCurveTo(-.05, .38, 0, .28, 0, .2); heartS.bezierCurveTo(0, .28, .05, .38, .18, .38); heartS.bezierCurveTo(.42, .38, .5, 0, 0, -.35);
  const hm = new THREE.MeshStandardMaterial({ color: 0xff2030, emissive: 0xff1020, emissiveIntensity: 1.2, roughness: .3 });
  const eyeR = new THREE.Mesh(new THREE.ExtrudeGeometry(heartS, { depth: .12, bevelEnabled: true, bevelSize: .04, bevelThickness: .04, bevelSegments: 2 }), hm); eyeR.position.set(.55, .22, 1.24); eyeR.scale.setScalar(1.2); head.add(eyeR);
  for (const s of [-1, 1]) { const br = box(.5, .1, .1, dk, .03, head, s * .55, .72, 1.25); br.userData.s = s; }
  const brows = head.children.filter(c => c.userData.s);
  // corona
  const crown = new THREE.Group(); crown.position.set(.15, 1.32, 0); crown.rotation.z = -.18; head.add(crown); const gm = mat(0xffd23f, { metalness: .85, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .35 });
  cyl(.5, .5, .3, gm, 18, crown, 0, 0, 0); for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283, p = new THREE.Mesh(new THREE.ConeGeometry(.12, .36, 4), gm); p.position.set(Math.cos(a) * .42, .3, Math.sin(a) * .42); crown.add(p); sphere(.06, mat([0xd8283a, 0x2a8ad8, 0x2ad86a][k % 3], { emissive: 0x220000 }), crown, Math.cos(a) * .5, .02, Math.sin(a) * .5, 6, 4); }
  // costuras
  const seam = mat(0x3a2a30); box(.04, 2.6, .04, seam, 0, body, 0, 0, 1.18).visible = false;
  // brazos y piernas
  const arm = s => { const sh = new THREE.Group(); sh.position.set(s * 1.15, .45, 0); body.add(sh); const a = sphere(.42, s < 0 ? pink : grey, sh, 0, -.55, 0, 14, 10); a.scale.set(1, 1.6, 1); const paw = sphere(.3, cream, sh, 0, -1.1, .22, 10, 8); paw.scale.z = .5; return sh; };
  const aL = arm(-1), aR = arm(1);
  const leg = s => { const hp = new THREE.Group(); hp.position.set(s * .62, -.95, 0); body.add(hp); const l = sphere(.48, s < 0 ? pink : grey, hp, 0, -.35, .1, 14, 10); l.scale.set(1, 1, 1.25); const f = sphere(.32, cream, hp, 0, -.4, .62, 10, 8); f.scale.z = .3; return hp; };
  const lL = leg(-1), lR = leg(1);
  const T = { root, body, head, neck, aL, aR, lL, lR, eyeR, eyeL, lid, hm, mouth, brows, crown, seed: 7,
    pose(p = {}) { const lean = p.lean || 0; body.rotation.set(lean, p.twist || 0, p.tilt || 0); neck.rotation.set(p.headX || 0, p.headY || 0, p.headZ || 0);
      aL.rotation.set(-(p.aL || 0), 0, -(p.aLz ?? .25)); aR.rotation.set(-(p.aR || 0), 0, p.aRz ?? .25);
      const ph = p.legs || 0; lL.rotation.x = Math.sin(ph) * .6; lR.rotation.x = -Math.sin(ph) * .6; if (p.sit) { lL.rotation.x = lR.rotation.x = -1.4; } body.position.y = 1.5 + (p.hop || 0) + Math.abs(Math.sin(ph)) * .12;
      const m = p.mouth ?? .2; mouth.scale.set(1, .4 + m * 2.6, 1); tongue.visible = m > .3; teeth.visible = m > .15;
      hm.emissiveIntensity = p.glow ?? 1.3; const ang = p.brow ?? 0; brows.forEach(b => { b.rotation.z = -b.userData.s * ang; b.position.y = .72 - Math.abs(ang) * .08; }); lid.visible = !!p.wink; } };
  root.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  T.pose({}); return T;
}

// ---------- atrezo de los personajes ----------
export function racket(parent) { const g = new THREE.Group(); parent.add(g); cyl(.08, .08, 1.6, mat(0x1a1a1a), 8, g, 0, .8, 0); const r = new THREE.Mesh(new THREE.TorusGeometry(.62, .07, 8, 24), mat(0xd8283a)); r.position.y = 2.1; r.scale.y = 1.25; g.add(r);
  const net = new THREE.Mesh(new THREE.CircleGeometry(.6, 20), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .35, side: THREE.DoubleSide })); net.position.y = 2.1; net.scale.y = 1.25; g.add(net); return g; }
export function skates(ch) { const out = []; for (const lg of [ch.lL, ch.lR]) { const g = new THREE.Group(); lg.kn.add(g); g.position.y = -.85; box(1.06, .5, 1.36, mat(0xffffff, { roughness: .5 }), .15, g, 0, .05, .14); box(.1, .34, 1.7, mat(0xd8dce4, { metalness: .95, roughness: .1 }), .02, g, 0, -.38, .14); out.push(g); } return out; }
export function laptop(parent) { const g = new THREE.Group(); parent.add(g); box(2.2, .12, 1.5, mat(0x3a3e48, { metalness: .6 }), .04, g, 0, 0, 0); const s = box(2.2, 1.5, .08, mat(0x3a3e48, { metalness: .6 }), .04, g, 0, .75, -.72); s.rotation.x = -.2;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(.2, 1.2, .6), toneMapped: false })); scr.position.set(0, .76, -.66); scr.rotation.x = -.2; g.add(scr); return g; }
export function pan(parent) { const g = new THREE.Group(); parent.add(g); cyl(.8, .7, .2, mat(0x2a2a30, { metalness: .6 }), 20, g, 0, 0, 0); const h = box(.2, .12, 1.6, mat(0x1a1a1a), .04, g, 0, .05, -1.4); return g; }
export function scissors(parent) { const g = new THREE.Group(); parent.add(g); const st = mat(0xd8dce4, { metalness: .95, roughness: .15 }); for (const s of [-1, 1]) { const b = box(.12, .04, 1.4, st, .02, g, 0, 0, .5); b.rotation.y = s * .2; const r = new THREE.Mesh(new THREE.TorusGeometry(.2, .06, 6, 16), mat(0xff5a8a)); r.rotation.x = Math.PI / 2; r.position.set(s * .22, 0, -.4); g.add(r); } return g; }
export function teddyToy(parent) { // peluche pequeño (el de mi infancia: el mismo osito, en pequeño y sin corona)
  const g = new THREE.Group(); parent.add(g); const pink = mat(0xffb6d0, { roughness: 1 }), grey = mat(0x9a9eaa, { roughness: 1 }), cream = mat(0xfff2ea, { roughness: 1 });
  for (const [m, s] of [[pink, -1], [grey, 1]]) { const b = sphere(.7, m, g, s * .2, .7, 0, 14, 10); b.scale.set(.75, 1, .8); const h = sphere(.7, m, g, s * .22, 1.7, 0, 14, 10); h.scale.set(.75, .9, .85); sphere(.25, m, g, s * .55, 2.25, 0, 8, 6); sphere(.22, m, g, s * .7, .9, .2, 8, 6); sphere(.24, m, g, s * .35, .1, .3, 8, 6); }
  sphere(.28, cream, g, 0, 1.55, .55, 10, 8).scale.z = .6; sphere(.08, mat(0x14101a), g, -.25, 1.85, .58, 6, 4); const hr = sphere(.09, mat(0xff2030, { emissive: 0x880010 }), g, .25, 1.85, .58, 6, 4); return g; }
