// Tierwurf — los «Tiere» (brainrots de bloques, estilo juego de bloques): cada uno con su textura, cara dibujada,
// articulaciones (cadera/rodilla, hombro/codo) y pose(T, o) para andar, botar, saludar o dormir. Pies en y = 0, mirando a +z.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG, clamp, lerp } from './engine.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = () => new THREE.Group();
const add = (p, o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); p.add(o); return o; };
// cara de dibujo animado en un plano (ojos grandes con brillo, cejas, boca)
const FACE = new Map();
function faceTex(kind, st = {}) { const k = kind + JSON.stringify(st); if (FACE.has(k)) return FACE.get(k);
  const t = canvasTex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); const e = st.eyes ?? 'open', m = st.mouth ?? 'smile', ec = st.eye ?? '#1a1208', ew = st.ew ?? 34, ey = st.ey ?? 100, ex = st.ex ?? 58;
    for (const s of [-1, 1]) { const x = w / 2 + s * ex; c.lineCap = 'round';
      if (e === 'closed' || e === 'sleep') { c.strokeStyle = ec; c.lineWidth = 9; c.beginPath(); c.arc(x, ey - 6, ew * .7, .3, Math.PI - .3); c.stroke(); }
      else if (e === 'happy') { c.strokeStyle = ec; c.lineWidth = 10; c.beginPath(); c.arc(x, ey + 10, ew * .7, Math.PI + .3, -.3); c.stroke(); }
      else if (e !== 'none') { c.fillStyle = '#ffffff'; c.strokeStyle = '#1a1208'; c.lineWidth = 6; c.beginPath(); c.ellipse(x, ey, ew, ew * (e === 'wide' ? 1.25 : 1.1), 0, 0, 7); c.fill(); c.stroke();
        const px = x + (st.look ?? 0) * ew * .35; c.fillStyle = st.iris ?? ec; c.beginPath(); c.arc(px, ey + 4, ew * (e === 'wide' ? .38 : .52), 0, 7); c.fill(); c.fillStyle = '#000'; c.beginPath(); c.arc(px, ey + 4, ew * .26, 0, 7); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(px - ew * .22, ey - ew * .2, ew * .17, 0, 7); c.fill(); c.beginPath(); c.arc(px + ew * .2, ey + ew * .25, ew * .08, 0, 7); c.fill();
        if (e === 'angry' || e === 'half') { c.fillStyle = st.lid ?? '#2a1a10'; c.beginPath(); c.moveTo(x - ew * 1.2, ey - ew * 1.3); c.lineTo(x + ew * 1.2, ey - ew * 1.3); c.lineTo(x + ew * 1.2, e === 'half' ? ey - ew * .1 : ey - (s > 0 ? ew * .9 : -ew * .1) * 1); c.lineTo(x - ew * 1.2, e === 'half' ? ey - ew * .1 : ey - (s > 0 ? -ew * .1 : ew * .9)); c.closePath(); c.fill(); } }
      if (st.brow !== false && e !== 'none') { c.strokeStyle = st.browC ?? '#1a1208'; c.lineWidth = 10; c.beginPath(); const b = e === 'angry' ? s * 14 : e === 'wide' ? -10 : 0; c.moveTo(x - ew, ey - ew * 1.45 - b); c.lineTo(x + ew, ey - ew * 1.45 + b); c.stroke(); } }
    const my = st.my ?? 180; c.lineCap = 'round';
    if (m === 'smile') { c.strokeStyle = '#2a0a06'; c.lineWidth = 9; c.beginPath(); c.arc(w / 2, my - 30, 40, .35, Math.PI - .35); c.stroke(); }
    else if (m === 'grin' || m === 'open') { c.fillStyle = '#5a0e10'; c.beginPath(); c.ellipse(w / 2, my, m === 'open' ? 30 : 46, m === 'open' ? 34 : 24, 0, 0, Math.PI * (m === 'open' ? 2 : 1)); if (m === 'grin') c.lineTo(w / 2 - 46, my); c.fill(); if (m === 'grin') { c.fillStyle = '#fff'; c.fillRect(w / 2 - 38, my, 76, 9); } c.fillStyle = '#e8506a'; c.beginPath(); c.ellipse(w / 2, my + (m === 'open' ? 18 : 14), 16, 8, 0, 0, 7); c.fill(); }
    else if (m === 'flat') { c.strokeStyle = '#2a0a06'; c.lineWidth = 9; c.beginPath(); c.moveTo(w / 2 - 26, my); c.lineTo(w / 2 + 26, my); c.stroke(); }
    else if (m === 'teeth') { c.fillStyle = '#4a0a0a'; c.beginPath(); c.roundRect(w / 2 - 62, my - 22, 124, 44, 18); c.fill(); c.fillStyle = '#fff'; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(w / 2 - 56 + i * 16, my - 22); c.lineTo(w / 2 - 48 + i * 16, my - 6); c.lineTo(w / 2 - 40 + i * 16, my - 22); c.fill(); c.beginPath(); c.moveTo(w / 2 - 56 + i * 16, my + 22); c.lineTo(w / 2 - 48 + i * 16, my + 6); c.lineTo(w / 2 - 40 + i * 16, my + 22); c.fill(); } }
    if (st.blush) { c.fillStyle = 'rgba(255,90,110,.35)'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(w / 2 + s * 92, my - 30, 22, 13, 0, 0, 7); c.fill(); } } });
  FACE.set(k, t); return t; }
function facePlane(w, h, kind, st) { const m = new THREE.MeshStandardMaterial({ map: faceTex(kind, st), transparent: true, roughness: .5, polygonOffset: true, polygonOffsetFactor: -2, depthWrite: false });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.userData.kind = kind; p.userData.base = st; p.renderOrder = 2;
  p.userData.set = (o = {}) => { const t = faceTex(kind, { ...st, ...o }); if (m.map !== t) { m.map = t; m.needsUpdate = true; } }; return p; }
// pierna articulada: cadera (grupo) -> rodilla (grupo) -> pie
function legJ(par, x, y, len, r, m, foot) { const hp = add(par, G(), x, y, 0); const u = cyl(r, r * .9, len / 2, m, 10, hp, 0, -len / 4, 0); const kn = add(hp, G(), 0, -len / 2, 0); cyl(r * .9, r * .8, len / 2, m, 10, kn, 0, -len / 4, 0); if (foot) foot(kn, -len / 2); return { hp, kn }; }
function armJ(par, x, y, len, r, m, hand) { const sh = add(par, G(), x, y, 0); cyl(r, r * .9, len / 2, m, 10, sh, 0, -len / 4, 0); const el = add(sh, G(), 0, -len / 2, 0); cyl(r * .9, r * .85, len / 2, m, 10, el, 0, -len / 4, 0); const hd = add(el, G(), 0, -len / 2, 0); if (hand) hand(hd); return { sh, el, hd }; }
// ciclo de paso genérico para piernas {hp, kn}
function stepLegs(legs, ph, amp = .5) { legs.forEach((L, i) => { const s = Math.sin(ph + i * Math.PI); L.hp.rotation.x = s * amp; L.kn.rotation.x = Math.max(0, -Math.cos(ph + i * Math.PI)) * amp * 1.4; }); }
const glossy = (c, o = {}) => mat(c, { roughness: .35, ...o });
export const GOLD = () => new THREE.MeshStandardMaterial({ color: 0xffcc3a, metalness: .55, roughness: .25, emissive: 0x9a6a00, emissiveIntensity: .55 });

// ---------------- texturas ----------------
const woodT = () => canvasTex(128, 256, (c, w, h) => { c.fillStyle = '#c8945a'; c.fillRect(0, 0, w, h); const r = RNG(4); for (let i = 0; i < 26; i++) { c.strokeStyle = `rgba(110,60,25,${.25 + r() * .3})`; c.lineWidth = 1 + r() * 3; c.beginPath(); const x = r() * w; c.moveTo(x, 0); for (let y = 0; y < h; y += 16) c.lineTo(x + Math.sin(y * .05 + i) * 4, y); c.stroke(); }
  for (let i = 0; i < 3; i++) { c.strokeStyle = 'rgba(90,45,15,.6)'; c.lineWidth = 3; c.beginPath(); c.ellipse(r() * w, r() * h, 6, 12, 0, 0, 7); c.stroke(); } }, true);
const pizzaT = () => canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#ffcf4a'; c.fillRect(0, 0, w, h); const r = RNG(8); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,${150 + r() * 60},40,.5)`; c.beginPath(); c.ellipse(r() * w, r() * h, 10 + r() * 16, 6 + r() * 8, r() * 3, 0, 7); c.fill(); }
  for (let i = 0; i < 7; i++) { const x = 30 + r() * 196, y = 30 + r() * 196; c.fillStyle = '#c8282a'; c.beginPath(); c.arc(x, y, 20, 0, 7); c.fill(); c.fillStyle = 'rgba(120,10,10,.5)'; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + (r() - .5) * 26, y + (r() - .5) * 26, 3, 0, 7); c.fill(); } }
  for (let i = 0; i < 18; i++) { c.fillStyle = '#3a8a2a'; c.fillRect(r() * w, r() * h, 8, 4); } });
const cactusT = () => canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#4aa83a'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { c.fillStyle = 'rgba(20,80,20,.45)'; c.fillRect(x, 0, 4, h); c.fillStyle = 'rgba(160,230,120,.35)'; c.fillRect(x + 8, 0, 3, h); } c.fillStyle = '#fff6c8'; for (let x = 6; x < w; x += 16) for (let y = 8; y < h; y += 18) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y - 5); c.lineTo(x + 2, y + 2); c.fill(); } }, true);
const strawT = (gold) => canvasTex(256, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, gold ? '#ffe27a' : '#ff4a5a'); g.addColorStop(1, gold ? '#e0a020' : '#d8142e'); c.fillStyle = g; c.fillRect(0, 0, w, h); const r = RNG(6);
  for (let y = 10; y < h; y += 22) for (let x = (y / 22 % 2) * 11 + 6; x < w; x += 22) { c.fillStyle = gold ? '#fff4c0' : '#ffe680'; c.beginPath(); c.ellipse(x + (r() - .5) * 3, y, 3.2, 5, 0, 0, 7); c.fill(); c.fillStyle = gold ? 'rgba(160,100,0,.35)' : 'rgba(120,0,20,.35)'; c.beginPath(); c.arc(x, y + 4, 4, 0, Math.PI); c.fill(); } }, true);
const sharkT = () => canvasTex(128, 128, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3a7ad8'); g.addColorStop(.55, '#5aa0f0'); g.addColorStop(.6, '#f4f8ff'); g.addColorStop(1, '#ffffff'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
const fridgeT = () => canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#f2f6fa'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(160,180,200,.3)'; for (let i = 0; i < 6; i++) c.fillRect(0, i * 22 + 4, w, 2); });
const furT = (a, b) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(3); for (let i = 0; i < 600; i++) { c.strokeStyle = r() < .6 ? b : 'rgba(255,240,220,.18)'; c.lineWidth = 1.5; const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - .5) * 3, y + 4 + r() * 5); c.stroke(); } }, true);
const bananaT = () => canvasTex(128, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#e8c21a'); g.addColorStop(.5, '#ffe44a'); g.addColorStop(1, '#e0b414'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(120,80,10,.5)'; const r = RNG(2); for (let i = 0; i < 16; i++) { c.beginPath(); c.arc(r() * w, r() * h, 2 + r() * 4, 0, 7); c.fill(); } c.fillStyle = 'rgba(160,140,20,.4)'; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 3, h); });
const coffeeT = () => canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#7a4a26'; c.fillRect(0, 0, w, h); const g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); g.addColorStop(0, '#f4e2c4'); g.addColorStop(.55, '#e8c89a'); g.addColorStop(.8, '#a8703e'); g.addColorStop(1, '#7a4a26'); c.fillStyle = g; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, 7); c.fill();
  c.fillStyle = '#7a4a26'; c.beginPath(); c.moveTo(w / 2, h * .72); c.bezierCurveTo(w * .2, h * .5, w * .32, h * .25, w / 2, h * .38); c.bezierCurveTo(w * .68, h * .25, w * .8, h * .5, w / 2, h * .72); c.fill(); c.fillStyle = '#f4e2c4'; c.beginPath(); c.moveTo(w / 2, h * .64); c.bezierCurveTo(w * .3, h * .48, w * .38, h * .33, w / 2, h * .44); c.bezierCurveTo(w * .62, h * .33, w * .7, h * .48, w / 2, h * .64); c.fill(); });

// =====================================================================================================
// Noobini Pizzanini (el más pobre): porción de pizza con cabeza de bloque amarilla, brazos amarillos y piernas verdes
// =====================================================================================================
export function noobini(scene) { const root = G(); scene.add(root); const body = add(root, G(), 0, 1.2, 0);
  const sh = new THREE.Shape(); sh.moveTo(-1.15, .95); sh.lineTo(1.15, .95); sh.lineTo(0, -1.25); sh.closePath();
  const sl = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .5, bevelEnabled: true, bevelSize: .08, bevelThickness: .08, bevelSegments: 2 }), [mat(0xffffff, { map: pizzaT(), roughness: .6 }), mat(0xf0b030, { roughness: .7 })]); sl.position.set(0, .9, -.25); sl.castShadow = true; body.add(sl);
  const crust = cyl(.3, .3, 2.5, mat(0xd08a3a, { roughness: .8 }), 14, body, 0, 1.92, 0); crust.rotation.z = Math.PI / 2; crust.scale.set(1, 1, 1.15);
  for (let i = 0; i < 4; i++) { const ch = sphere(.16, mat(0xffd84a, { roughness: .4 }), body, -.7 + i * .45, .2 - (i % 2) * .5, .38, 8, 6); ch.scale.set(1, 1.6, .6); }   // queso que gotea
  const head = add(body, G(), 0, 2.15, 0); box(1.25, 1.2, 1.15, glossy(0xf6d82a), .16, head, 0, .62, 0); const fc = facePlane(1.05, 1.05, 'noob', { eyes: 'open', mouth: 'smile', ew: 26, ex: 52, ey: 104, brow: false, blush: 1 }); fc.position.set(0, .62, .585); head.add(fc);
  const yel = glossy(0xf6d82a), blu = glossy(0x2a6ad8), grn = mat(0x3aa83a, { roughness: .6 });
  const arms = [-1, 1].map(s => { const a = armJ(body, s * 1.15, 1.75, 1.3, .2, yel, h => box(.34, .3, .34, yel, .1, h, 0, -.1, 0)); return a; });
  const legs = [-1, 1].map(s => legJ(root, s * .32, 1.2, 1.2, .22, grn, (k, y) => box(.5, .26, .7, mat(0x2a3a8a), .1, k, 0, y - .05, .12)));
  box(.9, .3, .55, blu, .1, body, 0, -.35, 0);   // calzón azul de bloque
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const B = { root, body, head, face: fc, arms, legs, kind: 'noobini', H: 4.1 };
  B.pose = (T, o = {}) => { const w = o.walk ?? 0, ph = T * 9 * (o.speed ?? 1); stepLegs(legs, ph, w * .7); body.position.y = 1.2 + Math.abs(Math.sin(ph)) * .12 * w + Math.sin(T * 3) * .03 * (1 - w); body.rotation.z = Math.sin(ph) * .08 * w;
    arms.forEach((a, i) => { const s = i ? 1 : -1; a.sh.rotation.set(-Math.sin(ph + i * Math.PI) * .6 * w - (o.wave && i ? 2.6 : 0) - (o.up ? 2.6 : 0), 0, s * (.25 + (o.wave && i ? Math.sin(T * 10) * .3 : 0))); a.el.rotation.x = -.3 - (o.hug ? 1.2 : 0); });
    head.rotation.set(o.headX ?? 0, (o.headY ?? 0) + Math.sin(T * 1.3) * .08, Math.sin(T * 2) * .05); fc.userData.set(o.face || {}); };
  return B; }

// =====================================================================================================
// Tung Tung Tung Sahur: tronco de madera con cara, brazos y piernas finos, bate de béisbol
// =====================================================================================================
export function tung(scene) { const root = G(); scene.add(root); const body = add(root, G(), 0, 2.3, 0); const wood = mat(0xffffff, { map: rep(woodT(), 2, 1), roughness: .75 });
  const trunk = cyl(1.0, 1.05, 4.0, wood, 20, body, 0, 2.0, 0); const cap = sphere(1.0, wood, body, 0, 4.0, 0, 20, 10); cap.scale.y = .45; const bot = sphere(1.05, wood, body, 0, 0, 0, 20, 10); bot.scale.y = .3;
  const ring = cyl(1.03, 1.03, .1, mat(0xa06a38), 20, body, 0, 3.6, 0);
  const fc = facePlane(1.7, 1.7, 'tung', { eyes: 'wide', mouth: 'open', ew: 40, ex: 60, ey: 96, my: 186 }); fc.position.set(0, 2.85, 1.0); body.add(fc);
  const nose = box(.25, .45, .25, wood, .08, body, 0, 2.75, 1.05);
  const limb = mat(0xb07a44, { roughness: .7 });
  const arms = [-1, 1].map(s => armJ(body, s * 1.05, 2.6, 2.4, .16, limb, h => sphere(.24, limb, h, 0, -.1, 0, 10, 8)));
  const bat = G(); arms[1].hd.add(bat); bat.position.set(0, -.15, 0); const bm = mat(0x8a5a2a, { roughness: .45 }); cyl(.13, .26, 3.0, bm, 12, bat, 0, -1.4, .0).rotation.x = 0; cyl(.16, .16, .2, mat(0x2a1a10), 10, bat, 0, .1, 0); bat.rotation.x = Math.PI / 2 + .3; bat.rotation.z = 0;
  const legs = [-1, 1].map(s => legJ(root, s * .45, 2.3, 2.3, .17, limb, (k, y) => box(.45, .25, .7, limb, .1, k, 0, y - .05, .15)));
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const B = { root, body, face: fc, arms, legs, bat, kind: 'tung', H: 7.1 };
  B.pose = (T, o = {}) => { const w = o.walk ?? 0, ph = T * 7 * (o.speed ?? 1); stepLegs(legs, ph, w * .6); body.position.y = 2.3 + Math.abs(Math.sin(ph)) * .15 * w; body.rotation.z = Math.sin(ph) * .05 * w + Math.sin(T * 1.4) * .02;
    const bonk = o.bonk != null ? Math.max(0, Math.sin(o.bonk * Math.PI * 2)) : 0;
    arms[0].sh.rotation.set(-Math.sin(ph) * .5 * w - (o.cheer ? 2.5 : 0), 0, -.25); arms[0].el.rotation.x = -.4;
    arms[1].sh.rotation.set(-1.2 - bonk * 1.6 + (o.bonk != null ? 1.2 : 0) * 0, 0, .3); arms[1].el.rotation.x = -.9 - bonk * .6;
    fc.userData.set(o.face || {}); };
  return B; }

// =====================================================================================================
// Cappuccino Assassino: taza de capuchino con espuma (corazón), cara de ninja con banda, dos katanas
// =====================================================================================================
export function cappuccino(scene) { const root = G(); scene.add(root); const body = add(root, G(), 0, 2.0, 0); const cer = glossy(0xf8f6f2, { roughness: .2 });
  const cup = cyl(1.45, 1.05, 2.6, cer, 28, body, 0, 1.3, 0); const rim = new THREE.Mesh(new THREE.TorusGeometry(1.45, .1, 8, 32), cer); rim.rotation.x = Math.PI / 2; rim.position.y = 2.6; body.add(rim);
  const top = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), mat(0xffffff, { map: coffeeT(), roughness: .6 })); top.rotation.x = -Math.PI / 2; top.position.y = 2.5; body.add(top);
  const foam = sphere(1.1, mat(0xf4e2c4, { roughness: .9 }), body, 0, 2.55, 0, 16, 8); foam.scale.y = .25;
  const hdl = new THREE.Mesh(new THREE.TorusGeometry(.55, .16, 8, 16, Math.PI * 1.2), cer); hdl.rotation.z = -Math.PI * .6; hdl.position.set(1.45, 1.4, 0); body.add(hdl);
  const band = cyl(1.36, 1.3, .7, mat(0x1a1a24, { roughness: .6 }), 28, body, 0, 1.75, 0);
  const fc = facePlane(1.6, 1.6, 'capp', { eyes: 'angry', mouth: 'none', ew: 30, ex: 50, ey: 98, browC: '#ffffff', iris: '#c81a1a', lid: '#1a1a24' }); fc.position.set(0, 1.62, 1.38); body.add(fc);
  for (const s of [-1, 1]) { const tl = box(.18, .8, .1, mat(0xd81a2a), .04, body, s * .25, 1.5, -1.38); tl.rotation.z = s * .4; }
  const mouthM = facePlane(.9, .9, 'cmouth', { eyes: 'none', mouth: 'flat', brow: false, my: 128 }); mouthM.position.set(0, .8, 1.25); mouthM.rotation.x = -.15; body.add(mouthM);
  const ninja = mat(0x1a1a24, { roughness: .7 });
  const kat = () => { const k = G(); box(.12, 3.0, .04, mat(0xe8eef4, { metalness: .9, roughness: .15 }), .02, k, 0, 1.75, 0); box(.5, .1, .3, mat(0xd8a830, { metalness: .7 }), .03, k, 0, .22, 0); cyl(.09, .09, .55, mat(0x8a1a1a), 8, k, 0, -.1, 0); return k; };
  const arms = [-1, 1].map(s => armJ(body, s * 1.35, 1.9, 2.0, .2, ninja, h => { sphere(.25, ninja, h, 0, -.08, 0, 10, 8); const k = kat(); h.add(k); k.position.set(0, -.15, .05); k.rotation.x = 1.25; }));
  const legs = [-1, 1].map(s => legJ(root, s * .5, 2.0, 2.0, .2, ninja, (k, y) => box(.48, .24, .7, ninja, .1, k, 0, y - .05, .14)));
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const B = { root, body, face: fc, arms, legs, kind: 'capp', H: 4.8 };
  B.pose = (T, o = {}) => { const w = o.walk ?? 0, ph = T * 8 * (o.speed ?? 1); stepLegs(legs, ph, w * .65); body.position.y = 2.0 + Math.abs(Math.sin(ph)) * .14 * w + (o.crouch ? -.5 : 0); body.rotation.z = Math.sin(ph) * .05 * w;
    const st = o.stance ?? 0; arms.forEach((a, i) => { const s = i ? 1 : -1; a.sh.rotation.set(-Math.sin(ph + i * Math.PI) * .5 * w - st * (1.3 + i * .5), 0, s * (.3 + st * .4)); a.el.rotation.x = -.3 - st * .8; });
    fc.userData.set(o.face || {}); };
  return B; }

// =====================================================================================================
// Chimpanzini Bananini: chimpancé metido en un plátano pelado (cáscara abierta en tres tiras)
// =====================================================================================================
export function chimp(scene) { const root = G(); scene.add(root); const body = add(root, G(), 0, 1.7, 0); const ban = mat(0xffffff, { map: bananaT(), roughness: .55 }), fur = mat(0xffffff, { map: rep(furT('#5a3420', 'rgba(30,15,5,.6)'), 2, 2), roughness: .95 }), skin = mat(0xd8a47a, { roughness: .6 });
  const peel = cyl(1.25, .8, 2.6, ban, 18, body, 0, 1.0, 0); const tip = cyl(.8, .25, .7, ban, 14, body, 0, -.6, 0); cyl(.22, .2, .3, mat(0x4a3a1a), 8, body, 0, -1.05, 0);
  const strips = []; for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2 + .5, s = add(body, G(), Math.sin(a) * 1.0, 2.3, Math.cos(a) * 1.0); s.rotation.y = a; const p = box(1.1, 1.8, .16, ban, .08, s, 0, -.9, 0); s.rotation.x = 2.5; strips.push(s); }
  const torso = sphere(1.05, fur, body, 0, 2.6, 0, 16, 12); torso.scale.set(1, 1.05, .9);
  const head = add(body, G(), 0, 3.7, .05); const hd = sphere(.95, fur, head, 0, 0, 0, 18, 14); hd.scale.set(1.05, 1, .95); const mz = sphere(.62, skin, head, 0, -.25, .55, 14, 10); mz.scale.set(1.15, .85, .7); const fp = sphere(.55, skin, head, 0, .2, .52, 12, 10); fp.scale.set(1.3, .7, .5);
  for (const s of [-1, 1]) { const e = sphere(.34, skin, head, s * 1.0, .1, 0, 10, 8); e.scale.set(.5, 1, 1); }
  const fc = facePlane(1.2, 1.2, 'chimp', { eyes: 'open', mouth: 'grin', ew: 24, ex: 44, ey: 92, my: 190, browC: '#2a1608' }); fc.position.set(0, -.05, .92); head.add(fc);
  const arms = [-1, 1].map(s => armJ(body, s * 1.0, 2.9, 2.2, .24, fur, h => sphere(.3, skin, h, 0, -.1, 0, 10, 8)));
  const legs = [-1, 1].map(s => legJ(root, s * .45, 1.7, 1.6, .24, fur, (k, y) => { const f = box(.55, .25, .85, skin, .12, k, 0, y - .05, .2); }));
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const B = { root, body, head, face: fc, arms, legs, strips, kind: 'chimp', H: 6.3 };
  B.pose = (T, o = {}) => { const w = o.walk ?? 0, ph = T * 8 * (o.speed ?? 1); stepLegs(legs, ph, w * .6); body.position.y = 1.7 + Math.abs(Math.sin(ph)) * .15 * w + Math.abs(Math.sin(T * 6)) * .2 * (o.hop ?? 0);
    strips.forEach((s, k) => { s.rotation.x = 2.5 + Math.sin(T * 3 + k) * .08; });
    arms.forEach((a, i) => { const s = i ? 1 : -1; const beat = o.beat ? Math.sin(T * 14 + i * Math.PI) * .4 : 0; a.sh.rotation.set(-Math.sin(ph + i * Math.PI) * .5 * w - (o.cheer ? 2.7 : 0) - (o.beat ? 1.4 : 0) + beat, 0, s * (.35 + (o.beat ? -.5 : 0))); a.el.rotation.x = -.4 - (o.beat ? 1.2 : 0); });
    head.rotation.set(o.headX ?? 0, (o.headY ?? 0) + Math.sin(T * 1.6) * .1, Math.sin(T * 2.2) * .06); fc.userData.set(o.face || {}); };
  return B; }

// =====================================================================================================
// Lirilì Larilà: cabeza de elefante gris sobre cuerpo de cactus con brazos de cactus y sandalias
// =====================================================================================================
export function lirili(scene, o0 = {}) { const root = G(); scene.add(root); const body = add(root, G(), 0, 1.3, 0); const cac = mat(0xffffff, { map: rep(cactusT(), 2, 1), roughness: .7 }), grey = mat(0x9aa0aa, { roughness: .65 }), sand = mat(0x8a5a2a, { roughness: .6 });
  const tr = cyl(.95, 1.05, 2.4, cac, 16, body, 0, 1.2, 0); const tt = sphere(.95, cac, body, 0, 2.4, 0, 16, 8); tt.scale.y = .4;
  const head = add(body, G(), 0, 3.1, .1); const hd = sphere(1.0, grey, head, 0, 0, 0, 18, 14); hd.scale.set(1.1, 1, 1);
  const ears = [-1, 1].map(s => { const e = add(head, G(), s * .95, .1, -.1); const p = sphere(.9, grey, e, s * .55, 0, 0, 12, 10); p.scale.set(1, 1.1, .2); const pi = sphere(.65, mat(0xf2a8b8), e, s * .58, 0, .1, 10, 8); pi.scale.set(1, 1.05, .12); return e; });
  const trunk = []; let par = head; for (let k = 0; k < 5; k++) { const s = add(par, G(), 0, k ? -.38 : -.35, k ? 0 : .85); cyl(.3 - k * .03, .27 - k * .03, .42, grey, 10, s, 0, -.2, 0); trunk.push(s); par = s; }
  for (const s of [-1, 1]) { const t = cyl(.08, .14, .6, mat(0xfff6e0), 8, head, s * .45, -.55, .75); t.rotation.x = 1.0; }
  const fc = facePlane(1.3, 1.3, 'lirili', { eyes: 'half', mouth: 'none', ew: 22, ex: 56, ey: 110, brow: false, lid: '#7a808a' }); fc.position.set(0, .15, .97); head.add(fc);
  const arms = [-1, 1].map(s => { const sh = add(body, G(), s * .95, 1.4, 0); const a = cyl(.3, .3, 1.0, cac, 10, sh, s * .45, 0, 0); a.rotation.z = Math.PI / 2; const up = cyl(.28, .28, .9, cac, 10, sh, s * .9, .45, 0); sphere(.28, cac, sh, s * .9, .9, 0, 10, 6); return { sh }; });
  const legs = [-1, 1].map(s => legJ(root, s * .42, 1.3, 1.3, .3, cac, (k, y) => { box(.6, .1, .95, sand, .04, k, 0, y - .1, .12); box(.62, .14, .12, sand, .04, k, 0, y + .02, .3); }));
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const B = { root, body, head, face: fc, arms, legs, trunk, ears, kind: 'lirili', H: 5.4 };
  B.pose = (T, o = {}) => { const sd = o.seed ?? 0, w = o.walk ?? 0, ph = T * 7 + sd; stepLegs(legs, ph, w * .55); body.position.y = 1.3 + Math.abs(Math.sin(ph)) * .1 * w + Math.sin(T * 2 + sd) * .03;
    trunk.forEach((s, k) => { s.rotation.x = Math.sin(T * 1.8 + sd - k * .6) * .18 + (o.trunkUp ? -.45 : .08); }); ears.forEach((e, i) => e.rotation.y = (i ? -1 : 1) * Math.sin(T * 3 + sd) * .15);
    arms.forEach((a, i) => a.sh.rotation.z = (i ? 1 : -1) * Math.sin(T * 1.5 + sd + i) * .1); head.rotation.y = (o.headY ?? 0) + Math.sin(T * .9 + sd) * .15; fc.userData.set(o.face || {}); };
  return B; }

// =====================================================================================================
// Frigo Camelo: camello con el cuerpo de nevera (puerta y tirador), joroba, cuello largo y botas
// =====================================================================================================
export function frigo(scene) { const root = G(); scene.add(root); const body = add(root, G(), 0, 4.2, 0); const fr = mat(0xffffff, { map: fridgeT(), roughness: .3, metalness: .1 }), tan = mat(0xffffff, { map: rep(furT('#d8a868', 'rgba(140,90,40,.5)'), 2, 2), roughness: .9 }), boot = mat(0x5a3418, { roughness: .5 });
  box(3.0, 3.2, 4.6, fr, .35, body, 0, 0, 0); box(3.06, .08, 4.4, mat(0xb8c4d0), .02, body, 0, .5, 0); for (const s of [-1, 1]) { box(.14, .9, .2, mat(0xc8d0d8, { metalness: .8, roughness: .2 }), .05, body, s * 1.55, 1.1, 1.6); box(.14, .7, .2, mat(0xc8d0d8, { metalness: .8, roughness: .2 }), .05, body, s * 1.55, -.6, 1.6); }
  const mag = [0xff4a6a, 0x3ab8ff, 0xffd23f]; mag.forEach((c, i) => box(.05, .35, .35, mat(c), .05, body, 1.53, .9 - i * .6, -.6 + i * .5));
  const hump = sphere(1.15, tan, body, 0, 1.8, -.3, 14, 10); hump.scale.set(1, .85, 1.3);
  const neck = add(body, G(), 0, .9, 2.0); const nk = cyl(.55, .7, 3.2, tan, 12, neck, 0, 1.4, .5); nk.rotation.x = .35;
  const head = add(neck, G(), 0, 3.0, 1.0); const hd = box(1.2, 1.15, 2.1, tan, .45, head, 0, 0, .5); const snout = box(1.0, .8, .9, mat(0xc89858), .3, head, 0, -.25, 1.5);
  for (const s of [-1, 1]) { const e = box(.25, .5, .2, tan, .08, head, s * .5, .7, -.1); e.rotation.z = s * .4; sphere(.08, mat(0x2a1a10), head, s * .25, -.15, 1.96, 6, 4); }
  const fc = facePlane(1.2, 1.2, 'frigo', { eyes: 'half', mouth: 'none', ew: 24, ex: 56, ey: 110, brow: false, lid: '#b88848' }); const fp = add(head, G(), 0, .25, .5); fp.add(fc); fc.position.set(0, 0, 1.06); fc.scale.set(1, .7, 1);
  const legs = [[-1, 1.5], [1, 1.5], [-1, -1.6], [1, -1.6]].map(([s, z]) => { const L = legJ(body, s * 1.0, -1.4, 2.8, .3, tan, (k, y) => { cyl(.42, .45, .9, boot, 12, k, 0, y + .25, .05); box(.8, .3, 1.1, boot, .12, k, 0, y - .1, .2); }); L.hp.position.z = z; return L; });
  const tail = cyl(.1, .06, 1.4, tan, 6, body, 0, .6, -2.5); tail.rotation.x = -.6;
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const B = { root, body, neck, head, face: fc, legs, kind: 'frigo', H: 10 };
  B.pose = (T, o = {}) => { const w = o.walk ?? 0, ph = T * 5; legs.forEach((L, i) => { const p = ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0); L.hp.rotation.x = Math.sin(p) * .45 * w - (o.sit ? 1.3 : 0); L.kn.rotation.x = Math.max(0, -Math.cos(p)) * .6 * w + (o.sit ? 2.2 : 0); });
    body.position.y = 4.2 + Math.abs(Math.sin(ph)) * .15 * w - (o.sit ? 2.2 : 0); neck.rotation.x = (o.neckX ?? 0) + Math.sin(T * 1.2) * .05 + (o.sleep ? .6 : 0); head.rotation.x = o.sleep ? -.5 : 0; tail.rotation.z = Math.sin(T * 3) * .3; fc.userData.set(o.sleep ? { eyes: 'closed' } : (o.face || {})); };
  return B; }

// =====================================================================================================
// Tralalero Tralala: tiburón azul de pie sobre tres piernas con zapatillas azules
// =====================================================================================================
export function tralalero(scene) { const root = G(); scene.add(root); const body = add(root, G(), 0, 3.4, 0); const sk = mat(0xffffff, { map: sharkT(), roughness: .4 }), blue = glossy(0x3a7ad8);
  const b = sphere(1.6, sk, body, 0, 0, 0, 24, 18); b.scale.set(1, .95, 2.4); b.rotation.x = -.05;
  const df = new THREE.Mesh(new THREE.ConeGeometry(.9, 1.8, 4), blue); df.scale.set(.25, 1, 1); df.position.set(0, 1.8, -.4); df.rotation.x = -.35; body.add(df);
  const tail = add(body, G(), 0, .2, -3.6); const tf1 = box(.2, 2.2, .9, blue, .1, tail, 0, .8, -.4); tf1.rotation.x = -.6; const tf2 = box(.2, 1.4, .8, blue, .1, tail, 0, -.5, -.3); tf2.rotation.x = .6;
  for (const s of [-1, 1]) { const f = box(1.6, .16, .9, blue, .08, body, s * 1.6, -.6, .9); f.rotation.z = s * -.5; }
  const mouth = add(body, G(), 0, -.7, 3.0); const m = sphere(.9, mat(0x8a1a2a), mouth, 0, 0, 0, 14, 8); m.scale.set(1, .32, .6); for (let i = 0; i < 9; i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(.08, .22, 4), mat(0xffffff)); t.position.set(-.7 + i * .175, .18, .25); t.rotation.x = Math.PI; mouth.add(t); }
  const fc = facePlane(2.4, 1.6, 'tral', { eyes: 'open', mouth: 'none', ew: 22, ex: 80, ey: 120, brow: false }); fc.position.set(0, .45, 3.45); fc.rotation.x = -.25; body.add(fc);
  const shoe = (k, y) => { box(.85, .55, 1.4, glossy(0x2a5ad8), .25, k, 0, y + .05, .25); box(.88, .14, 1.45, mat(0xffffff), .06, k, 0, y - .2, .25); const sw = box(.06, .2, .8, mat(0xffffff), .02, k, .44, y + .1, .2); sw.rotation.x = -.3; box(.5, .1, .5, mat(0xffffff), .04, k, 0, y + .35, .55); };
  const legs = [[-.7, .8], [.7, .8], [0, -1.2]].map(([x, z]) => { const L = legJ(body, x, -1.0, 2.6, .28, glossy(0x3a7ad8), shoe); L.hp.position.z = z; return L; });
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const B = { root, body, tail, mouth, face: fc, legs, kind: 'tral', H: 6.4 };
  B.pose = (T, o = {}) => { const w = o.walk ?? 0, ph = T * 8; legs.forEach((L, i) => { const p = ph + i * 2.09; L.hp.rotation.x = Math.sin(p) * .5 * w; L.kn.rotation.x = Math.max(0, -Math.cos(p)) * .7 * w; });
    body.position.y = 3.4 + Math.abs(Math.sin(ph * 1.5)) * .2 * w; body.rotation.z = Math.sin(ph) * .05 * w; tail.rotation.y = Math.sin(T * 6) * .35; mouth.scale.y = 1 + (o.open ?? 0) * 1.6; fc.userData.set(o.face || {}); };
  return B; }

// =====================================================================================================
// Strawberry Elephant: elefante de fresa (semillas, corona de hojas, trompa, colmillos); variante de oro con alas
// =====================================================================================================
export function erdbeerfant(scene, gold = false) { const root = G(); scene.add(root); const body = add(root, G(), 0, 4.4, 0);
  const red = gold ? new THREE.MeshStandardMaterial({ map: rep(strawT(true), 2, 2), color: 0xffffff, metalness: .8, roughness: .25, emissive: 0x7a5200, emissiveIntensity: .5 }) : mat(0xffffff, { map: rep(strawT(false), 2, 2), roughness: .4 });
  const leaf = gold ? GOLD() : mat(0x3ab84a, { roughness: .6 }), tusk = gold ? GOLD() : mat(0xfff6e0, { roughness: .3 }), pink = gold ? GOLD() : mat(0xff8aa8, { roughness: .5 });
  const b = sphere(3.0, red, body, 0, 0, 0, 24, 18); b.scale.set(1, .95, 1.25);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, l = box(1.2, .2, 2.2, leaf, .1, body, Math.sin(a) * 1.2, 2.75, Math.cos(a) * 1.2 - .6); l.rotation.set(Math.cos(a) * .5, a, -Math.sin(a) * .5); }
  const head = add(body, G(), 0, 1.5, 3.4); const hd = sphere(2.1, red, head, 0, 0, 0, 22, 16); hd.scale.set(1, 1, .95);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, l = box(.9, .16, 1.6, leaf, .08, head, Math.sin(a) * .7, 2.0, Math.cos(a) * .7); l.rotation.set(Math.cos(a) * .6, a, -Math.sin(a) * .6); } cyl(.15, .2, .9, leaf, 8, head, 0, 2.4, 0);
  const ears = [-1, 1].map(s => { const e = add(head, G(), s * 1.8, .3, -.4); const p = sphere(1.7, red, e, s * .9, 0, 0, 14, 12); p.scale.set(1, 1.15, .22); const pi = sphere(1.2, pink, e, s * .95, 0, .2, 12, 10); pi.scale.set(1, 1.1, .1); return e; });
  const trunk = []; let par = head; for (let k = 0; k < 7; k++) { const s = add(par, G(), 0, k ? -.6 : -.5, k ? 0 : 1.8); cyl(.6 - k * .06, .55 - k * .06, .66, red, 12, s, 0, -.3, 0); trunk.push(s); par = s; }
  for (const s of [-1, 1]) { const t = new THREE.Mesh(new THREE.TorusGeometry(1.0, .16, 8, 14, Math.PI * .7), tusk); t.rotation.set(0, Math.PI / 2, Math.PI * .7); t.position.set(s * .9, -1.1, 1.6); head.add(t); }
  const fc = facePlane(2.6, 2.6, gold ? 'efg' : 'ef', { eyes: 'open', mouth: 'none', ew: 30, ex: 70, ey: 100, brow: true, browC: gold ? '#6a4a00' : '#5a0a10', blush: 1 }); fc.position.set(0, .35, 1.98); head.add(fc);
  const legs = [[-1.6, 1.6], [1.6, 1.6], [-1.6, -1.8], [1.6, -1.8]].map(([x, z]) => { const L = legJ(body, x, -1.6, 2.9, .85, red, (k, y) => { cyl(.95, 1.0, .4, gold ? GOLD() : mat(0xf4d8c8), 14, k, 0, y + .1, 0); }); L.hp.position.z = z; return L; });
  const tail = cyl(.15, .1, 1.6, red, 6, body, 0, .4, -3.8); tail.rotation.x = -.7;
  let wings = null; if (gold) { wings = [-1, 1].map(s => { const w = add(body, G(), s * 2.0, 2.0, -.6); for (let k = 0; k < 4; k++) { const f = box(4.6 - k * .6, .12, 1.4, GOLD(), .1, w, s * (2.3 - k * .1), 0, -k * 1.1 + .6); f.rotation.y = s * k * .12; } return w; }); }
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const B = { root, body, head, face: fc, legs, trunk, ears, wings, kind: 'ef', H: 12 };
  B.pose = (T, o = {}) => { const w = o.walk ?? 0, ph = T * 4; legs.forEach((L, i) => { const p = ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0); L.hp.rotation.x = Math.sin(p) * .4 * w + (o.fly ? (i > 1 ? .5 : -.4) : 0); L.kn.rotation.x = Math.max(0, -Math.cos(p)) * .5 * w + (o.fly ? .4 : 0); });
    body.position.y = 4.4 + Math.abs(Math.sin(ph)) * .2 * w; body.rotation.x = (o.bow ?? 0) * .45; head.rotation.x = (o.bow ?? 0) * .5;
    trunk.forEach((s, k) => { s.rotation.x = Math.sin(T * 1.6 - k * .5) * .12 + (o.trunkUp ? -.42 : .1) * (k < 5 ? 1 : .5); });
    ears.forEach((e, i) => e.rotation.y = (i ? -1 : 1) * (Math.sin(T * (o.fly ? 9 : 2.5)) * (o.fly ? .5 : .15)));
    if (wings) wings.forEach((wg, i) => { wg.visible = !!o.fly || !!o.wings; wg.rotation.z = (i ? -1 : 1) * Math.sin(T * 7) * .55; }); tail.rotation.z = Math.sin(T * 3) * .3; fc.userData.set(o.face || {}); };
  return B; }

// moneda de oro (para las que «ploppen» de los Tiere)
export function coin(scene) { const g = G(); scene.add(g); const c = cyl(.55, .55, .14, GOLD(), 20, g, 0, 0, 0); c.rotation.x = Math.PI / 2; const s = cyl(.36, .36, .16, new THREE.MeshStandardMaterial({ color: 0xffe68a, metalness: .7, roughness: .3, emissive: 0x6a4a00, emissiveIntensity: .4 }), 16, g, 0, 0, 0); s.rotation.x = Math.PI / 2; return g; }
