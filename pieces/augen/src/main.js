// Augen (Stumm) — planos sincronizados con audio/words.json (1080×1920, 30 fps). Cambio de escena al empezar cada frase, ~1,8 s por plano.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, cyl, sphere, textPlane } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { dorf, kueche, treppe, zimmer, wendt, tafel, cane, glocke, streichholz } from './asets.js';
import { makeIch, makeMama, makeWendt, makeTimo, makeTimoMutter, makeHilde, makeNachbar } from './acast.js';
import { makeMundMonster, poseMund, MP, mixMP } from './mund.js';
import { outline } from './monster.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, actuar, mirar, caminar, saltar, aire, camaraEnMano, shiver, GEST } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 146.0, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x1a2448, .0011);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); { const st = sky.sky.material.uniforms.stars.value; st.wrapS = st.wrapT = THREE.RepeatWrapping; st.needsUpdate = true; const m = sky.sky.material; m.fragmentShader = m.fragmentShader.replace('* .9;', '* .3;'); m.needsUpdate = true; }
const hemi = new THREE.HemisphereLight(0x8aa8ff, 0x2a2a40, .9); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xb8c8ff, 1.1); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene); rim.color.set(0x9fc8ff);
const FILL = new THREE.PointLight(0xe8eeff, 0, 0, 1.2); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-90, 160, 60)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const KX = 1500, TX = 1800, ZX = 2100, WX = 2400;
const DF = dorf(scene), KU = kueche(scene, KX), TR = treppe(scene, TX), ZI = zimmer(scene, ZX), WE = wendt(scene, WX);
const SETS = { DF: DF.G, KU: KU.g, TR: TR.g, ZI: ZI.g, WE: WE.g };
outline(DF.G, .012); outline(KU.g, .01); outline(TR.g, .01); outline(ZI.g, .01); outline(WE.g, .01);
// ---------- el monstruo ----------
const MON = makeMundMonster(scene); outline(MON.root, .025);
// ---------- reparto ----------
const ich = makeIch(scene), kid = makeIch(scene, true), mama = makeMama(scene), frau = makeWendt(scene), timo = makeTimo(scene), tmom = makeTimoMutter(scene), hilde = makeHilde(scene);
const NB = Array.from({ length: 24 }, (_, i) => makeNachbar(scene, i));
kitFace(ich, 'hero'); kitFace(kid, 'kid'); kitFace(mama, 'girl'); kitFace(frau, 'girl'); kitFace(timo, 'kid'); kitFace(tmom, 'girl'); kitFace(hilde, 'girl'); NB.forEach(c => kitFace(c, c.kit));
const POOL = [ich, kid, mama, frau, timo, tmom, hilde, ...NB]; POOL.forEach(c => { c.root.rotation.order = 'YXZ'; outline(c.root, .012); });
// ---------- atrezo ----------
const GLO = glocke(); scene.add(GLO); const CANE = cane(); scene.add(CANE); const MATCH = streichholz(); scene.add(MATCH);
const SLATE = tafel(2.2, 1.6, ''); scene.add(SLATE); const BOX = (() => { const g = new THREE.Group(); scene.add(g); box(.9, .25, .6, mat(0x3a6ad8), .03, g, 0, 0, 0); box(.92, .1, .62, mat(0xd8323a), .02, g, 0, .14, 0); return g; })();
const BEANIE = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0xd8283a, { roughness: 1 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.8, 20, 10, 0, 6.283, 0, 1.5), m); c.scale.y = .8; g.add(c); cyl(.8, .8, .35, m, 20, g, 0, 0, 0); sphere(.26, mat(0xf4f4f0, { roughness: 1 }), g, 0, .75, 0, 10, 8); return g; })();
const SWEAT = sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8);
const PROPS = [GLO, CANE, MATCH, SLATE, BOX, SWEAT, BEANIE]; [GLO, CANE].forEach(p => outline(p, .008));
// ---------- ambiente ----------
const AIR = aire(scene, 300);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day';
function day() { MODE = 'day'; renderer.toneMappingExposure = .95; setSky([.22, .5, .95], [.5, .74, 1], [.84, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.5, .5, .45); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.1;
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0009; bloom.strength = .2; bloom.threshold = .9; FILL.intensity = 40; }
function dusk() { day(); setSky([.2, .25, .6], [.85, .5, .55], [1, .66, .4]); sun.color.setRGB(1, .7, .45); sun.intensity = 1.8; hemi.intensity = .95; scene.fog.color.setRGB(.9, .7, .6); bloom.strength = .3; }
function night() { MODE = 'night'; setSky([.02, .04, .14], [.06, .1, .3], [.16, .2, .42]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = .75; hemi.color.setRGB(.5, .6, 1); hemi.groundColor.setRGB(.14, .14, .24); sun.intensity = 1.0; sun.color.setRGB(.6, .7, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.08, .11, .24); scene.fog.density = .0016; bloom.strength = .24; bloom.threshold = .92; renderer.toneMappingExposure = .9; FILL.intensity = 14; }
function inside(h = .75) { MODE = 'in'; hemi.intensity = h; hemi.color.setRGB(1, .96, .9); hemi.groundColor.setRGB(.4, .36, .3); sun.intensity = 0; rim.intensity = .5; bloom.strength = .2; renderer.toneMappingExposure = .92; scene.fog.density = .0002; FILL.intensity = 50; }
// a oscuras (la casa de noche, sin una sola lámpara): solo la luna por la ventana y un relleno azul muy bajo
function dark(k = 1) { MODE = 'dark'; hemi.intensity = .28 * k; hemi.color.setRGB(.45, .55, 1); hemi.groundColor.setRGB(.06, .06, .12); sun.intensity = 0; rim.intensity = .4 * k; rim.color.setRGB(.55, .65, 1); bloom.strength = .3; bloom.threshold = .85; renderer.toneMappingExposure = .9; scene.fog.density = .0002; FILL.intensity = 9 * k; FILL.color.setRGB(.6, .7, 1); }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.props.slate) c.props.slate.visible = true; }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  MATCH.userData.lit(0);
  for (const k in SETS) SETS[k].visible = false; MON.root.visible = false; MON.root.position.set(0, 0, 0); MON.root.rotation.set(0, 0, 0); MON.root.scale.setScalar(1); poseMund(MON, MP.stand, 0);
  FILL.color.setRGB(.91, .93, 1); rim.color.set(0x9fc8ff); ZI.MOON.intensity = 60; ZI.L.intensity = 0; TR.L.intensity = 0; KU.L.intensity = 130; WE.L.intensity = 110; ZI.DOOR.rotation.y = 0;
  DF.H.forEach((h, i) => { if (h.board.userData.txt !== undefined) { h.board.userData.write(h.board.userData.txt0); delete h.board.userData.txt; } });
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.4; grade.uniforms.sharp.value = 1.1; grade.uniforms.sepia.value = 0; DARK = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
const wpos = o => { o.updateWorldMatrix(true, false); return o.getWorldPosition(V(0, 0, 0)); };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .4 + dy, h.z + fz * d - fx * side], [h.x, h.y - .6, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'blank': return 'normal';
    case 'sad': return n > -.1 ? 'half' : 'down';
    case 'happy': case 'smile': case 'relief': return n > -.3 ? 'happy' : 'half';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'scared': return n > .3 ? 'worried' : 'scared';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk') => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat' });
const sweat = (ch, T) => { const h = hp(ch); const k = (T * .8) % 1; SWEAT.visible = true; SWEAT.position.copy(h).add(V(.5, 1.3 - k * .9, .45)); SWEAT.scale.set(1, 1.4, 1); };
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
// el monstruo: pose, posición, giro; las bocas hablan (talk), se abren todas (wide) o se giran hacia un punto del mundo (focus)
const mon = (p, pos = null, ry = 0, T = 0, talk = 1, wide = 0, focus = null) => { MON.root.visible = true; if (pos) MON.root.position.copy(pos); MON.root.rotation.y = ry; poseMund(MON, p, T); MON.root.updateMatrixWorld(true);
  let f = null; if (focus) { f = MON.head.worldToLocal(focus.clone()); } MON.mouths(T, talk, wide, f); };
const monHead = () => { MON.root.updateMatrixWorld(true); return MON.head.localToWorld(V(0, .9, 0)); };
// pizarras de las casas: escribir temporalmente (se restauran en hideAll)
const board = (i, s, k = 1) => { const b = DF.H[i].board; b.userData.txt = s; b.userData.write(s, k); };
const door = i => DF.H[i].door, doorRy = i => DF.H[i].face;   // puerta i (posición en la calle) y orientación de la fachada

// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
// notas musicales que salen de un punto y suben ondulando
const notes = (w3, lt, n = 4, col = '#ffd23f') => { for (let i = 0; i < n; i++) { const t = lt * .9 - i * .35; if (t < 0) continue; const ph = t % 1.4; BAD.push({ kind: 'note', text: '', w3: w3.clone().add(V(Math.sin(t * 3 + i) * 1.2, ph * 3.2, 0)), s: Math.min(1, ph * 4) * (1 - Math.max(0, ph - 1.1) * 3), a: 1, on: true, rot: Math.sin(t * 4) * .3, col }); } };
const knock = (w3, k, n = 2) => BAD.push({ kind: 'knock', text: '', w3, n, s: spring(clamp(k) * 1.6), a: 1, on: k > 0, k });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = clamp(x, 220, W - 220); b.y = clamp(y, 200, H * .62); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'note') { c.rotate(b.rot || 0); c.fillStyle = b.col || '#ffd23f'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 7; c.beginPath(); c.ellipse(0, 30, 24, 17, -.4, 0, 7); c.fill(); c.stroke(); c.fillRect(17, -50, 9, 80); c.strokeRect(17, -50, 9, 80); c.beginPath(); c.moveTo(26, -50); c.quadraticCurveTo(60, -30, 46, 0); c.lineTo(40, -2); c.quadraticCurveTo(48, -26, 26, -34); c.closePath(); c.fill(); c.stroke(); }
  else if (b.kind === 'knock') { for (let i = 0; i < b.n; i++) { const kk = clamp(b.k * b.n * 1.2 - i); if (kk <= 0) continue; c.save(); c.translate(i * 120 - (b.n - 1) * 60, -i * 30); c.scale(.6 + kk * .5, .6 + kk * .5); c.globalAlpha = 1 - Math.max(0, kk - .7) * 2;
      c.fillStyle = '#ffd23f'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 8; c.beginPath(); for (let j = 0; j < 16; j++) { const r = j % 2 ? 34 : 70, a = j / 16 * 6.283; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); c.font = `700 40px ${FONT}`; c.fillStyle = '#1a1a1a'; c.fillText('KLOPF', 0, 3); c.restore(); } }
  c.restore(); }
const KEY = /^(Stadt|stumm|Monster|frisst|sprechen|Tür|Münder|Hunderte|allein|Geräuschen|Geräusch|Klopfzeichen|Zweimal|raus|Türen|weg|Weggezogen|spielt|Glöckchen|Konrad|vier|zurück|lächelt|Timo|Melodie|Winter|pfeift|Tür|Hilde|heimlich|Streichholz|einzige|sehen|gebrüllt|geschrien|Ton|sieben|Elf|Mucks|Schauspieler|Licht|Mama|fünf|Knie|kalten|Hände|dreimal|Stirn|Zeichen|Stock|Frühstück|kein|einziges|oben|Luft|Monster|Dunkeln|Faust|auf|Flamme|mir|schrie|Stumme|Sekunde|verraten|fester|aus|bewegen|Mund|Stimme|Schlaf)$/;
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
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'scream'].includes(c.s) && T - c.t < .16) sh_ = 1 - (T - c.t) / .16; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .015; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  scene.environment = null; AIR.update(T, ctr, MODE === 'day' ? 'polvo' : 'noche', MODE === 'in' ? 0 : .5);
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
function coverText(l1, l2, col) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .115, 132, '#ffffff'], [l2, H * .195, 112, col]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .92 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .22; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
// portadas (sin spoilers): 0 = la calle llena y el monstruo de bocas detrás de mí; 1 = la cabeza de bocas de cerca
const COVERS = [{ i: 7, k: .15, cam: () => cam([4, 4.2, 30], [0, 10, 0], 58), l2: 'IST JEDER STUMM…' },
  { i: 11, k: .6, cam: () => { const h = monHead(); cam([1.2, h.y - .6, 8.6], [0, h.y + .9, 0], 42); }, l2: '…AUSSER MIR' }];
window.renderCover = v => { const C = COVERS[v], s = S[C.i], T = s.t0 + (s.t1 - s.t0) * C.k; COVER = C; renderShot(C.i, T, null, 0); COVER = null;
  octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H); coverText('IN DIESER STADT', C.l2, '#E2FD07'); };
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, MON, DF };
