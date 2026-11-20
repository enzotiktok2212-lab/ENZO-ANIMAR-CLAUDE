// ---------- c: la ley, yo y el quiosco (37,7 – 68,4 s) ----------
const meterClose = (c, L, a, b, col) => { const m = WM.get(c); m.visible = true; m.userData.set(a, b, col); };
// 32 «Die Regierung nimmt das sehr ernst.»: el funcionario del Amt für Dampf da un discurso ante el Rathaus
shot(37.70, 'W', null, L => { use('HB'); show(PODIUM, -6, 0, -65.6, 0, .72); show(BANNER, -6, 15, -73, 0, 1); const c = put(beam, -6, 0, -68.6, 0); talk(c, L.T, L.t0, L.t0 + 2, 'angry'); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.1, aRe: .4, aLx: .5, aLe: .8 }], [.5, { aRx: .6, aRe: 1.6, aLx: 1.2, aLe: .3 }]], { T: L.T }); FACES.push(c);
  
  orb(L.k, V(-6, 7.4, -68.6), null, [15, .1, .22, 44], [12.5, -.05, .18, 44]); sh(V(-6, 0, -66), 26); }, [[0, 'whoosh', .3], [.2, 'murmur', .4], [.8, 'table_bang', .5]]);
// 33 «sehr ernst.»: primer plano serio; sella con un golpe «STRENG KONTROLLIERT»
shot(38.70, 'C', 'punch', L => { use('HB'); show(PODIUM, -6, 0, -65.6, 0, .72); show(BANNER, -6, 15, -73, 0, 1); const c = put(beam, -6, 0, -68.6, 0); const hit = L.lt > .35;
  actuar(c, 0, [[0, { aRx: hit ? .9 : 1.7, aRe: hit ? .5 : 1.4, lean: hit ? .15 : 0 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'flat' }); FACES.push(c);
  badge('red', 'STRENG KONTROLLIERT', W / 2, H * .2, clamp((L.lt - .35) / .2), 1, .8); onFace(c, 5.2, 2.2, .5, 38, L.k, 4.6); sh(V(-6, 0, -66), 14); }, [[0, 'impact', .4], [.35, 'stamp', .8]]);
// 34 «Jeder trägt einen Dampfmesser am Handgelenk,»: tres vecinos (abuela, chico, obrero) levantan la muñeca con su Dampfmesser
shot(39.70, 'Z', null, L => { use('HB'); [[XT[4], -4], [EX[22], 0], [XT[3], 4]].forEach(([c, x], i) => { put(c, x - 6, 0, 8, 0); const up = easeOut(clamp((L.lt - i * .15) / .35)); actuar(c, 0, [[0, { aLx: lerp(.2, 1.7, up), aLz: lerp(0, -.25, up), aLe: lerp(.2, 1.3, up) }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'joy', mouth: 'smile' }); meterClose(c, L, '0,0 s', '0 €'); FACES.push(c); });
  vapeCrowd(L, -6, 2, 8, 8, 14, 63, { gap: 1.5 }); orb(L.k, V(-6, 5, 8), null, [17, 0, .1, 44], [14, 0, .08, 44]); sh(V(-6, 0, 8), 18); }, [[0, 'zoom_in', .3], [.2, 'watch_click', .5], [.4, 'watch_click', .4], [.6, 'watch_click', .4]]);
// 35 «am Handgelenk,»: macro del Dampfmesser en la muñeca de la abuela (la pantalla cuenta)
shot(40.70, 'C', null, L => { use('HB'); const c = put(XT[4], -10, 0, 8, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'smile' }); const s = (L.lt * 1.4) % 3; meterClose(c, L, secs(s), euro(money(s)));
  c.root.updateMatrixWorld(true); const M = WM.get(c), w = M.getWorldPosition(V(0, 0, 0)), n = V(0, 0, 1).applyQuaternion(M.getWorldQuaternion(new THREE.Quaternion())), p = w.clone().addScaledVector(n, lerp(4.2, 3.4, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 32); camera.up.copy(V(0, 1, 0).applyQuaternion(M.getWorldQuaternion(new THREE.Quaternion()))); camera.lookAt(w); DOF = 1.4; sh(V(-10, 0, 8), 12); }, [[0, 'tick', .5], [.3, 'tick', .4], [.6, 'tick', .4]]);
// 36 «und wer Dampf fälscht,»: un tipo hace «vapor» con un hervidor escondido; su Dampfmesser se pone rojo: FÄLSCHUNG!
shot(41.70, 'S', null, L => { use('HB'); const c = put(nebel, 24, 0, -20, -.4); actuar(c, 0, [[0, { aRx: .9, aRe: 1.2, aLx: 1.6, aLz: -.3, aLe: 1.3, headX: .25 }]], { T: L.T }); show(FOG, 25.6, 0, -18.4, -.4, .8); SMK.puff(V(25.4, 1.4, -17.4), V(.2, .6, 1), L.T, L.t0, 1, { n: 40, pow: 3, size: 1.6, dens: .8, seed: 31 }); FACES.push(c);
  const bad = L.lt > .5; meterClose(c, L, bad ? 'FAKE!' : '0,8 s', bad ? 'FÄLSCHUNG' : '8 €', bad ? '#ff3a3a' : '#7aff9a'); cara(c, L.T, { expr: bad ? 'shock' : 'smug', mouth: bad ? 'o' : 'smirk' }); if (bad) badge('red', 'FÄLSCHUNG!', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1);
  orb(L.k, V(24.6, 4.6, -19.4), null, [13, -.3, .12, 44], [11.5, -.15, .1, 44]); sh(V(24, 0, -20), 16); }, [[0, 'swipe', .3], [.1, 'steam', .6], [.5, 'alarm', .6]]);
// 37 «kommt sofort ins Gefängnis.»: la cárcel; dos policías meten al tramposo por la verja
shot(42.70, 'F', null, L => { use('KN'); const z = 6 - L.lt * 3.4; put(nebel, JX, 0, z, PI); actuar(nebel, 0, [[0, { ...walkP(L.T, 0), aLx: -.4, aRx: -.4, aLz: .3, aRz: .3 }]], { T: L.T }); cara(nebel, L.T, { expr: 'sad', mouth: 'frown' });
  COP.forEach((c, i) => { put(c, JX + (i ? 2.6 : -2.6), 0, z + 1.2, PI); actuar(c, 0, [[0, { ...walkP(L.T, i + 1), aRx: 1.2, aRz: i ? .4 : -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'angry' }); });
  KN.gate.position.x = clamp(L.lt / .6) * 11; cm([JX + 2, 9, 38, JX, 10, -6, 46], [JX + 1.5, 8.5, 31, JX, 9.5, -6, 46], L.k); sh(V(JX, 0, 0), 30); DOF = 0; }, [[0, 'flash', .4], [.1, 'siren', .5], [.3, 'metal_creak', .5], [1.1, 'door_slam', .6]]);
// 38 «Letzten Monat hat ein Mann eine Nebelmaschine benutzt.»: de noche, el tipo con su NEBEL 3000 llena la plaza de niebla, sonriendo
shot(44.10, 'R', null, L => { use('HB'); darkNight(); const c = put(nebel, -20, 0, 30, .5); actuar(c, 0, [[0, { aRx: .8, aRz: -.2, aRe: .9, headX: .1, aLx: 2.4, aLe: .3 }]], { T: L.T }); grin(c, L.T); FACES.push(c);
  show(FOG, -17.2, 0, 31.4, .6, 1.2); SMK.puff(V(-16.4, 1.6, 33), V(.5, .3, 1), L.T, L.t0 - 1.5, 4, { n: 90, pow: 5, size: 2.6, dens: .75, seed: 33, life: 4 }); meterClose(c, L, '9,9 s', '980.000 €', '#ffd23f');
  orb(L.k, V(-19, 5, 30.6), null, [16, .1, .12, 44], [13, .3, .1, 44]); sh(V(-19, 0, 31), 18); }, [[0, 'whirl', .4], [.1, 'steam', .7], [.6, 'evil_laugh', .4]]);
// 39 «benutzt.»: los policías lo pillan con la linterna; el Dampfmesser marca FAKE en rojo
shot(45.20, 'C', 'punch', L => { use('HB'); darkNight(); const c = put(nebel, -20, 0, 30, .5); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' }); show(FOG, -17.2, 0, 31.4, .6, 1.2); FACES.push(c);
  COP.forEach((p, i) => { put(p, -20 + (i ? 4.6 : -4.6), 0, 33, i ? -.8 : .8); actuar(p, 0, [[0, { aRx: 1.6, aRe: .2, aRz: i ? .3 : -.3 }]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'shout' }); });
  meterClose(c, L, 'FAKE!', 'FÄLSCHUNG', '#ff3a3a'); TINT = Math.sin(L.T * 18) > 0 ? 'rgba(255,40,40,.12)' : 'rgba(40,80,255,.12)'; onFace(c, 8, .3, 0, 40, L.k, 7); sh(V(-20, 0, 31), 16); }, [[0, 'siren', .7], [.1, 'gasp', .5], [.4, 'shout_m', .4]]);
// 40 «Fünfundzwanzig Jahre.» (zoom lento): detrás de las rejas, triste; 25 JAHRE
shot(46.30, 'I', 'slow', L => { use('KN'); const c = put(nebel, JX - 15, 0, -13.6, 0); show(BARS, JX - 14.4, 0, -11.6, 0, 1); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .32, aRz: .32, aLe: .7, aRe: .7, headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); tears(c, L.T); FACES.push(c);
  badge('red', '25 JAHRE', W / 2, H * .18, clamp(L.lt / .3), 1, 1.2); const h = hp(c); cm([h.x + .5, h.y + .3, h.z + 9, h.x, h.y - .6, h.z, 36], [h.x + .3, h.y + .2, h.z + 7, h.x, h.y - .5, h.z, 34], L.k); sh(V(JX - 15, 0, -14), 14); }, [[0, 'iris_pop', .4], [.2, 'metal_hit', .5], [.6, 'sad_tone', .5]]);
// 41 «Und ich?»: yo (Timo) en la plaza, me giro a cámara
shot(47.80, 'C', 'punch', L => { town(L, 12, 2, -4, 7, 16, 65); const c = put(ich, 2, 0, 2, lerp(-1.4, 0, easeOut(clamp(L.lt / .3)))); actuar(c, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral', mouth: 'flat' }); FACES.push(c);
  onFace(c, 6.6, .2, 0, 40, L.k, 6); sh(V(2, 0, 2), 14); }, [[0, 'thump', .5], [.1, 'whoosh_soft', .3]]);
// 42 «Ich war komplett pleite.»: en mi cuarto, abro la cartera vacía; el Dampfmesser marca 0 €; una polilla sale volando
shot(48.70, 'S', null, L => { use('ZI'); inside(1, 60); const c = put(ich, ZX, 0, -2, 0); actuar(c, 0, [[0, { aLx: .5, aRx: .5, aLz: -.25, aRz: -.25, aLe: .9, aRe: .9, headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown', eyes: 'down' }); FACES.push(c);
  c.root.updateMatrixWorld(true); const hl = c.aL.hand.getWorldPosition(V(0, 0, 0)), hr = c.aR.hand.getWorldPosition(V(0, 0, 0)); show(WALLET, (hl.x + hr.x) / 2, (hl.y + hr.y) / 2 + .1, (hl.z + hr.z) / 2 + .3, 0, 1.2); meterClose(c, L, '0,0 s', '0 €', '#ff5a5a');
  badge('red', '0 €', W / 2, H * .18, clamp(L.lt / .3), 1, 1.2); onFace(c, 8.6, -.2, 0, 40, L.k, 7.8); sh(V(ZX, 0, -2), 16); }, [[0, 'swipe', .3], [.2, 'zip', .5], [.5, 'sad_tone', .4]]);
// 43 «Denn ich habe schwache Lungen,»: me doy un puff del inhalador azul
shot(50.10, 'C', null, L => { use('ZI'); inside(1, 60); const c = put(ich, ZX, 0, -2, 0); const up = easeOut(clamp(L.lt / .25)); actuar(c, 0, [[0, { aLx: lerp(.3, 1.5, up), aLz: lerp(0, -.75, up), aLe: lerp(.2, 2.3, up), headX: -.05 }]], { T: L.T }); INH.visible = true; FACES.push(c);
  cara(c, L.T, { expr: 'worried', eyes: L.lt > .35 ? 'closed' : 'worried', mouth: 'flat' }); onFace(c, 5.8, .2, 1.4, 38, L.k, 5.2); sh(V(ZX, 0, -2), 12); }, [[0, 'impact_soft', .3], [.3, 'breath', .5], [.35, 'steam', .3]]);
// 44 «seit ich geboren bin.»: recuerdo en sepia: yo de pequeño con el inhalador
shot(51.00, 'F', null, L => { use('ZI'); inside(1, 60); const c = put(ich, ZX, 0, -2, 0); c.root.scale.setScalar(.55); actuar(c, 0, [[0, { aLx: 1.5, aLz: -.75, aLe: 2.3 }]], { T: L.T }); INH.visible = true; cara(c, L.T, { expr: 'sad', eyes: 'wide', mouth: 'o' }); FACES.push(c);
  grade.uniforms.sepia.value = .85; grade.uniforms.vig.value = .7; const h = hp(c); cm([h.x + .4, h.y + .6, h.z + 7, h.x, h.y - .8, h.z, 38], [h.x + .2, h.y + .5, h.z + 6, h.x, h.y - .7, h.z, 36], L.k); sh(V(ZX, 0, -2), 12); }, [[0, 'flash', .5], [.2, 'musicbox2', .4]]);
// 45 «Während alle anderen riesige Wolken machten,»: la plaza entera echa nubes enormes a la vez; yo en medio, pequeño
shot(52.10, 'W', null, L => { town(L, 22, -6, -2, 5, 18, 67, { gap: .9 }); EX.slice(0, 6).forEach(e => { if (e.root.visible) SMK.puff(mouthW(e), smokeDir(e, .5), L.T, L.t0 + .1, 1.6, { n: 26, pow: 7, size: 2.4, dens: .8, seed: e.seed + 3 }); });
  const c = put(ich, -6, 0, 4, 0); actuar(c, 0, [[0, { aLx: .1, aRx: .1, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'flat', eyes: 'up' }); FACES.push(c);
  cm([-6, 26, 30, -6, 3, 0, 46], [-6, 18, 24, -6, 4, 2, 46], L.k); sh(V(-6, 0, 0), 30); DOF = 0; }, [[0, 'whoosh', .3], [.1, 'vape_out', .6], [.4, 'vape_out', .5], [.8, 'cheer', .3]]);
// 46 «schaffte ich anderthalb Sekunden.»: mi calada: 1,5 s y la cara roja del esfuerzo
shot(54.20, 'C', 'punch', L => { town(L, 8, -6, -2, 7, 14, 69, { gap: 1.5 }); const c = put(ich, -6, 0, 4, 0); vaper(c, L, L.t0 - .25, 1.5, { expr: 'determined', meter: true, eyes: 'squint', exh: .5, size: .5, n: 12, pow: 2 });
  const s = clamp(L.lt - .05, 0, 1.5); HUD = { s, e: s * 10 / 3 }; meterClose(c, L, secs(s), euro(s * 10 / 3)); sweat(c, L.T, 2); onFace(c, 5.8, .1, 0, 38, L.k, 5.2); sh(V(-6, 0, 4), 12); }, [[0, 'impact', .4], [.1, 'vape_in', .6], [.6, 'strain', .5]]);
// 47 «Fünf Euro.»: me cae un billete de 5 €, triste
shot(56.00, 'S', null, L => { town(L, 8, -6, -2, 7, 14, 69, { gap: 1.5 }); const c = put(ich, -6, 0, 4, 0); actuar(c, 0, [[0, { aLx: .9, aLz: -.1, aLe: 1.3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); FACES.push(c); VP.get(c).visible = true; VP.get(c).userData.grip.visible = true;
  HUD = { s: 1.5, e: 5 }; meterClose(c, L, '1,5 s', '5 €'); billDrop(c, L.t0, L.T, 1, 5); POST.push(() => cashPop(c, '+5 €', clamp(L.lt / .2), 'tag', .9)); orbit(V(-6, 4.2, 4), lerp(10, 9, L.k), .25, .06, 40); sh(V(-6, 0, 4), 14); }, [[0, 'swipe', .3], [.1, 'coin_flip', .5], [.4, 'sad_tone', .3]]);
// 48 «Dann musste ich husten.»: me doblo tosiendo; bocanadas pequeñas
shot(56.70, 'C', 'punch', L => { town(L, 10, -6, -2, 7, 15, 71, { gap: 1.5 }); const c = put(ich, -6, 0, 4, 0); const k = Math.abs(Math.sin(L.T * 9)); actuar(c, 0, [[0, { lean: .35 + k * .15, headX: .3 + k * .2, aLx: 1.0, aLz: -.6, aLe: 2.0, aRx: .5, aRe: .8 }]], { T: L.T }); FACES.push(c);
  cara(c, L.T, { expr: 'worried', eyes: 'closed', mouth: k > .5 ? 'scream' : 'grimace' }); VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; for (let i = 0; i < 4; i++) SMK.puff(mouthW(c), smokeDir(c, .1), L.T, L.t0 + i * .26, .08, { n: 5, pow: 3, size: .5, dens: .5, seed: 40 + i, life: 1 });
  onFace(c, 6.6, .4, .2, 40, L.k, 6); sh(V(-6, 0, 4), 12); }, [[0, 'cough', .8], [.3, 'cough', .7], [.6, 'cough', .7]]);
// 49 «husten.»: la gente me señala y se ríe
shot(57.60, 'W', null, L => { town(L, 0); [[EX[2], -4.4], [EX[6], 0], [XT[1], 4.4]].forEach(([e, x], i) => { put(e, -6 + x, 0, -6, 0); actuar(e, 0, [[0, { aRx: 1.5, aRe: .1, aRz: x > 0 ? .25 : x < 0 ? -.15 : 0, lean: -.1 + Math.sin(L.T * 12 + i) * .05 }]], { T: L.T }); laughF(e, L.T + i); FACES.push(e); });
  vapeCrowd(L, -6, -10, 8, 6, 12, 73, { gap: 1.4 }); orb(L.k, V(-6, 5, -6), null, [16, 0, .1, 44], [14, .1, .08, 44]); sh(V(-6, 0, -6), 18); }, [[0, 'whoosh', .3], [.1, 'laugh_m', .6], [.4, 'kids_laugh', .4]]);
// 50 «Bis ich etwas fand.» (zoom lento): de noche, una calle vacía y un quiosco viejo con la puerta entreabierta
shot(58.50, 'F', 'slow', L => { use('HB'); darkNight(); show(KIOSKF, -30, 0, -66, 0, 1); const c = put(ich, -29, 0, -55 - L.lt * 1.4, PI); actuar(c, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  cm([-27, 7, -40, -30, 5.5, -64, 44], [-27.5, 6.5, -44, -30, 5.5, -64, 42], L.k); sh(V(-30, 0, -60), 18); }, [[0, 'flash', .3], [.1, 'wind', .4], [.4, 'steps', .4], [.9, 'door_creak', .5]]);
// 51 «In einem verlassenen Kiosk,»: dentro: polvo, telarañas, baldas desteñidas; entro despacio
shot(59.60, 'Z', null, L => { use('KI'); inside(.8, 40); const c = put(ich, KX + 2, 0, 7.5 - L.lt * 1.2, PI - .5); actuar(c, 0, [[0, walkP(L.T * .6, 0)]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); FACES.push(c);
  SMK.haze(V(KX, 6, -2), L.T, 18, 12, 4, 8, 4, .12, 51); orb(L.k, V(KX + 1, 6, 6), null, [16, -.7, .18, 46], [14, -.85, .14, 46]); sh(V(KX, 0, 0), 20); }, [[0, 'zoom_in', .3], [.1, 'wood_creak', .5], [.6, 'drip', .4]]);
// 52 «ganz hinten im Regal:»: la cámara sube por las baldas hasta la última, de donde sale un brillo dorado
shot(60.90, 'S', null, L => { use('KI'); inside(.8, 40); const G = KI.GOLDPOS; show(GOLD2, G.x, G.y, G.z, .3, 1); GOLD2.userData.setGlow(.6 + Math.sin(L.T * 6) * .3); KI.beam.visible = L.k < .4;
  cm([G.x + 2, G.y - 5, G.z + 9, G.x, G.y - 4, G.z, 40], [G.x + 1, G.y + .8, G.z + 6, G.x, G.y + .5, G.z, 38], L.k, easeOut); DOF = 1.2; sh(V(KX, 0, -6), 14); }, [[0, 'swipe', .3], [.2, 'creepy_ting', .5], [.6, 'sparkle', .4]]);
// 53 «eine goldene Vape.» (zoom lento): la vape dorada brillando sobre la balda polvorienta
shot(62.10, 'F', 'slow', L => { use('KI'); inside(.7, 30); const G = KI.GOLDPOS; show(GOLD2, G.x, G.y, G.z, .3 + L.lt * .3, 1); GOLD2.userData.setGlow(.8 + Math.sin(L.T * 6) * .3); KI.LI.intensity = 60; KI.beam.visible = false;
  cm([G.x + .6, G.y + 1.2, G.z + 3.4, G.x, G.y + .8, G.z, 34], [G.x + .3, G.y + 1.0, G.z + 2.4, G.x, G.y + .8, G.z, 32], L.k); DOF = 2; sh(V(KX, 0, -6), 10); }, [[0, 'flash', .4], [.1, 'choir', .4], [.3, 'sparkle', .6]]);
// 54 «Darauf stand: „Warnung:»: la tengo en la mano, delante de mi cara, y leo la parte de atrás
shot(63.20, 'C', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); actuar(c, 0, [[0, { ...armVape(.55), headX: .3 }]], { T: L.T }); c.aR.sh.rotation.y = armVape(.55).aRy; GOLD.visible = true; GOLD.userData.grip.visible = true; GOLD.userData.setGlow(.6); FACES.push(c);
  cara(c, L.T, { expr: 'confused', eyes: 'down', mouth: 'flat' }); onFace(c, 6.4, .4, .5, 38, L.k, 5.6); DOF = 1.2; sh(V(KX, 0, 6), 12); }, [[0, 'whoosh_soft', .3], [.2, 'paper', .4]]);
// 55 «Niemals mehr als einen Zug.»: macro de la pegatina roja WARNUNG (mi cara desenfocada detrás)
shot(64.50, 'C', 'punch', L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 2, 0); actuar(c, 0, [[0, { aLx: .3, aRx: .3, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); const g = hp(c).add(V(0, -.6, 3.4)); show(GOLD2, g.x, g.y, g.z, PI, 1.6); GOLD2.rotation.z = Math.sin(L.T * 2) * .05; GOLD2.userData.setGlow(.7);
  cam([g.x, g.y + 1.0, g.z + 3.0], [g.x, g.y + .95, g.z], 30); DOF = 2; sh(V(KX, 0, 2), 10); }, [[0, 'impact', .4], [.1, 'heartbeat', .5]]);
// 56 «Also zog ich natürlich alles auf einmal.»: sonrisa pícara… y me la llevo a la boca
shot(66.20, 'C', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); vaper(c, L, L.t0 + .35, 3, { gold: true, expr: 'smug', meter: true });
  if (L.lt < .35) cara(c, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' }); onFace(c, 6.6, .2, .2, 38, L.k, 5.8); sh(V(KX, 0, 6), 12); }, [[0, 'whoosh', .3], [.1, 'hmm', .4], [.4, 'vape_in', .7]]);
// 57 «auf einmal.»: macro de mi cara con la vape dorada, el LED dorado a tope, empieza la calada
shot(67.30, 'C', 'punch', L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); vaper(c, L, L.t0 - .8, 3, { gold: true, expr: 'determined', eyes: 'closed' }); GOLD.userData.setGlow(1.2 + Math.sin(L.T * 25) * .3);
  onFace(c, 4.4, -.1, 1.2, 34, L.k, 3.9); DOF = 1.6; sh(V(KX, 0, 6), 10); }, [[0, 'impact', .5], [.05, 'vape_in', .9], [.3, 'heartbeat', .5]]);
