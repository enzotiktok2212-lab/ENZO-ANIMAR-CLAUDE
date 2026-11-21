// ===== Parte 3: la tormenta, el dragón se derrite, el techo de paraguas, el tobogán (149,0 – 202,2 s) =====
// dragón sobre el centro de la plaza, encima de la cima del tobogán (0, 30, 0)
const DP = (s, t) => dpath(22, 33, -3, 60, .8, 0)(s, t);
const storm_ = (L, k = 1, c = V(0, 0, 0), rk = 1) => { town('storm'); storm(k); CLO.set(V(0, 0, -10), L.T, k, 160, 70); RAIN.update(L.T, c, rk, 70, 50, 70); };
const umbRoof = (k = 1, gap = 3) => { const L_ = []; for (let x = -26; x <= 26; x += 5.6) for (let z = -14; z <= 40; z += 5.6) { if (Math.abs(x) < gap && z > -4) continue; const r = RNG((x + 40) * 97 + z); if (r() > k) continue; L_.push([x + (r() - .5) * 1.4, 0, z + (r() - .5) * 1.4, (r() - .5) * .15, (r() - .5) * .15, r() * 6]); } return L_; };
const roofPeople = L_ => L_.filter(u => !(Math.abs(u[0]) < 10 && u[2] > 0 && u[2] < 24)).map(u => [u[0], u[2], Math.atan2(-u[0], 30 - u[2]) + (RNG(u[0] * 7)() - .5) * .6]);
// ---------- 79 · «Dann heulte die Regensirene.» ----------
shot(148.97, 'C', 'punch', L => { town(); const T = L.T; SIR.userData.on(T, true); GL = clamp(.7 - L.lt / .3);
  bg(L, [[XT[2], -36 + 3, -16 + 7, -.4, 'scared'], [K[5], -36 - 3.5, -16 + 6, .4, 'look']]);
  orb(L.k, V(-36, 12, -16), null, [32, 1.25, -.12, 48], [27, 1.35, -.18, 46]); sh(V(-36, 0, -16), 24); }, [[0, 'glitch', .5], [.05, 'siren', 1.0], [.6, 'gasp', .5]]);
// ---------- 80 · «Mitten im Juli.» : cartel de julio y helado; todo el mundo mira al cielo ----------
shot(150.78, 'F', null, L => { town(); const T = L.T; SIR.userData.on(T, true);
  put(K[4], 0, 0, 0, .1); actuar(K[4], L.lt, [[0, { aRx: 1.3, aRe: 1.5, headX: -.5 }]], { T }); cara(K[4], T, { expr: 'shock', mouth: 'o' });
  badge('gold', '☀ 15. JULI', W / 2, H * .17, (L.lt - .1) * 2.5, 1, 1);
  bg(L, [[XT[5], -4.4, -3, .4, 'look'], [XT[6], 4.4, -3.5, -.3, 'look', .2]]);
  orb(L.k, V(0, 2.8, -1), null, [14, .1, .05, 44], [12, -.05, .05, 44]); sh(V(0, 0, 0), 16); }, [[0, 'siren', .5], [.3, 'ding_soft', .5]]);
// ---------- 81 · «Aus dem Nichts zogen schwarze Wolken auf,» : las nubes negras se tragan el cielo sobre el Rathaus (zoom lento) ----------
shot(151.78, 'Z', 'slow', L => { const T = L.T; town(); storm(L.k); CLO.set(V(-6, 0, -90), T, .2 + L.k * .9, 220, 60);
  crowdAt(T, grid(-50, -60, 40, -20, 80, 13, 0), 'still', true);
  orb(L.k, V(-6, 30, -84), null, [120, 0, .06, 52], [96, .03, .04, 48], easeIn); sh(V(-6, 0, -60), 60); }, [[0, 'wind', .8], [.8, 'thunder', .6], [1.6, 'wind', .6]]);
// ---------- 82 · «und alle schnappten sich ihre Bilder und rannten.» ----------
shot(153.78, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 0, 20), .4);
  bg(L, [[XT[0], -8, 12, .1, 'run'], [XT[1], 4, 6, .2, 'run', .3], [K[0], -2, 2, .1, 'run', .2], [K[7], 9, 14, -.2, 'run', .6], [XT[3], -12, -2, .3, 'run', .8]]);
  const cp = loc(XT[0], 0, 1.2, 2.2); show(CAT, cp.x, cp.y, cp.z, .1 + PI / 2, .42); CAT.userData.anim(T); const sp = loc(K[0], 0, .8, 1.6); show(SKATE[2], sp.x, sp.y, sp.z, PI / 2 + .1, .7);
  crowdAt(T, grid(-50, -50, 40, -10, 70, 14, 0), 'cheer');
  orb(L.k, V(-1, 3, 16 + L.lt * 7), null, [13, .1, .12, 48], [12, -.1, .12, 48]); sh(V(0, 0, 18), 40); }, [[0, 'crowd_run', .8], [.5, 'thunder', .5], [1.2, 'shout_m', .4], [1.8, 'rain', .5]]);
// ---------- 83 · «Der erste Tropfen traf Smaragd,» : una gota gorda cae sobre la cola del dragón ----------
shot(156.35, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(-30, 30, -3), .25); DRA.g.visible = true; DRA.update(T, DP); riders(T, 0);
  const tail = DRA.segs[DRA.N - 3].position; const dk = clamp(L.lt / .8); SWEAT[0].visible = true; SWEAT[0].position.copy(tail).add(V(0, 14 * (1 - dk) + 2, 0)); SWEAT[0].scale.set(4, 6, 4); if (dk >= 1) SWEAT[0].visible = false;
  puff(tail.clone().add(V(0, 1.5, 0)), L.t0 + .8, T, 10, .6, GDUST, 1.2);
  orbit(tail.clone().add(V(0, 4, 0)), 15 - L.k * 2, .45, .22, 44); sh(V(-30, 0, -3), 40); }, [[.1, 'drip', .8], [.8, 'water_bloop', 1], [.85, 'splash', .7]]);
// ---------- 84 · «und Leas Drache fing an zu zerlaufen –» : la cola gotea verde; Lea abajo, horrorizada ----------
shot(158.19, 'S', null, L => { const T = L.T; storm_(L, 1, V(-20, 15, -3), .8); DRA.g.visible = true; DRA.update(T, DP, { melt: .05 + L.k * .08 }); riders(T, 1);
  put(lea, -30, 0, 8, PI - .2); actuar(lea, L.lt, [[0, 'hands_head']], { T }); cara(lea, T, { expr: 'shock', mouth: 'grimace' });
  orb(L.k, V(-30, 11, 3), null, [36, -.1, .05, 48], [32, .05, .05, 48]); sh(V(-30, 0, 0), 40); }, [[0, 'drip', .8], [.4, 'drip', .7], [.8, 'gasp', .6], [1.2, 'rain', .5]]);
// ---------- 85 · «mit neun Kindern auf dem Rücken,» : los niños se agarran, asustados ----------
shot(160.13, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 33, -3), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .13 + L.k * .04 }); riders(T, 1);
  badge('red', '9 KINDER', W / 2, H * .16, (L.lt - .1) * 2.5, 1, .9);
  const c = DRA.seat(11); orbit(c.clone().add(V(0, 1.4, 0)), 20 - L.k * 2, .25, .15, 46); sh(c.clone().setY(0), 40); }, [[0, 'scream_girl', .5], [.5, 'kids_laugh', 0], [.6, 'cry_girl', .4], [1.0, 'rain', .5]]);
// ---------- 86 · «zwölf Meter über dem Boden.» : picado vertiginoso desde el lomo ----------
shot(161.75, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 15, 0), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .17 }); riders(T, 1);
  crowdAt(T, grid(-30, -20, 30, 30, 70, 15, 0), 'still', true);
  badge('big', '12 METER', W / 2, H * .55, (L.lt - .15) * 2.5, 1, 1);
  const c = DRA.seat(9); cam([c.x + 2, c.y + 5, c.z + 3], [c.x - 2, 0, c.z + 6], 58 - L.k * 6); sh(V(0, 0, 0), 40); }, [[0, 'wind', .8], [.4, 'heartbeat', .7]]);
// ---------- 87 · «Lea versuchte, eine Leiter zu malen,» : Lea dibuja una escalera rosa a toda prisa ----------
shot(163.15, 'S', null, L => { const T = L.T; storm_(L, 1, V(-14, 0, 0), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .18 }); riders(T, 1);
  show(LAD, -14, 0, -2.6, 0); LAD.userData.set(clamp(L.lt / 1.6));
  put(lea, -14, 0, -.6, PI); applyPose(lea, { aRx: 2.4 - clamp(L.lt / 1.6) * .6 + Math.sin(T * 14) * .2, aRz: Math.cos(T * 14) * .3, aRe: .3, aLx: .4, headX: -.3 }); chalkIn(lea, CHALK2); cara(lea, T, { expr: 'determined', mouth: 'grimace' });
  orb(L.k, V(-14, 4.5, -1.6), null, [15, PI / 2 + .6, .12, 46], [13, PI / 2 + .45, .1, 46]); sh(V(-14, 0, -2), 24); }, [[0, 'chalk', 1], [.4, 'chalk', .8], [.8, 'chalk', .9], [1.3, 'chalk', .7]]);
// ---------- 88 · «aber der Regen spülte sie weg, bevor sie fertig war.» ----------
shot(164.95, 'C', null, L => { const T = L.T; storm_(L, 1, V(-14, 5, 0), 1); show(LAD, -14, 0, -2.6, 0); LAD.userData.set(.75 * (1 - easeIn(clamp(L.lt / 1.6)))); puff(V(-14, 8, -2.6), L.t0 + .2, T, 10, .6, DUST, 1.6);
  put(lea, -14, 0, -.6, PI - .4); actuar(lea, L.lt, [[0, 'shock'], [1.3, 'hands_head']], { T }); cara(lea, T, { expr: 'shock', mouth: 'grimace' }); sweat(lea, T);
  orb(L.k, V(-14, 5, -1.8), null, [20, PI / 2 + .6, .08, 46], [18, PI / 2 + .8, .08, 46]); sh(V(-14, 0, -2), 24); }, [[0, 'water_bloop', .7], [.4, 'drip', .7], [1.2, 'sob', .5]]);
// ---------- 89 · «Ein richtiges Bild braucht Stunden.» : reloj que gira loco sobre el dibujo enorme de Lea ----------
shot(167.45, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 0, 0), .8);
  put(lea, 0, 0, 0, 0); applyPose(lea, drawP(T, 4)); chalkIn(lea, CHALK2); cara(lea, T, { expr: 'worried', mouth: 'frown' }); dec(DC.mast1, 0, 3.6, 0); dec(DC.mast2, -3, 7, .3);
  badge('gold', '⏱ STUNDEN', W / 2, H * .17, (L.lt - .1) * 2.5, 1, 1);
  orb(L.k, V(0, 2, 1.4), null, [16, .3, .5, 46], [14, .1, .45, 46]); sh(V(0, 0, 0), 16); }, [[0, 'clock_spin', .8], [.6, 'ticks', .6]]);
// ---------- 90 · «Wir hatten Sekunden.» : el dragón, cada vez más corto; cuenta atrás ----------
shot(169.41, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 30, 0), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .2 + L.k * .03 }); riders(T, 1);
  badge('red', '⏱ SEKUNDEN', W / 2, H * .17, (L.lt - .05) * 2.5, 1, 1);
  orbit(DRA.seat(12), 34, -.3, .02, 48); sh(V(0, 0, 0), 40); }, [[0, 'tick', .7], [.3, 'tick', .7], [.6, 'tick', .7], [.9, 'tick', .8], [1.1, 'scream_girl', .4]]);
// ---------- 91 · «Und keiner in der Stadt malt schneller als ich –» : Emil aprieta la tiza, decidido (zoom lento) ----------
shot(170.78, 'Z', 'slow', L => { const T = L.T; storm_(L, 1, V(0, 0, 10), .7);
  put(emil, 0, 0, 10, 0); actuar(emil, L.lt, [[0, { aRx: 1.6, aRz: -.3, aRe: 1.6, aLz: .2, headX: .05 }]], { T, extra: shiver(T, .3) }); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'flat' }); show(KRU, 2.6, 0, 11, -.3, .8); KRU.userData.anim(T, 0);
  onFace(emil, 11, .2, .2, 40, L.k, 5.5); sh(V(0, 0, 10), 16); }, [[0, 'rain', .6], [.4, 'heartbeat', .7], [1.4, 'heartbeat', .7]]);
// ---------- 92 · «weil keiner schlechter malt als ich.» : media sonrisa; destello ----------
shot(173.05, 'F', null, L => { const T = L.T; storm_(L, 1, V(0, 0, 10), .7);
  put(emil, 0, 0, 10, .2); actuar(emil, L.lt, [[0, { aRx: 1.0, aRz: -.2, aRe: 1.0, headZ: .15 }]], { T }); chalkIn(emil); cara(emil, T, { expr: 'smug', mouth: 'smile' });
  orb(L.k, V(0, 3, 10), null, [11, .5, .1, 44], [10, .3, .1, 44]); sh(V(0, 0, 10), 16); }, [[0, 'sparkle', .6], [.6, 'chalk', .5]]);
// ---------- 93 · «Ich schrie: „Regenschirme!“» : Emil sube al borde de la fuente y grita ----------
shot(174.90, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(-18, 0, -24), .9);
  put(emil, -18, 2.2, -16.5, .2); actuar(emil, L.lt, [[0, { aRx: 2.2, aRz: -.3, aRe: 1.6, aLx: 2.8, aLz: .5, aLe: .2, lean: -.15, headX: -.25 }]], { T }); cara(emil, T, { expr: 'shout', mouth: L.lt > .4 ? 'talk_wide' : 'flat' });
  if (L.lt > .45) bubble(emil, 'REGENSCHIRME!', (L.lt - .45) * 3, 2.6);
  bg(L, [[XT[0], -24, -8, .5, 'look'], [XT[2], -12, -8, -.4, 'look', .2]]);
  orb(L.k, V(-18, 5, -16.5), null, [17, .2, -.1, 46], [15, .1, -.12, 44]); sh(V(-18, 0, -18), 24); }, [[.45, 'shout_m', .9], [.6, 'impact', .4]]);
// ---------- 94 · «Dreihundert Leute rannten auf den Marktplatz» : la gente entra corriendo con paraguas ----------
shot(176.40, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 0, 10), 1);
  const U_ = umbRoof(1).map((u, i) => { const r = RNG(i * 3 + 1), k = clamp(L.lt / 1.6 + r() * .3); return [lerp(u[0] * 2.5, u[0], k), 0, lerp(u[2] + 40, u[2], k), 0, 0, 0, .9]; }); UMF.set(U_); crowdAt(T, U_.map(u => [u[0], u[2], PI]), 'cheer');
  badge('big', '300', W / 2, H * .17, (L.lt - .1) * 2.5, 1, 1.3);
  orb(L.k, V(0, 6, 4), null, [58, .02, .5, 50], [52, .1, .55, 50]); sh(V(0, 0, 10), 60); }, [[0, 'crowd_run', 1], [.5, 'umbrella', .7], [.9, 'umbrella', .6], [1.4, 'cheer', .5]]);
// ---------- 95 · «und hielten ihre Schirme zusammen wie ein Dach.» : vista aérea, los paraguas forman un techo ----------
shot(178.75, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 8, 12), 1); const U_ = umbRoof(1, 0).map(u => [u[0], 0, u[2], u[3] * (1 - L.k), u[4] * (1 - L.k), 0, .95 + L.k * .12]); UMF.set(U_); crowdAt(T, roofPeople(U_), 'still');
  orbit(V(0, 6, 12), 70 - L.k * 10, .2 + L.k * .2, 1.2, 50); sh(V(0, 0, 12), 60); }, [[0, 'umbrella', .6], [.4, 'umbrella', .6], [.9, 'cloth', .6], [1.6, 'rain', .7]]);
// ---------- 96 · «Zum ersten Mal überhaupt gab es mitten im Unwetter» : debajo del techo: la lluvia rebota arriba ----------
shot(180.97, 'S', null, L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .9); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'sway');
  put(emil, 0, 0, 12, 0); actuar(emil, L.lt, [[0, { headX: -.5, aLx: .4, aRx: .4, aLz: .4, aRz: .4 }]], { T }); cara(emil, T, { eyes: 'wide', mouth: 'open_smile' }); show(KRU, 2.4, 0, 13, -.3, .8); KRU.userData.anim(T, 0);
  cam([3, 2.2, 22 - L.k * 2], [0, 5.5, 8], 56); sh(V(0, 0, 12), 30); }, [[0, 'rain', .8], [.6, 'water_bloop', .4]]);
// ---------- 97 · «einen trockenen Fleck.» : un círculo seco en el suelo; Emil se arrodilla ----------
shot(183.05, 'F', null, L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .9); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'sway');
  put(emil, 0, 0, 12, 0); actuar(emil, L.lt, [[0, 'idle'], [.6, KNEEL]], { T }); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'smile' });
  badge('gold', 'TROCKEN!', W / 2, H * .17, (L.lt - .2) * 2.5, 1, 1);
  orb(L.k, V(0, 2.4, 12), null, [16, .3, .45, 46], [14, .1, .4, 46]); sh(V(0, 0, 12), 20); }, [[0, 'sparkle', .6], [.6, 'cloth', .5]]);
// ---------- 98 · «Ich malte die schnellste Rutsche aller Zeiten:» : dibuja a toda velocidad, con estelas ----------
shot(185.29, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .6); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'cheer');
  put(emil, 0, 0, 12, PI); applyPose(emil, drawP(T, 30)); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'grimace' }); dec(DC.slide, 0, 6.6, 0, clamp(L.lt / 1.6));
  puff(V(0, .3, 8), L.t0, T, 8, .3, DUST, 2.2);
  orb(L.k, V(0, 1.8, 10), null, [10, PI + .4, .12, 46], [9, PI + .25, .14, 46]); sh(V(0, 0, 10), 20); }, [[0, 'chalk', 1], [.3, 'chalk', 1], [.6, 'chalk', 1], [1.0, 'chalk', 1], [1.4, 'chalk', .9]]);
// ---------- 99 · «zwei Striche, ein paar Stufen –» : cenital del dibujo: dos rayas y escalones ----------
shot(187.63, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .3); put(emil, 0, 0, 12, PI); applyPose(emil, drawP(T, 26)); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'grimace' }); dec(DC.slide, 0, 6.6, 0, 1);
  badge('big', '2', W * .3, H * .3, (L.lt - .2) * 3, 1, 1.2); badge('blue', '+ STUFEN', W * .65, H * .32, (L.lt - .9) * 3, 1, .8);
  cam([0, 15, 7.5], [0, 0, 7.2], 50); camera.rotation.z = 0; sh(V(0, 0, 8), 20); }, [[.2, 'chalk', .9], [.9, 'chalk', .9]]);
// ---------- 100 · «zwei Sekunden.» : ¡pum! el tobogán sale disparado del suelo ----------
shot(189.41, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .8); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'cheer');
  show(SLD, 0, 0, 0); SLD.userData.set(easeOut(clamp(L.lt / .9)) * .35, 0); puff(V(0, 1, 6), L.t0, T, 14, .8, DUST, 1.0);
  put(emil, -4, 0, 12, .5); actuar(emil, L.lt, [[0, 'cheer']], { T }); grin(emil, T);
  badge('blue', '2 SEK', W / 2, H * .17, (L.lt - .05) * 3, 1, 1.1);
  cam([7 - L.k, 2.6, 19 - L.k * 2], [0, 6.5, 5], 56); sh(V(0, 0, 8), 30); }, [[0, 'magic_hit', 1], [.1, 'whoosh_up', .8], [.4, 'cheer', .5]]);
// ---------- 101 · «Sie schoss durch die Schirme nach oben, bis ganz hinauf zu Smaragd.» : contrapicado; el tobogán atraviesa el techo de paraguas (zoom lento) ----------
shot(190.31, 'R', 'slow', L => { const T = L.T; storm_(L, 1, V(0, 20, 6), 1); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'cheer');
  show(SLD, 0, 0, 0); SLD.userData.set(.35 + easeOut(clamp(L.lt / 2.2)) * .65, 0); DRA.g.visible = true; DRA.update(T, DP, { melt: .25 }); riders(T, 1);
  orb(L.k, V(0, 14, 6), V(0, 26, 0), [52, .9, .15, 52], [48, .75, .05, 50], easeIn); sh(V(0, 0, 4), 50); }, [[0, 'whoosh_up', .7], [.6, 'creek', .4], [1.2, 'cheer', .6], [2.4, 'kids_laugh', .4]]);
// ---------- 102 · «Die Kinder rutschten eins nach dem anderen runter,» ----------
const slideRider = (c, s, T, i = 0) => { const P = SLD.userData.P(clamp(s)); const P2 = SLD.userData.P(clamp(s + .02)); put(c, P.x, P.y + 1.1, P.z, 0); c.root.rotation.x = Math.atan2(P.y - P2.y, P2.z - P.z) * .7; applyPose(c, { ...SIT, aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4, aLe: .2, aRe: .2, lLk: .1, lRk: .1 }); cara(c, T, { eyes: 'happy', mouth: i % 2 ? 'laugh' : 'open_smile' }); };
shot(193.60, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 15, 15), 1); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'cheer');
  show(SLD, 0, 0, 0); DRA.g.visible = true; DRA.update(T, DP, { melt: .28 }); riders(T, 1, RIDERS().slice(4));
  [K[0], K[1], K[2], K[3]].forEach((c, i) => slideRider(c, L.lt * .55 - i * .22, T, i));
  orb(L.k, V(0, 14, 12), null, [44, 1.15, .12, 50], [41, 1.0, .1, 50]); sh(V(0, 0, 12), 50); }, [[0, 'whoosh_down', .7], [.4, 'kids_laugh', .7], [.9, 'whoosh_down', .6], [1.5, 'whoosh_down', .6]]);
// ---------- 103 · «und die Leute unten fingen jedes einzelne auf.» : al final del tobogán, los mayores atrapan a los niños ----------
shot(196.01, 'S', null, L => { const T = L.T; storm_(L, 1, V(0, 5, 34), .9); const U_ = umbRoof(1).filter(u => u[2] < 24); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_).filter(p => p[1] < 28), 'cheer'); show(SLD, 0, 0, 0);
  slideRider(K[4], .82 + L.lt * .12, T, 1); const k = clamp((L.lt - 1.2) / .5);
  put(XT[6], -1.6, 0, 37, PI - .2); actuar(XT[6], L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5, lean: .1 }]], { T }); grin(XT[6], T); put(XT[0], 2.4, 0, 36, PI + .3); actuar(XT[0], L.lt, [[0, 'cheer']], { T }); laughF(XT[0], T);
  put(K[1], -4, 0, 38, PI - .6); actuar(K[1], L.lt, [[0, 'cheer']], { T }); laughF(K[1], T);
  orb(L.k, V(0, 3.5, 35), null, [16, PI - .7, .14, 46], [15, PI - .55, .12, 46]); sh(V(0, 0, 34), 24); }, [[0, 'whoosh_down', .7], [.9, 'land', .7], [1.0, 'cheer', .7], [1.6, 'clap', .6]]);
// ---------- 104 · «Nur Lina nicht.» ----------
shot(198.54, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 33, -3), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .3 }); const p = DRA.seat(11); put(lina, p.x, p.y - .2, p.z, PI / 2 + .4); applyPose(lina, { ...RIDE, lean: .5, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3, headX: .2, ...shiver(T, 2) }); cara(lina, T, { expr: 'shock', mouth: 'grimace' });
  show(SLD, 0, 0, 0);
  orbit(p.clone().add(V(0, 1, 0)), 12 - L.k, 1.35, .25, 42); sh(V(0, 0, 0), 40); }, [[0, 'cry_girl', .7]]);
// ---------- 105 · «Sie ist fünf und hatte zu viel Angst loszulassen.» ----------
shot(199.56, 'F', null, L => { const T = L.T; storm_(L, 1, V(0, 33, -3), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .31 + L.k * .03 }); const p = DRA.seat(11); put(lina, p.x, p.y - .2, p.z, PI / 2 + .6); applyPose(lina, { ...RIDE, lean: .5, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3, headX: .1, ...shiver(T, 2) }); cara(lina, T, { eyes: 'closed', mouth: 'grimace' }); SWEAT.forEach((s, i) => { s.visible = true; s.position.copy(hp(lina)).add(V(.4 - i * .4, .2 - ((T * 1.5 + i * .3) % 1) * 2, .5)); s.scale.setScalar(.6); });
  show(SLD, 0, 0, 0);
  badge3('big', '5', hp(lina).add(V(0, 2.4, 0)), (L.lt - .2) * 3, 1.1);
  orbit(p.clone().add(V(0, 1.2, 0)), 11 - L.k * 1.5, 1.55, .25, 40); sh(V(0, 0, 0), 40); }, [[0, 'sob', .7], [.3, 'ding_soft', .5], [1.4, 'cry_girl', .6]]);
