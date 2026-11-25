// ---------- a: gancho, la regla, la ciudad y yo (0 – 47,15 s) ----------
// Mondtal: calle z ∈ [60, -300] entre x = ±15; puertas en MT.DOORS (x = ±15, z); los sonámbulos marchan hacia -z (ry = PI), hacia el Berg.
// Cuartos (KZ/LZ): cama en (X - 9, -2), almohada z = -7,4; puerta del pasillo en x = X + 15, z ∈ [-1, 5]; pasillo x ∈ [X + 15, X + 29].
// helpers de esta pieza
const CROSS = { aLx: .15, aRx: .15, aLe: 1.55, aRe: 1.55, aLz: -.35, aRz: -.35 }, PALMS = { aLx: .3, aRx: .3, aLe: 1.45, aRe: 1.45, aLz: -.12, aRz: -.12, headX: .35 };
const noChairs = () => { for (const c of KU.CH) c.visible = false; };
function doorWave(L, t0, z0 = 0, sp = .03, dur = .3) { for (const d of MT.DOORS) { const k = clamp((L.T - t0 - Math.abs(d.z - z0) * sp) / dur); d.pv.rotation.y = -1.55 * easeOut(k) + (k > .6 && k < 1 ? Math.sin((k - .6) * 20) * .06 : 0); } }
function doorsOpen() { for (const d of MT.DOORS) d.pv.rotation.y = -1.55; }
// sonámbulos que salen por las puertas de z ∈ [zB, zA] hacia el centro de la calle
function outOfDoors(L, t0, zA, zB, from = 0, o = {}) { let n = 0; MT.DOORS.forEach(d => { if (d.z > zA || d.z < zB) return; const c = SL[from + n]; n++; if (!c || c.root.visible) return; const t = L.T - t0 - Math.abs(d.z - (o.z0 ?? 0)) * (o.sp ?? .03) - .15; if (t < 0) return;
  const dir = -Math.sign(d.x), dist = Math.min(t * 2.4, o.max ?? 7), turn = clamp((dist - (o.max ?? 7) + 1.2) / 1.2); put(c, d.x + dir * (1.2 + dist), 0, d.z + (o.dz ?? 0), lerp(dir > 0 ? PI / 2 : -PI / 2, o.ry ?? (dir > 0 ? PI / 2 : -PI / 2), turn)); actuar(c, 0, [[0, sleepP(L.T, n)]], { T: L.T }); sleepFace(c, L.T); }); }
// tumbado en una cama: x, z de la almohada (la cabeza apoya en ella)
function lie(ch, x, zP, top = 4.15, L = null, pose = {}) { const s = ch.spec.scale || 1; put(ch, x, top + .55 * s, zP + 4.6 * s, 0); ch.root.rotation.x = -PI / 2; ch.blob.visible = false; actuar(ch, 0, [[0, { aLz: .12, aRz: .12, ...pose }]], { T: L ? L.T : 0, weight: false }); return ch; }
// sentado en la cama con las piernas bajo el edredón (cama individual del cuarto X)
function sitBed(ch, X, L, pose = {}, dz = 0) { put(ch, X - 9, sitY(ch, 3.7), -5.4 + dz, 0); ch.blob.visible = false; actuar(ch, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 0, lRk: 0, ...pose }]], { T: L.T, weight: false }); return ch; }
const clockAt = (txt, x, y, z, ry = 0, s = 4, col = '#ff4a3a') => { BIGCLOCK.userData.set(txt, col); show(BIGCLOCK, x, y, z, ry, s); return BIGCLOCK; };

// 1 «In dieser Stadt schlafwandelt»: de frente a una casa, centrada: la puerta se abre de golpe y sale una familia en pijama (padre, madre, niño) andando hacia la cámara con los brazos estirados y los ojos como platos; detrás, todas las puertas de la calle se abren en ola. Golpe de zoom + empuje.
const HD = MT.DOORS.filter(d => d.x < 0).sort((a, b) => Math.abs(a.z + 30) - Math.abs(b.z + 30))[0];
shot(0, 'C', null, L => { gasse(L, { z: HD.z }); doorWave(L, .02, HD.z, .02, .2); HD.pv.rotation.y = -1.55 * easeOut(clamp(L.lt / .16)); outOfDoors(L, .1, HD.z + 60, HD.z - 60, 6, { z0: HD.z, sp: .02, max: 5 });
  [[SL[0], 0, 0], [SL[3], -3.4, .25], [SL[9], 3.2, .4]].forEach(([c, dz, dl], i) => { const t = clamp(L.lt - .12 - dl * .5, 0, 9); put(c, HD.x + 1.4 + t * 3.4, 0, HD.z + dz * clamp(t * 1.2), PI / 2); actuar(c, 0, [[0, { ...sleepP(L.T, i), aLx: 1.45, aRx: 1.45, aLe: .05, aRe: .05 }]], { T: L.T }); sleepFace(c, L.T); });
  cm([HD.x + 26, 6.2, HD.z, HD.x, 5.4, HD.z, 50], [HD.x + 17, 5.6, HD.z, HD.x, 5.2, HD.z, 46], L.k, easeOut); sh(V(HD.x + 6, 0, HD.z), 30); },
  [[0, 'door_crash', .7], [.1, 'door_open', .6], [.25, 'door_crash', .5], [.4, 'steps', .6], [.9, 'creepy_ting', .5], [1.2, 'door_open', .4]]);
// 2 «jeder um drei Uhr nachts.»: dormitorio de los vecinos: el despertador (encima del cabecero) salta de 2:59 a 3:00 y los dos se incorporan de golpe, rígidos, con los ojos como platos
shot(1.76, 'W', 'punch', L => { elternRoom(L); const up = easeOut(clamp((L.lt - .35) / .25));
  for (const [c, x] of [[SL[2], -3.2], [SL[7], 3.2]]) { const s = c.spec.scale || 1; lie(c, SZX + x, -6.4, 4.15, L, { aLx: .25 * up, aRx: .25 * up }); c.root.rotation.x = -PI / 2 + up * PI / 2; c.root.position.y = lerp(4.15 + .55 * s, sitY(c, 3.9), up); c.root.position.z = lerp(-6.4 + 4.6 * s, -5.2, up);
    if (up > .5) actuar(c, 0, [[0, { lLx: 1.5 * up, lRx: 1.5 * up, aLx: .3, aRx: .3 }]], { T: L.T, weight: false }); if (L.lt > .35) sleepFace(c, L.T); else c.setFace({ eyes: 'closed', mouth: 'flat' }); }
  SZ.quilt.position.y = 4.6; clockAt(L.lt < .35 ? '2:59' : '3:00', SZX, 9.4, -8.3, 0, 1.6, L.lt < .35 ? '#ff4a3a' : '#ffd23f');
  cm([SZX, 8.2, 5, SZX, 6.6, -5, 50], [SZX, 8, 3.6, SZX, 6.6, -5, 48], L.k); sh(V(SZX, 0, -2), 20); },
  [[.33, 'alarm', .6], [.38, 'cloth', .6], [.45, 'creepy_ting', .5]]);
// 3 «Wenn du wach bist,»: Ben en su cama abre los ojos de golpe (cerrados → muy abiertos) y se le escapa una gota de sudor
shot(3.57, 'C', 'punch', L => { benRoom(L); lie(ben, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; const o = L.lt > .18;
  cara(ben, L.T, o ? { expr: 'shock', eyes: 'wide', mouth: 'o' } : { eyes: 'closed', mouth: 'flat' }); if (o) sweat(ben, L.T, 1);
  const h = hp(ben); cm([h.x, h.y + 6.4, h.z + 1.6, h.x, h.y, h.z - .7, 42], [h.x, h.y + 4.6, h.z + 1.1, h.x, h.y, h.z - .7, 40], L.k); }, [[.16, 'gasp', .6], [.2, 'heartbeat', .5]]);
// 4 «tu so, als ob.»: Ben en la calle, entre los sonámbulos, imita su paso rígido con los ojos muy abiertos y mira de reojo al de al lado
shot(4.48, 'S', null, L => { gasse(L, { z: 6 }); doorsOpen(); sleepWalk(ben, L, 0, 10, PI, 1.6, 0, { face: false }); cara(ben, L.T, { eyes: L.lt > .4 ? 'side_r' : 'wide', mouth: 'grimace' }); sweat(ben, L.T, 1);
  sleepWalk(SL[1], L, 4.2, 11, PI, 1.6, 2); sleepWalk(SL[5], L, -4.4, 12, PI, 1.6, 3); march(L, SL.slice(10), 0, 18, PI, { cols: 3, speed: 1.6 });
  const p = ben.root.position; orbit(V(p.x + 1, 3.4, p.z), lerp(12, 10, L.k), PI + .12, .08, 44); sh(V(0, 0, 8), 26); }, [[0, 'whoosh', .4], [.1, 'steps', .5], [.5, 'gulp', .5]]);
// 5 «Um drei gehen in unserer Straße»: en la calle, mirando en diagonal a la fila de casas: las puertas se abren una tras otra y van saliendo; el reloj de la plaza marca 3:00
shot(5.32, 'W', null, L => { gasse(L, { z: HD.z }); doorWave(L, L.t0 + .05, HD.z + 20, .03, .22); outOfDoors(L, L.t0 + .05, HD.z + 40, HD.z - 30, 0, { z0: HD.z + 20, sp: .03, max: 4 });
  clockAt('3:00', -8, 20, HD.z - 46, .6, 3.4, '#ffd23f');
  cm([6, 7, HD.z + 26, -15, 5, HD.z + 2, 50], [6, 7, HD.z + 14, -15, 5, HD.z - 10, 50], L.k, x => x); sh(V(-10, 0, HD.z + 6), 36); },
  [[0, 'swipe', .4], [.1, 'door_open', .6], [.4, 'door_open', .5], [.75, 'door_crash', .5], [1.1, 'door_open', .4]]);
// 6 «alle Türen gleichzeitig auf,»: en medio de la calle, gran angular: las puertas de las DOS filas se abren a la vez y la luz cálida sale de todas
shot(6.74, 'Z', null, L => { gasse(L, { z: -40 }); doorWave(L, L.t0 + .08, -40, 0, .2); outOfDoors(L, L.t0 + .1, 20, -90, 0, { max: 3.5, z0: -40, sp: 0 });
  cm([0, 6, -4, 0, 4.5, -70, 64], [0, 6, -10, 0, 4.5, -76, 62], L.k); sh(V(0, 0, -36), 50); }, [[0, 'zoom_in', .4], [.05, 'door_crash', .7], [.1, 'door_open', .6], [.3, 'creepy_ting', .5]]);
// 6b «gleichzeitig auf,»: plano medio: tres puertas vecinas (centradas) se abren a la vez y la luz cálida sale de dentro
shot(7.42, 'C', 'punch', L => { gasse(L, { z: HD.z }); doorWave(L, L.t0 + .05, HD.z, 0, .2); outOfDoors(L, L.t0 + .15, HD.z + 18, HD.z - 18, 12, { z0: HD.z, sp: 0, max: 4 });
  cm([HD.x + 24, 6.4, HD.z + 1, HD.x, 4.6, HD.z, 46], [HD.x + 20, 6.2, HD.z + .5, HD.x, 4.6, HD.z, 46], L.k); sh(V(HD.x + 6, 0, HD.z), 30); }, [[0, 'impact', .4], [.05, 'door_crash', .7], [.1, 'door_open', .5]]);
// 7 «und die ganze Stadt läuft»: de cerca, en la puerta azul: una abuela con gorro de dormir y un niño salen andando rígidos, ojos abiertos
shot(8.6, 'F', null, L => { gasse(L, { z: -20 }); doorsOpen(); const d = MT.DOORS.find(d => d.x < 0 && d.z < -14) || MT.DOORS[2];
  const a = put(SL[2], d.x + 1.5 + L.lt * 2.2, 0, d.z, PI / 2); actuar(a, 0, [[0, sleepP(L.T, 1)]], { T: L.T }); sleepFace(a, L.T);
  const b = put(SL[4], d.x - .5 + L.lt * 2.2, 0, d.z + 3.2, PI / 2); actuar(b, 0, [[0, sleepP(L.T, 2)]], { T: L.T }); sleepFace(b, L.T);
  march(L, SL.slice(12), 2, d.z + 10, PI, { cols: 3, speed: 1.5 });
  cm([d.x + 12, 5.5, d.z + 4, d.x + 2, 4.6, d.z + 1, 46], [d.x + 10, 5.2, d.z + 3, d.x + 3, 4.6, d.z + 1, 44], L.k); sh(V(d.x + 4, 0, d.z), 22); }, [[0, 'flash', .4], [.1, 'steps', .6], [.6, 'wood_creak', .4]]);
// 8 «im Schlafanzug raus.»: barrido a ras de suelo por los pijamas y zapatillas que pasan (rayas, cuadros, lunares)
shot(9.72, 'S', null, L => { gasse(L, { z: -10 }); doorsOpen(); march(L, SL, 0, 4 + L.lt * 1.8, 0, { cols: 4, sx: 4.2, speed: 0 });
  cm([-12, 3.5, -2, 0, 3, -6, 40], [-10, 4.5, -10, 2, 3.5, -14, 40], L.k); sh(V(0, 0, -6), 24); DOF = 0; }, [[0, 'swipe', .4], [.1, 'cloth', .5], [.4, 'steps', .6]]);
// 9 «Vierhundert Menschen,»: grúa altísima: la calle llena de sonámbulos hasta el fondo; 400
shot(10.76, 'C', 'punch', L => { gasse(L, { z: -60 }); doorsOpen(); march(L, SL, 0, -24, PI, { cols: 4, sx: 4.4, sz: 4.6, t0: 0 });
  cm([0, 30, 46, 0, 0, -10, 48], [0, 40, 42, 0, 0, -14, 48], L.k); sh(V(0, 0, 0), 70); bigNum('400', clamp((L.lt - .05) / .2), 'gold', .22, 1.35); },
  [[0, 'impact', .5], [.05, 'pop', .5], [.2, 'crowd_run', .3]]);
// 10 «tief im Schlaf.»: de frente, la primera fila marcha hacia la cámara; ojos abiertos pero con burbujas de Zzz encima
shot(12.1, 'W', null, L => { gasse(L, { z: 0 }); doorsOpen(); const F = [SL[0], SL[3], SL[6]]; F.forEach((c, i) => { sleepWalk(c, L, (i - 1) * 4.4, -6 + L.lt * 0, PI, 1.4, i); zzz(c, L.T + i * .3, .9); });
  march(L, SL.slice(8), 0, -12, PI, { cols: 4, speed: 1.4 }); const p = F[1].root.position; orbit(V(p.x, 4.6, p.z), lerp(14, 12, L.k), PI, .06, 44); sh(V(0, 0, -8), 24); }, [[0, 'whoosh', .4], [.1, 'snore_chorus', .5]]);
// 11 «Die Augen weit offen.» (zoom lento): primer plano de una vecina con los ojos de par en par mientras camina
shot(13.48, 'F', 'slow', L => { gasse(L, { z: -10 }); doorsOpen(); const c = sleepWalk(SL[1], L, 0, -8, PI, 1.2, 1); march(L, SL.slice(14), 0, -2, PI, { cols: 3, speed: 1.2 });
  onFace(c, 5, 0, 0, 38, L.k, 3.6); sh(V(0, 0, -10), 20); }, [[0, 'flash', .3]]);
// 12 «Und sie blinzeln nie.»: dos sonámbulos de frente, muy cerca: una polilla revolotea delante de sus ojos y ni parpadean
shot(14.84, 'C', 'punch', L => { gasse(L, { z: -14 }); doorsOpen(); const a = sleepWalk(SL[3], L, -1.7, -14, 0, .8, 0), b = sleepWalk(SL[8], L, 1.7, -14.4, 0, .8, 1); march(L, SL.slice(12), 0, -24, 0, { cols: 4, speed: .8 });
  const h = hp(a); FX2D.push(c => { const [x, y] = proj(h.clone().add(V(1.7 + Math.sin(L.T * 7) * 1.4, .9 + Math.sin(L.T * 11) * .4, 1))); c.fillStyle = '#4a3a2a'; c.save(); c.translate(x, y); for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 16, 0, 16, 9 + Math.abs(Math.sin(L.T * 40)) * 8, s * .4, 0, 7); c.fill(); } c.restore(); });
  orbit(V(0, 6.4, a.root.position.z), 8, 0, .02, 40); sh(V(0, 0, -14), 20); }, [[0, 'impact', .4], [.2, 'feathers', .4], [.6, 'creepy_ting', .4]]);
// 13 «Um fünf wachen wir im Bett auf.»: al amanecer, el despertador marca 5:00 y suena; Ben se despierta, se estira y bosteza
shot(16.09, 'I', null, L => { benRoom(L, { dawn: true }); sitBed(ben, KZX, L, { aLx: 2.8, aRx: 2.8, aLz: .3, aRz: .3, aLe: .4, aRe: .4, lean: -.1, headX: -.15 }); KZ.quilt.position.y = 4.6;
  cara(ben, L.T, { expr: 'yawn', eyes: 'closed', mouth: 'yawn' }); clockAt('5:00', KZX - 3.6, 4.2, -8.4, .3, 1.2, '#ffd23f'); KZ.CLOCK.visible = false;
  cm([KZX - 7, 7.2, 4, KZX - 9, 6.2, -5.4, 44], [KZX - 7.4, 7, 2.6, KZX - 9, 6.2, -5.4, 42], L.k); }, [[0, 'iris_pop', .4], [.05, 'alarm', .6], [.5, 'yawn_big', .6]]);
// 13b «im Bett auf.»: en el cuarto de los padres, al alba: Mama se sienta en la cama y se frota la cara, confundida
shot(16.95, 'S', null, L => { elternRoom(L, { dawn: true }); put(mama, SZX - 3.4, sitY(mama, 3.7), -3.6, 0); mama.blob.visible = false; SZ.quilt.position.y = 4.6; const r = Math.sin(L.T * 9) * .15;
  actuar(mama, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 0, lRk: 0, aLx: 2.2 + r, aRx: 2.2 - r, aLe: 1.9, aRe: 1.9, aLz: -.25, aRz: -.25 }]], { T: L.T, weight: false }); cara(mama, L.T, { expr: 'sleepy', eyes: 'half' });
  onFace(mama, 5.6, 0, .8, 40, L.k, 4.8); }, [[0, 'swipe', .4], [.1, 'yawn_f', .6], [.6, 'cloth', .4]]);
// 14 «Erde an den Füßen,»: los pies sucios de tierra asoman bajo el edredón y caen migas de tierra sobre la sábana
shot(17.79, 'S', null, L => { benRoom(L, { dawn: true }); lie(ben, KZX - 9, -4.4, 4.15, L, { lLx: -.05 + Math.sin(L.T * 3) * .05, lRx: .05 }); KZ.quilt.position.y = 4.6; KZ.quilt.position.z = -1.2; KZ.quilt.scale.z = .3; ben.dirt.visible = true;
  const f = V(KZX - 9, 4.6, .2); cm([f.x + 2.4, f.y + 2.4, f.z + 5, f.x, f.y, f.z, 40], [f.x + 2, f.y + 2, f.z + 4, f.x, f.y, f.z, 38], L.k); }, [[0, 'swipe', .4], [.2, 'sprinkle', .5], [.5, 'rubble', .3]]);
// 15 «Blasen an den Händen.»: Papa en la cocina se mira las palmas llenas de ampollas y sopla, con cara de dolor
shot(18.93, 'C', 'punch', L => { kitchen(L); const c = put(papa, KUX + 9, 0, 4, PI / 2 + .3); c.blis.visible = true; actuar(c, 0, [[0, PALMS]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: L.lt > .5 ? 'o' : 'grimace' });
  onBody(c, 7, 0, .45, 40, L.k, 6.2, 0, 3.4); }, [[0, 'impact', .4], [.3, 'breath', .4], [.6, 'breath', .5]]);
// 16 «Keiner weiß, wo wir waren.»: desayuno: Mama y Papa se miran y se encogen de hombros; tierra en el suelo de la cocina
shot(19.98, 'W', null, L => { kitchen(L); const m = sit(mama, KUX + 3.4, 2.8, -5.6, 0, L, { aLx: .4, aRx: .4 }); const p = sit(papa, KUX - 3.4, 2.8, -5.6, 0, L, { aLx: .4, aRx: .4 });
  const s = Math.sin(clamp(L.lt / .5) * PI); actuar(m, 0, [[0, { ...sitPose(), aLz: .6 * s + .1, aRz: .6 * s + .1, aLe: 1.4, aRe: 1.4, headZ: .12 }]], { T: L.T, weight: false }); actuar(p, 0, [[0, { ...sitPose(), aLz: .5 * s + .1, aRz: .5 * s + .1, aLe: 1.3, aRe: 1.3, headZ: -.12 }]], { T: L.T, weight: false });
  cara(m, L.T, { expr: 'confused' }); cara(p, L.T, { expr: 'confused' }); show(PLATE[0], KUX + 3, 4.75, -2.4); show(PLATE[1], KUX - 3, 4.75, -2.4);
  cm([KUX, 9, 16, KUX, 5.4, 0, 50], [KUX, 9, 15, KUX, 5.4, 0, 48], L.k); }, [[0, 'whoosh', .4], [.15, 'cloth', .4], [.5, 'spoon', .4]]);
// 17 «Frau Huber schläft in Skischuhen.»: Frau Huber ronca en su cama; asoman dos botas de esquí rojas enormes; la cámara va de las botas a la cara
shot(21.28, 'F', null, L => { elternRoom(L, { dawn: true }); const c = lie(huber, SZX - 3.4, -6.4, 4.15, L); SZ.quilt.position.y = 4.6; SZ.quilt.scale.z = .45; SZ.quilt.position.z = -2; c.setFace({ eyes: 'closed', mouth: Math.sin(L.T * 4) > 0 ? 'o' : 'wavy' }); zzz(c, L.T);
  cm([SZX - 3.4, 8, 9, SZX - 3.4, 4.6, 1.2, 42], [SZX - 3.4, 8.6, 1, SZX - 3.4, 4.6, -6.4, 42], L.k); }, [[0, 'flash', .3], [.1, 'snore', .6], [.8, 'snore', .5]]);
// 17b «in Skischuhen.»: primer plano de las botas de esquí rojas asomando del edredón; una se mueve
shot(22.02, 'C', 'punch', L => { elternRoom(L, { dawn: true }); const c = lie(huber, SZX - 3.4, -6.4, 4.15, L, { lRx: Math.sin(L.T * 3) * .15 }); SZ.quilt.position.y = 4.6; SZ.quilt.scale.z = .45; SZ.quilt.position.z = -2; c.setFace({ eyes: 'closed', mouth: 'o' });
  const f = V(SZX - 3.4, 4.8, -1.4); cm([f.x + 3, f.y + 2.6, f.z + 6, f.x, f.y, f.z, 40], [f.x + 2.4, f.y + 2.2, f.z + 5, f.x, f.y, f.z, 38], L.k); }, [[0, 'impact', .4], [.1, 'boing_metal', .3], [.4, 'snore', .5]]);
// 18 «Die Meyers»: vista cenital: los tres Meyer dormidos en la misma cama
shot(22.95, 'Z', null, L => { meyerRoom(L); MEY.forEach((c, i) => { lie(c, MZX - 4.4 + i * 4.4, -6.4 + (i === 2 ? 2 : 0), 4.15, L); c.setFace({ eyes: 'closed', mouth: 'flat' }); }); MZ.quilt.position.y = 4.6; MZ.quilt.scale.z = .55; MZ.quilt.position.z = 3.6;
  cm([MZX, 14.5, 4, MZX, 3, -2, 50], [MZX, 14, 3, MZX, 3, -2.4, 48], L.k); }, [[0, 'zoom_in', .4], [.2, 'snore_chorus', .5]]);
// 19 «in gleichen Adidas-Anzügen.»: los tres se dan la vuelta a la vez, sincronizados; plano de los chándales negros con tres rayas
shot(23.79, 'C', 'punch', L => { meyerRoom(L); const t = clamp((L.lt - .2) / .5); MEY.forEach((c, i) => { lie(c, MZX - 4.4 + i * 4.4, -6.4 + (i === 2 ? 2 : 0), 4.15, L, { aLx: -.3 * t, aRx: .3 * t, lLx: .5 * t }); c.root.rotation.y = .35 * Math.sin(t * PI); c.setFace({ eyes: 'closed', mouth: 'flat' }); }); MZ.quilt.position.y = 4.6; MZ.quilt.scale.z = .45; MZ.quilt.position.z = 4.2;
  cm([MZX, 12, 9, MZX, 4.4, -3, 48], [MZX, 11.4, 8, MZX, 4.4, -3, 46], L.k); }, [[0, 'impact', .4], [.25, 'cloth', .6]]);
// 20 «Jeder kennt so jemanden,»: de día en la calle: un vecino se queda dormido de pie en la parada, con el periódico, y se inclina
shot(24.96, 'W', null, L => { gasse(L, { day: true }); const c = put(DX[1], -10, 0, 20, PI / 2 + .3); const lean = Math.sin(L.T * 1.6) * .08 + .12; actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2, lean, headX: .5, headZ: .2 }]], { T: L.T }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  attach(NEWS, c.aR.hand, [-.6, -.5, .6], [0, -.3, 0], 1); crowdAt(L, -6, 26, 5, 6, 12, 7, { list: DX.slice(3), mode: i => ['walk', 'talk', 'point'][i % 3], expr: 'happy' });
  onBody(c, 15, .2, .1, 44, L.k, 13); sh(V(-10, 0, 20), 24); }, [[0, 'whoosh', .4], [.1, 'city_amb', .4], [.3, 'snore', .5]]);
// 21 «der überall einschläft.»: en la cocina, otro se duerme sentado y la cabeza cae en el plato
shot(26.0, 'S', null, L => { kitchen(L); const c = sit(DX[4], KUX + 3.4, 2.8, -5.6, 0, L, {}); const k = easeIn(clamp((L.lt - .25) / .4)); actuar(c, 0, [[0, { ...sitPose(), lean: .9 * k, headX: .4 * k, aLx: .6, aRx: .6, aLe: .5, aRe: .5 }]], { T: L.T, weight: false }); c.setFace({ eyes: k > .3 ? 'closed' : 'half', mouth: 'o' }); if (k >= 1) zzz(c, L.T);
  show(PLATE[0], KUX + 3.4, 4.75, -2.6); cm([KUX + 3.4, 8.6, 5, KUX + 3.4, 5, -4.4, 44], [KUX + 3.4, 8.2, 4, KUX + 3.4, 5, -4.4, 42], L.k); }, [[0, 'swipe', .4], [.6, 'splash', .5], [.75, 'snore', .5]]);
// 22 «Hier würde der ganz vorne laufen.»: de noche, la marcha: a la cabeza, adelantado a todos, un sonámbulo con los brazos estirados guía la fila (travelling hacia atrás)
shot(27.1, 'Z', null, L => { gasse(L, { z: -30 }); doorsOpen(); const c = sleepWalk(opa, L, 0, -28, PI, 2.2, 0, { pose: { aLx: 1.5, aRx: 1.5, aLe: .1, aRe: .1 } }); march(L, SL, 0, -22, PI, { cols: 4, speed: 2.2, t0: 0 });
  const p = c.root.position; orbit(V(p.x, 4.2, p.z), lerp(16, 13, L.k), PI - .25, .1, 44); sh(V(0, 0, p.z - 4), 26); }, [[0, 'zoom_in', .4], [.1, 'steps', .6], [1.2, 'whoosh_up', .3]]);
// 22b «vorne laufen.»: de frente y bajo: el que va delante (el Opa en su chaqueta de punto) avanza hacia la cámara con los brazos estirados, ojos abiertos
shot(28.14, 'C', 'punch', L => { gasse(L, { z: -40 }); doorsOpen(); const c = sleepWalk(opa, L, 0, -40, PI, 2.2, 0, { t0: 2, pose: { aLx: 1.5, aRx: 1.5, aLe: .1, aRe: .1 } }); march(L, SL, 0, -35, PI, { cols: 4, speed: 2.2, t0: 2 });
  onBody(c, 12, 0, .06, 42, L.k, 10, 0, 3.8); sh(V(0, 0, c.root.position.z), 26); }, [[0, 'impact', .4], [.1, 'steps', .6]]);
// 23 «Bei mir?»: Ben (de día) en la cocina, se lleva el dedo a la barbilla, pensando
shot(29.23, 'C', 'punch', L => { kitchen(L); const c = put(benT, KUX + 10, 0, 6, -PI / 2 - .4); actuar(c, 0, [[0, GEST.think || { aRx: 1.6, aRe: 2.2, aRz: -.2, headZ: .15 }]], { T: L.T }); talk(c, L.T, 29.2, 29.9, 'confused');
  onFace(c, 4.4, 0, .8, 40, L.k, 3.8); }, [[0, 'impact', .4], [.15, 'pop', .4]]);
// 24 «Klar: mein Opa.»: el Opa dormido en la mesa con el tenedor en la mano, ronca; Ben lo señala riéndose
shot(30.21, 'W', null, L => { kitchen(L); const o = sit(opa, KUX - 3.4, 2.8, -5.6, 0, L, {}); actuar(o, 0, [[0, { ...sitPose(), lean: .2, headX: .5, headZ: .25, aRx: .9, aRe: 1.6, aLx: .4, aLe: .6 }]], { T: L.T, weight: false }); o.setFace({ eyes: 'closed', mouth: Math.sin(L.T * 5) > 0 ? 'o' : 'wavy' }); zzz(o, L.T);
  const b = put(benT, KUX + 2, 0, -1, -PI / 2 - .4); actuar(b, 0, [[0, { aRx: 1.6, aRz: .1, aRe: .1, aLx: .5, aLe: 1.6, lean: -.06 }]], { T: L.T }); laughF(b, L.T); show(PLATE[1], KUX - 3.4, 4.75, -2.6);
  cm([KUX - 3, 8.6, 9, KUX - 2.4, 5.4, -4, 44], [KUX - 2, 8.2, 7.6, KUX - 2.6, 5.4, -4, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'snore', .6], [.6, 'kids_laugh', .4]]);
// 25 «Und der Arzt sagt nur:»: en la consulta, Papa le enseña las ampollas al médico, que se inclina y mira con las gafas en la punta de la nariz
shot(31.53, 'S', null, L => { praxisS(L); const d = sit(arzt, PRX, 3.25, -10, 0, L, { aLx: .8, aRx: .8, aLe: 1.2, aRe: 1.2 }); actuar(d, 0, [[0, { ...sitPose(), lean: .35, headX: .3, aLx: .9, aRx: .9, aLe: 1.3, aRe: 1.3 }]], { T: L.T, weight: false }); cara(d, L.T, { expr: 'sus' });
  const p = put(papa, PRX + .4, 0, -1, PI); p.blis.visible = true; actuar(p, 0, [[0, { aLx: 1.5, aRx: 1.5, aLe: .4, aRe: .4, aLz: -.1, aRz: -.1 }]], { T: L.T }); cara(p, L.T, { expr: 'worried' });
  cm([PRX + 3, 8.6, 6, PRX, 5.4, -8, 46], [PRX + 2.6, 8.4, 5, PRX, 5.4, -8, 44], L.k); }, [[0, 'swipe', .4], [.2, 'pages', .4], [.5, 'hum', .3]]);
// 26 «Das ist der Föhn.»: el médico se encoge de hombros, sonríe y señala la ventana con las montañas; bocadillo «FÖHN!»
shot(32.7, 'F', null, L => { praxisS(L); const d = sit(arzt, PRX, 3.25, -10, 0, L, {}); const s = Math.sin(clamp(L.lt / .6) * PI); actuar(d, 0, [[0, { ...sitPose(), aLz: .5 * s + .1, aLe: 1.4, aRx: .5, aRz: 1.3, aRe: .1, headY: .3 }]], { T: L.T, weight: false }); talk(d, L.T, 32.6, 33.9, 'happy');
  bubble(d, 'FÖHN!', clamp((L.lt - .45) / .2)); onBody(d, 11, -.3, .1, 42, L.k, 10, -.2, 2.6); }, [[0, 'flash', .3], [.3, 'wind', .5], [.5, 'pop', .4]]);
// 27 «Ich bin Ben, zehn.»: Ben (de día) en la cocina saluda a cámara con una sonrisa; «BEN · 10»
shot(33.95, 'C', 'punch', L => { kitchen(L); const c = put(benT, KUX, 0, 8, PI); actuar(c, 0, [[0, 'wave']], { T: L.T }); talk(c, L.T, 33.9, 35.3, 'happy');
  onFace(c, 6, 0, 0, 40, L.k, 5); badge('tag', 'BEN', W / 2, H * .2, clamp((L.lt - .2) / .2)); bigNum('10', clamp((L.lt - .85) / .2), 'gold', .28, 1.1); }, [[0, 'impact', .4], [.25, 'pop', .4], [.85, 'pling', .4]]);
// 28 «Unser Wasser schmeckt nach Rost,»: Ben, junto a la mesa, da un sorbo a un vaso de agua marrón y pone cara de asco
shot(35.36, 'W', null, L => { kitchen(L); noChairs(); const c = put(benT, KUX + 9.6, 0, 1, -PI / 2 + .4); attach(GLASS, c.aR.hand, [0, -.6, .3], [0, 0, 0], .8); const k = clamp((L.lt - .5) / .25);
  actuar(c, 0, [[0, { aRx: lerp(1.0, 2.3, k), aRe: lerp(.9, .5, k), aRz: lerp(0, -.3, k), headX: lerp(0, -.2, k) }]], { T: L.T }); cara(c, L.T, k > .7 ? { eyes: 'squint', mouth: 'wavy' } : { expr: 'neutral' });
  onBody(c, 11, -.5, .1, 42, L.k, 10, -.4, 3.6); }, [[0, 'whoosh', .4], [.05, 'pour', .5], [.6, 'sip', .5], [.85, 'cough', .5]]);
// 29 «deshalb trinke ich nur Fanta.»: abre una Fanta (¡pssst!) y bebe feliz
shot(36.78, 'S', null, L => { kitchen(L); const c = put(benT, KUX - 6, 0, 2, PI / 2 + .3); const f = attach(FANTA[0], c.aR.hand, [0, -.5, .45], [PI / 2, 0, 0], .6); const k = clamp((L.lt - .45) / .25);
  actuar(c, 0, [[0, { aRx: lerp(1.0, 2.6, k), aRe: lerp(1.0, .4, k), aRz: lerp(0, -.35, k), headX: lerp(0, -.25, k), aLx: .3 }]], { T: L.T }); f.rotation.x = PI / 2 + lerp(0, -1.9, k); cara(c, L.T, k > .5 ? { eyes: 'closed', mouth: 'o' } : { expr: 'happy' });
  onBody(c, 12, -.8, .08, 42, L.k, 11, -.7, 3.6); }, [[0, 'swipe', .4], [.1, 'steam', .5], [.5, 'gulp', .6]]);
// 30 «Die schmeckt eh am besten.»: Ben levanta su Fanta y pone el pulgar arriba; detrás, la mesa llena de Fantas; destellos
shot(38.27, 'C', 'punch', L => { kitchen(L); noChairs(); const c = put(benT, KUX + 1, 0, 6.6, 0); attach(FANTA[0], c.aL.hand, [0, -.5, .45], [PI / 2, 0, 0], .6); actuar(c, 0, [[0, { aLx: 2.3, aLe: .4, aLz: .2, aRx: 1.6, aRe: 1.8, aRz: -.3 }]], { T: L.T }); grin(c, L.T);
  for (let i = 1; i < 6; i++) show(FANTA[i], KUX - 2.2 + i * 1.2, 4.75, 2.4 + (i % 2) * .7, 0, .62);
  onBody(c, 11.4, 0, .12, 42, L.k, 10.4, 0, 3.6); }, [[0, 'impact', .4], [.1, 'sparkle', .5], [.3, 'ding_soft', .5]]);
// 31 «Und seit einem Jahr»: de noche, Ben en la cama mira el techo con los ojos abiertos; el despertador marca 3:00; «1 JAHR»
shot(39.58, 'B', null, L => { benRoom(L); lie(ben, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; cara(ben, L.T, { eyes: 'wide', mouth: 'flat' }); KZ.CLOCK.userData.set('3:00');
  cm([KZX - 2, 13, 2, KZX - 8, 3.6, -5, 46], [KZX - 3, 12, 0, KZX - 8, 3.6, -5.6, 44], L.k); bigNum('1 JAHR', clamp((L.lt - .4) / .2), 'gold', .2, .9); }, [[0, 'clock_tick', .5], [.4, 'pling', .4]]);
// 32 «bin ich der Einzige, der dabei aufwacht.» (zoom lento): desde arriba, en la marcha, todos miran al frente; solo el pequeño Ben mira a los lados
shot(40.6, 'F', 'slow', L => { gasse(L, { z: -20 }); doorsOpen(); march(L, SL, 0, -10, PI, { cols: 4, speed: 1.6, avoid: [[0, -24]] }); const b = sleepWalk(ben, L, 0, -18, PI, 1.6, 0, { face: false }); cara(ben, L.T, { eyes: Math.sin(L.T * 3) > 0 ? 'side_l' : 'side_r', mouth: 'grimace' });
  const p = b.root.position; cm([p.x + 2, 24, p.z - 14, p.x, 2, p.z, 40], [p.x + 1, 16, p.z - 9, p.x, 3, p.z, 40], L.k); sh(V(0, 0, p.z), 26); }, [[0, 'flash', .3], [.2, 'steps', .5]]);
// 32b «der dabei aufwacht.»: primer plano de Ben en la marcha: es el único que parpadea y mira a los lados, asustado
shot(41.18, 'C', 'punch', L => { gasse(L, { z: -20 }); doorsOpen(); march(L, SL, 0, -10, PI, { cols: 4, speed: 1.6, avoid: [[0, -24]] }); const b = sleepWalk(ben, L, 0, -18, PI, 1.6, 0, { t0: 1.2, face: false });
  const bl = (L.lt % .7) < .1; cara(ben, L.T, { eyes: bl ? 'closed' : Math.sin(L.T * 3) > 0 ? 'side_l' : 'side_r', mouth: 'grimace' }); onFace(b, 5.4, 0, 0, 40, L.k, 4.6); sh(V(0, 0, b.root.position.z), 20); }, [[0, 'impact', .4], [.2, 'gulp', .5]]);
// 33 «Beim ersten Mal»: noche: Ben se incorpora en la cama al oír pasos, con los ojos abiertos
shot(42.25, 'C', 'punch', L => { benRoom(L); sitBed(ben, KZX, L, { aLx: .4, aRx: .4, aLz: .3, aRz: .3, headY: .5 }); KZ.quilt.position.y = 4.6; cara(ben, L.T, { eyes: 'wide', mouth: 'o' }); KZ.DOOR.rotation.y = -2.9;
  onFace(ben, 5, 0, 1.2, 40, L.k, 4.4); }, [[0, 'impact', .4], [.1, 'steps', .5], [.4, 'wood_creak', .5]]);
// 34 «laufen Mama und Papa an meiner Tür vorbei.»: desde la cama, por la puerta abierta: Mama y Papa pasan por el pasillo rígidos, sin parpadear
shot(43.15, 'W', null, L => { benRoom(L); KZ.DOOR.rotation.y = -2.9; sleepWalk(mama, L, KZX + 20, 7.4, PI, 3.0, 0); sleepWalk(papa, L, KZX + 21.4, 11.4, PI, 3.0, 1);
  cm([KZX + 12, 7, -2.4, KZX + 20.5, 5, 5, 44], [KZX + 12.4, 7, -2, KZX + 20.5, 5, 5, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'steps', .6], [.9, 'wood_creak', .5]]);
// 34b «Tür vorbei.»: desde el pasillo, de frente: Mama pasa por delante de la puerta del cuarto, rígida, y sigue
shot(44.09, 'S', null, L => { benRoom(L); KZ.DOOR.rotation.y = -2.9; sleepWalk(mama, L, KZX + 20.5, 6, PI, 2.6, 0); sleepWalk(papa, L, KZX + 21, 12, PI, 2.6, 1);
  cm([KZX + 21, 7, -10, KZX + 20.5, 4.8, 4, 42], [KZX + 21, 7, -9, KZX + 20.5, 4.8, 4, 42], L.k); }, [[0, 'swipe', .4], [.1, 'steps', .6]]);
// 35 «Ohne zu blinzeln.» (zoom lento): Papa en el pasillo se gira y mira hacia el cuarto, ojos abiertos, luz de la lámpara del pasillo
shot(44.92, 'F', 'slow', L => { benRoom(L); KZ.DOOR.rotation.y = -2.9; const p = put(papa, KZX + 19, 0, 2, -PI / 2 + .2); actuar(p, 0, [[0, sleepP(0, 0)]], { T: L.T }); sleepFace(p, L.T);
  onFace(p, 5.4, 0, 0, 38, L.k, 4); }, [[0, 'flash', .3], [.1, 'creepy_ting', .5]]);
// 36 «Fast hätte ich geschrien.»: Ben se tapa la boca con las dos manos, temblando, sudando
shot(45.92, 'C', 'punch', L => { benRoom(L); sitBed(ben, KZX, L, { aLx: 2.1, aRx: 2.1, aLe: 1.9, aRe: 1.9, aLz: -.25, aRz: -.25, ...shiver(L.T, 1.6) }); KZ.quilt.position.y = 4.6; cara(ben, L.T, { expr: 'terror', eyes: 'terror', mouth: 'grimace' }); sweat(ben, L.T, 2);
  onFace(ben, 4.4, 0, -.6, 40, L.k, 3.8); SHAKE = .3; }, [[0, 'impact', .5], [.1, 'scream_girl', .25], [.3, 'heartbeat', .6]]);
