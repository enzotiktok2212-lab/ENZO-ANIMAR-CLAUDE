// ---------- e: el final (96,2 – 122,9 s) ----------
// montaña de dinero (fajos) bajo los pies de Timo
const moneyPile = (c, n = 120, R = 9, H0 = 5) => { BILLP[100].concat(BILLP[500]).slice(0, n).forEach((b, i) => { const r = RNG(i * 31 + 7), a = r() * 6.283, d = Math.sqrt(r()) * R, h = H0 * (1 - d / R); b.visible = true; b.position.set(c.x + Math.cos(a) * d, Math.max(.05, h * (.6 + r() * .4)), c.z + Math.sin(a) * d); b.rotation.set(-PI / 2 + (r() - .5) * .8, r() * 6, (r() - .5) * .6); b.scale.setScalar(1.2); }); };
const RANK2 = [['Timo', '800 Bio. €'], ['Bürgermeister Brandt', '84 Mio. €'], ['Sabine Krüger', '61 Mio. €'], ['Lukas Hoffmann', '47 Mio. €'], ['Anna Wagner', '39 Mio. €'], ['Marie Schulz', '21 Mio. €']];
const crashChart = (c, w, h, k) => { c.fillStyle = '#0a1020'; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 54px ${FONT}`; c.fillStyle = '#ff4a4a'; c.fillText('WIRTSCHAFT', w / 2, 50);
  c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(40, 120 + i * 80); c.lineTo(w - 40, 120 + i * 80); c.stroke(); }
  c.strokeStyle = '#ff3a3a'; c.lineWidth = 12; c.lineJoin = 'round'; c.beginPath(); const n = 40; for (let i = 0; i <= n * k; i++) { const x = 50 + i / n * (w - 100), y = i < n * .45 ? 180 + Math.sin(i * 1.3) * 25 : 180 + (i - n * .45) / (n * .55) * 380 + Math.sin(i * 2) * 15; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  if (k > .6) { c.font = `700 70px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('-99,9 %', w * .72, 300); } };
const newCur = (c, w, h, k) => { c.fillStyle = '#1a2a4a'; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 52px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('NEUE WÄHRUNG:', w / 2, 90);
  if (k > 0) { c.save(); c.translate(w / 2, 300); const s = spring(clamp(k) * 1.6); c.scale(s, s); c.font = `700 190px ${FONT}`; c.lineWidth = 22; c.strokeStyle = '#3a0010'; c.strokeText('HUSTEN', 0, 0); c.fillStyle = '#ffd23f'; c.fillText('HUSTEN', 0, 0); c.restore(); c.font = `700 46px ${FONT}`; c.fillStyle = '#7aff9a'; c.fillText('1× Husten = 1.000 Huster', w / 2, 500); }
  else { c.font = `700 160px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('???', w / 2, 300); } };

// 81 «Dann, plötzlich, Stille.» (zoom lento): la niebla se abre; la vape dorada se apaga; yo, quieto, entre billetes
shot(96.20, 'F', 'slow', L => { use('HB'); scene.fog.color.setRGB(.9, .92, .96); scene.fog.density = lerp(.008, .002, L.k); const c = put(ich, -30, 0, -58.6, 0); const av = armVape(.3); actuar(c, 0, [[0, { ...av }]], { T: L.T }); c.aR.sh.rotation.y = av.aRy; GOLD.visible = true; GOLD.userData.grip.visible = true; GOLD.userData.setGlow(0); FACES.push(c);
  cara(c, L.T, { expr: 'confused', eyes: 'wide', mouth: 'flat' }); moneyPile(V(-30, 0, -58.6), 80, 9, 1.2); WM.get(c).visible = true; WM.get(c).userData.set('52,0 s', '800 Bio. €', '#ffd23f');
  orbit(V(-30, 5, -58.6), lerp(16, 11, L.k), .15, .1, 44); sh(V(-30, 0, -58), 20); }, [[0, 'freeze', .4], [.1, 'silence_tick', .3]]);
// 82 «Ich schaute auf meinen Dampfmesser.»: levanto la muñeca y miro
shot(97.80, 'C', null, L => { use('HB'); const c = put(ich, -30, 0, -58.6, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3, headX: .35, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' }); FACES.push(c); WM.get(c).visible = true; WM.get(c).userData.set('52,0 s', '800 Bio. €', '#ffd23f');
  moneyPile(V(-30, 0, -58.6), 80, 9, 1.2); onFace(c, 6.4, .6, -.6, 38, L.k, 5.8); sh(V(-30, 0, -58), 14); }, [[0, 'whoosh_soft', .3], [.2, 'watch_click', .5]]);
// 83 «Zweiundfünfzig Sekunden.»: macro: 52,0 s
shot(99.00, 'C', 'punch', L => { use('HB'); const c = put(ich, -30, 0, -58.6, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3 }]], { T: L.T }); const M = WM.get(c); M.visible = true; M.userData.set('52,0 s', '800 Bio. €', '#ffd23f'); HUD = { s: 52, e: 8e14, col: '#ffd23f' };
  c.root.updateMatrixWorld(true); const w = M.getWorldPosition(V(0, 0, 0)), q = M.getWorldQuaternion(new THREE.Quaternion()), n = V(0, 0, 1).applyQuaternion(q), p = w.clone().addScaledVector(n, lerp(3.6, 3, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 32); camera.up.copy(V(0, 1, 0).applyQuaternion(q)); camera.lookAt(w); DOF = 1.5; sh(V(-30, 0, -58), 10); }, [[0, 'impact', .5], [.1, 'ding_reveal', .6]]);
// 84 «Achthundert Billionen Euro.» (zoom lento): de pie sobre una montaña de dinero, la cámara sube
shot(100.50, 'F', 'slow', L => { use('HB'); const c = put(ich, -30, 4.6, -58.6, 0); actuar(c, 0, [[0, { aLx: 2.7, aRx: 2.7, aLz: .4, aRz: .4, aLe: .3, aRe: .3 }]], { T: L.T }); grin(c, L.T); FACES.push(c); moneyPile(V(-30, 0, -58.6), 180, 11, 5); billRain(V(-30, 6, -58.6), L.T, 0);
  HUD = { s: 52, e: 8e14, col: '#ffd23f' }; orb(L.k, V(-30, 8, -58.6), null, [22, .3, .05, 46], [18, .2, .2, 46]); sh(V(-30, 0, -58), 22); }, [[0, 'flash', .4], [.1, 'choir', .5], [.3, 'coins', .5]]);
// 85 «Ich war offiziell der reichste Mensch der Welt.»: el ranking mundial con TIMO arriba; yo delante con corona de billetes
shot(102.40, 'C', 'punch', L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => drawRank(c, w, h, 'REICHSTE MENSCHEN DER WELT', RANK2, 0, L.lt / .8)); const c = put(ich, 10, 0, -21, 0); actuar(c, 0, [[0, { aLx: 2.6, aRx: .3, aLz: .3, aLe: .4 }]], { T: L.T }); grin(c, L.T); FACES.push(c);
  vapeCrowd(L, 10, -32, 10, 5, 12, 85, { face: c.root.position, gap: 1.5 }); confRain(V(10, 2, -27), L.T, 60, 18, 10, 14); cm([10, 8.4, -8, 10, 8.6, -46, 46], [10, 8.6, -12, 10, 8.8, -46, 46], L.k); sh(V(10, 0, -40), 28); DOF = 0; }, [[0, 'impact', .4], [.1, 'cheer', .7], [.3, 'party_horn', .5]]);
// 86 «Bis mein Handy klingelte.»: el móvil vibra en mi mano; miro la pantalla: BANK
shot(104.80, 'W', null, L => { use('HB'); const c = put(ich, 10, 0, -27, 0); actuar(c, 0, [[0, { aLx: 1.5, aLz: -.4, aLe: 1.6, headX: .25 }]], { T: L.T }); attach(PHONE, c.aL.hand, [Math.sin(L.T * 60) * .04, -.5, .5], [0, 0, 0], .7); cara(c, L.T, { expr: 'confused', eyes: 'down' }); FACES.push(c); badge3('tag', '📞 BANK', hp(c).add(V(0, 3, 0)), clamp(L.lt / .3), .9);
  onFace(c, 6.6, .4, .4, 38, L.k, 6); sh(V(10, 0, -27), 14); }, [[0, 'phone_ring', .8], [.4, 'vibrate', .5]]);
// 87 «Es war die Bank.»: el banquero al teléfono, serio, en su oficina (despacho)
shot(106.00, 'C', 'punch', L => { use('BU'); inside(1.05, 60); const c = put(bank, BX + 6, 0, 2, -.3); actuar(c, 0, [[0, { aRx: 1.2, aRz: .5, aRe: 2.3 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.5, .5], [0, 0, 0], .6); talk(c, L.T, L.t0, L.t0 + 1, 'worried'); FACES.push(c);
  onFace(c, 6.6, .3, 0, 38, L.k, 6); sh(V(BX + 6, 0, 2), 14); }, [[0, 'impact', .3], [.1, 'click_set', .4]]);
// 88 «Mein Geld hatte die ganze Wirtschaft zerstört.»: en la pantalla gigante, la gráfica se desploma; la gente se lleva las manos a la cabeza
shot(106.80, 'S', null, L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => crashChart(c, w, h, clamp(L.lt / 1.5)));
  [[EX[2], 5.6], [XT[2], 10], [EX[9], 14.4]].forEach(([e, x], i) => { put(e, x, 0, -28, 0); actuar(e, 0, [[0, GEST.hands_head]], { T: L.T + i }); cara(e, L.T + i, { expr: 'shock', mouth: 'scream' }); FACES.push(e); });
  cm([10, 8.4, -8, 10, 8.6, -46, 46], [10, 8.6, -11, 10, 8.8, -46, 46], L.k); sh(V(10, 0, -40), 28); DOF = 0; }, [[0, 'swipe', .3], [.2, 'glitch', .5], [.8, 'shout_crowd', .5]]);
// 89 «Jeder Euro war jetzt wertlos.»: un tipo usa billetes de 500 como pañuelo y los tira a la papelera
shot(108.80, 'C', null, L => { use('HB'); const c = put(EX[5], -6, 0, 6, .3); const k = (L.lt % 1); actuar(c, 0, [[0, { aRx: lerp(1.6, .6, easeOut(k)), aRe: lerp(1.8, .3, easeOut(k)), aRz: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); FACES.push(c);
  billDrop(c, L.t0 - .2, L.T, 6, 500, 2); badge('red', '1 € = 0,00 €', W / 2, H * .2, clamp(L.lt / .3), 1, 1); onFace(c, 7.6, .2, 0, 40, L.k, 7); sh(V(-6, 0, 6), 14); }, [[0, 'paper', .5], [.3, 'sniff', .5], [.7, 'trash_hit', .4]]);
// 90 «Jeder Euro war jetzt wertlos.» (2): un barrendero barre montañas de billetes
shot(109.90, 'W', null, L => { use('HB'); const c = put(XT[3], 2, 0, 0, -.6); actuar(c, 0, [[0, { aLx: .9 + Math.sin(L.T * 8) * .3, aRx: .9 + Math.sin(L.T * 8) * .3, aLz: -.3, aRz: .3, aLe: .6, aRe: .6, lean: .2, twist: Math.sin(L.T * 8) * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' }); FACES.push(c);
  moneyPile(V(-1, 0, 1), 120, 7, 1.2); orbit(V(1, 4.2, 0), lerp(14, 12, L.k), .5, .14, 44); sh(V(0, 0, 0), 18); }, [[0, 'whoosh', .3], [.1, 'brush', .6]]);
// 91 «Also erfand die Regierung eine neue Währung.»: el funcionario en el atril; la pantalla: NEUE WÄHRUNG ???
shot(110.90, 'Z', null, L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => newCur(c, w, h, 0)); const c = put(beam, 10, 0, -26, -.2); talk(c, L.T, L.t0, L.t1, 'smug'); actuar(c, 0, [[0, { aRx: 1.3, aRz: .2, aRe: .3 }]], { T: L.T }); FACES.push(c);
  cm([10, 8.4, -8, 10, 8.6, -46, 46], [10, 8.4, -12, 10, 8.6, -46, 46], L.k); sh(V(10, 0, -40), 28); DOF = 0; }, [[0, 'zoom_in', .3], [.2, 'murmur', .4], [1, 'pages', .4]]);
// 92 «Und rate mal, was sie gewählt haben?» (zoom lento): redoble: la gente espera en silencio
shot(113.10, 'F', 'slow', L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => newCur(c, w, h, 0)); [[EX[2], 5.6], [XT[2], 10], [EX[9], 14.4]].forEach(([e, x], i) => { put(e, x, 0, -28, PI); actuar(e, 0, [[0, { headX: -.25 }]], { T: L.T + i }); FACES.push(e); });
  const c = put(ich, 10, 0, -20, PI); actuar(c, 0, [[0, { headX: -.2 }]], { T: L.T }); cm([10, 7, -2, 10, 9, -46, 46], [10, 7.4, -7, 10, 9.5, -46, 44], L.k); sh(V(10, 0, -30), 28); DOF = 0; }, [[0, 'flash', .3], [.1, 'drone', .5]]);
// 93 «Husten.»: ¡HUSTEN! en la pantalla
shot(114.80, 'C', 'punch', L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => newCur(c, w, h, L.lt / .3)); confetti(V(10, 6, -40), L.t0, L.T, 50);
  cm([10, 8.4, -14, 10, 9.6, -50, 42], [10, 8.6, -16, 10, 9.8, -50, 42], L.k); sh(V(10, 0, -40), 28); DOF = 0; }, [[0, 'boom', .6], [.05, 'cough', .7], [.2, 'cheer', .4]]);
// 94 «Und ich?»: me giro a cámara, tosiendo
shot(115.40, 'C', 'punch', L => { use('HB'); const c = put(ich, 2, 0, 2, lerp(-1.2, 0, easeOut(clamp(L.lt / .3)))); actuar(c, 0, [[0, { lean: .15, aLx: 1.0, aLz: -.6, aLe: 2.0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'half', mouth: 'grimace' }); FACES.push(c);
  vapeCrowd(L, 2, -6, 8, 7, 14, 87, { gap: 1.6 }); onFace(c, 6.6, .2, 0, 40, L.k, 6); sh(V(2, 0, 2), 14); }, [[0, 'thump', .5], [.2, 'cough', .6]]);
// 95 «Seit dieser goldenen Vape»: toso sin parar… y cada tos me paga: +1.000
shot(116.40, 'W', null, L => { use('HB'); const c = put(ich, 2, 0, 2, 0); const k = Math.abs(Math.sin(L.T * 9)); actuar(c, 0, [[0, { lean: .12 + k * .1, headX: .1 + k * .12, aLx: .55, aLz: -.4, aLe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'closed', mouth: k > .5 ? 'scream' : 'grimace' }); FACES.push(c);
  for (let i = 0; i < 4; i++) { POST.push(() => cashPop(c, '+1.000', clamp((L.lt - i * .4) / .15) * (L.lt - i * .4 < .35 ? 1 : 0), 'gold', .8)); SMK.puff(mouthW(c), smokeDir(c, .1), L.T, L.t0 + i * .4, .08, { n: 5, pow: 3, size: .5, dens: .4, seed: 60 + i, life: 1 }); }
  WM.get(c).visible = true; WM.get(c).userData.set('HUSTEN', `${1 + Math.floor(L.lt / .4)}× · ${(1 + Math.floor(L.lt / .4)) * 1000}`, '#ffd23f'); billDrop(c, L.t0, L.T, 6, 100, 2.4);
  orbit(V(2, 4.6, 2), lerp(12, 10, L.k), .3, .08, 42); sh(V(2, 0, 2), 16); }, [[0, 'cough', .7], [.4, 'cough', .6], [.8, 'cough', .7], [.9, 'cash', .4]]);
// 96 «höre ich nicht mehr auf zu husten.»: primer plano: toso y me río a la vez; me llueve dinero otra vez
shot(118.20, 'C', 'punch', L => { use('HB'); const c = put(ich, 2, 0, 2, 0); const k = Math.abs(Math.sin(L.T * 9)); actuar(c, 0, [[0, { lean: .2 + k * .12, headX: .15 + k * .15, aLx: 1.0, aLz: -.6, aLe: 2.0, aRx: .6, aRe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: k > .5 ? 'closed' : 'happy', mouth: k > .5 ? 'scream' : 'open_smile' }); FACES.push(c);
  billRain(V(2, 2, 2), L.T, 120, 16, 12, 16, 4); badge('gold', `+${(3 + Math.floor(L.lt * 3)) * 1000} €`, W / 2, H * .18, 1, 1, 1); onFace(c, 6.2, .2, -.3, 38, L.k, 5.6); sh(V(2, 0, 2), 14); }, [[0, 'cough', .7], [.3, 'money_rain', .5], [.6, 'cough', .6], [1.2, 'laugh_m', .4]]);
// 97 «Warte.»: me quedo congelado; silencio
shot(120.20, 'C', null, L => { use('HB'); const c = put(ich, 2, 0, 2, 0); actuar(c, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'flat' }); FACES.push(c);
  onFace(c, 5.4, .1, 0, 38, L.k, 5); sh(V(2, 0, 2), 12); }, [[0, 'freeze', .5]]);
// 98 «Warum piept mein Dampfmesser schon wieder?» (zoom lento): el medidor parpadea en rojo «!!!»; mi cara de pánico detrás
shot(121.10, 'I', 'slow', L => { use('HB'); const c = put(ich, 2, 0, 2, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'o' }); FACES.push(c);
  const M = WM.get(c); M.visible = true; const on = Math.sin(L.T * 16) > 0; M.userData.set(on ? '!!!' : '', on ? 'ZUG ERKANNT' : '', '#ff3a3a'); TINT = on ? 'rgba(255,0,0,.08)' : null;
  c.root.updateMatrixWorld(true); const w = M.getWorldPosition(V(0, 0, 0)), q = M.getWorldQuaternion(new THREE.Quaternion()), n = V(0, 0, 1).applyQuaternion(q), p = w.clone().addScaledVector(n, lerp(5.5, 3.6, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 34); camera.up.copy(V(0, 1, 0).applyQuaternion(q)); camera.lookAt(w); DOF = 1.3; sh(V(2, 0, 2), 10); }, [[0, 'iris_pop', .3], [.1, 'alarm', .7], [.6, 'heartbeat', .6]]);
