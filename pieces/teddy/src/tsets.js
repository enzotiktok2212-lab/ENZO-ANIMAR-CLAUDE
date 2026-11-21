// TEDDY — escenarios: calle de la ciudad con el internado (Elite-Internat), aula blindada, gimnasio con escenario, pasillo de dormitorios,
// dos habitaciones, el salón de la familia, la sala del juicio, la pista de tenis de noche y el cuarto de niño; atrezo (jaula, máquina de pelotas, cámaras, monitores).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, checkTex, RNG } from './engine.js';
import { txt, tree, lamp, bench, screen } from './props.js';
import { townhouse } from './gort.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const plane = (w, d, m, p, y = 0) => { const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); f.rotation.x = -Math.PI / 2; f.position.y = y; f.receiveShadow = true; p.add(f); return f; };
export function poster(g, x, y, z, w, h, draw, ry = 0, em = .25) { const p = textPlane(w, h, Math.round(w * 40), Math.round(h * 40), draw, em); p.position.set(x, y, z); p.rotation.y = ry; g.add(p); return p; }
const wallTex = (a, b, r = 8) => rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h * .62); c.fillStyle = b; c.fillRect(0, h * .62, w, h); c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(0, h * .62, w, 2); }, true), r, 1);
const plank = (a = '#d8a060', b = '#cc9452', c2 = '#e2ac6c', r = 6) => rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { c.fillStyle = y % 32 ? b : c2; c.fillRect(0, y, w, 15); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(0, y + 15, w, 1); c.fillRect((y * 7) % w, y, 1, 16); } }, true), r, r);
const carpet = (a, b, r = 4) => rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 3; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = b; c.beginPath(); c.arc(w / 2, h / 2, 8, 0, 7); c.fill(); }, true), r, r);
export function room(scene, x, w, d, h, wallM, floorM, light = 240) { const g = G(scene, x); plane(w, d, floorM, g);
  box(w, h, .6, wallM, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.6, h, d, wallM, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(0xf4f4f0), 0, g, 0, h, 0); box(w, 1, .7, mat(0xffffff), .05, g, 0, .5, -d / 2 + .3);
  const fw = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM); fw.rotation.y = Math.PI; fw.position.set(0, h / 2, d / 2); g.add(fw);
  const L = new THREE.PointLight(0xfff2e0, light, 90, 2); L.position.set(0, h - 3, 4); g.add(L); g.userData.L = L; return g; }
// cámara de vigilancia
export function secCam(p, x, y, z, ry = 0, s = 1) { const g = G(p, x, y, z); g.rotation.y = ry; g.scale.setScalar(s); box(1.6, .9, .9, mat(0xf4f4f4), .2, g, 0, 0, .3); const l = cyl(.3, .3, .3, mat(0x101014), 12, g, 0, 0, .9); l.rotation.x = Math.PI / 2;
  sphere(.1, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, .2, .2), toneMapped: false }), g, .5, .3, .76, 6, 4); box(.2, .2, 1, mat(0x6a6e78), .05, g, 0, 0, -.5); g.rotation.x = .35; return g; }
// placa de hierro atornillada
export function ironPlate(p, x, y, z, w, h, ry = 0) { const g = G(p, x, y, z); g.rotation.y = ry; const t = canvasTex(128, 128, (c, W, H) => { const gr = c.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#6a6e78'); gr.addColorStop(1, '#4a4e58'); c.fillStyle = gr; c.fillRect(0, 0, W, H); const r = RNG(4); for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(${120 + r() * 60},${60 + r() * 30},20,${r() * .25})`; c.beginPath(); c.arc(r() * W, r() * H, 2 + r() * 8, 0, 7); c.fill(); } });
  box(w, h, .3, mat(0xffffff, { map: t, metalness: .6, roughness: .5 }), .04, g, 0, 0, 0); for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const b = cyl(.22, .22, .2, mat(0x9aa0aa, { metalness: .9, roughness: .3 }), 6, g, sx * (w / 2 - .5), sy * (h / 2 - .5), .2); b.rotation.x = Math.PI / 2; }
  for (const sy of [-.25, .25]) box(w - .4, .25, .1, mat(0x3a3e48, { metalness: .7 }), .02, g, 0, sy * h, .18); return g; }
// monitor de pared (pantalla dinámica)
export function monitor(p, x, y, z, w, h, ry = 0) { const g = G(p, x, y, z); g.rotation.y = ry; box(w + .6, h + .6, .5, mat(0x1a1a22, { metalness: .5 }), .1, g, 0, 0, -.2); const s = screen(w, h, Math.round(w * 50), Math.round(h * 50), 1.3); s.position.z = .06; g.add(s); g.userData.s = s; return g; }

// ---------- 1. la ciudad y el internado (X = 0) ----------
// calle x ∈ [-8, 8] de z = 90 a z = -24; acera hasta ±14; casas a x = ±26; verja del internado en z = -24; patio z ∈ [-24, -56]; edificio con torre en z = -60
export function stadt(scene) { const g = G(scene); plane(900, 900, mat(0x6aa84a, { roughness: 1 }), g, -.02);
  plane(16, 130, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#4a4e58'; c.fillRect(0, 0, w, h); c.fillStyle = '#f4f4f4'; c.fillRect(30, 0, 4, 28); }, true), 1, 12), roughness: .9 }), g, .01).position.z = 25;
  for (const s of [-1, 1]) { const sw = box(12, .3, 130, mat(0xffffff, { map: rep(checkTex('#d8d0c4', '#c8c0b4', 8), 3, 30), roughness: .9 }), 0, g, s * 14, .15, 25); }
  const r = RNG(5); for (let i = 0; i < 8; i++) { const z = 84 - i * 15; townhouse(g, -32, z, 14, 2 + (i % 3), 10 + i, Math.PI / 2); townhouse(g, 32, z, 14, 2 + ((i + 1) % 3), 20 + i, -Math.PI / 2); }
  for (let i = 0; i < 10; i++) { townhouse(g, -60 - (i % 2) * 6, 90 - i * 16, 16, 4 + (i % 2), 40 + i, Math.PI / 2); townhouse(g, 60 + (i % 2) * 6, 90 - i * 16, 16, 4 + ((i + 1) % 2), 50 + i, -Math.PI / 2); }
  for (let i = 0; i < 6; i++) { lamp(g, -9, 80 - i * 18, -1); lamp(g, 9, 72 - i * 18, 1); tree(g, -12, 74 - i * 18, .9); tree(g, 12, 82 - i * 18, .85); }
  bench(g, -12.5, 50, Math.PI / 2); bench(g, 12.5, 30, -Math.PI / 2);
  // muro y verja
  const wallM = mat(0xb8584a, { roughness: .8 }), stone = mat(0xe8e0d0, { roughness: .7 }), iron = mat(0x1a1a22, { metalness: .7, roughness: .35 }), gold = mat(0xe9c23a, { metalness: .85, roughness: .25 });
  for (const s of [-1, 1]) { box(70, 7, 2, wallM, .05, g, s * 44, 3.5, -24); box(70, .8, 2.4, stone, .05, g, s * 44, 7.2, -24); for (let k = 0; k < 5; k++) box(3, 9, 3, stone, .1, g, s * (9.5 + k * 16), 4.5, -24); }
  for (const s of [-1, 1]) { box(3.2, 14, 3.2, stone, .1, g, s * 9.5, 7, -24); sphere(1.4, gold, g, s * 9.5, 15.2, -24, 14, 10); }
  const gate = []; for (const s of [-1, 1]) { const w = G(g, s * 8, 0, -24); for (let k = 0; k < 10; k++) { cyl(.14, .14, 11, iron, 6, w, -s * (.4 + k * .8), 5.8, 0); const sp = new THREE.Mesh(new THREE.ConeGeometry(.25, .7, 6), gold); sp.position.set(-s * (.4 + k * .8), 11.6, 0); w.add(sp); }
    for (const y of [1.4, 6, 10]) box(8, .3, .3, iron, .05, w, -s * 4, y, 0); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.4, .14, 6, 24), gold); ring.position.set(-s * 4, 8, 0); w.add(ring); gate.push(w); }
  const arch = new THREE.Mesh(new THREE.TorusGeometry(9.5, .3, 6, 40, Math.PI), iron); arch.position.set(0, 13, -24); g.add(arch);
  const sign = poster(g, 0, 17.2, -24, 14, 2.6, (c, w, h) => { c.fillStyle = '#1a2a5a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e9c23a'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); txt(c, 'ELITE-INTERNAT', w / 2, h / 2 + 4, 66, '#ffd23f'); }, 0, .35);
  // patio y edificio
  plane(160, 40, mat(0xffffff, { map: rep(checkTex('#e0d8c8', '#d0c8b8', 8), 20, 5), roughness: .9 }), g, .02).position.z = -42;
  const fac = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#f4e8d4'; c.fillRect(0, 0, w, h); for (let x = 0; x < 4; x++) { c.fillStyle = '#2a4a7a'; c.fillRect(18 + x * 62, 40, 30, 60); c.fillStyle = '#9ad0ff'; c.fillRect(22 + x * 62, 44, 22, 52); c.fillStyle = '#b8584a'; c.fillRect(14 + x * 62, 100, 38, 6); c.fillStyle = '#2a4a7a'; c.fillRect(18 + x * 62, 160, 30, 60); c.fillStyle = '#9ad0ff'; c.fillRect(22 + x * 62, 164, 22, 52); } c.fillStyle = '#d8c8b0'; c.fillRect(0, 124, w, 10); });
  fac.wrapS = fac.wrapT = THREE.RepeatWrapping; fac.repeat.set(5, 2);
  box(120, 34, 16, mat(0xffffff, { map: fac, roughness: .8 }), 0, g, 0, 17, -68); box(124, 2, 20, mat(0x8a3a32), .1, g, 0, 35, -68); for (let k = 0; k < 2; k++) { const rf = box(124, 1.4, 12, mat(0x8a3a32), .1, g, 0, 37 + k, -72 - k * 2); }
  const tw = G(g, 0, 0, -62); box(18, 52, 14, mat(0xf4e8d4, { roughness: .8 }), 0, tw, 0, 26, 0); const roof = new THREE.Mesh(new THREE.ConeGeometry(13, 14, 4), mat(0x2a6a6a, { roughness: .5 })); roof.position.y = 59; roof.rotation.y = Math.PI / 4; tw.add(roof);
  const clk = cyl(4, 4, .5, mat(0xffffff, { emissive: 0xfff4d8, emissiveIntensity: .2 }), 30, tw, 0, 42, 7.2); clk.rotation.x = Math.PI / 2; for (const [a, l] of [[.6, 2.8], [2.2, 2]]) { const hd = box(.3, l, .2, mat(0x1a1a1a), .05, tw, Math.sin(a) * l / 2, 42 + Math.cos(a) * l / 2, 7.6); hd.rotation.z = -a; }
  box(14, 16, 1, mat(0x5a3a22, { roughness: .6 }), .1, tw, 0, 8, 7.2); box(16, 2, 2, stone, .1, tw, 0, 17, 7.6); for (const s of [-1, 1]) box(1.6, 18, 1.6, stone, .1, tw, s * 8, 9, 7.6);
  for (let k = 0; k < 6; k++) { box(30 - k * 2, .8, 1.6, stone, .05, g, 0, .4 + k * .8, -42 - k * 1.6); }
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) tree(g, s * (22 + k * 16), -34, 1.1);
  for (const s of [-1, 1]) { const f = G(g, s * 30, 0, -46); cyl(.3, .3, 22, mat(0xd8dce4, { metalness: .8 }), 8, f, 0, 11, 0); const fl = poster(f, s * 2.4, 19.5, 0, 4.6, 3, (c, w, h) => { c.fillStyle = '#d8283a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h / 2, 34, 0, 7); c.fill(); }, 0, .2); f.userData.fl = fl; }
  return { G: g, gate }; }

// ---------- 2. aula blindada ----------
export function klasse(scene, X) { const g = room(scene, X, 40, 32, 20, mat(0xffffff, { map: wallTex('#e8dcc8', '#6a8a7a') }), mat(0xffffff, { map: plank('#b88a5a', '#a87a4a', '#c89a6a', 5) }), 200);
  poster(g, 0, 11, -15.6, 18, 7, (c, w, h) => { c.fillStyle = '#24543a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a5a30'; c.lineWidth = 24; c.strokeRect(0, 0, w, h); txt(c, 'WILLKOMMEN', w / 2, h * .4, 110, '#f4f4f4'); txt(c, 'IHR KOMMT HIER NIE RAUS', w / 2, h * .72, 50, '#ff8aa8'); }, 0, .15);
  const desks = []; for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) { const d = G(g, -13 + q * 8.6, 0, -5 + r * 7.5); box(5, .4, 3.4, mat(0xd8b080), .08, d, 0, 4, 0); for (const [x, z] of [[-2.2, -1.4], [2.2, -1.4], [-2.2, 1.4], [2.2, 1.4]]) cyl(.13, .13, 4, mat(0x4a4e58, { metalness: .5 }), 6, d, x, 2, z);
    const ch = G(d, 0, 0, 2.8); box(2.6, .3, 2.4, mat(0x8a5a30), .1, ch, 0, 2.4, 0); box(2.6, 2.4, .3, mat(0x8a5a30), .1, ch, 0, 3.8, 1.1); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) cyl(.1, .1, 2.4, mat(0x888888, { metalness: .7 }), 6, ch, x, 1.2, z); desks.push(d); }
  // ventanas tapadas con placas de hierro (pared derecha) y rendijas de luz
  for (let k = 0; k < 3; k++) { box(.3, 8.4, 6.4, mat(0x3a4a5a), .05, g, 19.6, 10, -8 + k * 9); ironPlate(g, 19.2, 10, -8 + k * 9, 6.6, 8.6, -Math.PI / 2); const sl = box(.1, .2, 6, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2, 1.6), toneMapped: false }), 0, g, 19.05, 13.6, -8 + k * 9); }
  const cams = [secCam(g, -18.6, 18, -14.6, Math.PI / 4), secCam(g, 18.6, 18, -14.6, -Math.PI / 4), secCam(g, -18.6, 18, 14.6, 3 * Math.PI / 4), secCam(g, 18.6, 18, 14.6, -3 * Math.PI / 4)];
  for (let k = 0; k < 2; k++) poster(g, -19.6, 10, -6 + k * 10, 5, 6.5, (c, w, h) => { c.fillStyle = ['#ffd23f', '#ff8ad0'][k]; c.fillRect(0, 0, w, h); txt(c, ['REGELN', 'LÄCHELN!'][k], w / 2, h * .2, 44, '#1d2238'); c.fillStyle = '#fff'; c.fillRect(30, 80, w - 60, h - 110); txt(c, k ? '♥' : '1. Niemand geht', w / 2, h * .6, k ? 90 : 26, '#d8283a'); }, Math.PI / 2);
  const clk = cyl(1.4, 1.4, .3, mat(0xffffff), 24, g, -12, 16, -15.6); clk.rotation.x = Math.PI / 2; box(8, 4.4, 4, mat(0x8a5a30), .1, g, 10, 2.2, -11);
  const note = textPlane(1.8, 1.3, 180, 130, (c, w, h) => { c.fillStyle = '#fffbe8'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8e8ff'; for (let y = 30; y < h; y += 22) c.fillRect(0, y, w, 2); txt(c, 'Komm in die', w / 2, h * .38, 26, '#2a1a3a'); txt(c, 'TURNHALLE', w / 2, h * .7, 30, '#d8283a'); });
  note.rotation.x = -Math.PI / 2; note.position.set(0, 4.23, 0); desks[5].add(note);
  return { g, desks, cams, note }; }

// ---------- 3. gimnasio con escenario ----------
export function turnhalle(scene, X) { const g = room(scene, X, 64, 56, 28, mat(0xffffff, { map: wallTex('#e8d0a0', '#3a4a8a', 10) }), mat(0xffffff, { map: plank('#d8a060', '#cc9452', '#e2ac6c', 8) }), 360);
  const ln = (x, z, w, d) => box(w, .03, d, mat(0xffffff), 0, g, x, .04, z); ln(0, 6, .3, 40); ln(0, 6, 56, .3); const cc = new THREE.Mesh(new THREE.TorusGeometry(5, .15, 4, 40), mat(0xd8323a)); cc.rotation.x = Math.PI / 2; cc.position.set(0, .05, 6); g.add(cc);
  // escenario al fondo
  box(36, 4, 12, mat(0x6a3a22, { roughness: .6 }), .1, g, 0, 2, -22); box(36.4, .3, 12.4, mat(0x8a5a32), .05, g, 0, 4.1, -22); for (let k = 0; k < 4; k++) box(8, .7, 1.4, mat(0x6a3a22), .05, g, 0, .35 + k * .9, -15.2 + k * -1.2 + 1.2 * k - k * 1.2 + 0 * k);
  for (let k = 0; k < 4; k++) box(8, (k + 1) * 1, 1.3, mat(0x7a4a2a), .05, g, 0, (k + 1) * .5, -13 - k * 1.3);
  const curt = mat(0xb81a2a, { roughness: .9 }); for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { const c = cyl(.9, .9, 22, curt, 8, g, s * (17 - k * 1.5), 15, -27); c.scale.z = .5; }
  box(38, 3, 1.4, curt, .2, g, 0, 26, -26.5); for (let k = 0; k < 9; k++) box(4, 1, .3, mat(0xe9c23a, { metalness: .7 }), .05, g, -16 + k * 4, 24.6, -25.8);
  const back = poster(g, 0, 15, -27.6, 22, 13, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a1a4a'); gr.addColorStop(1, '#6a1a3a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,${180 + (i * 37) % 70},220,.8)`; c.beginPath(); c.arc((i * 97) % w, (i * 53) % h, 3, 0, 7); c.fill(); } txt(c, 'WILLKOMMEN', w / 2, h * .2, 90, '#ffd23f', '#000', 10); }, 0, .3);
  // atril
  const pod = G(g, 0, 4.2, -19); box(4, 5, 2.4, mat(0x4a2a1a, { roughness: .5 }), .2, pod, 0, 2.5, 0); box(4.6, .4, 3, mat(0x3a1a10), .1, pod, 0, 5.1, -.2); const em = cyl(1, 1, .2, mat(0xffd23f, { metalness: .8, roughness: .2 }), 24, pod, 0, 3, 1.25); em.rotation.x = Math.PI / 2;
  const mic = cyl(.06, .06, 1.8, mat(0x2a2a2a), 6, pod, .8, 5.9, .4); mic.rotation.x = .4; sphere(.2, mat(0x1a1a1a), pod, .8, 6.75, .75, 8, 6);
  // monitores a los lados y focos
  const mons = [monitor(g, -24, 17, -26.6, 10, 6), monitor(g, 24, 17, -26.6, 10, 6)];
  const spots = []; for (const s of [-1, 1]) { const sp = new THREE.SpotLight(0xfff0d8, 0, 120, .35, .5, 1); sp.position.set(s * 14, 26, 10); sp.target.position.set(0, 6, -19); g.add(sp, sp.target); spots.push(sp); box(1.4, 1.4, 2, mat(0x1a1a1a), .2, g, s * 14, 26.5, 10); }
  // gradas y canastas
  for (let r = 0; r < 4; r++) for (const s of [-1, 1]) box(4, 1.2 * (r + 1), 40, mat(0xc89a5a), .05, g, s * (30 - r * 2.2), .6 * (r + 1), 6);
  for (const s of [-1, 1]) { const h = G(g, s * 31.5, 0, 12); box(.3, 4, 6, mat(0xffffff), .05, h, -s * .5, 15, 0); const r = new THREE.Mesh(new THREE.TorusGeometry(1.2, .1, 6, 20), mat(0xff5a2a)); r.rotation.x = Math.PI / 2; r.position.set(-s * 1.8, 13.5, 0); h.add(r); }
  secCam(g, -31, 26, -27, Math.PI / 5); secCam(g, 31, 26, -27, -Math.PI / 5);
  // trampilla en el suelo (se abre) en (0, 0, 2)
  const trap = G(g, 0, 0, 2); const hole = box(6, .05, 6, mat(0x050508), 0, trap, 0, .03, 0); hole.visible = false; const lids = [-1, 1].map(s => { const l = G(trap, s * 3, .06, 0); box(3, .2, 6, mat(0xc8904a), .02, l, -s * 1.5, 0, 0); return l; });
  return { g, pod, mons, spots, trap: { hole, lids } }; }

// ---------- 4. pasillo de dormitorios ----------
const DOORCOL = [0x3a6ae8, 0x7a4a26, 0xe0302a, 0x1a1414, 0x8a4ad8, 0xf0b088, 0xb8a0d8, 0x5a3a1e, 0xf0d870, 0x2a2018, 0x101014, 0x4a2a14];
export function flur(scene, X) { const g = G(scene, X); plane(26, 120, mat(0xffffff, { map: carpet('#8a1a2a', '#c8a040', 3) }), g).position.z = -40;
  const wl = mat(0xffffff, { map: rep(wallTex('#f0e0c8', '#7a4a3a'), 12, 1) }); for (const s of [-1, 1]) box(.6, 18, 120, wl, 0, g, s * 13, 9, -40); box(26, .4, 120, mat(0xf4f4f0), 0, g, 0, 18, -40); box(26, 18, .6, wl, 0, g, 0, 9, -100); const fw = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), wl); fw.rotation.y = Math.PI; fw.position.set(0, 9, 20); g.add(fw);
  const doors = []; for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const z = 6 - i * 14, d = G(g, s * 12.6, 0, z); d.rotation.y = -s * Math.PI / 2; box(5.6, 10.4, .3, mat(0xe8d8c0), .05, d, 0, 5.2, -.1);
    const leaf = G(d, -2.4, 0, .1); box(4.8, 9.8, .4, mat(0x6a3a22, { roughness: .5 }), .06, leaf, 2.4, 4.9, 0); sphere(.25, mat(0xe9c23a, { metalness: .9, roughness: .2 }), leaf, 4.2, 4.8, .35, 8, 6);
    const ci = s < 0 ? i : 6 + i; const plate = poster(leaf, 2.4, 8, .25, 1.8, 1.8, (c, w, h) => { c.fillStyle = '#fff6e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#' + DOORCOL[ci].toString(16).padStart(6, '0'); c.fillRect(14, 10, w - 28, 30); c.fillStyle = '#f2c8a8'; c.fillRect(20, 34, w - 40, h - 46); c.fillStyle = '#1a1a1a'; c.fillRect(30, 46, 8, 8); c.fillRect(w - 38, 46, 8, 8); }, 0, .2);
    doors.push(leaf); }
  for (let i = 0; i < 8; i++) { const L = new THREE.PointLight(0xffd8a0, 90, 34, 2); L.position.set(0, 15, 6 - i * 14); g.add(L); sphere(.8, mat(0xfff0c0, { emissive: 0xffc860, emissiveIntensity: 1.2 }), g, 0, 17, 6 - i * 14, 12, 8); }
  for (let k = 0; k < 5; k++) poster(g, (k % 2 ? 1 : -1) * 12.6, 11, -1 - k * 14, 3.6, 4.4, (c, w, h) => { c.fillStyle = '#2a1a3a'; c.fillRect(0, 0, w, h); txt(c, ['NACHTRUHE', '22:00', 'LÄCHELN!', 'REGELN', '♥'][k], w / 2, h / 2, 34, '#ffd23f'); }, k % 2 ? -Math.PI / 2 : Math.PI / 2);
  secCam(g, 0, 16.5, -96, 0); secCam(g, -12, 16.5, 16, Math.PI * .8);
  return { g, doors }; }

// ---------- 5. habitación (dormitorio) ----------
export function zimmer(scene, X, wallA = '#cfd8f0', wallB = '#3a4a8a', sheet = '#3a6ae8') { const g = room(scene, X, 30, 26, 18, mat(0xffffff, { map: wallTex(wallA, wallB) }), mat(0xffffff, { map: carpet('#5a4a6a', '#8a7aa8', 4) }), 130);
  const bed = G(g, -8, 0, -6); box(7, 2, 12, mat(0x6a3a22), .1, bed, 0, 1, 0); box(6.6, 1.2, 11.4, mat(0xffffff, { map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = sheet; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.2)'; for (let i = 0; i < w; i += 8) c.fillRect(i, 0, 3, h); }) }), .3, bed, 0, 2.5, .6); box(6, 1, 2.4, mat(0xffffff), .4, bed, 0, 3.1, -4.6); box(7, 5, .6, mat(0x6a3a22), .1, bed, 0, 2.5, -6.2);
  const desk = G(g, 8, 0, -10); box(8, .4, 4, mat(0xc89a6a), .05, desk, 0, 4, 0); for (const [x, z] of [[-3.6, -1.6], [3.6, -1.6], [-3.6, 1.6], [3.6, 1.6]]) box(.3, 4, .3, mat(0x8a6a4a), 0, desk, x, 2, z); const lampD = cyl(.2, .5, 2, mat(0x2a8a7a), 10, desk, -2.4, 5, -.6); sphere(.6, mat(0xfff0c0, { emissive: 0xffd080, emissiveIntensity: 1 }), desk, -2.4, 6.2, -.6, 10, 8);
  const ward = box(6, 13, 4, mat(0x8a5a32), .1, g, 11.6, 6.5, 6); for (let k = 0; k < 3; k++) poster(g, -2 + k * 4.4, 15, -12.6, 3.4, 4.2, (c, w, h) => { c.fillStyle = ['#ff8ad0', '#ffd23f', '#8ad8ff'][k]; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.fillRect(14, 14, w - 28, h - 60); txt(c, ['♪', '★', '♥'][k], w / 2, h - 26, 34, '#1a1a1a'); }, 0, .15);
  const win = poster(g, -14.6, 11, 2, 6, 6, (c, w, h) => { c.fillStyle = '#4a4e58'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a2e38'; c.lineWidth = 10; for (let i = 0; i < 4; i++) c.strokeRect(10 + i * 4, 10 + i * 4, w - 20 - i * 8, h - 20 - i * 8); }, Math.PI / 2, .05);
  // números en la pared (pintalabios) — visibles solo cuando toca
  const nums = poster(g, 0, 9, -12.65, 14, 4, (c, w, h) => { c.font = `700 150px Cap, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#d81a4a'; c.shadowColor = 'rgba(120,0,30,.6)'; c.shadowBlur = 8; c.fillText('3 1 7 7 0', w / 2, h / 2 + 8); c.fillRect(30, h - 30, w - 60, 6); }, 0, .2); nums.material.transparent = true; nums.material.alphaTest = .05; nums.position.y = 9.3; nums.renderOrder = 2;
  // puerta (pared delantera, x = 6, z = 12.7, mirando hacia dentro)
  const door = G(g, 7, 0, 12.6); box(5.6, 10.4, .3, mat(0xe8d8c0), .05, door, 0, 5.2, 0); const leaf = G(door, -2.4, 0, -.2); box(4.8, 9.8, .4, mat(0x6a3a22, { roughness: .5 }), .06, leaf, 2.4, 4.9, 0); sphere(.25, mat(0xe9c23a, { metalness: .9 }), leaf, 4.2, 4.8, -.35, 8, 6);
  secCam(g, 14, 16.5, -12, -Math.PI / 4);
  return { g, bed, desk, nums, door: leaf }; }

// ---------- 6. salón de la familia (en el vídeo) ----------
export function wohnzimmer(scene, X) { const g = room(scene, X, 34, 26, 16, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#f2d8b0'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8c898'; for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 6, h); }, true), 10, 2) }), mat(0xffffff, { map: plank('#a87048', '#986038', '#b88058', 6) }), 140);
  const sofa = (x, z, ry, tip) => { const s = G(g, x, 0, z); s.rotation.set(tip ? -Math.PI / 2 : 0, ry, tip ? .1 : 0); if (tip) s.position.y = 3; const m = mat(0x3a7a6a, { roughness: .9 }); box(10, 2, 4, m, .3, s, 0, 1.6, 0); box(10, 3.2, 1.2, m, .3, s, 0, 3.4, -1.6); for (const k of [-1, 1]) box(1.2, 2.6, 4, m, .3, s, k * 5.2, 2.2, 0); for (const k of [-1, 1]) box(4.6, .8, 3.4, mat(0x4a8a7a), .3, s, k * 2.4, 2.9, .2); return s; };
  const s1 = sofa(-6, -6, 0, true), s2 = sofa(8, 2, -Math.PI / 2, true);
  const rug = cyl(7, 7, .1, mat(0xffffff, { map: carpet('#d8a040', '#8a3a2a', 2) }), 40, g, 0, .06, 2); const tbl = G(g, 1, 0, 6); tbl.rotation.z = 1.4; tbl.position.y = 1.4; box(5, .3, 3, mat(0x6a4a2a), .05, tbl, 0, 0, 0);
  const tv = G(g, 0, 0, -12.4); box(12, 7, .5, mat(0x1a1a1a), .1, tv, 0, 8, 0); box(11.4, 6.4, .1, mat(0x0a0a10), 0, tv, 0, 8, .3); box(10, 2.4, 2.4, mat(0x8a5a32), .1, tv, 0, 1.2, .6);
  for (let k = 0; k < 3; k++) { const fr = G(g, -14 + k * 5, 11, -12.6); box(3.6, 4.4, .2, mat(0xd8a040, { metalness: .5 }), .05, fr, 0, 0, 0); const ph = poster(fr, 0, 0, .12, 3, 3.8, (c, w, h) => { c.fillStyle = ['#8ad0ff', '#ffd8a0', '#b8f0a0'][k]; c.fillRect(0, 0, w, h); const figs = [[.3, '#f28a6a'], [.55, '#3a6ab8'], [.78, '#2a8a4a']]; for (const [x, col] of figs) { c.fillStyle = col; c.fillRect(w * x - 12, h * .5, 24, 40); c.fillStyle = '#f2c4a2'; c.fillRect(w * x - 10, h * .5 - 22, 20, 20); } }, 0, .1); if (k === 1) fr.rotation.z = .5; }
  const lampF = G(g, 13, 0, -9); lampF.rotation.z = -1.3; lampF.position.y = .6; cyl(.15, .15, 9, mat(0x2a2a2a), 8, lampF, 0, 4.5, 0); cyl(1, 1.6, 1.8, mat(0xfff0d0), 14, lampF, 0, 9, 0);
  for (let k = 0; k < 6; k++) { const b = box(1.2, .2, 1.6, mat([0xd83a3a, 0x3a6ad8, 0xffd23f][k % 3]), .02, g, -8 + k * 3, .12, 8 - (k % 2) * 3); b.rotation.y = k; }
  const plant = G(g, -14, 0, 9); plant.rotation.z = 1.4; plant.position.y = 1.2; cyl(1, .8, 2, mat(0xc8603a), 12, plant, 0, 1, 0); for (let k = 0; k < 6; k++) sphere(.9, mat(0x2a8a3a), plant, Math.sin(k) * .8, 2.6 + (k % 2) * .6, Math.cos(k) * .8, 8, 6);
  return { g }; }

// ---------- 7. sala del juicio (anillo de 12 atriles) ----------
export function gericht(scene, X) { const g = G(scene, X); const R = 11;
  const fl = new THREE.Mesh(new THREE.CircleGeometry(30, 48), mat(0xffffff, { map: rep(checkTex('#f4f4f4', '#141414', 8), 6, 6), roughness: .35 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; g.add(fl);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(30, 30, 34, 40, 1, true), mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#5a0a10'); g.addColorStop(.5, '#a01a22'); g.addColorStop(1, '#5a0a10'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#e9c23a'; c.fillRect(0, h * .8, w, 3); }, true), 16, 1), side: THREE.BackSide })); wall.position.y = 17; g.add(wall);
  const ceil = new THREE.Mesh(new THREE.CircleGeometry(30, 40), mat(0x2a0a1a)); ceil.rotation.x = Math.PI / 2; ceil.position.y = 34; g.add(ceil);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, .3, 8, 60), mat(0xe9c23a, { metalness: .85, roughness: .25 })); ring.rotation.x = Math.PI / 2; ring.position.y = .2; g.add(ring);
  const pods = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, p = G(g, Math.sin(a) * R, 0, Math.cos(a) * R); p.rotation.y = a + Math.PI; box(3.4, 1.0, 1.6, mat(0xe8601a, { roughness: .45 }), .1, p, 0, .5, 0); for (let k = 0; k < 5; k++) cyl(.14, .14, 1.9, mat(0xf07a2a, { roughness: .4 }), 8, p, -1.4 + k * .7, 1.9, .6); box(3.8, .4, 2.2, mat(0xf08a3a, { roughness: .35 }), .1, p, 0, 2.9, -.1); box(3.6, .3, .3, mat(0xe8601a), .05, p, 0, 1.2, .62);
    const tag = poster(p, 0, 1.75, .82, 2.0, .8, (c, w, h) => { c.fillStyle = '#fff6e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#' + DOORCOL[i].toString(16).padStart(6, '0'); c.fillRect(10, 10, 34, h - 20); txt(c, String(i + 1), w * .62, h / 2 + 2, 30, '#2a1a1a'); }, Math.PI, .2); tag.rotation.y = 0; tag.position.z = .82; pods.push(p); }
  // trono del oso (fondo, -z) con escalinata
  const th = G(g, 0, 0, -22); for (let k = 0; k < 5; k++) box(10 - k, 1, 2, mat(0x8a1a2a), .05, th, 0, .5 + k, 4 - k * 1.6); box(6, 1, 6, mat(0xe9c23a, { metalness: .8, roughness: .3 }), .1, th, 0, 5.5, -2); box(6, 9, 1, mat(0xc8601a), .4, th, 0, 10, -4.6); for (const s of [-1, 1]) box(1, 4, 5, mat(0xd8702a), .2, th, s * 3, 7.5, -2); for (let k = 0; k < 6; k++) box(.3, 5.4, .3, mat(0xd8702a), .05, th, -2.5 + k, 2.7, -1); const top_ = new THREE.Mesh(new THREE.TorusGeometry(2.6, .4, 8, 20, Math.PI), mat(0xc8601a)); top_.position.set(0, 14.4, -4.6); th.add(top_);
  const scr = monitor(g, 0, 24, -28.4, 22, 9);
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; if (Math.abs(a - Math.PI) < .5) continue; const c = cyl(1.1, 1.3, 34, mat(0x8a0a14, { roughness: .9 }), 8, g, Math.sin(a) * 28.6, 17, Math.cos(a) * 28.6); c.scale.z = .6; c.rotation.y = a; }
  const lamps = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, L = new THREE.PointLight(0xff9ad0, 90, 50, 1.6); L.position.set(Math.sin(a) * 18, 26, Math.cos(a) * 18); g.add(L); lamps.push(L); }
  const top = new THREE.PointLight(0xfff0e0, 260, 70, 1.6); top.position.set(0, 30, 0); g.add(top);
  return { g, pods, R, throne: th, scr }; }

// ---------- 8. pista de tenis (noche, focos) ----------
export function tennis(scene, X) { const g = G(scene, X); plane(400, 400, mat(0x2a4a2a, { roughness: 1 }), g, -.02);
  plane(40, 80, mat(0xffffff, { map: canvasTex(128, 256, (c, w, h) => { c.fillStyle = '#c8603a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.strokeRect(16, 16, w - 32, h - 32); c.strokeRect(30, 16, w - 60, h - 32); c.beginPath(); c.moveTo(30, h * .28); c.lineTo(w - 30, h * .28); c.moveTo(30, h * .72); c.lineTo(w - 30, h * .72); c.moveTo(w / 2, h * .28); c.lineTo(w / 2, h * .72); c.stroke(); }), roughness: .9 }), g, .01);
  const net = G(g); const nm = new THREE.MeshStandardMaterial({ map: canvasTex(64, 16, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = '#f4f4f4'; c.lineWidth = 1; for (let x = 0; x < w; x += 4) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y < h; y += 4) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } }), transparent: true, side: THREE.DoubleSide, alphaTest: .1 });
  nm.map.wrapS = THREE.RepeatWrapping; nm.map.repeat.set(8, 1); const nt = new THREE.Mesh(new THREE.PlaneGeometry(36, 3), nm); nt.position.y = 2.3; net.add(nt); box(36, .4, .2, mat(0xffffff), .05, net, 0, 3.8, 0);
  const posts = [-1, 1].map(s => { const p = cyl(.35, .35, 7, mat(0x1a5a3a, { metalness: .5 }), 10, net, s * 18.5, 3.5, 0); return p; });
  // vallas y edificios del internado alrededor
  const fence = mat(0x2a6a4a, { metalness: .4, transparent: true, opacity: .55 }); for (const s of [-1, 1]) { box(.2, 9, 90, fence, 0, g, s * 26, 4.5, 0); box(54, 9, .2, fence, 0, g, 0, 4.5, s * 45); }
  const fac = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#d8c8b0'; c.fillRect(0, 0, w, h); for (let x = 0; x < 6; x++) for (let y = 0; y < 2; y++) { c.fillStyle = (x + y) % 3 ? '#2a2e48' : '#ffd890'; c.fillRect(12 + x * 40, 16 + y * 56, 22, 34); } }); fac.wrapS = THREE.RepeatWrapping; fac.repeat.set(4, 1);
  for (const [x, z, ry] of [[0, -70, 0], [-60, 0, Math.PI / 2], [60, 0, -Math.PI / 2], [0, 70, Math.PI]]) { const b = box(110, 30, 14, mat(0xffffff, { map: fac, emissive: 0xffffff, emissiveMap: fac, emissiveIntensity: .25 }), 0, g, x, 15, z); b.rotation.y = ry; }
  const lights = []; for (const s of [-1, 1]) for (const t of [-1, 1]) { const p = G(g, s * 30, 0, t * 30); cyl(.4, .5, 26, mat(0x5a5e68, { metalness: .6 }), 8, p, 0, 13, 0); box(4, 2.4, 1, mat(0xf4f4f8, { emissive: 0xfff8e0, emissiveIntensity: 1.6 }), .1, p, 0, 26, 0); const L = new THREE.SpotLight(0xfff4e0, 900, 140, .6, .5, 1); L.position.set(s * 30, 26, t * 30); L.target.position.set(0, 0, 0); g.add(L, L.target); lights.push(L); }
  // gradas vacías con banderines
  for (let r = 0; r < 4; r++) box(3, 1 + r, 60, mat(0x3a5a8a), .05, g, -22 + r * -1.2 + 0 * r, (1 + r) / 2, 0);
  return { g, net, posts, lights }; }

// ---------- 9. cuarto de niño (recuerdo) ----------
export function kinderzimmer(scene, X) { const g = room(scene, X, 28, 24, 16, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#2a3a7a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffe890'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc((i * 23) % w, (i * 37) % h, 2 + (i % 3), 0, 7); c.fill(); } }, true), 8, 3) }), mat(0xffffff, { map: carpet('#6a8ad8', '#ffd890', 4) }), 80);
  const bed = G(g, 0, 0, -4); box(7, 1.6, 11, mat(0xd8a060), .2, bed, 0, .8, 0); box(6.6, 1.2, 10.4, mat(0xffffff, { map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff8a3a'; for (let i = 0; i < 10; i++) { c.beginPath(); c.arc((i * 29) % w, (i * 17) % h, 5, 0, 7); c.fill(); } }) }), .3, bed, 0, 2.1, .5); box(5.6, 1, 2.2, mat(0xffffff), .4, bed, 0, 2.7, -4.2); box(7, 4.4, .6, mat(0xd8a060), .2, bed, 0, 2.2, -5.6);
  const nl = sphere(.8, mat(0xfff0c0, { emissive: 0xffc860, emissiveIntensity: 1.6 }), g, 6, 3.4, -9, 12, 8); box(3, 3, 3, mat(0xffffff), .2, g, 6, 1.5, -9); const L = new THREE.PointLight(0xffc870, 70, 30, 1.6); L.position.set(6, 5, -8); g.add(L);
  const moon = poster(g, -8, 10, -11.6, 5, 5, (c, w, h) => { c.fillStyle = '#0a1030'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff4c0'; c.beginPath(); c.arc(w * .55, h * .45, 60, 0, 7); c.fill(); c.fillStyle = '#0a1030'; c.beginPath(); c.arc(w * .68, h * .38, 56, 0, 7); c.fill(); c.strokeStyle = '#8a6a3a'; c.lineWidth = 12; c.strokeRect(0, 0, w, h); }, 0, .3);
  for (let k = 0; k < 5; k++) { const b = box(1, 1, 1, mat([0xd83a3a, 0x3a6ad8, 0xffd23f, 0x2ab86a, 0xff8ad0][k]), .1, g, -9 + k * 1.4, .5 + (k % 2 ? 1 : 0), 7); b.rotation.y = k; }
  return { g, bed }; }

// ---------- atrezo ----------
export function cage(parent) { const g = G(parent); const m = mat(0x2a2a32, { metalness: .8, roughness: .3 }); for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; cyl(.12, .12, 8, m, 6, g, Math.sin(a) * 3.2, 4, Math.cos(a) * 3.2); }
  for (const y of [.2, 8]) { const r = new THREE.Mesh(new THREE.TorusGeometry(3.2, .2, 6, 32), m); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); } const top = new THREE.Mesh(new THREE.ConeGeometry(3.4, 2.4, 16), m); top.position.y = 9.2; g.add(top); cyl(.2, .2, 30, m, 6, g, 0, 25, 0); return g; }
export function ballMachine(parent) { const g = G(parent); box(3.6, 2.8, 3.6, mat(0x2a6ad8, { roughness: .4 }), .3, g, 0, 2.2, 0); const hop = cyl(2.4, 1.4, 2.6, mat(0x1a1a22, { transparent: true, opacity: .8 }), 16, g, 0, 4.9, 0); for (let k = 0; k < 14; k++) sphere(.42, mat(0xd8f03a, { roughness: .7 }), g, Math.sin(k * 2.4) * 1.3, 4.6 + (k % 3) * .5, Math.cos(k * 2.4) * 1.3, 10, 8);
  const mz = cyl(.6, .6, 2.2, mat(0x1a1a1a), 12, g, 0, 2.6, 2.4); mz.rotation.x = Math.PI / 2; for (const [x, z] of [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]]) { const w = cyl(.5, .5, .3, mat(0x1a1a1a), 12, g, x, .5, z); w.rotation.z = Math.PI / 2; }
  const face = poster(g, 0, 2.4, 1.82, 2.6, 1.4, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8283a'; c.beginPath(); c.arc(w * .3, h * .45, 14, 0, 7); c.fill(); txt(c, '2000', w * .65, h * .5, 34, '#1a1a1a'); }, 0, .3); return g; }
export function tball(parent) { const b = sphere(.42, mat(0xd8f03a, { roughness: .7 }), parent, 0, 0, 0, 10, 8); return b; }
export function drum(parent) { const g = G(parent); const fr = mat(0xe9c23a, { metalness: .8, roughness: .25 }); for (const s of [-1, 1]) { box(.4, 6, .4, fr, .05, g, s * 3, 3, 0); } const d = G(g, 0, 5, 0); const glass = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 5, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: .3, side: THREE.DoubleSide })); glass.rotation.z = Math.PI / 2; d.add(glass);
  for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(2.4, .15, 6, 24), fr); r.rotation.y = Math.PI / 2; r.position.x = s * 2.5; d.add(r); } for (let k = 0; k < 18; k++) sphere(.4, mat([0xd8283a, 0xffd23f, 0x2a6ad8, 0xffffff][k % 4]), d, (k % 5 - 2) * .8, Math.sin(k * 2.1) * 1.4, Math.cos(k * 2.1) * 1.4, 8, 6); g.userData.d = d; return g; }
export function ticket(parent, text = 'GEWONNEN!') { return poster(parent, 0, 0, 0, 3.2, 1.6, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8283a'; c.setLineDash([8, 6]); c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16); txt(c, text, w / 2, h / 2 + 4, 24, '#d8283a'); }, 0, .5); }
export function photo(parent) { return poster(parent, 0, 0, 0, 2.6, 2, (c, w, h) => { c.fillStyle = '#f8f4ec'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8d8c8'; c.fillRect(10, 10, w - 20, h - 40); c.font = '700 22px Cap, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#d81a4a'; c.fillText('3 1 7 7 0', w / 2, h * .45); }, 0, .3); }
export function lipstick(parent) { const g = G(parent); cyl(.18, .18, .7, mat(0xe9c23a, { metalness: .8, roughness: .2 }), 10, g, 0, .35, 0); cyl(.14, .14, .4, mat(0xd81a4a), 10, g, 0, .9, 0); return g; }
