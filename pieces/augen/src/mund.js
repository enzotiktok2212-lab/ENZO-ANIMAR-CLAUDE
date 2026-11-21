// Augen — el monstruo: altísimo y flaco (≈2,6 veces una persona), negro mate con vetas, brazos larguísimos con dedos de garra,
// y en vez de cara una cabeza abultada cubierta de BOCAS reales (labios carnosos, dientes, lengua) que se abren y cierran como si hablaran.
// Las bocas son 3 InstancedMesh (interior, labio+dientes de arriba, labio+dientes de abajo) en el espacio de la cabeza.
import { THREE, mat, box, cyl, sphere, RNG, lerp, clamp } from './engine.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const SKIN = () => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#121014'; x.fillRect(0, 0, 256, 256); const r = RNG(7);
  for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${40 + r() * 30},${30 + r() * 20},${40 + r() * 30},${.15 + r() * .2})`; x.fillRect(r() * 256, r() * 256, 1 + r() * 3, 4 + r() * 18); }
  for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(90,30,40,${.15 + r() * .2})`; x.lineWidth = 1 + r() * 2; x.beginPath(); let px = r() * 256, py = r() * 256; x.moveTo(px, py); for (let k = 0; k < 5; k++) { px += (r() - .5) * 40; py += r() * 30; x.lineTo(px, py); } x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };

// geometría de una boca (mira a +z, ancho 1): labio de arriba con arco de Cupido + dientes; labio de abajo más grueso + dientes
function colored(g, hex) { g = g.index ? g.toNonIndexed() : g; g.deleteAttribute('uv'); const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) c.toArray(a, i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; }
function lipGeo(top) {   // labio: tubo a lo largo de una curva, grueso en el centro y fino en las comisuras
  const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16 * 2 - 1; const y = top ? (.05 - .045 * Math.cos(u * Math.PI * 1.5) * (1 - Math.abs(u))) : -.03 * (1 - u * u); pts.push(new THREE.Vector3(u * .5, y, .03 * (1 - u * u))); }
  const CV = new THREE.CatmullRomCurve3(pts), tube = new THREE.TubeGeometry(CV, 24, 1, 8, false), p = tube.attributes.position, q = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { const seg = Math.floor(i / 9) / 24, u = seg * 2 - 1, rr = (top ? .06 : .08) * (1 - Math.pow(Math.abs(u), 2)) + .015; const c = CV.getPoint(seg); q.fromBufferAttribute(p, i).sub(c).multiplyScalar(rr); p.setXYZ(i, c.x + q.x, c.y + q.y * (top ? 1 : 1.1), c.z + q.z * 1.3); }
  tube.computeVertexNormals(); return tube; }
function teethGeo(top) { const parts = []; for (let k = 0; k < 8; k++) { const u = -.31 + k * .089, w = k === 3 || k === 4 ? .085 : .075, g = new THREE.BoxGeometry(w, top ? .15 : .13, .06); g.translate(u, top ? -.08 : .07, -.005 + .02 * (1 - Math.abs(u) * 2)); parts.push(g.index ? g.toNonIndexed() : g); } return mergeGeometries(parts); }
const INNER = (() => { const g = new THREE.CircleGeometry(.42, 24); g.scale(1, .55, 1); g.translate(0, 0, -.03); return g; })();   // la abertura oscura (garganta) entre los labios
const PAD = (() => { const g = new THREE.SphereGeometry(.6, 20, 10); g.scale(1, .62, .16); return g; })();   // almohadilla de carne alrededor de la boca
const throatTex = () => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 2, 32, 32, 32); g.addColorStop(0, '#000000'); g.addColorStop(.6, '#1a0206'); g.addColorStop(1, '#5a0e18'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const TONG = (() => { const g = new THREE.SphereGeometry(.24, 12, 8); g.scale(1, .38, .45); g.translate(0, -.05, -.01); return g; })();

export function makeMundMonster(scene, nMouths = 240) {
  const skin = new THREE.MeshStandardMaterial({ color: 0xffffff, map: SKIN(), roughness: .62, metalness: .05 });
  const root = new THREE.Group(); scene.add(root);
  const hips = new THREE.Group(); hips.position.y = 7.4; root.add(hips);
  const spine = new THREE.Group(); hips.add(spine);
  // torso estrecho y largo, costillas marcadas, hombros huesudos
  box(2.2, 5.6, 1.3, skin, .5, spine, 0, 2.8, 0); for (let k = 0; k < 5; k++) box(2.3, .22, 1.36, skin, .1, spine, 0, 2.6 + k * .55, .02);
  box(3.6, 1.1, 1.5, skin, .5, spine, 0, 5.4, 0);
  const neck = new THREE.Group(); neck.position.y = 5.9; spine.add(neck); cyl(.45, .6, 1.6, skin, 10, neck, 0, .7, 0);
  const head = new THREE.Group(); head.position.y = 1.4; neck.add(head);
  // cabeza: masa abultada (esfera deformada) negra
  const hg = new THREE.SphereGeometry(1.9, 40, 28); { const p = hg.attributes.position, r = RNG(3), v = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 1 + .07 * Math.sin(v.x * 3.1 + v.y * 2) * Math.cos(v.z * 2.7) ; v.multiplyScalar(n); v.y *= 1.15; p.setXYZ(i, v.x, v.y + .9, v.z); } hg.computeVertexNormals(); }
  const hm = new THREE.Mesh(hg, skin); head.add(hm);
  // bocas repartidas por la superficie (Fibonacci), sin la parte de abajo (cuello)
  const BASE = [], r = RNG(11); const N = nMouths;
  for (let i = 0; i < N; i++) { const y = 1 - (i + .5) / N * 1.88, rad = Math.sqrt(1 - y * y), th = i * 2.399963; const d = V3(Math.cos(th) * rad, y, Math.sin(th) * rad);
    const pos = d.clone().multiply(V3(1.9, 1.9 * 1.15, 1.9)).multiplyScalar(1.0); pos.y += .9;
    const s = .3 + r() * .22, q = new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), d.clone().normalize()); q.multiply(new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), (r() - .5) * .5));
    BASE.push({ pos: pos.addScaledVector(d, .09), q, s, col: new THREE.Color().setHSL(.98 + r() * .03, .45 + r() * .2, .32 + r() * .14), f: 5 + r() * 7, ph: r() * 100, w: .55 + r() * .45 }); }
  const lipM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .3, metalness: 0 }), thM = new THREE.MeshStandardMaterial({ color: 0xeee6d2, roughness: .35 });
  const inM = new THREE.MeshBasicMaterial({ map: throatTex() }), padM = new THREE.MeshStandardMaterial({ color: 0x2a1216, roughness: .5 }), tgM = new THREE.MeshStandardMaterial({ color: 0xa8303e, roughness: .35 });
  const n = BASE.length, IN = new THREE.InstancedMesh(INNER, inM, n), TG = new THREE.InstancedMesh(TONG, tgM, n), UP = new THREE.InstancedMesh(lipGeo(true), lipM, n), LO = new THREE.InstancedMesh(lipGeo(false), lipM, n), UT = new THREE.InstancedMesh(teethGeo(true), thM, n), LT = new THREE.InstancedMesh(teethGeo(false), thM, n), PD = new THREE.InstancedMesh(PAD, padM, n);
  BASE.forEach((b, i) => { UP.setColorAt(i, b.col); LO.setColorAt(i, b.col); });
  for (const m of [IN, TG, UP, LO, UT, LT, PD]) { m.frustumCulled = false; m.userData.noOutline = true; m.castShadow = false; head.add(m); }
  // brazos larguísimos: hombro -> codo -> muñeca -> 4 dedos-garra de 2 falanges
  const arm = s => { const sh = new THREE.Group(); sh.position.set(s * 1.8, 5.2, 0); spine.add(sh); cyl(.42, .34, 4.6, skin, 8, sh, 0, -2.3, 0); sphere(.5, skin, sh, 0, 0, 0, 10, 8);
    const el = new THREE.Group(); el.position.y = -4.6; sh.add(el); sphere(.4, skin, el, 0, 0, 0, 8, 6); cyl(.34, .26, 4.4, skin, 8, el, 0, -2.2, 0);
    const hand = new THREE.Group(); hand.position.y = -4.4; el.add(hand); box(.9, .9, .45, skin, .2, hand, 0, -.4, 0); const F = [];
    for (let k = 0; k < 4; k++) { const f1 = new THREE.Group(); f1.position.set(-.33 + k * .22, -.8, 0); hand.add(f1); cyl(.09, .08, 1.3, skin, 6, f1, 0, -.65, 0); const f2 = new THREE.Group(); f2.position.y = -1.3; f1.add(f2); cyl(.08, .02, 1.2, skin, 6, f2, 0, -.6, 0); F.push([f1, f2]); }
    return { sh, el, hand, F }; };
  const leg = s => { const hp = new THREE.Group(); hp.position.set(s * .7, 0, 0); hips.add(hp); cyl(.5, .4, 3.8, skin, 8, hp, 0, -1.9, 0); const kn = new THREE.Group(); kn.position.y = -3.8; hp.add(kn); sphere(.42, skin, kn, 0, 0, 0, 8, 6); cyl(.4, .3, 3.5, skin, 8, kn, 0, -1.75, 0); box(.9, .35, 1.6, skin, .15, kn, 0, -3.5, .45); return { hp, kn }; };
  const aL = arm(-1), aR = arm(1), lL = leg(-1), lR = leg(1);
  root.traverse(o => { if (o.isMesh && !o.isInstancedMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const M = { root, hips, spine, neck, head, aL, aR, lL, lR, BASE, IN, TG, UP, LO, UT, LT, PD };
  const TR = new THREE.Matrix4(), m4 = new THREE.Matrix4(), t4 = new THREE.Matrix4(), sc = new THREE.Vector3();
  // bocas: T tiempo; talk 0..1 (cuánto hablan); open extra (0..1, todas abiertas); focus: Vector3 (en espacio de cabeza) hacia el que giran
  M.mouths = (T, talk = 1, wide = 0, focus = null) => { for (let i = 0; i < n; i++) { const b = BASE[i];
      const sy = Math.max(0, Math.sin(T * b.f + b.ph)) * .7 + Math.max(0, Math.sin(T * b.f * 1.7 + b.ph * 2)) * .3; let o = lerp(.32, .3 + sy * .6 * b.w, talk); o = lerp(o, .85, wide);
      let q = b.q; if (focus) { const d = focus.clone().sub(b.pos).normalize(); const qq = new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), d); q = b.q.clone().slerp(qq, .45); }
      m4.compose(b.pos, q, sc.setScalar(b.s));
      const up = t4.copy(m4).multiply(TR.makeTranslation(0, o * .42, 0)); UP.setMatrixAt(i, up); UT.setMatrixAt(i, up); const lo = t4.copy(m4).multiply(TR.makeTranslation(0, -o * .42, 0)); LO.setMatrixAt(i, lo); LT.setMatrixAt(i, lo);
      IN.setMatrixAt(i, t4.copy(m4).multiply(TR.makeScale(1, .3 + o * 1.9, 1))); TG.setMatrixAt(i, t4.copy(m4).multiply(TR.makeTranslation(0, -o * .2, .01))); PD.setMatrixAt(i, t4.copy(m4).multiply(TR.makeTranslation(0, 0, -.12))); }
    for (const m of [IN, TG, UP, LO, UT, LT, PD]) m.instanceMatrix.needsUpdate = true; };
  M.mouths(0); return M; }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// poses: lean (inclinación hacia delante), duck (agacharse bajo una puerta), headX/Y/Z, brazos (x adelante, z abierto, e codo), piernas, curl (dedos)
export const MP = {
  stand: { lean: .12, headX: .15, aLx: .1, aRx: .1, aLz: .12, aRz: .12, aLe: .15, aRe: .15, curl: .4 },
  stalk: { lean: .35, headX: .2, aLx: .5, aRx: .3, aLe: .5, aRe: .7, aLz: .15, aRz: .1, curl: .6 },
  duck: { lean: .9, crouch: .35, headX: .5, aLx: .9, aRx: .7, aLe: .4, aRe: .6, curl: .5 },
  reach: { lean: .4, headX: .3, aRx: 1.35, aRe: .25, aRz: -.05, aLx: .2, aLe: .3, curl: .15 },
  loom: { lean: .55, headX: .55, aLx: 1.1, aRx: 1.1, aLe: .5, aRe: .5, aLz: .25, aRz: .25, curl: .3 },
  sit: { sit: 1, lean: .1, headX: .1, aLx: .6, aRx: .6, aLe: .9, aRe: .9, curl: .6 },
};
export const mixMP = (a, b, k) => { const o = {}; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) o[key] = lerp(a[key] ?? 0, b[key] ?? 0, k); return o; };
export function poseMund(M, p, T = 0) { const g = k => p[k] ?? 0, br = Math.sin(T * 1.3) * .03;
  M.hips.position.y = 7.4 - g('crouch') * 3 - g('sit') * 3.2; M.spine.rotation.x = g('lean') + br; M.spine.rotation.y = g('twist');
  M.neck.rotation.x = g('headX') - g('lean') * .55; M.neck.rotation.y = g('headY'); M.neck.rotation.z = g('headZ') + Math.sin(T * .7) * .05;
  for (const [a, s] of [[M.aL, -1], [M.aR, 1]]) { const L = s < 0 ? 'L' : 'R'; a.sh.rotation.x = -g('a' + L + 'x'); a.sh.rotation.z = s * g('a' + L + 'z'); a.el.rotation.x = -g('a' + L + 'e');
    a.F.forEach(([f1, f2], k) => { f1.rotation.x = -g('curl') * .8 - Math.sin(T * 2 + k) * .06; f2.rotation.x = -g('curl') * 1.1; f1.rotation.z = (k - 1.5) * .12; }); }
  const sit = g('sit'), cr = g('crouch'); for (const [l, s] of [[M.lL, -1], [M.lR, 1]]) { l.hp.rotation.x = -sit * 1.5 - cr * .9 - g('l' + (s < 0 ? 'L' : 'R') + 'x'); l.kn.rotation.x = sit * 1.5 + cr * 1.6 + g('l' + (s < 0 ? 'L' : 'R') + 'k'); } }
