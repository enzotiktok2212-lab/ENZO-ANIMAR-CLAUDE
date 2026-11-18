// ---------- d: el duelo (HUSS / Schneller!), las lámparas, el robot sin sudor, la muñequera vuelve al Opa, victoria, sofá, carta, final en bucle (106,8 – 148,5 s) ----------
const duel = (L, g, o = {}) => { stadium(); stands(L.T * 1.4, 'cheer'); const ang = L.T * (o.spin ?? 3); const R0 = o.r ?? 4;
  const c = put(ich, STX + Math.cos(ang) * R0, 0, Math.sin(ang) * R0, -ang); dribble(c, BBALL, L.T, { f: o.f ?? 8, run: true, rs: 2.4, trail: 7 }); effort(c, L.T); sweat(c, L.T, 3);
  const r = put(robo, STX, 0, 0, PI / 2 - ang + PI); actuar(r, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLz: .4, aRz: .4, crouch: .3, lLx: .3, lRx: .3, lLk: .4, lRk: .4 }]], { T: L.T }); cara(r, L.T, { expr: 'angry' });
  bText([['MAX', .28, 120, '#3affd0'], ['VS', .52, 60, '#ffffff'], ['HUSS-O-MAT', .76, 80, '#ff5a3a']]); if (g) hussPop(g, L.T); return { c, r, ang }; };
// cámara por fuera del círculo, detrás de Max: Max delante, el robot detrás
const duelCam = (ang, d = 11, pitch = .18, lag = .15, R0 = 4) => { const a = ang - lag; orbit(V(STX + Math.cos(ang) * R0 * .8, 3.6, Math.sin(ang) * R0 * .8), d, Math.atan2(Math.cos(a), Math.sin(a)) + .35, pitch, 46); };
const lampsOn = k => HALLAMPS.forEach((b, i) => b.material.emissiveIntensity = k * 12 > i ? 6 : 0);

// 70 HUSS ×3: empieza el duelo: Max arranca botando alrededor del robot, con estela
shot(th(9), 'C', 'punch', L => { const { ang } = duel(L, 9, { spin: 2.4 }); duelCam(ang, lerp(13, 11, L.k)); sh(V(STX, 0, 0), 20); }, [[0, 'whistle', .6], [.15, 'whoosh', .5], [.35, 'thud', .5]]);
// 71 «Schneller!» la gente de la barandilla grita con los puños en alto (Mamá, el futbolista, el de baloncesto)
shot(tw('Schneller', 1), 'C', null, L => { stadium(); stands(L.T * 1.5, 'cheer'); [mama, fuss, bask].forEach((k, i) => { put(k, STX - 19.5, 0, -2 + i * 3.4, PI / 2 + (i - 1) * .15); actuar(k, L.lt, [[0, 'fists'], [.1, 'cheer', { dur: .25 }]], { T: L.T + i }); talk(k, L.T + i * .03, L.t0, L.t1, 'shout'); });
  orbit(V(STX - 19.5, 4.5, 1.4), lerp(11, 9.5, L.k), PI / 2 + .15, .05, 46); sh(V(STX - 19, 0, 1), 20); }, [[0, 'cheer', .7], [.2, 'shout_m', .4]]);
// 72 HUSS ×2: más rápido: Max es una estela turquesa; el robot gira la cabeza sin seguirle
shot(th(10), 'C', 'punch', L => { const { r, ang } = duel(L, 10, { spin: 5, f: 11 }); r.root.rotation.y = L.T * 2; duelCam(ang, 11, .35, .2); sh(V(STX, 0, 0), 20); }, [[0, 'whoosh', .6], [.25, 'whoosh', .5]]);
// 73 «Schneller!» el Opa, en la barandilla, grita con todas sus fuerzas
shot(tw('Schneller', 2), 'C', 'punch', L => { stadium(); stands(L.T * 1.5, 'cheer'); const o = put(opa, STX - 19.5, 0, 1, PI / 2 + .1); actuar(o, L.lt, [[0, 'fists']], { T: L.T }); talk(o, L.T, L.t0, L.t1, 'shout');
  orbit(hpC(o, -.5), lerp(8.5, 7.5, L.k), PI / 2 + .3, .04, 44); sh(V(STX - 19, 0, 1), 20); }, [[0, 'shout_m', .6], [.1, 'cheer', .5]]);
// 74 HUSS ×3: Max da vueltas tan rápido que saltan chispas del suelo; el robot se tambalea
shot(th(11), 'C', 'punch', L => { const { r } = duel(L, 11, { spin: 8, f: 13, r: 3.6 }); r.root.rotation.z = Math.sin(L.T * 14) * .08; sparks(V(STX, .3, 0), L.t0 + .05, L.T, 14, 1); sparks(V(STX + 2, .3, 2), L.t0 + .4, L.T, 10, .8);
  orbit(V(STX, 2.5, 0), lerp(15, 13, L.k), .6, .75, 46); sh(V(STX, 0, 0), 20); }, [[0, 'sparks', .6], [.3, 'machine_shake', .5], [.5, 'whoosh', .5]]);
// 75 «Ich war so schnell, dass jede Lampe in der Halle aufleuchtete.» contrapicado: los focos del estadio se encienden uno tras otro
shot(tw('Ich', 2), 'W', null, L => { stadium(); stands(L.T * 1.5, 'cheer'); lampsOn(easeIn(L.k) * 1.05); const { c } = duel(L, 0, { spin: 6, f: 12 }); GLOW.intensity = 60 * L.k; GLOW.position.set(STX, 20, 0); bloom.strength = .5;
  cm([STX + 8, 3, 12, STX - 30, 19, 2, 54], [STX + 6, 3, 10, STX - 30, 21, -2, 54], L.k); sh(V(STX, 0, 0), 30); }, [[0, 'power_on', .4], [.6, 'switch', .5], [1.2, 'switch', .5], [1.8, 'switch', .5], [2.4, 'power_on', .5]]);
// 76 «Genau wie die Laternen.» recuerdo rápido: la calle de noche, todas las farolas encendidas a la vez
shot(tw('Genau', 1), 'F', null, L => { town('night'); FILL.intensity = 30; BULBS.forEach(b => b.material.emissiveIntensity = 5); const c = put(ich, 26, 0, 30, PI); dribble(c, BBALL, L.T, { f: 8 }); grade.uniforms.sepia.value = .35;
  cm([26, 7, 6, 26, 6, 50, 50], [26, 8, 10, 26, 7, 54, 50], L.k); sh(V(26, 0, 30), 30); }, [[0, 'switch', .6], [.1, 'hum', .4]]);
// 77 «Plötzlich qualmte der Roboter.» el robot se queda quieto; humo negro le sale de la cabeza; el visor parpadea
shot(tw('Plötzlich', 1), 'Z', null, L => { stadium(); bText([['MAX', .28, 120, '#3affd0'], ['VS', .52, 60, '#ffffff'], ['HUSS-O-MAT', .76, 80, '#ff5a3a']]); stands(L.T, 'still', true); const r = put(robo, STX, 0, 0, .3); actuar(r, L.lt, [[0, 'shock']], { T: L.T, extra: { headZ: Math.sin(L.T * 30) * .05 } }); cara(r, L.T, { expr: 'shock' }); r.props.visor.material.emissiveIntensity = Math.sin(L.T * 40) > 0 ? 3 : .2;
  POST.push(() => smoke(hpC(r, 1.2), L.T, .7)); orbit(hpC(r, -.2), lerp(15, 13, L.k), .3, .08, 44); sh(V(STX, 0, 0), 20); }, [[0, 'steam', .6], [.3, 'glitch', .5], [.9, 'sparks', .4]]);
// 78 «Denn Roboter können nicht schwitzen.» Max, empapado en sudor, junto al robot seco y humeante
shot(tw('Denn', 4), 'W', null, L => { stadium(); bText([['MAX', .28, 120, '#3affd0'], ['VS', .52, 60, '#ffffff'], ['HUSS-O-MAT', .76, 80, '#ff5a3a']]); stands(L.T, 'still', true); const r = put(robo, STX + 2.5, 0, 0, -.4); actuar(r, L.lt, [[0, 'shock']], { T: L.T }); cara(r, L.T, { expr: 'shock' }); POST.push(() => smoke(hpC(r, 1.5), L.T, .7));
  const c = put(ich, STX - 2.5, 0, 3, .4); actuar(c, L.lt, [[0, { lean: .3, aLx: .4, aRx: .4, crouch: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'open_smile' }); sweat(c, L.T, 3); show(BBALL, STX - 1.2, .62, 4.2);
  badge('tag', 'KEIN SCHWEISS', W / 2, H * .13, (L.lt - .6) * 4, 1, .9); orbit(V(STX, 3.8, 0), lerp(15, 13, L.k), .05, .08, 44); sh(V(STX, 0, 0), 20); }, [[0, 'steam', .5], [.6, 'drip', .5], [1.0, 'drip', .4]]);
// 79 «Und ohne Schweiß kein HUSS.» primerísimo plano: una gota de sudor cae despacio de la barbilla de Max
shot(tw('Und', 5), 'C', null, L => { stadium(); bText([['MAX', .28, 120, '#3affd0'], ['VS', .52, 60, '#ffffff'], ['HUSS-O-MAT', .76, 80, '#ff5a3a']]); stands(L.T, 'still', true); const c = put(ich, STX - 2.5, 0, .5, .4); actuar(c, L.lt, [[0, { lean: .3, aLx: .4, aRx: .4 }]], { T: L.T }); effort(c, L.T);
  POST.push(() => { const h = hp(c); const d = SWEAT[0]; d.visible = true; d.scale.setScalar(1.15); d.position.copy(h).add(V(Math.sin(.4) * .7 + .45, -.15 - easeIn(L.k) * 2.6, Math.cos(.4) * .7)); orbit(h.clone().add(V(0, -.6, 0)), lerp(5.5, 4.5, L.k), .4, .02, 40); }); sh(V(STX, 0, 0), 20); }, [[0, 'heartbeat', .4], [1.2, 'drip', .7]]);
// 80 «Mit einem lauten Klonk kippte er um.» KLONK: el robot cae de espaldas y salen volando tornillos y piezas
shot(tw('Mit', 1), 'C', 'punch', L => { stadium(); bText([['MAX', .28, 120, '#3affd0'], ['VS', .52, 60, '#ffffff'], ['HUSS-O-MAT', .76, 80, '#ff5a3a']]); stands(L.T * 1.4, 'cheer'); const f = clamp((L.lt - .45) / .5); const r = put(robo, STX, 0, 0, .3); applyPose(r, { lean: -f * 1.5, aLx: 2.4 * f, aRx: 2.6 * f, lLx: f * .5 }); r.root.position.y = -f * 2; r.root.position.z = -f * 3; cara(r, L.T, { expr: 'shock', eyes: f > .7 ? 'closed' : 'wide' }); r.props.visor.material.emissiveIntensity = f > .8 ? 0 : 2;
  PARTS.forEach((p, i) => { const t = L.lt - .9; if (t < 0) return; const rr = RNG(i * 7 + 2); const a = rr() * 6.28, v = 3 + rr() * 4; show(p, STX + Math.cos(a) * v * t, Math.max(.3, 2 + (6 + rr() * 4) * t - 12 * t * t), -3 + Math.sin(a) * v * t).rotation.set(t * 8, t * 6, 0); });
  dust(V(STX, 0, -4), L.t0 + .95, L.T, 10, .7); badge('red', 'KLONK!', W / 2, H * .13, (L.lt - .95) * 4, 1, 1.2); orbit(V(STX, 3.5, -1.5), lerp(17, 15, L.k), .35, .12, 46); sh(V(STX, 0, -2), 30); }, [[0, 'machine_shake', .5], [.95, 'slam', .8], [1.0, 'metal_rip', .5], [1.2, 'rubble', .4]]);
// 81 «Und Opas goldenes Schweißband rollte direkt vor seine Füße.» (zoom lento): la muñequera sale de la muñeca del robot y rueda por la cancha hasta los zapatos del Opa
shot(tw('Und', 6), 'Z', 'slow', L => { stadium(); bText([['MAX', .28, 120, '#3affd0'], ['VS', .52, 60, '#ffffff'], ['HUSS-O-MAT', .76, 80, '#ff5a3a']]); stands(L.T, 'still', true); const r = put(robo, STX, -2, -3, .3); r.root.rotation.x = -1.4; r.props.gold.visible = false; r.props.visor.material.emissiveIntensity = 0;
  const o = put(opa, STX - 19.5, 0, 1, PI / 2); actuar(o, L.lt, [[0, { headX: .45 }]], { T: L.T }); cara(o, L.T, { expr: 'shock', eyes: 'down' }); const k = easeOut(clamp(L.k * 1.15)); const x = lerp(STX - 1, STX - 17.6, k);
  const B = show(BANDF, x, .55, lerp(-2, 1, k), 0, .55); B.rotation.set(0, PI / 2, -L.T * 6 * (1 - k)); trailOn(V(x + .6, .5, B.position.z), L.T, 3);
  cm([STX - 10, 2, 7, x, .8, 0, 46], [STX - 14, 2.6, 6, STX - 18.4, 1.5, 1, 44], L.k); sh(V(STX - 12, 0, 0), 30); }, [[0, 'coin_flip', .5], [.4, 'wheels', .3], [1.6, 'ding_soft', .6]]);
// 82 «Opa stand auf, zum ersten Mal seit Jahren.» el Opa se agacha, recoge la muñequera y se yergue del todo; se la pone
shot(tw('Opa', 4), 'W', null, L => { stadium(); stands(L.T, 'still', true); const o = put(opa, STX - 18, 0, 1, PI / 2 + .3); const k = clamp(L.lt / .9);
  actuar(o, L.lt, [[0, { crouch: .6, lean: .6, aRx: 1.2, aRe: .3, lLk: .8, lRk: .8, lLx: .5, lRx: .5 }], [.9, { aLx: 1.2, aLe: 1.4, aRx: 1.1, aRe: 1.6, aRz: -.3 }, { dur: .6 }]], { T: L.T }); cara(o, L.T, { expr: k < 1 ? 'determined' : 'happy' });
  if (L.lt < .9) attach(BANDF, o.aR.hand, [0, -.4, 0], [PI / 2, 0, 0], .5); else attach(BANDF, o.aL.hand, [0, .3, 0], [PI / 2, 0, 0], .5);
  orbit(hpC(o, -1), lerp(12, 10, L.k), PI / 2 + .5, .06, 44); sh(V(STX - 18, 0, 1), 20); }, [[0, 'cloth', .4], [.5, 'back_crack', .5], [1.3, 'gasp', .4], [1.8, 'sparkle', .4]]);
// 83 «Und er husste.» un único bote del balón, firme y perfecto; el suelo retumba
shot(tw('Und', 7), 'C', 'punch', L => { stadium(); stands(L.T, 'still', true); const o = put(opa, STX - 18, 0, 1, PI / 2 + .3); dribble(o, BBALL, L.T - L.t0 + .25, { f: 1.4 }); cara(o, L.T, { expr: 'determined' }); attach(BANDF, o.aL.hand, [0, .3, 0], [PI / 2, 0, 0], .5);
  dust(V(STX - 17, 0, 2), L.t0 + .35, L.T, 8, .6); orbit(V(STX - 17.5, 2.8, 1), lerp(9, 8, L.k), PI / 2 + .9, .12, 44); sh(V(STX - 18, 0, 1), 20); }, [[.3, 'thud', .9], [.35, 'impact', .4]]);
// 84 «Nur ein einziges Mal.» el Opa sonríe con lágrimas en los ojos; «1×»
shot(tw('Nur', 1), 'C', null, L => { stadium(); stands(L.T, 'still', true); const o = put(opa, STX - 18, 0, 1, PI / 2 + .3); actuar(o, L.lt, [[0, { aLx: .9, aLe: 1.3 }]], { T: L.T }); cara(o, L.T, { expr: 'happy' }); tears(o, L.T); attach(BANDF, o.aL.hand, [0, .3, 0], [PI / 2, 0, 0], .5);
  badge('gold', '1×', W / 2, H * .13, (tw('einziges') - L.T) * -4, 1, 1.3); orbit(hpC(o, -.5), lerp(8, 7, L.k), PI / 2 + .3, .04, 42); sh(V(STX - 18, 0, 1), 20); }, [[0, 'piano_note', .5], [.8, 'sniff', .4]]);
// 85 «Aber die ganze Halle stand mit ihm auf.» toda la grada en pie, aplaudiendo; confeti; Opa en primer término de espaldas a la cámara mirando a la grada
shot(tw('Aber', 3), 'Z', null, L => { stadium(); stands(L.T * 1.5, 'cheer'); railFolk(L.T, 'cheer'); confRain(V(STX - 24, 4, 0), L.T, 60, 20, 50, 20); const o = put(opa, STX - 14, 0, 1, -PI / 2 + .3); actuar(o, L.lt, [[0, 'cheer']], { T: L.T }); attach(BANDF, o.aL.hand, [0, .3, 0], [PI / 2, 0, 0], .5);
  cm([STX - 2, 5, 8, STX - 30, 7, -2, 50], [STX - 4, 9, 10, STX - 30, 8, -4, 50], L.k); sh(V(STX - 22, 0, 0), 40); }, [[0, 'cheer', .8], [.4, 'confetti', .5], [1.0, 'firework', .4]]);
// 86 «Ich gewann das neue goldene Schweißband» el podio: Max en el 1 alza la muñequera nueva; Oma y el Opa a los lados
shot(tw('Ich', 3), 'W', null, L => { stadium(); stands(L.T * 1.4, 'cheer'); POD.visible = true; PED.visible = false; bText([['MAX', .3, 130, '#ffd23f'], ['HUSS-WELTMEISTER', .7, 70, '#ffffff']]); const c = put(ich, STX, 4, 14, 0); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); grin(c, L.T); attach(BANDF, c.aR.hand, [0, -.3, 0], [PI / 2, 0, 0], .7); sparks(wpos(c.aR.hand), 0, (L.lt * 1.2) % .9, 8, .4);
  const o = put(opa, STX - 4.4, 2.6, 14, .2); actuar(o, L.lt, [[0, 'wave']], { T: L.T }); grin(o, L.T); const m = put(oma, STX + 4.4, 1.8, 14, -.2); actuar(m, L.lt, [[0, 'cheer']], { T: L.T + 1 }); grin(m, L.T + 1);
  confetti(V(STX, 6, 14), L.t0 + .2, L.T, 60); orbit(V(STX, 6.5, 14), lerp(23, 20, L.k), -.05, .08, 46); sh(V(STX, 0, 14), 30); }, [[0, 'cheer', .7], [.3, 'firework', .5], [.6, 'confetti', .4]]);
// 87 «und einen ganzen Tag frei.» el marcador: «MAX: 1 TAG FREI»; Max se tumba en el podio, brazos detrás de la cabeza
shot(tw('und', 4), 'S', null, L => { stadium(); stands(L.T, 'sway'); POD.visible = true; PED.visible = false; bText([['MAX', .25, 110, '#ffd23f'], ['1 TAG FREI', .66, 130, '#ffffff']]); const c = put(ich, STX, 4, 14, 0); actuar(c, L.lt, [[0, { aLx: 2.8, aRx: 2.8, aLe: 2.2, aRe: 2.2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); ich.props.gold.visible = true;
  badge('green', '1 TAG FREI', W / 2, H * .13, (L.lt - .3) * 4, 1, 1); orbit(V(STX, 7, 14), lerp(13, 11, L.k), .3, .1, 44); sh(V(STX, 0, 14), 20); }, [[0, 'pop', .5], [.4, 'sip', .3]]);
// 88 «Ich hielt es genau vier Sekunden auf dem Sofa aus.» en casa, en el sofá, la muñequera dorada puesta; el reloj cuenta 1, 2, 3, 4; el pie no para quieto
shot(tw('Ich', 4), 'C', null, L => { use('OS'); inside(1, 40); const c = put(ich, OSX + 8, 2.4, -8.4, 0); ich.props.gold.visible = true; actuar(c, L.lt, [[0, { ...SIT, aLx: .4, aRx: .4, lLx: 1.5 + Math.sin(L.T * 22) * .15, headY: Math.sin(L.T * 3) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); show(BBALL, OSX + 11, .62, -5.6);
  const n = Math.min(4, Math.floor(L.lt / ((L.t1 - L.t0) / 4)) + 1); badge('gold', n + ' SEK', W / 2, H * .13, ((L.lt * 4) % 1) * 4, 1, 1.2); orbit(V(OSX + 8.5, 4.6, -8.4), lerp(13, 11, L.k), .15, .08, 44); sh(V(OSX + 8, 0, -7), 20); }, [[0, 'tick', .5], [.65, 'tick', .5], [1.3, 'tick', .5], [1.95, 'tick', .6]]);
// 89 HUSS ×3: salta del sofá y bota por el salón; la lámpara tiembla
shot(th(12), 'C', 'punch', L => { use('OS'); inside(1, 40); const c = put(ich, OSX + 7, 0, -3, .3); ich.props.gold.visible = true; dribble(c, BBALL, L.T, { f: 9, trail: 6 }); effort(c, L.T); hussPop(12, L.T);
  orbit(hpC(c, -1), lerp(11, 9.5, L.k), .45, .08, 44); sh(V(OSX + 7, 0, -3), 20); }, [[0, 'jump', .4], [.15, 'thud', .6], [.35, 'thud', .6], [.55, 'thud', .6], [.6, 'glass_rattle', .3]]);
// 90 «Denn gestern kam ein Brief aus der Großstadt.» Mamá le da a Max un sobre con sello rojo; la cara de Max cambia
shot(tw('Denn', 5), 'W', null, L => { use('OS'); inside(1, 40); const m = put(mama, OSX - 3.4, 0, 7, -1.4); actuar(m, L.lt, [[0, { aRx: 1.4, aRe: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'worried' }); const c = put(ich, OSX - 8, 0, 7, 1.4); ich.props.gold.visible = true;
  actuar(c, L.lt, [[0, 'idle'], [.6, { aRx: 1.3, aRe: .5 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > 1 ? 'shock' : 'neutral' }); POST.push(() => { const h = wpos(L.lt < .8 ? m.aR.hand : c.aR.hand); const b = show(BRIEF, h.x, h.y + .4, h.z, 0, .9); b.lookAt(camera.position); });
  orbit(V(OSX - 6.2, 4.3, 7), lerp(14, 12, L.k), .05, .06, 44); sh(V(OSX - 6, 0, 7), 20); }, [[0, 'door_bell', .4], [.5, 'paper', .6], [1.4, 'gasp', .4]]);
// 91 «Absender: HUSS-O-MAT 10.000.» (zoom lento): la carta en primer plano; detrás, en la ventana, el brillo de dos ojos rojos enormes
shot(tw('Absender', 1), 'Z', 'slow', L => { use('OS'); inside(.85, 30); const c = put(ich, OSX - 8, 0, 7, 1.4); ich.props.gold.visible = true; actuar(c, L.lt, [[0, { aRx: 1.3, aRe: .5, aLx: 1.2, aLe: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'shock' });
  POST.push(() => { const h = wpos(c.aR.hand); const b = show(BRIEF, h.x + .3, h.y + .5, h.z, 0, 1.0); b.lookAt(camera.position); orbit(b.position.clone(), lerp(6, 3.4, easeInOut(L.k)), 1.4, .05, 40); });
  badge('red', '10.000', W / 2, H * .13, (tw('10000') - L.T) * -4, 1, 1.2); sh(V(OSX - 7, 0, 7), 20); }, [[0, 'creepy_ting', .5], [.5, 'machine_hum', .4]]);
// 92 «Und wer einmal mit dem Hussen anfängt …» de nuevo la calle mayor, como al principio: ahora también el Opa (con su muñequera) y Max corren delante
shot(tw('Und', 8), 'W', null, L => { town(); const z = 58 - 5 * L.lt; const c = put(ich, 24.5, 0, z, PI); ich.props.gold.visible = true; dribble(c, BBALL, L.T, { run: true, f: 3.2, rs: 1.4 }); grin(c, L.T);
  const o = put(opa, 28, 0, z + 1, PI); dribble(o, BBALL2, L.T + .2, { run: true, f: 3, rs: 1.3 }); grin(o, L.T); attach(BANDF, o.aL.hand, [0, .3, 0], [PI / 2, 0, 0], .45);
  runners(L.T, L.lt, 63, 14, 7, { sp: 5 }); orbit(V(26.2, 4.2, z), lerp(20, 15, L.k), PI + .1, .1, 46); sh(V(26, 0, z), 40); }, [[0, 'crowd_run', .6], [.2, 'thud', .4], [.6, 'thud', .4], [1.0, 'thud', .4], [1.4, 'cheer', .4]]);
// 93 HUSS ×3: Max y el Opa, uno al lado del otro, aceleran a la vez con estela dorada
shot(th(13), 'C', 'punch', L => { town(); const z = 50 - 14 * L.lt; const c = put(ich, 24.5, 0, z, PI); ich.props.gold.visible = true; dribble(c, BBALL, L.T, { run: true, f: 8, rs: 2.4, trail: 7 }); effort(c, L.T);
  const o = put(opa, 28, 0, z + .5, PI); dribble(o, BBALL2, L.T + .1, { run: true, f: 8, rs: 2.4 }); effort(o, L.T); attach(BANDF, o.aL.hand, [0, .3, 0], [PI / 2, 0, 0], .45); hussPop(13, L.T);
  orbit(V(26.2, 3.4, z), 12, PI - .25, .06, 46); sh(V(26, 0, z), 30); }, [[0, 'whoosh', .6], [.2, 'thud', .5], [.4, 'thud', .5]]);
// 94 «… der kann nie wieder aufhören.» final en bucle: la calle llena, todos botando hacia la cámara bajo la pancarta; la grúa sube hasta el aro dorado
shot(tw('kann', 1) - .12, 'C', 'slow', L => { town(); const z = 44 - 5 * L.lt; const c = put(ich, 26, 0, z, PI); ich.props.gold.visible = true; dribble(c, BBALL, L.T, { run: true, f: 4, rs: 1.6 }); grin(c, L.T);
  runners(L.T, L.lt, 48, 16, 31, { sp: 5, cheer: true }); BAN.userData.ring.rotation.y = L.T * 1.5; cm([26, 5, z - 16, 26, 4, z, 46], [26, 12, z - 22, 26, 10, 60, 46], easeInOut(L.k)); sh(V(26, 0, z), 40); }, [[0, 'cheer', .6], [.3, 'thud', .4], [.7, 'thud', .4]]);
