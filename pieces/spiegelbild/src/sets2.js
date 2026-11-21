// Interiores y escenarios secundarios + objetos de atrezo.
import { THREE, RNG, canvasTex, mat, box, cyl, sphere, rrect, textPlane, checkTex } from './engine.js';
import { cobbleTex, plankTex, roofTex, FONT, streetLamp } from './sets.js';
import { makeTownsperson, makeSheep, tyroleanHat } from './cast.js';

const brassM = () => mat(0xd9a531, { metalness: .75, roughness: .28 });
const rep = (t, x, y) => { const c = t.clone(); c.needsUpdate = true; c.repeat.set(x, y); return c; };
// habitación: suelo + 3 paredes (sin pared delantera para la cámara)
function room(parent, w, d, h, wallMat, floorMat) {
  const g = new THREE.Group(); parent.add(g);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMat); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(w, h, 0.6, wallMat, 0, g, 0, h / 2, -d / 2);
  for (const s of [-1, 1]) box(0.6, h, d, wallMat, 0, g, s * w / 2, h / 2, 0);
  return g;
}
function windowFrame(parent, x, y, z, w, h, inside = '#141c4a', moon = true) {
  const pl = textPlane(w, h, 256, 256 * h / w, (c, cw, ch) => { const g = c.createLinearGradient(0, 0, 0, ch); g.addColorStop(0, inside); g.addColorStop(1, '#4a3a8a'); c.fillStyle = g; c.fillRect(0, 0, cw, ch);
    const r = RNG(2); c.fillStyle = '#fff'; for (let i = 0; i < 40; i++) { c.globalAlpha = .4 + r() * .6; c.fillRect(r() * cw, r() * ch * .7, 2, 2); } c.globalAlpha = 1;
    if (moon) { c.fillStyle = '#fff6d6'; c.shadowColor = '#fff6d6'; c.shadowBlur = 30; c.beginPath(); c.arc(cw * .7, ch * .3, cw * .12, 0, 7); c.fill(); } }, 0.8);
  pl.position.set(x, y, z); parent.add(pl);
  const fr = mat(0xffffff, { roughness: .5 });
  box(w + 0.6, 0.4, 0.5, fr, 0.1, parent, x, y + h / 2, z); box(w + 0.6, 0.5, 0.9, fr, 0.1, parent, x, y - h / 2, z + 0.2);
  box(0.4, h, 0.5, fr, 0.1, parent, x - w / 2, y, z); box(0.4, h, 0.5, fr, 0.1, parent, x + w / 2, y, z);
  box(0.25, h, 0.3, fr, 0.05, parent, x, y, z + 0.05); box(w, 0.25, 0.3, fr, 0.05, parent, x, y, z + 0.05);
  return pl;
}

// ---------- habitación del bebé ----------
export function nursery(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const wall = mat(0xffffff, { map: rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#2d3f8f'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd86a';
    for (const [sx, sy] of [[20, 24], [84, 60], [44, 100], [104, 112]]) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283 - 1.57, r = i % 2 ? 4 : 9; c.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } c.fill(); }
    c.fillStyle = '#f2e6c8'; c.beginPath(); c.arc(70, 22, 8, 0, 7); c.fill(); }, true), 6, 3) });
  room(g, 34, 26, 22, wall, mat(0xffffff, { map: rep(plankTex, 4, 3) }));
  windowFrame(g, 9, 12, -12.6, 7, 8);
  // cuna de barrotes
  const crib = new THREE.Group(); crib.position.set(-2, 0, -4); g.add(crib);
  const wood = mat(0xf2d7a8, { roughness: .5 });
  box(8, 0.6, 5, wood, 0.1, crib, 0, 2.6, 0); box(7.6, 0.8, 4.6, mat(0xffffff), 0.3, crib, 0, 3.2, 0);
  for (const s of [-1, 1]) for (let i = 0; i < 9; i++) cyl(0.12, 0.12, 3.4, wood, 8, crib, -3.6 + i * 0.9, 4.0, s * 2.4);
  for (const s of [-1, 1]) { box(0.4, 6, 0.4, wood, 0.1, crib, s * 3.9, 3, -2.4); box(0.4, 6, 0.4, wood, 0.1, crib, s * 3.9, 3, 2.4); box(8.2, 0.35, 0.4, wood, 0.1, crib, 0, 5.7, s * 2.4); }
  box(4, 0.5, 3.6, mat(0xffffff, { map: checkTex('#9fd0f0', '#ffffff', 4) }), 0.25, crib, 0.8, 3.75, 0);
  // bebé (pequeño, cabeza grande)
  const baby = new THREE.Group(); baby.position.set(-1.8, 3.9, 0); crib.add(baby);
  box(1.6, 1.0, 1.8, mat(0xbfe3ff), 0.4, baby, 0.6, 0, 0);
  const bh = box(1.3, 1.25, 1.25, mat(0xf7d2b6), 0.35, baby, -0.9, 0.2, 0);
  const bface = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshStandardMaterial({ transparent: true, map: babyFace(false) })); bface.position.set(-0.9, 0.86, 0); bface.rotation.x = -Math.PI / 2; bface.rotation.z = Math.PI / 2; baby.add(bface);
  // móvil con lunas y ovejas
  const mobile = new THREE.Group(); mobile.position.set(-1.8, 10, 0); crib.add(mobile);
  cyl(0.05, 0.05, 3, mat(0xd9a531), 6, mobile, 0, 1.5, 0);
  for (let i = 0; i < 4; i++) { const a = i / 4 * 6.283, it = new THREE.Group(); it.position.set(Math.cos(a) * 1.6, -1.2, Math.sin(a) * 1.6); mobile.add(it);
    cyl(0.02, 0.02, 1.2, mat(0xffffff), 4, it, 0, 0.6, 0); if (i % 2) sphere(0.4, mat(0xfff0a0, { emissive: 0x6a5a00 }), it, 0, -0.2, 0); else { for (let k = 0; k < 4; k++) sphere(0.25, mat(0xffffff), it, (k - 1.5) * 0.18, -0.2, 0); } }
  const bar = box(2.4, 0.15, 0.15, brassM(), 0.05, mobile, 0, 0, 0); box(0.15, 0.15, 3.2, brassM(), 0.05, mobile, 0, 0, 0);
  // libro de nanas tachado y despertador gigante
  const book = new THREE.Group(); book.position.set(7, 0, 2); g.add(book);
  box(2.2, 4, 2.2, mat(0xb07a45), 0.2, book, 0, 2, 0);
  const cover = textPlane(2.4, 3.0, 128, 160, (c, w, h) => { c.fillStyle = '#7a2a5a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd27a'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.fillText('SCHLAF-', w / 2, 60); c.fillText('LIEDER', w / 2, 86);
    c.fillStyle = '#fff'; c.font = `700 30px ${FONT}`; c.fillText('♪ ☾', w / 2, 128); });
  cover.position.set(0, 5.6, 0); cover.rotation.x = -0.25; book.add(cover);
  const coverBack = box(2.4, 3.0, 0.3, mat(0x7a2a5a), 0.05, book, 0, 5.6, -0.2); coverBack.rotation.x = -0.25;
  const cross = new THREE.Group(); cross.position.set(0, 5.6, 0.4); book.add(cross);
  for (const r of [0.8, -0.8]) { const b = box(3.4, 0.4, 0.1, mat(0xff2a3a, { emissive: 0xff2a3a, emissiveIntensity: 1.2 }), 0.05, cross, 0, 0, 0); b.rotation.z = r; }
  const clock = alarmClock(g, -2, 5.8, 3.2);
  const mother = makeTownsperson(scene, 0);
  return { g, crib, baby, babyFace: bface, mobile, book, cross, clock, mother };
}
export function babyFace(awake) {
  return canvasTex(256, 256, (c) => { c.clearRect(0, 0, 256, 256); c.strokeStyle = '#2a1d1a'; c.fillStyle = '#2a1d1a'; c.lineWidth = 10; c.lineCap = 'round';
    if (awake) { for (const x of [84, 172]) { c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x, 110, 30, 36, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#2a1d1a'; c.beginPath(); c.arc(x, 112, 14, 0, 7); c.fill(); }
      c.fillStyle = '#5a1620'; c.beginPath(); c.ellipse(128, 180, 22, 26, 0, 0, 7); c.fill(); }
    else { for (const x of [84, 172]) { c.beginPath(); c.arc(x, 104, 20, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke(); } c.beginPath(); c.arc(128, 168, 14, 0, Math.PI); c.stroke(); }
    c.fillStyle = 'rgba(255,120,130,.4)'; c.beginPath(); c.ellipse(56, 150, 18, 10, 0, 0, 7); c.ellipse(200, 150, 18, 10, 0, 0, 7); c.fill(); });
}
export function alarmClock(parent, x, y, z, s = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
  const red = mat(0xe8323a, { roughness: .3, metalness: .2 });
  const body = cyl(1.4, 1.4, 0.9, red, 32, g, 0, 0, 0); body.rotation.x = Math.PI / 2;
  const face = textPlane(2.4, 2.4, 128, 128, (c) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.fillStyle = '#222'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.fillRect(64 + Math.cos(a) * 50 - 3, 64 + Math.sin(a) * 50 - 3, 6, 6); }
    c.strokeStyle = '#222'; c.lineWidth = 6; c.beginPath(); c.moveTo(64, 64); c.lineTo(64, 24); c.moveTo(64, 64); c.lineTo(92, 64); c.stroke(); });
  face.position.z = 0.47; g.add(face);
  const bells = [];
  for (const s2 of [-1, 1]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 10, 0, 6.283, 0, Math.PI / 2), mat(0xd9a531, { metalness: .8, roughness: .25 })); b.position.set(s2 * 0.85, 1.45, 0); b.rotation.z = s2 * -0.5; g.add(b); bells.push(b); }
  const hammer = box(0.12, 0.7, 0.12, mat(0x222222), 0.04, g, 0, 1.6, 0);
  for (const s2 of [-1, 1]) { const l = cyl(0.1, 0.1, 1.0, red, 8, g, s2 * 0.9, -1.3, 0); l.rotation.z = s2 * 0.4; }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return { g, bells, hammer };
}

// ---------- prado de las ovejas (junto a la muralla) ----------
export function meadow(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const grassT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#2f7a4a'; c.fillRect(0, 0, w, h); const r = RNG(8); for (let i = 0; i < 900; i++) { c.fillStyle = r() < .5 ? '#3f9a5a' : '#256a3e'; c.fillRect(r() * w, r() * h, 2, 6); } }, true);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(260, 200), mat(0xffffff, { map: rep(grassT, 30, 24) })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; g.add(gr);
  // muralla de piedra con almenas y una torre redonda
  const stoneT = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#8a8098'; c.fillRect(0, 0, w, h); const r = RNG(5); for (let y = 0; y < h; y += 22) for (let xx = (y / 22) % 2 ? -20 : 0; xx < w; xx += 40) { const l = .85 + r() * .25; c.fillStyle = `rgb(${150 * l | 0},${142 * l | 0},${168 * l | 0})`; rrect(c, xx + 2, y + 2, 36, 18, 5); c.fill(); } }, true);
  const wallM = mat(0xffffff, { map: rep(stoneT, 12, 2) });
  box(200, 18, 6, wallM, 0, g, 0, 9, -60);
  for (let i = -12; i <= 12; i++) box(4, 3, 6.4, wallM, 0, g, i * 8, 19.5, -60);
  const tw = cyl(10, 10, 34, mat(0xffffff, { map: rep(stoneT, 6, 3) }), 24, g, 40, 17, -60);
  const twr = new THREE.Mesh(new THREE.ConeGeometry(12, 14, 24), mat(0xffffff, { map: rep(roofTex, 4, 2) })); twr.position.set(40, 41, -60); g.add(twr);
  // valla de madera
  const fw = mat(0x8a6a4a, { roughness: .8 });
  for (let i = -6; i <= 6; i++) { box(0.6, 4, 0.6, fw, 0.1, g, i * 6, 2, -14); }
  for (const y of [1.6, 3.2]) box(74, 0.5, 0.3, fw, 0.1, g, 0, y, -14);
  // árboles redondos y flores
  const leaf = mat(0x2f7a3a, { roughness: .9 });
  for (const [tx, tz] of [[-34, -30], [26, -36], [-50, -44]]) { cyl(0.8, 1, 8, mat(0x5a3a22), 8, g, tx, 4, tz); for (let k = 0; k < 6; k++) sphere(3 + (k % 3), leaf, g, tx + Math.sin(k * 2) * 2.5, 10 + (k % 2) * 2.5, tz + Math.cos(k * 2) * 2.5); }
  for (let i = 0; i < 40; i++) { const r = RNG(i + 30); sphere(0.3, mat(['#ffd23f', '#ffffff', '#ff7ab0'][i % 3]), g, (r() - .5) * 60, 0.3, (r() - .5) * 20 + 4); }
  const sheep = [0, 1, 2].map(i => makeSheep(scene, i));
  const counter = makeTownsperson(scene, 1);
  return { g, sheep, counter };
}

// ---------- Hinterhof: mercado negro de almohadas ----------
export function hinterhof(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const brickT = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#4a2a2a'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) for (let xx = (y / 16) % 2 ? -16 : 0; xx < w; xx += 32) { c.fillStyle = ['#8a3a34', '#7a3430', '#9a4a3a'][(xx + y) % 3 & 3] || '#8a3a34'; c.fillRect(xx + 1, y + 1, 30, 14); } }, true);
  const brick = mat(0xffffff, { map: rep(brickT, 6, 6) });
  room(g, 40, 34, 30, brick, mat(0xffffff, { map: rep(cobbleTex, 5, 4) }));
  // barriles, cajas, cuerda de tender
  const wood = mat(0x8a5a34, { roughness: .8 });
  for (const [bx, bz] of [[-14, -10], [-11, -12], [15, -11]]) { cyl(1.6, 1.6, 4, wood, 18, g, bx, 2, bz); for (const y of [0.8, 3.2]) cyl(1.65, 1.65, 0.3, mat(0x3a3a3a, { metalness: .6 }), 18, g, bx, y, bz); }
  for (const [cx, cy, cz] of [[12, 1.5, -6], [12, 4.5, -6], [15, 1.5, -5]]) box(3, 3, 3, mat(0xa07a4a), 0.1, g, cx, cy, cz);
  const line = cyl(0.04, 0.04, 34, mat(0xeeeeee), 4, g, 0, 20, -8); line.rotation.z = Math.PI / 2;
  for (let i = 0; i < 5; i++) { const sh = box(2.4, 3, 0.1, mat([0xffffff, 0xf2b8c6, 0x9fd0f0, 0xffd27a, 0xb9e3b0][i]), 0.05, g, -10 + i * 5, 18.4, -8); sh.rotation.z = (i % 2 ? .05 : -.06); }
  const lamp = box(1, 1.4, 1, mat(0xfff0b0, { emissive: 0xffb84a, emissiveIntensity: 2.5 }), 0.2, g, -6, 16, -16.4);
  const L = new THREE.PointLight(0xffa84a, 500, 60, 2); L.position.set(-6, 15, -14); g.add(L);
  // gato en el muro
  const cat = new THREE.Group(); cat.position.set(-15.5, 7.8, -12); g.add(cat);
  box(2, 1.1, 1, mat(0x2a2a30), 0.4, cat, 0, 0, 0); const ch = box(1, 1, 1, mat(0x2a2a30), 0.3, cat, 1.2, 0.5, 0);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 4), mat(0x2a2a30)); e.position.set(1.2, 1.15, s * 0.3); cat.add(e); sphere(0.12, mat(0xfff06a, { emissive: 0xffe03a, emissiveIntensity: 2 }), cat, 1.71, 0.6, s * 0.25); }
  const tail = box(0.25, 1.6, 0.25, mat(0x2a2a30), 0.1, cat, -1.1, 0.6, 0); tail.rotation.z = 0.5;
  box(3, 7.8, 3, brick, 0, g, -15.5, 3.9, -12);
  // mostrador (Ladentisch) con la almohada escondida
  const counter = new THREE.Group(); counter.position.set(0, 0, -4); g.add(counter);
  box(10, 4, 3.6, mat(0x6b3f22), 0.2, counter, 0, 2, 0); box(10.6, 0.5, 4.2, mat(0x8a5634), 0.1, counter, 0, 4.2, 0);
  const pillow = new THREE.Group(); pillow.position.set(0, 1.6, 1.0); counter.add(pillow);
  box(3.2, 1.0, 2.2, mat(0xffffff, { emissive: 0xfff2d0, emissiveIntensity: 0.6, roughness: .9 }), 0.45, pillow, 0, 0, 0);
  for (const s of [-1, 1]) for (const t of [-1, 1]) sphere(0.25, mat(0xffffff), pillow, s * 1.5, 0, t * 1.0);
  const vendor = makeTownsperson(scene, 3);
  // gabardina oscura sobre el Tracht
  box(2.4, 2.5, 1.35, mat(0x3a3428, { roughness: .9 }), 0.2, vendor.spine, 0, 0.9, 0);
  box(2.5, 1.8, 1.45, mat(0x3a3428, { roughness: .9 }), 0.2, vendor.hips, 0, -0.6, 0);
  return { g, counter, pillow, vendor, cat };
}

// ---------- cuarto de Finn (buhardilla) ----------
export function finnRoom(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const wallM = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#e8c890'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8b070'; c.fillRect(0, 0, 8, h); c.fillRect(32, 0, 8, h); }, true), 10, 4) });
  room(g, 34, 26, 24, wallM, mat(0xffffff, { map: rep(plankTex, 4, 3) }));
  // vigas inclinadas del tejado
  for (let i = -2; i <= 2; i++) { const b = box(1.2, 1.4, 30, mat(0x6b4426), 0.1, g, i * 7, 20, 0); }
  const win = windowFrame(g, 0, 13, -12.6, 8, 9, '#0a1040', true);
  // cama con edredón de cuadros, mesa con lámpara, póster del sol
  box(9, 2.4, 14, mat(0x8a5634), 0.3, g, 11, 1.2, -4); box(8.6, 1.4, 13.4, mat(0xffffff, { map: checkTex('#ffffff', '#d63a3a', 5) }), 0.5, g, 11, 3, -4);
  box(4, 1.2, 2.6, mat(0xffffff), 0.5, g, 11, 4.2, -9.4);
  box(8, 0.5, 4.5, mat(0x8a5634), 0.1, g, -10, 5.5, -9); for (const s of [-1, 1]) box(0.5, 5.5, 0.5, mat(0x6b4426), 0.1, g, -10 + s * 3.6, 2.75, -9);
  const desklamp = sphere(0.6, mat(0xfff0b0, { emissive: 0xffc25a, emissiveIntensity: 3 }), g, -12, 7.6, -9.5);
  const L = new THREE.PointLight(0xffb060, 420, 50, 2); L.position.set(-12, 9, -7); g.add(L);
  const poster = textPlane(6, 7.5, 256, 320, (c, w, h) => { c.fillStyle = '#fdf0d0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c87a2a'; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12);
    c.fillStyle = '#ffb000'; c.beginPath(); c.arc(w / 2, 140, 60, 0, 7); c.fill(); c.strokeStyle = '#ffb000'; c.lineWidth = 10; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.beginPath(); c.moveTo(w / 2 + Math.cos(a) * 76, 140 + Math.sin(a) * 76); c.lineTo(w / 2 + Math.cos(a) * 104, 140 + Math.sin(a) * 104); c.stroke(); }
    c.fillStyle = '#7a2a2a'; c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.fillText('SONNE?', w / 2, 290); });
  poster.position.set(-10, 15, -12.65); g.add(poster);
  // el plan (en la pared lateral): Wachter con el bigote tachado
  const plan = textPlane(9, 7, 360, 280, (c, w, h) => { c.fillStyle = '#f4ead2'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a2a3a'; c.lineWidth = 6;
    c.strokeRect(120, 40, 120, 120); c.beginPath(); c.arc(155, 85, 9, 0, 7); c.arc(205, 85, 9, 0, 7); c.stroke(); c.lineWidth = 8; c.beginPath(); c.moveTo(130, 125); c.lineTo(180, 118); c.lineTo(235, 108); c.stroke();
    c.strokeStyle = '#e8323a'; c.lineWidth = 10; c.beginPath(); c.ellipse(182, 120, 70, 28, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(110, 150); c.lineTo(255, 92); c.stroke();
    c.fillStyle = '#2a2a3a'; c.font = `700 30px ${FONT}`; c.fillText('PLAN:', 20, 210); c.fillStyle = '#e8323a'; c.fillText('SCHNURRBART AB!', 20, 250);
    c.strokeStyle = '#2a6aba'; c.lineWidth = 5; c.beginPath(); c.moveTo(40, 60); c.quadraticCurveTo(70, 160, 110, 150); c.stroke(); });
  plan.position.set(-16.6, 12, -2); plan.rotation.y = Math.PI / 2; g.add(plan);
  return { g, win, poster, plan };
}

// reloj de cuco de la Selva Negra
export function cuckooClock(parent, x, y, z, s = 1, seed = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
  const wood = mat([0x6b3f22, 0x7a4a2a, 0x5a3420][seed % 3], { roughness: .6 });
  box(3, 3.4, 1.2, wood, 0.1, g, 0, 0, 0);
  for (const sg of [-1, 1]) { const r = box(2.3, 0.25, 1.6, mat(0x3a2414), 0.05, g, sg * 0.95, 2.1, 0); r.rotation.z = sg * -0.65; }
  const face = textPlane(1.6, 1.6, 96, 96, (c) => { c.fillStyle = '#fdf6e0'; c.beginPath(); c.arc(48, 48, 46, 0, 7); c.fill(); c.fillStyle = '#222'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.fillRect(48 + Math.cos(a) * 36 - 2, 48 + Math.sin(a) * 36 - 2, 4, 4); }
    c.strokeStyle = '#222'; c.lineWidth = 4; const h = seed * 0.7, m = seed * 2.3; c.beginPath(); c.moveTo(48, 48); c.lineTo(48 + Math.sin(h) * 20, 48 - Math.cos(h) * 20); c.moveTo(48, 48); c.lineTo(48 + Math.sin(m) * 30, 48 - Math.cos(m) * 30); c.stroke(); });
  face.position.set(0, -0.2, 0.62); g.add(face);
  box(0.8, 0.7, 0.1, mat(0x3a2414), 0.03, g, 0, 1.25, 0.62);
  for (let i = 0; i < 3; i++) { const l = box(0.5, 0.3, 0.08, mat(0x2f6a3a), 0.04, g, -1.1 + i * 1.1, -1.55, 0.62); l.rotation.z = (i - 1) * 0.3; }
  const pend = new THREE.Group(); pend.position.set(0, -1.7, 0.3); g.add(pend);
  cyl(0.04, 0.04, 2.4, brassM(), 4, pend, 0, -1.2, 0); const pb = cyl(0.35, 0.35, 0.1, brassM(), 16, pend, 0, -2.4, 0); pb.rotation.x = Math.PI / 2;
  for (const sg of [-1, 1]) { cyl(0.02, 0.02, 2.8 + seed % 2, mat(0x333333), 4, g, sg * 0.6, -3.1, 0.2); const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.0, 8), mat(0x5a3a1a)); cone.position.set(sg * 0.6, -4.8 - (seed % 2) * 0.6 * sg, 0.2); g.add(cone); }
  return { g, pend };
}

// ---------- taller del relojero ----------
export function workshop(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const wallM = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#c8a070'; c.fillRect(0, 0, w, h); c.fillStyle = '#b08a5a'; for (let y = 0; y < h; y += 16) c.fillRect(0, y, w, 2); }, true), 8, 6) });
  room(g, 40, 28, 26, wallM, mat(0xffffff, { map: rep(plankTex, 4, 3) }));
  const clocks = [];
  let k = 0;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 7; i++) { const c = cuckooClock(g, -15 + i * 5 + (row % 2) * 1.5, 8 + row * 6.2, -13.4, 0.8 + ((i + row) % 3) * 0.12, k++); clocks.push(c); }
  // banco de trabajo con herramientas y lupa con lámpara
  const bench = new THREE.Group(); bench.position.set(0, 0, -3); g.add(bench);
  box(18, 0.8, 6, mat(0x8a5634), 0.15, bench, 0, 5.2, 0); for (const s of [-1, 1]) box(0.8, 5, 5, mat(0x6b4426), 0.1, bench, s * 8, 2.5, 0);
  for (let i = 0; i < 6; i++) { const gear = cyl(0.5 + (i % 3) * 0.2, 0.5 + (i % 3) * 0.2, 0.12, brassM(), 16, bench, -5 + i * 1.6, 5.7, 1.2); }
  for (let i = 0; i < 4; i++) box(0.12, 0.12, 1.6, mat(0x9aa0aa, { metalness: .8, roughness: .3 }), 0.03, bench, 3 + i * 0.6, 5.7, -1.2);
  const lampArm = cyl(0.12, 0.12, 5, mat(0x2a2a2a, { metalness: .6 }), 8, bench, 6, 7.6, -1.5); lampArm.rotation.z = 0.5;
  const lens = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.15, 8, 24), mat(0x2a2a2a, { metalness: .6 })); lens.position.set(4.6, 9.4, -1); g.add(lens);
  sphere(0.5, mat(0xfff0c0, { emissive: 0xffd27a, emissiveIntensity: 3 }), bench, 4.6, 9.8, -1.6);
  const L = new THREE.PointLight(0xffc070, 700, 60, 2); L.position.set(2, 14, 4); g.add(L);
  return { g, clocks, bench };
}

// ---------- callejón con cubo de basura ----------
export function alley(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const wallM = mat(0x8a7aa8, { roughness: .9 });
  room(g, 18, 40, 30, wallM, mat(0xffffff, { map: rep(cobbleTex, 2, 4) }));
  for (let i = 0; i < 4; i++) box(0.4, 3, 2.4, mat(0xffd27a, { emissive: 0xffa84a, emissiveIntensity: 1 }), 0, g, -8.6, 12 + (i % 2) * 7, -12 + i * 6);
  const can = new THREE.Group(); can.position.set(1.5, 0, -6); g.add(can);
  const metal = mat(0x7a8a9a, { metalness: .7, roughness: .35 });
  cyl(1.7, 1.5, 4.2, metal, 24, can, 0, 2.1, 0);
  for (const y of [0.8, 2.1, 3.4]) cyl(1.74, 1.74, 0.2, metal, 24, can, 0, y, 0);
  const lid = new THREE.Group(); lid.position.set(-1.7, 4.25, 0); can.add(lid);
  cyl(1.85, 1.85, 0.25, metal, 24, lid, 1.7, 0, 0); box(0.9, 0.3, 0.3, metal, 0.1, lid, 1.7, 0.3, 0);
  for (let i = 0; i < 3; i++) sphere(0.5, mat([0x6a8a4a, 0xd8c070, 0x9a7a5a][i]), can, (i - 1) * 0.7, 4.3, 0.3);
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(2.6, 24), mat(0x4a5aa8, { metalness: .6, roughness: .05 })); puddle.rotation.x = -Math.PI / 2; puddle.position.set(-3, 0.03, 2); g.add(puddle);
  const L = new THREE.PointLight(0xffb060, 360, 40, 2); L.position.set(-5, 12, -4); g.add(L);
  return { g, can, lid };
}

// ---------- dentro de la torre: engranajes ----------
export function towerInterior(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const stone = mat(0xbfb0a0, { roughness: .9 });
  room(g, 30, 26, 34, stone, mat(0xffffff, { map: rep(plankTex, 3, 3) }));
  // la esfera vista desde dentro (translúcida, con luz detrás)
  const back = textPlane(16, 16, 512, 512, (c) => { c.fillStyle = 'rgba(255,240,200,.95)'; c.beginPath(); c.arc(256, 256, 250, 0, 7); c.fill();
    c.fillStyle = 'rgba(80,60,40,.6)'; c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    ['XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IIII', 'III', 'II', 'I'].forEach((r, i) => { const a = i / 12 * 6.283 - 1.5708; c.fillText(r, 256 + Math.cos(a) * 180, 256 + Math.sin(a) * 180); }); }, 1.4);
  back.position.set(0, 16, -12.6); g.add(back);
  const axle = cyl(0.5, 0.5, 3, brassM(), 16, g, 0, 16, -11); axle.rotation.x = Math.PI / 2;
  const gears = [];
  const gear = (r, gx, gy, gz, teeth) => { const gg = new THREE.Group(); gg.position.set(gx, gy, gz); g.add(gg);
    const d = cyl(r, r, 0.6, brassM(), 32, gg, 0, 0, 0); d.rotation.x = Math.PI / 2;
    for (let i = 0; i < teeth; i++) { const a = i / teeth * 6.283; const t = box(0.6, 0.7, 0.6, brassM(), 0.05, gg, Math.cos(a) * (r + 0.3), Math.sin(a) * (r + 0.3), 0); t.rotation.z = a; }
    const hub = cyl(r * 0.3, r * 0.3, 0.8, mat(0x6a4a2a, { metalness: .5 }), 16, gg, 0, 0, 0); hub.rotation.x = Math.PI / 2;
    for (let i = 0; i < 4; i++) { const sp = box(r * 1.6, 0.3, 0.3, mat(0x8a6a2a, { metalness: .6 }), 0.05, gg, 0, 0, 0.1); sp.rotation.z = i * Math.PI / 4; }
    gears.push(gg); return gg; };
  gear(4, -8, 10, -9, 22); gear(2.6, -2.5, 6, -8.5, 14); gear(5, 9, 22, -9.5, 26); gear(2, 5, 9, -8, 12); gear(3, -10, 24, -9, 16);
  for (const [bx, by] of [[-14, 30], [14, 30]]) box(1.2, 1.2, 26, mat(0x6b4426), 0.1, g, bx, by, 0);
  box(30, 1.2, 1.2, mat(0x6b4426), 0.1, g, 0, 30, -8);
  // escalera
  for (let i = 0; i < 10; i++) box(5, 0.5, 2, mat(0x8a5634), 0.1, g, 10, 0.5 + i * 1.4, 6 - i * 1.6);
  const L = new THREE.PointLight(0xffd090, 900, 70, 2); L.position.set(0, 16, -8); g.add(L);
  return { g, gears, back, axle };
}

// ---------- atrezo ----------
export function pocketWatch(parent, s = 1) {
  const g = new THREE.Group(); g.scale.setScalar(s); parent.add(g);
  const body = cyl(1, 1, 0.35, brassM(), 32, g, 0, 0, 0); body.rotation.x = Math.PI / 2;
  const face = textPlane(1.7, 1.7, 256, 256, (c) => { c.fillStyle = '#fdf6e0'; c.beginPath(); c.arc(128, 128, 126, 0, 7); c.fill(); c.fillStyle = '#222'; c.font = `700 28px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i / 12 * 6.283 - 1.5708; c.fillText(String(i), 128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); }
    c.strokeStyle = '#111'; c.lineCap = 'round'; c.lineWidth = 9; const ha = (6 + 59 / 60) / 12 * 6.283 - 1.5708, ma = 59 / 60 * 6.283 - 1.5708;
    c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.cos(ha) * 50, 128 + Math.sin(ha) * 50); c.stroke(); c.lineWidth = 6; c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.cos(ma) * 80, 128 + Math.sin(ma) * 80); c.stroke();
    c.fillStyle = '#d9a531'; c.beginPath(); c.arc(128, 128, 9, 0, 7); c.fill(); });
  face.position.z = 0.18; g.add(face);
  const crown = cyl(0.18, 0.18, 0.35, brassM(), 12, g, 0, 1.12, 0); const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.06, 8, 16), brassM()); ring.position.y = 1.42; g.add(ring);
  const lid = new THREE.Group(); lid.position.set(0, -1, 0.18); g.add(lid);
  const ld = cyl(1, 1, 0.12, brassM(), 32, lid, 0, 1, 0.06); ld.rotation.x = Math.PI / 2;
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.95, 32), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .12, roughness: 0 })); glass.position.z = 0.2; g.add(glass);
  return { g, lid, face };
}
export function musicBox(parent, s = 1) {
  const g = new THREE.Group(); g.scale.setScalar(s); parent.add(g);
  const wood = mat(0x7a3a2a, { roughness: .35 });
  box(3, 1.6, 2, wood, 0.15, g, 0, 0.8, 0);
  box(3.1, 0.2, 2.1, brassM(), 0.05, g, 0, 1.5, 0);
  const inner = box(2.6, 0.1, 1.6, mat(0x2a3a8a), 0.02, g, 0, 1.55, 0);
  const cylr = cyl(0.25, 0.25, 1.6, brassM(), 16, g, 0, 1.75, 0); cylr.rotation.z = Math.PI / 2;
  const lid = new THREE.Group(); lid.position.set(0, 1.6, -1.0); g.add(lid);
  box(3.1, 0.35, 2.1, wood, 0.12, lid, 0, 0.17, 1.05);
  const inlay = textPlane(2.2, 1.4, 128, 80, (c) => { c.fillStyle = '#d9a531'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.fillText('♪ ☾ ♪', 64, 54); });
  inlay.rotation.x = -Math.PI / 2; inlay.position.set(0, 0.36, 1.05); lid.add(inlay);
  const crank = box(0.15, 0.15, 0.8, brassM(), 0.04, g, 1.7, 0.9, 0); crank.rotation.z = Math.PI / 2;
  return { g, lid, cylr };
}
export function clockHands(parent, s = 1) {
  const g = new THREE.Group(); g.scale.setScalar(s); parent.add(g);
  const m = mat(0x141018, { roughness: .25, metalness: .4 });
  const longH = new THREE.Group(); g.add(longH); box(0.85, 0.11, 0.06, m, 0.03, longH, 0.42, 0, 0); box(0.16, 0.16, 0.06, m, 0.04, longH, 0.82, 0, 0).rotation.z = Math.PI / 4;
  const shortH = new THREE.Group(); g.add(shortH); box(0.48, 0.14, 0.06, m, 0.03, shortH, -0.24, 0, 0); box(0.18, 0.18, 0.06, m, 0.04, shortH, -0.46, 0, 0).rotation.z = Math.PI / 4;
  const hub = cyl(0.09, 0.09, 0.08, brassM(), 16, g, 0, 0, 0); hub.rotation.x = Math.PI / 2;
  longH.rotation.z = 0.22; shortH.rotation.z = -0.12;
  return { g, longH, shortH };
}
export function calendar(parent) {
  const g = new THREE.Group(); parent.add(g);
  box(8, 1.4, 1.2, mat(0xd63a3a), 0.3, g, 0, 5.3, 0);
  const pages = [];
  for (let i = 0; i < 6; i++) { const p = textPlane(7.4, 9, 256, 312, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d63a3a'; c.fillRect(0, 0, w, 50);
      c.fillStyle = '#fff'; c.font = `700 30px ${FONT}`; c.textAlign = 'center'; c.fillText(['JAN', 'MÄR', 'JUN', 'SEP', 'NOV', 'DEZ'][i], w / 2, 36);
      c.fillStyle = '#1d2238'; c.font = `700 150px ${FONT}`; c.fillText(String((i * 7 + 3) % 28 + 1), w / 2, 210); c.font = `700 26px ${FONT}`; c.fillStyle = '#7a7a8a'; c.fillText('NACHT', w / 2, 270); });
    p.position.set(0, 0.2, 0.62 + i * 0.01); g.add(p); pages.push(p); }
  return { g, pages };
}
export function stretcher(parent) {
  const g = new THREE.Group(); parent.add(g);
  for (const s of [-1, 1]) { const pole = cyl(0.12, 0.12, 9, mat(0x6b4a2e), 8, g, s * 1.3, 0, 0); pole.rotation.x = Math.PI / 2; }
  box(2.5, 0.12, 6.8, mat(0xe8e0d0, { roughness: 1 }), 0.05, g, 0, 0, 0);
  return g;
}
export function camomile(parent, n = 7) {
  const g = new THREE.Group(); parent.add(g);
  for (let i = 0; i < n; i++) { const f = new THREE.Group(); f.position.set((i - n / 2) * 0.25, 0, (i % 2) * 0.2); g.add(f);
    sphere(0.12, mat(0xffd23f, { emissive: 0x3a2a00 }), f, 0, 0, 0);
    for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283, p = box(0.22, 0.04, 0.08, mat(0xffffff), 0.02, f, Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2); p.rotation.y = -a; } }
  return g;
}
export { streetLamp, tyroleanHat };
