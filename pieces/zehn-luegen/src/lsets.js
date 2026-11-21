// Zehn Lügen — escenarios y atrezo propios (nada del vídeo de «Zehn Neins»):
// la Gasse nevada con casas de entramado (Fachwerk), farolas, guirnaldas, abeto en la plaza y la torre del reloj;
// salón, cocina, comedor de Navidad, cuarto del niño, baño de Kowalski con espejo; el maletín del Coleccionista,
// perros (Krümel y el dackel Bruno), violín, jarrón, coche, correa, gorros de fiesta y fuegos artificiales.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp } from './engine.js';
import { noiseTex, stripes, txt } from './props.js';
import { rathausturm, FONT } from './sets.js';
export { FONT };
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glow = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const gold = () => mat(0xe0b040, { metalness: .85, roughness: .25 });
const SNOW = mat(0xf4f8ff, { roughness: .95 });
function room(parent, X, w, d, h, wall, floor, ceil = 0xf4f0e8) { const g = new THREE.Group(); g.position.x = X; parent.add(g); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil), 0, g, 0, h, 0); return g; }
const plank = (hue = 28) => canvasTex(128, 128, (c, w, h) => { const r = RNG(4 + hue); for (let y = 0; y < h; y += 16) { c.fillStyle = `hsl(${hue},${40 + r() * 12}%,${40 + r() * 10}%)`; c.fillRect(0, y, w, 16); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y, w, 2); c.fillRect((r() * w) | 0, y, 2, 16); } }, true);
const tiles = (a, b, n = 8) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * w / n, 0); c.lineTo(i * w / n, h); c.moveTo(0, i * h / n); c.lineTo(w, i * h / n); c.stroke(); } }, true);
const wallpaper = (bg, fg, kind = 0) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg;
  if (kind === 0) { for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 10, h); for (let y = 16; y < h; y += 32) for (let x = 21; x < w; x += 32) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); } }
  else { for (let y = 0; y < h; y += 32) for (let x = (y / 32) % 2 ? 16 : 0; x < w; x += 32) { c.beginPath(); c.moveTo(x, y + 8); c.lineTo(x + 6, y + 16); c.lineTo(x, y + 24); c.lineTo(x - 6, y + 16); c.fill(); } } }, true);
const sparkleSnow = () => { const t = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#e8eef8'; c.fillRect(0, 0, w, h); const r = RNG(31); for (let i = 0; i < 1600; i++) { const v = 215 + r() * 40 | 0; c.fillStyle = `rgb(${v},${v + 4},${Math.min(255, v + 14)})`; c.fillRect(r() * w, r() * h, 3, 3); } for (let i = 0; i < 90; i++) { c.fillStyle = '#ffffff'; c.fillRect(r() * w, r() * h, 2, 2); } }, true); return t; };

// =====================================================================================================
// casa de entramado: hastial a la calle, ventanas encendidas con arco de velas, contraventanas, puerta con corona,
// timbre, escalones, farolillo, valla baja, nieve en tejado y alféizares; 'dirt' = solar vacío (cuando desaparece)
// =====================================================================================================
const PL = ['#f4e4c4', '#f2cfc0', '#dde8cc', '#f6ecd6', '#e6d2e6', '#f8d8a8', '#d4e2f2', '#f0c8b0'];
const BM = [0x4a2c1c, 0x6a2418, 0x2e2420, 0x283848];
const RF = ['#7a2a20', '#4a3426', '#34404e', '#6a3e22'];
const SH = [0x2a5a3a, 0x8a2a2a, 0x2a4a7a, 0x6a4a1a, 0x4a2a5a];
const hallTex = canvasTex(128, 220, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ffcf8a'); g.addColorStop(1, '#c87a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(120,60,20,.35)'; for (let x = 0; x < w; x += 18) c.fillRect(x, 0, 6, h * .62); c.fillStyle = '#7a4a2a'; c.fillRect(0, h * .62, w, h * .38); c.fillStyle = '#5a3018'; for (let k = 0; k < 6; k++) c.fillRect(w * .55, h * .62 - k * 22, w * .45, 8);
  c.fillStyle = '#3a2a2a'; c.fillRect(10, 40, 30, 6); for (let k = 0; k < 3; k++) { c.fillStyle = ['#2a4a8a', '#8a2a2a', '#2a6a4a'][k]; c.fillRect(12 + k * 9, 46, 8, 40); } c.fillStyle = '#ffe9b0'; c.beginPath(); c.arc(w * .3, 24, 10, 0, 7); c.fill(); });
export function fachHaus(parent, x, z, i, ry, o = {}) {
  const root = new THREE.Group(); root.position.set(x, 0, z); root.rotation.y = ry; parent.add(root);
  const g = new THREE.Group(); root.add(g);
  const w = o.w ?? 14, h = 12.6, d = 11, rise = 6.2, half = w / 2 + .8;
  const plaster = mat(0xffffff, { roughness: .92, map: canvasTex(64, 64, (c, W, H) => { c.fillStyle = PL[i % PL.length]; c.fillRect(0, 0, W, H); const r = RNG(i + 3); for (let k = 0; k < 140; k++) { c.fillStyle = `rgba(0,0,0,${.03 + r() * .03})`; c.fillRect(r() * W, r() * H, 3, 3); } }) });
  const beam = mat(BM[i % BM.length], { roughness: .8 }), stone = mat(0xffffff, { roughness: .95, map: rep(noiseTex('#7a7470', ['#6a6460', '#8a847c'], 900, 3, 1), 3, 1) });
  const win = new THREE.MeshStandardMaterial({ color: 0xffe2a6, emissive: 0xffa848, emissiveIntensity: .95, roughness: .3 });
  box(w, 1.2, d, stone, .05, g, 0, .6, 0); box(w, h - 1.2, d, plaster, .05, g, 0, 1.2 + (h - 1.2) / 2, 0);
  const F = d / 2 + .12;
  // entramado de la fachada
  for (const bx of [-w / 2 + .25, -w / 6, w / 6, w / 2 - .25]) box(.42, h - 1.2, .3, beam, .02, g, bx, 1.2 + (h - 1.2) / 2, F);
  for (const by of [1.4, 6.5, h - .2]) box(w + .3, .42, .36, beam, .02, g, 0, by, F + .02);
  for (const s of [-1, 1]) { const dg = box(.34, 6.4, .28, beam, .02, g, s * (w / 2 - 1.6), 9.6, F + .03); dg.rotation.z = s * .5; }
  // ventanas
  const window_ = (wx, wy, candle) => { box(2.6, 2.9, .2, win, .03, g, wx, wy, F - .04); box(.16, 2.9, .2, beam, 0, g, wx, wy, F + .08); box(2.6, .16, .2, beam, 0, g, wx, wy + .2, F + .08);
    box(3.1, .3, .7, beam, .03, g, wx, wy - 1.6, F + .3); box(3.0, .26, .62, SNOW, .1, g, wx, wy - 1.36, F + .32);
    for (const s of [-1, 1]) { const sh = box(.8, 3.0, .12, mat(SH[(i + (s > 0)) % SH.length], { roughness: .6 }), .03, g, wx + s * 1.85, wy, F + .1); for (let k = 0; k < 3; k++) box(.6, .08, .05, mat(0x000000, { transparent: true, opacity: .25 }), 0, g, wx + s * 1.85, wy - 1 + k, F + .18); }
    if (candle) { const arc = new THREE.Mesh(new THREE.TorusGeometry(.95, .07, 6, 18, Math.PI), mat(0x5a3a1a)); arc.position.set(wx, wy - 1.25, F + .14); g.add(arc); for (let k = 0; k < 5; k++) { const a = Math.PI * (k + .5) / 5; box(.07, .3, .07, mat(0xf4f0e8), .02, g, wx + Math.cos(a) * .95, wy - 1.25 + Math.sin(a) * .95 + .15, F + .16); sphere(.07, glow(0xffd070, 2.5), g, wx + Math.cos(a) * .95, wy - 1.25 + Math.sin(a) * .95 + .36, F + .16, 6, 4); } } };
  window_(-w / 3.2, 3.9, true); window_(-w / 3.2, 9.4, false); window_(w / 3.2, 9.4, i % 2 === 0);
  // hastial y tejado
  const tri = new THREE.Shape(); tri.moveTo(-w / 2, 0); tri.lineTo(w / 2, 0); tri.lineTo(0, rise); tri.closePath();
  for (const s of [1, -1]) { const m = new THREE.Mesh(new THREE.ShapeGeometry(tri), plaster); m.position.set(0, h, s * (d / 2 + .02)); if (s < 0) m.rotation.y = Math.PI; g.add(m); }
  box(.4, rise - .4, .3, beam, .02, g, 0, h + (rise - .4) / 2, F); box(w * .55, .36, .3, beam, .02, g, 0, h + rise * .42, F);
  const rw = sphere(.6, win, g, 0, h + rise * .62, F - .02, 12, 8); rw.scale.z = .2; const rr = new THREE.Mesh(new THREE.TorusGeometry(.62, .1, 6, 16), beam); rr.position.set(0, h + rise * .62, F + .06); g.add(rr);
  const roofM = mat(0xffffff, { roughness: .85, map: rep(canvasTex(64, 64, (c, W, H) => { c.fillStyle = RF[i % RF.length]; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(0,0,0,.25)'; for (let y = 0; y < H; y += 8) { c.fillRect(0, y, W, 2); for (let xx = (y % 16) ? 0 : 6; xx < W; xx += 12) c.fillRect(xx, y, 2, 8); } }, true), 4, 4) });
  const L = Math.hypot(half, rise), a = Math.atan2(rise, half);
  for (const s of [-1, 1]) { const sl = box(L + .3, .5, d + 1.8, roofM, .05, g, s * half / 2, h + rise / 2, 0); sl.rotation.z = -s * a; const sn = box(L + .2, .34, d + 1.9, SNOW, .14, g, s * half / 2 + s * Math.sin(a) * .38, h + rise / 2 + Math.cos(a) * .38, 0); sn.rotation.z = -s * a; }
  box(1.5, 4.2, 1.5, stone, .05, g, -w * .22, h + rise - 1, -2.5); box(1.7, .5, 1.7, SNOW, .15, g, -w * .22, h + rise + 1.15, -2.5);
  // puerta (bisagra a la izquierda), vestíbulo encendido detrás, corona, timbre, escalones, farolillo
  const dx = w / 2 - 2.9;
  const hall = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.4), new THREE.MeshBasicMaterial({ map: hallTex, color: new THREE.Color(.95, .95, .95), toneMapped: false })); hall.position.set(dx, 2.6, F - .02); g.add(hall);
  for (const s of [-1, 1]) box(.42, 4.9, .4, beam, .02, g, dx + s * 1.5, 2.6, F + .06); box(3.4, .42, .4, beam, .02, g, dx, 5.05, F + .06);
  const door = new THREE.Group(); door.position.set(dx - 1.3, .4, F + .12); g.add(door);
  const dm = mat([0x7a1e1e, 0x1e4a32, 0x22346a, 0x5a3a1e, 0x4a2a5a][i % 5], { roughness: .45 }); box(2.6, 4.4, .22, dm, .06, door, 1.3, 2.2, 0); for (const yy of [1.2, 3.2]) box(1.9, 1.4, .08, dm, .04, door, 1.3, yy, .14);
  sphere(.13, gold(), door, 2.25, 2.0, .2); const wr = new THREE.Mesh(new THREE.TorusGeometry(.55, .2, 8, 20), mat(0x1e5a2a, { roughness: .9 })); wr.position.set(1.3, 3.25, .26); door.add(wr);
  for (let k = 0; k < 6; k++) { const aa = k / 6 * 6.283; sphere(.09, mat(0xd82a2a, { roughness: .3 }), door, 1.3 + Math.cos(aa) * .55, 3.25 + Math.sin(aa) * .55, .45, 6, 4); } box(.3, .22, .1, mat(0xd82a2a), .04, door, 1.3, 2.75, .42);
  const bell = new THREE.Group(); bell.position.set(dx + 2.05, 3.0, F + .12); g.add(bell); box(.42, .62, .12, gold(), .04, bell, 0, 0, 0); const btn = sphere(.12, glow(0xfff0c0, .8), bell, 0, -.05, .08, 8, 6);
  box(4, .4, 1.4, stone, .05, g, dx, .2, F + .8); box(3.4, .4, .9, stone, .05, g, dx, .5, F + .4); box(4, .1, 1.4, SNOW, .04, g, dx - .3, .43, F + 1.1);
  const lan = new THREE.Group(); lan.position.set(dx - 2.1, 4.4, F + .4); g.add(lan); box(.12, .12, .5, mat(0x1a1a1a), .02, lan, 0, 0, -.2); box(.5, .7, .5, glow(0xffd890, 1.4), .05, lan, 0, -.3, 0); box(.6, .1, .6, mat(0x1a1a1a), .02, lan, 0, .1, 0);
  // jardín: valla baja, setos nevados
  const fz = F + 3.1, fm = mat(0xf4f0e8, { roughness: .7 });
  for (let k = -w / 2; k <= w / 2; k += 1.05) { if (Math.abs(k - dx) < 1.4) continue; box(.22, 1.3, .16, fm, .04, g, k, .65, fz); } box(w, .16, .12, fm, .02, g, 0, 1.0, fz);
  for (const bx of [-w / 2 + 1.5, -w / 6]) { const b = sphere(1.0, mat(0x2a5a34, { roughness: .95 }), g, bx, .8, F + 1.6, 10, 8); b.scale.y = .8; const sb = sphere(.9, SNOW, g, bx, 1.25, F + 1.6, 10, 6); sb.scale.y = .45; }
  if (o.shop) { const sg = textPlane(7.6, 1.5, 560, 110, (c, W, H) => { c.fillStyle = '#2a1a10'; c.fillRect(0, 0, W, H); c.strokeStyle = '#e0b040'; c.lineWidth = 6; c.strokeRect(5, 5, W - 10, H - 10); txt(c, o.shop, W / 2, H / 2 + 4, 66, '#ffd76a'); }, .6); sg.position.set(-1.6, 6.0, F + .3); g.add(sg);
    const bz = new THREE.Mesh(new THREE.TorusGeometry(.7, .22, 8, 20), mat(0xb8702a, { roughness: .6 })); bz.position.set(-w / 2 - .2, 7.8, F + 1.6); bz.rotation.y = Math.PI / 2; g.add(bz); box(.1, .1, 1.8, mat(0x1a1a1a), .02, g, -w / 2 - .2, 8.8, F + 1.0); }
  // solar vacío
  const dirt = new THREE.Group(); root.add(dirt); const dg = new THREE.Mesh(new THREE.PlaneGeometry(w + 1.4, d + 1.4), mat(0xffffff, { roughness: 1, map: noiseTex('#4a3a2e', ['#3a2c22', '#5a483a', '#e8eef6', '#dfe6f0'], 1400, 4, 1) })); dg.rotation.x = -Math.PI / 2; dg.position.y = .07; dirt.add(dg);
  for (let k = 0; k < 4; k++) { const st = box(k % 2 ? w + 1 : .6, .35, k % 2 ? .6 : d + 1, stone, .05, dirt, k === 0 ? -w / 2 - .2 : k === 2 ? w / 2 + .2 : 0, .18, k === 1 ? d / 2 + .2 : k === 3 ? -d / 2 - .2 : 0); } dirt.visible = false;
  shade(root); hall.castShadow = false;
  const H = { root, g, door, dirt, win, bell, btn, F, dx, w, d, ry, x, z };
  H.at = (lx, ly, lz) => { root.updateMatrixWorld(true); return root.localToWorld(new THREE.Vector3(lx, ly, lz)); };
  H.front = (off = 2, side = 0) => H.at(dx + side, 0, F + off);
  return H;
}

// farola de hierro con farol y nieve encima
function farola(parent, x, z) { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const k = mat(0x1e2028, { metalness: .6, roughness: .4 });
  cyl(.32, .45, 1, k, 8, g, 0, .5, 0); cyl(.16, .2, 9.4, k, 8, g, 0, 5.2, 0); box(.9, .14, .9, k, .04, g, 0, 9.9, 0); const lamp = box(.86, 1.3, .86, glow(0xffe0a0, 1.6), .06, g, 0, 10.6, 0); const top = new THREE.Mesh(new THREE.ConeGeometry(.8, .8, 4), k); top.position.y = 11.6; top.rotation.y = Math.PI / 4; g.add(top);
  const sn = new THREE.Mesh(new THREE.ConeGeometry(.75, .35, 4), SNOW); sn.position.y = 11.95; sn.rotation.y = Math.PI / 4; g.add(sn); const r = new THREE.Mesh(new THREE.TorusGeometry(.5, .1, 6, 16), mat(0x1e5a2a)); r.position.set(0, 8.6, 0); r.rotation.x = Math.PI / 2; g.add(r); sphere(.14, mat(0xd82a2a), g, .5, 8.6, 0, 6, 4); return g; }
export function abeto(parent, x, z, s = 1, lights = false) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g); cyl(.4, .5, 2, mat(0x5a3a22), 8, g, 0, 1, 0);
  const lm = mat(0x1e5a32, { roughness: .95 }); for (let k = 0; k < 4; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(3.4 - k * .7, 3.2, 9), lm); c.position.y = 3 + k * 2; g.add(c); const sn = new THREE.Mesh(new THREE.ConeGeometry(2.6 - k * .6, 1.0, 9), SNOW); sn.position.y = 4.3 + k * 2; g.add(sn); }
  if (lights) { const r = RNG(x * 7 + z); const cols = [0xffd070, 0xff4a4a, 0x4ab8ff, 0xfff0d0, 0x7aff7a]; for (let k = 0; k < 40; k++) { const yy = 2.4 + r() * 7.4, rr = (3.3 - (yy - 2) * .38) * .92, aa = r() * 6.283; sphere(.14, glow(cols[k % 5], 2.4), g, Math.cos(aa) * rr, yy, Math.sin(aa) * rr, 6, 4); }
    const st = new THREE.Mesh(new THREE.OctahedronGeometry(.6), glow(0xffd23f, 2)); st.position.y = 11.3; g.add(st); }
  return g; }
function schneemann(parent, x, z, ry = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g); sphere(1.3, SNOW, g, 0, 1.1, 0, 14, 10); sphere(.95, SNOW, g, 0, 2.9, 0, 14, 10); sphere(.68, SNOW, g, 0, 4.3, 0, 14, 10);
  const n = new THREE.Mesh(new THREE.ConeGeometry(.12, .6, 8), mat(0xff7a1a)); n.rotation.x = Math.PI / 2; n.position.set(0, 4.3, .9); g.add(n); for (const s of [-1, 1]) sphere(.08, mat(0x111111), g, s * .24, 4.5, .6, 6, 4);
  cyl(.5, .5, .7, mat(0x1a1a1a), 12, g, 0, 5.05, 0); cyl(.75, .75, .08, mat(0x1a1a1a), 14, g, 0, 4.72, 0); const sc = new THREE.Mesh(new THREE.TorusGeometry(.62, .14, 6, 16), mat(0xd82a2a)); sc.rotation.x = Math.PI / 2; sc.position.y = 3.65; g.add(sc); return g; }

// coche pequeño y redondeado (de Kowalski), con nieve en el techo
export function auto(parent, x, z, ry = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g); const b = mat(0x2a8a9a, { metalness: .5, roughness: .25 }), gl = mat(0x9ac8e8, { metalness: .6, roughness: .1 }), ch = mat(0xd8dce4, { metalness: .9, roughness: .2 });
  box(4.2, 1.6, 8, b, .7, g, 0, 1.5, 0); box(3.6, 1.5, 4.2, b, .8, g, 0, 2.9, -.4); for (const s of [-1, 1]) box(.1, 1.0, 3.2, gl, .05, g, s * 1.82, 3.0, -.4); box(3.2, 1.0, .1, gl, .05, g, 0, 3.0, 1.75); box(3.2, 1.0, .1, gl, .05, g, 0, 3.0, -2.55);
  for (const [wx, wz] of [[-1.9, 2.6], [1.9, 2.6], [-1.9, -2.6], [1.9, -2.6]]) { const t = cyl(.85, .85, .6, mat(0x1a1a1a), 16, g, wx, .85, wz); t.rotation.z = Math.PI / 2; const hb = cyl(.42, .42, .64, ch, 12, g, wx, .85, wz); hb.rotation.z = Math.PI / 2; }
  for (const s of [-1, 1]) { const hl = cyl(.38, .38, .2, glow(0xfff4d0, .3), 14, g, s * 1.3, 1.7, 4.02); hl.rotation.x = Math.PI / 2; box(.6, .3, .1, glow(0xd82a2a, .4), .05, g, s * 1.4, 1.7, -4.02); }
  box(4.0, .4, .5, ch, .15, g, 0, 1.0, 4.1); box(4.0, .4, .5, ch, .15, g, 0, 1.0, -4.1); box(3.4, .4, 4.0, SNOW, .3, g, 0, 3.75, -.4); box(3.6, .3, 2.2, SNOW, .2, g, 0, 2.38, 2.8); return shade(g); }

// =====================================================================================================
// la Gasse: calle empedrada nevada con 12 casas por lado, aceras, farolas, guirnaldas, abeto en la plaza y la torre
// =====================================================================================================
export function gasse(scene) { const G = new THREE.Group(); scene.add(G);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(700, 900), mat(0xffffff, { roughness: .95, map: rep(sparkleSnow(), 60, 80) })); gr.rotation.x = -Math.PI / 2; gr.position.set(0, -.02, -200); gr.receiveShadow = true; G.add(gr);
  const cob = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#5a5e6c'; c.fillRect(0, 0, w, h); const r = RNG(8); for (let y = 0; y < h; y += 20) for (let x = (y / 20) % 2 ? 0 : 13; x < w; x += 26) { const v = 110 + r() * 40 | 0; c.fillStyle = `rgb(${v},${v + 4},${v + 16})`; c.beginPath(); c.roundRect(x + 2, y + 2, 22, 16, 5); c.fill(); }
    for (let i = 0; i < 70; i++) { c.fillStyle = 'rgba(240,246,255,.75)'; c.beginPath(); c.ellipse(r() * w, r() * h, 6 + r() * 26, 3 + r() * 10, r() * 3, 0, 7); c.fill(); } }, true); cob.repeat.set(3, 70);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 380), mat(0xffffff, { roughness: .8, map: cob })); road.rotation.x = -Math.PI / 2; road.position.set(0, .03, -150); road.receiveShadow = true; G.add(road);
  const side = mat(0xffffff, { roughness: .9, map: rep(tiles('#9aa0b0', '#7a8090', 4), 2, 90) });
  for (const s of [-1, 1]) { box(4, .3, 380, side, .02, G, s * 9, .15, -150); box(.4, .34, 380, mat(0x6a6e7a), .02, G, s * 7.1, .17, -150);
    for (let z = 30; z > -330; z -= 3.2) { const b = sphere(.9 + Math.sin(z * 1.7) * .25, SNOW, G, s * 7.6, .3, z, 8, 6); b.scale.set(.8, .55, 1.6); } }
  const L = [], R = []; for (let k = 0; k < 12; k++) { const z = 10 - k * 19; L.push(fachHaus(G, -20.6, z, k * 2, Math.PI / 2)); R.push(fachHaus(G, 20.6, z, k * 2 + 1, -Math.PI / 2, k === 1 ? { shop: 'BÄCKEREI' } : {})); }
  for (let k = 0; k < 12; k++) for (const s of [-1, 1]) { const z = .5 - k * 19; abeto(G, s * 22, z, .55 + (k % 3) * .1); }
  schneemann(G, -15.6, 3.6, Math.PI / 2 - .4); schneemann(G, 15.6, -48, -Math.PI / 2 + .3);
  const FAR = []; for (let z = 22; z > -300; z -= 24) for (const s of [-1, 1]) FAR.push(farola(G, s * 10.3, z + (s > 0 ? 12 : 0)));
  // guirnaldas cruzando la calle
  const GL = []; for (let z = 22; z > -260; z -= 24) { for (let k = 0; k <= 16; k++) { const u = k / 16, xx = lerp(-10.3, 10.3, u), yy = 9.6 - Math.sin(u * Math.PI) * 1.8; GL.push(sphere(.16, glow([0xffe0a0, 0xffd070, 0xfff4e0][k % 3], 2.6), G, xx, yy, z + u * 12, 6, 4)); } }
  // plaza con abeto grande y la torre del reloj
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(30, 32), mat(0xffffff, { roughness: .8, map: rep(cob.clone(), 6, 6) })); plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, .04, -262); G.add(plaza);
  const big = abeto(G, 0, -262, 2.1, true);
  const TW = rathausturm(scene, 0, -330); TW.g.scale.setScalar(.7); G.add(TW.g); TW.g.position.set(0, 0, -330);
  const car = auto(G, -9.3, -21.5, Math.PI);
  return { G: shade(G), L, R, FAR, GL, big, TW, car }; }

// =====================================================================================================
// interiores
// =====================================================================================================
// salón: sofá, árbol de Navidad, ventana con la calle nevada, jarrón (entero/roto), cesta del perro, estantería, lámpara
const outsideTex = (night = true) => canvasTex(512, 512, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, night ? '#0a1440' : '#8ab8ff'); g.addColorStop(1, night ? '#3a3a8a' : '#e8f0ff'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  const r = RNG(12); for (let i = 0; i < 9; i++) { const x = i * 64 - 20, hh = 180 + r() * 90; c.fillStyle = ['#e8d4b0', '#d8b8b0', '#c8d8c0', '#e0d0e8'][i % 4]; c.fillRect(x, h - hh, 60, hh); c.fillStyle = '#5a2a1a'; c.beginPath(); c.moveTo(x - 6, h - hh); c.lineTo(x + 30, h - hh - 50); c.lineTo(x + 66, h - hh); c.fill(); c.fillStyle = '#f4f8ff'; c.beginPath(); c.moveTo(x - 2, h - hh - 2); c.lineTo(x + 30, h - hh - 44); c.lineTo(x + 62, h - hh - 2); c.lineTo(x + 30, h - hh - 30); c.fill();
    c.fillStyle = '#ffc860'; for (let k = 0; k < 4; k++) c.fillRect(x + 8 + (k % 2) * 26, h - hh + 30 + Math.floor(k / 2) * 60, 16, 22); }
  c.fillStyle = '#f4f8ff'; c.fillRect(0, h - 40, w, 40); for (let i = 0; i < 220; i++) { c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(r() * w, r() * h * .9, 1 + r() * 2.4, 0, 7); c.fill(); } });
function fenster(parent, x, y, z, w, h, tex, ry = 0) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g); const fr = mat(0xf4f0e8, { roughness: .5 });
  const v = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: new THREE.Color(.8, .8, .85) })); g.add(v);
  for (const s of [-1, 1]) { box(.35, h + .5, .5, fr, .05, g, s * (w / 2 + .1), 0, .1); box(w + .6, .35, .5, fr, .05, g, 0, s * (h / 2 + .1), .1); } box(.2, h, .3, fr, 0, g, 0, 0, .1); box(w, .2, .3, fr, 0, g, 0, h * .15, .1);
  box(w + 1.4, .3, 1.2, fr, .05, g, 0, -h / 2 - .3, .5);
  const fro = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: canvasTex(256, 256, (c, W, H) => { const gg = c.createRadialGradient(W / 2, H / 2, W * .3, W / 2, H / 2, W * .75); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(1, 'rgba(235,245,255,.85)'); c.fillStyle = gg; c.fillRect(0, 0, W, H); }) })); fro.position.z = .05; g.add(fro);
  for (const s of [-1, 1]) { const cu = box(w * .3, h + 2.4, .3, mat(0xa8202a, { roughness: .95, map: rep(stripes('#a8202a', '#8a1a22', 10), 1, 1) }), .1, g, s * (w / 2 + .9), .4, .45); } box(w + 4, .2, .2, mat(0xc8a040, { metalness: .7 }), .05, g, 0, h / 2 + 1.4, .5); return g; }
export function wohnzimmer(scene, X) { const g = room(scene, X, 36, 28, 17, mat(0xffffff, { map: rep(wallpaper('#e8d8b8', '#d4bf98'), 7, 3) }), mat(0xffffff, { map: rep(plank(26), 5, 5) }));
  const W = fenster(g, -3, 8.2, -13.75, 9, 7, outsideTex());
  const sofa = new THREE.Group(); sofa.position.set(-4, 0, -6); g.add(sofa); const sm = mat(0x2a8a8a, { roughness: .9 }); box(13, 2.2, 4.6, sm, .5, sofa, 0, 1.6, 0); box(13, 3.6, 1.4, sm, .5, sofa, 0, 3.4, -1.7); for (const s of [-1, 1]) box(1.4, 3, 4.6, sm, .5, sofa, s * 6.3, 2.2, 0);
  for (const s of [-1, 0, 1]) box(3.6, 1.0, 3.6, mat(0x3aa0a0, { roughness: .95 }), .4, sofa, s * 4, 3.0, .2); box(2, 1.8, .7, mat(0xf2c23a, { roughness: .95 }), .3, sofa, -4.6, 3.8, -.8).rotation.z = .2; box(2, 1.8, .7, mat(0xd8323a, { roughness: .95, map: stripes('#d8323a', '#f4f0e8', 6) }), .3, sofa, 4.4, 3.8, -.8).rotation.z = -.2;
  const knit = box(5, .3, 3, mat(0xffffff, { roughness: 1, map: stripes('#e8e0d0', '#c8b898', 10) }), .1, sofa, 3, 2.8, .6); knit.rotation.y = .3;
  const rug = new THREE.Mesh(new THREE.CircleGeometry(7, 32), mat(0xffffff, { roughness: 1, map: canvasTex(256, 256, (c, w, h) => { for (let k = 0; k < 8; k++) { c.fillStyle = ['#b8322a', '#f4e8d0', '#2a5a7a', '#f2c23a'][k % 4]; c.beginPath(); c.arc(w / 2, h / 2, w / 2 - k * 15, 0, 7); c.fill(); } }) })); rug.rotation.x = -Math.PI / 2; rug.position.set(-3, .03, 1); g.add(rug);
  const tbl = new THREE.Group(); tbl.position.set(-3, 0, 1.5); g.add(tbl); box(6, .4, 3.4, mat(0x8a5a32, { roughness: .5 }), .1, tbl, 0, 2, 0); for (const [a, b] of [[-2.6, -1.4], [2.6, -1.4], [-2.6, 1.4], [2.6, 1.4]]) box(.3, 2, .3, mat(0x6a4222), .05, tbl, a, 1, b);
  cyl(1.0, .8, .14, mat(0xf4f4f4), 18, tbl, -1.2, 2.3, 0); for (let k = 0; k < 6; k++) { const ck = cyl(.3, .3, .1, mat(0xd8a050), 10, tbl, -1.2 + Math.cos(k) * .5, 2.42, Math.sin(k) * .5); } cyl(.25, .25, .9, mat(0xd82a2a), 10, tbl, 1.4, 2.65, 0); sphere(.12, glow(0xffc040, 3), tbl, 1.4, 3.25, 0, 6, 4);
  const tree = abeto(g, 11, -9, .78, true); for (let k = 0; k < 5; k++) box(1.4 + (k % 2) * .5, 1.1, 1.3, mat([0xd82a2a, 0x2a6ad8, 0xf2c23a, 0x2a9a5a, 0xd84ab8][k]), .1, g, 9 + k * 1.1, .55, -6.6 + (k % 2) * 1.3);
  const shelf = new THREE.Group(); shelf.position.set(-17.4, 0, 2); shelf.rotation.y = Math.PI / 2; g.add(shelf); box(8, 12, 1.6, mat(0x6a4222), .05, shelf, 0, 6, 0); for (let k = 0; k < 4; k++) { box(7.6, .2, 1.4, mat(0x8a5a32), 0, shelf, 0, 2 + k * 2.8, .1); for (let b = 0; b < 9; b++) box(.5, 1.6 + (b % 3) * .3, 1.1, mat([0xb83a2a, 0x2a5a8a, 0xe8c040, 0x3a8a4a, 0x8a3a8a][(b + k) % 5]), .03, shelf, -3.4 + b * .8, 2.95 + k * 2.8 + (b % 3) * .15, .1); }
  const lampe = new THREE.Group(); lampe.position.set(-13, 0, -9); g.add(lampe); cyl(.12, .12, 9, mat(0x2a2a2a, { metalness: .6 }), 8, lampe, 0, 4.5, 0); const sh = cyl(1.0, 1.5, 1.6, glow(0xffe0a8, .9), 16, lampe, 0, 9.4, 0);
  const LL = new THREE.PointLight(0xffc880, 140, 40, 1.4); LL.position.set(-13, 9, -8); g.add(LL); const TL = new THREE.PointLight(0xffb060, 60, 26, 1.5); TL.position.set(10, 7, -7); g.add(TL);
  for (let k = 0; k < 3; k++) { const pf = box(2.4, 3, .2, mat(0x6a4222), .05, g, 7 + k * 3.4, 10.6 + (k % 2) * .8, -13.7); const ph = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 2.5), mat(0xffffff, { map: canvasTex(64, 80, (c, w, h) => { c.fillStyle = ['#8ab8e8', '#e8c8a0', '#a8d8a0'][k]; c.fillRect(0, 0, w, h); c.fillStyle = '#b57a52'; c.fillRect(20 - k * 4, 30, 18, 18); c.fillRect(36, 34, 14, 14); c.fillStyle = '#2a1a10'; c.fillRect(18 - k * 4, 26, 22, 8); }) })); ph.position.set(7 + k * 3.4, 10.6 + (k % 2) * .8, -13.55); g.add(ph); }
  const korb = new THREE.Group(); korb.position.set(6, 0, -2); g.add(korb); const kb = cyl(2.2, 1.9, 1.1, mat(0xb8884a, { roughness: .9 }), 18, korb, 0, .55, 0); cyl(1.9, 1.9, .5, mat(0xd84a5a, { roughness: 1 }), 18, korb, 0, .9, 0);
  // jarrón sobre pedestal (entero) y en pedazos (roto)
  const VASE = new THREE.Group(); VASE.position.set(14.5, 0, 4); g.add(VASE); box(2, 4.2, 2, mat(0xf4f0e8), .1, VASE, 0, 2.1, 0);
  const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push(new THREE.Vector2(.5 + Math.sin(t * Math.PI) * .75 - t * .2, t * 2.6)); } const vm = mat(0xffffff, { roughness: .2, map: canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#f4f8ff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a4aa8'; c.lineWidth = 6; for (let y = 20; y < h; y += 36) { c.beginPath(); for (let x = 0; x <= w; x += 8) c.lineTo(x, y + Math.sin(x * .1) * 8); c.stroke(); } c.fillStyle = '#2a4aa8'; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(16 + k * 26, 64, 8, 0, 7); c.fill(); } }) });
  const vase = new THREE.Mesh(new THREE.LatheGeometry(pts, 22), vm); vase.position.y = 4.2; VASE.add(vase); for (let k = 0; k < 5; k++) { cyl(.04, .04, 1.6, mat(0x2a6a2a), 4, VASE, Math.cos(k * 1.3) * .25, 7.4, Math.sin(k * 1.3) * .25); sphere(.25, mat([0xff4a6a, 0xffd23f, 0xff8ad0, 0xffffff, 0xd82a2a][k]), VASE, Math.cos(k * 1.3) * .35, 8.2, Math.sin(k * 1.3) * .35, 8, 6); }
  const SHARDS = new THREE.Group(); SHARDS.position.set(13, .05, 6.2); g.add(SHARDS); const sr = RNG(4); for (let k = 0; k < 11; k++) { const s = box(.3 + sr() * .6, .08, .2 + sr() * .5, vm, .02, SHARDS, (sr() - .5) * 4, .06, (sr() - .5) * 3); s.rotation.y = sr() * 3; } for (let k = 0; k < 4; k++) sphere(.25, mat([0xff4a6a, 0xffd23f, 0xff8ad0, 0xffffff][k]), SHARDS, -1 + k * .7, .2, 1 + (k % 2) * .4, 8, 6);
  const ball = sphere(.7, mat(0xffffff, { map: stripes('#d82a2a', '#ffffff', 6, false) }), g, 10.5, .7, 8, 14, 10); SHARDS.add(ball); ball.position.set(-3.5, .65, 2.2);
  return { g: shade(g), W, sofa, tree, VASE, SHARDS, korb, LL, TL }; }

// cocina: armarios, nevera con dibujos, mesa con el cuaderno de deberes en blanco
export function kueche(scene, X) { const g = room(scene, X, 30, 24, 16, mat(0xffffff, { map: rep(tiles('#f4f0e0', '#d8d0b8', 6), 6, 4) }), mat(0xffffff, { map: rep(tiles('#c84a3a', '#f4e8d8', 4), 6, 5) }));
  const cab = mat(0x6aa8a0, { roughness: .5 }); for (let k = 0; k < 5; k++) { box(3.6, 6, 3, cab, .1, g, -10 + k * 3.8, 3, -10.4); box(3.4, 3.5, 1.6, cab, .1, g, -10 + k * 3.8, 12, -11.1); sphere(.15, mat(0xd8dce4, { metalness: .9 }), g, -10 + k * 3.8 + 1.2, 4.6, -8.85, 8, 6); } box(19.6, .3, 3.2, mat(0xe8e0d0, { roughness: .3 }), .05, g, -2.4, 6.15, -10.4);
  const fr = box(4.4, 11, 3.6, mat(0xf4f4f8, { roughness: .3 }), .3, g, 11.5, 5.5, -10); for (let k = 0; k < 4; k++) { const d = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.2), mat(0xffffff, { map: canvasTex(64, 52, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.strokeStyle = ['#d82a2a', '#2a6ad8', '#2a9a4a', '#f2a01a'][k]; c.lineWidth = 4; c.beginPath(); c.arc(32, 24, 14, 0, 7); c.stroke(); c.beginPath(); c.moveTo(10, 46); c.lineTo(54, 46); c.stroke(); }) })); d.position.set(10.4 + (k % 2) * 1.8, 6.5 + Math.floor(k / 2) * 1.6, -8.15); d.rotation.z = (k - 1.5) * .08; g.add(d); }
  fenster(g, -2, 10, -11.75, 6, 4.4, outsideTex());
  const T = new THREE.Group(); T.position.set(0, 0, 1); g.add(T); box(10, .4, 6, mat(0xd8b080, { roughness: .5, map: rep(plank(32), 2, 1) }), .1, T, 0, 3.4, 0); for (const [a, b] of [[-4.4, -2.4], [4.4, -2.4], [-4.4, 2.4], [4.4, 2.4]]) box(.4, 3.4, .4, mat(0xa87a4a), .05, T, a, 1.7, b);
  const chairs = []; for (const s of [-1, 1]) { const c = new THREE.Group(); c.position.set(s * 3, 0, s * 4.4); c.rotation.y = s > 0 ? Math.PI : 0; T.add(c); box(2.6, .3, 2.6, mat(0xa87a4a), .05, c, 0, 2.2, 0); box(2.6, 3, .3, mat(0xa87a4a), .05, c, 0, 3.7, -1.2); for (const [a, b] of [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]]) box(.25, 2.2, .25, mat(0x8a5a32), .03, c, a, 1.1, b); chairs.push(c); }
  const book = new THREE.Group(); book.position.set(-1, 3.62, 1.6); T.add(book); for (const s of [-1, 1]) { const p = box(1.6, .06, 2.2, mat(0xffffff, { map: canvasTex(64, 88, (c, w, h) => { c.fillStyle = '#fbfbf4'; c.fillRect(0, 0, w, h); c.strokeStyle = '#a8c8e8'; for (let y = 10; y < h; y += 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } }) }), .02, book, s * .82, 0, 0); p.rotation.z = -s * .06; } box(3.4, .04, 2.4, mat(0x2a6ad8), .02, book, 0, -.06, 0);
  const pen = cyl(.06, .06, 1.6, mat(0xffd23f), 6, book, 1.8, .1, .3); pen.rotation.z = Math.PI / 2; pen.rotation.y = .5;
  cyl(.6, .45, 1.0, mat(0xffffff), 12, T, 3, 4.1, -.8); cyl(.5, .5, .1, mat(0x6a3a1a), 12, T, 3, 4.55, -.8);
  const KL = new THREE.PointLight(0xfff0d8, 120, 40, 1.4); KL.position.set(0, 13, 2); g.add(KL); const pend = cyl(1.4, .4, 1.0, mat(0xd82a2a, { roughness: .4 }), 16, g, 0, 13.4, 1); cyl(.05, .05, 2.6, mat(0x1a1a1a), 4, g, 0, 15, 1);
  return { g: shade(g), T, book, chairs }; }

// comedor de Navidad: mesa larga con mantel rojo, ganso (quemado), lombarda, Knödel, velas, corona de Adviento, lámpara de araña
export function esszimmer(scene, X) { const g = room(scene, X, 36, 28, 17, mat(0xffffff, { map: rep(wallpaper('#2a5a44', '#24503c', 1), 7, 3) }), mat(0xffffff, { map: rep(plank(22), 5, 5) }));
  box(36, 4, .5, mat(0x5a3a22), .02, g, 0, 2, -13.7); fenster(g, 9, 9, -13.75, 6, 6, outsideTex());
  const T = new THREE.Group(); T.position.set(0, 0, 0); g.add(T); box(8, .4, 16, mat(0x8a5a32), .1, T, 0, 3.4, 0); box(8.6, .2, 16.6, mat(0xb8202a, { roughness: .9 }), .05, T, 0, 3.66, 0); for (const s of [-1, 1]) box(.12, 1.2, 16.6, mat(0xb8202a, { roughness: .9 }), .03, T, s * 4.3, 3.1, 0); box(2, .22, 16.6, mat(0xe0b040, { metalness: .5, roughness: .4 }), .03, T, 0, 3.78, 0);
  for (const [a, b] of [[-3.4, -7], [3.4, -7], [-3.4, 7], [3.4, 7]]) box(.5, 3.4, .5, mat(0x6a4222), .05, T, a, 1.7, b);
  const plates = []; for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) { const p = cyl(.9, .8, .1, mat(0xf8f8f8, { roughness: .3 }), 18, T, s * 2.6, 3.86, k * 4.5); plates.push(p); cyl(.08, .08, .9, mat(0xd8dce4, { metalness: .9 }), 4, T, s * 2.6 + .9, 3.86, k * 4.5).rotation.x = Math.PI / 2; const gl = cyl(.3, .22, .9, mat(0xdff0ff, { transparent: true, opacity: .5, roughness: .05 }), 10, T, s * 2.0, 4.3, k * 4.5 - 1.0); }
  const gans = new THREE.Group(); gans.position.set(0, 3.9, 0); T.add(gans); cyl(1.9, 1.7, .2, mat(0xe8e8e8, { metalness: .6 }), 22, gans, 0, 0, 0); const gb = sphere(1.4, mat(0x3a2414, { roughness: .9, map: noiseTex('#3a2414', ['#1a0e08', '#5a3418', '#120804'], 900, 4, 1) }), gans, 0, .8, 0, 18, 12); gb.scale.set(1, .7, 1.3); for (const s of [-1, 1]) { const lg = sphere(.45, mat(0x2a1a0c), gans, s * .9, .6, 1.1, 10, 8); lg.scale.set(.8, .7, 1.2); cyl(.08, .08, .5, mat(0xffffff), 6, gans, s * 1.0, .7, 1.6).rotation.x = Math.PI / 2; }
  const SMK = []; for (let k = 0; k < 6; k++) { const s = sphere(.35, new THREE.MeshStandardMaterial({ color: 0x4a4a4a, transparent: true, opacity: .4, depthWrite: false }), gans, 0, 1.8, 0, 8, 6); SMK.push(s); } gans.userData.smk = SMK;
  const kohl = new THREE.Group(); kohl.position.set(-1.8, 3.9, -3.6); T.add(kohl); cyl(.9, .6, .7, mat(0xffffff), 16, kohl, 0, .35, 0); const kh = sphere(.75, mat(0x6a1a5a, { roughness: .9 }), kohl, 0, .7, 0, 12, 8); kh.scale.y = .5;
  const kn = new THREE.Group(); kn.position.set(1.8, 3.9, 3.6); T.add(kn); cyl(.9, .6, .6, mat(0xffffff), 16, kn, 0, .3, 0); for (let k = 0; k < 4; k++) sphere(.36, mat(0xf0e0b8, { roughness: .9 }), kn, Math.cos(k * 1.57) * .38, .82, Math.sin(k * 1.57) * .38, 10, 8);
  const kranz = new THREE.Group(); kranz.position.set(0, 3.9, -6.2); T.add(kranz); const kr = new THREE.Mesh(new THREE.TorusGeometry(1.1, .32, 8, 22), mat(0x1e5a2a, { roughness: .95 })); kr.rotation.x = Math.PI / 2; kranz.add(kr);
  for (let k = 0; k < 4; k++) { const aa = k * 1.57 + .7; cyl(.15, .15, .9, mat(0xd82a2a), 8, kranz, Math.cos(aa) * 1.1, .55, Math.sin(aa) * 1.1); const fl = sphere(.1, glow(0xffc040, 3), kranz, Math.cos(aa) * 1.1, 1.1, Math.sin(aa) * 1.1, 6, 4); fl.scale.y = 1.6; }
  for (const z of [-3, 3]) { cyl(.18, .24, .2, gold(), 8, T, 0, 3.9, z); cyl(.12, .12, 1.4, mat(0xf4f0e0), 8, T, 0, 4.7, z); const fl = sphere(.11, glow(0xffc040, 3), T, 0, 5.55, z, 6, 4); fl.scale.y = 1.6; }
  const seats = []; for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) { const c = new THREE.Group(); c.position.set(s * 5.4, 0, k * 4.5); c.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(c); box(2.6, .3, 2.6, mat(0x5a3a22), .05, c, 0, 2.2, 0); box(2.6, 3.6, .3, mat(0x5a3a22), .05, c, 0, 4, -1.2); seats.push(c); }
  const lus = new THREE.Group(); lus.position.set(0, 14, 0); g.add(lus); cyl(.05, .05, 3, mat(0xc8a040), 4, lus, 0, 1.5, 0); const rr = new THREE.Mesh(new THREE.TorusGeometry(2.2, .12, 6, 24), gold()); rr.rotation.x = Math.PI / 2; lus.add(rr); for (let k = 0; k < 8; k++) { const aa = k / 8 * 6.283; sphere(.2, glow(0xffe0a0, 2.4), lus, Math.cos(aa) * 2.2, .3, Math.sin(aa) * 2.2, 8, 6); }
  const EL = new THREE.PointLight(0xffc888, 160, 44, 1.4); EL.position.set(0, 12, 0); g.add(EL);
  const sb = box(10, 4.6, 2.4, mat(0x6a4222), .1, g, -10, 2.3, -12.4); for (let k = 0; k < 3; k++) cyl(.6, .5, 1.8, mat([0xd82a2a, 0xf4f0e8, 0x2a6a4a][k]), 10, g, -13 + k * 2.6, 5.5, -12.4);
  return { g: shade(g), T, gans, seats }; }

// cuarto del niño: cama con manta de perritos, escritorio, pósters de perros, lucecita de estrella
const dogPoster = (k) => canvasTex(128, 170, (c, w, h) => { c.fillStyle = ['#ffd23f', '#8ad8ff', '#ff9ac0', '#a8f0a0'][k]; c.fillRect(0, 0, w, h); c.fillStyle = ['#c87a3a', '#2a1a10', '#f4e8d0', '#8a5a2a'][k]; c.beginPath(); c.roundRect(24, 50, 80, 64, 18); c.fill(); c.beginPath(); c.roundRect(10, 40, 28, 52, 12); c.fill(); c.beginPath(); c.roundRect(90, 40, 28, 52, 12); c.fill();
  c.fillStyle = '#111'; c.beginPath(); c.arc(50, 76, 6, 0, 7); c.fill(); c.beginPath(); c.arc(78, 76, 6, 0, 7); c.fill(); c.beginPath(); c.ellipse(64, 94, 10, 7, 0, 0, 7); c.fill(); c.fillStyle = '#ff6f8a'; c.beginPath(); c.ellipse(64, 108, 7, 9, 0, 0, 7); c.fill(); txt(c, ['HUND!', 'WUFF', 'BITTE', '♥'][k], w / 2, 146, 28, '#1a1a1a'); });
export function kinderzimmer(scene, X) { const g = room(scene, X, 30, 24, 16, mat(0xffffff, { map: rep(stripes('#bfe0f8', '#a8d0f0', 12), 5, 1) }), mat(0xffffff, { map: rep(plank(34), 4, 4) }), 0x1e2a5a);
  const bed = new THREE.Group(); bed.position.set(-5, 0, -4); g.add(bed); box(7, 2, 12, mat(0x8a5a32), .2, bed, 0, 1, 0); box(7, 4.6, .6, mat(0x8a5a32), .2, bed, 0, 2.6, -6); box(6.6, 1.2, 11.4, mat(0xf4f4f4, { roughness: 1 }), .3, bed, 0, 2.6, 0);
  const blanket = box(6.9, .6, 8, mat(0xffffff, { roughness: 1, map: canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#ff9a3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffcf8a'; for (let y = 8; y < h; y += 32) for (let x = (y / 32) % 2 ? 24 : 8; x < w; x += 32) { c.beginPath(); c.arc(x, y + 8, 7, 0, 7); c.fill(); for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(x - 8 + k * 5.3, y - 1, 3, 0, 7); c.fill(); } } }, true) }), .3, bed, 0, 3.3, 1.8);
  const pil = box(4, 1, 2.2, mat(0xffffff, { roughness: 1 }), .45, bed, 0, 3.6, -4.4);
  const desk = new THREE.Group(); desk.position.set(8, 0, -9); g.add(desk); box(8, .4, 4, mat(0xf4f0e8), .05, desk, 0, 4, 0); for (const s of [-1, 1]) box(.4, 4, 3.6, mat(0xf4f0e8), .05, desk, s * 3.7, 2, 0); const dl = new THREE.Group(); dl.position.set(2.6, 4.2, -.8); desk.add(dl); cyl(.6, .6, .2, mat(0x2a6ad8), 12, dl, 0, 0, 0); cyl(.08, .08, 2.6, mat(0x2a6ad8), 6, dl, 0, 1.3, 0); const hd = cyl(.3, .8, .9, mat(0x2a6ad8), 12, dl, -.5, 2.6, .2); hd.rotation.z = .6;
  for (let k = 0; k < 4; k++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.4), mat(0xffffff, { map: dogPoster(k) })); p.position.set(-12 + k * 4.2 + (k > 1 ? 9 : 0), 10 + (k % 2) * .6, -11.75); p.rotation.z = (k - 1.5) * .05; g.add(p); }
  fenster(g, 4, 10.5, -11.75, 5, 4, outsideTex());
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(.6), glow(0xffe07a, 2)); star.position.set(-11, 7, -11.4); g.add(star);
  for (let k = 0; k < 4; k++) box(1.4, 1.4, 1.4, mat([0xd82a2a, 0x2a9a4a, 0x2a6ad8, 0xf2c23a][k]), .15, g, 10 + (k % 2) * 1.5, .7 + Math.floor(k / 2) * 1.4, 4 + (k % 2) * .4);
  const ZL = new THREE.PointLight(0xffe0b0, 90, 36, 1.4); ZL.position.set(2, 12, 2); g.add(ZL); const NL = new THREE.PointLight(0x7aa0ff, 0, 30, 1.4); NL.position.set(-4, 8, 4); g.add(NL);
  return { g: shade(g), bed, blanket, desk, ZL, NL }; }

// baño de Kowalski: azulejos, lavabo, espejo (detrás, una copia del baño donde está "el reflejo")
export function bad(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g); const tl = mat(0xffffff, { map: rep(tiles('#7ad0d0', '#58b0b0', 6), 4, 3) }), fl = mat(0xffffff, { map: rep(tiles('#f4f0e8', '#c8c0b0', 4), 4, 4) });
  box(26, .4, 30, fl, 0, g, 0, -.2, 0); for (const s of [-1, 1]) box(.4, 15, 30, tl, 0, g, s * 13, 7.5, 0); box(26, .4, 30, mat(0xf4f4f4), 0, g, 0, 15, 0);
  // pared del espejo en z=-4 con hueco (8 x 7) a 5.5..12.5
  const MW = 8, MY0 = 4.0, MY1 = 11.0; box((26 - MW) / 2, 15, .4, tl, 0, g, -(MW / 2 + (26 - MW) / 4), 7.5, -4); box((26 - MW) / 2, 15, .4, tl, 0, g, MW / 2 + (26 - MW) / 4, 7.5, -4); box(MW, MY0, .4, tl, 0, g, 0, MY0 / 2, -4); box(MW, 15 - MY1, .4, tl, 0, g, 0, (15 + MY1) / 2, -4);
  box(26, 15, .4, tl, 0, g, 0, 7.5, -15);   // fondo del "reflejo"
  const fr = mat(0xe0b040, { metalness: .7, roughness: .3 }); for (const s of [-1, 1]) { box(.4, MY1 - MY0 + .8, .5, fr, .05, g, s * (MW / 2 + .2), (MY0 + MY1) / 2, -3.7); box(MW + .8, .4, .5, fr, .05, g, 0, s > 0 ? MY1 + .2 : MY0 - .2, -3.7); }
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(MW, MY1 - MY0), new THREE.MeshStandardMaterial({ color: 0xcfe8ff, transparent: true, opacity: .14, roughness: .05, metalness: .3, depthWrite: false })); glass.position.set(0, (MY0 + MY1) / 2, -3.8); g.add(glass);
  for (const zz of [-2.4, -5.6]) { const sk = new THREE.Group(); sk.position.set(0, 0, zz); if (zz < -4) sk.rotation.y = Math.PI; g.add(sk); box(5, .8, 2.6, mat(0xf8f8f8, { roughness: .2 }), .3, sk, 0, 3.2, .3); cyl(.25, .4, 2.8, mat(0xf8f8f8), 10, sk, 0, 1.4, .3); const tap = cyl(.1, .1, .8, mat(0xd8dce4, { metalness: .9 }), 6, sk, 0, 3.9, -.6); cyl(.3, .25, .9, mat(0x6ad8a0), 10, sk, 1.8, 4.0, -.3); const brush = cyl(.06, .06, 1.0, mat(0xff4a6a), 4, sk, 1.8, 4.6, -.3); }
  for (const zz of [3, -11]) { const t = new THREE.Group(); t.position.set(-10, 0, zz); g.add(t); box(3, 4, 7, mat(0xf8f8f8, { roughness: .2 }), .5, t, 0, 2, 0); }
  const towel = box(.3, 3.6, 2.4, mat(0xffffff, { roughness: 1, map: stripes('#ff9a3a', '#ffffff', 6, false) }), .1, g, 12.7, 7, 6);
  const BL = new THREE.PointLight(0xfff4e8, 110, 40, 1.4); BL.position.set(0, 13, 4); g.add(BL); const BL2 = new THREE.PointLight(0xfff4e8, 70, 30, 1.4); BL2.position.set(0, 13, -10); g.add(BL2);
  const cal = textPlane(2.4, 3, 240, 300, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d82a2a'; c.fillRect(0, 0, w, 80); txt(c, 'JULI', w / 2, 44, 52, '#ffffff'); c.fillStyle = '#1a1a1a'; for (let k = 0; k < 28; k++) txt(c, '' + (k + 1), 26 + (k % 7) * 31, 110 + Math.floor(k / 7) * 42, 22, '#1a1a1a'); }, .2); cal.position.set(9, 9.5, -3.75); g.add(cal);
  return { g: shade(g), glass, cal }; }

// =====================================================================================================
// atrezo
// =====================================================================================================
// maletín negro del Coleccionista: tapa con bisagra, esquinas y cierres dorados, interior con remolino violeta y luz
const swirl = canvasTex(256, 256, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); g.addColorStop(0, '#ffffff'); g.addColorStop(.25, '#d08aff'); g.addColorStop(.7, '#5a1a9a'); g.addColorStop(1, '#14061e'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.strokeStyle = 'rgba(255,220,255,.6)'; c.lineWidth = 5; for (let k = 0; k < 5; k++) { c.beginPath(); for (let t = 0; t < 1; t += .02) { const a = t * 9 + k * 1.256, r = t * w * .5; c.lineTo(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r); } c.stroke(); } });
export function koffer(scene) { const g = new THREE.Group(); scene.add(g); const lea = mat(0x16141a, { roughness: .45, map: noiseTex('#16141a', ['#0e0c10', '#24202a'], 700, 2, 1) }), gd = gold();
  const body = new THREE.Group(); g.add(body); body.position.y = -2.0;   // origen = asa (para colgar de la mano)
  box(3.4, 1.15, 1.1, lea, .12, body, 0, .58, 0); for (const [x, z] of [[-1.62, .5], [1.62, .5], [-1.62, -.5], [1.62, -.5]]) box(.28, .5, .28, gd, .06, body, x, .2, z);
  const lid = new THREE.Group(); lid.position.set(0, 1.15, -.55); body.add(lid); box(3.4, 1.0, 1.1, lea, .12, lid, 0, .5, .55); for (const [x, z] of [[-1.62, 1.05], [1.62, 1.05], [-1.62, .05], [1.62, .05]]) box(.28, .5, .28, gd, .06, lid, x, .65, z);
  for (const s of [-1, 1]) { box(.4, .5, .12, gd, .05, body, s * .9, 1.12, .58); }
  const handle = new THREE.Mesh(new THREE.TorusGeometry(.5, .1, 8, 18, Math.PI), lea); handle.position.set(0, 1.0, .55); lid.add(handle); for (const s of [-1, 1]) box(.24, .2, .3, gd, .05, lid, s * .5, 1.02, .55);
  const glowP = new THREE.Mesh(new THREE.PlaneGeometry(3.1, .9), new THREE.MeshBasicMaterial({ map: swirl, toneMapped: false, color: new THREE.Color(1.6, 1.4, 1.8) })); glowP.rotation.x = -Math.PI / 2; glowP.position.set(0, 1.13, 0); body.add(glowP);
  const L = new THREE.PointLight(0xc070ff, 0, 18, 1.6); L.position.set(0, 2.2, .6); body.add(L);
  return { g, body, lid, glowP, L, open(k) { lid.rotation.x = -k * 1.9; glowP.visible = k > .02; L.intensity = k * 60; } }; }
export function geige(scene) { const g = new THREE.Group(); scene.add(g); const wd = mat(0xb8601a, { roughness: .35 }), dk = mat(0x1a1210);
  const b1 = sphere(.9, wd, g, 0, -.7, 0, 18, 12); b1.scale.set(1, 1, .3); const b2 = sphere(.72, wd, g, 0, .5, 0, 18, 12); b2.scale.set(1, 1, .3); box(.5, .5, .26, wd, .1, g, 0, -.1, 0);
  box(.22, 2, .16, dk, .04, g, 0, 1.7, .1); const sc = new THREE.Mesh(new THREE.TorusGeometry(.14, .06, 6, 12), dk); sc.position.set(0, 2.8, .1); sc.rotation.y = Math.PI / 2; g.add(sc); box(.6, .14, .14, dk, .03, g, 0, -1.3, .2);
  for (let k = 0; k < 4; k++) box(.02, 3.2, .02, mat(0xe8e8e8), 0, g, -.09 + k * .06, .6, .3); for (const s of [-1, 1]) { const f = box(.06, .5, .02, dk, 0, g, s * .35, -.3, .28); f.rotation.z = s * .2; }
  const bow = new THREE.Group(); g.add(bow); bow.position.set(.6, -.2, .5); box(.08, 4, .08, mat(0x5a2a10), .02, bow, 0, 0, 0); box(.03, 3.8, .03, mat(0xf4f0e0), 0, bow, .1, 0, 0); g.userData.bow = bow; return shade(g); }
// correa roja con collar vacío (Kowalski se queda con ella)
export function leine(scene) { const g = new THREE.Group(); scene.add(g); const m = mat(0xd82a3a, { roughness: .5 });
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(.2, -1.4, .3), new THREE.Vector3(.1, -2.8, .6), new THREE.Vector3(.4, -3.8, .5)]); const t = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, .08, 6), m); g.add(t);
  const loop = new THREE.Mesh(new THREE.TorusGeometry(.3, .08, 6, 14), m); loop.position.set(0, .2, 0); g.add(loop); const col = new THREE.Mesh(new THREE.TorusGeometry(.42, .1, 6, 16), m); col.position.set(.4, -4.2, .5); g.add(col); const tag = cyl(.14, .14, .04, gold(), 10, g, .4, -4.68, .5); tag.rotation.x = Math.PI / 2; return shade(g); }
export function partyHat(col = '#ff4a8a', col2 = '#ffd23f') { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.ConeGeometry(.45, 1.3, 14), mat(0xffffff, { map: stripes(col, col2, 6) })); c.position.y = .65; g.add(c); sphere(.16, mat(0xffffff), g, 0, 1.32, 0, 8, 6); return g; }
export function schild(scene, a, b) { const g = new THREE.Group(); scene.add(g); const p = textPlane(3.6, 2.6, 360, 260, (c, w, h) => { c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d82a3a'; c.lineWidth = 12; c.strokeRect(6, 6, w - 12, h - 12); txt(c, a, w / 2, 96, 86, '#d82a3a'); txt(c, b, w / 2, 190, 44, '#1d2238'); }, .15); g.add(p); cyl(.08, .08, 3, mat(0x8a5a34), 6, g, 0, -2.6, -.05); return g; }

// =====================================================================================================
// perros: 'krumel' (cachorro crema con manchas marrones, collar rojo) y 'dackel' (Bruno: largo y bajito, rojizo)
// =====================================================================================================
export function hund(scene, kind = 'krumel') { const g = new THREE.Group(); scene.add(g); const D = kind === 'dackel';
  const f = mat(D ? 0x9a4a1e : 0xf4e2c0, { roughness: .9 }), p = mat(D ? 0x6a2a10 : 0x9a5a2a, { roughness: .9 }), nose = mat(0x111111, { roughness: .3 });
  const body = new THREE.Group(); body.position.y = D ? 1.15 : 1.5; g.add(body); box(D ? 1.2 : 1.5, D ? 1.05 : 1.3, D ? 3.8 : 2.0, f, .45, body, 0, 0, 0); if (!D) { box(.9, .6, .9, p, .3, body, .4, .5, -.4); }
  const head = new THREE.Group(); head.position.set(0, D ? .7 : 1.1, D ? 2.0 : 1.1); body.add(head); box(D ? 1.1 : 1.5, D ? 1.1 : 1.35, D ? 1.2 : 1.3, f, .45, head, 0, 0, 0);
  const snout = box(D ? .7 : .8, .5, D ? 1.0 : .6, f, .2, head, 0, -.2, D ? .9 : .75); sphere(.16, nose, head, 0, -.04, D ? 1.42 : 1.08, 8, 6);
  const jaw = new THREE.Group(); jaw.position.set(0, -.42, D ? .5 : .5); head.add(jaw); box(D ? .6 : .7, .2, D ? .9 : .6, f, .08, jaw, 0, 0, .3); const tongue = box(.3, .06, .5, mat(0xff6f8a), .03, jaw, 0, .12, .45);
  const eyeM = mat(0x140c08, { roughness: .1 }); for (const s of [-1, 1]) { sphere(.15, eyeM, head, s * .36, .22, D ? .62 : .66, 8, 6); sphere(.05, mat(0xffffff), head, s * .36 + .05, .28, D ? .76 : .8, 6, 4); const ear = box(D ? .32 : .36, D ? 1.1 : .8, D ? .6 : .55, D ? p : (s > 0 ? p : f), .14, head, s * (D ? .66 : .82), D ? -.25 : .05, 0); ear.rotation.z = s * .18; if (!D && s < 0) { const e2 = box(.4, .5, .5, p, .12, head, -.4, .5, .2); } }
  const col = box(D ? 1.0 : 1.3, .22, D ? .5 : .6, mat(0xd82a3a), .08, head, 0, -.6, -.3); const tag = cyl(.15, .15, .05, gold(), 10, head, 0, -.86, -.0); tag.rotation.x = Math.PI / 2;
  const legs = []; const LP = D ? [[-.42, 1.3], [.42, 1.3], [-.42, -1.4], [.42, -1.4]] : [[-.5, .65], [.5, .65], [-.5, -.65], [.5, -.65]];
  for (const [x, z] of LP) { const l = new THREE.Group(); l.position.set(x, body.position.y - .35, z); g.add(l); box(D ? .34 : .44, D ? .8 : 1.15, D ? .4 : .46, f, .14, l, 0, D ? -.4 : -.57, 0); box(D ? .38 : .48, .2, D ? .5 : .56, mat(D ? 0x6a2a10 : 0xffffff), .08, l, 0, D ? -.78 : -1.08, .06); legs.push(l); }
  const tail = new THREE.Group(); tail.position.set(0, body.position.y + .35, D ? -1.9 : -1.0); g.add(tail); const tm = box(.24, .24, D ? 1.3 : .8, f, .1, tail, 0, .2, -.4); tm.rotation.x = .7;
  const hat = partyHat(); hat.position.set(.2, .7, 0); hat.rotation.z = -.2; head.add(hat); hat.visible = false;
  const dog = { root: g, body, head, jaw, tongue, legs, tail, hat, kind };
  dog.pose = (T, o = {}) => { const w = o.walk ?? 0, ph = T * (o.run ? 14 : 8); legs.forEach((l, i) => { l.rotation.x = w * Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * .6; });
    tail.rotation.y = Math.sin(T * (o.wag ?? 18)) * .7; jaw.rotation.x = o.bark ? Math.max(0, Math.sin(T * 16)) * .55 : (o.open ?? 0); tongue.visible = !!(o.tongue ?? true);
    head.rotation.set(o.headX ?? Math.sin(T * 3) * .05, o.headY ?? 0, o.headZ ?? 0); body.position.y = (D ? 1.15 : 1.5) + (o.hop ? Math.abs(Math.sin(T * 7)) * .8 : 0) + w * Math.abs(Math.sin(ph)) * .08; };
  dog.pose(0); return shade(dog.root) && dog; }

// fuegos artificiales: N cohetes que estallan en bolas de partículas de colores
export function feuerwerk(scene, n = 6) { const P = 70, geo = new THREE.BufferGeometry(), pos = new Float32Array(n * P * 3), col = new Float32Array(n * P * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dot = canvasTex(32, 32, (c, w, h) => { const g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.4, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const m = new THREE.PointsMaterial({ size: 2.4, map: dot, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }); const pts = new THREE.Points(geo, m); pts.frustumCulled = false; scene.add(pts);
  const C = [[1, .35, .5], [1, .85, .3], [.4, .8, 1], [.5, 1, .5], [1, .6, 1], [1, 1, 1]];
  return { pts, update(T, c, spread = 120, h = 90) { for (let b = 0; b < n; b++) { const r = RNG(b * 13 + 5), per = 2.2 + r() * .8, t = ((T + b * .53) % per) / per, cx = c.x + (r() - .5) * spread, cy = c.y + h + r() * 40, cz = c.z + (r() - .5) * 30, cc = C[b % C.length];
      for (let k = 0; k < P; k++) { const o = (b * P + k) * 3, a = r() * 6.283, e = Math.acos(2 * r() - 1), sp = 14 + r() * 6, rad = sp * Math.sqrt(t) ; pos[o] = cx + Math.sin(e) * Math.cos(a) * rad; pos[o + 1] = cy + Math.cos(e) * rad - t * t * 18; pos[o + 2] = cz + Math.sin(e) * Math.sin(a) * rad; const f = t < .08 ? 0 : (1 - t) ** 1.5 * 1.6; col[o] = cc[0] * f; col[o + 1] = cc[1] * f; col[o + 2] = cc[2] * f; } }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; } }; }
