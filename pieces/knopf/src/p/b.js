// ---------- b: el Opa en su banco y el día repetido (42,67 – 75,72 s) ----------
// yo pequeño sentado a la derecha del Opa en el banco
const KB = V(OPX + 3.9, 0, 3.4);
function kidBench(L, pose = {}, o = {}) { const c = sit(kl, KB.x, OSEAT, KB.z, o.ry ?? -.25, L, { aLx: .4, aRx: .4, aLe: .6, aRe: .6, ...pose }); if (o.stain) { c.spine.add(STAIN); STAIN.visible = true; STAIN.position.set(.15, 1.45, .6); STAIN.scale.set(1, 1.1, 1); } return c; }

// 37 «Opa saß auf der Bank vor seinem Haus»: la casa del Opa: él en su banco tallando un pájaro de madera, virutas en el suelo
shot(42.67, 'S', null, L => { const c = opaBench(L); cara(c, L.T, { expr: 'happy', eyes: 'half', mouth: 'smile' }); actuar(c, 0, [[0, sitPose({ aLx: 1.1, aRx: 1.2 + Math.sin(L.T * 9) * .15, aLz: -.25, aRz: -.3, aLe: 1.5, aRe: 1.6, headX: .35 })]], { T: L.T, weight: false });
  orb(L.k, V(OB.x + 1.5, 3.8, OB.z), null, [26, .45, .26, 46], [17, .25, .16, 44], easeOut); sh(V(OPX, 0, 2), 30); }, [[0, 'birds_morning', .5], [.2, 'whittle', .6], [.8, 'whittle', .5]]);
// 38 «und schnitzte.»: primer plano de las manos: la navaja saca virutas del pájaro
shot(44.33, 'Z', null, L => { const c = opaBench(L); cara(c, L.T, { expr: 'happy', eyes: 'half', mouth: 'smile' }); actuar(c, 0, [[0, sitPose({ aLx: 1.1, aRx: 1.2 + Math.sin(L.T * 12) * .2, aLz: -.25, aRz: -.3, aLe: 1.5, aRe: 1.6, headX: .35 })]], { T: L.T, weight: false });
  const p = wpos(WOODB); cm([p.x + 3.2, p.y + 2.6, p.z + 5.6], [p.x + 2.6, p.y + 2.2, p.z + 4.6], L.k); camera.lookAt(p.x + .4, p.y + .3, p.z); camera.fov = 40; dust(p, L.t0 + .1, L.T, 5, .12); sh(OB, 8); }, [[0, 'whittle', .7]]);
// 39 «Trotzdem legte er sofort das Messer weg»: me ve llegar manchado y llorando: deja la navaja en el banco
shot(44.96, 'W', null, L => { const c = opaBench(L, { knife: L.lt < .7 }); if (L.lt >= .7) { show(KNIFE, OB.x + 1.6, OSEAT + .3, OB.z + .4); KNIFE.rotation.z = PI / 2; }
  actuar(c, L.lt, [[0, sitPose({ aLx: 1.1, aRx: 1.2, aLz: -.25, aRz: -.3, aLe: 1.5, aRe: 1.6, headX: .35 })], [.4, sitPose({ aRx: .9, aRz: .5, aRe: .5, aLx: 1.1, aLe: 1.4, headX: -.05, headY: .3 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'worried', mouth: 'flat' });
  const k = put(kl, OB.x + 4, 0, OB.z + 8 - L.lt * 1.5, PI + .3); actuar(k, 0, [[0, { ...walkP(L.T * .6, 0), headX: .35 }]], { T: L.T }); cara(k, L.T, { expr: 'cry', mouth: 'frown' }); k.spine.add(STAIN); STAIN.visible = true; STAIN.position.set(.15, 1.45, .6); STAIN.scale.set(1, 1.1, 1);
  cm([OB.x - 8, 7, OB.z + 17], [OB.x - 7, 6.6, OB.z + 15.4], L.k); camera.lookAt(OB.x + 2.4, 3.4, OB.z + 4.4); camera.fov = 46; sh(OB, 16); }, [[.7, 'knife_down', .6], [.2, 'sniff', .4]]);
// 40 «und fragte, wie mein Tag war.»: el Opa, cariñoso: «¿qué tal tu día?»
shot(46.68, 'C', null, L => { const c = opaBench(L, { knife: false }); actuar(c, 0, [[0, sitPose({ aRx: .6, aRz: .4, aRe: .8, aLx: 1.0, aLe: 1.4, headY: .35, headX: .05 })]], { T: L.T, weight: false }); talk(c, L.T, 46.6, 48.05, 'warm');
  kidBench(L, { headX: .35 }, { stain: true }); cara(kl, L.T, { expr: 'cry', mouth: 'frown' }); onFace(c, 5.4, .2, -1.4, 40, L.k, 4.6); sh(OB, 12); }, [[0, 'birds_morning', .3]]);
// 41 «Ich erzählte ihm alles.»: a su lado se lo cuento todo con las manos: 7:52, el cacao, el penalti
shot(48.05, 'R', null, L => { const c = opaBench(L, { knife: false }); actuar(c, 0, [[0, sitPose({ ...GEST.listen, lLx: 1.5, lRx: 1.5 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'worried', mouth: 'flat' });
  const k = kidBench(L, { aRx: 1.4 + Math.sin(L.T * 7) * .5, aRz: .3, aRe: 1.2, aLx: 1.2 + Math.cos(L.T * 6) * .4, aLz: .4, aLe: 1, headY: -.3 }, { stain: true }); cara(k, L.T, { expr: 'sad', mouth: Math.sin(L.T * 11) > 0 ? 'talk_wide' : 'grimace' });
  orb(L.k, V(OB.x + 1.9, 3.6, OB.z), null, [15, -.25, .14, 42], [13, -.05, .12, 42]); [['red', '7:52'], ['gold', 'KAKAO'], ['red', '0 : 1']].forEach(([kd, t], i) => badge(kd, t, W * (.25 + i * .25), H * (.16 + (i % 2) * .05), clamp((L.lt - .1 - i * .3) / .15), 1, .7)); sh(OB, 14); }, [[.1, 'pop', .4], [.4, 'pop', .4], [.7, 'pop', .4]]);
// 42 «Er hörte ganz ruhig zu.»: el Opa escucha, la barbilla en la mano, sin interrumpir
shot(49.25, 'I', null, L => { const c = opaBench(L, { knife: false, bird: false }); actuar(c, 0, [[0, sitPose({ aRx: 2.0, aRz: -.4, aRe: 2.3, aLx: .9, aLz: -.5, aLe: 1.5, headY: .4, headX: .06 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'worried', eyes: 'normal', mouth: 'flat' });
  kidBench(L, { aRx: 1.2, aRe: 1.2 }, { stain: true }); cara(kl, L.T, { expr: 'sad', mouth: 'talk' }); onFace(c, 6, .4, -2.6, 40, L.k, 5.2); sh(OB, 12); }, [[0, 'wind_soft', .4], [.4, 'nod', .3]]);
// 43 «Dann schaute er hinunter auf den»: el Opa baja la mirada hacia su barriga
shot(50.47, 'S', null, L => { const c = opaBench(L, { knife: false, bird: false }); actuar(c, L.lt, [[0, sitPose({ aLx: .6, aRx: .6, aLe: .8, aRe: .8, headX: .1 })], [.3, sitPose({ aLx: .6, aRx: .6, aLe: .8, aRe: .8, headX: .75 }), { dur: .5 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'sad', eyes: 'down', mouth: 'flat' });
  cm([OB.x - 1.6, 7.4, OB.z + 6.4], [OB.x - 1.2, 7, OB.z + 5.6], L.k); camera.lookAt(OB.x, 4.6, OB.z); camera.fov = 44; sh(OB, 10); }, [[.3, 'hum_glow', .4]]);
// 44 «Knopf auf seinem Bauch.»: su botón brilla y late
shot(51.84, 'Z', 'slow', L => { const c = opaBench(L, { knife: false, bird: false, pose: { aLx: .6, aRx: .6, aLe: .8, aRe: .8, headX: .75 } }); c.knopfOn(true, 2.4 + Math.sin(L.T * 7) * 1.2); onKnopf(c, 4.6, 2.8, L.k, .4, .9, 40); sh(OB, 8); }, [[0, 'heartbeat_soft', .5]]);
// 45 «Und lächelte.»: levanta la cabeza y sonríe por debajo de la barba
shot(52.90, 'F', null, L => { const c = opaBench(L, { knife: false, bird: false, pose: { aLx: .6, aRx: .6, aLe: .8, aRe: .8, headX: -.05 } }); cara(c, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' }); onFace(c, 4.6, .1, .8, 40, L.k, 3.8); sh(OB, 8); }, [[0, 'chime_soft', .4]]);
// 46 «Keine Sorge, Großer.»: me revuelve el pelo
shot(53.76, 'W', null, L => { const c = opaBench(L, { knife: false, bird: false }); actuar(c, 0, [[0, sitPose({ aRx: 2.2 + Math.sin(L.T * 10) * .12, aRz: .9, aRe: .9, aLx: .6, aLe: .8, headY: .45 })]], { T: L.T, weight: false }); talk(c, L.T, 53.7, 54.98, 'warm');
  const k = kidBench(L, { headX: .1, headY: -.3 }, { stain: true }); cara(k, L.T, { expr: 'sad', eyes: 'up', mouth: 'flat' }); orb(L.k, V(OB.x + 2, 3.8, OB.z), null, [13, .2, .14, 42], [11.5, .08, .12, 42]); sh(OB, 12); }, [[0, 'hair_ruffle', .5]]);
// 47 «Morgen wird besser.»: esa noche, solo delante de su casa, el Opa se pulsa el botón: onda de luz
shot(54.98, 'B', null, L => { opaS(L); night(30); TINT = 'rgba(10,16,60,.2)'; const c = put(opa, OPX - 3, 0, 8, .2); const pr = L.lt > .45; c.knopfOn(!pr, 3); actuar(c, L.lt, [[0, { headX: .5 }], [.2, { aRx: .95, aRz: -.42, aRe: 1.75, headX: .5, lean: .06 }, { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'warm', eyes: 'closed', mouth: 'smile' });
  if (pr) { ringwave(kp(c), clamp((L.lt - .45) / .5), camera.position, 8); grade.uniforms.flash.value = Math.max(0, .5 - (L.lt - .45) * 2); } onBody(c, 15, .3, .1, 42, L.k, 12, .2); sh(V(OPX, 0, 6), 16); }, [[.45, 'button_click', .7], [.5, 'whoosh_magic', .6]]);

// ---------- el día repetido ----------
// 48 «Am nächsten Morgen»: amanece sobre Lindenthal, el sol asoma entre las montañas
shot(55.95, 'F', null, L => { town(L, { dusk: true }); sun.color.setRGB(1, .78, .55); crowdAt(L, 0, -6, 8, 6, 26, 13, { mode: 'walk' }); cm([30, 30, 70], [24, 22, 56], L.k); camera.lookAt(0, 14, -40); camera.fov = 50; sh(V(0, 0, -10), 60); }, [[0, 'rooster', .5], [.2, 'birds_morning', .4]]);
// 49 «passierte etwas Seltsames.»: en mi cuarto, el aire brilla en turquesa; me froto los ojos
shot(56.73, 'R', null, L => { meinZimmer(L); const c = put(kl, ZIX + 13, 3.6, -5.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -PI / 2 + 1.2; applyPose(c, { aRx: 2.2, aLx: 2.2, aRe: 2.2, aLe: 2.2, aRz: -.3, aLz: -.3, headX: .1 }); cara(c, L.T, { expr: 'confused', eyes: 'squint', mouth: 'wavy' }); c.blob.visible = false;
  sparks(V(ZIX + 12, 6, -4), L.t0 + .1, L.T, 30, .8); const h = hp(c); cam([h.x - 1.4, h.y + 1.2, h.z + 8], [h.x, h.y, h.z], 42); badge('q', '?', W / 2, H * .2, clamp((L.lt - .5) / .15), 1, .9); }, [[0, 'shimmer', .5], [.5, 'hmm', .4]]);
// 50 «Ich wachte um 6 Uhr»: el despertador suena y bota en la mesilla: 6:45 en verde
shot(58.27, 'Z', 'punch', L => { meinZimmer(L); show(ALARM, ZIX + 6, 4.4 + Math.abs(Math.sin(L.T * 30)) * .12, -10.4, Math.sin(L.T * 40) * .08, .55); ALARM.userData.show('6:45', '#3aff6a'); cm([ZIX + 6.6, 5.4, -5.6], [ZIX + 6.2, 5, -6.8], L.k); camera.lookAt(ZIX + 6, 4.5, -10.4); camera.fov = 40; }, [[0, 'alarm_ring', .7]]);
// 51 «45 auf.»: me estiro en la cama, despierto y contento; «6:45»
shot(59.30, 'S', null, L => { meinZimmer(L); const c = put(kl, ZIX + 13, 3.6, -5.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -PI / 2 + 1.25; applyPose(c, { aRx: 2.9, aLx: 2.9, aRz: .3, aLz: .3, aRe: .2, aLe: .2, headX: -.2 }); cara(c, L.T, { expr: 'happy', mouth: L.lt < .6 ? 'yawn' : 'open_smile' }); c.blob.visible = false;
  const h = hp(c); cm([h.x + 3, h.y + 2, h.z + 9], [h.x + 2, h.y + 1.4, h.z + 7.4], L.k); camera.lookAt(h.x, h.y - .6, h.z); camera.fov = 44; badge('green', '6:45', W / 2, H * .18, clamp((L.lt - .1) / .15), 1, 1.1); }, [[0, 'yawn', .5], [.5, 'birds_morning', .3]]);
// 52 «Pünktlich.»: llego al colegio a tiempo; la maestra me sonríe con el pulgar arriba
shot(60.48, 'C', null, L => { schulS(L); const t = put(lehr, SCX + 2.4, 0, -21, -.35); actuar(t, 0, [[0, { aRx: 1.6, aRz: -.2, aRe: 1.3 }]], { T: L.T }); grin(t, L.T);
  const c = put(kl, SCX - 2.6, 0, -16.5, PI - .6); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T); cm([SCX - 1, 5, -3], [SCX - .4, 4.6, -5.5], L.k); camera.lookAt(SCX, 3.4, -19); camera.fov = 44; sh(V(SCX, 0, -18), 16);
  badge('green', 'PÜNKTLICH', W / 2, H * .17, clamp((L.lt - .05) / .15), 1, 1); }, [[0, 'ding_good', .6]]);
// 53 «Meine Klamotten blieben sauber.»: en la cocina cazo la taza antes de que caiga: camiseta limpia
shot(61.12, 'W', null, L => { kuecheS(L); const c = put(kl, KUX - 1, 0, 6.6, PI); actuar(c, L.lt, [[0, { aRx: 1.2, aRe: .4, lean: .2 }], [.3, { aRx: 1.5, aRz: .2, aRe: .3, lean: .3 }, { dur: .2 }], [.9, GEST.cheer]], { T: L.T }); cara(c, L.T, { expr: L.lt > .9 ? 'happy' : 'determined', mouth: L.lt > .9 ? 'grin' : 'o' });
  const k = clamp(L.lt / .3); show(MUG, KUX - 1.4, 3.85, 4.2 + k * .4); MUG.rotation.x = Math.sin(k * PI) * .6; cm([KUX - 6, 6.4, 1], [KUX - 5.4, 6, 2], L.k); camera.lookAt(KUX - 1, 3.8, 5.4); camera.fov = 44;
  badge('green', 'SAUBER', W / 2, H * .17, clamp((L.lt - .8) / .15), 1, .9); }, [[.3, 'catch', .6], [.8, 'ding_good', .5]]);
// 54 «Und beim Fußballspiel»: el partido otra vez: saque inicial
shot(62.58, 'Z', null, L => { sportS(L); TEAM.forEach((c, i) => { crowdGuy(c, SPX - 12 + i * 4.6, -4 - (i % 2) * 4, L, i, { mode: 'run', ry: PI, speed: 3 }); }); const k = put(kl, SPX, 0, -1 - L.lt * 2, PI); actuar(k, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(k, L.T, { expr: 'determined', mouth: 'flat' }); show(BALL, SPX + .6, .55, -2 - L.lt * 2.4);
  RIV.forEach((c, i) => crowdGuy(c, SPX - 8 + i * 4, -16, L, i, { mode: 'run', ry: 0, speed: 2 })); cm([SPX + 18, 14, 18], [SPX + 14, 11, 12], L.k); camera.lookAt(SPX, 2, -6); camera.fov = 48; sh(V(SPX, 0, -6), 40); }, [[0, 'whistle', .6], [.2, 'stadium_crowd', .4]]);
// 55 «saß mein Opa plötzlich auf der Tribüne,» (zoom lento): el Opa en la grada entre los vecinos, saludando; ya sin botón
shot(63.52, 'S', 'slow', L => { sportS(L); const c = sit(opa, SPX - 27.8, 2.65, 0, PI / 2, L, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5 }); opaBtn(c, L.T); grin(c, L.T);
  [[-3.4, 0], [3.4, 1], [-6.8, 2], [6.6, 3]].forEach(([z, i]) => crowdGuy(EX[14 + i], SPX - 27.8, z, L, i, { mode: 'sitb', seat: 2.65, ry: PI / 2, expr: 'happy' })); [[-1.6, 4], [1.8, 5], [-5, 6], [5.2, 7]].forEach(([z, i]) => crowdGuy(EX[14 + i], SPX - 30.8, z, L, i, { mode: 'sitb', seat: 4.25, ry: PI / 2, expr: 'happy' }));
  orb(L.k, V(SPX - 27.8, 4.6, 0), null, [24, PI / 2 + .1, .1, 44], [15, PI / 2, .06, 42]); sh(V(SPX - 28, 0, 0), 18); }, [[0, 'stadium_crowd', .4]]);
// 56 «obwohl er nie zu meinen Spielen kam.»: yo en el campo, me giro hacia la grada sin creérmelo
shot(65.51, 'I', null, L => { sportS(L); const c = put(kl, SPX - 12, 0, -6, -PI / 2 + .3); actuar(c, 0, [[0, { ...GEST.shock, headY: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  onFace(c, 5.6, .4, 1.2, 42, L.k, 4.6); sh(V(SPX - 12, 0, -6), 12); }, [[0, 'gasp_small', .5]]);
// 57 «Er sprang auf und rief mir zu,»: el Opa se levanta de un salto, manos a la boca
shot(67.16, 'C', 'punch', L => { sportS(L); const j = Math.max(0, Math.sin(clamp(L.lt / .5) * PI)) * 1.2; const c = put(opa, SPX - 27.8, 1.2 + j, 0, PI / 2); opaBtn(c, L.T); actuar(c, 0, [[0, { aLx: 2.3, aRx: 2.3, aLz: -.2, aRz: -.2, aLe: 2.3, aRe: 2.3, headX: -.15, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'shout', mouth: 'scream' });
  [[-3.4, 0], [3.4, 1]].forEach(([z, i]) => crowdGuy(EX[14 + i], SPX - 27.8, z, L, i, { mode: 'sitcheer', seat: 2.65, ry: PI / 2 })); onBody(c, 12, .1, .06, 42, L.k, 10, .05, 3.6); sh(V(SPX - 28, 0, 0), 16); }, [[0, 'shout_far', .6], [.1, 'crowd_cheer_small', .4]]);
// 58 «wohin ich schießen soll.»: plano subjetivo hacia la portería: flecha a la esquina de abajo a la izquierda
shot(68.68, 'W', null, L => { sportS(L); show(BALL, SPX, .55, -25); const g = put(tw, SPX + Math.sin(L.T * 5) * .8, 0, -33.6, 0); actuar(g, 0, [[0, { ...GEST.brace, aLz: 1.1, aRz: 1.1 }]], { T: L.T }); cara(g, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([SPX + .4, 3.8, -16], [SPX + .3, 3.4, -18], L.k); camera.lookAt(SPX, 2.4, -32); camera.fov = 42; const [x, y] = proj(V(SPX - 4, 1, -35)); badge('big', '↙', x, y - 40, clamp((L.lt - .1) / .15), 1, 1.2); badge('gold', 'DA!', W / 2, H * .18, clamp((L.lt - .2) / .15), 1, 1); sh(V(SPX, 0, -28), 16); }, [[.1, 'shout_far', .5]]);
// 59 «Ich schoss.»: ¡pum!
shot(69.70, 'C', 'punch', L => { sportS(L); const c = put(kl, SPX + .6, 0, -23.6, PI + .1); actuar(c, L.lt, [[0, { lRx: -.9, lLx: .3, aLz: .6, aRz: .6, aLx: .3, lean: -.1 }], [.08, { lRx: 1.3, lRk: .1, lLx: -.2, aLz: .9, aRz: .9, lean: -.2, headX: .1 }, { dur: .12 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  const k = clamp((L.lt - .08) / .5); show(BALL, SPX - k * 2, .55 + k * .3, -25 - k * 4); BALL.rotation.x = -L.T * 30; cm([SPX + 3.6, 1.6, -21], [SPX + 3.2, 1.8, -21.6], L.k); camera.lookAt(SPX, 1.4, -25); camera.fov = 46; sh(V(SPX, 0, -24), 12); }, [[.08, 'kick', .9]]);
// 60 «Und wir»: el balón entra junto al palo; el portero se tira al otro lado
shot(70.20, 'F', null, L => { sportS(L, { score: [L.lt > .2 ? 1 : 0, 0] }); const k = clamp(L.lt / .3); show(BALL, SPX - 4 - k * .5, .7, -30 - k * 5.6); BALL.rotation.x = -L.T * 30; const g = put(tw, SPX + 2 + k * 2, .5 + Math.sin(k * PI) * 1.2, -33.6, 0); g.root.rotation.z = -k * 1.2; actuar(g, 0, [[0, { aLx: 2.8, aRx: 2.8 }]], { T: L.T }); cara(g, L.T, { expr: 'shock', mouth: 'scream' });
  cm([SPX - 3, 3, -20], [SPX - 3.4, 2.8, -22], L.k); camera.lookAt(SPX - 2, 2, -34); camera.fov = 44; sh(V(SPX, 0, -32), 14); }, [[.25, 'net_swish', .8], [.3, 'goal_crowd', .6]]);
// 61 «gewannen!»: ¡gol! los compañeros me suben a hombros, confeti verde y blanco, 1 : 0
shot(70.72, 'Z', 'punch', L => { sportS(L, { score: [1, 0] }); const c = put(kl, SPX, 3.6, -14, 0); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T); c.root.position.y += Math.abs(Math.sin(L.T * 7)) * .4;
  TEAM.slice(0, 4).forEach((t, i) => crowdGuy(t, SPX - 3 + i * 2, -15 + (i % 2) * 2.4, L, i, { mode: 'cheer', face: camera.position })); confetti(V(SPX, 2, -14), L.t0, L.T, 70, 1.2);
  orb(L.k, V(SPX, 4.4, -14), null, [16, .2, .1, 46], [13, .05, .06, 44]); badge('green', '1 : 0', W / 2, H * .16, clamp((L.lt - .05) / .15), 1, 1.1); sh(V(SPX, 0, -14), 14); }, [[0, 'goal_crowd', .7], [.1, 'confetti_pop', .5]]);
// 62 «Am Abend erzählte ich ihm alles.»: al atardecer en el banco, se lo cuento dando saltos, con la camiseta limpia
shot(71.30, 'S', null, L => { const c = opaBench(L, { dusk: true, knife: false, bird: false, btn: false }); actuar(c, 0, [[0, sitPose({ ...GEST.listen, lLx: 1.5, lRx: 1.5 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'warm', mouth: 'smile' });
  const k = put(kl, OB.x + 3.4, Math.abs(Math.sin(L.T * 6)) * .5, OB.z + 3.4, -.7); actuar(k, 0, [[0, { aRx: 2.6, aRz: .4, aRe: .3, aLx: 1.6 + Math.sin(L.T * 7) * .4, aLe: 1 }]], { T: L.T }); cara(k, L.T, { expr: 'happy', mouth: Math.sin(L.T * 11) > 0 ? 'talk_wide' : 'grin' });
  orb(L.k, V(OB.x + 1.8, 3.6, OB.z + 1.4), null, [17, .35, .14, 42], [14, .18, .12, 42]); badge('green', '1 : 0', W * .68, H * .2, clamp((L.lt - .3) / .15), 1, .7); sh(OB, 14); }, [[0, 'birds_evening', .4], [.3, 'laugh_kid', .5]]);
// 63 «Er lächelte, als hätte er den ganzen» (zoom lento): la sonrisa del Opa, ojos brillantes
shot(73.13, 'Z', 'slow', L => { const c = opaBench(L, { dusk: true, knife: false, bird: false, btn: false, pose: { aLx: .6, aRx: .6, aLe: .8, aRe: .8, headY: .3 } }); cara(c, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' }); onFace(c, 5.4, .1, -1, 40, L.k, 3.8); sh(OB, 8); }, [[0, 'music_swell', .4]]);
// 64 «Tag darauf gewartet.»: los dos en el banco al atardecer, las montañas encendidas
shot(74.46, 'B', null, L => { const c = opaBench(L, { dusk: true, knife: false, bird: false, btn: false, pose: { aRx: 2.2, aRz: .9, aRe: .9, aLx: .6, aLe: .8, headY: .45 } }); cara(c, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' }); const k = kidBench(L, { headY: -.3, lean: -.1 }); grin(k, L.T);
  cm([OB.x + 2, 6, OB.z + 30], [OB.x + 2, 5, OB.z + 24], L.k); camera.lookAt(OB.x + 2, 5, OB.z - 10); camera.fov = 44; sh(OB, 20); }, [[0, 'wind_soft', .4]]);
