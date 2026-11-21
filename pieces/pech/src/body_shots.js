// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(k * 1.6), a: 1 });
const pillOn = (ch, text, k, kind = 'free', dy = 2.6) => BAD.push({ kind, text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1), 0)), s: spring(k * 1.6) * .9, a: clamp(k * 6) });
const walkers = (T, lt, n = 8, z0 = -10, skip = []) => { for (let i = 0; i < n; i++) { if (skip.includes(i)) continue; const e = ex[i], s = i % 2 ? 1 : -1; walkTo(e, s * (10 + (i % 3) * 1.6), z0 - i * 9, i % 3 === 2 ? Math.PI : 0, T + i * .3, lt, 2.4); face(e, { eyes: 'open', mouth: i % 3 ? 'smile' : 'flat' }, T + i); } };
const H0 = SUB.houses[0], H2 = SUB.houses[2];   // casa de Finn (izquierda, z=20) y la casa que se derrumba
const FH = V(SUBX - 25, 0, 20);   // puerta de Finn ≈ (SUBX-25+6.6, 0, 20+...) — la casa mira a +x

// 1 GANCHO: golpe de zoom con "ding" y dron sobre la avenida (como la referencia: calle larga, rascacielos al fondo, gente y coches)
shot(0, 'C', null, L => { use('G'); walkers(L.T, L.lt, 12, 30); traffic(L.T + 3); FT.userData.update(L.T);
  const z0 = .32; if (L.T < z0) { const k = easeOut(L.T / z0); cam([0, lerp(70, 44, k), lerp(110, 62, k)], [0, 0, -70], lerp(74, 50, k)); } else cm([0, 44, 62, 0, 0, -70, 50], [0, 38, 44, 0, 0, -80, 48], (L.T - z0) / (L.t1 - z0), q => q);
  sh(V(0, 0, -20), 70); badge('tag', 'PECH = GELD', W / 2, H * .14, L.lt - .9); }, [[0, 'zoom_fast', .9], [.02, 'whoosh', .6], [.3, 'city_amb', .6], [.9, 'car_pass', .5], [1.6, 'steps', .4], [2.2, 'car_pass', .4]]);
// 2 Bus verpasst? → +100 €
shot(st(2), 'W', null, L => { use('G'); const turn = st(3) - L.t0; CBUS.visible = true; CBUS.rotation.y = Math.PI; CBUS.position.set(-4.2, 0, -26 - L.lt * 9); traffic(L.T, 0);
  if (L.lt < turn) { walkTo(ex[0], -9.6, -12, Math.PI, L.T, L.lt, 4.6, true); face(ex[0], { eyes: 'wide', mouth: 'shout', brows: -.5, sweat: 1 }, L.T); } else { put(ex[0], -9.6, 0, -12 - turn * 4.6, 0); applyPose(ex[0], CHEER); face(ex[0], { eyes: 'happy', mouth: 'grin' }, L.T); pillOn(ex[0], '+100 €', L.lt - turn); }
  const p = ex[0].root.position; cm([p.x + 5, 4.6, p.z + 9, p.x - 1, 3.8, p.z - 4, 50], [p.x + 4.4, 4.4, p.z + 8, p.x - 1, 3.8, p.z - 4, 48], L.k); sh(p, 26); }, [[0, 'steps_run', .6], [.2, 'car', .6], [.5, 'whistle', .4], [st(3) - st(2), 'cash', .8], [st(3) - st(2) + .1, 'coins', .6]]);
// 3 Vom Regen erwischt? → +500 €
shot(st(4), 'Z', null, L => { use('G'); storm(.6); const turn = st(5) - L.t0; put(ex[1], 10.4, 0, -40, -.4); CLOUD.visible = true; CLOUD.position.set(10.4, 15, -40); CLOUD.scale.setScalar(.7); RAIN.at(V(10.4, 0, -40), L.T, .6, 3.6, 13);
  umb.visible = true; umb.position.copy(handP(ex[1])).add(V(0, -.6, 0)); umb.rotation.set(lt2(L.lt) * Math.PI, 0, .3);
  if (L.lt < turn) { applyPose(ex[1], { aRx: 2.4, aRe: .4, aLz: .5, headX: -.3 }); face(ex[1], { eyes: 'squint', mouth: 'frown', brows: -.6 }, L.T); } else { applyPose(ex[1], { ...CHEER, aRx: 2.4 }); face(ex[1], { eyes: 'happy', mouth: 'grin' }, L.T); pillOn(ex[1], '+500 €', L.lt - turn); }
  onFace(ex[1], 13, -.6, 2.4, 46, L.k, 11); sh(V(10, 0, -40), 20); }, [[0, 'rain', .7], [.3, 'wind', .5], [.5, 'rip', .5], [st(5) - st(4), 'cash_reg', .8], [st(5) - st(4) + .15, 'coins', .5]]);
function lt2(lt) { return clamp((lt - .35) / .3); }
// 4 Und wenn dein Haus zerstört wird? (se derrumba)
shot(st(6), 'R', null, L => { use('SUB'); const c = V(SUBX - 25, 0, -4), k = clamp((L.lt - .45) / .7); H2.g.scale.set(1 + k * .15, 1 - k * .82, 1 + k * .1); H2.g.rotation.z = k * .12; smokeAt(c.x + 4, 1, c.z, k > 0 ? k * 1.2 : 0, 0xc8b8a0, 1.6);
  debris.forEach((d, i) => { d.visible = k > 0; const a = i * 2.4, t = k * 1.4; d.position.set(c.x + 8 + Math.cos(a) * t * 7, Math.max(.3, 6 + 8 * t - 9 * t * t + (i % 3)), c.z + Math.sin(a) * t * 7); d.rotation.set(t * 4 + i, i, t * 3); });
  put(ex[2], SUBX - 7, 0, 2, -Math.PI / 2 + .7); applyPose(ex[2], k > .1 ? { aLz: 1.4, aRz: 1.4, aLe: 1.6, aRe: 1.6, lean: -.15 } : { aRx: .4 }); face(ex[2], k > .1 ? { eyes: 'wide', mouth: 'o', brows: -.6 } : { eyes: 'open', mouth: 'smile' }, L.T);
  cm([SUBX + 4, 6, 14, SUBX - 18, 5, -4, 52], [SUBX + 2, 5.4, 12, SUBX - 18, 4.4, -4, 50], L.k); sh(V(SUBX - 14, 0, 0), 30); }, [[0, 'birds', .4], [.4, 'rumble', .8], [.55, 'collapse', .9], [.8, 'glass_break', .5], [1.0, 'rubble', .6], [1.2, 'gasp', .5]]);
// 5 1 Million Euro: llueve dinero sobre el dueño
shot(st(7), 'F', null, L => { use('SUB'); H2.g.scale.set(1.15, .18, 1.1); H2.g.rotation.z = .12; put(ex[2], SUBX - 7, 0, 2, Math.PI / 2 - .3); const j = Math.abs(Math.sin(L.lt * 6)) * 1.2; ex[2].root.position.y = j; applyPose(ex[2], { ...CHEER, lLk: j * .6, lRk: j * .6 }); face(ex[2], { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T);
  money(40, SUBX - 7, 4, 2, L.T, 9, 1.4); onFace(ex[2], 12, .4, -2, 48, L.k, 10); badge('green', '+1.000.000 €', W / 2, H * .17, L.lt - .15); sh(V(SUBX - 7, 0, 2), 20); }, [[0, 'money_rain', .8], [.1, 'cash', .9], [.3, 'cheer', .5], [.8, 'coins', .6], [1.2, 'cash_reg', .6]]);
// 6 Deshalb sind die größten Pechvögel hier die Reichsten: vendado, escayola y saco de dinero
shot(st(8), 'S', null, L => { use('G'); traffic(L.T, 3); walkTo(ex[3], -10.6, -48, 0, L.T, L.lt, 1.6, false, .45, .3); applyPose(ex[3], { ...walkPose(L.T, .45, .3), aRx: .3, aRe: .4, aLx: .9, aLe: 1.4 }); bandOn(ex[3]); castOn(ex[3], 0); sackOn(ex[3], 1); face(ex[3], { eyes: 'happy', mouth: 'grin' }, L.T);
  walkTo(ex[4], -13, -56, 0, L.T + .4, L.lt, 1.4, false, .45); face(ex[4], { eyes: 'open', mouth: 'grin' }, L.T); bubble(ex[4], '+50.000 €', L.lt - .9, 2.2);
  const p = ex[3].root.position, kk = wt('Reichsten', st(8)) - L.t0; onFace(ex[3], 13, .2, 3, 46 * punch(L.lt, kk, .22), L.k, 11); money(10, p.x, p.y + 5, p.z, L.T, 4); sh(p, 26); badge('tag', 'PECHVÖGEL = REICH', W / 2, H * .14, L.lt - .3); }, [[0, 'steps', .5], [.4, 'coins', .6], [1.2, 'cash', .6], [wt('Reichsten', st(8)) - st(8), 'impact', .7]]);
// 7 Mein Nachbar: tres rayos
const B1 = st(9), B3 = wt('dreimal', B1); const strikes = [B3 - B1 - .5, B3 - B1 + .05, B3 - B1 + .55];
shot(st(9), 'C', null, L => { use('SUB'); storm(.8); put(lman, SUBX + 9, 0, -30, -Math.PI / 2 + .5); CLOUD.visible = true; CLOUD.position.set(SUBX + 9, 22, -30);
  const hit = strikes.findIndex(s => L.lt >= s && L.lt < s + .16), n = strikes.filter(s => L.lt >= s).length; BOLT.visible = hit >= 0; BOLT.position.set(SUBX + 9, 22, -30); BOLT.scale.setScalar(.95); if (hit >= 0) grade.uniforms.flash.value = .22;
  applyPose(lman, n ? { aLz: 1.8 + Math.sin(L.T * 40) * .2, aRz: 1.8 - Math.sin(L.T * 40) * .2, lLx: .2, lRx: -.2, headZ: Math.sin(L.T * 30) * .1 } : { aLz: .1, aRz: .1, headX: -.4 }); face(lman, n ? { eyes: 'wide', mouth: 'shout', soot: 1, brows: -.5 } : { eyes: 'open', mouth: 'o', headX: -.4 }, L.T); if (n) starsAt(lman, L.T);
  onFace(lman, 13, 1, -2, 50, L.k, 12); if (n) badge('red', n + '×', W / 2, H * .16, L.lt - strikes[n - 1]); sh(V(SUBX + 9, 0, -30), 20); }, [[0, 'rumble', .6], ...strikes.flatMap(s => [[s, 'zap', .8], [s + .02, 'thump', .7]]), [strikes[2] + .3, 'shout_m', .4]]);
// 8 Jetzt gehört ihm eine Villa
shot(wt('jetzt', B1), 'W', null, L => { use('SUB'); put(lman, SUBX + 1, 0, -184, 0); applyPose(lman, { ...CHEER, aLx: 2.2, aRx: 2.2 }); face(lman, { eyes: 'happy', mouth: 'grin', soot: 1 }, L.T); starsAt(lman, L.T); put(ex[5], SUBX - 5, 0, -190, .5); applyPose(ex[5], { aRx: 1.3, aRe: .8 }); face(ex[5], { eyes: 'open', mouth: 'smile' }, L.T);
  cm([SUBX + 14, 3, -160, SUBX, 12, -200, 56], [SUBX + 8, 3.4, -162, SUBX, 12, -200, 54], L.k); badge('tag', 'VILLA', W / 2, H * .14, L.lt - .3); sh(V(SUBX, 0, -195), 40); }, [[0, 'sparkle', .6], [.3, 'cheer', .4], [.8, 'birds', .4]]);
// 9 el hombre más rico de la ciudad, en su piscina
const PP = V(SUBX - 70, 0, -100); POOL.parent.remove(POOL); SUB.g.add(POOL); POOL.position.set(-70, 0, -100);
shot(st(10), 'Z', null, L => { use('SUB'); put(tyc, PP.x - 5, 0, PP.z + 6, .5); applyPose(tyc, { aRx: 1.4, aRe: 1.5, headX: -.05, ...idlePose(L.T) }); face(tyc, { eyes: 'open', mouth: 'smirk', brows: .2 }, L.T); put(ex[6], PP.x + 4, 0, PP.z + 8, -.6); applyPose(ex[6], { aLx: 1.2, aLe: .6 }); face(ex[6], { eyes: 'open', mouth: 'smile' }, L.T);
  onFace(tyc, 15, 1.5, 4, 48, L.k, 13); badge('tag', 'REICHSTER MANN', W / 2, H * .14, L.lt - .3); money(6, PP.x - 5, 4, PP.z + 6, L.T, 3, .5); sh(PP, 24); }, [[0, 'water_bloop', .4], [.3, 'coins', .5], [.8, 'sip', .5]]);
// 10 su jet privado cae en picado (zoom lento + riser → golpe)
const CR = wt('Pool', st(11));
shot(st(11), 'C', 'slow', L => { use('SUB'); const k = easeIn(L.k); JET.visible = true; JET.scale.setScalar(.85); JET.position.set(lerp(PP.x + 30, PP.x, k), lerp(46, 1, k), lerp(PP.z - 20, PP.z, k)); JET.rotation.set(.6, -Math.PI / 2 + .9, .3 + L.lt); smokeAt(JET.position.x + 6, JET.position.y + 3, JET.position.z - 4, .6, 0x5a5a5a, .8);
  put(tyc, PP.x - 6, 0, PP.z + 7, .3); applyPose(tyc, { aLz: 1.2, aRx: 2.4, aRe: .1, headX: -.6 }); face(tyc, { eyes: 'wide', mouth: 'shout', brows: -.6 }, L.T);
  cm([PP.x - 14, 3, PP.z + 22, PP.x + 8, 18, PP.z - 10, 58], [PP.x - 12, 3, PP.z + 20, PP.x + 4, 12, PP.z - 6, 52], L.k); sh(PP, 26); }, [[0, 'jet', .8], [.5, 'alarm', .4], [.9, 'scream_girl', .3]]);
// 11 ¡SPLASH! en la piscina
shot(CR, 'R', null, L => { use('SUB'); JET.visible = true; JET.scale.setScalar(.55); JET.position.set(PP.x, -1.5, PP.z); JET.rotation.set(1.1, -Math.PI / 2 + .9, .3); splashAt(V(PP.x, 1, PP.z), L.lt, 2.4); smokeAt(PP.x, 1, PP.z, clamp(L.lt), 0xffffff, 1.3);
  put(tyc, PP.x - 6, 0, PP.z + 7, .3); applyPose(tyc, { aLz: 1.4, aRz: 1.4, lean: -.25 }); face(tyc, { eyes: 'wide', mouth: 'o', tears: 1 }, L.T);
  cm([PP.x - 4, 6, PP.z + 24, PP.x, 3, PP.z, 52], [PP.x - 4, 6.6, PP.z + 21, PP.x, 3, PP.z, 50], L.k); sh(PP, 26); }, [[0, 'explosion', .7], [.02, 'splash', 1], [.3, 'water_bloop', .6], [.6, 'gasp_old', .5]]);
// 12 50 Millionen Euro
shot(st(12), 'S', null, L => { use('SUB'); JET.visible = true; JET.scale.setScalar(.55); JET.position.set(PP.x, -1.5, PP.z); JET.rotation.set(1.1, -Math.PI / 2 + .9, .3); put(tyc, PP.x - 6, 0, PP.z + 7, .3); applyPose(tyc, { ...CHEER, lean: -.15 }); face(tyc, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T);
  money(40, PP.x - 6, 6, PP.z + 7, L.T, 8, 1.4); onFace(tyc, 13, .5, -3, 50, L.k, 11); badge('green', '+50.000.000 €', W / 2, H * .17, L.lt - .1); sh(PP, 26); }, [[0, 'cash', .9], [.1, 'money_rain', .8], [.4, 'laugh_deep', .6], [1.1, 'coins', .6]]);
// 13 Aber ich? — golpe de zoom a Finn
shot(st(13), 'C', null, L => { use('G'); traffic(L.T, 2); put(finn, -10, 0, -30, .3); applyPose(finn, { aRx: .9, aRe: 1.9, aRz: -.6, headX: .1 }); face(finn, { eyes: 'open', mouth: 'flat', brows: -.2 }, L.T); onFace(finn, 9, .3, 0, 44 * punch(L.lt, .02, .3), 0); sh(V(-10, 0, -30), 16); }, [[0, 'zoom_fast', .8], [.02, 'impact_soft', .6]]);
// 14 Ich heiße Finn (saluda delante de su casa)
shot(wt('heiße', st(14)), 'W', null, L => { use('SUB'); put(finn, SUBX - 12, 0, 22, Math.PI / 2 - .4); applyPose(finn, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 12) * .25, aRe: .4 }); talkFace(finn, L.T, L.t0, L.t1, { eyes: 'happy', mouth: 'grin' });
  onFace(finn, 10, .6, 2, 46, L.k, 8.5); badge('tag', 'FINN', W / 2, H * .14, L.lt - .2); sh(V(SUBX - 12, 0, 22), 20); }, [[0, 'pop', .5], [.3, 'birds', .4], [.9, 'cloth', .4]]);
// 15 riesiges Problem
shot(wt('riesiges', st(14)), 'Z', null, L => { use('SUB'); put(finn, SUBX - 12, 0, 22, Math.PI / 2 - .2); applyPose(finn, { aRx: 2.4, aRe: 2.1, aRz: -.5, headZ: .15 }); face(finn, { eyes: 'open', mouth: 'frown', brows: -.7, sweat: 1 }, L.T);
  onFace(finn, 8, .4, -1.6, 44, L.k, 7); badge('red', 'PROBLEM!', W / 2, H * .16, L.lt - .25); sh(V(SUBX - 12, 0, 22), 20); }, [[0, 'whoosh_soft', .5], [.25, 'impact', .7], [.5, 'hmm', .5]]);
// 16 Ich hatte noch nie Pech (zoom lento, viñeta, riser → golpe)
shot(st(15), 'S', 'slow', L => { use('SUB'); put(finn, SUBX - 12, 0, 22, Math.PI / 2); applyPose(finn, { aLz: .3, aRz: .3, headX: .1 }); face(finn, { eyes: 'half', mouth: 'flat', brows: -.4 }, L.T); clover.visible = true; clover.position.copy(handP(finn)).add(V(0, .3, 0));
  onFace(finn, 9, .4, 0, 42, L.k, 5.5); badge('big', '0× PECH', W / 2, H * .16, L.lt - .2); }, [[.2, 'heartbeat', .5]]);
// 17 Jeden Tag passiert mir etwas Gutes: cae una moneda a sus pies y la atrapa
shot(st(16), 'Z', null, L => { use('SUB'); walkTo(finn, SUBX - 7, 10, Math.PI, L.T, Math.min(L.lt, 1), 2.4, false, .55); const p = finn.root.position; if (L.lt > 1) { applyPose(finn, { aRx: 1.7, aRe: .5, crouch: clamp((L.lt - 1) * 2) * .3, headX: .3 }); face(finn, { eyes: 'happy', mouth: 'grin' }, L.T); } else face(finn, { eyes: 'open', mouth: 'smile' }, L.T);
  coin.visible = true; const ct = clamp(L.lt / 1.1); coin.position.set(p.x + .5, Math.max(.2, 9 - 9 * ct * ct + (ct > .99 ? 0 : 0)), p.z - 1.6); if (L.lt > 1.05) coin.position.copy(handP(finn)).add(V(0, .4, 0)); coin.rotation.set(L.T * 9, 0, .4);
  if (L.lt > 1.05) BAD.push({ kind: 'bubble', text: 'GLÜCK!', w3: hp(finn).add(V(0, 2.6, 0)), s: spring((L.lt - 1.05) * 1.6), a: 1 }); onFace(finn, 11, 1.4, 3, 46, L.k, 9); sh(p, 18); }, [[0, 'steps', .5], [.6, 'sparkle', .5], [1.05, 'coin_flip', .8], [1.3, 'pling', .6], [2, 'birds', .4]]);
// 18 Eines Morgens verpasse ich den Schulbus
shot(st(17), 'W', null, L => { use('SUB'); day(.92); SBUS.visible = true; SBUS.rotation.y = Math.PI; SBUS.position.set(SUBX - 3.5, 0, 0 - L.lt * 8); walkTo(finn, SUBX - 8.6, 22, Math.PI, L.T, L.lt, 5, true); applyPose(finn, { ...runPose(L.T), aRx: 2.4, aRe: .3 }); face(finn, { eyes: 'wide', mouth: 'shout', sweat: 1 }, L.T);
  const p = finn.root.position; cm([p.x + 6, 4, p.z + 10, p.x - 1, 3.4, p.z - 6, 52], [p.x + 5, 4, p.z + 9, p.x - 1, 3.4, p.z - 6, 50], L.k); badge('tag', 'SCHULBUS', W / 2, H * .14, L.lt - .3); sh(p, 26); }, [[0, 'steps_run', .6], [.1, 'car', .6], [.6, 'whoosh_soft', .4], [1.2, 'shout_m', .3]]);
// 19 Endlich, denke ich, 100 Euro!
shot(st(18), 'C', null, L => { use('SUB'); day(.92); put(finn, SUBX - 8.6, 0, 12, Math.PI / 2 + .3); const pm = Math.sin(clamp(L.lt * 3) * Math.PI); applyPose(finn, { aRx: 2.2 + pm * .6, aRe: 1.4, aLz: .3 }); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T);
  if (L.lt > wt('100', st(18)) - L.t0 - .1) pillOn(finn, '+100 €?', L.lt - (wt('100', st(18)) - L.t0 - .1)); onFace(finn, 10, .4, 0, 46, L.k, 8); sh(V(SUBX - 8, 0, 12), 18); }, [[0, 'gasp', .5], [.4, 'fist', .6], [wt('100', st(18)) - st(18), 'cash', .7], [wt('100', st(18)) - st(18) + .2, 'pling', .5]]);
// 20 Doch genau in dem Moment hält eine Limousine
const FD = wt('Fahrer', st(19));
shot(st(19), 'R', null, L => { use('SUB'); day(.92); const k = easeOut(clamp(L.lt / 1.4)); LIMO.visible = true; LIMO.position.set(SUBX - 3.6, 0, lerp(50, 12, k)); LIMO.rotation.y = Math.PI; put(finn, SUBX - 8.6, 0, 12, Math.PI / 2 + .4 * k); applyPose(finn, k > .6 ? { aLz: .9, aRz: .9, aLe: 1.2, aRe: 1.2 } : {}); face(finn, k > .6 ? { eyes: 'wide', mouth: 'o' } : { eyes: 'happy', mouth: 'smile' }, L.T);
  cm([SUBX - 6, 7, -8, SUBX - 6, 3.2, 14, 52], [SUBX - 6, 7, -6.6, SUBX - 6, 3.2, 14, 50], L.k); sh(V(SUBX - 5, 0, 12), 22); }, [[0, 'car', .7], [1.1, 'wheels', .6], [1.4, 'thud', .4], [1.7, 'gasp', .4]]);
// 21 el chófer abre la puerta, Finn sube
shot(FD, 'S', null, L => { use('SUB'); day(.92); LIMO.visible = true; LIMO.position.set(SUBX - 3.6, 0, 12); LIMO.rotation.y = Math.PI; put(drv, SUBX - 7.6, 0, 9, Math.PI / 2 + .3); applyPose(drv, { lean: .35, aLx: .4, aRx: 1.1, aRz: .5, headX: .3 }); face(drv, { eyes: 'happy', mouth: 'smile' }, L.T);
  walkTo(finn, SUBX - 8.8, 15.5, Math.PI * .85, L.T, L.lt, 1.4, false, .5); face(finn, { eyes: 'open', mouth: 'flat', brows: -.3 }, L.T); bubble(drv, 'GRATIS!', L.lt - .5, 2.2);
  cm([SUBX - 13, 6, 1, SUBX - 7.6, 3.8, 12, 50], [SUBX - 12.6, 6, 1.6, SUBX - 7.6, 3.8, 12, 48], L.k); sh(V(SUBX - 7, 0, 12), 18); }, [[0, 'door_open', .6], [.4, 'steps', .4], [1.2, 'cloth', .4], [1.8, 'door_slam', .5]]);
// 22 0 Euro: Finn asoma por el techo de la limusina, con cara larga
shot(st(20), 'C', null, L => { use('G'); traffic(L.T, 3); LIMO.visible = true; LIMO.rotation.y = Math.PI; LIMO.position.set(-3.6, 0, -40 - L.lt * 9); put(finn, -3.6, 1.6, LIMO.position.z - 2, Math.PI); applyPose(finn, { aLz: .6, aRz: .6, aLe: 1, aRe: 1 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.5 }, L.T);
  const h = hp(finn); cam([h.x + 2.4, h.y + 2.4, h.z - 10], [h.x, h.y - .6, h.z], 46); pillOn(finn, '0 €', L.lt - .05, 'pay', 2.4); sh(h, 16); }, [[0, 'sad_tone', .6], [.1, 'car', .5]]);
// 23 se pone en medio de la tormenta
shot(st(21), 'W', null, L => { use('SUB'); storm(1); CLOUD.visible = CLOUD2.visible = true; CLOUD.position.set(SUBX - 20, 30, 0); CLOUD.scale.setScalar(2); CLOUD2.position.set(SUBX + 10, 34, -20); CLOUD2.scale.setScalar(2.4);
  walkTo(finn, SUBX - 12, 18, Math.PI / 2, L.T, Math.min(L.lt, 1.2), 4, false, .6); if (L.lt > 1.2) applyPose(finn, { aLz: 1.5, aRz: 1.5, headX: -.4 }); face(finn, { eyes: 'happy', mouth: 'grin' }, L.T); const fl = Math.sin(L.lt * 9) > .9; BOLT.visible = fl; BOLT.position.set(SUBX + 40, 40, -60); BOLT.scale.setScalar(3); if (fl) grade.uniforms.flash.value = .3;
  const p = finn.root.position; cm([p.x + 10, 3, p.z + 6, p.x, 6, p.z - 2, 56], [p.x + 9, 3.2, p.z + 5, p.x, 6, p.z - 2, 54], L.k); sh(p, 20); }, [[0, 'rumble', .7], [.3, 'wind', .6], [.8, 'door_slam', .4], [1.3, 'zap', .5], [1.5, 'thump', .5]]);
// 24 um klitschnass zu werden: espera con los ojos cerrados
shot(wt('klitschnass', st(21)) - .4, 'Z', null, L => { use('SUB'); storm(1); CLOUD.visible = true; CLOUD.position.set(SUBX - 6, 18, 18); CLOUD.scale.setScalar(1); put(finn, SUBX - 6, 0, 18, Math.PI / 2 - .3); applyPose(finn, { aLz: 1.5, aRz: 1.5, headX: -.5, aLx: .3, aRx: .3 }); face(finn, { eyes: 'closed', mouth: 'smile' }, L.T); RAIN.at(V(SUBX - 6, 0, 18), L.T, .1, 6, 16);
  onFace(finn, 9, 1.8, 1, 46, L.k, 7.6); badge('tag', 'KLITSCHNASS?', W / 2, H * .14, L.lt - .3); }, [[0, 'wind', .5], [.4, 'drip', .6], [1.0, 'drip', .5]]);
// 25 en cuanto sale, deja de llover y vuelve el sol
shot(st(22), 'F', null, L => { use('SUB'); const k = easeInOut(clamp(L.lt / 1.6)); storm(1 - k); CLOUD.visible = true; CLOUD.position.set(SUBX - 6 + k * 40, 22 + k * 10, 18); CLOUD.scale.setScalar(1 - k * .3); put(finn, SUBX - 6, 0, 18, Math.PI / 2 - .3); applyPose(finn, { aLz: 1.5 - k, aRz: 1.5 - k, headX: -.6 }); face(finn, { eyes: k > .3 ? 'wide' : 'closed', mouth: k > .3 ? 'o' : 'smile' }, L.T);
  onFace(finn, 10, -1.6, 0, 52, L.k, 8.6); sh(V(SUBX - 6, 0, 18), 20); }, [[0, 'flash', .5], [.2, 'wind', .4], [.6, 'sunrise_shine', .7], [1.6, 'birds', .5]]);
// 26 ...und ein Regenbogen erscheint
shot(wt('Regenbogen', st(22)), 'S', null, L => { use('SUB'); RB.visible = true; RB.position.set(SUBX - 4, -6, -60); RB.scale.setScalar(.6 + .4 * easeOut(clamp(L.lt * 2))); put(finn, SUBX - 6, 0, 16, Math.PI); applyPose(finn, { aLz: .2, aRz: .2, headX: -.2, lean: .1 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.5 }, L.T);
  const p = finn.root.position; cm([p.x + .6, 3, p.z + 11, p.x, 8, p.z - 30, 60], [p.x + .5, 3, p.z + 10, p.x, 8.6, p.z - 30, 58], L.k); sh(p, 26); }, [[0, 'sparkle', .7], [.3, 'choir', .5], [.9, 'birds', .5], [1.4, 'sigh_kid', .5]]);
// 27 Wieder 0 Euro
shot(st(23), 'C', null, L => { use('SUB'); RB.visible = true; RB.position.set(SUBX - 4, -6, -60); put(finn, SUBX - 6, 0, 16, 0); applyPose(finn, { aLz: .3, aRz: .3, aLe: 1.6, aRe: 1.6, aLx: .4, aRx: .4 }); face(finn, { eyes: 'squint', mouth: 'teeth', brows: .8, veins: 1 }, L.T);
  onFace(finn, 7.6, .4, 0, 44, L.k, 6.4); badge('red', '0 €', W / 2, H * .16, L.lt - .1); }, [[0, 'impact', .7], [.2, 'sad_tone', .5], [.6, 'growl', .3]]);
// 28 Also kaufe ich ein Lotterielos, um zu verlieren
const LB = V(12.4, 0, -60);
shot(st(24), 'W', null, L => { use('G'); drawLotto(0, L.T); put(clk, LB.x + 1.8, 0, LB.z, -Math.PI / 2); applyPose(clk, { aRx: 1.4, aRe: .4 }); face(clk, { eyes: 'happy', mouth: 'smile' }, L.T); put(finn, LB.x - 4.4, 0, LB.z + .6, Math.PI / 2); applyPose(finn, { aRx: 1.3, aRe: .2 }); face(finn, { eyes: 'squint', mouth: 'smirk', brows: .4 }, L.T);
  TICK.visible = true; const k = clamp((L.lt - .9) / .6); TICK.position.copy(handP(clk)).lerp(handP(finn), k).add(V(0, .5, 0)); TICK.rotation.y = -Math.PI / 2;
  cm([LB.x - 17, 8, LB.z + 11, LB.x - 2, 5, LB.z, 50], [LB.x - 16, 8, LB.z + 10, LB.x - 2, 5, LB.z, 48], L.k); bubble(finn, 'BITTE VERLIEREN!', L.lt - .2, 2.4); sh(LB, 18); }, [[0, 'door_bell', .5], [.4, 'coins', .5], [.9, 'paper', .6], [1.6, 'ratchet', .3]]);
// 29 Stattdessen knacke ich den Jackpot (zoom lento → golpe)
shot(st(25), 'Z', 'slow', L => { use('G'); drawLotto(1, L.T); put(clk, LB.x + 1.8, 0, LB.z, -Math.PI / 2); applyPose(clk, CHEER); face(clk, { eyes: 'happy', mouth: 'grin' }, L.T); put(finn, LB.x - 4.4, 0, LB.z + .6, Math.PI / 2 - .5); applyPose(finn, { aLz: 1.3, aRz: 1.3, aLe: 1.5, aRe: 1.5 }); face(finn, { eyes: 'wide', mouth: 'o', sweat: 1 }, L.T);
  confettiAt(LB.x - 2, 2, LB.z, L.T, 7); TICK.visible = true; TICK.position.copy(handP(finn)).add(V(0, .5, 0)); TICK.rotation.y = -Math.PI / 2; cm([LB.x - 17, 6, LB.z - 9, LB.x - 2, 5.4, LB.z, 52], [LB.x - 14, 6, LB.z - 7, LB.x - 2, 5.4, LB.z, 44], L.k); badge('big', 'JACKPOT!', W / 2, H * .15, L.lt - .2); sh(LB, 18); }, [[0, 'party_horn', .6], [.1, 'cash', .8], [.4, 'confetti', .5], [.8, 'cheer', .4]]);
// 30 Das Problem:
shot(st(26), 'C', null, L => { use('G'); drawLotto(1, L.T); put(finn, LB.x - 4.4, 0, LB.z + .6, 0); applyPose(finn, { aRx: .9, aRe: 2, aRz: -.4 }); face(finn, { eyes: 'open', mouth: 'flat', brows: -.6, sweat: 1 }, L.T); onFace(finn, 7, .3, 1, 44 * punch(L.lt, .02, .2), 0); }, [[0, 'thump', .6], [.3, 'hmm', .4]]);
// 31 Gewinnen zählt nicht als Pech: el funcionario sella "KEIN PECH"
shot(st(27), 'S', null, L => { use('PAI'); drawPA('zero'); put(off, PAX, 0, -7.4, 0); const k = clamp((L.lt - .6) / .25); applyPose(off, { aRx: lerp(1.9, 1.1, k), aRe: lerp(1.2, .3, k), aLx: .8, aLe: .6 }); face(off, { eyes: 'half', mouth: 'flat', brows: .5 }, L.T); put(finn, PAX + 1, 0, 1, Math.PI); applyPose(finn, { aRx: 1.3 }); face(finn, { eyes: 'open', mouth: 'o' }, L.T);
  cm([PAX - 3, 6.4, 9, PAX, 6, -6, 50], [PAX - 2.6, 6.4, 8.2, PAX, 6, -6, 48], L.k); if (L.lt > .85) badge('red', 'KEIN PECH', W / 2, H * .17, L.lt - .85); badge('tag', 'GEWINN ≠ PECH', W / 2, H * .27, L.lt - .3); sh(V(PAX, 0, -3), 16); }, [[0, 'pages', .5], [.6, 'whoosh_soft', .4], [.85, 'stamp', .9], [1.2, 'sigh', .4]]);
// 32 Und weil ich noch ein Kind bin: mostrador del banco demasiado alto
shot(st(28), 'W', null, L => { use('VLT'); put(bank, VAX + 2, 0, -2, -.4); applyPose(bank, { aRx: 1.5, aRe: .4, aRz: Math.sin(L.T * 10) * .2 }); face(bank, { eyes: 'half', mouth: 'smirk', brows: .4 }, L.T); put(finn, VAX - 3, 0, 3, .6); applyPose(finn, { aRx: 2.8, aRe: .1, aLx: 2.8, aLe: .1 }); face(finn, { eyes: 'open', mouth: 'o', brows: -.4 }, L.T); TICK.visible = true; TICK.position.copy(handP(finn)).add(V(0, .6, 0));
  cm([VAX - 6, 5, 14, VAX - .5, 5, -1, 50], [VAX - 5.4, 5, 13, VAX - .5, 5, -1, 48], L.k); badge('tag', 'ERST AB 18', W / 2, H * .14, L.lt - .4); sh(V(VAX, 0, 0), 16); }, [[0, 'steps', .4], [.4, 'paper', .5], [1.0, 'tick', .6], [1.3, 'tick', .5]]);
// 33 ...landet alles auf einem gesperrten Sparkonto: se cierra la cámara acorazada
shot(wt('landet', st(28)), 'R', null, L => { use('VLT'); const k = clamp(L.lt / .9); VLT.wheel.rotation.z = -k * 4; VLT.chains.scale.setScalar(.2 + .8 * easeOut(clamp((L.lt - .7) / .4))); VLT.lock.position.y = 9 + (1 - easeOut(clamp((L.lt - 1.1) / .3))) * 6; money(16, VAX, 4, -8, L.T, 5, 2);
  put(finn, VAX - 6, 0, -2, .9); applyPose(finn, { aRx: 2.6, aRe: 2.2, aLx: 2.6, aLe: 2.2 }); face(finn, { eyes: 'wide', mouth: 'shout', brows: -.6 }, L.T);
  cm([VAX + 3, 7, 10, VAX, 8, -12, 54], [VAX + 2.4, 7, 8.6, VAX, 8.4, -12, 52], L.k); if (L.lt > 1.2) badge('red', 'GESPERRT', W / 2, H * .16, L.lt - 1.2); sh(V(VAX, 0, -6), 16); }, [[0, 'money_rain', .5], [.3, 'gears', .6], [.8, 'chain_rattle', .8], [1.2, 'click_metal', .8], [1.3, 'door_slam', .6]]);
// 34 Ich bin also immer noch pleite: bolsillos vacíos
shot(st(29), 'Z', null, L => { use('G'); traffic(L.T, 3); put(finn, -10.6, 0, -76, .4); applyPose(finn, SHRUG); face(finn, { eyes: 'half', mouth: 'frown', brows: -.7 }, L.T); smokeAt(finn.root.position.x, 1.6, finn.root.position.z + .8, clamp(L.lt * .8) * .4, 0xd8c8a8, .25);
  onFace(finn, 10, .6, 2, 46, L.k, 8.4); badge('red', 'PLEITE', W / 2, H * .16, L.lt - .3); sh(V(-10, 0, -76), 16); }, [[0, 'cloth', .6], [.3, 'sad_tone', .6], [.9, 'cough', .4]]);
// 35 Währenddessen... mein bester Freund (en el baño, con el móvil)
const KL = wt('Klo', st(30));
shot(st(30), 'S', null, L => { use('BATH'); put(buddy, BAX + 2.4, 0, -3, -.5); applyPose(buddy, { ...HOLD, aLx: 1.0, headX: .4, lean: .1 }); face(buddy, { eyes: 'open', mouth: 'grin' }, L.T); PH.visible = true; PH.position.copy(handP(buddy, 0).add(handP(buddy)).multiplyScalar(.5)).add(V(0, .5, .3)); PH.rotation.set(-.4, -.5, 0);
  cm([BAX + 8, 7, 8, BAX + 1, 4, -4, 50], [BAX + 7.4, 7, 7.4, BAX + 1, 4, -4, 48], L.k); badge('tag', 'MEIN BESTER FREUND', W / 2, H * .14, L.lt - .3); sh(V(BAX, 0, -4), 14); }, [[0, 'notif', .5], [.5, 'button', .5], [1.1, 'kids_laugh', .3], [1.6, 'button', .4]]);
// 36 ...lässt sein Handy ins Klo fallen
shot(wt('Handy', st(30)), 'Z', null, L => { use('BATH'); const k = clamp(L.lt / .7), bp = BATH.bowlPos; put(buddy, BAX + 1.4, 0, -3, -.3); applyPose(buddy, { aRx: 1.6, aRe: .2, aLz: 1.2, lean: .3 }); face(buddy, { eyes: 'wide', mouth: 'shout', brows: -.6 }, L.T);
  PH.visible = k < 1; const a = handP(buddy).add(V(0, .4, .5)); PH.position.set(lerp(a.x, bp.x, k), lerp(a.y, bp.y, k) + Math.sin(k * Math.PI) * 1.2, lerp(a.z, bp.z, k)); PH.rotation.set(k * 9, k * 4, 0); if (L.lt > .7) splashAt(bp, L.lt - .7, .6);
  cm([BAX - 4, 8, 4, BAX - 1.4, 3.2, -6, 50], [BAX - 3.6, 7.6, 3.4, BAX - 1.6, 3, -6.4, 46], L.k); sh(V(BAX, 0, -5), 14); }, [[0, 'gasp', .5], [.3, 'whoosh_soft', .5], [.7, 'splash', .9], [.85, 'water_bloop', .7]]);
// 37 10.000 Euro
shot(st(31), 'C', null, L => { use('BATH'); put(buddy, BAX + 1.4, 0, -2, -.4); applyPose(buddy, CHEER); face(buddy, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T); money(30, BAX + 1.4, 6, -2, L.T, 7, 1.4); onFace(buddy, 10, .6, 2, 48, L.k, 8.4); badge('green', '+10.000 €', W / 2, H * .17, L.lt - .1); }, [[0, 'cash', .9], [.2, 'money_rain', .7], [.5, 'cheer', .4]]);
// 38 ...und er kauft sich einen Sportwagen (pasa delante de Finn)
shot(wt('kauft', st(31)), 'W', null, L => { use('G'); CAR.visible = true; CAR.rotation.y = Math.PI; CAR.position.set(-3.8, 0, -64 - L.lt * 14); CAR.userData.wheels.forEach(w => w.rotation.x = -L.T * 12); sit(buddy, -3.8, 2.1, CAR.position.z + .6, Math.PI, { aLx: 1.2, aRx: 2.6, aRe: .3 }); face(buddy, { eyes: 'happy', mouth: 'grin' }, L.T);
  put(finn, -10.4, 0, -82, .9); applyPose(finn, { aLz: .2, aRz: .2, headY: .5 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.6, look: [.6, 0] }, L.T);
  cm([-6, 6, -96, -6, 3, -78, 54], [-6.4, 6, -95, -6, 3, -78, 52], L.k); sh(V(-6, 0, -80), 22); }, [[0, 'car_pass', .9], [.3, 'whistle', .4], [.9, 'sigh_kid', .5], [1.3, 'party_horn', .3]]);
// 39 Jetzt reicht's!
shot(st(32), 'Z', null, L => { use('G'); put(finn, -10.4, 0, -82, .4); const st_ = Math.abs(Math.sin(L.lt * 8)); applyPose(finn, { aLz: .3, aRz: .3, aLe: 1.9, aRe: 1.9, aLx: .5, aRx: .5, lLx: st_ * .5, lLk: st_ * .6 }); face(finn, { eyes: 'squint', mouth: 'teeth', brows: 1, veins: 1 }, L.T);
  onFace(finn, 7.4, .4, -1, 44 * punch(L.lt, .02, .3), 0); badge('red', 'JETZT REICHT\'S!', W / 2, H * .16, L.lt - .05); }, [[0, 'impact', .8], [.25, 'thud', .6], [.5, 'growl', .4]]);
// 40 ...gehe ich zum offiziellen Pech-Amt
shot(st(33), 'S', null, L => { use('G'); walkTo(finn, 0, -150, Math.PI, L.T, L.lt, 3.4, false, .7); face(finn, { eyes: 'squint', mouth: 'flat', brows: .7 }, L.T); FT.userData.update(L.T); walkTo(ex[7], 8, -186, Math.PI / 2, L.T, L.lt, 2); walkTo(ex[8], -10, -184, -Math.PI / 2, L.T + .5, L.lt, 2);
  const p = finn.root.position; cm([p.x - 2, 2.2, p.z + 9, 0, 16, -205, 56], [p.x - 2, 2.4, p.z + 7.4, 0, 16, -205, 54], L.k); badge('tag', 'PECH-AMT', W / 2, H * .14, L.lt - .4); sh(V(0, 0, -170), 50); }, [[0, 'steps', .6], [.6, 'steps', .5], [1.3, 'wind', .3], [2.0, 'door_open', .5]]);
// 41 Der Mitarbeiter scannt mein Gesicht
const SC = wt('schaut', st(34));
shot(st(34), 'W', null, L => { use('PAI'); drawPA('scan', clamp(L.lt / (SC - L.t0))); put(off, PAX, 0, -7.4, 0); applyPose(off, { aRx: 1.3, aRe: .8, aLx: .9, aLe: .9 }); face(off, { eyes: 'squint', mouth: 'flat', brows: .3 }, L.T); put(finn, PAX + 3, 0, -.6, Math.PI - .9); applyPose(finn, { aLz: .2, aRz: .2 }); face(finn, { eyes: 'closed', mouth: 'flat' }, L.T);
  const hd = PAI.head.getWorldPosition(V(0, 0, 0)), hf = hp(finn); PAI.beam.visible = true; PAI.beam.position.copy(hd).lerp(hf, .5).add(V(0, .3, 0)); PAI.beam.lookAt(hf); PAI.beam.rotateX(Math.PI / 2); PAI.beam.scale.set(.4, hd.distanceTo(hf) / 8, .4); PAI.head.rotation.x = -.5 + Math.sin(L.T * 6) * .1;
  cm([PAX + 10, 6.6, 3.6, PAX + 2.2, 5.2, -2, 50], [PAX + 9.4, 6.6, 3, PAX + 2.2, 5.2, -2, 48], L.k); sh(V(PAX, 0, -3), 16); }, [[0, 'power_on', .6], [.3, 'hum', .5], [.8, 'glitch', .3], [1.4, 'button', .5]]);
// 42 schaut auf den Bildschirm und fängt an zu lachen (zoom lento → golpe en "0% Pech")
shot(SC, 'C', 'slow', L => { use('PAI'); drawPA('scan', 1); put(off, PAX, 0, -7.4, .5); const lg = L.lt > .9; applyPose(off, lg ? { aLz: .8, aRz: .8, aLe: 1.8, aRe: 1.8, lean: -.2 + Math.sin(L.T * 22) * .08, headX: -.3 } : { headY: -.6, headX: -.2 }); face(off, lg ? { eyes: 'happy', mouth: 'grin', tears: 1 } : { eyes: 'open', mouth: 'o' }, L.T);
  onFace(off, 10, 2.2, -3, 46, L.k, 6.4); if (lg) bubble(off, 'HAHAHA!', L.lt - .9, 2.2); }, [[.9, 'laugh_m', .8], [1.4, 'laugh_deep', .5]]);
// 43 „0% Pech“: la pantalla gigante
shot(st(35), 'F', null, L => { use('PAI'); drawPA('zero'); put(off, PAX - 4, 0, -7.4, .6); applyPose(off, { aLz: .8, aRz: .8, aLe: 1.8, aRe: 1.8, lean: -.2 + Math.sin(L.T * 22) * .08 }); face(off, { eyes: 'happy', mouth: 'grin' }, L.T); put(finn, PAX + 2, 0, -2, Math.PI); applyPose(finn, { headX: -.4, aLz: .5, aRz: .5 });
  cm([PAX - 3, 6, 8, PAX, 12, -14, 56], [PAX - 2.6, 6, 7, PAX, 12.4, -14, 54], L.k); badge('red', '0% PECH', W / 2, H * .62, L.lt - .2); }, [[0, 'alarm_soft', .6], [.3, 'glitch', .5], [.6, 'laugh_m', .4]]);
// 44 Ich kann es nicht fassen
shot(st(36), 'Z', null, L => { use('PAI'); drawPA('zero'); put(finn, PAX + 2, 0, -2, 0); applyPose(finn, { aRx: 2.4, aRe: 2.1, aLx: 2.4, aLe: 2.1, aRz: -.3, aLz: -.3 }); face(finn, { eyes: 'wide', mouth: 'shout', brows: -.7, sweat: 1 }, L.T); onFace(finn, 7, .3, 0, 44 * punch(L.lt, .02, .25), L.k, 6); }, [[0, 'zoom_fast', .7], [.05, 'gasp', .7], [.5, 'heartbeat', .5]]);
// 45 Darum versuche ich ein letztes Mal etwas (carretera comarcal)
shot(st(37), 'R', null, L => { use('CTRY'); walkTo(finn, CTX + 9, 0, Math.PI, L.T, L.lt, 3.2, false, .7); face(finn, { eyes: 'squint', mouth: 'flat', brows: .7 }, L.T); const p = finn.root.position;
  cm([p.x - 3, 4, p.z + 8, p.x + 1, 4, p.z - 10, 54], [p.x - 2.6, 4, p.z + 7, p.x + 1, 4, p.z - 10, 52], L.k); badge('tag', 'LETZTER VERSUCH', W / 2, H * .14, L.lt - .3); sh(p, 22); }, [[0, 'steps', .6], [.5, 'wind', .4], [1.2, 'crickets', .3], [1.7, 'steps', .5]]);
// 46 Ich steige in den Bus, der ständig liegen bleibt
shot(st(38), 'W', null, L => { use('CTRY'); const k = easeOut(clamp(L.lt / 1)); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, lerp(30, -14, k)); RBUS.userData.door.position.z = L.lt > 1.1 ? 12 : 9.6; RBUS.position.y = Math.sin(L.T * 30) * .05;
  put(bdrv, CTX + 4, 2.4, RBUS.position.z - 11, Math.PI); applyPose(bdrv, { ...SIT }); walkTo(finn, CTX + 9.6, -21, -Math.PI / 2, L.T, Math.max(0, L.lt - 1.1), 2, false, .6); face(finn, { eyes: 'squint', mouth: 'smirk', brows: .5 }, L.T);
  cm([CTX + 16, 4, -10, CTX + 5, 4, -22, 54], [CTX + 15, 4, -11, CTX + 5, 4, -22, 52], L.k); badge('tag', 'BUS 7: IMMER KAPUTT', W / 2, H * .14, L.lt - .3); sh(V(CTX + 6, 0, -20), 26); }, [[0, 'car', .6], [.9, 'steam', .5], [1.1, 'door_open', .6], [1.6, 'steps', .4]]);
// 47 Und tatsächlich: auf halber Strecke qualmt der Motor
const QM = wt('qualmt', st(39));
shot(st(39), 'S', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; const k = clamp(L.lt / (QM - L.t0)); RBUS.position.set(CTX + 4, Math.sin(L.T * 26) * .08, -80 - L.lt * 10 * (1 - k * .5)); const e = RBUS.position.clone().add(V(0, 3, 13)); smokeAt(e.x, e.y, e.z, .3 + k * .8, 0x4a4a4a, .7 + k * .5);
  cm([CTX + 18, 8, RBUS.position.z + 30, CTX + 4, 4, RBUS.position.z, 54], [CTX + 16, 8, RBUS.position.z + 28, CTX + 4, 4, RBUS.position.z, 52], L.k); sh(RBUS.position, 30); }, [[0, 'car', .6], [.5, 'machine_shake', .6], [1.2, 'cough', .4], [1.8, 'steam', .6]]);
// 48 ...qualmt der Motor: se para, humo negro, el conductor se rasca la cabeza
shot(QM, 'C', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); const e = V(CTX + 4, 3, -87); smokeAt(e.x, e.y, e.z, 1 + L.lt * .3, 0x3a3a3a, 1.3); put(bdrv, CTX + 1, 0, -84, Math.PI * .8); applyPose(bdrv, { aRx: 2.4, aRe: 2.2, aRz: -.3, headZ: .2 }); face(bdrv, { eyes: 'open', mouth: 'o', brows: -.5 }, L.T);
  cm([CTX - 4, 4, -74, CTX + 3, 4, -88, 52], [CTX - 3.4, 4, -75, CTX + 3, 4, -88, 50], L.k); sh(e, 16); }, [[0, 'metal_creak', .6], [.2, 'steam', .8], [.6, 'cough', .5]]);
// 49 Endlich!
shot(st(40), 'Z', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); smokeAt(CTX + 4, 3, -87, 1.2, 0x3a3a3a, 1.3); put(finn, CTX + 9, 0, -93, -Math.PI / 2 + .6); const j = Math.abs(Math.sin(L.lt * 7)) * 1.4; finn.root.position.y = j; applyPose(finn, { ...CHEER, lLk: j * .5, lRk: j * .5 }); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T);
  onFace(finn, 9, .4, 1, 46, L.k, 7.6); badge('green', 'ENDLICH!', W / 2, H * .16, L.lt - .05); }, [[0, 'cheer', .5], [.1, 'jump', .6], [.5, 'land', .4]]);
// 50 Doch gerade als ich jubele, taucht ein Mechaniker auf
const RP = wt('repariert', st(41));
shot(st(41), 'W', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); smokeAt(CTX + 4, 3, -87, 1.2, 0x3a3a3a, 1.2); walkTo(mech, CTX - 18, -84, Math.PI / 2 + .2, L.T, L.lt, 7, true); face(mech, { eyes: 'happy', mouth: 'grin' }, L.T); WR.visible = true; WR.position.copy(handP(mech)); WR.rotation.z = L.T * 3;
  put(finn, CTX + 9, 0, -93, -Math.PI / 2); applyPose(finn, { ...CHEER, aLx: lerp(2.8, .3, clamp(L.lt)), aRx: lerp(2.8, .3, clamp(L.lt)) }); face(finn, { eyes: 'wide', mouth: 'o' }, L.T);
  const p = mech.root.position; cm([CTX - 14, 5, -64, p.x + 3, 4, p.z, 54], [CTX - 13, 5, -65, p.x + 3, 4, p.z, 52], L.k); bubble(mech, 'ICH MACH DAS!', L.lt - .6, 2.4); sh(p, 26); }, [[0, 'steps_run', .7], [.4, 'whistle_inno', .4], [1.0, 'keys', .5], [1.6, 'gasp', .4]]);
// 51 ...und repariert ihn in 10 Sekunden
shot(RP, 'R', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); const k = clamp(L.lt / (L.t1 - L.t0)); smokeAt(CTX + 4, 3, -87, 1.2 * (1 - k), 0x3a3a3a, 1.2 * (1 - k) + .01); put(mech, CTX + 4, 0, -84.5, Math.PI); applyPose(mech, { aRx: 1.6 + Math.sin(L.T * 18) * .4, aRe: .8, lean: .4, aLx: 1.2 }); face(mech, { eyes: 'squint', mouth: 'smirk' }, L.T);
  WR.visible = true; WR.position.copy(handP(mech)); WR.rotation.set(0, 0, Math.sin(L.T * 18)); sparksAt(V(CTX + 4, 3.2, -87), L.T); cm([CTX + 12, 5, -78, CTX + 4, 3.4, -86, 50], [CTX + 11, 5, -79, CTX + 4, 3.4, -86, 48], L.k); badge('big', Math.max(0, Math.ceil(10 - k * 10)) + ' SEK', W / 2, H * .15, 1); sh(V(CTX + 4, 0, -86), 14); }, [[0, 'ratchet', .7], [.4, 'hammer', .6], [.8, 'sparks', .6], [1.2, 'weld', .4], [1.8, 'ratchet', .6], [2.1, 'ding_soft', .6]]);
// 52 Obendrauf schenkt mir der Fahrer eine lebenslange Freikarte
const LB2 = wt('lebenslange', st(42));
shot(st(42), 'S', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); put(bdrv, CTX + 8, 0, -88.5, Math.PI / 2); applyPose(bdrv, { aRx: 1.5, aRe: .3 }); face(bdrv, { eyes: 'happy', mouth: 'grin' }, L.T); put(finn, CTX + 12, 0, -88.5, -Math.PI / 2); applyPose(finn, { aRx: 1.2, aRe: .4 }); face(finn, { eyes: 'half', mouth: 'flat', brows: -.5 }, L.T);
  CARD.visible = true; CARD.position.copy(handP(bdrv)).lerp(handP(finn), clamp((L.lt - .6) / .5)).add(V(0, .5, 0)); CARD.rotation.y = -Math.PI / 2 + .4; cm([CTX + 10.6, 6, -76, CTX + 10, 4.6, -88.5, 50], [CTX + 10.4, 6, -77, CTX + 10, 4.6, -88.5, 48], L.k); sh(V(CTX + 10, 0, -89), 14); }, [[0, 'pop', .5], [.6, 'paper', .6], [1.2, 'pling', .5]]);
shot(LB2, 'Z', null, L => { use('CTRY'); put(finn, CTX + 12, 0, -89, Math.PI / 2 + 1.2); applyPose(finn, { aRx: 1.4, aRe: .9, headX: .3 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.5 }, L.T); CARD.visible = true; const h = handP(finn).add(V(0, .9, 0)); CARD.position.copy(h); CARD.rotation.y = finn.root.rotation.y;
  const a = finn.root.rotation.y; cam([h.x + Math.sin(a) * lerp(4.4, 3.6, L.k), h.y + .4, h.z + Math.cos(a) * lerp(4.4, 3.6, L.k)], [h.x, h.y, h.z], 44); badge('tag', 'LEBENSLANG GRATIS', W / 2, H * .14, L.lt - .2); }, [[0, 'sparkle', .5], [.5, 'sad_tone', .5]]);
// 53 Völlig geschlagen gehe ich nach Hause (atardecer)
shot(st(43), 'W', null, L => { use('SUB'); sunset(1); walkTo(finn, SUBX - 7, -40, 0, L.T, L.lt, 1.6, false, .45, .9); face(finn, { eyes: 'half', mouth: 'frown', brows: -.7 }, L.T); const p = finn.root.position;
  cm([p.x + 3, 3, p.z + 11, p.x, 3.6, p.z, 50], [p.x + 2.4, 3, p.z + 10.4, p.x, 3.6, p.z, 48], L.k); sh(p, 22); }, [[0, 'steps', .4], [.5, 'sigh_kid', .6], [1.1, 'crickets', .4], [1.5, 'steps', .3]]);
// 54 Alle anderen werden durch ihr Pech reich: fiesta en la villa
shot(st(44), 'C', null, L => { use('SUB'); sunset(1); for (let i = 0; i < 5; i++) { const e = [lman, ex[5], ex[9], ex[10], ex[11]][i]; put(e, SUBX - 8 + i * 4, Math.abs(Math.sin(L.T * 6 + i)) * .8, -184 + (i % 2) * 2, (i - 2) * -.15); applyPose(e, CHEER); face(e, { eyes: 'happy', mouth: 'grin' }, L.T + i); } bandOn(ex[9]); money(30, SUBX, 6, -184, L.T, 16); confettiAt(SUBX, 2, -184, L.T, 12);
  cm([SUBX + 3, 4, -164, SUBX, 5, -186, 54], [SUBX + 2.4, 4, -166, SUBX, 5, -186, 52], L.k); sh(V(SUBX, 0, -184), 26); }, [[0, 'cheer', .6], [.2, 'money_rain', .6], [.6, 'party_horn', .5], [1.2, 'laugh_m', .4]]);
// 55 nur mein Leben ist perfekt
shot(wt('nur', st(44)), 'S', null, L => { use('SUB'); sunset(1); sit(finn, SUBX - 15.4, .9, 20.4, Math.PI / 2, { aRx: 1.4, aRe: 2.2, aLx: 1.4, aLe: 2.2, headX: .2, lean: .2 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.6 }, L.T);
  cm([SUBX - 2, 4, 26, SUBX - 18, 6, 18, 52], [SUBX - 3, 4, 25.4, SUBX - 18, 6, 18, 50], L.k); badge('tag', 'PERFEKT…', W / 2, H * .14, L.lt - .3); sh(V(SUBX - 16, 0, 20), 20); }, [[0, 'birds', .5], [.6, 'sigh', .5], [1.2, 'wind', .3]]);
// 56 dormitorio de noche, sentado en la cama
shot(st(45), 'F', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, { aRx: 1.2, aLx: 1.2, aRe: 1.8, aLe: 1.8, lLx: 2.2, lRx: 2.2, lLk: 2.4, lRk: 2.4, headX: .2 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.6 }, L.T);
  cm([BEDP.x + 9, 8, BEDP.z + 14, BEDP.x, 5, BEDP.z, 50], [BEDP.x + 8.4, 8, BEDP.z + 13, BEDP.x, 5, BEDP.z, 48], L.k); sh(V(BEDP.x, 0, BEDP.z), 14); }, [[0, 'crickets', .5], [.4, 'bed_creak', .6], [1, 'owl', .3]]);
// 57 Warum passiert mir nicht ein einziges Mal etwas Schlechtes? (susurro; zoom lento → golpe con el pitido)
const EZ = wt('einziges', st(46));
shot(st(46), 'W', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, { aRx: 1.2, aLx: 1.2, aRe: 1.8, aLe: 1.8, lLx: 2.2, lRx: 2.2, lLk: 2.4, lRk: 2.4, headX: -.2 }); talkFace(finn, L.T, L.t0, L.t1, { eyes: 'half', mouth: 'frown', brows: -.7 });
  cm([BEDP.x - 6, 6, BEDP.z + 9, BEDP.x + .5, 6, BEDP.z + 2, 46], [BEDP.x - 5.4, 6, BEDP.z + 8.4, BEDP.x + .5, 6, BEDP.z + 2, 44], L.k); }, [[0, 'whisper', .5], [.8, 'sniff', .4]]);
shot(EZ, 'Z', 'slow', L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, { aRx: 1.2, aLx: 1.2, aRe: 1.8, aLe: 1.8, lLx: 2.2, lRx: 2.2, lLk: 2.4, lRk: 2.4, headX: -.2 }); talkFace(finn, L.T, L.t0, L.t1, { eyes: 'half', mouth: 'frown', brows: -.8, tears: 1 });
  onFace(finn, 8, .3, 0, 44, L.k, 4.6); }, [[.4, 'whisper', .4], [1, 'heartbeat', .4]]);
// 58 Plötzlich piept mein Handy
const NS = V(BEDP.x + 3, 3.75, BEDP.z + 3.4);
shot(st(47), 'C', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; phone.visible = true; phone.position.copy(NS); phone.rotation.set(-Math.PI / 2, 0, Math.sin(L.T * 60) * .06 * (L.lt % .6 < .3 ? 1 : 0)); phone.userData.scr.userData.draw('lock', drawLock);
  sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, .6, { headY: .6, aLz: .3 }); face(finn, { eyes: 'wide', mouth: 'o' }, L.T); cam([NS.x + 1.6, NS.y + 3.6, NS.z + 3.6], [NS.x - .6, NS.y + .4, NS.z - .4], 48 * punch(L.lt, .02, .2)); }, [[0, 'notif', .9], [.4, 'vibrate', .7], [.8, 'notif', .6]]);
// 59 Eine Nachricht:
shot(st(48), 'W', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'open', mouth: 'o', look: [0, .6] }, L.T); holdPhone(finn, 'lock', drawLock, 3.6, L.k, 3); }, [[0, 'cloth', .5], [.3, 'button', .5]]);
// 60 „Glückwunsch, Finn.
shot(st(49), 'Z', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; phoneClose('cg', drawCongr, L.k, V(BEDP.x, 6, BEDP.z + 4)); }, [[0, 'pling', .7], [.3, 'sparkle', .5]]);
// 61 Du bist offiziell der größte Pechvogel aller Zeiten
const PV = wt('Pechvogel', st(50));
shot(st(50), 'S', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; phoneClose('tt', drawTitle, L.k, V(BEDP.x, 6, BEDP.z + 4), .15); }, [[0, 'swipe', .4], [.6, 'ding_soft', .5]]);
shot(PV, 'C', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'wide', mouth: 'o', brows: -.4 }, L.T); holdPhone(finn, 'tt', drawTitle, 2.6, L.k, 2.2, 1.2); badge('big', 'PECHVOGEL Nr. 1', W / 2, H * .15, L.lt - .1); }, [[0, 'impact', .6], [.1, 'bell_far', .4], [.8, 'heartbeat', .4]]);
// 62 Ich erstarre
shot(st(51), 'Z', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'wide', mouth: 'o', brows: -.2 }, L.T); onFace(finn, 6, .2, 0, 42 * punch(L.lt, .02, .3), 0); grade.uniforms.sat.value = .9; }, [[0, 'freeze', .8], [.05, 'zoom_fast', .6]]);
// 63 Denn weiter steht da: „In einer Welt, in der Pech reich macht,
const IST = wt('ist', st(53));
shot(st(52), 'W', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; phoneClose('q1', drawQuote1, L.k, V(BEDP.x, 6, BEDP.z + 4), -.12); }, [[0, 'swipe', .5], [.8, 'pages', .4], [1.8, 'whoosh_soft', .3]]);
shot(wt('Pech', st(53)), 'C', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'open', mouth: 'o', brows: -.3, look: [0, .7] }, L.T); holdPhone(finn, 'q1', drawQuote1, 3, L.k, 2.6, -1.2); }, [[0, 'heartbeat', .5], [.6, 'tension_str', .4]]);
// 64 ist perfektes Glück das größte Pech von allen.“ (zoom lento → golpe)
shot(IST, 'R', 'slow', L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; phoneClose('q2', drawQuote2, L.k, V(BEDP.x, 6, BEDP.z + 4)); }, [[.3, 'strings', .4]]);
// 65 Und genau in diesem Moment: el dinero sale disparado del teléfono
const LD = wt('landen', st(54));
shot(st(54), 'F', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 200; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, { ...CHEER, aLx: 2.0, aRx: 2.0 }); face(finn, { eyes: 'wide', mouth: 'shout' }, L.T); money(40, BEDP.x + .5, 5, BEDP.z + 3, L.T, 10, 1.6); bloom.strength = .5;
  onFace(finn, 12, 1, 3, 50, L.k, 10); }, [[0, 'magic_hit', .7], [.1, 'money_rain', .9], [.5, 'cash', .7], [1.0, 'coins', .6]]);
// 66 ...landen 1 Milliarde Euro auf meinem Konto
shot(LD, 'Z', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 200; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'wide', mouth: 'grin' }, L.T); const v = Math.min(1e9, Math.round(Math.pow(10, 9 * easeOut(clamp(L.lt / 1.4))))); const s = v.toLocaleString('de-DE') + ' €';
  holdPhone(finn, s, (c, w, h) => drawBank2(c, w, h, s), 2.8, L.k, 2.2, -1); money(20, BEDP.x + .5, 5, BEDP.z + 3, L.T, 10); badge('green', s, W / 2, H * .16, 1); }, [[0, 'cash_reg', .8], [.4, 'coins', .7], [.9, 'cash', .7], [1.4, 'ding_reveal', .8]]);
// 67 Endlich bin ich der reichste Mensch der Stadt (la ciudad le aclama)
const ZM = wt('zum', st(55)), FR = wt('froh', st(55));
shot(st(55), 'W', null, L => { use('G'); traffic(L.T, 2); put(finn, 0, 2.6, -60, 0); LIMO.visible = true; LIMO.position.set(0, 0, -60); applyPose(finn, CHEER); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T); for (let i = 0; i < 8; i++) { const e = ex[i]; put(e, (i % 2 ? 1 : -1) * (7 + (i % 3) * 1.6), 0, -54 - i * 2.4, (i % 2 ? -1 : 1) * 1.2); applyPose(e, i % 3 ? CHEER : { aRx: 2.5, aRe: .5 }); face(e, { eyes: 'happy', mouth: 'grin' }, L.T + i); }
  confettiAt(0, 4, -60, L.T, 14); money(24, 0, 8, -60, L.T, 12); cm([6, 5, -40, 0, 6, -60, 52], [5, 5.4, -42, 0, 6, -60, 50], L.k); badge('tag', 'REICHSTER MENSCH DER STADT', W / 2, H * .14, L.lt - .3); sh(V(0, 0, -58), 24); }, [[0, 'cheer', .8], [.2, 'confetti', .6], [.6, 'party_horn', .5], [1.2, 'shout_crowd', .4], [1.8, 'firework', .5]]);
// 68 ...und zum ersten Mal in meinem Leben
shot(ZM, 'Z', null, L => { use('G'); put(finn, 0, 2.6, -60, 0); LIMO.visible = true; LIMO.position.set(0, 0, -60); applyPose(finn, { aRx: 1.4, aRe: .5, aRz: -.3, aLz: .3 }); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T); money(20, 0, 8, -60, L.T, 10); confettiAt(0, 4, -60, L.T, 12);
  onFace(finn, 9, .5, 1.6, 46, L.k, 7.4); sh(V(0, 0, -60), 16); }, [[0, 'sparkle', .6], [.6, 'coins', .5], [1.2, 'cheer', .4]]);
// 69 ...bin ich froh, ein Pechvogel zu sein (dron que sube, espejo del gancho)
shot(FR, 'C', null, L => { use('G'); traffic(L.T, 4); walkers(L.T, L.lt, 8, 20); put(finn, 0, 2.6, -60, 0); LIMO.visible = true; LIMO.position.set(0, 0, -60); applyPose(finn, { ...CHEER }); face(finn, { eyes: 'happy', mouth: 'grin' }, L.T); confettiAt(0, 4, -60, L.T, 14); money(20, 0, 8, -60, L.T, 12);
  const k = easeInOut(L.k); cam([lerp(4, 0, k), lerp(6, 40, k), lerp(-46, -10, k)], [0, lerp(5, 0, k), -60 - k * 20], lerp(48, 54, k)); if (L.lt > .4) badge('big', 'PECHVOGEL', W / 2, H * .16, L.lt - .4); sh(V(0, 0, -50), 40); }, [[0, 'whoosh_up', .7], [.4, 'cheer', .5], [.9, 'firework', .5], [1.3, 'bell_far', .4]]);
