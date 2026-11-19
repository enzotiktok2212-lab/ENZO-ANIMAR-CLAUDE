// ---------- b: yo nací con aura, la familia me hace uncool, la leyenda de Opa (54,30 – 101,20 s) ----------
const SIT = { lLx: 1.45, lRx: 1.45, lLk: -1.45, lRk: -1.45, aLx: .5, aRx: .5, aLe: .8, aRe: .8 };
const ME = V(-6, 0, 4);   // mi sitio en la plaza
const table = (L) => { kitchen(L); };
// la familia alrededor de la mesa de la cocina (yo en el centro, detrás de la mesa, mirando a +z)
const KT = V(KX, 0, 2);
function familyAt(L, o = {}) { kitchen(L); const me = put(ich, KT.x, 0, KT.z - 5.6, 0); actuar(me, 0, [[0, o.mePose || GEST.idle]], { T: L.T }); flap(me, L.T, .5);
  if (o.mama !== false) { const c = put(mama, KT.x - 4.4, 0, KT.z - 3.2, .6); actuar(c, 0, [[0, o.mamaPose || GEST.cross]], { T: L.T }); cara(c, L.T, { expr: o.fExpr || 'sus', mouth: 'flat' }); }
  if (o.oma !== false) { const c = put(oma, KT.x + 4.4, 0, KT.z - 3.2, -.6); actuar(c, 0, [[0, o.omaPose || GEST.cross]], { T: L.T }); cara(c, L.T + 1, { expr: o.fExpr || 'sus', mouth: 'flat' }); }
  if (o.papa !== false) { const c = put(papa, KT.x + 2.4, 0, KT.z - 8.6, -.25); actuar(c, 0, [[0, o.papaPose || GEST.cross]], { T: L.T }); cara(c, L.T + 2, { expr: o.fExpr || 'sus', mouth: 'flat' }); }
  return me; }

// 48 «Aber ich hatte ein Problem.»: yo en la plaza entre la gente «uncool», mi placa en 97
shot(54.30, 'Z', null, L => { town(L); const c = ichCool(ME.x, ME.z, 0, L.T, { expr: 'worried', mouth: 'flat', eyes: 'worried' }); mtag(c, 'ICH', 97, 1); crowdAt(L, ME.x, ME.z, 10, 6, 18, 33, { mode: 'uncool' }); SOCKM.forEach(m => m.visible = true);
  orb(L.k, V(ME.x, 3.6, ME.z), null, [17, .2, .14, 46], [14, .1, .12, 46]); sh(ME, 22); }, [[0, 'whoosh_soft', .5], [.3, 'murmur', .3]]);
shot(55.03, 'C', 'punch', L => { town(L); const c = ichCool(ME.x, ME.z, 0, L.T, { expr: 'worried', mouth: 'grimace', eyes: 'worried', wind: .6 }); sweat(c, L.T); onFace(c, 6.6, 0, .5, 40, L.k, 5.8); badge('red', 'PROBLEM', W / 2, H * .16, (L.lt - .15) * 3); sh(ME, 12); }, [[0, 'impact', .6], [.1, 'gulp', .5]]);
// 49 «Ich wurde mit Aura geboren.»: bebé con gafas de sol en la cuna del salón, brisa; placa 99
const CRIB = (() => { const g = new THREE.Group(); scene.add(g); const w = mat(0xf4f0e8, { roughness: .5 }); box(6, .4, 3.6, w, .1, g, 0, 2.4, 0); for (let k = 0; k <= 10; k++) for (const z of [-1.8, 1.8]) box(.16, 2.2, .16, w, .03, g, -3 + k * .6, 3.5, z); for (const x of [-3, 3]) box(.4, 4.8, 3.8, w, .1, g, x, 2.4, 0); box(5.6, .5, 3.2, mat(0x8ac8f0, { roughness: 1 }), .2, g, 0, 2.8, 0); outline(g, 1.2); g.visible = false; PROPS.push(g); return g; })();
const babyMe = (L) => { stubeN(L); OS.L.intensity = 300; show(CRIB, OX + 2, 0, 2, 0); const b = put(baby, OX + 2, 3.1, 2, 0); b.root.rotation.x = -.15; actuar(b, 0, [[0, COOL]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); attach(SHADES, b.head, [0, .9, .72], [0, 0, 0], 1.25); breeze(b, L.T, 2, 10); return b; };
shot(55.72, 'F', null, L => { const b = babyMe(L); orbit(V(OX + 2, 4.2, 2), lerp(10, 9, L.k), .25, .62, 42); badge('gold', '★ ★ ★', W / 2, H * .17, (L.lt - .2) * 3, 1, .8); sh(V(OX, 0, 2), 14); }, [[0, 'baby_gasp', .4], [.2, 'sparkle', .5]]);
shot(56.60, 'S', null, L => { const b = babyMe(L); mtag(b, 'BABY', 99, (L.lt - .1) * 3, 3); const m = put(mama, OX + 6.5, 0, 4, -1.2); actuar(m, 0, [[0, GEST.hands_face]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  orbit(V(OX + 3.6, 4.4, 2.6), lerp(15, 13.5, L.k), -.45, .45, 44); sh(V(OX, 0, 2), 14); }, [[0, 'gasp_f', .5], [.3, 'pling', .4]]);
// 50 «Egal wohin ich gehe,»: camino por la calle, la cámara me sigue de frente
shot(57.28, 'W', null, L => { town(L); const z = -2 + L.lt * 3.4; const c = put(ich, 26, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); flap(c, L.T); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); breeze(c, L.T, 2.6, 8);
  crowdAt(L, 26, z, 6, 8, 18, 35, { mode: 'walk', from: 12 }); orbit(V(26, 3.4, z), 12, .15, .1, 44); sh(V(26, 0, z), 16); }, [[0, 'steps', .5], [.3, 'wind', .4]]);
// 51 «mir folgt eine kleine Brise.»: hojas que giran a mi alrededor
shot(58.48, 'R', null, L => { town(L); const z = 2 + L.lt * 3.4; const c = put(ich, 26, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); flap(c, L.T, 1.3); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); breeze(c, L.T, 2.2, 18);
  orbit(V(26, 3.6, z), 12, .5, .2, 44); sh(V(26, 0, z), 14); }, [[0, 'leaves', .6], [.3, 'wind_trees', .4]]);
shot(59.34, 'Z', null, L => { town(L); const c = ichCool(26, 6, -.3, L.T, { wind: 1.4 }); breeze(c, L.T, 2.4, 18); orbit(V(26, 3, 6), lerp(14, 12, L.k), .6, .02, 44); sh(V(26, 0, 6), 14); }, [[0, 'wind', .5]]);
// 52 «Deshalb flattert mein Hoodie»: plano lateral de la capucha y el faldón ondeando
shot(60.04, 'S', null, L => { town(L); const c = ichCool(26, 6, -.3, L.T, { wind: 1.6 }); orbit(V(26, 4.2, 6), 10.5, -.3 + .5, .08, 42); sh(V(26, 0, 6), 12); }, [[0, 'cloth', .6], [.3, 'wind', .5]]);
cut(60.66, null, [-0.5, 1, 0], [[0, 'whoosh_soft', .4]]);
// 53 «immer dramatisch.» (zoom lento): contrapicado heroico
shot(61.30, 'I', 'slow', L => { town(L); const c = ichCool(26, 6, -.3, L.T, { wind: 1.8 }); breeze(c, L.T, 2.4, 14); const h = hp(c); cam([h.x - 1.5, 1.2, h.z + 8], [h.x, h.y - 1.4, h.z], 46); sh(V(26, 0, 6), 14); }, []);
// 54 «Sogar mein Schluckauf»: ¡hic! salto pequeño, bocadillo
shot(62.06, 'F', null, L => { town(L); const hic = (L.lt % .35) < .08; const c = ichCool(ME.x, ME.z, 0, L.T, { pose: hic ? { ...COOL, headX: -.35, lean: -.15 } : COOL, mouth: hic ? 'o' : 'smirk' }); c.root.position.y = hic ? .35 : 0; bubble(c, 'HICKS!', L.lt * 4, 2.2);
  orbit(V(ME.x, 3.8, ME.z), 12, -.2, .1, 44); sh(ME, 14); }, [[.05, 'jump_small', .4], [.1, 'pling', .5]]);
// «klingt cool.»: las chicas se giran con corazones
shot(62.77, 'W', null, L => { town(L); const c = ichCool(ME.x, ME.z, 0, L.T, { wind: .8 }); [EX[1], EX[5], EX[17]].forEach((g, i) => { const x = ME.x + [-5.5, 5.5, -3][i], z = ME.z + [-2, -2, -6][i]; put(g, x, 0, z, faceTo(V(x, 0, z), V(ME.x, 0, ME.z))); actuar(g, 0, [[0, GEST.hands_face]], { T: L.T }); cara(g, L.T + i, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' }); hearts(hp(g).add(V(0, 1.6, 0)), L.T + i); });
  orbit(V(ME.x, 3.6, ME.z - 2), lerp(21, 19, L.k), .05, .1, 46); sh(V(ME.x, 0, ME.z - 3), 18); }, [[0, 'sparkle', .5], [.2, 'gasp_f', .4]]);
// 55 «Mein Meter fällt nie unter sechsundneunzig,»: el Aura-Meter con mi nombre; la aguja nunca baja de 96
shot(63.66, 'C', 'punch', L => { town(L); meter(96 + Math.abs(Math.sin(L.T * 4)) * 3, 'ICH'); orbit(V(-6, 51, -91), lerp(30, 27, L.k), -.1, .05, 44); sh(V(-6, 40, -91), 30); }, [[0, 'impact', .5], [.2, 'machine_hum', .4]]);
shot(64.60, 'S', null, L => { town(L); const c = ichCool(ME.x, ME.z, .3, L.T); badge('gold', 'MIN. 96', W / 2, H * .09, (L.lt - .3) * 3, 1, .9); orbit(V(ME.x, 3.6, ME.z), lerp(13, 11.5, L.k), .45, .1, 44); sh(ME, 14); }, [[0, 'pling', .5], [.3, 'ding_soft', .4]]);
// 56 «also hält mich meine Familie absichtlich uncool.»: la familia me mira en la cocina, cuchichean
shot(65.84, 'W', null, L => { const me = familyAt(L); cara(me, L.T, { expr: 'smug', mouth: 'smirk' }); orbit(V(KT.x, 4, KT.z - 4.6), lerp(20, 18, L.k), 0, .14, 46); sh(KT, 20); }, [[0, 'door_close', .4], [.2, 'cup_rattle', .3]]);
shot(66.64, 'R', null, L => { kitchen(L); [[mama, -2.2, .5], [papa, 0, 0], [oma, 2.2, -.5]].forEach(([c, dx, ry], i) => { put(c, KT.x + 6 + dx, 0, KT.z + 6 - Math.abs(dx) * .6, ry + PI * .0); actuar(c, 0, [[0, GEST.lean_in]], { T: L.T }); talk(c, L.T + i, 66.64, 67.70, 'sus'); });
  orbit(V(KT.x + 6, 4.6, KT.z + 5), lerp(13, 11.5, L.k), 0, .14, 44); sh(KT, 16); }, [[0, 'whisper', .6]]);
shot(67.70, 'Z', null, L => { const me = familyAt(L, { fExpr: 'smug' }); cara(me, L.T, { expr: 'worried', mouth: 'wavy' }); badge('red', 'UNCOOL', W / 2, H * .16, (L.lt - .1) * 3); orbit(V(KT.x, 4.2, KT.z - 5.6), lerp(14, 12.5, L.k), .1, .1, 44); sh(KT, 16); }, [[0, 'sad_tone', .4]]);
// 57 «Mama schneidet meine Haare»: Mama con tijeras detrás de mí
const haircut = (L, bowlOn) => { kitchen(L); const me = put(ich, KT.x, 0, KT.z + 5.5, 0); actuar(me, 0, [[0, { aLx: .2, aRx: .2, aLe: .4, aRe: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', mouth: 'grimace' });
  const m = put(mama, KT.x + 2.4, 0, KT.z + 3.8, -.6); actuar(m, 0, [[0, { aRx: 2.6, aRz: -.3, aRe: 1.2, aLx: 2.5, aLz: -.5, aLe: 1.2, lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'smirk' });
  attach(SCI, m.aR.hand, [0, -.6, .3], [PI / 2, 0, Math.sin(L.T * 30) * .2], 1.1); if (bowlOn) { const h = hp(me); show(BOWL, h.x, h.y + 1.25 * .92, h.z, 0, 1.0); } return me; };
shot(68.45, 'F', null, L => { haircut(L, false); orbit(V(KT.x + .8, 4.6, KT.z + 5), lerp(14, 12.5, L.k), .3, .12, 44); sh(KT, 14); }, [[0, 'rip', .4], [.3, 'cloth', .4]]);
// 58 «mit einer Suppenschüssel.»: ¡la sopera en la cabeza! (golpe de zoom)
shot(69.45, 'C', 'punch', L => { const me = haircut(L, true); onFace(me, 6.8, .3, -.4, 40, L.k, 6); badge('gold', 'SUPPENSCHÜSSEL', W / 2, H * .15, (L.lt - .2) * 3, 1, .8); sh(KT, 12); }, [[0, 'porcelain', .7], [.3, 'rip', .4]]);
// 59 «Oma lässt mich einen Meerschweinchen-Rucksack tragen,»
shot(70.55, 'W', null, L => { kitchen(L); const me = put(ich, KT.x - 2, 0, KT.z + 6, .4); actuar(me, 0, [[0, GEST.shrug]], { T: L.T }); cara(me, L.T, { expr: 'worried', mouth: 'wavy' });
  const o = put(oma, KT.x + 2.6, 0, KT.z + 7, -.8); actuar(o, 0, [[0, GEST.hold]], { T: L.T }); grin(o, L.T); show(BACKP, KT.x + 1.2, 3.6, KT.z + 8.1, -.8, 1); orbit(V(KT.x, 4.4, KT.z + 6.6), lerp(15, 13.5, L.k), .1, .14, 44); sh(KT, 16); }, [[0, 'zip', .5], [.3, 'laugh_old', .4]]);
shot(71.31, 'S', null, L => { kitchen(L); setHair(ich, false); const me = put(ich, KT.x, 0, KT.z + 6, 0); actuar(me, 0, [[0, { aLx: .3, aRx: .3, aLz: .3, aRz: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' }); const h = hp(me); show(BOWL, h.x, h.y + 1.15, h.z, 0, 1.0); BOWL.visible = false;
  attach(BACKP, me.spine, [0, 1.1, -1.1], [0, PI, 0], 1.05); const o = put(oma, KT.x + 4, 0, KT.z + 4.4, -1.0); actuar(o, 0, [[0, GEST.cheer]], { T: L.T }); laughF(o, L.T); orbit(V(KT.x + 1.6, 4.4, KT.z + 6), lerp(15, 13.5, L.k), 1.25, .12, 44); sh(KT, 16); }, [[0, 'cloth', .5], [.2, 'zip', .4]]);
shot(72.23, 'Z', null, L => { town(L); const z = 10 + L.lt * 3; const me = put(ich, ME.x, 0, z, 0); actuar(me, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' }); attach(BACKP, me.spine, [0, 1.1, -1.1], [0, PI, 0], 1.05); mtag(me, 'ICH', 71, 1);
  crowdAt(L, ME.x, z, 6, 7, 16, 37, { mode: 'point', from: 18 }); orbit(V(ME.x, 3.8, z), 13, -.75, .1, 44); sh(V(ME.x, 0, z), 16); }, [[0, 'kids_laugh', .4], [.2, 'steps', .4]]);
// 60 «mit dem Meerschweinchen drin.»: primer plano de la cobaya en la ventanita
shot(72.80, 'C', 'punch', L => { kitchen(L); const me = put(ich, KT.x, 0, KT.z + 6, PI); actuar(me, 0, [[0, {}]], { T: L.T }); attach(BACKP, me.spine, [0, 1.1, -1.1], [0, PI, 0], 1.05); BACKP.userData.gp.rotation.y = Math.sin(L.T * 6) * .3; BACKP.userData.gp.position.y = .15 + Math.abs(Math.sin(L.T * 9)) * .05;
  const p = wpos(BACKP); cam([p.x + .8, p.y + .8, p.z + 5.5], [p.x, p.y - .2, p.z], 38); badge('gold', 'MOPPEL', W / 2, H * .17, (L.lt - .2) * 3); sh(KT, 12); }, [[0, 'squeak', .6], [.4, 'squeak', .5]]);
cut(72.98, null, [0.4, 1.2, 0], [[0, 'cloth', .4]]);
// 61 «Und jedes Mal, wenn ich neunundneunzig erreiche,»: en la mesa, mi placa sube… 99 en rojo
shot(74.05, 'W', null, L => { const me = familyAt(L, { mePose: COOL, fExpr: 'sus', papaPose: { aRx: .3, aLx: .3, aRe: .5 } }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' }); flap(me, L.T, 1); mtag(me, 'ICH', Math.round(lerp(96, 98, L.k)), 1); orbit(V(KT.x, 4.4, KT.z - 5.6), lerp(18, 16, L.k), -.15, .14, 46); sh(KT, 16); }, [[0, 'pling', .4], [.4, 'pling', .4]]);
shot(74.95, 'C', 'punch', L => { const me = familyAt(L, { mePose: COOL, papa: false }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' }); flap(me, L.T, 1.3); mtag(me, 'ICH', 99, 1); grade.uniforms.flash.value = Math.max(0, Math.sin(L.T * 14)) * .12; TINT = 'rgba(255,30,30,' + (.08 + Math.max(0, Math.sin(L.T * 14)) * .1).toFixed(3) + ')';
  onFace(me, 6.8, .2, .3, 40, L.k, 6); sh(KT, 14); }, [[0, 'alarm', .6]]);
cut(75.49, null, [0.5, 1, 0], [[0, 'swipe', .4]]);
// 62 «haut mir Papa ein Nudelholz auf den Kopf.»: Papa levanta el rodillo… ¡BONK!
const papaHit = (L, q) => { const me = familyAt(L, { mePose: COOL, papa: false, fExpr: 'smug' }); const p = put(papa, KT.x + 2.2, 0, KT.z - 5.4, -1.3); actuar(p, 0, [[0, { aRx: lerp(3.1, 1.6, q), aRz: -.2, aRe: lerp(.6, .1, q), aLx: .4, lean: lerp(-.1, .25, q) }]], { T: L.T }); cara(p, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  attach(PIN, p.aR.hand, [0, -.5, .3], [0, 0, PI / 2], 1); return me; };
shot(76.33, 'S', null, L => { const me = papaHit(L, 0); cara(me, L.T, { expr: 'smug', mouth: 'smirk' }); orbit(V(KT.x + 1, 5, KT.z - 5.5), lerp(15, 14, L.k), -.6, .12, 44); sh(KT, 14); }, [[0, 'whoosh_up', .5]]);
shot(77.09, 'C', 'punch', L => { const q = clamp(L.lt / .12); const me = papaHit(L, q); cara(me, L.T, q >= 1 ? { expr: 'shock', eyes: 'closed', mouth: 'grimace' } : { expr: 'smug', mouth: 'smirk' }); if (q >= 1) { applyPose(me, { crouch: .25, headX: .3 }); badge('red', 'BONK!', W / 2, H * .18, (L.lt - .12) * 4, 1, 1.2); }
  orbit(V(KT.x + .8, 5.4, KT.z - 5.5), 13.5, -.5, .1, 44); sh(KT, 14); }, [[.1, 'metal_hit', .3], [.11, 'thud', .7]]);
shot(77.65, 'Z', null, L => { const me = familyAt(L, { mePose: { crouch: .2, headX: .3, aLx: .2, aRx: .2 }, papa: false, fExpr: 'smug' }); cara(me, L.T, { expr: 'confused', eyes: 'closed', mouth: 'wavy' }); dizzy(me, L.T); mtag(me, 'ICH', 96, 1); onFace(me, 7, .4, -.4, 40, L.k, 6.4); sh(KT, 12); }, [[0, 'toy', .5]]);
// 63 «Doch eines Nachts»: la casa de la familia de noche, luna; luz en la ventana
shot(78.13, 'F', null, L => { town(L, 'night'); HB.HL.intensity = 60; orb(L.k, V(4, 18, 96), null, [56, PI / 2 + .45, -.05, 50], [48, PI / 2 + .3, -.08, 50]); sh(V(4, 0, 96), 40); }, [[0, 'owl', .5], [.2, 'crickets', .4]]);
// 64 «erzählte mir Opa ein Geheimnis:»: Opa en el sillón, yo en el suelo escuchando
const AC = () => V(OX - 6, 0, -3);
const opaChair = (L, talkIt = true) => { stubeN(L); const a = AC(); const o = put(opa, a.x, 1.3, a.z + .3, .5); actuar(o, 0, [[0, { ...SIT, aRx: 1.0, aRz: -.2, aRe: 1.4, headX: .05 }]], { T: L.T }); if (talkIt) talk(o, L.T, L.t0, L.t1, 'sus'); else cara(o, L.T, { expr: 'sus', mouth: 'smirk' });
  const mp = V(a.x + Math.sin(.5) * 6.4, 0, a.z + Math.cos(.5) * 6.4); const me = put(ich, mp.x, -.2, mp.z, faceTo(mp, a)); actuar(me, 0, [[0, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.5, aRe: 1.5, headX: -.1 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' }); return o; };
shot(79.24, 'W', null, L => { opaChair(L); const a = AC(); orbit(V(a.x + 1.6, 3.4, a.z + 3.2), lerp(17, 15, L.k), -.45, .3, 44); sh(a, 16); }, [[0, 'fire_crackle', .5], [.3, 'clock_tick', .3]]);
shot(80.04, 'I', null, L => { const o = opaChair(L); onFace(o, 6.6, .2, .6, 40, L.k, 5.8); sh(AC(), 12); }, [[0, 'whisper', .6]]);
// 65 «die Geschichte vom letzten echten Aura-Farmer.»: mis ojos como platos → Opa (zoom lento)
shot(80.98, 'C', null, L => { opaChair(L); const me = ich; cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); const h = hp(me); const a = me.root.rotation.y; cam([h.x + Math.sin(a) * 3.6 + Math.cos(a) * 1.4, h.y + 1.4, h.z + Math.cos(a) * 3.6 - Math.sin(a) * 1.4], [h.x, h.y - .1, h.z], 46); sh(AC(), 12); }, [[0, 'gasp', .4]]);
shot(81.68, 'Z', 'slow', L => { const o = opaChair(L); onFace(o, 7.4, .3, .2, 40, L.k, 5.6); badge('gold', 'DER LETZTE AURA-FARMER', W / 2, H * .15, (L.lt - .6) * 3, 1, .75); sh(AC(), 12); }, []);
// 66 «Vor vierzig Jahren»: Glanzheim en sepia, desde el aire, tormenta
const past = () => { grade.uniforms.sepia.value = .75; grade.uniforms.sat.value = 1.0; };
shot(83.55, 'F', null, L => { town(L, 'storm'); past(); RAIN.update(L.T, camera.position.clone().add(V(0, -20, -20)), 60, 60, 40, true); orb(L.k, V(DOMX, 60, DOMZ), null, [210, .3, .32, 50], [190, .25, .3, 50]); badge('gold', 'VOR 40 JAHREN', W / 2, H * .17, (L.lt - .1) * 3, 1, .9); sh(V(0, 0, -60), 120); }, [[0, 'film_roll', .5], [.1, 'wind_howl', .4]]);
// 67 «kletterte ein Mann bei Gewitter»: silueta escalando la aguja bajo la lluvia
const legend = (L, y, pose, o = {}) => { town(L, 'storm'); past(); const t = DTOP(); const c = put(opa, t.x, y, t.z + (o.dz ?? 0), o.ry ?? 0); actuar(c, 0, [[0, pose]], { T: L.T }); coatWind(c, L.T, 1.4); cara(c, L.T, { expr: 'smug', mouth: 'flat', eyes: 'half' }); DARK = o.dark ?? .25; RAIN.update(L.T, t.clone().add(V(0, -25, 0)), 40, 40, 50, true); return c; };
const CLIMB = (T) => { const p = Math.sin(T * 6); return { aLx: 2.8 + p * .3, aRx: 2.8 - p * .3, aLe: .4, aRe: .4, lLx: .8 + p * .4, lRx: .8 - p * .4, lLk: 1.2, lRk: 1.2, lean: .2 }; };
shot(84.37, 'S', null, L => { const t = DTOP(); const y = t.y - 26 + L.lt * 4; const c = legend(L, y, CLIMB(L.T), { dz: 3.2 }); cm([t.x + 7, y + 5, t.z + 16, t.x, y + 3, t.z + 3.2, 44], [t.x + 6, y + 6, t.z + 15, t.x, y + 4, t.z + 3.2, 44], L.k); sh(t, 20); }, [[0, 'rain_amb', .5], [.3, 'wood_creak', .4]]);
shot(85.13, 'F', null, L => { const t = DTOP(); legend(L, t.y - 21, CLIMB(L.T), { dz: 2.4 }); BOLT.visible = true; BOLT.position.set(t.x - 30, t.y + 40, t.z - 40); BOLT.scale.setScalar(5); grade.uniforms.flash.value = L.lt < .06 ? .4 : 0; orbit(V(t.x, t.y - 14, t.z), 60, -.4, .1, 50); sh(t, 30); }, [[0, 'thunder', .9]]);
// 68 «auf die Spitze vom Dom,»: plano amplio de la aguja con la figura arriba
shot(85.93, 'W', null, L => { const t = DTOP(); legend(L, t.y, COOL, { dark: .2 }); orb(L.k, V(t.x, t.y - 12, t.z), null, [70, .2, .02, 50], [60, .1, .02, 48]); sh(t, 60); }, [[0, 'wind_howl', .5]]);
// 69 «verschränkte die Arme»: contrapicado, cruza los brazos
shot(87.08, 'C', 'punch', L => { const t = DTOP(); const k = clamp(L.lt / .4); legend(L, t.y, { ...COOL, aLx: lerp(.3, 1.3, k), aRx: lerp(.3, 1.3, k), aLz: lerp(0, -.72, k), aRz: lerp(0, -.72, k), aLe: lerp(.2, 1.95, k), aRe: lerp(.2, 1.95, k) }); cam([t.x + 3, t.y - 2, t.z + 10], [t.x, t.y + 3.8, t.z], 44); sh(t, 14); }, [[0, 'cloth', .6], [.3, 'impact_soft', .4]]);
// 70 «und stand einfach nur da.»
shot(87.96, 'S', null, L => { const t = DTOP(); const c = legend(L, t.y, COOL); orbit(V(t.x, t.y + 3.4, t.z), lerp(16, 14, L.k), .4 + L.k * .3, .05, 44); sh(t, 14); }, [[0, 'wind', .5]]);
shot(88.48, 'R', null, L => { const t = DTOP(); legend(L, t.y, COOL); BOLT.visible = true; BOLT.position.set(t.x + 40, t.y + 30, t.z - 50); BOLT.scale.setScalar(5); grade.uniforms.flash.value = L.lt > .6 && L.lt < .7 ? .6 : 0; orbit(V(t.x, t.y - 8, t.z), lerp(46, 40, L.k), -.6, .02, 48); sh(t, 30); }, [[0, 'rain_amb', .5], [.6, 'thunder', .8]]);
// 71 «Seine Aura war so stark,» (zoom lento): resplandor dorado alrededor de la figura
const AURA = (() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.7, .6), transparent: true, opacity: .25, depthWrite: false, side: THREE.BackSide, toneMapped: false })); scene.add(m); m.visible = false; PROPS.push(m); return m; })();
const auraOn = (c, T, s = 1) => { const p = wpos(c.root); AURA.visible = true; AURA.position.set(p.x, p.y + 3.4, p.z); AURA.scale.set(3.6 * s, 5 * s, 3.6 * s); AURA.material.opacity = .18 + Math.sin(T * 8) * .05; };
shot(89.72, 'I', 'slow', L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: .1 }); auraOn(c, L.T, 1 + L.k * .3); orbit(V(t.x, t.y + 3.4, t.z), lerp(18, 13, L.k), .3, .02, 44); sh(t, 14); }, [[0, 'choir', .5]]);
// 72 «dass sich die Wolken in einem perfekten Kreis um ihn öffneten.»: las nubes se abren en círculo
shot(91.30, 'Z', null, L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: .1 }); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), .2 + L.k * .4); auraOn(c, L.T); orbit(V(t.x, t.y + 8, t.z), 70, .2, .55, 50); sh(t, 40); }, [[0, 'wind_rise', .6]]);
shot(92.26, 'F', 'punch', L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: 0 }); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), .6 + L.k * .4); auraOn(c, L.T); cam([t.x + 2, t.y + 150, t.z + 6], [t.x, t.y, t.z], 50); sh(t, 40); }, [[0, 'sunrise_shine', .6]]);
shot(93.24, 'S', null, L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: 0 }); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); auraOn(c, L.T); RAIN.update(0, t, 1, 1, 1, false); orbit(V(t.x, t.y + 6, t.z), lerp(30, 26, L.k), -.3, -.15, 48); sh(t, 30); }, [[0, 'choir', .5]]);
// 73 «Das Kommando feuerte alles, was es hatte,»: los soldados disparan desde los tejados; cohetes alrededor de la aguja
shot(94.06, 'W', null, L => { town(L, 'storm'); past(); RAIN.update(L.T, V(-6, 0, -86), 40, 40, 40, true); for (let i = 0; i < 3; i++) soldat(i, [-13, -8, -3][i], 23.3, -86, .6, L.T, { laser: 60, rifle: i }); grade.uniforms.flash.value = Math.max(0, Math.sin(L.T * 30)) * .15;
  cm([18, 30, -66, -6, 25.5, -86, 46], [16, 29, -68, -6, 25.5, -86, 46], L.k); sh(V(-6, 23, -86), 20); }, [[0, 'impact', .5], [.15, 'impact', .4], [.3, 'impact', .5], [.5, 'impact', .4]]);
shot(94.94, 'C', null, L => { const t = DTOP(); legend(L, t.y, COOL, { dark: .1 }); for (let k = 0; k < 2; k++) boom(k, t.clone().add(V(k ? 9 : -8, -4 + k * 3, k ? 4 : -3)), L.t0 + k * .35, L.T, 1.2); show(HELI[0], t.x + 40, t.y + 6, t.z + 40, -PI * .75); HELI[0].userData.spin(L.T);
  orbit(V(t.x + 10, t.y, t.z + 10), 64, .7, .1, 50); sh(t, 40); }, [[0, 'explosion', .7], [.35, 'explosion', .7], [.1, 'heli', .4]]);
// 74 «aber er blinzelte nicht einmal.»: primer plano en la sombra, los ojos quietos
shot(96.06, 'I', null, L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: .2 }); cara(c, L.T, { eyes: 'normal', mouth: 'flat', noBlink: true }); RAIN.update(0, t, 1, 1, 1, false); boom(0, t.clone().add(V(-3, 2, -6)), L.t0 + .2, L.T, .8); onFace(c, 7.4, .1, .3, 40, L.k, 6.6); sh(t, 14); }, [[.2, 'explosion', .6], [.4, 'tick', .4]]);
cut(96.86, null, [0.4, 0.9, 0], [[0, 'tick', .4]]);
// 75 «Dann verschwand er spurlos.»: humo… y la aguja vacía
shot(97.55, 'S', null, L => { const t = DTOP(); if (L.lt < .25) legend(L, t.y, COOL); else { town(L, 'storm'); past(); RAIN.update(L.T, t.clone().add(V(0, -25, 0)), 40, 40, 50, true); } dust(t, L.t0 + .2, L.T, 16, 1.4); orbit(V(t.x, t.y + 3, t.z), 16, .1, .05, 44); sh(t, 14); }, [[.2, 'magic_hit', .6], [.3, 'whoosh_soft', .4]]);
shot(98.31, 'W', null, L => { town(L, 'storm'); past(); const t = DTOP(); RAIN.update(L.T, t.clone().add(V(0, -25, 0)), 40, 40, 50, true); orb(L.k, V(t.x, t.y - 10, t.z), null, [60, -.3, .05, 48], [52, -.4, .08, 48]); badge('q', '?', W / 2, H * .2, (L.lt - .2) * 3); sh(t, 30); }, [[0, 'wind_howl', .5]]);
// 76 «Und seitdem hat der Bürgermeister Angst.»: Glanz de noche junto a la ventana, temblando y sudando
shot(99.18, 'F', null, L => { stubeN(L); OS.L.intensity = 90; const g = put(glanz, OX + 4, 0, 4, .3); actuar(g, 0, [[0, { ...GEST.hug_self, ...shiver(L.T, 3) }]], { T: L.T }); cara(g, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(g, L.T);
  orbit(V(OX + 4, 4.6, 4), lerp(14, 12.5, L.k), .4, .14, 44); sh(V(OX, 0, 4), 16); }, [[0, 'heartbeat', .6], [.3, 'thunder', .3]]);
shot(100.18, 'C', 'punch', L => { stubeN(L); OS.L.intensity = 90; const g = put(glanz, OX + 4, 0, 4, .3); actuar(g, 0, [[0, { ...GEST.hug_self, ...shiver(L.T, 3) }]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace_wide' }); sweat(g, L.T, 3); onFace(g, 6.6, .2, -.3, 40, L.k, 5.8); badge('red', 'ANGST', W / 2, H * .15, (L.lt - .3) * 3); sh(V(OX, 0, 4), 12); }, [[0, 'impact', .5], [.2, 'heartbeat', .5]]);
