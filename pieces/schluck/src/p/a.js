// ---------- a: gancho, la regla y la ciudad (0 – 44,2 s) ----------
// Plaza de Brauheim con el Biergarten: fila del gancho en z = 8 (delante del Ausschank, z = -12); mesas en (±14, 24/37/50).
// Getränkemarkt: fachada en x = -43, z ≈ 10 (cajas apiladas en (-40, 21)). Maibaum (18, -14) con la placa de la leyenda.
const TAFP = V(-22, 0, -30);   // pizarra de la regla
// cámara para ver beber: frente y algo de lado (la jarra entra por el otro lado y no tapa los ojos)
// (de tres cuartos desde el lado de la mano libre: se ve la cara de perfil con la jarra en la boca)
const dcam = (ch, k, d = 10, yaw = -1.0, dy = 5.2, fov = 40) => onBody(ch, d, yaw, .1, fov, k, d * .84, yaw + .12, dy);
const sit2 = (c, x, z, ry, seat = 2.7) => { put(c, x, sitY(c, seat), z, ry); c.blob.visible = false; return c; };
const SITP = sitPose({ aLx: .5, aLe: 1.2, aLz: -.1 });
function drawRule(c, w, h, k) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#12204a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 60px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('JE MEHR BIER,', w / 2, 64); c.fillStyle = '#ffd23f'; c.fillText('DESTO MEHR GELD!', w / 2, 132);
  [['1 BIER', '20 €', .1], ['5 BIER', '600 €', .32], ['20 BIER', '1 MIO. €', 1]].forEach(([a, b, v], i) => { const x = 200 + i * 312, bh = 300 * v * clamp(k * 1.8 - i * .35); c.fillStyle = ['#3ab8ff', '#ffd23f', '#5aff9a'][i]; c.beginPath(); c.roundRect(x - 84, 520 - bh, 168, bh, 18); c.fill();
    c.font = `700 40px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(a, x, 552); if (bh > 30) { c.font = `700 44px ${FONT}`; c.fillText(b, x, 520 - bh - 32); } }); }

// 1 «In dieser Stadt bekommst du»: cinco vecinos en fila levantan la Maß a la vez y beben; de golpe cae una lluvia de billetes. Plano frontal centrado, empuje.
shot(0, 'C', null, L => { town(L); const row = [CR[0], CR[1], CR[2], CR[3], CR[4]]; const RP = [[-4.6, 8], [0, 9], [4.6, 8], [-2.3, 4], [2.3, 4]];
  row.forEach((c, i) => { put(c, RP[i][0], 0, RP[i][1], .75); drink(c, L, .12 + Math.abs(i - 2) * .05, .75, { meter: true, bg: i !== 2, expr: 'happy', l1: .2 }); if (L.lt > .95) cashPop(c, '+20 €', clamp((L.lt - .95 - i * .03) / .2), 'green', .8); });
  crowdAt(L, 0, 2, 8, 6, 12, 2, { mode: i => ['prost', 'drink', 'cheer'][i % 3], from: 5, gap: 1.0 });
  billFall(V(0, 0, 8), L.t0 + .55, L.T, 70, 24, 8, 16);
  cm([0, 6.4, 34, 0, 5.2, 7, 46], [0, 6.2, 27, 0, 5.4, 7, 44], L.k, easeOut); sh(V(0, 0, 8), 30); },
  [[0, 'gulp', .6], [.2, 'crowd_cheer', .3], [.55, 'money_rain', .7], [.9, 'cash', .6]]);
// 2 «jedes Mal Geld,»: de cerca, una vecina con Dirndl baja la jarra satisfecha; el Bierzähler marca 1 Bier · 20 € y un billete le cae en la mano
shot(1.35, 'W', 'punch', L => { town(L); const c = put(CR[1], 0, 0, 10, 0); drink(c, L, L.t0 - .9, .6, { meter: true, expr: 'happy', after: 'joy' }); meterOf(c).userData.set('1 Bier', '20 €');
  billDrop(c, L.t0 + .15, L.T, 4, 1.6); cashPop(c, '+20 €', clamp((L.lt - .3) / .2), 'green', 1.1); crowdAt(L, 0, 10, 6, 7, 14, 5, { mode: i => ['drink', 'prost'][i % 2], from: 6 });
  orbit(V(0, 5.6, 10), lerp(11, 9, L.k), -.18, .06, 40); sh(V(0, 0, 10), 18); }, [[0, 'ahh', .6], [.15, 'cash_reg', .6], [.3, 'paper', .4]]);
// 3 «wenn du ein Bier trinkst.»: en la mesa, un hombre con camisa de cuadros se bebe la Maß de un trago (de perfil a tres cuartos); la cámara se acerca
shot(2.39, 'Z', null, L => { town(L); const c = sit2(CR[2], -14, 21.7, 0); drink(c, L, L.t0 - .05, 1.0, { sit: true, pose: SITP, meter: true, expr: 'determined', bg: false });
  tableFolk(L, 0, -1, 3, 'sitdrink', 3, { dx: -6 }); tableMugs(0, 3);
  dcam(c, L.k, 11, -1.0, 4.2); sh(V(-14, 0, 22), 18); }, [[0, 'swoosh_up', .5], [.1, 'gulp_long', .7], [.8, 'glass_down', .4]]);
// 4 «Und je mehr Bier du trinkst,»: la pizarra de la regla con las barras que crecen; la gente debajo mira con su jarra
shot(3.59, 'S', null, L => { town(L, { bg: false }); show(TAFEL, TAFP.x, 0, TAFP.z, .25); TAFEL.userData.draw((c, w, h) => drawRule(c, w, h, L.lt / 1.1));
  crowdAt(L, TAFP.x, TAFP.z + 14, 10, 4, 9, 9, { mode: i => ['sithold', 'drink', 'prost'][i % 3] === 'sithold' ? 'drink' : ['drink', 'prost'][i % 2], face: V(TAFP.x, 15, TAFP.z), full: false, gap: 1.6 });
  const tp = TAFP.clone(), fx = Math.sin(.25), fz = Math.cos(.25); cm([tp.x + fx * 40, 8, tp.z + fz * 40, tp.x, 14.4, tp.z, 46], [tp.x + fx * 33, 9.5, tp.z + fz * 33, tp.x, 15, tp.z, 46], L.k); sh(V(tp.x, 0, tp.z + 10), 34); DOF = 0; },
  [[0, 'whoosh', .4], [.15, 'power_on', .6], [.4, 'pling', .4], [.8, 'pling', .4]]);
// 5 «desto mehr bekommst du.»: un vecino con una torre de jarras vacías bebe otra y le llueven billetes; los de alrededor aplauden
shot(4.95, 'F', null, L => { town(L); const c = sit2(CR[5], 14, 21.7, 0); drink(c, L, L.t0 - .1, .6, { sit: true, pose: SITP, meter: true, expr: 'happy', after: 'joy' }); meterOf(c).userData.set('9 Bier', '4.800 €');
  for (let i = 0; i < 8; i++) { const m = KRUG[i]; show(m, 16.4 + (i % 4) * 1.1, 4.15 + Math.floor(i / 4) * 1.32, 24 + (i % 2) * .3, i, 1); m.userData.level(0, 0); }
  tableFolk(L, 1, -1, 2, i => i % 2 ? 'sitprost' : 'sitdrink', 0, { dx: 6 }); billFall(V(14, 0, 22), L.t0 + .1, L.T, 50, 14, 8, 14); cashPop(c, '+4.800 €', clamp((L.lt - .3) / .2), 'gold', 1);
  orb(L.k, V(13, 4.8, 22), null, [17, -.5, .16, 44], [14, -.62, .12, 44]); sh(V(14, 0, 22), 20); }, [[0, 'flash', .4], [.1, 'money_rain', .6], [.4, 'clap', .5], [.6, 'cheer', .4]]);
// 6 «Ein Bier?»: un chico con gorra levanta una sola Maß y bebe; el HUD del Bierzähler arranca
shot(6.16, 'C', 'punch', L => { town(L); const c = put(CR[6], 30, 0, 2, -.3); drink(c, L, L.t0 + .02, .4, { meter: true, expr: 'happy', sip: true }); setHUD(clamp((L.lt - .1) / .45));
  crowdAt(L, 30, 2, 6, 6, 12, 14, { mode: 'drink', from: 8, gap: 1.4 }); dcam(c, L.k); sh(V(30, 0, 2), 16); }, [[0, 'thump', .5], [.08, 'gulp', .6], [.3, 'tick', .4]]);
// 7 «20 Euro.»: baja la jarra, ¡ding!: un billete de 20 cae en su mano
shot(6.76, null, null, L => { town(L); const c = put(CR[6], 30, 0, 2, -.3); drink(c, L, L.t0 - .75, .4, { meter: true, sip: true, after: 'joy' }); meterOf(c).userData.set('1 Bier', '20 €'); setHUD(1);
  billDrop(c, L.t0, L.T, 3, 1.4); cashPop(c, '+20 €', clamp(L.lt / .2), 'green', 1.2); crowdAt(L, 30, 2, 6, 6, 12, 14, { mode: 'drink', from: 8, gap: 1.4 });
  orbit(V(30, 5.2, 2), lerp(12, 11, L.k), -.1, .08, 42); sh(V(30, 0, 2), 16); }, [[0, 'cash_reg', .7], [.1, 'paper', .4]]);
// 8 «5 Bier?»: Resi, la camarera, en la barra del Ausschank: cinco jarras vacías en fila y bebe la quinta; el HUD sube a 5
shot(7.54, 'W', null, L => { town(L); const c = put(resi, 2, 0, -7.4, 0); drink(c, L, L.t0, .75, { meter: true, expr: 'determined', l1: .1 }); setHUD(lerp(4, 5, clamp((L.lt - .3) / .5)) < 4.99 ? 4 : 5);
  for (let i = 0; i < 4; i++) { const m = KRUG[i]; show(m, -4.5 + i * 1.6, 4.4, -9.6, 0, 1); m.userData.level(0, 0); }
  crowdAt(L, 2, -2, 6, 5, 11, 21, { mode: i => ['drink', 'clap'][i % 2], from: 2, gap: 1.5 }); dcam(c, L.k); sh(V(2, 0, -6), 18); },
  [[0, 'whoosh_soft', .4], [.05, 'gulp_long', .6], [.7, 'glass_down', .5]]);
// 9 «600 Euro.»: estallido de billetes alrededor de Resi; +600 €
shot(8.61, 'C', 'punch', L => { town(L); const c = put(resi, 2, 0, -7.4, 0); drink(c, L, L.t0 - 1.1, .75, { meter: true, after: 'joy', l1: .1 }); meterOf(c).userData.set('5 Bier', '600 €'); setHUD(5);
  for (let i = 0; i < 5; i++) { const m = KRUG[i]; show(m, -4.5 + i * 1.6, 4.4, -9.6, 0, 1); m.userData.level(0, 0); } billBurst(hp(c).add(V(0, -1, 0)), L.t0, L.T, 30, 1.2); cashPop(c, '+600 €', clamp(L.lt / .2), 'gold', 1.25);
  crowdAt(L, 2, -2, 6, 5, 11, 21, { mode: 'cheer', from: 2, gap: 1.5 }); orbit(V(2, 5.4, -7.4), lerp(13, 11.5, L.k), .25, .1, 42); sh(V(2, 0, -6), 18); }, [[0, 'cash_reg', .7], [.05, 'money_burst', .6], [.3, 'cheer', .4]]);
// 10 «20 Bier?» (zoom lento): el grandullón del sombrero tirolés, detrás de una torre de 19 jarras vacías, bebe la número 20
shot(9.61, 'F', 'slow', L => { town(L); const c = sit2(TR[0], -14, 34.7, 0); drink(c, L, L.t0 - .05, .85, { sit: true, pose: SITP, meter: true, expr: 'determined', eyesD: 'squint' }); setHUD(L.lt < .7 ? 19 : 20, '#ffd23f');
  for (let i = 0; i < 12; i++) { const m = KRUG[i]; show(m, -11.6 + (i % 4) * 1.05, 4.15 + Math.floor(i / 4) * 1.32, 36.4, 0, 1); m.userData.level(0, 0); }
  tableFolk(L, 2, -1, 2, 'sithold', 0, { dx: 7 }); crowdAt(L, -14, 30, 6, 7, 14, 25, { mode: 'clap', from: 4, gap: 1.8 });
  dcam(c, L.k, 11, -.9, 4.4, 42); sh(V(-14, 0, 36), 18); }, [[0, 'gulp_long', .6], [.6, 'drumroll', .4]]);
// 11 «Glückwunsch!»: confeti; los vecinos lo levantan en hombros
shot(10.66, 'Z', 'punch', L => { town(L); const c = put(TR[0], -14, lerp(0, 2.2, easeOut(clamp(L.lt / .3))), 30, 0); prost(c, L, 1, { pose: { aLx: 2.8, aLz: .5 } }); laughF(c, L.T); setHUD(20, '#ffd23f');
  confetti(V(-14, 6, 30), L.t0, L.T, 70, 1.3); crowdAt(L, -14, 30, 10, 3.5, 10, 27, { mode: i => i < 3 ? 'cheer' : ['prost', 'clap'][i % 2], gap: 1.3 });
  orbit(V(-14, 6.6, 30), lerp(17, 15, L.k), .1, .16, 44); sh(V(-14, 0, 30), 22); }, [[0, 'party_horn', .6], [.05, 'confetti_pop', .6], [.2, 'cheer', .6]]);
// 12 «Du bist Millionär!»: sube a la mesa con los brazos en alto; lluvia enorme de billetes; 1 MIO. € en dorado
shot(11.26, 'R', null, L => { town(L); const c = put(TR[0], -14, 4.15, 37, 0); actuar(c, L.lt, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .2, aRe: .2 }], [.3, { aLx: 2.6, aRx: 2.6, aLz: .7, aRz: .7, crouch: .1 }, { dur: .3 }]], { T: L.T }); laughF(c, L.T); meterOf(c).userData.set('20 Bier', '1 Mio. €', '#ffd23f'); setHUD(20, '#ffd23f');
  billRain(V(-14, 0, 37), L.T, 90, 24, 14, 20, 3.5); badge('gold', '1.000.000 €', W / 2, H * .2, clamp(L.lt / .25), 1, 1.15); crowdAt(L, -14, 37, 10, 5, 12, 29, { mode: i => ['cheer', 'prost'][i % 2], gap: 1.3 });
  orbit(V(-14, 9.4, 37), lerp(20, 17, L.k), -.15, .1, 46); sh(V(-14, 0, 37), 24); }, [[0, 'money_rain', .8], [.1, 'cheer', .6], [.3, 'cash_reg', .5]]);
// 13 «Und es gibt eine Legende:» (zoom lento): la placa tallada en el Maibaum al atardecer; un abuelo con Tracht la señala
shot(12.52, 'W', 'slow', L => { town(L, { dusk: true, bg: false }); PLAQ.visible = true; const o = put(TR[4], 21, 0, -2, -.5); actuar(o, 0, [[0, { aRx: 2.2, aRz: .1, aRe: .1, headX: -.3, headY: -.3 }]], { T: L.T }); talk(o, L.T, L.t0, L.t1, 'warm');
  crowdAt(L, 18, 2, 5, 5, 9, 31, { mode: 'idle', face: V(18, 9, -13), gap: 1.6 }); cm([12, 6, 22, 18, 8.4, -13, 44], [15, 8, 8, 18, 9, -13, 42], L.k); sh(V(18, 0, -6), 24); },
  [[0, 'wind', .4], [.1, 'mystery', .6]]);
// 14 «Wer 500 Bier schafft,»: una torre de 500 jarras crece desde la plaza hasta las nubes; la cámara sube con ella
shot(13.87, 'I', null, L => { town(L, { bg: false }); const n = Math.round(lerp(40, 500, easeInOut(clamp(L.lt / 1.3)))); show(TOWER, 0, 0, -30, L.T * .2, 1); TOWER.userData.IB.count = TOWER.userData.IF.count = n; badge('num', nBier(n), W / 2, H * .18, clamp(L.lt / .2), 1, 1.2);
  crowdAt(L, 0, -30, 12, 9, 18, 33, { mode: i => ['point', 'shock'][i % 2], face: V(0, 30, -30), full: true });
  const top = Math.min(n / 6 * 1.45, 120); cm([0, 6, 40, 0, 10, -30, 50], [0, 20, 52, 0, top * .55 + 10, -30, 56], L.k); sh(V(0, 0, -30), 40); DOF = 0; },
  [[0, 'iris_pop', .4], [.1, 'glass_clink', .5], [.4, 'glass_clink', .5], [.8, 'riser_short', .5]]);
// 15 «wird Trillionär.»: una montaña de oro con una corona flotando arriba… y nadie sentado en ella
shot(15.41, 'Z', 'punch', L => { town(L, { bg: false }); show(GOLDM, 0, 0, -30, L.T * .05, 1); show(HALO, 0, 14 + Math.sin(L.T * 2) * .4, -30, 0, 1.6); HALO.rotation.x = PI / 2; coins(V(0, 6, -30), L.t0, L.T, 24);
  badge('gold', 'TRILLIONÄR', W / 2, H * .17, clamp(L.lt / .2), 1, 1.1); badge('num', '1.000.000.000.000.000.000 €', W / 2, H * .25, clamp((L.lt - .15) / .2), 1, .78);
  orbit(V(0, 7, -30), lerp(36, 30, L.k), .3 + L.k * .2, .18, 46); sh(V(0, 0, -30), 30); }, [[0, 'magic_hit', .6], [.1, 'coins', .6], [.3, 'choir', .4]]);
// 16 «Geschafft hat das noch nie jemand.»: de cerca, «REKORD: —» en la placa; los vecinos se encogen de hombros
shot(16.49, 'S', null, L => { town(L, { dusk: true, bg: false }); PLAQ.visible = true; for (let i = 0; i < 3; i++) { const c = put(CR[10 + i], 14 + i * 4, 0, -3, PI + (i - 1) * .3 + PI); actuar(c, L.lt, [[0, 'idle'], [.1 + i * .1, 'shrug', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'flat' }); }
  cm([18, 6, 16, 18, 5.6, -10, 44], [18, 6.2, 13, 18, 5.8, -10, 42], L.k); sh(V(18, 0, -6), 20); }, [[0, 'sigh', .4], [.4, 'wind', .3]]);
// 17 «Stell dir vor, wie viel»: un vecino en la mesa se queda pensando; nube de pensamiento con un montón de dinero
shot(18.15, 'W', null, L => { town(L); const c = sit2(CR[13], 14, 34.7, 0); holdOnly(c, L, { sit: true, pose: { ...SITP, headX: -.25, headY: .3, aLx: 1.4, aLe: 2.2, aLz: -.2 } }); cara(c, L.T, { expr: 'happy', eyes: 'side_r', mouth: 'smile' });
  tableFolk(L, 3, -1, 2, 'sitdrink', 0, { dx: 6 }); bubble(c, '💭 € € €', clamp((L.lt - .1) / .2), 2.6); FX2D.push(cx => { const [x, y] = proj(hp(c).add(V(0, 4.2, 0))); const k = clamp((L.lt - .2) / .3); cx.save(); cx.globalAlpha = k; for (let i = 0; i < 6; i++) { cx.fillStyle = '#3aa85a'; cx.fillRect(x - 120 + i * 40, y - 60 - (i % 2) * 20, 70, 36); cx.fillStyle = '#ffffff'; cx.font = `700 22px ${FONT}`; cx.fillText('€', x - 92 + i * 40, y - 36 - (i % 2) * 20); } cx.restore(); });
  onBody(c, 12, -.35, .1, 42, L.k, 10.5, -.25, 5); sh(V(14, 0, 36), 16); }, [[0, 'dream', .5], [.3, 'sparkle', .4]]);
// 18 «du heute schon verdient hättest.»: el móvil en su mano: el saldo sube y sube
shot(19.21, 'C', null, L => { town(L); const c = sit2(CR[13], 14, 34.7, 0); actuar(c, 0, [[0, { ...SITP, aLx: 1.3, aLe: 1.6, aLz: -.15, headX: .35 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'shock', mouth: 'open_smile' }); attach(PHONE, c.aL.hand, [0, -.9, .5], [-.3, 0, 0], 1.1); POST.push(() => PHONE.lookAt(camera.position));
  const v = Math.round(lerp(1200, 9860, easeIn(clamp(L.lt / 1.3)))); PHONE.userData.draw(cx => drawBankApp(cx, 300, 560, v.toLocaleString('de-DE') + ' €', '+20 € +20 € +20 €')); badge('green', '+' + v.toLocaleString('de-DE') + ' €', W / 2, H * .18, clamp(L.lt / .2), 1, .9);
  const p = wpos(PHONE); cm([p.x + 1.2, p.y + 2.6, p.z + 5.2, p.x, p.y + .2, p.z, 36], [p.x + .8, p.y + 2.2, p.z + 4.2, p.x, p.y + .2, p.z, 34], L.k); sh(V(14, 0, 36), 12); DOF = 0; }, [[0, 'notif', .6], [.3, 'coins', .5], [.7, 'notif', .5]]);
// 19 «Eben.»: un señor con bigote asiente satisfecho con su jarra y guiña un ojo
shot(20.61, 'F', 'punch', L => { town(L); const c = put(TR[2], -30, 0, 4, .4); holdOnly(c, L, { pose: { headX: Math.sin(L.lt * 12) * .12 } }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  crowdAt(L, -30, 4, 6, 6, 12, 35, { mode: 'drink', gap: 1.5 }); onFace(c, 6.6, .1, .3, 40, L.k, 6); sh(V(-30, 0, 4), 14); }, [[0, 'pop', .5], [.15, 'ding_soft', .4]]);
// 20 «Deshalb ist Biertrinken»: la plaza entera bebiendo a la vez, grúa que baja
shot(21.09, 'W', null, L => { town(L); for (let t = 0; t < 6; t++) { tableFolk(L, t, -1, 4, 'sitdrink', 0); tableFolk(L, t, 1, 4, i => i % 2 ? 'sitprost' : 'sitdrink', 0); }
  crowdAt(L, 0, 6, 8, 4, 12, 37, { mode: 'drink', full: true }); cm([0, 46, 90, 0, 2, 26, 46], [0, 30, 76, 0, 3, 26, 46], L.k, easeOut); sh(V(0, 0, 26), 50); DOF = 0; }, [[0, 'crowd_murmur', .5], [.2, 'glass_clink', .5], [.6, 'gulp', .4]]);
// 21 «hier kein Hobby,»: un vecino tira su caña de pescar a la papelera y coge una Maß; cartel HOBBY tachado
shot(21.95, 'S', null, L => { town(L, { bg: false }); const c = put(CR[14], -6, 0, -40, 0); const k = clamp(L.lt / .5), k2 = easeOut(clamp((L.lt - .2) / .2)); holdOnly(c, L, { pose: { aLx: lerp(1.5, .3, k2), aLz: lerp(.2, 1.4, k2), aLe: .3 } }); cara(c, L.T, { expr: 'determined', mouth: 'smirk' });
  show(DS1, -6, 11.5, -40.5, 0, .5); DS1.userData.draw('hobby', (cx, w, h) => { cx.fillStyle = '#f4f0e4'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1a1a'; cx.font = `700 120px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('HOBBY', w / 2, h / 2); cx.strokeStyle = '#d8202a'; cx.lineWidth = 26; cx.beginPath(); cx.moveTo(40, 40); cx.lineTo(w - 40, h - 40); cx.moveTo(w - 40, 40); cx.lineTo(40, h - 40); cx.stroke(); });
  const rod = PADDLE[0]; show(rod, -6 + 3 + k * 4, 6 - k * 4, -40 + 1, 0, 1); rod.rotation.z = -1 - k * 2;
  cm([-6, 6.4, -27, -6, 6.6, -40, 46], [-6, 6.4, -29, -6, 6.6, -40, 46], L.k); sh(V(-6, 0, -40), 20); }, [[0, 'swipe', .4], [.25, 'throw', .5], [.5, 'thud', .4]]);
// 22 «sondern ein Beruf.»: un señor con traje y corbata ficha en el Biergarten: «BERUF: BIERTRINKER»
shot(22.89, 'Z', null, L => { town(L); const c = sit2(BEA[1], 14, 47.7, 0); drink(c, L, L.t0 + .1, .55, { sit: true, pose: SITP, meter: true, expr: 'neutral' });  DS3.userData.draw('beruf', (cx, w, h) => { cx.fillStyle = '#1a2a4a'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#ffd23f'; cx.lineWidth = 10; cx.strokeRect(8, 8, w - 16, h - 16); cx.fillStyle = '#ffffff'; cx.font = `700 64px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('BERUF: BIERTRINKER', w / 2, h / 2 + 4); });
  tableFolk(L, 5, -1, 2, 'sitdrink', 0, { dx: 7 }); onBody(c, 15, -.3, .14, 44, L.k, 13, -.2, 5.5); show(DS3, 14, 11, 44.6, 0, .6); sh(V(14, 0, 48), 18); }, [[0, 'zoom_in', .4], [.1, 'stamp', .6], [.3, 'gulp', .5]]);
// 23 «Die Büros stehen leer.»: oficina abandonada: sillas vacías, monitores apagados, polvo y telarañas; travelling lateral
shot(23.95, 'R', null, L => { bueroS(L); DUST.forEach((d, i) => { const r = RNG(i * 3 + 1); d.visible = true; d.position.set(BUX - 15 + r() * 30, 3 + r() * 10 + Math.sin(L.T + i) * .4, -10 + r() * 20); d.scale.setScalar(.05 + r() * .05); d.material.opacity = .5; });
  cm([BUX - 12, 8.5, 14, BUX - 6, 5, -6, 50], [BUX + 6, 8.5, 14, BUX + 8, 5, -6, 50], L.k); sh(V(BUX, 0, 0), 26); DOF = 0; }, [[0, 'wind', .5], [.3, 'creak', .4], [.8, 'clock_tick', .4]]);
// 24 «Stattdessen sitzen alle im Biergarten,»: grúa sobre el Biergarten lleno: todas las mesas ocupadas, camareras con jarras
shot(25.23, 'W', null, L => { town(L); for (let t = 0; t < 6; t++) { tableFolk(L, t, -1, 3, i => ['sitdrink', 'sithold', 'sitprost'][i % 3], 0); tableFolk(L, t, 1, 3, i => ['sithold', 'sitdrink', 'sitprost'][i % 3], 0); tableMugs(t, 2); }
  const r = put(resi, 0, 0, 30 + L.lt * 3, 0); actuar(r, 0, [[0, { ...walkP(L.T, 0), aLx: 1.2, aLe: 1.3 }]], { T: L.T }); holdOnly(r, L); cara(r, L.T, { expr: 'happy' });
  cm([0, 36, 84, 0, 3, 30, 46], [0, 24, 72, 0, 4, 30, 46], L.k, easeOut); sh(V(0, 0, 32), 46); DOF = 0; }, [[0, 'crowd_murmur', .6], [.4, 'accordion', .5], [.8, 'glass_clink', .4]]);
// 25 «heben ihre Krüge»: una fila de sentados alza las Maß a la vez: ¡Prost!
shot(26.83, 'C', null, L => { town(L); const row = [CR[15], CR[16], CR[17], CR[18]]; row.forEach((c, i) => { sit2(c, -18.8 + i * 3.2, 39.3, PI); prost(c, L, easeOut(clamp((L.lt - i * .06) / .35)), { sit: true, pose: SITP }); laughF(c, L.T + i); });
  tableMugs(2, 2, .9); orbit(V(-14, 6, 39.3), lerp(14, 12, L.k), PI, .12, 44); sh(V(-14, 0, 38), 18); }, [[0, 'prost', .7], [.3, 'glass_clink', .7], [.5, 'cheer', .4]]);
// 26 «und schauen auf ihr Konto.»: todos miran el móvil a la vez; en primer plano, el saldo sube
shot(27.77, 'I', null, L => { town(L); for (let i = 0; i < 4; i++) { const c = sit2(CR[15 + i], -18.8 + i * 3.2, 39.3, PI); holdOnly(c, L, { sit: true, pose: { ...SITP, aLx: 1.2, aLe: 1.7, headX: .4 } }); cara(c, L.T, { expr: 'happy', eyes: 'down', mouth: 'smile' }); if (i === 1) { attach(PHONE, c.aL.hand, [0, -.9, .5], [-.4, 0, 0], 1.1); POST.push(() => PHONE.lookAt(camera.position)); } }
  PHONE.userData.draw(cx => drawBankApp(cx, 300, 560, '12.480 €', '+40 €')); badge('green', '+40 €', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, 1);
  orbit(V(-14, 5.6, 39.3), lerp(11, 9.6, L.k), PI - .2, .3, 42); sh(V(-14, 0, 38), 16); }, [[0, 'iris_pop', .4], [.2, 'notif', .6], [.6, 'notif', .5]]);
// 27 «Aber nicht jedes Bier zählt.»: un tipo bebe de una lata barata; su Bierzähler se pone rojo: 0 €
shot(29.20, 'F', null, L => { town(L, { bg: false }); const c = put(CR[19], 24, 0, -50, -.2); drink(c, L, L.t0 + .05, .5, { meter: true, kind: 'none', sip: true, after: 'confused', afterMouth: 'grimace' }); attach(CAN, c.aR.hand, [-.4, -.2, -.5], [PI / 2, 0, 0], .9);
  meterOf(c).userData.set('0 Bier', '0 €', '#ff4a4a', L.lt > .9 ? 1 : 0); if (L.lt > .9) badge('red', '0 €', W / 2, H * .2, clamp((L.lt - .9) / .2), 1, 1.2);
  dcam(c, L.k); sh(V(24, 0, -50), 16); }, [[0, 'can_open', .6], [.1, 'gulp', .5], [.9, 'buzzer', .6]]);
// 28 «Der Zähler erkennt nur»: el Bierzähler de cerca escanea la jarra con un láser rojo
shot(30.66, 'S', null, L => { town(L); const c = put(CR[20], -2, 0, 10, 0); prost(c, L, .3); cara(c, L.T, { expr: 'neutral', eyes: 'down' }); const m = meterOf(c); m.userData.set('SCANNE…', '', '#7ad8ff');
  const mp = wpos(m); FX2D.push(cx => { const [x, y] = proj(mp); const [x2, y2] = proj(wpos(mugOf(c)).add(V(0, .7, 0))); const t = (L.T * 3) % 1; cx.save(); cx.strokeStyle = 'rgba(255,40,40,.85)'; cx.lineWidth = 8; cx.shadowColor = '#ff2a2a'; cx.shadowBlur = 20; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x2 - 40 + t * 80, y2); cx.stroke(); cx.restore(); });
  cm([mp.x + 2.2, mp.y + 1.2, mp.z + 5.4, mp.x + .6, mp.y - .4, mp.z, 34], [mp.x + 1.6, mp.y + 1, mp.z + 4.4, mp.x + .6, mp.y - .4, mp.z, 32], L.k); sh(V(-2, 0, 10), 10); DOF = 0; }, [[0, 'scan', .7], [.5, 'beep', .4]]);
// 29 «echtes, gutes Bier.»: ¡bip! verde: ECHT ✓; el vecino sonríe y bebe
shot(31.74, 'Z', null, L => { town(L); const c = put(CR[20], -2, 0, 10, 0); drink(c, L, L.t0 + .35, .6, { meter: true, expr: 'happy' }); meterOf(c).userData.set('ECHT ✓', '+20 €', '#5aff9a'); badge('green', 'ECHT ✓', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1);
  crowdAt(L, -2, 10, 6, 6, 12, 41, { mode: 'drink', from: 0, gap: 1.4 }); dcam(c, L.k); sh(V(-2, 0, 10), 16); }, [[0, 'ding_reveal', .6], [.4, 'gulp', .5]]);
// 30 «Und das allerbeste?» (zoom lento): dentro del Getränkemarkt, travelling hacia el estante de honor; se enciende el foco
shot(33.18, 'W', 'slow', L => { regalS(L, lerp(0, 160, easeIn(clamp(L.lt / .7)))); crowdAt(L, RGX, -2, 4, 3, 8, 43, { mode: 'idle', face: V(RGX, 6, -16), full: true });
  cm([RGX, 7.5, 16, RGX, 6, -16, 46], [RGX, 6.8, 2, RGX, 6, -16, 42], L.k, easeIn); sh(V(RGX, 0, -8), 26); }, [[0, 'whoosh_soft', .4], [.2, 'hum', .4]]);
// 31 «Weihenstephaner.»: la botella protagonista en el estante de honor, girando bajo el foco, con destellos
shot(34.06, 'F', 'punch', L => { regalS(L, 160); const b = show(BW, RGX, 5.1, -14.6, PI + Math.sin(L.T * 1.5) * .35, 1.8); confetti(V(RGX, 7, -14.6), L.t0 + .1, L.T, 24, .6);
  cm([RGX + .6, 8.4, -6.6, RGX, 7.2, -14.6, 36], [RGX + .4, 8.1, -8, RGX, 7.2, -14.6, 34], L.k); sh(V(RGX, 0, -12), 14); DOF = 0; }, [[0, 'magic_hit', .7], [.1, 'choir', .5], [.5, 'sparkle', .5]]);
// 32 «Aus der ältesten Brauerei der Welt,»: la cervecería-monasterio en la colina; grúa que sube por el camino entre el lúpulo
shot(35.40, 'R', null, L => { klosterS(L); crowdAt(L, KLX, 10, 6, 3, 10, 45, { mode: 'walk', dir: PI, face: V(KLX, 0, -40), speed: 1.5, full: true });
  cm([KLX, 6, 64, KLX, 16, -30, 50], [KLX, 18, 52, KLX, 20, -30, 50], L.k); sh(V(KLX, 0, -20), 60); DOF = 0; }, [[0, 'birds', .5], [.3, 'bells', .5]]);
// 33 «gebraut seit dem»: dentro del Sudhaus: el hermano Anselm remueve la caldera de cobre con una pala de madera
shot(37.18, 'W', null, L => { sudS(L); const m = put(moench, SUX - 5, 0, 2, -.6); actuar(m, 0, [[0, { aRx: 2.0, aLx: 1.8, aRz: -.2, aLz: .2, aRe: .4, aLe: .5, lean: .2 + Math.sin(L.T * 4) * .08, twist: Math.sin(L.T * 4) * .25 }]], { T: L.T }); cara(m, L.T, { expr: 'happy' });
  attach(PADDLE[0], m.aR.hand, [0, -.6, .2], [.4, 0, 0], 1.2); DUST.forEach((d, i) => { const r = RNG(i); d.visible = true; d.position.set(SUX - 11 + (r() - .5) * 3, 13 + ((L.T * .8 + r()) % 1) * 8, -6 + (r() - .5) * 3); d.scale.setScalar(.6 + r()); d.material.opacity = .25; });
  orbit(V(SUX - 5, 5, 2), lerp(17, 14.5, L.k), .45 - L.k * .15, .12, 44); sh(V(SUX - 6, 0, -2), 24); }, [[0, 'bubbling', .6], [.2, 'steam', .4]]);
// 34 «Jahr 1040.»: el letrero «SUDHAUS · SEIT 1040» y el monje orgulloso; 1040 en dorado
shot(37.90, 'C', 'punch', L => { sudS(L); const m = put(moench, SUX, 0, -8, 0); actuar(m, 0, [[0, { aRx: 2.6, aRz: .1, aRe: .1, headX: -.15 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'happy'); badge('gold', '1040', W / 2, H * .34, clamp(L.lt / .2), 1, 1.5);
  cm([SUX, 9, 18, SUX, 11, -14, 48], [SUX, 9.5, 14, SUX, 11.5, -14, 46], L.k); sh(V(SUX, 0, -8), 20); }, [[0, 'gong', .6], [.2, 'choir', .4]]);
// 35 «Ein Weihenstephaner zählt doppelt.»: un vecino brinda con una Weihenstephaner, bebe y el Bierzähler muestra ×2: +40 €
shot(39.30, 'S', null, L => { town(L); const c = put(CR[21], 8, 0, 12, -.2); drink(c, L, L.t0 + .2, .6, { meter: true, expr: 'happy', pose: { aLx: 1.0, aLe: .9, aLz: -.2 } }); attach(BW, c.aL.hand, [0, -.7, .4], [-.3, 0, 0], .9);
  meterOf(c).userData.set('×2', '+40 €', '#ffd23f'); badge('gold', '×2 = 40 €', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1.1); crowdAt(L, 8, 12, 6, 6, 12, 47, { mode: 'drink', gap: 1.4 });
  dcam(c, L.k); sh(V(8, 0, 12), 16); }, [[0, 'bottle_open', .6], [.2, 'gulp', .5], [.6, 'double', .6]]);
// 36 «Deshalb steht vor jedem Getränkemarkt»: la fachada del Getränkemarkt con cajas apiladas y gente esperando
shot(41.08, 'Z', null, L => { town(L, { bg: false }); STACK.visible = true; for (let i = 0; i < 10; i++) { const c = put(CR[i], -39 + (i % 2) * 2, 0, 16 + i * 3.4, PI); actuar(c, 0, [[0, i % 3 ? 'idle' : { aLx: .2, headY: Math.sin(L.T + i) * .5 }]], { T: L.T }); cara(c, L.T + i, { expr: i % 2 ? 'neutral' : 'bored' }); }
  cm([-12, 9, 18, -43, 10, 12, 50], [-16, 9, 17, -43, 10, 12, 50], L.k); sh(V(-40, 0, 16), 30); }, [[0, 'street', .5], [.3, 'murmur', .4]]);
// 37 «eine Schlange bis um die Ecke.»: grúa: la cola sale de la tienda, recorre la calle y dobla la esquina
shot(42.56, 'W', null, L => { town(L, { bg: false }); STACK.visible = true; const POS = []; for (let i = 0; i < 40; i++) { const t = i * 3.1; let x, z, ry; if (t < 48) { x = -39 + (i % 2) * 1.6; z = 16 + t; ry = PI; } else { x = -39 + (t - 48); z = 64 + (i % 2) * 1.6; ry = -PI / 2; } POS.push([x, z, ry]); }
  [...CR, ...EX].slice(0, 40).forEach((c, i) => { if (c.root.visible) return; const [x, z, ry] = POS[i]; put(c, x, 0, z, ry); actuar(c, 0, [[0, { headY: Math.sin(L.T * .7 + i) * .4, aLx: .1 }]], { T: L.T }); cara(c, L.T + i, { expr: ['neutral', 'bored', 'sad'][i % 3] }); });
  cm([-10, 30, 40, -40, 2, 36, 50], [-6, 46, 54, -34, 2, 44, 52], L.k, easeOut); sh(V(-36, 0, 40), 50); DOF = 0; }, [[0, 'whoosh', .4], [.3, 'murmur', .5]]);
