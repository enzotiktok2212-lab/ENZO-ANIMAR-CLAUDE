// ---------- c: la pregunta, papá, la noche del sótano, la radio (56,19 – 94,35 s) ----------
const BUS = V(30, 0, 30);                          // parada del bus (plaza sur-este)
const MP = V(KX, 0, -6);                           // la máquina
const BEDX = ZX - 8, BEDZ = -8;                    // donde me siento en la cama (mirando a +x)
const RAD = V(ZX - 13.4, 4.2, -10);                // la radio en la mesilla
const inBed = (L, pose = {}, face = {}) => { const m = put(ich, BEDX, sitY(ich, 3.45), BEDZ, PI / 2); actuar(m, 0, [[0, seatPose({ lLk: 0, lRk: 0, aLx: .5, aRx: .5, aLe: .6, aRe: .6, ...pose })]], { T: L.T }); cara(m, L.T, face); return m; };
const radioOn = (L, k) => { RADIO.userData.setGlow(k); RADIO.userData.needle.position.x = .95 + Math.sin(L.T * 3) * .25 * k; };
const papaWork = (L, o = {}) => { const p = put(papa, MP.x - 5.2, 0, MP.z + 4.4, .9); const s = Math.sin(L.T * 12); actuar(p, 0, [[0, { aRx: 1.5 + s * .25, aRz: -.1, aRe: .9, aLx: 1.2, aLz: -.2, aLe: 1.0, lean: .15, headX: .15, ...(o.pose || {}) }]], { T: L.T }); cara(p, L.T, { expr: o.expr || 'determined', mouth: 'flat' }); return p; };

// 43 «Und mal ehrlich: Kennst du auch»: yo, mirando a cámara con una ceja levantada (te lo pregunto a ti)
shot(56.19, 'W', null, L => { town(L); const m = put(ich, 6, 0, 30, 0); actuar(m, 0, [[0, { aRx: 1.3, aRz: -.25, aRe: 1.5, aLx: .2, headZ: .12, headX: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'squint', mouth: 'smirk' });
  crowdAt(L, 6, 30, 5, 8, 16, 23, { mode: 'walk', speed: 1.5 }); onFace(m, 5, .1, 0, 40, L.k, 4.2); sh(V(6, 0, 30), 16); }, [[0, 'pop', .4], [.5, 'hmm', .35]]);
// 44 «jemanden, der keinen einzigen Tag»: en la parada del bus: un vecino que tiembla con la vape en el puño, sin atreverse
shot(57.75, 'Z', null, L => { town(L); const g = put(EX[18], BUS.x, 0, BUS.z, -.3); VP.get(g).visible = true; VP.get(g).userData.grip.visible = true; const sh_ = Math.sin(L.T * 38) * .05;
  actuar(g, 0, [[0, { ...armVape(.25 + sh_), headY: Math.sin(L.T * 4) * .5, lean: .06, crouch: .05 }]], { T: L.T }); g.aR.sh.rotation.y = armVape(.25).aRy; cara(g, L.T, { expr: 'worried', mouth: 'wavy' }); sweat(g, L.T, 3);
  crowdAt(L, BUS.x, BUS.z, 4, 5, 8, 25, { mode: 'idle', expr: 'sus', face: V(BUS.x, 4, BUS.z) });
  onBody(g, 12, .1, .08, 42, L.k, 10.5); sh(BUS, 16); }, [[0, 'shiver', .5], [.5, 'heartbeat', .4]]);
// 45 «ohne seine Vape aushält?»: primer plano: la mano tiembla, la frente sudando; el reloj de la parada; «?»
shot(59.11, 'F', null, L => { town(L); const g = put(EX[18], BUS.x, 0, BUS.z, -.3); VP.get(g).visible = true; VP.get(g).userData.grip.visible = true; const sh_ = Math.sin(L.T * 40) * .06;
  actuar(g, 0, [[0, { ...armVape(.55 + sh_), headX: .1, headY: Math.sin(L.T * 5) * .2 }]], { T: L.T }); g.aR.sh.rotation.y = armVape(.55).aRy; cara(g, L.T, { expr: 'worried', eyes: 'wide', mouth: 'grimace' }); sweat(g, L.T, 3);
  onFace(g, 4.4, -.2, .7, 40, L.k, 3.8); badge('q', '?', W * .78, H * .2, clamp((L.lt - .4) / .15), 1, 1); sh(BUS, 14); }, [[0, 'vibrate', .45], [.5, 'gulp', .45]]);
// 46 «Ich schon. Meinen»: en mi cuarto, sentado en la cama, asiento despacio con una foto en la mano
shot(60.84, 'S', null, L => { cuartoS(L); const m = inBed(L, { aLx: 1.2, aRx: 1.2, aLe: 1.4, aRe: 1.4, aLz: -.35, aRz: -.35, headX: .25 + Math.sin(L.T * 3) * .05 }, { expr: 'sad', eyes: 'down' });
  onFace(m, 5.5, .3, -.6, 40, L.k, 4.6); sh(V(BEDX, 0, BEDZ), 14); }, [[0, 'sigh_kid', .45]]);
// 47 «Vater. Denn vor vier»: recuerdo: papá en su taller, sonriendo, dando una calada a su vape negra
shot(62.00, 'C', null, L => { kellerS(L); const p = put(papa, MP.x - 7, 0, MP.z + 9, .3); vaper(p, L, 61.4, .6, { expr: 'happy', vape: OLDV, exh: 1.3, pow: 5, size: 1.6, n: 60 }); OLDV.visible = true; if (OLDV.parent !== p.aR.hand) { p.aR.hand.add(OLDV); } OLDV.position.set(0, -.25, .47); OLDV.rotation.set(1.54, 0, 0); OLDV.scale.setScalar(.95);
  onFace(p, 5.2, .2, .4, 40, L.k, 4.4); grade.uniforms.sepia.value = .25; sh(V(MP.x - 7, 0, MP.z + 9), 14); }, [[0, 'vape_in', .5], [.8, 'vape_out', .5]]);
// 48 «Jahren hat der Dampfsammler ihn» (zoom lento): la puerta del sótano entreabierta; en la oscuridad, dos ojos cian
shot(63.18, 'I', 'slow', L => { kellerS(L, { off: .8 }); samAt(L, KX + 17.5, -12.5, -PI / 2 - .4, { reach: .1 }); sam.root.position.y = 9.2;
  cm([KX - 2, 8, 12], [KX + 4, 9.5, 4], easeIn(L.k)); camera.lookAt(KX + 17, 13, -14); camera.fov = lerp(46, 36, easeIn(L.k)); badge('gold', 'VOR 4 JAHREN', W / 2, H * .14, clamp(L.lt / .15), 1, .9); sh(V(KX + 10, 0, -8), 24); }, [[0, 'door_creak', .5], [.4, 'heartbeat', .5]]);
// 49 «geholt. Mein Vater war der»: recuerdo de día: papá en la plaza presenta un invento (un dron de latón); la gente aplaude
shot(64.56, 'W', null, L => { town(L); const p = put(papa, -6, 0, 18, 0); actuar(p, 0, [[0, { aRx: 2.4, aRz: .3, aRe: .2, aLx: .6, aLz: .3, aLe: 1.2 }]], { T: L.T }); grin(p, L.T);
  show(MACH, -1.2, 0, 15, -.5, .42); MACH.userData.setPower(.9); crowdAt(L, -6, 18, 9, 7, 13, 27, { mode: 'clap', face: V(-6, 4, 18) });
  orbit(V(-5, 5.4, 18), lerp(18, 16, L.k), .1, .08, 46); grade.uniforms.sepia.value = .25; sh(V(-6, 0, 18), 20); }, [[0, 'clap', .5], [.3, 'machine_hum', .35]]);
// 50 «größte Erfinder der Stadt.»: papá con las gafas de soldador, rodeado de inventos, pulgar arriba
shot(65.89, 'Z', null, L => { kellerS(L); const p = put(papa, KX - 10, 0, -6.8, .35); actuar(p, 0, [[0, { aRx: 1.6, aRz: -.3, aRe: 1.5, aLx: .5, aLz: .3, aLe: 1.2, headZ: .1 }]], { T: L.T }); grin(p, L.T);
  onBody(p, 11, .1, .1, 42, L.k, 9.5); badge('gold', 'ERFINDER', W / 2, H * .15, clamp(L.lt / .15), 1, .9); grade.uniforms.sepia.value = .25; sh(V(KX - 10, 0, -7), 16); }, [[0, 'ding_soft', .5], [.4, 'gears', .4]]);
// 51 «Eines Nachts arbeitete er in»: de noche en el sótano: papá suelda la máquina, chispas
shot(67.55, 'F', null, L => { kellerS(L); const p = papaWork(L); sparks(V(MP.x - 3.2, 3.4, MP.z + 2.4), Math.floor(L.T * 3) / 3, L.T, 26, .5);
  cm([MP.x + 1, 6.4, MP.z + 15], [MP.x, 6.2, MP.z + 14], L.k); camera.lookAt(MP.x - 4.6, 4.6, MP.z + 4); camera.fov = 44; sh(MP, 18); }, [[0, 'weld', .55], [.6, 'sparks', .45]]);
// 52 «unserem Keller an einer geheimnisvollen» (zoom lento): la máquina enorme: la cúpula con vapor brillando, las bobinas girando
shot(69.01, 'S', 'slow', L => { kellerS(L); MACH.userData.setPower(.7 + Math.sin(L.T * 4) * .3); papaWork(L, { expr: 'smug' });
  cm([MP.x + 6, 4, MP.z + 18], [MP.x + 3, 6, MP.z + 12], easeIn(L.k)); camera.lookAt(MP.x, 8, MP.z); camera.fov = 48; sh(MP, 18); }, [[0, 'machine_hum', .55], [.6, 'zap', .35]]);
// 53 «Maschine. Plötzlich hörte ich:»: arriba, en mi cama: me despierto y me incorporo, escuchando
shot(70.81, 'R', null, L => { cuartoS(L); const up = clamp((L.T - 71.4) / .4); const m = inBed(L, { lean: lerp(-.6, 0, up), headY: up * .5, aLx: .3, aRx: .3 }, { expr: up > .3 ? 'shock' : 'neutral', eyes: up > .3 ? 'wide' : 'closed' });
  cm([BEDX + 8, 6.5, BEDZ + 7], [BEDX + 7, 6.2, BEDZ + 6], L.k); camera.lookAt(BEDX, 4.4, BEDZ); camera.fov = 44; sh(V(BEDX, 0, BEDZ), 14); }, [[0, 'snore', .3], [.6, 'gasp', .5]]);
// 54 «Pfffffff! Ich rannte»: en el sótano estalla una nube con luz cian; papá y la criatura giran en el remolino
shot(72.43, 'C', 'punch', L => { kellerS(L); const p = papaWork(L, { expr: 'shock' }); p.aR.hand.add(OLDV); OLDV.visible = true; OLDV.position.set(0, -.25, .47); OLDV.rotation.set(1.54, 0, 0); SMK.puff(mouthW(p), V(1, .4, .3), L.T, 72.4, .6, { n: 60, pow: 5, size: 1.8, dens: .9, seed: 64 }); SMK.haze(V(MP.x - 4, 4, MP.z + 4), L.T, 26, 5, 3, 4, 5, .55, 61); MACH.userData.setPower(1.6);
  samAt(L, MP.x - 7.4, MP.z + 1.9, .9, { reach: 1, grab: true }); takeAway(L, [p, sam], 72.45, V(MP.x - 6, 0, MP.z + 3.6), .55);
  cm([MP.x - 14, 7, MP.z + 16], [MP.x - 13, 7, MP.z + 15], L.k); camera.lookAt(MP.x - 5, 5, MP.z + 3); camera.fov = 46; sh(MP, 18); }, [[0, 'vape_out', .6], [.1, 'magic_hit', .5], [.35, 'whirl', .5]]);
// 55 «nach unten, aber Papa»: bajo corriendo la escalera del sótano
shot(73.40, 'W', null, L => { kellerS(L); const k = clamp(L.lt / 1.2), step = lerp(10, 4, k); const z = 6 - step * 1.3, y = .95 + step * .75;
  const m = put(ich, KX + 17.5, y + Math.abs(Math.sin(L.T * 16)) * .2, z, 0); actuar(m, 0, [[0, { ...walkP(L.T * 1.6, 0), aLx: .9, aRx: -.6 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  cm([KX + 6, 11, z + 10], [KX + 6.5, 9, z + 9], L.k); camera.lookAt(KX + 17.5, y + 3.5, z); camera.fov = 44; sh(V(KX + 16, 0, z), 18); }, [[0, 'steps_run', .55], [.6, 'wood_creak', .35]]);
// 56 «war weg. Nur seine unfertige»: el sótano vacío: vapor flotando, la vape de papá en el suelo
shot(74.60, 'Z', null, L => { kellerS(L); MACH.userData.setPower(.3); SMK.haze(V(MP.x - 5, 3, MP.z + 4), L.T, 14, 6, 2, 4, 5, .25, 63); show(OLDV, MP.x - 6, .25, MP.z + 4, 0, 1.2); OLDV.rotation.set(Math.PI / 2, 0, .4);
  const m = put(ich, KX + 2, 0, 4, -2.94); actuar(m, 0, [[0, { ...GEST.shock, headY: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'sad', mouth: 'frown' });
  cm([KX + 9, 8, 17], [KX + 8, 7.8, 16], L.k); camera.lookAt(KX - 1, 3.5, 0); camera.fov = 48; sh(V(KX, 0, 0), 22); }, [[0, 'gasp', .45], [.5, 'wind', .35]]);
// 57 «Maschine und ein altes Radio waren»: la máquina sin terminar (cables colgando) y la radio vieja en el banco
shot(76.09, 'S', null, L => { kellerS(L); MACH.userData.setPower(.25); const m = put(ich, KX - 13.5, 0, -5, 2.64); actuar(m, 0, [[0, { aLx: 1.1, aLz: -.1, aLe: .6, headX: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'sad' });
  cm([KX - 1, 7.5, 6], [KX - 2, 7.4, 5], L.k); camera.lookAt(KX - 11.5, 4.4, -7); camera.fov = 46; sh(V(KX - 6, 0, -8), 18); }, [[0, 'metal_creak', .4], [.6, 'radio', .2]]);
// 58 «übrig. Vier Jahre lang»: la radio en mi mesilla, cubierta de polvo; pasan los días por la ventana; «4 JAHRE»
shot(77.81, 'F', null, L => { cuartoS(L); dust(V(RAD.x, RAD.y + 2, RAD.z), L.t0, L.T, 8, .4);
  cm([RAD.x + 1.6, 7.0, RAD.z + 8.4], [RAD.x + 1.4, 6.8, RAD.z + 7.4], L.k); camera.lookAt(RAD.x, 6, RAD.z); camera.fov = 42; badge('gold', '4 JAHRE', W / 2, H * .15, clamp(L.lt / .15), 1, .95); sh(RAD, 12); }, [[0, 'clock_tick', .5], [.5, 'wind', .3]]);
// 59 «blieb dieses Radio stumm.»: yo en la cama, mirando la radio callada
shot(79.27, 'W', null, L => { cuartoS(L); const m = inBed(L, { headY: -.9, headX: .1 }, { expr: 'sad', eyes: 'down' });
  cm([BEDX + 9, 7.5, BEDZ + 6], [BEDX + 8, 7.2, BEDZ + 5.4], L.k); camera.lookAt(BEDX - 3, 4.6, BEDZ - 1); camera.fov = 46; sh(V(BEDX, 0, BEDZ), 16); }, [[0, 'silence_tick', .45], [.5, 'cricket', .3]]);
// 60 «Bis gestern Nacht.» (zoom lento): la radio a oscuras
shot(80.85, 'I', 'slow', L => { cuartoS(L); cm([RAD.x + 1.6, 6.4, RAD.z + 9], [RAD.x + 1.2, 6.1, RAD.z + 5.8], easeIn(L.k)); camera.lookAt(RAD.x, 6, RAD.z); camera.fov = 42; sh(RAD, 12); }, [[0, 'owl', .35]]);
// 61 «Plötzlich ging es von selbst an,»: el dial se enciende de golpe, la aguja se mueve
shot(81.94, 'C', 'punch', L => { cuartoS(L); radioOn(L, clamp(L.lt / .15)); FILL.intensity = 30; FILL.color.setRGB(1, .8, .5);
  cm([RAD.x + 1.3, 6.6, RAD.z + 5.6], [RAD.x + 1.1, 6.4, RAD.z + 5.0], L.k); camera.lookAt(RAD.x, 6.1, RAD.z); camera.fov = 40; sh(RAD, 12); }, [[0, 'radio', .7], [.1, 'switch', .45]]);
// 62 «und ich hörte eine bekannte»: me incorporo de golpe, la luz naranja de la radio en la cara
shot(83.29, 'R', null, L => { cuartoS(L); radioOn(L, 1); const m = inBed(L, { headY: -.8, aLx: .9, aLz: .3, aLe: 1.2 }, { expr: 'shock', mouth: 'o' });
  onFace(m, 5, .1, .8, 40, L.k, 4.2); sh(V(BEDX, 0, BEDZ), 14); }, [[0, 'gasp', .5], [.4, 'radio', .3]]);
// 63 «Stimme. „Mein Sohn,»: la radio habla: ondas de luz, «Mein Sohn…»
shot(84.60, 'Z', null, L => { cuartoS(L); radioOn(L, 1 + Math.sin(L.T * 20) * .15); for (let i = 0; i < 3; i++) { const rg = RINGS[i], t = (L.T * 1.2 + i / 3) % 1; rg.visible = true; rg.position.set(RAD.x + .1, RAD.y + 1.7, RAD.z + 1.0 + t * 2.0); rg.lookAt(camera.position); rg.scale.setScalar(.35 + t * .8); rg.material.opacity = .45 * (1 - t); }
  cm([RAD.x + 1.2, 6.4, RAD.z + 8], [RAD.x + 1.0, 6.2, RAD.z + 7], L.k); camera.lookAt(RAD.x, 6.2, RAD.z); camera.fov = 42; sh(RAD, 12); }, [[0, 'radio', .45]]);
// 64 «hörst du mich? Papa?»: me abalanzo sobre la radio y la agarro: «PAPA?»
shot(85.90, 'W', null, L => { cuartoS(L); radioOn(L, 1); const m = put(ich, ZX - 16.5, 0, -5, 1.75); actuar(m, 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.2, aRz: -.2, aLe: .9, aRe: .9, lean: .3, headX: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: L.T > 86.85 ? 'talk_wide' : 'o' });
  bubble(m, 'PAPA?', clamp((L.T - 86.9) / .1), 1.6); cm([ZX - 6, 7, 6], [ZX - 7, 6.8, 5], L.k); camera.lookAt(ZX - 15, 4.8, -6.5); camera.fov = 44; sh(RAD, 14); }, [[0, 'steps', .35], [.9, 'gasp', .35]]);
// 65 «Hör gut zu. Der Dampfsammler»: la radio de cerca, la aguja tiembla, el dial parpadea
shot(87.42, 'S', null, L => { cuartoS(L); radioOn(L, .8 + Math.sin(L.T * 30) * .2); cm([RAD.x - 2.0, 6.8, RAD.z + 5.4], [RAD.x - 1.6, 6.6, RAD.z + 4.6], L.k); camera.lookAt(RAD.x + .3, 6.0, RAD.z); camera.fov = 40; sh(RAD, 12); }, [[0, 'radio', .4], [.6, 'tv_static', .3]]);
// 66 «nimmt die Leute nicht zufällig mit.»: yo escuchando con los ojos muy abiertos, la cara iluminada en naranja
shot(88.99, 'F', null, L => { cuartoS(L); radioOn(L, 1); const m = put(ich, ZX - 16.5, 0, -5, 1.05); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.2, aRz: -.2, aLe: 1.0, aRe: 1.0, lean: .25, headX: .15, headZ: .15, headY: .55 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'flat' });
  cm([ZX - 8, 6.4, 3], [ZX - 8.6, 6.3, 2.4], L.k); camera.lookAt(ZX - 16.5, 5.2, -5); camera.fov = 40; FILL.color.setRGB(1, .75, .45); sh(RAD, 12); }, [[0, 'heartbeat', .45]]);
// 67 «Er sammelt. Dann wurde das» (zoom lento): la radio; «ER SAMMELT.» en rojo
shot(90.64, 'I', 'slow', L => { cuartoS(L); radioOn(L, 1); cm([RAD.x + 1.4, 6.4, RAD.z + 8], [RAD.x + 1.1, 6.2, RAD.z + 5], easeIn(L.k)); camera.lookAt(RAD.x, 6.0, RAD.z); camera.fov = 42; badge('red', 'ER SAMMELT.', W / 2, H * .16, clamp(L.lt / .15), 1, .85); sh(RAD, 12); }, [[0, 'whisper', .4]]);
// 68 «Signal immer schwächer.»: interferencias: la luz de la radio parpadea y se apaga
shot(91.91, 'R', null, L => { cuartoS(L); const k = 1 - clamp(L.lt / 1.3); radioOn(L, k * (Math.sin(L.T * 47) > -.2 ? 1 : .2)); TINT = `rgba(255,255,255,${(Math.sin(L.T * 91) * .5 + .5) * .06 * k})`;
  cm([RAD.x + 1.2, 6.2, RAD.z + 6.2], [RAD.x + 1.1, 6.2, RAD.z + 5.6], L.k); camera.lookAt(RAD.x, 6.0, RAD.z); camera.fov = 42; sh(RAD, 12); }, [[0, 'tv_static', .55], [.7, 'glitch', .35]]);
// 69 «Was sammelt er?»: grito a la radio, sacudiéndola
shot(93.39, 'C', 'punch', L => { cuartoS(L); radioOn(L, .05); const m = put(ich, ZX - 16.5, 0, -5, 1.75); actuar(m, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.3, aRz: -.3, aLe: .8, aRe: .8, lean: .2 + Math.sin(L.T * 30) * .05, headX: -.1 }]], { T: L.T }); cara(m, L.T, { expr: 'shout', mouth: 'scream' });
  bubble(m, 'WAS SAMMELT ER?', clamp(L.lt / .1), 1.4); cm([ZX - 7, 6.6, 5], [ZX - 7.6, 6.4, 4.4], L.k); camera.lookAt(ZX - 15.5, 5, -6); camera.fov = 42; sh(RAD, 14); }, [[0, 'shout_m', .4], [.2, 'shake', .35]]);
