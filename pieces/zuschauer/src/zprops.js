// ZUSCHAUER — atrezo propio: la Tafel de Papa (marcador con bombillas), el pulgar gigante, prismáticos, bote de pepinillos,
// nevera abierta, calendario con cruces, móvil gigante de la plaza, sofá dorado con «DU», interior del bus 42.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, outline } from './engine.js';
import { FONT, txt } from './props.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g; };
export const glowM = (c, k = 2) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });
function scr(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; let last = null; return { c, t, draw(key, f) { if (key === last) return; last = key; const x = c.getContext('2d'); x.clearRect(0, 0, w, h); f(x, w, h); t.needsUpdate = true; } }; }
const scrMat = t => new THREE.MeshBasicMaterial({ map: t, toneMapped: false, color: new THREE.Color(.92, .92, .92) });

// carita amarilla (icono de espectador)
function smiley(c, x, y, r, mood = 'ok') { c.fillStyle = '#ffd23f'; c.strokeStyle = '#1a1a1a'; c.lineWidth = r * .12; c.beginPath(); c.rect(x - r, y - r, r * 2, r * 2); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillRect(x - r * .5, y - r * .35, r * .22, r * .34); c.fillRect(x + r * .28, y - r * .35, r * .22, r * .34);
  c.lineWidth = r * .12; c.beginPath(); if (mood === 'ok') c.moveTo(x - r * .45, y + r * .4), c.lineTo(x + r * .45, y + r * .4); else c.arc(x, y + r * .2, r * .45, .3, 2.84); c.stroke(); }
function cross(c, x, y, r) { c.fillStyle = '#ffd23f'; c.fillRect(x - r, y - r, r * 2, r * 2); c.strokeStyle = '#e8202a'; c.lineWidth = r * .42; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - r * .7, y - r * .7); c.lineTo(x + r * .7, y + r * .7); c.moveTo(x + r * .7, y - r * .7); c.lineTo(x - r * .7, y + r * .7); c.stroke(); c.lineCap = 'butt'; }
const fmt = s => `0:${String(Math.max(0, Math.floor(s))).padStart(2, '0')}`;

// ---------- la Tafel: 14 × 18 de pantalla, marco dorado con bombillas, postes; mira a +z ----------
// draw({rows:[{t:3, gone:true}], du: segundos | null, gold: 0..1, live: n})
export function tafel(parent) { const g = G(parent); const gm = mat(0xe9b83a, { metalness: .8, roughness: .3, emissive: 0x3a2400, emissiveIntensity: .2 }), dk = mat(0x1a1a24, { roughness: .4 });
  for (const s of [-1, 1]) { box(1.2, 30, 1.2, dk, .2, g, s * 8.6, 15, -1.2); box(3, 1, 3, mat(0x3a3a48), .2, g, s * 8.6, .5, -1.2); }
  box(18.4, 22.4, 1.4, dk, .3, g, 0, 19, -.4); box(19.4, 1, 1.8, gm, .2, g, 0, 30.6, -.2); box(19.4, 1, 1.8, gm, .2, g, 0, 7.4, -.2); for (const s of [-1, 1]) box(1, 23, 1.8, gm, .2, g, s * 9.7, 19, -.2);
  const S = scr(560, 680); const m = new THREE.Mesh(new THREE.PlaneGeometry(16.4, 20), scrMat(S.t)); m.position.set(0, 19, .34); g.add(m);
  const bOn = glowM(0xfff0a0, 2.4), bOff = mat(0x6a6250, { roughness: .4 }); const bulbs = [];
  const add = (x, y) => { const b = sphere(.3, bOff, g, x, y, .75, 8, 6); bulbs.push(b); };
  for (let k = 0; k <= 26; k++) { const x = -9.7 + k * (19.4 / 26); add(x, 30.6); add(x, 7.4); } for (let k = 1; k < 30; k++) { const y = 7.4 + k * (23.2 / 30); add(-9.7, y); add(9.7, y); }
  const order = bulbs.map((b, i) => [Math.atan2(b.position.y - 19, b.position.x), i]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  g.userData.bulbs = (k, T = 0, chase = 0) => { bulbs.forEach((b, i) => { const r = order.indexOf(i) / bulbs.length; let on = r < k; if (chase && on) on = ((i + Math.floor(T * 12)) % 3) !== 0; b.material = on ? bOn : bOff; }); };
  g.userData.draw = (st = {}) => { const rows = st.rows || [], key = JSON.stringify(st); S.draw(key, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0c1630'); gr.addColorStop(1, '#060a18'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    if (st.off) { c.fillStyle = '#05070e'; c.fillRect(0, 0, w, h); return; }
    txt(c, 'SCHAUT GERADE', w / 2, 62, 50, '#ffd23f', '#3a2400', 10); c.fillStyle = '#ffd23f'; c.fillRect(40, 104, w - 80, 6);
    const live = st.live ?? 1; c.fillStyle = '#ff2a3a'; c.beginPath(); c.arc(60, 150, 12, 0, 7); c.fill(); c.font = `700 30px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#ff6a6a'; c.fillText('LIVE', 82, 152); c.textAlign = 'right'; c.fillStyle = '#9ab0ff'; c.fillText('600 BIRNEN', w - 40, 152);
    rows.forEach((r, i) => { const y = 240 + i * 110; cross(c, 90, y, 38); if (!r.gone) { c.fillStyle = '#0c1630'; c.fillRect(48, y - 42, 84, 84); smiley(c, 90, y, 38, 'ok'); }
      c.textAlign = 'left'; c.font = `700 64px ${FONT}`; c.fillStyle = r.gone ? '#ff5a4a' : '#ffffff'; c.fillText(fmt(r.t), 160, y + 4); if (r.gone) { c.font = `700 58px ${FONT}`; c.fillText('WEG', 340, y + 4); } });
    if (st.du != null) { const y = 240 + rows.length * 110; const gold = st.gold || 0; c.fillStyle = gold ? '#3a2a00' : '#0a2a14'; c.beginPath(); c.roundRect(36, y - 52, w - 72, 104, 18); c.fill(); c.lineWidth = 6; c.strokeStyle = gold ? '#ffd23f' : '#2ad86a'; c.stroke();
      c.fillStyle = '#3aa8ff'; c.fillRect(56, y - 36, 72, 72); smiley(c, 92, y, 34, 'happy'); c.textAlign = 'left'; c.font = `700 70px ${FONT}`; c.fillStyle = gold ? '#ffd23f' : '#3aff7a'; c.fillText('DU', 160, y + 4); c.textAlign = 'right'; c.fillText(fmt(st.du), w - 60, y + 4);
      if (st.rec) { c.fillStyle = '#0c1630'; c.fillRect(30, 128, w - 60, 46); txt(c, '★ REKORD! ★', w / 2, 152, 46, '#ffd23f', '#3a2400', 8); } }
  }); };
  g.userData.draw({}); g.userData.bulbs(1); outline(g, 1.2); return g; }

// ---------- pulgar gigante (yema hacia -y): escala 1 ≈ 6 de ancho ----------
export function daumen(parent) { const g = G(parent); const sk = mat(0xf2c4a0, { roughness: .6 }), sk2 = mat(0xe8b08a, { roughness: .6 });
  const fp = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#f2c4a0'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(190,110,90,.55)'; c.lineWidth = 5; for (let r = 10; r < 130; r += 13) { c.beginPath(); c.ellipse(w / 2, h * .55, r * .8, r, 0, 0, 7); c.stroke(); } });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(3, 9, 8, 20), sk); body.position.y = 7.5; g.add(body);
  const pad = new THREE.Mesh(new THREE.SphereGeometry(3.02, 24, 16, 0, 6.283, Math.PI / 2, Math.PI / 2), mat(0xffffff, { map: fp, roughness: .7 })); pad.position.y = 3; g.add(pad);
  const nail = box(3.6, 4.2, .6, mat(0xf6d8d0, { roughness: .2 }), .5, g, 0, 4.4, 2.75); nail.rotation.x = -.08; box(3.8, .5, .7, sk2, .2, g, 0, 6.6, 2.7);
  for (let k = 0; k < 3; k++) { const w = box(5.6, .14, .2, sk2, .05, g, 0, 10.5 + k * .7, 2.95); }
  return g; }

// ---------- prismáticos (en la mano, mirando a +z) ----------
export function fernglas(parent) { const g = G(parent); const bk = mat(0x1a1a1e, { roughness: .4 }), gl = mat(0x7ab8ff, { metalness: .9, roughness: .05, emissive: 0x2a5aa8, emissiveIntensity: .6 });
  for (const s of [-1, 1]) { const t = cyl(.3, .34, 1.1, bk, 14, g, s * .38, 0, 0); t.rotation.x = Math.PI / 2; const l = cyl(.26, .26, .05, gl, 14, g, s * .38, 0, .56); l.rotation.x = Math.PI / 2; } box(.5, .2, .4, bk, .05, g, 0, 0, -.1); return g; }

// ---------- bote de pepinillos y pepinillo suelto ----------
export function gurkenglas(parent) { const g = G(parent); const glass = mat(0xd8f0e0, { roughness: .05, metalness: .1, transparent: true, opacity: .45 });
  cyl(.75, .75, 1.9, glass, 20, g, 0, .95, 0); cyl(.78, .78, .35, mat(0xd8323a, { metalness: .5, roughness: .3 }), 20, g, 0, 2.05, 0);
  const lb = textPlane(1.3, .7, 130, 70, (c, w, h) => { c.fillStyle = '#fff6d8'; c.fillRect(0, 0, w, h); txt(c, 'GURKEN', w / 2, h / 2 + 2, 30, '#2a7a2a'); }); lb.position.set(0, .9, .77); g.add(lb);
  const gm = mat(0x4a8a2a, { roughness: .6 }); for (let k = 0; k < 6; k++) { const p = new THREE.Mesh(new THREE.CapsuleGeometry(.18, .9, 4, 8), gm); p.position.set(Math.cos(k * 1.3) * .38, .9, Math.sin(k * 1.3) * .38); p.rotation.z = (k % 2 - .5) * .3; g.add(p); }
  cyl(.7, .7, 1.6, mat(0xb8d878, { transparent: true, opacity: .3, roughness: .1 }), 16, g, 0, .85, 0); return g; }
export function gurke(parent) { const p = new THREE.Mesh(new THREE.CapsuleGeometry(.2, 1, 4, 8), mat(0x4a8a2a, { roughness: .6 })); parent.add(p); return p; }

// ---------- nevera abierta (frente a +z), luz dentro ----------
export function kuehlschrank(parent) { const g = G(parent); const wh = mat(0xf4f6f8, { roughness: .25, metalness: .15 }), inn = mat(0xffffff, { emissive: 0xe8f4ff, emissiveIntensity: .7 });
  box(6, 13, .4, wh, .1, g, 0, 6.5, -2.2); for (const s of [-1, 1]) box(.4, 13, 4.6, wh, .1, g, s * 2.8, 6.5, 0); box(6, .4, 4.6, wh, .1, g, 0, 13, 0); box(6, .6, 4.6, wh, .1, g, 0, .3, 0);
  box(5.2, 12, .1, inn, 0, g, 0, 6.6, -1.95); for (const y of [3.4, 6.4, 9.4]) box(5.2, .12, 4, mat(0xd8eef8, { transparent: true, opacity: .7, roughness: .05 }), 0, g, 0, y, 0);
  const D = G(g, 3, 0, 2.3); box(.4, 13, 6, wh, .2, D, 0, 6.5, 3); for (const y of [4, 8]) box(.8, .15, 5.2, wh, .05, D, -.6, y, 3); box(.3, 3, .4, mat(0x9aa0aa, { metalness: .8 }), .1, D, .4, 8, 5.4); D.rotation.y = 1.9;
  const food = [[0xd8323a, -1.6, 3.9, .6, .8], [0xffd23f, 0, 3.9, .7, .5], [0xffffff, 1.6, 4.2, .5, 1.2], [0xff8a3a, -1, 6.9, .6, .6], [0x8ad84a, 1.2, 6.9, .8, .6], [0xf4b0c0, 0, 9.9, 1.2, .6]];
  for (const [c, x, y, r, h] of food) cyl(r, r, h, mat(c, { roughness: .5 }), 14, g, x, y + h / 2 - .4, -.2);
  const L = new THREE.PointLight(0xe8f4ff, 60, 22, 1.5); L.position.set(0, 8, 2); g.add(L); g.userData.L = L; g.userData.door = D; outline(g, 1); return g; }

// ---------- calendario de pared con días tachados ----------
export function kalender(parent, n = 21) { const g = G(parent); const p = textPlane(6, 7, 360, 420, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 80); txt(c, 'NOVEMBER', w / 2, 42, 46, '#fff');
  for (let i = 0; i < 28; i++) { const x = 30 + (i % 7) * 43, y = 110 + Math.floor(i / 7) * 74; c.strokeStyle = '#c8c8c8'; c.lineWidth = 2; c.strokeRect(x, y, 41, 70); c.font = `700 22px ${FONT}`; c.fillStyle = '#3a3a3a'; c.textAlign = 'left'; c.fillText(String(i + 1), x + 4, y + 18);
    if (i < n) { c.strokeStyle = '#e8202a'; c.lineWidth = 6; c.beginPath(); c.moveTo(x + 6, y + 14); c.lineTo(x + 36, y + 62); c.moveTo(x + 36, y + 14); c.lineTo(x + 6, y + 62); c.stroke(); } } }); g.add(p); return g; }

// ---------- móvil gigante (pantalla 9 × 16), mira a +z; draw(k) con el «swipe» ----------
// st = {swipe: 0..3 (hacia arriba, valor fraccional), back: 0..1, kind}
const VIDS = [['IN DIESER STADT…', '#7ac8ff', '#5cc24a'], ['KATZE TANZT', '#ffb0d0', '#a85ad8'], ['REZEPT: NUDELN', '#ffe08a', '#d8823a'], ['AUTO-UNFALL?!', '#a8b0c0', '#3a4250']];
function drawVid(c, w, h, i, y0) { const [t, a, b] = VIDS[i % VIDS.length]; c.save(); c.translate(0, y0); const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, a); gr.addColorStop(1, b); c.fillStyle = gr; c.fillRect(0, 0, w, h);
  if (i === 0) { for (let k = 0; k < 5; k++) { const x = 20 + k * w / 5, hh = 120 + (k % 3) * 40; c.fillStyle = ['#f4e0b8', '#ffb8a0', '#d8e8ff', '#ffe08a', '#c8f0c8'][k]; c.fillRect(x, h * .62 - hh, w / 5 - 12, hh); c.fillStyle = '#c8402a'; c.beginPath(); c.moveTo(x - 6, h * .62 - hh); c.lineTo(x + w / 10 - 6, h * .62 - hh - 50); c.lineTo(x + w / 5 - 6, h * .62 - hh); c.fill(); }
    for (let k = 0; k < 7; k++) { const x = 40 + k * (w - 80) / 6; c.fillStyle = ['#ffd23f', '#3aa8ff', '#ff5a85', '#8ad84a'][k % 4]; c.fillRect(x - 14, h * .66, 28, 46); c.fillStyle = '#f2c4a0'; c.fillRect(x - 12, h * .66 - 26, 24, 24); } }
  else { c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.arc(w / 2, h * .48, w * .26, 0, 7); c.fill(); }
  txt(c, t, w / 2, 70, 40, '#ffffff', '#000', 8); c.restore(); }
export function riesenHandy(parent) { const g = G(parent); const fr = mat(0x14141a, { metalness: .6, roughness: .25 }); box(10.4, 18.4, .8, fr, 1.0, g, 0, 9.2 + 1, 0); box(2.4, 2, 2, mat(0x2a2a30), .2, g, 0, 1, -.2);
  const S = scr(360, 640); const m = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 16.8), scrMat(S.t)); m.position.set(0, 10.2, .42); g.add(m); g.userData.scr = m;
  g.userData.draw = (st = {}) => { const sw = Math.round((st.swipe || 0) * 40) / 40, bk = Math.round((st.back || 0) * 40) / 40; S.draw(sw + '|' + bk, (c, w, h) => {
    const n = Math.floor(sw), f = sw - n; let pos = n + f; if (bk) pos = pos * (1 - bk); const i0 = Math.floor(pos), ff = pos - i0;
    drawVid(c, w, h, i0, -ff * h); drawVid(c, w, h, i0 + 1, (1 - ff) * h);
    for (let i = 0; i < 3; i++) { const y = h * (.6 + i * .1); c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(w * .9, y, 16, 0, 7); c.fill(); c.fillStyle = ['#ff3a5a', '#3a3a3a', '#3a3a3a'][i]; c.beginPath(); c.arc(w * .9, y, 8, 0, 7); c.fill(); } }); };
  g.userData.draw({}); outline(g, 1.2); return g; }

// ---------- sofá dorado con placa «DU», alfombra roja, cordones y la tela que lo tapa ----------
export function sofa(parent) { const g = G(parent); const gm = mat(0xf2c23a, { metalness: .85, roughness: .22, emissive: 0x5a3a00, emissiveIntensity: .3 }), red = mat(0xc8203a, { roughness: .6 });
  box(9, 1.6, 4, gm, .5, g, 0, 1.6, 0); box(9, 4.6, 1.2, gm, .5, g, 0, 4.4, -1.6); for (const s of [-1, 1]) { box(1.2, 3.2, 4, gm, .5, g, s * 4.6, 3, 0); for (const z of [-1.4, 1.4]) cyl(.3, .2, .9, gm, 10, g, s * 4, .45, z); }
  for (const s of [-1, 1]) { box(3.8, .9, 3, red, .4, g, s * 2, 2.7, .3); box(3.8, 3, .7, red, .35, g, s * 2, 4.4, -.85); }
  const crown = cyl(1.2, 1.4, .8, gm, 6, g, 0, 7.1, -1.6); for (let k = 0; k < 5; k++) sphere(.22, glowM(0xff4a6a, 1.6), g, -1 + k * .5, 7.6, -1.5 + (k % 2) * .2, 8, 6);
  const pl = textPlane(4, 1.6, 300, 120, (c, w, h) => { c.fillStyle = '#d8323a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 18); c.fill(); c.lineWidth = 8; c.strokeStyle = '#ffd23f'; c.stroke(); txt(c, 'DU', w / 2, h / 2 + 4, 84, '#ffffff', '#5a0010', 10); }); pl.position.set(0, 6.9, -.9); g.add(pl);
  const carpet = box(7, .12, 22, mat(0xc8203a, { roughness: .9 }), .05, g, 0, .08, 12); for (const s of [-1, 1]) for (let k = 0; k < 4; k++) { cyl(.25, .35, 3, gm, 10, g, s * 4.6, 1.5, 4 + k * 5.5); sphere(.4, gm, g, s * 4.6, 3.1, 4 + k * 5.5, 10, 8); if (k < 3) { const r = new THREE.Mesh(new THREE.TorusGeometry(2.75, .12, 6, 16, Math.PI), red); r.position.set(s * 4.6, 2.9, 6.75 + k * 5.5); r.rotation.set(Math.PI, Math.PI / 2, 0); g.add(r); } }
  const cover = G(g); const cv = new THREE.Mesh(new THREE.SphereGeometry(6, 20, 12, 0, 6.283, 0, Math.PI / 2), mat(0x8a1a2a, { roughness: .8 })); cv.scale.set(1, 1.35, .75); cover.add(cv); const q = textPlane(4, 4, 160, 160, (c, w, h) => txt(c, '?', w / 2, h / 2 + 6, 150, '#ffd23f', '#3a2400', 12)); q.position.set(0, 4.2, 4.6); cover.add(q); g.userData.cover = cover;
  outline(g, 1.2); return g; }

// ---------- martillo ----------
export function hammer(parent) { const g = G(parent); box(.25, 1.8, .25, mat(0xb07a45), .05, g, 0, 0, 0); box(.9, .4, .4, mat(0x6a6e78, { metalness: .8, roughness: .3 }), .05, g, 0, .9, 0); return g; }

// ---------- interior del bus 42 (X): pasillo a lo largo de z, asientos azules, barras amarillas, ventanas con la calle pasando ----------
export function busInnen(scene, X) { const g = G(scene, X, 0, 0); const wall = mat(0xe8ecf0, { roughness: .6 }), seat = mat(0x2a5ab8, { roughness: .7 }), yel = mat(0xffd23f, { metalness: .4, roughness: .3 });
  box(10, .4, 40, mat(0x5a6070, { roughness: .9 }), 0, g, 0, -.2, 0); box(10, .3, 40, mat(0xf4f4f4), 0, g, 0, 10, 0); box(10, 10, .3, wall, 0, g, 0, 5, -20);
  const outC = scr(1024, 256); const outT = outC.t; outT.wrapS = THREE.RepeatWrapping; outC.draw('x', (c, w, h) => { c.fillStyle = '#8fd0ff'; c.fillRect(0, 0, w, h); const r = RNG(5); for (let i = 0; i < 18; i++) { const x = i * 60 - 10, hh = 120 + r() * 90; c.fillStyle = ['#f4e0b8', '#ffb8a0', '#d8e8ff', '#ffe08a', '#c8f0c8', '#f0c8e0'][i % 6]; c.fillRect(x, h - hh, 56, hh); c.fillStyle = '#c8402a'; c.beginPath(); c.moveTo(x - 4, h - hh); c.lineTo(x + 28, h - hh - 34); c.lineTo(x + 60, h - hh); c.fill(); c.fillStyle = '#5a7ab8'; for (let k = 0; k < 2; k++) c.fillRect(x + 10 + k * 22, h - hh + 24, 14, 18); } c.fillStyle = '#4cb63e'; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(i * 90 + 40, h - 20, 34, 0, 7); c.fill(); } });
  const outM = new THREE.MeshBasicMaterial({ map: outT, toneMapped: false }); const views = [];
  for (const s of [-1, 1]) { box(.3, 3.4, 40, wall, 0, g, s * 5, 1.7, 0); box(.3, 2.2, 40, wall, 0, g, s * 5, 8.9, 0); for (let k = 0; k < 6; k++) box(.4, 4.6, .6, wall, .05, g, s * 4.95, 5.7, -18 + k * 7.2);
    const v = new THREE.Mesh(new THREE.PlaneGeometry(40, 4.6), outM); v.position.set(s * 6.5, 5.7, 0); v.rotation.y = -s * Math.PI / 2; g.add(v); views.push(v); }
  for (let k = 0; k < 5; k++) for (const s of [-1, 1]) { const z = -14 + k * 6.4, x = s * 2.9; const S = G(g, x, 0, z); box(3.6, .6, 2.6, seat, .2, S, 0, 2.4, 0); box(3.6, 3.2, .6, seat, .2, S, 0, 4.1, -1.2); box(.4, 2.1, .4, mat(0x6a6e78, { metalness: .7 }), .05, S, 0, 1.05, 0); box(3.8, .4, .7, yel, .15, S, 0, 5.8, -1.2); }
  for (let k = 0; k < 6; k++) cyl(.14, .14, 10, yel, 8, g, k % 2 ? 1 : -1, 5, -16 + k * 6.4);
  const sg = textPlane(4, 1, 400, 100, (c, w, h) => { c.fillStyle = '#111'; c.fillRect(0, 0, w, h); txt(c, '42  MARKTPLATZ', w / 2, h / 2 + 2, 56, '#ffb21a'); }, 1.5); sg.position.set(0, 8.8, -19.8); g.add(sg);
  for (let k = 0; k < 4; k++) box(1.4, .15, 3, glowM(0xfff8e8, 1.4), 0, g, 0, 9.8, -15 + k * 9);
  const L = new THREE.PointLight(0xfff4e0, 120, 60, 1.4); L.position.set(0, 9, 0); g.add(L);
  g.userData.scroll = T => { outT.offset.x = (T * .12) % 1; }; outline(g, 1); return { g, outT }; }
