// ---------- d: el Krug que no se vacía y la ciudad inundada de cerveza (103,7 – 139,5 s) ----------
// Felix en el sótano en (KEX, 0, -9) mirando +z; el Krug dorado en su mano derecha (kind 'gold').
const kel = (L, lamp = 1) => { kellerS(L); KE.GK.visible = false; FLASHL.intensity = 60 * lamp; FLASHL.position.set(KEX + 3, 9, -1); FLASHL.target.position.set(KEX, 5, -9); FILL.intensity = 8; };
const fel = (x = 0, z = -9, ry = 0) => put(felix, KEX + x, 0, z, ry);
const fluten = (lvl, T, x = 0, z = 0) => { FLOOD.visible = true; FLOOD.position.x = x; FLOOD.position.z = z; FLOOD.userData.set(lvl, T); };
// cuenta de cervezas de la escena del Krug: 0 en 111,1 s → 1 → 5 → 20 → 100 → 200 → 300 → 500 en 143,8 s
const KC = [[111.12, 0], [111.5, 1], [112.96, 1], [113.3, 5], [114.61, 5], [115.0, 20], [119.59, 20], [119.9, 100], [120.33, 100], [120.6, 200], [121.28, 200], [121.6, 300], [139.5, 480], [143.81, 499], [144.1, 500]];
const kCount = T => { if (T <= KC[0][0]) return 0; for (let i = 1; i < KC.length; i++) if (T <= KC[i][0]) return lerp(KC[i - 1][1], KC[i][1], (T - KC[i - 1][0]) / (KC[i][0] - KC[i - 1][0])); return 500; };
// Felix bebiendo del Krug dorado sin parar (en bucle de tragos)
function chugGold(L, o = {}) { const c = fel(o.x, o.z, o.ry); const r = drink(c, L, o.t0 ?? L.t0 - .5, 99, { kind: 'gold', meter: true, expr: o.expr || 'shock', eyesD: o.eyesD || 'wide', pose: o.pose }); GK2.userData.setGlow(o.glow ?? .6 + Math.sin(L.T * 9) * .2); GK2.userData.fill(1); const n = kCount(L.T); meterOf(c).userData.set(nBier(n) + ' Bier', euro(money(n)), n >= 20 ? '#ffd23f' : '#7aff9a'); setHUD(n, n >= 20 ? '#ffd23f' : '#7aff9a'); return c; }

// 85 «Und trank ihn leer.»: Felix se bebe el Krug dorado de un trago, cabeza hacia atrás
shot(103.71, 'Z', null, L => { kel(L); const c = fel(); drink(c, L, L.t0 + .05, .8, { kind: 'gold', meter: true, expr: 'determined' }); GK2.userData.setGlow(.3); GK2.userData.fill(1 - clamp((L.lt - .3) / .7)); meterOf(c).userData.set('1 Bier', '20 €');
  dcam(c, L.k, 10, -1.0, 4.8); sh(V(KEX, 0, -9), 14); }, [[0, 'swoosh_up', .4], [.1, 'gulp_long', .8]]);
// 86 «Ein paar Sekunden lang:»: baja el Krug y espera, mirándolo… silencio
shot(104.80, 'S', null, L => { kel(L); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .3, aLx: .3 } }); GK2.userData.setGlow(.3); GK2.userData.fill(0); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  badge('q', '…', W / 2, H * .22, clamp(L.lt / .3), 1, 1); onFace(c, 7.6, .2, .3, 40, L.k, 6.4); sh(V(KEX, 0, -9), 14); }, [[0, 'tick', .4], [.4, 'tick', .4], [.8, 'tick', .4]]);
// 87 «nichts.»: plano general del sótano: no pasa nada; se encoge de hombros (grillos)
shot(105.78, 'C', null, L => { kel(L); const c = fel(); actuar(c, L.lt, [[0, 'idle'], [.1, 'shrug', { dur: .3 }]], { T: L.T }); holdMug(c, 'gold'); c.aR.sh.rotation.y = HOLDY; GK2.userData.setGlow(.3); GK2.userData.fill(0); cara(c, L.T, { expr: 'bored', mouth: 'flat' });
  cm([KEX + 6, 9, 8, KEX, 4, -10, 48], [KEX + 5, 9, 6, KEX, 4, -10, 48], L.k); sh(V(KEX, 0, -9), 18); }, [[0, 'crickets', .7]]);
// 88 «Dann wurde der Krug warm, und er»: el Krug se pone al rojo dorado y echa vapor; Felix da un respingo
shot(106.57, 'F', null, L => { kel(L, .6); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .25, lean: -.12, aLx: .9, aLz: .6, aLe: .3 } }); const k = clamp(L.lt / 1.2); GK2.userData.setGlow(.4 + k * 1.2); GK2.userData.fill(0); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  dust(wpos(GK2).add(V(0, 1, 0)), L.t0 + .1, L.T, 10, .5); FILL.color.setRGB(1, .7, .35); onFace(c, 6.4, -.3, .9, 40, L.k, 5.6); sh(V(KEX, 0, -9), 12); }, [[0, 'flash', .4], [.1, 'magic_rise', .6], [.5, 'sizzle', .5]]);
// 89 «füllte sich von selbst wieder.»: la cerveza sube sola dentro del Krug hasta coronarse de espuma
shot(108.20, 'W', null, L => { kel(L, .6); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .35, aLx: .6, aLz: .5 } }); const k = clamp(L.lt / 1.1); GK2.userData.setGlow(1.2); GK2.userData.fill(k); cara(c, L.T, { expr: 'gasp' });
  const p = wpos(GK2); confetti(p.clone().add(V(0, 1.2, 0)), L.t0 + .6, L.T, 16, .3); cm([p.x + .8, p.y + 2.6, p.z + 3.4, p.x, p.y + .9, p.z, 36], [p.x + .6, p.y + 2.2, p.z + 2.8, p.x, p.y + 1, p.z, 34], L.k); sh(V(KEX, 0, -9), 10); DOF = 0; }, [[0, 'fizz', .7], [.4, 'magic_hit', .5]]);
// 90 «Mein Bierzähler fing an zu rattern.»: el Bierzähler del pecho tiembla y sus cifras giran
shot(109.60, 'R', null, L => { kel(L, .6); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .4 } }); GK2.userData.setGlow(1.0); GK2.userData.fill(1); cara(c, L.T, { expr: 'shock', eyes: 'down' }); const m = meterOf(c); const r = RNG(Math.floor(L.T * 30)); m.userData.set(Math.floor(r() * 99) + ' Bier', Math.floor(r() * 9999) + ' €', '#ffd23f'); m.rotation.z = Math.sin(L.T * 60) * .06;
  const mp = wpos(m); cm([mp.x + .8, mp.y + 1.2, mp.z + 5, mp.x, mp.y + .3, mp.z, 34], [mp.x + .5, mp.y + 1, mp.z + 4, mp.x, mp.y + .3, mp.z, 32], L.k); SHAKE = .3; sh(V(KEX, 0, -9), 10); DOF = 0; }, [[0, 'counter_fast', .8], [.4, 'rattle', .6]]);
// 91 «Ein Bier.»: empieza a beber del Krug; HUD: 1 Bier
shot(111.12, 'C', null, L => { kel(L); const c = chugGold(L, { t0: L.t0 - .2, expr: 'determined', eyesD: 'closed' }); dcam(c, L.k, 10, -1.0, 4.8); sh(V(KEX, 0, -9), 14); }, [[0, 'gulp', .6], [.4, 'ding_soft', .4]]);
// 92 «20 Euro.»: un billete de 20 cae a su lado
shot(111.94, 'Z', null, L => { kel(L); const c = chugGold(L, { expr: 'happy' }); billDrop(c, L.t0, L.T, 3, 1.4); cashPop(c, '+20 €', clamp(L.lt / .2), 'green', 1); orbit(V(KEX, 5.4, -9), lerp(12, 11, L.k), .7, .1, 42); sh(V(KEX, 0, -9), 14); }, [[0, 'cash', .6], [.2, 'gulp', .4]]);
// 93 «5 Bier.»: el Krug se rellena una y otra vez; 5
shot(112.96, 'C', null, L => { kel(L); const c = chugGold(L, { expr: 'shock' }); badge('num', '5', W / 2, H * .3, clamp((L.lt - .2) / .2), 1, 1.6); onFace(c, 7, .6, -1.6, 40, L.k, 6.2); sh(V(KEX, 0, -9), 12); }, [[0, 'gulp', .6], [.3, 'ding', .5]]);
// 94 «600 Euro.»: estallido de billetes
shot(113.66, 'Z', null, L => { kel(L); const c = chugGold(L, { expr: 'shock' }); billBurst(hp(c), L.t0, L.T, 26, 1.1); cashPop(c, '+600 €', clamp(L.lt / .2), 'gold', 1.1); orbit(V(KEX, 5.4, -9), lerp(14, 12.5, L.k), -.6, .12, 44); sh(V(KEX, 0, -9), 14); }, [[0, 'money_burst', .6], [.1, 'cash_reg', .5]]);
// 95 «20 Bier.»: 20
shot(114.61, 'C', null, L => { kel(L); const c = chugGold(L, { expr: 'shock', eyesD: 'wide' }); badge('num', '20', W / 2, H * .3, clamp((L.lt - .3) / .2), 1, 1.6); dcam(c, L.k, 9, -1.3, 5); sh(V(KEX, 0, -9), 12); }, [[0, 'gulp', .6], [.4, 'ding', .5]]);
// 96 «Millionär.»: destello dorado, lluvia de billetes en el sótano: 1 MIO. €
shot(115.61, 'F', 'punch', L => { kel(L); const c = chugGold(L, { expr: 'shock' }); billRain(V(KEX, 0, -9), L.T, 70, 18, 14, 13, 3); badge('gold', 'MILLIONÄR', W / 2, H * .2, clamp(L.lt / .15), 1, 1.2); orbit(V(KEX, 5.4, -9), lerp(16, 14, L.k), .2, .14, 46); sh(V(KEX, 0, -9), 16); }, [[0, 'magic_hit', .7], [.05, 'money_rain', .6]]);
// 97 «Aber ich konnte nicht mehr aufhören.»: intenta apartar el Krug con la otra mano y no puede; tambalea, suda
shot(116.29, 'W', null, L => { kel(L); const c = chugGold(L, { expr: 'panic', eyesD: 'wide', pose: { aLx: 2.0, aLz: -.3, aLe: 1.6 + Math.sin(L.T * 12) * .2, lean: Math.sin(L.T * 4) * .12, twist: Math.sin(L.T * 3) * .2 } }); c.root.rotation.y = Math.sin(L.T * 3) * .25; sweat(c, L.T, 3);
  onBody(c, 13, -.8 + Math.sin(L.T) * .1, .1, 44, L.k, 11, -.6, 4.6); camera.up.set(Math.sin(L.T * 2) * .08, 1, 0); sh(V(KEX, 0, -9), 14); }, [[0, 'struggle', .6], [.3, 'gulp', .5], [.8, 'gulp', .5]]);
// 98 «Der Krug füllte sich immer wieder.»: primer plano del Krug: la espuma rebosa y vuelve a subir
shot(117.92, 'S', null, L => { kel(L); const c = chugGold(L, { expr: 'shock' }); const p = wpos(GK2); foamOver(p.clone().add(V(0, .6, 0)), L.T, 22, .9, 1.4);
  orbit(V(KEX, 6.4, -9), lerp(8, 7, L.k), -1.25, .08, 40); sh(V(KEX, 0, -9), 10); }, [[0, 'fizz', .7], [.3, 'bubbling', .5]]);
// 99 «100 Bier.»
shot(119.59, 'C', 'punch', L => { kel(L); const c = chugGold(L, { expr: 'panic' }); badge('num', '100', W / 2, H * .28, clamp(L.lt / .15), 1, 1.8); foamOver(wpos(GK2).add(V(0, .6, 0)), L.T, 18, .9, 1.4); orbit(V(KEX, 5.4, -9), lerp(11, 10, L.k), .5, .1, 42); sh(V(KEX, 0, -9), 12); }, [[0, 'impact', .6], [.05, 'ding', .5]]);
// 100 «200 Bier.»
shot(120.33, 'C', 'punch', L => { kel(L); const c = chugGold(L, { expr: 'panic' }); badge('num', '200', W / 2, H * .28, clamp(L.lt / .15), 1, 1.9); foamOver(wpos(GK2).add(V(0, .6, 0)), L.T, 26, 1, 1.6); orbit(V(KEX, 5.4, -9), lerp(12, 11, L.k), -.7, .12, 42); sh(V(KEX, 0, -9), 12); }, [[0, 'impact', .6], [.05, 'ding', .5]]);
// 101 «300 Bier!»: la espuma empieza a llenar el sótano
shot(121.28, 'F', 'punch', L => { kel(L); const c = chugGold(L, { expr: 'panic' }); fluten(lerp(0, .8, L.k), L.T, KEX, -9); badge('gold', '300', W / 2, H * .28, clamp(L.lt / .15), 1, 2); foamOver(wpos(GK2).add(V(0, .6, 0)), L.T, 32, 1.2, 2); orbit(V(KEX, 5.4, -9), lerp(16, 14, L.k), .1, .16, 46); sh(V(KEX, 0, -9), 16); }, [[0, 'impact', .7], [.05, 'ding_reveal', .5], [.2, 'fizz', .6]]);
// 102 «Der Schaum quoll über den Rand,»: la espuma sale a borbotones del Krug y sube por la escalera del sótano
shot(122.39, 'Z', null, L => { kel(L); const c = chugGold(L, { expr: 'panic' }); fluten(lerp(.8, 2.4, L.k), L.T, KEX, -9); foamOver(wpos(GK2).add(V(0, .4, 0)), L.T * 1.4, 40, 1.6, 2.6);
  cm([KEX - 8, 8, 6, KEX, 4, -10, 48], [KEX - 6, 9, 3, KEX, 4.4, -10, 48], L.k); sh(V(KEX, 0, -9), 18); }, [[0, 'foam_gush', .8], [.4, 'bubbling', .5]]);
// 103 «lief über die Straßen»: un río de cerveza y espuma corre por la calle; la gente corre
shot(123.93, 'W', null, L => { town(L, { bg: false }); fluten(lerp(.3, 1.4, L.k), L.T); crowdAt(L, 0, 20, 10, 4, 14, 81, { mode: 'run', dir: PI, face: V(0, 0, -40), full: true });
  cm([12, 6, 60, 0, 2, 10, 50], [10, 7, 52, 0, 2.5, 10, 50], L.k); sh(V(0, 0, 20), 34); DOF = 0; }, [[0, 'river', .7], [.2, 'screams', .4]]);
// 104 «und füllte die ganze Stadt.»: grúa sobre Brauheim inundado de cerveza dorada hasta las ventanas
shot(124.87, 'S', null, L => { town(L); fluten(lerp(2, 6, L.k), L.T); cm([0, 40, 120, 0, 2, -20, 50], [0, 70, 140, 0, 2, -30, 52], L.k); sh(V(0, 0, -10), 80); DOF = 0; }, [[0, 'whoosh', .4], [.2, 'river', .6], [.6, 'bells', .4]]);
// 105 «Autos schwammen davon,»: el taxi y un deportivo flotan a la deriva, cabeceando
shot(126.62, 'R', null, L => { town(L, { bg: false }); fluten(4.6, L.T); const b = t => Math.sin(L.T * 1.6 + t) * .4; show(CAR1, -6 + L.lt * 2, 3.6 + b(0), 20 + L.lt * 1.5, .6 + Math.sin(L.T) * .2, 1); CAR1.rotation.z = Math.sin(L.T * 1.3) * .1; show(CAR2, 10 - L.lt * 2.4, 3.8 + b(2), 34, -.9 + Math.sin(L.T * .8) * .2, 1); CAR2.rotation.x = Math.sin(L.T * 1.5) * .08;
  orbit(V(2, 5, 26), lerp(30, 26, L.k), .3, .2, 48); sh(V(2, 0, 26), 30); }, [[0, 'water_slosh', .7], [.4, 'car_horn', .4]]);
// 106 «der Brunnen auf dem»: la fuente de la plaza escupe chorros de cerveza
shot(127.91, 'W', null, L => { town(L, { bg: false }); fluten(1.2, L.T); jet(V(-14, 0, -26), L.T, 36, 14, 6); orbit(V(-14, 7, -26), lerp(30, 26, L.k), .4, .16, 48); sh(V(-14, 0, -26), 26); }, [[0, 'fountain', .7]]);
// 107 «Marktplatz sprudelte Bier,»: los vecinos ponen sus jarras bajo el chorro y brindan
shot(128.59, 'C', null, L => { town(L, { bg: false }); fluten(1.2, L.T); jet(V(-14, 0, -26), L.T, 36, 14, 6); for (let i = 0; i < 4; i++) { const a = -1 + i * .7, c = put(CR[24 + i], -14 + Math.sin(a) * 9, 0, -26 + Math.cos(a) * 9, a + PI); prost(c, L, .8 + Math.sin(L.T * 5 + i) * .15); laughF(c, L.T + i); }
  orbit(V(-14, 5, -22), lerp(20, 17, L.k), .1, .12, 46); sh(V(-14, 0, -24), 22); }, [[0, 'fountain', .6], [.2, 'cheer', .5], [.5, 'splash', .5]]);
// 108 «und die Leute paddelten»: vecinos metidos en barriles reman por la plaza inundada
shot(129.89, 'S', null, L => { town(L, { bg: false }); const lv = 3.4; fluten(lv, L.T); for (let i = 0; i < 3; i++) { const x = -8 + i * 8, z = 20 - L.lt * 3 + i * 4, bb = Math.sin(L.T * 2 + i) * .25; const f = show(FASS[i], x, lv - 2.2 + bb, z, 0, .85); f.rotation.z = Math.sin(L.T * 1.6 + i) * .08;
    const c = put(CR[28 + i], x, lv - 2.2 + bb + .6, z, PI); const s = Math.sin(L.T * 4 + i); actuar(c, 0, [[0, { aLx: 1.2 + s * .4, aRx: 1.2 - s * .4, aLz: .3, aRz: .3, aLe: .8, aRe: .8, twist: s * .3 }]], { T: L.T }); attach(PADDLE[i], c.aR.hand, [0, -.6, .3], [.3, 0, 0], 1); laughF(c, L.T + i); c.blob.visible = false; }
  orbit(V(0, 4, 22), lerp(26, 22, L.k), -.3, .18, 48); sh(V(0, 0, 22), 26); }, [[0, 'paddle', .6], [.4, 'paddle', .5], [.2, 'laugh_m', .4]]);
// 109 «in Fässern durch die Gassen.»: travelling bajo, a ras de cerveza, siguiendo un barril entre las casas
shot(131.04, 'W', null, L => { town(L, { bg: false }); const lv = 3.4; fluten(lv, L.T); const z = 50 - L.lt * 6, bb = Math.sin(L.T * 2) * .25; show(FASS[0], -36, lv - 2.2 + bb, z, 0, .85);
  const c = put(resi, -36, lv - 2.2 + bb + .6, z, PI); const s = Math.sin(L.T * 4); actuar(c, 0, [[0, { aLx: 1.2 + s * .4, aRx: 1.2 - s * .4, aLz: .3, aRz: .3, aLe: .8, aRe: .8, twist: s * .3 }]], { T: L.T }); attach(PADDLE[0], c.aR.hand, [0, -.6, .3], [.3, 0, 0], 1); laughF(c, L.T); c.blob.visible = false;
  for (let i = 1; i < 3; i++) { show(FASS[i], -30 - i * 2, lv - 2.2 + Math.sin(L.T * 2 + i) * .25, z - 8 * i, 0, .8); }
  cm([-38, lv + 2.2, z + 12, -36, lv + 3, z, 50], [-38, lv + 2.4, z + 10, -36, lv + 3, z, 50], L.k); sh(V(-36, 0, z), 20); }, [[0, 'paddle', .6], [.5, 'water_slosh', .5]]);
// 110 «Und mein Konto?»: el móvil de Felix: el saldo vuela
shot(132.32, 'Z', null, L => { kel(L); fluten(1.6, L.T, KEX, -9); show(PHONE, KEX, 6, -9, 0, 1.6); POST.push(() => PHONE.lookAt(camera.position)); const n = kCount(L.T); PHONE.userData.draw(cx => drawBankApp(cx, 300, 560, euro(money(n)), '+ + + + +', '#ffd23f'));
  cm([KEX + .4, 6.6, -4.6, KEX, 6, -9, 36], [KEX + .3, 6.4, -5.4, KEX, 6, -9, 34], L.k); sh(V(KEX, 0, -9), 8); DOF = 0; }, [[0, 'notif', .6], [.3, 'notif', .5], [.6, 'notif', .5]]);
// 111 «Es stieg und stieg.»: Felix sigue bebiendo con la espuma por las rodillas; el HUD no para
shot(133.27, 'C', null, L => { kel(L); fluten(1.6, L.T, KEX, -9); const c = chugGold(L, { expr: 'panic' }); foamOver(wpos(GK2).add(V(0, .6, 0)), L.T, 20, 1.2, 1.6); orbit(V(KEX, 5.6, -9), lerp(13, 11, L.k), -.4 + L.k * .3, .2, 44); sh(V(KEX, 0, -9), 14); }, [[0, 'counter_fast', .6], [.4, 'gulp', .4]]);
// 112 «Sogar der Bürgermeister»: el alcalde, con la cerveza por la cintura en su despacho, marca el teléfono
shot(134.75, 'W', null, L => { amtS(L); fluten(3.2, L.T, AMX, 0); const c = put(kranzl, AMX + 3, 0, -3, -.3); actuar(c, 0, [[0, { aRx: 2.4, aRz: -.2, aRe: 2.2, headY: .2 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.6, .5], [0, 0, 0], .9); cara(c, L.T, { expr: 'worried', mouth: 'talk' }); PHONE.userData.draw(cx => drawCall(cx, 300, 560, 'FELIX', 'ANRUF …'));
  onBody(c, 13, -.25, .14, 44, L.k, 11, -.15, 4.4); sh(V(AMX + 3, 0, -3), 16); }, [[0, 'water_slosh', .5], [.2, 'phone_dial', .6]]);
// 113 «hat mich angerufen.»: en el sótano vibra el móvil de Felix: «BÜRGERMEISTER»
shot(135.77, 'S', null, L => { kel(L); fluten(1.6, L.T, KEX, -9); show(PHONE, KEX + Math.sin(L.T * 60) * .05, 6, -9, 0, 1.6); POST.push(() => PHONE.lookAt(camera.position)); PHONE.userData.draw(cx => drawCall(cx, 300, 560, 'BÜRGERMEISTER', 'EINGEHENDER ANRUF'));
  cm([KEX + .4, 6.7, -3.4, KEX, 6, -9, 38], [KEX + .3, 6.6, -3.9, KEX, 6, -9, 36], L.k); sh(V(KEX, 0, -9), 8); DOF = 0; }, [[0, 'phone_vibrate', .8], [.4, 'ringtone', .5]]);
// 114 «Unter Tränen.»: primer plano del alcalde llorando al teléfono
shot(136.72, 'C', null, L => { amtS(L); fluten(3.2, L.T, AMX, 0); const c = put(kranzl, AMX + 3, 0, -3, -.3); actuar(c, 0, [[0, { aRx: 2.4, aRz: -.2, aRe: 2.2, headX: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.6, .5], [0, 0, 0], .9); cara(c, L.T, { expr: 'cry', mouth: Math.sin(L.T * 9) > 0 ? 'ah' : 'frown' }); tears(c, L.T, 0);
  onFace(c, 6, .1, -.3, 40, L.k, 5.2); sh(V(AMX + 3, 0, -3), 12); }, [[0, 'cry_m', .7], [.4, 'sniff', .4]]);
// 115 «So etwas hatte die Stadt noch nie gesehen.»: los vecinos asomados a los balcones miran la ciudad de cerveza, boquiabiertos
shot(137.76, 'R', null, L => { town(L); fluten(3.0, L.T); for (let i = 0; i < 6; i++) { const c = put(CR[i + 4], [-4.5, -1.5, 1.5, 4.5, -3, 3][i], 0, [30, 31, 30, 31, 34, 34][i], (i % 2 ? .3 : -.3)); actuar(c, 0, [[0, i % 2 ? 'hands_head' : 'shock']], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); c.blob.visible = false; }
  cm([0, 12, 52, 0, 8, 20, 50], [0, 13, 46, 0, 8.4, 20, 50], L.k); sh(V(0, 0, 24), 40); DOF = 0; }, [[0, 'whirl', .4], [.2, 'gasp', .5], [.6, 'river', .4]]);
