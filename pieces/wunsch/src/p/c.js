// ---------- c: duermo en todas partes, Mia, y llega Herr Graufeld (58,3 – 96,9 s) ----------
// Bus (BU): pasillo x = BUX, asientos en x = BUX ± 2,9, z = -15 + k·6 (miran a +z), ventanas a x = ±4,5. Peluquería (SA): sillones en x = SAX + {-10, 0, 10}, z = -4, miran al espejo (-z).
// Panadería (BA): mostrador en z = -2; cola por z > 2. Sótano (KE): catre en (KEX + 6, -2); escalera a la izquierda (x = KEX - 10).
const LEANSLEEP = { headZ: .5, headX: .2, aLz: .05, aRz: .05, aLe: .2, aRe: .2, lean: .05 };
// 40 «Ich schlafe überall in einer Sekunde ein.»: en la plaza, a media frase, me quedo dormido de pie de golpe: cronómetro «1 SEK»
shot(58.34, 'S', null, L => { town(L, 'day'); const c = put(ichT, 0, 0, 40, .2); const k = clamp((L.lt - .7) / .15);
  actuar(c, 0, [[0, { aRx: .8, aRe: 1.2, aRz: .2 }], [.7, { ...LEANSLEEP, crouch: .1, headX: .55 }, { dur: .15 }]], { T: L.T }); if (k < .5) cara(c, L.T, { expr: 'talk', mouth: Math.sin(L.T * 14) > 0 ? 'talk' : 'flat' }); else c.setFace({ eyes: 'closed', mouth: 'o' }); if (k > .5) zzz(c, L.T);
  badge('num', L.lt < .7 ? '0,' + Math.floor(L.lt / .7 * 9) + ' s' : '1 SEK', W / 2, H * .2, 1, 1, 1.1); crowdBox(L, -12, 12, 26, 32, 4, 31, { mode: i => i % 2 ? 'walk' : 'look', dir: PI / 2 });
  onBody(c, 15, .1, .12, 42, L.k, 12, -.1); sh(V(0, 0, 40), 26); },
  [[.1, 'tick', .5], [.4, 'tick', .5], [.7, 'boing_metal', .3], [.75, 'snore', .6]]);
// 41 «Im Bus,»: dormido en el bus con la cabeza contra la ventana; la ciudad pasa fuera; una señora me mira
shot(60.70, 'W', null, L => { use('BU'); inside(1.0, 40); BU.scroll(L.T); const c = sit(ichT, BUX - 2.9, 2.65, -3, 0, L, { ...LEANSLEEP, headZ: .55 }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  sit(EX[5], BUX + 2.9, 2.65, -3, 0, L, { headY: .5 }); cara(EX[5], L.T, { expr: 'confused' }); sit(EX[6], BUX - 2.9, 2.65, -9, 0, L); cara(EX[6], L.T, { expr: 'neutral' });
  cm([BUX + .4, 7, 10, BUX - 2, 5, -3, 46], [BUX - .2, 6.6, 8, BUX - 2.4, 5, -3, 44], L.k); sh(V(BUX, 0, -3), 16); },
  [[.02, 'wheels', .6], [.2, 'snore', .5]]);
// 42 «beim Friseur,»: dormido en el sillón de la peluquería mientras la peluquera me corta un mechón
shot(61.34, 'S', null, L => { use('SA'); inside(1.0, 42); const c = sit(ichT, SAX, 3.0, -4, PI, L, { ...LEANSLEEP, headZ: -.4 }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  const f = put(fris, SAX + 2.6, 0, -1.4, PI + .7); actuar(f, 0, [[0, { aRx: 1.6 + Math.sin(L.T * 14) * .12, aRe: 1.2, aRz: -.3, aLx: 1.2, aLe: 1.4, headX: .25 }]], { T: L.T }); cara(f, L.T, { expr: 'confused' });
  cm([SAX - 3, 7.4, -11.5, SAX, 5.6, -3, 46], [SAX - 1.6, 7, -10.6, SAX, 5.6, -3, 42], L.k); sh(V(SAX, 0, -3), 14); },
  [[.02, 'zip', .4], [.2, 'snore', .4]]);
// 43 «und einmal sogar im Stehen,»: de pie, balanceándome dormido, una burbuja de moco; el plano gira a mi alrededor
shot(61.92, 'R', null, L => { use('BA'); inside(1.0, 40); const c = put(ichT, BAX + 3, 0, 8, PI - .5); actuar(c, 0, [[0, { ...LEANSLEEP, sx: Math.sin(L.T * 2.4) * .08, lean: .1 + Math.sin(L.T * 2.4) * .06 }]], { T: L.T }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T, 1.1);
  orb(L.k, V(BAX + 3, 3.6, 8), null, [14, PI - 1.2, .16, 42], [12, PI - .3, .12, 40]); sh(V(BAX + 3, 0, 8), 16); },
  [[.05, 'snore', .6], [.8, 'snore', .4]]);
// 44 «in der Schlange beim Bäcker.»: la cola de la panadería me adelanta; el panadero grita «NÄCHSTER!» y yo sigo dormido de pie
shot(63.50, 'C', null, L => { use('BA'); inside(1.0, 40); const c = put(ichT, BAX + 3, 0, 8, PI - .5); actuar(c, 0, [[0, LEANSLEEP]], { T: L.T }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  const b = put(baeck, BAX + 2, 0, -6, 0); actuar(b, 0, [[0, { aRx: 1.6, aRe: .2, aRz: -.1, aLx: .3 }]], { T: L.T }); talk(b, L.T, L.t0, L.t1, 'shout'); bubble(b, 'NÄCHSTER!', (L.lt - .1) / .2, 2.4);
  [EX[7], EX[8]].forEach((e, i) => { put(e, BAX + 5 - i * 3 + L.lt * 2, 0, 5 + i * 3 - L.lt * 2, PI - .3); actuar(e, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(e, L.T, { expr: 'smug' }); });
  cm([BAX - 8, 8, 18, BAX + 2, 4, 2, 48], [BAX - 6.4, 7.4, 16, BAX + 2, 4.2, 2, 46], L.k); sh(V(BAX + 2, 0, 2), 22); },
  [[.05, 'shout_m', .3], [.1, 'door_bell', .5], [.4, 'steps', .4], [.7, 'snore', .5]]);
// 45 «Wecker funktionieren bei mir nicht.»: el despertador salta como loco en la mesilla y yo ni me muevo
shot(64.44, 'Z', null, L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; sleepF(c, L.T); zzz(c, L.T);
  KZ.CLOCK.visible = false; const j = Math.sin(L.T * 50) * .15; show(WK[0], KZX - 3.8 + j, 3.4 + Math.abs(j) * 2, -8.3, j * 2, 1.2); clockAt(WK[0], '6:30', '#ff4a3a'); noiseFX(wpos(WK[0]).add(V(0, 1, 0)), L.T, 1, '#ff4a3a');
  cm([KZX - 1, 7, 2, KZX - 5, 4.4, -7, 44], [KZX - 1.4, 6.6, .6, KZX - 5.4, 4.4, -7, 40], L.k); sh(V(KZX - 6, 0, -5), 14); },
  [[.0, 'alarm', .8], [.8, 'snore', .5]]);
// 46 «Mama sagt, ich würde sogar»: Mama en la puerta de la cocina, brazos cruzados, poniendo los ojos en blanco
shot(66.11, 'S', null, L => { room('KU', L); const c = put(mama, KUX - 8, 0, 4, .5); actuar(c, 0, [[0, 'cross']], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'talk', { eyes: L.lt > .5 ? 'up' : 'half' });
  onBody(c, 13, .1, .1, 42, L.k, 10.5, -.1); sh(V(KUX - 8, 0, 4), 16); },
  [[.1, 'sigh', .4]]);
// 47 «ein Silvesterfeuerwerk verschlafen.»: Nochevieja en la plaza: fuegos artificiales y gente brindando; yo dormido en un banco con un gorrito de fiesta
shot(67.27, 'F', null, L => { town(L, 'night', V(16, 0, 4)); bloom.strength = .45; fireworks(V(0, 40, -30), L.T, 4, 30); const c = sit(ichT, 16, 2.0, 4, -PI / 2, L, LEANSLEEP); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  crowdAt(L, 4, 4, 10, 6, 14, 41, { list: EX, mode: i => ['cheer', 'clap', 'cheer', 'point'][i % 4], face: V(0, 40, -30) }); badge('gold', '00:00', W / 2, H * .2, (L.lt - .1) / .2, 1, 1);
  orb(L.k, V(16, 3, 4), null, [16, -PI / 2 - .6, .12, 46], [13, -PI / 2 - .3, .1, 44]); sh(V(14, 0, 4), 24); },
  [[.05, 'firework', .6], [.4, 'firework', .5], [.7, 'cheer', .4], [.9, 'firework', .5], [.3, 'snore', .4]]);
// 48 «Das Einzige, was mich weckt,»: al amanecer en mi cuarto; la puerta se abre despacio con un crujido
shot(68.83, 'I', null, L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; sleepF(c, L.T); KZ.DOOR.rotation.y = -easeInOut(clamp(L.lt / 1.1)) * 1.2;
  cm([KZX - 2, 9, 12, KZX + 9, 5, 0, 46], [KZX - 1, 9, 10, KZX + 11, 5, 1, 44], L.k); sh(V(KZX, 0, 0), 22); },
  [[.1, 'wood_creak', .6], [.6, 'door_open', .4]]);
// 49 «ist meine kleine Schwester Mia.»: Mia (5) asoma por la puerta con una sonrisa traviesa; «MIA, 5»
shot(70.07, 'C', 'punch', L => { room('KZ', L, { dawn: true }); KZ.DOOR.rotation.y = -1.2; const c = put(mia, KZX + 13, 0, 2, -PI / 2 - .3); actuar(c, 0, [[0, { aLx: .6, aLz: -.3, aLe: 1.6, aRx: .6, aRz: -.3, aRe: 1.6, crouch: .1, lean: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grin' });
  badge('tag', 'MIA · 5', W / 2, H * .2, (L.lt - .15) / .2, 1, 1); onBody(c, 12, .1, .1, 40, L.k, 10, -.1, 2.6); sh(V(KZX + 12, 0, 2), 14); },
  [[.02, 'impact', .4], [.2, 'kids_laugh', .4]]);
// 50 «Jeden Morgen um Viertel vor sieben»: primer plano del despertador: 6:44 → 6:45
shot(71.68, 'W', null, L => { room('KZ', L, { dawn: true }); KZ.CLOCK.visible = false; show(WK[0], KZX - 3.6, 3.4, -8.3, .1, 1.3); clockAt(WK[0], L.lt < .7 ? '6:44' : '6:45', L.lt < .7 ? '#ff4a3a' : '#ffd23f');
  cm([KZX - 3.4, 6.2, -3.6, KZX - 3.6, 4.3, -8.3, 30], [KZX - 3.5, 5.6, -4.6, KZX - 3.6, 4.3, -8.3, 26], L.k); sh(V(KZX - 4, 0, -8), 10); },
  [[.1, 'clock_tick', .6], [.7, 'click_metal', .5]]);
// 51 «springt sie auf mein Bett»: Mia salta desde la puerta y aterriza a cuatro patas sobre mi cama; el colchón rebota
shot(73.12, 'R', null, L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; sleepF(c, L.T);
  saltar(mia, L.lt, .05, { h: 6, dur: .55, base: [KZX - 2, 0, 2], dx: -6, dz: -3 }); if (L.lt > .8) { put(mia, KZX - 8, 4.2, -1, 0); actuar(mia, 0, [[0, { crouch: .5, lean: .3, aLx: 1.2, aRx: 1.2 }]], { T: L.T }); } cara(mia, L.T, { expr: 'joy' });
  cm([KZX + 4, 9, 10, KZX - 7, 4.6, -3, 48], [KZX + 2, 8.6, 8, KZX - 7.6, 4.8, -3, 46], L.k); sh(V(KZX - 6, 0, -2), 18); },
  [[.05, 'jump', .6], [.65, 'spring', .6], [.7, 'thud', .5]]);
// 52 «und schreit mir ins Ohr:»: Mia, a cuatro patas, se acerca a mi oreja con la boca muy abierta
shot(74.24, 'S', null, L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; sleepF(c, L.T);
  const m = put(mia, KZX - 6.4, 4.2, -5.8, -PI / 2); actuar(m, 0, [[0, { crouch: .6, lean: .8, aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3, headX: -.2 }]], { T: L.T, weight: false }); m.setFace({ eyes: 'squint', mouth: L.lt > .6 ? 'scream' : 'grin' });
  cm([KZX - 7.6, 7.8, 1, KZX - 8, 4.8, -6.6, 40], [KZX - 7.8, 7.2, -.4, KZX - 8.2, 4.8, -6.8, 36], L.k); sh(V(KZX - 8, 0, -6), 12); },
  [[.1, 'breath', .5], [.6, 'anticip', .5]]);
// 53 «„Aufwachen!“»: primerísimo plano: mis ojos se abren como platos, el pelo se me levanta con la onda del grito
shot(75.51, 'C', 'punch', L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; c.setFace({ eyes: 'wide', mouth: 'grimace_wide' }); noiseFX(hp(c), L.T, 1, '#ffffff');
  const h = hp(c); cam([h.x + .6, h.y + 4.4, h.z + 1.6], [h.x, h.y, h.z - .3], lerp(36, 32, L.k)); sh(V(KZX - 9, 0, -5), 12); },
  [[.0, 'scream_girl', .3], [.02, 'impact', .6], [.1, 'boing_metal', .4]]);
// 54 «Sie ist 5 und kommt nie zu spät.»: Mia de pie en la cama, brazos en jarras, orgullosa; detrás el despertador marca 6:45
shot(76.35, 'I', null, L => { room('KZ', L, { dawn: true }); const c = put(mia, KZX - 9, 4.2, -2, .3); c.blob.visible = false; actuar(c, 0, [[0, { aLx: .3, aLz: -.5, aLe: 1.8, aRx: .3, aRz: -.5, aRe: 1.8, headX: -.15 }]], { T: L.T }); grin(c, L.T);
  const me = riseBed(ich, KZX - 9, -7.4, .9, L, { aLz: .4, aRz: .4, headX: .2 }); cara(me, L.T, { expr: 'tired' }); KZ.quilt.position.y = 4.6;
  KZ.CLOCK.visible = false; show(WK[0], KZX - 3.6, 3.4, -8.3, -.3, 1.2); clockAt(WK[0], '6:45', '#ffd23f'); badge('gold', '5', W * .5, H * .2, (L.lt - .1) / .2, 1, 1.3);
  onBody(c, 13, .4, .14, 42, L.k, 11, .2, 2.4); sh(V(KZX - 9, 0, -4), 16); },
  [[.1, 'kids_laugh', .4], [.6, 'yawn_big', .4]]);
// 55 «Dann, eines Tages,»: la Lindenstraße de día; una tienda gris con el escaparate tapado con papel; la cámara avanza por la calle
shot(78.41, 'W', null, L => { town(L, 'day'); crowdBox(L, -10, 10, 140, 200, 6, 51, { mode: 'walk', dir: 0, jit: .2 }); cm([-4, 7, 230, 21, 6, 168, 50], [-2, 6.6, 214, 21, 6, 168, 46], L.k); sh(V(16, 0, 180), 50); },
  [[.1, 'city_amb', .5], [.4, 'steps', .3], [.9, 'creepy_ting', .4]]);
// 56 «eröffnete Herr Graufeld einen Laden»: Herr Graufeld (chistera gris, bigote fino) da la vuelta al cartel «GEÖFFNET» y sonríe de lado
shot(79.75, 'S', null, L => { town(L, 'day'); const c = put(grau, 18.4, 0, 170, -PI / 2 - .4); actuar(c, 0, [[0, { aRx: 1.4, aRe: .6, aRz: -.2, aLx: .2 }], [.5, { aRx: 1.0, aRe: 1.4, aRz: .2, aLx: .2, headY: .3 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  badge('tag', 'GEÖFFNET', W / 2, H * .22, (L.lt - .4) / .2, 1, 1); onBody(c, 15, .3, .12, 42, L.k, 12, .1); sh(V(19, 0, 170), 22); },
  [[.1, 'door_bell', .6], [.45, 'click_metal', .4], [.7, 'evil_laugh', .3]]);
// 57 «für Ohrstöpsel»: primer plano del escaparate lleno de tapones de colores; «100 € DAS STÜCK»
shot(81.15, 'Z', null, L => { town(L, 'day'); cm([14.6, 4.2, 173.6, 21.1, 3.4, 171.8, 42], [16.6, 3.8, 172.4, 21.1, 3.4, 171.8, 38], L.k); sh(V(20, 0, 172), 14); },
  [[.1, 'pop', .4], [.3, 'pop', .3], [.5, 'pop', .3]]);
// 58 «in der Lindenstraße.»: el letrero azul de la calle; panorámica hacia arriba
shot(82.55, 'I', null, L => { town(L, 'day'); cm([12, 7, 166, 20.3, 9.6, 162, 44], [13, 9.4, 164.6, 20.3, 9.7, 162, 40], L.k); sh(V(20, 0, 164), 14); },
  [[.05, 'whoosh_up', .4], [.3, 'birds', .4]]);
// 59 «Herr Graufeld war der Einzige in der Stadt,»: al atardecer, todos vuelven a casa bostezando; Graufeld, en medio de la plaza, es el único que va en dirección contraria
shot(83.41, 'R', null, L => { town(L, 'dusk'); const c = put(grau, 0, 0, 30 - L.lt * 2.6, PI); actuar(c, 0, [[0, walkP(L.T * .7, 0)]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  crowdBox(L, -16, 16, 14, 50, 10, 61, { mode: 'walk', ry: 0, jit: .1, speed: 2.4, list: EX }); orb(L.k, V(0, 3.6, 26), null, [24, PI + .4, .16, 46], [20, PI + .15, .14, 44]); sh(V(0, 0, 26), 30); },
  [[.1, 'steps', .5], [.6, 'yawn_big', .3]]);
// 60 «der bereit war, um Mitternacht aufzuwachen.»: noche cerrada; el reloj de la torre marca las 12; Graufeld lo mira desde abajo, de espaldas a cámara con media cara iluminada
shot(85.20, 'F', 'slow', L => { town(L, 'night', V(0, 0, -60)); TURM.setClock(0, 0, .6); const c = put(grau, 4, 0, -62, PI + .5); actuar(c, 0, [[0, { headX: -.5, aLx: .1, aRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  cm([12, 3, -46, 0, 40, -86, 46], [10, 4, -50, 0, 44, -86, 40], L.k); sh(V(2, 0, -70), 40); },
  [[.1, 'owl', .4], [.4, 'bell_far', .6]]);
// 61 «Also ging er um 20 Uhr»: Graufeld baja la escalera del sótano con una vela; el reloj de bolsillo marca 20:00
shot(87.57, 'S', null, L => { use('KE'); inside(.35, 12); FILL.color.setRGB(1, .7, .4); lp(0, KEX - 8, 8, 2, 40, 0xffa040, 26); const t = clamp(L.lt / 1.6); const c = put(grau, KEX - 10, lerp(10, 2, t), lerp(-3, 6, t), PI); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), aRx: 1.2, aRe: 1.4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  badge('num', '20:00', W / 2, H * .2, (L.lt - .1) / .2, 1, 1.1); cm([KEX + 2, 9, 14, KEX - 9, 7, 2, 48], [KEX + 1, 7, 13, KEX - 9, 5, 3, 46], L.k); sh(V(KEX - 6, 0, 2), 16); },
  [[.1, 'wood_creak', .5], [.5, 'steps', .5], [1.0, 'wood_creak', .4]]);
// 62 «in seinem stockdunklen Keller schlafen»: el sótano casi a oscuras: Graufeld en un catre, con la chistera sobre el pecho, sonriendo dormido
shot(89.17, 'I', null, L => { use('KE'); inside(.22, 6); FILL.color.setRGB(.6, .7, 1); lp(0, KEX + 6, 6, 2, 16, 0x6a8aff, 18); const c = put(grau, KEX + 6, 3.3, 1.2, .3); c.root.rotation.x = -PI / 2; c.blob.visible = false; actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.4, aRz: -.4, aLe: 1.4, aRe: 1.4 }]], { T: L.T, weight: false }); c.setFace({ eyes: 'closed', mouth: 'smirk' }); zzz(c, L.T, .8);
  cm([KEX + 13, 10, 9, KEX + 5.4, 3.4, -1, 44], [KEX + 11, 9, 7, KEX + 5.6, 3.6, -1.2, 40], L.k); sh(V(KEX + 6, 0, -1), 14); },
  [[.05, 'drip', .5], [.4, 'snore', .4]]);
// 63 «und stellte seinen Wecker auf»: su mano gira la ruedecita del despertador
shot(91.05, 'W', null, L => { use('KE'); inside(.25, 8); lp(0, KEX + 2, 6, 2, 20, 0x6a8aff, 18); show(WK[0], KEX + 2, 2.8, 3, -.4, 1.3); clockAt(WK[0], ['23:00', '22:00', '0:00'][Math.min(2, Math.floor(L.lt / .5))], '#ff4a3a');
  cm([KEX + 4.2, 5.6, 6.6, KEX + 2, 3.6, 3, 36], [KEX + 3.8, 5.2, 6, KEX + 2, 3.6, 3, 32], L.k); sh(V(KEX + 2, 0, 3), 10); },
  [[.05, 'ratchet', .6], [.5, 'ratchet', .5], [1.0, 'click_metal', .5]]);
// 64 «0 Uhr.»: el número 0:00 brilla en rojo
shot(92.67, 'C', 'punch', L => { use('KE'); inside(.25, 8); lp(0, KEX + 2, 6, 2, 20, 0xff4a3a, 18); show(WK[0], KEX + 2, 2.8, 3, -.4, 1.3); clockAt(WK[0], '0:00', '#ff4a3a'); badge('red', '0:00', W / 2, H * .22, (L.lt - .05) / .2, 1, 1.3);
  cm([KEX + 3.4, 4.6, 5.4, KEX + 2, 3.6, 3, 30], [KEX + 3.2, 4.4, 5, KEX + 2, 3.6, 3, 28], L.k); sh(V(KEX + 2, 0, 3), 10); },
  [[.02, 'impact', .5], [.1, 'heartbeat', .5]]);
// 65 «Drei Klingeltöne,»: medianoche: el despertador salta tres veces; «1», «2», «3»
shot(93.55, 'Z', null, L => { use('KE'); inside(.3, 10); lp(0, KEX + 2, 6, 2, 26, 0xff6a4a, 18); const n = Math.min(3, Math.floor(L.lt / .28) + 1), j = Math.sin(L.T * 50) * .15 * (L.lt % .28 < .18 ? 1 : 0);
  show(WK[0], KEX + 2 + j, 2.8 + Math.abs(j) * 2, 3, -.4 + j, 1.3); clockAt(WK[0], '0:00', '#ff4a3a'); noiseFX(wpos(WK[0]).add(V(0, 1, 0)), L.T, L.lt % .28 < .18 ? 1 : 0, '#ff4a3a');
  badge('num', String(n), W / 2, H * .22, 1, 1, 1.4); cm([KEX + 5, 6, 8, KEX + 2, 3.6, 3, 40], [KEX + 4.4, 5.6, 7, KEX + 2, 3.6, 3, 36], L.k); sh(V(KEX + 2, 0, 3), 10); },
  [[.0, 'alarm_soft', .7], [.28, 'alarm_soft', .7], [.56, 'alarm_soft', .7]]);
// 66 «und er war wach.»: Graufeld abre los ojos de golpe y se incorpora en el catre con una sonrisa malvada
shot(94.39, 'C', 'punch', L => { use('KE'); inside(.3, 10); lp(0, KEX + 6, 6, 4, 22, 0x8a6aff, 18); const up = easeOut(clamp(L.lt / .25)); const c = put(grau, KEX + 6, lerp(3.3, sitY(grau, 2.6), up), lerp(1.2, -1.5, up), .3); c.root.rotation.x = -PI / 2 + up * PI / 2; c.blob.visible = false;
  actuar(c, 0, [[0, { lLx: 1.5 * up, lRx: 1.5 * up, aLx: .6, aRx: .6 }]], { T: L.T, weight: false }); cara(c, L.T, { eyes: 'wide', mouth: 'smirk' });
  onFace(c, 5, .4, .3, 40, L.k, 4.2); sh(V(KEX + 6, 0, -1), 12); },
  [[.0, 'cloth', .6], [.1, 'evil_laugh', .4]]);
// 67 «Oma hatte keine Chance.»: 4:00 en casa de Oma: se sienta de golpe… y ve que ya es tarde: brazos caídos, cara de pena
shot(95.49, 'W', null, L => { room('OZ', L, { night: true }); OZ.quilt.position.y = 4.55; riseBed(oma, OZX + 3.4, -6.6, 1, L, { aLz: .1, aRz: .1, headX: .3 }); cara(oma, L.T, { expr: 'sad' });
  show(WK[0], OZX + 10, 3.4, -8.2, -.4, 1); clockAt(WK[0], '4:00', '#ff4a3a'); badge('red', 'ZU SPÄT', W / 2, H * .2, (L.lt - .2) / .2, 1, 1);
  cm([OZX + 8, 9, 6, OZX + 3.4, 5.6, -5.4, 44], [OZX + 7, 8.6, 4.6, OZX + 3.4, 5.6, -5.4, 40], L.k); sh(V(OZX + 4, 0, -5), 14); },
  [[.1, 'sad_tone', .5], [.5, 'sigh', .4]]);
