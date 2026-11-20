// ---------- a: gancho (0 – 15,4 s) ----------
const P = V(-6, 0, -6);   // centro de la plaza
const town = (L, n = 22, cx = P.x, cz = P.z, r0 = 6, r1 = 22, seed = 3, o = {}) => { use('HB'); if (n) vapeCrowd(L, cx, cz, n, r0, r1, seed, o); };
const hazeTown = (L, c = P, n = 26, dens = .32) => SMK.haze(V(c.x, 9, c.z - 10), L.T, n, 34, 4, 26, 9, dens, 11);
const drawRule = (c, w, h, k = 1) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#12204a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 62px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('JE LÄNGER DU ZIEHST,', w / 2, 70); c.fillStyle = '#7aff9a'; c.fillText('DESTO MEHR GELD!', w / 2, 140);
  [['1 s', '10 €', .12], ['5 s', '500 €', .36], ['10 s', '1 Mio. €', 1]].forEach(([a, b, v], i) => { const x = 200 + i * 300, bh = 330 * v * clamp(k * 1.6 - i * .3); c.fillStyle = ['#3ab8ff', '#ffd23f', '#ff3a8a'][i]; c.beginPath(); c.roundRect(x - 80, 560 - bh, 160, bh, 16); c.fill();
    c.font = `700 44px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(a, x, 590 - 20 + 0); c.fillStyle = '#ffffff'; c.font = `700 40px ${FONT}`; if (bh > 50) c.fillText(b, x, 560 - bh - 30); }); };

// 1 «In dieser Stadt» (zoom lento): la ciudad envuelta en vapor, grúa que baja hacia la plaza llena de gente vapeando; en el centro, Jonas suelta una nube enorme
shot(0, 'Z', 'slow', L => { town(L, 26, P.x, P.z, 7, 26, 3); hazeTown(L); const c = put(XT[1], P.x, 0, P.z + 4, 0); vaper(c, L, -.3, .9, { exh: 1.6, pow: 6, size: 1.6, n: 70, expr: 'smug', meter: true });
  EX.slice(0, 5).forEach((e, i) => POST.push(() => cashPop(e, '+10 €', clamp((L.T - .3 - i * .2) / .3), 'green', .6)));
  cm([P.x + 4, 62, P.z + 78, P.x, 2, P.z - 4, 46], [P.x + 1, 11, P.z + 24, P.x, 4.5, P.z + 2, 44], L.k, easeOut); sh(V(P.x, 0, P.z), 40); DOF = 0; },
  [[0, 'ding_reveal', .7], [.1, 'city_amb', .6], [.3, 'vape_out', .6], [.6, 'cash', .5], [1.0, 'cash', .4]]);
// 2 «bekommst du jedes Mal Geld,»: Jonas de cerca: exhala, su Dampfmesser pita y le salen billetes
shot(1.40, 'C', 'punch', L => { town(L, 10, P.x, P.z + 4, 6, 14, 5); const c = put(XT[1], P.x, 0, P.z + 4, 0); const ph = vaper(c, L, L.t0 - 1.0, .7, { exh: 1.2, pow: 5, size: 1.2, expr: 'joy', meter: true, after: 'open_smile' });
  WM.get(c).userData.set('0,7 s', '+10 €'); billDrop(c, L.t0 + .35, L.T, 1, 10); POST.push(() => cashPop(c, '+10 €', clamp((L.lt - .4) / .25), 'green', 1));
  orbit(V(P.x, 5.4, P.z + 4), lerp(11, 9, L.k), -.25, .06, 40); sh(V(P.x, 0, P.z + 4), 18); }, [[0, 'impact', .5], [.45, 'cash', .7], [.5, 'money_rain', .4]]);
// 3 «wenn du an einer Vape ziehst.»: perfil de la cajera dando una calada larga (el LED brilla), empuje lento
shot(2.50, 'S', null, L => { town(L, 10, 30, 8, 7, 16, 7); const c = put(XT[2], 30, 0, 8, -PI / 2 + .1); vaper(c, L, L.t0 - .1, 1.1, { exh: 1.0, expr: 'smug' });
  const h = hp(c); cm([h.x - 7.5, h.y + 1.2, h.z + 2.5, h.x, h.y - .3, h.z, 34], [h.x - 6.2, h.y + 1.0, h.z + 2.1, h.x, h.y - .2, h.z, 32], L.k); sh(V(30, 0, 8), 16); }, [[0, 'swipe', .4], [.25, 'vape_in', .7], [1.2, 'vape_out', .5]]);
// 4 «Und je länger du ziehst,»: la pantalla gigante con la regla; la gente debajo la mira mientras vapea
shot(3.90, 'W', null, L => { town(L, 14, 10, -38, 6, 16, 9, { face: V(10, 14, -46) }); show(BOARD, 10, 0, -50, 0, 1); BOARD.userData.draw((c, w, h) => drawRule(c, w, h, L.lt / .9));
  cm([10, 8, -8, 10, 15, -50, 46], [10, 10, -16, 10, 16.5, -50, 46], L.k); sh(V(10, 0, -42), 30); DOF = 0; }, [[0, 'whoosh', .4], [.2, 'power_on', .6], [.5, 'pling', .4]]);
// 5 «desto mehr bekommst du.»: un vecino suelta una nube gigante y le llueven billetes; los de alrededor aplauden
shot(5.00, 'F', null, L => { town(L, 12, -30, 6, 6, 14, 13); const c = put(EX[20], -30, 0, 6, .2); vaper(c, L, L.t0 - 1.2, 1.4, { exh: 1.4, pow: 6, size: 1.7, n: 70, expr: 'joy', meter: true, after: 'open_smile' });
  billDrop(c, L.t0 + .1, L.T, 8, 100, 2.2); POST.push(() => cashPop(c, '+800 €', clamp((L.lt - .2) / .25), 'gold', 1));
  orb(L.k, V(-30, 4.8, 6), null, [14, .45, .1, 44], [12, .25, .08, 44]); sh(V(-30, 0, 6), 20); }, [[0, 'flash', .4], [.1, 'vape_out', .6], [.3, 'money_rain', .6], [.6, 'cheer', .4]]);
// 6 «Eine Sekunde?»: chico del gorro: calada de 1 s; el HUD cuenta
shot(6.10, 'C', 'punch', L => { town(L, 10, 30, -30, 8, 16, 15, { gap: 1.5 }); const c = put(EX[2], 30, 0, -30, -.25); vaper(c, L, L.t0 - .2, 1.0, { exh: 1, expr: 'neutral', meter: true });
  const s = clamp(L.lt - .1, 0, 1); HUD = { s, e: money(s) }; WM.get(c).userData.set(secs(s), euro(money(s)));
  onFace(c, 7.6, 0, 0, 40, L.k, 6.8); sh(V(30, 0, -30), 16); }, [[0, 'thump', .5], [.1, 'vape_in', .6], [.2, 'tick', .4]]);
// 7 «Zehn Euro.»: exhala y le salta el +10 € con un billete
shot(7.00, null, null, L => { town(L, 10, 30, -30, 8, 16, 15, { gap: 1.5 }); const c = put(EX[2], 30, 0, -30, -.25); vaper(c, L, L.t0 - 1.6, 1.0, { exh: 1.2, expr: 'joy', meter: true, after: 'smile' });
  HUD = { s: 1, e: 10 }; WM.get(c).userData.set('1,0 s', '10 €'); billDrop(c, L.t0 + .05, L.T, 1, 10); POST.push(() => cashPop(c, '+10 €', clamp(L.lt / .2), 'green', 1.1));
  orbit(V(30, 5.0, -30), lerp(12, 11, L.k), .3, .08, 42); sh(V(30, 0, -30), 16); }, [[0, 'vape_out', .5], [.15, 'cash', .7]]);
// 8 «Fünf Sekunden?»: Lena (delantal de panadera) aguanta una calada larga; el HUD sube a 5 s
shot(7.90, 'W', null, L => { town(L, 10, -40, -30, 8, 16, 17, { gap: 1.5 }); const c = put(XT[0], -40, 0, -30, .35); vaper(c, L, L.t0 - .3, 5, { expr: 'determined', meter: true, eyes: 'closed' });
  const s = clamp((L.lt) / .85 * 5, 0, 5); HUD = { s, e: money(s) }; WM.get(c).userData.set(secs(s), euro(money(s)));
  const h = hp(c); cm([h.x + 4.5, h.y + .9, h.z + 6.5, h.x, h.y - .4, h.z, 36], [h.x + 3.6, h.y + .8, h.z + 5.4, h.x, h.y - .3, h.z, 34], L.k); sh(V(-40, 0, -30), 16); }, [[0, 'whoosh', .4], [.1, 'vape_in', .8], [.3, 'ticks', .5]]);
// 9 «Fünfhundert Euro.»: suelta la nube y le sale el +500 € entre billetes
shot(8.80, 'C', 'punch', L => { town(L, 12, -40, -30, 8, 16, 17, { gap: 1.5 }); const c = put(XT[0], -40, 0, -30, .35); vaper(c, L, L.t0 - 5.6, 5, { exh: 1.3, pow: 6, size: 1.5, n: 60, expr: 'joy', meter: true, after: 'open_smile' });
  HUD = { s: 5, e: 500 }; WM.get(c).userData.set('5,0 s', '500 €'); billDrop(c, L.t0, L.T, 1, 500); billDrop(c, L.t0 + .1, L.T, 9, 50, 2.2); POST.push(() => cashPop(c, '+500 €', clamp(L.lt / .2), 'gold', 1.2));
  orb(L.k, V(-40, 5.2, -30), null, [12, .55, .1, 42], [10.5, .35, .08, 42]); sh(V(-40, 0, -30), 18); }, [[0, 'vape_out', .7], [.1, 'cash_reg', .7], [.3, 'money_rain', .5]]);
// 10 «Zehn Sekunden?» (zoom lento): el vecino de la camisa hawaiana aguanta 10 s, se pone rojo; el HUD llega a 10
shot(9.90, 'F', 'slow', L => { town(L, 12, 6, 16, 6, 16, 19); const c = put(nach, 6, 0, 16, -.2); vaper(c, L, L.t0 - .3, 10, { expr: 'determined', meter: true, eyes: 'squint' }); 
  const s = clamp(L.lt / .85 * 10, 0, 10); HUD = { s, e: money(s), col: s > 8 ? '#ffd23f' : '#7aff9a' }; WM.get(c).userData.set(secs(s), euro(money(s)));
  onFace(c, 5.6, 0, .6, 38, L.k, 4.4); sh(V(6, 0, 16), 16); }, [[0, 'flash', .4], [.05, 'vape_in', .9], [.2, 'ticks', .5]]);
// 11 «Glückwunsch!»: exhala una nube gigantesca; confeti y fuegos; HUD 1 Mio
shot(10.80, 'C', 'punch', L => { town(L, 16, 6, 16, 6, 18, 19); const c = put(nach, 6, 0, 16, .9); vaper(c, L, L.t0 - 10.6, 10, { exh: 1.8, pow: 8, size: 2.4, n: 90, expr: 'joy', meter: true, after: 'open_smile' });
  HUD = { s: 10, e: 1e6, col: '#ffd23f' }; WM.get(c).userData.set('10,0 s', '1.000.000 €'); confetti(V(6, 0, 16), L.t0, L.T, 70); billRain(V(6, 2, 16), L.T, 120, 18, 14, 18); fireworks(V(6, 0, -10), L.T, 3, 12);
  orb(L.k, V(6, 5.0, 16), null, [13, .1, .1, 44], [10.5, .2, .08, 44]); sh(V(6, 0, 16), 22); }, [[0, 'vape_out', .9], [.05, 'party_horn', .6], [.15, 'confetti', .6], [.3, 'cheer', .7]]);
// 12 «Du bist Millionär!»: bailando bajo la lluvia de billetes, rodeado de gente que aplaude; MILLIONÄR en dorado
shot(11.60, 'Z', null, L => { town(L, 18, 6, 16, 6, 16, 23); const c = put(nach, 6, Math.abs(Math.sin(L.T * 8)) * .45, 16, 0); actuar(c, 0, [[0, { aLx: 2.7 + Math.sin(L.T * 8) * .3, aRx: 2.7 + Math.cos(L.T * 8) * .3, aLz: .4, aRz: .4, aLe: .4, aRe: .4, hipY: 2.05, twist: Math.sin(L.T * 8) * .15 }]], { T: L.T }); laughF(c, L.T); FACES.push(c);
  VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; WM.get(c).visible = true; WM.get(c).userData.set('10,0 s', '1.000.000 €');
  billRain(V(6, 2, 16), L.T, 180, 20, 16, 18, 6); badge('gold', 'MILLIONÄR!', W / 2, H * .2, clamp(L.lt / .25), 1, 1.1);
  orb(L.k, V(6, 5.4, 16), null, [15, .2, .12, 46], [13, .4, .1, 46]); sh(V(6, 0, 16), 22); }, [[0, 'money_rain', .7], [.1, 'cheer', .7], [.4, 'coins', .5]]);
// 13 «Überleg mal, wie viel du heute schon hättest.»: una chica se gira hacia TI y te ofrece su vape; su Dampfmesser gira cifras; arriba «? €»
shot(12.80, 'R', null, L => { town(L, 12, P.x, P.z - 4, 7, 16, 29, { gap: 1.5 }); const c = put(EX[9], P.x, 0, P.z, 0); const off = easeOut(clamp((L.lt - .1) / .5));
  actuar(c, 0, [[0, { aRx: lerp(.8, 1.35, off), aRz: lerp(.1, .45, off), aRe: lerp(1.2, .35, off), aLx: .75, aLz: -.1, aLe: 1.45, headX: .05, headZ: -.1 }]], { T: L.T }); VP.get(c).visible = true; VP.get(c).userData.grip.visible = true;
  const m = WM.get(c); m.visible = true; const r = RNG(Math.floor(L.T * 14)); m.userData.set('? s', Math.floor(r() * 9e6).toLocaleString('de-DE') + ' €', '#ffd23f'); cara(c, L.T, { expr: 'smug', eyes: L.lt > 1.2 ? 'wink' : 'half', mouth: 'smirk' });
  badge('gold', '? €', W / 2, H * .16, clamp((L.lt - .2) / .3), 1, 1.2); onFace(c, 7.4, -.3, 0, 40, L.k, 6.2); sh(V(P.x, 0, P.z), 18); }, [[0, 'whirl', .4], [.2, 'count', .5], [.8, 'hmm', .4]]);
// 14 «Genau.»: el vecino guiña a cámara, sonrisa pícara, con su vape
shot(14.70, 'C', 'punch', L => { town(L, 8, 6, 16, 6, 14, 31); const c = put(nach, 6, 0, 16, 0); actuar(c, 0, [[0, { ...armVape(.15), headZ: .12 }]], { T: L.T }); c.aR.sh.rotation.y = armVape(.15).aRy; VP.get(c).visible = true; VP.get(c).userData.grip.visible = true;
  cara(c, L.T, { eyes: L.lt > .15 ? 'wink' : 'half', mouth: 'smirk' }); onFace(c, 6.6, .3, -.4, 38, L.k, 6.0); sh(V(6, 0, 16), 14); }, [[0, 'impact', .4], [.15, 'blink', .5]]);
