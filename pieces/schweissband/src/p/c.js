// ---------- c: la Weltmeisterschaft, el HUSS-O-MAT 9000, el Strickfinale, las derrotas, «Max … huss für uns», 0 % (66,7 – 106,8 s) ----------
// robot: anda hacia -z desde la entrada del fondo (+z)
const roboWalk = (L, z0, sp = 2.4, x = STX) => { const r = put(robo, x, 0, z0 - sp * L.lt, PI); caminar(r, L.lt, { x, z: z0, ry: PI, speed: sp, T: L.T }); return r; };
const railFolk = (T, mode = 'cheer', z0 = -6) => { [mama, ...XT.slice(0, 3)].forEach((c, i) => { put(c, STX - 19.5, 0, z0 + i * 3.2 - 4, PI / 2); actuar(c, T, [[0, mode === 'cheer' ? 'cheer' : mode === 'laugh' ? (i % 2 ? 'point' : 'point_l') : 'shock']], { T: T + i }); if (mode === 'laugh') laughF(c, T + i); else if (mode === 'cheer') grin(c, T + i); else cara(c, T + i, { expr: 'shock' }); }); };
const scoreKnit = (a, b) => bText([['STRICKFINALE', .2, 80, '#ffffff'], [`OMA ${a} : ${b} ROBOTER`, .62, 84, '#ffd23f']]);

// 46 «Doch dann kam die Weltmeisterschaft.» grúa sobre el estadio a reventar: fuegos, confeti, todas las banderas
shot(tw('Doch', 1), 'Z', null, L => { stadium(); stands(L.T * 1.3, 'cheer'); bText([['HUSS-WM', .42, 210, '#ffd23f'], ['HEUTE!', .82, 90, '#ffffff']]); confRain(V(STX - 10, 2, 0), L.T, 60, 40, 50, 26);
  sparks(V(STX - 10, 22, -20), L.t0 + .2, L.T, 14, 2); cm([STX + 12, 16, 24, STX - 32, 9, -6, 50], [STX + 8, 13, 20, STX - 32, 9, -8, 48], L.k); sh(V(STX - 20, 0, -6), 60); }, [[0, 'firework', .6], [.2, 'cheer', .7], [.8, 'firework', .5], [1.3, 'confetti', .4]]);
// 47 «Und mit ihr ein Roboter aus der Großstadt:» por el túnel del fondo entra el robot entre humo; la grada enmudece
shot(tw('Und', 4), 'W', null, L => { stadium(); stands(L.T, 'still', true); const r = roboWalk(L, 30, 2.6); cara(r, L.T, { expr: 'angry' }); smoke(V(STX, 0, 34), L.T, 1.2);
  orbit(V(STX, 5.5, r.root.position.z), lerp(19, 15, L.k), PI + .25, .02, 46); sh(V(STX, 0, 26), 30); }, [[0, 'steam', .5], [.2, 'machine_hum', .5], [.5, 'thud', .5], [1.1, 'thud', .5], [1.6, 'gasp', .4]]);
// 48 «der HUSS-O-MAT 9000.» golpe de zoom: el visor rojo se enciende; «9000»
shot(tw('HUSS-O-MAT', 1), 'C', 'punch', L => { stadium(); stands(L.T, 'still', true); const r = put(robo, STX, 0, 22, PI); actuar(r, L.lt, [[0, 'idle'], [.2, 'fists', { dur: .3 }]], { T: L.T }); cara(r, L.T, { expr: 'angry' }); r.props.visor.material.emissiveIntensity = 1 + clamp(L.lt * 3) * 3;
  badge('red', '9000', W / 2, H * .66, (tw('9000') - L.T) * -4, 1, 1.2); orbit(hpC(r, -1.4), lerp(13, 11, L.k), PI + .1, .05, 44); sh(V(STX, 0, 22), 20); }, [[0, 'power_on', .6], [.4, 'machine_hum', .4]]);
// 49 «Er schaute auf unsere Tribüne und sagte nur:» por encima del hombro del robot: la grada entera, en silencio
shot(tw('Er', 2), 'W', null, L => { stadium(); stands(L.T, 'still', true); const r = put(robo, STX - 6, 0, 2, -PI / 2 + .2); actuar(r, L.lt, [[0, { headY: lerp(.4, 0, clamp(L.lt)) }]], { T: L.T }); railFolk(L.T, 'shock');
  cm([STX + 6, 9, 6, STX - 30, 6, -2, 48], [STX + 4, 9.5, 5, STX - 30, 6, 0, 46], L.k); sh(V(STX - 14, 0, 0), 40); }, [[0, 'machine_hum', .4], [.5, 'crickets', .3]]);
// 50 «„Menschen sind langsam.“» primer plano del robot hablando; el visor late con cada palabra
shot(tw('Menschen', 1), 'C', null, L => { stadium(); stands(L.T, 'still', true); const r = put(robo, STX - 6, 0, 2, -PI / 2 + .2); actuar(r, L.lt, [[0, { headX: -.1 }], [.5, { headX: .05, aRx: .7, aRe: 1.2 }, { dur: .4 }]], { T: L.T });
  const sp = spoken(L.t0, L.t1).some(w => L.T >= w[0] && L.T < w[1]); r.props.visor.material.emissiveIntensity = sp ? 4 : 1.5; talk(r, L.T, L.t0, L.t1, 'angry');
  orbit(hpC(r, -1.4), lerp(12, 10.5, L.k), -PI / 2 + .45, .02, 44); sh(V(STX - 6, 0, 2), 20); }, [[0, 'glitch', .4], [.5, 'machine_shake', .3]]);
// 51 «Opa wurde kreidebleich.» golpe: el Opa en la barandilla, blanco como la tiza, se agarra el pecho
shot(tw('Opa', 3), 'F', 'punch', L => { stadium(); stands(L.T, 'still', true); const o = put(opa, STX - 19.5, 0, 0, PI / 2 + .2); actuar(o, L.lt, [[0, 'shock'], [.4, { aRx: 1.3, aRz: -.6, aRe: 1.8, lean: -.1 }, { dur: .4 }]], { T: L.T }); cara(o, L.T, { expr: 'shock' });
  const c = put(ich, STX - 19.5, 0, 3.4, PI / 2 + .3); actuar(c, L.lt, [[0, { headY: -.6 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); grade.uniforms.lift.value = .06; grade.uniforms.sat.value = .9;
  orbit(hpC(o, -.6), lerp(9, 7.5, L.k), PI / 2 + .25, .05, 44); sh(V(STX - 19, 0, 1), 20); }, [[0, 'gasp_old', .6], [.2, 'heartbeat', .5]]);
// 52 «Denn am Arm des Roboters glänzte etwas Goldenes.» (zoom lento): la muñequera dorada en la muñeca del robot, un destello
shot(tw('Denn', 3), 'Z', 'slow', L => { stadium(); stands(L.T, 'still', true); const r = put(robo, STX - 6, 0, 2, -PI / 2 + .2); actuar(r, L.lt, [[0, { aLx: 1.1, aLe: 1.2, aLz: -.2 }]], { T: L.T }); cara(r, L.T, { expr: 'angry' });
  POST.push(() => { const g = wpos(r.props.gold); orbit(g, lerp(10, 4.2, easeInOut(L.k)), -PI / 2 - .7, .15, 40); sparks(g, L.t0 + .9, L.T, 10, .3); GLOW.intensity = 30; GLOW.position.copy(g).add(V(2, 2, 2)); }); sh(V(STX - 6, 0, 2), 20); }, [[0, 'sparkle', .6], [.9, 'magic_hit', .5]]);
// 53 «Das erste Duell war das Strickfinale.» las dos mesas de punto; Oma Hilde y el robot frente a frente; marcador STRICKFINALE
shot(tw('Das', 2), 'W', null, L => { stadium(); stands(L.T, 'sway'); TISCH1.visible = TISCH2.visible = true; scoreKnit(0, 0); const o = put(oma, STX - 3.8, 0, -8.6, 0); actuar(o, L.lt, [[0, 'cross']], { T: L.T }); cara(o, L.T, { expr: 'determined' });
  const r = put(robo, STX + 3.8, 0, -8.8, 0); actuar(r, L.lt, [[0, 'fists']], { T: L.T }); cara(r, L.T, { expr: 'angry' }); badge('tag', '1. DUELL', W / 2, H * .13, (L.lt - .2) * 4, 1, 1);
  orbit(V(STX, 4.2, -8), lerp(22, 19, L.k), .05, .38, 46); sh(V(STX, 0, -7), 30); }, [[0, 'whistle', .6], [.4, 'cheer', .4]]);
// 54 «Oma Hilde schaffte in einer Minute einen ganzen Pullover.» las agujas de Oma echan humo; el reloj: 1:00 → 0:00
shot(tw('Oma', 2), 'C', null, L => { stadium(); stands(L.T, 'cheer'); TISCH1.visible = TISCH2.visible = true; const o = put(oma, STX - 3.8, 0, -8.6, 0); actuar(o, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLe: 1.2 + Math.sin(L.T * 36) * .3, aRe: 1.2 - Math.sin(L.T * 36) * .3, aLz: -.3, aRz: -.3, headX: .2 }]], { T: L.T }); effort(o, L.T);
  POST.push(() => { const h = wpos(o.aR.hand); show(NEED, h.x - .5, h.y + .3, h.z + .3); const p = show(PULLI, STX - 3.8, 2.75, -6.2, 0, lerp(.1, .7, L.k)); p.rotation.x = -PI / 2; }); const sec = Math.max(0, Math.round(60 - L.k * 60));
  board('t' + sec, (c, w, h) => { txt2(c, 'STRICKFINALE', w / 2, h * .2, 80, '#ffffff'); txt2(c, '0:' + String(sec).padStart(2, '0'), w / 2, h * .62, 200, '#ff5a3a'); }); badge('gold', '1 MINUTE', W / 2, H * .13, (tw('Minute') - L.T) * -4, 1, .9);
  orbit(V(STX - 3.8, 4.2, -8.4), lerp(11, 9, L.k), .35, .2, 44); sh(V(STX - 3.8, 0, -7), 20); }, [[0, 'tick', .4], [.3, 'zip', .4], [.8, 'tick', .4], [1.3, 'zip', .4], [1.8, 'tick', .4], [2.3, 'zip', .4]]);
// 55 HUSS ×3: Oma levanta el jersey rojo terminado; el marcador: OMA 1
shot(th(8), 'C', 'punch', L => { stadium(); stands(L.T * 1.3, 'cheer'); TISCH1.visible = TISCH2.visible = true; scoreKnit(1, 0); const o = put(oma, STX - 3.8, 0, -8.6, 0); actuar(o, L.lt, [[0, 'cheer']], { T: L.T }); grin(o, L.T);
  POST.push(() => { const h = wpos(o.aR.hand).add(wpos(o.aL.hand)).multiplyScalar(.5); show(PULLI, h.x, h.y + .2, h.z + .2, 0, 1); }); hussPop(8, L.T); confetti(V(STX - 3.8, 2, -7), L.t0, L.T, 30);
  orbit(V(STX - 3.8, 5.5, -8.4), lerp(14, 12, L.k), -.2, .22, 44); sh(V(STX - 3.8, 0, -7), 20); }, [[0, 'cheer', .6], [.3, 'confetti', .4]]);
// 56 «Der Roboter strickte zweihundert.» los brazos del robot son un borrón; los jerséis salen disparados y se apilan; 200
shot(tw('Der', 2), 'W', null, L => { stadium(); stands(L.T, 'still', true); TISCH1.visible = TISCH2.visible = true; const n = Math.round(lerp(0, 200, easeIn(L.k))); scoreKnit(1, n); const r = put(robo, STX + 3.8, 0, -8.8, 0);
  actuar(r, L.lt, [[0, { aLx: 1.4 + Math.sin(L.T * 60) * .5, aRx: 1.4 - Math.sin(L.T * 60) * .5, aLe: 1, aRe: 1, aLz: -.3, aRz: -.3 }]], { T: L.T }); cara(r, L.T, { expr: 'angry' });
  PULLIS.forEach((p, i) => { const k = clamp(L.k * 1.6 - i * .06); if (k <= 0) return; const q = arc(V(STX + 3.8, 5, -7), V(STX + 13 + (i % 3) * 1.4, .4 + Math.floor(i / 3) * .45, -9 + (i % 2)), 3, k); show(p, q.x, q.y, q.z, i, .7).rotation.x = k < 1 ? L.T * 8 : -PI / 2; });
  badge('red', '200', W / 2, H * .13, (tw('zweihundert') - L.T) * -4, 1, 1.2); orbit(V(STX + 5, 4.5, -8), lerp(20, 18, L.k), .25, .3, 46); sh(V(STX + 5, 0, -6), 30); }, [[0, 'machine_shake', .5], [.2, 'zip', .4], [.5, 'zip', .4], [.8, 'zip', .4], [1.0, 'cash_reg', .3]]);
// 57 «Oma fiel in Ohnmacht.» Oma se lleva la mano a la frente y cae de espaldas
shot(tw('Oma', 3), 'C', 'punch', L => { stadium(); stands(L.T, 'still', true); TISCH1.visible = TISCH2.visible = true; const f = clamp((L.lt - .25) / .45); const o = put(oma, STX - 6, 0, -1.2, 0);
  applyPose(o, { lean: lerp(0, -1.45, easeIn(f)), aLx: 2.4, aLe: 2, aRx: lerp(.4, 2.8, f), aRz: .6, lLx: lerp(0, .6, f), lRx: lerp(0, .4, f), crouch: f * .2 }); o.root.position.y = -f * 1.5; o.root.position.z = -1.2 - f * 2.2; cara(o, L.T, { expr: 'shock', eyes: f > .6 ? 'closed' : 'wide' });
  orbit(V(STX - 6, 3.4, -2), lerp(13, 11, L.k), .4, .12, 44); sh(V(STX - 6, 0, -2), 20); }, [[0, 'gasp_old', .5], [.6, 'thud', .7], [.8, 'gasp', .5]]);
// 58 «Zum ersten Mal in siebzig Jahren.» Oma en el suelo, las agujas a un lado; la gente de la barandilla se lleva las manos a la cabeza; «70 JAHRE»
shot(tw('Zum', 1), 'S', null, L => { stadium(); stands(L.T, 'still', true); const o = put(oma, STX - 6, .5, -12, 0); o.root.rotation.set(-PI / 2, 0, 0); applyPose(o, { aLx: .2, aRx: .4, aRz: .5 }); cara(o, L.T, { expr: 'sad', eyes: 'closed' }); show(NEED, STX - 3.6, .2, -11).rotation.z = PI / 2;
  const c = put(ich, STX - 1.5, 0, -12.5, -1.4); actuar(c, L.lt, [[0, 'shock'], [.5, { crouch: .7, lean: .4, lLk: 1.2, lRk: 1.2, aLx: 1.1, aRx: 1.1 }, { dur: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  badge('gold', '70 JAHRE', W / 2, H * .13, (tw('siebzig') - L.T) * -4, 1, 1); cm([STX - 6, 13, 2, STX - 5, 0, -12, 44], [STX - 4, 12, 0, STX - 5, 0, -12.5, 44], L.k); sh(V(STX - 5, 0, -12), 20); }, [[0, 'heartbeat', .5], [.8, 'sad_tone', .4]]);
// 59 «Dann verloren die Fußballer.» el robot dispara; el balón pasa por encima del futbolista, que cae de rodillas; marcador
shot(tw('Dann', 3), 'W', null, L => { stadium(); stands(L.T, 'still', true); bText([['FUSSBALL', .25, 90, '#ffffff'], ['0  :  9', .65, 170, '#ff3a3a']]); const r = put(robo, STX + 3, 0, 8, PI); actuar(r, L.lt, [[0, { lLx: -1.2, lLk: .2, aRx: .8, aLx: -.6 }]], { T: L.T });
  const f = put(fuss, STX - 1, 0, 1, .2); actuar(f, L.lt, [[0, 'shock'], [.5, { crouch: .9, lLk: 1.6, lRk: 1.6, lLx: 1.4, lRx: 1.4, lean: .3, headX: .4 }, { dur: .4 }]], { T: L.T }); cara(f, L.T, { expr: 'sad' });
  const p = arc(V(STX + 3, .55, 6.8), V(STX - 4, 3, -30), 4, clamp(L.lt * 1.4)); show(BALL, p.x, p.y, p.z).rotation.x = L.T * 15; trailOn(BALL.position, L.T, 5); orbit(V(STX + 1, 4, 4), lerp(20, 17, L.k), 1.45, .1, 46); sh(V(STX, 0, 2), 30); }, [[0, 'kick', .7], [.3, 'whoosh', .4], [.6, 'sad_tone', .4]]);
// 60 «Dann die Basketballer.» el robot hace un mate por encima del de baloncesto, que cae sentado
shot(tw('Dann', 4), 'W', null, L => { stadium(); stands(L.T, 'still', true); bText([['BASKETBALL', .25, 90, '#ffffff'], ['0  :  150', .65, 150, '#ff3a3a']]); const r = put(robo, STX + 2, 0, 0, PI); r.root.position.y = Math.sin(clamp(L.lt * 1.2) * PI) * 2.5; applyPose(r, { aRx: 3, aRe: .2, aLx: 2.6 });
  POST.push(() => { const h = wpos(r.aR.hand); show(BBALL, h.x, h.y + .6, h.z); }); const b = put(bask, STX - 1, 0, -2.4, 0); applyPose(b, { crouch: 1.0, lLx: 1.5, lRx: 1.5, lLk: 1.4, lRk: 1.4, lean: -.4, aLx: 1.4, aRx: 1.4, aLz: .6, aRz: .6 }); b.root.position.y = -1.2; cara(b, L.T, { expr: 'shock' });
  orbit(V(STX, 5.5, -1), lerp(22, 19, L.k), PI - .6, .15, 46); sh(V(STX, 0, -1), 30); }, [[0, 'jump', .5], [.4, 'clack', .6], [.6, 'thud', .5]]);
// 61 «Sogar der Würstchenmann.» el Würstchenmann llora con una salchicha carbonizada humeando; el robot con una bandeja perfecta
shot(tw('Sogar', 2), 'C', null, L => { stadium(); stands(L.T, 'still', true); const w = put(wm, STX - 3, 0, 4, .3); actuar(w, L.lt, [[0, { aRx: 1.2, aRe: 1.0, lean: .2, headX: .3 }]], { T: L.T }); cara(w, L.T, { expr: 'sad', mouth: 'grimace' }); tears(w, L.T);
  show(WURST, STX - 1.6, .4, 6, .4, 1.2); smoke(V(STX - 1.6, .6, 6), L.T, .3);
  orbit(hpC(w, -.8), lerp(9, 7.5, L.k), .45, .05, 44); sh(V(STX - 3, 0, 4), 20); }, [[0, 'cry_girl', .3], [.3, 'fire_crackle', .4], [.8, 'sniff', .5]]);
// 62 «Noch ein Duell, und die Meisterschaft wäre für immer weg.» (zoom lento): el robot alarga la mano hacia el pedestal; marcador ✗ ✗ ?
shot(tw('Noch', 1), 'Z', 'slow', L => { stadium(); stands(L.T, 'still', true); board('xx?', (c, w, h) => { txt2(c, 'HUFENBACH', w / 2, h * .22, 80, '#ffffff'); txt2(c, '✗', w * .25, h * .65, 190, '#ff3a3a'); txt2(c, '✗', w * .5, h * .65, 190, '#ff3a3a'); txt2(c, '?', w * .75, h * .65, 190, '#ffd23f'); });
  const r = put(robo, STX + 4.5, 0, -14, -PI / 2 - .3); actuar(r, L.lt, [[0, 'idle'], [.4, 'reach', { dur: .8 }]], { T: L.T }); cara(r, L.T, { expr: 'smug' }); PED.userData.band.rotation.y = L.T;
  cm([STX + 8, 7, 4, STX + 1, 6, -18, 48], [STX + 6, 6.5, -4, STX + 1, 6, -18, 42], L.k); sh(V(STX + 2, 0, -16), 20); }, [[0, 'heartbeat', .5], [1.2, 'heartbeat', .5]]);
// 63 «Da packte Oma meine Hand:» Oma, tumbada, agarra la mano de Max, que está de rodillas a su lado
shot(tw('Da', 2), 'C', null, L => { stadium(); stands(L.T, 'still', true); const o = put(oma, STX - 6, .5, -12, 0); o.root.rotation.set(-PI / 2, 0, 0); applyPose(o, { aRx: lerp(.4, 1.4, clamp(L.lt * 2)), aRz: .3 }); cara(o, L.T, { expr: 'sad', eyes: 'half' });
  const c = put(ich, STX - 4, 0, -12.4, -PI / 2 + .1); applyPose(c, { crouch: .8, lean: .35, lLk: 1.3, lRk: 1.3, lLx: .9, lRx: .9, aLx: 1.2, aLe: .4, headX: .3 }); cara(c, L.T, { expr: 'worried' });
  cm([STX - 5, 14, -7, STX - 5, 0, -12, 44], [STX - 5, 12.5, -8, STX - 5, 0, -12, 42], L.k); sh(V(STX - 5, 0, -12), 20); }, [[0, 'cloth', .5], [.3, 'heartbeat', .3]]);
// 64 «„Max … huss für uns.“» primer plano de Oma, con los ojos medio cerrados, susurrando
shot(tw('Max', 4), 'C', null, L => { stadium(); stands(L.T, 'still', true); const o = put(oma, STX - 6, .5, -12, 0); o.root.rotation.set(-PI / 2, 0, 0); talk(o, L.T, tw('Max', 4), tw('Als'), 'sad', { eyes: 'half' });
  POST.push(() => { const h = hp(o); cam([h.x + .2, h.y + 3.6, h.z + 1.6], [h.x, h.y, h.z], 40); }); sh(V(STX - 6, 0, -12), 20); }, [[0, 'whisper', .6], [.8, 'heartbeat', .3]]);
// 65 «Als ich in die Mitte trat,» Max camina solo hacia el círculo central; el robot espera
shot(tw('Als', 1), 'S', null, L => { stadium(); stands(L.T, 'sway'); const z = 12 - L.lt * 3; const c = put(ich, STX, 0, z, PI); caminar(c, L.lt, { x: STX, z: 12, ry: PI, speed: 3, T: L.T }); cara(c, L.T, { expr: 'determined' });
  const r = put(robo, STX, 0, -6, 0); actuar(r, L.lt, [[0, 'cross']], { T: L.T }); cara(r, L.T, { expr: 'smug' }); cm([STX + 2, 6, z + 10, STX, 4, z - 4, 46], [STX + 1, 5, z + 8, STX, 4, z - 5, 46], L.k); sh(V(STX, 0, 2), 30); }, [[0, 'steps', .5], [.5, 'steps', .5], [1.0, 'murmur', .3]]);
// 66 «lachte die ganze Halle:» la grada se ríe; la gente de la barandilla señala
shot(tw('lachte', 1), 'W', null, L => { stadium(); stands(L.T * 1.5, 'sway'); railFolk(L.T, 'laugh'); cm([STX - 4, 8, 14, STX - 30, 6, -4, 50], [STX - 6, 8, 12, STX - 30, 6, -6, 48], L.k); sh(V(STX - 22, 0, 0), 40); }, [[0, 'laugh_deep', .6], [.3, 'kids_laugh', .5]]);
// 67 «„Max Plumps!“» golpe: los niños de la primera fila le señalan, MAX PLUMPS
shot(tw('Max', 5), 'C', 'punch', L => { stadium(); stands(L.T, 'sway'); [K[2], K[6], XT[4]].forEach((k, i) => { put(k, STX - 19.5, 0, -2 + i * 3, PI / 2 + (i - 1) * .2); actuar(k, L.lt, [[0, i % 2 ? 'point_l' : 'point']], { T: L.T + i }); laughF(k, L.T + i); });
  badge('red', 'MAX PLUMPS', W / 2, H * .13, L.lt * 4, 1, 1); orbit(V(STX - 19.5, 4.6, 1), lerp(11, 9.5, L.k), PI / 2, .05, 46); sh(V(STX - 19, 0, 1), 20); }, [[0, 'kids_laugh', .6]]);
// 68 «Der Roboter rechnete:» el robot inclina la cabeza; números verdes corren por la pantalla del marcador
shot(tw('Der', 3), 'C', null, L => { stadium(); stands(L.T, 'still', true); const r = put(robo, STX, 0, -6, 0); actuar(r, L.lt, [[0, { headZ: .3, headX: -.1 }]], { T: L.T }); cara(r, L.T, { expr: 'smug' }); r.props.visor.material.emissiveIntensity = 1.5 + Math.abs(Math.sin(L.T * 20)) * 2;
  const f = Math.floor(L.T * 12); board('calc' + f, (c, w, h) => { const r_ = RNG(f); for (let i = 0; i < 7; i++) txt2(c, Array.from({ length: 14 }, () => Math.floor(r_() * 10)).join(''), w / 2, h * (.1 + i * .13), 52, '#3aff7a'); });
  orbit(hpC(r, -1.6), lerp(13, 11.5, L.k), -.25, .05, 44); sh(V(STX, 0, -6), 20); }, [[0, 'ticks', .5], [.3, 'glitch', .3]]);
// 69 «„Siegeschance des Menschen: null Prozent.“» (zoom lento): Max y el robot frente a frente; el marcador: SIEGESCHANCE MENSCH 0 %
shot(tw('Siegeschance', 1), 'Z', 'slow', L => { stadium(); stands(L.T, 'still', true); bText([['SIEGESCHANCE MENSCH', .25, 70, '#ffffff'], ['0 %', .66, 220, '#ff3a3a']]);
  const r = put(robo, STX, 0, -5, 0); actuar(r, L.lt, [[0, 'cross']], { T: L.T }); cara(r, L.T, { expr: 'smug' }); const c = put(ich, STX, 0, 2, PI); actuar(c, L.lt, [[0, { aRx: .3, aLx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  badge('red', '0 %', W / 2, H * .13, (tw('null') - L.T) * -4, 1, 1.2); cm([STX + 15, 6, 11, STX, 4.5, -1.5, 46], [STX + 12, 6, 9, STX, 4.5, -1.5, 42], L.k); sh(V(STX, 0, -2), 20); }, [[0, 'heartbeat', .5], [.8, 'heartbeat', .5], [1.6, 'heartbeat', .6]]);
