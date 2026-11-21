// Dunkel — el monstruo, metálico y feo (como el del vídeo de referencia, pedido del usuario): cabeza cúbica de chapa blanca remachada y
// manchada de óxido, dos ojos negros ovalados que chorrean, boca redonda enorme con un anillo de dientes cuadrados, pinchos largos que
// salen de la nuca y la espalda, tronco estrecho de placas, brazos larguísimos con dedos-cuchilla negros y patas muy finas de acero.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG, clamp, lerp } from './engine.js';

export const SC = 1.4;
const plateTex = () => canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#a9a7a2'; c.fillRect(0, 0, w, h); const r = RNG(21);
  for (let i = 0; i < 1600; i++) { c.fillStyle = `rgba(${r() < .5 ? '255,255,255' : '40,36,32'},${r() * .06})`; c.fillRect(r() * w, r() * h, 4 + r() * 10, 2 + r() * 5); }
  c.strokeStyle = 'rgba(60,56,52,.55)'; c.lineWidth = 3; for (let x = 0; x <= w; x += 128) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y <= h; y += 128) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  c.fillStyle = 'rgba(70,64,58,.7)'; for (let x = 10; x < w; x += 128) for (let y = 10; y < h; y += 32) { c.beginPath(); c.arc(x, y, 3.2, 0, 7); c.fill(); c.beginPath(); c.arc(x + 108, y, 3.2, 0, 7); c.fill(); }
  for (let k = 0; k < 10; k++) { c.fillStyle = 'rgba(20,14,10,.35)'; c.beginPath(); c.ellipse(r() * w, r() * h, 20 + r() * 40, 10 + r() * 30, r() * 3, 0, 7); c.fill(); }
  for (let k = 0; k < 26; k++) { const x = r() * w, y = r() * h, g = c.createLinearGradient(x, y, x, y + 90 + r() * 120); g.addColorStop(0, 'rgba(140,70,30,.55)'); g.addColorStop(1, 'rgba(140,70,30,0)'); c.fillStyle = g; c.fillRect(x - 5 - r() * 8, y, 8 + r() * 14, 200); } }, true);
const steelTex = () => canvasTex(128, 512, (c, w, h) => { c.fillStyle = '#3a3a40'; c.fillRect(0, 0, w, h); const r = RNG(5); for (let i = 0; i < 500; i++) { c.fillStyle = `rgba(255,255,255,${r() * .08})`; c.fillRect(r() * w, r() * h, 1 + r() * 2, 10 + r() * 40); }
  c.fillStyle = 'rgba(150,80,40,.35)'; for (let k = 0; k < 8; k++) c.fillRect(r() * w, r() * h, 6, 30 + r() * 60); }, true);

export function makeMonster(scene) {
  const PL = mat(0xffffff, { map: plateTex(), roughness: .42, metalness: .65 }), ST = mat(0xffffff, { map: steelTex(), roughness: .32, metalness: .8 });
  const BL = mat(0x08080a, { roughness: .25, metalness: .3 }), TO = mat(0xf2efe6, { roughness: .3, metalness: .2 }), SP = mat(0xbcb8b2, { roughness: .3, metalness: .85 });
  const eyeM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff8e8, emissiveIntensity: 0, roughness: .2 });
  const spike = (p, x, y, z, len, rx, rz, r = .5) => { const c = new THREE.Mesh(new THREE.ConeGeometry(r, len, 5), SP); c.geometry.translate(0, len / 2, 0); c.position.set(x, y, z); c.rotation.set(rx, 0, rz); p.add(c); return c; };
  const root = new THREE.Group(); scene.add(root);
  const hips = new THREE.Group(); hips.position.y = 15.5; root.add(hips); root.scale.setScalar(SC); box(7, 3.0, 4.4, ST, .4, hips, 0, 0, 0);
  // patas finísimas de acero con rodilla y pie de garra
  const leg = s => { const hp = new THREE.Group(); hp.position.set(s * 2.6, -.4, 0); hips.add(hp); box(2.2, 8.2, 2.2, ST, .3, hp, 0, -4.0, 0); box(2.8, 3.2, 2.6, PL, .3, hp, 0, -1.8, .3); box(.4, 5, .4, BL, .1, hp, 1.2, -4, 1.0);
    const kn = new THREE.Group(); kn.position.y = -8.1; hp.add(kn); sphere(1.6, PL, kn, 0, 0, 0, 10, 8); box(1.8, 7.4, 1.8, ST, .25, kn, 0, -3.7, 0); spike(kn, 0, .4, .9, 3, .9, 0, .45);
    const ft = new THREE.Group(); ft.position.y = -7.3; kn.add(ft); box(3.6, 1.0, 2.6, PL, .3, ft, 0, 0, .4); for (const t of [-1.2, 0, 1.2]) { const c = box(.6, .6, 3.6, BL, .15, ft, t, -.1, 2.4); c.rotation.y = t * .3; }
    return { hp, kn, ft }; };
  const lL = leg(-1), lR = leg(1);
  // tronco estrecho de placas con costillas negras
  const spine = new THREE.Group(); spine.position.y = .8; hips.add(spine);
  box(5.6, 4.6, 4.0, ST, .4, spine, 0, 2.2, 0); for (let k = 0; k < 4; k++) box(6.4, .5, 4.6, BL, .1, spine, 0, 1.0 + k, 0);
  box(9.6, 6.2, 5.6, PL, .6, spine, 0, 6.8, 0); box(10.4, 1.0, 6.0, BL, .2, spine, 0, 4.2, 0); for (const s of [-1, 1]) box(3.4, 3.4, 4.6, PL, .5, spine, s * 4.6, 9.2, -.3);
  for (let k = 0; k < 14; k++) { const r = RNG(k + 9); spike(spine, (r() - .5) * 8, 4 + r() * 6, -2.6, 4 + r() * 5, -1.0 - r() * .5, (r() - .5) * 1.4, .55); }
  // cuello y cabeza cúbica
  const neck = new THREE.Group(); neck.position.set(0, 9.6, 1.4); spine.add(neck); box(2.6, 2.4, 2.6, ST, .3, neck, 0, 1.0, 0); for (let k = 0; k < 4; k++) cyl(.18, .18, 3, BL, 6, neck, -1 + k * .66, 1, 1.4);
  const head = new THREE.Group(); head.position.set(0, 2.0, .3); neck.add(head);
  box(7.2, 7.6, 6.2, PL, .55, head, 0, 3.4, 0); box(7.6, 1.0, 6.6, BL, .2, head, 0, 6.2, 0);
  // ojos: óvalos negros con chorretones
  const eyes = []; for (const s of [-1, 1]) { const e = cyl(1.15, 1.15, .2, BL, 24, head, s * 1.8, 5.2, 3.1); e.rotation.x = Math.PI / 2; e.scale.set(.9, 1, 1.35);
    for (const [dx, l] of [[-.4, 1.8], [.3, 2.8], [.7, 1.2]]) box(.28, l, .12, BL, .05, head, s * 1.8 + dx, 5.2 - 1.2 - l / 2, 3.13);
    const p = sphere(.24, eyeM, head, s * 1.8, 5.3, 3.25, 8, 6); eyes.push(p); }
  // boca redonda con anillo de dientes cuadrados (la mandíbula es el disco inferior que se abre)
  const mouth = cyl(2.7, 2.7, .22, BL, 32, head, 0, 2.0, 3.08); mouth.rotation.x = Math.PI / 2;
  const ring = new THREE.Group(); ring.position.set(0, 2.0, 3.22); head.add(ring);
  for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; const t = box(.55, .85, .3, TO, .05, ring, Math.cos(a) * 2.2, Math.sin(a) * 2.2, 0); t.rotation.z = a + Math.PI / 2; }
  const jaw = new THREE.Group(); jaw.position.set(0, 1.0, 0); head.add(jaw); box(6.8, 1.0, 5.6, PL, .3, jaw, 0, -.5, .3);
  // pinchos de la nuca (los grandes) y del cráneo
  spike(head, -2.4, 6.6, -1.6, 10, -.6, .55, .7); spike(head, 2.4, 6.6, -1.6, 11, -.5, -.5, .7); spike(head, 0, 6.8, -2.4, 9, -.9, 0, .65); spike(head, -3.4, 4.4, -2, 7, -1.2, 1.1, .55); spike(head, 3.4, 4.0, -2, 8, -1.1, -1.2, .55); spike(head, -1.2, 7, 1, 5, .3, .4, .4); spike(head, 1.4, 7, .6, 6, .1, -.5, .45);
  // brazos larguísimos con codo, muñeca y cuatro dedos-cuchilla negros
  const arm = s => { const sh = new THREE.Group(); sh.position.set(s * 6.2, 9.0, 0); spine.add(sh); sphere(2.2, PL, sh, 0, 0, 0, 12, 8); spike(sh, s * .6, 1.2, -.3, 5, -.3, -s * .7, .6); spike(sh, s * 1.2, .4, .6, 4, .3, -s * 1.2, .5);
    box(2.0, 9.4, 2.0, ST, .3, sh, 0, -4.8, 0); box(2.6, 3.6, 2.4, PL, .3, sh, 0, -2.4, 0); const el = new THREE.Group(); el.position.y = -9.6; sh.add(el); sphere(1.4, PL, el, 0, 0, 0, 10, 8); spike(el, 0, 0, -1, 3.4, -1.9, 0, .45);
    box(1.7, 8.6, 1.7, ST, .25, el, 0, -4.3, 0); box(2.4, 3.2, 2.2, PL, .3, el, 0, -6.6, 0);
    const hand = new THREE.Group(); hand.position.y = -8.7; el.add(hand); box(3.0, 1.6, 1.8, PL, .3, hand, 0, -.4, 0);
    const claws = []; for (let k = 0; k < 4; k++) { const f = new THREE.Group(); f.position.set(-1.1 + k * .73, -1.2, 0); hand.add(f); const b = box(.4, 6.4, .8, BL, .08, f, 0, -3.2, 0); b.rotation.z = (k - 1.5) * .06; claws.push(f); }
    return { sh, el, hand, claws }; };
  const aL = arm(-1), aR = arm(1);
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const M = { root, hips, spine, neck, head, jaw, ring, aL, aR, lL, lR, eyes, eyeM };
  M.glow = v => { eyeM.emissiveIntensity = v; };
  return M;
}
// pose (radianes): lean, twist, headX/Y/Z, jaw (abre la boca), a?x (adelante), a?z (afuera), a?e (codo), claw?, l?x/l?k, crouch
const P0 = { lean: .22, twist: 0, headX: .08, headY: 0, headZ: 0, jaw: 0, aLx: .1, aLz: .28, aLe: .25, aRx: .1, aRz: .28, aRe: .25, clawL: .1, clawR: .1, lLx: 0, lLk: 0, lRx: 0, lRk: 0, crouch: 0 };
export function poseMonster(M, p = {}) { p = { ...P0, ...p };
  M.hips.position.y = 15.5 - p.crouch; M.spine.rotation.set(p.lean, p.twist, 0); M.neck.rotation.set(p.headX * .4, p.headY * .4, p.headZ * .4); M.head.rotation.set(p.headX * .6, p.headY * .6, p.headZ * .6);
  M.jaw.position.y = 1.0 - p.jaw * .9; M.ring.scale.setScalar(1 + p.jaw * .18);
  M.aL.sh.rotation.set(-p.aLx, 0, -p.aLz); M.aL.el.rotation.x = -p.aLe; M.aR.sh.rotation.set(-p.aRx, 0, p.aRz); M.aR.el.rotation.x = -p.aRe;
  for (const [a, c] of [[M.aL, p.clawL], [M.aR, p.clawR]]) a.claws.forEach(f => { f.rotation.x = c * 1.2; });
  M.lL.hp.rotation.x = -p.lLx; M.lL.kn.rotation.x = p.lLk; M.lR.hp.rotation.x = -p.lRx; M.lR.kn.rotation.x = p.lRk; return p; }
export const MPOSE = {
  stand: {},
  frozen: { lean: .3, headX: .2, headY: .25, aLx: .6, aLz: .45, aLe: .8, aRx: 1.0, aRz: .2, aRe: .45, clawL: .1, clawR: .05, lLx: .35, lLk: .3, lRx: -.25 },
  rise: { lean: .5, headX: -.25, aLx: 1.2, aLz: 1.0, aLe: .2, aRx: 1.2, aRz: 1.0, aRe: .2, clawL: 0, clawR: 0, crouch: 6, lLx: 1.0, lLk: 1.8, lRx: 1.0, lRk: 1.8, jaw: .8 },
  lunge: { lean: .45, headX: -.1, headY: -.15, aLx: 1.3, aLz: .3, aLe: .5, aRx: .5, aRz: .55, aRe: .9, clawL: .1, clawR: .4, lLx: .6, lLk: .55, lRx: -.4, lRk: .2, crouch: 1.5 },
  scream: { lean: -.25, headX: -.55, jaw: 1.0, aLx: .4, aLz: 1.25, aLe: .6, aRx: .4, aRz: 1.25, aRe: .6, clawL: 0, clawR: 0 },
  grab: { lean: .35, headX: .4, headY: .05, aRx: 1.35, aRz: .12, aRe: 1.1, clawR: .9, aLx: .35, aLz: .5, aLe: .7, clawL: .15, lLx: .25, lLk: .3, lRx: -.15, crouch: 1.0 },
};
export const mixM = (a, b, k) => { const o = {}; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) o[key] = lerp(a[key] ?? P0[key], b[key] ?? P0[key], clamp(k)); return o; };
export const palm = (M, r = true) => { M.root.updateMatrixWorld(true); return (r ? M.aR : M.aL).hand.localToWorld(new THREE.Vector3(0, -3.0, .9)); };
// contorno negro (casco invertido): para que personajes y monstruo se recorten nítidos contra el fondo
const OUT = new Map();
export function outline(root, w = .06, col = 0x000000) { const key = w + ':' + col; let m = OUT.get(key);
  if (!m) { m = new THREE.MeshBasicMaterial({ color: col, side: THREE.BackSide, fog: false }); m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\n transformed += normalize(normal) * ${w.toFixed(3)};`); }; OUT.set(key, m); }
  const L = []; root.traverse(o => { if (o.isMesh && !o.userData.noOutline && o.material && !o.material.transparent && o.geometry.type !== 'PlaneGeometry' && o.geometry.type !== 'CircleGeometry') L.push(o); });
  for (const o of L) { const h = new THREE.Mesh(o.geometry, m); h.userData.noOutline = true; h.castShadow = false; h.receiveShadow = false; o.add(h); } return root; }
