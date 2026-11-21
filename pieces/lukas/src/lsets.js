// LUKAS — escenarios y atrezo propios: Paketshop (interior con mostrador y estanterías llenas de paquetes «LUKAS»),
// fachada del Paketshop, Automat de la Mensa (dos botones: LUKAS y MIA), Sprecherkabine del estadio, gato, zapatillas,
// consola, cascos rosas de regalo, carretilla, pancarta FEHLER, cartel del colegio.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { FONT } from './sets.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const txt = (c, s, x, y, size, fill, stroke = null, lw = 0) => { c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw || size * .14; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = fill; c.fillText(s, x, y); };
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const glow = (col, k = 1.4) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .4 });
const card = mat(0xc89a5a, { roughness: .85 }), tape = mat(0xe8d8a8, { roughness: .6 });

// paquete de cartón con etiqueta (nombre) y cinta
const LBL = {};
const lblTex = n => LBL[n] || (LBL[n] = canvasTex(160, 100, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#16161e'; for (let k = 0; k < 9; k++) c.fillRect(10 + k * 6, 66, k % 3 ? 3 : 5, 26); txt(c, n, w / 2 + 14, 34, n.length > 5 ? 30 : 40, '#d8202f'); }));
export function pkg(parent, w = 2, h = 1.4, d = 1.6, name = 'LUKAS', col = null) { const g = G(parent); box(w, h, d, col ? mat(col, { roughness: .8 }) : card, .08, g, 0, h / 2, 0); box(w + .02, .14, d * .3, tape, .02, g, 0, h + .01, 0);
  const l = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(w * .6, 1.3), Math.min(w * .6, 1.3) * .62), new THREE.MeshStandardMaterial({ map: lblTex(name), roughness: .6 })); l.position.set(0, h * .5, d / 2 + .02); l.userData.noOutline = true; g.add(l); g.userData.h = h; return shade(g); }

// ---------- Paketshop (interior) en X: mostrador en z = -4, estanterías al fondo (z = -14) y a los lados; puerta en z = 14 ----------
export function paketshop(scene, X) { const g = G(scene, X); const r = RNG(41);
  const floorT = canvasTex(256, 256, (c, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { c.fillStyle = (i + j) % 2 ? '#d8d2c4' : '#c8c0b0'; c.fillRect(i * 32, j * 32, 32, 32); } }); floorT.wrapS = floorT.wrapT = THREE.RepeatWrapping; floorT.repeat.set(5, 4);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 34), mat(0xffffff, { map: floorT, roughness: .45 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; g.add(fl);
  const wall = mat(0xf2ead8, { roughness: .9 }), acc = mat(0x2ab86a, { roughness: .7 });
  box(40, 16, .5, wall, 0, g, 0, 8, -17); for (const s of [-1, 1]) box(.5, 16, 34, wall, 0, g, s * 20, 8, 0); box(40, 1.4, .6, acc, .05, g, 0, 1.2, -16.6); box(40, .5, 34, mat(0xffffff, { roughness: .9 }), 0, g, 0, 16, 0);
  // pared delantera con puerta de cristal (z = 17), solo arriba y a los lados para que la cámara pueda entrar
  box(14, 16, .5, wall, 0, g, -13, 8, 17); box(14, 16, .5, wall, 0, g, 13, 8, 17); box(12, 6, .5, wall, 0, g, 0, 13, 17);
  // letrero del fondo
  const sg = textPlane(18, 3.4, 720, 136, (c, w, h) => { c.fillStyle = '#2ab86a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 30); c.fill(); txt(c, 'PAKETSHOP · ABHOLUNG', w / 2, h / 2 + 4, 78, '#ffffff', '#145a32', 10); }, .35); sg.position.set(0, 13, -16.7); g.add(sg);
  // estanterías del fondo y laterales repletas de paquetes LUKAS (y alguno MIA)
  const SH = []; const shelf = (x, z, ry, n) => { const s = G(g, x, 0, z); s.rotation.y = ry; for (const sx of [-1, 1]) box(.4, 11, 2.6, mat(0x8a8e96, { metalness: .5, roughness: .4 }), .05, s, sx * n * 1.25, 5.5, 0);
    for (let k = 0; k < 4; k++) { box(n * 2.5, .25, 2.6, mat(0xb8bcc4, { metalness: .4, roughness: .4 }), .03, s, 0, .6 + k * 2.8, 0); for (let i = 0; i < n; i++) { const w = 1.5 + r() * .7, h = 1.0 + r() * 1.1; const p = pkg(s, w, h, 1.8, r() < .2 ? 'MIA' : 'LUKAS', r() < .25 ? 0xb88a50 : null); p.position.set(-n * 1.25 + 1.25 + i * 2.5 + (r() - .5) * .3, .73 + k * 2.8, 0); p.rotation.y = (r() - .5) * .2; SH.push(p); } } return s; };
  shelf(-9, -15, 0, 5); shelf(9, -15, 0, 5); shelf(-18.6, -3, Math.PI / 2, 5); shelf(18.6, -3, -Math.PI / 2, 5);
  // mostrador con báscula, escáner, pantalla y una pila de paquetes
  const cnt = G(g, 0, 0, -4); box(16, 4.2, 3, mat(0xffffff, { roughness: .4 }), .2, cnt, 0, 2.1, 0); box(16.4, .35, 3.4, mat(0x3a3a46, { roughness: .3 }), .05, cnt, 0, 4.35, 0); box(16.1, .8, 3.05, acc, .1, cnt, 0, .5, 0);
  const sc = box(2, .3, 2, mat(0xd8dce4, { metalness: .7, roughness: .2 }), .05, cnt, -5, 4.7, 0); const scr = G(cnt, 4.5, 4.5, -.6); box(.25, 1.6, .25, mat(0x2a2a34), .05, scr, 0, .8, 0); const sn = box(2.2, 1.4, .2, mat(0x1a1a22), .05, scr, 0, 2.0, 0); box(2.0, 1.2, .05, glow(0x3ab8ff, .9), .02, scr, 0, 2.0, .12); sn.rotation.x = -.2;
  const gun = box(.4, .9, .4, mat(0xffd23f), .1, cnt, -2.6, 4.9, .4); gun.rotation.z = .5;
  // carteles y detalles: horario, cola, plantas, lámparas colgantes
  const hrs = textPlane(4, 5, 200, 250, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2ab86a'; c.fillRect(0, 0, w, 56); txt(c, 'ÖFFNUNGSZEITEN', w / 2, 30, 22, '#fff'); ['Mo–Fr 8–20', 'Sa 9–16', 'So zu'].forEach((t, i) => txt(c, t, w / 2, 100 + i * 50, 28, '#2a2a34')); }); hrs.position.set(-19.7, 8, 9); hrs.rotation.y = Math.PI / 2; g.add(hrs);
  for (let k = 0; k < 4; k++) { cyl(.04, .04, 3, mat(0x2a2a34), 6, g, -12 + k * 8, 14.5, 2); const sh_ = cyl(.6, 1.4, 1, mat(0x2ab86a, { roughness: .5 }), 18, g, -12 + k * 8, 12.6, 2); sphere(.5, glow(0xfff2d0, 2), g, -12 + k * 8, 12.1, 2, 12, 8); }
  for (const s of [-1, 1]) { const pt = G(g, s * 16, 0, 13); cyl(1, .8, 2, mat(0xd8823a), 14, pt, 0, 1, 0); for (let i = 0; i < 6; i++) sphere(1.1, mat(0x3a9a3a, { roughness: .8 }), pt, Math.cos(i) * .7, 2.8 + (i % 3) * .6, Math.sin(i) * .7, 10, 8); }
  const L1 = new THREE.PointLight(0xfff4e8, 140, 70, 1.2); L1.position.set(0, 13, 4); g.add(L1); const L2 = new THREE.PointLight(0xffe8d0, 60, 50, 1.4); L2.position.set(-10, 11, -10); g.add(L2);
  // carretilla para la pila de paquetes
  return { g: shade(g), cnt, SH }; }

// fachada exterior del Paketshop (para la calle del pueblo)
export function shopFront(parent) { const g = G(parent); box(14, 1.6, 1.2, mat(0x2ab86a, { roughness: .6 }), .1, g, 0, 10.6, .4);
  const s = textPlane(12.6, 1.4, 640, 72, (c, w, h) => { c.fillStyle = '#2ab86a'; c.fillRect(0, 0, w, h); txt(c, 'PAKETSHOP', w / 2, h / 2 + 3, 58, '#ffffff'); }, .3); s.position.set(0, 10.6, 1.02); g.add(s);
  box(5, 8, .3, mat(0x9ad8ff, { roughness: .05, metalness: .4, transparent: true, opacity: .7 }), .05, g, 0, 4, .3); box(5.4, .4, .5, mat(0x2a2a34), .05, g, 0, 8.1, .3);
  for (const s_ of [-1, 1]) { box(3.6, 5, .3, mat(0x9ad8ff, { roughness: .05, metalness: .4 }), .05, g, s_ * 4.6, 4.5, .3); for (let k = 0; k < 3; k++) pkg(g, 1.1, .7, .8, 'LUKAS').position.set(s_ * 4.6 - 1 + k * 1, 2.1 + (k % 2) * .7, .1); }
  const aw = box(14, .3, 3, mat(0xffffff, { map: canvasTex(64, 8, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#2ab86a' : '#ffffff'; c.fillRect(i * 8, 0, 8, h); } }) }), .05, g, 0, 9.4, 1.6); aw.rotation.x = .25; return shade(g); }

// ---------- Automat de la Mensa: solo dos botones (LUKAS azul, MIA rosa) ----------
export function automat(parent) { const g = G(parent); box(5, 9, 3, mat(0xd8323a, { roughness: .35, metalness: .2 }), .3, g, 0, 4.5, 0);
  box(3.2, 6, .2, mat(0x2a3a4a, { roughness: .05, metalness: .3, transparent: true, opacity: .55 }), .05, g, -.6, 5.2, 1.45);
  const ITEMS = [0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a, 0xff4a8a, 0xffffff]; for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) box(.55, .9, .5, mat(ITEMS[(r + i) % 6], { roughness: .5 }), .08, g, -1.8 + i * .8, 3 + r * 1.4, .9);
  box(1.3, 6, .3, mat(0x2a2a34), .05, g, 1.75, 5.2, 1.45);
  const top = textPlane(4.6, 1.4, 460, 140, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 20); c.fill(); txt(c, 'MENSA-AUTOMAT', w / 2, h / 2 + 3, 50, '#d8202f'); }, .4); top.position.set(0, 8.6, 1.52); g.add(top);
  const BT = ['LUKAS', 'MIA'].map((n, i) => { const b = G(g, 1.75, 6.6 - i * 1.7, 1.62); const base = cyl(.55, .55, .2, glow(i ? 0xff4a9a : 0x3a8aff, .5), 20, b, 0, 0, 0); base.rotation.x = Math.PI / 2;
    const l = textPlane(1.3, .45, 160, 56, (c, w, h) => { txt(c, n, w / 2, h / 2 + 2, 40, '#ffffff', '#16161e', 6); }); l.position.set(0, -.68, .02); b.add(l); return { b, base }; });
  box(3.4, 1, .4, mat(0x1a1a22), .08, g, -.6, 1.2, 1.4);
  g.userData.press = (k0, k1) => BT.forEach((t, i) => { const k = i ? k1 : k0; t.base.position.z = -.12 * k; t.base.material.emissiveIntensity = .5 + k * 2.4; });
  g.userData.press(0, 0); return shade(g); }

// ---------- Sprecherkabine: cabina acristalada sobre la grada, abierta hacia la cámara (+x) ----------
export function booth(parent) { const g = G(parent); const w = mat(0xf4f4f4, { roughness: .6 });
  box(.4, 7, 9, w, .05, g, -4.2, 3.5, 0); box(8.6, .5, 9.4, mat(0x3a3a46), .05, g, 0, 7.2, 0); box(8.6, .4, 9, mat(0x8a8e96), .05, g, 0, .2, 0); for (const s of [-1, 1]) box(8.6, 7, .4, w, .05, g, 0, 3.5, s * 4.5);
  for (const s of [-1, 1]) box(.3, 7, .3, mat(0x2a2a34), .05, g, 4.2, 3.5, s * 4.4); box(.3, .3, 9, mat(0x2a2a34), .05, g, 4.2, 6.9, 0); box(.3, 2.4, 9, w, .05, g, 4.2, 1.6, 0);
  const s = textPlane(8, 1.4, 560, 98, (c, w_, h) => { c.fillStyle = '#d8323a'; c.beginPath(); c.roundRect(3, 3, w_ - 6, h - 6, 20); c.fill(); txt(c, 'STADIONSPRECHER', w_ / 2, h / 2 + 3, 52, '#ffffff'); }, .4); s.position.set(4.4, 8.3, 0); s.rotation.y = Math.PI / 2; g.add(s);
  box(3, .3, 6, mat(0x5a3a22, { roughness: .6 }), .05, g, 2.6, 3.0, 0); box(1.6, .5, 1.2, mat(0x2a2a34), .05, g, 2.4, 3.4, -1.8); for (let k = 0; k < 6; k++) cyl(.12, .12, .2, glow([0xff4a4a, 0x4aff6a, 0xffd23f][k % 3], 1.5), 8, g, 2.0 + (k % 3) * .4, 3.75, -2.1 + Math.floor(k / 3) * .5);
  const stand = G(g, 3.2, 3.15, .6); cyl(.06, .06, 1.6, mat(0x2a2a34, { metalness: .7 }), 6, stand, 0, .8, 0); const mic = G(stand, 0, 1.7, 0); sphere(.28, mat(0x6a6e76, { metalness: .8, roughness: .3 }), mic, 0, 0, 0, 12, 10); cyl(.12, .12, .5, mat(0x1a1a22), 8, mic, 0, -.35, 0);
  const lamp = new THREE.PointLight(0xfff0d8, 30, 16, 1.4); lamp.position.set(1, 6, 0); g.add(lamp);
  return { g: shade(g), stand, mic }; }

// ---------- gato atigrado naranja de bloques (con placa) ----------
export function cat(parent) { const g = G(parent); const o = mat(0xf08a2a, { roughness: .7 }), w = mat(0xfff4e8, { roughness: .7 }), dk = mat(0xb85a14, { roughness: .7 });
  box(1.4, 1.1, 2.4, o, .4, g, 0, 1.1, 0); for (let k = 0; k < 3; k++) box(1.44, .14, .3, dk, .05, g, 0, 1.55, -.6 + k * .55); box(1.0, .7, .5, w, .2, g, 0, .95, 1.1);
  for (const [x, z] of [[-.45, .8], [.45, .8], [-.45, -.8], [.45, -.8]]) box(.38, .8, .38, o, .12, g, x, .4, z);
  const head = G(g, 0, 2.05, 1.1); box(1.3, 1.1, 1.1, o, .35, head, 0, 0, 0); box(.8, .45, .3, w, .15, head, 0, -.25, .5); for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(.28, .55, 4), o); e.position.set(s * .38, .7, 0); head.add(e);
    const eye = sphere(.16, mat(0x8ad84a, { roughness: .2 }), head, s * .3, .12, .56, 10, 8); sphere(.07, mat(0x101010), head, s * .3, .12, .68, 8, 6); }
  sphere(.09, mat(0xff8ab0), head, 0, -.12, .66, 8, 6);
  const tail = G(g, 0, 1.4, -1.2); const t = box(.25, .25, 1.8, o, .1, tail, 0, .5, -.6); t.rotation.x = -.9;
  const collar = cyl(.5, .5, .15, mat(0xd8323a), 14, head, 0, -.62, 0);
  const TAG = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .5), new THREE.MeshStandardMaterial({ map: lblTex('LUKAS'), roughness: .6 })); TAG.position.set(0, -.9, .62); TAG.userData.noOutline = true; head.add(TAG);
  g.userData.head = head; g.userData.tail = tail; g.userData.tag = n => { TAG.material.map = lblTex(n); }; return shade(g); }

// ---------- zapatilla, consola, cascos de regalo ----------
export function sneaker(parent, col = 0xffffff, acc = 0xd8323a) { const g = G(parent); box(1.1, .4, 2.6, mat(0xf4f4f4, { roughness: .5 }), .15, g, 0, .2, 0); box(1.0, .9, 2.0, mat(col, { roughness: .6 }), .3, g, 0, .75, -.25); box(1.02, .5, 1.0, mat(col), .2, g, 0, .55, .85);
  for (const s of [-1, 1]) { const sw = box(.05, .4, 1.2, mat(acc), .02, g, s * .52, .7, -.1); sw.rotation.x = .3; } for (let k = 0; k < 3; k++) box(.6, .06, .1, mat(0x16161e), .02, g, 0, 1.2 - k * .12, .3 + k * .22); return shade(g); }
export function konsole(parent) { const g = G(parent); box(3.2, .7, 2.2, mat(0xf4f4f4, { roughness: .3 }), .25, g, 0, .35, 0); box(3.0, .1, 2.0, mat(0x16161e, { roughness: .2 }), .04, g, 0, .72, 0); box(.5, .08, .08, glow(0x3ab8ff, 2), .02, g, 1.1, .4, 1.11);
  const pad = G(g, 0, .9, 1.6); box(1.4, .35, .7, mat(0x16161e, { roughness: .4 }), .17, pad, 0, 0, 0); for (const s of [-1, 1]) box(.45, .35, .55, mat(0x16161e), .17, pad, s * .6, -.05, .2); sphere(.12, mat(0xd8323a), pad, .45, .22, 0, 8, 6); sphere(.12, mat(0x3ab8ff), pad, -.45, .22, 0, 8, 6); return shade(g); }
export function kopfhoerer(parent, col = 0xff5aa8) { const g = G(parent); const m = mat(col, { roughness: .35 }); const band = new THREE.Mesh(new THREE.TorusGeometry(1.0, .16, 10, 26, Math.PI), m); band.position.y = .9; g.add(band);
  for (const s of [-1, 1]) { const cup = cyl(.48, .48, .42, m, 20, g, s * 1.0, .45, 0); cup.rotation.z = Math.PI / 2; const pad = cyl(.36, .36, .1, mat(0xffffff, { roughness: .8 }), 18, g, s * .76, .45, 0); pad.rotation.z = Math.PI / 2; sphere(.12, glow(0xffffff, 1), g, s * 1.24, .45, 0, 8, 6); } return shade(g); }
// caja de regalo rosa con lazo y tarjeta «Für Mia 6»
export function geschenk(parent) { const g = G(parent); box(2.2, 1.6, 2.2, mat(0xff7ab8, { roughness: .5 }), .1, g, 0, .8, 0); box(2.24, 1.62, .35, mat(0xffffff), .03, g, 0, .8, 0); box(.35, 1.62, 2.24, mat(0xffffff), .03, g, 0, .8, 0);
  for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.TorusGeometry(.38, .12, 8, 16), mat(0xffffff)); b.position.set(s * .36, 1.85, 0); b.rotation.y = Math.PI / 2; b.rotation.x = s * .4; g.add(b); }
  const t = textPlane(1.3, .8, 160, 100, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'Für Mia', w / 2, 34, 30, '#d8206a'); txt(c, '6 ♥', w / 2, 74, 32, '#d8206a'); }); t.position.set(.5, .8, 1.12); t.rotation.z = -.1; t.userData.noOutline = true; g.add(t); return shade(g); }
// carretilla de mano
export function karre(parent) { const g = G(parent); const m = mat(0xd8323a, { metalness: .4, roughness: .4 }); for (const s of [-1, 1]) { const r = box(.14, 6, .14, m, .03, g, s * 1.1, 3.2, -.4); r.rotation.x = -.18; } box(2.6, .14, 1.4, m, .03, g, 0, .3, .2); box(2.4, .14, .14, m, .03, g, 0, 2.4, -.15);
  for (const s of [-1, 1]) { const w = cyl(.55, .55, .3, mat(0x16161e), 16, g, s * 1.3, .55, -.6); w.rotation.z = Math.PI / 2; } return shade(g); }
// pancarta de cartón «FEHLER»
export function fehlerSign(parent) { const g = G(parent); const wood = mat(0xb8885a, { roughness: .8 }); for (const s of [-1, 1]) box(.25, 6.4, .25, wood, .05, g, s * 3.4, 3.2, 0);
  const p = textPlane(7.6, 3, 608, 240, (c, w, h) => { c.fillStyle = '#f4f0e8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8202f'; c.lineWidth = 8; c.strokeRect(8, 8, w - 16, h - 16); c.save(); c.translate(w / 2, h / 2); c.rotate(-.04); txt(c, 'FEHLER', 0, 6, 160, '#d8202f', '#6a0010', 6); c.restore(); });
  p.position.set(0, 5.2, .2); g.add(p); box(7.8, 3.1, .12, mat(0xd8d0c0), .03, g, 0, 5.2, .1); return shade(g); }
// cartel del colegio (para el patio)
export function schulSchild(parent) { const g = G(parent); for (const s of [-1, 1]) cyl(.2, .2, 9, mat(0x8a8e96, { metalness: .5 }), 8, g, s * 6, 4.5, 0);
  const p = textPlane(12.6, 3.6, 720, 206, (c, w, h) => { c.fillStyle = '#1a5aa8'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 24); c.fill(); txt(c, 'LUKAS-UND-MIA-', w / 2, 70, 64, '#ffffff'); txt(c, 'GRUNDSCHULE', w / 2, 146, 72, '#ffd23f'); }, .25); p.position.set(0, 8, .2); g.add(p); box(12.8, 3.8, .2, mat(0xf4f4f4), .05, g, 0, 8, 0); return shade(g); }
// móvil con notificación «Paket abgeholt ✓»
export function handy(parent) { const g = G(parent); box(1.0, 1.9, .14, mat(0xff7ab8, { roughness: .3 }), .12, g, 0, 0, 0);
  const s = textPlane(.88, 1.72, 176, 344, (c, w, h) => { c.fillStyle = '#16161e'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(10, 90, w - 20, 150, 18); c.fill(); c.fillStyle = '#2ab86a'; c.beginPath(); c.arc(40, 130, 18, 0, 7); c.fill(); txt(c, '✓', 40, 132, 26, '#fff'); txt(c, 'PAKET', 110, 120, 24, '#16161e'); txt(c, 'abgeholt', 110, 150, 22, '#16161e'); txt(c, 'von: LUKAS', w / 2, 200, 22, '#d8202f'); }, .8); s.position.z = .08; s.userData.noOutline = true; g.add(s); return shade(g); }
