// ===== Parte 1b: Kreidefest, Smaragd, el anciano, las llaves, la feria (47,1 – 89,9 s) =====
const RIDERS = () => [K[0], K[1], K[2], K[3], lina, K[4], K[5], K[6], K[7]];
// coloca a los 9 niños sobre el dragón (asientos 5, 7, …); scared = miedo
function riders(T, scared = 0, list = RIDERS(), dir = 0) { list.forEach((c, i) => { const sIdx = 5 + i * 2; if (sIdx >= DRA.N || !DRA.segs[sIdx].visible) { c.root.visible = false; return; } const p = DRA.seat(sIdx); put(c, p.x, p.y - .2, p.z, DRA.segs[sIdx].rotation.y + PI / 2); applyPose(c, RIDEP(T, i, scared)); cara(c, T, scared ? { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' } : { expr: 'happy', mouth: i % 3 ? 'open_smile' : 'laugh' }); }); }
const FEST_BG = (L, n = 140, mode = 'cheer') => crowdAt(L.T, grid(-56, -74, 46, -36, n, 11, 0).concat(grid(-58, 30, -40, 66, 30, 12, PI / 2)), mode);
// ---------- 25 · «Dann kam das Kreidefest:» : grúa sobre la pancarta KREIDEFEST, confeti ----------
shot(47.12, 'F', 'punch', L => { town(); FEST_BG(L, 160); const T = L.T; confetti(V(-6, 14, -70), L.t0, T, 40, 1.4);
  orb(L.k, V(-6, 17, -78), null, [44, 0, .05, 50], [36, .08, .12, 48]); sh(V(-6, 0, -70), 50); }, [[0, 'party_horn', .8], [.1, 'confetti', .7], [.4, 'cheer', .8], [1.0, 'kids_laugh', .5]]);
// ---------- 26 · «der Tag, an dem die ganze Stadt gleichzeitig» : vista de dron, todo el mundo dibuja ----------
shot(48.83, 'Z', null, L => { town(); const T = L.T; FEST_BG(L, 120, 'sway');
  bg(L, [[XT[0], -10, 6, .3, 'draw', .1], [XT[1], 4, 2, -.2, 'draw', .4], [XT[2], 14, -6, .5, 'draw', .7], [XT[3], -18, -10, 0, 'draw', .9], [K[0], -4, 14, .2, 'draw', .2], [K[4], 10, 16, -.4, 'draw', .5], [XT[6], 20, 8, -.6, 'draw', .3], [XT[5], -22, 18, .4, 'draw', .6], [K[2], 0, -12, 0, 'draw', .8], [lea, -8, -20, .2, 'draw', .4]]);
  cm([0, 70, 52], [-2, 0, 0], 0); orbit(V(-2, 0, 0), 76 - L.k * 8, L.k * .25, .95, 46); sh(V(0, 0, 0), 60); }, [[0, 'chalk', .7], [.4, 'chalk', .6], [.8, 'city_amb', .6], [1.2, 'chalk', .5]]);
// ---------- 27 · «den Marktplatz bemalt.» : grúa baja entre la gente que pinta ----------
shot(50.45, 'S', null, L => { town(); const T = L.T; FEST_BG(L, 90, 'sway');
  bg(L, [[XT[1], -3, 0, .2, 'draw', .4], [K[5], 3, -1, -.3, 'draw', .1], [XT[3], 0, -6, .1, 'draw', .7], [K[6], -6, -8, .5, 'draw', .3], [XT[4], 6, -9, -.3, 'draw', .9]]);
  dec(DC.mast1, -2, 2.6, .3); dec(DC.mast2, 3.4, 2.4, -.4);
  orb(L.k, V(0, 2.2, -2), null, [22, -.5, .45, 46], [18, .2, .35, 46]); sh(V(0, 0, -2), 24); }, [[0, 'chalk', .8], [.6, 'brush', .6], [1.1, 'chalk', .6]]);
// ---------- 28 · «Lea malte einen Drachen,» : Lea termina la cabeza del dragón en el suelo y se levanta del suelo ----------
shot(52.18, 'R', null, L => { town(); const T = L.T; FEST_BG(L, 90, 'cheer'); const up = easeOut(clamp((L.lt - .5) / 1.2));
  DRA.g.visible = true; DRA.update(T, (s, t) => { const p = dpath(10, .6 + up * 6, -12, 60, up * 1.5, 0)(s, t); p.y = Math.max(p.y, .6 + up * 6 * (1 - s * .8)); return p; });
  put(lea, 2, 0, -5, -.7); actuar(lea, L.lt, [[0, drawP(T, 9)], [.5, 'cheer']], { T }); chalkIn(lea, CHALK2); cara(lea, T, L.lt > .5 ? { eyes: 'happy', mouth: 'open_smile' } : { expr: 'determined', mouth: 'smile' }); puff(V(10, 1, -12), L.t0 + .5, T, 14, .9);
  bg(L, [[XT[2], -4, -10, .3, 'point'], [K[3], 6, -12, -.3, 'cheer']]);
  orb(L.k, V(4, 4.5, -8), null, [26, .55, .2, 46], [22, .35, .16, 46]); sh(V(4, 0, -10), 30); }, [[.1, 'chalk', .7], [.5, 'magic_hit', .9], [.7, 'growl', .7], [1.1, 'cheer', .6]]);
// ---------- 29 · «so lang wie ein ganzer Zug:» : el dragón pasa a lo largo, interminable, con los vagones de un tren dibujados al lado ----------
shot(53.91, 'W', null, L => { town(); const T = L.T; FEST_BG(L, 120, 'cheer');
  DRA.g.visible = true; DRA.update(T, dpath(40 - L.lt * 22, 14, -30, 60, 2, 0)); riders(T);
  badge('big', 'SO LANG WIE EIN ZUG', W / 2, H * .17, (L.lt - .2) * 2.2, 1, .75);
  orb(L.k, V(10 - L.lt * 10, 13, -30), null, [70, .02, .06, 46], [64, -.06, .08, 46]); sh(V(0, 0, -30), 60); }, [[0, 'whoosh_up', .6], [.2, 'growl', .6], [.6, 'kids_laugh', .6], [1.0, 'wind', .5]]);
// ---------- 30 · «Smaragd.» : cabeza del dragón de cerca, ruge ----------
shot(55.43, 'C', 'punch', L => { town(); const T = L.T; FEST_BG(L, 80, 'cheer');
  DRA.g.visible = true; DRA.update(T, dpath(0, 15, -20, 60, 1.5, 0));
  badge3('green', 'SMARAGD', DRA.head.position.clone().add(V(0, 6, 0)), (L.lt - .1) * 2.5, 1.1);
  orbit(DRA.head.position.clone().add(V(1, 0, 0)), 20 - L.k * 3, PI / 2 - .25, .1, 46); sh(V(0, 0, -20), 40); }, [[0, 'growl', 1], [.2, 'sparkle', .5]]);
// ---------- 31 · «Er schwebte über die Dächer,» : sobre los tejados del oeste ----------
shot(56.57, 'Z', null, L => { town(); const T = L.T;
  DRA.g.visible = true; DRA.update(T, dpath(-50, 34, 34 - L.lt * 16, 60, 3, PI / 2)); riders(T);
  orb(L.k, V(-52, 33, 26 - L.lt * 16), null, [62, 1.25, -.02, 46], [56, 1.1, 0, 46]); sh(V(-70, 0, 20), 60); }, [[0, 'wind', .7], [.4, 'whoosh_soft', .6], [1.0, 'birds', .4]]);
// ---------- 32 · «mit neun Kindern auf dem Rücken.» : los niños montados saludan ----------
shot(58.10, 'S', null, L => { town(); const T = L.T;
  DRA.g.visible = true; DRA.update(T, dpath(14, 22, -20, 60, 1.2, 0)); riders(T);
  badge('big', '9 KINDER', W / 2, H * .16, (L.lt - .15) * 2.5, 1, .9);
  const c = DRA.seat(13); orbit(c.clone().add(V(0, 1.5, 0)), 21 - L.k * 3, .2, .16, 46); sh(c.clone().setY(0), 50); }, [[0, 'kids_laugh', .8], [.3, 'ding_soft', .7], [.9, 'cheer', .5]]);
// ---------- 33 · «Ich setzte mich hin, um irgendwas zu malen –» ----------
shot(59.70, 'W', null, L => { town(); const T = L.T; FEST_BG(L, 70, 'sway');
  const sit = easeOut(clamp(L.lt / .6)); put(emil, 0, 0, 0, 0); applyPose(emil, mixPose({}, { ...SIT, aRx: .9, aRe: .6, headX: .4 }, sit)); chalkIn(emil, CHALK3); cara(emil, T, { expr: 'neutral', mouth: 'flat' }); show(KRU, 3, 0, -1.2, -.6, .85); KRU.userData.anim(T, 0);
  bg(L, [[XT[5], -6, -5, .5, 'draw', .3], [K[6], 6, -6, -.4, 'draw', .6]]);
  orb(L.k, V(.6, 2, 0), null, [15, -.3, .2, 44], [13, -.1, .2, 44]); sh(V(0, 0, 0), 16); }, [[0, 'cloth', .6], [.4, 'land', .5], [1.2, 'chalk', .4]]);
// ---------- 34 · «und plötzlich bewegte sich meine Hand ganz von allein.» : la mano va sola, brilla; Emil asustado (zoom lento) ----------
shot(61.97, 'C', 'slow', L => { town(); const T = L.T; grade.uniforms.sat.value = 1.3;
  put(emil, 0, 0, 0, 0); applyPose(emil, { ...SIT, lean: .25, aRx: 1.4 + Math.sin(T * 26) * .35, aRz: Math.cos(T * 21) * .5, aRe: .4 + Math.sin(T * 17) * .3, aLx: .8, aLz: .6, aLe: 1.2, headX: .2, ...shiver(T, .6) }); chalkIn(emil, CHALK3); cara(emil, T, { expr: 'shock', mouth: 'grimace' });
  const hpz = wpos(emil.aR.hand); puff(hpz.clone().setY(.4), L.t0, T, 6, .25, DUST, 2.9); SWEAT[0].visible = true; sweat(emil, T, 2);
  dec(DC.opa, 0, 5, 0, clamp(L.k * 1.2) * .7);
  orb(L.k, V(0, 1.8, 1.4), null, [14, .35, .35, 46], [8.5, .25, .35, 42], easeIn); sh(V(0, 0, 0), 16); }, [[0, 'chalk', 1], [.4, 'chalk', .9], [.9, 'chalk', .9], [1.5, 'creepy_ting', .6], [2.0, 'chalk', .8]]);
// ---------- 35 · «Als ich runterschaute, lag da ein alter Mann.» : picado: un anciano de tiza tumbado en el suelo ----------
shot(64.88, 'F', null, L => { town(); const T = L.T;
  dec(DC.opa, 0, 5, 0, .9); put(opa, 0, 1.0, 5.6, 0); opa.root.rotation.x = -PI / 2; opa.root.position.y = 1.0; cara(opa, T, { eyes: 'closed', mouth: 'smile' }); applyPose(opa, { aLz: .25, aRz: .25 });
  put(emil, 0, 0, -1.6, 0); applyPose(emil, { ...SIT, aLx: .4, aRx: .4, aLz: .5, aRz: .5, headX: .6, lean: .1 }); cara(emil, T, { expr: 'shock', mouth: 'o' });
  cam([0, 21 - L.k * 3, 9], [0, 0, 3.6], 46); sh(V(0, 0, 3), 16); }, [[0, 'sparkle', .7], [.5, 'gasp', .7]]);
// ---------- 36 · «Das beste Bild, das ich je gemalt habe.» : la gente se acerca a ver, «¡ohhh!» ----------
shot(67.32, 'Z', null, L => { town(); const T = L.T; FEST_BG(L, 60, 'sway');
  put(opa, 0, 1.0, 5.6, 0); opa.root.rotation.x = -PI / 2; cara(opa, T, { eyes: 'closed', mouth: 'smile' }); dec(DC.opa, 0, 5, 0, .9);
  put(emil, -3.6, 0, 2.6, .9); actuar(emil, L.lt, [[0, 'shock'], [.8, 'cheer']], { T }); cara(emil, T, L.lt > .8 ? { eyes: 'happy', mouth: 'open_smile' } : { expr: 'shock', mouth: 'o' });
  bg(L, [[XT[1], 4, 1, -.6, 'point'], [XT[2], 3.2, 9.5, -2.2, 'clap'], [K[3], -6, 1, 1.2, 'cheer'], [XT[6], 6, 6, -1.4, 'look']]);
  badge('gold', 'MEIN BESTES BILD!', W / 2, H * .18, (L.lt - .3) * 2, 1, .8);
  orb(L.k, V(0, 2.5, 4.5), null, [22, -.35, .5, 46], [19, -.15, .45, 46]); sh(V(0, 0, 4), 20); }, [[0, 'gasp', .6], [.4, 'aah', .7], [1.2, 'clap', .6]]);
// ---------- 37 · «Dabei kenne ich gar keinen alten Mann.» : Emil se rasca la cabeza con un «?» ----------
shot(69.66, 'C', null, L => { town(); const T = L.T; FEST_BG(L, 50, 'sway');
  put(emil, 0, 0, 0, .2); actuar(emil, L.lt, [[0, 'think']], { T }); talk(emil, T, L.t0, L.t1, 'confused'); put(opa, 4, 1.0, 1.5, .4); opa.root.rotation.x = -PI / 2; cara(opa, T, { eyes: 'closed', mouth: 'smile' });
  badge3('q', '?', hp(emil).add(V(0, 3, 0)), (L.lt - .2) * 2.5, 1);
  orb(L.k, V(.5, 2.8, 0), null, [12, .15, .1, 44], [11, -.05, .1, 44]); sh(V(0, 0, 0), 14); }, [[.2, 'pop', .6], [.5, 'hmm', .6]]);
// ---------- 38 · «Er setzte sich auf und klopfte sich den Kreidestaub von der Jacke –» ----------
shot(71.34, 'S', null, L => { town(); const T = L.T; FEST_BG(L, 60, 'still');
  const up = easeInOut(clamp(L.lt / .9)); put(opa, 0, lerp(1.0, 0, up), lerp(5.6, 3.2, up), 0); opa.root.rotation.x = lerp(-PI / 2, 0, up);
  actuar(opa, L.lt, [[0, { aLz: .25, aRz: .25 }], [1.0, { aRx: 1.0 + Math.sin(T * 14) * .4, aRz: -.8, aRe: 1.4, aLx: 1.0 + Math.cos(T * 14) * .4, aLz: -.8, aLe: 1.4, headX: .3 }]], { T }); cara(opa, T, L.lt > .9 ? { eyes: 'happy', mouth: 'smile' } : { eyes: 'half', mouth: 'flat' });
  puff(V(0, 1.5, 4.2), L.t0 + 1.0, T, 8, .4, DUST, 1.0);
  put(emil, -4.2, 0, 2.2, .9); applyPose(emil, GEST.recoil); cara(emil, T, { expr: 'shock', mouth: 'o' });
  orb(L.k, V(-1, 3, 3), null, [17, .35, .15, 44], [15, .15, .15, 44]); sh(V(0, 0, 3), 16); }, [[0, 'cloth', .7], [.6, 'stretch_creak', .6], [1.0, 'blow', .8], [1.6, 'cough', .4], [2.2, 'cloth', .6]]);
// ---------- 39 · «und jeder Schlüssel auf dem ganzen Fest flog direkt zu ihm.» : las llaves salen de bolsillos y puertas ----------
shot(74.45, 'W', null, L => { town(); const T = L.T; FEST_BG(L, 110, 'still');
  put(opa, 0, 0, 0, 0); actuar(opa, L.lt, [[0, 'shock']], { T }); cara(opa, T, { expr: 'shock', mouth: 'o' });
  keysFly(hp(opa).add(V(0, -2, 0)), L.t0 + .1, T + .0, 40);
  bg(L, [[XT[0], -8, -6, .5, 'point'], [XT[3], 9, -5, -.5, 'scared'], [K[1], -5, -12, .3, 'look'], [XT[4], 6, -14, -.2, 'point']]);
  orb(L.k, V(0, 4.5, 0), null, [26, 0, .2, 50], [22, .1, .18, 48]); sh(V(0, 0, 0), 40); }, [[0, 'keys', .9], [.3, 'whoosh_up', .6], [.7, 'keys', .8], [1.2, 'keys', .7]]);
// ---------- 40 · «…zu ihm. Klirr!» : se le pegan todas, ¡clinc! ----------
shot(76.35, 'C', 'punch', L => { town(); const T = L.T; FEST_BG(L, 60, 'still');
  put(opa, 0, 0, 0, 0); keysOn(); OPAKEYS.forEach((k, i) => k.visible = i < 6 + L.lt * 30); actuar(opa, L.lt, [[0, 'shock'], [.5, 'shrug']], { T }); cara(opa, T, { expr: 'shock', mouth: 'o' });
  keysFly(hp(opa).add(V(0, -2, 0)), L.t0 - .5, T, 30);
  badge('big', 'KLIRR!', W / 2, H * .2, L.lt * 3, 1, 1.1);
  orb(L.k, V(0, 3.6, 0), null, [15, .25, .1, 44], [13, .1, .1, 44]); sh(V(0, 0, 0), 16); }, [[0, 'metal_hit', .9], [.15, 'keys', 1], [.4, 'chain_rattle', .6]]);
// ---------- 41 · «Er lachte.» ----------
shot(77.57, 'F', null, L => { town(); const T = L.T; FEST_BG(L, 70, 'sway');
  put(opa, 0, 0, 0, -.15); keysOn(); actuar(opa, L.lt, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.2, aRe: 1.2, lean: -.12 + Math.sin(T * 12) * .05, headX: -.25 }]], { T }); laughF(opa, T);
  put(emil, 4, 0, 1.6, -.8); applyPose(emil, GEST.shrug); cara(emil, T, { expr: 'confused', mouth: 'smile' });
  orb(L.k, V(1.4, 3.6, .6), null, [14, -.25, .08, 44], [12, -.4, .08, 44]); sh(V(0, 0, 0), 16); }, [[0, 'laugh_old', .9], [.6, 'keys', .5]]);
// ---------- 42 · «Und für eine Sekunde sah ich ihn an einem anderen Ort:» : primer plano de Emil, destello, la imagen tiembla ----------
shot(79.17, 'F', 'slow', L => { town(); const T = L.T; grade.uniforms.sat.value = lerp(1.45, .7, L.k); grade.uniforms.sepia.value = L.k * .5;
  put(emil, 0, 0, 0, 0); actuar(emil, L.lt, [[0, { headX: -.1, aLx: .2, aRx: .2 }]], { T }); cara(emil, T, { eyes: L.lt > 1.6 ? 'wide' : 'normal', mouth: 'o' }); put(opa, -3.6, 0, -2.4, .6); keysOn(); laughF(opa, T);
  if (L.lt > 1.8) GL = .25 * Math.sin((L.lt - 1.8) * 20) ** 2;
  onFace(emil, 9, .2, .4, 40, L.k, 5); sh(V(0, 0, 0), 14); }, [[0, 'tension_str', .6], [1.0, 'heartbeat', .7], [2.0, 'creepy_ting', .6]]);
// ---------- 43 · «erstarrt auf einem Jahrmarkt, übersät mit Schlüsseln.» : feria en sepia, todo congelado; él inmóvil cubierto de llaves ----------
shot(81.75, 'G', 'slow', L => { use('JM'); sunset(); const T0 = 3.2; JM.update(T0); grade.uniforms.sepia.value = .75; grade.uniforms.sat.value = .9; grade.uniforms.vig.value = .7;
  put(opa, JMX, 0, 6, .2); keysOn(); applyPose(opa, { aLx: .6, aRx: 1.9, aRz: .2, aRe: .3, lean: -.05, headX: -.15 }); cara(opa, 0, { eyes: 'wide', mouth: 'o', noBlink: true });
  KEYS.forEach((k, i) => { if (i >= 24) return; const r = RNG(i * 3 + 7); show(k, JMX + (r() - .5) * 5, 1 + r() * 7, 6 + (r() - .5) * 2.5, r() * 6, 1); k.rotation.set(r() * 3, r() * 3, r() * 3); });
  bg({ T: T0, lt: 0 }, [[XT[1], JMX - 8, -4, .4, 'point'], [XT[4], JMX + 9, -2, -.5, 'look'], [K[6], JMX + 5, -10, -.1, 'idle']]);
  if (L.lt < .3) GL = .8 * (1 - L.lt / .3);
  orb(L.k, V(JMX, 4.2, 6), null, [30, .12, .14, 46], [17, .05, .1, 42], easeIn); sh(V(JMX, 0, 0), 40); }, [[0, 'record_scratch', .5], [.2, 'freeze', .8], [.5, 'music_box', .5], [1.5, 'keys', .4]]);
// ---------- 44 · «Ich wusste nicht, wer er war.» ----------
shot(84.94, 'F', null, L => { town(); const T = L.T; FEST_BG(L, 70, 'sway');
  put(emil, -1.6, 0, 0, .55); actuar(emil, L.lt, [[0, 'think']], { T }); talk(emil, T, L.t0, L.t1, 'confused');
  put(opa, 2.4, 0, -.6, -.6); keysOn(); actuar(opa, L.lt, [[0, { aLx: .3, aRx: .3, headZ: .2 }]], { T }); cara(opa, T, { expr: 'happy', mouth: 'smile' });
  orb(L.k, V(.4, 3.4, -.3), null, [16, .1, .1, 44], [15, -.1, .1, 44]); sh(V(0, 0, 0), 16); }, [[0, 'wind', .4], [.5, 'keys', .4]]);
// ---------- 45 · «Aber er umarmte mich, als hätte er ewig auf mich gewartet.» : abrazo cálido, alejamiento lento; al final, glitch ----------
shot(86.26, 'G', 'slow', L => { town('morning'); const T = L.T; FEST_BG(L, 80, 'still'); bloom.strength = .35;
  put(opa, .6, 0, 0, -PI / 2 + .25); keysOn(); applyPose(opa, { crouch: .25, lean: .25, aLx: 1.4, aRx: 1.4, aLz: -.6, aRz: -.6, aLe: 1.4, aRe: 1.4, headX: .25 }); cara(opa, T, { eyes: 'closed', mouth: 'smile' });
  put(emil, -1.6, 0, .2, PI / 2 - .25); applyPose(emil, { aLx: 1.2, aRx: 1.2, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5, headX: -.15 }); cara(emil, T, { eyes: L.lt > 1.2 ? 'closed' : 'wide', mouth: 'smile' });
  show(KRU, -4.2, 0, 1.8, .6, .8); KRU.userData.anim(T, 0);
  if (L.lt > L.d - .5) GL = (L.lt - (L.d - .5)) / .5;
  orb(L.k, V(-.4, 3.2, .2), null, [11, .02, .1, 42], [17, .1, .14, 46], easeOut); sh(V(0, 0, 0), 16); }, [[0, 'hug', .8], [.3, 'strings', .6], [1.6, 'keys', .3], [2.9, 'glitch', .9]]);
