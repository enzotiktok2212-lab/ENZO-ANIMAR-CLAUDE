// WUNSCH — escenarios y atrezo propios.
// Sternau: Altstadt de entramado (casas de Röstheim con otros nombres), Marktplatz con fuente de piedra, la torre de San Nikolaus con su campana
// abierta (arcos) y reloj, la Lindenstraße con la tienda de Herr Graufeld (OHRSTÖPSEL), el huerto de Oma Hilde con calabazas gigantes.
// Atrezo: calabaza, gallo, oveja, carta de amor, fajos de billetes, tapones, reloj de pulsera grande, Porsche (pech), bici (asets), perro (stwelt).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, V, lerp, clamp } from './engine.js';
import { FONT, txt } from './props.js';
import { fachwerkHaus, herbstbaum } from './kwelt.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); return t; };
const PI = Math.PI;
export const glowM = (col, k = 2) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .4 });
export function shade(g) { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; }
const noise = (base, cols, n, s, seed = 1) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); const r = RNG(seed); for (let i = 0; i < n; i++) { c.fillStyle = cols[i % cols.length]; c.fillRect(r() * w, r() * h, s + r() * s, s + r() * s); } });

// ---------- torre de San Nikolaus (x, z): fuste de piedra 16 × 16, reloj a y ≈ 46, campanario abierto (y 54–68) con la campana, chapitel verde ----------
export function kirchturm(parent, x, z, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry;
  const st = mat(0xffffff, { map: rep(canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#c8b89a'; c.fillRect(0, 0, w, h); const q = RNG(4); for (let y = 0; y < h; y += 32) for (let xx = (y / 32) % 2 ? -32 : 0; xx < w; xx += 64) { const l = 180 + q() * 40 | 0; c.fillStyle = `rgb(${l},${l - 14},${l - 40})`; c.fillRect(xx + 2, y + 2, 60, 28); } }), 3, 10), roughness: .9 });
  const dk = mat(0x3a3028, { roughness: .9 });
  box(16, 54, 16, st, .2, g, 0, 27, 0); box(17.2, 1.2, 17.2, mat(0xa8987a), .1, g, 0, 1, 0); for (const y of [18, 36, 52]) box(16.8, .8, 16.8, mat(0xb8a888), .1, g, 0, y, 0);
  // portal y ventanas
  box(5, 9, .6, mat(0x5a3220, { roughness: .7 }), .1, g, 0, 4.5, 8.1); const ar = new THREE.Mesh(new THREE.TorusGeometry(2.6, .5, 6, 16, PI), st); ar.position.set(0, 9, 8.2); g.add(ar);
  for (const y of [24, 32]) { box(2.4, 5, .4, dk, .1, g, 0, y, 8.05); }
  // reloj
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const ct = new THREE.CanvasTexture(cv); ct.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.CircleGeometry(4.6, 40), new THREE.MeshStandardMaterial({ map: ct, roughness: .5, emissive: 0xfff0c8, emissiveIntensity: .0, emissiveMap: ct })); face.position.set(0, 44, 8.12); g.add(face);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.7, .35, 8, 40), mat(0xd9a531, { metalness: .85, roughness: .3 })); ring.position.set(0, 44, 8.15); g.add(ring);
  const setClock = (hh, mm, glow = 0) => { const c = cv.getContext('2d'); c.fillStyle = '#f6efdc'; c.beginPath(); c.arc(128, 128, 126, 0, 7); c.fill(); c.fillStyle = '#1a1a1a'; c.font = `700 30px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i / 12 * 6.283 - PI / 2; c.fillText(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][i - 1], 128 + Math.cos(a) * 98, 128 + Math.sin(a) * 98); }
    c.lineCap = 'round'; const ah = ((hh % 12) + mm / 60) / 12 * 6.283 - PI / 2, am = mm / 60 * 6.283 - PI / 2; c.lineWidth = 12; c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.cos(ah) * 55, 128 + Math.sin(ah) * 55); c.stroke(); c.lineWidth = 8; c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.cos(am) * 82, 128 + Math.sin(am) * 82); c.stroke(); c.beginPath(); c.arc(128, 128, 9, 0, 7); c.fill(); ct.needsUpdate = true; face.material.emissiveIntensity = glow; };
  setClock(11, 57);
  // campanario abierto: cuatro pilares, arcos, la campana colgando del yugo (BELL.rotation.x para tañer)
  const by = 54; for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(3.2, 14, 3.2, st, .1, g, sx * 6.4, by + 7, sz * 6.4);
  for (const s of [-1, 1]) { box(16, 2, 3.2, st, .1, g, 0, by + 14, s * 6.4); box(3.2, 2, 16, st, .1, g, s * 6.4, by + 14, 0); const a = new THREE.Mesh(new THREE.TorusGeometry(4.8, .7, 6, 18, PI), st); a.position.set(0, by + 9, s * 6.6); g.add(a); const b = a.clone(); b.rotation.y = PI / 2; b.position.set(s * 6.6, by + 9, 0); g.add(b); }
  box(16, 1.2, 16, st, .1, g, 0, by + .6, 0); box(1, 1, 13, mat(0x4a3020, { roughness: .8 }), .1, g, 0, by + 12.4, 0);
  const BELL = G(g, 0, by + 12, 0); const bm = mat(0xb87a2a, { metalness: .9, roughness: .28 }); const prof = []; for (let i = 0; i <= 14; i++) { const t = i / 14; prof.push(new THREE.Vector2(1.4 + Math.pow(t, 2.2) * 3.4 + (t > .9 ? (t - .9) * 6 : 0), -t * 7)); }
  const bell = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), bm); bell.material.side = THREE.DoubleSide; BELL.add(bell); sphere(1.5, bm, BELL, 0, -.2, 0, 16, 10); const clap = sphere(.9, mat(0x3a3028, { metalness: .6 }), BELL, 0, -6.4, 0, 12, 8); cyl(.18, .18, 5.6, mat(0x3a3028), 6, BELL, 0, -3.4, 0); BELL.userData.clap = clap;
  const BL = new THREE.PointLight(0xffc878, 0, 40, 1.6); BL.position.set(0, by + 6, 0); g.add(BL);
  // chapitel
  const sp = new THREE.Mesh(new THREE.ConeGeometry(12.4, 26, 8), mat(0x4a8a7a, { roughness: .55, metalness: .2 })); sp.rotation.y = PI / 8; sp.position.y = by + 15 + 13; g.add(sp);
  const ball = sphere(1, mat(0xd9a531, { metalness: .9, roughness: .2 }), g, 0, by + 15 + 26.6, 0, 12, 8); const cr = G(g, 0, by + 44, 0); box(.4, 4, .4, mat(0xd9a531, { metalness: .9 }), .05, cr, 0, 0, 0); box(2.2, .4, .4, mat(0xd9a531, { metalness: .9 }), .05, cr, 0, .7, 0);
  return { g: shade(g), BELL, setClock, face, BL }; }

// ---------- calabaza (r = radio) ----------
export function kuerbis(parent, r = 1, col = 0xf07a1a) { const g = G(parent); const m = mat(col, { roughness: .55 }); for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; const s = sphere(r * .62, m, g, Math.cos(a) * r * .42, r * .78, Math.sin(a) * r * .42, 16, 12); s.scale.set(.9, 1.0, .9); }
  sphere(r * .7, m, g, 0, r * .8, 0, 16, 12); const st = cyl(r * .1, r * .14, r * .5, mat(0x5a7a2a, { roughness: .8 }), 8, g, 0, r * 1.55, 0); st.rotation.z = .3; const lf = box(r * .7, r * .04, r * .45, mat(0x4a8a2a), .02, g, r * .3, r * 1.45, 0); lf.rotation.z = -.4; return shade(g); }
// ---------- gallo (alto ≈ 3,4 · s): cuerpo cobrizo, pecho verde oscuro, cresta roja, cola de plumas; userData.crow(k) abre el pico ----------
export function hahn(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const body = G(g, 0, 1.6, 0); const cu = mat(0xc8541a, { roughness: .6 }), dk = mat(0x1a3a2a, { roughness: .5, metalness: .2 }), rd = mat(0xe02020, { roughness: .5 }), yl = mat(0xf0b020, { roughness: .5 });
  const b = sphere(1, cu, body, 0, 0, 0, 16, 12); b.scale.set(.85, .9, 1.2); const ch = sphere(.7, dk, body, 0, -.1, .55, 12, 10); ch.scale.set(.9, 1, .7);
  const neck = G(body, 0, .6, .7); const hd = sphere(.5, cu, neck, 0, .5, 0, 12, 10); for (let i = 0; i < 4; i++) { const c = sphere(.2, rd, neck, 0, 1.0 + (i % 2) * .05, -.25 + i * .18, 8, 6); c.scale.set(.5, 1.2, 1); }
  const wat = sphere(.18, rd, neck, 0, .1, .42, 8, 6); wat.scale.set(.6, 1.4, .6); const bk1 = new THREE.Mesh(new THREE.ConeGeometry(.16, .5, 6), yl); bk1.rotation.x = PI / 2; bk1.position.set(0, .56, .62); neck.add(bk1); const bk2 = bk1.clone(); bk2.position.y = .44; bk2.scale.setScalar(.7); neck.add(bk2);
  for (const s_ of [-1, 1]) { const e = sphere(.09, mat(0x101010), neck, s_ * .32, .62, .3, 8, 6); sphere(.13, mat(0xffffff), neck, s_ * .3, .62, .27, 8, 6).scale.z = .4; }
  const tail = G(body, 0, .3, -.9); for (let i = 0; i < 6; i++) { const f = box(.24, 2.2 - i * .1, .5, i % 2 ? dk : mat(0x2a5a4a, { roughness: .4, metalness: .3 }), .1, tail, (i - 2.5) * .14, 1, -.3); f.rotation.x = -.6 - i * .12; }
  for (const s_ of [-1, 1]) { const w = sphere(.6, mat(0x8a3a12, { roughness: .6 }), body, s_ * .72, .05, -.1, 10, 8); w.scale.set(.3, .8, 1.1); const lg = cyl(.08, .08, 1.3, yl, 6, g, s_ * .3, .7, 0); for (let k = -1; k <= 1; k++) { const t = box(.07, .06, .5, yl, .02, g, s_ * .3 + k * .12, .06, .2); t.rotation.y = k * .4; } }
  g.userData = { neck, bk1, bk2, crow: k => { neck.rotation.x = -.5 * k; bk2.rotation.x = PI / 2 + .6 * k; bk2.position.y = .44 - .1 * k; } }; return shade(g); }
// ---------- oveja (lana de bolas blancas, cara negra) ----------
export function schaf(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const wm = mat(0xf6f4ee, { roughness: 1 }), bk = mat(0x2a2624, { roughness: .8 }); const r = RNG(5);
  for (let i = 0; i < 14; i++) sphere(.55 + r() * .2, wm, g, (r() - .5) * 1.4, 1.9 + (r() - .5) * .7, (r() - .5) * 2.0, 10, 8);
  const hd = G(g, 0, 2.2, 1.4); const h = box(.8, 1, 1, bk, .3, hd, 0, 0, .2); sphere(.5, wm, hd, 0, .55, 0, 8, 6); for (const s_ of [-1, 1]) { const e = box(.5, .2, .3, bk, .08, hd, s_ * .55, .2, 0); e.rotation.z = s_ * .4; sphere(.12, mat(0xffffff), hd, s_ * .22, .15, .7, 8, 6); sphere(.06, mat(0x101010), hd, s_ * .22, .15, .78, 6, 4); }
  for (const [x, z] of [[-.5, -.7], [.5, -.7], [-.5, .7], [.5, .7]]) box(.28, 1.4, .28, bk, .08, g, x, .7, z); g.userData.head = hd; return shade(g); }
// ---------- carta de amor (sobre blanco con corazón rojo) ----------
export function liebesbrief(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const p = textPlane(1.6, 1.1, 160, 110, (c, w, h) => { c.fillStyle = '#fbf6ee'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8c8b0'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(w / 2, h * .6); c.lineTo(w, 0); c.stroke(); c.fillStyle = '#e8203a'; c.beginPath(); c.moveTo(w / 2, h * .82); c.bezierCurveTo(w / 2 - 34, h * .5, w / 2 - 16, h * .3, w / 2, h * .48); c.bezierCurveTo(w / 2 + 16, h * .3, w / 2 + 34, h * .5, w / 2, h * .82); c.fill(); });
  p.material.side = THREE.DoubleSide; g.add(p); return g; }
// ---------- fajo de billetes (50 €: naranja) y montones ----------
const NOTE = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#e8963a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f4b86a'; c.fillRect(8, 8, w - 16, h - 16); c.fillStyle = '#c86a1a'; c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('50', 54, h / 2); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w * .66, h / 2, 34, 0, 7); c.fill(); c.fillStyle = '#c86a1a'; c.font = `700 30px ${FONT}`; c.fillText('EURO', w * .66, h / 2); c.fillStyle = '#8a4a1a'; c.fillRect(w * .86, 0, 10, h); });
export function bundle(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const top = new THREE.MeshStandardMaterial({ map: NOTE, roughness: .8 }), side = mat(0xe8b880, { roughness: .9 }); const b = new THREE.Mesh(new THREE.BoxGeometry(2.4, .5, 1.2), [side, side, top, side, side, side]); b.position.y = .25; b.castShadow = b.receiveShadow = true; g.add(b); box(.4, .54, 1.24, mat(0xfbf6ee), .02, g, 0, .25, 0); return g; }
// montón de fajos (n filas × m columnas × k alturas) con InstancedMesh
export function geldberg(parent, nx = 6, nz = 4, ny = 12, seed = 3) { const g = G(parent); const top = new THREE.MeshStandardMaterial({ map: NOTE, roughness: .8 }), side = mat(0xe8b880, { roughness: .9 }); const geo = new THREE.BoxGeometry(2.4, .5, 1.2); const N = nx * nz * ny; const im = new THREE.InstancedMesh(geo, [side, side, top, side, side, side], N); const r = RNG(seed), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(); let i = 0;
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) for (let z = 0; z < nz; z++) { e.set(0, (r() - .5) * .25, 0); q.setFromEuler(e); m.compose(V((x - nx / 2 + .5) * 2.5 + (r() - .5) * .2, .25 + y * .5, (z - nz / 2 + .5) * 1.3), q, V(1, 1, 1)); im.setMatrixAt(i++, m); }
  im.castShadow = im.receiveShadow = true; g.add(im); g.userData.im = im; g.userData.ny = ny; g.userData.setH = k => { im.count = Math.max(0, Math.round(N * k)); }; return g; }
// ---------- tapón de espuma (naranja) ----------
export function stoepsel(parent, s = 1, col = 0xff8a1a) { const g = G(parent); g.scale.setScalar(s); const m = mat(col, { roughness: .95 }); const c = cyl(.32, .4, 1.1, m, 14, g, 0, .55, 0); sphere(.32, m, g, 0, 1.1, 0, 12, 8).scale.y = .6; sphere(.4, m, g, 0, 0, 0, 12, 8).scale.y = .5; return g; }
// ---------- reloj de pulsera grande (pantalla dibujable: userData.set('23:59:57')) ----------
export function uhr(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); box(2.6, 3, .7, mat(0x1a1a20, { roughness: .3, metalness: .5 }), .4, g, 0, 0, 0); for (const y of [-1, 1]) box(1.8, 2.6, .3, mat(0xe8202a, { roughness: .6 }), .12, g, 0, y * 2.6, -.1);
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 256; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const sc = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.4), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); sc.position.z = .37; g.add(sc);
  g.userData.set = (txt_, col = '#7af0ff') => { const c = cv.getContext('2d'); c.fillStyle = '#05080c'; c.fillRect(0, 0, 256, 256); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 16; c.font = `700 ${txt_.length > 5 ? 50 : 80}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt_, 128, 128); c.shadowBlur = 0; c.fillStyle = '#3a5a6a'; c.font = `700 22px ${FONT}`; c.fillText('MIA ★', 128, 216); t.needsUpdate = true; };
  g.userData.set('23:57'); return g; }
// ---------- cama plegable del sótano ----------
export function pritsche(parent) { const g = G(parent); const fm = mat(0x4a5a4a, { roughness: .6 }); box(4.6, .5, 11, mat(0x6a7a5a, { roughness: .9 }), .15, g, 0, 2.2, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = box(.2, 2.2, .2, fm, .02, g, sx * 2, 1.1, sz * 5); l.rotation.x = sz * .2; } box(3, .6, 1.8, mat(0xf4f4f4, { roughness: .9 }), .25, g, 0, 2.7, -4.2); const q = box(4.4, .4, 7, mat(0x5a5a62, { roughness: 1 }), .2, g, 0, 2.6, 1.4); g.userData.quilt = q; return shade(g); }
// ---------- huerto de Oma Hilde (X): casa de entramado al fondo (z = -40), bancales con calabazas gigantes (CAL) alrededor de (0, 0),
// valla blanca, girasoles, regadera y carretilla; colinas y casas vecinas al fondo. ----------
export function omaGarten(scene, X) { const g = G(scene, X); const gm = mat(0xffffff, { map: rep(noise('#6aa03a', ['#5a9030', '#7ab04a', '#8ac05a'], 2400, 3, 7), 60, 60), roughness: 1 }); const gr = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), gm); gr.rotation.x = -PI / 2; gr.receiveShadow = true; g.add(gr);
  fachwerkHaus(g, 0, -48, 24, 2, 3, 0, {}); fachwerkHaus(g, -34, -60, 16, 2, 5, .3, {}); fachwerkHaus(g, 36, -58, 18, 2, 1, -.3, {}); fachwerkHaus(g, -70, -40, 16, 2, 6, .8, {}); fachwerkHaus(g, 70, -44, 16, 2, 2, -.8, {});
  const soil = mat(0xffffff, { map: rep(noise('#5a3a22', ['#4a2e18', '#6a4a2e'], 900, 3, 2), 3, 3), roughness: 1 }); for (const [x, z] of [[-11, -6], [11, -6], [-11, 12], [11, 12]]) box(16, .8, 12, soil, .2, g, x, .4, z);
  const CAL = []; for (const [x, z, r] of [[-12, -6, 3.4], [10, -8, 4.2], [13, 13, 3.0], [-10, 12, 3.8], [-3, 2, 2.4], [4, 22, 2.2]]) { const k = kuerbis(g, r); k.position.set(x, .8, z); k.rotation.y = x; CAL.push(k); }
  for (const [x, z] of [[-11, -6], [11, -6], [-11, 12], [11, 12]]) for (let i = 0; i < 6; i++) { const v = cyl(.12, .12, 6, mat(0x3a7a2a), 4, g, x - 7 + i * 2.8, .9, z + 5.4); v.rotation.z = PI / 2; v.rotation.y = i; }
  for (let i = 0; i < 7; i++) { const sf = G(g, -24 + i * 1.2, 0, -22 + (i % 2) * 1.4); cyl(.15, .2, 8 + (i % 3), mat(0x4a8a2a), 6, sf, 0, 4 + (i % 3) / 2, 0); const hd = G(sf, 0, 8.2 + (i % 3), .2); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; const p = box(.5, .2, .9, mat(0xffd21a), .1, hd, Math.cos(a) * .9, Math.sin(a) * .9, 0); p.rotation.z = a; } cyl(.7, .7, .3, mat(0x5a3a1a), 12, hd, 0, 0, .1).rotation.x = PI / 2; }
  const fm = mat(0xfbfbf8, { roughness: .6 }); for (let i = -14; i <= 14; i++) { if (Math.abs(i) < 2) continue; box(.5, 3.4, .3, fm, .05, g, i * 2.2, 1.7, 30); } for (const y of [1, 2.6]) { box(28, .3, .2, fm, .02, g, -17.6, y, 30); box(28, .3, .2, fm, .02, g, 17.6, y, 30); }
  const can = G(g, 18, 0, 2); cyl(.9, 1, 2, mat(0x3a8ac8, { metalness: .4, roughness: .4 }), 14, can, 0, 1, 0); const sp = cyl(.12, .2, 2.2, mat(0x3a8ac8), 8, can, 1.2, 1.6, 0); sp.rotation.z = -.9;
  for (const [x, z, s] of [[-40, -10, 1.2], [40, -14, 1.1], [-46, 20, 1.0], [48, 24, 1.15]]) herbstbaum(g, x, z, s, (x + 99) | 0);
  return { g: shade(g), CAL }; }
// ---------- tienda de Herr Graufeld en la Lindenstraße (x, z): casa gris, escaparate lleno de tapones, letrero, cartel de 100 € ----------
export function stoepselLaden(parent, x, z, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry; const h = fachwerkHaus(g, 0, 0, 18, 2, 3, 0, { shop: 'OHRSTÖPSEL' }); h.g.traverse(o => { if (o.isMesh && o.material && o.material.color && !o.material.map) o.material = o.material.clone(); });
  const fr = 9.1; const sg = textPlane(15, 3, 600, 120, (c, w, h) => { c.fillStyle = '#2a2a30'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 20); c.fill(); c.strokeStyle = '#ff8a1a'; c.lineWidth = 8; c.stroke(); txt(c, 'GRAUFELD · OHRSTÖPSEL', w / 2, h / 2 + 4, 60, '#ff9a3a'); }); sg.position.set(0, 7.9, fr + 1.8); g.add(sg);
  const pr = textPlane(4.4, 3, 220, 150, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8202a'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); txt(c, '100 €', w / 2, h * .42, 64, '#c8202a'); txt(c, 'DAS STÜCK', w / 2, h * .78, 30, '#1a1a1a'); }); pr.position.set(4.4, 3.4, fr + .4); g.add(pr);
  const W_ = G(g, 3.6, 2.2, fr - .2); for (let i = 0; i < 24; i++) { const s = stoepsel(W_, .55, [0xff8a1a, 0xffd23f, 0xff5a8a, 0x3ab8f0][i % 4]); s.position.set(-3 + (i % 8) * .85, (i / 8 | 0) * 1.1, 0); s.rotation.z = (i % 3) * .3; }
  const sn = textPlane(6, 1.4, 300, 70, (c, w, h) => { c.fillStyle = '#1a4aa8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#fff'; c.lineWidth = 5; c.strokeRect(4, 4, w - 8, h - 8); txt(c, 'LINDENSTRASSE', w / 2, h / 2 + 3, 40, '#ffffff'); }); sn.position.set(-6, 9.6, fr + .6); g.add(sn);
  return { g: shade(g), front: fr }; }
// ---------- chispas de deseo (estrellitas doradas que giran alrededor de un punto) ----------
export function sparkles(scene, n = 30) { const S = []; const m = new THREE.MeshBasicMaterial({ color: 0xfff2a0, transparent: true, opacity: 1, depthWrite: false }); const geo = new THREE.OctahedronGeometry(.25, 0);
  for (let i = 0; i < n; i++) { const s = new THREE.Mesh(geo, m.clone()); s.userData.noOutline = true; scene.add(s); S.push(s); }
  return { S, hide() { S.forEach(s => s.visible = false); }, at(c, T, k = 1, r = 3, h = 6, cnt = n) { S.forEach((s, i) => { if (i >= cnt) { s.visible = false; return; } const q = RNG(i * 7 + 1), ph = (T * (.4 + q() * .3) + q()) % 1, a = q() * 6.283 + T * (1 + q()); s.visible = k > 0; s.position.set(c.x + Math.cos(a) * r * (.4 + q() * .6), c.y + ph * h, c.z + Math.sin(a) * r * (.4 + q() * .6)); s.scale.setScalar((.6 + q() * .9) * Math.sin(ph * PI) * k); s.rotation.set(T * 3 + i, T * 2, 0); }); } }; }
