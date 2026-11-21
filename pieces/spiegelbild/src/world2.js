// Spiegelbild: reparto (Emil, su reflejo quemado, Lina, Krause, bomberos…) y escenarios con espejos reales.
import { THREE, RNG, canvasTex, mat, box, cyl, sphere, textPlane, checkTex, character, rrect } from './engine.js';
import { FONT } from './sets.js';
import { flatCap } from './cast.js';

const gold = () => mat(0xd9a531, { metalness: .8, roughness: .25 });
// ---------- personajes ----------
function spikes(color) { return (h) => { const m = mat(color, { roughness: .45 });
  box(1.42, .4, 1.32, m, .15, h, 0, 1.2, -.02); box(1.42, .9, .34, m, .12, h, 0, .9, -.52);
  const r = RNG(4); for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283, rad = .45 + (i % 3) * .12;
    const c = new THREE.Mesh(new THREE.ConeGeometry(.24, .95 + r() * .35, 8), m); c.position.set(Math.cos(a) * rad, 1.55 + r() * .1, Math.sin(a) * rad - .05); c.rotation.set(Math.sin(a) * .7, 0, -Math.cos(a) * .7); c.castShadow = true; h.add(c); }
  const top = new THREE.Mesh(new THREE.ConeGeometry(.26, 1.1, 8), m); top.position.set(0, 1.85, 0); h.add(top); }; }
function bolt(sp, col) { const s = new THREE.Shape(); s.moveTo(.1, .55); s.lineTo(-.25, -.02); s.lineTo(.02, -.02); s.lineTo(-.12, -.55); s.lineTo(.28, .08); s.lineTo(.02, .08); s.lineTo(.18, .55);
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: .04, bevelEnabled: false }), mat(col, { emissive: col, emissiveIntensity: .15 })); m.position.set(.15, 1.05, .53); m.scale.setScalar(1.15); sp.add(m); }
export function makeEmil(scene, burnt = false) {
  const o = character(scene, { seed: burnt ? 61 : 60, scale: .82, headScale: 1.1, skin: 0xf3d2b8, skinCss: '#f3d2b8', shirt: burnt ? 0x2e5a4a : 0x5fa8e8, shirt2: burnt ? 0x2e5a4a : 0x5fa8e8,
    cuffs: burnt ? 0x24463a : 0x4a90d0, pants: burnt ? 0x2a2a34 : 0x2f4f9a, shoes: burnt ? 0x2a2a2a : 0xf2f2f2, sole: 0x333333, belt: 0x22283a,
    face: { iris: '#4a3a2a', browColor: '#7a3e1a', ...(burnt ? { soot: 1, blood: 1 } : {}) },
    hairBuild: spikes(burnt ? 0x8a3a1a : 0xa0521e), torsoDetail: (sp) => { bolt(sp, burnt ? 0xc89a2a : 0xffd23f);
      if (burnt) for (const [x, y] of [[-.6, .5], [.5, 1.6], [-.2, 1.2], [.7, .3]]) box(.35, .25, .05, mat(0x3a1a12, { roughness: 1 }), .05, sp, x, y, .54); } });
  return o;
}
export function makeLina(scene) {
  const o = character(scene, { seed: 62, scale: .62, headScale: 1.15, skin: 0xf3d2b8, skinCss: '#f3d2b8', shirt: 0xf27aa8, shirt2: 0xf27aa8, pants: 0xffffff, shoes: 0xd8323a, noBelt: true, skirt: 0xe85a90, socks: 0xffffff,
    face: { iris: '#3a7ac8', blush: 1, freckles: 1, browColor: '#8a4a1a' },
    hairBuild: (h) => { const m = mat(0xb8621e, { roughness: .5 }); box(1.42, .4, 1.32, m, .15, h, 0, 1.2, -.02); box(1.42, .9, .34, m, .12, h, 0, .9, -.52);
      for (const s of [-1, 1]) { sphere(.42, m, h, s * .95, 1.0, -.2, 14, 10); box(.25, .25, .25, mat(0xffd23f), .08, h, s * .78, 1.2, -.15); } } });
  const ch = new THREE.Group(); o.spine.add(ch);   // Kette mit Anhänger
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.62, .04, 6, 28, Math.PI), gold()); ring.rotation.set(0, 0, Math.PI); ring.position.set(0, 1.95, .55); ch.add(ring);
  const pend = new THREE.Mesh(new THREE.SphereGeometry(.17, 14, 10), mat(0xffffff, { emissive: 0x9fe3ff, emissiveIntensity: 1.2, metalness: .3, roughness: .1 })); pend.position.set(0, 1.32, .6); ch.add(pend);
  o.props.pend = pend; return o;
}
export function makeKrause(scene) {
  const o = character(scene, { seed: 63, scale: 1.0, skin: 0xe9c4a6, skinCss: '#e9c4a6', shirt: 0x6a7280, shirt2: 0xf2efe6, cuffs: 0xf2efe6, pants: 0x6a7280, shoes: 0x2a2018, noBelt: true,
    face: { iris: '#3a4a5a', browColor: '#d8d8d8' },
    torsoDetail: (sp) => { const g = mat(0x6a7280); for (const s of [-1, 1]) box(.28, 2.1, .08, g, .03, sp, s * .5, 1.05, .55); box(1.3, .8, .08, g, .05, sp, 0, 1.4, .56); box(.3, .3, .05, mat(0xd9a531, { metalness: .7 }), .05, sp, -.45, 1.55, .6);
      const keys = new THREE.Group(); keys.position.set(.9, .1, .5); sp.add(keys); for (let i = 0; i < 4; i++) box(.06, .3, .03, mat(0xc8c8d0, { metalness: .9, roughness: .2 }), .01, keys, -.1 + i * .07, -.15, 0); },
    hairBuild: (h) => { const m = mat(0xe0e0e0); for (const s of [-1, 1]) box(.28, .5, 1, m, .1, h, s * .67, .85, -.1); box(1.36, .45, .3, m, .1, h, 0, .78, -.52);
      const fr = mat(0x222222, { metalness: .5 }); for (const s of [-1, 1]) { const g = new THREE.Mesh(new THREE.TorusGeometry(.22, .045, 8, 20), fr); g.position.set(s * .29, .86, .64); h.add(g); }
      box(.9, .22, .14, m, .1, h, 0, .42, .65); } });
  flatCap(o.head, 0x3a3a48);
  return o;
}
export function makeFireman(scene, i) {
  const o = character(scene, { seed: 70 + i, scale: 1.05, skin: [0xf0c4a2, 0x8d5a3b][i % 2], skinCss: ['#f0c4a2', '#8d5a3b'][i % 2], shirt: 0xd8a018, shirt2: 0xd8a018, cuffs: 0xe8e8e8, pants: 0xd8a018, shoes: 0x111111, belt: 0x111111,
    face: { iris: '#3a2a1a', brows: .3 }, torsoDetail: (sp) => { for (const y of [.5, 1.5]) box(2.12, .22, 1.16, mat(0xe8e8f0, { emissive: 0x888888, emissiveIntensity: .6 }), .04, sp, 0, y, 0); box(1.4, 1.6, .5, mat(0x9aa0aa, { metalness: .6 }), .2, sp, 0, 1.1, -.75); },
    hairBuild: (h) => { const hm = mat(0xc8a010, { roughness: .4 }); const d = new THREE.Mesh(new THREE.SphereGeometry(.85, 20, 12, 0, 6.283, 0, Math.PI / 2), hm); d.position.y = 1.15; d.scale.set(1, .9, 1.1); h.add(d); cyl(1.05, 1.05, .1, hm, 24, h, 0, 1.15, -.1); box(.4, .5, .1, gold(), .05, h, 0, 1.55, .78); } });
  const lamp = new THREE.Group(); lamp.position.set(0, -.6, .5); o.aR.hand.add(lamp); cyl(.18, .24, .8, mat(0x222222, { metalness: .6 }), 12, lamp, 0, 0, 0).rotation.x = Math.PI / 2;
  const sl = new THREE.SpotLight(0xfff6d8, 900, 60, .35, .5, 2); sl.position.set(0, 0, .4); const tg = new THREE.Object3D(); tg.position.set(0, 0, 10); lamp.add(sl, tg); sl.target = tg; o.props.light = sl;
  return o;
}
export function makePolice(scene) {
  const o = character(scene, { seed: 75, skin: 0xe8b896, skinCss: '#e8b896', shirt: 0x2a4a8a, shirt2: 0x2a4a8a, pants: 0x1a2440, shoes: 0x111111, face: { brows: .4 },
    torsoDetail: (sp) => box(.4, .4, .05, gold(), .1, sp, -.5, 1.5, .55),
    hairBuild: (h) => { const m = mat(0x1a2440); cyl(.85, .78, .5, m, 24, h, 0, 1.4, 0); box(1.3, .1, .6, mat(0x111111), .04, h, 0, 1.18, .7); box(.3, .3, .05, gold(), .05, h, 0, 1.45, .8); } });
  return o;
}
export function makeOpa(scene) {
  return character(scene, { seed: 77, scale: .96, skin: 0xefc2a2, skinCss: '#efc2a2', shirtMap: checkTex('#9a5a3a', '#7a3a24', 5), cuffs: 0x7a3a24, pants: 0x5a5a62, shoes: 0x3a2414,
    face: { iris: '#5a6a8a', browColor: '#e8e8e8', mouthY: 12 },
    hairBuild: (h) => { const m = mat(0xf2f2f2); for (const s of [-1, 1]) box(.28, .5, 1, m, .1, h, s * .67, .85, -.1); box(1.36, .45, .3, m, .1, h, 0, .8, -.52); box(.9, .22, .14, m, .1, h, 0, .42, .65);
      const fr = mat(0x8a6a2a, { metalness: .6 }); for (const s of [-1, 1]) { const g = new THREE.Mesh(new THREE.TorusGeometry(.2, .035, 8, 20), fr); g.position.set(s * .29, .86, .64); h.add(g); } flatCap(h, 0x5a4a3a); } });
}
export function makeShadow(scene) {   // la cosa en el humo: alta, negra, ojos que brillan
  const g = new THREE.Group(); scene.add(g); const m = mat(0x060608, { roughness: 1 });
  box(2.6, 9, 1.6, m, .8, g, 0, 4.5, 0); const head = box(2, 2.2, 1.6, m, .7, g, 0, 10, 0);
  for (const s of [-1, 1]) { box(.7, 7, .7, m, .3, g, s * 1.8, 6, 0).rotation.z = s * .12; sphere(.22, new THREE.MeshBasicMaterial({ color: new THREE.Color(4, .3, .2), toneMapped: false }), g, s * .45, 10.2, .82, 10, 8); }
  return g;
}

// ---------- fuego / humo ----------
export function fire(parent, spots, seed = 1) {
  const G = new THREE.Group(); parent.add(G); const r = RNG(seed), items = [];
  const fm = [new THREE.MeshBasicMaterial({ color: new THREE.Color(1.8, .6, .12), toneMapped: false, transparent: true, opacity: .9, depthWrite: false }), new THREE.MeshBasicMaterial({ color: new THREE.Color(2, 1.3, .35), toneMapped: false, transparent: true, opacity: .8, depthWrite: false })];
  for (const [x, z, s] of spots) for (let k = 0; k < 5; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(.6 * s, 2.6 * s, 8, 1, true), fm[k % 2]); c.position.set(x + (r() - .5) * 1.6 * s, 1.2 * s, z + (r() - .5) * 1.6 * s); G.add(c); items.push({ c, ph: r() * 6, s, y0: 1.2 * s }); }
  const smoke = []; const sm = new THREE.MeshStandardMaterial({ color: 0x2a2224, transparent: true, opacity: .55, depthWrite: false, roughness: 1 });
  for (let i = 0; i < 26; i++) { const p = spots[i % spots.length]; const m = new THREE.Mesh(new THREE.SphereGeometry(1.5 + r() * 1.5, 10, 8), sm); m.position.set(p[0] + (r() - .5) * 4, 10 + r() * 6, p[1] + (r() - .5) * 4); G.add(m); smoke.push({ m, ph: r() * 6 }); }
  const lights = spots.slice(0, 3).map(([x, z]) => { const l = new THREE.PointLight(0xff7a2a, 700, 50, 2); l.position.set(x, 5, z); G.add(l); return l; });
  G.userData.update = (T, grow = 1) => { for (const it of items) { const f = 1 + Math.sin(T * 11 + it.ph) * .18 + Math.sin(T * 23 + it.ph * 2) * .1; it.c.scale.set(grow * (1 + Math.sin(T * 7 + it.ph) * .1), grow * f, grow); it.c.position.y = it.y0 * grow * f; it.c.rotation.y = T * 2 + it.ph; }
    for (const s of smoke) { s.m.position.y += 0; s.m.scale.setScalar(1 + Math.sin(T * .7 + s.ph) * .12); } lights.forEach((l, i) => l.intensity = 120 + Math.sin(T * 13 + i * 2) * 40 + Math.sin(T * 31 + i) * 20); };
  return G;
}

// ---------- espejos ----------
const glassTex = canvasTex(128, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#dfeef8'); g.addColorStop(.45, '#a8c8e0'); g.addColorStop(.55, '#eaf6ff'); g.addColorStop(1, '#8aaac8'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
const crackTex = canvasTex(512, 512, (c) => { c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 3; const r = RNG(7);
  for (let i = 0; i < 14; i++) { let x = 256, y = 230, a = i / 14 * 6.283; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 8; k++) { a += (r() - .5) * .7; x += Math.cos(a) * 34; y += Math.sin(a) * 34; c.lineTo(x, y); } c.stroke(); }
  for (let k = 1; k < 4; k++) { c.beginPath(); for (let i = 0; i <= 14; i++) { const a = i / 14 * 6.283, rr = 50 * k + r() * 20; c.lineTo(256 + Math.cos(a) * rr, 230 + Math.sin(a) * rr); } c.stroke(); } });
export function mirrorPlane(parent, w, h) {
  const glass = new THREE.MeshStandardMaterial({ map: glassTex, roughness: .05, metalness: .2, emissive: 0x6a8aa8, emissiveIntensity: .25 });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glass); parent.add(p);
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: crackTex, transparent: true, depthWrite: false })); crack.position.z = .02; crack.visible = false; p.add(crack);
  return { plane: p, glass, crack, w, h };
}
function frame(parent, w, h, m) { box(w + .8, .45, .45, m, .1, parent, 0, h / 2 + .2, 0); box(w + .8, .45, .45, m, .1, parent, 0, -h / 2 - .2, 0); for (const s of [-1, 1]) box(.45, h + .8, .45, m, .1, parent, s * (w / 2 + .2), 0, 0); }

// ---------- escenarios ----------
function shell(scene, X, wall, floorMat, w = 30, d = 22, h = 20) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMat); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(w, h, .6, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.6, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .8, .8, mat(0xffffff), .1, g, 0, .4, -d / 2 + .2);
  return g;
}
const plank = (c1, c2) => canvasTex(256, 256, (c, w, h) => { const r = RNG(3); for (let y = 0; y < h; y += 32) { const l = .9 + r() * .2; c.fillStyle = `rgb(${parseInt(c1.slice(1, 3), 16) * l | 0},${parseInt(c1.slice(3, 5), 16) * l | 0},${parseInt(c1.slice(5, 7), 16) * l | 0})`; c.fillRect(0, y, w, 30); c.fillStyle = c2; c.fillRect(0, y + 30, w, 2); c.fillRect(r() * w, y, 2, 30); } }, true);
export function emilRoom(scene, X) {
  const wall = mat(0xffffff, { map: (() => { const t = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#a8cce8'; c.fillRect(0, 0, w, h); c.fillStyle = '#98bcd8'; c.fillRect(0, 0, 6, h); }, true); t.repeat.set(12, 4); return t; })(), roughness: .9 });
  const ft = plank('#b07a48', '#6a4428'); ft.repeat.set(4, 3); const g = shell(scene, X, wall, mat(0xffffff, { map: ft, roughness: .6 }));
  // espejo de pie sobre la cómoda
  const mg = new THREE.Group(); mg.position.set(-6, 5.8, -10.1); g.add(mg); frame(mg, 6, 10, mat(0x7a4a2a, { roughness: .4 })); for (const sx of [-2.4, 2.4]) box(.5, .4, 2.4, mat(0x7a4a2a), .1, mg, sx, -5.6, .8); const mir = mirrorPlane(mg, 6, 10); mir.plane.position.z = .1;
  box(1.6, .6, 1, mat(0x2a2a2a), .1, g, -12.5, 5.5, -1.6); sphere(.6, mat(0x3a8a3a, { roughness: 1 }), g, -12, 1, -9, 10, 8); cyl(.6, .5, 1.2, mat(0xc86a3a), 12, g, -12, .6, -9);   // altavoz y planta
  // cama, mesita con reloj digital, póster, ventana, alfombra, escritorio
  const bed = new THREE.Group(); bed.position.set(9, 0, -4); g.add(bed); box(8, 2, 13, mat(0x6a4428), .2, bed, 0, 1, 0); box(7.6, 1.2, 12.4, mat(0xffffff), .4, bed, 0, 2.4, 0);
  box(7.8, 1, 8, mat(0xffffff, { map: checkTex('#2f6ab8', '#4f8ad8', 6) }), .4, bed, 0, 3.1, 2); box(4, 1, 2.2, mat(0xffffff), .45, bed, 0, 3.3, -4.6); box(8.2, 5, .6, mat(0x6a4428), .2, bed, 0, 3.5, -6.6);
  box(3, 3, 3, mat(0xf2f2f2), .2, g, 3.2, 1.5, -9); const clk = new THREE.Group(); clk.position.set(3.2, 3.6, -8.4); g.add(clk); box(2, 1, 1, mat(0x111111), .2, clk, 0, .5, 0);
  const digits = ['07:00', '00:00', '19:30'].map(t => { const p = textPlane(1.8, .8, 160, 70, (c, w, h) => { c.fillStyle = '#ff2a2a'; c.shadowColor = '#ff2a2a'; c.shadowBlur = 12; c.font = '700 54px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, w / 2, h / 2 + 3); }, 2.5); p.position.set(0, .5, .52); clk.add(p); p.visible = false; return p; });
  const pst = textPlane(5, 7, 250, 350, (c, w, h) => { c.fillStyle = '#1d2238'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(150, 30); c.lineTo(70, 190); c.lineTo(130, 190); c.lineTo(95, 320); c.lineTo(190, 150); c.lineTo(130, 150); c.lineTo(170, 30); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12); });
  pst.position.set(3, 12, -10.6); g.add(pst);
  const win = textPlane(7, 8, 224, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6ab0f0'); gr.addColorStop(1, '#d8eeff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#4a9a4a'; c.beginPath(); c.arc(50, h, 80, 0, 7); c.arc(180, h + 20, 90, 0, 7); c.fill(); }, .6);
  win.position.set(14.6, 11, -2); win.rotation.y = -Math.PI / 2; g.add(win); const fr = mat(0xffffff); box(.5, 8.6, 7.6, fr, .05, g, 14.5, 11, -2); box(.6, .5, 7.6, fr, 0, g, 14.4, 11, -2);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(5, 40), mat(0x3aa8b8, { roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(-1, .05, -1); g.add(rug);
  box(7, .4, 3.4, mat(0xd8a868), .1, g, -11, 5, -1); for (const s of [-1, 1]) box(.4, 5, 3, mat(0xb88848), .05, g, -11 + s * 3.2, 2.5, -1); for (let i = 0; i < 4; i++) box(.5, 1.6, 1.2, mat([0xd8323a, 0x3a8ad8, 0xf2c23a, 0x5ab85a][i]), .05, g, -12.8 + i * .55, 6, -1.8);
  const L = new THREE.PointLight(0xfff0d8, 420, 60, 2); L.position.set(0, 17, 2); g.add(L);
  return { g, mir, digits, lamp: L };
}
export function hallway(scene, X) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g); const LEN = 80;
  const ft = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#e8dcc8'; c.fillRect(0, 0, w, h); c.fillStyle = '#a8986a'; c.fillRect(0, 0, 64, 64); c.fillRect(64, 64, 64, 64); }, true); ft.repeat.set(6, 30);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(18, LEN), mat(0xffffff, { map: ft, roughness: .35 })); f.rotation.x = -Math.PI / 2; f.position.z = -LEN / 2 + 8; f.receiveShadow = true; g.add(f);
  const wall = mat(0xe8e0cc, { roughness: .9 }); for (const s of [-1, 1]) box(.6, 18, LEN, wall, 0, g, s * 9, 9, -LEN / 2 + 8); box(18, .6, LEN, mat(0xf2f2ee), 0, g, 0, 18, -LEN / 2 + 8);
  box(18, 18, .6, wall, 0, g, 0, 9, -LEN + 8);
  const lk = mat(0xc8323a, { roughness: .45, metalness: .3 }), slot = mat(0x8a1a22);
  for (const s of [-1, 1]) for (let i = 0; i < 26; i++) { const z = 4 - i * 2.4; if (s < 0 && z < -42 && z > -58) continue; const l = box(1.6, 9, 2.2, lk, .05, g, s * 7.9, 4.5, z); for (let k = 0; k < 3; k++) box(.05, .1, 1.4, slot, 0, g, s * 7.08, 7.5 + k * .3, z); sphere(.12, mat(0xdddddd, { metalness: .8 }), g, s * 7.05, 4.5, z + .6, 8, 6); }
  const ban = textPlane(14, 2.4, 700, 120, (c, w, h) => { c.fillStyle = '#1d3a8a'; rrect(c, 4, 4, w - 8, h - 8, 20); c.fill(); c.fillStyle = '#ffd23f'; c.font = `700 74px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SCHULE AM SEE', w / 2, h / 2 + 4); }, .5);
  ban.position.set(0, 13.5, -LEN + 8.4); g.add(ban);
  const winM = mat(0xcfe8ff, { emissive: 0x9fd0ff, emissiveIntensity: 1 }); for (const x of [-4, 4]) box(5, 7, .3, winM, .05, g, x, 7, -LEN + 8.5);
  for (let i = 0; i < 6; i++) { box(6, .3, 1.6, mat(0xffffff, { emissive: 0xfff6e0, emissiveIntensity: 1.5 }), .05, g, 0, 17.7, 2 - i * 13); }
  const L = [0, -26, -52].map(z => { const l = new THREE.PointLight(0xfff2e0, 380, 50, 2); l.position.set(0, 15, z); g.add(l); return l; });
  const ex = textPlane(2.4, 1, 120, 50, (c, w, h) => { c.fillStyle = '#0a8a3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `700 34px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('AUSGANG', w / 2, h / 2 + 2); }, 2); ex.position.set(0, 15.5, -LEN + 8.4); g.add(ex);
  // sección de arriba: estantería y espejo grande en la pared izquierda (z -50)
  const shelf = new THREE.Group(); shelf.position.set(-1, 0, -60); g.add(shelf); const sh = new THREE.Group(); shelf.add(sh); const wd = mat(0x6a4428, { roughness: .6 });
  box(8, .5, 3, wd, .05, sh, 0, .25, 0); box(8, .5, 3, wd, .05, sh, 0, 9.75, 0); for (const s of [-1, 1]) box(.5, 10, 3, wd, .05, sh, s * 3.75, 5, 0); for (let y = 2.6; y < 9; y += 2.4) box(7.4, .3, 3, wd, .05, sh, 0, y, 0);
  const r = RNG(12); for (let y = .5; y < 9; y += 2.4) for (let x = -3.2; x < 3.2; x += .6) box(.5, 1.6 + r() * .5, 2.2, mat([0xc8323a, 0x2a6ab8, 0xe8b830, 0x3a9a5a, 0x8a4ac8][(r() * 5) | 0]), .03, sh, x, y + 1.1, 0);
  sh.position.y = 1.5; sh.rotation.x = Math.PI / 2;   // caída: tumbada en el suelo
  const mg = new THREE.Group(); mg.position.set(-8.6, 8, -50); mg.rotation.y = Math.PI / 2; g.add(mg); frame(mg, 10, 12, gold()); const mir = mirrorPlane(mg, 10, 12); mir.plane.position.z = .15;
  const fireG = fire(g, [[-6, -6, 1.4], [6, -14, 1.6], [-5, -24, 1.3], [5, -34, 1.5], [6, -46, 1.4], [-4, -58, 1.5], [3, -63, 1.2]], 3);
  const glass = []; for (let i = 0; i < 26; i++) { const sg = box(.5 + r() * .5, .5 + r() * .5, .05, mat(0xd8f0ff, { transparent: true, opacity: .8, metalness: .5, roughness: .05 }), 0, g, (r() - .5) * 10, 7 + (r() - .5) * 5, -LEN + 9); glass.push({ m: sg, v: [(r() - .5) * 8, r() * 6, 6 + r() * 8] }); }
  return { g, LEN, shelf, sh, mir, fire: fireG, glass, lights: L, winM };
}
export function classroom(scene, X) {
  const g = shell(scene, X, mat(0xf2e8c8, { roughness: .9 }), (() => { const t = plank('#c8a070', '#8a6a40'); t.repeat.set(4, 3); return mat(0xffffff, { map: t }); })());
  const board = new THREE.Group(); board.position.set(0, 10, -10.5); g.add(board); box(18, 8, .3, mat(0x1e3a2a, { roughness: .9 }), .05, board, 0, 0, 0); box(18.6, .5, .8, mat(0x8a5a34), .05, board, 0, -4.2, .3);
  const desks = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const d = new THREE.Group(); d.position.set((c - 1) * 8, 0, -1 + r * 6); g.add(d); box(5, .4, 3, mat(0xd8b080), .05, d, 0, 3.8, 0); for (const [x, z] of [[-2.2, -1.2], [2.2, -1.2], [-2.2, 1.2], [2.2, 1.2]]) box(.3, 3.8, .3, mat(0x3a3a4a, { metalness: .5 }), 0, d, x, 1.9, z); box(1.8, .1, 2.4, mat(0xffffff), 0, d, 0, 4.05, 0); desks.push(d); }
  const clock = textPlane(2.4, 2.4, 128, 128, (c) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 6; c.stroke(); c.beginPath(); c.moveTo(64, 64); c.lineTo(64, 24); c.moveTo(64, 64); c.lineTo(94, 70); c.stroke(); }); clock.position.set(11, 15, -10.6); g.add(clock);
  const L = new THREE.PointLight(0xfff6e8, 420, 70, 2); L.position.set(0, 17, 4); g.add(L);
  return { g, board, desks };
}
function disasterTex(kind) { return canvasTex(256, 384, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, 0, h); if (kind === 0) { g.addColorStop(0, '#3a1208'); g.addColorStop(1, '#ff7a1a'); } else if (kind === 1) { g.addColorStop(0, '#5a6a7a'); g.addColorStop(1, '#c8b8a0'); } else { g.addColorStop(0, '#1a2a5a'); g.addColorStop(1, '#6a8ac8'); } c.fillStyle = g; c.fillRect(0, 0, w, h);
  if (kind === 0) { c.fillStyle = '#3a2018'; c.fillRect(30, 200, 196, 150); c.fillStyle = '#ffd27a'; for (let i = 0; i < 4; i++) c.fillRect(46 + i * 46, 230, 26, 34); c.fillStyle = '#ff9a2a'; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(20 + i * 26, 210); c.lineTo(34 + i * 26, 110 - (i % 3) * 30); c.lineTo(48 + i * 26, 210); c.fill(); } }
  if (kind === 1) { c.save(); c.translate(128, 340); c.rotate(.25); c.fillStyle = '#4a4a5a'; c.fillRect(-40, -280, 80, 280); c.fillStyle = '#ffe08a'; for (let y = -270; y < 0; y += 24) for (const x of [-30, -6, 18]) c.fillRect(x, y, 12, 14); c.restore(); c.fillStyle = 'rgba(200,190,170,.85)'; for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(40 + i * 28, 350, 30, 0, 7); c.fill(); } }
  if (kind === 2) { c.fillStyle = '#2a3a5a'; for (let i = 0; i < 8; i++) c.fillRect(10 + i * 30, 220 - (i % 3) * 50, 24, 200); c.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 300; i++) c.fillRect(Math.random() * w, Math.random() * 200 + 100, 3, 3); }
  c.strokeStyle = '#d9a531'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); }); }
export function basement(scene, X) {
  const g = shell(scene, X, mat(0x3a3e4a, { roughness: .95 }), mat(0x2a2c34, { roughness: .7 }), 44, 34, 22);
  const mach = new THREE.Group(); mach.position.set(0, 0, -6); g.add(mach); const steel = mat(0x5a6070, { metalness: .8, roughness: .3 });
  cyl(4, 5, 2, steel, 32, mach, 0, 1, 0); cyl(2.4, 2.4, 9, steel, 32, mach, 0, 6.5, 0); cyl(4.2, 3, 3, steel, 32, mach, 0, 12, 0); cyl(1, 1, 6, steel, 16, mach, 0, 16.5, 0);
  const ringM = new THREE.MeshBasicMaterial({ color: new THREE.Color(.4, 2.6, 3), toneMapped: false }); const rings = [];
  for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(4.6 + i * .6, .12, 8, 64), ringM); r.position.y = 5 + i * 2.6; r.rotation.x = Math.PI / 2 + (i - 1) * .3; mach.add(r); rings.push(r); }
  const core = sphere(1.3, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, .4, .3), toneMapped: false }), mach, 0, 8, 2.2); core.visible = false;
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; const p = cyl(.25, .25, 12, mat(0x2a2a2a, { metalness: .6 }), 8, mach, Math.cos(a) * 3.2, 14, Math.sin(a) * 3.2); p.rotation.z = Math.cos(a) * .4; p.rotation.x = -Math.sin(a) * .4; }
  const panels = []; const tex = [0, 1, 2].map(disasterTex);
  for (let i = 0; i < 16; i++) { const a = Math.PI * .15 + i / 15 * Math.PI * .7 + Math.PI, R = 15; const pg = new THREE.Group(); pg.position.set(Math.cos(a) * 17, 6.5 + (i % 2) * 7, -5 + Math.sin(a) * 10); g.add(pg); g.updateMatrixWorld(true); pg.lookAt(X, pg.position.y, -6);
    frame(pg, 4, 6, gold()); const pl = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), new THREE.MeshStandardMaterial({ map: tex[i % 3], emissive: 0xffffff, emissiveMap: tex[i % 3], emissiveIntensity: .9 })); pl.position.z = .15; pg.add(pl); panels.push({ g: pg, pl, kind: i % 3 }); }
  const door = new THREE.Group(); door.position.set(-5, 0, 16.6); g.add(door); const dl = new THREE.Group(); dl.position.set(-2.5, 0, 0); door.add(dl); box(5, 10, .4, mat(0x4a4e5a, { metalness: .6, roughness: .4 }), .05, dl, 2.5, 5, 0);
  const sign = textPlane(4.2, 2.6, 260, 160, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'; for (let i = -4; i < 12; i++) { c.beginPath(); c.moveTo(i * 30, 0); c.lineTo(i * 30 + 15, 0); c.lineTo(i * 30 - 15, h); c.lineTo(i * 30 - 30, h); c.fill(); } c.fillStyle = '#ffd23f'; c.fillRect(14, 30, w - 28, h - 60); c.fillStyle = '#c8101e'; c.font = `700 44px ${FONT}`; c.textAlign = 'center'; c.fillText('GEFAHR', w / 2, 72); c.fillStyle = '#111'; c.font = `700 24px ${FONT}`; c.fillText('ZUTRITT VERBOTEN', w / 2, 108); }, .4);
  sign.position.set(2.5, 6.5, .25); dl.add(sign); const chain = box(1.6, .15, .15, mat(0xb8b8c0, { metalness: .9 }), .05, dl, 4.3, 5, .35); const lock = box(.5, .6, .3, gold(), .1, dl, 4.3, 4.6, .4);
  const stairs = new THREE.Group(); stairs.position.set(14, 0, 10); g.add(stairs); for (let i = 0; i < 10; i++) box(6, .5, 2, mat(0x4a4e5a), .05, stairs, 0, .5 + i * 1.5, -i * 1.8 + 6);
  const fireG = fire(g, [[-12, -14, 1.3], [12, -12, 1.4], [-8, 4, 1.2], [9, 6, 1.2]], 9); fireG.visible = false;
  const L = new THREE.PointLight(0x7ad8ff, 600, 70, 2); L.position.set(0, 15, 0); g.add(L); const red = new THREE.PointLight(0xff2a2a, 0, 60, 2); red.position.set(0, 9, 0); g.add(red);
  return { g, mach, rings, core, panels, door: dl, sign, chain, lock, fire: fireG, red, stairs };
}
export function schoolExt(scene, X) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), mat(0x5ab84a, { roughness: 1 })); grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; g.add(grass);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(14, 60), mat(0xd8d0c0, { roughness: .9 })); path.rotation.x = -Math.PI / 2; path.position.set(0, .04, 10); g.add(path);
  const B = new THREE.Group(); B.position.set(0, 0, -20); g.add(B); const brick = canvasTex(128, 64, (c, w, h) => { c.fillStyle = '#b8483a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a3428'; c.lineWidth = 2; for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); for (let x = (y / 8) % 2 ? 0 : 8; x < w; x += 16) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 8); c.stroke(); } } }, true); brick.repeat.set(10, 5);
  box(70, 26, 20, mat(0xffffff, { map: brick }), 0, B, 0, 13, 0); box(30, 30, 22, mat(0xf2ede0), .2, B, 0, 15, 1);
  const sg = textPlane(26, 3.4, 900, 118, (c, w, h) => { c.fillStyle = '#1d3a8a'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `700 84px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SCHULE AM SEE', w / 2, h / 2 + 4); }, .4); sg.position.set(0, 21, 12.1); B.add(sg);
  const wm = mat(0xcfe8ff, { emissive: 0x6a9ac8, emissiveIntensity: .3, metalness: .3, roughness: .1 }); for (let r = 0; r < 2; r++) for (let i = -6; i <= 6; i++) if (Math.abs(i) > 2 || r) box(3.4, 4.4, .3, wm, .05, B, i * 5, 7 + r * 9, 10.1);
  box(10, 9, .4, mat(0x2a3a5a, { metalness: .5 }), .05, B, 0, 4.5, 12.1); const clk = cyl(2, 2, .4, mat(0xffffff), 24, B, 0, 27, 12.2); clk.rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) for (let i = 0; i < 12; i++) box(.3, 4, .3, mat(0x1d2238, { metalness: .5 }), 0, g, s * (10 + i * 3), 2, 18);
  for (const s of [-1, 1]) { box(30, .3, .3, mat(0x1d2238), 0, g, s * 26, 3.6, 18); box(30, .3, .3, mat(0x1d2238), 0, g, s * 26, 1, 18); }
  const tr = (x, z) => { cyl(.7, .9, 8, mat(0x6a4428), 8, g, x, 4, z); for (let k = 0; k < 5; k++) sphere(3 + (k % 2), mat(0x3a9a3a, { roughness: 1 }), g, x + Math.sin(k * 2) * 2, 9 + (k % 3) * 1.5, z + Math.cos(k * 2) * 2, 12, 8); };
  for (const [x, z] of [[-30, 6], [30, 4], [-42, -4], [44, -2]]) tr(x, z);
  const pole = cyl(.2, .2, 22, mat(0xdddddd, { metalness: .7 }), 8, g, 18, 11, 22); const flag = box(5, 3, .1, mat(0x2a6ab8), 0, g, 20.6, 20.4, 22);
  const dust = []; const dm = new THREE.MeshStandardMaterial({ color: 0xc8b8a0, transparent: true, opacity: .8, roughness: 1, depthWrite: false }); const r = RNG(5); for (let i = 0; i < 30; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(3 + r() * 4, 10, 8), dm); d.position.set((r() - .5) * 70, 2 + r() * 6, -10 + (r() - .5) * 20); d.visible = false; g.add(d); dust.push(d); }
  return { g, B, dust, flag };
}
export function kiosk(parent, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
  box(12, 10, 8, mat(0xf2e8d8), .3, g, 0, 5, 0); box(12.6, 1.4, 8.6, mat(0xd8323a), .2, g, 0, 10.6, 0);
  const sg = textPlane(10, 2, 500, 100, (c, w, h) => { c.fillStyle = '#ffd23f'; rrect(c, 4, 4, w - 8, h - 8, 18); c.fill(); c.fillStyle = '#c8101e'; c.font = `700 70px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('LOTTO · KIOSK', w / 2, h / 2 + 4); }, .6); sg.position.set(0, 12.6, 4.35); g.add(sg);
  const mg = new THREE.Group(); mg.position.set(-2, 5.2, 4.05); g.add(mg); frame(mg, 6, 6, mat(0x2a2a2a)); const mir = mirrorPlane(mg, 6, 6); mir.plane.position.z = .1;
  box(3.4, 6.4, .3, mat(0x6a3a22), .05, g, 3.8, 3.2, 4.05);
  return { g, mir };
}
export function car(parent) {
  const g = new THREE.Group(); parent.add(g); const b = mat(0xd8323a, { roughness: .25, metalness: .3 });
  box(6, 2.4, 12, b, .7, g, 0, 2, 0); box(5.4, 2.2, 6, mat(0xbfe6ff, { roughness: .05, metalness: .3 }), .6, g, 0, 4.1, -.6);
  for (const [x, z] of [[-3, -4], [3, -4], [-3, 4], [3, 4]]) { const w = cyl(1.1, 1.1, .9, mat(0x1a1a22), 16, g, x, 1.1, z); w.rotation.z = Math.PI / 2; }
  for (const s of [-1, 1]) sphere(.45, mat(0xfff6c8, { emissive: 0xfff2b0, emissiveIntensity: 2 }), g, s * 2.2, 2.4, 6);
  return g;
}
export function phone(parent) { const g = new THREE.Group(); parent.add(g); box(.6, 1.1, .1, mat(0x111111, { metalness: .5 }), .06, g, 0, 0, 0); const s = textPlane(.5, .95, 50, 95, (c, w, h) => { c.fillStyle = '#1a6ad8'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = '700 22px sans-serif'; c.textAlign = 'center'; c.fillText('110', w / 2, 50); }, 2); s.position.z = .06; g.add(s); return g; }
export function paperSign(parent) { const p = textPlane(3.4, 2.4, 340, 240, (c, w, h) => { c.fillStyle = '#c8a878'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(80,40,20,.3)'; for (let i = 0; i < 40; i++) c.fillRect(Math.random() * w, Math.random() * h, 8, 3); c.fillStyle = '#2a1a10'; c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.fillText('HÖR AUF,', w / 2, 100); c.fillText('MICH ZU RETTEN', w / 2, 170); }); parent.add(p); return p; }
export function handMirror(parent) { const g = new THREE.Group(); parent.add(g); const t = new THREE.Mesh(new THREE.TorusGeometry(.75, .1, 8, 24), mat(0xf27aa8)); g.add(t); cyl(.08, .1, 1.2, mat(0xf27aa8), 8, g, 0, -1.3, 0); const m = mirrorPlane(g, 1.4, 1.4); m.plane.geometry = new THREE.CircleGeometry(.72, 24); m.plane.position.z = .02; return { g, mir: m }; }
