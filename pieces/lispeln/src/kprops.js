// KELLER — atrezo: lupa, brezel, lingote de oro (y montón), tornado, explosión, tapa del cielo (techo gigante), escalera de mano, zepelín,
// el rectángulo brillante (móvil), el pulgar gigante, bombilla de idea, cama del espectador, Rathaus.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex } from './props.js';
import { plankTex, brickTex, shade } from './ksets.js';
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const goldM = () => mat(0xf2c23a, { metalness: .85, roughness: .22, emissive: 0x6a4a00, emissiveIntensity: .25 });

export function lupe(scene) { const g = G(scene); const gm = goldM();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, .16, 12, 40), gm); g.add(ring);
  const gl = new THREE.Mesh(new THREE.CircleGeometry(.96, 40), new THREE.MeshPhysicalMaterial({ color: 0xcfefff, transparent: true, opacity: .18, roughness: .02, metalness: 0, side: THREE.DoubleSide, depthWrite: false })); g.add(gl);
  const hl = cyl(.13, .16, 1.9, mat(0x5a2a1a, { roughness: .5 }), 12, g, 0, -2.0, 0); cyl(.2, .2, .2, gm, 12, g, 0, -1.1, 0); cyl(.2, .2, .2, gm, 12, g, 0, -2.95, 0);
  g.userData.glass = gl; return shade(g); }
export function brezel(scene) { const g = G(scene); const m = mat(0xb8642a, { roughness: .45, metalness: .05 }); const tube = .26;
  const pts = []; for (let i = 0; i <= 80; i++) { const t = i / 80 * Math.PI * 2; const x = Math.sin(t) * 1.25 * (1 + .15 * Math.cos(2 * t)), y = Math.sin(2 * t) * .55 + Math.cos(t) * .7 - .1; pts.push(new THREE.Vector3(x, y, Math.sin(3 * t) * .12)); }
  const cur = new THREE.CatmullRomCurve3(pts, true); g.add(new THREE.Mesh(new THREE.TubeGeometry(cur, 120, tube, 12, true), m));
  const r = RNG(7); for (let i = 0; i < 26; i++) { const p = cur.getPoint(r()); const s = box(.07, .05, .07, mat(0xffffff, { roughness: .3 }), .02, g, p.x + (r() - .5) * .3, p.y + (r() - .5) * .3, p.z + .22); s.rotation.set(r() * 3, r() * 3, 0); }
  return shade(g); }
export function goldbar(scene) { const g = G(scene); const gm = goldM();
  const sh = new THREE.Shape(); sh.moveTo(-1.2, 0); sh.lineTo(1.2, 0); sh.lineTo(.95, .6); sh.lineTo(-.95, .6); sh.lineTo(-1.2, 0);
  const ge = new THREE.ExtrudeGeometry(sh, { depth: .9, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 2 }); ge.translate(0, 0, -.45);
  g.add(new THREE.Mesh(ge, gm)); const l = textPlane(1.2, .4, 160, 54, (c, w, h) => { c.fillStyle = '#c89a1a'; c.fillRect(0, 0, w, h); c.font = '700 34px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#7a5a00'; c.fillText('999,9', w / 2, h / 2 + 2); });
  l.rotation.x = -Math.PI / 2; l.position.set(0, .66, 0); g.add(l); return shade(g); }
export function goldpile(scene, n = 40) { const g = G(scene); const r = RNG(11); for (let i = 0; i < n; i++) { const b = goldbar(g); const ring = Math.floor(i / 10); const a = r() * 6.283, d = r() * (4 - ring * .9);
  b.position.set(Math.cos(a) * d, ring * .62 + r() * .2, Math.sin(a) * d); b.rotation.set((r() - .5) * .3, r() * 6.283, (r() - .5) * .3); } return g; }
// tornado: embudo de anillos que giran + escombros
export function tornado(scene) { const g = G(scene); const rings = []; const m = mat(0x8a8f9a, { roughness: 1, transparent: true, opacity: .75, depthWrite: false });
  for (let i = 0; i < 26; i++) { const r = 1.5 + Math.pow(i / 25, 1.7) * 16, t = new THREE.Mesh(new THREE.TorusGeometry(r, .9 + i * .12, 8, 28), m); t.rotation.x = Math.PI / 2; t.position.y = i * 2.4; g.add(t); rings.push(t); }
  const deb = []; const r = RNG(5); for (let i = 0; i < 30; i++) { const d = box(.6 + r(), .4 + r() * .6, .6 + r(), mat([0x8a5a32, 0xd8402e, 0xf6d04a, 0x3a9a4a][i % 4]), .05, g, 0, 0, 0); deb.push([d, r() * 6.283, 4 + r() * 14, 3 + r() * 50, 1 + r() * 2]); }
  g.userData.update = T => { rings.forEach((t, i) => { t.rotation.z = T * (6 - i * .12); t.position.x = Math.sin(T * 2 + i * .25) * i * .18; }); deb.forEach(([d, a, rr, y, sp]) => { const an = a + T * sp; d.position.set(Math.cos(an) * rr * (1 + y / 60), y, Math.sin(an) * rr * (1 + y / 60)); d.rotation.set(T * 3, T * 2, 0); }); };
  return g; }
// explosión: bola de fuego que crece, humo y escombros (k 0..1)
export function explosion(scene) { const g = G(scene); const fire = [], smoke = [], deb = []; const r = RNG(9);
  for (let i = 0; i < 14; i++) { const s = sphere(1, new THREE.MeshBasicMaterial({ color: new THREE.Color(...[[2.4, 1.2, .3], [2.6, 1.8, .4], [2.2, .6, .15]][i % 3]), toneMapped: false, transparent: true }), g, 0, 0, 0, 14, 10); fire.push([s, new THREE.Vector3(r() - .5, r() * .8 + .2, r() - .5).normalize(), .6 + r() * .8]); }
  for (let i = 0; i < 12; i++) { const s = sphere(1, mat(0x4a4a50, { roughness: 1, transparent: true, depthWrite: false }), g, 0, 0, 0, 12, 8); smoke.push([s, new THREE.Vector3(r() - .5, r() * .6 + .5, r() - .5).normalize(), .7 + r() * .6]); }
  for (let i = 0; i < 24; i++) { const d = box(.8 + r() * 1.2, .6 + r(), .6 + r(), mat([0xf4f2ee, 0xd8402e, 0x9a2418, 0x8a5a32][i % 4]), .05, g, 0, 0, 0); deb.push([d, new THREE.Vector3(r() - .5, r() * .9 + .5, r() - .5).normalize(), 14 + r() * 18]); }
  g.userData.set = (k, S = 10) => { const e = 1 - Math.pow(1 - Math.min(1, k * 2.2), 3);
    fire.forEach(([s, d, v]) => { s.visible = k > 0 && k < .8; s.position.copy(d).multiplyScalar(e * S * v); s.scale.setScalar(S * (.35 + e * .5) * v * (1 - k * .6)); s.material.opacity = 1 - k; });
    smoke.forEach(([s, d, v]) => { s.visible = k > .08; s.position.copy(d).multiplyScalar(e * S * v * 1.2).add(new THREE.Vector3(0, k * S * .8, 0)); s.scale.setScalar(S * (.3 + k * .7) * v); s.material.opacity = .8 * (1 - k * .6); });
    deb.forEach(([d, dir, v]) => { d.visible = k > 0; const t = k * 1.6; d.position.set(dir.x * v * t, dir.y * v * t - 14 * t * t, dir.z * v * t); d.rotation.set(t * 7, t * 5, 0); }); };
  return g; }
// la tapa del cielo: techo de madera gigante con vigas y el canto de la mesa (la ciudad está en un sótano)
export function deckel(scene, Y = 550) { const g = G(scene); const wd = mat(0xffffff, { map: rep(plankTex('#9a6a3a', '#86582e'), 16, 16), roughness: .8, side: THREE.DoubleSide });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), wd); p.rotation.x = Math.PI / 2; p.position.y = Y; g.add(p);
  for (let i = -6; i <= 6; i++) box(30, 40, 2400, mat(0x6a4224, { roughness: .8 }), 2, g, i * 180, Y - 20, 0);
  // lámpara colgante gigante
  cyl(2, 2, 300, mat(0x1a1a1a), 8, g, 0, Y - 150, 0); const sh = new THREE.Mesh(new THREE.CylinderGeometry(10, 62, 44, 32, 1, true), mat(0x2e7a4a, { side: THREE.DoubleSide, roughness: .4 })); sh.position.set(0, Y - 320, 0); g.add(sh);
  sphere(14, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.2, 1.6), toneMapped: false }), g, 0, Y - 338, 0, 16, 10);
  // canto de la mesa alrededor de la ciudad
  const tm = mat(0xffffff, { map: rep(plankTex('#b8783a', '#a86a32'), 12, 1), roughness: .6 }); for (const [x, z, w, d] of [[0, -150, 340, 40], [0, 150, 340, 40], [-150, 0, 40, 340], [150, 0, 40, 340]]) box(w, 14, d, tm, 1, g, x, -8, z);
  const bw = mat(0xffffff, { map: rep(brickTex('#b8583e', '#e2cdb6'), 40, 30), roughness: .9, side: THREE.DoubleSide }); const F = -(2.7 + .23) / .038;
  for (const [x, z, ry, w] of [[0, -580, 0, 1600], [0, 580, 0, 1600], [-790, 0, Math.PI / 2, 1200], [790, 0, Math.PI / 2, 1200]]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, Y - F), bw); p.position.set(x, (Y + F) / 2, z); p.rotation.y = ry; g.add(p); }
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1200), mat(0xffffff, { map: rep(plankTex(), 20, 15), roughness: .7 })); fl.rotation.x = -Math.PI / 2; fl.position.y = F; g.add(fl);
  return g; }
export function leiter(scene, n = 14) { const g = G(scene); const m = mat(0xb8783a, { roughness: .6 }); for (const s of [-1, 1]) box(.35, n * 1.6 + 1, .35, m, .08, g, s * 1.3, (n * 1.6 + 1) / 2, 0); for (let i = 0; i < n; i++) box(2.6, .22, .25, m, .05, g, 0, 1 + i * 1.6, 0); return shade(g); }
export function zeppelin(scene) { const g = G(scene); const env = sphere(1, mat(0xd8402e, { roughness: .45 }), g, 0, 0, 0, 32, 20); env.scale.set(2.2, 2.2, 6);
  for (let i = -2; i <= 2; i++) { const b = new THREE.Mesh(new THREE.TorusGeometry(2.21, .06, 6, 32), mat(0xf6d04a)); b.position.z = i * 2.2; b.scale.set(1, 1, 1); b.scale.setScalar(Math.sqrt(1 - Math.pow(i * 2.2 / 6, 2))); g.add(b); }
  for (const [rx, rz] of [[0, 0], [0, Math.PI / 2]]) { const f = box(.15, 2.6, 2.2, mat(0xf6d04a), .05, g, 0, 0, -5.6); f.rotation.z = rz; }
  const go = box(1.6, 1.0, 2.4, mat(0xffffff, { roughness: .4 }), .2, g, 0, -2.7, .3); for (const s of [-1, 1]) cyl(.04, .04, .9, mat(0x1a1a1a), 4, g, s * .6, -2.1, .3);
  const pr = box(.1, 1.4, .2, mat(0x2a2a2a), .02, g, 0, -2.7, -1.1); g.userData.prop = pr;
  const t = textPlane(4.4, 1.2, 440, 120, (c, w, h) => { c.fillStyle = 'rgba(0,0,0,0)'; c.clearRect(0, 0, w, h); c.font = '700 96px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 12; c.strokeStyle = '#7a1a10'; c.strokeText('THOMAS', w / 2, h / 2); c.fillStyle = '#ffffff'; c.fillText('THOMAS', w / 2, h / 2); });
  t.position.set(2.25, 0, 0); t.rotation.y = Math.PI / 2; g.add(t); return shade(g); }
// el rectángulo brillante: un móvil gigante de cristal que brilla
export function handyRect(scene) { const g = G(scene);
  const gl = new THREE.Mesh(new THREE.PlaneGeometry(37, 77), new THREE.MeshBasicMaterial({ color: new THREE.Color(.35, .5, .9), transparent: true, opacity: .1, toneMapped: false, side: THREE.DoubleSide, depthWrite: false })); gl.position.set(0, 40, 0); g.add(gl);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(38.5, 78.5)), new THREE.LineBasicMaterial({ color: 0xffffff })); edge.position.set(0, 40, .1); g.add(edge);
  const glow = []; for (let i = 0; i < 4; i++) { const b = box(i < 2 ? 39 : .9, i < 2 ? .9 : 79, .3, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 1.5, 2.2), toneMapped: false }), .3, g, i < 2 ? 0 : (i === 2 ? -19.3 : 19.3), i < 2 ? (i ? 79.4 : .6) : 40, .2); glow.push(b); }
  const bl = new THREE.PointLight(0x8ab0ff, 120, 0, 1.4); bl.position.set(0, 40, -8); g.add(bl); g.userData = { gl, glow, bl }; return g; }
// el pulgar gigante
export function daumen(scene, skin = 0xf2c4a0) { const g = G(scene); const sk = mat(skin, { roughness: .55 });
  const th = box(10, 26, 10, sk, 4.5, g, 0, 13, 0); const nail = box(7, 8, 1, mat(0xf8dcd0, { roughness: .2 }), 2.5, g, 0, 21, 5.1); box(11, 10, 11, sk, 4, g, 0, -2, 0); return shade(g); }
export function bulb(scene) { const g = G(scene); sphere(.9, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.4, 1.2), toneMapped: false }), g, 0, .6, 0, 20, 14); cyl(.45, .5, .7, mat(0x9aa0a8, { metalness: .8, roughness: .3 }), 12, g, 0, -.4, 0);
  const rays = []; for (let i = 0; i < 8; i++) { const r = box(.12, .6, .12, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.4, 1.2), toneMapped: false }), .05, g, Math.cos(i / 8 * 6.283) * 1.7, .6 + Math.sin(i / 8 * 6.283) * 1.7, 0); r.rotation.z = i / 8 * 6.283 - Math.PI / 2; rays.push(r); } return g; }
// cuarto del espectador de noche: cama, mesilla, la puerta del sótano
export function zimmer(scene, X) { const g = G(scene, X, 0, 0); const wl = mat(0x2a3a6a, { roughness: .9 }), fl = mat(0xffffff, { map: rep(plankTex('#6a4a2e', '#5a3e26'), 4, 4), roughness: .8 });
  const f = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), fl); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(40, 20, 1, wl, 0, g, 0, 10, -15); box(1, 20, 40, wl, 0, g, -15, 10, 5); box(1, 20, 40, wl, 0, g, 15, 10, 5);
  box(12, 2.4, 18, mat(0x6a4224), .2, g, -6, 1.2, -5); box(11.4, 1.4, 17, mat(0xf4f4f8), .4, g, -6, 3.0, -5); box(11.6, 1.2, 12, mat(0x2a5ad8, { roughness: .9 }), .5, g, -6, 3.9, -2); box(6, 1.2, 3, mat(0xffffff), .5, g, -6, 4.2, -11.5); box(12, 6, 1, mat(0x6a4224), .2, g, -6, 4, -14);
  box(4, 4, 4, mat(0x8a5a30), .2, g, 3, 2, -12); const lamp = sphere(.9, mat(0xffd890, { emissive: 0xffb050, emissiveIntensity: .8 }), g, 3, 5, -12, 12, 8);
  // puerta del sótano (entreabierta, luz cálida)
  box(8, 14, .6, mat(0x4a2e1a), .1, g, 9, 7, -14.6); const door = G(g, 5.4, 0, -14.2); box(7, 13, .4, mat(0x6a4224), .1, door, 3.5, 6.5, 0); sphere(.3, mat(0xe9c23a, { metalness: .8 }), door, 6.3, 6.5, .3, 10, 8);
  const lit = new THREE.Mesh(new THREE.PlaneGeometry(7, 13), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.0, 1.4, .7), toneMapped: false })); lit.position.set(9, 6.5, -14.9); g.add(lit);
  const pl = new THREE.PointLight(0xffb060, 60, 0, 1.6); pl.position.set(9, 6, -12); g.add(pl);
  g.userData = { door, pl }; return shade(g); }
