// EINPACKEN — escenarios y atrezo propios.
// Stube (mi cuarto-taller): mesa de trabajo llena de panecillos, papel y torres de paquetes; gran ventana a la calle de fiesta (fuera: casas, guirnaldas, gente).
// Brötchenburg: fachada (letrero con castillo-hamburguesa, «WIR STELLEN EIN!»), sala con mostrador, carta de precios, plancha y mesas.
// Atrezo: hamburguesa, envoltorio que se dobla por fases (wrap), paquete, torres de paquetes, despertador, cronómetro, plato, perro salchicha (Dackel),
// portapapeles, corbata, carta, patata-corazón, espátula, gorro de papel.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp, easeOut, easeInOut } from './engine.js';
import { noiseTex, tree, lamp } from './props.js';
import { FONT } from './sets.js';
import { bunting } from './wsets.js';
import { townhouse } from './gort.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const txt = (c, s, x, y, size, fill, stroke, lw = 8) => { c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = fill; c.fillText(s, x, y); };
const plane = (w, h, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };

// ---------- logo de la Brötchenburg (castillo con tejado de panecillo) ----------
export function drawLogo(c, x, y, r) { c.save(); c.translate(x, y); c.fillStyle = '#1e7a5a'; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.lineWidth = r * .1; c.strokeStyle = '#ffffff'; c.stroke();
  c.fillStyle = '#f6e6c0'; c.fillRect(-r * .5, -r * .1, r, r * .55); for (let i = -2; i <= 2; i++) if (i % 2 === 0) c.fillRect(i * r * .22 - r * .1, -r * .3, r * .2, r * .22);
  c.fillStyle = '#5a3a20'; c.beginPath(); c.arc(0, r * .45, r * .16, Math.PI, 0); c.fill();
  c.fillStyle = '#e8963a'; c.beginPath(); c.ellipse(0, -r * .42, r * .62, r * .3, 0, Math.PI, 0); c.fill(); c.fillStyle = '#fff4d0'; for (let k = 0; k < 6; k++) c.fillRect(-r * .4 + k * r * .16, -r * .58 + (k % 2) * r * .08, r * .05, r * .03); c.restore(); }

// ---------- hamburguesa ----------
export function burger(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const bun = mat(0xe0943a, { roughness: .55 });
  const b0 = cyl(1.0, .95, .38, bun, 22, g, 0, .19, 0); const pat = cyl(1.06, 1.06, .32, mat(0x5a2e16, { roughness: .9 }), 22, g, 0, .54, 0);
  const ch = box(2.0, .07, 2.0, mat(0xffc632, { roughness: .4 }), .02, g, 0, .74, 0); ch.rotation.y = .5; const sal = cyl(1.12, 1.12, .08, mat(0x5ac83a, { roughness: .6 }), 14, g, 0, .82, 0);
  for (let k = 0; k < 3; k++) { const t = cyl(.36, .36, .07, mat(0xe8322a, { roughness: .5 }), 12, g, Math.cos(k * 2.1) * .5, .89, Math.sin(k * 2.1) * .5); }
  const top = sphere(1.04, bun, g, 0, .9, 0, 22, 12); top.scale.y = .62; const sm = mat(0xfff6dc); for (let k = 0; k < 11; k++) { const a = k * 2.4, rr = .25 + (k % 3) * .2; const sd = sphere(.07, sm, g, Math.cos(a) * rr, 1.5 - rr * .35, Math.sin(a) * rr, 5, 4); sd.scale.set(1, .6, 1.6); }
  return shade(g); }

// papel del envoltorio: crema con rayas rojas y el logo
const paperT = () => canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#fbf3e2'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8402a'; for (let k = -4; k < 8; k++) { c.save(); c.translate(k * 44, 0); c.rotate(.5); c.fillRect(0, -40, 10, h * 2); c.restore(); } c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(0, 0, w, h); drawLogo(c, w / 2, h / 2, 46); });
let PT = null; const paperM = () => { PT = PT || paperT(); return mat(0xffffff, { map: PT, roughness: .75, side: THREE.DoubleSide }); };
// paquete terminado: caja de papel con banda roja y pegatina verde
export function parcel(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const pm = paperM(); box(2.3, 1.35, 2.3, pm, .22, g, 0, .68, 0);
  box(2.34, 1.38, .5, mat(0xe8402a, { roughness: .6 }), .12, g, 0, .68, 0); const st = cyl(.42, .42, .06, mat(0x1e7a5a), 18, g, 0, 1.37, 0); cyl(.3, .3, .07, mat(0xffffff), 18, g, 0, 1.38, 0);
  for (const s_ of [-1, 1]) { const f = box(.9, .06, .5, pm, .02, g, s_ * .7, 1.37, .6); f.rotation.y = s_ * .3; } return shade(g); }
// envoltorio por fases (p 0..1): papel plano con hamburguesa → solapas laterales → delantera/trasera → enrollar → paquete
export function wrapper(parent) { const g = G(parent); const pm = paperM(); const S = 2.6;
  const base = box(S, .04, S, pm, 0, g, 0, .02, 0); const B = burger(g, .82); B.position.y = .05;
  // solapas: tumbadas hacia fuera; giran sobre su borde (rotation.z) hasta taparla
  const hinge = (x, z, ry, y) => { const h = G(g, x, y, z); h.rotation.y = ry; box(S * .55, .04, S, pm, 0, h, S * .275, 0, 0); return h; };
  const F = [hinge(S / 2, 0, 0, .05), hinge(-S / 2, 0, Math.PI, .07), hinge(0, S / 2, -Math.PI / 2, .09), hinge(0, -S / 2, Math.PI / 2, .11)];
  const P = parcel(g, .78); P.visible = false;
  g.userData.set = p => { p = clamp(p); const a = k => easeOut(clamp(k)) * 2.45;
    F[0].rotation.z = a((p - .02) / .2); F[1].rotation.z = a((p - .22) / .2); F[2].rotation.z = a((p - .44) / .18); F[3].rotation.z = a((p - .64) / .18);
    const done = p >= .86; P.visible = done; base.visible = B.visible = !done; F.forEach(f => f.visible = !done); if (done) { const k = clamp((p - .86) / .14); P.scale.setScalar(.78 * (1 + Math.sin(k * Math.PI) * .2)); } };
  g.userData.set(0); return shade(g); }
// torre de paquetes (n visibles, hasta max); jitter ligero
export function tower(parent, max = 30, s = 1, seed = 1) { const g = G(parent); g.scale.setScalar(s); const r = RNG(seed); const L = [];
  for (let i = 0; i < max; i++) { const p = parcel(g, 1); p.position.set((r() - .5) * .25, i * 1.32, (r() - .5) * .25); p.rotation.y = (r() - .5) * .35; L.push(p); }
  g.userData.set = n => L.forEach((p, i) => p.visible = i < n); return g; }
// pila de panecillos
export function bunPile(parent, n = 9, s = 1) { const g = G(parent); g.scale.setScalar(s); const bun = mat(0xe0943a, { roughness: .55 }); let i = 0;
  for (let l = 0; l < 4 && i < n; l++) for (let k = 0; k < 4 - l && i < n; k++, i++) { const b = sphere(.9, bun, g, (k - (3 - l) / 2) * 1.75, .45 + l * .85, l * .2, 16, 10); b.scale.y = .6; } return shade(g); }
// montón de hojas de papel
export function paperStack(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const pm = paperM(); for (let k = 0; k < 12; k++) { const p = box(3.2, .06, 3.2, pm, 0, g, 0, .03 + k * .07, 0); p.rotation.y = (k * 37 % 10) * .02; } return shade(g); }
// despertador de dos campanas con hora (draw('4:30'))
export function alarm(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const red = mat(0xe8322a, { roughness: .3, metalness: .2 });
  const body = cyl(1.3, 1.3, .8, red, 28, g, 0, 1.6, 0); body.rotation.x = Math.PI / 2; for (const sx of [-1, 1]) { const b = sphere(.55, mat(0xd8dce4, { metalness: .8, roughness: .25 }), g, sx * .9, 2.85, 0, 14, 8); b.scale.y = .7; const l = box(.18, .9, .18, red, .05, g, sx * .8, .45, 0); l.rotation.z = sx * .4; }
  const face = textPlane(2.1, 2.1, 160, 160, () => {}); face.position.set(0, 1.6, .42); g.add(face);
  g.userData.draw = (t, col = '#1a1a2a') => { const cv = face.material.map.image, c = cv.getContext('2d'), w = cv.width; c.clearRect(0, 0, w, w); c.fillStyle = '#fffaf0'; c.beginPath(); c.arc(w / 2, w / 2, w / 2 - 2, 0, 7); c.fill();
    c.strokeStyle = '#1a1a2a'; c.lineWidth = 4; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; c.beginPath(); c.moveTo(w / 2 + Math.cos(a) * 64, w / 2 + Math.sin(a) * 64); c.lineTo(w / 2 + Math.cos(a) * 72, w / 2 + Math.sin(a) * 72); c.stroke(); }
    const [hh, mm] = t.split(':').map(Number); const ah = ((hh % 12) + mm / 60) / 12 * 6.283 - 1.57, am = mm / 60 * 6.283 - 1.57; c.lineCap = 'round'; c.lineWidth = 9; c.beginPath(); c.moveTo(w / 2, w / 2); c.lineTo(w / 2 + Math.cos(ah) * 36, w / 2 + Math.sin(ah) * 36); c.stroke(); c.lineWidth = 6; c.beginPath(); c.moveTo(w / 2, w / 2); c.lineTo(w / 2 + Math.cos(am) * 56, w / 2 + Math.sin(am) * 56); c.stroke();
    txt(c, t, w / 2, w * .72, 30, col); face.material.map.needsUpdate = true; };
  g.userData.draw('4:30'); return shade(g); }
// cronómetro digital (draw('5,0'))
export function stopwatch(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const body = cyl(1.5, 1.5, .5, mat(0xf4f4f4, { roughness: .3 }), 30, g, 0, 1.6, 0); body.rotation.x = Math.PI / 2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, .14, 8, 30), mat(0x2ab86a, { roughness: .3 })); ring.position.y = 1.6; g.add(ring); cyl(.25, .25, .5, mat(0x2ab86a), 10, g, 0, 3.35, 0); box(.7, .3, .4, mat(0x2ab86a), .1, g, 0, 3.6, 0); const b2 = box(.3, .5, .3, mat(0x2ab86a), .08, g, 1.1, 2.9, 0); b2.rotation.z = -.7;
  const face = textPlane(2.4, 2.4, 160, 160, () => {}); face.position.set(0, 1.6, .27); g.add(face);
  g.userData.draw = (t, col = '#1a1a2a', k = 0) => { const cv = face.material.map.image, c = cv.getContext('2d'), w = cv.width; c.clearRect(0, 0, w, w); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, w / 2, w / 2 - 2, 0, 7); c.fill();
    c.strokeStyle = col; c.lineWidth = 10; c.beginPath(); c.arc(w / 2, w / 2, w / 2 - 12, -1.57, -1.57 + clamp(k) * 6.283); c.stroke(); txt(c, t, w / 2, w / 2 + 4, t.length > 4 ? 40 : 52, col); face.material.map.needsUpdate = true; };
  g.userData.draw('5,0'); return shade(g); }
export function plate(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); cyl(1.7, 1.2, .18, mat(0xffffff, { roughness: .2 }), 30, g, 0, .09, 0); cyl(1.15, 1.15, .02, mat(0xf0f0f0, { roughness: .2 }), 30, g, 0, .19, 0); const r = new THREE.Mesh(new THREE.TorusGeometry(1.45, .04, 6, 30), mat(0x2a8ad8)); r.rotation.x = Math.PI / 2; r.position.y = .19; g.add(r); return shade(g); }
export function wrappedPlate(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const pm = paperM(); const d = cyl(1.75, 1.75, .45, pm, 24, g, 0, .22, 0); box(3.6, .5, .5, mat(0xe8402a), .1, g, 0, .24, 0); const st = cyl(.4, .4, .05, mat(0x1e7a5a), 16, g, 0, .48, 0); return shade(g); }
// perro salchicha (Dackel): cuerpo largo, patas cortas, orejas largas; wrapped = envuelto en papel con la cabeza fuera
export function dackel(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const fur = mat(0x9a4e1e, { roughness: .85 }), dk = mat(0x5a2a10, { roughness: .9 });
  box(1.2, 1.1, 3.6, fur, .45, g, 0, 1.3, 0); for (const [x, z] of [[-.4, 1.3], [.4, 1.3], [-.4, -1.3], [.4, -1.3]]) box(.38, .8, .4, fur, .12, g, x, .4, z);
  const head = G(g, 0, 2.0, 2.0); box(1.0, .95, 1.0, fur, .35, head, 0, 0, 0); box(.6, .5, .9, fur, .2, head, 0, -.18, .7); sphere(.16, mat(0x111111, { roughness: .2 }), head, 0, -.08, 1.15, 10, 8);
  for (const sx of [-1, 1]) { const e = box(.2, 1.0, .55, dk, .1, head, sx * .58, -.35, -.05); e.rotation.z = sx * .15; sphere(.12, mat(0x111111, { roughness: .1 }), head, sx * .25, .15, .5, 8, 6); sphere(.04, mat(0xffffff), head, sx * .23, .2, .6, 6, 4); }
  const tail = box(.18, .18, 1.0, fur, .08, g, 0, 1.7, -2.1); tail.rotation.x = .7;
  const wrap = G(g); const pm = paperM(); box(1.7, 1.55, 3.3, pm, .45, wrap, 0, 1.3, -.1); box(1.74, 1.58, .5, mat(0xe8402a), .12, wrap, 0, 1.3, -.1); const st = cyl(.36, .36, .06, mat(0x1e7a5a), 16, wrap, 0, 2.1, -.1); wrap.visible = false;
  g.userData = { head, tail, wrap, set(w, T = 0) { wrap.visible = w; tail.rotation.y = Math.sin(T * 14) * .5; head.rotation.x = Math.sin(T * 3) * .06; } }; return shade(g); }
// portapapeles (con versión envuelta)
export function clipboard(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); box(1.6, 2.2, .1, mat(0xb8864a, { roughness: .6 }), .05, g, 0, 0, 0); const p = textPlane(1.4, 1.8, 112, 144, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'BEWERBER', w / 2, 18, 15, '#1e7a5a'); c.fillStyle = '#9aa0aa'; for (let k = 0; k < 7; k++) c.fillRect(14, 40 + k * 14, w - 28 - (k % 3) * 14, 4); }); p.position.z = .06; g.add(p); box(.7, .25, .14, mat(0xd8dce4, { metalness: .8 }), .04, g, 0, 1.05, .05);
  const w = G(g); box(1.75, 2.35, .3, paperM(), .08, w, 0, 0, 0); box(1.8, .45, .34, mat(0xe8402a), .06, w, 0, 0, 0); w.visible = false; g.userData.wrap = w; return shade(g); }
// carta del rechazo
export function letter(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const p = textPlane(3.2, 4.2, 320, 420, (c, w, h) => { c.fillStyle = '#fffdf6'; c.fillRect(0, 0, w, h); drawLogo(c, w / 2, 70, 48); txt(c, 'Brötchenburg', w / 2, 140, 28, '#1e7a5a');
    txt(c, 'Danke, dass Sie', w / 2, 210, 30, '#1a1a2a'); txt(c, 'meine Krawatte', w / 2, 255, 30, '#1a1a2a'); txt(c, 'eingewickelt haben.', w / 2, 300, 30, '#1a1a2a'); c.strokeStyle = '#2a4ad8'; c.lineWidth = 4; c.beginPath(); c.moveTo(90, 370); c.bezierCurveTo(130, 330, 150, 400, 190, 360); c.lineTo(240, 370); c.stroke(); txt(c, '☹', w - 50, 370, 34, '#d8323a'); });
  p.material.side = THREE.DoubleSide; g.add(p); return g; }
// patata con forma de corazón
export function potatoHeart(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const sh = new THREE.Shape(); sh.moveTo(0, -1.1); sh.bezierCurveTo(-1.6, -.1, -1.2, 1.2, 0, .55); sh.bezierCurveTo(1.2, 1.2, 1.6, -.1, 0, -1.1);
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .6, bevelEnabled: true, bevelSize: .25, bevelThickness: .25, bevelSegments: 4 }), mat(0xc8964a, { roughness: .95 })); m.position.z = -.3; g.add(m); const r = RNG(3); for (let k = 0; k < 6; k++) sphere(.06, mat(0x7a5a2a), g, (r() - .5) * 1.4, (r() - .4) * 1.2, .58, 6, 4); return shade(g); }
// corbata (para el jefe; con funda de papel)
export function tie(parent, col = 0xd8323a) { const g = G(parent); const m = mat(col, { roughness: .5 }); box(.3, .22, .1, m, .04, g, 0, 0, 0); const b = box(.34, 1.05, .08, m, .04, g, 0, -.62, 0); const t = new THREE.Mesh(new THREE.ConeGeometry(.24, .3, 4), m); t.rotation.set(Math.PI, Math.PI / 4, 0); t.scale.z = .3; t.position.y = -1.25; g.add(t);
  for (let k = 0; k < 3; k++) box(.36, .06, .085, mat(0xffd23f), 0, g, 0, -.3 - k * .35, .01).rotation.z = .5;
  const w = G(g); box(.56, 1.5, .3, paperM(), .1, w, 0, -.65, 0); box(.6, .3, .34, mat(0xe8402a), .05, w, 0, -.65, 0); w.visible = false; g.userData.wrap = w; return g; }
// espátula
export function spatula(parent) { const g = G(parent); box(.14, 1.6, .14, mat(0x2a2a2a), .05, g, 0, .8, 0); box(.9, .7, .05, mat(0xd8dce4, { metalness: .9, roughness: .2 }), .03, g, 0, 1.9, 0); return g; }
// gorro de papel de la Brötchenburg
export function paperHat(head) { const g = G(head, 0, 1.25, 0); const m = mat(0xffffff, { roughness: .8 }); box(1.5, .7, 1.4, m, .1, g, 0, .35, 0); box(1.52, .2, 1.42, mat(0xe8402a), .02, g, 0, .1, 0); const l = textPlane(.6, .6, 64, 64, (c, w, h) => drawLogo(c, w / 2, h / 2, 28)); l.position.set(0, .4, .72); g.add(l); return g; }

// ---------- carne en la plancha (vuelta: flip 0..1) ----------
export function patty(parent) { const g = G(parent); const p = cyl(.85, .85, .28, mat(0x6a3418, { roughness: .9 }), 18, g, 0, 0, 0); const t = cyl(.86, .86, .03, mat(0x3a1a0a, { roughness: 1 }), 18, g, 0, .15, 0); g.userData.set = (k, y = 0) => { g.position.y = y + Math.sin(clamp(k) * Math.PI) * 1.6; g.rotation.x = clamp(k) * Math.PI; }; return shade(g); }

// ---------- Stube (X): mi cuarto-taller ----------
// suelo de madera; pared trasera z = -10 (ventana grande x ∈ ±8, y 4.5 … 13.5); mesa de trabajo centrada en (0, 3.4, 0) de 12 × 4.4;
// fuera de la ventana (z < -10): calle con casas de entramado (z ≈ -46), guirnaldas, farolas; la gente de fiesta se coloca con CROWD.
// Puerta en la pared derecha (x = 14, z = 2). Cartel «WIR STELLEN EIN» y calendario en la pared izquierda (x = -14).
export function stube(scene, X) { const g = G(scene, X); const wood = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#b8783e'; c.fillRect(0, 0, w, h); c.fillStyle = '#a86a32'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 1); c.fillStyle = '#c8884a'; c.fillRect(20, 0, 2, h); }, true), 6, 6), roughness: .7 });
  plane(30, 26, wood, g, 0, 0, 3); const brick = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#3a6ac8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2e5ab0'; for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 * 16; x < w; x += 32) c.fillRect(x + 1, y + 1, 30, 14); }, true), 6, 2), roughness: .8 });
  const paint = mat(0xf4e8cc, { roughness: .9 });
  // pared trasera con hueco de ventana
  box(30, 2.6, .5, brick, 0, g, 0, 1.3, -10); box(6.8, 10.4, .5, paint, 0, g, -11.6, 7.8, -10); box(6.8, 10.4, .5, paint, 0, g, 11.6, 7.8, -10); box(16.6, 2.6, .5, paint, 0, g, 0, 11.7, -10);
  const fr = mat(0xffffff, { roughness: .4 }); for (const [w, h, x, y] of [[16.6, .4, 0, 2.6], [16.6, .4, 0, 10.4], [.4, 8, -8.2, 6.5], [.4, 8, 8.2, 6.5], [.25, 7.8, 0, 6.5], [16.4, .25, 0, 6.5]]) box(w, h, .7, fr, .05, g, x, y, -10);
  box(17.4, .3, 1.2, fr, .05, g, 0, 2.5, -9.5); for (const sx of [-1, 1]) { const cu = box(1.8, 8.4, .3, mat(0xe8402a, { roughness: 1 }), .2, g, sx * 9.4, 6.4, -9.5); }
  // paredes laterales
  for (const sx of [-1, 1]) { box(.5, 2.6, 26, brick, 0, g, sx * 15, 1.3, 3); box(.5, 10.4, 26, paint, 0, g, sx * 15, 7.8, 3); }
  // puerta (derecha)
  const DOOR = G(g, 14.7, 0, 2); DOOR.rotation.y = -Math.PI / 2; box(3.2, 6.2, .3, mat(0x6a3a1e, { roughness: .6 }), .06, DOOR, 0, 3.1, 0); sphere(.16, mat(0xd9a531, { metalness: .8 }), DOOR, 1.1, 3, .3, 8, 6);
  // mesa de trabajo
  const T = G(g, 0, 0, 0); box(9, .3, 3.6, mat(0x8a5a32, { roughness: .6 }), .08, T, 0, 2.15, 0); for (const [x, z] of [[-4.2, -1.5], [4.2, -1.5], [-4.2, 1.5], [4.2, 1.5]]) box(.3, 2.0, .3, mat(0x5a3a1e), 0, T, x, 1.0, z);
  box(8.4, .16, 3.2, mat(0x7a4a28), 0, T, 0, .6, 0);
  const BUNS = bunPile(T, 9, .42); BUNS.position.set(3.4, 2.3, -1.2); const PAP = paperStack(T, .5); PAP.position.set(3.4, 2.3, .8);
  const TW = [tower(g, 30, .5, 3), tower(g, 30, .5, 5), tower(g, 30, .5, 7)]; TW[0].position.set(-3.4, 2.3, -1.1); TW[1].position.set(7.4, 0, -7); TW[2].position.set(-7.4, 0, -7);
  const lampA = G(g, -3.8, 2.3, -1.3); lampA.scale.setScalar(.6); cyl(.5, .6, .2, mat(0x2a2a2a), 12, lampA, 0, .1, 0); const arm = box(.12, 3.2, .12, mat(0x2a2a2a), 0, lampA, .3, 1.6, 0); arm.rotation.z = -.25; const sh_ = new THREE.Mesh(new THREE.ConeGeometry(.7, .8, 14, 1, true), mat(0xffd23f, { side: THREE.DoubleSide })); sh_.position.set(1.1, 3.2, .2); sh_.rotation.z = .6; lampA.add(sh_);
  // cartel «WIR STELLEN EIN» y calendario (pared izquierda, miran a +x)
  const POST = textPlane(4.4, 5.6, 220, 280, (c, w, h) => { c.fillStyle = '#1e7a5a'; c.fillRect(0, 0, w, h); drawLogo(c, w / 2, 70, 52); txt(c, 'BRÖTCHENBURG', w / 2, 146, 26, '#ffffff'); txt(c, 'WIR STELLEN', w / 2, 196, 30, '#ffd23f'); txt(c, 'EIN!', w / 2, 236, 40, '#ffd23f', '#3a2400', 6); });
  POST.position.set(-14.7, 6.4, -4); POST.scale.setScalar(.75); POST.rotation.y = Math.PI / 2; g.add(POST);
  const CALP = textPlane(3.6, 4.2, 180, 210, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 50); txt(c, 'FREITAG', w / 2, 27, 30, '#ffffff'); txt(c, '13', w / 2, 112, 80, '#1a1a2a'); txt(c, 'GESPRÄCH!', w / 2, 180, 26, '#d8323a'); c.strokeStyle = '#d8323a'; c.lineWidth = 6; c.beginPath(); c.ellipse(w / 2, 112, 54, 46, 0, 0, 7); c.stroke(); });
  CALP.position.set(-14.7, 6.2, 3.5); CALP.scale.setScalar(.75); CALP.rotation.y = Math.PI / 2; g.add(CALP);
  // fuera: calle de fiesta
  const OUT = G(g); plane(140, 70, mat(0xffffff, { map: rep(noiseTex('#8a8aa0', ['#7a7a90', '#9a9ab0', '#84849a'], 1400, 3, 1), 30, 15), roughness: .9 }), OUT, 0, -.02, -40);
  for (let i = 0, x = -56; x <= 56; x += 16, i++) townhouse(OUT, x, -50, 15, 2 + (i % 3), 80 + i, 0); for (let i = 0, x = -64; x <= 64; x += 18, i++) townhouse(OUT, x, -78, 17, 3 + (i % 2), 95 + i, 0);
  const BUNT = []; for (let k = 0; k < 4; k++) BUNT.push(bunting(OUT, [-40, 12 + k, -14 - k * 9], [40, 13 + k, -18 - k * 9], 26, 1.6));
  const BULB = []; for (let k = 0; k < 3; k++) for (let i = 0; i < 18; i++) { const x = -34 + i * 4, y = 15 - Math.sin(i / 17 * Math.PI) * 2 + k, z = -20 - k * 10; const b = sphere(.25, glowM([0xffd23f, 0xff4a8a, 0x3ab8ff, 0x8ad84a][(i + k) % 4], 3), OUT, x, y, z, 8, 6); BULB.push(b); }
  for (const x of [-26, 26]) lamp(OUT, x, -22, Math.sign(x));
  const LI = new THREE.PointLight(0xfff2e0, 55, 60, 1.4); LI.position.set(0, 10, 4); g.add(LI); const LO = new THREE.PointLight(0xffb0e0, 70, 90, 1.2); LO.position.set(0, 16, -30); g.add(LO);
  return { g: shade(g), T, BUNS, PAP, TW, DOOR, POST, CALP, OUT, BULB, LI, LO }; }

// ---------- Brötchenburg (X) ----------
// Fachada en z = 40 mirando +z (calle delante, casas a los lados). Sala: suelo de damero, mostrador (Theke) a lo largo de x ∈ ±9 en z = 0 (los clientes en z > 0),
// carta de precios en la pared trasera (z = -14), plancha de la cocina en (0, 3.4, -8). Sala de mesas para la multitud z ∈ [6, 34].
export function broetchenburg(scene, X) { const g = G(scene, X); const tealM = mat(0x1e9a7a, { roughness: .45 }), cream = mat(0xfaf0d8, { roughness: .7 }), red = mat(0xe8402a, { roughness: .5 });
  const chk = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#fff8ea'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e7a5a'; c.fillRect(0, 0, 32, 32); c.fillRect(32, 32, 32, 32); }, true), 14, 14), roughness: .6 });
  plane(50, 56, chk, g, 0, 0, 12);
  // paredes interiores
  box(50, 12, .5, cream, 0, g, 0, 6, -16); for (const sx of [-1, 1]) box(.5, 12, 56, cream, 0, g, sx * 25, 6, 12); box(50, 2.4, .5, tealM, 0, g, 0, 1.2, -15.7);
  for (const sx of [-1, 1]) box(.6, 2.4, 56, tealM, 0, g, sx * 24.7, 1.2, 12); for (let k = 0; k < 10; k++) box(.9, .9, 56, k % 2 ? red : tealM, 0, g, (k - 4.5) * 5, 17.6, 12).visible = false;
  // carta de precios
  const MENU = textPlane(26, 6.5, 780, 195, (c, w, h) => { c.fillStyle = '#1a2a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12);
    [['BURGER', '4,50 €'], ['CHEESEBURGER', '5,20 €'], ['DOPPELBURG', '7,90 €'], ['POMMES', '2,80 €']].forEach(([a, b], i) => { const x = 30 + (i % 2) * 380, y = 60 + Math.floor(i / 2) * 70; c.font = `700 40px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#ffffff'; c.fillText(a, x, y); c.textAlign = 'right'; c.fillStyle = '#ffd23f'; c.fillText(b, x + 340, y); }); });
  MENU.position.set(0, 8.4, -15.6); MENU.scale.setScalar(.8); g.add(MENU); const LOGO = textPlane(5, 5, 200, 200, (c, w, h) => drawLogo(c, w / 2, h / 2, 96)); LOGO.position.set(-15, 8, -15.6); LOGO.scale.setScalar(.75); g.add(LOGO); const LOGO2 = LOGO.clone(); LOGO2.position.x = 17; g.add(LOGO2);
  // cocina: plancha y freidora detrás del mostrador
  const GRILL = G(g, 0, 0, -9); box(10, 2.5, 3.6, mat(0xb8bcc4, { metalness: .7, roughness: .3 }), .1, GRILL, 0, 1.25, 0); box(9.6, .2, 3.2, mat(0x1a1a1a, { roughness: .4, metalness: .5 }), 0, GRILL, 0, 2.6, 0); box(10, 1.6, .3, mat(0xb8bcc4, { metalness: .7 }), .05, GRILL, 0, 3.4, -1.7);
  box(12, 1.0, 4.4, mat(0x8a8e96, { metalness: .6, roughness: .3 }), .1, g, 0, 6.4, -9).visible = true; for (const sx of [-1, 1]) { const fr = box(3.6, 2.6, 3.4, mat(0xd8dce4, { metalness: .7, roughness: .3 }), .1, g, sx * 8, 1.3, -9); }
  // mostrador
  const TH = G(g, 0, 0, 0); box(20, 2.4, 2.6, tealM, .1, TH, 0, 1.2, 0); box(20.6, .3, 3.2, mat(0xffffff, { roughness: .2 }), .05, TH, 0, 2.55, 0); box(20, .35, 2.62, red, 0, TH, 0, 1.9, .05);
  const reg = G(TH, -6, 2.7, 0); reg.scale.setScalar(.7); box(2, 1, 1.6, mat(0x2a2a2a), .1, reg, 0, .5, 0); const sc = box(1.6, 1.1, .1, mat(0x3ab8ff, { emissive: 0x1a6aa0, emissiveIntensity: .6 }), 0, reg, 0, 1.5, -.3); sc.rotation.x = -.4;
  const sauce = [0xe8322a, 0xffd23f]; sauce.forEach((col, i) => { cyl(.2, .22, .9, mat(col, { roughness: .3 }), 10, TH, 6 + i * .6, 3.15, .6); cyl(.06, .1, .3, mat(col), 8, TH, 6 + i * .6, 3.75, .6); });
  // mesas de la sala (con bancos)
  const TABLES = []; for (const [x, z] of [[-14, 10], [14, 10], [-14, 22], [14, 22], [0, 30]]) { const t = G(g, x, 0, z); cyl(2.0, 2.0, .2, mat(0xe8402a, { roughness: .4 }), 20, t, 0, 2.1, 0); cyl(.25, .25, 2.1, mat(0x2a2a2a, { metalness: .6 }), 8, t, 0, 1.05, 0); TABLES.push(t); }
  // guirnaldas de fiesta (solo en la noche de la gran fiesta)
  const PARTY = G(g); for (let k = 0; k < 4; k++) bunting(PARTY, [-24, 10.5, -12 + k * 12], [24, 10.5, -10 + k * 12], 22, 1.2); PARTY.visible = false;
  const LI = new THREE.PointLight(0xfff0d8, 70, 70, 1.3); LI.position.set(0, 10.5, 6); g.add(LI); const LK = new THREE.PointLight(0xffd8a0, 60, 30, 1.4); LK.position.set(0, 10, -8); g.add(LK);
  // ---------- fachada ----------
  const F = G(g, 0, 0, 40); F.scale.setScalar(.62); const fM = mat(0x1e9a7a, { roughness: .5 });
  box(34, 15, 1, fM, .1, F, 0, 7.5, 0); box(34.6, 1.2, 1.4, red, .1, F, 0, 15.2, .2); for (let k = 0; k < 17; k++) { const t = box(1.6, 1.8, 1.6, k % 2 ? red : mat(0xfaf0d8), .1, F, -16 + k * 2, 16.6, 0); }
  for (const sx of [-1, 1]) { const tw = G(F, sx * 17.5, 0, .5); cyl(2.6, 2.8, 20, mat(0xfaf0d8, { roughness: .7 }), 16, tw, 0, 10, 0); const roof = new THREE.Mesh(new THREE.ConeGeometry(3.4, 4.5, 16), mat(0xe0943a, { roughness: .55 })); roof.position.y = 22.2; tw.add(roof); const sb = sphere(.5, mat(0xfff4d0), tw, 0, 24.6, 0, 8, 6); for (let k = 0; k < 3; k++) box(.9, 1.6, .2, mat(0x2a3a4a, { emissive: 0xffc860, emissiveIntensity: .7 }), .1, tw, 0, 8 + k * 4, 2.6); }
  const SIGN = textPlane(24, 4.8, 960, 192, (c, w, h) => { c.fillStyle = '#e8402a'; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.lineWidth = 12; c.strokeStyle = '#ffd23f'; c.stroke(); drawLogo(c, 110, h / 2, 74); txt(c, 'BRÖTCHENBURG', w / 2 + 70, h / 2 + 6, 112, '#ffffff', '#7a1a0a', 12); }, .25);
  SIGN.position.set(0, 12.2, .7); F.add(SIGN);
  const win = mat(0x9fd8f8, { roughness: .05, metalness: .3, emissive: 0xffe8b0, emissiveIntensity: .35 }); for (const sx of [-1, 1]) { box(9, 6.5, .2, win, 0, F, sx * 9.5, 4.8, .6); box(9.4, .5, .4, mat(0xffffff), .05, F, sx * 9.5, 8.2, .6); box(9.4, .5, .4, mat(0xffffff), .05, F, sx * 9.5, 1.4, .6); }
  box(6, 8.6, .3, mat(0x9fd8f8, { roughness: .05, metalness: .3, emissive: 0xffe8b0, emissiveIntensity: .25 }), 0, F, 0, 4.3, .6); box(6.6, .5, .5, mat(0xffffff), .05, F, 0, 8.8, .6);
  const HIRE = textPlane(4.2, 3.4, 210, 170, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8402a'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); txt(c, 'WIR STELLEN', w / 2, 45, 30, '#e8402a'); txt(c, 'EIN!', w / 2, 92, 52, '#e8402a'); txt(c, 'Burger-Einwickler', w / 2, 140, 20, '#1a1a2a'); });
  HIRE.position.set(9.5, 4.6, .75); F.add(HIRE);
  const awn = canvasTex(64, 16, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#e8402a'; c.fillRect(i * 8, 0, 8, h); } }); for (const sx of [-1, 1]) { const a = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), mat(0xffffff, { map: awn, side: THREE.DoubleSide, roughness: .8 })); a.position.set(sx * 9.5, 9.3, 2); a.rotation.x = -1.0; F.add(a); }
  // calle delante y casas a los lados
  plane(160, 80, mat(0xffffff, { map: rep(noiseTex('#a8a8b0', ['#9a9aa4', '#b4b4bc', '#a0a0a8'], 1400, 3, 1), 40, 20), roughness: .9 }), g, 0, -.02, 76);
  for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) townhouse(g, sx * (30 + k * 16), 32, 15, 2 + k % 2, 120 + k + (sx > 0 ? 5 : 0), 0); for (const sx of [-1, 1]) { tree(g, sx * 24, 50, .9); lamp(g, sx * 12, 52, sx); }
  return { g: shade(g), TH, GRILL, MENU, PARTY, F, SIGN, HIRE, TABLES, LI, LK }; }
