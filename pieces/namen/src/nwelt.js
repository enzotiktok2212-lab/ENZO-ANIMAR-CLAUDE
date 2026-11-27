// NAMEN — mundo propio: Rufingen (pueblo alemán de entramado y ladrillo) con la NAMENSBANK en la plaza (marcador de quién gana más por su nombre),
// la villa del alcalde con el jacuzzi de oro, el KRASS CENTER (fuera y dentro), el DIGGA GYM, mi calle con mi escalón, la fiesta de Krass (noche),
// la cancha vieja de baloncesto (noche y día de partido) y la cancha nueva «la mejor del mundo».
import { THREE, mat, box, cyl, sphere, textPlane, canvasTex, RNG, V, lerp, clamp } from './engine.js';
import { FONT } from './sets.js';
import { giebelHaus, laterne, bunting, bank, bake, PAVE, GRASS, WOOD, BRICK, BRICK2, TILE } from './ebwelt.js';
const PI = Math.PI;
const shadow = (o, c = true, r = true) => { o.traverse(m => { if (m.isMesh) { m.castShadow = c; m.receiveShadow = r; } }); return o; };
const keep = o => { o.userData.keep = true; return o; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const glowM = (col, k = 1.5) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .4 });
const GOLD = () => mat(0xffc83a, { metalness: .92, roughness: .16, emissive: 0x4a2c00, emissiveIntensity: .25 });
const whiteM = mat(0xf4f2ec, { roughness: .5 });
function plane(w, h, m, p, x, y, z, rx = -PI / 2) { const q = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); q.rotation.x = rx; q.position.set(x, y, z); q.receiveShadow = true; q.userData.noOutline = true; p.add(q); return q; }
const rep = (t, a, b) => { const c = t.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(a, b); c.needsUpdate = true; return c; };
function txt(c, s, x, y, size, fill, stroke, lw) { c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = fill; c.fillText(s, x, y); }
export function sign(w, h, text, bg, fg, em = .6, size = 0.7) { return textPlane(w, h, Math.round(w * 64), Math.round(h * 64), (c, W, H) => { c.fillStyle = bg; c.beginPath(); c.roundRect(0, 0, W, H, H * .2); c.fill(); txt(c, text, W / 2, H / 2 + 3, H * size, fg); }, em); }
// lienzo dinámico (marcadores, pantallas)
export function dynPlane(w, h, pw, ph, em = 1) { const c = document.createElement('canvas'); c.width = pw; c.height = ph; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: em, roughness: .4 })); m.userData.noOutline = true; m.userData.keep = true;
  m.userData.draw = f => { const x = c.getContext('2d'); f(x, pw, ph); t.needsUpdate = true; }; return m; }
const euroFmt = n => n.toLocaleString('de-DE') + ' €';
// ventana con marco blanco, cristal que refleja y jardinera opcional
function ventana(p, x, y, z, w = 2.2, h = 3.2, o = {}) { const g = G(p, x, y, z); box(w + .5, h + .5, .3, whiteM, .05, g, 0, 0, 0);
  box(w, h, .2, new THREE.MeshStandardMaterial({ color: o.lit ? 0xffe0a0 : 0x6a8aa8, emissive: o.lit ? 0xffb050 : 0x000000, emissiveIntensity: o.lit ? 1.4 : 0, roughness: .05, metalness: .5 }), 0, g, 0, 0, .1);
  box(.12, h, .26, whiteM, 0, g, 0, 0, .14); box(w, .12, .26, whiteM, 0, g, 0, h * .15, .14);
  if (o.box) { box(w + .4, .6, .8, mat(0x8a5a2a, { roughness: .8 }), .05, g, 0, -h / 2 - .3, .5); for (let k = 0; k < 5; k++) sphere(.32, mat([0xd8202a, 0xff5a8a, 0xffd23f][k % 3], { roughness: .7 }), g, -w / 2 + .2 + k * w / 4.4, -h / 2 + .2, .6, 8, 6); }
  return g; }
// árbol (tilo) con copa de varias esferas
export function baum(p, x, z, s = 1, seed = 1) { const r = RNG(seed), t = G(p, x, 0, z); t.scale.setScalar(s); cyl(.5, .8, 8, mat(0x5a4030, { roughness: 1 }), 7, t, 0, 4, 0);
  for (let j = 0; j < 6; j++) sphere(2.6 + r() * 1.6, mat([0x3a6a2a, 0x4a7a32, 0x2e5a26, 0x5a8a3a][j % 4], { roughness: .95 }), t, (r() - .5) * 4, 9 + r() * 4, (r() - .5) * 4, 10, 8); return shadow(t); }
function hecke(p, x, z, w, d = 2.4, h = 3) { box(w, h, d, mat(0x2e5a26, { roughness: 1 }), .6, p, x, h / 2, z); }
function blumen(p, x, z, w, d, n = 30, seed = 3) { const r = RNG(seed); box(w, .6, d, mat(0x5a3a22, { roughness: 1 }), .1, p, x, .3, z); for (let k = 0; k < n; k++) sphere(.34 + r() * .2, mat([0xd8202a, 0xff5a8a, 0xffd23f, 0xffffff, 0x9a5ad8][k % 5], { roughness: .7 }), p, x + (r() - .5) * w * .9, .8 + r() * .3, z + (r() - .5) * d * .8, 8, 6); }
function brunnen(p, x, z) { const g = G(p, x, 0, z); const st = mat(0xc8c0b0, { roughness: .8 }); cyl(9, 9.6, 2, st, 32, g, 0, 1, 0); const w = cyl(8.4, 8.4, .2, new THREE.MeshStandardMaterial({ color: 0x3a7a9a, roughness: .05, metalness: .3 }), 32, g, 0, 1.9, 0); w.userData.noOutline = true;
  cyl(1.2, 1.6, 6, st, 12, g, 0, 3, 0); cyl(3.4, 2.2, .8, st, 20, g, 0, 6.2, 0); sphere(1, GOLD(), g, 0, 7.4, 0, 16, 12); return shadow(g); }
// ---------- atrezo ----------
let COINT = null;
export function euroCoin(parent, s = 1) { COINT = COINT || canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#e0a020'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.strokeStyle = '#a86a00'; c.lineWidth = 8; c.beginPath(); c.arc(w / 2, h / 2, w / 2 - 10, 0, 7); c.stroke(); txt(c, '€', w / 2, h / 2 + 4, 74, '#a86a00'); });
  const m = mat(0xffffff, { map: COINT, metalness: .7, roughness: .22, emissive: 0x5a3a00, emissiveIntensity: .35 }), e = mat(0xe8a820, { metalness: .9, roughness: .2 });
  const c = new THREE.Mesh(new THREE.CylinderGeometry(.6 * s, .6 * s, .12 * s, 24), [e, m, m]); c.rotation.x = PI / 2; c.castShadow = true; c.userData.noOutline = true; const g = G(parent); g.add(c); return g; }
let BALLT = null;
export function basketball(parent, r = .62) { BALLT = BALLT || canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#e8641a'; c.fillRect(0, 0, w, h); const r2 = RNG(4); for (let i = 0; i < 1400; i++) { c.fillStyle = `rgba(${r2() < .5 ? '0,0,0' : '255,200,150'},.08)`; c.fillRect(r2() * w, r2() * h, 2, 2); }
    c.strokeStyle = '#1a0e08'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke(); for (const x of [w / 4, w * 3 / 4]) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } c.beginPath(); c.ellipse(0, h / 2, w * .16, h / 2, 0, -PI / 2, PI / 2); c.stroke(); c.beginPath(); c.ellipse(w / 2, h / 2, w * .16, h / 2, 0, PI / 2, PI * 1.5); c.stroke(); c.beginPath(); c.ellipse(w, h / 2, w * .16, h / 2, 0, PI / 2, PI * 1.5); c.stroke(); });
  const b = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 18), mat(0xffffff, { map: BALLT, roughness: .7 })); b.castShadow = true; if (parent) parent.add(b); b.userData.r = r; return b; }
// canasta: poste, tablero, aro y red; mira hacia +z
export function korb(p, x, z, ry = 0, o = {}) { const g = G(p, x, 0, z); g.rotation.y = ry; const pm = o.gold ? GOLD() : mat(o.col ?? 0x2a4a8a, { metalness: .5, roughness: .4 });
  cyl(.4, .5, 13, pm, 12, g, 0, 6.5, -3.2); const arm = box(.5, .5, 3.4, pm, .1, g, 0, 12.6, -1.6); box(7, 4.2, .25, mat(0xffffff, { roughness: .3, transparent: true, opacity: o.gold ? 1 : .92 }), .05, g, 0, 13.2, 0);
  const fr = o.gold ? GOLD() : mat(0xd8202a); box(7.2, .2, .3, fr, 0, g, 0, 15.3, .05); box(7.2, .2, .3, fr, 0, g, 0, 11.1, .05); box(.2, 4.4, .3, fr, 0, g, -3.6, 13.2, .05); box(.2, 4.4, .3, fr, 0, g, 3.6, 13.2, .05); box(2.4, 1.8, .05, mat(0x000000, { transparent: true, opacity: 0 }), 0, g, 0, 12.6, .15);
  for (const [a, b, c2] of [[-1.2, 12.0, .17], [1.2, 12.0, .17], [0, 13.0, .17]]) {} box(2.4, .12, .05, fr, 0, g, 0, 11.7, .16); box(2.4, .12, .05, fr, 0, g, 0, 13.5, .16); box(.12, 1.9, .05, fr, 0, g, -1.2, 12.6, .16); box(.12, 1.9, .05, fr, 0, g, 1.2, 12.6, .16);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, .1, 8, 28), o.gold ? GOLD() : mat(0xff5a1a, { metalness: .4, roughness: .4 })); ring.rotation.x = PI / 2; ring.position.set(0, 11.4, 1.45); g.add(ring);
  const net = new THREE.Mesh(new THREE.CylinderGeometry(1.1, .7, 1.8, 14, 3, true), new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true })); net.position.set(0, 10.5, 1.45); net.userData.noOutline = true; g.add(net);
  g.userData.rim = V(0, 11.4, 1.45); g.userData.net = net; return shadow(g); }
// cochecito de oro
export function kinderwagen(p) { const g = G(p); const gm = GOLD(), dk = mat(0x1a1a1a, { roughness: .5 });
  const body = box(3.6, 2.2, 2.2, gm, .6, g, 0, 2.4, 0); const hood = new THREE.Mesh(new THREE.SphereGeometry(1.5, 20, 10, 0, PI * 2, 0, PI / 2), gm); hood.rotation.z = PI / 2; hood.scale.set(1, 1.3, 1.4); hood.position.set(-1.1, 3.2, 0); g.add(hood);
  box(3.2, .3, 1.8, mat(0xffffff, { roughness: .8 }), .1, g, .1, 3.55, 0); for (const sx of [-1.3, 1.3]) for (const sz of [-1.2, 1.2]) { const w = new THREE.Mesh(new THREE.TorusGeometry(.6, .16, 8, 20), dk); w.position.set(sx, .76, sz); g.add(w); cyl(.18, .18, .1, gm, 8, w, 0, 0, 0).rotation.x = PI / 2; }
  const h = cyl(.08, .08, 3, gm, 8, g, -2.4, 4.0, 0); h.rotation.z = .6; const hb = cyl(.12, .12, 2.4, dk, 8, g, -3.25, 5.2, 0); hb.rotation.x = PI / 2;
  g.userData.seat = V(.2, 3.1, 0); return shadow(g); }
// pesas
export function hantel(p, s = 1, col = 0x1a1a1a) { const g = G(p); g.scale.setScalar(s); const m = mat(0x9a9aa2, { metalness: .8, roughness: .3 }); const b = cyl(.12, .12, 3, m, 10, g, 0, 0, 0); b.rotation.z = PI / 2; for (const sx of [-1.1, 1.1]) { const w = cyl(.6, .6, .5, mat(col, { roughness: .5 }), 16, g, sx, 0, 0); w.rotation.z = PI / 2; } return shadow(g); }
export function langhantel(p, s = 1) { const g = G(p); g.scale.setScalar(s); const m = mat(0xb8b8c0, { metalness: .85, roughness: .25 }); const b = cyl(.14, .14, 11, m, 10, g, 0, 0, 0); b.rotation.z = PI / 2; for (const sx of [-4.2, 4.2]) for (const k of [0, .55]) { const w = cyl(1.6 - k * .5, 1.6 - k * .5, .45, mat([0xd8202a, 0x1a1a1a][k ? 1 : 0], { roughness: .5 }), 20, g, sx + Math.sign(sx) * k, 0, 0); w.rotation.z = PI / 2; } return shadow(g); }
// döner en la mano (pan de pita con relleno)
export function doenerWrap(p, s = 1) { const g = G(p); g.scale.setScalar(s); const br = mat(0xe8c078, { roughness: .9 }); const c = new THREE.Mesh(new THREE.ConeGeometry(.6, 1.8, 10, 1, true), br); c.rotation.x = PI; c.position.y = -.3; g.add(c);
  sphere(.55, mat(0xb86a2a, { roughness: .9 }), g, 0, .55, 0, 10, 8); sphere(.3, mat(0x5ab83a, { roughness: .9 }), g, .25, .8, .1, 8, 6); sphere(.25, mat(0xd8202a, { roughness: .8 }), g, -.25, .8, .1, 8, 6); box(1.1, .9, .05, mat(0xf4f0e8), .05, g, 0, -.6, .55); return shadow(g); }
// burbuja de vapor para el jacuzzi (sprite redondo)
const STEAMT = canvasTex(64, 64, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
// ---------- jacuzzi de oro ----------
export function whirlpool(p, R = 7) { const g = G(p); const gm = GOLD();
  cyl(R + .8, R + 1.2, 2.6, gm, 40, g, 0, 1.3, 0); const rim = new THREE.Mesh(new THREE.TorusGeometry(R + .6, .5, 10, 48), gm); rim.rotation.x = PI / 2; rim.position.y = 2.6; g.add(rim);
  const water = new THREE.Mesh(new THREE.CircleGeometry(R, 48), new THREE.MeshStandardMaterial({ color: 0xffd860, emissive: 0xffb820, emissiveIntensity: .55, roughness: .06, metalness: .35, transparent: true, opacity: .92 })); water.rotation.x = -PI / 2; water.position.y = 2.35; water.userData.noOutline = true; g.add(water);
  for (let k = 0; k < 3; k++) { const st = box(4, .7, 1.4, gm, .2, g, 0, .35 + k * .7, R + 2.6 - k * 1.2); }
  const bm = new THREE.MeshStandardMaterial({ color: 0xfff8e0, roughness: .1, transparent: true, opacity: .55 }); const BUB = new THREE.InstancedMesh(new THREE.SphereGeometry(.14, 8, 6), bm, 120); BUB.userData.noOutline = true; g.add(BUB);
  const COINS = Array.from({ length: 10 }, (_, i) => { const c = euroCoin(g, .9); c.position.set(Math.cos(i * 2.4) * (R * .6), 2.4, Math.sin(i * 2.4) * (R * .6)); c.rotation.set(-PI / 2 + .2, 0, i); return c; });
  const M4 = new THREE.Matrix4(); g.userData.update = (T, on = 1) => { const r = RNG(3); for (let i = 0; i < 120; i++) { const a = r() * PI * 2, d = Math.sqrt(r()) * (R - .6), k = (T * (1.2 + r()) + r()) % 1; M4.makeScale(on * (.5 + k), on * (.5 + k), on * (.5 + k)); M4.setPosition(Math.cos(a) * d, 2.35 + k * .35, Math.sin(a) * d); BUB.setMatrixAt(i, M4); } BUB.instanceMatrix.needsUpdate = true; };
  g.userData.water = water; g.userData.seatY = 2.35; return shadow(g); }

// =====================================================================================================
// RUFINGEN (x = 0): plaza adoquinada; la NAMENSBANK al norte (fachada en z = -48, mira a +z); casas de entramado/ladrillo en x = ±46 (miran al centro)
// y segunda fila en x = ±82; fuente en (0, 10); calle hacia el sur (+z). Farolas en x = ±30. Banderines sobre la plaza.
// =====================================================================================================
export function rufingen(scene) { const g = G(scene); const r = RNG(41);
  plane(3000, 3000, new THREE.MeshStandardMaterial({ map: rep(GRASS, 260, 260), roughness: .95 }), g, 0, -.05, 0);
  plane(150, 420, new THREE.MeshStandardMaterial({ map: rep(PAVE, 12, 34), roughness: .85 }), g, 0, .02, 60);
  plane(26, 900, new THREE.MeshStandardMaterial({ color: 0x4a4a50, roughness: .7 }), g, 0, .03, 600);
  // casas alrededor de la plaza
  const shops = { 1: 'BÄCKEREI', 3: 'EISCAFÉ', 6: 'BLUMEN', 8: 'METZGEREI', 10: 'APOTHEKE' };
  for (let k = 0; k < 12; k++) { const z = -30 + k * 21; for (const s of [-1, 1]) { const i = k * 2 + (s > 0);
    const h = giebelHaus(g, s * 54, z, { w: 18, d: 16, fl: 2 + (i % 3 === 0), seed: i + 3, ry: -s * PI / 2, shop: s < 0 ? shops[k] : shops[k + 1], rose: i % 4 === 1, bench: i % 5 === 2, plaster: i % 4 === 3 ? [0xf4e8c8, 0xe8f0f4, 0xf4d8c8][i % 3] : null, tile2: i % 3 === 0, lit: 0 }); } }
  for (let k = 0; k < 16; k++) for (const s of [-1, 1]) giebelHaus(g, s * 92, -60 + k * 22, { w: 18, d: 16, fl: 3, seed: k * 2 + (s > 0) + 60, ry: -s * PI / 2, tile2: k % 2 === 0, plaster: k % 5 === 1 ? 0xf0e4c8 : null });
  for (let k = 0; k < 14; k++) giebelHaus(g, -150 + k * 23, -130, { w: 18, d: 16, fl: 3, seed: k + 100, tile2: k % 3 === 1 });
  for (let k = 0; k < 10; k++) for (const s of [-1, 1]) giebelHaus(g, s * 54, 260 + k * 24, { w: 18, d: 16, fl: 2 + (k % 2), seed: k * 3 + (s > 0) + 140, ry: -s * PI / 2, tile2: k % 2 === 1 });
  // iglesia al fondo (dimensión) y colinas
  { const ch = G(g, 70, 0, -210); const bm = new THREE.MeshStandardMaterial({ map: BRICK, roughness: .9 }); box(22, 22, 44, bm, .1, ch, 0, 11, 0); box(12, 56, 12, bm, .1, ch, 0, 28, 24); const sp = new THREE.Mesh(new THREE.ConeGeometry(9, 32, 4), mat(0x3a6a5a, { roughness: .5, metalness: .3 })); sp.rotation.y = PI / 4; sp.position.set(0, 72, 24); ch.add(sp); shadow(ch); }
  for (let k = 0; k < 9; k++) { const hill = sphere(160 + r() * 120, mat([0x4a7a3a, 0x3e6a32, 0x5a8a42][k % 3], { roughness: 1 }), g, -900 + k * 230, -120, -900 - r() * 300, 16, 10); hill.scale.y = .5; hill.userData.noOutline = true; }
  for (let k = 0; k < 40; k++) baum(g, (r() < .5 ? -1 : 1) * (120 + r() * 300), -200 + r() * 700, .9 + r() * .5, k + 7);
  // fuente, farolas, árboles de la plaza, bancos, banderines, flores
  brunnen(g, 0, 22);
  const LAMPS = []; for (let k = 0; k < 9; k++) for (const s of [-1, 1]) { const l = laterne(g, s * 32, -24 + k * 26, 0); l.userData.keep = true; LAMPS.push(l); }
  for (let k = 0; k < 6; k++) for (const s of [-1, 1]) baum(g, s * 38, -14 + k * 40, .8, k * 2 + (s > 0) + 300);
  for (let k = 0; k < 4; k++) for (const s of [-1, 1]) bank(g, s * 26, 0, 8 + k * 30, -s * PI / 2);
  for (let k = 0; k < 8; k++) bunting(g, V(-32, 12.5, -24 + k * 26), V(32, 12.5, -24 + k * 26), 2.4);
  for (let k = 0; k < 5; k++) for (const s of [-1, 1]) blumen(g, s * 18, 46 + k * 30, 6, 3, 14, k * 2 + (s > 0));
  // NAMENSBANK: edificio neoclásico con columnas, frontón, cúpula dorada y marcador LED gigante
  const nb = G(g, 0, 0, -66); const stone = mat(0xf2eadc, { roughness: .7 });
  box(76, 30, 34, stone, .2, nb, 0, 15, 0); box(80, 2, 38, stone, .1, nb, 0, 1, 1); for (let k = 0; k < 4; k++) box(64 - k * 3, 1, 6, stone, .05, nb, 0, .5 + k, 19 + k * 1.6 - 6);
  for (let k = 0; k < 8; k++) { const x = -31.5 + k * 9; cyl(1.6, 1.8, 26, mat(0xf8f4ec, { roughness: .5 }), 18, nb, x, 15, 18); cyl(2.4, 2.4, 1.2, GOLD(), 18, nb, x, 28.6, 18); cyl(2.4, 2.4, 1.2, stone, 18, nb, x, 2.6, 18); }
  box(76, 3, 8, stone, .1, nb, 0, 30.5, 18); { const sh = new THREE.Shape(); sh.moveTo(-38, 0); sh.lineTo(38, 0); sh.lineTo(0, 12); sh.closePath(); const pd = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 3, bevelEnabled: false }), stone); pd.position.set(0, 32, 16); nb.add(pd); }
  const dome = new THREE.Mesh(new THREE.SphereGeometry(12, 32, 16, 0, PI * 2, 0, PI / 2), GOLD()); dome.position.set(0, 30, -2); nb.add(dome); cyl(1, 1, 6, GOLD(), 10, nb, 0, 44, -2); sphere(1.6, GOLD(), nb, 0, 48, -2, 14, 10);
  const nbSign = textPlane(40, 4.6, 1600, 184, (c, w, h) => { c.fillStyle = '#1a2a4a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 10; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'NAMENSBANK', w / 2, h / 2 + 8, 130, '#ffd23f'); }, .4); nbSign.position.set(0, 35.2, 19.2); nb.add(nbSign);
  box(14, 16, .6, mat(0x3a2a1a, { roughness: .5 }), .1, nb, 0, 8, 17.4); for (const s of [-1, 1]) box(6.6, 15, .3, mat(0x5a3a1a, { roughness: .4 }), .05, nb, s * 3.5, 7.6, 17.8);
  const BOARD = dynPlane(28, 18.7, 1200, 800, 1.1); BOARD.position.set(0, 17, 20.6); nb.add(BOARD); box(29.4, 20.1, .6, mat(0x1a1a22, { metalness: .5 }), .1, nb, 0, 17, 20.2);
  for (let k = 0; k < 2; k++) for (const s of [-1, 1]) { const fl = G(nb, s * 44, 0, 20 + k * 8); cyl(.2, .2, 18, mat(0xd8d8d8, { metalness: .6 }), 8, fl, 0, 9, 0); const f = box(4, 2.6, .1, mat([0x1a1a1a, 0xd8202a, 0xffd23f][(k + (s > 0)) % 3]), 0, fl, 2, 16.4, 0); }
  shadow(g); bake(g);
  return { g, LAMPS, BOARD }; }
// marcador de la Namensbank: lista [nombre, cantidad, flag]; flag 'me' resalta mi fila
export function drawRanking(B, rows, o = {}) { B.userData.draw((c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a1430'); gr.addColorStop(1, '#101c3a'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
  txt(c, o.title ?? 'TOP-NAMEN HEUTE', w / 2, 70, 66, '#ffd23f'); c.fillStyle = '#ffd23f'; c.fillRect(60, 112, w - 120, 6);
  rows.forEach(([n, v, f], i) => { const y = 180 + i * 104; if (f === 'me') { c.fillStyle = 'rgba(255,60,60,.25)'; c.fillRect(40, y - 46, w - 80, 92); } if (f === 'up') { c.fillStyle = 'rgba(60,255,120,.2)'; c.fillRect(40, y - 46, w - 80, 92); }
    c.textAlign = 'left'; c.font = `700 62px ${FONT}`; c.fillStyle = '#8ad0ff'; c.fillText((i + 1) + '.', 70, y + 4); c.fillStyle = '#ffffff'; c.fillText(n, 170, y + 4);
    c.textAlign = 'right'; c.fillStyle = f === 'me' ? '#ff6a6a' : f === 'down' ? '#ff6a6a' : '#7aff9a'; c.fillText(v, w - 70, y + 4); }); }); }

// =====================================================================================================
// VILLA GENAU (X): terraza de mármol con el jacuzzi de oro en el centro (0, 0, 0); fachada de la villa en z = -34 (mira a +z);
// setos, estatuas doradas, columnas, vista al pueblo detrás de la balaustrada (z = +30).
// =====================================================================================================
export function villa(scene, X) { const g = G(scene, X); const r = RNG(5);
  plane(1600, 1600, new THREE.MeshStandardMaterial({ map: rep(GRASS, 140, 140), roughness: .95 }), g, 0, -.05, 0);
  const marb = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#d8d0c6'; c.fillRect(0, 0, w, h); const r2 = RNG(9); for (let i = 0; i < 40; i++) { c.strokeStyle = `rgba(150,140,130,${.1 + r2() * .15})`; c.lineWidth = 1 + r2() * 2; c.beginPath(); let x = r2() * w, y = r2() * h; c.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r2() - .5) * 60; y += (r2() - .5) * 60; c.lineTo(x, y); } c.stroke(); } c.strokeStyle = 'rgba(120,110,100,.5)'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); }, true); marb.repeat.set(12, 12);
  plane(90, 80, new THREE.MeshStandardMaterial({ map: marb, roughness: .28, metalness: .05 }), g, 0, .03, -2);
  const WP = whirlpool(g, 7); WP.userData.keep = true; WP.traverse(o => o.userData.keep = true);
  // villa
  const v = G(g, 0, 0, -50); const wm = mat(0xe8e0d4, { roughness: .55 }); box(80, 26, 30, wm, .2, v, 0, 13, 0); box(84, 2, 34, mat(0xd8c8a8), .1, v, 0, 27, 0);
  for (let k = 0; k < 6; k++) { cyl(1.4, 1.6, 22, wm, 16, v, -25 + k * 10, 11, 17); cyl(2, 2, 1, GOLD(), 16, v, -25 + k * 10, 22.4, 17); }
  for (let f = 0; f < 2; f++) for (let k = 0; k < 7; k++) ventana(v, -30 + k * 10, 6 + f * 12, 15.2, 3.4, 6, {}); box(10, 13, .6, mat(0x2a1a0a, { roughness: .4 }), .1, v, 0, 6.5, 15.4); box(11, 1, 1, GOLD(), .1, v, 0, 13.4, 15.6);
  const crest = textPlane(14, 3, 700, 150, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(0, 0, w, h, 30); c.fill(); txt(c, 'VILLA GENAU', w / 2, h / 2 + 5, 100, '#5a3a00'); }, .3); crest.position.set(0, 24, 17.2); v.add(crest);
  // balaustrada, setos, estatuas, palmeras en macetas, antorchas
  for (let x = -44; x <= 44; x += 2.4) { cyl(.35, .5, 3, wm, 8, g, x, 1.5, 36); } box(92, .6, 1.4, wm, .1, g, 0, 3.2, 36);
  for (const s of [-1, 1]) { hecke(g, s * 40, 0, 3, 60, 3.5); for (let k = 0; k < 3; k++) { const st = G(g, s * 30, 0, -22 + k * 18); box(3, 4, 3, wm, .1, st, 0, 2, 0); const e = sphere(1.6, GOLD(), st, 0, 5.6, 0, 16, 12); e.scale.y = 1.4; } }
  for (let k = 0; k < 4; k++) for (const s of [-1, 1]) { const t = G(g, s * (14 + k * 5), 0, 18 + (k % 2) * 6); cyl(1.4, 1.1, 2.4, GOLD(), 14, t, 0, 1.2, 0); const tr = cyl(.3, .45, 7, mat(0x8a6a4a), 6, t, 0, 5.5, 0); for (let j = 0; j < 6; j++) { const l = box(5, .2, 1.2, mat(0x3a8a3a, { roughness: .8 }), .1, t, Math.cos(j) * 2, 9, Math.sin(j) * 2); l.rotation.set(Math.sin(j) * .4, j, -.4); } }
  // pueblo al fondo, tras la balaustrada (colina abajo)
  for (let k = 0; k < 18; k++) giebelHaus(g, -220 + k * 26, 120 + (k % 3) * 14, { w: 18, d: 16, fl: 2 + (k % 2), seed: k + 200, ry: PI, tile2: k % 2 === 0 }).position.y = -8;
  for (let k = 0; k < 20; k++) baum(g, -260 + r() * 520, 80 + r() * 40, 1, k + 400).position.y = -4;
  shadow(g); bake(g); return { g, WP }; }

// =====================================================================================================
// KRASS CENTER fuera (X): plaza en z > 0; fachada de cristal en z = -40 (mira a +z) con letrero gigante. Dentro (X + 600): atrio de dos plantas.
// =====================================================================================================
export function krassCenter(scene, X) { const g = G(scene, X); const r = RNG(8);
  plane(1600, 1600, new THREE.MeshStandardMaterial({ map: rep(GRASS, 140, 140), roughness: .95 }), g, 0, -.05, 0);
  plane(180, 160, new THREE.MeshStandardMaterial({ map: rep(PAVE, 14, 12), roughness: .8 }), g, 0, .02, 10);
  const f = G(g, 0, 0, -60); const pink = mat(0xe86aa8, { roughness: .35 }), glass = new THREE.MeshStandardMaterial({ color: 0x9ac8e8, roughness: .04, metalness: .85 });
  box(130, 44, 40, mat(0xf4f0f4, { roughness: .5 }), .2, f, 0, 22, 0); box(100, 34, 1, glass, 0, f, 0, 18, 20.4);
  for (let k = 0; k <= 10; k++) box(.8, 34, 1.4, mat(0xffffff, { metalness: .5, roughness: .2 }), 0, f, -50 + k * 10, 18, 20.6); for (let k = 0; k < 4; k++) box(100, .6, 1.4, mat(0xffffff, { metalness: .5, roughness: .2 }), 0, f, 0, 4 + k * 9.6, 20.6);
  box(132, 6, 42, pink, .3, f, 0, 46, 0); for (const s of [-1, 1]) box(14, 46, 42, pink, .3, f, s * 58, 23, 0);
  const big = textPlane(80, 11, 2400, 330, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#ffd23f'); gr.addColorStop(.5, '#fff6c0'); gr.addColorStop(1, '#ffb820'); txt(c, 'KRASS CENTER', w / 2, h / 2 + 10, 270, gr, '#7a1a4a', 26); }, .7); big.position.set(0, 54, 21); f.add(big);
  const face = textPlane(16, 16, 400, 400, (c, w, h) => { c.fillStyle = '#ff9ac8'; c.beginPath(); c.arc(w / 2, h / 2, w / 2 - 6, 0, 7); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 16; c.stroke(); c.fillStyle = '#f4ecd8'; c.fillRect(70, 60, 260, 90); c.fillStyle = '#f2c8a8'; c.fillRect(110, 120, 180, 190); c.fillStyle = '#1a1a2a'; c.fillRect(140, 180, 30, 40); c.fillRect(230, 180, 30, 40); c.strokeStyle = '#a8205a'; c.lineWidth = 12; c.beginPath(); c.arc(200, 245, 40, .2, PI - .2); c.stroke(); }, .4); face.position.set(0, 34, 21.5); f.add(face);
  box(20, 10, .4, mat(0x222228, { roughness: .1, metalness: .6 }), 0, f, 0, 5, 21); const can = G(f, 0, 0, 26); for (let k = 0; k < 5; k++) { box(4.6, .3, 7, mat([0xe86aa8, 0xffffff][k % 2]), .02, can, -9.2 + k * 4.6, 11, 0).rotation.x = .25; }
  for (let k = 0; k < 6; k++) for (const s of [-1, 1]) { const t = G(g, s * (24 + k * 12), 0, -30 + (k % 2) * 4); cyl(1.6, 1.2, 2.6, mat(0xffffff), 14, t, 0, 1.3, 0); sphere(2.6, mat(0x3a8a3a, { roughness: .9 }), t, 0, 4.6, 0, 12, 8); }
  for (let k = 0; k < 8; k++) baum(g, -80 + k * 23, 80, .9, k + 600); for (let k = 0; k < 6; k++) giebelHaus(g, -120 + k * 48, 150, { w: 20, d: 16, fl: 3, seed: k + 620, ry: PI });
  const flags = []; for (let k = 0; k < 6; k++) { const p = G(g, -50 + k * 20, 0, -12); cyl(.2, .2, 20, mat(0xd8d8d8, { metalness: .6 }), 8, p, 0, 10, 0); box(.1, 8, 3, mat([0xe86aa8, 0xffd23f, 0x9a5ad8][k % 3]), 0, p, 0, 15, 1.6); }
  // dentro
  const I = G(g, 600, 0, 0); const tile = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#f4f0ec'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8e2dc'; c.fillRect(0, 0, w / 2, h / 2); c.fillRect(w / 2, h / 2, w / 2, h / 2); c.strokeStyle = '#d8d0c8'; c.lineWidth = 3; c.strokeRect(0, 0, w, h); }, true); tile.repeat.set(30, 30);
  plane(140, 140, new THREE.MeshStandardMaterial({ map: tile, roughness: .08, metalness: .15 }), I, 0, .02, 0);
  const sky = plane(140, 140, glowM(0xeaf4ff, .5), I, 0, 40, 0, PI / 2); const wl = mat(0xfaf6f8, { roughness: .6 });
  for (const s of [-1, 1]) { box(2, 40, 140, wl, 0, I, s * 70, 20, 0); box(140, 40, 2, wl, 0, I, 0, 20, s * 70); }
  // galería del 1.er piso
  for (const s of [-1, 1]) { box(30, 1.2, 140, mat(0xffffff), .1, I, s * 55, 16, 0); box(.4, 2.4, 140, new THREE.MeshStandardMaterial({ color: 0xbfe0f0, roughness: .05, metalness: .5, transparent: true, opacity: .45 }), 0, I, s * 40, 18, 0); }
  const SHOPS = [['MODE', '#e86aa8'], ['SCHUHE', '#2a6ad8'], ['TECHNIK', '#1a1a2a'], ['PARFÜM', '#9a5ad8'], ['SPIELZEUG', '#ffb820'], ['CAFÉ', '#8a5a2a'], ['SCHMUCK', '#d8a820'], ['SPORT', '#2ab86a']];
  SHOPS.forEach(([n, col], i) => { const s = i % 2 ? 1 : -1, z = -45 + Math.floor(i / 2) * 30, fl = 0; const sg = sign(16, 2.6, n, col, '#ffffff', .8); sg.position.set(s * 68.8, 12.5, z); sg.rotation.y = -s * PI / 2; I.add(sg);
    box(.5, 9, 22, new THREE.MeshStandardMaterial({ color: 0xcfe8f8, roughness: .04, metalness: .6, transparent: true, opacity: .55 }), 0, I, s * 68.6, 5, z);
    for (let k = 0; k < 3; k++) for (let j = 0; j < 4; j++) box(1.6, 1.6, 1.6, mat(new THREE.Color().setHSL(r(), .7, .55).getHex(), { roughness: .5 }), .2, I, s * 66, 1 + k * 2.4, z - 7 + j * 4.4);
    const sg2 = sign(16, 2.6, SHOPS[(i + 3) % 8][0], SHOPS[(i + 3) % 8][1], '#ffffff', .8); sg2.position.set(s * 68.8, 30, z); sg2.rotation.y = -s * PI / 2; I.add(sg2); });
  // rolltreppe, fuente, palmeras, banner de Krass colgando
  const rt = G(I, -22, 0, -10); const st = mat(0xb8b8c0, { metalness: .7, roughness: .3 }); for (let k = 0; k < 16; k++) box(4, .5, 1.4, st, 0, rt, 0, k * 1.0, -k * 1.4); for (const s of [-1, 1]) { const b = box(.4, 2, 24, mat(0xffffff, { roughness: .2 }), .1, rt, s * 2.3, 8, -10.5); b.rotation.x = .62; }
  brunnen(I, 14, 18); for (let k = 0; k < 6; k++) { const t = G(I, (k % 2 ? 1 : -1) * 30, 0, -50 + k * 20); cyl(1.8, 1.4, 3, mat(0xf4f0ec), 14, t, 0, 1.5, 0); cyl(.3, .45, 9, mat(0x8a6a4a), 6, t, 0, 7.5, 0); for (let j = 0; j < 7; j++) { const l = box(6, .2, 1.4, mat(0x2a8a3a, { roughness: .8 }), .1, t, Math.cos(j) * 2.4, 12, Math.sin(j) * 2.4); l.rotation.set(Math.sin(j) * .4, j, -.45); } }
  const ban = textPlane(18, 26, 360, 520, (c, w, h) => { c.fillStyle = '#9a5ad8'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, 16); c.fillRect(0, h - 16, w, 16); txt(c, 'KRASS', w / 2, 90, 96, '#ffd23f'); c.fillStyle = '#f4ecd8'; c.fillRect(90, 170, 180, 70); c.fillStyle = '#f2c8a8'; c.fillRect(110, 220, 140, 150); c.fillStyle = '#ffd23f'; c.fillRect(105, 270, 150, 26); txt(c, 'ALLES IST KRASS', w / 2, 450, 34, '#ffffff'); }, .5); ban.position.set(0, 26, -68); I.add(ban);
  const IL = []; for (let k = 0; k < 6; k++) { const l = sphere(.8, glowM(0xfff4d8, 2.4), I, (k % 2 ? 1 : -1) * 20, 38, -50 + k * 20, 10, 8); IL.push(l); }
  shadow(g); bake(g); return { g, I }; }

// =====================================================================================================
// DIGGA GYM (X): sala de 70 × 46, espejo en la pared del fondo (z = -22), estanterías de mancuernas, bancos, rack, saco, neón rojo.
// =====================================================================================================
export function diggaGym(scene, X) { const g = G(scene, X);
  const rub = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#1e1e22'; c.fillRect(0, 0, w, h); const r2 = RNG(2); for (let i = 0; i < 3000; i++) { c.fillStyle = `rgba(${r2() < .5 ? '255,255,255' : '0,0,0'},${.05 + r2() * .06})`; c.fillRect(r2() * w, r2() * h, 2, 2); } c.strokeStyle = '#2a2a30'; c.lineWidth = 3; c.strokeRect(0, 0, w, h); }, true); rub.repeat.set(18, 12);
  plane(70, 46, new THREE.MeshStandardMaterial({ map: rub, roughness: .9 }), g, 0, .02, 0); plane(70, 46, mat(0x18181c), g, 0, 22, 0, PI / 2);
  const wall = new THREE.MeshStandardMaterial({ map: rep(BRICK2, 6, 2), color: 0x6a6a72, roughness: .9 }); box(70, 22, 1, wall, 0, g, 0, 11, -23.5); for (const s of [-1, 1]) box(1, 22, 46, wall, 0, g, s * 35.5, 11, 0); box(70, 22, 1, wall, 0, g, 0, 11, 23.5);
  box(60, 12, .4, new THREE.MeshStandardMaterial({ color: 0xdfe8ee, roughness: .02, metalness: 1 }), 0, g, 0, 8, -22.8);
  const neon = textPlane(26, 5, 1040, 200, (c, w, h) => { c.shadowColor = '#ff2a2a'; c.shadowBlur = 30; txt(c, 'DIGGA GYM', w / 2, h / 2 + 6, 160, '#ff3a3a'); }, 2.4); neon.position.set(0, 18, -22.6); neon.userData.noOutline = true; g.add(neon);
  for (let k = 0; k < 5; k++) { const l = box(1, .3, 40, glowM(0xffffff, 1.1), 0, g, -24 + k * 12, 21.6, 0); l.userData.noOutline = true; }
  // estanterías con mancuernas (lado izquierdo), bancos con barras, rack, sacos, cuerdas, colchonetas
  for (let k = 0; k < 2; k++) { const rk = G(g, -32, 0, -14 + k * 14); box(2.4, 4, 12, mat(0x2a2a30, { metalness: .5 }), .1, rk, 0, 2, 0); for (let j = 0; j < 7; j++) for (let lv = 0; lv < 2; lv++) { const h = hantel(rk, .5 + lv * .1, [0x1a1a1a, 0xd8202a][j % 2]); h.position.set(.4, 1.6 + lv * 1.8, -5 + j * 1.6); h.rotation.y = PI / 2; } }
  for (let k = 0; k < 3; k++) { const b = G(g, -8 + k * 16, 0, 4); box(2, 2.4, 8, mat(0x1a1a1a, { roughness: .4 }), .3, b, 0, 1.2, 0); box(2.4, .8, 8.4, mat(0xd8202a, { roughness: .6 }), .3, b, 0, 2.8, 0); for (const s of [-1, 1]) box(.4, 7, .4, mat(0x9a9aa2, { metalness: .8 }), .05, b, s * 3, 3.5, -3); const lh = langhantel(b, .8); lh.position.set(0, 6.2, -3); }
  const rack = G(g, 24, 0, -12); for (const s of [-1, 1]) for (const z of [-2, 2]) box(.5, 14, .5, mat(0x2a2a30, { metalness: .6 }), .05, rack, s * 4, 7, z); box(9, .5, .5, mat(0x2a2a30, { metalness: .6 }), .05, rack, 0, 14, -2);
  for (let k = 0; k < 2; k++) { const s = G(g, 28, 0, 6 + k * 9); cyl(.08, .08, 4, mat(0x888888), 4, s, 0, 20, 0); cyl(1.4, 1.4, 6.5, mat(0xd8202a, { roughness: .5 }), 16, s, 0, 14.5, 0); }
  for (let k = 0; k < 4; k++) box(6, .4, 3, mat([0x2a6ad8, 0x1a1a1a][k % 2], { roughness: .8 }), .1, g, -10 + k * 7, .22, -16);
  const posters = ['NO PAIN', 'NO GAIN', 'BRO!']; posters.forEach((t, i) => { const p = sign(9, 3.4, t, '#1a1a1a', '#ff3a3a', .4); p.position.set(-35, 12, -12 + i * 12); p.rotation.y = PI / 2; g.add(p); });
  shadow(g); bake(g); return { g }; }

// =====================================================================================================
// MEINE STRASSE (X): calle a lo largo de z; mi casa en x = -22 (mira a +x) con escalón de 3 peldaños hasta y = 2.4 y puerta; casas a ambos lados,
// aceras, farolas, árboles, buzón «HUSS».
// =====================================================================================================
export function strasse(scene, X) { const g = G(scene, X); const r = RNG(12);
  plane(1600, 1600, new THREE.MeshStandardMaterial({ map: rep(GRASS, 140, 140), roughness: .95 }), g, 0, -.05, 0);
  plane(18, 700, new THREE.MeshStandardMaterial({ color: 0x45454c, roughness: .75 }), g, 0, .03, 0); for (let k = -30; k < 30; k++) plane(.5, 5, mat(0xf4f4f4), g, 0, .05, k * 12);
  for (const s of [-1, 1]) plane(8, 700, new THREE.MeshStandardMaterial({ map: rep(PAVE, 1, 70), roughness: .8 }), g, s * 13, .08, 0);
  for (let k = -9; k < 10; k++) for (const s of [-1, 1]) { if (s < 0 && k === 0) continue; giebelHaus(g, s * 30, k * 22, { w: 18, d: 14, fl: 2 + ((k + 9) % 3 === 0), seed: (k + 9) * 2 + (s > 0) + 700, ry: -s * PI / 2, rose: (k + 9) % 4 === 1, tile2: (k + 9) % 2 === 0, plaster: (k + 9) % 5 === 3 ? 0xf0e0c8 : null }); }
  // mi casa
  const mh = giebelHaus(g, -30, 0, { w: 18, d: 14, fl: 2, seed: 5, ry: PI / 2, plaster: 0xf4e8d0, rose: true }); mh.position.y = 2.4; box(14, 2.4, 18, mat(0xb8b0a0, { roughness: .9 }), .05, g, -30, 1.2, 0);
  for (let k = 0; k < 3; k++) box(2.2, .8, 5, mat(0xc8c0b0, { roughness: .8 }), .05, g, -21.6 + k * 1.1 - 1.1, .4 + k * .8, 0).position.x = -21.6 + (2 - k) * 1.1;
  const mb = G(g, -18, 0, 7); cyl(.15, .15, 4, mat(0x2a2a30), 6, mb, 0, 2, 0); box(1.6, 1.2, 2.2, mat(0x2a6ad8, { roughness: .4 }), .2, mb, 0, 4.4, 0); const mt = sign(1.6, .6, 'HUSS', '#ffffff', '#1a1a1a', 0, .7); mt.position.set(.82, 4.4, 0); mt.rotation.y = PI / 2; mb.add(mt);
  const LAMPS = []; for (let k = -6; k < 7; k++) for (const s of [-1, 1]) { const l = laterne(g, s * 10, k * 30 + 15, 0); l.userData.keep = true; LAMPS.push(l); }
  for (let k = -6; k < 7; k++) for (const s of [-1, 1]) { if (s < 0 && (k === 0 || k === -1)) continue; baum(g, s * 15, k * 30 + 4, .7, k * 2 + (s > 0) + 800); }
  for (let k = 0; k < 30; k++) giebelHaus(g, (r() < .5 ? -1 : 1) * (70 + r() * 20), -320 + k * 22, { w: 18, d: 14, fl: 3, seed: k + 900, ry: r() * 6 });
  shadow(g); bake(g); return { g, LAMPS, DOOR: V(X - 21.4, 2.4, 0) }; }

// =====================================================================================================
// KRASS PARTY (X, de noche): jardín con césped, villa iluminada al fondo (z = -40), guirnaldas de bombillas, globos, mesa DJ, altavoces,
// pancarta, buffet y el puesto de DÖNER GRATIS (x = 18, z = 6, mira a -x).
// =====================================================================================================
export function partyGarten(scene, X) { const g = G(scene, X); const r = RNG(14);
  plane(1600, 1600, new THREE.MeshStandardMaterial({ map: rep(GRASS, 140, 140), roughness: .95 }), g, 0, -.05, 0);
  const v = G(g, 0, 0, -52); box(90, 24, 24, mat(0xf4f0ec, { roughness: .5 }), .2, v, 0, 12, 0); for (let f = 0; f < 2; f++) for (let k = 0; k < 9; k++) ventana(v, -36 + k * 9, 6 + f * 11, 12.2, 3.6, 6, { lit: 1 });
  plane(50, 26, new THREE.MeshStandardMaterial({ color: 0x2ab8e8, emissive: 0x1a88c8, emissiveIntensity: .22, roughness: .05, metalness: .2 }), g, -26, .1, -18); box(52, .6, 28, mat(0xf4f0ec), .1, g, -26, .1, -18);
  const BULBS = []; for (let k = 0; k < 7; k++) { const z = -30 + k * 8, y0 = 13; for (let j = 0; j <= 12; j++) { const x = -40 + j * 6.6, y = y0 - Math.sin(j / 12 * PI) * 2.2; const b = sphere(.32, glowM([0xffe08a, 0xff8ad0, 0x8ae8ff, 0xffd23f][(j + k) % 4], 3), g, x, y, z, 8, 6); b.userData.noOutline = true; } }
  for (const s of [-1, 1]) for (let k = 0; k < 7; k++) cyl(.18, .2, 14, mat(0x3a3a3a), 6, g, s * 42, 7, -30 + k * 8);
  const ban = textPlane(40, 5, 1600, 200, (c, w, h) => { c.fillStyle = '#9a5ad8'; c.beginPath(); c.roundRect(0, 0, w, h, 40); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 10; c.stroke(); txt(c, 'KRASS PARTY  ★  PARTY DES JAHRES', w / 2, h / 2 + 6, 110, '#ffd23f'); }, .9); ban.position.set(0, 20, -38); g.add(ban);
  const dj = G(g, 0, 0, -30); box(14, 4, 4, mat(0x1a1a24, { roughness: .4 }), .2, dj, 0, 2, 0); const dfr = textPlane(13, 2.4, 520, 96, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#ff3a8a'); gr.addColorStop(1, '#3a8aff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); txt(c, 'DJ', w / 2, h / 2 + 3, 70, '#fff'); }, 1.6); dfr.position.set(0, 2, 2.05); dj.add(dfr);
  for (const s of [-1, 1]) { const sp = G(dj, s * 10, 0, 0); box(3.6, 7, 3, mat(0x1a1a22, { roughness: .5 }), .2, sp, 0, 3.5, 0); for (const y of [2, 5]) { const c = cyl(1.1, 1.1, .3, mat(0x3a3a48, { roughness: .3 }), 20, sp, 0, y, 1.55); c.rotation.x = PI / 2; } }
  const disco = sphere(2, mat(0xe8e8f0, { metalness: 1, roughness: .1, flatShading: true }), g, 0, 18, -14, 16, 12);
  for (let k = 0; k < 9; k++) { const t = G(g, -30 + (k % 3) * 9, 0, 8 + Math.floor(k / 3) * 9); cyl(2.6, 2.6, .3, mat(0xffffff), 20, t, 0, 3.4, 0); cyl(.3, .3, 3.4, mat(0xd8d8d8, { metalness: .6 }), 8, t, 0, 1.7, 0); for (let j = 0; j < 4; j++) sphere(.4, mat([0xffd23f, 0xff5a8a, 0x8ad84a, 0xe8641a][j]), t, Math.cos(j * 1.6) * 1.4, 3.8, Math.sin(j * 1.6) * 1.4, 8, 6); }
  for (let k = 0; k < 10; k++) { const bg = G(g, -36 + k * 8, 0, -26 + (k % 2) * 4); for (let j = 0; j < 3; j++) { const b = sphere(.9, mat([0xff4a8a, 0xffd23f, 0x9a5ad8, 0x3ab8ff][(k + j) % 4], { roughness: .2 }), bg, (j - 1) * .9, 8 + j * .6, 0, 12, 10); b.scale.y = 1.2; cyl(.02, .02, 7, mat(0xffffff), 3, bg, (j - 1) * .5, 4, 0); } }
  // puesto de döner
  const d = G(g, 20, 0, 8); d.rotation.y = -PI / 2; const wd = mat(0xf4e8d0, { roughness: .6 });
  box(12, 3.2, 2.4, wd, .1, d, 0, 1.6, 1.8); box(12.4, .3, 2.8, mat(0xd8323a, { roughness: .4 }), .05, d, 0, 3.35, 1.8); box(12, 9.4, .5, wd, .1, d, 0, 4.7, -3.2);
  const menu = textPlane(10, 2.6, 600, 156, (c, w, h) => { c.fillStyle = '#1a1a1a'; c.fillRect(0, 0, w, h); txt(c, 'DÖNER · DÜRÜM · POMMES', w / 2, h / 2 + 4, 52, '#ffd23f'); }, .9); menu.position.set(0, 6.4, -2.9); d.add(menu);
  for (const s2 of [-1, 1]) for (const z of [-3, 2.9]) box(.4, 9.4, .4, mat(0x8a8a8a, { metalness: .5 }), .05, d, s2 * 5.9, 4.7, z);
  box(12.8, .6, 7, mat(0xd8323a), .05, d, 0, 9.6, 0); for (let k = 0; k < 6; k++) { const a = box(2.1, .3, 2.4, mat(k % 2 ? 0xffffff : 0xd8323a), 0, d, -5.25 + k * 2.1, 9.1, 3.9); a.rotation.x = .4; }
  const ds = textPlane(11, 2.6, 660, 156, (c, w, h) => { c.fillStyle = '#d8323a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 26); c.fill(); txt(c, 'DÖNER GRATIS!', w / 2, h * .38, 62, '#ffd23f'); txt(c, 'SAG MEINEN NAMEN: HUSS', w / 2, h * .76, 40, '#ffffff'); }, .8); ds.position.set(0, 11.4, 3.55); d.add(ds);
  const spit = G(d, -3.6, 0, -1.8); cyl(.08, .08, 5, mat(0xaaaaaa, { metalness: .8 }), 6, spit, 0, 5.4, 0); const meat = new THREE.Mesh(new THREE.CylinderGeometry(.8, 1.4, 3.4, 16), mat(0xa85a22, { roughness: .8 })); meat.position.y = 5.4; spit.add(meat); box(1.6, 3.6, .3, glowM(0xff6a1a, 1.4), .1, spit, 0, 5.4, -1.1);
  for (let k = 0; k < 6; k++) { const w = doenerWrap(d, .7); w.position.set(1 + k * .8, 4.1, 2); }
  for (let k = 0; k < 14; k++) baum(g, -60 + r() * 120, -70 - r() * 20, 1, k + 1000);
  for (const s of [-1, 1]) hecke(g, s * 48, 0, 3, 80, 4);
  shadow(g); bake(g); return { g, DOENER: V(X + 20, 0, 8), disco }; }

// =====================================================================================================
// PLATZ (X): cancha de baloncesto de asfalto 32 × 58 (centro en 0,0; canastas en z = ±27 mirando al centro), valla metálica, farolas,
// gradas en x = +24 (miran a -x), marcador dinámico en (−22, 0, −30), casas detrás. FEST (bunting + gradas llenas) para el gran partido.
// =====================================================================================================
export function platz(scene, X, o = {}) { const g = G(scene, X); const r = RNG(o.seed ?? 16); const gold = !!o.gold;
  plane(1600, 1600, new THREE.MeshStandardMaterial({ map: rep(GRASS, 140, 140), roughness: .95 }), g, 0, -.05, 0);
  const court = canvasTex(512, 928, (c, w, h) => { c.fillStyle = gold ? '#1a3a8a' : '#4a4e58'; c.fillRect(0, 0, w, h); const r2 = RNG(5);
    if (!gold) { for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(${r2() < .5 ? '0,0,0' : '255,255,255'},${.04 + r2() * .05})`; c.fillRect(r2() * w, r2() * h, 2, 2); } c.strokeStyle = 'rgba(20,20,24,.6)'; c.lineWidth = 2; for (let k = 0; k < 14; k++) { c.beginPath(); let x = r2() * w, y = r2() * h; c.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (r2() - .5) * 60; y += (r2() - .5) * 60; c.lineTo(x, y); } c.stroke(); } }
    else { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1a4ad8'); gr.addColorStop(.5, '#2a6af0'); gr.addColorStop(1, '#1a4ad8'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#f0a020'; c.fillRect(w * .3, 0, w * .4, h * .22); c.fillRect(w * .3, h * .78, w * .4, h * .22); }
    c.strokeStyle = gold ? '#ffd23f' : 'rgba(240,240,230,.75)'; c.lineWidth = gold ? 9 : 6; c.strokeRect(10, 10, w - 20, h - 20); c.beginPath(); c.moveTo(10, h / 2); c.lineTo(w - 10, h / 2); c.stroke(); c.beginPath(); c.arc(w / 2, h / 2, 60, 0, 7); c.stroke();
    for (const y of [10, h - 10]) { const s = y < h / 2 ? 1 : -1; c.strokeRect(w * .3, y < h / 2 ? 10 : h - 10 - h * .22, w * .4, h * .22); c.beginPath(); c.arc(w / 2, y + s * h * .22, 60, s > 0 ? 0 : PI, s > 0 ? PI : 2 * PI); c.stroke(); c.beginPath(); c.arc(w / 2, y + s * 30, w * .44, s > 0 ? .1 : PI + .1, s > 0 ? PI - .1 : 2 * PI - .1); c.stroke(); }
    if (gold) txt(c, 'HUSS', w / 2, h / 2 + 4, 70, '#ffd23f', '#1a2a6a', 8); });
  plane(40, 66, new THREE.MeshStandardMaterial({ color: gold ? 0x1a3a8a : 0x3a3e48, roughness: .8 }), g, 0, .01, 0); plane(32, 58, new THREE.MeshStandardMaterial({ map: court, roughness: gold ? .12 : .85, metalness: gold ? .2 : 0 }), g, 0, .04, 0);
  const K1 = korb(g, 0, -29, 0, { gold }), K2 = korb(g, 0, 29, PI, { gold });
  // valla
  const fence = canvasTex(64, 64, (c, w, h) => { c.strokeStyle = '#c8ccd2'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(w, h); c.moveTo(w, 0); c.lineTo(0, h); c.stroke(); }, true); fence.repeat.set(30, 5);
  const fm = new THREE.MeshStandardMaterial({ map: fence, transparent: true, alphaTest: .3, side: THREE.DoubleSide, metalness: .6, roughness: .4 });
  if (!gold) { for (const s of [-1, 1]) { const f = plane(66, 10, fm, g, s * 20, 5, 0, 0); f.rotation.y = PI / 2; const f2 = plane(40, 10, fm, g, 0, 5, s * 33, 0); for (let k = 0; k < 12; k++) cyl(.15, .15, 10, mat(0x8a8e96, { metalness: .6 }), 6, g, s * 20, 5, -33 + k * 6); } }
  // gradas
  const ST = G(g, 26, 0, 0); for (let k = 0; k < 6; k++) box(5, 1.2 + k * 1.2, 56, mat(gold ? 0xffd23f : 0x8a8e96, { roughness: .4, metalness: gold ? .6 : .3 }), .05, ST, k * 4, (1.2 + k * 1.2) / 2, 0);
  const ST2 = G(g, -26, 0, 0); ST2.rotation.y = PI; for (let k = 0; k < 6; k++) box(5, 1.2 + k * 1.2, 56, mat(gold ? 0xffd23f : 0x8a8e96, { roughness: .4, metalness: gold ? .6 : .3 }), .05, ST2, k * 4, (1.2 + k * 1.2) / 2, 0);
  const SB = dynPlane(14, 7, 700, 350, 1.4); const sbg = G(g, -11, 0, -38); cyl(.4, .4, 18, mat(0x2a2a30), 8, sbg, -5, 9, 0); cyl(.4, .4, 18, mat(0x2a2a30), 8, sbg, 5, 9, 0); box(15, 8, 1, mat(0x1a1a22), .1, sbg, 0, 18, -.6); SB.position.set(0, 18, 0); sbg.add(SB);
  const LAMPS = []; for (const s of [-1, 1]) for (const z of [-30, 30]) { const l = G(g, s * 21, 0, z); cyl(.3, .4, 22, mat(0x3a3a40, { metalness: .5 }), 8, l, 0, 11, 0); const h = box(4, 1.2, 2, glowM(0xfff4d8, gold ? 2.5 : 1.6), .1, l, -s * 1.4, 22, 0); h.userData.noOutline = true; LAMPS.push(h); }
  const FEST = G(g); for (let k = 0; k < 5; k++) bunting(FEST, V(-20, 12, -30 + k * 15), V(20, 12, -30 + k * 15), 1.6);
  if (gold) { const sg = textPlane(30, 4.6, 1500, 230, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#ffd23f'); gr.addColorStop(.5, '#fff6c0'); gr.addColorStop(1, '#ffb820'); c.fillStyle = '#1a2a6a'; c.beginPath(); c.roundRect(0, 0, w, h, 40); c.fill(); txt(c, 'DER BESTE PLATZ DER WELT', w / 2, h / 2 + 6, 120, gr); }, .8); sg.position.set(0, 24, -38); g.add(sg);
    for (let k = 0; k < 8; k++) { const f = G(g, -18 + k * 5, 0, -40); cyl(.15, .15, 16, GOLD(), 6, f, 0, 8, 0); box(.1, 3, 4, mat([0x1a4ad8, 0xffd23f][k % 2]), 0, f, 0, 14, 2); } }
  // casas y árboles detrás
  for (let k = 0; k < 14; k++) giebelHaus(g, -150 + k * 23, -80, { w: 18, d: 14, fl: 2 + (k % 2), seed: k + 1100 + (gold ? 50 : 0), tile2: k % 2 === 1, lit: o.lit });
  for (let k = 0; k < 10; k++) giebelHaus(g, 70 + (k % 2) * 10, -70 + k * 22, { w: 18, d: 14, fl: 2, seed: k + 1130, ry: -PI / 2, tile2: k % 2 === 0, lit: o.lit });
  for (let k = 0; k < 24; k++) baum(g, -70 + r() * 140, -50 - r() * 20, .9 + r() * .3, k + 1200);
  for (let k = 0; k < 10; k++) baum(g, -40 - r() * 20, -30 + r() * 80, .9, k + 1300);
  FEST.traverse(m => m.userData.keep = true); shadow(g); bake(g);
  return { g, K1, K2, SB, FEST, LAMPS }; }
export function drawScore(SB, a, b, o = {}) { SB.userData.draw((c, w, h) => { c.fillStyle = '#0a0a12'; c.fillRect(0, 0, w, h); txt(c, o.l ?? 'BLAU', w * .27, 60, 46, '#3a8aff'); txt(c, o.r ?? 'PARTY', w * .73, 60, 46, '#ff5aa8');
  txt(c, String(a), w * .27, h * .62, 170, '#ffd23f'); txt(c, String(b), w * .73, h * .62, 170, '#ffd23f'); c.fillStyle = '#ffd23f'; c.fillRect(w / 2 - 4, 110, 8, h - 150); }); }
export { euroFmt };
