// ---------- a: gancho, el mundo en botellas, la Oma, me quejo (0 – 21,04 s) ----------
// Domplatz: mi silla irá en CP; la botella libre que saco está en HP; la alcaldesa se sienta en DP; el panadero en BKP.
const CP = V(-6.5, 0, 10), HP = V(-2.6, 0, 9.4), DP = V(9, 0, -4), BKP = V(-17, 0, 20);
const AV = [[CP.x, CP.z], [HP.x, HP.z], [DP.x, DP.z], [BKP.x, BKP.z]];
const plaza = (L, o = {}) => bottleCrowd(L, o.cx ?? -3, o.cz ?? 4, o.n ?? 24, o.r0 ?? 7, o.r1 ?? 30, o.seed ?? 1, { avoid: AV, gap: .5, ...o });
const CHS = 2.85;   // altura del asiento de la silla gamer
function inChair(c, x, z, ry, L, pose = {}, cry = null) { show(CHAIR, x, 0, z, cry ?? ry); const s = c.spec.scale || 1; put(c, x + Math.sin(ry) * .25, CHS + .1 - 2.05 * s, z + Math.cos(ry) * .25, ry); actuar(c, 0, [[0, seatPose({ lean: -.18, ...pose })]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
const myHole = (L, glow = 0, bub = 0) => { const h = show(HOLES[0], HP.x, 0, HP.z); h.userData.set(glow, bub, L.T); return h; };
const qBadge = (k, y = .2) => badge('q', '?', W / 2, H * y, k, 1, 1);

// 1 «In dieser Stadt sitzt jeder» (zoom lento): grúa que baja sobre el Domplatz: todos sentados en botellas, yo en el centro
shot(0, 'C', 'slow', L => { town(L); const c = seat(ich, CP.x, CP.z, 0, L, { pose: { aLx: .5, aRx: .5, aLe: .8, aRe: .8 } }); cara(c, L.T, { expr: 'neutral', mouth: 'smile' });
  plaza(L, { n: 30, r0: 5, r1: 34, mode: i => ['talk', 'idle', 'read', 'wave', 'talk'][i % 5] });
  orb(L.k, V(CP.x, 4, CP.z), V(CP.x, 3.4, CP.z), [42, .12, .42, 48], [17, .05, .16, 44], easeOut); sh(V(CP.x, 0, CP.z - 6), 44); }, [[0, 'city_amb', .5], [.3, 'murmur', .35]]);
// 2 «auf einer Flasche.»: plano bajo: mi botella, mis piernas colgando, me balanceo
shot(1.30, 'Z', 'punch', L => { town(L); const c = seat(ich, CP.x, CP.z, 0, L, { wob: .07, pose: { aLx: .6, aRx: .6, aLz: .4, aRz: .4, lLk: 1.2 + Math.sin(L.T * 5) * .3, lRk: 1.2 } }); cara(c, L.T, { expr: 'neutral' });
  plaza(L, { n: 10, r0: 6, r1: 16, seed: 3 });
  cm([CP.x + 3.4, 2.2, CP.z + 13], [CP.x + 2.6, 2.4, CP.z + 11.5], L.k); camera.lookAt(CP.x, 5.2, CP.z); camera.fov = 48; sh(CP, 18); }, [[.1, 'glass_clink', .6], [.5, 'creak', .3]]);
// 3 «Und niemand hat mir je»: me encojo de hombros; a mi lado charlan sin explicarme nada
shot(2.28, 'W', null, L => { town(L); const c = seat(ich, CP.x, CP.z, .15, L, { pose: GEST.shrug }); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  const a = seat(EX[4], CP.x - 4.2, CP.z - 1.5, .9, L); seatMode(a, L, 1, 'talk'); const b = seat(EX[9], CP.x + 4.4, CP.z - 1.2, -.9, L); seatMode(b, L, 2, 'talk');
  plaza(L, { n: 12, r0: 9, r1: 24, seed: 5 });
  onBody(c, 15, 0, .12, 44, L.k, 12.5, -.12); sh(CP, 20); }, [[.1, 'hmm', .4]]);
// 4 «gesagt, warum.»: primer plano: miro arriba, un «?» enorme
shot(3.55, 'I', null, L => { town(L); const c = seat(ich, CP.x, CP.z, 0, L, { pose: GEST.think }); cara(c, L.T, { expr: 'confused', eyes: 'up', mouth: 'flat' });
  plaza(L, { n: 8, r0: 7, r1: 18, seed: 7 }); qBadge(clamp((L.lt - .08) / .15), .17);
  onFace(c, 5.6, .4, .8, 40, L.k, 4.6); sh(CP, 14); }, [[.1, 'pop', .5]]);
// 5 «Stühle gibt es hier nämlich keine.»: la terraza del café: mesas con botellas en vez de sillas; «KEINE STÜHLE»
shot(4.55, 'S', null, L => { town(L); const tx = 36, tz = -40; const sp = [[tx + 2.6, tz + 1.8], [tx - 2.8, tz - 1.4], [tx + 2.4, tz + 13.6], [tx - 2.6, tz + 10.6], [tx - 1.6, tz + 26], [tx - 6.8, tz + 22.4]];
  sp.forEach(([x, z], i) => { const c = seat(EX[10 + i], x, z, Math.atan2(tx - x + (i > 3 ? -4 : 0), tz + Math.floor(i / 2) * 12 - z), L); seatMode(c, L, i, i % 2 ? 'talk' : 'read'); });
  cm([tx - 16, 9, tz + 28], [tx - 12, 8, tz + 23], L.k); camera.lookAt(tx, 4, tz + 6); camera.fov = 48; badge('red', 'KEINE STÜHLE', W / 2, H * .15, clamp((L.lt - .2) / .15), 1, .85); sh(V(tx, 0, tz + 10), 30); }, [[.05, 'cafe', .4], [.3, 'cup', .4]]);
// 6 «In der Straßenbahn sitzen»: travelling por el pasillo del tranvía: dos filas de pasajeros en botellas
shot(6.03, 'C', null, L => { tramS(L); bottleGrid(L, TX, -16, 2, 7, 5.6, 4.4, { ry: 0, mode: i => ['read', 'idle', 'talk'][i % 3], stagger: 0, face: V(TX, 4, 20) });
  EX.forEach((c, i) => { if (c.root.visible && i < 14) c.root.rotation.y = c.root.position.x < TX ? Math.PI / 2 : -Math.PI / 2; });
  cm([TX + .4, 10.2, 20], [TX + .2, 9.8, 14], L.k); camera.lookAt(TX, 4.4, -10); camera.fov = 52; sh(V(TX, 0, 0), 30); }, [[0, 'tram_bell', .55], [.2, 'rumble', .4]]);
// 7 «alle auf Flaschen.»: el tranvía frena: todos se balancean sobre sus botellas, uno se agarra a la barra
shot(6.95, 'R', null, L => { tramS(L); const j = Math.sin(L.lt * 9) * Math.exp(-L.lt * 2) * .25;
  for (let i = 0; i < 4; i++) { const c = seat(EX[16 + i], TX + (i % 2 ? 2.8 : -2.8), -2 + Math.floor(i / 2) * 4.4, i % 2 ? -Math.PI / 2 : Math.PI / 2, L, { wob: .02 }); c.root.rotation.z = j * (i % 2 ? 1 : -1); seatMode(c, L, i, i === 1 ? 'shock' : 'ouch'); }
  cm([TX + 2.2, 7.4, 8], [TX + 2, 7.2, 6.8], L.k); camera.lookAt(TX - 2.8, 6, -.5); camera.fov = 48; sh(V(TX, 0, 0), 20); }, [[0, 'brake', .45], [.3, 'glass_clink', .5]]);
// 8 «Im Klassenzimmer sitzen»: la clase: la profesora en la pizarra, los alumnos en botellas detrás de los pupitres
shot(8.10, 'F', null, L => { klasseS(L); const lt = put(lehr, KX - 4, 0, -11, .3); actuar(lt, 0, [[0, { aRx: 2.2, aRz: .3, aRe: .6 + Math.sin(L.T * 3) * .2, headY: .5 }]], { T: L.T }); talk(lt, L.T, 8.1, 9.6, 'happy');
  bottleGrid(L, KX, .8, 3, 3, 11, 8, { ry: Math.PI, mode: i => ['read', 'idle', 'ouch'][i % 3], scale: .78, stagger: 0 });
  EX.forEach(c => { if (c.root.visible) c.root.rotation.y = Math.PI; });
  cm([KX + 6, 13, -12], [KX + 4, 12, -10], L.k); camera.lookAt(KX, 3, 6); camera.fov = 52; sh(V(KX, 0, 2), 24); }, [[0, 'chalk', .5], [.4, 'school_bell', .3]]);
// 9 «alle auf Flaschen.»: primer plano de un niño escribiendo: su botella cruje y se tambalea
shot(9.00, 'W', null, L => { klasseS(L); const c = seat(EX[20], KX, 8.8, Math.PI, L, { wob: .09 }); c.root.scale.setScalar(.78 * c.spec.scale); c.root.position.y = SEAT + .1 - 2.05 * .78 * c.spec.scale;
  actuar(c, 0, [[0, seatPose({ aRx: 1.3, aRz: -.1, aRe: 1.1 + Math.sin(L.T * 14) * .1, aLx: 1.0, aLe: 1.2, headX: .35 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  bottleGrid(L, KX, .8, 3, 2, 11, 8, { ry: Math.PI, mode: 'read', scale: .78, stagger: 0, list: EX.slice(22), skip: (x, z) => Math.abs(x - KX) < 3 && Math.abs(z - 8.8) < 3 });
  cm([KX + 6, 6.4, 3], [KX + 5, 6.2, 4], L.k); camera.lookAt(KX, 4.6, 8.8); camera.fov = 48; sh(V(KX, 0, 8), 16); }, [[0, 'pencil', .5], [.4, 'creak', .4]]);
// 10 «Sogar beim Zahnarzt»: la consulta: el paciente en una botella, la dentista con el espejito
shot(10.12, 'C', 'punch', L => { zahnS(L); const p = seat(EX[5], ZAX, 0, .5, L, { wob: .05, pose: { headX: -.45, aLx: .6, aRx: .6, aLz: .5, aRz: .5, aLe: 1.2, aRe: 1.2 } }); cara(p, L.T, { expr: 'worried', eyes: 'wide', mouth: 'o' });
  const z = put(zahn, ZAX + 3.2, 0, 1.4, -1.6); actuar(z, 0, [[0, { aRx: 1.5, aRz: -.3, aRe: .9 + Math.sin(L.T * 8) * .1, aLx: 1.2, aLe: .9, lean: .2, headX: .25, headY: -.2 }]], { T: L.T }); cara(z, L.T, { expr: 'happy' });
  cm([ZAX - 5, 7.5, 13], [ZAX - 3.6, 6.8, 10.5], L.k); camera.lookAt(ZAX + .8, 4.4, 0); camera.fov = 46; badge('tag', 'ZAHNARZT', W / 2, H * .14, clamp((L.lt - .1) / .15), 1, .9); sh(V(ZAX, 0, 0), 18); }, [[0, 'drill', .45], [.5, 'hmm', .3]]);
// 11 «sitzt du auf einer Flasche.»: plano bajo: la botella bajo el paciente; tiembla con el taladro
shot(11.24, 'S', null, L => { zahnS(L); const p = seat(EX[5], ZAX, 0, .5, L, { wob: .02, pose: { headX: -.45, aLx: .6, aRx: .6, aLz: .5, aRz: .5, aLe: 1.2, aRe: 1.2, lLk: 1.5 + Math.sin(L.T * 20) * .15, lRk: 1.5 + Math.sin(L.T * 21) * .15 } }); p.root.position.x += Math.sin(L.T * 40) * .04; cara(p, L.T, { expr: 'shock', mouth: 'scream' });
  const z = put(zahn, ZAX + 3.2, 0, 1.4, -1.6); actuar(z, 0, [[0, { aRx: 1.5, aRz: -.3, aRe: .9, aLx: 1.2, aLe: .9, lean: .2, headX: .25 }]], { T: L.T }); cara(z, L.T, { expr: 'happy' });
  cm([ZAX + 3.6, 3.4, 10], [ZAX + 3, 3.8, 9], L.k); camera.lookAt(ZAX, 5, 0); camera.fov = 52; sh(V(ZAX, 0, 0), 14); }, [[0, 'drill', .55], [.4, 'glass_clink', .4]]);
// 12 «Meine Oma sitzt seit 52 Jahren» (zoom lento): la Oma teje sentada en su botella; «52 JAHRE»
shot(12.40, 'I', 'slow', L => { omaS(L); const o = seat(oma, OX, 1, .1, L, { wob: .02, pose: { aLx: 1.0, aRx: 1.0, aLz: -.25, aRz: -.25, aLe: 1.3 + Math.sin(L.T * 9) * .12, aRe: 1.3 - Math.sin(L.T * 9) * .12, headX: .25 } }); cara(o, L.T, { expr: 'happy', mouth: 'smile' });
  onBody(o, 17, .1, .1, 44, L.k, 12, 0, 2.8); badge('gold', '52 JAHRE', W / 2, H * .15, clamp((L.T - 13.34) / .15), 1, 1); sh(V(OX, 0, 1), 18); }, [[0, 'clock_tick', .5], [.4, 'knit', .4]]);
// 13 «auf derselben Flasche.»: la botella de la Oma: telarañas, la etiqueta gastada, polvo
shot(13.94, 'C', 'punch', L => { omaS(L); const o = seat(oma, OX, 1, .1, L, { wob: .01, pose: { aLx: 1.0, aRx: 1.0, aLz: -.25, aRz: -.25, aLe: 1.3, aRe: 1.3, headX: .25 } }); cara(o, L.T, { expr: 'happy', mouth: 'smile' });
  dust(V(OX + .5, 1.5, 1.8), 13.95, L.T, 8, .4);
  cm([OX + 2.6, 2.2, 9.5], [OX + 2.0, 2.4, 8.2], L.k); camera.lookAt(OX, 2.6, 1); camera.fov = 44; sh(V(OX, 0, 1), 12); }, [[0, 'dust_puff', .5], [.3, 'creak', .4]]);
// 14 «Sie steht nie auf.»: la Oma duerme en su botella, la tele encendida, el gato le trae la merienda
shot(15.82, 'R', null, L => { omaS(L); const o = seat(oma, OX, 1, .1, L, { wob: .015, pose: { aLx: .3, aRx: .3, headX: .45 + Math.sin(L.T * 2) * .05, headZ: .25, lean: .1 } }); cara(o, L.T, { eyes: 'closed', mouth: 'o' });
  orb(L.k, V(OX, 3, 1), null, [17, .9, .18, 44], [15, .5, .14, 44]); badge('tag', 'Zzz', W * .66, H * .22, clamp(L.lt / .2), 1, .8); sh(V(OX, 0, 1), 18); }, [[0, 'snore', .5]]);
// 15 «Ich habe das nie kapiert.»: en la plaza, yo en mi botella, me rasco la cabeza
shot(16.99, 'F', null, L => { town(L); const c = seat(ich, CP.x, CP.z, -.2, L, { pose: GEST.think }); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  plaza(L, { n: 14, r0: 8, r1: 26, seed: 11 }); qBadge(clamp((L.T - 17.75) / .15), .17);
  orb(L.k, V(CP.x, 4.2, CP.z), null, [14, -.5, .12, 44], [12, -.25, .1, 44]); sh(CP, 20); }, [[0, 'hmm', .45]]);
// 16 «Denn Flaschen sind hart,»: golpeo mi botella con los nudillos: «tok tok»
shot(18.50, 'W', null, L => { town(L); const k = Math.max(0, Math.sin((L.T - 19.1) * 18)); const c = seat(ich, CP.x, CP.z, 0, L, { pose: { lean: .5, headX: .45, aRx: .3 + k * .4, aRz: .5, aRe: 1.7, aLx: .4 } }); cara(c, L.T, { expr: 'confused', eyes: 'down', mouth: 'flat' });
  plaza(L, { n: 8, r0: 7, r1: 18, seed: 13 });
  cm([CP.x + 3.4, 3.4, CP.z + 6.5], [CP.x + 2.6, 3.2, CP.z + 5.6], L.k); camera.lookAt(CP.x, 3.0, CP.z); camera.fov = 44; badge('tag', 'HART', W / 2, H * .18, clamp((L.T - 19.16) / .12), 1, 1); sh(CP, 14); }, [[.6, 'knock', .7], [.75, 'knock', .6]]);
// 17 «glitschig»: me resbalo de lado, agito los brazos
shot(19.70, 'C', 'punch', L => { town(L); const k = easeIn(clamp((L.T - 19.75) / .5)); const c = seat(ich, CP.x, CP.z, 0, L, { wob: 0, pose: { aLx: 2.4, aRx: 1.0, aLz: 1.2 + Math.sin(L.T * 20) * .3, aRz: .9, aLe: .4, aRe: .4, lLk: .6, lRk: 1.2 } });
  c.root.rotation.z = -k * .9; c.root.position.x += k * 1.4; c.root.position.y -= k * .9; cara(c, L.T, { expr: 'shock', mouth: 'scream' });
  plaza(L, { n: 8, r0: 8, r1: 18, seed: 15 });
  orbit(V(CP.x, 3.8, CP.z), 15, .05, .12, 44); badge('tag', 'GLITSCHIG', W / 2, H * .18, clamp((L.lt - .05) / .12), 1, 1); sh(CP, 16); }, [[.1, 'squeak', .6], [.4, 'whoosh_down', .3]]);
// 18 «und tun weh.»: me froto el trasero con cara de dolor; estrellitas
shot(20.30, 'S', null, L => { town(L); const c = seat(ich, CP.x, CP.z, .1, L, { wob: .08, pose: { aLx: -.5, aLz: .3, aLe: .8, aRx: -.4, aRz: .3, aRe: .8, lean: .2, headX: -.2 } }); cara(c, L.T, { expr: 'worried', eyes: 'closed', mouth: 'grimace' }); stars(c, L.T, 5);
  plaza(L, { n: 8, r0: 8, r1: 18, seed: 17 });
  onFace(c, 6, .2, -.8, 42, L.k, 5); badge('red', 'AUA!', W / 2, H * .16, clamp((L.T - 20.54) / .12), 1, .9); sh(CP, 14); }, [[.1, 'ouch', .6], [.3, 'sparkle', .3]]);
