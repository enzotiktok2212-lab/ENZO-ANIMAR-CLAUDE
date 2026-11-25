// ---------- e: el gran día, la Eilmeldung, el sueño como dinero y Oma (153,6 – 194,5 s) ----------
// 105 «Ich war schneller als die Straßenbahn»: corro por la plaza tan rápido que adelanto al tranvía: líneas de velocidad, hojas que vuelan, la gente se despeina
shot(153.57, 'W', null, L => { town(L, { morning: 1, tram: 30 - L.lt * 10 }); const z = 40 - L.lt * 34; const c = put(ich, -20, 0, z, PI); actuar(c, 0, [[0, runP(L.T * 1.8, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 24)) * .4; cara(c, L.T, { expr: 'determined', eyes: 'wide', mouth: 'open_smile' });
  speedLines(1, Math.floor(L.T * 15)); leaves(V(-20, 0, z), L.T * 4, 40, 14, 30, 10); dust(V(-20, 0, z + 3), L.t0, L.T, 14, 1.2); crowdAt(L, -8, z - 6, 6, 4, 10, 60, { mode: 'shock', gap: 1.2 });
  cm([-6, 6, z - 18, -20, 4.4, z, 46], [-6, 6, z - 16, -20, 4.4, z, 44], L.k); sh(V(-20, 0, z), 30); }, [[0, 'zoom_whoosh', .7], [.2, 'tram_bell', .5], [.8, 'whoosh', .5]]);
// 106 «und kaufte mir eine Villa,»: delante de la villa: le pongo el cartel «VERKAUFT» de un golpe; confeti
shot(155.41, 'F', null, L => { villaS(L); const c = put(ich, VIX + 4, 0, -12, -.4); actuar(c, L.lt, [[0, {}], [.15, { aRx: 2.6, aRz: .2, aRe: .3 }, { dur: .2 }], [.5, { aRx: 1.4, aRe: .6 }, { dur: .2 }]], { T: L.T }); laughF(c, L.T);
  DS3.userData.draw('verkauft', (cc, w, h) => { cc.fillStyle = '#c8202a'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#ffffff'; cc.font = `700 110px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('VERKAUFT!', w / 2, h / 2 + 6); }); show(DS3, VIX, 4 + (1 - clamp(L.lt / .3)) * 6, -14, 0, .8);
  confetti(V(VIX, 4, -12), L.t0 + .2, L.T, 50, 1); orbit(V(VIX + 2, 6, -14), lerp(26, 22, L.k), .2, .12, 46); sh(V(VIX, 0, -16), 30); }, [[0, 'stamp', .7], [.2, 'cha_ching', .5]]);
// 107 «drei Sportwagen»: los tres deportivos amarillos en fila, cada uno con un lazo rojo; yo en el del medio
shot(156.41, 'C', 'punch', L => { villaS(L); const c = put(ich, VIX, 1.2, -6.4 + 1, PI); c.blob.visible = false; actuar(c, 0, [[0, sitPose({ aLx: 2.6, aLz: .4, aRx: 1.1, aRe: .8 })]], { T: L.T, weight: false }); laughF(c, L.T);
  badge('num', '3 SPORTWAGEN', W / 2, H * .2, clamp(L.lt / .2), 1, 1); orbit(V(VIX, 3, -6), lerp(24, 21, L.k), .35, .2, 46); sh(V(VIX, 0, -6), 26); }, [[0, 'engine_rev', .7], [.4, 'horn_toot', .4]]);
// 108 «und gleich die ganze Tchibo-Filiale.»: dentro de la tienda Tchibo, con la pancarta «VERKAUFT», lanzo paquetes al aire; la cajera aplaude
shot(157.57, 'W', null, L => { tchiboS(L); const c = put(ich, TLX, 0, -2, 0); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .4, aRz: .4, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T); const k = put(CR[22], TLX + 10, 0, -6.4, -.6); actuar(k, 0, [[0, 'cheer']], { T: L.T }); laughF(k, L.T);
  PACKS.TCHIBO.forEach((p, i) => { const t = (L.lt * 1.2 + i * .25) % 1; show(p, TLX - 3 + i * 2, 4 + Math.sin(t * PI) * 7, -2 + (i % 2), t * 6 + i, 1); });
  DS3.userData.draw('verkauft2', (cc, w, h) => { cc.fillStyle = '#c8202a'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#ffffff'; cc.font = `700 90px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('VERKAUFT AN NOAH', w / 2, h / 2 + 6); }); show(DS3, TLX, 12, -14.2, 0, 1);
  orbit(V(TLX, 6, -4), lerp(22, 19, L.k), 0, .14, 46); sh(V(TLX, 0, -4), 24); }, [[0, 'register', .6], [.3, 'crowd_cheer', .4], [1.2, 'cha_ching', .5]]);
// 109 «Doch am nächsten Morgen»: amanecer; en la cocina de Oma la tele se enciende sola con el ruido de interferencias
shot(159.91, 'B', null, L => { kuecheS(L); OK.TV.draw((c, w, h) => { if (L.lt < .4) { const r = RNG(Math.floor(L.T * 30)); for (let i = 0; i < 400; i++) { const v = r() * 255 | 0; c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(r() * w, r() * h, 8, 4); } } else drawNews(c, w, h, L.lt, 0); });
  const c = sit2(ich, OKX + 6, -5, PI / 2, 2.6); actuar(c, 0, [[0, sitPose({ aRx: .9, aRe: 1.2, headX: .2 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'tired', mouth: 'yawn' });
  orbit(V(OKX + 10, 5, -5), lerp(16, 14, L.k), -.9, .12, 44); sh(V(OKX + 10, 0, -5), 16); }, [[0, 'rooster', .5], [.3, 'tv_static', .5], [.5, 'news_jingle', .6]]);
// 110 «kam im Fernsehen eine Eilmeldung:»: plató de RTV 24: la presentadora con cara seria; detrás «EILMELDUNG» en rojo
shot(160.78, 'C', 'punch', L => { studioS(L); ST.SCR.draw((c, w, h) => drawNews(c, w, h, L.lt, 0)); const s = put(sprech, STX, 0, -5, 0); talk(s, L.T, L.t0, L.t1, 'worried'); actuar(s, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.4, aRe: 1.4 }]], { T: L.T });
  orbit(V(STX, 6, -5), lerp(17, 15, L.k), 0, .06, 44); sh(V(STX, 0, -4), 18); }, [[0, 'news_jingle', .5], [.2, 'impact', .5]]);
// 111 «Wegen mir brach im ganzen Land die Wirtschaft zusammen.»: en la pantalla la gráfica se desploma; en la bolsa (ministerio) los funcionarios se llevan las manos a la cabeza
shot(162.51, 'S', 'punch', L => { minS(L); const k = clamp(L.lt / 1.2); MI.scr.userData.draw((c, w, h) => drawNews(c, w, h, L.lt, 0));
  [CR[24], CR[25], CR[26], REN[2]].forEach((x, i) => { put(x, MIX - 6 + i * 4, 0, -2 + (i % 2) * 2, 0); actuar(x, 0, [[0, i % 2 ? 'hands_head' : 'shock']], { T: L.T + i }); cara(x, L.T, { expr: 'shock', mouth: 'scream' }); });
  billRain(V(MIX, 0, -2), L.T, 40, 22, 10, 16); badge('red', 'CRASH!', W / 2, H * .2, clamp((L.lt - .3) / .2), 1, 1.3); SHAKE = .5 * (1 - k);
  CAMK = 1; orbit(V(MIX, 6, -2), lerp(24, 20, L.k), 0, .14, 46); sh(V(MIX, 0, -2), 24); }, [[0, 'alarm', .6], [.4, 'crash_down', .6], [1.2, 'crowd_gasp', .5]]);
// 112 «Ein Brötchen kostete plötzlich eine Million.»: en la panadería, el panadero pone la etiqueta «1.000.000 €» a un Brötchen; el cliente se desmaya
shot(165.15, 'W', null, L => { town(L, { morning: 1 }); const h = HSN('BÄCKEREI') || RT.HS[2]; const bx = h.x * .86, bz = h.z; const b = put(baecker, bx, 0, bz, h.x < 0 ? PI / 2 : -PI / 2); actuar(b, 0, [[0, { aRx: 1.4, aRe: .6, aLx: 1.0, aLe: 1.0 }]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'smirk' });
  show(BROT, bx + (h.x < 0 ? 3 : -3), 3.4, bz, h.x < 0 ? PI / 2 : -PI / 2, 1.2); const c = put(CR[27], bx + (h.x < 0 ? 7 : -7), 0, bz + 1, h.x < 0 ? -PI / 2 : PI / 2); const k = clamp((L.lt - 1.0) / .4);
  c.root.rotation.order = 'YXZ'; c.root.rotation.x = -k * 1.5; c.root.position.y = .5 * k; actuar(c, 0, [[0, k > 0 ? { aLx: 2.2, aRx: 2.2, aLz: .8, aRz: .8 } : 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: k > .5 ? 'closed' : 'wide', mouth: 'scream' });
  orbit(V(bx + (h.x < 0 ? 3.5 : -3.5), 4.6, bz), lerp(16, 14, L.k), (h.x < 0 ? PI / 2 : -PI / 2) + .2, .12, 44); sh(V(bx, 0, bz), 18); }, [[0, 'bell_shop', .5], [.4, 'stamp', .5], [1.1, 'thud', .6]]);
// 113 «Die Regierung beschloss über Nacht:»: el ministerio de noche: los ministros votan levantando la mano
shot(167.48, 'C', null, L => { minS(L); TINT = 'rgba(10,16,60,.25)'; MI.scr.userData.draw((c, w, h) => drawNews(c, w, h, L.lt, 1)); [CR[24], CR[25], CR[26], CR[28], CR[29]].forEach((x, i) => { put(x, MIX - 8 + i * 4, 0, -6, 0); actuar(x, L.lt, [[0, {}], [.2 + i * .08, { aRx: 2.9, aRz: .1, aRe: .1 }, { dur: .3 }]], { T: L.T }); cara(x, L.T, { expr: 'determined' }); });
  orbit(V(MIX, 6, -6), lerp(22, 19, L.k), 0, .12, 46); sh(V(MIX, 0, -6), 24); }, [[0, 'gavel', .6], [.4, 'murmur', .4]]);
// 114 «Kaffeegeld zählt nicht mehr.»: en la plaza, los relojes de todos se ponen a 0 €; un señor tira su taza al suelo, enfadado
shot(168.76, 'W', 'punch', L => { town(L, { morning: 1 }); const c = put(CR[0], 0, 0, 12, 0); const k = clamp((L.lt - .5) / .3); actuar(c, 0, [[0, k > 0 ? { aRx: 2.4 - k * 2, aRe: .2, aLx: .4 } : { aRx: .9, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'shout' }); meterOf(c).userData.set('0 €', 'UNGÜLTIG', '#ff4a4a');
  const cu = CUPS[14]; if (k < 1) { attach(cu, c.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); } else { show(cu, .6, Math.max(.4, 3 - (L.lt - .8) * 12), 13.2, L.T * 6, 1); } crowdAt(L, 0, 6, 8, 6, 12, 64, { mode: i => ['shock', 'point'][i % 2], gap: 1.2 });
  badge('red', 'X  KAFFEEGELD', W / 2, H * .2, clamp(L.lt / .2), 1, 1); dcam(c, L.k, 11, -.6, 5, 42); sh(V(0, 0, 12), 18); }, [[0, 'error_buzz', .6], [.9, 'cup_break', .6]]);
// 115 «Das neue Geld?»: la presentadora levanta una ceja; la pantalla se pone azul noche
shot(170.50, 'C', null, L => { studioS(L); ST.SCR.draw((c, w, h) => drawNews(c, w, h, L.lt, 1)); const s = put(sprech, STX, 0, -5, 0); talk(s, L.T, L.t0, L.t1, 'smug'); actuar(s, 0, [[0, { aRx: 1.6, aRe: 1.2, aLx: .9, aLe: 1.4 }]], { T: L.T });
  CAMK = 1; onFace(s, 7, 1.4, -.4, 40, L.k); sh(V(STX, 0, -4), 14); }, [[0, 'whoosh_soft', .4], [.3, 'question', .4]]);
// 116 «Schlaf.» (zoom lento): la pantalla gigante: SCHLAF, con nubes y estrellas
shot(171.51, 'F', 'slow', L => { studioS(L); ST.SCR.draw((c, w, h) => drawNews(c, w, h, L.lt, 1)); cm([STX, 10, 14, STX, 10, -14.7, 44], [STX, 10, 6, STX, 10, -14.7, 40], L.k); sh(V(STX, 0, -8), 20); DOF = 0; }, [[0, 'lullaby', .6]]);
// 117 «Jede Stunde Schlaf: hundert Euro.»: una vecina duerme a pierna suelta y por cada «Z» le cae un billete de 100 en la cama
shot(172.12, 'S', null, L => { zimmerS(L, { night: 1 }); const c = put(CR[1], ZIX - 7, 3.5, -2.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .12, 0, 0); c.blob.visible = false; CAMK = 1; actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'smile' }); zzz(c, L.T, 1);
  billFall(V(ZIX - 7, 2, -3), L.t0, L.T, 24, 5, 6, 10); cashPop(c, '+100 €', clamp((L.lt - .8) / .2), 'green', 1); orbit(V(ZIX - 7, 4, -5), lerp(13, 11.5, L.k), .5, .4, 42); sh(V(ZIX - 6, 0, -3), 14); }, [[0, 'snore', .5], [.6, 'cash_reg', .5], [1.2, 'cash_reg', .5]]);
// 118 «Mein Problem?»: yo, de vuelta en la cocina, con la taza en la mano y cara de «oh, no»
shot(174.06, 'C', 'punch', L => { kuecheS(L); const c = put(ich, TB.x, 0, -1, 0); actuar(c, 0, [[0, { aRx: .9, aRe: 1.2, headX: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide', mouth: 'grimace' }); sweat(c, L.T, 2);
  onFace(c, 5.6, .4, .4, 38, L.k); sh(V(TB.x, 0, -1), 12); }, [[0, 'gulp_nervous', .5]]);
// 119 «Seit dieser Dose habe ich keine Minute mehr geschlafen.»: de noche en mi cama: ojos como platos, ojeras, el reloj pasa de 1:00 a 4:00; mi reloj de muñeca: 0 €
shot(174.98, 'B', null, L => { zimmerS(L, { night: 1 }); const c = put(ich, ZIX - 7, 3.5, -2.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .12, 0, 0); c.blob.visible = false; CAMK = 1; actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'wide', mouth: 'wavy' });
  const hr = 1 + Math.floor(clamp(L.lt / 2.3) * 4); DS1.userData.draw('h' + hr, (cc, w, h) => { cc.fillStyle = '#0a0a10'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#ff3a3a'; cc.font = `700 200px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText(hr + ':00', w / 2, h / 2 + 10); }); show(DS1, ZIX - 1, 4.2, -7.5, 0, .32);
  badge('red', '0 MIN. SCHLAF', W / 2, H * .2, clamp((L.lt - .4) / .2), 1, 1); const h0 = hp(c); cm([ZIX - 1, 12, 3, h0.x, h0.y, h0.z + 1.5, 44], [ZIX - 2, 11, 1.5, h0.x, h0.y, h0.z + 1.5, 42], L.k); sh(V(ZIX - 6, 0, -3), 14); DOF = 0; }, [[0, 'clock_tick', .6], [.6, 'clock_tick', .6], [1.2, 'clock_tick', .6], [1.8, 'owl', .4]]);
// 120 «Der Pfarrer auch nicht.»: el cura, de noche en la iglesia, cuenta ovejas en un libro… con los ojos abiertos
shot(177.33, 'W', null, L => { kircheS(L, { night: 1 }); const p = sit2(pfarrer, KIX + 6, 2, PI, 2.5); actuar(p, 0, [[0, sitPose({ aRx: 1.2, aRe: 1.3, aLx: 1.2, aLe: 1.3 })]], { T: L.T, weight: false }); cara(p, L.T, { eyes: 'wide', mouth: 'flat' }); think(p, '1001 Schafe…', clamp(L.lt / .2), -1);
  onBody(p, 10, 0, .1, 42, L.k, 9, 0, 3.4); sh(V(KIX + 6, 0, 2), 14); }, [[0, 'sheep', .4], [.6, 'clock_tick', .4]]);
// 121 «Wir zwei sind jetzt die Ärmsten der Stadt.»: el cura y yo, de noche, sentados en un banco de la plaza con las carteras vacías y una taza de agua; hojas que caen
shot(178.61, 'B', null, L => { town(L, { night: 1 }); const c = sit2(ich, -16.6, -19, PI / 2, 2.4), p = sit2(pfarrer, -16.6, -21.6, PI / 2, 2.4); [c, p].forEach((x, i) => { actuar(x, 0, [[0, sitPose({ aRx: .8, aRe: 1.4, aLx: .5, aLe: 1.1, headX: .25 })]], { T: L.T, weight: false }); cara(x, L.T + i, { eyes: 'wide', mouth: 'frown' }); });
  show(WALLET, -15, 2.5, -20.3, PI / 2, .8); show(MOTH, -15 + Math.sin(L.T * 3), 4 + L.lt, -20.3, 0, .8); leaves(V(-16, 0, -20), L.T, 20, 12, 10, 12); badge('red', '0 €', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1.1);
  orbit(V(-16.6, 4.4, -20.3), lerp(14, 12, L.k), PI / 2 - .3, .14, 44); sh(V(-16, 0, -20), 16); }, [[0, 'wind', .5], [.5, 'sigh', .5], [1.2, 'owl', .3]]);
// 122 «Und die reichste Frau der Welt?»: la plaza de día: un globo terráqueo con una corona encima sobre la fuente; la gente mira hacia arriba
shot(180.50, 'Z', null, L => { town(L, { morning: 1 }); const cr = CROWNS[0]; show(cr, 0, 22 + Math.sin(L.T * 2) * .4, -8, L.T, 4); confRain(V(0, 8, -8), L.T, 30, 20, 10, 20); crowdAt(L, 0, 4, 10, 6, 12, 66, { mode: 'point', face: V(0, 20, -8), gap: 1.0 });
  cm([0, 6, 30, 0, 15, -8, 48], [0, 8, 24, 0, 17, -8, 46], L.k); sh(V(0, 0, 0), 30); }, [[0, 'whoosh_up', .5], [.3, 'choir', .4]]);
// 123 «Meine Oma.»: la corona aterriza en la cabeza de Oma, dormida en su sillón con una sonrisa; lluvia de billetes de 100 sobre ella
shot(181.90, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .3, headZ: .2, aLx: .3, aRx: .3 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: 'smile' }); zzz(o, L.T, 1);
  const h = hp(o); const k = easeIn(clamp(L.lt / .3)); show(CROWNS[0], h.x, h.y + 1.25 + (1 - k) * 6, h.z, 0, .95); billFall(V(OKX + 6, 2, -5), L.t0, L.T, 50, 8, 6, 12); badge('gold', 'OMA', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, 1.3);
  CAMK = 1; orbit(V(OKX + 6, 5, -5), lerp(10, 9, L.k), PI / 2 - .8, .14, 42); sh(V(OKX + 6, 0, -5), 14); }, [[0, 'ding_big', .6], [.1, 'money_rain', .6]]);
// 124 «Acht Tassen am Tag,»: Oma de día, en la mesa, sirviéndose otra taza de su Kanne de flores con cara de felicidad
shot(182.46, 'W', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); drink(o, L, L.t0 + .6, .5, { sit: true, pose: SITP, meter: true, expr: 'happy' }); meterOf(o).userData.set('8 Tassen', 'SCHLAF: 9 Std.', '#9ad8ff'); show(OKAN, TB.x - 1.2, 4.3, -1, .4, 1); OKAN.userData.steam(L.T, 1);
  for (let i = 0; i < 7; i++) { const t = CUPS[i]; show(t, TB.x - 5 + i * 1.55, 4.3, -1.6 + (i % 2) * .7, i, .8); t.userData.level(0); } badge('num', '8 TASSEN', W / 2, H * .2, clamp(L.lt / .2), 1, 1);
  orbit(V(TB.x - 2, 5, -3.4), lerp(14, 12.5, L.k), .25, .18, 44); sh(V(TB.x - 2, 0, -3), 14); }, [[0, 'pour', .5], [.6, 'sip', .5]]);
// 125 «und um neun schläft sie wie ein Baby.»: Oma duerme en su sillón con su gorrito de dormir, abrazada a un cojín; su reloj sube: +100 € por hora
shot(184.21, 'B', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .35, headZ: .25, aLx: 1.0, aRx: 1.0, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: Math.sin(L.T * 2.4) > 0 ? 'o' : 'smile' }); zzz(o, L.T, 1);
  const m = meterOf(o); m.userData.set('SCHLAF', '+' + (100 * (1 + Math.floor(L.lt * 3))) + ' €', '#9ad8ff'); cashPop(o, '+100 €', clamp((L.lt - .3) / .2), 'green', .9); billFall(V(OKX + 6, 2, -5), L.t0 + .3, L.T, 20, 6, 4, 10);
  CAMK = 1; orbit(V(OKX + 6, 5, -5), lerp(10, 9, L.k), PI / 2 - .6, .14, 42); sh(V(OKX + 6, 0, -5), 14); }, [[0, 'snore', .6], [.8, 'cash_reg', .4], [1.4, 'snore', .6]]);
// 126 «Und weißt du noch, wer mich an dem Abend in den Keller geschickt hat?» (zoom lento): flashback en sepia: Oma señalando la puerta del sótano con la cesta
shot(186.25, 'F', 'slow', L => { kuecheS(L, { night: 1 }); grade.uniforms.sepia.value = .8; const o = put(oma, TB.x + 6, 0, 2, PI / 2 + .3); actuar(o, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: .1, aLx: 1.0, aLe: 1.0 }]], { T: L.T }); cara(o, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  show(BUCKET, TB.x + 7.2, 3.2, 3.6, 0, 1); onFace(o, 7, .4, -.6, 40, L.k, 5); sh(V(TB.x + 6, 0, 2), 14); }, [[0, 'old_film', .4], [.4, 'riser_soft', .4]]);
// 127 «Oma lächelt nur.»: primer plano de Oma, sonrisa pícara y guiño; un brillo en las gafas
shot(188.88, 'C', 'punch', L => { kuecheS(L); const o = omaSeat(oma, L, -3); actuar(o, 0, [[0, sitPose({ aRx: .9, aRe: 1.2 })]], { T: L.T, weight: false }); cara(o, L.T, { expr: 'smug', eyes: L.lt > .5 && L.lt < .9 ? 'wink' : 'squint', mouth: 'smirk' });
  const h = hp(o); show(HALO, h.x + .3, h.y + .8, h.z + .75, 0, .2); onFace(o, 5, .5, -.2, 38, L.k); sh(V(TB.x - 3, 0, -4), 12); }, [[0, 'ding', .5], [.5, 'wink', .5]]);
// 128 «Und gestern Abend hat sie mich schon wieder runtergeschickt.»: de noche, Oma me tiende la cesta otra vez y señala la puerta del sótano; yo la miro con terror
shot(190.25, 'W', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, TB.x + 6, 0, 2, PI / 2 + .3); actuar(o, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: .1, aLx: 1.2, aLe: .6 }]], { T: L.T }); talk(o, L.T, L.t0, L.t0 + 2, 'smug');
  const c = put(ich, TB.x + 11, 0, 4, -PI / 2 - .4); actuar(c, 0, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace_wide' }); sweat(c, L.T, 3); show(BUCKET, TB.x + 8.6, 3.2, 3.4, 0, 1);
  orbit(V(TB.x + 8.5, 5, 3), lerp(15, 13, L.k), -.25, .12, 44); sh(V(TB.x + 8, 0, 3), 16); }, [[0, 'door_creak', .5], [.4, 'gulp_nervous', .5]]);
// 129 «Kartoffeln holen.»: final: desde el fondo del sótano oscuro, la lata brilla y su tapa se abre sola; yo bajo despacio la escalera
shot(192.78, 'B', 'slow', L => { kellerS(L); KE.BL.intensity = 20; const D = KE.D; D.userData.open(clamp(L.lt / 1.2) * .6); D.userData.glow(.8); D.userData.steam(L.T, 1);
  const c = put(ich, KEX - 10, lerp(9.8, 8.4, clamp(L.lt / 1.6)), lerp(-4, -2.4, clamp(L.lt / 1.6)), 0); c.blob.visible = false; actuar(c, 0, [[0, { ...walkP(L.T * .5, 1), aRx: .8, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide' });
  CAMK = 1; cm([KEX - 11, 7, 14, KEX - 10, 8.6, -2, 46], [KEX - 11, 7.6, 11, KEX - 9.6, 8.6, -2.4, 44], L.k); sh(V(KEX - 4, 0, -4), 16); }, [[0, 'stairs_creak', .6], [.6, 'magic_shimmer', .5], [1.2, 'tin_open', .5]]);
