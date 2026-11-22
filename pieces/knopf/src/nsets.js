// KNOPF — escenarios propios: Lindenthal, pueblo alpino (casas de colores con balcones de madera, frescos pintados,
// tejados a dos aguas con alero, iglesia de torre bulbosa, Maibaum, montañas nevadas y pinos), la casa del Opa
// (chalet con banco, leña y virutas), el colegio y su patio, el campo de fútbol con tribuna de madera, el hospital
// por fuera y la habitación con el monitor cardíaco.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree, bench, fountain } from './props.js';
import { glass } from './pech.js';
import { cobbleTex } from './diam.js';
import { goal, scoreboard } from './hsets.js';
import { bikeRack } from './asets.js';
export const FONT = 'Cap, sans-serif';
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const plane = (w, d, m, p, x, y, z) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); me.rotation.x = -Math.PI / 2; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
export const glowM = (col, k = 2) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .3 });
const grassT = (a = '#58b844') => noiseTex(a, ['#4aa83a', '#66c852', '#52b040', '#70d05a'], 2600, 3, 1);
const plankT = (a = '#7a4a26', b = '#5e3818') => canvasTex(128, 128, (c, w, h) => { const r = RNG(3); for (let x = 0; x < w; x += 16) { c.fillStyle = r() < .5 ? a : b; c.fillRect(x, 0, 16, h); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x, 0, 2, h); c.fillStyle = 'rgba(255,255,255,.06)'; for (let k = 0; k < 6; k++) c.fillRect(x + 4 + r() * 8, r() * h, 1, 20); } }, true);
const shingleT = (a = '#5a3a2e', b = '#43291f') => canvasTex(128, 128, (c, w, h) => { c.fillStyle = b; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 12) for (let x = (y / 12) % 2 ? -8 : 0; x < w; x += 16) { c.fillStyle = a; c.fillRect(x + 1, y + 1, 14, 10); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x + 1, y + 9, 14, 2); } }, true);
const stoneT = () => noiseTex('#a8a49a', ['#8e8a80', '#bcb8ae', '#98948a'], 1400, 6, 1);

// ---------- fachada pintada (Lüftlmalerei): ventana con marco pintado y frontón; ci = color ----------
const FAC = ['#f4dca0', '#f2b8a8', '#bfe0f0', '#d8ecc0', '#f6e6d0', '#e8c8e8', '#f8c890', '#c8e4d8'];
const SHUT = ['#2f6a3a', '#8a2a2a', '#2a4a7a', '#2f6a3a', '#6a3a1a'];
function facadeT(ci) { return canvasTex(160, 180, (c, w, h) => {
  c.fillStyle = FAC[ci % FAC.length]; c.fillRect(0, 0, w, h); const r = RNG(ci + 3); for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(${r() < .5 ? '0,0,0' : '255,255,255'},.05)`; c.fillRect(r() * w, r() * h, 3, 3); }
  // marco pintado y frontón
  const pc = ['#b8742a', '#5a7a9a', '#8a4a6a', '#4a8a5a'][ci % 4]; c.fillStyle = pc; c.fillRect(36, 30, 88, 122); c.beginPath(); c.moveTo(30, 34); c.lineTo(80, 8); c.lineTo(130, 34); c.fill();
  c.fillStyle = FAC[ci % FAC.length]; c.fillRect(42, 36, 76, 110); c.strokeStyle = pc; c.lineWidth = 3; c.beginPath(); c.arc(80, 24, 6, 0, 7); c.stroke();
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(80 + s * 46, 150); c.quadraticCurveTo(80 + s * 62, 160, 80 + s * 52, 172); c.stroke(); }
  // ventana
  c.fillStyle = '#ffffff'; c.fillRect(46, 40, 68, 102); const g = c.createLinearGradient(0, 44, 0, 138); g.addColorStop(0, '#bfe6ff'); g.addColorStop(.45, '#6a9ac8'); g.addColorStop(1, '#2a4a7a'); c.fillStyle = g; c.fillRect(52, 46, 56, 90);
  c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.moveTo(56, 130); c.lineTo(72, 50); c.lineTo(82, 50); c.lineTo(66, 130); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(77, 46, 6, 90); c.fillRect(52, 86, 56, 5);
  c.fillStyle = 'rgba(250,240,220,.9)'; c.fillRect(52, 46, 10, 90); c.fillRect(98, 46, 10, 90); }, true); }
// casa alpina: planta baja de piedra/estuco, pisos con ventanas pintadas, contraventanas, jardineras de geranios,
// balcón corrido de madera en el último piso y tejado a dos aguas con el hastial hacia la calle (alero grande)
export function alpHaus(parent, x, z, wid, floors, ci, rot = 0, o = {}) {
  const g = G(parent, x, 0, z); g.rotation.y = rot; const fh = 8, base = 7, h = base + floors * fh, d = 18, front = d / 2;
  const wood = ci % 3 === 1; const t = facadeT(ci); t.repeat.set(Math.max(1, Math.round(wid / 8)), floors);
  box(wid, base, d, mat(0xffffff, { map: rep(stoneT(), wid / 6, 1), roughness: .9 }), 0, g, 0, base / 2, 0);
  box(wid, h - base, d, mat(0xffffff, { map: t, roughness: .8 }), 0, g, 0, base + (h - base) / 2, 0);
  if (wood) box(wid + .1, fh, d + .1, mat(0xffffff, { map: rep(plankT(), wid / 3, 1), roughness: .8 }), 0, g, 0, h - fh / 2, 0);
  const nb = Math.max(1, Math.round(wid / 8)), bw = wid / nb;
  for (let f = 0; f < floors; f++) for (let i = 0; i < nb; i++) { const wx = -wid / 2 + bw * (i + .5), wy = base + f * fh + 4.6;
    if (wood && f === floors - 1) { box(4.2, 5, .3, glass(), .05, g, wx, wy, front + .1); box(4.6, .4, .5, mat(0xf4f0e8), .05, g, wx, wy + 2.6, front + .2); }
    const sc = mat(SHUT[(ci + i) % SHUT.length], { roughness: .7 }); for (const s of [-1, 1]) { const sh = box(1.7, 5.4, .25, sc, .05, g, wx + s * 3.1, wy, front + .2); for (let k = 0; k < 5; k++) box(1.5, .14, .1, mat(0x000000, { transparent: true, opacity: .18 }), 0, sh, 0, -2 + k * 1, .14); }
    if (!(wood && f === floors - 1)) { box(4.8, .7, 1.2, mat(0x6a3e1e, { roughness: .8 }), .12, g, wx, wy - 3.2, front + .6); for (let j = 0; j < 6; j++) { sphere(.42, mat([0xe8202a, 0xff5a7a, 0xe8202a][j % 3], { roughness: .7 }), g, wx - 1.9 + j * .76, wy - 2.6, front + .6 + (j % 2) * .25, 8, 6); sphere(.36, mat(0x2f8a3a), g, wx - 1.6 + j * .76, wy - 2.9, front + 1.0, 6, 4); } } }
  // balcón corrido
  const by = base + (floors - 1) * fh + .4, bm = mat(0x7a4626, { roughness: .7 }); box(wid + 1.5, .5, 2.6, bm, .05, g, 0, by, front + 1.3);
  for (let k = -wid / 2 - .4; k <= wid / 2 + .4; k += .9) box(.5, 2.6, .18, bm, .04, g, k, by + 1.5, front + 2.5); box(wid + 1.6, .35, .4, bm, .05, g, 0, by + 2.9, front + 2.5);
  for (let k = -wid / 2 + 1; k < wid / 2; k += 1.6) { sphere(.5, mat(k % 3.2 < 1.6 ? 0xe8202a : 0xff6a8a, { roughness: .7 }), g, k, by + 3.4, front + 2.6, 8, 6); sphere(.4, mat(0x2f8a3a), g, k + .6, by + 3.1, front + 2.7, 6, 4); }
  // tejado (hastial hacia +z) con alero
  const rw = wid / 2 + 2.6, rh = wid * .42, sh_ = new THREE.Shape(); sh_.moveTo(-rw, 0); sh_.lineTo(0, rh); sh_.lineTo(rw, 0); sh_.lineTo(-rw, 0);
  const rt = rep(shingleT(...(ci % 2 ? ['#5a3a2e', '#43291f'] : ['#8a3a2a', '#6a2a1e'])), 1, 1); rt.wrapS = rt.wrapT = THREE.RepeatWrapping;
  const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(sh_, { depth: d + 5, bevelEnabled: false }), mat(0xffffff, { map: rt, roughness: .7 })); roof.geometry.translate(0, 0, -(d + 5) / 2); roof.position.y = h; roof.geometry.attributes.uv.array.forEach((v, i, a) => { a[i] = v * .08; }); g.add(roof);
  const gab = new THREE.Mesh(new THREE.ShapeGeometry((() => { const s = new THREE.Shape(); s.moveTo(-wid / 2, 0); s.lineTo(0, rh * (wid / 2) / rw); s.lineTo(wid / 2, 0); return s; })()), mat(0xffffff, { map: rep(plankT('#8a5a30', '#6e4420'), 3, 2), roughness: .8, side: THREE.DoubleSide })); gab.position.set(0, h, front + .05); g.add(gab);
  box(.9, .9, d + 5.4, mat(0x4a2a16), .1, g, 0, h + rh - .2, 0);
  // puerta y farol
  const dc = [0x6a3a1a, 0x2f5a3a, 0x7a2a2a][ci % 3]; box(3.6, 5.6, .4, mat(dc, { roughness: .6 }), .15, g, -wid * .22, 2.8, front + .1); box(4.4, .6, .8, mat(0x9a948a), .05, g, -wid * .22, 5.9, front + .3); sphere(.18, mat(0xd9a531, { metalness: .8, roughness: .3 }), g, -wid * .22 + 1.2, 2.8, front + .4);
  box(2.4, .5, 1.6, mat(0x9a948a), .05, g, -wid * .22, .25, front + .8);
  if (o.shop) { const arm = box(3.4, .2, .2, mat(0x1a1a1a, { metalness: .7 }), .02, g, wid * .25, 8.4, front + 1.8); arm.rotation.y = Math.PI / 2; const s = textPlane(4.2, 2.4, 268, 154, (c, w, h) => { c.fillStyle = '#1a1a1a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f4e8c8'; c.fillRect(6, 6, w - 12, h - 12); txt(c, o.shop, w / 2, h / 2, Math.min(52, 900 / o.shop.length), '#5a2a10'); }); s.position.set(wid * .25 + .02, 6.6, front + 2.6); s.rotation.y = Math.PI / 2; g.add(s); const s2 = s.clone(); s2.rotation.y = -Math.PI / 2; s2.position.x -= .04; g.add(s2);
    box(wid * .38, 3.6, .3, glass(), .05, g, wid * .22, 3.3, front + .1); }
  return shade(g); }

// ---------- naturaleza ----------
export function pine(parent, x, z, s = 1, col = 0x2a6a3a) { const g = G(parent, x, 0, z); g.scale.setScalar(s); cyl(.5, .7, 4, mat(0x5a3a22), 6, g, 0, 2, 0); const m = mat(col, { roughness: .9 }); for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(4.2 - k * 1.1, 5.4, 8), m); c.position.y = 5 + k * 3; c.castShadow = true; g.add(c); } return g; }
export function mountains(parent, cx = 0, cz = 0, R = 620, seed = 4) { const g = G(parent, cx, 0, cz); const r = RNG(seed); const rock = [mat(0x7c8aa0, { roughness: 1, flatShading: true }), mat(0x6a7890, { roughness: 1, flatShading: true }), mat(0x8a96aa, { roughness: 1, flatShading: true })], snow = mat(0xf6f8ff, { roughness: .8, flatShading: true });
  for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283 + r() * .2, d = R + r() * 220, hgt = 260 + r() * 260, rad = 170 + r() * 120; const x = Math.cos(a) * d, z = Math.sin(a) * d;
    const m = new THREE.Mesh(new THREE.ConeGeometry(rad, hgt, 7, 1), rock[i % 3]); m.position.set(x, hgt / 2 - 30, z); m.rotation.y = r() * 3; g.add(m);
    const s = new THREE.Mesh(new THREE.ConeGeometry(rad * .34, hgt * .34, 7, 1), snow); s.position.set(x, hgt - 30 - hgt * .17 + 2, z); s.rotation.y = m.rotation.y; g.add(s); }
  const hill = mat(0x4f9a3e, { roughness: 1, flatShading: true }); for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + .1, d = R * .62 + r() * 60, rad = 90 + r() * 60; const h = new THREE.Mesh(new THREE.SphereGeometry(rad, 10, 6, 0, 6.283, 0, 1.4), hill); h.position.set(Math.cos(a) * d, -rad * .55, Math.sin(a) * d); h.scale.y = .8; g.add(h);
    for (let k = 0; k < 7; k++) { const aa = a + (r() - .5) * .25, dd = d - rad * .35 + (r() - .5) * 40; pine(g, Math.cos(aa) * dd, Math.sin(aa) * dd, 2.2 + r() * 1.4, r() < .5 ? 0x235a32 : 0x2e6e3c); } }
  return g; }
export function maibaum(parent, x, z) { const g = G(parent, x, 0, z); const st = canvasTex(64, 256, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a6ad8'; for (let y = -64; y < h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + 32); c.lineTo(w, y + 48); c.lineTo(0, y + 16); c.fill(); } }, true); st.repeat.set(1, 10);
  cyl(.7, 1.0, 70, mat(0xffffff, { map: st, roughness: .5 }), 14, g, 0, 35, 0); const wr = new THREE.Mesh(new THREE.TorusGeometry(3.4, .7, 8, 24), mat(0x2f7a3a, { roughness: .9 })); wr.rotation.x = Math.PI / 2; wr.position.y = 60; g.add(wr);
  for (let k = 0; k < 8; k++) { const r = new THREE.Mesh(new THREE.BoxGeometry(.25, 7, .05), mat([0x2a6ad8, 0xffffff, 0xe8202a][k % 3])); r.position.set(Math.cos(k * .785) * 3.4, 56.5, Math.sin(k * .785) * 3.4); g.add(r); }
  for (let i = 0; i < 4; i++) { const y = 22 + i * 8, arm = box(9, .4, .4, mat(0xf4f0e8), .05, g, 0, y, 0); arm.rotation.y = i * .8; for (const s of [-1, 1]) { const p = textPlane(2.6, 2.6, 96, 96, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, h / 2, 44, 0, 7); c.fill(); c.strokeStyle = '#2a6ad8'; c.lineWidth = 6; c.stroke(); c.fillStyle = ['#c8202a', '#2a6ad8', '#2f7a3a', '#b8742a'][i]; c.fillRect(30, 30, 36, 36); }); p.position.set(Math.cos(i * .8) * s * 4.2, y - 1.6, -Math.sin(i * .8) * s * 4.2); p.rotation.y = i * .8; g.add(p); } }
  sphere(1.2, mat(0xffd23f, { metalness: .7, roughness: .3 }), g, 0, 71, 0, 12, 8); return shade(g); }
export function kirche(parent, x, z, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry; const wh = mat(0xf6f0e2, { roughness: .9 }), rf = mat(0xffffff, { map: rep(shingleT('#9a3a2a', '#7a2a1e'), 4, 4), roughness: .7 });
  box(26, 22, 50, wh, 0, g, 0, 11, -20); const sh = new THREE.Shape(); sh.moveTo(-15, 0); sh.lineTo(0, 12); sh.lineTo(15, 0); const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 52, bevelEnabled: false }), rf); roof.position.set(0, 22, -46); g.add(roof);
  for (let k = 0; k < 4; k++) for (const s of [-1, 1]) { const w = box(.3, 9, 3.6, glowM(0xffe8a0, .2), .02, g, s * 13.1, 12, -36 + k * 10); }
  box(14, 60, 14, wh, 0, g, 0, 30, 6); box(14.6, 1, 14.6, mat(0xd8c8a0), .1, g, 0, 22, 6); box(14.6, 1, 14.6, mat(0xd8c8a0), .1, g, 0, 46, 6);
  const clk = textPlane(8, 8, 160, 160, (c, w, h) => { c.fillStyle = '#1a2a4a'; c.beginPath(); c.arc(w / 2, h / 2, 76, 0, 7); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.stroke(); c.fillStyle = '#ffd23f'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.fillRect(w / 2 + Math.cos(a) * 62 - 3, h / 2 + Math.sin(a) * 62 - 3, 6, 6); } c.lineCap = 'round'; c.lineWidth = 7; c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 + 30, h / 2 - 20); c.moveTo(w / 2, h / 2); c.lineTo(w / 2, h / 2 - 54); c.stroke(); }); clk.position.set(0, 40, 13.05); g.add(clk);
  for (const s of [-1, 1]) box(3, 7, .3, mat(0x2a1a10), .3, g, s * 3.6, 52, 13.05);
  const prof = []; for (let i = 0; i <= 20; i++) { const t = i / 20, y = t * 20; const r = t < .55 ? 7.6 * Math.sin(Math.PI * (t / .55) * .62 + .15) + .2 : 7.6 * Math.sin(Math.PI * .77) * (1 - (t - .55) / .45) ** 1.4; prof.push(new THREE.Vector2(Math.max(.2, r), y)); }
  const dome = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), mat(0x3aa88a, { roughness: .45, metalness: .3 })); dome.position.y = 60; g.add(dome); cyl(.4, .4, 8, mat(0xffd23f, { metalness: .8, roughness: .25 }), 8, g, 0, 84, 0); box(3.4, .5, .5, mat(0xffd23f, { metalness: .8, roughness: .25 }), .05, g, 0, 85.5, 0);
  box(5, 9, .6, mat(0x5a3218), .4, g, 0, 4.5, 13.2); return shade(g); }
export function brunnen(parent, x, z) { const g = G(parent, x, 0, z); const st = mat(0xffffff, { map: rep(stoneT(), 3, 1), roughness: .9 }); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; const b = box(5.4, 2.2, 1.0, st, .1, g, Math.cos(a) * 6.2, 1.1, Math.sin(a) * 6.2); b.rotation.y = -a + Math.PI / 2; }
  const w = cyl(6, 6, .2, mat(0x3a9ae8, { roughness: .05, metalness: .3, emissive: 0x0a3a6a, emissiveIntensity: .3 }), 24, g, 0, 1.8, 0); cyl(.9, 1.2, 8, st, 12, g, 0, 4, 0); cyl(2.4, 1.0, .8, st, 16, g, 0, 7.6, 0);
  const fig = G(g, 0, 8, 0); box(1.2, 2.6, 1.0, mat(0xd8b040, { metalness: .7, roughness: .3 }), .3, fig, 0, 1.3, 0); sphere(.6, mat(0xd8b040, { metalness: .7, roughness: .3 }), fig, 0, 3.1, 0, 12, 8);
  const sp = []; for (let k = 0; k < 4; k++) { const a = k * 1.57; const s = cyl(.12, .12, 2.6, new THREE.MeshStandardMaterial({ color: 0xbfe8ff, transparent: true, opacity: .7, roughness: .05 }), 6, g, Math.cos(a) * 2.2, 6.6, Math.sin(a) * 2.2); s.rotation.z = Math.cos(a) * .9; s.rotation.x = -Math.sin(a) * .9; sp.push(s); } return shade(g); }
export function laterne(parent, x, z) { const g = G(parent, x, 0, z); const k = mat(0x1a1a1e, { metalness: .6, roughness: .4 }); cyl(.25, .35, 11, k, 8, g, 0, 5.5, 0); box(1.4, 1.8, 1.4, mat(0xfff0c0, { emissive: 0xffd890, emissiveIntensity: .5 }), .1, g, 0, 11.8, 0); const t = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1, 4), k); t.position.y = 13.1; t.rotation.y = .785; g.add(t); return g; }

// ---------- Lindenthal: plaza x ∈ [-44, 44], z ∈ [-70, 50]; iglesia al norte (0, -110) mirando +z; Maibaum (16, -14);
// fuente (-14, -26); filas de casas oeste (x = -50, miran +x), este (x = 50, miran -x) y sur (z = 70, miran -z); montañas alrededor.
export function lindenthal(scene) { const g = G(scene);
  plane(2400, 2400, mat(0xffffff, { roughness: 1, map: rep(grassT(), 160, 160) }), g, 0, -.04, 0);
  const ct = cobbleTex(); ct.repeat.set(24, 32); plane(100, 150, mat(0xffffff, { roughness: .85, map: ct }), g, 0, .02, -10);
  const asph = rep(noiseTex('#5a5e66', ['#4e525a', '#666a72'], 2000, 2, 1), 2, 60); plane(16, 600, mat(0xffffff, { roughness: .9, map: asph }), g, 0, .03, 360);
  const HS = []; let ci = 0;
  for (let z = 52; z > -80;) { const wid = 15 + (ci * 7) % 5; HS.push(alpHaus(g, -52, z - wid / 2, wid, 2 + ci % 2, ci, Math.PI / 2, { shop: ci === 2 ? 'BÄCKEREI' : ci === 5 ? 'GASTHOF ADLER' : null })); z -= wid + .5; ci++; }
  for (let z = 52; z > -80;) { const wid = 15 + (ci * 5) % 5; HS.push(alpHaus(g, 52, z - wid / 2, wid, 2 + ci % 2, ci, -Math.PI / 2, { shop: ci === 9 ? 'CAFÉ ALPENBLICK' : ci === 12 ? 'METZGEREI' : null })); z -= wid + .5; ci++; }
  for (let x = -40; x <= 40; x += 17) { if (Math.abs(x) < 8) continue; HS.push(alpHaus(g, x, 78, 16, 2 + ci % 2, ci, Math.PI)); ci++; }
  for (const s of [-1, 1]) for (let k = 0; k < 2; k++) { HS.push(alpHaus(g, s * (24 + k * 17), -96, 16, 2 + (ci % 2), ci, 0)); ci++; }
  for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; alpHaus(g, Math.cos(a) * 150, Math.sin(a) * 150 - 20, 16, 2, ci++, -a - Math.PI / 2); }
  kirche(g, 0, -120); maibaum(g, 18, -14); brunnen(g, -14, -26);
  for (const [x, z] of [[-34, 30], [34, 30], [-34, -40], [34, -40], [-34, -6], [34, -6]]) laterne(g, x, z);
  for (const [x, z] of [[-30, 46], [30, 46], [-22, -66], [22, -66]]) tree(g, x, z, 1.1);
  // terraza del café (este) con sombrillas
  for (let k = 0; k < 3; k++) { const tz = -36 + k * 10; cyl(1.6, 1.6, .2, mat(0xf4f0e8), 16, g, 38, 3.4, tz); cyl(.15, .15, 3.4, mat(0x2a2a2a), 6, g, 38, 1.7, tz); const um = new THREE.Mesh(new THREE.ConeGeometry(4.2, 1.6, 12), mat(k % 2 ? 0xd8323a : 0x2f7a3a, { roughness: .8 })); um.position.set(38, 8.2, tz); g.add(um); cyl(.1, .1, 8, mat(0xdddddd), 6, g, 38, 4, tz); }
  for (let k = 0; k < 3; k++) bench(g, -40, -8 + k * 14, Math.PI / 2);
  mountains(g, 0, -40, 640, 4);
  const sign = textPlane(14, 4, 448, 128, (c, w, h) => { c.fillStyle = '#f6d21a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a1a1a'; c.lineWidth = 10; c.strokeRect(8, 8, w - 16, h - 16); txt(c, 'LINDENTHAL', w / 2, h / 2 + 4, 80, '#1a1a1a'); }); sign.position.set(10, 9, 120); g.add(sign); for (const s of [-1, 1]) cyl(.25, .25, 11, mat(0x9a9aa4, { metalness: .6 }), 8, g, 10 + s * 6, 5.5, 119.8);
  return { g: shade(g), HS }; }

// ---------- la casa del Opa (X): chalet de madera sobre zócalo de piedra, banco tallado delante, leña, taburete y virutas,
// manzano, valla de estacas, buzón; pradera con montañas. Banco en (0, 4) mirando +z; puerta en (-7, 0).
export function opaHaus(scene, X) { const g = G(scene, X);
  plane(900, 900, mat(0xffffff, { roughness: 1, map: rep(grassT('#5cba48'), 80, 80) }), g, 0, -.04, 0);
  const path = plane(5, 60, mat(0xffffff, { map: rep(noiseTex('#c8b48a', ['#b8a47a', '#d8c49a'], 900, 3, 1), 1, 8), roughness: 1 }), g, -7, .02, 30);
  const H = alpHaus(g, 0, -9, 26, 1, 4, 0); box(30, .6, 4, mat(0x8a8a82), .05, g, 0, .3, 1.6);
  const BANK = G(g, 2, 0, 3); const bm = mat(0x9a6a3a, { roughness: .7 }); box(8, .5, 2.2, bm, .1, BANK, 0, 2.3, 0); box(8, 2.6, .4, bm, .1, BANK, 0, 3.9, -1.0); for (const s of [-1, 1]) { box(.6, 2.3, 2, bm, .05, BANK, s * 3.6, 1.15, 0); box(.5, .4, 2.3, bm, .05, BANK, s * 3.8, 3.4, 0); }
  for (let k = 0; k < 5; k++) { const h = box(1.2, .9, .2, mat(0x7a4a26), .02, BANK, -3 + k * 1.5, 4.9, -1.1); h.rotation.z = .785; }
  // leña apilada y tocón con hacha
  const WP = G(g, 12, 0, -1); for (let r = 0; r < 4; r++) for (let k = 0; k < 7 - r; k++) { const l = cyl(.55, .55, 3.4, mat(0xffffff, { map: plankT('#a8784a', '#8a5a32'), roughness: .9 }), 10, WP, -3.6 + k * 1.1 + r * .55, .55 + r * .95, 0); l.rotation.x = Math.PI / 2; const e = cyl(.45, .45, .02, mat(0xe8c890), 10, WP, l.position.x, l.position.y, 1.72); e.rotation.x = Math.PI / 2; }
  const STUMP = G(g, -1, 0, 9); cyl(1.4, 1.6, 2, mat(0x6a4a2a, { roughness: .9 }), 12, STUMP, 0, 1, 0); cyl(1.4, 1.4, .05, mat(0xe8c890), 12, STUMP, 0, 2.02, 0);
  const SHAV = []; const sr = RNG(11); for (let k = 0; k < 26; k++) { const s = new THREE.Mesh(new THREE.TorusGeometry(.18, .06, 4, 8, 4), mat(0xf0d8a8, { roughness: .9 })); s.position.set(2 + (sr() - .5) * 7, .08, 5.6 + sr() * 3); s.rotation.set(Math.PI / 2, 0, sr() * 6); g.add(s); SHAV.push(s); }
  // vogel tallado en el banco
  const BIRD = G(g, 5.6, 2.55, 3.2); box(.9, .7, .6, mat(0xd8b07a, { roughness: .8 }), .25, BIRD, 0, .35, 0); box(.5, .5, .5, mat(0xd8b07a), .2, BIRD, .45, .8, 0); const bk = new THREE.Mesh(new THREE.ConeGeometry(.12, .4, 6), mat(0xb8904a)); bk.rotation.z = -Math.PI / 2; bk.position.set(.85, .8, 0); BIRD.add(bk);
  // valla, buzón, manzano, flores
  for (let x = -40; x <= 40; x += 1.6) { if (Math.abs(x + 7) < 3) continue; box(.5, 3, .3, mat(0xf4f0e8), .1, g, x, 1.5, 22); } box(80, .4, .2, mat(0xf4f0e8), .02, g, 0, 2.2, 21.8);
  const mb = G(g, -11, 0, 21); cyl(.18, .18, 4, mat(0x5a3a22), 6, mb, 0, 2, 0); box(1.6, 1.4, 2.2, mat(0x2a6ad8), .3, mb, 0, 4.4, 0);
  const AP = tree(g, 22, 8, 1.2); for (let k = 0; k < 12; k++) sphere(.4, mat(0xd8202a, { roughness: .5 }), g, 22 + Math.cos(k) * 4, 9 + (k % 4) * 1.4, 8 + Math.sin(k * 1.7) * 4, 8, 6);
  for (let k = 0; k < 30; k++) { const x = -36 + k * 2.5; if (Math.abs(x + 7) < 4) continue; sphere(.45, mat([0xff6a8a, 0xffd23f, 0xffffff, 0xb86aff][k % 4]), g, x, .7, 19.5 + (k % 2) * .8, 8, 6); }
  for (let k = 0; k < 6; k++) pine(g, -60 + k * 22, -60 - (k % 2) * 14, 1.6 + (k % 3) * .3);
  mountains(g, 0, -60, 560, 9);
  return { g: shade(g), BANK, BIRD, SHAV, STUMP, H }; }

// ---------- colegio (X): edificio de tres plantas con reloj y rótulo, patio con rayuela, árboles, aparcabicis y bancos.
// Puerta en (0, -24); patio delante (z > -20).
export function schule(scene, X) { const g = G(scene, X);
  plane(600, 600, mat(0xffffff, { roughness: 1, map: rep(grassT(), 50, 50) }), g, 0, -.04, 0);
  plane(90, 70, mat(0xffffff, { roughness: .9, map: rep(noiseTex('#8a8e96', ['#7a7e86', '#9a9ea6'], 2000, 2, 1), 8, 6) }), g, 0, .02, 0);
  const winT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#e88a4a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(14, 22, 100, 82); const gg = c.createLinearGradient(0, 26, 0, 100); gg.addColorStop(0, '#bfe6ff'); gg.addColorStop(1, '#3a6a9a'); c.fillStyle = gg; c.fillRect(20, 28, 88, 70); c.fillStyle = '#ffffff'; c.fillRect(61, 28, 6, 70); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(26, 32, 10, 60); c.fillStyle = '#c86a2a'; c.fillRect(0, 112, w, 16); }, true);
  box(80, 30, 20, mat(0xffffff, { map: rep(winT, 10, 3), roughness: .8 }), 0, g, 0, 15, -36); box(82, 1.4, 22, mat(0x4a4e5a), .1, g, 0, 30.6, -36);
  box(14, 9, 2, glass(), .1, g, 0, 4.5, -25.6); box(18, 1, 6, mat(0xd8dce4, { metalness: .5 }), .1, g, 0, 9.4, -24);
  const s = textPlane(30, 3.6, 900, 108, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'SCHULE AM BERG', w / 2, h / 2 + 4, 76, '#2a4a7a'); }); s.position.set(0, 26.4, -25.9); g.add(s);
  const cl = textPlane(5, 5, 100, 100, (c, w, h) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(50, 50, 48, 0, 7); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 5; c.stroke(); c.lineCap = 'round'; c.beginPath(); c.moveTo(50, 50); c.lineTo(50, 16); c.moveTo(50, 50); c.lineTo(72, 58); c.stroke(); }); cl.position.set(30, 25, -25.9); g.add(cl);
  // rayuela
  const hop = textPlane(6, 16, 96, 256, (c, w, h) => { c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.fillStyle = '#ffffff'; c.font = `700 24px ${FONT}`; c.textAlign = 'center'; for (let i = 0; i < 7; i++) { c.strokeRect(24, 4 + i * 36, 48, 34); c.fillText(String(i + 1), 48, 28 + i * 36); } }); hop.rotation.x = -Math.PI / 2; hop.position.set(-20, .06, 4); g.add(hop);
  for (const [x, z] of [[-36, -10], [36, -10], [-36, 22], [36, 22]]) tree(g, x, z, 1.2); for (const x of [-26, 26]) bench(g, x, 14, Math.PI);
  const BR = bikeRack(g, 6); BR.position.set(28, 0, -18);
  for (let k = 0; k < 8; k++) alpHaus(g, -90 + k * 26, 60, 18, 2, k + 3, Math.PI);
  mountains(g, 0, -40, 560, 6); return { g: shade(g) }; }

// ---------- campo de fútbol del pueblo (X): campo 44 × 70 (z ∈ ±35), portería «nuestra» en z = -35 mirando +z;
// tribuna de madera cubierta a la izquierda (x = -26 … -40) con 4 bancos; vallas con anuncios; marcador detrás de la portería
export function sportplatz(scene, X) { const g = G(scene, X);
  plane(800, 800, mat(0xffffff, { roughness: 1, map: rep(grassT('#56b040'), 70, 70) }), g, 0, -.06, 0);
  const pitchT = canvasTex(256, 256, (c, w, h) => { for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#52c040' : '#46b034'; c.fillRect(0, i * h / 12, w, h / 12 + 1); } const r = RNG(5); for (let i = 0; i < 1500; i++) { c.fillStyle = `rgba(${r() < .5 ? '20,80,10' : '150,240,120'},.16)`; c.fillRect(r() * w, r() * h, 2, 3); } });
  plane(46, 76, mat(0xffffff, { map: pitchT, roughness: .95 }), g, 0, 0, 0);
  const lm = mat(0xffffff, { roughness: .6 }); const line = (w, d, x, z) => box(w, .05, d, lm, 0, g, x, .04, z);
  line(42.4, .3, 0, 35); line(42.4, .3, 0, -35); line(.3, 70, 21, 0); line(.3, 70, -21, 0); line(42, .3, 0, 0); const cc = new THREE.Mesh(new THREE.RingGeometry(6, 6.3, 48), lm); cc.rotation.x = -Math.PI / 2; cc.position.y = .05; g.add(cc);
  for (const s of [-1, 1]) { line(22, .3, 0, s * 23); line(.3, 12, -11, s * 29); line(.3, 12, 11, s * 29); const ps = cyl(.35, .35, .05, lm, 12, g, 0, .05, s * 25); }
  const G1 = goal(g, 0, -35, 0, 10, 4.6, 3), G2 = goal(g, 0, 35, Math.PI, 10, 4.6, 3);
  // tribuna
  const TR = G(g, -31, 0, 0); const wd = mat(0xffffff, { map: rep(plankT('#9a6a3a', '#7a4e28'), 4, 1), roughness: .8 });
  for (let r = 0; r < 4; r++) { box(3, 1.6 + r * 1.6, 40, mat(0xa8a49a), .05, TR, 3 - r * 3, (1.6 + r * 1.6) / 2, 0); box(2.2, .5, 40, wd, .05, TR, 3.2 - r * 3, 2.4 + r * 1.6 - .5 + .5, 0); }
  for (const z of [-19, -6, 6, 19]) cyl(.35, .35, 16, mat(0x6a4a2a), 8, TR, 4.4, 8, z); for (const z of [-19, -6, 6, 19]) cyl(.35, .35, 16, mat(0x6a4a2a), 8, TR, -8.6, 8, z);
  const rf = box(16, .6, 42, mat(0xffffff, { map: rep(shingleT('#8a3a2a', '#6a2a1e'), 4, 8), roughness: .7 }), .05, TR, -2, 16.4, 0); rf.rotation.z = -.14;
  box(.4, 16, 40, wd, .05, TR, -9.2, 8, 0); const ts = textPlane(16, 2.6, 512, 84, (c, w, h) => { c.fillStyle = '#1a4a2a'; c.fillRect(0, 0, w, h); txt(c, 'SV LINDENTHAL 1921', w / 2, h / 2 + 2, 52, '#ffffff'); }); ts.position.set(5, 14.2, 0); ts.rotation.y = Math.PI / 2; TR.add(ts);
  // vallas con anuncios
  const ADS = ['BÄCKEREI HUBER', 'SV LINDENTHAL', 'METZGEREI ZANGL', 'SKISCHULE ALPIN', 'GASTHOF ADLER', 'BERGBAHN'];
  for (let k = 0; k < 6; k++) { const a = textPlane(11, 1.6, 352, 52, (c, w, h) => { c.fillStyle = ['#d8323a', '#1a4a2a', '#2a5ab8', '#f2b81a', '#5a2a1a', '#1a8aa8'][k]; c.fillRect(0, 0, w, h); txt(c, ADS[k], w / 2, h / 2 + 2, 34, '#ffffff'); }); a.position.set(24, .9, -30 + k * 12); a.rotation.y = -Math.PI / 2; g.add(a); box(.3, 1.8, 11.4, mat(0xeeeeee), .02, g, 24.2, .9, -30 + k * 12); }
  for (let k = 0; k < 4; k++) { const a = textPlane(10, 1.6, 320, 52, (c, w, h) => { c.fillStyle = ['#f2b81a', '#d8323a', '#1a4a2a', '#2a5ab8'][k]; c.fillRect(0, 0, w, h); txt(c, ['TOR!', 'SV LINDENTHAL', 'BERGBAHN', 'BÄCKEREI HUBER'][k], w / 2, h / 2 + 2, 34, '#ffffff'); }); a.position.set(-15 + k * 10, .9, -42); g.add(a); }
  const SB = scoreboard(g, 0, 10, -50, 0, 1.2);
  // banquillo
  const BK = G(g, 23, 0, 10); box(2.6, .5, 10, mat(0x2a6ad8), .05, BK, 0, 2.2, 0); box(.4, 6, 10.4, new THREE.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: .35 }), 0, BK, 1.6, 3, 0); box(3, .3, 10.4, mat(0xd8dce4), .05, BK, 0, 6, 0);
  for (const [x, z] of [[-46, -40], [-46, 40], [30, -40], [30, 40]]) { cyl(.5, .7, 30, mat(0x8a8e9a, { metalness: .6 }), 10, g, x, 15, z); box(5, 2.6, 1, mat(0x2a2a34), .1, g, x, 30, z); }
  for (let k = 0; k < 14; k++) pine(g, -80 + k * 12, -70 - (k % 3) * 8, 1.4 + (k % 2) * .4);
  for (let k = 0; k < 6; k++) alpHaus(g, 60 + (k % 2) * 4, -50 + k * 22, 16, 2, k + 7, -Math.PI / 2);
  mountains(g, 0, -40, 520, 12);
  return { g: shade(g), G1, G2, SB, TR }; }

// ---------- hospital por fuera (X): edificio blanco de 4 plantas con franjas azules, rótulo KRANKENHAUS y cruz roja,
// marquesina de entrada, árboles; entrada en (0, -14) mirando +z.
export function klinikAussen(scene, X) { const g = G(scene, X);
  plane(600, 600, mat(0xffffff, { roughness: 1, map: rep(grassT(), 50, 50) }), g, 0, -.04, 0); plane(70, 50, mat(0xffffff, { roughness: .9, map: rep(noiseTex('#9a9ea6', ['#8a8e96', '#aaaeb6'], 2000, 2, 1), 6, 4) }), g, 0, .02, 6);
  const wt = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#f4f6f8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a6ab8'; c.fillRect(0, 104, w, 10); c.fillStyle = '#9fd0f0'; c.fillRect(16, 24, 96, 64); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(22, 28, 14, 56); c.fillStyle = '#ffffff'; c.fillRect(62, 24, 4, 64); }, true);
  box(90, 40, 24, mat(0xffffff, { map: rep(wt, 12, 4), roughness: .7 }), 0, g, 0, 20, -28); box(92, 1.2, 26, mat(0xd8dce4), .1, g, 0, 40.6, -28);
  box(16, 9, 1, glass(), .1, g, 0, 4.5, -15.8); const can = box(24, .8, 10, mat(0xf4f4f4), .1, g, 0, 10, -12); for (const s of [-1, 1]) cyl(.3, .3, 10, mat(0xd8dce4, { metalness: .6 }), 8, g, s * 11, 5, -8);
  const s = textPlane(30, 4, 900, 120, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'KRANKENHAUS', w / 2 + 40, h / 2 + 4, 92, '#2a5ab8'); c.fillStyle = '#e8202a'; c.fillRect(30, 30, 60, 20); c.fillRect(50, 10, 20, 60); }); s.position.set(0, 36, -15.9); g.add(s);
  const cr = G(g, 34, 30, -15.8); box(6, 2, .4, glowM(0xe8202a, 1.4), .05, cr); box(2, 6, .4, glowM(0xe8202a, 1.4), .05, cr);
  for (const [x, z] of [[-30, 10], [30, 10], [-30, 26], [30, 26]]) tree(g, x, z, 1.2); for (const x of [-18, 18]) bench(g, x, 4, Math.PI);
  for (let k = 0; k < 7; k++) alpHaus(g, -84 + k * 28, 70, 18, 2, k + 1, Math.PI); mountains(g, 0, -60, 560, 15);
  return { g: shade(g) }; }

// ---------- habitación del hospital (X): cama con barandillas y cabecero alzado (cabeza en (0, 4.4, -4)), monitor cardíaco
// en un brazo a la izquierda (x = -6.4, y = 8.4, z = -7), gotero, ventana con cortinas (pared x = +13), silla para mí en (5, 0, 0),
// flores, reloj; pared del fondo z = -11.
export function klinikZimmer(scene, X) { const g = G(scene, X); const W_ = 28, D = 24, Hh = 16;
  const wall = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#d8efe6'; c.fillRect(0, 0, w, h); c.fillStyle = '#cfe8de'; c.fillRect(0, 0, w, 6); }, true), 6, 3), roughness: .9 });
  const floor = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#c8ccd0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b4b8bc'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); }, true), 10, 8), roughness: .5 });
  box(W_, .4, D, floor, 0, g, 0, -.2, 0); box(W_, Hh, .4, wall, 0, g, 0, Hh / 2, -D / 2 + 1); for (const s of [-1, 1]) box(.4, Hh, D, wall, 0, g, s * W_ / 2, Hh / 2, 0); box(W_, .4, D, mat(0xf4f4f0), 0, g, 0, Hh, 0);
  box(W_, 1.2, .3, mat(0xa8d0c0), .05, g, 0, 4.6, -D / 2 + 1.3);
  // cama
  const BED = G(g, 0, 0, -2.6); const met = mat(0xd8dce4, { metalness: .6, roughness: .3 }), sheet = mat(0xf8f8f8, { roughness: .9 }), blue = mat(0x8ab8e8, { roughness: .9 });
  box(7.6, 1.4, 13, mat(0xa8acb4, { metalness: .5 }), .2, BED, 0, 2.6, 1); box(7.2, 1.0, 12.6, sheet, .4, BED, 0, 3.6, 1); for (const s of [-1, 1]) for (const z of [-5, 7]) cyl(.18, .18, 2.2, met, 8, BED, s * 3.4, 1.1, z);
  const HEAD = G(BED, 0, 3.8, -4.6); const hb = box(7.2, .8, 5, sheet, .3, HEAD, 0, 0, 2.2); HEAD.rotation.x = .55; box(3.6, .9, 2, mat(0xffffff, { roughness: .95 }), .45, HEAD, 0, .7, 1.2);
  box(7.8, 4.6, .5, met, .2, BED, 0, 4, -5.8); box(7.8, 3, .5, met, .2, BED, 0, 3.6, 7.6); for (const s of [-1, 1]) { box(.25, 1.6, 6, met, .08, BED, s * 3.9, 4.6, 2.4); }
  const BLANKET = box(7.4, .6, 8, blue, .3, BED, 0, 4.3, 3.6); box(7.42, .4, 1, mat(0xffffff), .1, BED, 0, 4.5, -.3);
  // monitor cardíaco
  const MON = G(g, -6.6, 0, -6.4); cyl(.25, .35, 7, met, 8, MON, 0, 3.5, 0); box(1.6, .4, 1.6, met, .1, MON, 0, .2, 0); const scrBox = box(3.8, 3, 1.4, mat(0xe8eaee, { roughness: .5 }), .25, MON, 0, 8.2, 0); scrBox.rotation.y = .45;
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 240; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.4), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); scr.position.set(.32, 8.25, .64); scr.rotation.y = .45; MON.add(scr);
  let key = null; const ecg = (T, flat = 0, bpm = 72) => { const k = Math.floor(T * 30) + ':' + flat; if (k === key) return; key = k; const c = cv.getContext('2d'); c.fillStyle = '#04120c'; c.fillRect(0, 0, 320, 240); c.strokeStyle = 'rgba(40,120,80,.35)'; c.lineWidth = 1; for (let x = 0; x < 320; x += 20) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 240); c.stroke(); } for (let y = 0; y < 240; y += 20) { c.beginPath(); c.moveTo(0, y); c.lineTo(320, y); c.stroke(); }
    const per = 60 / bpm, head = (T % 3) / 3 * 300; c.strokeStyle = '#4aff8a'; c.lineWidth = 4; c.shadowColor = '#4aff8a'; c.shadowBlur = 8; c.beginPath();
    for (let x = 0; x <= 300; x += 2) { const tt = T - (head - x) / 100; let y = 130; if (!flat || tt < flat) { const ph = ((tt % per) + per) % per / per; if (ph > .2 && ph < .24) y = 130 + (ph - .2) * 400; else if (ph >= .24 && ph < .28) y = 146 - (ph - .24) * 2600; else if (ph >= .28 && ph < .32) y = 42 + (ph - .28) * 2900; else if (ph >= .32 && ph < .35) y = 158 - (ph - .32) * 900; else if (ph > .5 && ph < .62) y = 130 - Math.sin((ph - .5) / .12 * Math.PI) * 14; }
      if (Math.abs(x - head) < 10) continue; x === 0 ? c.moveTo(10 + x, y) : c.lineTo(10 + x, y); } c.stroke(); c.shadowBlur = 0;
    c.font = `700 46px ${FONT}`; c.textAlign = 'right'; c.fillStyle = flat && T > flat ? '#ff3a3a' : '#4aff8a'; c.fillText(flat && T > flat ? '0' : String(bpm), 306, 50); c.font = `700 22px ${FONT}`; c.fillText('HF', 306, 76); c.fillStyle = '#5ad8ff'; c.textAlign = 'left'; c.fillText('SpO2 97', 14, 222); tex.needsUpdate = true; };
  // gotero, silla, mesilla con flores, ventana
  const IV = G(g, 6, 0, -7); cyl(.12, .12, 11, met, 6, IV, 0, 5.5, 0); box(2, .14, .14, met, .02, IV, 0, 11, 0); box(1, 1.6, .4, new THREE.MeshStandardMaterial({ color: 0xe8f6ff, transparent: true, opacity: .75, roughness: .1 }), .2, IV, .7, 9.8, 0); for (let k = 0; k < 5; k++) box(.9, .14, .14, met, .02, IV, 0, .3, 0).rotation.y = k * 1.25;
  const CH = G(g, 5.6, 0, 1.4); const cm_ = mat(0x3a8a7a, { roughness: .6 }); box(3.2, .5, 3.2, cm_, .15, CH, 0, 2.6, 0); box(3.2, 3.6, .4, cm_, .15, CH, 0, 4.4, 1.5); for (const s of [-1, 1]) for (const z of [-1.3, 1.3]) cyl(.12, .12, 2.6, met, 6, CH, s * 1.3, 1.3, z);
  const NT = G(g, -6.6, 0, 1); box(2.8, 3.8, 2.6, mat(0xe8e0d0), .15, NT, 0, 1.9, 0); cyl(.5, .4, 1.4, new THREE.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: .6, roughness: .05 }), 12, NT, 0, 4.5, 0); for (let k = 0; k < 6; k++) sphere(.42, mat([0xffd23f, 0xff6a8a, 0xffffff][k % 3]), NT, Math.cos(k) * .6, 5.8 + (k % 2) * .4, Math.sin(k) * .6, 8, 6);
  const WIN = G(g, 13.75, 8.6, -2); const wcv = document.createElement('canvas'); wcv.width = 256; wcv.height = 256; const wtx = new THREE.CanvasTexture(wcv); wtx.colorSpace = THREE.SRGBColorSpace; const wp = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: wtx, toneMapped: false })); wp.rotation.y = -Math.PI / 2; WIN.add(wp);
  let wkey = null; const view = mode => { if (mode === wkey) return; wkey = mode; const c = wcv.getContext('2d'); const n = mode === 'night', d = mode === 'dusk'; const gr = c.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, n ? '#0a1238' : d ? '#3a3a8a' : '#5aa8ff'); gr.addColorStop(1, n ? '#2a2a5a' : d ? '#ff9a5a' : '#cfe8ff'); c.fillStyle = gr; c.fillRect(0, 0, 256, 256);
    c.fillStyle = n ? '#1a2240' : '#8a9ab8'; c.beginPath(); c.moveTo(0, 170); c.lineTo(60, 90); c.lineTo(110, 150); c.lineTo(170, 70); c.lineTo(256, 160); c.lineTo(256, 256); c.lineTo(0, 256); c.fill(); c.fillStyle = n ? '#c8d0e8' : '#ffffff'; c.beginPath(); c.moveTo(170, 70); c.lineTo(150, 98); c.lineTo(190, 92); c.fill(); c.beginPath(); c.moveTo(60, 90); c.lineTo(46, 108); c.lineTo(74, 106); c.fill();
    c.fillStyle = n ? '#14301e' : '#3a8a3a'; c.fillRect(0, 200, 256, 56); if (n) { c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(200, 40, 18, 0, 7); c.fill(); for (let i = 0; i < 30; i++) { c.fillStyle = '#fff'; c.fillRect((i * 53) % 256, (i * 37) % 120, 2, 2); } for (let i = 0; i < 10; i++) { c.fillStyle = '#ffd890'; c.fillRect(20 + i * 24, 214 + (i % 3) * 8, 6, 6); } } c.fillStyle = '#ffffff'; c.fillRect(124, 0, 8, 256); c.fillRect(0, 124, 256, 8); wtx.needsUpdate = true; };
  box(.4, 10, 10, mat(0xffffff), .1, WIN, .2, 0, 0); for (const s of [-1, 1]) { const cu = box(.5, 11, 2.6, mat(0xf2d8a0, { roughness: .95 }), .3, WIN, -.6, -.2, s * 5.6); }
  const clk = textPlane(2.4, 2.4, 96, 96, (c, w, h) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(48, 48, 46, 0, 7); c.fill(); c.strokeStyle = '#2a2a2a'; c.lineWidth = 5; c.stroke(); c.lineCap = 'round'; c.beginPath(); c.moveTo(48, 48); c.lineTo(48, 16); c.moveTo(48, 48); c.lineTo(68, 60); c.stroke(); }); clk.position.set(4, 12.4, -10.75); g.add(clk);
  const pic = textPlane(4, 3, 160, 120, (c, w, h) => { c.fillStyle = '#5aa8ff'; c.fillRect(0, 0, w, h); c.fillStyle = '#8a9ab8'; c.beginPath(); c.moveTo(0, 90); c.lineTo(50, 30); c.lineTo(100, 80); c.lineTo(130, 40); c.lineTo(160, 90); c.lineTo(160, 120); c.lineTo(0, 120); c.fill(); c.fillStyle = '#3a8a3a'; c.fillRect(0, 100, w, 20); c.strokeStyle = '#8a5a2a'; c.lineWidth = 10; c.strokeRect(0, 0, w, h); }); pic.position.set(-4, 10, -10.75); g.add(pic);
  const LMP = new THREE.PointLight(0xfff0dc, 140, 50, 1.4); LMP.position.set(0, 14, 2); g.add(LMP); const BEDL = new THREE.PointLight(0xffd8a0, 0, 20, 1.5); BEDL.position.set(-4, 9, -6); g.add(BEDL);
  return { g: shade(g), BED, HEAD, BLANKET, MON, ecg, view, CH, NT, IV, LMP, BEDL, scr }; }
