// Diamant — ~69 planos sincronizados con audio/words.json (1080×1920, 30 fps).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane, checkTex } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, noiseTex, stripes, screen, txt, tree, makeExtra } from './props.js';
import { B, gold, glass, label, makeMats, makeGrimm, makeMayor, makeNoble, makeLady, makeBeggar, makeSuitor, makeGirl, makeSweeper2, town, desert, classroom, tankIn, tank, diamondRain, crowd, rubberSheet, chest, loaf, cat, shovel, carriage, pencil } from './diam.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 119.46, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfe3ff, .001);
const camera = new THREE.PerspectiveCamera(50, W / H, .6, 2500); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach((c, i) => c.position.set(-800 + i * 170, 360 + (i % 3) * 70, -1400));
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a8070, 1.7); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 700 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-70, 140, 90)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }
// ---------- escenarios ----------
const DX = 800, CX = 1100, TX = 1200;
const T0 = town(scene), G = T0.G, PZ = T0.PZ; const DES = desert(scene, DX), CLS = classroom(scene, CX), TIN = tankIn(scene, TX);
// ---------- reparto ----------
const mats = makeMats(scene), grimm = makeGrimm(scene), grimmT = makeGrimm(scene, true), mayor = makeMayor(scene), noble = makeNoble(scene), lady = makeLady(scene), beggar = makeBeggar(scene), suitor = makeSuitor(scene), girl = makeGirl(scene), sw2 = makeSweeper2(scene);
const ex = Array.from({ length: 12 }, (_, i) => makeExtra(scene, i));
const POOLC = [mats, grimm, grimmT, mayor, noble, lady, beggar, suitor, girl, sw2, ...ex];
// ---------- atrezo ----------
const DR = diamondRain(scene, 900), BIG = diamondRain(scene, 160), CR = crowd(scene, 420), SHEET = rubberSheet(scene), TANK = tank(scene), CHEST = chest(scene), LOAF = loaf(scene), CAT = cat(scene), SHV = shovel(scene, true), SHM = shovel(scene, false), CAR = carriage(scene), PEN = pencil(scene);
BIG.scale.setScalar(1); BIG.material = BIG.material.clone(); BIG.material.emissiveIntensity = .7;
const helmets = [0, 1, 2].map(() => { const h = new THREE.Mesh(new THREE.SphereGeometry(.85, 20, 10, 0, 6.283, 0, 1.4), mat(0x8a8f9a, { metalness: .8, roughness: .3 })); scene.add(h); return h; });
const umbs = [0, 1].map(k => { const g = new THREE.Group(); scene.add(g); const c = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1, 10, 1, true), mat(k ? 0x2a2a30 : 0x6a7078, { metalness: .8, roughness: .3, side: THREE.DoubleSide })); c.position.y = 3; g.add(c); cyl(.06, .06, 3, mat(0x333333), 6, g, 0, 1.5, 0); return g; });
const smoke = []; for (let k = 0; k < 24; k++) smoke.push(sphere(1, mat(0xd8d8d8, { transparent: true, opacity: .6, roughness: 1 }), scene, 0, 0, 0, 10, 8));
const fires = []; for (let k = 0; k < 16; k++) { const f = new THREE.Mesh(new THREE.ConeGeometry(1 + (k % 3) * .5, 3 + (k % 4), 8), B([2.4, .9 + (k % 3) * .3, .15])); scene.add(f); fires.push(f); }
const shards = []; for (let k = 0; k < 14; k++) shards.push(box(.4 + (k % 3) * .2, .06, .3, mat(0xc0c4cc, { metalness: .9, roughness: .2 }), .02, scene));
const sparks = []; for (let k = 0; k < 40; k++) sparks.push(sphere(.08, B([3, 2.6, 1.2]), scene, 0, 0, 0, 4, 3));
const confetti = []; for (let i = 0; i < 120; i++) { const col = [0xff5a85, 0xffd23f, 0x3fa8ff, 0x2ec46a, 0x9b5de5, 0xff8a23][i % 6]; const c = new THREE.Mesh(new THREE.PlaneGeometry(.5, .3), new THREE.MeshStandardMaterial({ color: col, side: THREE.DoubleSide, emissive: col, emissiveIntensity: .3 })); scene.add(c); confetti.push(c); }
const steam = []; for (let k = 0; k < 8; k++) steam.push(sphere(.25, mat(0xffffff, { transparent: true, opacity: .45 }), scene, 0, 0, 0, 8, 6));
const flies = []; for (let k = 0; k < 10; k++) flies.push(sphere(.08, mat(0x111111), scene, 0, 0, 0, 4, 3));
const tele = new THREE.Group(); scene.add(tele); { const t = cyl(.18, .28, 2.2, mat(0x8a5a2a, { metalness: .3 }), 12, tele, 0, 0, 0); t.rotation.x = Math.PI / 2; const r = cyl(.3, .3, .3, gold(), 12, tele, 0, 0, 1.1); r.rotation.x = Math.PI / 2; }
const mega = new THREE.Group(); scene.add(mega); { const c = new THREE.Mesh(new THREE.ConeGeometry(.6, 1.6, 14, 1, true), mat(0xd8d8d8, { metalness: .6, side: THREE.DoubleSide })); c.rotation.x = -Math.PI / 2; c.position.z = .8; mega.add(c); box(.3, .7, .3, mat(0x2a2a2a), .05, mega, 0, -.4, 0); }
const torch = new THREE.Group(); scene.add(torch); { cyl(.12, .16, 2, mat(0x6a4a2a), 8, torch, 0, 0, 0); const f = new THREE.Mesh(new THREE.ConeGeometry(.45, 1.2, 8), B([2.6, 1.1, .2])); f.position.y = 1.5; torch.add(f); }
const bread = box(1.3, .9, .25, mat(0xe8c48a, { roughness: .9 }), .2, scene); box(1.4, 1.0, .2, mat(0xa8682a), .25, bread, 0, 0, -.06);
const PROPS = [DR, BIG, CR.bi, CR.hi, SHEET, TANK, CHEST, LOAF, CAT, SHV, SHM, CAR, PEN, helmets, umbs, smoke, fires, shards, sparks, confetti, steam, flies, tele, mega, torch, bread].flat();

// ---------- utilidades ----------
const SETS = { G, DES, CLS, TIN: TIN.g };
const OUTS = ['G', 'DES'];
const use = (...n) => { for (const k of n) [].concat(SETS[k]).forEach(o => o.visible = true); if (!n.some(k => OUTS.includes(k))) { hemi.intensity = 1.0; sun.intensity = .9; bloom.strength = .22; } };
function day(k) { const u = sky.sky.material.uniforms; u.top.value.setRGB(.02 + .26 * k, .03 + .52 * k, .1 + .82 * k); u.mid.value.setRGB(.04 + .5 * k, .06 + .7 * k, .18 + .78 * k); u.hor.value.setRGB(.1 + .72 * k, .14 + .76 * k, .3 + .66 * k); sky.moon.material.opacity = 0;
  hemi.intensity = .35 + 1.35 * k; hemi.color.setRGB(.5 + .31 * k, .55 + .35 * k, 1); sun.intensity = .3 + 2.4 * k; sun.color.setRGB(.6 + .4 * k, .7 + .24 * k, 1 - .15 * k); rim.intensity = 2.2 - .9 * k; scene.fog.color.setRGB(.05 + .7 * k, .08 + .8 * k, .2 + .78 * k); scene.fog.density = .0008;
  T0.lamps.forEach(l => l.userData.bulb.material.emissiveIntensity = .2 + (1 - k) * 3); bloom.strength = .26 + (1 - k) * .3; }
function night(k = 1) { day(1 - .88 * k); const u = sky.sky.material.uniforms; u.top.value.lerp(new THREE.Color(.03, .05, .14), k); u.mid.value.lerp(new THREE.Color(.08, .1, .24), k); u.hor.value.lerp(new THREE.Color(.16, .2, .36), k); hemi.color.setRGB(.55, .65, 1); hemi.intensity = Math.max(hemi.intensity, .5 + .45 * k); grade.uniforms.sat.value = 1.48 - .2 * k; }
function hideAll() {
  for (const c of POOLC) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.head.scale.set(1, 1, 1); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); }
  for (const k in SETS) [].concat(SETS[k]).forEach(o => o.visible = false); T0.gates.forEach((g, i) => g.rotation.y = 0); T0.holes.forEach(h => h.visible = false); TANK.userData.holes.forEach(h => h.visible = false); TIN.cracks.forEach(c => c.visible = false); TANK.userData.tur.rotation.set(0, 0, 0); SHEET.userData.set(0); CHEST.userData.lid.rotation.x = 0; T0.hatch.rotation.x = 0;
  grade.uniforms.vig.value = .3; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.48; day(1); ao.enabled = false; }
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
function face(ch, f, T) { const s = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(s.eyes)) s.eyes = 'closed'; ch.setFace(s); }
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; } applyPose(ch, { ...p, ...extra }); }
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const punch = (lt, at, amt = .3, d = .18) => lt < at ? 1 : 1 - amt * easeOut((lt - at) / d) * (lt - at < .6 ? 1 : clamp(1 - (lt - at - .6) / .3));
const hp = ch => ch.head.getWorldPosition(V(0, 0, 0)); const handP = (ch, r = 1) => (r ? ch.aR : ch.aL).hand.getWorldPosition(V(0, 0, 0));
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy, h.z + fz * d - fx * side], [h.x, h.y - .3, h.z], fov); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b); const talkFace = (ch, T, a, b, f) => face(ch, { ...f, mouth: lip(T, spoken(a, b)) || f.mouth }, T);
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function walkTo(ch, x0, z0, ry, T, lt, speed = 3, run = false, sp = .6, tired = 0) { const d = speed * lt; put(ch, x0 + Math.sin(ry) * d, 0, z0 + Math.cos(ry) * d, ry); applyPose(ch, run ? runPose(T, 1.0) : walkPose(T, sp, tired)); }
const wt = (w, after = 0) => { const x = WORDS.find(q => q[0] >= after - .01 && q[2].replace(/[.,:?!„“"]/g, '').toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error('word ' + w); return x[0]; };
const ST = {}; for (const w of WORDS) if (!(w[3] in ST)) ST[w[3]] = w[0]; const st = n => ST[n];
function confettiAt(cx, cy, cz, T, sp = 16) { confetti.forEach((c, i) => { c.visible = true; const ph = (T * .25 + i * .0618) % 1; c.position.set(cx + Math.sin(i * 7.1) * sp + Math.sin(T * 2 + i) * .8, cy + 14 - ph * 16, cz + Math.cos(i * 3.3) * sp); c.rotation.set(T * 4 + i, T * 3 + i * 2, i); }); }
function smokeAt(cx, cy, cz, t, col = null, sc = 1) { smoke.forEach((s, i) => { s.visible = t > 0; const a = i * 2.399, r = (t * (3 + (i % 4))) * sc; s.position.set(cx + Math.cos(a) * r, cy + ((i % 3) * .5 + t * 1.5) * sc, cz + Math.sin(a) * r); s.scale.setScalar((.5 + t * 1.6) * sc); s.material.opacity = clamp(.7 - t * .45); if (col) s.material.color.set(col); else s.material.color.set(0xd8d8d8); }); }
function sparksAt(c, T) { sparks.forEach((s, k) => { const t = (T * 2.4 + k * .137) % 1, a = k * 2.399; s.visible = true; s.position.set(c.x + Math.cos(a) * t * 2.4, c.y + 2.4 * t - 4 * t * t, c.z + Math.sin(a) * t * 2.4); }); }
const HOLD = { aRx: .95, aRe: 1.25, aRz: -.3, aLx: .95, aLe: 1.25, aLz: -.3, headX: .3 };
const SIT = { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLz: .15, aRz: .15 };
const sit = (ch, x, y, z, ry, extra = {}) => { const s = ch.spec.scale || 1; put(ch, x, y - (2.05 - .2) * s + .08, z, ry); applyPose(ch, { ...SIT, ...extra }); };
const CHEER = { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .2, aRe: .2 };
const SHRUG = { aLz: .9, aRz: .9, aLe: 1.4, aRe: 1.4, aLx: .3, aRx: .3, headZ: .15 };
const POINT = { aRx: 1.55, aRe: .05, aRz: .1 };
const FACEPALM = { aRx: 2.3, aRe: 2.1, aRz: -.4, headX: .25 };
function fireAt(c, n, s, T) { fires.forEach((f, k) => { f.visible = k < n; f.position.set(c.x + Math.sin(k * 2.3) * 3 * s, c.y + (k % 3) * s, c.z + Math.cos(k * 1.7) * 3 * s); f.scale.set(s, s * (.8 + .4 * Math.sin(T * 14 + k)), s); }); }
function shardsAt(c, t) { shards.forEach((s, k) => { const a = k * 2.399; s.visible = t > 0 && t < 1.5; s.position.set(c.x + Math.cos(a) * t * 4, Math.max(.1, c.y + 3 * t - 6 * t * t), c.z + Math.sin(a) * t * 4); s.rotation.set(t * 9 + k, k, t * 6); }); }
const helmetOn = (ch, i = 0) => { const h = helmets[i]; h.visible = true; h.position.copy(hp(ch)).add(V(0, 1.05 * (ch.spec.scale || 1), 0)); h.scale.setScalar(ch.spec.scale || 1); };
const umbOn = (ch, i = 0) => { const u = umbs[i]; u.visible = true; u.position.copy(handP(ch)).add(V(0, -.4, 0)); };
// diamantes cayendo alrededor de un punto (lluvia ligera de día)
const drizzle = (c, T, o = {}) => DR.userData.fall(c, T, { R: 26, Hh: 34, speed: 1.2, size: .9, count: 520, onGround: 160, ...o });

// ---------- capa 2D ----------
// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD.push({ kind, text, x, y, s: spring(k * 1.6) * sc, a });
function pill(c, text, col, glow) { c.font = `700 54px ${FONT}`; const w = c.measureText(text).width + 120; c.shadowColor = glow; c.shadowBlur = 30; c.fillStyle = col; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.shadowBlur = 0; c.lineWidth = 6; c.strokeStyle = '#fff'; c.stroke();
  c.fillStyle = col; c.beginPath(); c.moveTo(-14, 38); c.lineTo(14, 38); c.lineTo(0, 58); c.fill(); const cg = c.createRadialGradient(-w / 2 + 36, -10, 4, -w / 2 + 42, 0, 40); cg.addColorStop(0, '#fffb56'); cg.addColorStop(1, '#f5c400'); c.fillStyle = cg; c.beginPath(); c.arc(-w / 2 + 42, 0, 30, 0, 7); c.fill(); c.fillStyle = '#c88a00'; c.font = `700 36px ${FONT}`; c.fillText('€', -w / 2 + 42, 2); c.fillStyle = '#fff'; c.font = `700 54px ${FONT}`; c.fillText(text, 26, 3); }
function drawBadge(b) {
  if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = x; b.y = y; } if (b.s <= .01 || b.a <= 0) return; const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'pay') pill(c, b.text, '#ff5a85', 'rgba(255,255,255,.9)'); else if (b.kind === 'free') pill(c, b.text, '#2ee69a', 'rgba(255,255,255,.9)');
  else if (b.kind === 'big' || b.kind === 'red' || b.kind === 'green') { c.font = `700 100px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 620) { const k = 620 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : b.kind === 'green' ? '#0a3a1a' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50);
    if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#9aff9a'); g.addColorStop(1, '#22c46a'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 48px ${FONT}`; const w = c.measureText(b.text).width + 56; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#ffd23f'; c.fillText(b.text, 0, 3); }
  c.restore(); }
const KEY = /^(Stadt|Diamanten|wertlos|300|Kilometer|Himmel|tödliche|Kugeln|Sirenen|Bunker|verkehrt|Reiche|Holzknöpfen|Brot|Bettler|Katzen|faustgroßen|Bleistift|Antrag|geweint|Holz|Villa|Mats|16|Diamantenkehrer|Millionen|Gully|Kutschen|Gummi|Metall|zerspringt|Baron|Grimm|Wüste|regnet|reichste|Königreich|Panzer|Marktplatz|50|Tonnen|Mittag|brenne|Bürgermeister|Müllkippe|Müll|gedemütigt|500|schwarz|Taifun|Bowlingkugeln|lachte|wertlosen|zerquetschen|Panik|abprallen|Gummiband|Mühle|Menge|Himmel|Ping|Trampolin|zurück|Bumm|Milliarden|Grimms|Krach|Stahl|Papier|explodierte|Umhang|Fetzen|nie|Truhe|10\.000|gerettet|Vermögen|lächelte|Sauerteigbrot|Held|50-Karat-Diamanten)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(k * 1.6), a: 1 });
const W2 = (w, n) => wt(w, st(n));
const walkers = (T, lt, n = 8, z0 = 20, umb = true) => { for (let i = 0; i < n; i++) { const e = ex[i], s = i % 2 ? 1 : -1; walkTo(e, s * (14 + (i % 3) * 1.8), z0 - i * 11, i % 3 === 2 ? Math.PI : 0, T + i * .3, lt, 2.2); face(e, { eyes: 'open', mouth: i % 3 ? 'smile' : 'flat' }, T + i); if (umb && i < 2) umbOn(e, i); else if (i < 5) helmetOn(e, i - 2); } };
const price = textPlane(6, 4.6, 360, 276, (c, w, h) => { c.fillStyle = '#2a1e14'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e9c23a'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); txt(c, 'PREISE', w / 2, 40, 36, '#e9c23a'); txt(c, 'BROT · 5.000 €', w / 2, 110, 36, '#fff'); txt(c, 'HOLZKNOPF · 900 €', w / 2, 165, 32, '#fff'); txt(c, 'DIAMANT · 0 €', w / 2, 225, 38, '#ff5a5a'); }, .3); price.position.set(15.6, 6, 42); price.rotation.y = -Math.PI / 2; G.add(price);
const villaS = label(6, 1.6, 'VILLA · BILLIG!', '#f4f0e0', '#b8322a', 54, .3); villaS.position.set(-15.4, 4, -60); villaS.rotation.y = Math.PI / 2; G.add(villaS);
const pileAt = (c, R = 12, Hh = 9, n = 700) => DR.userData.custom((i, [a, b, e, f], d) => { if (i >= n) return false; const r = Math.sqrt(a) * R, ang = b * 6.283, y = Hh * (1 - r / R) * (.4 + .6 * e); d.position.set(c.x + Math.cos(ang) * r, c.y + y, c.z + Math.sin(ang) * r); d.rotation.set(a * 6, b * 6, e * 6); d.scale.setScalar(.7 + f * .6); return true; });
const DUMPC = V(-46, 5, -120), TK = V(0, 0, -176), CRW = V(0, 0, -140);

// 1 GANCHO: golpe de zoom con "ding" sobre el pueblo entre montañas, lloviendo diamantes
shot(0, 'C', null, L => { use('G'); walkers(L.T, L.lt, 8, 30); DR.userData.fall(V(0, 0, -60), L.T, { R: 70, Hh: 90, speed: .9, size: 2.6, count: 900 });
  const z0 = .3; if (L.T < z0) { const k = easeOut(L.T / z0); cam([0, lerp(150, 92, k), lerp(170, 100, k)], [0, 0, -110], lerp(76, 52, k)); } else cm([0, 92, 100, 0, 0, -110, 52], [0, 70, 76, 0, 0, -120, 50], (L.T - z0) / (L.t1 - z0), q => q);
  sh(V(0, 0, -40), 90); }, [[0, 'zoom_fast', .9], [.02, 'whoosh', .6], [.4, 'wind', .5], [.9, 'glass_rattle', .4], [1.5, 'bells', .3]]);
// 2 ...und Diamanten sind komplett wertlos: a pie de calle, paraguas de metal, un niño los patea aburrido
shot(W2('und', 1), 'W', null, L => { use('G'); drizzle(V(-4, 0, 6), L.T); put(ex[6], -6, 0, 8, .4); const k = clamp((L.lt - .7) / .3); applyPose(ex[6], k > 0 && k < 1 ? { lRx: 1.2 * Math.sin(k * Math.PI), lRk: .2, aLz: .3, aRz: .3 } : { aLz: .2, aRz: .2, ...idlePose(L.T) }); face(ex[6], { eyes: 'half', mouth: 'flat', brows: -.2 }, L.T);
  walkTo(ex[0], -1, -6, 0, L.T, L.lt, 1.6); umbOn(ex[0], 0); walkTo(ex[1], 4, -14, 0, L.T + .5, L.lt, 1.6); helmetOn(ex[1], 0); face(ex[0], { eyes: 'open', mouth: 'flat' }, L.T);
  cm([-2, 2.4, 20, -5, 3.4, 4, 50], [-2.4, 2.4, 18.6, -5, 3.4, 4, 48], L.k); if (L.lt > W2('wertlos', 1) - L.t0) badge('red', 'WERTLOS', W / 2, H * .16, L.lt - (W2('wertlos', 1) - L.t0)); sh(V(-4, 0, 4), 22); }, [[0, 'glass_rattle', .6], [.3, 'steps', .4], [.75, 'kick', .6], [.85, 'pling', .5], [1.4, 'sigh', .4]]);
// 3 300 km/h: un hombre con casco mira al cielo lleno de diamantes cayendo
shot(st(2), 'Z', null, L => { use('G'); put(ex[1], 3, 0, -10, .3); applyPose(ex[1], { headX: -.6, aLz: .4, aRz: .4 }); face(ex[1], { eyes: 'wide', mouth: 'o', look: [0, -1] }, L.T); helmetOn(ex[1], 0); DR.userData.fall(V(3, 0, -12), L.T, { R: 14, Hh: 60, speed: 2.4, size: 1.1, count: 700, onGround: 120 });
  cm([7, 2.6, -1, 2, 6.6, -14, 56], [6.4, 2.6, -2, 2, 7.2, -14, 54], L.k); badge('big', '300 KM/H', W / 2, H * .15, L.lt - .4); sh(V(3, 0, -10), 20); }, [[0, 'whoosh_down', .6], [.4, 'wind', .5], [1.0, 'whoosh', .5], [1.8, 'glass_rattle', .5], [2.5, 'whoosh_down', .4]]);
shot(W2('Himmel', 2), 'C', null, L => { use('G'); DR.userData.fall(V(-2, 0, 0), L.T, { R: 6, Hh: 22, speed: 2.8, size: 1, count: 260, onGround: 90 }); put(ex[4], -1, 0, -5, .4); applyPose(ex[4], { aRx: 2.5, aRe: 2.1, aLx: 2.5, aLe: 2.1, crouch: .3, lean: .3 }); face(ex[4], { eyes: 'squint', mouth: 'shout', brows: -.6 }, L.T); helmetOn(ex[4], 2);
  cm([3, .8, 5, -1, 2.6, -4, 54], [2.6, .9, 4.4, -1, 2.8, -4, 52], L.k); sh(V(-1, 0, -3), 14); }, [[0, 'glass_rattle', .7], [.3, 'pling', .5], [.6, 'metal_hit', .5], [1.0, 'pling', .4]]);
// 4 tödliche Kugeln: el cartel se agujerea y un vecino se agacha
shot(W2('sind', 2), 'S', null, L => { use('G'); DR.userData.fall(V(10, 0, -20), L.T, { R: 8, Hh: 30, speed: 2.6, size: .9, count: 300, onGround: 60 }); T0.holes.forEach((h, k) => h.visible = L.lt > .15 + k * .2);
  put(ex[2], 13.4, 0, -16, -1.9); applyPose(ex[2], { crouch: .9, lLx: 1.3, lLk: 1.9, lRx: 1.3, lRk: 1.9, aRx: 2.6, aRe: 2.2, aLx: 2.6, aLe: 2.2, lean: .5 }); face(ex[2], { eyes: 'wide', mouth: 'shout', sweat: 1 }, L.T); helmetOn(ex[2], 1);
  cm([2, 6, -14, 11, 5, -19, 50], [2.6, 6, -13.4, 11, 5, -19, 48], L.k); badge('red', 'TÖDLICH', W / 2, H * .16, L.lt - .2); sh(V(11, 0, -18), 16); }, [[.15, 'metal_hit', .7], [.35, 'metal_hit', .6], [.55, 'metal_hit', .6], [.75, 'metal_hit', .5], [.9, 'shout_m', .5], [1.5, 'glass_crack', .4]]);
// 5 Sobald die Wolken grau werden
shot(st(3), 'R', null, L => { use('G'); const k = easeInOut(L.k); day(1 - .45 * k); grade.uniforms.sat.value = 1.48 - .3 * k; for (let i = 0; i < 4; i++) { put(ex[i + 3], -3 + i * 2.6, 0, -50 - (i % 2) * 2, Math.PI + (i - 1.5) * .3); applyPose(ex[i + 3], { headX: -.7, aRx: i % 2 ? 1.6 : 0 }); face(ex[i + 3], { eyes: 'wide', mouth: 'o', look: [0, -1] }, L.T + i); }
  cm([1, 3, -66, 1, 7, -44, 58], [1, 3.2, -65, 1, 8, -44, 56], L.k); sh(V(0, 0, -52), 20); }, [[0, 'rumble', .7], [.5, 'wind', .6], [1.0, 'gasp', .4]]);
// 6 heulen die Sirenen
shot(W2('heulen', 3), 'C', null, L => { use('G'); day(.55); grade.uniforms.sat.value = 1.2; T0.horn.rotation.y = L.T * 8; T0.sirL.visible = Math.sin(L.T * 20) > 0; put(ex[7], 9, 0, -58, -2); applyPose(ex[7], { aRx: 2.6, aRe: 2.3, aLx: 2.6, aLe: 2.3, headZ: .1 }); face(ex[7], { eyes: 'squint', mouth: 'shout' }, L.T);
  cm([0, 4, -44, 10, 9, -59, 54], [.6, 4.2, -45, 10, 9.6, -59, 52], L.k); sh(V(10, 0, -58), 16); }, [[0, 'siren', .9], [.6, 'alarm', .5]]);
// 7 ...und alle rennen in die Bunker
shot(W2('alle', 3), 'Z', null, L => { use('G'); day(.55); grade.uniforms.sat.value = 1.2; T0.hatch.rotation.x = -1.4; for (let i = 0; i < 5; i++) { const e = ex[i]; const d = clamp(L.lt * 1.4 - i * .25); put(e, lerp(-2 + i * 2, -12.6, d), d > .9 ? -3 * (d - .9) * 10 : 0, lerp(-28 - i * 3, -40, d), Math.atan2(-12.6 - (-2 + i * 2), -40 - (-28 - i * 3))); applyPose(e, runPose(L.T + i, 1)); face(e, { eyes: 'wide', mouth: 'shout' }, L.T + i); }
  cm([2, 7, -30, -11, 2, -40, 54], [1.4, 7, -31, -11, 2, -40, 52], L.k); sh(V(-8, 0, -36), 20); }, [[0, 'siren', .5], [.2, 'crowd_run', .7], [.8, 'shout_crowd', .4], [1.2, 'door_slam', .6]]);
// 8 Deshalb ist hier alles verkehrt: tablón de precios de la Börse
shot(st(4), 'W', null, L => { use('G'); put(ex[8], 18.4, 0, 46, -Math.PI / 2 + .3); applyPose(ex[8], { aLx: 1.6, aLe: .1, aLz: .2 }); face(ex[8], { eyes: 'happy', mouth: 'grin' }, L.T); put(ex[9], 11.6, 0, 43, Math.PI / 2 - .4); applyPose(ex[9], { aRx: 1.2, aRe: .6 }); face(ex[9], { eyes: 'wide', mouth: 'o' }, L.T); drizzle(V(12, 0, 44), L.T, { count: 200, onGround: 120, R: 8 });
  cm([6, 6.4, 54, 15.6, 6, 42, 50], [6.6, 6.4, 53, 15.6, 6, 42, 46], L.k); badge('tag', 'ALLES VERKEHRT', W / 2, H * .14, L.lt - .2); sh(V(15, 0, 44), 16); }, [[0, 'door_bell', .5], [.4, 'cash', .5], [1.0, 'paper', .4]]);
// 9 Reiche geben mit Holzknöpfen an
shot(st(5), 'Z', null, L => { use('G'); put(noble, 15.4, 0, 10, -Math.PI / 2 + .6); applyPose(noble, { aRx: .9, aRe: 1.6, aRz: -.4, lean: -.12, headX: -.15 }); face(noble, { eyes: 'half', mouth: 'smirk', brows: .2 }, L.T);
  walkTo(ex[10], 12, 2, 0, L.T, L.lt, 1, false, .4); face(ex[10], { eyes: 'wide', mouth: 'o', look: [.6, 0] }, L.T); const s = noble.spine.getWorldPosition(V(0, 0, 0)).add(V(0, 1, 0)); cm([s.x - 7, s.y + 1.4, s.z + 4, s.x, s.y + .6, s.z, 46], [s.x - 4.4, s.y + .8, s.z + 2.6, s.x, s.y + .4, s.z, 42], L.k, easeIn);
  badge('tag', 'HOLZKNÖPFE', W / 2, H * .14, L.lt - .3); sh(V(15, 0, 10), 14); }, [[0, 'cloth', .5], [.4, 'sparkle', .6], [1.0, 'hmm', .4]]);
// 10 ...und einer Scheibe Brot
shot(W2('einer', 5) - .1, 'S', null, L => { use('G'); put(lady, 16, 0, -4, -Math.PI / 2 + .5); applyPose(lady, { aRx: 1.7, aRe: .7, headX: -.1 }); face(lady, { eyes: 'happy', mouth: 'smile', blush: 1 }, L.T); bread.visible = true; bread.position.copy(handP(lady)).add(V(0, .9, 0)); bread.rotation.y = -Math.PI / 2 + .5; bread.scale.setScalar(1 + .06 * Math.sin(L.T * 6));
  for (let i = 0; i < 2; i++) { put(ex[i + 3], 12.6 - i * 1.4, 0, -8 + i * 2, .9 + i * .3); applyPose(ex[i + 3], { aLx: .3, lean: .1 }); face(ex[i + 3], { eyes: 'wide', mouth: 'o', look: [.5, 0] }, L.T); }
  onFace(lady, 10, .6, 3, 46, L.k, 8.4); sparksAt(bread.position.clone(), L.T * .5); sh(V(15, 0, -4), 14); }, [[0, 'ding_soft', .6], [.3, 'sparkle', .5], [.9, 'gasp_f', .4]]);
// 11 während Bettler… (mendigo en el porche, rodeado de diamantes)
shot(W2('während', 5), 'C', null, L => { use('G'); sit(beggar, -17, 1.2, -90, Math.PI / 2, { aRx: .8, aRe: .6 }); face(beggar, { eyes: 'half', mouth: 'flat', brows: -.3 }, L.T); pileAt(V(-15.5, 0, -90), 2.4, 1.6, 120);
  CAT.visible = true; CAT.position.set(-15, 0, -84.5); CAT.rotation.y = Math.PI + .6; CAT.userData.tail.rotation.x = -.8 + Math.sin(L.T * 4) * .2; cm([-4, 4.4, -80, -15.6, 2.8, -88, 50], [-4.6, 4.4, -80.6, -15.6, 2.8, -88, 48], L.k); sh(V(-16, 0, -80), 14); }, [[0, 'meow', .6], [.6, 'pling', .3], [1.0, 'cough', .3]]);
// 12 ...Katzen mit faustgroßen Diamanten verscheuchen
shot(W2('Katzen', 5), 'W', null, L => { use('G'); sit(beggar, -17, 1.2, -90, Math.PI / 2, { aRx: lerp(2.6, 1, clamp(L.lt * 3)), aRe: .3, lean: .2 }); face(beggar, { eyes: 'squint', mouth: 'teeth', brows: .5 }, L.T); pileAt(V(-15.5, 0, -90), 2.4, 1.6, 120);
  const t = clamp(L.lt / .6); BIG.userData.custom((i, s, d) => { if (i) return false; d.position.set(lerp(-15.8, -14.6, t), 3.4 + Math.sin(t * Math.PI) * 1.4 - t * 2.4, lerp(-90, -85, t)); d.rotation.set(L.T * 9, 0, 0); d.scale.setScalar(.8); return true; });
  CAT.visible = true; const j = clamp((L.lt - .55) / .7); CAT.position.set(-15 + j * 10, Math.sin(j * Math.PI) * 4, -84.5 + j * 4); CAT.rotation.set(-.3 * Math.sin(j * Math.PI), Math.PI / 2 - .3, 0); CAT.userData.tail.rotation.x = .6;
  cm([-5, 4, -78, -13, 2.8, -87, 50], [-5.6, 4, -78.6, -13, 2.8, -87, 48], L.k); badge('tag', 'FAUSTGROSS', W / 2, H * .14, L.lt - .3); sh(V(-14, 0, -79), 16); }, [[0, 'throw', .7], [.55, 'thud', .6], [.6, 'meow', .9], [.9, 'jump_small', .5], [1.4, 'laugh_old', .4]]);
// 13 Ein Junge aus meiner Klasse: se arrodilla en el aula
shot(st(6), 'S', null, L => { use('CLS'); put(girl, CX + 1, 0, -6, .2); applyPose(girl, { aLx: .4, aRx: .4, aLe: .8, aRe: .8 }); face(girl, { eyes: 'wide', mouth: 'o', blush: 1 }, L.T); put(suitor, CX + 1.6, 0, -1.4, Math.PI + .1); applyPose(suitor, { crouch: 1, lLx: 1.6, lLk: 1.6, lRx: .2, lRk: 2.4, aRx: 1.6, aRe: .2, headX: -.3 }); face(suitor, { eyes: 'open', mouth: 'smile', blush: 1 }, L.T);
  for (let i = 0; i < 3; i++) { sit(ex[i + 6], CX - 11 + i * 11, 2.3, 1.2, (i - 1) * .3, { aLx: 1.6, aLe: 2.0 }); face(ex[i + 6], { eyes: 'wide', mouth: 'o' }, L.T + i); }
  cm([CX + 6, 6, 8, CX + 1.3, 3.6, -3.8, 50], [CX + 5.4, 6, 7.2, CX + 1.3, 3.6, -3.8, 48], L.k); sh(V(CX, 0, -4), 14); }, [[0, 'classroom', .5], [.4, 'gasp_f', .5], [1.0, 'cloth', .4]]);
// 14 ...mit einem Bleistift einen Antrag: el lápiz en su estuche rojo
shot(W2('Bleistift', 6) - .1, 'Z', null, L => { use('CLS'); put(suitor, CX + 1.6, 0, -1.4, Math.PI + .1); applyPose(suitor, { crouch: 1, lLx: 1.6, lLk: 1.6, lRx: .2, lRk: 2.4, aRx: 1.6, aRe: .2, headX: -.3 }); face(suitor, { eyes: 'happy', mouth: 'grin' }, L.T); PEN.visible = true; const p = handP(suitor).add(V(0, .7, -.4)); PEN.position.copy(p); PEN.rotation.y = Math.PI / 2;
  cam([p.x + 2.4, p.y + 1.6, p.z - 2.8 + L.k * .6], [p.x, p.y, p.z], 42); badge('tag', 'BLEISTIFT', W / 2, H * .14, L.lt - .2); sparksAt(p, L.T * .4); }, [[0, 'ding_reveal', .7], [.4, 'sparkle', .6], [.9, 'choir', .3]]);
// 15 ...und sie hat geweint
shot(W2('sie', 6), 'C', null, L => { use('CLS'); put(girl, CX + 1.2, 0, -3.4, Math.PI * .1); applyPose(girl, { aLx: 1.8, aRx: 1.8, aLz: -.5, aRz: -.5, aLe: .4, aRe: .4 }); face(girl, { eyes: 'happy', mouth: 'grin', tears: 1, blush: 1 }, L.T); put(suitor, CX + 4, 0, -2.6, -1.6); applyPose(suitor, { aLx: 1.4, aRx: 1.4, aLz: -.4, aRz: -.4 }); face(suitor, { eyes: 'happy', mouth: 'smile', blush: 1 }, L.T);
  PEN.visible = true; PEN.userData.box.visible = false; PEN.position.copy(handP(girl, 0)).add(V(0, .6, 0)); onFace(girl, 9, .4, -3.4, 46, L.k, 7.6); }, [[0, 'cry_girl', .6], [.5, 'kids_laugh', .4], [1.2, 'hug', .5]]);
// 16 weil echtes Holz mehr wert ist als eine Villa
shot(W2('weil', 6), 'R', null, L => { use('G'); put(girl, -14.4, 0, -54, Math.PI / 2 - .5); applyPose(girl, { aRx: 2.6, aRe: .2, aLz: .3 }); face(girl, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T); PEN.visible = true; PEN.userData.box.visible = false; PEN.position.copy(handP(girl)).add(V(0, .9, 0)); PEN.rotation.z = Math.PI / 2;
  put(ex[11], -17.4, 0, -58, Math.PI / 2); applyPose(ex[11], { ...SHRUG }); face(ex[11], { eyes: 'half', mouth: 'frown' }, L.T); cm([-1, 4, -44, -18, 7, -58, 54], [-1.6, 4, -45, -18, 7.4, -58, 52], L.k); badge('green', 'HOLZ > VILLA', W / 2, H * .16, L.lt - .3); sh(V(-15, 0, -56), 18); }, [[0, 'whoosh_soft', .5], [.4, 'cash_reg', .6], [1.2, 'laugh_m', .4]]);
// 17 Ich bin Mats, 16, Diamantenkehrer
shot(st(7), 'W', null, L => { use('G'); drizzle(V(-8, 0, 12), L.T, { count: 160, onGround: 160 }); put(mats, -8, 0, 12, .5); applyPose(mats, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 12) * .25, aRe: .4, aLx: .5 }); talkFace(mats, L.T, L.t0, L.t1, { eyes: 'happy', mouth: 'grin' }); SHV.visible = true; SHV.position.copy(handP(mats, 0)).add(V(0, -2, 0)); SHV.rotation.z = .2;
  onFace(mats, 10, .4, 2, 46, L.k, 8.6); badge('tag', 'MATS, 16', W / 2, H * .14, L.lt - .2); if (L.lt > W2('Diamantenkehrer', 7) - L.t0) badge('big', 'DIAMANTENKEHRER', W / 2, H * .2, L.lt - (W2('Diamantenkehrer', 7) - L.t0)); sh(V(-8, 0, 12), 16); }, [[0, 'pop', .5], [.4, 'steps', .4], [1.4, 'ding_soft', .5], [2.0, 'glass_rattle', .4]]);
// 18 Jeden Morgen schiebe ich Millionen Diamanten in den Gully
shot(st(8), 'S', null, L => { use('G'); const gz = 10; DR.userData.custom((i, [a, b, e, f], d) => { if (i > 400) return false; const x = -9.6 + (a - .2) * 8 + L.lt * 1.2, inG = x < -8.6; d.position.set(Math.max(-9.6, x - (inG ? 0 : 0)), inG ? -.5 : .25, gz + (b - .5) * 2.4); d.rotation.set(a * 6, b * 6, 0); d.scale.setScalar(.5 + f * .5); return true; });
  put(mats, -4.6 + L.lt * 1.2, 0, gz, -Math.PI / 2); applyPose(mats, { lean: .5, aRx: 1.2, aLx: 1.0, aRe: .3, aLe: .5, lLx: Math.sin(L.T * 6) * .3, lRx: -Math.sin(L.T * 6) * .3 }); face(mats, { eyes: 'open', mouth: 'smile' }, L.T); SHV.visible = true; SHV.position.copy(handP(mats)).add(V(-1.4, -1.6, 0)); SHV.rotation.set(0, -Math.PI / 2, .9);
  cm([-2, 4.6, gz + 9, -7, 2.4, gz, 50], [-1.6, 4.6, gz + 8.4, -6.6, 2.4, gz, 48], L.k); badge('tag', 'MILLIONEN', W / 2, H * .14, L.lt - .3); sh(V(-7, 0, gz), 14); }, [[0, 'shovel', .7], [.5, 'glass_rattle', .6], [1.0, 'shovel', .6], [1.5, 'drip', .5], [2.0, 'glass_rattle', .5]]);
// 19 damit die Kutschen nicht platzen
shot(W2('damit', 8), 'Z', null, L => { use('G'); CAR.visible = true; CAR.position.set(-3, 0, 30 - L.lt * 9); CAR.rotation.y = Math.PI; CAR.userData.wheels.forEach(w => w.rotation.z = L.T * 5); CAR.userData.legs.forEach((l, k) => l.rotation.x = Math.sin(L.T * 9 + k * 1.6) * .5); put(ex[5], -3, 6.6, CAR.position.z + 1, Math.PI); applyPose(ex[5], { ...SIT, aRx: 2.4, aRz: .3 }); face(ex[5], { eyes: 'happy', mouth: 'grin' }, L.T);
  put(mats, -9, 0, 12, .6); applyPose(mats, { aRx: 2.6, aRe: .4, aRz: .3 }); face(mats, { eyes: 'happy', mouth: 'smile' }, L.T); cm([-14, 5, 2, -4, 4, 16, 52], [-13.4, 5, 2.6, -4, 4, 14, 50], L.k); sh(V(-5, 0, 16), 22); }, [[0, 'hooves', .7], [.3, 'wheels', .5], [.9, 'whinny', .4], [1.2, 'hooves', .5]]);
// 20 Meine Schaufel ist aus Gummi: un diamante rebota en la pala
shot(st(9), 'C', null, L => { use('G'); put(mats, -8, 0, 12, .3); applyPose(mats, { aRx: 1.3, aRe: .9, aLx: 1.2, aLe: .8 }); face(mats, { eyes: 'open', mouth: 'smile', look: [0, -.5] }, L.T); SHV.visible = true; const p = handP(mats).add(V(0, .2, 1.2)); SHV.position.copy(p); SHV.rotation.set(-1.3, 0, 0);
  const t = L.lt % .8 / .8; BIG.userData.custom((i, s, d) => { if (i) return false; d.position.set(p.x, p.y + 1 + 5 * Math.abs(Math.sin(t * Math.PI)) , p.z + 1.6); d.rotation.set(L.T * 7, 0, 0); d.scale.setScalar(.5); return true; });
  cm([p.x + 3.4, p.y + 2.4, p.z + 4.6, p.x, p.y + 1.8, p.z, 46], [p.x + 3, p.y + 2.2, p.z + 4, p.x, p.y + 1.8, p.z, 44], L.k); badge('tag', 'GUMMI', W / 2, H * .14, L.lt - .2); }, [[0, 'spring', .7], [.8, 'spring', .6], [1.4, 'boing_metal', .3]]);
// 21 denn Metall zerspringt
shot(W2('denn', 9), 'W', null, L => { use('G'); put(sw2, 6, 0, -8, -.4); const k = clamp((L.lt - .5) / .2); applyPose(sw2, k < 1 ? { aRx: 1.3, aRe: .8, aLx: 1.2, aLe: .8 } : { aLz: 1.3, aRz: 1.3, aLe: 1.6, aRe: 1.6, lean: -.2 }); face(sw2, k < 1 ? { eyes: 'open', mouth: 'flat' } : { eyes: 'wide', mouth: 'shout', brows: -.6 }, L.T);
  const p = handP(sw2).add(V(-.5, .2, 1.2)); SHM.visible = L.lt < .5; SHM.position.copy(p); SHM.rotation.set(-1.3, -.4, 0); if (L.lt >= .5) shardsAt(p, L.lt - .5); BIG.userData.custom((i, s, d) => { if (i || L.lt > .52) return false; d.position.set(p.x, p.y + 8 * (1 - L.lt / .5) + 1, p.z + 1.4); d.scale.setScalar(.6); d.rotation.set(L.T * 9, 0, 0); return true; });
  onFace(sw2, 11, .6, -3, 48, L.k, 9); if (L.lt > .5) badge('red', 'METALL: KAPUTT', W / 2, H * .16, L.lt - .5); sh(V(6, 0, -8), 14); }, [[0, 'whoosh_down', .5], [.5, 'glass_break', .9], [.52, 'metal_hit', .7], [.8, 'shout_m', .5]]);
// 22 Bis gestern Baron Grimm in unser Tal kam (zoom lento + riser → golpe)
shot(st(10), 'R', 'slow', L => { use('G'); TANK.visible = true; TANK.position.set(0, 0, 160 - L.lt * 10); TANK.rotation.y = Math.PI; TANK.position.y = Math.sin(L.T * 18) * .05; smokeAt(TANK.position.x, 2, TANK.position.z + 8, .6, 0xc8b89a, .8); put(grimm, 0, 7.6, TANK.position.z + 1, Math.PI); applyPose(grimm, { aLz: .2, aRz: .2, crouch: 0 }); face(grimm, { eyes: 'squint', mouth: 'smirk', brows: .7 }, L.T);
  cm([12, 20, 40, 0, 6, 150 - L.lt * 10, 54], [6, 10, 110, 0, 7, 140 - L.lt * 10, 46], L.k); sh(TANK.position, 30); }, [[0, 'rumble', .7], [.4, 'machine_hum', .6], [1.2, 'metal_creak', .4]]);
// 23 Er stammt aus der Wüste, wo es nie regnet
shot(st(11), 'W', null, L => { use('DES'); sky.sky.material.uniforms.hor.value.setRGB(1, .86, .6); sun.color.setRGB(1, .85, .6); put(grimm, DX - 4, 0, -14, .3); applyPose(grimm, { aRx: 2.3, aRe: 2.1, aRz: -.4, headX: -.2 }); face(grimm, { eyes: 'half', mouth: 'frown', sweat: 1 }, L.T); grade.uniforms.sat.value = 1.6;
  cm([DX + 6, 5, -2, DX - 4, 5, -16, 50], [DX + 5.4, 5, -3, DX - 4, 5, -16, 48], L.k); badge('tag', 'WÜSTE', W / 2, H * .14, L.lt - .3); sh(V(DX - 4, 0, -14), 18); }, [[0, 'wind', .6], [.6, 'sigh', .5], [1.2, 'crickets', .3]]);
// 24 deshalb hielt er uns für das reichste Königreich der Welt (catalejo)
shot(W2('deshalb', 11), 'Z', null, L => { use('DES'); sky.sky.material.uniforms.hor.value.setRGB(1, .86, .6); put(grimm, DX - 4, 2, -14, Math.PI * .9); applyPose(grimm, { aRx: 1.6, aRe: 1.5, aRz: -.3, aLx: 1.4, aLe: 1.6 }); face(grimm, { eyes: 'squint', mouth: 'grin', brows: .4 }, L.T); tele.visible = true; tele.position.copy(hp(grimm)).add(V(.3, .7, -1.6)); tele.rotation.y = Math.PI * .9;
  onFace(grimm, 8, .2, 2.4, 44, L.k, 6.6); badge('big', 'REICHSTES KÖNIGREICH?', W / 2, H * .15, L.lt - .5); }, [[0, 'tick', .5], [.3, 'ratchet', .5], [.9, 'evil_laugh', .5], [1.6, 'sparkle', .5]]);
// 25 Im Panzer rollte er auf den Marktplatz
shot(st(12), 'S', null, L => { use('G'); TANK.visible = true; TANK.rotation.y = Math.PI; TANK.position.set(0, Math.sin(L.T * 18) * .05, -60 - L.lt * 6); put(grimm, 0, 7.6, TANK.position.z + 1, Math.PI); applyPose(grimm, { aRx: 2.6, aRe: .3 }); face(grimm, { eyes: 'squint', mouth: 'grin' }, L.T);
  for (let i = 0; i < 4; i++) { walkTo(ex[i], -6 + i * 4, -80, i % 2 ? .6 : -.6, L.T + i, L.lt, 6, true); face(ex[i], { eyes: 'wide', mouth: 'shout' }, L.T); } cm([10, 3, -100, 0, 7, -64, 56], [9, 3, -98, 0, 7, -66, 54], L.k); sh(V(0, 0, -72), 26); }, [[0, 'rumble', .7], [.3, 'metal_creak', .5], [.8, 'shout_crowd', .5], [1.4, 'crowd_run', .5]]);
// 26 50 Tonnen Diamanten bis Mittag!
shot(st(13), 'C', null, L => { use('G'); TANK.visible = true; TANK.rotation.y = Math.PI; TANK.position.set(0, 0, -72); put(grimm, 0, 7.6, -73, Math.PI - .2); applyPose(grimm, { aRx: 1.8, aRe: 1.5, aRz: -.4, aLx: .9, lean: .1 }); talkFace(grimm, L.T, L.t0, L.t1, { eyes: 'squint', mouth: 'shout', brows: .9, veins: 1 }); mega.visible = true; mega.position.copy(hp(grimm)).add(V(.2, .5, -1.2)); mega.rotation.y = Math.PI;
  onFace(grimm, 9, -.4, -2, 48, L.k, 7.6); badge('big', '50 TONNEN', W / 2, H * .15, L.lt - .2); if (L.lt > W2('Mittag', 13) - L.t0) badge('tag', 'BIS MITTAG', W / 2, H * .24, L.lt - (W2('Mittag', 13) - L.t0)); sh(V(0, 0, -72), 20); }, [[0, 'shout_m', .6], [.5, 'hum', .4], [1.2, 'clock_tick', .5]]);
// 27 ...oder ich brenne alles nieder!
shot(W2('oder', 13), 'W', null, L => { use('G'); TANK.visible = true; TANK.rotation.y = Math.PI; TANK.position.set(0, 0, -72); TANK.userData.tur.rotation.y = Math.sin(L.lt * 2) * .5; put(grimm, 0, 7.6, -73, Math.PI); applyPose(grimm, { aRx: 2.8, aRe: .1 }); face(grimm, { eyes: 'squint', mouth: 'teeth', brows: 1 }, L.T); torch.visible = true; torch.position.copy(handP(grimm)).add(V(0, .8, 0));
  fireAt(V(0, 7, -86), 6, .5 + .3 * Math.sin(L.T * 10), L.T); cm([-10, 3, -94, 0, 7, -74, 54], [-9.4, 3, -93, 0, 7, -74, 52], L.k); sh(V(0, 0, -76), 22); }, [[0, 'ignite', .7], [.3, 'fire_roar', .6], [.8, 'evil_laugh', .5]]);
// 28 Der Bürgermeister zeigte nur auf die Müllkippe
shot(st(14), 'S', null, L => { use('G'); put(mayor, -8, 0, -66, -.6); applyPose(mayor, { aLx: 1.5, aLz: .4, aLe: .05, aRz: .2, headY: -.5 }); face(mayor, { eyes: 'half', mouth: 'flat', brows: -.1 }, L.T); TANK.visible = true; TANK.rotation.y = Math.PI; TANK.position.set(0, 0, -76);
  onFace(mayor, 11, .6, 3, 48, L.k, 9.4); badge('tag', 'MÜLLKIPPE →', W / 2, H * .14, L.lt - .4); sh(V(-8, 0, -66), 16); }, [[0, 'hmm', .5], [.5, 'yawn_old', .5], [1.3, 'cloth', .3]]);
// 29 „Nimm, so viel du willst!“ — la montaña de diamantes en el vertedero
shot(st(15), 'Z', null, L => { use('G'); pileAt(DUMPC, 12, 9, 760); flies.forEach((f, k) => { f.visible = true; f.position.set(DUMPC.x + Math.sin(L.T * 5 + k) * 4, DUMPC.y + 8 + Math.cos(L.T * 4 + k * 2) * 2, DUMPC.z + Math.cos(L.T * 6 + k) * 4); }); put(mayor, -60, 0, -104, -.785); applyPose(mayor, { aLx: 1.6, aLe: .1, aLz: .3 }); face(mayor, { eyes: 'happy', mouth: 'grin' }, L.T); bubble(mayor, 'NIMM ALLES!', L.lt - .1, 2.4);
  cm([-74, 9, -90, -50, 4.6, -116, 54], [-73, 9, -91, -50, 4.6, -116, 52], L.k); sh(DUMPC, 30); }, [[0, 'glass_rattle', .6], [.3, 'drone', .3], [.6, 'laugh_old', .4]]);
// 30 Als Grimm die Diamanten auf dem Müll liegen sah
shot(st(16), 'R', null, L => { use('G'); pileAt(DUMPC, 12, 9, 760); put(grimm, -58, 0, -104, 2.5); applyPose(grimm, { aLz: 1.1, aRz: 1.1, aLe: 1.5, aRe: 1.5, lean: -.1 }); face(grimm, { eyes: 'wide', mouth: 'o', brows: -.4 }, L.T);
  cm([-49, 8, -113, -58, 4.6, -104, 52], [-49.6, 8, -112.4, -58, 4.6, -104, 50], L.k); sh(DUMPC, 30); }, [[0, 'gasp', .6], [.5, 'glass_rattle', .4], [1.3, 'drone', .3]]);
// 31 fühlte er sich gedemütigt
shot(W2('fühlte', 16), 'C', null, L => { use('G'); put(grimm, -58, 0, -104, -.6); applyPose(grimm, { aLz: .3, aRz: .3, aLe: 1.6, aRe: 1.6, headX: .2 }); face(grimm, { eyes: 'squint', mouth: 'frown', brows: -.6, blush: 1, tears: 1 }, L.T); onFace(grimm, 6, .2, 0, 42 * punch(L.lt, .02, .22), L.k, 5); badge('red', 'GEDEMÜTIGT', W / 2, H * .16, L.lt - .1); }, [[0, 'impact', .7], [.1, 'sad_tone', .7], [.6, 'sniff', .4]]);
// 32 Also sperrte er … aus: cierra la verja de la plaza
shot(st(17), 'S', null, L => { use('G'); const k = easeOut(clamp(L.lt / .6)); T0.gates.forEach((g, i) => g.rotation.y = (i ? -1 : 1) * (1 - k) * 1.4); put(grimm, 0, 0, -159, 0); applyPose(grimm, { aLx: 1.2, aRx: 1.2, aLz: -.3, aRz: -.3, lean: .2 }); face(grimm, { eyes: 'squint', mouth: 'smirk', brows: .9 }, L.T);
  CR.at(0, -138, 22, 20, L.T, { face: Math.PI, count: 200 }); cm([6, 4, -170, 0, 4, -150, 54], [5.4, 4, -169, 0, 4, -150, 52], L.k); sh(V(0, 0, -156), 24); }, [[0, 'metal_creak', .7], [.55, 'door_slam', .9], [.7, 'chain_rattle', .7], [1.2, 'click_metal', .6]]);
// 33 500 Menschen
shot(W2('500', 17), 'W', null, L => { use('G'); day(.8); CR.at(0, -140, 22, 22, L.T, { face: 0, count: 420 }); for (let i = 0; i < 3; i++) { put(ex[i], -4 + i * 4, 0, -128, Math.PI); applyPose(ex[i], { aRx: 2.4, aRe: .3, headX: -.3 }); face(ex[i], { eyes: 'wide', mouth: 'shout' }, L.T + i); }
  cm([0, 26, -112, 0, 0, -146, 56], [0, 28, -110, 0, 0, -146, 54], L.k); badge('big', '500', W / 2, H * .15, L.lt - .2); sh(V(0, 0, -140), 30); }, [[0, 'murmur', .7], [.5, 'shout_crowd', .5], [1.0, 'crowd_run', .3]]);
// 34 genau als der Himmel schwarz wurde
shot(W2('genau', 17), 'Z', null, L => { use('G'); night(easeInOut(L.k)); CR.at(0, -140, 22, 22, L.T, { face: 0, count: 300 }); put(mats, 4, 0, -128, Math.PI + .3); applyPose(mats, { headX: -.6 }); face(mats, { eyes: 'wide', mouth: 'o', look: [0, -1] }, L.T);
  cm([4, 4, -116, 2, 7, -140, 56], [4, 4.2, -117, 2, 8, -140, 54], L.k); sh(V(0, 0, -140), 30); }, [[0, 'rumble', .7], [.5, 'wind', .6], [1.2, 'gasp', .5]]);
// 35 Der Diamanten-Taifun kam (zoom lento + riser → golpe)
shot(st(18), 'R', 'slow', L => { use('G'); night(1); BIG.userData.fall(V(0, 0, -150), L.T, { R: 30, Hh: 60, speed: 1.6, size: 3.2, count: 160 }); CR.at(0, -140, 22, 22, L.T, { face: 0, cower: .6, count: 420 }); const fl = Math.sin(L.T * 7) > .93; if (fl) grade.uniforms.flash.value = .25;
  cm([0, 30, -96, 0, 30, -180, 58], [0, 22, -110, 0, 20, -180, 52], L.k); sh(V(0, 0, -140), 40); }, [[0, 'wind', .8], [.4, 'rumble', .7], [1.2, 'siren', .4]]);
// 36 Steine so groß wie Bowlingkugeln
shot(W2('Steinen', 18), 'C', null, L => { use('G'); night(1); const t = clamp(L.lt / .5); BIG.userData.custom((i, s, d) => { if (i > 0) return false; d.position.set(2, Math.max(1.2, 30 * (1 - t)), -120); d.rotation.set(L.T * 5, 0, 0); d.scale.setScalar(2.6); return true; }); smokeAt(2, 0, -120, t >= 1 ? clamp((L.lt - .5) * 1.2) : 0, 0x8a8a8a, .6);
  put(ex[3], 6, 0, -116, -1.2); applyPose(ex[3], { aLz: 1.6, aRz: 1.6, lean: -.3, aLe: 1.8, aRe: 1.8 }); face(ex[3], { eyes: 'wide', mouth: 'shout', sweat: 1 }, L.T); cm([10, 3, -108, 3, 2.6, -120, 50], [9.4, 3, -109, 3, 2.6, -120, 48], L.k); badge('tag', 'BOWLINGKUGEL', W / 2, H * .14, L.lt - .5); sh(V(4, 0, -118), 16); }, [[0, 'whoosh_down', .6], [.5, 'boom', .9], [.55, 'rubble', .6], [.9, 'scream_girl', .5]]);
// 37 Grimm lachte in seinem Panzer (interior rojo)
shot(st(19), 'S', null, L => { use('TIN'); sit(grimm, TX, 3.4, 1.5, Math.PI, { aLz: .8, aRz: .8, aLe: 1.8, aRe: 1.8, lean: -.2 + Math.sin(L.T * 20) * .06 }); face(grimm, { eyes: 'happy', mouth: 'grin', brows: .7 }, L.T); TIN.redL.intensity = 120 + 80 * Math.sin(L.T * 6);
  onFace(grimm, 6.4, .3, -2.4, 52, L.k, 5.6); sh(V(TX, 0, 1), 12); }, [[0, 'evil_laugh', .8], [.6, 'machine_hum', .4], [1.0, 'laugh_deep', .5]]);
// 38 „Mal sehen, wie euch eure wertlosen Steine zerquetschen!“
shot(st(20), 'W', null, L => { use('G'); night(1); TANK.visible = true; TANK.rotation.y = 0; TANK.position.copy(TK); TANK.userData.tur.rotation.y = Math.sin(L.T) * .2; BIG.userData.fall(V(0, 0, -150), L.T, { R: 30, Hh: 50, speed: 1.6, size: 1.6, count: 120 }); CR.at(0, -140, 22, 20, L.T, { face: Math.PI, cower: .4, count: 420 });
  cm([16, 8, -128, 0, 6, -170, 54], [15, 8, -129, 0, 6, -170, 52], L.k); BAD.push({ kind: 'bubble', text: 'HAHAHA!', w3: V(0, 13, TK.z), s: spring((L.lt - .2) * 1.6), a: 1 }); sh(V(0, 0, -160), 34); }, [[0, 'evil_laugh', .6], [.6, 'whoosh_down', .5], [1.2, 'boom', .5], [2.0, 'whoosh_down', .4]]);
// 39 …zerquetschen! — caras de pánico
shot(W2('zerquetschen', 20), 'Z', null, L => { use('G'); night(1); put(ex[9], 0, 0, -132, Math.PI - .2); applyPose(ex[9], { aLx: 2.6, aRx: 2.6, aLe: 2.1, aRe: 2.1 }); face(ex[9], { eyes: 'wide', mouth: 'shout', brows: -.7, tears: 1 }, L.T); BIG.userData.fall(V(0, 0, -132), L.T, { R: 12, Hh: 30, speed: 1.8, size: 1.2, count: 80 }); onFace(ex[9], 7, .4, 1, 46, L.k, 6); }, [[0, 'scream_girl', .7], [.4, 'whoosh_down', .4]]);
// 40 Aber ich geriet nicht in Panik
shot(st(21), 'C', null, L => { use('G'); night(1); put(mats, 4, 0, -128, Math.PI); applyPose(mats, { aLz: .2, aRz: .2 }); face(mats, { eyes: 'squint', mouth: 'flat', brows: .6 }, L.T); CR.at(0, -146, 22, 12, L.T, { face: Math.PI, cower: .5, count: 200 }); onFace(mats, 8, .4, -1.6, 44, L.k, 6.6); badge('tag', 'KEINE PANIK', W / 2, H * .14, L.lt - .3); }, [[0, 'heartbeat', .6], [.6, 'breath', .5]]);
// 41 denn ich weiß, wie Kristalle abprallen (demostración: rebotan en el tejado de goma)
shot(W2('denn', 21), 'S', null, L => { use('G'); night(.6); put(mats, -9, 0, -40, .4); applyPose(mats, { aRx: 1.3, aRe: .8, aLx: 1.2, aLe: .8 }); face(mats, { eyes: 'squint', mouth: 'smirk' }, L.T); SHV.visible = true; const p = handP(mats).add(V(0, .2, 1.2)); SHV.position.copy(p); SHV.rotation.set(-1.3, 0, 0);
  BIG.userData.custom((i, s, d) => { if (i > 2) return false; const t = (L.lt * 1.2 + i * .33) % 1; d.position.set(p.x + (i - 1) * .6 + t * 3 * (i - 1), p.y + 1 + 6 * Math.abs(Math.sin(t * Math.PI)), p.z + 1.4); d.rotation.set(L.T * 7, i, 0); d.scale.setScalar(.45); return true; }); cm([p.x + 4, p.y + 3, p.z + 5, p.x, p.y + 2.2, p.z, 46], [p.x + 3.6, p.y + 2.8, p.z + 4.4, p.x, p.y + 2.2, p.z, 44], L.k); }, [[0, 'spring', .7], [.4, 'spring', .6], [.9, 'spring', .6], [1.4, 'boing_metal', .3]]);
// 42 Ich schnappte mir das riesige Gummiband von der Mühle
shot(st(22), 'W', null, L => { use('G'); night(1); T0.blades.rotation.z = L.T * .8; const b = V(29, 0, -158); walkTo(mats, 18, -150, -2.2, L.T, Math.min(L.lt, .9), 9, true); if (L.lt > .9) { put(mats, 26, 0, -156, -2.2); applyPose(mats, { lean: .5, aLx: 1.6, aRx: 1.6, aLe: .4, aRe: .4, crouch: .3 }); } face(mats, { eyes: 'squint', mouth: 'teeth', brows: .6 }, L.T);
  cm([8, 6, -172, 26, 4, -156, 54], [8.6, 6, -171.4, 26, 4, -156, 52], L.k); badge('tag', 'GUMMIBAND', W / 2, H * .14, L.lt - .6); sh(V(26, 0, -155), 20); }, [[0, 'steps_run', .7], [.9, 'grab', 0], [.95, 'stretch', .7], [1.6, 'strain', .5]].filter(c => c[2] > 0));
// 43 ...und spannte es über die Menge
shot(W2('spannte', 22), 'R', null, L => { use('G'); night(1); const k = easeOut(clamp(L.lt / 1.2)); SHEET.visible = true; SHEET.position.set(0, 12, -140); SHEET.scale.set(.2 + .8 * k, 1, 1); CR.at(0, -140, 22, 20, L.T, { face: 0, cower: .3, count: 420 });
  put(mats, -11.6 + .6, 0, -126, Math.PI / 2); applyPose(mats, { aLx: 2.8, aRx: 2.8, aLe: .2, aRe: .2, lean: -.2 }); face(mats, { eyes: 'squint', mouth: 'teeth', brows: .6 }, L.T); put(ex[10], 11, 0, -126, -Math.PI / 2); applyPose(ex[10], { aLx: 2.8, aRx: 2.8 }); face(ex[10], { eyes: 'squint', mouth: 'teeth' }, L.T);
  cm([16, 6, -112, 0, 9, -140, 58], [15.4, 6, -113, 0, 9, -140, 56], L.k); sh(V(0, 0, -140), 30); }, [[0, 'stretch', .8], [.5, 'strain', .6], [1.0, 'click_metal', .6], [1.4, 'chain_rattle', .5]]);
// 44 Dann brach der Himmel auf (zoom lento + riser → golpe)
shot(st(23), 'Z', 'slow', L => { use('G'); night(1); BIG.userData.fall(V(0, 0, -140), L.T, { R: 24, Hh: 90, speed: .9, size: 2.4, count: 160 }); SHEET.visible = true; SHEET.position.set(0, 12, -140); CR.at(0, -140, 22, 20, L.T, { face: 0, cower: .6, count: 420 });
  cm([16, 4, -114, 0, 30, -160, 60], [15, 5, -115, 0, 36, -160, 54], L.k); sh(V(0, 0, -140), 30); }, [[0, 'rumble', .8], [.6, 'wind', .6]]);
// 45 Ping, ping, ping!
shot(st(24), 'C', null, L => { use('G'); night(1); SHEET.visible = true; SHEET.position.set(0, 12, -140); SHEET.userData.set(1 + Math.abs(Math.sin(L.T * 10)) * 1.2); CR.at(0, -140, 22, 20, L.T, { face: 0, cower: .7, count: 420 }); BIG.userData.fall(V(0, 12, -140), L.T, { R: 16, Hh: 20, speed: 3, size: 1.4, count: 100 }); sparksAt(V(Math.sin(L.T * 9) * 8, 12, -140 + Math.cos(L.T * 7) * 6), L.T);
  cm([16, 4, -120, 0, 11, -140, 56], [15.4, 4, -121, 0, 11, -140, 54], L.k); badge('big', 'PING!', W / 2, H * .15, (L.lt % .45) * 2); }, [[0, 'pling', .9], [.45, 'pling', .9], [.9, 'pling', .9], [.2, 'metal_hit', .4], [.7, 'metal_hit', .4]]);
// 46 Doch statt durchzuschlagen…
shot(st(25), 'S', null, L => { use('G'); night(1); SHEET.visible = true; SHEET.position.set(0, 12, -140); SHEET.userData.set(2 + 3 * easeIn(L.k)); CR.at(0, -140, 22, 20, L.T, { face: 0, cower: .8, count: 420 }); put(mats, -10.4, 0, -128, Math.PI / 2 + .3); applyPose(mats, { aRx: 2.6, aRe: .3, aLz: .4, headX: -.5 }); face(mats, { eyes: 'squint', mouth: 'teeth', brows: .5 }, L.T);
  BIG.userData.fall(V(0, 12, -140), L.T, { R: 14, Hh: 26, speed: 2.4, size: 1.6, count: 120 }); onFace(mats, 9, 2.4, -3, 50, L.k, 8); }, [[0, 'stretch_creak', .7], [.6, 'pling', .6], [1.2, 'strain', .5]]);
// 47 …dehnten die Diamanten das Gummiband wie ein Trampolin
shot(W2('dehnten', 25), 'W', null, L => { use('G'); night(1); SHEET.visible = true; SHEET.position.set(0, 12, -140); const dip = 2 + 6 * easeInOut(clamp(L.k * 1.1)); SHEET.userData.set(dip); CR.at(0, -140, 22, 20, L.T, { face: 0, cower: .9, count: 420 });
  BIG.userData.custom((i, [a, b, e, f], d) => { if (i > 120) return false; const r = Math.sqrt(a) * 10, an = b * 6.283; d.position.set(Math.cos(an) * r, 12.8 - dip * (1 - r / 14) + f * .4, -140 + Math.sin(an) * r * .7); d.rotation.set(a * 6, b * 6, 0); d.scale.setScalar(1.4 + f); return true; });
  cm([34, 16, -140, 0, 8, -140, 50], [32, 15, -140, 0, 7, -140, 48], L.k); badge('tag', 'TRAMPOLIN', W / 2, H * .14, L.lt - .3); sh(V(0, 0, -140), 30); }, [[0, 'stretch_creak', .8], [.6, 'tension_str', .6], [1.2, 'metal_creak', .5]]);
// 48 …und schossen zurück
shot(W2('schossen', 25), 'Z', null, L => { use('G'); night(1); SHEET.visible = true; SHEET.position.set(0, 12, -140); SHEET.userData.set(Math.max(-2, 8 - L.lt * 30) * Math.cos(L.lt * 20) * Math.exp(-L.lt * 3)); CR.at(0, -140, 22, 20, L.T, { face: 0, cower: .6, count: 420 });
  BIG.userData.custom((i, [a, b, e, f], d) => { if (i > 140) return false; const r = Math.sqrt(a) * 10, an = b * 6.283, t = L.lt * (1 + f); d.position.set(Math.cos(an) * r, 13 + t * 40, -140 + Math.sin(an) * r * .7 - t * 20); d.rotation.set(L.T * 9 + a, b, 0); d.scale.setScalar(1.4 + f); return true; });
  cm([16, 8, -114, 0, 22, -146, 60], [15.4, 8, -115, 0, 26, -148, 58], L.k); }, [[0, 'spring', .9], [.05, 'whoosh_up', .8], [.3, 'whoosh_up', .6]]);
// 49 Bumm!
shot(st(26), 'C', null, L => { use('G'); night(1); grade.uniforms.flash.value = clamp(.8 - L.lt * 2); SHEET.visible = true; SHEET.position.set(0, 12, -140); CR.at(0, -140, 22, 20, L.T, { face: 0, count: 420 }); BIG.userData.custom((i, [a, b, e, f], d) => { if (i > 140) return false; const an = b * 6.283, t = .5 + L.lt; d.position.set(Math.cos(an) * 10 * a, 30 + t * 30, -150 - t * 20 - e * 10); d.scale.setScalar(1.6); d.rotation.set(L.T * 9, b, 0); return true; });
  cm([16, 9, -112, 0, 26, -160, 58], [15.4, 9, -113, 0, 28, -162, 56], L.k); badge('big', 'BUMM!', W / 2, H * .15, L.lt); }, [[0, 'boom', 1], [.05, 'explosion', .5]]);
// 50 Milliarden Kugeln prallten…
shot(st(27), 'W', null, L => { use('G'); night(1); TANK.visible = true; TANK.position.copy(TK); BIG.userData.custom((i, [a, b, e, f], d) => { const t = clamp(L.lt * .9 + e * .4); d.position.set((a - .5) * 20 * (1 - t), lerp(50, 5, t) + Math.sin(t * Math.PI) * 10, lerp(-150, TK.z, t) + (b - .5) * 10); d.rotation.set(L.T * 9 + a, b, 0); d.scale.setScalar(1.3 + f); return true; });
  T0.gates.forEach(g => g.rotation.y = 0); cm([18, 10, -150, 0, 10, -170, 56], [17, 10, -151, 0, 9, -172, 54], L.k); badge('tag', 'MILLIARDEN', W / 2, H * .14, L.lt - .3); sh(V(0, 0, -170), 30); }, [[0, 'whoosh', .7], [.4, 'glass_rattle', .7], [1.0, 'whoosh', .5]]);
// 51 …direkt auf Grimms Panzer
shot(W2('Grimms', 27), 'S', null, L => { use('G'); night(1); TANK.visible = true; TANK.position.copy(TK); TANK.userData.holes.forEach((h, k) => h.visible = k < L.lt * 18); BIG.userData.fall(V(0, 0, TK.z), L.T, { R: 8, Hh: 18, speed: 3.4, size: 1, count: 100 }); sparksAt(V(TK.x + Math.sin(L.T * 13) * 3, 4, TK.z + Math.cos(L.T * 11) * 4), L.T);
  cm([12, 6, TK.z + 18, 0, 4, TK.z, 50], [11, 6, TK.z + 17, 0, 4, TK.z, 48], L.k); sh(TK, 16); }, [[0, 'metal_hit', .8], [.2, 'metal_hit', .7], [.4, 'metal_hit', .7], [.6, 'metal_hit', .6], [.8, 'metal_hit', .6], [1.0, 'metal_rip', .6]]);
// 52 Krach! — dentro del tanque, grietas de luz
shot(st(28), 'C', null, L => { use('TIN'); sit(grimm, TX, 3.4, 1.5, Math.PI, { aLz: 1.6, aRz: 1.6, aLe: 1.8, aRe: 1.8 }); face(grimm, { eyes: 'wide', mouth: 'shout', brows: -.7, sweat: 1 }, L.T); TIN.cracks.forEach((c, k) => c.visible = k < 4 + L.lt * 20); TIN.redL.intensity = 200; onFace(grimm, 6.4, .3, -2.4, 50 * punch(L.lt, .02, .3), 0); badge('red', 'KRACH!', W / 2, H * .15, L.lt); }, [[0, 'glass_crack', 1], [.05, 'impact', .8]]);
// 53 Sie zerfetzten den Stahl wie nasses Papier
shot(st(29), 'R', null, L => { use('G'); night(1); TANK.visible = true; TANK.position.copy(TK); TANK.userData.holes.forEach(h => h.visible = true); TANK.userData.tur.rotation.set(.1 * L.lt, 0, .25 * L.lt); BIG.userData.fall(V(0, 0, TK.z), L.T, { R: 8, Hh: 18, speed: 3.4, size: 1, count: 100 }); sparksAt(V(0, 5, TK.z + 3), L.T);
  cm([-14, 5, TK.z + 12, 0, 4, TK.z, 50], [-13, 5, TK.z + 11, 0, 4, TK.z, 46], L.k); badge('tag', 'WIE NASSES PAPIER', W / 2, H * .14, L.lt - .3); sh(TK, 16); }, [[0, 'metal_rip', .9], [.5, 'rip', .6], [1.2, 'metal_creak', .6], [1.8, 'metal_hit', .5]]);
// 54 Der Panzer explodierte
shot(st(30), 'F', null, L => { use('G'); night(1); TANK.visible = L.lt < .3; TANK.position.copy(TK); const k = clamp(L.lt / .6); fireAt(V(0, 2, TK.z), 16, 1.6 + k * 1.4, L.T); smokeAt(0, 4, TK.z, .3 + k, 0x3a3a3a, 2.4); grade.uniforms.flash.value = clamp(.7 - L.lt); bloom.strength = .6;
  cm([22, 10, TK.z + 30, 0, 8, TK.z, 54], [20, 10, TK.z + 28, 0, 9, TK.z, 52], L.k); badge('big', 'BOOM!', W / 2, H * .15, L.lt); sh(TK, 20); }, [[0, 'explosion', 1], [.1, 'fire_roar', .7], [.6, 'rubble', .6]]);
// 55 …und Grimm rannte schreiend davon
shot(W2('Grimm', 30), 'W', null, L => { use('G'); night(.6); walkTo(grimmT, 0, -150, 0, L.T, L.lt, 9, true); face(grimmT, { eyes: 'wide', mouth: 'shout', brows: -.8, tears: 1, soot: 1 }, L.T); const p = grimmT.root.position; DR.userData.fall(p, L.T, { R: 4, Hh: 10, speed: 3, size: .7, count: 60 }); smokeAt(0, 3, TK.z, 1.2, 0x3a3a3a, 2);
  cm([p.x + 6, 4, p.z + 14, p.x, 3.6, p.z, 52], [p.x + 5.4, 4, p.z + 13, p.x, 3.6, p.z, 50], L.k); sh(p, 20); }, [[0, 'scream_girl', .5], [.2, 'steps_run', .7], [.5, 'pling', .5], [.8, 'pling', .5], [1.1, 'shout_m', .5]]);
// 56 den Umhang in Fetzen
shot(W2('Umhang', 30), 'Z', null, L => { use('G'); night(.6); put(grimmT, 0, 0, -110, Math.PI); applyPose(grimmT, { ...runPose(L.T), lean: .4 }); face(grimmT, { eyes: 'wide', mouth: 'shout', tears: 1, soot: 1 }, L.T); const h = hp(grimmT); cam([h.x + 3, h.y + .8, h.z - 7], [h.x, h.y - .6, h.z], 48); badge('tag', 'IN FETZEN', W / 2, H * .14, L.lt - .2); }, [[0, 'rip', .7], [.4, 'cry_girl', .3]]);
// 57 Er kam nie wieder (huye por el camino del valle al amanecer)
shot(st(31), 'S', null, L => { use('G'); sunsetLike(1); walkTo(grimmT, 0, 90, 0, L.T, L.lt, 7, true); cm([0, 18, 40, 0, 2, 140, 54], [0, 18, 42, 0, 2, 150, 52], L.k); badge('tag', 'NIE WIEDER', W / 2, H * .14, L.lt - .3); sh(V(0, 0, 100), 30); }, [[0, 'steps_run', .5], [.4, 'birds', .5]]);
// 58 Der Bürgermeister rannte weinend vor Freude aus seinem Bunker
shot(st(32), 'W', null, L => { use('G'); const k = clamp(L.lt / 1); put(mayor, -12.6, lerp(-4, 0, k), -40 + k * 3, .3); applyPose(mayor, k < 1 ? { aLx: 2.6, aRx: 2.6 } : { ...CHEER }); face(mayor, { eyes: 'happy', mouth: 'grin', tears: 1 }, L.T); drizzle(V(-8, 0, -40), L.T, { count: 300, onGround: 300 });
  cm([-5, 7, -52, -12.6, 3.4, -38, 52], [-5.6, 7, -51.4, -12.6, 3.4, -38, 50], L.k); sh(V(-12, 0, -40), 16); }, [[0, 'door_open', .7], [.4, 'cry_girl', .3], [.8, 'laugh_old', .5], [1.6, 'birds', .5]]);
// 59 …mit einer Truhe voller 10.000 Diamanten
shot(W2('mit', 32), 'Z', null, L => { use('G'); put(mayor, -8, 0, -34, .5); applyPose(mayor, { aLx: 1.5, aRx: 1.5, aLe: .3, aRe: .3 }); face(mayor, { eyes: 'happy', mouth: 'grin', tears: 1 }, L.T); CHEST.visible = true; CHEST.position.copy(handP(mayor)).lerp(handP(mayor, 0), .5).add(V(0, -.9, .9)); CHEST.rotation.y = .5; CHEST.userData.lid.rotation.x = -1.6 * easeOut(clamp(L.lt / .5));
  const c = CHEST.position; cm([c.x + 3, c.y + 4, c.z + 6, c.x, c.y + 1.2, c.z, 46], [c.x + 2.6, c.y + 3.6, c.z + 5.2, c.x, c.y + 1.2, c.z, 44], L.k); badge('big', '10.000 DIAMANTEN', W / 2, H * .15, L.lt - .3); sparksAt(c.clone().add(V(0, 2, 0)), L.T * .4); }, [[0, 'lid_click', .7], [.2, 'ding_reveal', .8], [.5, 'sparkle', .6]]);
// 60 „Mats, du hast uns gerettet!“
shot(st(33), 'C', null, L => { use('G'); put(mayor, -8, 0, -34, .9); applyPose(mayor, { aRx: 1.5, aRe: .3, aLx: 1.2 }); talkFace(mayor, L.T, L.t0, L.t1, { eyes: 'happy', mouth: 'grin', tears: 1 }); put(mats, -3, 0, -31, -2); applyPose(mats, { aLz: .2, aRz: .2 }); face(mats, { eyes: 'open', mouth: 'smile', blush: 1 }, L.T);
  for (let i = 0; i < 6; i++) { put(ex[i], -6 + i * 2.4, Math.abs(Math.sin(L.T * 6 + i)) * .6, -42 - (i % 2) * 2, 0); applyPose(ex[i], CHEER); face(ex[i], { eyes: 'happy', mouth: 'grin' }, L.T + i); } confettiAt(-5, 2, -36, L.T, 10); cm([2, 5, -22, -6, 4.4, -34, 54], [1.4, 5, -23, -6, 4.4, -34, 52], L.k); sh(V(-6, 0, -36), 20); }, [[0, 'cheer', .7], [.4, 'confetti', .5], [1.2, 'party_horn', .4]]);
// 61 „Nimm dieses Vermögen!“
shot(st(34), 'S', null, L => { use('G'); put(mayor, -8, 0, -34, .9); applyPose(mayor, { aLx: 1.5, aRx: 1.5, aLe: .3, aRe: .3, lean: .2 }); face(mayor, { eyes: 'happy', mouth: 'grin' }, L.T); CHEST.visible = true; CHEST.position.copy(handP(mayor)).lerp(handP(mayor, 0), .5).add(V(.4, -.9, .5)); CHEST.rotation.y = .9; CHEST.userData.lid.rotation.x = -1.6;
  onFace(mayor, 10, .6, 2, 48, L.k, 8.4); }, [[0, 'glass_rattle', .6], [.4, 'cash', .4]]);
// 62 Ich sah die Truhe an…
shot(st(35), 'Z', null, L => { use('G'); CHEST.visible = true; CHEST.position.set(-5.6, 3, -32.6); CHEST.rotation.y = .9; CHEST.userData.lid.rotation.x = -1.6; const c = CHEST.position; cam([c.x + 1.8, c.y + 3.4, c.z + 3.4], [c.x, c.y + 1.4, c.z], 44); put(mayor, -8, 0, -34, .9); applyPose(mayor, { aLx: 1.5, aRx: 1.5 }); face(mayor, { eyes: 'happy', mouth: 'grin' }, L.T); sparksAt(c.clone().add(V(0, 2, 0)), L.T * .4); }, [[0, 'sparkle', .6], [.5, 'hmm', .3]]);
// 63 …dann ihn
shot(W2('dann', 35), 'C', null, L => { use('G'); put(mayor, -8, 0, -34, .9); applyPose(mayor, { aLx: 1.5, aRx: 1.5 }); face(mayor, { eyes: 'open', mouth: 'grin', brows: -.2 }, L.T); onFace(mayor, 7, .3, 0, 44, L.k, 6); }, [[0, 'whoosh_soft', .5]]);
// 64 …und lächelte
shot(W2('lächelte', 35), 'Z', null, L => { use('G'); put(mats, -3, 0, -31, -2); applyPose(mats, { aLz: .2, aRz: .2 }); face(mats, { eyes: 'happy', mouth: 'smile' }, L.T); onFace(mats, 7, .3, 0, 44, L.k, 6); }, [[0, 'ding_soft', .5]]);
// 65 „Behalt den Müll.“
shot(st(36), 'S', null, L => { use('G'); put(mats, -3, 0, -31, -2); applyPose(mats, { aRx: 1.6, aRe: .1, aRz: .2 }); face(mats, { eyes: 'half', mouth: 'smirk' }, L.T); put(mayor, -8, 0, -34, .9); applyPose(mayor, { aLx: 1.5, aRx: 1.5 }); face(mayor, { eyes: 'wide', mouth: 'o' }, L.T); CHEST.visible = true; CHEST.position.set(-5.6 - L.k * .6, 3, -32.6); CHEST.rotation.y = .9; CHEST.userData.lid.rotation.x = -1.6;
  cm([-5.6, 6, -22, -5.4, 4.4, -32.6, 50], [-5.6, 6, -23, -5.4, 4.4, -32.6, 48], L.k); }, [[0, 'whoosh_soft', .5], [.3, 'thud', .5]]);
// 66 „Gib mir lieber dein warmes Sauerteigbrot.“
shot(st(37), 'W', null, L => { use('G'); put(mayor, -8, 0, -34, .9); applyPose(mayor, { aRx: 1.0, aRe: .4, lean: .1 }); face(mayor, { eyes: 'happy', mouth: 'smile', tears: 1 }, L.T); LOAF.visible = true; LOAF.position.copy(handP(mayor)).add(V(.2, .4, .6)); steam.forEach((s, k) => { const t = (L.T * .8 + k / 8) % 1; s.visible = true; s.position.copy(LOAF.position).add(V(Math.sin(k * 2) * .4, .6 + t * 2, Math.cos(k) * .4)); s.material.opacity = .5 * (1 - t); s.scale.setScalar(.6 + t); });
  onFace(mayor, 9, .2, 2.4, 46, L.k, 7.6); badge('tag', 'SAUERTEIGBROT', W / 2, H * .14, L.lt - .3); }, [[0, 'steam', .5], [.4, 'sniff', .6], [1.2, 'ding_soft', .5]]);
// 67 Jetzt bin ich der Held der Stadt
shot(st(38), 'C', null, L => { use('G'); walkTo(mats, -4, -20, 0, L.T, L.lt, 2.2, false, .6); face(mats, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T); LOAF.visible = true; LOAF.position.copy(handP(mats)).add(V(0, .7, .3)); drizzle(V(-4, 0, -14), L.T, { count: 200, onGround: 200 });
  for (let i = 0; i < 8; i++) { const s = i % 2 ? 1 : -1; put(ex[i], -4 + s * (5 + (i % 3)), Math.abs(Math.sin(L.T * 6 + i)) * .5, -16 - i * 2, s > 0 ? -1.4 : 1.4); applyPose(ex[i], CHEER); face(ex[i], { eyes: 'happy', mouth: 'grin' }, L.T + i); } confettiAt(-4, 2, -16, L.T, 12);
  const p = mats.root.position; cm([p.x + 2, 4, p.z + 12, p.x, 4, p.z, 52], [p.x + 1.6, 4, p.z + 11, p.x, 4, p.z, 50], L.k); badge('tag', 'HELD DER STADT', W / 2, H * .14, L.lt - .3); sh(p, 22); }, [[0, 'cheer', .8], [.4, 'confetti', .5], [1.0, 'party_horn', .5], [1.4, 'steps', .3]]);
// 68 …esse frisches Brot
shot(W2('esse', 38), 'Z', null, L => { use('G'); put(mats, -4, 0, -16, 0); applyPose(mats, { aRx: 1.6, aRe: 1.9, aRz: -.4 }); face(mats, { eyes: 'happy', mouth: L.lt % .5 < .25 ? 'o' : 'grin', blush: 1 }, L.T); LOAF.visible = true; LOAF.position.copy(hp(mats)).add(V(1.7, -1.5, .5)); onFace(mats, 6.6, .3, 1.2, 44, L.k, 5.6); }, [[0, 'chew', .7], [.5, 'chew', .6], [.9, 'hmm', .4]]);
// 69 …und kicke nebenbei 50-Karat-Diamanten in den Gully (dron que sube)
shot(W2('kicke', 38), 'C', null, L => { use('G'); drizzle(V(-6, 0, 10), L.T, { count: 240, onGround: 240 }); put(mats, -7.6, 0, 12, -Math.PI / 2); const k = clamp((L.lt - .2) / .3); applyPose(mats, k > 0 && k < 1 ? { lRx: 1.3 * Math.sin(k * Math.PI), lRk: .2, aRx: 1.4, aRe: 1.6 } : { aRx: 1.4, aRe: 1.6 }); face(mats, { eyes: 'happy', mouth: 'smirk' }, L.T); LOAF.visible = true; LOAF.position.copy(handP(mats)).add(V(0, .7, .3));
  BIG.userData.custom((i, s, d) => { if (i) return false; const t = clamp((L.lt - .45) / .4); d.position.set(lerp(-8.4, -9.6, t), .4 + Math.sin(t * Math.PI) * .8 - (t >= 1 ? .8 : 0), 12 - t * 2); d.rotation.set(L.T * 6, 0, 0); d.scale.setScalar(.7); return true; });
  const q = easeInOut(clamp((L.lt - .9) / (L.d - .9))); cam([lerp(-1, 0, q), lerp(3.4, 60, q), lerp(20, 70, q)], [lerp(-8, 0, q), lerp(2.4, 0, q), lerp(12, -80, q)], lerp(48, 54, q)); if (L.lt > 1) badge('big', 'FUNKELBACH', W / 2, H * .16, L.lt - 1); sh(V(-8, 0, 10), 40); }, [[0, 'kick', .7], [.45, 'drip', .6], [.9, 'whoosh_up', .6], [1.6, 'bells', .4], [2.4, 'birds', .4]]);
function sunsetLike(k) { day(1 - .35 * k); const u = sky.sky.material.uniforms; u.top.value.lerp(new THREE.Color(.36, .32, .78), k); u.mid.value.lerp(new THREE.Color(1, .55, .45), k); u.hor.value.lerp(new THREE.Color(1, .72, .36), k); sun.color.setRGB(1, .7, .45); }

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 }, TR_SFX = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .05, s: ['zoom_in', 'whoosh_soft', 'zoom_out'][i % 3], g: .35 });
  if (!s.zoom && i > 1 && i % 3 === 0) { const d = (S[i + 1]?.t0 ?? DUR) - s.t0; CUES.push({ t: +(s.t0 + d * .45).toFixed(3), s: ['impact_soft', 'thump', 'zoom_in'][(i / 3) % 3], g: .6 }); }
  if (s.tr) CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS).toFixed(3), s: TR_SFX[s.tr], g: .8 }); });
CUES.push({ t: .25, s: 'riser', g: .9, d: +(st(2) - .3).toFixed(3) }); CUES.push({ t: st(2) - .02, s: 'braam', g: 1 });   // gancho: riser hasta "Denn wenn…"
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD.length = 0; s.fn(L); if (location.search.includes('noao')) ao.enabled = false;
  if (s.zoom === 'slow' || T < st(2)) { const e = s.zoom === 'slow' ? easeIn(L.k) : easeIn(clamp(T / st(2))); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .85, e); camera.fov *= lerp(1, .92, e); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'thump', 'braam', 'boom', 'table_bang', 'crash_wood'].includes(c.s) && T - c.t < .14) sh_ = 1 - (T - c.t) / .14; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .25 * sh_; camera.position.y += (r() - .5) * .25 * sh_; }
  if (!s.zoom && i > 1 && i % 3 === 0) camera.fov *= punch(lt, d * .45, .16, .16);
  camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  composer.render();
}
function renderAt(T) {
  const i = shotAt(T), s = S[i]; let tr = null, a = 0, ph = 0; const fO = (s.t1 - T) * FPS, fI = (T - s.t0) * FPS;
  if (s.tr && fO < TRW[s.tr]) { tr = s.tr; a = 1 - fO / TRW[s.tr]; ph = -1; } else if (i > 0 && S[i - 1].tr && fI < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fI / TRW[S[i - 1].tr]; ph = 1; }
  renderShot(i, T, tr, a);
  octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.translate(W / 2, H / 2); const a2 = a * a;
  if (tr === 'W') octx.translate(ph * a2 * W * .45, 0); if (tr === 'S') octx.translate(0, ph * a2 * H * .35);
  if (tr === 'Z') { const sc = ph < 0 ? 1 + a2 * .6 : 1 + a2 * .35; octx.scale(sc, sc); octx.filter = `blur(${(a * 8).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((ph < 0 ? 1 : -1) * a2 * .55); octx.scale(1 + a2 * .3, 1 + a2 * .3); octx.filter = `blur(${(a * 7).toFixed(1)}px)`; }
  if (tr === 'C' && ph > 0) { const sc = 1 + a * .22; octx.scale(sc, sc); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;


