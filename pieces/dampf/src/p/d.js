// ---------- d: la calada eterna (68,4 – 96,2 s) ----------
// Timo con la vape dorada pegada a la boca; el vapor le sale a chorros por los lados; o.calm = sin chorro
function eternal(c, L, o = {}) { const av = armVape(1); actuar(c, 0, [[0, { ...av, headX: -.18 + Math.sin(L.T * 13) * .02, lean: -.05, ...(o.pose || {}) }]], { T: L.T }); c.aR.sh.rotation.y = av.aRy; GOLD.visible = true; GOLD.userData.grip.visible = true;
  GOLD.userData.setGlow(1.1 + Math.sin(L.T * 25) * .4); FACES.push(c); WM.get(c).visible = true; const s = zugS(L.T); WM.get(c).userData.set(secs(s), euro(money(s)), s > 9 ? '#ffd23f' : '#7aff9a');
  cara(c, L.T, { expr: o.expr || 'shock', eyes: o.eyes || 'wide', mouth: 'flat' }); CHEST.material.opacity = Math.min(.8, (o.chest ?? .5) * (.7 + Math.sin(L.T * 9) * .3));
  if (!o.calm) { const m = mouthW(c), f = faceDir(c), side = V(-f.z, 0, f.x); for (const sg of [-1, 1]) SMK.puff(m.clone().addScaledVector(side, sg * .5), side.clone().multiplyScalar(sg).addScaledVector(f, .3).add(V(0, .5, 0)), L.T, L.t0 - 2, L.t1 - L.t0 + 2, { n: o.n ?? 70, pow: o.pow ?? 5, size: o.size ?? 1.6, dens: .8, seed: 90 + sg, life: 2.5 }); }
  return s; }
const zugHUD = L => { const s = zugS(L.T); HUD = { s, e: money(s), col: s > 9 ? '#ffd23f' : '#7aff9a' }; return s; };
const fogCity = (L, dens = .7, y = 6, size = 34, fd = .012) => { scene.fog.color.setRGB(.9, .92, .96); scene.fog.density = fd; SMK.haze(V(-6, y, -10), L.T, 60, 70, 5, 70, size, dens * .6, 77); };

// 58 «Erst passierte nichts.»: la calada empieza… y nada; silencio, grillos
shot(68.40, 'C', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); eternal(c, L, { calm: true, chest: 0, expr: 'confused', eyes: 'side_l' }); zugHUD(L);
  onFace(c, 6, .2, .9, 38, L.k, 5.6); sh(V(KX, 0, 6), 12); }, [[0, 'crickets', .5], [.6, 'tick', .3]]);
// 59 «Dann fing meine Brust an zu brennen,»: el pecho brilla dorado bajo la sudadera, ojos como platos
shot(69.50, 'F', 'slow', L => { use('KI'); inside(.8, 40); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); eternal(c, L, { calm: L.lt < .5, chest: .3 + L.k, n: 30 }); zugHUD(L);
  orbit(V(KX, 5.2, 6), lerp(9, 7, L.k), .3, .05, 40); sh(V(KX, 0, 6), 12); }, [[0, 'flash', .3], [.2, 'fire_crackle', .5], [.5, 'heartbeat', .6]]);
// 60 «und mein Dampfmesser sprang an.»: macro: el medidor se enciende y empieza a contar
shot(71.10, 'C', 'punch', L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3, ...armVape(1) }]], { T: L.T }); c.aR.sh.rotation.y = armVape(1).aRy; GOLD.visible = true; GOLD.userData.grip.visible = true;
  const on = L.lt > .3; const M = WM.get(c); M.visible = true; M.userData.set(on ? secs(zugS(L.T)) : '- - -', on ? euro(money(zugS(L.T))) : 'START', on ? '#7aff9a' : '#ffd23f');
  c.root.updateMatrixWorld(true); const w = M.getWorldPosition(V(0, 0, 0)), q = M.getWorldQuaternion(new THREE.Quaternion()), n = V(0, 0, 1).applyQuaternion(q), p = w.clone().addScaledVector(n, lerp(3.6, 3, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 32); camera.up.copy(V(0, 1, 0).applyQuaternion(q)); camera.lookAt(w); DOF = 1.5; sh(V(KX, 0, 6), 10); }, [[0, 'impact', .4], [.3, 'power_on', .7], [.5, 'tick', .4]]);
// 61 «Eine Sekunde.»: plano medio en el quiosco, el vapor empieza a salir a chorros; HUD 1 s
shot(72.60, 'W', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); eternal(c, L, { n: 40, size: 1.2 }); zugHUD(L);
  orbit(V(KX, 5.4, 6), 12, -.35, .1, 42); sh(V(KX, 0, 6), 14); }, [[0, 'whoosh', .3], [.05, 'steam', .5], [.2, 'tick', .4]]);
// 62 «Zehn Euro.»: le cae un billete de 10 a los pies
shot(73.50, 'C', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); eternal(c, L, { n: 40, size: 1.2 }); zugHUD(L); billDrop(c, L.t0, L.T, 1, 10); POST.push(() => cashPop(c, '+10 €', clamp(L.lt / .2), 'green', 1));
  orbit(V(KX, 5.0, 6), 10.5, .4, .08, 42); sh(V(KX, 0, 6), 14); }, [[0, 'cash', .6], [.1, 'steam', .4]]);
// 63 «Fünf Sekunden.»: salgo dando tumbos a la calle de noche, echando vapor
shot(74.30, 'S', null, L => { use('HB'); darkNight(); show(KIOSKF, -30, 0, -66, 0, 1); const c = put(ich, -30, 0, -60 + L.lt * 1.5, 0); eternal(c, L, { n: 60, pow: 6, pose: walkP(L.T * .7, 0) }); zugHUD(L);
  cm([-26, 6, -42, -30, 5, -60, 44], [-26.5, 6, -45, -30, 5, -59, 44], L.k); sh(V(-30, 0, -60), 16); }, [[0, 'swipe', .3], [.1, 'door_creak', .4], [.3, 'steam', .6]]);
// 64 «Fünfhundert Euro.»: billetes de 50 y uno de 500 caen a mi alrededor
shot(75.20, 'C', 'punch', L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 60, pow: 6 }); zugHUD(L); billDrop(c, L.t0, L.T, 1, 500); billDrop(c, L.t0 + .1, L.T, 10, 50, 2.6); POST.push(() => cashPop(c, '+500 €', clamp(L.lt / .2), 'gold', 1.1));
  orbit(V(-30, 5, -58.6), lerp(12, 10.5, L.k), .25, .1, 42); sh(V(-30, 0, -58), 16); }, [[0, 'cash_reg', .6], [.2, 'money_rain', .4]]);
// 65 «Zehn Sekunden.»: desde arriba: una columna de vapor sube desde mí hacia el cielo
shot(76.40, 'Z', null, L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 50, pow: 9, size: 1.8 }); zugHUD(L); SMK.puff(V(-30, 13, -58.6), V(0, 1, 0), L.T, L.t0 - 2, 4, { n: 50, pow: 12, size: 4, dens: .6, seed: 95, life: 3 });
  cm([-30, 22, -36, -30, 6, -58, 46], [-30, 19, -40, -30, 7, -58, 46], L.k); sh(V(-30, 0, -58), 24); DOF = 0; }, [[0, 'zoom_out', .4], [.1, 'wind_rise', .5]]);
// 66 «Eine Million.»: lluvia de billetes enorme sobre mí
shot(77.20, 'C', 'punch', L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 60, pow: 6 }); zugHUD(L); billRain(V(-30, 2, -58.6), L.T, 180, 20, 16, 18, 5); badge('gold', 'MILLIONÄR!', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1);
  orbit(V(-30, 5, -58.6), lerp(13, 11, L.k), -.2, .1, 44); sh(V(-30, 0, -58), 18); }, [[0, 'money_rain', .8], [.1, 'cheer', .3], [.2, 'coins', .5]]);
// 67 «Aber es hörte nicht auf.»: intento quitarme la vape y no puedo: se queda pegada a los labios
shot(78.10, 'W', null, L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); const s = eternal(c, L, { n: 60, pow: 6, expr: 'worried', eyes: 'scared' }); zugHUD(L); const pull = Math.sin(L.T * 14) * .5 + .5;
  c.aL.sh.rotation.set(-1.4 - pull * .2, 0, .5); c.aL.el.rotation.set(-1.5, 0, 0); sweat(c, L.T, 2); onFace(c, 6.2, .1, .6, 38, L.k, 5.6); sh(V(-30, 0, -58), 14); }, [[0, 'whoosh', .3], [.1, 'strain', .6], [.5, 'tug', .5]]);
// 68 «Zwanzig Sekunden.» (zoom lento): el medidor se vuelve loco; mi cara con el resplandor dorado
shot(79.20, 'F', 'slow', L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 80, pow: 7, chest: 1.2 }); zugHUD(L); badge('gold', `${Math.floor(zugS(L.T))} SEKUNDEN`, W / 2, H * .2, 1, 1, .9);
  onFace(c, 5.4, 0, .2, 38, L.k, 4.2); sh(V(-30, 0, -58), 12); }, [[0, 'flash', .3], [.2, 'glitch', .4], [.5, 'ticks', .5]]);
// 69 «Eine Milliarde.»: MILLIARDE; el dinero me llega por las rodillas
shot(80.60, 'C', 'punch', L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 70, pow: 7 }); zugHUD(L); billRain(V(-30, 2, -58.6), L.T, 180, 18, 14, 18, 5); BILLP[100].slice(0, 30).forEach((b, i) => { const r = RNG(i * 7 + 1); b.visible = true; b.position.set(-30 + (r() - .5) * 9, .1 + r() * .3, -58.6 + (r() - .5) * 7); b.rotation.set(-PI / 2, r() * 6, 0); });
  badge('gold', 'MILLIARDÄR!', W / 2, H * .2, clamp(L.lt / .2), 1, 1.2); orbit(V(-30, 5, -58.6), lerp(12, 10.5, L.k), .3, .14, 44); sh(V(-30, 0, -58), 16); }, [[0, 'boom', .5], [.1, 'money_rain', .7], [.2, 'cash_reg', .6]]);
// 70 «Die ganze Stadt verschwand im Nebel.»: de día, vista aérea: Hufenbach entero bajo un mar de vapor; solo asoman los tejados y la cúpula
shot(81.40, 'Z', 'slow', L => { use('HB'); fogCity(L, .9, 9, 46, .0055 + L.k * .004); setSky([.75, .8, .9], [.85, .88, .94], [.9, .92, .96]);
  cm([60, 70, 110, -6, 8, -30, 46], [40, 55, 90, -6, 8, -30, 46], L.k); sh(V(-6, 0, -20), 60); DOF = 0; }, [[0, 'wind_howl', .6], [.3, 'whoosh_down', .4]]);
// 71 «Autos krachten ineinander,»: en la niebla, el taxi choca contra el deportivo; chispas
shot(83.60, 'C', 'punch', L => { use('HB'); fogCity(L, .5, 4); const k = clamp(L.lt / .35); show(CAR, 22, 0, 20 + (1 - easeIn(k)) * 18, PI, 1); show(TAXI, 30 - (1 - easeIn(k)) * 18, 0, 20, -PI / 2 + (L.lt > .35 ? .3 : 0), 1); if (L.lt > .35) { sparks(V(26, 2.5, 20), L.t0 + .35, L.T, 40, 1.2); CAR.rotation.y = PI + .25; SHAKE = Math.exp(-(L.lt - .35) * 8); }
  cm([10, 6, 36, 25, 2.5, 20, 44], [12, 5.5, 34, 25, 2.5, 20, 44], L.k); sh(V(25, 0, 20), 20); }, [[0, 'car_pass', .5], [.35, 'car_hit', .9], [.4, 'glass_break', .6]]);
// 72 «Ampeln explodierten,»: un semáforo parpadea como loco y estalla en chispas
shot(84.90, 'W', null, L => { use('HB'); fogCity(L, .45, 4); show(AMPEL, 18, 0, 4, -.3, 1); const bad = L.lt > .45; AMPEL.userData.set(bad ? -1 : Math.floor(L.T * 12) % 3); AMPEL.userData.hd.rotation.z = bad ? -.6 : 0; AMPEL.userData.hd.position.y = bad ? 10.4 : 11.2;
  if (bad) { sparks(V(18, 11, 4.6), L.t0 + .45, L.T, 40, 1); grade.uniforms.flash.value = Math.max(0, .8 - (L.lt - .45) * 3); SMK.puff(V(18, 11, 4.6), V(0, 1, .3), L.T, L.t0 + .45, .4, { n: 25, pow: 4, size: 1.6, dens: .7, seed: 81 }); }
  cm([22, 9, 22, 18, 9.5, 4, 42], [21, 9.5, 19, 18, 9.8, 4, 40], L.k); sh(V(18, 0, 4), 16); }, [[0, 'switch', .4], [.2, 'sparks', .5], [.45, 'explosion', .8]]);
// 73 «die Leute klammerten sich an Laternen.»: viento de vapor: la gente agarrada a las farolas, en horizontal como banderas
shot(86.10, 'S', null, L => { use('HB'); fogCity(L, .4, 4, 20); [[EX[3], -30, 40, 0, 8.2], [EX[7], -30, 40, 1, 4.4]].forEach(([e, x, z, i, y]) => { put(e, x + 7.1, y + Math.sin(L.T * 9 + i) * .25, z, 0); e.root.rotation.order = 'YXZ'; e.root.rotation.set(PI / 2 - .12 + Math.sin(L.T * 11 + i) * .08, -PI / 2, 0);
    actuar(e, 0, [[0, { aLx: 3.1, aRx: 3.1, aLz: .05, aRz: .05, aLe: .1, aRe: .1, headX: -.6, lLx: Math.sin(L.T * 14 + i) * .5, lRx: -Math.sin(L.T * 14 + i) * .5 }]], { T: L.T }); cara(e, L.T + i, { expr: 'shock', mouth: 'scream' }); FACES.push(e); });
  SMK.puff(V(-50, 6, 40), V(1, .03, 0), L.T, L.t0 - 2, 4, { n: 60, pow: 18, size: 2.6, dens: .5, seed: 83, life: 2.5 });
  cm([-33, 7, 68, -26, 6.5, 40, 44], [-32.5, 6.8, 64, -26, 6.5, 40, 42], L.k); sh(V(-26, 0, 40), 18); }, [[0, 'wind_howl', .7], [.2, 'scream_girl', .4], [.6, 'shout_crowd', .4]]);
// 74 «Und mein Konto?»: miro el medidor de reojo sin soltar la vape
shot(87.90, 'C', null, L => { use('HB'); fogCity(L, .5, 4); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 50, pow: 6, eyes: 'down', expr: 'confused' }); zugHUD(L); c.aL.sh.rotation.set(-1.7, 0, .25); c.aL.el.rotation.set(-1.3, 0, 0);
  onFace(c, 6.4, .3, -.6, 38, L.k, 5.8); sh(V(-30, 0, -58), 14); }, [[0, 'whoosh_soft', .3], [.2, 'hmm', .4]]);
// 75 «Es stieg einfach weiter.»: macro del medidor: las cifras suben sin parar
shot(88.70, 'C', 'punch', L => { use('HB'); fogCity(L, .5, 4); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { calm: true }); c.aL.sh.rotation.set(-1.7, 0, .25); c.aL.el.rotation.set(-1.3, 0, 0); zugHUD(L);
  c.root.updateMatrixWorld(true); const M = WM.get(c), w = M.getWorldPosition(V(0, 0, 0)), q = M.getWorldQuaternion(new THREE.Quaternion()), n = V(0, 0, 1).applyQuaternion(q), p = w.clone().addScaledVector(n, lerp(3.8, 3, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 32); camera.up.copy(V(0, 1, 0).applyQuaternion(q)); camera.lookAt(w); DOF = 1.5; sh(V(-30, 0, -58), 10); }, [[0, 'impact', .3], [.1, 'count', .6], [.6, 'coins', .4]]);
// 76 «Der Bürgermeister rief mich persönlich an.»: el alcalde, en su despacho, con el teléfono
shot(90.20, 'W', null, L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX, 1.05, -8.6, 0); actuar(c, 0, [[0, { ...SIT, aRx: 1.2, aRz: .5, aRe: 2.3 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.5, .5], [0, 0, 0], .6); talk(c, L.T, L.t0, L.t0 + 2, 'worried'); FACES.push(c);
  orbit(V(BX, 8.0, -8.6), lerp(13, 11, L.k), -.25, .16, 42); sh(V(BX, 0, -6), 20); }, [[0, 'whoosh', .3], [.1, 'phone_ring', .6], [.9, 'click_set', .4]]);
// 77 «persönlich an.»: yo cojo el móvil sin soltar la vape
shot(91.20, 'C', null, L => { use('HB'); fogCity(L, .5, 4); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { calm: false, n: 40, expr: 'confused', eyes: 'side_r' }); zugHUD(L); c.aL.sh.rotation.set(-2.0, 0, .8); c.aL.el.rotation.set(-2.2, 0, 0); attach(PHONE, c.aL.hand, [0, -.5, .5], [0, 0, 0], .6);
  onFace(c, 6, .2, -.5, 38, L.k, 5.4); sh(V(-30, 0, -58), 14); }, [[0, 'phone_ring', .5], [.3, 'click_set', .4]]);
// 78 «Er weinte.»: primer plano del alcalde llorando a mares
shot(92.30, 'C', 'punch', L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX, 1.05, -8.6, 0); actuar(c, 0, [[0, { ...SIT, aRx: 1.2, aRz: .5, aRe: 2.3, headX: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.5, .5], [0, 0, 0], .6); cara(c, L.T, { expr: 'sad', eyes: 'cry', mouth: Math.sin(L.T * 10) > 0 ? 'scream' : 'wavy' }); tears(c, L.T); FACES.push(c);
  onFace(c, 5.2, .2, .4, 38, L.k, 4.6); sh(V(BX, 0, -8), 12); }, [[0, 'impact', .3], [.1, 'cry_girl', .3], [.4, 'sniff', .5]]);
// 79 «Er sagte, ich hätte mehr Geld»: llorando al teléfono, golpea la mesa
shot(93.60, 'S', null, L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX, 1.05, -8.6, 0); const hit = (L.lt % .6) < .15; actuar(c, 0, [[0, { ...SIT, aRx: 1.2, aRz: .5, aRe: 2.3, aLx: hit ? 1.0 : 1.6, aLe: .3, lean: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.5, .5], [0, 0, 0], .6); talk(c, L.T, L.t0, L.t0 + 1.3, 'sad', { eyes: 'cry' }); tears(c, L.T); FACES.push(c);
  orbit(V(BX, 7.6, -8.6), lerp(12, 10.5, L.k), .35, .14, 42); sh(V(BX, 0, -8), 18); }, [[0, 'swipe', .3], [.1, 'table_bang', .5], [.7, 'table_bang', .4]]);
// 80 «als das ganze Land.»: en la pantalla: TIMO contra DEUTSCHLAND, mi barra se sale
shot(94.90, 'C', 'punch', L => { use('HB'); fogCity(L, .3, 3); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#101a3a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `700 56px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('VERMÖGEN', w / 2, 52); const k = clamp(L.lt / .9); [['DEUTSCHLAND', .42, '#3ab8ff'], ['TIMO', .42 + .55 * easeOut(k), '#ffd23f']].forEach(([n, v, col], i) => { const y = 200 + i * 190; c.fillStyle = col; c.beginPath(); c.roundRect(60, y - 50, (w - 120) * Math.min(1, v), 100, 20); c.fill(); c.font = `700 52px ${FONT}`; c.fillStyle = '#ffffff'; c.textAlign = 'left'; c.fillText(n, 80, y - 80 + 10); c.textAlign = 'center'; }); });
  cm([10, 8.4, -8, 10, 9.6, -50, 46], [10, 8.6, -11, 10, 9.8, -50, 46], L.k); sh(V(10, 0, -44), 28); DOF = 0; }, [[0, 'impact', .4], [.2, 'riser_short', .4], [.9, 'ding_reveal', .5]]);
