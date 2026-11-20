// ---------- c: los diez jugones, el entrenamiento, el partido hasta el 0:4 (57,05 – 84,55 s) ----------
const lineup = (L, list, z = 0, ry = 0, x0 = SX) => list.forEach((c, i) => { put(c, x0 - (list.length - 1) * 1.6 + i * 3.2, 0, z - (i % 2) * .8, ry); });
// 57 «Also nahm er»: el alcalde entra en la Zockerhalle y señala a los jugones
shot(57.05, 'W', null, L => { halle(); VMODE = 'game'; hallCrowd(L, 14, [1, 4]); const m = put(mayor, ZX + 2, 0, 8, .7); actuar(m, L.lt, [[0, 'point', { dur: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'flat' });
  orb(L.k, V(ZX + 1, 4, 4), null, [16, .5, .12, 48], [14, .35, .1, 48]); sh(V(ZX, 0, 0), 30); }, [[0, 'swipe', .4], [.2, 'crowd_murmur', .4]]);
// 58 «die zehn besten Zocker der Stadt.»: los diez, en fila, cada uno con su mando; el 10 encima
shot(57.89, 'Z', null, L => { stadium(); TEAM.forEach((c, i) => { padStand(c, SX - 14.4 + i * 3.2, 0 - (i % 2) * .8, 0, L.T, i, 14 + i, i % 2 ? 'joy' : 'determined'); });
  orb(L.k, V(SX, 3.4, 0), null, [26, .08, .12, 50], [22, -.04, .1, 50]); badge('gold', '10', W / 2, H * .17, clamp(L.lt / .2), 1, 1.1); sh(V(SX, 0, 0), 40); }, [[0, 'swoosh', .4], [.1, 'pop', .5], [.4, 'button_mash', .4]]);
// 59 «Und mich.»: entro en la fila con el balón; todos me miran
shot(59.49, 'C', 'punch', L => { stadium(); TEAM.slice(3, 7).forEach((c, i) => { padStand(c, SX - 6 + i * 3.4 + (i > 1 ? 3 : 0), -1, -.2 * (i - 1.5), L.T, i, 14 + i, 'shock'); }); const me = put(ich, SX + .2, 0, 1, 0); ballUnder(me); cara(me, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
  onFace(me, 9.4, -.3, .3, 42, L.k, 8.4); sh(V(SX, 0, 0), 30); }, [[0, 'impact', .6]]);
// 60 «Sechs Tage Training.»: el campo de la iglesia, conos; yo con el silbato; el 6 en el calendario
shot(59.91, 'W', null, L => { kirch(); const me = put(ich, KX + 4, 0, 14, .9); actuar(me, 0, [[0, { aRx: 1.9, aRz: -.3, aRe: 2.2, aLz: .3 }]], { T: L.T }); const w = me.aR.hand.getWorldPosition(V()); show(WHISTLE, w.x, w.y + .2, w.z, 0, 1); cara(me, L.T, { expr: 'determined', mouth: 'o' });
  TEAM.slice(0, 6).forEach((c, i) => { put(c, KX - 1.4 + (i % 2) * 2.8, 0, 10 - i * 2.4, .4); applyPose(c, walkP(L.T, i)); cara(c, L.T + i, { expr: 'worried', mouth: 'frown' }); });
  orb(L.k, V(KX + 1, 3.4, 8), null, [20, .75, .16, 48], [17, .6, .14, 48]); badge('gold', '6 Tage', W / 2, H * .16, clamp(L.lt / .2), 1, .85); sh(V(KX, 0, 6), 30); }, [[0, 'swipe', .4], [.15, 'whistle', .7], [.5, 'footsteps', .4]]);
// 61 «Ich ließ sie rennen.»: travelling lateral: los jugones corren jadeando entre los conos
shot(61.38, 'S', null, L => { kirch(); const z0 = 12 - L.lt * 8; TEAM.slice(0, 5).forEach((c, i) => { put(c, KX - 3 + i * 1.6, 0, z0 + i * 1.8, PI); applyPose(c, runP(L.T, i * 1.3, 10)); cara(c, L.T + i, { expr: 'sad', eyes: 'closed', mouth: 'ah' }); if (i === 1) sweat(c, L.T, 2); });
  cam([KX + 7, 3.6, z0 - 9], [KX, 2.6, z0 + 3], 46); sh(V(KX, 0, z0), 30); }, [[0, 'swipe', .4], [.1, 'footsteps', .6], [.5, 'panting', .5]]);
// 62 «Sie fragten,»: Malte se para, agotado, y pregunta…
shot(62.44, 'C', null, L => { kirch(); const m = put(malte, KX, 0, 4, .3); applyPose(m, { lean: .35, aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: .4, aRe: .4, crouch: .2, headX: -.2 }); talk(m, L.T, 62.44, 63.94, 'worried'); sweat(m, L.T, 2);
  onFace(m, 7.4, 0, .5, 40, L.k, 6.6); sh(V(KX, 0, 4), 30); }, [[0, 'thump', .4], [.1, 'panting', .5]]);
// 63 «wo die Sprinttaste ist.»: bocadillo: «Wo ist die Sprinttaste?»; Bernd se busca botones en la camiseta
shot(63.08, 'W', null, L => { kirch(); const m = put(malte, KX - 1.6, 0, 4, .3); applyPose(m, { lean: .3, aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: .4, aRe: .4, crouch: .2 }); cara(m, L.T, { expr: 'confused', mouth: 'o' });
  const b = put(bernd, KX + 2, 0, 3.4, -.3); applyPose(b, { aLx: .7, aRx: .7, aLz: -.6, aRz: -.6, aLe: 1.6, aRe: 1.6, headX: .5 + Math.sin(L.T * 9) * .1 }); cara(b, L.T, { expr: 'confused', mouth: 'o' });
  bubble(m, 'Wo ist die Sprinttaste?', clamp(L.lt / .2)); orb(L.k, V(KX, 3.4, 3.6), null, [13, .1, .1, 46], [11.5, -.05, .08, 46]); sh(V(KX, 0, 4), 30); }, [[0, 'swipe', .4], [.1, 'pop', .5], [.6, 'button_mash', .3]]);
// 64–67 HUSS ×9: les enseño cómo se hace; los jugones boquiabiertos
const hTeam = (L, n) => TEAM.slice(0, n).forEach((c, i) => { put(c, KX - 7 + i * 3.5, 0, -4 - (i % 2) * 1.2, .35 - i * .14); applyPose(c, GEST.shock); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); });
shot(64.10, 'W', null, L => { kirch(); hTeam(L, 5); const me = put(ich, KX, 0, 3, PI * 0 + .1); trick(me, BALL, L.T, tsH(64, 66.6), ['roll', 'elastico', 'up', 'knee', 'rainbow', 'up', 'step', 'up', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(KX, 2.4, 1), null, [13, .1, .1, 46], [12, .35, .1, 46]); sh(V(KX, 0, 0), 30); }, [[0, 'swipe', .4]]);
shot(64.66, null, null, L => { kirch(); hTeam(L, 5); const me = put(ich, KX, 0, 3, .1); trick(me, BALL, L.T, tsH(64, 66.6), ['roll', 'elastico', 'up', 'knee', 'rainbow', 'up', 'step', 'up', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  orb(L.k, V(KX, 2.2, 3), null, [9.6, -1.3, .12, 44], [9, -1.15, .1, 44]); sh(V(KX, 0, 0), 30); });
shot(65.18, 'C', null, L => { kirch(); hTeam(L, 5); const me = put(ich, KX, 0, 3, .1); trick(me, BALL, L.T, tsH(64, 66.6), ['roll', 'elastico', 'up', 'knee', 'rainbow', 'up', 'step', 'up', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  cam([KX + .6, 10.4 - L.k, 5.2], [KX, 1, 3.4], 46); sh(V(KX, 0, 0), 30); });
shot(65.70, null, null, L => { kirch(); hTeam(L, 5); const me = put(ich, KX, 0, 3, .1); trick(me, BALL, L.T, tsH(64, 66.6), ['roll', 'elastico', 'up', 'knee', 'rainbow', 'up', 'step', 'up', 'up'], { end: true }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  onFace(me, 7.4, -.5, -.5, 40, L.k, 6.6); sh(V(KX, 0, 0), 30); });
// 68 «Spieltag.»: el estadio desde el aire, lleno, pancarta HUFENBACH – KICKELSDORF
shot(66.72, 'Z', 'punch', L => { stadium(); tribune(L, -6, 36, 4, 'cheer'); const k = easeInOut(L.k); cam([SX + 34 - k * 6, 30 - k * 6, 50 - k * 8], [SX - 12, 4, -10], 52); sh(V(SX, 0, 0), 60); }, [[0, 'whistle', .5], [.1, 'crowd_cheer', .7], [.4, 'firework', .4]]);
// 69 «Die ganze Stadt auf der Tribüne.»: la grada llena animando (yo en el campo, de espaldas a ellos)
shot(67.48, 'W', null, L => { stadium(); tribune(L, 4, 36, 4, 'cheer'); orb(L.k, V(SX - 28, 5.2, 4), null, [26, 1.25, .12, 48], [22, 1.05, .1, 48]); sh(V(SX - 26, 0, 4), 40); }, [[0, 'swipe', .4], [.1, 'crowd_cheer', .7], [.8, 'air_horn', .4]]);
// 70 «Tribüne.»: primer plano de la abuela en la grada… no: Bernd y el alcalde animando entre los vecinos
shot(68.18, 'C', null, L => { stadium(); tribune(L, 0, 16, 2, 'cheer'); const m = put(mayor, SX - 24, 1.6, 1.2, PI / 2); applyPose(m, cheerP(L.T)); laughF(m, L.T); orb(L.k, V(SX - 24, 5, 1.2), null, [11, PI / 2 + .25, .1, 44], [9.6, PI / 2 + .1, .1, 44]); sh(V(SX - 24, 0, 0), 30); }, [[0, 'thump', .4], [.2, 'crowd_cheer', .5]]);
// 71 «Die Gegner lachten uns aus:»: el equipo azul se parte de risa señalándonos
shot(69.11, 'W', null, L => { stadium(); [kap, ...OPP.slice(0, 5)].forEach((c, i) => { put(c, SX - 7.5 + i * 3, 0, -6 - (i % 2), 0); applyPose(c, { aLx: .6, aRx: i % 2 ? 1.5 : .6, aLz: -.3, aRz: -.1, aLe: 1.6, aRe: .1, lean: .25 + Math.abs(Math.sin(L.T * 12 + i)) * .1 }); laughF(c, L.T + i); });
  orb(L.k, V(SX, 3.6, -6.5), null, [16, .1, .1, 48], [13.5, -.05, .08, 46]); sh(V(SX, 0, -6), 30); }, [[0, 'swipe', .4], [.1, 'laugh_group', .7]]);
// 72 «„Ist das eine Mannschaft»: el capitán, burlón
shot(70.56, 'C', 'punch', L => { stadium(); const c = put(kap, SX, 0, -6, 0); actuar(c, 0, [[0, 'point']], { T: L.T }); talk(c, L.T, 70.56, 72.44, 'smug'); onFace(c, 7.6, .2, .6, 40, L.k, 6.6); sh(V(SX, 0, -6), 30); }, [[0, 'impact', .4]]);
// 73 «oder ein Wartezimmer?“»: nuestro equipo sentado en el banquillo, cada uno con su mando
shot(71.46, 'W', null, L => { stadium(); TEAM.slice(0, 8).forEach((c, i) => gamer(c, SX + 22 + 0, 0, -9 + i * 2.6, -PI / 2, L.T, i, 14 + i, ['determined', 'joy', 'laugh', 'determined'][i % 4]));
  orb(L.k, V(SX + 22, 3, 0), null, [16, -1.1, .12, 46], [14, -1.3, .1, 46]); badge('tag', 'WARTEZIMMER', W / 2, H * .18, clamp(L.lt / .2)); sh(V(SX + 22, 0, 0), 30); }, [[0, 'swipe', .4], [.2, 'button_mash', .5], [.6, 'laugh_group', .4]]);
// 74 «Anpfiff.»: el silbato; el balón en el centro y yo delante
shot(72.69, 'F', 'punch', L => { stadium(); const me = put(ich, SX, 0, -1.4, 0); applyPose(me, { crouch: .2, lean: .2, aLz: .4, aRz: .4 }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); show(BALL, SX, .55, 0);
  put(kap, SX + 1.5, 0, -6, 0); applyPose(kap, { crouch: .2, lean: .2 }); cara(kap, L.T, { expr: 'smug' }); cam([SX + 2.4, 2, 7 - L.k], [SX, 2.2, -1], 44); sh(V(SX, 0, 0), 30); }, [[0, 'whistle', .9], [.1, 'crowd_cheer', .5]]);
// 75 «Malte drückte X.»: Malte en el campo pulsando la X del mando; el balón le pasa por delante
shot(73.34, 'W', null, L => { stadium(); const m = padStand(malte, SX + 2, 6, -.3, L.T, 0, 0, 'determined'); cara(m, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); const bx = lerp(SX - 6, SX + 10, L.k); show(BALL, bx, .55, 8); BALL.rotation.set(0, 0, -L.T * 10);
  orb(L.k, V(SX + 2, 3.6, 6), null, [10, .1, .1, 44], [9, -.1, .1, 44]); badge('big', 'X', W / 2, H * .17, clamp(L.lt / .15), 1, 1); sh(V(SX + 2, 0, 6), 30); }, [[0, 'swipe', .4], [.1, 'button_click', .7], [.4, 'ball_roll', .4]]);
// 76 «Oma drückte Pause.»: la abuela pulsa pausa… y se queda congelada en el campo
shot(74.36, 'Z', null, L => { stadium(); const o = padStand(oma, SX - 3, 10, .3, L.T, 0, 2, 'determined'); cara(o, L.T, { expr: 'smug', mouth: 'smirk' }); const p = put(OPP[2], SX - 6, 0, 13, .9); applyPose(p, runP(L.T, 0)); cara(p, L.T, { expr: 'happy' });
  show(BALL, SX - 4.6, .55, 13.6); orb(L.k, V(SX - 4, 3.4, 11), null, [12, .3, .1, 46], [10.5, .15, .1, 46]); badge('tag', '❚❚ PAUSE', W / 2, H * .17, clamp((L.T - 74.92) / .15)); sh(V(SX - 4, 0, 11), 30); }, [[0, 'swoosh', .4], [.55, 'pause_beep', .7]]);
// 77 «Der Bäcker fragte, wo man respawnt.»: Bernd tirado en el césped; bocadillo «Respawn?»
shot(75.52, 'W', null, L => { stadium(); const b = put(bernd, SX + 4, .9, 4, 0); b.root.rotation.set(-PI / 2 + .1, .3, 0); applyPose(b, { aLz: 1.2, aRz: 1.2, lLx: .2 }); cara(b, L.T, { expr: 'confused', eyes: 'closed', mouth: 'o' });
  const p = put(OPP[1], SX + 7, 0, 2, -1.2); applyPose(p, runP(L.T, 1)); cara(p, L.T, { expr: 'happy' }); show(BALL, SX + 6.2, .55, 2.6);
  bubble(b, 'Wo respawnt man?', clamp((L.lt - .2) / .2), .4); orb(L.k, V(SX + 4.6, 2, 4), null, [11, .4, .4, 46], [9.6, .25, .36, 46]); sh(V(SX + 4, 0, 4), 30); }, [[0, 'swipe', .4], [.05, 'body_fall', .6], [.3, 'pop', .4]]);
// 78 «Unser Torwart wollte den Bus der Gegner klauen.»: nuestra portera se cuela por la puerta del autobús azul
shot(77.24, 'S', null, L => { stadium(); show(BUS, SX + 30, 0, -14, 0); BUS.userData.door.position.x = 2.53 + Math.min(1, L.lt * 3) * .1; const t = put(tw, SX + 33.4 - Math.min(1, L.lt / 1.2) * .6, 0, -5.6, -PI / 2 + PI); GLV.forEach(g => g.visible = true);
  applyPose(t, walkP(L.T, 0)); t.root.rotation.y = -PI / 2; cara(t, L.T, { expr: 'sus', mouth: 'smirk' }); orb(L.k, V(SX + 32, 4, -6), null, [16, 1.5, .1, 48], [14, 1.3, .1, 48]); sh(V(SX + 30, 0, -10), 30); }, [[0, 'swipe', .4], [.3, 'door', .5], [.9, 'bus_engine', .6]]);
// 79 «klauen.»: el autobús arranca con ella al volante; los rivales corren detrás
shot(78.26, 'W', null, L => { stadium(); const z = -14 + L.lt * 14; show(BUS, SX + 30, 0, z, 0); put(tw, SX + 30, 2.2, z + 9.4, 0); GLV.forEach(g => g.visible = true); applyPose(tw, { aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4, lLx: 1.4, lRx: 1.4, lLk: 1.4, lRk: 1.4 }); laughF(tw, L.T);
  OPP.slice(3, 6).forEach((o, i) => { put(o, SX + 28 + i * 2, 0, z - 12 - i * 2, 0); applyPose(o, runP(L.T, i)); cara(o, L.T + i, { expr: 'angry', mouth: 'scream' }); });
  orb(L.k, V(SX + 30, 4, z), null, [26, .9, .15, 50], [24, .7, .12, 50]); sh(V(SX + 30, 0, z), 40); }, [[0, 'swipe', .4], [.1, 'tires', .6], [.5, 'horn', .5]]);
// 80 «Nach sieben Minuten»: el marcador gigante: 7'
shot(79.49, 'Z', null, L => { stadium(); ST.SB.userData.set(0, 4); tribune(L, -24, 16, 4, 'shock'); cam([SX + 4, 9, -26 + L.k * 2], [SX, 13, -52], 46); badge('tag', "7'", W / 2, H * .16, clamp(L.lt / .2)); sh(V(SX, 0, -40), 40); }, [[0, 'swoosh', .4], [.2, 'clock_tick', .5]]);
// 81 «stand es null zu vier.»: los azules celebran; 0 : 4
shot(80.53, 'C', 'punch', L => { stadium(); ST.SB.userData.set(0, 4); [kap, ...OPP.slice(0, 4)].forEach((c, i) => { put(c, SX - 6 + i * 3, Math.abs(Math.sin(L.T * 8 + i)) * .5, 20 - (i % 2), PI); applyPose(c, cheerP(L.T, i)); laughF(c, L.T + i); });
  orb(L.k, V(SX, 3.4, 20), null, [15, PI + .2, .1, 48], [13, PI + .05, .1, 46]); score(0, 4, clamp(L.lt / .2)); sh(V(SX, 0, 20), 30); }, [[0, 'impact', .6], [.1, 'crowd_boo', .5]]);
// 82 «Also nahm ich mir den Ball.» (zoom lento): piso el balón; mirada fija
shot(81.63, 'W', 'slow', L => { stadium(); const me = put(ich, SX, 0, 0, PI); applyPose(me, { lRx: -.4, lRk: .6, aLz: .3, aRz: .3, headX: .2 }); const w = loc(me, -.3, .55 / .84, 1.2); show(BALL, w.x, .55, w.z); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  onFace(me, 10, -.4, .3, 42, L.k, 7); sh(V(SX, 0, 0), 30); }, [[0, 'swipe', .4], [.3, 'heartbeat', .5]]);
// 83–86 HUSS ×6: regates a los azules (frontal, lateral, cenital, cara)
const dribOpp = (L, z0) => OPP.slice(0, 3).forEach((o, i) => { put(o, SX + (i - 1) * 2.8, 0, z0 + 4 + i * 2, PI * 0); applyPose(o, { crouch: .25, lean: .2, aLz: .7, aRz: .7, headX: .2 }); o.root.rotation.y = 0; cara(o, L.T + i, { expr: 'shock', mouth: 'o' }); });
shot(82.90, 'W', null, L => { stadium(); const me = put(ich, SX, 0, 2, 0); trick(me, BALL, L.T, tsH(82.8, 84.6), ['elastico', 'roll', 'step', 'rainbow', 'elastico', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); dribOpp(L, -4);
  orb(L.k, V(SX, 2.4, 1), null, [12, .25, .1, 46], [11, .45, .08, 46]); sh(V(SX, 0, 0), 30); }, [[0, 'swipe', .4]]);
shot(83.45, 'C', null, L => { stadium(); const me = put(ich, SX, 0, 2, 0); trick(me, BALL, L.T, tsH(82.8, 84.6), ['elastico', 'roll', 'step', 'rainbow', 'elastico', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); dribOpp(L, -4);
  orb(L.k, V(SX, 2.4, 2), null, [10, -1.3, .12, 46], [9.4, -1.1, .1, 46]); sh(V(SX, 0, 0), 30); });
shot(83.98, null, null, L => { stadium(); const me = put(ich, SX, 0, 2, 0); trick(me, BALL, L.T, tsH(82.8, 84.6), ['elastico', 'roll', 'step', 'rainbow', 'elastico', 'up'], { end: true }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  onFace(me, 7.2, -.2, 1.3, 40, L.k, 6.4); sh(V(SX, 0, 0), 30); });
