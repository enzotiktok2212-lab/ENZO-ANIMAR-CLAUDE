// KNOPF — reparto propio (nadie se parece al vídeo de referencia).
// Ich klein (≈9): pelo castaño oscuro con remolino, camiseta del SV Lindenthal a rayas verdes y blancas con el 9, pantalón blanco, medias verdes.
// Ich groß (≈16): el mismo pelo más largo, sudadera mostaza, vaqueros, zapatillas blancas.
// Opa: calvo arriba con corona de pelo blanco, barba blanca recortada, gafas redondas doradas, chaqueta de punto granate, pana beige.
// Opa im Krankenhaus: el mismo, con bata azul claro de lunares.
// Bester Freund: rizos negros, chaqueta universitaria roja y blanca. Krankenschwester: uniforme turquesa.
// Todos tienen un botón en la barriga (aro de latón y núcleo turquesa que brilla); quien lo ha usado solo tiene una marca.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane } from './engine.js';
import { mk, hairS, glasses, cap } from './props.js';
const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });

// ---------- el botón ----------
const BRASS = () => mat(0xd9a531, { metalness: .85, roughness: .25 });
export const KCOL = 0x3af0ff;
export function addKnopf(ch, z = .6) { const g = new THREE.Group(); g.position.set(0, .62, z); ch.spine.add(g);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.27, .07, 10, 28), BRASS()); g.add(ring);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(.21, .21, .12, 24), new THREE.MeshStandardMaterial({ color: KCOL, emissive: KCOL, emissiveIntensity: 2.2, roughness: .2 })); core.rotation.x = Math.PI / 2; core.position.z = .03; g.add(core);
  const hi = new THREE.Mesh(new THREE.CircleGeometry(.07, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8 })); hi.position.set(-.07, .07, .1); g.add(hi);
  const used = new THREE.Mesh(new THREE.RingGeometry(.16, .26, 24), new THREE.MeshStandardMaterial({ color: 0x8a6a5a, transparent: true, opacity: .55, roughness: .9 })); used.position.z = .01; used.visible = false; g.add(used);
  ch.knopf = g; ch.knopfCore = core; ch.knopfUsed = used; ch.knopfOn = (on = true, glow = 2.2) => { ring.visible = core.visible = hi.visible = on; used.visible = !on; core.material.emissiveIntensity = glow; };
  g.traverse(m => { if (m.isMesh) m.userData.noOutline = true; }); return g; }

// ---------- peinados y ropa ----------
const tuft = col => h => { const m = mat(col, { roughness: .6 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .66, 1.05); h.add(c);
  for (let i = -2; i <= 2; i++) { const f = box(.3, .44, .26, m, .1, h, i * .25 + .05, 1.1, .55); f.rotation.set(-.3, 0, -.25 + i * .06); }
  for (let i = 0; i < 3; i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(.16, .55, 5), m); t.position.set(-.1 + i * .12, 1.52, -.2); t.rotation.set(-.5, 0, -.4 + i * .3); h.add(t); } };
const tuftLong = col => h => { tuft(col)(h); const m = mat(col, { roughness: .6 }); for (const s of [-1, 1]) box(.26, .7, .9, m, .1, h, s * .68, .82, -.1); box(1.3, .7, .3, m, .12, h, 0, .8, -.56); };
const curlsBlack = col => h => { const m = mat(col, { roughness: .85 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.22), m); c.position.y = .99; c.scale.set(1.04, .55, 1.04); h.add(c); for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283, r = .5 + (i % 2) * .14; sphere(.22, m, h, Math.cos(a) * r, 1.18 + (i % 3) * .09, Math.sin(a) * r * .95 + .02, 10, 8); } };
const opaHead = (col) => (h) => { const m = mat(col, { roughness: .8 }); for (const s of [-1, 1]) { box(.3, .6, 1.0, m, .14, h, s * .67, .9, -.12); } box(1.36, .55, .32, m, .14, h, 0, .86, -.52);
  // barba recortada
  box(1.24, .4, .3, m, .14, h, 0, .1, .52); for (const s of [-1, 1]) box(.24, .7, .5, m, .1, h, s * .58, .4, .38); const mo = box(.7, .16, .14, m, .07, h, 0, .44, .66);
  for (const s of [-1, 1]) box(.34, .1, .1, m, .04, h, s * .28, 1.07, .64);
  const fr = mat(0xc8962a, { metalness: .8, roughness: .25 }); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.2, .035, 8, 24), fr); r.position.set(s * .28, .8, .66); h.add(r); const l = new THREE.Mesh(new THREE.CircleGeometry(.19, 20), new THREE.MeshStandardMaterial({ color: 0xdff4ff, transparent: true, opacity: .22, roughness: .05 })); l.position.set(s * .28, .8, .665); h.add(l); }
  box(.18, .04, .04, fr, 0, h, 0, .82, .66); };
const stripedJersey = (a, b, num) => canvasTex(64, 64, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? b : a; c.fillRect(i * 8, 0, 8, h); } }, true);
const kitTorso = (a, b, num, front) => sp => { const m = mat(0xffffff, { map: stripedJersey(a, b), roughness: .7 }); box(2.12, 2.08, 1.14, m, .14, sp, 0, 1.02, 0); const col = box(.9, .2, .2, mat(a), .05, sp, 0, 2.02, .48);
  const n = textPlane(1.2, 1.2, 96, 96, (c, w, h) => { c.font = '700 80px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 10; c.strokeStyle = a; c.strokeText(num, w / 2, h / 2 + 4); c.fillStyle = '#ffffff'; c.fillText(num, w / 2, h / 2 + 4); }); n.position.set(0, 1.1, -.58); n.rotation.y = Math.PI; sp.add(n);
  if (front) { const f = textPlane(.5, .5, 64, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(32, 32, 28, 0, 7); c.fill(); c.strokeStyle = a; c.lineWidth = 6; c.stroke(); c.fillStyle = a; c.font = '700 22px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SVL', 32, 33); }); f.position.set(-.55, 1.55, .59); sp.add(f); } };
const hoodie = (col, str) => sp => { const j = mat(col, { roughness: .85 }); box(2.16, 2.1, 1.16, j, .2, sp, 0, 1.0, -.01); box(1.36, .55, .1, j, .1, sp, 0, .3, .6); for (const s of [-1, 1]) { cyl(.05, .05, .8, mat(str), 6, sp, s * .22, 1.52, .62); sphere(.08, mat(str), sp, s * .22, 1.1, .62, 6, 4); } const hd = box(1.66, .6, .64, j, .24, sp, 0, 2.0, -.56); hd.rotation.x = -.3; };
const cardigan = (col, inner) => sp => { const m = mat(col, { roughness: .95 }); for (const s of [-1, 1]) box(.76, 2.06, 1.16, m, .12, sp, s * .66, 1.0, 0); box(2.1, 2.06, .5, m, .12, sp, 0, 1.0, -.33); box(.6, 2.0, .06, mat(inner), .02, sp, 0, 1.0, .56);
  for (let k = 0; k < 4; k++) sphere(.08, mat(0x3a2414), sp, .42, 1.75 - k * .42, .6, 6, 4); for (const s of [-1, 1]) box(.5, .45, .06, mat(col), .04, sp, s * .62, .55, .6); box(2.14, .3, 1.18, mat(col), .1, sp, 0, .14, 0); };
const gown = sp => { const t = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#a8d0f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; for (let y = 4; y < h; y += 16) for (let x = (y / 16) % 2 ? 12 : 4; x < w; x += 16) { c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); } }, true); box(2.14, 2.1, 1.16, mat(0xffffff, { map: t, roughness: .9 }), .16, sp, 0, 1.0, 0); const v = box(.7, .5, .06, mat(0xf1c8a8), .05, sp, 0, 1.85, .58); v.rotation.z = .785; };
const varsity = sp => { const r = mat(0xc81e2a, { roughness: .7 }), w = mat(0xf4f0e8, { roughness: .7 }); for (const s of [-1, 1]) box(.72, 2.04, 1.14, r, .1, sp, s * .66, 1.02, 0); box(2.08, 2.04, .5, r, .1, sp, 0, 1.02, -.32); box(.6, 2.0, .06, mat(0x1a1a1a), .02, sp, 0, 1.02, .56);
  box(2.12, .3, 1.18, w, .08, sp, 0, .12, 0); box(1.0, .2, 1.18, w, .08, sp, 0, 2.0, .1); const L = textPlane(.6, .7, 64, 72, (c, w_, h) => { c.font = '700 60px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#ffffff'; c.strokeText('L', 32, 38); c.fillStyle = '#c81e2a'; c.fillText('L', 32, 38); }); L.position.set(-.6, 1.4, .59); sp.add(L); };
const scrubs = sp => { box(2.12, 2.08, 1.14, mat(0x2ab8b0, { roughness: .8 }), .14, sp, 0, 1.0, 0); const v = box(.6, .5, .06, mat(0x1a8a84), .05, sp, 0, 1.85, .57); v.rotation.z = .785; box(.5, .4, .06, mat(0x1a8a84), .02, sp, -.55, 1.3, .58); cyl(.03, .03, .5, mat(0x2a2a2a), 6, sp, -.45, 1.4, .6); };

// ---------- reparto ----------
const HAIR = 0x3a2416;
export function makeKlein(scene) { const o = mk(scene, S({ seed: 9501, scale: .68, skin: 0xf2c8a4, shirt: 0x2a9a4a, shirt2: 0x2a9a4a, cuffs: 0xffffff, pants: 0xf4f4f4, shorts: true, socks: 0x2a9a4a, shoes: 0x1a1a1a, sole: 0xffffff, hair: HAIR, hairBuild: tuft(HAIR), sleeveShort: true,
  torsoDetail: kitTorso('#2a9a4a', '#f4f4f4', '9', true), face: { iris: '#6a8a3a', browColor: '#3a2416', blush: .45 } })); addKnopf(o); return o; }
export function makeGross(scene) { const o = mk(scene, S({ seed: 9502, scale: .92, skin: 0xf2c8a4, shirt: 0xe8b030, shirt2: 0xe8b030, cuffs: 0xd09a20, pants: 0x34507a, shoes: 0xf4f4f4, sole: 0x2a9a4a, hair: HAIR, hairBuild: tuftLong(HAIR),
  torsoDetail: hoodie(0xe8b030, 0xffffff), face: { iris: '#6a8a3a', browColor: '#3a2416', blush: .3 } })); addKnopf(o, .64); return o; }
export function makeOpaK(scene, hosp = false) { const o = mk(scene, S({ seed: hosp ? 9504 : 9503, scale: .96, skin: 0xf1c8a8, shirt: hosp ? 0xa8d0f0 : 0x8a2a32, shirt2: hosp ? 0xf1c8a8 : 0x8a2a32, cuffs: hosp ? 0xa8d0f0 : 0x6a1a22, pants: hosp ? 0xa8d0f0 : 0xc8b08a, shoes: hosp ? 0xf4f4f4 : 0x5a3418, hair: 0xf2f2f2, hairBuild: opaHead(0xf2f2f2), sleeveShort: hosp,
  torsoDetail: hosp ? gown : cardigan(0x8a2a32, 0xf2e8d0), face: { iris: '#5a7a9a', browColor: '#e8e8e8', bags: .3, blush: .35 } })); addKnopf(o, .64); return o; }
export function makeFreund(scene) { const o = mk(scene, S({ seed: 9505, scale: .93, skin: 0x8a5a3a, shirt: 0xc81e2a, shirt2: 0xf4f0e8, cuffs: 0xf4f0e8, pants: 0x2a2a36, shoes: 0xc81e2a, sole: 0xffffff, hair: 0x1a120c, hairBuild: curlsBlack(0x1a120c),
  torsoDetail: varsity, face: { iris: '#2a1a10', browColor: '#1a120c', blush: .2 } })); addKnopf(o, .64); return o; }
export function makeSchwester(scene) { const o = mk(scene, S({ seed: 9506, scale: .94, skin: 0xd8a07a, shirt: 0x2ab8b0, shirt2: 0x2ab8b0, cuffs: 0x1a8a84, pants: 0x2ab8b0, shoes: 0xffffff, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'bun'), sleeveShort: true,
  torsoDetail: scrubs, face: { iris: '#3a2410', browColor: '#2a1a10', blush: .35, lips: 1 } })); addKnopf(o, .62); return o; }
// equipo propio (rayas verdes) y rival (rojo): niños distintos
const KS = [0xf6d0b0, 0xd8a07a, 0x8a5a3a, 0xf4cfb6, 0xc68b5e, 0xeab08a, 0x6a4028, 0xf0b088];
const KH = [0x6a3a1a, 0x1a120c, 0xe0b850, 0xb8441a, 0x3a2214, 0x8a5a2a, 0x2a1a10, 0xf0d080];
const KST = ['fringe', 'swoop', 'curly', 'spiky', 'fringe', 'swoop', 'curly', 'spiky'];
export function makeKicker(scene, i, rival = false) { const skin = KS[(i * 3 + 1) % KS.length], hair = KH[(i * 5 + 2) % KH.length], st = KST[i % KST.length]; const a = rival ? '#d8323a' : '#2a9a4a', b = rival ? '#a81e28' : '#f4f4f4';
  const o = mk(scene, S({ seed: 9600 + i + (rival ? 50 : 0), scale: .64 + (i % 3) * .04, skin, shirt: rival ? 0xd8323a : 0x2a9a4a, shirt2: rival ? 0xd8323a : 0x2a9a4a, cuffs: 0xffffff, pants: rival ? 0x1a1a1a : 0xf4f4f4, shorts: true, socks: rival ? 0xd8323a : 0x2a9a4a, shoes: [0x1a1a1a, 0xf4f4f4, 0x2a6ad8][i % 3], sole: 0xffffff, hair, hairBuild: hairS(hair, st), sleeveShort: true,
    torsoDetail: kitTorso(a, b, String([7, 4, 11, 2, 8, 5, 10, 3][i % 8]), true), face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hair), blush: .45, freckles: i % 4 === 1 ? 1 : 0 } }), i % 5 === 2 ? [o => cap(o.head, rival ? 0xd8323a : 0x2a9a4a, 0xffffff)] : []); addKnopf(o); return o; }
export function makeTorwart(scene) { const o = mk(scene, S({ seed: 9620, scale: .74, skin: 0xf0b088, shirt: 0xff8a1a, shirt2: 0xff8a1a, cuffs: 0x1a1a1a, pants: 0x1a1a1a, shorts: true, socks: 0xff8a1a, shoes: 0x1a1a1a, hair: 0xe0b850, hairBuild: hairS(0xe0b850, 'spiky'),
  torsoDetail: kitTorso('#ff8a1a', '#ffb050', '1', false), face: { iris: '#3a6a8a', browColor: '#c8a040', blush: .45 } }), [o => { for (const a of [o.aL, o.aR]) box(.95, .7, .95, mat(0xf2e81a, { roughness: .6 }), .2, a.hand, 0, -.2, .02); }]); addKnopf(o); return o; }
// bebé recién nacido: pelele amarillo claro, un mechón, mejillas sonrosadas (el botón ya brilla)
export function makeBaby(scene) { const o = mk(scene, S({ seed: 9630, scale: .36, skin: 0xf6d2b8, shirt: 0xfff0a8, shirt2: 0xfff0a8, cuffs: 0xfff0a8, pants: 0xfff0a8, shoes: 0xfff0a8, sole: 0xfff0a8, hair: 0x6a4428,
  hairBuild: h => { const m = mat(0x6a4428, { roughness: .6 }); const t = new THREE.Mesh(new THREE.ConeGeometry(.16, .5, 6), m); t.position.set(0, 1.42, .1); t.rotation.z = -.4; h.add(t); }, face: { iris: '#3a6a9a', blush: .7 } })); addKnopf(o); o.knopf.scale.setScalar(1.6); return o; }

// ---------- vecinas del gancho (0:10–0:12): una Oma con vestido de flores y una vecina rubia ----------
const floral = (bg, fl) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 26; i++) { const x = r() * w, y = r() * h, R = 5 + r() * 6, col = fl[i % fl.length]; c.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; c.beginPath(); c.arc(x + Math.cos(a) * R * .6, y + Math.sin(a) * R * .6, R * .5, 0, 7); c.fill(); } c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(x, y, R * .3, 0, 7); c.fill(); }
  c.fillStyle = '#7ab86a'; for (let i = 0; i < 30; i++) { c.beginPath(); c.ellipse(r() * w, r() * h, 3, 1.6, r() * 3, 0, 7); c.fill(); } }, true);
const dress = (bg, fl, col) => sp => { const m = mat(0xffffff, { map: floral(bg, fl), roughness: .9 }); box(2.16, 2.1, 1.18, m, .16, sp, 0, 1.0, 0); box(1.0, .22, .1, mat(col), .06, sp, 0, 1.98, .58); box(2.3, .5, 1.3, m, .14, sp, 0, .05, 0); };
const omaBun = col => h => { const m = mat(col, { roughness: .7 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 26, 13, 0, 6.283, 0, 1.35), m); c.position.y = .98; c.scale.set(1.06, .7, 1.06); h.add(c); sphere(.4, m, h, 0, 1.55, -.42, 14, 10);
  for (const s of [-1, 1]) box(.24, .62, .8, m, .1, h, s * .68, .78, -.12); for (let i = -2; i <= 2; i++) { const f = box(.32, .3, .2, m, .1, h, i * .26, 1.18, .56); f.rotation.x = -.35; } };
const blondLong = col => h => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.75, 26, 13, 0, 6.283, 0, 1.35), m); c.position.y = .98; c.scale.set(1.07, .68, 1.07); h.add(c);
  for (const s of [-1, 1]) box(.34, 1.7, .9, m, .14, h, s * .68, .3, -.1); box(1.46, 1.8, .34, m, .14, h, 0, .3, -.58); const f = box(1.3, .36, .24, m, .12, h, .15, 1.16, .55); f.rotation.set(-.3, 0, -.18); };
export function makeOma(scene) { const o = mk(scene, S({ seed: 9530, scale: .9, skin: 0xf2cfb4, shirt: 0x2a2a5a, shirt2: 0x2a2a5a, cuffs: 0xe8e0f0, pants: 0x1a1a2a, shoes: 0x3a2418, hair: 0xd8d8de, hairBuild: omaBun(0xd8d8de),
  torsoDetail: dress('#2c2a5e', ['#e8506a', '#f4a6c0', '#ffffff', '#c84a8a'], 0xe8e0f0), face: { iris: '#4a6a8a', browColor: '#b8b8c0', blush: .5, lips: 1 } }), [o => glasses(o.head)]); addKnopf(o, .62); return o; }
export function makeBlond(scene) { const o = mk(scene, S({ seed: 9531, scale: .92, skin: 0xf6d2b8, shirt: 0x6ab8e8, shirt2: 0x6ab8e8, cuffs: 0xffffff, pants: 0x3a5a9a, shoes: 0xffffff, hair: 0xf2cc50, hairBuild: blondLong(0xf2cc50), sleeveShort: true,
  torsoDetail: dress('#7ac0ee', ['#ffffff', '#fff2a0'], 0xffffff), face: { iris: '#3a7ab8', browColor: '#c8a040', blush: .45, lips: 1 } })); addKnopf(o, .62); return o; }
