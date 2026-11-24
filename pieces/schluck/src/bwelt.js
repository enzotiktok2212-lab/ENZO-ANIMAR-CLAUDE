// SCHLUCK — escenarios propios, muy detallados: el Biergarten de la plaza (castaños, mesas y bancos de cerveza, guirnaldas
// de bombillas, banderines de rombos azules y blancos, caseta de Ausschank con barriles), el Bierzelt del Oktoberfest,
// la oficina abandonada, el estante del Getränkemarkt, la cervecería más antigua del mundo (exterior en la colina y Sudhaus de cobre),
// la villa del lago, el despacho del alcalde, el Biergeld-Ministerium, la sala del tribunal, la cervecería abandonada de noche,
// su sótano con telarañas, mi cuarto, la oficina del banco y la inundación de cerveza.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree, bench } from './props.js';
import { FONT } from './sets.js';
import { pine, mountains, alpHaus } from './nsets.js';
import { villa } from './pech.js';
import { mass, bottle, crate, fass, goldKrug } from './bier.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1.6) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const plane = (w, d, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const grassT = (a = '#4e9a3a') => noiseTex(a, ['#3f8a30', '#5aa846', '#477f32', '#62a84c', '#386f2a', '#6fb055'], 5200, 2, 1);
const plankT = (a = '#a8784a', b = '#8a5a32') => canvasTex(256, 256, (c, w, h) => { const r = RNG(4); for (let y = 0; y < h; y += 32) { c.fillStyle = r() > .5 ? a : b; c.fillRect(0, y, w, 32); c.globalAlpha = .18; for (let k = 0; k < 14; k++) { c.fillStyle = r() > .5 ? '#000' : '#fff'; c.fillRect(r() * w, y + r() * 30, 30 + r() * 80, 1.5); } c.globalAlpha = 1; c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, y, w, 2); } });
const brickT = (hue = 8, sat = 40, l0 = 36) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#b8ae9c'; c.fillRect(0, 0, w, h); const r = RNG(9 + hue); for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { c.fillStyle = `hsl(${hue + r() * 8},${sat + r() * 12}%,${l0 + r() * 12}%)`; c.fillRect(x + 1.5, y + 1.5, 29, 13); } });
const tileT = (a, b, n = 8) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(7); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = `rgba(0,0,0,${r() * .06})`; c.fillRect(i * w / n, j * h / n, w / n, h / n); } c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * w / n, 0); c.lineTo(i * w / n, h); c.moveTo(0, i * h / n); c.lineTo(w, i * h / n); c.stroke(); } });
const wallp = (a, b) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let x = 0; x < w; x += 32) { c.globalAlpha = .5; c.fillRect(x, 0, 12, h); } c.globalAlpha = 1; });
const rauteT = () => canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a7ad8'; for (let y = -1; y < 5; y++) for (let x = -1; x < 5; x++) { if ((x + y) % 2) continue; const cx = x * 32 + (y % 2) * 16, cy = y * 32; c.beginPath(); c.moveTo(cx, cy - 16); c.lineTo(cx + 16, cy); c.lineTo(cx, cy + 16); c.lineTo(cx - 16, cy); c.fill(); } });
function room(parent, X, w, d, h, wall, floor, ceil = 0xf4f0e8) { const g = G(parent, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil, { roughness: .9 }), 0, g, 0, h, 0); box(w, .8, .5, mat(0xffffff, { roughness: .6 }), .05, g, 0, .4, -d / 2 + .3); return g; }
const sign = (text, w, h, bg, fg, border, fs = .6) => textPlane(w, h, Math.round(w * 40), Math.round(h * 40), (c, cw, ch) => { c.fillStyle = bg; c.fillRect(0, 0, cw, ch); if (border) { c.strokeStyle = border; c.lineWidth = ch * .08; c.strokeRect(ch * .06, ch * .06, cw - ch * .12, ch - ch * .12); } let fsz = ch * fs; c.font = `700 ${fsz}px ${FONT}`; while (c.measureText(text).width > cw * .9) { fsz *= .94; c.font = `700 ${fsz}px ${FONT}`; } c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, cw / 2, ch / 2 + fsz * .06); });
export { sign };
// guirnalda de bombillas entre a y b (catenaria)
export function lights(parent, a, b, n = 14, sag = 1.4) { const g = G(parent); const bm = glowM(0xffe2a0, 2.2), wm = mat(0x1a1a1a);
  for (let i = 0; i <= n; i++) { const k = i / n; const p = new THREE.Vector3(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k - 4 * sag * k * (1 - k), a[2] + (b[2] - a[2]) * k); const s = sphere(.2, bm, g, p.x, p.y - .25, p.z, 8, 6); s.castShadow = false; }
  const pts = []; for (let i = 0; i <= 20; i++) { const k = i / 20; pts.push(new THREE.Vector3(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k - 4 * sag * k * (1 - k), a[2] + (b[2] - a[2]) * k)); }
  const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, .04, 4), wm); g.add(t); return g; }
// banderines de rombos (Bavaria) entre a y b
export function rauten(parent, a, b, n = 12, sag = 1) { const g = G(parent); const RT = rauteT(); const m = new THREE.MeshStandardMaterial({ map: RT, side: THREE.DoubleSide, roughness: .8 }); const m2 = new THREE.MeshStandardMaterial({ color: 0x2a7ad8, side: THREE.DoubleSide, roughness: .8 });
  for (let i = 0; i < n; i++) { const k = (i + .5) / n; const x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k - 4 * sag * k * (1 - k), z = a[2] + (b[2] - a[2]) * k; const s = new THREE.Shape(); s.moveTo(-.55, 0); s.lineTo(.55, 0); s.lineTo(0, -1.2); const f = new THREE.Mesh(new THREE.ShapeGeometry(s), i % 2 ? m2 : m); f.position.set(x, y, z); f.rotation.y = Math.atan2(b[0] - a[0], b[2] - a[2]) - Math.PI / 2; g.add(f); } return g; }
// mesa y bancos de cerveza (Bierzeltgarnitur): mesa 12 × 2,6 a 4,0; bancos a 2,6 de alto
export function garnitur(parent, x, z, ry = 0, len = 12) { const g = G(parent, x, 0, z); g.rotation.y = ry; const wd = mat(0xffffff, { map: rep(plankT('#c8925a', '#b07a44'), 2, 1), roughness: .7 }), leg = mat(0x2a2e34, { metalness: .6, roughness: .4 });
  box(len, .3, 2.6, wd, .06, g, 0, 4.0, 0); for (const s of [-1, 1]) { box(.2, 3.9, 2.0, leg, .04, g, s * (len / 2 - 1.2), 1.95, 0); box(len, .26, 1.1, wd, .05, g, 0, 2.6, s * 2.3); box(.2, 2.5, .9, leg, .04, g, -len / 2 + 1.2, 1.25, s * 2.3); box(.2, 2.5, .9, leg, .04, g, len / 2 - 1.2, 1.25, s * 2.3); } return g; }
// castaño de Biergarten: tronco grueso y copa ancha de muchas bolas
export function kastanie(parent, x, z, s = 1) { const g = G(parent, x, 0, z); g.scale.setScalar(s); cyl(.9, 1.2, 12, mat(0xffffff, { map: noiseTex('#5a4232', ['#4a3424', '#6a5040'], 700, 2, 1), roughness: .95 }), 10, g, 0, 6, 0);
  const lm = [mat(0x2f7a30, { roughness: .9 }), mat(0x3a8a38, { roughness: .9 }), mat(0x27682a, { roughness: .9 })]; const r = RNG(Math.round(x * 7 + z)); for (let i = 0; i < 16; i++) { const a = r() * 6.283, d = r() * 6; sphere(3 + r() * 2, lm[i % 3], g, Math.cos(a) * d, 14 + r() * 4, Math.sin(a) * d, 12, 8); }
  for (let i = 0; i < 8; i++) { const a = r() * 6.283; const f = new THREE.Mesh(new THREE.ConeGeometry(.3, .9, 6), mat(0xfff4f0)); f.position.set(Math.cos(a) * 6.5, 14 + r() * 3, Math.sin(a) * 6.5); g.add(f); } return g; }

// ---------- Biergarten (se coloca en la plaza): 3 × 2 garnituras, 6 castaños, guirnaldas, banderines, Ausschank con barriles ----------
export function biergarten(parent, x = 0, z = 0) { const g = G(parent, x, 0, z); const gr = rep(noiseTex('#d8c8a0', ['#c8b890', '#e4d6b2', '#bca880'], 4000, 2, 1), 10, 10); plane(70, 60, mat(0xffffff, { map: gr, roughness: 1 }), g, 0, .05, 0);
  const T = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) T.push(garnitur(g, -14 + c * 28, -20 + r * 13, 0));
  const K = [[-30, -26], [30, -26], [-33, 12], [33, 12]].map(([a, b]) => kastanie(g, a, b, 1.05));
  for (const [a, b] of [[[-28, 18, -26], [0, 18, -27]], [[0, 18, -27], [28, 18, -26]], [[-33, 18, 12], [-28, 18, -26]], [[33, 18, 12], [28, 18, -26]]]) lights(g, a, b, 16, 1.2);
  for (const [a, b] of [[[-33, 15, 12], [-30, 15, -26]], [[33, 15, 12], [30, 15, -26]]]) rauten(g, a, b, 16, .8);
  // Ausschank (caseta con barra, barriles y cartel)
  const A = G(g, 0, 0, -34); const wd = mat(0xffffff, { map: rep(plankT('#8a5a32', '#6a4224'), 3, 2), roughness: .8 }); box(22, 10, 7, wd, .1, A, 0, 5, -2); box(24, .8, 9, mat(0x8a2a2a), .1, A, 0, 10.4, -2); box(20, 4.2, 1.2, wd, .08, A, 0, 2.1, 2.2); box(21, .4, 1.8, mat(0x5a3a22), .05, A, 0, 4.4, 2.2);
  const s = sign('AUSSCHANK', 16, 2.4, '#1a3a8a', '#ffffff', '#ffd23f', .62); s.position.set(0, 12.8, 2.6); A.add(s);
  for (let k = 0; k < 3; k++) { const f = fass(A, { s: .8 }); f.position.set(-7 + k * 7, 4.6, -.2); f.rotation.z = Math.PI / 2; } for (let k = 0; k < 5; k++) { const m = mass(A); m.position.set(-6 + k * 3, 4.6, 2.4); }
  for (let k = 0; k < 3; k++) { const c = crate(A, k % 2 ? 'PAULANER' : 'WEIHENSTEPHANER'); c.position.set(-13 + (k % 2) * 4, 0, 3 + k * 1.6); c.rotation.y = .2 * k; }
  return { g: shade(g), T, A }; }

// ---------- Bierzelt (X): carpa del Oktoberfest por dentro: techo de tela a rayas blancas y azules, guirnaldas verdes con lazos,
// filas de mesas, escenario de la banda con bombo, galería, ventanas con luz. Centro (0,0), escenario en z = -40 ----------
export function bierzelt(scene, X) { const g = G(scene, X); const fl = mat(0xffffff, { map: rep(plankT('#b07a44', '#9a6a3a'), 8, 10), roughness: .8 }); box(90, .4, 110, fl, 0, g, 0, -.2, 0);
  const strip = rep(stripes('#ffffff', '#3a7ad8', 2, true), 30, 1); const cm = new THREE.MeshStandardMaterial({ map: strip, side: THREE.DoubleSide, roughness: .9 });
  for (const s of [-1, 1]) { const geo = new THREE.PlaneGeometry(50, 110); geo.rotateX(-Math.PI / 2); const r = new THREE.Mesh(geo, cm); r.rotation.z = -s * .42; r.position.set(s * 22.5, 31.5, 0); g.add(r); }
  box(2, 2, 110, mat(0x8a5a32), .1, g, 0, 41, 0); for (const s of [-1, 1]) box(.8, 8, 110, mat(0xffffff, { map: rep(plankT('#8a5a32', '#6a4224'), 10, 1) }), .05, g, s * 43.4, 4, 0);
  for (const s of [-1, 1]) box(.6, 22, 110, mat(0xf4ecd8, { roughness: .8 }), 0, g, s * 44, 11, 0); box(90, 22, .6, mat(0xf4ecd8), 0, g, 0, 11, -55); box(90, 22, .6, mat(0xf4ecd8), 0, g, 0, 11, 55);
  for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { const w = plane(8, 6, glowM(0xfff0c8, .9), g, s * 43.6, 13, -40 + k * 16, 0); w.rotation.y = -s * Math.PI / 2; }
  const gm = mat(0x2f7a30, { roughness: .9 }); for (let k = 0; k < 8; k++) { const z = -45 + k * 13; const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push(new THREE.Vector3(-40 + 80 * t, 26 - 6 * Math.sin(t * Math.PI), z)); } const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, .5, 6), gm); g.add(t);
    for (let i = 1; i < 6; i++) { const t2 = i / 6; sphere(.6, mat([0xd8202a, 0xffd23f, 0xffffff][i % 3]), g, -40 + 80 * t2, 26 - 6 * Math.sin(t2 * Math.PI) - .6, z, 8, 6); } }
  // lámparas-corona colgantes
  for (let k = 0; k < 4; k++) { const L = G(g, 0, 22, -36 + k * 22); const r = new THREE.Mesh(new THREE.TorusGeometry(3, .25, 6, 20), mat(0x5a3a22)); r.rotation.x = Math.PI / 2; L.add(r); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; sphere(.4, glowM(0xffe0a0, 2.4), L, Math.cos(a) * 3, -.4, Math.sin(a) * 3, 8, 6); } cyl(.05, .05, 8, mat(0x1a1a1a), 4, L, 0, 4, 0); }
  const T = []; for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) T.push(garnitur(g, -26 + c * 26, -24 + r * 14, 0, 18));
  // escenario de la banda
  const B = G(g, 0, 0, -46); box(40, 4, 14, mat(0xffffff, { map: rep(plankT('#8a5a32', '#6a4224'), 4, 2) }), .1, B, 0, 2, 0); const ban = sign('OKTOBERFEST', 30, 4, '#ffffff', '#1a3a8a', '#3a7ad8', .6); ban.position.set(0, 17, -6.5); B.add(ban);
  const dr = cyl(2, 2, 1.4, mat(0xf4f0e8), 20, B, -8, 6.2, -2); dr.rotation.x = Math.PI / 2; for (let k = 0; k < 4; k++) { const tb = new THREE.Mesh(new THREE.TorusGeometry(1.2, .3, 6, 12, Math.PI * 1.5), mat(0xe8c040, { metalness: .9, roughness: .25 })); tb.position.set(4 + k * 4, 7.5, -2); B.add(tb); }
  rauten(g, [-40, 20, -52], [40, 20, -52], 24, .6);
  return { g: shade(g), T, B }; }

// ---------- oficina abandonada (X): filas de mesas con monitores apagados, sillas vacías, polvo, telarañas, reloj, planta seca,
// cajas de mudanza, ventanal con la ciudad. Centro (0,0); ventanas en z = -15 ----------
export function bueroLeer(scene, X) { const g = room(scene, X, 46, 32, 18, mat(0xffffff, { map: rep(wallp('#dfe4e8', '#d0d6dc'), 6, 2), roughness: .85 }), mat(0xffffff, { map: rep(tileT('#8a8e96', '#7a7e86', 6), 6, 4), roughness: .7 }), 0xe8ecef);
  for (let k = 0; k < 3; k++) { const w = plane(12, 9, new THREE.MeshBasicMaterial({ map: canvasTex(256, 192, (c, w_, h_) => { const gr = c.createLinearGradient(0, 0, 0, h_); gr.addColorStop(0, '#8ac8ff'); gr.addColorStop(1, '#e8f4ff'); c.fillStyle = gr; c.fillRect(0, 0, w_, h_); for (let i = 0; i < 6; i++) { c.fillStyle = ['#e8c8a0', '#c8d8e8', '#f0d8c8'][i % 3]; c.fillRect(i * 44, 110 - (i % 3) * 20, 40, 100); } }) }), g, -14 + k * 14, 9, -15.7, 0); box(12.4, .5, .6, mat(0xf4f4f4), .05, g, -14 + k * 14, 4.3, -15.5); }
  const dk = mat(0xe8e4dc, { roughness: .6 }), lg = mat(0x5a5e66, { metalness: .5 }), mon = mat(0x1a1a1e, { roughness: .3 }), scr = mat(0x0a0a0e, { roughness: .1, metalness: .4 }), ch = mat(0x2a3a5a, { roughness: .6 });
  const D = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { const d = G(g, -14 + c * 14, 0, -5 + r * 11); box(9, .3, 4.4, dk, .05, d, 0, 4, 0); for (const s of [-1, 1]) box(.3, 4, 4, lg, .02, d, s * 4.2, 2, 0); box(3.2, 2.2, .2, mon, .08, d, 0, 5.7, -1.2); box(3, 2, .02, scr, 0, d, 0, 5.7, -1.08); box(1.4, .2, 1, mon, .05, d, 0, 4.25, -1.2);
    box(2.4, .15, .8, mat(0x2a2a2e), .03, d, 0, 4.25, .2); const cr = G(d, (r + c) % 2 ? 2 : -1.5, 0, 3.2); cr.rotation.y = (r * 3 + c) * .7; box(2.2, .4, 2.2, ch, .12, cr, 0, 2.6, 0); box(2.2, 2.4, .3, ch, .1, cr, 0, 4, -1); cyl(.12, .12, 2.2, lg, 6, cr, 0, 1.3, 0); for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; const l = box(1.2, .12, .2, lg, .02, cr, Math.cos(a) * .6, .2, Math.sin(a) * .6); l.rotation.y = -a; }
    const pp = box(1.6, .5, 2.2, mat(0xf8f8f8), .02, d, -3, 4.4, .6); pp.rotation.y = .3; D.push(d); }
  // telarañas y polvo en el aire (planos)
  const web = canvasTex(128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(240,240,240,.75)'; c.lineWidth = 1.2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(i / 8 * 1.57) * w, Math.sin(i / 8 * 1.57) * h); c.stroke(); } for (let r = 12; r < 128; r += 14) { c.beginPath(); c.arc(0, 0, r, 0, 1.57); c.stroke(); } });
  const wm = new THREE.MeshBasicMaterial({ map: web, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  for (const [x, y, z, ry] of [[-22.6, 17.6, -15.6, 0], [22.6, 17.6, -15.6, -Math.PI / 2], [-22.6, 17.6, 15, Math.PI / 2]]) { const p = plane(6, 6, wm, g, x, y, z, 0); p.rotation.set(0, ry, Math.PI); }
  for (const [x, z] of [[-10, 0], [6, 0], [-2, 10]]) { const m = D[0].children[2]; } // monitores ya colocados
  const cl = textPlane(3, 3, 100, 100, (c, w, h) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(50, 50, 48, 0, 7); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 5; c.stroke(); c.lineCap = 'round'; c.beginPath(); c.moveTo(50, 50); c.lineTo(50, 18); c.moveTo(50, 50); c.lineTo(70, 62); c.stroke(); }); cl.position.set(18, 14, -15.7); g.add(cl);
  const pl = G(g, 20, 0, 10); cyl(1.1, .8, 2.2, mat(0xc8602a), 12, pl, 0, 1.1, 0); for (let k = 0; k < 6; k++) { const l = box(.2, 2.6, .5, mat(0x8a7a3a, { roughness: 1 }), .05, pl, 0, 3, 0); l.rotation.set(Math.sin(k) * .9, k, Math.cos(k * 2) * .9); }
  for (let k = 0; k < 3; k++) { const b = box(3.2, 2.4, 2.4, mat(0xc89a5a, { roughness: .9 }), .05, g, -19 + k * 1.2, 1.2 + (k === 2 ? 2.4 : 0), 11 - (k === 2 ? 1.2 : k * 2.6)); }
  const sg = sign('BÜRO ZU VERMIETEN', 9, 2, '#ffffff', '#d8202a', '#d8202a', .5); sg.position.set(-14, 11.5, -15.4); g.add(sg);
  return { g: shade(g), D }; }

// ---------- Getränkemarkt por dentro (X): pasillo de estantes con cajas y botellas; al fondo, el estante de honor con foco ----------
export function regal(scene, X) { const g = room(scene, X, 44, 40, 18, mat(0xffffff, { map: rep(wallp('#f0ead8', '#e4dcc4'), 6, 2) }), mat(0xffffff, { map: rep(tileT('#d8d4cc', '#b8b4ac', 6), 6, 6), roughness: .6 }));
  const sh = mat(0xd8dce4, { metalness: .6, roughness: .35 }); const brands = ['WEIHENSTEPHANER', 'PAULANER', 'BILLIG'];
  for (const s of [-1, 1]) { const R = G(g, s * 16, 0, 0); for (let lv = 0; lv < 4; lv++) box(6, .3, 34, sh, .03, R, 0, .4 + lv * 3.6, 0); box(.3, 14, 34, sh, .02, R, -s * 3, 7, 0); for (let lv = 0; lv < 4; lv++) for (let k = 0; k < 8; k++) { const c = crate(R, brands[(k + lv + (s > 0 ? 1 : 0)) % 3], { bottles: lv > 1 }); c.position.set(0, .55 + lv * 3.6, -14 + k * 4); c.rotation.y = s * Math.PI / 2; c.scale.setScalar(.95); } }
  // estante de honor al fondo
  const H = G(g, 0, 0, -16); box(14, 9, .6, mat(0x3a2412, { roughness: .5 }), .1, H, 0, 4.5, -1.4); for (const sx of [-1, 1]) box(.5, 9, 3, mat(0x3a2412), .05, H, sx * 6.8, 4.5, 0); box(14.6, .5, 3.4, mat(0xd8a020, { metalness: .9, roughness: .2 }), .05, H, 0, 9.2, 0); box(13, .5, 3, mat(0x5a3a22), .05, H, 0, 4.85, 0);
  const B = []; for (let k = 0; k < 5; k++) { const b = bottle(H, 'WEIHENSTEPHANER', { s: 1.25 }); b.position.set(-4 + k * 2, 5.1, .4); B.push(b); }
  const sg = sign('UNSER BESTES', 10, 1.6, '#1a3a8a', '#ffd23f', '#ffd23f', .6); sg.position.set(0, 11, 1.6); H.add(sg);
  const SPOT = new THREE.SpotLight(0xfff0c0, 0, 60, .45, .5, 1.2); SPOT.position.set(0, 17, 0); SPOT.target.position.set(0, 5, -16); g.add(SPOT, SPOT.target);
  const ps = sign('GETRÄNKEMARKT', 14, 2, '#d8202a', '#ffffff', null, .6); ps.position.set(0, 15, -19.7); g.add(ps);
  return { g: shade(g), H, B, SPOT }; }

// ---------- la cervecería más antigua del mundo (X): colina verde con el monasterio-cervecería blanco (tejados rojos, torre con cúpula),
// jardín de lúpulo con postes y cuerdas, letrero grande. Fachada principal en z = -30 mirando +z ----------
export function kloster(scene, X) { const g = G(scene, X); plane(900, 900, mat(0xffffff, { roughness: 1, map: rep(grassT('#58b046'), 80, 80) }), g, 0, -.05, 0);
  const hill = new THREE.Mesh(new THREE.SphereGeometry(70, 32, 16, 0, 6.283, 0, 1.2), mat(0xffffff, { map: rep(grassT('#5cb84a'), 20, 20), roughness: 1 })); hill.scale.y = .22; hill.position.set(0, -6, -70); hill.receiveShadow = true; g.add(hill);
  const wh = mat(0xfaf6ee, { roughness: .7 }), roof = mat(0xc84a2a, { roughness: .7 }), win = mat(0x3a5a7a, { roughness: .2, metalness: .3 });
  const B = G(g, 0, 6, -40); box(60, 18, 20, wh, .1, B, 0, 9, 0); const rf = new THREE.Mesh(new THREE.CylinderGeometry(.1, 14.5, 9, 4, 1), roof); rf.rotation.y = Math.PI / 4; rf.scale.set(2.95, 1, 1); rf.position.y = 22.5; B.add(rf);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { box(2.6, 3.6, .3, win, .05, B, -24 + c * 6, 4 + r * 5.4, 10.1); box(3.2, .4, .5, mat(0xe8e0d0), .05, B, -24 + c * 6, 1.9 + r * 5.4, 10.2); }
  box(34, 14, 16, wh, .1, B, 38, 7, 6); const rf2 = new THREE.Mesh(new THREE.CylinderGeometry(.1, 12, 7, 4, 1), roof); rf2.rotation.y = Math.PI / 4; rf2.scale.set(1.9, 1, 1.3); rf2.position.set(38, 17.5, 6); B.add(rf2);
  const T = G(B, -24, 0, 2); box(9, 34, 9, wh, .1, T, 0, 17, 0); const cu = sphere(5, mat(0x4a8a6a, { roughness: .5, metalness: .4 }), T, 0, 38, 0, 16, 12); cu.scale.y = 1.25; const sp = new THREE.Mesh(new THREE.ConeGeometry(.8, 7, 8), mat(0xd8a020, { metalness: .9, roughness: .2 })); sp.position.y = 46; T.add(sp);
  const cl = textPlane(5, 5, 100, 100, (c, w, h) => { c.fillStyle = '#1a2a4a'; c.beginPath(); c.arc(50, 50, 48, 0, 7); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(50, 50); c.lineTo(50, 18); c.moveTo(50, 50); c.lineTo(72, 58); c.stroke(); }); cl.position.set(0, 27, 4.6); T.add(cl);
  box(8, 9, .6, mat(0x5a3a22), .1, B, 0, 4.5, 10.2); const arch = cyl(4, 4, .7, mat(0xe8e0d0), 20, B, 0, 9, 10.2); arch.rotation.x = Math.PI / 2;
  const S1 = sign('ÄLTESTE BRAUEREI DER WELT', 40, 4.2, '#1a3a8a', '#ffffff', '#ffd23f', .58); S1.position.set(0, 16.6, 10.6); B.add(S1);
  const S2 = sign('SEIT 1040', 16, 3, '#ffd23f', '#1a3a8a', '#1a3a8a', .66); S2.position.set(14, 11.4, 10.4); B.add(S2);
  // camino y lúpulo
  plane(8, 60, mat(0xffffff, { map: rep(noiseTex('#c8b48a', ['#b8a47a', '#d8c49a'], 900, 3, 1), 1, 8), roughness: 1 }), g, 0, .03, 0);
  for (const s of [-1, 1]) for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const x = s * (12 + r * 7), z = -14 + k * 8; cyl(.2, .25, 14, mat(0x6a4a2a), 6, g, x, 7, z); const vine = cyl(.7, .9, 11, mat(0x4a9a3a, { roughness: .9 }), 8, g, x, 5.5, z); for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(.5, 1, 6), mat(0x9ad86a, { roughness: .8 })); c.position.set(x + Math.sin(i * 2) * .9, 3 + i * 2.4, z + Math.cos(i * 2) * .9); c.rotation.x = Math.PI; g.add(c); } }
  for (let k = 0; k < 10; k++) pine(g, -110 + k * 24, -120 - (k % 2) * 14, 1.6);
  mountains(g, 0, -60, 600, 7); return { g: shade(g), B }; }

// ---------- Sudhaus (X): sala de cocción con dos calderas de cobre con cúpula y tuberías, suelo de baldosas, ventanales con haces de luz ----------
export function sudhaus(scene, X) { const g = room(scene, X, 50, 40, 26, mat(0xffffff, { map: rep(tileT('#f4f0e4', '#d8d0c0', 8), 6, 3) }), mat(0xffffff, { map: rep(tileT('#a84a2a', '#7a3418', 6), 6, 5), roughness: .6 }), 0xf4f0e4);
  const cu = new THREE.MeshStandardMaterial({ color: 0xd87a3a, metalness: .95, roughness: .22, envMapIntensity: 1.6 }), st = mat(0xd8dce4, { metalness: .8, roughness: .3 });
  const K = []; for (const s of [-1, 1]) { const k = G(g, s * 11, 0, -6); cyl(6, 6, 9, cu, 32, k, 0, 7.5, 0); const d = sphere(6, cu, k, 0, 12, 0, 32, 16); d.scale.y = .6; cyl(1, 1, 8, cu, 16, k, 0, 18, 0); const p = cyl(.7, .7, 12, cu, 12, k, -s * 5, 21, 0); p.rotation.z = Math.PI / 2; cyl(6.3, 6.3, .5, st, 32, k, 0, 3, 0); cyl(6.3, 6.3, .5, st, 32, k, 0, 12, 0);
    for (let i = 0; i < 4; i++) { const a = i / 4 * 6.283 + .4; cyl(.3, .3, 3, st, 8, k, Math.cos(a) * 5, 1.5, Math.sin(a) * 5); } const w = cyl(1.2, 1.2, .2, mat(0x2a2a2e, { metalness: .6 }), 16, k, 0, 9, 6.05); w.rotation.x = Math.PI / 2; K.push(k); }
  box(48, 1, 3, st, .05, g, 0, 8, -17); for (let k = 0; k < 9; k++) cyl(.1, .1, 4, st, 6, g, -22 + k * 5.5, 10, -16);
  for (let k = 0; k < 3; k++) { plane(8, 12, glowM(0xfff4d8, 1.1), g, -16 + k * 16, 14, -19.7, 0); }
  const s = sign('SUDHAUS · SEIT 1040', 18, 2.4, '#3a2412', '#ffd23f', '#ffd23f', .55); s.position.set(0, 22, -19.6); g.add(s);
  for (let k = 0; k < 4; k++) { const f = fass(g, { s: .9 }); f.position.set(-20 + k * 4, 0, 14); }
  return { g: shade(g), K }; }

// ---------- villa en el lago (X): lago con orilla, villa blanca, embarcadero, barca y montañas; la villa en z = -40 ----------
export function seeVilla(scene, X) { const g = G(scene, X); plane(900, 900, mat(0xffffff, { roughness: 1, map: rep(grassT('#5cb84a'), 80, 80) }), g, 0, -.05, 0);
  const lake = new THREE.Mesh(new THREE.CircleGeometry(160, 48), new THREE.MeshStandardMaterial({ color: 0x2a8ad8, roughness: .06, metalness: .35, envMapIntensity: 2 })); lake.rotation.x = -Math.PI / 2; lake.position.set(0, .06, 150); g.add(lake);
  villa(g, 0, -40, 0); const dock = G(g, 18, 0, -5); for (let k = 0; k < 10; k++) box(5, .4, 1.4, mat(0xffffff, { map: plankT('#9a6a3a', '#7a4a26') }), .03, dock, 0, 1.2, k * 1.6); for (let k = 0; k < 5; k++) cyl(.25, .25, 3, mat(0x5a3a22), 6, dock, 2.4, .6, k * 3.6);
  const boat = G(g, 26, .4, 22); const hb = box(4, 1.4, 10, mat(0xf4f4f4, { roughness: .4 }), .5, boat, 0, .5, 0); box(3.4, .3, 9, mat(0x8a5a32), .05, boat, 0, 1.2, 0);
  const SOLD = sign('VERKAUFT', 10, 2.6, '#d8202a', '#ffffff', '#ffffff', .6); SOLD.position.set(-14, 6, 0); g.add(SOLD); for (const s of [-1, 1]) cyl(.2, .2, 6, mat(0xf4f4f4), 6, g, -14 + s * 4, 3, -.1);
  for (let k = 0; k < 8; k++) pine(g, -80 + k * 22, -90 - (k % 2) * 16, 1.5); mountains(g, 0, 60, 520, 3);
  return { g: shade(g), lake, boat, SOLD }; }

// ---------- despacho del alcalde (X): madera noble, ventanal con vistas al pueblo, escritorio con teléfono, retrato, bandera, globo de oro,
// estantería con jarras de cristal en vitrina. Escritorio en (0, -6); ventanal en z = -13 ----------
export function amtsstube(scene, X) { const g = room(scene, X, 40, 28, 20, mat(0xffffff, { map: rep(wallp('#7a2a2a', '#8a3434'), 6, 2), roughness: .8 }), mat(0xffffff, { map: rep(plankT('#7a4a26', '#5e3818'), 4, 4), roughness: .5 }));
  const view = plane(18, 11, new THREE.MeshBasicMaterial({ map: canvasTex(320, 200, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6ab0ff'); gr.addColorStop(1, '#dff0ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#b8c4d8'; c.beginPath(); c.moveTo(0, 120); c.lineTo(80, 50); c.lineTo(160, 110); c.lineTo(250, 40); c.lineTo(320, 110); c.lineTo(320, 200); c.lineTo(0, 200); c.fill(); for (let i = 0; i < 9; i++) { c.fillStyle = ['#f4dca0', '#f2b8a8', '#bfe0f0', '#d8ecc0'][i % 4]; c.fillRect(i * 36, 130 + (i % 2) * 10, 32, 70); c.fillStyle = '#a84a2a'; c.beginPath(); c.moveTo(i * 36 - 2, 130 + (i % 2) * 10); c.lineTo(i * 36 + 16, 112 + (i % 2) * 10); c.lineTo(i * 36 + 34, 130 + (i % 2) * 10); c.fill(); } }) }), g, 0, 10, -13.7, 0);
  box(19, .8, .8, mat(0x5a3a22), .05, g, 0, 4.3, -13.4); box(.6, 12, .6, mat(0x5a3a22), .05, g, 0, 10, -13.4);
  const dk = mat(0x4a2a14, { roughness: .4 }); box(14, .6, 6, dk, .1, g, 0, 4.4, -6); box(13.4, 4, 5.4, dk, .1, g, 0, 2, -6); const lamp = G(g, -5, 4.7, -7); cyl(.15, .15, 2, mat(0xd8a020, { metalness: .9 }), 6, lamp, 0, 1, 0); const sh_ = cyl(.6, 1, 1, mat(0x2a6a3a), 12, lamp, 0, 2.2, 0);
  const ph = G(g, 4, 4.7, -6); box(1.8, .4, 1.4, mat(0x1a1a1e), .1, ph, 0, .2, 0); const hs = box(2, .4, .5, mat(0x1a1a1e), .2, ph, 0, .7, 0);
  const chair = G(g, 0, 0, -11); box(4, .6, 4, mat(0x8a1a1a, { roughness: .5 }), .3, chair, 0, 3, 0); box(4.4, 7, .8, mat(0x8a1a1a, { roughness: .5 }), .3, chair, 0, 6, -1.8);
  const fl = G(g, 15, 0, -11); cyl(.15, .15, 14, mat(0xd8a020, { metalness: .9 }), 6, fl, 0, 7, 0); const flag = plane(5, 3.2, new THREE.MeshStandardMaterial({ map: canvasTex(100, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.drawImage(rauteT().image, 0, 0, w, h); }), side: THREE.DoubleSide }), fl, 2.6, 11.6, 0, 0);
  const por = textPlane(6, 7.5, 180, 225, (c, w, h) => { c.fillStyle = '#c8a040'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a2a1a'; c.fillRect(12, 12, w - 24, h - 24); c.fillStyle = '#f0b898'; c.beginPath(); c.arc(w / 2, 96, 40, 0, 7); c.fill(); c.fillStyle = '#c8c8c8'; c.fillRect(w / 2 - 40, 110, 80, 26); c.fillStyle = '#2f5a3a'; c.fillRect(w / 2 - 46, 44, 92, 22); c.fillStyle = '#f8f8f4'; c.fillRect(w / 2 - 50, 140, 100, 70); }); por.position.set(-12, 11, -13.7); g.add(por);
  const vit = G(g, 15, 0, 4); box(.6, 12, 10, mat(0x4a2a14), .05, vit, 3, 6, 0); for (let lv = 0; lv < 3; lv++) { box(4, .3, 10, mat(0x4a2a14), .05, vit, 1, 2 + lv * 4, 0); for (let k = 0; k < 3; k++) { const m = mass(vit); m.position.set(1, 2.2 + lv * 4, -3 + k * 3); m.rotation.y = -Math.PI / 2; } }
  const GLASS = G(g, -3, 4.7, -4.4); const gl = cyl(.4, .34, 1.2, new THREE.MeshStandardMaterial({ color: 0xe8f6ff, transparent: true, opacity: .35, roughness: .05 }), 16, GLASS, 0, .6, 0); const wt = cyl(.35, .3, .9, new THREE.MeshStandardMaterial({ color: 0x9ad8ff, transparent: true, opacity: .55, roughness: .05 }), 16, GLASS, 0, .48, 0);
  return { g: shade(g), ph, hs, GLASS, chair }; }

// ---------- Biergeld-Ministerium (X): sala con mesa larga semicircular, placas con nombres, pantalla grande (canvas), banderas negro-rojo-oro,
// atril. Pantalla en (0, 12, -17); mesa en z = -6 ----------
export function ministerium(scene, X) { const g = room(scene, X, 50, 36, 24, mat(0xffffff, { map: rep(wallp('#e8e4d8', '#dcd6c6'), 6, 2) }), mat(0xffffff, { map: rep(plankT('#6a4224', '#5a3418'), 5, 5), roughness: .5 }), 0xf4f0e8);
  const cv = document.createElement('canvas'); cv.width = 960; cv.height = 540; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const scr = new THREE.Mesh(new THREE.PlaneGeometry(24, 13.5), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); scr.position.set(0, 13, -17.6); g.add(scr); box(25, 14.5, .4, mat(0x1a1a1e), .1, g, 0, 13, -17.9);
  scr.userData.draw = fn => { const c = cv.getContext('2d'); c.clearRect(0, 0, 960, 540); fn(c, 960, 540); t.needsUpdate = true; };
  const dk = mat(0x3a2412, { roughness: .45 }); for (let k = -3; k <= 3; k++) { const a = k * .22, x = Math.sin(a) * 26, z = -26 + Math.cos(a) * 26 - 6; const d = box(7.4, 3.2, 3, dk, .1, g, x, 1.6, z); d.rotation.y = -a; const tp = box(7.6, .3, 3.6, mat(0x5a3a22), .05, g, x, 3.3, z); tp.rotation.y = -a; }
  for (const s of [-1, 1]) { const f = G(g, s * 20, 0, -14); cyl(.15, .15, 14, mat(0xd8a020, { metalness: .9 }), 6, f, 0, 7, 0); for (let i = 0; i < 3; i++) box(.1, 1.2, 4, mat([0x1a1a1a, 0xd8202a, 0xf0c020][i]), .02, f, .1, 12.6 - i * 1.2, 2); }
  const s = sign('BIERGELD-MINISTERIUM', 20, 2.4, '#1a2a4a', '#ffffff', '#ffd23f', .55); s.position.set(0, 21.6, -17.5); g.add(s);
  const pod = G(g, 0, 0, 2); box(3, 5, 2, mat(0x5a3a22), .1, pod, 0, 2.5, 0);
  return { g: shade(g), scr, pod }; }

// ---------- tribunal (X): estrado alto de madera con el mazo, banco del acusado, rejas de madera, ventanales; estrado en z = -10 ----------
export function gericht(scene, X) { const g = room(scene, X, 40, 32, 22, mat(0xffffff, { map: rep(plankT('#8a6040', '#7a5034'), 4, 2) }), mat(0xffffff, { map: rep(tileT('#e8e0d0', '#c8c0b0', 6), 6, 5) }), 0xf4f0e8);
  const dk = mat(0x4a2a14, { roughness: .45 }); box(20, 6, 5, dk, .1, g, 0, 3, -10); box(20.6, .5, 5.6, mat(0x5a3a22), .05, g, 0, 6.2, -10); const chair = box(4, 9, 1, mat(0x2a1a10), .2, g, 0, 7, -13.5);
  const GAV = G(g, 4, 6.5, -9); const head = cyl(.4, .4, 1.4, mat(0x6a3a1a, { roughness: .4 }), 12, GAV, 0, 0, 0); head.rotation.z = Math.PI / 2; cyl(.12, .12, 2, mat(0x6a3a1a), 8, GAV, .2, 0, .9).rotation.x = Math.PI / 2; const blk = cyl(.7, .7, .3, mat(0x4a2a14), 12, g, 4, 6.5, -8.6);
  box(10, 3.2, 2, dk, .1, g, 0, 1.6, 6); for (let k = 0; k < 12; k++) cyl(.15, .15, 3, dk, 6, g, -18 + k * 3.3, 1.5, 0);
  for (let k = 0; k < 3; k++) plane(6, 10, glowM(0xfff6e0, .9), g, -12 + k * 12, 12, -15.7, 0);
  const s = sign('AMTSGERICHT', 14, 2, '#3a2412', '#ffd23f', null, .6); s.position.set(0, 18, -15.6); g.add(s);
  return { g: shade(g), GAV }; }

// ---------- cervecería abandonada de noche (X): nave de ladrillo con ventanas rotas, puerta tapiada con tablas, letrero caído,
// chimenea, hierbajos, vallas. Puerta en (0, -20) ----------
export function altBrauerei(scene, X) { const g = G(scene, X); plane(600, 600, mat(0xffffff, { roughness: 1, map: rep(grassT('#3a5a34'), 50, 50) }), g, 0, -.05, 0); plane(40, 50, mat(0xffffff, { map: rep(noiseTex('#4a4a50', ['#3a3a40', '#5a5a60'], 2000, 2, 1), 4, 5), roughness: 1 }), g, 0, .02, -2);
  const br = mat(0xffffff, { map: rep(brickT(10, 30, 28), 8, 4), roughness: .95 }); box(56, 24, 22, br, 0, g, 0, 12, -32); const rf = new THREE.Mesh(new THREE.CylinderGeometry(.1, 16, 10, 4, 1), mat(0x2a2a30, { roughness: .9 })); rf.rotation.y = Math.PI / 4; rf.scale.set(2.5, 1, 1); rf.position.set(0, 29, -32); g.add(rf);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { if (r === 0 && (c === 2 || c === 3)) continue; const w = box(4, 5, .3, mat(0x0a0c12, { roughness: .2 }), .05, g, -22 + c * 8.8, 7 + r * 9, -20.9); const cr = box(4, .3, .3, mat(0x5a4a3a), .02, g, -22 + c * 8.8, 7 + r * 9, -20.7); cr.rotation.z = (c % 2 ? .6 : -.5); }
  box(9, 11, .6, mat(0x2a1a10), .05, g, 0, 5.5, -20.9); for (let k = 0; k < 5; k++) { const p = box(11, 1.2, .3, mat(0xffffff, { map: plankT('#8a6a4a', '#6a4a2a') }), .05, g, 0, 1.6 + k * 2.2, -20.4); p.rotation.z = (k % 2 ? .15 : -.12); }
  const s = sign('BRAU EREI', 22, 3.6, '#2a2418', '#b8a070', null, .6); s.position.set(-2, 20, -20.6); s.rotation.z = -.08; g.add(s);
  cyl(2.2, 2.8, 46, mat(0xffffff, { map: rep(brickT(10, 30, 26), 2, 6) }), 16, g, 22, 23, -40);
  for (let k = 0; k < 40; k++) { const r = RNG(k); const w = new THREE.Mesh(new THREE.ConeGeometry(.4, 2 + r() * 2, 4), mat(0x3a6a2a, { roughness: 1 })); w.position.set(-26 + r() * 52, 1, -19 + r() * 6); g.add(w); }
  for (let k = 0; k < 8; k++) { const f = box(.3, 6, .3, mat(0x6a6a6a, { metalness: .5 }), 0, g, -30 + k * 8.6, 3, 4); } const fw = box(60, .2, .2, mat(0x6a6a6a), 0, g, 0, 5.4, 4); const sg2 = sign('BETRETEN VERBOTEN', 8, 2, '#f4f4f4', '#d8202a', '#d8202a', .45); sg2.position.set(-12, 3.6, 4.2); g.add(sg2);
  return { g: shade(g) }; }

// ---------- el sótano (X): bóveda de ladrillo, filas de barriles, estanterías con botellas polvorientas, telarañas por todas partes,
// rayos de luz por una rejilla; al fondo, la última balda con el goldener Krug. Balda en (0, 5, -16) ----------
export function brauKeller(scene, X) { const g = G(scene, X); const br = mat(0xffffff, { map: rep(brickT(14, 26, 24), 6, 3), roughness: .95 });
  box(36, .4, 40, mat(0xffffff, { map: rep(noiseTex('#4a4440', ['#3a3430', '#5a5450'], 3000, 3, 1), 6, 6), roughness: 1 }), 0, g, 0, -.2, 0);
  for (const s of [-1, 1]) box(.6, 12, 40, br, 0, g, s * 18, 6, 0); box(36, 12, .6, br, 0, g, 0, 6, -20); box(36, 12, .6, br, 0, g, 0, 6, 20);
  box(36, .6, 40, mat(0xffffff, { map: rep(brickT(14, 26, 22), 6, 6), roughness: .95 }), 0, g, 0, 14, 0);
  for (let k = 0; k < 6; k++) { const a = new THREE.Mesh(new THREE.TorusGeometry(17.4, .9, 6, 24, Math.PI), br); a.scale.y = .2; a.position.set(0, 11, -17 + k * 7); g.add(a); }
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) { const f = fass(g, { s: 1.0 }); f.rotation.z = Math.PI / 2; f.position.set(s * 13, 2.2, -12 + k * 7.5); f.rotation.y = 0; }
  const sh = mat(0x4a3424, { roughness: .9 }); const SHB = G(g, 0, 0, -18.5); for (let lv = 0; lv < 3; lv++) box(16, .4, 2.6, sh, .03, SHB, 0, 1.6 + lv * 3.6, 0); for (const s of [-1, 1]) box(.4, 11, 2.6, sh, .03, SHB, s * 8, 5.5, 0);
  const r = RNG(5); for (let lv = 0; lv < 3; lv++) for (let k = 0; k < 6; k++) { if (lv === 1 && (k === 2 || k === 3)) continue; const b = bottle(SHB, 'BILLIG', { s: .55 }); b.position.set(-6 + k * 2.3 + r() * .4, 1.8 + lv * 3.6, 0); b.rotation.z = (r() - .5) * .3; }
  const GK = goldKrug(SHB); GK.position.set(0, 5.4, .2); GK.rotation.y = -.35;
  const web = canvasTex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(235,235,235,.8)'; c.lineWidth = 1.6; for (let i = 0; i < 11; i++) { c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 + Math.cos(i / 11 * 6.283) * w, h / 2 + Math.sin(i / 11 * 6.283) * h); c.stroke(); } for (let rr = 10; rr < 128; rr += 12) { c.beginPath(); for (let i = 0; i <= 11; i++) { const a = i / 11 * 6.283; c.lineTo(w / 2 + Math.cos(a) * rr, h / 2 + Math.sin(a) * rr); } c.stroke(); } });
  const wm = new THREE.MeshBasicMaterial({ map: web, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: .8 }); const WEBS = [];
  for (const [x, y, z, ry, s] of [[-7, 9, -18, 0, 6], [7.5, 9.5, -18, 0, 5], [-3.2, 7.6, -17.4, 0, 4.2], [3.4, 7.8, -17.4, 0, 3.8], [-17.4, 9, -8, Math.PI / 2, 7], [17.4, 9, 4, -Math.PI / 2, 7], [0, 11, -12, 0, 8], [-10, 4, -17.8, 0, 3.6]]) { const p = plane(s, s, wm, g, x, y, z, 0); p.rotation.y = ry; WEBS.push(p); }
  const grate = box(6, .3, 3, mat(0x2a2a2e, { metalness: .7 }), .02, g, 6, 16.4, -4);
  return { g: shade(g), GK, SHB, WEBS }; }

// ---------- mi cuarto (X): cuarto pequeño con cama deshecha, colchón, hucha vacía, póster, lámpara, ventana (día/noche), estante con el goldener Krug.
// Cama a la izquierda (-7, 0, -4); ventana en z = -9.7 ----------
export function zimmerF(scene, X) { const g = room(scene, X, 26, 20, 16, mat(0xffffff, { map: rep(wallp('#c8d8c0', '#b8c8b0'), 4, 2) }), mat(0xffffff, { map: rep(plankT('#b08a5a', '#9a744a'), 3, 3), roughness: .7 }));
  const bed = G(g, -7, 0, -4); box(7, 2, 12, mat(0x6a4a2a), .1, bed, 0, 1, 0); box(6.6, 1.2, 11.4, mat(0xe8e8f0), .3, bed, 0, 2.5, 0); box(4, 1, 2.4, mat(0xffffff), .4, bed, 0, 3.4, -4.4); const bl = box(6.8, .6, 7, mat(0x3a6ad8, { roughness: .9 }), .3, bed, 0, 3.2, 1.6); bl.rotation.z = .05;
  const win = G(g, 5, 0, -9.7); const WP = plane(8, 6, new THREE.MeshBasicMaterial({ color: 0x8ac8ff }), win, 0, 10, .05, 0); box(8.6, .4, .6, mat(0xf4f4f4), .03, win, 0, 6.8, .2); box(.3, 6, .4, mat(0xf4f4f4), .02, win, 0, 10, .15);
  const po = textPlane(4, 5.4, 120, 160, (c, w, h) => { c.fillStyle = '#1a1a2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.fillText('FC BRAUHEIM', w / 2, 30); c.fillStyle = '#d8202a'; c.beginPath(); c.arc(60, 92, 34, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 30px ${FONT}`; c.fillText('1921', 60, 102); }); po.position.set(-7, 10, -9.7); g.add(po);
  const desk = G(g, 8, 0, 3); box(7, .3, 4, mat(0xd8b88a), .05, desk, 0, 4, 0); for (const s of [-1, 1]) box(.3, 4, 3.6, mat(0xd8b88a), .02, desk, s * 3.3, 2, 0);
  const pig = G(desk, -1.6, 4.15, 0); const pb = sphere(.9, mat(0xff9ac0, { roughness: .4 }), pig, 0, .8, 0, 16, 12); pb.scale.set(1.2, 1, 1); for (const [x, z] of [[-.6, -.4], [-.6, .4], [.6, -.4], [.6, .4]]) cyl(.18, .18, .4, mat(0xff8ab0), 8, pig, x, .2, z); const sn = cyl(.3, .3, .3, mat(0xff8ab0), 12, pig, 1.05, .85, 0); sn.rotation.z = Math.PI / 2;
  const SH = G(g, 0, 8.6, -9.4); box(8, .3, 1.4, mat(0x8a5a32), .03, SH, 0, 0, 0);
  const lampG = G(desk, 2.4, 4.15, -.8); cyl(.6, .8, .3, mat(0x2a2a2e), 10, lampG, 0, .15, 0); cyl(.08, .08, 2.6, mat(0x2a2a2e), 6, lampG, 0, 1.4, 0); const shd = cyl(.5, 1, 1, mat(0xffe08a, { emissive: 0xffc860, emissiveIntensity: .5 }), 12, lampG, 0, 2.8, 0);
  return { g: shade(g), bed, WP, SH, pig, desk }; }

// ---------- oficina del banco (X): mesa de cristal, pantallas con gráficos (canvas), caja fuerte, plantas, rótulo; pantallas en z = -12 ----------
export function bankBuero(scene, X) { const g = room(scene, X, 40, 26, 18, mat(0xffffff, { map: rep(wallp('#e4e8ee', '#d4dae2'), 6, 2) }), mat(0xffffff, { map: rep(tileT('#3a3e48', '#2a2e38', 6), 5, 4), roughness: .3 }), 0xf4f6f8);
  const cv = document.createElement('canvas'); cv.width = 960; cv.height = 400; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const scr = new THREE.Mesh(new THREE.PlaneGeometry(24, 10), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); scr.position.set(0, 11, -12.7); g.add(scr); box(25, 11, .4, mat(0x1a1a1e), .1, g, 0, 11, -12.95);
  scr.userData.draw = fn => { const c = cv.getContext('2d'); c.clearRect(0, 0, 960, 400); fn(c, 960, 400); t.needsUpdate = true; };
  box(14, .3, 5, new THREE.MeshStandardMaterial({ color: 0xbfe0f0, transparent: true, opacity: .5, roughness: .05 }), .05, g, 0, 4, -4); for (const s of [-1, 1]) box(.3, 4, 4.4, mat(0xd8dce4, { metalness: .8 }), .02, g, s * 6.6, 2, -4);
  const safe = G(g, 15, 0, -9); box(6, 8, 5, mat(0x5a5e66, { metalness: .8, roughness: .3 }), .2, safe, 0, 4, 0); const wh = new THREE.Mesh(new THREE.TorusGeometry(1.2, .2, 8, 20), mat(0xd8a020, { metalness: .9 })); wh.position.set(0, 4.4, 2.55); safe.add(wh);
  const s = sign('BRAUHEIMER BANK', 14, 2, '#1a2a4a', '#ffffff', '#ffd23f', .55); s.position.set(0, 16.8, -12.6); g.add(s);
  return { g: shade(g), scr }; }

// ---------- inundación de cerveza: superficie con espuma que sube; se pone en la ciudad o en interiores ----------
export function flood(scene) { const g = G(scene); const t = canvasTex(512, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f6b02a'); gr.addColorStop(1, '#e8901a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); const r = RNG(3); for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(255,250,230,${.2 + r() * .6})`; c.beginPath(); c.arc(r() * w, r() * h, 2 + r() * 10, 0, 7); c.fill(); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(14, 14); const surf = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), new THREE.MeshStandardMaterial({ map: t, roughness: .3, metalness: .1, emissive: 0x5a3000, emissiveIntensity: .25 })); surf.rotation.x = -Math.PI / 2; surf.receiveShadow = true; g.add(surf);
  const fm = mat(0xfffbf0, { roughness: .9, emissive: 0x302a20, emissiveIntensity: .2 }); const FOAM = []; const r = RNG(11); for (let i = 0; i < 160; i++) { const s = sphere(1, fm, g, (r() - .5) * 160, 0, (r() - .5) * 220, 10, 8); s.userData.b = [s.position.x, s.position.z, .8 + r() * 2.4, r() * 6]; FOAM.push(s); }
  g.userData = { surf, FOAM, set(level, T) { g.position.y = level; t.offset.set(T * .02, T * .035); FOAM.forEach(s => { const [x, z, sz, ph] = s.userData.b; s.position.set(x + Math.sin(T * .6 + ph) * 1.5, Math.sin(T * 1.4 + ph) * .2, z + Math.cos(T * .5 + ph) * 1.5); s.scale.set(sz, sz * .45, sz); }); } };
  return g; }
