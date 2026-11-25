// LISPELN — escenarios propios: señal «S verboten» (y R, L), pórtico sobre la carretera, ayuntamiento de Zischelbach con balcón,
// torre y escalinata, robot gigante dorado del alcalde, sala de ensayo con telón rojo, tienda de videojuegos, pantallas gigantes, salón con tele.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree } from './props.js';
import { alpHaus, laterne, mountains, glowM, shade } from './nsets.js';
import { cobbleTex } from './diam.js';
import { glass } from './pech.js';
export const FONT = 'Cap, sans-serif';
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const plane = (w, d, m, p, x, y, z) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); me.rotation.x = -Math.PI / 2; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const plankT = (a = '#7a4a26', b = '#5e3818') => canvasTex(128, 128, (c, w, h) => { const r = RNG(3); for (let x = 0; x < w; x += 16) { c.fillStyle = r() < .5 ? a : b; c.fillRect(x, 0, 16, h); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x, 0, 2, h); } }, true);
const grassT = () => noiseTex('#4e9a3a', ['#3f8a30', '#5aa846', '#477f32', '#62a84c'], 5200, 2, 1);

// ---------- señal de prohibido: disco blanco con borde rojo, barra roja diagonal y la letra amarilla con contorno ----------
export function drawBan(c, x, y, r, letter, k = 1) { c.save(); c.translate(x, y); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
  c.font = `700 ${r * 1.35}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = r * .14; c.strokeStyle = '#2a1a00'; c.strokeText(letter, 0, r * .06); c.fillStyle = '#ffd21a'; c.fillText(letter, 0, r * .06);
  c.lineWidth = r * .2; c.strokeStyle = '#e8141e'; c.beginPath(); c.arc(0, 0, r * .9, 0, 7); c.stroke(); if (k > 0) { c.beginPath(); const a = .785, L = r * .9 * k; c.moveTo(-Math.cos(a) * r * .9, -Math.sin(a) * r * .9); c.lineTo(-Math.cos(a) * r * .9 + Math.cos(a) * 2 * L, -Math.sin(a) * r * .9 + Math.sin(a) * 2 * L); c.stroke(); } c.restore(); }
export function banSign(parent, letter, r = 4) { const g = G(parent); const d = cyl(r, r, .5, mat(0xf4f4f4, { roughness: .4 }), 40, g, 0, 0, 0); d.rotation.x = Math.PI / 2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r * .92, r * .1, 12, 48), mat(0xe8141e, { roughness: .35 })); ring.position.z = .3; g.add(ring);
  const f = textPlane(r * 1.8, r * 1.8, 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.font = `700 190px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = 18; c.strokeStyle = '#3a2400'; c.strokeText(letter, w / 2, h / 2 + 10); c.fillStyle = '#ffd21a'; c.fillText(letter, w / 2, h / 2 + 10); });
  f.material.transparent = true; f.position.z = .27; g.add(f); const bar = box(r * 1.8, r * .2, .3, mat(0xe8141e, { roughness: .35 }), .05, g, 0, 0, .42); bar.rotation.z = -.785;
  const back = cyl(r * 1.02, r * 1.02, .3, mat(0x9aa0a8, { metalness: .7, roughness: .3 }), 40, g, 0, 0, -.35); back.rotation.x = Math.PI / 2; g.userData = { bar, ring }; return shade(g); }
// pórtico sobre la carretera con la señal colgada en el centro
export function gantry(parent, x, z, letter = 'S') { const g = G(parent, x, 0, z); const st = mat(0x8e949c, { metalness: .75, roughness: .35 });
  for (const s of [-1, 1]) { cyl(.5, .6, 15, st, 12, g, s * 11, 7.5, 0); box(1.8, .6, 1.8, mat(0x6a6e76), .1, g, s * 11, .3, 0); }
  box(23, .6, .6, st, .1, g, 0, 14.6, .5); box(23, .6, .6, st, .1, g, 0, 14.6, -.5); for (let k = -10; k <= 10; k += 2) { const d = box(.2, 1.4, .2, st, 0, g, k, 14.6, 0); d.rotation.z = k % 4 ? .6 : -.6; }
  const S = banSign(g, letter, 4.2); S.position.set(0, 9.6, .6); for (const s of [-1, 1]) cyl(.08, .08, 1.4, st, 6, g, s * 1.6, 13.8, .6); g.userData.sign = S; return shade(g); }

// ---------- pantalla gigante (marco negro, patas) con textura dibujable ----------
export function bigScreen(parent, w = 16, h = 9, pw = 640, ph = 360) { const g = G(parent); const cv = document.createElement('canvas'); cv.width = pw; cv.height = ph; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.position.set(0, h / 2 + 8, .32); g.add(m);
  box(w + 1, h + 1, .6, mat(0x16161c, { metalness: .5, roughness: .4 }), .2, g, 0, h / 2 + 8, 0); for (const s of [-1, 1]) cyl(.4, .5, 8.5, mat(0x2a2a30, { metalness: .6 }), 10, g, s * w * .32, 4.2, 0); box(w * .7, .5, .5, mat(0x2a2a30, { metalness: .6 }), .05, g, 0, 7.8, 0);
  let key = null; g.userData.draw = (k, fn) => { if (k === key) return; key = k; const c = cv.getContext('2d'); c.clearRect(0, 0, pw, ph); fn(c, pw, ph); t.needsUpdate = true; }; return shade(g); }

// ---------- robot gigante dorado del alcalde (≈ 34 de alto); bigote y cadena como el alcalde; altavoz en el pecho ----------
export function robot(parent) { const g = G(parent); const go = mat(0xe8b030, { metalness: .85, roughness: .25 }), dk = mat(0x3a3a44, { metalness: .7, roughness: .35 }), wh = mat(0xf4f0e8, { roughness: .4 });
  const legs = []; for (const s of [-1, 1]) { const L = G(g, s * 3.2, 12, 0); box(3.2, 12, 3.4, go, .4, L, 0, -6, 0); box(3.8, 1.6, 5, dk, .3, L, 0, -11.4, .6); cyl(1.6, 1.6, 3.6, dk, 16, L, 0, -6, 0).rotation.z = Math.PI / 2; legs.push(L); }
  const body = G(g, 0, 12, 0); box(11, 11, 6.4, go, .9, body, 0, 6.5, 0); box(11.4, 1.2, 6.8, dk, .2, body, 0, 1.3, 0);
  const spk = G(body, 0, 7, 3.25); cyl(2.4, 2.4, .4, dk, 28, spk, 0, 0, 0).rotation.x = Math.PI / 2; for (let k = 0; k < 4; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.6 + k * .45, .08, 6, 28), mat(0x9a9aa4, { metalness: .9 })); r.position.z = .25; spk.add(r); }
  for (let k = 0; k < 4; k++) box(.9, .5, .3, glowM([0xff3a3a, 0x3aff6a, 0xffd23f, 0x3ab8ff][k], 1.6), .1, body, -3.6 + k * 2.4, 2.6, 3.25);
  // cadena dorada sobre el pecho
  for (let k = 0; k < 13; k++) { const a = Math.PI * (k / 12); const l = new THREE.Mesh(new THREE.TorusGeometry(.4, .14, 8, 12), mat(0xffd23f, { metalness: .95, roughness: .15 })); l.position.set(Math.cos(a) * 4.2, 11.6 - Math.sin(a) * 3, 3.3); body.add(l); }
  const arms = []; for (const s of [-1, 1]) { const sh = G(body, s * 6.4, 10.4, 0); sphere(1.9, dk, sh, 0, 0, 0, 16, 12); const up = box(2.4, 7, 2.4, go, .4, sh, s * .4, -4, 0); const fo = G(sh, s * .4, -7.6, 0); box(2.2, 6, 2.2, go, .4, fo, 0, -3, 0); const hand = G(fo, 0, -6.6, 0); box(2.8, 2.2, 1.6, dk, .5, hand, 0, -.6, 0); for (let k = 0; k < 3; k++) box(.6, 1.6, .6, dk, .2, hand, -.8 + k * .8, -2, .4); arms.push({ sh, fo, hand }); }
  const head = G(body, 0, 13, 0); cyl(1.4, 1.6, 1.8, dk, 16, head, 0, .4, 0); box(8, 6.6, 6, go, 1.2, head, 0, 4.6, 0);
  const visor = box(6.4, 2.2, .4, glowM(0x6ad8ff, .9), .4, head, 0, 5.4, 3.0); const eyes = []; for (const s of [-1, 1]) { eyes.push(sphere(.65, glowM(0xffffff, 2.5), head, s * 1.6, 5.4, 3.3, 14, 10)); }
  const st = mat(0x7a6a5a, { metalness: .5, roughness: .5 }); for (const s of [-1, 1]) { const m = box(2.6, .6, .5, st, .25, head, s * 1.3, 3.4, 3.15); m.rotation.z = s * -.18; const c = new THREE.Mesh(new THREE.TorusGeometry(.45, .2, 8, 14, 4.2), st); c.position.set(s * 2.9, 3.8, 3.15); c.rotation.z = s > 0 ? 3.6 : -.4; head.add(c); }
  const mouth = box(3.2, .5, .3, dk, .15, head, 0, 2.3, 3.05); cyl(.18, .18, 3, dk, 8, head, 0, 9.4, 0); const ant = sphere(.6, glowM(0xff3a3a, 2.2), head, 0, 11.1, 0, 12, 10);
  g.userData = { body, head, arms, legs, eyes, mouth, ant, visor }; return shade(g); }
// pose del robot: brazo derecho arriba (discurso) con a ∈ [0, 1]; boca que se abre con talk
export function robotPose(R, T, a = .6, talk = 0) { const u = R.userData; u.arms[0].sh.rotation.set(-.2, 0, -.25 - .1 * Math.sin(T * 1.3)); u.arms[1].sh.rotation.set(-a * 2.2, 0, .35 + .2 * Math.sin(T * 2)); u.arms[1].fo.rotation.x = -a * .6;
  u.head.rotation.y = Math.sin(T * .7) * .18; u.head.rotation.x = Math.sin(T * 1.1) * .05; u.mouth.scale.y = 1 + talk * (1 + Math.sin(T * 26)) * 1.4; u.ant.material.emissiveIntensity = 1.5 + Math.sin(T * 8) * 1; u.body.rotation.y = Math.sin(T * .5) * .05; }

// ---------- Zischelbach: plaza del ayuntamiento (X). Rathaus al norte con la fachada en z = -30 (balcón central a y = 15, puerta en (0, -30)),
// torre con reloj, escalinata, banderas, farolas y casas alpinas alrededor; escenario con el robot en (0, -14); pantallas a los lados.
export function rathausPlatz(scene, X) { const g = G(scene, X);
  plane(2000, 2000, mat(0xffffff, { roughness: 1, map: rep(grassT(), 140, 140) }), g, 0, -.04, 0);
  const ct = cobbleTex(); ct.repeat.set(26, 26); plane(130, 130, mat(0xffffff, { roughness: .85, map: ct }), g, 0, .02, 10);
  const R = G(g, 0, 0, -44); const wall = mat(0xffffff, { map: rep(noiseTex('#f4ead4', ['#ece0c6', '#faf2e2'], 1600, 3, 1), 6, 3), roughness: .85 }), trim = mat(0xd8c8a0, { roughness: .7 }), rf = mat(0x2f6a6a, { roughness: .5, metalness: .2 });
  box(76, 28, 26, wall, 0, R, 0, 14, 0); box(78, 1.2, 28, trim, .1, R, 0, 28.4, 0); box(77, 1, 27, trim, .1, R, 0, 9.2, 0);
  { const sh = new THREE.Shape(); sh.moveTo(-40, 0); sh.lineTo(-34, 9); sh.lineTo(34, 9); sh.lineTo(40, 0); const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 28, bevelEnabled: false }), rf); roof.position.set(0, 29, -14); R.add(roof); }
  // ventanas con contraventanas verdes y jardineras
  for (let f = 0; f < 2; f++) for (let i = 0; i < 9; i++) { const x = -32 + i * 8; if (f === 1 && Math.abs(x) < 6) continue; const y = 14 + f * 8.5; box(4.2, 5.6, .4, glass(), .1, R, x, y, 13.1); box(5, .5, .8, trim, .05, R, x, y - 3.1, 13.3); box(5, .7, .7, trim, .05, R, x, y + 3.2, 13.3);
    for (const s of [-1, 1]) box(1.5, 5.6, .25, mat(0x2f6a3a), .05, R, x + s * 2.95, y, 13.3); for (let j = 0; j < 5; j++) sphere(.4, mat(j % 2 ? 0xe8202a : 0xff6a8a), R, x - 1.6 + j * .8, y - 2.5, 13.7, 8, 6); }
  for (let i = 0; i < 9; i++) { const x = -32 + i * 8; if (Math.abs(x) < 6) continue; box(4.2, 5, .4, glass(), .1, R, x, 4.4, 13.1); }
  // portal y escalinata
  box(10, 9, .6, mat(0x5a3218, { roughness: .6 }), .3, R, 0, 4.5, 13.2); box(12, 1, 1.4, trim, .1, R, 0, 9.4, 13.4); for (let k = 0; k < 4; k++) box(22 - k * 2, .6, 3, mat(0xc8c0b0), .05, R, 0, .3 + k * .6, 19.5 - k * 1.4);
  const plate = textPlane(18, 2.6, 720, 104, (c, w, h) => { c.fillStyle = '#1a3a6a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'RATHAUS ZISCHELBACH', w / 2, h / 2 + 3, 62, '#ffd23f'); }); plate.position.set(0, 26, 13.32); R.add(plate);
  // balcón central (y = 15) con barandilla blanca y puerta-ventana; el alcalde se asoma aquí
  const BAL = G(R, 0, 15, 13); box(16, .8, 5, trim, .1, BAL, 0, 0, 2.4); for (let k = -7.5; k <= 7.5; k += .9) cyl(.16, .2, 2.6, mat(0xf8f8f4), 8, BAL, k, 1.7, 4.7); box(16.4, .5, .6, mat(0xf8f8f4), .1, BAL, 0, 3.1, 4.7); for (const s of [-1, 1]) for (let k = 0; k < 4; k++) cyl(.16, .2, 2.6, mat(0xf8f8f4), 8, BAL, s * 7.9, 1.7, 1 + k * 1.2);
  box(6, 7.6, .3, glass(), .1, BAL, 0, 4.2, .12); box(7, .6, .8, trim, .05, BAL, 0, 8.3, .3); for (const s of [-1, 1]) { const f = G(BAL, s * 9.5, 0, 1); cyl(.12, .12, 9, mat(0xd8d8d8, { metalness: .7 }), 6, f, 0, 4, 0).rotation.z = s * -.5; const fl = textPlane(4.4, 2.8, 110, 70, (c, w, h) => { c.fillStyle = '#1a6a3a'; c.fillRect(0, 0, w, h / 2); c.fillStyle = '#f4f4f4'; c.fillRect(0, h / 2, w, h / 2); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h / 2, 16, 0, 7); c.fill(); }); fl.position.set(s * 4.6, 7.6, 0); fl.rotation.z = s * -.5; f.add(fl); }
  const BANS = G(BAL, 0, 0, 0); BANS.visible = false; for (const [i, L] of [[-1, 'R'], [1, 'L']]) { const b = banSign(BANS, L, 2.2); b.position.set(i * 4.2, 6.6, 5.2); }
  // torre del reloj
  const T = G(R, 0, 37, 0); box(14, 18, 14, wall, 0, T, 0, 0, 0); box(15, 1, 15, trim, .1, T, 0, 9.2, 0); const clk = textPlane(9, 9, 180, 180, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(90, 90, 86, 0, 7); c.fill(); c.lineWidth = 8; c.strokeStyle = '#1a1a1a'; c.stroke(); c.fillStyle = '#1a1a1a'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.fillRect(90 + Math.cos(a) * 70 - 4, 90 + Math.sin(a) * 70 - 4, 8, 8); } c.lineCap = 'round'; c.lineWidth = 8; c.beginPath(); c.moveTo(90, 90); c.lineTo(90, 36); c.moveTo(90, 90); c.lineTo(126, 104); c.stroke(); }); clk.position.set(0, 1, 7.05); T.add(clk);
  const dome = new THREE.Mesh(new THREE.ConeGeometry(10.5, 14, 4), rf); dome.position.y = 16.5; dome.rotation.y = .785; T.add(dome); cyl(.3, .3, 6, mat(0xffd23f, { metalness: .9 }), 8, T, 0, 26, 0); sphere(.9, mat(0xffd23f, { metalness: .9, roughness: .2 }), T, 0, 29, 0, 12, 8);
  // fachada visible en z = -30 (X + 0, -30): alas laterales más bajas
  for (const s of [-1, 1]) { const W = G(g, s * 62, 0, -40); box(46, 20, 22, wall, 0, W, 0, 10, 0); box(47, 1, 23, trim, .1, W, 0, 20.4, 0); const sh = new THREE.Shape(); sh.moveTo(-24, 0); sh.lineTo(-20, 7); sh.lineTo(20, 7); sh.lineTo(24, 0); const r = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 24, bevelEnabled: false }), rf); r.position.set(0, 21, -12); W.add(r);
    for (let f = 0; f < 2; f++) for (let i = 0; i < 5; i++) { box(4, 5, .4, glass(), .1, W, -18 + i * 9, 5 + f * 8, 11.1); for (const q of [-1, 1]) box(1.4, 5, .25, mat(0x2f6a3a), .05, W, -18 + i * 9 + q * 2.8, 5 + f * 8, 11.3); } }
  // casas alrededor de la plaza (oeste, este, sur) y montañas
  let ci = 0; for (let z = 50; z > -16;) { const wid = 15 + (ci * 7) % 5; alpHaus(g, -64, z - wid / 2, wid, 2 + ci % 2, ci + 2, Math.PI / 2); alpHaus(g, 64, z - wid / 2, wid, 2 + (ci + 1) % 2, ci + 5, -Math.PI / 2); z -= wid + .5; ci++; }
  for (let x = -48; x <= 48; x += 17) { if (Math.abs(x) < 9) continue; alpHaus(g, x, 84, 16, 2 + ci % 2, ci++, Math.PI); }
  for (const [x, z] of [[-40, 30], [40, 30], [-40, -8], [40, -8], [-20, 56], [20, 56]]) laterne(g, x, z); for (const [x, z] of [[-48, 62], [48, 62]]) tree(g, x, z, 1.2);
  mountains(g, 0, -60, 620, 7);
  // escenario delante del ayuntamiento (para el robot) con bandas
  const STG = G(g, 0, 0, -12); box(30, 2.4, 14, mat(0x8a2a2a, { roughness: .8 }), .1, STG, 0, 1.2, 0); box(30.4, .3, 14.4, mat(0xd8c8a0), .05, STG, 0, 2.5, 0); for (let k = 0; k < 4; k++) box(8, .6, 1.4, mat(0x6a2020), .05, STG, 0, .3 + k * .6, 7.6 + (3 - k) * 1.2);
  const ROB = robot(g); ROB.position.set(0, 2.5, -14); ROB.visible = false;
  // pantallas gigantes a ambos lados (también se usan en el pueblo)
  const SCR = [-1, 1].map(s => { const b = bigScreen(g, 18, 10.125, 640, 360); b.position.set(s * 27, 0, 2); b.rotation.y = -s * .55; b.visible = false; return b; });
  return { g: shade(g), BAL, BANS, ROB, STG, SCR, R }; }

// ---------- sala de ensayo del alcalde (X): suelo de parqué, paredes con boiserie, telón rojo enorme que se abre (TEL.userData.open(k)),
// atril con fichas, espejo de pie, lámpara de araña; ventana de noche con luna. Atril en (0, -6) mirando +z; telón en z = 4.
export function saal(scene, X) { const g = G(scene, X); const wd = mat(0xffffff, { map: rep(plankT('#8a5a30', '#6e4420'), 6, 6), roughness: .45 });
  box(60, .4, 50, wd, 0, g, 0, -.2, 0); const wall = mat(0xffffff, { map: rep(stripes('#6a2a3a', '#5e2232', 10), 6, 1), roughness: .85 }); box(60, 26, .4, wall, 0, g, 0, 13, -16); for (const s of [-1, 1]) box(.4, 26, 50, wall, 0, g, s * 30, 13, 0); box(60, .4, 50, mat(0xf4ece0), 0, g, 0, 26, 0);
  for (let k = -4; k <= 4; k++) { box(5, 8, .2, mat(0x4a1a24, { roughness: .6 }), .1, g, k * 6.4, 5, -15.7); box(5.6, .4, .3, mat(0xd8b040, { metalness: .7 }), .05, g, k * 6.4, 9.4, -15.7); }
  const win = textPlane(9, 12, 180, 240, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#0a0e30'); s.addColorStop(1, '#2a2a6a'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#fff8d8'; c.beginPath(); c.arc(130, 60, 24, 0, 7); c.fill(); c.fillStyle = '#ffffff'; for (let i = 0; i < 30; i++) c.fillRect((i * 53) % w, (i * 37) % (h * .6), 2, 2); c.fillStyle = '#121428'; c.fillRect(0, h * .72, w, h * .28); c.fillStyle = '#ffd890'; for (let i = 0; i < 12; i++) c.fillRect(10 + (i * 31) % 160, h * .76 + (i % 3) * 14, 6, 8); c.fillStyle = '#d8b040'; c.fillRect(w / 2 - 3, 0, 6, h); c.fillRect(0, h / 2 - 3, w, 6); }, .6);
  win.position.set(14, 14, -15.75); g.add(win); const win2 = win.clone(); win2.position.x = -14; g.add(win2);
  // araña
  const CH = G(g, 0, 22, -4); cyl(.1, .1, 4, mat(0xd8b040, { metalness: .9 }), 6, CH, 0, 2, 0); const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, .15, 8, 28), mat(0xd8b040, { metalness: .9, roughness: .2 })); ring.rotation.x = Math.PI / 2; CH.add(ring); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; sphere(.35, glowM(0xfff0c0, 2.2), CH, Math.cos(a) * 2.6, .5, Math.sin(a) * 2.6, 10, 8); }
  // atril con fichas (textura dibujable) y micrófono
  const AT = G(g, 0, 0, -6); box(3.8, 3.9, 2.2, mat(0x6a3a1a, { roughness: .5 }), .2, AT, 0, 1.95, 0); const top = box(4.4, .3, 2.8, mat(0x7a4626, { roughness: .45 }), .1, AT, 0, 4.0, .2); top.rotation.x = .35;
  const emb = textPlane(2.2, 2.2, 96, 96, (c, w, h) => { c.fillStyle = '#c8202a'; c.beginPath(); c.moveTo(16, 12); c.lineTo(80, 12); c.lineTo(80, 50); c.quadraticCurveTo(48, 92, 16, 50); c.fill(); c.fillStyle = '#ffd23f'; c.fillRect(42, 18, 12, 56); c.lineWidth = 5; c.strokeStyle = '#ffd23f'; c.strokeRect(16, 12, 64, 38); }); emb.position.set(0, 2.2, 1.12); AT.add(emb);
  const mic = G(AT, 1.5, 4.1, 1.0); cyl(.06, .06, 1.6, mat(0x2a2a2a, { metalness: .8 }), 6, mic, 0, .8, 0).rotation.x = .5; sphere(.22, mat(0x3a3a3a, { metalness: .6 }), mic, 0, 1.5, .4, 10, 8);
  const CARD = new THREE.Group(); g.add(CARD); { const cv = document.createElement('canvas'); cv.width = 360; cv.height = 240; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.8), new THREE.MeshStandardMaterial({ map: t, roughness: .8, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: .25 })); CARD.add(m); let key = null;
    CARD.userData.draw = (k, fn) => { if (k === key) return; key = k; const c = cv.getContext('2d'); c.fillStyle = '#fffaf0'; c.fillRect(0, 0, 360, 240); c.fillStyle = '#c8d8f0'; for (let y = 50; y < 240; y += 34) c.fillRect(0, y, 360, 2); c.fillStyle = '#e88a8a'; c.fillRect(40, 0, 3, 240); fn(c, 360, 240); t.needsUpdate = true; }; }
  // espejo de pie
  const MI = G(g, -12, 0, -10); box(5, 11, .5, mat(0xd8b040, { metalness: .85, roughness: .2 }), .3, MI, 0, 6.5, 0); box(4.2, 10, .2, mat(0xd8e8f0, { metalness: 1, roughness: .02 }), .1, MI, 0, 6.5, .3); MI.rotation.y = .5;
  // telón rojo de terciopelo: dos mitades plisadas que se apartan; galería dorada arriba
  const cur = mat(0xffffff, { map: canvasTex(256, 64, (c, w, h) => { for (let x = 0; x < w; x++) { const v = .5 + .5 * Math.sin(x / w * 6.283 * 8); c.fillStyle = `rgb(${120 + v * 100 | 0},${10 + v * 14 | 0},${20 + v * 16 | 0})`; c.fillRect(x, 0, 1, h); } }, true), roughness: .95 });
  const TEL = G(g, 0, 0, 4); const halves = []; for (const s of [-1, 1]) { const hlf = G(TEL, s * 7.5, 0, 0); const geo = new THREE.PlaneGeometry(15.4, 24, 40, 1); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 2.2) * .5); geo.computeVertexNormals(); const m = new THREE.Mesh(geo, cur); m.position.y = 12; m.castShadow = m.receiveShadow = true; m.material.side = THREE.DoubleSide; hlf.add(m); halves.push(hlf); }
  box(32, 3, 1.4, mat(0xd8b040, { metalness: .8, roughness: .25 }), .3, TEL, 0, 24.5, .2); for (const s of [-1, 1]) { const t = cyl(.4, .6, 1.4, mat(0xd8b040, { metalness: .8 }), 10, TEL, s * 13, 14, 1); }
  TEL.userData.open = k => { halves.forEach((h, i) => { const s = i ? 1 : -1; h.position.x = s * (7.5 + k * 9); h.scale.x = 1 - k * .45; }); }; TEL.userData.open(0);
  const L = new THREE.PointLight(0xffe8c0, 260, 60, 1.6); L.position.set(0, 18, -4); g.add(L); const SPOT = new THREE.SpotLight(0xfff4d8, 900, 60, .5, .6, 1.4); SPOT.position.set(0, 24, 8); SPOT.target.position.set(0, 4, -6); g.add(SPOT, SPOT.target);
  return { g: shade(g), TEL, AT, CARD, MI, CH }; }

// ---------- tienda de videojuegos «ZOCKERHÖHLE» (X): mostrador en (0, -6) con caja registradora, estanterías de juegos a los lados y al fondo,
// pared del fondo con pantalla, neones morados, cartel «NEU: GTA 6?» tachado; la puerta en z = +14.
export function spieleladen(scene, X) { const g = G(scene, X); box(40, .4, 32, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#2a2a3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#34344a'; c.fillRect(0, 0, 32, 32); c.fillRect(32, 32, 32, 32); }, true), 10, 8), roughness: .4 }), 0, g, 0, -.2, 0);
  const wall = mat(0x2a2050, { roughness: .8 }); box(40, 20, .4, wall, 0, g, 0, 10, -16); for (const s of [-1, 1]) box(.4, 20, 32, wall, 0, g, s * 20, 10, 0); box(40, .4, 32, mat(0x1a1a2a), 0, g, 0, 20, 0);
  const NEON = []; for (const [y, c] of [[17, 0xb84aff], [3, 0x3ad8ff]]) { const n = box(39, .25, .25, glowM(c, 3), .1, g, 0, y, -15.7); NEON.push(n); }
  const sign = textPlane(22, 3.4, 880, 136, (c, w, h) => { c.fillStyle = '#100a24'; c.fillRect(0, 0, w, h); c.font = `700 92px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = '#ff4ad8'; c.shadowBlur = 24; c.fillStyle = '#ffb8f0'; c.fillText('ZOCKERHÖHLE', w / 2, h / 2 + 4); }, 1.2); sign.position.set(0, 15, -15.75); g.add(sign);
  // cajas de juego: portadas de colores con títulos inventados; GTA 5 en una estantería entera
  const covers = [['#d83a3a', 'KART CHAOS'], ['#3a8ad8', 'BLOCK WELT'], ['#2ab86a', 'DINO PARK'], ['#ffb81a', 'TURBO KICK'], ['#8a4ad8', 'NINJA 3'], ['#1a1a2a', 'SPACE HELD']];
  const coverT = covers.map(([col, t]) => canvasTex(64, 90, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.arc(32, 44, 18, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 11px ${FONT}`; c.textAlign = 'center'; c.fillText(t, 32, 80); c.fillStyle = '#1a4ad8'; c.fillRect(0, 0, w, 10); }));
  const gtaT = canvasTex(64, 90, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#ff8a3a'); s.addColorStop(1, '#8a2a6a'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a2a'; for (let i = 0; i < 6; i++) c.fillRect(4 + i * 10, 40 - (i % 3) * 8, 8, 40); c.fillStyle = '#ffffff'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = '#1a1a2a'; c.strokeText('GTA 5', 32, 26); c.fillText('GTA 5', 32, 26); });
  const shelves = []; const shelf = (x, z, ry, gta) => { const s = G(g, x, 0, z); s.rotation.y = ry; box(12, 14, 2.4, mat(0x1a1a24, { roughness: .5 }), .1, s, 0, 7, -1); for (let r = 0; r < 5; r++) { box(12, .25, 2.6, mat(0x3a3a50), .05, s, 0, 1.4 + r * 2.7, 0); for (let k = 0; k < 9; k++) { const t = gta ? gtaT : coverT[(k + r * 2 + Math.abs(x)) % 6]; const b = box(1.0, 1.5, .25, mat(0xffffff, { map: t, roughness: .5 }), .02, s, -4.8 + k * 1.2, 2.3 + r * 2.7, .3); b.rotation.x = -.08; } } box(12.4, .6, 2.6, glowM(0x8a4aff, .5), .05, s, 0, 14.3, 0); shelves.push(s); return s; };
  shelf(-13, -14.5, 0, false); shelf(13, -14.5, 0, false); shelf(-19.4, -2, Math.PI / 2, false); shelf(19.4, -2, -Math.PI / 2, true); shelf(-19.4, 10, Math.PI / 2, false);
  const gtaSign = textPlane(9, 2.2, 360, 88, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); txt(c, 'GTA 5 · 69,99 €', w / 2, h / 2 + 3, 50, '#1a1a2a'); }); gtaSign.position.set(19.15, 15.6, -2); gtaSign.rotation.y = -Math.PI / 2; g.add(gtaSign);
  // mostrador con caja registradora y consola de demo
  const CT = G(g, 0, 0, -6); box(14, 2.9, 3.6, mat(0x3a2a6a, { roughness: .5 }), .2, CT, 0, 1.45, 0); box(14.4, .3, 4, mat(0x1a1a24, { roughness: .3, metalness: .3 }), .05, CT, 0, 3.05, 0); box(14.2, .3, .2, glowM(0x3ad8ff, 2), .02, CT, 0, 2.4, 1.82);
  const reg = G(CT, -4, 3.2, 0); box(2.6, 1.2, 2.2, mat(0x2a2a30, { metalness: .5 }), .2, reg, 0, .6, 0); const rs = box(1.8, 1.0, .2, glowM(0x5aff9a, .8), .05, reg, 0, 1.7, -.3); rs.rotation.x = -.4;
  const POSTER = textPlane(10, 6, 400, 240, (c, w, h) => { const s = c.createLinearGradient(0, 0, w, h); s.addColorStop(0, '#ff6a3a'); s.addColorStop(1, '#6a1aa8'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a2a'; for (let i = 0; i < 12; i++) c.fillRect(i * 34, 170 - (i % 4) * 22, 30, 80); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(320, 60, 30, 0, 7); c.fill(); txt(c, 'BALD: GTA 6', w / 2, 60, 52, '#ffffff', '#1a1a2a', 10); }); POSTER.position.set(0, 9.5, -15.75); g.add(POSTER);
  const L = new THREE.PointLight(0xe8d8ff, 300, 60, 1.6); L.position.set(0, 16, 0); g.add(L); const L2 = new THREE.PointLight(0xb84aff, 120, 40, 1.6); L2.position.set(-14, 10, -10); g.add(L2);
  return { g: shade(g), CT, shelves, POSTER }; }
