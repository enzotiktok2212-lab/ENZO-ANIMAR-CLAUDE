// Tür — ~95 planos sincronizados con audio/words.json (1080×1920, 30 fps, 177,7 s).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp, checkTex,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt, tree } from './props.js';
import { makeFolk } from './gcast.js';
import { stadt } from './gsets.js';
import { wohnung } from './wsets.js';
import { radio } from './gcast.js';
import { makeKid, makeMila, makeMom, makeFuchs, makeOma, makeBeast } from './tcast.js';
import { lager, felder, porch, wagon, arch, dateTable, rope } from './tsets.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 177.66, U = W / 720;
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
const LX = 1000, WX = 1200, FX = 1500, PX = 1800, VS = 200;
const ST = stadt(scene), LG = lager(scene, LX), WG = wohnung(scene, WX), FD = felder(scene, FX), PO = porch(scene, PX);
// casas de la Vorstadt: z de cada casa y su puerta / césped (izquierda: x = 175, derecha: x = 225)
const HZ = [30, 6, -18, -42, -66, -90];
const lawnL = z => V(VS - 14.2, 0, z + 5.1), lawnR = z => V(VS + 14.2, 0, z - 5.1), doorL = z => V(VS - 18.4, 0, z + 5.1), doorR = z => V(VS + 18.4, 0, z - 5.1);
const HOME = 6;   // casa del narrador (izquierda, z = 6); enfrente vive la madre de Herr Fuchs
// ---------- reparto ----------
const kid = makeKid(scene), mila = makeMila(scene), mom = makeMom(scene), fuchs = makeFuchs(scene), oma = makeOma(scene);
const fk = Array.from({ length: 10 }, (_, i) => makeFolk(scene, i));
const BEASTS = Array.from({ length: 8 }, (_, i) => makeBeast(scene, i, 3.4));
const POOL = [kid, mila, mom, fuchs, oma, ...fk, ...BEASTS];
// ---------- atrezo ----------
const WAGON = wagon(scene), ARCH = arch(scene), DTABLE = dateTable(scene), ROPE = rope(scene, 80);
const RADIOP = radio(scene, 1.3), CAKE = (() => { const g = new THREE.Group(); scene.add(g); cyl(1.2, 1.2, 1, mat(0xf4e2f0), 24, g, 0, .5, 0); cyl(1.25, 1.25, .2, mat(0x7ab8e8), 24, g, 0, 1, 0); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; cyl(.05, .05, .5, mat(0xffd23f), 6, g, Math.cos(a) * .7, 1.3, Math.sin(a) * .7); sphere(.07, new THREE.MeshBasicMaterial({ color: 0xffc040, toneMapped: false }), g, Math.cos(a) * .7, 1.6, Math.sin(a) * .7, 6, 4); } return g; })();
const BILL = (() => { const p = textPlane(1.4, .7, 140, 70, (c, w, h) => { c.fillStyle = '#7ab87a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a5a2a'; c.lineWidth = 4; c.strokeRect(3, 3, w - 6, h - 6); txt(c, '20 €', w / 2, h / 2, 34, '#1a3a1a'); }); scene.add(p); p.material.side = THREE.DoubleSide; return p; })();
const HAT = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0xffffff, { map: checkTex('#8a6a4a', '#5a4430', 6) }); box(1.5, .36, 1.42, m, .18, g, 0, 0, 0); const pk = box(1.3, .12, .6, m, .06, g, 0, -.16, .84); pk.rotation.x = .18; return g; })();
const CANE = cyl(.08, .08, 3.6, mat(0x5a3a1e), 8, scene);
const DUST = Array.from({ length: 14 }, () => sphere(1, mat(0x9a8a72, { transparent: true, opacity: .5, roughness: 1 }), scene, 0, 0, 0, 8, 6));
const PROPS = [WAGON, ARCH, DTABLE, RADIOP, CAKE, BILL, HAT, CANE, ...DUST, ...ROPE.segs];
// multitudes lejanas instanciadas: personas y Fellriesen
function instCrowd(n, beast) { const bodyG = beast ? new THREE.CylinderGeometry(.5, .3, 15, 6) : new THREE.BoxGeometry(1.8, 3.8, 1); bodyG.translate(0, beast ? 7.5 : 1.9, 0); if (beast) bodyG.rotateX(.25); const headG = beast ? new THREE.SphereGeometry(1.3, 10, 8) : new THREE.BoxGeometry(1.2, 1.2, 1.2); if (beast) headG.scale(.9, 1.3, .95); headG.translate(0, beast ? 16 : 4.5, beast ? 3.6 : 0);
  const bi = new THREE.InstancedMesh(bodyG, new THREE.MeshStandardMaterial({ roughness: 1 }), n), hi = new THREE.InstancedMesh(headG, new THREE.MeshStandardMaterial({ roughness: beast ? 1 : .6 }), n); bi.castShadow = hi.castShadow = true; bi.frustumCulled = hi.frustumCulled = false; scene.add(bi, hi);
  const c = new THREE.Color(), cols = beast ? [0x121010, 0x0e0c0c, 0x161212] : [0xd8323a, 0x2a6ad8, 0x2ec46a, 0xffd23f, 0x9b5de5, 0xff8a23, 0x3a3a4a, 0xf4f4f4, 0x8a5a2a, 0x1fae9a], sk = [0xfbd9c3, 0xc68b5e, 0x8d5a3b, 0xf0c4a2];
  for (let i = 0; i < n; i++) { bi.setColorAt(i, c.set(cols[i % cols.length])); hi.setColorAt(i, c.set(beast ? cols[i % 3] : sk[(i * 7) % 4])); }
  const d = new THREE.Object3D(), P = []; const r = RNG(beast ? 9 : 5); for (let i = 0; i < n; i++) P.push([r(), r(), r()]);
  const at = (list, T, walk = 0) => { bi.visible = hi.visible = true; for (let i = 0; i < n; i++) { if (i >= list.length) d.scale.setScalar(0); else { const [x, z, ry] = list[i], e = P[i][0]; d.scale.setScalar(1); d.position.set(x, walk ? Math.abs(Math.sin(T * 7 + e * 9)) * .25 : 0, z); d.rotation.set(0, ry + (e - .5) * .3, walk ? Math.sin(T * 7 + e * 9) * .05 : 0); } d.updateMatrix(); bi.setMatrixAt(i, d.matrix); hi.setMatrixAt(i, d.matrix); } bi.instanceMatrix.needsUpdate = hi.instanceMatrix.needsUpdate = true; };
  return { bi, hi, at }; }
const PEOPLE = instCrowd(240, false), BEASTI = instCrowd(160, true);  PROPS.push(PEOPLE.bi, PEOPLE.hi, BEASTI.bi, BEASTI.hi);
const chairM = mat(0x6a4426, { roughness: .8 }); const CHAIRS = Array.from({ length: 3 }, () => { const g = new THREE.Group(); scene.add(g); box(2.2, .3, 2.2, chairM, .06, g, 0, 2.15, 0); box(2.2, 2.4, .3, chairM, .06, g, 0, 3.4, -1.0); for (const [x, z] of [[-.9, -.9], [.9, -.9], [-.9, .9], [.9, .9]]) box(.22, 2.1, .22, chairM, .03, g, x, 1.05, z); return g; });
let chairN = 0; const chair = (x, z, ry) => { const c = CHAIRS[chairN++ % CHAIRS.length]; c.visible = true; c.position.set(x, 0, z); c.rotation.set(0, ry, 0); return c; }; PROPS.push(...CHAIRS);
// ---------- utilidades ----------
const SETS = { ST: ST.G, LG: LG, FD: FD, PO: PO.g, WG: WG.g };
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
  for (const k in SETS) SETS[k].visible = false; trees(true); ST.SNOW.visible = false; ROPE.draw([]); for (const b of BEASTS) b.setFace({ open: 0 });
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
const KEY = /^(Stadt|Monster|jeden|mich|warum|Rasen|Haustür|Müllwagen|Menschenzähne|Rein|weg|zwanzig|niemand|fünf|schrie|geschnüffelt|Seite|zwölf|Essen|Briefschlitz|festhält|Rucksack|Vierzig|31|200|Mitte|loslassen|Sekunde|Fuchs|neun|winkte|Händen|vorbei|Mila|sechs|Gras|Geburtstag|Barfuß|Meter|gelacht|schönste|Krämer|fressen|fütterst|Tür|kratzen|klopfen|Zeit|nicken|leer|Vierhundert|Radio|Bergen|Seil|Morgen|Gesicht|vorne|drinnen|Hauptstraße|Hunderte|singen|alle|rette|Nirgendwo|Felder|Haus|leichter|gefolgt|fest|wichtig|glauben|Fünfjährigen|liebten|Besonderes|schlaff|Hände|weiter|Lächelnd|still|berührte)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI, B = BEASTS;
const bface = (b, open = 0) => b.setFace({ open });
const bst = (b, x, z, ry, T, o = {}) => { if (x > 120 && x < 300) trees(false); put(b, x, 0, z, ry); const br = Math.sin(T * 1.3 + b.seed) * .04; applyPose(b, { aLz: .08, aRz: .08, aLx: .15 + br, aRx: .15 - br, aLe: .25, aRe: .25, lean: .38, headX: -.25, headZ: Math.sin(T * .7 + b.seed) * .12, lLk: .15, lRk: .15, lLx: .1, lRx: .1, crouch: .05, ...o }); bface(b, o.open ?? 0); return b; };
// Fellriesen en los céspedes de la Vorstadt, mirando a las puertas
const lawnBeasts = (T, n = 6, from = 0) => { trees(false); for (let i = 0; i < n; i++) { const k = i + from, z = HZ[Math.floor(k / 2) % HZ.length], L = k % 2 === 0; const p = L ? lawnL(z) : lawnR(z); bst(B[i], p.x, p.z, L ? -PI / 2 : PI / 2, T); } };
const hideLawn = () => {};
const holdPack = (ch) => ({ aRx: 1.25, aRe: .9, aLx: 1.25, aLe: .9 });   // manos delante, agarrando la mochila de quien va delante
const kidWalk = (x, z, ry, T, lt, sp = 2.2) => { walkTo(kid, x, z, ry, T, lt, sp); };
const ropeLine = (pts) => ROPE.draw(pts.map(p => p.clone ? p : V(...p)), .25);
const waist = ch => ch.hips.getWorldPosition(V(0, 0, 0)).add(V(0, .3 * (ch.spec.scale || 1), 0));
const fieldCrowd = (z0, n, T, walk = 1) => { const L = []; for (let i = 0; i < n; i++) L.push([FX + (i % 2 ? .9 : -.9) + Math.sin(i) * .3, z0 + 3 + i * 2.4, PI]); PEOPLE.at(L, T, walk); return L; };

// 1 «In dieser Stadt…» — golpe de zoom + swoosh: dron que cae sobre la Vorstadt; un Fellriese en cada césped
shot(0, 'C', null, L => { use('ST'); lawnBeasts(L.T, 6); const k = easeOut(clamp(L.T / .35)); cam([VS + 30, lerp(70, 38, k), lerp(110, 70, k)], [VS, 4, -10], lerp(70, 52, k)); sh(V(VS, 0, 0), 80); },
  [[0, 'zoom_fast', 1], [.15, 'wind', .6], [.6, 'steps_heavy', .4]]);
// 2 …fressen die Monster jeden. — primer plano: la sonrisa de dientes humanos se abre
shot(wt('fressen', 0) - .05, 'F', null, L => { use('ST'); const p = lawnL(HOME); bst(B[0], p.x, p.z, PI / 2, L.T, { open: .2 + .7 * easeOut(clamp(L.lt * 1.4)), headX: .2 }); onFace(B[0], 14, -1.5, 0, 40, L.k, 10); sh(p, 30); }, [[0, 'zoom_in', .6], [.3, 'growl', .9], [.9, 'breath', .5]]);
// 3 Außer mich. — el niño pasa por la acera junto al monstruo, tranquilo
shot(st(2) - .05, 'W', null, L => { use('ST'); const p = lawnR(-18); bst(B[1], VS + 9, -16, -PI / 2 - .5, L.T, { headY: -.6 }); kidWalk(VS + 3, -10, PI, L.T, L.lt, 2.2); face(kid, { mouth: 'smile' }, L.T); cm([VS - 12, 9, -40, VS + 5, 8, -14, 50], [VS - 11, 9, -39, VS + 5, 8, -14, 50], L.k); sh(V(VS, 0, -14), 40); }, [[0, 'steps', .7], [.4, 'cricket', .3], [.8, 'steps', .5]]);
// 4 Sie rühren mich nicht mal an. — se aparta a su paso
shot(st(3), 'Z', null, L => { use('ST'); kidWalk(VS + 3, -26, PI, L.T, L.lt, 2.4); face(kid, { mouth: 'smile', look: [-.6, 0] }, L.T); const k = easeInOut(clamp(L.lt * 1.4)); bst(B[2], VS + lerp(3, 9, k), -34, -PI / 2 + .6, L.T, { lean: .3, headX: .4, lLx: .4 * Math.sin(k * PI) }); const h = kid.root.position; cm([VS - 14, 9, -4, VS + 4, 8, -30, 50], [VS - 13, 9, -5, VS + 4, 8, -30, 50], L.k); sh(V(VS, 0, -28), 40); }, [[0, 'zoom_in', .5], [.3, 'steps_heavy', .8], [.9, 'leaves', .4]]);
// 5 Und niemand weiß, warum. — vecinos tras las ventanas miran asombrados
shot(st(4), 'R', null, L => { use('WG'); inside(.9, .3); for (let i = 0; i < 2; i++) { put(fk[i], WX - 10 + i * 3.4, 0, -10.6, 0); applyPose(fk[i], { aRx: .6, aRe: 1.6 }); face(fk[i], { mouth: 'o', eyes: 'wide', look: [i ? -.5 : .5, 0] }, L.T); } cm([WX - 8.3, 6, 3, WX - 8.3, 4.6, -10.6, 46], [WX - 8.3, 6, 1.8, WX - 8.3, 4.6, -10.6, 44], L.k); badge('tag', 'WARUM?', W / 2, H * .16, L.lt - .3); }, [[0, 'murmur', .5], [.6, 'gasp', .5]]);
// 6 Sie stehen auf jedem Rasen, Tag und Nacht… — travelling por la calle: uno en cada césped
shot(st(5), 'W', null, L => { use('ST'); lawnBeasts(L.T, 8); const z = 30 - L.lt * 10; cam([VS, 8, z + 10], [VS, 6, z - 30], 52); sh(V(VS, 0, z - 20), 70); }, [[0, 'wind', .6], [.5, 'steps_heavy', .4], [1.2, 'crickets', .4]]);
// 7 …und starren auf deine Haustür. — sobre el hombro del monstruo: la puerta
shot(wt('und', 5) + .05, 'S', 'slow', L => { use('ST'); night(); const p = lawnL(-18); bst(B[3], p.x, p.z, -PI / 2, L.T, { headX: .15 }); cam([VS + 10, 12 - L.k, -32 + L.k], [VS - 16, 7, -13], 50); sh(p, 30); }, [[0, 'breath', .6], [.8, 'heartbeat', .5]]);
// 8 Groß wie Müllwagen, — junto a un camión de basura: igual de alto
shot(st(6), 'C', null, L => { use('ST'); const p = lawnR(-42); bst(B[4], p.x - 2, p.z, -PI / 2, L.T); kidWalk(VS + 2, -36, PI, L.T, L.lt, 1.6); face(kid, { mouth: 'flat' }, L.T); cm([VS - 14, 4, -30, VS + 10, 10, -44, 54], [VS - 13, 4, -31, VS + 10, 11, -44, 52], L.k); badge('tag', 'GROSS WIE EIN MÜLLWAGEN', W / 2, H * .16, L.lt - .3); sh(p, 40); }, [[0, 'impact', .5], [.3, 'steps_heavy', .7], [1.0, 'growl', .5]]);
// 9 mit verfilztem Fell… — detalle del pelo con musgo
shot(W2('mit', 6) - .05, 'I', null, L => { use('ST'); const p = lawnL(30); bst(B[5], p.x, p.z, PI / 2 + .4, L.T, { aRx: .4 }); cm([p.x + 12, 1.2, p.z + 8, p.x, 9, p.z, 52], [p.x + 11, 1.2, p.z + 7, p.x, 10, p.z, 50], L.k); sh(p, 20); }, [[0, 'zoom_in', .5], [.3, 'cloth', .6], [.9, 'leaves', .5]]);
// 10 …und einem Lächeln voller flacher Menschenzähne. — la sonrisa (zoom lento)
shot(W2('Lächeln', 6) - .1, 'F', 'slow', L => { use('ST'); const p = lawnL(30); bst(B[5], p.x, p.z, PI / 2, L.T, { open: .3 + .2 * Math.sin(L.T * 2), headX: .25 }); onFace(B[5], 9, -2.4, 0, 36, L.k, 6.5); sh(p, 20); }, [[.2, 'creepy_ting', .6], [.9, 'growl', .5]]);
// 11 Rein können sie nicht. — la mano enorme se detiene ante el umbral
shot(st(7), 'Z', null, L => { use('PO'); inside(1.2, .8); bst(B[6], PX + 7, 3, -PI / 2 - .3, L.T, { aRx: .9, aRe: .2, aRz: -.2 }); cm([PX - 4, 6, 9, PX + 2, 4, 0, 50], [PX - 3, 6, 8, PX + 2, 4, 0, 46], L.k); }, [[0, 'zoom_in', .5], [.3, 'door_creak', .4], [.8, 'breath', .5]]);
// 12 Doch sobald du rausgehst, bist du weg. — un vecino asoma un pie… y desaparece (cámara sacudida)
shot(st(8), 'C', null, L => { use('ST'); const d = doorR(-18); const k = clamp((L.lt - .9) / .3); put(fk[3], d.x - 1.5 - k * 2, 0, d.z, -PI / 2); applyPose(fk[3], { lRx: .6, aLx: .5, aRx: .5 }); face(fk[3], { mouth: k > 0 ? 'shout' : 'smile', eyes: 'wide' }, L.T); if (k >= 1) fk[3].root.visible = false; bst(B[1], d.x - 8, d.z + 2, PI / 2 + (k > 0 ? .4 : 0), L.T, { lean: k * .9, aRx: 1.4 * k, aLx: 1.4 * k, open: k }); cm([VS + 4, 9, d.z - 22, d.x - 4, 7, d.z, 50], [VS + 4.6, 9, d.z - 21, d.x - 4, 7, d.z, 50], L.k); if (k >= 1) badge('red', 'WEG.', W / 2, H * .16, L.lt - 1.2); sh(d, 30); },
  [[0, 'door_open', .6], [.9, 'growl', 1], [1.0, 'impact', .9], [1.3, 'silence_tick', .5]]);
// 13 Deshalb war hier seit zwanzig Jahren niemand mehr draußen. — calle vacía con césped crecido; 20 JAHRE
shot(st(9), 'W', null, L => { use('ST'); lawnBeasts(L.T, 6, 2); cm([VS + 3, 3, 40, VS, 4, -40, 48], [VS + 3, 6, 34, VS, 4, -40, 48], L.k); badge('big', '20 JAHRE', W / 2, H * .16, L.lt - .4); sh(V(VS, 0, 0), 60); }, [[0, 'wind', .8], [.8, 'crickets', .4], [1.8, 'bell_far', .3]]);
// 14 Niemand außer mir. — el niño, solo en medio de la calle
shot(st(10), 'S', null, L => { use('ST'); put(kid, VS, 0, -4, 0); applyPose(kid, { aLz: .2, aRz: .2, headY: Math.sin(L.T) * .2 }); face(kid, { mouth: 'smile' }, L.T); lawnBeasts(L.T, 4); onFace(kid, 9, 1.2, 0, 46, L.k, 7.5); sh(V(VS, 0, 0), 40); }, [[0, 'zoom_out', .5], [.4, 'wind', .5]]);
// 15 Mit fünf lief ich aus Versehen raus. — un niño pequeño (él a los 5) sale por la puerta corriendo
shot(st(11), 'R', null, L => { use('ST'); const d = doorL(HOME); put(kid, d.x + L.lt * 2.4, 0, d.z - .5, PI / 2); kid.root.scale.setScalar(.56); applyPose(kid, runPose(L.T, .9)); face(kid, { mouth: 'grin', eyes: 'happy' }, L.T); cm([d.x + 9, 3.5, d.z + 6, d.x + 2, 2, d.z, 46], [d.x + 8, 3.5, d.z + 5, d.x + 2.5, 2, d.z, 44], L.k); badge('tag', '5 JAHRE ALT', W / 2, H * .16, L.lt - .3); sh(d, 20); }, [[0, 'door_open', .7], [.3, 'run_grass', .7], [.9, 'kids_laugh', .4]]);
// 16 Mama schrie. — Mama en la puerta, gritando
shot(st(12) - .05, 'F', null, L => { use('ST'); const d = doorL(HOME); put(mom, d.x + .4, 0, d.z - .5, PI / 2); applyPose(mom, { aRx: 2.0, aRe: .2, aLx: 2.3, aLe: 2.2, lean: .15 }); face(mom, { mouth: 'shout', eyes: 'wide', brows: -.6 }, L.T); onFace(mom, 7, .4, 1.2, 44, L.k, 5.6); sh(d, 20); }, [[0, 'scream_girl', .6], [.3, 'zoom_fast', .6]]);
// 17 Aber eins von ihnen hat an mir geschnüffelt… — se agacha y lo huele
shot(st(13), 'Z', 'slow', L => { use('ST'); const p = lawnL(HOME); put(kid, p.x + 2, 0, p.z, -PI / 2); kid.root.scale.setScalar(.56); applyPose(kid, { aLz: .3, aRz: .3, headX: -.4 }); face(kid, { mouth: 'o', eyes: 'wide', look: [0, -1] }, L.T); bst(B[0], p.x + 7.5, p.z, -PI / 2, L.T, { lean: .9 * easeOut(clamp(L.lt)), headX: .5, crouch: 1.4 * easeOut(clamp(L.lt)) });
  cm([p.x + 4.5, 8, p.z + 24, p.x + 4.5, 6.5, p.z, 50], [p.x + 4.5, 8, p.z + 22.6, p.x + 4.5, 6.6, p.z, 50], L.k); sh(p, 20); }, [[.2, 'sniff', .9], [.9, 'sniff', .8]]);
// 18 …und ist zur Seite gegangen. — el monstruo se aparta
shot(st(14), 'C', null, L => { use('ST'); const p = lawnL(HOME); put(kid, p.x + 2, 0, p.z, -PI / 2); kid.root.scale.setScalar(.56); applyPose(kid, { aLz: .3, aRz: .3, headX: -.2 }); face(kid, { mouth: 'smile', eyes: 'open' }, L.T); const k = easeInOut(clamp(L.lt / 1.1)); bst(B[0], p.x + 7.5, p.z + k * 6, -PI / 2 + k * .8, L.T, { ...walkPose(L.T, .3 * (k < 1 ? 1 : 0)) });
  cm([p.x + 20, 10, p.z - 14, p.x + 5, 7.5, p.z + 2, 50], [p.x + 19, 10, p.z - 13, p.x + 5, 7.5, p.z + 2, 50], L.k); sh(p, 30); }, [[0, 'steps_heavy', .8], [.6, 'steps_heavy', .7]]);
// 19 Heute bin ich zwölf und habe den wichtigsten Job der Stadt. — el niño (12) con el Bollerwagen en el almacén
shot(st(15), 'W', null, L => { use('LG'); inside(1, .4); put(kid, LX + 1, 0, 2, -.3); applyPose(kid, { aRx: .8, aRe: .3, headY: .2 }); face(kid, { mouth: 'grin' }, L.T); show(WAGON, LX + 4.4, 0, 3, -.3); cm([LX - 4, 6, 12, LX + 2, 4, 1, 48], [LX - 3, 6, 10.5, LX + 2, 4, 1, 44], L.k); badge('big', 'JOB #1', W / 2, H * .16, L.lt - .6); }, [[0, 'wheels', .6], [.6, 'thud', .4], [1.2, 'thud', .5], [2.0, 'paper', .4]]);
// 20 Ich bringe jeder Tür ihr Essen. — tira del carro por la calle entre monstruos
shot(st(16), 'S', null, L => { use('ST'); const z = 20 - L.lt * 3; put(kid, VS + 1, 0, z, PI); applyPose(kid, { ...walkPose(L.T, .5), aRx: .6, aRe: .2, aRz: .3 }); face(kid, { mouth: 'smile' }, L.T); show(WAGON, VS + 1.6, 0, z + 4.6, -PI / 2); lawnBeasts(L.T, 4); cm([VS - 7, 4, z - 7, VS + 1, 3.5, z + 2, 48], [VS - 6, 4, z - 8, VS + 1, 3.5, z + 1, 46], L.k); sh(V(VS, 0, z), 30); }, [[0, 'wheels', .8], [.6, 'steps', .5], [1.2, 'glass_rattle', .3]]);
// 21 Direkt durch den Briefschlitz. — mete un paquete por el buzón; los ojos de dentro
shot(st(17), 'I', null, L => { use('PO'); inside(1.2, .8); put(kid, PX + .6, 0, 2.4, PI); kp(kid, L.lt, [[0, { aRx: 1.0, aRe: .5 }], [.6, { aRx: 1.7, aRe: .4 }]]); face(kid, { mouth: 'smile' }, L.T); cm([PX + 3, 6, 6, PX, 5, 0, 42], [PX + 2.4, 5.8, 5.2, PX, 5.1, 0, 38], L.k); }, [[.4, 'paper', .7], [.8, 'lid_click', .7], [1.2, 'knock', .5]]);
// 22 Und wer sich an mir festhält, den rühren sie auch nicht an. — un vecino agarrado a su mochila pasa junto a un monstruo
shot(st(18), 'Z', null, L => { use('ST'); const z = 4 - L.lt * 2; kidWalk(VS - 2, z + 2, PI, L.T, 0); applyPose(kid, walkPose(L.T, .5)); put(kid, VS - 2, 0, z, PI); face(kid, { mouth: 'smile' }, L.T); put(fk[4], VS - 2, 0, z + 2.9, PI); applyPose(fk[4], { ...walkPose(L.T, .5), ...holdPack() }); face(fk[4], { mouth: 'frown', eyes: 'wide', sweat: 1 }, L.T);
  bst(B[2], VS - 13, z + 2, PI / 2, L.T, { headX: .4 }); cm([VS + 12, 9, z + 9, VS - 5, 7, z, 50], [VS + 11, 9, z + 8, VS - 5, 7, z, 48], L.k); sh(V(VS, 0, z), 30); }, [[0, 'zoom_in', .5], [.3, 'steps', .6], [.9, 'heartbeat', .5], [1.6, 'steps', .5]]);
// 23 Also bezahlen mich die Leute… — le dan billetes; fila de gente
shot(st(19), 'R', null, L => { use('ST'); const d = V(VS + 1.2, 0, -50); put(kid, d.x - 3.9, 0, d.z, PI / 2); applyPose(kid, { aRx: 1.0, aRe: .3 }); face(kid, { mouth: 'grin' }, L.T); put(fk[5], d.x - .4, 0, d.z, -PI / 2); applyPose(fk[5], { aRx: 1.3, aRe: .3 }); face(fk[5], { mouth: 'smile' }, L.T); attach(BILL, fk[5].aR.hand, [0, -.5, .5], [0, 0, 0]);
  cm([d.x - 1.8, 9, d.z + 8, d.x - 1.8, 3.6, d.z, 46], [d.x - 1.8, 8.6, d.z + 7, d.x - 1.8, 3.6, d.z, 44], L.k); sh(d, 20); }, [[0, 'cash', .7], [.5, 'paper', .5], [1.2, 'coins', .6]]);
// 24 Vierzig Euro, um deine Mama gegenüber zu besuchen. — una mujer cruza agarrada; 40 €
shot(st(20), 'W', null, L => { use('ST'); const x = VS - 12 + L.lt * 8; put(kid, x, 0, -66, PI / 2); applyPose(kid, walkPose(L.T, .5)); face(kid, { mouth: 'smile' }, L.T); put(fk[6], x - 3.4, 0, -66, PI / 2); applyPose(fk[6], { ...walkPose(L.T, .5), ...holdPack() }); face(fk[6], { mouth: 'smile', eyes: 'happy' }, L.T);
  bst(B[3], VS + 14, -58, -PI / 2, L.T); cam([x - 1.4, 6, -52], [x - 1.4, 4.4, -66], 50); badge('big', '40 €', W / 2, H * .16, L.lt - .3); sh(V(VS, 0, -66), 30); }, [[0, 'steps', .6], [.4, 'cash_reg', .6], [1.2, 'steps', .5]]);
// 25 Ich war auf 31 Hochzeiten. — boda en un jardín: los novios bajo el arco, el niño en medio
shot(st(21), 'F', null, L => { use('ST'); const c = lawnR(30); show(ARCH, c.x, 0, c.z, -PI / 2); put(kid, c.x - 1, 0, c.z, -PI / 2); applyPose(kid, { aLz: .2, aRz: .2 }); face(kid, { mouth: 'flat', look: [0, .6] }, L.T); put(fk[7], c.x - 1, 0, c.z - 2.2, -PI / 2 + .6); put(fk[8], c.x - 1, 0, c.z + 2.2, -PI / 2 - .6); for (const p of [fk[7], fk[8]]) { applyPose(p, { aLx: 1.2, aLe: .9, aRx: 1.2, aRe: .9 }); face(p, { mouth: 'grin', eyes: 'happy' }, L.T); }
  cm([c.x - 12, 6, c.z, c.x - 1, 4.4, c.z, 44], [c.x - 11, 6, c.z + .6, c.x - 1, 4.4, c.z, 42], L.k); badge('big', '31×', W / 2, H * .16, L.lt - .3); sh(c, 20); }, [[0, 'bells', .5], [.5, 'cheer', .4], [1.0, 'confetti', .5]]);
// 26 Und bei 200 ersten Dates. — mesa de cena en el césped, el niño en medio mirando al suelo
shot(st(22), 'S', null, L => { use('ST'); const c = lawnR(6); show(DTABLE, c.x, 0, c.z, 0); put(kid, c.x, 0, c.z - 2.9, 0); applyPose(kid, { headX: .4, aLz: .1, aRz: .1 }); face(kid, { mouth: 'flat', eyes: 'half', look: [0, 1] }, L.T);
  for (const [i, s] of [[1, -1], [2, 1]]) { sit(fk[i], c.x + s * 3.4, 2.3, c.z, -s * PI / 2, { aRx: .6, aRe: .8 }); face(fk[i], { mouth: 'smile', eyes: 'happy', blush: 1 }, L.T); }
  cm([c.x - 2, 6, c.z + 10, c.x, 4.2, c.z, 46], [c.x - 1, 6, c.z + 9, c.x, 4.2, c.z, 44], L.k); badge('big', '200 DATES', W / 2, H * .16, L.lt - .3); sh(c, 20); }, [[0, 'piano_note', .5], [.5, 'spoon', .5], [1.2, 'laugh_m', .3]]);
// 27 Immer in der Mitte. — plano cenital: él en medio, incómodo
shot(st(23), 'C', null, L => { use('ST'); const c = lawnR(6); show(DTABLE, c.x, 0, c.z, 0); put(kid, c.x, 0, c.z - 2.9, 0); applyPose(kid, { headX: .4 }); face(kid, { mouth: 'flat', eyes: 'half', look: [0, 1], sweat: 1 }, L.T); for (const [i, s] of [[1, -1], [2, 1]]) { sit(fk[i], c.x + s * 3.4, 2.3, c.z, -s * PI / 2, { aRx: .6, aRe: .8 }); face(fk[i], { mouth: 'smile', eyes: 'happy' }, L.T); }
  cm([c.x + 2, 11, c.z + 10, c.x, 2, c.z - .6, 48], [c.x + 2, 10.4, c.z + 9.4, c.x, 2, c.z - .6, 46], L.k); }, [[0, 'zoom_fast', .5], [.3, 'cricket', .4]]);
// 28 Aber du darfst nicht loslassen. — primer plano de manos agarrando la mochila
shot(st(24), 'Z', 'slow', L => { use('ST'); put(kid, VS, 0, -20, PI); put(fk[6], VS, 0, -17.1, PI); applyPose(fk[6], holdPack()); applyPose(kid, {}); face(kid, { mouth: 'flat', brows: .3 }, L.T); const p = kid.props.pack.getWorldPosition(V(0, 0, 0)); cm([VS + 2.6, 7.6, -15.2, VS, 3.6, -19.2, 44], [VS + 2.2, 7.2, -15.6, VS, 3.6, -19.2, 40], L.k); badge('red', 'NICHT LOSLASSEN', W / 2, H * .16, L.lt - .3, 1, .85); sh(p, 20); }, [[0, 'cloth', .6], [.6, 'heartbeat', .6]]);
// 29 Keine Sekunde. — el monstruo de al lado, atento
shot(st(25) - .05, 'F', null, L => { use('ST'); bst(B[2], VS - 8, -18, PI / 2, L.T, { headX: .35, headY: .2 }); onFace(B[2], 12, -1, 2, 40, L.k, 10); }, [[0, 'zoom_in', .6], [.3, 'breath', .6]]);
// 30 Herr Fuchs wollte zu seiner Mutter. — Herr Fuchs con su bastón y su gorra, agarrado
shot(st(26), 'W', null, L => { use('ST'); put(kid, VS - 4, 0, HOME + 2, PI / 2); applyPose(kid, {}); face(kid, { mouth: 'smile' }, L.T); put(fuchs, VS - 6.9, 0, HOME + 2, PI / 2); applyPose(fuchs, { aLx: 1.25, aLe: .9, aRx: .3, aRe: .2 }); face(fuchs, { mouth: 'smile', eyes: 'open', brows: -.3 }, L.T); onFace(fuchs, 8, .6, -4.5, 46, L.k, 7); sh(V(VS, 0, HOME), 20); }, [[0, 'steps', .5], [.6, 'cloth', .4], [1.2, 'birds', .4]]);
// 31 Er hatte sie neun Jahre nicht gesehen. — la anciana tras la ventana de enfrente; 9 JAHRE
shot(st(27), 'R', null, L => { use('ST'); const od = doorR(HOME), wx = od.x - .8, wz = od.z; put(oma, wx, 0, wz, -PI / 2); applyPose(oma, { aRx: 1.2, aRe: 1.4 }); face(oma, { mouth: 'frown', eyes: 'open', brows: -.4, tears: 1 }, L.T); cm([wx - 7, 5.4, wz + 1, wx, 4.4, wz, 40], [wx - 6, 5.4, wz + 1.2, wx, 4.4, wz, 38], L.k); badge('big', '9 JAHRE', W / 2, H * .16, L.lt - .3); sh(V(wx, 0, wz), 20); }, [[0, 'zoom_out', .5], [.4, 'sniff', .5], [1.1, 'clock_tick', .4]]);
// 32 Auf halbem Weg winkte sie ihm aus dem Fenster. — ella saluda desde la ventana
shot(st(28), 'S', null, L => { use('ST'); const od = doorR(HOME), wx = od.x - .8, wz = od.z; put(oma, wx, 0, wz, -PI / 2); applyPose(oma, WAVE(L.T, 5)); face(oma, { mouth: 'grin', eyes: 'happy', tears: 1 }, L.T); put(kid, VS + 2.8, 0, HOME + 2, PI / 2); put(fuchs, VS, 0, HOME + 2, PI / 2); applyPose(fuchs, { aLx: 1.25, aLe: .9, ...walkPose(L.T, .3) }); face(fuchs, { mouth: 'o', eyes: 'wide' }, L.T);
  cm([VS - 8, 6, HOME + 12, wx, 3.6, wz, 46], [VS - 7, 6, HOME + 11, wx, 3.6, wz, 44], L.k); sh(V(VS + 8, 0, HOME), 30); }, [[0, 'wood_creak', .4], [.3, 'cloth', .5], [1.0, 'birds', .4]]);
// 33 Und er winkte zurück. — Herr Fuchs saluda… y suelta la mano
shot(st(29), 'Z', null, L => { use('ST'); put(kid, VS + 2.8, 0, HOME + 2, PI / 2); applyPose(kid, {}); put(fuchs, VS, 0, HOME + 2, PI / 2); applyPose(fuchs, WAVE(L.T, 6)); face(fuchs, { mouth: 'grin', eyes: 'happy', tears: 1 }, L.T); onFace(fuchs, 7, .4, 3.5, 44, L.k, 6); sh(V(VS, 0, HOME), 20); }, [[0, 'zoom_in', .5], [.3, 'cloth', .5]]);
// 34 Mit beiden Händen. — las dos manos en alto; la mochila, suelta (zoom lento)
shot(st(30), 'C', 'slow', L => { use('ST'); put(kid, VS + 2.8, 0, HOME + 2, PI / 2); applyPose(kid, {}); face(kid, { mouth: 'o', eyes: 'wide', look: [-1, 0] }, L.T); put(fuchs, VS, 0, HOME + 2, PI / 2); applyPose(fuchs, { aRx: 2.8, aLx: 2.8, aRz: .3 + Math.sin(L.T * 8) * .25, aLz: .3 - Math.sin(L.T * 8) * .25, aRe: .3, aLe: .3 }); face(fuchs, { mouth: 'grin', eyes: 'happy', tears: 1 }, L.T); show(CANE, VS - .6, 1.2, HOME + 1, 0); CANE.rotation.z = 1.4;
  cm([VS + 1, 5, HOME + 18, VS + 1, 5, HOME + 2, 46], [VS + 1, 5, HOME + 16, VS + 1, 5, HOME + 2, 44], L.k); badge('red', 'BEIDE HÄNDE', W / 2, H * .16, L.lt - .3, 1, .8); sh(V(VS, 0, HOME), 20); }, [[.1, 'thud', .5], [.5, 'cloth', .5]]);
// 35 Sie winkte immer noch, als es vorbei war. — la ventana: ella sigue saludando; abajo, el gorro y el bastón en el asfalto
shot(st(31), 'F', null, L => { use('ST'); const od = doorR(HOME), wx = od.x - .8, wz = od.z; put(oma, wx, 0, wz, -PI / 2); applyPose(oma, WAVE(L.T, 2)); face(oma, { mouth: 'smile', eyes: 'happy' }, L.T); show(HAT, VS + 1, .2, HOME + 2.6, .4); show(CANE, VS - .6, .1, HOME + 1, 0); CANE.rotation.z = PI / 2; bst(B[1], VS - 6, HOME + 3, PI / 2, L.T, { open: .2 });
  cm([VS - 4, 3, HOME + 9, wx, 3.6, wz, 46], [VS - 4, 4, HOME + 9, wx, 3.8, wz, 46], L.k); sh(V(VS + 8, 0, HOME), 30); }, [[0, 'wind', .7], [.6, 'silence_tick', .5], [1.3, 'piano_note', .4]]);
// 36 Meine kleine Schwester Mila ist sechs. — Mila en la cocina, con su peluche
shot(st(32), 'W', null, L => { use('WG'); inside(1, .4); put(mila, WX - 10, 0, -9, .3); applyPose(mila, { aRx: .6, aRe: 1.2, headZ: Math.sin(L.T * 3) * .1 }); face(mila, { mouth: 'grin', eyes: 'happy' }, L.T); onFace(mila, 6, .6, -1, 44, L.k, 4.8); badge('tag', 'MILA, 6', W / 2, H * .16, L.lt - .3); }, [[0, 'kids_laugh', .4], [.6, 'cloth', .4], [1.2, 'clock_tick', .3]]);
// 37 Sie war noch nie draußen. — con la nariz pegada al cristal de la ventana
shot(st(33), 'S', null, L => { use('WG'); inside(1, .4); put(mila, WX + 15, 0, 10, 0); applyPose(mila, { aRx: 1.6, aRe: .3, headX: -.1 }); face(mila, { mouth: 'frown' }, L.T); cm([WX + 11, 5, 3, WX + 16, 3.6, 12, 46], [WX + 11.6, 5, 3.8, WX + 16, 3.6, 12, 42], L.k); }, [[0, 'zoom_in', .4], [.3, 'sigh_kid', .6]]);
// 38 Jeden Tag fragt sie mich, wie sich Gras anfühlt. — le pregunta tirándole de la manga
shot(st(34), 'Z', null, L => { use('WG'); inside(1, .4); put(mila, WX + 6, 0, 2, PI / 2); put(kid, WX + 8.6, 0, 2, -PI / 2); applyPose(mila, { aRx: 1.2, aRe: .2 }); applyPose(kid, { headX: .25 }); talkFace(mila, L.T, L.t0, L.t1, { mouth: 'smile', eyes: 'open' }); face(kid, { mouth: 'smile', look: [0, 1] }, L.T);
  cm([WX + 7.3, 5.4, 11, WX + 7.3, 3.6, 2, 44], [WX + 7.3, 5.4, 9.6, WX + 7.3, 3.6, 2, 42], L.k); bubble(mila, 'WIE FÜHLT SICH GRAS AN?', L.lt - .4, 2); }, [[0, 'cloth', .5], [.8, 'kids_laugh', .3]]);
// 39 Also habe ich sie an ihrem Geburtstag mitgenommen. — la tarta con 6 velas; él le tiende la mochila
shot(st(35), 'I', null, L => { use('WG'); inside(1, .4); show(CAKE, WX - 8, 3.6, -1); chair(WX - 8, 2.6, PI); sit(mila, WX - 8, 3.0, 2.2, PI, { aRx: 2.6, aLx: 2.6, aRe: .3, aLe: .3 }); face(mila, { mouth: 'grin', eyes: 'happy' }, L.T); put(kid, WX - 4, 0, 1, -PI / 2 - .4); applyPose(kid, { aRx: 1.2, aRe: .4 }); face(kid, { mouth: 'grin' }, L.T);
  cm([WX - 6, 7, -8, WX - 7, 4, 1, 46], [WX - 6.4, 7, -7, WX - 7, 4, 1, 44], L.k); badge('big', 'GEBURTSTAG', W / 2, H * .16, L.lt - .3); }, [[0, 'party_horn', .5], [.4, 'ignite', .5], [1.0, 'cheer', .4]]);
// 40 „Beide Hände. Nicht loslassen." — se lo dice serio, de rodillas
shot(st(36), 'F', null, L => { use('ST'); const d = V(VS - 12, 0, HOME - 3); put(kid, d.x + 1.5, 0, d.z - .6, PI / 2); applyPose(kid, { crouch: .8, lLx: 1.2, lLk: 1.5, lRx: .1, lRk: 1.2, aRx: .9, aRe: .4, aLx: .9, aLe: .4 }); talkFace(kid, L.T, L.t0, L.t1, { mouth: 'flat', brows: .3 }); put(mila, d.x + 4, 0, d.z - .6, -PI / 2); applyPose(mila, {}); face(mila, { mouth: 'smile', eyes: 'wide' }, L.T);
  cm([d.x + 2.4, 4, d.z + 8.5, d.x + 2.4, 2.6, d.z - .6, 46], [d.x + 2.4, 4, d.z + 7.6, d.x + 2.4, 2.6, d.z - .6, 44], L.k); bubble(kid, 'BEIDE HÄNDE!', L.lt - .2); sh(d, 20); }, [[0, 'cloth', .5], [.8, 'breath', .4]]);
// 41 „Mach ich nicht." — Mila agarra la mochila con las dos manos, decidida
shot(st(38) - .05, 'C', null, L => { use('ST'); const d = V(VS - 12, 0, HOME - 3); put(kid, d.x + 2, 0, d.z - .6, PI / 2); applyPose(kid, {}); put(mila, d.x - .5, 0, d.z - .6, PI / 2); applyPose(mila, holdPack()); talkFace(mila, L.T, L.t0, L.t1, { mouth: 'grin', brows: .3 }); const mh = hp(mila); cm([mh.x + .2, mh.y + .6, mh.z + 6, mh.x, mh.y - .3, mh.z, 44], [mh.x + .2, mh.y + .5, mh.z + 5, mh.x, mh.y - .3, mh.z, 42], L.k); bubble(mila, 'MACH ICH NICHT!', L.lt - .1, 2); sh(d, 20); }, [[0, 'zoom_in', .5], [.2, 'cloth', .6]]);
// 42 Barfuß stand sie auf unserem Rasen. — los pies descalzos en la hierba
const MP = V(VS - 15, 0, HOME - 2);
const milaLawn = (T, mo = {}) => { put(kid, MP.x - 1.2, 0, MP.z, .15); applyPose(kid, { aLz: .15, aRz: .15 }); put(mila, MP.x + .9, 0, MP.z - .6, -.35); applyPose(mila, { aLx: 1.0, aLe: .6, aLz: -.5, aRz: .2, ...mo }); };
shot(st(39), 'W', null, L => { use('ST'); trees(false); milaLawn(L.T, { lLx: Math.sin(L.T * 4) * .25 }); face(mila, { mouth: 'grin', eyes: 'happy' }, L.T); face(kid, { mouth: 'smile', look: [1, 0] }, L.T); cm([MP.x + .6, 2.4, MP.z + 5.5, MP.x + .6, .9, MP.z - .6, 42], [MP.x + .6, 3.2, MP.z + 5, MP.x + .6, 1.6, MP.z - .6, 44], L.k); badge('tag', 'BARFUSS', W / 2, H * .16, L.lt - .3); sh(MP, 20); }, [[0, 'leaves', .6], [.6, 'kids_laugh', .4], [1.2, 'birds', .4]]);
// 43 Eins von ihnen sah sie aus einem Meter Entfernung an. — el Fellriese se inclina hacia ella (zoom lento)
shot(st(40), 'S', 'slow', L => { use('ST'); trees(false); milaLawn(L.T); face(mila, { mouth: 'o', eyes: 'wide', look: [1, -.8] }, L.T); face(kid, { mouth: 'flat', eyes: 'wide' }, L.T); bst(B[0], MP.x + 4.6, MP.z - 2.5, -PI / 2 + .3, L.T, { lean: .7, headX: .5, headZ: .3 * easeInOut(clamp(L.lt)), crouch: .5 });
  cm([MP.x + 2, 9, MP.z + 22, MP.x + 2.4, 7.5, MP.z - 1, 50], [MP.x + 2, 9, MP.z + 20.5, MP.x + 2.4, 7.5, MP.z - 1, 50], L.k); badge('tag', '1 METER', W / 2, H * .16, L.lt - .6); sh(MP, 20); }, [[0, 'breath', .7], [.9, 'growl', .3], [1.6, 'heartbeat', .6]]);
// 44 Und sie hat nur gelacht und gelacht. — Mila se ríe a carcajadas
shot(st(41), 'F', null, L => { use('ST'); trees(false); milaLawn(L.T, LAUGH(L.T)); face(mila, { mouth: 'grin', eyes: 'happy', blush: 1 }, L.T); face(kid, { mouth: 'grin', look: [1, 0] }, L.T); const mh = hp(mila); cm([mh.x + .3, mh.y + .5, mh.z + 5.5, mh.x, mh.y - .3, mh.z, 42], [mh.x + .3, mh.y + .4, mh.z + 4.6, mh.x, mh.y - .3, mh.z, 40], L.k); sh(MP, 20); }, [[0, 'kids_laugh', .9], [.8, 'kids_laugh', .7]]);
// 45 Es war der schönste Tag meines Lebens. — los dos al atardecer; el monstruo al fondo
shot(st(42), 'R', null, L => { use('ST'); trees(false); dusk(); milaLawn(L.T); face(kid, { mouth: 'grin', eyes: 'happy', tears: 1 }, L.T); face(mila, { mouth: 'grin', eyes: 'happy' }, L.T); bst(B[0], MP.x + 6, MP.z - 9, -.3, L.T);
  const a = -.25 + L.k * .5; cam([MP.x + Math.sin(a) * 9, 4.2, MP.z + Math.cos(a) * 9], [MP.x, 3.6, MP.z - .3], 46); sh(MP, 30); }, [[0, 'piano_note', .5], [.8, 'birds', .4], [1.6, 'piano_note', .4]]);
// 46 Nur einer mag mich nicht: — puerta de Herr Krämer con el buzón
shot(st(43), 'Z', null, L => { use('PO'); inside(1.2, .8); PO.eyes.visible = false; put(kid, PX + 1, 0, 3, PI + .3); applyPose(kid, { aRx: .4, aRe: .3 }); face(kid, { mouth: 'flat', look: [-.3, 0] }, L.T); cm([PX + 6, 6, 10, PX, 5, 0, 46], [PX + 5, 6, 9, PX, 5, 0, 44], L.k); }, [[0, 'zoom_in', .5], [.3, 'steps', .5], [1.0, 'wind', .4]]);
// 47 …der alte Herr Krämer. — los ojos y las cejas blancas por la ranura (zoom lento)
shot(st(44), 'C', 'slow', L => { use('PO'); inside(1.2, .8); put(kid, PX + 1, 0, 3, PI); cm([PX + .3, 5.4, 4, PX, 5.2, 0, 34], [PX + .1, 5.3, 2.8, PX, 5.2, 0, 30], L.k); badge('tag', 'HERR KRÄMER', W / 2, H * .16, L.lt - .2); }, [[0, 'metal_creak', .5], [.4, 'breath', .5]]);
// 48 Er redet nur durch seinen Briefschlitz. — el niño se agacha a la altura del buzón
shot(st(45), 'W', null, L => { use('PO'); inside(1.2, .8); put(kid, PX + .3, 0, 2.6, PI); applyPose(kid, { crouch: .6, lean: .3, lLx: .8, lRx: .8, lLk: 1.2, lRk: 1.2, headX: .1 }); face(kid, { mouth: 'flat', eyes: 'open' }, L.T); cm([PX + 5, 5, 6, PX, 4.8, 1, 44], [PX + 4.4, 5, 5.4, PX, 4.8, 1, 42], L.k); }, [[0, 'cloth', .5], [.6, 'lid_click', .5]]);
// 49 „Wäre ich einer von denen, würde ich dich zuerst fressen, Junge." — bocadillo desde la ranura
shot(st(46), 'S', null, L => { use('PO'); inside(1.2, .8); put(kid, PX + .3, 0, 2.6, PI); applyPose(kid, { crouch: .6, lean: .3, lLx: .8, lRx: .8, lLk: 1.2, lRk: 1.2 }); face(kid, { mouth: 'o', eyes: 'wide', brows: -.4 }, L.T); const k = L.k; cam([PX - 2.6 + k, 5.4, 3.6], [PX + .3, 4.6, 2.6], 44); BAD.push({ kind: 'bubble', text: 'ICH WÜRDE DICH ZUERST FRESSEN.', x: W / 2, y: H * .22, s: spring(clamp(L.lt - .3) * 1.6), a: 1, on: L.lt > .3 }); }, [[0, 'whisper', .7], [1.6, 'creepy_ting', .5]]);
// 50 „Du fütterst uns doch alle." — la ranura con los ojos, el carro en el escalón
shot(st(47), 'F', null, L => { use('PO'); inside(1.2, .8); show(WAGON, PX + 3, .6, 2.4, -.5); cm([PX + 1.4, 5.4, 3.4, PX, 5.2, 0, 34], [PX + 1, 5.3, 2.6, PX, 5.2, 0, 30], L.k); BAD.push({ kind: 'bubble', text: 'DU FÜTTERST UNS ALLE.', x: W / 2, y: H * .22, s: spring(clamp(L.lt - .1) * 1.6), a: 1, on: L.lt > .1 }); }, [[0, 'zoom_in', .5], [.5, 'whisper', .6]]);
// 51 Aber dann fielen mir Dinge auf. — el niño, pensativo, mira a los monstruos de la calle
shot(st(48), 'R', null, L => { use('ST'); put(kid, VS - 2, 0, -30, -.4); applyPose(kid, { aRx: 2.0, aRe: 2.1, aRz: -.4, headX: .15 }); face(kid, { mouth: 'flat', brows: -.4, look: [-.6, 0] }, L.T); lawnBeasts(L.T, 6, 4); onFace(kid, 6, .6, -2, 44, L.k, 5); sh(V(VS, 0, -30), 40); }, [[0, 'tension_str', .4], [.6, 'hmm', .5]]);
// 52 In sieben Jahren hat keins von ihnen je eine Tür probiert. — la mano del monstruo pasa junto a un pomo sin tocarlo; 7 JAHRE
shot(st(49), 'Z', null, L => { use('ST'); const d = doorR(-66); bst(B[4], d.x - 4.5, d.z, PI / 2 + PI, L.T, { aRx: .7, aRe: .3, headX: .3 }); B[4].root.rotation.y = PI / 2; cm([d.x - 22, 10, d.z - 10, d.x - 3, 7.5, d.z, 50], [d.x - 21, 10, d.z - 9, d.x - 3, 7.5, d.z, 50], L.k); badge('big', '7 JAHRE', W / 2, H * .16, L.lt - .3); sh(d, 20); }, [[0, 'zoom_in', .5], [.6, 'breath', .5], [1.6, 'clock_tick', .4]]);
// 53 Sie kratzen nicht. — garra quieta junto a la puerta
shot(st(50), 'C', null, L => { use('PO'); inside(1.2, .8); PO.eyes.visible = false; bst(B[6], PX + 5.6, 3.4, -PI / 2, L.T, { aRx: .4, aRe: .2, aRz: -.35 }); cm([PX - 4, 9, 23, PX + 3, 7.5, 1, 50], [PX - 3.6, 9, 22, PX + 3, 7.5, 1, 50], L.k); badge('tag', 'KEIN KRATZEN', W / 2, H * .16, L.lt - .1); }, [[0, 'impact_soft', .4], [.3, 'silence_tick', .6]]);
// 54 Sie klopfen nicht. — la puerta, silencio
shot(st(51), 'F', null, L => { use('PO'); inside(1.2, .8); PO.eyes.visible = false; bst(B[6], PX + 4.6, 5, -PI / 2 - .4, L.T, { headX: .3 }); cm([PX - 3, 5, 9, PX, 4.5, 0, 46], [PX - 2.6, 5, 8.4, PX, 4.5, 0, 44], L.k); badge('tag', 'KEIN KLOPFEN', W / 2, H * .16, L.lt - .1); }, [[0, 'silence_tick', .6], [.4, 'clock_tick', .4]]);
// 55 Sie stehen nur da, als hätten sie alle Zeit der Welt. — timelapse: el sol cruza, ellos no se mueven
shot(st(52), 'S', null, L => { use('ST'); const k = L.k; if (k < .5) day(); else dusk(); lawnBeasts(L.T * 0, 6); cm([VS - 8, 12, 50, VS, 6, -20, 50], [VS - 6, 13, 46, VS, 6, -20, 50], k); sun.position.x += (k - .5) * 200; badge('tag', '⏳', W / 2, H * .16, L.lt - .3); }, [[0, 'clock_spin', .6], [1.2, 'wind', .5]]);
// 56 Und wenn ich vorbeigehe, nicken sie mir zu. — el monstruo asiente
shot(st(53), 'Z', null, L => { use('ST'); kidWalk(VS + 2, -84, 0, L.T, L.lt, 1.8); face(kid, { mouth: 'flat', look: [-1, 0] }, L.T); const p = lawnL(-90); bst(B[5], p.x + 1, p.z + 3, PI / 2, L.T, { headX: .3 + Math.max(0, Math.sin(L.lt * 5)) * .35, headY: .4 }); cm([VS + 10, 7, -78, VS - 6, 6, -86, 50], [VS + 9, 7, -77, VS - 6, 6, -86, 48], L.k); sh(V(VS - 4, 0, -86), 30); }, [[0, 'zoom_in', .4], [.5, 'creepy_ting', .5], [1.1, 'steps', .4]]);
// 57 Letzten Herbst war das Lager leer. — estanterías vacías, el carro vacío
shot(st(54), 'W', null, L => { use('LG'); inside(.8, .3); put(kid, LX + 14, 0, -6, PI); applyPose(kid, { aRx: 1.0, aRe: .3, headX: -.2 }); face(kid, { mouth: 'frown', eyes: 'wide' }, L.T); show(WAGON, LX + 11, 0, -4, 0); cm([LX + 8, 6, 6, LX + 14, 6, -12, 46], [LX + 8.6, 6, 5, LX + 14, 6, -12, 44], L.k); badge('red', 'LEER', W / 2, H * .16, L.lt - .3, 1, .8); }, [[0, 'wind', .5], [.4, 'metal_creak', .5], [1.0, 'sad_tone', .5]]);
// 58 Vierhundert Menschen und nichts mehr zu essen. — caras tristes tras las ventanas; 400
shot(st(55), 'S', null, L => { use('ST'); cm([VS - 2, 10, 40, VS, 5, -60, 50], [VS - 2, 9, 34, VS, 5, -60, 50], L.k); lawnBeasts(L.T, 8); for (let i = 0; i < 4; i++) { const d = i % 2 ? doorR(HZ[i]) : doorL(HZ[i]); put(fk[i], d.x + (i % 2 ? -.8 : .8), 0, d.z, i % 2 ? -PI / 2 : PI / 2); face(fk[i], { mouth: 'frown', brows: -.5 }, L.T); applyPose(fk[i], { headX: .3, aRx: .4, aRe: 1.8 }); } badge('big', '400', W / 2, H * .16, L.lt - .3); sh(V(VS, 0, 0), 60); }, [[0, 'stomach', .6], [.7, 'sigh', .5], [1.5, 'wind', .5]]);
// 59 Im Radio hieß es: — la radio en la cocina, Mama y Mila escuchan
shot(st(56), 'I', null, L => { use('WG'); inside(1, .4); show(RADIOP, WX - 8, 4.4, -1, 0); chair(WX - 8, -3.4, 0); sit(mom, WX - 8, 2.3, -3.6, 0, { lean: .2, headX: .2 }); face(mom, { mouth: 'o', eyes: 'wide' }, L.T); put(mila, WX - 5, 0, -2.6, -.6); applyPose(mila, { headX: .2 }); face(mila, { mouth: 'o' }, L.T); RADIOP.userData.led.visible = true;
  cm([WX - 6, 6.4, 5, WX - 7.6, 4.6, -1.6, 44], [WX - 6.4, 6.2, 4, WX - 7.6, 4.6, -1.6, 40], L.k); }, [[0, 'tv_static', .7], [.4, 'radio', .7]]);
// 60 Hinter den Bergen gibt es Essen. — montañas al horizonte desde un tejado
shot(st(57), 'Z', null, L => { use('ST'); cm([VS + 10, 30, 70, VS - 80, 40, -600, 44], [VS + 10, 32, 66, VS - 80, 44, -600, 42], L.k); put(kid, VS + 3, 0, 50, PI + .4); applyPose(kid, { aRx: 2.4, aRe: .2 }); face(kid, { mouth: 'o' }, L.T); badge('tag', 'ESSEN ➜', W / 2, H * .16, L.lt - .3); sh(V(VS, 0, 40), 40); }, [[0, 'zoom_in', .5], [.3, 'radio', .5], [.9, 'wind', .5]]);
// 61 Und keine Monster. — campos vacíos sin monstruos; KEINE MONSTER
shot(st(58), 'F', null, L => { use('FD'); day(); cm([FX + 6, 6, 40, FX, 6, -200, 50], [FX + 6, 6.4, 36, FX, 6, -200, 50], L.k); fieldCrowd(10, 0, L.T); badge('red', 'KEINE MONSTER', W / 2, H * .16, L.lt - .3, 1, .8); put(kid, FX + 5.4, 0, 28, PI + .5); applyPose(kid, { aRx: 2.6, aLx: 2.6 }); face(kid, { mouth: 'grin', eyes: 'happy' }, L.T); }, [[0, 'birds', .6], [.5, 'wind', .5]]);
// 62 Also banden wir mir das längste Seil der Stadt um den Bauch. — Mama le ata la cuerda
shot(st(59), 'W', null, L => { use('WG'); inside(1, .4); put(kid, WX + 4, 0, 2, -PI / 2); applyPose(kid, { aLz: .9, aRz: .9, aLe: .2, aRe: .2 }); face(kid, { mouth: 'flat', brows: .3 }, L.T); put(mom, WX + 1.1, 0, 2, PI / 2); applyPose(mom, { aRx: 1.3, aRe: 1.6 + Math.sin(L.T * 9) * .2, aLx: 1.3, aLe: 1.6 - Math.sin(L.T * 9) * .2, lean: .2 }); face(mom, { mouth: 'frown', brows: -.4, look: [0, .6] }, L.T);
  const w = waist(kid); ropeLine([w.clone().add(V(-.6, 0, -.8)), w.clone().add(V(-.6, 0, .8)), w.clone().add(V(-2, -1.4, 2)), w.clone().add(V(-3, -2.6, 5))]); cm([WX + 2.8, 7, -6, WX + 2.8, 4, 2, 46], [WX + 2.8, 7, -5, WX + 2.8, 4, 2, 44], L.k); badge('tag', 'DAS LÄNGSTE SEIL', W / 2, H * .16, L.lt - .6); }, [[0, 'tug', .5], [.3, 'tug', .7], [1.2, 'strain', .4], [2.0, 'tug', .5]]);
// 63 Wer das Seil hält, hält mich. — primer plano de manos sobre la cuerda
shot(st(60), 'S', 'slow', L => { use('ST'); put(kid, VS, 0, 10, PI); for (let i = 0; i < 3; i++) { put(fk[i], VS + (i % 2 ? .6 : -.6), 0, 13.2 + i * 3, PI); applyPose(fk[i], { aRx: 1.1, aRe: .8, aLx: 1.1, aLe: .8 }); face(fk[i], { mouth: 'flat', eyes: 'wide' }, L.T); } const w = waist(kid); ropeLine([w, w.clone().add(V(0, -.2, 3)), w.clone().add(V(0, -.3, 6)), w.clone().add(V(0, -.3, 9))]);
  cm([VS + 5, 10, 16, VS, 3, 13, 46], [VS + 4.4, 9.4, 15.6, VS, 3, 13, 44], L.k); sh(V(VS, 0, 12), 20); }, [[0, 'tug', .6], [.8, 'heartbeat', .5]]);
// 64 Am nächsten Morgen ging zum ersten Mal seit zwanzig Jahren jede Tür auf. — se abren todas las puertas
shot(st(61), 'C', null, L => { use('ST'); const k = easeOut(clamp(L.lt / 1.5)); for (let i = 0; i < 8; i++) { const z = HZ[Math.floor(i / 2)], d = i % 2 ? doorR(z) : doorL(z); put(fk[i], d.x + (i % 2 ? -1 : 1) * k * 3, 0, d.z, i % 2 ? -PI / 2 : PI / 2); applyPose(fk[i], walkPose(L.T + i, .4 * (k < 1 ? 1 : 0))); face(fk[i], { mouth: 'o', eyes: 'wide' }, L.T); } lawnBeasts(L.T, 8);
  cm([VS, 18, 50, VS, 2, -40, 50], [VS, 15, 44, VS, 2, -40, 50], L.k); badge('big', 'ALLE TÜREN AUF', W / 2, H * .16, L.lt - .6, 1, .8); sh(V(VS, 0, 0), 80); }, [[0, 'door_open', .8], [.3, 'door_open', .6], [.7, 'door_open', .5], [1.2, 'murmur', .6], [2.4, 'birds', .4]]);
// 65 Nachbarn sahen sich zum ersten Mal ins Gesicht. — dos vecinas se miran, se tapan la boca, se abrazan
shot(st(62), 'Z', null, L => { use('ST'); put(fk[2], VS - 1.8, 0, 0, PI / 2); put(fk[5], VS + 1.8, 0, 0, -PI / 2); const k = clamp((L.lt - .8) * 2); for (const [p, s] of [[fk[2], 1], [fk[5], -1]]) { applyPose(p, k > 0 ? { aRx: 1.5 * k, aRe: 1.4, aRz: -.5, aLx: 1.5 * k, aLe: 1.4, aLz: -.5 } : { aRx: 2.2, aRe: 2.3, aRz: -.4 }); face(p, { mouth: k > 0 ? 'grin' : 'o', eyes: k > 0 ? 'happy' : 'wide', tears: 1 }, L.T); }
  fk[2].root.position.x += k * .35; fk[5].root.position.x -= k * .35; cm([VS, 5.4, 13, VS, 4.4, 0, 46], [VS, 5.4, 11.6, VS, 4.4, 0, 44], L.k); sh(V(VS, 0, 0), 20); }, [[0, 'gasp', .6], [.8, 'hug', .7], [1.4, 'cry_girl', .3]]);
// 66 Alle vierhundert an einem Seil. — la fila larguísima por la calle (dron)
shot(st(63), 'W', null, L => { use('ST'); const L2 = []; for (let i = 0; i < 200; i++) L2.push([VS + (i % 2 ? .9 : -.9), 6.5 + i * 2.4, PI]); PEOPLE.at(L2, L.T, 1); put(kid, VS, 0, 4, PI); applyPose(kid, walkPose(L.T, .4)); ropeLine([waist(kid), V(VS, 2, 40), V(VS, 2, 120), V(VS, 2, 300)]);
  cm([VS + 26, 50, -20, VS, 0, 60, 56], [VS + 24, 46, -10, VS, 0, 60, 56], L.k); badge('big', '400', W / 2, H * .16, L.lt - .3); sh(V(VS, 0, 40), 100); }, [[0, 'crowd_run', .5], [.6, 'steps', .6], [1.3, 'murmur', .5]]);
// 67 Ich vorne. — el niño en cabeza, decidido
shot(st(64), 'C', null, L => { use('ST'); put(kid, VS, 0, -L.lt * 2, PI); applyPose(kid, walkPose(L.T, .45)); face(kid, { mouth: 'flat', brows: .4 }, L.T); put(mila, VS, 0, 2.6 - L.lt * 2, PI); applyPose(mila, { ...walkPose(L.T + .2, .45), ...holdPack() }); face(mila, { mouth: 'smile' }, L.T); onFace(kid, 7, .3, 0, 44, L.k, 6); sh(V(VS, 0, 0), 20); }, [[0, 'zoom_fast', .6], [.2, 'steps', .6]]);
// 68 Mila direkt hinter mir. — Mila con las dos manos en la mochila
shot(st(65), 'F', null, L => { use('ST'); put(kid, VS, 0, -L.lt * 2, PI); applyPose(kid, walkPose(L.T, .45)); put(mila, VS, 0, 2.6 - L.lt * 2, PI); applyPose(mila, { ...walkPose(L.T + .2, .45), ...holdPack() }); face(mila, { mouth: 'grin', eyes: 'happy' }, L.T); const mh = hp(mila); cm([mh.x + 5.5, mh.y + 1, mh.z + 1.5, mh.x, mh.y - .3, mh.z, 44], [mh.x + 4.8, mh.y + .9, mh.z + 1.3, mh.x, mh.y - .3, mh.z, 42], L.k); sh(V(VS, 0, 0), 20); }, [[0, 'steps', .5], [.6, 'kids_laugh', .3]]);
// 69 Nur Herr Krämer blieb drinnen. — su puerta, la única cerrada
shot(st(66), 'W', null, L => { use('PO'); inside(1.2, .8); PO.eyes.visible = true; PEOPLE.at([...Array(30)].map((_, i) => [PX - 12 + i * .9, 14 + (i % 2) * 1.6, -PI / 2]), L.T, 1); cm([PX + 6, 6, 12, PX, 5, 0, 48], [PX + 5, 6, 11, PX, 5, 0, 46], L.k); }, [[0, 'steps', .5], [.6, 'murmur', .4]]);
// 70 „Tu's nicht, Junge." — los ojos por la ranura
shot(st(67), 'Z', 'slow', L => { use('PO'); inside(1.2, .8); PO.eyes.visible = true; cm([PX + .3, 5.4, 3.6, PX, 5.2, 0, 32], [PX + .1, 5.3, 2.6, PX, 5.2, 0, 28], L.k); BAD.push({ kind: 'bubble', text: "TU'S NICHT, JUNGE.", x: W / 2, y: H * .24, s: spring(clamp(L.lt - .1) * 1.6), a: 1, on: L.lt > .1 }); }, [[0, 'whisper', .7]]);
// 71 Wir liefen über die Hauptstraße, und Hunderte traten zur Seite. — calle principal: la fila avanza, cientos de monstruos se apartan a los lados
shot(st(68), 'S', null, L => { use('ST'); const z = -20 - L.lt * 4; put(kid, 0, 0, z, PI); applyPose(kid, walkPose(L.T, .45)); face(kid, { mouth: 'smile' }, L.T); put(mila, 0, 0, z + 2.6, PI); applyPose(mila, { ...walkPose(L.T + .2, .45), ...holdPack() }); face(mila, { mouth: 'grin', eyes: 'happy' }, L.T);
  const pl = []; for (let i = 0; i < 160; i++) pl.push([(i % 2 ? .9 : -.9), z + 5 + i * 2.4, PI]); PEOPLE.at(pl, L.T, 1); ropeLine([waist(kid), V(0, 2, z + 30), V(0, 2, z + 200)]);
  const bl = []; for (let i = 0; i < 70; i++) bl.push([(i % 2 ? 1 : -1) * (12 + (i % 3) * 3), z - 30 + i * 4, (i % 2 ? -1 : 1) * PI / 2]); BEASTI.at(bl, L.T); for (let i = 0; i < 4; i++) bst(B[i], (i % 2 ? 1 : -1) * 9, z - 6 - i * 5, (i % 2 ? -1 : 1) * PI / 2, L.T);
  cm([0, 22, z - 30, 0, 4, z + 10, 54], [0, 20, z - 28, 0, 4, z + 8, 54], L.k); sh(V(0, 0, z), 60); }, [[0, 'crowd_run', .6], [.5, 'steps_heavy', .6], [1.4, 'steps', .5], [2.4, 'murmur', .5]]);
// 72 Jemand fing an zu singen. — un vecino canta
shot(st(69), 'Z', null, L => { use('ST'); put(fk[3], 0, 0, -6, PI); applyPose(fk[3], { ...walkPose(L.T, .4), ...holdPack(), headX: -.2 }); talkFace(fk[3], L.T, L.t0 - 9, L.t1 + 9, { mouth: 'o', eyes: 'happy' }); onFace(fk[3], 6, .4, 2, 44, L.k, 5); bubble(fk[3], '♪ ♫', L.lt - .2); }, [[0, 'choir', .5], [.6, 'steps', .4]]);
// 73 Dann sangen alle. — plano general, todos cantando
shot(st(70), 'W', null, L => { use('ST'); for (let i = 0; i < 6; i++) { put(fk[i], (i % 2 ? 1.1 : -1.1), 0, -14 + i * 2.8, PI); applyPose(fk[i], { ...walkPose(L.T + i * .1, .4), ...holdPack(), headX: -.2 }); face(fk[i], { mouth: 'o', eyes: 'happy' }, L.T); } cm([6, 6, -20, 0, 4.4, -6, 50], [5, 6, -18, 0, 4.4, -6, 48], L.k); bubble(fk[1], '♪', L.lt - .1); bubble(fk[4], '♫', L.lt - .3); }, [[0, 'choir', .8], [.6, 'cheer', .3]]);
// 74 Und endlich wusste ich, warum sie mich verschont hatten: — el niño, emocionado, mira atrás
shot(st(71), 'R', null, L => { use('ST'); put(kid, 0, 0, -20, PI); applyPose(kid, { ...walkPose(L.T, .4), headY: .7 }); face(kid, { mouth: 'grin', eyes: 'happy', tears: 1, look: [1, 0] }, L.T); onFace(kid, 6, .4, -2, 44, L.k, 5); }, [[0, 'choir', .5], [.6, 'piano_note', .5]]);
// 75 damit ich alle rette. — sonrisa heroica, contraluz
shot(st(72), 'F', 'slow', L => { use('ST'); dusk(); put(kid, 0, 0, -26, PI); applyPose(kid, walkPose(L.T, .4)); face(kid, { mouth: 'grin', eyes: 'open', brows: .2 }, L.T); const h = hp(kid); cam([h.x + 1, h.y - 2, h.z - 6], [h.x, h.y, h.z], 44); badge('big', 'HELD?', W / 2, H * .16, L.lt - .3); }, [[0, 'choir', .5], [.5, 'sunrise_shine', .4]]);
// 76 Bei Sonnenuntergang waren wir im Nirgendwo. — campos al atardecer, la fila por el camino
shot(st(73), 'W', null, L => { use('FD'); dusk(); put(kid, FX, 0, -L.lt * 3, PI); applyPose(kid, walkPose(L.T, .4)); const fl = fieldCrowd(-L.lt * 3, 150, L.T); ropeLine([waist(kid), V(FX, 2, 40), V(FX, 2, 240)]); cm([FX + 40, 30, -30, FX, 0, 40, 54], [FX + 36, 28, -26, FX, 0, 40, 54], L.k); sh(V(FX, 0, 20), 80); }, [[0, 'wind', .7], [.5, 'choir', .3], [1.4, 'steps', .4]]);
// 77 Nur Felder. 78 Kein Haus. 79 Keine Tür. — tres golpes de plano
shot(st(74), 'C', null, L => { use('FD'); dusk(); cm([FX - 31, 5, 3, FX - 40, 3.4, -7, 50], [FX - 31.5, 5, 2, FX - 40, 3.4, -7, 48], L.k); put(kid, FX - 40, 0, -7, -PI / 2 - .3); applyPose(kid, walkPose(L.T, .3)); face(kid, { mouth: 'flat' }, L.T); }, [[0, 'zoom_fast', .6], [.2, 'wind', .6]]);
shot(st(75), 'C', null, L => { use('FD'); dusk(); cm([FX + 32, 4, 9, FX + 38, 2.2, 2, 48], [FX + 32.5, 4, 8.4, FX + 38, 2.2, 2, 46], L.k); put(mila, FX + 38, 0, 2, PI / 2 + .8); applyPose(mila, holdPack()); face(mila, { mouth: 'flat', look: [1, 0] }, L.T); badge('tag', 'KEIN HAUS', W / 2, H * .16, L.lt - .1); }, [[0, 'zoom_fast', .6], [.2, 'wind', .5]]);
shot(st(76), 'F', 'slow', L => { use('FD'); dusk(); put(kid, FX, 0, 0, PI); applyPose(kid, walkPose(L.T, .3)); face(kid, { mouth: 'flat', eyes: 'wide' }, L.T); onFace(kid, 8, .6, 0, 44, L.k, 6); badge('red', 'KEINE TÜR', W / 2, H * .16, L.lt - .1, 1, .8); }, [[0, 'heartbeat', .6]]);
// 80 Und das Seil wurde leichter. — la cuerda tensa se afloja
shot(st(77), 'Z', null, L => { use('FD'); dusk(); put(kid, FX, 0, 0, PI); applyPose(kid, walkPose(L.T, .3)); const w = waist(kid); const sag = .2 + L.k * 1.6; ROPE.draw([w, w.clone().add(V(0, -.6, 3)), w.clone().add(V(0, -1.2, 6)), w.clone().add(V(0, -1.4, 10))], sag); cm([FX + 5, 4, 9, FX, 2, 3, 44], [FX + 4.4, 3.8, 8.4, FX, 2, 3, 42], L.k); }, [[0, 'zoom_in', .5], [.4, 'tug', .5], [.8, 'tension_str', .5]]);
// 81 Hinten hörte jemand auf zu singen. 82 Dann noch jemand. — el final de la fila se queda en silencio
shot(st(78), 'S', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; const fl = fieldCrowd(0, 40, L.T); cm([FX + 14, 12, 100, FX, 3, 50, 50], [FX + 14, 12, 98, FX, 3, 50, 48], L.k); badge('tag', '♪ …', W / 2, H * .16, L.lt - .2); }, [[0, 'choir', .3], [.8, 'silence_tick', .6]]);
shot(st(79), 'C', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; fieldCrowd(0, 30, L.T); cm([FX - 14, 10, 70, FX, 3, 30, 50], [FX - 14, 10, 68, FX, 3, 30, 48], L.k); }, [[0, 'zoom_fast', .5], [.2, 'wind', .5]]);
// 83 Ich drehte mich um. — el niño se gira
shot(st(80), 'W', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, PI + PI * easeInOut(clamp(L.lt * 1.5))); applyPose(kid, {}); face(kid, { mouth: 'flat', eyes: 'wide' }, L.T); onFace(kid, 6, .4, 0, 44, L.k, 5); }, [[0, 'cloth', .6], [.4, 'heartbeat', .7]]);
// 84 Sie waren uns gefolgt. 85 Alle. — detrás, a lo lejos, cientos de Fellriesen en los campos (zoom lento)
shot(st(81), 'C', 'slow', L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; fieldCrowd(0, 60, L.T, 0); const bl = []; for (let i = 0; i < 160; i++) bl.push([FX + (i % 2 ? 1 : -1) * (10 + (i * 7) % 60), 40 + Math.floor(i / 2) * 3, PI]); BEASTI.at(bl, L.T); for (let i = 0; i < 4; i++) bst(B[i], FX + (i % 2 ? 1 : -1) * (8 + i * 3), 30 + i * 4, PI, L.T, { open: .3 });
  cm([FX, 10, -12, FX, 8, 60, 52], [FX, 10, -10, FX, 8.5, 60, 50], L.k); }, [[0, 'growl', .7], [.6, 'steps_heavy', .6]]);
shot(st(82) - .05, 'F', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; const bl = []; for (let i = 0; i < 160; i++) bl.push([FX + (i % 2 ? 1 : -1) * (6 + (i * 7) % 80), 30 + Math.floor(i / 2) * 3, PI]); BEASTI.at(bl, L.T); cm([FX, 40, -10, FX, 0, 60, 56], [FX, 44, -12, FX, 0, 60, 56], L.k); badge('red', 'ALLE.', W / 2, H * .16, L.lt - .05, 1, .9); }, [[0, 'impact', .8], [.1, 'growl', .6]]);
// 86 „Haltet euch fest!", schrie ich. — grita
shot(st(83), 'Z', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, 0); applyPose(kid, { aRx: 2.4, aRe: .2, aLx: 1, aLe: .5, lean: .15 }); talkFace(kid, L.T, L.t0, L.t0 + .9, { mouth: 'shout', eyes: 'wide', brows: .6 }); onFace(kid, 6, .4, 1, 44, L.k, 4.8); bubble(kid, 'HALTET EUCH FEST!', L.lt - .1); }, [[0, 'shout_m', .4], [.3, 'zoom_fast', .6]]);
// 87 Sie hielten sich fest. — manos en la cuerda, apretando
shot(st(84), 'S', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; for (let i = 0; i < 3; i++) { put(fk[i], FX + (i % 2 ? .6 : -.6), 0, 3 + i * 3, PI); applyPose(fk[i], { aRx: 1.1, aRe: .8, aLx: 1.1, aLe: .8 }); face(fk[i], { mouth: 'frown', eyes: 'wide', sweat: 1 }, L.T); } ROPE.draw([V(FX, 3.4, 1), V(FX, 3.4, 6), V(FX, 3.4, 10)], .1); cm([FX + 5, 10, 6, FX, 3.4, 5, 46], [FX + 4.6, 9.6, 6, FX, 3.4, 5, 44], L.k); }, [[0, 'tug', .7], [.5, 'breath', .5]]);
// 88 Es war nie wichtig. — el monstruo junto a un vecino agarrado, sonriendo (golpe)
shot(st(85), 'C', 'slow', L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(fk[2], FX, 0, 4, PI); applyPose(fk[2], { aRx: 1.1, aRe: .8, aLx: 1.1, aLe: .8 }); face(fk[2], { mouth: 'o', eyes: 'wide' }, L.T); bst(B[1], FX + 5, 6, -PI / 2 - .4, L.T, { open: .4, lean: .4, headX: .4 }); cm([FX - 15, 9, 17, FX + 2.4, 7, 5, 50], [FX - 14, 9, 16, FX + 2.4, 7, 5, 50], L.k); }, [[.2, 'creepy_ting', .6]]);
// 89 All die Jahre… 90 Nur damit wir es glauben. — recuerdo: vecinos agarrados a la mochila, monstruos sonriendo detrás (sepia)
shot(st(86), 'W', null, L => { use('ST'); grade.uniforms.sepia.value = .5; put(kid, VS, 0, -18, PI); applyPose(kid, walkPose(L.T, .4)); put(fk[6], VS, 0, -15.1, PI); applyPose(fk[6], { ...walkPose(L.T, .4), ...holdPack() }); face(fk[6], { mouth: 'smile' }, L.T); bst(B[2], VS - 8, -18, PI / 2, L.T, { open: .3 }); cm([VS + 12, 6, -6, VS - 3, 5, -17, 50], [VS + 11, 6, -5.6, VS - 3, 5, -17, 48], L.k); sh(V(VS, 0, -18), 30); }, [[0, 'tape', .4], [.5, 'steps', .4], [1.5, 'creepy_ting', .5]]);
shot(st(87), 'F', null, L => { use('ST'); grade.uniforms.sepia.value = .5; bst(B[2], VS - 8, -18, PI / 2, L.T, { open: .5, headX: .3 }); onFace(B[2], 11, -1.4, 0, 40, L.k, 8.5); badge('red', 'NUR DAMIT WIR ES GLAUBEN', W / 2, H * .16, L.lt - .3, 1, .7); }, [[0, 'zoom_in', .6], [.4, 'growl', .5]]);
// 91 Denn rein konnten sie nicht. — la puerta cerrada, el monstruo esperando
shot(st(88), 'C', null, L => { use('PO'); inside(1, .5); PO.eyes.visible = false; bst(B[6], PX + 5, 4, -PI / 2 - .3, L.T); cm([PX - 6, 9, 22, PX + 2, 7.5, 1, 50], [PX - 5.4, 9, 21, PX + 2, 7.5, 1, 50], L.k); }, [[0, 'impact_soft', .5], [.4, 'breath', .5]]);
// 92 Und niemand hätte je seine Tür geöffnet. — vecinos tras las puertas cerradas, cerrojos
shot(st(89), 'W', null, L => { use('WG'); inside(.8, .3); put(fk[4], WX + 15.6, 0, 11, PI + .3); applyPose(fk[4], { aRx: 1.4, aRe: .4 }); face(fk[4], { mouth: 'frown', brows: -.6, eyes: 'squint' }, L.T); cm([WX + 10, 6, 4, WX + 16, 4.6, 12, 46], [WX + 10.6, 6, 4.6, WX + 16, 4.6, 12, 44], L.k); badge('tag', '🔒', W / 2, H * .16, L.lt - .2); }, [[0, 'lid_click', .7], [.4, 'chain_rattle', .6], [1.2, 'click_metal', .5]]);
// 93 Außer für mich. — el niño llama a la puerta y se abre
shot(st(90), 'Z', 'slow', L => { use('ST'); const d = doorR(-42); put(kid, d.x - 3, 0, d.z, PI / 2); applyPose(kid, { aRx: 1.3, aRe: .3, aRz: -.2 }); face(kid, { mouth: 'smile' }, L.T); put(fk[5], d.x - .4, 0, d.z, -PI / 2); applyPose(fk[5], WAVE(L.T, 5)); face(fk[5], { mouth: 'grin', eyes: 'happy' }, L.T); cm([d.x - 8, 6, d.z + 1, d.x - 1.6, 4.2, d.z, 46], [d.x - 7.2, 6, d.z + 1, d.x - 1.6, 4.2, d.z, 44], L.k); sh(d, 20); }, [[0, 'knock', .7], [.2, 'door_open', .7]]);
// 94 Also suchten sie sich einen Fünfjährigen. — flashback: el niño de 5 años en el césped, el monstruo agachado
shot(st(91), 'W', null, L => { use('ST'); grade.uniforms.sepia.value = .55; const p = lawnL(HOME); put(kid, p.x + 2, 0, p.z, -PI / 2); kid.root.scale.setScalar(.56); applyPose(kid, { headX: -.3 }); face(kid, { mouth: 'o', eyes: 'wide' }, L.T); bst(B[0], p.x + 7.5, p.z, -PI / 2, L.T, { lean: .9, headX: .5, crouch: 1.4, open: .4 }); cm([p.x + 4.5, 8, p.z + 24, p.x + 4.5, 6.5, p.z, 50], [p.x + 4.5, 8, p.z + 22.6, p.x + 4.5, 6.6, p.z, 50], L.k); sh(p, 20); }, [[0, 'tape', .4], [.4, 'sniff', .7]]);
// 95 Traten zur Seite. — se aparta (sepia)
shot(st(92), 'C', null, L => { use('ST'); grade.uniforms.sepia.value = .55; const p = lawnL(HOME); put(kid, p.x + 2, 0, p.z, -PI / 2); kid.root.scale.setScalar(.56); applyPose(kid, {}); face(kid, { mouth: 'smile' }, L.T); bst(B[0], p.x + 7.5, p.z + L.k * 5, -PI / 2 + L.k * .8, L.T, { open: .6 }); cm([p.x + 20, 10, p.z - 14, p.x + 5, 7.5, p.z + 2, 50], [p.x + 19, 10, p.z - 13, p.x + 5, 7.5, p.z + 2, 50], L.k); sh(p, 30); }, [[0, 'steps_heavy', .7]]);
// 96 Und warteten, bis mich alle liebten. — montaje: bodas, citas, abrazos; los monstruos sonríen al fondo
shot(st(93), 'S', null, L => { use('ST'); grade.uniforms.sepia.value = .45; const c = lawnR(30); show(ARCH, c.x, 0, c.z, -PI / 2); put(kid, c.x - 1, 0, c.z, -PI / 2); face(kid, { mouth: 'smile' }, L.T); for (const [p, s] of [[fk[7], -1], [fk[8], 1]]) { put(p, c.x - 1, 0, c.z + s * 2.2, -PI / 2 - s * .6); applyPose(p, { aLx: 1.2, aLe: .9 }); face(p, { mouth: 'grin', eyes: 'happy' }, L.T); } bst(B[3], c.x - 14, c.z + 6, PI / 2, L.T, { open: .5 });
  cm([c.x - 18, 7, c.z - 6, c.x - 2, 6, c.z + 2, 50], [c.x - 17, 7, c.z - 5, c.x - 2, 6, c.z + 2, 48], L.k); sh(c, 30); }, [[0, 'bells', .3], [.6, 'cheer', .3], [1.4, 'creepy_ting', .5]]);
// 97 Ich war nichts Besonderes. — el niño, roto, en el campo de noche
shot(st(94), 'F', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, 0); applyPose(kid, { headX: .4, aLz: .1, aRz: .1, lean: .1 }); face(kid, { mouth: 'frown', eyes: 'half', tears: 1, brows: -.7 }, L.T); onFace(kid, 6, 1.2, 0, 44, L.k, 5); }, [[0, 'sad_tone', .5], [.6, 'wind', .5]]);
// 98 Ich war die Tür. — título: el niño delante de una puerta abierta en medio del campo (zoom lento + golpe)
shot(st(95), 'C', 'slow', L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, 0); applyPose(kid, { headX: .1 }); face(kid, { mouth: 'flat', eyes: 'wide', tears: 1 }, L.T); onFace(kid, 9, .4, 0, 46, L.k, 6.5); badge('red', 'ICH WAR DIE TÜR', W / 2, H * .16, L.lt - .2, 1, .85); }, [[0, 'heartbeat', .7]]);
// 99 Das Seil wurde schlaff. — la cuerda cae al suelo
shot(st(96), 'W', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, PI); applyPose(kid, {}); const w = waist(kid); ROPE.draw([w, V(FX, .1, 3), V(FX + .6, .1, 7), V(FX - .4, .1, 12)], .05); cm([FX + 5, 5, 11, FX, .8, 5, 44], [FX + 4.6, 4.6, 10.4, FX, .8, 5, 42], L.k); }, [[0, 'tug', .5], [.3, 'thud', .5], [1.0, 'silence_tick', .5]]);
// 100 Ich spürte nur noch Milas kleine Hände an meinem Rucksack. — las manitas de Mila en la mochila
shot(st(97), 'S', 'slow', L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, PI); applyPose(kid, walkPose(L.T, .3)); put(mila, FX, 0, 2.6, PI); applyPose(mila, { ...walkPose(L.T + .2, .3), ...holdPack() }); face(mila, { mouth: 'flat', eyes: 'half' }, L.T); const p = kid.props.pack.getWorldPosition(V(0, 0, 0)); cm([p.x + 5, p.y + 1.6, p.z + 1.2, p.x, p.y - .2, p.z + .8, 40], [p.x + 4.4, p.y + 1.4, p.z + 1.2, p.x, p.y - .2, p.z + .8, 36], L.k); }, [[0, 'cloth', .5], [.8, 'breath', .5]]);
// 101 „Nicht loslassen." — él, sin mirar atrás, con lágrimas
shot(st(98), 'Z', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, PI); applyPose(kid, walkPose(L.T, .3)); talkFace(kid, L.T, L.t0, L.t1, { mouth: 'frown', tears: 1, eyes: 'half' }); onFace(kid, 5, .4, -1, 42, L.k, 4.4); bubble(kid, 'NICHT LOSLASSEN.', L.lt - .1); }, [[0, 'sniff', .6]]);
// 102 „Mach ich nicht." — la vocecita de Mila (su cara en la oscuridad)
shot(st(99) - .05, 'F', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(mila, FX, 0, 2.6, PI); applyPose(mila, holdPack()); talkFace(mila, L.T, L.t0, L.t1, { mouth: 'smile', eyes: 'half' }); onFace(mila, 4.6, .4, 0, 42, L.k, 4); bubble(mila, 'MACH ICH NICHT.', L.lt - .05, 2); }, [[0, 'breath', .4]]);
// 103 Ich ging weiter. — camina solo por el camino
shot(st(100), 'W', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, -L.lt * 2, PI); applyPose(kid, walkPose(L.T, .3)); face(kid, { mouth: 'frown', tears: 1 }, L.T); cm([FX + 6, 4, -12, FX, 3, -2, 46], [FX + 5, 4, -12, FX, 3, -3, 46], L.k); }, [[0, 'steps', .6], [.5, 'wind', .5]]);
// 104 Und dann wurde mein Rucksack leichter. — la mochila: ya no hay manos (zoom lento)
shot(st(101), 'C', 'slow', L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, PI); applyPose(kid, walkPose(L.T, .25)); const p = kid.props.pack.getWorldPosition(V(0, 0, 0)); cm([p.x + 5, p.y + 1.6, p.z + 1.2, p.x, p.y - .2, p.z + .8, 40], [p.x + 4.4, p.y + 1.4, p.z + 1.2, p.x, p.y - .2, p.z + .8, 36], L.k); }, [[.3, 'silence_tick', .6]]);
// 105 Jetzt standen sie alle um mich herum. — círculo de Fellriesen alrededor del niño
shot(st(102), 'W', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, PI); applyPose(kid, { aLz: .2, aRz: .2 }); face(kid, { mouth: 'o', eyes: 'wide', tears: 1 }, L.T); for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; bst(B[i], FX + Math.cos(a) * 13, Math.sin(a) * 13, -a - PI / 2, L.T, { open: .2, headX: .4, aLz: .02, aRz: .02 }); }
  const bl = []; for (let i = 0; i < 60; i++) { const a = i / 60 * PI * 2; bl.push([FX + Math.cos(a) * 24, Math.sin(a) * 24, -a - PI / 2]); } BEASTI.at(bl, L.T); cm([FX, 26, 30, FX, 2, 0, 52], [FX, 24, 27, FX, 2, 0, 52], L.k); }, [[0, 'steps_heavy', .6], [.6, 'breath', .5], [1.2, 'growl', .4]]);
// 106 Lächelnd. — la sonrisa de dientes, primerísimo plano
shot(st(103) - .05, 'F', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; bst(B[0], FX, 10, PI, L.T, { open: .1, headX: .5, lean: .3 }); onFace(B[0], 13, -3.4, 0, 40, L.k, 10); }, [[0, 'creepy_ting', .6]]);
// 107 Es wurde ganz still. — plano cenital, silencio
shot(st(104), 'I', null, L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, PI); applyPose(kid, {}); face(kid, { mouth: 'flat', eyes: 'closed', tears: 1 }, L.T); for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; bst(B[i], FX + Math.cos(a) * 10, Math.sin(a) * 10, -a - PI / 2, L.T, { lean: .4, headX: .5, aLz: .02, aRz: .02 }); } cm([FX + 3, 22, 22, FX, 3, 0, 50], [FX + 3, 24, 23, FX, 3, 0, 50], L.k); }, [[0, 'silence_tick', .4], [.8, 'heartbeat', .4]]);
// 108 Und zum ersten Mal in meinem Leben berührte mich eins von ihnen. — una mano enorme se posa en su hombro; fundido a negro
shot(st(105), 'C', 'slow', L => { use('FD'); night(); hemi.intensity = 1.25; sun.intensity = .9; put(kid, FX, 0, 0, PI); applyPose(kid, { headY: .3 }); face(kid, { mouth: 'o', eyes: 'closed', tears: 1 }, L.T); const k = easeInOut(clamp(L.lt / 2.4)); bst(B[0], FX + 4.5, 2, -PI / 2 - .5, L.T, { aRx: lerp(.3, 1.5, k), aRe: .2, lean: .5, headX: .5, open: .3 });
  cm([FX - 9, 9, 13, FX + 1.5, 6, 0, 50], [FX - 8, 8.6, 12, FX + 1.5, 6, 0, 48], L.k); grade.uniforms.lift.value = -clamp((L.lt - (L.d - 1)) / 1) * .9; }, [[0, 'breath', .6], [2.2, 'impact_soft', .6], [2.4, 'heartbeat', .7]]);
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
  sun.castShadow = sun.intensity >= .45;
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
  for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;


