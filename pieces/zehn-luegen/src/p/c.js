// ===== Planos 59-89 (97,9 – 148 s): llama a nuestra puerta, «Mein Sohn», el 10 sobre su cabeza, la cuenta atrás =====
// en nuestra puerta: mamá en el umbral, yo delante de ella, el Coleccionista abajo (apartado a un lado para que se nos vea)
function ourDoor(o = {}) { street(); HOME.door.rotation.y = 1.4; const m = inDoor(mama, HOME, o.ms ?? .5, 0); const c = putH(ich, HOME, HOME.dx + (o.cs ?? -.7), HOME.F + (o.cz ?? 2.1), 0, o.cr ?? 0);
  const s = atDoor(sam, HOME, o.sd ?? 4.6, o.ss ?? -2.4); kofHand(s); warmAt(LH(HOME, HOME.dx, 5, HOME.F + 2), 28); sh(LH(HOME, HOME.dx, 0, HOME.F + 2), 18); return { m, c, s }; }
const HIGH = (Hh) => camH(Hh, [Hh.dx + 8, 10.5, Hh.F + 17], [Hh.dx, 4.4, Hh.F + 2.2], 32);
const samClose = (s, L, d0 = 5.0, d1 = 4.5, side = -.6, fov = 46) => onFace(s, d0, -1.1, side, fov, L.k, d1);

// 59 · «Dann klingelte es bei uns.»: el Coleccionista en nuestro porche; las ventanas encendidas
shot(97.89, 'S', null, L => { street(); const s = putH(sam, HOME, HOME.dx + .05, HOME.F + 2.4, 0, PI); kofHand(s); grin(s, L.T);
  actuar(s, L.lt, [[0, { aLx: .3 }], [.2, { aLx: 1.25, aLz: .05, aLe: .3, lean: .16 }, { dur: .2 }]], { T: L.T }); HOME.btn.material.emissiveIntensity = .8 + clamp((L.lt - .35) * 4) * 3;
  camH(HOME, [HOME.dx + 12.5, 5.6, HOME.F + 2.6], [HOME.dx + .6, 4.6, HOME.F + 2.2], 42); warmAt(LH(HOME, HOME.dx, 5, HOME.F + 2), 40); sh(LH(HOME, HOME.dx, 0, HOME.F), 18); }, [[.38, 'door_bell', .9], [1.0, 'heartbeat', .5]]);
// 60 · «Mama hielt meine Hand.»: las dos manos, en el salón
shot(99.36, 'C', null, L => { use('WZ'); inside(.6, 30); const m = put(mama, WX + 4, 0, 6, PI), c = put(ich, WX + 6.3, 0, 6.2, PI);
  const k = clamp(L.lt * 2); applyPose(m, { aRx: .45 * k, aRz: .32 * k, aRe: .15, headX: .25, headY: -.3 * k }); applyPose(c, { aLx: .9 * k, aLz: .25 * k, aLe: .1, headX: -.3, headY: .3 * k }); cara(m, L.T, { expr: 'worried' }); cara(c, L.T, { expr: 'scared' });
  cm([WX + 5.1, 3.6, -5, WX + 5.1, 3.0, 6, 46], [WX + 5.1, 3.4, -4, WX + 5.1, 2.8, 6, 44], L.k); sh(V(WX + 5, 0, 6), 15); }, [[.1, 'cloth', .55], [.5, 'heartbeat', .55]]);
// 61 · «Ihre Finger waren eiskalt.»: mamá tiembla; frío azul
shot(100.51, 'S', null, L => { use('WZ'); inside(.55, 26); const m = put(mama, WX + 4, 0, 6, PI); actuar(m, L.lt, [[0, { ...GEST.hug_self }]], { T: L.T, extra: shiver(L.T, 1.4) }); cara(m, L.T, { expr: 'scared', skin: pale(m, .45) });
  TINT = 'rgba(120,170,255,.12)'; onFace(m, 5.6, -.2, 1.4, 42, L.k, 4.8); sh(V(WX + 4, 0, 6), 15); }, [[.05, 'shiver', .6], [.6, 'wind', .45]]);
// 62 · «„Was ist Ihnen hier am wertvollsten?“»: él, desde nuestro umbral, en contrapicado
shot(102.09, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false;
  actuar(s, L.lt, [[0, { lean: .06, headX: .25, aLx: .2 }]], { T: L.T }); talk(s, L.T, 102, 103.6, 'grin'); samClose(s, L, 5.2, 4.6, .8, 48); }, [[.1, 'whisper', .5], [1.2, 'creepy_ting', .45]]);
// 63 · «Mama kämpfte,»: aprieta los labios, se tapa la boca; yo a su lado
shot(103.64, 'W', null, L => { const { m, c } = ourDoor(); s_hide();
  actuar(m, L.lt, [[0, { ...GEST.hands_face, aLx: 1.9, aRx: 1.9, aLe: 2.4, aRe: 2.4 }]], { T: L.T, extra: shiver(L.T, 1.2) }); cara(m, L.T, { expr: 'scared', mouth: 'wavy', skin: pale(m, .6) }); actuar(c, L.lt, [[0, { headY: -.5, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' });
  camH(HOME, [HOME.dx - 1.4, 4.6, HOME.F + 10.4], [HOME.dx, 4.2, HOME.F + 1.2], 46); }, [[.05, 'strain', .55], [.7, 'heartbeat', .55]]);
function s_hide() { sam.root.visible = false; KOF.g.visible = false; }
// 64 · «aber die Wahrheit rutschte einfach raus:» (zoom lento): la cara de mamá luchando
shot(105.0, 'C', 'slow', L => { const { m } = ourDoor(); s_hide(); ich.root.visible = false; actuar(m, L.lt, [[0, { aLx: .7, aRx: .7, aLe: 1.2, aRe: 1.2, headX: -.05 }]], { T: L.T, extra: shiver(L.T, 1.5) });
  cara(m, L.T, { expr: 'scared', mouth: L.lt % .5 < .25 ? 'wavy' : 'grimace', skin: pale(m, .6) }); onFace(m, 6.4, -.2, .4, 42, L.k, 4.4); }, []);
// 65 · «„Mein Sohn.“»: lo dice; me abraza por detrás
shot(106.79, 'S', null, L => { const { m, c } = ourDoor({ cz: 1.7, cs: .2, cr: 0 }); s_hide(); actuar(m, L.lt, [[0, { aLx: .55, aRx: .55, aLz: -.25, aRz: -.25, aLe: .2, aRe: .2, lean: .1, headX: .2 }]], { T: L.T });
  cara(m, L.T, { expr: 'cry', mouth: L.lt < .5 ? 'talk' : 'frown', skin: pale(m, .5) }); cara(c, L.T, { expr: 'shock' }); badge('big', 'MEIN SOHN', W / 2, H * .18, (L.lt - .05) * 3, 1, .9);
  camH(HOME, [HOME.dx + 1.6, 4.6, HOME.F + 9.6], [HOME.dx + .3, 4.2, HOME.F + 1.4], 44); }, [[.05, 'gasp_f', .5], [.3, 'sad_tone', .5]]);
// 66 · «Der Sammler klappte seinen Koffer auf.»: el maletín se abre hacia nosotros; luz violeta en nuestras caras
shot(107.98, 'Z', null, L => { const { m, c, s } = ourDoor({ cz: 2.0, cs: .2 }); const hp_ = LH(HOME, HOME.dx + .1, 0, HOME.F + 4.6); KOF.g.parent.remove(KOF.g); scene.add(KOF.g);
  const k = kofAt(hp_.x, 1.0, hp_.z, HOME.ry, 1.0); k.open(easeOut(clamp((L.lt - .15) / .5))); sam.root.visible = false;
  cara(c, L.T, { expr: 'shock' }); applyPose(c, GEST.recoil); cara(m, L.T, { expr: 'scared', skin: pale(m, .5) }); applyPose(m, { aLx: .5, aRx: .5, aLz: -.2, aRz: -.2, aLe: .3, aRe: .3, lean: .1 });
  camH(HOME, [HOME.dx + .4, 6.4, HOME.F + 9.6], [HOME.dx + .1, 3.0, HOME.F + 2], 44); }, [[.12, 'lid_click', .7], [.3, 'creepy_ting', .6], [.4, 'hum_low', .5]]);
// 67 · «Und genau in dem Moment sah ich es:» (zoom lento): mi cara, iluminada de violeta, los ojos se abren
shot(109.36, 'C', 'slow', L => { const { c } = ourDoor(); s_hide(); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > 1.3 ? 'gasp' : 'scared', eyes: L.lt > 1.3 ? 'wide' : 'up' });
  TINT = 'rgba(150,60,220,.12)'; onFace(c, 5.2, -.6, -.6, 42, L.k, 3.6); }, []);
// 68 · «Über seinem Kopf stand eine Zehn.»: contrapicado: SU contador, un 10 que nadie había visto
shot(111.35, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; actuar(s, L.lt, [[0, { headX: .15 }]], { T: L.T }); grin(s, L.T);
  cnt(s, 10, (L.lt - .4) * 2, { sc: 1.0, dy: 1.6 }); samClose(s, L, 6.0, 5.4, .6, 50); }, [[.4, 'ding_reveal', .7], [.5, 'sparkle', .5]]);
// 69 · «Kein Mensch hatte ihm je eine Frage gestellt.»: recuerdo en sepia: la gente se aparta de él, nadie le habla (NIE GEFRAGT)
shot(113.24, 'S', null, L => { street(); grade.uniforms.sepia.value = .85; const r = caminar(sam, L.lt, { x: 0, z: -40, ry: 0, speed: 1.6, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam); cnt(sam, 10, 1, { sc: .6 });
  [[LE[0], -4.6, -33, PI / 2 + .6], [LE[2], 4.4, -34, -PI / 2 - .6], [LE[5], -5, -38.5, PI / 2 + .3], [LE[6], 5.2, -39, -PI / 2]].forEach(([c, x, z, ry], i) => { put(c, x - Math.sign(x) * (1 - L.k) * .8, 0, z, ry); actuar(c, L.lt, [[0, GEST.recoil]], { T: L.T + i }); cara(c, L.T, { expr: 'scared', mouth: 'flat' }); });
  badge('tag', 'NIE GEFRAGT', W / 2, H * .12, L.lt * 3); cm([0, 5.2, r.z + 16, 0, 4.6, r.z, 48], [0, 5.0, r.z + 14, 0, 4.6, r.z, 46], L.k); sh(V(0, 0, r.z), 25); }, [[.05, 'film_roll', .4], [.5, 'murmur', .35], [1.5, 'steps_heavy', .4]]);
// 70 · «Also hatte er noch alle seine Lügen.»: su sonrisa enorme, el 10 brillando
shot(115.61, 'C', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; actuar(s, L.lt, [[0, { headX: .2, headZ: .1 }]], { T: L.T }); grin(s, L.T, { eyes: 'squint' });
  cnt(s, 10, 1, { sc: .9, dy: 1.6, pop: (L.lt % .8) - .1 }); samClose(s, L, 4.8, 4.4, -.8, 48); }, [[.1, 'evil_laugh', .4], [.8, 'ding_soft', .4]]);
// 71 · «Und ich bin nun mal das Kind, das immer nachfragt.»: mi sonrisa de lado, decidida
shot(117.37, 'W', null, L => { const { c } = ourDoor(); s_hide(); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.25 }], [1.2, { ...GEST.fists, headX: -.25 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  TINT = 'rgba(150,60,220,.08)'; onFace(c, 5.4, .2, 1.4, 42, L.k, 4.6); }, [[.2, 'whoosh_up', .3], [1.2, 'fist', .5]]);
// 72 · «Also trat ich vor Mama und fragte:»: doy un paso al frente, entre ella y él (de lado)
shot(119.94, 'S', null, L => { const { m, c, s } = ourDoor({ cz: 1.6, cs: .4 }); const z = HOME.F + 1.6 + easeOut(clamp(L.lt / .6)) * .9; putH(c, HOME, HOME.dx + .4, z, 0, 0);
  actuar(c, L.lt, [[0, walkPose_(L.T)], [.6, { aLz: .4, aRz: .4, headX: -.35 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); grin(s, L.T); applyPose(m, GEST.recoil); cara(m, L.T, { expr: 'scared' });
  camH(HOME, [HOME.dx + 3.4, 3.8, HOME.F + 11], [HOME.dx + .4, 3.6, HOME.F + 2], 44); }, [[.05, 'steps', .6], [.5, 'steps', .5]]);
function walkPose_(T) { return { lLx: Math.sin(T * 9) * .5, lRx: -Math.sin(T * 9) * .5, aLx: -Math.sin(T * 9) * .4, aRx: Math.sin(T * 9) * .4 }; }
// 73 · «„Kann man Sie besiegen?“»: lo pregunto mirándolo desde abajo
shot(121.77, 'C', null, L => { const { c } = ourDoor({ cz: 2.6, cs: .4 }); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.45, aLz: .3, aRz: .3 }]], { T: L.T }); talk(c, L.T, 121.7, 122.9, 'determined');
  camH(HOME, [HOME.dx + 2.6, 2.4, HOME.F + 7.4], [HOME.dx + .4, 3.4, HOME.F + 2.6], 42); }, [[.1, 'breath', .5]]);
// 74 · «Sein Lächeln blieb. „Nein.“»: sonríe; su 10 baja a 9
shot(122.86, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; actuar(s, L.lt, [[0, { headX: .2 }]], { T: L.T }); talk(s, L.T, 123.9, 124.3, 'grin');
  cntDrop(s, L.lt, 10, [1.08], { sc: .9, dy: 1.6 }); samClose(s, L, 5.0, 4.6, .6, 48); }, [[.1, 'creepy_ting', .4], [1.08, 'tick_down', .7]]);
// 75 · «„Kann man Sie besiegen?“ – „Nein.“»: plano alto de la puerta: 9 -> 8
shot(124.33, 'S', null, L => { const { m, c, s } = ourDoor({ cz: 2.7, cs: .4 }); actuar(c, L.lt, [[0, { headX: -.4 }]], { T: L.T }); talk(c, L.T, 124.3, 125.1, 'determined'); talk(s, L.T, 125.3, 125.7, 'grin'); applyPose(m, GEST.hug_self); cara(m, L.T, { expr: 'scared' });
  cntDrop(s, L.lt, 9, [1.0], { sc: .7 }); HIGH(HOME); }, [[1.0, 'tick_down', .7]]);
// 76 · «Er versuchte, an mir vorbei nach Mama zu greifen.»: estira el brazo por encima de mí (de lado)
shot(125.70, 'W', null, L => { const { m, c, s } = ourDoor({ cz: 2.7, cs: .4, sd: 5.4, ss: 0 }); const k = easeInOut(clamp(L.lt / 1.2));
  actuar(s, L.lt, [[0, {}], [.2, { lean: .5, aLx: 1.7, aLe: .1, aLz: -.1, headX: .2 }, { dur: .8 }]], { T: L.T }); grin(s, L.T); cnt(s, 8, 1, { sc: .6 });
  applyPose(c, { aLz: 1.1, aRz: 1.1, aLe: .1, aRe: .1, headX: -.4, lean: -.1 }); cara(c, L.T, { expr: 'determined' }); applyPose(m, GEST.cower); cara(m, L.T, { expr: 'terror' });
  camH(HOME, [HOME.dx + 13, 5.6, HOME.F + 3.6], [HOME.dx, 5.0, HOME.F + 3.2], 46); }, [[.2, 'cloth', .6], [.8, 'gasp_f', .5]]);
// 77 · «Aber ich war dran.»: brazos abiertos, bloqueando, decidido
shot(127.94, 'C', null, L => { const { c } = ourDoor({ cz: 2.7, cs: .4 }); mama.root.visible = false; applyPose(c, { aLz: 1.35, aRz: 1.35, aLe: .1, aRe: .1, headX: -.3, crouch: .05 }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  camH(HOME, [HOME.dx + 2.8, 2.8, HOME.F + 8.6], [HOME.dx + .4, 3.4, HOME.F + 2.7], 42); }, [[.05, 'stamp', .5]]);
// 78 · «„Kann man Sie besiegen?“ – „Nein.“»: 8 -> 7
shot(128.91, 'S', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; actuar(s, L.lt, [[0, { headX: .2, headZ: -.08 }]], { T: L.T }); talk(s, L.T, 129.7, 130.4, 'grin', { eyes: 'squint' });
  cntDrop(s, L.lt, 8, [.86], { sc: .9, dy: 1.6 }); samClose(s, L, 4.6, 4.3, -1.0, 46); }, [[.86, 'tick_down', .7]]);
// 79 · «Noch fünf.»: el contador baja rápido 7, 6, 5; la sonrisa tiembla
shot(130.41, 'C', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .2, headZ: Math.sin(L.T * 30) * .02 }); cara(s, L.T, { expr: 'neutral', mouth: L.lt % .3 < .15 ? 'grin' : 'smirk' });
  cntDrop(s, L.lt, 7, [.15, .4], { sc: 1.15, dy: 1.4 }); onFace(s, 4.0, -.6, 0, 50, L.k, 3.8); }, [[.15, 'tick_down', .6], [.4, 'tick_down', .6], [.6, 'glitch', .4]]);
// 80 · «Ich hörte nicht auf.»: pregunto una y otra vez: ? ? ?
shot(131.31, 'S', null, L => { const { c } = ourDoor({ cz: 2.7, cs: .4 }); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.4, lean: .1, aRx: .6, aRe: .8 }]], { T: L.T, extra: { aRx: .6 + Math.sin(L.T * 12) * .2 } }); cara(c, L.T, { expr: 'determined', mouth: Math.sin(L.T * 18) > 0 ? 'talk_wide' : 'talk' });
  [[.25, .2, 0], [.75, .22, .35], [.5, .14, .7]].forEach(([x, y, t], i) => badge('q', '?', W * x, H * y, (L.lt - t) * 3, 1, .75)); onFace(c, 5.0, .2, 1.4, 42, L.k, 4.4); }, [[.05, 'pop', .4], [.35, 'pop', .4], [.7, 'pop', .4], [1.0, 'tick', .4]]);
// 81 · «Drei. Sein Lächeln verschwand.»: 3; la sonrisa se borra
shot(132.62, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .15 }); cara(s, L.T, { expr: 'neutral', mouth: L.lt < .7 ? 'smirk' : 'flat', eyes: 'squint' });
  cntDrop(s, L.lt, 5, [.0, .05], { sc: 1.0, dy: 1.6 }); samClose(s, L, 4.8, 4.2, .9, 46); }, [[.02, 'tick_down', .7], [.8, 'creepy_ting', .4]]);
// 82 · «Zwei. Schweiß lief ihm übers Gesicht,»: 2; suda
shot(134.54, 'S', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .15, headZ: Math.sin(L.T * 24) * .02 }); cara(s, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(s, L.T, 3);
  cntDrop(s, L.lt, 3, [.02], { sc: 1.0, dy: 1.6 }); samClose(s, L, 4.4, 4.0, -.9, 46); }, [[.02, 'tick_down', .7], [.6, 'drip', .5], [1.4, 'drip', .4]]);
// 83 · «obwohl es schneite.»: de lado, la nevada cae sobre él y aun así suda
shot(136.69, 'W', null, L => { const { s } = ourDoor({ sd: 5.4, ss: 0, cz: 2.7, cs: .4 }); SNOWY = 1.8; mama.root.visible = false; applyPose(s, { headX: .1, aLz: .1, aRz: .1 }); cara(s, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(s, L.T, 3); cnt(s, 2, 1, { sc: .7 });
  cara(ich, L.T, { expr: 'determined' }); applyPose(ich, { headX: -.4 }); camH(HOME, [HOME.dx + 4, 7, HOME.F + 15], [HOME.dx - 1, 5.0, HOME.F + 4.2], 40); }, [[.05, 'wind', .6]]);
// 84 · «Eins.»: 1, enorme
shot(137.64, 'C', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .1, headZ: Math.sin(L.T * 30) * .03 }); cara(s, L.T, { expr: 'scared', mouth: 'grimace' }); sweat(s, L.T, 3);
  cntDrop(s, L.lt, 2, [.02], { sc: 1.3, dy: 1.3 }); onFace(s, 4.2, -.4, .2, 50, L.k, 3.9); }, [[.02, 'tick_down', .8], [.3, 'heartbeat', .6]]);
// 85 · «„Nein“, hauchte er. Seine letzte Lüge.» (zoom lento): lo susurra; 1 -> 0
shot(138.36, 'S', 'slow', L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .25, lean: .05 }); cara(s, L.T, { expr: 'sad', eyes: 'half', mouth: L.lt < .5 ? 'o' : 'frown' }); sweat(s, L.T, 3);
  cntDrop(s, L.lt, 1, [.25], { sc: 1.1, dy: 1.4 }); samClose(s, L, 5.2, 4.0, -.6, 46); }, [[.25, 'tick_down', .8], [.3, 'whisper', .5]]);
// 86 · «„Kann man Sie besiegen?“»: una vez más
shot(141.13, 'Z', null, L => { const { c } = ourDoor({ cz: 2.7, cs: .4 }); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.45, lean: .08 }]], { T: L.T }); talk(c, L.T, 141.1, 142.2, 'determined');
  onFace(c, 4.8, -.2, 1.0, 42, L.k, 4.3); }, [[.1, 'breath', .5]]);
// 87 · «Er presste die Lippen zusammen, aber es kam trotzdem raus:» (zoom lento): aprieta, tiembla, se le hinchan las venas
shot(142.16, 'C', 'slow', L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .2, headZ: Math.sin(L.T * 34) * .05, headY: Math.sin(L.T * 22) * .04 }); cara(s, L.T, { expr: 'angry', mouth: L.lt % .3 < .15 ? 'wavy' : 'grimace' }); sweat(s, L.T, 3);
  cnt(s, 0, 1, { sc: 1.0, dy: 1.6 }); samClose(s, L, 5.0, 3.8, .7, 46); }, [[.2, 'strain', .6]]);
// 88 · «„…Ja.“»: se le escapa: JA
shot(145.04, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .3, lean: -.05 }); cara(s, L.T, { expr: 'shock', mouth: L.lt < .35 ? 'o' : 'frown' }); cnt(s, 0, 1, { sc: .9, dy: 1.6 });
  badge('green', 'JA', W / 2, H * .2, L.lt * 4, 1, 1.1); samClose(s, L, 4.6, 4.3, 0, 48); }, [[.02, 'magic_hit', .6]]);
// 89 · «„Wie?“ – „Wenn man… meinen Koffer umdreht.“»: mira de reojo su maletín
shot(145.80, 'W', null, L => { const { m, c, s } = ourDoor({ cz: 2.7, cs: .4, sd: 4.8, ss: -2.0 }); actuar(c, L.lt, [[0, { headX: -.4 }]], { T: L.T }); talk(c, L.T, 145.5, 146, 'determined'); bubble(c, 'Wie?', (.4 - L.lt) * 5 + 1, 1.6);
  actuar(s, L.lt, [[0, {}], [.3, { headY: .7, headX: .45, aRx: .5 }, { dur: .4 }]], { T: L.T }); talk(s, L.T, 146, 148, 'sad'); applyPose(m, GEST.hug_self); cara(m, L.T, { expr: 'worried' });
  badge3('q', '?', wpos(KOF.g).add(V(0, 2, 0)), (L.lt - .8) * 3, .6); HIGH(HOME); }, [[.3, 'hmm', .4], [1.0, 'briefcase', .5]]);
