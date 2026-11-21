// Dunkel — planos sincronizados con audio/words.json (1080×1920, 30 fps). Cambio de escena al empezar cada frase, ~1,9 s por plano.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeKumpel } from './gvolk.js';
import { lichtplatz, gasse, leitstelle, fenster, polizei, lluvia, chispas, rayo, cityLights, towerPos, towerAng, drawClock, sign, LIT, NT } from './dstadt.js';
import { makeIch, makePapa, makeBenno, makeWache, makeTechniker, makePolizist, makeOma, makeKind, makeNachbar, flashlight, radio } from './dvolk.js';
import { makeMonster, poseMonster, MPOSE, mixM, palm, outline, SC } from './monster.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, actuar, mirar, caminar, saltar, aire, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 142.4, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x1a2448, .0011);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); { const st = sky.sky.material.uniforms.stars.value; st.wrapS = st.wrapT = THREE.RepeatWrapping; st.needsUpdate = true; const m = sky.sky.material; m.fragmentShader = m.fragmentShader.replace('* .9;', '* .3;'); m.needsUpdate = true; }
const hemi = new THREE.HemisphereLight(0x8aa8ff, 0x2a2a40, .9); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xb8c8ff, 1.1); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene); rim.color.set(0x9fc8ff);
// focos de las torres sobre el monstruo (4 SpotLight sin sombra) + luz de relleno que acompaña a la cámara (los personajes siempre se leen)
const SPOTS = [0, 2, 4, 6].map(k => { const s = new THREE.SpotLight(0xfff4e0, 0, 0, .42, .6, 1); const p = towerPos(k); s.position.set(p.x * .95, 38, p.z * .95); s.target.position.set(0, 28, 0); scene.add(s, s.target); return s; });
const FILL = new THREE.PointLight(0xe8eeff, 0, 0, 1.2); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-90, 160, 60)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const GX = 1500, LX = 1800, FX = 2100;
const LP = lichtplatz(scene), GA = gasse(scene, GX), LS = leitstelle(scene, LX), FE = fenster(scene, FX);
const SETS = { LP: LP.G, GA: GA.g, LS: LS.g, FE: FE.g };
const CARS = Array.from({ length: 20 }, () => polizei(scene)); CARS.forEach(c => outline(c, .035));
const RAIN = lluvia(scene), SPARK = chispas(scene), SPLASH = chispas(scene, 160, new THREE.Color(.8, .9, 1.1)), BOLT = rayo(scene);
// ---------- el monstruo ----------
const MON = makeMonster(scene); outline(MON.root, .06);
// ---------- reparto ----------
const ich = makeIch(scene); ich.root.rotation.order = 'YXZ'; const _i0 = 0, papa = makePapa(scene), benno = makeBenno(scene), tech = makeTechniker(scene), oma = makeOma(scene), kind = makeKind(scene), nach = makeNachbar(scene);
const WA = Array.from({ length: 6 }, (_, i) => makeWache(scene, i)); const PO = [makePolizist(scene, 0), makePolizist(scene, 1)]; const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i));
kitFace(ich, 'kid'); kitFace(papa, 'mustache'); kitFace(benno, 'plain'); kitFace(tech, 'plain'); kitFace(oma, 'girl'); kitFace(kind, 'kid'); kitFace(nach, 'mustache');
WA.forEach(c => kitFace(c, c.kit)); PO.forEach((c, i) => kitFace(c, ['plain', 'girl'][i])); K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i]));
const POOL = [ich, papa, benno, tech, oma, kind, nach, ...WA, ...PO, ...K]; POOL.forEach(c => outline(c.root, .028));
// ---------- atrezo ----------
const FL = Array.from({ length: 8 }, () => flashlight(scene)); const RAD = radio(scene); FL.forEach(f => outline(f, .015));
const MUG = (() => { const g = new THREE.Group(); scene.add(g); cyl(.35, .32, .7, mat(0xd8323a, { roughness: .3 }), 14, g, 0, 0, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.2, .06, 6, 12), mat(0xd8323a)); h.position.x = .38; g.add(h); return g; })();
const PHONE = (() => { const g = new THREE.Group(); scene.add(g); box(.5, 1, .08, mat(0x1a1a22, { metalness: .6 }), .05, g, 0, 0, 0); const l = sphere(.08, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 4, toneMapped: false }), g, .15, .38, -.05, 6, 4); return g; })();
const BLAMP = (() => { const g = new THREE.Group(); scene.add(g); cyl(.15, .3, .9, mat(0xd8b070), 10, g, 0, .45, 0); const s = new THREE.Mesh(new THREE.CylinderGeometry(.5, .8, .8, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xfff0c8, emissive: 0xffd890, emissiveIntensity: 2.5, side: THREE.DoubleSide, toneMapped: false })); s.position.y = 1.2; g.add(s); return g; })();
const WATCH = textPlane(1, 1, 200, 200, () => {}); scene.add(WATCH);
const SWEAT = sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8);
const PROPS = [...CARS, ...FL, RAD, MUG, PHONE, BLAMP, WATCH, SWEAT];
// ---------- ambiente ----------
const AIR = aire(scene, 300);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'night', WET = 0;
function night(k = 1) { MODE = 'night'; setSky([.02, .04, .14], [.06, .1, .3], [.16, .2, .42]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = .9; hemi.color.setRGB(.55, .66, 1); hemi.groundColor.setRGB(.18, .18, .28); sun.intensity = 1.1; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0011; bloom.strength = .26; bloom.threshold = .93; renderer.toneMappingExposure = .92; cityLights(k); towersOn(1); SPOTS.forEach(s => s.intensity = 130); FILL.intensity = 16; }
function day() { MODE = 'day'; renderer.toneMappingExposure = .95; setSky([.22, .5, .95], [.5, .74, 1], [.84, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.3; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.5, .5, .45); sun.intensity = 2.6; sun.color.setRGB(1, .95, .86); rim.intensity = 1.1;
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0009; bloom.strength = .22; bloom.threshold = .9; cityLights(0); SPOTS.forEach(s => s.intensity = 0); FILL.intensity = 60; }
function dawn() { day(); setSky([.25, .35, .75], [.85, .6, .7], [1, .72, .45]); sun.color.setRGB(1, .78, .5); sun.intensity = 2.2; hemi.intensity = 1.0; scene.fog.color.setRGB(.95, .8, .7); bloom.strength = .35; }
function inside(h = .7) { MODE = 'in'; hemi.intensity = h * .8; sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; renderer.toneMappingExposure = .9; scene.fog.density = .0002; SPOTS.forEach(s => s.intensity = 0); FILL.intensity = 120; }
function towersOn(v, only = null) { LP.towers.forEach((t, k) => t.set(only ? (only.includes(k) ? v : 1) : v)); }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.props.vest) c.props.vest.visible = false; }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  FL.forEach(f => f.userData.on(1)); CARS.forEach(c => c.userData.set(1, 0));
  for (const k in SETS) SETS[k].visible = false; LP.GUARD.visible = true; MON.root.visible = false; MON.root.position.set(0, 0, 0); MON.root.rotation.set(0, 0, 0); MON.root.scale.setScalar(SC); MON.glow(0); poseMonster(MON, MPOSE.frozen);
  RAIN.update(0, V(0, 0, 0), 0); SPARK.update(V(0, 0, 0), -1); SPLASH.update(V(0, 0, 0), -1); BOLT.visible = false; LP.alarmM.emissiveIntensity = .4; LP.VKhot.emissiveIntensity = 0; LP.towers.forEach(t => t.hot.emissiveIntensity = 0);
  LS.LA.intensity = 0; LS.alarm.emissiveIntensity = .3; FE.L.intensity = 0; setWet(0); DARK = 0; papa.root.traverse(m => { if (m.userData.sk0) m.material.color.setHex(0xf0c09c); }); LP.towers[1].gen.children.forEach(m => { if (m.material && m.material.emissive && m.material.color.getHex() === 0x2f8a4a) m.material.emissiveIntensity = 0; });
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.4; grade.uniforms.sharp.value = 1.1; grade.uniforms.sepia.value = 0; night(); }
function setWet(k) { WET = k; LP.pm.roughness = lerp(.7, .42, k); LP.pm.color.setScalar(lerp(1, .7, k)); LP.ground.material.roughness = lerp(.85, .45, k); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
// estado de las luces de la historia: todas encendidas; a las 46,3 s revienta la torre 3; a las 81,3 s se apaga toda la ciudad (y las torres)
const BOOM = 46.3, BLACK = 81.3;
function lights(T) { if (T >= BLACK) { cityLights(0); towersOn(0); SPOTS.forEach(s => s.intensity = 110); } else if (T >= BOOM) LP.towers[3].set(0); }
const plaza = (L) => { use('LP'); MON.root.visible = true; if (L) lights(L.T); };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
// linterna en la mano derecha (apunta hacia delante cuando el brazo está levantado)
const torch = (i, ch, r = 1, on = 1) => { const f = attach(FL[i], (r ? ch.aR : ch.aL).hand, [0, -.5, .15], [Math.PI, 0, 0], .9); f.userData.on(on); return f; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .4 + dy, h.z + fz * d - fx * side], [h.x, h.y - .6, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'half' : 'down';
    case 'happy': case 'smile': case 'relief': return n > -.3 ? 'happy' : 'half';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'scared': return n > .3 ? 'worried' : 'scared';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'bored': return 'half';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk') => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat' });
const sweat = (ch, T) => { const h = hp(ch); const k = (T * .8) % 1; SWEAT.visible = true; SWEAT.position.copy(h).add(V(.5, 1.3 - k * .9, .45)); SWEAT.scale.set(1, 1.4, 1); };
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
// el monstruo: pose + ojos que brillan a oscuras
const mon = (p, glow = 0, pos = null, ry = 0) => { MON.root.visible = true; if (pos) MON.root.position.copy(pos); SPOTS.forEach(s => s.target.position.copy(MON.root.position).add(V(0, 28, 0))); MON.root.rotation.y = ry; poseMonster(MON, p); MON.glow(glow); };

// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = clamp(x, 220, W - 220); b.y = clamp(y, 200, H * .62); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  c.restore(); }
const KEY = /^(Stadt|Monster|Dunkeln|Licht|Sekunde|vorbei|drei|Jahren|neun|spurlos|Sonnenstrahl|Statue|Einzige|acht|Flutlichter|Reservegenerator|vierzehn|Taschenlampen|Zentimeter|gestern|Vater|Nachtschicht|nichts|3|47|Knall|tausend|Funken|sieben|Funkgerät|Problem|Hauptleitung|aus|Reserve|Generatoren|glühen|blass|Alarmstufe|Rot|zwanzig|Streifenwagen|Kreis|Fenster|Handys|klick|stockdunkel|Hunderte|reglos|geschafft|Blitz|Wolkenbruch|Wachmann|Scheinwerfer|Niemand|helfen|Kabel|Boden|Schatten|Kreischen|Blut|erstarrte|Mitte|zwei|Meter|Benno|lebte|rausholen|Schritt|warum|einziges|nie)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
//@@PLANOS@@

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .04, s: ['zoom_in', 'zoom_out'][i % 2], g: .35 }); });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD.length = 0; s.fn(L);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .88, e); }
  if (i === 0) { const k = clamp(T / .2); camera.fov *= lerp(.62, 1, easeOut(k)); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'explosion', 'thunder'].includes(c.s) && T - c.t < .16) sh_ = 1 - (T - c.t) / .16; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .015; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  if (MODE !== 'day') scene.environment = null; AIR.update(T, ctr, MODE === 'day' ? 'polvo' : 'noche', WET ? 0 : .5);
  if (WET) RAIN.update(T, ctr, WET);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
}
function renderAt(T) {
  const i = shotAt(T), s = S[i]; let tr = null, a = 0, ph = 0; const fO = (s.t1 - T) * FPS, fI = (T - s.t0) * FPS;
  if (s.tr && fO < TRW[s.tr] && i + 1 < S.length) { tr = s.tr; a = 1 - fO / TRW[s.tr]; ph = -1; } else if (i > 0 && S[i - 1].tr && fI < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fI / TRW[S[i - 1].tr]; ph = 1; }
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
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD) drawBadge(b); caption(T);
}
let DARK = 0;
// portadas (sin spoilers)
function coverText(l1, l2, col) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .115, 132, '#ffffff'], [l2, H * .195, 112, col]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .92 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .22; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
// portadas (sin spoilers), sujeto centrado, más nitidez y viñeta: 0 = yo de espaldas ante el monstruo gigante bajo los focos; 1 = la cara del monstruo con los ojos encendidos a oscuras
const COVERS = [{ i: 0, k: .9, cam: () => cam([2.2, 1.6, 66], [0, 27, 4], 64), l2: 'BEWEGT SICH IM DUNKELN…' },
  { i: 1, k: .45, cam: () => { const h = wpos(MON.head); cam([h.x - 6, h.y + 2, h.z + 36], [h.x, h.y + 2.6, h.z], 40); }, l2: 'WENN DAS LICHT AUSGEHT…' }];
window.renderCover = v => { const C = COVERS[v], s = S[C.i], T = s.t0 + (s.t1 - s.t0) * C.k; COVER = C; renderShot(C.i, T, null, 0); COVER = null;
  octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H); coverText('IN DIESER STADT', C.l2, '#E2FD07'); };
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, MON };
