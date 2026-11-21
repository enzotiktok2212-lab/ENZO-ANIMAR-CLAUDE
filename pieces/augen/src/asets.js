// Augen (Stumm) — escenarios: el pueblo de los mudos (calle de casas de colores con una pizarra junto a cada puerta, sin farolas,
// montañas nevadas detrás), el río con el puente de tablas, y la casa de mamá (cocina-comedor con su cama abajo, escalera, mi cuarto)
// y el salón de la señora Wendt (sillón de Konrad, mesita con la campanita y su foto).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, rrect } from './engine.js';
import { noiseTex, stripes, txt } from './props.js';
import { townhouse } from './gort.js';
import { glass } from './pech.js';
import { plankTex } from './sets.js';
import { cobbleTex as cobbleT } from './diam.js';
const cobbleTex = cobbleT();
export const FONT = 'Cap, sans-serif';
const rep = (t, a, b) => { t = t.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); return t; };
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const R = RNG(21);

// ---------- pizarra (Tafel) redibujable: marco de madera, tiza blanca con trazo irregular ----------
export function tafel(w = 3, h = 2.2, text = '') { const g = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = Math.round(w * 110); cv.height = Math.round(h * 110);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: .9 })); face.position.z = .09; g.add(face);
  const fr = mat(0x8a5a2a, { roughness: .7 }); box(w + .4, .22, .22, fr, .05, g, 0, h / 2 + .1, .05); box(w + .4, .22, .22, fr, .05, g, 0, -h / 2 - .1, .05); for (const s of [-1, 1]) box(.22, h + .4, .22, fr, .05, g, s * (w / 2 + .1), 0, .05);
  box(w * .5, .12, .3, fr, .03, g, 0, -h / 2 - .26, .15); box(.35, .1, .1, mat(0xf4f4f0), .03, g, w * .12, -h / 2 - .17, .22);
  g.userData.write = (s, k = 1, size = null) => { const c = cv.getContext('2d'), W = cv.width, H = cv.height; c.fillStyle = '#1f2a26'; c.fillRect(0, 0, W, H); const r = RNG(s.length * 13 + 5);
    for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,255,255,${.02 + r() * .04})`; c.beginPath(); c.ellipse(r() * W, r() * H, 10 + r() * 50, 4 + r() * 12, r() * 3, 0, 7); c.fill(); }   // tiza borrada
    const lines = s.split('\n'), n = Math.ceil(lines.join('').length * k); let left = n; const fs = size || Math.min(H / (lines.length + .6), W * 1.5 / Math.max(...lines.map(l => l.length + 1)));
    c.font = `700 ${fs}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    lines.forEach((l, i) => { const part = l.slice(0, Math.max(0, left)); left -= l.length; const y = H / 2 + (i - (lines.length - 1) / 2) * fs * 1.05;
      c.fillStyle = 'rgba(240,240,232,.92)'; c.fillText(part, W / 2, y); c.fillStyle = 'rgba(31,42,38,.35)'; for (let j = 0; j < 30; j++) c.fillRect(r() * W, y - fs / 2 + r() * fs, 3 + r() * 6, 1 + r() * 2); }); t.needsUpdate = true; };
  g.userData.write(text); g.userData.txt0 = text; return g; }

// ---------- montañas nevadas de fondo ----------
function mountains(parent, z0) { const rk = mat(0x7a7c8a, { roughness: .95, flatShading: true }), sn = mat(0xf4f8ff, { roughness: .6, flatShading: true }), gr = mat(0x5aa84a, { roughness: 1, flatShading: true });
  for (let i = 0; i < 9; i++) { const x = -900 + i * 225 + (R() - .5) * 80, h = 150 + R() * 110, r = 130 + R() * 60, z = z0 - 300 - R() * 200;
    const m = cyl(0, r, h, rk, 6 + (i % 3), parent, x, h / 2 - 10, z); m.rotation.y = R() * 3; const s = cyl(0, r * .36, h * .36, sn, 6 + (i % 3), parent, x, h - h * .18 - 10, z); s.rotation.y = m.rotation.y;
    cyl(r * 1.1, r * 1.3, 40, gr, 8, parent, x, 0, z + 40); } }

// ---------- el pueblo ----------
export function dorf(scene) { const G = new THREE.Group(); scene.add(G);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), mat(0x6aa84a, { map: rep(noiseTex('#6aa84a', ['#5a983a', '#7ab85a'], 900, 3), 120, 120), roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.set(0, -.05, -200); G.add(ground);
  const street = new THREE.Mesh(new THREE.PlaneGeometry(30, 330), mat(0xffffff, { map: rep(cobbleTex, 5, 50), roughness: .85 })); street.rotation.x = -Math.PI / 2; street.position.set(0, .02, -120); G.add(street);
  for (const s of [-1, 1]) box(6, .5, 330, mat(0xd8ccb8, { roughness: .8 }), .1, G, s * 17, .25, -120);
  // casas a ambos lados: puerta mirando a la calle; junto a cada puerta una pizarra con mensajes de tiza
  const H = [], BOARD = ['Brot?', 'Danke!', 'Milch 2x', 'Heute\nMarkt', 'Bin\nim Garten', 'Gute\nBesserung', 'Holz\nbitte', 'Kuchen\nfür Lotte', 'Danke\nfür die Eier', 'Ruhe!'];
  for (const s of [-1, 1]) { let z = 40, i = s > 0 ? 5 : 0;
    while (z > -260) { const wid = 16 + Math.floor(R() * 7), fl = 2 + Math.floor(R() * 2), rot = s > 0 ? -Math.PI / 2 : Math.PI / 2, cx = s * 30, cz = z - wid / 2;
      const hg = townhouse(G, cx, cz, wid, fl, i, rot); const lx = -wid * .28, lz = 10.06; const dx = cx + lx * Math.cos(rot) + lz * Math.sin(rot), dz = cz - lx * Math.sin(rot) + lz * Math.cos(rot);
      const tf = tafel(2.6, 1.9, BOARD[(i * 7) % BOARD.length]); const bx = -wid * .28 + 3.2, bz = 10.25; tf.position.set(cx + bx * Math.cos(rot) + bz * Math.sin(rot), 3.4, cz - bx * Math.sin(rot) + bz * Math.cos(rot)); tf.rotation.y = rot; G.add(tf);
      H.push({ door: new THREE.Vector3(dx, 0, dz), face: rot, side: s, board: tf, g: hg, wid }); z -= wid + .5; i++; } }
  // vallas de madera, macetas, carro de leña, banco: detalles
  for (let k = 0; k < 14; k++) { const z = 30 - k * 21, s = k % 2 ? 1 : -1; const pot = new THREE.Group(); pot.position.set(s * 18.5, .5, z); G.add(pot); cyl(.8, .6, 1.2, mat(0xc8643a), 10, pot, 0, .6, 0); for (let j = 0; j < 5; j++) sphere(.42, mat([0xe8323a, 0xffd23f, 0xff8ad0][j % 3]), pot, Math.cos(j * 1.3) * .5, 1.5, Math.sin(j * 1.3) * .5, 8, 6); sphere(.7, mat(0x3f9a45), pot, 0, 1.2, 0, 10, 8); }
  const cart = new THREE.Group(); cart.position.set(-11, 0, -60); cart.rotation.y = .3; G.add(cart); box(5, .4, 3, mat(0x9a6a3a), .05, cart, 0, 1.6, 0); for (const s of [-1, 1]) { const w = cyl(1.1, 1.1, .3, mat(0x5a3a1a), 14, cart, s * 1.6, 1.1, 1.6); w.rotation.x = Math.PI / 2; } for (let k = 0; k < 8; k++) { const l = cyl(.35, .35, 4.4, mat(0xb07a45), 8, cart, 0, 2.1 + Math.floor(k / 4) * .6, -1.1 + (k % 4) * .65); l.rotation.z = Math.PI / 2; }
  // el río al final de la calle y el puente de tablas (con un trozo podrido) y su cartel
  const RZ = -300; const water = new THREE.Mesh(new THREE.PlaneGeometry(1600, 50), mat(0x2a7ac8, { roughness: .12, metalness: .2, emissive: 0x0a2a4a, emissiveIntensity: .3 })); water.rotation.x = -Math.PI / 2; water.position.set(0, -2.2, RZ); G.add(water);
  for (const s of [-1, 1]) box(1600, 3, 6, mat(0x8a8478, { roughness: .9 }), .2, G, 0, -.8, RZ + s * 27);
  const BR = new THREE.Group(); BR.position.set(0, 0, RZ); G.add(BR); const pl = mat(0xffffff, { map: rep(plankTex, 1, 1), roughness: .8 }), dk = mat(0x6a4a2a, { roughness: .9 });
  const planks = []; for (let k = 0; k < 26; k++) { const p = box(10, .4, 1.8, pl, .05, BR, 0, .2, -24 + k * 1.9); planks.push(p); if (k === 13 || k === 14) { p.material = mat(0x4a3a2a, { roughness: 1 }); p.rotation.x = .5; p.position.y = -.6; } }
  for (const s of [-1, 1]) { box(.4, .4, 52, dk, .05, BR, s * 5, 2.8, 0); for (let k = 0; k < 9; k++) { box(.45, 3, .45, dk, .05, BR, s * 5, 1.4, -24 + k * 6); cyl(.5, .5, 5, dk, 8, BR, s * 4.6, -3, -24 + k * 6); } }
  const SIGN = tafel(3.4, 2.2, 'MORSCH!'); SIGN.position.set(6.6, 3.6, 26); SIGN.rotation.y = .3; BR.add(SIGN); box(.3, 3.6, .3, dk, .05, BR, 6.6, 1.2, 25.9);
  mountains(G, -800);
  // árboles alrededor del pueblo
  for (let k = 0; k < 40; k++) { const x = (k % 2 ? 1 : -1) * (75 + R() * 160), z = 60 - R() * 420; const t = new THREE.Group(); t.position.set(x, 0, z); G.add(t); cyl(.8, 1.1, 8, mat(0x6a4a2a), 8, t, 0, 4, 0); const c = cyl(0, 5 + R() * 2, 12 + R() * 4, mat(0x2f7a3a, { flatShading: true }), 7, t, 0, 13, 0); }
  return { G: shade(G), H, BR, SIGN, planks, RZ, water, ground }; }

// ---------- interiores ----------
const room = (scene, X, w, d, h, wall, floor, ceil = 0xf4efe6) => { const g = new THREE.Group(); g.position.x = X; scene.add(g); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil), 0, g, 0, h, 0); return g; };
const wallpaper = (a, b, n = 10) => mat(0xffffff, { map: rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { c.fillStyle = b; c.fillRect(i * w / n, 0, w / n / 2, h); } for (let y = 8; y < h; y += 32) for (let x = 6; x < w; x += 25.6) { c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); } }, true), 4, 2), roughness: .9 });
const floorM = () => mat(0xffffff, { map: rep(plankTex, 3, 3), roughness: .75 });
function windowNight(parent, x, y, z, ry = 0, w = 6, h = 7) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
  const sky = textPlane(w, h, 180, 210, (c, W, H) => { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0a1430'); gr.addColorStop(1, '#2a3a6a'); c.fillStyle = gr; c.fillRect(0, 0, W, H); c.fillStyle = '#f8f0c8'; c.beginPath(); c.arc(W * .7, H * .25, 18, 0, 7); c.fill(); for (let i = 0; i < 26; i++) { c.fillStyle = '#fff'; c.fillRect((i * 53) % W, (i * 37) % (H * .6), 2, 2); } c.fillStyle = '#1a2440'; c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 20) c.lineTo(x, H * .78 - Math.sin(x * .05) * 14 - (x % 60 ? 0 : 20)); c.lineTo(W, H); c.fill(); }, 1);
  sky.material.emissiveIntensity = .5; g.add(sky); const fr = mat(0xf4f0e8); box(w + .6, .4, .5, fr, .05, g, 0, h / 2, .1); box(w + .6, .5, 1.2, fr, .05, g, 0, -h / 2, .4); for (const s of [-1, 0, 1]) box(.3, h, .4, fr, .05, g, s * w / 2, 0, .1); box(w, .25, .3, fr, .05, g, 0, 0, .1);
  const cu = mat(0x9a3a4a, { roughness: 1 }); for (const s of [-1, 1]) box(1.6, h + 1.4, .3, cu, .1, g, s * (w / 2 + .6), .3, .5); return { g, sky }; }
function windowDay(parent, x, y, z, ry = 0, w = 6, h = 7) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
  const sky = textPlane(w, h, 180, 210, (c, W, H) => { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#6ab8f0'); gr.addColorStop(1, '#cfeaff'); c.fillStyle = gr; c.fillRect(0, 0, W, H); c.fillStyle = '#a8b0c0'; c.beginPath(); c.moveTo(0, H * .7); c.lineTo(W * .3, H * .35); c.lineTo(W * .55, H * .62); c.lineTo(W * .8, H * .4); c.lineTo(W, H * .6); c.lineTo(W, H); c.lineTo(0, H); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(W * .23, H * .43); c.lineTo(W * .3, H * .35); c.lineTo(W * .37, H * .44); c.fill(); c.fillStyle = '#5cc24a'; c.fillRect(0, H * .78, W, H); }, 1);
  sky.material.emissiveIntensity = .8; g.add(sky); const fr = mat(0xffffff); box(w + .6, .4, .5, fr, .05, g, 0, h / 2, .1); box(w + .6, .5, 1.2, fr, .05, g, 0, -h / 2, .4); for (const s of [-1, 0, 1]) box(.3, h, .4, fr, .05, g, s * w / 2, 0, .1);
  const cu = mat(0xf2c23a, { roughness: 1 }); for (const s of [-1, 1]) box(1.6, h + 1.4, .3, cu, .1, g, s * (w / 2 + .6), .3, .5); return g; }
function plate(parent, x, y, z) { cyl(1.1, .9, .15, mat(0xf8f8f4, { roughness: .25 }), 20, parent, x, y, z); }
function bun(parent, x, y, z) { const b = sphere(.55, mat(0xc0782e, { roughness: .7 }), parent, x, y, z, 14, 10); b.scale.set(1, .6, .8); box(.6, .06, .1, mat(0x8a4a1a), .02, parent, x, y + .3, z); }
function cup(parent, x, y, z, col) { cyl(.38, .32, .8, mat(col, { roughness: .3 }), 14, parent, x, y + .4, z); const h = new THREE.Mesh(new THREE.TorusGeometry(.22, .06, 6, 12), mat(col)); h.position.set(x + .4, y + .45, z); parent.add(h); }

// cocina-comedor de mamá (de día) con su cama en el rincón, la estufa, la mesa del desayuno, el bastón apoyado; la puerta de la escalera al fondo
export function kueche(scene, X) { const g = room(scene, X, 46, 34, 18, wallpaper('#9fd8c4', '#8ccab4'), floorM());
  windowDay(g, -8, 9.5, -16.7); windowDay(g, 22.7, 9.5, -2, -Math.PI / 2, 5, 6);
  // mesa con mantel de cuadros, desayuno, dos sillas
  const T = new THREE.Group(); T.position.set(0, 0, -2); g.add(T); const cl = mat(0xffffff, { map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(216,50,58,.6)'; for (let i = 0; i < 8; i += 2) { c.fillRect(i * 8, 0, 8, h); c.fillRect(0, i * 8, w, 8); } }, true), roughness: .9 });
  cl.map.repeat.set(3, 2); box(12, .3, 8, cl, .05, T, 0, 4.4, 0); box(12.4, 1, 8.4, cl, .05, T, 0, 4.0, 0); for (const [x, z] of [[-5.4, -3.4], [5.4, -3.4], [-5.4, 3.4], [5.4, 3.4]]) box(.5, 4, .5, mat(0x8a5a2a), .05, T, x, 2, z);
  plate(T, -3, 4.65, 2); plate(T, 3, 4.65, -2); bun(T, -3, 5, 2); bun(T, 3.2, 5, -2); cup(T, -1.4, 4.55, 2.4, 0x3a8ad8); cup(T, 1.6, 4.55, -2.6, 0xd8323a); const jam = cyl(.5, .5, 1.1, mat(0xb8203a, { roughness: .2, transparent: true, opacity: .9 }), 14, T, 0, 5.1, 0); cyl(.55, .55, .3, mat(0xffffff, { map: canvasTex(32, 32, (c, w, h) => { c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) c.fillRect(i * 8, (i % 2) * 8, 4, 4); }, true) }), 14, T, 0, 5.8, 0);
  for (const s of [-1, 1]) { const ch = new THREE.Group(); ch.position.set(0, 0, s * 6.4); ch.rotation.y = s > 0 ? Math.PI : 0; T.add(ch); box(4, .4, 3.6, mat(0xd8a050), .1, ch, 0, 3, 0); box(4, 4.4, .4, mat(0xd8a050), .1, ch, 0, 5, -1.7); for (const [x, z] of [[-1.7, -1.5], [1.7, -1.5], [-1.7, 1.5], [1.7, 1.5]]) box(.35, 3, .35, mat(0xb07a35), .05, ch, x, 1.5, z); }
  // estufa de leña con tetera, estante con cazos, flores
  const ST = new THREE.Group(); ST.position.set(-17, 0, -13); g.add(ST); box(6, 5, 4.6, mat(0x2a2a30, { metalness: .5, roughness: .4 }), .2, ST, 0, 2.5, 0); box(2.4, 1.6, .2, mat(0x101014), .05, ST, 0, 2.4, 2.35); cyl(.6, .6, 11, mat(0x2a2a30, { metalness: .5 }), 10, ST, 0, 10, -1); const kt = sphere(1, mat(0xd8783a, { metalness: .3, roughness: .3 }), ST, 1, 5.8, 0, 14, 10); kt.scale.y = .8;
  const SH = new THREE.Group(); SH.position.set(10, 0, -16.6); g.add(SH); box(10, .4, 2, mat(0x8a5a2a), .05, SH, 0, 11, .8); box(10, .4, 2, mat(0x8a5a2a), .05, SH, 0, 14, .8); for (let k = 0; k < 5; k++) { cyl(.7, .7, 1.1, mat([0xd8323a, 0x3a8ad8, 0xf2c23a, 0x3aa85a, 0xd8783a][k], { roughness: .3 }), 14, SH, -4 + k * 2, 11.8, .8); sphere(.5, mat([0xff8ad0, 0xffd23f, 0xe8323a][k % 3]), SH, -4 + k * 2, 14.6, .8, 10, 8); }
  // la cama de mamá en el rincón (abajo, desde que se cayó): edredón de flores
  const BED = new THREE.Group(); BED.position.set(17, 0, 9); BED.rotation.y = -Math.PI / 2; g.add(BED); box(7, 2.2, 12, mat(0x8a5a2a), .2, BED, 0, 1.4, 0); box(7.4, 5, .6, mat(0x8a5a2a), .2, BED, 0, 3.2, -6);
  box(6.8, 1, 11.4, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#f6e6f0'; c.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { c.fillStyle = ['#e8508a', '#f2a23a', '#5ab85a'][i % 3]; c.beginPath(); c.arc((i * 23) % w, (i * 37) % h, 5, 0, 7); c.fill(); } }, true), 3, 4), roughness: .95 }), .4, BED, 0, 3, .4); box(4, 1, 2.4, mat(0xffffff), .4, BED, 0, 3.6, -4.4);
  // el bastón apoyado en la cama
  const CANE = cane(); CANE.position.set(13.2, 0, 4); CANE.rotation.z = .12; g.add(CANE);
  // puerta del hueco de la escalera
  box(5, 9, .4, mat(0x2a5a8a), .1, g, -20, 4.5, 8); box(.3, 9.6, .5, mat(0xf4f0e8), .05, g, -22.6, 4.8, 8);
  const L = new THREE.PointLight(0xfff0d8, 130, 70, 1.3); L.position.set(0, 15, 2); g.add(L);
  return { g: shade(g), T, BED, CANE, L }; }

// el bastón de mamá (madera oscura, mango curvo)
export function cane() { const g = new THREE.Group(); const m = mat(0x5a3218, { roughness: .4 }); cyl(.14, .14, 6.4, m, 8, g, 0, 3.2, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.55, .14, 8, 16, Math.PI), m); h.position.set(.55, 6.4, 0); g.add(h); cyl(.17, .17, .3, mat(0x1a1a1a), 8, g, 0, .15, 0); return g; }

// escalera recta de la casa (de noche): peldaños con alfombra de colores, barandilla, puerta de mi cuarto arriba; abajo, la cocina a oscuras
export function treppe(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g); const wall = wallpaper('#b8a8e0', '#a898d4');
  box(30, .4, 30, floorM(), 0, g, 0, -.2, 0); box(.4, 34, 60, wall, 0, g, -7, 17, -10); box(.4, 34, 60, wall, 0, g, 7, 17, -10); box(14, 34, .4, wall, 0, g, 0, 17, -40); box(14, .4, 60, mat(0xf4efe6), 0, g, 0, 34, -10);
  const run = ['#d8323a', '#f2a23a', '#ffd23f', '#5ab85a', '#3a8ad8', '#8a5ad8']; const N = 16;
  for (let k = 0; k < N; k++) { box(10, 1.05, 1.9, mat(0xa87a4a, { roughness: .6 }), .05, g, 0, .52 + k * 1.05, 4 - k * 1.9); box(6, .08, 1.95, mat(run[k % 6], { roughness: 1 }), .02, g, 0, 1.06 + k * 1.05, 4 - k * 1.9); }
  box(14, .5, 12, floorM(), 0, g, 0, N * 1.05, 4 - N * 1.9 - 5);   // rellano de arriba
  const rl = mat(0x6a3a1a, { roughness: .4 }); const rail = box(.3, .3, N * 2.15, rl, .1, g, 4.6, N * 1.05 / 2 + 3.4, 4 - N * .95); rail.rotation.x = Math.atan2(1.05, 1.9); for (let k = 0; k < N; k += 2) box(.18, 3, .18, rl, .03, g, 4.6, 1.05 * k + 2.4, 4 - k * 1.9);
  box(5, 9, .4, mat(0x9a5a3a), .1, g, 0, N * 1.05 + 4.5, -37.6); sphere(.25, mat(0xd9a531, { metalness: .8 }), g, 1.8, N * 1.05 + 4.4, -37.3);   // mi puerta
  const sign = textPlane(3.2, 1.2, 160, 60, (c, w, h) => { c.fillStyle = '#fff6e0'; c.beginPath(); c.roundRect(0, 0, w, h, 14); c.fill(); txt(c, '✶ ZIMMER ✶', w / 2, h / 2 + 2, 26, '#3a5a8a'); }); sign.position.set(0, N * 1.05 + 10.2, -37.3); g.add(sign);
  windowNight(g, -6.7, N * 1.05 + 8, -30, Math.PI / 2, 4, 5);
  const MOON = new THREE.PointLight(0x7a9aff, 40, 50, 1.4); MOON.position.set(-3, N * 1.05 + 9, -30); g.add(MOON); const L = new THREE.PointLight(0xfff0d8, 0, 60, 1.3); L.position.set(0, 26, -8); g.add(L);
  return { g: shade(g), N, step: k => new THREE.Vector3(X, 1.05 * k + 1.05, 4 - k * 1.9), top: new THREE.Vector3(X, N * 1.05, -32), MOON, L }; }

// mi cuarto (de noche): cama con edredón de retales junto a la pared, mesita, ventana con luna, armario, dibujos de niño, la puerta
export function zimmer(scene, X) { const g = room(scene, X, 34, 30, 16, wallpaper('#7a9ad8', '#6a8ac8'), floorM());
  const W = windowNight(g, -6, 8.5, -14.7);
  const BED = new THREE.Group(); BED.position.set(-6, 0, -6); g.add(BED); box(7, 2.2, 13, mat(0x9a6a3a), .2, BED, 0, 1.3, 0); box(7.4, 5.4, .6, mat(0x9a6a3a), .2, BED, 0, 3.2, -6.5);
  const quilt = mat(0xffffff, { map: rep(canvasTex(128, 128, (c, w, h) => { const C = ['#e8505b', '#f2c23a', '#5ab8e8', '#6ac86a', '#b878e8', '#f28a3a']; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { c.fillStyle = C[(x * 3 + y * 5) % 6]; c.fillRect(x * 32, y * 32, 32, 32); c.strokeStyle = 'rgba(255,255,255,.6)'; c.setLineDash([4, 3]); c.strokeRect(x * 32 + 2, y * 32 + 2, 28, 28); } }, true), 2, 3), roughness: 1 });
  const Q = box(6.9, 1, 9, quilt, .4, BED, 0, 2.9, 1.8); box(5, 1.1, 2.6, mat(0xa8b4cc), .5, BED, 0, 3.2, -4.6);
  const NS = new THREE.Group(); NS.position.set(-11.6, 0, -11); g.add(NS); box(3.4, 3.6, 3, mat(0x8a5a2a), .1, NS, 0, 1.8, 0); box(2.6, .9, .1, mat(0x6a4a2a), .05, NS, 0, 2.6, 1.52); sphere(.15, mat(0xd9a531), NS, 0, 2.6, 1.6, 6, 4); cyl(.5, .5, 1.2, mat(0x5a8ad8, { roughness: .3 }), 12, NS, -.6, 4.2, 0);
  // armario, estante con juguetes viejos, dibujos (casa, sol, mamá y yo)
  const AR = new THREE.Group(); AR.position.set(12.5, 0, -12); g.add(AR); box(8, 13, 4.4, mat(0xd8a050), .2, AR, 0, 6.5, 0); box(.1, 12, .1, mat(0x5a3a1a), 0, AR, 0, 6.5, 2.22); for (const s of [-1, 1]) sphere(.2, mat(0xd9a531), AR, s * .6, 6.5, 2.3, 6, 4);
  box(8, .3, 2, mat(0x8a5a2a), .05, g, 2, 11, -14); sphere(.8, mat(0xe8505b), g, -.5, 12, -14, 12, 8); box(1.2, 1.4, 1.2, mat(0x3a8ad8), .2, g, 2, 11.9, -14); box(1.6, 1.6, 1.4, mat(0xf2c23a), .2, g, 4.4, 12, -14);
  const draw = textPlane(4, 3, 200, 150, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(30, 30, 18, 0, 7); c.fill(); c.strokeStyle = '#e8323a'; c.lineWidth = 4; c.strokeRect(70, 60, 60, 50); c.beginPath(); c.moveTo(64, 62); c.lineTo(100, 30); c.lineTo(136, 62); c.stroke(); c.fillStyle = '#3a6ad8'; c.fillRect(150, 70, 12, 40); c.fillStyle = '#e8508a'; c.fillRect(170, 60, 14, 50); c.fillStyle = '#5ab85a'; c.fillRect(0, 120, w, 30); }); draw.position.set(4, 8, -14.75); g.add(draw);
  const DOOR = new THREE.Group(); DOOR.position.set(16.6, 0, 6); g.add(DOOR); const dp = new THREE.Group(); dp.position.z = -2.6; DOOR.add(dp); box(.4, 9.4, 5.2, mat(0x9a5a3a), .1, dp, 0, 4.7, 2.6); sphere(.25, mat(0xd9a531, { metalness: .8 }), dp, -.3, 4.6, 4.6);
  box(.2, 10, .5, mat(0xf4f0e8), .05, g, 16.7, 5, 3.2); box(.2, 10, .5, mat(0xf4f0e8), .05, g, 16.7, 5, 8.8); box(.2, .5, 6, mat(0xf4f0e8), .05, g, 16.7, 10, 6);
  const MOON = new THREE.SpotLight(0x8aa8ff, 220, 80, .7, .6, 1.2); MOON.position.set(-6, 10, -13); MOON.target.position.set(-6, 0, -2); g.add(MOON, MOON.target); MOON.target.position.x += 0;
  const L = new THREE.PointLight(0xfff0d8, 0, 60, 1.3); L.position.set(0, 14, 0); g.add(L);
  return { g: shade(g), BED, Q, DOOR: dp, MOON, L, W }; }

// salón de la señora Wendt (al atardecer): sillón de terciopelo verde de Konrad, mesita con la campanita y su foto, alfombra, reloj de pared
export function wendt(scene, X) { const g = room(scene, X, 36, 30, 17, wallpaper('#e8b8a0', '#dca890'), floorM());
  const rug = new THREE.Mesh(new THREE.CircleGeometry(9, 28), mat(0xffffff, { map: canvasTex(128, 128, (c, w, h) => { for (let r = 64; r > 0; r -= 10) { c.fillStyle = ['#a83a3a', '#f2c23a', '#3a6a8a', '#e8e0d0'][(r / 10) % 4 | 0]; c.beginPath(); c.arc(64, 64, r, 0, 7); c.fill(); } }) })); rug.rotation.x = -Math.PI / 2; rug.position.y = .03; g.add(rug);
  windowDay(g, 8, 9, -14.7); const SES = sessel(0x2f6a4a); SES.position.set(-7, 0, -6); SES.rotation.y = .35; g.add(SES);
  const SES2 = sessel(0xa83a5a); SES2.position.set(12, 0, -9); SES2.rotation.y = -.6; g.add(SES2);
  const TB = new THREE.Group(); TB.position.set(0, 0, -6); g.add(TB); cyl(2, 2, .3, mat(0x8a5a2a, { roughness: .4 }), 20, TB, 0, 4, 0); cyl(.3, .5, 4, mat(0x6a4a2a), 10, TB, 0, 2, 0); cyl(1.4, 1.4, .2, mat(0x6a4a2a), 16, TB, 0, .1, 0);
  const PH = new THREE.Group(); PH.position.set(.8, 4.15, -.6); PH.rotation.y = -.3; TB.add(PH); box(1.6, 2, .2, mat(0xd9a531, { metalness: .7, roughness: .3 }), .05, PH, 0, 1, 0);
  const pic = textPlane(1.3, 1.65, 100, 128, (c, w, h) => { c.fillStyle = '#d8c8a8'; c.fillRect(0, 0, w, h); c.fillStyle = '#f0c09c'; c.fillRect(30, 30, 40, 40); c.fillStyle = '#6a6a6a'; c.fillRect(28, 22, 44, 12); c.fillStyle = '#1a1a1a'; c.fillRect(40, 44, 6, 6); c.fillRect(56, 44, 6, 6); c.fillRect(36, 60, 28, 4); c.fillStyle = '#4a5a3a'; c.fillRect(18, 72, 64, 56); }); pic.position.set(0, 1, .11); PH.add(pic);
  const clock = new THREE.Group(); clock.position.set(-12, 11, -14.7); g.add(clock); cyl(1.6, 1.6, .3, mat(0x8a5a2a), 24, clock, 0, 0, 0).rotation.x = Math.PI / 2; const cf = new THREE.Mesh(new THREE.CircleGeometry(1.3, 24), mat(0xf8f4e8)); cf.position.z = .2; clock.add(cf); box(.08, 1, .05, mat(0x1a1a1a), 0, clock, 0, .4, .25); box(.7, .08, .05, mat(0x1a1a1a), 0, clock, .3, 0, .25);
  const plant = new THREE.Group(); plant.position.set(14, 0, -12); g.add(plant); cyl(1.2, .9, 2.4, mat(0xc8643a), 12, plant, 0, 1.2, 0); for (let k = 0; k < 7; k++) { const l = box(.6, 4, .2, mat(0x3f9a45), .1, plant, 0, 4, 0); l.rotation.set(Math.cos(k) * .5, k, Math.sin(k) * .5); }
  const L = new THREE.PointLight(0xffd8a0, 110, 60, 1.3); L.position.set(0, 14, 0); g.add(L);
  return { g: shade(g), SES, TB, L }; }
function sessel(col) { const g = new THREE.Group(); const m = mat(col, { roughness: .9 }), w = mat(0x5a3218, { roughness: .4 }); box(6, 2, 5.4, m, .5, g, 0, 2.6, 0); box(6, 6, 1.6, m, .6, g, 0, 5.4, -2.2); for (const s of [-1, 1]) box(1.3, 3.2, 5.4, m, .5, g, s * 3, 3.4, 0);
  box(4.6, 1, 4, m, .45, g, 0, 3.8, .4); for (const [x, z] of [[-2.6, -2.2], [2.6, -2.2], [-2.6, 2.2], [2.6, 2.2]]) cyl(.22, .16, 1.6, w, 8, g, x, .8, z); for (let k = 0; k < 6; k++) sphere(.12, mat(0xd9a531, { metalness: .8 }), g, -2.2 + k * .9, 7.8, -1.35, 6, 4); return g; }

// campanita de latón con mango de madera
export function glocke() { const g = new THREE.Group(); const b = mat(0xe0b040, { metalness: .85, roughness: .22, emissive: 0x3a2800, emissiveIntensity: .2 }); const bell = new THREE.Mesh(new THREE.CylinderGeometry(.25, .6, .9, 20, 1, true), b); bell.material.side = THREE.DoubleSide; g.add(bell); sphere(.25, b, g, 0, .45, 0, 12, 8); cyl(.12, .14, 1.1, mat(0x5a3218, { roughness: .4 }), 8, g, 0, 1.1, 0); sphere(.17, mat(0x5a3218), g, 0, 1.7, 0, 8, 6); sphere(.12, b, g, 0, -.5, 0, 8, 6); g.userData.bell = bell; return g; }
// cerilla: palito de madera con cabeza roja; llama (cono aditivo) + luz cálida
export function streichholz() { const g = new THREE.Group(); box(.08, 1.4, .08, mat(0xe8d0a0, { roughness: .8 }), .02, g, 0, 0, 0); const hd = sphere(.1, mat(0xb8202a, { roughness: .6 }), g, 0, .72, 0, 8, 6); hd.scale.y = 1.4;
  const fm = new THREE.MeshBasicMaterial({ color: 0xffc860, transparent: true, opacity: .95, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }); const fl = new THREE.Mesh(new THREE.SphereGeometry(.16, 12, 8), fm); fl.scale.set(1, 2.4, 1); fl.position.y = 1.05; g.add(fl);
  const core = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); core.position.y = .92; g.add(core);
  const L = new THREE.PointLight(0xffa040, 0, 40, 1.6); L.position.y = 1.1; g.add(L); g.userData = { fl, core, L, lit: (v, T = 0) => { fl.visible = core.visible = v > 0; L.intensity = v * (60 + Math.sin(T * 31) * 8 + Math.sin(T * 17) * 6); fl.scale.set(1 + Math.sin(T * 23) * .08, 2.4 + Math.sin(T * 29) * .3, 1); } }; g.userData.lit(0); return g; }
