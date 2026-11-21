// Spiegelbild — 95 planos sincronizados con audio/words.json. Los espejos muestran un render real del "otro mundo".
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, textPlane } from './engine.js';
import { nightSky, townSet, rathausturm, FONT } from './sets.js';
import { makeAdult, makeChild, bathroom, living } from './world.js';
import { makeEmil, makeLina, makeKrause, makeFireman, makePolice, makeOpa, makeShadow, emilRoom, hallway, classroom, basement, schoolExt, kiosk, car, phone, paperSign, handMirror, mirrorPlane } from './world2.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 150.8;
const stage = document.getElementById('stage');
const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfd8f0, 0.0025);
const camera = new THREE.PerspectiveCamera(50, W / H, 0.2, 4000);
const { composer, grade, bloom } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene);
const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: sky.moon.material.map, fog: false, depthWrite: false, transparent: true, toneMapped: false, color: new THREE.Color(3, 2.6, 1.8) })); sun.scale.set(380, 380, 1); scene.add(sun);
const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x8a7a6a, 1.8); scene.add(hemi);
const sunL = new THREE.DirectionalLight(0xfff2dc, 2.4); sunL.castShadow = true; sunL.shadow.mapSize.set(4096, 4096); sunL.shadow.bias = -0.0004; sunL.shadow.normalBias = 0.3; sunL.shadow.radius = 4; scene.add(sunL, sunL.target);
function shadowAround(p, s = 40) { const c = sunL.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sunL.target.position.copy(p); sunL.position.copy(p).add(V(-140, 260, 160)); }
function day(k) { const u = sky.sky.material.uniforms; u.top.value.setRGB(lerp(.04, .2, k), lerp(.09, .5, k), lerp(.28, .95, k)); u.mid.value.setRGB(lerp(.16, .55, k), lerp(.18, .78, k), lerp(.56, 1, k)); u.hor.value.setRGB(lerp(.48, .9, k), lerp(.31, .95, k), lerp(.72, 1, k));
  sky.moon.material.opacity = 1 - k; sun.visible = k > .3; hemi.intensity = lerp(.5, 1.8, k); sunL.intensity = lerp(.4, 2.4, k); hemi.color.setRGB(lerp(.4, .82, k), lerp(.45, .88, k), lerp(.8, 1, k)); scene.fog.color.setRGB(lerp(.1, .75, k), lerp(.12, .85, k), lerp(.3, .94, k)); }

// ---------- mundo ----------
const RX = 5000, BX = 5200, HX = 5400, CX = 5600, KX = 5800, EX = 6200, LX = 6600;
const SETS = { town: townSet(scene) };
const tower = rathausturm(scene, 0, -420); SETS.tower = tower.g;
const room = emilRoom(scene, RX); SETS.room = room.g;
const bath = bathroom(scene, BX); SETS.bath = bath.g; bath.mirror.position.y = 7.4; const bmir = mirrorPlane(bath.mirror, 6.2, 8.2); bmir.plane.position.z = .3;
const hall = hallway(scene, HX); SETS.hall = hall.g;
const cls = classroom(scene, CX); SETS.cls = cls.g;
const bas = basement(scene, KX); SETS.bas = bas.g;
{ const w = mat(0x9a9488, { roughness: .95 }); box(1.6, 1, 1, mat(0xfff0b0, { emissive: 0xffc25a, emissiveIntensity: 2.5 }), .2, bas.g, -5, 11, 17.8); const dl_ = new THREE.PointLight(0xffc880, 90, 30, 2); dl_.position.set(-5, 10.5, 20); bas.g.add(dl_); box(14.5, 22, .6, w, 0, bas.g, -14.75, 11, 17); box(24.5, 22, .6, w, 0, bas.g, 9.75, 11, 17); box(5, 12, .6, w, 0, bas.g, -5, 16, 17); }
const ext = schoolExt(scene, EX); SETS.ext = ext.g;
const liv = living(scene, LX); SETS.liv = liv.g;
const ksk = kiosk(SETS.town, -16, -60); ksk.g.rotation.y = Math.PI / 2;
const carM = car(SETS.town); const MIRS = [room.mir, bmir, hall.mir, ksk.mir];
// pizarra: textos
const chalk = (t, size = 70) => { const p = textPlane(17, 7, 850, 350, (c, w, h) => { c.fillStyle = 'rgba(255,255,255,.92)'; c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; t.split('\n').forEach((l, i, a) => c.fillText(l, w / 2, h / 2 + (i - (a.length - 1) / 2) * size * 1.2)); }); p.position.z = .2; cls.board.add(p); p.visible = false; return p; };
const ch1 = chalk('REGEL NR. 1', 110), ch2 = chalk('SPRICH NIEMALS\nMIT DEINEM\nSPIEGELBILD!', 84), ch3 = chalk('PRÜFUNG', 120);

// ---------- reparto ----------
const emil = makeEmil(scene), ref = makeEmil(scene, true), refC = makeEmil(scene), lina = makeLina(scene), krause = makeKrause(scene);
const fm = [0, 1].map(i => makeFireman(scene, i)), cop = makePolice(scene), opa = makeOpa(scene), refOpa = makeOpa(scene);
const man = makeAdult(scene, 1), refMan = makeAdult(scene, 1), woman = makeAdult(scene, 3), teacher = makeAdult(scene, 5);
const kids = [0, 1, 2, 3].map(i => makeChild(scene, i)), refKid = makeChild(scene, 0), extras = [0, 2, 4].map(i => makeAdult(scene, i));
const shadowF = makeShadow(scene);
const POOL = [emil, ref, refC, lina, krause, ...fm, cop, opa, refOpa, man, refMan, woman, teacher, ...kids, refKid, ...extras];
const bundle = new THREE.Group(); scene.add(bundle); box(2.2, 1.4, 1.4, mat(0x6a4a3a, { roughness: 1 }), .5, bundle, 0, 0, 0); sphere(.3, mat(0xffffff, { emissive: 0x9fe3ff, emissiveIntensity: 1.5 }), bundle, .6, .4, .7);
const ph = phone(scene), paper = paperSign(scene), hm = handMirror(scene); MIRS.push(hm.mir);
const ticket = textPlane(1.6, 1, 160, 100, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8101e'; c.font = `700 34px ${FONT}`; c.textAlign = 'center'; c.fillText('LOTTO', w / 2, 42); c.fillStyle = '#111'; c.font = `700 22px ${FONT}`; c.fillText('7 · 13 · 24', w / 2, 80); }); scene.add(ticket);
const note1 = textPlane(1.4, 1.6, 140, 160, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8101e'; c.font = `700 90px ${FONT}`; c.textAlign = 'center'; c.fillText('1+', w / 2, 112); }); scene.add(note1);
const money = []; for (let i = 0; i < 8; i++) { const b = box(1, .5, .02, mat(0x5ab85a, { emissive: 0x1a4a1a }), 0, scene); money.push(b); }
const tbrush = box(.12, .9, .12, mat(0x3a8ad8), .04, scene);
const PROPS = [bundle, ph, paper, hm.g, ticket, note1, ...money, tbrush, shadowF];
const mirMat = new THREE.MeshBasicMaterial({ color: 0xeaf4ff });
const rt = new THREE.WebGLRenderTarget(512, 768, { type: THREE.HalfFloatType, samples: 4 }); mirMat.map = rt.texture;
const mcam = new THREE.PerspectiveCamera(48, 1, .2, 2000);

// ---------- utilidades ----------
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.faceMat.color.setRGB(1, 1, 1); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); }
  for (const k in SETS) SETS[k].visible = false; for (const m of MIRS) { m.plane.material = m.glass; m.crack.visible = false; m.crack.scale.setScalar(1); }
  room.digits.forEach(d => d.visible = false); room.lamp.intensity = 420; room.lamp.color.setRGB(1, .94, .85);
  hall.fire.visible = false; hall.lights.forEach(l => l.intensity = 380); hall.winM.emissiveIntensity = 1; hall.sh.rotation.x = Math.PI / 2; hall.glass.forEach(g => g.m.visible = false);
  bas.fire.visible = false; bas.red.intensity = 0; bas.core.visible = false; bas.mach.position.set(0, 0, -6); bas.door.rotation.y = 0; bas.door.position.set(-2.5, 0, 0); bas.chain.visible = true; bas.lock.visible = true; bas.panels.forEach(p => { p.g.visible = true; p.g.scale.setScalar(1); });
  ext.B.scale.set(1, 1, 1); ext.dust.forEach(d => d.visible = false); carM.visible = false; [ch1, ch2, ch3].forEach(c => c.visible = false);
  tower.hands.visible = true; grade.uniforms.sepia.value = 0; grade.uniforms.vig.value = .32; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.25;
  bloom.strength = .5; scene.fog.density = .0025; day(1); sun.position.set(-300, 420, -1500); sky.moon.position.set(-200, 380, -1400);
  sky.clouds.forEach((c, i) => c.position.set(-700 + i * 160, 380 + (i % 3) * 60, -1300)); MIR = null;
}
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
function face(ch, f, T) { const s = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(s.eyes)) s.eyes = 'closed'; ch.setFace(s); }
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; } applyPose(ch, { ...p, ...extra }); }
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const punch = (lt, at, amt = .3, d = .18) => lt < at ? 1 : 1 - amt * easeOut((lt - at) / d);
const hp = ch => ch.head.getWorldPosition(V(0, 0, 0));
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .82, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy + .4, h.z + fz * d - fx * side], [h.x, h.y + .45, h.z], fov); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, f) => face(ch, { ...f, mouth: lip(T, spoken(a, b)) || f.mouth }, T);
const proj = v => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
// espejo: MIR = { m, P (cámara), Tg (objetivo), fov, prep(L) } — prep monta el "otro mundo"
let MIR = null; const mirror = (m, P, Tg, fov, prep) => { MIR = { m, P, Tg, fov, prep }; };
// el otro mundo: la escuela en llamas con el reflejo de Emil
function fireHall(L, pose = {}, f = {}) { use('hall'); hall.fire.visible = true; hall.fire.userData.update(L.T); hall.lights.forEach(l => l.intensity = 0); hall.winM.emissiveIntensity = .2;
  hemi.color.setRGB(1, .6, .4); hemi.intensity = .6; sunL.intensity = .2; scene.fog.color.setRGB(.22, .1, .07); scene.fog.density = .01; bloom.strength = .45; grade.uniforms.sat.value = 1.1;
  put(ref, HX, 0, -20, 0); applyPose(ref, { ...idlePose(L.T), ...pose }); face(ref, { eyes: 'open', mouth: 'frown', brows: -.5, soot: 1, blood: 1, ...f }, L.T); shadowAround(V(HX, 0, -20), 25); }
const FH = { P: [HX, 4.6, -12.6], Tg: [HX, 4, -20], fov: 46 };
const roomMirror = (prep, P = FH.P, Tg = FH.Tg, fov = FH.fov) => mirror(room.mir, P, Tg, fov, prep);
const atMirror = (ch, ry = Math.PI) => put(ch, RX - 6, 0, -4.6, ry);
const nightRoom = () => { use('room'); day(0); room.lamp.intensity = 60; room.lamp.color.setRGB(.5, .6, 1); hemi.intensity = .35; };

// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1) => BAD.push({ kind, text, x, y, s: spring(k * 1.6), a });
function drawBadge(b) {
  if (b.s <= .01 || b.a <= 0) return; const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s, b.s); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red') { c.font = `700 104px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > W * .86) { const k = W * .86 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 48px ${FONT}`; const w = c.measureText(b.text).width + 56; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#ffd23f'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'ja') { c.font = `700 60px ${FONT}`; const w = c.measureText(b.text).width + 60; c.shadowColor = 'rgba(80,255,150,.9)'; c.shadowBlur = 30; c.fillStyle = '#22c46a'; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 44); c.fill(); c.shadowBlur = 0; c.lineWidth = 6; c.strokeStyle = '#fff'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 4); }
  else if (b.kind === 'knock') { c.font = `700 84px ${FONT}`; c.rotate(-.15); c.lineWidth = 16; c.strokeStyle = '#000'; c.strokeText(b.text, 0, 0); c.fillStyle = '#ffffff'; c.fillText(b.text, 0, 0); }
  c.restore(); }
const KEY = /^(Spiegelbild|Blut|Kratzer|vierundzwanzig|morgen|Los|Prüfung|Opa|Auto|Regel|niemals|antworten|Emil|dreizehn|Dienstagmorgen|brannte|zersplittert|Polizei|Feuerwehr|Nichts|retten|erstarrte|Rauch|Riss|Mitternacht|Klopfen|Schwester|schlecht|Kette|Keller|GEFAHR|VERBOTEN|Maschine|Spiegeln|Katastrophe|Hochhaus|Krause|kreidebleich|explodierte|Feuer|Lina|Bücherregal|schwer|Regal|zusammenbrach|lächelte|vorbei|Lippen|Stimme|um)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const roomDay = () => { use('room'); shadowAround(V(RX, 0, -4), 20); };
const scared = { eyes: 'wide', mouth: 'teeth', brows: -.8, sweat: 1 };
const liftPose = (k) => ({ crouch: lerp(.9, .1, k), lean: lerp(.6, .1, k), aLx: lerp(1.2, 2.6, k), aRx: lerp(1.2, 2.6, k), aLe: lerp(.6, .2, k), aRe: lerp(.6, .2, k), lLx: lerp(1.1, .2, k), lRx: lerp(1.1, .2, k), lLk: lerp(1.6, .3, k), lRk: lerp(1.6, .3, k) });
const shelfAt = (k) => { hall.sh.rotation.x = Math.PI / 2 - k * .75; };
const linaUnder = (T, f = {}) => { put(lina, HX - 1, .5, -52.6, 0); lina.root.rotation.x = Math.PI / 2; applyPose(lina, { aLx: 2.6, aRx: 2.4, aLe: .3, headX: -.9 }); face(lina, { eyes: 'wide', mouth: 'shout', brows: -.9, tears: 1, ...f }, T); };

// 1 golpe de zoom inicial: Emil frente al espejo, que muestra la escuela en llamas
shot(0, 'C', null, L => { roomDay(); atMirror(emil); applyPose(emil, { ...idlePose(L.T), lean: .05 }); face(emil, { eyes: 'wide', mouth: 'o', brows: -.6 }, L.T);
  roomMirror(M => fireHall(M, {}, { eyes: 'open', mouth: 'frown' }));
  const k = easeOut(clamp(L.lt / .35)); cam([lerp(RX + 10, RX - 3.6, k), lerp(14, 6.6, k), lerp(16, 1.6, k)], [RX - 6, 5.6, -10], lerp(60, 42, k) * (1 - .04 * clamp((L.lt - .35) / 1.5))); }, [[0, 'zoom_fast', 1], [.35, 'impact', .8], [.6, 'fire_crackle', .5]]);
// 2 el reflejo: en llamas y lleno de sangre (espejo de cerca)
shot(1.90, 'W', 'slowv', L => { roomDay(); roomMirror(M => fireHall(M, { headX: .1 }, { eyes: 'open', mouth: 'flat', brows: -.2 })); cm([RX - 6, 5.6, -3.4, RX - 6, 5.6, -10, 44], [RX - 6, 5.6, -5.4, RX - 6, 5.6, -10, 40], L.k); }, [[0, 'fire_crackle', .6], [.6, 'heartbeat', .6]]);
// 3 …y yo sin un rasguño: se mira los brazos
shot(4.00, 'S', null, L => { roomDay(); put(emil, RX - 2, 0, -2, .3); applyPose(emil, { aLx: 1.3, aRx: 1.3, aLe: 1.1, aRe: 1.1, headX: .45, lean: .1 }); face(emil, { eyes: 'wide', mouth: 'o', brows: -.4, look: [0, .8] }, L.T);
  onFace(emil, 6.5, 1, 2, 44, L.k, 5.4); badge('tag', 'KEIN KRATZER', W / 2, H * .16, L.lt - .4); }, [[.3, 'cloth', .5], [.45, 'pop', .4]]);
shot(5.10, 'C', null, L => { roomDay(); put(emil, RX - 2, 0, -2, .3); applyPose(emil, { headX: -.05 }); face(emil, scared, L.T); onFace(emil, 4.2, .1, 0, 40 * punch(L.lt, .02, .2), 0); }, [[0, 'impact', .6]]);
// 5 en esta ciudad… (calle de día, gente pasando frente a un escaparate)
shot(6.14, 'Z', null, L => { use('town'); for (let i = 0; i < 4; i++) { const a = [man, woman, teacher, extras[0]][i]; put(a, (i - 1.5) * 5, .66, -40 + L.T * 1.5 * (i % 2 ? 1 : -1) - i * 6, i % 2 ? 0 : Math.PI); applyPose(a, walkPose(L.T + i * .3)); face(a, { mouth: 'smile' }, L.T + i); }
  cm([2, 9, -10, 0, 5, -50, 52], [2, 7, -16, 0, 5, -50, 48], L.k); badge('tag', 'IN DIESER STADT', W / 2, H * .14, L.lt - .2); shadowAround(V(0, 0, -45), 40); }, [[0, 'city_amb', .5], [.4, 'steps', .4]]);
// 6 +24 horas: el reloj del ayuntamiento gira
shot(8.10, 'R', null, L => { use('town', 'tower'); tower.minH.rotation.z = -L.T * 14; tower.hourH.rotation.z = -L.T * 1.2;
  cm([0, 60, -360, 0, 88, -411, 34], [0, 64, -368, 0, 88, -411, 30], L.k); badge('big', '+24 STUNDEN', W / 2, H * .15, L.lt - .2); }, [[0, 'clock_spin', .7], [.3, 'ticks', .4]]);
// 7 lo que hace hoy… (el reflejo se lava los dientes, ella no)
shot(10.07, 'F', null, L => { use('bath'); put(woman, BX + 8, 0, -5.2, Math.PI); applyPose(woman, idlePose(L.T)); face(woman, { mouth: 'smile' }, L.T);
  mirror(bmir, [BX + 8, 7.4, -10.2], [BX + 8, 4.6, -5.2], 50, M => { use('bath'); put(woman, BX + 8, 0, -5.2, Math.PI); const s = Math.sin(M.T * 14);
    applyPose(woman, { aRx: 2.2, aRe: 2.0 + s * .15, headX: .05 }); face(woman, { mouth: 'grin', eyes: 'happy' }, 99); tbrush.visible = true; tbrush.position.copy(woman.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(0, .5, .2)); tbrush.rotation.z = 1.4; });
  cm([BX + 10, 7, 3, BX + 8, 7, -10.4, 44], [BX + 9.5, 7, 2, BX + 8, 7, -10.4, 42], L.k); badge('tag', 'HEUTE', W * .25, H * .14, L.lt - .2); }, [[0, 'brush', .6]]);
// 8 …lo haces mañana
shot(11.37, 'W', null, L => { use('bath'); put(woman, BX + 8, 0, -5.2, .25); const s = Math.sin(L.T * 14); applyPose(woman, { aRx: 2.2, aRe: 2.0 + s * .15 }); face(woman, { mouth: 'grin', eyes: 'happy' }, 99);
  tbrush.visible = true; tbrush.position.copy(woman.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(0, .5, .2)); tbrush.rotation.z = 1.4; onFace(woman, 8.5, .4, 1.5, 46, L.k, 7.5); badge('tag', 'MORGEN', W * .75, H * .14, L.lt - .1); }, [[0, 'brush', .6], [.5, 'pop', .4]]);
// 9 la gente compra lotería cuando su reflejo celebra
shot(12.32, 'S', null, L => { use('town'); const kp_ = ksk.mir.plane.getWorldPosition(V(0, 0, 0)); put(man, kp_.x + 5, .66, kp_.z, -Math.PI / 2); applyPose(man, idlePose(L.T)); face(man, { eyes: 'wide', mouth: 'o', brows: -.3, look: [-.3, 0] }, L.T);
  mirror(ksk.mir, [kp_.x - .3, 5.4, kp_.z], [kp_.x + 5, 5, kp_.z], 52, M => { use('town'); put(refMan, kp_.x + 5, .66, kp_.z, -Math.PI / 2); const j = Math.abs(Math.sin(M.T * 7)); refMan.root.position.y = .66 + j * .8;
    applyPose(refMan, { aLz: 2.6, aRz: 2.6, aLe: .3 }); face(refMan, { eyes: 'happy', mouth: 'grin' }, 99); money.forEach((b, i) => { b.visible = true; b.position.set(kp_.x + 5 + Math.sin(i * 2 + M.T) * 2, 6 + ((M.T * 2 + i * .4) % 3), kp_.z + Math.cos(i * 3) * 2); b.rotation.set(M.T * 3 + i, i, M.T); }); shadowAround(V(kp_.x, 0, kp_.z), 20); });
  cm([kp_.x + 7, 6, kp_.z + 12, kp_.x, 5.2, kp_.z - .5, 46], [kp_.x + 6.5, 6, kp_.z + 11, kp_.x, 5.2, kp_.z - .5, 44], L.k); shadowAround(V(kp_.x, 0, kp_.z), 20); }, [[.2, 'cheer', .4], [.5, 'coins', .5]]);
shot(13.70, 'C', null, L => { use('town'); const kp_ = ksk.mir.plane.getWorldPosition(V(0, 0, 0)); put(man, kp_.x + 3, .66, kp_.z + 5, -Math.PI / 2 + .3); applyPose(man, { aRx: 1.5, aRe: .4 }); face(man, { eyes: 'happy', mouth: 'grin' }, 99);
  ticket.visible = true; ticket.position.copy(man.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(-.5, .2, 0)); ticket.rotation.y = -Math.PI / 2; ticket.scale.setScalar(spring(clamp(L.lt * 1.5)));
  onFace(man, 7, 0, -1.5, 44, L.k, 6); badge('ja', 'LOS GEKAUFT!', W / 2, H * .17, L.lt - .3); shadowAround(V(kp_.x, 0, kp_.z), 20); }, [[.1, 'paper', .6], [.3, 'cash', .7]]);
// 11 los niños miran el espejo antes del examen
shot(15.06, 'Z', null, L => { use('cls'); ch3.visible = true; kids.forEach((c, i) => { const d = cls.desks[[0, 1, 2, 4][i]]; put(c, CX + d.position.x, 0, d.position.z + 2.4, Math.PI); applyPose(c, { aRx: 1.6, aRe: 1.3, headX: .1, crouch: .2 }); face(c, { mouth: 'flat', look: [0, .3] }, L.T + i); });
  cm([CX + 2, 8, 16, CX, 4, 0, 54], [CX + 2, 7.6, 14.5, CX, 4, 0, 52], L.k); shadowAround(V(CX, 0, 0), 25); }, [[0, 'classroom', .5], [.6, 'pencil', .4]]);
shot(16.20, 'W', null, L => { use('cls'); const c = kids[0]; put(c, CX - 8, 0, 1.4, 0); applyPose(c, { aRx: 1.5, aRe: 1.5 }); face(c, { eyes: 'wide', mouth: 'grin' }, L.T);
  hm.g.visible = true; const hpos = c.aR.hand.getWorldPosition(V(0, 0, 0)); hm.g.position.copy(hpos).add(V(0, 1.3, .4)); hm.g.rotation.y = Math.PI;
  mirror(hm.mir, [hpos.x, hpos.y + 1.3, hpos.z + .2], [hpos.x, hpos.y + 1.2, hpos.z - 3], 40, M => { use('cls'); put(refKid, CX - 8, 0, -1.6, 0); applyPose(refKid, { aRx: 2.6, aRe: .2 }); face(refKid, { eyes: 'happy', mouth: 'grin' }, 99);
    note1.visible = true; note1.position.copy(refKid.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(0, .9, .3)); });
  cam([hpos.x + .4, hpos.y + 1.6, hpos.z - 2.2], [hpos.x, hpos.y + 1.3, hpos.z + .4], 36); }, [[.2, 'ding_soft', .6]]);
// 13 el abuelo vio a su reflejo atropellado
shot(17.32, 'S', null, L => { use('bath'); put(opa, BX + 8, 0, -5.2, Math.PI); applyPose(opa, { lean: -.1, aLx: .5, aRx: .5 }); face(opa, scared, L.T);
  mirror(bmir, [2, 5, -36], [2, 4, -52], 50, M => { use('town'); put(refOpa, 2, .66, -52, Math.PI / 2); const k = clamp((M.lt - .4) / .9); carM.visible = true; carM.position.set(lerp(-30, 6, clamp(M.lt / 1.1)), .66, -52); carM.rotation.y = Math.PI / 2;
    if (k > 0) { refOpa.root.position.set(2 + k * 10, .66 + Math.sin(k * Math.PI) * 5, -52); refOpa.root.rotation.z = -k * 2.5; applyPose(refOpa, { aLz: 1.6, aRz: 1.6, lLx: .8 }); face(refOpa, { eyes: 'wide', mouth: 'shout' }, 99); } else { applyPose(refOpa, walkPose(M.T, .6)); face(refOpa, { mouth: 'smile' }, 99); } shadowAround(V(2, 0, -52), 30); });
  cm([BX + 12, 6, 7, BX + 8, 6, -10.4, 50], [BX + 11.4, 6, 6, BX + 8, 6, -10.4, 48], L.k); }, [[.1, 'car_pass', .7], [.65, 'car_hit', .8], [.7, 'impact', .6]]);
shot(18.90, 'C', null, L => { use('bath'); put(opa, BX + 8, 0, -5.2, .2); applyPose(opa, { lean: -.15, aLx: 1.4, aLe: 1.6, headX: -.05 }); face(opa, { ...scared, mouth: 'shout' }, L.T); onFace(opa, 4.4, .2, 0, 40 * punch(L.lt, .02, .22), 0); }, [[0, 'gasp_old', .7]]);
// 15 …y se quedó todo el día en casa
shot(20.37, 'R', null, L => { use('liv'); put(opa, LX + 6, 1.4, -3.4, -.2); applyPose(opa, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aRx: 1.2, aRe: 1.3, headX: .1 }); face(opa, { eyes: 'squint', mouth: 'frown', brows: .4, look: [-.6, 0] }, L.T);
  cm([LX + 2, 6, 8, LX + 5.5, 4.5, -3, 46], [LX + 2.4, 6, 7, LX + 5.5, 4.5, -3, 44], L.k); badge('tag', 'ZU HAUSE', W / 2, H * .15, L.lt - .3); }, [[0, 'clock_tick', .5], [.8, 'cup_marble', .4]]);
// 16 una regla que todos conocen
shot(22.01, 'Z', null, L => { use('cls'); ch1.visible = true; put(teacher, CX + 6, 0, -8, -.4); const s = Math.sin(L.T * 9); applyPose(teacher, { aRx: 2.5 + s * .1, aRe: .4, aRz: .2 + s * .1, headY: -.3 }); face(teacher, { mouth: 'flat', brows: .5 }, L.T);
  cm([CX + 1, 8, 18, CX + 2, 8, -10, 50], [CX + 1, 8, 16.5, CX + 2, 8, -10, 48], L.k); shadowAround(V(CX, 0, -6), 20); }, [[0, 'chalk', .7], [.8, 'chalk', .6]]);
shot(23.62, 'C', null, L => { use('cls'); ch2.visible = true; put(teacher, CX + 9, 0, -7, -.9); applyPose(teacher, { aLx: 1.7, aLz: .4, aLe: .1 }); face(teacher, { eyes: 'squint', mouth: 'flat', brows: .8 }, L.T);
  cm([CX, 9, 12, CX, 9.6, -10, 48], [CX, 9, 10.5, CX, 9.6, -10, 46 * punch(L.lt, .02, .1)], L.k); }, [[0, 'impact_soft', .5], [.4, 'chalk', .5]]);
// 18 porque no te puede contestar (reflejo con la mano en la boca) — ZOOM LENTO
shot(25.70, 'W', 'slow', L => { roomDay(); roomMirror(M => { roomDay(); atMirror(refC, Math.PI); refC.root.position.z = -4.6; applyPose(refC, { aRx: 2.3, aRe: 2.3, headX: .05 }); face(refC, { eyes: 'open', mouth: 'flat', brows: .2, look: [0, 0] }, 99); },
  [RX - 6, 4.6, -9.8], [RX - 6, 4.1, -4.6], 50); cm([RX - 6, 5.6, -2.6, RX - 6, 5.6, -10, 44], [RX - 6, 5.6, -6.2, RX - 6, 5.4, -10, 36], L.k, easeIn); }, []);
// 19 soy Emil, 13
shot(27.33, 'S', null, L => { roomDay(); put(emil, RX - 1, 0, 0, 0); kp(emil, L.lt, [[0, {}], [.3, { aRz: 2.6, aRe: .3 }], [1.5, { aRz: 2.7, aRe: .2 }]], { aRe: .3 + Math.abs(Math.sin(L.T * 8)) * .4 }); face(emil, { eyes: 'happy', mouth: 'grin', blush: .6 }, 99);
  onFace(emil, 9, .8, 1, 46, L.k, 7.5); badge('tag', 'EMIL, 13', W / 2, H * .16, L.lt - .15); }, [[0, 'pop', .6], [.3, 'whoosh_soft', .4]]);
// 20 un martes por la mañana se acerca al espejo bostezando
shot(28.85, 'W', null, L => { roomDay(); room.digits[0].visible = true; const z = lerp(2, -4.6, easeInOut(L.k)); put(emil, RX - 6, 0, z, Math.PI); applyPose(emil, { ...walkPose(L.T, .7, .6), aLz: 1.8, aRz: 1.8, aLe: 1.6, aRe: 1.6 }); face(emil, { eyes: 'closed', mouth: 'yawn' }, 99);
  cm([RX + 4, 8, 6, RX - 6, 4, z, 50], [RX + 3.4, 8, 5, RX - 6, 4, z, 48], L.k); badge('tag', 'DIENSTAG · 07:00', W / 2, H * .14, L.lt - .2); }, [[0, 'alarm', .4], [.4, 'yawn_m', .7], [1.2, 'steps', .4]]);
// 21 …y el reflejo estaba en el pasillo de la escuela
shot(31.19, 'Z', 'slow', L => { roomDay(); atMirror(emil); applyPose(emil, { lean: -.05, aLx: .3, aRx: .3 }); face(emil, scared, L.T); roomMirror(M => fireHall(M));
  cm([RX - 3.6, 6.6, 1.6, RX - 6, 5.6, -10, 44], [RX - 4.6, 6, -1.6, RX - 6, 5.6, -10, 36], L.k); }, [[0, 'fire_crackle', .6], [.3, 'riser_short', .4]]);
// 22 todo ardía
shot(33.59, 'C', null, L => { fireHall(L); ref.root.visible = false; cm([HX + 5, 4, 6, HX - 2, 7, -40, 56], [HX + 4.5, 4.4, 4, HX - 2, 7, -40, 54], L.k); }, [[0, 'fire_roar', .8]]);
// 23 las ventanas estaban hechas añicos
shot(34.58, 'F', null, L => { fireHall(L); ref.root.visible = false; hall.glass.forEach(g => { g.m.visible = true; const t = clamp(L.lt - .1); g.m.position.set(g.v[0] * t * 1.2, 7 + g.v[1] * t - 10 * t * t, -hall.LEN + 9 + g.v[2] * t); g.m.rotation.set(t * 9, t * 7, 0); }); hall.winM.emissiveIntensity = 2 * (1 - clamp(L.lt)); grade.uniforms.flash.value = Math.max(0, .5 - L.lt * 2);
  cm([HX, 7, -48, HX, 7, -70, 54], [HX, 7, -50, HX, 7, -70, 52], L.k); }, [[.05, 'glass_break', 1], [.1, 'impact', .6]]);
// 24 y llevaba algo en brazos — ZOOM LENTO
shot(36.17, 'W', 'slow', L => { fireHall(L, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2, aLz: .2, aRz: .2 }); bundle.visible = true; bundle.position.copy(ref.aL.hand.getWorldPosition(V(0, 0, 0))).lerp(ref.aR.hand.getWorldPosition(V(0, 0, 0)), .5).add(V(0, .3, .5));
  onFace(ref, 7, -.8, 0, 44, L.k, 4.5); }, []);
// 25 llamé a la policía
shot(37.62, 'C', null, L => { roomDay(); put(emil, RX - 1, 0, -1, .2); const s = Math.sin(L.T * 9); applyPose(emil, { aRx: 2.3, aRe: 2.5, aLx: .6 + s * .2, aLe: .8, aLz: .4, headZ: .1 }); talk(emil, L.T, 37.6, 39.4, { ...scared, mouth: 'shout' });
  ph.visible = true; ph.position.copy(emil.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(.2, .3, .25)); ph.rotation.set(0, .2, .2); onFace(emil, 5, .3, -1.6, 42, L.k, 4.4); badge('tag', '☎ 110', W * .76, H * .16, L.lt - .2); }, [[0, 'dial', .6], [.6, 'phone_ring', .4]]);
// 26 en una hora se desalojó la escuela
shot(39.36, 'S', null, L => { use('ext'); kids.forEach((c, i) => { const z = -6 + L.lt * 9 + i * 1.5; put(c, EX - 6 + i * 4, 0, z, 0); applyPose(c, runPose(L.T + i * .2)); face(c, { eyes: 'wide', mouth: 'o' }, L.T + i); });
  put(cop, EX + 12, 0, 12, -.8); applyPose(cop, { aRz: 1.6, aRe: .3, aRx: .4 }); face(cop, { mouth: 'shout', brows: .6 }, L.T); cm([EX, 7, 34, EX, 6, -5, 52], [EX, 7, 31, EX, 6, -5, 50], L.k); shadowAround(V(EX, 0, 0), 40); }, [[0, 'crowd_run', .7], [.3, 'siren', .6]]);
shot(40.60, 'W', null, L => { use('ext'); extras.forEach((a, i) => { put(a, EX - 10 + i * 9, 0, 20 + i, Math.PI); applyPose(a, { ...idlePose(L.T, i), aLx: .3 }); face(a, { eyes: 'wide', mouth: 'o' }, L.T + i); }); kids.forEach((c, i) => { put(c, EX - 12 + i * 7, 0, 26, Math.PI); applyPose(c, idlePose(L.T, i)); });
  cm([EX - 30, 50, 60, EX, 6, -10, 50], [EX - 26, 46, 56, EX, 6, -10, 48], L.k); badge('tag', 'GERÄUMT', W / 2, H * .14, L.lt - .2); shadowAround(V(EX, 0, 10), 60); }, [[0, 'siren', .5], [.6, 'murmur', .5]]);
// 28 los bomberos registraron cada aula
shot(41.88, 'C', null, L => { use('hall'); hall.lights.forEach(l => l.intensity = 20); hemi.intensity = .3; sunL.intensity = .2; fm.forEach((f, i) => { put(f, HX + (i ? 3 : -3), 0, -10 - L.lt * 4 - i * 3, Math.PI); applyPose(f, { ...walkPose(L.T + i * .5, .6), aRx: 1.4, aRe: .2 }); });
  cm([HX, 6, 6, HX, 5, -20, 50], [HX, 6, 3, HX, 5, -22, 48], L.k); }, [[0, 'steps_heavy', .6], [.4, 'radio', .4]]);
shot(43.10, 'S', null, L => { use('cls'); hemi.intensity = .3; sunL.intensity = .2; cls.g.children.forEach(o => { if (o.isPointLight) o.intensity = 30; }); const f = fm[0]; put(f, CX + 6, 0, 6, -2.4 + Math.sin(L.T * 1.5) * .5); applyPose(f, { aRx: 1.4, aRe: .2 }); face(f, { mouth: 'flat', brows: .4 }, L.T);
  cm([CX + 12, 9, 12, CX, 4, -2, 50], [CX + 11, 9, 11, CX, 4, -2, 48], L.k); }, [[0, 'door_open', .5], [.4, 'steps', .4]]);
shot(44.27, 'C', null, L => { use('cls'); const f = fm[1]; put(f, CX, 0, 2, 0); applyPose(f, { aLz: 1.2, aRz: 1.2, aLe: 1.4, aRe: 1.4, headZ: .2 }); face(f, { eyes: 'open', mouth: 'flat', brows: -.3 }, L.T); onFace(f, 6, 0, 0, 42 * punch(L.lt, 0, .15), 0); badge('red', 'NICHTS', W / 2, H * .17, L.lt * 2); }, [[0, 'impact_soft', .6]]);
// 31 a la mañana siguiente vuelvo a mirar
shot(44.87, 'Z', null, L => { roomDay(); room.digits[0].visible = true; const z = lerp(1, -4.6, easeInOut(L.k)); put(emil, RX - 6, 0, z, Math.PI); applyPose(emil, walkPose(L.T, .6)); cm([RX - 1, 6, 6, RX - 6, 5, -8, 50], [RX - 1.6, 6, 5, RX - 6, 5, -8, 48], L.k); badge('tag', 'MITTWOCH · 07:00', W / 2, H * .14, L.lt - .1); }, [[0, 'steps', .5], [.6, 'heartbeat', .5]]);
shot(46.58, 'W', null, L => { roomDay(); roomMirror(M => fireHall(M, { headX: .2 }, { eyes: 'half', mouth: 'frown' })); cm([RX - 6, 5.6, -3.4, RX - 6, 5.6, -10, 44], [RX - 6, 5.6, -4.8, RX - 6, 5.6, -10, 42], L.k); }, [[0, 'fire_crackle', .7]]);
// 33 pero esta vez el reflejo me miraba — ZOOM LENTO
shot(47.97, 'C', 'slow', L => { fireHall(L, { headX: -.05 }, { eyes: 'open', mouth: 'flat', brows: .2, look: [0, 0] }); onFace(ref, 7, 0, 0, 40, L.k, 3.4); }, []);
// 34 levanta lentamente una hoja
shot(50.30, 'S', 'slow', L => { const k = easeInOut(clamp(L.lt / 1.4)); fireHall(L, { aLx: lerp(.2, 1.8, k), aRx: lerp(.2, 1.8, k), aLe: .4, aRe: .4 }, { eyes: 'open', mouth: 'flat' });
  paper.visible = true; paper.position.copy(ref.aL.hand.getWorldPosition(V(0, 0, 0))).lerp(ref.aR.hand.getWorldPosition(V(0, 0, 0)), .5).add(V(0, .6, .45)); onFace(ref, 9, -.6, 1.5, 46, L.k, 8); }, [[0, 'paper', .7]]);
shot(52.02, 'C', null, L => { fireHall(L, { aLx: 1.8, aRx: 1.8, aLe: .4, aRe: .4 }); paper.visible = true; const p = ref.aL.hand.getWorldPosition(V(0, 0, 0)).lerp(ref.aR.hand.getWorldPosition(V(0, 0, 0)), .5).add(V(0, .6, .45)); paper.position.copy(p);
  cam([p.x, p.y, p.z + 4.6], [p.x, p.y, p.z], 44 * punch(L.lt, .02, .25)); }, [[0, 'impact', .7], [.1, 'braam_short', .5]]);
// 36 me quedé helado
shot(53.74, 'W', null, L => { roomDay(); atMirror(emil, .2); applyPose(emil, { lean: -.1 }); face(emil, { eyes: 'wide', mouth: 'o', brows: -.9 }, 99); grade.uniforms.sat.value = .45; onFace(emil, 4.6, .2, 0, 40, L.k, 4.2); }, [[0, 'freeze', .6]]);
// 37 algo se movía detrás de él en el humo — ZOOM LENTO
shot(54.61, 'S', 'slow', L => { fireHall(L, {}, { eyes: 'open', mouth: 'flat' }); shadowF.visible = true; shadowF.position.set(HX + 2.5, 0, -34 + L.lt * .6); shadowF.rotation.y = -.15;
  cm([HX - 1, 5, -8, HX + 1.4, 7, -30, 50], [HX - .6, 5.4, -12, HX + 1.8, 8.4, -32, 42], L.k, easeIn); }, []);
shot(56.85, 'C', null, L => { fireHall(L); shadowF.visible = true; shadowF.position.set(HX + 2.5, 0, -34); const e = V(HX + 2.5, 10.2, -33); cam([e.x + .4, e.y, e.z + 6], [e.x, e.y, e.z], 40 * punch(L.lt, .02, .2)); }, [[0, 'creepy_ting', .7], [.1, 'impact_soft', .5]]);
// 39 y entonces el espejo se rajó
shot(57.99, 'Z', null, L => { roomDay(); const k = clamp((L.lt - .2) * 3); put(emil, RX - 6, 0, lerp(-4.6, -1.8, easeOut(clamp((L.lt - .25) * 2))), Math.PI); applyPose(emil, { lean: -.3, aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4, lLx: -.3 }); face(emil, scared, L.T);
  room.mir.crack.visible = k > 0; room.mir.crack.scale.setScalar(Math.max(.01, k)); roomMirror(M => fireHall(M)); cm([RX - 1.5, 7, 4, RX - 6, 5.6, -9, 48], [RX - 1.8, 7, 3, RX - 6, 5.6, -9, 46 * punch(L.lt, .2, .15)], L.k); }, [[.2, 'glass_crack', 1], [.25, 'impact', .6]]);
// 40 esa misma noche, a medianoche
shot(60.14, 'R', null, L => { nightRoom(); room.digits[1].visible = true; const p = room.digits[1].getWorldPosition(V(0, 0, 0)); cm([p.x + .5, p.y + .6, p.z + 5, p.x, p.y, p.z, 40], [p.x + .3, p.y + .4, p.z + 3.4, p.x, p.y, p.z, 36], L.k); badge('tag', 'MITTERNACHT', W / 2, H * .15, L.lt - .3); }, [[0, 'clock_tick', .6], [.7, 'clock_tick', .6], [1.2, 'owl', .3]]);
// 41 oí unos golpes
shot(61.60, 'C', null, L => { nightRoom(); put(emil, RX + 9, 3.6, -2.8, 0); emil.root.rotation.x = -Math.PI / 2 + .25; applyPose(emil, { aLz: .2 }); face(emil, { eyes: 'wide', mouth: 'flat', brows: -.6, look: [-.6, -.4] }, L.T);
  cm([RX + 7, 9, 3, RX + 9, 4, -4.5, 46], [RX + 7.4, 8.6, 2.2, RX + 9, 4, -4.5, 44], L.k); for (const [t, x] of [[.2, .26], [.6, .72], [1.0, .4]]) if (L.lt > t) badge('knock', 'KLOPF', W * x, H * (.2 + t * .1), (L.lt - t) * 1.5, clamp(1.2 - (L.lt - t))); }, [[.2, 'knock', .9], [.6, 'knock', .9], [1.0, 'knock', .9]]);
// 42 venía del espejo del baño
shot(63.31, 'S', null, L => { use('bath'); day(0); hemi.intensity = .25; bath.g.children.forEach(o => { if (o.isPointLight) o.intensity = 30; }); mirror(bmir, FH.P, FH.Tg, FH.fov, M => fireHall(M, {}, { eyes: 'open', mouth: 'flat' }));
  cm([BX + 2, 7, 6, BX + 8, 7.4, -10.4, 50], [BX + 2.6, 7, 5, BX + 8, 7.4, -10.4, 48], L.k); bloom.strength = .8; }, [[.1, 'knock', .8], [.6, 'knock', .8], [1.1, 'hum_low', .5]]);
shot(65.00, 'W', null, L => { use('bath'); day(0); hemi.intensity = .25; bath.g.children.forEach(o => { if (o.isPointLight) o.intensity = 30; }); put(emil, BX + 8, 0, lerp(2, -1.6, L.k), Math.PI); applyPose(emil, walkPose(L.T, .4)); mirror(bmir, FH.P, FH.Tg, FH.fov, M => fireHall(M));
  cm([BX + 8, 6.5, 8, BX + 8, 6, -10, 50], [BX + 8, 6.5, 7, BX + 8, 6, -10, 48], L.k); }, [[0, 'steps', .5]]);
// 44 apretó la mano contra el cristal
const handOn = { aRx: 1.55, aRe: .1, aRz: -.05 };
shot(65.75, 'C', null, L => { use('bath'); day(0); hemi.intensity = .25; mirror(bmir, [HX + .3, 4.6, -16.2], [HX, 4, -20], 46, M => fireHall(M, { ...handOn, lean: .1 }, { eyes: 'open', mouth: 'frown', brows: .3 }));
  const mp = bmir.plane.getWorldPosition(V(0, 0, 0)); cm([mp.x, mp.y, mp.z + 5.4, mp.x, mp.y, mp.z, 50], [mp.x, mp.y, mp.z + 4.2, mp.x, mp.y, mp.z, 46], L.k); }, [[0, 'hand_glass', .9]]);
shot(67.40, 'S', 'slowv', L => { use('bath'); day(0); hemi.intensity = .2; put(emil, BX + 8, 0, -3.8, Math.PI); applyPose(emil, { lean: .1 }); face(emil, scared, L.T); mirror(bmir, FH.P, FH.Tg, FH.fov, M => fireHall(M, handOn));
  const L2 = bath.g.children.find(o => o.isPointLight); if (L2) { L2.intensity = 160; L2.color.setRGB(1, .45, .2); L2.position.set(8, 7, -8); }
  const h = hp(emil); cm([h.x + 1.2, h.y + .6, h.z - 4.4, h.x, h.y + .4, h.z, 44], [h.x + 1, h.y + .6, h.z - 3.8, h.x, h.y + .4, h.z, 42], L.k); }, [[0, 'whisper', .6]]);
// 46 "Escucha. Mañana muere tu hermana."
shot(69.02, 'C', null, L => { use('bath'); day(0); hemi.intensity = .25; mirror(bmir, [HX, 4.6, -16.6], [HX, 4.4, -20], 40, M => { fireHall(M, handOn, { eyes: 'open', brows: .5 }); talk(ref, M.T, 69, 70.6, { eyes: 'open', mouth: 'flat', brows: .5, soot: 1, blood: 1 }); });
  const mp = bmir.plane.getWorldPosition(V(0, 0, 0)); cam([mp.x, mp.y + .2, mp.z + 3.4], [mp.x, mp.y, mp.z], 46 * punch(L.lt, .55, .12)); badge('red', 'MORGEN', W / 2, H * .15, L.lt - .6); }, [[.55, 'braam_short', .6]]);
shot(70.56, 'W', null, L => { use('bath'); day(0); hemi.intensity = .25; put(emil, BX + 8, 0, -3.8, .3); applyPose(emil, { lean: .2, aLx: .9, aRx: .9, aLe: 1.3, aRe: 1.3, aLz: -.2, aRz: -.2, headX: .1 }); face(emil, { eyes: 'squint', mouth: 'teeth', brows: -.8, sweat: 1 }, L.T); emil.faceMat.color.setRGB(.8, 1, .75);
  onFace(emil, 5.5, -.5, 1.2, 42, L.k, 4.8); }, [[.1, 'stomach', .6], [.3, 'gulp', .5]]);
// 48 "Cada vez que me salvas, cambia el mañana."
shot(71.53, 'S', null, L => { use('bath'); day(0); hemi.intensity = .25; mirror(bmir, [HX, 4.6, -16.6], [HX, 4.4, -20], 40, M => { fireHall(M, {}, {}); talk(ref, M.T, 71.5, 75.6, { eyes: 'open', mouth: 'flat', brows: .5, soot: 1, blood: 1 }); });
  const mp = bmir.plane.getWorldPosition(V(0, 0, 0)); cm([mp.x + 1.2, mp.y, mp.z + 4.6, mp.x, mp.y, mp.z, 46], [mp.x + .6, mp.y, mp.z + 3.8, mp.x, mp.y, mp.z, 44], L.k); }, [[0, 'hum_low', .4]]);
shot(73.50, 'Z', null, L => { roomDay(); put(lina, RX - 1, 0, 0, .4); applyPose(lina, { crouch: .9, lLx: 1.5, lRx: 1.5, lLk: 2.2, lRk: 2.2, aLx: 1.1, aRx: 1.1, aLe: .9, aRe: .9, headY: Math.sin(L.T * 2) * .3 }); face(lina, { eyes: 'happy', mouth: 'grin', blush: 1 }, 99);
  onFace(lina, 8, 1, 1.5, 46, L.k, 6.5); badge('tag', 'LINA', W / 2, H * .16, L.lt - .3); }, [[.1, 'kids_laugh', .4], [.6, 'toy', .5]]);
// 50 lleva un collar
shot(75.59, 'C', null, L => { roomDay(); put(lina, RX - 1, 0, 0, .1); applyPose(lina, { crouch: .9, lLx: 1.5, lRx: 1.5, lLk: 2.2, lRk: 2.2 }); face(lina, { eyes: 'open', mouth: 'smile' }, L.T); const p = lina.props.pend.getWorldPosition(V(0, 0, 0)); bloom.strength = .9;
  cam([p.x + .4, p.y + .6, p.z + 2.8], [p.x, p.y + .4, p.z], 40 * punch(L.lt, .02, .15)); badge('tag', 'KETTE', W * .74, H * .2, L.lt - .2); }, [[0, 'sparkle', .7]]);
// 51 está en el sótano de la escuela
shot(76.78, 'S', null, L => { use('bas'); hemi.intensity = .9; sunL.intensity = .6; shadowAround(V(KX - 5, 0, 18), 15); cm([KX - 5, 6, 30, KX - 5, 6, 16.6, 46], [KX - 5, 6, 26, KX - 5, 6, 16.6, 42], L.k); badge('tag', 'KELLER', W / 2, H * .15, L.lt - .3); }, [[0, 'drip', .5], [.6, 'hum_low', .4]]);
// 52 "Sácala de ahí."
shot(78.21, 'C', null, L => { use('bath'); day(0); hemi.intensity = .25; mirror(bmir, [HX, 4.6, -16.6], [HX, 4.4, -20], 40, M => { fireHall(M, { ...handOn, aLx: 1.55, aLe: .1 }); face(ref, { eyes: 'squint', mouth: 'shout', brows: 1, soot: 1, blood: 1 }, M.T); });
  const mp = bmir.plane.getWorldPosition(V(0, 0, 0)); cam([mp.x, mp.y, mp.z + 3], [mp.x, mp.y, mp.z], 46 * punch(L.lt, .05, .25)); }, [[.05, 'slam', .8], [.1, 'glass_rattle', .6]]);
// 53 corrí a la escuela
shot(79.36, 'W', null, L => { use('ext'); const z = 30 - L.lt * 10; put(emil, EX, 0, z, Math.PI); applyPose(emil, runPose(L.T, 1.1)); face(emil, { eyes: 'squint', mouth: 'teeth', brows: .8 }, L.T); cam([EX + 3, 4, z + 9], [EX, 4, z - 6], 52); shadowAround(V(EX, 0, z), 25); }, [[0, 'run_grass', .8], [.8, 'breath', .5]]);
// 54 la puerta del sótano estaba cerrada
shot(81.52, 'S', null, L => { use('bas'); hemi.intensity = 1; sunL.intensity = .6; shadowAround(V(KX - 5, 0, 18), 15); put(emil, KX - 5, 0, 19.4, Math.PI); const s = Math.sin(L.T * 14); applyPose(emil, { aRx: 1.5, aRe: .5, lean: -.15 + s * .05, aLx: 1.2 }); face(emil, { eyes: 'squint', mouth: 'teeth', brows: .8 }, L.T);
  cm([KX - 1, 6, 26, KX - 5, 5, 17, 48], [KX - 1.4, 6, 25, KX - 5, 5, 17, 46], L.k); }, [[0, 'chain_rattle', .8], [.6, 'chain_rattle', .7]]);
shot(82.99, 'C', null, L => { use('bas'); hemi.intensity = 1; sunL.intensity = .6; const p = bas.sign.getWorldPosition(V(0, 0, 0)); cm([p.x, p.y, p.z + 5.5, p.x, p.y, p.z, 44], [p.x, p.y, p.z + 4.6, p.x, p.y, p.z, 42 * punch(L.lt, .05, .1)], L.k); badge('red', 'VERBOTEN', W / 2, H * .17, L.lt - .6); }, [[.05, 'impact_soft', .6], [.6, 'alarm_soft', .4]]);
// 56 le di una patada
shot(84.71, 'F', null, L => { use('bas'); hemi.intensity = 1; sunL.intensity = .6; shadowAround(V(KX - 5, 0, 18), 15); put(emil, KX - 5, 0, 20, Math.PI); kp(emil, L.lt, [[0, { lRx: -.4, lRk: 1.2, lean: .2 }], [.12, { lRx: 1.6, lRk: 0, lean: -.3 }], [.5, { lRx: .4, lean: -.1 }]]); face(emil, { eyes: 'squint', mouth: 'shout', brows: 1 }, L.T);
  if (L.lt > .12) { const t = L.lt - .12; bas.door.rotation.x = -t * 4; bas.door.position.set(-2.5, Math.max(0, 6 * t - 15 * t * t), -t * 14); bas.chain.visible = false; bas.lock.visible = false; }
  cm([KX + 2, 4, 26, KX - 5, 4, 18, 50], [KX + 1.6, 4, 25, KX - 5, 4, 18, 48 * punch(L.lt, .12, .2)], L.k); }, [[.12, 'kick', 1], [.15, 'door_crash', 1]]);
// 57 dentro: una máquina enorme — ZOOM LENTO
shot(85.52, 'C', 'slow', L => { use('bas'); hemi.intensity = .5; bas.rings.forEach((r, i) => r.rotation.z = L.T * (1 + i * .5)); put(emil, KX - 3, 0, 8, Math.PI); applyPose(emil, { lean: -.05, headX: -.4 }); face(emil, { eyes: 'wide', mouth: 'o', brows: -.5 }, L.T);
  cm([KX - 2, 3, 15, KX, 9, -6, 56], [KX - 1.4, 3, 11, KX, 10, -6, 48], L.k, easeIn); shadowAround(V(KX, 0, 0), 30); }, [[.1, 'machine_hum', .6]]);
// 58 rodeada de cientos de espejos
shot(87.51, 'R', null, L => { use('bas'); hemi.intensity = .5; bas.rings.forEach((r, i) => r.rotation.z = L.T * (1 + i * .5)); const a = -1.2 + L.k * 1.1; cam([KX + Math.sin(a) * 10, 9, -6 + Math.cos(a) * 10], [KX - Math.sin(a) * 6, 9, -6 - Math.cos(a) * 12], 56); }, [[0, 'whoosh', .5], [.3, 'machine_hum', .5]]);
// 59 en cada espejo, una catástrofe distinta
shot(89.20, 'S', null, L => { use('bas'); hemi.intensity = .5; bas.rings.forEach((r, i) => r.rotation.z = L.T * (1 + i * .5)); put(emil, KX - 4, 0, 2, Math.PI + .6 * Math.sin(L.T * 1.2)); applyPose(emil, { headY: Math.sin(L.T * 1.5) * .5, headX: -.2 }); face(emil, { eyes: 'wide', mouth: 'o', brows: -.6 }, L.T);
  onFace(emil, 6.5, .3, 0, 44, L.k, 5.4); }, [[0, 'tv_static', .5]]);
const panelShot = (kind, t0, tr, sfx) => shot(t0, tr, null, L => { use('bas'); hemi.intensity = .5; const p = bas.panels.find(q => q.kind === kind && q.g.position.y < 10); const w = p.pl.getWorldPosition(V(0, 0, 0)), n = V(0, 0, 1).applyQuaternion(p.g.getWorldQuaternion(new THREE.Quaternion()));
  cm([w.x + n.x * 7, w.y, w.z + n.z * 7, w.x, w.y, w.z, 46], [w.x + n.x * 5.6, w.y, w.z + n.z * 5.6, w.x, w.y, w.z, 44], L.k); bloom.strength = .8; }, sfx);
panelShot(0, 91.91, 'C', [[0, 'fire_roar', .6]]); panelShot(1, 93.10, 'W', [[0, 'collapse', .7]]); panelShot(2, 94.67, 'S', [[0, 'wind', .6], [.4, 'riser_short', .4]]);
// 63 junto a ella estaba el conserje, el señor Krause
shot(96.41, 'Z', null, L => { use('bas'); hemi.intensity = .5; put(krause, KX + 5, 0, -1, lerp(-2, .4, easeOut(clamp(L.lt * 2)))); applyPose(krause, { ...idlePose(L.T), aRx: .3 }); face(krause, { eyes: 'wide', mouth: 'o', brows: -.5 }, L.T);
  onFace(krause, 8, .5, -2, 46, L.k, 6.5); badge('tag', 'HERR KRAUSE', W / 2, H * .15, L.lt - .3); }, [[0, 'keys', .6], [.5, 'pop', .4]]);
shot(98.77, 'C', null, L => { use('bas'); hemi.intensity = .5; put(krause, KX + 5, 0, -1, .4); applyPose(krause, idlePose(L.T)); face(krause, { eyes: 'wide', mouth: 'teeth', brows: -.8, sweat: 1 }, L.T); krause.faceMat.color.setRGB(.95, .98, 1); grade.uniforms.sat.value = .7;
  onFace(krause, 4.6, .3, 0, 40, L.k, 4.2); }, [[0, 'impact_soft', .5]]);
shot(100.09, 'S', null, L => { use('bas'); hemi.intensity = .5; put(krause, KX + 5, 0, -1, .4); applyPose(krause, { aRx: 1.6, aRe: .1, aRz: -.2, lean: .1 }); talk(krause, L.T, 100.0, 101.5, { eyes: 'wide', mouth: 'flat', brows: .6, sweat: 1 });
  onFace(krause, 6, .3, 1.8, 44, L.k, 5); }, [[.1, 'shout_m', .3]]);
// 66 de pronto la máquina empezó a temblar
shot(101.47, 'C', null, L => { use('bas'); hemi.intensity = .4; bas.red.intensity = 800 + Math.sin(L.T * 20) * 400; bas.core.visible = true; const r = RNG(Math.floor(L.T * 30)); bas.mach.position.set((r() - .5) * .4, 0, -6 + (r() - .5) * .4); bas.rings.forEach((g, i) => g.rotation.z = L.T * (4 + i * 2));
  put(emil, KX - 3, 0, 6, Math.PI + .3); applyPose(emil, { lean: -.2, aLz: .6, aRz: .6 }); face(emil, scared, L.T); put(krause, KX + 4, 0, 4, -2.6); applyPose(krause, { aLz: 1, aRz: 1, lean: -.2 }); face(krause, scared, L.T);
  cm([KX, 5, 18, KX, 8, -6, 54], [KX, 5, 16, KX, 8, -6, 52], L.k); }, [[0, 'machine_shake', .9], [.6, 'alarm', .5]]);
// 67 un espejo explotó — 68 luego otro
const boom = (idx) => (L) => { use('bas'); hemi.intensity = .4; bas.red.intensity = 900; bas.core.visible = true; const p = bas.panels[idx]; grade.uniforms.flash.value = L.lt > .15 ? Math.max(0, .7 - (L.lt - .15) * 2) : 0;
  const k2 = clamp((L.lt - .15) * 4); p.g.scale.setScalar(Math.max(.01, 1 - k2)); if (k2 > .3) { bas.fire.visible = true; bas.fire.userData.update(L.T, k2); } const w = p.g.getWorldPosition(V(0, 0, 0)), n = V(0, 0, 1).applyQuaternion(p.g.getWorldQuaternion(new THREE.Quaternion())); cam([w.x + n.x * 9, w.y + 1, w.z + n.z * 9], [w.x, w.y, w.z], 54 * punch(L.lt, .15, .25)); };
shot(103.52, 'F', null, boom(6), [[0, 'glass_break', 1], [.02, 'explosion', .8]]); shot(104.93, 'C', null, boom(9), [[0, 'glass_break', .9], [.02, 'explosion', .7]]);
// 69 y por todas partes estalló fuego
shot(105.79, 'W', null, L => { use('bas'); hemi.intensity = .4; hemi.color.setRGB(1, .5, .3); bas.fire.visible = true; bas.fire.userData.update(L.T, clamp(L.lt * 1.5)); bas.red.intensity = 600; put(emil, KX - 2, 0, 6, Math.PI); applyPose(emil, { aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, lean: -.2 }); face(emil, scared, L.T);
  cm([KX + 6, 6, 18, KX - 2, 5, 0, 54], [KX + 5, 6, 16, KX - 2, 5, 0, 52], L.k); bloom.strength = .8; }, [[0, 'fire_roar', 1], [.5, 'explosion', .5]]);
// 70 corrí escaleras arriba
shot(107.71, 'S', null, L => { use('bas'); hemi.intensity = .4; hemi.color.setRGB(1, .5, .3); bas.fire.visible = true; bas.fire.userData.update(L.T); hemi.intensity = .9; const k = clamp(L.k); put(emil, KX + 14, k * 9, 16 - k * 10, Math.PI); applyPose(emil, runPose(L.T, 1.2)); face(emil, scared, L.T);
  cam([KX + 22, 6 + k * 6, 14 - k * 4], [KX + 14, 4 + k * 9, 14 - k * 10], 52); }, [[0, 'steps_run', .8]]);
// 71 y entonces lo oí
shot(108.75, 'Z', null, L => { fireHall(L); ref.root.visible = false; put(emil, HX + 1, 0, -40, Math.PI); kp(emil, L.lt, [[0, runPose(L.T)], [.4, { lean: -.1 }], [1.2, { headY: .9, twist: .3 }]]); face(emil, { eyes: 'wide', mouth: 'o', brows: -.6, look: [.7, 0] }, L.T);
  onFace(emil, 7, .5, 2, 46, L.k, 6); }, [[0, 'fire_crackle', .6], [.5, 'heartbeat', .6]]);
// 72 "¡Emil!"
shot(110.14, 'C', null, L => { fireHall(L); ref.root.visible = false; shelfAt(0); linaUnder(L.T); const h = hp(lina); cam([h.x + .4, h.y + 1.2, h.z + 3.4], [h.x, h.y + .2, h.z], 44 * punch(L.lt, .02, .2)); }, [[0, 'scream_girl', .9]]);
// 73 Lina, atrapada bajo una estantería
shot(111.15, 'S', null, L => { fireHall(L); ref.root.visible = false; shelfAt(0); linaUnder(L.T); cm([HX + 7, 9, -44, HX - 1, 1, -55, 50], [HX + 6.4, 8.6, -45, HX - 1, 1, -55, 48], L.k); badge('tag', 'LINA', W / 2, H * .15, L.lt - .2); }, [[0, 'whoosh_down', .6], [.3, 'cry_girl', .6]]);
shot(112.70, 'W', null, L => { fireHall(L); ref.root.visible = false; shelfAt(0); linaUnder(L.T, { mouth: 'frown' }); const p = lina.props.pend.getWorldPosition(V(0, 0, 0)); bloom.strength = .9; cm([p.x + 2.4, p.y + 2, p.z + 3.6, p.x, p.y + .6, p.z, 44], [p.x + 2, p.y + 1.8, p.z + 3, p.x, p.y + .6, p.z, 42], L.k); }, [[0, 'cry_girl', .7], [.4, 'sparkle', .4]]);
// 75 las llamas se acercaban
shot(114.43, 'C', null, L => { fireHall(L); ref.root.visible = false; shelfAt(0); linaUnder(L.T); hall.fire.userData.update(L.T, 1 + L.k * .6); cm([HX + 4, 2, -36, HX + 6, 2, -46, 50], [HX + 3, 2, -38, HX + 5, 2, -46, 46], L.k); }, [[0, 'fire_roar', .8]]);
// 76 intenté levantarla — 77 pesaba demasiado
const atShelf = (L, k, f = {}) => { put(emil, HX - 1, 0, -48.3, Math.PI); applyPose(emil, liftPose(k)); face(emil, { eyes: 'squint', mouth: 'teeth', brows: .9, sweat: 1, ...f }, L.T); };
shot(116.05, 'S', null, L => { fireHall(L); ref.root.visible = false; const k = .2 + Math.sin(L.T * 9) * .05; shelfAt(.05); linaUnder(L.T); atShelf(L, k); onFace(emil, 6, .6, 2.4, 44, L.k, 5.2); }, [[0, 'strain', .7], [.6, 'wood_creak', .5]]);
shot(117.49, 'C', null, L => { fireHall(L); ref.root.visible = false; const d = clamp(L.lt * 3); shelfAt(.1 * (1 - d)); linaUnder(L.T); put(emil, HX - 1, 0, -47.6 + d, Math.PI); applyPose(emil, { crouch: .9 * d, lean: -.4 * d, aLz: .5, aRz: .5, lLx: 1.2 * d, lLk: 1.6 * d }); face(emil, { eyes: 'closed', mouth: 'frown', brows: -.7 }, 99);
  cm([HX + 6, 6, -42, HX - 1, 2, -50, 48], [HX + 5.6, 6, -43, HX - 1, 2, -50, 46 * punch(L.lt, .3, .15)], L.k); }, [[.3, 'thud', .9]]);
// 78 pero entonces vi el gran espejo de la pared — ZOOM LENTO
const wallMirror = (prep) => { const mp = hall.mir.plane.getWorldPosition(V(0, 0, 0)); mirror(hall.mir, [mp.x + .2, 5.2, -50], [HX + 1, 3, -50.5], 56, prep); return mp; };
const reflShelf = (k) => (M) => { fireHall(M); ref.root.visible = true; put(ref, HX - 1, 0, -48.3, Math.PI); applyPose(ref, liftPose(k)); face(ref, { eyes: 'squint', mouth: 'teeth', brows: .9, soot: 1, blood: 1 }, M.T); shelfAt(k * .8); linaUnder(M.T); };
shot(118.70, 'S', 'slow', L => { fireHall(L); ref.root.visible = false; shelfAt(0); linaUnder(L.T); put(emil, HX - 1, 0, -47.2, -Math.PI / 2 - .6); applyPose(emil, { headY: -.4 }); face(emil, { eyes: 'wide', mouth: 'o', brows: -.4, look: [-.8, 0] }, L.T);
  wallMirror(reflShelf(.1)); cm([HX + 7.5, 7, -42, HX - 8, 7, -50, 54], [HX + 4, 7, -46, HX - 8, 7, -50, 46], L.k, easeIn); }, []);
shot(121.07, 'C', null, L => { fireHall(L); const mp = wallMirror(M => { fireHall(M); put(ref, HX + 1, 0, -50, -Math.PI / 2); applyPose(ref, idlePose(M.T)); face(ref, { eyes: 'open', mouth: 'flat', brows: .3, soot: 1, blood: 1 }, M.T); });
  cm([HX + 1, 7.5, -50, mp.x, 7.5, -50, 48], [HX - 1, 7.5, -50, mp.x, 7.5, -50, 46], L.k); }, [[0, 'ding_reveal', .6]]);
// 80 …y levantaba justo esa estantería
shot(122.74, 'W', null, L => { fireHall(L); const mp = wallMirror(reflShelf(easeInOut(clamp(L.lt / 1.6)))); cm([HX + 1.5, 6.5, -50, mp.x, 6.5, -50, 52], [HX + .5, 6.5, -50, mp.x, 6.5, -50, 50], L.k); }, [[.2, 'strain', .5], [.4, 'wood_creak', .6]]);
// 81 así que copié cada movimiento
shot(124.87, 'S', null, L => { fireHall(L); ref.root.visible = false; const k = .25 + clamp(L.lt / 2) * .2; shelfAt(k * .8); linaUnder(L.T); atShelf(L, k); wallMirror(reflShelf(k + .1));
  cm([HX + 7, 6.5, -42, HX - 4, 5, -50, 54], [HX + 6.4, 6.5, -43, HX - 4, 5, -50, 52], L.k); }, [[0, 'whoosh_soft', .4], [.6, 'strain', .6]]);
shot(126.85, 'C', null, L => { fireHall(L); ref.root.visible = false; const k = .45 + clamp(L.lt / 1.7) * .3; shelfAt(k * .8); linaUnder(L.T); atShelf(L, k, { mouth: 'shout' }); cm([HX + 6, 5, -43, HX - 1, 3, -49, 46], [HX + 5.4, 5, -44, HX - 1, 3, -49, 44], L.k); }, [[0, 'strain', .8], [.6, 'wood_creak', .7]]);
// 83 y la estantería subió
shot(128.56, 'Z', null, L => { fireHall(L); ref.root.visible = false; const k = .75 + easeOut(clamp(L.lt * 2)) * .25; shelfAt(k * .8); linaUnder(L.T, { eyes: 'wide', mouth: 'o' }); atShelf(L, k, { mouth: 'shout' });
  cm([HX + 7, 4, -44, HX - 1, 3, -52, 50], [HX + 6.6, 4, -45, HX - 1, 3, -52, 48 * punch(L.lt, .3, .15)], L.k); }, [[.3, 'impact', .7], [.35, 'wood_creak', .6]]);
// 84 Lina salió arrastrándose
shot(130.01, 'S', null, L => { fireHall(L); ref.root.visible = false; shelfAt(.8); atShelf(L, 1); const k = clamp(L.lt / 1.4); put(lina, HX - 1, .5, -52.6 + k * 4, 0); lina.root.rotation.x = Math.PI / 2; const s = Math.sin(L.T * 10);
  applyPose(lina, { aLx: 2.6 + s * .3, aRx: 2.6 - s * .3, lLx: s * .3, lRx: -s * .3 }); face(lina, { eyes: 'squint', mouth: 'teeth', tears: 1 }, L.T); cm([HX + 4, 3, -42, HX - 1, 1, -50, 50], [HX + 3.6, 3, -43, HX - 1, 1, -50, 48], L.k); }, [[0, 'crawl', .7]]);
// 85 corrimos hacia fuera
shot(131.60, 'W', null, L => { fireHall(L); ref.root.visible = false; const z = -40 + L.lt * 14; put(emil, HX - 1.5, 0, z, 0); applyPose(emil, { ...runPose(L.T, 1.2), aLx: .6, aLe: .3 }); face(emil, { eyes: 'squint', mouth: 'teeth', brows: .8, soot: 1 }, L.T);
  put(lina, HX + 1.2, 0, z - .6, 0); applyPose(lina, { ...runPose(L.T + .2, 1.4), aRx: .6 }); face(lina, { eyes: 'wide', mouth: 'shout', tears: 1 }, L.T); cam([HX, 5, z + 10], [HX, 3, z - 4], 52); }, [[0, 'steps_run', .9], [.4, 'fire_roar', .6]]);
// 86 justo cuando toda la escuela se derrumbaba detrás
shot(133.20, 'F', null, L => { use('ext'); const k = clamp((L.lt - .3) / 1.2); ext.B.scale.set(1, Math.max(.05, 1 - easeIn(k)), 1); ext.dust.forEach((d, i) => { d.visible = k > .1; d.scale.setScalar(.5 + k * 1.5); });
  const z = 4 + L.lt * 8; put(emil, EX - 1.5, 0, z, 0); applyPose(emil, runPose(L.T, 1.2)); face(emil, { eyes: 'squint', mouth: 'teeth', soot: 1 }, L.T); put(lina, EX + 1.5, 0, z - .5, 0); applyPose(lina, runPose(L.T + .2, 1.4)); face(lina, { eyes: 'wide', mouth: 'shout' }, L.T);
  cam([EX, 4, z + 14], [EX, 7, -14], 56); const r = RNG(Math.floor(L.T * 30)); if (k > 0 && k < 1) { camera.position.x += (r() - .5) * .6; camera.position.y += (r() - .5) * .6; } shadowAround(V(EX, 0, 0), 40); }, [[.3, 'collapse', 1], [.4, 'explosion', .6], [1.2, 'rubble', .7]]);
// 87 esa noche, primero miré al espejo
shot(135.07, 'R', null, L => { roomDay(); room.digits[2].visible = true; room.lamp.color.setRGB(1, .8, .55); day(.4); const z = lerp(1.5, -4.6, easeInOut(L.k)); put(emil, RX - 6, 0, z, Math.PI); applyPose(emil, walkPose(L.T, .5)); cm([RX - 1, 6.5, 6, RX - 6, 5, -8, 50], [RX - 1.6, 6.5, 5, RX - 6, 5, -8, 48], L.k); badge('tag', '19:30', W * .74, H * .14, L.lt - .2); }, [[0, 'crickets', .4], [.5, 'steps', .4]]);
shot(136.30, 'C', null, L => { roomDay(); day(.4); atMirror(emil); applyPose(emil, idlePose(L.T)); face(emil, { mouth: 'flat' }, L.T); roomMirror(M => { roomDay(); atMirror(refC, Math.PI); applyPose(refC, idlePose(M.T)); face(refC, { mouth: 'flat' }, M.T); }, [RX - 6, 4.6, -9.8], [RX - 6, 4.1, -4.6], 50);
  cm([RX - 3.6, 6.4, 1.4, RX - 6, 5.6, -10, 44], [RX - 4, 6.2, .4, RX - 6, 5.6, -10, 42], L.k); }, [[0, 'heartbeat', .4]]);
// 88 mi reflejo sonrió
shot(137.56, 'S', null, L => { roomDay(); day(.4); roomMirror(M => { roomDay(); atMirror(refC, Math.PI); applyPose(refC, idlePose(M.T)); face(refC, { eyes: L.lt > .5 ? 'happy' : 'open', mouth: L.lt > .4 ? 'grin' : 'smile', blush: .5 }, 99); }, [RX - 6, 4.6, -9.8], [RX - 6, 4.1, -4.6], 44);
  cm([RX - 6, 5.6, -3.6, RX - 6, 5.6, -10, 42], [RX - 6, 5.6, -5, RX - 6, 5.6, -10, 40], L.k); }, [[.4, 'ding_soft', .6]]);
// 89 por fin todo había terminado
shot(138.94, 'W', null, L => { roomDay(); day(.4); put(emil, RX + 7, 3.2, -1, -.4); applyPose(emil, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, lean: -.2, aLz: .4, aRz: .4, headX: -.2 }); face(emil, { eyes: 'closed', mouth: 'smile', brows: -.2 }, 99);
  onFace(emil, 7, .5, -2, 46, L.k, 6); }, [[.1, 'sigh', .6], [.4, 'bed_creak', .5]]);
// 90 entonces me fui
shot(140.60, 'S', null, L => { roomDay(); day(.4); const z = lerp(-4.6, 2, easeInOut(L.k)); put(emil, RX - 6, 0, z, 0); applyPose(emil, walkPose(L.T, .6)); face(emil, { mouth: 'smile' }, L.T); roomMirror(M => { roomDay(); atMirror(refC, Math.PI); refC.root.position.z = z; applyPose(refC, walkPose(M.T, .6)); }, [RX - 6, 4.6, -9.8], [RX - 6, 4.1, z], 50);
  cm([RX - 6, 6, 12, RX - 6, 5, -6, 50], [RX - 6, 6, 11, RX - 6, 5, -6, 48], L.k); }, [[0, 'steps', .5]]);
// 91 pero mi reflejo se quedó quieto — ZOOM LENTO
shot(141.60, 'C', 'slow', L => { roomDay(); day(.3); put(emil, RX - 4, 0, 4 + L.lt * 2, 0); applyPose(emil, walkPose(L.T, .6)); roomMirror(M => { roomDay(); atMirror(refC, Math.PI); applyPose(refC, {}); face(refC, { eyes: 'open', mouth: 'flat', look: [0, 0] }, 99); }, [RX - 6, 4.6, -9.8], [RX - 6, 4.1, -4.6], 50);
  cm([RX - 2, 6, 10, RX - 6, 5.6, -10, 44], [RX - 4, 6, 4, RX - 6, 5.6, -10, 36], L.k, easeIn); }, []);
// 92 se llevó un dedo a los labios
shot(143.23, 'S', null, L => { roomDay(); day(.2); const k = easeInOut(clamp(L.lt / 1.2)); roomMirror(M => { roomDay(); day(.2); atMirror(refC, Math.PI); applyPose(refC, { aRx: lerp(0, 2.35, k), aRe: lerp(0, 2.3, k), aRz: lerp(.05, -.15, k) }); face(refC, { eyes: 'squint', mouth: 'smirk', brows: .6, look: [0, 0] }, 99); }, [RX - 6, 4.6, -9.8], [RX - 6, 4.2, -4.6], 40);
  cm([RX - 6, 5.6, -4, RX - 6, 5.6, -10, 40], [RX - 6, 5.6, -5.2, RX - 6, 5.6, -10, 38], L.k); grade.uniforms.vig.value = .6; }, [[.2, 'creepy_ting', .7], [.8, 'whisper', .4]]);
// 93 y entonces oí detrás de mí, desde mi cuarto…
shot(145.36, 'C', null, L => { nightRoom(); put(emil, RX - 2, 0, 9, 0); applyPose(emil, { lean: -.05, aLz: .2, aRz: .2 }); face(emil, { eyes: 'wide', mouth: 'teeth', brows: -.9, sweat: 1, look: [.6, 0] }, L.T); grade.uniforms.sat.value = .7;
  onFace(emil, 6, .3, 1.5, 44, L.k, 5); }, [[0, 'freeze', .6], [.6, 'heartbeat', .7]]);
// 94 …mi propia voz susurrando — la silueta del otro Emil en la oscuridad
shot(147.93, 'S', null, L => { nightRoom(); room.lamp.intensity = 25; put(emil, RX - 2, 0, 9, 0); applyPose(emil, {}); face(emil, { eyes: 'wide', mouth: 'o', brows: -.9 }, L.T); put(refC, RX - 6, 0, -3, 0); applyPose(refC, {}); face(refC, { eyes: 'squint', mouth: 'smirk', brows: .7 }, 99); refC.faceMat.color.setRGB(.4, .4, .5);
  cm([RX - 1, 6, 13, RX - 5, 4, -3, 46], [RX - 1.4, 6, 12, RX - 5, 4, -3, 42], L.k); grade.uniforms.vig.value = .7; grade.uniforms.sat.value = .5; }, [[0, 'whisper', .8], [.8, 'riser_short', .5]]);
// 95 "No te des la vuelta." — ZOOM LENTO final
shot(149.72, null, 'slow', L => { nightRoom(); put(emil, RX - 2, 0, 9, 0); applyPose(emil, {}); face(emil, { eyes: 'wide', mouth: 'teeth', brows: -1, sweat: 1, tears: 1 }, 99); grade.uniforms.sat.value = .6; onFace(emil, 4, .2, 0, 38, L.k, 2.6);
  grade.uniforms.flash.value = 0; if (L.lt > .95) grade.uniforms.lift.value = -clamp((L.lt - .95) * 8); }, [[0, 'whisper', .9]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 3, Z: 3, F: 2, S: 3, R: 4, I: 5, C: 4 }, TR_SFX = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slowv') { } else if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .05, s: ['zoom_in', 'whoosh_soft', 'zoom_out'][i % 3], g: .35 });
  if (s.tr) CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS).toFixed(3), s: TR_SFX[s.tr], g: .8 }); });
for (const [a, b] of [[.05, 3.98], [65.8, 69.0]]) { CUES.push({ t: a, s: 'riser', g: .9, d: +(b - a).toFixed(3) }); CUES.push({ t: b, s: 'braam', g: 1 }); }
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d };
  hideAll(); BAD.length = 0; s.fn(L);
  if (MIR) { const M = MIR; hideAll(); M.prep(L); mcam.aspect = M.m.w / M.m.h; mcam.fov = M.fov; mcam.position.set(...M.P); mcam.up.set(0, 1, 0); mcam.lookAt(...M.Tg); mcam.updateProjectionMatrix();
    renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, mcam); renderer.setRenderTarget(null); hideAll(); BAD.length = 0; s.fn(L); M.m.plane.material = mirMat; MIR = null; }
  if (s.zoom && s.zoom.startsWith('slow')) { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .85, e); camera.fov *= lerp(1, .92, e); }
  let sh = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'thump', 'braam', 'slam', 'kick', 'explosion', 'collapse', 'thud'].includes(c.s) && T - c.t < .12) sh = 1 - (T - c.t) / .12; }
  if (sh) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .22 * sh; camera.position.y += (r() - .5) * .22 * sh; }
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
  if (tr === 'Z') { const sc = ph < 0 ? 1 + a2 * .6 : 1 + a2 * .35; octx.scale(sc, sc); octx.filter = `blur(${(a * 6).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((ph < 0 ? 1 : -1) * a2 * .55); octx.scale(1 + a2 * .3, 1 + a2 * .3); octx.filter = `blur(${(a * 5).toFixed(1)}px)`; }
  if (tr === 'C' && ph > 0) { const sc = 1 + a * .22; octx.scale(sc, sc); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
