// DAMPFSAMMLER — escenarios propios: el club «NACHTWERK» (DJ), el escenario de la Dampfring-Meisterschaft en la plaza,
// los carteles «DAMPFEN VERBOTEN», el sótano de papá con la máquina sin terminar, mi cuarto de noche y la radio vieja.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { FONT, txt, noiseTex } from './props.js';
import { plankTex, brickTex, shade } from './ksets.js';
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); return t; };
export const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const basic = (c, k = 1.6) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });
const PC = [0xff3aa0, 0x3ae0ff, 0xffd23f, 0x8a5aff, 0x3aff8a];

// ---------- icono «vape tachado» (canvas) ----------
export function drawNoVape(c, x, y, r) { c.save(); c.translate(x, y); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
  c.fillStyle = '#2a2a34'; c.beginPath(); c.roundRect(-r * .2, -r * .55, r * .4, r * 1.0, r * .12); c.fill(); c.fillStyle = '#7ae0ff'; c.fillRect(-r * .1, -r * .3, r * .2, r * .25); c.fillStyle = '#14141a'; c.fillRect(-r * .1, -r * .72, r * .2, r * .2);
  c.fillStyle = 'rgba(200,200,210,.9)'; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-r * .15 + i * r * .18, -r * .85 - i * r * .08, r * .13, 0, 7); c.fill(); }
  c.strokeStyle = '#d8202f'; c.lineWidth = r * .2; c.beginPath(); c.arc(0, 0, r * .9, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-r * .64, -r * .64); c.lineTo(r * .64, r * .64); c.stroke(); c.restore(); }
// cartel de calle sobre poste: disco «vape tachado» + placa «DAMPFEN VERBOTEN!»
export function warnSign(parent, x = 0, z = 0, ry = 0, s = 1) { const g = G(parent, x, 0, z); g.rotation.y = ry; g.scale.setScalar(s);
  cyl(.16, .2, 8.4, mat(0x9aa0aa, { metalness: .7, roughness: .3 }), 10, g, 0, 4.2, 0);
  const d = textPlane(3.2, 3.2, 256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); drawNoVape(c, w / 2, h / 2, w * .46); }); d.position.set(0, 8.4, .12); g.add(d); const d2 = d.clone(); d2.rotation.y = Math.PI; d2.position.z = -.12; g.add(d2);
  cyl(1.62, 1.62, .18, mat(0xd8202f, { roughness: .4 }), 32, g, 0, 8.4, 0).rotation.x = Math.PI / 2;
  const p = textPlane(3.6, 1.3, 360, 130, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8202f'; c.lineWidth = 12; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'DAMPFEN', w / 2, 40, 46, '#d8202f'); txt(c, 'VERBOTEN!', w / 2, 92, 46, '#1a1a24'); });
  p.position.set(0, 5.9, .14); g.add(p); box(3.7, 1.4, .2, mat(0xe8e8ec), .04, g, 0, 5.9, 0);
  return shade(g); }
// póster grande de pared «DAMPFEN VERBOTEN – Der Dampfsammler sieht alles»
export function warnPoster(w = 5, h = 7) { return textPlane(w, h, 400, 560, (c, W, H) => { c.fillStyle = '#fff4e0'; c.fillRect(0, 0, W, H); c.fillStyle = '#d8202f'; c.fillRect(0, 0, W, 90); txt(c, 'WARNUNG', W / 2, 48, 64, '#ffffff');
  drawNoVape(c, W / 2, 250, 130); txt(c, 'DAMPFEN', W / 2, 430, 64, '#d8202f'); txt(c, 'VERBOTEN!', W / 2, 495, 64, '#1a1a24'); }); }

// ---------- club NACHTWERK (X): suelo LED, escenario del DJ al fondo ----------
// escenario: z ∈ [-24, -14], altura SY = 2.6; mesa del DJ en (0, SY, -19); pista LED 26×18 centrada en (0, 0, 2); barra a la izquierda (x = -26).
export function club(scene, X) { const g = G(scene, X); const SY = 2.6;
  box(70, .4, 56, mat(0x14121c, { roughness: .5, metalness: .2 }), 0, g, 0, -.2, 0);
  const floorT = canvasTex(256, 192, () => {}); const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), new THREE.MeshBasicMaterial({ map: floorT, toneMapped: false })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, .03, 2); g.add(floor);
  const drawFloor = (T, k = 1) => { const c = floorT.image.getContext('2d'); const cols = ['#ff3aa0', '#3ae0ff', '#ffd23f', '#8a5aff', '#3aff8a']; for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { const v = Math.sin(T * 4 + i * .9 + j * 1.3) * .5 + .5; c.fillStyle = cols[(i + j + Math.floor(T * 2)) % 5]; c.globalAlpha = (.25 + v * .75) * k; c.fillStyle = c.fillStyle; c.fillRect(i * 32, j * 32, 32, 32); c.globalAlpha = 1; c.fillStyle = 'rgba(0,0,0,' + (1 - k) * .9 + ')'; c.fillRect(i * 32, j * 32, 32, 32); c.strokeStyle = '#08060e'; c.lineWidth = 3; c.strokeRect(i * 32, j * 32, 32, 32); } floorT.needsUpdate = true; };
  drawFloor(0);
  const wallT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#1a1430'; c.fillRect(0, 0, w, h); c.fillStyle = '#231a40'; for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? 0 : 16; x < w; x += 32) c.fillRect(x + 1, y + 1, 30, 14); }, true);
  const wm = mat(0xffffff, { map: rep(wallT, 10, 3), roughness: .9 });
  box(70, 24, .6, wm, 0, g, 0, 12, -28); for (const s of [-1, 1]) box(.6, 24, 56, wm, 0, g, s * 35, 12, 0); box(70, .6, 56, mat(0x0c0a14), 0, g, 0, 24, 0);
  // neón en las paredes
  for (const s of [-1, 1]) { box(.2, .2, 54, basic(s > 0 ? 0x3ae0ff : 0xff3aa0, 2), 0, g, s * 34.6, 18, 0); box(.2, .2, 54, basic(0x8a5aff, 2), 0, g, s * 34.6, 2, 0); }
  // escenario
  box(40, SY, 12, mat(0x1a1a24, { roughness: .4, metalness: .3 }), .1, g, 0, SY / 2, -21); box(40.4, .3, .4, basic(0x3ae0ff, 2.2), 0, g, 0, SY - .1, -14.9);
  for (let k = 0; k < 4; k++) box(4, .6, 1.2, mat(0x2a2a34), .05, g, -3 + k * 2, .3 + k * 0 , -14.3 + 0).position.set(0, .3 + (k * .6), -13.2 - k * 0.0) ;
  // mesa del DJ
  const DJ = G(g, 0, SY, -19); box(8, 3, 2.6, mat(0x101016, { roughness: .4 }), .12, DJ, 0, 1.5, 0); const djF = textPlane(7.6, 2.2, 380, 110, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#ff3aa0'); gr.addColorStop(1, '#3ae0ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); txt(c, 'DJ BLITZ', w / 2, h / 2 + 4, 64, '#ffffff', '#1a0a2a', 8); }, .45); djF.position.set(0, 1.5, 1.32); DJ.add(djF);
  for (const s of [-1, 1]) { const tt = cyl(1.0, 1.0, .2, mat(0x2a2a30, { metalness: .6 }), 24, DJ, s * 2.4, 3.1, 0); const rec = cyl(.85, .85, .06, mat(0x0a0a0e, { roughness: .2 }), 24, DJ, s * 2.4, 3.22, 0); cyl(.25, .25, .07, mat(s > 0 ? 0xff3aa0 : 0x3ae0ff), 14, DJ, s * 2.4, 3.27, 0); }
  box(2.4, .3, 1.6, mat(0x1a1a22, { metalness: .4 }), .05, DJ, 0, 3.15, 0); for (let k = 0; k < 8; k++) box(.14, .12, .14, basic(PC[k % 5], 1.8), .03, DJ, -.9 + k * .26, 3.36, .3);
  const lap = G(DJ, 0, 3.3, -.6); lap.visible = false; box(2, .1, 1.4, mat(0xc8ccd4, { metalness: .8, roughness: .25 }), .03, lap, 0, 0, 0); const ls = box(2, 1.4, .08, mat(0xc8ccd4, { metalness: .8, roughness: .25 }), .03, lap, 0, .7, -.7); ls.rotation.x = -.25;
  // altavoces apilados y pantalla LED gigante
  const SPK = []; for (const s of [-1, 1]) { const st = G(g, s * 14, SY, -21); for (let k = 0; k < 3; k++) { box(4, 3.4, 3, mat(0x121216, { roughness: .6 }), .12, st, 0, 1.7 + k * 3.5, 0); for (const y of [.9, 2.4]) { const cone = cyl(.95 - (y > 2 ? .3 : 0), .95 - (y > 2 ? .3 : 0), .2, mat(0x2a2a30, { roughness: .4 }), 20, st, 0, y + k * 3.5, 1.52); cone.rotation.x = Math.PI / 2; SPK.push(cone); } } }
  const ledT = canvasTex(640, 360, () => {}); const led = new THREE.Mesh(new THREE.PlaneGeometry(24, 13.5), new THREE.MeshBasicMaterial({ map: ledT, toneMapped: false })); led.position.set(0, SY + 9.6, -27.6); g.add(led); box(25, 14.4, .4, mat(0x0a0a0e), .1, g, 0, SY + 9.6, -27.9);
  const drawLED = (T, k = 1, title = 'NACHTWERK') => { const c = ledT.image.getContext('2d'), w = 640, h = 360; const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#2a0a4a'); gr.addColorStop(1, '#0a2a4a'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 24; i++) { const v = (Math.sin(T * 7 + i * .7) * .5 + .5) * (Math.sin(T * 3.1 + i * 1.9) * .3 + .7); c.fillStyle = ['#ff3aa0', '#3ae0ff', '#ffd23f'][i % 3]; c.fillRect(20 + i * 25, h - 30 - v * 170, 18, v * 170); }
    c.save(); c.shadowColor = '#ff3aa0'; c.shadowBlur = 30; txt(c, title, w / 2, 80, 84, '#ffffff', '#ff3aa0', 6); c.restore(); if (k < 1) { c.fillStyle = `rgba(0,0,0,${1 - k})`; c.fillRect(0, 0, w, h); } ledT.needsUpdate = true; };
  drawLED(0);
  // truss con focos (conos de luz aditivos)
  const truss = mat(0x8a8e9a, { metalness: .8, roughness: .3 }); box(46, .5, .5, truss, 0, g, 0, 21, -14); for (const s of [-1, 1]) box(.5, 21, .5, truss, 0, g, s * 23, 10.5, -14);
  const coneM = PC.map(c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  const CONES = []; for (let k = 0; k < 6; k++) { const p = G(g, -17.5 + k * 7, 20.6, -14); box(.9, 1.1, .9, mat(0x1a1a1a), .1, p, 0, 0, 0); const cn = new THREE.Mesh(new THREE.ConeGeometry(3.6, 22, 20, 1, true), coneM[k % 5]); cn.position.y = -11; p.add(cn); CONES.push(p); }
  // bola de discoteca
  const DB = G(g, 0, 18.5, 2); cyl(.05, .05, 5, mat(0x888888), 4, DB, 0, 2.5, 0); const ball = sphere(1.4, mat(0xffffff, { metalness: 1, roughness: .15, flatShading: true }), DB, 0, 0, 0, 14, 10);
  // barra con botellas y taburetes (pared izquierda)
  const BAR = G(g, -28, 0, 4); box(4, 4, 22, mat(0x2a1a3a, { roughness: .4 }), .12, BAR, 0, 2, 0); box(4.6, .3, 22.4, mat(0x8a6a4a, { roughness: .3 }), .05, BAR, 0, 4.1, 0); box(.2, .2, 22, basic(0xff3aa0, 2), 0, BAR, 2.05, 3.7, 0);
  for (let k = 0; k < 3; k++) box(1.2, .2, 22, mat(0x3a2a20), .03, BAR, -5.4, 7 + k * 2.4, 0); const r = RNG(4);
  for (let k = 0; k < 3; k++) for (let i = 0; i < 14; i++) { const bc = [0x3a8a3a, 0x8a3a1a, 0x3a5a9a, 0xd8a040, 0xe8e8f0][Math.floor(r() * 5)]; cyl(.22, .26, 1.1 + r() * .5, mat(bc, { roughness: .1, transparent: true, opacity: .85 }), 10, BAR, -5.4, 7.7 + k * 2.4, -10 + i * 1.5); }
  for (let i = 0; i < 6; i++) { const st = G(BAR, 4.2, 0, -9 + i * 3.6); cyl(.12, .2, 2.8, mat(0x8a8e9a, { metalness: .8 }), 8, st, 0, 1.4, 0); cyl(.8, .8, .3, mat(0xd8323a, { roughness: .5 }), 16, st, 0, 2.9, 0); }
  // cartel de neón lateral
  const sg = textPlane(14, 3.2, 700, 160, (c, w, h) => { c.clearRect(0, 0, w, h); c.shadowColor = '#3ae0ff'; c.shadowBlur = 24; txt(c, 'NACHTWERK', w / 2, h / 2 + 6, 120, '#bff6ff'); }, 1.2); sg.position.set(34.6, 15, -4); sg.rotation.y = -Math.PI / 2; g.add(sg);
  // luces
  const LM = new THREE.PointLight(0xffe8f8, 220, 80, 1.1); LM.position.set(0, 18, 12); g.add(LM); const LS = new THREE.PointLight(0xff7ad8, 160, 50, 1.2); LS.position.set(0, 12, -12); g.add(LS);
  const LC = PC.slice(0, 4).map((c, k) => { const l = new THREE.PointLight(c, 90, 40, 1.4); l.position.set(-18 + k * 12, 9, 4); g.add(l); return l; });
  return { g: shade(g), SY, DJ, CONES, DB, ball, led, drawLED, drawFloor, LM, LS, LC, SPK, floor }; }

// ---------- escenario de la Dampfring-Meisterschaft (en la plaza): tarima, arco con pancarta, marcador ----------
// tarima de 18×10 (altura 3) centrada en (x, z); el concursante en (x, 3, z); mira a +z
export function ringStage(parent, x, z) { const g = G(parent, x, 0, z); const H_ = 3;
  box(18, H_, 10, mat(0x2a3a8a, { roughness: .5 }), .15, g, 0, H_ / 2, 0); box(18.4, .3, 10.4, mat(0xf4f4f4), .05, g, 0, H_ + .05, 0);
  const carpet = box(6, .06, 8, mat(0xd8202f, { roughness: .9 }), 0, g, 0, H_ + .22, .4);
  for (let k = 0; k < 4; k++) box(5, .5, 1.2, mat(0x2a3a8a), .05, g, 0, .25 + k * .7, 5.4 + (3 - k) * 0).position.set(0, .25 + k * .7, 5.6 + (3 - k) * 1.1);
  // arco con pancarta
  const gold = mat(0xffc830, { metalness: .8, roughness: .25 }); for (const s of [-1, 1]) { cyl(.5, .6, 14, gold, 12, g, s * 8.4, H_ + 7, -4.2); sphere(.9, gold, g, s * 8.4, H_ + 14.4, -4.2, 14, 10); }
  const ban = textPlane(17, 3.4, 1020, 204, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a0a6a'); gr.addColorStop(1, '#5a1a9a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 12; c.strokeRect(8, 8, w - 16, h - 16);
    txt(c, 'DAMPFRING-', w / 2, 66, 84, '#ffffff', '#1a0a3a', 10); txt(c, 'MEISTERSCHAFT', w / 2, 146, 84, '#ffd23f', '#1a0a3a', 10); }); ban.position.set(0, H_ + 12.4, -4.1); g.add(ban); box(17.4, 3.8, .3, mat(0x1a0a3a), .05, g, 0, H_ + 12.4, -4.35);
  // marcador «REKORD»
  const scT = canvasTex(400, 260, () => {}); const sc = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.9), new THREE.MeshBasicMaterial({ map: scT, toneMapped: false })); sc.position.set(11.8, 9, -2); sc.rotation.y = -.35; g.add(sc); const scb = box(6.4, 4.3, .4, mat(0x1a1a22), .1, g, 11.8, 9, -2.25); scb.rotation.y = -.35; cyl(.25, .25, 7, mat(0x5a5e68, { metalness: .7 }), 8, g, 11.9, 3.5, -2.4);
  const drawScore = (n, best = 'REKORD') => { const c = scT.image.getContext('2d'); c.fillStyle = '#06100a'; c.fillRect(0, 0, 400, 260); txt(c, best, 200, 50, 48, '#ffd23f'); txt(c, 'RINGE', 200, 205, 42, '#9aa4c0'); c.save(); c.shadowColor = '#3aff8a'; c.shadowBlur = 20; txt(c, String(n), 200, 130, 110, '#7aff9a'); c.restore(); scT.needsUpdate = true; };
  drawScore(0);
  // focos en el suelo y guirnalda de bombillas
  for (const s of [-1, 1]) { const f = G(g, s * 7.5, H_, 3.6); box(1.2, .8, 1.2, mat(0x1a1a1a), .1, f, 0, .4, 0); const l = cyl(.45, .45, .2, basic(0xfff2c8, 2.2), 12, f, 0, .9, .3); l.rotation.x = -1; }
  const bulbs = []; for (let i = 0; i < 15; i++) { const t = i / 14, bx = -8.4 + t * 16.8, by = H_ + 14 - Math.sin(t * Math.PI) * 2.4; bulbs.push(sphere(.3, glowM(PC[i % 5], 2), g, bx, by, -3.6, 8, 6)); }
  // mesa del jurado (delante, a la izquierda)
  const J = G(g, -11, 0, 7); box(8, 3, 2.4, mat(0xf4f4f4, { roughness: .5 }), .1, J, 0, 1.5, 0); const jt = textPlane(7.6, 1.2, 380, 60, (c, w, h) => { c.fillStyle = '#d8202f'; c.fillRect(0, 0, w, h); txt(c, 'JURY', w / 2, h / 2 + 3, 44, '#ffffff'); }); jt.position.set(0, 2.2, 1.22); J.add(jt);
  for (let k = 0; k < 3; k++) box(1.6, .2, 1, mat(0xffd23f), .03, J, -2.6 + k * 2.6, 3.1, 0);
  return { g: shade(g), H: H_, drawScore, bulbs, J }; }

// ---------- la radio vieja: caja de madera con arco, rejilla de tela, dial que se ilumina, dos botones ----------
export function radio(parent) { const g = G(parent); const wd = mat(0x6a3416, { roughness: .35 }), wdk = mat(0x4a220c, { roughness: .4 });
  box(3.2, 2.2, 1.6, wd, .2, g, 0, 1.1, 0); const top = cyl(1.6, 1.6, 1.6, wd, 24, g, 0, 2.2, 0); top.rotation.x = Math.PI / 2; top.scale.set(1, 1, 1); const cut = box(3.3, 1.7, 1.7, wd, 0, null); // (no se usa)
  box(3.3, .2, 1.7, wdk, .05, g, 0, .1, 0);
  const grille = textPlane(2.0, 2.0, 128, 128, (c, w, h) => { c.fillStyle = '#c8b890'; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, 7); c.fill(); c.strokeStyle = '#8a7a5a'; c.lineWidth = 4; for (let x = 10; x < w; x += 12) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } c.globalCompositeOperation = 'destination-in'; c.beginPath(); c.arc(w / 2, h / 2, w / 2 - 2, 0, 7); c.fill(); });
  grille.position.set(-.55, 2.0, .82); g.add(grille); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, .08, 8, 32), mat(0xd9a531, { metalness: .8, roughness: .25 })); ring.position.set(-.55, 2.0, .82); g.add(ring);
  const dialM = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, .78, .4), toneMapped: false }); const dial = box(1.0, .6, .05, dialM, .04, g, .95, 1.75, .81); const needle = box(.04, .5, .03, mat(0xd8202f), 0, g, .95, 1.75, .85);
  for (const [x, y] of [[.7, .75], [1.2, .75]]) { const k = cyl(.22, .22, .25, mat(0x2a1a0a, { roughness: .3 }), 16, g, x, y, .85); k.rotation.x = Math.PI / 2; }
  cyl(.04, .04, 2.2, mat(0x8a8e9a, { metalness: .9 }), 6, g, 1.3, 4.3, -.4).rotation.z = -.3;
  g.userData = { setGlow: k => dialM.color.setRGB(1, .78, .4).multiplyScalar(.15 + k * 2.2), needle }; g.userData.setGlow(0); return g; }

// ---------- la máquina de papá (sin terminar): caldera de cobre, cúpula de cristal con vapor, bobinas, manómetros, cables sueltos ----------
export function machine(parent) { const g = G(parent); const cu = mat(0xc8743a, { metalness: .85, roughness: .3 }), br = mat(0xd9a531, { metalness: .85, roughness: .25 }), st = mat(0x5a5e68, { metalness: .7, roughness: .35 }), dk = mat(0x22222a, { roughness: .5 });
  box(9, 3, 6, dk, .2, g, 0, 1.5, 0); box(9.4, .3, 6.4, st, .05, g, 0, 3.1, 0);
  const pnl = textPlane(7, 2, 420, 120, (c, w, h) => { c.fillStyle = '#2a2a34'; c.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { c.fillStyle = ['#ff3a3a', '#3aff8a', '#ffd23f'][i % 3]; c.beginPath(); c.arc(40 + i * 66, 34, 14, 0, 7); c.fill(); } for (let i = 0; i < 8; i++) { c.fillStyle = '#c8ccd4'; c.fillRect(30 + i * 48, 70, 16, 36); c.fillStyle = '#1a1a1a'; c.fillRect(33 + i * 48, 74 + (i % 3) * 9, 10, 8); } });
  pnl.position.set(0, 1.6, 3.02); g.add(pnl);
  const boiler = cyl(2.4, 2.6, 6.5, cu, 28, g, 0, 6.4, -.6); for (const y of [4.2, 6.4, 8.6]) cyl(2.66, 2.66, .3, br, 28, g, 0, y, -.6); for (let k = 0; k < 10; k++) sphere(.12, br, g, Math.sin(k * .63) * 2.68, 5.3, -.6 + Math.cos(k * .63) * 2.68, 6, 4);
  const dome = sphere(2.3, new THREE.MeshPhysicalMaterial({ color: 0xbfefff, roughness: .02, transmission: .6, transparent: true, opacity: .35, metalness: 0, depthWrite: false }), g, 0, 9.8, -.6, 28, 16); dome.scale.y = .9;
  const coreM = new THREE.MeshBasicMaterial({ color: new THREE.Color(.5, 1, 1.2), toneMapped: false, transparent: true, opacity: .9 }); const core = sphere(1.0, coreM, g, 0, 9.8, -.6, 20, 14);
  const coil = new THREE.Mesh(new THREE.TorusGeometry(3.4, .22, 10, 48), br); coil.position.set(0, 9.8, -.6); coil.rotation.x = Math.PI / 2; g.add(coil); const coil2 = coil.clone(); coil2.rotation.set(0, 0, 0); coil2.scale.setScalar(.95); g.add(coil2);
  // segmentos del aro exterior (la mitad derecha falta: sin terminar)
  for (let k = 0; k < 9; k++) { const a = Math.PI * .5 + k * .36; const s_ = box(.9, 1.5, .8, k % 2 ? br : cu, .1, g, Math.cos(a) * 5.2, 8 + Math.sin(a) * 5.2, -.6); s_.rotation.z = a; }
  // manómetros
  for (const [x, y] of [[-3.2, 4.4], [3.2, 4.4]]) { const gauge = G(g, x, y, 2.0); cyl(.8, .8, .3, br, 20, gauge, 0, 0, 0).rotation.x = Math.PI / 2; const f = textPlane(1.3, 1.3, 96, 96, (c, w, h) => { c.fillStyle = '#f4ead8'; c.beginPath(); c.arc(48, 48, 46, 0, 7); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { const a = Math.PI * .8 + i * .18 * Math.PI; c.beginPath(); c.moveTo(48 + Math.cos(a) * 34, 48 + Math.sin(a) * 34); c.lineTo(48 + Math.cos(a) * 42, 48 + Math.sin(a) * 42); c.stroke(); } c.fillStyle = '#d8202f'; c.fillRect(46, 20, 4, 30); }); f.position.z = .17; gauge.add(f); }
  // tubos al techo y palancas
  for (const [x, z] of [[-1.6, -2.4], [1.6, -2.4]]) { cyl(.35, .35, 12, cu, 12, g, x, 13, z); cyl(.5, .5, .4, br, 12, g, x, 11, z); }
  for (const x of [-3.6, -2.8]) { const lv = G(g, x, 3.2, 2.2); cyl(.08, .08, 1.6, st, 6, lv, 0, .8, 0); sphere(.24, mat(0xd8202f), lv, 0, 1.6, 0, 10, 8); lv.rotation.x = .4; }
  // cables sueltos y paneles abiertos (está sin terminar)
  const cab = mat(0x1a1a1a, { roughness: .6 }); for (let k = 0; k < 5; k++) { const curve = new THREE.CatmullRomCurve3([V3(-4 + k * .5, 3, 2.2), V3(-4.6 + k * .7, 1.6, 3.4), V3(-5 + k, .2, 4.2)]); const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, .07, 6), [cab, mat(0xd8202f), mat(0x2a6ad8), mat(0xffd23f), cab][k]); g.add(m); }
  const lid = box(2.4, 1.6, .15, st, .05, g, 3.2, 1.3, 3.6); lid.rotation.y = -.9;
  g.userData = { core, coreM, coil, coil2, setPower: k => { coreM.color.setRGB(.5, 1, 1.2).multiplyScalar(.25 + k * 1.6); } }; g.userData.setPower(.4);
  return shade(g); }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- el sótano de papá (X): ladrillo, vigas, bombillas colgantes, estanterías, banco de trabajo, escalera ----------
// máquina en (0, 0, -6); banco de trabajo con la radio a la izquierda (-12, 0, -9); escalera en la pared derecha: baja de (14, 9, -10) a (14, 0, 4).
export function keller(scene, X, MACH) { const g = G(scene, X); const br = mat(0xffffff, { map: rep(brickTex('#8a4a32', '#5a4a40', 128), 6, 2.4), roughness: .9 }), wd = mat(0xffffff, { map: rep(plankTex('#7a5030', '#6a4428'), 2, 2), roughness: .7 }), beam = mat(0x4a2e18, { roughness: .7 });
  box(48, .4, 40, mat(0xffffff, { map: rep(noiseTex('#6a6a6e', ['#5a5a5e', '#7a7a7e', '#4a4a50'], 1400, 3), 6, 5), roughness: .95 }), 0, g, 0, -.2, 0);
  box(48, 18, .8, br, 0, g, 0, 9, -18); for (const s of [-1, 1]) box(.8, 18, 40, br, 0, g, s * 24, 9, 0); box(48, .6, 40, mat(0x3a2a1a), 0, g, 0, 18.2, 0);
  for (let k = 0; k < 7; k++) box(48, 1.0, 1.0, beam, .05, g, 0, 17.4, -16 + k * 5.6); for (const x of [-12, 12]) box(1, 1, 40, beam, .05, g, x, 16.6, 0);
  // estanterías con tarros, cajas y herramientas (pared izquierda)
  const r = RNG(31); for (let k = 0; k < 4; k++) box(1.6, .25, 16, wd, .03, g, -22.8, 2 + k * 3.4, 2); for (const z of [-5.8, 2, 9.8]) box(1.6, 13.6, .3, wd, .03, g, -22.8, 6.8, z);
  for (let k = 0; k < 4; k++) for (let i = 0; i < 9; i++) { const z = -5 + i * 1.7 + r() * .3; if (r() < .45) { const c = [0x3a8a3a, 0xd8a040, 0x8a3a1a, 0x7ae0ff][Math.floor(r() * 4)]; cyl(.42, .42, 1.2, mat(c, { roughness: .1, transparent: true, opacity: .8 }), 10, g, -22.6, 2.75 + k * 3.4, z); cyl(.45, .45, .2, mat(0xd9a531, { metalness: .8 }), 10, g, -22.6, 3.45 + k * 3.4, z); } else box(1.2, 1.1 + r() * .8, 1.3, mat([0xb8946a, 0x9a7a52, 0xc8a478][Math.floor(r() * 3)], { roughness: .9 }), .05, g, -22.5, 2.7 + k * 3.4, z); }
  // tablero de herramientas y planos en la pared del fondo
  const peg = textPlane(10, 6, 500, 300, (c, w, h) => { c.fillStyle = '#c8a478'; c.fillRect(0, 0, w, h); c.fillStyle = '#8a6a44'; for (let y = 12; y < h; y += 24) for (let x = 12; x < w; x += 24) { c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); }
    c.fillStyle = '#5a5e68'; c.fillRect(40, 40, 18, 140); c.fillRect(20, 30, 58, 26); c.fillStyle = '#d8202f'; c.fillRect(120, 60, 14, 150); c.fillStyle = '#5a5e68'; c.beginPath(); c.arc(127, 50, 26, 0, 7); c.fill(); c.fillStyle = '#c8a478'; c.beginPath(); c.arc(127, 50, 12, 0, 7); c.fill();
    c.fillStyle = '#ffd23f'; c.fillRect(200, 50, 30, 120); c.fillStyle = '#2a2a34'; c.fillRect(200, 170, 30, 40); c.strokeStyle = '#5a5e68'; c.lineWidth = 8; c.beginPath(); c.arc(320, 120, 50, 0, 7); c.stroke(); c.fillStyle = '#3a8a3a'; c.fillRect(400, 40, 60, 200); });
  peg.position.set(-12, 9, -17.5); g.add(peg);
  const plan = textPlane(7, 5, 420, 300, (c, w, h) => { c.fillStyle = '#1a4a8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#cfe8ff'; c.lineWidth = 3; c.strokeRect(10, 10, w - 20, h - 20); c.beginPath(); c.arc(w / 2, h / 2 - 10, 80, 0, 7); c.stroke(); c.beginPath(); c.arc(w / 2, h / 2 - 10, 40, 0, 7); c.stroke(); c.strokeRect(w / 2 - 110, h / 2 + 70, 220, 60); for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(30, 40 + i * 18); c.lineTo(110, 40 + i * 18); c.stroke(); } txt(c, 'PROJEKT D', w - 90, h - 30, 26, '#cfe8ff'); });
  plan.position.set(10, 9.5, -17.5); g.add(plan);
  // banco de trabajo
  const WB = G(g, -12, 0, -12); box(12, .5, 4.4, wd, .05, WB, 0, 4.2, 0); for (const [x, z] of [[-5.6, -1.8], [5.6, -1.8], [-5.6, 1.8], [5.6, 1.8]]) box(.5, 4, .5, beam, .05, WB, x, 2, z); box(11.4, .3, 4, wd, .03, WB, 0, 1.2, 0);
  const vise = G(WB, 4.6, 4.45, 1.2); box(1.2, .8, .8, mat(0x2a6ad8, { metalness: .5 }), .05, vise, 0, .4, 0); for (let i = 0; i < 4; i++) box(.4, .3, .9, mat([0xd8202f, 0x5a5e68, 0xffd23f, 0x5a5e68][i]), .05, WB, -4 + i * 1.1, 4.6, 1.4);
  box(3, .1, 2.2, mat(0xf4ead8), 0, WB, 1.8, 4.5, .3).rotation.y = .2;
  // bombillas colgantes con luz cálida
  const BULBS = []; for (const [x, z] of [[-12, -8], [0, -2], [12, -8], [0, 10]]) { cyl(.03, .03, 4, mat(0x1a1a1a), 4, g, x, 15, z); const bl = sphere(.55, glowM(0xffd890, 2.2), g, x, 12.8, z, 12, 8); const l = new THREE.PointLight(0xffc070, 70, 34, 1.4); l.position.set(x, 12.3, z); g.add(l); BULBS.push({ bl, l }); }
  // escalera de madera (pared derecha) con barandilla y puerta arriba
  const ST = G(g, 17.5, 0, 0); for (let k = 0; k < 12; k++) { box(5, .4, 1.4, wd, .05, ST, 0, .75 + k * .75, 6 - k * 1.3); box(5, .75 * (k + 1), .2, mat(0x5a3418), .02, ST, 0, .375 * (k + 1), 6.6 - k * 1.3); }
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, 18.5, 8), beam); rail.position.set(-2.6, 7.6, -1.2); rail.rotation.x = Math.atan2(15.6, 9.0) ; g.add(rail); rail.position.add(ST.position);
  for (let k = 0; k < 12; k += 2) cyl(.1, .1, 3.2, beam, 6, ST, -2.6, .75 + k * .75 + 1.6, 6 - k * 1.3);
  box(6, 9, .6, mat(0x3a2414), .05, g, 17.5, 13.5, -17.6); const door = box(4.6, 8, .4, mat(0x6a4428), .05, g, 17.5, 13.5, -17.2); const dl = new THREE.Mesh(new THREE.PlaneGeometry(.6, 8), basic(0xffd890, 1.6)); dl.position.set(19.6, 13.5, -17.0); g.add(dl);
  // la máquina (atrezo compartido) se coloca en (0, 0, -6)
  return { g: shade(g), WB, BULBS, door }; }

// ---------- mi cuarto de noche (X): papel pintado azul con estrellas, cama, mesilla con la radio, ventana con luna ----------
// cama a lo largo de x en (-4, 0, -6) (cabecera a la izquierda, x = -11); mesilla en (-13.4, 0, -10); ventana en la pared del fondo.
export function cuarto(scene, X) { const g = G(scene, X); const wallT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#23336a'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a3c78'; c.fillRect(0, 0, w, h / 2); c.fillStyle = 'rgba(255,230,150,.55)'; const r = RNG(5); for (let i = 0; i < 10; i++) { const x = r() * w, y = r() * h; c.beginPath(); for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5, rr = k % 2 ? 2.5 : 6; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.fill(); } }, true);
  const wl = mat(0xffffff, { map: rep(wallT, 4, 2), roughness: .9 }), wd = mat(0xffffff, { map: rep(plankTex('#9a6a3e', '#8a5a32'), 4, 4), roughness: .7 });
  box(40, .4, 34, wd, 0, g, 0, -.2, 0); box(40, 18, .6, wl, 0, g, 0, 9, -16); for (const s of [-1, 1]) box(.6, 18, 34, wl, 0, g, s * 20, 9, 0); box(40, .5, 34, mat(0x1a2244), 0, g, 0, 18.2, 0); box(40, 1.2, .3, mat(0xf4f0e8), .05, g, 0, .6, -15.6);
  // ventana con luna
  const win = G(g, 4, 9.5, -15.6); box(8.4, 7.4, .4, mat(0xf4f0e8), .05, win, 0, 0, 0); const sky = textPlane(7.6, 6.6, 300, 260, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a1440'); gr.addColorStop(1, '#2a2a6a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#fff6d0'; c.beginPath(); c.arc(220, 70, 34, 0, 7); c.fill(); c.fillStyle = '#ffffff'; const r = RNG(2); for (let i = 0; i < 40; i++) c.fillRect(r() * w, r() * h * .7, 2, 2); c.fillStyle = '#141a30'; for (let i = 0; i < 6; i++) c.fillRect(i * 52, 180 - (i % 3) * 20, 46, 100); c.fillStyle = '#ffd890'; for (let i = 0; i < 10; i++) c.fillRect(10 + i * 29, 200 + (i % 2) * 18, 8, 10); }, .8);
  sky.position.z = .22; win.add(sky); box(.3, 6.8, .3, mat(0xf4f0e8), 0, win, 0, 0, .3); box(7.8, .3, .3, mat(0xf4f0e8), 0, win, 0, 0, .3); for (const s of [-1, 1]) { const cu = box(1.6, 8.6, .3, mat(0x3a8a6a, { roughness: .9 }), .1, win, s * 5, -.2, .6); }
  const ML = new THREE.SpotLight(0x9ab8ff, 300, 60, .6, .6, 1.2); ML.position.set(4, 12, -14); ML.target.position.set(-4, 0, -4); g.add(ML, ML.target);
  // cama
  const BED = G(g, -4, 0, -8); box(14, 2.2, 7, mat(0x6a4224), .2, BED, 0, 1.1, 0); box(13.4, 1.2, 6.6, mat(0xf4f4f8), .4, BED, 0, 2.8, 0);
  const blanketT = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#d8572a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f0a040'; for (let i = 0; i < 4; i++) c.fillRect(0, i * 16, w, 6); c.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 4; i++) c.fillRect(i * 16, 0, 4, h); }, true);
  box(9.6, 1.0, 6.9, mat(0xffffff, { map: rep(blanketT, 3, 2), roughness: .9 }), .4, BED, 1.8, 3.5, 0); box(3, 1.1, 4.4, mat(0xffffff), .5, BED, -5, 3.7, 0); box(1, 7, 7.2, mat(0x6a4224), .2, BED, -7.2, 3.5, 0);
  // mesilla y radio encima (la radio la pone main.js: RADIO en (-13.4, 4.4, -10))
  const NS = G(g, -13.4, 0, -10); box(4, 4.2, 3.6, mat(0x8a5a30), .15, NS, 0, 2.1, 0); box(3.6, .1, .1, mat(0xd9a531, { metalness: .8 }), 0, NS, 0, 2.6, 1.82);
  // escritorio con lámpara y libros, póster, estantería
  const DK = G(g, 13, 0, -12); box(8, .4, 4, mat(0xf4f0e8), .05, DK, 0, 4, 0); for (const s of [-1, 1]) box(.4, 4, 3.6, mat(0xf4f0e8), .05, DK, s * 3.6, 2, 0); box(3, 2, .3, mat(0x1a1a22), .05, DK, 0, 5.2, -1.2);
  for (let i = 0; i < 5; i++) box(.4, 1.6, 1.2, mat([0xd8202f, 0x2a6ad8, 0xffd23f, 0x3a8a3a, 0x8a5aff][i]), .03, DK, -3 + i * .45, 5, -1.2);
  const pos = textPlane(4.4, 6, 220, 300, (c, w, h) => { c.fillStyle = '#ff7a1a'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a2a'; c.beginPath(); c.arc(w / 2, 130, 70, 0, 7); c.fill(); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, 130, 40, 0, 7); c.fill(); txt(c, 'ROBOTER', w / 2, 250, 36, '#ffffff', '#1a1a2a', 6); }); pos.position.set(13, 10.5, -15.6); g.add(pos);
  const DOOR = G(g, 19.6, 0, 6); box(.4, 12, 6, mat(0x6a4428), .05, DOOR, 0, 6, 0); sphere(.3, mat(0xd9a531, { metalness: .8 }), DOOR, -.4, 6, -2.2, 10, 8);
  return { g: shade(g), ML, BED, NS }; }
