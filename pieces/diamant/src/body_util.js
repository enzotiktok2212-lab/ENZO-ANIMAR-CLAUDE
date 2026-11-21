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
