// ---------- a: gancho, la regla y los deseos de los jóvenes (0 – 26,4 s) ----------
// Dormitorio de matrimonio (SZ): cama doble en (SZX, -1), almohadas en x = SZX ± 3,4 (z ≈ -6,6), colchón y ≈ 4,15; ventana en la pared izquierda (x = SZX - 15,75).
const PRAY = { aLx: 1.35, aRx: 1.35, aLz: -.42, aRz: -.42, aLe: 1.55, aRe: 1.55, headX: .12 };
const WISH = (T, i = 0) => ({ aLx: 2.7 + Math.sin(T * 6 + i) * .15, aRx: 2.7 - Math.sin(T * 6 + i) * .15, aLz: .5, aRz: .5, aLe: .3, aRe: .3, headX: -.3 });
// 1 «In dieser Stadt darf sich jeder,»: dos personas duermen en la cama doble (vista diagonal); al amanecer las dos se incorporan de golpe,
//   Mama una fracción antes: celebra con los brazos arriba entre chispas doradas; Papa llega tarde y se tapa la cara. Golpe de zoom + zoom lento.
shot(0, 'C', 'hook', L => { room('SZ', L, { dawn: true }); const X = SZX; SZ.quilt.position.y = 4.55;
  const uM = easeOut(clamp((L.lt - .28) / .16)), uP = easeOut(clamp((L.lt - .62) / .16));
  riseBed(mama, X + 3.2, -6.6, uM, L, uM > .9 ? { aLx: lerp(.3, 2.8, clamp((L.lt - .42) / .14)), aRx: lerp(.3, 2.8, clamp((L.lt - .42) / .14)), aLz: .5, aRz: .5, aLe: .3, aRe: .3, headX: -.25 } : {});
  riseBed(papa, X - 3.2, -6.6, uP, L, uP > .9 ? { aRx: 2.3, aRz: -.45, aRe: 2.35, headX: .3 } : {});
  if (L.lt < .28) sleepF(mama, L.T); else if (L.lt < .42) mama.setFace({ eyes: 'wide', mouth: 'o' }); else laughF(mama, L.T);
  if (L.lt < .62) sleepF(papa, L.T); else cara(papa, L.T, { eyes: 'squint', mouth: 'grimace' });
  if (L.lt > .42) { SPK.at(hp(mama).add(V(0, -1.5, 0)), L.T, clamp((L.lt - .42) / .2), 2.4, 6, 26); badge('gold', 'ERSTE!', W / 2, H * .17, (L.lt - .45) / .2, 1, 1.1); }
  show(WK[0], X + 10, 3.4, -8.2, -.3, .9); clockAt(WK[0], '6:00', '#ffd23f');
  cm([X + 7, 10.6, 9.5, X + .3, 6.4, -5.2, 44], [X + 5.4, 9.8, 6.4, X + .3, 6.7, -5.4, 42], L.k); sh(V(X, 0, -2), 20); },
  [[.02, 'zoom_fast', .7], [.28, 'cloth', .7], [.32, 'gasp_f', .5], [.45, 'magic_hit', .7], [.48, 'cheer', .45], [.62, 'cloth', .5], [.7, 'sigh', .5]]);
// 2 «der morgens als Erster aufwacht,»: Marktplatz al amanecer: un vecino en pijama sale corriendo al centro y salta con los brazos arriba («1.»); detrás, otros tres llegan bostezando
shot(1.30, 'W', null, L => { town(L, 'dawn'); const c = SL[0], run = clamp(L.lt / .7);
  put(c, lerp(-10, 0, easeOut(run)), 0, lerp(14, 6, easeOut(run)), lerp(.9, 0, run)); if (L.lt < .7) actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); else { const j = Math.abs(Math.sin((L.lt - .7) * 9)); c.root.position.y = j * 1.1; actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .2, aRe: .2, lLk: j * .6, lRk: j * .6, headX: -.3 }]], { T: L.T }); }
  laughF(c, L.T); badge3('gold', '1.', hp(c).add(V(0, 3, 0)), (L.lt - .6) / .25, 1.2);
  [[SL[5], -9, -12], [SL[8], 7, -16], [SL[11], -2, -22]].forEach(([s, x, z], i) => { put(s, x, 0, z + L.lt * 2, 0); actuar(s, 0, [[0, { ...walkP(L.T * .6, i), aRx: 2.4, aRz: -.4, aRe: 2.3, headX: .2 }]], { T: L.T }); s.setFace({ eyes: 'half', mouth: 'yawn' }); });
  orb(L.k, V(0, 3.2, 6), V(0, 3.4, 4), [26, .25, .18, 46], [19, .05, .12, 42]); sh(V(0, 0, 0), 40); },
  [[.05, 'run_cobble', .6], [.72, 'jump', .5], [.8, 'cheer', .5], [.3, 'birds', .4], [1.0, 'yawn_big', .35]]);
// 3 «für diesen Tag alles»: una chica en la plaza: un remolino de chispas y de él salen una tarta, una bici, fajos de billetes y cartas que giran a su alrededor
shot(2.68, 'Z', null, L => { town(L, 'day'); const c = EX[0]; put(c, 2, 0, 24, 0); actuar(c, 0, [[0, 'shock'], [.25, WISH(L.T), { dur: .3 }]], { T: L.T }); if (L.lt < .25) cara(c, L.T, { expr: 'gasp' }); else laughF(c, L.T);
  const C = V(2, 3.5, 24); SPK.at(V(2, 0, 24), L.T, 1, 6, 9, 34);
  const items = [KUCHEN, BIKE, ...BUNDLES.slice(0, 4), ...LETTERS.slice(0, 4)]; items.forEach((o, i) => { const a = i / items.length * 6.283 + L.lt * 2.4, r = lerp(.5, 6.5, easeOut(clamp(L.lt / .6))), y = 2 + (i % 3) * 2.4 + Math.sin(L.T * 3 + i);
    show(o, C.x + Math.cos(a) * r, y, C.z + Math.sin(a) * r * .8, a, (o === BIKE ? .7 : o === KUCHEN ? 1.1 : 1.1) * easeOut(clamp(L.lt / .3))); });
  crowdBox(L, -24, 24, 6, 14, 8, 3, { mode: i => ['point', 'shock', 'clap', 'look'][i % 4] });
  orb(L.k, C, null, [24, -.35, .16, 46], [18, .3, .1, 44]); sh(V(2, 0, 24), 34); },
  [[.02, 'magic_hit', .7], [.1, 'sparkle', .6], [.3, 'whoosh', .5], [.6, 'money_rain', .5], [1.0, 'kids_laugh', .4]]);
// 4 «wünschen, was er will.»: primer plano de un señor con los ojos cerrados y las manos juntas pidiendo un deseo; al abrir los ojos, estalla una estrella dorada
shot(4.02, 'F', null, L => { town(L, 'day'); const c = EX[3]; put(c, -6, 0, 10, .2); const k = clamp((L.lt - .9) / .2);
  actuar(c, 0, [[0, PRAY], [.9, WISH(L.T, 1), { dur: .25 }]], { T: L.T }); if (L.lt < .9) c.setFace({ eyes: 'closed', mouth: 'smile' }); else laughF(c, L.T);
  SPK.at(hp(c).add(V(0, -2, 0)), L.T, .35 + k * .65, 2 + k * 3, 6, 30); if (k > 0) confetti(hp(c), L.t0 + .9, L.T, 30, 1);
  crowdBox(L, -20, 10, -26, -8, 5, 7, { mode: 'look' });
  onFace(c, 5.2, .2, .4, 40, L.k, 4.2); sh(V(-6, 0, 10), 24); },
  [[.1, 'whisper', .4], [.9, 'magic_hit', .7], [.95, 'sparkle', .6], [1.1, 'confetti', .5]]);
// 5 «Du machst die Augen auf,»: una chica en su cama, primerísimo plano: abre los ojos de golpe con la luz del amanecer
shot(5.58, 'C', 'punch', L => { room('LZ', L, { dawn: true }); const c = EX[2]; lie(c, LZX - 9, -7.4, 4.15, L); LZ.quilt.position.y = 4.6;
  if (L.lt < .3) c.setFace({ eyes: 'closed', mouth: 'flat' }); else c.setFace({ eyes: 'wide', mouth: 'o' });
  const h = hp(c); cam([h.x + .4, h.y + 5.2, h.z + 2.6], [h.x, h.y, h.z - .2], lerp(40, 34, L.k)); sh(V(LZX - 9, 0, -4), 16); },
  [[.28, 'blink', .7], [.3, 'gasp_f', .5], [.1, 'birds', .3]]);
// 6 «sagst deinen Wunsch laut,»: se incorpora de golpe y grita su deseo («PARTY!»), con los puños arriba
shot(6.82, 'S', null, L => { room('LZ', L, { dawn: true }); const c = EX[2]; LZ.quilt.position.y = 4.6; const up = easeOut(clamp(L.lt / .2));
  riseBed(c, LZX - 9, -7.4, up, L, { aLx: lerp(.2, 2.6, up), aRx: lerp(.2, 2.6, up), aLz: .4, aRz: .4, aLe: .6, aRe: .6, headX: -.2 }); talk(c, L.T, L.t0, L.t1, 'shout', { eyes: 'happy' });
  bubble(c, 'PARTY!', (L.lt - .2) / .2, 2.2); onBody(c, 15, .55, .16, 42, L.k, 12, .35, 2.4); sh(V(LZX - 9, 0, -4), 18); },
  [[.02, 'cloth', .6], [.1, 'shout_m', .5], [.3, 'pop', .5]]);
// 7 «und die Stadt erfüllt ihn sofort.»: la plaza estalla en fiesta: confeti, fuegos artificiales, banderines y vecinos bailando; la cámara sube en grúa
shot(7.74, 'R', null, L => { town(L, 'day'); bloom.strength = .2; confetti(V(0, 6, -10), L.t0, L.T, 40, 1.6); fireworks(V(0, 34, -40), L.T, 4, 22);
  crowdAt(L, 0, -8, 16, 10, 24, 5, { mode: i => ['cheer', 'clap', 'wave', 'cheer'][i % 4], full: true });
  put(EX[2], 0, 0, 6, 0); const j = Math.abs(Math.sin(L.T * 7)); EX[2].root.position.y = j * .8; actuar(EX[2], 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(EX[2], L.T);
  orb(L.k, V(0, 3, 0), V(0, 10, -10), [26, .4, .1, 46], [52, -.15, .42, 50]); sh(V(0, 0, -6), 50); },
  [[.02, 'party_horn', .6], [.1, 'confetti', .6], [.3, 'firework', .5], [.6, 'cheer', .5], [1.0, 'firework', .4], [1.3, 'kids_laugh', .4]]);
// ---------- Emma, Ben y Lea ----------
// 8 «Emma hat sich gewünscht,»: Emma (melena rubia, chaqueta rosa) en la plaza, ojos cerrados y manos juntas; chispas doradas la rodean
shot(10.01, 'I', null, L => { town(L, 'day'); const c = put(emma, 0, 0, 30, 0); actuar(c, 0, [[0, PRAY]], { T: L.T }); c.setFace({ eyes: L.lt < .7 ? 'closed' : 'happy', mouth: 'smile' });
  SPK.at(V(0, 0, 30), L.T, 1, 3.2, 7, 28); crowdBox(L, -22, 22, 8, 16, 7, 11, { mode: i => ['walk', 'look', 'talk'][i % 3], dir: PI / 2 });
  onBody(c, 15, .2, .12, 42, L.k, 11, -.15); sh(V(0, 0, 30), 30); },
  [[.05, 'sparkle', .6], [.3, 'whisper', .35], [.7, 'magic_hit', .5]]);
// 9 «dass sich alle Jungs in sie verlieben.»: cuatro chicos se giran a la vez con corazones sobre la cabeza y corren hacia ella
shot(11.05, 'W', null, L => { town(L, 'day'); const c = put(emma, 0, 0, 30, PI); actuar(c, 0, [[0, { aRx: .3, aLx: .3, headX: -.05 }], [.6, 'shock', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: L.lt < .6 ? 'smile' : 'gasp' });
  JUNG.forEach((j, i) => { const x0 = -12 + i * 8, t = clamp((L.lt - .25 - i * .06) / 1.2); put(j, x0 * (1 - t * .7), 0, 6 + t * 16, lerp(PI, 0, clamp(L.lt * 4 - i * .3))); if (L.lt > .35) actuar(j, 0, [[0, runP(L.T, i)]], { T: L.T }); else actuar(j, 0, [[0, walkP(L.T, i)]], { T: L.T });
    j.setFace({ eyes: 'happy', mouth: 'open_smile' }); badge3('heart', '', hp(j).add(V(0, 2.4, 0)), (L.lt - .3 - i * .05) / .2, .5 + Math.sin(L.T * 12 + i) * .06); });
  orb(L.k, V(0, 3.4, 20), null, [32, PI / 2 + .25, .2, 46], [28, PI / 2 + .05, .18, 44]); sh(V(0, 0, 20), 34); },
  [[.25, 'whoosh', .5], [.35, 'run_cobble', .6], [.4, 'piano_note', .5], [.5, 'heartbeat', .5], [.9, 'gasp_f', .4]]);
// 10 «Bis zum Abend bekam sie»: atardecer en la puerta de Emma: un chico tras otro le meten cartas por el buzón; las cartas se amontonan
shot(12.68, 'S', null, L => { town(L, 'dusk'); const D = V(-40, 0, 30); const c = put(emma, D.x + 2, 0, D.z + 3, PI / 2); actuar(c, 0, [[0, 'hold']], { T: L.T }); cara(c, L.T, { expr: 'happy' });
  JUNG.slice(0, 3).forEach((j, i) => { put(j, D.x + 7 + i * 3.6, 0, D.z + 1 - i * .8, -PI / 2); actuar(j, 0, [[0, { aRx: 1.5 + Math.sin(L.T * 4 + i) * .2, aRe: .2, lean: .1 }]], { T: L.T }); j.setFace({ eyes: 'happy', mouth: 'smile' }); const l = LETTERS[i]; show(l, D.x + 5.8 + i * 3.6 - Math.min(L.lt * 2, 1.4), 4.4, D.z + 1.4 - i * .8, -PI / 2, 1); });
  LETTERS.slice(4, 16).forEach((l, i) => { const t = clamp(L.lt * 1.6 - i * .08); show(l, c.root.position.x + Math.sin(i * 2.1) * 1.2, .2 + i * .14 * t + (1 - t) * 6, c.root.position.z + 1.6 + Math.cos(i) * .8, i, 1.2).rotation.set(-PI / 2 + Math.sin(i) * .3, i, 0); });
  orb(L.k, V(D.x + 4, 3.8, D.z + 1), null, [24, .25, .16, 44], [20, .05, .12, 42]); sh(V(D.x + 4, 0, D.z), 26); },
  [[.1, 'paper', .5], [.4, 'paper', .5], [.7, 'pages', .5], [.2, 'steps', .4]]);
// 11 «37 Liebesbriefe.»: Emma en su cama rodeada de cartas que llueven del techo; «37» en grande
shot(13.80, 'Z', 'punch', L => { room('LZ', L); const c = put(emma, LZX - 9, sitY(emma, 3.9), -4, 0); c.blob.visible = false; actuar(c, 0, [[0, { lLx: 1.5, lRx: 1.5, aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, aLe: .3, aRe: .3, headX: -.2 }]], { T: L.T, weight: false }); laughF(c, L.T);
  LETTERS.forEach((l, i) => { const q = RNG(i * 7 + 2); const y = 15 - ((L.T * (2 + q() * 1.5) + q() * 14) % 14); show(l, LZX - 9 + (q() - .5) * 12, y, -4 + (q() - .5) * 10, q() * 6, 1.3).rotation.set(L.T * 2 + i, L.T + i, 0); });
  badge('red', '37', W / 2, H * .13, (L.lt - .05) / .2, 1, 1.4); badge('heart', '', W * .28, H * .26, (L.lt - .2) / .2, 1, .7); badge('heart', '', W * .72, H * .3, (L.lt - .3) / .2, 1, .55);
  onBody(c, 20, .35, .12, 44, L.k, 16, .2, 2.4); sh(V(LZX - 9, 0, -4), 18); },
  [[.02, 'impact', .5], [.1, 'paper', .6], [.4, 'pages', .5], [.6, 'kids_laugh', .4], [.15, 'count', .5]]);
// 12 «Ben hat sich einen Porsche gewünscht.»: Ben (gorra del revés) en la calle con las manos juntas; un remolino de chispas y aparece un deportivo amarillo
shot(15.55, 'F', null, L => { town(L, 'day'); const B = V(0, 0, 140); const c = put(ben, B.x - 3.4, 0, B.z + 5, .3); const k = clamp((L.lt - .55) / .25);
  actuar(c, 0, [[0, PRAY], [.6, 'shock', { dur: .25 }]], { T: L.T }); if (L.lt < .6) c.setFace({ eyes: 'closed', mouth: 'smile' }); else cara(c, L.T, { expr: 'gasp' });
  SPK.at(V(B.x + 4, 0, B.z), L.T, k > 0 ? 1 : .3, 5, 6, 34); if (k > 0) show(PORSCHE, B.x + 4, 0, B.z, -.7, easeOut(k)).position.y = (1 - k) * 4;
  orb(L.k, V(B.x, 3.2, B.z + 2), null, [28, .2, .14, 46], [24, .05, .12, 44]); sh(V(B.x, 0, B.z), 30); },
  [[.1, 'whisper', .35], [.55, 'magic_hit', .7], [.6, 'sparkle', .6], [.75, 'car', .5]]);
// 13 «Mit 16.»: Ben al volante con gafas de sol, sonriendo; el motor ruge; «16» en grande
shot(17.23, 'C', 'punch', L => { town(L, 'day'); const B = V(0, 0, 140); show(PORSCHE, B.x, 0, B.z, 0, 1); const c = sit(ben, B.x - 1.2, 2.2, B.z - 1, 0, L, { aLx: 1.2, aRx: 1.3, aLe: .4, aRe: .3, headX: -.05 }); grin(c, L.T);
  badge('gold', '16', W / 2, H * .2, (L.lt - .05) / .2, 1, 1.5); dust(V(B.x, 0, B.z - 5), L.t0 + .1, L.T, 10, 1);
  orb(L.k, V(B.x - 1, 3.6, B.z), null, [15, .35, .2, 42], [12, .15, .16, 40]); sh(V(B.x, 0, B.z), 24); },
  [[.02, 'car', .7], [.1, 'impact', .5], [.3, 'evil_laugh', .2]]);
// 14 «Ohne Führerschein.»: el deportivo arranca a lo loco y choca contra un buzón; Ben se encoge de hombros; cartel rojo «KEIN FÜHRERSCHEIN»
shot(18.54, 'R', null, L => { town(L, 'day'); const B = V(0, 0, 140), t = clamp(L.lt / .45); show(PORSCHE, B.x + Math.sin(t * 3) * 3, 0, B.z + easeIn(t) * 14, Math.sin(t * 9) * .3 * (1 - t) + (L.lt > .45 ? .25 : 0), 1); PORSCHE.position.y = L.lt > .45 && L.lt < .6 ? .5 : 0;
  const c = sit(ben, PORSCHE.position.x - 1.2, 2.2, PORSCHE.position.z - 1, PORSCHE.rotation.y, L, L.lt > .5 ? { aLx: .45, aLz: .65, aRx: .45, aRz: .65, aLe: 1.5, aRe: 1.5, headZ: .2 } : { aLx: 1.2, aRx: 1.3 }); cara(c, L.T, { expr: L.lt > .5 ? 'shock' : 'joy' });
  if (L.lt > .45) dust(V(PORSCHE.position.x, 0, B.z + 19), L.t0 + .45, L.T, 14, 1.4); badge('red', 'KEIN FÜHRERSCHEIN', W / 2, H * .22, (L.lt - .5) / .2, 1, .8);
  crowdBox(L, B.x - 14, B.x - 8, B.z + 4, B.z + 18, 3, 9, { mode: 'shock' }); cm([B.x + 14, 8, B.z + 36, B.x, 3, B.z + 12, 48], [B.x + 10, 7, B.z + 32, B.x, 3, B.z + 16, 46], L.k); sh(V(B.x, 0, B.z + 14), 30); },
  [[.02, 'car_pass', .6], [.45, 'car_hit', .7], [.5, 'glass_crack', .4], [.6, 'gasp', .4]]);
// 15 «Und Lea hat sich eine Million Euro gewünscht.»: Lea (gafas, jersey morado) en su cuarto, ojos cerrados y manos juntas; luego mira arriba: empiezan a caer billetes
shot(19.54, 'I', null, L => { room('MZ', L); GELD.userData.setH(0); const c = put(lea, MZX - 2, 0, 9.5, .2); const k = clamp((L.lt - 1.1) / .3);
  actuar(c, 0, [[0, PRAY], [1.15, { aLx: 2.4, aRx: 2.4, aLz: .6, aRz: .6, aLe: .5, aRe: .5, headX: -.4 }, { dur: .3 }]], { T: L.T }); if (L.lt < 1.1) c.setFace({ eyes: 'closed', mouth: 'smile' }); else cara(c, L.T, { expr: 'joy' });
  SPK.at(V(MZX - 2, 0, 3), L.T, 1, 3, 7, 26); BUNDLES.forEach((b, i) => { const q = RNG(i * 3 + 1); if (k <= 0) return; const y = 15 - ((L.T * (3 + q() * 2) + q() * 13) % 13); show(b, MZX - 2 + (q() - .5) * 10, y, 9.5 + (q() - .5) * 6, q() * 6, .7).rotation.set(L.T * 3 + i, i, L.T + i); });
  onBody(c, 17, .3, .14, 44, L.k, 13, .1); sh(V(MZX, 0, 0), 20); },
  [[.1, 'whisper', .4], [.9, 'magic_hit', .7], [1.15, 'money_rain', .7], [1.3, 'cash', .6]]);
// 16 «Die Scheine stapelten sich in ihrem Zimmer»: los fajos crecen del suelo en montones y llenan el cuarto; Lea encima, riendo
shot(22.09, 'Z', null, L => { room('MZ', L); const h = clamp(L.lt / 1.2); GELD.userData.setH(easeOut(h) * .7); const c = put(lea, MZX + 2, h * 8, 2, -.3); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45, aRz: .45, aLe: .3, aRe: .3, crouch: .05 }]], { T: L.T }); laughF(c, L.T);
  BUNDLES.slice(0, 8).forEach((b, i) => { show(b, MZX + 2 + Math.cos(i + L.T * 3) * 3, 4 + h * 8 + Math.sin(i * 2 + L.T * 4) * 2, 2 + Math.sin(i + L.T * 3) * 3, i + L.T, .7); });
  badge('green', '1.000.000 €', W / 2, H * .2, (L.lt - .1) / .2, 1, 1.0);
  cm([MZX - 6, 6, 18, MZX + 4, 5, -3, 50], [MZX - 4, 13, 15, MZX + 4, 9, -3, 50], L.k); sh(V(MZX + 4, 0, -2), 20); },
  [[.02, 'cash_reg', .6], [.2, 'money_rain', .6], [.6, 'cash', .5], [1.0, 'laugh_deep', .25], [1.2, 'coin_flip', .4]]);
// 17 «bis zur Decke.»: grúa hacia arriba: el montón de billetes toca el techo y Lea, aplastada contra él, ríe con la cara pegada
shot(23.73, 'W', 'slow', L => { room('MZ', L); GELD.userData.setH(1); const c = put(lea, MZX + 4, 11.2, -3, 0); actuar(c, 0, [[0, { aLx: 3.0, aRx: 3.0, aLz: .3, aRz: .3, aLe: 1.4, aRe: 1.4, crouch: .25, headX: .15 }]], { T: L.T }); laughF(c, L.T);
  cm([MZX - 2, 8, 14, MZX + 4, 9, -3, 52], [MZX, 13.4, 10, MZX + 4, 14, -3, 46], L.k); sh(V(MZX + 4, 0, -3), 20); },
  [[.05, 'money_rain', .5], [.4, 'thud', .5]]);
// 18 «Und du?»: toda la plaza se gira a la vez y señala a cámara
shot(24.78, 'C', 'punch', L => { town(L, 'day'); crowdBox(L, -16, 16, 14, 30, 14, 21, { mode: 'point', expr: 'happy', face: V(0, 4, 60), jit: .1 });
  put(emma, -5, 0, 30, .15); put(ben, 5, 0, 30, -.15); put(lea, 0, 0, 29, 0); for (const [c, i] of [[emma, 0], [ben, 1], [lea, 2]]) { actuar(c, 0, [[0, { aRx: 1.62, aRz: -.08, aRe: .05, aLz: .12, aLe: .25, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); }
  cm([0, 5.2, 54, 0, 4.6, 30, 44], [0, 5, 48, 0, 4.6, 30, 40], L.k); sh(V(0, 0, 32), 30); },
  [[.02, 'impact', .5], [.1, 'whoosh', .4]]);
// 19 «Was würdest du dir wünschen?»: estrella fugaz sobre Sternau al atardecer; una gran «?» dorada
shot(25.32, 'F', 'slow', L => { town(L, 'dusk'); SPK.at(V(lerp(-60, 40, L.k), lerp(70, 50, L.k), -60), L.T, 1, 2, 3, 20);
  badge('q', '?', W / 2, H * .3, (L.lt - .1) / .25, 1, 1.6); crowdBox(L, -14, 14, 20, 30, 6, 17, { mode: 'look', face: V(0, 60, -60), jit: .2 });
  cm([0, 6, 70, 0, 22, -40, 50], [0, 7, 62, 0, 28, -40, 48], L.k); sh(V(0, 0, 20), 40); },
  [[.1, 'sparkle', .6], [.3, 'whoosh_up', .4], [.6, 'piano_note', .4]]);
