// Zehn Neins — 94 planos sincronizados con audio/words.json. window.renderAt(T), window.CUES, window.SHOTS.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, backOut, spring, blinking, lip, RNG, mat, box, sphere, cyl } from './engine.js';
import { nightSky, townSet, rathausturm, FONT } from './sets.js';
import { finnRoom, calendar } from './sets2.js';
import { makeKid, makeMama, makeBuyer, makeBrandt, makeChild, makeAdult, makeDog, suburb, living, kitchen, bathroom, snowfall, fireworks } from './world.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 167.83;
const stage = document.getElementById('stage');
const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x2a3a7a, 0.004);
const camera = new THREE.PerspectiveCamera(50, W / H, 0.2, 4000);
const { composer, grade, bloom } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene);
const hemi = new THREE.HemisphereLight(0x9fb0ff, 0x6a6a9a, 1.5); scene.add(hemi);
const moonL = new THREE.DirectionalLight(0xc8d4ff, 1.7); moonL.castShadow = true; moonL.shadow.mapSize.set(4096, 4096); moonL.shadow.bias = -0.0004; moonL.shadow.normalBias = 0.3; moonL.shadow.radius = 4; scene.add(moonL, moonL.target);
function shadowAround(p, s = 40) { const c = moonL.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); moonL.target.position.copy(p); moonL.position.copy(p).add(V(-140, 260, 160)); }

// ---------- mundo ----------
const SX = 3000, OX = SX - 15.4;           // barrio; plano de la puerta de nuestra casa
const SETS = { town: townSet(scene) };
const tower = rathausturm(scene, 0, -420); SETS.tower = tower.g;
{ const sn = new THREE.Mesh(new THREE.PlaneGeometry(60, 700), mat(0xeef2fb, { roughness: 1 })); sn.rotation.x = -Math.PI / 2; sn.position.set(0, .66, -250); sn.receiveShadow = true; SETS.town.add(sn); }
const sub = suburb(scene, SX); SETS.sub = sub.root; const HS = sub.houses;
const LX = 4000, KX = 4200, BX = 4400, RX = 4600;
const liv = living(scene, LX); SETS.liv = liv.g;
const kit = kitchen(scene, KX); SETS.kit = kit.g;
const bath = bathroom(scene, BX); SETS.bath = bath.g;
const room = finnRoom(scene, RX, 0); SETS.room = room.g; room.poster.visible = false; room.plan.visible = false; room.g.traverse(o => { if (o.isPointLight) { o.intensity = 200; o.position.y = 16; } });
const snow = snowfall(scene); const fw = fireworks(scene);
const calG = new THREE.Group(); scene.add(calG); const cal = calendar(calG); SETS.cal = calG;
const OUT = ['sub'];

// ---------- reparto ----------
const kid = makeKid(scene), mama = makeMama(scene), buyer = makeBuyer(scene), brandt = makeBrandt(scene), dog = makeDog(scene);
const kids = [0, 1, 2, 3].map(i => makeChild(scene, i)), ads = [0, 1, 2, 3, 4, 5].map(i => makeAdult(scene, i));
const POOL = [kid, mama, buyer, brandt, ...kids, ...ads];
const shovel = new THREE.Group(); scene.add(shovel); cyl(.12, .12, 5, mat(0x8a5a34), 8, shovel, 0, 2.5, 0); box(1.6, .1, 1.3, mat(0xd8323a, { metalness: .3 }), .05, shovel, 0, 0, .3);
const sign = new THREE.Group(); scene.add(sign); { const { textPlane } = await import('./engine.js');
  const p = textPlane(3.4, 2.4, 340, 240, (c, w, h) => { c.fillStyle = '#fdf6e0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#7a4a2a'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); c.fillStyle = '#c8202a'; c.font = `700 74px ${FONT}`; c.textAlign = 'center'; c.fillText('HUND??', w / 2, 92); c.fillStyle = '#1d2238'; c.font = `700 40px ${FONT}`; c.fillText('BITTE #2.999', w / 2, 170); });
  sign.add(p); cyl(.08, .08, 3, mat(0x8a5a34), 6, sign, 0, -2.4, -.05); }
const PROPS = [shovel, sign];

// ---------- utilidades ----------
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); }
  dog.root.visible = false; for (const p of PROPS) p.visible = false; for (const k in SETS) SETS[k].visible = false;
  for (const h of HS) { h.g.visible = true; h.g.scale.set(1, 1, 1); h.dirt.visible = false; h.door.rotation.y = 0; }
  HS[4].g.visible = false; HS[4].dirt.visible = true;          // la casa que desapareció el año pasado
  for (const i of [7, 9, 11]) { HS[i].g.visible = false; HS[i].dirt.visible = true; }   // bloque perdido hace años
  HS[5].g.visible = false; HS[5].dirt.visible = true;          // la panadería
  kit.xmas.visible = false; kit.broc.visible = true; buyer.props.case.visible = true; buyer.props.case.rotation.set(0, 0, 0);
  tower.hands.visible = true; tower.minH.rotation.z = -Math.PI * 2 * (55 / 60); tower.hourH.rotation.z = -Math.PI * 2 * (11.9 / 12);
  grade.uniforms.sepia.value = 0; grade.uniforms.vig.value = .32; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.25;
  bloom.strength = .5; snow.visible = false; fw.visible = false; scene.fog.density = .004;
  sky.moon.position.set(-200, 380, -1400); sky.clouds.forEach((c, i) => c.position.set(-700 + i * 160, 380 + (i % 3) * 60, -1300));
  hemi.intensity = 1.5; moonL.intensity = 1.7;
}
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
function face(ch, f, T) { const s = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(s.eyes)) s.eyes = 'closed'; ch.setFace(s); }
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; } applyPose(ch, { ...p, ...extra }); }
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const punch = (lt, at, amt = .3, d = .18) => lt < at ? 1 : 1 - amt * easeOut((lt - at) / d);
const hp = (ch) => ch.head.getWorldPosition(V(0, 0, 0));
const proj = v => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
// mirar a la cara de un personaje: dist delante, dy arriba, side lateral
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) {
  const h = hp(ch), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .82, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy + .4, h.z + fz * d - fx * side], [h.x, h.y + .45, h.z], fov);
}
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const street = () => { use(...OUT); snow.visible = true; };
const dayK = (k) => { const u = sky.sky.material.uniforms; u.top.value.setRGB(lerp(.04, .25, k), lerp(.09, .55, k), lerp(.28, .95, k)); u.mid.value.setRGB(lerp(.16, .6, k), lerp(.18, .78, k), lerp(.56, 1, k)); u.hor.value.setRGB(lerp(.48, 1, k), lerp(.31, .85, k), lerp(.72, .7, k)); hemi.intensity = lerp(1.5, 2.2, k); moonL.intensity = lerp(1.7, 3, k); };
const NIGHT = () => dayK(0);
// nuestra puerta (z=0) y la de Brandt (z=-24): exterior = +x
const DOOR = (z) => ({ x: OX, z });

// ---------- capa 2D ----------
const BAD = [];
const badge = (kind, text, x, y, k, a = 1) => BAD.push({ kind, text, x, y, s: spring(k * 1.6), a });
function nein(ch, n, k = 1, gold = false, dy = 1.0) { const h = hp(ch).add(V(0, (ch.spec.scale || 1) * (1.4 + dy), 0)); const [x, y, z] = proj(h); if (z < 1) BAD.push({ kind: gold ? 'neinG' : 'nein', text: String(n), x, y, s: spring(clamp(k) * 1.6) * clamp(1.6 - Math.abs(z - .97) * 30, .55, 1.05), a: 1 }); }
function drawBadge(b) {
  if (b.s <= .01 || b.a <= 0) return; const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s, b.s); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'nein' || b.kind === 'neinG') {
    const gold = b.kind === 'neinG'; c.shadowColor = gold ? 'rgba(255,210,60,.9)' : 'rgba(0,0,0,.45)'; c.shadowBlur = gold ? 30 : 10;
    c.fillStyle = 'rgba(25,25,35,.88)'; c.beginPath(); c.roundRect(-20, -38, 150, 76, 38); c.fill(); c.shadowBlur = 0;
    const g = c.createRadialGradient(-50, -14, 6, -50, 0, 48); if (gold) { g.addColorStop(0, '#fff3a0'); g.addColorStop(1, '#e0a010'); } else { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#c8101e'); }
    c.fillStyle = g; c.beginPath(); c.arc(-46, 0, 48, 0, 7); c.fill(); c.lineWidth = 5; c.strokeStyle = '#fff'; c.stroke();
    c.fillStyle = '#fff'; c.font = `700 30px ${FONT}`; c.fillText('NEIN', -46, 2); c.font = `700 56px ${FONT}`; c.fillText(b.text, 70, 4);
  } else if (b.kind === 'ja') {
    c.font = `700 64px ${FONT}`; const w = c.measureText(b.text).width + 60; c.shadowColor = 'rgba(80,255,150,.9)'; c.shadowBlur = 30; c.fillStyle = '#22c46a'; c.beginPath(); c.roundRect(-w / 2, -46, w, 92, 46); c.fill(); c.shadowBlur = 0; c.lineWidth = 6; c.strokeStyle = '#fff'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 4);
  } else if (b.kind === 'big' || b.kind === 'red') {
    c.font = `700 104px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > W * .86) { const k = W * .86 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0);
  } else if (b.kind === 'tag') {
    c.font = `700 48px ${FONT}`; const w = c.measureText(b.text).width + 56; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#ffd23f'; c.fillText(b.text, 0, 3);
  } else if (b.kind === 'ask') {
    c.font = `700 90px ${FONT}`; c.lineWidth = 16; c.strokeStyle = '#1d2238'; c.strokeText(b.text, 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text, 0, 0);
  }
  c.restore();
}
const KEY = /^(zehnmal|Nein|Ja|Neujahr|zehn|Neins|Januar|Februar|Gold|Weihnachtsessen|Silvesterabend|Käufer|Koffer|Euro|Klick|Erde|kleiner|nervigste|dreitausendmal|Hund|Keks|Silvester|elf|kreideweiß|Brandt|Juli|Spiegel|Fallen|Hausschuhen|fünf|Drei|Zwei|Eins|letztes|Bäckerei|Mitternacht|bellen|Jahres|Wunderbar|weg)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const D0 = DOOR(0), D1 = DOOR(-24);
// conversación en la puerta: comprador fuera, quien abre en el umbral
function doorScene(D, inside, T, lt) { street(); NIGHT(); put(buyer, D.x + 8, 0, D.z, -Math.PI / 2); put(inside, D.x + 2, .4, D.z, Math.PI / 2); shadowAround(V(D.x, 0, D.z), 20); }
const talk = (ch, T, a, b, f) => face(ch, { ...f, mouth: lip(T, spoken(a, b)) || f.mouth }, T);
const walkers = (T, n = 4, z0 = -20) => { for (let i = 0; i < n; i++) { const a = ads[i]; put(a, SX + (i % 2 ? 4 : -4), 0, z0 - i * 9 + T * 1.6 * (i % 2 ? 1 : -1), i % 2 ? 0 : Math.PI); applyPose(a, walkPose(T + i * .3)); face(a, { eyes: 'open', mouth: 'smile' }, T + i); } };

// 1 gancho: dron sobre la ciudad nevada, NEIN 10 sobre cada cabeza
shot(0, 'Z', null, L => { use('town'); snow.visible = true; NIGHT();
  for (let i = 0; i < 5; i++) { const a = ads[i]; put(a, (i - 2) * 4.5, .66, -40 - (i % 2) * 5 + L.T * 1.2, 0); applyPose(a, walkPose(L.T + i * .27)); face(a, { mouth: 'smile' }, L.T + i); nein(a, 10, L.lt * 2 - i * .12); }
  cm([0, 40, 20, 0, 2, -50, 52], [0, 9, -22, 0, 4, -44, 48], L.k, easeOut); shadowAround(V(0, 0, -40), 30); }, [[0, 'wind', .6], [.6, 'pop', .5], [1.0, 'pop', .5], [1.4, 'pop', .5]]);
// 2 luego todo es sí
shot(3.21, 'C', null, L => { street(); NIGHT(); const a = ads[1]; put(a, SX + 2, 0, -40, 0); kp(a, L.lt, [[0, { headX: 0 }], [.6, { headX: .35 }], [.9, { headX: -.05 }], [1.2, { headX: .35 }]]); face(a, { eyes: 'wide', mouth: 'teeth', sweat: 1 }, L.T); nein(a, 0, 1);
  onFace(a, 8, 0, 1.5, 44, L.k, 6); badge('ja', 'JA!', W * .7, H * .3, L.lt - .7); shadowAround(V(SX, 0, -40), 20); }, [[.7, 'ding_soft', .7]]);
// 3 Neujahr: fuegos y contadores que se llenan 0→10
shot(5.22, 'F', null, L => { street(); NIGHT(); fw.visible = true; fw.userData.update(L.T, SX, -40);
  for (let i = 0; i < 4; i++) { const a = ads[i + 1]; put(a, SX + (i - 1.5) * 4, 0, -36, 0); applyPose(a, { aLz: 2.6, aRz: 2.6, headX: -.3 }); face(a, { eyes: 'happy', mouth: 'grin' }, 99); nein(a, Math.min(10, Math.floor(L.lt * 6)), L.lt * 2); }
  cm([SX, 4, -18, SX, 7, -40, 52], [SX, 4.5, -22, SX, 8, -40, 50], L.k); badge('big', 'NEUJAHR', W / 2, H * .14, L.lt - .2); shadowAround(V(SX, 0, -36), 25); }, [[0, 'firework', .8], [.9, 'firework', .7], [1.6, 'cheer', .6]]);
// 4 si alguien te pregunta…
shot(7.82, 'S', null, L => { street(); NIGHT(); const a = ads[2], b = ads[3]; put(a, SX - 2, 0, -60, Math.PI / 2); put(b, SX + 2, 0, -60, -Math.PI / 2); applyPose(a, { aRx: 1.2, aRe: .6, ...idlePose(L.T) }); applyPose(b, idlePose(L.T, 2));
  talk(a, L.T, 7.82, 9.5, { mouth: 'smile', brows: .2 }); face(b, { eyes: 'open', mouth: 'flat', look: [-.6, 0] }, L.T); nein(a, 6); nein(b, 3);
  cm([SX, 5, -48, SX, 5, -60, 46], [SX, 5, -51, SX, 5, -60, 44], L.k); badge('ask', '?', W * .38, H * .26, L.lt - .3); shadowAround(V(SX, 0, -60), 20); }, [[.3, 'pop', .6]]);
// 5 …tienes que responder
shot(9.50, 'W', null, L => { street(); NIGHT(); const b = ads[3]; put(b, SX + 2, 0, -60, -Math.PI / 2 + .4); applyPose(b, { ...idlePose(L.T), aLx: .4, aRx: .4 }); face(b, { eyes: 'wide', mouth: 'teeth', sweat: 1, brows: -.5 }, L.T); nein(b, 3);
  onFace(b, 7, 0, 0, 42, L.k, 5); shadowAround(V(SX, 0, -60), 15); }, [[.2, 'gulp', .6]]);
// 6 cuando se acaban, solo sale una palabra
shot(10.62, 'Z', null, L => { street(); NIGHT(); const b = ads[4]; put(b, SX - 3, 0, -80, .2); applyPose(b, { ...idlePose(L.T), headZ: Math.sin(L.T * 12) * .04 }); face(b, { eyes: 'squint', mouth: 'teeth', sweat: 1, brows: .7 }, L.T); nein(b, 0, 1);
  onFace(b, 7, 0, 0, 42, L.k, 5.5); shadowAround(V(SX, 0, -80), 15); }, [[.4, 'tension_str', .5]]);
// 7 ¡Sí!
shot(13.36, 'C', null, L => { street(); NIGHT(); const b = ads[4]; put(b, SX - 3, 0, -80, .2); applyPose(b, { headX: .2 }); face(b, { eyes: 'wide', mouth: L.lt < .5 ? 'shout' : 'frown', brows: -.6 }, L.T); nein(b, 0);
  const h = hp(b); cam([h.x + .8, h.y + .6, h.z + 6.5], [h.x, h.y + .5, h.z], 42 * punch(L.lt, .02, .25)); badge('ja', 'JA!', W / 2, H * .22, L.lt * 1.5); shadowAround(V(SX, 0, -80), 15); }, [[0, 'impact', .7]]);
// 8 y lo que dices, lo haces: palear la nieve del vecino a regañadientes
shot(14.82, 'R', null, L => { street(); NIGHT(); const b = ads[4]; put(b, SX - 9, 0, 6, Math.PI / 2); const s = Math.sin(L.T * 5);
  applyPose(b, { lean: .5 + s * .2, aLx: 1.2 + s * .3, aRx: .9 + s * .3, aLe: .6, aRe: .4, crouch: .3, lLx: .3, lLk: .5 }); face(b, { eyes: 'half', mouth: 'frown', brows: -.6 }, L.T); nein(b, 0);
  shovel.visible = true; shovel.position.copy(b.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(1.2, -2.3, 0)); shovel.rotation.set(0, 0, -.6 + s * .2);
  cm([SX - 1, 5.5, 13, SX - 9, 3.5, 6, 46], [SX - 2, 5.5, 12, SX - 9, 3.5, 6, 44], L.k); shadowAround(V(SX - 9, 0, 6), 15); }, [[.1, 'shovel', .7], [.7, 'shovel', .7], [1.3, 'sigh', .5]]);
// 9 los niños gastan sus neins en enero
shot(16.66, 'S', null, L => { street(); NIGHT(); calG.visible = false; calG.position.set(SX, 12, -30); calG.scale.setScalar(1.2); cal.pages.forEach(p => { p.position.set(0, .2, .62); p.rotation.set(0, 0, 0); });
  kids.forEach((c, i) => { put(c, SX + (i - 1.5) * 3.2, 0, -26, 0); applyPose(c, { aLz: .6, aRz: .6, headY: Math.sin(L.T * 9 + i) * .5 }); face(c, { eyes: 'squint', mouth: 'shout', brows: .7 }, L.T + i); nein(c, Math.max(0, 10 - Math.floor(L.lt * 5 + i)), 1); });
  cm([SX, 4, -12, SX, 4, -26, 50], [SX, 4.2, -15, SX, 4.2, -26, 48], L.k); badge('big', 'JANUAR', W / 2, H * .12, L.lt - .1); shadowAround(V(SX, 0, -26), 20); }, [[0, 'kids_laugh', .5], [.5, 'pop', .5], [1.0, 'pop', .5]]);
// 10 Kein Baden
shot(18.38, 'W', null, L => { use('bath'); const c = kids[0]; put(c, BX + 3, 0, -1, -.4); applyPose(c, { aLx: 1.3, aRx: 1.3, aLe: 1.9, aRe: 1.9, aLz: -.3, aRz: -.3, headY: Math.sin(L.T * 14) * .5 }); face(c, { eyes: 'squint', mouth: 'frown', brows: .9 }, L.T); nein(c, 9 - (L.lt > .3 ? 1 : 0), 1);
  bath.duck.position.y = 3.7 + Math.sin(L.T * 4) * .1; cm([BX + 5, 6, 10, BX + 1, 3, -3, 48], [BX + 4.5, 5.6, 8.5, BX + 1, 3, -3, 46], L.k); badge('red', 'NEIN!', W / 2, H * .16, L.lt - .3); }, [[.1, 'splash', .6], [.3, 'stamp', .6]]);
// 11 Kein Brokkoli
shot(19.12, 'C', null, L => { use('kit'); const c = kids[1]; put(c, KX, 1.7, -3.4, 0); const push = clamp((L.lt - .3) * 3); applyPose(c, { aLx: 1.4 * push + .2, aRx: 1.4 * push + .2, aLe: .3, aRe: .3, lean: -.15, headZ: .2 }); face(c, { eyes: 'squint', mouth: 'teeth', brows: .8 }, L.T); nein(c, 8 - (L.lt > .3 ? 1 : 0), 1, false, .6);
  kit.broc.position.z = 2.4 + push * 1.6; cm([KX + 2, 8.5, 11, KX, 5, -1, 46], [KX + 1.6, 8.2, 10, KX, 5, -1, 44], L.k); }, [[.3, 'plate_slide', .6]]);
// 12 Kein Schlafengehen: salta en la cama
shot(20.02, 'I', null, L => { use('room'); const c = kids[2], y = Math.abs(Math.sin(L.T * 5)) * 2.6; put(c, RX + 11, 4.3 + y, -4, -.5); applyPose(c, { aLz: 2.4, aRz: 2.4, lLx: y > .4 ? .6 : 0, lLk: y > .4 ? .9 : 0 }); face(c, { eyes: 'happy', mouth: 'grin' }, 99); nein(c, 6, 1);
  cm([RX + 3, 9, 8, RX + 11, 6, -4, 50], [RX + 3.6, 9, 7, RX + 11, 6, -4, 48], L.k); badge('red', 'NEIN!', W / 2, H * .14, L.lt - .2); shadowAround(V(RX, 0, -2), 20); }, [[.1, 'jump_small', .6], [.5, 'bed_creak', .6], [.7, 'kids_laugh', .4]]);
// 13 en febrero ya no les queda ninguno
shot(21.04, 'Z', null, L => { street(); NIGHT(); calG.visible = false; calG.position.set(SX + 4, 9, -38); calG.scale.setScalar(1); cal.pages.forEach((p, i) => { const t = L.lt - i * .15; p.visible = true; if (t > 0) { p.position.set(t * 6, t * 4, .62 + t * 3); p.rotation.set(-t * 2, t, t * 3); } else { p.position.set(0, .2, .62); p.rotation.set(0, 0, 0); } });
  const c = kids[3]; put(c, SX - 1, 0, -34, .2); applyPose(c, { ...idlePose(L.T), headX: .3, lean: .1 }); face(c, { eyes: 'open', mouth: 'frown', brows: -.7 }, L.T); nein(c, 0, 1);
  cm([SX - .5, 4.5, -24, SX + 1, 5, -36, 48], [SX - .5, 4.4, -26, SX + 1, 5, -36, 46], L.k); badge('big', 'FEBRUAR', W / 2, H * .12, L.lt - .6); shadowAround(V(SX, 0, -34), 15); }, [[0, 'pages', .6]]);
// 14 comen cualquier verdura
shot(22.31, 'W', null, L => { use('kit'); const c = kids[1]; put(c, KX, 1.7, -3.4, 0); const ch = Math.sin(L.T * 9); applyPose(c, { aRx: 1.4 + Math.max(0, ch) * .6, aRe: 1.4 + Math.max(0, ch) * .5, lean: .1 }); face(c, { eyes: 'squint', mouth: ch > 0 ? 'o' : 'frown', brows: -.6, sweat: 1 }, L.T); nein(c, 0, 1, false, .6);
  kit.broc.position.z = 2.4; onFace(c, 6.5, -.2, 1, 42, L.k, 5); }, [[.2, 'chew', .6], [.9, 'chew', .6], [1.6, 'gulp', .6]]);
// 15 los adultos guardan sus neins como oro
shot(24.75, 'S', null, L => { street(); NIGHT(); const a = ads[0]; put(a, SX + 2, 0, -50, -.3); applyPose(a, { aLx: 1.3, aRx: 1.3, aLe: 1.5, aRe: 1.5, lean: .15, headX: .2, ...idlePose(L.T) }); face(a, { eyes: 'squint', mouth: 'smirk', brows: .4, look: [.5, 0] }, L.T); nein(a, 10, 1, true, .6);
  onFace(a, 9, .5, 2, 46, L.k, 7); bloom.strength = .7; shadowAround(V(SX, 0, -50), 15); }, [[.1, 'sparkle', .7], [1.6, 'coins', .4]]);
// 16 en la cena de Navidad…
shot(27.15, 'Z', null, L => { use('kit'); kit.xmas.visible = true; kit.broc.visible = false;
  [[-4, -1.6, 0], [4, -1.6, 0], [-4, 4.6, Math.PI], [4, 4.6, Math.PI]].forEach(([x, z, r], i) => { const a = ads[i + 2]; put(a, KX + x, 1.4, z + 1, r); applyPose(a, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aRx: 1.1 + Math.sin(L.T * 3 + i) * .2, aRe: 1.2 }); face(a, { eyes: 'open', mouth: 'flat', look: [Math.sin(L.T * 2 + i), 0] }, L.T + i); nein(a, 10, 1, true, .4); });
  cm([KX, 13, 17, KX, 5, 0, 52], [KX, 12, 15.5, KX, 5, 0, 50], L.k); badge('tag', 'WEIHNACHTEN', W / 2, H * .12, L.lt - .1); }, [[0, 'bell_far', .5], [.4, 'porcelain', .4], [.9, 'spoon', .4]]);
// 17 …nadie pregunta nada a nadie
shot(28.35, 'R', null, L => { use('kit'); kit.xmas.visible = true; kit.broc.visible = false; const a = ads[2], b = ads[3]; put(a, KX - 4, 1.4, -.6, 0); put(b, KX + 4, 1.4, -.6, 0);
  for (const [c, l] of [[a, 1], [b, -1]]) { applyPose(c, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aRx: 1.1, aRe: 1.2, headY: l * .4 }); face(c, { eyes: 'squint', mouth: 'flat', brows: .3, look: [l * .8, 0] }, L.T); nein(c, 10, 1, true, .4); }
  cm([KX, 9, 13, KX, 5.6, -.6, 48], [KX, 8.6, 12, KX, 5.6, -.6, 46], L.k); badge('tag', '…', W / 2, H * .2, L.lt - .3); }, [[0, 'clock_tick', .5], [.8, 'clock_tick', .5], [1.4, 'cough', .4]]);
// 18 ¿por qué? porque en Nochevieja…
shot(30.40, 'F', null, L => { street(); NIGHT(); fw.visible = true; fw.userData.update(L.T, SX, -60); walkers(L.T, 3, -50);
  cm([SX + 6, 3, -10, SX, 18, -90, 54], [SX + 5, 3.4, -14, SX, 22, -90, 52], L.k); badge('big', 'SILVESTER', W / 2, H * .14, L.lt - .3); shadowAround(V(SX, 0, -40), 30); }, [[0, 'firework', .7], [.8, 'firework', .6], [1.6, 'bell_far', .5]]);
// 19 …llega el Comprador (ZOOM LENTO: sale de la niebla)
shot(32.83, 'Z', 'slow', L => { street(); NIGHT(); scene.fog.density = .012; put(buyer, SX, 0, -80 + L.lt * 2.4, 0); applyPose(buyer, walkPose(L.T, .7)); face(buyer, { mouth: 'grin', eyes: 'open' }, L.T);
  cm([SX, 3, -50, SX, 7, -80, 46], [SX, 3.4, -58, SX, 7.5, -78, 40], L.k, easeIn); shadowAround(V(SX, 0, -78), 20); }, [[0, 'steps_heavy', .5], [.6, 'heartbeat', .5]]);
// 20 sonrisa fija y maletín negro
shot(34.43, 'C', null, L => { street(); NIGHT(); put(buyer, SX, 0, -72, 0); applyPose(buyer, { ...idlePose(L.T), aRx: .2 }); face(buyer, { mouth: 'grin', eyes: 'open', brows: -.1 }, L.T);
  if (L.lt < 1.3) onFace(buyer, 5.5, .2, 0, 38, L.k * 2, 4.5); else { const c = buyer.props.case.getWorldPosition(V(0, 0, 0)); cam([c.x + 2.5, c.y + 1.5, c.z + 7.5], [c.x, c.y - .8, c.z], 38 * punch(L.lt, 1.3, .2)); }
  shadowAround(V(SX, 0, -72), 15); }, [[.1, 'creepy_ting', .6], [1.3, 'impact_soft', .6]]);
// 21 de puerta en puerta
shot(36.88, 'W', null, L => { street(); NIGHT(); const z = -60 - L.lt * 4; put(buyer, SX - 10, 0, z, Math.PI); applyPose(buyer, walkPose(L.T, .8)); face(buyer, { mouth: 'grin' }, L.T);
  cm([SX - 4, 6, z - 16, SX - 10, 6, z, 50], [SX - 4, 6, z - 14, SX - 10, 6, z, 48], L.k); shadowAround(V(SX - 10, 0, z), 20); }, [[0, 'steps_snow', .7]]);
// 22 llama y hace una sola pregunta
shot(38.22, 'S', null, L => { street(); NIGHT(); const D = DOOR(-72); put(buyer, D.x + 8, 0, D.z, -Math.PI / 2); const k = [.2, .5, .8].some(t => L.lt > t && L.lt < t + .12);
  applyPose(buyer, { aLx: 1.6, aLe: k ? 1.6 : 1.2, ...idlePose(L.T) }); face(buyer, { mouth: 'grin' }, L.T);
  cm([D.x + 14, 7, D.z + 8, D.x + 4, 5.5, D.z, 46], [D.x + 13.4, 7, D.z + 7, D.x + 4, 5.5, D.z, 44], L.k); shadowAround(V(D.x, 0, D.z), 15); }, [[.2, 'knock', .8], [.5, 'knock', .8], [.8, 'knock', .8]]);
// 23 "¿Me vende su casa por un euro?"
shot(39.62, 'C', null, L => { const D = DOOR(-72); street(); NIGHT(); const o = ads[5]; put(buyer, D.x + 8, 0, D.z, -Math.PI / 2); put(o, D.x + 2, .4, D.z, Math.PI / 2); HS[6].door.rotation.y = -1.4;
  applyPose(buyer, { lean: .15, headX: .1, aLx: .5, aLe: 1 }); talk(buyer, L.T, 39.62, 41.79, { mouth: 'grin' }); applyPose(o, idlePose(L.T)); face(o, { eyes: 'wide', mouth: 'o', brows: -.5 }, L.T); nein(o, 0, 1);
  onFace(buyer, 5.5, -.2, -2.6, 40, L.k, 4.6); badge('tag', '1 €', W * .72, H * .2, L.lt - .9); shadowAround(V(D.x, 0, D.z), 15); }, [[0, 'door_creak', .5], [.9, 'coin_flip', .7]]);
// 24 casi nadie tiene un nein
shot(41.79, 'W', null, L => { const D = DOOR(-72); street(); NIGHT(); const o = ads[5]; put(o, D.x + 2, .4, D.z, Math.PI / 2); HS[6].door.rotation.y = -1.4; applyPose(o, { ...idlePose(L.T), headZ: Math.sin(L.T * 20) * .03 }); face(o, { eyes: 'wide', mouth: 'teeth', sweat: 1, brows: -.7 }, L.T); nein(o, 0, 1);
  onFace(o, 5.5, 0, 1, 40, L.k, 4.5); shadowAround(V(D.x, 0, D.z), 12); }, [[.3, 'heartbeat', .6]]);
// 25 la respuesta es sí
shot(43.68, 'C', null, L => { const D = DOOR(-72); street(); NIGHT(); const o = ads[5]; put(o, D.x + 2, .4, D.z, Math.PI / 2); HS[6].door.rotation.y = -1.4; kp(o, L.lt, [[0, {}], [.9, { headX: .4 }], [1.1, { headX: 0 }]]); face(o, { eyes: 'closed', mouth: 'frown', brows: -.8 }, 99); nein(o, 0);
  const h = hp(o); cam([h.x + 4, h.y + .5, h.z + 1], [h.x, h.y + .3, h.z], 40 * punch(L.lt, .9, .2)); badge('ja', 'JA', W / 2, H * .22, L.lt - .9); shadowAround(V(D.x, 0, D.z), 12); }, [[.9, 'thump', .6]]);
// 26 clic, el maletín se cierra
shot(45.06, 'F', null, L => { street(); NIGHT(); put(buyer, SX - 2, 0, -72, -Math.PI / 2); applyPose(buyer, { aRx: .9, aRe: .8 }); const c = buyer.props.case; c.rotation.x = L.lt < .25 ? -.3 : 0;
  const w = c.getWorldPosition(V(0, 0, 0)); cam([w.x - 3, w.y + 2.4, w.z + 5], [w.x, w.y - .4, w.z], 40 * punch(L.lt, .25, .3)); grade.uniforms.vig.value = .6; shadowAround(w, 10); }, [[.25, 'briefcase', 1], [.3, 'impact', .5]]);
// 27 a la mañana siguiente…
shot(46.56, 'W', null, L => { use(...OUT); dayK(.55); grade.uniforms.lift.value = .03; walkers(L.T, 2, -30);
  cm([SX + 6, 8, 0, SX - 12, 4, -48, 50], [SX + 5, 7.5, -4, SX - 12, 4, -48, 48], L.k); shadowAround(V(SX - 10, 0, -40), 30); }, [[0, 'birds', .5], [.6, 'wind', .3]]);
// 28 …solo queda un cuadrado de tierra (ZOOM LENTO)
shot(48.07, 'Z', 'slow', L => { use(...OUT); dayK(.55); const a = ads[0]; put(a, SX - 12, 0, -46, -Math.PI / 2 - .3); applyPose(a, { ...idlePose(L.T), aLx: .3, aLe: .4 }); face(a, { eyes: 'wide', mouth: 'o', brows: -.8, look: [.5, .5] }, L.T);
  cm([SX - 2, 6, -40, SX - 20, 1, -48, 50], [SX - 6, 5, -42, SX - 20, 1, -48, 44], L.k, easeIn); badge('tag', 'WEG!', W / 2, H * .2, L.lt - .9); shadowAround(V(SX - 18, 0, -48), 20); }, [[.2, 'wind', .5]]);
// 29 por eso el pueblo es cada año más pequeño (las casas se encogen)
shot(49.83, 'R', null, L => { street(); NIGHT(); for (const i of [8, 10, 12]) { const k = clamp((L.lt - (i - 8) * .25) * 1.4); HS[i].g.scale.set(1, 1 - easeIn(k), 1); if (k >= 1) { HS[i].g.visible = false; HS[i].dirt.visible = true; } }
  cm([SX, 70, 20, SX, 0, -110, 52], [SX, 66, 10, SX, 0, -110, 50], L.k); badge('big', 'JEDES JAHR', W / 2, H * .13, L.lt - .2); shadowAround(V(SX, 0, -100), 80); }, [[.1, 'whoosh_down', .6], [.6, 'whoosh_down', .6], [1.1, 'whoosh_down', .6], [2.2, 'impact_soft', .5]]);
// 30 ¿y yo? el niño más pesado del pueblo
shot(52.52, 'C', null, L => { street(); NIGHT(); put(kid, SX + 2, 0, -30, -.2); kp(kid, L.lt, [[0, { aRz: .2 }], [.4, { aRz: 2.6, aRe: .3 }], [2.6, { aRz: 2.7, aRe: .2, headZ: .1 }]]); face(kid, { eyes: L.lt > 1.4 && L.lt < 1.6 ? 'happy' : 'open', mouth: 'grin', blush: 1 }, L.T); nein(kid, 10, L.lt * 2);
  onFace(kid, 8, .5, 1, 46, L.k, 6.5); badge('tag', 'ICH', W * .3, H * .22, L.lt - .2); shadowAround(V(SX, 0, -30), 15); }, [[0, 'pop', .6], [.4, 'whoosh_soft', .4]]);
// 31 cuando quiero algo, pregunto
shot(55.23, 'S', null, L => { use('liv'); put(mama, LX + 4, 0, -2, -.6); put(kid, LX + 1, 0, 0, .9); applyPose(mama, { ...idlePose(L.T), headY: -.3 }); face(mama, { eyes: 'half', mouth: 'flat', brows: -.3 }, L.T); nein(mama, 3, 1);
  applyPose(kid, { aRx: 1.4, aRe: .4 + Math.sin(L.T * 14) * .3, lean: .1 }); talk(kid, L.T, 55.2, 56.95, { mouth: 'grin' }); badge('ask', '?', W * .35, H * .3, L.lt - .3);
  cm([LX + 2, 6, 10, LX + 2.5, 4, -1, 46], [LX + 2, 6, 9, LX + 2.5, 4, -1, 44], L.k); }, [[.3, 'pop', .6], [.9, 'tug', .6]]);
// 32 y pregunto, y pregunto
shot(56.95, 'C', null, L => { use('liv'); put(kid, LX + 1, 0, 0, .9); applyPose(kid, { aRx: 1.4, aRe: .4 + Math.sin(L.T * 18) * .4, lean: .15, headZ: Math.sin(L.T * 8) * .1 }); talk(kid, L.T, 56.9, 58.7, { mouth: 'grin' });
  const h = hp(kid); cam([h.x + 3, h.y + .3, h.z + 3], [h.x, h.y + .2, h.z], 42 * punch(L.lt, 0, .15) * punch(L.lt, .73, .15)); badge('ask', '??', W * .7, H * .22, L.lt - .1); badge('ask', '???', W * .3, H * .3, L.lt - .8); }, [[0, 'pop', .6], [.73, 'pop', .6], [.75, 'impact_soft', .4]]);
// 33 este año le pedí a mamá…
shot(58.67, 'W', null, L => { use('liv'); put(kid, LX, 0, 1, .4); applyPose(kid, { aLx: 2.2, aRx: 2.2, aLe: .2, aRe: .2 }); face(kid, { eyes: 'wide', mouth: 'grin', blush: 1 }, L.T);
  sign.visible = true; sign.position.copy(kid.aL.hand.getWorldPosition(V(0, 0, 0)).lerp(kid.aR.hand.getWorldPosition(V(0, 0, 0)), .5)).add(V(0, 1.2, .5)); sign.rotation.y = .4; sign.scale.setScalar(spring(clamp(L.lt * 1.5)));
  cm([LX + 3, 5, 9, LX, 4.5, 1, 46], [LX + 2.4, 5, 8, LX, 4.5, 1, 44], L.k); }, [[0, 'whoosh_up', .6], [.2, 'paper', .6]]);
// 34 …tres mil veces un perro
shot(60.11, 'Z', null, L => { use('liv'); put(mama, LX + 3, 0, -2, -.4); applyPose(mama, { aLx: 1.2, aLe: 1.6, headX: .2, ...idlePose(L.T) }); face(mama, { eyes: 'half', mouth: 'frown', brows: -.6, bags: .6 }, L.T); nein(mama, 3, 1);
  put(kid, LX, 0, 1, .6); applyPose(kid, { aLx: 2.2, aRx: 2.2, aLe: .2, aRe: .2 }); face(kid, { eyes: 'happy', mouth: 'grin' }, 99); sign.visible = true; sign.position.copy(kid.aL.hand.getWorldPosition(V(0, 0, 0))).add(V(.4, 1.2, .5)); sign.rotation.y = .5;
  cm([LX + 1, 6, 11, LX + 1.6, 5, -1, 48], [LX + 1, 6, 10, LX + 1.6, 5, -1, 46], L.k); badge('big', '×3000', W / 2, H * .14, L.lt - .3); }, [[.3, 'ding_soft', .6], [1.2, 'sigh', .5]]);
// 35 el 2 de febrero ya no le quedaban
shot(61.99, 'C', null, L => { use('liv'); put(mama, LX + 3, 0, -2, -.2); applyPose(mama, { aLx: 1.4, aLe: 1.8, headX: .3, lean: .1 }); face(mama, { eyes: 'closed', mouth: 'frown', brows: -.8, bags: .8 }, 99); nein(mama, Math.max(0, 3 - Math.floor(L.lt * 1.6)), 1);
  onFace(mama, 6, .8, -1, 42, L.k, 5); badge('tag', '2. FEBRUAR', W / 2, H * .13, L.lt - .2); }, [[.0, 'pop', .5], [.62, 'pop', .5], [1.25, 'pop', .5], [1.8, 'sad_tone', .6]]);
// 36 el 3 de febrero teníamos perro
shot(64.67, 'F', null, L => { use('liv'); put(kid, LX + 1, Math.abs(Math.sin(L.T * 5)) * 1.4, 0, .3); applyPose(kid, { aLz: 2.6, aRz: 2.6 }); face(kid, { eyes: 'happy', mouth: 'grin', blush: 1 }, 99);
  const k = spring(clamp((L.lt - .3) * 1.6)); dog.root.visible = true; dog.root.position.set(LX + 4, 0, 1); dog.root.rotation.y = -1; dog.root.scale.setScalar(Math.max(.01, k)); dog.tail.rotation.y = Math.sin(L.T * 20) * .6;
  cm([LX + 3, 6, 11, LX + 2.5, 3, 0, 48], [LX + 3, 5.6, 10, LX + 2.5, 3, 0, 46], L.k); badge('tag', '3. FEBRUAR', W / 2, H * .13, L.lt - .1); }, [[.3, 'pop', .7], [.5, 'bark', .7], [.8, 'kids_laugh', .4]]);
// 37 Keks
shot(66.70, 'C', null, L => { use('liv'); dog.root.visible = true; dog.root.position.set(LX + 2, 0, 1); dog.root.rotation.y = .3; dog.root.scale.setScalar(1); dog.tail.rotation.y = Math.sin(L.T * 22) * .7; dog.head.rotation.x = Math.sin(L.T * 9) * .12; dog.tongue.visible = true;
  const h = dog.head.getWorldPosition(V(0, 0, 0)); cam([h.x + 1.5, h.y + .6, h.z + 4.5], [h.x, h.y, h.z], 40 * punch(L.lt, .02, .2)); badge('big', 'KEKS', W / 2, H * .2, L.lt - .1); }, [[0, 'bark', .9]]);
// 38 luego llegó Nochevieja
shot(67.29, 'R', null, L => { street(); NIGHT(); fw.visible = true; fw.userData.update(L.T, SX, -40); walkers(L.T, 4, -30);
  cm([SX - 6, 4, 4, SX, 20, -100, 54], [SX - 5, 4.5, 0, SX, 24, -100, 52], L.k); badge('tag', '31. DEZEMBER', W / 2, H * .13, L.lt - .1); shadowAround(V(SX, 0, -30), 30); }, [[0, 'firework', .7], [.6, 'firework', .6]]);
// 39 a las once miré por la ventana
shot(68.56, 'S', null, L => { use('liv'); put(kid, LX - 6, 0, -8.4, Math.PI); applyPose(kid, { aLx: 2.0, aRx: 2.0, aLe: .6, aRe: .6, lean: .1 }); badge('tag', '23:00', W * .74, H * .13, L.lt - .1);
  cm([LX - 4, 4.6, -1, LX - 6, 5, -9, 50], [LX - 4.4, 4.6, -2.4, LX - 6, 5.2, -9, 48], L.k); }, [[0, 'clock_tick', .5], [.6, 'wood_creak', .4]]);
// 40 y ahí estaba (ZOOM LENTO por la ventana)
shot(70.33, 'Z', 'slow', L => { street(); NIGHT(); put(buyer, SX, 0, -40 + L.lt * 3, 0); applyPose(buyer, walkPose(L.T, .7)); face(buyer, { mouth: 'grin' }, L.T);
  cm([SX - 15, 7, 2, SX, 6, -38, 44], [SX - 13, 7, -2, SX, 6.5, -37, 36], L.k, easeIn); shadowAround(V(SX, 0, -38), 20); }, [[.2, 'steps_heavy', .5]]);
// 41 mamá lo vio y se puso blanca
shot(72.03, 'C', null, L => { use('liv'); put(mama, LX - 3, 0, -6, Math.PI * .85); applyPose(mama, { aLx: 1.6, aLe: 2, aRx: .3, headX: -.05 }); face(mama, { eyes: 'wide', mouth: 'o', brows: -.9, sweat: 1 }, L.T); mama.faceMat.color.setRGB(1, 1, 1);
  onFace(mama, 5.5, .2, 1, 40, L.k, 4.5); grade.uniforms.sat.value = lerp(1.25, .5, clamp(L.lt)); }, [[.1, 'gasp_f', .7], [.2, 'impact_soft', .5]]);
// 42 no le quedaba ni un nein
shot(73.64, 'W', null, L => { use('liv'); put(mama, LX - 3, 0, -6, Math.PI * .85); applyPose(mama, { aLx: 1.6, aLe: 2, ...idlePose(L.T) }); face(mama, { eyes: 'wide', mouth: 'teeth', brows: -.9, sweat: 1 }, L.T); nein(mama, 0, 1);
  const h = hp(mama); cm([h.x + 1, h.y + 4, h.z + 5, h.x, h.y + 1.8, h.z, 44], [h.x + 1, h.y + 3.4, h.z + 4.2, h.x, h.y + 1.8, h.z, 40], L.k); grade.uniforms.sat.value = .7; }, [[.2, 'alarm_soft', .5]]);
// 43 por mi culpa
shot(75.65, 'C', null, L => { use('liv'); put(kid, LX, 0, 0, .3); applyPose(kid, { headX: .4, aLx: .3, aRx: .3, aLe: .6, aRe: .6 }); face(kid, { eyes: 'open', mouth: 'frown', brows: -.8, look: [0, .6] }, L.T); onFace(kid, 5, .6, 0, 40, L.k, 4.4); }, [[.1, 'sad_tone', .5]]);
// 44 primero fue a casa del vecino
shot(76.32, 'S', null, L => { street(); NIGHT(); const z = lerp(-8, -20, easeInOut(L.k)); put(buyer, SX - 8, 0, z, -Math.PI * .8); applyPose(buyer, walkPose(L.T, .7)); face(buyer, { mouth: 'grin' }, L.T);
  cm([SX + 2, 5, 6, SX - 12, 5, -18, 48], [SX + 1, 5, 4, SX - 12, 5, -20, 46], L.k); shadowAround(V(SX - 10, 0, -15), 20); }, [[0, 'steps_snow', .6]]);
// 45 Herr Brandt guardó un nein todo el año (contador dorado)
shot(78.08, 'Z', null, L => { doorScene(D1, brandt, L.T, L.lt); HS[2].door.rotation.y = -1.4; buyer.root.visible = false; applyPose(brandt, { ...idlePose(L.T), aLx: .4, aRx: .4, lean: -.05 }); face(brandt, { eyes: 'squint', mouth: 'smirk', brows: .5 }, L.T); nein(brandt, 1, L.lt * 2, true);
  onFace(brandt, 7, .6, -2, 44, L.k, 5.5); bloom.strength = .7; }, [[.2, 'sparkle', .7], [1.4, 'coins', .4]]);
// 46 desde julio lo ensayaba frente al espejo
shot(81.06, 'W', null, L => { use('bath'); put(brandt, BX + 8, 0, -6.4, Math.PI); const s = Math.sin(L.T * 6); applyPose(brandt, { aRx: 1.2 + s * .2, aRe: .3, lean: .1 + s * .05 }); talk(brandt, L.T, 81.0, 83.1, { mouth: 'shout', brows: .8 });
  { const h = hp(brandt); cm([h.x - 2.2, h.y + .6, h.z - 3.6, h.x, h.y + .4, h.z, 46], [h.x - 1.9, h.y + .6, h.z - 3.2, h.x, h.y + .4, h.z, 44], L.k); } badge('tag', 'JULI', W * .25, H * .12, L.lt - .1); badge('red', 'NEIN!', W * .62, H * .3, (L.lt % .7) * 2); }, [[.1, 'shout_m', .4], [.8, 'shout_m', .4], [1.5, 'shout_m', .4]]);
// 47 el Comprador sonrió: "¿Se negaría…"
shot(83.10, 'C', null, L => { doorScene(D1, brandt, L.T, L.lt); HS[2].door.rotation.y = -1.4; applyPose(buyer, { lean: .1, headX: .15, ...idlePose(L.T) }); talk(buyer, L.T, 83.1, 86.37, { mouth: 'grin', brows: -.2 }); applyPose(brandt, idlePose(L.T)); face(brandt, { eyes: 'squint', mouth: 'flat', brows: .6 }, L.T); nein(brandt, 1, 1, true);
  onFace(buyer, 6, -.6, -2, 40, L.k, 5); }, [[0, 'creepy_ting', .5]]);
// 48 …a venderme su casa?
shot(84.62, 'S', null, L => { doorScene(D1, brandt, L.T, L.lt); HS[2].door.rotation.y = -1.4; applyPose(buyer, { lean: .2, headX: .2 }); talk(buyer, L.T, 83.1, 86.37, { mouth: 'grin' }); applyPose(brandt, idlePose(L.T)); face(brandt, { eyes: 'squint', mouth: 'smirk', brows: .6 }, L.T); nein(brandt, 1, 1, true);
  const h = hp(brandt); cam([h.x + 8.6, h.y + 3, h.z - 2], [h.x, h.y + .3, h.z], 44); }, [[.4, 'tension_str', .4]]);
// 49 "¡NEIN!" gritó Brandt
shot(86.37, 'C', null, L => { doorScene(D1, brandt, L.T, L.lt); HS[2].door.rotation.y = -1.4; applyPose(brandt, { aRx: 1.6, aRe: .1, lean: .25 }); face(brandt, { eyes: 'squint', mouth: 'shout', brows: 1, veins: 1 }, L.T); nein(brandt, L.lt > .3 ? 0 : 1, 1, true);
  onFace(brandt, 5, .3, 2.4, 40 * punch(L.lt, .02, .25), 0); badge('red', 'NEIN!', W / 2, H * .2, L.lt * 1.6); }, [[0, 'impact', .7], [.05, 'shout_m', .6]]);
// 50 entonces se quedó helado (ZOOM LENTO)
shot(87.81, 'Z', 'slow', L => { doorScene(D1, brandt, L.T, L.lt); HS[2].door.rotation.y = -1.4; applyPose(brandt, { aRx: 1.6, aRe: .1, lean: .25 }); face(brandt, { eyes: 'wide', mouth: 'o', brows: -.9, sweat: 1 }, 99); nein(brandt, 0, 1, true);
  onFace(brandt, 5.5, .3, 2.2, 40, L.k, 3.6); }, []);
// 51 "Maravilloso", dijo el Comprador
shot(89.06, 'C', null, L => { doorScene(D1, brandt, L.T, L.lt); HS[2].door.rotation.y = -1.4; applyPose(buyer, { headZ: .1, ...idlePose(L.T) }); talk(buyer, L.T, 89.0, 90.7, { mouth: 'grin', eyes: 'happy' });
  onFace(buyer, 5, -.3, 1.5, 38, L.k, 4.4); badge('tag', 'WUNDERBAR', W / 2, H * .16, L.lt - .2); }, [[.1, 'evil_laugh', .4]]);
// 52 clic: sus preguntas eran trampas
shot(90.75, 'F', null, L => { doorScene(D1, brandt, L.T, L.lt); const c = buyer.props.case; c.rotation.x = L.lt < .2 ? -.3 : 0; applyPose(buyer, { aRx: .9, aRe: .8 });
  const w = c.getWorldPosition(V(0, 0, 0)); cam([w.x - 4.5, w.y + 2.2, w.z + 3.8], [w.x, w.y - .5, w.z], 40 * punch(L.lt, .2, .3)); badge('red', 'FALLE!', W / 2, H * .2, L.lt - .7); grade.uniforms.vig.value = .6; }, [[.2, 'briefcase', 1], [.7, 'braam_short', .7]]);
// 53 ni un nein te salvaba: la casa de Brandt desaparece detrás de él
shot(92.85, 'R', null, L => { street(); NIGHT(); const k = clamp((L.lt - .2) / 1.2); HS[2].g.scale.set(1, 1 - easeIn(k), 1); if (k >= 1) { HS[2].g.visible = false; HS[2].dirt.visible = true; }
  put(brandt, D1.x + 2.4, 0, D1.z, Math.PI / 2 + .6); applyPose(brandt, { aLz: .3, aRz: .3, headY: -.6 }); face(brandt, { eyes: 'wide', mouth: 'o', brows: -.9 }, L.T); nein(brandt, 0, 1, true);
  cm([D1.x + 16, 6, D1.z + 8, D1.x - 4, 5, D1.z, 48], [D1.x + 15, 6, D1.z + 6, D1.x - 4, 5, D1.z, 46], L.k); shadowAround(V(D1.x, 0, D1.z), 20); }, [[.2, 'whoosh_down', .8], [1.4, 'thump', .6]]);
// 54 Brandt se quedó ahí
shot(94.68, 'W', null, L => { street(); NIGHT(); HS[2].g.visible = false; HS[2].dirt.visible = true; put(brandt, D1.x - 4, .1, D1.z, Math.PI / 2); applyPose(brandt, { ...idlePose(L.T), headX: .3, aLz: .1, aRz: .1 }); face(brandt, { eyes: 'half', mouth: 'frown', brows: -.8 }, L.T);
  cm([D1.x + 18, 10, D1.z + 10, D1.x - 4, 2, D1.z, 46], [D1.x + 16, 9, D1.z + 9, D1.x - 4, 2, D1.z, 44], L.k); shadowAround(V(D1.x - 4, 0, D1.z), 20); }, [[0, 'wind', .6]]);
// 55 en la nieve, en zapatillas
shot(96.30, 'C', null, L => { street(); NIGHT(); HS[2].g.visible = false; HS[2].dirt.visible = true; put(brandt, D1.x - 4, .1, D1.z, Math.PI / 2); applyPose(brandt, { lLx: Math.sin(L.T * 6) * .15, lRx: -Math.sin(L.T * 6) * .15 });
  const f = brandt.lR.kn.getWorldPosition(V(0, 0, 0)); cam([f.x + 3, .9, f.z + 1.4], [f.x, .35, f.z], 44); badge('tag', 'HAUSSCHUHE', W / 2, H * .2, L.lt - .7); }, [[.1, 'shiver', .6], [.7, 'pop', .4]]);
// 56 luego vino a nuestra casa
shot(97.66, 'S', null, L => { street(); NIGHT(); const x = lerp(SX - 4, D0.x + 5, easeInOut(L.k)); put(buyer, x, 0, -2, -Math.PI / 2); applyPose(buyer, walkPose(L.T, .7)); face(buyer, { mouth: 'grin' }, L.T);
  cm([D0.x + 1, 5, 5, x, 7, -2, 46], [D0.x + 1.4, 5, 4.5, x, 7, -2, 44], L.k); shadowAround(V(D0.x, 0, 0), 20); }, [[0, 'steps_snow', .7], [.6, 'heartbeat', .5]]);
// 57 mamá me tomó la mano
shot(99.27, 'C', null, L => { use('liv'); put(mama, LX + 1.4, 0, -1, .1); put(kid, LX - .8, 0, -1, .1); const k = clamp(L.lt * 2); applyPose(mama, { aRx: .4 * k, aRz: -.25 * k, aRe: .2 }); applyPose(kid, { aLx: .3 * k, aLz: -.2 * k });
  const a = mama.aR.hand.getWorldPosition(V(0, 0, 0)); cam([a.x - 1, a.y + 1.4, a.z + 4.2], [a.x - 1, a.y, a.z], 44); }, [[.2, 'cloth', .5], [.5, 'heartbeat', .5]]);
// 58 temblaba
shot(100.50, 'W', null, L => { use('liv'); put(mama, LX + 1.4, 0, -1, .1); applyPose(mama, { aRx: .4, aRz: -.25, headZ: Math.sin(L.T * 40) * .03, sx: Math.sin(L.T * 45) * .03 }); face(mama, { eyes: 'wide', mouth: 'teeth', brows: -.9, sweat: 1 }, L.T);
  onFace(mama, 5, .3, 1, 40, L.k, 4.4); }, [[.1, 'shiver', .6]]);
// 59 y justo ahí me di cuenta de algo (ZOOM LENTO)
shot(101.25, 'Z', 'slow', L => { use('liv'); put(kid, LX - .8, 0, -1, .1); applyPose(kid, { headX: -.1 }); face(kid, { eyes: L.lt > 1.3 ? 'wide' : 'open', mouth: L.lt > 1.3 ? 'o' : 'flat', brows: L.lt > 1.3 ? -.4 : .2, look: [.3, -.3] }, L.T);
  onFace(kid, 6, .3, 0, 40, L.k, 3.6); }, []);
// 60 nadie le había hecho nunca una pregunta (recuerdo sepia: todos solo contestan)
shot(102.97, 'S', null, L => { street(); NIGHT(); grade.uniforms.sepia.value = .8; const D = DOOR(-48 - 0); put(buyer, DOOR(-72).x + 8, 0, -72, -Math.PI / 2); put(ads[5], DOOR(-72).x + 2, .4, -72, Math.PI / 2); HS[6].door.rotation.y = -1.4;
  talk(buyer, L.T, 102, 102.9, { mouth: 'grin' }); applyPose(ads[5], { headX: Math.max(0, Math.sin(L.T * 4)) * .4 }); face(ads[5], { eyes: 'closed', mouth: 'frown' }, 99);
  cm([DOOR(-72).x + 14, 7, -62, DOOR(-72).x + 5, 5.5, -72, 48], [DOOR(-72).x + 13, 7, -64, DOOR(-72).x + 5, 5.5, -72, 46], L.k); badge('tag', 'NIE GEFRAGT', W / 2, H * .14, L.lt - .3); shadowAround(V(SX - 15, 0, -72), 15); }, [[0, 'film_roll', .4], [.8, 'knock', .5]]);
// 61 ni una sola vez
shot(105.85, 'C', null, L => { street(); NIGHT(); grade.uniforms.sepia.value = .8; put(buyer, SX, 0, -60, 0); applyPose(buyer, idlePose(L.T)); face(buyer, { mouth: 'grin' }, L.T);
  onFace(buyer, 9, 1, 0, 46, L.k, 8); badge('red', 'KEIN MAL', W / 2, H * .15, L.lt - .2); shadowAround(V(SX, 0, -60), 15); }, [[.2, 'thump', .6]]);
// 62 o sea que tenía los diez neins
shot(107.31, 'Z', null, L => { doorScene(D0, kid, L.T, L.lt); kid.root.visible = false; applyPose(buyer, idlePose(L.T)); face(buyer, { mouth: 'grin' }, L.T); nein(buyer, 10, (L.lt - .3) * 1.5);
  onFace(buyer, 5.5, 1.2, -1.5, 44, L.k, 4.6); bloom.strength = .7; }, [[.3, 'ding_reveal', .8], [.4, 'riser_short', .4]]);
// 63 y yo soy el niño más pesado del pueblo
shot(109.49, 'C', null, L => { use('liv'); put(kid, LX - .8, 0, -1, .3); applyPose(kid, { ...idlePose(L.T), aLx: .4, aLe: 1.6 }); face(kid, { eyes: 'squint', mouth: 'smirk', brows: .7 }, L.T); nein(kid, 10, 1);
  onFace(kid, 5.5, .2, 1, 40, L.k, 4.6); }, [[.1, 'whoosh_soft', .4], [1.0, 'ding_soft', .5]]);
// 64 abrí la puerta…
shot(111.80, 'W', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5 * easeOut(clamp(L.lt * 1.5)); applyPose(buyer, { aLx: 1.5, aLe: 1.3 }); face(buyer, { mouth: 'grin' }, L.T); applyPose(kid, { aRx: 1.2, aRe: .4 }); face(kid, { eyes: 'squint', mouth: 'smirk', brows: .7 }, L.T);
  cm([D0.x + 12, 7.5, 3, D0.x + 1, 4.2, 0, 48], [D0.x + 11, 7.2, 2.6, D0.x + 1, 4.2, 0, 46], L.k); }, [[0, 'door_open', .8]]);
// 65 …antes de que pudiera llamar, y pregunté
shot(113.24, 'C', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, { aLx: 1.5, aLe: 1.3, lean: -.1 }); face(buyer, { eyes: 'wide', mouth: 'o', brows: -.3 }, L.T); nein(buyer, 10, 1); applyPose(kid, idlePose(L.T));
  onFace(buyer, 5, -.6, -1.8, 40, L.k, 4.4); }, [[.1, 'impact_soft', .5]]);
// 66 "¿Dejará nuestra casa en paz?"
shot(115.11, 'S', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(kid, { lean: .1, aLx: .3, ...idlePose(L.T) }); talk(kid, L.T, 115.1, 116.46, { mouth: 'flat', brows: .7 }); face;
  onFace(kid, 5, 1.2, 1.5, 40, L.k, 4.4); }, [[.1, 'pop', .4]]);
// 67 su sonrisa se torció
shot(116.46, 'C', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, idlePose(L.T)); face(buyer, { mouth: L.lt % .3 < .15 ? 'grin' : 'smirk', brows: .2 }, 99); nein(buyer, 10, 1); onFace(buyer, 4.5, -.4, 0, 36, L.k, 3.8); }, [[.2, 'glitch', .5]]);
// 68 "Nein." — "¿Dejará nuestra casa en paz?"
shot(117.53, 'W', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, idlePose(L.T)); talk(buyer, L.T, 117.5, 118, { mouth: 'smirk' }); nein(buyer, L.lt > .2 ? 9 : 10, 1);
  onFace(buyer, 5.2, -.4, -2, 42, L.k, 4.6); }, [[.2, 'tick_down', .7]]);
// 69 "Nein." quiso mirar a mamá por encima de mí
shot(119.30, 'S', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; put(mama, D0.x + 1, .4, 2.6, Math.PI / 2); applyPose(mama, idlePose(L.T)); face(mama, { eyes: 'wide', mouth: 'o', brows: -.8 }, L.T);
  applyPose(buyer, { lean: .2, headY: -.4, ...idlePose(L.T) }); face(buyer, { mouth: 'smirk', look: [.8, 0] }, L.T); nein(buyer, L.lt > .1 ? 8 : 9, 1); applyPose(kid, { aLz: .9, aRz: .9 });
  cm([D0.x + 14, 7.5, -5, D0.x + 3, 5, .8, 48], [D0.x + 13, 7.5, -4.5, D0.x + 3, 5, .8, 46], L.k); }, [[.1, 'tick_down', .7], [.9, 'whoosh_soft', .4]]);
// 70 pero yo había preguntado primero
shot(121.72, 'C', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(kid, { aLz: 1.3, aRz: 1.3, aLe: .2, aRe: .2, lean: .05 }); face(kid, { eyes: 'squint', mouth: 'flat', brows: .9 }, L.T); onFace(kid, 4.8, .8, -1, 40, L.k, 4.2); }, [[.1, 'stamp', .5]]);
// 71 "¿Dejará nuestra casa en paz?"
shot(123.37, 'W', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(kid, { lean: .15 }); talk(kid, L.T, 123.3, 124.75, { mouth: 'flat', brows: .9 }); onFace(kid, 4.4, 1, 1.2, 38, L.k, 3.8); }, [[.1, 'pop', .4]]);
// 72 "Nein." Quedan cinco
shot(124.75, 'C', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, idlePose(L.T)); face(buyer, { mouth: 'flat', brows: .3 }, L.T); nein(buyer, Math.max(5, 7 - Math.floor(L.lt * 3)), 1);
  onFace(buyer, 5.2, -.2, -1.6, 40, L.k, 4.6); badge('big', 'NOCH 5', W / 2, H * .14, L.lt - .7); }, [[.05, 'tick_down', .7], [.4, 'tick_down', .7], [.75, 'tick_down', .7]]);
// 73 seguí. Tres.
shot(126.08, 'S', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(kid, { lean: .15, aRx: .6 }); talk(kid, L.T, 126.0, 127.5, { mouth: 'flat', brows: .9 }); nein(buyer, L.lt > .7 ? 3 : 4, 1);
  cm([D0.x + .9, 4.6, 1.6, D0.x + 8, 6.6, 0, 46], [D0.x + 1.1, 4.6, 1.4, D0.x + 8, 6.6, 0, 44], L.k); }, [[.4, 'tick_down', .7], [.75, 'tick_down', .7]]);
// 74 su sonrisa desapareció
shot(127.50, 'C', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, idlePose(L.T)); face(buyer, { mouth: 'frown', brows: .9, eyes: 'squint' }, L.T); nein(buyer, 3, 1); onFace(buyer, 4.5, -.3, 0, 36, L.k, 3.8); }, [[.1, 'impact_soft', .5]]);
// 75 Dos. Sudaba…
shot(128.60, 'W', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, { ...idlePose(L.T), headZ: Math.sin(L.T * 20) * .02 }); face(buyer, { mouth: 'teeth', brows: .9, eyes: 'squint', sweat: 1 }, L.T); nein(buyer, 2, 1);
  onFace(buyer, 5, .4, 1.5, 38, L.k, 4.2); badge('big', '2', W * .78, H * .25, L.lt); }, [[0, 'tick_down', .8], [.5, 'heartbeat', .6]]);
// 76 …en plena nieve. Uno.
shot(129.98, 'C', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, { ...idlePose(L.T), headZ: Math.sin(L.T * 24) * .03 }); face(buyer, { mouth: 'teeth', brows: 1, eyes: 'squint', sweat: 1 }, L.T); nein(buyer, L.lt > .9 ? 1 : 2, 1);
  cm([D0.x + 3.5, 7, 3, D0.x + 8, 6.6, 0, 44], [D0.x + 4, 7, 2.6, D0.x + 8, 6.6, 0, 42], L.k); }, [[.9, 'tick_down', .8], [1.0, 'heartbeat', .6]]);
// 77 "Nein", susurró
shot(131.62, 'S', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, { headX: .2 }); face(buyer, { mouth: 'o', brows: -.4, eyes: 'half', sweat: 1 }, L.T); nein(buyer, L.lt > .2 ? 0 : 1, 1);
  onFace(buyer, 4, -.2, -1, 34, L.k, 3.5); }, [[.2, 'tick_down', .7], [.25, 'whisper', .5]]);
// 78 Su último. "¿Dejará…?" (ZOOM LENTO al niño)
shot(132.93, 'Z', 'slow', L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(kid, { lean: .2 }); talk(kid, L.T, 133.6, 135.5, { mouth: 'flat', brows: 1 }); onFace(kid, 6, 1, 0, 40, L.k, 3.4); }, []);
// 79 su boca luchaba (ZOOM LENTO)
shot(135.53, 'C', 'slow', L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, { headZ: Math.sin(L.T * 30) * .05, headX: Math.sin(L.T * 22) * .04 }); face(buyer, { mouth: L.lt % .2 < .1 ? 'teeth' : 'frown', brows: 1, eyes: 'squint', sweat: 1, veins: 1 }, 99); nein(buyer, 0, 1);
  onFace(buyer, 5, -.2, 0, 36, L.k, 3); }, [[.1, 'strain', .6]]);
// 80 "…Ja." "¿Devolverá todas las casas…
shot(137.10, 'F', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, { headX: .3 }); face(buyer, { mouth: L.lt < .5 ? 'o' : 'frown', brows: -.6, eyes: 'closed' }, 99); nein(buyer, 0, 1);
  onFace(buyer, 5, -.4, -1, 38, L.k, 4.2); badge('ja', 'JA', W / 2, H * .2, L.lt * 1.4); }, [[0, 'impact', .8], [.05, 'braam_short', .6]]);
// 81 …que se ha llevado?"
shot(138.98, 'W', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(kid, { lean: .15, aRx: .8, aRe: .5 }); talk(kid, L.T, 138, 140.4, { mouth: 'grin', brows: .7 }); onFace(kid, 4.6, .9, -1.2, 40, L.k, 4); }, [[.1, 'pop', .4]]);
// 82 "Ja." "¿Se irá de este pueblo para siempre?"
shot(140.42, 'C', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, { headX: .3, lean: -.1 }); face(buyer, { mouth: 'frown', brows: -.7, eyes: 'half' }, L.T); nein(buyer, 0, 1);
  cm([D0.x + .9, 3.4, 1.8, D0.x + 8, 7.4, 0, 44], [D0.x + 1.2, 3.5, 1.5, D0.x + 8, 7.4, 0, 42], L.k); badge('ja', 'JA', W * .7, H * .2, L.lt * 1.4); }, [[0, 'thump', .6]]);
// 83 "Ja." Abrió su maletín: sale luz
shot(142.63, 'F', null, L => { doorScene(D0, kid, L.T, L.lt); HS[0].door.rotation.y = -1.5; applyPose(buyer, { aRx: 1.2, aRe: 1.2 }); face(buyer, { mouth: 'frown', eyes: 'closed' }, 99); const c = buyer.props.case; c.rotation.x = -easeOut(clamp((L.lt - .4) * 2)) * .8;
  const w = c.getWorldPosition(V(0, 0, 0)); cam([w.x - 3, w.y + 1, w.z + 2], [w.x, w.y - .5, w.z], 40); grade.uniforms.flash.value = clamp((L.lt - .6) * 2) * .3; bloom.strength = .8; }, [[.4, 'briefcase', .8], [.6, 'sunrise_shine', .7]]);
// 84 por toda la calle volvían las casas
shot(144.93, 'Z', null, L => { street(); NIGHT(); for (const [j, i] of [4, 8, 10, 12, 6].entries()) { const k = clamp((L.lt - j * .35) * 2); HS[i].g.visible = k > 0; HS[i].dirt.visible = k <= 0; HS[i].g.scale.set(1, Math.max(.01, spring(k)), 1); }
  HS[2].g.visible = false; HS[2].dirt.visible = true; cm([SX, 46, 30, SX, 0, -70, 52], [SX, 42, 22, SX, 0, -70, 50], L.k); shadowAround(V(SX, 0, -60), 70); }, [[0, 'house_pop', .7], [.35, 'house_pop', .7], [.7, 'house_pop', .7], [1.05, 'house_pop', .7], [1.4, 'house_pop', .7], [.5, 'cheer', .4]]);
// 85 la de Brandt aterrizó justo a su alrededor
shot(147.35, 'W', null, L => { street(); NIGHT(); const k = clamp((L.lt - .5) * 1.8); HS[2].g.visible = k > 0; HS[2].dirt.visible = k <= 0; HS[2].g.scale.set(1, Math.max(.01, spring(k)), 1);
  put(brandt, D1.x + 1.4, .4, D1.z, Math.PI / 2); applyPose(brandt, { aLz: 1.2 * k, aRz: 1.2 * k }); face(brandt, { eyes: k > .5 ? 'happy' : 'wide', mouth: k > .5 ? 'grin' : 'o', brows: -.3 }, 99);
  cm([D1.x + 16, 8, D1.z + 9, D1.x - 2, 6, D1.z, 50], [D1.x + 15, 8, D1.z + 8, D1.x - 2, 6, D1.z, 48], L.k); shadowAround(V(D1.x, 0, D1.z), 20); }, [[.5, 'house_pop', .9], [.7, 'laugh_old', .5]]);
// 86 luego la panadería
shot(149.74, 'S', null, L => { street(); NIGHT(); const k = clamp((L.lt - .1) * 2); HS[5].g.visible = k > 0; HS[5].dirt.visible = k <= 0; HS[5].g.scale.set(1, Math.max(.01, spring(k)), 1);
  put(ads[3], SX + 9, 0, -46, Math.PI / 2 + .4); applyPose(ads[3], { aLz: 2.4 * k, aRz: 2.4 * k }); face(ads[3], { eyes: 'happy', mouth: 'grin' }, 99);
  cm([SX - 6, 6, -40, SX + 18, 7, -48, 48], [SX - 5, 6, -42, SX + 18, 7, -48, 46], L.k); shadowAround(V(SX + 15, 0, -48), 20); }, [[.1, 'house_pop', .8], [.4, 'bell_far', .5]]);
// 87 luego un bloque entero, desaparecido antes de que yo naciera
shot(151.69, 'Z', null, L => { street(); NIGHT(); for (const [j, i] of [7, 9, 11].entries()) { const k = clamp((L.lt - j * .3) * 2); HS[i].g.visible = k > 0; HS[i].dirt.visible = k <= 0; HS[i].g.scale.set(1, Math.max(.01, spring(k)), 1); }
  HS[5].g.visible = true; HS[5].dirt.visible = false; cm([SX - 6, 20, -50, SX + 22, 5, -110, 50], [SX - 5, 18, -56, SX + 22, 5, -110, 48], L.k); shadowAround(V(SX + 20, 0, -100), 40); }, [[0, 'house_pop', .7], [.3, 'house_pop', .7], [.6, 'house_pop', .7], [1.0, 'choir', .4]]);
// 88 el Comprador se alejó en la nieve
shot(153.28, 'W', null, L => { street(); NIGHT(); for (const i of [2, 4, 5, 7, 9, 11]) { HS[i].g.visible = true; HS[i].dirt.visible = false; } const z = -10 - L.lt * 3; put(buyer, SX, 0, z, Math.PI); applyPose(buyer, walkPose(L.T, .6, .3)); scene.fog.density = .008;
  cm([SX + 1, 5, z + 12, SX, 6, z - 10, 48], [SX + 1, 5, z + 11, SX, 6, z - 10, 46], L.k); shadowAround(V(SX, 0, z), 20); }, [[0, 'steps_snow', .6], [.8, 'wind', .5]]);
// 89 nadie volvió a verlo
shot(154.93, 'S', null, L => { street(); NIGHT(); for (const i of [2, 4, 5, 7, 9, 11]) { HS[i].g.visible = true; HS[i].dirt.visible = false; } scene.fog.density = .02 * clamp(.4 + L.k);
  const z = -20 - L.lt * 4; put(buyer, SX, 0, z, Math.PI); applyPose(buyer, walkPose(L.T, .6)); buyer.root.scale.setScalar(1.32 * (1 - clamp(L.k * 1.2))); cm([SX, 4, -8, SX, 6, -40, 50], [SX, 4, -10, SX, 6, -40, 48], L.k); }, [[.2, 'wind', .7]]);
// 90 el reloj dio la medianoche
shot(156.62, 'F', null, L => { use('town', 'tower'); snow.visible = true; NIGHT(); fw.visible = L.lt > .5; fw.userData.update(L.T, 0, -380); tower.minH.rotation.z = L.lt > .3 ? -Math.PI * 2 : -Math.PI * 2 * (59 / 60); tower.hourH.rotation.z = -Math.PI * 2;
  cm([0, 60, -360, 0, 88, -411, 34], [0, 64, -366, 0, 88, -411, 30], L.k); badge('big', '00:00', W / 2, H * .14, L.lt - .3); shadowAround(V(0, 0, -400), 60); }, [[.3, 'bell_big', 1], [.6, 'firework', .7], [1.2, 'firework', .6]]);
// 91 mamá me abrazó fuerte
shot(158.44, 'C', null, L => { use('liv'); put(mama, LX + .6, 0, -.8, -.3); put(kid, LX + .4, 0, .6, Math.PI - .3); const k = easeOut(clamp(L.lt * 2)); applyPose(mama, { aLx: 1.4 * k, aRx: 1.4 * k, aLz: .5 * k, aRz: .5 * k, aLe: .9 * k, aRe: .9 * k, lean: .25 * k, headX: .3 }); applyPose(kid, { aLx: 1.2 * k, aRx: 1.2 * k, aLe: .6, aRe: .6 });
  face(mama, { eyes: 'happy', mouth: 'grin', blush: 1 }, 99); face(kid, { eyes: 'happy', mouth: 'grin', blush: 1 }, 99); onFace(mama, 7, .2, 2, 44, L.k, 6); }, [[.2, 'hug', .7], [.6, 'laugh_m', .4]]);
// 92 y Keks empezó a ladrar
shot(160.00, 'W', null, L => { use('liv'); dog.root.visible = true; dog.root.position.set(LX + 4, Math.abs(Math.sin(L.T * 6)) * .8, 2); dog.root.rotation.y = -.6; dog.tail.rotation.y = Math.sin(L.T * 22) * .7; dog.head.rotation.x = Math.sin(L.T * 10) * .15;
  put(mama, LX + .6, 0, -.8, .1); put(kid, LX - 1.2, 0, -.4, .3); applyPose(mama, { aRz: .4 }); applyPose(kid, { aLz: 2.4, aRz: 2.4 }); face(mama, { eyes: 'happy', mouth: 'grin' }, 99); face(kid, { eyes: 'happy', mouth: 'grin' }, 99);
  cm([LX + 2, 5, 11, LX + 2, 3.4, 0, 50], [LX + 2, 5, 10, LX + 2, 3.4, 0, 48], L.k); }, [[0, 'bark', .8], [.4, 'bark', .7], [.9, 'bark', .7], [1.4, 'kids_laugh', .4]]);
// 93 "¿Vas a dejar alguna vez de hacer preguntas?"
shot(161.87, 'S', null, L => { use('liv'); put(mama, LX + .6, 0, -.8, -.4); applyPose(mama, { ...idlePose(L.T), headZ: .1, aLx: .3, aLe: 1.2 }); talk(mama, L.T, 161.8, 165.8, { mouth: 'smile', eyes: 'open', brows: -.2, blush: .8 }); nein(mama, 10, L.lt * 2);
  onFace(mama, 6, .4, -1.5, 42, L.k, 5); }, [[.3, 'sparkle', .4], [2.6, 'pop', .3]]);
// 94 mi primer Nein del año (guiño, el contador baja a 9)
shot(165.80, null, null, L => { use('liv'); put(kid, LX - .8, 0, 0, .3); applyPose(kid, { ...idlePose(L.T), headZ: -.1 }); face(kid, { eyes: L.lt > .7 ? 'happy' : 'open', mouth: L.lt < .5 ? 'shout' : 'grin', brows: .3, blush: 1 }, 99); nein(kid, L.lt > .45 ? 9 : 10, 1);
  onFace(kid, 5.4, .5, .5, 40, L.k, 4.6); badge('red', 'NEIN.', W / 2, H * .17, L.lt - .45); }, [[.45, 'tick_down', .8], [.8, 'ding_reveal', .8]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 3, Z: 3, F: 2, S: 3, R: 4, I: 5, C: 4 }, TR_SFX = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else CUES.push({ t: s.t0 + .05, s: ['zoom_in', 'whoosh_soft', 'zoom_out'][i % 3], g: .35 });
  if (s.tr) CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS).toFixed(3), s: TR_SFX[s.tr], g: .8 }); });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i]; hideAll(); BAD.length = 0; mama.faceMat.color.setRGB(1, 1, 1);
  const lt = T - s.t0, d = s.t1 - s.t0; s.fn({ lt, k: clamp(lt / d), T, d });
  if (s.zoom === 'slow') { const e = easeIn(clamp(lt / d)); grade.uniforms.vig.value = lerp(.32, .82, e); camera.fov *= lerp(1, .92, e); }
  let sh = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'thump', 'braam', 'stamp', 'briefcase', 'house_pop'].includes(c.s) && T - c.t < .12) sh = 1 - (T - c.t) / .12; }
  if (sh) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .22 * sh; camera.position.y += (r() - .5) * .22 * sh; }
  camera.updateProjectionMatrix(); if (snow.visible) snow.userData.update(camera.position, T);
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
  if (tr === 'I') { const r = (1 - a) * H * .75; octx.save(); octx.fillStyle = '#000'; octx.beginPath(); octx.rect(0, 0, W, H); octx.arc(W / 2, H * .42, Math.max(0, r), 0, 7, true); octx.fill('evenodd'); octx.restore(); }
  for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
