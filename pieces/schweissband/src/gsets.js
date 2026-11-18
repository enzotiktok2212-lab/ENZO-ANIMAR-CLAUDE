// GOON — escenarios y atrezo propios: Goon-Knast (fuera y celda), Apotheke, Drogerie con Tresor, sótano del Rathaus con la montaña
// de cajas de pañuelos, puente y Bahnhof, carrito de currywurst, coche de policía, dron, perro policía, contenedores, número sobre la cabeza.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp } from './engine.js';
import { noiseTex, stripes, txt, tree, lamp, bench } from './props.js';
import { FONT } from './sets.js';
import { signBoard, bunting } from './wsets.js';
import { townhouse } from './gort.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const basic = (r, g, b, o = {}) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), toneMapped: false, ...o });
const glow = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const plane = (w, h, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const glassM = () => mat(0xbfe6ff, { roughness: .05, metalness: .3, transparent: true, opacity: .35, depthWrite: false });
function room(parent, X, w, d, h, wall, floor, ceil = 0xf4f0e8) { const g = G(parent, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil), 0, g, 0, h, 0); return g; }
const concreteT = (a = '#a8acb4') => noiseTex(a, ['#9aa0a8', '#b4b8c0', '#8e9298'], 1600, 3, 1);
const tileT = (a, b, n = 8) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * w / n, 0); c.lineTo(i * w / n, h); c.moveTo(0, i * h / n); c.lineTo(w, i * h / n); c.stroke(); } }, true);
const plankT = (hue = 28) => canvasTex(128, 128, (c, w, h) => { const r = RNG(4); for (let y = 0; y < h; y += 16) { c.fillStyle = `hsl(${hue},${40 + r() * 10}%,${42 + r() * 8}%)`; c.fillRect(0, y, w, 16); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y, w, 2); c.fillRect((r() * w) | 0, y, 2, 16); } }, true);

// ---------- número sobre la cabeza (sprite): verde orgulloso para el 0, rojo para el resto ----------
const NT = {};
export function numTex(n, kind) { const k = n + ':' + kind; if (NT[k]) return NT[k]; const c = document.createElement('canvas'); const L = String(n).length; c.width = L > 2 ? 512 : 256; c.height = 200; const x = c.getContext('2d');
  const col = kind === 'zero' ? ['#5aff9a', '#0a8a3a'] : kind === 'gold' ? ['#fff2a0', '#d8a020'] : ['#ff7a6a', '#c8102a'];
  const cx = c.width / 2; x.shadowColor = col[0]; x.shadowBlur = 26; x.font = `700 ${L > 3 ? 150 : 170}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round'; x.lineWidth = 22; x.strokeStyle = '#10121e'; x.strokeText(String(n), cx, 108);
  const g = x.createLinearGradient(0, 30, 0, 180); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]); x.fillStyle = g; x.shadowBlur = 0; x.fillText(String(n), cx, 108);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; NT[k] = t; return t; }
export function numSprite() { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: numTex(0, 'zero'), transparent: true, depthWrite: false, toneMapped: false })); s.scale.set(2.2, 1.72, 1); s.renderOrder = 3; s.visible = false; return s; }

// ---------- pañuelos: caja, bola de papel ----------
export function tissueBox(parent, s = 1, col = 0x3a8ad8) { const g = G(parent); g.scale.setScalar(s); box(2.2, 1.2, 1.2, mat(col, { roughness: .6 }), .08, g, 0, .6, 0); box(2.24, .3, 1.24, mat(0xffffff), .04, g, 0, .9, 0);
  box(1.2, .06, .4, mat(0x1a2a4a), .02, g, 0, 1.22, 0); const t = new THREE.Mesh(new THREE.ConeGeometry(.35, .8, 6), mat(0xffffff, { roughness: 1 })); t.position.set(0, 1.55, 0); t.rotation.z = .2; g.add(t);
  const lb = textPlane(1.6, .5, 128, 40, (c, w, h) => { txt(c, 'SOFT', w / 2, h / 2 + 2, 30, '#ffffff'); }); lb.position.set(0, .45, .61); g.add(lb); return g; }
export function tissueBall(parent, s = 1) { const m = sphere(.35 * s, mat(0xf8f8fc, { roughness: 1, flatShading: true }), parent, 0, 0, 0, 6, 5); return m; }
// montaña de cajas instanciadas (para el sótano y la avalancha)
export function boxPile(parent, n = 420, seed = 3) { const geo = new THREE.BoxGeometry(2.2, 1.2, 1.2); const im = new THREE.InstancedMesh(geo, mat(0xffffff, { roughness: .6 }), n); const r = RNG(seed), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), S = new THREE.Vector3(1, 1, 1), C = new THREE.Color();
  const home = []; for (let i = 0; i < n; i++) { const ang = r() * 6.283, rad = Math.sqrt(r()) * 13, hgt = Math.max(0, 15 - rad * 1.05) * r() + .6; home.push({ x: Math.cos(ang) * rad, y: hgt, z: Math.sin(ang) * rad * .7, rx: r() * .8, ry: r() * 6.28, rz: r() * .8 }); im.setColorAt(i, C.setHex([0x3a8ad8, 0xf4f4f8, 0x6ab8f0, 0xffffff, 0x2a6ac8][i % 5])); }
  im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; parent.add(im);
  const set = (fall = 0, T = 0) => { home.forEach((h, i) => { const rr = RNG(i + 9), d = clamp(fall * 1.4 - rr() * .4); const y = lerp(h.y, .6 + rr() * 1.4, d * d), x = h.x + (rr() - .5) * 10 * d, z = h.z + (rr() + .2) * 9 * d;
    Q.setFromEuler(E.set(h.rx + d * 3 * rr(), h.ry, h.rz + d * 2)); M.compose(P.set(x, y, z), Q, S); im.setMatrixAt(i, M); }); im.instanceMatrix.needsUpdate = true; };
  set(0); return { im, set }; }

// ---------- contenedores alemanes (gris, azul, amarillo, marrón) rebosando de pañuelos ----------
export function bins(parent, x, z, ry = 0, full = true) { const g = G(parent, x, 0, z); g.rotation.y = ry; [0x4a4e58, 0x2a6ad8, 0xf2c23a, 0x7a5232].forEach((col, i) => { const b = G(g, (i - 1.5) * 2.6, 0, 0);
    box(2.3, 3.6, 2.4, mat(col, { roughness: .5 }), .15, b, 0, 1.8, 0); const lid = box(2.4, .3, 2.6, mat(col, { roughness: .45 }), .1, b, 0, 3.8, -.1); lid.rotation.x = full ? -.5 : 0; lid.position.z = full ? -.6 : -.1; lid.position.y = full ? 4.2 : 3.75;
    for (const s of [-1, 1]) { const w = cyl(.35, .35, .3, mat(0x1a1a1a), 12, b, s * .9, .35, -1.1); w.rotation.z = Math.PI / 2; }
    if (full) for (let k = 0; k < 9; k++) { const t = tissueBall(b, 1.2); t.position.set(-.7 + (k % 3) * .7, 3.9 + Math.floor(k / 3) * .35, -.6 + (k % 2) * .6); } }); return shade(g); }

// ---------- coche de policía alemán (blanco y azul) con luces que giran ----------
export function polizei(parent) { const g = G(parent); const wh = mat(0xf2f4f6, { roughness: .3, metalness: .3 }), bl = mat(0x1a4aa8, { roughness: .35 }), dk = mat(0x1a1e26, { roughness: .1, metalness: .6 });
  box(4.4, 1.5, 9.4, wh, .45, g, 0, 1.45, 0); box(4.46, .5, 9.46, bl, .1, g, 0, 1.55, 0); box(3.9, 1.3, 4.8, dk, .45, g, 0, 2.75, -.5); box(4.0, .2, 4.9, wh, .1, g, 0, 3.4, -.5);
  for (const s of [-1, 1]) { const t = textPlane(4, .7, 320, 56, (c, w, h) => { txt(c, 'POLIZEI', w / 2, h / 2 + 2, 46, '#1a4aa8'); }); t.position.set(s * 2.24, 2.05, 0); t.rotation.y = s * Math.PI / 2; g.add(t); }
  const sirB = new THREE.MeshStandardMaterial({ color: 0x3a6aff, emissive: 0x2a5aff, emissiveIntensity: 3, toneMapped: false }), sirB2 = sirB.clone();
  box(3, .35, .8, mat(0x2a2a30), .1, g, 0, 3.6, -.6); box(1.2, .4, .7, sirB, .15, g, -.75, 3.85, -.6); box(1.2, .4, .7, sirB2, .15, g, .75, 3.85, -.6);
  for (const z of [-3, 3]) for (const s of [-1, 1]) { const w = cyl(.85, .85, .6, mat(0x111114), 16, g, s * 2.1, .85, z); w.rotation.z = Math.PI / 2; const hub = cyl(.45, .45, .64, mat(0xc0c4cc, { metalness: .9 }), 10, g, s * 2.1, .85, z); hub.rotation.z = Math.PI / 2; }
  const head = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4d8, emissiveIntensity: 4, toneMapped: false }); for (const s of [-1, 1]) { box(1.0, .45, .2, head, .1, g, s * 1.5, 1.7, 4.72); sphere(.25, glow(0xff2a2a, 2), g, s * 1.6, 1.8, -4.7, 8, 6); }
  shade(g); g.userData.set = (T = 0) => { const ph = Math.floor(T * 6) % 2; sirB.emissiveIntensity = ph ? 5 : .3; sirB2.emissiveIntensity = ph ? .3 : 5; }; return g; }
// flota de coches instanciada (20 coches): un mesh por pieza
export function fleet(scene, n = 20) { const t = polizei(null); t.updateMatrixWorld(true); const parts = [], g = G(scene); t.traverse(o => { if (!o.isMesh) return; const im = new THREE.InstancedMesh(o.geometry, o.material, n); im.castShadow = true; im.frustumCulled = false; g.add(im); parts.push([im, o.matrixWorld.clone()]); });
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), S = new THREE.Vector3(1, 1, 1);
  return { g, set(i, x, z, ry) { Q.setFromEuler(E.set(0, ry, 0)); M.compose(P.set(x, 0, z), Q, S); for (const [im, loc] of parts) im.setMatrixAt(i, new THREE.Matrix4().multiplyMatrices(M, loc)); }, show(k, T = 0) { for (const [im] of parts) { im.count = k; im.instanceMatrix.needsUpdate = true; } g.visible = k > 0; t.userData.set(T); } }; }

// ---------- dron de la policía con foco de escaneo ----------
export function polDrone(parent) { const g = G(parent); const k = mat(0x1a2a4a, { metalness: .5, roughness: .35 }), w = mat(0xf2f4f6, { roughness: .3 });
  box(2.6, .7, 2.6, w, .3, g, 0, 0, 0); box(2.66, .25, 2.66, mat(0x1a4aa8), .05, g, 0, -.05, 0); const cam_ = sphere(.45, mat(0x101014, { metalness: .8, roughness: .1 }), g, 0, -.55, .6, 12, 8);
  const props = []; for (const [x, z] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) { const a = box(2.4, .2, .3, k, .05, g, x / 2, .1, z / 2); a.rotation.y = Math.atan2(z, x) + Math.PI / 2; cyl(.25, .25, .5, k, 10, g, x, .25, z); const p = G(g, x, .55, z); box(2.6, .04, .3, mat(0x2a2a30), .02, p, 0, 0, 0); box(.3, .04, 2.6, mat(0x2a2a30), .02, p, 0, 0, 0); props.push(p); }
  const lt = textPlane(2.2, .5, 176, 40, (c, ww, hh) => { txt(c, 'POLIZEI', ww / 2, hh / 2 + 2, 32, '#1a4aa8'); }); lt.position.set(0, .05, 1.34); g.add(lt);
  const sir = sphere(.25, glow(0x3a6aff, 3), g, 0, .45, 0, 10, 8);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(4.5, 14, 28, 1, true), new THREE.MeshBasicMaterial({ color: 0x8ae8ff, transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false }));
  cone.position.y = -7.4; g.add(cone); const ring = new THREE.Mesh(new THREE.RingGeometry(3.8, 4.5, 40), new THREE.MeshBasicMaterial({ color: 0x8ae8ff, transparent: true, opacity: .55, side: THREE.DoubleSide, toneMapped: false, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = -14.3; g.add(ring);
  shade(g); g.userData = { props, cone, ring, sir, spin(T) { props.forEach((p, i) => p.rotation.y = T * 40 + i); sir.material.emissiveIntensity = Math.floor(T * 5) % 2 ? 4 : .4; }, beam(on, len = 14) { cone.visible = ring.visible = on; cone.scale.set(1, len / 14, 1); cone.position.y = -len / 2 - .4; ring.position.y = -len - .3; } }; return g; }

// ---------- perro policía (pastor alemán con chaleco) ----------
export function polDog(scene) { const g = G(scene); const f = mat(0x8a5a2a, { roughness: .9 }), d = mat(0x2a1a10, { roughness: .9 });
  box(1.4, 1.2, 2.8, f, .4, g, 0, 1.7, 0); box(1.44, .7, 1.6, d, .3, g, 0, 2.1, -.2); box(1.5, .9, 1.4, mat(0x1a4aa8), .1, g, 0, 1.9, .3); const vt = textPlane(1.2, .4, 96, 32, (c, w, h) => { txt(c, 'POLIZEI', w / 2, h / 2 + 1, 22, '#ffffff'); }); vt.position.set(.76, 1.9, .3); vt.rotation.y = Math.PI / 2; g.add(vt);
  const head = G(g, 0, 2.6, 1.5); box(1.1, 1.0, 1.1, f, .35, head, 0, 0, 0); box(.6, .5, .8, d, .2, head, 0, -.2, .8); sphere(.16, mat(0x111111), head, 0, -.05, 1.22);
  for (const s of [-1, 1]) { sphere(.12, mat(0x111111), head, s * .3, .2, .56); const e = new THREE.Mesh(new THREE.ConeGeometry(.28, .7, 4), d); e.position.set(s * .38, .75, -.1); head.add(e); }
  const legs = []; for (const [x, z] of [[-.45, 1], [.45, 1], [-.45, -1], [.45, -1]]) { const l = G(g, x, 1.2, z); box(.36, 1.2, .36, f, .12, l, 0, -.6, 0); legs.push(l); }
  const tail = G(g, 0, 2.1, -1.4); box(.25, .25, 1.3, d, .1, tail, 0, .2, -.5).rotation.x = .4; shade(g);
  return { root: g, head, legs, tail, pose(T, o = {}) { const w = o.walk ? Math.sin(T * 12) : 0; legs.forEach((l, i) => l.rotation.x = w * .6 * (i % 2 ? 1 : -1) * (i < 2 ? 1 : -1)); tail.rotation.y = Math.sin(T * 10) * .5; head.rotation.x = o.sniff ? .55 + Math.sin(T * 14) * .08 : 0; head.rotation.y = o.sniff ? Math.sin(T * 3) * .4 : 0; } }; }

// ---------- carrito de currywurst (furgoneta de comida) con letrero que cambia ----------
export function wurstWagen(parent) { const g = G(parent); const wh = mat(0xf4f0e8, { roughness: .4, metalness: .1 }), rd = mat(0xd8282a, { roughness: .35 }), yl = mat(0xf2c23a, { roughness: .4 });
  box(5.4, 5.6, 12, wh, .5, g, 0, 3.6, 0); box(5.46, 1.2, 12.06, rd, .1, g, 0, 1.4, 0); box(5.2, 2.6, 3.6, wh, .4, g, 0, 2.6, 7.2); box(5.0, 1.6, .2, mat(0x1a2a3a, { roughness: .05, metalness: .5 }), .05, g, 0, 3.4, 9.0);
  for (const z of [-3.4, 3.4, 7.2]) for (const s of [-1, 1]) { const w = cyl(1.0, 1.0, .7, mat(0x111114), 16, g, s * 2.5, 1.0, z); w.rotation.z = Math.PI / 2; const hub = cyl(.5, .5, .74, mat(0xc0c4cc, { metalness: .9 }), 10, g, s * 2.5, 1.0, z); hub.rotation.z = Math.PI / 2; }
  // ventana de venta (lado derecho, +x) con toldo y mostrador
  box(.2, 2.6, 6.4, mat(0x2a1a14), .05, g, 2.72, 4.4, -.6); const aw = box(1.8, .15, 7, mat(0xffffff, { map: stripes('#d8282a', '#ffffff', 10) }), .05, g, 3.5, 6.1, -.6); aw.rotation.z = -.35; box(1.2, .2, 6.4, wh, .05, g, 3.2, 3.1, -.6);
  const IN = new THREE.PointLight(0xffd8a0, 50, 12, 1.5); IN.position.set(1.6, 4.6, -.6); g.add(IN);
  // la currywurst gigante del techo
  const cw = G(g, 0, 7.1, -.8); const w1 = cyl(.8, .8, 6, mat(0xb8582a, { roughness: .45 }), 20, cw, 0, 0, 0); w1.rotation.z = Math.PI / 2; for (const s of [-1, 1]) sphere(.8, mat(0xb8582a, { roughness: .45 }), cw, s * 3, 0, 0, 16, 12);
  for (let k = 0; k < 9; k++) { const sc = sphere(.42, mat(0xc8201a, { roughness: .3 }), cw, -2.6 + k * .65, .55, (k % 2) * .2, 10, 8); sc.scale.y = .5; } box(7.4, .4, 2.6, mat(0xf4f4f4), .2, cw, 0, -.75, 0);
  const SIGN = textPlane(9, 2, 540, 120, (c, w, h) => { c.fillStyle = '#f2c23a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 26); c.fill(); txt(c, 'CURRYWURST', w / 2, h / 2 + 4, 84, '#d8282a'); }, .4); SIGN.position.set(2.76, 7.0, -.6); SIGN.rotation.y = Math.PI / 2; g.add(SIGN);
  const PRICE = textPlane(4.4, 3, 264, 180, (c, w, h) => { c.fillStyle = '#1a1a22'; c.fillRect(0, 0, w, h); c.strokeStyle = '#f2c23a'; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'TASCHEN-', w / 2, 46, 40, '#ffffff'); txt(c, 'TÜCHER', w / 2, 92, 40, '#ffffff'); txt(c, '80 €', w / 2, 146, 58, '#f2c23a'); }, .7); PRICE.position.set(2.85, 4.4, -5.6); PRICE.rotation.y = Math.PI / 2; g.add(PRICE);
  const head = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4d8, emissiveIntensity: 4, toneMapped: false }); for (const s of [-1, 1]) box(1.0, .5, .2, head, .1, g, s * 1.8, 2.4, 9.02);
  for (const s of [-1, 1]) { const t = textPlane(6, 1.1, 480, 88, (c, w, h) => { txt(c, 'Brutzel-Willi', w / 2, h / 2 + 2, 62, '#d8282a'); }); t.position.set(s * 2.73, 1.4, 2); t.rotation.y = s * Math.PI / 2; g.add(t); }
  shade(g); g.userData = { IN, SIGN, PRICE, cw }; return g; }

// ---------- Goon-Knast (fuera): bloque de hormigón, alambre de espino, torre con foco, puerta y cartel ----------
export function knast(scene, X) { const g = G(scene, X); plane(500, 500, mat(0xffffff, { roughness: 1, map: rep(noiseTex('#7a8a5a', ['#6a7a4a', '#8a9a6a'], 2000, 3, 1), 40, 40) }), g, 0, -.05, 0);
  plane(40, 200, mat(0xffffff, { roughness: .9, map: rep(noiseTex('#4a4e5a', ['#40444e', '#565a66'], 2000, 2, 1), 2, 20) }), g, 0, .02, 40);
  const cm = mat(0xffffff, { map: rep(concreteT('#9aa0a8'), 6, 3), roughness: .9 }); box(60, 22, 30, cm, .1, g, 0, 11, -30); box(62, 1.4, 32, mat(0x7a7e86), .05, g, 0, 22.6, -30);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) { const x = -24 + k * 6; box(2.4, 3.2, .3, mat(0x2a2e38), .05, g, x, 5 + r * 6, -14.8); for (let b = 0; b < 4; b++) box(.16, 3.2, .4, mat(0x8a8e96, { metalness: .8 }), .02, g, x - .9 + b * .6, 5 + r * 6, -14.6); }
  const sg = textPlane(30, 4, 1200, 160, (c, w, h) => { c.fillStyle = '#1a1e2a'; c.fillRect(0, 0, w, h); c.shadowColor = '#ff3a3a'; c.shadowBlur = 30; txt(c, 'GOON-KNAST', w / 2, h / 2 + 6, 130, '#ff4a4a'); }, 1.2); sg.position.set(0, 26.6, -14.6); g.add(sg);
  const gate = G(g, 0, 0, -14.6); box(12, 10, .6, mat(0x3a3e48, { metalness: .6, roughness: .4 }), .05, gate, 0, 5, 0); for (let k = 0; k < 12; k++) box(.2, 10, .3, mat(0x5a5e68, { metalness: .8 }), .02, gate, -5.5 + k, 5, .4);
  // valla con alambre
  for (let x = -60; x <= 60; x += 5) { cyl(.18, .18, 9, mat(0x6a6e78, { metalness: .6 }), 6, g, x, 4.5, 0); } for (const y of [2, 4.5, 7, 8.6]) { const w = cyl(.05, .05, 120, mat(0x9aa0a8, { metalness: .8 }), 4, g, 0, y, 0); w.rotation.z = Math.PI / 2; }
  for (let k = 0; k < 60; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.7, .05, 4, 12), mat(0xb8bcc4, { metalness: .9 })); r.position.set(-59 + k * 2, 9.4, 0); r.rotation.y = Math.PI / 2; g.add(r); }
  box(14, .1, .1, mat(0x2a2a2a), 0, g, 0, 0, 0).visible = false; const gap = box(14, 9.5, .4, mat(0x7a7e86), 0, g, 0, -20, 0); gap.visible = false;
  // torre de vigilancia con foco
  const tw = G(g, 34, 0, -8); for (const [x, z] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) cyl(.3, .3, 22, mat(0x5a5e68), 8, tw, x, 11, z); box(7, 4, 7, cm, .1, tw, 0, 24, 0); box(8, .6, 8, mat(0x5a5e68), .05, tw, 0, 26.4, 0); box(5.4, 1.6, .2, mat(0x101420), .05, tw, 0, 24.6, 3.55);
  const SPOT = new THREE.SpotLight(0xfff4d8, 0, 120, .2, .6, 1); SPOT.position.set(34, 24, -6); SPOT.target.position.set(0, 0, 10); g.add(SPOT, SPOT.target); const sl = cyl(.8, .6, 1.4, basic(3, 3, 2.6), 14, tw, 0, 25, 3.8); sl.rotation.x = Math.PI / 2;
  const beam = new THREE.Mesh(new THREE.ConeGeometry(7, 50, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff4c8, transparent: true, opacity: .1, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false })); beam.geometry.translate(0, -25, 0); beam.position.set(34, 25, -4); g.add(beam);
  for (const [x, z] of [[-40, 30], [40, 34], [-52, -60], [60, -60]]) tree(g, x, z, 1); for (let k = 0; k < 6; k++) { const h = new THREE.Mesh(new THREE.SphereGeometry(60, 20, 10, 0, 6.283, 0, 1.4), mat(0x5a8a4a, { roughness: 1 })); h.position.set(-200 + k * 80, -30, -180 - (k % 2) * 30); h.scale.y = .6; g.add(h); }
  shade(g); return { g, SPOT, beam, gate }; }

// ---------- celda del Goon-Knast (X): pared de ladrillo pintado, barrotes delante (z = 6), banco, ventanita con barrotes, palitos en la pared ----------
export function zelle(scene, X) { const g = room(scene, X, 22, 18, 14, mat(0xffffff, { map: rep(tileT('#c8ccd4', '#a8acb4', 6), 4, 2), roughness: .9 }), mat(0xffffff, { map: rep(concreteT('#8a8e96'), 3, 3), roughness: .9 }));
  const bench_ = box(10, .6, 3, mat(0x8a6a4a), .1, g, -3, 2.4, -7); for (const s of [-1, 1]) box(.5, 2.4, 2.6, mat(0x5a5e68), .05, g, -3 + s * 4.4, 1.2, -7);
  const win = G(g, 4, 10, -8.8); box(4, 3, .3, basic(.8, .9, 1.4), 0, win, 0, 0, 0); for (let k = 0; k < 5; k++) box(.16, 3, .3, mat(0x3a3e48, { metalness: .8 }), .02, win, -1.6 + k * .8, 0, .2);
  const tally = textPlane(5, 3, 200, 120, (c, w, h) => { c.strokeStyle = '#4a4e58'; c.lineWidth = 4; for (let k = 0; k < 6; k++) { for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(14 + k * 30 + i * 5, 20); c.lineTo(14 + k * 30 + i * 5, 60); c.stroke(); } c.beginPath(); c.moveTo(10 + k * 30, 54); c.lineTo(34 + k * 30, 26); c.stroke(); } txt(c, '3 JAHRE', w / 2, 96, 30, '#5a5e68'); }); tally.position.set(-6, 7, -8.78); g.add(tally);
  const BARS = G(g, 0, 0, 7); for (let k = 0; k < 15; k++) cyl(.18, .18, 14, mat(0x3a3e48, { metalness: .8, roughness: .3 }), 8, BARS, -10.5 + k * 1.5, 7, 0); for (const y of [1, 7, 13]) box(22, .4, .4, mat(0x3a3e48, { metalness: .8 }), .05, BARS, 0, y, 0);
  const toilet = G(g, 8, 0, -6.6); cyl(.9, .7, 1.6, mat(0xd8dce4, { metalness: .6 }), 14, toilet, 0, .8, 0);
  const L = new THREE.PointLight(0xe8f0ff, 60, 30, 1.4); L.position.set(0, 12, 0); g.add(L); return { g: shade(g), BARS }; }

// ---------- Apotheke (X): mostrador con escáner de carnés, estanterías con cajitas, cruz verde, cartel NUR GEGEN AUSWEIS ----------
export function apotheke(scene, X) { const g = room(scene, X, 34, 26, 16, mat(0xffffff, { map: rep(tileT('#f4f8f4', '#dce8dc', 6), 6, 3), roughness: .7 }), mat(0xffffff, { map: rep(tileT('#e8ece8', '#c8d0c8', 4), 6, 5), roughness: .5 }));
  box(22, 2.6, 3.4, mat(0xffffff, { roughness: .3 }), .1, g, 0, 1.3, -1); box(22.4, .3, 3.8, mat(0x2ab86a), .05, g, 0, 2.75, -1);
  for (const y of [4, 7.5, 11]) { box(30, .3, 2.6, mat(0xf4f4f0), .05, g, 0, y, -11.6); for (let k = 0; k < 22; k++) box(.9, 1.6 + (k % 3) * .3, .9, mat([0x2ab86a, 0xffffff, 0x3a8ad8, 0xf2c23a, 0xff8ad0][k % 5], { roughness: .5 }), .05, g, -14 + k * 1.3, y + 1, -11.6); }
  const cross = G(g, 0, 13, -12.6); box(3, 1, .3, glow(0x2ad86a, 1.6), .05, cross, 0, 0, 0); box(1, 3, .3, glow(0x2ad86a, 1.6), .05, cross, 0, 0, 0);
  const sg = textPlane(10, 1.8, 600, 108, (c, w, h) => { txt(c, 'APOTHEKE', w / 2, h / 2 + 4, 84, '#1a8a4a'); }); sg.position.set(-10, 13, -12.65); g.add(sg);
  const SAFE = G(g, 6, 2.9, -1.4); box(3.6, 3, 2.4, glassM(), .1, SAFE, 0, 1.5, 0); tissueBox(SAFE, .9).position.set(0, .1, 0);
  const no = textPlane(5, 1.6, 300, 96, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8323a'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); txt(c, 'NUR GEGEN', w / 2, 36, 34, '#d8323a'); txt(c, 'AUSWEIS!', w / 2, 72, 40, '#d8323a'); }); no.position.set(6, 8.6, -1.2); g.add(no);
  const scan = G(g, -4, 2.9, .2); box(1.8, .5, 1.4, mat(0x2a2a30), .1, scan, 0, .25, 0); const SCR = box(1.4, 1.1, .1, glow(0x3ad8ff, 1.2), .03, scan, 0, 1.1, -.4); SCR.rotation.x = -.3;
  const L = new THREE.PointLight(0xf4fff4, 140, 50, 1.2); L.position.set(0, 14, 4); g.add(L); return { g: shade(g), SAFE, SCR }; }

// ---------- Drogerie (X): pasillos con estanterías de colores y, al fondo, el TRESOR (caja fuerte redonda) con las cajas de pañuelos ----------
export function drogerie(scene, X) { const g = room(scene, X, 40, 34, 18, mat(0xffffff, { map: rep(tileT('#fff4f8', '#f0dce4', 6), 6, 3), roughness: .7 }), mat(0xffffff, { map: rep(tileT('#f4f0f4', '#d8d0d8', 4), 8, 6), roughness: .4 }));
  for (const x of [-12, 12]) { const s = G(g, x, 0, 0); box(3, 9, 18, mat(0xf4f4f4), .1, s, 0, 4.5, 0); for (const y of [2, 4.2, 6.4, 8.4]) for (let k = 0; k < 12; k++) box(.9, 1.2, 1.1, mat([0xff6aa8, 0x3ab8ff, 0xffd23f, 0x8ad84a, 0xb86aff, 0xffffff][(k + y) % 6 | 0]), .05, s, (x < 0 ? 1.6 : -1.6), y, -7.5 + k * 1.4); }
  const sg = textPlane(14, 2.4, 700, 120, (c, w, h) => { c.fillStyle = '#ff4a8a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 30); c.fill(); txt(c, 'DROGERIE', w / 2, h / 2 + 4, 88, '#ffffff'); }, .5); sg.position.set(0, 15.5, -16.7); g.add(sg);
  // Tresor: puerta redonda con volante, abierta un poco, dentro cajas de pañuelos detrás de barrotes
  const T_ = G(g, 0, 0, -14); { const vm = mat(0x5a5e68, { metalness: .7, roughness: .35 }); box(12, 1.2, 4, vm, .1, T_, 0, .6, -1); box(12, 1.2, 4, vm, .1, T_, 0, 11.4, -1); for (const s of [-1, 1]) box(1.2, 12, 4, vm, .1, T_, s * 5.4, 6, -1); } const inside = box(9.6, 9.6, .2, mat(0x2a2e38), .05, T_, 0, 6, -1.02); const TL = new THREE.PointLight(0xfff4d8, 40, 14, 1.4); TL.position.set(0, 9, .2); T_.add(TL);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) tissueBox(T_, .95, [0x3a8ad8, 0xff8ad0, 0x2ab86a][k]).position.set(-3 + k * 3, 2.4 + r * 2.8, .4);
  for (let k = 0; k < 7; k++) cyl(.12, .12, 9.6, mat(0xd8dce4, { metalness: .9, roughness: .2 }), 6, T_, -3.6 + k * 1.2, 6, 1.2);
  const DOOR = G(T_, 5.2, 6, 1.4); const dd = cyl(5.2, 5.2, 1.2, mat(0x8a8e98, { metalness: .85, roughness: .25 }), 40, DOOR, -5.2, 0, .6); dd.rotation.x = Math.PI / 2; const wheel = G(DOOR, -5.2, 0, 1.4); for (let k = 0; k < 3; k++) { const s = box(3.6, .3, .3, mat(0xe9c23a, { metalness: .9 }), .05, wheel, 0, 0, 0); s.rotation.z = k * Math.PI / 3; } cyl(.6, .6, .5, mat(0xe9c23a, { metalness: .9 }), 14, wheel, 0, 0, 0).rotation.x = Math.PI / 2;
  const lock = textPlane(4, 1.2, 240, 72, (c, w, h) => { c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, h); txt(c, 'TASCHENTÜCHER', w / 2, h / 2 + 3, 30, '#ffffff'); }, .4); lock.position.set(0, 12.8, 1.1); T_.add(lock);
  const L = new THREE.PointLight(0xfff4f8, 160, 60, 1.2); L.position.set(0, 16, 4); g.add(L); return { g: shade(g), T: T_, DOOR, wheel }; }

// ---------- sótano del Rathaus (X): hormigón, tuberías, bombillas, rampa del garaje (z = 16), montaña de cajas, mesa con dinero, cartel firmado ----------
export function keller(scene, X) { const g = room(scene, X, 46, 40, 18, mat(0xffffff, { map: rep(concreteT('#b0b4ba'), 6, 3), roughness: .9 }), mat(0xffffff, { map: rep(concreteT('#7a7e86'), 6, 6), roughness: .8 }), 0x8a8e96);
  for (let k = 0; k < 4; k++) { const p = cyl(.4, .4, 46, mat([0xd8323a, 0x3a8ad8, 0xb8bcc4, 0x3a8a4a][k], { metalness: .4 }), 10, g, 0, 16.6 - k * .9, -19 + k * .9); p.rotation.z = Math.PI / 2; }
  const BUL = []; for (const [x, z] of [[-12, -8], [10, -8], [0, 6]]) { cyl(.04, .04, 2, mat(0x1a1a1a), 4, g, x, 17, z); const b = sphere(.5, basic(3, 2.6, 1.8), g, x, 15.8, z, 10, 8); const l = new THREE.PointLight(0xffd8a0, 70, 40, 1.4); l.position.set(x, 15, z); g.add(l); BUL.push(l); }
  const PILE = G(g, -8, 0, -6); const pile = boxPile(PILE, 460);
  const desk = G(g, 9, 0, -2); box(8, .5, 4.4, mat(0x7a5232), .1, desk, 0, 3.6, 0); for (const s of [-1, 1]) box(.5, 3.6, 4, mat(0x5a3a22), .05, desk, s * 3.6, 1.8, 0);
  const MONEY = G(desk, 0, 3.85, 0); for (let k = 0; k < 6; k++) { const st = G(MONEY, (k % 2 ? 1 : -1) * (2.6 + Math.floor(k / 2) * .4), 0, -1.2 + Math.floor(k / 2) * 1.0); for (let j = 0; j < 1 + (k % 2); j++) { box(1.3, .2, .65, mat(0x5ab84a, { roughness: .8 }), .02, st, 0, .1 + j * .22, 0); box(.25, .22, .67, mat(0xf4f4f0), .01, st, 0, .1 + j * .22, 0); } }
  const chair = G(g, 9, 0, -5.2); box(3, .4, 3, mat(0x7a1a1a), .1, chair, 0, 2.4, 0); box(3, 4, .4, mat(0x7a1a1a), .2, chair, 0, 4.4, -1.4); cyl(.2, .2, 2.2, mat(0x2a2a2a), 6, chair, 0, 1.1, 0);
  const POSTER = textPlane(7, 9, 350, 450, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8323a'; c.lineWidth = 12; c.strokeRect(10, 10, w - 20, h - 20); txt(c, 'GOONEN', w / 2, 90, 70, '#d8323a'); txt(c, 'VERBOTEN!', w / 2, 170, 62, '#d8323a'); txt(c, '– Der', w / 2, 250, 40, '#1a1a2a'); txt(c, 'Bürgermeister', w / 2, 300, 40, '#1a1a2a');
    c.strokeStyle = '#1a3a9a'; c.lineWidth = 4; c.beginPath(); c.moveTo(80, 390); c.bezierCurveTo(120, 340, 150, 420, 190, 370); c.bezierCurveTo(220, 340, 250, 410, 280, 380); c.stroke(); c.font = `italic 30px serif`; c.fillStyle = '#1a3a9a'; c.textAlign = 'center'; c.fillText('Dr. Edgar Saubermann', w / 2, 425); }); POSTER.position.set(4, 9, -19.75); g.add(POSTER);
  // rampa / portón del garaje al fondo derecho
  box(14, 10, .5, mat(0x5a5e68, { metalness: .5 }), .05, g, 16, 5, 19.8).visible = false; const GATE = G(g, 16, 0, -19.6); for (let k = 0; k < 8; k++) box(12, 1.2, .3, mat(0x8a8e96, { metalness: .6 }), .05, GATE, 0, .7 + k * 1.25, 0);
  return { g: shade(g), pile, PILE, MONEY, desk, POSTER, BUL, GATE }; }

// ---------- puente de piedra sobre el río y Bahnhof (X) ----------
export function bruecke(scene, X) { const g = G(scene, X); plane(600, 600, mat(0xffffff, { roughness: 1, map: rep(noiseTex('#4cb83e', ['#3ea832', '#5cc84a'], 2400, 3, 1), 50, 50) }), g, 0, -.05, 0);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(40, 600), new THREE.MeshStandardMaterial({ color: 0x2a6ab8, roughness: .1, metalness: .3, emissive: 0x0a2a5a, emissiveIntensity: .4 })); water.rotation.x = -Math.PI / 2; water.position.set(0, -1.5, 0); g.add(water);
  for (const s of [-1, 1]) box(4, 3, 600, mat(0x8a8a80), .1, g, s * 22, -1.2, 0);
  const st = mat(0xffffff, { map: rep(noiseTex('#b8a888', ['#a89878', '#c8b898'], 1200, 3, 1), 6, 2), roughness: .9 }); const deck = box(48, 1.4, 12, st, .1, g, 0, 1.2, 0); for (const z of [-5.6, 5.6]) { box(48, 2.4, .8, st, .1, g, 0, 3, z); for (let k = 0; k < 9; k++) { const l = lamp(g, -18 + k * 4.5, z, z > 0 ? -1 : 1); } }
  for (const x of [-12, 12]) { box(4, 6, 10, st, .1, g, x, -2.4, 0); }
  const road = new THREE.Mesh(new THREE.PlaneGeometry(10, 300), mat(0xffffff, { roughness: .9, map: rep(noiseTex('#4a4e5a', ['#40444e', '#565a66'], 2000, 2, 1), 2, 30) })); road.rotation.x = -Math.PI / 2; road.rotation.z = Math.PI / 2; road.position.set(0, 1.95, 0); g.add(road);
  for (const s of [-1, 1]) { const rr = new THREE.Mesh(new THREE.PlaneGeometry(200, 10), road.material); rr.rotation.x = -Math.PI / 2; rr.position.set(s * 124, .03, 0); g.add(rr); }
  // Bahnhof al otro lado (x = 70)
  const BH = G(g, 74, 0, -26); const bw = mat(0xffffff, { map: rep(noiseTex('#d8a878', ['#c89868', '#e8b888'], 1200, 3, 1), 4, 2), roughness: .85 }); box(40, 16, 16, bw, .1, BH, 0, 8, 0); const rf = new THREE.Mesh(new THREE.CylinderGeometry(.01, 24, 8, 4, 1, false, Math.PI / 4), mat(0x5a3a2a)); rf.scale.set(1.2, 1, .5); rf.position.set(0, 20, 0); BH.add(rf);
  const bs = textPlane(16, 3, 800, 150, (c, w, h) => { c.fillStyle = '#1a3a6a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 20); c.fill(); txt(c, 'BAHNHOF', w / 2, h / 2 + 4, 100, '#ffffff'); }, .5); bs.position.set(0, 13, 8.1); BH.add(bs);
  const ck = cyl(2, 2, .4, mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: .3 }), 28, BH, 0, 19, 8.2); ck.rotation.x = Math.PI / 2; for (let k = 0; k < 4; k++) box(4, 6, .3, basic(1.6, 1.3, .7), .05, BH, -14 + k * 9.3, 5, 8.05);
  box(60, 1.2, 8, mat(0xb8b4ac), .05, BH, 0, .6, 14); const train = G(BH, 0, 0, 22); box(46, 7, 6, mat(0xd8323a, { roughness: .4 }), .5, train, 0, 4.6, 0); box(46.2, 1.4, 6.1, mat(0xffffff), .1, train, 0, 2.6, 0); for (let k = 0; k < 10; k++) box(3, 2.4, .1, basic(1.4, 1.3, .9), .05, train, -20 + k * 4.4, 6, 3.05);
  for (const [x, z] of [[-40, 30], [40, -40], [-60, -50], [60, 40]]) tree(g, x, z, 1); for (let k = 0; k < 8; k++) townhouse(g, -110 + k * 18 - (k > 3 ? 40 : 0), -40, 16, 2 + k % 2, k + 2, 0);
  shade(g); water.receiveShadow = true; return { g, BH, train }; }

// ---------- cartel grande GOONEN VERBOTEN (para el Rathaus y la plaza) y balcón del alcalde ----------
export function banner(text1 = 'GOONEN', text2 = 'VERBOTEN!', w = 20, h = 9) { return textPlane(w, h, Math.round(w * 40), Math.round(h * 40), (c, W, H) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, W, H); c.strokeStyle = '#d8323a'; c.lineWidth = 18; c.strokeRect(9, 9, W - 18, H - 18);
  txt(c, text1, W / 2, H * .36, H * .3, '#d8323a'); txt(c, text2, W / 2, H * .7, H * .26, '#d8323a'); }, .25); }
export function stoneMitts(ch) { const out = []; for (const a of [ch.aL, ch.aR]) { const g = new THREE.Group(); g.position.set(0, -.35, .05); a.hand.add(g); const m = box(1.3, 1.4, 1.3, mat(0x9a9ea6, { roughness: 1, map: rep(concreteT('#9a9ea6'), 1, 1) }), .2, g, 0, 0, 0); m.castShadow = true; g.visible = false; out.push(g); } return out; }
export function scooter(parent) { const g = G(parent); box(.9, .2, 4, mat(0x2ab8d8, { roughness: .4 }), .08, g, 0, .5, 0); for (const z of [-1.7, 1.7]) { const w = cyl(.42, .42, .3, mat(0x1a1a1a), 14, g, 0, .42, z); w.rotation.z = Math.PI / 2; }
  const st = cyl(.1, .1, 4.4, mat(0xd8dce4, { metalness: .8 }), 8, g, 0, 2.6, 1.8); st.rotation.x = -.12; const bar = cyl(.08, .08, 2.4, mat(0x1a1a1a), 8, g, 0, 4.7, 2.05); bar.rotation.z = Math.PI / 2; return shade(g); }
export function phone(parent) { const g = G(parent); box(1.0, 1.9, .14, mat(0x1a1a22, { metalness: .6, roughness: .3 }), .1, g, 0, 0, 0); const S = box(.88, 1.7, .02, glow(0x3ab8ff, 1.0), .02, g, 0, 0, .08); return g; }
export function doener(parent, x, z, ry = 0) { const g = G(parent, x, 0, z); g.rotation.y = ry; box(10, 7, 6, mat(0xf4e8d0), .1, g, 0, 3.5, 0); box(10.4, .6, 6.4, mat(0xd8323a), .05, g, 0, 7.2, 0);
  const s = textPlane(8, 1.8, 480, 108, (c, w, h) => { c.fillStyle = '#d8323a'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 20); c.fill(); txt(c, 'DÖNER', w / 2, h / 2 + 4, 80, '#ffd23f'); }, .6); s.position.set(0, 8.6, 3.05); g.add(s);
  box(8, 3, .2, basic(1.5, 1.2, .7), .05, g, 0, 4, 3.02); const sp = cyl(.6, .9, 3, mat(0xb86a2a), 12, g, -2.5, 3.5, 2.6); return shade(g); }
