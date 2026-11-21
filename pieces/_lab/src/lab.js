// Laboratorio: 5 planos de 3 s para probar vivo.js (caras del kit, actuación, pasos, saltos, ambiente).
// ?old=1 -> el mismo plano con el motor de antes (para comparar).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeInOut, blinking } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { makeFolk } from './gcast.js';
import { stadt } from './gsets.js';
import { wohnung } from './wsets.js';
import { makeKid, makeMila, makeMom, makeFuchs, makeOma, makeBeast } from './tcast.js';
import { loadKitFaces, kitFace, actuar, caminar, saltar, mirar, shiver, eyesAlive, luzCielo, viento, setViento, aire, bandada, camaraEnMano } from './vivo.js';

const OLD = new URLSearchParams(location.search).has('old');
await loadKitFaces();
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage);
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfe3ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a8070, 1.7); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 700 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-70, 140, 90)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }
const WX = 1200, VS = 200;
const ST = stadt(scene), WG = wohnung(scene, WX); const SETS = { ST: ST.G, WG: WG.g };
const lawnL = z => V(VS - 14.2, 0, z + 5.1), lawnR = z => V(VS + 14.2, 0, z - 5.1), doorR = z => V(VS + 18.4, 0, z - 5.1);
const kid = makeKid(scene), mila = makeMila(scene), mom = makeMom(scene), fuchs = makeFuchs(scene), oma = makeOma(scene);
const fk = Array.from({ length: 4 }, (_, i) => makeFolk(scene, i)); const beast = makeBeast(scene, 0, 3.4);
const POOL = [kid, mila, mom, fuchs, oma, ...fk, beast];
// caras del kit: cada personaje con su estilo
if (!OLD) { kitFace(kid, 'hero'); kitFace(mila, 'girl'); kitFace(mom, 'plain'); kitFace(fuchs, 'mustache'); kitFace(oma, 'plain'); fk.forEach((c, i) => kitFace(c, ['kid', 'plain', 'villain', 'girl'][i])); }
const IBL = luzCielo(renderer, scene, sky.sky, .5); const AIR = aire(scene, 520); const BIRDS = bandada(scene, 9);
if (!OLD) viento(ST.G);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
const k0 = OLD ? 1 : .8;   // con luz del cielo, la luz hemisférica baja un poco para no lavar
function day() { setSky([.26, .58, .98], [.5, .78, 1], [.78, .9, 1]); hemi.intensity = 1.7 * k0; hemi.color.setRGB(.81, .9, 1); sun.intensity = 2.7; sun.color.setRGB(1, .94, .85); rim.intensity = 1.3; scene.fog.color.setRGB(.75, .88, 1); scene.fog.density = .0008; bloom.strength = .26; }
function night() { setSky([.03, .05, .16], [.08, .12, .3], [.16, .22, .42]); hemi.intensity = .75 * k0; hemi.color.setRGB(.55, .65, 1); sun.intensity = .55; sun.color.setRGB(.6, .7, 1); rim.intensity = 2.2; scene.fog.color.setRGB(.05, .08, .2); scene.fog.density = .002; bloom.strength = .5; }
function inside(h = .9, s = .5) { hemi.intensity = h; sun.intensity = s; bloom.strength = .42; scene.fog.density = .0002; }
function hideAll() { for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); }
  for (const k in SETS) SETS[k].visible = false;
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = .85; day(); }
const use = n => { SETS[n].visible = true; };
const put = (ch, x, y, z, ry = 0) => { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; };
const cam = (p, t, fov = 50) => { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; };
const cm = (a, b, k) => { const q = easeInOut(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); };
const hp = ch => ch.head.getWorldPosition(V(0, 0, 0));
// cara: en modo nuevo, expresión del kit + mirada viva; en modo viejo, los parámetros de antes
function cara(ch, T, nuevo, viejo) { if (OLD) { const s = { ...viejo }; if (blinking(T, ch.seed) && s.eyes !== 'closed') s.eyes = 'closed'; ch.setFace(s); return; }
  const s = { ...nuevo }; if (!s.eyes) { const e = eyesAlive(T, ch.seed, 'normal'); if (e === 'closed' || !s.expr) s.eyes = e; } ch.setFace(s); }
// pose: en modo viejo, interpolación lineal sin rebote ni retardo entre las mismas claves
function pose(ch, lt, keys, o = {}) { if (OLD) return actuar(ch, lt, keys.map(([t, p]) => [t, p, { dur: .25 }]), { ...o, breathe: false, weight: false, lag: 0 }); return actuar(ch, lt, keys, o); }

const S = []; const shot = (d, fn) => { const t0 = S.length ? S[S.length - 1].t1 : 0; S.push({ t0, t1: t0 + d, fn }); };
// 1 Calle de día: el chico camina hacia la cámara (pasos que no patinan), frena y saluda; Herr Fuchs se asusta al fondo.
shot(3, L => { use('ST');
  const r = OLD ? (put(kid, VS + 2, 0, -14 + L.lt * 3, 0), applyPose(kid, { ...(L.lt < 2.2 ? {} : { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .38, aRe: .5 }) }), null)
    : caminar(kid, L.lt, { x: VS + 2, z: -14, ry: 0, speed: 3.4, stopAt: 1.9, accel: .35, T: L.T, extra: L.lt > 2.25 ? { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .38, aRe: .5 } : {} });
  if (OLD && L.lt < 2.2) applyPose(kid, (() => { const p = { lLx: Math.sin(L.T * 7.5) * .6, lRx: -Math.sin(L.T * 7.5) * .6, aLx: -Math.sin(L.T * 7.5) * .5, aRx: Math.sin(L.T * 7.5) * .5 }; return p; })());
  cara(kid, L.T, { expr: L.lt > 2.2 ? 'happy' : 'smile' }, { mouth: L.lt > 2.2 ? 'grin' : 'smile' });
  const f = lawnL(-18); put(fuchs, f.x + 3, 0, f.z + 2, Math.PI / 2 + .5);
  pose(fuchs, L.lt, [[0, 'idle'], [1.2, 'shock', { anti: .3 }], [2.0, 'hands_head']], { T: L.T });
  cara(fuchs, L.T, { expr: L.lt > 1.2 ? (L.lt > 2 ? 'terror' : 'shock') : 'neutral' }, { mouth: L.lt > 1.2 ? 'o' : 'flat', eyes: L.lt > 1.2 ? 'wide' : 'open' });
  const k = kid.root.position; cm([VS + 6, 6.5, k.z + 15, VS + 1, 4.6, k.z - 4, 46], [VS + 5, 6, k.z + 12.5, VS + 1, 4.8, k.z - 4, 44], L.k);
  sh(V(VS, 0, k.z), 40); });
// 2 Primer plano de Herr Fuchs: la emoción sube (neutral -> sorpresa -> terror -> llanto) con gestos que rebotan.
shot(3, L => { use('ST'); const p = lawnR(-42); put(fuchs, p.x - 2, 0, p.z, -Math.PI / 2 - .3);
  pose(fuchs, L.lt, [[0, 'idle'], [.5, 'recoil', { anti: .4 }], [1.3, 'hands_face'], [2.1, 'cower', { dur: .45 }]], { T: L.T, extra: L.lt > 2.1 ? shiver(L.T) : {} });
  cara(fuchs, L.T, { expr: L.lt < .5 ? 'neutral' : L.lt < 1.3 ? 'gasp' : L.lt < 2.1 ? 'terror' : 'cry' }, { mouth: L.lt < .5 ? 'flat' : 'o', eyes: L.lt < .5 ? 'open' : 'wide', tears: L.lt > 2.1 });
  fuchs.root.updateMatrixWorld(true); const h = hp(fuchs), a = fuchs.root.rotation.y, d = lerp(9, 6.5, easeInOut(L.k));
  cam([h.x + Math.sin(a) * d + Math.cos(a) * 1.5, h.y + .2 - L.k * .4, h.z + Math.cos(a) * d - Math.sin(a) * 1.5], [h.x, h.y - .3 - L.k * .6, h.z], 42);
  sh(p, 30); });
// 3 Césped: Mila salta de alegría dos veces (anticipación, vuelo, aterrizaje con amortiguación); la abuela aplaude.
shot(3, L => { use('ST'); const p = lawnL(30);
  mila.root.visible = true; mila.root.rotation.set(0, .5, 0);
  if (OLD) { put(mila, p.x + 2, Math.max(0, Math.sin(clamp((L.lt - .3) / .6) * Math.PI)) * 2.4 + Math.max(0, Math.sin(clamp((L.lt - 1.5) / .6) * Math.PI)) * 2.4, p.z, .5); applyPose(mila, { aLx: 2.6, aRx: 2.6 }); }
  else saltar(mila, L.lt, L.lt < 1.4 ? .3 : 1.5, { base: [p.x + 2, 0, p.z], h: 2.6, extra: {} });
  cara(mila, L.T, { expr: 'joy' }, { mouth: 'grin', eyes: 'happy' });
  put(oma, p.x - 4, 0, p.z - 1.5, .9);
  pose(oma, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.35, aRz: -.35, aLe: 1.2, aRe: 1.2 }], [.01, (T) => ({ aLx: 1.35, aRx: 1.35, aLz: -.3 + Math.max(0, Math.sin(T * 14)) * .4, aRz: -.3 + Math.max(0, Math.sin(T * 14)) * .4, aLe: 1.2, aRe: 1.2, headX: -.1 })]], { T: L.T });
  cara(oma, L.T, { expr: 'happy' }, { mouth: 'grin' });
  cm([p.x + 9, 5, p.z + 14, p.x, 4.5, p.z - 1, 46], [p.x + 7.5, 4.6, p.z + 12.5, p.x, 4.8, p.z - 1, 44], L.k); sh(p, 30); });
// 4 Noche: el chico avanza agachado, el Fellriese se gira hacia él frente a la puerta y el chico retrocede aterrado.
shot(3, L => { use('ST'); night(); const d = doorR(-18);
  put(beast, d.x - 3.2, 0, d.z, -Math.PI / 2 + (L.lt > 1.2 ? .35 * clamp((L.lt - 1.2) * 3) : 0));
  applyPose(beast, { aLz: .08, aRz: .08, aLx: .15, aRx: .15, aLe: .25, aRe: .25, lean: .38 + (L.lt > 1.2 ? .2 : 0), headX: -.25, headY: L.lt > 1.2 ? .5 : 0, lLk: .15, lRk: .15, crouch: .05 });
  beast.setFace({ open: L.lt > 1.6 ? .6 : 0 });
  const kx = d.x - 13; put(kid, kx, 0, d.z + 3, Math.PI / 2 + .2);
  if (OLD) applyPose(kid, L.lt < 1.3 ? { crouch: .4, lean: .4 } : { aLx: 1, aRx: 1, lean: -.2 });
  else pose(kid, L.lt, [[0, 'sneak'], [1.25, 'recoil', { anti: .5, dur: .35 }], [1.9, 'brace']], { T: L.T, extra: { ...(L.lt > 1.9 ? shiver(L.T, 1.4) : {}), ...(L.lt < 1.25 ? { lLx: .65 + Math.sin(L.T * 3) * .25, lRx: .15 - Math.sin(L.T * 3) * .25 } : {}) } });
  if (!OLD && L.lt > 1.25) kid.root.position.x -= easeInOut(clamp((L.lt - 1.25) / .5)) * 1.2;
  cara(kid, L.T, { expr: L.lt < 1.25 ? 'worried' : 'terror' }, { mouth: L.lt < 1.25 ? 'flat' : 'o', eyes: L.lt < 1.25 ? 'open' : 'wide' });
  cm([d.x - 10, 4.5, d.z + 17, d.x - 7, 5.5, d.z + 1, 48], [d.x - 9, 4.8, d.z + 15, d.x - 7, 5.8, d.z + 1, 46], L.k); sh(d, 30); });
// 5 Interior: mamá habla por teléfono, se entera y se lleva la mano a la cara; motas de polvo en la luz.
shot(3, L => { use('WG'); inside(.9, .3); put(mom, WX - 8.3, 0, -10.6, 0);
  pose(mom, L.lt, [[0, 'phone'], [1.5, 'facepalm', { anti: .3 }]], { T: L.T });
  cara(mom, L.T, { expr: L.lt < 1.5 ? 'talk' : 'sad', mouth: L.lt < 1.5 ? (Math.sin(L.T * 18) > 0 ? 'talk' : 'talk_wide') : undefined }, { mouth: L.lt < 1.5 ? (Math.sin(L.T * 18) > 0 ? 'o' : 'shout') : 'frown' });
  cm([WX - 6.5, 6, 2.5, WX - 8.3, 4.8, -10.6, 44], [WX - 7.2, 5.8, 0, WX - 8.3, 5, -10.6, 42], L.k); });

function renderAt(T) {
  let i = S.findIndex(s => T < s.t1); if (i < 0) i = S.length - 1; const s = S[i], lt = T - s.t0;
  hideAll(); s.fn({ lt, k: clamp(lt / (s.t1 - s.t0)), T });
  const tgt = new THREE.Vector3(); camera.getWorldDirection(tgt); const center = camera.position.clone().addScaledVector(tgt, 14);
  const isNight = i === 3, isIn = i === 4;
  if (OLD) { scene.environment = null; AIR.update(T, center, 'polvo', 0); BIRDS.update(T, center, false); camera.position.x += Math.sin(T * 1.7) * .03; camera.position.y += Math.sin(T * 2.3) * .025; }
  else { IBL.update(!isIn); setViento(T, 1); AIR.update(T, center, isNight ? 'luciernagas' : isIn ? 'polvo' : 'polvo', isIn ? 1 : isNight ? .7 : .5); BIRDS.update(T, center, !isIn, isNight); camaraEnMano(camera, T, 1); }
  camera.updateProjectionMatrix(); sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
}
window.renderAt = renderAt; window.SHOTS = S.map(s => [s.t0, s.t1]); window.DUR = S[S.length - 1].t1; window.__ready = true;
