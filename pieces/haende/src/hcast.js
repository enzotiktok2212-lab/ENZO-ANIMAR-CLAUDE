// Hände — reparto propio (aspecto distinto al del vídeo de referencia y a los de vídeos anteriores):
// Narrador (12): piel marrón oscura, pelo en twists cortos negros, gorro de lana gris con pompón, plumas naranja acolchado con cremallera,
//   mochila verde oliva con reflectante, vaqueros oscuros, botas marrones de montaña con cordones rojos.
// Papa: piel oscura, cabeza rapada, barba negra cerrada, camisa de franela a cuadros verde y negra, chaleco acolchado gris.
// Opa: piel oscura, pelo y barba blancos y cortos, gafas de pasta, chaqueta de punto marrón con botones, pajarita.
// Mama: piel oscura, moño afro alto con pañuelo amarillo, jersey burdeos de ochos, pendientes dorados.
// Finn (12): piel muy clara, pelo rubio platino peinado de lado, chaquetón azul marino con cuello de borrego, bufanda roja.
// Frau Berger (profesora): coleta pelirroja, gorro verde, abrigo largo morado, gafas, silbato.
// Conductor del bus: bigote gris, gorra azul, chaqueta azul con reflectantes.
// Niños de la clase: 12 combinaciones distintas (piel, pelo, gorro, plumas y bufanda).
import { THREE, mat, box, cyl, sphere, canvasTex, RNG } from './engine.js';
import { mk, hairS, glasses, mustache, cap } from './props.js';

const knit = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 2; for (let x = 0; x < w; x += 8) for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y + 6); c.lineTo(x + 8, y); c.stroke(); } }, true);
const plaid = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; c.globalAlpha = .6; for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 7, h); c.fillRect(0, i * 16, w, 7); } c.globalAlpha = .25; c.fillStyle = '#ffffff'; for (let i = 0; i < 4; i++) { c.fillRect(i * 16 + 11, 0, 1, h); c.fillRect(0, i * 16 + 11, w, 1); } }, true);
const quilt = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { const g = c.createLinearGradient(0, y, 0, y + 16); g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.3)'); c.fillStyle = g; c.fillRect(0, y, w, 16); c.fillStyle = b; c.fillRect(0, y + 15, w, 1); } }, true);

// ---------- piezas ----------
function twists(col) { return (h) => { const m = mat(col, { roughness: .8 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.25), m); c.position.y = 1.0; c.scale.set(1.04, .6, 1.04); h.add(c); const r = RNG(77);
  for (let i = 0; i < 30; i++) { const a = r() * 6.283, rr = r() * .55; if (Math.sin(a) > .55 && rr > .35) continue; const t = cyl(.09, .12, .42 + r() * .2, m, 6, h, Math.cos(a) * rr, 1.32, Math.sin(a) * rr); t.rotation.set(Math.sin(a) * rr * .9, 0, -Math.cos(a) * rr * .9); } }; }
function beanie(col, pom) { return o => { const m = mat(col, { roughness: 1, map: knit('#' + col.toString(16).padStart(6, '0'), 'rgba(0,0,0,.2)') }); const b = new THREE.Mesh(new THREE.SphereGeometry(.76, 24, 12, 0, 6.283, 0, 1.45), m); b.position.y = 1.08; b.scale.set(1, .82, 1); o.head.add(b);
  cyl(.78, .78, .32, mat(col, { roughness: 1 }), 24, o.head, 0, 1.1, 0); if (pom != null) sphere(.28, mat(pom, { roughness: 1 }), o.head, 0, 1.78, 0, 10, 8); o.props.beanie = b; }; }
function puffer(col, zip = 0x222222) { return sp => { const m = mat(0xffffff, { roughness: .45, map: quilt('#' + col.toString(16).padStart(6, '0'), 'rgba(0,0,0,.35)') }); box(2.2, 2.12, 1.2, m, .3, sp, 0, 1.02, 0); box(.07, 2.0, .06, mat(zip, { metalness: .6 }), 0, sp, 0, 1.02, .62);
  box(.22, .3, .06, mat(0xd8d8d8, { metalness: .8 }), .02, sp, 0, 1.75, .64); box(1.6, .45, 1.28, m, .2, sp, 0, 2.1, 0); for (const s of [-1, 1]) box(.55, .4, .06, mat(col), .05, sp, s * .6, .45, .63); }; }
function scarf(col, col2) { return o => { const m = mat(0xffffff, { roughness: 1, map: canvasTex(32, 32, (c, w, h) => { c.fillStyle = '#' + col.toString(16).padStart(6, '0'); c.fillRect(0, 0, w, h); if (col2 != null) { c.fillStyle = '#' + col2.toString(16).padStart(6, '0'); for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 3); } }, true) });
  const r = box(1.9, .42, 1.3, m, .18, o.spine, 0, 2.05, 0); const t = box(.42, 1.2, .14, m, .07, o.spine, .45, 1.45, .66); t.rotation.z = .08; o.props.scarf = t; }; }
function backpack(col, col2 = 0xf2f2f2) { return o => { const g = new THREE.Group(); g.position.set(0, 1.0, -.82); o.spine.add(g); const m = mat(col, { roughness: .85 }); box(1.7, 1.9, .75, m, .28, g, 0, 0, 0); box(1.3, .7, .25, m, .12, g, 0, -.4, -.45); box(1.72, .45, .78, mat(col2 === 0xf2f2f2 ? 0x4a5a2a : col2), .14, g, 0, .82, 0);
  box(1.2, .12, .05, mat(0xe8f0a0, { emissive: 0x9aa860, emissiveIntensity: .25 }), .02, g, 0, -.05, -.4); for (const s of [-1, 1]) box(.24, 1.9, .08, mat(0x2a2a2a), .03, o.spine, s * .55, 1.05, .64); o.props.pack = g; }; }
function boots(col, lace) { return o => { for (const lg of [o.lL, o.lR]) { box(1.06, .55, 1.4, mat(col, { roughness: .7 }), .14, lg.kn, 0, -.78, .12); box(1.08, .12, 1.42, mat(0x2a1a10), .04, lg.kn, 0, -1.0, .12); if (lace) for (let k = 0; k < 3; k++) box(.5, .05, .06, mat(lace), .01, lg.kn, 0, -.6 - k * .14, .82); } }; }
function gloves(col) { return o => { for (const a of [o.aL, o.aR]) box(.84, .55, .86, mat(col, { roughness: 1 }), .16, a.hand, 0, -.2, .02); }; }
function afroBun(col, wrap) { return (h) => { const m = mat(col, { roughness: .9 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .64, 1.04); h.add(c); sphere(.62, m, h, 0, 1.75, -.1, 14, 10);
  const w = cyl(.66, .7, .32, mat(wrap, { roughness: .8 }), 18, h, 0, 1.28, 0); for (const s of [-1, 1]) sphere(.09, mat(0xe9c23a, { metalness: .9, roughness: .2 }), h, s * .74, .35, .05, 8, 6); }; }
function shaved(col) { return (h) => { const c = new THREE.Mesh(new THREE.SphereGeometry(.7, 24, 12, 0, 6.283, 0, 1.2), mat(col, { roughness: .95, transparent: true, opacity: .55 })); c.position.y = 1.0; c.scale.set(1.02, .6, 1.02); h.add(c); }; }
function beard(col, full = true) { return o => { const m = mat(col, { roughness: .9 }); box(1.3, .5, .3, m, .14, o.head, 0, .18, .55); if (full) for (const s of [-1, 1]) box(.24, .7, .9, m, .1, o.head, s * .6, .45, .2); box(.6, .14, .12, m, .05, o.head, 0, .5, .66); }; }
function whiteShort(col) { return (h) => { const m = mat(col, { roughness: .9 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.2), m); c.position.y = .98; c.scale.set(1.04, .55, 1.04); h.add(c); }; }
function sideSwoop(col) { return (h) => { const m = mat(col, { roughness: .45 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .66, 1.04); h.add(c);
  const s = box(1.3, .42, .95, m, .2, h, .12, 1.36, .22); s.rotation.set(-.15, 0, -.22); const f = box(.9, .4, .3, m, .12, h, .35, 1.1, .55); f.rotation.z = -.4; for (const x of [-.66, .66]) box(.18, .5, .8, m, .06, h, x, .8, -.05); }; }
function shearling(col, fur) { return sp => { const m = mat(col, { roughness: .6 }); box(2.2, 2.12, 1.2, m, .2, sp, 0, 1.02, 0); box(1.9, .5, 1.3, mat(fur, { roughness: 1 }), .25, sp, 0, 2.02, 0); for (let i = 0; i < 4; i++) for (const s of [-1, 1]) sphere(.08, mat(0xd9c08a, { metalness: .6 }), sp, s * .3, .4 + i * .45, .62, 8, 6);
  for (const s of [-1, 1]) box(.6, .35, .06, mat(0x14203a), .05, sp, s * .6, .5, .62); }; }
function longCoat(col) { return o => { const m = mat(col, { roughness: .7 }); box(2.25, 2.15, 1.22, m, .14, o.spine, 0, 1.0, 0); const sk = box(2.35, 1.9, 1.32, m, .2, o.hips, 0, -.85, 0); for (let i = 0; i < 3; i++) sphere(.09, mat(0x1a1a1a), o.spine, .32, .5 + i * .5, .63, 8, 6); }; }
function cardigan(col) { return sp => { const m = mat(0xffffff, { roughness: 1, map: knit('#' + col.toString(16).padStart(6, '0'), 'rgba(0,0,0,.2)') }); for (const s of [-1, 1]) box(.75, 2.05, 1.12, m, .1, sp, s * .65, 1.02, 0); box(2.08, 2.05, .5, m, .1, sp, 0, 1.02, -.32);
  for (let i = 0; i < 4; i++) sphere(.08, mat(0xd9c08a), sp, .33, .4 + i * .42, .6, 8, 6); const bt = box(.5, .2, .08, mat(0x8a1a2a), .05, sp, 0, 1.92, .58); }; }
function vest(col) { return sp => { const m = mat(0xffffff, { roughness: .5, map: quilt('#' + col.toString(16).padStart(6, '0'), 'rgba(0,0,0,.3)') }); for (const s of [-1, 1]) box(.7, 2.0, 1.16, m, .14, sp, s * .67, 1.02, 0); box(2.1, 2.0, .5, m, .14, sp, 0, 1.02, -.34); }; }

// ---------- reparto ----------
export function makeIch(scene) {
  return mk(scene, { seed: 901, scale: .86, skin: 0x5e3a22, skinCss: '#5e3a22', shirt: 0xf2782a, shirt2: 0xf2782a, cuffs: 0x2a2a2a, pants: 0x23304a, shoes: 0x7a4a24, sole: 0x2a1a10, hair: 0x101010, hairBuild: twists(0x101010), noBelt: true,
    torsoDetail: puffer(0xf2782a), face: { iris: '#2a1406', browColor: '#101010', blush: .1 } }, [beanie(0x8a8e96, 0xd8dce4), backpack(0x5a6a2a), boots(0x7a4a24, 0xd8323a)]);
}
export function makePapa(scene) {
  return mk(scene, { seed: 902, scale: 1.08, skin: 0x4e2e1a, skinCss: '#4e2e1a', shirtMap: plaid('#2a6a3a', '#141414'), shirt2: null, cuffs: 0x1a3a22, pants: 0x2a3446, shoes: 0x3a2414, hair: 0x0e0e0e, hairBuild: shaved(0x0e0e0e),
    torsoDetail: vest(0x6a6e78), face: { iris: '#2a1406', browColor: '#0e0e0e' } }, [beard(0x101010)]);
}
export function makeOpa(scene) {
  return mk(scene, { seed: 903, scale: .98, skin: 0x553420, skinCss: '#553420', shirt: 0xf2ece0, shirt2: 0x7a5232, cuffs: 0x6a4428, pants: 0x4a4038, shoes: 0x2a1a10, hair: 0xe8e8e8, hairBuild: whiteShort(0xe8e8e8),
    torsoDetail: cardigan(0x7a5232), face: { iris: '#2a1406', browColor: '#e8e8e8', bags: 1 } }, [o => glasses(o.head), beard(0xe8e8e8, false)]);
}
export function makeMama(scene) {
  return mk(scene, { seed: 904, skin: 0x6a4228, skinCss: '#6a4228', shirtMap: knit('#8a1e32', 'rgba(255,255,255,.15)'), shirt2: null, cuffs: 0x6a1426, pants: 0x2a2a3a, shoes: 0x3a2414, hair: 0x101010, hairBuild: afroBun(0x101010, 0xf2c23a),
    face: { iris: '#2a1406', browColor: '#101010', blush: .2 } });
}
export function makeFinn(scene) {
  return mk(scene, { seed: 905, scale: .88, skin: 0xeeae86, skinCss: '#eeae86', shirt: 0x1d2a4a, shirt2: 0x1d2a4a, cuffs: 0x14203a, pants: 0x5a5a62, shoes: 0x1a1a1a, sole: 0xf2f2f2, hair: 0xe0a02a, hairBuild: sideSwoop(0xe0a02a), noBelt: true,
    torsoDetail: shearling(0x1d2a4a, 0xf2e8d4), face: { iris: '#5a8ac8', browColor: '#a8701a', blush: .5 } }, [scarf(0xd8283a, 0xf2f2f2), gloves(0x1a1a1a)]);
}
export function makeLehrerin(scene) {
  return mk(scene, { seed: 906, skin: 0xeaa880, skinCss: '#eaa880', shirt: 0x6a2a8a, shirt2: 0x6a2a8a, cuffs: 0x4a1a62, pants: 0x2a2a34, shoes: 0x2a1a10, hair: 0xb8441a, hairBuild: hairS(0xb8441a, 'pony'), noBelt: true,
    face: { iris: '#4a8a5a', browColor: '#8a3a14', freckles: 1 } }, [longCoat(0x6a2a8a), beanie(0x3a8a4a, null), o => glasses(o.head), scarf(0xf2c23a)]);
}
export function makeFahrer(scene) {
  return mk(scene, { seed: 907, scale: 1.05, skin: 0xe8b894, skinCss: '#e8b894', shirt: 0x2a4a8a, shirt2: 0x2a4a8a, cuffs: 0xe8f040, pants: 0x2a2a34, hair: 0x8a8a8a, hairBuild: hairS(0x8a8a8a, 'fringe'),
    torsoDetail: sp => { box(2.1, .15, 1.1, mat(0xe8f040, { emissive: 0x6a7010, emissiveIntensity: .3 }), .02, sp, 0, 1.2, 0); }, face: { iris: '#3a6a8a', browColor: '#7a7a7a' } }, [o => mustache(o.head, 0x9a9a9a), o => cap(o.head, 0x2a4a8a, 0xf2c23a)]);
}
// la niña que resbala: trenzas, abrigo rosa
function braids(col) { return (h) => { const m = mat(col, { roughness: .7 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.03, .64, 1.03); h.add(c);
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) sphere(.17 - k * .015, m, h, s * .62, .7 - k * .3, -.1, 8, 6); }; }
export function makeMaedchen(scene) {
  return mk(scene, { seed: 908, scale: .8, skin: 0xd8a47a, skinCss: '#d8a47a', shirt: 0xf27aa8, shirt2: 0xf27aa8, cuffs: 0xffffff, pants: 0x6a4a8a, shoes: 0xf4f4f4, hair: 0x3a2214, hairBuild: braids(0x3a2214), noBelt: true,
    torsoDetail: puffer(0xf27aa8, 0xffffff), face: { iris: '#3a2210', browColor: '#3a2214', blush: .5 } }, [beanie(0xffd23f, 0xf27aa8), boots(0xa8b8d8)]);
}
// compañeros de clase: 12 combinaciones distintas
const KIDS = [
  // skin, hair, style, coat, pants, hat, pom, scarf
  [0xeeb08a, 0x6a3a1e, 'fringe', 0x2a8ad8, 0x2a2a3a, 0xd8323a, 0xffffff, null],
  [0xc88a5a, 0x101010, 'curly', 0x3ab86a, 0x3a3a4a, null, null, 0xf2c23a],
  [0xf0b490, 0xb8441a, 'pony', 0xf2c23a, 0x4a2a6a, 0x2a6ad8, 0xf2c23a, null],
  [0x8d5a3b, 0x141414, 'spiky', 0xd83a3a, 0x2a3446, null, null, 0x2a2a2a],
  [0xe8a882, 0xc8862a, 'long', 0x8a4ad8, 0x2a2a3a, 0x2a8ad8, 0x8a4ad8, null],
  [0xe8b894, 0x3a2214, 'swoop', 0x1aa8a0, 0x4a4a52, 0xf2782a, null, 0xd8323a],
  [0xf0b088, 0x8a3412, 'curly', 0xe85a8a, 0x2a3446, null, null, 0x2a8ad8],
  [0xa86a42, 0x1a1008, 'bun', 0x4a6a2a, 0x2a2a3a, 0xf2c23a, 0x3a3a3a, null],
  [0xeeac84, 0x2a1a10, 'fringe', 0xf2f2f2, 0x2a4a8a, 0x2a2a2a, 0xd8323a, 0x3ab86a],
  [0xd8a47a, 0x5a3a1e, 'spiky', 0x2a4ad8, 0x3a3a3a, null, null, 0xf2782a],
  [0xeaaa86, 0xc07a22, 'pony', 0x3a3a46, 0x6a2a3a, 0xd8323a, 0xffffff, 0xf2f2f2],
  [0x6a4228, 0x101010, 'bun', 0xf2b02a, 0x2a2a3a, null, null, 0x8a4ad8],
];
export function makeKind(scene, i) { const [sk, hr, st, coat, pa, hat, pom, sc] = KIDS[i % KIDS.length]; const A = [];
  if (hat != null) A.push(beanie(hat, pom)); if (sc != null) A.push(scarf(sc)); A.push(boots([0x5a3a22, 0x2a2a2a, 0x8a2a2a, 0x2a4a6a][i % 4])); if (i % 3 === 0) A.push(gloves(0x2a2a2a)); if (i % 4 === 2) A.push(o => glasses(o.head));
  return mk(scene, { seed: 930 + i, scale: .78 + (i % 4) * .03, skin: sk, skinCss: '#' + sk.toString(16).padStart(6, '0'), shirt: coat, shirt2: coat, cuffs: 0x2a2a2a, pants: pa, hair: hr, hairBuild: hairS(hr, st), noBelt: true,
    torsoDetail: puffer(coat), face: { iris: ['#2a1608', '#3a6a8a', '#4a8a5a'][i % 3], browColor: '#' + hr.toString(16).padStart(6, '0'), blush: .3 } }, A);
}
