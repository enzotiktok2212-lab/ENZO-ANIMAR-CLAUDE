// Schlafstadt — 79 planos sincronizados con la narración (audio/words.json).
// window.renderAt(T) dibuja el instante T (determinista). window.CUES = lista de efectos de sonido.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, backOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, textPlane } from './engine.js';
import { nightSky, townSet, rathausturm, schlafgarten, cafeFront, cafeInterior, FONT, streetLamp } from './sets.js';
import { nursery, meadow, hinterhof, finnRoom, workshop, alley, towerInterior, pocketWatch, musicBox, clockHands, calendar, stretcher, camomile, babyFace, alarmClock } from './sets2.js';
import { makeFinn, makeOpa, makeWachter, makeTownsperson, makeNachtwaechter, coffeeCup } from './cast.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 135.17;

// ---------- render ----------
const stage = document.getElementById('stage');
const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out);
const octx = out.getContext('2d');
const scene = new THREE.Scene();
const FOG_NIGHT = new THREE.Color(0x3a3a8a), FOG_DAY = new THREE.Color(0xffc8a0);
scene.fog = new THREE.FogExp2(0x3a3a8a, 0.0022);
const camera = new THREE.PerspectiveCamera(50, W / H, 0.2, 4000);
const { composer, grade, bloom } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene);
const SKY_N = { top: new THREE.Color(0x0a1648), mid: new THREE.Color(0x2a2f8f), hor: new THREE.Color(0x7a4fb8) };
const SKY_D = { top: new THREE.Color(0x3d8ff5), mid: new THREE.Color(0x8fc7ff), hor: new THREE.Color(0xffc890) };
const sunTex = sky.moon.material.map;
const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, fog: false, depthWrite: false, transparent: true, toneMapped: false, color: new THREE.Color(3, 2.2, 1.2) }));
sun.scale.set(520, 520, 1); scene.add(sun); sun.visible = false;
const hemi = new THREE.HemisphereLight(0x8fa0ff, 0x4a3050, 1.35); scene.add(hemi);
const moonL = new THREE.DirectionalLight(0xc8d4ff, 1.6); moonL.castShadow = true; moonL.shadow.mapSize.set(4096, 4096);
moonL.shadow.bias = -0.0004; moonL.shadow.normalBias = 0.3; moonL.shadow.radius = 4; scene.add(moonL, moonL.target);
function shadowAround(p, size = 60) { const c = moonL.shadow.camera; Object.assign(c, { left: -size, right: size, top: size, bottom: -size, near: 1, far: 900 }); c.updateProjectionMatrix();
  moonL.target.position.copy(p); moonL.position.copy(p).add(V(-140, 260, 160)); }
function dayness(k) {   // 0 = noche eterna, 1 = amanecer/día
  const u = sky.sky.material.uniforms;
  u.top.value.copy(SKY_N.top).lerp(SKY_D.top, k); u.mid.value.copy(SKY_N.mid).lerp(SKY_D.mid, k); u.hor.value.copy(SKY_N.hor).lerp(SKY_D.hor, k);
  sky.moon.material.opacity = 1 - k; sun.visible = k > 0.02;
  moonL.color.setRGB(lerp(0.78, 1.0, k), lerp(0.83, 0.86, k), lerp(1.0, 0.66, k)); moonL.intensity = lerp(1.6, 3.2, k);
  hemi.color.setRGB(lerp(0.56, 0.85, k), lerp(0.63, 0.88, k), lerp(1.0, 1.0, k)); hemi.groundColor.setRGB(lerp(0.29, 0.6, k), lerp(0.19, 0.45, k), lerp(0.31, 0.35, k)); hemi.intensity = lerp(1.35, 1.6, k);
  scene.fog.color.copy(FOG_NIGHT).lerp(FOG_DAY, k); scene.fog.density = lerp(0.0022, 0.0012, k);
  sky.clouds.forEach(c => c.material.color.setRGB(lerp(1, 2.2, k), lerp(1, 1.6, k), lerp(1, 1.3, k)));
}

// ---------- mundo ----------
const SETS = {};
SETS.town = townSet(scene);
const tower = rathausturm(scene, 0, -420); SETS.tower = tower.g;
const garden = schlafgarten(scene, 0, -300); SETS.garden = garden.g;
const cafeF = cafeFront(scene, 24, -70); cafeF.g.rotation.y = -Math.PI / 2; SETS.cafeF = cafeF.g;
const cafe = cafeInterior(scene, 700, 0); SETS.cafe = cafe.g;
const nurs = nursery(scene, 900, 0); SETS.nurs = nurs.g;
nurs.book.position.set(-3.2, 0, 2.6); nurs.book.rotation.y = 0.3; nurs.book.scale.setScalar(0.8);
const stool = box(3.0, 4.2, 3.0, mat(0x8a5634), 0.2, nurs.g, 4.4, 2.1, -3); nurs.clock.g.position.set(4.4, 5.6, -3); nurs.clock.g.rotation.y = -0.4;
const mead = meadow(scene, 1200, 0); SETS.mead = mead.g;
const hof = hinterhof(scene, 1500, 0); SETS.hof = hof.g;
const room = finnRoom(scene, 1700, 0); SETS.room = room.g; room.g.traverse(o => { if (o.isPointLight) { o.intensity = 160; o.position.y = 16; } });
const shop = workshop(scene, 1900, 0); SETS.shop = shop.g; shop.bench.scale.setScalar(0.65);
const gasse = alley(scene, 2100, 0); SETS.gasse = gasse.g;
const tin = towerInterior(scene, 2300, 0); SETS.tin = tin.g; tin.back.material.emissiveIntensity = 0.05; tin.back.material.color.set(0x8a7a62); tin.g.traverse(o => { if (o.isPointLight) o.intensity = 380; });
cafeF.g.traverse(o => { if (o.isPointLight) o.intensity = 450; }); cafeF.neon.material.emissiveIntensity = 1.3; hof.pillow.children[0].material.emissiveIntensity = 0.2;
const OUTDOOR = ['town', 'tower', 'garden', 'cafeF'];
{ const bench = new THREE.Group(); bench.position.set(6, 0, -52.4); SETS.town.add(bench); const bw = mat(0x7a4a2a, { roughness: .6 }), bi = mat(0x1d2238, { metalness: .5 });
  for (let i = 0; i < 3; i++) box(5, 0.25, 0.5, bw, 0.08, bench, 0, 1.25, -0.7 + i * 0.6); for (let i = 0; i < 2; i++) box(5, 0.5, 0.2, bw, 0.08, bench, 0, 2.2 + i * 0.7, -1.2);
  for (const sx of [-2.2, 2.2]) { box(0.25, 1.2, 1.6, bi, 0.05, bench, sx, 0.6, -0.4); box(0.25, 2.2, 0.25, bi, 0.05, bench, sx, 2.2, -1.25); } }
for (const [x, z] of [[-12, 7], [0, 8.4], [12, 7]]) for (const s2 of [-1, 1]) { cyl(1.0, 0.9, 0.3, mat(0x8a1f3a, { roughness: .6 }), 16, cafe.g, x + s2 * 3, 1.0, z); cyl(0.15, 0.15, 1.0, mat(0x1d2238, { metalness: .5 }), 8, cafe.g, x + s2 * 3, 0.5, z); }
const cuckoo = new THREE.Group(); tower.g.add(cuckoo);
{ const body = sphere(1.0, mat(0x8a5a2a, { roughness: .6 }), cuckoo, 0, 0, 0); body.scale.set(1, 0.85, 1.3);
  sphere(0.7, mat(0x8a5a2a), cuckoo, 0, 0.75, 0.75); const beak = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 8), mat(0xf2b33d)); beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.7, 1.55); cuckoo.add(beak);
  for (const s2 of [-1, 1]) { sphere(0.16, mat(0xffffff), cuckoo, s2 * 0.32, 0.95, 1.25); sphere(0.08, mat(0x111111), cuckoo, s2 * 0.34, 0.95, 1.38); const wg = box(0.2, 0.8, 1.2, mat(0x6b4426), 0.08, cuckoo, s2 * 0.95, 0, 0); wg.rotation.z = s2 * 0.3; }
  const tl = box(0.6, 0.15, 1.0, mat(0x6b4426), 0.05, cuckoo, 0, 0.1, -1.4); }
cuckoo.visible = false;
// calendario flotando en el cielo de la plaza
const calG = new THREE.Group(); calG.position.set(0, 70, -330); scene.add(calG); const cal = calendar(calG); calG.scale.setScalar(2.2); SETS.cal = calG;
// cartel "GÄHNEN VERBOTEN 50 €" en la calle
const signG = new THREE.Group(); signG.position.set(-16, 0, -36); signG.rotation.y = 0.5; SETS.town.add(signG);
cyl(0.2, 0.2, 9, mat(0x1d2238, { metalness: .5 }), 8, signG, 0, 4.5, 0);
{
  const sp = textPlane(5.4, 3.6, 300, 200, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 18); c.fill(); c.lineWidth = 12; c.strokeStyle = '#d6202f'; c.stroke();
    c.fillStyle = '#d6202f'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.fillText('GÄHNEN', w / 2, 62); c.fillText('VERBOTEN', w / 2, 108); c.fillStyle = '#1d2238'; c.font = `700 54px ${FONT}`; c.fillText('50 €', w / 2, 168); }, 0.3);
  sp.position.set(0, 9.6, 0.2); signG.add(sp); }

// ---------- reparto ----------
const finn = makeFinn(scene), opa = makeOpa(scene), wach = makeWachter(scene);
const folk = [0, 1, 2, 3, 4, 5, 6, 7].map(i => makeTownsperson(scene, i));
const nw = [0, 1].map(i => makeNachtwaechter(scene, i));
const POOL = [finn, opa, wach, ...folk, ...nw, nurs.mother, mead.counter, hof.vendor];
const wCup = coffeeCup(wach.aR.hand, 0, -0.62, 0.45, 0.9);
// atrezo
const watch = pocketWatch(scene, 1); const hands = clockHands(scene, 1); const mbox = musicBox(scene, 1);
const flyCups = [0, 1, 2, 3].map(() => coffeeCup(scene, 0, 0, 0, 1));
const trage = stretcher(scene); const kamille = camomile(scene); const ticket = box(0.9, 1.3, 0.04, mat(0xfff6c8), 0.02, scene);
const notes = []; {
  for (let i = 0; i < 10; i++) { const n = textPlane(1.2, 1.2, 64, 64, (c) => { c.fillStyle = ['#ffd23f', '#9fe3ff', '#ff9fd0'][i % 3]; c.font = '700 54px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(i % 2 ? '♪' : '♫', 32, 34); }, 2.2); scene.add(n); notes.push(n); } }
const PROPS = [watch.g, hands.g, mbox.g, ...flyCups, trage, kamille, ticket, ...notes];
const sheep = mead.sheep;

// ---------- utilidades de plano ----------
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); }
  for (const s of sheep) s.root.visible = false;
  for (const k in SETS) SETS[k].visible = false;
  tower.hands.visible = false; tower.door.rotation.y = 0;
  grade.uniforms.sepia.value = 0; grade.uniforms.vig.value = 0.32; grade.uniforms.flash.value = 0; grade.uniforms.blurAmt.value = 0; grade.uniforms.lift.value = 0;
  wach.props.moustache.g.visible = true; wach.props.moustache.longH.rotation.z = 0.22; wach.props.moustache.shortH.rotation.z = -0.12;
  wCup.visible = true; opa.sleepMode(false);
  dayness(0); bloom.strength = 0.45;
  sky.moon.position.set(-160, 420, -1400); sky.clouds.forEach((c, i) => c.position.set(-700 + i * 160, 380 + (i % 3) * 60, -1300)); sun.position.set(0, -200, -1500);
  for (const p of garden.sleepers) { p.root.rotation.x = -Math.PI / 2; applyPose(p, {}); p.setFace({ eyes: 'closed', bags: 0.3, mouth: 'o' }); }
  garden.opa.root.rotation.x = -Math.PI / 2; applyPose(garden.opa, {}); garden.opa.setFace({ eyes: 'closed', mouth: 'smile', mouthY: 14 });
  nurs.cross.scale.setScalar(0.01); nurs.babyFace.material.map = BABY0; nurs.baby.position.y = 3.9; nurs.clock.g.rotation.z = 0; nurs.clock.hammer.rotation.z = 0;
  hof.pillow.position.set(0, 1.6, 0); hof.pillow.rotation.y = 0; room.plan.material.opacity = 0;
  cal.pages.forEach((p, i) => { p.position.set(0, 0.2, 0.62 + i * 0.01); p.rotation.set(0, 0, 0); });
  tower.minH.rotation.z = 0; tower.hourH.rotation.z = 0; cuckoo.visible = false;
  const mo = wach.props.moustache; mo.g.position.set(0, 0.42, 0.66); mo.g.rotation.set(0, 0, 0); mo.g.scale.set(1, 1, 1);
  hands.longH.rotation.z = 0.22; hands.shortH.rotation.z = -0.12; mbox.lid.rotation.x = 0; watch.lid.rotation.x = 0; gasse.lid.rotation.z = 0;
  for (const p of notes) p.visible = false; sun.scale.setScalar(520);
}
const BABY0 = babyFace(false), BABY1 = babyFace(true);
const use = (...names) => { for (const n of names) SETS[n].visible = true; };
const outdoors = () => use(...OUTDOOR);
function put(ch, x, y, z, ry = 0, s) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); if (s) ch.root.scale.setScalar(s); return ch; }
function face(ch, f, T) { const spec = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(spec.eyes)) spec.eyes = 'closed'; ch.setFace(spec); }
// keyframes de pose: [[t, pose], ...] con easeInOut
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; }
  applyPose(ch, { ...p, ...extra }); }
let CAM = { fov: 50 };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; CAM = { p, t, fov }; }
function camMove(a, b, k, ease = easeInOut) { const e = ease(clamp(k)); const L = (i) => lerp(a[i], b[i], e);
  cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, e)); }
// golpe de zoom rápido a partir de 'at' (s locales): devuelve multiplicador del fov
const punch = (lt, at, amt = 0.3, d = 0.18) => lt < at ? 1 : 1 - amt * easeOut((lt - at) / d);
const proj = (v) => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
// parábola con rebote (física simple): pos(t) desde p0 con v0 y gravedad g
function ballistic(p0, v0, t, g = 30, floor = null, rest = 0.35) { let x = p0[0] + v0[0] * t, z = p0[2] + v0[2] * t, y = p0[1] + v0[1] * t - 0.5 * g * t * t;
  if (floor != null && y < floor) { const tl = (v0[1] + Math.sqrt(v0[1] * v0[1] + 2 * g * (p0[1] - floor))) / g; const vy = -(v0[1] - g * tl) * rest, dt = t - tl; y = Math.max(floor, floor + vy * dt - 0.5 * g * dt * dt); }
  return [x, y, z]; }

// ---------- capa 2D: pop-ups y subtítulos ----------
const BADGES = [];   // por fotograma: {kind, text, x, y, s, a}
function badge(kind, text, x, y, k, a = 1) { BADGES.push({ kind, text, x, y, s: spring(k * 1.6), a }); }
function drawBadge(b) {
  if (b.s <= 0.01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s, b.s);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'minus' || b.kind === 'plus') {
    c.font = `700 58px ${FONT}`; const tw = c.measureText(b.text).width, w = tw + 150, h = 84;
    c.shadowColor = 'rgba(255,255,255,.95)'; c.shadowBlur = 34; c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-w / 2 - 7, -h / 2 - 7, w + 14, h + 14, 26); c.fill(); c.shadowBlur = 0;
    const g = c.createLinearGradient(0, -h / 2, 0, h / 2); if (b.kind === 'minus') { g.addColorStop(0, '#ff7aa0'); g.addColorStop(1, '#ff4f7f'); } else { g.addColorStop(0, '#6af0b0'); g.addColorStop(1, '#22c487'); }
    c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 20); c.fill();
    c.shadowColor = 'rgba(255,240,120,.9)'; c.shadowBlur = 22; const cg = c.createRadialGradient(-w / 2 + 34, -12, 6, -w / 2 + 44, 0, 50); cg.addColorStop(0, '#fffbb0'); cg.addColorStop(.6, '#ffe83a'); cg.addColorStop(1, '#f2b800');
    c.fillStyle = cg; c.beginPath(); c.arc(-w / 2 + 40, 0, 48, 0, 7); c.fill(); c.shadowBlur = 0; c.fillStyle = '#c88a00'; c.font = `700 46px ${FONT}`; c.fillText('€', -w / 2 + 40, 3);
    c.fillStyle = '#fff'; c.font = `700 58px ${FONT}`; c.fillText(b.text, 40, 4);
  } else if (b.kind === 'big' || b.kind === 'red') {
    c.font = `700 112px ${FONT}`; { const tw = c.measureText(b.text).width; if (tw > W * 0.86) { const k = W * 0.86 / tw; c.scale(k, k); } } c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : '#1d2238'; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 14; c.strokeText(b.text, 0, 0); c.shadowBlur = 0;
    const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); }
    c.fillStyle = g; c.fillText(b.text, 0, 0);
  } else if (b.kind === 'tag') {
    c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke();
    c.fillStyle = '#ffd23f'; c.fillText(b.text, 0, 3);
  } else if (b.kind === 'zzz') {
    c.font = `700 70px ${FONT}`; c.lineWidth = 12; c.strokeStyle = '#1d2238'; c.strokeText(b.text, 0, 0); c.fillStyle = '#bfe3ff'; c.fillText(b.text, 0, 0);
  }
  c.restore();
}
const KEY = /^(fünfzig|Euro|zwölf|Acht|elf|neun|sieben|Sieben|sechs|Sechs|neunundfünfzig|Finn|Opa|Wachter|Nacht|Sonne|Gähnen|Schnurrbart|Zeiger|immer|Schlafgarten|Kaffee|Augenringe|Taschenuhr|Spieldose|Kamille|Bengel|Kuckuckstürchen|riesig|Schlaflied|Weck-Lied|Rathausturm|Müll|tick)$/;
const CAPS = WORDS.map(w => { const txt = w[2].replace(/[„“"”.,!?:…]/g, '').replace(/_$/, ''); return { t: w[0], txt, key: KEY.test(txt) }; }).filter(w => w.txt);
function caption(T) {
  let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; }
  if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? 0.2 : f < 2 ? 1.12 : 1.0;
  const size = H * 0.046 * (cur.key ? 1.35 : 1);
  const c = octx; c.save(); c.translate(W / 2, H * 0.74); c.scale(s, s);
  c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  let tw = c.measureText(cur.txt).width; if (tw > W * 0.9) { const k = W * 0.9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.lineWidth = size * 0.24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0);
  c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore();
}
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - 0.01 && w[0] < b);

// ---------- los planos ----------
// [t0, t1, transición al siguiente, zoom ('slow' | null), staging(L), sfx [[t local, nombre, ganancia]] ]
const S = [];
const shot = (t0, t1, tr, zoom, fn, sfx = []) => S.push({ t0, t1, tr, zoom, fn, sfx });
const GX = 0, GZ = -300, B9 = garden.bed9.position, B9X = B9.x + GX, B9Z = B9.z + GZ;
const CX = 700, NX = 900, MX = 1200, HX = 1500, RX = 1700, WX = 1900, AX = 2100, TX = 2300;
const sitPose = { crouch: 1.0, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 };

// 1 — dron sobre la ciudad en noche eterna; un vecino se duerme en un banco
shot(0.00, 3.01, 'Z', null, (L) => { outdoors();
  camMove([0, 120, 60, 0, 10, -140, 55], [4.5, 5.2, -40.5, 6, 3.4, -52, 48], L.k, easeOut);
  put(folk[1], 6, 0, -52.3, 0); kp(folk[1], L.lt, [[0, { ...sitPose, headX: 0.1 }], [1.6, { ...sitPose, headX: 0.7, lean: 0.25 }], [2.2, { ...sitPose, headX: 0.9, lean: 0.4, headZ: 0.3 }]]);
  face(folk[1], { eyes: L.lt > 1.6 ? 'closed' : 'half', bags: 1, mouth: 'flat' }, L.T);
  if (L.lt > 2.0) { const zp = proj(V(7.5, 6.6 + (L.lt - 2) * 1.5, -52)); badge('zzz', 'Zzz', zp[0], zp[1], L.lt - 2.0); }
  for (let i = 2; i < 6; i++) { put(folk[i], [-8, 9, -5, 12][i - 2], 0, -80 - i * 14 + L.T * 3, 0); applyPose(folk[i], walkPose(L.T + i * .3, 0.7, 1)); }
  shadowAround(V(0, 0, -60), 90); }, [[0, 'wind', .6], [0.4, 'bell_far', .5], [1.7, 'snore', .7], [2.2, 'zzz', .6]]);
// 2 — ojeras hasta la barbilla
shot(3.01, 5.14, 'W', null, (L) => { outdoors();
  put(folk[0], 3, 0, -40, 0.2); applyPose(folk[0], idlePose(L.T)); face(folk[0], { eyes: L.lt > 1.2 && L.lt < 1.45 ? 'closed' : 'half', bags: 1, mouth: 'frown', brows: -0.5, blush: 0.4 }, 99);
  const p = [3.4, 4.8, -40]; camMove([p[0] - 1.5, p[1] + 0.2, p[2] + 9, p[0], p[1] - 0.7, p[2], 42], [p[0] - 0.6, p[1] + 0.1, p[2] + 5.8, p[0], p[1] - 0.6, p[2], 40], L.k);
  shadowAround(V(3, 0, -40), 30); }, [[0.2, 'blink', .5], [1.2, 'blink', .5], [1.6, 'sigh', .6]]);
// 3 — bostezar en la calle…
shot(5.14, 6.45, 'C', null, (L) => { outdoors();
  put(folk[2], -4, 0, -34, 0.3); kp(folk[2], L.lt, [[0, idlePose(0)], [0.5, { aLz: 2.6, aRz: 2.6, aLe: 0.6, aRe: 0.6, headX: -0.35, lean: -0.12 }], [1.3, { aLz: 2.8, aRz: 2.8, aLe: 0.4, aRe: 0.4, headX: -0.45, lean: -0.15 }]]);
  face(folk[2], { eyes: 'closed', bags: 1, mouth: L.lt > 0.3 ? 'yawn' : 'o', brows: -0.3 }, 99);
  camMove([-2, 2.2, -22, -4, 4.6, -34, 50], [-2.6, 2.4, -25, -4, 4.8, -34, 48], L.k); shadowAround(V(-4, 0, -34), 30); }, [[0.25, 'yawn_f', 1]]);
// 4 — …cuesta 50 euros: el Nachtwächter silba y da el ticket
shot(6.45, 7.81, 'S', null, (L) => { outdoors();
  put(folk[2], -4, 0, -34, 0.6); applyPose(folk[2], { ...idlePose(L.T), lean: -0.1, aLx: 0.3, aRx: 0.3 }); face(folk[2], { eyes: 'wide', bags: 1, mouth: 'o', brows: -0.6 }, L.T);
  put(nw[0], 1, 0, -31, -1.0); kp(nw[0], L.lt, [[0, { aRx: 0.3, aRe: 0.3 }], [0.3, { aRx: 1.4, aRe: 1.6, headY: -0.2 }], [0.9, { aRx: 1.2, aRe: 0.3, aRz: 0.1 }]]); face(nw[0], { eyes: 'squint', bags: 0.8, mouth: L.lt < 0.5 ? 'o' : 'frown', brows: 0.8 }, L.T);
  if (L.lt > 0.7) { ticket.visible = true; ticket.position.copy(nw[0].aR.hand.getWorldPosition(V(0, 0, 0))).add(V(0, -0.4, 0.5)); ticket.rotation.set(0.3, -1, 0.2); }
  camMove([-12, 6, -15, -1.5, 4.6, -33, 48], [-11, 6, -17, -1.5, 4.6, -33, 46], L.k); shadowAround(V(-2, 0, -33), 30);
  badge('minus', '−50 €', W * 0.5, H * 0.3, L.lt - 0.35); }, [[0.1, 'whistle', 1], [0.4, 'cash', .9], [0.75, 'paper', .7]]);
// 5 — los bebés no tienen nana
shot(7.81, 9.45, 'F', null, (L) => { use('nurs');
  put(nurs.mother, NX - 7.5, 0, -1, 0.7); kp(nurs.mother, L.lt, [[0, { aRx: 0.9, aRe: 0.6, aLx: 0.9, aLe: 0.6 }], [0.6, { aRx: 0.5, aRe: 0.3, aLx: 0.5, aLe: 0.3, headX: 0.2 }]]); face(nurs.mother, { eyes: 'half', bags: 1, mouth: 'frown', brows: -0.6 }, L.T);
  nurs.cross.scale.setScalar(spring(clamp((L.lt - 0.4) * 1.6)));
  nurs.babyFace.material.map = BABY0; nurs.mobile.rotation.y = L.T * 0.5;
  camMove([NX - 4, 8.5, 15, NX - 5, 5, -2, 54], [NX - 4, 8.2, 13.5, NX - 5, 5, -2, 52], L.k); shadowAround(V(NX, 0, 0), 25); }, [[0, 'mobile', .5], [0.45, 'stamp', .8]]);
// 6 — reciben un "Weck-Lied": el despertador gigante
shot(9.45, 10.86, 'W', null, (L) => { use('nurs');
  const ring = L.lt > 0.25; nurs.clock.g.rotation.z = ring ? Math.sin(L.T * 80) * 0.08 : 0; nurs.clock.hammer.rotation.z = ring ? Math.sin(L.T * 120) * 0.6 : 0;
  nurs.babyFace.material.map = L.lt > 0.45 ? BABY1 : BABY0; nurs.baby.position.y = 3.9 + (L.lt > 0.45 ? Math.max(0, Math.sin((L.lt - 0.45) * 9)) * 0.5 * Math.exp(-(L.lt - 0.45) * 3) : 0);
  camMove([NX + 2, 13, 7.5, NX + 1.6, 4, -3, 54], [NX + 2, 12.5, 6.5, NX + 1.6, 4, -3, 52], L.k); shadowAround(V(NX, 0, 0), 25); }, [[0.25, 'alarm', 1], [0.5, 'baby_gasp', .6]]);
// 7 — las ovejas van disfrazadas
shot(10.86, 12.20, 'Z', null, (L) => { use('mead');
  sheep.forEach((s, i) => { s.root.visible = true; s.root.position.set(MX - 8 + i * 8, 0, -4 + L.T * 0.8 - i); s.root.rotation.y = 0.15;
    const w = Math.sin((L.T * 2.2 + i * .4) * Math.PI * 2); s.legs[0].rotation.x = w * 0.5; s.legs[1].rotation.x = -w * 0.5; s.arms[0].rotation.x = -w * 0.4; s.arms[1].rotation.x = w * 0.4; s.body.position.y = Math.abs(w) * 0.15; });
  camMove([MX - 2, 4, 22, MX, 4, -4, 48], [MX - 1, 3.6, 18, MX, 4, -3, 46], L.k); shadowAround(V(MX, 0, 0), 40); }, [[0.1, 'hooves', .7], [0.6, 'baa', .6]]);
// 8 — …para que nadie las cuente
shot(12.20, 13.61, 'R', null, (L) => { use('mead');
  const s = sheep[1]; s.root.visible = true; s.root.position.set(MX + 2, 0, 0); s.root.rotation.y = -0.3 + Math.sin(L.T * 3) * 0.05; s.head.rotation.y = Math.sin(L.T * 4) * 0.3;
  put(mead.counter, MX - 3.5, 0, 2.5, 0.9); kp(mead.counter, L.lt, [[0, { aRx: 1.5, aRe: 0.1, headY: 0.2 }], [1.4, { aRx: 1.5, aRe: 0.1, headY: 0.4, headZ: 0.15 }]]); face(mead.counter, { eyes: 'squint', bags: 1, mouth: 'o', brows: 0.4, look: [0.6, 0] }, L.T);
  camMove([MX - 1, 6, 17, MX - 0.5, 4.5, 0.5, 48], [MX - 0.8, 5.8, 15.5, MX - 0.5, 4.5, 0.5, 46], L.k); shadowAround(V(MX, 0, 0), 30);
  badge('tag', 'Eins… zwei…?', W * 0.36, H * 0.24, L.lt - 0.2); }, [[0.2, 'count', .6], [0.8, 'whistle_inno', .7]]);
// 9 — almohadas solo en el patio trasero
shot(13.61, 15.36, 'I', null, (L) => { use('hof');
  put(hof.vendor, HX, 0, -7.5, 0); kp(hof.vendor, L.lt, [[0, { headY: -0.6 }], [0.7, { headY: 0.6 }], [1.4, { headY: -0.2, lean: 0.15 }]]); face(hof.vendor, { eyes: 'squint', bags: 1, mouth: 'flat', brows: 0.4, look: [L.lt < 0.7 ? -0.7 : 0.7, 0] }, L.T);
  hof.cat.rotation.y = Math.sin(L.T) * 0.2;
  camMove([HX - 2.5, 7, 7, HX, 5.4, -6, 46], [HX - 2, 6.8, 5.6, HX, 5.4, -6, 44], L.k); shadowAround(V(HX, 0, -5), 30); }, [[0.1, 'steps', .5], [0.9, 'meow', .6]]);
// 10 — debajo del mostrador
shot(15.36, 16.39, 'W', null, (L) => { use('hof');
  put(hof.vendor, HX, 0, -7.5, 0); applyPose(hof.vendor, { crouch: 0.3, lean: 0.4, aRx: 1.2, aRe: 0.5, aLx: 1.2, aLe: 0.5 }); face(hof.vendor, { eyes: 'squint', bags: 1, mouth: 'smirk', brows: 0.3 }, L.T);
  const k = spring(clamp((L.lt - 0.15) * 1.8)); hof.pillow.position.set(0, 1.6 + k * 3.4, k * 1.6); hof.pillow.rotation.y = (1 - k) * 0.6;
  camMove([HX + 3, 6, 7, HX, 4.8, -3, 44], [HX + 2.5, 5.8, 6, HX, 5, -3, 42], L.k); shadowAround(V(HX, 0, -4), 20);
  badge('tag', 'PSST!', W * 0.72, H * 0.22, L.lt - 0.1); }, [[0.15, 'cloth', .7], [0.3, 'pop', .8]]);
// 11 — el Rathausturm no tiene agujas (ZOOM LENTO)
shot(16.39, 18.38, 'Z', 'slow', (L) => { outdoors();
  camMove([0, 14, -330, 0, 86, -411, 46], [0, 16, -345, 0, 87, -411, 40], L.k, (k) => k); shadowAround(V(0, 0, -400), 80); }, [[0.2, 'tick_hollow', .6]]);
// 12 — doce años de noche: el calendario arranca hojas
shot(18.38, 20.57, 'F', null, (L) => { outdoors(); use('cal');
  cal.pages.forEach((p, i) => { const tt = L.lt - i * 0.28; if (tt > 0) { p.position.set(tt * 6, 0.2 + tt * 5 - tt * tt * 4, 0.62 + i * 0.01 + tt * 3); p.rotation.set(-tt * 2, tt * 1.5, tt * 3); } else { p.position.set(0, 0.2, 0.62 + i * 0.01); p.rotation.set(0, 0, 0); } });
  sky.moon.position.set(60, 520, -1500);
  camMove([0, 50, -270, 0, 70, -330, 50], [0, 52, -282, 0, 70, -330, 46], L.k); shadowAround(V(0, 0, -300), 60);
  badge('big', '12 JAHRE', W / 2, H * 0.2, L.lt - 0.5); }, [[0.0, 'pages', .8], [0.5, 'owl', .6], [0.55, 'impact_soft', .7]]);
// 13 — café solo en Herr Wachter (fachada + cola)
shot(20.57, 22.38, 'S', null, (L) => { outdoors();
  for (let i = 0; i < 5; i++) { put(folk[i], 16, 0, -60 - i * 4.2, Math.PI); applyPose(folk[i], { ...idlePose(L.T + i), headX: 0.35, lean: 0.2 }); face(folk[i], { eyes: 'half', bags: 1, mouth: 'flat' }, L.T + i); }
  camMove([0, 6, -46, 16, 8, -72, 52], [1, 6.2, -49, 16, 8, -72, 50], L.k); shadowAround(V(16, 0, -66), 40); }, [[0, 'neon_buzz', .6], [0.3, 'murmur', .5]]);
// 14 — ocho euros la taza
shot(22.38, 23.50, 'C', null, (L) => { outdoors();
  camMove([10.2, 5.5, -55.5, 15, 4.6, -62, 44], [10.8, 5.2, -56.5, 15, 4.6, -62, 36 * punch(L.lt, 0.15, 0.1) + 4], L.k);
  badge('minus', '−8 €', W / 2, H * 0.2, L.lt - 0.2); shadowAround(V(15, 0, -62), 20); }, [[0.15, 'impact', .8], [0.2, 'coins', .9]]);
// 15 — ¿y quien se duerme igualmente?
shot(23.50, 24.91, 'W', null, (L) => { use('gasse');
  put(folk[3], AX - 2, 0, 2, 0.3); kp(folk[3], L.lt, [[0, idlePose(0)], [0.6, { headX: 0.6, lean: 0.15 }], [1.0, { headX: 0.2, lean: 0 }], [1.4, { headX: 0.8, lean: 0.3, aLz: 0.3 }]]);
  face(folk[3], { eyes: L.lt > 0.5 ? 'closed' : 'half', bags: 1, mouth: 'o' }, 99); folk[3].root.rotation.z = Math.sin(L.T * 3) * 0.05;
  camMove([AX - 3, 6, 14, AX - 2, 5.5, 2, 44], [AX - 2.5, 6, 11.5, AX - 2, 5.5, 2, 42], L.k); shadowAround(V(AX, 0, 0), 25);
  if (L.lt > 0.6) badge('zzz', 'Zzz', W * 0.66, H * 0.26, L.lt - 0.6); }, [[0.5, 'snore', .8]]);
// 16 — al Schlafgarten (camilla de los Nachtwächter)
shot(24.91, 27.15, 'Z', null, (L) => { outdoors();
  const z = -282 - L.lt * 4; trage.visible = true; trage.position.set(-2, 3.4, z); trage.rotation.y = 0;
  put(nw[0], -2, 0, z - 4.6, 0); applyPose(nw[0], { ...walkPose(L.T, 0.9), aLx: 0.8, aLe: 0.4, aRx: 0.8, aRe: 0.4 });
  put(nw[1], -2, 0, z + 4.6, 0); applyPose(nw[1], { ...walkPose(L.T + .5, 0.9), aLx: 0.8, aLe: 0.4, aRx: 0.8, aRe: 0.4 });
  put(folk[3], -2, 3.7, z + 2.5, 0); folk[3].root.rotation.x = -Math.PI / 2; applyPose(folk[3], {}); face(folk[3], { eyes: 'closed', bags: 1, mouth: 'o' }, 99);
  camMove([18, 16, -262, -2, 3, -296, 50], [16, 13, -266, -2, 3, -298, 48], L.k); shadowAround(V(0, 0, -295), 50); }, [[0, 'wheels', .5], [0.3, 'steps_heavy', .6], [1.2, 'bed_creak', .5]]);
// 17 — für immer (ZOOM LENTO a un durmiente)
shot(27.15, 27.90, 'F', 'slow', (L) => { outdoors();
  const sp = garden.sleepers[3].root.getWorldPosition(V(0, 0, 0)); const hz = sp.z - 3.6;
  camMove([sp.x + 1, 5.5, hz + 4, sp.x, 2.2, hz, 44], [sp.x + 0.5, 4.2, hz + 2.6, sp.x, 2.2, hz, 38], L.k, easeIn); shadowAround(V(sp.x, 0, sp.z), 20); }, []);
// 18 — Finn nunca ha visto el sol
shot(27.90, 30.45, 'W', null, (L) => { use('room');
  put(finn, RX - 0.5, 0, -9.6, Math.PI); kp(finn, L.lt, [[0, { aLx: 2.2, aLe: 0.6, aRx: 2.2, aRe: 0.6, lean: 0.1 }], [2.5, { aLx: 2.3, aLe: 0.8, aRx: 2.1, aRe: 0.5, lean: 0.15, headZ: 0.1 }]]);
  camMove([RX + 3, 7.5, 2.5, RX - 0.3, 6.2, -10, 50], [RX + 2.6, 7.4, 1.2, RX - 0.3, 6.4, -10, 48], L.k); shadowAround(V(RX, 0, -6), 25); }, [[0.1, 'wood_creak', .4], [1.2, 'sigh_kid', .7]]);
// 19 — su abuelo, el relojero (recuerdo cálido, sepia)
shot(30.45, 32.51, 'I', null, (L) => { use('shop'); grade.uniforms.sepia.value = 0.45;
  put(opa, WX, 0, -6.2, 0); kp(opa, L.lt, [[0, { aRx: 1.2, aRe: 1.2, aLx: 1.0, aLe: 1.3, headX: 0.25 }], [1.3, { aRx: 1.25, aRe: 1.3, aLx: 1.0, aLe: 1.3, headX: 0.1, headY: 0.4 }]]);
  face(opa, { eyes: L.lt > 1.3 && L.lt < 1.6 ? 'happy' : 'open', mouth: 'smile', bags: 0.2, look: [L.lt > 1.2 ? 0.6 : 0, 0.5] }, L.T);
  shop.clocks.forEach((c, i) => { c.pend.rotation.z = Math.sin(L.T * 3 + i) * 0.3; });
  camMove([WX + 4, 7.5, 6, WX, 5, -6, 46], [WX + 3.2, 7.2, 4.6, WX, 5.2, -6, 44], L.k); shadowAround(V(WX, 0, -5), 25); }, [[0, 'ticks', .7], [1.0, 'cuckoo', .6]]);
// 20 — cama número nueve
shot(32.51, 34.38, 'S', null, (L) => { outdoors();
  put(finn, B9X + 3.0, 0, B9Z - 1.2, -1.5); applyPose(finn, { ...idlePose(L.T), lean: 0.22, headX: 0.35, aRx: 0.9, aRe: 0.5, aLx: 0.2, aLe: 1.6, aLz: 0.2 }); face(finn, { eyes: 'open', mouth: 'frown', brows: -0.7, look: [0.2, 0.6] }, L.T);
  camMove([B9X - 7, 11, B9Z + 5, B9X + 0.9, 1.6, B9Z - 1.6, 44], [B9X - 6, 9, B9Z + 3.5, B9X + 0.9, 1.6, B9Z - 1.6, 42], L.k); shadowAround(V(B9X, 0, B9Z), 30);
  badge('tag', 'Bett Nr. 9', W / 2, H * 0.18, L.lt - 0.6); }, [[0, 'crickets', .5], [0.6, 'ding_soft', .6]]);
// 21 — el sol solo sale si la torre da las siete (visión)
shot(34.38, 37.08, 'Z', null, (L) => { outdoors(); const d = clamp((L.lt - 1.2) / 1.2); dayness(d * 0.7); sun.position.set(0, -60 + d * 260, -1400);
  camMove([0, 10, -320, 0, 70, -420, 50], [0, 12, -330, 0, 72, -420, 48], L.k); shadowAround(V(0, 0, -400), 80);
  if (L.lt > 0.9) badge('big', '7', W / 2, H * 0.2, L.lt - 0.9); grade.uniforms.lift.value = d * 0.04; }, [[0.9, 'bells7', .8], [1.4, 'choir', .5]]);
// 22 — el reloj de bolsillo del abuelo se paró
shot(37.08, 39.62, 'C', null, (L) => { use('room');
  watch.g.visible = true; watch.g.position.set(RX, 7, -3); watch.g.rotation.set(-0.5, 0, 0);
  const op = spring(clamp((L.lt - 0.5) * 1.5)); watch.lid.rotation.x = -op * 2.0;
  put(finn, RX, 0, 0.6, Math.PI * 0.98); applyPose(finn, { aLx: 1.4, aLe: 0.8, aRx: 1.4, aRe: 0.8, headX: 0.4 }); finn.root.position.y = 0;
  camMove([RX + 0.5, 9.5, -0.2, RX, 7, -3, 40], [RX + 0.3, 9, -0.8, RX, 7, -3, 38], L.k); shadowAround(V(RX, 0, -2), 20); }, [[0.5, 'watch_click', 1], [1.0, 'silence_tick', .4]]);
// 23 — a las 6:59 (ZOOM LENTO a la esfera)
shot(39.62, 41.27, 'W', 'slow', (L) => { use('room');
  watch.g.visible = true; watch.g.position.set(RX, 7, -3); watch.g.rotation.set(-0.5, 0, 0); watch.lid.rotation.x = -2.0;
  camMove([RX, 9, -0.8, RX, 7, -3, 30], [RX, 8.3, -1.9, RX, 7, -3, 26], L.k, easeIn); shadowAround(V(RX, 0, -2), 15);
  badge('big', '6:59', W / 2, H * 0.17, L.lt - 0.2); }, [[0.1, 'metal_hit', .7]]);
// 24 — un minuto antes del amanecer
shot(41.27, 43.11, 'R', null, (L) => { outdoors();
  put(finn, 4, 0, -260, Math.PI); applyPose(finn, { ...idlePose(L.T), aLx: 1.2, aLe: 1.5, aRx: 1.2, aRe: 1.5, headX: -0.2 });
  const hor = 0.15 * clamp(L.k * 1.5); dayness(hor);
  camMove([6, 3, -248, 2, 30, -420, 52], [5.5, 3.2, -251, 2, 32, -420, 50], L.k); shadowAround(V(4, 0, -260), 30); }, [[0, 'wind', .5], [0.4, 'piano_note', .6]]);
// 25 — Herr Wachter era el único…
shot(43.11, 44.60, 'S', null, (L) => { use('cafe');
  const k = backOut(clamp(L.lt / 0.6)); put(wach, CX + lerp(-6, -1, k), 0, -8.6, lerp(0.8, 0, k)); applyPose(wach, { ...idlePose(L.T), aRx: 1.25, aRe: 1.35, aLz: 0.1 });
  face(wach, { eyes: 'wide', brows: 0.55, mouth: 'grin', look: [0, 0] }, L.T);
  camMove([CX - 2.5, 7.2, 6.5, CX - 0.5, 5.6, -8, 42], [CX - 2, 7, 5, CX - 0.6, 5.8, -8, 40], L.k); shadowAround(V(CX, 0, -6), 25); }, [[0, 'door_bell', .7], [0.1, 'steam', .6], [0.3, 'whoosh_soft', .6]]);
// 26 — …sin ojeras
shot(44.60, 45.99, 'C', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { ...idlePose(L.T), aRx: 1.25, aRe: 1.35, headZ: 0.05 });
  face(wach, { eyes: (L.lt % 0.3) < 0.05 ? 'closed' : 'wide', brows: 0.3, mouth: 'smirk', bags: 0 }, 99);
  const hp = wach.head.getWorldPosition(V(0, 0, 0)); camMove([hp.x - 0.4, hp.y + 0.9, hp.z + 4.2, hp.x, hp.y + 0.8, hp.z, 34], [hp.x - 0.2, hp.y + 0.85, hp.z + 3.4, hp.x, hp.y + 0.8, hp.z, 32 * punch(L.lt, 0.05, 0.15)], L.k);
  shadowAround(V(CX, 0, -8), 15); }, [[0.05, 'impact', .7], [0.2, 'sparkle', .7]]);
// 27 — bebía café todo el día (cuatro tazas)
shot(45.99, 47.61, 'W', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); const ph = (L.lt * 2.6) % 1, n = Math.floor(L.lt * 2.6);
  applyPose(wach, { ...idlePose(L.T), aRx: lerp(1.25, 2.5, Math.sin(ph * Math.PI)), aRe: lerp(1.35, 2.2, Math.sin(ph * Math.PI)), headX: -Math.sin(ph * Math.PI) * 0.5 });
  face(wach, { eyes: 'wide', brows: 0.4, mouth: ph > 0.3 && ph < 0.7 ? 'o' : 'grin' }, L.T);
  camMove([CX + 3, 6.8, 5, CX - 1, 6, -8, 42], [CX + 2.5, 6.6, 4, CX - 1, 6, -8, 40], L.k); shadowAround(V(CX, 0, -6), 20);
  badge('tag', 'TASSE ×' + Math.min(4, n + 1), W / 2, H * 0.18, L.lt); }, [[0.05, 'sip', .7], [0.43, 'sip', .7], [0.8, 'sip', .7], [1.2, 'sip', .7], [0.3, 'porcelain', .5], [1.0, 'porcelain', .5]]);
// 28 — bigote torcido (ZOOM LENTO)
shot(47.61, 49.66, 'Z', 'slow', (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { ...idlePose(L.T), aRx: 1.25, aRe: 1.35 }); face(wach, { eyes: 'wide', brows: 0.6, mouth: 'smirk' }, L.T);
  wach.props.moustache.longH.rotation.z = 0.22 + Math.sin(L.lt * 3) * 0.05;
  const mp = wach.props.moustache.g.getWorldPosition(V(0, 0, 0)); camMove([mp.x + 0.6, mp.y + 0.2, mp.z + 4, mp.x, mp.y, mp.z, 30], [mp.x + 0.3, mp.y + 0.1, mp.z + 2.4, mp.x, mp.y, mp.z, 24], L.k, easeIn);
  shadowAround(V(CX, 0, -8), 15); }, [[0.2, 'boing_metal', .5]]);
// 29 — „Kaffee, Kleiner?"
shot(49.66, 50.64, 'S', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { lean: 0.35, aRx: 1.5, aRe: 0.6, headX: 0.2, headY: -0.2 }); const m = lip(L.T, spoken(49.66, 52.55));
  face(wach, { eyes: 'wide', brows: 0.7, mouth: m || 'grin', look: [-0.5, 0.4] }, L.T);
  put(finn, CX - 4, 0, -2, 2.6); applyPose(finn, idlePose(L.T)); face(finn, { eyes: 'open', mouth: 'flat', brows: 0.3 }, L.T);
  camMove([CX - 6.5, 7.5, 4, CX - 1, 6, -8, 44], [CX - 6, 7.2, 3.2, CX - 1, 6, -8, 42], L.k); shadowAround(V(CX, 0, -6), 20); }, [[0.1, 'cup_marble', .7]]);
// 30 — „…o quieres dormir como tu abuelo?" (contraplano: Finn con el ceño)
shot(50.64, 52.55, 'C', null, (L) => { use('cafe');
  put(finn, CX - 3, 0, -2.5, 2.8); applyPose(finn, { ...idlePose(L.T), aLx: 0.3, aLe: 0.4, aRx: 0.3, aRe: 0.4 }); face(finn, { eyes: 'open', mouth: 'frown', brows: 0.8, look: [0.3, -0.3] }, L.T);
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { lean: 0.35, aRx: 1.5, aRe: 0.6, headX: 0.2 }); face(wach, { eyes: 'wide', brows: 0.7, mouth: lip(L.T, spoken(49.66, 52.55)) || 'smirk' }, L.T);
  const hp = finn.head.getWorldPosition(V(0, 0, 0)); camMove([hp.x + 0.8, hp.y + 1.2, hp.z - 5.5, hp.x, hp.y + 0.3, hp.z, 40], [hp.x + 0.6, hp.y + 1.0, hp.z - 4.5, hp.x, hp.y + 0.3, hp.z, 38], L.k);
  shadowAround(V(CX, 0, -5), 20); }, [[0.3, 'growl', .5], [1.0, 'fist', .6]]);
// 31 — miró el reloj del abuelo
shot(52.55, 53.86, 'W', null, (L) => { use('cafe');
  put(finn, CX - 3, 0, -3, 2.9); applyPose(finn, { aRx: 1.3, aRe: 0.6 }); face(finn, { eyes: 'open', mouth: 'flat', brows: 0.5 }, L.T);
  watch.g.visible = true; watch.g.position.copy(finn.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(0, -0.3, 0.3)); watch.g.scale.setScalar(0.45); watch.lid.rotation.x = -2;
  put(wach, CX - 1, 0, -8.6, 0.25); applyPose(wach, { lean: 0.2, headX: 0.25 }); face(wach, { eyes: L.lt > 0.6 ? 'wide' : 'open', brows: L.lt > 0.6 ? -0.4 : 0.5, mouth: 'flat', look: [-0.3, 0.8] }, L.T);
  wach.props.moustache.longH.rotation.z = 0.22 + (L.lt > 0.6 ? Math.sin(L.T * 60) * 0.06 : 0);
  camMove([CX + 2.6, 6.2, -2.4, CX - 1.1, 5.2, -8.6, 44], [CX + 2.2, 6.2, -3.2, CX - 1.1, 5.2, -8.6, 42], L.k); shadowAround(V(CX, 0, -5), 20); }, [[0.6, 'tick', .8]]);
// 32 — y lo tiró a la basura (parábola con giro y rebote)
shot(53.86, 54.96, 'F', null, (L) => { use('gasse');
  const p = ballistic([AX - 6, 9, 6], [7.4, 6, -12], L.lt * 0.9, 30); watch.g.visible = true; watch.g.scale.setScalar(0.5);
  const into = L.lt > 0.82; watch.g.position.set(...(into ? [AX + 1.5, 4.0 - (L.lt - 0.82) * 6, -6] : p)); watch.g.rotation.set(L.lt * 14, L.lt * 9, 0);
  gasse.lid.rotation.z = into ? Math.sin((L.lt - 0.82) * 30) * 0.25 * Math.exp(-(L.lt - 0.82) * 6) : 0;
  camMove([AX - 3, 6, 10, AX + 0.5, 4, -5, 48], [AX - 2.5, 5.6, 9, AX + 1, 3.8, -6, 44], L.k); shadowAround(V(AX, 0, -4), 20); }, [[0.0, 'throw', .8], [0.82, 'trash_hit', 1]]);
// 33 — Finn lo rescata del cubo
shot(54.96, 56.30, 'Z', null, (L) => { use('gasse');
  put(finn, AX + 1.5, 0, -3.1, Math.PI); kp(finn, L.lt, [[0, { lean: 1.1, aLx: 2.4, aRx: 2.4, aLe: 0.2, aRe: 0.2, headX: 0.4 }], [0.9, { lean: 0.6, aLx: 2.0, aRx: 2.6, aLe: 0.3, aRe: 0.8 }], [1.3, { lean: 0.0, aLx: 0.3, aRx: 2.8, aRe: 0.3 }]]);
  face(finn, { eyes: 'open', mouth: L.lt > 1.0 ? 'grin' : 'flat', brows: 0.2 }, L.T);
  if (L.lt > 1.0) { watch.g.visible = true; watch.g.scale.setScalar(0.45); watch.g.position.copy(finn.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(0, -0.6, 0)); }
  gasse.lid.rotation.z = 1.4;
  camMove([AX - 4, 5.5, 6, AX + 1.2, 4, -5, 46], [AX - 3.5, 5.2, 5, AX + 1.2, 4, -5, 44], L.k); shadowAround(V(AX, 0, -4), 20); }, [[0.1, 'rummage', .8], [1.0, 'ding_soft', .6]]);
// 34 — Herr Wachter se ríe
shot(56.30, 57.63, 'C', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); const sh = Math.sin(L.T * 22) * 0.06; applyPose(wach, { lean: -0.2 + sh, headX: -0.4 + sh, aRx: 1.25, aRe: 1.35, aLx: 0.6, aLe: 1.4, aLz: 0.3 });
  face(wach, { eyes: 'happy', brows: 0.2, mouth: 'shout' }, 99);
  const hp34 = wach.head.getWorldPosition(V(0, 0, 0)); camMove([hp34.x - 1, hp34.y - 0.6, hp34.z + 6, hp34.x, hp34.y + 0.2, hp34.z, 42], [hp34.x - 0.8, hp34.y - 0.5, hp34.z + 5, hp34.x, hp34.y + 0.2, hp34.z, 40 * punch(L.lt, 0.05, 0.12)], L.k); shadowAround(V(CX, 0, -6), 20); }, [[0.05, 'impact', .6], [0.1, 'laugh_deep', 1]]);
// 35 — el bigote se movió
shot(57.63, 58.88, 'W', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { ...idlePose(L.T), aRx: 1.25, aRe: 1.35 }); face(wach, { eyes: 'wide', brows: 0.6, mouth: 'smirk' }, L.T);
  const j = [0.3, 0.75].some(t => L.lt > t && L.lt < t + 0.12); wach.props.moustache.g.position.y = 0.42 + (j ? 0.08 : 0); wach.props.moustache.longH.rotation.z = 0.22 + (j ? 0.15 : 0);
  const mp = wach.props.moustache.g.getWorldPosition(V(0, 0, 0)); camMove([mp.x - 1.2, mp.y + 0.3, mp.z + 2.6, mp.x, mp.y, mp.z, 30], [mp.x - 1, mp.y + 0.25, mp.z + 2.2, mp.x, mp.y, mp.z, 28], L.k);
  shadowAround(V(CX, 0, -8), 15); }, [[0.3, 'spring', .8], [0.75, 'spring', .8]]);
// 36 — tick, tick: un lado largo
shot(58.88, 60.28, 'C', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { aRx: 1.25, aRe: 1.35 }); face(wach, { eyes: 'wide', brows: 0.6, mouth: 'smirk' }, L.T);
  wach.props.moustache.longH.rotation.z = L.lt < 0.12 ? 0.32 : L.lt < 0.24 ? 0.22 : L.lt < 0.36 ? 0.32 : 0.22;
  const mp = wach.props.moustache.g.getWorldPosition(V(0, 0, 0)); camMove([mp.x + 1.2, mp.y + 0.4, mp.z + 3.6, mp.x + 0.3, mp.y + 0.2, mp.z, 30], [mp.x + 1.0, mp.y + 0.35, mp.z + 3.2, mp.x + 0.3, mp.y + 0.2, mp.z, 28], L.k);
  badge('tag', 'LANG', W * 0.68, H * 0.36, L.lt - 0.6); shadowAround(V(CX, 0, -8), 15); }, [[0.0, 'tick', 1], [0.24, 'tick', 1], [0.6, 'pop', .6]]);
// 37 — …el otro corto, como en un reloj (ZOOM LENTO + esfera detrás)
shot(60.28, 62.25, 'F', 'slow', (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { aRx: 1.25, aRe: 1.35 }); face(wach, { eyes: 'wide', brows: 0.6, mouth: 'smirk' }, L.T);
  const mp = wach.props.moustache.g.getWorldPosition(V(0, 0, 0)); camMove([mp.x - 0.4, mp.y + 0.1, mp.z + 3, mp.x - 0.1, mp.y, mp.z, 30], [mp.x - 0.2, mp.y + 0.05, mp.z + 2, mp.x, mp.y, mp.z, 24], L.k, easeIn);
  badge('tag', 'KURZ', W * 0.32, H * 0.36, L.lt - 0.1); if (L.lt > 0.9) badge('big', 'WIE EINE UHR', W / 2, H * 0.11, L.lt - 0.9); shadowAround(V(CX, 0, -8), 15); }, [[0.1, 'pop', .6], [0.9, 'ding_reveal', 1]]);
// 38 — „Opa, ich bring dir den Tag zurück."
shot(62.25, 64.26, 'W', null, (L) => { outdoors();
  put(finn, B9X + 2.6, 0, B9Z - 2.2, -1.6); applyPose(finn, { ...idlePose(L.T), lean: 0.15, aRx: 1.0, aRe: 0.4, headY: L.lt > 1.2 ? 0.6 : 0, headX: L.lt > 1.2 ? -0.2 : 0.2 });
  face(finn, { eyes: 'open', mouth: lip(L.T, spoken(62.25, 64.26)) || 'flat', brows: 0.4, look: [L.lt > 1.2 ? 0.7 : 0, -0.2] }, L.T);
  camMove([B9X - 2.5, 5.5, B9Z - 0.5, B9X + 2.6, 3.9, B9Z - 2.2, 44], [B9X - 1.8, 5.3, B9Z - 0.9, B9X + 2.6, 4.0, B9Z - 2.2, 42], L.k); shadowAround(V(B9X, 0, B9Z), 25); }, [[0, 'heartbeat', .7], [0.8, 'strings', .6]]);
// 39 — de noche Finn traza un plan
shot(64.26, 66.43, 'S', null, (L) => { use('room');
  put(finn, RX - 12.5, 0, -0.5, -Math.PI / 2); const s = Math.sin(L.T * 9); applyPose(finn, { aRx: 2.0 + s * 0.15, aRe: 0.6, aRz: 0.2 + s * 0.1, headX: -0.1 }); face(finn, { eyes: 'squint', mouth: 'flat', brows: 0.6, look: [0, -0.3] }, L.T);
  room.plan.material.opacity = clamp(L.lt * 1.5);
  camMove([RX - 3, 6.5, 8, RX - 13, 5.5, -1.5, 54], [RX - 3.6, 6.6, 6.8, RX - 13, 5.8, -1.5, 52], L.k); shadowAround(V(RX - 10, 0, -2), 20); }, [[0, 'pencil', .8], [1.0, 'pencil', .7]]);
// 40 — arrancarle el bigote a Herr Wachter
shot(66.43, 68.79, 'I', null, (L) => { use('room'); room.plan.material.opacity = 1;
  camMove([RX - 10, 12, -2, RX - 16.6, 12, -2, 42], [RX - 11.5, 12, -2, RX - 16.6, 12, -2, 40 * punch(L.lt, 1.1, 0.12)], L.k); shadowAround(V(RX - 14, 0, -2), 15);
  badge('red', 'AB!', W * 0.5, H * 0.2, L.lt - 1.1); }, [[1.1, 'slam', 1]]);
// 41 — su arma: la caja de música del abuelo
shot(68.79, 70.76, 'W', null, (L) => { use('room');
  mbox.g.visible = true; mbox.g.position.set(RX - 10, 5.75, -9); const k = spring(clamp(L.lt * 1.4)); mbox.g.scale.setScalar(Math.max(0.01, k * 0.6)); mbox.g.rotation.y = (1 - k) * 2 + Math.sin(L.T) * 0.1;
  camMove([RX - 7, 9.5, -2.5, RX - 10, 6.4, -9, 40], [RX - 7.4, 9, -3.6, RX - 10, 6.4, -9, 36], L.k); shadowAround(V(RX - 10, 0, -9), 15); grade.uniforms.lift.value = 0.02; }, [[0.05, 'whoosh_up', .7], [0.3, 'musicbox2', .9], [0.6, 'sparkle', .6]]);
// 42 — la última nana de la ciudad (la guarda en la camisa)
shot(70.76, 72.62, 'S', null, (L) => { use('room');
  put(finn, RX - 7, 0, -3, 0.6); kp(finn, L.lt, [[0, { aLx: 1.2, aLe: 1.2, aRx: 1.2, aRe: 1.2 }], [1.2, { aLx: 0.6, aLe: 1.8, aRx: 0.6, aRe: 1.8, headX: 0.25 }]]); face(finn, { eyes: 'open', mouth: 'smirk', brows: 0.5 }, L.T);
  mbox.g.visible = L.lt < 1.0; mbox.g.position.copy(finn.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(-0.6, 0, 0.6)); mbox.g.scale.setScalar(0.5);
  const hp = finn.head.getWorldPosition(V(0, 0, 0)); camMove([hp.x + 3.6, hp.y + 0.2, hp.z + 7, hp.x, hp.y - 1.0, hp.z, 44], [hp.x + 3, hp.y + 0.2, hp.z + 5.6, hp.x, hp.y - 0.9, hp.z, 42], L.k); shadowAround(V(RX - 7, 0, -3), 15); }, [[1.0, 'zip', .8]]);
// 43 — en el café lleno Finn la abre
shot(72.62, 74.85, 'Z', null, (L) => { use('cafe');
  [[-12, 7], [0, 8.4], [12, 7]].forEach(([x, z], j) => { for (let i = 0; i < 2; i++) { const f = folk[j * 2 + i]; put(f, CX + x + (i ? 3 : -3), 0, z, i ? -1.4 : 1.4); applyPose(f, { ...sitPose, aLx: 1.0, aRx: 1.0, aLe: 0.6, aRe: 0.6, headX: 0.3 }); face(f, { eyes: 'half', bags: 1, mouth: 'flat', look: [0, 0] }, L.T + j); } });
  put(finn, CX - 2, 0, 2, Math.PI); applyPose(finn, { aLx: 1.3, aLe: 0.6, aRx: 1.3, aRe: 0.6, headX: 0.3 }); face(finn, { eyes: 'open', mouth: 'smirk', brows: 0.6 }, L.T);
  mbox.g.visible = true; mbox.g.scale.setScalar(0.55); mbox.g.position.copy(finn.aL.hand.getWorldPosition(V(0, 0, 0))).lerp(finn.aR.hand.getWorldPosition(V(0, 0, 0)), 0.5).add(V(0, -0.2, -0.4)); mbox.g.rotation.y = Math.PI;
  mbox.lid.rotation.x = -spring(clamp((L.lt - 0.9) * 1.6)) * 1.9;
  notes.forEach((n, i) => { const tt = L.lt - 1.0 - i * 0.12; n.visible = tt > 0; if (tt > 0) { n.position.copy(mbox.g.position).add(V(Math.sin(i * 2.3 + tt * 2) * tt * 2, tt * 3, -tt * 1.5)); n.lookAt(camera.position); } });
  camMove([CX - 1, 6.5, 13, CX - 2, 4.5, 0, 46], [CX - 1.2, 6, 11, CX - 2, 4.5, 0, 44], L.k); shadowAround(V(CX, 0, 4), 25); }, [[0, 'door_bell', .7], [0.2, 'murmur', .6], [0.9, 'lid_click', 1]]);
// 44 — y la canción prohibida…
shot(74.85, 76.30, 'S', null, (L) => { use('cafe');
  [[-12, 7], [0, 8.4], [12, 7]].forEach(([x, z], j) => { for (let i = 0; i < 2; i++) { const f = folk[j * 2 + i]; put(f, CX + x + (i ? 3 : -3), 0, z, i ? -1.4 : 1.4); applyPose(f, { ...sitPose, aLx: 1.0, aRx: 1.0, aLe: 0.6, aRe: 0.6, headY: Math.sin(L.T + j) * 0.5 }); face(f, { eyes: 'open', bags: 1, mouth: 'o', look: [0, -0.3] }, L.T + j); } });
  notes.forEach((n, i) => { n.visible = true; n.position.set(CX - 14 + i * 3 + Math.sin(L.T * 2 + i) * 1.2, 8 + Math.sin(L.T * 3 + i * 1.7) * 1.5, 4 + (i % 3) * 2); n.lookAt(camera.position); });
  camMove([CX + 14, 9, 18, CX, 6, 4, 52], [CX + 11, 8.5, 16, CX, 6, 4, 50], L.k); shadowAround(V(CX, 0, 4), 30); }, [[0, 'lullaby', .9]]);
// 45 — …llena todo el local (vista desde arriba)
shot(76.30, 77.69, 'R', null, (L) => { use('cafe');
  [[-12, 7], [0, 8.4], [12, 7]].forEach(([x, z], j) => { for (let i = 0; i < 2; i++) { const f = folk[j * 2 + i]; put(f, CX + x + (i ? 3 : -3), 0, z, i ? -1.4 : 1.4); applyPose(f, { ...sitPose, headX: 0.5 + Math.sin(L.T * 2) * 0.1 }); face(f, { eyes: 'half', bags: 1, mouth: 'flat' }, 99); } });
  notes.forEach((n, i) => { n.visible = true; const a = i / 10 * 6.283 + L.T; n.position.set(CX + Math.cos(a) * 12, 9, 6 + Math.sin(a) * 7); n.lookAt(camera.position); });
  camMove([CX + 2, 22, 24, CX, 3, 5, 52], [CX + 1, 20, 21, CX, 3, 5, 50], L.k); camera.rotateZ(L.k * 0.15);
  shadowAround(V(CX, 0, 6), 30); }, [[0, 'lullaby2', .8], [0.4, 'aah', .5]]);
// 46 — bostezo, bostezo
shot(77.69, 78.93, 'C', null, (L) => { use('cafe');
  const who = L.lt < 0.6 ? folk[0] : folk[3], lt = L.lt < 0.6 ? L.lt : L.lt - 0.6;
  put(who, CX - 1, 0, 2, 0.2); applyPose(who, { aLz: 2.4 * easeOut(lt * 3), aRz: 2.4 * easeOut(lt * 3), aLe: 0.5, aRe: 0.5, headX: -0.4 }); face(who, { eyes: 'closed', bags: 1, mouth: 'yawn' }, 99);
  const hp = who.head.getWorldPosition(V(0, 0, 0)); cam([hp.x, hp.y + 0.5, hp.z + 6], [hp.x, hp.y - 0.5, hp.z], 40 * punch(lt, 0, 0.12)); shadowAround(V(CX, 0, 2), 15); }, [[0.0, 'yawn_m', 1], [0.6, 'yawn_f2', 1]]);
// 47 — bostezo contra la cámara
shot(78.93, 79.61, 'W', null, (L) => { use('cafe');
  put(folk[1], CX - 1, 0, 2, 0); applyPose(folk[1], { aLz: 2.6, aRz: 2.6, headX: -0.5 }); face(folk[1], { eyes: 'closed', bags: 1, mouth: 'yawn' }, 99);
  const hp = folk[1].head.getWorldPosition(V(0, 0, 0)); cam([hp.x, hp.y + 0.6, hp.z + 4], [hp.x, hp.y + 0.4, hp.z], 34 * punch(L.lt, 0.05, 0.3)); shadowAround(V(CX, 0, 2), 15); }, [[0.05, 'impact', .8], [0.05, 'yawn_low', 1]]);
// 48 — „¡Apágalo! ¡Apágalo!"
shot(79.61, 81.67, 'C', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); const sh = Math.sin(L.T * 30) * 0.04; applyPose(wach, { lean: 0.25 + sh, aRx: 1.25, aRe: 1.35, aLx: 1.6, aLe: 0.0, aLz: -0.2, headX: 0.1 });
  face(wach, { eyes: 'wide', brows: 1, mouth: lip(L.T, spoken(79.61, 81.67)) || 'shout', veins: 1, sweat: 1 }, L.T);
  const hp48 = wach.head.getWorldPosition(V(0, 0, 0)); camMove([hp48.x + 1.4, hp48.y - 0.4, hp48.z + 6.5, hp48.x, hp48.y - 0.2, hp48.z, 44], [hp48.x + 1.1, hp48.y - 0.4, hp48.z + 5.4, hp48.x, hp48.y - 0.2, hp48.z, 42], L.k); shadowAround(V(CX, 0, -6), 20); }, [[0.0, 'shout_crowd', .4], [0.2, 'cup_rattle', .7], [1.1, 'table_bang', .8]]);
// 49 — bebe y se da una bofetada
shot(81.67, 83.26, 'C', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); const slap = L.lt > 0.85 && L.lt < 1.05;
  kp(wach, L.lt, [[0, { aRx: 1.25, aRe: 1.35 }], [0.4, { aRx: 2.5, aRe: 2.2, headX: -0.5 }], [0.7, { aRx: 1.25, aRe: 1.35 }], [0.85, { aLx: 1.6, aLz: 1.2, aLe: 1.6 }], [1.05, { aLx: 1.4, aLz: 0.4, aLe: 1.2, headY: 0.7, headZ: 0.2 }], [1.6, { aLx: 0.2, headY: 0 }]]);
  face(wach, { eyes: L.lt > 0.85 ? 'squint' : 'wide', brows: 0.8, mouth: L.lt < 0.6 ? 'o' : 'teeth', sweat: 1 }, L.T);
  const hp = wach.head.getWorldPosition(V(0, 0, 0)); cam([hp.x + 0.8 + (slap ? 0.2 : 0), hp.y + 0.8, hp.z + 5.5], [hp.x, hp.y + 0.5, hp.z], 40); shadowAround(V(CX, 0, -8), 15); }, [[0.25, 'gulp', .8], [0.9, 'slap', 1]]);
// 50 — aguanta… (ZOOM LENTO: lucha contra el sueño)
shot(83.26, 84.92, 'Z', 'slow', (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { aRx: 1.25, aRe: 1.35, headX: Math.sin(L.T * 2.5) * 0.15 });
  const lid = 0.25 + 0.4 * (0.5 + 0.5 * Math.sin(L.lt * 5)); face(wach, { eyes: 'open', lid, brows: -0.5, mouth: 'teeth', sweat: 1 }, 99);
  const hp = wach.head.getWorldPosition(V(0, 0, 0)); camMove([hp.x, hp.y + 0.8, hp.z + 5.5, hp.x, hp.y + 0.7, hp.z, 34], [hp.x, hp.y + 0.75, hp.z + 4, hp.x, hp.y + 0.7, hp.z, 28], L.k, easeIn); shadowAround(V(CX, 0, -8), 15); }, [[0.2, 'tension_str', .6]]);
// 51 — …y bosteza enorme
shot(84.92, 86.40, 'C', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { aRx: 1.25, aRe: 1.35, headX: -0.5 * easeOut(L.lt), aLz: 1.5 * easeOut(L.lt), aLe: 0.6 });
  face(wach, { eyes: 'closed', brows: -0.3, mouth: L.lt > 0.25 ? 'yawn' : 'o' }, 99);
  const hp = wach.head.getWorldPosition(V(0, 0, 0)); camMove([hp.x + 1, hp.y - 1, hp.z + 6, hp.x, hp.y + 0.8, hp.z, 42], [hp.x + 0.6, hp.y - 0.8, hp.z + 5, hp.x, hp.y + 0.8, hp.z, 40], L.k); shadowAround(V(CX, 0, -8), 15); }, [[0.2, 'yawn_big', 1]]);
// 52 — el bostezo de su vida: el bigote se suelta
shot(86.40, 87.91, 'W', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { aRx: 1.25, aRe: 1.35, headX: -0.6, aLz: 2.2, aLe: 0.4 }); face(wach, { eyes: 'closed', brows: -0.4, mouth: 'yawn' }, 99);
  wach.props.moustache.g.position.y = 0.42 - (L.lt > 0.9 ? 0.15 : 0); wach.props.moustache.g.rotation.z = L.lt > 0.9 ? -0.4 : 0;
  const hp = wach.head.getWorldPosition(V(0, 0, 0)); cam([hp.x + 1.2, hp.y - 0.4, hp.z + 4.8], [hp.x, hp.y + 0.6, hp.z], 42 * punch(L.lt, 0.9, 0.15)); shadowAround(V(CX, 0, -8), 15); }, [[0, 'yawn_epic', 1], [0.9, 'pling', .9]]);
// 53 — Finn salta la barra (anticipación, salto, tazas volando)
shot(87.91, 89.40, 'C', null, (L) => { use('cafe');
  const jt = clamp((L.lt - 0.25) / 0.7); const y = Math.sin(jt * Math.PI) * 4.2; const z = lerp(-2.5, -6.2, jt);
  put(finn, CX - 1.5, y, z, Math.PI); applyPose(finn, L.lt < 0.25 ? { crouch: 0.6, lLx: 0.9, lRx: 0.9, lLk: 1.2, lRk: 1.2, aLx: -0.6, aRx: -0.6 } : { lLx: 1.2, lRx: 0.4, lLk: 1.4, lRk: 0.6, aLx: 2.6, aRx: 2.6, aLe: 0.3, aRe: 0.3, lean: 0.3 });
  face(finn, { eyes: 'open', mouth: 'shout', brows: 0.8 }, L.T);
  flyCups.forEach((c, i) => { const tt = L.lt - 0.45; c.visible = true; c.scale.setScalar(1); const p = tt > 0 ? ballistic([CX - 3 + i * 1.4, 3.75, -5.5], [(i - 1.5) * 3, 9, 5], tt, 30, 0.05) : [CX - 3 + i * 1.4, 3.75, -5.5]; c.position.set(...p); c.rotation.set(tt > 0 ? tt * 9 : 0, 0, tt > 0 ? tt * 7 : 0); });
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { lean: -0.2, aLz: 1.0, aRz: 1.0 }); face(wach, { eyes: 'wide', brows: -0.6, mouth: 'o' }, L.T); wCup.visible = false;
  camMove([CX + 7, 5, 2, CX - 1.5, 4.5, -5, 50], [CX + 6.5, 5.5, 1.5, CX - 1.5, 5, -5.5, 48], L.k); shadowAround(V(CX, 0, -5), 20); }, [[0.0, 'anticip', .6], [0.25, 'jump', .9], [0.5, 'porcelain_break', 1], [0.95, 'land', .8]]);
// 54 — tira del bigote… ¡riiip!
shot(89.40, 91.11, 'F', null, (L) => { use('cafe');
  put(wach, CX - 1, 0, -8.6, 0); const rip = L.lt > 1.05; applyPose(wach, { lean: rip ? -0.35 : 0.2, headX: rip ? -0.3 : 0.2, aLz: 0.8, aRz: 0.8 }); face(wach, { eyes: 'wide', brows: 0.9, mouth: 'shout', veins: 1 }, L.T); wCup.visible = false;
  put(finn, CX - 1, 2.5, -6.1, Math.PI); applyPose(finn, { aLx: 1.6, aRx: 1.6, aLe: 0.2, aRe: 0.2, lean: rip ? -0.5 : -0.25 }); face(finn, { eyes: 'squint', mouth: 'teeth', brows: 0.9 }, L.T);
  wach.props.moustache.g.visible = !rip; if (!rip) wach.props.moustache.g.scale.set(1 + Math.max(0, L.lt - 0.3) * 0.5, 1, 1); else wach.props.moustache.g.scale.set(1, 1, 1);
  if (rip) { hands.g.visible = true; hands.g.position.copy(finn.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(0, -0.3, -0.4)); hands.g.scale.setScalar(1.1); }
  camMove([CX + 8, 6.8, -7.2, CX - 1, 6.2, -7.4, 44], [CX + 7.2, 6.8, -7.2, CX - 1, 6.2, -7.4, 42 * punch(L.lt, 1.05, 0.15)], L.k); shadowAround(V(CX, 0, -7), 15); }, [[0.2, 'stretch', .8], [1.05, 'rip', 1], [1.05, 'impact', .8]]);
// 55 — ¡eran las agujas del Rathausturm! (ZOOM LENTO)
shot(91.11, 93.23, 'R', 'slow', (L) => { outdoors();
  put(finn, 2, 0, -340, 0); applyPose(finn, { aRx: 2.1, aRe: 0.4, headX: -0.15 }); face(finn, { eyes: 'wide', mouth: 'o', brows: -0.4, look: [0.5, -0.6] }, L.T); hands.g.visible = true; hands.g.position.copy(finn.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(0, 0.4, 0.3)); hands.g.rotation.set(0, 0, 0); hands.g.scale.setScalar(1.6);
  camMove([2.4, 4.6, -326, 2.2, 6.4, -345, 44], [2.3, 5.2, -331, 2.2, 6.8, -345, 40], L.k, easeIn);
  shadowAround(V(2, 0, -340), 25); }, [[0.3, 'bell_far', .6]]);
// 56 — hace 12 años las arrancó (flashback sepia)
shot(93.23, 95.58, 'S', null, (L) => { outdoors(); grade.uniforms.sepia.value = 0.85;
  put(wach, -2.2, 82, -410.2, 0); kp(wach, L.lt, [[0, { aLx: 2.8, aRx: 2.8, aLe: 0.3, aRe: 0.3, lLx: 0.5, lLk: 0.8 }], [1.2, { aLx: 2.6, aRx: 2.2, aRe: 0.8, lean: -0.3 }], [2.3, { aLx: 2.2, aRx: 1.0, lean: -0.4 }]]);
  face(wach, { eyes: 'squint', brows: 0.9, mouth: 'teeth' }, L.T); wach.props.moustache.g.visible = false; wCup.visible = false;
  tower.hands.visible = L.lt < 1.2; if (L.lt >= 1.2) { hands.g.visible = true; hands.g.position.copy(wach.aR.hand.getWorldPosition(V(0, 0, 0))); hands.g.scale.setScalar(6); hands.g.rotation.set(0, 0, L.lt * 2); }
  camMove([10, 72, -380, -1, 86, -411, 46], [8, 74, -386, -1, 86, -411, 44], L.k); shadowAround(V(0, 70, -410), 30);
  badge('tag', 'vor 12 Jahren', W / 2, H * 0.16, L.lt - 0.1); }, [[0.1, 'film_roll', .5], [1.2, 'metal_rip', 1], [1.25, 'sparks', .6]]);
// 57 — las puso en 6:59
shot(95.58, 97.20, 'F', null, (L) => { use('shop'); grade.uniforms.sepia.value = 0.85;
  hands.g.visible = true; hands.g.position.set(WX, 6.1, -2.4); hands.g.rotation.set(-Math.PI / 2, 0, 0); hands.g.scale.setScalar(3);
  hands.longH.rotation.z = lerp(0.22, Math.PI / 2 + 0.1, easeInOut(clamp(L.lt / 1.0))); hands.shortH.rotation.z = lerp(-0.12, -0.6, easeInOut(clamp(L.lt / 1.0)));
  camMove([WX + 2, 12, 2, WX, 5.8, -2.4, 40], [WX + 1.5, 11, 0.5, WX, 5.8, -2.4, 36], L.k); shadowAround(V(WX, 0, -2), 15);
  badge('big', '6:59', W / 2, H * 0.18, L.lt - 0.9); }, [[0.2, 'ratchet', .8], [0.9, 'click_set', 1]]);
// 58 — y se las pegó en la cara
shot(97.20, 98.78, 'W', null, (L) => { use('cafe'); grade.uniforms.sepia.value = 0.85;
  put(wach, CX - 1, 0, -8.6, 0); kp(wach, L.lt, [[0, { aRx: 2.4, aRe: 2.0, aLx: 2.4, aLe: 2.0 }], [0.8, { aRx: 2.5, aRe: 2.3, aLx: 2.5, aLe: 2.3 }], [1.3, { aRx: 0.3, aLx: 0.3, headZ: 0.1 }]]);
  face(wach, { eyes: L.lt > 1.0 ? 'squint' : 'wide', brows: 0.8, mouth: L.lt > 1.0 ? 'grin' : 'flat' }, L.T); wCup.visible = false;
  wach.props.moustache.g.visible = L.lt > 0.8;
  const hp = wach.head.getWorldPosition(V(0, 0, 0)); camMove([hp.x - 1, hp.y + 0.8, hp.z + 5, hp.x, hp.y + 0.6, hp.z, 40], [hp.x - 0.8, hp.y + 0.8, hp.z + 4.2, hp.x, hp.y + 0.6, hp.z, 38], L.k); shadowAround(V(CX, 0, -8), 15); }, [[0.8, 'tape', 1], [1.1, 'evil_laugh', .6]]);
// 59 — nunca más mañana
shot(98.78, 100.17, 'S', null, (L) => { outdoors();
  camMove([0, 60, 40, 0, 40, -420, 56], [0, 64, 30, 0, 44, -420, 54], L.k); sky.moon.position.set(0, 300, -1500); shadowAround(V(0, 0, -150), 120);
  badge('red', 'NIE WIEDER MORGEN', W / 2, H * 0.2, L.lt - 0.2); }, [[0.2, 'boom', 1]]);
// 60 — quien duerme no despierta
shot(100.17, 101.97, 'C', null, (L) => { outdoors();
  camMove([-20, 22, -278, 0, 2, -312, 50], [-16, 20, -282, 0, 2, -312, 48], L.k); shadowAround(V(0, 0, -305), 30);
  for (let i = 0; i < 3; i++) badge('zzz', 'Z', W * (0.3 + i * 0.2), H * (0.4 - (L.lt * 0.08) % 0.1), L.lt - i * 0.2); }, [[0, 'snore_chorus', .8]]);
// 61 — y quien no puede dormir compra café (caja registradora)
shot(101.97, 103.95, 'Z', null, (L) => { use('cafe');
  const reg = cafe.reg.getWorldPosition(V(0, 0, 0)); camMove([reg.x - 3, reg.y + 3, reg.z + 5, reg.x, reg.y + 0.8, reg.z, 42], [reg.x - 2.5, reg.y + 2.6, reg.z + 4, reg.x, reg.y + 0.8, reg.z, 40], L.k);
  put(wach, CX + 6, 0, -8.6, -0.3); applyPose(wach, { aLx: 1.2, aLe: 1.0, aRx: 1.25, aRe: 1.35 }); face(wach, { eyes: 'happy', brows: 0.4, mouth: 'grin' }, 99);
  for (let i = 0; i < 3; i++) badge('minus', '+8 €', W * (0.28 + i * 0.22), H * (0.22 + (i % 2) * 0.08), L.lt - 0.3 - i * 0.3);
  shadowAround(V(CX + 7, 0, -7), 15); }, [[0.3, 'cash', .9], [0.6, 'cash', .8], [0.9, 'cash', .9], [1.2, 'coins', .7]]);
// 62 — el abuelo lo había descubierto (flashback)
shot(103.95, 106.00, 'F', null, (L) => { use('cafe'); grade.uniforms.sepia.value = 0.7;
  put(opa, CX - 4.5, 0, -2.6, 1.0); applyPose(opa, { aRx: 2.3, aRe: 1.8, headX: -0.1, lean: 0.15 }); face(opa, { eyes: 'squint', brows: 0.6, mouth: 'flat', look: [0.4, -0.2] }, L.T);
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { aRx: 1.25, aRe: 1.35 }); face(wach, { eyes: 'wide', brows: -0.3, mouth: 'flat', sweat: 1 }, L.T);
  camMove([CX + 1.5, 5.6, 5, CX - 4.3, 4.0, -2.6, 46], [CX + 1.1, 5.5, 4.2, CX - 4.3, 4.0, -2.6, 44], L.k); shadowAround(V(CX - 2, 0, -6), 15); }, [[0.2, 'tick', .7], [0.6, 'hmm', .6]]);
// 63 — al día siguiente, manzanilla en su café
shot(106.00, 108.30, 'W', null, (L) => { use('cafe'); grade.uniforms.sepia.value = 0.7;
  const cup = flyCups[0]; cup.visible = true; cup.position.set(CX - 2, 3.75, -5.4); cup.scale.setScalar(1.5);
  kamille.visible = true; const ft = clamp((L.lt - 0.2) / 0.8); kamille.position.set(CX - 2, lerp(6, 4.4, easeIn(ft)), -5.4); kamille.rotation.y = L.T;
  put(wach, CX - 1, 0, -8.6, 0); applyPose(wach, { aLx: 1.6, aLe: 0.8, lean: 0.25, headX: 0.3 }); face(wach, { eyes: 'squint', brows: 0.8, mouth: 'grin' }, L.T); wCup.visible = false;
  camMove([CX - 5, 5.6, 0, CX - 1.6, 4.6, -6, 42], [CX - 4.4, 5.4, -0.8, CX - 1.6, 4.6, -6, 40], L.k); shadowAround(V(CX - 2, 0, -6), 12); bloom.strength = 0.25;
  badge('tag', 'KAMILLE', W / 2, H * 0.17, L.lt - 0.4); }, [[0.2, 'sprinkle', .8], [1.0, 'spoon', .8], [1.6, 'yawn_old', .7]]);
// 64 — „¡Devuélvelo, mocoso!"
shot(108.30, 109.65, 'S', null, (L) => { use('cafe');
  const jt = clamp(L.lt / 0.8); put(wach, CX - 1, Math.sin(jt * Math.PI) * 3.6, lerp(-8.6, -3, jt), 0); applyPose(wach, { lLx: 1.0, lLk: 1.2, lRx: 0.3, aRx: 2.4, aRe: 0.3, aLx: 1.0, lean: 0.3 });
  face(wach, { eyes: 'wide', brows: 1, mouth: lip(L.T, spoken(108.30, 109.65)) || 'shout', veins: 1 }, L.T); wach.props.moustache.g.visible = false; wCup.visible = false;
  camMove([CX + 1, 3, 6, CX - 1, 6, -5, 48], [CX + 0.8, 3, 5, CX - 1, 6.4, -5, 46], L.k); shadowAround(V(CX, 0, -5), 20); }, [[0, 'shout_m', .5], [0.3, 'jump', .8], [0.8, 'land', .8]]);
// 65 — Finn corre a la torre
shot(109.65, 110.98, 'Z', null, (L) => { outdoors();
  const z = -60 - L.lt * 22; put(finn, 1, 0, z, Math.PI); applyPose(finn, runPose(L.T, 1.1)); face(finn, { eyes: 'open', mouth: 'teeth', brows: 0.7 }, L.T);
  hands.g.visible = true; hands.g.position.copy(finn.aR.hand.getWorldPosition(V(0, 0, 0))); hands.g.scale.setScalar(1.2);
  cam([1.5, 3.2, z - 9], [1, 3.6, z], 50); shadowAround(V(0, 0, z), 30); }, [[0, 'run_cobble', 1]]);
// 66 — media ciudad tras él
shot(110.98, 112.51, 'S', null, (L) => { outdoors();
  const z = -120 - L.lt * 22; put(finn, 1, 0, z, Math.PI); applyPose(finn, runPose(L.T, 1.1)); face(finn, { eyes: 'open', mouth: 'teeth', brows: 0.7 }, L.T);
  put(wach, 0, 0, z + 10, Math.PI); applyPose(wach, runPose(L.T + 0.2, 1)); face(wach, { eyes: 'wide', brows: 1, mouth: 'shout', veins: 1 }, L.T); wach.props.moustache.g.visible = false; wCup.visible = false;
  folk.forEach((f, i) => { put(f, -8 + (i % 4) * 5, 0, z + 16 + Math.floor(i / 4) * 5, Math.PI); applyPose(f, runPose(L.T + i * 0.13, 0.95)); face(f, { eyes: 'wide', bags: 1, mouth: 'shout' }, L.T + i); });
  camMove([0, 26, z + 34, 0, 2, z, 52], [0, 24, z + 30, 0, 2, z, 50], L.k); shadowAround(V(0, 0, z + 10), 40); }, [[0, 'crowd_run', 1], [0.4, 'shout_crowd', .6]]);
// 67 — coloca las agujas (dentro de la torre)
shot(112.51, 113.74, 'C', null, (L) => { use('tin'); bloom.strength = 0.2;
  put(finn, TX + 2.6, 9.2, -8.4, -2.4); applyPose(finn, { aRx: 2.0, aRe: 0.3, aLx: 1.8, aLe: 0.5, headX: -0.3 }); face(finn, { eyes: 'squint', mouth: 'teeth', brows: 0.7 }, L.T);
  const kk = easeOut(clamp(L.lt / 0.6)); hands.g.visible = true; hands.g.position.set(TX, 16, lerp(-8, -10.3, kk)); hands.g.scale.setScalar(4); hands.g.rotation.set(0, 0, 0);
  tin.gears.forEach((g, i) => g.rotation.z = (i % 2 ? 1 : -1) * L.lt * (L.lt > 0.6 ? 1.5 : 0.1));
  camMove([TX + 7, 15, 4, TX + 1.2, 13.5, -9.5, 48], [TX + 6, 14.6, 2.5, TX + 1.2, 13.5, -9.5, 46], L.k); shadowAround(V(TX, 0, -8), 20); }, [[0, 'gears', .8], [0.6, 'click_metal', 1]]);
// 68 — las seis y cincuenta y nueve (ZOOM LENTO a la esfera)
shot(113.74, 115.42, 'C', 'slow', (L) => { outdoors(); tower.hands.visible = true;
  tower.minH.rotation.z = -(59 / 60) * Math.PI * 2 + Math.sin(L.T * 40) * 0.01; tower.hourH.rotation.z = -(6 + 59 / 60) / 12 * Math.PI * 2;
  camMove([0, 60, -360, 0, 88, -411, 34], [0, 70, -380, 0, 88, -411, 26], L.k, easeIn); shadowAround(V(0, 0, -400), 60);
  badge('big', '6:59', W / 2, H * 0.17, L.lt - 0.2); }, [[0.2, 'tick', 1], [0.8, 'tick', 1]]);
// 69 — ¡las siete!
shot(115.42, 116.30, 'F', null, (L) => { outdoors(); tower.hands.visible = true; const j = L.lt > 0.08;
  tower.minH.rotation.z = j ? -Math.PI * 2 + Math.sin((L.lt - 0.08) * 30) * 0.06 * Math.exp(-(L.lt - 0.08) * 8) : -(59 / 60) * Math.PI * 2; tower.hourH.rotation.z = -7 / 12 * Math.PI * 2;
  cam([0, 76, -392], [0, 88, -411], 30 * punch(L.lt, 0.08, 0.2)); shadowAround(V(0, 0, -400), 60); grade.uniforms.flash.value = j ? Math.max(0, 0.5 - (L.lt - 0.08) * 2) : 0;
  badge('big', '7:00', W / 2, H * 0.17, L.lt - 0.08); }, [[0.08, 'clack', 1], [0.1, 'bell_big', 1]]);
// 70 — por primera vez en doce años (amanecer sobre los tejados)
shot(116.30, 118.35, 'Z', null, (L) => { outdoors(); tower.hands.visible = true; tower.minH.rotation.z = -Math.PI * 2; tower.hourH.rotation.z = -7 / 12 * Math.PI * 2;
  const d = easeInOut(L.k) * 0.6; dayness(d); sun.position.set(-80, -40 + d * 200, -1500);
  camMove([30, 50, -250, 0, 40, -480, 54], [26, 54, -262, 0, 44, -480, 52], L.k); shadowAround(V(0, 0, -350), 100); }, [[0.0, 'bells', .9], [0.6, 'bells', .7], [1.2, 'bells', .6], [0.5, 'choir', .6]]);
// 71 — salió el sol
shot(118.35, 119.52, 'W', null, (L) => { outdoors(); tower.hands.visible = true; tower.minH.rotation.z = -Math.PI * 2; tower.hourH.rotation.z = -7 / 12 * Math.PI * 2;
  const d = 0.6 + 0.4 * easeOut(L.k); dayness(d); sun.position.set(-150, 60 + easeOut(L.k) * 180, -1500); sun.scale.setScalar(560 + L.k * 160); bloom.strength = 0.7;
  camMove([10, 58, -140, -20, 95, -900, 52], [9, 60, -152, -20, 100, -900, 50], L.k); shadowAround(V(0, 0, -350), 100); }, [[0, 'sunrise_shine', 1]]);
// 72 — „¡El sol! ¡El sol!"
shot(119.52, 121.18, 'S', null, (L) => { outdoors(); dayness(1); sun.position.set(-60, 200, -1500);
  folk.slice(0, 5).forEach((f, i) => { put(f, -8 + i * 4, 0, -100 - (i % 2) * 3, Math.PI); applyPose(f, { aLx: i % 2 ? 0 : 2.8, aRx: i % 2 ? 2.6 : 1.0, aRe: i % 2 ? 0.3 : 1.6, headX: -0.4 }); face(f, { eyes: 'squint', bags: 0.6, mouth: lip(L.T + i * 0.07, spoken(119.52, 121.18)) || 'grin' }, L.T + i); });
  camMove([0, 6, -80, 0, 5, -102, 50], [0, 6.2, -84, 0, 5, -102, 48], L.k); shadowAround(V(0, 0, -100), 30); }, [[0, 'cheer', .9], [0.8, 'birds', .6]]);
// 73 — niños saltando, sombras largas
shot(121.18, 122.86, 'C', null, (L) => { outdoors(); dayness(1); sun.position.set(-60, 200, -1500);
  const y = Math.abs(Math.sin(L.T * 4.5)) * 2.5; put(finn, 0, y, -120, 0.2); applyPose(finn, { aLz: 2.6, aRz: 2.6, lLx: y > 0.3 ? 0.5 : 0, lLk: y > 0.3 ? 0.8 : 0 }); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, 99);
  folk.slice(5, 8).forEach((f, i) => { const yy = Math.abs(Math.sin(L.T * 4.5 + i)) * 2; put(f, -6 + i * 6, yy, -126, 0.1); applyPose(f, { aLz: 2.4, aRz: 2.4 }); face(f, { eyes: 'happy', bags: 0.4, mouth: 'grin' }, 99); });
  camMove([6, 4, -104, 0, 4.5, -122, 50], [5, 4.2, -107, 0, 4.5, -122, 48], L.k); shadowAround(V(0, 0, -120), 30); }, [[0.0, 'kids_laugh', .8], [0.3, 'jump_small', .6], [0.9, 'jump_small', .6]]);
// 74 — en el Schlafgarten despiertan los durmientes
shot(122.86, 125.04, 'Z', null, (L) => { outdoors(); dayness(1); sun.position.set(-60, 200, -1500);
  garden.sleepers.forEach((p, i) => { const tt = clamp((L.lt - 0.3 - (i % 5) * 0.15) * 1.5); p.root.rotation.x = lerp(-Math.PI / 2, -0.1, easeOut(tt)); p.setFace({ eyes: tt > 0.3 ? 'open' : 'closed', bags: 0.3, mouth: tt > 0.3 ? 'grin' : 'o' }); });
  camMove([0, 22, -276, 0, 2, -310, 50], [0, 18, -282, 0, 2, -310, 48], L.k); shadowAround(V(0, 0, -305), 40); }, [[0.1, 'rooster', 1], [0.5, 'stretch_creak', .7], [1.0, 'blanket', .7]]);
// 75 — „¡Hombre, qué buen sueño!"
shot(125.04, 127.52, 'W', null, (L) => { outdoors(); dayness(1); sun.position.set(-60, 200, -1500);
  const p = garden.sleepers[6]; p.root.rotation.x = -0.1; applyPose(p, { aLz: 2.6, aRz: 2.6, aLe: 0.5, aRe: 0.5, headX: -0.3 }); p.setFace({ eyes: 'happy', bags: 0, mouth: lip(L.T, spoken(125.04, 127.52)) || 'grin', blush: 1 });
  const hp = p.head.getWorldPosition(V(0, 0, 0)); camMove([hp.x + 1, hp.y + 0.8, hp.z + 6, hp.x, hp.y + 0.4, hp.z, 42], [hp.x + 0.8, hp.y + 0.8, hp.z + 5, hp.x, hp.y + 0.4, hp.z, 40], L.k); shadowAround(V(hp.x, 0, hp.z), 15);
  garden.sleepers.forEach((s, i) => { if (i !== 6) { s.root.rotation.x = -0.1; s.setFace({ eyes: 'open', bags: 0, mouth: 'smile' }); } }); }, [[0, 'back_crack', .8], [0.4, 'laugh_m', .7]]);
// 76 — „¡Opa! ¡Opa! ¡Opa!" (abrazo)
shot(127.52, 129.57, 'F', null, (L) => { outdoors(); dayness(1); sun.position.set(-60, 200, -1500);
  garden.sleepers.forEach(s => { s.root.rotation.x = -0.1; s.setFace({ eyes: 'open', bags: 0, mouth: 'smile' }); });
  const so = garden.opa; so.root.rotation.x = lerp(-Math.PI / 2, -0.1, easeOut(clamp(L.lt * 2))); applyPose(so, { aLx: 1.6, aRx: 1.6, aLe: 0.8, aRe: 0.8 }); so.setFace({ eyes: 'happy', mouth: 'grin', blush: 1 });
  const k = clamp(L.lt / 0.9); put(finn, B9X + lerp(9, 1.6, easeOut(k)), 0, B9Z - 1.5, -Math.PI / 2); applyPose(finn, k < 1 ? runPose(L.T, 1.1) : { aLx: 1.6, aRx: 1.6, aLe: 0.9, aRe: 0.9, lean: 0.2 });
  face(finn, { eyes: k < 1 ? 'open' : 'happy', mouth: lip(L.T, spoken(127.52, 129.57)) || 'grin', blush: 1 }, L.T);
  camMove([B9X - 5, 6, B9Z + 5, B9X + 1.5, 3, B9Z - 2, 46], [B9X - 4.2, 5.6, B9Z + 4, B9X + 1, 3, B9Z - 2, 44], L.k); shadowAround(V(B9X, 0, B9Z), 20); }, [[0, 'steps_run', .7], [0.9, 'hug', .8], [1.1, 'laugh_old', .8]]);
// 77 — Herr Wachter se cuelga de la aguja
shot(129.57, 131.00, 'S', null, (L) => { outdoors(); dayness(1); sun.position.set(-60, 200, -1500); tower.hands.visible = true; tower.hourH.rotation.z = -7 / 12 * Math.PI * 2;
  tower.minH.rotation.z = -Math.PI * 2 + L.lt * 0.2; const tip = V(0, 88, -410.4).add(V(-Math.sin(tower.minH.rotation.z) * 5.4, Math.cos(tower.minH.rotation.z) * 5.4, 0));
  put(wach, tip.x, tip.y - 6.5, tip.z + 0.8, 0); applyPose(wach, { aLx: 3.0, aRx: 3.0, aLe: 0.2, aRe: 0.2, lLx: Math.sin(L.T * 9) * 0.6, lRx: -Math.sin(L.T * 9) * 0.6, lLk: 0.4, lRk: 0.4 });
  face(wach, { eyes: 'wide', brows: -0.7, mouth: 'shout', sweat: 1 }, L.T); wach.props.moustache.g.visible = false; wCup.visible = false;
  camMove([8, 70, -380, 0, 82, -411, 46], [7, 72, -385, 0, 82, -411, 44], L.k); shadowAround(V(0, 70, -410), 30); }, [[0, 'metal_creak', .8], [0.4, 'shout_m', .5]]);
// 78 — …para traer de vuelta la noche
shot(131.00, 132.60, 'C', null, (L) => { outdoors(); dayness(1); sun.position.set(-60, 200, -1500); tower.hands.visible = true; tower.hourH.rotation.z = -7 / 12 * Math.PI * 2;
  tower.minH.rotation.z = -Math.PI * 2 + 0.3 + L.lt * 0.15; const tip = V(0, 88, -410.4).add(V(-Math.sin(tower.minH.rotation.z) * 5.4, Math.cos(tower.minH.rotation.z) * 5.4, 0));
  put(wach, tip.x, tip.y - 6.5, tip.z + 0.8, 0); applyPose(wach, { aLx: 3.0, aRx: 3.0, aLe: 0.4, aRe: 0.4, lLx: 1.2, lRx: 1.2, lLk: 1.0, lRk: 1.0, lean: 0.3 });
  face(wach, { eyes: 'squint', brows: 1, mouth: 'teeth', sweat: 1, veins: 1 }, L.T); wach.props.moustache.g.visible = false; wCup.visible = false;
  const hp = wach.head.getWorldPosition(V(0, 0, 0)); camMove([hp.x + 2, hp.y - 1, hp.z + 7, hp.x, hp.y + 0.6, hp.z, 42], [hp.x + 1.6, hp.y - 0.8, hp.z + 6, hp.x, hp.y + 0.6, hp.z, 40], L.k); shadowAround(V(0, 70, -410), 20); }, [[0, 'strain', .8], [0.5, 'metal_creak', .7]]);
// 79 — y el reloj lo atrapó en la puertecita del cuco (ZOOM LENTO)
shot(132.60, 135.17, null, 'slow', (L) => { outdoors(); dayness(1); sun.position.set(-60, 200, -1500); tower.hands.visible = true; tower.hourH.rotation.z = -7 / 12 * Math.PI * 2; tower.minH.rotation.z = -Math.PI * 2;
  const op = L.lt < 0.4 ? spring(L.lt * 2.5) : L.lt < 1.1 ? 1 : 1 - easeIn(clamp((L.lt - 1.1) / 0.15));
  tower.door.rotation.y = -op * 1.7;
  // Wachter atrapado: solo asoman la cabeza y los brazos por la puertecita
  put(wach, 0, 70.6, -412.4, 0); applyPose(wach, { lean: 0.6, aLx: 1.5, aRx: 1.5, aLe: 0.3, aRe: 0.3, aLz: 0.5, aRz: 0.5, headX: -0.5 }); wach.props.moustache.g.visible = false; wCup.visible = false;
  face(wach, { eyes: 'wide', brows: -0.8, mouth: L.lt > 1.25 ? 'frown' : 'shout', sweat: 1 }, L.T);
  if (L.lt > 1.3) { cuckoo.visible = true; const ck = spring(clamp((L.lt - 1.3) * 2)); cuckoo.position.set(0, 79.5, -411 + ck * 2.4); cuckoo.rotation.x = Math.sin(L.T * 14) * 0.15; }
  camMove([0, 74, -392, 0, 76, -411, 34], [0, 75, -398, 0, 76.5, -411, 26], L.k, easeIn); shadowAround(V(0, 70, -410), 20); }, [[0.0, 'door_creak', .8], [1.15, 'door_slam', 1], [1.4, 'cuckoo_big', 1], [1.9, 'feathers', .6]]);

// ---------- cálculo de transiciones y lista de sonidos ----------
const TRW = { W: 3, Z: 3, F: 2, S: 3, R: 4, I: 5, C: 4 };   // fotogramas a cada lado del corte
const TR_SFX = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => {
  for (const [lt, name, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: name, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + 0.05, s: 'riser', g: 0.9, d: +(s.t1 - s.t0 - 0.05).toFixed(3) }); CUES.push({ t: s.t1 - 0.02, s: 'braam', g: 1 }); }
  else CUES.push({ t: s.t0 + 0.05, s: i % 3 === 0 ? 'zoom_in' : i % 3 === 1 ? 'whoosh_soft' : 'zoom_out', g: 0.35 });
  if (s.tr) CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS).toFixed(3), s: TR_SFX[s.tr], g: 0.8 });
});
CUES.sort((a, b) => a.t - b.t);

function shotAt(T) { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; }

// ---------- un fotograma ----------
function renderShot(i, T, tr, a) {
  const s = S[i]; hideAll(); BADGES.length = 0;
  const lt = T - s.t0, d = s.t1 - s.t0, k = clamp(lt / d);
  s.fn({ lt, k, T, d });
  if (s.zoom === 'slow') { const e = easeIn(k); grade.uniforms.vig.value = lerp(0.32, 0.8, e); camera.fov *= lerp(1, 0.92, e); }
  // sacudida tras impactos
  let shake = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'thump', 'braam', 'slam', 'clack', 'boom', 'door_slam', 'rip'].includes(c.s) && T - c.t < 0.12) shake = 1 - (T - c.t) / 0.12; }
  if (shake) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * 0.25 * shake; camera.position.y += (r() - .5) * 0.25 * shake; }
  camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * 0.07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); }
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * 0.95);
  composer.render();
}
function renderAt(T) {
  const i = shotAt(T), s = S[i];
  grade.uniforms.blurAmt.value = 0;
  // transición: ¿cerca del corte de salida o de entrada?
  let tr = null, a = 0, phase = 0;
  const fOut = (s.t1 - T) * FPS, fIn = (T - s.t0) * FPS;
  if (s.tr && fOut < TRW[s.tr]) { tr = s.tr; a = 1 - fOut / TRW[s.tr]; phase = -1; }
  else if (i > 0 && S[i - 1].tr && fIn < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fIn / TRW[S[i - 1].tr]; phase = 1; }
  renderShot(i, T, tr, a);
  octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H);
  octx.translate(W / 2, H / 2);
  const a2 = a * a;
  if (tr === 'W') octx.translate(phase * a2 * W * 0.45, 0);
  if (tr === 'S') octx.translate(0, phase * a2 * H * 0.35);
  if (tr === 'Z') { const sc = phase < 0 ? 1 + a2 * 0.6 : 1 + a2 * 0.35; octx.scale(sc, sc); octx.filter = `blur(${(a * 6).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((phase < 0 ? 1 : -1) * a2 * 0.55); octx.scale(1 + a2 * 0.3, 1 + a2 * 0.3); octx.filter = `blur(${(a * 5).toFixed(1)}px)`; }
  if (tr === 'C' && phase > 0) { const sc = 1 + a * 0.22; octx.scale(sc, sc); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - phase * W, -H / 2, W, H);
  if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - phase * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (tr === 'I') { const r = (1 - a) * H * 0.75; octx.save(); octx.fillStyle = '#000'; octx.beginPath(); octx.rect(0, 0, W, H); octx.arc(W / 2, H * 0.42, Math.max(0, r), 0, 7, true); octx.fill('evenodd'); octx.restore(); }
  for (const b of BADGES) drawBadge(b);
  caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES;
window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]);
window.__ready = true;
