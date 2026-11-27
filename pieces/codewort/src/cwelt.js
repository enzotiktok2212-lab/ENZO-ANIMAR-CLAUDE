// CODEWORT — mundo propio, copiado del ambiente del original: pueblo de casas de madera con porche al borde de un bosque de abetos,
// calle de adoquín mojado con farolas cálidas y reflejos, montañas en la niebla; la casa de Mats por dentro (Flur con puerta azul y mirilla,
// escalera, Abstellkammer, salón, puerta trasera), la Kammer por dentro, la oficina de Mama, el puerto de Hamburgo y la parada del tranvía.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, V } from './engine.js';
import { txt } from './props.js';

const PI = Math.PI;
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.userData.noShadow) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const rep = (t, a, b) => { t = t.clone(); t.needsUpdate = true; t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g; };
export const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: col, emissiveIntensity: k, roughness: 1 });
const basic = (col, o = {}) => new THREE.MeshBasicMaterial({ color: col, ...o });

// ---------- texturas ----------
const sidingT = (a, b) => canvasTex(256, 256, (c, w, h) => { const r = RNG(a.length * 7 + b.length); for (let y = 0; y < h; y += 21) { c.fillStyle = r() > .5 ? a : b; c.fillRect(0, y, w, 21);
  c.globalAlpha = .12; for (let k = 0; k < 10; k++) { c.fillStyle = r() > .5 ? '#000' : '#fff'; c.fillRect(r() * w, y + 3 + r() * 14, 40 + r() * 90, 1.5); } c.globalAlpha = 1;
  const g = c.createLinearGradient(0, y, 0, y + 21); g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(.75, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.42)'); c.fillStyle = g; c.fillRect(0, y, w, 21);
  c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(Math.floor(r() * w), y, 2, 21); } }, true);
const shingleT = (a, b) => canvasTex(256, 256, (c, w, h) => { const r = RNG(31); for (let y = 0; y < h; y += 16) for (let x = -(y / 16 % 2) * 14; x < w; x += 28) { c.fillStyle = r() > .5 ? a : b; c.fillRect(x, y, 27, 15); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x, y + 13, 27, 3); c.fillStyle = 'rgba(255,255,255,.06)'; c.fillRect(x, y, 27, 3); } }, true);
const cobbleT = (wet = 1) => canvasTex(512, 512, (c, w, h) => { const r = RNG(77); c.fillStyle = '#2a2d33'; c.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 32) for (let x = -(y / 32 % 2) * 20; x < w; x += 40) { const v = 70 + r() * 40 | 0; c.fillStyle = `rgb(${v},${v + 2},${v + 8})`; c.beginPath(); c.roundRect(x + 2, y + 2, 36, 28, 9); c.fill(); c.fillStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.roundRect(x + 5, y + 4, 26, 8, 4); c.fill(); }
  if (wet) { c.globalAlpha = .35; for (let k = 0; k < 14; k++) { const g = c.createRadialGradient(r() * w, r() * h, 0, 0, 0, 1); } c.globalAlpha = 1; } }, true);
const plankT = (a = '#8a5a34', b = '#764a2a') => canvasTex(256, 256, (c, w, h) => { const r = RNG(4); for (let y = 0; y < h; y += 32) { c.fillStyle = r() > .5 ? a : b; c.fillRect(0, y, w, 32); c.globalAlpha = .16; for (let k = 0; k < 14; k++) { c.fillStyle = r() > .5 ? '#000' : '#fff'; c.fillRect(r() * w, y + r() * 30, 30 + r() * 60, 2); } c.globalAlpha = 1; c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(0, y, w, 2); c.fillRect(Math.floor(r() * w), y, 2, 32); } }, true);
const wallT = (a = '#efe2c4', b = '#e6d6b4') => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(9); c.globalAlpha = .25; for (let k = 0; k < 300; k++) { c.fillStyle = r() > .5 ? b : '#fff8e8'; c.fillRect(r() * w, r() * h, 2, 2); } }, true);
const runnerT = () => canvasTex(128, 512, (c, w, h) => { c.fillStyle = '#e8dcc0'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.05)'; for (let y = 0; y < h; y += 4) c.fillRect(0, y, w, 1); c.fillStyle = '#b8323a'; for (const x of [10, 24, w - 30, w - 16]) c.fillRect(x, 0, 6, h); c.fillStyle = '#2a3a6a'; c.fillRect(w / 2 - 3, 0, 6, h); }, true);
const grassT = () => canvasTex(256, 256, (c, w, h) => { const r = RNG(5); c.fillStyle = '#3e5a2c'; c.fillRect(0, 0, w, h); for (let k = 0; k < 1600; k++) { const v = r(); c.fillStyle = v > .6 ? '#4e6e34' : v > .3 ? '#344c26' : '#5a7a3c'; c.fillRect(r() * w, r() * h, 2, 4); } }, true);
const gravelT = () => canvasTex(256, 256, (c, w, h) => { const r = RNG(15); c.fillStyle = '#8a857a'; c.fillRect(0, 0, w, h); for (let k = 0; k < 2600; k++) { const v = 90 + r() * 90 | 0; c.fillStyle = `rgb(${v},${v - 4},${v - 12})`; c.beginPath(); c.arc(r() * w, r() * h, 1 + r() * 2.2, 0, 7); c.fill(); } }, true);
const curtainT = (col) => canvasTex(64, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 8) { const g = c.createLinearGradient(x, 0, x + 8, 0); g.addColorStop(0, 'rgba(0,0,0,.25)'); g.addColorStop(.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(0,0,0,.25)'); c.fillStyle = g; c.fillRect(x, 0, 8, h); } });
const glowT = (col = '255,170,80') => canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, `rgba(${col},.9)`); g.addColorStop(.35, `rgba(${col},.35)`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.fillRect(0, 0, w, h); });
const GLOW = glowT(), GLOWB = glowT('170,200,255');
// halo/brillo aditivo (luces de farolas, ventanas, reflejos en el suelo mojado)
export function halo(parent, x, y, z, s = 4, col = GLOW, op = .7, flat = false) { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: col, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending }));
  m.position.set(x, y, z); if (flat) m.rotation.x = -PI / 2; m.userData.noShadow = true; m.renderOrder = 3; parent.add(m); if (!flat) m.userData.bill = true; return m; }

// ventana: marco blanco, cristal con interior cálido (encendida) o azul oscuro reflectante; cortinas
const LITT = canvasTex(64, 96, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ffcf80'); g.addColorStop(1, '#f09a40'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(120,60,20,.35)'; c.fillRect(0, h * .72, w, h * .28); c.fillStyle = 'rgba(90,50,20,.5)'; c.fillRect(w * .1, h * .5, w * .35, h * .22); });
const DARKT = canvasTex(64, 96, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#2a3a5a'); g.addColorStop(.5, '#121a2c'); g.addColorStop(1, '#22304a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.1)'; c.beginPath(); c.moveTo(0, h * .3); c.lineTo(w * .5, 0); c.lineTo(w * .7, 0); c.lineTo(0, h * .5); c.fill(); });
export const WINLIT = () => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: LITT, emissiveIntensity: 1.25, roughness: .2 });
export const WINDARK = () => new THREE.MeshStandardMaterial({ color: 0xffffff, map: DARKT, roughness: .08, metalness: .3 });
function fenster(g, x, y, z, w = 4.4, h = 6, lit = true, frame = 0xf4f0e6, list = null, cur = '#c84a3a') {
  const gl = box(w, h, .2, lit ? WINLIT() : WINDARK(), 0, g, x, y, z); gl.userData.win = true; if (list) list.push(gl);
  const fm = mat(frame, { roughness: .6 }); for (const s of [-1, 1]) { box(.4, h + .8, .5, fm, .05, g, x + s * (w / 2 + .2), y, z + .1); } box(w + 1.2, .45, .6, fm, .05, g, x, y + h / 2 + .2, z + .1); box(w + 1.6, .5, 1.1, fm, .05, g, x, y - h / 2 - .2, z + .3);
  box(.22, h, .3, fm, 0, g, x, y, z + .12); box(w, .22, .3, fm, 0, g, x, y + h * .1, z + .12);
  if (cur) for (const s of [-1, 1]) { const c = box(w * .26, h * .92, .1, mat(0xffffff, { map: curtainT(cur), roughness: 1 }), 0, g, x + s * w * .36, y, z - .2); c.userData.noShadow = true; }
  return gl; }

// ---------- casa de madera con porche (frente hacia +z local) ----------
// o: { col: [a, b] (tablas), trim, door, roof, lit (ventanas encendidas), porchLit, all (todas las ventanas a tope) }
export function holzhaus(parent, x, z, rot, o = {}) {
  const g = G(parent, x, 0, z); g.rotation.y = rot; const W_ = 26, D = 22, B = 1.6, FH = 10, WH = B + FH * 2;
  const side = mat(0xffffff, { map: rep(sidingT(...(o.col || ['#5a86a0', '#527c96'])), 3, 3), roughness: .8 });
  box(W_ + .6, B, D + .6, mat(0x7a756c, { roughness: .95 }), .1, g, 0, B / 2, 0);   // zócalo de piedra
  box(W_, FH * 2, D, side, 0, g, 0, B + FH, 0);
  const trim = mat(o.trim ?? 0xf2eee4, { roughness: .6 }); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.7, FH * 2, .7, trim, .05, g, sx * W_ / 2, B + FH, sz * D / 2); box(W_ + .8, .6, D + .8, trim, .05, g, 0, B + FH, 0);
  // tejado a dos aguas (cumbrera paralela a x) con alero
  const rm = mat(0xffffff, { map: rep(shingleT(...(o.roof || ['#3a3a44', '#2e2e36'])), 4, 3), roughness: .85 });
  for (const s of [-1, 1]) { const r = box(W_ + 3, .6, D / 2 / Math.cos(.62) + 2, rm, 0, g, 0, WH + D / 4 * Math.tan(.62) - .1, s * D / 4); r.rotation.x = s * .62; }
  const gable = new THREE.Shape(); gable.moveTo(-D / 2, 0); gable.lineTo(D / 2, 0); gable.lineTo(0, D / 2 * Math.tan(.62)); gable.closePath();
  for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.ShapeGeometry(gable), side); m.rotation.y = s * PI / 2; m.position.set(s * W_ / 2, WH, 0); g.add(m); }
  box(2.4, 8, 2.4, mat(0x6a3a2a, { roughness: .9 }), .1, g, W_ * .28, WH + 6, -3); box(3, .6, 3, mat(0x4a4a4a), .1, g, W_ * .28, WH + 10.2, -3);
  // ventanas
  const wins = [], lit = o.lit ?? true, fz = D / 2 + .05;
  fenster(g, -8.5, B + 5.4, fz, 4.6, 6, lit, o.trim, wins, o.cur); fenster(g, 7.5, B + 5.4, fz, 4.6, 6, o.all ? true : !lit, o.trim, wins, o.cur);
  for (const wx of [-8, 0, 8]) fenster(g, wx, B + FH + 5.2, fz, 4, 5.6, o.all ? true : wx === 0 ? lit : false, o.trim, wins, o.cur);
  for (const s of [-1, 1]) fenster(g, s * (W_ / 2 + .05), B + 5.4, -2, 4.6, 6, o.all ? true : false, o.trim, wins, o.cur).rotation.y = s * PI / 2;
  // puerta (pivote en la bisagra izquierda) con mirilla y pomo; placa de número
  const DW = 5, DH = 9.6, dx = -1.5; const dp = G(g, dx - DW / 2, B, fz + .15); const door = box(DW, DH, .4, mat(o.door ?? 0x1e3460, { roughness: .45 }), .05, dp, DW / 2, DH / 2, 0);
  for (const [px, py, ph] of [[1.4, 7, 3], [3.6, 7, 3], [1.4, 2.6, 3.4], [3.6, 2.6, 3.4]]) box(1.6, ph, .2, mat(o.door ?? 0x1e3460, { roughness: .35 }), .05, dp, px, py, .25);
  sphere(.3, mat(0xd9a531, { metalness: .9, roughness: .25 }), dp, DW - .6, 4.6, .4, 12, 8); const peep = cyl(.16, .16, .3, mat(0xd9a531, { metalness: .9, roughness: .2 }), 12, dp, DW / 2, 7.6, .3); peep.rotation.x = PI / 2;
  box(DW + 1.2, .5, .7, trim, .05, g, dx, B + DH + .25, fz + .1); for (const s of [-1, 1]) box(.5, DH, .7, trim, .05, g, dx + s * (DW / 2 + .25), B + DH / 2, fz + .1);
  if (o.num) { const n = textPlane(1.6, 1, 96, 60, (c, w, h) => { c.fillStyle = '#1a1a22'; c.fillRect(0, 0, w, h); txt(c, o.num, w / 2, h / 2 + 2, 40, '#e8d8a0'); }); n.position.set(dx + DW / 2 + 1.6, B + 7.6, fz + .2); g.add(n); }
  // porche: suelo de tablas, escalones, postes, barandilla con balaustres, techo, farol junto a la puerta
  const wood = mat(0xffffff, { map: rep(plankT('#9a7450', '#8a6646'), 3, 1), roughness: .75 }); const PW = 20, PD = 8, px0 = -1.5;
  box(PW, .5, PD, wood, 0, g, px0, B - .25, D / 2 + PD / 2); box(PW, B - .5, .3, mat(0x5a4a3a), 0, g, px0, (B - .5) / 2, D / 2 + PD);
  for (let s = 0; s < 3; s++) box(7, .5, 1.3, wood, .02, g, px0, B - .45 - s * .5, D / 2 + PD + .7 + s * 1.2);
  const post = mat(o.trim ?? 0xf2eee4, { roughness: .6 }); for (const sx of [-1, 1]) { box(.7, 11.4, .7, post, .05, g, px0 + sx * (PW / 2 - .4), B + 5.7, D / 2 + PD - .4); box(.7, 11.4, .7, post, .05, g, px0 + sx * (PW / 2 - .4), B + 5.7, D / 2 + .5); }
  const roofP = box(PW + 1.6, .5, PD + 1.4, mat(0xffffff, { map: rep(shingleT('#3a3a44', '#2e2e36'), 3, 1), roughness: .85 }), 0, g, px0, B + 11.7, D / 2 + PD / 2 + .3); roofP.rotation.x = -.12;
  box(PW, .5, .4, post, 0, g, px0, B + 11.2, D / 2 + PD - .3);
  for (const sx of [-1, 1]) { const x0 = px0 + sx * (PW / 2 - .4), x1 = px0 + sx * 3.6; box(Math.abs(x1 - x0), .3, .35, post, .05, g, (x0 + x1) / 2, B + 3, D / 2 + PD - .4); for (let k = 1; k < 7; k++) box(.18, 3, .18, post, 0, g, x0 + (x1 - x0) * k / 7, B + 1.5, D / 2 + PD - .4);
    box(.3, .3, PD - .8, post, .05, g, px0 + sx * (PW / 2 - .4), B + 3, D / 2 + PD / 2); for (let k = 1; k < 5; k++) box(.18, 3, .18, post, 0, g, px0 + sx * (PW / 2 - .4), B + 1.5, D / 2 + .5 + (PD - .9) * k / 5); }
  const LAMP = G(g, dx + DW / 2 + 1.7, B + 9.6, fz + .5); box(.9, 1.4, .9, mat(0x1a1a1a, { metalness: .5, roughness: .4 }), .05, LAMP, 0, 0, 0); const lglass = box(.7, 1.0, .7, glowM(0xffc070, o.porchLit === false ? 0 : 3), .02, LAMP, 0, -.05, .12); const lh = halo(LAMP, 0, 0, .7, 5, GLOW, o.porchLit === false ? 0 : .55);
  box(.6, .3, .6, mat(0x1a1a1a), 0, LAMP, 0, .85, 0);
  // jardincito: arbustos
  for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) sphere(1.3 + (k % 2) * .4, mat(k % 2 ? 0x2e4a24 : 0x3a5a2a, { roughness: .95 }), g, px0 + sx * (PW / 2 - 2 - k * 2.4), 1.1, D / 2 + PD + 1.6, 10, 8);
  const W2 = new THREE.Vector3();
  return { g: shade(g), door: dp, DW, DH, peep, wins, lamp: { glass: lglass, halo: lh }, B, porchZ: D / 2 + PD / 2, frontZ: fz, doorX: dx,
    // punto del mundo a partir de coordenadas locales de la casa
    w: (lx, ly, lz) => { g.updateMatrixWorld(true); return g.localToWorld(W2.set(lx, ly, lz).clone()); }, rot };
}

// ---------- abeto (conos apilados) ----------
const PINE = { trunk: new THREE.CylinderGeometry(.35, .5, 4, 6), cone: new THREE.ConeGeometry(1, 1, 7) };
export function forest(parent, pts, seed = 1, dark = 1) {
  const r = RNG(seed), n = pts.length, cols = [0x1e3424, 0x24402a, 0x1a2e22, 0x2a4630].map(c => new THREE.Color(c).multiplyScalar(dark));
  const tm = new THREE.InstancedMesh(PINE.trunk, mat(0x3a2a1e, { roughness: 1 }), n), cm_ = new THREE.InstancedMesh(PINE.cone, mat(0xffffff, { roughness: .95 }), n * 4); const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), P = new THREE.Vector3();
  pts.forEach(([x, z, s0], i) => { const s = s0 ?? (.8 + r() * .7), h = 34 * s; M.compose(P.set(x, 2 * s, z), Q.identity(), S.set(s, s, s)); tm.setMatrixAt(i, M);
    for (let k = 0; k < 4; k++) { const w = (11 - k * 2.4) * s, ch = h * .36, y = 3 * s + k * h * .19 + ch / 2; Q.setFromAxisAngle(V(0, 1, 0), r() * 6); M.compose(P.set(x, y, z), Q, S.set(w, ch, w)); cm_.setMatrixAt(i * 4 + k, M); cm_.setColorAt(i * 4 + k, cols[(i + k) % 4]); } });
  tm.castShadow = cm_.castShadow = true; tm.receiveShadow = cm_.receiveShadow = true; parent.add(tm, cm_); return [tm, cm_]; }
// árbol de otoño (hojas naranjas) para «Letzten Herbst»
export function herbstbaum(parent, x, z, s = 1, seed = 1) { const g = G(parent, x, 0, z); const r = RNG(seed); cyl(.5 * s, .8 * s, 10 * s, mat(0x4a3424, { roughness: 1 }), 7, g, 0, 5 * s, 0);
  for (let k = 0; k < 7; k++) sphere((3 + r() * 1.6) * s, mat([0xd8741a, 0xe8a22a, 0xb84a1a, 0xc88a2a][k % 4], { roughness: .9 }), g, (r() - .5) * 6 * s, (11 + r() * 5) * s, (r() - .5) * 6 * s, 10, 8); return g; }

// ---------- farola ----------
export function laterne(parent, x, z, o = {}) { const g = G(parent, x, 0, z); const m = mat(0x1a1c20, { metalness: .6, roughness: .4 }); cyl(.25, .35, 14, m, 8, g, 0, 7, 0); cyl(.5, .6, 1, m, 8, g, 0, .5, 0);
  const head = G(g, 0, 14.6, 0); cyl(.5, .9, 1.6, m, 6, head, 0, 0, 0); const gl = cyl(.75, .55, 1.4, glowM(0xffb860, 3.2), 6, head, 0, -.4, 0); cyl(1.2, .3, .6, m, 6, head, 0, 1, 0);
  const hl = halo(head, 0, -.3, 0, 9, GLOW, .75); const puddle = halo(parent, x + (o.px ?? 0), .08, z + (o.pz ?? 0), 14, GLOW, .28, true);
  return { g, glass: gl, halo: hl, puddle }; }

// ---------- coche (el Golf de Mama: compacto, rojo) ----------
export function golf(parent, col = 0xb8262e) { const g = G(parent); const body = mat(col, { roughness: .28, metalness: .35 }), gl = mat(0x1a2230, { roughness: .05, metalness: .5 });
  box(6.2, 2.2, 12.6, body, .5, g, 0, 2.3, 0); box(5.6, 2.2, 7.2, body, .6, g, 0, 4.4, -1.2); box(5.7, 1.7, 7.0, gl, .4, g, 0, 4.5, -1.2); box(5.9, .5, 1, mat(0x1a1a1a), .1, g, 0, 1.6, 6.3); box(5.9, .5, 1, mat(0x1a1a1a), .1, g, 0, 1.6, -6.3);
  const wheels = []; for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const w = cyl(1.25, 1.25, .9, mat(0x141414, { roughness: .8 }), 18, g, sx * 3, 1.25, sz * 4); w.rotation.z = PI / 2; cyl(.7, .7, .95, mat(0xb8b8c0, { metalness: .8, roughness: .3 }), 10, g, sx * 3, 1.25, sz * 4).rotation.z = PI / 2; wheels.push(w); }
  const heads = []; for (const sx of [-1, 1]) { heads.push(box(1.3, .7, .2, glowM(0xfff4d8, 0), .1, g, sx * 2.1, 2.9, 6.35)); box(1.1, .5, .2, glowM(0xff2a2a, .6), .1, g, sx * 2.2, 2.9, -6.35); }
  const beam = []; for (const sx of [-1, 1]) { const b = new THREE.Mesh(new THREE.ConeGeometry(4, 26, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff0c8, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); b.rotation.x = -PI / 2; b.position.set(sx * 2.1, 2.6, 19.5); b.userData.noShadow = true; g.add(b); beam.push(b); }
  // puerta del conductor (pivote delantero)
  const dp = G(g, -3.15, 1.2, 1.6); box(.3, 3.2, 4.4, body, .2, dp, 0, 1.8, -2.2); box(.32, 1.4, 3.6, gl, .1, dp, 0, 3.4, -2.2);
  box(1.6, .5, .3, mat(0xf4f4f4), .05, g, 0, 1.7, 6.5); const plate = textPlane(1.5, .4, 150, 40, (c, w, h) => { c.fillStyle = '#f4f4f4'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a3aa8'; c.fillRect(0, 0, 14, h); txt(c, 'WB-MK 412', w / 2 + 6, h / 2 + 2, 22, '#111'); }); plate.position.set(0, 1.7, 6.67); g.add(plate);
  g.userData = { heads, beam, door: dp, wheels, lights(k) { heads.forEach(h => h.material.emissiveIntensity = 3 * k); beam.forEach(b => b.material.opacity = .16 * k); } };
  return shade(g); }

// ---------- tranvía (amarillo y crema) ----------
export function tram(parent) { const g = G(parent); const y = mat(0xf2c21a, { roughness: .35, metalness: .2 }), cr = mat(0xf4efe0, { roughness: .5 }), gl = WINLIT();
  box(7, 9, 40, y, .6, g, 0, 6, 0); box(7.1, 3.4, 37, gl, .1, g, 0, 7.6, 0); box(7.15, 1.2, 40.2, cr, .2, g, 0, 3.4, 0); box(6.6, .6, 40, mat(0x2a2a2a), .1, g, 0, 10.8, 0);
  cyl(.1, .1, 5, mat(0x1a1a1a), 6, g, 0, 13, 4).rotation.x = .9; for (const z of [-14, 14]) box(6, 1.6, 4, mat(0x1a1a1a), .1, g, 0, 1, z);
  const sign = textPlane(4, 1, 200, 50, (c, w, h) => { c.fillStyle = '#111'; c.fillRect(0, 0, w, h); txt(c, '4  Waldrand', w / 2, h / 2 + 2, 30, '#ffb020'); }, 1); sign.position.set(0, 9.9, 20.05); g.add(sign);
  return shade(g); }
// parada: marquesina de cristal, poste con la «H» verde y amarilla
export function haltestelle(parent, x, z, rot = 0) { const g = G(parent, x, 0, z); g.rotation.y = rot; const m = mat(0x3a3e44, { metalness: .6, roughness: .4 }); const gl = new THREE.MeshStandardMaterial({ color: 0xbfd8e8, transparent: true, opacity: .25, roughness: .05 });
  for (const s of [-1, 1]) cyl(.2, .2, 9, m, 6, g, s * 6, 4.5, -1.6); box(13, .4, 4, m, .05, g, 0, 9.1, 0); const back = box(12, 7, .1, gl, 0, g, 0, 4.4, -1.8); back.userData.noShadow = true; box(9, .4, 1.4, mat(0x8a6a4a), .05, g, 0, 2.6, -1);
  cyl(.15, .15, 11, m, 6, g, 8, 5.5, 1); const h = textPlane(2.2, 2.2, 120, 120, (c, w, hh) => { c.fillStyle = '#ffd200'; c.beginPath(); c.arc(w / 2, hh / 2, w / 2 - 2, 0, 7); c.fill(); c.strokeStyle = '#2a8a3a'; c.lineWidth = 8; c.stroke(); txt(c, 'H', w / 2, hh / 2 + 4, 76, '#2a8a3a'); }); h.position.set(8, 10.6, 1.1); g.add(h);
  return shade(g); }

// ---------- el pueblo (x = 0): calle a lo largo de z ----------
export function siedlung(scene) {
  const g = G(scene); const S = {};
  const grass = mat(0xffffff, { map: rep(grassT(), 30, 30), roughness: .95 }); const gp = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), grass); gp.rotation.x = -PI / 2; gp.position.set(0, -.02, -40); gp.receiveShadow = true; g.add(gp);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(20, 520), mat(0xffffff, { map: rep(cobbleT(), 4, 104), roughness: .22, metalness: .15, envMapIntensity: 1.6 })); road.rotation.x = -PI / 2; road.position.set(0, .03, -60); road.receiveShadow = true; g.add(road);
  for (const s of [-1, 1]) { box(6, .5, 520, mat(0xffffff, { map: rep(cobbleT(0), 2, 120), roughness: .45, color: 0xb8b4ac }), 0, g, s * 13, .25, -60); box(.5, .6, 520, mat(0x9a968e), .05, g, s * 10.1, .3, -60); }
  // casas: este (x = 44, mirando a -x) y oeste (x = -44, mirando a +x). Mats = este z = 0; Kessler = oeste z = 0; Brandt = este z = -100
  const EAST = [[100, ['#6a8a5a', '#628252'], 0x3a2a1e], [50, ['#c8b48a', '#bea882'], 0x2a3a5a], [0, ['#5a86a0', '#527c96'], 0x1e3460, 'MATS'], [-50, ['#8a5a4a', '#805244'], 0x2a4a3a], [-100, ['#7a7aa0', '#727298'], 0x3a2a4a, 'BRANDT'], [-150, ['#a0a4a8', '#989ca0'], 0x4a2a2a]];
  const WEST = [[100, ['#a85a4a', '#9e5244'], 0x1e3460], [50, ['#5a7a8a', '#527282'], 0x5a2a2a], [0, ['#a890b8', '#9e86ae'], 0x3a5a8a, 'KESSLER'], [-50, ['#c8a060', '#be9858'], 0x2a3a5a], [-100, ['#6a8aa8', '#6282a0'], 0x4a3a2a], [-150, ['#8a9a6a', '#829262'], 0x2a2a4a]];
  S.houses = {};
  EAST.forEach(([z, col, door, name], i) => { const h = holzhaus(g, 44, z, -PI / 2, { col, door, num: String(12 + i * 2), lit: i % 2 === 0, all: name === 'BRANDT', cur: ['#c84a3a', '#e8d8b0', '#4a6a9a'][i % 3] }); if (name) S.houses[name] = h; });
  WEST.forEach(([z, col, door, name], i) => { const h = holzhaus(g, -44, z, PI / 2, { col, door, num: String(13 + i * 2), lit: i % 2 === 1, cur: ['#e8d8b0', '#7a3a5a', '#c84a3a'][i % 3] }); if (name) S.houses[name] = h; });
  // camino de grava de Mats (entre su casa y la de z = -50) hasta el garaje
  const gv = new THREE.Mesh(new THREE.PlaneGeometry(52, 11), mat(0xffffff, { map: rep(gravelT(), 8, 2), roughness: .95 })); gv.rotation.x = -PI / 2; gv.position.set(36, .06, -22); gv.receiveShadow = true; g.add(gv); S.drive = V(36, 0, -22);
  { const gar = G(g, 58, 0, -22); box(14, 12, 14, mat(0xffffff, { map: rep(sidingT('#5a86a0', '#527c96'), 2, 2), roughness: .8 }), 0, gar, 0, 6, 0); box(10, 9, .3, mat(0xe8e4da, { roughness: .6 }), .05, gar, -7.1, 4.5, 0).rotation.y = PI / 2; box(16, .6, 16, mat(0x2e2e36), 0, gar, 0, 12.3, 0); }
  for (let k = 0; k < 9; k++) box(1.2, .3, .6, mat(0x8a8478), .1, g, 20 + k * 1.2, .2 + (k % 2) * .05, -12.2);
  // farolas a ambos lados con reflejos naranjas en el adoquín
  S.lamps = []; for (let z = 125; z > -190; z -= 42) for (const s of [-1, 1]) S.lamps.push(laterne(g, s * 12.5, z + (s > 0 ? 21 : 0), { px: -s * 5 }));
  // vallas blancas bajas delante de los jardines
  for (const s of [-1, 1]) for (let z = 120; z > -170; z -= 50) { const fx = s * 17.5; for (let k = 0; k < 9; k++) box(.3, 2.4, .3, mat(0xeeeae0), .05, g, fx, 1.2, z - 6 - k * 1.6); box(.25, .3, 14, mat(0xeeeae0), 0, g, fx, 2, z - 12.4); }
  // parada del tranvía (oeste, z = 72) y raíles
  haltestelle(g, -17, 72, PI / 2); for (const s of [-1, 1]) box(.3, .1, 520, mat(0x8a8a90, { metalness: .9, roughness: .3 }), 0, g, -4 + s * 2.2, .1, -60); S.tram = tram(g); S.tram.position.set(-4, 0, 60); S.tram.visible = false;
  // bosque de abetos: detrás de las casas, al fondo de la calle (z < -180) y detrás del pueblo; el bosque baja hasta la carretera al final
  const pts = [], r = RNG(3);
  for (let i = 0; i < 460; i++) { const z = 170 - r() * 420, s = r() > .5 ? 1 : -1, x = s * (78 + r() * 150); pts.push([x, z]); }
  for (let i = 0; i < 260; i++) { const x = (r() - .5) * 300, z = -190 - r() * 220; if (Math.abs(x) < 9 && z > -260) continue; pts.push([x, z, .9 + r() * .8]); }
  for (let i = 0; i < 120; i++) { const x = (r() - .5) * 320, z = 175 + r() * 160; pts.push([x, z]); }
  for (let i = 0; i < 60; i++) { const s = r() > .5 ? 1 : -1; pts.push([s * (62 + r() * 14), 140 - r() * 300, .7 + r() * .4]); }
  forest(g, pts, 7);
  // montañas en la niebla
  const mm = mat(0x3a4656, { roughness: 1 }); const MR = RNG(12); for (let i = 0; i < 14; i++) { const a = -PI * .9 + i / 13 * PI * 1.8, d = 900 + MR() * 300; const m = new THREE.Mesh(new THREE.ConeGeometry(260 + MR() * 200, 380 + MR() * 260, 6), mm); m.position.set(Math.sin(a) * d, 120, -Math.cos(a) * d * .9 - 200); m.userData.noShadow = true; g.add(m); }
  S.g = shade(g); return S; }

// ---------- casa de Mats por dentro (X): Flur a lo largo de z, puerta de casa en z = +20 (mirando a -z), puerta trasera en z = -46 ----------
// escalera pegada a la pared oeste (sube de z = +6 a z = -22, y = 0 → 13), Abstellkammer bajo la escalera (puerta en x = -3, z ∈ [-12, -16]),
// salón al este (x de 8 a 40, z de 0 a -40) con ventana a la calle en z = 0 y sofá.
export function haus(scene, X) {
  const g = G(scene, X); const R = {}; const wl = mat(0xffffff, { map: rep(wallT('#efe2c4', '#e2d2b0'), 4, 2), roughness: .9 }), wain = mat(0xf6f2ea, { roughness: .55 }), wood = mat(0xffffff, { map: rep(plankT('#7a4a2a', '#6a3e22'), 6, 12), roughness: .5 });
  const HH = 24, LH = 15.5; box(90, .4, 80, wood, 0, g, 16, -.2, -13); box(17.2, .4, 80, mat(0xf4efe6, { roughness: .9 }), 0, g, 0, HH + .2, -13); box(33, .4, 41, mat(0xf4efe6, { roughness: .9 }), 24, g, 24.4, LH + .2, -20);
  // paredes del Flur
  box(.4, HH, 66, wl, 0, g, -8.2, HH / 2, -13); box(.4, HH, 20, wl, 0, g, 8.2, HH / 2, 10); box(.4, HH, 6, wl, 0, g, 8.2, HH / 2, -43); box(.4, HH - 10.5, 25, wl, 0, g, 8.2, 10.5 + (HH - 10.5) / 2, -17.5);
  // pared delantera con hueco para la puerta y las dos ventanitas (x de -3,6 a 6,6, y < 9,9)
  box(4.8, HH, .4, wl, 0, g, -6, HH / 2, 20.2); box(1.8, HH, .4, wl, 0, g, 7.5, HH / 2, 20.2); box(10.2, HH - 9.9, .4, wl, 0, g, 1.5, 9.9 + (HH - 9.9) / 2, 20.2); for (const x of [-1.95, 4.95]) box(.9, 9.9, .4, wl, 0, g, x, 4.95, 20.2); for (const x of [-3.15, 6.15]) { box(.9, 2.6, .4, wl, 0, g, x, 1.3, 20.2); box(.9, .5, .4, wl, 0, g, x, 9.65, 20.2); }
  // pared trasera con hueco para la puerta trasera (x de -2,8 a 2,8, y < 9,9)
  box(5.6, HH, .4, wl, 0, g, -5.6, HH / 2, -46.2); box(5.6, HH, .4, wl, 0, g, 5.6, HH / 2, -46.2); box(5.6, HH - 9.9, .4, wl, 0, g, 0, 9.9 + (HH - 9.9) / 2, -46.2);
  box(16, .4, 8, mat(0x6a5a4a, { roughness: .9 }), 0, g, 0, -.2, -50.4);
  // fuera: suelo del porche, barandilla y farol (se ven al abrir la puerta)
  box(16, .4, 8, mat(0xffffff, { map: rep(plankT('#9a7450', '#8a6646'), 2, 1), roughness: .75 }), 0, g, 1.5, -.2, 24.4); for (let k = 0; k < 9; k++) box(.2, 3, .2, mat(0xf2eee4), 0, g, -6 + k * 1.8, 1.5, 27.8); box(16, .3, .3, mat(0xf2eee4), 0, g, 1.5, 3, 27.8);
  const OL = new THREE.PointLight(0xffb060, 60, 14, 1.6); OL.position.set(5.6, 8, 22.5); g.add(OL); sphere(.5, glowM(0xffc070, 3), g, 5.6, 9, 20.6, 10, 8);
  for (const [x, z, l, rz] of [[-7.9, -13, 66, 0], [7.9, 10, 20, 0], [7.9, -43, 6, 0]]) box(.3, 4.4, l, wain, .02, g, x, 2.2, z);
  box(4.6, 4.4, .3, wain, .02, g, -6, 2.2, 19.95); box(1.6, 4.4, .3, wain, .02, g, 7.5, 2.2, 19.95); box(16.4, 4.4, .3, wain, .02, g, 0, 2.2, -45.95);
  for (const [x, z, l] of [[-7.8, -13, 66], [7.8, 10, 20]]) { box(.3, .5, l, mat(0x6a3e22), 0, g, x, .25, z); box(.35, .3, l, wain, 0, g, x, 4.5, z); }
  // alfombra de pasillo
  const run = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 56), mat(0xffffff, { map: runnerT(), roughness: 1 })); run.rotation.x = -PI / 2; run.position.set(1.5, .03, -14); run.receiveShadow = true; g.add(run);
  // puerta de casa (pivote bisagra; mirando a -z): azul oscuro con mirilla, pomo, cerrojo y cadena; dos ventanitas laterales de cristal esmerilado
  const DW = 5, DH = 9.6, dz = 19.9, dx = 1.5; const dp = G(g, dx + DW / 2, 0, dz); dp.rotation.y = PI; const door = box(DW, DH, .45, mat(0x1e3460, { roughness: .4 }), .05, dp, DW / 2, DH / 2, 0);
  for (const [px, py, ph] of [[1.4, 7, 3], [3.6, 7, 3], [1.4, 2.6, 3.4], [3.6, 2.6, 3.4]]) box(1.6, ph, .2, mat(0x24407a, { roughness: .3 }), .05, dp, px, py, .28);
  const knob = sphere(.32, mat(0xd9a531, { metalness: .9, roughness: .22 }), dp, DW - .6, 4.6, .45, 12, 8); const lockT = box(.5, .9, .25, mat(0xd9a531, { metalness: .9, roughness: .22 }), .1, dp, DW - .6, 5.8, .35); const thumb = box(.5, .16, .3, mat(0xc8962a, { metalness: .9, roughness: .25 }), .05, dp, DW - .6, 5.8, .55);
  const peep = cyl(.17, .17, .35, mat(0xd9a531, { metalness: .9, roughness: .15 }), 14, dp, DW / 2, 7.6, .35); peep.rotation.x = PI / 2; sphere(.1, mat(0x0a0a10, { roughness: .05, metalness: .6 }), dp, DW / 2, 7.6, .55, 10, 8);
  const chain = []; for (let k = 0; k < 6; k++) { const l = new THREE.Mesh(new THREE.TorusGeometry(.12, .035, 5, 10), mat(0xc8c8d0, { metalness: .9, roughness: .3 })); l.position.set(DW - 1.1 - k * .22, 6.6 - Math.sin(k / 5 * PI) * .35, .5); l.rotation.y = k % 2 ? PI / 2 : 0; dp.add(l); chain.push(l); }
  const trimM = mat(0xf6f2ea, { roughness: .55 }); box(DW + 1.2, .6, .5, trimM, .05, g, dx, DH + .3, dz - .1); for (const s of [-1, 1]) box(.6, DH, .5, trimM, .05, g, dx + s * (DW / 2 + .3), DH / 2, dz - .1);
  const frost = new THREE.MeshStandardMaterial({ color: 0x3a4a6a, emissive: 0x0a1428, roughness: .3, transparent: true, opacity: .8, depthWrite: false }); R.side = []; for (const s of [-1, 1]) { const sl = box(1.4, 7, .2, frost, 0, g, dx + s * (DW / 2 + 1.6), 5, dz + .05); R.side.push(sl); const sx = dx + s * (DW / 2 + 1.6); for (const q of [-1, 1]) { box(.25, 7.4, .3, trimM, .02, g, sx + q * .82, 5, dz - .05); box(1.9, .25, .3, trimM, .02, g, sx, 5 + q * 3.6, dz - .05); } }
  R.front = { door: dp, knob, lock: lockT, thumb, peep, chain, DW, DH, pos: V(X + dx, 0, dz), peepW: () => { dp.updateMatrixWorld(true); return peep.getWorldPosition(V(0, 0, 0)); } };
  // fuera de la puerta principal (se ve al abrir / por las ventanitas): porche nocturno
  const outside = textPlane(16, 14, 256, 224, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#0a1428'); s.addColorStop(1, '#1a2438'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#3a2e24'; c.fillRect(0, h * .78, w, h); const g2 = c.createRadialGradient(w * .7, h * .25, 0, w * .7, h * .25, 60); g2.addColorStop(0, 'rgba(255,190,110,.9)'); g2.addColorStop(1, 'rgba(255,190,110,0)'); c.fillStyle = g2; c.fillRect(0, 0, w, h); }, .8);
  outside.position.set(dx, 7, dz + 10); outside.scale.set(1.6, 1.4, 1); outside.rotation.y = PI; g.add(outside);
  // puerta trasera (blanca con 4 cristales; noche detrás) en z = -46
  const bp = G(g, 0 - DW / 2, 0, -45.9); const bm = mat(0xe8e4da, { roughness: .5 }); box(DW, 4.3, .45, bm, .05, bp, DW / 2, 2.15, 0); box(DW, 1.0, .45, bm, .05, bp, DW / 2, 9.1, 0); for (const x of [.35, DW - .35]) box(.7, 4.4, .45, bm, .02, bp, x, 6.5, 0); box(.4, 4.4, .45, bm, .02, bp, DW / 2, 6.5, 0); box(DW - 1.4, .3, .45, bm, .02, bp, DW / 2, 6.5, 0); R.backGlass = []; for (const [px, py] of [[1.5, 7.6], [3.5, 7.6], [1.5, 5.4], [3.5, 5.4]]) { const gl = box(1.6, 1.9, .5, new THREE.MeshStandardMaterial({ color: 0x0a1020, roughness: .3, metalness: 0, transparent: true, opacity: .12, depthWrite: false }), 0, bp, px, py, 0); gl.userData.noShadow = true; gl.castShadow = false; R.backGlass.push(gl); }
  box(2.6, 3, .2, mat(0xdcd8ce), .05, bp, DW / 2, 2.2, .28); sphere(.3, mat(0xb8b8c0, { metalness: .9, roughness: .25 }), bp, DW - .6, 4.6, .4, 12, 8);
  box(DW + 1.2, .6, .5, trimM, .05, g, 0, DH + .3, -45.8); for (const s of [-1, 1]) box(.6, DH, .5, trimM, .05, g, s * (DW / 2 + .3), DH / 2, -45.8);
  const backOut = textPlane(10, 12, 128, 160, (c, w, h) => { c.fillStyle = '#060a14'; c.fillRect(0, 0, w, h); c.fillStyle = '#0e1a10'; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(i * 16, h * .7); c.lineTo(i * 16 + 8, h * .25); c.lineTo(i * 16 + 16, h * .7); c.fill(); } }); backOut.position.set(0, 6, -53); backOut.scale.set(1.8, 1.4, 1); const BL = new THREE.PointLight(0x9ab0ff, 30, 12, 1.6); BL.position.set(2, 9, -49); g.add(BL); g.add(backOut);
  R.back = { door: bp, pos: V(X, 0, -45.9) }; R.backShadow = box(3, 4, .1, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }), 0, g, 0, 7.4, -46.7); // silueta tras el cristal
  // escalera (oeste): 13 peldaños de z = +6 a z = -22 subiendo a 13; barandilla blanca con pasamanos de madera; rellano arriba
  const stair = mat(0xffffff, { map: rep(plankT('#8a5a34', '#7a4e2a'), 1, 1), roughness: .5 });
  const N = 13; for (let i = 0; i < N; i++) { const z = 6 - i * 2.15, y = (i + 1) * 1.0; box(6, .35, 2.3, stair, .03, g, -5, y, z); box(6, y, .2, wain, 0, g, -5, y / 2, z + 1.1); }
  const ang = Math.atan2(13, 28); const string = box(.5, 3.6, 31, wain, .02, g, -1.8, 6.5, -8); string.rotation.x = ang; string.position.set(-1.8, 5.6, -8.2);
  const rail = box(.5, .5, 32, mat(0x5a341c, { roughness: .4 }), .2, g, -1.8, 10.4, -8.2); rail.rotation.x = ang; for (let i = 0; i < 14; i++) { const z = 6 - i * 2.1, y = (i + 1) * .98; box(.2, 3.8, .2, wain, 0, g, -1.8, y + 2.2, z); }
  cyl(.4, .4, 5, wain, 8, g, -1.8, 2.5, 7.5); sphere(.55, mat(0x5a341c), g, -1.8, 5.2, 7.5, 10, 8);
  box(16.4, .5, 22, wood, 0, g, 0, 13, -35); box(.3, 4, 22, wain, 0, g, -1.8 + 3.8, 15, -24) ; R.landing = V(X - 4, 13.2, -25);
  // Abstellkammer bajo la escalera: pared lateral con puerta pequeña (en x = -2, mira a +x)
  box(.4, 8.6, 16, wl, 0, g, -2, 4.3, -14); const kp = G(g, -1.75, 0, -11.6); kp.rotation.y = PI / 2; box(4, 7.4, .3, mat(0xe8e2d4, { roughness: .5 }), .05, kp, -2, 3.7, 0); sphere(.25, mat(0xd9a531, { metalness: .9, roughness: .25 }), kp, -3.4, 3.8, .25, 10, 8);
  for (const s of [-1, 1]) box(.4, 7.6, .4, trimM, .02, g, -1.7, 3.8, -13.6 + s * 2.2); R.kammer = { door: kp, pos: V(X - 1.7, 0, -13.6) };
  // percheros con abrigos, zapatero, mesita con cuenco de llaves, reloj de pared, fotos de familia, lámparas colgantes
  for (let k = 0; k < 3; k++) { box(.3, .3, .8, mat(0xd9a531, { metalness: .8 }), .05, g, 7.7, 9.4, 14 - k * 2.6); box(.9, 4.2, 2.2, mat([0x7a2a2a, 0x2a4a6a, 0xb8a070][k], { roughness: .9 }), .4, g, 7.3, 7.2, 14 - k * 2.6); }
  box(1.6, 2, 6, mat(0x6a3e22, { roughness: .6 }), .05, g, 7.2, 1, 9); for (let k = 0; k < 4; k++) box(1, .7, 1.6, mat([0xd8323a, 0x1a1a1a, 0xf4f4f4, 0x2a6ad8][k]), .2, g, 7.2, 2.35, 7 + k * 1.4);
  box(2.2, .3, 4.5, mat(0x5a341c, { roughness: .4 }), .05, g, 7, 4.4, 1); for (const s of [-1, 1]) box(.3, 4.3, .3, mat(0x5a341c), 0, g, 7, 2.15, 1 + s * 1.9); cyl(.9, .5, .5, mat(0x3a7a9a, { roughness: .3 }), 14, g, 7, 4.8, 1.5);
  const CLK = G(g, 7.85, 11, -3); CLK.rotation.y = -PI / 2; cyl(1.5, 1.5, .25, mat(0xfdfaf2), 28, CLK, 0, 0, 0).rotation.x = PI / 2; const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, .14, 8, 28), mat(0x5a341c)); CLK.add(ring);
  for (let k = 0; k < 12; k++) box(.1, k % 3 ? .2 : .4, .05, mat(0x1a1a1a), 0, CLK, Math.sin(k / 12 * 6.283) * 1.25, Math.cos(k / 12 * 6.283) * 1.25, .16);
  const hh = G(CLK, 0, 0, .2), mh = G(CLK, 0, 0, .25); box(.14, .8, .05, mat(0x1a1a1a), 0, hh, 0, .35, 0); box(.1, 1.2, .05, mat(0x1a1a1a), 0, mh, 0, .55, 0); R.clock = { set(h, m) { hh.rotation.z = -((h % 12) + m / 60) / 12 * 6.283; mh.rotation.z = -m / 60 * 6.283; } };
  R.photos = []; for (let k = 0; k < 3; k++) { const p = textPlane(2.2, 1.7, 110, 85, (c, w, h) => { c.fillStyle = '#3a2a1a'; c.fillRect(0, 0, w, h); c.fillStyle = ['#bcd4e0', '#e0d0b0', '#c8e0c0'][k]; c.fillRect(6, 6, w - 12, h - 12); for (let i = 0; i < 3 + (k % 2); i++) { c.fillStyle = ['#e8b890', '#d8a070', '#f0c8a0'][i % 3]; c.beginPath(); c.arc(22 + i * 22, 38, 9, 0, 7); c.fill(); c.fillStyle = ['#2a6ad8', '#d8323a', '#3a9a4a', '#f2b33d'][i]; c.fillRect(13 + i * 22, 48, 18, 26); } }); p.position.set(-7.95, 8.6 + (k % 2) * 1.2, -30 - k * 3); p.rotation.y = PI / 2; g.add(p); }
  R.lamps = []; for (const z of [12, -6, -30]) { cyl(.05, .05, 8, mat(0x1a1a1a), 4, g, 0, HH - 4, z); const sh_ = cyl(.5, 1.3, 1.2, mat(0x1a1a1a, { metalness: .5, roughness: .4, side: THREE.DoubleSide }), 14, g, 0, HH - 8.6, z); const b = sphere(.45, glowM(0xffe0a8, 2.6), g, 0, HH - 9, z, 10, 8); R.lamps.push(b); }
  // salón
  const lr = mat(0xffffff, { map: rep(wallT('#d8c8a8', '#ccbc9c'), 4, 2), roughness: .9 }); box(32, LH, .4, lr, 0, g, 24, LH / 2, -40.2); box(.4, LH, 40, lr, 0, g, 40.2, LH / 2, -20); box(32, LH, .4, lr, 0, g, 24, LH / 2, .2);
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(16, 11), mat(0xffffff, { map: canvasTex(128, 96, (c, w, h) => { c.fillStyle = '#8a2a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8c880'; c.lineWidth = 4; c.strokeRect(8, 8, w - 16, h - 16); c.fillStyle = '#2a3a6a'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(20 + i * 17, h / 2); c.lineTo(28 + i * 17, h / 2 - 12); c.lineTo(36 + i * 17, h / 2); c.lineTo(28 + i * 17, h / 2 + 12); c.fill(); } }), roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(24, .04, -20); g.add(rug);
  const sofa = G(g, 24, 0, -33); const sm = mat(0x6a7a4a, { roughness: .95 }); box(15, 2.8, 5.4, sm, .6, sofa, 0, 1.9, 0); box(15, 4.4, 1.6, sm, .6, sofa, 0, 4, -2.2); for (const s of [-1, 1]) box(1.6, 3.8, 5.4, sm, .6, sofa, s * 7.2, 2.4, 0); for (const s of [-1, 1]) box(6.6, .9, 4.4, mat(0x7a8a5a, { roughness: .95 }), .4, sofa, s * 3.4, 3.6, .3); box(2.4, 2, .8, mat(0xd8a03a), .4, sofa, -5, 4.6, -1); R.sofa = V(X + 24, 3.4, -32.6);
  box(9, .4, 4.5, mat(0x5a341c, { roughness: .35 }), .05, g, 24, 2.4, -24); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.3, 2.3, .3, mat(0x5a341c), 0, g, 24 + sx * 4, 1.15, -24 + sz * 1.9);
  const fl = G(g, 35, 0, -36); cyl(.15, .15, 9, mat(0x1a1a1a), 6, fl, 0, 4.5, 0); const fls = cyl(1, 1.6, 1.8, mat(0xf4e4c4, { emissive: 0xffc878, emissiveIntensity: .8, side: THREE.DoubleSide }), 14, fl, 0, 9.4, 0); R.floorLamp = fls;
  const lw = fenster(g, 22, 7.6, .0, 9, 7, false, 0xf6f2ea, null, '#c84a3a'); lw.rotation.y = PI; R.lrWin = V(X + 22, 7.6, 0); const nightM = lw.material, dayM = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: canvasTex(64, 96, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#9ac8f0'); s.addColorStop(.6, '#dcecf8'); s.addColorStop(.62, '#4a6a3a'); s.addColorStop(1, '#3a5a2a'); c.fillStyle = s; c.fillRect(0, 0, w, h); }), emissiveIntensity: 1.1 }); R.setDay = d => { lw.material = d ? dayM : nightM; };
  box(.4, 6, 9, mat(0x1a1a1a, { roughness: .3 }), .1, g, 39.8, 7.4, -18); const tv = box(.1, 5.2, 8.2, mat(0x0a0a10, { roughness: .1, metalness: .4 }), 0, g, 39.55, 7.4, -18);
  // la luz de los faros que barre la pared del fondo del salón
  R.sweep = new THREE.Mesh(new THREE.PlaneGeometry(9, 7), new THREE.MeshBasicMaterial({ map: canvasTex(128, 96, (c, w, h) => { const g2 = c.createLinearGradient(0, 0, w, 0); g2.addColorStop(0, 'rgba(255,245,220,0)'); g2.addColorStop(.5, 'rgba(255,245,220,.95)'); g2.addColorStop(1, 'rgba(255,245,220,0)'); c.fillStyle = g2; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(w / 2 - 3, 0, 6, h); c.fillRect(0, h / 2 - 3, w, 6); }), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  R.sweep.position.set(24, 8, -39.9); R.sweep.userData.noShadow = true; g.add(R.sweep);
  // luz cálida del techo (siempre encendida dentro del grupo)
  const L1 = new THREE.PointLight(0xffd8a0, 240, 46, 1.7); L1.position.set(0, 12, 0); g.add(L1); const L2 = new THREE.PointLight(0xffd8a0, 200, 46, 1.7); L2.position.set(0, 12, -28); g.add(L2); const L3 = new THREE.PointLight(0xffc888, 160, 40, 1.7); L3.position.set(30, 10, -30); g.add(L3);
  R.L = [L1, L2, L3]; R.g = shade(g); return R; }

// ---------- la Abstellkammer por dentro (X): 12 × 9, techo inclinado (la escalera), zapatos, abrigos, aspiradora; rendija de luz bajo la puerta ----------
export function kammer(scene, X) { const g = G(scene, X); const wl = mat(0xffffff, { map: rep(wallT('#c8baa0', '#bcae94'), 2, 1), roughness: .95 });
  box(14, .4, 18, mat(0xffffff, { map: rep(plankT('#5a3a22', '#4e321c'), 2, 3), roughness: .7 }), 0, g, 0, -.2, 0); box(.4, 12, 18, wl, 0, g, -7, 6, 0); box(14, 12, .4, wl, 0, g, 0, 6, -9); box(.4, 12, 18, wl, 0, g, 7, 6, 0); box(14, 12, .4, wl, 0, g, 0, 6, 9.1);
  box(14, .4, 18, mat(0xffffff, { map: rep(plankT('#8a6a4a', '#7a5e40'), 2, 2), roughness: .8 }), 0, g, 0, 11, 0); const ceil = box(14, .5, 12, mat(0xffffff, { map: rep(plankT('#8a6a4a', '#7a5e40'), 2, 2), roughness: .8 }), 0, g, 0, 8.4, -3); ceil.rotation.x = -.42;
  const dp = G(g, -2, 0, 8.85); box(4, 7.2, .3, mat(0xd8d2c4), .05, dp, 2, 3.6, 0); sphere(.24, mat(0xd9a531, { metalness: .9 }), dp, 3.4, 3.6, -.25, 10, 8);
  const slit = box(4, .12, .1, glowM(0xffd8a0, 4), 0, g, 0, .06, 8.7); const sh = halo(g, 0, .2, 8.2, 6, GLOW, .5, true);
  for (let k = 0; k < 12; k++) { const sx = -5 + (k % 5) * 2.4, sz = -7 + Math.floor(k / 5) * 2.4; const sb = box(1.1, .8, 2, mat([0xd8323a, 0x1a1a1a, 0xf4f4f4, 0x2a6ad8, 0x8a5a2a][k % 5], { roughness: .7 }), .3, g, sx, .4, sz); sb.rotation.y = k * .7; box(1.15, .2, 2.05, mat(0xf4f4f4), .05, g, sx, .1, sz).rotation.y = k * .7; }
  cyl(.06, .06, 12, mat(0x9a9aa0, { metalness: .8 }), 6, g, 0, 8.6, -8.4).rotation.z = PI / 2; for (let k = 0; k < 4; k++) box(2.4, 5, 1, mat([0x7a2a2a, 0x2a4a6a, 0x4a5a2a, 0x8a7a5a][k], { roughness: 1 }), .4, g, -4.5 + k * 3, 6, -8.2);
  cyl(.8, .9, 2.4, mat(0xd8323a, { roughness: .4 }), 12, g, 5, 1.2, 2); cyl(.08, .08, 7, mat(0x1a1a1a), 6, g, 5.4, 4, 1.6).rotation.z = -.2; box(3, 3, 3, mat(0xb08a5a, { roughness: .9 }), .1, g, 5, 1.5, -6);
  const L = new THREE.PointLight(0x8aa0d8, 18, 24, 1.6); L.position.set(0, 4, 5); g.add(L);
  return { g: shade(g), door: dp, slit, slitHalo: sh, L }; }

// ---------- oficina de Mama (X): paredes verde azulado, escritorios con ordenadores, fotocopiadora, ventanal nocturno ----------
export function buero(scene, X) { const g = G(scene, X); const wl = mat(0x2e5a5c, { roughness: .9 });
  box(60, .4, 50, mat(0x5a4636, { roughness: .6 }), 0, g, 0, -.2, 0); box(60, .4, 50, mat(0x1a2426, { roughness: .9 }), 0, g, 0, 16.2, 0); box(60, 16, .4, wl, 0, g, 0, 8, -25); box(.4, 16, 50, wl, 0, g, -30, 8, 0); box(.4, 16, 50, wl, 0, g, 30, 8, 0); box(60, 16, .4, wl, 0, g, 0, 8, 25); for (let k = 0; k < 4; k++) { const f = textPlane(3, 2.2, 150, 110, (c, w, h) => { c.fillStyle = ['#d8e8f0', '#f4e8c8', '#e8d8e8', '#d8f0d8'][k]; c.fillRect(0, 0, w, h); c.fillStyle = '#2a3a5a'; for (let i = 0; i < 5; i++) c.fillRect(14, 16 + i * 18, 60 + (i * 37 % 60), 8); }); f.position.set(-20 + k * 13, 9, 24.7); f.rotation.y = Math.PI; g.add(f); }
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#7a2a2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a3a5a'; c.beginPath(); c.moveTo(32, 6); c.lineTo(58, 32); c.lineTo(32, 58); c.lineTo(6, 32); c.fill(); c.fillStyle = '#d8b880'; c.fillRect(28, 28, 8, 8); }, true), 8, 6), roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.y = .03; g.add(rug);
  for (let k = 0; k < 4; k++) { const p = box(12, .2, 2.4, glowM(0xeaf4ff, 2.2), 0, g, -15 + (k % 2) * 30, 16, -10 + Math.floor(k / 2) * 20); p.userData.noShadow = true; }
  const city = textPlane(56, 11, 560, 110, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#060a18'); s.addColorStop(1, '#1a2438'); c.fillStyle = s; c.fillRect(0, 0, w, h); const r = RNG(4); for (let i = 0; i < 40; i++) { const bw = 10 + r() * 20, bh = 20 + r() * 70, x = r() * w; c.fillStyle = '#0a0e18'; c.fillRect(x, h - bh, bw, bh); for (let y = h - bh + 4; y < h - 4; y += 8) for (let xx = x + 3; xx < x + bw - 3; xx += 6) if (r() > .55) { c.fillStyle = r() > .5 ? '#ffd890' : '#f0b860'; c.fillRect(xx, y, 3, 4); } } }, .9);
  city.position.set(0, 9.5, -24.7); g.add(city); for (let k = 0; k < 8; k++) box(.4, 11, .4, mat(0x1a1a1a), 0, g, -28 + k * 8, 9.5, -24.6); box(58, .5, .6, mat(0x1a1a1a), 0, g, 0, 4, -24.6);
  const desks = [], screens = [];
  const dk = (x, z, ry = 0) => { const d = G(g, x, 0, z); d.rotation.y = ry; box(10, .5, 5, mat(0x6a4a30, { roughness: .45 }), .05, d, 0, 4.4, 0); box(9.6, 4.2, .3, mat(0x5a3e26), 0, d, 0, 2.2, -2.2); for (const s of [-1, 1]) box(.4, 4.2, 4.6, mat(0x5a3e26), 0, d, s * 4.7, 2.1, 0);
    box(4.4, 2.8, .3, mat(0x1a1a1a, { roughness: .3 }), .1, d, -1, 7, -1.4); const sc = box(4, 2.4, .1, glowM(0x8ab8e8, 1.3), 0, d, -1, 7, -1.22); screens.push(sc); box(.4, 1.6, .4, mat(0x1a1a1a), 0, d, -1, 5.4, -1.4); box(3.2, .2, 1.2, mat(0x2a2a2a), .05, d, -1, 4.75, .6);
    box(1.6, .5, 1, mat(0x1a1a1a), .1, d, 3, 4.9, -.8); box(.5, .3, 1.4, mat(0x1a1a1a), .1, d, 3.6, 5.3, -.8); cyl(.5, .4, 1.2, mat(0xf4f4f4), 10, d, -3.8, 5.2, -1);
    const ch = G(d, 0, 0, 4.4); cyl(.15, .15, 2.4, mat(0x1a1a1a), 6, ch, 0, 1.2, 0); box(3.6, .6, 3.4, mat(0x1a1a1a, { roughness: .6 }), .2, ch, 0, 2.7, 0); box(3.6, 4, .6, mat(0x1a1a1a, { roughness: .6 }), .2, ch, 0, 5, 1.6);
    desks.push(d); return d; };
  dk(0, 0); dk(-15, -8); dk(15, -8); dk(-15, 10); dk(15, 10);
  const cop = G(g, 22, 0, -18); box(6, 6, 5, mat(0xd8d8d0, { roughness: .5 }), .2, cop, 0, 3, 0); box(5, .3, 3, mat(0x2a2a2a), 0, cop, 0, 6.2, 0); box(1, .4, 1, glowM(0x5aff7a, 2), 0, cop, -2, 5.6, 2.55); const paper = box(3, .1, 3.6, mat(0xffffff, { roughness: .9 }), 0, cop, -3.2, 4.5, .2);
  for (let k = 0; k < 3; k++) box(4, 12, 4, mat(0x8a8e94, { metalness: .3, roughness: .5 }), .05, g, -27, 6, -18 + k * 5);
  const plant = G(g, 26, 0, 18); cyl(1.4, 1.1, 2.6, mat(0xd8d0c0), 12, plant, 0, 1.3, 0); for (let k = 0; k < 8; k++) { const l = sphere(1.2, mat(0x3a7a3a), plant, Math.sin(k) * 1.2, 4 + k * .5, Math.cos(k) * 1.2, 8, 6); l.scale.set(.5, 1.2, .5); }
  const L = new THREE.PointLight(0xeaf4ff, 300, 70, 1.6); L.position.set(0, 14, 0); g.add(L);
  return { g: shade(g), desks, screens, copier: cop, paper, L }; }

// ---------- puerto de Hamburgo (X): agua, grúas de contenedores, contenedores de colores, letrero ----------
export function hafen(scene, X) { const g = G(scene, X); box(200, .4, 60, mat(0x6a6a6e, { roughness: .9 }), 0, g, 0, -.2, 10);
  const wat = new THREE.Mesh(new THREE.PlaneGeometry(400, 300), mat(0x2a4a5a, { roughness: .1, metalness: .4 })); wat.rotation.x = -PI / 2; wat.position.set(0, -1.5, -170); g.add(wat);
  const cols = [0xd8323a, 0x2a6ad8, 0x3a9a4a, 0xf2b33d, 0xe86a1a, 0x8a8a90]; const r = RNG(9);
  for (let i = 0; i < 40; i++) { const x = -70 + (i % 10) * 14, z = -10 - Math.floor(i / 10) * 7, y = Math.floor(r() * 3); for (let k = 0; k <= y; k++) box(13, 6, 6, mat(cols[(i + k) % 6], { roughness: .6, metalness: .2 }), .1, g, x, 3 + k * 6, z); }
  for (let k = 0; k < 3; k++) { const c = G(g, -40 + k * 40, 0, -34); const m = mat(0xd8323a, { roughness: .5 }); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(1.4, 50, 1.4, m, .1, c, sx * 8, 25, sz * 6); box(18, 3, 16, m, .1, c, 0, 50, 0); box(3, 3, 80, m, .1, c, 0, 54, -10); box(5, 5, 6, mat(0xf4f4f4), .1, c, 0, 46, 4); }
  const sign = textPlane(28, 6, 560, 120, (c, w, h) => { c.fillStyle = '#1a3a6a'; c.fillRect(0, 0, w, h); txt(c, 'HAFEN HAMBURG', w / 2, h / 2 + 4, 80, '#ffffff'); }); sign.position.set(30, 16, -2); g.add(sign); box(1, 16, 1, mat(0x3a3a3a), 0, g, 18, 8, -2.6); box(1, 16, 1, mat(0x3a3a3a), 0, g, 42, 8, -2.6);
  return { g: shade(g) }; }

// ---------- atrezo ----------
export function kuscheltier(parent) { const g = G(parent); const m = mat(0xf4e8d8, { roughness: 1 }), p = mat(0xf4b8c8, { roughness: 1 }); sphere(.9, m, g, 0, 0, 0, 12, 10).scale.set(1, 1.15, .9); sphere(.75, m, g, 0, 1.3, 0, 12, 10); for (const s of [-1, 1]) { const e = sphere(.28, m, g, s * .3, 2.5, 0, 8, 6); e.scale.set(.8, 2.6, .6); const ei = sphere(.16, p, g, s * .3, 2.5, .1, 8, 6); ei.scale.set(.7, 2.4, .5); sphere(.09, mat(0x1a1a1a), g, s * .25, 1.45, .62, 6, 4); } sphere(.1, p, g, 0, 1.25, .72, 6, 4); for (const s of [-1, 1]) sphere(.32, m, g, s * .7, .1, .3, 8, 6); return g; }
export function torte(parent, n = 5, label = '') { const g = G(parent); cyl(2.2, 2.2, 1.6, mat(0xfff4f0, { roughness: .7 }), 24, g, 0, .8, 0); cyl(2.25, 2.25, .3, mat(0xf48ab0, { roughness: .6 }), 24, g, 0, 1.55, 0); cyl(2.6, 2.6, .15, mat(0xf4f4f4, { metalness: .4 }), 24, g, 0, 0, 0); const fl = [];
  for (let k = 0; k < n; k++) { const a = k / n * 6.283; cyl(.08, .08, .9, mat([0x2a6ad8, 0xf2b33d, 0xd8323a][k % 3]), 6, g, Math.cos(a) * 1.3, 2.1, Math.sin(a) * 1.3); const f = sphere(.13, glowM(0xffb040, 3), g, Math.cos(a) * 1.3, 2.7, Math.sin(a) * 1.3, 6, 6); f.scale.y = 1.6; fl.push(f); } g.userData.flames = fl; return g; }
export function handyP(parent) { const g = G(parent); box(1, 2, .14, mat(0x1a1a22, { roughness: .2, metalness: .5 }), .12, g, 0, 0, 0); const sc = textPlane(.9, 1.85, 180, 370, () => {}, 1.1); sc.position.z = .08; g.add(sc);
  g.userData.draw = f => { const cv = sc.material.map.image, c = cv.getContext('2d'); f(c, cv.width, cv.height); sc.material.map.needsUpdate = true; }; g.userData.sc = sc; return g; }
export function maske(parent) { // máscara de goma de la Rektorin: cara rosada y flácida, moño gris
  const g = G(parent); const sk = mat(0xf0b8a8, { roughness: .55 }); const h = box(1.62, 1.5, 1.5, sk, .45, g, 0, .78, .06); h.scale.set(1, 1, 1);
  const f = textPlane(1.5, 1.3, 200, 170, (c, w, hh) => { c.fillStyle = '#f0b8a8'; c.fillRect(0, 0, w, hh); c.fillStyle = '#1a1010'; for (const x of [62, 138]) { c.beginPath(); c.ellipse(x, 66, 15, 10, 0, 0, 7); c.fill(); } c.strokeStyle = '#8a4a4a'; c.lineWidth = 6; c.beginPath(); c.moveTo(60, 125); c.quadraticCurveTo(100, 140, 140, 125); c.stroke(); c.strokeStyle = '#c88a7a'; c.lineWidth = 4; for (const x of [48, 152]) { c.beginPath(); c.moveTo(x, 90); c.quadraticCurveTo(x + (x < 100 ? 14 : -14), 120, x, 150); c.stroke(); } c.strokeStyle = '#4a3a3a'; c.lineWidth = 5; for (const x of [62, 138]) { c.beginPath(); c.moveTo(x - 22, 44); c.lineTo(x + 18, 40); c.stroke(); } c.fillStyle = '#c87a6a'; c.beginPath(); c.ellipse(100, 98, 10, 16, 0, 0, 7); c.fill(); });
  f.position.set(0, .7, .82); g.add(f); const hair = mat(0x9a9aa0, { roughness: .8 }); const cap = new THREE.Mesh(new THREE.SphereGeometry(.85, 18, 10, 0, 6.283, 0, 1.3), hair); cap.position.y = 1.25; cap.scale.set(1, .6, 1); g.add(cap); sphere(.42, hair, g, 0, 1.75, -.35, 12, 8); return g; }
export function plakat(parent, w, h, draw) { const p = textPlane(w, h, Math.round(w * 40), Math.round(h * 40), draw); parent.add(p); return p; }
