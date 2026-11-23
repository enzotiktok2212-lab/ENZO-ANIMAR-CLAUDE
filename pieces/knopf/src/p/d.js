// ---------- d: el día repetido con el Opa y el final (130,22 – 187,6 s) ----------
// 109 «Als ich die Augen öffnete,»: en mi cama, abro los ojos de golpe
shot(130.22, 'F', null, L => { meinZimmer(L); const c = put(gr, ZIX + 13, 3.6, -6.4, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -PI / 2; applyPose(c, { aLz: .2, aRz: .2 }); myBtn(c, L.T); c.blob.visible = false; cara(c, L.T, { eyes: L.lt < .3 ? 'closed' : 'wide', mouth: 'o' });
  const h = hp(c); cam([h.x + .4, h.y + 4.6, h.z + 1.6], [h.x, h.y, h.z + .2], 42); grade.uniforms.flash.value = Math.max(0, .6 - L.lt); }, [[0, 'gasp', .6]]);
// 110 «war es wieder Morgen.»: me incorporo: luz de mañana… y donde estaba mi botón, solo la marca
shot(131.44, 'Z', null, L => { meinZimmer(L); const c = put(gr, ZIX + 13, 3.6, -6.4, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -PI / 2 + 1.25; applyPose(c, { headX: .5, aLx: .4, aRx: .4 }); myBtn(c, L.T); c.blob.visible = false; cara(c, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' });
  show(ALARM, ZIX + 6, 4.4, -10.4, 0, .55); ALARM.userData.show('6:45', '#3aff6a'); onKnopf(c, 5.4, 4, L.k, 1.2, 1.4, 42); badge('green', 'MORGEN', W / 2, H * .17, clamp((L.lt - .1) / .15), 1, .9); }, [[0, 'birds_morning', .5], [.1, 'alarm_ring', .3]]);
// 111 «Opa lebte noch.»: la habitación de día: el Opa despierto, el monitor late verde
shot(132.27, 'C', 'punch', L => { zimmerK(L, { mode: 'day', bpm: 72 }); const c = opaBed(L, { aRx: .6, aRe: .4 }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); cm([KZX + 7, 8.4, 7], [KZX + 6, 7.8, 6], L.k); camera.lookAt(KZX - 1.6, 5.4, -4.4); camera.fov = 46; }, [[0, 'monitor_beep', .6], [.5, 'monitor_beep', .5]]);
// 112 «Ich rannte den ganzen Weg»: cruzo corriendo la plaza de Lindenthal entre la gente
shot(133.29, 'W', null, L => { town(L); const c = put(gr, 20 - L.lt * 9, 0, 6, -PI / 2); myBtn(c, L.T); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .3; cara(c, L.T, { expr: 'determined', mouth: 'o' });
  crowdAt(L, 8, -2, 10, 6, 22, 20, { mode: 'shock' }); cam([16 - L.lt * 9, 5.4, 18], [14 - L.lt * 9, 3.6, 6], 44); sh(V(12, 0, 4), 30); }, [[0, 'run_steps', .6], [.3, 'breath_run', .5]]);
// 113 «zum Krankenhaus»: entro a toda velocidad por la puerta del hospital
shot(134.65, 'S', null, L => { klinikS(L); const c = put(gr, KAX + 1, 0, 10 - L.lt * 12, PI); myBtn(c, L.T); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .3; cara(c, L.T, { expr: 'determined', mouth: 'o' });
  cm([KAX + 8, 4, 22], [KAX + 7, 4, 18], L.k); camera.lookAt(KAX + 1, 4, 4 - L.lt * 12); camera.fov = 44; sh(V(KAX, 0, 0), 24); }, [[0, 'run_steps', .6], [.5, 'door_whoosh', .5]]);
// 114 «und umarmte ihn.»: me echo sobre la cama y lo abrazo
shot(135.39, 'I', null, L => { zimmerK(L, { mode: 'day' }); const c = opaBed(L, { aRx: 1.6, aLx: 1.6, aRe: 1.2, aLe: 1.2, aRz: -.3, aLz: -.3 }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); const t = put(gr, KZX + 4.9, 0, -4.2, -PI / 2); myBtn(t, L.T); actuar(t, 0, [[0, { lean: .75, aLx: 1.7, aRx: 1.7, aLz: -.35, aRz: -.35, aLe: 1.1, aRe: 1.1, headX: .3, headY: .3 }]], { T: L.T }); cara(t, L.T, { expr: 'cry', eyes: 'closed', mouth: 'smile' });
  cm([KZX + 4, 8, 6], [KZX + 3.4, 7.6, 4.6], L.k); camera.lookAt(KZX + .6, 5.4, -4.6); camera.fov = 44; }, [[0, 'hug', .6], [.3, 'sheet_rustle', .4]]);
// 115 «Er lachte.»: el Opa se ríe con todo el cuerpo
shot(136.59, 'C', null, L => { zimmerK(L, { mode: 'day' }); const c = opaBed(L, { aRx: 1.2, aRe: 1, headX: .3 + Math.sin(L.T * 18) * .06 }); laughF(c, L.T); opaCam(L, 7.4, 6.1, 1.4); }, [[0, 'laugh_old', .7]]);
// 116 «Was ist denn mit dir los, Großer?»: divertido, me mira de reojo
shot(137.58, 'Z', null, L => { zimmerK(L, { mode: 'day' }); const c = opaBed(L, { headY: -.5, aRx: .9, aRz: .4, aRe: .6 }); talk(c, L.T, 137.5, 139.02, 'smile', { eyes: 'squint' }); const t = teenChair(L); cara(t, L.T, { expr: 'happy', mouth: 'smile' });
  cm([KZX - 3.4, 8.8, 5], [KZX - 2.8, 8.4, 4], L.k); camera.lookAt(KZX - .9, 6.6, -3.2); camera.fov = 44; }, [[0, 'chuckle', .4]]);
// 117 «Ich sagte es ihm nicht.»: sonrío con los ojos brillantes y niego con la cabeza
shot(139.02, 'W', null, L => { zimmerK(L, { mode: 'day' }); opaBed(L); const t = teenChair(L, { headY: Math.sin(L.T * 9) * .3 }); cara(t, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' }); tears(t, L.T); onFace(t, 4.4, .1, .4, 40, L.k, 3.6); }, [[0, 'sniff', .3]]);
// 118 «Stattdessen blieb ich den ganzen Tag bei ihm.»: la luz de la ventana pasa de la mañana a la tarde; el reloj corre
shot(140.15, 'R', null, L => { const m = L.k < .5 ? 'day' : 'dusk'; zimmerK(L, { mode: m }); const c = opaBed(L); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); const t = teenChair(L, { aRx: .8, aRe: .9 }); cara(t, L.T, { expr: 'happy', mouth: 'smile' });
  cm([KZX - 7, 10, 9], [KZX - 6.2, 9.6, 7.4], L.k); camera.lookAt(KZX - .4, 6.4, -2.2); camera.fov = 48; badge('tag', 'DEN GANZEN TAG', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, .85); }, [[0, 'clock_fast', .4]]);
// 119 «Wir blätterten durch sein altes Fotoalbum.»: el álbum abierto sobre la manta: fotos de los dos
shot(142.21, 'S', null, L => { zimmerK(L, { mode: 'day' }); const c = opaBed(L, { headX: .8 }); cara(c, L.T, { expr: 'warm', eyes: 'down', mouth: 'smile' }); const t = teenChair(L, { ...handPose, headX: .5 }); cara(t, L.T, { expr: 'happy', eyes: 'down', mouth: 'smile' });
  show(ALBUM, KZX + 1.2, 4.75, -1.4, -.3); const p = wpos(ALBUM); cm([p.x + 2.6, p.y + 4.4, p.z + 4], [p.x + 2, p.y + 3.6, p.z + 3.2], L.k); camera.lookAt(p.x, p.y, p.z - .2); camera.fov = 42; }, [[0, 'page_turn', .6], [1, 'page_turn', .5]]);
// 120 «Wir schauten unsere Lieblingsspiele auf dem Tablet.»: la tableta: un partido; los dos con la misma cara de emoción
shot(144.12, 'F', null, L => { zimmerK(L, { mode: 'day' }); const c = opaBed(L, { aRx: 1.3, aLx: 1.3, aRe: 1.2, aLe: 1.2, headX: .3 }); cara(c, L.T, { expr: 'happy', eyes: 'wide', mouth: 'open_smile' }); show(TABLET, KZX, 6.4, -1.6, 0); TABLET.rotation.x = -.5; TABS.userData.draw(L.T);
  const t = put(gr, KZX + 2.6, 0, -1.4, -PI / 2 - .4); myBtn(t, L.T); actuar(t, 0, [[0, { lean: .3, headX: .2, aLx: .6, aRx: .6 }]], { T: L.T }); cara(t, L.T, { expr: 'happy', eyes: 'wide', mouth: 'open_smile' });
  cm([KZX - .4, 8.4, 3.4], [KZX - .3, 8, 2.6], L.k); camera.lookAt(KZX + .4, 6.2, -2.2); camera.fov = 44; }, [[0, 'crowd_tv', .5], [.8, 'cheer_small', .4]]);
// 121 «Und redeten über alles.»: charlamos y nos reímos, el Opa gesticulando
shot(145.98, 'W', null, L => { zimmerK(L, { mode: 'day' }); const c = opaBed(L, { aRx: 1.2 + Math.sin(L.T * 6) * .4, aRz: .3, aRe: 1 }); cara(c, L.T, { expr: 'happy', mouth: Math.sin(L.T * 10) > 0 ? 'talk_wide' : 'laugh' }); const t = teenChair(L, { aLx: .9 + Math.sin(L.T * 7) * .3, aLe: 1 }); laughF(t, L.T + .3);
  cm([KZX - 6, 8.6, 7], [KZX - 5.2, 8.2, 6], L.k); camera.lookAt(KZX - .6, 6.4, -2); camera.fov = 46; }, [[0, 'laugh_old', .4], [.5, 'laugh_teen', .4]]);
// 122 «Ich bat ihn sogar, mir Geschichten zu erzählen,»: el Opa cuenta una historia con las manos
shot(147.62, 'Z', null, L => { zimmerK(L, { mode: 'dusk' }); const c = opaBed(L, { aRx: 1.5 + Math.sin(L.T * 4) * .3, aLx: 1.3 + Math.cos(L.T * 4) * .3, aRz: .5, aLz: .5, aRe: .8, aLe: .8, headY: -.3 }); talk(c, L.T, 147.5, 149.6, 'happy'); const h = opaHead();
  cm([h.x + 3, h.y + 1, h.z + 6], [h.x + 2.4, h.y + .8, h.z + 5], L.k); camera.lookAt(h.x, h.y - .6, h.z); camera.fov = 42; }, [[0, 'story_hum', .4]]);
// 123 «die ich schon tausendmal gehört hatte.»: «1000×»
shot(149.58, 'C', 'punch', L => { zimmerK(L, { mode: 'dusk' }); opaBed(L, { aRx: 1.6, aRz: .5, aRe: .8 }); talk(opaH, L.T, 149.5, 151.3, 'happy'); const t = teenChair(L); cara(t, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  cm([KZX + 9.4, 8.2, 7], [KZX + 8.6, 7.8, 6], L.k); camera.lookAt(KZX + 2, 5, -2); camera.fov = 46; badge('gold', '1000×', W / 2, H * .18, clamp((L.lt - .05) / .15), 1, 1.2); }, [[0, 'pop_big', .6]]);
// 124 «Denn diesmal hörte ich wirklich zu.»: la barbilla en las manos, sin perderme ni una palabra
shot(151.30, 'I', 'slow', L => { zimmerK(L, { mode: 'dusk' }); opaBed(L); const t = teenChair(L, { aLx: 2.0, aRx: 2.0, aLz: -.4, aRz: -.4, aLe: 2.3, aRe: 2.3, lean: .3, headX: -.05 }); cara(t, L.T, { expr: 'happy', eyes: 'normal', mouth: 'smile' }); onFace(t, 4.6, .2, .3, 40, L.k, 3.4); }, [[0, 'music_swell', .4]]);

// ---------- el final ----------
// 125 «Am Abend saß ich neben seinem Bett.»: anochece; la lámpara encendida
shot(153.12, 'B', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L); cara(c, L.T, { expr: 'tired', mouth: 'smile' }); const t = teenChair(L); cara(t, L.T, { expr: 'happy', mouth: 'smile' }); cm([KZX + 8, 10, 8.5], [KZX + 7.2, 9.4, 7.2], L.k); camera.lookAt(KZX + 1.2, 6.2, -2); camera.fov = 48; }, [[0, 'room_tone', .4]]);
// 126 «Er sah mich an.»
shot(154.91, 'S', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6 }); cara(c, L.T, { expr: 'warm', mouth: 'smile' }); opaCam(L, 6.7, 5.8, 2.1); }, [[0, 'sheet_rustle', .3]]);
// 127 «Wie war dein Tag, Großer?»
shot(155.73, 'Z', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6 }); talk(c, L.T, 155.7, 156.84, 'warm'); opaCam(L, 6.2, 5.4, 1.3); }, [[0, 'monitor_beep', .3]]);
// 128 «Ich hielt seine Hand.»
shot(156.84, 'W', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L, { aRx: 1.1, aRz: -.5, aRe: .3 }); const t = teenChair(L, handPose); handCam(t, L); }, [[0, 'hand_squeeze', .4]]);
// 129 «Er war wunderschön, Opa.»: sonrío entre lágrimas
shot(157.84, 'C', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L); const t = teenChair(L, handPose); talk(t, L.T, 157.8, 159.19, 'happy', { eyes: 'happy' }); tears(t, L.T); onFace(t, 4.2, .1, .6, 40, L.k, 3.6); }, [[0, 'sniff', .3]]);
// 130 «Der beste Tag, den ich je hatte.»: «BESTER TAG»
shot(159.19, 'F', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L, { headY: -.6 }); cara(opaH, L.T, { expr: 'warm', mouth: 'smile' }); const t = teenChair(L, handPose); talk(t, L.T, 159.1, 160.88, 'happy'); twoShot(L);
  badge('gold', 'BESTER TAG', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, 1); badge('heart', '', W * .78, H * .26, clamp((L.lt - .4) / .2), 1, .7); }, [[.2, 'ding_good', .5]]);
// 131 «Er lächelte.»
shot(160.88, 'S', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6 }); cara(c, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' }); opaCam(L, 6.2, 5.4, 1.7); }, [[0, 'chime_soft', .3]]);
// 132 «Dann wanderte sein Blick langsam nach unten.» (zoom lento): sus ojos bajan despacio
shot(161.57, 'Z', 'slow', L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, headX: .55 + easeInOut(L.k) * .35 }); cara(c, L.T, { expr: 'warm', eyes: L.k > .4 ? 'down' : 'normal', mouth: 'smile', noBlink: true }); opaCam(L, 6.2, 5.4, 1.5); }, [[0, 'tension_low', .5]]);
// 133 «Zu meinem Bauch.»: desde sus ojos: mi barriga
shot(163.50, 'C', null, L => { zimmerK(L, { mode: 'night' }); const t = teenChair(L, handPose); cara(t, L.T, { expr: 'happy', mouth: 'smile' }); myKnopfCam(t, L); }, [[0, 'heartbeat_soft', .5]]);
// 134 «Dorthin, wo mein Knopf gewesen war.» (zoom lento): solo la marca donde estaba el botón
shot(164.31, 'Z', 'slow', L => { zimmerK(L, { mode: 'night' }); const t = teenChair(L, handPose); myKnopfCam(t, L); }, [[0, 'heartbeat_soft', .6]]);
// 135 «Sein Lächeln verschwand.»
shot(166.00, 'I', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, headX: .7 }); cara(c, L.T, { expr: 'worried', eyes: 'down', mouth: L.lt > .4 ? 'frown' : 'smile', noBlink: true }); opaCam(L, 6.2, 5.4, 1.5); }, [[.4, 'sad_hit', .4]]);
// 136 «Du hast ihn benutzt?»: me mira, en shock
shot(167.10, 'C', 'punch', L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, headX: .2 }); talk(c, L.T, 167, 168.26, 'shock'); opaCam(L, 6.2, 5.4, 1.7); }, [[0, 'hit_soft', .5]]);
// 137 «Ich nickte.»
shot(168.26, 'W', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L); const t = teenChair(L, { ...handPose, headX: .1 + Math.max(0, Math.sin(L.lt * 9)) * .25 }); cara(t, L.T, { expr: 'happy', mouth: 'smile' }); onFace(t, 4.6, .1, .2, 40, L.k, 4); }, [[0, 'sniff', .3]]);
// 138 «Seine Augen füllten sich» (zoom lento): los ojos se le llenan de lágrimas
shot(168.94, 'Z', 'slow', L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, headX: .2 }); cara(c, L.T, { expr: 'cry', mouth: 'frown' }); if (L.lt > .5) tears(c, L.T); opaCam(L, 6.2, 5.4, 1.3); }, [[0, 'music_swell', .4]]);
// 139 «mit Tränen.»: plano de los dos, él llorando, yo sujetándole la mano
shot(170.10, 'S', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, aRx: 1.1, aRz: -.5, aRe: .3 }); cara(c, L.T, { expr: 'cry', mouth: 'frown' }); tears(c, L.T); const t = teenChair(L, handPose); cara(t, L.T, { expr: 'sad', mouth: 'smile' });
  twoShot(L, -2); }, [[0, 'sob_old', .4]]);
// 140 «Aber warum, Großer?»: llorando
shot(171.26, 'C', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, headX: .15 }); talk(c, L.T, 171.2, 172.91, 'cry'); tears(c, L.T); opaCam(L, 6.2, 5.4, 1.7); }, [[0, 'sob_old', .4]]);
// 141 «Ich lächelte.»
shot(172.91, 'S', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L); const t = teenChair(L, handPose); cara(t, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' }); tears(t, L.T); onFace(t, 4.4, .1, .5, 40, L.k, 3.8); }, [[0, 'chime_soft', .3]]);
// 142 «Weil du deinen für mich benutzt hast.»: recuerdo en sepia: aquella noche, el Opa pulsando su botón por mí
shot(173.68, 'R', null, L => { opaS(L); night(30); grade.uniforms.sepia.value = .8; const c = put(opa, OPX - 3, 0, 8, .2); const pr = L.lt > .5; c.knopfOn(!pr, 3); actuar(c, L.lt, [[0, { headX: .5 }], [.25, { aRx: .95, aRz: -.42, aRe: 1.75, headX: .5, lean: .06 }, { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'warm', eyes: 'closed', mouth: 'smile' });
  if (pr) ringwave(kp(c), clamp((L.lt - .5) / .7), camera.position, 8); onBody(c, 13, -.3, .1, 42, L.k, 11, -.15); sh(V(OPX, 0, 6), 16); }, [[0, 'memory_whoosh', .5], [.5, 'button_click', .5]]);
// 143 «Und ich wollte dir auch einen guten Tag schenken.»
shot(175.49, 'W', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L, { headY: -.6 }); cara(opaH, L.T, { expr: 'cry', mouth: 'frown' }); const t = teenChair(L, handPose); talk(t, L.T, 175.4, 177.43, 'happy'); tears(t, L.T); onFace(t, 5, .2, .5, 40, L.k, 4.2); }, [[0, 'music_swell', .3]]);
// 144 «Opa drückte meine Hand und flüsterte:»
shot(177.43, 'S', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L, { aRx: 1.1, aRz: -.5, aRe: .3 + Math.max(0, Math.sin(L.lt * 6)) * .2 }); const t = teenChair(L, handPose); handCam(t, L); }, [[.3, 'hand_squeeze', .5]]);
// 145 «Das hättest du nicht tun müssen.»
shot(179.09, 'Z', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, headX: .2 }); talk(c, L.T, 179, 180.83, 'cry'); tears(c, L.T); opaCam(L, 6.2, 5.4, 1.4); }, [[0, 'breath_slow', .3]]);
// 146 «Ich weiß.»
shot(180.83, 'C', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L); const t = teenChair(L, handPose); talk(t, L.T, 180.8, 181.49, 'happy'); onFace(t, 4.2, .1, .6, 40, L.k, 3.8); }, [[0, 'chime_soft', .3]]);
// 147 «Aber du auch nicht.»: sonrío; una lágrima
shot(181.49, 'F', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L); const t = teenChair(L, handPose); talk(t, L.T, 181.4, 182.57, 'happy', { eyes: 'happy' }); tears(t, L.T); onFace(t, 3.8, .1, .5, 40, L.k, 3.2); }, [[0, 'music_swell', .4]]);
// 148 «Und erst in diesem Moment verstand ich,» (zoom lento): los dos desde fuera de la ventana, la habitación encendida en la noche
shot(182.57, 'B', 'slow', L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, aRx: 1.1, aRz: -.5, aRe: .3 }); cara(c, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' }); const t = teenChair(L, handPose); cara(t, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  cm([KZX + 12, 12, 4], [KZX + 10.6, 11, 3], L.k); camera.lookAt(KZX + .7, 6.8, -2.4); camera.fov = 46; }, [[0, 'music_swell', .4]]);
// 149 «warum er es nie bereut hat,»: recuerdo cálido: el Opa en la grada, saltando y celebrando mi gol
shot(184.55, 'S', null, L => { sportS(L, { dusk: true, score: [1, 0] }); grade.uniforms.sepia.value = .45; const j = Math.abs(Math.sin(L.T * 6)) * .6; const c = put(opa, SPX - 27.8, 1.2 + j, 0, PI / 2); opaBtn(c, L.T); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T); confetti(V(SPX - 26, 2, 0), L.t0, L.T, 40, .8);
  onBody(c, 12, .15, .06, 42, L.k, 10.5, .05, 3.6); sh(V(SPX - 28, 0, 0), 14); }, [[0, 'goal_crowd', .3]]);
// 150 «seinen Knopf zu drücken.»: la ventana del hospital en la noche; todo se funde a negro
shot(186.01, 'F', null, L => { klinikS(L, { night: true }); cm([KAX + 6, 22, 40], [KAX + 4, 20, 32], L.k); camera.lookAt(KAX, 20, -16); camera.fov = 46; sh(V(KAX, 0, -10), 40); DARK = clamp((L.lt - .6) / 1); }, [[0, 'night_amb', .5], [.1, 'chime_soft', .4]]);
