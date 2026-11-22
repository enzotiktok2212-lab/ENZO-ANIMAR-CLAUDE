// ---------- c: pasan los años, el hospital, la muerte del Opa y mi decisión (75,72 – 130,22 s) ----------
// Habitación del hospital (KZX): la cama en x = 0; el Opa recostado (cabeza hacia -z, mira +z); mi silla a los pies, en (4,4, 5,4), asiento a 2,85, mirando hacia su cabeza.
const CHX = KZX + 4.4, CHZ = 5.4, CHS = 2.85, CHRY = -2.77;
function opaBed(L, pose = {}) { const c = inBed(opaH, L, pose); opaBtn(c, L.T); return c; }
function teenChair(L, pose = {}) { const c = sit(gr, CHX, CHS, CHZ, CHRY, L, { aLx: .5, aRx: .5, aLe: .7, aRe: .7, ...pose }); myBtn(c, L.T); return c; }
// mano en la mano: la mía (izquierda) sobre la cama y la suya
const handPose = { aLx: 1.35, aLz: .15, aLe: .3, lean: .3 };
// plano de las manos: cámara delante de mí, mirando mi mano izquierda
function handCam(t, L) { const q = wpos(opaH.aR.hand), k0 = easeInOut(L.k); return cam([q.x + 1.6 - k0 * .3, q.y + 4.4 - k0 * .4, q.z + 2.6], [q.x - .2, q.y, q.z], 42); const p = wpos(t.aL.hand), k = easeInOut(L.k); cam([p.x + 2.6 - k * .4, p.y + 2.8, p.z - 1.0], [p.x - .6, p.y, p.z - 1.0], 42); }
// mi botón: me pongo de pie junto a la ventana (mirando +x) para que la cama no tape; arms = brazos y cabeza
function myKnopfCam(t, L, arms = { headX: .6, aLx: .3, aRx: .3 }) { put(t, KZX + 7.4, 0, 1.6, PI / 2 - .3); actuar(t, 0, [[0, arms]], { T: L.T }); t.blob.visible = true; onKnopf(t, 4.4, 3.2, L.k, .4, 1.0, 40); }
// cara del Opa en la cama (para encuadres)
const opaHead = () => hp(opaH);
// primer plano del Opa: cabeza y hombros, cámara delante de su cara (él mira +z)
function opaCam(L, d0, d1, side = 0) { const h = opaHead(); cm([h.x + side, h.y + 1.3, h.z + d0], [h.x + side * .8, h.y + 1.1, h.z + d1], L.k); camera.lookAt(h.x, h.y - .9, h.z); camera.fov = 40; }
// plano de los dos (Opa en la cama y yo en la silla), desde delante a la derecha
function twoShot(L, a = 0) { cm([KZX + 9 + a, 11.5, 12], [KZX + 8 + a, 10.8, 10.4], L.k); camera.lookAt(KZX + 1.8, 5.4, -1.4); camera.fov = 46; }

// 65 «Die Jahre vergingen.»: el reloj de la iglesia gira a toda velocidad; el cielo pasa de día a noche varias veces
shot(75.72, 'R', null, L => { town(L); const sp = L.lt * 30; show(CLOCK, 0, 40, -106.6); CLOCK.userData.H1.rotation.z = -sp * .5; CLOCK.userData.H2.rotation.z = -sp * 6; const q = (Math.sin(L.lt * 9) + 1) / 2;
  setSky([lerp(.03, .16, q), lerp(.05, .44, q), lerp(.2, .96, q)], [lerp(.1, .45, q), lerp(.1, .72, q), lerp(.35, 1, q)], [lerp(.3, .86, q), lerp(.2, .94, q), lerp(.45, 1, q)]); sun.intensity = 1 + q * 2; hemi.intensity = .5 + q * .5;
  crowdAt(L, 0, -70, 8, 4, 20, 14, { mode: 'walk', speed: 8 }); cm([10, 12, -50], [6, 24, -66], L.k); camera.lookAt(0, 36, -106); camera.fov = 44; sh(V(0, 0, -80), 50); badge('tag', 'JAHRE SPÄTER', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, 1); }, [[0, 'clock_fast', .7], [.2, 'whoosh_time', .5]]);
// 66 «Ich wurde älter.»: ahora tengo 16: el mismo sitio de la plaza, más alto, sudadera mostaza
shot(76.84, 'F', null, L => { town(L); const c = put(gr, KP.x, 0, KP.z, .2); myBtn(c, L.T); actuar(c, 0, [[0, { aLx: .1, aRx: .1, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral', mouth: 'smile' }); crowdAt(L, KP.x, KP.z - 6, 6, 6, 20, 15, { mode: 'walk' });
  onBody(c, 15, 0, .1, 42, L.k, 12.5); badge('tag', '16 JAHRE', W / 2, H * .17, clamp((L.lt - .1) / .15), 1, .9); sh(KP, 16); }, [[0, 'sparkle', .4]]);
// 67 «Und Opa wurde schwächer.»: el Opa camina despacio con bastón delante de su casa, encorvado
shot(77.52, 'W', null, L => { opaS(L); const c = put(opa, OPX - 4 + L.lt * .8, 0, 10, PI / 2); opaBtn(c, L.T); actuar(c, 0, [[0, { ...walkP(L.T * .4, 0), lean: .3, headX: .2, aRx: .5, aRe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'tired', mouth: 'flat' }); attach(CANE, c.aR.hand, [0, -.3, .1], [0, 0, 0], 1);
  cm([OPX + 6, 4.6, 20], [OPX + 5, 4.2, 18], L.k); camera.lookAt(OPX - 3 + L.lt * .8, 3, 10); camera.fov = 42; sh(V(OPX - 3, 0, 10), 14); }, [[0, 'cane_tap', .5], [.6, 'cane_tap', .5]]);
// 68 «Weil er kaum noch laufen konnte,»: intenta levantarse del banco y vuelve a caer sentado; yo le tiendo la mano
shot(78.92, 'S', null, L => { opaS(L); const up = Math.max(0, Math.sin(clamp(L.lt / 1.1) * PI)) * .9; const c = put(opa, OB.x, sitY(opa, OSEAT) + up, OB.z, .2); opaBtn(c, L.T); actuar(c, 0, [[0, sitPose({ aLx: .9, aLe: 1.2, aRx: .8, aRe: .9, lean: .3 + up * .2, lLx: 1.5 - up, lRx: 1.5 - up, lLk: 1.5 - up, lRk: 1.5 - up })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T); c.blob.visible = false;
  const t = put(gr, OB.x + 3.4, 0, OB.z + 3.2, -.9); myBtn(t, L.T); actuar(t, 0, [[0, { aRx: 1.4, aRe: .3, lean: .15 }]], { T: L.T }); cara(t, L.T, { expr: 'worried', mouth: 'flat' });
  orb(L.k, V(OB.x + 1.6, 3.8, OB.z + 1), null, [16, -.2, .14, 42], [13.5, -.05, .12, 42]); sh(OB, 12); }, [[.1, 'groan', .5], [.9, 'bench_creak', .5]]);
// 69 «kam er nicht mehr zu meinen Spielen.»: la grada; su sitio, vacío; yo lo miro desde el campo
shot(80.27, 'I', null, L => { sportS(L, { dusk: true }); [[-3.4, 0], [3.4, 1], [-6.8, 2], [6.6, 3]].forEach(([z, i]) => crowdGuy(EX[14 + i], SPX - 27.8, z, L, i, { mode: 'sitb', seat: 2.65, ry: PI / 2 }));
  const c = put(gr, SPX - 16, 0, 2, -PI / 2 - .2); myBtn(c, L.T); actuar(c, 0, [[0, { headX: .1, aLx: .1, aRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  cm([SPX - 10, 5.6, 6], [SPX - 11, 5.4, 5], L.k); camera.lookAt(SPX - 27.8, 3.4, 0); camera.fov = 40; sh(V(SPX - 22, 0, 0), 16); }, [[0, 'wind_soft', .5]]);
// 70 «Irgendwann musste er sogar ins»: el hospital del pueblo
shot(81.58, 'Z', null, L => { klinikS(L); crowdAt(L, KAX, 0, 5, 6, 18, 16, { mode: 'walk' }); cm([KAX + 20, 22, 70], [KAX + 12, 14, 52], L.k); camera.lookAt(KAX, 16, -20); camera.fov = 48; sh(V(KAX, 0, -10), 50); }, [[0, 'siren_far', .4]]);
// 71 «Krankenhaus.»: el Opa en la cama; una enfermera le arregla la almohada
shot(82.64, 'S', null, L => { zimmerK(L, { mode: 'day' }); const c = opaBed(L); cara(c, L.T, { expr: 'tired', mouth: 'flat' }); const n = put(sw, KZX - 4.4, 0, -1.6, PI / 2 + .3); actuar(n, 0, [[0, { aRx: 1.9, aLx: 1.7, aRe: .6, aLe: .7, lean: .2 }]], { T: L.T }); cara(n, L.T, { expr: 'happy', mouth: 'smile' });
  cm([KZX + 4, 9, 13], [KZX + 3, 8.4, 11], L.k); camera.lookAt(KZX - 1, 4.4, -4); camera.fov = 46; badge('tag', 'KRANKENHAUS', W / 2, H * .17, clamp((L.lt - .1) / .15), 1, .85); }, [[0, 'monitor_beep', .4], [.3, 'pillow', .4]]);
// 72 «Trotzdem stellte er mir jeden Abend»: anochece; entro en la habitación y él levanta la mano
shot(83.67, 'S', null, L => { zimmerK(L, { mode: 'dusk' }); const c = opaBed(L, { aRx: 1.4 + Math.sin(L.T * 8) * .3, aRz: -.2, aRe: .4 }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  const t = put(gr, KZX + 2 + L.lt * .6, 0, 9 - L.lt * 2.2, PI + .5); myBtn(t, L.T); actuar(t, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(t, L.T, { expr: 'happy', mouth: 'smile' });
  cm([KZX - 9, 9, 10], [KZX - 8, 8.4, 8.6], L.k); camera.lookAt(KZX + 1, 4.6, 0); camera.fov = 48; }, [[0, 'door_open', .5], [.4, 'steps', .4]]);
// 73 «dieselbe Frage:»: noche tras noche: el reloj de la pared avanza y él levanta el dedo
shot(85.25, 'C', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { aRx: 1.2, aRz: -.1, aRe: 1.4 }); cara(c, L.T, { expr: 'warm', mouth: 'smile' }); const h = opaHead();
  cm([h.x + 3.4, h.y + 1.4, h.z + 7], [h.x + 2.8, h.y + 1.2, h.z + 6], L.k); camera.lookAt(h.x, h.y - .4, h.z); camera.fov = 42; }, [[0, 'clock_tick', .5]]);
// 74 «Wie war dein Tag, Großer?»: la pregunta de siempre, desde la almohada
shot(86.29, 'Z', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L); talk(c, L.T, 86.2, 87.49, 'warm'); opaCam(L, 7.4, 6.1, 1.1); }, [[0, 'monitor_beep', .3]]);
// 75 «Und egal, wie müde er war,»: los ojos se le cierran de cansancio, bosteza
shot(87.49, 'W', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L); cara(c, L.T, { expr: 'tired', mouth: L.lt > .5 && L.lt < 1.1 ? 'yawn' : 'flat' }); const h = opaHead(); cm([h.x - 2, h.y + 1.6, h.z + 5], [h.x - 1.6, h.y + 1.3, h.z + 4.2], L.k); camera.lookAt(h.x, h.y - .3, h.z); camera.fov = 40; }, [[.5, 'yawn_old', .5]]);
// 76 «er hörte immer zu.»: yo hablo desde la silla; él me mira y asiente
shot(88.88, 'I', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.4 }); cara(c, L.T, { expr: 'warm', eyes: 'half', mouth: 'smile' }); const t = teenChair(L, { aRx: 1.1 + Math.sin(L.T * 6) * .3, aRe: 1.1 }); cara(t, L.T, { expr: 'happy', mouth: Math.sin(L.T * 11) > 0 ? 'talk' : 'smile' });
  cm([KZX + 2.4, 8.4, 12], [KZX + 2, 7.8, 10.6], L.k); camera.lookAt(KZX + 2, 4.6, -1); camera.fov = 44; }, [[0, 'murmur_soft', .4]]);

// ---------- la última noche ----------
// 77 «Eines Abends kam ich nach einem weiteren»: camino de noche por Lindenthal, capucha puesta, cabizbajo
shot(89.84, 'B', null, L => { town(L, { night: true }); const c = put(gr, -10 + L.lt * 2, 0, 20, PI / 2 - .3); myBtn(c, L.T); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), lean: .15, headX: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  cm([0, 4, 30], [-2, 3.8, 28], L.k); camera.lookAt(-8 + L.lt * 2, 3, 20); camera.fov = 42; sh(V(-8, 0, 20), 16); }, [[0, 'night_amb', .5], [.2, 'steps_slow', .4]]);
// 78 «schrecklichen Tag zu ihm.»: llego a la entrada del hospital de noche
shot(91.36, 'S', null, L => { klinikS(L, { night: true }); const c = put(gr, KAX + 3, 0, 4 - L.lt * 2.6, PI + .1); myBtn(c, L.T); actuar(c, 0, [[0, { ...walkP(L.T * .7, 0), headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  cm([KAX + 10, 5, 18], [KAX + 9, 4.6, 15], L.k); camera.lookAt(KAX + 2, 4, -6); camera.fov = 46; sh(V(KAX, 0, 0), 24); }, [[0, 'night_amb', .4]]);
// 79 «Ich war durch eine wichtige Mathearbeit gefallen.»: en clase, la profesora me deja el examen en la mesa
shot(92.73, 'C', 'punch', L => { klasseS(L); const t = sit(gr, KLX, 2.5, .8, PI, L, { aLx: 1.2, aRx: 1.2, aLe: 1.3, aRe: 1.3, headX: .3 }); myBtn(t, L.T); cara(t, L.T, { expr: L.lt > .5 ? 'shock' : 'worried', mouth: L.lt > .5 ? 'o' : 'flat' });
  const l = put(lehr, KLX - 3, 0, -3, .7); actuar(l, 0, [[0, { aRx: 1.3, aRe: .3, lean: .15 }]], { T: L.T }); cara(l, L.T, { expr: 'sad', mouth: 'frown' }); show(TEST, KLX + .2, 3.95, -1.4, 0); TEST.rotation.x = -PI / 2;
  cm([KLX + 2.6, 7, -7.4], [KLX + 2, 6.6, -6.6], L.k); camera.lookAt(KLX, 3.6, 0); camera.fov = 46; badge('tag', 'MATHEARBEIT', W / 2, H * .16, clamp((L.lt - .1) / .15), 1, .85); }, [[0, 'paper_slap', .6], [.4, 'gasp_small', .4]]);
// 80 «gefallen.»: el examen: una «6» roja enorme
shot(94.13, 'Z', 'punch', L => { klasseS(L); show(TEST, KLX + .2, 3.95, -1.4, 0); TEST.rotation.x = -PI / 2; cm([KLX + .2, 7.2, .4], [KLX + .2, 6.4, -.2], L.k); camera.lookAt(KLX + .2, 3.9, -1.5); camera.fov = 40; badge('red', 'NOTE 6', W / 2, H * .2, clamp((L.lt - .03) / .12), 1, 1.1); }, [[0, 'hit_deep', .6]]);
// 81 «Auf dem Schulhof hatte ich mich mit meinem besten Freund»: en el patio, cara a cara, gritándonos
shot(94.60, 'W', null, L => { schulS(L, { dusk: true }); const a = put(gr, SCX - 2, 0, 0, PI / 2 - .2), b = put(fr, SCX + 2, 0, 0, -PI / 2 + .2); myBtn(a, L.T); [a, b].forEach((c, i) => { actuar(c, 0, [[0, { aLx: .8, aRx: i ? 1.4 : .8, aRe: 1, aLe: 1, lean: .15, headX: -.1, aLz: .3, aRz: .3 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shout', mouth: Math.sin(L.T * 13 + i * 2) > 0 ? 'talk_wide' : 'grimace_wide' }); });
  crowdAt(L, SCX, -6, 5, 8, 16, 17, { mode: 'point', expr: 'shock' }); cm([SCX + .6, 5.2, 12], [SCX + .4, 4.8, 9], L.k); camera.lookAt(SCX, 4, 0); camera.fov = 42; sh(V(SCX, 0, 0), 16); badge('tag', 'BESTER FREUND', W * .68, H * .2, clamp((L.lt - .3) / .15), 1, .7); }, [[0, 'argue', .6], [.6, 'shout_angry', .5]]);
// 82 «gestritten.»: él me empuja y se va; me quedo solo en el patio
shot(96.26, 'C', 'punch', L => { schulS(L, { dusk: true }); const a = put(gr, SCX - 2.4 - easeOut(clamp(L.lt / .3)) * 1.2, 0, 0, PI / 2 - .2); myBtn(a, L.T); actuar(a, 0, [[0, GEST.recoil]], { T: L.T }); cara(a, L.T, { expr: 'angry', mouth: 'grimace' });
  const b = put(fr, SCX + 2 + L.lt * 2, 0, 0, L.lt > .35 ? PI / 2 : -PI / 2); actuar(b, L.lt, [[0, GEST.push], [.35, walkP(L.T, 1)]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'frown' }); onBody(a, 13, .4, .1, 42, L.k, 11); sh(V(SCX, 0, 0), 16); }, [[0, 'push', .7], [.4, 'steps', .4]]);
// 83 «Deshalb war ich den ganzen Nachmittag wütend.»: doy una patada a una lata por la calle, rojo de rabia
shot(97.22, 'R', null, L => { town(L, { dusk: true }); const c = put(gr, 4, 0, 26, -.6); myBtn(c, L.T); actuar(c, L.lt, [[0, GEST.fists], [.5, { lRx: 1.4, lLx: -.2, aLz: .7, aRz: .7, lean: -.15 }, { dur: .15 }], [.8, GEST.fists]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'grimace' });
  const k = clamp((L.lt - .55) / .6); show(MUG, 4 + 1.4 + k * 3, .5 + Math.sin(k * PI) * 3, 26 + .4 + k * 6); MUG.scale.setScalar(.5); MUG.rotation.z = k * 9; TINT = 'rgba(180,30,20,.12)';
  onBody(c, 13, .5, .1, 42, L.k, 11, .3); sh(V(4, 0, 26), 16); }, [[.55, 'can_kick', .7], [.9, 'can_roll', .5]]);
// 84 «Opa lag im Krankenhausbett.»: la habitación de noche: el Opa, el monitor, la lámpara
shot(99.24, 'F', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L); cara(c, L.T, { expr: 'tired', eyes: 'closed', mouth: 'flat' }); cm([KZX + 9, 10, 10], [KZX + 8, 9.4, 8.4], L.k); camera.lookAt(KZX - 1, 4.6, -3); camera.fov = 48; }, [[0, 'monitor_beep', .5], [.6, 'monitor_beep', .5]]);
// 85 «Er sah erschöpft aus.»: su cara, pálida y cansada
shot(100.54, 'S', 'slow', L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L); cara(c, L.T, { expr: 'tired', mouth: 'flat' }); grade.uniforms.sat.value = 1.1; opaCam(L, 8.6, 6.7, 0.8); }, [[0, 'breath_slow', .5]]);
// 86 «Aber sobald er mich sah,»: aparezco a los pies de la cama
shot(101.84, 'W', null, L => { zimmerK(L, { mode: 'night' }); const t = put(gr, KZX + 1, 0, 9, PI); myBtn(t, L.T); actuar(t, 0, [[0, { headX: .2, aLx: .1, aRx: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'sad', mouth: 'flat' }); opaBed(L); cara(opaH, L.T, { expr: 'tired', mouth: 'flat' });
  cm([KZX - 1.6, 10, -4], [KZX - 1.2, 9.6, -3], L.k); camera.lookAt(KZX + 1, 5.4, 9); camera.fov = 42; }, [[0, 'steps_soft', .4]]);
// 87 «lächelte er.»: se le ilumina la cara
shot(102.54, 'F', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L); cara(c, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' }); opaCam(L, 7.7, 6.4, 0.8); }, [[0, 'chime_soft', .3]]);
// 88 «Wie war dein Tag, Großer?»: con voz débil
shot(103.73, 'Z', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { aRx: .8, aRe: .5 }); talk(c, L.T, 103.7, 105.12, 'warm'); cm([KZX + 4.4, 7, 4], [KZX + 3.6, 6.6, 3], L.k); camera.lookAt(KZX, 4.8, -4); camera.fov = 42; }, [[0, 'monitor_beep', .3]]);
// 89 «Ich setzte mich neben ihn.»: me dejo caer en la silla junto a la cama
shot(105.12, 'S', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L); cara(opaH, L.T, { expr: 'warm', mouth: 'smile' }); const d = (1 - easeOut(clamp(L.lt / .5))) * 1.6; const t = teenChair(L, { headX: .3 }); t.root.position.y += d; cara(t, L.T, { expr: 'sad', mouth: 'frown' });
  cm([KZX + 9, 7.6, 9], [KZX + 8.2, 7.2, 8], L.k); camera.lookAt(KZX + 3, 4.4, -1); camera.fov = 46; }, [[.3, 'chair_creak', .6]]);
// 90 «Nicht der beste, Opa.»: lo digo mirando al suelo
shot(106.19, 'C', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L); const t = teenChair(L, { headX: .25 }); talk(t, L.T, 106.1, 107.25, 'sad'); onFace(t, 4.2, .1, .8, 40, L.k, 3.6); }, [[0, 'sigh', .5]]);
// 91 «Er sah mich an.»: gira la cabeza hacia mí
shot(107.25, 'I', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6 }); cara(c, L.T, { expr: 'worried', eyes: 'normal', mouth: 'flat' }); opaCam(L, 6.4, 5.4, 2.2); }, [[0, 'sheet_rustle', .4]]);
// 92 «Dann drückte er sanft meine Hand.»: primer plano de las manos sobre la manta
shot(107.94, 'W', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { aRx: 1.1, aRz: -.5, aRe: .3 }); const t = teenChair(L, handPose); cara(t, L.T, { expr: 'sad', mouth: 'flat' });
  handCam(t, L); }, [[.2, 'hand_squeeze', .5]]);
// 93 «Keine Sorge.»: susurra
shot(109.35, 'Z', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6 }); talk(c, L.T, 109.3, 110.19, 'warm'); opaCam(L, 6.2, 5.4, 1.8); }, [[0, 'breath_slow', .4]]);
// 94 «Du wirst noch bessere Tage haben.»: los dos, desde la ventana, con la noche detrás
shot(110.19, 'S', null, L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L, { headY: -.6, aRx: 1.1, aRz: -.5, aRe: .3 }); talk(c, L.T, 110.1, 111.81, 'warm'); const t = teenChair(L, handPose); cara(t, L.T, { expr: 'sad', mouth: 'flat' });
  twoShot(L); }, [[0, 'monitor_beep', .3]]);
// 95 «Ich nickte.»: asiento con los ojos húmedos
shot(111.81, 'F', null, L => { zimmerK(L, { mode: 'night' }); opaBed(L); const t = teenChair(L, { ...handPose, headX: .1 + Math.max(0, Math.sin(L.lt * 9)) * .25 }); cara(t, L.T, { expr: 'sad', eyes: 'worried', mouth: 'flat' }); onFace(t, 4.4, .1, .6, 40, L.k, 3.8); }, [[0, 'sniff', .4]]);
// 96 «Und für einen Moment war alles still.» (zoom lento): plano general muy quieto: solo el monitor
shot(112.45, 'B', 'slow', L => { zimmerK(L, { mode: 'night' }); const c = opaBed(L); cara(c, L.T, { expr: 'warm', eyes: 'closed', mouth: 'smile' }); const t = teenChair(L, handPose); cara(t, L.T, { expr: 'sad', eyes: 'down', mouth: 'flat' });
  cm([KZX + 1, 13, 11], [KZX + 1, 11, 8], L.k); camera.lookAt(KZX, 4, -2); camera.fov = 48; }, [[0, 'room_tone', .5]]);
// 97 «Bis der Herzmonitor neben seinem Bett piepte.»: el monitor, latido a latido
shot(114.11, 'C', null, L => { zimmerK(L, { mode: 'night', bpm: 50 }); opaBed(L); const m = wpos(KZ.scr); cm([m.x + 3.4, m.y + .4, m.z + 4.4], [m.x + 2.8, m.y + .2, m.z + 3.6], L.k); camera.lookAt(m.x, m.y, m.z); camera.fov = 40; }, [[.3, 'monitor_beep', .7], [1.2, 'monitor_beep', .7]]);
// 98 «Ein langer Ton.» (zoom lento): la línea se queda plana: 0
shot(116.20, 'Z', 'slow', L => { zimmerK(L, { mode: 'night', flat: 116.2, bpm: 50 }); opaBed(L); const m = wpos(KZ.scr); cm([m.x + 2.6, m.y + .2, m.z + 3.4], [m.x + 1.8, m.y, m.z + 2.4], L.k); camera.lookAt(m.x, m.y, m.z); camera.fov = 40; }, [[0, 'flatline', .8]]);
// 99 «Opa war weg.»: sus ojos cerrados; mi cara rota
shot(117.06, 'B', null, L => { zimmerK(L, { mode: 'night', flat: 116.2 }); const c = opaBed(L); cara(c, L.T, { eyes: 'closed', mouth: 'flat' }); const t = teenChair(L, { ...handPose, lean: .35, headX: .2 }); cara(t, L.T, { expr: 'cry', mouth: 'grimace' }); grade.uniforms.sat.value = .7;
  opaCam(L, 7.6, 6.4, 1.4); }, [[0, 'flatline', .5], [.2, 'sad_hit', .5]]);

// ---------- la decisión ----------
// 100 «Ich saß da und starrte ihn an.»: lágrimas; no me muevo
shot(117.92, 'S', null, L => { zimmerK(L, { mode: 'night', flat: 116.2 }); opaBed(L); cara(opaH, L.T, { eyes: 'closed', mouth: 'flat' }); const t = teenChair(L, { ...handPose, headX: .1 }); cara(t, L.T, { expr: 'cry', mouth: 'frown' }); tears(t, L.T); grade.uniforms.sat.value = .8; onFace(t, 4, .2, .6, 40, L.k, 3.4); }, [[0, 'sob', .5], [.6, 'flatline', .25]]);
// 101 «Dann schaute ich hinunter.»: bajo la cabeza
shot(119.56, 'W', null, L => { zimmerK(L, { mode: 'night', flat: 116.2 }); opaBed(L); const t = teenChair(L, { headX: .7, aLx: .6, aRx: .6, aLe: .9, aRe: .9 }); cara(t, L.T, { expr: 'cry', eyes: 'down', mouth: 'frown' }); grade.uniforms.sat.value = .8; onFace(t, 5.4, 1.6, .5, 42, L.k, 4.6); }, [[0, 'breath_shaky', .5]]);
// 102 «Auf den Knopf auf meinem Bauch.» (zoom lento): mi botón, intacto, brillando
shot(120.78, 'Z', 'slow', L => { zimmerK(L, { mode: 'night', flat: 116.2 }); const t = teenChair(L, { headX: .7, aLx: .4, aRx: .4, aLz: .3, aRz: .3, aLe: .6, aRe: .6 }); t.knopfOn(true, 2.4 + Math.sin(L.T * 6)); myKnopfCam(t, L); }, [[0, 'hum_glow', .5]]);
// 103 «Mein ganzes Leben hatte»: recuerdo en sepia: de pequeño, en la plaza, tapándome el botón
shot(122.20, 'R', null, L => { town(L); grade.uniforms.sepia.value = .85; const c = put(kl, KP.x, 0, KP.z, .2); actuar(c, 0, [[0, { aRx: .9, aRz: -.3, aRe: 1.6, aLx: .9, aLz: -.3, aLe: 1.6, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); crowdAt(L, KP.x, KP.z - 6, 6, 6, 18, 18, { mode: 'knopf' });
  onBody(c, 13, .2, .1, 42, L.k, 11); sh(KP, 14); }, [[0, 'memory_whoosh', .5]]);
// 104 «ich ihn aufgehoben.»: recuerdo: con 16, en el patio, igual: la mano sobre el botón
shot(123.26, 'W', null, L => { schulS(L); grade.uniforms.sepia.value = .85; const c = put(gr, SCX, 0, 2, .2); actuar(c, 0, [[0, { aRx: .9, aRz: -.3, aRe: 1.6, headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral', mouth: 'smile' }); crowdAt(L, SCX, -6, 5, 6, 16, 19, { mode: 'walk' });
  onBody(c, 14, -.2, .1, 42, L.k, 12); sh(V(SCX, 0, 2), 16); }, [[0, 'memory_whoosh', .4]]);
// 105 «Für den perfekten Moment.»: mi mano duda sobre el botón
shot(124.22, 'I', null, L => { zimmerK(L, { mode: 'night', flat: 116.2 }); const t = teenChair(L, { aRx: .75 + Math.sin(L.T * 3) * .08, aRz: -.4, aRe: 1.5, headX: .7 }); cara(t, L.T, { expr: 'cry', eyes: 'down', mouth: 'flat' }); t.knopfOn(true, 2.6 + Math.sin(L.T * 6)); myKnopfCam(t, L, { aRx: .75 + Math.sin(L.T * 3) * .08, aRz: -.4, aRe: 1.5, headX: .6 }); }, [[0, 'heartbeat_soft', .6]]);
// 106 «Aber plötzlich wusste ich genau, was ich wollte.» (zoom lento): levanto la cara: decidido, con lágrimas
shot(125.32, 'Z', 'slow', L => { zimmerK(L, { mode: 'night', flat: 116.2 }); opaBed(L); const t = teenChair(L, { headX: -.05 }); cara(t, L.T, { expr: 'determined', mouth: 'flat' }); tears(t, L.T); onFace(t, 4.6, .1, .2, 40, L.k, 3.2); }, [[0, 'heartbeat_soft', .6], [1.2, 'heartbeat_soft', .6]]);
// 107 «Ich drückte ihn.»: ¡clic! la luz turquesa lo llena todo
shot(127.86, 'C', 'punch', L => { zimmerK(L, { mode: 'night', flat: 116.2 }); const t = teenChair(L, { aRx: .95, aRz: -.42, aRe: 1.75, headX: .4, lean: .1 }); cara(t, L.T, { expr: 'determined', eyes: 'closed', mouth: 'grimace' }); const pr = L.lt > .2; t.knopfOn(!pr, 4);
  if (pr) { ringwave(kp(t), clamp((L.lt - .2) / .6), camera.position, 12); sparks(kp(t), L.t0 + .2, L.T, 36, 1.2); grade.uniforms.flash.value = Math.max(0, .8 - (L.lt - .2) * 1.6); } myKnopfCam(t, L, { aRx: .95, aRz: -.42, aRe: 1.75, headX: .4 }); }, [[.2, 'button_click', .9], [.25, 'whoosh_magic', .7]]);
// 108 «Und alles wurde schwarz.»: la habitación se apaga hasta el negro
shot(128.78, 'B', null, L => { zimmerK(L, { mode: 'night', flat: 116.2 }); opaBed(L); const t = teenChair(L, { headX: .2 }); cara(t, L.T, { eyes: 'closed', mouth: 'flat' }); DARK = clamp(L.lt / 1.0); cm([KZX + 8, 9, 8], [KZX + 9, 10, 10], L.k); camera.lookAt(KZX + 2, 4.4, -1); camera.fov = 48; }, [[0, 'power_down', .7]]);
