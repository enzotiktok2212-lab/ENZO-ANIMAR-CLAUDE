// ADRIAN — reparto propio (nadie se parece al vídeo de referencia).
// Müller (yo, ≈11): pelo negro rizado, pecas, sudadera turquesa con cordones amarillos, cargo beige, zapatillas rojas.
// Mama Adrian: melena caoba con flequillo, vestido verde botella con cuello blanco, pendientes. Papa Adrian: makePapa (gvolk).
// Frau Adrian (profesora): moño gris, gafas de pasta, chaqueta de punto morada con broche, falda gris.
// Mein Bruder Adrian (≈6): pelo rubio despeinado, camiseta amarilla con estrella, pantalón corto azul, mochila verde.
// Polizist Adrian: uniforme azul marino con reflectantes, gorra de plato, bigote.
// Detlef (el impostor): gorra plana marrón, bigote fino, americana de cuadros marrón con camisa naranja, cadena dorada.
// Extras: adultos (ecast.makeExtra) y niños (makeKidX) todos distintos.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG } from './engine.js';
import { mk, hairS, glasses, mustache, cap, shades } from './props.js';
import { FONT } from './sets.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const plaid = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; c.globalAlpha = .5; for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 5, h); c.fillRect(0, i * 16, w, 5); } c.globalAlpha = .35; c.fillStyle = '#f2d8a0'; for (let i = 0; i < 4; i++) { c.fillRect(i * 16 + 10, 0, 1, h); c.fillRect(0, i * 16 + 10, w, 1); } }, true);
const curly = col => h => { const m = mat(col, { roughness: .85 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.22), m); c.position.y = .99; c.scale.set(1.04, .55, 1.04); h.add(c);
  for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283, r = .5 + (i % 2) * .14; sphere(.22, m, h, Math.cos(a) * r, 1.18 + (i % 3) * .09, Math.sin(a) * r * .95 + .02, 10, 8); }
  for (let i = -2; i <= 2; i++) sphere(.2, m, h, i * .22, 1.2, .56, 10, 8); };
const bunGrey = col => h => { const m = mat(col, { roughness: .7 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .68, 1.05); h.add(c);
  const b = sphere(.42, m, h, 0, 1.55, -.42, 14, 10); b.scale.set(1, .9, .9); const pin = cyl(.03, .03, 1.0, mat(0xd8323a), 6, h, 0, 1.6, -.4); pin.rotation.z = 1.2; for (const s of [-1, 1]) { const l = box(.22, .7, .5, m, .1, h, s * .66, .72, -.05); } };
const longFringe = col => h => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.32), m); c.position.y = 1.0; c.scale.set(1.05, .7, 1.05); h.add(c);
  for (let i = -2; i <= 2; i++) { const f = box(.3, .42, .24, m, .1, h, i * .26, 1.12, .55); f.rotation.x = -.25; } for (const s of [-1, 1]) box(.34, 2.0, .95, m, .14, h, s * .68, .1, -.12); box(1.38, 2.1, .42, m, .16, h, 0, .15, -.54); };
const messyBlond = col => h => { const m = mat(col, { roughness: .6 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.28), m); c.position.y = 1.0; c.scale.set(1.05, .64, 1.05); h.add(c);
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; const t = new THREE.Mesh(new THREE.ConeGeometry(.2, .5, 5), m); t.position.set(Math.cos(a) * .45, 1.38, Math.sin(a) * .45); t.rotation.set(Math.sin(a) * .7, 0, -Math.cos(a) * .7); h.add(t); }
  for (let i = -2; i <= 2; i++) { const f = box(.28, .4, .24, m, .1, h, i * .25, 1.1, .54); f.rotation.set(-.35, 0, i * .15); } };
const hoodieT = (col, str) => sp => { const j = mat(col, { roughness: .85 }); box(2.16, 2.1, 1.16, j, .2, sp, 0, 1.0, -.01); box(1.36, .55, .1, j, .1, sp, 0, .45, .6); for (const s of [-1, 1]) { cyl(.05, .05, .8, mat(str), 6, sp, s * .22, 1.52, .62); sphere(.08, mat(str), sp, s * .22, 1.1, .62, 6, 4); }
  const hd = box(1.66, .6, .64, j, .24, sp, 0, 2.0, -.56); hd.rotation.x = -.3; box(2.2, .22, 1.2, mat(col * 0 + 0x1a8a8a), .08, sp, 0, .1, 0); };
const dress = (col, collar) => sp => { const m = mat(col, { roughness: .7 }); box(2.16, 2.1, 1.16, m, .16, sp, 0, 1.0, 0); for (const s of [-1, 1]) { const c = box(.62, .3, .5, mat(collar), .1, sp, s * .3, 2.02, .4); c.rotation.z = s * .3; } for (let k = 0; k < 3; k++) sphere(.07, mat(collar), sp, 0, 1.6 - k * .4, .6, 6, 4); box(2.2, .2, 1.2, mat(0x1a3a2a), .05, sp, 0, .55, 0); };
const cardigan = (col, inner) => sp => { const m = mat(col, { roughness: .95 }); for (const s of [-1, 1]) box(.76, 2.06, 1.16, m, .12, sp, s * .66, 1.0, 0); box(2.1, 2.06, .5, m, .12, sp, 0, 1.0, -.33); box(.6, 2.0, .06, mat(inner), .02, sp, 0, 1.0, .56);
  for (let k = 0; k < 4; k++) sphere(.07, mat(0xf2e2c0), sp, .4, 1.7 - k * .4, .6, 6, 4); const br = cyl(.16, .16, .05, mat(0xe9c23a, { metalness: .8, roughness: .2 }), 12, sp, -.55, 1.65, .6); br.rotation.x = Math.PI / 2; };
const starTee = (col) => sp => { box(2.1, 2.06, 1.12, mat(col, { roughness: .8 }), .12, sp, 0, 1.02, 0); const st = new THREE.Mesh(new THREE.CircleGeometry(.4, 5), mat(0xffffff)); st.position.set(0, 1.25, .58); st.rotation.z = Math.PI / 2; sp.add(st); };
const sportCoat = (inner) => sp => { const m = mat(0xffffff, { roughness: .8, map: plaid('#7a5a3a', '#4a3020') }); for (const s of [-1, 1]) box(.74, 2.06, 1.14, m, .1, sp, s * .66, 1.02, 0); box(2.08, 2.06, .5, m, .1, sp, 0, 1.02, -.32); box(.6, 2.0, .06, mat(inner), .02, sp, 0, 1.02, .56);
  for (const s of [-1, 1]) { const l = box(.34, 1.2, .06, m, .02, sp, s * .4, 1.45, .6); l.rotation.z = s * .36; box(.5, .36, .05, m, .02, sp, s * .62, .5, .6); }
  const c = new THREE.Mesh(new THREE.TorusGeometry(.42, .045, 6, 22, Math.PI), mat(0xffd23f, { metalness: .9, roughness: .15 })); c.rotation.z = Math.PI; c.position.set(0, 1.98, .6); sp.add(c); };
const flatCap = col => o => { const m = mat(col, { roughness: .9 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.8, 22, 10, 0, 6.283, 0, 1.2), m); c.position.set(0, 1.12, -.02); c.scale.set(1.04, .42, 1.06); o.head.add(c); const v = box(1.2, .1, .7, m, .04, o.head, 0, 1.18, .68); v.rotation.x = .12; sphere(.1, m, o.head, 0, 1.47, 0, 6, 4); };
const uniformP = sp => { const m = mat(0x1a2a4a, { roughness: .55 }); box(2.14, 2.1, 1.16, m, .14, sp, 0, 1.02, 0); for (const y of [.55, 1.35]) box(2.18, .18, 1.2, mat(0xd8f040, { emissive: 0x8aa020, emissiveIntensity: .2 }), .03, sp, 0, y, 0);
  const st = textPlane2(1.2, .34, 'POLIZEI'); st.position.set(0, 1.9, .6); sp.add(st); const b = cyl(.18, .18, .05, mat(0xe9c23a, { metalness: .8, roughness: .25 }), 6, sp, -.55, 1.6, .6); b.rotation.x = Math.PI / 2; };
const policeCap = o => { const m = mat(0x1a2a4a, { roughness: .5 }); cyl(.78, .72, .5, m, 20, o.head, 0, 1.45, 0); cyl(.86, .86, .12, m, 20, o.head, 0, 1.72, 0); const v = box(1.1, .08, .5, mat(0x0a0a10, { roughness: .2 }), .03, o.head, 0, 1.24, .65); v.rotation.x = .25; box(1.6, .12, .1, mat(0xd8f040), .02, o.head, 0, 1.44, .74); sphere(.16, mat(0xe9c23a, { metalness: .8 }), o.head, 0, 1.55, .76, 8, 6); };
const backpack = col => o => { const g = new THREE.Group(); g.position.set(0, 1.1, -.62); o.spine.add(g); box(1.5, 1.7, .6, mat(col, { roughness: .8 }), .2, g, 0, 0, -.1); box(1.2, .7, .3, mat(0x2a2a3a), .1, g, 0, -.4, -.35); };
const earrings = (col = 0xe9c23a) => o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 14), mat(col, { metalness: .9, roughness: .2 })); r.position.set(s * .7, .22, .05); r.rotation.y = Math.PI / 2; o.head.add(r); } };
const catGlasses = o => { glasses(o.head); };
function textPlane2(w, h, t) { const tex = canvasTex(256, 72, (c, W, H) => { c.fillStyle = '#d8f040'; c.fillRect(0, 0, W, H); c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#1a2a4a'; c.fillText(t, W / 2, H / 2 + 2); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat(0xffffff, { map: tex, roughness: .6 })); return m; }

export function makeMueller(scene) { return mk(scene, S({ seed: 8101, scale: .82, skin: 0xf2c6a2, shirt: 0x1ab8b8, shirt2: 0x1ab8b8, cuffs: 0x169a9a, pants: 0xc8b48a, shoes: 0xe8322a, sole: 0xffffff, hair: 0x1a120c, hairBuild: curly(0x1a120c),
  torsoDetail: hoodieT(0x1ab8b8, 0xffd23f), face: { iris: '#3a2a14', browColor: '#1a120c', blush: .3, freckles: 1 } })); }
export function makeMamaA(scene) { return mk(scene, S({ seed: 8102, scale: .92, skin: 0xf0c0a0, shirt: 0x1e6a4a, shirt2: 0x1e6a4a, cuffs: 0xffffff, pants: 0x1e6a4a, shoes: 0xb8323a, hair: 0x8a2a14, hairBuild: longFringe(0x8a2a14),
  torsoDetail: dress(0x1e6a4a, 0xffffff), face: { iris: '#4a6a3a', browColor: '#6a2010', blush: .45 } }), [earrings()]); }
export function makeLehrerin(scene) { return mk(scene, S({ seed: 8103, scale: .95, skin: 0xf4cdb0, shirt: 0x7a4ab8, shirt2: 0x7a4ab8, cuffs: 0x5a3a9a, pants: 0x6a6a72, shoes: 0x3a2a20, hair: 0xb8b8bc, hairBuild: bunGrey(0xb8b8bc),
  torsoDetail: cardigan(0x7a4ab8, 0xf4f0e8), face: { iris: '#3a5a7a', browColor: '#8a8a8e', blush: .35 } }), [catGlasses]); }
export function makeBruder(scene) { return mk(scene, S({ seed: 8104, scale: .66, skin: 0xf6d0b0, shirt: 0xffc81a, shirt2: 0xffc81a, cuffs: 0xe8b010, pants: 0x2a6ad8, shorts: true, socks: 0xffffff, shoes: 0x2ab86a, sole: 0xffffff, hair: 0xf0c850, hairBuild: messyBlond(0xf0c850), sleeveShort: true,
  torsoDetail: starTee(0xffc81a), face: { iris: '#3a7ab8', browColor: '#c89a30', blush: .55, freckles: 1 } }), [backpack(0x2ab86a)]); }
export function makePolizist(scene) { return mk(scene, S({ seed: 8105, scale: 1.04, skin: 0x8a5a3a, shirt: 0x1a2a4a, shirt2: 0x1a2a4a, cuffs: 0xd8f040, pants: 0x1a2a4a, shoes: 0x0a0a10, hair: 0x101010, hairBuild: hairS(0x101010, 'fringe'),
  torsoDetail: uniformP, face: { iris: '#2a1a10', browColor: '#101010' } }), [policeCap, o => mustache(o.head, 0x101010)]); }
export function makeDetlef(scene) { return mk(scene, S({ seed: 8106, scale: 1.0, skin: 0xeab08a, shirt: 0xff8a2a, shirt2: 0x7a5a3a, cuffs: 0x5a3a20, pants: 0x3a3a46, shoes: 0x5a3018, sole: 0x2a1a10, hair: 0x6a4a2a, hairBuild: hairS(0x6a4a2a, 'fringe'),
  torsoDetail: sportCoat(0xff8a2a), face: { iris: '#5a3a1a', browColor: '#4a2a14', blush: .3 } }), [flatCap(0x7a5a3a), o => mustache(o.head, 0x4a2a14)]); }
// Mutter im Freibad: pamela de paja, vestido de verano a rayas, gafas de sol en la cabeza
export function makeMutter(scene) { return mk(scene, S({ seed: 8107, scale: .92, skin: 0xd8a07a, shirtMap: canvasTex(32, 32, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff5a85'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 4); }, true), shirt2: null, cuffs: 0xff5a85, pants: 0xff5a85, shoes: 0xf4e2b0, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'long'), sleeveShort: true,
  face: { iris: '#3a2410', browColor: '#2a1a10', blush: .5 } }), [o => { const m = mat(0xf2d898, { roughness: 1 }); cyl(.76, .76, .55, m, 22, o.head, 0, 1.45, 0); const b = cyl(1.5, 1.5, .06, m, 26, o.head, 0, 1.2, 0); cyl(.78, .78, .14, mat(0xff5a85), 22, o.head, 0, 1.3, 0); }, earrings(0xffffff)]); }

// niños de la clase / del pueblo: todos distintos
const KS = [0xf6d0b0, 0xd8a07a, 0x8a5a3a, 0xf4cfb6, 0xc68b5e, 0xeab08a, 0x6a4028, 0xf0b088];
const KH = [0x6a3a1a, 0x1a120c, 0xe0b850, 0xb8441a, 0x3a2214, 0x8a5a2a, 0x2a1a10, 0xf0d080];
const KST = ['fringe', 'pony', 'swoop', 'curly', 'bun', 'spiky', 'long', 'fringe'];
const KSH = [0xd8323a, 0x2a6ad8, 0xff8ad0, 0x2ab86a, 0xff8a3a, 0x6a3ad8, 0xf4f4f4, 0x1aa0a0, 0xffd23f, 0xe86a9a, 0x3a8a4a, 0x8a8e96];
export function makeKidX(scene, i) { const skin = KS[(i * 3 + 1) % KS.length], hair = KH[(i * 5 + 2) % KH.length], st = KST[i % KST.length], shirt = KSH[(i * 7 + 3) % KSH.length];
  const acc = [[], [o => glasses(o.head)], [o => cap(o.head, KSH[(i + 5) % KSH.length], 0xffffff)], [], [o => backpack(KSH[(i + 2) % KSH.length])(o)], [o => glasses(o.head)]][i % 6];
  return mk(scene, S({ seed: 8300 + i, scale: .64 + (i % 3) * .04, skin, shirt, shirt2: shirt, cuffs: shirt, pants: [0x2a3a5a, 0x4a6aa8, 0x3a3a46, 0xc8b48a][i % 4], shorts: i % 3 === 1, socks: 0xffffff, shoes: [0xf4f4f4, 0xd8323a, 0x2a6ad8, 0x1a1a1a][i % 4], hair, hairBuild: hairS(hair, st), sleeveShort: i % 2 === 0,
    face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hair), blush: .45, freckles: i % 4 === 1 ? 1 : 0 } }), acc); }

// ---------- placa «HALLO, ich heiße …» en el pecho ----------
const TAGT = {};
function tagTex(name) { if (TAGT[name]) return TAGT[name]; TAGT[name] = canvasTex(320, 220, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(0, 0, w, h, 22); c.fill(); c.fillStyle = '#d8202f'; c.beginPath(); c.roundRect(0, 0, w, 92, [22, 22, 0, 0]); c.fill();
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffffff'; c.font = `700 50px ${FONT}`; c.fillText('HALLO', w / 2, 32); c.font = `700 24px ${FONT}`; c.fillText('ich heiße', w / 2, 72);
  c.fillStyle = '#16161e'; let f = 76; c.font = `700 ${f}px ${FONT}`; while (c.measureText(name).width > w - 30 && f > 30) { f -= 4; c.font = `700 ${f}px ${FONT}`; } c.fillText(name, w / 2, 158); }); TAGT[name].anisotropy = 8; return TAGT[name]; }
export function nameTag(o, name = 'ADRIAN') { const m = new THREE.MeshStandardMaterial({ map: tagTex(name), roughness: .6, polygonOffset: true, polygonOffsetFactor: -2 }); const p = new THREE.Mesh(new THREE.PlaneGeometry(.92, .64), m); p.position.set(.5, 1.5, .64); p.userData.noOutline = true; o.spine.add(p);
  o.tag = p; o.setTag = n => { if (!n) { p.visible = false; return; } p.visible = true; p.material.map = tagTex(n); }; o.setTag(name); return p; }
