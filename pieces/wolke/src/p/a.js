// ---------- a: atrezo de wolke + gancho, reglas, sabores, yo, Vape-Tag (0 – 39,18 s) ----------
function walk(ch, L, x, z, ry, sp = 2.4, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .1, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.expr !== false) cara(ch, L.T + i, { expr: o.expr || 'neutral', mouth: o.mouth }); return ch; }
function run(ch, L, x, z, ry, sp = 9, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 13 + i)) * .35, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...runP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); cara(ch, L.T + i, { expr: o.expr || 'shock', mouth: o.mouth || 'o' }); return ch; }
function pose(ch, x, y, z, ry, L, p = {}, expr = 'neutral', ex = {}) { put(ch, x, y, z, ry); actuar(ch, 0, [[0, typeof p === 'string' ? p : { headY: Math.sin(L.T * .9 + ch.seed) * .12, ...p }]], { T: L.T }); cara(ch, L.T, { expr, ...ex }); return ch; }
const WAVE = (T, i = 0) => ({ aRx: 2.7, aRz: .35 + Math.sin(T * 12 + i) * .35, aRe: .5, aLx: .2, headY: 0 });
const SHOUT = { aRx: 1.2, aRz: .5, aRe: 1.9, aLx: 1.2, aLz: .5, aLe: 1.9, lean: -.08, headX: -.18 };
const LAUGH = (T) => ({ lean: -.12 + Math.sin(T * 14) * .04, aLx: .9, aLz: .3, aLe: 1.6, aRx: 1.5, aRz: -.1, aRe: .1, headX: -.2 + Math.sin(T * 14) * .05 });
const POINT = { aRx: 1.6, aRz: .05, aRe: .1, aLx: .3 };
const top = (t, k, kind = 'big', y = .13, sc = 1) => badge(kind, t, W / 2, H * y, k, 1, sc);
const Gp = (x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); return g; };
const castSh = g => { g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return g; };

// ---------- atrezo ----------
// melocotón: degradado amarillo-naranja-rojo con pelusa, surco y hojita (s = escala); se usa como fruta y como lluvia
const PEACHT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w * .35, h * .35, 4, w / 2, h / 2, w * .72); g.addColorStop(0, '#ffe2a0'); g.addColorStop(.5, '#ff9a62'); g.addColorStop(1, '#e8405a'); c.fillStyle = g; c.fillRect(0, 0, w, h); const r = RNG(3); c.fillStyle = 'rgba(255,255,255,.4)'; for (let i = 0; i < 700; i++) c.fillRect(r() * w, r() * h, 1, 1); });
function peach(s = 1, bite = false) { const g = new THREE.Group(); const m = mat(0xffffff, { map: PEACHT, roughness: .9 }); const b = sphere(.7, m, g, 0, .7, 0, 18, 14); b.scale.set(1, .95, 1);
  const gr = box(.06, 1.0, .06, mat(0xc8443a), .02, g, 0, .74, .68); gr.rotation.x = -.12; cyl(.05, .07, .3, mat(0x5a3a1a), 5, g, 0, 1.45, 0); const lf = sphere(.26, mat(0x4aa84a, { roughness: .6 }), g, .26, 1.5, 0, 8, 6); lf.scale.set(1.5, .25, .7);
  if (bite) { const bt = sphere(.36, mat(0xfff0a0, { roughness: .4, emissive: 0x5a3a00, emissiveIntensity: .2 }), g, .5, .85, .25, 12, 10); bt.scale.set(.6, 1, 1); }
  g.scale.setScalar(s); return castSh(g); }
const PEACHES = Array.from({ length: 40 }, () => P_(peach()));
const BIGPEACH = P_(peach(1, true));
// lluvia de melocotones con gravedad y rebote (y0 = suelo); los que caen delante de la cámara se apartan
function peachRain(c, T0, T, n = 30, o = {}) { const t0 = T - T0; if (t0 < 0) return; const g = 26, y0 = o.y0 ?? 0, h = o.h ?? 26, sp = o.spread ?? 16;
  PEACHES.forEach((p, i) => { if (i >= n) return; const r = RNG(i * 31 + (o.seed ?? 1)); const d = r() * (o.dur ?? 1.2), t = t0 - d; if (t < 0) return; const x = c.x + (r() - .5) * sp * 2, z = c.z + (r() - .5) * sp * 1.4;
    let y = c.y + h - .5 * g * t * t; if (y < y0) { const tc = Math.sqrt(2 * (c.y + h - y0) / g), vb = g * tc * .35, tb = t - tc; y = y0 + Math.max(0, vb * tb - .5 * g * tb * tb); }
    p.visible = true; p.position.set(x, y, z); p.rotation.set(t * 3 + i, t * 2, 0); p.scale.setScalar(o.s ?? 1.2); }); }
// tarta de 18 con velas y un «18» encima
const CAKE = P_(new THREE.Group()); cake(CAKE, 18, 1.3); { const t = textPlane(1.6, 1.1, 160, 110, (c, w, h) => { c.font = `700 100px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 12; c.strokeStyle = '#7a1040'; c.strokeText('18', w / 2, h / 2 + 4); c.fillStyle = '#ffd23f'; c.fillText('18', w / 2, h / 2 + 4); }); t.position.set(0, 3.4, 0); CAKE.add(t); CAKE.userData.t = t; }
const FLAMES = []; CAKE.traverse(m => { if (m.isMesh && m.material && m.material.emissive && m.material.emissive.getHex && m.material.emissive.getHex() > 0x444400) FLAMES.push(m); });
const GIFTS = [0xd8323a, 0x2a6ad8, 0x2ab86a, 0xffb020].map(c => P_(new THREE.Group())).map((g, i) => { gift(g, [0xd8323a, 0x2a6ad8, 0x2ab86a, 0xffb020][i], 1.4); return g; });
const BALL1 = P_(new THREE.Group()); balloons(BALL1, 0, 0, 0, 5, 3); const BALL2 = P_(new THREE.Group()); balloons(BALL2, 0, 0, 0, 4, 8);
// geldschein: billete con la cara del ganador del Vape-Tag (Genau o yo), «50», «WOLKEN-EURO»
function face2D(c, x, y, s, who) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#ffd25a'; c.strokeStyle = '#3a2a10'; c.lineWidth = 4; c.beginPath(); c.roundRect(-50, -48, 100, 100, 18); c.fill(); c.stroke();
  if (who === 'me') { c.fillStyle = '#e0d4b4'; c.beginPath(); c.moveTo(-54, -10); c.quadraticCurveTo(-50, -70, 0, -66); c.quadraticCurveTo(50, -70, 54, -10); c.lineTo(30, -30); c.lineTo(0, -44); c.lineTo(-30, -30); c.closePath(); c.fill(); c.stroke(); }
  else { c.fillStyle = '#b8b8c0'; c.beginPath(); c.ellipse(0, -46, 50, 22, 0, PI, 0); c.fill(); c.stroke(); c.fillStyle = '#9a9aa2'; c.beginPath(); c.ellipse(-18, 26, 22, 8, -.2, 0, 7); c.ellipse(18, 26, 22, 8, .2, 0, 7); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; for (const s_ of [-1, 1]) { c.beginPath(); c.arc(s_ * 20, -6, 12, 0, 7); c.stroke(); } }
  c.fillStyle = '#1a1a1a'; for (const s_ of [-1, 1]) { c.beginPath(); c.arc(s_ * 20, -6, 6, 0, 7); c.fill(); } c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.beginPath(); c.arc(0, who === 'me' ? 14 : 38, 14, .2, PI - .2); c.stroke(); c.restore(); }
const noteTex = who => canvasTex(512, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#9ad8b0'); g.addColorStop(.5, '#e8f8e8'); g.addColorStop(1, '#9ad8b0'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.strokeStyle = '#2a7a4a'; c.lineWidth = 10; c.strokeRect(10, 10, w - 20, h - 20); c.globalAlpha = .2; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(w / 2, h / 2, 20 + i * 14, 0, 7); c.stroke(); } c.globalAlpha = 1;
  c.fillStyle = '#e8f8e8'; c.beginPath(); c.ellipse(w / 2, h / 2, 90, 100, 0, 0, 7); c.fill(); c.strokeStyle = '#2a7a4a'; c.lineWidth = 5; c.stroke(); face2D(c, w / 2, h / 2 + 6, .95, who);
  c.fillStyle = '#1e5a36'; c.font = `700 70px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('50', 70, 70); c.fillText('50', w - 70, h - 66); c.font = `700 30px ${FONT}`; c.fillText('WOLKEN-EURO', w / 2, h - 32); c.font = `700 22px ${FONT}`; c.fillText(who === 'me' ? 'FLOCKE' : 'BÜRGERMEISTER', w / 2, 34); });
const NOTE_M = P_(new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshStandardMaterial({ map: noteTex('mayor'), side: THREE.DoubleSide, roughness: .7 }))); NOTE_M.userData.noOutline = true;
const NOTE_I = P_(new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshStandardMaterial({ map: noteTex('me'), side: THREE.DoubleSide, roughness: .7 }))); NOTE_I.userData.noOutline = true;
const NOTES = Array.from({ length: 24 }, (_, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .8), new THREE.MeshStandardMaterial({ map: NOTE_I.material.map, side: THREE.DoubleSide, roughness: .8 })); m.castShadow = true; m.userData.noOutline = true; return P_(m); });
function notesRain(c, T0, T, n = 20, o = {}) { const t = T - T0; if (t < 0) return; const r0 = RNG(o.seed ?? 11), h = o.h ?? 9, sp = o.spread ?? 5;
  NOTES.forEach((m, i) => { if (i >= n) return; const r = () => r0(); const x0 = (r() - .5) * sp * 2, z0 = (r() - .5) * sp * 1.4, d = r() * .5, v = 2.2 + r() * 1.4; const tt = t - d; if (tt < 0) return;
    const y = Math.max(.05, c.y + h - tt * v); m.visible = true; m.position.set(c.x + x0 + Math.sin(tt * 3 + i) * .8, y, c.z + z0 + Math.cos(tt * 2.6 + i) * .5);
    if (y <= .05) m.rotation.set(-PI / 2, 0, i); else m.rotation.set(Math.sin(tt * 4 + i) * 1.1 - .4, tt * 2.5 + i, Math.cos(tt * 3.4 + i) * .7); }); }
// sobres de sueldo (GEHALT) con billetes asomando
const ENV = Array.from({ length: 3 }, (_, i) => { const g = P_(new THREE.Group()); box(2.2, 1.3, .12, mat(0xf2e2c0, { roughness: .9 }), .05, g, 0, 0, 0); for (let k = 0; k < 3; k++) { const n = box(1.8, .9, .02, mat(0x9ad8b0), .01, g, -.1 + k * .08, .5 + k * .06, .02); n.rotation.z = .1 - k * .1; }
  const t = textPlane(1.8, .5, 180, 50, (c, w, h) => { c.fillStyle = '#7a1a1a'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('GEHALT', w / 2, h / 2 + 2); }); t.position.set(0, -.15, .08); g.add(t); return castSh(g); });
// nubes de verdad (malla esponjosa): blob(n bolas) — se usan para la escalera, la nube gigante del hermano y la nube-alcalde
const CLOUDM = c => new THREE.MeshStandardMaterial({ color: c, roughness: 1, emissive: c, emissiveIntensity: .18 });
function blob(n, r, seed, col = 0xffffff, flat = .6) { const g = new THREE.Group(); const R = RNG(seed), m = CLOUDM(col); for (let i = 0; i < n; i++) { const a = R() * 6.283, d = R() * r * .8, s = r * (.35 + R() * .45); const b = sphere(s, m, g, Math.cos(a) * d, R() * r * flat * .5, Math.sin(a) * d * .7, 14, 10); b.castShadow = true; b.receiveShadow = true; } g.userData.m = m; return g; }
const STEPS = Array.from({ length: 9 }, (_, i) => P_(blob(9, 1.8, 40 + i, 0xffffff, .4)));
const BIG = P_(blob(36, 9, 7, 0xffc8a8, .9));
const MCLOUD = P_((() => { const g = blob(22, 6, 21, 0xffffff, 1.1); const m = CLOUDM(0xf0f0f4); const mu = [-1, 1].map(s => { const b = sphere(1.8, m, g, s * 1.7, 1.4, 4.6, 12, 8); b.scale.set(1.5, .55, .7); return b; });
  for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.2, .28, 8, 20), CLOUDM(0xe0e0e8)); r.position.set(s * 1.9, 3.6, 4.9); g.add(r); sphere(.45, mat(0x6a6e7a), g, s * 1.9, 3.6, 4.9, 10, 8); }
  const hat = sphere(3.4, m, g, 0, 6.6, 0, 14, 10); hat.scale.set(1.3, .5, 1.1); return g; })());
// mesita de fiesta (mantel de lunares), pedestal y cojín del trofeo
const TABLE = P_((() => { const g = new THREE.Group(); const top_ = box(4.4, .3, 3.2, mat(0xffffff, { map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#ff8ad0'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; for (let i = 0; i < 16; i++) { c.beginPath(); c.arc((i % 4) * 16 + 8, Math.floor(i / 4) * 16 + 8, 4, 0, 7); c.fill(); } }), roughness: .8 }), .08, g, 0, 3.25, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(.14, .14, 3.2, mat(0xf4f4f4), 6, g, sx * 1.9, 1.6, sz * 1.3); return castSh(g); })());
const PED = P_((() => { const g = new THREE.Group(); cyl(1.6, 1.9, 4, mat(0xf4efe6, { roughness: .4 }), 20, g, 0, 2, 0); cyl(2.1, 2.1, .4, mat(0xd8b040, { metalness: .8, roughness: .25 }), 20, g, 0, 4.1, 0); return castSh(g); })());
const PILLOW = P_((() => { const g = new THREE.Group(); const p = box(2.6, .6, 2.6, mat(0xb8102a, { roughness: .6 }), .28, g, 0, .3, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) sphere(.18, mat(0xffd23f, { metalness: .8 }), g, sx * 1.25, .4, sz * 1.25, 6, 4); return castSh(g); })());
// cámara escondida con lucecita roja, portátil con la grabación, caja fuerte, cronómetro, taubé, calendario
const CAMP = P_((() => { const g = new THREE.Group(); box(.9, .6, .7, mat(0x1a1a20, { roughness: .4 }), .1, g, 0, 0, 0); const l = cyl(.24, .28, .3, mat(0x2a2a30, { metalness: .6 }), 14, g, 0, 0, .45); l.rotation.x = PI / 2; sphere(.17, mat(0x2244aa, { roughness: .05, metalness: .6 }), g, 0, 0, .62, 12, 8);
  g.userData.led = sphere(.07, new THREE.MeshBasicMaterial({ color: 0xff2020, toneMapped: false }), g, .3, .2, .36, 8, 6); return castSh(g); })());
const LAP = P_((() => { const g = new THREE.Group(); box(3.2, .14, 2.2, mat(0xb8bcc8, { metalness: .7, roughness: .3 }), .06, g, 0, 0, 0); const lid = new THREE.Group(); lid.position.set(0, .07, -1.05); lid.rotation.x = -.25; g.add(lid); box(3.2, 2.1, .1, mat(0xb8bcc8, { metalness: .7, roughness: .3 }), .06, lid, 0, 1.05, 0);
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 200; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const s = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.8), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); s.position.set(0, 1.05, .06); lid.add(s);
  g.userData.draw = f => { f(cv.getContext('2d'), 320, 200); t.needsUpdate = true; }; return castSh(g); })());
const SAFE = P_((() => { const g = new THREE.Group(); const m = mat(0x3a3e48, { metalness: .7, roughness: .35 }); box(3, 3, 2.6, m, .15, g, 0, 1.5, 0); const d = new THREE.Group(); d.position.set(-1.4, 0, 1.32); g.add(d); box(2.7, 2.7, .2, mat(0x4a4e5a, { metalness: .75, roughness: .3 }), .1, d, 1.35, 1.5, 0);
  const dial = cyl(.4, .4, .16, mat(0xd8d8e0, { metalness: .9, roughness: .2 }), 18, d, 1.35, 1.6, .18); dial.rotation.x = PI / 2; g.userData.door = d; g.userData.glow = new THREE.PointLight(0xff9a6a, 0, 8, 1.6); g.userData.glow.position.set(0, 1.6, .8); g.add(g.userData.glow); return castSh(g); })());
const TAUBE = P_(pigeon(scene, 1)); const TAUBE2 = P_(pigeon(scene, 2));
const CAL = P_(kalender(scene, 6, 7.5)); let CALK = ''; function calDraw(k) { if (CALK === k) return; CALK = k; CAL.userData.draw((c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8202a'; c.fillRect(0, 0, w, 110); c.fillStyle = '#fff'; c.font = `700 70px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('MÄRZ', w / 2, 58);
  const d = { m13: '13', m14: '14', j2: '2' }[k]; c.fillStyle = '#1a1a1a'; c.font = `700 210px ${FONT}`; c.fillText(d, w / 2, 270); c.font = `700 40px ${FONT}`; c.fillStyle = '#2a6ad8'; c.fillText(k === 'm13' ? 'MORGEN: VAPE-TAG' : k === 'm14' ? 'VAPE-TAG' : 'JAHRE ROSENKOHL', w / 2, 430);
  if (k === 'm14') { c.strokeStyle = '#d8202a'; c.lineWidth = 12; c.beginPath(); c.ellipse(w / 2, 270, 150, 120, -.1, 0, 7); c.stroke(); } }); }
// cueva de hace 3000 años: cúpula de roca, suelo de tierra, hoguera, pinturas rupestres de nubes
const CAVE = new THREE.Group(); scene.add(CAVE); CAVE.position.set(HX, 0, 0); SETS.HH = CAVE; {
  const rockT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#7a6250'; c.fillRect(0, 0, w, h); const r = RNG(5); for (let i = 0; i < 900; i++) { c.fillStyle = ['#6a5242', '#8a725e', '#5a4436', '#94806a'][i % 4]; c.fillRect(r() * w, r() * h, 3 + r() * 10, 3 + r() * 8); } }); rockT.wrapS = rockT.wrapT = THREE.RepeatWrapping; rockT.repeat.set(4, 2);
  const dome = new THREE.Mesh(new THREE.IcosahedronGeometry(34, 3), new THREE.MeshStandardMaterial({ map: rockT, roughness: .95, flatShading: true, side: THREE.BackSide })); dome.scale.set(1, .55, 1); dome.position.set(0, 0, -20); CAVE.add(dome);
  const fl = new THREE.Mesh(new THREE.CircleGeometry(36, 32), new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 1 })); fl.rotation.x = -PI / 2; fl.position.set(0, .02, -20); fl.receiveShadow = true; CAVE.add(fl);
  const r = RNG(8); for (let i = 0; i < 40; i++) { const a = r() * 6.283, d = 22 + r() * 10; const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1 + r() * 3, 0), mat(0x6a5444, { roughness: .95, flatShading: true })); b.position.set(Math.cos(a) * d, r() * 2, -20 + Math.sin(a) * d); b.castShadow = true; CAVE.add(b); }
  const F = new THREE.Group(); F.position.set(0, 0, -30); CAVE.add(F); for (let k = 0; k < 6; k++) { const l = cyl(.3, .3, 4, mat(0x4a2a14), 6, F, 0, .4, 0); l.rotation.set(PI / 2, k / 6 * PI, 0); }
  for (let k = 0; k < 8; k++) sphere(.8, mat(0x6a6a6a, { roughness: 1 }), F, Math.cos(k / 8 * 6.283) * 2.6, .5, Math.sin(k / 8 * 6.283) * 2.6, 6, 5);
  const fm = [0xffd040, 0xff8a20, 0xff4a10].map(c => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(1.6), toneMapped: false, transparent: true, opacity: .9 }));
  CAVE.userData.flames = Array.from({ length: 7 }, (_, k) => { const f = new THREE.Mesh(new THREE.ConeGeometry(.7 - k * .05, 2.6, 7), fm[k % 3]); f.position.set(Math.cos(k * 1.7) * .7, 1.4, Math.sin(k * 1.7) * .7); F.add(f); return f; });
  const art = textPlane(16, 6, 640, 240, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(120,30,10,.85)'; c.fillStyle = 'rgba(120,30,10,.85)'; c.lineWidth = 8; for (let k = 0; k < 4; k++) { const x = 70 + k * 160; c.beginPath(); c.arc(x, 140, 18, 0, 7); c.stroke(); c.beginPath(); c.moveTo(x, 158); c.lineTo(x, 210); c.moveTo(x - 30, 180); c.lineTo(x + 30, 180); c.stroke();
    for (let j = 0; j < 4; j++) { c.beginPath(); c.arc(x + 40 + j * 18, 110 - j * 16, 14 + j * 6, 0, 7); c.stroke(); } } }); art.position.set(0, 8, -48); CAVE.add(art); }
function cueva(L) { hoehle(L); CAVE.userData.flames.forEach((f, k) => { f.scale.set(1, .8 + Math.abs(Math.sin(L.T * 9 + k * 2)) * .5, 1); f.rotation.y = L.T * 2 + k; }); LP[0].intensity = 130 + Math.sin(L.T * 17) * 25; }
// confeti, estrellitas: CONF de main.  Brillos alrededor de un punto 3D (oro)
function sparkle(c, T, n = 12, r = 2) { CONF.forEach((p, i) => { if (i >= n) return; const a = i / n * 6.283 + T * 1.5; p.visible = true; p.position.set(c.x + Math.cos(a) * r, c.y + Math.sin(T * 3 + i) * r * .5, c.z + Math.sin(a) * r); p.rotation.set(T * 4 + i, T * 3, 0); p.scale.setScalar(.6); }); }
// papá/abuela/quien sea le pone el vape en la boca a otro: el que recibe queda delante, con la boca justo en la boquilla
function feed(g, t, L, gx, gz, ry, o = {}) { put(g, gx, 0, gz, ry); const v = VP.get(g); v.visible = true; v.userData.grip.visible = true; v.userData.setGlow(o.glow ?? .5); FACES.push(t);
  put(t, gx + Math.sin(ry) * (o.d ?? 2.7), 0, gz + Math.cos(ry) * (o.d ?? 2.7), ry + PI); actuar(t, 0, [[0, { lean: .08, headX: .08, ...(o.tpose || {}) }]], { T: L.T });
  const my = mouthW(t).y; let best = null; const base = { aRz: -.12, aRe: .3, aLx: .2, ...(o.pose || {}) };
  for (let a = .2; a <= 2.2; a += .04) { applyPose(g, { ...base, aRx: a }); g.root.updateMatrixWorld(true); const tip = v.localToWorld(V(0, 1.42, 0)); const d = Math.abs(tip.y - my); if (!best || d < best.d) best = { a, d }; }
  actuar(g, 0, [[0, { ...base, aRx: best.a }]], { T: L.T }); g.root.updateMatrixWorld(true); const tip = v.localToWorld(V(0, 1.42, 0)), m = mouthW(t); t.root.position.x += tip.x - m.x; t.root.position.z += tip.z - m.z; return v; }

// ================= PLANOS =================
// 1 «In dieser Stadt» (GANCHO, solo estas palabras): fiesta de 18 en la plaza: un padre le pone el vape en la boca a su hijo, el hijo echa una nube enorme; globos «18», vecinos aplaudiendo
shot(0, 'C', 'hook', L => { stadt(L); const dad = EXS[5], son = EXS[2]; feed(dad, son, L, -1.6, 46, PI / 2 + .25, { glow: .9 }); cara(dad, L.T, { expr: 'happy', mouth: 'open_smile' }); cara(son, L.T, { expr: 'joy', eyes: L.lt > .3 ? 'happy' : 'wide', mouth: L.lt > .35 ? 'o' : 'flat' });
  if (L.lt > .35) { SMK.puff(mouthW(son).add(V(0, .3, 0)), V(.2, 1.4, .4), L.T, L.t0 + .35, .6, { pow: 7, size: 1.6, n: 60, dens: .9, seed: 3, life: 2 }); }
  show(BALL1, -5, 0, 43); show(BALL2, 5.5, 0, 44); show(CAKE, 3.6, 0, 43.2, 0, 1); show(TABLE, 3.6, 0, 43.2, 0, 1); crowdBox(L, -12, 12, 34, 40, 8, 3, { mode: i => i % 2 ? 'clap' : 'cheer', face: V(0, 3, 46) }); crowdBox(L, -26, 26, 10, 22, 8, 4, { mode: 'walk' });
  orb(L.k, V(-.2, 3.8, 46.2), null, [13, .18, .1, 46], [10.5, .06, .08, 42]); SHC = V(0, 0, 46); badge('gold', '18', W / 2 + 230, H * .2, (L.lt - .1) * 4, 1, .9); },
  [[.02, 'party_horn', .6], [.1, 'crowd_cheer', .6], [.38, 'vape_puff', 1], [.4, 'whoosh_up', .5]]);
// 2 «bekommt jeder an seinem»: calle del pueblo: tres vecinos abren su regalo y sacan su primer vape (le sale el humo); cámara lateral
shot(.81, 'W', null, L => { stadt(L); [[EXS[8], -5, 70, .25], [EXS[9], 0, 72, 0], [EXS[10], 5, 70, -.25]].forEach(([c, x, z, ry], i) => { const k = clamp((L.lt - .1 - i * .18) * 3);
  if (k < 1) { pose(c, x, 0, z, ry, L, { aLx: 1.2, aRx: 1.2, aLz: -.3, aRz: -.3, aLe: 1, aRe: 1 }, 'happy', { mouth: 'smile' }); const gg = GIFTS[i]; show(gg, x + Math.sin(ry) * 1.6, 2.6, z + Math.cos(ry) * 1.6, ry, .8); }
  else { vaper(c, L, L.t0 + .1 + i * .18 + .33, .35, { expr: 'joy', up: .4 }); const gg = GIFTS[i]; show(gg, x + Math.sin(ry) * 1.6, 0, z + Math.cos(ry) * 1.6, ry + .4, .8); } });
  crowdBox(L, -20, 20, 54, 60, 6, 6, { mode: 'walk' }); cm([-7, 5.2, 88, 0, 4.2, 71, 44], [5, 5, 87, 0, 4.2, 71, 44], L.k, easeOut); SHC = V(0, 0, 71); top('JEDER', (L.lt - .2) * 3, 'gold', .14, .9); },
  [[.15, 'paper_rip', .7], [.35, 'pop', .6], [.55, 'vape_puff', .8], [.7, 'crowd_happy', .4]]);
// 3 «achtzehnten Geburtstag»: la tarta con 18 velas: la cumpleañera las apaga con una nube de vape; «18» grande
shot(1.95, 'Z', 'punch', L => { stadt(L); const g = EXS[4]; put(g, 0, 0, 24.5, PI); show(CAKE, 0, 3.4, 21.8, 0, .62); show(TABLE, 0, 0, 21.8, 0, 1); FACES.push(g);
  const ph = vaper(g, L, L.t0 + .05, .3, { expr: 'joy', dir: V(0, -.55, -1), pow: 6, size: 1.1, n: 50, up: .1 }); for (const f of FLAMES) f.visible = L.lt < .55;
  crowdAt(L, 0, 22, 6, 6, 9, 9, { mode: 'clap', gap: .9 }); orb(L.k, V(0, 4.4, 23.2), null, [15, PI + .55, .26, 46], [12.5, PI + .35, .22, 44]); SHC = V(0, 0, 23); top('18', (L.lt - .05) * 4, 'gold', .14, 1.3); },
  [[.05, 'pop', .5], [.42, 'vape_puff', .9], [.6, 'candle_out', .7], [.7, 'applause', .5]]);
// 4 «eine Vape.»: el vape de cerca (plano de producto): mano que lo gira, LED encendido, rejillas, ventana del líquido; humito fino
shot(3.03, 'F', null, L => { stadt(L); const c = ich; put(c, 0, 0, 60, 0); holdV(c, L, { raise: .55, pose: { aLx: .3 } }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); VP.get(c).userData.setGlow(.6 + Math.sin(L.T * 6) * .3);
  const v = VP.get(c); v.updateMatrixWorld(true); const p = v.localToWorld(V(0, .7, 0)); cam([p.x + 2.4 - L.k * .8, p.y + .5, p.z + 4.2 - L.k * 1.2], [p.x, p.y + .1, p.z], 36); c.root.rotation.y = L.k * .5 - .2;
  SMK.puff(v.localToWorld(V(0, 1.45, 0)), V(0, 1, 0), L.T, L.t0, 1.2, { pow: 1.2, size: .3, n: 20, dens: .5, seed: 9, life: 1.4 }); DOF = 2; top('VAPE', (L.lt - .2) * 3, 'cyan', .14); },
  [[.05, 'click_set', .6], [.3, 'sparkle', .5], [.6, 'vape_hiss', .6]]);
// 5 «Der erste Zug»: fiesta de 18 de mi hermano en casa (el cuarto de la ventana): papá le pone el vape en la boca; globos y tarta
shot(4.55, 'S', null, L => { haus(L); const R = V(FX, 7.6, -10); papa.root.visible = true; feed(papa, bro, L, FX - 2.2, -8, PI / 2 - .2, { glow: .8 }); papa.root.position.y = 7.6; bro.root.position.y = 7.6;
  cara(papa, L.T, { expr: 'happy', mouth: 'open_smile' }); cara(bro, L.T, { expr: 'joy', mouth: 'o', eyes: 'half' }); show(BALL1, FX - 9, 7.6, -14); show(BALL2, FX + 9, 7.6, -14); show(TABLE, FX + 5, 7.6, -13, 0, 1); show(CAKE, FX + 5, 7.6 + 3.4, -13, 0, .9);
  HATS[MAIN.indexOf(bro)].visible = true; HATS[MAIN.indexOf(papa)].visible = true; cm([FX + 1, 11.4, 5, FX - .3, 10.8, -8, 46], [FX + 1.6, 11.2, 2, FX - .3, 10.8, -8, 42], L.k); lp(0, FX, 18, -4, 50, 0xffd8a0, 40); SHC = R; badge('tag', 'ERSTER ZUG', W / 2, H * .14, (L.lt - .3) * 3); },
  [[.05, 'party_horn', .5], [.3, 'vape_hiss', .7], [.6, 'crowd_happy', .3]]);
// 6 «meines großen Bruders»: primer plano de mi hermano dando su primera calada: el LED arde, se le hinchan los mofletes
shot(5.66, 'C', 'punch', L => { haus(L); put(bro, FX - .5, 7.6, -8, -.25); HATS[MAIN.indexOf(bro)].visible = true; const ph = vaper(bro, L, L.t0 - .25, 1.4, { expr: 'determined' }); VP.get(bro).userData.setGlow(1.3 + Math.sin(L.T * 30) * .3);
  bro.head.scale.set(1 + L.k * .08, 1, 1); onFace(bro, 4.6, -.2, .8, 40, L.k, 3.8); lp(0, FX, 18, -4, 50, 0xffd8a0, 40); badge('tag', 'GROSSER BRUDER', W / 2, H * .14, (L.lt - .1) * 3); },
  [[0, 'inhale_long', 1], [.3, 'vape_crackle', .7]]);
// 7 «hat Papa aus dem»: fachada: la nube revienta la ventana y papá sale volando dentro de ella
shot(6.64, 'R', null, L => { haus(L); const t = L.lt; SMK.puff(V(FX, 11.5, -2), V(0, .15, 1), L.T, L.t0 - .15, 1.0, { pow: 22, size: 4.2, n: 160, dens: 1, seed: 4, life: 2.4, spread: .5, up: .2 }); if (L.lt < .12) grade.uniforms.flash.value = .5;
  const k = clamp((t + .25) / .95), p = arc([FX, 11, -1], [FX + 4, 1, 20], 5, k); put(papa, p.x, p.y, p.z, PI); papa.root.rotation.x = -k * 3.2; actuar(papa, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .9, aRz: .9, lLx: .6, lRx: -.4 }]], { T: L.T }); cara(papa, L.T, { expr: 'shock', mouth: 'scream' }); FACES.push(papa);
  crowdBox(L, FX - 16, FX - 8, 22, 28, 3, 12, { mode: 'point', face: V(FX, 11, 0) }); cm([FX - 20, 7, 44, FX + 1, 9, 6, 50], [FX - 16, 6.5, 40, FX + 2, 8.6, 9, 50], L.k); SHC = V(FX, 0, 8); },
  [[0, 'big_puff', 1], [.05, 'glass_break', .8], [.15, 'scream_man', .6], [.4, 'whoosh', .6]]);
// 8 «Fenster gepustet.»: papá aterriza en el seto de flores delante de casa y rebota; la nube sigue saliendo por la ventana
shot(7.34, 'G', null, L => { haus(L); const t = L.lt + .7, y = Math.abs(Math.sin(t * 6)) * 2.2 * Math.exp(-t * 2.4); put(papa, FX + 3, y, 16, -.4); papa.root.rotation.z = Math.sin(t * 6) * .3 * Math.exp(-t * 2);
  actuar(papa, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: .9, aRz: .9, lLx: 1, lRx: .8, crouch: .3 }]], { T: L.T }); cara(papa, L.T, { expr: 'shock', eyes: 'terror', mouth: 'o' }); FACES.push(papa); dust(V(FX + 3, 0, 16), L.t0 + .02, L.T, 12, 1.2);
  SMK.puff(V(FX, 11.5, -1), V(0, .4, 1), L.T, L.t0 - .3, 1.6, { pow: 9, size: 2.6, n: 90, dens: .8, seed: 5, life: 2.6 }); onBody(papa, 15, -.3, .14, 44, L.k, 12.5, -.15); SHC = V(FX + 3, 0, 16); },
  [[.02, 'thud', 1], [.1, 'bush_rustle', .7], [.4, 'groan', .5]]);
// 9 «Und gestern hat jemand»: mi cuarto de noche: me levanto y miro a la estantería donde estaba mi vape: vacía
shot(8.49, 'B', null, L => { zimmer(L, true); pose(ich, KX + 4, 0, 1, .7, L, { aLx: .4, aRx: .4, headX: .1, headY: -.2 }, 'worried', { mouth: 'o' }); FACES.push(ich);
  cm([KX + 11, 8.6, 8, KX + 4, 4.4, 1, 46], [KX + 10, 8, 7, KX + 4, 4.4, 1, 44], L.k); badge('tag', 'GESTERN', W / 2, H * .14, (L.lt - .1) * 3); },
  [[.05, 'night_amb', .6], [.4, 'footsteps_wood', .5]]);
// 10 «meine Vape geklaut.»: el soporte vacío: el hueco del vape con polvo alrededor; yo detrás, horrorizado (zoom de golpe)
shot(9.49, 'Z', 'punch', L => { zimmer(L, true); pose(ich, KX + 9, 0, -5, .2, L, GEST.hands_head, 'shock', { mouth: 'scream' }); FACES.push(ich);
  onFace(ich, 5.2, .2, -.8, 42, L.k, 4.4); top('GEKLAUT!', (L.lt - .3) * 3.5, 'red', .14); }, [[.05, 'gasp', .8], [.35, 'sting', .7]]);
// 11 «Einen Tag vor dem»: el calendario: 13. MÄRZ — «MORGEN: VAPE-TAG»; una mano tacha el día
shot(10.65, 'S', null, L => { zimmer(L, true); calDraw('m13'); show(CAL, KX - 4, 9, -11.6, 0, 1); cm([KX - 4.4, 8.6, 6, KX - 4, 8.6, -11.6, 46], [KX - 4, 8.6, 4, KX - 4, 8.6, -11.6, 46], L.k); top('1 TAG', (L.lt - .2) * 3, 'gold', .1); },
  [[.1, 'page_flip', .7], [.4, 'clock_tick', .6]]);
// 12 «Vape-Tag.»: la plaza se prepara: el escenario con la pancarta NATIONALER VAPE-TAG; operarios cuelgan guirnaldas
shot(11.61, 'I', null, L => { stadt(L); crowdBox(L, -14, 14, -14, -8, 6, 7, { mode: i => i % 2 ? 'walk' : 'look', face: V(0, 10, -33) }); cm([0, 10, 18, 0, 11, -33, 48], [0, 13, 10, 0, 12, -33, 46], L.k); SHC = V(0, 0, -20); },
  [[.05, 'crowd_murmur', .5], [.3, 'hammer', .5], [.6, 'ding_reveal', .6]]);
// 13 «Denn vor dreitausend Jahren»: la cueva (sepia): hombres de las cavernas alrededor del fuego, todos vapeando; «VOR 3000 JAHREN»
shot(12.37, 'P', null, L => { cueva(L); const R = [EXS[12], EXS[13], EXS[14], EXS[15], EXS[16]];
  R.forEach((c, i) => { const a = -PI / 2 + (i - 2) * .55, x = HX + Math.cos(a) * 7, z = -30 + Math.sin(a) * 7 + 14; put(c, x, 0, z, Math.atan2(HX - x, -30 - z)); vapeLoop(c, L, i, { per: 2.2, inh: .5, expr: 'happy' }); FACES.push(c); });
  cm([HX + 3, 8, 6, HX, 4, -24, 48], [HX + 1, 7, 2, HX, 4, -24, 46], L.k); top('VOR 3000 JAHREN', (L.lt - .1) * 3, 'gold', .14, .9); },
  [[.05, 'fire_crackle', .8], [.3, 'cave_drip', .5], [.7, 'vape_puff', .5]]);
// 14 «haben die Leute so viel gedampft,»: la cueva se llena de nubes, todos echan humo a la vez
shot(13.9, 'R', null, L => { cueva(L); const R = [EXS[12], EXS[13], EXS[14], EXS[15], EXS[16], EXS[17]];
  R.forEach((c, i) => { const x = HX - 7.5 + i * 3, z = -26 + (i % 2) * 3; put(c, x, 0, z, (i - 2.5) * -.12); vaper(c, L, L.t0 - .6 + i * .08, .3, { expr: 'joy', pow: 6, size: 1.3, n: 40, up: 1.2, bg: true }); });
  SMK.haze(V(HX, 12, -30), L.T, 40, 22, 4, 10, 8, .55, 3); cm([HX - 4, 6, 4, HX, 5, -26, 48], [HX + 4, 6, 2, HX, 5, -26, 48], L.k); SHC = V(HX, 0, -26); },
  [[.05, 'big_puff', .8], [.5, 'cough_group', .5], [.8, 'fire_crackle', .5]]);
// 15 «dass wir es heute brauchen.»: la calle de hoy: todos caminan con su vape, nubes por encima
shot(15.34, 'W', null, L => { strasseS(L); [EXS[18], EXS[19], EXS[20], EXS[21]].forEach((c, i) => { const x = SX - 6 + i * 4, z = 12 - (i % 2) * 6; put(c, x, Math.abs(Math.sin(L.T * 9 + i)) * .1, z + L.lt * 2.2, 0); POST.push(() => toCam(c));
    vapeLoop(c, L, i, { per: 1.4, inh: .3, expr: 'happy', pose: { lLx: Math.sin(L.T * 9 + i) * .5, lRx: -Math.sin(L.T * 9 + i) * .5, aLx: -Math.sin(L.T * 9 + i) * .4 } }); });
  cm([SX - 2, 6, 34, SX, 4.4, 12, 46], [SX + 2, 5.6, 32, SX, 4.4, 13, 44], L.k); top('HEUTE', (L.lt - .1) * 3, 'cyan', .14); SHC = V(SX, 0, 12); },
  [[.05, 'street_amb', .6], [.3, 'footsteps', .5], [.6, 'vape_puff', .5]]);
// 16 «Keine Vape,»: un vecino sin vape: se agarra el cuello, cara morada, nadie le ayuda
shot(16.44, 'C', 'punch', L => { strasseS(L); const c = EXS[22]; pose(c, SX, 0, 8, .2, L, { aLx: 1.9, aRx: 1.9, aLz: -.4, aRz: -.4, aLe: 2.2, aRe: 2.2, lean: .15 + Math.sin(L.T * 20) * .03, headX: -.3 }, 'shock', { mouth: 'grimace_wide', eyes: 'terror' }); FACES.push(c);
  onFace(c, 6, .2, .6, 42, L.k, 5); TINT = 'rgba(80,0,140,.12)'; top('KEINE VAPE', (L.lt - .1) * 3.5, 'red', .14); }, [[.05, 'choke', .9], [.3, 'heartbeat', .7]]);
// 17 «keine Luft.»: se cae de rodillas; su amiga le pasa su vape y da una calada salvadora
shot(17.2, 'S', null, L => { strasseS(L); const c = EXS[22], f = EXS[23]; pose(c, SX, -.6, 8, .4, L, { crouch: .6, aLx: 1.4, aRx: .6, headX: -.2, lean: .3 }, 'shock', { mouth: 'grimace', eyes: 'worried' });
  pose(f, SX + 3, 0, 9, -PI / 2 - .3, L, { aRx: 1.5, aRe: .2, aRz: -.2, lean: .2 }, 'worried', { mouth: 'o' }); holdV(f, L, { raise: .3, pose: { aRx: 1.5, aRe: .2 } }); FACES.push(c, f);
  orb(L.k, V(SX + 1.5, 2.8, 8.5), null, [15, -.5, .2, 46], [13, -.3, .16, 46]); top('KEINE LUFT', (L.lt - .05) * 3.5, 'red', .14); }, [[.05, 'body_fall', .7], [.25, 'gasp', .6]]);
// 18 «Hunger?»: la cocina: me agarro la tripa, que ruge
shot(17.89, 'Z', null, L => { kuecheS(L); pose(ich, UX + 1, 0, 7, -.2, L, { aLx: .6, aRx: .6, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5, crouch: .12, lean: .15 }, 'sad', { mouth: 'wavy' }); FACES.push(ich);
  onBody(ich, 13, -.1, .1, 44, L.k, 11); top('HUNGER?', (L.lt - .05) * 4, 'gold', .14); }, [[.05, 'stomach_growl', 1], [.3, 'cartoon_boing', .3]]);
// 19 «Dann stellst du auf Döner-Geschmack.»: aprieto el botón del vape: pone DÖNER; calada y nube marrón con olor a döner; feliz
shot(18.27, 'F', null, L => { kuecheS(L); put(ich, UX + 1, 0, 7, -.3); vaper(ich, L, L.t0 + .25, .45, { expr: 'joy', flav: ['DÖNER', '#ffb060'], col: 0xe0b080 });
  onFace(ich, 6, 0, .9, 42, L.k, 5.2); top('DÖNER-GESCHMACK', (L.lt - .15) * 3, 'gold', .13, .9); }, [[.05, 'button_beep', .7], [.5, 'vape_puff', .9], [1.1, 'yum', .6]]);
// 20 «Durst? Apfelschorle-Geschmack.»: otro clic: APFELSCHORLE; nube dorada con burbujitas
shot(19.8, 'I', null, L => { kuecheS(L); put(ich, UX - 1, 0, 9.5, -.1); vaper(ich, L, L.t0 + .35, .5, { expr: 'happy', flav: ['APFELSCHORLE', '#ffe060'], col: 0xfff0a0 });
  onBody(ich, 10, -.15, .1, 42, L.k, 8.6, .05); badge('tag', 'DURST?', W / 2, H * .1, (L.lt) * 4); top('APFELSCHORLE', (L.lt - .4) * 3, 'gold', .17, .9); }, [[.05, 'gulp', .6], [.3, 'button_beep', .7], [.6, 'fizz', .7], [.9, 'vape_puff', .7]]);
// 21 «Aber wenn du frech bist,»: le saco la lengua a mamá, que se pone en jarras
shot(21.3, 'W', null, L => { kuecheS(L); pose(ich, UX - 1.9, 0, 8, .9, L, { aRx: 2.4, aRz: -.6, aRe: 1.8, aLx: 2.4, aLz: .6, aLe: 1.8, headY: Math.sin(L.T * 8) * .2 }, 'smug', { mouth: 'grin', eyes: 'wink' });
  pose(mama, UX + 1.9, 0, 8.6, -PI / 2 - .2, L, { aLx: .4, aRx: .4, aLz: .9, aRz: .9, aLe: 1.9, aRe: 1.9, lean: -.05 }, 'angry', { mouth: 'frown' }); FACES.push(ich, mama);
  cm([UX - 1, 6, 25, UX, 4, 8.3, 44], [UX + 1, 5.8, 23, UX, 4, 8.3, 44], L.k); top('FRECH', (L.lt - .3) * 3, 'red', .14); }, [[.05, 'raspberry', .7], [.5, 'hmph', .6]]);
// 22 «stellt Mama dich»: mamá me quita el vape y aprieta el botón (primer plano del vape: ROSENKOHL)
shot(22.62, 'C', 'punch', L => { kuecheS(L); put(mama, UX, 0, 6, .2); holdV(mama, L, { raise: .55, flav: ['ROSENKOHL', '#7aff6a'], pose: { aLx: 1.3, aLz: -.4, aLe: 1.3 } }); cara(mama, L.T, { expr: 'smug', mouth: 'smirk' }); FACES.push(mama);
  const v = VP.get(mama); v.updateMatrixWorld(true); const p = v.localToWorld(V(0, .5, 0)); cam([p.x + 1, p.y + 1.6, p.z + 4.6 - L.k * .8], [p.x, p.y + .9, p.z], 40); }, [[.1, 'button_beep', .8], [.4, 'evil_laugh', .4]]);
// 23 «auf Rosenkohl.»: mi nube sale verde; pongo cara de asco
shot(23.4, 'P', null, L => { kuecheS(L); put(ich, UX - 1, 0, 6, .1); vaper(ich, L, L.t0 - .15, .35, { expr: 'sad', flav: ['ROSENKOHL', '#7aff6a'], col: 0x7ad85a, after: 'grimace_wide', eyes: L.lt > .5 ? 'squint' : undefined });
  onFace(ich, 5.6, 0, -.8, 42, L.k, 4.8); TINT = 'rgba(40,160,40,.08)'; top('ROSENKOHL', (L.lt - .05) * 3.5, 'green', .14); }, [[.05, 'vape_puff', .8], [.4, 'gag', .8]]);
// 24 «Oder noch schlimmer:»: mamá, primer plano desde abajo, sonrisa malvada, la luz de la lámpara parpadea
shot(24.22, 'G', 'slow', L => { kuecheS(L); pose(mama, UX, 0, 4, 0, L, { aLx: 1.2, aRx: 1.2, aLz: -.3, aRz: -.3, aLe: 2, aRe: 2, headX: .1 }, 'smug', { mouth: 'grin', eyes: 'squint' }); FACES.push(mama);
  onFace(mama, 4.6, -1.4, 0, 42, L.k, 4); lp(0, UX, 11, 0, 30 + (Math.sin(L.T * 30) > .3 ? 20 : 0), 0xffe0b0, 40); }, [[.05, 'thunder', .5], [.3, 'evil_laugh', .6]]);
// 25 «auf Leberwurst.»: nube rosa-marrón; me pongo verde y me tapo la boca
shot(25.25, 'C', 'punch', L => { kuecheS(L); put(ich, UX + 1, 0, 7, -.3); vaper(ich, L, L.t0 - .1, .3, { expr: 'sad', flav: ['LEBERWURST', '#ff9ab0'], col: 0xc89a8a, after: 'grimace_wide', eyes: 'cry' }); if (L.lt > .7) sweat(ich, L.T, 2);
  onFace(ich, 5.4, 0, .7, 42, L.k, 4.6); TINT = 'rgba(120,80,40,.1)'; top('LEBERWURST', (L.lt - .05) * 3.5, 'red', .14); }, [[.05, 'vape_puff', .8], [.45, 'vomit_gag', .8]]);
// 26 «Ich heiße Flocke,»: yo en la plaza, saludo; mi nombre en un cartelito
shot(26.54, 'S', null, L => { stadt(L); pose(ich, 0, 0, 58, 0, L, WAVE(L.T), 'happy', { mouth: 'open_smile' }); FACES.push(ich); crowdBox(L, -20, 20, 44, 50, 8, 8, { mode: i => i % 2 ? 'walk' : 'talk' });
  onBody(ich, 13, .2, .12, 42, L.k, 11, -.1); top('FLOCKE', (L.lt - .4) * 3, 'cyan', .14); }, [[.05, 'pop', .5], [.4, 'ding', .6]]);
// 27 «und ich habe die kleinste»: doy una calada fuerte… y sale una nubecita de nada
shot(28.0, 'Z', null, L => { stadt(L); put(ich, 0, 0, 58, .15); vaper(ich, L, L.t0 - .1, .4, { expr: 'determined', size: .22, n: 8, pow: 1.4, after: 'flat', dens: .9 });
  onFace(ich, 5.6, 0, .6, 42, L.k, 4.8); top('MINI', (L.lt - .6) * 3, 'tag', .14); }, [[.05, 'inhale', .7], [.6, 'tiny_puff', .9], [.8, 'sad_trombone', .4]]);
// 28 «Wolke der ganzen Stadt.»: plano general: a mi alrededor todos echan nubes enormes; la mía, diminuta
shot(28.88, 'R', null, L => { stadt(L); put(ich, 0, 0, 58, 0); vaper(ich, L, L.t0 - .9, .3, { expr: 'sad', size: .22, n: 8, pow: 1.4, after: 'flat' });
  [EXS[24], EXS[25], EXS[26], EXS[27], EXS[28]].forEach((c, i) => { const a = (i - 2) * .55, x = Math.sin(a) * 7, z = 58 - Math.cos(a) * 6 + 2; put(c, x, 0, z, a * .4); vaper(c, L, L.t0 - .95 + i * .1, .4, { expr: 'smug', size: 2.2, pow: 8, n: 70, up: 1.4, bg: true }); });
  cm([0, 10, 82, 0, 6, 55, 46], [0, 13, 78, 0, 7, 55, 48], L.k); badge3('tag', 'MEINE', V(0, 7, 58), (L.lt - .2) * 3); SHC = V(0, 0, 56); }, [[.05, 'big_puff', .7], [.4, 'crowd_laugh', .5]]);
// 29 «Sogar mein großer Bruder»: mi hermano en el sofá del salón (cuarto de la ventana) hace anillos de humo perfectos
shot(30.22, 'I', null, L => { haus(L); put(bro, FX + 1, 7.6, -12, .1); vaper(bro, L, L.t0 - .1, .4, { expr: 'smug', size: 1.4, pow: 4, n: 40 }); show(BALL1, FX - 8, 7.6, -16);
  onBody(bro, 12, -.25, .1, 44, L.k, 10.5, -.05); lp(0, FX, 18, -4, 50, 0xffd8a0, 40); badge('tag', 'MEIN BRUDER', W / 2, H * .14, (L.lt - .1) * 3); }, [[.05, 'vape_puff', .8], [.5, 'smoke_ring', .5]]);
// 30 «lacht mich aus.»: se parte de risa y me señala
shot(31.28, 'C', 'punch', L => { haus(L); pose(bro, FX + 1, 7.6, -12, -.1, L, LAUGH(L.T), 'joy'); laughF(bro, L.T); FACES.push(bro); onFace(bro, 5, 0, -.6, 42, L.k, 4.3); lp(0, FX, 18, -4, 50, 0xffd8a0, 40); },
  [[.02, 'laugh_man', 1], [.5, 'laugh_man', .6]]);
// 31 «Am vierzehnten März»: el calendario de la cocina: 14 rodeado en rojo
shot(32.15, 'W', null, L => { kuecheS(L); calDraw('m14'); show(CAL, UX - 9, 9.6, -13.6, 0, .9); cm([UX - 9.4, 9.4, 4, UX - 9, 9.4, -13.6, 46], [UX - 9, 9.4, 2, UX - 9, 9.4, -13.6, 46], L.k); top('14. MÄRZ', (L.lt - .15) * 3, 'gold', .13); },
  [[.1, 'marker_circle', .8], [.5, 'ding', .5]]);
// 32 «ist der Nationale Vape-Tag.»: la plaza en fiesta: escenario, pancarta, guirnaldas y todo el pueblo celebrando con nubes de colores
shot(33.31, 'Z', 'punch', L => { stadt(L); crowdBox(L, -22, 22, -10, 10, 22, 9, { mode: i => i % 3 ? 'cheer' : 'clap', face: V(0, 5, -26) }); confetti(V(0, 0, 0), L.t0, L.T, 50, 16);
  cm([0, 9, 30, 0, 9, -26, 50], [0, 11, 24, 0, 10, -26, 48], L.k); SHC = V(0, 0, -10); }, [[.02, 'crowd_cheer', .8], [.2, 'fanfare', .6], [.6, 'party_horn', .5]]);
// 33 «Die größte Wolke gewinnt»: un concursante en el escenario echa una nube que sube por encima de la plaza
shot(34.82, 'F', null, L => { stadt(L); const c = EXS[29]; put(c, 6, 4, -23, -.2); vaper(c, L, L.t0 - .2, .3, { expr: 'determined', size: 3, pow: 12, n: 90, up: 2.5, dirUp: 1.4, life: 3.4 });
  crowdBox(L, -16, 16, -12, -4, 10, 10, { mode: 'look', face: V(4, 14, -23), expr: 'shock' }); cm([8, 7, 4, 6, 10, -23, 50], [9, 6.4, 2, 6, 12, -23, 52], L.k); SHC = V(6, 0, -20); top('GRÖSSTE WOLKE', (L.lt - .2) * 3, 'gold', .13, .9); },
  [[.05, 'inhale_long', .7], [.4, 'big_puff', 1], [.7, 'crowd_oooh', .6]]);
// 34 «die Goldene Vape,»: el trofeo: la Goldene Vape gira sobre un cojín rojo, destellos
shot(35.96, 'I', 'slow', L => { stadt(L); show(GOLDV, 5, 8.5, -24, L.T * 1.6, 1.9); GOLDV.userData.setGlow(1.4); const cu = PILLOW; show(cu, 5, 7.9, -24, 0, 1); show(PED, 5, 4, -24, 0, .9); sparkle(V(5, 10.5, -24), L.T, 16, 3);
  cm([5, 10, -12, 5, 9.6, -24, 44], [5, 9.8, -14, 5, 9.6, -24, 42], L.k); lp(0, 5, 16, -18, 40, 0xffe0a0, 30); top('GOLDENE VAPE', (L.lt - .15) * 3, 'gold', .13, .9); }, [[.05, 'sparkle', .8], [.3, 'choir_ah', .5]]);
// 35 «und dein Gesicht kommt»: el último ganador (el alcalde) posa sonriendo: flash del fotógrafo
shot(37.0, 'F', null, L => { stadt(L); pose(mayor, 5, 4, -24, -.1, L, { aLx: .4, aRx: 2.4, aRz: .4, aRe: .6 }, 'happy', { mouth: 'grin' }); FACES.push(mayor); holdV(mayor, L, { special: GOLDV, raise: .9, pose: { aRx: 2.4 } });
  onFace(mayor, 6, 0, .7, 42, L.k, 5.2); if (L.lt > .35 && L.lt < .5) grade.uniforms.flash.value = .8; badge('tag', 'GEWINNER', W / 2, H * .14, (L.lt - .1) * 3); }, [[.35, 'camera_flash', 1], [.5, 'crowd_cheer', .4]]);
// 36 «auf den Geldschein.»: la foto se convierte en el billete de 50 WOLKEN-EURO con su cara
shot(38.12, 'Z', 'punch', L => { stadt(L); show(NOTE_M, 0, 10, 30, 0, 1); NOTE_M.rotation.set(-.1, Math.sin(L.T * 2) * .15, Math.sin(L.T * 1.3) * .05);
  cm([0, 9.3, 35.2, 0, 9.1, 30, 40], [0, 9.3, 34.4, 0, 9.1, 30, 40], L.k); notesRain(V(0, 0, 30), L.t0, L.T, 14, { h: 14, spread: 4 }); top('GELDSCHEIN', (L.lt - .2) * 3, 'green', .13); },
  [[.05, 'cash_reg', .9], [.3, 'money_rain', .6]]);
