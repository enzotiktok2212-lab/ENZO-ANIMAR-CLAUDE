// SCHUTZENGEL — mundo propio: angelitos de la guarda (cada persona lleva dos, siempre opuestos), alas grandes con plumas
// (negras de Nachtiel, ocho blancas de luz de Lumiel), aureola en llamas, el Tod (calavera encapuchada con guadaña que se parte)
// y el Leben (figura de hojas con ojos verdes), la Säuglingsstation, la escalera de Herr Vogel, el Gründerfest en el Marktplatz,
// el aparcamiento, la pintada «LEERES KIND», rayos y selva.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, lerp, clamp, easeOut, easeInOut } from './engine.js';
import { noiseTex, txt, tree, bench } from './props.js';
import { FONT } from './sets.js';
import { laterne } from './nsets.js';
import { bunting } from './wsets.js';
import { lights } from './bwelt.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !(o.material && o.material.transparent)) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1.6, o = {}) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5, ...o });
const addM = (col, op = 1) => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
const plane = (w, d, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const PI = Math.PI;

// ---------- angelitos de la guarda ----------
// tipos: [túnica, ribete, piel, símbolo, cara]
export const AK = {
  frieden: [0xf8f8ff, 0x8ad8ff, 0xfff0e0, 'dove', 'smile'], krieg: [0xd8202a, 0x2a2a30, 0xffe0cc, 'swords', 'angry'],
  oben: [0xffd23f, 0xffffff, 0xfff0e0, 'up', 'smile'], unten: [0x2a5ad8, 0xffffff, 0xfff0e0, 'down', 'calm'],
  leben: [0x3ac85a, 0xffe07a, 0xe8ffe0, 'leaf', 'smile'], tod: [0x1a1a22, 0x6a6a7a, 0xf4f4f4, 'skull', 'skull'],
  sonne: [0xff9a1a, 0xffe07a, 0xfff0e0, 'sun', 'smile'], mond: [0x2a2a6a, 0xc8d8ff, 0xe8ecff, 'moon', 'calm'],
  feuer: [0xff4a10, 0xffd23f, 0xffe8d8, 'flame', 'angry'], wasser: [0x2ad8f0, 0xffffff, 0xf0ffff, 'drop', 'calm'],
  glueck: [0x1ab84a, 0xffffff, 0xfff0e0, 'clover', 'smile'], pech: [0x7a2ab8, 0x1a1a1a, 0xf0e0ff, 'cat', 'calm'],
  laut: [0xff4a8a, 0xffffff, 0xfff0e0, 'note', 'smile'], leise: [0x9aa0b0, 0xffffff, 0xf4f4f4, 'zz', 'calm'] };
export const PAIRS = [['frieden', 'krieg'], ['oben', 'unten'], ['sonne', 'mond'], ['feuer', 'wasser'], ['glueck', 'pech'], ['laut', 'leise'], ['leben', 'tod']];
function drawSym(c, s, w, h, col) { c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 8; c.lineCap = 'round'; c.lineJoin = 'round'; const m = w / 2, n = h / 2;
  if (s === 'up' || s === 'down') { c.save(); c.translate(m, n); if (s === 'down') c.rotate(PI); c.beginPath(); c.moveTo(0, -34); c.lineTo(26, -4); c.lineTo(10, -4); c.lineTo(10, 32); c.lineTo(-10, 32); c.lineTo(-10, -4); c.lineTo(-26, -4); c.closePath(); c.fill(); c.restore(); }
  else if (s === 'swords') { for (const k of [-1, 1]) { c.save(); c.translate(m, n); c.rotate(k * .7); c.fillRect(-4, -34, 8, 50); c.fillRect(-14, 10, 28, 7); c.fillRect(-3, 16, 6, 14); c.restore(); } }
  else if (s === 'dove') { c.beginPath(); c.ellipse(m, n + 4, 26, 15, -.2, 0, 7); c.fill(); c.beginPath(); c.arc(m + 22, n - 8, 10, 0, 7); c.fill(); c.beginPath(); c.moveTo(m - 6, n); c.quadraticCurveTo(m - 10, n - 40, m + 14, n - 30); c.fill(); c.strokeStyle = '#3a9a3a'; c.beginPath(); c.moveTo(m + 30, n - 6); c.lineTo(m + 44, n - 2); c.stroke(); }
  else if (s === 'leaf') { c.beginPath(); c.moveTo(m, n + 34); c.quadraticCurveTo(m - 36, n, m, n - 34); c.quadraticCurveTo(m + 36, n, m, n + 34); c.fill(); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 4; c.beginPath(); c.moveTo(m, n + 30); c.lineTo(m, n - 26); c.stroke(); }
  else if (s === 'skull') { c.beginPath(); c.arc(m, n - 4, 26, 0, 7); c.fill(); c.fillRect(m - 16, n + 14, 32, 16); c.fillStyle = '#1a1a22'; for (const k of [-1, 1]) { c.beginPath(); c.arc(m + k * 10, n - 4, 7, 0, 7); c.fill(); } }
  else if (s === 'sun') { c.beginPath(); c.arc(m, n, 16, 0, 7); c.fill(); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; c.beginPath(); c.moveTo(m + Math.cos(a) * 22, n + Math.sin(a) * 22); c.lineTo(m + Math.cos(a) * 34, n + Math.sin(a) * 34); c.stroke(); } }
  else if (s === 'moon') { c.beginPath(); c.arc(m, n, 28, 0, 7); c.fill(); c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(m + 14, n - 8, 24, 0, 7); c.fill(); c.globalCompositeOperation = 'source-over'; }
  else if (s === 'flame') { c.beginPath(); c.moveTo(m, n - 36); c.quadraticCurveTo(m + 34, n, m + 18, n + 26); c.quadraticCurveTo(m, n + 36, m - 18, n + 26); c.quadraticCurveTo(m - 34, n, m, n - 36); c.fill(); }
  else if (s === 'drop') { c.beginPath(); c.moveTo(m, n - 36); c.quadraticCurveTo(m + 30, n + 4, m, n + 30); c.quadraticCurveTo(m - 30, n + 4, m, n - 36); c.fill(); }
  else if (s === 'clover') { for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283 + .78; c.beginPath(); c.arc(m + Math.cos(a) * 13, n + Math.sin(a) * 13 - 4, 13, 0, 7); c.fill(); } c.fillRect(m - 3, n + 6, 6, 26); }
  else if (s === 'cat') { c.beginPath(); c.arc(m, n + 6, 22, 0, 7); c.fill(); for (const k of [-1, 1]) { c.beginPath(); c.moveTo(m + k * 20, n - 4); c.lineTo(m + k * 22, n - 34); c.lineTo(m + k * 4, n - 14); c.fill(); } c.fillStyle = '#ffd23f'; for (const k of [-1, 1]) { c.beginPath(); c.arc(m + k * 9, n + 2, 4, 0, 7); c.fill(); } }
  else if (s === 'note') { c.beginPath(); c.ellipse(m - 8, n + 22, 13, 10, -.4, 0, 7); c.fill(); c.fillRect(m + 2, n - 30, 7, 52); c.fillRect(m + 2, n - 30, 26, 10); }
  else if (s === 'zz') { c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Zz', m, n + 2); } }
const AFACE = {}; function aFaceTex(kind) { if (AFACE[kind]) return AFACE[kind]; const [, , skin, , f] = AK[kind];
  return AFACE[kind] = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#' + skin.toString(16).padStart(6, '0'); c.fillRect(0, 0, w, h);
    if (f === 'skull') { c.fillStyle = '#f4f4f4'; c.fillRect(0, 0, w, h); c.fillStyle = '#14141c'; for (const k of [-1, 1]) { c.beginPath(); c.ellipse(64 + k * 24, 54, 17, 20, 0, 0, 7); c.fill(); } c.fillStyle = '#7ad8ff'; for (const k of [-1, 1]) { c.beginPath(); c.arc(64 + k * 24, 56, 6, 0, 7); c.fill(); } c.fillStyle = '#14141c'; c.beginPath(); c.moveTo(64, 72); c.lineTo(58, 84); c.lineTo(70, 84); c.fill(); c.fillRect(38, 96, 52, 14); c.fillStyle = '#f4f4f4'; for (let k = 0; k < 6; k++) c.fillRect(41 + k * 8.4, 96, 4, 14); return; }
    c.fillStyle = '#1a1a1a'; for (const k of [-1, 1]) { c.beginPath(); c.ellipse(64 + k * 22, 58, 9, 13, 0, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(64 + k * 22 + 3, 52, 4, 0, 7); c.fill(); c.fillStyle = '#1a1a1a'; }
    if (f === 'angry') { c.lineWidth = 7; c.strokeStyle = '#1a1a1a'; for (const k of [-1, 1]) { c.beginPath(); c.moveTo(64 + k * 36, 36); c.lineTo(64 + k * 10, 46); c.stroke(); } c.beginPath(); c.moveTo(48, 94); c.quadraticCurveTo(64, 84, 80, 94); c.stroke(); }
    else if (f === 'calm') { c.lineWidth = 6; c.strokeStyle = '#1a1a1a'; c.beginPath(); c.moveTo(50, 90); c.lineTo(78, 90); c.stroke(); }
    else { c.lineWidth = 6; c.strokeStyle = '#1a1a1a'; c.beginPath(); c.arc(64, 82, 16, .25, PI - .25); c.stroke(); }
    c.fillStyle = 'rgba(255,110,130,.45)'; for (const k of [-1, 1]) { c.beginPath(); c.ellipse(64 + k * 36, 80, 10, 6, 0, 0, 7); c.fill(); } }); }
// ala pequeña (silueta de plumas en abanico)
function wingShape(w = 1.4, h = 1.1) { const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(w * .3, h * .9, w * .8, h * 1.05, w, h * .9); for (let k = 0; k < 4; k++) { const x = w * (1 - k * .22), y = h * (.9 - k * .25); s.quadraticCurveTo(x - w * .02, y - h * .28, x - w * .2, y - h * .2); } s.quadraticCurveTo(w * .2, -h * .15, 0, 0); return new THREE.ShapeGeometry(s, 8); }
const WSG = wingShape();
export function angelito(kind = 'frieden') { const [robe, trim, skin, sym] = AK[kind]; const g = new THREE.Group(); g.userData.kind = kind; const body = G(g);
  const rm = mat(robe, { roughness: kind === 'krieg' ? .5 : .75 }), tm = mat(trim, { roughness: .6 });
  const r = new THREE.Mesh(new THREE.ConeGeometry(.62, 1.35, 14, 1, true), rm); r.position.y = .1; r.material.side = THREE.DoubleSide; body.add(r);
  cyl(.64, .64, .1, tm, 14, body, 0, -.56, 0); sphere(.3, rm, body, 0, .72, 0, 10, 8);
  const em = textPlane(.5, .5, 96, 96, (c, w, h) => drawSym(c, sym, w, h, '#' + trim.toString(16).padStart(6, '0'))); em.material.transparent = true; em.position.set(0, .1, .42); em.rotation.x = -.42; body.add(em);
  const fm = [new THREE.MeshStandardMaterial({ color: skin, roughness: .6 }), new THREE.MeshStandardMaterial({ color: skin, roughness: .6 }), new THREE.MeshStandardMaterial({ color: skin, roughness: .6 }), new THREE.MeshStandardMaterial({ color: skin, roughness: .6 }), new THREE.MeshStandardMaterial({ map: aFaceTex(kind), roughness: .6 }), new THREE.MeshStandardMaterial({ color: skin, roughness: .6 })];
  const head = new THREE.Mesh(new THREE.BoxGeometry(.86, .82, .8), fm); head.position.y = 1.18; body.add(head); g.userData.head = head;
  if (kind === 'tod') { const hood = new THREE.Mesh(new THREE.SphereGeometry(.62, 12, 10, 0, 6.283, 0, 2.1), rm); hood.position.set(0, 1.26, -.12); hood.rotation.x = -.35; body.add(hood); }
  else { const hm = { frieden: 0xf4e8c8, krieg: 0x3a2a1a, oben: 0xf2d060, unten: 0x5a3a22, leben: 0x8a5a2a, sonne: 0xe88a2a, mond: 0xd8d8e8, feuer: 0xd8321a, wasser: 0x3a6ab8, glueck: 0xc8a040, pech: 0x1a1a1a, laut: 0xff8ad8, leise: 0xc8c8d0 }[kind] || 0x5a3a22; box(.92, .3, .86, mat(hm, { roughness: .6 }), .12, body, 0, 1.62, -.02); }
  if (kind === 'krieg') { const hel = new THREE.Mesh(new THREE.SphereGeometry(.56, 12, 8, 0, 6.283, 0, 1.5), mat(0x6a6a72, { metalness: .7, roughness: .35 })); hel.position.y = 1.42; body.add(hel); box(.12, .5, .12, mat(0xd8202a), .04, body, 0, 1.92, 0); }
  if (kind === 'leben') for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; const l = sphere(.13, mat([0xff6a8a, 0xffd23f, 0xffffff][k % 3]), body, Math.cos(a) * .44, 1.68, Math.sin(a) * .42, 6, 4); }
  for (const s of [-1, 1]) { const ar = sphere(.17, rm, body, s * .52, .3, .1, 8, 6); ar.scale.set(1, 1.6, 1); sphere(.13, mat(skin), body, s * .56, .02, .22, 8, 6); }
  if (kind === 'tod') { const sc = G(body, .62, .1, .2); cyl(.04, .04, 1.9, mat(0x3a2a1a), 6, sc, 0, .4, 0); const b = new THREE.Mesh(new THREE.TorusGeometry(.4, .06, 4, 12, 2.4), mat(0xd8dce8, { metalness: .8, roughness: .2 })); b.position.set(-.38, 1.25, 0); b.rotation.z = .4; sc.add(b); }
  if (kind === 'krieg') { const wh = G(body, .58, .1, .3); cyl(.05, .05, 1.2, mat(0x8a8a90, { metalness: .8 }), 6, wh, 0, .4, 0); const t = new THREE.Mesh(new THREE.ConeGeometry(.12, .3, 6), mat(0xd8d8e0, { metalness: .8 })); t.position.y = 1.1; wh.add(t); }
  const halo = new THREE.Mesh(new THREE.TorusGeometry(.42, .07, 8, 28), glowM(kind === 'tod' ? 0x7ad8ff : 0xffd860, 2.4)); halo.rotation.x = PI / 2 - .25; halo.position.y = 1.95; body.add(halo); halo.userData.noOutline = true;
  const wm = new THREE.MeshStandardMaterial({ color: kind === 'tod' ? 0x2a2a34 : kind === 'krieg' ? 0xfff0f0 : 0xffffff, roughness: .5, side: THREE.DoubleSide, emissive: kind === 'tod' ? 0 : 0xffffff, emissiveIntensity: .15 });
  const W = []; for (const s of [-1, 1]) { const p = G(body, s * .25, .7, -.3); const m = new THREE.Mesh(WSG, wm); m.scale.set(s * 1.1, 1.1, 1); m.position.y = -.2; p.add(m); for (let k = 0; k < 3; k++) { const f = new THREE.Mesh(WSG, wm); f.scale.set(s * (.9 - k * .2), .8 - k * .15, 1); f.position.set(0, -.25 - k * .1, -.04 - k * .03); p.add(f); } W.push(p); }
  g.userData.anim = (T, seed = 0, fly = 1) => { const f = Math.sin(T * 9 + seed) ; body.position.y = Math.sin(T * 2.6 + seed) * .16 * fly; body.rotation.z = Math.sin(T * 1.7 + seed) * .08; W[0].rotation.y = .5 + f * .55 * fly; W[1].rotation.y = -.5 - f * .55 * fly; W[0].rotation.z = -.1 + f * .12; W[1].rotation.z = .1 - f * .12; halo.rotation.z = T * 1.5; };
  g.userData.body = body; g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; }

// ---------- alas grandes con plumas (attach a la espalda) ----------
// n pares, col, emisivo; spread(k 0..1, T) las despliega con rebote y aleteo
export function bigWings(o = {}) { const n = o.pairs ?? 1, col = o.col ?? 0x16141c, size = o.size ?? 1, glow = o.glow ?? 0; const g = new THREE.Group(); const F = [];
  const fm = new THREE.MeshStandardMaterial({ color: col, roughness: o.rough ?? .45, metalness: o.metal ?? .15, emissive: o.em ?? col, emissiveIntensity: glow, side: THREE.DoubleSide });
  const fm2 = new THREE.MeshStandardMaterial({ color: o.col2 ?? col, roughness: .5, metalness: o.metal ?? .15, emissive: o.em ?? col, emissiveIntensity: glow * .8, side: THREE.DoubleSide });
  const feather = (len, wid) => { const s = new THREE.Shape(); s.moveTo(0, -wid * .5); s.quadraticCurveTo(len * .55, -wid * .75, len, 0); s.quadraticCurveTo(len * .55, wid * .75, 0, wid * .5); s.closePath(); const geo = new THREE.ShapeGeometry(s, 6); return geo; };
  for (let p = 0; p < n; p++) for (const s of [-1, 1]) { const root = G(g); root.userData.side = s; root.userData.pair = p; const arm = G(root); const sz = size * (1 - p * .14);
    const rows = [[11, 5.6, 1.3, fm], [8, 3.8, 1.0, fm2], [7, 2.4, .8, fm]]; const FF = [];
    rows.forEach(([cnt, len, wid, m], ri) => { for (let k = 0; k < cnt; k++) { const fe = new THREE.Mesh(feather(len * sz * (1 - k * .03), wid * sz), m); const pv = G(arm); pv.position.set(s * (k * .55 * sz + ri * .2), -ri * .25, -.05 * ri - k * .008); pv.add(fe); fe.scale.x = s; pv.userData.k = k / (cnt - 1); pv.userData.ri = ri; FF.push(pv); } });
    root.userData.FF = FF; root.userData.arm = arm; F.push(root); }
  g.userData.F = F;
  g.userData.spread = (k, T = 0, flap = 1) => { const e = clamp(k), sp = easeOut(e) + Math.sin(e * PI) * .12;
    for (const r of F) { const s = r.userData.side, p = r.userData.pair; const pa = (p - (n - 1) / 2) * .55, fl = Math.sin(T * 3.2 + p * .9) * .12 * flap;
      r.rotation.set(0, s * lerp(1.25, .3, sp), s * (lerp(-1.25, .32 + pa * .9, sp) + fl)); r.position.set(s * .5, lerp(.4, .2, sp) + p * .2, 0);
      for (const f of r.userData.FF) { const k_ = f.userData.k; f.rotation.z = s * lerp(-1.35 + k_ * .15, -.75 + k_ * 1.6 + f.userData.ri * .1, sp); } } };
  g.userData.spread(0); g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.userData.noOutline = true; } });
  g.userData.ghost = v => { fm.colorWrite = fm2.colorWrite = !v; fm.depthWrite = fm2.depthWrite = !v; }; return g; }

// aureola grande (con llamas opcionales)
export function bigHalo(col = 0xfff2b0, fire = false) { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.TorusGeometry(1.1, .16, 10, 40), glowM(col, 3.2)); t.rotation.x = PI / 2; g.add(t); t.userData.noOutline = true;
  const F = []; if (fire) for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283; const fl = new THREE.Mesh(new THREE.ConeGeometry(.22, .9, 6), addM(k % 2 ? 0xffb020 : 0xff6a10, .85)); fl.position.set(Math.cos(a) * 1.1, .45, Math.sin(a) * 1.1); g.add(fl); F.push(fl); }
  g.userData.anim = T => F.forEach((f, i) => { const s = .7 + Math.abs(Math.sin(T * 11 + i * 1.7)) * .7; f.scale.set(1, s, 1); f.position.y = .4 * s; }); return g; }

// ---------- el Tod (Muerte): túnica negra rasgada flotando, capucha, calavera con ojos azules, manos de hueso, guadaña ----------
export function makeTod(scene) { const g = new THREE.Group(); scene.add(g); const rob = mat(0x14141a, { roughness: .9 }), bone = mat(0xeae6da, { roughness: .55 });
  const body = G(g, 0, 0, 0); const skirt = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 3.0, 8, 14, 3, true), rob); skirt.material.side = THREE.DoubleSide; skirt.position.y = 5; body.add(skirt);
  { const p = skirt.geometry.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < -3.9) p.setY(i, p.getY(i) + (i % 3) * .6 - .3); p.needsUpdate = true; skirt.geometry.computeVertexNormals(); }
  box(3.4, 3.2, 2.2, rob, .6, body, 0, 9.4, 0); const head = G(body, 0, 11.6, .1);
  const skullF = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#eae6da'; c.fillRect(0, 0, w, h); c.fillStyle = '#0a0a10'; for (const k of [-1, 1]) { c.beginPath(); c.ellipse(64 + k * 24, 52, 19, 22, 0, 0, 7); c.fill(); } c.beginPath(); c.moveTo(64, 70); c.lineTo(56, 84); c.lineTo(72, 84); c.fill(); c.fillRect(34, 96, 60, 18); c.fillStyle = '#eae6da'; for (let k = 0; k < 7; k++) c.fillRect(37 + k * 8.2, 96, 4.4, 18); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(30, 104, 68, 2); });
  const hm = [bone, bone, bone, bone, new THREE.MeshStandardMaterial({ map: skullF, roughness: .55 }), bone]; const sk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2), hm); head.add(sk);
  const EYES = []; for (const s of [-1, 1]) { const e = sphere(.24, glowM(0x6ad8ff, 4), head, s * .48, .12, 1.0, 10, 8); e.userData.noOutline = true; EYES.push(e); }
  const hood = new THREE.Mesh(new THREE.SphereGeometry(1.75, 16, 12, 0, 6.283, 0, 2.0), rob); hood.material = rob.clone(); hood.material.side = THREE.DoubleSide; hood.position.set(0, .3, -.35); hood.rotation.x = -.5; head.add(hood);
  const arm = s => { const sh = G(body, s * 2.1, 10.2, .2); const sl = new THREE.Mesh(new THREE.CylinderGeometry(.55, .9, 3.4, 10, 1, true), rob); sl.material = rob.clone(); sl.material.side = THREE.DoubleSide; sl.position.y = -1.6; sh.add(sl); const hand = G(sh, 0, -3.4, 0); box(.6, .7, .3, bone, .1, hand, 0, 0, 0); for (let k = 0; k < 4; k++) box(.12, .7, .12, bone, .04, hand, -.21 + k * .14, -.55, .05); return { sh, hand }; };
  const aR = arm(1), aL = arm(-1);
  // guadaña: mango en dos mitades (para partirla) + hoja curva con filo brillante
  const scy = G(aR.hand, 0, -.2, .3); const hdl = mat(0x3a2414, { roughness: .8 }); const hA = G(scy), hB = G(scy); cyl(.16, .16, 6, hdl, 8, hA, 0, -1.6, 0); cyl(.16, .16, 6, hdl, 8, hB, 0, 4.4, 0);
  const bs = new THREE.Shape(); bs.moveTo(0, 0); bs.quadraticCurveTo(-2.4, 1.6, -5.6, .2); bs.quadraticCurveTo(-2.6, .9, 0, -.6); bs.closePath(); const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(bs, { depth: .12, bevelEnabled: false }), mat(0xc8ccd8, { metalness: .9, roughness: .18 })); blade.position.set(0, 7.2, -.06); hB.add(blade);
  const edge = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, -.6, 0), new THREE.Vector3(-2.6, .9, 0), new THREE.Vector3(-5.6, .2, 0)), 16, .06, 4), glowM(0x9ae8ff, 3)); edge.position.set(0, 7.2, 0); hB.add(edge); edge.userData.noOutline = true;
  const o = { root: g, body, head, aR, aL, scy, hA, hB, EYES, blade, spec: { scale: 1 }, seed: 77 };
  o.pose = (T, p = {}) => { body.position.y = 1.2 + Math.sin(T * 1.6) * .35; body.rotation.z = Math.sin(T * 1.1) * .03; skirt.rotation.y = Math.sin(T * 2) * .06;
    aR.sh.rotation.set(p.rx ?? -.3, 0, p.rz ?? .15); aL.sh.rotation.set(p.lx ?? -.2, 0, p.lz ?? -.2); head.rotation.set(p.hx ?? .05, p.hy ?? 0, 0); scy.rotation.set(p.sx ?? 1.5, 0, p.sz ?? 0);
    const e = p.eyes ?? 4; EYES.forEach(m => m.material.emissiveIntensity = e); };
  o.snap = k => { const e = easeOut(clamp(k)); hB.position.set(lerp(0, -2.4, e), lerp(0, 3.4, e) - e * e * 2, lerp(0, .5, e)); hB.rotation.z = lerp(0, 1.9, e); hA.rotation.z = lerp(0, -.35, e); };
  g.traverse(m => { if (m.isMesh) m.castShadow = true; }); g.visible = false; return o; }

// ---------- el Leben (Vida): figura alta con manto de hojas, piel verde clara, ojos verdes brillantes, corona de flores, bastón que brota ----------
export function makeLeben(scene) { const g = new THREE.Group(); scene.add(g); const leafT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#2a8a3a'; c.fillRect(0, 0, w, h); const r = RNG(4); for (let k = 0; k < 90; k++) { c.fillStyle = ['#3aa84a', '#1e6a2a', '#5ac85a', '#2a9a3a'][k % 4]; c.beginPath(); c.ellipse(r() * w, r() * h, 9, 5, r() * 3, 0, 7); c.fill(); } }, true);
  const rob = mat(0xffffff, { map: rep(leafT, 2, 3), roughness: .8 }), gold = mat(0xe8c040, { metalness: .7, roughness: .3 }), skin = mat(0xc8f0b0, { roughness: .6 });
  const body = G(g); const skirt = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.7, 8, 14, 1, true), rob); skirt.material.side = THREE.DoubleSide; skirt.position.y = 5; body.add(skirt); cyl(2.72, 2.72, .3, gold, 14, body, 0, 1.1, 0);
  box(3.2, 3.2, 2.1, rob, .6, body, 0, 9.4, 0); box(1.0, 2.6, .1, gold, .05, body, 0, 9.4, 1.06);
  const head = G(body, 0, 11.6, .1); const fT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#c8f0b0'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(60,140,60,.35)'; c.beginPath(); c.moveTo(20, 30); c.quadraticCurveTo(40, 60, 22, 100); c.lineWidth = 3; c.strokeStyle = 'rgba(60,140,60,.4)'; c.stroke(); c.lineWidth = 6; c.strokeStyle = '#2a5a2a'; c.beginPath(); c.arc(64, 82, 14, .3, PI - .3); c.stroke(); });
  const hm = [skin, skin, skin, skin, new THREE.MeshStandardMaterial({ map: fT, roughness: .6 }), skin]; head.add(new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.1, 2), hm));
  const EYES = []; for (const s of [-1, 1]) { const e = box(.5, .18, .1, glowM(0x6aff6a, 4), .04, head, s * .48, .2, 1.02); e.userData.noOutline = true; EYES.push(e); }
  const hair = mat(0x2a6a2a, { roughness: .6 }); box(2.3, .6, 2.2, hair, .25, head, 0, 1.2, -.05); box(2.3, 2.2, .5, hair, .2, head, 0, .2, -1.05);
  for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; sphere(.3, mat([0xff5a8a, 0xffd23f, 0xffffff, 0xff9a3a][k % 4], { roughness: .5 }), head, Math.cos(a) * 1.1, 1.45, Math.sin(a) * 1.05, 8, 6); }
  const arm = s => { const sh = G(body, s * 2.0, 10.3, .2); const sl = new THREE.Mesh(new THREE.CylinderGeometry(.5, .85, 3.4, 10, 1, true), rob); sl.material = rob.clone(); sl.material.side = THREE.DoubleSide; sl.position.y = -1.6; sh.add(sl); const hand = G(sh, 0, -3.4, 0); box(.75, .8, .55, skin, .2, hand, 0, 0, 0); return { sh, hand }; };
  const aR = arm(1), aL = arm(-1); const staff = G(aR.hand, 0, 0, .3); cyl(.14, .18, 9, mat(0x6a4a22, { roughness: .8 }), 8, staff, 0, 1.6, 0); const orb = sphere(.6, glowM(0x8aff7a, 2.6), staff, 0, 6.3, 0, 14, 10); orb.userData.noOutline = true; for (let k = 0; k < 5; k++) { const l = sphere(.3, mat(0x3ab84a), staff, Math.cos(k) * .6, 5.6 + k * .1, Math.sin(k) * .6, 6, 4); l.scale.set(1, .4, 1.4); }
  const o = { root: g, body, head, aR, aL, staff, orb, EYES, spec: { scale: 1 }, seed: 66 };
  o.pose = (T, p = {}) => { body.position.y = 1.2 + Math.sin(T * 1.4 + 1) * .3; aR.sh.rotation.set(p.rx ?? -.2, 0, p.rz ?? .12); aL.sh.rotation.set(p.lx ?? -.15, 0, p.lz ?? -.15); head.rotation.set(p.hx ?? .05, p.hy ?? 0, 0); staff.rotation.set(p.sx ?? 0, 0, p.sz ?? 0); const e = p.eyes ?? 4; EYES.forEach(m => m.material.emissiveIntensity = e); orb.material.emissiveIntensity = p.orb ?? 2.6; };
  g.traverse(m => { if (m.isMesh) m.castShadow = true; }); g.visible = false; return o; }

// ---------- efectos ----------
// rayo: cilindro brillante con núcleo y envoltura (de a a b)
export function beam(scene, col = 0x8aff6a) { const g = new THREE.Group(); scene.add(g); const core = new THREE.Mesh(new THREE.CylinderGeometry(.7, .7, 1, 16, 1, true), addM(0xffffff, 1)); const sh = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1, 16, 1, true), addM(col, .55)); const sh2 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 1, 16, 1, true), addM(col, .22)); g.add(core, sh, sh2);
  g.userData.set = (a, b, w = 1, T = 0) => { const d = b.clone().sub(a), L = d.length(); g.position.copy(a).addScaledVector(d, .5); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); const p = 1 + Math.sin(T * 40) * .08; core.scale.set(w * p, L, w * p); sh.scale.set(w * p, L, w * p); sh2.scale.set(w, L, w); };
  g.userData.col = c => { sh.material.color.setHex(c); sh2.material.color.setHex(c); }; g.traverse(m => m.userData && (m.userData.noOutline = true)); g.visible = false; return g; }
// disco de sombra en el suelo (crece)
export function shadowDisc(scene) { const t = canvasTex(256, 256, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(4,0,12,.96)'); g.addColorStop(.75, 'rgba(10,0,24,.85)'); g.addColorStop(1, 'rgba(10,0,24,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const m = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6 })); m.rotation.x = -PI / 2; m.renderOrder = 2; scene.add(m); m.visible = false; return m; }
// plumas sueltas (pool)
export function feathers(scene, n = 30) { const s = new THREE.Shape(); s.moveTo(0, -.12); s.quadraticCurveTo(.5, -.18, .9, 0); s.quadraticCurveTo(.5, .18, 0, .12); const geo = new THREE.ShapeGeometry(s, 4); const L = [];
  for (let k = 0; k < n; k++) { const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: .5 })); scene.add(m); m.visible = false; L.push(m); }
  L.fall = (c, T, col = 0x16141c, emi = 0, spread = 14, h = 16, cnt = n) => L.forEach((f, i) => { if (i >= cnt) return; const r = RNG(i * 11 + 5); f.visible = true; f.material.color.setHex(col); f.material.emissive.setHex(col); f.material.emissiveIntensity = emi; const y = h - ((T * (1.2 + r() * .8) + r() * h) % h); f.position.set(c.x + (r() - .5) * spread + Math.sin(T * 2 + i) * 1.2, c.y + y, c.z + (r() - .5) * spread); f.rotation.set(T * 2 + i, T * 1.3 + i, Math.sin(T * 3 + i)); f.scale.setScalar(1.3 + r()); });
  return L; }
// brasas / chispas (pool de puntos brillantes)
export function embers(scene, n = 40) { const L = []; for (let k = 0; k < n; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.12, 6, 4), addM(0xffb040, 1)); scene.add(m); m.visible = false; L.push(m); }
  L.rise = (c, T, col = 0xffb040, spread = 6, h = 12, cnt = n) => L.forEach((e, i) => { if (i >= cnt) return; const r = RNG(i * 7 + 3); e.visible = true; e.material.color.setHex(col); const y = (T * (2 + r() * 2) + r() * h) % h; e.position.set(c.x + (r() - .5) * spread + Math.sin(T * 3 + i) * .6, c.y + y, c.z + (r() - .5) * spread); e.scale.setScalar((1 - y / h) * (1 + r())); });
  L.burst = (c, T0, T, col = 0xffffff, cnt = n, v = 10) => L.forEach((e, i) => { if (i >= cnt) return; const r = RNG(i * 5 + 1), t = T - T0; if (t < 0 || t > .9) return; e.visible = true; e.material.color.setHex(col); const a = r() * 6.283, b = (r() - .3) * 2; e.position.set(c.x + Math.cos(a) * v * t, c.y + b * v * t - 4 * t * t, c.z + Math.sin(a) * v * t); e.scale.setScalar(1.6 * (1 - t)); });
  return L; }
// selva que brota (plantas que crecen con k)
export function jungle(parent) { const g = G(parent); const P = []; const r = RNG(21);
  for (let k = 0; k < 46; k++) { const x = (r() - .5) * 90, z = -70 + r() * 90; if (Math.abs(x) < 9 && z > -40 && z < 20) continue; const t = G(g, x, 0, z); const kind = k % 4;
    if (kind === 0) tree(t, 0, 0, 1.2 + r() * .6); else if (kind === 1) { for (let j = 0; j < 7; j++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.8, 6, 5), mat(0x2a9a3a, { roughness: .7 })); l.position.set(0, 2.4, 0); l.rotation.set(Math.cos(j) * .9, j, Math.sin(j) * .9); t.add(l); } }
    else if (kind === 2) { const v = new THREE.Mesh(new THREE.TorusKnotGeometry(1.4, .22, 40, 6, 2, 3), mat(0x2a7a2a, { roughness: .8 })); v.position.y = 2.2; t.add(v); for (let j = 0; j < 5; j++) sphere(.36, mat([0xff4a8a, 0xffd23f, 0xff8a3a][j % 3]), t, Math.cos(j * 1.3) * 1.6, 1.2 + j * .6, Math.sin(j * 1.3) * 1.6, 8, 6); }
    else { const f = new THREE.Mesh(new THREE.SphereGeometry(2.2, 10, 8), mat(0x3ab84a, { roughness: .9 })); f.scale.set(1, .6, 1); f.position.y = 1.2; t.add(f); }
    t.userData.d = Math.hypot(x, z + 25); P.push(t); }
  g.userData.grow = k => P.forEach(t => { const e = clamp(k * 1.6 - t.userData.d / 80); t.scale.setScalar(Math.max(.001, easeOut(e) + Math.sin(e * PI) * .15)); t.visible = e > 0; });
  return shade(g); }

// ---------- escenarios ----------
const wallp = (a, b, n = 32) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let x = 0; x < w; x += n) { c.globalAlpha = .5; c.fillRect(x, 0, n * .35, h); } c.globalAlpha = 1; });
const tileT = (a, b, n = 8) => canvasTex(256, 256, (c, w, h) => { const s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = (i + j) % 2 ? a : b; c.fillRect(i * s, j * s, s, s); } c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 2; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * s, 0); c.lineTo(i * s, h); c.stroke(); c.beginPath(); c.moveTo(0, i * s); c.lineTo(w, i * s); c.stroke(); } });
function room(parent, X, w, d, h, wall, floor, ceil = 0xf4f0e8) { const g = G(parent, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil, { roughness: .9 }), 0, g, 0, h, 0); return g; }
// reloj de pared con hora dibujable
export function wallClock(parent, x, y, z, ry = 0, s = 1) { const g = G(parent, x, y, z); g.rotation.y = ry; g.scale.setScalar(s); cyl(2.2, 2.2, .4, mat(0x2a2a36, { roughness: .4 }), 32, g, 0, 0, 0).rotation.x = PI / 2;
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const f = new THREE.Mesh(new THREE.CircleGeometry(2, 40), new THREE.MeshStandardMaterial({ map: t, roughness: .4 })); f.position.z = .22; g.add(f); let key = null;
  g.userData.set = (hh, mm) => { const k = hh + ':' + mm; if (k === key) return; key = k; const c = cv.getContext('2d'); c.fillStyle = '#fbfbf4'; c.fillRect(0, 0, 256, 256); c.fillStyle = '#1a1a1a'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.save(); c.translate(128 + Math.sin(a) * 104, 128 - Math.cos(a) * 104); c.rotate(a); c.fillRect(-3, -10, 6, 20); c.restore(); }
    c.font = `700 30px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; for (const [n, a] of [[12, 0], [3, PI / 2], [6, PI], [9, PI * 1.5]]) c.fillText(n, 128 + Math.sin(a) * 78, 128 - Math.cos(a) * 78);
    const hand = (a, L, w, col) => { c.save(); c.translate(128, 128); c.rotate(a); c.fillStyle = col; c.fillRect(-w / 2, -L, w, L + 12); c.restore(); }; hand((hh % 12 + mm / 60) / 12 * 6.283, 62, 12, '#1a1a1a'); hand(mm / 60 * 6.283, 92, 7, '#1a1a1a'); hand((mm * 6 + 20) / 360 * 6.283, 96, 3, '#d8202a'); c.beginPath(); c.arc(128, 128, 9, 0, 7); c.fill(); t.needsUpdate = true; };
  g.userData.set(3, 17); return g; }
// Säuglingsstation (X): sala con ventanal, 3 filas de cunitas de metacrilato con tarjetas de nombre (cunas en NUR.CR: {x, z}),
// mesa del médico en (0, 0, -12) mirando +z, reloj grande en la pared del fondo (0, 13, -17.8), rótulo SÄUGLINGSSTATION
export function saeuglinge(scene, X) { const g = room(scene, X, 56, 36, 18, mat(0xffffff, { map: rep(wallp('#d8f0ea', '#c4e6de', 28), 6, 2), roughness: .9 }), mat(0xffffff, { map: rep(tileT('#f4f0e8', '#e4ece8', 8), 6, 4), roughness: .4 }));
  const stork = textPlane(40, 3, 1280, 96, (c, w, h) => { c.fillStyle = '#f8e8b0'; c.fillRect(0, 0, w, h); for (let k = 0; k < 10; k++) { const x = 64 + k * 128; c.fillStyle = ['#ff8aa8', '#8ac8ff', '#ffd23f', '#9ae88a'][k % 4]; c.beginPath(); c.arc(x, 48, 22, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 30px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(['★', '♥', '☁', '☾'][k % 4], x, 50); } }); stork.position.set(0, 9, -17.75); g.add(stork);
  const sg = textPlane(18, 2.6, 576, 84, (c, w, h) => { c.fillStyle = '#2a8a7a'; c.fillRect(0, 0, w, h); txt(c, 'SÄUGLINGSSTATION', w / 2, h / 2 + 3, 54, '#ffffff'); }); sg.position.set(0, 15.2, -17.75); g.add(sg);
  const CLK = wallClock(g, 16, 12, -17.6, 0, 1.4);
  for (const s of [-1, 1]) { const w = textPlane(14, 8, 256, 160, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#7ac0f0'); gr.addColorStop(1, '#d8f0ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; for (let k = 0; k < 4; k++) { c.beginPath(); c.ellipse(30 + k * 70, 40 + (k % 2) * 20, 30, 12, 0, 0, 7); c.fill(); } c.fillStyle = '#5aa04a'; c.fillRect(0, h * .78, w, h * .22); }); w.position.set(s * 27.7, 9, -2); w.rotation.y = -s * PI / 2; g.add(w); box(.6, 8.8, 14.8, mat(0xf4f4f4), .05, g, s * 27.6, 9, -2).scale.set(1, 1, 1); }
  const CR = []; const NAMES = ['LINA', 'TOM', 'EMMA', 'PAUL', 'MIA', 'BEN', 'LEA', 'NOAH', 'ANNA', 'FINN', 'IDA', 'MAX', 'SOPHIE', 'LUCA', 'HANNA'];
  for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) { const x = -16 + k * 8, z = -6 + r * 8; const c = G(g, x, 0, z); const st = mat(0xd8dce4, { metalness: .7, roughness: .3 });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(.12, .12, 2.6, st, 6, c, sx * 1.6, 1.3, sz * 1);
    box(3.6, .25, 2.4, st, .05, c, 0, 1.2, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) sphere(.25, mat(0x2a2a30), c, sx * 1.6, .25, sz * 1, 8, 6);
    const tub = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.5, 2.2), mat(0xe8f6ff, { transparent: true, opacity: .32, roughness: .05 })); tub.position.y = 3.4; c.add(tub); box(3.1, .4, 1.9, mat([0xffd8e4, 0xd8ecff, 0xfff4c8][(k + r) % 3], { roughness: 1 }), .15, c, 0, 2.85, 0);
    const n = NAMES[(r * 5 + k) % NAMES.length]; const card = textPlane(2.4, .9, 192, 72, (cx, w, h) => { cx.fillStyle = ['#ffb8cc', '#a8d4ff', '#ffe48a'][(k + r) % 3]; cx.fillRect(0, 0, w, h); txt(cx, 'BABY ' + n, w / 2, h / 2 + 2, 30, '#1a1a1a'); }); card.position.set(0, 3.2, 1.16); c.add(card);
    CR.push({ x, z, g: c }); }
  // mesa de exploración del médico
  const T_ = G(g, 0, 0, -12); box(8, 4, 4, mat(0xf4f4f8, { roughness: .5 }), .2, T_, 0, 2, 0); box(7.6, .5, 3.6, mat(0x8ac8ff, { roughness: 1 }), .2, T_, 0, 4.2, 0); const lampG = G(T_, 4, 0, -1); cyl(.15, .15, 12, mat(0xd8d8e0, { metalness: .7 }), 6, lampG, 0, 6, 0); const lh = cyl(.4, 1.2, 1, glowM(0xfff4d8, .8), 14, lampG, -1.6, 12, 1); lh.rotation.z = .6;
  for (const [x, z] of [[-24, -14], [24, -14]]) { const p = G(g, x, 0, z); cyl(1.2, .9, 2, mat(0xd86a3a), 10, p, 0, 1, 0); sphere(2, mat(0x3ab84a, { roughness: .9 }), p, 0, 3.6, 0, 10, 8); }
  for (let z = -12; z <= 12; z += 12) { box(5, .3, 1.4, glowM(0xfff6e8, 1.1), .05, g, -10, 17.8, z); box(5, .3, 1.4, glowM(0xfff6e8, 1.1), .05, g, 10, 17.8, z); }
  return { g: shade(g), CR, CLK }; }
// escalera de Herr Vogel (X): casa de ladrillo con escalinata de piedra de 12 peldaños (de z = 9 a z = -1, altura 0 → 7,2), barandilla de hierro,
// puerta verde arriba en (0, 7.2, -2.4), macetas, buzón, acera y calle (z > 12); farola y árbol.
export function vogelHaus(scene, X) { const g = G(scene, X); const brick = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#b8583a'; c.fillRect(0, 0, w, h); const r = RNG(3); for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { c.fillStyle = ['#c0603e', '#a84e32', '#b45a3c', '#9a4a30'][Math.floor(r() * 4)]; c.fillRect(x + 1, y + 1, 30, 14); } }, true);
  plane(400, 400, mat(0xffffff, { map: rep(noiseTex('#8a8a8e', ['#7a7a7e', '#9a9a9e'], 3000, 2, 1), 40, 40), roughness: .95 }), g, 0, -.04, 0);
  plane(400, 30, mat(0xffffff, { map: rep(noiseTex('#4e5258', ['#44484e', '#5a5e64'], 2000, 2, 1), 40, 3), roughness: .9 }), g, 0, -.02, 30);
  box(60, 34, 3, mat(0xffffff, { map: rep(brick, 6, 4), roughness: .9 }), 0, g, 0, 17, -4);
  const stone = mat(0xc8c4b8, { roughness: .85 }); const STEP = []; for (let k = 0; k < 12; k++) { const s = box(7, .6 * (k + 1), .9, stone, .05, g, 0, .3 * (k + 1), 9 - k * .9 + .45); STEP.push(s); }
  box(7.4, .4, 2.6, stone, .05, g, 0, 7.4, -1.7);
  for (const sx of [-1, 1]) { const ir = mat(0x1a1a1e, { metalness: .6, roughness: .4 }); const pts = [new THREE.Vector3(sx * 3.6, 3.6, 9.4), new THREE.Vector3(sx * 3.6, 10.6, -1.4)]; const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(...pts), 8, .12, 6), ir); g.add(rail); for (let k = 0; k <= 10; k++) { const z = 9.4 - k * 1.08, y = .6 * Math.min(12, k * 1.2 + 1); cyl(.06, .06, 3.2, ir, 4, g, sx * 3.6, y + 1.6, z); } }
  const door = box(4.4, 7.6, .5, mat(0x2a6a3a, { roughness: .5 }), .1, g, 0, 11.4, -2.4); box(5.4, 8.4, .4, mat(0xf4f0e8), .1, g, 0, 11.6, -2.55); sphere(.22, mat(0xd8b040, { metalness: .9 }), g, 1.6, 11.2, -2.1, 8, 6);
  const nm = textPlane(3, .9, 150, 45, (c, w, h) => { c.fillStyle = '#d8c060'; c.fillRect(0, 0, w, h); txt(c, 'VOGEL', w / 2, h / 2 + 2, 30, '#1a1a1a'); }); nm.position.set(3.8, 10.6, -2.2); g.add(nm);
  for (let wx of [-18, -10, 10, 18]) for (const wy of [10, 22]) { box(5, 6.4, .4, mat(0xf4f0e8), .1, g, wx, wy, -2.4); const p = textPlane(4.2, 5.6, 64, 84, (c, w, h) => { c.fillStyle = '#8ab8d8'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(6, 6, 20, h - 12); }); p.position.set(wx, wy, -2.15); g.add(p); for (let k = 0; k < 4; k++) sphere(.5, mat([0xff4a6a, 0xffd23f, 0xff8ad8, 0xffffff][k]), g, wx - 1.8 + k * 1.2, wy - 3.6, -1.8, 8, 6); }
  for (const sx of [-1, 1]) { const p = G(g, sx * 5.4, 0, 9.6); cyl(1, .8, 1.8, mat(0xb86a3a), 10, p, 0, .9, 0); sphere(1.3, mat(0x4ab84a), p, 0, 2.6, 0, 10, 8); }
  laterne(g, -14, 12); tree(g, 16, 12, 1.1); const mb = G(g, -6, 0, 11); cyl(.15, .15, 3.4, mat(0x2a2a2a), 6, mb, 0, 1.7, 0); box(1.4, 1.2, 1, mat(0xf2c81a), .2, mb, 0, 3.8, 0);
  return { g: shade(g), STEP }; }
// pintada «LEERES KIND» (para una pared)
export function graffiti() { return textPlane(16, 5, 640, 200, (c, w, h) => { c.clearRect(0, 0, w, h); c.save(); c.translate(w / 2, h / 2); c.rotate(-.06); c.font = `700 112px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = 26; c.strokeStyle = '#1a1a1a'; c.strokeText('LEERES KIND', 0, 0); c.fillStyle = '#ff3a5a'; c.fillText('LEERES KIND', 0, 0); c.fillStyle = 'rgba(255,58,90,.7)'; const r = RNG(9); for (let k = 0; k < 16; k++) c.fillRect(-280 + r() * 560, 40 + r() * 10, 4, 10 + r() * 40); c.restore(); }); }
// Gründerfest en el Marktplatz de Lindenthal (padre = grupo de la ciudad): escenario en (0, 0, -64) mirando +z (suelo del escenario y = 4),
// Rednerpult en (0, 4, -60), pancarta «GRÜNDERFEST · SEIT 1874», guirnaldas de bombillas y banderines, puestos a los lados.
export function fest(parent) { const g = G(parent, 0, 0, -64); const wd = mat(0x6a3a22, { roughness: .7 }), red = mat(0xa8182a, { roughness: .8 });
  box(30, 4, 14, wd, .1, g, 0, 2, 0); box(30.4, .3, 14.4, mat(0x2a2a30, { roughness: .4 }), .05, g, 0, 4.1, 0); for (let k = 0; k < 6; k++) box(8, .6, 1.2, wd, .05, g, -9, .3 + k * .66, 7.6 + (5 - k) * .9).position.set(-9, .33 + k * .66, 7.6 + (5 - k) * .7);
  const skirt = textPlane(30, 4, 600, 80, (c, w, h) => { c.fillStyle = '#7a1020'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 30) { c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(x, 0, 12, h); } c.fillStyle = '#e8c040'; c.fillRect(0, 0, w, 6); }); skirt.position.set(0, 2, 7.05); g.add(skirt);
  box(32, 18, .6, red, .1, g, 0, 13, -7); for (const s of [-1, 1]) { cyl(.5, .5, 22, mat(0xe8c040, { metalness: .7, roughness: .3 }), 10, g, s * 15.6, 11, -6.4); const fl = G(g, s * 15.6, 22.6, -6.4); box(.1, 2.8, 4.4, mat(s < 0 ? 0xf2c81a : 0x1a1a1a), .02, fl, 0, -1.4, 2.2); box(.1, 1.0, 4.4, mat(0xd8202a), .02, fl, 0, -1.4, 2.2); }
  const ban = textPlane(26, 5.6, 1040, 224, (c, w, h) => { c.fillStyle = '#7a1020'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8c040'; c.lineWidth = 12; c.strokeRect(10, 10, w - 20, h - 20); txt(c, 'GRÜNDERFEST', w / 2, 92, 108, '#ffe07a', '#3a0008', 14); txt(c, 'SEIT 1874', w / 2, 170, 56, '#ffffff', '#3a0008', 10); }); ban.position.set(0, 17.6, -6.6); g.add(ban);
  const crest = textPlane(5, 6, 160, 192, (c, w, h) => { c.fillStyle = '#e8c040'; c.beginPath(); c.moveTo(10, 10); c.lineTo(w - 10, 10); c.lineTo(w - 10, h * .55); c.quadraticCurveTo(w / 2, h, w / 2, h - 6); c.quadraticCurveTo(w / 2, h, 10, h * .55); c.closePath(); c.fill(); c.fillStyle = '#7a1020'; c.beginPath(); c.moveTo(22, 22); c.lineTo(w - 22, 22); c.lineTo(w - 22, h * .52); c.quadraticCurveTo(w / 2, h * .9, w / 2, h - 22); c.quadraticCurveTo(w / 2, h * .9, 22, h * .52); c.closePath(); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(w / 2, 40); c.lineTo(w / 2 + 30, 90); c.lineTo(w / 2, 140); c.lineTo(w / 2 - 30, 90); c.closePath(); c.fill(); });
  // Rednerpult (atril) con escudo y micrófono
  const PULT = G(g, 0, 4.2, 4); PULT.scale.setScalar(.7); const pw = mat(0x4a2614, { roughness: .45 }); box(4.4, 4.6, 2.6, pw, .15, PULT, 0, 2.3, 0); box(5, .4, 3.2, pw, .1, PULT, 0, 4.8, -.1).rotation.x = -.2; crest.position.set(0, 2.5, 1.32); crest.scale.setScalar(.62); PULT.add(crest);
  const mic = G(PULT, 0, 5, .6); cyl(.06, .06, 1.6, mat(0x1a1a1e, { metalness: .7 }), 6, mic, 0, .7, 0).rotation.x = -.5; sphere(.28, mat(0x2a2a30, { metalness: .5, roughness: .4 }), mic, 0, 1.4, .4, 10, 8);
  // guirnaldas de bombillas y banderines sobre la plaza
  for (let k = 0; k < 5; k++) { const z = -44 + k * 14; lights(g.parent, [-46, 14, z], [46, 14, z + 6], 22, 2.2); bunting(g.parent, [-46, 12.4, z + 4], [46, 12.4, z - 2], 20, 1.6); }
  // puestos (Bratwurst, Lebkuchen, Bier, Karussell-Lichter)
  const ST = [['BRATWURST', 0xd8202a], ['LEBKUCHEN', 0x8a4a1a], ['GETRÄNKE', 0x2a6ad8], ['ZUCKERWATTE', 0xff6aa8]];
  ST.forEach(([n, col], i) => { const s = i % 2 ? 1 : -1, z = -30 + Math.floor(i / 2) * 26; const p = G(g.parent, s * 34, 0, z); p.rotation.y = -s * PI / 2; box(10, 4, 5, mat(0x8a5a2a), .1, p, 0, 2, 0); const roof = new THREE.Mesh(new THREE.ConeGeometry(7.6, 3, 4), mat(col, { roughness: .7 })); roof.rotation.y = PI / 4; roof.scale.set(1, 1, .6); roof.position.y = 8.4; p.add(roof); for (const sx of [-1, 1]) cyl(.2, .2, 7, mat(0xe8e0d0), 6, p, sx * 4.6, 3.5, 2.2);
    const sg = textPlane(9, 1.6, 360, 64, (c, w, h) => { c.fillStyle = '#' + col.toString(16).padStart(6, '0'); c.fillRect(0, 0, w, h); txt(c, n, w / 2, h / 2 + 2, 40, '#ffffff'); }); sg.position.set(0, 6.2, 2.6); p.add(sg); const L = new THREE.PointLight(0xffc880, 40, 22, 1.6); L.position.set(0, 5, 4); p.add(L); });
  return { g: shade(g), PULT, crest }; }
// coches aparcados (simples pero detallados): color, posición
export function car(parent, col = 0x2a6ad8) { const g = G(parent); const b = mat(col, { roughness: .25, metalness: .35 }), dk = mat(0x1a1a1e, { roughness: .6 }), gl = mat(0x9ac8e8, { roughness: .05, metalness: .3 });
  box(5, 1.6, 9.4, b, .5, g, 0, 1.6, 0); box(4.4, 1.5, 5, b, .5, g, 0, 3.1, -.4); box(4.5, 1.1, 4.4, gl, .3, g, 0, 3.15, -.4).scale.set(1.01, 1, 1.0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const w = cyl(.95, .95, .7, dk, 16, g, sx * 2.4, .95, sz * 3); w.rotation.z = PI / 2; cyl(.5, .5, .72, mat(0xd8d8e0, { metalness: .8 }), 10, g, sx * 2.42, .95, sz * 3).rotation.z = PI / 2; }
  for (const sx of [-1, 1]) { box(.9, .5, .2, glowM(0xfff4d0, 1.2), .1, g, sx * 1.6, 1.9, 4.72); box(.9, .4, .2, glowM(0xd8101a, .9), .1, g, sx * 1.6, 1.9, -4.72); }
  const pl = textPlane(2, .5, 120, 30, (c, w, h) => { c.fillStyle = '#f4f4f4'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a4ab8'; c.fillRect(0, 0, 12, h); c.fillStyle = '#1a1a1a'; c.font = `700 20px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('ES · L 317', w / 2 + 6, h / 2 + 1); }); pl.position.set(0, 1.2, 4.72); g.add(pl);
  return shade(g); }
