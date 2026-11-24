// FRAUENSTADT — escenarios y atrezo propios: el Männergefängnis (fuera: muro, portón, torre, marcador de FREIHEITSPUNKTE,
// pared de medir con la raya de 1,98 m), la droguería con Binden y Tampons GRATIS, el restaurante de la primera cita,
// el gimnasio de Selbstverteidigung, la estatua gigante «Frauenrechte sind heilig», el cartel de la ley, bolsas de la compra,
// la cuenta, el letrero de la calle, la medalla, el cheque gigante, la cuna con el bebé preso.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree, lamp } from './props.js';
import { FONT } from './sets.js';
import { pine, mountains } from './nsets.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1.6) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const plane = (w, h, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const concreteT = (a = '#a8acb4') => noiseTex(a, ['#9aa0a8', '#b4b8c0', '#8e9298', '#a2a6ae'], 4200, 2, 1);
const tileT = (a, b, n = 8) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(7); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = `rgba(0,0,0,${r() * .05})`; c.fillRect(i * w / n, j * h / n, w / n, h / n); } c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * w / n, 0); c.lineTo(i * w / n, h); c.moveTo(0, i * h / n); c.lineTo(w, i * h / n); c.stroke(); } });
const plankT = (a = '#a8784a', b = '#8a5a32') => canvasTex(256, 256, (c, w, h) => { const r = RNG(4); for (let y = 0; y < h; y += 32) { c.fillStyle = r() > .5 ? a : b; c.fillRect(0, y, w, 32); c.globalAlpha = .18; for (let k = 0; k < 14; k++) { c.fillStyle = r() > .5 ? '#000' : '#fff'; c.fillRect(r() * w, y + r() * 30, 30 + r() * 80, 1.5); } c.globalAlpha = 1; c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, y, w, 2); c.fillRect((y * 37) % w, y, 2, 32); } });
const brickT = (a = '#b8564a') => canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#c8c0b4'; c.fillRect(0, 0, w, h); const r = RNG(9); for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { const l = 40 + r() * 14; c.fillStyle = `hsl(${8 + r() * 8},${36 + r() * 14}%,${l}%)`; c.fillRect(x + 1.5, y + 1.5, 29, 13); } });
function room(parent, X, w, d, h, wall, floor, ceil = 0xf4f0e8) { const g = G(parent, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil, { roughness: .9 }), 0, g, 0, h, 0); box(w, .8, .5, mat(0xffffff, { roughness: .6 }), .05, g, 0, .4, -d / 2 + .3); return g; }
const lettering = (w, h, pw, ph, fn, k = 0) => { const p = textPlane(w, h, pw, ph, fn, k); return p; };

// ---------- marcador LED: FREIHEITSPUNKTE ----------
export function scoreboard(parent) { const g = G(parent); const st = mat(0x3a3e48, { metalness: .6, roughness: .4 });
  for (const s of [-1, 1]) cyl(.4, .5, 14, st, 10, g, s * 9, 7, 0); box(20, 11, 1.2, mat(0x16181e, { roughness: .5 }), .2, g, 0, 18, 0); box(20.6, .6, 1.6, st, .1, g, 0, 23.7, 0);
  const cv = document.createElement('canvas'); cv.width = 800; cv.height = 440; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(19, 10.4), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.position.set(0, 18, .62); g.add(m); let key = null;
  g.userData.set = (n, col = '#ffd23f', sub = '+10 PRO GUTER TAT FÜR EINE FRAU', blink = 0) => { const k = n + col + sub + blink; if (k === key) return; key = k; const c = cv.getContext('2d');
    c.fillStyle = '#05060a'; c.fillRect(0, 0, 800, 440); c.fillStyle = 'rgba(255,255,255,.04)'; for (let y = 0; y < 440; y += 6) c.fillRect(0, y, 800, 2);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 62px ${FONT}`; c.shadowColor = '#3ab8ff'; c.shadowBlur = 18; c.fillStyle = '#7ad8ff'; c.fillText('FREIHEITSPUNKTE', 400, 66);
    if (!blink) { c.font = `700 150px ${FONT}`; c.shadowColor = col; c.shadowBlur = 30; c.fillStyle = col; c.fillText(n, 400, 220); }
    c.font = `700 36px ${FONT}`; c.shadowColor = '#5aff9a'; c.shadowBlur = 12; c.fillStyle = '#8affb0'; c.fillText(sub, 400, 370); t.needsUpdate = true; };
  g.userData.set('0 / 10.000'); return shade(g); }

// ---------- pared de medir: raya roja en 1,98 m (personaje de escala 1 ≈ 7,5 de alto → 1 m ≈ 3,95) ----------
export const M2U = 3.95;
export function heightWall(parent) { const g = G(parent); box(8, 11, .6, mat(0xf4f2ee, { roughness: .7 }), .1, g, 0, 5.5, 0);
  const p = textPlane(7.6, 10.6, 380, 530, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); const u = h / 10.6; c.strokeStyle = '#1a1a22'; c.fillStyle = '#1a1a22'; c.font = `700 22px ${FONT}`; c.textAlign = 'left';
    for (let cm = 100; cm <= 260; cm += 5) { const y = h - (cm / 100 * M2U) * u; if (y < 0) continue; c.lineWidth = cm % 50 ? 2 : 4; c.beginPath(); c.moveTo(0, y); c.lineTo(cm % 10 ? 40 : 80, y); c.stroke(); if (cm % 20 === 0) c.fillText((cm / 100).toFixed(2).replace('.', ','), 90, y + 8); }
    const y = h - 1.98 * M2U * u; c.fillStyle = '#e8202a'; c.fillRect(0, y - 6, w, 12); c.font = `700 44px ${FONT}`; c.textAlign = 'right'; c.fillText('MIN. 1,98 m', w - 14, y - 26); });
  p.position.set(0, 5.3, .32); g.add(p); return shade(g); }

// ---------- Männergefängnis (X): muro de hormigón con ventanas enrejadas, portón, valla con concertina, torre con foco,
// marcador LED a la izquierda, pared de medir a la derecha del portón, patio de asfalto, colinas y montañas ----------
export function knastM(scene, X) { const g = G(scene, X);
  plane(900, 900, mat(0xffffff, { roughness: 1, map: rep(noiseTex('#4e8a3a', ['#3f7a30', '#5a9846', '#467832', '#62a04c'], 5200, 2, 1), 70, 70) }), g, 0, -.05, 0);
  plane(90, 70, mat(0xffffff, { roughness: .92, map: rep(noiseTex('#5a5e66', ['#4e525a', '#666a72', '#545860'], 4000, 2, 1), 6, 5) }), g, 0, .02, 10);
  for (let k = 0; k < 12; k++) plane(.3, 6, mat(0xf4f0d8, { roughness: .8 }), g, -27 + k * 5, .04, 22);
  const cm = mat(0xffffff, { map: rep(concreteT('#9aa0a8'), 8, 3), roughness: .92 }); for (const sx of [-1, 1]) box(33.5, 24, 30, cm, .1, g, sx * 23.25, 12, -30); box(13, 13, 30, cm, .05, g, 0, 17.5, -30); box(13, 11, 26, cm, .05, g, 0, 5.5, -32); box(.3, 11, 4, cm, 0, g, -6.35, 5.5, -17); box(.3, 11, 4, cm, 0, g, 6.35, 5.5, -17); box(82, 1.4, 32, mat(0x6a6e76, { roughness: .7 }), .05, g, 0, 24.6, -30);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 11; k++) { const x = -32 + k * 6.4; if (Math.abs(x) < 7) continue; box(2.4, 3.2, .3, mat(0x1e222a), .05, g, x, 6 + r * 6.4, -14.8); for (let b = 0; b < 4; b++) cyl(.09, .09, 3.2, mat(0x8a8e96, { metalness: .85, roughness: .3 }), 6, g, x - .9 + b * .6, 6 + r * 6.4, -14.55); box(2.9, .3, .6, mat(0x8a8e96), .05, g, x, 4.2 + r * 6.4, -14.6); }
  for (let k = 0; k < 14; k++) box(.25, 24, .35, mat(0x8a8e96, { roughness: .9 }), 0, g, -39 + k * 6, 12, -14.85);
  const sg = textPlane(34, 4.4, 1360, 176, (c, w, h) => { c.fillStyle = '#12141c'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8202a'; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12); c.shadowColor = '#ff3a3a'; c.shadowBlur = 24; txt(c, 'MÄNNERGEFÄNGNIS', w / 2, h / 2 + 8, 128, '#ff4a4a'); }, 1.1); sg.position.set(0, 28.4, -14.6); g.add(sg);
  for (const s of [-1, 1]) box(.4, 4.8, .4, mat(0x3a3e48, { metalness: .6 }), .05, g, s * 16, 28.4, -14.7);
  const gate = G(g, 0, 0, -14.6); { const fm = mat(0x2e323c, { metalness: .6, roughness: .4 }); for (const y of [.3, 5.5, 10.7]) box(13, .6, .6, fm, .05, gate, 0, y, .3); for (const x of [-6.2, 6.2]) box(.6, 11, .6, fm, .05, gate, x, 5.5, .3); } for (let k = 0; k < 12; k++) cyl(.14, .14, 11, mat(0x6a6e78, { metalness: .85, roughness: .3 }), 8, gate, -5.5 + k, 5.5, .45);
  const hole = new THREE.Mesh(new THREE.PlaneGeometry(13, 11), mat(0x5a5e66, { roughness: 1 })); hole.position.set(0, 5.5, -18.95); g.add(hole); { const fl = new THREE.PointLight(0xfff0d8, 30, 14, 1.5); fl.position.set(0, 8, -15.6); g.add(fl); } box(13, .3, 3, mat(0x6a6e76), 0, g, 0, .05, -16); box(13, .5, .5, mat(0xd8a020, { metalness: .4 }), .05, gate, 0, 11.2, .4);
  const warn = textPlane(5, 1.8, 300, 108, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a1a'; for (let k = -2; k < 14; k++) { c.beginPath(); c.moveTo(k * 24, 0); c.lineTo(k * 24 + 12, 0); c.lineTo(k * 24 - 6, h); c.lineTo(k * 24 - 18, h); c.fill(); } c.fillStyle = '#ffd23f'; c.fillRect(20, 20, w - 40, h - 40); txt(c, 'NUR FÜR MÄNNER', w / 2, h / 2 + 3, 34, '#1a1a1a'); }); warn.position.set(-10.5, 8, -14.2); g.add(warn);
  for (let x = -60; x <= 60; x += 5) cyl(.18, .18, 10, mat(0x6a6e78, { metalness: .6, roughness: .4 }), 6, g, x, 5, 30); for (const y of [2, 4.5, 7, 9.4]) { const w = cyl(.05, .05, 120, mat(0x9aa0a8, { metalness: .8 }), 4, g, 0, y, 30); w.rotation.z = Math.PI / 2; }
  for (let k = 0; k < 60; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.7, .05, 4, 12), mat(0xb8bcc4, { metalness: .9, roughness: .2 })); r.position.set(-59 + k * 2, 10.4, 30); r.rotation.y = Math.PI / 2; g.add(r); }
  const tw = G(g, 36, 0, -8); for (const [x, z] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) cyl(.3, .3, 22, mat(0x5a5e68, { metalness: .5 }), 8, tw, x, 11, z); box(7, 4, 7, cm, .1, tw, 0, 24, 0); const roof = new THREE.Mesh(new THREE.ConeGeometry(6, 3, 4), mat(0x5a2a22, { roughness: .7 })); roof.position.set(0, 27.6, 0); roof.rotation.y = Math.PI / 4; tw.add(roof); box(5.4, 1.6, .2, mat(0x101420), .05, tw, 0, 24.6, 3.55);
  const SPOT = new THREE.SpotLight(0xfff4d8, 0, 140, .22, .6, 1); SPOT.position.set(36, 24, -4); SPOT.target.position.set(0, 0, 10); g.add(SPOT, SPOT.target);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(7, 50, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff4c8, transparent: true, opacity: .07, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false })); beam.geometry.translate(0, -25, 0); beam.position.set(36, 25, -4); beam.rotation.z = -.6; g.add(beam);
  const SB = scoreboard(g); SB.position.set(-24, 0, -12); SB.rotation.y = .25;
  const HW = heightWall(g); HW.position.set(11, 0, -14.1);
  for (const [x, z] of [[-48, 40], [48, 44], [-62, -50], [64, -52], [-70, 10], [72, 12]]) tree(g, x, z, 1.2);
  for (let k = 0; k < 14; k++) pine(g, -130 + k * 20, -90 - (k % 3) * 18, 1.6 + (k % 4) * .3);
  mountains(g, 0, -120, 620, 5);
  return { g: shade(g), SPOT, beam, gate, SB, HW }; }

// ---------- cuna (para el bebé preso) ----------
export function crib(parent) { const g = G(parent); const wm = mat(0xf4f0e8, { roughness: .6 }); box(5, .4, 3, wm, .1, g, 0, 2.4, 0); box(4.8, .5, 2.8, mat(0xffa860, { roughness: .95 }), .2, g, 0, 2.8, 0);
  for (const s of [-1, 1]) { box(.3, 4.6, .3, wm, .05, g, s * 2.4, 2.3, -1.4); box(.3, 4.6, .3, wm, .05, g, s * 2.4, 2.3, 1.4); box(5, .3, .3, wm, .05, g, 0, 4.4, s * 1.4); box(.3, .3, 3, wm, .05, g, s * 2.4, 4.4, 0); }
  for (let k = -2; k <= 2; k++) box(.14, 2, .14, wm, .02, g, k * .8, 3.4, -1.4); return shade(g); }

// ---------- palitos en la pared de la celda, con texto (p. ej. «12 JAHRE») ----------
export function tallyBoard(parent) { const cv = document.createElement('canvas'); cv.width = 300; cv.height = 180; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 4.5), new THREE.MeshStandardMaterial({ map: t, roughness: .9 })); parent.add(m); let key = null;
  m.userData.set = (txt_, n) => { const k = txt_ + n; if (k === key) return; key = k; const c = cv.getContext('2d'); c.fillStyle = '#c8ccd4'; c.fillRect(0, 0, 300, 180); c.strokeStyle = 'rgba(40,44,52,.85)'; c.lineWidth = 5; c.lineCap = 'round';
    for (let g_ = 0; g_ < n; g_++) { const x0 = 14 + (g_ % 7) * 40, y0 = 14 + Math.floor(g_ / 7) * 50; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x0 + i * 7, y0); c.lineTo(x0 + i * 7 + 1, y0 + 36); c.stroke(); } c.beginPath(); c.moveTo(x0 - 4, y0 + 30); c.lineTo(x0 + 26, y0 + 6); c.stroke(); }
    c.font = `700 44px ${FONT}`; c.textAlign = 'center'; c.fillStyle = 'rgba(40,44,52,.9)'; c.fillText(txt_, 150, 160); t.needsUpdate = true; }; return m; }

// ---------- droguería (X): suelo de baldosa, estanterías a los lados (z de -14 a 6), cajas BINDEN (rosa) y TAMPONS (lila), carteles GRATIS colgando, caja registradora ----------
export function drogerieM(scene, X) { const g = room(scene, X, 44, 40, 18, mat(0xffffff, { map: rep(tileT('#fff4f8', '#f2dce6', 6), 6, 3), roughness: .7 }), mat(0xffffff, { map: rep(tileT('#f4f0f2', '#d8d0d6', 4), 8, 7), roughness: .35 }));
  const BOX = (col, lab) => { const c = canvasTex(96, 128, (x, w, h) => { x.fillStyle = col; x.fillRect(0, 0, w, h); x.fillStyle = '#ffffff'; x.fillRect(0, h * .55, w, h * .2); x.font = `700 20px ${FONT}`; x.textAlign = 'center'; x.fillStyle = col; x.fillText(lab, w / 2, h * .69); x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.arc(w / 2, h * .28, 18, 0, 7); x.fill(); }); return mat(0xffffff, { map: c, roughness: .5 }); };
  const MB = BOX('#ff4a9a', 'BINDEN'), MT = BOX('#8a4ad8', 'TAMPONS'), MO = [BOX('#3ab8ff', 'PFLEGE'), BOX('#2ab86a', 'SEIFE'), BOX('#ffb81a', 'SHAMPOO')];
  for (const x of [-14, 14]) { const s = G(g, x, 0, -4); box(3, 10, 22, mat(0xf8f8f8, { roughness: .4 }), .1, s, 0, 5, 0); for (const y of [1.6, 3.8, 6, 8.2]) { box(3.6, .25, 22, mat(0xe0e0e4), .03, s, (x < 0 ? .3 : -.3), y - .7, 0); for (let k = 0; k < 14; k++) { const m = y < 5 ? (k % 2 ? MB : MT) : MO[(k + y | 0) % 3]; box(1.1, 1.4, 1.2, m, .06, s, (x < 0 ? 1.9 : -1.9), y, -9.6 + k * 1.48); } } }
  for (const [x, z] of [[-7, -6], [7, -6], [0, 2]]) { const sg = textPlane(5.6, 2.6, 336, 156, (c, w, h) => { c.fillStyle = '#1ab84a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 26); c.fill(); c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.stroke(); txt(c, 'GRATIS!', w / 2, h / 2 + 6, 92, '#ffffff'); }, .5); sg.position.set(x, 13, z); sg.material.side = THREE.DoubleSide; g.add(sg); cyl(.03, .03, 4.4, mat(0x2a2a2a), 4, g, x - 2, 16, z); cyl(.03, .03, 4.4, mat(0x2a2a2a), 4, g, x + 2, 16, z); }
  const hd = textPlane(16, 2.6, 800, 130, (c, w, h) => { c.fillStyle = '#ff4a8a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 30); c.fill(); txt(c, 'DROGERIE', w / 2, h / 2 + 4, 92, '#ffffff'); }, .5); hd.position.set(0, 14.6, -19.7); g.add(hd);
  const wall = textPlane(26, 7, 1040, 280, (c, w, h) => { c.fillStyle = '#ffe8f2'; c.fillRect(0, 0, w, h); txt(c, 'BINDEN & TAMPONS', w / 2, 90, 96, '#d81a6a'); txt(c, 'AB HEUTE: 0,00 €', w / 2, 200, 84, '#1a9a4a'); }); wall.position.set(0, 8, -19.7); g.add(wall);
  const CNT = G(g, 0, 0, 9); box(10, 3.6, 3.4, mat(0xffffff, { roughness: .3 }), .1, CNT, 0, 1.8, 0); box(10.3, .3, 3.7, mat(0xff4a8a), .05, CNT, 0, 3.75, 0); const reg = G(CNT, 2.5, 3.9, 0); box(2.2, 1, 1.8, mat(0x2a2a30), .1, reg, 0, .5, 0); const scr_ = box(1.6, 1.1, .1, glowM(0x5affa0, 1.0), .03, reg, 0, 1.5, -.5); scr_.rotation.x = -.3;
  for (const [x, z] of [[-8, 14], [8, 14]]) { const L = new THREE.PointLight(0xfff4f8, 120, 50, 1.3); L.position.set(x, 16, z); g.add(L); } const L = new THREE.PointLight(0xfff4f8, 200, 70, 1.2); L.position.set(0, 16, -6); g.add(L);
  for (let k = 0; k < 4; k++) box(14, .2, 1, glowM(0xffffff, 1.4), .05, g, 0, 17.7, -14 + k * 9);
  return { g: shade(g), CNT, MB, MT }; }

// ---------- restaurante (X): parqué, zócalo verde oscuro, papel pintado, ventanal con la plaza, mesa para dos con mantel blanco,
// velas, copas, lámparas colgantes, plantas y otras mesas al fondo. Mesa en (0, 0), sillas en z = ±3,2 ----------
export function restaurant(scene, X) { const g = room(scene, X, 46, 40, 18, mat(0xffffff, { map: rep(canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#e8d8b8'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(160,110,60,.25)'; for (let x = 0; x < w; x += 32) for (let y = 0; y < h; y += 32) { c.beginPath(); c.arc(x + 16, y + 16, 6, 0, 7); c.fill(); } }), 8, 3), roughness: .85 }), mat(0xffffff, { map: rep(plankT('#8a5a32', '#7a4a26'), 6, 6), roughness: .55 }), 0xf4ead8);
  box(46, 5, .5, mat(0x1e4a3a, { roughness: .6 }), .05, g, 0, 2.5, -19.6); for (const s of [-1, 1]) box(.5, 5, 40, mat(0x1e4a3a, { roughness: .6 }), .05, g, s * 22.6, 2.5, 0);
  const win = textPlane(16, 9, 400, 225, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#f2a86a'); s.addColorStop(.6, '#ffd8a8'); s.addColorStop(1, '#8aa86a'); c.fillStyle = s; c.fillRect(0, 0, w, h); const r = RNG(3); for (let k = 0; k < 8; k++) { c.fillStyle = ['#e8c8a8', '#d8a8a0', '#f4e0b8', '#c8d8e8'][k % 4]; const x = k * 52, hh = 60 + r() * 60; c.fillRect(x, h * .75 - hh, 48, hh); c.fillStyle = '#8a3a2a'; c.beginPath(); c.moveTo(x - 4, h * .75 - hh); c.lineTo(x + 24, h * .75 - hh - 26); c.lineTo(x + 52, h * .75 - hh); c.fill(); c.fillStyle = '#fff6c8'; for (let j = 0; j < 3; j++) c.fillRect(x + 8 + j * 14, h * .75 - hh + 14, 8, 12); } c.fillStyle = '#5a3a22'; c.fillRect(w / 2 - 4, 0, 8, h); c.fillRect(0, h / 2 - 4, w, 8); }, .2);
  win.position.set(0, 10, -19.6); g.add(win); box(16.8, .6, .8, mat(0x5a3a22), .05, g, 0, 5.3, -19.4); box(16.8, .6, .8, mat(0x5a3a22), .05, g, 0, 14.7, -19.4);
  const tblM = mat(0xffffff, { roughness: .8 }), wd = mat(0x5a3418, { roughness: .5 });
  const table = (p, x, z) => { const t = G(p, x, 0, z); cyl(3, 3, .25, tblM, 28, t, 0, 3.7, 0); cyl(3.05, 3.05, 1.2, tblM, 28, t, 0, 3.1, 0); cyl(.3, .3, 3.6, wd, 8, t, 0, 1.8, 0); cyl(1.4, 1.4, .2, wd, 14, t, 0, .1, 0); return t; };
  const chair = (p, x, z, ry) => { const c = G(p, x, 0, z); c.rotation.y = ry; box(2.4, .3, 2.4, wd, .05, c, 0, 2.4, 0); box(2.4, 3.2, .3, wd, .08, c, 0, 4, -1.1); box(2.5, .4, 2.5, mat(0x9a1a2a, { roughness: .9 }), .15, c, 0, 2.7, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.25, 2.4, .25, wd, .02, c, sx * 1, 1.2, sz * 1); return c; };
  const T0 = table(g, 0, 0); chair(g, 0, 3.4, Math.PI); chair(g, 0, -3.4, 0);
  for (const s of [-1, 1]) { const p = G(T0, s * 1.2, 3.85, s * .6); cyl(.9, .9, .08, mat(0xffffff, { roughness: .2 }), 20, p, 0, 0, 0); }
  const glass = () => new THREE.MeshStandardMaterial({ color: 0xd8f0ff, transparent: true, opacity: .35, roughness: .05, metalness: .1 });
  const W1 = G(T0, -1.6, 3.85, -1.2); cyl(.32, .26, 1.1, glass(), 14, W1, 0, .55, 0); cyl(.28, .24, .7, new THREE.MeshStandardMaterial({ color: 0x9ad8ff, transparent: true, opacity: .45, roughness: .05 }), 14, W1, 0, .4, 0);
  const W2 = G(T0, 1.4, 3.85, 1.4); cyl(.04, .04, .7, glass(), 6, W2, 0, .35, 0); const bw = cyl(.4, .1, .7, new THREE.MeshStandardMaterial({ color: 0x8a1a2a, transparent: true, opacity: .8, roughness: .1 }), 14, W2, 0, .95, 0);
  const CANDLE = G(T0, 0, 3.85, 0); cyl(.18, .18, .9, mat(0xfff4e0, { roughness: .6 }), 10, CANDLE, 0, .45, 0); const fl = sphere(.14, glowM(0xffb84a, 3), CANDLE, 0, 1.05, 0, 8, 6); fl.scale.y = 1.8; const CL = new THREE.PointLight(0xffb060, 14, 14, 1.6); CL.position.set(0, 1.4, 0); CANDLE.add(CL);
  for (const [x, z] of [[-14, -8], [14, -8], [-15, 10], [15, 9]]) { table(g, x, z); chair(g, x, z + 3.4, Math.PI); chair(g, x, z - 3.4, 0); }
  for (const [x, z] of [[-20, -16], [20, -16]]) { const p = G(g, x, 0, z); cyl(1.2, .9, 2.4, mat(0x9a5a3a, { roughness: .8 }), 12, p, 0, 1.2, 0); for (let k = 0; k < 9; k++) { const l = sphere(1.1, mat(0x3a8a3a, { roughness: .8 }), p, Math.cos(k) * 1, 3.2 + (k % 3) * 1.1, Math.sin(k * 1.7) * 1, 10, 8); l.scale.y = 1.4; } }
  const LMP = []; for (const [x, z] of [[0, 0], [-14, -8], [14, -8]]) { cyl(.03, .03, 6, mat(0x1a1a1a), 4, g, x, 15, z); const sh_ = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.2, 18, 1, true), mat(0x1e4a3a, { roughness: .5, side: THREE.DoubleSide })); sh_.position.set(x, 11.8, z); g.add(sh_); sphere(.35, glowM(0xffe0a8, 2.5), g, x, 11.4, z, 10, 8); const l = new THREE.PointLight(0xffd8a0, 60, 26, 1.5); l.position.set(x, 11, z); g.add(l); LMP.push(l); }
  const menu = textPlane(6, 8, 240, 320, (c, w, h) => { c.fillStyle = '#1e2a24'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8b060'; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'HEUTE', w / 2, 50, 40, '#ffd23f'); const it = [['Schnitzel', '18 €'], ['Spätzle', '12 €'], ['Wasser', '0 €'], ['Wein', '9 €']]; it.forEach(([a, b], i) => { c.font = `700 26px ${FONT}`; c.textAlign = 'left'; c.fillStyle = '#fff'; c.fillText(a, 24, 120 + i * 50); c.textAlign = 'right'; c.fillStyle = '#ffd23f'; c.fillText(b, w - 24, 120 + i * 50); }); }); menu.position.set(-15, 10, -19.6); g.add(menu);
  return { g: shade(g), T0, CANDLE, W1, W2, LMP }; }

// ---------- gimnasio (X): parqué con líneas, colchonetas azules, espalderas, pancarta ----------
export function turnhalle(scene, X) { const g = room(scene, X, 50, 44, 22, mat(0xffffff, { map: rep(brickT('#c8a890'), 8, 4), roughness: .9 }), mat(0xffffff, { map: rep(plankT('#d8a868', '#c89858'), 8, 8), roughness: .45 }));
  for (const [w, x, z] of [[40, 0, -14], [40, 0, 14]]) plane(w, .3, mat(0xd8202a), g, x, .02, z); plane(.3, 28, mat(0xd8202a), g, 0, .02, 0);
  const MAT = []; for (let k = 0; k < 6; k++) { const m = box(7, .7, 4.6, mat(0x2a5ad8, { roughness: .8 }), .3, g, -9 + (k % 3) * 9, .35, -4 + Math.floor(k / 3) * 7); MAT.push(m); }
  for (let k = 0; k < 6; k++) { const wb = G(g, -18 + k * 4, 0, -21.4); for (const s of [-1, 1]) box(.4, 16, .4, mat(0xc8904a), .05, wb, s * 1.6, 8, 0); for (let r = 0; r < 12; r++) cyl(.14, .14, 3.2, mat(0xd8a060), 6, wb, 0, 1 + r * 1.3, 0).rotation.z = Math.PI / 2; }
  const ban = textPlane(30, 4, 1200, 160, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8202a'; c.lineWidth = 10; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'SELBSTVERTEIDIGUNG · PFLICHTFACH', w / 2, h / 2 + 6, 86, '#d8202a'); }); ban.position.set(0, 18.5, -21.7); g.add(ban);
  for (let k = 0; k < 3; k++) box(16, .3, 1.2, glowM(0xffffff, 1.3), .05, g, -16 + k * 16, 21.6, 0);
  const L = new THREE.PointLight(0xfff4e0, 320, 80, 1.4); L.position.set(0, 20, 4); g.add(L);
  return { g: shade(g), MAT }; }

// ---------- estatua gigante de una mujer (piedra) sobre pedestal con «FRAUENRECHTE SIND HEILIG» ----------
export function pedestal(parent) { const g = G(parent); const st = mat(0xffffff, { map: rep(noiseTex('#d8d4cc', ['#c8c4bc', '#e4e0d8', '#bcb8b0'], 2400, 2, 1), 2, 2), roughness: .9 });
  box(16, 9, 16, st, .3, g, 0, 4.5, 0); box(18, 1.2, 18, st, .2, g, 0, .6, 0); box(17, 1, 17, st, .2, g, 0, 9.4, 0);
  const pl = textPlane(13, 3.4, 780, 204, (c, w, h) => { c.fillStyle = '#2a2a2e'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d9a531'; c.lineWidth = 8; c.strokeRect(8, 8, w - 16, h - 16); txt(c, 'FRAUENRECHTE', w / 2, 74, 76, '#ffd86a'); txt(c, 'SIND HEILIG', w / 2, 148, 66, '#ffd86a'); }); pl.position.set(0, 5, 8.05); g.add(pl);
  for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; sphere(.7, mat([0xff6a8a, 0xffd23f, 0xffffff, 0xb86aff][k % 4], { roughness: .8 }), g, Math.cos(a) * 9.6, 1.6, Math.sin(a) * 9.6, 8, 6); }
  return shade(g); }
export function stoneify(ch) { const st = mat(0xffffff, { map: rep(noiseTex('#e2ded6', ['#d4d0c8', '#ece8e0', '#c8c4bc'], 2400, 2, 1), 1, 1), roughness: .85 });
  ch.root.traverse(o => { if (o.isMesh && !o.userData.isOutline) { if (o.material && o.material.map && o.material.transparent) { o.visible = false; return; } o.material = st; } }); return ch; }
export function torch(parent) { const g = G(parent); cyl(.35, .25, 2.6, mat(0xd9a531, { metalness: .8, roughness: .3 }), 10, g, 0, 0, 0); cyl(.7, .35, .7, mat(0xd9a531, { metalness: .8, roughness: .3 }), 12, g, 0, 1.5, 0); const f = new THREE.Mesh(new THREE.ConeGeometry(.6, 1.8, 10), glowM(0xffb83a, 3)); f.position.y = 2.6; g.add(f); return g; }

// ---------- cartel de la ley ----------
export function lawSign(parent) { const g = G(parent); for (const s of [-1, 1]) cyl(.3, .3, 12, mat(0x3a3e48, { metalness: .6 }), 8, g, s * 8, 6, 0);
  const p = textPlane(18, 9, 900, 450, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8202a'; c.fillRect(0, 0, w, 90); txt(c, '§ 1  STADTGESETZ', w / 2, 48, 60, '#ffffff'); txt(c, 'KEIN UTERUS,', w / 2, 210, 104, '#14161e'); txt(c, 'KEIN URTEIL.', w / 2, 340, 104, '#d8202a'); c.strokeStyle = '#14161e'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); }, .3);
  p.position.set(0, 13, .3); g.add(p); box(18.6, 9.6, .4, mat(0x2a2e38), .1, g, 0, 13, 0); return shade(g); }

// ---------- bolsas de papel de la compra ----------
export function bag(parent, col = 0x2a6ad8) { const g = G(parent); box(1.6, 2, 1, mat(0xc8a070, { roughness: .95 }), .08, g, 0, 1, 0); box(1.62, .5, 1.02, mat(col, { roughness: .8 }), .05, g, 0, 1.2, 0);
  const h = new THREE.Mesh(new THREE.TorusGeometry(.4, .06, 6, 12, Math.PI), mat(0x8a6a4a)); h.position.y = 2; g.add(h); sphere(.35, mat(0x3a9a3a), g, -.3, 2.1, 0, 8, 6); cyl(.12, .12, 1, mat(0xf4e0a0), 6, g, .3, 2.2, 0).rotation.z = .3; return shade(g); }

// ---------- la cuenta (carpeta negra con el papel) ----------
export function bill(parent) { const g = G(parent); box(1.8, .1, 2.6, mat(0x1a1a1e, { roughness: .4 }), .03, g, 0, 0, 0); const p = textPlane(1.5, 2.2, 150, 220, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'RECHNUNG', w / 2, 28, 22, '#1a1a1a'); c.fillStyle = '#6a6a72'; for (let k = 0; k < 5; k++) c.fillRect(14, 54 + k * 22, 70 + (k % 3) * 20, 5); txt(c, '84,50 €', w / 2, 196, 30, '#d8202a'); }); p.rotation.x = -Math.PI / 2; p.position.y = .07; g.add(p); return shade(g); }

// ---------- letrero de calle (azul, alemán) ----------
export function streetSign(parent, name) { const g = G(parent); cyl(.2, .2, 14, mat(0x9aa0a8, { metalness: .7, roughness: .3 }), 8, g, 0, 7, 0);
  const SIGN = G(g, 0, 13.2, 0); box(9, 1.9, .2, mat(0x1a3a8a, { roughness: .4 }), .05, SIGN, 0, 0, 0); for (const z of [.11, -.11]) { const p = textPlane(8.8, 1.7, 704, 136, (c, w, h) => { c.fillStyle = '#1a3a8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.strokeRect(8, 8, w - 16, h - 16); txt(c, name, w / 2, h / 2 + 5, 66, '#ffffff'); }); p.position.z = z; if (z < 0) p.rotation.y = Math.PI; SIGN.add(p); }
  const SCR = []; for (const s of [-1, 1]) SCR.push(cyl(.12, .12, .3, mat(0xd8dce4, { metalness: .9 }), 8, SIGN, s * 4.1, 0, .2)); SCR.forEach(s => s.rotation.x = Math.PI / 2);
  return { g: shade(g), SIGN, SCR }; }

// ---------- medalla de oro con cinta ----------
export function medal(parent) { const g = G(parent); const rb = mat(0xd8202a, { roughness: .8 }); for (const s of [-1, 1]) { const r = box(.5, 2, .05, rb, .02, g, s * .32, 1, 0); r.rotation.z = s * .35; } const d = cyl(.6, .6, .15, mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .25 }), 24, g, 0, -.2, 0); d.rotation.x = Math.PI / 2; return g; }

// ---------- cheque gigante ----------
export function bigCheck(parent) { const g = G(parent); box(10, 4.6, .2, mat(0xffffff, { roughness: .6 }), .05, g, 0, 0, 0); const p = textPlane(9.8, 4.4, 980, 440, (c, w, h) => { c.fillStyle = '#f4fff4'; c.fillRect(0, 0, w, h); c.fillStyle = '#1ab84a'; c.fillRect(0, 0, w, 70); txt(c, 'SPENDE', w / 2, 40, 48, '#ffffff'); txt(c, 'An: FRAUENHAUS', 230, 140, 44, '#1a1a1a'); txt(c, '50.000 €', w / 2, 270, 150, '#1a9a4a'); c.fillStyle = '#1a1a1a'; c.fillRect(560, 390, 360, 4); c.font = `italic 44px serif`; c.fillStyle = '#1a3a9a'; c.fillText('B. Hartmann', 600, 380); }); p.position.z = .12; g.add(p); return shade(g); }

// ---------- pizarra de curso (texto dinámico) ----------
export function courseText(c, w, h, title, sub) { c.fillStyle = '#1e3a2e'; c.fillRect(0, 0, w, h); c.globalAlpha = .08; c.fillStyle = '#fff'; for (let k = 0; k < 40; k++) c.fillRect((k * 97) % w, (k * 53) % h, 60, 3); c.globalAlpha = 1;
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 30px ${FONT}`; c.fillStyle = '#ffd86a'; c.fillText(sub || 'PFLICHTKURS', w / 2, 46); c.font = `700 ${title.length > 18 ? 60 : 74}px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(title, w / 2, h / 2 + 18); }
