// ---------- c: el ensayo, la grabación, las pantallas y la protesta (46,10 – 74,58 s) ----------
const cardText = (lines, col = '#1a1a6a') => (c, w, h) => lines.forEach((t, i) => txt(c, t, w / 2, 70 + i * 54, Math.min(36, 640 / t.length), i === 0 ? '#c8202a' : col));
function rehearse(L, lines, key, pose) { saalS(L); SA.TEL.userData.open(.9); const m = put(zisch, SAX, 0, -8.6, 0); actuar(m, 0, [[0, pose]], { T: L.T }); attach(SA.CARD, m.aR.hand, [0, -.7, .5], [-1.0, 0, 0], .9); SA.CARD.userData.draw(key, cardText(lines)); hero(m); return m; }
// 38 «„Thüthe Thahnethothe.»: primer plano del alcalde ceceando con orgullo; salen gotitas de saliva
shot(46.1, 'C', 'punch', L => { const m = rehearse(L, ['SÜSSE SAHNESOSSE'], 'b1', { aRx: 1.1, aRe: 1.2, aLx: 1.2, aLz: -.3, aLe: 1.3, headX: -.05, lean: -.04 }); talk(m, L.T, 46.1, 47.35, 'smug'); spit(m, L.T, 46.1, 12);
  onFace(m, 5.6, .2, .7, 40, L.k, 4.8); sh(SW(0, 0, -8), 12); }, [[0, 'impact_soft', .4], [.2, 'spit', .5], [.7, 'spit', .4]]);
// 39 «Thuper thtarke Thpaghetti.»: saca músculo con el brazo libre (bíceps) mientras lee la ficha
shot(47.35, 'S', null, L => { const j = Math.abs(Math.sin(L.T * 6)); const m = rehearse(L, ['SUPER STARKE', 'SPAGHETTI'], 'b2', { aRx: 1.1, aRe: 1.2, aLx: 1.6, aLz: .9, aLe: 2.2 + j * .2, lean: -.06 }); talk(m, L.T, 47.35, 48.79, 'smug'); spit(m, L.T, 47.35, 10);
  onBody(m, 12, -.5, .08, 40, L.k, 10.5, -.4, 5.6); sh(SW(0, 0, -8), 12); }, [[0, 'whoosh_soft', .3], [.2, 'flex', .5], [.8, 'spit', .4]]);
// 40 «Thieben thaure Thalatgurken.“»: muy de cerca, con un «7» que salta y una lluvia de saliva
shot(48.79, 'Z', null, L => { const m = rehearse(L, ['SIEBEN SAURE', 'SALATGURKEN'], 'b3', { aRx: 1.1, aRe: 1.2, aLx: .8, aLz: -.6, aLe: 1.0, headX: -.08 }); talk(m, L.T, 48.79, 50.31, 'smug'); spit(m, L.T, 48.79, 14);
  badge3('gold', '7', hp(m).add(V(-3, 3.2, 0)), (L.lt - .1) / .2, 1.3); onFace(m, 5, .2, -.6, 38, L.k, 4.3); sh(SW(0, 0, -8), 12); }, [[0, 'spit', .5], [.1, 'pop', .5], [.7, 'spit', .5]]);
// 41 «Er konnte dath S nicht auththprechen.»: Jonte detrás del telón se tapa la boca para no reírse; zoom lento
shot(50.31, 'I', 'slow', L => { saalS(L); SA.TEL.userData.open(.9); const c = put(jonte, SAX - 10.5, 0, 6, -2.6); actuar(c, 0, [[0, { aRx: 2.1, aRz: -.5, aRe: 2.0, aLx: .6, aLe: 1.4, lean: .08 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); holdBag(c); hero(c);
  FLASHL.intensity = 220; FLASHL.position.copy(SW(-4, 12, -4)); FLASHL.target.position.copy(SW(-10, 5, 6)); onFace(c, 6.6, 0, -.8, 40, L.k, 5); sh(SW(-10, 0, 6), 12); }, [[0, 'gasp', .5], [.5, 'heartbeat', .4]]);
// 42 «Dethhalb hatte er eth verboten.»: el alcalde ante el espejo intenta decir «S», le sale «TH» y arruga la ficha, furioso
shot(52.06, 'W', null, L => { saalS(L); const m = put(zisch, SAX - 8.2, 0, -5.6, PI + .55); talk(m, L.T, 52.06, 53.62, 'angry'); const j = Math.sin(L.T * 9); actuar(m, 0, [[0, { aRx: 1.3, aRz: -.3, aRe: 1.6 + j * .1, aLx: 1.2, aLz: .3, aLe: 1.6, lean: .1 }]], { T: L.T }); hero(m);
  bubble(m, 'THHH…', (L.lt - .15) / .2); orbit(SW(-9, 6.4, -7), lerp(16, 14, L.k), -1.6, .1, 42); sh(SW(-10, 0, -8), 14); }, [[0, 'paper_crumple', .6], [.5, 'grumble', .5]]);
// 43 «Alle thollten tho klingen wie er.»: el alcalde en la ventana, sonrisa malvada, mirando el pueblo dormido
shot(53.62, 'F', null, L => { saalS(L); const m = put(zisch, SAX + 13.5, 0, -11.8, PI + .3); actuar(m, 0, [[0, { aLx: .5, aRx: .5, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5, headY: .3 }]], { T: L.T }); talk(m, L.T, 53.62, 55.03, 'smug'); hero(m);
  orbit(SW(13.5, 7.6, -12), lerp(11, 9.5, L.k), PI - .9, .06, 42); sh(SW(13, 0, -12), 12); }, [[0, 'evil_laugh', .5], [.4, 'clock_tick', .3]]);
// 44 «Schnell nahm ich alleth mit meinem Handy auf.»: por encima del hombro de Jonte, el móvil grabando al alcalde en el atril
shot(55.03, 'C', null, L => { saalS(L); SA.TEL.userData.open(.9); const m = put(zisch, SAX, 0, -8.6, 0); actuar(m, 0, [[0, { aRx: 1.1, aRe: 1.2, aLx: 1.2, aLz: -.3, aLe: 1.3 }]], { T: L.T }); talk(m, L.T, 55.03, 56.33, 'smug'); attach(SA.CARD, m.aR.hand, [0, -.7, .5], [-1.0, 0, 0], .9);
  const c = put(jonte, SAX - 3, 0, 9, PI + .3); actuar(c, 0, [[0, { aRx: 2.0, aRz: .2, aRe: 1.2, crouch: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.7, .5], [-.3, 0, 0], 1.4); PHONE.userData.draw((cc, w, h) => drawPhoneRec(cc, w, h, L.T)); cara(c, L.T, { expr: 'determined' }); hero(c);
  const ph = wpos(PHONE); cm([ph.x - 2.6, ph.y + 1.8, ph.z + 4.6, ph.x + .4, ph.y + .1, ph.z - 2, 42], [ph.x - 2.2, ph.y + 1.5, ph.z + 3.8, ph.x + .4, ph.y + .1, ph.z - 2, 40], L.k); sh(SW(-2, 0, 4), 14); DOF = 0; }, [[0, 'rec_beep', .6], [.3, 'camera_click', .4]]);
// 45 «meinem Handy auf.»: la cara de Jonte iluminada por el móvil, con sonrisa pícara
shot(56.33, 'S', null, L => { saalS(L); SA.TEL.userData.open(.9); const c = put(jonte, SAX - 3, 0, 9, PI + .3); actuar(c, 0, [[0, { aRx: 2.0, aRz: .2, aRe: 1.2, crouch: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.7, .5], [-.3, 0, 0], 1.4); PHONE.userData.draw((cc, w, h) => drawPhoneRec(cc, w, h, L.T)); cara(c, L.T, { expr: 'smug', mouth: 'grin' }); hero(c);
  FLASHL.intensity = 120; FLASHL.position.copy(wpos(PHONE)); FLASHL.target.position.copy(hp(c)); onFace(c, 6, -.4, .9, 40, L.k, 5.2); sh(SW(-3, 0, 9), 10); }, [[0, 'whoosh_soft', .3], [.3, 'snicker', .5]]);
// 46 «Am nächthten Morgen thpielte ich die Aufnahme»: por la mañana, Jonte enchufa el móvil a la caja de la pantalla gigante de la plaza
shot(57.25, 'W', null, L => { town(L); DSCR[0].visible = true; DSCR[0].userData.draw('off', (c, w, h) => { c.fillStyle = '#101018'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a3a4a'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.fillText('ZISCHELBACH TV', w / 2, h / 2); });
  const sp = DSCR[0].position; const c = put(jonte, sp.x + 2, 0, sp.z + 4, PI + .7); actuar(c, 0, [[0, { aRx: 1.3, aRe: .4, crouch: .25, lean: .3, aLx: .6, aLe: 1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.7, .5], [-.8, 0, 0], 1.1); PHONE.userData.draw((cc, w, h) => drawPhoneRec(cc, w, h, L.T)); cara(c, L.T, { expr: 'determined', mouth: 'grin' }); hero(c);
  crowdAt(L, sp.x + 6, sp.z + 12, 5, 6, 12, 51, { mode: 'walk', gap: 1.4 }); orbit(V(sp.x + 1.6, 4, sp.z + 3.6), lerp(13, 11, L.k), 1.55, .12, 44); sh(V(sp.x, 0, sp.z + 4), 16); }, [[0, 'birds', .4], [.2, 'cable_plug', .6], [.8, 'power_on', .5]]);
// 47 «auf jedem Riethenbildschirm»: la pantalla gigante se enciende con el alcalde ceceando; la gente se gira
shot(58.61, 'Z', 'punch', L => { town(L); const s = DSCR[0]; s.visible = true; s.userData.draw('v' + Math.floor(L.T * 15), (c, w, h) => drawMayorVid(c, w, h, L.T)); const sp = s.position;
  crowdAt(L, sp.x + 8, sp.z + 22, 9, 5, 12, 53, { mode: i => ['point', 'shock', 'laugh'][i % 3], face: V(sp.x, 12, sp.z), full: true, gap: 1.2 });
  cm([sp.x + 20, 6, sp.z + 40, sp.x, 12.5, sp.z, 48], [sp.x + 16, 7, sp.z + 33, sp.x, 12.8, sp.z, 46], L.k); sh(V(sp.x + 6, 0, sp.z + 16), 30); }, [[0, 'tv_on', .6], [.2, 'mayor_lisp_fx', .4], [.6, 'crowd_gasp', .4]]);
// 48 «der Thtadt ab.»: grúa sobre la plaza del ayuntamiento: las dos pantallas gigantes con el vídeo; multitud
shot(59.95, 'S', null, L => { platzS(L); RP.SCR.forEach((s, i) => { s.visible = true; s.userData.draw('v' + Math.floor(L.T * 15), (c, w, h) => drawMayorVid(c, w, h, L.T + i, i ? 'THUPER THTARKE THPAGHETTI!' : 'THÜTHE THAHNETHOTHE!')); });
  crowdAt(L, RPX, 14, 16, 4, 24, 55, { mode: i => ['point', 'laugh', 'shock', 'laugh'][i % 4], face: RW(0, 12, -4), full: true });
  cm([RPX, 30, 62, RPX, 10, -4, 52], [RPX, 24, 52, RPX, 11, -4, 50], L.k); sh(RW(0, 0, 10), 50); }, [[0, 'whoosh_down', .4], [.2, 'crowd_laugh', .5]]);
// 49 «Die ganze Thtadt drehte durch.»: en la calle la gente se parte de risa señalando la pantalla, uno se tira al suelo
shot(61.14, 'F', null, L => { town(L); const s = DSCR[1]; s.visible = true; s.userData.draw('v' + Math.floor(L.T * 15), (c, w, h) => drawMayorVid(c, w, h, L.T, 'THIEBEN THAURE THALATGURKEN!')); const sp = s.position;
  const a = put(EX[12], sp.x - 8, 0, sp.z + 16, -2.4); actuar(a, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: .35 + Math.abs(Math.sin(L.T * 9)) * .1, crouch: .2 }]], { T: L.T }); laughF(a, L.T); tears(a, L.T);
  const b = put(EX[13], sp.x - 4, 0, sp.z + 18, -2.9); actuar(b, 0, [[0, 'point']], { T: L.T }); laughF(b, L.T + 1); hero(a, b);
  crowdAt(L, sp.x - 6, sp.z + 17, 8, 5, 12, 57, { mode: i => ['laugh', 'point', 'laugh', 'clap'][i % 4], face: V(sp.x, 12, sp.z), from: 14, avoid: [[sp.x - 8, sp.z + 16], [sp.x - 4, sp.z + 18]] });
  orbit(V(sp.x - 6, 4.6, sp.z + 17), lerp(18, 15, L.k), -2.6 + PI, .12, 44); sh(V(sp.x - 6, 0, sp.z + 17), 20); }, [[0, 'crowd_laugh', .6], [.5, 'laugh_man', .5], [1.2, 'clap', .4]]);
// 50 «Die Leute verthammelten thich vor dem Rathauth»: vista amplia: multitud con pancartas ante el ayuntamiento
shot(62.83, 'W', null, L => { platzS(L); crowdAt(L, RPX, -6, 22, 3, 20, 61, { mode: i => i % 3 === 0 ? 'sign' : i % 3 === 1 ? 'shout' : 'idle', face: RW(0, 15, -31), full: true, expr: 'angry' });
  cm([RPX - 18, 14, 44, RPX, 10, -24, 50], [RPX - 14, 16, 38, RPX, 11, -24, 48], L.k); sh(RW(0, 0, -6), 44); }, [[0, 'crowd_chant', .6], [.5, 'whistle', .4]]);
// 51 «und forderten, dath Verbot aufzuheben.»: de cerca, vecinos coreando con las pancartas «WIR WOLLEN DAS S!»
shot(64.51, 'C', null, L => { platzS(L); const P = [[-3, 4], [2.5, 3.6], [-.2, 7.6], [5.5, 7], [-6, 7.4]]; P.forEach(([x, z], i) => { const c = put(EX[15 + i], RPX + x, 0, z, PI + Math.sin(i * 2) * .25); crowdGuy(c, RPX + x, z, L, i, { mode: 'sign', ry: PI + Math.sin(i * 2) * .25 }); }); hero(EX[15], EX[16]);
  orbit(RW(0, 6, 5), lerp(17, 14, L.k), PI - .15, .12, 44); sh(RW(0, 0, 5), 18); }, [[0, 'crowd_chant', .7], [.6, 'stomp', .4]]);
// 52 «Endlich kam der Bürgermeithter herauth.»: se abre la puerta del balcón y sale el alcalde, serio; zoom lento
shot(66.49, 'Z', 'slow', L => { platzS(L); const m = put(zisch, 0, 0, 0, 0); const k = easeOut(clamp(L.lt / 1.2)); m.root.position.set(RPX, 15.4, lerp(-31.6, -28.2, k)); m.root.rotation.y = 0; actuar(m, 0, [[0, k < 1 ? walkP(L.T, 0) : { aLx: .6, aRx: .6, aLe: .4, aRe: .4 }]], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'frown' }); hero(m);
  crowdAt(L, RPX, -6, 14, 4, 16, 63, { mode: 'sign', face: RW(0, 15, -31), full: true });
  orbit(RW(0, 19, -28), lerp(30, 22, L.k), 0, .08, 44); sh(RW(0, 15, -28), 20); }, [[0, 'balcony_door', .6], [.3, 'crowd_boo', .4]]);
// 53 «„Na gut.»: primer plano del alcalde, enfurruñado, con los brazos cruzados
shot(68.46, 'C', 'punch', L => { platzS(L); const m = put(zisch, RPX, 15.4, -28.2, 0); actuar(m, 0, [[0, 'cross']], { T: L.T }); talk(m, L.T, 68.46, 69.17, 'angry'); hero(m); onFace(m, 5.6, -.2, .5, 40, L.k, 5); sh(RW(0, 15, -28), 10); }, [[0, 'impact_soft', .4], [.2, 'grumble', .5]]);
// 54 «Dath S itht wieder erlaubt.“»: en el pórtico de la carretera, la barra roja de la señal se suelta y cae; «ERLAUBT!» en verde
shot(69.17, 'F', null, L => { town(L); const S = GAN.userData.sign; const k = clamp((L.lt - .25) / .7); S.userData.bar.visible = k < .02; if (k >= .02) { const b = FALLBAN; b.visible = true; b.position.set(0, 9.6 - k * k * 9, 70.6 + k * 1.5); b.rotation.set(k * 3, 0, -.785 + k * 4); b.scale.setScalar(1); b.children.forEach(o => o.visible = o === b.userData.bar); }
  crowdAt(L, 0, 60, 8, 6, 12, 65, { mode: 'cheer', face: V(0, 10, 70), gap: 1.2 }); badge('green', 'ERLAUBT!', W / 2, H * .2, (L.lt - .5) / .25, 1, 1.1);
  cm([2, 7, 92, 0, 9, 70, 40], [1, 7.6, 88, 0, 9, 70, 38], L.k); sh(V(0, 0, 70), 26); }, [[0, 'metal_clang', .6], [.5, 'fall_whistle', .4], [.9, 'ding', .5]]);
// 55 «Alle jubelten.»: la multitud salta de alegría con confeti ante el ayuntamiento
shot(70.68, 'S', null, L => { platzS(L); crowdAt(L, RPX, 2, 20, 3, 18, 67, { mode: i => i % 3 ? 'cheer' : 'sign', face: RW(0, 15, -31), full: true }); confRain(RW(0, 0, 6), L.T, 70, 30, 24, 18);
  cm([RPX + 4, 9, 34, RPX, 7, 0, 50], [RPX + 2, 10, 30, RPX, 7.5, 0, 48], L.k); sh(RW(0, 0, 4), 34); }, [[0, 'crowd_cheer', .7], [.1, 'confetti_pop', .5]]);
// 56 «Endlich konnte ich wieder laut sagen:»: Jonte entre la gente coge aire hinchando el pecho, ojos cerrados
shot(71.65, 'W', null, L => { platzS(L); const c = put(jonte, RPX + 1, 0, 2, -.15); const k = easeInOut(L.k); actuar(c, 0, [[0, { aLx: lerp(.3, -.6, k), aRx: lerp(.3, -.6, k), aLz: .3, aRz: -.3, lean: lerp(0, -.18, k), headX: lerp(0, -.2, k) }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'closed', mouth: k > .5 ? 'o' : 'smile' }); holdBag(c); hero(c);
  crowdAt(L, RPX + 1, 2, 10, 4, 10, 69, { mode: 'cheer', full: true, avoid: [[RPX + 1, 2]] }); confRain(RW(1, 0, 2), L.T, 40, 18, 14, 14);
  onBody(c, 11, 0, .1, 42, L.k, 9, null, 3.6); sh(RW(1, 0, 2), 16); }, [[0, 'inhale', .7], [.6, 'crowd_cheer', .3]]);
// 57 «„GTA Sechs!“»: Jonte grita con los puños arriba; «GTA 6!» dorado gigante; explota el confeti
shot(73.42, 'C', 'punch', L => { platzS(L); const c = put(jonte, RPX + 1, 0, 2, -.15); const j = Math.abs(Math.sin(L.T * 8)); c.root.position.y = j * .5; actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, aLe: .4, aRe: .4, headX: -.15, crouch: .05 }]], { T: L.T }); talk(c, L.T, 73.42, 74.58, 'joy'); hero(c);
  crowdAt(L, RPX + 1, 2, 10, 4, 10, 71, { mode: 'cheer', full: true, avoid: [[RPX + 1, 2]] }); confetti(RW(1, 3, 2), L.t0, L.T, 80, 1.3); badge('gold', 'GTA 6!', W / 2, H * .2, (L.lt - .05) / .2, 1, 1.25);
  onBody(c, 10, .1, .14, 44, L.k, 8.6, null, 3.8); sh(RW(1, 0, 2), 16); }, [[0, 'impact', .6], [.05, 'confetti_pop', .7], [.1, 'crowd_cheer', .6]]);
