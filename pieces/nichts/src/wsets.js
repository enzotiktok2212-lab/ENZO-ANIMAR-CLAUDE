// Wörter — interiores y estación: Callcenter, Wohnung (cocina + salón), Kinderzimmer, Bahnhof; atrezo (frasco, notas, teléfono).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree } from './props.js';
import { glass, label, loaf } from './diam.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const plankT = (a, b) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(a.length); for (let y = 0; y < h; y += 16) { c.fillStyle = r() > .5 ? b : a; c.fillRect(0, y, w, 15); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y + 15, w, 1); } }, true);
const paper = (a, b) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let x = 0; x < w; x += 32) for (let y = 0; y < h; y += 32) { c.beginPath(); c.arc(x + 16, y + 16, 5, 0, 7); c.fill(); } }, true);
const tiles = (a, b) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }, true);
function room(scene, X, w, d, h, wallM, floorM, ceil) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorM); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(w, h, .6, wallM, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.6, h, d, wallM, 0, g, s * w / 2, h / 2, 0); box(w, h, .6, wallM, 0, g, 0, h / 2, d / 2); if (ceil) box(w, .6, d, ceil, 0, g, 0, h, 0);
  box(w, .8, .7, mat(0xf4f4f4), .05, g, 0, .4, -d / 2 + .35); return g; }
const sg = (w, h, t, bg, fg, s = 60) => label(w, h, t, bg, fg, s, .35);

// ---------- Callcenter (X) ----------
export function callcenter(scene, X) {
  const g = room(scene, X, 46, 36, 16, mat(0xffffff, { map: rep(stripes('#dfe8f2', '#d2dcea', 12), 6, 1) }), mat(0xffffff, { map: rep(tiles('#8a94a8', '#7a8498'), 10, 8) }), mat(0xf4f4f8));
  const scr = textPlane(18, 6, 720, 240, (c, w, h) => { c.fillStyle = '#10203a'; c.fillRect(0, 0, w, h); txt(c, 'RIESENKUNDE: MEGA AG', w / 2, 70, 52, '#ffd23f'); txt(c, '08:00 – 16:00  ☎ 8 STUNDEN', w / 2, 160, 44, '#7ae0ff'); }, .6); scr.position.set(0, 10, -17.6); g.add(scr);
  const clock = cyl(1.4, 1.4, .2, mat(0xffffff), 32, g, 15, 11, -17.6); clock.rotation.x = Math.PI / 2; const hand1 = box(.12, 1.1, .05, mat(0x1a1a1a), 0, g, 15, 11.45, -17.4); const hand2 = box(.1, .8, .05, mat(0xd8323a), 0, g, 15.3, 11, -17.4); hand2.rotation.z = -1.2;
  const desks = []; for (let r = 0; r < 3; r++) for (let c = -1; c <= 1; c++) { const d = new THREE.Group(); d.position.set(c * 13, 0, -9 + r * 9); g.add(d); box(9, .3, 4, mat(0xe8e0d0), .05, d, 0, 3.3, 0); for (const s of [-1, 1]) box(.3, 3.3, 3.6, mat(0x8a8a92, { metalness: .4 }), .03, d, s * 4.3, 1.65, 0);
    box(9, 2.4, .2, mat(0x5a7ab0, { roughness: .9 }), .05, d, 0, 4.6, -2); for (const s of [-1, 1]) { const mon = new THREE.Group(); mon.position.set(s * 2.2, 3.45, -1); d.add(mon); box(2.6, 1.7, .15, mat(0x1a1a1e), .05, mon, 0, 1.3, 0); box(2.4, 1.5, .02, new THREE.MeshBasicMaterial({ color: [0x3ac8ff, 0x7ae09a, 0xffd25a][(r + c + 3 + s) % 3], toneMapped: false }), .02, mon, 0, 1.3, .09); box(.2, .6, .2, mat(0x1a1a1e), 0, mon, 0, .3, 0);
      box(1.6, .1, .6, mat(0x2a2a2e), .02, d, s * 2.2, 3.5, .6); const cup = cyl(.22, .2, .5, mat([0xd8323a, 0xffffff, 0x2a6ad8][(r + c + 4) % 3]), 12, d, s * 3.6, 3.7, .8); } desks.push(d); }
  for (const [x, z] of [[-21, -15], [21, -15], [-21, 14], [21, 14]]) { const p = new THREE.Group(); p.position.set(x, 0, z); g.add(p); cyl(1, .8, 2, mat(0x8a5a3a), 12, p, 0, 1, 0); for (let k = 0; k < 6; k++) sphere(1.2, mat(0x2f8a3e, { roughness: 1 }), p, Math.sin(k) * .8, 3 + (k % 3) * .7, Math.cos(k) * .8, 10, 8); }
  for (let i = -2; i <= 2; i++) { const l = box(5, .2, 1.2, mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: .8 }), .05, g, i * 9, 15.6, 0); }
  const lt = new THREE.PointLight(0xf4f8ff, 60, 60, 1.2); lt.position.set(0, 13, 0); g.add(lt);
  return shade(g);
}
// ---------- Wohnung: cocina (izq.) y salón (der.) (X) ----------
export function wohnung(scene, X) {
  const g = room(scene, X, 40, 28, 15, mat(0xffffff, { map: rep(paper('#f2e2c4', '#e2cca8'), 8, 3) }), mat(0xffffff, { map: rep(plankT('#a8784a', '#98683a'), 6, 6) }), mat(0xfaf4ea));
  // cocina
  for (let k = 0; k < 4; k++) { box(4, 4, 3, mat(0xffffff, { roughness: .5 }), .1, g, -17 + k * 4.1, 2, -12.2); box(4, .3, 3.2, mat(0x5a5a62), .05, g, -17 + k * 4.1, 4.15, -12.1); box(.8, .2, .1, mat(0xc0c0c8, { metalness: .8 }), .02, g, -17 + k * 4.1, 3.4, -10.6); }
  for (let k = 0; k < 3; k++) box(4, 3, 2, mat(0xffffff, { roughness: .5 }), .1, g, -15 + k * 4.1, 10.5, -12.8);
  const fridge = box(4, 9, 3.4, mat(0xe8f0f4, { roughness: .3 }), .3, g, 0, 4.5, -12); box(.2, 3, .2, mat(0xc0c0c8, { metalness: .8 }), .05, g, -1.5, 6, -10.2);
  const notes = []; for (let k = 0; k < 5; k++) { const n = textPlane(1.1, 1.1, 110, 110, (c, w, h) => { c.fillStyle = ['#ffe36a', '#ffb8d0', '#a8e8ff', '#c8f0a8', '#ffd8a0'][k]; c.fillRect(0, 0, w, h); c.fillStyle = '#3a2a1a'; for (let y = 22; y < h - 10; y += 16) c.fillRect(10, y, w - 20 - (y % 3) * 8, 4); c.fillStyle = '#d8323a'; c.beginPath(); c.arc(w - 18, h - 18, 8, 0, 7); c.fill(); }); n.position.set(-1.2 + (k % 3) * 1.2, 6.2 + Math.floor(k / 3) * 1.3, -10.25); n.rotation.z = (k - 2) * .08; g.add(n); notes.push(n); }
  const tbl = new THREE.Group(); tbl.position.set(-8, 0, -1); g.add(tbl); box(8, .4, 5, mat(0x8a5a32), .05, tbl, 0, 3.4, 0); for (const [x, z] of [[-3.6, -2.2], [3.6, -2.2], [-3.6, 2.2], [3.6, 2.2]]) box(.35, 3.4, .35, mat(0x6a4426), .05, tbl, x, 1.7, z);
  for (const x of [-2, 2]) { cyl(.8, .8, .06, mat(0xffffff), 20, tbl, x, 3.64, 0); cyl(.3, .26, .6, mat([0xd8323a, 0x2a6ad8][x > 0 ? 1 : 0]), 14, tbl, x + 1.1, 3.9, -.6); } box(1.2, .35, .9, mat(0xd8a050), .1, tbl, -2, 3.85, 0);
  const win = box(6, 5, .2, mat(0xbfe8ff, { emissive: 0x9ad0f4, emissiveIntensity: .6 }), .05, g, -10, 9, -13.6);
  // salón
  const sofa = new THREE.Group(); sofa.position.set(11, 0, -8); g.add(sofa); const sm = mat(0x3a6a8a, { roughness: .9 }); box(10, 1.6, 3.8, sm, .3, sofa, 0, 1.4, 0); box(10, 3, 1, sm, .3, sofa, 0, 2.6, -1.4); for (const s of [-1, 1]) box(1, 2.4, 3.8, sm, .3, sofa, s * 5, 1.8, 0); for (const x of [-3, 0, 3]) box(2.2, 1.4, .6, mat([0xf2c23a, 0xd8323a, 0xf4f4f4][(x + 3) / 3]), .3, sofa, x, 2.8, -.7);
  const lampS = cyl(.15, .15, 7, mat(0x2a2a2e), 8, g, 18, 3.5, -10); const lampH = cyl(.9, 1.5, 1.8, mat(0xf4e2c0, { emissive: 0xffc870, emissiveIntensity: .5 }), 16, g, 18, 7.8, -10);
  for (const [x, c] of [[8, '#7ab8e8'], [14, '#e8a07a']]) { const p = textPlane(3.4, 2.6, 170, 130, (cx, w, h) => { cx.fillStyle = '#4a2e18'; cx.fillRect(0, 0, w, h); cx.fillStyle = c; cx.fillRect(10, 10, w - 20, h - 20); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(w * .35, h * .5, 16, 0, 7); cx.arc(w * .62, h * .5, 20, 0, 7); cx.fill(); }); p.position.set(x, 8.5, -13.6); g.add(p); }
  const door = box(4, 8.4, .3, mat(0x7a4c28), .05, g, 17, 4.2, 13.6); sphere(.2, mat(0xc89a3a, { metalness: .8 }), g, 15.6, 4.2, 13.3);
  const wl = new THREE.PointLight(0xffd8a0, 40, 50, 1.3); wl.position.set(0, 12, 0); g.add(wl);
  return { g: shade(g), notes, tbl, light: wl, lamp: lampH };
}
// ---------- Kinderzimmer (X) ----------
export function kinderzimmer(scene, X) {
  const g = room(scene, X, 26, 22, 14, mat(0xffffff, { map: rep(stripes('#a8d0f0', '#98c4ea', 10), 5, 1) }), mat(0xffffff, { map: rep(plankT('#b88a5a', '#a87a4a'), 5, 5) }), mat(0xfaf4ea));
  const bed = new THREE.Group(); bed.position.set(-4, 0, -5); g.add(bed); box(6, 1.6, 10, mat(0x8a5a32), .1, bed, 0, .8, 0); box(5.6, 1, 9.6, mat(0xffffff), .2, bed, 0, 2.1, 0); box(6.2, 4, .5, mat(0x8a5a32), .1, bed, 0, 2.6, -5);
  const blanket = box(5.8, .5, 6.4, mat(0xffffff, { map: rep(stripes('#f2c23a', '#e8a828', 6), 2, 1) }), .2, bed, 0, 2.7, 1.4); const pillow = box(4, .8, 2, mat(0xf4f4f4), .4, bed, 0, 2.9, -3.4);
  const nl = new THREE.Group(); nl.position.set(1.5, 0, -8); g.add(nl); box(2, 2.6, 2, mat(0xf4e2c0), .1, nl, 0, 1.3, 0); const bulb = sphere(.6, mat(0xfff0c0, { emissive: 0xffc870, emissiveIntensity: 1.6 }), nl, 0, 3.4, 0, 16, 12); const nlL = new THREE.PointLight(0xffb860, 26, 22, 1.4); nlL.position.set(1.5, 4, -7); g.add(nlL);
  const win = box(5, 5, .2, mat(0x1a2a5a, { emissive: 0x2a3a7a, emissiveIntensity: .8 }), .05, g, 6, 8, -10.6); const moon = sphere(.7, new THREE.MeshBasicMaterial({ color: 0xfff4d0, toneMapped: false }), g, 7, 9, -10.7, 16, 12);
  for (let k = 0; k < 9; k++) { const s = sphere(.12, new THREE.MeshBasicMaterial({ color: 0xfff6a0, toneMapped: false }), g, -10 + (k % 5) * 3.6, 11 + (k % 3), -10.6, 6, 4); }
  const poster = textPlane(4, 3, 200, 150, (c, w, h) => { c.fillStyle = '#1a3a6a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h / 2, 40, 0, 7); c.fill(); txt(c, 'RAKETE', w / 2, h - 22, 26, '#fff'); }); poster.position.set(-12.6, 8, -2); poster.rotation.y = Math.PI / 2; g.add(poster);
  return { g: shade(g), bed, blanket };
}
// ---------- Bahnhof (X) ----------
export function bahnhof(scene, X) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g); const gr = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), mat(0xffffff, { map: noiseTex('#7a8a6a', ['#6a7a5a', '#8a9a7a'], 1200, 2, 30) })); gr.rotation.x = -Math.PI / 2; g.add(gr);
  box(80, 2, 12, mat(0xffffff, { map: rep(tiles('#c8c0b4', '#a8a094'), 20, 3) }), .05, g, 0, 1, 0); box(80, .3, .6, mat(0xf2c23a), .02, g, 0, 2.05, 5.4);
  for (const z of [10, 14]) { box(80, .4, .5, mat(0x6a6a72, { metalness: .8 }), .02, g, 0, .3, z); } for (let x = -40; x <= 40; x += 2) box(.8, .2, 6, mat(0x5a3a22), .02, g, x, .1, 12);
  for (let x = -30; x <= 30; x += 15) { cyl(.35, .35, 12, mat(0x2a4a7a, { metalness: .5 }), 10, g, x, 8, -3); } box(76, .6, 14, mat(0x2a4a7a, { metalness: .4 }), .1, g, 0, 14.2, 1);
  const s = sg(12, 2, 'HAUPTBAHNHOF', '#1a3a6a', '#ffffff', 70); s.position.set(0, 12, -2.6); g.add(s); const clk = cyl(1.5, 1.5, .3, mat(0xffffff), 28, g, 16, 11, -2.6); clk.rotation.x = Math.PI / 2; box(.12, 1.2, .05, mat(0x1a1a1a), 0, g, 16, 11.4, -2.4);
  // tren detrás
  const tr = new THREE.Group(); tr.position.set(0, 0, 13); g.add(tr); for (let k = 0; k < 3; k++) { const c = new THREE.Group(); c.position.x = -26 + k * 26; tr.add(c); box(25, 9, 6, mat(0xd8323a, { roughness: .4, metalness: .2 }), .5, c, 0, 5.6, 0); box(25.1, 1, 6.1, mat(0xf4f4f4), .2, c, 0, 3, 0); for (let w = -10; w <= 10; w += 4) box(2.6, 2.4, .1, glass(), .05, c, w, 6.6, -3.05); }
  // kiosco de frascos
  const K = new THREE.Group(); K.position.set(-12, 2, -3); g.add(K); box(10, 3.6, 4, mat(0x7a4c28), .1, K, 0, 1.8, 0); box(10.4, .3, 4.4, mat(0x5a3a1e), .05, K, 0, 3.75, 0); const roof = new THREE.Mesh(new THREE.BoxGeometry(11, .3, 5), mat(0xffffff, { map: stripes('#2a8a5a', '#f4ead2', 10) })); roof.position.set(0, 8.4, .4); roof.rotation.x = .2; K.add(roof); for (const sx of [-5, 5]) cyl(.15, .15, 4.8, mat(0x3a2a1a), 8, K, sx, 6, 2);
  const jars = []; for (let k = 0; k < 8; k++) { const j = new THREE.Group(); j.position.set(-4 + (k % 4) * 2.6, 4.3 + Math.floor(k / 4) * 1.9 * 0, -.6 + Math.floor(k / 4) * 1.4); K.add(j); cyl(.55, .55, 1.2, mat(0xdff4ff, { transparent: true, opacity: .4, roughness: .02, metalness: .1 }), 16, j, 0, .6, 0); cyl(.58, .58, .25, mat(0xc89a3a, { metalness: .7 }), 16, j, 0, 1.3, 0);
    const lb = textPlane(.9, .4, 90, 40, (c, w, h) => { c.fillStyle = '#f4ead2'; c.fillRect(0, 0, w, h); txt(c, 'WÖRTER', w / 2, h / 2, 18, '#3a2214'); }); lb.position.set(0, .6, .57); j.add(lb); jars.push(j); }
  const ks = sg(8, 1.6, 'WÖRTER – 5 €', '#f4ead2', '#d8323a', 66); ks.position.set(0, 6.4, 2.2); K.add(ks);
  return { g: shade(g), K, jars, train: tr };
}
// ---------- atrezo ----------
export function jar(scene) { const g = new THREE.Group(); scene.add(g); cyl(.55, .55, 1.2, mat(0xdff4ff, { transparent: true, opacity: .45, roughness: .02, metalness: .1 }), 16, g, 0, 0, 0); const lid = cyl(.58, .58, .25, mat(0xc89a3a, { metalness: .7 }), 16, g, 0, .7, 0); g.userData.lid = lid;
  const lb = textPlane(.9, .4, 90, 40, (c, w, h) => { c.fillStyle = '#f4ead2'; c.fillRect(0, 0, w, h); txt(c, 'WÖRTER', w / 2, h / 2, 18, '#3a2214'); }); lb.position.set(0, 0, .57); g.add(lb); return g; }
export function note(scene, text, col = '#ffe36a') { return (() => { const p = textPlane(1.6, 1.6, 200, 200, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); txt(c, text, w / 2, h / 2, 40, '#2a1a10'); }); scene.add(p); p.material.side = THREE.DoubleSide; return p; })(); }
export function phone(scene) { const g = new THREE.Group(); scene.add(g); box(.6, 1.1, .12, mat(0x1a1a22, { metalness: .5, roughness: .3 }), .08, g, 0, 0, 0); box(.52, .95, .02, new THREE.MeshBasicMaterial({ color: 0x3ac8ff, toneMapped: false }), .02, g, 0, 0, .07); return g; }
