// GOOD BOY — reparto propio (nadie se parece al vídeo de referencia).
// Lukas (yo): tupé castaño claro, pecas, sudadera naranja con capucha y cordones blancos, vaqueros, zapatillas blancas; collar rojo con chapa dorada.
// Svenja (mi novia): melena larga caoba con flequillo, abrigo rosa con botones dorados, blusa blanca, pantalón negro, pendientes, gafas de sol en la cabeza.
// Benni (mi amigo): pelo rizado negro, piel oscura, camiseta amarilla con rayo, pantalón cargo verde; collar azul.
// Jana (novia de Benni): coleta rubia, vestido morado con cinturón, bolso.
// Jungs: gamer con cascos, chico de gorra, chico con gafas.
// Schaffner (revisor): uniforme granate con gorra, bigote. Bodybuilder: enorme, camiseta de tirantes negra. Kim (su novia): coleta, chándal turquesa, silbato.
// Chef: traje gris, calvo con gafas y corbata roja. Opa: pelo blanco, bigote, chaqueta de punto verde. Oma: moño gris, vestido de flores.
// Kellner (camarero), Gärtnerin (cajera del centro de jardinería). Extras: mujeres (makeFrau) y hombres (makeMann), todos distintos.
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, mustache, cap, shades, headphones } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
// ---------- peinados ----------
const longFringe = col => h => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.32), m); c.position.y = 1.0; c.scale.set(1.05, .7, 1.05); h.add(c);
  for (let i = -2; i <= 2; i++) { const f = box(.3, .42, .24, m, .1, h, i * .26, 1.12, .55); f.rotation.x = -.25; } for (const s of [-1, 1]) box(.34, 2.0, .95, m, .14, h, s * .68, .1, -.12); box(1.38, 2.1, .42, m, .16, h, 0, .15, -.54); };
const ponytail = col => h => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .66, 1.05); h.add(c);
  sphere(.2, mat(0xff4a8a), h, 0, 1.25, -.68, 8, 6); const t = box(.42, 1.5, .42, m, .2, h, 0, .5, -.86); t.rotation.x = .25; sphere(.3, m, h, 0, -.2, -1.0, 10, 8); for (let i = -1; i <= 1; i++) { const f = box(.42, .3, .22, m, .1, h, i * .38, 1.15, .55); f.rotation.x = -.3; } };
const bunGrey = col => h => { const m = mat(col, { roughness: .7 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .68, 1.05); h.add(c);
  const b = sphere(.42, m, h, 0, 1.55, -.42, 14, 10); b.scale.set(1, .9, .9); for (const s of [-1, 1]) box(.22, .7, .5, m, .1, h, s * .66, .72, -.05); };
const curly = col => h => { const m = mat(col, { roughness: .85 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.22), m); c.position.y = .99; c.scale.set(1.04, .55, 1.04); h.add(c);
  for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283, r = .5 + (i % 2) * .14; sphere(.22, m, h, Math.cos(a) * r, 1.18 + (i % 3) * .09, Math.sin(a) * r * .95 + .02, 10, 8); } for (let i = -2; i <= 2; i++) sphere(.2, m, h, i * .22, 1.2, .56, 10, 8); };
const quiff = col => h => { const m = mat(col, { roughness: .55 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.71, 24, 12, 0, 6.283, 0, 1.2), m); c.position.y = 1.0; c.scale.set(1.04, .6, 1.04); h.add(c);
  const q = box(1.1, .5, .7, m, .24, h, .05, 1.42, .3); q.rotation.set(-.35, 0, -.12); const q2 = box(.8, .36, .5, m, .18, h, .15, 1.62, .45); q2.rotation.set(-.6, 0, -.2); for (const s of [-1, 1]) box(.2, .5, .7, m, .08, h, s * .68, .9, -.1); };
const whiteSide = col => h => { const m = mat(col, { roughness: .8 }); for (const s of [-1, 1]) box(.26, .6, 1.0, m, .12, h, s * .67, .95, -.12); box(1.3, .6, .3, m, .12, h, 0, .95, -.6); };
// ---------- ropa ----------
const hoodieT = (col, str) => sp => { const j = mat(col, { roughness: .85 }); box(2.16, 2.1, 1.16, j, .2, sp, 0, 1.0, -.01); box(1.36, .55, .1, j, .1, sp, 0, .45, .6); for (const s of [-1, 1]) { cyl(.05, .05, .8, mat(str), 6, sp, s * .22, 1.52, .62); sphere(.08, mat(str), sp, s * .22, 1.1, .62, 6, 4); }
  const hd = box(1.66, .6, .64, j, .24, sp, 0, 2.0, -.56); hd.rotation.x = -.3; box(2.2, .22, 1.2, mat(0xd86a10), .08, sp, 0, .1, 0); box(.5, .5, .05, mat(0xffffff), .02, sp, .5, 1.55, .6); };
const coat = (col, inner) => sp => { const m = mat(col, { roughness: .6 }); for (const s of [-1, 1]) box(.76, 2.1, 1.16, m, .12, sp, s * .66, 1.0, 0); box(2.1, 2.1, .5, m, .12, sp, 0, 1.0, -.33); box(.6, 2.0, .06, mat(inner), .02, sp, 0, 1.0, .56);
  for (const s of [-1, 1]) { const l = box(.36, 1.1, .07, m, .02, sp, s * .4, 1.5, .6); l.rotation.z = s * .36; for (let k = 0; k < 3; k++) sphere(.08, mat(0xe9c23a, { metalness: .8, roughness: .2 }), sp, s * .42, 1.1 - k * .42, .62, 8, 6); } box(2.18, .22, 1.2, m, .06, sp, 0, .5, 0); };
const boltTee = col => sp => { box(2.1, 2.06, 1.12, mat(col, { roughness: .8 }), .12, sp, 0, 1.02, 0); const b = new THREE.Shape(); b.moveTo(.1, .5); b.lineTo(-.25, 0); b.lineTo(0, 0); b.lineTo(-.15, -.5); b.lineTo(.25, .08); b.lineTo(0, .08); b.closePath(); const m = new THREE.Mesh(new THREE.ShapeGeometry(b), mat(0x1a1a24)); m.position.set(0, 1.25, .58); sp.add(m); };
const dress = (col, belt) => sp => { const m = mat(col, { roughness: .7 }); box(2.16, 2.1, 1.16, m, .16, sp, 0, 1.0, 0); box(2.2, .24, 1.2, mat(belt), .05, sp, 0, .7, 0); sphere(.12, mat(0xe9c23a, { metalness: .8 }), sp, 0, .7, .62, 8, 6); for (const s of [-1, 1]) { const c = box(.6, .28, .46, mat(0xffffff), .1, sp, s * .3, 2.02, .4); c.rotation.z = s * .3; } };
const floral = (bg, fl) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fl; for (let i = 0; i < 6; i++) { const x = (i * 23) % 64, y = (i * 37) % 64; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + Math.cos(k * 1.26) * 4, y + Math.sin(k * 1.26) * 4, 3, 0, 7); c.fill(); } } }, true);
const cardigan = (col, inner) => sp => { const m = mat(col, { roughness: .95 }); for (const s of [-1, 1]) box(.76, 2.06, 1.16, m, .12, sp, s * .66, 1.0, 0); box(2.1, 2.06, .5, m, .12, sp, 0, 1.0, -.33); box(.6, 2.0, .06, mat(inner), .02, sp, 0, 1.0, .56); for (let k = 0; k < 4; k++) sphere(.07, mat(0xf2e2c0), sp, .4, 1.7 - k * .4, .6, 6, 4); for (const s of [-1, 1]) box(.5, .4, .06, m, .02, sp, s * .6, .55, .6); };
const suitT = (col, shirt, tie) => sp => { const j = mat(col, { roughness: .5 }); box(2.08, 2.06, 1.1, j, .12, sp, 0, 1.02, -.02); box(.6, 1.1, .06, mat(shirt), .02, sp, 0, 1.5, .55); box(.22, .95, .05, mat(tie), .02, sp, 0, 1.42, .58);
  for (const s of [-1, 1]) { const l = box(.36, 1.2, .06, mat(col, { roughness: .4 }), .02, sp, s * .38, 1.45, .58); l.rotation.z = s * .38; } box(.36, .14, .05, mat(0xffffff), .01, sp, -.6, 1.6, .57); };
const uniformZ = sp => { const m = mat(0x7a1a2a, { roughness: .55 }); box(2.12, 2.08, 1.14, m, .14, sp, 0, 1.02, 0); box(.6, 1.0, .06, mat(0xf4f4f4), .02, sp, 0, 1.5, .56); box(.2, .8, .05, mat(0xe9c23a), .02, sp, 0, 1.45, .59); for (let k = 0; k < 3; k++) for (const s of [-1, 1]) sphere(.08, mat(0xe9c23a, { metalness: .8 }), sp, s * .45, 1.5 - k * .4, .6, 8, 6);
  const t = box(.5, .3, .05, mat(0xe9c23a, { metalness: .6 }), .02, sp, -.6, 1.65, .58); const bag = box(.8, .9, .3, mat(0x2a1a14), .1, sp, .9, .3, .5); };
const tank = (col) => sp => { box(2.3, 2.1, 1.25, mat(col, { roughness: .7 }), .16, sp, 0, 1.0, 0); for (const s of [-1, 1]) { box(.85, .7, .2, mat(0xc68b5e, { roughness: .6 }), .2, sp, s * .5, 1.5, .62); box(.5, 2.0, 1.27, mat(0xc68b5e, { roughness: .6 }), .14, sp, s * 1.0, 1.0, 0); } for (let k = 0; k < 3; k++) for (const s of [-1, 1]) box(.38, .26, .1, mat(0xb07a4e), .08, sp, s * .22, .95 - k * .3, .6); };
const tracksuit = col => sp => { const m = mat(col, { roughness: .7 }); box(2.12, 2.08, 1.14, m, .16, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.12, 2.08, 1.16, mat(0xffffff), .02, sp, s * 1.0, 1.02, 0); box(.06, 1.9, .05, mat(0xc8c8c8, { metalness: .8 }), .01, sp, 0, 1.0, .58); const wh = new THREE.Group(); wh.position.set(0, 1.4, .64); sp.add(wh); cyl(.04, .04, .7, mat(0xff4a8a), 4, wh, 0, -.2, 0); box(.3, .16, .14, mat(0xe9c23a, { metalness: .8 }), .04, wh, 0, -.6, 0); };
const apron = (col, inner) => sp => { box(2.1, 2.06, 1.12, mat(inner, { roughness: .8 }), .12, sp, 0, 1.02, 0); box(1.7, 1.9, .08, mat(col, { roughness: .8 }), .04, sp, 0, .95, .58); box(.8, .5, .05, mat(col), .02, sp, 0, .6, .64); };
const vest = (col, inner) => sp => { box(2.1, 2.06, 1.12, mat(inner, { roughness: .6 }), .12, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.8, 1.9, 1.14, mat(col, { roughness: .6 }), .1, sp, s * .62, .98, 0); box(.24, .14, .05, mat(0x1a1a1a), .02, sp, 0, 2.0, .58); };
const earrings = (col = 0xe9c23a) => o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 14), mat(col, { metalness: .9, roughness: .2 })); r.position.set(s * .7, .22, .05); r.rotation.y = Math.PI / 2; o.head.add(r); } };
const headShades = o => { const g = new THREE.Group(); g.position.set(0, 1.38, .3); g.rotation.x = -.5; o.head.add(g); for (const s of [-1, 1]) box(.5, .3, .08, mat(0x1a1a1a, { roughness: .1, metalness: .5 }), .06, g, s * .3, 0, 0); box(.2, .06, .06, mat(0xe9c23a, { metalness: .8 }), .02, g, 0, .05, 0); };
const zugCap = o => { const m = mat(0x7a1a2a, { roughness: .5 }); cyl(.76, .72, .5, m, 20, o.head, 0, 1.45, 0); cyl(.84, .84, .12, m, 20, o.head, 0, 1.72, 0); const v = box(1.1, .08, .5, mat(0x0a0a10, { roughness: .2 }), .03, o.head, 0, 1.24, .65); v.rotation.x = .25; box(1.6, .1, .1, mat(0xe9c23a), .02, o.head, 0, 1.42, .74); };
const backCap = (col) => o => { const m = mat(col, { roughness: .7 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.76, 22, 10, 0, 6.283, 0, 1.3), m); c.position.y = 1.08; c.scale.set(1.04, .6, 1.04); o.head.add(c); const v = box(1.0, .08, .6, m, .03, o.head, 0, 1.16, -.85); v.rotation.x = -.15; };
// ---------- collar (perro) ----------
export function collar(ch, col = 0xd8202a) { const g = new THREE.Group(); g.position.set(0, .06, 0); ch.neck.add(g); const r = new THREE.Mesh(new THREE.TorusGeometry(.6, .13, 8, 28), mat(col, { roughness: .45 })); r.rotation.x = Math.PI / 2; r.scale.set(1, .85, 1); g.add(r);
  for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; sphere(.07, mat(0xd8d8e0, { metalness: .9, roughness: .2 }), g, Math.cos(a) * .6, .02, Math.sin(a) * .51, 6, 4); }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.12, .035, 6, 14), mat(0xd8d8e0, { metalness: .9, roughness: .2 })); ring.position.set(0, -.1, .56); g.add(ring); const tag = cyl(.2, .2, .05, mat(0xe9c23a, { metalness: .9, roughness: .2 }), 14, g, 0, -.36, .58); tag.rotation.x = Math.PI / 2;
  ch.collar = g; ch.ring = ring; g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; }

export function makeLukas(scene) { return mk(scene, S({ seed: 9101, scale: 1.0, skin: 0xf2c6a2, shirt: 0xff8a1a, shirt2: 0xff8a1a, cuffs: 0xd86a10, pants: 0x3a5a9a, shoes: 0xf4f4f4, sole: 0xd8d8d8, hair: 0x9a6a3a, hairBuild: quiff(0x9a6a3a),
  torsoDetail: hoodieT(0xff8a1a, 0xffffff), face: { iris: '#3a6a9a', browColor: '#7a4a20', blush: .35, freckles: 1 } })); }
export function makeSvenja(scene) { return mk(scene, S({ seed: 9102, scale: .97, skin: 0xf4cdb0, shirt: 0xff6aa8, shirt2: 0xff6aa8, cuffs: 0xe8508a, pants: 0x1a1a24, shoes: 0x1a1a1a, hair: 0x8a2a14, hairBuild: longFringe(0x8a2a14),
  torsoDetail: coat(0xff6aa8, 0xffffff), face: { iris: '#4a7a3a', browColor: '#6a2010', blush: .5 } }), [earrings(), headShades]); }
export function makeBenni(scene) { return mk(scene, S({ seed: 9103, scale: 1.0, skin: 0x7a4a2a, shirt: 0xffd23f, shirt2: 0xffd23f, cuffs: 0xe8b82a, pants: 0x4a6a3a, shoes: 0xd8323a, sole: 0xffffff, hair: 0x101010, hairBuild: curly(0x101010), sleeveShort: true,
  torsoDetail: boltTee(0xffd23f), face: { iris: '#2a1a10', browColor: '#101010', blush: .1 } })); }
export function makeJana(scene) { return mk(scene, S({ seed: 9104, scale: .95, skin: 0xf6d6c0, shirt: 0x8a4ad8, shirt2: 0x8a4ad8, cuffs: 0x7a3ac8, pants: 0x8a4ad8, shoes: 0xf4f4f4, hair: 0xf0c850, hairBuild: ponytail(0xf0c850), sleeveShort: true,
  torsoDetail: dress(0x8a4ad8, 0x2a1a4a), face: { iris: '#3a7ab8', browColor: '#c89a30', blush: .55 } }), [earrings(0xffffff)]); }
export function makeJunge(scene, i) { const D = [
  { seed: 9111, skin: 0xeab08a, shirt: 0x2a2a3a, pants: 0x1a1a24, shoes: 0x2ab86a, hair: 0x3a2214, st: 'fringe', acc: [o => headphones(o.head, 0x2ab86a)], torso: hoodieT(0x2a2a3a, 0x2ab86a) },
  { seed: 9112, skin: 0xc68b5e, shirt: 0xd8323a, pants: 0x4a6aa8, shoes: 0xf4f4f4, hair: 0x1a120c, st: 'spiky', acc: [backCap(0x1a6ad8)] },
  { seed: 9113, skin: 0xf4cfb6, shirt: 0x1aa0a0, pants: 0xc8b48a, shoes: 0x1a1a1a, hair: 0xe0b850, st: 'swoop', acc: [o => glasses(o.head)] }][i];
  return mk(scene, S({ seed: D.seed, scale: .98, skin: D.skin, shirt: D.shirt, shirt2: D.shirt, cuffs: D.shirt, pants: D.pants, shoes: D.shoes, hair: D.hair, hairBuild: hairS(D.hair, D.st), sleeveShort: i === 1, torsoDetail: D.torso,
    face: { iris: '#3a2410', browColor: hex(D.hair), blush: .3 } }), D.acc); }
export function makeSchaffner(scene) { return mk(scene, S({ seed: 9121, scale: 1.02, skin: 0xf0bc98, shirt: 0x7a1a2a, shirt2: 0x7a1a2a, cuffs: 0xe9c23a, pants: 0x2a1a20, shoes: 0x0a0a10, hair: 0x5a4a3a, hairBuild: hairS(0x5a4a3a, 'fringe'),
  torsoDetail: uniformZ, face: { iris: '#3a2a1a', browColor: '#4a3a2a', blush: .4 } }), [zugCap, o => mustache(o.head, 0x5a4a3a)]); }
export function makeBodybuilder(scene) { const c = mk(scene, S({ seed: 9122, scale: 1.3, skin: 0xc68b5e, shirt: 0x1a1a1a, shirt2: 0xc68b5e, cuffs: 0xc68b5e, pants: 0x3a3a46, shoes: 0xd8323a, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'bald'), sleeveShort: true,
  torsoDetail: tank(0x1a1a1a), face: { iris: '#2a1a10', browColor: '#1a120c', blush: .1 } }), [o => { box(1.36, .2, 1.3, mat(0xd8323a), .06, o.head, 0, 1.0, 0); }]);
  for (const a of [c.aL, c.aR]) { a.sh.scale.set(1.4, 1.0, 1.3); } c.spine.scale.set(1.18, 1, 1.12); return c; }
export function makeKim(scene) { return mk(scene, S({ seed: 9123, scale: .9, skin: 0xf2c4a0, shirt: 0x1ac8c8, shirt2: 0x1ac8c8, cuffs: 0xffffff, pants: 0x1ac8c8, shoes: 0xff4a8a, hair: 0x2a1a10, hairBuild: ponytail(0x2a1a10),
  torsoDetail: tracksuit(0x1ac8c8), face: { iris: '#3a2410', browColor: '#2a1a10', blush: .5 } }), [earrings(0xffffff)]); }
export function makeChef(scene) { return mk(scene, S({ seed: 9124, scale: 1.04, skin: 0xf4cdb0, shirt: 0x6a6e78, shirt2: 0x6a6e78, cuffs: 0xffffff, pants: 0x5a5e68, shoes: 0x2a1a10, hair: 0x6a5a4a, hairBuild: whiteSide(0x6a5a4a),
  torsoDetail: suitT(0x6a6e78, 0xffffff, 0xd8202a), face: { iris: '#3a5a7a', browColor: '#5a4a3a', blush: .35 } }), [o => glasses(o.head)]); }
export function makeOpa(scene) { return mk(scene, S({ seed: 9125, scale: .95, skin: 0xf4cdb0, shirt: 0x3a6a3a, shirt2: 0x3a6a3a, cuffs: 0x2a5a2a, pants: 0x8a7a6a, shoes: 0x3a2a20, hair: 0xf0f0f0, hairBuild: whiteSide(0xf0f0f0),
  torsoDetail: cardigan(0x3a6a3a, 0xf4f0e8), face: { iris: '#4a6a8a', browColor: '#e8e8e8', blush: .4 } }), [o => mustache(o.head, 0xf0f0f0), o => glasses(o.head)]); }
export function makeOma(scene) { return mk(scene, S({ seed: 9126, scale: .9, skin: 0xf6d6c0, shirtMap: floral('#7ab8e8', '#ffffff'), shirt2: null, cuffs: 0x5a9ad8, pants: 0x5a9ad8, shoes: 0x8a3a3a, hair: 0xc8c8cc, hairBuild: bunGrey(0xc8c8cc),
  face: { iris: '#5a7a9a', browColor: '#a8a8ac', blush: .55 } }), [earrings(0xffffff)]); }
export function makeKellner(scene) { return mk(scene, S({ seed: 9127, scale: 1.0, skin: 0xeab08a, shirt: 0xffffff, shirt2: 0xffffff, cuffs: 0xffffff, pants: 0x1a1a1a, shoes: 0x1a1a1a, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'swoop'),
  torsoDetail: vest(0x1a1a1a, 0xffffff), face: { iris: '#3a2410', browColor: '#1a120c', blush: .3 } }), [o => mustache(o.head, 0x1a120c)]); }
export function makeGaertnerin(scene) { return mk(scene, S({ seed: 9128, scale: .95, skin: 0xd8a07a, shirt: 0xf4e8d0, shirt2: 0xf4e8d0, cuffs: 0xf4e8d0, pants: 0x4a3a2a, shoes: 0x3a6a2a, hair: 0xb8441a, hairBuild: bunGrey(0xb8441a),
  torsoDetail: apron(0x2a8a3a, 0xf4e8d0), face: { iris: '#3a5a2a', browColor: '#8a3010', blush: .5, freckles: 1 } }), [o => glasses(o.head)]); }
// ---------- extras: mujeres y hombres, todos distintos ----------
const SK = [0xf2c4a0, 0xd8a07a, 0x8a5a3a, 0xf4cfb6, 0xc68b5e, 0xeab08a, 0x6a4028, 0xf0b088];
const HC = [0x1a120c, 0x6a3a1a, 0xe0b850, 0xb8441a, 0x3a2214, 0xc8c8cc, 0x8a5a2a, 0x2a1a10];
const FSH = [0xff5a85, 0x2ab8b8, 0xffd23f, 0x8a4ad8, 0xf4f4f4, 0x3a8ad8, 0xff8a3a, 0x2ab86a, 0xe86a9a, 0xd8323a, 0x1a6a5a, 0xf2b8d8];
const MSH = [0x2a6ad8, 0xd8323a, 0x3a8a4a, 0x8a8e96, 0xffd23f, 0x1aa0a0, 0x6a3ad8, 0xf4f4f4, 0xff8a3a, 0x3a3a46, 0xc8b48a, 0x8a2a3a];
const PA = [0x2a3a5a, 0x1a1a24, 0xc8b48a, 0x4a6aa8, 0x6a6a72, 0x3a4a3a];
export function makeFrau(scene, i) { const skin = SK[(i * 3 + 1) % 8], hair = HC[(i * 5 + 2) % 8], shirt = FSH[i % FSH.length], st = i % 4;
  const hb = st === 0 ? longFringe(hair) : st === 1 ? ponytail(hair) : st === 2 ? bunGrey(hair) : hairS(hair, 'long');
  const tor = i % 3 === 0 ? coat(shirt, 0xffffff) : i % 3 === 1 ? dress(shirt, 0x2a1a24) : undefined;
  const acc = [[earrings()], [o => shades(o.head)], [], [o => glasses(o.head)], [earrings(0xffffff)], [headShades]][i % 6];
  return mk(scene, S({ seed: 9300 + i, scale: .9 + (i % 3) * .04, skin, shirt, shirt2: shirt, cuffs: shirt, pants: i % 3 === 1 ? shirt : PA[i % PA.length], shoes: [0x1a1a1a, 0xd8323a, 0xf4f4f4, 0x8a5a2a][i % 4], hair, hairBuild: hb, sleeveShort: i % 2 === 1, torsoDetail: tor,
    face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hair), blush: .5 } }), acc); }
export function makeMann(scene, i) { const skin = SK[(i * 5 + 3) % 8], hair = HC[(i * 3 + 1) % 8], shirt = MSH[i % MSH.length], st = ['fringe', 'spiky', 'swoop', 'curly', 'bald', 'fringe'][i % 6];
  const tor = i % 4 === 0 ? hoodieT(shirt, 0xffffff) : i % 4 === 2 ? suitT(shirt, 0xffffff, 0x1a1a24) : undefined;
  const acc = [[], [o => glasses(o.head)], [o => cap(o.head, MSH[(i + 4) % 12], 0xffffff)], [o => mustache(o.head, hair)], [o => shades(o.head)], [backCap(MSH[(i + 6) % 12])]][i % 6];
  return mk(scene, S({ seed: 9400 + i, scale: .96 + (i % 4) * .04, skin, shirt, shirt2: shirt, cuffs: shirt, pants: PA[(i + 2) % PA.length], shoes: [0xf4f4f4, 0x1a1a1a, 0xd8323a, 0x2a6ad8][i % 4], hair, hairBuild: hairS(hair, st), sleeveShort: i % 3 === 1, torsoDetail: tor,
    face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hair), blush: .25 } }), acc); }
