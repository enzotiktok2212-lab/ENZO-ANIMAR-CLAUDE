// SEIL — mundo propio: la pradera plana sin fin, los pueblos bajos (nada más alto que una rodilla), la cuerda de ropa anudada
// que barre el mundo (gira alrededor de un eje a RA de altura entre las dos torres), los anillos naranjas que dibuja en el cielo,
// la torre de personas (todas las que «se adelantaron») con su manivela del tamaño de una casa, el pueblo de pescadores,
// la nieve del invierno, los pedestales y trompetillas de los Rufer, caracoles, mantas, sopa, boda y quirófano bajitos.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, lerp, clamp } from './engine.js';
import { txt } from './props.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1.6, o = {}) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5, ...o });
const rep = (t, a, b) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); return t; };
const noise = (w, h, base, cols, n, r0 = 1, r1 = 3, seed = 3) => canvasTex(w, h, (c, W, H) => { c.fillStyle = base; c.fillRect(0, 0, W, H); const r = RNG(seed); for (let i = 0; i < n; i++) { c.fillStyle = cols[i % cols.length]; c.globalAlpha = .35 + r() * .5; const s = r0 + r() * (r1 - r0); c.fillRect(r() * W, r() * H, s, s * (.6 + r())); } c.globalAlpha = 1; }, true);

// ---------- geometría del mundo ----------
// La cuerda da vueltas alrededor del eje X (a RA de altura, z = 0) dibujando una elipse muy ancha: semieje vertical B(x) y horizontal A(x).
// En |x| < XF la parte de abajo va casi pegada al suelo en todo el mundo habitado (|z| < 400): por eso todos saltan.
// Hacia las manivelas (±XT) la elipse se cierra hasta un círculo de radio CR.
export const RA = 200, XF = 820, XT = 1500, CR = 20, TX = 1576, ROPE_R = 1.25, AZ = 3600;
const sx = x => { const k = clamp((Math.abs(x) - XF) / (XT - XF)); return k * k * (3 - 2 * k); };
const sa = x => { const k = clamp((Math.abs(x) - XF) / 220); return k * k * (3 - 2 * k); };
export const Bx = x => lerp(RA - ROPE_R, CR, sx(x)), Ax = x => lerp(AZ, Bx(x), sa(x));
// fase φ: 0 = abajo (pasa por z = 0); al crecer φ la parte de abajo avanza hacia −z; π = arriba del todo (y = 2·RA)
export const ropePt = (x, phi) => new THREE.Vector3(x, RA - Bx(x) * Math.cos(phi), -Ax(x) * Math.sin(phi));
// fase en la que la parte de abajo pasa por z (zona habitada)
export const phiAt = z => Math.asin(clamp(-z / AZ, -1, 1));
// altura de la cuerda (centro) sobre el suelo en z, cuando pasa por abajo
export const ropeY = z => RA - (RA - ROPE_R) * Math.sqrt(Math.max(0, 1 - (z / AZ) ** 2));
export const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
export const rAt = x => Bx(x);

// ---------- texturas ----------
const MEADOW = () => rep(canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#5f9a3a'; c.fillRect(0, 0, w, h); const r = RNG(7);
  for (let i = 0; i < 9000; i++) { c.fillStyle = ['#4f8a2e', '#6eaa44', '#7ab84c', '#568f34', '#8ab854', '#3f7a28'][i % 6]; c.globalAlpha = .5; c.fillRect(r() * w, r() * h, 2 + r() * 3, 4 + r() * 6); }
  c.globalAlpha = 1; for (let i = 0; i < 520; i++) { c.fillStyle = ['#ffffff', '#ffd23f', '#ff6a8a', '#c8a0ff', '#ff3a3a', '#9ad0ff'][i % 6]; c.beginPath(); c.arc(r() * w, r() * h, 1.6 + r() * 1.8, 0, 7); c.fill(); } }, true), 260, 260);
const SNOWT = () => rep(canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#eef3fa'; c.fillRect(0, 0, w, h); const r = RNG(9); for (let i = 0; i < 2600; i++) { c.fillStyle = ['#dfe8f4', '#ffffff', '#d4dff0', '#f6f9ff'][i % 4]; c.globalAlpha = .7; c.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 3); } }, true), 120, 120);
const DIRT = () => rep(noise(128, 128, '#9a7a52', ['#8a6a44', '#aa8a60', '#7a5c3a', '#b89a70'], 1600, 1, 4, 5), 2, 40);
// tela de la cuerda: franjas de prendas distintas (cuadros, rayas, punto, vaquero, lunares) con nudos oscuros entre ellas
const FAB = ['#d8323a', '#2a6ad8', '#ffd23f', '#3ab86a', '#f2f2f2', '#ff8ad0', '#6a3ad8', '#ff8a1a', '#1aa0a0', '#8a5a32', '#3a4a8a', '#e86a9a', '#c8b48a', '#2a2a30'];
function fabric(c, x, y, w, h, i) { const a = FAB[i % FAB.length], b = FAB[(i * 5 + 3) % FAB.length]; c.fillStyle = a; c.fillRect(x, y, w, h); const k = i % 6;
  if (k === 0) { c.fillStyle = b; for (let j = 0; j < h; j += 8) c.fillRect(x, y + j, w, 4); }
  else if (k === 1) { c.fillStyle = b; c.globalAlpha = .55; for (let j = 0; j < w; j += 10) c.fillRect(x + j, y, 5, h); for (let j = 0; j < h; j += 10) c.fillRect(x, y + j, w, 5); c.globalAlpha = 1; }
  else if (k === 2) { c.fillStyle = b; for (let j = 0; j < w; j += 9) for (let q = 0; q < h; q += 9) { c.beginPath(); c.arc(x + j + 4, y + q + 4, 2, 0, 7); c.fill(); } }
  else if (k === 3) { c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1; for (let j = -h; j < w; j += 4) { c.beginPath(); c.moveTo(x + j, y); c.lineTo(x + j + h, y + h); c.stroke(); } }
  else if (k === 4) { c.fillStyle = b; for (let j = 0; j < w; j += 6) { c.beginPath(); c.moveTo(x + j, y); c.lineTo(x + j + 3, y + h / 2); c.lineTo(x + j, y + h); c.lineTo(x + j + 2, y + h); c.lineTo(x + j + 5, y + h / 2); c.lineTo(x + j + 2, y); c.fill(); } }
  else { c.fillStyle = 'rgba(255,255,255,.25)'; for (let j = 0; j < h; j += 16) c.fillRect(x, y + j, w, 2); } }
export const ROPET = () => canvasTex(1024, 64, (c, w, h) => { let x = 0, i = 0; const r = RNG(31); while (x < w) { const s = 26 + Math.floor(r() * 50); fabric(c, x, 0, s, h, i++); c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(x + s - 4, 0, 4, h); c.fillStyle = 'rgba(255,255,255,.15)'; c.fillRect(x, 6, s - 4, 3); x += s; }
  c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, h - 10, w, 10); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(0, 12, w, 6); }, true);

// ---------- pradera ----------
export function wiese(scene) { const g = G(scene);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(12000, 12000), mat(0xffffff, { map: MEADOW(), roughness: .95 })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; g.add(gr);
  // nieve del invierno, a partir de x = 860 (más allá ya no vive nadie)
  const sn = new THREE.Mesh(new THREE.PlaneGeometry(1600, 3000), mat(0xffffff, { map: SNOWT(), roughness: .8 })); sn.rotation.x = -Math.PI / 2; sn.position.set(1760, .06, 0); sn.receiveShadow = true; g.add(sn);
  // borde de nieve irregular
  const r = RNG(12); for (let i = 0; i < 70; i++) { const s = sphere(6 + r() * 10, mat(0xf2f6fc, { roughness: .85 }), g, 960 + r() * 30, -4 + r() * 2, -1500 + i * 43, 10, 6); s.scale.y = .35; s.receiveShadow = true; }
  return g; }
// hierba alta con flores: InstancedMesh de matas cruzadas que se recoloca alrededor de la cámara (GRASS.at(x, z))
export function hierba(scene, n = 7000, R = 150) {
  const tex = canvasTex(128, 128, (c, w, h) => { const r = RNG(4); for (let i = 0; i < 46; i++) { const x = 6 + r() * (w - 12), hh = 50 + r() * 74; c.strokeStyle = ['#4f8a2e', '#6eaa44', '#7ab84c', '#3f7a28', '#8ab854'][i % 5]; c.lineWidth = 3 + r() * 2; c.beginPath(); c.moveTo(x, h); c.quadraticCurveTo(x + (r() - .5) * 20, h - hh * .6, x + (r() - .5) * 30, h - hh); c.stroke(); }
    for (let i = 0; i < 7; i++) { c.fillStyle = ['#ffffff', '#ffd23f', '#ff6a8a', '#c8a0ff', '#ff3a3a'][i % 5]; const x = 10 + r() * (w - 20), y = 20 + r() * 50; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + Math.cos(k * 1.26) * 4, y + Math.sin(k * 1.26) * 4, 3.2, 0, 7); c.fill(); } c.fillStyle = '#ffcf1a'; c.beginPath(); c.arc(x, y, 2.4, 0, 7); c.fill(); } });
  const m = new THREE.MeshStandardMaterial({ map: tex, alphaTest: .5, side: THREE.DoubleSide, roughness: .9 });
  const pg = new THREE.PlaneGeometry(2.2, 2.2); pg.translate(0, 1.1, 0); const p2 = pg.clone(); p2.rotateY(Math.PI / 2); const geo = mergeGeos([pg, p2]);
  const im = new THREE.InstancedMesh(geo, m, n); im.receiveShadow = true; scene.add(im); im.frustumCulled = false;
  const r = RNG(77), base = Array.from({ length: n }, () => [(r() - .5) * 2 * R, (r() - .5) * 2 * R, r() * 6.28, .6 + r() * .7]);
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), Sv = new THREE.Vector3(), P = new THREE.Vector3();
  let skip = () => false;
  im.userData.at = (cx, cz, avoid = null, snow = 0) => { skip = avoid || (() => false); const q = 20, ox = Math.round(cx / q) * q, oz = Math.round(cz / q) * q;
    base.forEach(([x, z, a, s], i) => { const X = ox + x, Z = oz + z; const hide = skip(X, Z) || (snow && X > 940); E.set(0, a, 0); Q.setFromEuler(E); Sv.setScalar(hide ? .0001 : s); P.set(X, hide ? -50 : 0, Z); M4.compose(P, Q, Sv); im.setMatrixAt(i, M4); });
    im.instanceMatrix.needsUpdate = true; im.visible = true; };
  return im; }
function mergeGeos(gs) { const pos = [], uv = [], nor = [], idx = []; let off = 0; for (const g of gs) { const p = g.attributes.position, u = g.attributes.uv, n = g.attributes.normal; for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); uv.push(u.getX(i), u.getY(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); } const ix = g.index.array; for (const v of ix) idx.push(v + off); off += p.count; }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); out.setIndex(idx); return out; }
// camino de tierra entre (x0, z0) y (x1, z1)
export function weg(parent, x0, z0, x1, z1, w = 5) { const L = Math.hypot(x1 - x0, z1 - z0); const t = DIRT(); t.repeat.set(1, L / 12); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, L), mat(0xffffff, { map: t, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 })); m.rotation.x = -Math.PI / 2; m.rotation.z = -Math.atan2(x1 - x0, z1 - z0) + Math.PI; m.position.set((x0 + x1) / 2, .04, (z0 + z1) / 2); m.receiveShadow = true; parent.add(m); return m; }

// ---------- pueblos bajos ----------
const RUGC = [['#c8323a', '#ffd23f', '#2a6ad8'], ['#2a8a6a', '#f4e8c8', '#d8323a'], ['#6a3ad8', '#ff8ad0', '#ffd23f'], ['#d86a1a', '#2a2a30', '#f4f4f4'], ['#1aa0a0', '#ffd23f', '#d8323a'], ['#8a2a4a', '#f4c878', '#3a6a3a']];
const rugT = i => canvasTex(128, 128, (c, w, h) => { const [a, b, d] = RUGC[i % RUGC.length]; c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; c.fillRect(10, 10, w - 20, h - 20); c.fillStyle = a; c.fillRect(18, 18, w - 36, h - 36); c.fillStyle = d;
  for (let k = 0; k < 4; k++) { c.save(); c.translate(w / 2, h / 2); c.rotate(k * Math.PI / 2); c.beginPath(); c.moveTo(0, -34); c.lineTo(14, -14); c.lineTo(0, 6); c.lineTo(-14, -14); c.fill(); c.restore(); } c.fillStyle = b; for (let k = 0; k < 12; k++) c.fillRect(4 + k * 10, 2, 4, 4); });
// una parcela (casa sin techo, todo a la altura de la rodilla): muro de piedra, alfombra, cama baja, mesita con cuencos, valla, faroles
export function parcela(parent, x, z, i = 0, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry; const r = RNG(i * 7 + 3);
  const st = mat(0xffffff, { map: rep(noise(64, 64, '#b8aa90', ['#a89a80', '#c8baa0', '#988a70'], 500, 2, 6, i + 1), 2, 1), roughness: .9 }), wd = mat(0x9a6a3e, { roughness: .7 }), wd2 = mat(0x7a4e2a, { roughness: .7 });
  const S = 13; for (const [px, pz, w, d] of [[0, -S / 2, S, .8], [-S / 2, 0, .8, S], [S / 2, 0, .8, S], [-S / 4 - 1.2, S / 2, S / 2 - 2.4, .8], [S / 4 + 1.2, S / 2, S / 2 - 2.4, .8]]) box(w, 1.3, d, st, .12, g, px, .65, pz);
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(S - 2, S - 2), mat(0xffffff, { map: rugT(i), roughness: .95 })); rug.rotation.x = -Math.PI / 2; rug.position.y = .05; rug.receiveShadow = true; g.add(rug);
  // cama baja: colchón, almohada, manta de rayas
  const bx = -3, bz = -2.6; box(4.2, .5, 6.2, wd2, .1, g, bx, .25, bz); box(4, .55, 6, mat(0xf4f0e4, { roughness: .9 }), .2, g, bx, .7, bz); box(3.2, .45, 1.4, mat(0xffffff, { roughness: 1 }), .2, g, bx, 1.1, bz - 2.1);
  box(4.1, .2, 3.6, mat([0x2a6ad8, 0xd8323a, 0x3ab86a, 0xffd23f, 0x6a3ad8][i % 5], { roughness: 1 }), .08, g, bx, 1.05, bz + 1);
  // mesita con cuencos y tetera
  const tx = 3, tz = 2; box(3.4, .25, 2.4, wd, .08, g, tx, 1.0, tz); for (const [a, b] of [[-1.4, -1], [1.4, -1], [-1.4, 1], [1.4, 1]]) box(.25, .9, .25, wd2, .04, g, tx + a, .45, tz + b * .9);
  for (let k = 0; k < 3; k++) { const b = cyl(.42, .3, .3, mat([0xf4f0e4, 0x2a6ad8, 0xd86a1a][k], { roughness: .4 }), 12, g, tx - .9 + k * .9, 1.28, tz - .3 + (k % 2) * .5); }
  const tp = sphere(.45, mat(0xc8323a, { roughness: .3 }), g, tx + .8, 1.5, tz + .5, 12, 10); tp.scale.y = .8;
  for (let k = 0; k < 2; k++) { box(1.2, .25, 1.2, mat([0xd8a03a, 0x3a8a6a][k], { roughness: 1 }), .1, g, tx + (k ? 1.8 : -1.8), .14, tz + 2); }
  // jarrones y faroles bajos
  for (let k = 0; k < 2; k++) { const v = cyl(.35, .5, 1, mat(0xc86a3a, { roughness: .6 }), 10, g, -5 + k * 10, .5, 5); }
  for (const [lx, lz] of [[-5.6, -5.6], [5.6, -5.6]]) { cyl(.12, .14, 1.6, mat(0x2a2a30), 6, g, lx, .8, lz); const l = box(.6, .6, .6, glowM(0xffcf7a, .8), .08, g, lx, 1.8, lz); }
  // ropa tendida bajita (a la altura de la rodilla)
  if (i % 3 === 1) { for (const s of [-1, 1]) cyl(.08, .08, 1.6, wd2, 5, g, s * 4, .8, -4.2); cyl(.03, .03, 8, mat(0xf4f4f4), 4, g, 0, 1.5, -4.2).rotation.z = Math.PI / 2; for (let k = 0; k < 4; k++) box(1.2, .9, .05, mat(FAB[(i + k * 3) % FAB.length]), .02, g, -2.6 + k * 1.7, 1.0, -4.2); }
  return g; }
// valla baja de madera
export function zaun(parent, x0, z0, x1, z1) { const g = G(parent); const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(2, Math.round(L / 1.6)); const wd = mat(0xb8885a, { roughness: .8 });
  for (let k = 0; k <= n; k++) { const t = k / n; box(.3, 1.7, .3, wd, .05, g, lerp(x0, x1, t), .85, lerp(z0, z1, t)); } for (const y of [.6, 1.3]) { const b = box(L, .2, .14, wd, .03, g, (x0 + x1) / 2, y, (z0 + z1) / 2); b.rotation.y = -Math.atan2(z1 - z0, x1 - x0); } return g; }
// pedestal de piedra del Rufer
export function sockel(parent, x, z, h = 2.2) { const g = G(parent, x, 0, z); const st = mat(0xffffff, { map: rep(noise(64, 64, '#a8a090', ['#98907e', '#b8b0a0', '#888070'], 400, 2, 5, 11), 1, 1), roughness: .9 }); cyl(1.9, 2.2, h, st, 10, g, 0, h / 2, 0); cyl(2.0, 2.0, .25, mat(0x8a8272, { roughness: .9 }), 10, g, 0, h, 0); g.userData.top = h + .1; return g; }
// pueblo: parcelas en rejilla, caminos y pedestales
export function dorf(parent, cx, cz, seed = 1, nx = 5, nz = 4, sp = 17) { const g = G(parent, cx, 0, cz); const r = RNG(seed); const plots = [], peds = [];
  for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) { const x = (a - (nx - 1) / 2) * sp, z = (b - (nz - 1) / 2) * sp; if (Math.abs(x) < 1) continue; parcela(g, x, z, seed * 13 + a * 5 + b, [0, Math.PI / 2, Math.PI, -Math.PI / 2][(a + b + seed) % 4]); plots.push([cx + x, cz + z]); }
  weg(g, 0, -nz * sp / 2 - 20, 0, nz * sp / 2 + 20, 4.6); weg(g, -nx * sp / 2 - 20, 0, nx * sp / 2 + 20, 0, 4.6);
  for (const [px, pz] of [[sp / 2, sp / 2], [-sp / 2, -sp / 2], [sp * 1.5, -sp / 2], [-sp * 1.5, sp / 2]]) { sockel(g, px, pz); peds.push([cx + px, cz + pz]); }
  zaun(g, -nx * sp / 2 - 4, -nz * sp / 2 - 4, nx * sp / 2 + 4, -nz * sp / 2 - 4);
  return { g, plots, peds }; }

// ---------- la cuerda ----------
// tubo propio que se recalcula en cada fotograma (la forma cambia con φ). userData.set(φ, x0, x1): solo el tramo [x0, x1]
export function seil(scene) { const NX = 1500, NR = 10, xs = []; for (let i = 0; i <= NX; i++) { const u = i / NX; xs.push(-XT + 2 * XT * u); }
  const pos = new Float32Array((NX + 1) * NR * 3), nor = new Float32Array((NX + 1) * NR * 3), uv = new Float32Array((NX + 1) * NR * 2), idx = [];
  for (let i = 0; i <= NX; i++) for (let j = 0; j < NR; j++) { uv[(i * NR + j) * 2] = i / NX * 75; uv[(i * NR + j) * 2 + 1] = j / (NR - 1); }
  for (let i = 0; i < NX; i++) for (let j = 0; j < NR; j++) { const a = i * NR + j, b = i * NR + (j + 1) % NR, c = (i + 1) * NR + j, d = (i + 1) * NR + (j + 1) % NR; idx.push(a, b, c, b, d, c); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx);
  const t = ROPET(); t.repeat.set(1, 1); const m = new THREE.Mesh(geo, mat(0xffffff, { map: t, roughness: .85 })); m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; scene.add(m);
  const C = [], Tn = new THREE.Vector3(), N = new THREE.Vector3(), Bn = new THREE.Vector3(), up = new THREE.Vector3(1, 0, 0);
  m.userData.set = (phi, R = ROPE_R) => { for (let i = 0; i <= NX; i++) C[i] = ropePt(xs[i], phi);
    for (let i = 0; i <= NX; i++) { const p = C[Math.max(0, i - 1)], q = C[Math.min(NX, i + 1)]; Tn.subVectors(q, p).normalize(); N.set(0, Math.cos(phi), Math.sin(phi)); N.addScaledVector(Tn, -N.dot(Tn)).normalize(); Bn.crossVectors(Tn, N);
      for (let j = 0; j < NR; j++) { const a = j / NR * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), k = (i * NR + j) * 3; const nx = N.x * ca + Bn.x * sa, ny = N.y * ca + Bn.y * sa, nz = N.z * ca + Bn.z * sa;
        pos[k] = C[i].x + nx * R; pos[k + 1] = C[i].y + ny * R; pos[k + 2] = C[i].z + nz * R; nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz; } }
    geo.attributes.position.needsUpdate = true; geo.attributes.normal.needsUpdate = true; geo.computeBoundingSphere(); m.visible = true; };
  return m; }
// estela de la cuerda en el cielo: elipses naranjas (la trayectoria de algunos puntos cerca de las dos manivelas)
export function anillos(scene) { const g = G(scene); const m = new THREE.MeshBasicMaterial({ color: 0xff8a3a, transparent: true, opacity: .6, toneMapped: false, depthWrite: false });
  for (const s of [-1, 1]) for (let k = 0; k < 10; k++) { const x = s * (XT - 20 - k * k * 4.6); const A = Ax(x), B = Bx(x); const pts = []; for (let a = 0; a <= 64; a++) { const t = a / 64 * Math.PI * 2; pts.push(new THREE.Vector3(x, RA - B * Math.cos(t), -A * Math.sin(t))); }
    const tb = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, .7 + B * .005, 5, true), m); g.add(tb); }
  g.traverse(o => { o.castShadow = false; }); return g; }
// trozo de cuerda en primer plano (60 de largo, a lo largo de x) con prendas de verdad: mangas con puño, cinturones con hebilla,
// bufandas con flecos, cordones con lazada y etiquetas con nombres bordados
export function seilNah(scene) { const g = G(scene); const L = 70, R = 2.2;
  const t = ROPET(); t.repeat.set(5, 1); const core = cyl(R, R, L, mat(0xffffff, { map: t, roughness: .9 }), 18, g, 0, 0, 0); core.rotation.z = Math.PI / 2;
  const r = RNG(17); const NAMES = ['PAUL', 'MIA', 'OMA ROSI', 'BEN', 'GRETA', 'JONAS', 'ELLA', 'OPA KARL', 'LINA', 'TOM'];
  for (let k = 0; k < 14; k++) { const x = -L / 2 + 3 + k * 4.9; const kind = k % 5, col = mat(new THREE.Color(FAB[(k * 3) % FAB.length]), { roughness: .9 });
    // nudo
    const kn = new THREE.Mesh(new THREE.TorusGeometry(R * .9, .7, 8, 18), mat(new THREE.Color(FAB[(k * 7 + 2) % FAB.length]).multiplyScalar(.7), { roughness: 1 })); kn.rotation.y = Math.PI / 2; kn.position.x = x + 2.2; g.add(kn);
    if (kind === 0) { const s = cyl(R * .7, R * .9, 3.2, col, 12, g, x, R * .6, R * .5); s.rotation.z = 1.2; s.rotation.x = -.4; const cf = cyl(R * .72, R * .72, .5, mat(0xffffff), 12, s, 0, 1.6, 0); for (let b = 0; b < 2; b++) sphere(.18, mat(0xd8c070, { metalness: .6, roughness: .3 }), s, .3, 1.6, R * .7 - b * .3, 8, 6); }
    else if (kind === 1) { const bl = new THREE.Mesh(new THREE.TorusGeometry(R + .15, .28, 6, 24, 5.4), mat(0x4a2a14, { roughness: .5 })); bl.rotation.y = Math.PI / 2; bl.position.x = x; g.add(bl); const bk = box(.9, 1.1, .3, mat(0xd8c070, { metalness: .8, roughness: .25 }), .08, g, x, 0, R + .35); }
    else if (kind === 2) { const sc = box(1.6, .3, 5, col, .1, g, x, -R - .2, R * .6); sc.rotation.x = .5; for (let f = 0; f < 6; f++) box(.12, .6, .12, col, 0, g, x - .7 + f * .28, -R - 1.2, R * 1.8); }
    else if (kind === 3) { const lc = mat(0xffffff, { roughness: .8 }); for (const s of [-1, 1]) { const lp = new THREE.Mesh(new THREE.TorusGeometry(.6, .1, 6, 14), lc); lp.position.set(x + s * .5, R + .5, .3); lp.rotation.y = s * .5; g.add(lp); } cyl(.1, .1, 1.6, lc, 5, g, x + .3, R + .1, .9).rotation.x = 1; }
    else { const s = cyl(R * .6, R * .8, 2.6, col, 12, g, x, -R * .4, R * .8); s.rotation.z = -1.4; }
    if (k % 2 === 0) { const nm = NAMES[(k / 2) % NAMES.length]; const lb = textPlane(2.6, .9, 260, 90, (c, w, h) => { c.fillStyle = '#fbf6e8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8323a'; c.lineWidth = 6; c.setLineDash([10, 6]); c.strokeRect(6, 6, w - 12, h - 12); c.font = 'italic 700 50px Cap, cursive'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2a4a9a'; c.fillText(nm, w / 2, h / 2 + 3); });
      lb.position.set(x - 1, .2, R + .05); g.add(lb); lb.material.side = THREE.DoubleSide; lb.userData.name = nm; } }
  return shade(g); }

// ---------- la torre de personas ----------
// figura de bloques mínima para la torre (cuerpo, brazos en cruz agarrando las muñecas de los vecinos, piernas): 3 InstancedMesh
function figGeos() { const tor = new THREE.BoxGeometry(2, 2, 1); tor.translate(0, 3, 0); const aL = new THREE.BoxGeometry(1.9, .9, .9); aL.translate(-1.9, 3.6, 0); const aR = aL.clone(); aR.translate(3.8, 0, 0);
  const head = new THREE.BoxGeometry(1.25, 1.25, 1.25); head.translate(0, 4.7, 0); const hL = new THREE.BoxGeometry(.6, .6, .6); hL.translate(-3.1, 3.6, 0); const hR = hL.clone(); hR.translate(6.2, 0, 0);
  const lL = new THREE.BoxGeometry(.95, 2, .95); lL.translate(-.5, 1, 0); const lR = lL.clone(); lR.translate(1, 0, 0);
  // cara solo delante: el resto de caras de la cabeza va a la zona lisa de la textura
  const uv = head.attributes.uv; for (let i = 0; i < uv.count; i++) { if (i >= 16 && i < 20) uv.setXY(i, uv.getX(i) * .5, uv.getY(i)); else uv.setXY(i, .8, .5); }
  return { shirt: mergeGeos([tor, aL, aR]), skin: mergeGeos([head, hL, hR]), legs: mergeGeos([lL, lR]) }; }
const FACE_T = () => canvasTex(128, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a1a'; c.beginPath(); c.ellipse(20, 26, 4, 7, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(44, 26, 4, 7, 0, 0, 7); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; c.beginPath(); c.arc(32, 50, 8, 3.6, 5.8); c.stroke(); });
const SKINS = [0xf2c4a0, 0xd8a07a, 0x8a5a3a, 0xf4cfb6, 0xc68b5e, 0xeab08a, 0x6a4028, 0xf0b088];
const SHIRTS = [0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0xff8ad0, 0xf4f4f4, 0x6a3ad8, 0xff8a3a, 0x1aa0a0, 0x8a8e96, 0xe86a9a, 0x3a8a4a, 0x2a2a30, 0xc8b48a];
const PANTS = [0x2a3a5a, 0x1a1a24, 0xc8b48a, 0x4a6aa8, 0x6a6a72, 0x3a4a3a, 0x5a3a2a];
// la forma: radio por altura (ancha abajo, se estrecha y se curva arriba como un cuerno)
export const TH = 470, tR = y => lerp(64, 22, Math.pow(clamp(y / TH), .8)), tBend = y => Math.pow(clamp(y / TH), 3) * 70;
export function turm(scene, x, face = -1) { const g = G(scene, x, 0, 0); const body = G(g); const r = RNG(Math.round(x) + 5); const gs = figGeos();
  const mats = { shirt: mat(0xffffff, { roughness: .8 }), skin: mat(0xffffff, { map: FACE_T(), roughness: .7 }), legs: mat(0xffffff, { roughness: .8 }) };
  const list = []; for (let y = 0; y < TH; y += 5.6) { const R = tR(y), n = Math.floor(2 * Math.PI * R / 3.9); for (let i = 0; i < n; i++) list.push([y, (i + (Math.round(y / 5.6) % 2) * .5) / n * Math.PI * 2, R]); }
  const IM = {}; for (const k of ['shirt', 'skin', 'legs']) { IM[k] = new THREE.InstancedMesh(gs[k], mats[k], list.length); IM[k].castShadow = false; IM[k].receiveShadow = true; IM[k].frustumCulled = false; body.add(IM[k]); }
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), Sv = new THREE.Vector3(1, 1, 1), C = new THREE.Color();
  list.forEach(([y, a, R], i) => { const bx = tBend(y) * face; P.set(Math.cos(a) * R + bx, y, Math.sin(a) * R); E.set(0, -a + Math.PI / 2, 0); Q.setFromEuler(E); M4.compose(P, Q, Sv);
    for (const k in IM) IM[k].setMatrixAt(i, M4); IM.shirt.setColorAt(i, C.setHex(SHIRTS[Math.floor(r() * SHIRTS.length)])); IM.skin.setColorAt(i, C.setHex(SKINS[Math.floor(r() * SKINS.length)])); IM.legs.setColorAt(i, C.setHex(PANTS[Math.floor(r() * PANTS.length)])); });
  for (const k in IM) { IM[k].instanceMatrix.needsUpdate = true; if (IM[k].instanceColor) IM[k].instanceColor.needsUpdate = true; }
  // núcleo oscuro para que no se vea a través
  const core = new THREE.Mesh(new THREE.CylinderGeometry(20, 60, TH * .9, 24), mat(0x2a2024, { roughness: 1 })); core.position.y = TH * .45; body.add(core);
  // la manivela «so groß wie ein Haus»: eje desde la torre a la altura RA, buje de madera y brazo; el puño (radio CR) lleva la cuerda
  const kr = G(g, face * (tR(RA) + 6), RA, 0); const wd = mat(0x7a4e2a, { roughness: .7 }), wd2 = mat(0x5a3a1e, { roughness: .8 }), ir = mat(0x4a4a52, { metalness: .7, roughness: .35 });
  const ax = cyl(4, 4, 28, wd, 16, kr, face * 4, 0, 0); ax.rotation.z = Math.PI / 2; const hub = G(kr, face * (x > 0 ? 18 : 18), 0, 0);
  const wh = cyl(13, 13, 5, wd, 24, hub, 0, 0, 0); wh.rotation.z = Math.PI / 2; for (let k = 0; k < 8; k++) { const sp = box(2, 24, 2.2, wd2, .3, hub, face * 2.8, 0, 0); sp.rotation.x = k * Math.PI / 8; }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(13, 1.2, 8, 32), ir); ring.rotation.y = Math.PI / 2; ring.position.x = face * 2.6; hub.add(ring);
  const arm = box(4, CR + 6, 4, wd, .5, hub, face * 5, -CR / 2, 0); const grip = cyl(2.4, 2.4, 10, ir, 12, hub, face * 9, -CR, 0); grip.rotation.z = Math.PI / 2;
  g.userData.crank = hub; g.userData.body = body;
  // anim: φ gira la manivela, el cuerpo se inclina a izquierda/derecha
  g.userData.anim = (phi, lean = 1) => { hub.rotation.x = phi; body.rotation.z = Math.sin(phi) * .022 * lean; body.position.y = Math.abs(Math.cos(phi)) * .8 * lean; };
  return g; }
// punto de la superficie de la torre (cara que mira a la cámara: ángulo a; a = π mira a −x) a la altura y
export const turmPt = (x, y, a, face = -1, out = 0) => { const R = tR(y) + out; return new THREE.Vector3(x + Math.cos(a) * R + tBend(y) * face, y, Math.sin(a) * R); };

// ---------- pueblo de pescadores (lago, barcas, redes bajas) ----------
export function fischerdorf(parent, cx, cz) { const g = G(parent, cx, 0, cz);
  const wt = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#3a8ab8'); gr.addColorStop(1, '#2a6a98'); c.fillStyle = gr; c.fillRect(0, 0, w, h); const r = RNG(3); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; for (let i = 0; i < 160; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 6, y - 3, x + 14, y); c.stroke(); } }, true); wt.repeat.set(20, 20);
  const lake = new THREE.Mesh(new THREE.PlaneGeometry(400, 220), mat(0xffffff, { map: wt, roughness: .08, metalness: .35 })); lake.rotation.x = -Math.PI / 2; lake.position.set(0, .12, 150); lake.receiveShadow = true; g.add(lake);
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(400, 16), mat(0xd8c49a, { roughness: 1 })); sand.rotation.x = -Math.PI / 2; sand.position.set(0, .09, 36); g.add(sand);
  for (let k = 0; k < 7; k++) { const x = -60 + k * 20; parcela(g, x, 4 + (k % 2) * 3, 40 + k, k % 2 ? 0 : Math.PI); }
  // barcas varadas
  for (let k = 0; k < 4; k++) { const b = G(g, -40 + k * 26, 0, 40); b.rotation.y = .3 * (k % 2 ? 1 : -1); const hm = mat([0xd8323a, 0x2a6ad8, 0xf4f0e4, 0x2a8a6a][k], { roughness: .6 }); box(4, 1.2, 10, hm, .5, b, 0, .6, 0); box(3.4, .3, 9, mat(0x8a5a32), .1, b, 0, 1.0, 0); const p = cyl(.5, .1, 2, hm, 8, b, 0, .8, 5.6); p.rotation.x = Math.PI / 2; }
  // redes tendidas en palos bajos
  const nt = canvasTex(64, 64, (c, w, h) => { c.strokeStyle = '#e8dcc0'; c.lineWidth = 2; for (let i = 0; i <= w; i += 8) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }, true); nt.repeat.set(3, 1);
  for (let k = 0; k < 3; k++) { const x = -30 + k * 30; for (const s of [-1, 1]) cyl(.15, .15, 2.4, mat(0x6a4a2a), 6, g, x + s * 5, 1.2, 26); const n = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.8), new THREE.MeshStandardMaterial({ map: nt, transparent: true, alphaTest: .3, side: THREE.DoubleSide })); n.position.set(x, 1.4, 26); g.add(n); for (let f = 0; f < 3; f++) { const fl = sphere(.3, mat(0xff8a1a), g, x - 3 + f * 3, 2.4, 26, 8, 6); } }
  // cestas con peces
  for (let k = 0; k < 4; k++) { const b = cyl(1.2, 1, 1.2, mat(0xb8884a, { roughness: 1 }), 10, g, -50 + k * 32, .6, 18); for (let f = 0; f < 3; f++) { const fi = sphere(.4, mat(0x9ab8c8, { metalness: .5, roughness: .3 }), b, -.4 + f * .4, .8, 0, 8, 6); fi.scale.set(1, .5, 2); } }
  return shade(g); }

// ---------- atrezo ----------
// trompetilla de latón del Rufer (boquilla en el origen, abre hacia +z)
export function horn() { const g = new THREE.Group(); const br = mat(0xd8a838, { metalness: .85, roughness: .22, emissive: 0x3a2400, emissiveIntensity: .2 });
  const c = new THREE.Mesh(new THREE.CylinderGeometry(.95, .14, 2.6, 18, 1, true), br); c.material.side = THREE.DoubleSide; c.rotation.x = Math.PI / 2; c.position.z = 1.4; g.add(c);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.95, .09, 8, 24), br); rim.position.z = 2.7; g.add(rim); cyl(.12, .12, .6, br, 8, g, 0, 0, -.1).rotation.x = Math.PI / 2;
  const cord = new THREE.Mesh(new THREE.TorusGeometry(.6, .06, 6, 16), mat(0xd8323a)); cord.position.set(0, -.6, 1); cord.rotation.y = Math.PI / 2; g.add(cord); return g; }
// caracol: concha en espiral y cuerpo
export function schnecke(i = 0) { const g = new THREE.Group(); const sh = mat([0xc88a4a, 0xb8763a, 0xd8a060][i % 3], { roughness: .5 }), bd = mat(0xb8a890, { roughness: .4 });
  const pts = []; for (let k = 0; k < 60; k++) { const a = k * .28, r = .9 - k * .013; pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r + 1.1, k * .004)); }
  const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, .32, 8), sh); g.add(t); const b = box(.8, .5, 2.6, bd, .25, g, 0, .25, .3); const h = sphere(.36, bd, g, 0, .6, 1.5, 10, 8);
  for (const s of [-1, 1]) { const a = cyl(.05, .05, .7, bd, 5, g, s * .16, 1.0, 1.6); a.rotation.z = s * -.3; sphere(.09, mat(0x1a1a1a), g, s * .26, 1.35, 1.6, 6, 4); }
  g.rotation.y = 0; shade(g); return g; }
// manta doblada (Decke)
export function decke(col = 0xd8323a) { const g = new THREE.Group(); for (let k = 0; k < 4; k++) box(2.6, .3, 1.8, mat([col, 0xf4f0e4][k % 2], { roughness: 1 }), .12, g, 0, .15 + k * .28, 0); return shade(g); }
// cuenco de sopa con cuchara
export function suppe() { const g = new THREE.Group(); const b = cyl(.8, .5, .6, mat(0xf4f0e4, { roughness: .3 }), 16, g, 0, 0, 0); const s = cyl(.72, .72, .05, mat(0xd8902a, { roughness: .2 }), 16, g, 0, .22, 0); const sp = box(.14, .05, 1.6, mat(0xc8c8d0, { metalness: .8, roughness: .2 }), .02, g, .4, .3, .2); sp.rotation.x = -.5; g.userData.soup = s; return g; }
// gotas (sopa, estornudo): partículas reutilizables
export function gotas(scene, n = 24, col = 0xd8902a) { const L = []; const m = mat(col, { roughness: .1, transparent: true, opacity: .9 }); for (let i = 0; i < n; i++) { const s = sphere(.14, m, scene, 0, 0, 0, 8, 6); s.visible = false; s.castShadow = false; L.push(s); } return L; }
// arco de flores bajito para la boda
export function bogen() { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.TorusGeometry(3.2, .25, 8, 24, Math.PI), mat(0xf4f0e4, { roughness: .6 })); t.position.y = .1; g.add(t); const r = RNG(8);
  for (let k = 0; k < 26; k++) { const a = k / 25 * Math.PI; sphere(.36, mat([0xff6a8a, 0xffffff, 0xffd23f, 0xff3a5a][k % 4], { roughness: .7 }), g, Math.cos(a) * 3.2, .1 + Math.sin(a) * 3.2, (r() - .5) * .3, 8, 6); } return shade(g); }
// mesa de operaciones bajita
export function opTisch() { const g = new THREE.Group(); box(6, .3, 2.4, mat(0xc8d8e0, { metalness: .6, roughness: .3 }), .1, g, 0, 1.0, 0); for (const [a, b] of [[-2.6, -1], [2.6, -1], [-2.6, 1], [2.6, 1]]) cyl(.1, .1, 1, mat(0x8a9aa4, { metalness: .7 }), 6, g, a, .5, b);
  box(5.6, .2, 2.2, mat(0x6ab8a8, { roughness: .9 }), .05, g, 0, 1.25, 0); const lamp = cyl(1.4, .6, .5, mat(0xe8eef2, { metalness: .4 }), 16, g, 0, 4.6, 0); const lg = cyl(1.2, 1.2, .05, glowM(0xffffff, 1.2), 16, g, 0, 4.33, 0); cyl(.1, .1, 3, mat(0x8a9aa4), 6, g, -3.6, 1.5, 0); box(3.8, .1, .1, mat(0x8a9aa4), 0, g, -1.8, 4.9, 0);
  const tray = box(2, .1, 1.2, mat(0xc8d0d8, { metalness: .7 }), .02, g, 4.2, 1.2, 0); for (let k = 0; k < 3; k++) box(.1, .05, 1, mat(0xe8e8f0, { metalness: .9, roughness: .1 }), 0, g, 3.6 + k * .5, 1.3, 0); return shade(g); }
// «Zzz» del que duerme
export function zzz() { const g = new THREE.Group(); for (let k = 0; k < 3; k++) { const p = textPlane(1 + k * .3, 1 + k * .3, 64, 64, (c, w, h) => { txt(c, 'Z', w / 2, h / 2, 54, '#ffffff', '#2a4a9a', 8); }); p.position.set(k * .7, k * 1.0, 0); g.add(p); } return g; }
// copos de nieve que caen (alrededor de c)
export function schnee(scene, n = 500) { const pos = new Float32Array(n * 3); const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const r = RNG(5), base = Array.from({ length: n }, () => [r(), r(), r(), r()]);
  const tex = canvasTex(32, 32, (c, w, h) => { const g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const p = new THREE.Points(geo, new THREE.PointsMaterial({ size: .5, map: tex, transparent: true, depthWrite: false })); scene.add(p); p.frustumCulled = false;
  p.userData.update = (T, c) => { base.forEach(([a, b, d, s], i) => { const y = 30 - ((T * (2 + s * 2) + d * 30) % 30); pos[i * 3] = c.x + (a - .5) * 60 + Math.sin(T + i) * .6; pos[i * 3 + 1] = c.y - 6 + y; pos[i * 3 + 2] = c.z + (b - .5) * 60; }); geo.attributes.position.needsUpdate = true; p.visible = true; };
  return p; }
// carro de mano (para los caracoles)
export function karren() { const g = new THREE.Group(); const wd = mat(0x9a6a3e, { roughness: .8 }); box(5, .4, 3.2, wd, .1, g, 0, 1.4, 0); for (const s of [-1, 1]) box(5, 1.2, .25, wd, .05, g, 0, 2.1, s * 1.5); for (const s of [-1, 1]) box(.25, 1.2, 3.2, wd, .05, g, s * 2.4, 2.1, 0);
  for (const s of [-1, 1]) { const w = cyl(1.1, 1.1, .3, mat(0x5a3a1e), 14, g, 0, 1.1, s * 1.8); w.rotation.x = Math.PI / 2; } for (const s of [-1, 1]) { const h = box(3, .2, .2, wd, .05, g, -3.6, 1.6, s * 1.2); } return shade(g); }
