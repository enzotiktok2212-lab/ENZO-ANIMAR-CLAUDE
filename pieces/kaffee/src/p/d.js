// ---------- d: mi problema, el sótano, la lata y la cuenta hasta 50 (110,9 – 153,6 s) ----------
// Sótano de Oma (KEX): estantería de tarros en z = -9.6; la lata en (KEX + 2.6, 1.35, -9.7); escalera bajando por x = KEX - 10.
const DOSEP = V(KEX + 2.6, 1.35, -9.7);
const SPL = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x6a3a1a, { roughness: .1 }), scene, 0, 0, 0, 8, 6)));
// 77 «Nur bei uns zu Hause gab es ein Problem:»: la familia en la mesa de Oma, todos ricos: fajos de billetes, joyas; brindan
shot(110.91, 'W', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); prost(o, L, .9, { sit: true, pose: SITP }); laughF(o, L.T); const p = sit2(REN[4], TB.x + 3, -4.4, 0); prost(p, L, .9, { sit: true, pose: SITP }); laughF(p, L.T);
  const k = put(JUG[2], TB.x + 7.6, 0, -1, -PI / 2 - .3); drinkLoop(k, L, 1); const u = put(REN[5], TB.x - 8, 0, -1, PI / 2 + .3); drinkLoop(u, L, 2);
  for (let i = 0; i < 8; i++) { const b = BILL[i]; b.visible = true; b.position.set(TB.x - 4 + (i % 4) * 2.4, 4.4 + (i / 4 | 0) * .14, -1.4 + (i % 2) * .6); b.rotation.set(-PI / 2, i * .4, 0); } coins(V(TB.x, 2, -1), L.t0, L.T, 12);
  orbit(V(TB.x, 5.2, -2.4), lerp(19, 17, L.k), 0, .16, 46); sh(V(TB.x, 0, -2), 20); }, [[0, 'cup_clink', .5], [.4, 'laugh_small', .4], [.9, 'coins', .4]]);
// 78 «mich.»: corte seco a mí, de pie en la puerta de la cocina, con la cartera vacía y una polilla que sale volando
shot(112.83, 'C', 'punch', L => { kuecheS(L); const c = put(ich, TB.x + 12, 0, 6, -.8); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.4, aLx: .2, lean: .05, headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  const h = hp(c); show(WALLET, h.x - .6, h.y - 2.6, h.z + 1.2, -.8, .9); show(MOTH, h.x - .4, h.y - 1.6 + L.lt * 2, h.z + 1.4, 0, .9); MOTH.children.forEach(w => { if (w.name) w.rotation.y = Math.sin(L.T * 30) * .8 * (w.name === 'w1' ? 1 : -1); });
  onFace(c, 6, .6, .6, 40, L.k); sh(V(TB.x + 12, 0, 6), 12); }, [[0, 'record_scratch', .5], [.2, 'moth', .4]]);
// 79 «Ich vertrage kein Koffein.»: Oma me ofrece una taza; yo la aparto con las dos manos poniendo cara de asco
shot(113.46, 'W', null, L => { kuecheS(L); const c = put(ich, TB.x + 6, 0, 3, -2.4); const o = put(oma, TB.x + 3, 0, .4, .8); prost(o, L, .45, { pose: { aLx: .5 } }); cara(o, L.T, { expr: 'happy', mouth: 'smile' });
  actuar(c, L.lt, [[0, {}], [.2, { aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3, aLz: -.2, aRz: -.2, lean: -.15, headY: .5 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', eyes: 'squint', mouth: 'grimace' });
  orbit(V(TB.x + 4.5, 5, 1.8), lerp(14, 12, L.k), 1.4, .12, 42); sh(V(TB.x + 4.5, 0, 2), 14); }, [[0, 'no_no', .5], [.3, 'whoosh_soft', .4]]);
// 80 «Ein halber Espresso, sechs Euro,»: me tomo medio espresso con cuidado; el reloj de muñeca: +6 €
shot(115.25, 'C', null, L => { kuecheS(L); const c = put(ich, TB.x, 0, 3.4, PI + .1); drink(c, L, L.t0 + .1, .35, { kind: 'esp', meter: true, expr: 'worried', after: 'worried', afterMouth: 'wavy', l0: .5, l1: .25 }); meterOf(c).userData.set('½ Tasse', '6 €');
  cashPop(c, '+6 €', clamp((L.lt - .9) / .2), 'green', .9); dcam(c, L.k, 10, -.85, 5, 42); sh(V(TB.x, 0, 3), 14); }, [[0, 'sip', .5], [.9, 'coin_small', .5]]);
// 81 «und schon zitterten meine Hände.»: mis manos tiemblan sin control, la taza tintinea y el café salpica; ojos como espirales
shot(116.97, 'S', 'punch', L => { kuecheS(L); const c = put(ich, TB.x, 0, 3.4, PI + .1); actuar(c, 0, [[0, tremble(L.T, 2.6)]], { T: L.T, extra: { sx: Math.sin(L.T * 50) * .04 } }); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace_wide' }); sweat(c, L.T, 3);
  const e = ESP[0]; attach(e, c.aR.hand, [-.62, -.2, -.5], [PI / 2 + Math.sin(L.T * 55) * .2, 0, 0], 1.1); e.userData.level(.25); for (let i = 0; i < 4; i++) { const d = SPL[i]; d.visible = true; const t = (L.T * 2 + i * .25) % 1, w = wpos(e); d.position.set(w.x + Math.sin(i * 2) * t * 1.4, w.y + 1 - t * t * 4, w.z + Math.cos(i * 2) * t * 1.4); }
  onBody(c, 9, 0, .1, 40, L.k, 7.6, 0, 4.4); sh(V(TB.x, 0, 3), 12); }, [[0, 'cup_rattle', .7], [.5, 'shiver', .5], [1.2, 'cup_rattle', .5]]);
// 82 «Ich war der Einzige in der Familie ohne einen Cent.»: retrato de familia en la pared: todos con coronas y oro… y yo en una esquina con la cartera vacía
shot(119.17, 'W', null, L => { kuecheS(L); const row = [REN[4], oma, REN[5], JUG[2]]; row.forEach((x, i) => { put(x, TB.x - 6 + i * 3.4, 0, -8, 0); actuar(x, 0, [[0, { aRx: .9, aRe: .6, aLx: .9, aLe: .6 }]], { T: L.T }); grin(x, L.T + i); const h = hp(x); show(CROWNS[i], h.x, h.y + 1.25, h.z, i, .9); });
  const c = put(ich, TB.x + 8.6, 0, -6.6, -.4); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.4, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); const h = hp(c); show(WALLET, h.x - .6, h.y - 2.6, h.z + 1.2, -.4, .9); billRain(V(TB.x - 2, 0, -8), L.T, 30, 12, 3, 10); badge('red', '0 €', W * .76, H * .3, clamp((L.lt - .8) / .2), 1, 1);
  orbit(V(TB.x + 1.4, 5.4, -7.4), lerp(20, 18, L.k), 0, .1, 46); sh(V(TB.x + 1, 0, -7), 20); }, [[0, 'camera_click', .5], [.6, 'sad_trombone', .5]]);
// 83 «Bis Oma mich eines Abends in den Keller schickte,»: tarde, cocina en penumbra: Oma, sonriente, me tiende una cesta y señala la puerta del sótano
shot(122.21, 'B', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, TB.x + 6, 0, 2, PI / 2 + .3); actuar(o, L.lt, [[0, {}], [.3, { aRx: 1.6, aRz: -.1, aRe: .1, aLx: 1.0, aLe: 1.0 }, { dur: .4 }]], { T: L.T }); talk(o, L.T, L.t0, L.t0 + 1.8, 'smug');
  const c = put(ich, TB.x + 11, 0, 4, -PI / 2 - .4); actuar(c, 0, [[0, { aRx: .9, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral' }); show(BUCKET, TB.x + 9.4, 3.2, 3.4, 0, 1);
  orbit(V(TB.x + 8.5, 5, 3), lerp(15, 13, L.k), -.25, .12, 44); sh(V(TB.x + 8, 0, 3), 16); }, [[0, 'clock_tick', .4], [.5, 'door_creak', .5]]);
// 84 «Kartoffeln holen.»: bajo las escaleras de madera del sótano con la cesta, la bombilla parpadea
shot(124.68, 'S', null, L => { kellerS(L); const k = clamp(L.lt / 1); const c = put(ich, KEX - 10, lerp(9.8, 6.8, k), lerp(-4, -.5, k), 0); c.blob.visible = false; actuar(c, 0, [[0, { ...walkP(L.T, 1), aRx: .8, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  KE.BL.intensity = Math.sin(L.T * 23) > .7 ? 30 : 90; orbit(V(KEX - 10, 8, -2), lerp(14, 12, L.k), 0, .08, 44); sh(V(KEX - 8, 0, -2), 16); }, [[0, 'stairs_creak', .6], [.5, 'stairs_creak', .6], [.7, 'bulb_flicker', .4]]);
// 85 «Hinter den Einmachgläsern»: aparto los tarros de colores de la estantería con las dos manos
shot(125.65, 'C', null, L => { kellerS(L); const c = put(ich, KEX + 2.6, 0, -5.4, PI); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5, aLz: -.2 - Math.sin(L.T * 6) * .2, aRz: -.2 + Math.sin(L.T * 6) * .2, lean: .25, crouch: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  CAMK = 1; orbit(V(KEX + 2.6, 4, -6.6), lerp(6.5, 5.8, L.k), PI / 2 + .15, .2, 42); sh(V(KEX + 2, 0, -7), 14); }, [[0, 'jar_clink', .6], [.5, 'jar_clink', .5]]);
// 86 «stand eine alte Kaffeedose aus Blech.» (zoom lento): la lata roja y dorada aparece en la sombra, el polvo flota en el haz de la bombilla
shot(126.79, 'F', 'slow', L => { kellerS(L); KE.D.userData.steam(L.T, .5); dust(DOSEP.clone().add(V(0, 1, 1)), L.t0, L.T, 0); DUST.forEach((d, i) => { const r = RNG(i * 9 + 2); d.visible = true; d.position.set(DOSEP.x + (r() - .5) * 3, DOSEP.y + ((L.T * .15 + r()) % 1) * 5, DOSEP.z + 1 + r() * 2); d.scale.setScalar(.05 + r() * .05); d.material.opacity = .6; });
  cm([DOSEP.x + .8, DOSEP.y + 2.4, DOSEP.z + 7, DOSEP.x, DOSEP.y + 1.1, DOSEP.z, 34], [DOSEP.x + .4, DOSEP.y + 1.9, DOSEP.z + 5, DOSEP.x, DOSEP.y + 1.1, DOSEP.z, 30], L.k); sh(DOSEP, 10); DOF = 1.5; }, [[0, 'mystery', .5]]);
// 87 «Darauf ein Zettel in Omas Handschrift:»: la cojo y la saco a la luz: la nota pegada con celo
shot(129.00, 'W', null, L => { kellerS(L); const c = put(ich, KEX, 0, -2, 0); actuar(c, 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.3, aRz: -.3, aLe: 1.0, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  const h = hp(c); show(DOSE, h.x, h.y - 3.6, h.z + 1.6, 0, .9); orbit(V(KEX, 5.2, -1.6), lerp(9, 7.6, L.k), 0, .1, 40); sh(V(KEX, 0, -2), 12); }, [[0, 'tin_lift', .5], [.6, 'paper_rustle', .4]]);
// 88 «„Nur ein Löffel.»: primerísimo plano de la nota con la letra azul de Oma
shot(130.82, 'C', 'punch', L => { kellerS(L); show(DOSE, KEX, 4, 0, 0, 1.4); const n = wpos(DOSE.userData.note); cm([n.x, n.y + .3, n.z + 3.2, n.x, n.y, n.z, 34], [n.x, n.y + .2, n.z + 2.6, n.x, n.y, n.z, 32], L.k); sh(V(KEX, 0, 0), 8); DOF = 0;
  badge('tag', 'NUR EIN LÖFFEL', W / 2, H * .2, clamp(L.lt / .2), 1, 1); }, [[0, 'paper_rustle', .5]]);
// 89 «Niemals mehr."»: zoom a «NIEMALS MEHR!» en rojo; viñeta y golpe
shot(132.17, 'Z', 'punch', L => { kellerS(L); show(DOSE, KEX, 4, 0, 0, 1.4); const n = wpos(DOSE.userData.note); cm([n.x, n.y - .2, n.z + 2.1, n.x, n.y - .3, n.z, 30], [n.x, n.y - .2, n.z + 1.8, n.x, n.y - .3, n.z, 28], L.k); sh(V(KEX, 0, 0), 8); DOF = 0;
  badge('red', 'NIEMALS MEHR!', W / 2, H * .2, clamp(L.lt / .15), 1, 1.1); grade.uniforms.vig.value = .7; }, [[0, 'impact', .6], [.1, 'braam', .5]]);
// 90 «Ich nahm einen Löffel und kochte mir eine Tasse.»: de noche en la cocina: hundo la cuchara en la lata (el café brilla un poco) y la echo en el filtro
shot(133.09, 'W', null, L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1); DOSE.userData.open(1); DOSE.userData.glow(.4); DOSE.userData.steam(L.T, .6);
  const k = clamp(L.lt / 1.2); actuar(c, 0, [[0, { aRx: 1.3 + Math.sin(k * PI) * .3, aRz: .3 - k * .5, aRe: .6, aLx: .8, aLe: 1.1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); attach(SPOON, c.aR.hand, [0, -.6, .3], [0, 0, 0], 1);
  const K = KAN[2]; show(K, TB.x + 1.8, 4.3, -3.4, 0, 1); K.userData.level(clamp(L.lt - .8)); K.userData.steam(L.T, 1); show(FILT, TB.x + 1.8, 6.8, -3.4, 0, 1);
  orbit(V(TB.x, 5, -4.4), lerp(12, 10.5, L.k), .2, .2, 42); sh(V(TB.x, 0, -4), 14); }, [[0, 'spoon_scoop', .6], [.7, 'water_boil', .5], [1.6, 'pour', .5]]);
// 91 «Und meine Hände zitterten nicht.»: sostengo la taza con las dos manos delante de la cara… firme. Me miro las manos, asombrado
shot(135.54, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -1, 0); actuar(c, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.4, aRe: 1.4, aLz: -.25, aRz: -.25, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); const cu = mugOf(ich); attach(cu, c.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); cu.userData.level(.8); cu.userData.steam(L.T, 1);
  badge('green', 'KEIN ZITTERN!', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, .9); onBody(c, 8, 0, .1, 40, L.k, 7, 0, 4.4); sh(V(TB.x, 0, -1), 12); }, [[0, 'ding', .5], [.5, 'sparkle', .4]]);
// 92 «Es war der beste Kaffee meines Lebens.»: bebo y cierro los ojos: halo dorado, brillos, el fondo se ilumina
shot(137.01, 'F', null, L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -1, 0); drink(c, L, L.t0 + .1, .9, { expr: 'warm', after: 'joy', eyesD: 'happy' }); const h = hp(c); show(HALO, h.x, h.y + 2.2, h.z, 0, 1); confRain(V(TB.x, 2, -1), L.T, 30, 10, 6, 12); grade.uniforms.lift.value = .05; bloom.strength = .5;
  onFace(c, 6.6, .8, -1.4, 40, L.k); sh(V(TB.x, 0, -1), 12); }, [[0, 'sip', .5], [.3, 'choir', .6], [1.2, 'aah', .4]]);
// 93 «Also nahm ich natürlich noch einen Löffel.»: sonrisa pícara mirando a cámara mientras hundo otra vez la cuchara
shot(139.04, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1); DOSE.userData.open(1); DOSE.userData.glow(.5); actuar(c, 0, [[0, { aRx: 1.5, aRz: .1, aRe: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' }); attach(SPOON, c.aR.hand, [0, -.6, .3], [0, 0, 0], 1);
  onFace(c, 6.4, .8, .8, 40, L.k); sh(V(TB.x, 0, -5), 12); }, [[0, 'spoon_scoop', .6], [.5, 'snicker', .4]]);
// 94 «Und noch einen.»: otra cucharada, rápida; la cámara gira
shot(140.98, 'R', null, L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1); DOSE.userData.open(1); DOSE.userData.glow(.6); actuar(c, 0, [[0, { aRx: 1.2 + Math.abs(Math.sin(L.T * 12)) * .4, aRz: .2, aRe: .6 }]], { T: L.T }); grin(c, L.T); attach(SPOON, c.aR.hand, [0, -.6, .3], [0, 0, 0], 1);
  orbit(V(TB.x - 1, 5, -4.4), 10, -.4 + L.k * .5, .25, 42); sh(V(TB.x, 0, -5), 12); }, [[0, 'spoon_scoop', .6], [.4, 'spoon_scoop', .5]]);
// 95 «Aber die Dose blieb randvoll.» (zoom lento): la lata, brillando, sigue llena hasta el borde aunque saco y saco; el polvo de café se recoloca solo
shot(141.97, 'F', 'slow', L => { kuecheS(L, { night: 1 }); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1.3); DOSE.userData.open(1); DOSE.userData.glow(.5 + Math.sin(L.T * 4) * .3); DOSE.userData.steam(L.T, 1); const P = DOSE.userData.pow; P.scale.y = .32 + Math.sin(L.T * 3) * .05;
  confRain(V(TB.x - 1.6, 4.3, -3.6), L.T, 16, 3, 3, 5); const d = wpos(DOSE); cm([d.x + 1, d.y + 6, d.z + 6, d.x, d.y + 2.2, d.z, 36], [d.x + .6, d.y + 5, d.z + 4.4, d.x, d.y + 2.2, d.z, 32], L.k); sh(d, 10); DOF = 1.4; }, [[0, 'magic_shimmer', .6]]);
// 96 «Mein Zähler drehte durch.»: el reloj de mi muñeca suelta chispas, los números corren como una tragaperras
shot(143.73, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -1, 0); actuar(c, 0, [[0, { aLx: 1.5, aLz: -.5, aLe: 1.5, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); const m = meterOf(c); const n = Math.floor(L.T * 37) % 99; m.userData.set(n + ' Tassen', euro(money(n % 50)), '#ffd23f');
  confetti(wpos(m), L.t0, L.T, 20, .4); const w = wpos(m); cm([w.x + 1.2, w.y + 1.4, w.z + 4.4, w.x, w.y, w.z, 34], [w.x + .9, w.y + 1.2, w.z + 3.6, w.x, w.y, w.z, 32], L.k); sh(V(TB.x, 0, -1), 12); DOF = 1.6; }, [[0, 'slot_machine', .7], [.3, 'sparks', .5]]);
// 97 «Zehn Tassen.»: bebo; diez tazas vacías en la mesa; +10
shot(144.91, 'W', null, L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t0, .4, { meter: true, chug: true, expr: 'determined' }); meterOf(c).userData.set('10 Tassen', euro(money(10))); setHUD(10); stack(V(TB.x + 2, 4.3, -3.2), 10, 1);
  billBurst(hp(c), L.t0 + .3, L.T, 20, .9); onBody(c, 12, -.4, .1, 42, L.k, 11, -.3, 4.4); sh(V(TB.x, 0, -4), 14); }, [[0, 'gulp', .6], [.4, 'cash_reg', .6]]);
// 98 «Zwanzig.»: veinte tazas; los billetes empiezan a volar por la cocina
shot(145.74, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t0 - .1, .35, { meter: true, chug: true, expr: 'determined' }); meterOf(c).userData.set('20 Tassen', '1 Mio. €', '#ffd23f'); setHUD(20, '#ffd23f'); stack(V(TB.x + 2, 4.3, -3.2), 20, 1);
  billRain(V(TB.x, 0, -4), L.T, 50, 16, 10, 12); dcam(c, L.k, 11, -.7, 5, 42); sh(V(TB.x, 0, -4), 14); }, [[0, 'gulp', .6], [.3, 'money_rain', .6]]);
// 99 «Dreißig!»: treinta tazas: la pirámide llega al techo, yo bebo con una taza en cada mano
shot(146.65, 'Z', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t0, .35, { meter: true, chug: true, expr: 'determined', pose: { aLx: 2.0, aLz: .4, aLe: .6 } }); setHUD(30, '#ffd23f'); stack(V(TB.x + 2.2, 4.3, -3.2), 30, 1);
  badge('gold', '30!', W / 2, H * .22, clamp(L.lt / .15), 1, 1.4); billRain(V(TB.x, 0, -4), L.T, 70, 16, 10, 12); orbit(V(TB.x + 1, 6, -5), lerp(15, 13, L.k), .4, .14, 44); sh(V(TB.x, 0, -4), 14); }, [[0, 'gulp', .6], [.1, 'impact', .5]]);
// 100 «Genau da, wo alle aufgeben.»: corte a la terraza: el fortachón del principio sigue tirado en el suelo… yo, en mi cocina, sigo bebiendo sin despeinarme
shot(147.50, 'S', null, L => { if (L.lt < .7) { town(L, { dusk: 1 }); const h = cafeNear(30); const tx = Math.sign(h.x) * 40; const c = put(CR[16], tx, .5, h.z - 7.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -1.5; actuar(c, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .8, aRz: .8 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' }); badge('red', 'AUFGEGEBEN', W / 2, H * .22, 1, 1, .9);
    orbit(V(tx, 2, h.z - 7.6), 12, (h.x < 0 ? -.6 : .6), .5, 44); sh(V(tx, 0, h.z - 6), 16); }
  else { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t1 - 1.3, .4, { meter: true, expr: 'smug', after: 'smug', afterMouth: 'smirk' }); setHUD(35, '#ffd23f'); stack(V(TB.x + 2.2, 4.3, -3.2), 35, 1); onBody(c, 11, -.3, .1, 42, L.k, 10, -.3, 4.6); sh(V(TB.x, 0, -4), 14); } },
  [[0, 'snore', .4], [.7, 'whoosh', .4], [.9, 'gulp', .5]]);
// 101 «Vierzig.»: cuarenta; la cocina tiembla, los platos del aparador saltan
shot(148.94, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t0, .3, { meter: true, chug: true, expr: 'determined' }); setHUD(40, '#ffd23f'); stack(V(TB.x + 2.2, 4.3, -3.2), 40, 1); SHAKE = .6;
  billRain(V(TB.x, 0, -4), L.T, 90, 18, 12, 12); dcam(c, L.k, 11, -1.0, 5, 42); sh(V(TB.x, 0, -4), 14); }, [[0, 'gulp', .6], [.1, 'rumble', .6]]);
// 102 «Fünfzig Tassen!» (zoom lento): la última taza: me la bebo de pie sobre la silla, con la pirámide de 50 tazas brillando detrás; todo se ilumina de oro
shot(149.60, 'F', 'slow', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 2.6, -6.4, 0); c.blob.visible = false; drink(c, L, L.t0, .9, { meter: true, chug: true, expr: 'determined', eyesD: 'squint', pose: { aLx: 2.6, aLz: .5, aLe: .3 } }); setHUD(L.lt < 1.2 ? 49 : 50, '#ffd23f'); stack(V(TB.x + 2.2, 4.3, -3.2), 50, 1);
  bloom.strength = .4 + L.k * .4; grade.uniforms.lift.value = L.k * .05; billRain(V(TB.x, 0, -4), L.T, 100, 20, 12, 14); onBody(c, 15, -.2, .08, 44, L.k, 12, -.1, 4.4); sh(V(TB.x, 0, -4), 16); }, [[0, 'gulp_long', .7], [.3, 'drumroll', .5]]);
// 103 «Die Legende.»: corte a la pizarra de la plaza: «REKORD: 50 TASSEN» se escribe sola en dorado; la gente sale en pijama a mirarla
shot(151.14, 'Z', 'punch', L => { town(L, { night: 1 }); show(TAFEL, 0, 0, 34, PI); TAFEL.userData.draw((c, w, h) => drawLegend(c, w, h, 1, 1)); crowdAt(L, 0, 24, 10, 4, 9, 21, { mode: i => ['shock', 'point'][i % 2], face: V(0, 15, 34), gap: 1.6 });
  confRain(V(0, 10, 32), L.T, 40, 26, 6, 18); cm([0, 12, 6, 0, 15, 34, 44], [0, 13, 10, 0, 15.5, 34, 42], L.k); sh(V(0, 0, 26), 30); DOF = 0; }, [[0, 'choir', .6], [.1, 'impact', .5]]);
// 104 «Ich war Billionär!»: en la cocina, salto con los brazos en alto; explosión de billetes y confeti; HUD: 50 Tassen · 1 Bio. €
shot(152.06, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, Math.max(0, Math.sin(clamp(L.lt / .6) * PI) * 3), -1, 0); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .2, aRe: .2, lLk: .8, rLk: .8 }]], { T: L.T }); laughF(c, L.T); setHUD(50, '#ffd23f'); meterOf(c).userData.set('50 Tassen', '1 Bio. €', '#ffd23f');
  billBurst(hp(c), L.t0, L.T, 40, 1.4, 0); confetti(hp(c), L.t0, L.T, 70, 1.2); cashPop(c, '1 BILLION €', clamp((L.lt - .1) / .2), 'gold', 1.3, 3.4); onBody(c, 13, 0, .1, 44, L.k, 11, 0, 4.4); sh(V(TB.x, 0, -1), 14); }, [[0, 'crowd_cheer', .4], [.05, 'money_burst', .7], [.2, 'party_horn', .5]]);
