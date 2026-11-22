// ---------- c: la policía, «Nein», la alcaldesa, el agujero lila, «Korken» (41,34 – 61,74 s) ----------
const myChairScene = (L, o = {}) => { myHole(L, o.glow ?? 0, o.bub ?? 0); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); };
const lilaK = T => clamp((T - 56.2) / .5);     // el resplandor lila (desde que sale la luz)
// la alcaldesa: de pie junto a su botella (DP), mirando hacia mí
const DRY = Math.atan2(CP.x - DP.x, CP.z - DP.z);
function dornAt(L, o = {}) { const d = put(dorn, DP.x + Math.sin(DRY) * -2.4 + (o.dx || 0), 0, DP.z + Math.cos(DRY) * -2.4 + (o.dz || 0), o.ry ?? DRY); actuar(d, 0, [[0, o.pose || {}]], { T: L.T }); return d; }
// 39 «Die Polizei rennt auf mich zu:»: dos policías cruzan la plaza corriendo hacia mí
shot(41.34, 'S', null, L => { town(L); myChairScene(L); const run = (c, x0, z0, i) => { const p = put(c, x0 - L.lt * 5.5, 0, z0 - L.lt * 4.2, Math.atan2(-5.5, -4.2)); p.root.position.y = Math.abs(Math.sin(L.T * 13 + i)) * .35; actuar(p, 0, [[0, runP(L.T, i)]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'talk_wide' }); return p; };
  const a = run(cop1, 18, 32, 0), b = run(cop2, 22, 30, 2);
  plaza(L, { cx: 12, cz: 22, n: 14, r0: 6, r1: 22, seed: 45, mode: 'stare', face: hp(a) });
  const m = a.root.position; cm([m.x - 8, 6, m.z - 9], [m.x - 6, 5.6, m.z - 7], L.k); camera.lookAt(m.x + 1, 3.6, m.z + 1); camera.fov = 48; sh(V(m.x, 0, m.z), 22); }, [[0, 'whistle', .55], [.2, 'run_steps', .5]]);
// 40 «„Sofort zurück»: el policía me grita y señala al suelo
shot(42.82, 'C', 'punch', L => { town(L); myChairScene(L); const p = put(cop1, CP.x + 1.2, 0, CP.z + 6, Math.PI + .15); actuar(p, 0, [[0, { aRx: 1.3, aRz: .1, aRe: .1, aLx: .4, aLz: .3, aLe: 1.4, lean: .12, headX: .1 }]], { T: L.T }); talk(p, L.T, 42.8, 44.4, 'angry');
  const q = put(cop2, CP.x + 4.2, 0, CP.z + 5.4, Math.PI - .5); actuar(q, 0, [[0, GEST.cross]], { T: L.T }); cara(q, L.T, { expr: 'angry', mouth: 'flat' });
  plaza(L, { cx: CP.x, cz: CP.z + 14, n: 8, r0: 5, r1: 14, seed: 47, mode: 'stare', face: hp(p) });
  onFace(p, 6, .4, -.6, 42, L.k, 5); bubble(p, 'Sofort zurück auf eine Flasche!', clamp((L.lt - .05) / .15), 1.6); sh(V(CP.x, 0, CP.z + 6), 14); }, [[0, 'shout_m', .45]]);
// 41 «auf eine Flasche!“»: por encima de mi hombro: los dos policías delante de mi silla, uno señala mi botella tirada
shot(43.70, 'W', null, L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.2, aLx: .4, aRx: .4, aLz: .3, aRz: .3 }); cara(c, L.T, { expr: 'neutral' });
  const p = put(cop1, CP.x + 1.2, 0, CP.z + 6, Math.PI + .15); actuar(p, 0, [[0, { aRx: 1.0, aRz: -.3, aRe: .1, lean: .1, headX: .25, headY: .35 }]], { T: L.T }); talk(p, L.T, 42.8, 44.4, 'angry');
  const q = put(cop2, CP.x + 4.2, 0, CP.z + 5.4, Math.PI - .5); actuar(q, 0, [[0, GEST.cross]], { T: L.T }); cara(q, L.T, { expr: 'angry', mouth: 'flat' });
  cm([CP.x - 2.4, 11, CP.z - 5], [CP.x - 2, 10.6, CP.z - 4.2], L.k); camera.lookAt(CP.x + 2, 4, CP.z + 6); camera.fov = 48; sh(V(CP.x, 0, CP.z + 3), 16); }, [[0, 'tsk', .4]]);
// 42 «Aber ich sage:»: me cruzo de brazos y me recuesto
shot(44.52, 'F', null, L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { ...GEST.cross, lean: -.3 }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  plaza(L, { n: 10, r0: 8, r1: 20, seed: 49, mode: 'stare', face: hp(c) });
  onBody(c, 14, -.35, .1, 44, L.k, 12, -.2, 2.4); sh(CP, 16); }, [[.1, 'cloth', .4]]);
// 43 «„Nein.»: primer plano: «NEIN.»
shot(45.54, 'C', 'punch', L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { ...GEST.cross, lean: -.3 }); cara(c, L.T, { expr: 'determined', mouth: L.lt < .25 ? 'o' : 'flat' });
  onFace(c, 6.2, .3, .2, 40, L.k, 5.4); badge('red', 'NEIN.', W / 2, H * .12, clamp(L.lt / .1), 1, 1.1); sh(CP, 12); }, [[0, 'impact', .55]]);
// 44 «Mein Stuhl ist»: doy palmaditas al respaldo
shot(46.03, 'S', null, L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.3, aRx: -.3 + Math.abs(Math.sin(L.T * 9)) * .3, aRz: .9, aRe: 1.6, aLx: .5, aLz: .4 }); cara(c, L.T, { expr: 'smug', mouth: 'grin' });
  cm([CP.x + 4.5, 5.4, CP.z + 4.4], [CP.x + 3.8, 5.2, CP.z + 3.6], L.k); camera.lookAt(CP.x, 4.4, CP.z - .5); camera.fov = 44; sh(CP, 12); }, [[.15, 'pat', .5], [.35, 'pat', .4]]);
// 45 «tausendmal bequemer.“»: los policías se miran sin palabras; «1000× BEQUEMER»
shot(46.71, 'R', null, L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.35, aLx: -.2, aRx: -.2, aLz: 1.0, aRz: 1.0, aLe: 2.2, aRe: 2.2 }); grin(c, L.T, { eyes: 'closed' });
  const p = put(cop1, CP.x + 1.2, 0, CP.z + 6, Math.PI + .5); actuar(p, 0, [[0, GEST.shock]], { T: L.T }); cara(p, L.T, { expr: 'shock', mouth: 'o' }); const q = put(cop2, CP.x + 4.2, 0, CP.z + 5.4, Math.PI - 1.0); actuar(q, 0, [[0, GEST.shrug]], { T: L.T }); cara(q, L.T, { expr: 'confused', mouth: 'flat' });
  plaza(L, { n: 10, r0: 10, r1: 22, seed: 51, mode: 'shock' });
  orb(L.k, V(CP.x + 2, 3.4, CP.z + 3), null, [20, -.7, .2, 46], [18, -.45, .16, 46]); badge('gold', '1000× BEQUEMER', W / 2, H * .15, clamp((L.T - 46.75) / .15), 1, .85); sh(V(CP.x, 0, CP.z + 3), 18); }, [[0, 'ding_reveal', .45], [.4, 'murmur', .4]]);
// 46 «Da brüllt die Bürgermeisterin:»: la alcaldesa salta de su botella y grita con los puños cerrados
shot(48.06, 'Z', 'punch', L => { town(L); const k = clamp((L.T - 48.1) / .3); show(DORNB, DP.x, 0, DP.z, 0); DORNB.userData.collar.visible = true;
  const d = put(dorn, DP.x, lerp(sitY(dorn), 0, k), DP.z + lerp(0, 1.8, k), DRY); actuar(d, 0, [[0, { ...GEST.fists, ...(k < 1 ? seatPose() : {}), lean: .15, headX: -.1 }]], { T: L.T }); talk(d, L.T, 48.1, 49.5, 'angry'); d.blob.visible = k > .8;
  plaza(L, { cx: DP.x, cz: DP.z - 6, n: 10, r0: 6, r1: 18, seed: 53, mode: 'shock' });
  onBody(d, 15, 0, .14, 44, L.k, 12.5, 0, 3.2); badge('tag', 'BÜRGERMEISTERIN', W / 2, H * .14, clamp((L.lt - .1) / .15), 1, .85); sh(DP, 18); }, [[0, 'shout_f', .55], [.05, 'glass_clink', .4]]);
// 47 «„Weißt du denn nicht,»: primer plano de la alcaldesa gritando
shot(49.58, 'C', null, L => { town(L); show(DORNB, DP.x, 0, DP.z, 0); DORNB.userData.collar.visible = true; const d = dornAt(L, { pose: { ...GEST.fists, aRx: 1.4, aRz: .1, aRe: .4, lean: .15 } }); talk(d, L.T, 49.5, 51.5, 'angry');
  onFace(d, 5.6, .2, .6, 40, L.k, 4.6); bubble(d, 'Wozu sind die Flaschen da?', clamp((L.lt - .05) / .15), 1.6); sh(DP, 14); }, [[0, 'shout_f', .45]]);
// 48 «wozu die Flaschen da sind?“»: desde detrás de ella: señala a toda la plaza sentada en botellas; yo en mi silla al fondo
shot(50.48, 'W', null, L => { town(L); myChairScene(L); show(DORNB, DP.x, 0, DP.z, 0); DORNB.userData.collar.visible = true; const d = dornAt(L, { pose: { aRx: 1.6, aRz: .4, aRe: .1, aLx: .5, aLz: -.4, aLe: 1.3, headY: .4 } }); talk(d, L.T, 49.5, 51.5, 'angry');
  const c = inChair(ich, CP.x, CP.z, faceTo(CP, DP), L, { lean: -.2, aLx: .5, aRx: .5 }); cara(c, L.T, { expr: 'confused' });
  plaza(L, { n: 16, r0: 8, r1: 28, seed: 55, mode: 'stare', face: hp(d) });
  const h = hp(d); cm([h.x + 3.4, 8.4, h.z - 6], [h.x + 2.8, 8.2, h.z - 5], L.k); camera.lookAt(CP.x, 3.4, CP.z); camera.fov = 50; sh(V(CP.x, 0, CP.z), 22); }, [[0, 'murmur', .4]]);
// 49 «Ganz langsam zieht sie» (zoom lento): se agacha y agarra su propia botella con las dos manos
shot(51.73, 'I', 'slow', L => { town(L); show(DORNB, DP.x, 0, DP.z, 0); DORNB.userData.collar.visible = true; const d = put(dorn, DP.x, 0, DP.z - 2.1, 0); actuar(d, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.22, aRz: -.22, aLe: .5, aRe: .5, lean: .3, crouch: .3, headX: .1 }]], { T: L.T }); cara(d, L.T, { expr: 'determined', eyes: 'squint', mouth: 'flat' });
  plaza(L, { cx: DP.x, cz: DP.z - 6, n: 10, r0: 6, r1: 16, seed: 57, mode: 'stare', face: V(DP.x, 3, DP.z) });
  orb(L.k, V(DP.x, 3.6, DP.z - 1), null, [18, .2, .2, 46], [11, .1, .14, 44], easeIn); sh(DP, 16); }, [[.2, 'glass_creak', .45]]);
// 50 «ihre eigene Flasche aus dem Boden.»: la botella sube, despacio; por debajo asoma una luz lila
shot(53.38, 'F', null, L => { town(L); const k = easeInOut(clamp((L.T - 53.45) / 1.15)); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(k * .5, 0, L.T); show(DORNB, DP.x, k * 3.6, DP.z, 0); DORNB.userData.collar.visible = false;
  const d = put(dorn, DP.x, 0, DP.z - 2.1, 0); actuar(d, 0, [[0, { aLx: 1.6 + k * .7, aRx: 1.6 + k * .7, aLz: -.22, aRz: -.22, aLe: .5, aRe: .5, lean: .3 - k * .35, crouch: .3 * (1 - k), headX: -.1 }]], { T: L.T }); cara(d, L.T, { expr: 'determined', mouth: 'flat' });
  plaza(L, { cx: DP.x, cz: DP.z - 6, n: 10, r0: 6, r1: 16, seed: 59, mode: 'shock' });
  cm([DP.x + 11, 5, DP.z + 5], [DP.x + 10, 5, DP.z + 4.2], L.k); camera.lookAt(DP.x, 3.6, DP.z - 1); camera.fov = 46; sh(DP, 14); }, [[0, 'glass_creak', .5], [.6, 'hum_low', .4]]);
// 51 «Darunter ist ein Loch.»: cenital: el agujero, negro y profundo; las cabezas asomándose alrededor
shot(54.68, 'C', 'punch', L => { town(L); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(.25, 0, L.T);
  crowdAt(L, DP.x, DP.z, 8, 3.2, 4.2, 61, { mode: 'idle', expr: 'shock', face: V(DP.x, 0, DP.z), full: true, list: [dorn, ...EX.slice(0, 7)] });
  POST.push(() => [dorn, ...EX.slice(0, 7)].forEach((c, i) => { if (c.root.visible) { actuar(c, 0, [[0, { lean: .45, headX: .6, aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); } }));
  if (dorn.root) show(DORNB, DP.x + 1.6, 6, DP.z - .4, 0);
  cm([DP.x + .4, 15.5, DP.z + 6], [DP.x + .3, 13.5, DP.z + 5], L.k); camera.lookAt(DP.x, 0, DP.z); camera.fov = 50; badge('tag', 'EIN LOCH', W / 2, H * .14, clamp((L.T - 55.65) / .12), 1, .9); sh(DP, 12); }, [[0, 'wind', .4], [.9, 'creepy_ting', .4]]);
// 52 «Und aus diesem Loch kommt»: ¡FUUM! un haz de luz lila sale disparado hacia el cielo
shot(56.14, 'Z', 'punch', L => { town(L, { lila: lilaK(L.T) > .5 }); const g = easeOut(lilaK(L.T)); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(.3 + g * .7, 0, L.T); h.scale.set(1, 1 + g * 2.5, 1);
  const d = put(dorn, DP.x - 1.6, 0, DP.z - 2.4, .5); actuar(d, 0, [[0, { aRx: 2.4, aRz: .4, aRe: .3, aLx: .4, lean: -.1, headX: -.25 }]], { T: L.T }); attach(DORNB, d.aR.el, [0, -1.2, .3], [Math.PI, 0, 0], .7); cara(d, L.T, { expr: 'smug', mouth: 'smirk' });
  plaza(L, { cx: DP.x, cz: DP.z - 4, n: 12, r0: 5, r1: 18, seed: 63, mode: 'shock' }); sparks(V(DP.x, 1, DP.z), 56.2, L.T, 30, .9);
  cm([DP.x + 2, 3, DP.z + 16], [DP.x + 1.6, 4.6, DP.z + 14], L.k); camera.lookAt(DP.x, 7, DP.z); camera.fov = 52; sh(DP, 20); }, [[.05, 'magic_hit', .6], [.1, 'hum_low', .5]]);
// 53 «ein lila Leuchten.»: mi cara iluminada de lila desde abajo; boca abierta
shot(57.43, 'S', null, L => { town(L, { lila: 1 }); myChairScene(L); const c = inChair(ich, CP.x, CP.z, faceTo(CP, DP), L, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.05 }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  FILL.color.setRGB(.8, .35, 1); FILL.intensity = 70; const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(1, 0, L.T); h.scale.set(1, 3.5, 1);
  onFace(c, 5.2, -.2, .5, 40, L.k, 4.4); badge('big', 'LILA', W / 2, H * .15, clamp((L.T - 57.65) / .12), 1, .9); sh(CP, 12); }, [[0, 'shimmer', .5]]);
// 54 «Denn die Flaschen sind keine Stühle.»: plano general de la plaza teñida de lila: todos se agarran a sus botellas
shot(58.69, 'C', null, L => { town(L, { lila: 1 }); myChairScene(L); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(1, 0, L.T); h.scale.set(1, 3.5, 1);
  const d = put(dorn, DP.x - 1.6, 0, DP.z - 2.4, .5); actuar(d, 0, [[0, { aRx: 1.2, aRz: .2, aRe: .3, aLx: 1.6, aLz: .3, aLe: .2 }]], { T: L.T }); attach(DORNB, d.aR.el, [0, -1.2, .3], [Math.PI, 0, 0], .7); talk(d, L.T, 58.6, 60.4, 'angry');
  inChair(ich, CP.x, CP.z, faceTo(CP, DP), L, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9 }); cara(ich, L.T, { expr: 'shock' });
  plaza(L, { n: 26, r0: 6, r1: 30, seed: 65, mode: i => i % 3 ? 'ouch' : 'shock' });
  cm([24, 20, 34], [20, 18, 30], L.k); camera.lookAt(0, 2, -2); camera.fov = 50; sh(V(0, 0, 0), 40); }, [[0, 'hum_low', .45], [.3, 'murmur', .35]]);
// 55 «Sie sind Korken.»: la alcaldesa levanta la botella como un trofeo: «KORKEN!»
shot(60.59, 'I', 'punch', L => { town(L, { lila: 1 }); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(.45, 0, L.T); h.scale.set(1, 1.2, 1);
  const d = put(dorn, DP.x - 3.6, 0, DP.z - 1.4, .9); actuar(d, 0, [[0, { aRx: 2.9, aRz: .3, aRe: .1, aLx: .3, aLz: .3, headX: -.15 }]], { T: L.T }); attach(DORNB, d.aR.el, [0, -1.3, .3], [Math.PI, 0, 0], .7); talk(d, L.T, 60.5, 61.6, 'angry');
  plaza(L, { cx: DP.x, cz: DP.z - 6, n: 8, r0: 6, r1: 16, seed: 67, mode: 'shock' });
  onBody(d, 16, .2, .2, 46, L.k, 13.5, .1, 4.4); badge('gold', 'KORKEN!', W / 2, H * .15, clamp((L.T - 60.95) / .12), 1, 1.1); sh(DP, 16); }, [[.35, 'cork_pop', .6], [.4, 'impact', .5]]);
