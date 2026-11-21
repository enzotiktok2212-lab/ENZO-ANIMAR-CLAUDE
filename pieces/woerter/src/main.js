// Wörter — ~56 planos sincronizados con audio/words.json (1080×1920, 30 fps, 82,8 s).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt, tree } from './props.js';
import { makeFolk } from './gcast.js';
import { stadt } from './gsets.js';
import { makeKid, makeMama, makeWagner, makeLena, makeBoss, makeVendor } from './wcast.js';
import { callcenter, wohnung, kinderzimmer, bahnhof, jar, note, phone } from './wsets.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 82.788, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfe3ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a8070, 1.7); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 700 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-70, 140, 90)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const CX = 1000, WX = 1200, KX = 1400, BX = 1600;
const ST = stadt(scene), CC = callcenter(scene, CX), WG = wohnung(scene, WX), KZ = kinderzimmer(scene, KX), BH = bahnhof(scene, BX);
// ---------- reparto ----------
const kid = makeKid(scene), mama = makeMama(scene), wag = makeWagner(scene), lena = makeLena(scene), boss = makeBoss(scene), vend = makeVendor(scene);
const fk = Array.from({ length: 10 }, (_, i) => makeFolk(scene, i));
const POOL = [kid, mama, wag, lena, boss, vend, ...fk];
// ---------- atrezo ----------
const JAR = jar(scene), PHONE = phone(scene), COIN = cyl(.25, .25, .06, mat(0xe9c23a, { metalness: .85, roughness: .2 }), 16, scene);
const NOTES = ['Hallo Mama!', 'Wörter!', 'Für dich', '♥'].map((t, i) => note(scene, t, ['#ffe36a', '#ffb8d0', '#a8e8ff', '#c8f0a8'][i]));
const PEN = cyl(.06, .06, 1.2, mat(0x2a6ad8), 6, scene);
const BOXES = Array.from({ length: 3 }, () => box(2, 1.6, 1.8, mat(0xb8905a, { roughness: 1 }), .06, scene));
const CONF = Array.from({ length: 40 }, (_, i) => box(.3, .3, .05, mat([0xd8323a, 0xffd23f, 0x2ec46a, 0x2a6ad8, 0xff8ad0][i % 5]), 0, scene));
const GLOW = Array.from({ length: 36 }, (_, i) => sphere(.16, new THREE.MeshBasicMaterial({ color: new THREE.Color(...[[1.6, 1.4, .5], [.6, 1.4, 1.8], [1.6, .7, 1.2]][i % 3]), toneMapped: false, transparent: true }), scene, 0, 0, 0, 8, 6));
const cob = []; for (let k = 0; k < 6; k++) { const l = box(.03, 2 + k * .3, .03, mat(0xdddddd, { transparent: true, opacity: .5 }), 0, scene); cob.push(l); }
const LEAVES = Array.from({ length: 14 }, (_, i) => box(.5, .05, .35, mat([0xd8782a, 0xc8a02a, 0xa8481a][i % 3]), 0, scene));
const chairM = mat(0x2a2e3a, { roughness: .6 }); const CHAIRS = Array.from({ length: 4 }, () => { const g = new THREE.Group(); scene.add(g); box(2.2, .3, 2.2, chairM, .06, g, 0, 2.15, 0); box(2.2, 2.4, .3, chairM, .06, g, 0, 3.4, -1.0); for (const [x, z] of [[-.9, -.9], [.9, -.9], [-.9, .9], [.9, .9]]) box(.22, 2.1, .22, chairM, .03, g, x, 1.05, z); return g; });
let chairN = 0; const chair = (x, z, ry) => { const c = CHAIRS[chairN++ % CHAIRS.length]; c.visible = true; c.position.set(x, 0, z); c.rotation.set(0, ry, 0); return c; };
const PROPS = [...CHAIRS, JAR, PHONE, COIN, ...NOTES, PEN, ...BOXES, ...CONF, ...GLOW, ...cob, ...LEAVES];
const NUMS = [];
// ---------- utilidades ----------
const SETS = { ST: ST.G, CC: CC, WG: WG.g, KZ: KZ.g, BH: BH.g };
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
function day() { setSky([.26, .58, .98], [.5, .78, 1], [.78, .9, 1]); hemi.intensity = 1.7; hemi.color.setRGB(.81, .9, 1); sun.intensity = 2.7; sun.color.setRGB(1, .94, .85); rim.intensity = 1.3; scene.fog.color.setRGB(.75, .88, 1); scene.fog.density = .0008; ST.lamps.forEach(l => l.userData && l.userData.bulb && (l.userData.bulb.material.emissiveIntensity = .2)); bloom.strength = .26; }
function night() { setSky([.03, .05, .16], [.08, .12, .3], [.16, .22, .42]); hemi.intensity = .75; hemi.color.setRGB(.55, .65, 1); sun.intensity = .55; sun.color.setRGB(.6, .7, 1); rim.intensity = 2.2; scene.fog.color.setRGB(.05, .08, .2); bloom.strength = .5; }
function dusk() { setSky([.36, .3, .62], [1, .5, .3], [1, .66, .3]); hemi.intensity = 1.3; hemi.color.setRGB(1, .78, .62); sun.intensity = 2; sun.color.setRGB(1, .62, .36); rim.intensity = 1.6; scene.fog.color.setRGB(.9, .6, .4); bloom.strength = .36; }
function winter() { setSky([.55, .6, .7], [.72, .76, .84], [.86, .88, .92]); hemi.intensity = 1.9; hemi.color.setRGB(.86, .9, 1); sun.intensity = 1.2; sun.color.setRGB(.9, .93, 1); rim.intensity = 1.0; scene.fog.color.setRGB(.82, .85, .9); scene.fog.density = .003; bloom.strength = .3; }
function inside(h = .9, s = .5) { hemi.intensity = h; sun.intensity = s; bloom.strength = .42; scene.fog.density = .0002; }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
const TREES = []; ST.G.traverse(o => { if (o.userData && o.userData.leaves) TREES.push(o); }); const trees = on => TREES.forEach(t => t.visible = on);
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.head.scale.set(1, 1, 1); c.head.visible = true; c.unmask && c.unmask(0); c.setFace({}); }
  chairN = 0; for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; trees(true); ST.SNOW.visible = false; NUMS.length = 0;
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = .85; grade.uniforms.sepia.value = 0; day(); scene.fog.density = .0008; }
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
function face(ch, f, T) { const s = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(s.eyes) && !s.noBlink) s.eyes = 'closed'; ch.setFace(s); }
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; } applyPose(ch, { ...p, ...extra }); }
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => ch.head.getWorldPosition(V(0, 0, 0)); const handP = (ch, r = 1) => (r ? ch.aR : ch.aL).hand.getWorldPosition(V(0, 0, 0));
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { ch.root.updateMatrixWorld(true); const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy, h.z + fz * d - fx * side], [h.x, h.y - .3, h.z], fov); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b); const talkFace = (ch, T, a, b, f) => face(ch, { ...f, mouth: lip(T, spoken(a, b)) || f.mouth }, T);
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function walkTo(ch, x0, z0, ry, T, lt, speed = 3, run = false, sp = .6) { const d = speed * lt; put(ch, x0 + Math.sin(ry) * d, 0, z0 + Math.cos(ry) * d, ry); applyPose(ch, run ? runPose(T, 1.0) : walkPose(T, sp)); }
const wt = (w, after = 0) => { const x = WORDS.find(q => q[0] >= after - .01 && q[2].replace(/[.,:?!„“"]/g, '').toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error('word ' + w); return x[0]; };
const STN = {}; for (const w of WORDS) if (!(w[3] in STN)) STN[w[3]] = w[0]; const st = n => STN[n]; const W2 = (w, n) => wt(w, st(n));
const SIT = { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLz: .15, aRz: .15 };
const sit = (ch, x, y, z, ry, extra = {}) => { const s = ch.spec.scale || 1; put(ch, x, y - (2.05 - .2) * s + .08, z, ry); applyPose(ch, { ...SIT, ...extra }); };
const RIGID = { aLz: .04, aRz: .04, aLe: 0, aRe: 0 };
const LAUGH = (T) => ({ lean: -.12 + Math.sin(T * 16) * .04, headX: -.25, aLz: .25, aRz: .25, aLe: .5, aRe: .5, hipY: 2.05 + Math.abs(Math.sin(T * 16)) * .05 });
const CRY = (T) => ({ headX: .35, lean: .15, aLx: 1.2, aRx: 1.2, aLe: 1.9, aRe: 1.9, aLz: -.2, aRz: -.2, hipY: 2.05 + Math.sin(T * 22) * .03 });
const WAVE = (T, sp = 7) => ({ aRx: 2.6, aRz: .35 + Math.sin(T * sp) * .35, aRe: .4 });
const RADIO = { aRx: 1.25, aRe: 1.75, aRz: -.15, headX: .1 };
const dropsAt = (from, vel, t, n = 26, g = 9) => drops.forEach((d, i) => { d.visible = t > 0 && i < n; const a = i * 2.399, sp = .6 + (i % 5) * .25; d.position.set(from.x + (vel.x + Math.cos(a) * sp) * t, from.y + (vel.y + Math.sin(a) * sp) * t - g * t * t, from.z + (vel.z + Math.sin(a * 1.3) * sp) * t); });
const dustAt = (c, t, sc = 1) => dust.forEach((s, i) => { s.visible = t > 0; const a = i * 2.399, r = t * (1.5 + (i % 4)) * sc; s.position.set(c.x + Math.cos(a) * r, c.y + ((i % 3) * .3 + t * 1.2) * sc, c.z + Math.sin(a) * r); s.scale.setScalar((.3 + t * .9) * sc); s.material.opacity = clamp(.6 - t * .4); });
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const pop = (lt, at = 0) => spring(clamp((lt - at) * 1.8));
// gente del pueblo en la calle: caminan, todos con la misma sonrisa
const townWalk = (T, lt, n = 8, z0 = 0, dir = 1, nums = true) => { for (let i = 0; i < n; i++) { const e = fk[i], s = i % 2 ? 1 : -1; walkTo(e, s * (3 + (i % 3) * 2.6), z0 - i * 5 * dir, dir > 0 ? 0 : Math.PI, T + (i % 3) * .05, lt, 2.2); face(e, { mouth: i % 3 ? 'smile' : 'flat' }, T); if (nums) num(e, [812, 430, 977, 265, 590, 38, 701, 154][i]); } };


// ---------- contadores sobre las cabezas ----------
const fmt = n => { n = Math.max(0, Math.round(n)); return n >= 1000 ? Math.floor(n / 1000) + '.' + String(n % 1000).padStart(3, '0') : String(n); };
// num(personaje, valor, {pop, big, dy}): pastilla con bocadillo + número, barra de color según lo que queda
function num(ch, v, o = {}) { NUMS.push({ ch, v, pop: o.pop ?? 0, big: o.big ?? 1, dy: o.dy ?? 1.1, max: o.max ?? 1000 }); }
function drawNum(n) { const h = hp(n.ch).add(V(0, (1.75 + n.dy) * (n.ch.spec.scale || 1), 0)); const [x, y, z] = proj(h); if (z >= 1 || x < -200 || x > W + 200 || y < -100 || y > H) return;
  const dist = camera.position.distanceTo(h), base = clamp(26 / dist, .28, 1.35) * n.big * (1 + n.pop * .35); const c = octx; c.save(); c.translate(x, y); c.scale(base * U, base * U);
  const t = fmt(n.v), k = clamp(n.v / n.max), col = n.v <= 0 ? '#e8203a' : k < .2 ? '#ff7a2a' : k < .5 ? '#f2c23a' : '#2ec46a';
  c.font = `700 46px ${FONT}`; const tw = c.measureText(t).width, w = tw + 120; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.shadowOffsetY = 5;
  c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(-w / 2, -34, w, 68, 34); c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 6; c.strokeStyle = '#1d2238'; c.stroke();
  c.fillStyle = col; c.beginPath(); c.roundRect(-w / 2 + 8, 18, (w - 16) * Math.max(.04, k), 8, 4); c.fill();
  c.save(); c.translate(-w / 2 + 42, -2); c.fillStyle = col; c.beginPath(); c.roundRect(-22, -18, 44, 32, 10); c.fill(); c.beginPath(); c.moveTo(-10, 12); c.lineTo(-14, 24); c.lineTo(2, 12); c.fill(); c.fillStyle = '#fff'; for (const dx of [-10, 0, 10]) { c.beginPath(); c.arc(dx, -2, 3.5, 0, 7); c.fill(); } c.restore();
  c.fillStyle = n.v <= 0 ? '#e8203a' : '#1d2238'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, 20, -3); c.restore(); }
const tick = (a, b, lt, t0, t1) => lerp(a, b, easeInOut(clamp((lt - t0) / Math.max(.01, t1 - t0))));   // número que cambia entre t0 y t1
const popAt = (lt, t) => lt >= t && lt < t + .3 ? 1 - (lt - t) / .3 : 0;
// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = clamp(x, 220, W - 220); b.y = clamp(y, 200, H * .62); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red') { c.font = `700 100px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 620) { const k = 620 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 48px ${FONT}`; const w = c.measureText(b.text).width + 56; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 46px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'heart') { const sc = 1 + Math.max(0, Math.sin(b.text * 9)) * .25; c.scale(sc, sc); c.fillStyle = '#e8203a'; c.strokeStyle = '#4a0010'; c.lineWidth = 8; c.beginPath(); c.moveTo(0, 40); c.bezierCurveTo(-90, -20, -50, -90, 0, -45); c.bezierCurveTo(50, -90, 90, -20, 0, 40); c.fill(); c.stroke(); }
  c.restore(); }
const KEY = /^(Stadt|Kopf|Wörter|tausend|null|stumm|sieben|Wagner|Heiratsantrag|letztes|hei|sechs|Callcenter|Job|Wohnung|Wort|nichts|Nacht|wichtigster|Riesenkunde|acht|Telefon|1\.500|geben|nie|Ohr|Nichts|Zettel|Bahnhof|Glas|leer|Arbeit|umarme|Zahl|1\.000|700|300|steigt|wandern|Umarmung|zwei|zurückgeben|Kopf|Hause|400|Kunden|ersten|Abend|Schatz|lieb|aufgehoben|auch|Null|Tage|schönsten|Mama)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI, HOMEZ = -40, PZ = -160;
const lie = (ch, x, y, z) => { y = 3.35; put(ch, x, y, z, 0); ch.root.rotation.x = -PI / 2; applyPose(ch, { aLz: .1, aRz: .1 }); };
const glowFlow = (a, b, k, n = 36) => GLOW.forEach((g, i) => { const t = (k * 1.6 + i / n) % 1; g.visible = i < n && k > 0; const p = a.clone().lerp(b, t); p.y += Math.sin(t * PI) * 2 + Math.sin(i * 3.1) * .3; p.x += Math.sin(i * 1.7 + k * 9) * .3; g.position.copy(p); g.scale.setScalar(.8 + Math.sin(t * PI) * .8); });
const chest = ch => ch.spine.getWorldPosition(V(0, 0, 0)).add(V(0, 1.2 * (ch.spec.scale || 1), 0));
const confettiAt = (c, T) => CONF.forEach((p, i) => { p.visible = true; const ph = (T * .35 + i * .0618) % 1; p.position.set(c.x + Math.sin(i * 7.1) * 7, c.y + 9 - ph * 10, c.z + Math.cos(i * 3.3) * 5); p.rotation.set(T * 4 + i, T * 3 + i * 2, i); });
const MAMA_CC = () => { put(mama, CX, 0, 4.4, PI / 2); }; const ccCam = (k, d = 9, y = 6.2) => cm([CX + d, y, 4.6, CX, 4.6, 4.4, 44], [CX + d - 1.6, y - .2, 4.6, CX, 4.6, 4.4, 42], k);

// 1 GANCHO — golpe de zoom + swoosh: el narrador camina por la calle; números sobre todas las cabezas
shot(0, 'W', null, L => { use('ST'); townWalk(L.T, L.lt, 8, -26); walkTo(kid, 0, -30, 0, L.T, L.lt, 2.2); face(kid, { mouth: 'flat', look: [Math.sin(L.T * 2) * .6, .4] }, L.T); num(kid, 1000, { big: 1.2 });
  const z0 = .3, h = kid.root.position; if (L.T < z0) { const k = easeOut(L.T / z0); cam([h.x, lerp(9, 5, k), h.z + lerp(30, 12, k)], [h.x, 4.4, h.z], lerp(76, 46, k)); } else cm([h.x, 5, h.z + 12, h.x, 4.4, h.z, 46], [h.x + 1, 4.8, h.z + 9.5, h.x, 4.4, h.z, 44], (L.lt - z0) / (L.d - z0), q => q); sh(h, 30); },
  [[0, 'zoom_fast', 1], [.1, 'steps', .6], [.5, 'city_amb', .5], [1.2, 'steps', .5]]);
// 2 …wie viele Wörter du heute noch sagen darfst. — dos vecinos charlan: los números bajan con cada palabra
shot(W2('wie', 1) - .1, 'Z', null, L => { use('ST'); put(fk[2], -1.8, 0, -70, .5); put(fk[5], 1.8, 0, -70, -.5); talkFace(fk[2], L.T, L.t0 - 3, L.t1, { mouth: 'smile' }); face(fk[5], { mouth: 'smile' }, L.T); applyPose(fk[2], { aRx: .9 + Math.sin(L.T * 6) * .3, aRe: 1.2 }); applyPose(fk[5], { headX: .05 });
  num(fk[2], Math.round(lerp(642, 618, L.k)), { pop: (L.lt * 6) % 1 < .3 ? .4 : 0 }); num(fk[5], 377); cm([-6, 6, -58, 0, 4.6, -70, 44], [5, 6, -58, 0, 4.6, -70, 42], L.k); sh(V(0, 0, -70), 20); }, [[0, 'murmur', .5], [.6, 'cloth', .4], [1.3, 'birds', .4]]);
// 3 Jeden Morgen bekommt jeder tausend. — despertador: el contador del niño aparece con muelle 0 → 1.000
shot(st(2), 'F', null, L => { use('KZ'); inside(1, .6); lie(kid, KX - 4, 2.9, -3.2); kid.root.rotation.x = lerp(-PI / 2, -PI / 2 + 1.1, easeOut(clamp(L.lt * 1.5))); face(kid, { mouth: 'o', eyes: L.lt < .4 ? 'closed' : 'open' }, L.T); num(kid, tick(0, 1000, L.lt, .5, 1.1), { pop: popAt(L.lt, .5), big: 1.3 });
  const h3 = hp(kid); cm([h3.x + 5, h3.y + 3, h3.z + 5, h3.x, h3.y, h3.z, 46], [h3.x + 4, h3.y + 2.6, h3.z + 4, h3.x, h3.y, h3.z, 42], L.k); badge('big', '1.000', W / 2, H * .16, L.lt - 1.1); }, [[0, 'alarm_soft', .7], [.4, 'blanket', .5], [.6, 'sparkle', .5]]);
// 4 Und wer auf null fällt, — una mujer habla por teléfono por la calle: 3, 2, 1, 0
shot(st(3), 'S', null, L => { use('ST'); walkTo(fk[3], 4, -88, PI, L.T, L.lt, 1.6, false, .4); attach(PHONE, fk[3].aR.hand, [0, -.4, .5], [0, 0, 0]); applyPose(fk[3], { ...walkPose(L.T, .4), aRx: 2.4, aRe: 2.2, aRz: -.3 }); talkFace(fk[3], L.T, L.t0 - 2, L.t1, { mouth: 'smile' });
  const v = Math.max(0, 3 - Math.floor(L.lt / .4)); num(fk[3], v, { pop: (L.lt % .4) < .12 ? 1 : 0, big: 1.3 }); onFace(fk[3], 7, .6, -1, 44, L.k, 5.5); sh(V(4, 0, -90), 20); }, [[0, 'city_amb', .5], [.2, 'steps', .4], [.8, 'mobile', .4]]);
// 5 …ist sieben Tage lang stumm. — abre la boca y no sale nada
shot(W2('ist', 3), 'C', null, L => { use('ST'); put(fk[3], 4, 0, -92, PI); attach(PHONE, fk[3].aR.hand, [0, -.4, .5], [0, 0, 0]); applyPose(fk[3], { aRx: 2.4, aRe: 2.2, aRz: -.3, aLx: 1.5, aLe: 1.8 + Math.sin(L.T * 9) * .2 }); face(fk[3], { mouth: 'o', eyes: 'wide', brows: -.5, sweat: 1 }, L.T); num(fk[3], 0, { big: 1.4 });
  onFace(fk[3], 5.5, .4, 0, 42, L.k, 4.4); badge('red', '7 TAGE STUMM', W / 2, H * .16, L.lt - .3, 1, .85); }, [[0, 'zoom_in', .6], [.3, 'gasp', .6], [1.2, 'tick', .4]]);
// 6 Herr Wagner hat beim Heiratsantrag — plaza: se arrodilla con el anillo, Lena se tapa la boca, gente mirando
shot(st(4), 'R', null, L => { use('ST'); const k = easeOut(clamp(L.lt * 1.2)); put(wag, 0, 0, PZ, PI); applyPose(wag, { crouch: 1.0 * k, lLx: 1.5 * k, lLk: 1.5 * k, lRx: .2, lRk: 1.6 * k, aRx: 1.5, aRe: .3 }); face(wag, { mouth: 'smile', eyes: 'open' }, L.T); num(wag, 3);
  put(lena, 0, 0, PZ - 4, 0); applyPose(lena, { aRx: 2.3, aRe: 2.3, aRz: -.4 }); face(lena, { mouth: 'o', eyes: 'wide', blush: 1 }, L.T); num(lena, 520); for (let i = 0; i < 5; i++) { put(fk[i], -9 + i * 4.5, 0, PZ - 9 - (i % 2) * 2, 0); applyPose(fk[i], { aLx: .6, aRx: .6, aLe: 1.6, aRe: 1.6 }); face(fk[i], { mouth: 'smile', eyes: 'happy' }, L.T); }
  cm([12, 5.5, PZ - 1, 0, 3.6, PZ - 2, 46], [10, 5.2, PZ - .5, 0, 3.6, PZ - 2, 44], L.k); sh(V(0, 0, PZ), 30); }, [[0, 'murmur', .5], [.4, 'cloth', .6], [1.0, 'aah', .5], [1.8, 'piano_note', .4]]);
// 7 …sein letztes Wort verbraucht. — primer plano: el contador baja a 1
shot(W2('sein', 4), 'W', null, L => { use('ST'); put(wag, 0, 0, PZ, PI); applyPose(wag, { crouch: 1.0, lLx: 1.5, lLk: 1.5, lRx: .2, lRk: 1.6, aRx: 1.5, aRe: .3 }); face(wag, { mouth: 'flat', eyes: 'wide', look: [0, -.6], sweat: 1 }, L.T); num(wag, L.lt < .5 ? 3 : L.lt < .9 ? 2 : 1, { pop: popAt(L.lt, .5) + popAt(L.lt, .9), big: 1.3 }); onFace(wag, 7, -.2, 1, 42, L.k, 5.6); sh(V(0, 0, PZ), 20); },
  [[0, 'heartbeat', .7], [.6, 'heartbeat', .7], [1.2, 'gulp', .6]]);
// 8 „Willst du mich hei…" — se le corta la frase: 0
shot(st(5) - .05, 'C', 'slow', L => { use('ST'); put(wag, 0, 0, PZ, PI); applyPose(wag, { crouch: 1.0, lLx: 1.5, lLk: 1.5, lRx: .2, lRk: 1.6, aRx: 1.6, aRe: .3 }); const cut = L.lt > .75; talkFace(wag, L.T, L.t0, L.t0 + .75, cut ? { mouth: 'o', eyes: 'wide', brows: -.6 } : { mouth: 'smile' }); if (cut) face(wag, { mouth: 'o', eyes: 'wide', brows: -.6 }, 0);
  num(wag, cut ? 0 : 1, { pop: popAt(L.lt, .75) * 1.5, big: 1.4 }); onFace(wag, 5.4, .2, -.8, 40, L.k, 4.2); bubble(wag, 'WILLST DU MICH HEI…', L.lt - .05); }, [[.75, 'glitch', .6], [.76, 'impact', .7]]);
// 9 Seit sechs Tagen kniet er da. — sigue arrodillado: telarañas, hojas, palomas; TAG 6
shot(st(6) - .05, 'F', null, L => { use('ST'); dusk(); put(wag, 0, 0, PZ, PI); applyPose(wag, { crouch: 1.0, lLx: 1.5, lLk: 1.5, lRx: .2, lRk: 1.6, aRx: 1.5, aRe: .3, headX: .1 }); face(wag, { mouth: 'flat', eyes: 'half', bags: 1 }, L.T); num(wag, 0);
  const h = hp(wag); cob.forEach((c, i) => { c.visible = true; c.position.set(h.x - 1.2 + i * .5, h.y - 1 - (i % 3), h.z + .2); c.rotation.z = (i - 2.5) * .4; }); LEAVES.forEach((l, i) => { l.visible = true; l.position.set(Math.sin(i * 2.1) * 4, .08 + (i % 3) * .04, PZ + Math.cos(i * 1.3) * 3); l.rotation.y = i; });
  cm([6, 4, PZ - 7, 0, 3, PZ, 46], [5, 4.2, PZ - 6, 0, 3, PZ, 42], L.k); badge('tag', 'TAG 6', W / 2, H * .16, L.lt - .3); sh(V(0, 0, PZ), 20); }, [[0, 'wind', .7], [.5, 'leaves', .6], [1.2, 'owl', .4]]);
// 10 Und sie weiß immer noch nicht, was er fragen wollte. — Lena da golpecitos con el pie, encoge los hombros
shot(st(7), 'Z', null, L => { use('ST'); dusk(); put(lena, 0, 0, PZ - 4, 0); applyPose(lena, { aLz: .9, aRz: .9, aLe: 1.4, aRe: 1.4, aLx: .3, aRx: .3, headZ: .15, lRx: Math.max(0, Math.sin(L.T * 10)) * .3 }); face(lena, { mouth: 'flat', brows: -.4, look: [0, .6] }, L.T); num(lena, 412);
  put(wag, 0, 0, PZ, PI); applyPose(wag, { crouch: 1.0, lLx: 1.5, lLk: 1.5, lRx: .2, lRk: 1.6, aRx: 1.5, aRe: .3 }); onFace(lena, 7.5, .6, 4.5, 44, L.k, 6); bubble(lena, '???', L.lt - .3); sh(V(0, 0, PZ), 20); }, [[0, 'zoom_in', .5], [.3, 'tick', .4], [.4, 'steps', .4], [1.1, 'sigh', .5]]);
// 11 Meine Mama arbeitet im Callcenter. — call center: Mama de pie con los cascos, habla sin parar; el número baja rápido
shot(st(8), 'W', null, L => { use('CC'); inside(1.1, .4); MAMA_CC(); applyPose(mama, { aRx: 1.0 + Math.sin(L.T * 5) * .3, aRe: 1.3, aLx: .4, aLe: 1.6, headY: Math.sin(L.T * 2) * .2 }); talkFace(mama, L.T, L.t0 - 20, L.t1 + 20, { mouth: 'smile', bags: 1 });
  for (let i = 0; i < 4; i++) { put(fk[i], CX - 5 - i * 4, 0, 4.4 + (i % 2 ? 1.2 : -1), PI / 2); applyPose(fk[i], { aRx: .9, aRe: 1.4 }); talkFace(fk[i], L.T + i, L.t0 - 20, L.t1 + 20, { mouth: 'smile' }); num(fk[i], [420, 87, 655, 233][i]); }
  num(mama, Math.round(lerp(640, 590, L.k)), { pop: (L.lt * 5) % 1 < .25 ? .4 : 0, big: 1.2 }); ccCam(L.k, 11, 7); }, [[0, 'phone_ring', .5], [.4, 'murmur', .6], [1.0, 'keys', .5], [1.6, 'button', .4]]);
// 12 Wenn sie stumm wird, verliert sie ihren Job. — la jefa la señala con la carpeta
shot(st(9), 'R', null, L => { use('CC'); inside(1.1, .4); MAMA_CC(); applyPose(mama, { aRx: .3, aRe: .3, headY: .5 }); face(mama, { mouth: 'frown', brows: -.5, look: [.8, 0], sweat: 1 }, L.T); num(mama, 588);
  put(boss, CX - 3.6, 0, 5.4, PI / 2 - .3); applyPose(boss, { aRx: 1.6, aRe: .1, aRz: .1, aLx: .8, aLe: 1.2 }); talkFace(boss, L.T, L.t0, L.t0 + 1, { mouth: 'frown', brows: .6, eyes: 'squint' }); num(boss, 905);
  cm([CX + 9, 6.2, 4.4, CX - 1.6, 4.6, 4.8, 46], [CX + 8, 6, 4.4, CX - 1.6, 4.6, 4.8, 44], L.k); badge('red', 'GEFEUERT?', W / 2, H * .16, L.lt - .5, 1, .85); }, [[0, 'steps_heavy', .6], [.5, 'paper', .5], [1.3, 'gulp', .5]]);
// 13 Und wir unsere Wohnung. — en casa: cajas de mudanza y el niño abrazado a sus rodillas
shot(st(10), 'S', null, L => { use('WG'); inside(.9, .3); BOXES.forEach((b, i) => show(b, WX + 9 + i * 2.4, .8, -3 + (i % 2), i * .3)); sit(kid, WX + 6, 0, 0, .3, { lLx: 2.2, lRx: 2.2, lLk: 2.6, lRk: 2.6, aLx: 1.2, aRx: 1.2, aLe: .8, aRe: .8, headX: .3 }); face(kid, { mouth: 'frown', brows: -.6 }, L.T); num(kid, 1000);
  cm([WX + 2, 6, 9, WX + 7, 2.4, -1, 46], [WX + 3, 5.6, 7.5, WX + 7, 2.4, -1, 42], L.k); badge('tag', 'GEKÜNDIGT', W / 2, H * .16, L.lt - .3); }, [[0, 'zoom_out', .5], [.3, 'sad_tone', .5], [.7, 'paper', .4]]);
// 14 Deshalb spart sie jedes Wort. — en la cocina, Mama escribe una nota en vez de hablar
shot(st(11), 'I', null, L => { use('WG'); inside(.9, .3); chair(WX - 8, -3.4, 0); sit(mama, WX - 8, 2.3, -3.6, 0, { aRx: 1.1, aRe: 1.2 + Math.sin(L.T * 14) * .1, headX: .35 }); face(mama, { mouth: 'flat', look: [0, 1], bags: 1 }, L.T); attach(PEN, mama.aR.hand, [0, -.5, .3], [.6, 0, 0]); show(NOTES[0], WX - 8, 3.65, -1.8); NOTES[0].rotation.x = -PI / 2; num(mama, 3);
  cm([WX - 4, 7.5, 3, WX - 8, 3.8, -2.4, 46], [WX - 5, 7, 2, WX - 8, 3.8, -2.4, 42], L.k); }, [[0, 'pencil', .7], [.6, 'paper', .5], [1.2, 'pencil', .5]]);
// 15 Zu Hause sagt sie nichts. — cena: el niño cuenta cosas, Mama solo asiente y sonríe cansada
shot(st(12), 'C', null, L => { use('WG'); inside(.9, .3); chair(WX - 8, -3.4, 0); sit(mama, WX - 8, 2.3, -3.6, 0, { headX: Math.sin(L.T * 5) * .12 }); face(mama, { mouth: 'smile', eyes: 'half', bags: 1 }, L.T); num(mama, 3);
  chair(WX - 8, 1.4, PI); sit(kid, WX - 8, 2.3, 1.6, PI, { aRx: 1.2 + Math.sin(L.T * 7) * .4, aRe: 1, aLx: .9 + Math.cos(L.T * 7) * .4, aLe: 1 }); talkFace(kid, L.T, L.t0 - 9, L.t1 + 9, { mouth: 'grin' }); num(kid, 610);
  cm([WX + 7, 8, -1, WX - 8, 4, -1, 46], [WX + 6, 8, 0, WX - 8, 4, -1, 44], L.k); }, [[0, 'spoon', .6], [.5, 'plate_slide', .4], [1.0, 'clock_tick', .4]]);
// 16 Seit Monaten kein „Gute Nacht". — el niño en la cama; Mama en la puerta saluda en silencio y apaga la luz
shot(st(13), 'W', null, L => { use('KZ'); inside(.6, .2); lie(kid, KX - 4, 2.9, -3.2); face(kid, { mouth: 'frown', eyes: 'open', look: [1, 0] }, L.T); num(kid, 140); put(mama, KX + 5, 0, 2, -PI * .75); applyPose(mama, WAVE(L.T, 3)); face(mama, { mouth: 'smile', eyes: 'half', bags: 1 }, L.T); num(mama, 1);
  cm([KX + 10, 8, 9, KX - 1, 3.6, -4, 50], [KX + 9, 7.8, 8, KX - 1, 3.6, -4, 48], L.k); badge('tag', 'GUTE NACHT?', W / 2, H * .16, L.lt - .5); }, [[0, 'door_creak', .5], [1.0, 'switch', .7], [1.3, 'clock_tick', .4]]);
// 17 Dann kommt ihr wichtigster Tag: — la pantalla del call center: RIESENKUNDE
shot(st(14), 'Z', null, L => { use('CC'); inside(1.1, .4); put(mama, CX, 0, 4.4, PI); applyPose(mama, { headX: -.3 }); face(mama, { mouth: 'o', eyes: 'wide' }, L.T); num(mama, 1000);
  cm([CX + 1.6, 6.2, 7.6, CX, 6.4, -17, 54], [CX + 1.2, 6.4, 7.2, CX, 6.8, -17, 50], L.k); }, [[0, 'zoom_in', .6], [.3, 'ding_reveal', .5], [1.2, 'murmur', .4]]);
// 18 ein Riesenkunde, acht Stunden am Telefon. — el reloj gira, 8 STUNDEN
shot(st(15), 'F', null, L => { use('CC'); inside(1.1, .4); MAMA_CC(); applyPose(mama, { aRx: 2.1, aRe: 2.3, aRz: -.3, aLx: .5, aLe: 1.5 }); talkFace(mama, L.T, L.t0 - 9, L.t1 + 9, { mouth: 'smile', sweat: 1 }); num(mama, Math.round(lerp(990, 930, L.k)), { pop: (L.lt * 6) % 1 < .25 ? .3 : 0 });
  ccCam(L.k, 8, 6); badge('big', '8 STUNDEN', W / 2, H * .16, L.lt - .6); }, [[0, 'phone_ring', .6], [.5, 'keys', .5], [1.2, 'clock_spin', .6], [2.0, 'keys', .4]]);
// 19 Sie braucht mindestens 1.500 Wörter. — cálculo: pop-up 1.500
shot(st(16), 'S', null, L => { use('CC'); inside(1.1, .4); MAMA_CC(); applyPose(mama, { aRx: 1.9, aRe: 2.5, aRz: -.5, headX: .1 }); face(mama, { mouth: 'frown', brows: -.4, look: [.5, -.5] }, L.T); num(mama, 1000, { big: 1.2 });
  ccCam(L.k, 7, 6.8); badge('red', 'BRAUCHT: 1.500', W / 2, H * .16, L.lt - .4, 1, .85); }, [[0, 'zoom_out', .5], [.4, 'tick', .5], [1.1, 'tension_str', .4]]);
// 20 Über ihrem Kopf stehen tausend. — cocina por la mañana: primer plano del 1.000 de Mama; el niño la mira
shot(st(17), 'C', 'slow', L => { use('WG'); inside(1, .4); put(mama, WX - 3, 0, -6, .4); applyPose(mama, { aRx: 1.0, aRe: 1.6 }); face(mama, { mouth: 'flat', brows: -.4, bags: 1 }, L.T); num(mama, 1000, { big: 1.5, pop: popAt(L.lt, .3) });
  put(kid, WX + 1, 0, -2.5, -PI * .75); applyPose(kid, { headX: -.3 }); face(kid, { mouth: 'frown', look: [0, -.6] }, L.T); num(kid, 1000); onFace(mama, 8, 1.4, 0, 44, L.k, 6.5); }, [[0, 'sip', .4], [.2, 'cup_rattle', .4], [.9, 'heartbeat', .5]]);
// 21 Ich muss ihr Wörter geben. — el niño, decidido, aprieta el puño
shot(st(18), 'R', null, L => { use('WG'); inside(1, .4); put(kid, WX + 1, 0, -2.5, .2); kp(kid, L.lt, [[0, {}], [.4, { aRx: 1.8, aRe: 2.2, aRz: -.3, headX: -.05 }]]); face(kid, { mouth: 'flat', brows: .5, eyes: 'squint' }, L.T); num(kid, 1000); onFace(kid, 5.5, .4, -1, 42, L.k, 4.4); }, [[0, 'zoom_fast', .5], [.4, 'fist', .7]]);
// 22 Aber das hat noch nie jemand geschafft. — en la calle, los mayores niegan con la cabeza
shot(st(19), 'W', null, L => { use('ST'); for (let i = 0; i < 3; i++) { put(fk[6 + i], -4 + i * 4, 0, -100, 0); applyPose(fk[6 + i], { headY: Math.sin(L.T * 8 + i) * .4, aLz: .3, aRz: .3 }); face(fk[6 + i], { mouth: 'frown', brows: -.3 }, L.T); num(fk[6 + i], [702, 255, 813][i]); }
  put(kid, 0, 0, -94, PI); applyPose(kid, { aRx: .8, aRe: .6 }); face(kid, { mouth: 'o' }, L.T); num(kid, 984); cm([6, 5, -88, 0, 4, -98, 48], [3, 5, -86, 0, 4, -98, 46], L.k); badge('tag', 'UNMÖGLICH', W / 2, H * .16, L.lt - .4); sh(V(0, 0, -98), 20); }, [[0, 'murmur', .5], [.5, 'hmm', .6], [1.2, 'sigh', .4]]);
// 23 Ich flüstere ihr Wörter ins Ohr. — en la cocina le susurra al oído
shot(st(20), 'I', null, L => { use('WG'); inside(1, .4); chair(WX - 8, -3.4, 0); sit(mama, WX - 8, 2.3, -3.6, 0, { aRx: 1.0, aRe: 1.6 }); face(mama, { mouth: 'flat', look: [.6, 0], bags: 1 }, L.T); num(mama, 1000);
  put(kid, WX - 6.6, 0, -3.4, -PI / 2); applyPose(kid, { lean: .3, aRx: 1.4, aRe: 1.8, aRz: -.2, headX: .2 }); talkFace(kid, L.T, L.t0, L.t1, { mouth: 'o', eyes: 'half' }); num(kid, Math.round(lerp(984, 978, L.k)));
  cm([WX - 4, 6.4, 3, WX - 7.4, 4.8, -3.5, 40], [WX - 4.6, 6.2, 2, WX - 7.4, 4.8, -3.5, 36], L.k); }, [[0, 'whisper', .8], [.8, 'whisper', .6]]);
// 24 Nichts. — el 1.000 no se mueve
shot(st(21) - .05, 'C', null, L => { use('WG'); inside(1, .4); chair(WX - 8, -3.4, 0); sit(mama, WX - 8, 2.3, -3.6, 0); face(mama, { mouth: 'flat', bags: 1 }, L.T); num(mama, 1000, { big: 1.6 }); onFace(mama, 6.5, 2.2, 0, 40); badge('red', 'NICHTS', W / 2, H * .16, L.lt - .1, 1, .8); }, [[0, 'impact_soft', .5]]);
// 25 Ich schreibe sie auf Zettel. — notas pegadas por toda la nevera y en Mama
shot(st(22) - .02, 'Z', null, L => { use('WG'); inside(1, .4); put(kid, WX + 1, 0, -8.6, PI); applyPose(kid, { aRx: 2.3 + Math.sin(L.T * 12) * .1, aRe: .4 }); face(kid, { mouth: 'flat', brows: .3 }, L.T); num(kid, 975);
  WG.notes.forEach((n, i) => { n.visible = L.lt > i * .15; }); cm([WX + 4, 7, -2, WX + .5, 6, -10, 44], [WX + 3, 7, -3, WX + .5, 6, -10, 40], L.k); }, [[0, 'zoom_in', .5], [.2, 'paper', .7], [.5, 'paper', .6], [.8, 'paper', .5]]);
// 26 Nichts. — Mama con una nota pegada en la frente; el número igual
shot(st(23) - .05, 'F', null, L => { use('WG'); inside(1, .4); put(mama, WX - 3, 0, -6, .2); applyPose(mama, { headX: -.1 }); face(mama, { mouth: 'smile', eyes: 'half', bags: 1, look: [0, -1] }, L.T); attach(NOTES[2], mama.head, [0, 1.1, .7], [0, 0, .1], .6); num(mama, 1000, { big: 1.4 }); onFace(mama, 6, .8, 0, 40); }, [[0, 'impact_soft', .5], [.2, 'paper', .4]]);
// 27 Ich kaufe am Bahnhof ein Glas voller „Wörter". — el vendedor le da un frasco por una moneda
shot(st(24), 'S', null, L => { use('BH'); day(); put(vend, BX - 12, 2, -6.2, 0); applyPose(vend, { aRx: 1.6, aRe: .5 }); talkFace(vend, L.T, L.t0, L.t1, { mouth: 'smirk', eyes: 'half' }); num(vend, 999);
  put(kid, BX - 12, 2, .6, PI); applyPose(kid, { aRx: 1.5, aRe: .3 }); face(kid, { mouth: 'smile', eyes: 'wide' }, L.T); num(kid, 970); const k = clamp(L.lt / 1.2); attach(JAR, k < .6 ? vend.aR.hand : kid.aR.hand, [0, -.8, .6], [0, 0, 0], .9); attach(COIN, kid.aL.hand, [0, -.5, .4], [PI / 2, 0, 0]); applyPose(kid, { aRx: 1.5, aRe: .3, aLx: 1.2, aLe: .3 });
  cm([BX - 4, 6, 6, BX - 12, 5.8, -2.6, 46], [BX - 5, 6, 5, BX - 12, 5.8, -2.6, 44], L.k); sh(V(BX - 12, 0, -2), 20); }, [[0, 'wind', .4], [.1, 'whistle', .4], [.6, 'coins', .7], [1.4, 'glass_rattle', .6]]);
// 28 (…voller Wörter) — vuelve corriendo a casa con el frasco
shot(W2('voller', 24) + .1, 'W', null, L => { use('ST'); const z = -60 + L.lt * 9; put(kid, -2, 0, z, 0); applyPose(kid, { ...runPose(L.T), aRx: 1.6, aRe: 1.2 }); attach(JAR, kid.aR.hand, [0, -.6, .6], [0, 0, 0], .9); face(kid, { mouth: 'grin', eyes: 'happy' }, L.T); num(kid, 968);
  cm([2, 3.5, z + 8, -2, 3.4, z, 50], [2, 3.5, z + 8, -2, 3.4, z, 50], 1); sh(V(0, 0, z), 30); }, [[0, 'run_cobble', .8], [.6, 'glass_rattle', .4]]);
// 29 Es ist leer. — abre el frasco en la mesa: nada; ni un sonido
shot(st(25) - .06, 'C', 'slow', L => { use('WG'); inside(1, .4); chair(WX - 8, 1.4, PI); sit(kid, WX - 8, 2.3, 1.6, PI, { aRx: 1.4, aRe: .8, aLx: 1.4, aLe: .8 }); show(JAR, WX - 8, 4.2, -.4); JAR.userData.lid.position.y = .7 + clamp(L.lt * 2) * .6; face(kid, { mouth: L.lt > .4 ? 'frown' : 'o', eyes: 'wide', brows: -.4 }, L.T); num(kid, 966);
  const j = JAR.position; cm([j.x + 2.6, j.y + 2.4, j.z - 3, j.x, j.y, j.z, 40], [j.x + 2, j.y + 2, j.z - 2.4, j.x, j.y, j.z, 36], L.k); badge('tag', 'LEER', W / 2, H * .16, L.lt - .4); }, [[0, 'lid_click', .7], [.3, 'silence_tick', .5]]);
// 30 Mama geht zur Arbeit. — sale por la puerta del edificio a la calle
shot(st(26) - .04, 'R', null, L => { use('ST'); walkTo(mama, -18, HOMEZ, PI / 2, L.T, L.lt, 2.4); face(mama, { mouth: 'flat', eyes: 'open', bags: 1 }, L.T); num(mama, 1000); cm([-6, 5, HOMEZ + 12, -15, 4, HOMEZ, 46], [-5, 5, HOMEZ + 11, -13, 4, HOMEZ, 44], L.k); sh(V(-15, 0, HOMEZ), 20); }, [[0, 'door_slam', .4], [.3, 'steps', .6], [.8, 'steps', .5]]);
// 31 Ich renne hinterher — el niño corre tras ella
shot(st(27), 'S', null, L => { use('ST'); const z = HOMEZ - 4 - L.lt * 10; put(kid, 2, 0, z, PI); applyPose(kid, runPose(L.T, 1.1)); face(kid, { mouth: 'shout', eyes: 'wide' }, L.T); num(kid, 960); walkTo(mama, 4, HOMEZ - 22 - L.lt * 2, PI, L.T, L.lt, .6); num(mama, 1000);
  cm([0, 4, z + 9, 3, 3.4, z - 6, 50], [0, 4, z + 9, 3, 3.4, z - 6, 50], 1); sh(V(2, 0, z), 30); }, [[0, 'run_cobble', .9], [.5, 'gasp', .4]]);
// 32 …und umarme sie, so fest ich kann. — el abrazo (zoom lento)
shot(W2('umarme', 27) - .1, 'C', 'slow', L => { use('ST'); const z = HOMEZ - 24; put(mama, 4, 0, z, .1); put(kid, 4, 0, z + 1.6, PI + .1); applyPose(kid, { aRx: 1.6, aRe: 1.4, aRz: -.6, aLx: 1.6, aLe: 1.4, aLz: -.6, headX: .2 }); applyPose(mama, { aRx: 1.3, aRe: 1.6, aRz: -.4, aLx: 1.3, aLe: 1.6, aLz: -.4, headX: .35 });
  face(kid, { mouth: 'frown', eyes: 'closed', tears: 1 }, L.T); face(mama, { mouth: 'o', eyes: 'wide' }, L.T); num(kid, 960); num(mama, 1000); const a = .4 + L.k * .6; cam([4 + Math.sin(a) * 9, 5.4, z + .8 + Math.cos(a) * 9], [4, 4, z + .8], 46); sh(V(4, 0, z), 20); }, [[0, 'hug', .8], [.5, 'cloth', .6]]);
// 33 Und über meinem Kopf fällt die Zahl. — el número del niño empieza a temblar
shot(st(28), 'Z', null, L => { use('ST'); const z = HOMEZ - 24; put(mama, 4, 0, z, .1); put(kid, 4, 0, z + 1.6, PI + .1); applyPose(kid, { aRx: 1.6, aRe: 1.4, aRz: -.6, aLx: 1.6, aLe: 1.4, aLz: -.6, headX: .2 }); applyPose(mama, { aRx: 1.3, aRe: 1.6, aRz: -.4, aLx: 1.3, aLe: 1.6, aLz: -.4, headX: .35 }); face(kid, { mouth: 'frown', eyes: 'closed' }, L.T);
  num(kid, 960, { pop: Math.abs(Math.sin(L.T * 30)) * .2, big: 1.6 }); const h = hp(kid); cam([h.x - 2, h.y + 4, h.z + 6], [h.x, h.y + 2.2, h.z], 42); camera.position.x += Math.sin(L.T * 40) * .03; }, [[0, 'zoom_in', .6], [.4, 'tension_str', .5]]);
// 34-36 1.000 / 700 / 300 — golpes de zoom; el número cae a saltos y brillan las palabras
const FALL = [[29, 1000, 700], [30, 700, 300], [31, 300, 2]];
FALL.forEach(([n, a, b], j) => shot(st(n) - .05, j === 2 ? 'F' : 'C', null, L => { use('ST'); const z = HOMEZ - 24; put(mama, 4, 0, z, .1); put(kid, 4, 0, z + 1.6, PI + .1); applyPose(kid, { aRx: 1.6, aRe: 1.4, aRz: -.6, aLx: 1.6, aLe: 1.4, aLz: -.6, headX: .2 }); applyPose(mama, { aRx: 1.3, aRe: 1.6, aRz: -.4, aLx: 1.3, aLe: 1.6, aLz: -.4, headX: .35 });
  face(kid, { mouth: 'frown', eyes: 'closed', tears: 1 }, L.T); face(mama, { mouth: 'o', eyes: 'wide' }, L.T); const v = tick(a, b, L.lt, .05, L.d * .8); num(kid, v, { big: 1.5, pop: popAt(L.lt, .05) }); num(mama, 1000 + (1000 - v) * .998); glowFlow(chest(kid), chest(mama), L.lt / L.d);
  const sides = [[-8, 5.6, .8], [8, 6, .8], [-6, 8, 3]][j], k = easeOut(clamp(L.lt / .2)); cam([4 + sides[0], sides[1], z + .8 + sides[2]], [4, 4.6, z + .8], lerp(56, 42, k)); }, [[0, 'zoom_fast', .7], [.1, 'sparkle', .6]]));
// 37 Ihre steigt. — el número de Mama sube
shot(st(32) - .05, 'W', null, L => { use('ST'); const z = HOMEZ - 24; put(mama, 4, 0, z, .1); applyPose(mama, { aRx: .5, aRe: 1.0, headX: -.1 }); face(mama, { mouth: 'o', eyes: 'wide', brows: -.5 }, L.T); num(mama, tick(1700, 1998, L.lt, 0, .7), { max: 2000, big: 1.5, pop: popAt(L.lt, .05) }); glowFlow(hp(mama).add(V(0, -4, 3)), chest(mama), L.lt / L.d);
  onFace(mama, 6.5, 1.2, 0, 42, L.k, 5.2); }, [[0, 'whoosh_up', .1], [.1, 'sparkle', .7], [.6, 'pling', .5]]);
// 38 Wörter wandern. — plano general: el chorro de luz entre los dos
shot(st(33) - .05, 'I', null, L => { use('ST'); const z = HOMEZ - 24; put(mama, 4, 0, z, .1); put(kid, 4, 0, z + 1.6, PI + .1); applyPose(kid, { aRx: 1.6, aRe: 1.4, aRz: -.6, aLx: 1.6, aLe: 1.4, aLz: -.6, headX: .2 }); applyPose(mama, { aRx: 1.3, aRe: 1.6, aRz: -.4, aLx: 1.3, aLe: 1.6, aLz: -.4, headX: .35 }); face(kid, { mouth: 'smile', eyes: 'closed' }, L.T);
  glowFlow(chest(kid), chest(mama), L.lt / L.d); num(kid, 120); num(mama, 1880, { max: 2000 }); cm([16, 9, z + 14, 4, 4, z + 1, 50], [13, 8, z + 12, 4, 4, z + 1, 48], L.k); sh(V(4, 0, z), 30); }, [[0, 'sparkle', .6], [.6, 'wind', .4]]);
// 39 Aber nur bei einer echten Umarmung. — primer plano emotivo
shot(st(34), 'Z', null, L => { use('ST'); const z = HOMEZ - 24; put(mama, 4, 0, z, .1); put(kid, 4, 0, z + 1.6, PI + .1); applyPose(kid, { aRx: 1.6, aRe: 1.4, aRz: -.6, aLx: 1.6, aLe: 1.4, aLz: -.6, headX: .2 }); applyPose(mama, { aRx: 1.3, aRe: 1.6, aRz: -.4, aLx: 1.3, aLe: 1.6, aLz: -.4, headX: .35 });
  face(kid, { mouth: 'smile', eyes: 'closed', tears: 1 }, L.T); face(mama, { mouth: 'frown', eyes: 'closed', tears: 1 }, L.T); num(kid, 2); num(mama, 1998, { max: 2000 }); onFace(mama, 5, .8, 1.2, 40, L.k, 4.2); }, [[0, 'zoom_in', .5], [.4, 'piano_note', .5], [1.1, 'sniff', .5]]);
// 40 Mir bleiben genau zwei. — el 2 del niño, enorme
shot(st(35), 'C', 'slow', L => { use('ST'); const z = HOMEZ - 24; put(kid, 4, 0, z + 2.4, .1); applyPose(kid, { headX: -.2 }); face(kid, { mouth: 'smile', eyes: 'open', tears: 1, look: [0, -1] }, L.T); num(kid, 2, { big: 1.8, pop: popAt(L.lt, .1) }); onFace(kid, 6, 1.6, 0, 42, L.k, 4.6); }, [[0, 'heartbeat', .6]]);
// 41 Mama will sie zurückgeben. — Mama tiende las manos
shot(st(36), 'R', null, L => { use('ST'); const z = HOMEZ - 24; put(mama, 4, 0, z, .1); put(kid, 4, 0, z + 3.4, PI); applyPose(mama, { aRx: 1.5, aRe: .2, aLx: 1.5, aLe: .2, lean: .15 }); talkFace(mama, L.T, L.t0, L.t0 + .3, { mouth: 'frown', brows: -.6, tears: 1 }); num(mama, 1998, { max: 2000 }); num(kid, 2);
  onFace(mama, 8, 1, 2.6, 46, L.k, 7); }, [[0, 'cloth', .6], [.6, 'sniff', .4]]);
// 42 Ich schüttle den Kopf. — el niño niega con la cabeza, sonriendo
shot(st(37) - .05, 'S', null, L => { use('ST'); const z = HOMEZ - 24; put(kid, 4, 0, z + 3.4, PI); applyPose(kid, { headY: Math.sin(L.lt * 14) * .45, aLz: .2, aRz: .2 }); face(kid, { mouth: 'smile', eyes: 'happy' }, L.T); num(kid, 2); onFace(kid, 6, .4, -1.2, 42, L.k, 5); }, [[0, 'cloth', .5], [.4, 'cloth', .4]]);
// 43 Abends kommt sie nach Hause. — se abre la puerta del piso, atardecer
shot(st(38) - .05, 'W', null, L => { use('WG'); inside(.8, .3); WG.light.intensity = 30; walkTo(mama, WX + 16.4, 11.4, PI + .3, L.T, L.lt, 1.6); face(mama, { mouth: 'smile', eyes: 'open' }, L.T); num(mama, 400, { max: 2000 });
  put(kid, WX + 10, 0, 2, .7); applyPose(kid, WAVE(L.T, 6)); face(kid, { mouth: 'grin', eyes: 'happy' }, L.T); num(kid, 2); cm([WX + 4, 6, -4, WX + 14, 4.4, 9, 46], [WX + 5, 6, -3, WX + 14, 4.4, 9, 44], L.k); }, [[0, 'door_open', .8], [.4, 'keys', .5], [.9, 'steps', .5]]);
// 44 Über ihrem Kopf: 400. — primer plano del 400
shot(st(39), 'C', null, L => { use('WG'); inside(.8, .3); put(mama, WX + 15.4, 0, 9, PI + .3); applyPose(mama, { headX: -.05 }); face(mama, { mouth: 'grin', eyes: 'happy' }, L.T); num(mama, tick(1998, 400, L.lt, 0, .8), { max: 2000, big: 1.6, pop: popAt(L.lt, .8) }); onFace(mama, 7, 2, 0, 42, L.k, 5.6); }, [[0, 'zoom_fast', .6], [.8, 'pling', .4]]);
// 45 Den Kunden hat sie. — recuerdo del call center: compañeros celebran, confeti
shot(st(41) - .05, 'F', null, L => { use('CC'); inside(1.1, .4); MAMA_CC(); applyPose(mama, { aRx: 2.9, aLx: 2.9, aRe: .2, aLe: .2, aRz: .4, aLz: .4, hipY: 2.05 + Math.abs(Math.sin(L.T * 8)) * .4 }); face(mama, { mouth: 'grin', eyes: 'happy' }, L.T); num(mama, 512, { max: 2000 });
  for (let i = 0; i < 3; i++) { put(fk[i], CX - 3 - i * 3.4, 0, 4.4 + (i % 2 ? 1.4 : -1), PI / 2); applyPose(fk[i], { aRx: 2.6, aLx: 2.6, aRe: .3, aLe: .3 }); face(fk[i], { mouth: 'grin', eyes: 'happy' }, L.T); } confettiAt(V(CX, 4, 4.4), L.T); ccCam(L.k, 12, 7); }, [[0, 'cheer', .7], [.2, 'confetti', .6], [.6, 'party_horn', .5]]);
// 46 Den Job auch. — la jefa le estrecha la mano
shot(st(42) - .05, 'Z', null, L => { use('CC'); inside(1.1, .4); put(mama, CX, 0, 3.2, 0); put(boss, CX, 0, 5.8, PI); const sk = Math.sin(L.T * 12) * .1; applyPose(mama, { aRx: 1.3 + sk, aRe: .2 }); applyPose(boss, { aRx: 1.3 - sk, aRe: .2 }); face(mama, { mouth: 'grin', eyes: 'happy' }, L.T); face(boss, { mouth: 'smile', brows: 0 }, L.T); num(mama, 500, { max: 2000 }); num(boss, 870);
  cm([CX + 9, 6, 4.6, CX, 4.4, 4.5, 44], [CX + 7.6, 5.8, 4.6, CX, 4.4, 4.5, 42], L.k); badge('big', 'JOB ✔', W / 2, H * .16, L.lt - .3); }, [[0, 'zoom_in', .5], [.2, 'slap', .5], [.5, 'cheer', .3], [.6, 'cheer', .4]]);
// 47 Und zum ersten Mal seit Monaten redet sie. — sofá: Mama habla sin parar, el niño escucha feliz
shot(st(43), 'S', null, L => { use('WG'); inside(.8, .3); sit(mama, WX + 9.5, 2.2, -7.4, .2, { aRx: 1.2 + Math.sin(L.T * 6) * .4, aRe: 1.2, aLx: .9 + Math.cos(L.T * 6) * .4, aLe: 1.2 }); talkFace(mama, L.T, L.t0 - 9, L.t1 + 9, { mouth: 'grin', eyes: 'happy' }); num(mama, Math.round(lerp(398, 330, L.k)), { max: 2000, pop: (L.lt * 5) % 1 < .25 ? .3 : 0 });
  sit(kid, WX + 12.5, 2.2, -7.4, -.2); face(kid, { mouth: 'grin', eyes: 'happy' }, L.T); num(kid, 2); cm([WX + 11, 6.4, 3, WX + 11, 4.2, -7.4, 46], [WX + 11, 6, 1.5, WX + 11, 4.2, -7.4, 42], L.k); }, [[0, 'laugh_m', .4], [.3, 'cloth', .4], [1.0, 'kids_laugh', .4], [1.8, 'clock_tick', .3]]);
// 48 Den ganzen Abend. — la cena, el reloj avanza, ríen
shot(st(44), 'W', null, L => { use('WG'); inside(.8, .3); chair(WX - 8, -3.4, 0); sit(mama, WX - 8, 2.3, -3.6, 0, { aRx: 1.1 + Math.sin(L.T * 7) * .4, aRe: 1.0 }); talkFace(mama, L.T, L.t0 - 9, L.t1 + 9, { mouth: 'grin', eyes: 'happy' }); num(mama, 211, { max: 2000 });
  chair(WX - 8, 1.4, PI); sit(kid, WX - 8, 2.3, 1.6, PI, LAUGH(L.T)); face(kid, { mouth: 'grin', eyes: 'happy' }, L.T); num(kid, 2); cm([WX + 7, 8, -2, WX - 8, 4, -1, 48], [WX + 6, 8, -1, WX - 8, 4, -1, 46], L.k); }, [[0, 'spoon', .5], [.4, 'laugh_m', .4], [.8, 'clock_tick', .4]]);
// 49 Dann deckt sie mich zu: — lo arropa en la cama
shot(st(45), 'I', null, L => { use('KZ'); inside(.6, .2); lie(kid, KX - 4, 2.9, -3.2); face(kid, { mouth: 'smile', eyes: 'open', look: [1, 0] }, L.T); num(kid, 2); put(mama, KX - .2, 0, -3.4, -PI / 2); applyPose(mama, { lean: .4, aRx: 1.4, aRe: .5, aLx: 1.4, aLe: .5 }); face(mama, { mouth: 'smile', eyes: 'half' }, L.T); num(mama, 9, { max: 2000 });
  KZ.blanket.position.y = 2.7 + .7 * easeOut(clamp(L.lt * 1.5)); cm([KX + 4, 8, 5, KX - 3, 3, -4, 48], [KX + 3, 7.6, 4, KX - 3, 3, -4, 46], L.k); }, [[0, 'blanket', .7], [.6, 'cloth', .5]]);
// 50 „Gute Nacht, Schatz. Ich hab dich lieb." — primer plano de Mama; su número baja a 0… (le quedaban justo esas)
shot(st(46) - .05, 'F', null, L => { use('KZ'); inside(.6, .2); put(mama, KX - .2, 0, -3.4, -PI / 2); applyPose(mama, { lean: .15, aRx: .4, aRe: .4, headX: .1 }); talkFace(mama, L.T, L.t0, L.t1, { mouth: 'smile', eyes: 'half', tears: 1 }); const v = Math.max(0, 7 - spoken(L.t0, L.T).length); num(mama, v, { max: 2000, pop: (L.lt * 3) % 1 < .2 ? .3 : 0, big: 1.3 });
  onFace(mama, 5.6, -.2, 1.6, 42, L.k, 4.6); bubble(mama, 'ICH HAB DICH LIEB', L.lt - .9); }, [[0, 'piano_note', .5], [.9, 'piano_note', .4]]);
// 51 Ich habe meine zwei Wörter den ganzen Tag aufgehoben. — el niño en la cama, su 2 brilla
shot(st(48), 'Z', 'slow', L => { use('KZ'); inside(.6, .2); lie(kid, KX - 4, 2.9, -3.2); KZ.blanket.position.y = 3.4; face(kid, { mouth: 'smile', eyes: 'open', tears: 1, look: [1, 0] }, L.T); num(kid, 2, { big: 1.5 }); const h = hp(kid); cam([h.x + .4, h.y + 4.6, h.z + lerp(3.6, 2.8, L.k)], [h.x, h.y + .5, h.z], 44); }, [[0, 'heartbeat', .4], [1.4, 'sniff', .4]]);
// 52 „Ich auch." — el niño habla: 2 → 0
shot(st(49) - .05, 'C', null, L => { use('KZ'); inside(.6, .2); lie(kid, KX - 4, 2.9, -3.2); KZ.blanket.position.y = 3.4; talkFace(kid, L.T, L.t0, L.t1, { mouth: 'smile', eyes: 'happy', tears: 1 }); num(kid, L.lt < .25 ? 2 : L.lt < .45 ? 1 : 0, { big: 1.6, pop: popAt(L.lt, .25) + popAt(L.lt, .45) }); const h = hp(kid); cam([h.x + .3, h.y + 4.2, h.z + 2.6], [h.x, h.y + .5, h.z], 42); bubble(kid, 'ICH AUCH.', L.lt - .05); }, [[0, 'zoom_in', .4], [.25, 'pop', .4], [.45, 'pop', .4]]);
// 53 Null. — el 0 rojo
shot(st(50) - .03, 'F', null, L => { use('KZ'); inside(.6, .2); lie(kid, KX - 4, 2.9, -3.2); KZ.blanket.position.y = 3.4; face(kid, { mouth: 'smile', eyes: 'closed' }, L.T); num(kid, 0, { big: 2.2 }); const h = hp(kid); cam([h.x + .2, h.y + 5.6, h.z + 2.2], [h.x, h.y + 1.6, h.z], 40); }, [[0, 'impact_soft', .6]]);
// 54 Sieben Tage stumm. — 7 TAGE STUMM, el niño sonríe
shot(st(51), 'W', null, L => { use('KZ'); inside(.6, .2); lie(kid, KX - 4, 2.9, -3.2); KZ.blanket.position.y = 3.4; face(kid, { mouth: 'smile', eyes: 'happy' }, L.T); num(kid, 0); put(mama, KX + 1, 0, -1, -PI / 2 - .4); applyPose(mama, WAVE(L.T, 2)); face(mama, { mouth: 'smile', eyes: 'happy' }, L.T);
  cm([KX + 6, 9, 5, KX - 3, 3, -4, 50], [KX + 5, 8.4, 4, KX - 3, 3, -4, 48], L.k); badge('red', '7 TAGE STUMM', W / 2, H * .16, L.lt - .2, 1, .85); }, [[0, 'switch', .5], [.4, 'cricket', .4]]);
// 55 Die schönsten sieben Tage meines Lebens. — mañana siguiente: desayuno; el niño responde con notas, Mama habla
shot(st(52), 'R', null, L => { use('WG'); inside(1, .4); chair(WX - 8, -3.4, 0); sit(mama, WX - 8, 2.3, -3.6, 0, { aRx: 1.1 + Math.sin(L.T * 6) * .4, aRe: 1.0 }); talkFace(mama, L.T, L.t0 - 9, L.t1 + 9, { mouth: 'grin', eyes: 'happy' }); num(mama, 1000);
  chair(WX - 8, 1.4, PI); sit(kid, WX - 8, 2.3, 1.6, PI, { aRx: 1.5, aRe: .4 }); attach(NOTES[3], kid.aR.hand, [0, -.8, .4], [0, PI, 0], 1.2); face(kid, { mouth: 'grin', eyes: 'happy' }, L.T); num(kid, 0); cm([WX + 7, 8, 1, WX - 8, 4.2, -1, 48], [WX + 6, 7.8, 1.5, WX - 8, 4.2, -1, 46], L.k); badge('tag', 'TAG 1–7 ♥', W / 2, H * .16, L.lt - .4); }, [[0, 'birds', .4], [.4, 'paper', .5], [1.0, 'laugh_m', .4], [1.5, 'spoon', .4]]);
// 56 Denn Mama redet jetzt für uns zwei. — en el sofá: Mama habla, él se ríe; la cámara se aleja
shot(st(53), 'S', null, L => { use('WG'); inside(.8, .3); sit(mama, WX + 9.5, 2.2, -7.4, .2, { aRx: 1.2 + Math.sin(L.T * 6) * .4, aRe: 1.2, aLx: 1.6, aLe: 1.0, aLz: -.5 }); talkFace(mama, L.T, L.t0 - 9, L.t1 + 9, { mouth: 'grin', eyes: 'happy' }); num(mama, 860);
  sit(kid, WX + 11.6, 2.2, -7.4, -.2, { lean: -.15, headX: -.1 }); face(kid, { mouth: 'grin', eyes: 'happy' }, L.T); num(kid, 0); cm([WX + 10.5, 5.6, -1.5, WX + 10.5, 4.4, -7.4, 40], [WX + 10.5, 8.5, 6, WX + 10.5, 4.4, -7.4, 50], L.k); }, [[0, 'laugh_m', .4], [.6, 'kids_laugh', .4], [1.2, 'piano_note', .4]]);
// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0 && !s.sfx.some(x => /^zoom/.test(x[1]))) CUES.push({ t: s.t0 + .04, s: ['zoom_in', 'zoom_out'][i % 2], g: .35 });
  if (s.tr === 'Z') CUES.push({ t: +(s.t1 - TRW.Z / FPS).toFixed(3), s: 'zoom_in', g: .6 }); if (s.tr === 'C') CUES.push({ t: +(s.t1 + .01).toFixed(3), s: 'impact', g: .55 }); });
CUES.push({ t: 0, s: 'whoosh_up', g: .9 }); CUES.push({ t: .02, s: 'riser', g: .9, d: +(st(2) - .1).toFixed(3) }); CUES.push({ t: st(2) - .02, s: 'braam', g: 1 });   // gancho: riser hasta "gefressen haben"
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD.length = 0; s.fn(L);
  if (s.zoom === 'slow' || T < st(2)) { const e = s.zoom === 'slow' ? easeIn(L.k) : easeIn(clamp(T / st(2))); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .78, e); camera.fov *= lerp(1, .9, e); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'door_slam', 'zoom_fast'].includes(c.s) && T - c.t < .14) sh_ = 1 - (T - c.t) / .14; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .22 * sh_; camera.position.y += (r() - .5) * .22 * sh_; }
  camera.position.x += Math.sin(T * 1.7) * .03; camera.position.y += Math.sin(T * 2.3) * .025;   // leve balanceo de mano
  camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  sky.sky.position.copy(camera.position); composer.render();
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
  if (tr === 'I') { octx.beginPath(); octx.arc(0, 0, Math.max(1, (1 - a2) * H * .62), 0, 7); octx.clip(); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  for (const n of NUMS) drawNum(n); for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;


// ---------- portada (1080×1920): el niño delante, el pueblo detrás con sus números; texto pegado a las cabezas ----------
window.renderCover = (variant = 0) => {
  hideAll(); BAD.length = 0; use('ST'); day(); const z = -60;
  put(kid, 0, 0, z, 0); applyPose(kid, { aRx: 2.05, aRe: 2.45, aRz: -.6, aLz: .15, headX: .08 }); kid.setFace({ mouth: 'flat', eyes: 'wide', brows: -.5, sweat: 1, look: [0, 0] }); num(kid, 1000, { big: 1.25, dy: .35 });
  const P = [[-3.6, -7, 812, 'smile'], [3.6, -7, 0, 'o'], [-1.4, -13, 265, 'grin'], [1.6, -12, 590, 'smile'], [-5.6, -15, 38, 'frown'], [5.4, -16, 977, 'grin']];
  P.forEach(([x, dz, v, m], i) => { const p = fk[i]; put(p, x, 0, z + dz, -x * .04); const zero = v === 0; applyPose(p, zero ? { aRx: 2.2, aRe: 2.3, aRz: -.4, aLx: 2.2, aLe: 2.3, aLz: -.4 } : { aRx: .6 + (i % 2) * .5, aRe: 1.2, headY: -x * .04 }); p.setFace({ mouth: m, eyes: zero ? 'wide' : 'open', brows: zero ? -.6 : 0 }); num(p, v, { big: .9 }); });
  cam([0, 4.2, z + 14], [0, 5.2, z - 6], 44); grade.uniforms.vig.value = .58; grade.uniforms.sat.value = 1.6; sh(V(0, 0, z - 4), 30);
  camera.updateProjectionMatrix(); sky.sky.position.copy(camera.position); composer.render(); octx.drawImage(renderer.domElement, 0, 0, W, H); for (const n of NUMS) drawNum(n);
  const c = octx; const T = (s, x, y, size, fill) => { c.save(); c.translate(x, y); c.rotate(-.02); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; const tw = c.measureText(s).width; if (tw > W * .92) { const k = W * .92 / tw; c.scale(k, k); } c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.shadowOffsetY = 10; c.lineWidth = size * .22; c.strokeStyle = '#000'; c.strokeText(s, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = fill; c.fillText(s, 0, 0); c.restore(); };
  const [t1, t2] = variant ? ['WIE VIELE WÖRTER', 'HAST DU NOCH?'] : ['NUR 1.000 WÖRTER', 'AM TAG'];
  T(t1, W / 2, H * .17, 100, '#ffffff'); T(t2, W / 2, H * .235, 132, '#E2FD07');
  const tag = 'BEI 0: 7 TAGE STUMM'; c.save(); c.translate(W / 2, H * .8); c.rotate(.03); c.font = `700 70px ${FONT}`; const tk = Math.min(1, 860 / c.measureText(tag).width); c.scale(tk, tk); const tw = c.measureText(tag).width + 90; c.fillStyle = '#d6202f'; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.beginPath(); c.roundRect(-tw / 2, -56, tw, 112, 30); c.fill(); c.shadowBlur = 0; c.lineWidth = 10; c.strokeStyle = '#fff'; c.stroke(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tag, 0, 6); c.restore();
};
