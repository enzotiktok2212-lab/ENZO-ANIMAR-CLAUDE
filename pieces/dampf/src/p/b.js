// ---------- b: la ciudad se adapta (15,4 – 37,7 s) ----------
const SIT = { lLx: 1.5, lRx: 1.5, lLk: 1.45, lRk: 1.45, hipY: 2.05 };
// sentados en el banco de la plaza (-36, 20) que mira a +x: asientos a lo largo de z
const BK = V(2, 0, 46);
const benchSit = (c, L, dx, i, o = {}) => { show(BANK, BK.x, 0, BK.z, 0, 1); put(c, BK.x + dx, -.62, BK.z + .3, 0); return vapeLoop(c, L, i, { pose: SIT, expr: o.expr || 'neutral', per: 3.2 + i * .4, meter: true, bg: false, ...o }); };
const STELLEN = (c, w, h) => { c.fillStyle = '#fff8e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a4a7a'; c.fillRect(0, 0, w, 110); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 70px ${FONT}`; c.fillStyle = '#fff'; c.fillText('STELLENANGEBOT', w / 2, 58);
  c.font = `700 92px ${FONT}`; c.fillStyle = '#d8323a'; c.fillText('DAMPFER (m/w/d)', w / 2, 220); c.font = `700 52px ${FONT}`; c.fillStyle = '#1a1a2a'; c.fillText('Lohn: 10 € pro Sekunde', w / 2, 340); c.fillText('Erfahrung: keine', w / 2, 420); c.fillStyle = '#2ab86a'; c.fillText('Sofort anfangen!', w / 2, 510); };

// 15 «Deshalb ist Dampfen in dieser Stadt»: el funcionario de traje, maletín y vape, va a «trabajar» con la placa DAMPFER
shot(15.40, 'W', null, L => { town(L, 12, 30, 10, 7, 16, 41); const c = put(beam, 30, 0, 10, -.35); const ph = vaper(c, L, L.t0 + .1, .8, { expr: 'smug', meter: true, exh: 1.2 });
  badge3('tag', 'BERUF: DAMPFER', hp(c).add(V(0, 3.3, 0)), clamp(L.lt / .3), .9); onFace(c, 8.6, -.4, 0, 40, L.k, 7.6); sh(V(30, 0, 10), 16); }, [[0, 'whoosh', .4], [.15, 'briefcase', .5], [.45, 'vape_in', .6]]);
// 16 «ein richtiger Beruf.»: el cartel de oferta de empleo en la pantalla; la gente hace cola para apuntarse
shot(16.70, 'F', null, L => { use('HB'); show(BOARD, 10, 0, -50, 0, 1); BOARD.userData.draw(STELLEN); vapeCrowd(L, 10, -38, 12, 5, 12, 43, { face: V(10, 14, -50), gap: 1.4 });
  cm([10, 9, -14, 10, 16, -50, 46], [10, 8, -18, 10, 15.5, -50, 44], L.k); sh(V(10, 0, -42), 30); DOF = 0; }, [[0, 'flash', .4], [.1, 'pages', .5], [.5, 'murmur', .4]]);
// 17 «Niemand arbeitet mehr.»: la panadería con «GESCHLOSSEN»; el panadero sentado en la puerta vapeando
shot(18.00, 'S', null, L => { use('HB'); const c = put(XT[3], -50.5, 0, 12, PI / 2); vaper(c, L, L.t0 + .1, .8, { expr: 'smug', exh: 1.1, extra: { lean: -.08 } }); badge3('red', 'GESCHLOSSEN', V(-53.5, 11, 12), clamp(L.lt / .25), .8);
  vapeCrowd(L, -46, 12, 6, 8, 14, 45, { gap: 1.5 }); orb(L.k, V(-51, 5.4, 12), null, [15, 1.25, .1, 44], [13, 1.4, .08, 44]); sh(V(-50, 0, 12), 20); }, [[0, 'swipe', .4], [.1, 'door_close', .5], [.4, 'sigh', .4]]);
// 18 «Die Leute sitzen den ganzen Tag auf Bänken,»: tres vecinos en el banco, cada uno con su nube
shot(19.20, 'C', null, L => { use('HB'); [[EX[12], -4.6, 0], [EX[13], 0, 1], [EX[14], 4.6, 2]].forEach(([c, dz, i]) => benchSit(c, L, dz, i)); vapeCrowd(L, BK.x, BK.z - 8, 8, 6, 14, 47, { gap: 1.6 });
  orb(L.k, V(BK.x, 4.0, BK.z), null, [24, .62, .1, 44], [21, .5, .08, 44]); sh(V(BK.x, 0, BK.z), 18); }, [[0, 'thud', .4], [.2, 'vape_out', .5], [.8, 'vape_out', .4]]);
// 19 «ziehen und»: primer plano de la vecina del medio dando una calada
shot(21.30, 'Z', null, L => { use('HB'); [[EX[12], -4.6, 0], [EX[14], 4.6, 2]].forEach(([c, dz, i]) => benchSit(c, L, dz, i, { bg: true })); const c = EX[13]; put(c, BK.x, -.62, BK.z + .3, 0); vaper(c, L, L.t0, .5, { pose: SIT, expr: 'smug', meter: true, exh: .9 });
  onFace(c, 5.6, .2, 0, 38, L.k, 5); sh(V(BK.x, 0, BK.z), 14); }, [[0, 'zoom_in', .4], [.1, 'vape_in', .6], [.6, 'vape_out', .5]]);
// 20 «warten auf ihr Geld.»: mira su Dampfmesser; le cae un billete de 10 al regazo
shot(22.20, 'C', 'punch', L => { use('HB'); const c = EX[13]; show(BANK, BK.x, 0, BK.z, 0, 1); put(c, BK.x, -.62, BK.z + .3, 0); actuar(c, 0, [[0, { ...SIT, aLx: .85, aLz: -.55, aLe: 1.5, headX: .45, headY: .25 }]], { T: L.T }); VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; FACES.push(c);
  const m = WM.get(c); m.visible = true; m.userData.set('0,9 s', '+10 €'); cara(c, L.T, { expr: 'smug', eyes: 'down', mouth: 'smile' }); billDrop(c, L.t0 + .1, L.T, 1, 10);
  [[EX[12], -4.6, 0], [EX[14], 4.6, 2]].forEach(([e, dz, i]) => benchSit(e, L, dz, i, { bg: true })); onFace(c, 6.2, .8, -.5, 38, L.k, 5.6); sh(V(BK.x, 0, BK.z), 14); }, [[0, 'thump', .4], [.1, 'notif', .6], [.3, 'cash', .5]]);
// 21 «Mein Nachbar kaufte sich einen Sportwagen,»: el vecino junto a su deportivo amarillo, enseñando la llave
shot(23.00, 'W', null, L => { town(L, 8, 30, 40, 9, 16, 49); show(CAR, 26, 0, 40, .5, 1); const c = put(nach, 31, 0, 44, -.3); actuar(c, 0, [[0, { aLx: 2.4, aLz: .2, aLe: .3, aRx: .6, aRz: -.2, aRe: 1.0 }]], { T: L.T }); laughF(c, L.T); FACES.push(c);
  VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; const k = textPlane; badge3('gold', 'NEU!', V(26, 8, 40), clamp(L.lt / .3), .9);
  orb(L.k, V(28.5, 4.5, 42), null, [22, -.1, .12, 46], [19, .1, .1, 46]); sh(V(28, 0, 42), 22); }, [[0, 'whoosh', .4], [.1, 'car', .6], [.6, 'keys', .5]]);
// 22 «nachdem er drei Pods»: tres pods vacíos caen sobre el capó: 1, 2, 3
shot(24.70, 'C', 'punch', L => { town(L, 6, 30, 40, 9, 16, 49); show(CAR, 26, 0, 40, .5, 1); const c = put(nach, 30, 0, 36, -.4); vaper(c, L, L.t0 - .4, 1.4, { expr: 'smug', meter: true });
  const n = Math.min(3, 1 + Math.floor(L.lt / .38)); badge('gold', `${n} PODS`, W / 2, H * .17, 1, 1, 1);
  for (let i = 0; i < 3; i++) { const v = BILLP[50][i]; }   // (sin billetes aquí)
  onFace(c, 7, 0, 0, 40, L.k, 6.2); sh(V(28, 0, 38), 18); }, [[0, 'impact', .4], [.05, 'pop', .5], [.43, 'pop', .5], [.81, 'pop', .6]]);
// 23 «leer gezogen hatte.»: arranca el deportivo y se va dejando una nube de vapor
shot(25.90, 'S', null, L => { use('HB'); const x = 26 + easeIn(clamp(L.lt / 1.2)) * 30; show(CAR, x, 0, 40, PI / 2, 1);   SMK.puff(V(x - 6, 1.2, 40), V(-1, .2, 0), L.T, L.t0, 1.2, { n: 50, pow: 4, size: 2, dens: .8, seed: 7 });
  cm([20, 5, 62, 28, 3.5, 40, 44], [24, 5, 60, 38, 3.5, 40, 44], L.k); sh(V(32, 0, 40), 26); DOF = 0; }, [[0, 'swipe', .3], [.1, 'car', .8], [.4, 'vape_out', .4]]);
// 24 «Meine Lehrerin zog während der Mathearbeit»: el aula; la profesora vapea en su mesa mientras los alumnos sudan con el examen
shot(27.10, 'Z', null, L => { use('KL'); inside(1, 60); KL.BB.userData.draw('mathe', (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 70px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('MATHEARBEIT', w / 2, 70); c.font = `700 52px ${FONT}`; c.fillText('12 × 17 = ?', w / 2, 170); c.fillText('√144 = ?', w / 2, 240); });
  const c = put(kess, CX - 8, 0, -6.6, .2); vaper(c, L, L.t0 + .1, 1.1, { expr: 'smug', meter: true, exh: 1.2 });
  [[EX[15], -11, -2], [EX[16], 0, -2], [EX[17], 11, -2], [EX[18], -11, 6], [EX[19], 0, 6], [EX[21], 11, 6]].forEach(([e, x, z], i) => { put(e, CX + x, 0, z - 1.6, PI); actuar(e, 0, [[0, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: .9, aRe: .9, headX: .4 }]], { T: L.T }); cara(e, L.T + i, { expr: 'worried' }); e.root.position.y = -.62; });
  orb(L.k, V(CX - 8, 5.4, -6.6), null, [17, .35, .16, 44], [14, .25, .12, 44]); sh(V(CX - 6, 0, -4), 26); }, [[0, 'zoom_in', .4], [.1, 'classroom', .4], [.2, 'pencil', .5], [.5, 'vape_in', .5]]);
// 25 «und kaufte aus Versehen»: su Dampfmesser: «SCHULE GEKAUFT ✓»; ella se sorprende
shot(29.00, 'C', 'punch', L => { use('KL'); inside(1, 60); const c = put(kess, CX - 8, 0, -6.6, .2); actuar(c, 0, [[0, { aLx: 1.6, aLz: -.3, aLe: 1.4, ...armVape(.1), headX: .3 }]], { T: L.T }); c.aR.sh.rotation.y = armVape(.1).aRy; VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; FACES.push(c);
  const m = WM.get(c); m.visible = true; m.userData.set('SCHULE', 'GEKAUFT ✓', '#ffd23f'); cara(c, L.T, { expr: 'shock', eyes: L.lt > .3 ? 'wide' : 'down', mouth: L.lt > .3 ? 'o' : 'flat' }); badge('gold', 'SCHULE GEKAUFT!', W / 2, H * .18, clamp((L.lt - .25) / .25), 1, .9);
  onFace(c, 6.4, .3, 0, 38, L.k, 5.6); sh(V(CX - 8, 0, -6), 14); }, [[0, 'thump', .4], [.1, 'notif', .6], [.3, 'gasp_f', .6]]);
// 26 «die ganze Schule.»: la fachada del Gymnasium con la pancarta VERKAUFT; ella delante, alucinando
shot(30.00, 'W', null, L => { use('GY'); const c = put(kess, GX, 0, 22, 0); actuar(c, 0, [[0, GEST.hands_head]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); FACES.push(c); GY.SOLD.scale.setScalar(spring(clamp(L.lt / .5))); GY.SOLD.position.y = 25;
  vapeCrowd(L, GX, 26, 10, 7, 14, 51, { gap: 1.4 }); cm([GX, 8, 62, GX, 18, 0, 46], [GX, 7, 54, GX, 17, 0, 46], L.k); sh(V(GX, 0, 20), 40); DOF = 0; }, [[0, 'whoosh', .4], [.2, 'stamp', .7], [.4, 'kids_laugh', .4]]);
// 27 «Und der Bürgermeister?» (zoom lento): el Rathaus envuelto en una nube espesa
shot(31.10, 'F', 'slow', L => { use('HB'); SMK.haze(V(-6, 22, -84), L.T, 40, 26, 9, 8, 10, .55, 21); vapeCrowd(L, -6, -66, 10, 6, 16, 53, { gap: 1.3 });
  cm([-6, 12, -30, -6, 20, -92, 44], [-6, 13, -40, -6, 21, -92, 42], L.k); sh(V(-6, 0, -70), 40); DOF = 0; }, [[0, 'flash', .4], [.1, 'bell_far', .5]]);
// 28 «Der hat seit acht Jahren keine frische Luft mehr geatmet.»: el despacho lleno de vapor, ventana sellada con cinta; el alcalde vapea en su sillón
shot(32.10, 'Z', null, L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX, 1.05, -8.6, 0); vaper(c, L, L.t0 + .1, 1.4, { pose: SIT, expr: 'smug', meter: true, exh: 1.4, pow: 4, size: 1.5 });
  SMK.haze(V(BX, 9, -4), L.T, 30, 16, 5, 9, 6, .28, 23);
  orb(L.k, V(BX, 8.0, -8.6), null, [15, .3, .2, 44], [12, .2, .16, 44]); sh(V(BX, 0, -6), 24); }, [[0, 'zoom_in', .4], [.2, 'vape_in', .5], [1.5, 'vape_out', .5]]);
// 29 «frische Luft mehr geatmet.»: la ventana con FENSTER NIE ÖFFNEN y el contador de días
shot(33.40, 'S', null, L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX - 6.5, 0, -11.5, .3); vaper(c, L, L.t0 - .8, 1, { expr: 'smug', exh: 1.3 }); SMK.haze(V(BX, 9, -8), L.T, 22, 14, 4, 4, 6, .22, 25);
  badge('red', '2.920 TAGE', W / 2, H * .16, clamp(L.lt / .3), 1, 1); badge('tag', 'ohne frische Luft', W / 2, H * .23, clamp((L.lt - .15) / .3), 1, .9);
  cm([BX - 3.5, 8.6, 5, BX - 4.6, 7.4, -13, 44], [BX - 3.8, 8.4, 2.5, BX - 4.6, 7.4, -13, 42], L.k); sh(V(BX - 4, 0, -10), 20); }, [[0, 'swipe', .4], [.2, 'tape', .5], [.6, 'tick', .4]]);
// 30 «Er ist der reichste Mann der Stadt.»: el ranking de la ciudad en la pantalla gigante; el alcalde (n.º 1) posa delante con su cadena dorada
const RANK1 = [['Bürgermeister Brandt', '84 Mio. €'], ['Sabine Krüger', '61 Mio. €'], ['Lukas Hoffmann', '47 Mio. €'], ['Anna Wagner', '39 Mio. €'], ['Jonas Becker', '28 Mio. €'], ['Marie Schulz', '21 Mio. €']];
shot(34.80, 'C', 'punch', L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => drawRank(c, w, h, 'REICHSTE DAMPFER', RANK1, 0, L.lt / .8));
  const c = put(mayor, 10, 0, -27, 0); vaper(c, L, L.t0 + .3, .7, { expr: 'smug', meter: true }); vapeCrowd(L, 10, -34, 10, 5, 12, 55, { face: c.root.position, gap: 1.5 });
  cm([10, 8.4, -8, 10, 8.6, -46, 46], [10, 8.6, -12, 10, 8.8, -46, 46], L.k); sh(V(10, 0, -44), 28); DOF = 0; }, [[0, 'impact', .4], [.1, 'ding_reveal', .5], [.3, 'cash_reg', .5]]);
// 31 «Aber es gibt ein Problem.» (zoom lento): dos policías con escáneres de vapor avanzan por la plaza; todo se oscurece
shot(36.50, 'I', 'slow', L => { use('HB'); COP.forEach((c, i) => { put(c, -8 + i * 5, 0, -1 + L.lt * 2.4, 0); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'flat' }); FACES.push(c); }); vapeCrowd(L, -5.5, -2, 8, 7, 14, 57, { gap: 1.5 });
  orb(L.k, V(-5.5, 5, 2), null, [14, 0, .05, 44], [11, 0, .04, 42]); DARK = .25 * L.k; sh(V(-5.5, 0, 2), 20); }, [[0, 'iris_pop', .4], [.1, 'steps_heavy', .6]]);
