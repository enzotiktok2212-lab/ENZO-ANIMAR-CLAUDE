// ---------- d: Benni y la caseta, la revolución en el Marktplatz, el final (125,69 – 161,2 s) ----------
const GD = V(PX, 0, 80);                 // jardín de Benni (terraza en z ≈ 98, caseta en (PX + 4, 84) mirando +z)
const HUT = V(PX + 4, 0, 84);
// 94 «Und Benni hat ein einziges Mal»: en la terraza, Benni (de pie) y Jana, cara a cara
shot(125.69, 'W', null, L => { parkS(L); put(ben, GD.x - 2.4, 0, GD.z + 12, PI / 2 + .3); put(jana, GD.x + 2.4, 0, GD.z + 12, -PI / 2 - .3); actuar(ben, 0, [[0, { aLx: .3, aRx: .3, headX: -.05 }]], { T: L.T }); actuar(jana, 0, [[0, { aRx: 1.4, aRz: -.1, aRe: .2, aLx: .4, aLz: .6, aLe: 1.8 }]], { T: L.T });
  cara(ben, L.T, { expr: 'determined', mouth: 'flat' }); talk(jana, L.T, 125.7, 127.2, 'happy'); bubble(jana, 'Gassi!', clamp((L.lt - .2) / .1), 1.2);
  orb(L.k, V(GD.x, 3.6, GD.z + 12), null, [16, 0, .1, 46], [14.4, .08, .08, 46]); sh(V(GD.x, 0, GD.z + 10), 20); }, [[0, 'birds', .35], [.3, 'wind_trees', .3]]);
// 95 «Nein zu seiner Freundin gesagt.»: «Nein.» — Jana, en shock
shot(127.29, 'C', null, L => { parkS(L); put(ben, GD.x - 2.4, 0, GD.z + 12, PI / 2 + .3); put(jana, GD.x + 2.4, 0, GD.z + 12, -PI / 2 - .3); actuar(ben, 0, [[0, GEST.cross]], { T: L.T }); actuar(jana, 0, [[0, GEST.shock]], { T: L.T });
  const k = clamp((L.T - 127.29) / .1); talk(ben, L.T, 127.29, 127.6, 'determined'); cara(jana, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); bubble(ben, 'Nein.', k, 1.2);
  onBody(ben, 10.6, .45, .1, 44, L.k, 9.6); sh(V(GD.x, 0, GD.z + 10), 18); }, [[0, 'gasp_f', .5], [.3, 'braam_short', .4]]);
// 96 «Seitdem wohnt er in der Hundehütte»: el jardín: la caseta grande y Benni asomado, triste
shot(128.97, 'F', null, L => { parkS(L); put(ben, HUT.x, 0, HUT.z + 2.6, 0); actuar(ben, 0, [[0, SITZ({ headX: .25, aLx: 1.5, aRx: 1.5, aLe: 1.3, aRe: 1.3 })]], { T: L.T }); cara(ben, L.T, { expr: 'sad', mouth: 'frown' });
  cm([HUT.x - 10, 9, HUT.z + 22], [HUT.x - 8.6, 8.4, HUT.z + 20], L.k); camera.lookAt(HUT.x - 1, 4.4, HUT.z + 1); camera.fov = 46; sh(HUT, 22); }, [[0, 'wind', .35], [.5, 'sigh', .35]]);
// 97 «im Garten.»: más cerca: Benni come de su cuenco, abatido
shot(130.2, 'Z', null, L => { parkS(L); put(ben, HUT.x, 0, HUT.z + 2.8, -.25); actuar(ben, 0, [[0, DOGP(L.T, 0, { headX: .6 })]], { T: L.T }); cara(ben, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' }); tears(ben, L.T);
  orb(L.k, V(HUT.x + 1.2, 2.4, HUT.z + 3.6), null, [11, .35, .14, 44], [9.8, .25, .12, 44]); sh(HUT, 16); }, [[0, 'chew', .3], [.4, 'sad_tone', .3]]);
// 98 «Mit Namensschild.» (golpe de zoom): el cartel «BENNI» sobre la puerta
shot(131.15, 'C', 'punch', L => { parkS(L); put(ben, HUT.x, 0, HUT.z + 1.6, 0); actuar(ben, 0, [[0, SITZ({ headX: -.3 })]], { T: L.T }); cara(ben, L.T, { expr: 'sad', eyes: 'up', mouth: 'flat' });
  cm([HUT.x + .6, 8.2, HUT.z + 12], [HUT.x + .5, 8.0, HUT.z + 11], L.k); camera.lookAt(HUT.x, 6.8, HUT.z); camera.fov = 40; sh(HUT, 14); }, [[0, 'stamp', .5]]);
// 99 «Da hatte ich genug.»: Lukas se pone de pie de golpe, puños apretados
shot(132.19, 'S', null, L => { home(L); const k = easeOut(clamp(L.lt / .35)); put(me, WX - 2, 0, 2, 0); actuar(me, 0, [[0, mixP(DOGP(L.T, 0), GEST.fists, k)]], { T: L.T }); cara(me, L.T, { expr: 'angry', mouth: 'frown' });
  onBody(me, 11, .2, .12, 44, L.k, 9.6); }, [[0, 'stretch_creak', .4], [.3, 'fist', .45]]);
// 100 «Also habe ich heimlich»: de noche, a la luz del flexo, Lukas dibuja a escondidas
const DK = V(WX - 1, 0, -12);
shot(133.27, 'I', null, L => { home(L, { night: 1 }); put(me, DK.x, sitY(me, 2.6), DK.z + 3.4, PI); actuar(me, 0, [[0, seatPose({ aLx: 1.2, aRx: 1.3 + Math.sin(L.T * 14) * .1, aLe: 1.1, aRe: 1.0, lean: .25, headX: .35 })]], { T: L.T }); cara(me, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' });
  show(PLAN, DK.x, 4.28, DK.z + .6, 0, .9); FILL.intensity = 70; FILL.color.setRGB(1, .85, .6); cm([DK.x + 5, 7.8, DK.z + 6], [DK.x + 4.4, 7.6, DK.z + 5.4], L.k); camera.lookAt(DK.x, 4.8, DK.z + 2); camera.fov = 48; }, [[0, 'pencil', .5], [.5, 'clock_tick', .3]]);
// 101 «eine Revolution geplant.»: el plan de cerca: «PLAN: REVOLUTION!»
shot(134.47, 'Z', null, L => { home(L, { night: 1 }); show(PLAN, DK.x, 4.28, DK.z + .6, 0, .9); inHand(PEN, me, 'R', [0, -.6, .2]); put(me, DK.x, sitY(me, 2.6), DK.z + 3.4, PI); actuar(me, 0, [[0, seatPose({ aRx: 1.3, aRe: 1.0, lean: .25, headX: .35 })]], { T: L.T }); FILL.intensity = 70; FILL.color.setRGB(1, .85, .6);
  cm([DK.x + .3, 9.6, DK.z + 3.2], [DK.x + .2, 8.8, DK.z + 2.6], L.k); camera.lookAt(DK.x, 4.2, DK.z + .4); camera.fov = 44; }, [[0, 'paper', .45], [.6, 'evil_laugh', .2]]);
// Marktplatz: podio en (-6, -44); Lukas arriba (y = 4.8) mirando +z; los hombres al sur (z ∈ [-36, -8])
const POD0 = V(-6, 4.8, -44);
const menGrid = (L, mode, o = {}) => crowdGrid(L, -6, -36, 7, 5, 4.2, 4.6, { list: MA, mode, face: V(-6, 6, -44), jit: .15, seed: 4, ...o });
// 102 «Am Samstag stehen alle Männer der Stadt»: «SAMSTAG»: los hombres llegan a la plaza
shot(135.49, 'W', null, L => { town(L); for (let i = 0; i < 12; i++) { const m = MA[i]; walkTo(m, -24 + (i % 6) * 8, 8 + Math.floor(i / 6) * 7, PI + (i % 3 - 1) * .1, 3.2, L, i, 9); cara(m, L.T + i, { expr: 'determined' }); }
  badge('tag', 'SAMSTAG', W * .5, H * .17, clamp((L.T - 135.91) / .12)); orb(L.k, V(-6, 3, 2), null, [26, .15, .2, 48], [24, .05, .18, 48]); sh(V(-6, 0, 4), 30); }, [[0, 'crowd_run', .35], [.5, 'steps', .4]]);
// 103 «auf dem Marktplatz,»: plano general: la plaza llena de hombres frente al podio
shot(136.99, 'S', null, L => { town(L); menGrid(L, 'idle'); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'determined' });
  orb(L.k, V(-6, 2, -26), null, [52, .1, .48, 46], [46, .02, .44, 46]); sh(V(-6, 0, -26), 40); }, [[0, 'murmur', .45], [.5, 'shout_crowd', .2]]);
// 104 «und ich stehe oben»: Lukas sube a las cajas
shot(138.73, 'F', null, L => { town(L); menGrid(L, 'idle'); const t = easeOut(clamp(L.lt / .5)); put(me, POD0.x, lerp(2.4, POD0.y, t), POD0.z + lerp(1.6, 0, t), 0); actuar(me, 0, [[0, { lLx: 1.2 * (1 - t), lLk: 1.4 * (1 - t), aLx: .4, aRx: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  orb(L.k, V(POD0.x, 5.6, POD0.z), null, [17, .3, .05, 46], [15.5, .2, .04, 46]); sh(V(-6, 0, -40), 24); }, [[0, 'wood_creak', .5], [.4, 'jump_small', .35]]);
// 105 «mit dem Megafon:»: alza el megáfono
shot(139.59, 'Z', null, L => { town(L); menGrid(L, 'idle'); put(me, POD0.x, POD0.y, POD0.z, 0); const t = easeOut(clamp(L.lt / .3)); actuar(me, 0, [[0, { aRx: lerp(.4, 1.7, t), aRe: lerp(.2, 1.5, t), aRz: -.1, aLx: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  POST.push(() => { const h = hp(me); show(MEGA, h.x + .1, h.y + .3, h.z + 1.4, 0, 1.4); }); onFace(me, 5.6, -.2, .4, 44, L.k, 5.0); sh(V(-6, 0, -40), 20); }, [[0, 'click_metal', .45]]);
// 106 «Ab heute entscheiden wir!» (golpe de zoom): grita por el megáfono
shot(140.68, 'C', 'punch', L => { town(L); menGrid(L, 'idle'); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aRx: 1.7, aRe: 1.5, aRz: -.1, aLx: 2.6, aLz: .4, aLe: .4, lean: -.08 }]], { T: L.T }); talk(me, L.T, 140.68, 141.9, 'shout', { eyes: 'angry' });
  POST.push(() => { const h = hp(me); show(MEGA, h.x + .1, h.y + .3, h.z + 1.4, 0, 1.4); }); bubble(me, 'AB HEUTE ENTSCHEIDEN WIR!', clamp((L.lt - .05) / .1), 1.2);
  orb(L.k, V(POD0.x, 8.6, POD0.z), null, [12, -.25, .04, 44], [10.6, -.18, .03, 44]); sh(V(-6, 0, -40), 20); }, [[0, 'shout_m', .35], [.2, 'boom', .3]]);
// 107 «800 Männer jubeln.»: la multitud salta y vitorea: «800»
shot(142.02, 'W', null, L => { town(L); menGrid(L, 'cheer'); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, GEST.cheer]], { T: L.T }); laughF(me, L.T); confetti(V(-6, 6, -24), 142.1, L.T, 60, 1.4);
  badge('num', '800', W * .5, H * .16, clamp((L.T - 142.02) / .12), 1, 1.1); orb(L.k, V(-6, 4, -24), null, [30, PI - .2, .2, 50], [27, PI - .1, .18, 50]); sh(V(-6, 0, -26), 34); }, [[0, 'cheer', .6], [.3, 'shout_crowd', .45], [.6, 'confetti', .3]]);
// 108 «Zum ersten Mal fühle ich mich» (zoom lento): Lukas, pecho fuera… le salen orejas de lobo
shot(143.88, 'I', 'slow', L => { town(L); menGrid(L, 'cheer'); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aLx: .3, aRx: .3, aLz: .3, aRz: .3, lean: -.12, headX: -.1 }]], { T: L.T }); cara(me, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' }); WOLF.visible = L.T > 144.5; WOLF.scale.setScalar(spring(clamp((L.T - 144.5) * 3)));
  onFace(me, lerp(7, 5, easeIn(L.k)), -.1, 0, 44); sh(V(-6, 0, -40), 20); }, [[.6, 'magic_hit', .4]]);
// 109 «wie ein Wolf.»: aúlla con la cabeza hacia el cielo: «AUUUU!»
shot(145.1, 'Z', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aLx: .3, aRx: .3, aLz: .5, aRz: .5, lean: -.25, headX: -.6 }]], { T: L.T }); cara(me, L.T, { expr: 'shout', eyes: 'closed', mouth: 'o' }); WOLF.visible = true;
  bubble(me, 'AUUUUU!', clamp((L.lt - .1) / .1), 1.6); orb(L.k, V(POD0.x, 7.2, POD0.z), null, [13, .5, -.15, 46], [11.6, .4, -.18, 46]); sh(V(-6, 0, -40), 20); }, [[0, 'wind_howl', .45], [.2, 'growl', .25]]);
// 110 «Doch dann ruft eine Frau vom Balkon:»: una señora sale al balcón con la olla
const BALW = V(41.6, 7.85, -52);
shot(146.38, 'S', null, L => { town(L); put(FR[12], BALW.x, BALW.y, BALW.z, -PI / 2); show(POT, BALW.x - 1.6, BALW.y + 3.1, BALW.z + .2, 0, .9); actuar(FR[12], 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.15, aRz: -.15, aLe: .6, aRe: .6 }]], { T: L.T }); cara(FR[12], L.T, { expr: 'happy', mouth: 'smile' });
  POT.userData.st.forEach((s, i) => { const k = (L.T * .7 + i / 5) % 1; s.position.set(Math.sin(i * 2 + L.T) * .4, 1 + k * 3, 0); s.scale.setScalar(.6 + k); s.material.opacity = .45 * (1 - k); });
  cm([BALW.x - 17, 9, BALW.z + 3], [BALW.x - 15.4, 9.2, BALW.z + 2], L.k); camera.lookAt(BALW.x, 10.6, BALW.z); camera.fov = 46; sh(V(BALW.x, 0, BALW.z), 22); }, [[0, 'door_open', .4], [.5, 'steam', .35]]);
// 111 «Jungs, Essen ist fertig!»: golpea la olla con el cucharón y grita
shot(148.39, 'C', null, L => { town(L); put(FR[12], BALW.x, BALW.y, BALW.z, -PI / 2); show(POT, BALW.x - 1.6, BALW.y + 3.1, BALW.z + .2, 0, .9); actuar(FR[12], 0, [[0, { aLx: 1.4, aLe: .6, aLz: -.15, aRx: 2.4 + Math.sin(L.T * 16) * .3, aRz: .2, aRe: 1.2 }]], { T: L.T }); talk(FR[12], L.T, 148.39, 149.8, 'happy');
  inHand(LADLE, FR[12], 'R', [0, -.7, .3]); bubble(FR[12], 'Jungs, Essen ist fertig!', clamp((L.lt - .02) / .1), 1.2);
  POT.userData.st.forEach((s, i) => { const k = (L.T * .7 + i / 5) % 1; s.position.set(Math.sin(i * 2 + L.T) * .4, 1 + k * 3, 0); s.scale.setScalar(.6 + k); s.material.opacity = .45 * (1 - k); });
  onBody(FR[12], 11, .2, .02, 44, L.k, 9.8); sh(V(BALW.x, 0, BALW.z), 18); }, [[0, 'bell_far', .4], [.3, 'metal_hit', .35]]);
// 112 «Und in vier Sekunden»: todos los hombres salen corriendo en todas direcciones
shot(150.16, 'W', null, L => { town(L); MA.forEach((m, i) => { if (i >= 35) return; const col = i % 7, row = Math.floor(i / 7); const x0 = -6 + (col - 3) * 4.2 + (row % 2) * 2.1, z0 = -36 + row * 4.6, a = Math.atan2(x0 + 6, z0 + 30) + (i % 3 - 1) * .5; walkTo(m, x0, z0, a, 11, L, i, 18); m.root.rotation.y = a; cara(m, L.T + i, { expr: 'happy', mouth: 'open_smile' }); });
  put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, GEST.shock]], { T: L.T }); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); dust(V(-6, 0, -24), 150.2, L.T, 14, 1.2);
  orb(L.k, V(-6, 3, -28), null, [34, .15, .28, 50], [32, .1, .26, 50]); sh(V(-6, 0, -26), 40); }, [[0, 'crowd_run', .6], [.2, 'steps_run', .45]]);
// 113 «ist der Marktplatz leer.»: la plaza vacía; solo Lukas en sus cajas: «4 SEK»
shot(151.3, 'F', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aLx: .2, aRx: .2, aLz: .1, aRz: .1, headX: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'flat' }); dust(V(-2, 0, -30), 151.3, L.T, 4, .8);
  badge('num', '4 SEK', W * .5, H * .17, clamp((L.T - 151.3) / .12)); orb(L.k, V(-6, 3, -40), null, [44, .05, .3, 46], [40, .02, .28, 46]); sh(V(-6, 0, -36), 40); }, [[0, 'wind', .5], [.5, 'crickets', .4]]);
// 114 «Nur ich stehe noch da und brülle:»: solo, en lo alto de las cajas, se lleva el megáfono a la boca
shot(152.6, 'Z', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aRx: 1.7, aRe: 1.5, aRz: -.1, aLx: .5, aLz: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'angry', mouth: 'frown' });
  POST.push(() => { const h = hp(me); show(MEGA, h.x + .1, h.y + .3, h.z + 1.4, 0, 1.4); }); orb(L.k, V(POD0.x, 5, POD0.z), null, [22, -.3, .08, 46], [19, -.2, .06, 46]); sh(V(-6, 0, -40), 24); }, [[0, 'wind', .4], [.6, 'click_metal', .35]]);
// 115 «Wir sind keine Good Boys!» (golpe de zoom): grita a la plaza vacía
shot(154.57, 'C', 'punch', L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aRx: 1.7, aRe: 1.5, aRz: -.1, aLx: 1.0, aLz: .5, aLe: 1.9, lean: -.1 }]], { T: L.T }); talk(me, L.T, 154.57, 156.0, 'shout', { eyes: 'angry' });
  POST.push(() => { const h = hp(me); show(MEGA, h.x + .1, h.y + .3, h.z + 1.4, 0, 1.4); }); bubble(me, 'WIR SIND KEINE GOOD BOYS!', clamp((L.lt - .05) / .1), 1.2);
  onFace(me, 6.2, -.2, -.6, 44, L.k, 5.6); sh(V(-6, 0, -40), 20); }, [[0, 'shout_m', .35], [.3, 'wind_howl', .25]]);
// 116 «Dann, hinter mir,»: Svenja aparece detrás de las cajas, sin hacer ruido
shot(156.44, 'S', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aRx: 1.0, aRe: 1.2, aLx: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'flat' }); inHand(MEGA, me, 'R', [0, -.5, .5], [0, 0, 0], 1.2);
  walkTo(sv, POD0.x + 2.6, POD0.z - 9, 0, 3.2, L, 0, 6); cara(sv, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smile' }); orb(L.k, V(POD0.x + 1.2, 4.4, POD0.z - 3), null, [24, .3, .08, 46], [21, .38, .06, 46]); sh(V(-6, 0, -44), 22); }, [[0, 'steps', .35], [.4, 'tension_str', .35]]);
// 117 «ganz leise:»: Svenja, junto a las cajas, se acerca en susurro
shot(157.51, 'I', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); cara(me, L.T, { expr: 'neutral' }); put(sv, POD0.x + 2.4, 0, POD0.z - 2.6, -.5); actuar(sv, 0, [[0, { aRx: 2.1, aRz: -.3, aRe: 2.3, aLx: .3, headX: -.25 }]], { T: L.T }); cara(sv, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smile' });
  onFace(sv, 5.4, -.2, .3, 42, L.k, 4.8); sh(V(-6, 0, -44), 18); }, [[0, 'whisper', .45]]);
// 118 «Schatz?»
shot(158.57, 'C', null, L => { town(L); put(sv, POD0.x + 2.4, 0, POD0.z - 2.6, -.5); actuar(sv, 0, [[0, { aLx: .3, aRx: .3, headX: -.3, headZ: .15 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'o', eyes: 'happy' }); bubble(sv, 'Schatz?', clamp(L.lt / .08), 1.2);
  onFace(sv, 5.2, -.2, -.2, 42, L.k, 4.8); sh(V(-6, 0, -44), 18); }, [[0, 'pling', .45]]);
// 119 «Ja, Schatz?»: Lukas se gira al instante, obediente
shot(159.12, 'W', null, L => { town(L); const t = easeOut(clamp(L.lt / .2)); put(me, POD0.x, POD0.y, POD0.z, lerp(0, -2.4, t)); actuar(me, 0, [[0, { aLx: .4, aRx: .4, aLz: -.2, aRz: -.2, headX: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile', blush: 1 }); WOLF.visible = false; bubble(me, 'Ja, Schatz?', clamp(L.lt / .08), 1.2);
  onFace(me, 5.4, -.1, 0, 42, L.k, 5.0); sh(V(-6, 0, -44), 18); }, [[0, 'whoosh_soft', .3]]);
// 120 «Pfötchen.»: abajo, de rodillas, Lukas le da la pata a Svenja
shot(159.56, 'S', null, L => { town(L); const p = V(POD0.x + 3.2, 0, POD0.z + 3.2); put(sv, p.x + 1.6, 0, p.z - 3.4, -.45); actuar(sv, 0, [[0, { aRx: 1.2, aRe: .3, aRz: .15, aLx: .3, headX: .3 }]], { T: L.T }); talk(sv, L.T, 159.56, 160.3, 'happy');
  put(me, p.x, 0, p.z, PI - .45); actuar(me, 0, [[0, PFOTE({ headX: -.35 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); bubble(sv, 'Pfötchen.', clamp(L.lt / .08), 1.2);
  orb(L.k, V(p.x + .8, 3.2, p.z - 1.7), null, [12, 1.25, .12, 46], [10.8, 1.15, .1, 46]); sh(p, 16); }, [[0, 'cloth', .4], [.3, 'pop', .35]]);
// 121 «Good Boy.»: Svenja le acaricia la cabeza; Lukas, feliz con su collar; fin
shot(160.39, 'Z', null, L => { town(L); const p = V(POD0.x + 3.2, 0, POD0.z + 3.2); put(sv, p.x + .4, 0, p.z - 3.0, -.1); actuar(sv, 0, [[0, { aRx: 1.25, aRe: .55, aRz: -.1, aLx: .3, lean: .25, headX: .35 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  put(me, p.x, 0, p.z, PI - .1); actuar(me, 0, [[0, SITZ({ headX: -.4, headZ: Math.sin(L.T * 10) * .08 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'closed', mouth: 'open_smile', blush: 1 }); hearts(hp(me).add(V(0, 1.6, 0)), L.T);
  bubble(sv, 'Good Boy.', clamp(L.lt / .08), 1.4); orb(L.k, V(p.x + .2, 3.4, p.z - 1.4), null, [12, -.15, .12, 44], [10.6, -.25, .1, 44]); sh(p, 16); }, [[0, 'sparkle', .45], [.3, 'bark', .2]]);
