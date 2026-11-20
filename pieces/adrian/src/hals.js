// HALS — piezas propias: cuello que se estira (cadena de segmentos), gente de cuello largo instanciada, gaviotas, cigüeñas con nido,
// pretzel, escalera de mano, metro plegable, lluvia, carteles, quiosco de helados, sótano de fiesta (techo bajo), cocina con trampilla,
// móvil / portátil / tele con pantalla dibujada, calcetines desparejados y puerta de arriba de las casas.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, V, outline, clamp, lerp } from './engine.js';
import { FONT } from './props.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const txt = (c, s, x, y, size, fill, stroke = null, lw = 0) => { c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = fill; c.fillText(s, x, y); };
const rep = (t, x, y) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(x, y); return t; };
const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });

// ---------- cuello ----------
const UP = new THREE.Vector3(0, 1, 0), NG = new THREE.CylinderGeometry(.36, .4, 1, 14, 1, true); NG.translate(0, .5, 0);
const scarfT = (a, b) => rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let y = 0; y < h; y += 16) c.fillRect(0, y, w, 8); c.fillStyle = 'rgba(0,0,0,.12)'; for (let x = 0; x < w; x += 4) c.fillRect(x, 0, 1, h); }, true), 1, 1);
export const SCARF = [mat(0xffffff, { map: scarfT('#d8323a', '#ffffff'), roughness: 1 }), mat(0xffffff, { map: scarfT('#2a8ad8', '#ffd23f'), roughness: 1 }), mat(0xffffff, { map: scarfT('#3aa04a', '#f4e8d0'), roughness: 1 })];
const NECKS = new Map();
// hals(ch, L, {T, bend, sway, scarf:[a,b], scarfM, ring}): cuello de longitud L (unidades locales del personaje); la cabeza queda arriba y derecha
export function hals(ch, L, o = {}) {
  let N = NECKS.get(ch); const n = 12;
  if (!N) { const skin = mat(ch.spec.skin, { roughness: .55 }), sk2 = mat(new THREE.Color(ch.spec.skin).multiplyScalar(.86), { roughness: .55 }); const segs = [];
    for (let i = 0; i < n; i++) { const m = new THREE.Mesh(NG, i % 2 ? sk2 : skin); m.castShadow = true; m.receiveShadow = true; outline(m, 1.6); ch.neck.add(m); m.visible = false; m.userData.skin = m.material; segs.push(m); }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.42, .07, 6, 18), mat(0xffd23f, { roughness: .3, metalness: .6 })); ring.rotation.x = Math.PI / 2; ring.visible = false; ch.neck.add(ring);
    N = { segs, ring }; NECKS.set(ch, N); }
  if (L < .05) { N.segs.forEach(s => s.visible = false); N.ring.visible = false; ch.head.position.set(0, .05, 0); ch.head.rotation.set(0, 0, 0); return; }
  const T = o.T ?? 0, sw = o.sway ?? .05, bend = o.bend ?? 0, segL = L / n, p = V(0, 0, 0); let ax = 0, az = 0;
  for (let i = 0; i < n; i++) { const t = (i + .5) / n; ax = bend * t + Math.sin(T * 1.3 + i * .4 + ch.seed) * sw * t; az = Math.sin(T * 1.05 + i * .33 + ch.seed * 2) * sw * t + (o.lean ?? 0) * t;
    const d = V(-Math.sin(az), Math.cos(ax) * Math.cos(az), Math.sin(ax) * Math.cos(az)).normalize(); const s = N.segs[i]; s.visible = true; s.position.copy(p); s.quaternion.setFromUnitVectors(UP, d); s.scale.set(1, segL * 1.06, 1);
    const inScarf = o.scarf && t >= o.scarf[0] && t <= o.scarf[1]; s.material = inScarf ? (o.scarfM || SCARF[0]) : s.userData.skin; s.scale.x = s.scale.z = inScarf ? 1.35 : 1; p.addScaledVector(d, segL); }
  ch.head.position.copy(p).add(V(0, .02, 0)); ch.head.rotation.set(-ax * .5, 0, az * .5);
  if (o.ring != null) { N.ring.visible = true; N.ring.position.set(0, o.ring * L, 0); } else N.ring.visible = false;
}
// punto del mundo a la altura k (0..1) del cuello
export function neckAt(ch, k) { const N = NECKS.get(ch); if (!N) return ch.neck.getWorldPosition(V(0, 0, 0)); const i = Math.min(11, Math.floor(k * 12)); ch.root.updateMatrixWorld(true); return N.segs[i].getWorldPosition(V(0, 0, 0)); }

// ---------- gente de cuello largo instanciada (relleno de fondo): cuerpo, brazos, cuello, cabeza con cara, móvil brillante ----------
const volkFace = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#1a1a1a'; for (const x of [40, 88]) { c.beginPath(); c.ellipse(x, 58, 9, 13, 0, 0, 7); c.fill(); } c.fillStyle = '#fff'; for (const x of [43, 91]) { c.beginPath(); c.arc(x, 53, 4, 0, 7); c.fill(); } c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(64, 82, 16, .3, Math.PI - .3); c.stroke(); for (const x of [30, 98]) { c.fillStyle = 'rgba(255,90,90,.3)'; c.beginPath(); c.arc(x, 80, 9, 0, 7); c.fill(); } });
export function halsVolk(scene, n) {
  const g = G(scene); const mk = (geo, m) => { const im = new THREE.InstancedMesh(geo, m, n); im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; g.add(im); return im; };
  const body = mk(new THREE.BoxGeometry(2, 2.4, 1.1), mat(0xffffff, { roughness: .8 })), legs = mk(new THREE.BoxGeometry(1.8, 2.1, .9), mat(0xffffff, { roughness: .8 })), arms = mk(new THREE.BoxGeometry(3.0, .62, .62), mat(0xffffff, { roughness: .8 }));
  const ng = new THREE.CylinderGeometry(.34, .38, 1, 10); ng.translate(0, .5, 0); const neck = mk(ng, mat(0xffffff, { roughness: .6 })), head = mk(new THREE.BoxGeometry(1.3, 1.25, 1.2), mat(0xffffff, { roughness: .5 })), hair = mk(new THREE.BoxGeometry(1.4, .45, 1.3), mat(0xffffff, { roughness: .7 }));
  const ph = mk(new THREE.BoxGeometry(.6, 1.0, .1), glowM(0x7ad8ff, 1.6)); const face = mk(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshStandardMaterial({ map: volkFace, transparent: true, roughness: .6 })); face.castShadow = false;
  const skins = [0xf2c4a0, 0xd8a07a, 0x8a5a3a, 0xf4cfb6, 0xc68b5e, 0xeab08a], shirts = [0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0xff8ad0, 0xf4f4f4, 0x6a3ad8, 0xff8a3a, 0x1aa0a0], pants = [0x2a3a5a, 0x3a3a46, 0x5a4a3a, 0x1a1a24], hairs = [0x2a1a10, 0xe0b850, 0x6a3a1a, 0x101010, 0xb8441a, 0xd8d8d8], C = new THREE.Color(), r = RNG(91);
  const seat = Array.from({ length: n }, (_, i) => ({ x: 0, z: 0, ry: 0, L: 4 + r() * 10, ph: r() * 6.28, walk: 0 }));
  for (let i = 0; i < n; i++) { const sk = skins[(i * 7) % 6]; body.setColorAt(i, C.setHex(shirts[i % 9])); arms.setColorAt(i, C.setHex(shirts[i % 9])); legs.setColorAt(i, C.setHex(pants[i % 4])); neck.setColorAt(i, C.setHex(sk)); head.setColorAt(i, C.setHex(sk)); hair.setColorAt(i, C.setHex(hairs[(i * 5) % 6])); }
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), S = new THREE.Vector3();
  const place = (m, i, x, y, z, rx, ry, rz, sx = 1, sy = 1, sz = 1) => { Q.setFromEuler(E.set(rx, ry, rz, 'YXZ')); M.compose(P.set(x, y, z), Q, S.set(sx, sy, sz)); m.setMatrixAt(i, M); };
  const ALL = [body, legs, arms, neck, head, hair, ph, face];
  const API = { g, seat, n, update(T, cnt = n, phoneOn = true) { for (let i = 0; i < cnt; i++) { const s = seat[i], fx = Math.sin(s.ry), fz = Math.cos(s.ry), rx_ = Math.cos(s.ry), rz_ = -Math.sin(s.ry); const wk = s.walk ? T * s.walk : 0, x = s.x + fx * wk, z = s.z + fz * wk;
        const step = s.walk ? Math.sin(T * 7 + s.ph) : 0, sw = Math.sin(T * 1.1 + s.ph) * .1, lean = .25 + Math.sin(T * .8 + s.ph) * .06;
        place(legs, i, x, 1.05 + Math.abs(step) * .12, z, step * .12, s.ry, 0); place(body, i, x, 3.3, z, 0, s.ry, sw * .15); place(arms, i, x + fx * .7, 3.7, z + fz * .7, 0, s.ry, 0);
        const by = 4.45, hx = x + rx_ * Math.sin(sw) * s.L, hy = by + Math.cos(sw) * s.L, hz = z + rz_ * Math.sin(sw) * s.L;
        place(neck, i, x, by, z, 0, s.ry, -sw, 1, s.L, 1); place(head, i, hx, hy + .6, hz, lean, s.ry, 0); place(hair, i, hx - fx * .06, hy + 1.3, hz - fz * .06, lean, s.ry, 0); place(face, i, hx + fx * .63, hy + .58, hz + fz * .63, lean, s.ry, 0);
        if (phoneOn) place(ph, i, x + fx * 1.4, 4.4, z + fz * 1.4, -.9, s.ry, 0); else place(ph, i, 0, -999, 0, 0, 0, 0); }
      for (const m of ALL) { m.count = cnt; m.instanceMatrix.needsUpdate = true; } }, hide() { for (const m of ALL) m.count = 0; } };
  API.hide(); return API;
}

// ---------- animales ----------
export function gull(parent) { const g = G(parent); const w = mat(0xf8f8fa, { roughness: .6 }), gr = mat(0x8a96a6, { roughness: .6 }), y = mat(0xffc21a, { roughness: .4 });
  const b = sphere(.6, w, g, 0, 0, 0, 14, 10); b.scale.set(.8, .75, 1.5); sphere(.42, w, g, 0, .35, .85, 12, 8); const bk = new THREE.Mesh(new THREE.ConeGeometry(.12, .6, 8), y); bk.rotation.x = Math.PI / 2; bk.position.set(0, .3, 1.45); g.add(bk);
  for (const s of [-1, 1]) sphere(.07, mat(0x101010), g, s * .26, .45, 1.1, 6, 4); const tail = box(.5, .12, .5, gr, .05, g, 0, .05, -.95); tail.rotation.x = -.3;
  const W = [-1, 1].map(s => { const p = G(g, s * .35, .2, 0); const wb = box(1.7, .1, .8, gr, .05, p, s * .85, 0, 0); box(.5, .11, .6, mat(0x1a1a1a), .03, p, s * 1.6, 0, -.1); return p; });
  for (const s of [-1, 1]) cyl(.05, .05, .5, y, 5, g, s * .2, -.6, .1);
  g.userData.flap = T => W.forEach((p, i) => p.rotation.z = (i ? -1 : 1) * Math.sin(T * 14) * .7); outline(g, 1.2); return shade(g); }
export function stork(parent) { const g = G(parent); const w = mat(0xfafafa, { roughness: .6 }), k = mat(0x141414), r = mat(0xe8402a, { roughness: .4 });
  const b = sphere(.8, w, g, 0, 0, 0, 14, 10); b.scale.set(.85, .8, 1.5); const nk = cyl(.18, .24, 1.4, w, 8, g, 0, .7, .9); nk.rotation.x = .5; sphere(.34, w, g, 0, 1.4, 1.25, 10, 8);
  const bk = new THREE.Mesh(new THREE.ConeGeometry(.12, 1.2, 8), r); bk.rotation.x = Math.PI / 2 + .4; bk.position.set(0, 1.2, 1.9); g.add(bk); for (const s of [-1, 1]) sphere(.06, k, g, s * .2, 1.5, 1.45, 6, 4);
  const W = [-1, 1].map(s => { const p = G(g, s * .5, .25, 0); box(2.2, .12, 1.2, w, .05, p, s * 1.1, 0, 0); box(.9, .13, 1.0, k, .03, p, s * 2.1, 0, -.15); return p; });
  for (const s of [-1, 1]) cyl(.06, .06, 1.6, r, 5, g, s * .25, -1.3, 0); box(.6, .14, .9, k, .05, g, 0, .2, -1.1);
  g.userData.flap = (T, a = .6) => W.forEach((p, i) => p.rotation.z = (i ? -1 : 1) * (Math.sin(T * 8) * a)); outline(g, 1.2); return shade(g); }
export function nest(parent) { const g = G(parent); const m = mat(0x8a5a2a, { roughness: 1 }), m2 = mat(0x6a4220, { roughness: 1 });
  const t = new THREE.Mesh(new THREE.TorusGeometry(1.3, .45, 8, 18), m); t.rotation.x = Math.PI / 2; t.scale.z = .7; g.add(t); cyl(1.1, .8, .4, m2, 14, g, 0, -.15, 0); const r = RNG(4);
  for (let i = 0; i < 26; i++) { const s = box(1.4, .07, .07, i % 2 ? m : m2, 0, g, Math.cos(i) * 1.3, (r() - .5) * .4, Math.sin(i) * 1.3); s.rotation.set(r() * .5, i * .7, r() * .5); }
  const chicks = [0, 1, 2].map(i => { const c = G(g, (i - 1) * .55, .3, (i % 2) * .3); sphere(.3, mat(0xf4f0e0, { roughness: 1 }), c, 0, 0, 0, 10, 8); const bk = new THREE.Mesh(new THREE.ConeGeometry(.07, .3, 6), mat(0xffa21a)); bk.rotation.x = -Math.PI / 2 - .6; bk.position.set(0, .25, .25); c.add(bk); return c; });
  g.userData.chicks = chicks; outline(g, 1.2); return shade(g); }

// ---------- objetos ----------
const PZG = new THREE.TorusKnotGeometry(.55, .2, 48, 8, 2, 3);
export function pretzel(parent, half = false) { const g = G(parent); const m = mat(0x9a5a20, { roughness: .45 }); const p = new THREE.Mesh(half ? new THREE.TorusGeometry(.6, .2, 8, 18, Math.PI) : PZG, m); p.scale.set(1, .8, .5); g.add(p);
  for (let i = 0; i < 9; i++) sphere(.05, mat(0xffffff, { roughness: .3 }), g, Math.cos(i * 2.1) * .55, Math.sin(i * 2.1) * .45, .12, 4, 3); outline(g, 1.2); return shade(g); }
export function ladder(parent, h = 10) { const g = G(parent); const m = mat(0xb8bec8, { metalness: .6, roughness: .35 }); for (const s of [-1, 1]) box(.22, h, .3, m, .05, g, s * .95, h / 2, 0); for (let y = 1; y < h; y += 1.1) box(1.9, .14, .26, m, .03, g, 0, y, 0); outline(g, 1.2); return shade(g); }
export function zollstock(parent, L = 10) { const g = G(parent); const t = rep(canvasTex(256, 32, (c, w, h) => { c.fillStyle = '#ffd21a'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a1a'; for (let i = 0; i < 64; i++) c.fillRect(i * 4, 0, 1.4, i % 10 ? 9 : 18); for (let i = 0; i < 6; i++) { c.font = 'bold 12px sans-serif'; c.fillText(String(i * 10 + 10), i * 40 + 30, 28); } c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 2); }, true), 1, 1);
  const seg = 2; const n = Math.ceil(L / seg); for (let i = 0; i < n; i++) { const b = box(.42, seg, .1, mat(0xffffff, { map: t, roughness: .5 }), .02, g, 0, i * seg + seg / 2, (i % 2) * .1); b.rotation.z = Math.PI; box(.46, .12, .14, mat(0x9aa0aa, { metalness: .8 }), 0, g, 0, i * seg, .05); } outline(g, 1); return shade(g); }
export function rain(scene, n = 500) { const im = new THREE.InstancedMesh(new THREE.BoxGeometry(.05, 1.1, .05), new THREE.MeshBasicMaterial({ color: 0xbfe0ff, transparent: true, opacity: .55, depthWrite: false }), n); im.frustumCulled = false; scene.add(im);
  const r = RNG(12), seed = Array.from({ length: n }, () => [r(), r(), r(), .7 + r() * .6]); const M = new THREE.Matrix4();
  return { im, update(T, c, sx = 40, sz = 40, h = 40, on = true) { im.visible = on; if (!on) return; seed.forEach(([a, b, d, sp], i) => { const y = h - ((T * 28 * sp + d * h) % h); M.makeTranslation(c.x + (a - .5) * sx, c.y + y, c.z + (b - .5) * sz); im.setMatrixAt(i, M); }); im.instanceMatrix.needsUpdate = true; } }; }
export function umbrella(parent, col = 0xd8323a) { const g = G(parent); const c = new THREE.Mesh(new THREE.ConeGeometry(2.2, .9, 10), mat(col, { roughness: .5, side: THREE.DoubleSide })); c.position.y = 2.2; g.add(c); cyl(.05, .05, 2.4, mat(0x2a2a2a), 5, g, 0, 1.1, 0); outline(g, 1); return shade(g); }
export function needles(parent) { const g = G(parent); for (const s of [-1, 1]) { const n = cyl(.04, .04, 1.6, mat(0xd8d8e0, { metalness: .8 }), 5, g, s * .2, 0, 0); n.rotation.z = s * .5; sphere(.08, mat(0xd8323a), g, s * .6, -.55 * s, 0, 6, 4); } return g; }
export function yarn(parent, col = 0xd8323a) { const g = G(parent); sphere(.7, mat(col, { roughness: 1 }), g, 0, 0, 0, 14, 10); for (let i = 0; i < 4; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(.7, .03, 4, 20), mat(new THREE.Color(col).multiplyScalar(.8))); t.rotation.set(i * .8, i, 0); g.add(t); } return shade(g); }
// pila larga de bufanda tejida (serpentea por el suelo)
export function scarfPile(parent, len = 40, seed = 2) { const g = G(parent); const m = SCARF[0]; const r = RNG(seed); let x = 0, z = 0, a = 0; for (let i = 0; i < len; i++) { a += (r() - .5) * .9; const b = box(1.9, .5, 1.3, m, .2, g, x, .25 + (i % 3) * .05, z); b.rotation.y = a; x += Math.sin(a) * 1.1; z += Math.cos(a) * 1.1; } return shade(g); }

// tablón / cartel con patas: draw(c, w, h)
export function board(parent, w, h, draw, legs = true, glow = .25) { const g = G(parent); const p = textPlane(w, h, Math.round(w * 50), Math.round(h * 50), draw, glow); p.position.y = h / 2 + (legs ? 3 : 0); g.add(p);
  box(w + .6, h + .6, .4, mat(0x2a2a34, { roughness: .5 }), .1, g, 0, h / 2 + (legs ? 3 : 0), -.25); if (legs) for (const s of [-1, 1]) box(.4, h / 2 + 3, .4, mat(0x4a4e58, { metalness: .5 }), .05, g, s * w * .38, (h / 2 + 3) / 2, -.3); g.userData.plane = p; return shade(g); }

// ---------- pantallas con canvas propio ----------
export function scr(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; let last = null; return { c, t, draw(key, f) { if (key === last) return; last = key; f(c.getContext('2d'), w, h); t.needsUpdate = true; } }; }
export function phoneBig(parent) { const g = G(parent); box(1.0, 1.95, .14, mat(0x1a1a22, { metalness: .6, roughness: .3 }), .12, g, 0, 0, 0); const S = scr(300, 580); const m = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.78), new THREE.MeshBasicMaterial({ map: S.t, toneMapped: false })); m.position.z = .075; g.add(m); g.userData.S = S; outline(g, 1); return g; }
export function laptop(parent) { const g = G(parent); box(3.4, .18, 2.4, mat(0x9aa0aa, { metalness: .7, roughness: .3 }), .06, g, 0, 0, 0); const lid = G(g, 0, .05, -1.15); lid.rotation.x = -.25; box(3.4, 2.3, .12, mat(0x9aa0aa, { metalness: .7, roughness: .3 }), .06, lid, 0, 1.15, 0);
  const S = scr(320, 200); const m = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.95), new THREE.MeshBasicMaterial({ map: S.t, toneMapped: false })); m.position.set(0, 1.15, .07); lid.add(m); g.userData.S = S; outline(g, 1); return g; }
export function tvSet(parent) { const g = G(parent); box(6.4, 3.8, .3, mat(0x111114, { metalness: .5, roughness: .3 }), .1, g, 0, 0, 0); const S = scr(400, 230); const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.4), new THREE.MeshBasicMaterial({ map: S.t, toneMapped: false })); m.position.z = .16; g.add(m); box(1.2, 1.4, 1.2, mat(0x111114), .1, g, 0, -2.4, 0); g.userData.S = S; return g; }
// contenidos de pantalla
export function drawFeed(c, w, h, k = 0, chan = false) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#16182a'); g.addColorStop(1, '#2a1a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h); const r = RNG(Math.floor(k) + 3);
  const vh = h * .62, y0 = h * .08 - (k % 1) * vh; for (let j = 0; j < 3; j++) { const y = y0 + j * vh; const gg = c.createLinearGradient(0, y, 0, y + vh); gg.addColorStop(0, `hsl(${r() * 360},70%,60%)`); gg.addColorStop(1, `hsl(${r() * 360},70%,40%)`); c.fillStyle = gg; c.beginPath(); c.roundRect(w * .05, y, w * .9, vh * .94, 18); c.fill();
    c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.moveTo(w * .44, y + vh * .38); c.lineTo(w * .58, y + vh * .47); c.lineTo(w * .44, y + vh * .56); c.fill(); }
  if (chan) { c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(0, h * .78, w, h * .22); c.fillStyle = '#c8f03a'; c.beginPath(); c.arc(w * .16, h * .86, w * .08, 0, 7); c.fill(); txt(c, '☺', w * .16, h * .865, w * .1, '#1a1a1a'); c.textAlign = 'left'; c.font = `700 ${Math.round(w * .07)}px ${FONT}`; c.fillStyle = '#fff'; c.fillText('In dieser Stadt', w * .28, h * .855); c.font = `700 ${Math.round(w * .05)}px ${FONT}`; c.fillStyle = '#c8f03a'; c.fillText('♥ 2,4 Mio.', w * .28, h * .91); } }
export function drawLock(c, w, h, label = 'GESPERRT', col = '#ff5a4a', bg = '#0c0e1c') { c.fillStyle = bg; c.fillRect(0, 0, w, h); const s = Math.min(w, h) / 300; c.save(); c.translate(w / 2, h * .42); c.scale(s, s); c.lineWidth = 16; c.strokeStyle = '#e8eef8'; c.beginPath(); c.arc(0, -30, 44, Math.PI, 0); c.stroke(); c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(-70, -30, 140, 110, 18); c.fill(); c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(0, 15, 14, 0, 7); c.fill(); c.fillRect(-6, 15, 12, 35); c.restore();
  txt(c, label, w / 2, h * .78, Math.round(Math.min(w * .13, h * .1)), col); }
export function drawTime(c, w, h, mode, k = 1) { c.fillStyle = '#0e1020'; c.fillRect(0, 0, w, h); txt(c, 'Bildschirmzeit', w / 2, h * .1, w * .09, '#ffffff');
  const big = mode === 'zero' ? '0 Min.' : '6 Std. 40 Min.'; txt(c, big, w / 2, h * .22, w * (mode === 'zero' ? .16 : .1), mode === 'zero' ? '#5aff9a' : '#ff6a5a'); txt(c, 'pro Tag', w / 2, h * .3, w * .06, '#9aa0b8');
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], vals = [.8, .95, .7, 1, .9, .85, .92]; for (let i = 0; i < 7; i++) { const x = w * (.12 + i * .125), bh = (mode === 'zero' ? .02 : vals[i] * k) * h * .4; c.fillStyle = mode === 'zero' ? '#5aff9a' : '#3ab8ff'; c.beginPath(); c.roundRect(x - w * .04, h * .82 - bh, w * .08, bh, 6); c.fill(); txt(c, days[i], x, h * .87, w * .05, '#9aa0b8'); } }

// ---------- quiosco de helados (Eisdiele Lina) ----------
export function eisdiele(parent, x, z, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry; const pk = mat(0xffb8d0, { roughness: .6 }), wh = mat(0xfaf6f0, { roughness: .6 }), mint = mat(0x8ae8c8, { roughness: .6 });
  box(12, 3.2, 7, wh, .2, g, 0, 1.6, 0); box(12, 4.6, .4, pk, .1, g, 0, 5.5, -3.3); for (const s of [-1, 1]) box(.5, 5, 7, pk, .1, g, s * 5.8, 5.6, 0); box(13, .6, 8, mint, .2, g, 0, 8.3, 0);
  const aw = canvasTex(256, 64, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#ff8ab8'; c.fillRect(i * 16, 0, 16, h); } }, true); const awn = box(13, .2, 3.6, mat(0xffffff, { map: aw }), 0, g, 0, 7.6, 4.6); awn.rotation.x = .38;
  const sg = textPlane(10, 2, 600, 120, (c, w, h) => { c.fillStyle = '#ff5a95'; c.beginPath(); c.roundRect(0, 0, w, h, 40); c.fill(); txt(c, 'EISDIELE LINA', w / 2, h / 2 + 4, 80, '#ffffff', '#b81a5a', 10); }, .4); sg.position.set(0, 9.9, 0); g.add(sg);
  // cucurucho gigante en el tejado
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.4, 4, 14), mat(0xe8a850, { roughness: .8 })); cone.rotation.x = Math.PI; cone.position.set(4, 11, -1); g.add(cone); [0xff8ab8, 0x8ae8c8, 0xfff0a0].forEach((c, i) => sphere(1.35, mat(c, { roughness: .5 }), g, 4, 13.3 + i * 1.3, -1, 16, 12));
  // vitrina con tarrinas
  box(10, .3, 2.6, mat(0xd8f0ff, { transparent: true, opacity: .35, depthWrite: false }), .05, g, 0, 3.4, 2.4); for (let k = 0; k < 8; k++) { const t = cyl(.55, .5, .5, mat([0xff8ab8, 0x8ae8c8, 0xfff0a0, 0x7a4a2a, 0xffffff, 0xd8323a, 0x9a6ad8, 0xffc21a][k], { roughness: .6 }), 12, g, -4.2 + k * 1.2, 3.35, 2.2); }
  for (const [px, pz] of [[-8, 5], [8, 5]]) { cyl(1.2, 1.2, .15, wh, 14, g, px, 2.4, pz); cyl(.1, .1, 2.4, mat(0x2a2a2a), 6, g, px, 1.2, pz); }
  return shade(g); }
// ---------- sótano de fiesta: techo a 7 (≈ 2 m), escalera que baja desde la cocina (arriba, z = -12), luces, globos, bola de discoteca ----------
export function partyKeller(scene, X) { const g = G(scene, X); const wallT = rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#b86a4a'; c.fillRect(0, 0, w, h); c.fillStyle = '#a65a3c'; for (let y = 0; y < h; y += 16) for (let x = (y / 16 % 2) * 16; x < w; x += 32) c.fillRect(x, y, 30, 14); }, true), 4, 1);
  const wall = mat(0xffffff, { map: wallT, roughness: .95 }), fl = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#4a4e5a'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a3e48'; c.fillRect(0, 0, 32, 32); c.fillRect(32, 32, 32, 32); }, true), 10, 10), roughness: .7 });
  const H = 7; box(44, .4, 34, fl, 0, g, 0, -.2, 0); box(44, H, .4, wall, 0, g, 0, H / 2, -17); for (const s of [-1, 1]) box(.4, H, 34, wall, 0, g, s * 22, H / 2, 0); const cm_ = mat(0xd8d0c4, { roughness: .9 }); box(34.5, .5, 34, cm_, 0, g, -4.75, H + .25, 0); box(9.5, .5, 34, cm_, 0, g, 17.25, H + .25, 0); box(5, .5, 25, cm_, 0, g, 15, H + .25, 4.5);
  for (let k = 0; k < 5; k++) box(44, .5, .7, mat(0x6a4a2a), .05, g, 0, H - .1, -14 + k * 7);
  // escalera: baja desde un hueco en el techo (x 12..18, z -16..-4) hasta el suelo
  const STE = G(g, 15, 0, -16); for (let k = 0; k < 9; k++) box(5, .5, 1.4, mat(0x8a6a4a, { roughness: .8 }), .05, STE, 0, H - .5 - k * .78, 1 + k * 1.35); for (let k = 0; k < 9; k++) box(5, H - k * .78, .3, mat(0x7a5a3a), 0, STE, 0, (H - k * .78) / 2 - .5, 1.6 + k * 1.35).visible = false;
  box(.2, .2, 13, mat(0x6a3a1a), .05, STE, -2.6, H * .55, 6.5).rotation.x = -Math.atan2(7, 12);
  // guirnaldas de bombillas, globos, bola, altavoz, mesa con bebidas, cartel PARTY
  const LIGHTS = []; for (let r_ = 0; r_ < 3; r_++) for (let k = 0; k < 16; k++) { const b = sphere(.18, glowM([0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a][k % 4], 2.4), g, -18 + k * 2.4, H - .5 - Math.sin(k / 15 * Math.PI) * .6, -12 + r_ * 9, 8, 6); LIGHTS.push(b); }
  for (let k = 0; k < 12; k++) { const b = sphere(.7, mat([0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a, 0xb86aff][k % 6], { roughness: .2 }), g, -20 + (k % 6) * 1.1 + (k > 5 ? 38 : 0), H - .9 - (k % 2) * .5, -15.6 + (k % 3), 14, 10); b.scale.y = 1.2; }
  const disco = sphere(.7, mat(0xe8ecf8, { metalness: .3, roughness: .2, emissive: 0x8a8aa8, emissiveIntensity: .8, flatShading: true }), g, -8, H - 1.1, -10, 12, 8);
  box(3, 5, 2.4, mat(0x1a1a24), .2, g, -18, 2.5, -14); for (const y of [1.5, 3.6]) { const c = cyl(.8, .8, .2, mat(0x3a3a46), 16, g, -18, y, -12.7); c.rotation.x = Math.PI / 2; }
  box(9, .4, 3, mat(0xf4f4f4), .05, g, 6, 3.2, -14.4); for (let k = 0; k < 7; k++) cyl(.3, .25, 1, mat([0xd8323a, 0x3a8ad8, 0x8ad84a, 0xffd23f][k % 4], { roughness: .3 }), 10, g, 2.5 + k * 1.1, 3.9, -14.3); for (const s of [-1, 1]) box(.3, 3, 2.6, mat(0x8a6a4a), 0, g, 6 + s * 4.2, 1.5, -14.4);
  const sgn = textPlane(10, 2.4, 500, 120, (c, w, h) => { c.fillStyle = '#1a1030'; c.beginPath(); c.roundRect(0, 0, w, h, 30); c.fill(); c.shadowColor = '#ff5aa8'; c.shadowBlur = 20; txt(c, 'LINAS PARTY', w / 2, h / 2 + 4, 76, '#ff8ac8'); }, 1.2); sgn.position.set(-6, 4.4, -16.75); g.add(sgn);
  const meter = textPlane(2.2, 7, 66, 210, (c, w, h) => { c.fillStyle = '#ffd21a'; c.fillRect(w * .35, 0, w * .3, h); c.fillStyle = '#1a1a1a'; for (let i = 0; i < 20; i++) c.fillRect(w * .35, i * h / 20, w * (i % 5 ? .1 : .2), 2); }, .2); meter.position.set(-21.7, H / 2, -6); meter.rotation.y = Math.PI / 2; g.add(meter); meter.visible = false;
  const L1 = new THREE.PointLight(0xff8ac8, 60, 30, 1.4); L1.position.set(-8, H - 1, -4); g.add(L1); const L2 = new THREE.PointLight(0x8ac8ff, 60, 30, 1.4); L2.position.set(8, H - 1, 2); g.add(L2); const L3 = new THREE.PointLight(0xfff0d0, 50, 34, 1.4); L3.position.set(0, H - 1, 10); g.add(L3);
  return { g: shade(g), H, LIGHTS, disco, STE, meter }; }
// cocina con trampilla abierta al sótano (x = 0, z = 0), nevera, encimera, ventana
export function kueche(scene, X) { const g = G(scene, X); const wall = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#f4f0e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#e4dcc4'; c.fillRect(0, 0, 32, 32); c.fillRect(32, 32, 32, 32); }, true), 8, 4), roughness: .8 });
  const fl = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#c8905a'; c.fillRect(0, 0, w, h); c.fillStyle = '#b8804a'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 1); }, true), 6, 6), roughness: .7 });
  for (const [x, z, w, d] of [[-11, 0, 14, 30], [11, 0, 14, 30], [0, -10, 8, 10], [0, 10.5, 8, 9]]) box(w, .4, d, fl, 0, g, x, -.2, z); box(40, 16, .4, wall, 0, g, 0, 8, -15); for (const s of [-1, 1]) box(.4, 16, 30, wall, 0, g, s * 20, 8, 0);
  const hatch = G(g, -4, 0, 5); hatch.rotation.x = -1.9; box(8, .3, 6, mat(0x8a6a4a), .05, hatch, 4, 0, -3); for (const s of [-1, 1]) box(.3, .6, 6, mat(0x6a4a2a), 0, g, s * 4, -.3, 2);
  box(14, 4.4, 4, mat(0x5ab8a8, { roughness: .5 }), .1, g, -10, 2.2, -12.8); box(14, .4, 4.2, mat(0xf4f4f4, { roughness: .3 }), .05, g, -10, 4.6, -12.8); box(14, 4, 3, mat(0x5ab8a8), .1, g, -10, 11, -13.4);
  const fr = G(g, 10, 0, -12); box(5, 12, 4.4, mat(0xf4f4f8, { roughness: .3 }), .3, fr, 0, 6, 0); box(.3, 3, .4, mat(0x9aa0aa, { metalness: .8 }), .05, fr, -1.8, 7.6, 2.3);
  const win = textPlane(7, 5, 210, 150, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6ab8f0'); gr.addColorStop(1, '#bfe6ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(w / 2 - 3, 0, 6, h); c.fillRect(0, h / 2 - 3, w, 6); }, .6); win.position.set(-10, 9.5, -14.7); g.add(win);
  for (let k = 0; k < 3; k++) { const p = cyl(.9, .7, 1.4, mat([0xd8323a, 0x3a8ad8, 0xffd23f][k]), 12, g, -15 + k * 2.6, 5.5, -12.6); }
  const L = new THREE.PointLight(0xfff0d0, 90, 50, 1.4); L.position.set(0, 13, 2); g.add(L); return { g: shade(g), hatch }; }
// puerta extra arriba de una fachada (con descansillo y barandilla); y = altura del umbral
export function topDoor(parent, x, y, z, ry = 0, col = 0x2a6a4a) { const g = G(parent, x, y, z); g.rotation.y = ry; box(3.4, 5.4, .3, mat(col, { roughness: .4 }), .06, g, 0, 2.7, 0); sphere(.18, mat(0xd9a531, { metalness: .8 }), g, 1.2, 2.7, .25); box(4.4, .4, 2.6, mat(0xf4f4f4), .05, g, 0, -.2, 1.2); for (let k = 0; k < 7; k++) box(.12, 1.8, .12, mat(0x2a2a2a, { metalness: .6 }), 0, g, -2 + k * .66, .7, 2.4); box(4.4, .14, .14, mat(0x2a2a2a, { metalness: .6 }), 0, g, 0, 1.6, 2.4);
  box(3.9, .4, .5, mat(0xffffff), .05, g, 0, 5.6, .1); const n = textPlane(1.6, .7, 96, 42, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'OBEN', w / 2, h / 2 + 2, 26, '#1a2a4a'); }); n.position.set(0, 6.3, .2); g.add(n); outline(g, 1.2); return shade(g); }
// calcetines desparejados encima de los zapatos
export function socks(ch) { const out = []; [[ch.lL, 0xd8323a, 0xffffff], [ch.lR, 0x3aa04a, 0xffd23f]].forEach(([lg, a, b]) => { const t = canvasTex(32, 32, (c, w, h) => { c.fillStyle = '#' + a.toString(16).padStart(6, '0'); c.fillRect(0, 0, w, h); c.fillStyle = '#' + b.toString(16).padStart(6, '0'); if (a === 0xd8323a) for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 4); else for (let i = 0; i < 6; i++) { c.beginPath(); c.arc((i * 13) % w, (i * 7) % h, 3, 0, 7); c.fill(); } }, true);
  const g = G(lg.shoe); const m = mat(0xffffff, { map: t, roughness: 1 }); box(.86, .62, 1.5, m, .2, g, 0, .1, .2); box(.8, 1.1, .8, m, .2, g, 0, .7, -.05); out.push(g); g.visible = false; }); return out; }
