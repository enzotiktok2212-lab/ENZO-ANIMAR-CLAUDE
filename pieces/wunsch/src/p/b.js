// ---------- b: Oma Hilde, los niños, el gallo y yo (26,4 – 58,3 s) ----------
// Huerto (GA, x = GAX): casa de Oma al fondo (z = -48), bancales en (±11, -6) y (±11, 12), calabazas GA.CAL, valla en z = 30 (puerta en x ∈ ±4).
// Dormitorio de Oma (OZ): cama doble; Oma en la almohada derecha (x = OZX + 3,4). Mi cuarto (KZ): cama en (KZX - 9), almohada z = -7,4.
// 20 «Aber am häufigsten gewinnt Oma Hilde.»: Oma en su huerto entre calabazas, levanta un trofeo de oro (una calabacita dorada) y guiña
shot(26.41, 'W', null, L => { use('GA'); day('day'); const c = put(oma, GAX, 0, 22, 0); actuar(c, 0, [[0, { aRx: 2.7, aRz: .3, aRe: .3, aLx: .4, aLz: .4, aLe: 1.2, headX: -.1 }]], { T: L.T }); cara(c, L.T, { eyes: L.lt > .9 ? 'wink' : 'happy', mouth: 'open_smile' });
  const tr = KUERB[0]; attach(tr, c.aR.hand, [0, -.6, 0], [0, 0, 0], .7); tr.traverse(o => { if (o.isMesh && !o.userData.gold) { o.userData.gold = 1; } });
  SPK.at(hp(c).add(V(0, 1.6, 0)), L.T, .6, 1.4, 3, 14); badge('tag', 'OMA HILDE', W / 2, H * .18, (L.lt - .2) / .25, 1, 1);
  orb(L.k, V(GAX, 3.4, 22), null, [18, -.4, .14, 44], [14, -.1, .1, 42]); sh(V(GAX, 0, 20), 26); },
  [[.1, 'birds', .4], [.3, 'cheer', .3], [.9, 'blink', .4]]);
// 21 «Sie geht um 19 Uhr ins Bett,»: Oma, con gorro de dormir, se mete en la cama con el sol todavía fuera; el despertador marca 19:00
shot(28.23, 'S', null, L => { room('OZ', L, { dawn: true }); const t = clamp(L.lt / .9); const c = oma;
  if (L.lt < .5) { put(c, OZX + 9, 0, 0, -PI / 2 + .4); actuar(c, 0, [[0, walkP(L.T * .5, 0)]], { T: L.T }); cara(c, L.T, { expr: 'smile' }); } else { lie(c, OZX + 3.4, -6.6, 4.15, L); OZ.quilt.position.y = 4.55; cara(c, L.T, { eyes: 'closed', mouth: 'smile' }); }
  show(WK[0], OZX + 10, 3.4, -8.2, -.4, 1); clockAt(WK[0], '19:00', '#ffd23f'); badge('num', '19:00', W * .5, H * .2, (L.lt - .1) / .2, 1, 1.1);
  cm([OZX + 1, 10, 10, OZX + 4.5, 4.5, -4, 46], [OZX + 2, 9, 6, OZX + 4.5, 4.8, -4.6, 44], L.k); sh(V(OZX + 3, 0, -3), 18); },
  [[.05, 'steps', .4], [.5, 'cloth', .6], [.7, 'sigh', .4], [.2, 'clock_tick', .4]]);
// 22 «wacht um 4 Uhr auf und ruft:»: de noche, el despertador salta a 4:00 y Oma se sienta de golpe, despierta del todo
shot(29.72, 'C', 'punch', L => { room('OZ', L, { night: true }); const up = easeOut(clamp((L.lt - .45) / .2)); OZ.quilt.position.y = 4.55;
  riseBed(oma, OZX + 3.4, -6.6, up, L, up > .8 ? { aLx: 1.0, aRx: 1.0, aLz: .4, aRz: .4, aLe: 1.6, aRe: 1.6 } : {}); if (L.lt < .45) sleepF(oma, L.T); else cara(oma, L.T, { expr: 'joy' });
  show(WK[0], OZX + 10, 3.4, -8.2, -.4, 1); clockAt(WK[0], L.lt < .45 ? '3:59' : '4:00', L.lt < .45 ? '#ff4a3a' : '#7af0ff'); badge('num', '4:00', W * .5, H * .2, (L.lt - .45) / .2, 1, 1.1);
  if (L.lt < .45) zzz(oma, L.T); cm([OZX + 5.5, 9.4, 7, OZX + 3.4, 5.4, -5, 44], [OZX + 5, 9, 4.6, OZX + 3.4, 5.6, -5.2, 42], L.k); sh(V(OZX + 5, 0, -5), 18); },
  [[.4, 'alarm', .6], [.47, 'cloth', .6], [.5, 'gasp_old', .5]]);
// 23 «„Mein Garten soll wachsen!“»: Oma de pie en la cama, brazos al cielo, gritando; las chispas salen volando por la ventana
shot(32.03, 'Z', null, L => { room('OZ', L, { night: true }); const c = put(oma, OZX + 2, 4, -2, -.5); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, aLe: .2, aRe: .2, headX: -.35, lean: -.08 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'shout', { eyes: 'happy' }); c.blob.visible = false; OZ.quilt.position.y = 4.55;
  SPK.at(V(lerp(OZX + 2, OZX - 15, (L.T * .8) % 1), 6, lerp(-2, 2, (L.T * .8) % 1)), L.T, 1, 2, 6, 30);
  onBody(c, 17, .5, .2, 44, L.k, 14, .25); sh(V(OZX, 0, -2), 20); },
  [[.02, 'shout_m', .2], [.2, 'magic_hit', .6], [.5, 'sparkle', .6], [.9, 'whoosh_up', .4]]);
// 24 «Sie gewinnt fast jeden Tag,»: al amanecer, el huerto crece de golpe a su alrededor; los vecinos, en pijama, miran desde la valla con cara larga
shot(33.62, 'I', null, L => { use('GA'); dawn(); const c = put(oma, GAX - 4, 0, 4, .3); const j = Math.abs(Math.sin(L.T * 6)); c.root.position.y = j * .5; actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45, aRz: .45, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T);
  GA.CAL.forEach((k, i) => k.scale.setScalar(lerp(.4, 1, easeOut(clamp(L.lt * 1.4 - i * .1)))));
  crowdBox(L, GAX - 14, GAX + 14, 32, 34, 5, 13, { list: SL, mode: 'tired', face: V(GAX - 4, 3, 4), jit: .15 });
  orb(L.k, V(GAX - 2, 3.4, 10), null, [30, PI + .25, .2, 46], [24, PI + .05, .16, 44]); sh(V(GAX, 0, 8), 34); },
  [[.05, 'rooster', .3], [.2, 'leaves', .5], [.4, 'cheer', .35], [.8, 'sigh', .4]]);
// 25 «und ihre Kürbisse sind so groß»: grúa baja entre calabazas gigantes; Oma les da palmaditas
shot(34.91, 'S', null, L => { use('GA'); day('day'); GA.CAL.forEach(k => k.scale.setScalar(1)); const c = put(oma, GAX + 4.5, 0, -1, -.9); actuar(c, 0, [[0, { aRx: 1.4 + Math.abs(Math.sin(L.T * 6)) * .3, aRe: .3, aRz: -.1, lean: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' });
  cm([GAX - 4, 2.2, 18, GAX + 6, 5, -6, 52], [GAX + 2, 7, 20, GAX + 8, 4, -6, 48], L.k); sh(V(GAX + 6, 0, -4), 26); },
  [[.1, 'thud', .4], [.4, 'thud', .4], [.2, 'birds', .4]]);
// 26 «wie Waschmaschinen.»: al lado de una calabaza, una lavadora: igual de grandes; Oma asiente orgullosa
shot(36.62, 'C', 'punch', L => { use('GA'); day('day'); GA.CAL.forEach(k => k.scale.setScalar(1)); show(WASH, GAX + 17, .8, -8, -.6, 1.15); const c = put(oma, GAX + 13.6, 0, -2.4, -.3); actuar(c, 0, [[0, { aRx: 1.6, aRz: .1, aRe: .1, headY: -.3 }]], { T: L.T }); grin(c, L.T);
  badge('big', '=', W / 2, H * .3, (L.lt - .1) / .2, 1, 1.2); orb(L.k, V(GAX + 13.5, 3.4, -7), null, [20, .1, .14, 44], [17, -.05, .12, 42]); sh(V(GAX + 14, 0, -6), 22); },
  [[.02, 'impact', .4], [.2, 'machine_hum', .5], [.5, 'laugh_deep', .2]]);
// 27 «In der Nacht vor einer Mathearbeit»: un niño en su escritorio de noche con un examen de mates («MATHE 5-»), sudando
shot(37.63, 'F', null, L => { room('LZ', L, { night: true }); const c = KIDS[1]; sit(c, LZX - 9, 4.1, 1, 0, L, { aLx: 1.2, aRx: 1.2, aLe: 1.0, aRe: 1.0, aLz: -.2, aRz: -.2, headX: .35, lean: .2 }); show(LETTERS[0], LZX - 9, 4.3, 2.6, 0, .7).rotation.set(-1.0, 0, 0); cara(c, L.T, { expr: 'worried' }); sweat(c, L.T);
  badge('red', 'MATHEARBEIT', W / 2, H * .2, (L.lt - .1) / .2, 1, .8);
  onBody(c, 13, .3, .16, 44, L.k, 10.5, .1, 2.4); sh(V(LZX - 9, 0, 1), 16); },
  [[.1, 'pencil', .5], [.6, 'gulp', .5], [.3, 'clock_tick', .4]]);
// 28 «stellt jedes Kind in der Stadt 12 Wecker»: el niño rodea su cama de despertadores; van apareciendo de uno en uno con el contador
shot(38.89, 'W', null, L => { room('LZ', L, { night: true }); const c = put(KIDS[1], LZX - 2, 0, 6, -.6); const n = Math.min(12, Math.floor(L.lt / 1.6 * 12) + 1);
  actuar(c, 0, [[0, { aRx: 1.3 + Math.sin(L.T * 10) * .2, aRe: .4, lean: .3, crouch: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  for (let i = 0; i < 12; i++) { const w = WK[i]; if (i >= n) continue; const a = i / 12 * PI * 2; show(w, LZX - 9 + Math.cos(a) * 5.6, i % 3 === 0 ? 4.5 : .1, -2 + Math.sin(a) * 6.8, -a + PI / 2, .9); clockAt(w, '6:00', ['#ff4a3a', '#7af0ff', '#ffd23f'][i % 3]); }
  badge('num', String(n), W * .5, H * .2, 1, 1, 1.3); cm([LZX, 12, 15, LZX - 5, 2.6, 1, 48], [LZX - 1, 11, 13, LZX - 5, 2.8, 1, 46], L.k); sh(V(LZX - 6, 0, 0), 22); },
  [[.05, 'click_metal', .5], [.3, 'click_metal', .5], [.55, 'click_metal', .5], [.8, 'click_metal', .5], [1.05, 'click_metal', .5], [1.3, 'click_metal', .5], [1.55, 'click_metal', .5]]);
// 29 «und betet, dass die Schule ausfällt.»: de rodillas junto a la cama, manos juntas, mirando al cielo por la ventana; bocadillo «BITTE!»
shot(40.67, 'R', null, L => { room('LZ', L, { night: true }); const c = put(KIDS[1], LZX - 9, 0, 8, 0); actuar(c, 0, [[0, { ...PRAY, crouch: .6, lLx: 1.4, lRx: 1.4, lLk: 1.9, lRk: 1.9, headX: -.3 }]], { T: L.T, weight: false }); c.root.position.y = -1.2 * (c.spec.scale || 1); c.setFace({ eyes: 'up', mouth: Math.sin(L.T * 9) > 0 ? 'talk' : 'o' });
  for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; show(WK[i], LZX - 9 + Math.cos(a) * 5.6, i % 3 === 0 ? 4.5 : .1, -2 + Math.sin(a) * 6.8, -a + PI / 2, .9); clockAt(WK[i], '6:00', '#ff4a3a'); }
  bubble(c, 'BITTE!', (L.lt - .15) / .2, 2); cm([LZX - 8, 6, 20, LZX - 9, 3.4, 6, 44], [LZX - 8.4, 5.6, 17.4, LZX - 9, 3.6, 6, 42], L.k); sh(V(LZX - 9, 0, 2), 18); },
  [[.1, 'whisper', .5], [.5, 'piano_note', .3], [1.2, 'cricket', .4]]);
// 30 «Denn einschlafen reicht nicht.»: el niño ya dormido entre los despertadores; Zzz
shot(43.16, 'I', null, L => { room('LZ', L, { night: true }); const c = lie(KIDS[1], LZX - 9, -7.4, 4.15, L); LZ.quilt.position.y = 4.6; sleepF(c, L.T); zzz(c, L.T);
  for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; show(WK[i], LZX - 9 + Math.cos(a) * 5.6, i % 3 === 0 ? 4.5 : .1, -2 + Math.sin(a) * 6.8, -a + PI / 2, .9); clockAt(WK[i], '5:59', '#ff4a3a'); }
  cm([LZX - 9, 16, 6, LZX - 9, 4, -4, 46], [LZX - 9, 13, 3, LZX - 9, 4, -5, 44], L.k); sh(V(LZX - 9, 0, -3), 18); },
  [[.05, 'snore', .6], [.6, 'clock_tick', .4]]);
// 31 «Du musst auch wirklich als Erster aufwachen.»: suenan los doce a la vez; el niño se incorpora… y por la ventana ya se ve a un vecino celebrando: «ZU SPÄT!»
shot(44.56, 'C', null, L => { room('LZ', L, { dawn: true }); const up = easeOut(clamp((L.lt - .3) / .2)); LZ.quilt.position.y = 4.6; riseBed(KIDS[1], LZX - 9, -7.4, up, L, up > .8 ? { aRx: 2.3, aRz: -.45, aRe: 2.35, headX: .3 } : {}); if (up > .5) cara(KIDS[1], L.T, { expr: 'sad' }); else sleepF(KIDS[1], L.T);
  for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2, j = Math.sin(L.T * 40 + i) * .12; show(WK[i], LZX - 9 + Math.cos(a) * 5.6 + j, (i % 3 === 0 ? 4.5 : .1) + Math.abs(j), -2 + Math.sin(a) * 6.8, -a + PI / 2 + j, .9); clockAt(WK[i], '6:00', '#ff4a3a'); }
  badge('red', 'ZU SPÄT!', W / 2, H * .22, (L.lt - .9) / .2, 1, 1); cm([LZX - 3, 9, 6, LZX - 9, 5, -5, 44], [LZX - 4, 8.4, 4, LZX - 9, 5.2, -5.2, 42], L.k); sh(V(LZX - 9, 0, -3), 18); },
  [[.0, 'alarm', .7], [.05, 'alarm', .5], [.32, 'cloth', .5], [.9, 'sad_tone', .5], [1.3, 'cheer', .2]]);
// 32 «Und der Hahn von Herrn Becker»: al amanecer, el gallo en un poste de la valla canta con todas sus fuerzas; Herr Becker (sombrero de paja) le anima
shot(46.87, 'S', null, L => { use('GA'); dawn(); const cr = clamp(Math.sin(L.lt * 4) * 1.2); show(HAHN, GAX + 6.6, 3.4, 30, .4, 1.1); HAHN.userData.crow(cr);
  const c = put(becker, GAX + 12.5, 0, 34, -.5); actuar(c, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .4, aLx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); notesFX(V(GAX + 6.6, 8, 31), L.T, 4, 1);
  orb(L.k, V(GAX + 8, 5, 31), null, [18, .7, .12, 44], [15, .45, .1, 42]); sh(V(GAX + 8, 0, 31), 22); },
  [[.05, 'rooster', .8], [.6, 'birds', .4]]);
// 33 «hat seit 7 Jahren»: el gallo con plumas desordenadas y ojeras, en primer plano; «7 JAHRE»
shot(48.27, 'Z', 'punch', L => { use('GA'); dawn(); show(HAHN, GAX + 6.6, 3.4, 30, .4, 1.1); HAHN.userData.crow(.2 + Math.sin(L.T * 3) * .1); badge('red', '7 JAHRE', W / 2, H * .2, (L.lt - .05) / .2, 1, 1.1);
  cm([GAX + 9.8, 7.4, 37.4, GAX + 6.6, 6, 30, 38], [GAX + 9, 7.2, 36, GAX + 6.6, 6, 30, 34], L.k); sh(V(GAX + 6.6, 0, 30), 14); },
  [[.02, 'impact', .4], [.2, 'sad_tone', .5]]);
// 34 «kein einziges Mal gewonnen.»: el gallo canta… y al fondo, en una ventana de la casa, alguien ya celebra; Becker se tapa la cara
shot(49.13, 'W', null, L => { use('GA'); dawn(); show(HAHN, GAX + 6.6, 3.4, 30, .4, 1.1); HAHN.userData.crow(clamp(Math.sin(L.lt * 5))); const c = put(becker, GAX + 11, 0, 34, -.5); actuar(c, 0, [[0, 'facepalm']], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  const w = put(SL[3], GAX - 2, 0, -30, 0); const j = Math.abs(Math.sin(L.T * 7)); w.root.position.y = j * .6; actuar(w, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45, aRz: .45, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(w, L.T); badge3('gold', '1.', hp(w).add(V(0, 3, 0)), (L.lt - .3) / .2, .9);
  cm([GAX + 2, 6, 46, GAX + 2, 4.5, 4, 46], [GAX + 1, 6.5, 44, GAX + 1, 4.5, 0, 44], L.k); sh(V(GAX + 5, 0, 10), 40); },
  [[.05, 'rooster', .6], [.5, 'cheer', .35], [.9, 'sigh', .5]]);
// 35 «Ich bin der tiefste»: yo, dormido como un tronco en mi cama, boca abierta y babeando un poco; Zzz enormes
shot(50.84, 'F', null, L => { room('KZ', L, { night: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L, { aRx: 2.6, aRz: .6, aRe: 1.2 }); KZ.quilt.position.y = 4.6; c.setFace({ eyes: 'closed', mouth: Math.sin(L.T * 2) > 0 ? 'yawn' : 'o' }); zzz(c, L.T, 1.2);
  cm([KZX - 4, 11, 2, KZX - 9, 4.4, -5.6, 44], [KZX - 5, 10, 0, KZX - 9, 4.4, -6, 38], L.k); sh(V(KZX - 9, 0, -4), 16); },
  [[.05, 'snore', .7], [.8, 'snore', .5]]);
// 36 «Schläfer der ganzen Stadt.»: grúa por encima de los tejados de noche: todas las ventanas encendidas menos la mía, con una gran «Z» saliendo
shot(52.12, 'Z', null, L => { town(L, 'night', V(0, 0, 40)); const P = V(-47, 14, 34); FX2D.push(c => { const [x, y, z] = proj(P); if (z >= 1) return; for (let i = 0; i < 3; i++) { const t = (L.T * .6 + i / 3) % 1; c.save(); c.globalAlpha = Math.sin(t * PI); c.translate(x + t * 120, y - t * 220); c.font = `700 ${(60 + t * 70) * U}px ${FONT}`; c.textAlign = 'center'; c.lineWidth = 12; c.strokeStyle = '#0e1226'; c.strokeText('Z', 0, 0); c.fillStyle = '#9ad8ff'; c.fillText('Z', 0, 0); c.restore(); } });
  badge('gold', 'NR. 1', W / 2, H * .2, (L.lt - .2) / .2, 1, 1); cm([30, 40, 90, -30, 10, 20, 50], [20, 34, 80, -36, 12, 26, 46], L.k); sh(V(0, 0, 30), 60); },
  [[.05, 'snore_chorus', .5], [.4, 'owl', .4], [.2, 'crickets', .4]]);
// 37 «Dabei weiß ich genau, was ich mir wünschen würde.»: yo de día en la ventana de la plaza, mirando al cielo con una sonrisa; una estrellita brilla en mi mano
shot(53.52, 'I', 'slow', L => { town(L, 'day'); const c = put(ichT, 6, 0, 46, PI - .2); actuar(c, 0, [[0, { aRx: 1.4, aRe: 1.5, aRz: -.2, headX: -.35, headY: .2 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'smirk' });
  SPK.at(wpos(c.aR.hand).add(V(0, -.6, 0)), L.T, 1, .9, 2.4, 10); onFace(c, 6, .2, -.6, 40, L.k, 4.8); sh(V(6, 0, 46), 20); },
  [[.1, 'sparkle', .5], [.5, 'piano_note', .4]]);
// 38 «Aber ich habe noch nie gewonnen.»: me despierto y el despertador marca 11:00; por la ventana, la fiesta del ganador; me hundo en la almohada
shot(55.36, 'W', null, L => { room('KZ', L); const up = easeOut(clamp((L.lt - .1) / .25)); KZ.quilt.position.y = 4.6; riseBed(ich, KZX - 9, -7.4, up * .8, L, { aLz: .3, aRz: .3, headX: .2 }); cara(ich, L.T, { expr: 'sad' });
  show(WK[0], KZX - 3.6, 3.4, -8.3, 0, 1.1); clockAt(WK[0], '11:00', '#ff4a3a'); badge('red', '11:00', W * .5, H * .2, (L.lt - .15) / .2, 1, 1); fireworks(V(KZX + 4, 9, -30), L.T, 3, 6);
  cm([KZX - 1, 9, 7, KZX - 8, 5, -6, 44], [KZX - 2, 8.6, 5.6, KZX - 8, 5.2, -6, 42], L.k); sh(V(KZX - 8, 0, -4), 16); },
  [[.05, 'yawn_big', .4], [.3, 'cheer', .2], [.8, 'sad_tone', .5]]);
// 39 «Nicht mal an meinem Geburtstag.»: cocina: tarta con 12 velas, Mama y Mia con gorros de fiesta cantando… y yo dormido con la cara junto a la tarta
shot(56.89, 'C', null, L => { room('KU', L); const T0 = V(KUX, 4.75, 0); show(KUCHEN, KUX, 4.75, 1, 0, 1.4); show(CANDLES, KUX, 4.75 + 1.6, 1, 0, 1);
  const c = sit(ich, KUX - 3.4, 2.9, -5.6, 0, L, { lean: .75, headX: .3, aLx: 1.3, aRx: 1.3, aLe: 1.6, aRe: 1.6 }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T, .9);
  const m = put(mama, KUX + 4, 0, 6.6, PI + .5); actuar(m, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - Math.sin(L.T * 12) * .2, aRz: -.2 - Math.sin(L.T * 12) * .2, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: Math.sin(L.T * 8) > 0 ? 'talk' : 'smile' });
  const mi = put(miaT, KUX + 7.4, 0, 3, -PI / 2 - .3); actuar(mi, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4 }]], { T: L.T }); laughF(mi, L.T); badge('gold', '12', W / 2, H * .2, (L.lt - .1) / .2, 1, 1.1);
  cm([KUX + 6, 10, 12, KUX - 2, 5, -3, 48], [KUX + 5, 9.4, 10.4, KUX - 2, 5, -3.4, 46], L.k); sh(V(KUX, 0, 0), 18); },
  [[.05, 'party_horn', .5], [.2, 'kids_laugh', .4], [.5, 'snore', .5], [.9, 'party_horn', .3]]);
