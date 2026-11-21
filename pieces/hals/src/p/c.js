// ---------- c: Lina y la fiesta en el sótano, el bloqueo de pantallas y los días (58,29 – 98,13 s) ----------
// Quiosco de Lina (0, 58) mirando a -z; mostrador en z ≈ 55,6. Lina detrás (0, 59.6). Yo delante, al norte.
const linaK = (L, expr = 'happy', pose = 'idle') => { EIS.visible = true; const l = put(lina, 0, 0, 59.4, PI); actuar(l, L.lt, [[0, pose]], { T: L.T }); cara(l, L.T, { expr }); return l; };
const meK = (L, z = 41, bend = 0, expr = 'smile', L_ = NI) => { const c = put(ich, 0, 0, z, 0); hals(c, L_, { T: L.T, sway: .02, bend }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr }); return c; };
const calPop = (L, n, sub, p, col) => { CAL.userData.draw(n, sub, col); show(CAL, p.x, p.y, p.z, 0, spring(clamp(L.lt * 3.2))); CAL.lookAt(camera.position); };
// 46 «Bis zu dem Tag, der alles verändert hat» (zoom lento): el quiosco de helados de Lina; yo me acerco
shot(58.29, 'F', 'slow', L => { town(); const l = linaK(L, 'smile'); const c = put(ich, 0, 0, 0, 0); walkC(c, L.lt, 2, 26, -.08, 3.2, L.T); hals(c, NI, { T: L.T, sway: .03 }); cara(c, L.T, { expr: 'smile' });
  volk(0, 40, 30, 14, 40, L.T, 81, { phone: true }); orbit(V(2, 12, 46), lerp(62, 50, easeIn(L.k)), PI - .4, .1, 46); sh(V(0, 0, 46), 50); }, [[0, 'sparkle', .5], [.4, 'steps', .4], [1.2, 'bell_far', .4]]);
// 47 «Lina von der Eisdiele»: Lina en el mostrador, saludando con un cucurucho; corazones
shot(60.81, 'C', 'punch', L => { town(); const l = linaK(L, 'happy', 'wave'); attach(CONE, l.aL.hand, [0, -.6, .3], [PI, 0, 0], 1); hearts(headC(l).add(V(0, 1.2, 0)), L.T); badge('tag', 'LINA', W / 2, H * .2, (L.lt - .1) * 4);
  cam([1.8, 6.4, lerp(48, 50, L.k)], [0, 5.4, 59.4], 42); sh(V(0, 0, 58), 20); }, [[0, 'door_bell', .5], [.3, 'sparkle', .4]]);
// 48 «sagte: „Komm Samstag»: doblo el cuello hasta el mostrador como una jirafa; ella me habla
shot(61.85, 'W', null, L => { town(); const l = linaK(L, 'talk', 'point'); talk(l, L.T, 61.85, 63.72, 'happy'); const c = meK(L, 40.5, lerp(1.6, 2.35, easeOut(L.k * 1.5)), 'love'); hearts(headC(c).add(V(0, 1.2, 0)), L.T);
  bubble(l, 'Komm Samstag zu meiner Party!', (L.lt - .2) * 4, 1.6); orbit(V(0, 9, 50), lerp(32, 28, L.k), PI - .75, .1, 46); sh(V(0, 0, 50), 30); }, [[0, 'stretch_creak', .5], [.4, 'pop', .4]]);
// 48b «zu meiner Party»: el folleto rosa: PARTY! SAMSTAG
shot(62.90, 'C', 'punch', L => { town(); const l = linaK(L, 'happy'); actuar(l, L.lt, [[0, { aRx: 1.8, aRe: .3, aRz: -.2 }]], { T: L.T }); const c = meK(L, 40.5, 2.35, 'happy');
  const p = loc(l, -.4, 6.2, 2.2); show(FLY, p.x, p.y, p.z, 0, 1); FLY.rotation.set(0, PI + .1, 0); cam([p.x + .6, p.y + .3, p.z - lerp(5.5, 4.6, L.k)], [p.x, p.y, p.z], 42); sh(V(0, 0, 56), 20); }, [[0, 'paper', .6], [.3, 'party_horn', .3]]);
// 49 «Das Problem: Sie ist im»: zoom al folleto: IM KELLER
shot(63.72, 'Z', 'punch', L => { town(); const l = linaK(L, 'happy'); actuar(l, L.lt, [[0, { aRx: 1.8, aRe: .3, aRz: -.2 }]], { T: L.T }); const c = meK(L, 40.5, 2.35, 'shock');
  const p = loc(l, -.4, 6.2, 2.2); show(FLY, p.x, p.y, p.z, 0, 1); FLY.rotation.set(0, PI + .1, 0); cam([p.x + .2, p.y - .9, p.z - lerp(3.4, 3.0, L.k)], [p.x, p.y - 1.1, p.z], 42); badge('red', 'PROBLEM', W / 2, H * .17, (L.lt - .05) * 4, 1, .8); sh(V(0, 0, 56), 20); }, [[0, 'braam_short', .5], [.2, 'gasp', .4]]);
// 50 «Keller.»: el sótano de la fiesta: techo bajito, luces, globos
const kel = (L, n = 0) => { use('PK'); inside(.9, 40); PK.disco.rotation.y = L.T * 1.5; PK.LIGHTS.forEach((b, i) => b.material.emissiveIntensity = 1.6 + Math.sin(L.T * 6 + i) * 1.2); };
shot(64.86, 'W', null, L => { kel(L); cam([PKX + 10, 4.2, 14], [PKX - 6, 3.4, -8], 50); cm([PKX + 12, 4.6, 15, PKX - 4, 3.5, -8, 52], [PKX + 8, 4.4, 11, PKX - 6, 3.6, -10, 50], L.k); sh(V(PKX, 0, 0), 30); }, [[0, 'door_creak', .5], [.3, 'drip', .4]]);
// 51 «Und die Kellerdecke? Zwei Meter.»: el metro del suelo al techo: 2 METER; Lina cabe justa
shot(65.58, 'C', 'punch', L => { kel(L); const l = put(lina, PKX - 3, 0, -6, .3); actuar(l, L.lt, [[0, 'shrug']], { T: L.T }); cara(l, L.T, { expr: 'smile' }); show(ZOLLS, PKX + .2, 0, -6.2, 0, 1.15);
  badge('red', '2 METER', W / 2, H * .18, (L.lt - .45) * 4, 1, 1); orbit(V(PKX - 1, 3.6, -6), lerp(15, 13, L.k), .1, .02, 46); sh(V(PKX, 0, -6), 20); }, [[0, 'ratchet', .5], [.45, 'impact', .5]]);
// 52 «Ich hab nachgerechnet»: en la plaza, pensando; números y signos girando alrededor de mi cabeza
shot(67.19, 'R', null, L => { plaza(L, 30, 83, -6, -2, 8); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .03 }); actuar(c, L.lt, [[0, 'think']], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  const h = headC(c); MATH.forEach((m, i) => { m.visible = true; const a = L.T * 2.4 + i * 1.26; m.position.set(h.x + Math.cos(a) * 2.6, h.y + .6 + Math.sin(L.T * 3 + i) * .4, h.z + Math.sin(a) * 2.6); m.lookAt(camera.position); }); orbit(h, lerp(13, 11, L.k), .2, .05, 44); sh(V(-6, 0, -2), 30); }, [[0, 'tick', .5], [.3, 'pencil', .4], [.6, 'tick', .4]]);
// 53 «Mir blieben zwölf Tage»: calendario 12 TAGE
shot(68.23, 'Z', 'punch', L => { plaza(L, 30, 85, -6, -2, 8); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .03 }); actuar(c, L.lt, [[0, 'fists']], { T: L.T }); cara(c, L.T, { expr: 'determined' }); const h = headC(c);
  orbit(h.clone().add(V(1.6, 0, 0)), lerp(15, 13, L.k), .05, .02, 46); calPop(L, '12', 'TAGE', h.clone().add(V(3.4, .3, .6))); sh(V(-6, 0, -2), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// ---------- la noche: en el jardín (yo en (17, 92) mirando a +x), portátil en la mesa (16, 3.2, 100), la tele detrás de la ventana del salón ----------
const nightG = L => { town('night'); BIRDSON = 0; DLIGHT.intensity = 10; };
const meG = (L, Lh = 18.4, ry = PI / 2 - .25, x = 17, z = 93) => { const c = put(ich, x, 0, z, ry); hals(c, Lh, { T: L.T, sway: .02 }); return c; };
// 54 «Also hab ich noch in derselben Nacht»: de noche en el jardín, decidido, con el móvil en la mano
shot(69.49, 'F', null, L => { nightG(L); const c = meG(L); handy(c); feed(PH, L.T); actuar(c, L.lt, [[0, scrollPose], [.6, 'fists']], { T: L.T }); cara(c, L.T, { expr: L.lt > .6 ? 'determined' : 'neutral' }); show(LAP, 16, 3.25, 100, PI / 2, 1); LAP.userData.S.draw('feed', (c_, w, h) => drawFeed(c_, w, h, 2));
  orbit(V(15, 11, 95), lerp(46, 40, L.k), .75, .1, 46); sh(V(14, 0, 95), 40); }, [[0, 'crickets', .5], [.4, 'owl', .3], [.8, 'fist', .4]]);
// 54b «alles gesperrt»: un candado gigante cae sobre todo: GESPERRT
shot(70.71, 'C', 'punch', L => { nightG(L); const c = meG(L); handy(c); lockS(PH); actuar(c, L.lt, [[0, 'point']], { T: L.T }); cara(c, L.T, { expr: 'determined' }); show(LAP, 16, 3.25, 100, PI / 2, 1); lockS(LAP);
  badge('red', 'ALLES GESPERRT', W / 2, H * .2, (L.lt - .1) * 4, 1, .8); orbit(V(15, 9, 96), lerp(34, 30, L.k), .8, .12, 46); sh(V(14, 0, 95), 40); }, [[0, 'lid_click', .6], [.2, 'impact', .5], [.5, 'click_metal', .4]]);
// 55 «Handy,»: la pantalla del móvil: candado
shot(72.03, 'W', 'punch', L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); lockS(PH, 'HANDY GESPERRT'); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); screenCam(PH, lerp(3.4, 3, L.k), 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'lid_click', .6], [.1, 'notif', .4]]);
// 56 «Laptop,»: el portátil de la mesa del jardín: candado
shot(72.65, 'W', 'punch', L => { nightG(L); show(LAP, 16, 3.25, 100, PI / 2, 1); lockS(LAP, 'LAPTOP GESPERRT'); cam([16 + lerp(6.5, 5.6, L.k), 6, 100], [16, 4.3, 100], 42); sh(V(16, 0, 100), 20); }, [[0, 'lid_click', .6], [.15, 'click_metal', .4]]);
// 57 «sogar den Fernseher.»: la tele detrás de la ventana del salón: candado; papá se lleva las manos a la cabeza
shot(73.20, 'W', 'punch', L => { nightG(L); HB.CURT.forEach(c_ => c_.visible = false); attach(TV, HB.HAUS, [-4, 6.6, 5.2], [0, 0, 0], .95); lockS(TV, 'TV GESPERRT'); const p = put(papa, 8.4, 1.4, 102.8, PI / 2 - .5); actuar(p, L.lt, [[0, 'hands_head']], { T: L.T }); cara(p, L.T, { expr: 'shock' });
  cam([lerp(26, 23, L.k), 7.5, 101], [10, 6.6, 100], 44); sh(V(10, 0, 100), 20); }, [[0, 'tv_static', .5], [.2, 'lid_click', .5], [.5, 'gasp_old', .4]]);
// 58 «Meine Bildschirmzeit:»: la pantalla de tiempo de uso: las barras suben
shot(74.32, 'S', null, L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); timeS(PH, 'high', L.k * 1.4); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); screenCam(PH, lerp(3.6, 3.1, L.k), 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'tick', .5], [.2, 'tick', .5], [.4, 'tick', .5]]);
// 58b «sechs Stunden vierzig am Tag.»: mi cara de susto; 6 STD. 40 MIN.
shot(75.14, 'C', 'punch', L => { nightG(L); const c = meG(L); handy(c); timeS(PH, 'high', 1); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); cara(c, L.T, { expr: 'shock' }); sweat(c, L.T, 2);
  badge('red', '6 STD. 40 MIN.', W / 2, H * .2, (L.lt - .1) * 4, 1, .9); orbit(headC(c), lerp(11, 9.5, L.k), PI / 2 - .15, .02, 44); sh(V(14, 0, 95), 20); }, [[0, 'braam_short', .5], [.2, 'gasp', .5]]);
// 59 «Ab jetzt: null.»: el contador a cero (verde)
shot(76.98, 'Z', 'punch', L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); timeS(PH, 'zero'); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); badge('green', '0 MIN.', W / 2, H * .2, (L.lt - .45) * 4, 1, 1);
  screenCam(PH, lerp(3.4, 2.9, L.k), 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'click_metal', .5], [.45, 'ding_soft', .5]]);
// 60 «Und ja, auch»: en el móvil, un vídeo de «In dieser Stadt»… el dedo duda
shot(78.00, 'W', null, L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); PH.userData.S.draw('chan', (c_, w, h) => drawFeed(c_, w, h, 1.3, true)); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); screenCam(PH, lerp(3.6, 3.2, L.k), 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'notif', .5], [.4, 'heartbeat', .4]]);
// 61 «„In dieser Stadt“-Videos.»: también bloqueado
shot(79.27, 'C', 'punch', L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); const k = clamp(L.lt / .25); PH.userData.S.draw('chanL' + Math.round(k * 4), (c_, w, h) => { drawFeed(c_, w, h, 1.3, true); if (k > 0) { c_.globalAlpha = k; drawLock(c_, w, h, 'GESPERRT', '#ff5a4a', 'rgba(12,14,28,.92)'); c_.globalAlpha = 1; } });
  actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); screenCam(PH, 3, 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'lid_click', .6], [.1, 'sad_tone', .4]]);
// 62 «Das war das Härteste.»: lloro; el cuello se me cae de pena
shot(80.21, 'W', null, L => { nightG(L); const c = put(ich, 17, 0, 93, PI / 2 - .25); hals(c, 18.4, { T: L.T, bend: lerp(.2, .9, easeOut(L.k)) }); actuar(c, L.lt, [[0, 'slump']], { T: L.T }); cara(c, L.T, { expr: 'cry' }); const h = headC(c); TEAR.forEach((t, i) => { const k = (L.T * 1.2 + i * .25) % 1; t.visible = true; t.position.set(h.x + (i % 2 ? .45 : -.45) * Math.cos(.25), h.y - .1 - k * 1.6, h.z + .55); });
  orbit(h, lerp(14, 12, L.k), PI / 2 - .1, .1, 44); sh(V(14, 0, 95), 30); }, [[0, 'cry_girl', .3], [.3, 'sigh', .5], [.7, 'drip', .4]]);
// 63 «Aber was dann passierte»: la casa de noche; duermo de pie (Zzz) bajo las estrellas
shot(81.40, 'F', null, L => { nightG(L); DLIGHT.intensity = 0; const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); hals(c, 18.4, { T: L.T * .5, bend: .3 }); cara(c, L.T, { expr: 'sleepy', eyes: 'closed' }); const h = headC(c);
  ZZZ.forEach((z, i) => { const k = (L.T * .6 + i / 3) % 1; z.visible = true; z.position.set(h.x + .8 + k * 1.2, h.y + 1 + k * 2.4, h.z); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  orbit(V(14, 12, 94), lerp(50, 44, L.k), .8, .14, 46); sh(V(14, 0, 95), 40); }, [[0, 'crickets', .5], [.3, 'snore', .4], [.9, 'owl', .3]]);
// 63b «hätte keiner gedacht» (zoom lento): amanece; abro los ojos… algo ha cambiado
shot(82.64, 'C', 'slow', L => { town('morning'); const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); hals(c, 18.4, { T: L.T * .5, bend: .1 }); cara(c, L.T, L.lt < .6 ? { expr: 'sleepy', eyes: 'closed' } : { expr: 'gasp' });
  orbit(headC(c), lerp(13, 9, easeIn(L.k)), PI / 2 - .2, .04, 44); sh(V(14, 0, 95), 30); }, [[0, 'rooster', .5], [.6, 'blink', .4]]);
// ---------- los días (de día en el jardín) ----------
const dayG = L => { town(); };
// 64 «Tag eins:»
shot(83.86, 'F', 'punch', L => { dayG(L); const c = meG(L); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); cara(c, L.T, { expr: 'determined' }); const h = headC(c); orbit(h.clone().add(V(0, 0, 1.5)), 15, PI / 2 - .15, .03, 46); calPop(L, 'TAG 1', 'SAMSTAG −12', h.clone().add(V(1.4, .2, 3.6)), '#3a8ad8'); sh(V(14, 0, 95), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// 65 «Er hörte auf zu wachsen»: el metro junto al cuello: 0 cm, ¡no crece!
shot(84.60, 'W', null, L => { dayG(L); const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'gasp' }); const n = neckAt(c, .82); show(ZOLLS, n.x + .1, n.y - 3, n.z - 1.2, PI / 2, 1);
  badge('green', '+0 cm', W / 2, H * .22, (L.lt - .2) * 4, 1, 1); badge('tag', 'STOPP', W / 2, H * .31, (L.lt - .5) * 4); cam([n.x + 7.5, n.y + 1, n.z - 2.5], [n.x, n.y + .5, n.z - .5], 44); sh(V(14, 0, 95), 30); }, [[0, 'ratchet', .5], [.3, 'ding_soft', .5]]);
// 66 «Papa hat mit dem»: papá sube por una escalera altísima apoyada a mi lado
shot(85.97, 'S', null, L => { dayG(L); const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'smile', eyes: 'down' }); show(LAD2, 18.2, 0, 90.6, PI / 2 - .25, 1); LAD2.rotation.z = .06;
  const y = lerp(8, 13, L.k); const p = put(papa, 19.6, y, 90.2, -PI / 2 - .25); actuar(p, L.lt, [[0, { aLx: 2.6 + Math.sin(L.T * 8) * .3, aRx: 2.6 - Math.sin(L.T * 8) * .3, aLe: .5, aRe: .5, lLx: .6 + Math.sin(L.T * 8) * .5, lLk: 1, lRx: .6 - Math.sin(L.T * 8) * .5, lRk: 1 }]], { T: L.T }); cara(p, L.T, { expr: 'determined' });
  cam([34, 3, 84], [18, 14, 91], 50); sh(V(16, 0, 92), 30); }, [[0, 'metal_creak', .5], [.3, 'steps', .4]]);
// 66b «Zollstock nachgemessen»: arriba de la escalera, papá pone el metro junto a mi cabeza y lee entrecerrando los ojos
shot(86.62, 'C', 'punch', L => { dayG(L); const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'smile' }); show(LAD2, 18.2, 0, 90.6, PI / 2 - .25, 1); LAD2.rotation.z = .06; const h = headC(c);
  const p = put(papa, 19.4, h.y - 5.6, 90.4, -PI / 2 - .6); actuar(p, L.lt, [[0, { aRx: 2.4, aRz: -.3, aRe: .4, aLx: 1.6, aLe: .4 }]], { T: L.T }); cara(p, L.T, { expr: 'sus', eyes: 'squint' }); show(ZOLLS, h.x + .9, h.y - 4.6, h.z + 1.1, PI / 2, 1);
  orbit(h.clone().lerp(headC(p), .5), lerp(13, 11, L.k), PI / 2 + .55, .04, 44); sh(V(16, 0, 92), 30); }, [[0, 'ratchet', .5], [.4, 'hmm', .4]]);
// 67 «Tag vier:»
shot(87.81, 'F', 'punch', L => { dayG(L); const c = meG(L, 18.4); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'gasp' }); const h = headC(c); orbit(h.clone().add(V(0, 0, 1.5)), 15, PI / 2 - .15, .03, 46); calPop(L, 'TAG 4', 'SAMSTAG −8', h.clone().add(V(1.4, .2, 3.6)), '#3a8ad8'); sh(V(14, 0, 95), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// 68 «ein ganzer Meter weg.»: el cuello baja de golpe un metro: −1 METER
shot(88.48, 'W', null, L => { dayG(L); const s = easeInOut(clamp((L.lt - .15) / .7)); const c = meG(L, lerp(18.4, 15.4, s)); actuar(c, L.lt, [[0, 'idle'], [.8, 'cheer']], { T: L.T }); cara(c, L.T, { expr: s > .9 ? 'joy' : 'gasp' });
  badge('green', '−1 METER', W / 2, H * .2, (L.lt - .6) * 4, 1, 1); orbit(V(16, 11, 94), lerp(36, 33, L.k), .9, .05, 46); sh(V(14, 0, 95), 30); }, [[0, 'whoosh_down', .5], [.2, 'stretch_creak', .4], [.85, 'cheer', .4]]);
// 69 «Die Möwen sind ausgezogen»: las gaviotas se van volando del tejado con sus maletitas
shot(89.92, 'S', null, L => { dayG(L); const c = meG(L, 15.4); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'grin' });
  GULLS.forEach((g, i) => { const t = L.lt + i * .15; show(g, 9 + t * 7 + i * 2, 24 + t * 6 + i, 86 + i * 3 - t * 5, 0, 1.1); g.rotation.y = PI / 2 + .6; g.userData.flap(L.T + i); });
  [CASH].length; orbit(V(14, 19, 92), lerp(34, 30, L.k), PI / 2 + .6, .12, 48); sh(V(14, 0, 92), 40); }, [[0, 'feathers', .5], [.3, 'birds', .5], [.8, 'whistle', .3]]);
// 70 «Tag acht:»
shot(91.35, 'F', 'punch', L => { dayG(L); const c = meG(L, 8); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy' }); const h = headC(c); orbit(h.clone().add(V(0, 0, 1.5)), 15, PI / 2 - .15, .03, 46); calPop(L, 'TAG 8', 'SAMSTAG −4', h.clone().add(V(1.4, .2, 3.6)), '#3a8ad8'); sh(V(14, 0, 95), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// 71 «Zum ersten Mal kam ich»: voy hacia la puerta de abajo de casa (cuello ya corto)
shot(92.11, 'W', null, L => { dayG(L); const c = put(ich, 0, 0, 0, 0); walkC(c, L.lt, 19, 91.2, -PI / 2, 3.4, L.T); hals(c, 6, { T: L.T, sway: .03 }); cara(c, L.T, { expr: 'happy' });
  const p = put(papa, 12.4, 0, 88.4, PI / 2 + .3); actuar(p, L.lt, [[0, 'cheer']], { T: L.T }); cara(p, L.T, { expr: 'joy' }); orbit(V(14, 6, 91), lerp(26, 22, L.k), PI - .55, .1, 46); sh(V(14, 0, 91), 30); }, [[0, 'steps', .5], [.5, 'steps', .5], [.9, 'cheer', .4]]);
// 71b «durch die untere Tür rein»: agacho la cabeza y entro por la puerta normal; papá aplaude
shot(93.29, 'C', 'punch', L => { dayG(L); const c = put(ich, 0, 0, 0, 0); walkC(c, L.lt, 15.4, 91.2, -PI / 2, 3.0, L.T, { crouch: .4, lean: .3 }); hals(c, 6, { T: L.T, bend: .6 }); cara(c, L.T, { expr: 'grin' });
  const p = put(papa, 12.6, 0, 87.6, PI / 2 + .4); actuar(p, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.4 + Math.sin(L.T * 14) * .3, aRz: -.4 + Math.sin(L.T * 14) * .3, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(p, L.T, { expr: 'joy' }); confRain(V(13, 0, 90), L.T, 40, 10, 10, 12);
  orbit(V(13.5, 4.5, 90), lerp(19, 17, L.k), PI / 2 + .75, .06, 46); sh(V(13, 0, 90), 20); }, [[0, 'door_open', .5], [.3, 'confetti', .4], [.5, 'cheer', .4]]);
// 72 «Tag elf:»
shot(94.60, 'F', 'punch', L => { dayG(L); const c = meG(L, 2.2); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy' }); const h = headC(c); orbit(h.clone().add(V(0, 0, 1.5)), 13, PI / 2 - .15, .03, 46); calPop(L, 'TAG 11', 'SAMSTAG −1', h.clone().add(V(1.2, .4, 3.2)), '#3a8ad8'); sh(V(14, 0, 95), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// 73 «Ich sah meine Füße.»: miro abajo… ¡mis pies!
shot(95.34, 'W', null, L => { dayG(L); const c = meG(L, 1.6); SOCKS.forEach(s => s.visible = true); actuar(c, L.lt, [[0, { headX: .6, lean: .25, aLx: .5, aRx: .5, aLz: .5, aRz: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'gasp', eyes: 'down' }); const h = headC(c);
  cam([h.x + 4.2, h.y + 2.4, h.z + 1], [17 + Math.sin(L.T) * .1, 1.2, 93], lerp(56, 48, L.k)); sh(V(17, 0, 93), 20); }, [[0, 'gasp', .5], [.4, 'sparkle', .4]]);
// 74 «Zwei verschiedene Socken.»: primer plano de los calcetines desparejados (rayas rojas y lunares verdes), los muevo
shot(96.46, 'C', 'punch', L => { dayG(L); const c = meG(L, 1.6); SOCKS.forEach(s => s.visible = true); actuar(c, L.lt, [[0, { headX: .5, lean: .2, lLx: Math.max(0, Math.sin(L.T * 7)) * .3, lRx: Math.max(0, -Math.sin(L.T * 7)) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy' });
  cam([17 + lerp(7.5, 6.2, L.k), 2.4, 93 - 2.2], [17, 1.2, 93], 44); badge('tag', '2 VERSCHIEDENE', W / 2, H * .2, (L.lt - .1) * 4); sh(V(17, 0, 93), 20); }, [[0, 'cloth', .5], [.4, 'kids_laugh', .3], [.8, 'pop', .4]]);
