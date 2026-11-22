// FLASCHEN — escenarios y atrezo propios: botellas-asiento clavadas en el suelo, agujero (vacío / lila / burbujeando),
// silla gamer, paquete, el Dom de la plaza, la consulta del dentista, el interior del tranvía, mi cuarto con el portátil
// (tienda online), la cueva de debajo de la ciudad (botellas en el techo y ojos lila) y el sótano.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp } from './engine.js';
import { noiseTex, stripes, txt, tree } from './props.js';
import { FONT } from './sets.js';
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
export const basicGlow = (col, k = 2) => new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), toneMapped: false });
export const LILA = 0xb04aff;
const tiles = (a, b, n = 8) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * w / n, 0); c.lineTo(i * w / n, h); c.moveTo(0, i * h / n); c.lineTo(w, i * h / n); c.stroke(); } }, true);
const plank = () => canvasTex(128, 128, (c, w, h) => { const r = RNG(4); for (let y = 0; y < h; y += 16) { c.fillStyle = `hsl(28,${45 + r() * 10}%,${46 + r() * 8}%)`; c.fillRect(0, y, w, 16); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y, w, 2); c.fillRect((r() * w) | 0, y, 2, 16); } }, true);
function room(parent, X, w, d, h, wall, floor, ceil = 0xf4f0e8) { const g = G(parent, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil), 0, g, 0, h, 0); return g; }

// ---------- la botella-asiento ----------
// perfil (radio, y): base enterrada, cuerpo, hombro, cuello y boca; la boca (asiento) queda a y = 2.5
const PROF = [[0, -.4], [1.0, -.4], [1.1, -.1], [1.1, 1.45], [1.0, 1.8], [.7, 2.1], [.46, 2.35], [.38, 2.6], [.38, 4.2], [.48, 4.26], [.5, 4.48], [.32, 4.5], [0, 4.5]];
const BGEO = new THREE.LatheGeometry(PROF.map(([r, y]) => new THREE.Vector2(r, y)), 28);
export const BCOL = [0x1f9a4a, 0x9a4a14, 0x5ac8e8, 0x2a7a3a, 0xb85a1a, 0x7ad8d0];
const LABELS = ['#f4e8c8', '#ffd23f', '#ffffff', '#ff8a6a', '#c8f0ff', '#f4c8e8'];
const labelTex = i => canvasTex(256, 64, (c, w, h) => { c.fillStyle = LABELS[i % LABELS.length]; c.fillRect(0, 0, w, h); c.fillStyle = ['#d8323a', '#2a6ad8', '#2a8a3a', '#6a3ad8'][i % 4]; c.fillRect(0, 6, w, 8); c.fillRect(0, h - 14, w, 8);
  for (let k = 0; k < 4; k++) { c.fillStyle = 'rgba(0,0,0,.55)'; c.beginPath(); c.arc(32 + k * 64, h / 2, 9, 0, 7); c.fill(); } });
export function bottle(parent, i = 0, o = {}) { const g = G(parent); const col = o.col ?? BCOL[i % BCOL.length];
  const m = new THREE.MeshStandardMaterial({ color: col, roughness: .05, metalness: .2, transparent: true, opacity: .72, emissive: col, emissiveIntensity: .18 });
  const b = new THREE.Mesh(BGEO, m); b.castShadow = true; g.add(b);
  // brillo vertical (reflejo) y etiqueta
  const hl = box(.14, 1.6, .05, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6 }), .03, g, -.55, .75, .92); hl.rotation.y = -.55; const hl2 = box(.1, 1.4, .05, hl.material, .02, g, -.2, 3.4, .34); hl2.rotation.y = -.5;
  const lab = new THREE.Mesh(new THREE.CylinderGeometry(1.115, 1.115, .62, 28, 1, true), mat(0xffffff, { map: labelTex(i), roughness: .7 })); lab.position.y = .8; g.add(lab);
  // collar oscuro en el suelo (donde la botella entra en el adoquín)
  const col_ = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.5, 28), mat(0x2a2a30, { roughness: .6 })); col_.rotation.x = -Math.PI / 2; col_.position.y = .04; g.add(col_);
  g.userData = { body: b, m, collar: col_ }; return g; }
// la botella suelta (tumbada, rodando): sin collar
export function looseBottle(parent, i = 0) { const g = bottle(parent, i); g.userData.collar.visible = false; return g; }

// ---------- agujero en el adoquín: negro, con brillo lila y burbujas ----------
export function hole(parent) { const g = G(parent);
  const rim = new THREE.Mesh(new THREE.RingGeometry(.92, 1.4, 28), mat(0x3a3a42, { roughness: .7 })); rim.rotation.x = -Math.PI / 2; rim.position.y = .05; g.add(rim);
  const pit = new THREE.Mesh(new THREE.CircleGeometry(.95, 28), new THREE.MeshBasicMaterial({ color: 0x050308 })); pit.rotation.x = -Math.PI / 2; pit.position.y = .06; g.add(pit);
  const gl = new THREE.Mesh(new THREE.CircleGeometry(.9, 28), new THREE.MeshBasicMaterial({ color: new THREE.Color(LILA).multiplyScalar(2.2), toneMapped: false, transparent: true, opacity: 0 })); gl.rotation.x = -Math.PI / 2; gl.position.y = .07; g.add(gl);
  // haz de luz que sale hacia arriba (aditivo)
  const beamT = canvasTex(64, 256, (c, w, h) => { const gr = c.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.6, .9, 9, 24, 1, true), new THREE.MeshBasicMaterial({ map: beamT, color: new THREE.Color(LILA).multiplyScalar(1.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })); beam.position.y = 4.5; g.add(beam);
  const L = new THREE.PointLight(LILA, 0, 30, 1.4); L.position.y = 1.5; g.add(L);
  const BUB = Array.from({ length: 12 }, () => sphere(.22, new THREE.MeshStandardMaterial({ color: 0xd8a0ff, emissive: LILA, emissiveIntensity: 1.2, roughness: .1, transparent: true, opacity: .85 }), g, 0, 0, 0, 10, 8));
  // glow: 0..1 (luz lila); bub: 0..1 (burbujeo); T tiempo
  g.userData = { set(glow, bub = 0, T = 0) { gl.material.opacity = glow; beam.material.opacity = glow * .55; L.intensity = glow * 260; pit.material.color.setRGB(.02 + glow * .25, .01 + glow * .05, .03 + glow * .4);
    BUB.forEach((b, i) => { const r = RNG(i * 7 + 1), k = (T * (1.2 + r() * .8) + r()) % 1; b.visible = bub > 0 && i < 12 * bub; const a = r() * 6.283, rr = r() * .6; b.position.set(Math.cos(a) * rr, .1 + k * (1.2 + bub), Math.sin(a) * rr); b.scale.setScalar((.5 + r() * .8) * (k < .85 ? 1 : 1 - (k - .85) / .15 * .9)); }); } };
  g.userData.set(0); return g; }

// ---------- silla gamer (naranja y negra, con respaldo alto y ruedas) ----------
export function gamerChair(parent) { const g = G(parent); const blk = mat(0x1a1a22, { roughness: .45 }), org = mat(0xff7a1a, { roughness: .4 });
  box(3.0, .7, 2.8, blk, .3, g, 0, 2.3, 0); box(2.2, .2, 2.2, org, .1, g, 0, 2.7, .1);
  const back = G(g, 0, 2.6, -1.25); back.rotation.x = -.12; box(2.9, 5.2, .7, blk, .3, back, 0, 2.6, 0); box(.6, 4.6, .74, org, .1, back, -.8, 2.5, 0); box(.6, 4.6, .74, org, .1, back, .8, 2.5, 0); box(1.6, .7, .9, org, .3, back, 0, 4.8, .2);
  box(1.4, .7, .5, mat(0xf4f4f4), .25, back, 0, 3.9, .5);
  for (const s of [-1, 1]) { box(.3, 1.1, .3, blk, .05, g, s * 1.55, 3.0, .2); box(.5, .22, 2.0, blk, .1, g, s * 1.55, 3.6, .2); }
  cyl(.2, .2, 1.5, mat(0x9a9ea8, { metalness: .8, roughness: .3 }), 10, g, 0, 1.2, 0); cyl(.35, .35, .5, blk, 10, g, 0, .6, 0);
  for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; const l = box(1.8, .2, .35, blk, .08, g, Math.cos(a) * .9, .45, Math.sin(a) * .9); l.rotation.y = -a; sphere(.24, mat(0x2a2a30), g, Math.cos(a) * 1.75, .24, Math.sin(a) * 1.75, 10, 8); }
  return shade(g); }

// ---------- paquete grande (cartón, cinta, pegatinas) ----------
export function bigParcel(parent) { const g = G(parent); const cb = mat(0xffffff, { map: noiseTex('#c8955a', ['#b8854a', '#d4a46a'], 600, 2), roughness: .9 });
  box(3.4, 3.6, 3.0, cb, .1, g, 0, 1.8, 0); box(3.44, .5, 3.04, mat(0xd8b070, { roughness: .5 }), .02, g, 0, 3.4, 0); box(.6, 3.62, 3.04, mat(0xd8b070, { roughness: .5 }), .02, g, 0, 1.8, 0);
  const lab = textPlane(2.6, 1.5, 260, 150, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8202f'; c.fillRect(0, 0, w, 40); txt(c, 'VORSICHT', w / 2, 22, 30, '#ffffff'); txt(c, 'STUHL', w / 2, 82, 50, '#1a1a24'); c.fillStyle = '#1a1a24'; for (let k = 0; k < 20; k++) c.fillRect(24 + k * 11, 112, k % 3 ? 4 : 7, 28); });
  lab.position.set(.2, 1.8, 1.52); g.add(lab);
  const ar = textPlane(1, 1, 64, 64, (c, w, h) => { c.fillStyle = '#1a1a24'; c.beginPath(); c.moveTo(32, 6); c.lineTo(56, 34); c.lineTo(42, 34); c.lineTo(42, 58); c.lineTo(22, 58); c.lineTo(22, 34); c.lineTo(8, 34); c.closePath(); c.fill(); }); ar.position.set(1.51, 2.6, 0); ar.rotation.y = Math.PI / 2; g.add(ar);
  return shade(g); }

// ---------- el Dom (catedral de arenisca roja con dos torres, rosetón y portal) ----------
export function dom(parent, x, z, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry; const st = mat(0xffffff, { map: rep(noiseTex('#b8584a', ['#a84a3e', '#c86a5a', '#9a4234'], 1400, 3), 3, 6), roughness: .85 }), rf = mat(0x3a6a6a, { roughness: .5 }), dk = mat(0x2a1a1a);
  box(34, 40, 30, st, 0, g, 0, 20, -15); const nr = new THREE.Mesh(new THREE.CylinderGeometry(.01, 19, 14, 4, 1, false, Math.PI / 4), rf); nr.scale.set(1.25, 1, 1.1); nr.position.set(0, 47, -15); g.add(nr);
  for (const s of [-1, 1]) { box(12, 70, 12, st, 0, g, s * 17, 35, -2); const sp = new THREE.Mesh(new THREE.ConeGeometry(7.5, 30, 4), rf); sp.position.set(s * 17, 85, -2); sp.rotation.y = Math.PI / 4; g.add(sp); sphere(.9, mat(0xffd23f, { metalness: .8, roughness: .2 }), g, s * 17, 101, -2, 10, 8);
    for (let f = 0; f < 4; f++) { box(3, 8, .4, dk, .05, g, s * 17, 22 + f * 12, 4.1); const ar = new THREE.Mesh(new THREE.CircleGeometry(1.5, 16, 0, Math.PI), dk); ar.position.set(s * 17, 26 + f * 12, 4.12); g.add(ar); }
    const clk = cyl(2.4, 2.4, .4, mat(0xf4ecd8), 24, g, s * 17, 58, 4.2); clk.rotation.x = Math.PI / 2; box(.25, 1.8, .1, dk, 0, g, s * 17, 58.7, 4.5); box(.25, 1.4, .1, dk, 0, g, s * 17 + .5, 57.7, 4.5).rotation.z = 1; }
  const rose = textPlane(10, 10, 256, 256, (c, w, h) => { c.fillStyle = '#2a1a1a'; c.beginPath(); c.arc(128, 128, 126, 0, 7); c.fill(); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; c.fillStyle = ['#d8323a', '#2a6ad8', '#ffd23f', '#2ab86a'][k % 4]; c.beginPath(); c.moveTo(128, 128); c.arc(128, 128, 110, a, a + .45); c.fill(); } c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(128, 128, 26, 0, 7); c.fill(); }, .6);
  rose.position.set(0, 28, .12); g.add(rose); const ring = new THREE.Mesh(new THREE.TorusGeometry(5.2, .6, 8, 32), st); ring.position.set(0, 28, .3); g.add(ring);
  box(9, 13, .6, dk, .1, g, 0, 6.5, .2); const pa = new THREE.Mesh(new THREE.CircleGeometry(4.5, 20, 0, Math.PI), dk); pa.position.set(0, 13, .25); g.add(pa); for (let k = 0; k < 3; k++) box(12 + k * 2, .6, 1.4, mat(0xb8b0a4), .05, g, 0, .3 + k * .0, 1 + k * 1.2);
  box(8.4, 12.4, .3, mat(0x6a3a1a, { roughness: .6 }), .05, g, 0, 6.3, .5);
  const sg = textPlane(12, 2, 480, 80, (c, w, h) => { c.fillStyle = '#f4ecd8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#6a3a1a'; c.lineWidth = 6; c.strokeRect(4, 4, w - 8, h - 8); txt(c, 'DOMPLATZ', w / 2, h / 2 + 4, 52, '#6a3a1a'); }); sg.position.set(0, 16.5, .4); g.add(sg);
  return shade(g); }

// ---------- consulta del dentista ----------
export function zahnarzt(scene, X) { const wall = mat(0xffffff, { map: rep(tiles('#d8f4ee', '#b8e0d8', 4), 6, 3), roughness: .6 }); const g = room(scene, X, 36, 28, 17, wall, mat(0xffffff, { map: rep(tiles('#f4f4f8', '#d8d8e0', 4), 6, 6), roughness: .4 }));
  // lámpara de brazo (encima del paciente en (0, 0)), armario con instrumentos, póster de un diente, ventana
  const arm = G(g, 4, 0, -4); cyl(.3, .3, 13, mat(0xf4f4f4, { metalness: .3 }), 10, arm, 0, 6.5, 0); const a2 = box(7, .4, .4, mat(0xf4f4f4), .1, arm, -3.5, 13, 0); a2.rotation.z = -.15; const lp = G(arm, -6.6, 11.4, 1.2); box(2.4, .8, 1.4, mat(0xf4f4f4), .3, lp, 0, 0, 0); box(1.8, .2, 1.0, basicGlow(0xfff8e0, 2.4), .05, lp, 0, -.45, 0);
  const LL = new THREE.SpotLight(0xfff4e0, 300, 30, .6, .5, 1.3); LL.position.set(X - 2.6, 11, -2.8); LL.target.position.set(X, 3, 0); scene.add(LL, LL.target); LL.visible = false;
  const cab = G(g, -12, 0, -11); box(10, 6, 3.6, mat(0xffffff, { roughness: .3 }), .1, cab, 0, 3, 0); box(10.4, .4, 4, mat(0x9ad8d0), .05, cab, 0, 6.2, 0); for (let k = 0; k < 3; k++) box(2.8, 2.4, .1, mat(0xe8f4f2), .05, cab, -3.3 + k * 3.3, 3.2, 1.82);
  for (let k = 0; k < 6; k++) { const t = cyl(.08, .08, 1.4, mat(0xc8ccd4, { metalness: .9, roughness: .2 }), 6, cab, -3 + k * .5, 6.9, .6); t.rotation.z = .2; }
  const tray = G(g, -4, 0, 3); box(3, .2, 2, mat(0xc8ccd4, { metalness: .8, roughness: .3 }), .05, tray, 0, 5.2, 0); cyl(.12, .12, 5.2, mat(0xc8ccd4, { metalness: .8 }), 8, tray, 0, 2.6, 0); for (let k = 0; k < 4; k++) box(.1, .1, 1.4, mat(0x8a8e98, { metalness: .9 }), .02, tray, -1 + k * .6, 5.4, 0);
  const tooth = textPlane(6, 8, 240, 320, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#3ab8c8'; c.fillRect(0, 0, w, 60); txt(c, 'ZAHNARZT', w / 2, 32, 40, '#ffffff'); c.fillStyle = '#f4f4f8'; c.strokeStyle = '#3a5a7a'; c.lineWidth = 8; c.beginPath(); c.moveTo(60, 110); c.quadraticCurveTo(120, 80, 180, 110); c.quadraticCurveTo(200, 180, 170, 270); c.lineTo(150, 270); c.lineTo(130, 200); c.lineTo(110, 200); c.lineTo(90, 270); c.lineTo(70, 270); c.quadraticCurveTo(40, 180, 60, 110); c.fill(); c.stroke();
    c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(100, 150, 8, 0, 7); c.arc(140, 150, 8, 0, 7); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 5; c.beginPath(); c.arc(120, 165, 18, .3, 2.8); c.stroke(); });
  tooth.position.set(9, 9.5, -13.75); g.add(tooth);
  const win = textPlane(8, 6, 256, 192, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6ab8ff'); gr.addColorStop(1, '#cfeaff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#5fcf4a'; c.fillRect(0, h * .75, w, h * .25); c.fillStyle = '#e8c89a'; c.fillRect(30, h * .4, 60, h * .35); c.fillStyle = '#c8402a'; c.beginPath(); c.moveTo(24, h * .4); c.lineTo(60, h * .2); c.lineTo(96, h * .4); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(w / 2 - 3, 0, 6, h); c.fillRect(0, h / 2 - 3, w, 6); }, .5);
  win.position.set(-17.75, 9, 2); win.rotation.y = Math.PI / 2; g.add(win); box(.3, 6.6, 8.6, mat(0xffffff), .05, g, -17.8, 9, 2);
  for (let k = 0; k < 3; k++) { const p = cyl(.6, .5, 1.6, mat([0xd8323a, 0x3ab8c8, 0xffd23f][k], { roughness: .5 }), 12, g, 14, .8, -10 + k * 2); sphere(1, mat(0x3a9a3a), g, 14, 2.3, -10 + k * 2, 10, 8); }
  const L = new THREE.PointLight(0xffffff, 160, 50, 1.3); L.position.set(0, 14, 4); g.add(L); return { g: shade(g), LL, lamp: lp }; }

// ---------- interior del tranvía (el pasillo va en z; ventanas a ambos lados con la ciudad que pasa) ----------
export function tramIn(scene, X) { const g = G(scene, X); const y = mat(0xffd23f, { roughness: .4 }), wh = mat(0xf4f4f4, { roughness: .5 }), fl = mat(0xffffff, { map: rep(noiseTex('#4a4e5a', ['#3e424e', '#565a66'], 900, 2), 2, 6), roughness: .9 });
  const Wd = 9, Ld = 44; box(Wd, .4, Ld, fl, 0, g, 0, -.2, 0); box(Wd, .4, Ld, wh, 0, g, 0, 11.2, 0);
  // paredes: zócalo amarillo, ventanas grandes (huecos) y franja de arriba
  for (const s of [-1, 1]) { box(.4, 3.2, Ld, y, .05, g, s * Wd / 2, 1.6, 0); box(.4, 2.2, Ld, wh, .05, g, s * Wd / 2, 10.0, 0); for (let k = -5; k <= 5; k++) box(.5, 5.8, .6, y, .05, g, s * Wd / 2, 6.1, k * 4); }
  for (const s of [-1, 1]) box(Wd, 11, .4, y, 0, g, 0, 5.5, s * Ld / 2);
  // barras amarillas verticales y asideros
  const pole = mat(0xffd23f, { metalness: .5, roughness: .3 }); for (let k = -4; k <= 4; k++) for (const s of [-1, 1]) cyl(.13, .13, 11, pole, 8, g, s * 2.6, 5.5, k * 4 + 2); for (const s of [-1, 1]) { const r = cyl(.1, .1, Ld, pole, 6, g, s * 2.6, 9.6, 0); r.rotation.x = Math.PI / 2; }
  for (let k = -8; k <= 8; k++) for (const s of [-1, 1]) { const h_ = new THREE.Mesh(new THREE.TorusGeometry(.35, .06, 6, 16), mat(0xf4f4f4)); h_.position.set(s * 2.6, 8.7, k * 2.4); g.add(h_); cyl(.04, .04, .6, mat(0xf4f4f4), 4, g, s * 2.6, 9.2, k * 2.4); }
  // pantalla de línea
  const sg = textPlane(5, 1.1, 400, 88, (c, w, h) => { c.fillStyle = '#101018'; c.fillRect(0, 0, w, h); txt(c, '3  Domplatz', w / 2, h / 2 + 4, 52, '#ffb02a'); }, 1); sg.position.set(0, 9.6, -Ld / 2 + .25); g.add(sg);
  // la ciudad que pasa: fachadas dibujadas en dos cintas fuera de las ventanas (se desplazan con offset)
  const cityT = canvasTex(1024, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5aa8ff'); gr.addColorStop(1, '#cfeaff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); const r = RNG(12);
    for (let x = 0; x < w;) { const bw = 70 + r() * 60, bh = 120 + r() * 110; c.fillStyle = ['#f4e4c0', '#f8d0b8', '#d8e8f4', '#f4f0d8', '#e8c8d8'][(r() * 5) | 0]; c.fillRect(x, h - bh, bw - 4, bh); c.fillStyle = ['#c8402a', '#8a3a2a', '#3a6a8a'][(r() * 3) | 0]; c.beginPath(); c.moveTo(x - 4, h - bh); c.lineTo(x + bw / 2, h - bh - 40); c.lineTo(x + bw, h - bh); c.fill();
      c.fillStyle = '#4a3020'; for (let yy = h - bh + 20; yy < h - 30; yy += 36) for (let xx = x + 10; xx < x + bw - 20; xx += 26) { c.fillStyle = '#7ab8e8'; c.fillRect(xx, yy, 14, 20); c.fillStyle = '#ffffff'; c.fillRect(xx + 6, yy, 2, 20); } x += bw; }
    c.fillStyle = '#3a8a3a'; for (let x = 0; x < w; x += 140) { c.beginPath(); c.arc(x + 40, h - 30, 26, 0, 7); c.fill(); } c.fillStyle = '#8a8e98'; c.fillRect(0, h - 10, w, 10); }, true);
  const tapes = [-1, 1].map(s => { const t = cityT.clone(); t.needsUpdate = true; t.wrapS = THREE.RepeatWrapping; t.repeat.set(3, 1); const m = new THREE.Mesh(new THREE.PlaneGeometry(Ld * 2.2, 22), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.position.set(s * (Wd / 2 + 7), 7, 0); m.rotation.y = -s * Math.PI / 2; g.add(m); return t; });
  const L = new THREE.PointLight(0xfff4e0, 120, 60, 1.2); L.position.set(0, 10, 0); g.add(L);
  return { g: shade(g), scroll: T => tapes.forEach((t, i) => t.offset.x = (i ? -1 : 1) * T * .06), W: Wd, L: Ld }; }

// ---------- mi cuarto: escritorio con portátil (tienda online), cama, ventana ----------
export function shopScreen(w = 640, h = 400) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  // fase: 0 = página del producto, 1 = botón pulsado, 2 = «BESTELLT ✓»
  const draw = (ph, k = 0) => { x.fillStyle = '#f4f6fa'; x.fillRect(0, 0, w, h); x.fillStyle = '#2a3a8a'; x.fillRect(0, 0, w, 54); txt(x, 'STUHL-SHOP', 120, 30, 30, '#ffd23f'); x.fillStyle = '#ffffff'; x.beginPath(); x.roundRect(250, 12, 330, 30, 15); x.fill(); txt(x, 'Stuhl mit Lehne', 400, 28, 18, '#6a6e7a');
    // la silla dibujada
    x.save(); x.translate(150, 230); x.fillStyle = '#1a1a22'; x.beginPath(); x.roundRect(-60, -150, 120, 170, 20); x.fill(); x.fillStyle = '#ff7a1a'; x.fillRect(-45, -140, 22, 150); x.fillRect(23, -140, 22, 150); x.fillStyle = '#1a1a22'; x.beginPath(); x.roundRect(-75, 15, 150, 34, 12); x.fill(); x.fillRect(-6, 48, 12, 50); x.fillRect(-60, 96, 120, 10); x.fillStyle = '#3a3a44'; for (const s of [-1, 0, 1]) { x.beginPath(); x.arc(s * 55, 112, 9, 0, 7); x.fill(); } x.restore();
    txt(x, 'Stuhl mit Lehne', 440, 100, 34, '#1a1a24'); for (let i = 0; i < 5; i++) txt(x, '★', 340 + i * 30, 140, 28, '#ffb02a'); txt(x, '89,99 €', 440, 190, 52, '#d8202f');
    const press = ph >= 1; x.fillStyle = ph >= 2 ? '#1ab84a' : press ? '#e8a010' : '#ffb02a'; x.beginPath(); x.roundRect(330, 250 + (press && ph < 2 ? 4 : 0), 230, 70, 18); x.fill(); txt(x, ph >= 2 ? 'BESTELLT ✓' : 'KAUFEN', 445, 288 + (press && ph < 2 ? 4 : 0), 38, '#ffffff');
    if (ph >= 2) { x.fillStyle = `rgba(26,184,74,${.15 * Math.min(1, k * 3)})`; x.fillRect(0, 54, w, h - 54); }
    tex.needsUpdate = true; };
  draw(0); return { tex, draw }; }
export function zimmerF(scene, X, scr) { const wall = mat(0xffffff, { map: rep(stripes('#8ab4e8', '#7aa4dc', 10), 6, 1), roughness: .9 }); const g = room(scene, X, 36, 28, 17, wall, mat(0xffffff, { map: rep(plank(), 5, 5) }));
  const desk = G(g, 0, 0, -9); box(12, .4, 5, mat(0xd8b88a, { roughness: .6 }), .05, desk, 0, 4.4, 0); for (const s of [-1, 1]) box(.4, 4.4, 4.6, mat(0xc8a87a), .05, desk, s * 5.6, 2.2, 0);
  // monitor grande con la tienda
  const mon = G(desk, 0, 4.6, -1); box(8.4, 5.2, .4, mat(0x1a1a22), .1, mon, 0, 3.6, 0); const s_ = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 4.8), new THREE.MeshBasicMaterial({ map: scr.tex, toneMapped: false })); s_.position.set(0, 3.6, .22); mon.add(s_); box(.6, 1.2, .4, mat(0x1a1a22), .05, mon, 0, .6, 0); box(3, .2, 1.6, mat(0x1a1a22), .05, mon, 0, .1, 0);
  box(4.4, .2, 1.4, mat(0x2a2a34), .05, desk, -.4, 4.7, 1.2); box(.9, .2, 1.3, mat(0x2a2a34), .2, desk, 3.4, 4.7, 1.2); const lmp = G(desk, -5, 4.6, -.6); cyl(.12, .12, 3, mat(0x2a2a34), 6, lmp, 0, 1.5, 0); box(1.4, .6, .9, mat(0xffd23f), .2, lmp, .4, 3, 0);
  // estante con figuras, póster, cama, ventana
  box(8, .3, 1.6, mat(0xd8b88a), .05, g, -10, 11, -13); for (let k = 0; k < 5; k++) box(.9, 1.4, .9, mat([0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0xff8ad0][k]), .2, g, -13 + k * 1.5, 11.9, -13);
  const pst = textPlane(6, 8, 192, 256, (c, w, h) => { c.fillStyle = '#1a1a3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(96, 110, 60, 0, 7); c.fill(); txt(c, 'SPACE', w / 2, 210, 40, '#ffffff'); }); pst.position.set(11, 10, -13.75); g.add(pst);
  const bed = G(g, 13, 0, 4); box(8, 2.4, 13, mat(0x6a4a2a), .1, bed, 0, 1.2, 0); box(7.6, 1.2, 12.6, mat(0xf4f4f4), .3, bed, 0, 2.8, 0); box(7.8, .6, 8, mat(0x3a6ad8, { roughness: .9 }), .2, bed, 0, 3.5, 2); box(5, .9, 2.4, mat(0xffffff), .4, bed, 0, 3.6, -4.6);
  const L = new THREE.PointLight(0xfff0d8, 150, 50, 1.3); L.position.set(0, 14, 4); g.add(L); return { g: shade(g), desk, mon }; }

// ---------- la cueva bajo la ciudad: bóveda de roca morada, botellas que asoman del techo, ojos lila ----------
export function hoehle(scene, X) { const g = G(scene, X); const rock = mat(0xffffff, { map: rep(noiseTex('#2a1838', ['#1e1028', '#3a2250', '#24142e'], 1600, 4), 6, 4), roughness: .95, side: THREE.BackSide });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(70, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), rock); dome.scale.set(1, .5, 1); g.add(dome);
  const fl = new THREE.Mesh(new THREE.CircleGeometry(70, 40), mat(0xffffff, { map: rep(noiseTex('#3a1a4a', ['#4a2260', '#2a1238', '#5a2a78'], 1600, 4), 6, 6), roughness: .3, metalness: .2 })); fl.rotation.x = -Math.PI / 2; g.add(fl);
  // rocas del suelo y estalagmitas
  const r = RNG(5); for (let k = 0; k < 40; k++) { const a = r() * 6.283, d = 18 + r() * 45; const s = sphere(2 + r() * 4, mat(0x2a1838, { roughness: .9 }), g, Math.cos(a) * d, 0, Math.sin(a) * d, 8, 6); s.scale.y = .6 + r(); }
  for (let k = 0; k < 30; k++) { const a = r() * 6.283, d = 10 + r() * 50; const c = new THREE.Mesh(new THREE.ConeGeometry(1 + r() * 1.5, 6 + r() * 10, 6), mat(0x241430, { roughness: .9 })); c.position.set(Math.cos(a) * d, 30 - d * .25, Math.sin(a) * d); c.rotation.x = Math.PI; g.add(c); }
  // las botellas del techo (se ve el fondo y el cuerpo, cabeza abajo), con un halo lila
  const BOT = []; for (let k = 0; k < 46; k++) { const a = r() * 6.283, d = 4 + r() * 46; const y = Math.sqrt(Math.max(0, 1 - (d / 70) ** 2)) * 35 - .5; const b = bottle(g, k); b.userData.collar.visible = false; b.position.set(Math.cos(a) * d, y + 1.2, Math.sin(a) * d); b.rotation.x = Math.PI; b.scale.setScalar(1.4); BOT.push(b); }
  // charcos de baba lila que brillan
  for (let k = 0; k < 14; k++) { const a = r() * 6.283, d = 6 + r() * 40; const p = new THREE.Mesh(new THREE.CircleGeometry(2 + r() * 3, 18), basicGlow(LILA, .9)); p.rotation.x = -Math.PI / 2; p.position.set(Math.cos(a) * d, .05, Math.sin(a) * d); g.add(p); }
  // ojos: pares de ojos grandes (esclerótica lila brillante, pupila de rendija) que se abren y parpadean
  const EYES = []; const eyeM = basicGlow(0xd890ff, 2.6), pupM = new THREE.MeshBasicMaterial({ color: 0x0a0010 });
  for (const [x, y, z, s] of [[0, 10, -40, 4.2], [-24, 6, -30, 2.4], [22, 7, -32, 2.6], [-36, 12, -12, 1.8], [34, 11, -14, 1.9], [-12, 3, -22, 1.5], [12, 4, -24, 1.4]]) {
    const e = G(g, x, y, z); e.lookAt(0, 6, 30); e.position.set(x, y, z); for (const sd of [-1, 1]) { const w = sphere(1, eyeM, e, sd * 1.5, 0, 0, 20, 14); w.scale.set(1.1, .8, .5); const p = box(.28, 1.3, .2, pupM, .1, e, sd * 1.5, 0, .5); }
    e.scale.setScalar(s); e.userData.s = s; EYES.push(e); }
  const L = new THREE.PointLight(LILA, 900, 160, 1.2); L.position.set(0, 20, 0); g.add(L); const L2 = new THREE.PointLight(0x7a3aff, 500, 120, 1.2); L2.position.set(0, 6, -30); g.add(L2);
  return { g, BOT, EYES, open(T, k = 1) { EYES.forEach((e, i) => { const bl = Math.sin(T * 1.3 + i * 2.1) > .96 ? .1 : 1; e.scale.set(e.userData.s, e.userData.s * Math.max(.05, k * bl), e.userData.s); }); } }; }

// ---------- sótano (piedra, bombilla colgando, cajas) ----------
export function sotano(scene, X) { const st = mat(0xffffff, { map: rep(noiseTex('#6a6058', ['#5a5048', '#7a7068', '#4a4038'], 1400, 3), 5, 2), roughness: .95 }); const g = room(scene, X, 30, 26, 15, st, mat(0xffffff, { map: rep(noiseTex('#5a5a5e', ['#4a4a4e', '#6a6a6e'], 1200, 3), 4, 4), roughness: .95 }), 0x3a342e);
  for (let k = 0; k < 5; k++) box(30, .8, .8, mat(0x4a2e18), .05, g, 0, 14.4, -10 + k * 5);
  const r = RNG(9); for (let k = 0; k < 7; k++) { const c = box(2.4 + r() * 1.6, 2 + r() * 1.4, 2.4, mat(0xffffff, { map: noiseTex('#b8854a', ['#a8753a', '#c8955a'], 400, 2), roughness: .9 }), .08, g, -11 + (k % 3) * 2.8, 1.2 + Math.floor(k / 3) * 2.4, -11 + (k % 2) * .5); }
  box(1.6, 12, 6, mat(0x6a4a2a), .05, g, 13.6, 6, -6); for (let k = 0; k < 3; k++) box(1.4, .25, 6, mat(0x8a6a4a), .05, g, 13.4, 3 + k * 3.6, -6); for (let k = 0; k < 6; k++) cyl(.35, .35, 1.2, mat([0x3a8a3a, 0x8a4a1a][k % 2], { roughness: .1, transparent: true, opacity: .8 }), 10, g, 13.2, 3.8 + Math.floor(k / 2) * 3.6, -8 + (k % 2) * 2);
  const BULB = G(g, 0, 15, 0); cyl(.03, .03, 3, mat(0x1a1a1a), 4, BULB, 0, -1.5, 0); sphere(.45, basicGlow(0xffd890, 2.2), BULB, 0, -3.2, 0, 12, 8); const BL = new THREE.PointLight(0xffc880, 140, 40, 1.4); BL.position.y = -3.4; BULB.add(BL);
  const stairs = G(g, -10, 0, 8); for (let k = 0; k < 8; k++) box(5, .5, 1.6, mat(0x6a4a2a), .05, stairs, 0, k * 1.6 + .25, -k * 1.4 + 4);
  return { g: shade(g), BULB }; }
