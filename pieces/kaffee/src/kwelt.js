// KAFFEE — escenarios propios, muy detallados.
// Röstheim: Altstadt de otoño con casas de entramado de verdad (cruces de San Andrés, pisos que vuelan, ventanas con contraventanas,
//   jardineras, buhardillas, letreros colgantes de hierro), un café en cada planta baja con toldo de rayas y terraza, la fuente
//   «Kaffeekannen-Brunnen» (una cafetera de cobre gigante que vierte en una taza de piedra), tranvía, castaños rojos y amarillos,
//   hojas en el suelo, farolas, guirnaldas de banderines y bombillas, la catedral al fondo y colinas con viñedos.
// Interiores: Café Bohne, la tienda Tchibo, el salón de Jacky (y el de París), la iglesia de San Martín con la Kanzel, el sótano de Oma,
// la cocina-salón de Oma con la tele, el plató de noticias y el mar con el crucero.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { FONT } from './props.js';
import { bench } from './props.js';
import { cobbleTex, lantern } from './diam.js';
import { dom } from './fsets.js';
import { tram, rails } from './zsets.js';
import { tasse, kanne, omaKanne, kuchen, pack, maschine, dose, krone, filter, schiff } from './kaffee.js';

export const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (c, i = 1.5) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: .5 });
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g; };
const rep = (t, a, b) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); return t; };
const plane = (w, d, m, p, x, y, z) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); me.rotation.x = -Math.PI / 2; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const txt = (c, s, x, y, size, fill) => { c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = fill; c.fillText(s, x, y); };
const noise = (base, cols, n = 900, r = 3, seed = 1) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); const q = RNG(seed); for (let i = 0; i < n; i++) { c.fillStyle = cols[i % cols.length]; c.globalAlpha = .35 + q() * .4; c.fillRect(q() * w, q() * h, 1 + q() * r, 1 + q() * r); } c.globalAlpha = 1; });
const plank = (a = '#a8784a', b = '#8a5a32') => canvasTex(256, 256, (c, w, h) => { const q = RNG(7); for (let y = 0; y < h; y += 32) { c.fillStyle = q() > .5 ? a : b; c.fillRect(0, y, w, 32); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y, w, 2); for (let k = 0; k < 6; k++) { c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(q() * w, y + 4 + q() * 24, 30 + q() * 60, 1.5); } c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect((y * 7) % w, y, 2, 32); } });
const herring = (a = '#b07a44', b = '#94622e') => canvasTex(256, 256, (c, w, h) => { for (let y = -32; y < h + 32; y += 32) for (let x = -64; x < w + 64; x += 64) { for (const [dx, rot, col] of [[0, .785, a], [32, -.785, b]]) { c.save(); c.translate(x + dx + (y / 32 % 2) * 32, y); c.rotate(rot); c.fillStyle = col; c.fillRect(-28, -7, 56, 14); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1.5; c.strokeRect(-28, -7, 56, 14); c.restore(); } } });
const tiles = (a, b, n = 4) => canvasTex(128, 128, (c, w, h) => { const s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = (i + j) % 2 ? a : b; c.fillRect(i * s, j * s, s, s); } c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 2; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * s, 0); c.lineTo(i * s, h); c.moveTo(0, i * s); c.lineTo(w, i * s); c.stroke(); } });
const wallp = (a, b, motif = 0) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; if (motif) { for (let y = 16; y < h; y += 32) for (let x = (y / 32 | 0) % 2 ? 16 : 0; x < w; x += 32) { c.beginPath(); for (let k = 0; k < 4; k++) c.ellipse(x + Math.cos(k * 1.57) * 5, y + Math.sin(k * 1.57) * 5, 4, 6, k * 1.57, 0, 7); c.fill(); } } else for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 6, h); });
function room(p, X, w, d, h, wall, floor, ceil = 0xf4f0e8) { const g = G(p, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil), 0, g, 0, h, 0); return g; }
const potted = (p, x, z, s = 1) => { const g = G(p, x, 0, z); g.scale.setScalar(s); cyl(.9, .7, 1.6, mat(0xb8582a, { roughness: .8 }), 12, g, 0, .8, 0); for (let k = 0; k < 7; k++) sphere(.7, mat([0x3a8a3a, 0x4aa04a, 0x2a7a3a][k % 3], { roughness: .9 }), g, Math.cos(k) * .5, 2.2 + (k % 3) * .4, Math.sin(k * 1.3) * .5, 10, 8); return g; };
const pendant = (p, x, y, z, col = 0xffd890) => { cyl(.03, .03, 3, mat(0x1a1a1a), 4, p, x, y + 1.5, z); const sh = new THREE.Mesh(new THREE.ConeGeometry(.9, .8, 16, 1, true), mat(0x1a3a2a, { roughness: .5, side: THREE.DoubleSide })); sh.position.set(x, y, z); p.add(sh); sphere(.3, glowM(col, 2.2), p, x, y - .3, z, 10, 8); };
const chair = (p, x, z, ry, col = 0x2a2a30) => { const g = G(p, x, 0, z); g.rotation.y = ry; const m = mat(col, { roughness: .5, metalness: .4 }); box(1.9, .2, 1.9, mat(0x8a5a32, { roughness: .6 }), .08, g, 0, 2.5, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(.07, .07, 2.5, m, 6, g, sx * .8, 1.25, sz * .8); box(1.9, 1.8, .14, m, .06, g, 0, 3.5, -.9); return g; };
const bistro = (p, x, z, o = {}) => { const g = G(p, x, 0, z); cyl(1.5, 1.5, .16, mat(o.top ?? 0xf4f0e8, { roughness: .35 }), 24, g, 0, 3.9, 0); cyl(.12, .12, 3.9, mat(0x2a2a30, { metalness: .5 }), 8, g, 0, 1.95, 0); cyl(.8, .8, .12, mat(0x2a2a30, { metalness: .5 }), 16, g, 0, .06, 0);
  if (o.cups !== false) { for (let k = 0; k < (o.n ?? 2); k++) { const t = tasse(g, { col: [0xfbf8f2, 0xc8202a, 0x2a4ab8][k % 3], heart: k === 0 }); t.position.set(Math.cos(k * 2.6) * .8, 3.98, Math.sin(k * 2.6) * .8); t.rotation.y = k; t.scale.setScalar(.75); } }
  if (o.cake) { const k_ = kuchen(g, { s: .55 }); k_.position.set(.3, 3.98, -.4); } return g; };
const parasol = (p, x, z, col) => { const g = G(p, x, 0, z); cyl(.1, .1, 9, mat(0xe8e0d0), 6, g, 0, 4.5, 0); const t = canvasTex(256, 32, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#fbf6ee' : col; c.fillRect(i * 32, 0, 32, h); } }); const u = new THREE.Mesh(new THREE.ConeGeometry(4.4, 1.8, 16, 1, true), mat(0xffffff, { map: t, roughness: .8, side: THREE.DoubleSide })); u.position.y = 9.4; g.add(u); return g; };

// ---------- árbol de otoño (castaño/arce con hojas rojas, naranjas y amarillas) ----------
const LEAFC = [0xe8582a, 0xf09a2a, 0xf6c83a, 0xc8302a, 0xd87a2a];
export function herbstbaum(p, x, z, s = 1, seed = 1) { const g = G(p, x, 0, z); g.scale.setScalar(s); const r = RNG(seed);
  const bark = mat(0xffffff, { map: noise('#5a3a22', ['#4a2e18', '#6a4a2e', '#3a2412'], 700, 2, seed), roughness: .95 });
  cyl(.7, 1.0, 8, bark, 10, g, 0, 4, 0); for (let k = 0; k < 3; k++) { const b = cyl(.25, .45, 5, bark, 8, g, Math.cos(k * 2.1) * 1.2, 8.5, Math.sin(k * 2.1) * 1.2); b.rotation.set(Math.sin(k * 2.1) * .6, 0, -Math.cos(k * 2.1) * .6); }
  const lm = LEAFC.map(c => mat(c, { roughness: .85 })); for (let k = 0; k < 14; k++) { const a = r() * 6.283, d = r() * 3.4; const sp = sphere(2.0 + r() * 1.3, lm[(k + seed) % lm.length], g, Math.cos(a) * d, 10 + r() * 4.5, Math.sin(a) * d, 12, 9); sp.scale.y = .85; }
  return g; }
// hojas caídas instanciadas sobre el suelo
function leafCarpet(p, cx, cz, w, d, n, seed = 2) { const geo = new THREE.CircleGeometry(.35, 5); geo.rotateX(-Math.PI / 2); const r = RNG(seed);
  const IM = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9 }), n); const o = new THREE.Object3D(), col = new THREE.Color();
  for (let i = 0; i < n; i++) { o.position.set(cx + (r() - .5) * w, .07 + r() * .02, cz + (r() - .5) * d); o.rotation.set(0, r() * 6.283, 0); o.scale.set(1 + r(), 1, .6 + r() * .5); o.updateMatrix(); IM.setMatrixAt(i, o.matrix); IM.setColorAt(i, col.setHex(LEAFC[i % LEAFC.length])); }
  IM.receiveShadow = true; IM.userData.noOutline = true; p.add(IM); return IM; }

// ---------- casa de entramado (Fachwerkhaus) ----------
// x, z = centro de la planta; rot = giro (la fachada mira a +z local). o.cafe = nombre del café (toldo + terraza + letrero colgante), o.shop = tienda.
const PLASTER = ['#f6ecd6', '#f2d49a', '#f4c2a8', '#d8e4c0', '#cfe2ee', '#f6e0b8', '#ead0d8'];
const BEAM = ['#5a3420', '#6a2a1a', '#3a2a1e', '#4a3a6a'];
function fachTex(pl, beam, seed) { return canvasTex(256, 256, (c, w, h) => { c.fillStyle = pl; c.fillRect(0, 0, w, h); const q = RNG(seed); for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(120,90,60,${q() * .06})`; c.fillRect(q() * w, q() * h, 3 + q() * 8, 2 + q() * 6); }
  c.fillStyle = beam; const t = 14; c.fillRect(0, 0, w, t); c.fillRect(0, h - t, w, t); c.fillRect(0, 0, t, h); c.fillRect(w - t, 0, t, h); c.fillRect(w / 2 - t / 2, 0, t, h);
  c.strokeStyle = beam; c.lineWidth = 12; c.lineCap = 'butt'; c.beginPath(); c.moveTo(t, h - t); c.lineTo(w / 2 - t / 2, h * .55); c.moveTo(w - t, h - t); c.lineTo(w / 2 + t / 2, h * .55); c.moveTo(t, t); c.lineTo(w * .2, h * .3); c.moveTo(w - t, t); c.lineTo(w * .8, h * .3); c.stroke();
  c.fillRect(0, h * .55 - t / 2, w, t / 1.4);
  // ventana con contraventanas y jardinera
  const wx = w * .25, wy = h * .18, ww = w * .5, wh = h * .3; c.fillStyle = '#ffffff'; c.fillRect(wx - 4, wy - 4, ww + 8, wh + 8); const g = c.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#bfe2f6'); g.addColorStop(.6, '#6a9ac8'); g.addColorStop(1, '#3a5a8a'); c.fillStyle = g; c.fillRect(wx, wy, ww, wh);
  c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.moveTo(wx + 8, wy + wh); c.lineTo(wx + 30, wy); c.lineTo(wx + 44, wy); c.lineTo(wx + 22, wy + wh); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(wx + ww / 2 - 3, wy, 6, wh); c.fillRect(wx, wy + wh / 2 - 3, ww, 6);
  c.fillStyle = ['#2e6a3a', '#2e4a8a', '#8a2e2e', '#2a6a6a'][seed % 4]; c.fillRect(wx - 30, wy - 4, 24, wh + 8); c.fillRect(wx + ww + 6, wy - 4, 24, wh + 8); c.fillStyle = 'rgba(255,255,255,.18)'; for (let y = wy; y < wy + wh; y += 9) { c.fillRect(wx - 28, y, 20, 3); c.fillRect(wx + ww + 8, y, 20, 3); }
  c.fillStyle = '#6a3a1a'; c.fillRect(wx - 6, wy + wh + 4, ww + 12, 12); for (let i = 0; i < 9; i++) { c.fillStyle = ['#e8323a', '#ff8ad0', '#ffffff', '#e8323a'][i % 4]; c.beginPath(); c.arc(wx + 2 + i * (ww / 8), wy + wh + 2, 7, 0, 7); c.fill(); c.fillStyle = '#3f9a45'; c.fillRect(wx + i * (ww / 8), wy + wh + 6, 5, 5); } }); }
const roofT = (a = '#9a3a2a', b = '#7a2a1e') => canvasTex(256, 256, (c, w, h) => { c.fillStyle = b; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 18) for (let x = (y / 18) % 2 ? -13 : 0; x < w; x += 26) { c.fillStyle = a; c.beginPath(); c.roundRect(x + 1, y, 24, 17, [0, 0, 10, 10]); c.fill(); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x + 1, y + 13, 24, 4); } });
let ROOF = null;
const shopWin = (name, warm = 1) => canvasTex(256, 160, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, warm ? '#ffe2a8' : '#cfe8f6'); g.addColorStop(1, warm ? '#d8882a' : '#6a9ac8'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  const q = RNG(name.length); for (let i = 0; i < 6; i++) { c.fillStyle = `rgba(70,30,10,${.25 + q() * .3})`; c.beginPath(); c.arc(30 + i * 40, h * .78, 12 + q() * 6, 0, 7); c.fill(); c.fillRect(24 + i * 40, h * .55, 14, 30); }
  for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(255,240,200,.9)'; c.beginPath(); c.arc(32 + i * 64, 22, 8, 0, 7); c.fill(); } c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.moveTo(20, h); c.lineTo(80, 0); c.lineTo(110, 0); c.lineTo(50, h); c.fill();
  c.fillStyle = '#ffffff'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.fillText(name.length < 14 ? name : '', w / 2, h * .38); });
export function fachwerkHaus(p, x, z, wid, floors, ci, rot = 0, o = {}) { const g = G(p, x, 0, z); g.rotation.y = rot; const d = 18, gf = 7.6, fh = 8.4, ov = .7;
  const pl = PLASTER[ci % PLASTER.length], bm = BEAM[ci % BEAM.length];
  box(wid, gf, d, mat(0xffffff, { map: rep(noise(o.cafe ? '#efe2c8' : '#e6dccb', ['#d8ccb4', '#f2e8d4'], 600, 3, ci), wid / 10, 1), roughness: .9 }), 0, g, 0, gf / 2, 0);
  box(wid + .2, 1.1, d + .2, mat(0x9a8e7e, { roughness: .9 }), .1, g, 0, .55, 0);
  const ft = fachTex(pl, bm, ci); ft.wrapS = THREE.RepeatWrapping; ft.repeat.set(Math.max(1, Math.round(wid / 9)), 1);
  for (let f = 0; f < floors; f++) { const y0 = gf + f * fh, k = (f + 1) * ov; const b = box(wid + k * .4, fh, d + k * 2, mat(0xffffff, { map: ft, roughness: .85 }), 0, g, 0, y0 + fh / 2, 0); box(wid + k * .4 + .4, .7, d + k * 2 + .4, mat(bm, { roughness: .8 }), .05, g, 0, y0 + .2, 0); }
  const top = gf + floors * fh, rd = d + floors * ov * 2 + 2.4; ROOF = ROOF || rep(roofT(), 4, 4);
  const sh = new THREE.Shape(); sh.moveTo(-wid / 2 - 1.2, 0); sh.lineTo(wid / 2 + 1.2, 0); sh.lineTo(0, wid * .72); sh.closePath(); const rg = new THREE.ExtrudeGeometry(sh, { depth: rd, bevelEnabled: false }); rg.translate(0, 0, -rd / 2);
  const roof = new THREE.Mesh(rg, mat(0xffffff, { map: ROOF, roughness: .7 })); roof.position.y = top; g.add(roof);
  const gable = new THREE.Mesh(new THREE.ShapeGeometry(sh), mat(0xffffff, { map: ft, roughness: .85 })); gable.position.set(0, top, rd / 2 - 1.15); g.add(gable);
  // buhardilla y chimenea
  const dmr = G(g, 0, top + wid * .22, rd / 2 - 3.4); box(4.4, 4, 3, mat(pl), .1, dmr, 0, 0, 0); box(3, 2.4, .2, mat(0x6a9ac8, { roughness: .1, metalness: .3, emissive: 0x1a3a5a, emissiveIntensity: .3 }), 0, dmr, 0, 0, 1.55); const dr = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.4, 4), mat(0xffffff, { map: ROOF })); dr.rotation.y = Math.PI / 4; dr.position.y = 3.2; dmr.add(dr);
  box(2, 6, 2, mat(0x8a4a3a, { roughness: .9 }), .1, g, wid * .28, top + wid * .5, -2); box(2.4, .5, 2.4, mat(0x6a3a2a), .05, g, wid * .28, top + wid * .5 + 3, -2);
  // planta baja: puerta, escaparate cálido, toldo, letreros
  const front = d / 2 + .05; const door = box(3.2, 5.6, .3, mat([0x5a3220, 0x2a5a3a, 0x2a3a6a, 0x7a2a2a][ci % 4], { roughness: .6 }), .15, g, -wid * .3, 2.8 + .6, front); sphere(.16, mat(0xd9a531, { metalness: .9, roughness: .3 }), g, -wid * .3 + 1.1, 3.4, front + .2, 8, 6);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(1.7, .25, 6, 16, Math.PI), mat(0x9a8e7e)); arch.position.set(-wid * .3, 6.2, front); g.add(arch);
  const sw = textPlane(wid * .44, 4.2, 256, 160, () => {}); sw.material.map = shopWin(o.cafe || o.shop || '', 1); sw.material.emissive = new THREE.Color(0xffc870); sw.material.emissiveIntensity = .55; sw.material.emissiveMap = sw.material.map; sw.position.set(wid * .18, 3.8, front + .02); g.add(sw);
  box(wid * .46, .4, .7, mat(0xfbf6ee), .08, g, wid * .18, 1.5, front + .3); box(wid * .48, .3, .3, mat(bm), .05, g, wid * .18, 6.0, front + .1);
  if (o.cafe || o.shop) { const aw = canvasTex(256, 64, (c, w, h) => { const cc = ['#2e6a3a', '#8a2a2a', '#2a4a8a', '#c86a1a', '#5a2a5a'][ci % 5]; for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#fbf6ee' : cc; c.fillRect(i * 16, 0, 16, h); } c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(0, h - 10, w, 10); });
    const awn = box(wid * .9, .2, 4.2, mat(0xffffff, { map: aw, roughness: .85 }), 0, g, 0, 6.9, front + 2); awn.rotation.x = .32; const val = textPlane(wid * .9, .9, 512, 52, (c, w, h) => { const cc = ['#2e6a3a', '#8a2a2a', '#2a4a8a', '#c86a1a', '#5a2a5a'][ci % 5]; c.fillStyle = cc; c.fillRect(0, 0, w, h); for (let i = 0; i < 32; i++) { c.fillStyle = '#fbf6ee'; c.beginPath(); c.arc(i * 16 + 8, h, 8, Math.PI, 0); c.fill(); } }); val.position.set(0, 6.1, front + 3.9); g.add(val);
    const sg = textPlane(wid * .7, 1.6, 420, 96, (c, w, h) => { c.fillStyle = '#1e140c'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 18); c.fill(); c.strokeStyle = '#e8b84a'; c.lineWidth = 5; c.stroke(); let f = 58; c.font = `700 ${f}px ${FONT}`; const s = o.cafe || o.shop; while (c.measureText(s).width > w - 30) { f -= 2; c.font = `700 ${f}px ${FONT}`; } txt(c, s, w / 2, h / 2 + 3, f, '#f6d68a'); });
    sg.position.set(0, gf + .9, front + ov + .1); g.add(sg); }
  if (o.cafe) { // letrero colgante de hierro con una taza
    const br = G(g, wid / 2 - 1.2, gf + fh * .5, front + ov); box(.15, .15, 3.2, mat(0x1a1a1e, { metalness: .6 }), .02, br, 0, 0, 1.6); const plate = G(br, 0, -1.4, 2.8); box(.14, 2.4, 2.4, mat(0x1a1a1e), .1, plate, 0, 0, 0);
    const ic = textPlane(2.1, 2.1, 128, 128, (c, w, h) => { c.fillStyle = '#e8b84a'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.fillStyle = '#3a1a08'; c.beginPath(); c.moveTo(34, 50); c.lineTo(86, 50); c.lineTo(80, 96); c.lineTo(40, 96); c.closePath(); c.fill(); c.strokeStyle = '#3a1a08'; c.lineWidth = 7; c.beginPath(); c.arc(90, 70, 10, -1.4, 1.4); c.stroke(); c.lineWidth = 4; for (const k of [48, 64]) { c.beginPath(); c.moveTo(k, 40); c.quadraticCurveTo(k + 8, 30, k, 18); c.stroke(); } });
    for (const s of [-1, 1]) { const q = ic.clone(); q.position.x = s * .09; q.rotation.y = s * Math.PI / 2; plate.add(q); } }
  return { g, front: d / 2 + ov * floors, wid, ci }; }

// ---------- Kaffeekannen-Brunnen ----------
export function brunnenKanne(p, x, z) { const g = G(p, x, 0, z); const st = mat(0xffffff, { map: noise('#d8ccb4', ['#c8bca4', '#e8dcc4'], 600, 3, 9), roughness: .85 });
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(10, 10.6, 2.2, 8), st); basin.position.y = 1.1; g.add(basin); const wat = cyl(9.4, 9.4, .2, mat(0x6a3a1a, { roughness: .08, metalness: .2, emissive: 0x2a1204, emissiveIntensity: .2 }), 8, g, 0, 2.0, 0); wat.userData.noOutline = true;
  cyl(1.6, 2.2, 7, st, 12, g, 0, 3.5, 0); const cup = tasse(g, { r: 3.2, h: 3.4, col: 0xe8dcc4, band: 0x8a5a32 }); cup.position.y = 6.5; cup.userData.level(.8);
  const pot = G(g, 2.6, 15.5, 0); pot.rotation.z = .85; const cu = mat(0xc8743a, { metalness: .85, roughness: .3 }); const prof = []; for (let i = 0; i <= 10; i++) { const t = i / 10; prof.push(new THREE.Vector2(1 + Math.sin(t * Math.PI) * 1.6, t * 5)); }
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), cu); body.position.y = -2.5; pot.add(body); cyl(1.1, 1.2, .5, cu, 16, pot, 0, 2.6, 0); sphere(.4, cu, pot, 0, 3.0, 0, 10, 8); const sp = cyl(.3, .6, 3.4, cu, 10, pot, -2.6, .8, 0); sp.rotation.z = 1.0;
  const hd = new THREE.Mesh(new THREE.TorusGeometry(1.5, .25, 8, 16, Math.PI), cu); hd.rotation.z = -Math.PI / 2; hd.position.set(2.5, 0, 0); pot.add(hd);
  cyl(.5, .6, 9, st, 8, g, 4.6, 4.5, 0); // pilar que sostiene la cafetera
  const drops = []; const dm = new THREE.MeshStandardMaterial({ color: 0x6a3a1a, roughness: .1, emissive: 0x3a1a06, emissiveIntensity: .3 }); for (let k = 0; k < 26; k++) { const d = sphere(.28, dm, g, 0, 0, 0, 6, 4); d.userData.noOutline = true; drops.push(d); }
  g.userData.update = T => drops.forEach((d, i) => { const t = (T * 1.2 + i / drops.length) % 1; d.position.set(lerp(-.6, 0, t), lerp(14.4, 9.4, t * t), Math.sin(i * 3) * .15); d.scale.set(1, 1.6, 1); });
  return g; }
const lerp = (a, b, k) => a + (b - a) * k;

// ---------- banderines y guirnaldas ----------
function bunting(p, a, b, sag = 2, n = 14, cols = ['#e8323a', '#f6c83a', '#2e6a3a', '#fbf6ee', '#2a4a8a']) { const g = G(p); const pts = []; for (let i = 0; i <= n; i++) { const t = i / n; pts.push(new THREE.Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t) - Math.sin(t * Math.PI) * sag, lerp(a.z, b.z, t))); }
  const line = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, .04, 4), mat(0x2a2a2a)); g.add(line);
  for (let i = 0; i < n; i++) { const t = (i + .5) / n, q = new THREE.Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t) - Math.sin(t * Math.PI) * sag, lerp(a.z, b.z, t)); const s = new THREE.Shape(); s.moveTo(-.55, 0); s.lineTo(.55, 0); s.lineTo(0, -1.2); s.closePath(); const f = new THREE.Mesh(new THREE.ShapeGeometry(s), mat(cols[i % cols.length], { side: THREE.DoubleSide, roughness: .9 })); f.position.copy(q); f.lookAt(q.x + (b.z - a.z), q.y, q.z - (b.x - a.x)); g.add(f);
    if (i % 2) sphere(.18, glowM(0xffe0a0, 1.4), g, q.x, q.y - .1, q.z, 6, 4); }
  return g; }

// ---------- Röstheim ----------
// Plaza z ∈ [-90, 70], x ∈ [-46, 46]; casas con fachada en x = ±47 (miran al centro), fila del fondo en z = -100 con la catedral en z = -150,
// fila de delante en z = 92 (hueco en x ∈ [-14, 14] para la calle). Fuente en (0, -8). Tranvía por x = -26 (raíles z ∈ [-90, 200]).
// Terrazas: delante de cada café, en x = ±(47 - 7) (mesas a 3 m de la fachada y sombrillas entre medias). Árboles en x = ±30.
export function roestheim(scene, o = {}) { const g = G(scene); const C = o.cafes || {};
  plane(2600, 2600, mat(0xffffff, { roughness: 1, map: rep(noise('#7aa04a', ['#6a9040', '#8ab05a', '#9a8a3a'], 2400, 3, 4), 180, 180) }), g, 0, -.05, 0);
  const ct = cobbleTex(); rep(ct, 26, 44); plane(104, 200, mat(0xffffff, { roughness: .82, map: ct }), g, 0, .02, -12);
  const asph = rep(noise('#5a5c62', ['#4e5056', '#6a6c72'], 2000, 2, 3), 2, 60); plane(28, 700, mat(0xffffff, { roughness: .9, map: asph }), g, 0, .03, 430);
  for (let z = 100; z < 760; z += 10) box(.4, .04, 4, mat(0xffffff), 0, g, 0, .07, z);
  rails(g, -26, 200, -92); for (let z = -90; z < 200; z += 3) box(4.6, .1, .5, mat(0x7a6a5a, { roughness: .9 }), 0, g, -26, .06, z);
  const HS = []; let ci = 0;
  for (const s of [-1, 1]) for (let z = 66; z > -92;) { const wid = 13 + (ci * 7) % 6; const name = C[ci] ?? (ci % 2 === 0 ? ['CAFÉ BOHNE', 'KAFFEEHAUS LUISE', 'CAFÉ SCHÖN', 'RÖSTEREI', 'CAFÉ AM MARKT', 'MOKKA-STUBE', 'CAFÉ ERNA', 'ESPRESSO-BAR'][(ci / 2 | 0) % 8] : null);
    const shop = name ? null : ['BÄCKEREI', 'BLUMEN', 'APOTHEKE', 'BUCHLADEN', 'FRISEUR JACKY', 'METZGEREI', 'TCHIBO', 'SPARKASSE'][(ci / 2 | 0) % 8];
    const h = fachwerkHaus(g, s * (47 + 9), z - wid / 2, wid, 2 + (ci % 3 === 0 ? 1 : 0), ci, -s * Math.PI / 2, { cafe: name, shop }); h.x = s * 47; h.z = z - wid / 2; h.name = name || shop; HS.push(h);
    if (name) { const tx = s * 40; for (let k = 0; k < 2; k++) { const tz = z - wid / 2 + (k ? 3.2 : -3.2); bistro(g, tx, tz, { n: 2, cake: k === 0 }); for (const dz of [-1, 1]) chair(g, tx, tz + dz * 2.4, dz < 0 ? 0 : Math.PI); } parasol(g, s * 40.5, z - wid / 2, ['#2e6a3a', '#8a2a2a', '#2a4a8a'][ci % 3]); }
    z -= wid + .3; ci++; }
  for (let x = -40; x < 40;) { const wid = 13 + (ci * 5) % 5; if (Math.abs(x + wid / 2) > 1) { const h = fachwerkHaus(g, x + wid / 2, -108, wid, 2 + ci % 2, ci, 0, { cafe: ci % 3 === 0 ? 'CAFÉ DOM' : null }); HS.push(h); } x += wid + .3; ci++; }
  for (const s of [-1, 1]) for (let k = 0; k < 2; k++) { const h = fachwerkHaus(g, s * (22 + k * 15), 100, 14, 2, ci++, Math.PI, { cafe: k === 0 ? 'CAFÉ ECKE' : null }); HS.push(h); }
  dom(g, 0, -158, 0);
  for (let k = 0; k < 18; k++) { const a = k / 18 * 6.283; fachwerkHaus(g, Math.cos(a) * 190, Math.sin(a) * 190 - 20, 15, 2, ci++, -a - Math.PI / 2); }
  // colinas con viñedos
  for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283; const hl = sphere(120, mat(0xffffff, { map: rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#8aa04a'; c.fillRect(0, 0, w, h); c.fillStyle = '#5a7a2a'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 3); c.fillStyle = 'rgba(200,120,40,.4)'; for (let i = 0; i < 40; i++) c.fillRect((i * 37) % w, (i * 53) % h, 6, 3); }), 8, 8), roughness: 1 }), g, Math.cos(a) * 520, -60, Math.sin(a) * 520 - 40, 20, 12); hl.scale.y = .55; }
  const FOUNT = brunnenKanne(g, 0, -8);
  const TREES = []; for (const [x, z, s] of [[-30, 50, 1.1], [30, 50, 1.0], [-30, 24, 1.05], [30, 22, 1.1], [-30, -38, 1.0], [30, -40, 1.05], [-30, -66, 1.1], [30, -66, .95], [16, 34, .9], [-14, -60, .9]]) TREES.push(herbstbaum(g, x, z, s, TREES.length + 1));
  leafCarpet(g, 0, -10, 96, 170, 1400, 3);
  for (const [x, z] of [[-20, 40], [20, 40], [-20, -26], [20, -26], [-20, 10], [20, 10], [-20, -60], [20, -60]]) { const l = lantern(g, x, z); }
  for (const [x, z, r] of [[-16, -20, 0], [16, -20, Math.PI], [-16, 4, 0], [16, 4, Math.PI]]) bench(g, x, z, r + Math.PI / 2);
  for (const [x, z] of [[-10, 20], [10, 20], [-10, -36], [10, -36]]) potted(g, x, z, 1.3);
  for (let k = 0; k < 6; k++) { const z = 56 - k * 26; bunting(g, V3(-47, 17, z), V3(47, 17, z - 6), 2.4, 18); }
  // puesto de café ambulante (Kaffeewagen) junto a la fuente
  const KW = G(g, 14, 0, 14); KW.rotation.y = -.6; box(6, 4.6, 3.4, mat(0x2e6a3a, { roughness: .5 }), .4, KW, 0, 3.6, 0); box(6.4, .4, 3.8, mat(0xfbf6ee), .1, KW, 0, 6.1, 0); for (const s of [-1, 1]) { const w = cyl(1, 1, .5, mat(0x1a1a1e), 14, KW, s * 2.2, 1, 1.7); w.rotation.x = Math.PI / 2; }
  const kws = textPlane(5.4, 1.4, 320, 84, (c, w, h) => { c.fillStyle = '#fbf6ee'; c.fillRect(0, 0, w, h); txt(c, 'KAFFEE TO GO', w / 2, h / 2 + 3, 46, '#2e6a3a'); }); kws.position.set(0, 5.2, 1.72); KW.add(kws);
  const m_ = maschine(KW); m_.position.set(0, 3.6 + 2.3, -.4); m_.scale.setScalar(.5);
  const TRAM = tram(g); TRAM.position.set(-26, 0, 140); TRAM.visible = false;
  const sg = textPlane(16, 4, 512, 128, (c, w, h) => { c.fillStyle = '#f6d21a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a1a1a'; c.lineWidth = 10; c.strokeRect(8, 8, w - 16, h - 16); txt(c, o.name || 'RÖSTHEIM', w / 2, h / 2 + 4, 84, '#1a1a1a'); }); sg.position.set(18, 9, 140); g.add(sg); for (const s of [-1, 1]) cyl(.25, .25, 11, mat(0x9a9aa4, { metalness: .6 }), 8, g, 18 + s * 6.5, 5.5, 140);
  return { g: shade(g), HS, FOUNT, TREES, TRAM, KW }; }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- Café Bohne por dentro (X): barra en z = -10 (barista detrás en z = -13 mirando +z), vitrina de tartas, mesas en rejilla
// x ∈ {-12, 0, 12}, z ∈ {-1, 9}; ventanal en la pared izquierda (x = -22) con la calle; pizarra con precios. ----------
export function cafeIn(scene, X) { const g = room(scene, X, 44, 34, 18, mat(0xffffff, { map: rep(wallp('#e8d4b0', '#d8c098', 1), 6, 2), roughness: .9 }), mat(0xffffff, { map: rep(herring(), 4, 3), roughness: .55 }), 0xf4ead8);
  box(44, 6, .5, mat(0xffffff, { map: rep(plank('#6a3a1a', '#5a2e12'), 6, 1), roughness: .6 }), 0, g, 0, 3, -16.8);
  const bar = G(g, 0, 0, -10); box(26, 4.4, 3.2, mat(0xffffff, { map: rep(plank('#7a4a26', '#5e3818'), 4, 1), roughness: .6 }), .2, bar, 0, 2.2, 0); box(26.6, .4, 3.8, mat(0x2a1a10, { roughness: .2, metalness: .2 }), .1, bar, 0, 4.5, 0);
  const M = maschine(bar); M.position.set(-6, 4.7, -.6); const vit = G(bar, 7, 4.7, 0); box(9, 3, 3, new THREE.MeshStandardMaterial({ color: 0xe8f6ff, roughness: .05, transparent: true, opacity: .25, depthWrite: false }), .1, vit, 0, 1.5, 0); for (let k = 0; k < 3; k++) { const c = kuchen(vit, { s: .9 }); c.position.set(-3 + k * 3, .2, 0); }
  for (let k = 0; k < 9; k++) { const t = tasse(g, { col: [0xfbf8f2, 0xc8202a, 0x2a4ab8][k % 3] }); t.position.set(-10 + k * 2.4, 9.2, -16.3); t.userData.level(0); } box(24, .3, 1.4, mat(0x6a3a1a), .05, g, 0, 8.9, -16.2);
  const tafel = textPlane(9, 6, 360, 240, (c, w, h) => { c.fillStyle = '#1e2a22'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a5a32'; c.lineWidth = 14; c.strokeRect(0, 0, w, h); txt(c, 'KAFFEE', w / 2, 40, 44, '#ffffff'); const L = [['ESPRESSO', '2,20'], ['CAPPUCCINO', '3,40'], ['FILTERKAFFEE', '2,60'], ['KUCHEN', '3,90']]; L.forEach(([a, b], i) => { c.textAlign = 'left'; c.font = `700 28px ${FONT}`; c.fillStyle = '#f4e8c8'; c.fillText(a, 26, 92 + i * 38); c.textAlign = 'right'; c.fillStyle = '#ffd23f'; c.fillText(b + ' €', w - 26, 92 + i * 38); }); });
  tafel.position.set(12, 12, -16.7); g.add(tafel);
  const wt = canvasTex(256, 160, (c, w, h) => { const gg = c.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#9fd2f2'); gg.addColorStop(1, '#f6e6c8'); c.fillStyle = gg; c.fillRect(0, 0, w, h); for (let i = 0; i < 5; i++) { c.fillStyle = ['#f2d49a', '#f4c2a8', '#d8e4c0', '#cfe2ee', '#f6ecd6'][i]; c.fillRect(i * 52, 40, 50, 120); c.fillStyle = '#5a3420'; c.fillRect(i * 52, 40, 50, 6); c.fillRect(i * 52 + 22, 40, 6, 120); c.fillStyle = '#9a3a2a'; c.beginPath(); c.moveTo(i * 52, 40); c.lineTo(i * 52 + 25, 10); c.lineTo(i * 52 + 50, 40); c.fill(); } c.fillStyle = '#e8582a'; c.beginPath(); c.arc(60, 110, 26, 0, 7); c.arc(200, 100, 30, 0, 7); c.fill(); });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(26, 11), new THREE.MeshBasicMaterial({ map: wt })); win.position.set(-21.7, 8, 2); win.rotation.y = Math.PI / 2; g.add(win); for (let k = 0; k < 4; k++) box(.4, 11.4, .5, mat(0x2a1a10), .05, g, -21.6, 8, -11 + k * 8.7);
  const TB = []; for (const x of [-12, 0, 12]) for (const z of [-1, 9]) { bistro(g, x, z, { n: 2, cake: (x + z) % 2 === 0, top: 0xe8d8b8 }); TB.push([x, z]); for (const dx of [-1, 1]) chair(g, x + dx * 2.6, z, dx < 0 ? Math.PI / 2 : -Math.PI / 2, 0x6a3a1a); }
  for (const x of [-12, 0, 12]) for (const z of [-1, 9]) pendant(g, x, 13, z); potted(g, 19, 13, 1.4); potted(g, -19, -14, 1.4);
  const L = new THREE.PointLight(0xffd8a0, 140, 60, 1.3); L.position.set(0, 14, 2); g.add(L); return { g: shade(g), M, TB }; }

// ---------- tienda Tchibo (X): estanterías con paquetes en la pared del fondo (z = -12), caja en (10, -4), cola de clientes en x = -6. ----------
export function tchiboLaden(scene, X) { const g = room(scene, X, 40, 30, 17, mat(0xffffff, { map: rep(wallp('#f4f6fa', '#e8ecf4'), 6, 2), roughness: .8 }), mat(0xffffff, { map: rep(tiles('#d8dce4', '#c8ccd8'), 8, 6), roughness: .4 }), 0xffffff);
  box(40, 3, .4, mat(0x1a2a5a), 0, g, 0, 15.5, -14.8); const sg = textPlane(18, 2.4, 720, 96, (c, w, h) => { c.fillStyle = '#1a2a5a'; c.fillRect(0, 0, w, h); txt(c, 'TCHIBO', w / 2, h / 2 + 3, 72, '#ffffff'); }); sg.position.set(0, 15.5, -14.5); g.add(sg);
  for (let r = 0; r < 4; r++) { box(34, .3, 2.2, mat(0xfbfbf8), .05, g, 0, 1.2 + r * 3.1, -13.6); for (let k = 0; k < 22; k++) { const p = pack(g, 'TCHIBO', { s: .85, price: r === 1 && k % 4 === 0 }); p.position.set(-15.8 + k * 1.5, 1.35 + r * 3.1, -13.4); } }
  const kasse = G(g, 10, 0, -4); box(8, 4.2, 3, mat(0x1a2a5a, { roughness: .4 }), .2, kasse, 0, 2.1, 0); box(8.4, .3, 3.4, mat(0xfbfbf8), .05, kasse, 0, 4.35, 0); box(1.6, 1.2, 1, mat(0x2a2a30), .1, kasse, -2, 5.1, 0);
  const banner = textPlane(10, 3.4, 400, 136, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 20); c.fill(); txt(c, 'ZÄHLT DOPPELT!', w / 2, 48, 46, '#c8202a'); txt(c, 'NUR 4,99 €', w / 2, 100, 40, '#1a2a5a'); }); banner.position.set(-10, 12.5, -14.5); g.add(banner);
  for (let k = 0; k < 6; k++) { const L = new THREE.PointLight(0xffffff, 40, 30, 1.4); L.position.set(-14 + k * 6, 15, 0); g.add(L); }
  return { g: shade(g) }; }

// ---------- salón de Jacky (X): tres sillones con espejo en la pared del fondo (z = -10), estante con Jacobs y coronas, mostrador.
// o.paris: papel rosa y ventana con la Torre Eiffel. Sillones en x ∈ {-10, 0, 10}, z = -4 (miran -z, al espejo). ----------
export function salon(scene, X, o = {}) { const g = room(scene, X, 38, 28, 17, mat(0xffffff, { map: rep(wallp(o.paris ? '#f8d4e0' : '#e8e0f0', o.paris ? '#f0b8cc' : '#d8cce8', 1), 6, 2), roughness: .8 }), mat(0xffffff, { map: rep(tiles('#1a1a20', '#f4f4f4', 8), 6, 4), roughness: .3 }), 0xffffff);
  const CH = []; for (const x of [-10, 0, 10]) { const c = G(g, x, 0, -4); cyl(1.0, 1.2, 2.2, mat(0x2a2a30, { metalness: .6 }), 12, c, 0, 1.1, 0); box(3, .8, 3, mat(o.paris ? 0xd8306a : 0x6a2a5a, { roughness: .5 }), .4, c, 0, 2.6, 0); box(3, 3.4, .7, mat(o.paris ? 0xd8306a : 0x6a2a5a), .3, c, 0, 4.4, 1.4); CH.push(c);
    const mi = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 6.4), new THREE.MeshStandardMaterial({ color: 0xe8f6ff, roughness: .05, metalness: .2, emissive: 0x9ab8d0, emissiveIntensity: .55 })); mi.position.set(x, 8.4, -13.75); g.add(mi); box(5.2, 7, .3, mat(0xd8a020, { metalness: .8, roughness: .3 }), .1, g, x, 8.4, -13.9);
    for (let k = 0; k < 6; k++) sphere(.25, glowM(0xfff4d8, 2), g, x - 2.5 + k, 12.2, -13.4, 6, 4); }
  box(34, .3, 1.6, mat(0xfbfbf8), .05, g, 0, 3.4, -13.2); for (let k = 0; k < 10; k++) { const p = pack(g, 'JACOBS', { s: .7 }); p.position.set(-14 + k * 3.1, 3.55, -13); }
  if (o.paris) { const wt = canvasTex(160, 256, (c, w, h) => { const gg = c.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#9fd2f2'); gg.addColorStop(1, '#f8d8c8'); c.fillStyle = gg; c.fillRect(0, 0, w, h); c.fillStyle = '#5a4a5a'; c.beginPath(); c.moveTo(80, 30); c.lineTo(110, 230); c.lineTo(96, 230); c.lineTo(80, 150); c.lineTo(64, 230); c.lineTo(50, 230); c.closePath(); c.fill(); c.fillRect(56, 120, 48, 8); c.fillRect(66, 80, 28, 6); c.fillStyle = '#f2e4d0'; for (let i = 0; i < 5; i++) c.fillRect(i * 34, 200, 30, 56); });
    const w = new THREE.Mesh(new THREE.PlaneGeometry(9, 13), new THREE.MeshBasicMaterial({ map: wt })); w.position.set(18.75, 9, -2); w.rotation.y = -Math.PI / 2; g.add(w); box(.5, 13.6, 9.6, mat(0xfbfbf8), .1, g, 18.8, 9, -2);
    const ps = textPlane(12, 2.4, 480, 96, (c, w, h) => { c.fillStyle = '#1a1a20'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 18); c.fill(); txt(c, 'SALON JACKY · PARIS', w / 2, h / 2 + 3, 50, '#ffd8e8'); }); ps.position.set(0, 14.8, -13.7); g.add(ps); }
  else { const ps = textPlane(12, 2.4, 480, 96, (c, w, h) => { c.fillStyle = '#1a1a20'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 18); c.fill(); txt(c, 'FRISEUR JACKY', w / 2, h / 2 + 3, 54, '#ff8ad0'); }); ps.position.set(0, 14.8, -13.7); g.add(ps); }
  potted(g, -16, 8, 1.3); potted(g, 16, 8, 1.3); const L = new THREE.PointLight(0xfff4e8, 120, 50, 1.3); L.position.set(0, 14, 2); g.add(L); return { g: shade(g), CH }; }

// ---------- iglesia de San Martín por dentro (X): nave con bancos (filas z ∈ [2, 30], x = ±8), altar en z = -22, Kanzel en (-11, 9, -10)
// mirando a +z, vidrieras en las paredes laterales, columnas, velas. ----------
export function kircheIn(scene, X) { const st = mat(0xffffff, { map: rep(noise('#e8dcc8', ['#d8ccb8', '#f4ead8'], 700, 4, 5), 4, 3), roughness: .9 });
  const g = room(scene, X, 44, 64, 34, st, mat(0xffffff, { map: rep(tiles('#c8b898', '#a89878', 2), 10, 14), roughness: .6 }), 0xe8dcc8);
  for (let z = 2; z <= 30; z += 4.6) for (const s of [-1, 1]) { const b = G(g, s * 9, 0, z); const w = mat(0x7a4a26, { roughness: .6 }); box(11, .4, 2, w, .1, b, 0, 2.4, 0); box(11, 2.6, .3, w, .1, b, 0, 3.8, 1.0); box(.4, 2.4, 2.2, w, .05, b, -5.4, 1.2, 0); box(.4, 2.4, 2.2, w, .05, b, 5.4, 1.2, 0); }
  for (let z = -18; z <= 30; z += 12) for (const s of [-1, 1]) { cyl(1.4, 1.6, 34, st, 12, g, s * 16, 17, z); }
  const vt = (seed) => canvasTex(96, 192, (c, w, h) => { const q = RNG(seed); for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 16) { c.fillStyle = ['#d8303a', '#2a5ad8', '#f6c83a', '#3ab86a', '#8a3ad8'][(q() * 5) | 0]; c.fillRect(x, y, 16, 16); } c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; for (let y = 0; y < h; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } for (let x = 0; x < w; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } });
  for (let z = -12; z <= 24; z += 12) for (const s of [-1, 1]) { const m = new THREE.MeshStandardMaterial({ map: vt(z + s * 7), emissive: 0xffffff, emissiveMap: null, emissiveIntensity: .0, roughness: .4 }); m.emissiveMap = m.map; m.emissiveIntensity = .9; const w = new THREE.Mesh(new THREE.PlaneGeometry(5, 12), m); w.position.set(s * 21.7, 18, z); w.rotation.y = -s * Math.PI / 2; g.add(w); }
  const alt = G(g, 0, 0, -24); box(14, 1, 6, st, .1, alt, 0, .5, 0); box(10, 4, 3.5, mat(0xfbfbf8, { roughness: .7 }), .1, alt, 0, 3, 0); box(10.4, .2, 3.8, mat(0xd8a020, { metalness: .8 }), .05, alt, 0, 5, 0);
  for (const s of [-1, 1]) { cyl(.15, .2, 1.6, mat(0xd8a020, { metalness: .9 }), 8, alt, s * 3.4, 5.9, 0); cyl(.16, .16, 1.4, mat(0xfbf6ee), 8, alt, s * 3.4, 7.4, 0); sphere(.18, glowM(0xffd060, 3), alt, s * 3.4, 8.3, 0, 6, 4); }
  const cr = G(alt, 0, 14, -1.6); box(1, 9, .6, mat(0xd8a020, { metalness: .8, roughness: .3 }), .1, cr, 0, 0, 0); box(5, 1, .6, mat(0xd8a020, { metalness: .8 }), .1, cr, 0, 2, 0);
  const kz = G(g, -11, 0, -10); cyl(.6, .8, 8, st, 10, kz, 0, 4, 0); const bx = cyl(2.6, 2.0, 3, mat(0x7a4a26, { roughness: .6 }), 12, kz, 0, 9.5, 0); box(5.4, .3, 5.4, mat(0xd8a020, { metalness: .7 }), .05, kz, 0, 11, 0); const book = box(1.6, .2, 1.2, mat(0xc8202a), .05, kz, 1.2, 11.3, 1.0); book.rotation.x = -.3;
  const L1 = new THREE.PointLight(0xffe4b0, 160, 80, 1.3); L1.position.set(0, 26, 0); g.add(L1); return { g: shade(g), KZ: kz }; }

// ---------- sótano de Oma (X): paredes de piedra, estanterías con tarros de conservas al fondo (z = -9), cajas de patatas, bombilla,
// escalera de madera que baja por la izquierda (x = -9). La lata está en el estante de abajo, en (2, 2.6, -9.6), detrás de los tarros. ----------
export function kellerO(scene, X) { const st = mat(0xffffff, { map: rep(canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#5a5046'; c.fillRect(0, 0, w, h); const q = RNG(6); for (let y = 0; y < h; y += 28) for (let x = (y / 28) % 2 ? -20 : 0; x < w; x += 40) { const l = 90 + q() * 50 | 0; c.fillStyle = `rgb(${l},${l - 8},${l - 18})`; c.beginPath(); c.roundRect(x + 2, y + 2, 36, 24, 6); c.fill(); } }), 4, 2), roughness: .95 });
  const g = room(scene, X, 30, 22, 14, st, mat(0xffffff, { map: rep(noise('#4a443e', ['#3e3a34', '#5a544c'], 900, 3, 2), 6, 4), roughness: 1 }), 0x3a3630);
  const sh = G(g, 0, 0, -9.6); const wd = mat(0x6a4a2a, { roughness: .8 }); for (let r = 0; r < 4; r++) box(20, .3, 2.2, wd, .05, sh, 0, 1.2 + r * 2.9, 0); for (const s of [-1, 1]) box(.4, 12, 2.2, wd, .05, sh, s * 10, 6, 0);
  const JC = [0xd8302a, 0xf0a020, 0x8a2a6a, 0x3a8a3a, 0xe8c83a, 0xc85a2a]; const gm = new THREE.MeshStandardMaterial({ color: 0xf4fbff, roughness: .05, transparent: true, opacity: .35, depthWrite: false });
  for (let r = 0; r < 4; r++) for (let k = 0; k < 11; k++) { if (r === 0 && (k === 6 || k === 7)) continue; const x = -9 + k * 1.75; cyl(.62, .62, 1.8, mat(JC[(r * 3 + k) % JC.length], { roughness: .5 }), 12, sh, x, 1.35 + r * 2.9 + .9, .1); const j = cyl(.7, .7, 2.0, gm, 14, sh, x, 1.35 + r * 2.9 + 1.0, .1); j.userData.noOutline = true; cyl(.72, .72, .3, mat(0xd8a020, { metalness: .7 }), 14, sh, x, 1.35 + r * 2.9 + 2.1, .1);
    const l = textPlane(.9, .5, 60, 32, (c, w, h) => { c.fillStyle = '#fbf3c8'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a2a7a'; c.font = `700 14px ${FONT}`; c.textAlign = 'center'; c.fillText(['KIRSCH', 'APRIKOSE', 'PFLAUME', 'GURKEN', 'QUITTE', 'BIRNE'][(r + k) % 6], w / 2, 20); }); l.position.set(x, 1.35 + r * 2.9 + .8, .82); sh.add(l); }
  for (let k = 0; k < 3; k++) { const cr = G(g, 8 + (k % 2) * 3.6, 0, 2 + k * 3.2); box(3.4, 2, 2.6, wd, .1, cr, 0, 1, 0); for (let i = 0; i < 8; i++) { const p = sphere(.5, mat(0xc8a060, { roughness: .9 }), cr, -1 + (i % 3), 2.1 + (i / 6 | 0) * .4, -.6 + (i % 2) * 1.2, 8, 6); p.scale.set(1.2, .8, 1); } }
  const sack = sphere(2, mat(0xc8b48a, { roughness: 1 }), g, 12, 2, -5, 12, 10); sack.scale.set(1, 1.2, .9);
  const stairs = G(g, -10, 0, 2); for (let k = 0; k < 9; k++) { box(5, .4, 2, wd, .05, stairs, 0, 1.4 + k * 1.4, -k * 1.5 + 6); } box(.3, 14, 14, wd, .05, stairs, 2.6, 7, 0);
  cyl(.02, .02, 2, mat(0x1a1a1a), 4, g, 0, 13, 0); const bulb = sphere(.4, glowM(0xffd890, 3), g, 0, 11.6, 0, 10, 8); const BL = new THREE.PointLight(0xffc878, 90, 40, 1.5); BL.position.set(0, 11, 0); g.add(BL);
  const D = dose(sh); D.position.set(2.6, 1.35, -.1); D.scale.setScalar(.9);
  const cob = []; for (let k = 0; k < 5; k++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .35, side: THREE.DoubleSide, map: canvasTex(64, 64, (c) => { c.strokeStyle = '#fff'; c.lineWidth = 1; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(64 * Math.cos(i / 8 * 1.57), 64 * Math.sin(i / 8 * 1.57)); c.stroke(); } for (let r = 10; r < 64; r += 10) { c.beginPath(); c.arc(0, 0, r, 0, 1.57); c.stroke(); } }) })); w.position.set(k % 2 ? 14.6 : -14.6, 13.4, -10 + k * 4); w.rotation.y = k % 2 ? -Math.PI / 2 : Math.PI / 2; w.userData.noOutline = true; g.add(w); }
  return { g: shade(g), D, BL, bulb }; }

// ---------- cocina-salón de Oma (X): mesa con mantel de cuadros en (0, 0), Kanne de flores, ventana con cortinas en z = -12 (día/noche),
// aparador, reloj de cuco, sillón y la tele a la derecha (tele en (14, -6) mirando a -x… al sillón en (4, -6)). ----------
export function omaKueche(scene, X) { const g = room(scene, X, 36, 26, 16, mat(0xffffff, { map: rep(wallp('#f4e4c0', '#e8d0a0', 1), 6, 2), roughness: .9 }), mat(0xffffff, { map: rep(plank('#a8784a', '#946638'), 4, 4), roughness: .6 }));
  box(36, 5, .5, mat(0xffffff, { map: rep(plank('#7a4a26', '#6a3e1e'), 6, 1) }), 0, g, 0, 2.5, -12.8);
  const tb = G(g, -4, 0, 0); const cl = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#fbf6ee'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(200,40,50,.55)'; for (let i = 0; i < 8; i += 2) { c.fillRect(i * 8, 0, 8, h); c.fillRect(0, i * 8, w, 8); } });
  box(12, .4, 7, mat(0xffffff, { map: rep(cl, 3, 2), roughness: .9 }), .1, tb, 0, 4.1, 0); box(12.4, .8, 7.4, mat(0xffffff, { map: rep(cl, 3, 2) }), .05, tb, 0, 3.6, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(.22, .2, 3.6, mat(0x7a4a26), 8, tb, sx * 5.4, 1.8, sz * 3);
  const OK = omaKanne(tb); OK.position.set(-1.2, 4.3, -1); const KU = kuchen(tb, { s: .9 }); KU.position.set(2.6, 4.3, .4); const CUPS = []; for (let k = 0; k < 3; k++) { const t = tasse(tb, { col: 0xfbf8f2, dots: '#2a4ab8', band: 0xd8a020 }); t.position.set(-4 + k * 3.2, 4.3, 1.8); t.scale.setScalar(.8); CUPS.push(t); }
  for (const x of [-3, 3]) { chair(tb, x, 4.8, Math.PI, 0x7a4a26); chair(tb, x, -4.8, 0, 0x7a4a26); }
  const win = G(g, -4, 9, -12.6); const WP = new THREE.Mesh(new THREE.PlaneGeometry(10, 7), new THREE.MeshBasicMaterial({ color: 0x9fd2f2 })); win.add(WP); box(10.8, .5, .6, mat(0xfbfbf8), .05, win, 0, -3.6, .2); box(.4, 7.4, .4, mat(0xfbfbf8), 0, win, 0, 0, .1); box(10.4, .4, .4, mat(0xfbfbf8), 0, win, 0, 0, .1);
  for (const s of [-1, 1]) { const c = box(3, 8.6, .3, mat(0xc8202a, { roughness: .9 }), .2, win, s * 6, -.2, .4); }
  for (let k = 0; k < 5; k++) sphere(.4, mat([0xe8323a, 0xffffff, 0xff8ad0][k % 3]), win, -3 + k * 1.5, -3.2, .5, 8, 6);
  const sb = G(g, 14, 0, -11); box(10, 7, 2.6, mat(0x7a4a26, { roughness: .6 }), .2, sb, 0, 3.5, 0); for (let k = 0; k < 4; k++) { const p = new THREE.Mesh(new THREE.CircleGeometry(.9, 20), mat(0xfbf8f2)); p.position.set(-3.6 + k * 2.4, 9.4, .2); sb.add(p); } box(10, 4.4, 1.6, mat(0x7a4a26), .1, sb, 0, 9.4, -.4);
  const cu = G(g, -14, 11, -12.4); box(2.6, 3, 1, mat(0x6a3a1a), .2, cu, 0, 0, 0); const rf = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.4, 4), mat(0x4a2a12)); rf.rotation.y = Math.PI / 4; rf.position.y = 2.1; cu.add(rf); const fc = new THREE.Mesh(new THREE.CircleGeometry(.7, 16), mat(0xfbf6ee)); fc.position.z = .52; cu.add(fc);
  const arm = G(g, 6, 0, -5); arm.rotation.y = Math.PI / 2; box(4.4, 2.2, 4, mat(0x2e6a3a, { roughness: .9 }), .5, arm, 0, 1.6, 0); box(4.4, 4, 1, mat(0x2e6a3a), .5, arm, 0, 4, -1.8); for (const s of [-1, 1]) box(.9, 2.6, 4, mat(0x2e6a3a), .4, arm, s * 2.2, 2.6, 0);
  const tvg = G(g, 15.6, 0, -5); tvg.rotation.y = -Math.PI / 2; box(7, 3, 3, mat(0x6a4a2a), .2, tvg, 0, 1.5, 0); box(7.6, 4.6, .8, mat(0x1a1a1e, { roughness: .4 }), .2, tvg, 0, 5.4, 0);
  const tc = document.createElement('canvas'); tc.width = 512; tc.height = 288; const TT = new THREE.CanvasTexture(tc); TT.colorSpace = THREE.SRGBColorSpace; const scr = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.94), new THREE.MeshBasicMaterial({ map: TT, toneMapped: false })); scr.position.set(0, 5.4, .42); tvg.add(scr);
  const TV = { draw(fn) { const c = tc.getContext('2d'); fn(c, 512, 288); TT.needsUpdate = true; }, g: tvg, scr };
  potted(g, -15, 9, 1.2); const L = new THREE.PointLight(0xffe0b0, 80, 50, 1.4); L.position.set(-4, 13, 2); g.add(L);
  return { g: shade(g), OK, KU, CUPS, WP, TV, tb, arm }; }

// ---------- plató de noticias (X): mesa curva en z = -2, presentadora detrás (z = -5), pantalla gigante al fondo (z = -12). ----------
export function studio(scene, X) { const g = room(scene, X, 44, 30, 20, mat(0x0a1636, { roughness: .6 }), mat(0xffffff, { map: rep(tiles('#14204a', '#0e1838', 4), 8, 6), roughness: .3, metalness: .3 }), 0x0a1020);
  const desk = G(g, 0, 0, -2); box(14, 4.2, 3, mat(0xfbfbf8, { roughness: .3 }), .6, desk, 0, 2.1, 0); box(14.6, .3, 3.6, mat(0x2a4ab8, { roughness: .2, metalness: .4 }), .1, desk, 0, 4.3, 0); const lg = textPlane(6, 1.4, 300, 70, (c, w, h) => { c.fillStyle = '#d8101a'; c.fillRect(0, 0, w, h); txt(c, 'RTV 24', w / 2, h / 2 + 2, 52, '#ffffff'); }); lg.position.set(0, 2.4, 1.55); desk.add(lg);
  const sc = document.createElement('canvas'); sc.width = 1024; sc.height = 576; const ST = new THREE.CanvasTexture(sc); ST.colorSpace = THREE.SRGBColorSpace; const scr = new THREE.Mesh(new THREE.PlaneGeometry(30, 16.9), new THREE.MeshBasicMaterial({ map: ST, toneMapped: false })); scr.position.set(0, 10, -14.7); g.add(scr);
  for (let k = 0; k < 10; k++) { const b = box(.3, 20, .3, glowM(0x2a6ad8, 1.6), 0, g, -21 + k * 4.6, 10, -14.6); } const L = new THREE.PointLight(0xffffff, 120, 50, 1.3); L.position.set(0, 14, 8); g.add(L);
  return { g: shade(g), SCR: { draw(fn) { const c = sc.getContext('2d'); fn(c, 1024, 576); ST.needsUpdate = true; } } }; }

// ---------- el mar con el crucero (X): agua con olas, cielo, el MS Espresso en (0, 0, 0) con la proa hacia +z; islas al fondo. ----------
export function meer(scene, X) { const g = G(scene, X); const wt = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#2a8ac8'; c.fillRect(0, 0, w, h); const q = RNG(3); for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(255,255,255,${q() * .35})`; c.fillRect(q() * w, q() * h, 6 + q() * 16, 2); } });
  const W = plane(3000, 3000, mat(0xffffff, { map: rep(wt, 120, 120), roughness: .15, metalness: .2 }), g, 0, -1, 0); W.userData.noOutline = true;
  const S = schiff(g); for (let k = 0; k < 4; k++) { const is = sphere(60, mat(0x4aa04a, { roughness: 1 }), g, -300 + k * 200, -40, -700 - (k % 2) * 150, 16, 10); is.scale.y = .4; for (let j = 0; j < 4; j++) { const p = G(g, -300 + k * 200 + (j - 1.5) * 20, 0, -680 - (k % 2) * 150); cyl(1, 1.4, 22, mat(0x8a6a4a), 6, p, 0, 11, 0); for (let l = 0; l < 5; l++) { const f = box(10, .3, 2.4, mat(0x3a9a3a), .1, p, Math.cos(l * 1.26) * 4, 22, Math.sin(l * 1.26) * 4); f.rotation.y = l * 1.26; f.rotation.z = -.4; } } }
  return { g: shade(g), S, W }; }

// ---------- villa con piscina, paisaje del castillo y la cama de las mil almohadas: en main con pech.villa, schloss y bett ----------
export { krone, filter, pack, dose };
