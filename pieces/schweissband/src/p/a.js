// ---------- a: gancho (todos hacen HUSS, la HUSS-WM), el premio, la regla de las tres derrotas (0 – 31 s) ----------
const hpC = (ch, dy = 0) => hp(ch).add(V(0, dy, 0));
const SIT = { crouch: 1.0, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 };

// 1 «In dieser Stadt husst einfach jeder.» (zoom lento): la calle mayor bajo la pancarta HUSS-WELTMEISTERSCHAFT; todo el pueblo viene corriendo
//   hacia la cámara botando balones; el de baloncesto, centrado, bota a toda velocidad
shot(0, 'C', 'slow', L => { town(); const z = 58 - 5 * L.lt; const b = put(bask, 26, 0, z, PI); dribble(b, BBALL, L.T, { run: true, f: 3.2, rs: 1.4 }); grin(b, L.T);
  runners(L.T, L.lt, 62, 14, 5, { sp: 5 }); BAN.userData.ring.rotation.y = L.T * 1.5;
  orbit(V(26, 4.2, z), lerp(21, 14, easeOut(L.k)), PI + .12, .1, 46); sh(V(26, 0, z), 40); }, [[0, 'crowd_run', .6], [.2, 'thud', .4], [.5, 'thud', .4], [.8, 'thud', .4], [1.2, 'cheer', .5]]);
// 2 HUSS ×3: el futbolista arranca en carrera con el balón pegado al pie y una estela; la gente se aparta
shot(th(1), 'C', 'punch', L => { town(); const z = 70 - 14 * L.lt; const f = put(fuss, 24, 0, z, PI); applyPose(f, runPoseL(L.T * 2.2)); effort(f, L.T);
  POST.push(() => { const p = loc(f, 0, .55, 1.4); show(BALL, p.x, .55, p.z).rotation.x = -L.T * 20; trailOn(BALL.position, L.T); }); folk(26, z - 6, 6, 5, 10, L.T, 9, { mode: 'shock' });
  hussPop(1, L.T); orbit(V(24, 3.5, z), lerp(13, 10, L.k), PI - .5, .12, 46); sh(V(24, 0, z), 30); }, [[0, 'whoosh', .6], [.2, 'kick', .5], [.45, 'kick', .5]]);
// 3 «Denn hier gibt es die HUSS-Weltmeisterschaft.»: grúa sobre el estadio lleno; la pancarta y el marcador «HUSS-WM»
shot(tw('Denn', 1), 'W', null, L => { stadium(); stands(L.T, 'cheer'); bText([['HUSS', .3, 150, '#ffd23f'], ['WELTMEISTERSCHAFT', .7, 74, '#ffffff']]);
  confRain(V(STX - 20, 2, -10), L.T, 50, 30, 40, 22); cm([STX + 30, 10, 32, STX - 8, 12, -20, 52], [STX + 26, 24, 26, STX - 6, 14, -26, 52], L.k); sh(V(STX - 10, 0, -10), 60); }, [[0, 'cheer', .7], [.4, 'firework', .5], [1.0, 'confetti', .4]]);
// 4 HUSS ×3 en el estadio: la grada entera salta con cada HUSS; el marcador parpadea
shot(th(2), 'C', 'punch', L => { stadium(); stands(L.T * 1.4, 'cheer'); const f = Math.floor(hk(2, L.T)) % 2; bText([['HUSS!', .5, 230, f ? '#ffffff' : '#ffd23f']]); hussPop(2, L.T);
  cm([STX + 6, 6, 4, STX - 34, 8, -6, 46], [STX + 4, 7, 2, STX - 34, 8, -10, 44], L.k); sh(V(STX - 30, 0, -6), 40); }, [[0, 'cheer', .6], [.2, 'firework', .4]]);
// 5 «Die Fußballer:» el futbolista en la plaza hace toques delante de la portería
shot(tw('Die', 1), 'S', null, L => { town(); const f = put(fuss, -25, 0, -56, 0); const up = Math.abs(Math.sin(L.T * 5)); actuar(f, L.lt, [[0, { lRx: -up * 1.1, lRk: .3, aLz: .3, aRz: .3 }]], { T: L.T }); grin(f, L.T);
  show(BALL, -24.6, 1 + up * 2.6, -54.6).rotation.x = L.T * 6; folk(-25, -56, 6, 7, 14, L.T, 3);
  orbit(V(-25, 3.6, -56), lerp(14, 12, L.k), .3 - L.k * .3, .1, 44); sh(V(-25, 0, -60), 30); }, [[0, 'kick', .4], [.4, 'kick', .4], [.8, 'kick', .4]]);
// 6 HUSS ×3: regate relámpago y tiro: el balón entra en la portería y la red se infla
shot(th(3), 'C', 'punch', L => { town(); const k = hk(3, L.T); const f = put(fuss, -25 + Math.sin(L.T * 22) * .8, 0, -50 - k * 2, PI); applyPose(f, runPoseL(L.T * 2.6)); effort(f, L.T);
  const sh_ = clamp((k - 2.2) / .6); POST.push(() => { const p0 = loc(f, 0, .55, 1.3); const p = p0.clone().lerp(V(-25, 2.6, -65), sh_); show(BALL, p.x, p.y, p.z).rotation.x = L.T * 20; trailOn(BALL.position, L.T); }); hussPop(3, L.T);
  orbit(V(-25, 3.2, -55), lerp(15, 12, L.k), .15, .12, 46); sh(V(-25, 0, -58), 30); }, [[0, 'whoosh', .5], [.25, 'whoosh', .4], [.5, 'kick', .7], [.62, 'splash', .2]]);
// 7 «Die Basketballer:» bajo la canasta de la plaza, bota tranquilo y guiña
shot(tw('Die', 2), 'W', null, L => { town(); const b = put(bask, -34, 0, -42, 0); dribble(b, BBALL, L.T, { f: 2.2 }); grin(b, L.T); folk(-34, -42, 5, 7, 14, L.T, 6);
  orbit(V(-34, 5, -42), lerp(15, 13, L.k), -.3 + L.k * .3, .12, 46); sh(V(-34, 0, -44), 30); }, [[0, 'thud', .4], [.45, 'thud', .4], [.9, 'thud', .4]]);
// 8 HUSS ×3: botes entre las piernas a toda velocidad y mate en la canasta
shot(th(4), 'C', 'punch', L => { town(); const k = hk(4, L.T); const b = put(bask, -34, 0, -42 - clamp((k - 2) / .8) * 4, PI); const jump = clamp((k - 2) / .8);
  if (jump <= 0) dribble(b, BBALL, L.T, { f: 7, trail: 5, extra: { crouch: .45 } }); else { saltar(b, L.lt, L.lt - jump * .5, { h: 4, dur: .8 }); applyPose(b, { aRx: 3, aLx: 2.7, aRe: .2, aLe: .2 }); POST.push(() => { const h = wpos(b.aR.hand); show(BBALL, h.x, h.y + .5, h.z); }); }
  effort(b, L.T); hussPop(4, L.T); orbit(V(-34, 6, -44), lerp(12, 10, L.k), PI - .3, .1, 46); sh(V(-34, 0, -44), 30); }, [[0, 'thud', .5], [.2, 'thud', .5], [.4, 'thud', .5], [.6, 'jump', .4], [.75, 'clack', .6]]);
// 9 «Sogar der Würstchenmann:» en su Wurstwagen, gira salchichas en la plancha con las pinzas
shot(tw('Sogar', 1), 'S', null, L => { town(); const w = put(wm, -40.5, 0, 12, PI / 2); actuar(w, L.lt, [[0, { aRx: 1.2, aRe: 1.2 + Math.sin(L.T * 10) * .4, aLx: .9, aLe: 1.3 }]], { T: L.T }); grin(w, L.T);
  attach(WURST, w.aR.hand, [0, -.8, .4], [0, 0, 0], .8); folk(-34, 12, 5, 6, 12, L.T, 8); orbit(V(-40.5, 5.5, 12), lerp(17, 14, L.k), PI / 2 + .35 - L.k * .3, .08, 46); sh(V(-40, 0, 12), 30); }, [[0, 'pan_sizzle', .6], [.6, 'clack', .3]]);
// 10 HUSS ×3: el Würstchenmann lanza salchichas a toda velocidad, que vuelan en arco a los panecillos de los clientes
shot(th(5), 'C', 'punch', L => { town(); const w = put(wm, -40.5, 0, 12, PI / 2); actuar(w, L.lt, [[0, { aRx: 1.6 + Math.sin(L.T * 30) * .7, aRe: .6, aLx: 1.2, aLe: .8 }]], { T: L.T }); effort(w, L.T);
  [XT[1], K[2], K[5]].forEach((c, i) => { put(c, -34, 0, [4, 19, 22][i], -PI / 2 - .3 + i * .3); actuar(c, L.lt, [[0, 'hold']], { T: L.T + i }); grin(c, L.T + i); });
  const k = (hk(5, L.T) % 1); const p = arc(V(-39, 6, 12), V(-34.8, 4.4, [4, 19, 22][Math.floor(hk(5, L.T)) % 3]), 2, k); show(WURST, p.x, p.y, p.z).rotation.z = L.T * 12; trailOn(WURST.position, L.T, 4); hussPop(5, L.T);
  orbit(V(-37, 5, 12), lerp(19, 16, L.k), PI / 2 + .15, .12, 46); sh(V(-37, 0, 12), 30); }, [[0, 'whoosh', .4], [.22, 'whoosh', .4], [.4, 'whoosh', .4], [.6, 'cheer', .3]]);
// 11 «Und Oma Hilde, siebzigfache Meisterin:» en el banco bajo su cartel «70× MEISTERIN», tejiendo; sus 70 medallas
shot(tw('Und', 1), 'Z', null, L => { town(); use('HB'); const o = put(oma, 12, .55, -14.2, 0); actuar(o, L.lt, [[0, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.1 + Math.sin(L.T * 8) * .2, aRe: 1.1 - Math.sin(L.T * 8) * .2, aLz: -.25, aRz: -.25 }]], { T: L.T }); talk(o, L.T, 0, 0, 'smile');
  POST.push(() => { const h = wpos(o.aR.hand), g = wpos(o.aL.hand); show(NEED, (h.x + g.x) / 2, (h.y + g.y) / 2 + .3, (h.z + g.z) / 2 + .3); show(YARN, 14.4, .7, -12.6); });
  badge('gold', '70×', W / 2, H * .2, (L.lt - .9) * 4, 1, 1.1); folk(12, -12, 5, 10, 16, L.T, 12, { mode: 'cheer' });
  orbit(V(12, 4.6, -14.2), lerp(16, 12, L.k), .25 - L.k * .2, .12, 46); sh(V(12, 0, -14), 30); }, [[0, 'pop', .4], [.9, 'magic_hit', .5], [1.4, 'cheer', .4]]);
// 12 HUSS ×3: Oma teje a velocidad imposible: la bufanda roja sale disparada y cae en espiral
shot(th(6), 'C', 'punch', L => { town(); const o = put(oma, 12, .55, -14.2, 0); actuar(o, L.lt, [[0, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.1 + Math.sin(L.T * 40) * .35, aRe: 1.1 - Math.sin(L.T * 40) * .35, aLz: -.25, aRz: -.25 }]], { T: L.T }); effort(o, L.T);
  POST.push(() => { const h = wpos(o.aR.hand); show(NEED, h.x - .6, h.y + .3, h.z + .3); }); PULLIS.slice(0, 6).forEach((p, i) => { const k = clamp(hk(6, L.T) / 3 - i * .1); if (k <= 0) return; show(p, 12 + (i % 2 ? 1 : -1) * (3 + i * .5), 4 + k * 4 - k * k * 5, -13 + k * 2, i, .4).rotation.z = i + L.T * 3; });
  hussPop(6, L.T); orbit(V(12, 4, -14.2), lerp(12, 10, L.k), -.2, .1, 46); sh(V(12, 0, -14), 30); }, [[0, 'zip', .5], [.22, 'zip', .5], [.4, 'zip', .5], [.6, 'gasp', .3]]);
// 13 «Einmal im Jahr kommt die ganze Welt in unsere Stadt.» (grúa): por la calle mayor llegan cientos con banderas de todos los colores
shot(tw('Einmal', 1), 'W', null, L => { town(); runners(L.T, L.lt, 20, 16, 21, { sp: 3.5, flags: true, cheer: true, gap: 2.4 }); badge('gold', '1× IM JAHR', W / 2, H * .17, (L.lt - .1) * 4, 1, .8); BAN.userData.ring.rotation.y = L.T * 1.5;
  cm([26, 30, -8, 26, 6, 40, 48], [26, 18, 2, 26, 7, 46, 46], L.k); sh(V(26, 0, 30), 50); }, [[0, 'crowd_run', .6], [.5, 'cheer', .5], [1.5, 'party_horn', .4]]);
// 14 «Der Preis?» el estadio a oscuras; un foco se enciende sobre el pedestal
shot(tw('Der', 1), 'F', null, L => { stadium('night'); stands(L.T, 'still', true); PED.userData.band.rotation.y = L.T; GLOW.intensity = 60 * clamp(L.lt * 3); GLOW.position.set(STX, 12, -14); DARK = .25;
  orbit(V(STX, 5.5, -18), lerp(16, 13, L.k), .4, .12, 44); sh(V(STX, 0, -18), 20); }, [[0, 'switch', .6], [.1, 'hum_low', .4]]);
// 15 «Das goldene Schweißband.» (zoom lento): la muñequera dorada gira sobre el pedestal, destellos
shot(tw('Das', 1), 'Z', 'slow', L => { stadium('night'); stands(L.T, 'still', true); const B = PED.userData.band; B.rotation.y = L.T * 1.2; GLOW.intensity = 70; GLOW.position.set(STX, 12, -12); DARK = .15;
  sparks(V(STX, 6, -18), 0, (L.lt * 1.3) % .9, 10, .5); const p = V(STX, 5.6, -18); orbit(p, lerp(9, 4.5, easeInOut(L.k)), .2, .15, 42); sh(V(STX, 0, -18), 20); }, [[0, 'sparkle', .6], [.4, 'choir', .5]]);
// 16 «Und wer verliert, muss auf die Verliererparty.» el salón gris: guirnaldas tristes, gente con gorros de fiesta y cara larga
shot(tw('Und', 2), 'W', null, L => { use('SA'); inside(.8, 30); grade.uniforms.sat.value = .9; const g = [K[0], XT[0], K[3], XT[4], K[6]]; g.forEach((c, i) => { put(c, SAX - 8 + i * 4, 0, 4 + (i % 2) * 2, Math.sin(i) * .3); hat(c); actuar(c, L.lt, [[0, i % 2 ? 'slump' : 'cross']], { T: L.T + i }); cara(c, L.T + i, { expr: 'sad' }); });
  badge('tag', 'VERLIERER', W / 2, H * .17, (L.lt - .3) * 4, 1, 1); orbit(V(SAX, 5, 5), lerp(22, 18, L.k), -.2 + L.k * .3, .1, 46); sh(V(SAX, 0, 5), 30); }, [[0, 'sad_tone', .5], [.6, 'party_horn', .25], [1.2, 'sigh', .4]]);
// 17 «Drei Stunden Blockflötenmusik.» tres flautistas desafinan; los invitados se tapan los oídos; reloj «3 STUNDEN»
shot(tw('Drei', 1), 'C', 'punch', L => { use('SA'); inside(.8, 30); grade.uniforms.sat.value = 1.0; [K[1], K[4], XT[5]].forEach((c, i) => { put(c, SAX - 4 + i * 4, 0, 4, 0); actuar(c, L.lt, [[0, { aRx: 1.5, aLx: 1.4, aRe: 1.4, aLe: 1.5, headX: .1 + Math.sin(L.T * 6 + i) * .08 }]], { T: L.T }); cara(c, L.T + i, { expr: 'happy', mouth: 'o' });
    POST.push(() => { const h = wpos(c.aR.hand); const f = show(FLOETEN[i], h.x, h.y + .6, h.z + .9); f.rotation.x = 1.2; }); }); notes(V(SAX, 8, 4), L.T);
  [K[0], XT[0]].forEach((c, i) => { put(c, SAX - 8.5 + i * 17, 0, 7, i ? -.6 : .6); actuar(c, L.lt, [[0, 'hands_head']], { T: L.T + i }); cara(c, L.T, { expr: 'angry', mouth: 'grimace' }); });
  badge('red', '3 STUNDEN', W / 2, H * .17, (L.lt - .2) * 4, 1, .9); orbit(V(SAX, 5, 5), lerp(19, 16, L.k), .1, .08, 46); sh(V(SAX, 0, 5), 30); }, [[0, 'whistle_inno', .5], [.5, 'whistle_inno', .4], [1.0, 'sigh', .4]]);
// 18 «Aber es gibt eine Regel:» el alcalde, serio, desenrolla un pergamino en la escalinata del Rathaus
shot(tw('Aber', 1), 'F', null, L => { town(); const m = put(XT[3], -6, 0, -70, 0); actuar(m, L.lt, [[0, 'hold'], [.4, { aRx: 2.4, aRe: .3, aLx: 1.2, aLe: 1.0 }, { dur: .4 }]], { T: L.T }); talk(m, L.T, 0, 0, 'determined'); folk(-6, -66, 8, 6, 14, L.T, 14, { face: V(-6, 0, -70) });
  badge('tag', 'REGEL', W / 2, H * .18, (L.lt - .3) * 4, 1, 1.1); orbit(V(-6, 5, -70), lerp(16, 12, L.k), .1, .1, 44); sh(V(-6, 0, -70), 30); }, [[0, 'paper', .6], [.4, 'drone', .4]]);
// 19 «Verliert unsere Stadt dreimal hintereinander,» el marcador: HUFENBACH y tres cruces rojas que caen una a una
shot(tw('Verliert', 1), 'S', null, L => { stadium(); stands(L.T, 'still', true); const n = Math.min(3, Math.floor(L.lt / .45) + 1);
  board('x' + n, (c, w, h) => { txt2(c, 'HUFENBACH', w / 2, h * .22, 80, '#ffffff'); for (let i = 0; i < 3; i++) txt2(c, i < n ? '✗' : '·', w * (.25 + i * .25), h * .65, 190, i < n ? '#ff3a3a' : '#3a3a48'); });
  badge('red', '3×', W / 2, H * .62, (L.lt - 1.2) * 4, 1, 1.2); cm([STX, 18, -14, STX, 20, -47, 44], [STX, 19, -20, STX, 20, -47, 44], L.k); sh(V(STX, 0, -30), 30); }, [[0, 'buzzer', .5], [.45, 'buzzer', .5], [.9, 'buzzer', .5]]);
// 20 «zieht die Meisterschaft für immer in die Großstadt.» la muñequera sale volando de Hufenbach hacia los rascacielos del horizonte
shot(tw('zieht', 1), 'W', null, L => { town(); const p = arc(V(-6, 9, -32), V(-60, 30, -400), 30, easeIn(L.k) * .7); const B = show(BANDF, p.x, p.y, p.z, 0, 3.2); B.rotation.set(L.T * 3, L.T, 0); trailOn(B.position, L.T, 5);
  folk(-6, -30, 8, 4, 12, L.T, 15, { mode: 'shock', face: V(-30, 20, -300) }); cm([-2, 8, -18, -6, 9, -36, 46], [-4, 12, -26, -40, 24, -340, 44], L.k); sh(V(-6, 0, -30), 40); }, [[0, 'whoosh_up', .6], [.6, 'gasp', .5], [1.5, 'sad_tone', .4]]);
// 21 «Und wir hatten schon zweimal verloren.» el marcador: ✗ ✗ y el tercero vacío; la gente del pueblo cabizbaja
shot(tw('Und', 3), 'C', null, L => { town(); folk(-6, -24, 10, 2, 9, L.T, 17, { mode: 'sad' }); badge('red', '✗ ✗', W / 2, H * .18, (L.lt - .1) * 4, 1, 1.2); badge('gold', '2×', W / 2, H * .3, (L.lt - .9) * 4, 1, .9);
  orbit(V(-6, 4.5, -26), lerp(19, 16, L.k), .15, .1, 46); sh(V(-6, 0, -24), 40); }, [[0, 'sad_tone', .5], [.3, 'sigh', .4], [.9, 'pop', .4]]);
