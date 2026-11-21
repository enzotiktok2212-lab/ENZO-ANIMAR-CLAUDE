// Nichts — escenarios y atrezo propios:
// Keller (sótano con escalera, bombilla que parpadea, lavadora y secadora con ropa girando), Restaurant (fachada + interior),
// Bad (baño), Nacht (fachada de la casa con ventana real + calle con farola y el buzón-"figura"), Supermarkt,
// coches, camión, semáforo, furgoneta de la Stadtwerke, armario eléctrico, comida (burger, patatas), cepillo, linterna.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree } from './props.js';
import { glass, label } from './pech.js';
import { house } from './pech.js';
import { lantern } from './diam.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const glow = (c, i = 1) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: .4 });
const basic = c => new THREE.MeshBasicMaterial({ color: c, toneMapped: false });
const plankT = (a, b) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(a.length); for (let y = 0; y < h; y += 16) { c.fillStyle = r() > .5 ? b : a; c.fillRect(0, y, w, 15); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y + 15, w, 1); } }, true);
const tiles = (a, b, n = 4) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= w; i += w / n) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }, true);
const checker = (a, b) => canvasTex(128, 128, (c, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.fillStyle = (i + j) % 2 ? a : b; c.fillRect(i * 32, j * 32, 32, 32); } }, true);
const concrete = () => noiseTex('#8a8680', ['#7a7670', '#9a9690', '#6e6a64'], 2200, 2, 1);
const brick = (a = '#a8503a', m = '#d8c8b0') => canvasTex(128, 128, (c, w, h) => { c.fillStyle = m; c.fillRect(0, 0, w, h); const r = RNG(9); for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { c.fillStyle = a; c.globalAlpha = .8 + r() * .2; c.fillRect(x + 1, y + 1, 30, 14); } c.globalAlpha = 1; }, true);
const sg = (w, h, t, bg, fg, s = 60, gl = .4) => label(w, h, t, bg, fg, s, gl);
function room(g, w, d, h, wallM, floorM, ceilM, open = []) {
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorM); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  if (!open.includes('back')) box(w, h, .6, wallM, 0, g, 0, h / 2, -d / 2);
  if (!open.includes('left')) box(.6, h, d, wallM, 0, g, -w / 2, h / 2, 0);
  if (!open.includes('right')) box(.6, h, d, wallM, 0, g, w / 2, h / 2, 0);
  if (!open.includes('front')) box(w, h, .6, wallM, 0, g, 0, h / 2, d / 2);
  if (ceilM) box(w, .6, d, ceilM, 0, g, 0, h, 0);
}

// ---------- Keller (X) ----------
export function keller(scene, X) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g);
  room(g, 32, 26, 15, mat(0xffffff, { map: rep(concrete(), 4, 2), roughness: 1 }), mat(0xffffff, { map: rep(noiseTex('#6a6660', ['#5a5650', '#7a7670'], 2000, 2, 1), 4, 4), roughness: .95 }), mat(0x5a5650, { roughness: 1 }));
  const wood = mat(0xffffff, { map: rep(plankT('#8a6a44', '#7a5a38'), 1, 1), roughness: .8 }), dark = mat(0x3a2a1a);
  // escalera de madera (8 peldaños) desde la puerta de arriba (z = -13) bajando hacia delante
  const ST = new THREE.Group(); ST.position.set(-12, 0, 0); g.add(ST);
  for (let i = 0; i < 8; i++) { const y = 8 - i, z = -11.7 + i * 1.3; box(4, .3, 1.3, wood, .04, ST, 0, y - .15, z); box(4, 1, .12, dark, .02, ST, 0, y - .7, z - .6); }
  for (const s of [-1, 1]) { const b = box(.3, .9, 12.8, wood, .05, ST, s * 2.1, 4.1, -6.4); b.rotation.x = Math.atan2(8, 10.4); }
  for (let i = 0; i < 4; i++) { const p = cyl(.1, .1, 3.6, wood, 6, ST, 2.1, 9.4 - i * 2.2 - 1.6, -11.5 + i * 2.85); }
  const rail = cyl(.12, .12, 13.5, wood, 8, ST, 2.1, 7.6, -6.4); rail.rotation.x = -(Math.PI / 2 - Math.atan2(8, 10.4));
  box(4, .4, 1.8, wood, .04, ST, 0, 7.8, -12.3);
  // puerta de arriba (gira con door.rotation.y)
  const door = new THREE.Group(); door.position.set(-13.6, 8, -12.85); g.add(door); box(3.2, 5.8, .25, mat(0x6a4a2e), .05, door, 1.6, 2.9, 0); sphere(.18, mat(0xc8a040, { metalness: .8 }), door, 2.8, 2.9, .2);
  box(3.6, 6.2, .3, mat(0x3a2a1a), 0, g, -12, 10.9, -12.95);
  // bombilla colgante (parpadea con setBulb)
  const cord = cyl(.03, .03, 2.4, mat(0x111111), 4, g, -2, 13.6, -2); const bulbM = glow(0xfff0c0, 1.5); const bulb = sphere(.38, bulbM, g, -2, 12.2, -2, 14, 10); cyl(.2, .2, .3, mat(0x5a5a5a, { metalness: .7 }), 10, g, -2, 12.65, -2);
  const bl = new THREE.PointLight(0xffd8a0, 90, 40, 1.4); bl.position.set(-2, 11.6, -2); bl.castShadow = true; bl.shadow.mapSize.set(512, 512); g.add(bl);
  // ventanuco con luz de la mañana
  box(5, 2, .2, mat(0xcfe8ff, { emissive: 0xbfe0ff, emissiveIntensity: 1.2 }), .05, g, 8, 12.6, -12.65);
  const sun = new THREE.SpotLight(0xffe8c8, 120, 50, .5, .6, 1.2); sun.position.set(8, 12.6, -12); sun.target.position.set(8, 0, 2); g.add(sun, sun.target);
  // lavadora y secadora
  const mach = (x, kind) => { const m = new THREE.Group(); m.position.set(x, 0, -10.6); g.add(m); box(4.2, 5, 4, mat(0xf4f6f8, { roughness: .3 }), .3, m, 0, 2.5, 0); box(4.2, .9, .2, mat(0xdde2e8), .1, m, 0, 4.4, 2.05);
    for (let k = 0; k < 3; k++) cyl(.2, .2, .15, mat([0x2a2a2e, 0x2a6ad8, 0x2a2a2e][k]), 12, m, -1.2 + k * .9, 4.4, 2.18).rotation.x = Math.PI / 2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, .2, 10, 30), mat(0xb8c0c8, { metalness: .8, roughness: .25 })); ring.position.set(0, 2.2, 2.05); m.add(ring);
    const drum = new THREE.Group(); drum.position.set(0, 2.2, 1.5); m.add(drum); const back = new THREE.Mesh(new THREE.CircleGeometry(1.2, 28), mat(0x3a4048, { metalness: .6 })); back.position.z = -.3; drum.add(back);
    const r = RNG(kind === 'dry' ? 3 : 4); for (let k = 0; k < 9; k++) { const a = r() * 6.283, d = .3 + r() * .7; const s = box(.7, .5, .4, mat([0xd8323a, 0x2a6ad8, 0xf2c23a, 0xf4f4f4, 0x4cb64a][k % 5], { roughness: .9 }), .2, drum, Math.cos(a) * d, Math.sin(a) * d, 0); s.rotation.z = a; }
    const gl = new THREE.Mesh(new THREE.CircleGeometry(1.15, 28), mat(0xcfe8ff, { transparent: true, opacity: .25, roughness: .05, metalness: .2 })); gl.position.set(0, 2.2, 2.1); m.add(gl);
    if (kind === 'dry') { const lbl = sg(2.4, .5, 'TROCKNER', '#dde2e8', '#2a3a4a', 26, .2); lbl.position.set(0, 3.8, 2.06); m.add(lbl); } return { m, drum }; };
  const W1 = mach(6, 'wash'), DR = mach(10.6, 'dry');
  // estanterías, cajas, calderas, tuberías, cuerda de tender
  const shelf = new THREE.Group(); shelf.position.set(14.6, 0, 0); g.add(shelf); for (const z of [-6, 6]) box(2.4, 11, .3, wood, .03, shelf, 0, 5.5, z);
  for (let lv = 0; lv < 4; lv++) { box(2.4, .25, 12, wood, .03, shelf, 0, 1.5 + lv * 2.8, 0); for (let k = 0; k < 6; k++) { const r = RNG(lv * 10 + k); if (r() < .5) cyl(.4, .4, 1.1, mat([0xd8a050, 0x8a3a2a, 0x2a6a4a, 0xe8d8b8][k % 4], { roughness: .6 }), 10, shelf, -.2, 2.2 + lv * 2.8, -5 + k * 2); else box(1.6, 1.2, 1.6, mat(0xb8905a, { roughness: 1 }), .06, shelf, -.2, 2.25 + lv * 2.8, -5 + k * 2); } }
  for (let k = 0; k < 5; k++) box(2.6, 2, 2.4, mat(0xb8905a, { roughness: 1 }), .06, g, -4 + (k % 3) * 2.8, 1 + Math.floor(k / 3) * 2, 11);
  const boiler = cyl(1.6, 1.6, 9, mat(0xd8d8d0, { roughness: .4, metalness: .3 }), 20, g, 14.4, 4.5, 10); for (let k = 0; k < 3; k++) { const p = cyl(.22, .22, 30, mat(0x8a6a4a, { metalness: .6, roughness: .4 }), 8, g, 0, 13.8 - k * .5, -8 + k * 1.2); p.rotation.z = Math.PI / 2; }
  const line = cyl(.03, .03, 26, mat(0xf4f4f4), 4, g, 2, 10.5, 4); line.rotation.z = Math.PI / 2; for (let k = 0; k < 6; k++) { const sh = box(1.6, 2, .1, mat([0xf2c23a, 0x7ab8e8, 0xff8ab0, 0xf4f4f4, 0x4cb64a, 0xd8323a][k], { roughness: .9 }), .05, g, -8 + k * 3.2, 9.4, 4); sh.rotation.y = .1; box(.15, .3, .15, mat(0xc8a040), .02, g, -8 + k * 3.2, 10.5, 4.05); }
  const basket = new THREE.Group(); g.add(basket); cyl(1.3, 1.1, 1.6, mat(0xe8d8b0, { roughness: 1 }), 16, basket, 0, .8, 0); for (let k = 0; k < 4; k++) sphere(.55, mat([0xf4f4f4, 0x7ab8e8, 0xff8ab0, 0xf2c23a][k], { roughness: 1 }), basket, -.4 + (k % 2) * .8, 1.7, -.3 + Math.floor(k / 2) * .6, 10, 8); basket.position.set(8, 0, -6);
  const flash = new THREE.Group(); g.add(flash); cyl(.25, .3, 1.4, mat(0x2a2a2e, { metalness: .5 }), 10, flash, 0, 0, 0).rotation.x = Math.PI / 2; const fb = sphere(.24, glow(0xfff8e0, 3), flash, 0, 0, .7, 10, 8);
  return { g: shade(g), door, bulb, bulbM, bl, drum: DR.drum, wdrum: W1.drum, basket, flash, sun,
    setBulb(v) { bl.intensity = 90 * v; bulbM.emissiveIntensity = .05 + 1.5 * v; } };
}
// ---------- Restaurant (X): fachada en z = +14 (calle delante), interior detrás ----------
export function restaurant(scene, X) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const wallIn = mat(0xffffff, { map: rep(stripes('#f4e2c4', '#ecd6b0', 10), 6, 1) });
  room(g, 40, 28, 13, wallIn, mat(0xffffff, { map: rep(checker('#1a1a1e', '#f4f4f4'), 10, 7), roughness: .35 }), mat(0xf6efe2), ['front']);
  box(40, 3, .4, mat(0x8a2a2a), .05, g, 0, 1.5, -13.6); for (const s of [-1, 1]) box(.4, 3, 28, mat(0x8a2a2a), .05, g, s * 19.6, 1.5, 0);
  // fachada (pared delantera con puerta y escaparates; por fuera ladrillo)
  const F = new THREE.Group(); F.position.z = 14; g.add(F); const br = mat(0xffffff, { map: rep(brick(), 8, 4) });
  box(40, 3.2, .8, br, 0, F, 0, 1.6, 0); box(40, 4, .8, br, 0, F, 0, 11, 0); box(4, 13, .8, br, 0, F, -18, 6.5, 0); box(3, 13, .8, br, 0, F, 18.5, 6.5, 0); box(2, 13, .8, br, 0, F, 9, 6.5, 0); box(2.5, 13, .8, br, 0, F, 15.75, 6.5, 0);
  for (const x of [-12, -3]) { box(8.5, 5.8, .15, mat(0xbfe0f4, { transparent: true, opacity: .35, roughness: .05, metalness: .3 }), .02, F, x + 1.5, 6.1, 0); box(.3, 5.8, .9, mat(0x2a2a2e), .03, F, x + 1.5, 6.1, 0); }
  box(.4, 9, .9, mat(0x2a2a2e), .03, F, -7.5, 6.1, 0);
  const dG = new THREE.Group(); dG.position.set(10, 0, 0); F.add(dG); box(4.6, 9, .25, mat(0x2a2a2e, { metalness: .4 }), .05, dG, 2.3, 4.5, 0); box(3.6, 6.4, .1, mat(0xbfe0f4, { transparent: true, opacity: .35 }), .02, dG, 2.3, 5, .1);
  const aw = new THREE.Mesh(new THREE.BoxGeometry(34, .3, 3.4), mat(0xffffff, { map: stripes('#c8282e', '#f8ecd2', 14) })); aw.position.set(-1, 9.4, 1.6); aw.rotation.x = .3; F.add(aw);
  const sign = sg(16, 2.6, 'RESTAURANT', '#1d2238', '#ffd23f', 84, .9); sign.position.set(-1, 11.4, .45); F.add(sign);
  const open = sg(3, 1, 'GEÖFFNET', '#2a8a4a', '#ffffff', 34, .8); open.position.set(12.3, 7.5, .2); F.add(open);
  const out = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), mat(0xffffff, { map: rep(noiseTex('#c8c4bc', ['#b8b4ac', '#d8d4cc'], 1500, 2, 1), 12, 6) })); out.rotation.x = -Math.PI / 2; out.position.set(0, .02, 44); g.add(out);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(120, 16), mat(0x4a5060, { roughness: .9 })); road.rotation.x = -Math.PI / 2; road.position.set(0, .05, 30); g.add(road);
  for (let k = -5; k <= 5; k++) box(4, .05, .4, mat(0xffffff), 0, g, k * 10, .08, 30);
  for (const x of [-26, 26]) tree(g, x, 18, .9); for (const x of [-30, 30]) { const b = new THREE.Group(); b.position.set(x * 1.4, 0, 0); g.add(b); box(16, 18, 26, mat(0xffffff, { map: rep(brick(['#c87a4a', '#8a8aa8'][x > 0 ? 1 : 0]), 6, 6) }), 0, b, 0, 9, 0); }
  // interior: mostrador con taburetes, carta, pasa-platos, lámparas, mesas
  box(26, 3.4, 2.4, mat(0xd83a3a, { roughness: .4 }), .1, g, -2, 1.7, -10.6); box(26.4, .3, 2.8, mat(0xf4f4f4, { roughness: .2 }), .05, g, -2, 3.5, -10.6);
  for (let k = 0; k < 7; k++) { cyl(.15, .2, 2.2, mat(0xc0c0c8, { metalness: .8 }), 8, g, -13 + k * 3.6, 1.1, -8.4); cyl(.8, .8, .35, mat(0xd83a3a), 16, g, -13 + k * 3.6, 2.3, -8.4); }
  const menu = textPlane(14, 4.4, 700, 220, (c, w, h) => { c.fillStyle = '#1a1a1e'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16); txt(c, 'SPEISEKARTE', w / 2, 40, 40, '#ffd23f');
    [['BURGER', '7,50 €'], ['POMMES', '3,20 €'], ['COLA', '2,50 €']].forEach(([a, b], i) => { c.textAlign = 'left'; txt(c, '', 0, 0, 10, '#fff'); c.font = '700 36px Cap, sans-serif'; c.fillStyle = '#fff'; c.textAlign = 'left'; c.fillText(a, 60, 100 + i * 46); c.textAlign = 'right'; c.fillStyle = '#7ae09a'; c.fillText(b, w - 60, 100 + i * 46); }); }, .9);
  menu.position.set(-2, 9, -13.6); g.add(menu);
  for (let k = 0; k < 4; k++) { cyl(.04, .04, 3, mat(0x1a1a1a), 4, g, -12 + k * 8, 11.5, -2); const sh = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1, 16, 1, true), mat(0x2a6a4a, { side: THREE.DoubleSide, roughness: .4 })); sh.position.set(-12 + k * 8, 9.8, -2); g.add(sh); sphere(.3, glow(0xfff0c0, 2), g, -12 + k * 8, 9.5, -2, 10, 8); }
  const pl = new THREE.PointLight(0xffe0b0, 60, 50, 1.3); pl.position.set(0, 10, 0); g.add(pl);
  for (let k = 0; k < 3; k++) { const p = textPlane(3, 3.6, 150, 180, (c, w, h) => { c.fillStyle = '#5a3a1e'; c.fillRect(0, 0, w, h); c.fillStyle = ['#ffd23f', '#d83a3a', '#7ab8e8'][k]; c.fillRect(10, 10, w - 20, h - 20); c.fillStyle = '#fff'; c.beginPath(); c.arc(w / 2, h / 2, 34, 0, 7); c.fill(); }); p.position.set(-19.3, 8, -8 + k * 7); p.rotation.y = Math.PI / 2; g.add(p); }
  // mesas: A (x = -6) y B (x = 6) en z = -3, sillas mirando a la cámara en z = -5.6
  const tables = []; for (const [x, z] of [[-6, -3], [6, -3], [-6, 7], [6, 7]]) { const t = new THREE.Group(); t.position.set(x, 0, z); g.add(t); box(5.4, .3, 3.6, mat(0xf4f4f4, { roughness: .3 }), .1, t, 0, 3.3, 0); box(5.5, .15, 3.7, mat(0xd83a3a), .05, t, 0, 3.1, 0); cyl(.25, .4, 3.1, mat(0xc0c0c8, { metalness: .8 }), 10, t, 0, 1.55, 0);
    cyl(.18, .18, .6, mat(0xd83a3a), 10, t, 1.8, 3.75, -.8); cyl(.14, .14, .7, mat(0xf2c23a), 10, t, 2.2, 3.8, -.8); box(.9, .5, .3, mat(0x1a1a1a), .05, t, -2, 3.7, -1.2);
    for (const s of [-1]) { const c = new THREE.Group(); c.position.set(0, 0, s * 2.6); t.add(c); box(3, .4, 2, mat(0xd83a3a, { roughness: .5 }), .15, c, 0, 1.8, 0); box(3, 3.4, .5, mat(0xd83a3a, { roughness: .5 }), .15, c, 0, 3.4, s * 1.1); for (const sx of [-1.2, 1.2]) cyl(.1, .1, 1.6, mat(0xc0c0c8, { metalness: .8 }), 6, c, sx, .8, 0); } tables.push(t); }
  return { g: shade(g), F, door: dG, tables, sign };
}
// ---------- Bad (X) ----------
export function bad(scene, X) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g);
  room(g, 18, 16, 12, mat(0xffffff, { map: rep(tiles('#bfe6ea', '#9cc8d0'), 6, 4) }), mat(0xffffff, { map: rep(tiles('#e8e8f0', '#b8b8c8'), 6, 6) }), mat(0xf4f4f8), ['front']);
  const cab = new THREE.Group(); cab.position.set(0, 0, -6.6); g.add(cab); box(7, 3.6, 2.6, mat(0xf4f4f4), .1, cab, 0, 1.8, 0); box(7.2, .3, 2.8, mat(0x5a6a7a, { roughness: .2 }), .05, cab, 0, 3.75, 0);
  const basin = cyl(1.2, 1, .5, mat(0xffffff, { roughness: .1 }), 20, cab, 0, 3.9, .2); cyl(.12, .12, 1, mat(0xc8c8d0, { metalness: .9, roughness: .15 }), 8, cab, 0, 4.4, -.9); const sp = cyl(.08, .08, .8, mat(0xc8c8d0, { metalness: .9, roughness: .15 }), 8, cab, 0, 4.85, -.55); sp.rotation.x = Math.PI / 2;
  const mir = box(5.4, 4.6, .15, mat(0xd8eef4, { metalness: .9, roughness: .05 }), .05, g, 0, 7.6, -7.7); box(5.8, 5, .1, mat(0xf4f4f4), .05, g, 0, 7.6, -7.78);
  box(4, .3, .5, glow(0xfff4e0, 2), .1, g, 0, 10.3, -7.5); const ll = new THREE.PointLight(0xfff0e0, 50, 30, 1.3); ll.position.set(0, 10, -5); g.add(ll);
  const cup = cyl(.35, .3, .8, mat(0x7ab8e8), 12, cab, 2.6, 4.3, -.4); for (const [c, dx] of [[0xd8323a, -.1], [0x4cb64a, .12]]) { const b = cyl(.05, .05, 1.2, mat(c), 6, cab, 2.6 + dx, 4.9, -.4); b.rotation.z = dx; }
  const tub = new THREE.Group(); tub.position.set(-6, 0, 0); g.add(tub); box(5, 2.6, 10, mat(0xffffff, { roughness: .15 }), .5, tub, 0, 1.3, 0); box(4, .2, 9, mat(0x9ad0f0, { roughness: .05, transparent: true, opacity: .8 }), .05, tub, 0, 2.3, 0);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.6, .08, 8, 20), mat(0xc8c8d0, { metalness: .9 })); ring.position.set(6, 6, -7.7); g.add(ring); box(1.2, 2.4, .25, mat(0xff8ab0, { roughness: 1 }), .1, g, 6, 4.8, -7.5);
  for (let k = 0; k < 3; k++) sphere(.4, mat([0xf2c23a, 0xffffff, 0xff8ab0][k]), g, 7.5, .4 + k * .5, -6, 10, 8);
  const brush = new THREE.Group(); scene.add(brush); cyl(.06, .05, 1.4, mat(0x2a8ad8), 6, brush, 0, 0, 0).rotation.x = Math.PI / 2; box(.16, .22, .4, mat(0xffffff), .04, brush, 0, .12, .6); sphere(.16, mat(0xffffff, { roughness: 1 }), brush, .1, .1, .55, 6, 4);
  return { g: shade(g), brush };
}
// ---------- Nacht (X): fachada de la casa del narrador con ventana real (x 0, y 8–12), calle con farola y buzón ----------
export function nacht(scene, X) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), mat(0xffffff, { map: rep(noiseTex('#4f9a3c', ['#3f8a30', '#5faa48'], 2000, 2, 1), 30, 30), roughness: 1 })); gr.rotation.x = -Math.PI / 2; gr.position.z = 30; g.add(gr);
  box(260, .3, 3.4, mat(0xc8c4bc), .04, g, 0, .15, 21.5); box(260, .3, 3.4, mat(0xc8c4bc), .04, g, 0, .15, 38.5);
  const rd = new THREE.Mesh(new THREE.PlaneGeometry(260, 13.6), mat(0x3a4050, { roughness: .9 })); rd.rotation.x = -Math.PI / 2; rd.position.set(0, .06, 30); g.add(rd); for (let k = -12; k <= 12; k++) box(4, .04, .35, mat(0xf4f4f4), 0, g, k * 10, .09, 30);
  // fachada con agujero de ventana
  const sid = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#e8d8b8'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.1)'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 2); }, true); sid.repeat.set(6, 4);
  const wl = mat(0xffffff, { map: sid, roughness: .8 }), trim = mat(0xffffff, { roughness: .6 });
  box(28, 7.5, 1, wl, 0, g, 0, 3.75, 0); box(28, 7, 1, wl, 0, g, 0, 15.5, 0); box(12.5, 4.5, 1, wl, 0, g, -8.25, 9.75, 0); box(12.5, 4.5, 1, wl, 0, g, 8.25, 9.75, 0);
  for (const [w, h, x, y] of [[4.6, .4, 0, 7.4], [4.6, .4, 0, 12.1], [.4, 4.8, -2.2, 9.75], [.4, 4.8, 2.2, 9.75], [3.6, .15, 0, 9.75], [.15, 4, 0, 9.75]]) box(w, h, 1.3, trim, .03, g, x, y, .1);
  box(5.4, .3, 1.4, trim, .04, g, 0, 7.2, .5); for (const s of [-1, 1]) box(1.1, 4.8, .2, mat(0x2f6a9a), .03, g, s * 2.95, 9.75, .6);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(.01, 20, 9, 4, 1, false, Math.PI / 4), mat(0xb8423a, { roughness: .7 })); roof.scale.set(1, 1, .55); roof.position.set(0, 23.5, -8); g.add(roof);
  for (const x of [-9, 9]) { box(3.4, 3.6, .2, glass(), .03, g, x, 3.8, .6); }
  const doorH = box(3.2, 6.4, .3, mat(0x2a4a8a), .05, g, 0, 3.2, .6); const pl = sphere(.4, glow(0xffd890, 1.5), g, 2.6, 6.2, .9, 10, 8);
  // habitación detrás de la ventana (suelo en y = 5)
  const R = new THREE.Group(); g.add(R); const rf = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), mat(0xffffff, { map: rep(plankT('#a8784a', '#98683a'), 2, 2) })); rf.rotation.x = -Math.PI / 2; rf.position.set(0, 5, -4.5); R.add(rf);
  box(14, 13, .4, mat(0xffffff, { map: rep(stripes('#7a9ad8', '#6a8ac8', 10), 2, 1) }), 0, R, 0, 11, -9); for (const s of [-1, 1]) box(.4, 13, 9, mat(0x7a9ad8), 0, R, s * 7, 11, -4.5); box(14, .4, 9, mat(0xf4f4f4), 0, R, 0, 17.4, -4.5);
  const poster = textPlane(2.6, 3.4, 130, 170, (c, w, h) => { c.fillStyle = '#1a3a6a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h / 2 - 10, 34, 0, 7); c.fill(); txt(c, 'MOND', w / 2, h - 24, 24, '#fff'); }); poster.position.set(-3.6, 11.5, -8.7); R.add(poster);
  const lampR = new THREE.PointLight(0xffc880, 22, 18, 1.4); lampR.position.set(3, 12, -5); R.add(lampR); const lampB = sphere(.5, glow(0xffd8a0, 1.4), R, 4.5, 8.2, -7.5, 10, 8);
  for (const s of [-1, 1]) box(1.4, 5, .2, mat(0xd84a5a, { roughness: 1 }), .05, R, s * 3.1, 9.9, -.7);
  // fuera: farola y buzón al otro lado de la calle (bajo la luz)
  const LP = lantern(g, 3.5, 40); LP.scale.setScalar(1.15); const lampB2 = LP.userData.bulb; const lampL = new THREE.SpotLight(0xffd8a0, 300, 40, .55, .5, 1.3); lampL.position.set(3.5, 12.5, 40); lampL.target.position.set(3.5, 0, 40); lampL.castShadow = true; lampL.shadow.mapSize.set(1024, 1024); g.add(lampL, lampL.target);
  const MB = new THREE.Group(); MB.position.set(1.6, 0, 39.6); g.add(MB); const mbm = mat(0x1d2a4a, { roughness: .45 });
  cyl(.28, .32, 4.6, mat(0x2a2420, { roughness: .8 }), 8, MB, 0, 2.3, 0); box(1.7, 1.7, 2.4, mbm, .3, MB, 0, 5.4, 0); const top = new THREE.Mesh(new THREE.CylinderGeometry(.85, .85, 2.4, 16), mbm); top.rotation.x = Math.PI / 2; top.position.y = 6.25; MB.add(top);
  box(.12, 1.2, .3, mat(0xd8323a), .03, MB, .92, 6.1, .6); const nm = sg(1.4, .45, 'NR. 12', '#f4f4f4', '#1d2a4a', 20, .1); nm.position.set(0, 5.2, -1.22); nm.rotation.y = Math.PI; MB.add(nm); MB.rotation.y = Math.PI;
  // casas de enfrente
  for (let k = -2; k <= 2; k++) { const h = house(g, k * 24, 58, k + 6, Math.PI); for (const wx of [-5, 5]) for (const wy of [3.8, 7.6]) { if (wx < 0 && wy < 5) continue; const p = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.2), glow(0xffc870, 1.1)); p.position.set(wx, wy, 6.75); h.g.add(p); } }
  for (const x of [-22, 18, 30]) tree(g, x, 14, .9); for (const x of [-30, -12, 22]) tree(g, x, 46, 1);
  // valla del jardín
  for (let k = -12; k <= 12; k++) box(.3, 1.6, .2, trim, .05, g, k * 1.1, .8, 19.5); box(28, .2, .15, trim, .02, g, 0, 1.2, 19.5);
  return { g: shade(g), MB, mbm, LP, lampL, lampR, lampB, lampB2, R, doorH };
}
// ---------- Supermarkt (dentro del grupo de la Vorstadt, en z0) ----------
export function supermarkt(parent, z0) {
  const g = new THREE.Group(); g.position.set(0, 0, z0); parent.add(g);
  const lot = new THREE.Mesh(new THREE.PlaneGeometry(70, 30), mat(0x5a606a, { roughness: .9 })); lot.rotation.x = -Math.PI / 2; lot.position.set(0, .07, 2); g.add(lot); for (let k = -6; k <= 6; k++) box(.3, .04, 6, mat(0xf4f4f4), 0, g, k * 4.6, .1, 6);
  box(54, 15, 22, mat(0xf4f4f4, { roughness: .6 }), .1, g, 0, 7.5, -24); box(55, 2.2, 23, mat(0xd8323a), .1, g, 0, 15.6, -24);
  for (let k = -5; k <= 5; k++) if (k !== 0) box(4.4, 9, .2, mat(0xbfe0f4, { transparent: true, opacity: .55, roughness: .05, metalness: .3, emissive: 0x5a7a8a, emissiveIntensity: .3 }), .02, g, k * 4.8, 4.8, -12.9);
  box(6, 9, .3, mat(0xbfe0f4, { transparent: true, opacity: .5, emissive: 0xffe8c0, emissiveIntensity: .4 }), .05, g, 0, 4.5, -12.8);
  const s = sg(30, 3.6, 'SUPERMARKT', '#d8323a', '#ffffff', 110, .8); s.position.set(0, 12.2, -12.75); g.add(s);
  const o = sg(7, 1.4, 'FRISCH & GÜNSTIG', '#ffd23f', '#1d2238', 42, .6); o.position.set(-16, 12.2, -12.7); g.add(o);
  for (let k = 0; k < 6; k++) { const c = new THREE.Group(); c.position.set(12 + k * 1.1, 0, -9); g.add(c); box(1.6, 1.4, 2.4, mat(0xc0c8d0, { metalness: .7, roughness: .3, transparent: true, opacity: .8 }), .05, c, 0, 2, 0); for (const [x, z] of [[-.6, -1], [.6, -1], [-.6, 1], [.6, 1]]) sphere(.2, mat(0x1a1a1a), c, x, .2, z, 6, 4); }
  for (let k = 0; k < 4; k++) box(2.4, 2, 2.4, mat(0xb8905a, { roughness: 1 }), .06, g, -22 + (k % 2) * 2.6, 1 + Math.floor(k / 2) * 2, -10);
  return shade(g);
}
// ---------- vehículos y atrezo ----------
function wheel(g, x, y, z, r = .9) { const w = cyl(r, r, .7, mat(0x1a1a1e, { roughness: .7 }), 16, g, x, y, z); w.rotation.z = Math.PI / 2; const h = cyl(r * .5, r * .5, .72, mat(0xc8c8d0, { metalness: .8 }), 12, g, x, y, z); h.rotation.z = Math.PI / 2; return w; }
export function car(scene, col) { const g = new THREE.Group(); scene.add(g); const b = mat(col, { roughness: .25, metalness: .35 });
  box(3.8, 1.5, 7.6, b, .45, g, 0, 1.45, 0); box(3.4, 1.5, 4, b, .5, g, 0, 2.8, -.5); for (const s of [-1, 1]) box(.1, 1.1, 3.4, glass(), .03, g, s * 1.72, 2.85, -.5); box(3.1, 1.2, .1, glass(), .03, g, 0, 2.9, 1.52); box(3.1, 1.2, .1, glass(), .03, g, 0, 2.9, -2.52);
  for (const s of [-1, 1]) { sphere(.32, glow(0xfff8e0, 1.4), g, s * 1.3, 1.6, 3.8, 10, 8); box(.6, .3, .1, glow(0xff2020, 1), .03, g, s * 1.3, 1.6, -3.82); }
  box(3.9, .4, .3, mat(0xc8c8d0, { metalness: .8 }), .1, g, 0, .9, 3.85); box(3.9, .4, .3, mat(0xc8c8d0, { metalness: .8 }), .1, g, 0, .9, -3.85);
  for (const [x, z] of [[-1.7, 2.4], [1.7, 2.4], [-1.7, -2.4], [1.7, -2.4]]) wheel(g, x, .8, z, .8); return shade(g); }
export function truck(scene, text = 'FRISCH-MARKT') { const g = new THREE.Group(); scene.add(g); const cab = mat(0x2a6ad8, { roughness: .3, metalness: .3 });
  box(5, 5.2, 4.4, cab, .4, g, 0, 3.6, 7.6); box(4.6, 2.2, .1, glass(), .03, g, 0, 4.6, 9.82); for (const s of [-1, 1]) box(.1, 1.8, 2, glass(), .03, g, s * 2.52, 4.6, 8);
  box(4.8, 1.4, .2, mat(0x1a1a1e), .05, g, 0, 2.1, 9.85); for (let k = 0; k < 5; k++) box(.15, 1.2, .05, mat(0xc8c8d0, { metalness: .8 }), 0, g, -1.6 + k * .8, 2.1, 9.97);
  const hl = []; for (const s of [-1, 1]) hl.push(sphere(.45, glow(0xfff8e0, 2), g, s * 1.9, 2.3, 9.9, 12, 8)); box(5.2, .6, .5, mat(0xc8c8d0, { metalness: .8 }), .1, g, 0, 1.1, 9.9);
  box(5.2, 7, 13, mat(0xf4f4f4, { roughness: .5 }), .2, g, 0, 4.8, -1.5); for (const s of [-1, 1]) { const l = sg(10, 2.4, text, '#2a6ad8', '#ffffff', 72, .3); l.position.set(s * 2.62, 5.4, -1.5); l.rotation.y = s * Math.PI / 2; g.add(l); }
  box(5.4, .6, 20, mat(0x2a2a2e), .05, g, 0, 1.1, 1.5); for (const z of [7.6, -3, -6]) for (const s of [-1, 1]) wheel(g, s * 2.4, 1.1, z, 1.1);
  return { g: shade(g), hl }; }
export function ampel(scene) { const g = new THREE.Group(); scene.add(g); const k = mat(0x2a2a2e, { metalness: .5, roughness: .4 }); cyl(.2, .25, 9, k, 8, g, 0, 4.5, 0); box(1.4, 3.8, 1, k, .2, g, 0, 10.5, 0);
  const L = [0xff2020, 0xffb020, 0x20e040].map((c, i) => { const m = glow(c, 0); sphere(.42, m, g, 0, 11.7 - i * 1.2, .45, 12, 8); box(1, .15, .6, k, .05, g, 0, 12.2 - i * 1.2, .7); return m; });
  const set = (i) => L.forEach((m, j) => { m.emissiveIntensity = j === i ? 3 : .05; m.color.setHex(j === i ? [0xff2020, 0xffb020, 0x20e040][j] : 0x333333); }); set(0); return { g: shade(g), set }; }
export function van(scene) { const g = new THREE.Group(); scene.add(g); const b = mat(0xf4f4f4, { roughness: .3 });
  box(4.4, 4.6, 10, b, .4, g, 0, 3.2, 0); box(4.5, 1.2, 10.1, mat(0x2a6ad8), .1, g, 0, 2.4, 0); box(3.8, 1.8, .1, glass(), .03, g, 0, 4.4, 5.02);
  for (const s of [-1, 1]) { const l = sg(7, 1.4, 'STADTWERKE', '#2a6ad8', '#ffffff', 50, .4); l.position.set(s * 2.27, 4, -.5); l.rotation.y = s * Math.PI / 2; g.add(l); }
  const beacon = sphere(.4, glow(0xff9a20, 2.5), g, 0, 5.7, 3, 10, 8); for (const [x, z] of [[-2, 3.2], [2, 3.2], [-2, -3.2], [2, -3.2]]) wheel(g, x, .9, z, .9); for (const s of [-1, 1]) sphere(.3, glow(0xfff8e0, 2), g, s * 1.6, 2, 5.05, 8, 6);
  return { g: shade(g), beacon }; }
export function stromkasten(scene) { const g = new THREE.Group(); scene.add(g); box(3, 5, 1.6, mat(0x8a929a, { metalness: .4, roughness: .5 }), .1, g, 0, 2.5, 0);
  const z = textPlane(1.2, 1.2, 120, 120, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(w / 2, 6); c.lineTo(w - 6, h - 6); c.lineTo(6, h - 6); c.closePath(); c.fill(); c.fillStyle = '#1a1a1a'; c.beginPath(); c.moveTo(66, 30); c.lineTo(44, 74); c.lineTo(60, 74); c.lineTo(52, 104); c.lineTo(80, 60); c.lineTo(64, 60); c.closePath(); c.fill(); });
  z.position.set(0, 3.4, .82); g.add(z); const led = sphere(.15, glow(0xff2020, 2), g, 1, 4.4, .82, 8, 6); return { g: shade(g), led }; }
export function burger(scene) { const g = new THREE.Group(); scene.add(g); const bun = mat(0xd8902e, { roughness: .6 });
  const top = new THREE.Mesh(new THREE.SphereGeometry(.8, 18, 10, 0, 6.283, 0, Math.PI / 2), bun); top.position.y = .62; top.scale.y = .8; g.add(top); for (let k = 0; k < 8; k++) sphere(.05, mat(0xfff4d0), g, Math.sin(k * 2.3) * .5, 1.15 - (k % 2) * .08, Math.cos(k * 2.3) * .5, 4, 3);
  cyl(.85, .85, .14, mat(0x4cb64a, { roughness: .9 }), 18, g, 0, .5, 0); box(1.6, .08, 1.6, mat(0xffc020), .02, g, 0, .43, 0).rotation.y = .5; cyl(.8, .8, .26, mat(0x5a2a14, { roughness: .9 }), 18, g, 0, .3, 0); cyl(.8, .75, .26, bun, 18, g, 0, .08, 0);
  const plate = cyl(1.4, 1.3, .1, mat(0xffffff, { roughness: .2 }), 24, g, 0, -.1, 0); g.userData.plate = plate; return shade(g); }
export function fries(scene) { const g = new THREE.Group(); scene.add(g); box(1, 1.1, .7, mat(0xd8323a, { roughness: .5 }), .06, g, 0, .55, 0); for (let k = 0; k < 14; k++) { const f = box(.11, .9, .11, mat(0xf2c23a, { roughness: .7 }), .02, g, -.35 + (k % 7) * .12, 1.2 + (k % 3) * .08, -.15 + Math.floor(k / 7) * .25); f.rotation.z = (k % 5 - 2) * .1; } return shade(g); }
export function phoneOrNote(scene) { const g = new THREE.Group(); scene.add(g); box(.9, 1.2, .08, mat(0xffffff), .02, g, 0, 0, 0); for (let k = 0; k < 4; k++) box(.6, .05, .02, mat(0x2a2a8a), 0, g, 0, .35 - k * .2, .05); return g; }
export function coins(scene, n = 3) { const g = new THREE.Group(); scene.add(g); for (let k = 0; k < n; k++) { const c = cyl(.3, .3, .07, mat(0xe9c23a, { metalness: .9, roughness: .2 }), 16, g, k * .3, k * .08, 0); } return g; }
export function thermo(scene) { const g = new THREE.Group(); scene.add(g); box(1.6, 4, .3, mat(0xf4f4f4), .2, g, 0, 0, 0); const t = textPlane(1.4, 1, 140, 100, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, '3 °C', w / 2, h / 2, 54, '#2a6ad8'); }); t.position.set(0, 1.2, .17); g.add(t); cyl(.12, .12, 2, mat(0xd8323a), 8, g, 0, -.6, .2); sphere(.3, mat(0xd8323a), g, 0, -1.6, .2, 8, 6); return shade(g); }
