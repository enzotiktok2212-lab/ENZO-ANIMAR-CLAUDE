// ---------- d: la cueva, el agujero burbujea, la persecución de la botella, «Plopp», el final (61,74 s – fin) ----------
const ROLL0 = V(HP.x + 2.6, 0, HP.z + 2.2);
// recorrido de la botella que rueda (78,1 → 84,2 s): de mi agujero cruza la plaza hacia el Dom y vuelve en curva
const rollPath = T => { const k = clamp((T - 77.6) / 6.6); const a = k * Math.PI * 1.3; return V(HP.x + 2.6 - Math.sin(a) * 26, 0, HP.z + 2.2 - (1 - Math.cos(a)) * 14); };
const rollDir = T => { const p = rollPath(T), q = rollPath(T + .05); return Math.atan2(q.x - p.x, q.z - p.z); };
const eyesK = T => T < 63.6 ? 0 : easeOut(clamp((T - 63.6) / .6));
// 56 «Vor 300 Jahren»: la cueva bajo la ciudad: oscuridad lila, botellas que asoman del techo; «VOR 300 JAHREN»
shot(61.74, 'F', null, L => { hoehleS(L, { eyes: .05 }); grade.uniforms.sepia.value = .25;
  cm([HX + 8, 6, 34], [HX + 5, 8, 28], L.k); camera.lookAt(HX, 14, -20); camera.fov = 56; badge('gold', 'VOR 300 JAHREN', W / 2, H * .15, clamp((L.T - 61.84) / .15), 1, .95); }, [[0, 'cave_drip', .55], [.3, 'rumble', .45]]);
// 57 «wurde unter der Stadt»: la cámara sube hacia el techo: el fondo de cientos de botellas clavadas
shot(62.78, 'R', null, L => { hoehleS(L, { eyes: 0 });
  cm([HX, 8, 14], [HX + 1, 16, 6], L.k); camera.lookAt(HX + 2, 34, -8); camera.fov = 58; }, [[0, 'rumble', .45], [.5, 'cave_drip', .4]]);
// 58 «etwas eingesperrt.» (zoom lento): en la oscuridad se abren unos ojos lila enormes
shot(64.22 - .4, 'C', 'slow', L => { hoehleS(L, { eyes: eyesK(L.T) });
  cm([HX, 9, 20], [HX, 10, 6], L.k, easeIn); camera.lookAt(HX, 10, -40); camera.fov = 50; }, [[.2, 'growl', .55], [.5, 'creepy_ting', .45]]);
// 59 «Und jede Flasche hält es da unten fest,»: el techo de botellas visto de cerca; el monstruo empuja, pero no se mueven
shot(65.22, 'S', null, L => { hoehleS(L, { eyes: 1 }); HO.BOT.forEach((b, i) => { b.position.y += Math.sin(L.T * 20 + i) * .04; });
  cm([HX - 6, 18, 0], [HX - 4, 20, -2], L.k); camera.lookAt(HX + 4, 32, -10); camera.fov = 52; }, [[0, 'glass_creak', .5], [.4, 'growl', .4]]);
// 60 «aber nur, solange»: de vuelta en la plaza: un vecino intenta levantarse de su botella...
shot(66.58 + .68, 'W', null, L => { town(L, { lila: 1 }); const up = L.T < 67.9 ? easeOut(clamp((L.T - 67.3) / .3)) : 1 - easeIn(clamp((L.T - 67.9) / .2)); const P = V(14, 0, 18);
  const c = seat(EX[8], P.x, P.z, -.6, L, { wob: 0, pose: { aLx: .4, aRx: .4, lLk: 1.5 - up * 1.2, lRk: 1.5 - up * 1.2, lLx: 1.5 - up * 1.2, lRx: 1.5 - up * 1.2 } }); c.root.position.y += up * 1.2;
  const h = show(HOLES[2], P.x, 0, P.z); h.userData.set(up * .8, 0, L.T); if (up > .05) BOTS.forEach(b => { if (b.visible && Math.abs(b.position.x - P.x) < .1 && Math.abs(b.position.z - P.z) < .1) b.position.y = up * .9; });
  cara(c, L.T, { expr: up > .5 ? 'shock' : 'worried', mouth: up > .5 ? 'o' : 'grimace' });
  plaza(L, { cx: P.x, cz: P.z - 6, n: 8, r0: 5, r1: 14, seed: 71, mode: 'point', face: hp(c) });
  onBody(c, 15, 0, .12, 44, L.k, 13, 0, 3.6); sh(P, 16); }, [[.1, 'glass_creak', .45], [.5, 'growl', .4]]);
// 61 «jemand draufsitzt.»: ... el agujero brilla: se vuelve a sentar de golpe; todos se agarran fuerte
shot(68.08, 'C', 'punch', L => { town(L, { lila: 1 }); const P = V(14, 0, 18); const c = seat(EX[8], P.x, P.z, -.6, L, { wob: .06, pose: { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: .4, aRe: .4, lean: .2 } }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  plaza(L, { cx: P.x, cz: P.z - 6, n: 10, r0: 5, r1: 16, seed: 73, mode: 'ouch' });
  orbit(V(P.x, 4.6, P.z), 13, -.4, .12, 44); badge('red', 'SITZEN BLEIBEN!', W / 2, H * .15, clamp((L.T - 68.32) / .12), 1, .85); sh(P, 16); }, [[0, 'thud', .55]]);
// 62 «Langsam schaue ich auf das Loch,» (zoom lento): giro la cabeza muy despacio hacia mi agujero
shot(69.22, 'I', 'slow', L => { town(L, { lila: 1 }); myChairScene(L, { glow: .2 }); const k = easeInOut(clamp((L.T - 69.3) / 1.0)); const c = inChair(ich, CP.x, CP.z, 0, L, { headY: -k * 1.0, headX: k * .3, aLx: .4, aRx: .4 }); cara(c, L.T, { expr: 'worried', eyes: k > .6 ? 'side_r' : 'worried', mouth: 'flat' }); sweat(c, L.T);
  onFace(c, 7, .3, 0, 42, L.k, 5); sh(CP, 14); }, [[.2, 'heartbeat', .55]]);
// 63 «aus dem ich vorhin meine Flasche gezogen habe.»: mi agujero, junto a la silla; mi botella tirada al lado
shot(70.64, 'S', null, L => { town(L, { lila: 1 }); myChairScene(L, { glow: .25 }); inChair(ich, CP.x, CP.z, .6, L, { headY: -.6, headX: .4 }); cara(ich, L.T, { expr: 'worried' });
  cm([HP.x + 5, 7.5, HP.z + 8], [HP.x + 3.4, 6, HP.z + 6], L.k); camera.lookAt(HP.x, .4, HP.z); camera.fov = 46; sh(HP, 12); }, [[0, 'wind', .4]]);
// 64 «Es fängt an zu blubbern.»: ¡el agujero burbujea lila!
shot(72.54, 'C', 'punch', L => { town(L, { lila: 1 }); const g = clamp((L.T - 72.7) / .4); myChairScene(L, { glow: .3 + g * .6, bub: g }); SHAKE = .25;
  cm([HP.x + 2.4, 5, HP.z + 5], [HP.x + 1.8, 4.2, HP.z + 4], L.k); camera.lookAt(HP.x, .6, HP.z); camera.fov = 44; badge('tag', 'BLUBB BLUBB', W / 2, H * .17, clamp((L.T - 73.2) / .12), 1, .9); sh(HP, 12); }, [[.1, 'bubbles', .7], [.4, 'growl', .4]]);
// 65 «Alle schreien:»: toda la plaza grita desde sus botellas
shot(73.84, 'Z', null, L => { town(L, { lila: 1 }); myChairScene(L, { glow: .9, bub: 1 });
  plaza(L, { n: 26, r0: 6, r1: 30, seed: 75, mode: 'shout' }); inChair(ich, CP.x, CP.z, 0, L, GEST.shock); cara(ich, L.T, { expr: 'shock', mouth: 'o' });
  cm([CP.x - 6, 16, CP.z + 26], [CP.x - 4, 14, CP.z + 22], L.k); camera.lookAt(CP.x, 3, CP.z - 4); camera.fov = 50; sh(V(CP.x, 0, CP.z - 4), 34); }, [[0, 'shout_crowd', .55]]);
// 66 «„Flasche rein!»: primer plano: dos vecinos gritando
shot(74.62, 'C', 'punch', L => { town(L, { lila: 1 }); const a = seat(EX[2], CP.x - 2, CP.z - 6, .1, L, { wob: .05 }); seatMode(a, L, 1, 'shout'); const b = seat(EX[11], CP.x + 2.2, CP.z - 7.5, -.2, L, { wob: .05 }); seatMode(b, L, 2, 'shout');
  plaza(L, { cx: CP.x, cz: CP.z - 14, n: 8, r0: 4, r1: 14, seed: 77, mode: 'shout', gap: 1.5 });
  cm([CP.x + .2, 7.6, CP.z + 4], [CP.x + .1, 7.2, CP.z + 2.8], L.k); camera.lookAt(CP.x, 6, CP.z - 7); camera.fov = 46; badge('red', 'FLASCHE REIN!', W / 2, H * .15, clamp((L.T - 74.62) / .1), 1, .95); sh(V(CP.x, 0, CP.z - 6), 16); }, [[0, 'shout_crowd', .5]]);
// 67 «Flasche rein!“»: la alcaldesa y los policías también, señalando el agujero
shot(75.36, 'W', 'punch', L => { town(L, { lila: 1 }); myChairScene(L, { glow: .9, bub: 1 }); const d = put(dorn, HP.x + 4, 0, HP.z - 6, -.6); actuar(d, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: 2.0, aLz: .9, aLe: 1.6, lean: .1 }]], { T: L.T }); cara(d, L.T, { expr: 'shout', mouth: 'talk_wide' });
  const p = put(cop1, HP.x + 7, 0, HP.z - 3, -1.1); actuar(p, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6 }]], { T: L.T }); cara(p, L.T, { expr: 'shout', mouth: 'talk_wide' });
  cm([HP.x - 3, 7, HP.z + 9], [HP.x - 2.4, 6.6, HP.z + 7.6], L.k); camera.lookAt(HP.x + 3, 3.4, HP.z - 3); camera.fov = 48; badge('red', 'FLASCHE REIN!', W / 2, H * .15, clamp((L.T - 75.36) / .1), 1, 1.05); sh(HP, 16); }, [[0, 'shout_f', .45]]);
// 68 «Ich will sie zurückstecken,»: salto de la silla y me lanzo a por mi botella
shot(76.08, 'S', null, L => { town(L, { lila: 1 }); myHole(L, .9, 1); show(CHAIR, CP.x, 0, CP.z, 0); const k = easeOut(clamp((L.T - 76.1) / .7));
  const c = put(ich, lerp(CP.x, HP.x + 1.4, k), Math.sin(k * Math.PI) * 1.4, lerp(CP.z + .3, HP.z + 2.6, k), 1.4); actuar(c, 0, [[0, { ...GEST.reach, lean: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' });
  rollBottle(MYB, V(ROLL0.x + clamp((L.T - 76.9) / .4) * .4, 0, ROLL0.z), .8, L.T * 2 * clamp(L.T - 76.9));
  orbit(V(HP.x + 1, 3.6, HP.z + 2), 16, .3, .14, 46); sh(HP, 16); }, [[0, 'whoosh_up', .4], [.6, 'grunt', .45]]);
// 69 «aber sie ist weggerollt.»: plano bajo: la botella se aleja rodando por el adoquín
shot(77.33, 'C', null, L => { town(L, { lila: 1 }); myHole(L, .9, 1); const p = rollPath(L.T + .3); rollBottle(MYB, p, rollDir(L.T + .3), L.T * 9);
  const c = put(ich, HP.x + 1.6, 0, HP.z + 2.8, -1.6); actuar(c, 0, [[0, { ...GEST.reach, lean: .5, crouch: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  cm([p.x - 2, 1.4, p.z + 6], [p.x - 2.6, 1.6, p.z + 6.6], L.k); camera.lookAt(p.x, 1.2, p.z); camera.fov = 48; sh(p, 14); }, [[0, 'bottle_roll', .65]]);
// 70 «Sie rollt quer über den ganzen Domplatz,»: la botella rueda delante del Dom; la gente aparta los pies
shot(78.47, 'R', null, L => { town(L, { lila: 1 }); const p = rollPath(L.T + .3); rollBottle(MYB, p, rollDir(L.T + .3), L.T * 9);
  plaza(L, { cx: p.x, cz: p.z, n: 12, r0: 5, r1: 18, seed: 79, mode: 'point', face: p, gap: 1.3 });
  cm([p.x + 6, 3, p.z + 12], [p.x + 4, 3.4, p.z + 10], L.k); camera.lookAt(p.x - 2, 4, p.z - 4); camera.fov = 50; sh(p, 18); }, [[0, 'bottle_roll', .6], [.4, 'gasp', .35]]);
// 71 «Domplatz,»: desde el aire: la botella cruza toda la plaza
shot(79.69, 'Z', null, L => { town(L, { lila: 1 }); myHole(L, .9, 1); const p = rollPath(L.T + .3); rollBottle(MYB, p, rollDir(L.T + .3), L.T * 9);
  plaza(L, { n: 26, r0: 5, r1: 32, seed: 81, mode: 'point', face: p });
  cm([p.x + 8, 22, p.z + 18], [p.x + 7, 20, p.z + 16], L.k); camera.lookAt(p.x, 0, p.z - 2); camera.fov = 50; sh(p, 40); }, [[0, 'bottle_roll', .5]]);
// 72 «und die ganze Stadt rennt hinterher.»: todos saltan de sus botellas y corren detrás (los agujeros brillan)
shot(80.49, 'W', null, L => { town(L, { lila: 1 }); const p = rollPath(L.T + .3); rollBottle(MYB, p, rollDir(L.T + .3), L.T * 9); const dir = rollDir(L.T + .3);
  crowdAt(L, p.x - Math.sin(dir) * 9, p.z - Math.cos(dir) * 9, 18, 2, 10, 83, { mode: 'run', ry: dir, speed: 0, full: true });
  cm([p.x + Math.sin(dir) * 10 + 3, 5.5, p.z + Math.cos(dir) * 10], [p.x + Math.sin(dir) * 9 + 2, 5, p.z + Math.cos(dir) * 9], L.k); camera.lookAt(p.x - Math.sin(dir) * 6, 3, p.z - Math.cos(dir) * 6); camera.fov = 52; sh(p, 30); }, [[0, 'run_steps', .55], [.2, 'shout_crowd', .45]]);
// 73 «hinterher.»: yo delante de todos, corriendo con todas mis fuerzas
shot(81.35, 'S', null, L => { town(L, { lila: 1 }); const p = rollPath(L.T + .3), dir = rollDir(L.T + .3); rollBottle(MYB, p, dir, L.T * 9);
  const c = put(ich, p.x - Math.sin(dir) * 4.5, 0, p.z - Math.cos(dir) * 4.5, dir); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .35; actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  crowdAt(L, p.x - Math.sin(dir) * 12, p.z - Math.cos(dir) * 12, 10, 1, 7, 85, { mode: 'run', ry: dir, speed: 0, full: true });
  onBody(c, 15, 0, .14, 46, L.k, 13); sh(c.root.position, 20); }, [[0, 'run_steps', .55]]);
// 74 «In letzter Sekunde» (zoom lento): me lanzo en plancha a por ella, a cámara lenta
shot(82.03, 'I', 'slow', L => { town(L, { lila: 1 }); const tt = 82.03 + (L.T - 82.03) * .35, p = rollPath(tt + .3), dir = rollDir(tt + .3); rollBottle(MYB, p, dir, tt * 9);
  const k = clamp((L.T - 82.03) / 1.5); const c = put(ich, p.x - Math.sin(dir) * (3.5 - k * 1.8), 1.2 + Math.sin(k * Math.PI) * .8, p.z - Math.cos(dir) * (3.5 - k * 1.8), dir); c.root.rotation.order = 'YXZ'; c.root.rotation.x = 1.25; actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .1, aRz: .1, aLe: .1, aRe: .1, lLx: -.2, lRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'scream' }); c.blob.visible = false;
  orbit(V(c.root.position.x, 2.2, c.root.position.z), lerp(14, 11, L.k), dir + 1.3, .12, 46); badge('tag', 'LETZTE SEKUNDE', W / 2, H * .15, clamp((L.T - 82.93) / .12), 1, .9); sh(p, 14); }, [[0, 'slowmo', .5]]);
// 75 «fange ich sie,»: ¡la atrapo! la abrazo contra el pecho
shot(83.61, 'C', 'punch', L => { town(L, { lila: 1 }); const P = V(HP.x - 3, 0, HP.z - 6); const c = put(ich, P.x, 0, P.z, .4); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: .7, aRe: .7, crouch: .25, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grin' });
  attach(MYB, c.root, [0, 3.2, 1.3], [Math.PI / 2 - .3, 0, 0], .55); dust(V(P.x, 0, P.z), 83.6, L.T, 8, .5);
  onBody(c, 13, .1, .1, 44, L.k, 11.5); sh(P, 14); }, [[0, 'catch', .6]]);
// 76 «stecke sie ins Loch»: la clavo boca abajo... no: de pie, en el agujero que burbujea
shot(84.45, 'F', null, L => { town(L, { lila: 1 }); const k = easeIn(clamp((L.T - 84.5) / .4)); myHole(L, .9 * (1 - k * .5), 1 - k * .5); show(CHAIR, CP.x, 0, CP.z, 0);
  show(MYB, HP.x, lerp(2.2, 0, k), HP.z, 0); MYB.userData.collar.visible = k > .95;
  const c = put(ich, HP.x, 0, HP.z - 2.3, 0); actuar(c, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.25, aRz: -.25, aLe: .5, aRe: .5, lean: .3, crouch: .2 + k * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([HP.x + 5, 6, HP.z + 8], [HP.x + 4, 5.4, HP.z + 7], L.k); camera.lookAt(HP.x, 2.4, HP.z + .6); camera.fov = 46; sh(HP, 14); }, [[.35, 'glass_thud', .6]]);
// 77 «und setze mich drauf.»: me siento encima de golpe; la luz lila se apaga poco a poco
shot(85.19, 'S', null, L => { town(L, { lila: L.T < 86.2 }); const k = easeOut(clamp((L.T - 85.4) / .35)); myHole(L, 0); show(CHAIR, CP.x, 0, CP.z, 0);
  const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: .06, pose: { aLx: 1.2, aRx: 1.2, aLz: .3, aRz: .3, lean: .15 } }); c.root.position.y += (1 - k) * 1.6; cara(c, L.T, { expr: 'determined', eyes: 'closed', mouth: 'grimace' });
  plaza(L, { cx: HP.x, cz: HP.z - 8, n: 10, r0: 4, r1: 14, seed: 87, mode: 'shock', bottle: false });
  onBody(c, 16, .3, .12, 44, L.k, 13, .1, 4.4); sh(HP, 16); }, [[.25, 'thud', .6]]);
// 78 «Plopp.»: primer plano: «PLOPP!»
shot(86.60, 'C', 'punch', L => { town(L); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: .03, pose: { aLx: 1.2, aRx: 1.2, aLz: .3, aRz: .3, lean: .1 } }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  cm([HP.x + 3.6, 7.6, HP.z + 9.5], [HP.x + 3.2, 7.4, HP.z + 8.5], L.k); camera.lookAt(HP.x, 6.2, HP.z); camera.fov = 44; badge('gold', 'PLOPP!', W / 2, H * .17, clamp(L.lt / .1), 1, 1.2); sh(HP, 12); }, [[0, 'cork_pop', .85]]);
// 79 «Das Blubbern hört auf.»: silencio; la plaza vuelve a la normalidad; todos respiran aliviados
shot(87.30, 'W', null, L => { town(L); show(CHAIR, CP.x, 0, CP.z, 0); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, pose: { aLx: .4, aRx: .4, lean: .2, headX: .2 } }); cara(c, L.T, { expr: 'relief', eyes: 'closed', mouth: 'smile' });
  plaza(L, { n: 24, r0: 6, r1: 30, seed: 89, mode: i => i % 2 ? 'idle' : 'ouch', expr: 'relief' });
  cm([HP.x + 8, 14, HP.z + 24], [HP.x + 6, 12, HP.z + 20], L.k); camera.lookAt(HP.x, 3, HP.z - 2); camera.fov = 50; sh(V(HP.x, 0, HP.z - 4), 34); }, [[0, 'sigh', .5], [.3, 'birds', .4]]);
// 80 «Seitdem sitze ich auch auf einer Flasche.»: yo en mi botella; la silla gamer, vacía, a mi lado
shot(88.89, 'F', null, L => { town(L); show(CHAIR, CP.x - 1, 0, CP.z + .4, .3); const c = seat(ich, HP.x, HP.z, -.15, L, { col: 0, wob: .05, pose: { aLx: .5, aRx: .5, aLz: .4, aRz: .4, aLe: .6, aRe: .6, lean: .15, headX: .1 } }); cara(c, L.T, { expr: 'sad', mouth: 'flat' });
  plaza(L, { n: 14, r0: 8, r1: 26, seed: 91, mode: i => ['talk', 'read', 'idle'][i % 3] });
  orb(L.k, V(HP.x - 1.6, 4, HP.z), null, [17, .35, .12, 44], [15, .2, .1, 44]); sh(HP, 18); }, [[0, 'sigh', .45]]);
// 81 «Jeden einzelnen Tag.»: la plaza de día, al atardecer y de noche: yo siempre en mi botella; «JEDEN TAG»
shot(90.74, 'C', null, L => { const ph = Math.floor(clamp((L.T - 90.74) / 1.3) * 3); town(L, { dusk: ph === 1, night: ph === 2 }); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, pose: { aLx: .5, aRx: .5, aLz: .4, aRz: .4, aLe: .6, aRe: .6, lean: .15 } }); cara(c, L.T, { expr: 'sad', eyes: 'half', mouth: 'flat' });
  plaza(L, { n: 14, r0: 7, r1: 26, seed: 93 + ph });
  orbit(V(HP.x, 5, HP.z), 19 - L.k * 2, .1 - L.k * .2, .14, 44); badge('gold', 'JEDEN TAG', W / 2, H * .11, clamp((L.T - 90.74) / .15), 1, 1); sh(HP, 18); }, [[0, 'clock_tick', .5]]);
// 82 «Mein Stuhl steht jetzt im Keller.»: el sótano: la silla gamer bajo la bombilla, cubierta de polvo
shot(92.04, 'I', null, L => { sotanoS(L); show(CHAIR, SX, 0, -3, .35); DOF = 1.4;
  cm([SX + 5, 6.4, 10], [SX + 3.4, 5.8, 7.6], L.k); camera.lookAt(SX, 3.4, -3); camera.fov = 46; badge('tag', 'IM KELLER', W / 2, H * .15, clamp((L.T - 93.04) / .12), 1, .9); }, [[0, 'door_creak', .45], [.4, 'cave_drip', .35]]);
// 83 «Aber letzte Nacht»: la plaza de noche, vacía; solo yo, en mi botella, bajo una farola
shot(93.58, 'R', null, L => { town(L, { night: 1 }); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: .02, pose: { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, lean: .15, headX: .25 } }); cara(c, L.T, { expr: 'sad', eyes: 'half', mouth: 'flat' });
  cm([HP.x + 9, 12, HP.z + 22], [HP.x + 6, 9, HP.z + 17], L.k); camera.lookAt(HP.x, 3.4, HP.z); camera.fov = 48; sh(HP, 20); }, [[0, 'cricket', .5], [.2, 'wind', .4]]);
// 84 «hat jemand von unten»: plano bajo: un brillo lila por debajo de mi botella
shot(94.41, 'F', null, L => { town(L, { night: 1 }); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: .02, pose: { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, lean: .15, headX: .25 } }); cara(c, L.T, { eyes: 'closed', mouth: 'flat' });
  const h = show(HOLES[0], HP.x, 0, HP.z); h.userData.set(.35 + Math.sin(L.T * 4) * .1, 0, L.T); h.scale.set(1.4, .2, 1.4);
  cm([HP.x + 2.4, .9, HP.z + 6.5], [HP.x + 2, 1.1, HP.z + 5.8], L.k); camera.lookAt(HP.x, 2.2, HP.z); camera.fov = 46; sh(HP, 12); }, [[0, 'hum_low', .5]]);
// 85 «an meine Flasche geklopft.»: ¡TOC, TOC! la botella da dos saltos; abro los ojos de golpe
shot(95.36, 'C', 'punch', L => { town(L, { night: 1 }); const kn = t => Math.max(0, 1 - Math.abs(L.T - t) / .08); const j = kn(95.75) + kn(96.05); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: 0, pose: { ...GEST.shock } }); c.root.position.y += j * .5; BOTS.forEach(b => { if (b.visible) b.position.y = j * .35; });
  cara(c, L.T, { expr: 'shock', eyes: L.T > 95.7 ? 'wide' : 'half', mouth: L.T > 95.7 ? 'o' : 'flat' }); const h = show(HOLES[0], HP.x, 0, HP.z); h.userData.set(.6 + j * .4, 0, L.T); h.scale.set(1.4, .2, 1.4);
  onFace(c, 8, .4, .4, 42, L.k, 6.8); if (L.T > 95.72) badge('red', 'KLOPF! KLOPF!', W / 2, H * .12, clamp((L.T - 95.72) / .1), 1, 1); sh(HP, 12); }, [[.38, 'knock', .9], [.68, 'knock', .9], [.9, 'braam', .6]]);
