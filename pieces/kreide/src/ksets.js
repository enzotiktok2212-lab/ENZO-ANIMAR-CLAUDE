// KREIDE — atrezo y escenarios: dibujos de tiza que cobran vida (monopatín, puerta, Krümel, gata, dragón Smaragd, tobogán, escalera,
// monigotes), paraguas, lluvia, nubes negras, sirena de lluvia, llaves, feria (Jahrmarkt), jardín con caseta, sala del Sistema, arcoíris.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG, textPlane, clamp, lerp, V } from './engine.js';
import { FONT, txt } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const G = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
export const shade = (g) => g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
// ---------- tiza ----------
const TEXC = new Map();
export function chalkTex(css, seed = 1, stripe = null) { const k = css + seed + stripe; if (TEXC.has(k)) return TEXC.get(k);
  const t = canvasTex(128, 128, (c, w, h) => { c.fillStyle = css; c.fillRect(0, 0, w, h); const r = RNG(seed);
    for (let i = 0; i < 900; i++) { c.fillStyle = r() < .55 ? `rgba(255,255,255,${r() * .28})` : `rgba(0,0,0,${r() * .12})`; c.fillRect(r() * w, r() * h, 1 + r() * 3, 1); }
    c.globalAlpha = .18; c.strokeStyle = '#fff'; for (let i = 0; i < 26; i++) { c.lineWidth = 1 + r() * 2; const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 18 + r() * 20, y - 10 - r() * 10); c.stroke(); }
    if (stripe) { c.globalAlpha = .55; c.fillStyle = stripe; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(r() * w, (i + .5) * h / 4, 20 + r() * 20, 5, .3, 0, 7); c.fill(); } } c.globalAlpha = 1; }, true);
  TEXC.set(k, t); return t; }
const CMC = new Map();
export function chalk(col, o = {}) { const k = col + JSON.stringify(o); if (CMC.has(k) && !o.fresh) return CMC.get(k); const css = hex(col);
  const m = mat(0xffffff, { map: chalkTex(css, (col % 97) + 1, o.stripe), roughness: 1, emissive: col, emissiveIntensity: o.glow ?? .14, transparent: !!o.fade, ...(o.extra || {}) }); CMC.set(k, m); return m; }
// trazo de tiza en canvas (varias pasadas temblorosas)
export function chalkStroke(c, pts, col, lw, seed = 1) { const r = RNG(seed); c.lineCap = 'round'; c.lineJoin = 'round';
  for (let p = 0; p < 4; p++) { c.globalAlpha = p ? .35 : .85; c.strokeStyle = p === 3 ? '#ffffff' : col; c.lineWidth = lw * (p ? .55 : 1); c.beginPath();
    pts.forEach(([x, y], i) => { const j = (r() - .5) * lw * .5; i ? c.lineTo(x + j, y + j) : c.moveTo(x + j, y + j); }); c.stroke(); } c.globalAlpha = 1; }
export function chalkFill(c, path, col, seed = 1) { const r = RNG(seed); c.save(); c.fillStyle = col; c.globalAlpha = .82; path(c); c.fill(); c.clip(); c.globalAlpha = .25; for (let i = 0; i < 400; i++) { c.fillStyle = r() < .6 ? '#fff' : '#000'; c.fillRect(r() * 1024, r() * 1024, 2, 1); } c.restore(); c.globalAlpha = 1; }
// calcomanía en el suelo (plano horizontal)
export function decal(parent, w, h, draw, x = 0, z = 0, ry = 0, y = .07) { const p = textPlane(w, h, Math.round(w * 40), Math.round(h * 40), draw); p.material.depthWrite = false; p.material.polygonOffset = true; p.material.polygonOffsetFactor = -2;
  p.rotation.set(-Math.PI / 2, 0, ry); p.position.set(x, y, z); parent.add(p); return p; }
// dibujos de tiza para el suelo de la plaza / acera
export const DRAW = {
  sun: (c, w, h) => { chalkFill(c, c => { c.beginPath(); c.arc(w / 2, h / 2, w * .22, 0, 7); }, '#ffd23f', 3); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; chalkStroke(c, [[w / 2 + Math.cos(a) * w * .27, h / 2 + Math.sin(a) * h * .27], [w / 2 + Math.cos(a) * w * .44, h / 2 + Math.sin(a) * h * .44]], '#ff9a2a', w * .035, i); }
    chalkStroke(c, [[w * .42, h * .44], [w * .42, h * .46]], '#1a1a1a', w * .03); chalkStroke(c, [[w * .58, h * .44], [w * .58, h * .46]], '#1a1a1a', w * .03); c.beginPath(); c.lineWidth = w * .02; c.strokeStyle = '#d8323a'; c.arc(w / 2, h * .52, w * .08, .3, 2.8); c.stroke(); },
  hop: (c, w, h) => { const cells = [[0, 0], [0, 1], [-.5, 2], [.5, 2], [0, 3], [-.5, 4], [.5, 4], [0, 5]]; cells.forEach(([cx, cy], i) => { const x = w / 2 + cx * w * .4 - w * .2, y = h - (cy + 1) * h / 6.4; chalkStroke(c, [[x, y], [x + w * .4, y], [x + w * .4, y + h / 6.6], [x, y + h / 6.6], [x, y]], '#ffffff', w * .03, i); c.font = `700 ${w * .14}px ${FONT}`; c.fillStyle = ['#ff5a8a', '#5ab8ff', '#ffd23f', '#8ad84a'][i % 4]; c.textAlign = 'center'; c.fillText(String(i + 1), x + w * .2, y + h / 10); });
    chalkStroke(c, [[w * .3, h * .1], [w * .5, h * .02], [w * .7, h * .1]], '#ff5a8a', w * .04); c.font = `700 ${w * .1}px ${FONT}`; c.fillStyle = '#ff9ac0'; c.fillText('HIMMEL', w / 2, h * .09); },
  flower: (c, w, h) => { for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; chalkFill(c, c => { c.beginPath(); c.ellipse(w / 2 + Math.cos(a) * w * .2, h * .4 + Math.sin(a) * h * .2, w * .14, h * .1, a, 0, 7); }, ['#ff5aa0', '#ff8ad0'][i % 2], i); }
    chalkFill(c, c => { c.beginPath(); c.arc(w / 2, h * .4, w * .1, 0, 7); }, '#ffd23f', 9); chalkStroke(c, [[w / 2, h * .55], [w * .52, h * .95]], '#4ab83a', w * .04); chalkFill(c, c => { c.beginPath(); c.ellipse(w * .62, h * .75, w * .1, h * .05, -.5, 0, 7); }, '#6ad84a', 5); },
  rainbowD: (c, w, h) => { ['#ff3a3a', '#ff9a2a', '#ffe23a', '#4ad84a', '#3a9aff', '#8a5aff'].forEach((col, i) => { c.lineWidth = w * .05; c.strokeStyle = col; c.globalAlpha = .85; c.beginPath(); c.arc(w / 2, h * .85, w * (.44 - i * .05), Math.PI, 0); c.stroke(); }); c.globalAlpha = 1;
    for (const x of [.12, .88]) chalkFill(c, c => { c.beginPath(); c.arc(w * x, h * .82, w * .09, 0, 7); c.arc(w * (x + .07), h * .84, w * .07, 0, 7); }, '#ffffff', 4); },
  house: (c, w, h) => { chalkFill(c, c => { c.beginPath(); c.rect(w * .2, h * .45, w * .6, h * .45); }, '#5ab8ff', 2); chalkFill(c, c => { c.beginPath(); c.moveTo(w * .12, h * .47); c.lineTo(w * .5, h * .1); c.lineTo(w * .88, h * .47); c.closePath(); }, '#ff5a4a', 3);
    chalkFill(c, c => { c.beginPath(); c.rect(w * .44, h * .66, w * .14, h * .24); }, '#8a4a22', 4); chalkFill(c, c => { c.beginPath(); c.rect(w * .26, h * .54, w * .12, h * .1); c.rect(w * .64, h * .54, w * .12, h * .1); }, '#ffe23a', 5); },
  fish: (c, w, h) => { chalkFill(c, c => { c.beginPath(); c.ellipse(w * .45, h / 2, w * .3, h * .22, 0, 0, 7); }, '#3ad8c8', 6); chalkFill(c, c => { c.beginPath(); c.moveTo(w * .72, h / 2); c.lineTo(w * .95, h * .25); c.lineTo(w * .95, h * .75); c.closePath(); }, '#2a9ad8', 7);
    chalkStroke(c, [[w * .3, h * .45], [w * .3, h * .46]], '#111', w * .04); for (let i = 0; i < 3; i++) chalkStroke(c, [[w * (.4 + i * .08), h * .35], [w * (.45 + i * .08), h * .5], [w * (.4 + i * .08), h * .65]], '#ffffff', w * .015, i); },
  star: (c, w, h) => { chalkFill(c, c => { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? w * .18 : w * .44; c.lineTo(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r); } c.closePath(); }, '#ffe23a', 8); },
  stick: (c, w, h) => { const S = (x, s) => { chalkStroke(c, [[x, h * .3], [x, h * .62]], '#ffffff', w * .03, s); c.lineWidth = w * .03; c.strokeStyle = '#fff'; c.beginPath(); c.arc(x, h * .2, w * .08, 0, 7); c.stroke(); chalkStroke(c, [[x - w * .12, h * .32], [x, h * .42], [x + w * .12, h * .3]], '#ffffff', w * .03, s + 1); chalkStroke(c, [[x - w * .1, h * .85], [x, h * .62], [x + w * .1, h * .85]], '#ffffff', w * .03, s + 2); }; S(w * .5, 1); },
  dog: (c, w, h) => { c.lineWidth = w * .04; c.strokeStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, h * .42, w * .25, 0, 7); c.stroke(); [[.36], [.5], [.64]].forEach(([x], i) => chalkStroke(c, [[w * x, h * .66], [w * x, h * .9]], '#ffffff', w * .04, i)); chalkStroke(c, [[w * .44, h * .38], [w * .44, h * .39]], '#fff', w * .05); chalkStroke(c, [[w * .56, h * .38], [w * .56, h * .39]], '#fff', w * .05); },
  door: (c, w, h) => { chalkFill(c, c => { c.beginPath(); c.roundRect(w * .1, h * .05, w * .8, h * .93, [w * .4, w * .4, 4, 4]); }, '#ff7ab8', 3); chalkStroke(c, [[w * .1, h * .98], [w * .1, h * .3], [w * .5, h * .05], [w * .9, h * .3], [w * .9, h * .98]], '#ffffff', w * .05, 2); chalkFill(c, c => { c.beginPath(); c.arc(w * .72, h * .55, w * .07, 0, 7); }, '#ffe23a', 4); },
};
export function chalkSign(text, w, h, bg = '#2a3a2e', fg = '#ffffff') { return textPlane(w, h, Math.round(w * 50), Math.round(h * 50), (c, W_, H_) => { c.fillStyle = '#6b4a2e'; c.fillRect(0, 0, W_, H_); c.fillStyle = bg; c.fillRect(10, 10, W_ - 20, H_ - 20); txt(c, text, W_ / 2, H_ / 2 + 4, Math.min(H_ * .5, W_ * 1.6 / text.length), fg); }); }

// ---------- objetos de tiza vivos ----------
export function skateboard(parent, col = 0x5ab8ff) { const g = G(parent); box(3.6, .22, 1.1, chalk(col), .1, g, 0, .6, 0); for (const s of [-1, 1]) { const n = box(.7, .22, 1.08, chalk(col), .1, g, s * 1.95, .72, 0); n.rotation.z = s * .3; }
  box(1.0, .05, .5, chalk(0xffe23a), .02, g, 0, .73, 0); for (const x of [-1.2, 1.2]) for (const z of [-.42, .42]) { const w = cyl(.22, .22, .2, chalk(0xffffff), 12, g, x, .25, z); w.rotation.x = Math.PI / 2; } return g; }
// valla de madera con puerta de tiza (bisagra en x = -1.5)
export function fenceDoor(parent) { const g = G(parent); const wood = mat(0xb8835a, { roughness: .85 }), wt = mat(0xf4f0e6, { roughness: .8 });
  for (let k = -9; k <= 9; k++) { if (Math.abs(k) <= 1) continue; box(.7, 4.2, .25, wt, .08, g, k * .95, 2.1, 0); const tp = new THREE.Mesh(new THREE.ConeGeometry(.5, .5, 4), wt); tp.position.set(k * .95, 4.45, 0); tp.rotation.y = Math.PI / 4; tp.scale.z = .35; g.add(tp); }
  for (const y of [1, 3.2]) box(19, .3, .2, wood, .05, g, 0, y, -.2);
  const fr = textPlane(3.4, 5.6, 136, 224, (c, w, h) => chalkStroke(c, [[6, h], [6, 30], [w / 2, 4], [w - 6, 30], [w - 6, h]], '#ffffff', 8)); fr.position.set(0, 2.8, .16); g.add(fr);
  const hinge = G(g, -1.4, 0, .1); const d = box(2.8, 4.6, .14, chalk(0xff7ab8), .05, hinge, 1.4, 2.35, 0); const top = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, .14, 16, 1, false, 0, Math.PI), chalk(0xff7ab8)); top.rotation.set(Math.PI / 2, 0, Math.PI / 2); top.position.set(1.4, 4.6, 0); hinge.add(top);
  sphere(.2, chalk(0xffe23a), hinge, 2.3, 2.3, .14, 10, 8); for (let k = 0; k < 3; k++) box(2.2, .06, .02, chalk(0xffffff), 0, hinge, 1.4, 1 + k * 1.3, .08);
  const past = G(g, 0, 0, -2); for (const x of [-8, -5.5, 5.5, 8]) { const bush = sphere(1.2, mat([0x3aa036, 0x4cb63e][(x > 0) * 1], { roughness: 1 }), past, x, 1, -1, 10, 8); bush.scale.y = .8; }
  shade(g); g.userData.open = k => { hinge.rotation.y = -k * 1.7; }; return g; }
// Krümel: un círculo con tres patas (rayas), orejas de garabato y cola
export function krumel(parent) { const g = G(parent); const w = chalk(0xffffff, { glow: .3 }), body = G(g, 0, 1.9, 0);
  const b = sphere(1.25, w, body, 0, 0, 0, 24, 18); b.scale.set(1, 1, .55); const legs = [-.62, 0, .62].map(x => { const p = G(body, x, -1.0, 0); cyl(.12, .12, 1.3, w, 8, p, 0, -.6, 0); sphere(.18, w, p, 0, -1.25, .08, 8, 6); return p; });
  for (const s of [-1, 1]) { const e = G(body, s * .75, .95, 0); const ear = box(.18, .9, .18, w, .08, e, 0, .3, 0); ear.rotation.z = s * .5; }
  const tail = G(body, 1.15, .1, 0); const tl = box(.14, 1.1, .14, w, .06, tail, 0, .5, 0); tail.rotation.z = -.8;
  for (const s of [-1, 1]) sphere(.16, mat(0x1a1a1a), body, s * .38, .25, .66, 8, 6); sphere(.2, mat(0x1a1a1a), body, 0, -.05, .7, 8, 6);
  const tongue = box(.24, .32, .06, chalk(0xff7ab8), .06, body, .1, -.42, .68); shade(g);
  g.userData.anim = (T, run = 0) => { legs.forEach((l, i) => { l.rotation.z = Math.sin(T * (run ? 16 : 5) + i * 2.1) * (run ? .6 : .15); }); tail.rotation.z = -.8 + Math.sin(T * 14) * .4; body.position.y = 1.9 + Math.abs(Math.sin(T * (run ? 8 : 3))) * (run ? .5 : .1); tongue.visible = true; };
  return g; }
// gata de Lea (detallada, naranja con rayas)
export function kitty(parent) { const g = G(parent); const o = chalk(0xff9a3a, { stripe: '#c85a1a' }), wt = chalk(0xffffff);
  const bd = sphere(1.5, o, g, 0, 1.8, 0, 20, 14); bd.scale.set(1.5, 1, 1); sphere(.9, wt, g, .6, 1.5, .6, 12, 10).scale.set(1, .9, .5);
  const hd = G(g, 2.0, 3.0, 0); sphere(1.05, o, hd, 0, 0, 0, 18, 14); for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(.4, .8, 4), o); e.position.set(0, .95, s * .55); e.rotation.x = s * -.3; hd.add(e); }
  for (const s of [-1, 1]) { sphere(.24, chalk(0x8ad84a, { glow: .4 }), hd, .82, .2, s * .38, 10, 8); sphere(.12, mat(0x111111), hd, 1.0, .2, s * .38, 8, 6); for (let k = 0; k < 3; k++) { const wh = cyl(.025, .025, 1.2, wt, 4, hd, .9, -.15 + k * .12, s * .7); wh.rotation.x = Math.PI / 2 + s * (k - 1) * .2; } }
  sphere(.14, chalk(0xff7ab8), hd, 1.02, -.1, 0, 8, 6);
  for (const [x, z] of [[-1.2, -.6], [-1.2, .6], [1.2, -.6], [1.2, .6]]) cyl(.3, .32, 1.4, o, 10, g, x, .7, z);
  const tail = G(g, -2.1, 2.2, 0); const t = cyl(.2, .26, 2.6, o, 8, tail, 0, 1.2, 0); tail.rotation.z = .5; shade(g);
  g.userData.anim = T => { tail.rotation.z = .5 + Math.sin(T * 3) * .3; hd.rotation.z = Math.sin(T * 1.3) * .08; }; return g; }
// dragón Smaragd: cuerpo de segmentos a lo largo de un camino; melt = 0..1 se derrite desde la cola
export function dragon(scene) { const g = G(scene); const N = 30, gr = chalk(0x2ad86a, { stripe: '#1a9a4a', glow: .2 }), lt = chalk(0xb8ff6a, { glow: .25 }), gd = chalk(0xffd23f, { glow: .3 });
  const segs = [], R = i => i < 3 ? 2.3 + i * .25 : Math.max(.55, 3.0 - (i - 3) * .09);
  for (let i = 0; i < N; i++) { const s = G(g); const r = R(i); const b = sphere(r, gr, s, 0, 0, 0, 16, 12); b.scale.set(1.25, .92, 1);
    sphere(r * .82, lt, s, 0, -r * .3, 0, 12, 8).scale.set(1.2, .7, .9); if (i % 1 === 0 && i > 1) { const sp = new THREE.Mesh(new THREE.ConeGeometry(r * .32, r * .9, 5), gd); sp.position.y = r * .95; s.add(sp); }
    if (i === 6 || i === 15) for (const z of [-1, 1]) { const l = G(s, 0, -r * .5, z * r * .7); cyl(.45, .5, 2.4, gr, 8, l, 0, -1.1, 0); sphere(.55, gd, l, .3, -2.3, 0, 8, 6); s.userData.legs = (s.userData.legs || []).concat(l); }
    segs.push(s); }
  const head = G(g); const sk = sphere(2.6, gr, head, 0, 0, 0, 20, 16); sk.scale.set(1.3, 1, 1.05); const sn = box(3.6, 1.8, 2.8, gr, .7, head, 3.2, -.4, 0); box(3.2, .9, 2.4, lt, .4, head, 3.0, -1.4, 0);
  for (const z of [-1, 1]) { sphere(.75, chalk(0xffffff, { glow: .5 }), head, 1.6, 1.0, z * 1.25, 12, 10); sphere(.4, mat(0x111111), head, 2.05, 1.0, z * 1.35, 10, 8); sphere(.12, mat(0xffffff), head, 2.3, 1.15, z * 1.4, 6, 4);
    const h = new THREE.Mesh(new THREE.ConeGeometry(.45, 2.6, 6), gd); h.position.set(-.6, 2.4, z * .9); h.rotation.set(z * -.35, 0, .55); head.add(h); sphere(.22, mat(0x1a1a1a), head, 4.9, 0, z * .6, 6, 4);
    const wh = cyl(.08, .05, 3.2, gd, 5, head, 4.4, -.6, z * 1.4); wh.rotation.set(z * .9, 0, .9); }
  for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.4, 5), gd); m.position.set(-1.8 - k * .1, 1.4 - k * .3, 0); m.rotation.z = 1.1 + k * .1; head.add(m); }
  for (let k = 0; k < 5; k++) { const t = new THREE.Mesh(new THREE.ConeGeometry(.18, .5, 4), chalk(0xffffff)); t.position.set(4.2 - k * .6, -1.0, 1.2); t.rotation.x = Math.PI; head.add(t); const t2 = t.clone(); t2.position.z = -1.2; head.add(t2); }
  const wings = [-1, 1].map(z => { const w = G(g); const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(-3, 6); sh.lineTo(-6, 3.6); sh.lineTo(-7.5, 1); sh.lineTo(-4, .4); sh.closePath();
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), chalk(0x8affb8, { glow: .35, extra: { side: THREE.DoubleSide } })); m.rotation.x = -Math.PI / 2 * z; w.add(m); w.userData.z = z; return w; });
  const tailTip = new THREE.Mesh(new THREE.ConeGeometry(.9, 2.2, 4), gd); tailTip.rotation.z = Math.PI / 2; g.add(tailTip); shade(g);
  // gotas que caen al derretirse
  const drips = Array.from({ length: 40 }, () => { const d = sphere(.3, chalk(0x2ad86a, { glow: .2 }), g, 0, -999, 0, 8, 6); d.scale.y = 1.6; return d; });
  const P = (path, s) => path(s), q = new THREE.Vector3();
  // path(s, T): posición del cuerpo para s ∈ [0,1] (0 = cabeza). spacing en unidades de s por segmento
  const D = { g, segs, head, N, wings, R,
    update(T, path, o = {}) { const melt = o.melt ?? 0, sp = o.spacing ?? .031, keep = Math.floor(N * (1 - melt));
      const p0 = path(0, T), p1 = path(.01, T); head.position.copy(p0); const dir = p0.clone().sub(p1); head.rotation.set(0, Math.atan2(-dir.z, dir.x), Math.atan2(dir.y, Math.hypot(dir.x, dir.z)) * .8 + Math.sin(T * 2) * .05);
      head.visible = keep > 0 || melt < 1;
      segs.forEach((s, i) => { const sv = (i + 1) * sp + .012; const p = path(sv, T), pn = path(sv + .008, T); s.position.copy(p); const d = p.clone().sub(pn); s.rotation.set(0, Math.atan2(-d.z, d.x), Math.atan2(d.y, Math.hypot(d.x, d.z)));
        s.visible = i < keep || (i === keep && (N * (1 - melt)) % 1 > .2); const mk = clamp((N * (1 - melt) - i)); s.scale.setScalar(i === keep ? Math.max(.3, (N * (1 - melt)) % 1) : 1);
        (s.userData.legs || []).forEach((l, j) => l.rotation.z = Math.sin(T * 4 + j) * .3); });
      const tl = path((N + 1) * sp + .012, T); tailTip.position.copy(tl); tailTip.visible = melt < .02; tailTip.rotation.y = segs[N - 1].rotation.y;
      wings.forEach(w => { const s = segs[3]; w.position.copy(s.position).add(V(0, R(3) * .6, 0)); w.rotation.set(w.userData.z * (.3 + Math.sin(T * 5) * .5), s.rotation.y, 0); w.visible = keep > 3; });
      drips.forEach((d, i) => { if (melt <= 0 || melt >= 1 || i >= 30) { d.visible = false; return; } const si = Math.min(N - 1, keep + (i % 3)), s = segs[Math.max(0, Math.min(N - 1, si))], r = RNG(i * 7 + 3), per = .8 + r() * .5, ph = ((T + r() * per) % per) / per;
        d.visible = true; d.position.copy(s.position).add(V((r() - .5) * 3, -R(si) * .8 - ph * ph * 30, (r() - .5) * 3)); d.scale.set(1, 1.6 + ph, 1); });
      return D; },
    seat(i) { const s = segs[i]; s.updateMatrixWorld(true); return s.localToWorld(V(0, R(i) * .82, 0)); } };
  return D; }
// tobogán de tiza: dos rayas + escalones; build = 0..1 se dibuja; melt = 0..1 se derrite desde arriba
export function slide(parent, Hs = 26, L = 30) { const g = G(parent); const w = chalk(0xffffff, { glow: .5 }), bl = chalk(0x5ab8ff, { glow: .4 }); const parts = [];
  const add = (m, h) => { m.userData.h = h; parts.push(m); return m; };
  // rampa: de (0, Hs, 0) a (0, 1, L) con curva al final
  const P = s => V(0, 1 + (Hs - 1) * Math.pow(1 - s, 1.25), L * s);
  const n = 40; for (let i = 0; i < n; i++) { const a = P(i / n), b = P((i + 1) / n), mid = a.clone().add(b).multiplyScalar(.5), len = a.distanceTo(b), ang = Math.atan2(b.y - a.y, b.z - a.z);
    for (const x of [-1.8, 1.8]) { const r = add(cyl(.26, .26, len + .1, w, 6, g, x, mid.y + 1.1, mid.z), mid.y); r.rotation.x = Math.PI / 2 - ang; r.rotation.x = -ang + Math.PI / 2; }
    const bed = add(box(3.4, .18, len + .05, bl, 0, g, 0, mid.y, mid.z), mid.y); bed.rotation.x = -ang; }
  // escalera detrás (z < 0)
  for (const x of [-1.8, 1.8]) for (let i = 0; i < 13; i++) { const y = i * Hs / 13; add(cyl(.24, .24, Hs / 13 + .05, w, 6, g, x, y + Hs / 26, -1.2), y); }
  for (let i = 1; i < 13; i++) { const y = i * Hs / 13; const st = add(box(3.6, .3, .9, w, .08, g, 0, y, -1.2), y); }
  g.userData.set = (build = 1, melt = 0) => { const top = Hs * (1 - melt) + 1.5; parts.forEach(p => { const h = p.userData.h; p.visible = h <= Hs * build + 1.2 && h <= top; }); };
  g.userData.P = P; g.userData.Hs = Hs; shade(g); return g; }
// escalera de tiza (Lea)
export function ladder(parent) { const g = G(parent); const p = chalk(0xff7ab8, { glow: .4 }); const parts = [];
  for (let i = 0; i < 10; i++) { for (const x of [-1.2, 1.2]) parts.push(cyl(.2, .2, 2.05, p, 6, g, x, i * 2 + 1, 0)); const st = box(2.6, .25, .3, p, .05, g, 0, i * 2 + 2, 0); parts.push(st); }
  g.userData.set = k => parts.forEach((m, i) => m.visible = i < parts.length * k); return g; }
// monigotes de tiza (bailan)
export function sticks(scene, n = 40) { const g = G(scene); const w = chalk(0xffffff, { glow: .55 }); const cols = [0xffffff, 0xffe23a, 0x5ab8ff, 0xff7ab8, 0x8ad84a];
  const L = Array.from({ length: n }, (_, i) => { const s = G(g); const m = i % 5 ? chalk(cols[i % 5], { glow: .5 }) : w; const ring = new THREE.Mesh(new THREE.TorusGeometry(.75, .16, 8, 20), m); ring.position.y = 5.4; s.add(ring); const face = sphere(.68, mat(0x1a1a1a, { transparent: true, opacity: 0 }), s, 0, 5.4, 0, 6, 4);
    cyl(.15, .15, 2.4, m, 6, s, 0, 3.4, 0); const arms = [-1, 1].map(k => { const p = G(s, 0, 4.0, 0); const a = cyl(.13, .13, 1.7, m, 6, p, k * .75, 0, 0); a.rotation.z = Math.PI / 2; return p; }); const legs = [-1, 1].map(k => { const p = G(s, 0, 2.2, 0); const l = cyl(.14, .14, 2.3, m, 6, p, 0, -1.1, 0); return p; });
    for (const k of [-1, 1]) sphere(.1, mat(0x1a1a1a), s, k * .25, 5.55, .2, 6, 4); s.userData = { arms, legs, ring }; s.visible = false; return s; });
  return { g, L, update(T, spots, mode = 'dance') { L.forEach((s, i) => { const p = spots[i]; if (!p) { s.visible = false; return; } s.visible = true; const r = RNG(i * 9 + 1), ph = r() * 6, sp = 5 + r() * 3;
    s.position.set(p[0], p[1] + (mode === 'dance' ? Math.abs(Math.sin(T * sp + ph)) * .8 : 0), p[2]); s.rotation.set(0, p[3] ?? 0, mode === 'dance' ? Math.sin(T * sp * .5 + ph) * .18 : 0); s.scale.setScalar(p[4] ?? 1);
    const a = mode === 'dance' ? Math.sin(T * sp + ph) : 0; s.userData.arms[0].rotation.z = -.4 + a * .9 + (mode === 'wave' ? 1.2 : 0); s.userData.arms[1].rotation.z = .4 + a * .9;
    s.userData.legs[0].rotation.z = mode === 'dance' ? .3 + a * .3 : .2; s.userData.legs[1].rotation.z = mode === 'dance' ? -.3 + a * .3 : -.2; }); } }; }
// paraguas sueltos (con mango) y paraguas instanciados para la multitud
export function umbrella(parent, col = 0xd8323a, col2 = 0xffffff) { const g = G(parent); const tex = canvasTex(64, 16, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? hex(col2) : hex(col); c.fillRect(i * 8, 0, 8, h); } });
  const can = new THREE.Mesh(new THREE.ConeGeometry(3.2, 1.4, 8, 1, true), mat(0xffffff, { map: tex, side: THREE.DoubleSide, roughness: .5 })); can.position.y = 6; g.add(can);
  cyl(.06, .06, 6.4, mat(0x2a2a2a, { metalness: .6 }), 6, g, 0, 3.4, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.32, .08, 6, 12, Math.PI), mat(0x6a3a1a)); h.position.set(.32, .3, 0); h.rotation.z = Math.PI; g.add(h); sphere(.14, mat(0x2a2a2a), g, 0, 6.75, 0, 6, 4); shade(g); return g; }
export function umbrellaField(scene, n = 400) { const g = G(scene); const C = [0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0xff8ad0, 0x1a1a2a, 0xff8a3a, 0x8a3ad8, 0x1aa0a0, 0xf4f4f4];
  const can = new THREE.InstancedMesh(new THREE.ConeGeometry(3.3, 1.3, 8, 1, true), mat(0xffffff, { roughness: .45, side: THREE.DoubleSide }), n), st = new THREE.InstancedMesh(new THREE.CylinderGeometry(.07, .07, 6, 5), mat(0x2a2a2a), n);
  const c = new THREE.Color(); for (let i = 0; i < n; i++) can.setColorAt(i, c.setHex(C[(i * 7) % C.length])); [can, st].forEach(m => { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; g.add(m); });
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(1, 1, 1), P = new THREE.Vector3();
  return { g, set(list) { list.forEach((u, i) => { if (i >= n) return; Q.setFromEuler(E.set(u[3] || 0, u[5] || 0, u[4] || 0)); S.setScalar(u[6] ?? 1); M.compose(P.set(u[0], u[1] + 6.2 * (u[6] ?? 1), u[2]), Q, S); can.setMatrixAt(i, M); M.compose(P.set(u[0], u[1] + 3 * (u[6] ?? 1), u[2]), Q, S); st.setMatrixAt(i, M); });
    can.count = st.count = Math.min(n, list.length); can.instanceMatrix.needsUpdate = st.instanceMatrix.needsUpdate = true; } }; }
// lluvia: rayas que caen alrededor de un centro
export function rain(scene, n = 2200) { const m = new THREE.InstancedMesh(new THREE.BoxGeometry(.05, 1.8, .05), new THREE.MeshBasicMaterial({ color: 0xc8e4ff, transparent: true, opacity: .55, depthWrite: false, fog: false }), n); m.frustumCulled = false; scene.add(m);
  const splash = new THREE.InstancedMesh(new THREE.RingGeometry(.15, .3, 10), new THREE.MeshBasicMaterial({ color: 0xe0f0ff, transparent: true, opacity: .5, depthWrite: false, side: THREE.DoubleSide }), 300); splash.frustumCulled = false; scene.add(splash);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, .12)), Qs = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), P = new THREE.Vector3(), S = new THREE.Vector3(1, 1, 1);
  const R_ = { m, splash, update(T, c, k = 1, sx = 70, sy = 50, sz = 70, ground = 0) { const cnt = Math.floor(n * clamp(k)); m.visible = splash.visible = cnt > 0; for (let i = 0; i < cnt; i++) { const r = RNG(i * 3 + 1), spd = 38 + r() * 14, y0 = r() * sy; const y = sy - ((T * spd + y0) % sy);
      M.compose(P.set(c.x + (r() - .5) * sx + y * .12, c.y + y - 4, c.z + (r() - .5) * sz), Q, S); m.setMatrixAt(i, M); } m.count = cnt; m.instanceMatrix.needsUpdate = true;
    const ns = Math.min(140, Math.floor(cnt / 14)); for (let i = 0; i < ns; i++) { const r = RNG(i * 11 + 5), per = .35, ph = ((T + r() * per) % per) / per; S.setScalar(.5 + ph * 2.4); M.compose(P.set(c.x + (r() - .5) * sx * .6, ground + .1, c.z + (r() - .5) * sz * .6), Qs, S); splash.setMatrixAt(i, M); } splash.count = ns; splash.material.opacity = .22; S.set(1, 1, 1); splash.instanceMatrix.needsUpdate = true; } };
  m.visible = splash.visible = false; return R_; }
// nubes negras de tormenta
export function stormClouds(scene, n = 14) { const g = G(scene); const m = [mat(0x2a2e3a, { roughness: 1 }), mat(0x3a3e4a, { roughness: 1 }), mat(0x1e2230, { roughness: 1 })]; const C = [];
  for (let i = 0; i < n; i++) { const c = G(g); const r = RNG(i * 5 + 2); for (let k = 0; k < 7; k++) { const s = sphere(8 + r() * 8, m[k % 3], c, (r() - .5) * 30, (r() - .5) * 5, (r() - .5) * 16, 12, 8); s.scale.y = .6; s.castShadow = false; } C.push(c); }
  return { g, C, set(c, T, k = 1, spread = 160, h = 70) { g.visible = k > 0; C.forEach((cl, i) => { const r = RNG(i * 13 + 1); cl.position.set(c.x + (r() - .5) * spread + Math.sin(T * .3 + i) * 4, h + r() * 20, c.z + (r() - .5) * spread - 20); cl.scale.setScalar(.2 + .8 * clamp(k * 1.4 - r() * .4)); }); } }; }
// sirena de lluvia: poste con tres bocinas y luz roja giratoria
export function siren(parent, x, z, h = 16) { const g = G(parent, x, 0, z); const met = mat(0x8a8e98, { metalness: .7, roughness: .3 }); cyl(.35, .45, h, met, 10, g, 0, h / 2, 0); box(3, .5, 3, met, .1, g, 0, h, 0);
  const heads = G(g, 0, h + 1.4, 0); for (let k = 0; k < 3; k++) { const a = k / 3 * 6.283; const hn = new THREE.Mesh(new THREE.CylinderGeometry(1.3, .3, 2.6, 14, 1, true), mat(0xe8e8e8, { side: THREE.DoubleSide, roughness: .4 })); hn.rotation.set(0, 0, Math.PI / 2); const p = G(heads); p.rotation.y = a; hn.position.x = 1.6; p.add(hn); const inner = cyl(.9, .9, .1, mat(0x2a2a2a), 14, p, 2.85, 0, 0); inner.rotation.z = Math.PI / 2; }
  const lamp = sphere(.7, mat(0xff2a2a, { emissive: 0xff2020, emissiveIntensity: .3 }), g, 0, h + 3.2, 0, 14, 10); const L = new THREE.PointLight(0xff2a2a, 0, 40, 1.5); L.position.set(0, h + 3.2, 0); g.add(L);
  const sg = textPlane(4.4, 1.6, 264, 96, (c, w, h_) => { c.fillStyle = '#1a3a8a'; c.fillRect(0, 0, w, h_); c.strokeStyle = '#fff'; c.lineWidth = 6; c.strokeRect(5, 5, w - 10, h_ - 10); txt(c, 'REGENSIRENE', w / 2, h_ / 2 + 3, 40, '#ffffff'); }); sg.position.set(0, 5, .5); g.add(sg); const sg2 = sg.clone(); sg2.rotation.y = Math.PI; sg2.position.z = -.5; g.add(sg2);
  shade(g); g.userData.on = (T, on) => { heads.rotation.y = on ? T * 2 : 0; lamp.material.emissiveIntensity = on ? 2 + Math.sin(T * 14) * 1.6 : .3; L.intensity = on ? 80 + Math.sin(T * 14) * 60 : 0; heads.position.y = h + 1.4 + (on ? Math.sin(T * 60) * .04 : 0); }; return g; }
// llaves
const KEYC = [0xe9c23a, 0xc8ccd4, 0xd89a4a, 0xa8b0bc];
export function key(parent, i = 0, s = 1) { const g = G(parent); const m = mat(KEYC[i % 4], { metalness: .85, roughness: .25 }); const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .1, 6, 14), m); r.position.x = -.55; g.add(r); box(1.0, .14, .1, m, .02, g, .25, 0, 0); box(.12, .3, .1, m, 0, g, .55, -.18, 0); box(.12, .22, .1, m, 0, g, .35, -.14, 0); g.scale.setScalar(s); return g; }
// feria (Jahrmarkt) para la visión: noria con luces, tiovivo, casetas de rayas, guirnaldas
export function jahrmarkt(scene, X) { const g = G(scene, X); const gr = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), mat(0x8a7a5a, { roughness: 1, map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#9a8a6a'; c.fillRect(0, 0, w, h); const r = RNG(3); for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(0,0,0,${r() * .15})`; c.fillRect(r() * w, r() * h, 2, 2); } }, true) })); gr.material.map.repeat.set(40, 40); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; g.add(gr);
  // noria
  const RR = G(g, 0, 0, -60); const met = mat(0xf4f4f4, { metalness: .4, roughness: .4 }); for (const s of [-1, 1]) { const a = cyl(.5, .6, 34, met, 8, RR, s * 9, 16, 2); a.rotation.z = s * .28; const b = cyl(.5, .6, 34, met, 8, RR, s * 9, 16, -2); b.rotation.z = s * .28; }
  const wheel = G(RR, 0, 31, 0); for (const z of [-1.6, 1.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(22, .45, 8, 60), met); t.position.z = z; wheel.add(t); } for (let k = 0; k < 16; k++) { const sp = cyl(.2, .2, 44, met, 5, wheel, 0, 0, 0); sp.rotation.z = k / 16 * Math.PI; }
  const gond = []; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; const gd = G(RR); const c = box(3, 2.6, 3, mat([0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a][k % 4], { roughness: .4 }), .4, gd, 0, -1.6, 0); box(3.4, .3, 3.4, mat(0xf4f4f4), .1, gd, 0, -.2, 0); gond.push([gd, a]); }
  for (let k = 0; k < 48; k++) { const a = k / 48 * 6.283; sphere(.35, mat(0xfff0a0, { emissive: 0xffd06a, emissiveIntensity: 2 }), wheel, Math.cos(a) * 22, Math.sin(a) * 22, 1.8, 6, 4); }
  // tiovivo
  const KR = G(g, -26, 0, -20); cyl(10, 10, 1, mat(0xd8323a, { roughness: .4 }), 24, KR, 0, .5, 0); cyl(.8, .8, 12, mat(0xe9c23a, { metalness: .7 }), 10, KR, 0, 6, 0);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(12, 5, 16), mat(0xffffff, { map: canvasTex(128, 16, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#d8323a'; c.fillRect(i * 8, 0, 8, h); } }) })); roof.position.y = 14; KR.add(roof);
  const horses = []; for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; const hp = G(KR, Math.cos(a) * 7, 4, Math.sin(a) * 7); hp.rotation.y = -a; cyl(.12, .12, 10, mat(0xe9c23a, { metalness: .7 }), 6, hp, 0, 2, 0); box(3, 1.4, 1, mat(0xf8f0e0), .4, hp, 0, 0, 0); box(1, 1.6, .8, mat(0xf8f0e0), .3, hp, 1.6, .9, 0); horses.push(hp); }
  for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283; sphere(.3, mat(0xfff0a0, { emissive: 0xffd06a, emissiveIntensity: 2 }), KR, Math.cos(a) * 11.6, 11.6, Math.sin(a) * 11.6, 6, 4); }
  // casetas
  const stalls = []; [[24, -16, -.6, 'LOSE', '#2a6ad8'], [30, 4, -1.2, 'ZUCKERWATTE', '#ff7ab8'], [-24, 14, .9, 'BRATWURST', '#d8823a'], [18, 22, -2.2, 'SCHIESSBUDE', '#2ab86a']].forEach(([x, z, ry, t, col]) => { const s = G(g, x, 0, z); s.rotation.y = ry;
    box(10, 4, 5, mat(0xf4ead8), .2, s, 0, 2, 0); const rf = box(11, .5, 6.4, mat(0xffffff, { map: canvasTex(64, 16, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#ffffff' : col; c.fillRect(i * 8, 0, 8, h); } }) }), .1, s, 0, 7.6, .6); rf.rotation.x = .15;
    for (const x2 of [-5, 5]) cyl(.18, .18, 7.6, mat(0xf4f4f4), 6, s, x2, 3.8, 2.6); const sg = textPlane(9, 1.8, 360, 72, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); txt(c, t, w / 2, h / 2 + 3, 44, '#ffffff'); }, .4); sg.position.set(0, 6.2, 3.1); s.add(sg); stalls.push(s); });
  // guirnaldas de bombillas
  for (let k = 0; k < 3; k++) for (let i = 0; i < 30; i++) { const x = -40 + i * 2.8, y = 12 - Math.sin(i / 29 * Math.PI) * 3 + k * 2, z = -6 - k * 14; sphere(.3, mat([0xff6a6a, 0xffe06a, 0x6ab8ff, 0x8aff8a][i % 4], { emissive: [0xff4a4a, 0xffd04a, 0x4a9aff, 0x6aff6a][i % 4], emissiveIntensity: 1.6 }), g, x, y, z, 6, 4); }
  for (let i = 0; i < 9; i++) { const p = cyl(.2, .2, 15, mat(0x5a4a3a), 6, g, -42 + i * 11, 7.5, -6 - (i % 3) * 14); }
  shade(g); return { g, RR, wheel, gond, KR, horses, update(T) { wheel.rotation.z = T * .15; gond.forEach(([gd, a]) => gd.position.set(Math.cos(a + T * .15) * 22, 31 + Math.sin(a + T * .15) * 22, 0)); KR.rotation.y = T * .5; horses.forEach((h, k) => h.position.y = 4 + Math.sin(T * 3 + k) * .8); } }; }
// jardín con caseta (Gartenhäuschen)
export function garten(scene, X) { const g = G(scene, X); const lawn = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0xffffff, { roughness: 1, map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#5cc24a'; c.fillRect(0, 0, w, h); const r = RNG(2); for (let i = 0; i < 400; i++) { c.fillStyle = r() < .5 ? '#4aae3a' : '#7ad868'; c.fillRect(r() * w, r() * h, 2, 3); } }, true) })); lawn.material.map.repeat.set(60, 60); lawn.rotation.x = -Math.PI / 2; lawn.receiveShadow = true; g.add(lawn);
  const wood = mat(0x9a6a3a, { roughness: .8 }), wd2 = mat(0x7a4a22, { roughness: .8 }); const sh = G(g, 0, 0, -10);
  for (let k = 0; k < 11; k++) box(1.1, 8, .5, k % 2 ? wood : mat(0xa8784a, { roughness: .8 }), .05, sh, -5.5 + k * 1.1, 4, 5); for (const x of [-6, 6]) box(.5, 8, 10, wood, .05, sh, x, 4, 0); box(12, 8, .5, wood, .05, sh, 0, 4, -5);
  const rf = new THREE.Mesh(new THREE.CylinderGeometry(.01, 9.2, 4, 4, 1, false, Math.PI / 4), mat(0x3a5a3a, { roughness: .7 })); rf.scale.set(1, 1, .9); rf.position.y = 10; sh.add(rf);
  const door = G(sh, -1.6, 0, 5.3); box(3.2, 6, .3, mat(0x2a6a9a, { roughness: .5 }), .06, door, 1.6, 3, 0); sphere(.2, mat(0xd9a531, { metalness: .8 }), door, 2.8, 3, .25, 8, 6); box(2.2, 1.6, .1, mat(0xbfe6ff, { roughness: .1, metalness: .3 }), .02, sh, 3.4, 5, 5.3); box(2.6, .3, .6, mat(0xffffff), .02, sh, 3.4, 4.1, 5.5);
  for (let k = 0; k < 5; k++) sphere(.32, mat([0xff4a6a, 0xffd23f, 0xff8ad0][k % 3]), sh, 2.6 + k * .4, 4.5, 5.7, 6, 4);
  const sg = textPlane(3.6, 1, 216, 60, (c, w, h) => { c.fillStyle = '#f4ead8'; c.fillRect(0, 0, w, h); txt(c, 'OPAS HÄUSCHEN', w / 2, h / 2 + 2, 30, '#5a3a1a'); }); sg.position.set(0, 8.4, 5.3); sh.add(sg);
  // llavero con ganchos vacíos al lado de la puerta (y llaves pegadas en la pared)
  const hook = box(2.2, .5, .3, wd2, .05, sh, -4, 6, 5.4); for (let k = 0; k < 7; k++) { const kk = key(sh, k, .8); kk.position.set(-5 + k * .6 + (k % 2) * .2, 5.2 - (k % 3) * .7, 5.5); kk.rotation.z = k * .9; }
  // valla, setos, flores, casa al fondo, árbol con columpio
  for (let k = -20; k <= 20; k++) box(.4, 3, .3, mat(0xf4f0e6), .05, g, k * 1.4, 1.5, -24); box(58, .2, .2, mat(0xf4f0e6), .02, g, 0, 2.4, -24);
  for (let k = 0; k < 14; k++) { const b = sphere(2.4, mat([0x3aa036, 0x4cb63e][k % 2], { roughness: 1 }), g, -30 + k * 4.6, 1.8, -27, 10, 8); b.scale.y = .9; }
  for (let k = 0; k < 40; k++) { const r = RNG(k); sphere(.4, mat([0xff4a6a, 0xffd23f, 0xff8ad0, 0xffffff, 0x8a5aff][k % 5]), g, -24 + r() * 48, .5, 6 + r() * 4, 6, 4); }
  const house = G(g, 26, 0, -2); box(24, 18, 16, mat(0xf6e6b8, { roughness: .8 }), 0, house, 0, 9, 0); const hr = new THREE.Mesh(new THREE.CylinderGeometry(.01, 16, 8, 4, 1, false, Math.PI / 4), mat(0xb84a32, { roughness: .6 })); hr.scale.set(1, 1, .7); hr.position.y = 22; house.add(hr);
  for (const [x, y] of [[-6, 5], [6, 5], [-6, 13], [6, 13]]) { box(4, 4, .3, mat(0xbfe6ff, { roughness: .1, metalness: .3 }), .02, house, x, y, 8.1); box(4.6, .4, .8, mat(0xffffff), .05, house, x, y - 2.3, 8.3); } box(4, 7, .3, mat(0x2a6a4a), .05, house, 0, 3.5, 8.1);
  const tr = G(g, -20, 0, -6); cyl(1, 1.4, 12, mat(0x6a4422), 8, tr, 0, 6, 0); for (let k = 0; k < 6; k++) { const r = RNG(k + 40); sphere(5 + r() * 2, mat(0x3aa036, { roughness: 1 }), tr, (r() - .5) * 8, 13 + r() * 4, (r() - .5) * 8, 10, 8); }
  for (const x of [-1.6, 1.6]) cyl(.06, .06, 6, mat(0xd8d0c0), 4, tr, 3 + x, 6.5, 2); box(4, .3, 1.2, mat(0xd8323a), .05, tr, 3, 3.5, 2);
  shade(g); return { g, sh, door }; }
// sala del Sistema: suelo de rejilla, racks con LEDs, pantalla gigante con canvas, núcleo flotante (ojo)
export function systemRoom(scene, X) { const g = G(scene, X); const fl = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x0a0c14, roughness: .35, metalness: .6, map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#0a0c14'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a3a6a'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); }, true), emissive: 0x1a3a8a, emissiveIntensity: .25 }));
  fl.material.map.repeat.set(60, 60); fl.material.emissiveMap = fl.material.map; fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; g.add(fl);
  const rk = mat(0x14161e, { roughness: .4, metalness: .5 }); const leds = [];
  for (const side of [-1, 1]) for (let row = 0; row < 3; row++) for (let k = 0; k < 9; k++) { const x = side * (22 + row * 14), z = 30 - k * 9; const r = G(g, x, 0, z); r.rotation.y = -side * Math.PI / 2; box(7, 20, 6, rk, .1, r, 0, 10, 0);
    for (let j = 0; j < 14; j++) { const m = new THREE.MeshBasicMaterial({ color: [0x2aff8a, 0x2a8aff, 0xff3a5a][(j + k + row) % 3] }); const l = box(.3, .3, .1, m, 0, r, -2.4 + (j % 4) * 1.6, 2 + Math.floor(j / 4) * 4.2 + (j % 2) * .6, 3.05); leds.push([l, (j * 7 + k * 3 + row) % 11]); for (let s = 0; s < 3; s++) box(5.6, .12, .1, mat(0x2a2e3a), 0, r, 0, 1.5 + Math.floor(j / 4) * 4.2 + s * 1.2, 3.02); } }
  // pantalla gigante curva
  const scrC = document.createElement('canvas'); scrC.width = 1280; scrC.height = 720; const scrT = new THREE.CanvasTexture(scrC); scrT.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.CylinderGeometry(60, 60, 34, 48, 1, true, Math.PI - .55, 1.1), new THREE.MeshBasicMaterial({ map: scrT, side: THREE.BackSide, toneMapped: false })); scr.position.set(0, 24, 20); scr.scale.x = -1; g.add(scr);
  const frame = new THREE.Mesh(new THREE.CylinderGeometry(60.6, 60.6, 35.6, 48, 1, true, Math.PI - .57, 1.14), new THREE.MeshStandardMaterial({ color: 0x1a1c24, side: THREE.BackSide, metalness: .6, roughness: .4 })); frame.position.copy(scr.position); frame.scale.x = -1; g.add(frame);
  // núcleo del Sistema: esfera brillante con anillos y pupila
  const core = G(g, 0, 16, -14); const glow = new THREE.MeshBasicMaterial({ color: 0x6ad8ff, toneMapped: false }); const eye = sphere(2.6, new THREE.MeshStandardMaterial({ color: 0x0a1a2a, emissive: 0x2a9aff, emissiveIntensity: 1.2, roughness: .2, metalness: .5 }), core, 0, 0, 0, 24, 18);
  const pupil = sphere(1.0, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), core, 0, 0, 2.0, 16, 12); pupil.scale.z = .4;
  const rings = [0, 1, 2].map(i => { const r = new THREE.Mesh(new THREE.TorusGeometry(4 + i * 1.4, .12, 8, 64), glow); core.add(r); return r; });
  // silla del Chef (respaldo alto) y mesa con teclado brillante
  const chair = G(g, 12, 0, -24); const cm = mat(0x0a0a10, { roughness: .3, metalness: .4 }); box(5, 1, 5, cm, .3, chair, 0, 4, 0); box(5, 9, 1, cm, .4, chair, 0, 9, -2.4); cyl(.3, .3, 3.5, mat(0x3a3a44, { metalness: .8 }), 8, chair, 0, 1.75, 0); cyl(2.5, 2.5, .3, mat(0x3a3a44, { metalness: .8 }), 5, chair, 0, .2, 0);
  const desk = G(g, 12, 0, -14); box(10, .6, 4, cm, .1, desk, 0, 5, 0); for (const x of [-4.4, 4.4]) box(.5, 5, 3.6, cm, .05, desk, x, 2.5, 0); box(6, .2, 1.8, new THREE.MeshBasicMaterial({ color: 0x2a9aff, toneMapped: false }), .02, desk, 0, 5.4, 0);
  shade(g); fl.castShadow = false;
  return { g, scr, scrC, scrT, core, eye, pupil, rings, chair, desk, leds,
    draw(f) { f(scrC.getContext('2d'), 1280, 720); scrT.needsUpdate = true; },
    update(T, talk = 0, red = 0) { leds.forEach(([l, ph], i) => l.visible = ((Math.floor(T * 6) + ph) % 11) > 2); rings.forEach((r, i) => { r.rotation.set(T * (.4 + i * .3), T * (.6 - i * .2), 0); r.material.color.setRGB(lerp(.42, 1, red), lerp(.85, .2, red), lerp(1, .25, red)); });
      eye.material.emissive.setRGB(lerp(.16, 1, red), lerp(.6, .12, red), lerp(1, .15, red)); eye.material.emissiveIntensity = .55 + talk * .7; pupil.scale.set(1 + talk * .5, 1 + talk * .5, .4); core.position.y = 16 + Math.sin(T * 1.2) * .5; } }; }
// arcoíris 3D (medio toro de 6 bandas)
export function rainbow(parent, r = 10) { const g = G(parent); ['#ff3a3a', '#ff9a2a', '#ffe23a', '#4ad84a', '#3a9aff', '#8a5aff'].forEach((c, i) => { const t = new THREE.Mesh(new THREE.TorusGeometry(r - i * .7, .38, 8, 40, Math.PI), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: .45, roughness: .6 })); g.add(t); });
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) sphere(1.3 - k * .1, mat(0xffffff, { roughness: 1 }), g, s * (r - 1.8) + (k - 1.5) * 1.1, .4 + (k % 2) * .5, 0, 10, 8); return g; }
// colegio (Grundschule)
export function schule(parent, x, z, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry; const wm = mat(0xf2c8a0, { roughness: .8 }); box(46, 20, 18, wm, 0, g, 0, 10, 0); box(47, 1, 19, mat(0xb84a32), .1, g, 0, 20.5, 0);
  for (let f = 0; f < 2; f++) for (let k = 0; k < 8; k++) { if (f === 0 && Math.abs(k - 3.5) < 1) continue; box(3.6, 4, .3, mat(0xbfe6ff, { roughness: .1, metalness: .3 }), .02, g, -19 + k * 5.4, 5 + f * 8, 9.1); box(4.2, .3, .7, mat(0xffffff), .02, g, -19 + k * 5.4, 2.8 + f * 8, 9.3); }
  box(8, 7, .4, mat(0x2a6ad8), .05, g, 0, 3.5, 9.1); const sg = textPlane(18, 2.6, 720, 104, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'GRUNDSCHULE AM MARKT', w / 2, h / 2 + 4, 64, '#2a3a8a'); }); sg.position.set(0, 16.6, 9.3); g.add(sg);
  const clk = textPlane(4, 4, 128, 128, (c, w, h) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.lineWidth = 6; c.strokeStyle = '#1a1a1a'; c.stroke(); c.beginPath(); c.moveTo(64, 64); c.lineTo(64, 24); c.moveTo(64, 64); c.lineTo(94, 70); c.stroke(); }); clk.position.set(0, 12, 9.3); g.add(clk);
  for (let k = 0; k < 14; k++) { const b = cyl(.12, .12, 2.4, mat(0x6a6e78, { metalness: .6 }), 6, g, -14 + k * 2.2, 1.2, 16); } box(31, .2, .2, mat(0x6a6e78), .02, g, 1, 2.2, 16); shade(g); return g; }
