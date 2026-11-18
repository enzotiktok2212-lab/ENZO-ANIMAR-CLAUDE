// ---------- b: Max, «Max Plumps», Opa y la cajita vacía, el robo, el entrenamiento de noche (31 – 66,7 s) ----------
const OPA_SIT = (T, ex = {}) => ({ ...SIT, aLx: .5, aRx: .5, aLe: .6, aRe: .6, aLz: -.1, aRz: -.1, ...ex });
const opaChair = (L, ex) => { const o = put(opa, OSX - 6, 2.75, -3, .5); actuar(o, L.lt, [[0, OPA_SIT(L.T, ex)]], { T: L.T }); return o; };
// farolas de la calle: se encienden fuerte cuando Max pasa cerca (z)
const flick = (zMax, T, all = false) => BULBS.forEach((b, i) => { const bz = b.position.z; const near = Math.abs(bz - zMax) < 7; b.material.emissiveIntensity = all ? 3 : near ? (Math.sin(T * 60 + i) > -.3 ? 4 : .2) : .6; });
const nightRoad = () => { town('night'); FILL.intensity = 30; };

// 22 «Ich bin Max.» golpe de zoom: Max en la plaza, saluda a cámara con su balón bajo el brazo; etiqueta MAX
shot(tw('Ich', 1), 'C', 'punch', L => { town(); const c = put(ich, -6, 0, -10, .05); actuar(c, L.lt, [[0, 'idle'], [.1, 'wave', { dur: .3 }]], { T: L.T, extra: { aLx: .9, aLe: 1.6, aLz: -.3 } }); talk(c, L.T, tw('Ich', 1), tw('Jeder'), 'happy');
  attach(BBALL, c.aL.hand, [0, -.6, .6], [0, 0, 0], .8); folk(-6, -10, 8, 8, 18, L.T, 21); badge('tag', 'MAX', W / 2, H * .2, (L.lt - .25) * 4, 1, 1.1);
  orbit(hpC(c, -.6), lerp(11, 9, L.k), .05, .08, 44); sh(V(-6, 0, -10), 30); }, [[0, 'pop', .5], [.3, 'whoosh', .3]]);
// 23 «Jeder hier husst,» alrededor de Max todos botan, regatean y tejen a toda velocidad (grúa)
shot(tw('Jeder', 1), 'W', null, L => { town(); const c = put(ich, -6, 0, -10, 0); actuar(c, L.lt, [[0, { headY: Math.sin(L.T * 3) * .5 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  const f = put(fuss, -12, 0, -14, .4); applyPose(f, runPoseL(L.T * 2.4)); POST.push(() => { const p = loc(f, 0, .55, 1.3); show(BALL, p.x, .55, p.z).rotation.x = L.T * 20; }); grin(f, L.T);
  const b = put(bask, 0, 0, -15, -.4); dribble(b, BBALL, L.T, { f: 7 }); grin(b, L.T); [K[0], K[4], XT[1], XT[6]].forEach((k, i) => { put(k, -6 + [-9, 8, -4, 5][i], 0, -10 + [3, 2, -9, -8][i], [.8, -.8, .3, -.3][i]); dribble(k, i % 2 ? BBALL2 : BBALL2, L.T + i * .3, { f: 6 }); grin(k, L.T + i); });
  cm([-6, 18, 14, -6, 3, -10, 48], [-1, 14, 10, -6, 3, -11, 48], L.k); sh(V(-6, 0, -10), 30); }, [[0, 'thud', .4], [.2, 'thud', .4], [.4, 'kick', .4], [.6, 'thud', .4], [.9, 'thud', .4]]);
// 24 «außer mir.» Max solo en medio, hombros caídos; los demás se alejan corriendo
shot(tw('außer', 1), 'C', null, L => { town(); const c = put(ich, -6, 0, -10, 0); actuar(c, L.lt, [[0, 'shrug'], [.4, 'slump', { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  [K[0], K[4], XT[6]].forEach((k, i) => { const z = -18 - L.lt * 8; put(k, -6 + (i - 1) * 6, 0, z, PI); applyPose(k, runPoseL(L.T * 2 + i)); });
  orbit(hpC(c, -.5), lerp(9, 7.5, L.k), .1, .06, 44); sh(V(-6, 0, -12), 30); }, [[0, 'sad_tone', .5], [.3, 'crowd_run', .3]]);
// 25 «Denn bei meinem ersten Huss» (recuerdo, sepia): Max pequeño, en la plaza llena, se dispone a hacer su primer HUSS; todos miran
shot(tw('Denn', 2), 'R', null, L => { town(); sepia(); const c = put(ich, -6, 0, -10, 0); c.root.scale.setScalar(.6); dribble(c, BBALL, L.T, { f: 2 }); cara(c, L.T, { expr: 'determined' });
  folk(-6, -10, 12, 7, 13, L.T, 25, { face: V(-6, 0, -10) }); orbit(V(-6, 2.6, -10), lerp(15, 12, L.k), .3 - L.k * .4, .2, 46); sh(V(-6, 0, -10), 30); }, [[0, 'film_roll', .4], [.3, 'thud', .3], [.8, 'thud', .3]]);
// 26 «bin ich über meine Schnürsenkel gefallen.» tropieza con los cordones y cae de bruces; el balón se aleja botando
shot(tw('bin', 2), 'C', 'punch', L => { town(); sepia(); const c = put(ich, -6, 0, -10, 0); c.root.scale.setScalar(.6); const f = clamp((L.lt - .35) / .35);
  applyPose(c, f <= 0 ? runPoseL(L.T * 2) : { lean: lerp(.3, 1.5, f), aLx: 2.6, aRx: 2.6, aLe: .2, aRe: .2, lLx: -.6, lRx: .5, crouch: f * .4 }); c.root.position.y = -f * .8; c.root.position.z = -10 + f * 1.2; cara(c, L.T, { expr: f > .2 ? 'shock' : 'determined' });
  show(BBALL, -6 + f * 3, .62 + Math.abs(Math.sin(L.lt * 6)) * 1.5 * (1 - f * .5), -8 + f * 4).rotation.x = L.T * 5; dust(V(-6, 0, -8.5), L.t0 + .7, L.T, 8, .6); badge('tag', 'SCHNÜRSENKEL', W / 2, H * .2, (L.lt - .2) * 4, 1, .8);
  orbit(V(-6, 1.8, -9), lerp(10, 8, L.k), .9, .12, 44); sh(V(-6, 0, -9), 20); }, [[0, 'steps', .4], [.6, 'thud', .7], [.8, 'gasp', .5], [1.0, 'thud', .3]]);
// 27 «Seitdem nennen mich alle „Max Plumps“.» los niños de la plaza le señalan y se ríen; letrero MAX PLUMPS
shot(tw('Seitdem', 1), 'W', null, L => { town(); sepia(); const c = put(ich, -6, 0, -10, .1); c.root.scale.setScalar(.6); actuar(c, L.lt, [[0, { ...GEST.cower, crouch: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  [K[2], K[6], XT[4], K[1]].forEach((k, i) => { put(k, -6 + [-5, -2, 2, 5][i], 0, -16 + (i % 2) * 1.5, [.5, .2, -.2, -.5][i]); k.root.scale.setScalar(.75); actuar(k, L.lt, [[0, i % 2 ? 'point_l' : 'point']], { T: L.T + i }); laughF(k, L.T + i); });
  badge('red', 'MAX PLUMPS', W / 2, H * .2, (tw('Max', 2) - L.T) * -4, 1, .95); orbit(V(-6, 2.6, -12.5), lerp(14, 12, L.k), .25, .12, 44); sh(V(-6, 0, -13), 30); }, [[0, 'kids_laugh', .6], [.9, 'laugh_deep', .3]]);
// 28 «Mama seufzte:» en casa: Mamá, con la mano en la frente, suspira mirando a Max (sentado en el sofá con su muñequera blanca)
shot(tw('Mama', 1), 'S', null, L => { use('OS'); inside(1, 40); const m = put(mama, OSX + 4, 0, -3.5, -.9); actuar(m, L.lt, [[0, 'idle'], [.1, 'facepalm', { dur: .4 }]], { T: L.T }); cara(m, L.T, { expr: 'sad', mouth: 'o' });
  const c = put(ich, OSX + 8, 2.4, -8.4, -.2); actuar(c, L.lt, [[0, { ...SIT, aLx: .4, aRx: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  orbit(hpC(m, -1.2), lerp(13, 11.5, L.k), .25, .1, 44); sh(V(OSX + 6, 0, -5), 30); }, [[0, 'sigh', .7]]);
// 29 «„Max …» Mamá se inclina hacia él y le habla con paciencia
shot(tw('Max', 3), 'C', null, L => { use('OS'); inside(1, 40); const m = put(mama, OSX + 5, 0, -4, -.5); actuar(m, L.lt, [[0, 'lean_in']], { T: L.T }); talk(m, L.T, tw('Max', 3), tw('sogar', 1), 'sad');
  const c = put(ich, OSX + 8, 2.4, -8.4, -.4); actuar(c, L.lt, [[0, { ...SIT, aLx: .4, aRx: .4, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  orbit(hpC(m, -.4), lerp(10, 8.5, L.k), -.9, .06, 44); sh(V(OSX + 6, 0, -6), 20); }, [[0, 'cloth', .4]]);
// 30 «sogar Opa husst, und der ist zweiundneunzig!» Mamá señala al Opa en su sillón; «92»
shot(tw('sogar', 1), 'W', null, L => { use('OS'); inside(1, 40); const o = opaChair(L); cara(o, L.T, { expr: 'neutral', eyes: 'down' }); const m = put(mama, OSX - 1, 0, -8.5, -1.9); actuar(m, L.lt, [[0, 'point']], { T: L.T }); talk(m, L.T, tw('sogar', 1), tw('Aber', 2), 'happy');
  badge('gold', '92', W / 2, H * .2, (tw('zweiundneunzig') - L.T) * -4, 1, 1.3); orbit(V(OSX - 3.5, 4.5, -5), lerp(19, 16, L.k), .35, .08, 44); sh(V(OSX - 3, 0, -4), 30); }, [[0, 'pop', .3], [1.4, 'pop', .5], [1.5, 'clock_tick', .3]]);
// 31 «Aber Opa husste schon lange nicht mehr.» el Opa, quieto en su sillón junto a la ventana; un balón viejo cubierto de polvo en el suelo
shot(tw('Aber', 2), 'S', null, L => { use('OS'); inside(.85, 30); grade.uniforms.sat.value = 1.1; const o = opaChair(L, { headX: .25 }); cara(o, L.T, { expr: 'sad' }); show(BBALL, OSX - 2.4, .62, 0).rotation.set(.3, 0, .2);
  orbit(hpC(o, -.8), lerp(13, 11, L.k), .5 + .35 - L.k * .3, .06, 44); sh(V(OSX - 6, 0, -3), 20); }, [[0, 'clock_tick', .5], [.6, 'sigh', .3]]);
// 32 «Er starrte nur auf ein leeres Kästchen.» primer plano: la cajita de madera abierta en sus manos, el terciopelo vacío
shot(tw('Er', 1), 'C', null, L => { use('OS'); inside(1, 40); const o = opaChair(L, { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.25, aRz: -.25, headX: .18 }); cara(o, L.T, { expr: 'sad', eyes: 'down' });
  POST.push(() => { const h = wpos(o.aL.hand).add(wpos(o.aR.hand)).multiplyScalar(.5); show(KAST, h.x, h.y - .3, h.z, .5, .7); KAST.userData.lid.rotation.x = -1.9; });
  POST.push(() => { const p = KAST.position.clone().lerp(hp(o), .5); orbit(p, lerp(8, 6.8, L.k), .5, .2, 42); }); sh(V(OSX - 6, 0, -3), 20); }, [[0, 'wood_creak', .5]]);
// 33 «„Da drin lag mal das allererste goldene Schweißband“, flüsterte er.» (zoom lento): en la cajita aparece, como un recuerdo, la muñequera dorada brillando
shot(tw('Da', 1), 'Z', 'slow', L => { use('OS'); inside(.9, 40); const o = opaChair(L, { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.25, aRz: -.25, headX: .18 }); talk(o, L.T, tw('Da', 1), tw('Vor'), 'sad');
  POST.push(() => { const h = wpos(o.aL.hand).add(wpos(o.aR.hand)).multiplyScalar(.5); show(KAST, h.x, h.y - .3, h.z, .5, .7); const b = show(BANDF, h.x, h.y + .25 + Math.sin(L.T * 2) * .05, h.z, .5, .5); b.rotation.x = -1.2; b.rotation.z = L.T * .5;
    GLOW.intensity = 25 + Math.sin(L.T * 6) * 5; GLOW.position.copy(h).add(V(0, 1.5, .8)); sparks(h.clone().add(V(0, .3, 0)), 0, (L.lt * 1.4) % .9, 8, .15); });
  POST.push(() => { const p = KAST.position.clone().lerp(hp(o), lerp(.5, .15, L.k)); orbit(p, lerp(9, 5, easeInOut(L.k)), .5, lerp(.2, .5, L.k), 42); }); sh(V(OSX - 6, 0, -3), 20); }, [[0, 'whisper', .5], [.3, 'sparkle', .5], [1.5, 'choir', .3]]);
// 34 «„Vor sechzig Jahren gewonnen.» (recuerdo, sepia): el Opa en el podio del estadio, alza la muñequera; «60 JAHRE»
shot(tw('Vor', 1), 'W', null, L => { stadium(); sepia(); POD.visible = true; PED.visible = false; stands(L.T, 'cheer'); const o = put(opa, STX, 4, 14, 0); actuar(o, L.lt, [[0, 'cheer']], { T: L.T }); grin(o, L.T);
  attach(BANDF, o.aR.hand, [0, -.3, 0], [PI / 2, 0, 0], .6); confetti(V(STX, 2, 14), L.t0 + .1, L.T, 40); badge('gold', '60 JAHRE', W / 2, H * .18, (L.lt - .3) * 4, 1, 1);
  orbit(V(STX, 7.5, 14), lerp(17, 14, L.k), -.1, .06, 44); sh(V(STX, 0, 14), 30); }, [[0, 'film_roll', .4], [.2, 'cheer', .5]]);
// 35 «Bis es mir jemand gestohlen hat.“» (recuerdo, de noche): una sombra con ojos rojos saca la muñequera de la cajita y desaparece
shot(tw('Bis', 1), 'C', 'punch', L => { use('OS'); inside(.25, 6); DARK = .35; sepia(); OS.TB.visible = true; show(KAST, OSX + 3, 3.0, 3, 0, 1); KAST.userData.lid.rotation.x = -1.9; const r = put(robo, OSX + 3 + L.lt * 2, 0, -1.5, .1); actuar(r, L.lt, [[0, 'reach'], [.5, { aRx: .6, aRe: 1.6 }, { dur: .3 }]], { T: L.T });
  r.root.traverse(m => { if (m.isMesh && m !== r.props.visor && m !== r.props.ant) m.visible = true; }); grade.uniforms.lift.value = -.05;
  if (L.lt < .5) show(BANDF, OSX + 3, 3.6, 3, 0, .4).rotation.x = -1.4; else attach(BANDF, r.aR.hand, [0, -.4, 0], [PI / 2, 0, 0], .4);
  orbit(V(OSX + 3, 5, 0), lerp(12, 10, L.k), .7, .15, 44); sh(V(OSX + 3, 0, 0), 20); }, [[0, 'creepy_ting', .5], [.4, 'zip', .4], [.8, 'whoosh', .4]]);
// 36 «Wer, das wollte er nicht sagen.» el Opa gira la cabeza hacia la ventana; signo de interrogación sobre Max
shot(tw('Wer', 1), 'R', null, L => { use('OS'); inside(1, 40); const o = opaChair(L, { headY: lerp(0, .9, clamp(L.lt / .6)) }); cara(o, L.T, { expr: 'sad' }); const c = put(ich, OSX - 1, 0, 3, -1.9); actuar(c, L.lt, [[0, 'think']], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  POST.push(() => { const h = hpC(c, 2.6); show(QM, h.x, h.y + Math.sin(L.T * 4) * .15, h.z).lookAt(camera.position); }); orbit(V(OSX - 3.5, 4, -.5), lerp(19, 17, L.k), .55, .08, 44); sh(V(OSX - 3, 0, 0), 20); }, [[0, 'whoosh_down', .3], [.4, 'tick', .4]]);
// 37 «Also trainierte ich jede Nacht,» de noche, la calle mayor vacía bajo la luna; Max bota y regatea solo entre las farolas
shot(tw('Also', 1), 'F', null, L => { nightRoad(); const z = 40 - L.lt * 3; const c = put(ich, 26, 0, z, PI); dribble(c, BBALL, L.T, { f: 2.6, run: true, rs: 1 }); effort(c, L.T); flick(z, L.T);
  orbit(V(26, 3.6, z), lerp(16, 13, L.k), PI + .35, .14, 46); sh(V(26, 0, z), 30); }, [[0, 'crickets', .5], [.3, 'thud', .4], [.7, 'thud', .4], [1.1, 'thud', .4]]);
// 38 «während die Stadt schlief.» grúa sobre el pueblo dormido: ventanas apagadas, la luna; Max es un punto bajo una farola
shot(tw('während', 1), 'S', null, L => { nightRoad(); const c = put(ich, 26, 0, 30, PI); dribble(c, BBALL, L.T, { f: 2.6 }); flick(30, L.T);
  cm([40, 60, -24, 26, 2, 30, 46], [38, 48, -14, 26, 2, 30, 44], L.k); sh(V(26, 0, 30), 40); }, [[0, 'snore_chorus', .3], [.5, 'owl', .4], [.9, 'thud', .3]]);
// 39 «Zuerst schaffte ich zwei Huss pro Sekunde.» Max bota despacio, contando; «2 / SEK»
shot(tw('Zuerst', 1), 'C', null, L => { nightRoad(); const c = put(ich, 26, 0, 30, PI + .2); dribble(c, BBALL, L.T, { f: 2 }); effort(c, L.T); flick(30, L.T); badge('gold', '2 / SEK', W / 2, H * .1, (tw('zwei') - L.T) * -4, 1, 1);
  orbit(hpC(c, -1), lerp(10, 8.5, L.k), PI - .25, .1, 44); sh(V(26, 0, 30), 20); }, [[0, 'thud', .5], [.5, 'thud', .5], [1.0, 'thud', .5], [1.5, 'thud', .5]]);
// 40 «Dann fünf.» más rápido, gotas de sudor; «5 / SEK»
shot(tw('Dann', 1), 'C', 'punch', L => { nightRoad(); const c = put(ich, 25, 0, 28, PI - .3); dribble(c, BBALL, L.T, { f: 5, trail: 3 }); effort(c, L.T); sweat(c, L.T); flick(28, L.T); badge('gold', '5 / SEK', W / 2, H * .1, L.lt * 4, 1, 1.05);
  orbit(hpC(c, -1), lerp(9, 8, L.k), PI + .4, .06, 44); sh(V(25, 0, 28), 20); }, [[0, 'thud', .5], [.2, 'thud', .5], [.4, 'thud', .5], [.6, 'thud', .5]]);
// 41 «Dann zehn.» la mano es un borrón; «10 / SEK»; las farolas parpadean
shot(tw('Dann', 2), 'C', 'punch', L => { nightRoad(); const c = put(ich, 26, 0, 26, PI); dribble(c, BBALL, L.T, { f: 10, trail: 6 }); effort(c, L.T); sweat(c, L.T, 3); flick(26, L.T); badge('red', '10 / SEK', W / 2, H * .1, L.lt * 4, 1, 1.1);
  orbit(hpC(c, -1.2), lerp(8.5, 7.5, L.k), PI - .1, .02, 42); sh(V(26, 0, 26), 20); }, [[0, 'thud', .6], [.1, 'thud', .5], [.2, 'thud', .5], [.3, 'thud', .5], [.4, 'thud', .5]]);
// 42 HUSS ×3: Max arranca por la calle a toda velocidad, estela blanca
shot(th(7, 1), 'C', 'punch', L => { nightRoad(); const z = 40 - L.lt * 16; const c = put(ich, 26, 0, z, PI); dribble(c, BBALL, L.T, { f: 8, run: true, rs: 2.4, trail: 7 }); effort(c, L.T); flick(z, L.T); hussPop(7, L.T);
  orbit(V(26, 3, z), 11, PI - .6 + L.k * .3, .05, 46); sh(V(26, 0, z), 30); }, [[0, 'whoosh', .6], [.2, 'thud', .5], [.4, 'thud', .5]]);
// 43 HUSS ×3: giro de 360° con el balón alrededor del cuerpo, chispas en el asfalto
shot(th(7, 4), 'C', 'punch', L => { nightRoad(); const c = put(ich, 26, 0, 22, PI + L.lt * 9); dribble(c, BBALL, L.T, { f: 9, trail: 6, extra: { crouch: .4 } }); effort(c, L.T); flick(22, L.T); sparks(V(26, .3, 22), L.t0 + .1, L.T, 10, .5); hussPop(7, L.T);
  orbit(V(26, 2.6, 22), lerp(9, 8, L.k), PI + .3, .15, 46); sh(V(26, 0, 22), 20); }, [[0, 'whoosh', .5], [.2, 'sparks', .5], [.4, 'thud', .5]]);
// 44 «Komisch war nur:» Max se para en seco, jadeando; mira hacia arriba, a la farola
shot(tw('Komisch', 1), 'W', null, L => { nightRoad(); const c = put(ich, 26, 0, 22, PI - .4); actuar(c, L.lt, [[0, { lean: .3, aLx: .4, aRx: .4 }], [.4, { headX: -.45, headY: -.4 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' }); show(BBALL, 26.8, .62, 20.6);
  flick(22, L.T, true); orbit(hpC(c, -.2), lerp(10, 8, L.k), PI - 1.2, -.1, 46); sh(V(26, 0, 22), 20); }, [[0, 'breath', .5], [.6, 'hum', .4]]);
// 45 «Jedes Mal, wenn ich vorbeihusste, flackerten die Straßenlaternen.» travelling: Max pasa y cada farola se enciende de golpe a su paso
shot(tw('Jedes', 1), 'S', null, L => { nightRoad(); const z = 70 - L.lt * 13; const c = put(ich, 25, 0, z, PI); dribble(c, BBALL, L.T, { f: 7, run: true, rs: 2, trail: 4 }); effort(c, L.T);
  BULBS.forEach((b, i) => { const passed = b.position.z > z; b.material.emissiveIntensity = passed ? (Math.sin(L.T * 50 + i) > 0 ? 5 : 1) : .3; }); GLOW.intensity = 40; GLOW.position.set(26, 10, z + 4);
  cm([30, 6, z - 18, 25, 3, z, 46], [30, 6, z - 16, 25, 3, z, 46], L.k); sh(V(25, 0, z), 30); }, [[0, 'run_cobble', .4], [.4, 'switch', .4], [.9, 'switch', .4], [1.4, 'switch', .4], [1.9, 'hum', .3]]);
