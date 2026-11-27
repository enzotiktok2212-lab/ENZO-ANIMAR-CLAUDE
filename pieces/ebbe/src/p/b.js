// ---------- b: Jonte y sus conchas, la familia, el Muschelhorn de Opa, el día de la Ebbe (34,1 – 67,5 s) ----------
const JD = (x, z) => V(JZX + x, 0, z);
// 27 «Ich heiße Jonte»: Jonte en su cuarto, delante de las estanterías de conchas, saluda a cámara
shot(34.08, 'Z', 'punch', L => { zimmer(L); pose(jonte, JZX - 4, 0, -12, .35, L, 'wave', 'happy'); talk(jonte, L.T, 34, 35, 'happy'); BUCKET.visible = false;
  onFace(jonte, 8, .2, 1.5, 42, L.k, 6.5); }, [[0, 'pop', .5]]);
// 28 «Ich sammle Muscheln»: coloca una concha rosa en la estantería llena
shot(35.08, 'W', null, L => { zimmer(L); BUCKET.visible = false; pose(jonte, JZX - 22, 0, -6, -PI / 2, L, { aRx: lerp(1.2, 1.9, easeInOut(L.k)), aRe: .5, aRz: -.1, headY: -.2 }, 'happy', { mouth: 'smile' }); attach(SHELLS[1], jonte.aR.hand, [0, -.5, .3], [0, 0, 0], 1);
  cm([JZX - 14, 9, 3, JZX - 23, 7, -6, 46], [JZX - 15, 8.6, 1, JZX - 23, 7, -6, 44], L.k); }, [[.5, 'shell_clink', .7]]);
// 29 «Dreihundertzwölf Stück»: barrido por todas las estanterías; contador 312
shot(35.84, 'S', null, L => { zimmer(L); cm([JZX - 14, 14, 6, JZX - 29, lerp(20, 8, L.k), -6 + lerp(-8, 8, L.k), 50], [JZX - 15, 12, 6, JZX - 29, lerp(20, 8, L.k), -6 + lerp(-8, 8, L.k), 50], L.k, k => k);
  badge('gold', String(Math.round(lerp(1, 312, easeOut(clamp(L.lt / .7))))), W / 2, H * .24, 1, 1, 1.4); }, [[0, 'counter_tick', .7]]);
// 30 «Halt dir eine ans Ohr»: Jonte con los ojos cerrados, una concha en la oreja
shot(37.28, 'F', null, L => { zimmer(L); BUCKET.visible = false; pose(jonte, JZX + 8, 0, -8, -.3, L, { aRx: 2.4, aRz: .5, aRe: 2.2, headZ: .15 }, 'happy', { eyes: 'closed', mouth: 'smile' }); attach(SHELLS[3], jonte.aR.hand, [0, -.4, .2], [0, 0, 1.2], 1.4);
  onFace(jonte, 6, .1, 1.6, 40, L.k, 5); }, [[.1, 'ocean_shell', .8]]);
// 31 «und sie summt ihr eigenes Lied»: notas que salen de la concha; Jonte tararea
shot(38.47, 'I', null, L => { zimmer(L); BUCKET.visible = false; pose(jonte, JZX + 8, 0, -8, -.3, L, { aRx: 2.4, aRz: .5, aRe: 2.2, headZ: .15, headY: Math.sin(L.T * 3) * .1 }, 'happy', { eyes: 'closed', mouth: Math.sin(L.T * 8) > 0 ? 'o' : 'smile' }); attach(SHELLS[3], jonte.aR.hand, [0, -.4, .2], [0, 0, 1.2], 1.4);
  notes(wpos(SHELLS[3]), L.T, 5, 1); onFace(jonte, 7, .5, -2, 42, L.k); }, [[0, 'hum_tune', .7]]);
// 32 «Ich kenne sie alle»: ante su caja de conchas, señala orgulloso cada una
shot(39.94, 'C', null, L => { zimmer(L); BUCKET.visible = false; pose(jonte, JZX + 12, 0, -13, PI, L, { aRx: 1.2, aRe: .3, aRz: .1 + Math.sin(L.T * 4) * .2 }, 'happy', { mouth: 'open_smile' });
  cm([JZX + 6, 12, -6, JZX + 12, 7, -18, 44], [JZX + 7, 11, -8, JZX + 12, 7, -18, 42], L.k); }, [[.2, 'shell_clink', .5]]);
// 33 «Jede Familie hat so einen komischen Sammler»: el salón de casa: Mama con el móvil, Papa con el periódico, Opa con su pipa… y la mesa cubierta de conchas
shot(40.78, 'W', null, L => { stube(L); sit(papa, OPX + 4, 3.6, -6, 0, L, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }); cara(papa, L.T, { expr: 'happy', mouth: 'smile' });
  pose(mama, OPX - 4, 0, -2, .4, L, { aLx: .3, aRx: 1.4, aRe: 1.6, headX: .2 }, 'happy', { mouth: 'smile' }); pose(opa, OPX + 12, 0, -4, -.5, L, { aRx: 1.6, aRe: 2, headY: -.2 }, 'warm', { mouth: 'smile' });
  pose(jonte, OPX + 2, 0, 4, PI + .2, L, { aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, crouch: .1 }, 'happy', { mouth: 'open_smile' }); for (let i = 0; i < 6; i++) show(SHELLS[i], OPX - 2 + i * 1.4, .3, 6 + (i % 2), i, 1.2);
  cm([OPX + 2, 14, 30, OPX + 2, 5, -2, 50], [OPX + 2, 13, 26, OPX + 2, 5, -2, 48], L.k); }, [[0, 'room_tone', .5], [.3, 'clock_tick', .4]]);
// 34 «Bei uns bin das ich»: Jonte levanta el cubo lleno de conchas con una sonrisa enorme; la familia se ríe
shot(42.86, 'Z', 'punch', L => { stube(L); pose(jonte, OPX + 2, 0, 2, 0, L, { aRx: 2.6, aRz: .3, aRe: .3, aLx: .4 }, 'joy'); grin(jonte, L.T); pose(mama, OPX - 6, 0, -4, .6, L, { aLx: 1.2, aLe: 1.6 }, 'joy'); laughF(mama, L.T); pose(opa, OPX + 9, 0, -3, -.6, L, {}, 'joy'); laughF(opa, L.T);
  onFace(jonte, 9, 1, 0, 44, L.k, 7.5); }, [[0, 'laugh_family', .6]]);
// 35 «Die anderen Kinder sagen»: en el paseo, tres niños se burlan de Jonte señalándolo
shot(43.98, 'R', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 4 }); pose(jonte, 3, CH, -14, PI - .6, L, { aLx: .3, aRx: .3, headX: .2 }, 'sad');
  [NB[13], NB[18], NB[23]].forEach((c, i) => { pose(c, -5 + i * 2.6, CH, -12 + i * 1.2, PI / 2 + .3 - i * .2, L, i === 1 ? { aRx: 1.6, aRe: .1 } : { aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, lean: -.1 }, 'joy'); laughF(c, L.T + i); });
  cm([-3, CH + 5, -28, -1, CH + 3, -12, 46], [-2, CH + 5, -25, -1, CH + 3, -12, 44], L.k); }, [[0, 'kids_laugh', .7]]);
// 36 «das langweiligste Hobby der Welt»: un niño finge dormirse de aburrimiento (Zzz); Jonte abraza su cubo
shot(45.42, 'G', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 4 }); pose(NB[18], -2, CH, -12, PI + .3, L, { headX: .4, headZ: .3, aLx: .2, aRx: .2, lean: .1 }, 'tired', { eyes: 'closed', mouth: 'o' }); pose(jonte, 4, CH, -13, PI - .5, L, { aLx: 1, aLe: 1.4, aRx: 1, aRe: 1.4 }, 'sad');
  onFace(NB[18], 8, .5, -2, 44, L.k); badge('big', 'LANGWEILIG!', W / 2, H * .22, (L.lt - .2) * 3, 1, .9); }, [[.2, 'snore', .7]]);
// 37 «Opa hat mir sein altes Muschelhorn geschenkt»: junto a la chimenea, Opa le entrega la caracola con las dos manos
shot(46.97, 'B', null, L => { stube(L); const k = easeInOut(clamp(L.lt / .9)); pose(opa, OPX - 15, 0, -14, 1.0, L, { aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4, lean: .15 }, 'warm', { mouth: 'smile' });
  pose(jonte, OPX - 8.6, 0, -12.6, -2.1, L, { aLx: 1.2 + k * .3, aRx: 1.2 + k * .3, aLe: .6, aRe: .6 }, 'shock', { mouth: 'o' }); show(HORN, lerp(OPX - 12.6, OPX - 11.2, k), 5.6, lerp(-13, -12.8, k), -.6, .55);
  cm([OPX - 11, 9, 4, OPX - 11.5, 5.5, -13, 46], [OPX - 11, 8.5, 1, OPX - 11.5, 5.5, -13, 44], L.k); }, [[0, 'fire_crackle', .7]]);
// 38 «Muschelhorn»: primer plano de la caracola en manos de Jonte, la luz del fuego en el nácar
shot(48.08, 'F', 'punch', L => { stube(L); pose(jonte, OPX - 9, 0, -12, .3, L, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5 }, 'shock', { mouth: 'o' }); attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55);
  const h = wpos(HORN); cm([h.x + 3, h.y + 1.8, h.z + 5, h.x, h.y, h.z, 38], [h.x + 2.4, h.y + 1.4, h.z + 4, h.x, h.y, h.z, 36], L.k); }, [[0, 'sparkle', .7]]);
// 39 «Es wird seit der letzten großen Ebbe weitergegeben»: zoom lento a la foto antigua «EBBE 1926»
shot(49.2, 'Z', 'slow', L => { stube(L); cm([OPX + 6, 17, -10, OPX + 6, 17, -24, 44], [OPX + 6, 17, -16, OPX + 6, 17, -24, 40], L.k); BW = .4; }, [[0, 'old_paper', .5]]);
// 40 «„Wenn das Meer zurückkommt", hat er gesagt»: Opa, serio, a la luz del fuego
shot(51.5, 'W', null, L => { stube(L); pose(opa, OPX - 15, 0, -14, .6, L, { aRx: .8, aRe: 1.2, aRz: -.1, headX: .1 }, 'determined'); talk(opa, L.T, 51.5, 53.6, 'determined');
  onFace(opa, 7, .2, 2, 42, L.k, 5.5); }, [[0, 'fire_crackle', .6]]);
// 41 «„fangen die Muscheln an zu singen"»: las conchas de la estantería brillan y salen notas
shot(53.64, 'I', null, L => { zimmer(L); notes(V(JZX - 27, 10, -6), L.T, 7, 1.4); notes(V(JZX - 27, 17, -2), L.T + .5, 6, 1.2, 7); lp(1, JZX - 24, 12, -6, 40, 0xc8e8ff, 30);
  cm([JZX - 14, 13, 4, JZX - 29, 13, -6, 48], [JZX - 17, 13, 2, JZX - 29, 13, -6, 46], L.k); }, [[0, 'shells_sing', .8]]);

// 42 «Bei Sonnenaufgang war das Meer weg»: amanecer; el fondo marino seco hasta el horizonte, el pueblo en lo alto
shot(55.07, 'P', null, L => { kueste(L, { t: 'dawn' }); cm([-40, 22, 160, 0, 30, 0, 52], [-30, 26, 150, 0, 34, 0, 50], L.k); crowdBox(L, -40, 40, -7, -10, 14, 29, { y: CH, mode: 'cheer' }); }, [[0, 'birds_dawn', .5]]);
// 43 «Die ganze Stadt ging hinunter»: decenas bajando por las escaleras a la vez, Jonte entre ellos con su cubo
shot(57.14, 'S', null, L => { kueste(L, { t: 'dawn' }); for (let i = 2; i < 10; i++) for (let j = 0; j < 2; j++) onLadder(NB[(i * 2 + j) % 40], i, .15 + j * .45 + ((L.k * .2 + i * .07) % .2), L, i * 2 + j, { expr: 'happy', mouth: 'open_smile' });
  onLadder(jonte, 6, .5 - L.k * .2, L, 3, { expr: 'happy', mouth: 'open_smile' }); crowdBox(L, -60, 60, 20, 40, 8, 31, { mode: 'walk', ry: () => 0 });
  cm([LX(6) + 30, 14, 70, LX(6), 24, 6, 54], [LX(6) + 24, 16, 64, LX(6), 26, 6, 54], L.k); }, [[0, 'ladder_steps', .7], [.3, 'crowd_happy', .5]]);
// 44 «Leuchtende Korallen»: corales que brillan en colores; una niña los mira de cerca
shot(58.74, 'F', null, L => { kueste(L, { t: 'day' }); const c = V(-150, 0, 300); pose(NB[3], c.x + 3, 0, c.z + 9, PI + .4, L, { aLx: 1.3, aLe: .2, lean: .25, crouch: .15 }, 'shock', { mouth: 'o' });
  pose(jonte, c.x + 8, 0, c.z + 10, PI - .3, L, { headX: .2 }, 'happy', { mouth: 'open_smile' }); cm([c.x + 8, 5, c.z + 26, c.x + 2, 2.6, c.z + 2, 46], [c.x + 6, 4.4, c.z + 23, c.x + 2, 2.6, c.z + 2, 44], L.k); }, [[0, 'sparkle', .6], [.3, 'water_drip', .4]]);
// 45 «riesige Walknochen»: gente pasando bajo las costillas de la ballena, cámara baja entre los huesos
shot(59.9, 'R', null, L => { kueste(L, { t: 'day' }); const K = MW.KNOCHEN.position; crowdBox(L, K.x - 6, K.x + 6, K.z - 10, K.z + 4, 5, 33, { mode: 'walk', ry: () => -.6 + PI, expr: 'happy' });
  cm([K.x - 8, 3, K.z + 24, K.x + 2, 6, K.z - 10, 56], [K.x - 4, 3, K.z + 20, K.x + 2, 7, K.z - 10, 56], L.k); }, [[0, 'wind_soft', .6], [.2, 'bone_knock', .5]]);
// 46 «ein versunkenes Piratenschiff»: revelación del barco pirata con la bandera negra; la gente se acerca
shot(61.13, 'Z', 'punch', L => { kueste(L, { t: 'day' }); const S_ = MW.SCHIFF.position; crowdBox(L, S_.x - 30, S_.x + 30, S_.z + 50, S_.z + 70, 9, 35, { mode: i => i % 3 ? 'point' : 'shock', face: S_ });
  cm([S_.x + 10, 6, S_.z + 100, S_.x, 26, S_.z, 54], [S_.x + 6, 8, S_.z + 88, S_.x, 28, S_.z, 54], L.k); }, [[0, 'pirate_flag', .6], [.1, 'crowd_gasp', .6]]);
// 47 «auf der Seite liegend»: contrapicado a lo largo del casco inclinado, mástiles cruzando el cielo
shot(62.53, 'W', null, L => { kueste(L, { t: 'day' }); const S_ = MW.SCHIFF.position; cm([S_.x - 30, 3, S_.z + 30, S_.x, 34, S_.z - 6, 58], [S_.x - 26, 3, S_.z + 26, S_.x, 38, S_.z - 6, 58], L.k); }, [[0, 'wood_creak', .7]]);
// 48 «Ich bin fast sechs Kilometer hinausgelaufen»: Jonte camina solo mar adentro con su cubo; 6 KM
shot(63.73, 'S', null, L => { kueste(L, { t: 'day' }); walk(jonte, L, 10, 700, 0, 2.6, 0, { expr: 'happy', mouth: 'smile' }); cm([4, 4, 740, 10, 4, 700, 44], [2, 5, 742, 10, 4, 704, 44], L.k); badge('gold', '6 KM', W / 2, H * .22, (L.lt - .3) * 3); }, [[0, 'footsteps_sand', .7]]);
// 49 «hinausgelaufen»: cenital: sus huellas en línea recta sobre la arena ondulada
shot(65.0, 'I', null, L => { kueste(L, { t: 'day' }); walk(jonte, L, 10, 720, 0, 2.6, 0, { expr: 'happy' }); cm([10, 40, 724, 10, 0, 728, 50], [10, 44, 728, 10, 0, 732, 50], L.k); }, [[0, 'wind_soft', .5]]);
// 50 «Weiter als alle anderen»: plano enorme: Jonte diminuto lejos, el pueblo y la gente muy atrás, junto al acantilado
shot(66.09, 'Z', null, L => { kueste(L, { t: 'day' }); walk(jonte, L, 10, 760, PI, 2.4, 0, { expr: 'happy' }); crowdBox(L, -60, 60, 120, 260, 12, 37, { mode: 'walk' });
  cm([30, 10, 820, 0, 10, 300, 50], [28, 14, 840, 0, 14, 300, 50], L.k); }, [[0, 'wind_soft', .5]]);
