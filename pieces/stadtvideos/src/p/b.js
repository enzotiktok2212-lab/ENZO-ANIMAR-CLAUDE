// ===== 21,4–31,6 s: la Oma y el mamut =====
const OMA_SIT = { ...SIT, aRx: .55, aRe: 1.0, aRz: -.2, aLx: .55, aLe: 1.0, aLz: -.2, headX: .25 };
const omaChair = () => { const a = .5; sit(oma, OX - 6 + Math.sin(a) * .3, 3.9, -3 + Math.cos(a) * .3, a); };
const tab = (ch, fn, key, r = 1, s = .7) => { attach(TAB, ch.aR.hand, [-.75, -.5, .3], [1.55, 0, 0], s); TAB.userData.draw(key, fn); return TAB; };
const omaVid = (c, w, h) => { c.fillStyle = '#10131c'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * .32, 0); drawVid(c, w * .36, h, 'mammut', { prog: .6 }); c.restore(); };
const overOma = (L, t, d0 = 4.2, d1 = 3.6) => { const q = wpos(t), a = .5, f = V(Math.sin(a), 0, Math.cos(a)), d = lerp(d0, d1, easeInOut(L.k)); cam([q.x + f.x * d, q.y + 1.2, q.z + f.z * d], [q.x, q.y + .5, q.z], 42); };
// 16 «Und meine Oma Gerda?» — salón: la Oma en su sillón con la tableta, té y el gato durmiendo
shot(21.42, 'I', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, OMA_SIT]], { T: L.T }); cara(oma, L.T, { expr: 'smile', eyes: 'down', mouth: 'smile' }); tab(oma, omaVid, 'omavid');
  badge3('tag', 'Oma Gerda', hp(oma).add(V(0, 2.2, 0)), (L.lt - .2) * 2.5); cm([OX + 1, 7.4, 9, OX - 5.6, 5, -2.6, 46], [OX, 7.2, 7.6, OX - 5.6, 5, -2.6, 44], L.k); sh(V(OX - 5, 0, -3), 18); }, [[0, 'meow', .4], [.3, 'pop', .5], [.6, 'spoon', .4]]);
// 17 «Sie hat ein Video gesehen,» — por encima del hombro: en la tableta, un vídeo de una calle llena de mamuts; la Oma suelta una risita
shot(22.54, 'W', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, { ...OMA_SIT, ...LAUGH(L.T), headX: .3 }]], { T: L.T }); laughF(oma, L.T); const t = tab(oma, omaVid, 'omavid');
  overOma(L, t); sh(V(OX - 5, 0, -3), 18); }, [[0, 'laugh_old', .5], [.6, 'whinny', .3], [1.0, 'cup_marble', .3]]);
// mamut con jinete que saluda
function mamWalk(M, L, x, z, ry, sp, rider, i = 0, wave = true) { M.root.visible = true; const d = sp * L.lt; M.root.position.set(x + Math.sin(ry) * d, 0, z + Math.cos(ry) * d); M.root.rotation.y = ry; M.pose(L.T + i, sp > 0 ? 1 : 0, { trunkUp: Math.max(0, Math.sin(L.T * 1.5 + i)) });
  if (rider) { attach(rider.root, M.body, [0, 4.5, -1.2], [0, 0, 0], rider.spec.scale || 1); applyPose(rider, { ...SIT, lLx: 1.2, lRx: 1.2, lLk: 1.3, lRk: 1.3, ...(wave ? { ...GW(L.T + i) } : {}) }); cara(rider, L.T + i, { expr: 'joy', mouth: 'open_smile' }); } return M; }
const GW = T => ({ aRx: 2.7, aRz: .4 + Math.sin(T * 9) * .38, aRe: .5, aLz: .1 });
// 18 «in dem jeder ein Mammut hat.» — el vídeo: una calle del barrio con mamuts gigantes paseando, cada uno con su dueño saludando
shot(23.78, 'Z', null, L => { use('NB'); day(); mamWalk(MAM[0], L, NX - 1, -30, 0, 3, K[1], 0); mamWalk(MAM[1], L, NX + 5, -58, 0, 3, sie, 1); mamWalk(MAM[2], L, NX - 6, -80, 0, 3, K[7], 2);
  put(K[3], NX - 13, 0, -10, PI / 2); actuar(K[3], L.lt, [[0, 'wave']], { T: L.T }); cara(K[3], L.T, { expr: 'joy' });
  const z = MAM[0].root.position.z; cm([NX + 4, 3, z + 30, NX - 1, 9, z, 52], [NX + 3, 3.4, z + 27, NX - 1, 9.5, z, 50], L.k); sh(V(NX, 0, z - 10), 50); }, [[0, 'steps_heavy', .7], [.4, 'whinny', .4], [.8, 'steps_heavy', .6], [1.2, 'cheer', .3]]);
// 19 «Außer ihr.» — la Oma sola en su jardín, triste, mientras detrás pasa un mamut con su dueño
shot(25.42, 'C', null, L => { use('NB'); day(); put(oma, NX - 15, 0, 6, -.72); actuar(oma, L.lt, [[0, { lean: .1, headX: .25, aLz: .05, aRz: .05 }]], { T: L.T }); cara(oma, L.T, { expr: 'sad', mouth: 'frown' });
  mamWalk(MAM[0], L, NX + 3, 22, PI, 3.2, K[1], 0); cm([NX - 22, 4.6, 15, NX - 13.5, 4.2, 4, 46], [NX - 21.4, 4.6, 13.6, NX - 13.5, 4.2, 4, 44], L.k); sh(V(NX - 10, 0, 4), 30); }, [[0, 'sad_tone', .5], [.2, 'steps_heavy', .5], [.5, 'sigh', .4]]);
// 20 «Deshalb hat sie sich online» — la Oma, decidida, teclea en la tableta con un dedo
shot(26.18, 'S', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, { ...OMA_SIT, aLx: 1.5, aLe: .9, aLz: .25 }]], { T: L.T, extra: { aLe: .9 + Math.abs(Math.sin(L.T * 12)) * .3 } }); cara(oma, L.T, { expr: 'determined', mouth: 'smirk' }); tab(oma, (c, w, h) => drawShop(c, w, h, 0), 'shop0');
  onFace(oma, 7.6, .2, -1.2, 44, L.k, 6.2); sh(V(OX - 5, 0, -3), 18); }, [[0, 'keys', .5], [.5, 'click_metal', .4], [.9, 'keys', .4]]);
// 21 «ein Baby-Mammut bestellt.» — inserto de la tableta: «Baby-Mammut» → el dedo de la Oma pulsa → «✓ BESTELLT»
shot(27.52, 'Z', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, { ...OMA_SIT, aLx: 1.5, aLe: .9, aLz: .25 }]], { T: L.T }); cara(oma, L.T, { expr: 'joy' }); const st = L.lt > .6 ? 1 : 0; const t = tab(oma, (c, w, h) => drawShop(c, w, h, st), 'shop' + st);
  overOma(L, t, 3.4, 2.8); if (L.lt > .6) badge('tag', '✓ BESTELLT', W / 2, H * .18, (L.lt - .6) * 3); sh(V(OX - 5, 0, -3), 18); }, [[0, 'click_metal', .5], [.6, 'button', .6], [.65, 'ding_soft', .5]]);
// 22 «Für 1.499 Euro.» — la Oma paga con su tarjeta dorada: «1.499 €» enorme; monedas
shot(28.6, 'C', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, { ...OMA_SIT, aLx: 1.6, aLe: .5, aLz: -.1 }]], { T: L.T }); cara(oma, L.T, { expr: 'smile', eyes: 'happy', mouth: 'grin' }); tab(oma, (c, w, h) => drawShop(c, w, h, 1), 'shop1'); attach(CARD, oma.aL.hand, [0, -.6, .3], [0, 0, .3], 1);
  badge('num', '1.499 €', W / 2, H * .2, (L.lt - .3) * 2.5, 1, 1.5); cashRain(V(OX - 5, 4, -2), 28.9, L.T, 10); onFace(oma, 9, .6, 2, 46, L.k, 7.6); sh(V(OX - 5, 0, -3), 18); }, [[0, 'cash_reg', .7], [.3, 'coins', .6], [.5, 'pop', .6], [1.0, 'coin_flip', .4]]);
// 23 (sigue «Euro.») — llega el paquete: de la caja salta un bebé mamut y la Oma lo abraza
shot(30.0, 'F', null, L => { use('OS'); inside(.95); put(oma, OX + 2.4, 0, 5, -.6); actuar(oma, L.lt, [[0, 'shock'], [.5, 'hug_self']], { T: L.T }); cara(oma, L.T, { expr: L.lt < .5 ? 'shock' : 'joy', mouth: L.lt < .5 ? 'o' : 'open_smile', blush: 1 });
  const k = spring(clamp((L.lt - .15) / .5)); BABY.root.visible = true; BABY.root.position.set(OX - 3.4, 0, 4); BABY.root.rotation.y = 1.0; BABY.root.scale.setScalar(.3 * Math.max(.01, k)); BABY.pose(L.T, 0, { trunkUp: 1 });
  confetti(V(OX - 3, 1, 4), 30.15, L.T, 40); cm([OX + 1, 6, 22, OX - .6, 3.6, 4, 48], [OX + .8, 5.8, 20, OX - .6, 3.6, 4, 46], L.k); sh(V(OX, 0, 4), 18); }, [[0, 'door_bell', .5], [.15, 'pop', .7], [.2, 'confetti', .5], [.5, 'whinny', .4], [.9, 'aah', .4]]);

// ===== 31,6–41,1 s: la pregunta =====
// 24 «Aber eine Frage stellt sich jeder:» — la plaza: la gente baja el móvil y se rasca la cabeza; signos de interrogación
shot(31.61, 'W', null, L => { city(L); bigVid('plain'); [[K[0], -4, 8, .3], [K[5], 4, 6, -.3], [mayor, 0, -2, 0], [kasse, -8, -4, .5], [FW[0], 8, -6, -.5]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, LOOK], [.3 + i * .12, 'think']], { T: L.T + i }); cara(c, L.T + i, { expr: 'confused' }); holdPhone(i, c, 'plain'); if (i < 3) badge3('q', '', hp(c).add(V(0, 2.4, 0)), (L.lt - .4 - i * .15) * 3, .8); });
  cm([1, 5, 24, 0, 4, 2, 48], [1, 5, 21, 0, 4, 2, 46], L.k); sh(V(0, 0, 2), 30); }, [[0, 'murmur', .5], [.4, 'hmm', .5], [.8, 'pop', .4], [1.2, 'hmm', .4]]);
// 25 «Wer macht diese Videos eigentlich?» — zoom lento a la pantalla gigante: un «?» enorme; la multitud mira arriba
shot(33.55, 'Z', 'slow', L => { city(L); ST.big.userData.draw('q', (c, w, h) => { drawVid(c, w, h, 'plain', { ui: false }); c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(0, 0, w, h); txt(c, '?', w / 2, h * .48, w * .8, '#ffd23f', '#1a1a1a', 20); txt(c, 'WER MACHT DAS?', w / 2, h * .85, w * .1, '#fff', '#000', 8); });
  [K[1], K[2], sie, er, lena].forEach((c, i) => { put(c, -4 + i * 2.4, 0, -50 + (i % 2) * 2, PI); actuar(c, L.lt, [[0, { headX: -.5, aLz: .1, aRz: .1 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'worried' }); });
  cm([10, 3, -36, 0, 30, -64, 58], [6, 5, -44, 0, 33, -64, 50], L.k, easeIn); sh(V(0, 0, -40), 30); }, [[0, 'murmur', .4], [.6, 'hum_low', .4]]);
// 26 «Es gibt keinen Namen, keinen Kanal.» — un chico enseña el móvil: el vídeo no tiene nombre ni canal («@ ? ? ?»)
shot(35.43, 'C', null, L => { city(L); bigVid('plain'); put(K[3], 4, 0, 8, -.2); actuar(K[3], L.lt, [[0, { ...SHOW, headX: .1 }], [1.2, { ...SHOW, ...GEST_SHRUG_L }]], { T: L.T }); cara(K[3], L.T, { expr: 'confused', mouth: 'grimace' }); holdShow(0, K[3], ptex('noname', drawNoName));
  const h = hp(K[3]); cm([h.x + .6, h.y + .2, h.z + 9, h.x + .3, h.y - .9, h.z, 46], [h.x + .5, h.y + .1, h.z + 8, h.x + .3, h.y - .9, h.z, 44], L.k); sh(V(4, 0, 8), 20); }, [[0, 'click_metal', .5], [.6, 'sad_tone', .3], [1.3, 'hmm', .4]]);
const GEST_SHRUG_L = { aLx: .45, aLz: .65, aLe: 1.5, headZ: .2 };
// 27 «Sie erscheinen einfach,» — de noche: la ciudad dormida; la pantalla gigante se enciende sola con un vídeo nuevo; ventanas que se iluminan
shot(37.61, 'F', null, L => { city(L, 'night'); const on = L.lt > .5; if (on) bigVid('lava', { prog: .05 }); else ST.big.userData.draw('off', (c, w, h) => { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); });
  winLights(on ? 1 : .4); cm([0, 6, 10, 0, 30, -64, 56], [0, 6.5, 6, 0, 31, -64, 54], L.k); sh(V(0, 0, -40), 50); }, [[0, 'crickets', .5], [.5, 'power_on', .6], [.55, 'tv_static', .3], [1.1, 'notif', .4]]);
// 28 «jede Nacht um 4:44 Uhr.» — mesilla a oscuras: el móvil se enciende: 4:44, «Neues Video ist da!»
shot(39.37, 'Z', null, L => { use('ZI'); inside(.25, 10); ZI.LMP.intensity = 0; ZI.BLUE.intensity = 30; ZI.clk.userData.draw('444', (c, w, h) => drawClock(c, w, h, '4:44')); const p = show(PH[0], ZX + 6.8, 3.02, -10.6); p.rotation.set(-PI / 2, 0, -.3); p.userData.set(ptex('lock', (c, w, h) => drawLock(c, w, h, L.lt > .3)));
  put(ich, ZX + 13, 3.5, -5.6, 0); ich.root.rotation.x = -PI / 2; applyPose(ich, { aLz: .3, aRz: .3 }); cara(ich, L.T, { eyes: 'closed', mouth: 'flat', noBlink: true });
  badge('num', '4:44', W / 2, H * .16, (L.lt - .4) * 2.5, 1, 1.3); cm([ZX + 8, 8.4, -4.6, ZX + 6.4, 3.2, -10.8, 46], [ZX + 7.6, 7.6, -6, ZX + 6.4, 3.2, -10.8, 40], L.k); sh(V(ZX + 8, 0, -8), 15); }, [[0, 'clock_tick', .5], [.3, 'vibrate', .7], [.35, 'notif', .6], [1.0, 'snore', .3]]);
// ===== 41,1–48,8 s: Jonas =====
const jonasDesk = (L, pose = {}) => { sit(jonas, JX - 6, 3.25, -6.4, PI); actuar(jonas, L.lt, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: .7, aRe: .7, headX: .1, ...pose }]], { T: L.T }); };
// 29 «Mein bester Freund Jonas» — Jonas, mullet rubio y chándal turquesa, se gira en su silla y saluda; tag «Jonas»
shot(41.11, 'S', null, L => { use('JZ'); inside(.8); JZ.lapS.userData.draw('ed0', (c, w, h) => drawEditor(c, w, h, 0)); put(jonas, JX - 5, 0, -4, .5); actuar(jonas, L.lt, [[0, 'idle'], [.2, 'wave']], { T: L.T }); cara(jonas, L.T, { expr: 'joy', mouth: 'grin' });
  badge3('tag', 'Jonas', hp(jonas).add(V(0, 2.4, 0)), (L.lt - .4) * 2.5); onFace(jonas, 11, .4, 0, 46, L.k, 9.4); sh(V(JX - 5, 0, -4), 18); }, [[0, 'chair_roll', .5], [.4, 'pop', .5], [.7, 'whistle', .3]]);
// 30 «hat drei Nächte lang versucht, selbst eins zu machen.» — de noche frente al portátil: ojeras, latas vacías; «3 NÄCHTE»
shot(42.29, 'W', null, L => { use('JZ'); inside(.35, 20); JZ.LMP.intensity = 0; JZ.BLUE.intensity = 0; JZ.lapS.userData.draw('ed1', (c, w, h) => drawEditor(c, w, h, .2)); jonasDesk(L, { headX: .2, lean: .15 }); cara(jonas, L.T, { expr: 'tired', mouth: 'flat', bags: 1 });
  FILL.intensity = 25; badge('num', '3 NÄCHTE', W / 2, H * .15, (L.lt - .2) * 2.5); onFace(jonas, 4.4, .3, 2.6, 48, L.k, 3.9); sh(V(JX - 6, 0, -8), 15); }, [[0, 'keys', .5], [.5, 'yawn_m', .4], [1.1, 'clock_tick', .4], [1.6, 'keys', .4], [2.0, 'click_metal', .3]]);
// 31 «Seine Figur ist durch eine Wand gelaufen,» — por encima del hombro: en la pantalla el muñeco atraviesa la pared → «FEHLER»; Jonas se lleva la mano a la cara
shot(44.63, 'C', null, L => { use('JZ'); inside(.5, 30); const k = clamp(L.lt / 1.2); JZ.lapS.userData.draw('ed2' + Math.round(k * 12), (c, w, h) => drawEditor(c, w, h, k * .85, k > .8)); jonasDesk(L, L.lt > 1.1 ? GEST.facepalm : {}); cara(jonas, L.T, { expr: L.lt > 1.1 ? 'sad' : 'shock' });
  cm([JX - 3.6, 8.4, -2.6, JX - 6, 6.2, -11.6, 44], [JX - 4.2, 8, -4.2, JX - 6, 6.2, -11.6, 40], L.k); sh(V(JX - 6, 0, -8), 15); }, [[0, 'steps', .3], [.9, 'glitch', .6], [1.0, 'alarm_soft', .4], [1.4, 'slap', .4]]);
// 32 «und dann hat sein Laptop angefangen zu qualmen.» — el portátil echa humo y chispas; Jonas salta hacia atrás tosiendo
shot(46.55, 'R', null, L => { use('JZ'); inside(.5, 30); JZ.lapS.userData.draw('err', (c, w, h) => { c.fillStyle = '#1a0505'; c.fillRect(0, 0, w, h); txt(c, '⚠', w / 2, h * .4, h * .4, '#ff3a2a'); txt(c, 'SYSTEM ÜBERHITZT', w / 2, h * .8, h * .1, '#ff8a6a'); });
  const lp = V(JX - 6, 5.6, -11.2); smoke(lp, L.T, 1.1); sparks(lp, 46.6, L.T); put(jonas, JX - 5, 0, -2.6, .4); actuar(jonas, L.lt, [[0, 'recoil', { anti: .2 }], [.8, { ...GEST.cower, crouch: .3 }]], { T: L.T }); cara(jonas, L.T, { expr: 'shock', mouth: 'scream' });
  cm([JX - 1, 6, 8, JX - 5, 3.6, -4, 50], [JX - 1.2, 5.8, 7, JX - 5, 3.6, -4, 48], L.k); sh(V(JX - 6, 0, -8), 15); }, [[0, 'sparks', .7], [.2, 'fire_crackle', .5], [.4, 'cough', .6], [.9, 'glass_crack', .3], [1.5, 'cough', .5]]);
// 33 «Doch dann ist mir etwas aufgefallen.» — zoom lento a mi cara: me doy cuenta de algo (la pantalla gigante detrás)
shot(48.76, 'Z', 'slow', L => { city(L); bigVid('mammut'); put(ich, 0, 0, -36, 0); actuar(ich, L.lt, [[0, 'idle'], [.4, { headX: -.1, aRx: 1.9, aRz: -.4, aRe: 2.2, headZ: .1 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt > .6 ? 'shock' : 'confused' });
  onFace(ich, 9, .2, .4, 44, L.k, 5.2); sh(V(0, 0, -36), 20); }, [[0, 'heartbeat', .5]]);
