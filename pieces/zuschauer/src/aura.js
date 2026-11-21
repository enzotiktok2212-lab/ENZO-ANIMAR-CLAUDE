// AURA — atrezo y escenarios propios: Aura-Meter del Rathaus, Dom de Glanzheim con aguja, estatua de oro, helicóptero del Kommando Robbe,
// cohetes, fusil con láser, explosiones, farola, papelera, nubes de tormenta con círculo, bebé, mochila de cobaya, rodillo, sopera, puerta de cristal.
import { THREE, mat, box, cyl, sphere, textPlane, canvasTex, RNG, lerp, clamp, easeOut, outline } from './engine.js';
import { txt, FONT } from './props.js';
import { screenTex } from './gort.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g; };
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (c, i = 2) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), toneMapped: false });
const goldM = () => mat(0xf2c23a, { metalness: .85, roughness: .22, emissive: 0x5a3c00, emissiveIntensity: .25 });

// ---------- Aura-Meter: esfera con arco verde→rojo, aguja y placa con nombre y valor ----------
const vToA = v => (-135 + clamp(v, 0, 150) / 150 * 270) * Math.PI / 180;
export function auraMeter(parent, r = 6) { const g = G(parent); const gold = goldM();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r, r * .09, 12, 48), gold); g.add(ring);
  cyl(r * 1.02, r * 1.02, r * .12, mat(0x14161e, { roughness: .4 }), 48, g, 0, 0, -r * .06).rotation.x = Math.PI / 2;
  const face = textPlane(r * 1.86, r * 1.86, 512, 512, (c, w, h) => { const cx = w / 2, cy = h / 2, R = w * .42; c.fillStyle = '#10121c'; c.beginPath(); c.arc(cx, cy, w / 2, 0, 7); c.fill();
    for (let i = 0; i < 60; i++) { const a0 = (-225 + i / 60 * 270) * Math.PI / 180, a1 = (-225 + (i + 1.05) / 60 * 270) * Math.PI / 180; c.strokeStyle = `hsl(${120 - i * 2}, 90%, 52%)`; c.lineWidth = 34; c.beginPath(); c.arc(cx, cy, R, a0, a1); c.stroke(); }
    c.strokeStyle = '#ffffff'; for (let v = 0; v <= 150; v += 5) { const a = (-225 + v / 150 * 270) * Math.PI / 180, big = v % 25 === 0; c.lineWidth = big ? 6 : 2; c.beginPath(); c.moveTo(cx + Math.cos(a) * (R - 26), cy + Math.sin(a) * (R - 26)); c.lineTo(cx + Math.cos(a) * (R - (big ? 54 : 40)), cy + Math.sin(a) * (R - (big ? 54 : 40))); c.stroke();
      if (big) { c.font = `700 34px ${FONT}`; c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(v), cx + Math.cos(a) * (R - 90), cy + Math.sin(a) * (R - 90)); } }
    txt(c, 'AURA', cx, cy + 100, 52, '#ffd23f'); txt(c, 'METER', cx, cy + 150, 40, '#ffd23f'); }, .5);
  face.position.z = .02; g.add(face);
  const nd = G(g, 0, 0, .25); box(r * .07, r * .78, .12, glowM(0xff3a2a, 1.6), .02, nd, 0, r * .36, 0); sphere(r * .09, gold, nd, 0, 0, 0, 16, 12);
  const plate = screenTex(512, 128); const pm = new THREE.Mesh(new THREE.PlaneGeometry(r * 1.9, r * .48), new THREE.MeshBasicMaterial({ map: plate.t, toneMapped: false })); pm.position.set(0, -r * 1.33, .05); g.add(pm);
  box(r * 2.0, r * .56, .3, gold, .08, g, 0, -r * 1.33, -.12);
  let last = '';
  g.userData.set = (v, name = 'GLANZ', mode = 'num') => { nd.rotation.z = -vToA(v); const key = name + '|' + Math.round(v) + '|' + mode; if (key === last) return; last = key;
    plate.draw((c, w, h) => { c.fillStyle = '#0a0c14'; c.fillRect(0, 0, w, h); c.strokeStyle = v >= 100 || mode === 'inf' ? '#ff3a3a' : '#2ad86a'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10);
      c.font = `700 62px ${FONT}`; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = '#ffffff'; c.fillText(name, 34, h / 2 + 4); c.textAlign = 'right'; c.fillStyle = v >= 100 || mode === 'inf' ? '#ff4a3a' : '#ffd23f'; c.font = `700 ${mode === 'inf' ? 96 : 76}px ${FONT}`; c.fillText(mode === 'inf' ? '∞' : String(Math.round(v)), w - 34, h / 2 + 4); }); };
  g.userData.set(100); return shade(g); }

// ---------- Dom: nave gótica de arenisca, dos torres de fachada y una aguja altísima en el crucero con plataforma arriba ----------
export function dom(parent, x, z) { const g = G(parent, x, 0, z); const st = mat(0xffffff, { roughness: .85, map: canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#b8a48a'; c.fillRect(0, 0, w, h); const r = RNG(3); for (let y = 0; y < h; y += 12) for (let xx = (y / 12) % 2 ? -14 : 0; xx < w; xx += 28) { c.fillStyle = `rgba(${90 + r() * 40},${70 + r() * 30},${50 + r() * 20},.35)`; c.fillRect(xx + 1, y + 1, 26, 10); } }, true) });
  st.map.repeat.set(4, 6); const dk = mat(0x6a6a7a, { roughness: .6, metalness: .2 }), roofM = mat(0x3a5a6a, { roughness: .5, metalness: .3 });
  box(36, 40, 90, st, 0, g, 0, 20, 0); const rf = new THREE.Mesh(new THREE.CylinderGeometry(.01, 26, 16, 4, 1, false, Math.PI / 4), roofM); rf.scale.set(.98, 1, 3.4); rf.position.set(0, 48, 0); g.add(rf);
  for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { box(4, 34, 6, st, 0, g, s * 20, 17, -38 + k * 15); const w = textPlane(5, 16, 60, 192, (c, w, h) => { c.fillStyle = '#2a1a4a'; c.beginPath(); c.moveTo(0, h); c.lineTo(0, 30); c.quadraticCurveTo(w / 2, -20, w, 30); c.lineTo(w, h); c.fill(); const cs = ['#ff4a6a', '#3ab8ff', '#ffd23f', '#8ad84a']; for (let i = 0; i < 10; i++) { c.fillStyle = cs[i % 4]; c.fillRect(8 + (i % 2) * 22, 40 + i * 14, 18, 10); } }, .5); w.position.set(s * 18.1, 22, -31 + k * 15); w.rotation.y = s * Math.PI / 2; g.add(w); }
  // fachada (mira a +z) con torres gemelas
  for (const s of [-1, 1]) { box(14, 78, 14, st, 0, g, s * 13, 39, 45); box(19, 1, 19, st, .1, g, s * 13, 70, 45); for (const [dx, dz, w, d] of [[0, 9.3, 19, .4], [0, -9.3, 19, .4], [9.3, 0, .4, 19], [-9.3, 0, .4, 19]]) box(w, 2, d, dk, .05, g, s * 13 + dx, 71.4, 45 + dz); const sp = new THREE.Mesh(new THREE.ConeGeometry(8.5, 34, 8), roofM); sp.position.set(s * 13, 95, 45); g.add(sp); for (let k = 0; k < 3; k++) { const w = textPlane(4, 9, 48, 108, (c, w, h) => { c.fillStyle = '#1a1230'; c.beginPath(); c.moveTo(0, h); c.lineTo(0, 22); c.quadraticCurveTo(w / 2, -14, w, 22); c.lineTo(w, h); c.fill(); }); w.position.set(s * 13, 26 + k * 16, 52.1); g.add(w); } sphere(.9, goldM(), g, s * 13, 113, 45, 10, 8); }
  const rose = textPlane(14, 14, 256, 256, (c, w, h) => { c.fillStyle = '#5a4a3a'; c.beginPath(); c.arc(128, 128, 128, 0, 7); c.fill(); for (let i = 0; i < 12; i++) { c.fillStyle = ['#ff4a6a', '#3ab8ff', '#ffd23f', '#8ad84a'][i % 4]; c.beginPath(); c.moveTo(128, 128); c.arc(128, 128, 110, i / 12 * 6.283, (i + .8) / 12 * 6.283); c.fill(); } c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(128, 128, 26, 0, 7); c.fill(); }, .7);
  rose.position.set(0, 34, 45.1); g.add(rose); box(12, 22, 1, mat(0x4a2a18), .2, g, 0, 11, 45.2); box(40, 8, 3, st, 0, g, 0, 4, 46);
  // aguja del crucero: tambor, aguja larga, plataforma arriba (y = 132) y remate
  const TOP = 132; cyl(9, 10, 22, st, 8, g, 0, 52, -10); const sp = new THREE.Mesh(new THREE.ConeGeometry(7.5, TOP - 63, 8), roofM); sp.position.set(0, 63 + (TOP - 63) / 2, -10); g.add(sp);
  for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; const p = new THREE.Mesh(new THREE.ConeGeometry(1, 10, 4), roofM); p.position.set(Math.cos(a) * 9.5, 68, -10 + Math.sin(a) * 9.5); g.add(p); }
  for (let k = 0; k < 5; k++) cyl(7.2 - k * 1.4, 7.2 - k * 1.4, .6, goldM(), 8, g, 0, 72 + k * 11, -10);
  cyl(2.6, 2.2, .6, st, 16, g, 0, TOP, -10); sphere(.5, goldM(), g, 0, TOP + .6, -12.2, 10, 8);
  g.userData.top = new THREE.Vector3(x, TOP + .3, z - 10); return shade(g); }

// ---------- estatua de oro (personaje entero dorado sobre pedestal) ----------
export function goldify(ch) { const gm = goldM(); ch.root.traverse(o => { if (o.isMesh && !o.userData.isOutline && o !== ch.face) o.material = gm; }); ch.faceMat.color = new THREE.Color(1.0, .78, .25); ch.faceMat.metalness = .6; return ch; }
export function pedestal(parent, x, z, w = 10, h = 6) { const g = G(parent, x, 0, z); box(w, h, w, mat(0xe8e2d8, { roughness: .4 }), .3, g, 0, h / 2, 0); box(w + 1.2, 1, w + 1.2, mat(0xd8d0c4), .2, g, 0, .5, 0); box(w + .8, .8, w + .8, mat(0xd8d0c4), .2, g, 0, h - .2, 0);
  const pl = textPlane(w * .8, 1.6, 400, 80, (c, w_, h_) => { c.fillStyle = '#f2c23a'; c.fillRect(0, 0, w_, h_); txt(c, 'K. GLANZ · 100', w_ / 2, h_ / 2 + 3, 50, '#3a2400'); }, .2); pl.position.set(0, h * .55, w / 2 + .02); g.add(pl); return shade(g); }

// ---------- helicóptero del Kommando Robbe ----------
export function heli(parent) { const g = G(parent); const b = mat(0x3a4a32, { roughness: .5, metalness: .3 }), dk = mat(0x1a1a1e, { metalness: .5 });
  const body = sphere(4, b, g, 0, 0, 0, 20, 14); body.scale.set(1, .85, 1.6); const gl = sphere(3.2, mat(0x8ac8f0, { roughness: .05, metalness: .5, transparent: true, opacity: .75 }), g, 0, .6, 3.4, 18, 12); gl.scale.set(1, .8, 1);
  const tail = cyl(.6, 1.4, 12, b, 10, g, 0, .8, -10); tail.rotation.x = Math.PI / 2 - .06; box(.3, 3.4, 2.4, b, .1, g, 0, 2.4, -15.6);
  const tr = G(g, .5, 2.2, -15.6); for (let k = 0; k < 2; k++) { const bl = box(.1, 3.6, .4, dk, .05, tr, 0, 0, 0); bl.rotation.x = k * Math.PI / 2; }
  cyl(.5, .5, 1.2, dk, 10, g, 0, 3.8, 0); const rot = G(g, 0, 4.5, 0); for (let k = 0; k < 4; k++) { const bl = box(15, .12, .9, dk, .05, rot, 0, 0, 0); bl.rotation.y = k * Math.PI / 2; bl.geometry = bl.geometry; }
  for (const s of [-1, 1]) { box(.3, .3, 9, dk, .1, g, s * 2.4, -4.4, 0); for (const z of [-2.4, 2.4]) { const l = cyl(.12, .12, 1.4, dk, 6, g, s * 2.1, -3.6, z); l.rotation.z = s * .3; } }
  const lab = textPlane(6, 1.1, 480, 88, (c, w, h) => { txt(c, 'KOMMANDO ROBBE', w / 2, h / 2 + 3, 58, '#f2e8c8'); }); lab.position.set(4.05, -.2, -1.6); lab.rotation.y = Math.PI / 2; g.add(lab); const lab2 = lab.clone(); lab2.position.x = -4.05; lab2.rotation.y = -Math.PI / 2; g.add(lab2);
  const sp = new THREE.SpotLight(0xfff4d0, 0, 120, .3, .5); sp.position.set(0, -3, 4); g.add(sp, sp.target); sp.target.position.set(0, -40, 14);
  g.userData = { rot, tr, sp, spin(T) { rot.rotation.y = T * 22; tr.rotation.x = T * 30; } }; return shade(g); }

// ---------- cohete, lanzacohetes, fusil, punto láser ----------
export function rocket(parent) { const g = G(parent); const w = mat(0xd8d8d0, { roughness: .4, metalness: .3 }); const body = cyl(.32, .32, 2.6, w, 12, g, 0, 0, 0); body.rotation.x = Math.PI / 2; const n = new THREE.Mesh(new THREE.ConeGeometry(.32, .9, 12), mat(0xd8323a, { roughness: .4 })); n.rotation.x = Math.PI / 2; n.position.z = 1.75; g.add(n);
  for (let k = 0; k < 4; k++) { const f = box(.08, .9, .7, mat(0xd8323a), .02, g, 0, 0, -1.1); f.rotation.z = k * Math.PI / 2; f.position.set(Math.sin(k * Math.PI / 2) * .45, Math.cos(k * Math.PI / 2) * .45, -1.1); }
  const fl = new THREE.Mesh(new THREE.ConeGeometry(.3, 1.8, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.2, .3), toneMapped: false, transparent: true, opacity: .9 })); fl.rotation.x = -Math.PI / 2; fl.position.z = -2.2; g.add(fl); g.userData.flame = fl; return shade(g); }
export function launcher(parent) { const g = G(parent); const m = mat(0x4a5a3a, { roughness: .6 }); const t = cyl(.42, .42, 4.4, m, 14, g, 0, 0, 0); t.rotation.x = Math.PI / 2; for (const z of [-2.2, 2.2]) { const r = cyl(.5, .5, .4, mat(0x2a2a2a), 14, g, 0, 0, z); r.rotation.x = Math.PI / 2; } box(.3, .9, .4, mat(0x2a2a2a), .05, g, 0, -.6, .4); box(.5, .5, .9, mat(0x2a2a2a), .05, g, .5, .3, .9); return shade(g); }
export function rifle(parent) { const g = G(parent); const m = mat(0x2a2e2a, { roughness: .5, metalness: .4 }); const b = cyl(.09, .09, 4, m, 8, g, 0, 0, 1.6); b.rotation.x = Math.PI / 2; box(.35, .5, 2, mat(0x5a4a3a, { roughness: .6 }), .08, g, 0, -.1, -.6); const sc = cyl(.18, .18, 1.4, m, 10, g, 0, .38, .4); sc.rotation.x = Math.PI / 2; box(.2, .7, .3, m, .05, g, 0, -.5, .2);
  const ls = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, .1, .1), toneMapped: false, transparent: true, opacity: .55 })); ls.geometry.translate(0, .5, 0); ls.rotation.x = Math.PI / 2; ls.position.set(0, -.18, 3.6); ls.visible = false; g.add(ls); g.userData.laser = ls; return shade(g); }
export function dot(parent) { const s = new THREE.Mesh(new THREE.CircleGeometry(.11, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, .2, .2), toneMapped: false, transparent: true, depthTest: false })); s.renderOrder = 5; parent.add(s); return s; }
export function bullet(parent) { const g = G(parent); const b = cyl(.12, .12, .5, mat(0xd8a838, { metalness: .9, roughness: .2 }), 10, g, 0, 0, 0); b.rotation.x = Math.PI / 2; const t = new THREE.Mesh(new THREE.ConeGeometry(.12, .3, 10), mat(0xb8783a, { metalness: .9, roughness: .2 })); t.rotation.x = Math.PI / 2; t.position.z = .4; g.add(t);
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(.05, .12, 6, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .45, depthWrite: false })); tr.rotation.x = Math.PI / 2; tr.position.z = -3.2; g.add(tr); g.userData.trail = tr; return g; }

// ---------- explosión: bola de fuego, humo, escombros, onda ----------
export function explosion(scene) { const g = G(scene); const fire = [], smoke = [], deb = []; const r = RNG(21);
  for (let i = 0; i < 16; i++) fire.push(sphere(1, new THREE.MeshBasicMaterial({ color: new THREE.Color(...[[2.6, 1.3, .3], [2.8, .8, .2], [2.6, 2.0, .6]][i % 3]), toneMapped: false, transparent: true }), g, 0, 0, 0, 12, 8));
  for (let i = 0; i < 14; i++) smoke.push(sphere(1, mat(0x8a8a90, { roughness: 1, transparent: true, depthWrite: false }), g, 0, 0, 0, 10, 8));
  for (let i = 0; i < 18; i++) deb.push(box(.5 + r() * .6, .4 + r() * .5, .5 + r() * .6, mat([0x6a5a4a, 0x8a8a8a, 0x3a3a3a, 0xa84a3a][i % 4], { roughness: .8 }), .05, g, 0, 0, 0));
  const ring = new THREE.Mesh(new THREE.RingGeometry(.8, 1, 40), new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; g.add(ring);
  const light = new THREE.PointLight(0xffa040, 0, 80, 1.4); g.add(light);
  g.userData.at = (c, t, s = 1) => { g.visible = t >= 0 && t < 2.4; if (!g.visible) return; g.position.copy(c); const R = RNG(5);
    fire.forEach((f, i) => { const a = R() * 6.283, el = R() * 1.4, v = (2 + R() * 3) * s, k = easeOut(clamp(t / .5)); f.visible = t < .9; f.position.set(Math.cos(a) * Math.cos(el) * v * k, Math.sin(el) * v * k + s, Math.sin(a) * Math.cos(el) * v * k); f.scale.setScalar((1.2 + R() * 1.6) * s * (1 - clamp((t - .3) / .6)) * Math.min(1, t * 8 + .2)); f.material.opacity = 1 - clamp((t - .4) / .5); });
    smoke.forEach((m, i) => { const a = R() * 6.283, v = (2 + R() * 4) * s, k = easeOut(clamp(t / 1.6)); m.position.set(Math.cos(a) * v * k, (1 + R() * 3) * s + t * 3 * s, Math.sin(a) * v * k); m.scale.setScalar((1.5 + R() * 2 + t * 2) * s); m.material.opacity = .7 * clamp(t * 4) * (1 - clamp((t - 1.2) / 1.2)); });
    deb.forEach((d, i) => { const a = R() * 6.283, v = (6 + R() * 10) * s, vy = (6 + R() * 10) * s; d.position.set(Math.cos(a) * v * t, Math.max(.3, vy * t - 16 * t * t + s), Math.sin(a) * v * t); d.rotation.set(t * 9 + i, t * 7, 0); d.visible = t < 2; });
    ring.scale.setScalar(1 + t * 30 * s); ring.material.opacity = .7 * (1 - clamp(t / .5)); ring.position.y = .3; light.intensity = 400 * s * (1 - clamp(t / .8)); };
  g.visible = false; return g; }

// ---------- farola alemana, papelera naranja, bola de papel ----------
export function laterne(parent) { const g = G(parent); const gr = mat(0x1e4a3a, { metalness: .5, roughness: .4 }); cyl(.35, .55, 1.4, gr, 10, g, 0, .7, 0); cyl(.18, .24, 11, gr, 10, g, 0, 6.5, 0); for (let k = 0; k < 3; k++) cyl(.3, .3, .2, gr, 10, g, 0, 2 + k * 3.5, 0);
  const arm = box(2.4, .2, .2, gr, .05, g, 1.0, 11.6, 0); const hd = G(g, 2.0, 11, 0); box(1.2, .2, 1.2, gr, .05, hd, 0, .7, 0); box(.9, 1.1, .9, mat(0xfff4c0, { emissive: 0xffc870, emissiveIntensity: .8, transparent: true, opacity: .85 }), .05, hd, 0, 0, 0); const cap = new THREE.Mesh(new THREE.ConeGeometry(.9, .7, 4), gr); cap.rotation.y = Math.PI / 4; cap.position.y = 1.1; hd.add(cap);
  const sign = textPlane(1.6, .9, 128, 72, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6); txt(c, 'HALTEVERBOT', w / 2, h / 2 + 2, 15, '#1a1a1a'); }); sign.position.set(0, 4.2, .3); g.add(sign);
  return shade(g); }
export function muell(parent) { const g = G(parent); const o = mat(0xf26a1b, { roughness: .45 }); cyl(.12, .12, 3.2, mat(0x5a5e66, { metalness: .6 }), 8, g, 0, 1.6, -.9); const b = cyl(.95, .85, 2.2, o, 18, g, 0, 2.6, 0); const rim = new THREE.Mesh(new THREE.TorusGeometry(.95, .1, 6, 24), o); rim.rotation.x = Math.PI / 2; rim.position.y = 3.7; g.add(rim);
  const hole = cyl(.8, .8, .05, mat(0x1a1a1a), 18, g, 0, 3.69, 0); const lb = textPlane(1.4, .5, 140, 50, (c, w, h) => { txt(c, 'BITTE SAUBER', w / 2, h / 2 + 2, 20, '#ffffff'); }); lb.position.set(0, 2.8, .96); g.add(lb); return shade(g); }
export function paperBall(parent) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.42, 0), mat(0xf4f4ee, { roughness: .9, flatShading: true })); parent.add(m); m.castShadow = true; return m; }

// ---------- nubes de tormenta con círculo que se abre ----------
export function stormRing(scene, n = 70) { const g = G(scene); const ms = [mat(0x4a5060, { roughness: 1 }), mat(0x5a6272, { roughness: 1 }), mat(0x3a4050, { roughness: 1 })]; const P = []; const r = RNG(31);
  for (let i = 0; i < n; i++) { const a = r() * 6.283, d = r(); const s = sphere(1, ms[i % 3], g, 0, 0, 0, 14, 10); s.castShadow = false; P.push({ s, a, d, sc: 10 + r() * 12, y: r() * 8 }); }
  const sun = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 40, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.5, 1.1), transparent: true, opacity: .25, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })); g.add(sun);
  // open: 0 = cielo cerrado, 1 = círculo perfecto abierto de radio R
  g.userData.at = (c, open, R = 34, spread = 140) => { g.position.copy(c); P.forEach(p => { const r0 = lerp(p.d * spread * .6, R + p.d * spread, open); p.s.position.set(Math.cos(p.a) * r0, p.y + 4 * Math.sin(p.a * 3), Math.sin(p.a) * r0); p.s.scale.set(p.sc, p.sc * .55, p.sc); });
    sun.visible = open > .05; sun.scale.set(R * open * .95, 160, R * open * .95); sun.position.y = -80; sun.material.opacity = .22 * open; };
  return g; }

// ---------- bebé, mochila con cobaya, rodillo, sopera, puerta de cristal, balcón ----------
export function guineaPig(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); const b = sphere(1, mat(0xc87a3a, { roughness: 1 }), g, 0, 0, 0, 16, 12); b.scale.set(1, .75, 1.3); const w = sphere(.7, mat(0xfaf4ea, { roughness: 1 }), g, 0, .15, .75, 14, 10); w.scale.set(1, .8, .8);
  for (const sx of [-1, 1]) { sphere(.14, mat(0x111111, { roughness: .1 }), g, sx * .42, .35, 1.12, 8, 6); const e = sphere(.24, mat(0xe8a0a0), g, sx * .55, .72, .6, 8, 6); e.scale.set(1, .6, .4); } sphere(.12, mat(0xff8aa0), g, 0, .12, 1.36, 8, 6); return shade(g); }
export function gpBackpack(parent) { const g = G(parent); const m = mat(0xff8ad0, { roughness: .6 }); box(1.9, 2.2, 1.2, m, .3, g, 0, 0, 0); const win = sphere(.75, mat(0xd8f0ff, { roughness: .05, transparent: true, opacity: .35 }), g, 0, .2, .55, 16, 12); win.scale.z = .6; const gp = guineaPig(g, .42); gp.position.set(0, .15, .5);
  for (const s of [-1, 1]) box(.24, 2.2, .2, mat(0xd86aa8), .05, g, s * .6, 0, .62); const lb = textPlane(1.6, .4, 160, 40, (c, w, h) => { txt(c, 'MOPPEL', w / 2, h / 2 + 2, 30, '#ffffff', '#a83a7a', 6); }); lb.position.set(0, -.8, .62); g.add(lb); g.userData.gp = gp; return shade(g); }
export function rollingPin(parent) { const g = G(parent); const w = mat(0xd8a868, { roughness: .6 }); const c = cyl(.32, .32, 2.6, w, 14, g, 0, 0, 0); for (const s of [-1, 1]) cyl(.13, .13, .9, mat(0xb8884a), 8, g, 0, s * 1.7, 0); return shade(g); }
export function soupBowl(parent) { const g = G(parent); const b = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, 6.283, 0, Math.PI / 2), mat(0xf4f0e6, { roughness: .3, side: THREE.DoubleSide })); b.rotation.x = Math.PI; g.add(b); const rim = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 6, 28), mat(0x3a7ad8)); rim.rotation.x = Math.PI / 2; g.add(rim); return shade(g); }
export function scissors(parent) { const g = G(parent); const m = mat(0xd8dce4, { metalness: .9, roughness: .2 }); for (const s of [-1, 1]) { const b = box(.12, 1.2, .06, m, .02, g, s * .08, .6, 0); b.rotation.z = s * .18; const h = new THREE.Mesh(new THREE.TorusGeometry(.22, .07, 6, 12), mat(0xd8323a)); h.position.set(s * .25, -.15, 0); g.add(h); } return shade(g); }
export function glassDoor(parent) { const g = G(parent); const fr = mat(0x8a929e, { metalness: .7, roughness: .3 }); box(5.2, .4, .4, fr, .05, g, 0, 8.2, 0); for (const s of [-1, 1]) box(.4, 8.4, .4, fr, .05, g, s * 2.6, 4.2, 0);
  box(4.8, 8, .12, mat(0xbfe6ff, { transparent: true, opacity: .3, roughness: .02, metalness: .3, depthWrite: false }), 0, g, 0, 4.1, 0); box(.2, 1.6, .2, fr, .05, g, 1.9, 4.2, .25);
  const st = textPlane(1.8, .5, 180, 50, (c, w, h) => { txt(c, 'ZIEHEN', w / 2, h / 2 + 2, 34, '#d8323a'); }); st.position.set(0, 5.4, .1); g.add(st); return shade(g); }
export function balcony(parent) { const g = G(parent); const m = mat(0xf4f0e8, { roughness: .6 }); box(8, .5, 3.4, m, .1, g, 0, 0, 1.7); const ir = mat(0x2a2e3a, { metalness: .6 }); box(8, .2, .2, ir, .02, g, 0, 2.6, 3.3); for (let k = 0; k <= 16; k++) box(.1, 2.4, .1, ir, 0, g, -4 + k * .5, 1.4, 3.3);
  for (const s of [-1, 1]) { box(.2, .2, 3.4, ir, .02, g, s * 4, 2.6, 1.7); } for (let k = 0; k < 6; k++) sphere(.4, mat([0xff4a6a, 0xffd23f, 0xff8ad0][k % 3]), g, -3.5 + k * 1.4, 3.0, 3.3, 8, 6); return shade(g); }
// pancarta / cartel de la ciudad
export function plakat(parent, l1, l2, w = 10, h = 6, bg = '#d8323a') { const p = textPlane(w, h, Math.round(w * 50), Math.round(h * 50), (c, ww, hh) => { c.fillStyle = bg; c.fillRect(0, 0, ww, hh); c.strokeStyle = '#ffffff'; c.lineWidth = 10; c.strokeRect(8, 8, ww - 16, hh - 16); txt(c, l1, ww / 2, hh * .38, hh * .26, '#ffffff'); txt(c, l2, ww / 2, hh * .72, hh * .17, '#ffd23f'); }, .3); p.material.side = THREE.DoubleSide; parent.add(p); return p; }

// reloj de estación (Bahnhofsuhr) en poste: hora fija hh:mm
export function uhr(parent, hh = 20, mm = 1) { const g = G(parent); const k = mat(0x2a2e3a, { metalness: .6 }); cyl(.25, .3, 12, k, 10, g, 0, 6, 0); const f = textPlane(4, 4, 256, 256, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(128, 128, 124, 0, 7); c.fill(); c.lineWidth = 10; c.strokeStyle = '#1a1a1a'; c.stroke();
  for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283; c.lineWidth = i % 5 ? 3 : 9; c.beginPath(); c.moveTo(128 + Math.sin(a) * 112, 128 - Math.cos(a) * 112); c.lineTo(128 + Math.sin(a) * (i % 5 ? 104 : 92), 128 - Math.cos(a) * (i % 5 ? 104 : 92)); c.stroke(); }
  const hand = (a, l, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.sin(a) * l, 128 - Math.cos(a) * l); c.stroke(); }; hand((hh % 12 + mm / 60) / 12 * 6.283, 62, 14, '#1a1a1a'); hand(mm / 60 * 6.283, 96, 9, '#1a1a1a'); hand(.3, 100, 3, '#d8323a'); c.fillStyle = '#d8323a'; c.beginPath(); c.arc(128, 128, 10, 0, 7); c.fill(); });
  f.position.set(0, 13.4, .32); g.add(f); const rim = new THREE.Mesh(new THREE.TorusGeometry(2.05, .22, 8, 32), k); rim.position.set(0, 13.4, .2); g.add(rim); cyl(2.1, 2.1, .4, mat(0xf4f4f4), 32, g, 0, 13.4, 0).rotation.x = Math.PI / 2; return shade(g); }
