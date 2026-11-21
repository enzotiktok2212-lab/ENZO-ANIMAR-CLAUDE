// ---------- c: la mañana, el día con Mia, camino al estanque (34,48 – 68,3 s) ----------
const kidsAt = (x, z, ry, gap = 2.3) => { put(ich, x - Math.cos(ry) * gap / 2, 0, z + Math.sin(ry) * gap / 2, ry); put(mia, x + Math.cos(ry) * gap / 2, 0, z - Math.sin(ry) * gap / 2, ry); };
const flashback = () => { grade.uniforms.sepia.value = .35; grade.uniforms.sat.value = .9; };
// 24 «Heute früh:»: me despierto en el sofá, bostezo y me estiro; el reloj marca las 7:15
shot(34.48, 'F', null, L => { stubeOn(); ST.setClock(7, 15); const c = put(ich, SX(9), 0, 6, -.5); actuar(c, L.lt, [[0, { aLx: 2.8, aRx: 2.8, aLz: .3, aRz: .3, aLe: .4, aRe: .4, lean: -.12, headX: -.2 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' });
  cm([SX(4), 5.5, 16], [SX(5), 5, 14], L.k); camera.lookAt(SX(8), 3.4, 4); badge('tag', '7:15', W / 2, H * .15, (L.lt - .1) * 3, 1, .9); }, [[0, 'yawn_big', .5], [.1, 'clock_tick', .4]]);
// 25 «jeder Spiegel verhängt.»: barrido por los espejos tapados con sábanas; yo los miro
shot(34.94, 'W', null, L => { stubeOn(); const c = put(ich, SX(-12.7), 0, 12.8, -PI / 2 + 1.4); actuar(c, L.lt, [[0, 'idle'], [.4, { headY: -.6 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  const k = easeInOut(L.k); cam([SX(-8), 5.5, lerp(19, 17, k)], [SX(-8.5), 5.4, lerp(18, 16, k)], 50); camera.lookAt(SX(-19.7), 4.6, lerp(9, 2, k)); }, [[0, 'cloth', .5], [.5, 'creepy_ting', .4]]);
// 26 «Papa hatte das Radio ausgesteckt.»: Papa tira del enchufe junto al aparador; la radio se calla
shot(36.90, 'S', null, L => { stubeOn(); const k = easeOut(clamp((L.lt - .5) / .3)); ST.PLUG.position.set(4.8 - k * .6, 1.6 + k * .8, -1.5 - k * 1.4);
  const p = put(papa, SX(15.6), 0, -5, PI / 2 - .9); actuar(p, L.lt, [[0, { aRx: .9, aRz: -.1, aRe: .4, lean: .3, crouch: .25 }], [.5, { aRx: 1.4, aRe: 1.4, lean: .05, crouch: .1 }, { dur: .2 }]], { T: L.T }); cara(p, L.T, { expr: 'sad' });
  cm([SX(7), 5.4, -10.5], [SX(8.5), 5, -10], L.k); camera.lookAt(SX(17), 2.6, -5.4); badge('tag', 'RADIO AUS', W / 2, H * .15, (L.lt - .6) * 3, 1, .8); }, [[0, 'radio', .4], [.5, 'click_metal', .7], [.55, 'silence_tick', .4]]);
// 27 «Mama backte Apfelpfannkuchen,»: primer plano de la torre de tortitas de manzana con azúcar glas; vapor
shot(38.84, 'Z', 'punch', L => { stubeOn(); show(PANC, SX(-1), 3.1, -3, L.lt * .3, 1); orbit(V(SX(-1), 4.4, -3), lerp(7.5, 6, L.k), .3, .35, 42); }, [[0, 'pan_sizzle', .6], [.3, 'steam', .4], [.8, 'plate_slide', .4]]);
// 28 «erstmals seit dem Unfall.»: Mama en el fogón con los ojos llorosos; en la nevera el dibujo de Mia
shot(40.48, 'R', null, L => { stubeOn(); const m = put(mama, SX(-12), 0, -9.4, .35); actuar(m, L.lt, [[0, { aRx: 1.1, aRe: .7, aLx: .9, aLe: 1.6, headX: .25 }]], { T: L.T }); cry(m, L.T);
  onFace(m, lerp(7.5, 6, L.k), -.6, -1.4, 42); }, [[0, 'sad_tone', .5], [.4, 'pan_sizzle', .3], [.8, 'sniff', .5]]);
// 29 «Also klar:»: mi cara de sorpresa (golpe de zoom)
shot(41.92, 'C', 'punch', L => { stubeOn(); const c = put(ich, SX(2), 0, 4, .2); actuar(c, L.lt, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(c, lerp(5.2, 4.4, L.k), -.4, 0, 40); }, [[0, 'impact', .6], [.05, 'gasp', .5]]);
// 30 «Mias Besuchstag.»: Mia entra por la puerta con su gorro y abrigo, sonriendo; «BESUCHSTAG»
shot(42.84, 'F', null, L => { stubeOn(); ST.DOOR.rotation.y = -PI / 2 - easeOut(clamp(L.lt / .5)) * 1.3; caminar(mia, L.lt, { x: SX(18), z: 10, ry: -PI / 2 - .4, speed: 2.4, T: L.T, stopAt: .9 }); cara(mia, L.T, { expr: 'happy', mouth: 'open_smile' }); actuar(mia, L.lt, [[0, 'idle'], [.9, 'wave', { dur: .3 }]], { T: L.T });
  orbit(V(SX(15), 2.6, 9.5), lerp(10, 8, L.k), -1.1, .1, 46); badge('tag', 'MIAS BESUCHSTAG', W / 2, H * .15, (L.lt - .3) * 3, 1, .85); }, [[0, 'door_open', .6], [.4, 'steps', .4], [.9, 'kids_laugh', .3]]);
// 31 «Ich schwor mir, dass sie es nie merkt.»: yo, decidido, aprieto el puño; Mia detrás quitándose el gorro
shot(44.08, 'I', null, L => { stubeOn(); const c = put(ich, SX(6), 0, 7, .5); actuar(c, L.lt, [[0, 'idle'], [.3, { aRx: 1.9, aRz: -.3, aRe: 2.2, lean: .05 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  const m = put(mia, SX(10), 0, 4, -.4); actuar(m, L.lt, [[0, { aLx: 2.6, aRx: 2.6, aLe: 1.6, aRe: 1.6 }]], { T: L.T }); cara(m, L.T, { expr: 'happy' });
  onFace(c, lerp(7, 5.8, L.k), -.4, -1.2, 42); }, [[.3, 'whoosh', .3], [.35, 'impact', .4]]);
// 32 «Als sie fragte, warum Mama weint,»: Mama llora cortando cebollas; Mia me tira de la manga y la señala
shot(46.28, 'W', null, L => { stubeOn(); show(BOARD, SX(-14), 3.25, -12.2, 0, 1); const m = put(mama, SX(-14), 0, -9.6, 0); actuar(m, L.lt, [[0, { aRx: .9, aRe: 1.2 + Math.sin(L.T * 14) * .25, aLx: .7, aLe: 1.1, headX: .3 }]], { T: L.T }); attach(KNIFE, m.aR.hand, [0, -.55, .3], [-.3, 0, 0]); cry(m, L.T);
  const a = put(mia, SX(-7.2), 0, -3.4, -.9), b = put(ich, SX(-5), 0, -2.6, -1.2); actuar(a, L.lt, [[0, 'point']], { T: L.T }); talk(a, L.T, 46.28, 48, 'worried'); actuar(b, L.lt, [[0, 'idle']], { T: L.T }); cara(b, L.T, { expr: 'worried' });
  cm([SX(-2), 6.5, 9], [SX(-3.5), 6, 7], L.k); camera.lookAt(SX(-10), 3.2, -6.5); }, [[0, 'chalk', .3], [.2, 'cry_girl', .2], [.8, 'sniff', .4]]);
// 33 «sagte ich: Zwiebeln.»: levanto una cebolla y sonrío nervioso; Mia la mira
shot(48.00, 'C', 'punch', L => { stubeOn(); const c = put(ich, SX(-5), 0, -2.6, .2); actuar(c, L.lt, [[0, { aRx: 1.5, aRz: -.4, aRe: 1.2 }]], { T: L.T }); attach(ONI, c.aR.hand, [0, -.7, .25], [0, 0, 0], .8); grin(c, L.T); sweat(c, L.T, 2);
  const a = put(mia, SX(-2.6), 0, -1.4, -.6); cara(a, L.T, { expr: 'confused' }); onFace(c, lerp(8, 6.8, L.k), -.6, -1.4, 44); badge('big', 'ZWIEBELN!', W / 2, H * .15, (L.lt - .8) * 3, 1, .8); }, [[0, 'pop', .5], [.8, 'boing_metal', .3]]);
// 34 «Den ganzen Tag ließ Mia meine Hand nicht los.»: Mia y yo de la mano por el salón y luego en el sofá; primer plano de las manos
shot(49.56, 'S', null, L => { stubeOn(); const x0 = SX(2), z0 = 6; caminar(ich, L.lt, { x: x0, z: z0, ry: PI / 2, speed: 1.6, T: L.T, extra: { aLx: .35, aLz: -.3, aLe: .2 } }); caminar(mia, L.lt, { x: x0, z: z0 + 2.1, ry: PI / 2, speed: 1.6, T: L.T + .3, extra: { aRx: .5, aRz: .3, aRe: .3 } });
  cara(mia, L.T, { expr: 'happy' }); cara(ich, L.T, { expr: 'neutral' }); const h = V(x0 + L.lt * 1.6, 2.2, z0 + 1); cm([h.x + 1, 3.4, h.z + 9], [h.x + 2, 3, h.z + 7.5], L.k); camera.lookAt(h.x, 2.6, h.z); badge('tag', 'DEN GANZEN TAG', W / 2, H * .15, (L.lt - .2) * 3, 1, .8); }, [[0, 'steps', .4], [.9, 'cloth', .3]]);
// 35 «Kater Socke»: el gato negro con calcetines blancos en el porche nevado; nos acercamos
shot(51.86, 'Z', null, L => { town(); const d = hz(1, 9.6); show(CAT, d.x, 0, d.z, PI / 2); CAT.userData.set('calm'); CAT.userData.tail.rotation.y = Math.sin(L.T * 3) * .4;
  orbit(V(d.x, 1.8, d.z), lerp(8, 6.5, L.k), PI / 2 + .35, .15, 42); sh(d, 20); badge('tag', 'KATER SOCKE', W / 2, H * .15, (L.lt - .2) * 3, 1, .85); }, [[0, 'steps_snow', .4], [.4, 'wind', .3]]);
// 36 «fauchte, sobald wir kamen.»: el gato arquea el lomo y bufa cuando llegamos de la mano; nos asustamos
shot(52.84, 'C', 'punch', L => { town(); const d = hz(8, 9.6); show(CAT, d.x, 0, d.z, PI / 2 + .3); const k = easeOut(clamp(L.lt / .25)); CAT.userData.arch(k); CAT.userData.set(k > .3 ? 'hiss' : 'calm');
  kidsAt(d.x + 5.5, d.z, -PI / 2 - .5, 2.4); actuar(ich, L.lt, [[0, { ...handL }], [.2, { ...GEST.recoil, ...handL }, { dur: .25 }]], { T: L.T }); actuar(mia, L.lt, [[0, { ...handR }], [.2, { ...GEST.recoil, ...handR }, { dur: .25 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock' }); cara(mia, L.T, { expr: 'shock' });
  orbit(V(d.x + 2.8, 2.2, d.z), lerp(22, 19, L.k), PI - .2, .14, 46); sh(d, 30); }, [[0, 'growl', .7], [.1, 'gasp', .4]]);
// 37 «Papa starrte uns an,»: Papa en la puerta del porche nos mira fijamente, triste
shot(54.44, 'W', null, L => { town(); const d = hz(4.7, 8.6); const p = put(papa, d.x, 0, d.z, PI / 2 + .3); actuar(p, L.lt, [[0, 'idle']], { T: L.T }); cara(p, L.T, { expr: 'sad', eyes: 'normal' });
  orbit(headC(p).add(V(0, -1.2, 0)), lerp(13, 10, L.k), PI / 2 + .25, .05, 44); sh(d, 30); }, [[0, 'wind', .4], [.6, 'heartbeat', .4]]);
// 38 «als wollte er sich alles einprägen.»: primer plano de Papa con lágrimas
shot(55.78, 'F', 'slow', L => { town(); const d = hz(4.7, 8.6); const p = put(papa, d.x, 0, d.z, PI / 2 + .3); actuar(p, L.lt, [[0, 'idle']], { T: L.T }); cry(p, L.T); onFace(p, lerp(5.2, 4.2, L.k), -.4, 0, 40); sh(d, 20); }, [[0, 'sad_tone', .5], [.5, 'sniff', .5]]);
// 39 «Um halb fünf»: el reloj de la pared: 4:30
shot(57.38, 'Z', 'punch', L => { stubeOn(); ST.setClock(4, 30); const p = wpos(ST.CLK); cam([p.x + Math.sin(L.lt) * .4, p.y, p.z + lerp(5.4, 4.4, L.k)], [p.x, p.y - .2, p.z], 40); badge('tag', '16:30', W / 2, H * .15, (L.lt - .1) * 3, 1, .9); }, [[0, 'clock_tick', .7], [.4, 'bell_far', .4]]);
// 40 «zog sie mich zum Teich.»: atardecer: Mia tira de mi mano por la calle nevada hacia el estanque
shot(58.30, 'S', null, L => { teichOn(); const x0 = TXX(12), z0 = 78; caminar(mia, L.lt, { x: x0, z: z0, ry: PI + .1, speed: 4.2, run: true, T: L.T, extra: { aRx: -.6, aRz: .3, aRe: .2 } }); caminar(ich, L.lt, { x: x0 + 2, z: z0 + 2.4, ry: PI + .1, speed: 4.2, T: L.T + .2, extra: { aLx: 1.2, aLz: -.3, aLe: .1, lean: -.15 } });
  cara(mia, L.T, { expr: 'determined' }); cara(ich, L.T, { expr: 'worried' }); orbit(V(x0 + 1, 2.4, z0 - L.lt * 4.2), lerp(16, 13, L.k), PI - .5, .1, 46); sh(V(x0, 0, z0 - 4), 30); }, [[0, 'run_grass', .4], [0, 'steps_snow', .6], [.5, 'wind', .4]]);
// 41 «Sieht sie das Eis, erinnert sie sich.»: plano general: el estanque helado al sol bajo, nosotros llegando; mi cara preocupada
shot(59.86, 'R', 'slow', L => { teichOn(); const z0 = 48 - L.lt * 2.2; caminar(mia, L.lt, { x: TXX(4), z: z0 + 4, ry: PI, speed: 2.2, T: L.T, extra: handR }); caminar(ich, L.lt, { x: TXX(6.4), z: z0 + 4, ry: PI, speed: 2.2, T: L.T + .3, extra: handL }); cara(ich, L.T, { expr: 'worried' }); cara(mia, L.T, { expr: 'sad' });
  orbit(V(TXX(5), 3, z0), lerp(24, 17, L.k), PI + .45, .16, 46); sh(V(TXX(5), 0, z0), 40); }, [[0, 'steps_snow', .5], [.4, 'freeze', .4]]);
// 42 «Am Ufer weinte sie.»: en la orilla Mia llora; primer plano
shot(61.92, 'C', null, L => { teichOn(); visitor(ich); const m = put(mia, TXX(3), .1, 31, PI + .3); actuar(m, L.lt, [[0, { headX: .1 }]], { T: L.T }); cry(m, L.T); put(ich, TXX(5.6), .1, 32, PI - .6);
  onFace(m, lerp(5.4, 4.6, L.k), .5, .6, 42); sh(V(TXX(3), 0, 31), 20); }, [[0, 'cry_girl', .4], [.5, 'wind', .3]]);
// 43 «Hier hast du mich gerettet.»: Mia me mira y habla llorando; yo, de espaldas en primer término (contraplano)
shot(63.50, 'W', null, L => { teichOn(); visitor(ich); const m = put(mia, TXX(3), .1, 31, PI / 2 - .3), c = put(ich, TXX(6.2), .1, 31.4, -PI / 2 - .2); actuar(m, L.lt, [[0, { aRx: 1.0, aRz: -.2, aRe: .5 }]], { T: L.T }); talk(m, L.T, 63.5, 64.9, 'sad'); tears(m, L.T); cara(c, L.T, { expr: 'sad' });
  cm([TXX(9.4), 4.2, 25.6], [TXX(8.8), 4, 26.4], L.k); camera.lookAt(TXX(3.4), 2.1, 31); }, [[0, 'sniff', .5], [.4, 'wind', .3]]);
// 44 «Du hast mich aufs Eis geschoben,» (recuerdo, gris): yo en el agua empujo a Mia hacia arriba, sobre el hielo
shot(64.94, 'F', null, L => { teichOn(); day(); SUNM.visible = false; setSky([.6, .66, .78], [.75, .8, .88], [.88, .9, .94]); flashback(); FPM.visible = false; TE.HOLE.visible = true; const k = easeOut(clamp(L.lt / 1.1));
  const c = put(ich, TXX(4), -1.6, -6, -PI / 2 + .8); actuar(c, L.lt, [[0, { aLx: 2.8, aRx: 2.8, aLe: .4, aRe: .4, headX: -.3 }]], { T: L.T, extra: shiver(L.T, .6) }); cara(c, L.T, { expr: 'determined', mouth: 'open' });
  const m = put(mia, lerp(TXX(3), TXX(-1), k), lerp(-.6, .1, k), -6, -PI / 2); m.root.rotation.z = k * 1.2; cara(m, L.T, { expr: 'shock', mouth: 'o' }); dust(V(TXX(4), 0, -6), 0, L.lt, 10, .5);
  orbit(V(TXX(2.5), 1.2, -6), lerp(14, 12, L.k), PI / 2 + .3, .35, 46); sh(V(TXX(4), 0, -6), 30); }, [[0, 'splash', .7], [.3, 'shout_m', .2], [.7, 'land', .4]]);
// 45 «aber du bist nicht mehr aufgetaucht.» (zoom lento): el agujero oscuro en el hielo, burbujas, nadie
shot(66.48, 'I', 'slow', L => { teichOn(); day(); SUNM.visible = false; setSky([.6, .66, .78], [.75, .8, .88], [.88, .9, .94]); flashback(); grade.uniforms.sat.value = .7; FPM.visible = false; TE.HOLE.visible = true;
  const m = put(mia, TXX(4), .1, -10.6, .1); m.root.rotation.x = 0; actuar(m, L.lt, [[0, { crouch: .5, lean: .5, aLx: 1.4, aRx: 1.4, lLk: 1, lRk: 1 }]], { T: L.T }); cry(m, L.T);
  orbit(V(TXX(4), 1, -8), lerp(15, 10, L.k), .15, .55, 46); sh(V(TXX(4), 0, -7), 30); }, [[0, 'water_bloop', .6], [.6, 'water_bloop', .4], [1.0, 'heartbeat', .5]]);
