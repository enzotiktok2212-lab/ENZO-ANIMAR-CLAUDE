// Mauern — ~85 planos sincronizados con audio/words.json (1080×1920, 30 fps).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane, checkTex } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, noiseTex, stripes, screen, txt, tree, makeExtra } from './props.js';
import { B, gold, glass, label } from './diam.js';
import { world, training, nightField, basement, mouth, nape, sea, stoneTex } from './world.js';
import { makeGiant, makeSkinless, makeSmiler, makeMine, makeMetal, steamFor, makeHero, makeMom, makeDad, makeSoldier, makeCaptain, makeBuddy, makeBig, makeTall, makeLady } from './giants.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 160.35, U = W / 720;
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
const TX = 600, BX = 1100, MX = 1200, NX = 1250, FX = 1400, SX = 2000;
const WD = world(scene), G = WD.G, W1 = WD.W1, TRN = training(scene, TX), BAS = basement(scene, BX), MOU = mouth(scene, MX), NAP = nape(scene, NX), FLD = nightField(scene, FX), SEA = sea(scene, SX);
// ---------- gigantes ----------
const gi = Array.from({ length: 8 }, (_, i) => makeGiant(scene, i, 4.6)); const RED = makeSkinless(scene, 12.5), SMI = makeSmiler(scene, 5.2), MINE = makeMine(scene, 6.4), MET = makeMetal(scene, 6.2);
// ---------- reparto ----------
const kid = makeHero(scene, true), hero = makeHero(scene), mom = makeMom(scene), dad = makeDad(scene), sold = makeSoldier(scene), capt = makeCaptain(scene), bud = makeBuddy(scene), big = makeBig(scene), tall = makeTall(scene), lady = makeLady(scene);
const ex = Array.from({ length: 10 }, (_, i) => makeExtra(scene, i));
const POOLC = [...gi, RED, SMI, MINE, MET, kid, hero, mom, dad, sold, capt, bud, big, tall, lady, ...ex];
// ---------- atrezo ----------
const STM = steamFor(scene, 18), boulder = sphere(9, mat(0xffffff, { roughness: .95, map: stoneTex(2, 2, 11) }), scene, 0, 0, 0, 20, 14), beam = box(1, 1, 9, mat(0x6a4a2a), .1, scene);
const rubble = []; for (let k = 0; k < 26; k++) rubble.push(box(1.4 + (k % 3), .8 + (k % 2), 1.2 + (k % 4) * .4, mat([0xefe2c8, 0xc8462e, 0x6a4a2e, 0x8a8a8a][k % 4]), .1, scene));
const dust = []; for (let k = 0; k < 24; k++) dust.push(sphere(1, mat(0xd8c8b0, { transparent: true, opacity: .6, roughness: 1 }), scene, 0, 0, 0, 10, 8));
const cables = [0, 1].map(() => { const c = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1, 6), mat(0x1a1a1a)); scene.add(c); return c; });
const hookH = [0, 1].map(() => { const h = new THREE.Mesh(new THREE.ConeGeometry(.3, .8, 6), mat(0x9aa0a8, { metalness: .8 })); scene.add(h); return h; });
const arm = box(1.6, 9, 1.6, mat(0xe8d6c0), .4, scene), headP = sphere(3.6, mat(0xe8d6c0), scene, 0, 0, 0, 16, 12);
const sparks = []; for (let k = 0; k < 30; k++) sparks.push(sphere(.08, B([3, 2.4, 1]), scene, 0, 0, 0, 4, 3));
const drips = []; for (let k = 0; k < 14; k++) drips.push(sphere(.12, mat(0xff8a9a, { transparent: true, opacity: .8 }), scene, 0, 0, 0, 6, 4));
const bolt = new THREE.Group(); scene.add(bolt); { const m = B([2, 2.4, 3]); let x = 0, y = 0; const r = RNG(3); for (let k = 0; k < 10; k++) { const nx = x + (r() - .5) * 8, ny = y - 12; const s = box(.8, Math.hypot(nx - x, ny - y), .8, m, 0, bolt, (x + nx) / 2, (y + ny) / 2, 0); s.rotation.z = -Math.atan2(nx - x, ny - y); x = nx; y = ny; } }
const rope = new THREE.Mesh(new THREE.TorusGeometry(.5, .12, 6, 16), mat(0xb8986a)); scene.add(rope);
const mini = Array.from({ length: 14 }, (_, i) => { const g = new THREE.Group(); scene.add(g); box(1, 2, .7, mat([0xd8323a, 0x2a6ad8, 0x2ec46a, 0xffd23f, 0x9b5de5, 0xff8a23, 0x8a5a2a][i % 7]), .1, g, 0, 1, 0); box(.7, .7, .7, mat([0xfbd9c3, 0xc68b5e, 0x8d5a3b][i % 3]), .1, g, 0, 2.4, 0); return g; });
const PROPS = [STM.ps, boulder, beam, rubble, dust, cables, hookH, arm, headP, sparks, drips, bolt, rope, mini].flat();

// ---------- utilidades ----------
const SETS = { G, TRN: TRN.g, BAS: BAS.g, MOU: MOU.g, NAP, FLD, SEA: SEA.g };
const OUTS = ['G', 'TRN', 'FLD', 'SEA'];
const use = (...n) => { for (const k of n) [].concat(SETS[k]).forEach(o => o.visible = true); if (!n.some(k => OUTS.includes(k))) { hemi.intensity = .9; sun.intensity = .6; bloom.strength = .3; } };
function day(k) { const u = sky.sky.material.uniforms; u.top.value.setRGB(.02 + .26 * k, .03 + .52 * k, .1 + .82 * k); u.mid.value.setRGB(.04 + .5 * k, .06 + .7 * k, .18 + .78 * k); u.hor.value.setRGB(.1 + .72 * k, .14 + .76 * k, .3 + .66 * k); sky.moon.material.opacity = 0;
  hemi.intensity = .45 + 1.25 * k; hemi.color.setRGB(.5 + .31 * k, .55 + .35 * k, 1); sun.intensity = .3 + 2.4 * k; sun.color.setRGB(.6 + .4 * k, .7 + .24 * k, 1 - .15 * k); rim.intensity = 2.2 - .9 * k; scene.fog.color.setRGB(.05 + .7 * k, .08 + .8 * k, .2 + .78 * k); scene.fog.density = .0007;
  WD.lamps.forEach(l => l.userData.bulb.material.emissiveIntensity = .2 + (1 - k) * 3); bloom.strength = .26 + (1 - k) * .3; }
function night(k = 1) { day(1 - .88 * k); const u = sky.sky.material.uniforms; u.top.value.lerp(new THREE.Color(.03, .05, .16), k); u.mid.value.lerp(new THREE.Color(.08, .12, .3), k); u.hor.value.lerp(new THREE.Color(.16, .22, .42), k); hemi.color.setRGB(.55, .65, 1); hemi.intensity = Math.max(hemi.intensity, .55 + .45 * k); }
function dusk(k = 1) { day(1 - .3 * k); const u = sky.sky.material.uniforms; u.top.value.lerp(new THREE.Color(.36, .3, .62), k); u.mid.value.lerp(new THREE.Color(1, .5, .3), k); u.hor.value.lerp(new THREE.Color(1, .66, .3), k); sun.color.setRGB(1, .62, .36); hemi.color.setRGB(1, .78, .62); }
function hideAll() {
  for (const c of POOLC) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.head.scale.set(1, 1, 1); c.head.visible = true; if (c.aR) { c.aR.sh.visible = true; c.aR.sh.scale.set(1, 1, 1); } if (c.props.blades) c.props.blades.forEach(b => b.visible = false); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); }
  for (const k in SETS) [].concat(SETS[k]).forEach(o => o.visible = false); W1.doors.forEach((d, i) => { d.rotation.y = 0; d.visible = true; }); W1.hole.visible = false; W1.crack.visible = false; WD.houses.forEach(h => { h.scale.set(1, 1, 1); h.rotation.z = 0; }); FLD.userData.ring.visible = false; MOU.up.position.y = 14; MOU.dn.position.y = 1; SEA.ship.position.set(0, 4, -900);
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.5; grade.uniforms.sepia.value = 0; day(1); ao.enabled = false; }
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

function dustAt(c, t, sc = 1) { dust.forEach((s, i) => { s.visible = t > 0; const a = i * 2.399, r = t * (4 + (i % 4)) * sc; s.position.set(c.x + Math.cos(a) * r, c.y + ((i % 3) * .5 + t * 2) * sc, c.z + Math.sin(a) * r); s.scale.setScalar((.6 + t * 2) * sc); s.material.opacity = clamp(.7 - t * .45); }); }
function rubbleAt(c, t, sc = 1) { rubble.forEach((d, i) => { d.visible = t > 0; const a = i * 2.4, tt = Math.min(t, 1.2); d.position.set(c.x + Math.cos(a) * tt * 9 * sc, Math.max(.4, c.y + (10 * tt - 9 * tt * tt) * sc + (i % 3)), c.z + Math.sin(a) * tt * 9 * sc); d.rotation.set(tt * 5 + i, i, tt * 3); d.scale.setScalar(sc); }); }
function cableTo(i, a, b) { const c = cables[i]; c.visible = true; const m = a.clone().add(b).multiplyScalar(.5); c.position.copy(m); c.scale.set(1, a.distanceTo(b), 1); c.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); hookH[i].visible = true; hookH[i].position.copy(b); }
const blades = (ch, on = true) => ch.props.blades && ch.props.blades.forEach(b => b.visible = on);
const gwalk = (g, x, z, ry, T, lt, sp = 1.2) => walkTo(g, x, z, ry, T, lt, sp * (g.spec.scale || 1) * .5, false, .4);
const gface = (g, f, T) => g.setFace({ ...g.spec.face, ...f });

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
const KEY = /^(Stadt|Mauern|hundert|Jahren|niemand|Riesen|Augen|Grinsen|Essen|Menschen|Arm|Kopf|Nacken|Vater|Schlüssel|Keller|nie|rote|Hand|Haut|Muskeln|Dampf|Tritt|Tor|Felsbrocken|Bus|Haus|Mutter|Riese|breitesten|Soldat|rennen|Armee|Haken|Schwertern|Luft|Hauptmann|kleinste|40|Stiefel|Freund|Maul|dunkel|nass|wütend|Riesennacken|winzig|Kopf|Felsen|Loch|Monat|Himmel|Metallhaut|Uhrzeit|Blitz|gefesselt|Feld|Bäumen|Grinsende|Fünf|nichts|Faust|Glockenschlag|stehen|um|fraßen|weinte|Leben|zurück|Kellertür|Buch|Foto|Mensch|Frau|Erster|Wasser|Mutter|Schiff)$/;
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
const HZ = -126, HX = -22, HOUSE = WD.houses[22];   // casa del narrador (lado izquierdo)
const townsfolk = (T, lt, n = 8, z0 = -150) => { for (let i = 0; i < n; i++) { const e = ex[i], s = i % 2 ? 1 : -1; walkTo(e, s * (5 + (i % 3) * 2.5), z0 + i * 7, i % 3 === 1 ? Math.PI : 0, T + i * .4, lt, 2); face(e, { eyes: 'open', mouth: i % 3 ? 'smile' : 'flat' }, T + i); } };
const outside = (T, lt, n = 5, z0 = -320) => { for (let i = 0; i < n; i++) { gwalk(gi[i], -90 + i * 45, z0 - (i % 2) * 40, (i % 2 ? .3 : -.3), T + i, lt); gface(gi[i], { look: [Math.sin(T + i) * .5, 0] }, T); } };
const steam = (g, T, k = 1) => STM.at(hp(g).add(V(0, -2 * (g.spec.scale || 1) / 5, 0)), T, 3 * (g.spec.scale || 1) / 5 * k, (g.spec.scale || 1) / 5);

// 1 GANCHO: golpe de zoom con "ding" frente a la puerta de la muralla, gente en la calle
shot(0, 'C', null, L => { use('G'); townsfolk(L.T, L.lt, 8, -176); const z0 = .3; if (L.T < z0) { const k = easeOut(L.T / z0); cam([0, lerp(18, 7, k), lerp(-60, -128, k)], [0, lerp(30, 24, k), -200], lerp(74, 54, k)); } else cm([0, 7, -128, 0, 24, -200, 54], [0, 6, -134, 0, 26, -200, 52], (L.T - z0) / (L.t1 - z0), q => q);
  sh(V(0, 0, -170), 40); }, [[0, 'zoom_fast', .9], [.02, 'whoosh', .6], [.3, 'city_amb', .6], [.8, 'steps', .4], [1.6, 'birds', .4]]);
// 2 …seit hundert Jahren hat niemand darüber geschaut (la cámara sube por la muralla; zoom lento → golpe)
shot(W2('seit', 1), 'R', null, L => { use('G'); const k = easeInOut(L.k); cam([0, lerp(10, 70, k), -150 + k * 6], [0, lerp(40, 80, k), -200], 54); badge('big', '100 JAHRE', W / 2, H * .16, L.lt - .3); sh(V(0, 0, -180), 40); }, [[0, 'wind', .6], [1.0, 'bell_far', .4]]);
// 3 Denn hinter den Mauern leben Riesen (por encima de la muralla: el campo con gigantes)
shot(st(2), 'C', null, L => { use('G'); outside(L.T, L.lt, 5, -300); cm([0, 74, -186, 0, 20, -320, 58], [0, 72, -188, 0, 18, -330, 56], L.k); sh(V(0, 0, -300), 80); }, [[0, 'rumble', .6], [.4, 'steps_heavy', .7], [1.4, 'steps_heavy', .6]]);
// 4 a pie de gigante
shot(W2('Riesen', 2) - .1, 'W', null, L => { use('G'); gwalk(gi[0], 0, -300, 0, L.T, L.lt, 1.4); gface(gi[0], { look: [0, .3] }, L.T); const p = gi[0].root.position; cm([p.x + 16, 3, p.z + 36, p.x, 20, p.z, 58], [p.x + 14, 3, p.z + 34, p.x, 22, p.z, 56], L.k); sh(p, 40); }, [[0, 'steps_heavy', .9], [.6, 'thud', .7], [1.1, 'steps_heavy', .8]]);
// 5 Leere Augen…
shot(st(3), 'Z', null, L => { use('G'); put(gi[1], 0, 0, -300, 0); applyPose(gi[1], idlePose(L.T)); gface(gi[1], { look: [Math.sin(L.T * 2) * .4, 0] }, L.T); const h = hp(gi[1]).add(V(0, 3.4, 0)); cam([h.x, h.y + .4, h.z + lerp(16, 12, L.k)], [h.x, h.y, h.z], 40); badge('tag', 'LEERE AUGEN', W / 2, H * .14, L.lt - .2); }, [[0, 'heartbeat', .6], [.5, 'breath', .5]]);
// 6 …riesiges Grinsen
shot(W2('riesiges', 3), 'S', null, L => { use('G'); put(gi[2], 0, 0, -300, 0); applyPose(gi[2], idlePose(L.T)); gface(gi[2], { open: .2 + .2 * Math.sin(L.T * 4) }, L.T); const h = hp(gi[2]).add(V(0, 1.4, 0)); cam([h.x + 2, h.y - 1, h.z + lerp(14, 11, L.k)], [h.x, h.y, h.z], 42); }, [[0, 'evil_laugh', .4], [.4, 'growl', .5]]);
// 7 Sie brauchen nicht mal Essen: pasa de largo junto a un carro de manzanas
shot(st(4), 'R', null, L => { use('G'); gwalk(gi[3], -20, -280, .2, L.T, L.lt, 1.4); gface(gi[3], {}, L.T); put(ex[0], 4, 0, -262, -.8); applyPose(ex[0], { crouch: .5, lLx: 1.2, lLk: 1.6, lRx: 1.2, lRk: 1.6, aLz: 1.2, aRz: 1.2 }); face(ex[0], { eyes: 'wide', mouth: 'shout', sweat: 1 }, L.T); boulder.visible = false;
  cm([20, 6, -240, -10, 14, -282, 56], [19, 6, -241, -10, 14, -282, 54], L.k); sh(V(-6, 0, -270), 40); }, [[0, 'steps_heavy', .8], [.5, 'gasp', .5], [1.2, 'steps_heavy', .7]]);
// 8 …sie fressen einfach gern Menschen
shot(W2('fressen', 4) - .1, 'Z', null, L => { use('G'); put(gi[4], 0, 0, -300, 0); const k = easeInOut(clamp(L.lt / 1.2)); applyPose(gi[4], { lean: .5 * k, aRx: 1.4 * k, aRe: .4, crouch: .6 * k }); gface(gi[4], { open: k }, L.T); walkTo(ex[1], -4, -280, Math.PI * .9, L.T, L.lt, 6, true); face(ex[1], { eyes: 'wide', mouth: 'shout' }, L.T);
  cm([10, 4, -262, -2, 6, -284, 54], [9, 4, -263, -2, 6, -284, 52], L.k); sh(V(0, 0, -285), 30); }, [[0, 'growl', .6], [.6, 'scream_girl', .5], [1.1, 'steps_run', .5]]);
// 9 Schlägst du ihnen einen Arm ab…
shot(st(5), 'W', null, L => { use('G'); put(gi[5], 0, 0, -300, 0); applyPose(gi[5], { aRx: .6 }); gface(gi[5], { open: .4 }, L.T); const cut = L.lt > .55; gi[5].aR.sh.visible = !cut; const sp = gi[5].aR.sh.getWorldPosition(V(0, 0, 0)); put(sold, sp.x + 4, sp.y + 2, sp.z + 4, -2.4); applyPose(sold, { aRx: 2.4, aRe: .2, aLx: 1.6, lLx: .6, lRk: 1 }); blades(sold); face(sold, { eyes: 'squint', mouth: 'teeth', brows: .7 }, L.T);
  if (cut) { arm.visible = true; const t = L.lt - .55; arm.position.set(sp.x + 4 * t, sp.y - 6 - 20 * t * t, sp.z + 3 * t); arm.rotation.set(t * 3, 0, t * 2); arm.scale.setScalar(gi[5].spec.scale / 2.4); STM.at(sp, L.T, 3, .8); } cm([sp.x + 18, sp.y, sp.z + 22, sp.x, sp.y - 3, sp.z, 54], [sp.x + 17, sp.y, sp.z + 21, sp.x, sp.y - 3, sp.z, 52], L.k); sh(sp, 30); }, [[0, 'whoosh', .6], [.5, 'slash', 0], [.55, 'metal_rip', .7], [.6, 'steam', .6], [1.2, 'thud', .7]].filter(c => c[2]));
// 10 …wächst er nach
shot(W2('wächst', 5), 'C', null, L => { use('G'); put(gi[5], 0, 0, -300, 0); applyPose(gi[5], { aRx: .3 }); gface(gi[5], { open: .1 }, L.T); const k = easeOut(clamp(L.lt / 1.6)); gi[5].aR.sh.scale.setScalar(.2 + .8 * k); const sp = gi[5].aR.sh.getWorldPosition(V(0, 0, 0)); STM.at(sp, L.T, 4, 1); cm([sp.x + 14, sp.y + 2, sp.z + 16, sp.x, sp.y - 4, sp.z, 50], [sp.x + 13, sp.y + 2, sp.z + 15, sp.x, sp.y - 4, sp.z, 48], L.k); badge('tag', 'WÄCHST NACH', W / 2, H * .14, L.lt - .2); }, [[0, 'steam', .8], [.4, 'stretch_creak', .6], [1.2, 'squelch', 0]].filter(c => c[2]));
// 11 Den Kopf? Wächst auch nach.
shot(st(6), 'S', null, L => { use('G'); put(gi[6], 0, 0, -300, 0); applyPose(gi[6], {}); const k = clamp((L.lt - .4) / 1); gi[6].head.scale.setScalar(Math.max(.05, k)); const n = gi[6].neck.getWorldPosition(V(0, 0, 0)); STM.at(n.clone().add(V(0, 2, 0)), L.T, 4, 1.2); cm([n.x + 12, n.y + 2, n.z + 22, n.x, n.y + 2, n.z, 52], [n.x + 11, n.y + 2, n.z + 21, n.x, n.y + 3, n.z, 50], L.k); badge('red', 'KOPF?', W / 2, H * .16, L.lt - .1); }, [[0, 'impact', .6], [.4, 'steam', .8], [.9, 'stretch_creak', .5]]);
// 12 Töten kannst du sie nur mit einem Schnitt in den Nacken
shot(st(8), 'Z', 'slow', L => { use('G'); put(gi[7], 0, 0, -300, Math.PI); applyPose(gi[7], { headX: .3 }); const n = gi[7].neck.getWorldPosition(V(0, 0, 0)); put(sold, n.x + lerp(6, .6, easeIn(L.k)), n.y + 1, n.z - lerp(6, 1.5, easeIn(L.k)), Math.PI * .8); applyPose(sold, { aRx: 2.8, aLx: 2.8, aRe: .3, aLe: .3, lean: .4, lLx: 1, lLk: 1.4 }); blades(sold); face(sold, { eyes: 'squint', mouth: 'teeth', brows: .8 }, L.T);
  cableTo(0, handP(sold), n.clone().add(V(-2, 4, 0))); cm([n.x + 16, n.y + 4, n.z - 18, n.x, n.y, n.z, 50], [n.x + 9, n.y + 2, n.z - 10, n.x, n.y, n.z, 44], L.k, easeIn); badge('red', 'NUR DER NACKEN', W / 2, H * .16, L.lt - .3); sh(n, 30); }, [[0, 'whoosh_up', .6], [.5, 'ratchet', .5]]);
// 13 Als ich klein war, hängte mir mein Vater einen Schlüssel um den Hals
shot(st(9), 'F', null, L => { use('G'); put(dad, HX + 6, 0, HZ + 3, Math.PI / 2 + .2); applyPose(dad, { aRx: 1.3, aRe: .6, aLx: 1.2, aLe: .6, lean: .25 }); face(dad, { eyes: 'half', mouth: 'smile', brows: -.2 }, L.T); put(kid, HX + 10, 0, HZ + 3, -Math.PI / 2 - .1); applyPose(kid, { headX: -.3, aLz: .2, aRz: .2 }); face(kid, { eyes: 'wide', mouth: 'o', look: [0, -1] }, L.T); kid.props.key.visible = true; grade.uniforms.sepia.value = .25;
  cm([HX + 8, 6, HZ + 14, HX + 8, 4, HZ + 3, 50], [HX + 8, 6, HZ + 13, HX + 8, 4, HZ + 3, 48], L.k); sh(V(HX + 8, 0, HZ + 3), 16); }, [[0, 'chain_rattle', .5], [.6, 'keys', .7], [1.4, 'cloth', .4]]);
// 14 „Öffne den Keller erst, wenn du bereit bist.“
shot(st(10), 'Z', null, L => { use('BAS'); BAS.door.visible = true; put(dad, BX - 6, 0, 8, Math.PI / 2 + .6); applyPose(dad, { aRx: 1.4, aRe: .1, aRz: -.2 }); talkFace(dad, L.T, L.t0, L.t1, { eyes: 'half', mouth: 'flat', brows: -.3 }); put(kid, BX - 3, 0, 10, -2.4); applyPose(kid, {}); face(kid, { eyes: 'open', mouth: 'o' }, L.T);
  cm([BX - 2, 5, 18, BX - 8, 4, 6, 50], [BX - 2.6, 5, 17, BX - 8, 4, 6, 48], L.k); badge('tag', 'KELLER', W / 2, H * .14, L.lt - .3); }, [[0, 'door_creak', .6], [.6, 'click_metal', .6], [1.2, 'heartbeat', .3]]);
// 15 Dann ging er, und er kam nie zurück (sale por la puerta de la muralla; zoom lento)
shot(st(11), 'R', null, L => { use('G'); walkTo(dad, 0, -176, Math.PI, L.T, L.lt, 2.2, false, .5); face(dad, {}, L.T); put(kid, 2, 0, -150, Math.PI); applyPose(kid, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 10) * .2 }); face(kid, { eyes: 'half', mouth: 'frown' }, L.T); kid.props.key.visible = true; grade.uniforms.sepia.value = .25;
  cm([4, 3, -140, 0, 6, -190, 54], [4, 3.4, -141, 0, 7, -190, 52], L.k); sh(V(0, 0, -170), 24); }, [[0, 'steps', .5], [.8, 'door_creak', .5], [1.4, 'sad_tone', .5]]);
// 16 Am nächsten Tag packte eine rote Hand die Mauerkante (zoom lento + riser)
shot(st(12), 'W', 'slow', L => { use('G'); townsfolk(L.T, L.lt * .3, 6, -170); for (let i = 0; i < 6; i++) { applyPose(ex[i], { headX: -.7 }); face(ex[i], { eyes: 'wide', mouth: 'o', look: [0, -1] }, L.T + i); } put(RED, -12, 10, -214, 0); applyPose(RED, { aRx: 3.0, aRe: 1.1, aLx: .4 }); RED.head.visible = false; const hd = handP(RED);
  cm([4, 20, -120, hd.x, hd.y - 8, -206, 56], [4, 20, -122, hd.x, hd.y - 6, -206, 46], L.k); sh(V(0, 0, -180), 50); }, [[0, 'rumble', .6], [.6, 'stone_crack', 0], [1.4, 'gasp', .5]].filter(c => c[2]));
// 17 Dahinter tauchte ein Gesicht auf
shot(st(13), 'C', null, L => { use('G'); const k = easeOut(clamp(L.lt / 1.3)); put(RED, 0, -6 + k * 22, -224, 0); applyPose(RED, { aRx: 2.9, aRe: .9, aLx: 2.9, aLe: .9 }); RED.setFace({ custom: 'skinless' }); steam(RED, L.T); W1.crack.visible = true;
  cm([0, 34, -140, 0, 68, -210, 56], [0, 34, -142, 0, 70, -210, 54], L.k); sh(V(0, 0, -200), 60); }, [[0, 'boom', .7], [.2, 'steam', .8], [.8, 'growl', .6]]);
// 18 keine Haut, nur Muskeln und Dampf
shot(st(14), 'Z', null, L => { use('G'); put(RED, 0, 16, -224, 0); applyPose(RED, { aRx: 2.9, aRe: .9, aLx: 2.9, aLe: .9, headX: .2 }); RED.setFace({ custom: 'skinless', look: [Math.sin(L.T) * .3, .4] }); steam(RED, L.T, 1.4); const h = hp(RED).add(V(0, 6, 0)); cam([h.x + 6, h.y - 2, h.z + lerp(48, 36, L.k)], [h.x, h.y, h.z], 44); badge('tag', 'KEINE HAUT', W / 2, H * .14, L.lt - .2); }, [[0, 'steam', 1], [.5, 'breath', .6], [1.4, 'heartbeat', .5]]);
// 19 Ein einziger Tritt gegen das Tor
shot(st(15), 'S', null, L => { use('G'); const k = clamp((L.lt - .5) / .2); W1.doors.forEach(d => d.visible = k < 1); W1.hole.visible = k >= 1; rubbleAt(V(0, 10, -192), k >= 1 ? L.lt - .7 : 0, 1.4); dustAt(V(0, 4, -188), k >= 1 ? (L.lt - .7) * .8 : 0, 1.6); for (let i = 0; i < 4; i++) { put(ex[i], -8 + i * 5, 0, -160, Math.PI); applyPose(ex[i], k >= 1 ? { aLz: 1.4, aRz: 1.4, lean: -.3 } : {}); face(ex[i], { eyes: 'wide', mouth: k >= 1 ? 'shout' : 'o' }, L.T + i); }
  cm([10, 6, -136, 0, 14, -196, 58], [9, 6, -138, 0, 14, -196, 56], L.k); if (k >= 1) grade.uniforms.flash.value = clamp(.5 - (L.lt - .7) * 2); sh(V(0, 0, -180), 40); }, [[0, 'steps_heavy', .6], [.68, 'explosion', 1], [.7, 'rubble', .8], [1.1, 'scream_girl', .5]]);
// 20 …ein Felsbrocken so groß wie ein Bus
shot(W2('Felsbrocken', 15), 'C', null, L => { use('G'); W1.hole.visible = true; W1.doors.forEach(d => d.visible = false); const t = clamp(L.lt / 2); boulder.visible = true; boulder.position.set(lerp(0, HX - 4, t), 40 * Math.sin(t * Math.PI) + 10 * (1 - t), lerp(-190, HZ, t)); boulder.rotation.set(L.T * 3, L.T * 2, 0);
  cam([20, 18, -110, boulder.position.x, boulder.position.y, boulder.position.z].slice(0, 3), [boulder.position.x, boulder.position.y, boulder.position.z], 56); badge('tag', 'SO GROSS WIE EIN BUS', W / 2, H * .14, L.lt - .3); sh(V(-10, 0, -150), 50); }, [[0, 'whoosh', .8], [.6, 'whoosh_down', .7], [1.4, 'wind', .5]]);
// 21 …landete auf unserem Haus
shot(W2('landete', 15), 'R', null, L => { use('G'); boulder.visible = true; boulder.position.set(HX - 5, 7, HZ); HOUSE.scale.y = Math.max(.3, 1 - L.lt * 3); HOUSE.rotation.z = -.1 * Math.min(1, L.lt * 3); dustAt(V(HX - 4, 2, HZ), L.lt * .9, 1.4); rubbleAt(V(HX, 4, HZ), L.lt, .9);
  cm([HX + 22, 8, HZ + 22, HX - 4, 6, HZ, 54], [HX + 21, 8, HZ + 21, HX - 4, 6, HZ, 52], L.k); grade.uniforms.flash.value = clamp(.4 - L.lt); sh(V(HX, 0, HZ), 30); }, [[0, 'crash_wood', 1], [.05, 'boom', .8], [.3, 'rubble', .8], [.8, 'glass_break', .5]]);
// 22 Meine Mutter lag darunter
shot(st(16), 'Z', null, L => { use('G'); boulder.visible = true; boulder.position.set(HX - 5, 7, HZ); HOUSE.scale.y = .3; HOUSE.rotation.z = -.1; put(mom, HX + 4, -1.6, HZ + 2, Math.PI / 2); mom.root.rotation.set(-Math.PI / 2 + .2, 0, 0); mom.root.rotation.y = Math.PI / 2; applyPose(mom, { aRx: 2.6, aRe: .4 }); face(mom, { eyes: 'squint', mouth: 'frown', brows: -.7, soot: 1 }, L.T); beam.visible = true; beam.position.set(HX + 4, 1.8, HZ + 1); beam.rotation.y = .3; rubbleAt(V(HX + 3, 0, HZ), 1.2, .5);
  const h = hp(mom); cam([h.x + 2, h.y + 7, h.z + 3], [h.x, h.y, h.z], 46); }, [[0, 'gasp_f', .6], [.4, 'rubble', .4], [.9, 'cry_girl', .3]]);
// 23 Ich konnte ihn nicht anheben
shot(st(17), 'S', null, L => { use('G'); boulder.visible = true; boulder.position.set(HX - 5, 7, HZ); HOUSE.scale.y = .3; beam.visible = true; beam.position.set(HX + 4, 1.8, HZ + 1); beam.rotation.y = .3; beam.position.y = 1.8 + Math.abs(Math.sin(L.T * 12)) * .05; put(kid, HX + 6.2, 0, HZ + 1.6, -Math.PI / 2 - .3); applyPose(kid, { crouch: .7, lLx: 1, lLk: 1.6, lRx: 1, lRk: 1.6, aLx: 1.2, aRx: 1.2, lean: .5 }); face(kid, { eyes: 'squint', mouth: 'teeth', brows: -.7, tears: 1, sweat: 1 }, L.T); kid.props.key.visible = true;
  onFace(kid, 7, .8, 3, 46, L.k, 6); }, [[0, 'strain', .7], [.6, 'wood_creak', .6], [1.0, 'sniff', .4]]);
// 24 Und genau da bog ein Riese mit dem breitesten Grinsen um die Ecke (zoom lento)
shot(st(18), 'W', 'slow', L => { use('G'); W1.hole.visible = true; W1.doors.forEach(d => d.visible = false); gwalk(SMI, 6, HZ - 30, -.3, L.T, L.lt, .8); SMI.setFace({ custom: 'smiler' }); boulder.visible = true; boulder.position.set(HX - 5, 7, HZ); HOUSE.scale.y = .3; put(kid, HX + 6.2, 0, HZ + 1.6, Math.PI - .2); applyPose(kid, { headX: -.5 }); face(kid, { eyes: 'wide', mouth: 'o', look: [0, -1] }, L.T);
  cm([HX + 8, 2, HZ + 8, 4, 22, HZ - 34, 56], [HX + 8, 2.4, HZ + 7, 4, 24, HZ - 34, 48], L.k); sh(V(0, 0, HZ - 20), 40); }, [[0, 'steps_heavy', .8], [1.0, 'steps_heavy', .7], [2.0, 'steps_heavy', .7]]);
shot(W2('breitesten', 18), 'C', null, L => { use('G'); put(SMI, 6, 0, HZ - 26, -.3); applyPose(SMI, { lean: .2, headX: .3 }); SMI.setFace({ custom: 'smiler' }); const h = hp(SMI).add(V(0, 3, 0)); cam([h.x - 4, h.y - 4, h.z + lerp(20, 15, L.k)], [h.x, h.y, h.z], 44); badge('tag', 'DAS GRINSEN', W / 2, H * .14, L.lt - .2); }, [[0, 'creepy_ting', .7], [.6, 'heartbeat', .6]]);
// 25 Ein Soldat packte mich und rannte
shot(st(19), 'S', null, L => { use('G'); walkTo(sold, HX + 8, HZ + 2, .1, L.T, L.lt, 7, true); face(sold, { eyes: 'squint', mouth: 'teeth' }, L.T); put(kid, 0, 0, 0, Math.PI); kid.root.position.copy(sold.root.position).add(V(0, 5.6, -.6)); applyPose(kid, { aLx: 2, aRx: 2, lLx: 1.2, lRx: 1.2, lLk: 1, lRk: 1 }); face(kid, { eyes: 'wide', mouth: 'shout', tears: 1 }, L.T); kid.root.rotation.x = .9; kid.root.rotation.y = Math.PI;
  const p = sold.root.position; cm([p.x + 6, 5, p.z + 14, p.x, 4, p.z, 52], [p.x + 5, 5, p.z + 13, p.x, 4, p.z, 50], L.k); sh(p, 20); }, [[0, 'steps_run', .8], [.4, 'shout_m', .5], [1.2, 'steps_run', .6]]);
// 26 Über seine Schulter sah ich, wie der Riese sie hochhob
shot(st(20), 'W', null, L => { use('G'); const k = easeInOut(clamp(L.lt / 2)); put(SMI, HX + 10, 0, HZ - 10, -1.2); applyPose(SMI, { aRx: lerp(.4, 2.2, k), aRe: .5, lean: .3 - .3 * k }); SMI.setFace({ custom: 'smiler', open: k * .6 }); put(mom, 0, 0, 0, 0); mom.root.position.copy(handP(SMI)).add(V(0, -2, 0)); applyPose(mom, { aLz: 1.6, aRz: 1.6, lLx: .4, lRx: -.4 }); face(mom, { eyes: 'wide', mouth: 'shout', tears: 1 }, L.T);
  cm([HX + 18, 4, HZ + 40, HX + 8, 14, HZ - 8, 50], [HX + 18, 4, HZ + 44, HX + 8, 16, HZ - 8, 48], L.k); grade.uniforms.sat.value = 1.1; sh(V(HX, 0, HZ), 30); }, [[0, 'growl', .4], [.6, 'scream_girl', .6], [1.6, 'heartbeat', .5]]);
// 27 Sie schrie immer noch, ich solle rennen
shot(st(21), 'C', null, L => { use('G'); put(mom, 0, 0, 0, Math.PI / 2); put(SMI, HX + 10, 0, HZ - 10, -1.2); applyPose(SMI, { aRx: 2.2, aRe: .5 }); mom.root.position.copy(handP(SMI)).add(V(0, -2, 0)); applyPose(mom, { aRx: 2.6, aRe: .2, aLz: 1 }); talkFace(mom, L.T, L.t0, L.t1, { eyes: 'squint', mouth: 'shout', tears: 1 }); onFace(mom, 7, .2, 1, 46, L.k, 6); bubble(mom, 'LAUF!', L.lt - .2, 2.2); }, [[0, 'shout_crowd', 0], [.1, 'scream_girl', .5], [.8, 'heartbeat', .5]].filter(c => c[2]));
// 28 Deshalb ging ich zur Armee
shot(st(22), 'F', null, L => { use('TRN'); for (let i = 0; i < 5; i++) { const c = [hero, bud, big, tall, ex[4]][i]; put(c, TX - 8 + i * 4, 0, 0, 0); applyPose(c, { aRx: 2.2, aRe: 2.4, aRz: -.6 }); face(c, { eyes: 'squint', mouth: 'flat', brows: .4 }, L.T); } put(capt, TX, 0, 10, Math.PI); applyPose(capt, {});
  cm([TX + 2, 6, 18, TX, 5, 0, 54], [TX + 1.6, 6, 16.6, TX, 5, 0, 52], L.k); badge('tag', 'ARMEE', W / 2, H * .14, L.lt - .2); sh(V(TX, 0, 4), 20); }, [[0, 'stamp', .7], [.3, 'steps_heavy', .4], [.8, 'whistle', .5]]);
// 29 Dort bekommst du einen Gürtel mit zwei Haken und zwei Schwertern
shot(st(23), 'Z', null, L => { use('TRN'); put(hero, TX, 0, 0, .3); applyPose(hero, { aRx: 1.1, aLx: 1.1, aRe: .4, aLe: .4 }); blades(hero, L.lt > 1.4); face(hero, { eyes: 'open', mouth: 'smirk' }, L.T); const s = hero.hips.getWorldPosition(V(0, 0, 0)); cm([s.x + 4, s.y + 2.6, s.z + 6, s.x, s.y + .4, s.z, 46], [s.x + 3, s.y + 2.2, s.z + 5, s.x, s.y + .6, s.z, 44], L.k); badge('tag', '2 HAKEN · 2 SCHWERTER', W / 2, H * .14, L.lt - .3); }, [[0, 'click_set', .6], [.6, 'zip', .5], [1.4, 'metal_hit', .5], [1.8, 'sword_draw', 0]].filter(c => c[2]));
// 30 Du schießt einen Haken in eine Wand…
shot(st(24), 'W', null, L => { use('G'); put(hero, 2, 2, 20, Math.PI); applyPose(hero, { aRx: 2.3, aRe: .2, aLx: .4 }); face(hero, { eyes: 'squint', mouth: 'teeth' }, L.T); const tgt = V(18, 14, 8); const a = handP(hero), t = clamp(L.lt / .3); cableTo(0, a, a.clone().lerp(tgt, t));
  cm([-6, 4, 30, 6, 8, 12, 54], [-5, 4, 29, 6, 8, 12, 52], L.k); sh(V(6, 0, 16), 20); }, [[0, 'zip', .7], [.25, 'thud', .6], [.4, 'ratchet', .5]]);
// 31 …er reißt dich durch die Luft
shot(W2('reißt', 24), 'S', null, L => { use('G'); const t = L.lt; put(hero, lerp(-6, 8, t / 1.4), 10 + Math.sin(t * 2.2) * 4, 10 - t * 18, Math.PI + .2); applyPose(hero, { aRx: 2.6, aRe: .2, aLx: -.4, lean: .6, lLx: -.4, lRx: .3, lLk: .6 }); blades(hero); face(hero, { eyes: 'squint', mouth: 'grin' }, L.T); cableTo(0, handP(hero), V(14, 18, -20));
  const p = hero.root.position; cm([p.x - 5, p.y + 1, p.z + 9, p.x, p.y + 3, p.z, 56], [p.x - 5, p.y + 1, p.z + 9, p.x, p.y + 3, p.z, 54], L.k); sh(p, 26); }, [[0, 'whoosh', .8], [.5, 'wind', .6], [1.0, 'whoosh_up', .5]]);
// 32 …und du schneidest zu (muñeco de madera)
shot(W2('schneidest', 24) - .1, 'C', null, L => { use('TRN'); const D = TRN.dummies[1].d.position.clone().add(V(TX, 0, 0)); const k = clamp(L.lt / .5); put(hero, D.x + lerp(6, 0, k), 26 + Math.sin(k * Math.PI) * 2, D.z - 3, Math.PI); applyPose(hero, k < 1 ? { aRx: 2.8, aLx: 2.8, lean: .3 } : { aRx: .6, aLx: .6, aRz: 1.2, aLz: 1.2, lean: .4 }); blades(hero); face(hero, { eyes: 'squint', mouth: 'teeth', brows: .8 }, L.T);
  if (k >= 1) { sparks.forEach((s, i) => { const t = L.lt - .5, a = i * 2.399; s.visible = t < .6; s.position.set(D.x + Math.cos(a) * t * 6, 26 + Math.sin(a) * t * 4, D.z - 1.4); }); } cm([D.x + 8, 24, D.z - 14, D.x, 26, D.z - 1, 50], [D.x + 7, 24, D.z - 13, D.x, 26, D.z - 1, 48], L.k); badge('tag', 'NACKEN!', W / 2, H * .14, L.lt - .5); sh(D, 30); }, [[0, 'whoosh', .6], [.5, 'metal_rip', .7], [.52, 'wood_creak', .6], [.9, 'cheer', .3]]);
// 33 Mein Hauptmann war der kleinste Mann…
shot(st(25), 'W', null, L => { use('TRN'); walkTo(capt, TX - 4, 2, Math.PI / 2, L.T, L.lt, 1.6, false, .5); face(capt, { eyes: 'half', mouth: 'flat', brows: .5 }, L.T); for (let i = 0; i < 3; i++) { const c = [big, tall, ex[5]][i]; put(c, TX - 2 + i * 3.2, 0, -1.6, 0); applyPose(c, { aRx: 2.2, aRe: 2.4, aRz: -.6 }); face(c, { eyes: 'open', mouth: 'flat' }, L.T); }
  cm([TX + 2, 3, 14, TX + 1, 4, 0, 52], [TX + 1.6, 3, 13, TX + 1, 4, 0, 50], L.k); badge('tag', 'HAUPTMANN', W / 2, H * .14, L.lt - .3); sh(V(TX, 0, 0), 16); }, [[0, 'steps', .5], [.5, 'hmm', .4], [1.4, 'steps', .4]]);
// 34 Er tötete 40 Riesen…
shot(st(26), 'Z', null, L => { use('G'); for (let i = 0; i < 5; i++) { put(gi[i], -40 + i * 18, -2, -330 - (i % 2) * 10, i * 1.3); gi[i].root.rotation.x = -Math.PI / 2; applyPose(gi[i], { aLz: .6, aRz: .6 }); } STM.at(V(0, 2, -330), L.T, 20, 3); put(capt, 0, 7, -326, 0); applyPose(capt, { aRx: .3, aLx: .3 }); blades(capt); face(capt, { eyes: 'half', mouth: 'flat' }, L.T);
  cm([12, 10, -300, 0, 7, -326, 54], [11, 10, -302, 0, 7, -326, 52], L.k); badge('big', '40 RIESEN', W / 2, H * .15, L.lt - .2); sh(V(0, 0, -330), 40); }, [[0, 'steam', .7], [.4, 'thud', .6], [1.0, 'wind', .5]]);
// 35 …und beschwerte sich danach über seine Stiefel
shot(W2('beschwerte', 26), 'C', null, L => { use('G'); put(capt, 0, 7, -326, 0); applyPose(capt, { lean: .6, headX: .5, aRx: .6, aRe: .8, lLx: .6, lLk: 1.2 }); face(capt, { eyes: 'squint', mouth: 'frown', brows: .6 }, L.T); STM.at(V(0, 2, -330), L.T, 20, 3); onFace(capt, 6, .6, 2, 46, L.k, 5); bubble(capt, 'IGITT.', L.lt - .4, 2); }, [[0, 'sigh', .6], [.6, 'cloth', .5], [1.2, 'sniff', .4]]);
// 36 Doch an meinem ersten Tag schnappte sich ein Riese meinen besten Freund
shot(st(27), 'W', null, L => { use('G'); W1.hole.visible = true; W1.doors.forEach(d => d.visible = false); const k = easeInOut(clamp(L.lt / 1.3)); put(gi[0], 2, 0, -160, Math.PI * .1); applyPose(gi[0], { lean: .4 * k, aRx: 1.4 * k, aRe: .4, crouch: .5 * k }); gface(gi[0], { open: k * .5 }, L.T);
  put(bud, 0, 0, 0, 0); bud.root.position.copy(k > .9 ? handP(gi[0]).add(V(0, -1, 0)) : V(-2, 0, -142)); applyPose(bud, k > .9 ? { aLz: 1.6, aRz: 1.6, lLx: .5 } : runPose(L.T)); face(bud, { eyes: 'wide', mouth: 'shout' }, L.T);
  cm([14, 6, -120, 0, 12, -150, 56], [13, 6, -122, 0, 12, -150, 54], L.k); sh(V(0, 0, -150), 30); }, [[0, 'steps_heavy', .7], [.8, 'whoosh', .5], [1.3, 'shout_m', .6]]);
// 37 Ich warf ihn aus dem Maul…
shot(st(28), 'S', null, L => { use('G'); put(gi[0], 2, 0, -160, .1); applyPose(gi[0], { lean: .3, headX: .3 }); gface(gi[0], { open: 1 }, L.T); const m = hp(gi[0]).add(V(0, 1.4, 3)); const k = clamp(L.lt / .6); put(hero, m.x - 1, m.y - 1, m.z, Math.PI); applyPose(hero, { aRx: 2.4, aLx: 2.4, aRe: .2, aLe: .2, lean: -.3 }); face(hero, { eyes: 'squint', mouth: 'teeth' }, L.T);
  put(bud, m.x + 1 + k * 10, m.y - k * 6, m.z + k * 6, 0); bud.root.rotation.z = k * 2; applyPose(bud, { aLz: 1.6, aRz: 1.6 }); face(bud, { eyes: 'wide', mouth: 'shout' }, L.T); cam([m.x + 8, m.y + 3, m.z + 16], [m.x + 2, m.y, m.z], 50); sh(m, 20); }, [[0, 'throw', .8], [.4, 'whoosh', .6], [.9, 'land', .5]]);
// 38 …und dann schloss sich das Maul über mir
shot(W2('dann', 28), 'C', null, L => { use('MOU'); const k = easeIn(clamp(L.lt / 1.1)); MOU.up.position.y = lerp(14, 6, k); MOU.dn.position.y = lerp(1, 3, k); put(hero, MX, 0, 8, Math.PI); applyPose(hero, { aLx: 2.6, aRx: 2.6, aLe: 1, aRe: 1 }); face(hero, { eyes: 'wide', mouth: 'shout' }, L.T); MOU.L.intensity = 200 * (1 - k);
  cam([MX, 5, 22], [MX, 5, 8], 56); grade.uniforms.vig.value = .4 + .5 * k; }, [[0, 'growl', .5], [.9, 'slam', .9], [1.0, 'squelch', 0]].filter(c => c[2]));
// 39 Es war dunkel. 40 Es war nass. 41 Und ich war so wütend.
shot(st(29), 'Z', null, L => { use('MOU'); MOU.up.position.y = 6; MOU.dn.position.y = 3; MOU.L.intensity = 30; put(hero, MX, 0, 0, 0); applyPose(hero, { crouch: .4, aLz: .5, aRz: .5 }); face(hero, { eyes: 'half', mouth: 'frown' }, L.T); onFace(hero, 8, .6, 0, 48, L.k, 7); grade.uniforms.vig.value = .9; }, [[0, 'heartbeat', .7], [.4, 'drip', .5]]);
shot(st(30), 'S', null, L => { use('MOU'); MOU.up.position.y = 6; MOU.dn.position.y = 3; MOU.L.intensity = 60; put(hero, MX, 0, 0, 0); applyPose(hero, { aLz: .5, aRz: .5, headX: -.3 }); face(hero, { eyes: 'squint', mouth: 'frown' }, L.T); drips.forEach((d, k) => { d.visible = true; d.position.set(MX - 4 + k * .6, 12 - ((L.T * 1.5 + k * .3) % 1) * 10, 5 + (k % 3)); }); onFace(hero, 7, 1.4, 1.6, 48, L.k, 6); grade.uniforms.vig.value = .8; }, [[0, 'drip', .8], [.3, 'drip', .6]]);
shot(st(31), 'Z', 'slow', L => { use('MOU'); MOU.up.position.y = 6; MOU.dn.position.y = 3; MOU.L.intensity = 80 + 300 * L.k; MOU.L.color.setRGB(1, .2, .1); put(hero, MX, 0, 0, 0); applyPose(hero, { aLz: .4, aRz: .4, aLe: 1.9, aRe: 1.9, aLx: .4, aRx: .4 }); face(hero, { eyes: 'squint', mouth: 'teeth', brows: 1, veins: 1 }, L.T); onFace(hero, 7, .3, 0, 46, L.k, 4.4); badge('red', 'WÜTEND', W / 2, H * .16, L.lt - .3); }, [[0, 'growl', .6]]);
// 42 Ich wachte im Nacken eines Riesen auf
shot(st(32), 'F', null, L => { use('NAP'); put(hero, NX, 4, 0, 0); applyPose(hero, { aLx: 1.2, aRx: 1.2, aLz: .5, aRz: .5, lean: .2, headX: -.2 }); face(hero, { eyes: L.lt > .5 ? 'wide' : 'half', mouth: 'o' }, L.T); onFace(hero, 9, .6, 2, 50, L.k, 7.4); }, [[0, 'heartbeat', .8], [.4, 'squelch', 0], [.6, 'gasp', .6]].filter(c => c[2]));
// 43 In meinem Riesennacken. (mi gigante en la plaza)
shot(st(33), 'W', null, L => { use('G'); put(MINE, 0, 0, -120, .1); applyPose(MINE, { aLz: .5, aRz: .5, aLe: 1.6, aRe: 1.6, headX: -.3 }); MINE.setFace({ custom: 'mine' }); STM.at(hp(MINE), L.T, 6, 1); cm([10, 4, -90, 0, 26, -120, 58], [9, 4, -92, 0, 28, -120, 54], L.k); badge('big', 'MEIN RIESE', W / 2, H * .15, L.lt - .3); sh(V(0, 0, -120), 40); }, [[0, 'roar', .9], [.2, 'boom', .6], [.9, 'steam', .5]]);
// 44 Ich sah nach unten, und die ganze Stadt war winzig
shot(st(34), 'S', null, L => { use('G'); put(MINE, 0, 0, -120, Math.PI); applyPose(MINE, { headX: .6 }); MINE.setFace({ custom: 'mine' }); const h = hp(MINE); cm([h.x, h.y + 6, h.z + 4, h.x, 0, h.z + 60, 60], [h.x, h.y + 8, h.z + 2, h.x, 0, h.z + 70, 62], L.k); mini.forEach((m, i) => { m.visible = true; m.position.set(-8 + (i % 7) * 2.6, 0, -90 + Math.floor(i / 7) * 4); m.rotation.y = Math.sin(L.T * 3 + i); }); badge('tag', 'WINZIG', W / 2, H * .14, L.lt - .3); }, [[0, 'wind', .6], [.6, 'shout_crowd', .4]]);
// 45 Den ersten Riesen schlug ich so hart…
shot(st(35), 'Z', null, L => { use('G'); put(MINE, 0, 0, -130, Math.PI); const k = clamp((L.lt - .5) / .25); applyPose(MINE, { aRx: lerp(.6, 1.6, k), aRe: lerp(2, .1, k), twist: lerp(.5, -.4, k), lean: .2 }); MINE.setFace({ custom: 'mine' }); put(gi[1], 0, 0, -152, 0); applyPose(gi[1], k >= 1 ? { lean: -.4, headX: -.6 } : {}); gface(gi[1], { open: k }, L.T);
  cm([10, 16, -110, 0, 22, -142, 56], [9.4, 16, -111, 0, 22, -142, 52], L.k); sh(V(0, 0, -140), 40); }, [[0, 'growl', .6], [.5, 'fist', 0], [.62, 'impact', 1], [.65, 'boom', .7]].filter(c => c[2]));
// 46 …dass sein Kopf abflog
shot(W2('Kopf', 35), 'C', null, L => { use('G'); put(gi[1], 0, 0, -152, 0); applyPose(gi[1], { lean: -.5, aLz: 1.2, aRz: 1.2 }); gi[1].head.visible = false; const n = gi[1].neck.getWorldPosition(V(0, 0, 0)); STM.at(n, L.T, 6, 1.4); headP.visible = true; headP.position.set(n.x + L.lt * 26, n.y + 10 * L.lt - 14 * L.lt * L.lt + 4, n.z - L.lt * 10); headP.rotation.set(L.T * 4, L.T * 3, 0);
  cm([10, 12, -100, 8, 20, -152, 58], [9, 12, -102, 10, 18, -152, 56], L.k); grade.uniforms.flash.value = clamp(.4 - L.lt); sh(n, 40); }, [[0, 'whoosh', .7], [.8, 'thud', .7], [1.2, 'cheer', .3]]);
// 47 Dann hob ich einen riesigen Felsen hoch…
shot(st(36), 'S', null, L => { use('G'); W1.hole.visible = true; W1.doors.forEach(d => d.visible = false); put(MINE, 0, 0, -170, Math.PI); const k = easeInOut(clamp(L.lt / 1.6)); applyPose(MINE, { aLx: lerp(.6, 2.8, k), aRx: lerp(.6, 2.8, k), aLe: .3, aRe: .3, crouch: lerp(1.2, 0, k), lean: -.2 * k }); MINE.setFace({ custom: 'mine' }); boulder.visible = true; boulder.scale.setScalar(1.5); boulder.position.copy(handP(MINE)).lerp(handP(MINE, 0), .5).add(V(0, 10, 0));
  cm([10, 8, -126, 0, 30, -170, 58], [9, 8, -128, 0, 32, -170, 56], L.k); sh(V(0, 0, -170), 40); }, [[0, 'strain', .7], [.6, 'rumble', .7], [1.4, 'growl', .5]]);
// 48 …und stopfte damit das Loch in der Mauer
shot(W2('stopfte', 36), 'Z', null, L => { use('G'); W1.doors.forEach(d => d.visible = false); const k = easeIn(clamp(L.lt / .9)); put(MINE, 0, 0, -178, Math.PI); applyPose(MINE, { aLx: 1.6, aRx: 1.6, lean: .5 * k, crouch: .6 }); MINE.setFace({ custom: 'mine' }); boulder.visible = true; boulder.scale.setScalar(1.6); boulder.position.set(0, lerp(26, 14, k), lerp(-182, -194, k)); W1.hole.visible = k < 1; dustAt(V(0, 4, -190), k >= 1 ? L.lt - .9 : 0, 1.6);
  cm([0, 10, -120, 0, 16, -194, 56], [0, 10, -124, 0, 16, -194, 54], L.k); grade.uniforms.flash.value = k >= 1 ? clamp(.4 - (L.lt - .9) * 2) : 0; sh(V(0, 0, -190), 40); badge('green', 'LOCH ZU!', W / 2, H * .16, L.lt - 1); }, [[0, 'whoosh_down', .6], [.9, 'boom', 1], [1.0, 'rubble', .7], [1.4, 'cheer', .5]]);
// 49 Einen Monat später… oben auf der Mauer (atardecer)
const WT = W1.H + 1.2;
shot(st(37), 'R', null, L => { use('G'); dusk(1); [hero, big, tall].forEach((c, i) => { sit(c, -6 + i * 4, WT + .6, -198.4, Math.PI, { lLx: 1.4, lRx: 1.4, lLk: .2 + Math.sin(L.T * 2 + i) * .3, lRk: .2 - Math.sin(L.T * 2 + i) * .3 }); face(c, { eyes: 'half', mouth: 'smile' }, L.T); });
  cm([18, WT + 20, -150, -2, WT, -198, 52], [16, WT + 18, -154, -2, WT, -198, 50], L.k); badge('tag', 'EINEN MONAT SPÄTER', W / 2, H * .14, L.lt - .2); sh(V(0, WT, -198), 20); }, [[0, 'wind', .6], [.4, 'birds', .5], [1.4, 'cloth', .3]]);
shot(W2('oben', 37), 'C', null, L => { use('G'); dusk(1); [hero, big, tall].forEach((c, i) => { sit(c, -6 + i * 4, WT + .6, -198.4, Math.PI, { lLx: 1.4, lRx: 1.4, lLk: .2 + Math.sin(L.T * 2 + i) * .3 }); face(c, { eyes: 'half', mouth: i ? 'flat' : 'smile' }, L.T); }); cm([-2, WT + 4, -212, -2, WT + 2, -198, 52], [-2, WT + 4, -211, -2, WT + 2, -198, 50], L.k); }, [[0, 'wind', .5], [.6, 'sigh', .4]]);
// 50 Der Große, Stille schaute in den Himmel
shot(st(38), 'Z', null, L => { use('G'); dusk(1); sit(big, -2, WT + .6, -198.4, Math.PI, { headX: -.5 }); face(big, { eyes: 'half', mouth: 'flat', look: [0, -1] }, L.T); onFace(big, 8, -.4, 2, 46, L.k, 6.6); }, [[0, 'wind', .5], [.8, 'hmm', .3]]);
// 51 „Ich bin der, der das Tor eingetreten hat.“
shot(st(39), 'S', 'slow', L => { use('G'); dusk(1); sit(big, -2, WT + .6, -198.4, Math.PI, {}); talkFace(big, L.T, L.t0, L.t1, { eyes: 'half', mouth: 'flat' }); onFace(big, 8, .2, -1.4, 44, L.k, 4.8); }, [[.3, 'heartbeat', .4]]);
// 52 „Und er ist der mit der Metallhaut.“
shot(st(40), 'C', null, L => { use('G'); dusk(1); sit(tall, 2, WT + .6, -198.4, Math.PI, { headY: .4 }); face(tall, { eyes: 'half', mouth: 'smirk' }, L.T); onFace(tall, 7, .2, 1.4, 44, L.k, 5.6); badge('tag', 'METALLHAUT', W / 2, H * .14, L.lt - .3); }, [[0, 'metal_hit', .5], [.6, 'tension_str', .4]]);
// 53 Er sagte es, als würde er mir die Uhrzeit sagen
shot(st(41), 'Z', null, L => { use('G'); dusk(1); sit(hero, -6, WT + .6, -198.4, Math.PI, { headY: -.6 }); face(hero, { eyes: 'wide', mouth: 'o', look: [.8, 0] }, L.T); onFace(hero, 7, .3, -1, 44, L.k, 5.6); }, [[0, 'clock_tick', .6], [.6, 'clock_tick', .5], [1.2, 'clock_tick', .5]]);
// 54 Dann schlug der Blitz ein
shot(st(42), 'F', null, L => { use('G'); dusk(.7); bolt.visible = Math.sin(L.lt * 40) > -.4; bolt.position.set(10, WT + 120, -198); bolt.scale.setScalar(1.6); grade.uniforms.flash.value = clamp(.8 - L.lt * 1.2); STM.at(V(10, WT, -198), L.T, 10, 2);
  cm([30, WT + 6, -160, 8, WT + 20, -198, 58], [30, WT + 6, -162, 8, WT + 20, -198, 56], L.k); }, [[0, 'zap', 1], [.05, 'boom', .9], [.4, 'rumble', .7]]);
// 55 Sie besiegten mich… (pelea: rojo y metal contra mi gigante)
shot(st(43), 'S', null, L => { use('G'); dusk(.7); put(MINE, 0, 0, -150, Math.PI / 2); applyPose(MINE, { lean: -.4, aLz: 1.2, aRz: 1.2, headX: -.4 }); MINE.setFace({ custom: 'mine' }); put(MET, -16, 0, -150, Math.PI / 2); const k = clamp(L.lt / .6); applyPose(MET, { aRx: lerp(.4, 1.6, k), aRe: lerp(2, .1, k), lean: .3 }); MET.setFace({ custom: 'metal' }); put(RED, 30, -20, -230, -.6); applyPose(RED, { aRx: 2, aLx: 1.4 }); RED.setFace({ custom: 'skinless' }); steam(RED, L.T);
  cm([-6, 10, -110, -6, 24, -150, 58], [-6, 10, -114, -6, 24, -150, 56], L.k); sh(V(-8, 0, -150), 40); }, [[0, 'growl', .6], [.55, 'impact', 1], [.6, 'metal_hit', .7], [1.2, 'roar', .6]]);
// 56 …rissen mich aus meinem Riesen
shot(W2('rissen', 43), 'W', null, L => { use('NAP'); const k = easeOut(clamp(L.lt / .8)); put(hero, NX, 4 + k * 8, -k * 4, 0); applyPose(hero, { aLz: 1.6, aRz: 1.6, lLx: .4, lRx: -.3 }); face(hero, { eyes: 'squint', mouth: 'shout' }, L.T); arm.visible = true; arm.scale.set(1, 1, 1); arm.material = MET.spec ? arm.material : arm.material; arm.position.set(NX, 12 + k * 8, -2 - k * 4);
  cam([NX + 8, 10, 14], [NX, 8 + k * 6, -2], 54); }, [[0, 'rip', .8], [.3, 'squelch', 0], [.5, 'shout_m', .6]].filter(c => c[2]));
// 57 …und schleppten mich gefesselt auf ein offenes Feld (noche)
shot(W2('schleppten', 43), 'R', null, L => { use('FLD'); night(1); put(hero, FX, 0, 0, 0); applyPose(hero, { crouch: .9, lLx: 1.4, lLk: 2.2, lRx: 1.4, lRk: 2.2, aLx: .8, aRx: .8, aLz: -.5, aRz: -.5, aLe: .6, aRe: .6, lean: .3 }); face(hero, { eyes: 'squint', mouth: 'frown', brows: .5 }, L.T); rope.visible = true; rope.position.copy(handP(hero)).lerp(handP(hero, 0), .5);
  put(big, FX - 6, 0, -6, .5); applyPose(big, {}); face(big, { eyes: 'half', mouth: 'flat' }, L.T); put(tall, FX + 6, 0, -6, -.5); applyPose(tall, { aLz: .2 }); face(tall, { eyes: 'half', mouth: 'smirk' }, L.T);
  cm([FX + 4, 8, 16, FX, 3, -2, 54], [FX + 3.4, 8, 15, FX, 3, -2, 52], L.k); badge('tag', 'GEFESSELT', W / 2, H * .14, L.lt - .3); sh(V(FX, 0, -2), 20); }, [[0, 'crickets', .6], [.4, 'rope', 0], [.6, 'owl', .4], [1.2, 'wind', .5]].filter(c => c[2]));
// 58 Und da kam jemand aus den Bäumen
shot(st(44), 'S', 'slow', L => { use('FLD'); night(1); gwalk(SMI, FX + 4, -80, Math.PI * 1.05, L.T, L.lt, .8); SMI.setFace({ custom: 'smiler' }); put(hero, FX, 0, 0, Math.PI); applyPose(hero, { crouch: .9, lLx: 1.4, lLk: 2.2, lRx: 1.4, lRk: 2.2, headX: -.3 }); face(hero, { eyes: 'wide', mouth: 'o' }, L.T);
  cm([FX - 4, 3, 10, FX + 4, 14, -70, 56], [FX - 4, 3.4, 9, FX + 4, 16, -70, 50], L.k); sh(V(FX, 0, -40), 50); }, [[0, 'leaves', 0], [0, 'steps_heavy', .6], [1.0, 'steps_heavy', .6]].filter(c => c[2]));
// 59 Der Grinsende.
shot(st(45), 'C', null, L => { use('FLD'); night(1); put(SMI, FX + 4, 0, -60, Math.PI); applyPose(SMI, { headX: .3 }); SMI.setFace({ custom: 'smiler' }); const h = hp(SMI).add(V(0, 3, 0)); cam([h.x - 2, h.y - 2, h.z - lerp(18, 14, L.k)], [h.x, h.y, h.z], 42); }, [[0, 'creepy_ting', .8], [.4, 'heartbeat', .6]]);
// 60 Dasselbe Grinsen. (recuerdo en sepia: el mismo gigante con la madre)
shot(st(46), 'F', null, L => { use('G'); grade.uniforms.sepia.value = .85; put(SMI, HX + 10, 0, HZ - 10, -1.2); applyPose(SMI, { aRx: 2.2, aRe: .5 }); SMI.setFace({ custom: 'smiler', open: .6 }); put(mom, 0, 0, 0, 0); mom.root.position.copy(handP(SMI)).add(V(0, -2, 0)); applyPose(mom, { aLz: 1.6, aRz: 1.6 }); face(mom, { eyes: 'wide', mouth: 'shout' }, L.T); cm([HX + 18, 4, HZ + 40, HX + 8, 14, HZ - 8, 50], [HX + 18, 4, HZ + 42, HX + 8, 15, HZ - 8, 48], L.k); }, [[0, 'flash', .5], [.3, 'scream_girl', .4]]);
// 61 Fünf Jahre später, und wieder konnte ich nichts tun
shot(st(47), 'Z', null, L => { use('FLD'); night(1); put(hero, FX, 0, 0, 0); applyPose(hero, { crouch: .9, lLx: 1.4, lLk: 2.2, lRx: 1.4, lRk: 2.2, aLx: .8, aRx: .8, aLz: -.5, aRz: -.5, headX: .4 }); face(hero, { eyes: 'squint', mouth: 'frown', brows: -.8, tears: 1 }, L.T); onFace(hero, 7, .8, 1, 46, L.k, 5.6); badge('tag', '5 JAHRE SPÄTER', W / 2, H * .14, L.lt - .2); }, [[0, 'sad_tone', .7], [.6, 'sniff', .5]]);
// 62 Also schlug ich mit der bloßen Faust zu
shot(st(48), 'S', null, L => { use('FLD'); night(1); put(SMI, FX + 2, 0, -12, Math.PI); const k = clamp((L.lt - .6) / .2); applyPose(SMI, { lean: .5, crouch: 1.2, aRx: 1.2, aRe: .2 }); SMI.setFace({ custom: 'smiler' }); const hand = handP(SMI); put(hero, hand.x - 2, 0, hand.z + 2.4, Math.PI - .4); applyPose(hero, { aRx: lerp(.4, 1.6, k), aRe: lerp(2, 0, k), lean: .3, lLx: .6, lRk: .6 }); face(hero, { eyes: 'squint', mouth: 'teeth', brows: 1, veins: 1 }, L.T);
  cm([hand.x + 8, 5, hand.z + 8, hand.x - 1, 3, hand.z, 50], [hand.x + 7, 5, hand.z + 7, hand.x - 1, 3, hand.z, 48], L.k); }, [[0, 'growl', .4], [.6, 'fist', 0], [.75, 'impact', 1]].filter(c => c[2]));
// 63 …wie ein riesiger Glockenschlag über das Feld (anillo de luz; zoom lento)
shot(st(49), 'W', 'slow', L => { use('FLD'); night(1); const r = FLD.userData.ring; r.visible = true; r.scale.setScalar(4 + L.lt * 60); r.material.opacity = clamp(1.2 - L.lt * .4); put(hero, FX, 0, 0, Math.PI); applyPose(hero, { aRx: 1.6, lean: .3 }); face(hero, { eyes: 'wide', mouth: 'o' }, L.T); for (let i = 0; i < 6; i++) { put(gi[i], FX + Math.cos(i * 1.05) * 70, 0, Math.sin(i * 1.05) * 70, -i * 1.05 - Math.PI / 2); applyPose(gi[i], idlePose(L.T, i)); }
  cm([FX + 6, 30, 50, FX, 0, -10, 58], [FX + 6, 40, 60, FX, 0, -10, 56], L.k); badge('big', 'DONG!', W / 2, H * .15, L.lt - .05); sh(V(FX, 0, 0), 60); }, [[0, 'bell_big', 1], [.2, 'magic_hit', .6]]);
// 64 Jeder Riese blieb stehen.
shot(st(50), 'C', null, L => { use('FLD'); night(1); for (let i = 0; i < 4; i++) { put(gi[i], FX - 30 + i * 20, 0, -50 - (i % 2) * 10, 0); applyPose(gi[i], { aLz: .1, aRz: .1, headX: -.1 }); gface(gi[i], { look: [0, 0] }, L.T); } cm([FX, 6, 10, FX, 18, -50, 58], [FX, 6, 8, FX, 18, -50, 56], L.k); }, [[0, 'silence_tick', .6], [.6, 'heartbeat', .6]]);
// 65 Jeder Riese drehte sich um.
shot(st(51), 'S', null, L => { use('FLD'); night(1); const k = easeInOut(clamp(L.lt / 1)); for (let i = 0; i < 4; i++) { put(gi[i], FX - 30 + i * 20, 0, -50 - (i % 2) * 10, lerp(0, Math.PI, k)); applyPose(gi[i], {}); gface(gi[i], { open: k * .4 }, L.T); } put(SMI, FX, 0, -110, 0); applyPose(SMI, {}); SMI.setFace({ custom: 'smiler' });
  cm([FX + 30, 10, 0, FX, 14, -70, 58], [FX + 29, 10, -1, FX, 14, -70, 56], L.k); sh(V(FX, 0, -60), 60); }, [[0, 'whoosh', .6], [.4, 'steps_heavy', .7], [1.0, 'growl', .5]]);
// 66 Und sie fraßen ihn.
shot(st(52), 'W', null, L => { use('FLD'); night(1); put(SMI, FX, 0, -110, 0); applyPose(SMI, { aLz: 1.6, aRz: 1.6, lean: -.3 }); SMI.setFace({ custom: 'smiler', open: 1 }); for (let i = 0; i < 5; i++) { const a = i * 1.25; put(gi[i], FX + Math.cos(a) * 10, 0, -110 + Math.sin(a) * 10, -a - Math.PI / 2); applyPose(gi[i], { lean: .6, aRx: 1.6, aLx: 1.6, crouch: .4 }); gface(gi[i], { open: 1 }, L.T); } STM.at(V(FX, 20, -110), L.T, 14, 2);
  cm([FX + 40, 16, -60, FX, 18, -110, 58], [FX + 38, 16, -62, FX, 18, -110, 56], L.k); }, [[0, 'growl', .8], [.3, 'crunch', 0], [.4, 'roar', .7], [1.0, 'scream_girl', .4]].filter(c => c[2]));
// 67 Ich lachte so sehr, dass ich weinte
shot(st(53), 'Z', null, L => { use('FLD'); night(1); put(hero, FX, 0, 0, 0); applyPose(hero, { crouch: .9, lLx: 1.4, lLk: 2.2, lRx: 1.4, lRk: 2.2, lean: -.2 + Math.sin(L.T * 16) * .05, headX: -.3 }); face(hero, { eyes: 'happy', mouth: 'grin', tears: 1 }, L.T); onFace(hero, 7, .6, 1.2, 46, L.k, 5.6); }, [[0, 'laugh_m', .8], [.8, 'laugh_deep', .5], [1.6, 'sniff', .4]]);
// 68 Dann rannten sie auf meine zwei Freunde los…
shot(st(54), 'S', null, L => { use('FLD'); night(1); for (let i = 0; i < 4; i++) { gwalk(gi[i], FX - 20 + i * 12, -60, .1, L.T + i, L.lt, 3); gface(gi[i], { open: .6 }, L.T); } walkTo(big, FX - 4, -20, 0, L.T, L.lt, 7, true); face(big, { eyes: 'wide', mouth: 'shout' }, L.T); walkTo(tall, FX + 4, -18, 0, L.T + .3, L.lt, 7, true); face(tall, { eyes: 'wide', mouth: 'shout' }, L.T);
  cm([FX + 20, 8, 20, FX, 10, -30, 58], [FX + 19, 8, 19, FX, 10, -30, 56], L.k); sh(V(FX, 0, -30), 50); }, [[0, 'steps_heavy', .9], [.5, 'growl', .6], [1.2, 'steps_heavy', .8]]);
shot(W2('die', 54), 'C', null, L => { use('FLD'); night(1); walkTo(big, FX - 3, 0, 0, L.T, L.lt, 8, true); face(big, { eyes: 'wide', mouth: 'shout', sweat: 1 }, L.T); walkTo(tall, FX + 3, 2, 0, L.T + .3, L.lt, 8, true); face(tall, { eyes: 'wide', mouth: 'shout', sweat: 1 }, L.T); const p = big.root.position; cm([p.x + 3, 4, p.z + 12, p.x + 2, 4, p.z, 52], [p.x + 3, 4, p.z + 12, p.x + 2, 4, p.z, 50], L.k); }, [[0, 'steps_run', .8], [.4, 'shout_m', .5], [1.0, 'crowd_run', .4]]);
// 69 So holten wir uns die Stadt zurück (amanecer, soldados en la muralla)
shot(st(55), 'R', null, L => { use('G'); dusk(.5); for (let i = 0; i < 6; i++) { const c = [hero, bud, capt, ex[0], ex[1], ex[2]][i]; put(c, -12 + i * 4.6, WT, -198, 0); applyPose(c, CHEER); face(c, { eyes: 'happy', mouth: 'grin' }, L.T + i); }
  cm([0, WT + 8, -160, 0, WT + 4, -198, 54], [0, WT + 7, -164, 0, WT + 4, -198, 52], L.k); badge('green', 'STADT ZURÜCK', W / 2, H * .16, L.lt - .3); sh(V(0, WT, -198), 30); }, [[0, 'cheer', .9], [.5, 'bell_far', .5], [1.2, 'shout_crowd', .5]]);
// 70 In der Nacht ging ich nach Hause…
shot(st(56), 'W', null, L => { use('G'); night(1); walkTo(hero, -6, -60, Math.PI, L.T, L.lt, 2, false, .5); face(hero, { eyes: 'half', mouth: 'flat' }, L.T); const p = hero.root.position; cm([p.x + 4, 4, p.z + 12, p.x, 4, p.z, 52], [p.x + 3.4, 4, p.z + 11, p.x, 4, p.z, 50], L.k); sh(p, 20); }, [[0, 'steps', .6], [.6, 'crickets', .4], [1.2, 'owl', .3]]);
// 71 …und steckte den Schlüssel in die Kellertür
shot(W2('steckte', 56), 'Z', null, L => { use('BAS'); put(hero, BX - 8, 0, 9, Math.PI * .9); applyPose(hero, { aRx: 1.4, aRe: .4, lean: .2 }); face(hero, { eyes: 'squint', mouth: 'flat' }, L.T); const lk = BAS.lock.getWorldPosition(V(0, 0, 0)); cam([lk.x + 2.4, lk.y + 1, lk.z + 3.4], [lk.x, lk.y, lk.z], 40); badge('tag', 'KLICK', W / 2, H * .14, L.lt - .6); }, [[0, 'keys', .7], [.6, 'click_metal', .9], [1.0, 'door_creak', .7]]);
// 72 Drinnen lagen ein Buch und ein Foto
shot(st(57), 'S', null, L => { use('BAS'); put(hero, BX - 2, 0, -3, Math.PI); applyPose(hero, { headX: .4 }); face(hero, { eyes: 'wide', mouth: 'o', look: [0, .6] }, L.T); cm([BX + 6, 9, 4, BX, 4.6, -8, 50], [BX + 5.4, 8.6, 3, BX, 4.6, -8, 48], L.k); }, [[0, 'fire_crackle', .5], [.6, 'pages', .5]]);
// 73 Im Buch stand: Jeder Riese war früher ein Mensch (zoom lento → golpe)
shot(st(58), 'Z', 'slow', L => { use('BAS'); const b = BAS.book.getWorldPosition(V(0, 0, 0)); cam([b.x + .4, b.y + lerp(5, 2.6, easeIn(L.k)), b.z + 1.2], [b.x, b.y, b.z], 44); badge('red', 'JEDER RIESE WAR EIN MENSCH', W / 2, H * .62, L.lt - (st(59) - L.t0)); put(hero, BX - 2, 0, -3, Math.PI); }, [[0, 'pages', .7], [.8, 'heartbeat', .5]]);
// 74 Auf dem Foto stand mein Vater neben einer Frau
shot(st(60), 'C', null, L => { use('BAS'); const p = BAS.photo.getWorldPosition(V(0, 0, 0)); cam([p.x + .3, p.y + .5, p.z + lerp(3.4, 2.8, L.k)], [p.x, p.y, p.z], 44); grade.uniforms.sepia.value = .3; }, [[0, 'paper', .6], [.6, 'tension_str', .5]]);
// 75 Sie hatte das breiteste Grinsen, das ich je gesehen habe (zoom lento → golpe)
shot(st(61), 'S', 'slow', L => { use('BAS'); const p = BAS.photo.getWorldPosition(V(0, 0, 0)).add(V(.32, .12, 0)); cam([p.x, p.y + .2, p.z + lerp(2.4, .9, easeIn(L.k))], [p.x, p.y, p.z], 40); grade.uniforms.sepia.value = .3; }, [[0, 'creepy_ting', .6]]);
// 76 Dann kletterte ich auf die Mauer und schaute darüber
shot(st(62), 'W', null, L => { use('SEA'); day(.9); const k = easeInOut(clamp(L.lt / 2)); put(hero, SX, lerp(20, 60, k), 8, Math.PI); applyPose(hero, { aRx: 2.8, aLx: 2.8, aRe: .2, lLx: .8, lLk: 1, lean: -.1 }); face(hero, { eyes: 'squint', mouth: 'teeth' }, L.T); cableTo(0, handP(hero), V(SX, 62, 6));
  cam([SX + 10, hero.root.position.y - 4, 30], [SX, hero.root.position.y + 2, 6], 54); sh(V(SX, 50, 6), 30); }, [[0, 'zip', .7], [.4, 'ratchet', .5], [1.2, 'wind', .6]]);
// 77 Als Erster seit hundert Jahren
shot(st(63), 'Z', null, L => { use('SEA'); day(1); put(hero, SX, 60, -2, Math.PI); applyPose(hero, { aLz: .3, aRz: .3 }); hero.props.cloak.rotation.x = .3 + Math.sin(L.T * 4) * .1; cm([SX + 4, 66, 12, SX, 63, -40, 54], [SX + 3, 66, 10, SX, 63, -40, 52], L.k); badge('tag', 'ALS ERSTER SEIT 100 JAHREN', W / 2, H * .14, L.lt - .3); }, [[0, 'wind', .8], [.6, 'heartbeat', .5]]);
// 78 Wasser. Bis zum Himmel. (revelación del mar)
shot(st(64), 'F', null, L => { use('SEA'); day(1); grade.uniforms.sat.value = 1.6; put(hero, SX, 60, -2, Math.PI); applyPose(hero, { aLz: .3, aRz: .3 }); cm([SX, 64, 6, SX, 52, -300, 64], [SX, 66, 4, SX, 54, -320, 62], L.k); badge('big', 'WASSER', W / 2, H * .15, L.lt - .2); }, [[0, 'sunrise_shine', .8], [.2, 'water_bloop', 0], [.4, 'wind', .5]].filter(c => c[2]));
// 79 Niemand hatte uns je von Wasser erzählt
shot(st(66), 'S', null, L => { use('SEA'); day(1); put(hero, SX, 60, -2, 0); applyPose(hero, {}); face(hero, { eyes: 'wide', mouth: 'o', tears: 1 }, L.T); onFace(hero, 7, .4, 1.4, 46, L.k, 6); }, [[0, 'wind', .6], [.8, 'birds', .5]]);
// 80 Meiner Mutter hätte es gefallen
shot(st(67), 'C', null, L => { use('SEA'); day(1); put(hero, SX, 60, -2, 0); applyPose(hero, { aRx: 1.2, aRe: 1.6, headX: .3 }); face(hero, { eyes: 'half', mouth: 'smile', tears: 1 }, L.T); onFace(hero, 6, .2, -1.2, 44, L.k, 5); grade.uniforms.sepia.value = .15; }, [[0, 'musicbox2', 0], [0, 'sniff', .5], [.8, 'ding_soft', .4]].filter(c => c[2]));
// 81 Und weit draußen auf dem Wasser war ein Schiff
shot(st(68), 'W', null, L => { use('SEA'); day(1); SEA.ship.position.set(30, 4, -900); put(hero, SX, 60, -2, Math.PI); applyPose(hero, { aRx: 1.6, aRe: .1 }); cm([SX - 3, 67, 4, SX + 30, 20, -900, 30], [SX - 3, 67, 4, SX + 30, 20, -900, 22], L.k); badge('tag', 'EIN SCHIFF', W / 2, H * .14, L.lt - .3); }, [[0, 'wind', .6], [.6, 'bell_far', .5]]);
// 82 Es kam direkt auf uns zu (zoom lento + golpe final)
shot(st(69), 'Z', 'slow', L => { use('SEA'); day(1); SEA.ship.position.set(30, 4, lerp(-700, -400, L.k)); cm([SX - 3, 67, 4, SX + 30, 18, -600, 30], [SX - 3, 67, 4, SX + 30, 14, -450, 18], L.k, easeIn); if (L.lt > .6) badge('big', 'TEIL 2?', W / 2, H * .16, L.lt - .6); }, [[0, 'tension_str', .6], [.6, 'bells', .4]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 }, TR_SFX = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .05, s: ['zoom_in', 'whoosh_soft', 'zoom_out'][i % 3], g: .35 });
  if (!s.zoom && i > 1 && i % 3 === 0) { const d = (S[i + 1]?.t0 ?? DUR) - s.t0; CUES.push({ t: +(s.t0 + d * .45).toFixed(3), s: ['impact_soft', 'thump', 'zoom_in'][(i / 3) % 3], g: .6 }); }
  if (s.tr) CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS).toFixed(3), s: TR_SFX[s.tr], g: .8 }); });
CUES.push({ t: .25, s: 'riser', g: .9, d: +(st(2) - .3).toFixed(3) }); CUES.push({ t: st(2) - .02, s: 'braam', g: 1 });   // gancho
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
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;


// ---------- portada para TikTok (1080×1920) ----------
window.renderCover = (variant = 0) => {
  hideAll(); BAD.length = 0; use('G'); dusk(.55); W1.crack.visible = true;
  put(RED, 0, 30, -214, 0); applyPose(RED, { aRx: 2.9, aRe: .9, aLx: 2.9, aLe: .9, headX: .25 }); RED.setFace({ custom: 'skinless', look: [0, 1] }); STM.at(hp(RED), 2.3, 9, 1.8);
  put(hero, 2.2, 0, -112, Math.PI + .3); applyPose(hero, { headX: -.55, aRx: .2, aLz: .25, aRz: .1 }); blades(hero); hero.props.cloak.rotation.x = .35;
  for (let i = 0; i < 4; i++) { put(ex[i], -10 + i * 6.5, 0, -150 - (i % 2) * 4, Math.PI + (i - 1.5) * .2); applyPose(ex[i], { headX: -.6, aLz: 1.2, aRz: 1.2, lean: -.2 }); face(ex[i], { eyes: 'wide', mouth: 'shout' }, i); }
  cam([4, 7, -98], [0, 66, -210], 50); camera.updateProjectionMatrix(); grade.uniforms.vig.value = .62; grade.uniforms.sat.value = 1.6; bloom.strength = .35; sh(V(0, 0, -170), 50);
  sky.sky.position.copy(camera.position); composer.render();
  const c = octx; c.save(); c.drawImage(renderer.domElement, 0, 0, W, H);
  const g = c.createLinearGradient(0, 0, 0, H * .3); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H * .3);
  const g2 = c.createLinearGradient(0, H * .72, 0, H); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,.6)'); c.fillStyle = g2; c.fillRect(0, H * .72, W, H * .28);
  const T = (s, x, y, size, fill, rot = 0, lw = .22) => { c.save(); c.translate(x, y); c.rotate(rot); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; const tw = c.measureText(s).width; if (tw > W * .92) { const k = W * .92 / tw; c.scale(k, k); } c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.shadowOffsetY = 10; c.lineWidth = size * lw; c.strokeStyle = '#000'; c.strokeText(s, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = fill; c.fillText(s, 0, 0); c.restore(); };
  T(variant ? 'NIEMAND HAT' : 'WAS IST HINTER', W / 2, H * .085, 118, '#ffffff', -.02); T(variant ? 'JE DARÜBER GESCHAUT' : 'DER MAUER?', W / 2, H * .155, 150, '#E2FD07', -.02);
  c.save(); c.translate(W / 2, H * .885); c.rotate(.03); c.font = `700 84px ${FONT}`; const tw = c.measureText('SEIT 100 JAHREN').width + 90; c.fillStyle = '#d6202f'; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.beginPath(); c.roundRect(-tw / 2, -62, tw, 124, 30); c.fill(); c.shadowBlur = 0; c.lineWidth = 10; c.strokeStyle = '#fff'; c.stroke(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SEIT 100 JAHREN', 0, 6); c.restore();
  // flecha hacia el gigante
  const h = proj(hp(RED).add(V(0, 8, 0))); c.save(); c.translate(W * .84, H * .25); c.rotate(-2.5); c.fillStyle = '#E2FD07'; c.strokeStyle = '#000'; c.lineWidth = 12; c.beginPath(); c.moveTo(-20, 0); c.lineTo(110, 0); c.lineTo(110, -40); c.lineTo(190, 30); c.lineTo(110, 100); c.lineTo(110, 60); c.lineTo(-20, 60); c.closePath(); c.stroke(); c.fill(); c.restore(); c.restore();
};

