// HUSS — escenarios y atrezo propios: Bolzplatz nocturno, estadio de la Sommerparty, salón de fiestas, balón, porterías,
// gorros de fiesta, Herr Blubb (pez dorado) en su pecera, tarta, pizzas, guitarra, saco de boxeo, esterilla de yoga, marcador.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp } from './engine.js';
import { noiseTex, stripes, tree, lamp } from './props.js';
import { FONT } from './sets.js';
import { bunting, signBoard } from './wsets.js';
import { house } from './pech.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const basic = (r, g, b, o = {}) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), toneMapped: false, ...o });
const plane = (w, h, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const grassT = (a = '#4cb83e') => noiseTex(a, ['#3ea832', '#5cc84a', '#48b03c'], 2400, 3, 1);
const PCOL = [0xff4a6a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xb86aff, 0xff8a3a];

// ---------- balón de fútbol ----------
const ballTex = () => canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#16161c';
  const pent = (x, y, r) => { c.beginPath(); for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283 - 1.57; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); c.fill(); };
  for (let i = 0; i < 6; i++) { pent(i * 43 + 10, 30, 13); pent(i * 43 + 31, 82, 13); } pent(w / 2, 4, 30); pent(w / 2, h - 4, 30);
  c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(i * 22, 0); c.lineTo(i * 22 + 11, h); c.stroke(); } });
let BT = null;
export function football(parent, r = .55) { BT = BT || ballTex(); const b = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(0xffffff, { map: BT, roughness: .45 })); b.castShadow = true; if (parent) parent.add(b); b.userData.r = r; return b; }

// ---------- portería con red (NET se puede inflar: NET.scale.z) ----------
export function goal(parent, x, z, ry = 0, w = 12, h = 5, d = 3.4) { const g = G(parent, x, 0, z); g.rotation.y = ry; const wm = mat(0xffffff, { roughness: .3 });
  for (const s of [-1, 1]) cyl(.18, .18, h, wm, 10, g, s * w / 2, h / 2, 0); const cb = cyl(.18, .18, w + .36, wm, 10, g, 0, h, 0); cb.rotation.z = Math.PI / 2;
  for (const s of [-1, 1]) { const bk = cyl(.08, .08, Math.hypot(d, h), mat(0xd8dce4), 6, g, s * w / 2, h / 2, -d / 2); bk.rotation.x = Math.atan2(d, h); }
  const netT = canvasTex(128, 128, (c, W, H) => { c.clearRect(0, 0, W, H); c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 3; for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(i * W / 8, 0); c.lineTo(i * W / 8, H); c.moveTo(0, i * H / 8); c.lineTo(W, i * H / 8); c.stroke(); } }, true);
  const nm = new THREE.MeshStandardMaterial({ map: rep(netT, w / 1.5, h / 1.5), transparent: true, side: THREE.DoubleSide, roughness: 1, depthWrite: false, alphaTest: .3 });
  const NET = G(g); const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 8, 6), nm); back.position.set(0, h / 2, -d); NET.add(back);
  for (const s of [-1, 1]) { const sm = nm.clone(); sm.map = rep(netT.clone(), d / 1.5, h / 1.5); const sd = new THREE.Mesh(new THREE.PlaneGeometry(d, h), sm); sd.rotation.y = Math.PI / 2; sd.position.set(s * w / 2, h / 2, -d / 2); NET.add(sd); }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w, d), nm); top.rotation.x = Math.PI / 2; top.position.set(0, h, -d / 2); NET.add(top);
  g.userData.NET = NET; g.userData.w = w; g.userData.h = h; g.userData.bulge = k => { back.position.z = -d - k * 1.6; back.scale.y = 1 - k * .05; }; return g; }

// ---------- gorro de fiesta (cono a rayas con pompón) ----------
const hatTex = {}; const hatT = (a, b) => hatTex[a + b] || (hatTex[a + b] = canvasTex(64, 64, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? b : a; c.fillRect(0, i * h / 8, w, h / 8 + 1); } c.fillStyle = 'rgba(255,255,255,.8)'; for (let k = 0; k < 10; k++) { c.beginPath(); c.arc((k * 23) % w, (k * 37) % h, 3, 0, 7); c.fill(); } }));
const HC = [['#ff4a6a', '#ffd23f'], ['#3ab8ff', '#ffffff'], ['#8ad84a', '#ff8a3a'], ['#b86aff', '#ffd23f'], ['#ffd23f', '#ff4a6a'], ['#ff8a3a', '#3ab8ff']];
export function partyHat(head, i = 0, y = 1.32, tilt = .18) { const [a, b] = HC[i % HC.length]; const g = G(head, .12, y, 0); g.rotation.z = -tilt;
  const c = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.45, 18), mat(0xffffff, { map: hatT(a, b), roughness: .6 })); c.position.y = .72; c.castShadow = true; g.add(c);
  sphere(.2, mat(0xffffff, { roughness: 1 }), g, 0, 1.48, 0, 10, 8); const el = new THREE.Mesh(new THREE.TorusGeometry(.5, .05, 6, 18), mat(new THREE.Color(b).getHex())); el.rotation.x = Math.PI / 2; el.position.y = .02; g.add(el); g.visible = false; return g; }

// ---------- Herr Blubb (pez dorado) y su pecera ----------
export function goldfish(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const or = mat(0xff8a1a, { roughness: .35, emissive: 0x6a2a00, emissiveIntensity: .25 }), fin = mat(0xffb84a, { roughness: .4, transparent: true, opacity: .92 });
  const body = sphere(.9, or, g, 0, 0, 0, 22, 16); body.scale.set(.8, .9, 1.25);
  const tail = new THREE.Group(); tail.position.z = -1.05; g.add(tail); for (const s2 of [-1, 1]) { const t = new THREE.Mesh(new THREE.ConeGeometry(.55, 1.1, 4), fin); t.rotation.set(Math.PI / 2 + s2 * .55, 0, 0); t.scale.x = .25; t.position.set(0, s2 * .35, -.45); tail.add(t); }
  const top = new THREE.Mesh(new THREE.ConeGeometry(.35, .8, 4), fin); top.scale.z = 2.2; top.scale.x = .2; top.position.set(0, .85, -.1); top.rotation.x = -.4; g.add(top);
  const fins = []; for (const s2 of [-1, 1]) { const f = new THREE.Mesh(new THREE.ConeGeometry(.25, .7, 4), fin); f.scale.x = .25; f.position.set(s2 * .65, -.25, .25); f.rotation.set(1.9, 0, s2 * .7); g.add(f); fins.push(f); }
  const eyes = []; for (const s2 of [-1, 1]) { const e = G(g, s2 * .52, .25, .72); sphere(.26, mat(0xffffff, { roughness: .2 }), e, 0, 0, 0, 14, 10); const p = sphere(.15, mat(0x101018, { roughness: .1 }), e, s2 * .06, 0, .14, 10, 8); sphere(.05, basic(1, 1, 1), e, s2 * .02, .06, .26, 6, 4); eyes.push({ e, p }); }
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(.16, .06, 8, 16), mat(0xd84a1a)); mouth.position.set(0, -.15, 1.08); g.add(mouth);
  const blush = []; for (const s2 of [-1, 1]) { const b = sphere(.14, mat(0xff6a8a, { transparent: true, opacity: .6 }), g, s2 * .62, -.05, .6, 8, 6); b.scale.z = .3; blush.push(b); }
  const hat = G(g, 0, .9, .25); hat.rotation.x = -.15; const hc = new THREE.Mesh(new THREE.ConeGeometry(.32, .9, 16), mat(0xffffff, { map: hatT('#b86aff', '#ffd23f') })); hc.position.y = .45; hat.add(hc); sphere(.13, mat(0xffffff), hat, 0, .92, 0, 8, 6);
  g.userData = { tail, fins, eyes, mouth, hat, swim(T, k = 1) { tail.rotation.y = Math.sin(T * 9) * .5 * k; fins.forEach((f, i) => f.rotation.z = (i ? 1 : -1) * (.7 + Math.sin(T * 7 + i) * .3)); },
    face(happy) { mouth.scale.set(happy ? 1.4 : 1, happy ? .7 : 1, 1); mouth.rotation.z = 0; mouth.position.y = happy ? -.2 : -.15; blush.forEach(b => b.visible = !!happy); } };
  shade(g); return g; }
export function fishbowl(parent, s = 1) { const g = G(parent); g.scale.setScalar(s);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 24, 0, 6.283, .5, 2.4), new THREE.MeshPhysicalMaterial({ color: 0xd8f4ff, transparent: true, opacity: .26, roughness: .02, metalness: 0, side: THREE.DoubleSide, depthWrite: false })); glass.position.y = 2.1; g.add(glass);
  const water = new THREE.Mesh(new THREE.SphereGeometry(2.08, 28, 20, 0, 6.283, .95, 2.1), new THREE.MeshStandardMaterial({ color: 0x5ad0ff, transparent: true, opacity: .18, roughness: .05, emissive: 0x1a6a9a, emissiveIntensity: .2, depthWrite: false })); water.position.y = 2.1; g.add(water);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.06, .07, 8, 30), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: .5, roughness: .05 })); rim.rotation.x = Math.PI / 2; rim.position.y = 4.03; g.add(rim);
  for (let k = 0; k < 14; k++) sphere(.22, mat([0xff6a8a, 0x3ab8ff, 0xffd23f, 0xffffff][k % 4], { roughness: .4 }), g, Math.cos(k * 2.4) * 1.0, .35, Math.sin(k * 2.4) * 1.0, 8, 6);
  const plant = G(g, -.8, .3, -.4); for (let k = 0; k < 4; k++) { const l = box(.14, 1.6, .06, mat(0x2ab86a), .03, plant, k * .2, .8, 0); l.rotation.z = (k - 1.5) * .18; }
  const castle = G(g, .9, .3, -.6); box(.7, .9, .7, mat(0xc8a0f0), .06, castle, 0, .45, 0); for (const s2 of [-1, 1]) box(.25, 1.2, .25, mat(0xb88ae8), .04, castle, s2 * .3, .6, .3);
  const fish = goldfish(g, .62); fish.position.set(0, 2.2, 0);
  const BUB = []; for (let k = 0; k < 6; k++) { const b = sphere(.1, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .7, roughness: .1 }), g, 0, 0, 0, 8, 6); BUB.push(b); }
  g.userData = { fish, BUB, glass, bubbles(T) { BUB.forEach((b, i) => { const k = (T * .45 + i / 6) % 1; b.position.set(Math.sin(i * 2.1 + T) * .3 + .2, 2.4 + k * 1.6, .5 + Math.cos(i) * .2); b.scale.setScalar(.6 + k); }); } };
  return g; }

// ---------- tarta, pizzas, regalos, globos, bola de discoteca, altavoz, mesa DJ ----------
export function cake(parent, candles = 3, s = 1) { const g = G(parent); g.scale.setScalar(s); cyl(1.6, 1.6, .12, mat(0xffffff, { roughness: .2 }), 24, g, 0, .06, 0);
  cyl(1.3, 1.3, .9, mat(0xff9ac0, { roughness: .7 }), 24, g, 0, .55, 0); cyl(.95, .95, .7, mat(0xfff4e0, { roughness: .7 }), 24, g, 0, 1.35, 0); for (let k = 0; k < 12; k++) sphere(.14, mat(0xffffff), g, Math.cos(k / 12 * 6.283) * 1.3, 1.0, Math.sin(k / 12 * 6.283) * 1.3, 6, 4);
  for (let k = 0; k < 10; k++) sphere(.1, mat(PCOL[k % 6]), g, Math.cos(k * 2.4) * .7, 1.72, Math.sin(k * 2.4) * .7, 6, 4);
  const FL = []; for (let k = 0; k < candles; k++) { const a = k / candles * 6.283, x = Math.cos(a) * .45, z = Math.sin(a) * .45; cyl(.07, .07, .6, mat(PCOL[k % 6]), 8, g, x, 2.0, z); const f = sphere(.11, basic(3, 2, .6), g, x, 2.42, z, 8, 6); f.scale.y = 1.6; FL.push(f); }
  g.userData.FL = FL; return g; }
export function pizza(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); cyl(1.3, 1.3, .14, mat(0xe8b060, { roughness: .8 }), 28, g, 0, .07, 0); cyl(1.15, 1.15, .06, mat(0xe8402a, { roughness: .6 }), 28, g, 0, .16, 0);
  for (let k = 0; k < 14; k++) { const c = cyl(.16, .16, .04, mat(k % 3 ? 0xffe08a : 0xa82a2a, { roughness: .7 }), 10, g, Math.cos(k * 2.4) * (.3 + (k % 4) * .2), .2, Math.sin(k * 2.4) * (.3 + (k % 4) * .2)); } return g; }
export function pizzaBox(parent, open = true) { const g = G(parent); box(2.8, .3, 2.8, mat(0xf4f0e8, { roughness: .9 }), .03, g, 0, .15, 0); if (open) { const l = box(2.8, .05, 2.8, mat(0xe8dcc8), .02, g, 0, 1.45, -1.4); l.rotation.x = Math.PI / 2; } pizza(g, 1).position.y = .2; return g; }
export function gift(parent, col, s = 1) { const g = G(parent); g.scale.setScalar(s); box(1, 1, 1, mat(col, { roughness: .5 }), .06, g, 0, .5, 0); box(1.04, 1.02, .18, mat(0xffffff), .02, g, 0, .5, 0); box(.18, 1.02, 1.04, mat(0xffffff), .02, g, 0, .5, 0); for (const s2 of [-1, 1]) { const b = new THREE.Mesh(new THREE.TorusGeometry(.18, .06, 6, 12), mat(0xffffff)); b.position.set(s2 * .17, 1.08, 0); b.rotation.y = Math.PI / 2; g.add(b); } return g; }
export function balloons(parent, x, y, z, n = 3, seed = 1) { const g = G(parent, x, y, z); const r = RNG(seed); for (let k = 0; k < n; k++) { const bx = (r() - .5) * 1.6, by = 3 + r() * 1.4; const st = cyl(.02, .02, by, mat(0xffffff), 3, g, bx / 2, by / 2, 0); st.rotation.z = -bx / by; const b = sphere(.75, mat(PCOL[(k + seed) % 6], { roughness: .15 }), g, bx, by + .7, 0, 14, 12); b.scale.y = 1.2; } return g; }
export function discoBall(parent, x, y, z, s = 1) { const g = G(parent, x, y, z); g.scale.setScalar(s); cyl(.04, .04, 2, mat(0xaaaaaa), 4, g, 0, 1.6, 0);
  const t = canvasTex(128, 64, (c, w, h) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 8; j++) { const v = 150 + ((i * 7 + j * 13) % 9) * 12; c.fillStyle = `rgb(${v},${v},${v + 20})`; c.fillRect(i * 8, j * 8, 7, 7); } });
  const b = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshStandardMaterial({ map: t, metalness: .9, roughness: .15, emissive: 0x9a9ab8, emissiveIntensity: .5 })); g.add(b); g.userData.b = b; return g; }
export function speaker(parent, x, z, s = 1, ry = 0) { const g = G(parent, x, 0, z); g.scale.setScalar(s); g.rotation.y = ry; box(2.4, 4.2, 2, mat(0x1a1a22, { roughness: .6 }), .12, g, 0, 2.1, 0);
  const cones = []; for (const [y, r] of [[3.2, .55], [1.5, .85]]) { const c = cyl(r, r, .2, mat(0x2a2a34, { roughness: .4 }), 20, g, 0, y, 1.0); c.rotation.x = Math.PI / 2; const d = cyl(r * .35, r * .35, .25, mat(0x5a5a68, { metalness: .6 }), 14, g, 0, y, 1.05); d.rotation.x = Math.PI / 2; cones.push(c); }
  const led = box(1.6, .12, .1, glowM(0x3ab8ff, 2), .02, g, 0, 4.0, 1.02); g.userData = { cones, led }; return g; }
export function djDesk(parent, x, z, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry; box(6, 3, 2.4, mat(0x1a1a24, { roughness: .5 }), .1, g, 0, 1.5, 0); const front = textPlane(5.6, 1.6, 256, 72, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#ff4a8a'); gr.addColorStop(1, '#3ab8ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('DJ', w / 2, h / 2 + 3); }, .8); front.position.set(0, 1.6, 1.22); g.add(front);
  const decks = []; for (const s of [-1, 1]) { const p = cyl(.85, .85, .12, mat(0x2a2a34), 24, g, s * 1.6, 3.08, .1); const rec = cyl(.75, .75, .04, mat(0x101014, { roughness: .2 }), 24, g, s * 1.6, 3.16, .1); const lbl = cyl(.22, .22, .05, mat(PCOL[s + 1]), 12, g, s * 1.6, 3.19, .1); decks.push(rec, lbl); } box(.9, .2, 1.2, mat(0x3a3a48), .05, g, 0, 3.1, .1); g.userData.decks = decks; return g; }

// ---------- marcador (pantalla dinámica) ----------
export function scoreboard(parent, x, y, z, ry = 0, s = 1) { const g = G(parent, x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); for (const s2 of [-1, 1]) cyl(.3, .3, y, mat(0x3a3a48, { metalness: .5 }), 10, g, s2 * 5, y / 2, -.6);
  box(12.4, 6.4, 1, mat(0x1a1a22, { roughness: .4 }), .2, g, 0, y + 2.6, -.4);
  const cv = document.createElement('canvas'); cv.width = 576; cv.height = 288; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 5.8), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); scr.position.set(0, y + 2.6, .12); g.add(scr); let last = '';
  g.userData.set = (home, away, flash = 0) => { const key = home + ':' + away + ':' + (flash > .5); if (key === last) return; last = key; const c = cv.getContext('2d'); c.fillStyle = '#05060c'; c.fillRect(0, 0, 576, 288);
    c.font = `700 44px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffd23f'; c.fillText('HEIM', 150, 52); c.fillText('GÄSTE', 426, 52);
    c.font = `700 150px ${FONT}`; c.fillStyle = flash > .5 ? '#ffffff' : '#ff4a3a'; c.shadowColor = '#ff4a3a'; c.shadowBlur = 20; c.fillText(String(home), 150, 180); c.fillStyle = '#ff4a3a'; c.fillText(String(away), 426, 180); c.shadowBlur = 0; c.fillStyle = '#ffd23f'; c.fillText(':', 288, 170);
    c.fillStyle = 'rgba(255,255,255,.06)'; for (let yy = 0; yy < 288; yy += 6) c.fillRect(0, yy, 576, 2); t.needsUpdate = true; };
  g.userData.set(0, 0); return g; }

// ---------- multitud instanciada para las gradas (cuerpo, cabeza, cara, gorro) ----------
function faceT(kind) { return canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#16161c'; c.strokeStyle = '#16161c'; c.lineWidth = 5; c.lineCap = 'round';
  if (kind === 'happy') { for (const s of [-1, 1]) { c.beginPath(); c.arc(w / 2 + s * 13, 26, 6, Math.PI, 0); c.stroke(); } c.fillStyle = '#c8203a'; c.beginPath(); c.arc(w / 2, 38, 13, 0, Math.PI); c.fill(); }
  else { for (const s of [-1, 1]) { c.beginPath(); c.arc(w / 2 + s * 13, 26, 5, 0, 7); c.fill(); } c.beginPath(); c.arc(w / 2, 44, 5, 0, 7); c.fill(); } }); }
export function crowd(scene, n) { const g = G(scene); const body = new THREE.InstancedMesh(new THREE.BoxGeometry(2, 2.6, 1.1), mat(0xffffff, { roughness: .8 }), n), head = new THREE.InstancedMesh(new THREE.BoxGeometry(1.3, 1.25, 1.2), mat(0xffffff, { roughness: .5 }), n);
  const arms = new THREE.InstancedMesh(new THREE.BoxGeometry(3.4, .7, .7), mat(0xffffff, { roughness: .8 }), n), hat = new THREE.InstancedMesh(new THREE.ConeGeometry(.45, 1.3, 12), mat(0xffffff, { roughness: .6 }), n);
  const FH = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshStandardMaterial({ map: faceT('happy'), transparent: true, roughness: .6 }), n), FS = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshStandardMaterial({ map: faceT('shock'), transparent: true, roughness: .6 }), n);
  const skins = [0xf2c4a0, 0xd8a07a, 0x8a5a3a, 0xf4cfb6, 0xc68b5e, 0xeab08a], shirts = [0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0xff8ad0, 0xf4f4f4, 0x6a3ad8, 0xff8a3a, 0x1aa0a0], C = new THREE.Color(); const r = RNG(77);
  for (let i = 0; i < n; i++) { body.setColorAt(i, C.setHex(shirts[i % 9])); arms.setColorAt(i, C.setHex(shirts[i % 9])); head.setColorAt(i, C.setHex(skins[(i * 7) % 6])); hat.setColorAt(i, C.setHex(PCOL[(i * 5) % 6])); }
  [body, head, arms, hat, FH, FS].forEach(m => { m.castShadow = m !== FH && m !== FS; m.receiveShadow = true; m.frustumCulled = false; g.add(m); });
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), S1 = new THREE.Vector3(1, 1, 1);
  const seat = Array.from({ length: n }, () => ({ x: 0, y: 0, z: 0, ry: 0, ph: r() * 6.28, sp: .8 + r() * .6 }));
  const place = (m, i, x, y, z, ry, rz = 0) => { Q.setFromEuler(E.set(0, ry, rz)); M.compose(P.set(x, y, z), Q, S1); m.setMatrixAt(i, M); };
  const C_ = { g, seat, n, update(T, mode = 'cheer', silent = false, cnt = n) { for (let i = 0; i < cnt; i++) { const s = seat[i]; const j = mode === 'cheer' ? Math.max(0, Math.sin(T * 7 * s.sp + s.ph)) * .7 : mode === 'sway' ? Math.sin(T * 3 + s.ph) * .15 : 0; const sw = mode === 'still' ? 0 : Math.sin(T * 2 + s.ph) * .08;
      const fx = Math.sin(s.ry), fz = Math.cos(s.ry); place(body, i, s.x, s.y + 1.3 + j, s.z, s.ry, sw); place(head, i, s.x, s.y + 3.25 + j, s.z, s.ry, sw); place(hat, i, s.x + .1, s.y + 4.5 + j, s.z, s.ry, -.2);
      const up = mode === 'cheer' ? 2.4 + j : mode === 'sway' ? 1.6 : 1.4; place(arms, i, s.x, s.y + up + (mode === 'still' ? 0 : 0), s.z, s.ry, 0);
      const fp = [s.x + fx * .61, s.y + 3.22 + j, s.z + fz * .61]; place(silent ? FS : FH, i, ...fp, s.ry); place(silent ? FH : FS, i, 0, -999, 0, 0); }
    for (const m of [body, head, arms, hat, FH, FS]) { m.count = cnt; m.instanceMatrix.needsUpdate = true; } } };
  return C_; }

// ---------- estadio de la Sommerparty (X): campo 40 × 70 (x ∈ ±20, z ∈ ±35), portería de casa en z = -35 (mirando +z),
// gradas a la izquierda (x = -24 … -44, filas que suben), pancarta SOMMERPARTY-SPIEL, marcador detrás de la portería,
// mesa del DJ y altavoces en la banda derecha (x = 24), banderines y focos.
export function stadion(scene, X) { const g = G(scene, X); plane(600, 600, mat(0xffffff, { roughness: 1, map: rep(grassT('#4cb83e'), 60, 60) }), g, 0, -.06, 0);
  const pitchT = canvasTex(256, 256, (c, w, h) => { for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? '#4fc040' : '#45b036'; c.fillRect(0, i * h / 10, w, h / 10 + 1); } const r = RNG(5); for (let i = 0; i < 1400; i++) { c.fillStyle = `rgba(${r() < .5 ? '20,80,10' : '150,240,120'},.18)`; c.fillRect(r() * w, r() * h, 2, 3); } });
  plane(44, 74, mat(0xffffff, { map: pitchT, roughness: .95 }), g, 0, .0, 0);
  const lm = mat(0xffffff, { roughness: .6 }); const line = (w, d, x, z) => box(w, .05, d, lm, 0, g, x, .04, z);
  line(40.4, .3, 0, 35); line(40.4, .3, 0, -35); line(.3, 70, 20, 0); line(.3, 70, -20, 0); line(40, .3, 0, 0);
  const cc = new THREE.Mesh(new THREE.RingGeometry(6, 6.3, 48), lm); cc.rotation.x = -Math.PI / 2; cc.position.y = .05; g.add(cc);
  for (const s of [-1, 1]) { line(22, .3, 0, s * 23); line(.3, 12, -11, s * 29); line(.3, 12, 11, s * 29); }
  const G1 = goal(g, 0, -35, 0), G2 = goal(g, 0, 35, Math.PI);
  // gradas: 7 filas escalonadas a la izquierda
  const st = mat(0xb8bcc8, { roughness: .8 }), seatM = [mat(0xd8323a), mat(0x2a6ad8), mat(0xffd23f)];
  for (let r = 0; r < 7; r++) { box(8 + 0, 1.6, 74, st, .05, g, -26 - r * 2.6, .8 + r * 1.6, 0); box(2.6, 1.6 + r * 1.6, 74, st, .05, g, -26 - r * 2.6, (1.6 + r * 1.6) / 2, 0); box(.6, .5, 74, seatM[r % 3], .05, g, -25.3 - r * 2.6, 1.85 + r * 1.6, 0); }
  box(1, 13, 74, mat(0x8a8e9a), .05, g, -44.5, 6.5, 0); box(4, .3, 74, mat(0xf4f4f4), .05, g, -21.6, 1.2, 0);
  for (let z = -36; z <= 36; z += 4) cyl(.06, .06, 1.2, mat(0xd8dce4), 4, g, -21.6, 1.8, z); const rail = cyl(.08, .08, 74, mat(0xd8dce4, { metalness: .7 }), 6, g, -21.6, 2.4, 0); rail.rotation.x = Math.PI / 2;
  // pancarta
  const ban = signBoard('SOMMERPARTY-SPIEL', 30, 4.2, '#ffd23f', '#d8323a', '#d8323a', .35); ban.position.set(-30, 17, 0); ban.rotation.y = Math.PI / 2; g.add(ban); for (const s of [-1, 1]) cyl(.3, .3, 19, mat(0xf4f4f4), 8, g, -30, 9.5, s * 15.4);
  const ban2 = signBoard('SOMMERPARTY-SPIEL', 22, 3.2, '#ff4a8a', '#ffffff', '#ffffff', .4); ban2.position.set(0, 10.5, -44); g.add(ban2); for (const s of [-1, 1]) cyl(.25, .25, 12, mat(0xf4f4f4), 8, g, s * 11.2, 6, -44.1);
  const SB = scoreboard(g, 0, 11, -52, 0, 1.25);
  // banderines y globos sobre la banda
  for (let z = -34; z < 34; z += 17) bunting(g, [-21.6, 8, z], [-21.6, 8, z + 17], 14, 1.2); for (let x = -20; x < 20; x += 10) bunting(g, [x, 8, -44], [x + 10, 8, -44], 10, 1);
  
  // DJ y altavoces en la banda derecha
  const DJ = djDesk(g, 25.5, -6, -Math.PI / 2); const SP = [speaker(g, 25.5, -12, 1.3, -Math.PI / 2), speaker(g, 25.5, 0, 1.3, -Math.PI / 2)];
  // focos
  for (const [x, z] of [[-48, -40], [-48, 40], [30, -40], [30, 40]]) { cyl(.5, .7, 34, mat(0x8a8e9a, { metalness: .6 }), 10, g, x, 17, z); box(6, 3, 1, mat(0x2a2a34), .1, g, x, 34, z); for (let i = 0; i < 6; i++) box(.8, .8, .3, basic(3, 3, 2.6), .05, g, x - 2.2 + (i % 3) * 2.2, 33.4 + (i > 2 ? 1.2 : 0), z + (z > 0 ? -.6 : .6)); }
  // fondo: casas y colinas
  for (let k = 0; k < 9; k++) { const hh = house(g, -60 + k * 16, -88, k, 0); hh.scale?.setScalar?.(1); }
  for (let k = 0; k < 6; k++) { const h = new THREE.Mesh(new THREE.SphereGeometry(40, 20, 10, 0, 6.283, 0, 1.4), mat(0x5aa84a, { roughness: 1 })); h.position.set(-140 + k * 60, -18, -150 - (k % 2) * 30); h.scale.y = .7; g.add(h); }
  for (let k = 0; k < 12; k++) tree(g, -70 + k * 13, -70 - (k % 2) * 6, 1);
  shade(g); cc.receiveShadow = true; return { g, G1, G2, SB, DJ, SP, ban }; }

// ---------- Bolzplatz (X): jaula de fútbol de barrio con suelo de goma, portería pequeña, valla metálica, foco nocturno,
// neumático colgado, conos y casas detrás. Centro en (0, 0), portería en z = -14 mirando +z.
export function bolzplatz(scene, X) { const g = G(scene, X); plane(400, 400, mat(0xffffff, { roughness: 1, map: rep(grassT('#3e9a34'), 40, 40) }), g, 0, -.06, 0);
  const rub = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#c8503a'; c.fillRect(0, 0, w, h); const r = RNG(8); for (let i = 0; i < 3000; i++) { c.fillStyle = `rgba(${r() < .5 ? '90,20,10' : '255,140,110'},.25)`; c.fillRect(r() * w, r() * h, 2, 2); } c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.strokeRect(10, 10, w - 20, h - 20); c.beginPath(); c.moveTo(10, h / 2); c.lineTo(w - 10, h / 2); c.stroke(); c.beginPath(); c.arc(w / 2, h / 2, 30, 0, 7); c.stroke(); });
  plane(28, 36, mat(0xffffff, { map: rub, roughness: .9 }), g, 0, .02, 0);
  const fm = mat(0x3a8a5a, { metalness: .5, roughness: .4 }); const meshT = canvasTex(64, 64, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(210,220,225,.85)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(w, h); c.moveTo(w, 0); c.lineTo(0, h); c.stroke(); }, true);
  const fenceM = new THREE.MeshStandardMaterial({ map: rep(meshT, 18, 3), transparent: true, alphaTest: .3, side: THREE.DoubleSide, roughness: .5, metalness: .6 });
  for (const [w, x, z, ry] of [[28, 0, -18, 0], [36, -14, 0, Math.PI / 2], [36, 14, 0, Math.PI / 2]]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(w, 6), fenceM.clone()); f.material.map = rep(meshT.clone(), w / 2, 3); f.position.set(x, 3, z); f.rotation.y = ry; g.add(f); }
  for (let z = -18; z <= 18; z += 4) for (const s of [-1, 1]) cyl(.12, .12, 6.2, fm, 6, g, s * 14, 3.1, z); for (let x = -14; x <= 14; x += 4) cyl(.12, .12, 6.2, fm, 6, g, x, 3.1, -18);
  const GO = goal(g, 0, -14, 0, 7, 3.4, 2);
  const tire = new THREE.Mesh(new THREE.TorusGeometry(1.1, .38, 10, 22), mat(0x1a1a1e, { roughness: .9 })); tire.position.set(-7, 5.2, -17.2); g.add(tire); cyl(.03, .03, 1.6, mat(0xaaaaaa), 3, g, -7, 7, -17.2);
  const CONES = []; for (let k = 0; k < 6; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(.45, 1.1, 14), mat(0xff7a1a, { roughness: .5 })); c.position.set(-1.2 + (k % 2) * 2.4, .55, 10 - k * 3.2); g.add(c); box(1, .1, 1, mat(0xff7a1a), .02, g, c.position.x, .05, c.position.z); CONES.push(c); }
  // foco nocturno y farola
  const pole = cyl(.25, .35, 12, mat(0x5a5e6a, { metalness: .6 }), 10, g, 12, 6, -16); const head = box(3, 1.4, 1.2, mat(0x2a2a34), .1, g, 11, 12.2, -15.4); head.rotation.x = .5; const lens = box(2.6, 1, .1, basic(3, 3, 2.4), .02, g, 11, 11.95, -14.85); lens.rotation.x = .5;
  const SPOT = new THREE.SpotLight(0xfff4d8, 0, 60, .9, .5, 1.1); SPOT.position.set(11, 12, -15); SPOT.target.position.set(0, 0, 2); g.add(SPOT, SPOT.target);
  const graff = textPlane(10, 2.4, 400, 96, (c, w, h) => { c.font = `700 70px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 10; c.strokeStyle = '#1a1a2a'; c.strokeText('BOLZPLATZ', w / 2, h / 2); c.fillStyle = '#ffd23f'; c.fillText('BOLZPLATZ', w / 2, h / 2); }); graff.position.set(0, 7.3, -18.2); g.add(graff);
  const wall = box(30, 1.3, .6, mat(0x9a9aa4), .05, g, 0, 6.8, -18.6);
  for (let k = 0; k < 5; k++) house(g, -32 + k * 16, -40, k + 3, 0); for (let k = 0; k < 5; k++) tree(g, -30 + k * 15, -26, .9); lamp(g, -16, 8, 1); bunting(g, [-14, 6.2, -18], [14, 6.2, -18], 0, .01);
  shade(g); return { g, GO, CONES, SPOT, tire }; }

// ---------- salón de fiestas (X): sala grande con paredes de colores, bola de discoteca, guirnaldas, mesa larga con
// tarta y pecera (TB en z = -4), altavoces, globos. Lo uso para la fiesta de cumpleaños de Herr Blubb y la fiesta en casa.
function room(parent, X, w, d, h, wall, floor) { const g = G(parent, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(0x2a2440), 0, g, 0, h, 0); return g; }
export function saal(scene, X) { const wallT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#5a3ab8'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.12)'; for (let k = 0; k < 9; k++) { c.beginPath(); c.arc((k * 41) % w, (k * 67) % h, 6, 0, 7); c.fill(); } }, true);
  const g = room(scene, X, 40, 32, 18, mat(0xffffff, { map: rep(wallT, 5, 2), roughness: .9 }), mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { const cols = ['#ff4a8a', '#3ab8ff', '#ffd23f', '#8ad84a']; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { c.fillStyle = cols[(i + j * 2) % 4]; c.fillRect(i * 32, j * 32, 32, 32); } c.strokeStyle = '#1a1a2a'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); }, true), 10, 8), roughness: .35, emissive: 0x2a1a3a, emissiveIntensity: .25 }));
  const DB = discoBall(g, 0, 13.5, 0, 1.3);
  for (let k = 0; k < 4; k++) bunting(g, [-20, 16, -16 + k * 8], [20, 16, -14 + k * 8], 18, 1.6);
  const TB = G(g, 0, 0, -6); box(14, .4, 4.4, mat(0xffffff, { roughness: .8 }), .05, TB, 0, 3.6, 0); box(14.2, 1.4, 4.6, mat(0xff8ad0, { roughness: .9 }), .05, TB, 0, 3.0, 0); for (const s of [-1, 1]) for (const z of [-1, 1]) box(.4, 3.4, .4, mat(0xc8946a), .05, TB, s * 6.5, 1.7, z * 1.9);
  const CK = cake(TB, 5, 1.1); CK.position.set(-3.6, 3.8, .2); const FB = fishbowl(TB, .9); FB.position.set(2.2, 3.8, -.2);
  for (let k = 0; k < 4; k++) gift(TB, PCOL[k], .9).position.set(-6 + k * 1.2 + (k > 1 ? 9.6 : 0), 3.8, 1.3);
  for (const x of [-5.6, 5.6]) { const cup = cyl(.32, .25, .7, mat(PCOL[x > 0 ? 2 : 0]), 10, TB, x, 4.15, -1.2); }
  const ban = signBoard('ALLES GUTE, HERR BLUBB!', 22, 2.6, '#ffffff', '#ff4a8a', '#ffd23f', .3); ban.position.set(0, 11, -15.7); g.add(ban);
  const SP = [speaker(g, -16, -12, 1.2, .4), speaker(g, 16, -12, 1.2, -.4)]; for (let k = 0; k < 6; k++) balloons(g, -18 + k * 7.2, 0, -14.5, 3, k + 2);
  const LI = new THREE.PointLight(0xffe8f4, 160, 60, 1.2); LI.position.set(0, 14, 6); g.add(LI);
  const LC = []; for (let k = 0; k < 4; k++) { const l = new THREE.PointLight(PCOL[k], 60, 30, 1.5); l.position.set(-12 + k * 8, 10, -4); g.add(l); LC.push(l); }
  shade(g); return { g, DB, TB, CK, FB, SP, LI, LC }; }

// ---------- utilería suelta: guitarra eléctrica, saco de boxeo, esterilla de yoga, cartel PARTY ABGESAGT, calendario ----------
export function guitar(parent) { const g = G(parent); const bm = mat(0xd8323a, { roughness: .25, metalness: .1 }); const b1 = cyl(.9, .9, .3, bm, 24, g, 0, -.2, 0); b1.rotation.x = Math.PI / 2; const b2 = cyl(.7, .7, .3, bm, 24, g, 0, .75, 0); b2.rotation.x = Math.PI / 2; box(.6, .3, .32, bm, .1, g, 0, .3, 0);
  box(.3, 2.6, .14, mat(0x6a4020), .03, g, 0, 2.5, .05); box(.45, .6, .16, mat(0x1a1a1a), .05, g, 0, 4.0, .05); box(.9, .2, .05, mat(0xffffff), .02, g, 0, -.05, .17); for (let k = 0; k < 4; k++) cyl(.012, .012, 4.2, mat(0xe8e8e8, { metalness: 1 }), 3, g, -.09 + k * .06, 1.8, .2); g.rotation.z = .9; return g; }
export function punchBag(parent) { const g = G(parent); cyl(.04, .04, 3, mat(0x8a8a8a, { metalness: .9 }), 4, g, 0, -1.5, 0); const bag = cyl(1.0, 1.0, 4.2, mat(0xd8323a, { roughness: .5 }), 20, g, 0, -5.1, 0); cyl(1.02, 1.02, .4, mat(0x1a1a1a), 20, g, 0, -3.4, 0); cyl(1.02, 1.02, .4, mat(0x1a1a1a), 20, g, 0, -6.8, 0);
  const lbl = textPlane(1.4, 1.4, 96, 96, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h / 2, 44, 0, 7); c.fill(); c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#1a1a1a'; c.fillText('BOX', w / 2, h / 2 + 3); }); lbl.position.set(0, -5.1, 1.02); g.add(lbl); return g; }
export function yogaMat(parent) { const g = G(parent); box(2.6, .12, 7, mat(0x3ad8a8, { roughness: .9 }), .05, g, 0, .06, 0); for (let k = 0; k < 6; k++) box(2.62, .02, .1, mat(0x2ab890), 0, g, 0, .13, -3 + k * 1.2); const roll = cyl(.4, .4, 2.6, mat(0x3ad8a8), 14, g, 0, .4, 3.7); roll.rotation.z = Math.PI / 2; return g; }
export function calendar(parent, text = 'DIENSTAG', sub = 'PARTY!') { const g = G(parent); box(4.2, 5, .2, mat(0xffffff), .1, g, 0, 0, 0); box(4.2, 1.2, .25, mat(0xd8323a), .05, g, 0, 1.9, .02);
  const pg = textPlane(4, 4.8, 200, 240, (c, w, h) => { c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 56); c.font = `700 34px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(text, w / 2, 30); c.fillStyle = '#fff'; c.fillRect(0, 56, w, h - 56);
    c.strokeStyle = '#ccc'; c.lineWidth = 2; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) c.strokeRect(10 + i * 36, 70 + j * 40, 36, 40); c.strokeStyle = '#ff2a6a'; c.lineWidth = 6; c.beginPath(); c.arc(10 + 1.5 * 36, 70 + 1.5 * 40, 30, 0, 7); c.stroke(); c.font = `700 38px ${FONT}`; c.fillStyle = '#ff2a6a'; c.fillText(sub, w / 2, h - 30); }); pg.position.z = .13; g.add(pg); return g; }
