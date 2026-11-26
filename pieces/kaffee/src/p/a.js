// ---------- a: gancho, promesa, Oma (CTA) y la leyenda (0 – 35,8 s) ----------
// Plaza de Röstheim: fila del gancho en z = 6 delante de la fuente-cafetera (0, -8); terrazas en x = ±40; carrito de café en (14, 14).
const dcam = (ch, k, d = 10, yaw = -1.0, dy = 5.2, fov = 40) => onBody(ch, d, yaw, .1, fov, k, d * .84, yaw + .12, dy);
const sit2 = (c, x, z, ry, seat = 2.65) => { put(c, x, sitY(c, seat), z, ry); c.blob.visible = false; return c; };
const SITP = sitPose({ aLx: .5, aLe: 1.2, aLz: -.1 });
const TB = V(OKX - 4, 0, 0);   // mesa de la cocina de Oma (sillas norte en z = -4.4 mirando +z, x = TB.x ± 3)
const omaSeat = (c, L, x = -3) => sit2(c, TB.x + x, -4.4, 0);
function drawRule(c, w, h, k) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3a1e0e'); g.addColorStop(1, '#1a0c04'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 60px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('JEDE TASSE', w / 2, 64); c.fillStyle = '#f0c060'; c.fillText('= GELD AUFS KONTO!', w / 2, 132);
  [['ESPRESSO', '12 €', .1], ['KANNE', '800 €', .32], ['20 TASSEN', '1 MIO. €', 1]].forEach(([a, b, v], i) => { const x = 200 + i * 312, bh = 300 * v * clamp(k * 1.8 - i * .35); c.fillStyle = ['#f0c060', '#e8823a', '#5aff9a'][i]; c.beginPath(); c.roundRect(x - 84, 520 - bh, 168, bh, 18); c.fill();
    c.font = `700 36px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(a, x, 552); if (bh > 30) { c.font = `700 44px ${FONT}`; c.fillText(b, x, 520 - bh - 32); } }); }
function drawLegend(c, w, h, k, gold = 0) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, gold ? '#6a4a00' : '#2a1608'); g.addColorStop(1, gold ? '#2a1a00' : '#100804'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.strokeStyle = '#f0c060'; c.lineWidth = 12; c.strokeRect(14, 14, w - 28, h - 28); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#f0c060'; c.font = `700 74px ${FONT}`; c.fillText('DIE LEGENDE', w / 2, 90);
  c.fillStyle = '#ffffff'; c.font = `700 62px ${FONT}`; c.fillText('50 TASSEN', w / 2, 220); c.font = `700 40px ${FONT}`; c.fillText('AN EINEM TAG', w / 2, 290); c.fillStyle = gold ? '#fff4a0' : '#f0c060'; c.font = `700 ${70 + k * 20}px ${FONT}`; c.fillText('= BILLIONÄR', w / 2, 400);
  c.fillStyle = '#d8b090'; c.font = `700 32px ${FONT}`; c.fillText(gold ? 'GESCHAFFT!' : 'REKORD: 29 TASSEN', w / 2, 500); }

// 1 «In dieser Stadt macht dich»: seis vecinos en fila delante de la fuente-cafetera levantan la taza a la vez, beben… y de cada taza sale una lluvia de billetes. Empuje centrado.
shot(0, 'C', 'punch', L => { town(L, { morning: 1 }); const RP = [[-7, 6], [-3.5, 7.5], [0, 8.4], [3.5, 7.5], [7, 6], [0, 2.4]]; const row = [CR[0], CR[1], CR[2], CR[3], CR[4], REN[1]];
  row.forEach((c, i) => { put(c, RP[i][0], 0, RP[i][1], .7); drink(c, L, .05 + Math.abs(i - 2) * .04, .45, { meter: true, bg: i !== 2, expr: 'happy', l1: .2 }); if (L.lt > .62) cashPop(c, '+12 €', clamp((L.lt - .62 - i * .03) / .2), 'green', .75); });
  crowdAt(L, 0, 4, 8, 9, 15, 2, { mode: i => ['drink', 'cheer', 'prost'][i % 3], from: 5, gap: 1.0 }); billFall(V(0, 0, 6), L.t0 + .45, L.T, 70, 22, 8, 16); leaves(V(0, 0, 14), L.T, 16, 30, 10, 18);
  CAMK = 1; cm([0, 26, 46, 0, 4, 5, 50], [0, 7.4, 26, 0, 5.4, 5, 44], clamp(L.lt / .75), easeOut); sh(V(0, 0, 6), 30); },
  [[0, 'sip', .6], [.25, 'crowd_cheer', .3], [.5, 'money_rain', .7], [.7, 'cash', .6]]);
// 2 «Kaffee reich.»: en la terraza, una vecina con abrigo da un sorbo y de su taza explotan billetes; se ríe. Plano de tres cuartos, acercándose.
shot(1.12, 'W', 'punch', L => { town(L, { morning: 1 }); const h = cafeNear(30); const c = sit2(CR[6], h.x * .85 + 0, h.z - 5.6, 0); drink(c, L, L.t0 - .25, .4, { sit: true, pose: SITP, meter: true, expr: 'happy', after: 'joy' });
  billBurst(hp(c).add(V(0, -.8, 0)), L.t0 + .28, L.T, 14, 1.1); FACES.push(c); cashPop(c, '+12 €', clamp((L.lt - .3) / .2), 'green', 1.1); terrace(L, h, 3, 'sitdrink', { from: 7 });
  dcam(c, L.k, 14, -.6, 4.4, 42); sh(V(c.root.position.x, 0, c.root.position.z), 20); }, [[0, 'ahh', .5], [.28, 'money_burst', .6], [.4, 'cash_reg', .5]]);
// 3 «Jede Tasse, die du trinkst,»: dentro del Café Bohne, el barista desliza la taza por la barra; un cliente la coge y bebe; su Kaffeezähler pita
shot(2.31, 'Z', null, L => { cafe(L); const b = put(barista, CIX - 2, 0, -13.2, 0); actuar(b, L.lt, [[0, { aRx: 1.2, aRe: .6, lean: .1 }], [.5, { aRx: .8, aRe: 1.0, aLx: .4 }, { dur: .4 }]], { T: L.T }); talk(b, L.T, L.t0, L.t0 + 1, 'happy');
  const cu = CUPS[0]; const slide = easeOut(clamp(L.lt / .45)); show(cu, CIX - 2 + slide * 3, 4.7, -10, 0, 1); cu.userData.level(.85); cu.userData.steam(L.T, 1);
  const c = put(CR[8], CIX + 1.6, 0, -6.4, PI); if (L.lt > .5) drink(c, L, L.t0 + .55, .5, { kind: cu, meter: true, expr: 'happy' }); else { actuar(c, 0, [[0, { aRx: .9, aRe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); }
  crowdAt(L, CIX, 4, 6, 8, 14, 3, { mode: 'drink', gap: 1.4 }); orbit(V(CIX, 5.4, -8.5), lerp(16, 13, L.k), -.55, .14, 44); sh(V(CIX, 0, -8), 20); }, [[0, 'slide', .5], [.5, 'sip', .6], [1.1, 'beep', .5]]);
// 4 «landet sofort als Geld auf deinem Konto.»: un abuelo en un banco de la plaza bebe; en su móvil el saldo salta +12 € y le caen monedas en la mano
shot(3.59, 'S', null, L => { town(L, { morning: 1 }); const c = sit2(REN[0], -16.6, -18, PI / 2, 2.4); drink(c, L, L.t0 - .1, .45, { sit: true, pose: { ...SITP, aLx: .9, aLe: 1.6, aLz: .2 }, meter: true, expr: 'happy' });
  const hw = wpos(c.aL.hand); show(PHONE, hw.x + .4, hw.y + .7, hw.z + .2, 1.05, .9); PHONE.rotation.x = -.2; const k = clamp((L.lt - .6) / .4); PHONE.userData.draw(c_ => drawBankApp(c_, 300, 560, euro(12 * 41 + (k > .5 ? 12 : 0)), k > .5 ? '+12 € KAFFEE' : '', '#5aff9a'));
  coins(hp(c).add(V(1.5, -1, 1)), L.t0 + .7, L.T, 14); cashPop(c, '+12 €', clamp((L.lt - .75) / .2), 'green', 1); crowdAt(L, -10, -10, 6, 7, 14, 6, { mode: i => ['walk', 'drink'][i % 2], gap: 1.6 });
  orbit(V(-16, 4.6, -18), lerp(12, 10.5, L.k), PI / 2 + .4, .14, 42); sh(V(-16, 0, -18), 18); }, [[0, 'whoosh_soft', .4], [.6, 'notify', .6], [.75, 'coins', .6]]);
// 5 «Ein Espresso?»: primer plano de un espresso humeante en su platito; una mano lo coge
shot(5.64, 'C', 'punch', L => { cafe(L); const e = ESP[0]; show(e, CIX + 0, 4.7, -9.4, 0, 2.2); e.userData.level(.9); e.userData.cup.userData.steam(L.T, 1); setHUD(0); HUD.a = clamp(L.lt / .2);
  const c = put(CR[9], CIX + 3.2, 0, -6.6, -.7); actuar(c, L.lt, [[0, { aRx: .6, aRe: .9 }], [.2, { aRx: 1.25, aRz: .1, aRe: .7, lean: .12 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'o' });
  cm([CIX + 0, 8.4, -3.4, CIX + 0, 5.6, -9.4, 38], [CIX + 0, 8, -4.4, CIX + 0, 5.5, -9.4, 36], L.k); sh(V(CIX, 0, -9), 14); DOF = .5; }, [[0, 'cup_clink', .6], [.1, 'steam', .4]]);
// 6 «Zwölf Euro.»: el chico de gafas se lo toma de un trago; pling: +12 € y un billete cae en su mano; el HUD marca 1 Tasse · 12 €
shot(6.28, null, null, L => { cafe(L); const c = put(CR[9], CIX + 6, 0, -5, 0); drink(c, L, L.t0 - .15, .3, { kind: 'esp', meter: true, after: 'joy' }); meterOf(c).userData.set('1 Tasse', '12 €'); setHUD(1);
  billDrop(c, L.t0 + .2, L.T, 3, 1.4); cashPop(c, '+12 €', clamp((L.lt - .2) / .2), 'green', 1.2); crowdAt(L, CIX + 4, -2, 5, 7, 12, 9, { mode: 'drink', gap: 1.6 });
  orbit(V(CIX + 6, 5.4, -5), lerp(11.5, 10, L.k), -.25, .1, 42); sh(V(CIX + 6, 0, -5), 16); }, [[0, 'gulp', .5], [.2, 'cash_reg', .7], [.3, 'paper', .4]]);
// 7 «Eine ganze Kanne?»: en la terraza, un señor levanta una cafetera entera y se la bebe directamente
shot(7.37, 'W', null, L => { town(L, { morning: 1 }); const h = cafeNear(-30); const c = put(REN[2], h.x * .82, 0, h.z + 2, h.x < 0 ? PI / 2 : -PI / 2); const K = KAN[0]; K.userData.level(lerp(1, .5, clamp((L.lt - .3) / .5)));
  drink(c, L, L.t0 + .1, .6, { kind: K, chug: true, meter: true, expr: 'determined', eyesD: 'squint' }); K.scale.multiplyScalar(.6); K.userData.steam(L.T, 1); setHUD(L.lt < .5 ? 1 : 4);
  terrace(L, h, 4, i => ['sitprost', 'sithold', 'sitdrink', 'sitprost'][i], { from: 10 }); dcam(c, L.k, 12.5, -1.2, 5.2, 42); sh(V(c.root.position.x, 0, c.root.position.z), 20); },
  [[0, 'whoosh_soft', .4], [.1, 'gulp_long', .6], [.7, 'crowd_ooh', .3]]);
// 8 «Achthundert Euro.»: la Kanne vacía en alto, estallido de billetes, +800 €; la terraza aplaude
shot(8.19, 'C', 'punch', L => { town(L, { morning: 1 }); const h = cafeNear(-30); const c = put(REN[2], h.x * .82, 0, h.z + 2, h.x < 0 ? PI / 2 : -PI / 2); const K = KAN[0]; K.userData.level(0); prost(c, L, 1, { kind: K, pose: { aLx: 2.6, aLz: .4 } }); K.scale.multiplyScalar(.6); FACES.push(c); laughF(c, L.T); meterOf(c).userData.set('8 Tassen', '800 €'); setHUD(8, '#f0c060');
  billBurst(hp(c).add(V(0, 1, 0)), L.t0, L.T, 34, 1.3); cashPop(c, '+800 €', clamp(L.lt / .2), 'gold', 1.3); terrace(L, h, 4, 'sitcheer', { from: 10 }); crowdAt(L, h.x * .7, h.z + 8, 5, 5, 10, 11, { mode: 'clap', gap: 1.6 });
  orbit(V(c.root.position.x, 5.6, c.root.position.z), lerp(13, 11.5, L.k), (h.x < 0 ? PI / 2 : -PI / 2) - (h.x < 0 ? .55 : -.55), .14, 42); sh(V(c.root.position.x, 0, c.root.position.z), 20); }, [[0, 'cash_reg', .7], [.05, 'money_burst', .6], [.3, 'clap', .5]]);
// 9 «Zwanzig Tassen?» (zoom lento): una señora con abrigo rojo, detrás de una pirámide de 19 tazas vacías, se bebe la número 20
shot(9.35, 'F', 'slow', L => { town(L, { morning: 1 }); const h = cafeNear(10); const tx = Math.sign(h.x) * 40; const c = sit2(REN[3], tx, h.z - 5.6, 0); drink(c, L, L.t0 + .05, .6, { sit: true, pose: SITP, meter: true, expr: 'determined', eyesD: 'squint' }); setHUD(L.lt < .75 ? 19 : 20, '#f0c060');
  stack(V(tx + (h.x < 0 ? -2.4 : 2.4), 0.1, h.z - 7.4), 19, 1, 0); terrace(L, h, 2, 'sithold', { from: 14 }); crowdAt(L, tx * .85, h.z - 2, 6, 6, 12, 12, { mode: 'clap', gap: 1.8 });
  dcam(c, L.k, 15, (h.x < 0 ? -.5 : .5), 4.6, 42); sh(V(tx, 0, h.z - 4), 18); }, [[0, 'gulp_long', .6], [.5, 'drumroll', .4]]);
// 10 «Und schon bist du Millionär!»: la levantan en hombros, confeti y lluvia de billetes; el HUD 20 Tassen · 1 Mio. € en dorado
shot(10.44, 'Z', 'punch', L => { town(L, { morning: 1 }); const c = put(REN[3], 0, lerp(0, 2.4, easeOut(clamp(L.lt / .3))), 10, 0); prost(c, L, 1, { pose: { aLx: 2.8, aLz: .5 } }); laughF(c, L.T); setHUD(20, '#ffd23f'); meterOf(c).userData.set('20 Tassen', '1 Mio. €', '#ffd23f');
  const lift = [CR[11], CR[12], CR[13]]; lift.forEach((x, i) => { put(x, -1.6 + i * 1.6, 0, 9.2 - (i % 2) * .8, 0); actuar(x, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .1, aRz: .1, aLe: .2, aRe: .2 }]], { T: L.T }); laughF(x, L.T + i); });
  confetti(V(0, 6, 10), L.t0, L.T, 70, 1.2); billRain(V(0, 0, 8), L.T, 70, 24, 12, 16); cashPop(c, '1 MIO. €', clamp((L.lt - .2) / .25), 'gold', 1.4, 3.6); crowdAt(L, 0, 6, 10, 7, 14, 15, { mode: i => ['cheer', 'clap', 'prost'][i % 3], from: 14 });
  orbit(V(0, 7.4, 10), lerp(20, 17, L.k), .1, .12, 46); sh(V(0, 0, 10), 26); }, [[0, 'crowd_cheer', .5], [.1, 'confetti', .6], [.3, 'cash_reg', .5], [.6, 'party_horn', .4]]);
// 11 «Einen Tag lang hatte ich mehr Geld»: yo (Noah) en lo alto de la escalinata de la villa, una lluvia de billetes; abro los brazos. HUD 1 Bio. €
shot(12.23, 'F', null, L => { villaS(L); const c = put(ich, VIX, 0, -10, 0); actuar(c, L.lt, [[0, { aLx: .4, aRx: .4 }], [.2, { aLx: 2.4, aRx: 2.4, aLz: .9, aRz: .9, aLe: .2, aRe: .2, headX: -.15 }, { dur: .4 }]], { T: L.T }); laughF(c, L.T); setHUD(50, '#ffd23f');
  billRain(V(VIX, 0, -10), L.T, 90, 26, 18, 20); confRain(V(VIX, 0, -8), L.T, 40, 24, 14, 18); orbit(V(VIX, 5, -10), lerp(17, 14, L.k), -.2, .1, 44); sh(V(VIX, 0, -10), 28); },
  [[0, 'flash', .4], [.1, 'money_rain', .7], [.5, 'cha_ching', .5]]);
// 12 «als jeder andere Mensch auf der Erde.»: en la plaza, de pie en el borde de la fuente con montones de billetes; abajo la gente me señala con la boca abierta
shot(13.84, 'W', null, L => { town(L, { morning: 1 }); const c = put(ich, 0, 2.2, 4, 0); actuar(c, 0, [[0, { aLx: 2.2, aLz: .6, aRx: .5, aRz: .2, aLe: .4 }]], { T: L.T }); laughF(c, L.T); setHUD(50, '#ffd23f');
  crowdAt(L, 0, 10, 12, 5, 12, 16, { mode: i => ['point', 'shock'][i % 2], face: V(0, 6, 4), gap: .9 }); billRain(V(0, 0, 4), L.T, 60, 18, 10, 16);
  cm([0, 3.2, 30, 0, 6.8, 4, 48], [0, 4.2, 25, 0, 7.4, 4, 46], L.k); sh(V(0, 0, 6), 26); }, [[0, 'whoosh', .4], [.2, 'crowd_ooh', .5], [.9, 'money_rain', .4]]);
// 13 «Heute würde ich alles hergeben»: de noche en mi cuarto, tumbado en la cama con los ojos como platos y ojeras; el despertador marca 3:00
shot(15.81, 'B', null, L => { zimmerS(L, { night: 1 }); const c = put(ich, ZIX - 7, 3.5, -2.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .12, 0, 0); c.blob.visible = false; CAMK = 1;
  actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T, breathe: true }); cara(c, L.T, { eyes: 'wide', mouth: 'flat' }); DS1.userData.draw('3:00', (cc, w, h) => { cc.fillStyle = '#0a0a10'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#ff3a3a'; cc.font = `700 200px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('3:00', w / 2, h / 2 + 10); });
  show(DS1, ZIX - 1, 4.2, -7.5, 0, .32); const h0 = hp(c); cm([ZIX - 1, 12, 3, h0.x, h0.y, h0.z + 1.5, 44], [ZIX - 2, 11, 1.5, h0.x, h0.y, h0.z + 1.5, 42], L.k); sh(V(ZIX - 6, 0, -3), 14); DOF = 0; },
  [[0, 'clock_tick', .6], [.6, 'clock_tick', .6], [1.2, 'owl', .3]]);
// 14 «für eine einzige Nacht Schlaf.» (zoom lento): primer plano de mi cara agotada, parpadeo nervioso; un «Zzz» se aleja sin llegar
shot(17.15, null, 'slow', L => { zimmerS(L, { night: 1 }); const c = put(ich, ZIX - 7, 3.5, -2.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .12, 0, 0); c.blob.visible = false; CAMK = 1; actuar(c, 0, [[0, { headX: .3 }]], { T: L.T });
  cara(c, L.T, { eyes: Math.sin(L.T * 9) > .85 ? 'half' : 'wide', mouth: 'wavy' }); think(c, 'Zzz…?', clamp((L.lt - .3) / .3), 1);
  const h = hp(c); cm([h.x + 1.5, h.y + 8, h.z + 4.4, h.x, h.y, h.z, 36], [h.x + 1.2, h.y + 6.6, h.z + 3.6, h.x, h.y, h.z, 32], L.k); sh(V(ZIX - 6, 0, -3), 14); DOF = 0; }, [[0, 'heartbeat', .5], [.8, 'heartbeat', .5]]);
// 15 «Jeder hat so jemanden in der Familie,»: desayuno familiar en la cocina de Oma: todos charlan, ríen y beben… menos Oma
shot(18.81, 'C', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); holdOnly(o, L, { sit: true, pose: { ...SITP, lean: .1 } }); cara(o, L.T, { expr: 'angry', eyes: 'half', mouth: 'flat' });
  const p = sit2(REN[4], TB.x + 3, -4.4, 0); drinkLoop(p, L, 1, { sit: true, pose: SITP }); talk(p, L.T, L.t0, L.t1, 'happy');
  const k1 = put(JUG[0], TB.x + 7.8, 0, -1, -PI / 2 - .3); actuar(k1, 0, [[0, { aRx: 1.1, aRz: .3, aRe: 1.2 }]], { T: L.T }); talk(k1, L.T, L.t0, L.t1, 'happy'); const k2 = put(REN[5], TB.x - 8, 0, -1, PI / 2 + .3); drinkLoop(k2, L, 2); laughF(k2, L.T);
  orbit(V(TB.x, 5.2, -2.6), lerp(19, 17, L.k), .05, .16, 46); sh(V(TB.x, 0, -2), 20); }, [[0, 'chatter', .5], [.4, 'laugh_small', .4], [1.0, 'cup_clink', .4]]);
// 16 «der vor der ersten Tasse kein Wort sagt.»: el nieto le dice «Guten Morgen, Oma!»… Oma lo mira fijamente, sin decir nada, con la taza vacía
shot(20.47, 'W', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); actuar(o, L.lt, [[0, { ...SITP, aRx: .7, aRe: 1.1 }], [.9, { ...SITP, aRx: .7, aRe: 1.1, headY: .4 }, { dur: .3 }]], { T: L.T, weight: false }); cara(o, L.T, { expr: 'angry', eyes: 'squint', mouth: 'flat' });
  const cu = mugOf(oma); attach(cu, o.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); cu.userData.level(0);
  const k1 = put(JUG[0], TB.x + 2.2, 0, -1.2, -PI / 2 - .6); actuar(k1, 0, [[0, 'wave']], { T: L.T }); talk(k1, L.T, L.t0, L.t0 + .9, 'happy'); bubble(k1, 'Guten Morgen, Oma!', clamp((L.lt - .1) / .2), 2.2);
  if (L.lt > 1.0) { const q = clamp((L.lt - 1.0) / .2); badge('q', '…', W * .3, H * .3, q, 1, .9); }
  onFace(o, 6.8, .4, -.8, 40, L.k); sh(V(TB.x - 3, 0, -4), 14); }, [[0, 'chair_creak', .4], [.2, 'hello', .3], [1.0, 'cricket', .4]]);
// 17 «Bei uns ist das meine Oma.»: Oma da el primer sorbo de su Kanne de flores… y se le ilumina la cara; etiqueta OMA GERDA
shot(22.57, 'C', 'punch', L => { kuecheS(L); const o = omaSeat(oma, L, -3); show(OKAN, TB.x - 5.4, 4.3, -2.4, .4, 1); OKAN.userData.steam(L.T, 1);
  drink(o, L, L.t0 + .15, .55, { sit: true, pose: SITP, expr: 'tired', after: 'joy', afterMouth: 'open_smile' }); if (L.lt > .95) confetti(hp(o).add(V(0, -2, 0)), L.t0 + .95, L.T, 18, .5);
  badge('tag', 'OMA GERDA', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, 1.1); onFace(o, 8, .6, -1.0, 40, L.k); sh(V(TB.x - 3, 0, -4), 14); }, [[0, 'sip', .6], [.9, 'sparkle', .5], [1.0, 'aah_old', .4]]);
// 18 «Acht Tassen am Tag,»: Oma con ocho tazas vacías en fila sobre la mesa, se toma la octava; el reloj de cuco salta de hora en hora
shot(24.58, 'S', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); drink(o, L, L.t0 + .35, .5, { sit: true, pose: SITP, meter: true, expr: 'happy' }); meterOf(o).userData.set(L.lt < .9 ? '7 Tassen' : '8 Tassen', L.lt < .9 ? '700 €' : '800 €');
  for (let i = 0; i < 7; i++) { const t = CUPS[i]; show(t, TB.x - 5 + i * 1.55, 4.3, -1.6 + (i % 2) * .7, i, .8); t.userData.level(0); } badge('num', String(Math.min(8, 1 + Math.floor(L.lt / .2))) + ' TASSEN', W / 2, H * .2, clamp(L.lt / .15), 1, 1);
  orbit(V(TB.x - 1.5, 4.8, -3), lerp(15, 13, L.k), .3, .2, 44); sh(V(TB.x - 2, 0, -3), 16); }, [[0, 'cup_clink', .5], [.3, 'cup_clink', .4], [.6, 'cup_clink', .4], [.9, 'cuckoo', .5]]);
// 19 «und um neun schläft sie trotzdem wie ein Baby.»: de noche, Oma dormida en su sillón verde con la boca abierta, roncando; el reloj marca las 21:00; Zzz
shot(26.22, 'B', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .35, headZ: .25, aLx: .3, aRx: .3, aLe: .6, aRe: .6 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: Math.sin(L.T * 2.4) > 0 ? 'o' : 'flat' }); zzz(o, L.T, 1);
  DS1.userData.draw('21', (cc, w, h) => { cc.fillStyle = '#fbf6ee'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#1a1a1a'; cc.font = `700 170px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('21:00', w / 2, h / 2 + 8); }); show(DS1, OKX + 2, 9.5, -12.4, 0, .4);
  CAMK = 1; orbit(V(OKX + 6, 5, -5), lerp(10, 9, L.k), PI / 2 - .8, .14, 42); sh(V(OKX + 6, 0, -5), 14); }, [[0, 'snore', .6], [1.2, 'snore', .6], [.5, 'clock_tick', .3]]);
// 20 «Und die Legende sagt:»: al atardecer, la gente se reúne alrededor de la pizarra de madera de la plaza, que se ilumina con LA LEYENDA
shot(28.61, 'F', null, L => { town(L, { dusk: 1 }); show(TAFEL, 0, 0, 34, PI); TAFEL.userData.draw((c, w, h) => drawLegend(c, w, h, 0));
  crowdAt(L, 0, 24, 10, 4, 9, 21, { mode: i => ['point', 'shock', 'idle'][i % 3], face: V(0, 15, 34), gap: 1.6 });
  cm([0, 8, 4, 0, 13, 34, 48], [0, 9.5, 12, 0, 14.5, 34, 46], L.k); sh(V(0, 0, 24), 30); DOF = 0; }, [[0, 'whoosh', .4], [.1, 'mystery', .6], [.6, 'crowd_ooh', .3]]);
// 21 «Wer an einem einzigen Tag fünfzig Tassen»: en la terraza, una pirámide gigante de 50 tazas que crece taza a taza; el número 50 sube
shot(29.83, 'S', null, L => { town(L, { dusk: 1 }); const h = cafeNear(-60); const tx = Math.sign(h.x) * 40; stack(V(tx, 3.98, h.z - 3.2), 50, clamp(L.lt / 1.3), 0); const k = Math.min(50, Math.floor(clamp(L.lt / 1.3) * 50));
  badge('num', k + ' TASSEN', W / 2, H * .2, clamp(L.lt / .12), 1, 1.05); terrace(L, h, 3, 'sitcheer', { from: 4 });
  orbit(V(tx, 7, h.z - 3.2), lerp(20, 17, L.k), (h.x < 0 ? PI / 2 : -PI / 2) * .45, .06, 48); sh(V(tx, 0, h.z), 20); }, [[0, 'tick', .4], [.3, 'tick', .4], [.6, 'tick', .4], [.9, 'tick', .4], [1.2, 'tick', .4]]);
// 22 «schafft, wird Billionär.» (zoom lento): la pizarra en dorado: = BILLIONÄR; brillos; una corona de oro gira encima
shot(31.39, 'Z', 'slow', L => { town(L, { dusk: 1 }); show(TAFEL, 0, 0, 34, PI); TAFEL.userData.draw((c, w, h) => drawLegend(c, w, h, clamp(L.lt / 1.5), 0)); const cr = CROWNS[0]; show(cr, 0, 25.5 + Math.sin(L.T * 3) * .3, 33, L.T * 1.5, 3);
  confRain(V(0, 8, 32), L.T, 30, 26, 6, 20); crowdAt(L, 0, 24, 8, 4, 9, 21, { mode: 'shock', face: V(0, 15, 34), gap: 1.6 });
  cm([0, 14, 6, 0, 16.5, 34, 44], [0, 15, 13, 0, 17, 34, 40], L.k); sh(V(0, 0, 28), 30); DOF = 0; }, [[0, 'sparkle', .5], [.6, 'choir', .4]]);
// 23 «Aber bei Tasse dreißig»: un hombre fortachón en la terraza, rodeado de 29 tazas, tiembla con los ojos desorbitados al coger la 30
shot(33.47, 'C', null, L => { town(L, { dusk: 1 }); const h = cafeNear(30); const tx = Math.sign(h.x) * 40; const c = sit2(CR[16], tx, h.z - 5.6, 0); const T2 = L.T;
  drink(c, L, L.t0 + .4, .5, { sit: true, pose: { ...SITP, ...tremble(T2, 1.4) }, meter: true, expr: 'shock', eyesD: 'wide' }); stack(V(tx + (h.x < 0 ? -2.4 : 2.4), 0.1, h.z - 7.6), 29, 1); sweat(c, L.T, 3); setHUD(L.lt < .9 ? 29 : 30, '#ff8a4a');
  dcam(c, L.k, 14, -.45, 4.6, 42); sh(V(tx, 0, h.z - 4), 18); }, [[0, 'heartbeat', .6], [.4, 'shiver', .5]]);
// 24 «gibt jeder auf.»: se cae de la silla de espaldas, la taza vuela; la gente de las otras mesas se tapa la boca
shot(34.53, 'C', 'punch', L => { town(L, { dusk: 1 }); const h = cafeNear(30); const tx = Math.sign(h.x) * 40; const c = put(CR[16], tx, 0, h.z - 5.6, 0); const k = easeIn(clamp(L.lt / .45));
  c.root.rotation.order = 'YXZ'; c.root.rotation.x = -k * 1.5; c.root.position.z -= k * 2; c.root.position.y = 1.3 * (1 - k) + .4; actuar(c, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .8, aRz: .8, lLx: 1.4, lRx: 1.0 }]], { T: L.T }); cara(c, L.T, { eyes: k > .9 ? 'closed' : 'scared', mouth: 'scream' });
  const cu = CUPS[3]; show(cu, tx + 1 + L.lt * 2, 6 + L.lt * 6 - L.lt * L.lt * 18, h.z - 4, L.T * 9, 1); cu.rotation.x = L.T * 7; stack(V(tx + (h.x < 0 ? -2.4 : 2.4), 0.1, h.z - 7.6), 29, 1); setHUD(30, '#ff4a4a');
  terrace(L, h, 2, 'sithold', { from: 18 }); crowdAt(L, tx * .85, h.z + 2, 5, 5, 10, 24, { mode: 'shock', gap: 1.6 }); badge('red', 'AUFGEGEBEN!', W / 2, H * .22, clamp((L.lt - .4) / .2), 1, .9);
  orbit(V(tx, 4, h.z - 6), lerp(14, 12.5, L.k), (h.x < 0 ? .9 : -.9), .2, 44); sh(V(tx, 0, h.z - 5), 18); }, [[0, 'chair_fall', .6], [.35, 'thud', .7], [.5, 'cup_break', .5], [.6, 'crowd_gasp', .4]]);
