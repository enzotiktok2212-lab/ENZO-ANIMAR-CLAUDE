// KREIDE — reparto propio:
// Emil (11): pelo castaño rojizo revuelto con remolino, pecas, sudadera naranja con capucha y cordones, vaqueros con rodilleras de parche, zapatillas verdes, tiza azul detrás de la oreja.
// Lea (13): trenza larga negra, boina morada, peto vaquero con manchas de pintura sobre camiseta blanca, zapatillas moradas.
// Opa (el anciano de tiza): calvo con laterales blancos, barba blanca corta, gafas redondas, chaqueta de punto marrón con coderas, bufanda roja.
// Lina (5): coletas rubias, chubasquero amarillo, botas de agua rosas. Mila: rizos castaños con corona de flores, vestido lila.
// Postbote: uniforme azul con gorra y cartera de cuero. Chef: silueta de traje negro.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG } from './engine.js';
import { mk, hairS, glasses } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const knit = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 2; for (let x = 0; x < w; x += 8) for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y + 6); c.lineTo(x + 8, y); c.stroke(); } }, true);
const denimP = (a, splat) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(5); for (let i = 0; i < 700; i++) { c.fillStyle = `rgba(255,255,255,${r() * .12})`; c.fillRect(r() * w, r() * h, 3, 1); }
  if (splat) for (let i = 0; i < 16; i++) { c.fillStyle = ['#ff4a8a', '#ffd23f', '#3ab8ff', '#8ad84a', '#ff8a3a', '#b86aff'][i % 6]; c.beginPath(); c.arc(r() * w, r() * h, 3 + r() * 6, 0, 7); c.fill(); } }, true);

// ---------- peinados ----------
const messy = col => h => { const m = mat(col, { roughness: .8 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .65, 1.05); h.add(c);
  for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283, t = new THREE.Mesh(new THREE.ConeGeometry(.22, .6, 5), m); t.position.set(Math.cos(a) * .45, 1.36, Math.sin(a) * .45); t.rotation.set(Math.sin(a) * .9, 0, -Math.cos(a) * .9); h.add(t); }
  const cw = new THREE.Mesh(new THREE.ConeGeometry(.16, .7, 5), m); cw.position.set(.1, 1.72, -.2); cw.rotation.z = -.5; h.add(cw);
  for (let i = -2; i <= 2; i++) { const f = box(.28, .42, .24, m, .1, h, i * .24, 1.12, .55); f.rotation.set(-.4, 0, i * .15); } };
const braid = col => h => { const m = mat(col, { roughness: .45 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.32), m); c.position.y = 1.0; c.scale.set(1.04, .68, 1.04); h.add(c);
  for (const s of [-1, 1]) { const f = box(.55, .42, .26, m, .12, h, s * .3, 1.12, .54); f.rotation.set(-.3, 0, s * .4); }
  for (let k = 0; k < 8; k++) { const b = sphere(.26 - k * .012, m, h, Math.sin(k * 1.6) * .05, .85 - k * .34, -.8 - k * .03, 10, 8); b.scale.set(1, 1.15, 1); } sphere(.12, mat(0xb86aff), h, 0, -1.9, -1.02, 8, 6); };
const pigtails = col => h => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .66, 1.04); h.add(c);
  for (let i = -2; i <= 2; i++) { const f = box(.28, .36, .22, m, .1, h, i * .24, 1.14, .55); f.rotation.set(-.35, 0, i * .08); }
  for (const s of [-1, 1]) { sphere(.14, mat(0xff5aa0), h, s * .78, 1.0, -.1, 8, 6); const p = sphere(.32, m, h, s * 1.0, .75, -.15, 12, 8); p.scale.set(.9, 1.5, .9); const p2 = sphere(.22, m, h, s * 1.12, .3, -.15, 10, 8); p2.scale.set(.9, 1.3, .9); } };
const curlsCrown = col => h => { const m = mat(col, { roughness: .85 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.4), m); c.position.y = 1.0; c.scale.set(1.08, .72, 1.08); h.add(c);
  for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283, y = .2 + (i % 4) * .28; sphere(.26, m, h, Math.cos(a) * .74, y + .3, Math.sin(a) * .7 - .08, 8, 6); }
  for (let i = 0; i < 9; i++) { const a = -2.6 + i / 8 * 5.2; const fl = sphere(.14, mat([0xff7ab0, 0xffffff, 0xffd23f][i % 3], { emissive: 0x331122, emissiveIntensity: .2 }), h, Math.sin(a) * .74, 1.42, Math.cos(a) * .74 - .05, 8, 6); fl.scale.y = .7; sphere(.08, mat(0x6ad84a), h, Math.sin(a + .2) * .74, 1.36, Math.cos(a + .2) * .74 - .05, 6, 4); } };
const baldWhite = h => { const m = mat(0xf4f2ee, { roughness: .9 }); for (const s of [-1, 1]) box(.24, .55, .9, m, .1, h, s * .66, .9, -.12); box(1.2, .5, .3, m, .12, h, 0, .9, -.6); };
const slick = col => h => { const m = mat(col, { roughness: .3 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.25), m); c.position.y = 1.0; c.scale.set(1.03, .58, 1.03); h.add(c); const t = box(1.2, .3, 1.0, m, .14, h, 0, 1.36, 0); t.rotation.x = .1; };

// ---------- ropa ----------
const hoodieO = (col) => sp => { const j = mat(col, { roughness: .9 }); box(2.18, 2.1, 1.18, j, .2, sp, 0, 1.0, -.02); box(1.4, .55, .1, j, .1, sp, 0, .45, .62); box(.07, .5, .04, mat(0x1a1a1a), 0, sp, 0, .45, .68);
  for (const s of [-1, 1]) { cyl(.04, .04, .8, mat(0xffffff), 6, sp, s * .22, 1.55, .64); sphere(.07, mat(0xffffff), sp, s * .22, 1.12, .64, 6, 4); }
  const hd = box(1.7, .62, .66, j, .24, sp, 0, 2.0, -.58); hd.rotation.x = .3; box(2.22, .2, 1.22, mat(0xd8641a, { roughness: 1 }), .08, sp, 0, .02, -.02);
  const lg = cyl(.28, .28, .04, mat(0x2a6ad8), 5, sp, -.55, 1.5, .6); lg.rotation.x = Math.PI / 2; };
const overall = sp => { box(2.1, 2.06, 1.12, mat(0xf8f8f4, { roughness: .9 }), .14, sp, 0, 1.0, 0); const d = mat(0xffffff, { map: denimP('#4a6ab8', 1), roughness: .8 });
  box(1.7, 1.25, .1, d, .04, sp, 0, .62, .6); box(1.7, 1.25, .1, d, .04, sp, 0, .62, -.6); for (const s of [-1, 1]) { box(.24, 1.3, .08, d, .02, sp, s * .55, 1.55, .6); box(.24, 1.3, .08, d, .02, sp, s * .55, 1.55, -.6); sphere(.08, mat(0xd9a531, { metalness: .8 }), sp, s * .55, 1.25, .66, 6, 4); }
  box(.7, .45, .06, d, .02, sp, 0, .82, .66); };
const cardigan = sp => { const m = mat(0xffffff, { roughness: 1, map: knit('#8a5a32', 'rgba(0,0,0,.22)') }); box(2.16, 2.1, 1.18, m, .16, sp, 0, 1.0, 0); box(.5, 1.9, .06, mat(0xf0e8d8), .02, sp, 0, 1.05, .6);
  for (let k = 0; k < 4; k++) sphere(.08, mat(0x4a3018), sp, .3, .4 + k * .42, .64, 6, 4); for (const s of [-1, 1]) box(.55, .45, .06, m, .04, sp, s * .62, .55, .62);
  const sc = mat(0xd8282a, { roughness: 1 }); const r = new THREE.Mesh(new THREE.TorusGeometry(.62, .2, 8, 20), sc); r.rotation.x = Math.PI / 2; r.position.set(0, 2.05, 0); sp.add(r); box(.4, 1.1, .16, sc, .06, sp, .35, 1.45, .66); for (let k = 0; k < 4; k++) box(.08, .2, .1, sc, 0, sp, .26 + k * .07, .82, .67); };
const raincoatY = sp => { const m = mat(0xffd21a, { roughness: .3 }); box(2.16, 2.15, 1.16, m, .16, sp, 0, .95, 0); for (let k = 0; k < 4; k++) box(.2, .12, .06, mat(0x1a1a1a), .02, sp, .1, 1.7 - k * .4, .6); for (const s of [-1, 1]) box(.6, .45, .08, m, .06, sp, s * .6, .45, .6); const hd = box(1.8, .6, .7, m, .26, sp, 0, 2.0, -.6); hd.rotation.x = .3; };
const dress = col => sp => { const m = mat(col, { roughness: .7 }); box(2.1, 2.06, 1.12, m, .14, sp, 0, 1.0, 0); const sk = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.45, 1.1, 16), m); sk.position.y = -.2; sp.add(sk); box(2.14, .2, 1.16, mat(0xffffff), .04, sp, 0, .45, 0); for (let k = 0; k < 3; k++) sphere(.09, mat(0xffffff), sp, 0, .9 + k * .38, .6, 6, 4); };
const postU = sp => { const m = mat(0x2a4a9a, { roughness: .6 }); box(2.16, 2.1, 1.18, m, .14, sp, 0, 1.02, 0); box(.5, 1.0, .06, mat(0xe8eef8), .02, sp, 0, 1.5, .6); for (const s of [-1, 1]) box(.55, .45, .06, m, .04, sp, s * .6, 1.4, .62); box(2.2, .12, 1.22, mat(0xf2c23a), .02, sp, 0, .35, 0);
  const st = new THREE.Mesh(new THREE.BoxGeometry(.2, 2.6, .1), mat(0x6a3a1a)); st.position.set(0, 1.1, .64); st.rotation.z = .75; sp.add(st); const bag = box(1.0, .8, .4, mat(0x7a4a22, { roughness: .7 }), .1, sp, .95, .1, .35); box(1.02, .3, .42, mat(0x5a3412), .08, sp, .95, .4, .36); };
const suitBlack = sp => { const m = mat(0x0c0c12, { roughness: .4 }); box(2.12, 2.08, 1.14, m, .12, sp, 0, 1.02, 0); box(.5, 1.1, .06, mat(0x1a1a22), .02, sp, 0, 1.5, .58); box(.16, .9, .05, mat(0x8a0a14), .02, sp, 0, 1.45, .62); };
// ---------- accesorios ----------
const beret = col => o => { const b = sphere(.82, mat(col, { roughness: 1 }), o.head, -.1, 1.38, 0, 18, 10); b.scale.set(1, .3, 1); sphere(.07, mat(col), o.head, -.1, 1.63, 0, 6, 4); };
const chalkEar = col => o => { const c = cyl(.08, .08, .7, mat(col, { roughness: 1 }), 8, o.head, .74, .95, -.05); c.rotation.set(.3, 0, .2); };
const beard = o => { const m = mat(0xf4f2ee, { roughness: .95 }); box(1.1, .55, .4, m, .18, o.head, 0, .18, .55); box(.9, .25, .3, m, .1, o.head, 0, .45, .66); for (const s of [-1, 1]) box(.22, .5, .5, m, .1, o.head, s * .58, .45, .35); };
const roundGlasses = o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.22, .04, 6, 22), mat(0x6a4a20, { metalness: .5 })); r.position.set(s * .28, .8, .71); o.head.add(r); } box(.16, .04, .04, mat(0x6a4a20), 0, o.head, 0, .82, .72); };
const postCap = o => { const m = mat(0x2a4a9a, { roughness: .5 }); cyl(.76, .72, .45, m, 20, o.head, 0, 1.42, 0); const v = box(1.0, .08, .5, mat(0x0a0a10, { roughness: .2 }), .03, o.head, 0, 1.22, .62); v.rotation.x = .25; box(1.5, .1, .1, mat(0xf2c23a), .02, o.head, 0, 1.4, .72); };
const boots = col => o => { for (const l of [o.legL, o.legR]) { if (!l) continue; } };

export function makeEmil(scene) { return mk(scene, S({ seed: 7101, scale: .8, skin: 0xf6cfb0, shirt: 0xff8a2a, shirt2: 0xff8a2a, cuffs: 0xe8701a, pants: 0x4a6ab0, shoes: 0x3ab84a, sole: 0xffffff, hair: 0x9a4a22, hairBuild: messy(0x9a4a22),
  torsoDetail: hoodieO(0xff8a2a), face: { iris: '#4a7a3a', browColor: '#7a3a18', blush: .45, freckles: 1 } }), [chalkEar(0x5ab8ff)]); }
export function makeLea(scene) { return mk(scene, S({ seed: 7102, scale: .86, skin: 0xd8a07a, shirt: 0xf8f8f4, shirt2: 0xf8f8f4, cuffs: 0xf8f8f4, pants: 0x4a6ab8, shoes: 0x8a4ad8, sole: 0xffffff, hair: 0x14100e, hairBuild: braid(0x14100e), sleeveShort: true,
  torsoDetail: overall, face: { iris: '#3a2410', browColor: '#14100e', blush: .4 } }), [beret(0x8a3ad8)]); }
export function makeOpa(scene) { return mk(scene, S({ seed: 7103, scale: 1.02, skin: 0xf2c0a0, shirt: 0x8a5a32, shirt2: 0x8a5a32, cuffs: 0x6a4222, pants: 0x5a5a62, shoes: 0x3a2414, sole: 0x1a1a1a, hair: 0xf4f2ee, hairBuild: baldWhite,
  torsoDetail: cardigan, face: { iris: '#4a7aaa', browColor: '#e8e6e0', blush: .5 } }), [beard, roundGlasses]); }
export function makeLina(scene) { return mk(scene, S({ seed: 7104, scale: .62, skin: 0xf8d4b8, shirt: 0xffd21a, shirt2: 0xffd21a, cuffs: 0xf0c010, pants: 0xff7ab8, shoes: 0xff5aa0, sole: 0xff5aa0, hair: 0xf2d070, hairBuild: pigtails(0xf2d070),
  torsoDetail: raincoatY, face: { iris: '#3a7ad8', browColor: '#d8b050', blush: .6 } })); }
export function makeMila(scene) { return mk(scene, S({ seed: 7105, scale: .8, skin: 0xc8865a, shirt: 0xc8a8f8, shirt2: 0xc8a8f8, cuffs: 0xffffff, pants: 0xc8a8f8, shoes: 0xffffff, sole: 0xff9ac0, hair: 0x4a2a14, hairBuild: curlsCrown(0x4a2a14), sleeveShort: true,
  torsoDetail: dress(0xc8a8f8), face: { iris: '#3a2010', browColor: '#3a2010', blush: .6 } })); }
export function makePost(scene) { return mk(scene, S({ seed: 7106, scale: 1.0, skin: 0xe8b08a, shirt: 0x2a4a9a, shirt2: 0x2a4a9a, cuffs: 0x1a2a6a, pants: 0x1a2a5a, shoes: 0x1a1a1a, hair: 0x5a3a1e, hairBuild: hairS(0x5a3a1e, 'plain'),
  torsoDetail: postU, face: { iris: '#4a3a1a', browColor: '#4a2a14' } }), [postCap]); }
export function makeChef(scene) { return mk(scene, S({ seed: 7107, scale: 1.12, skin: 0xa8aec0, shirt: 0x0c0c12, shirt2: 0x0c0c12, cuffs: 0x0c0c12, pants: 0x0c0c12, shoes: 0x050508, hair: 0x050508, hairBuild: slick(0x050508),
  torsoDetail: suitBlack, face: { iris: '#ff2a2a', browColor: '#050508' } })); }
