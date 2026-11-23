// ---------- a: gancho (la regla del botón) y el peor día de mi vida (0 – 42,67 s) ----------
// Lindenthal: plaza alrededor de (0, 0, -10); Maibaum (18, -14); fuente (-14, -26); café x = 38; bancos x = -40 (miran +x).
// Casa del Opa (OPX): banco con asiento a 2,55 en (OPX + 2, 3) mirando +z.
const OSEAT = 2.55, OB = V(OPX + .4, 0, 3.4);
// el Opa en su banco tallando; o.knife / o.bird: lo que tiene en las manos
function opaBench(L, o = {}) { opaS(L, o); const c = sit(opa, OB.x, OSEAT, OB.z, o.ry ?? 0, L, o.pose || { aLx: 1.1, aRx: 1.2, aLz: -.25, aRz: -.3, aLe: 1.5, aRe: 1.6, headX: .35 }); opaBtn(c, L.T, o.btn);
  if (o.knife !== false) attach(KNIFE, c.aR.hand, [0, -.4, .3], [1.2, 0, 0], .9); if (o.bird !== false) attach(WOODB, c.aL.hand, [.2, -.5, .3], [0, .4, 0], .9); c.blob.visible = false; return c; }
// el niño en la plaza / la calle
const KP = V(-6, 0, 4);

// 1 «In dieser Stadt»: grúa que baja sobre la plaza de Lindenthal: gente por todas partes, cada uno con su botón brillando
shot(0, 'C', null, L => { town(L); crowdAt(L, 0, -6, 24, 4, 30, 1, { full: true, mode: i => ['walk', 'talk', 'wave', 'knopf', 'walk', 'talk'][i % 6], speed: 2 });
  orb(L.k, V(0, 4, -6), V(0, 4, -8), [70, .3, .55, 50], [40, .15, .3, 46], easeOut); sh(V(0, 0, -6), 50); }, [[0, 'city_amb', .5], [.2, 'murmur', .4], [.5, 'chime', .25]]);
// 2 «jeder»: travelling hacia atrás por la calle: cinco vecinos caminan hacia la cámara, todos con el botón encendido
shot(1.10, 'W', null, L => { town(L); for (let i = 0; i < 5; i++) { const c = EX[3 + i], x = -10 + i * 5 + (i % 2) * .6, z = 10 + (i % 2) * 3 + L.lt * 2.4; put(c, x, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9 + i)) * .12; cara(c, L.T + i, { expr: 'happy', mouth: i % 2 ? 'smile' : 'open_smile' }); }
  crowdAt(L, 0, -10, 10, 14, 30, 2, { mode: 'talk' }); cm([0, 5.2, 36 + L.lt * 2.4], [0, 4.2, 24], L.k); camera.lookAt(0, 3.6, 10 + L.lt * 2.4); camera.fov = 46; sh(V(0, 0, 14), 30); }, [[0, 'steps', .5], [.4, 'murmur', .3]]);
// 3 «mit einem Knopf mitten auf dem Bauch»: acercamiento al botón de una vecina; brilla y ella lo toca con orgullo
shot(1.90, 'Z', 'punch', L => { town(L); const c = put(EX[9], -2, 0, -2, 0); actuar(c, L.lt, [[0, { headX: .3 }], [.4, { aRx: .7, aRz: -.25, aRe: 1.4, headX: .4 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); c.knopfOn(true, 2.2 + Math.sin(L.T * 8) * .8);
  crowdAt(L, -2, -8, 6, 8, 20, 3, { mode: 'talk' }); onKnopf(c, 7, 3.4, L.k, .3, 1.2, 40); sh(V(-2, 0, -2), 16); }, [[0, 'pling', .5], [.3, 'hum_glow', .4]]);
// 4 «Bauch geboren.»: como en la referencia: primerísimo plano del botón en la barriga (camiseta a rayas del niño), la cámara se mete hasta que el botón llena la pantalla y late
shot(2.98, 'F', null, L => { town(L); const c = put(kl, 6, 0, -2, -.15); actuar(c, 0, [[0, { aLx: .15, aRx: .15, aLz: .1, aRz: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); c.knopfOn(true, 2.4 + Math.sin(L.T * 9) * 1.2); c.knopf.scale.setScalar(1 + Math.sin(L.T * 9) * .05);
  onKnopf(c, 2.9, 1.5, L.k, lerp(.35, -.1, L.k), .2, 40); sparks(kp(c), L.T - L.lt + .35, L.T, 10, .35); sh(V(6, 0, -2), 8); }, [[0, 'zoom_in', .5], [.15, 'hum_glow', .5], [.5, 'sparkle', .4]]);
// 5 «Und dieser Knopf»: un dedo se acerca despacio al botón
shot(3.74, 'S', null, L => { town(L); const c = put(EX[11], 4, 0, -4, -.2); actuar(c, L.lt, [[0, { aRx: .5, aRz: -.1, aRe: 1.0, headX: .4 }], [.1, { aRx: .95, aRz: -.42, aRe: 1.7, headX: .45, lean: .06 }, { dur: .7 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', mouth: 'smirk' });
  onKnopf(c, 4.2, 3.2, L.k, -1.2, 1.6, 42); sh(V(4, 0, -4), 14); }, [[.1, 'tension_tick', .4]]);
// 6 «lässt dich einen Tag deines Lebens»: el reloj de la iglesia gira hacia atrás y el sol cruza el cielo al revés
shot(4.61, 'R', null, L => { town(L); const sp = L.lt * 14; show(CLOCK, 0, 40, -106.6); CLOCK.userData.H1.rotation.z = sp * .5; CLOCK.userData.H2.rotation.z = sp * 6;
  crowdAt(L, 0, -60, 8, 4, 20, 4, { mode: 'walk', speed: -6 }); cm([8, 10, -40], [4, 22, -62], L.k); camera.lookAt(0, 34, -106); camera.fov = 44; sh(V(0, 0, -80), 50);
  sun.position.add(V(Math.sin(L.lt * 4) * 160, 0, 0)); const q = L.k; setSky([lerp(.16, .5, Math.sin(q * PI)), lerp(.44, .3, Math.sin(q * PI)), lerp(.96, .5, Math.sin(q * PI))], [.45, .72, 1], [lerp(.86, 1, q), lerp(.94, .7, Math.sin(q * PI)), lerp(1, .5, Math.sin(q * PI))]);
  badge('gold', '1 TAG', W / 2, H * .17, clamp((L.lt - .25) / .2), 1, 1.1); }, [[0, 'clock_rewind', .7], [.6, 'tick_fast', .4]]);
// 7 «neu starten.»: ¡clic! una onda de luz turquesa sale del botón y barre la plaza
shot(6.14, 'F', null, L => { town(L); const c = put(EX[12], 0, 0, -10, 0); actuar(c, L.lt, [[0, { aRx: .95, aRz: -.42, aRe: 1.7, headX: .3 }], [.25, { aLx: .5, aRx: .5, aLz: .5, aRz: .5, aLe: 1, aRe: 1, lean: -.1, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  const p = kp(c); ringwave(p, clamp((L.lt - .08) / .8), V(p.x, p.y + 30, p.z), 30); RINGW.rotation.x = -PI / 2; sparks(p, L.t0 + .08, L.T, 30, 1.2); crowdAt(L, 0, -10, 12, 6, 24, 5, { mode: 'shock' });
  grade.uniforms.flash.value = Math.max(0, .7 - L.lt * 2); orb(L.k, V(0, 3, -10), null, [20, .4, .32, 46], [16, .2, .22, 46]); sh(V(0, 0, -10), 28); }, [[.05, 'button_click', .8], [.1, 'whoosh_magic', .6]]);
// 8 «Nur einmal.»: el botón enorme ocupando el plano; «NUR 1×»
shot(7.13, 'C', 'punch', L => { town(L); const c = put(EX[13], 0, 0, 0, 0); cara(c, L.T, { expr: 'neutral' }); c.knopfOn(true, 2.6); onKnopf(c, 2.6, 2.2, L.k, 0, .3, 40); badge('cyan', 'NUR 1×', W / 2, H * .2, clamp((L.lt - .05) / .15), 1, 1.2); sh(V(0, 0, 0), 10); }, [[0, 'hit_deep', .6]]);
// 9 «Denn sobald du ihn drückst,»: un vecino pulsa su botón: la luz se encoge
shot(8.00, 'W', null, L => { town(L); const c = put(EX[14], 18, 0, -4, -.4); actuar(c, L.lt, [[0, { aRx: .4, aRe: .6 }], [.25, { aRx: .95, aRz: -.42, aRe: 1.75, headX: .4, lean: .08 }, { dur: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  const pr = L.lt > .6; c.knopfOn(true, pr ? 4 : 2.2); if (pr) ringwave(kp(c), clamp((L.lt - .6) / .6), camera.position, 6);
  crowdAt(L, 18, -10, 5, 7, 18, 6, { mode: 'point', expr: 'shock' }); onBody(c, 15, .25, .1, 42, L.k, 12, .1); sh(V(18, 0, -4), 20); }, [[.6, 'button_click', .8], [.65, 'hum_glow', .4]]);
// 10 «verschwindet er für immer.»: el botón se deshace en chispas y deja solo una marca; «FÜR IMMER»
shot(9.28, 'I', null, L => { town(L); const c = put(EX[14], 18, 0, -4, -.4); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); actuar(c, 0, [[0, { headX: .5, aLx: .3, aRx: .3 }]], { T: L.T }); const k = clamp(L.lt / .7);
  c.knopf.scale.setScalar(1 - k * .99); c.knopfUsed.visible = true; c.knopfUsed.scale.setScalar(1 / Math.max(.01, 1 - k * .99)); sparks(kp(c), L.t0, L.T, 26, .5); onKnopf(c, 4.4, 3.6, L.k, .4, .8, 40);
  badge('red', 'FÜR IMMER', W / 2, H * .19, clamp((L.lt - .35) / .2), 1, 1); sh(V(18, 0, -4), 12); }, [[0, 'sparkle_down', .6], [.35, 'hit_deep', .5]]);
// 11 «Deshalb heben ihn sich die meisten»: la plaza: todos se tapan el botón con la mano, como un tesoro
shot(10.59, 'S', null, L => { town(L); const o = put(oma, -3.2, 0, -22, .55), b = put(blond, .2, 0, -21.4, -.6);
  actuar(o, L.lt, [[0, { aLx: .3, aRx: .2 }], [.15, { aLx: .95, aLz: .35, aLe: 1.5, aRx: .25, headY: Math.sin(L.T * 7) * .25, headX: .05 }, { dur: .35 }]], { T: L.T }); cara(o, L.T, { expr: 'warm', mouth: Math.sin(L.T * 10) > 0 ? 'talk' : 'smile' }); o.knopfOn(true, 2.2 + Math.sin(L.T * 5) * .6);
  actuar(b, L.lt, [[0, { aRx: .2, aLx: .2 }], [.3, { aRx: .9, aRz: -.3, aRe: 1.5, headX: .12 + Math.max(0, Math.sin(L.T * 6)) * .2, headY: .2 }, { dur: .35 }]], { T: L.T }); cara(b, L.T, { expr: 'happy', mouth: 'smile' }); b.knopfOn(true, 2.2 + Math.sin(L.T * 5 + 1) * .6);
  cm([5.2, 4.6, -9.6], [2.6, 4.3, -11.4], L.k); camera.lookAt(-2.4, 3.5, -21.7); camera.fov = 44; sh(V(-1.5, 0, -21.6), 12); }, [[0, 'murmur', .35], [.25, 'cloth', .45], [.6, 'sparkle', .3]]);
// 12 «für etwas Wichtiges auf.»: una boda delante de la iglesia: los novios, los botones intactos, lluvia de confeti
shot(12.03, 'Z', null, L => { town(L); const a = put(EX[5], -2.4, 0, -96, .3), b = put(EX[1], 2.4, 0, -96, -.3); [a, b].forEach((c, i) => { actuar(c, 0, [[0, { aRx: i ? .5 : .2, aLx: i ? .2 : .5, aLz: i ? 0 : -.5, aRz: i ? -.5 : 0, aLe: 1, aRe: 1, headY: i ? -.3 : .3 }]], { T: L.T }); grin(c, L.T); });
  confRain(V(0, 0, -96), L.T); crowdAt(L, 0, -92, 10, 8, 18, 8, { mode: 'cheer' }); orb(L.k, V(0, 3.6, -96), null, [22, .1, .2, 44], [17, -.05, .16, 44]); sh(V(0, 0, -96), 24); }, [[0, 'church_bells', .5], [.2, 'cheer', .35]]);
// 13 «Manche benutzen ihn, um einen schrecklichen Fehler»: un camarero tropieza y la tarta vuela
shot(13.24, 'C', null, L => { town(L); const c = put(EX[6], 30, 0, -26, -PI / 2 + .3); const tr = L.lt > .6, k = clamp((L.lt - .6) / .6);
  if (!tr) { actuar(c, 0, [[0, { ...walkP(L.T, 1), aLx: 1.4, aRx: 1.4, aLe: .9, aRe: .9 }]], { T: L.T }); c.root.position.x -= L.lt * 3; attach(CAKE, c.aR.hand, [-.9, -.8, .6], [0, 0, 0], 1); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); }
  else { c.root.position.x -= 1.8 + k * 1.2; c.root.rotation.z = -k * .5; actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' }); const p = arc([27, 5, -26], [22, .4, -26], 3, k); show(CAKE, p.x, p.y, p.z); CAKE.rotation.z = k * 3; if (k >= 1) { CAKE.scale.set(1.6, .3, 1.6); dust(V(22, 0, -26), L.t0 + 1.2, L.T, 8, .6); } }
  crowdAt(L, 30, -26, 6, 7, 16, 9, { mode: L.lt > 1 ? 'shock' : 'talk' }); cm([24, 7, -4], [23, 6.4, -8], L.k); camera.lookAt(26, 3, -26); camera.fov = 46; sh(V(26, 0, -26), 20); }, [[.6, 'trip', .6], [1.2, 'splat', .7], [1.3, 'gasp_crowd', .4]]);
// 14 «rückgängig zu machen.»: pulsa su botón: la tarta vuelve volando a sus manos
shot(14.88, 'R', null, L => { town(L); const c = put(EX[6], 27, 0, -26, -PI / 2 + .3); const k = clamp((L.lt - .25) / .7);
  actuar(c, L.lt, [[0, { aRx: .95, aRz: -.42, aRe: 1.75, headX: .3 }], [.3, { aLx: 1.4, aRx: 1.4, aLe: .9, aRe: .9 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > .9 ? 'relief' : 'determined', mouth: L.lt > .9 ? 'open_smile' : 'flat' });
  c.knopfOn(L.lt < .2); if (L.lt > .15) ringwave(kp(c), clamp((L.lt - .15) / .7), camera.position, 10); const p = arc([22, .4, -26], [25.6, 5.2, -25.4], 3, easeOut(k)); show(CAKE, p.x, p.y, p.z); CAKE.rotation.z = (1 - k) * 3;
  grade.uniforms.sepia.value = .25 * (1 - k); cm([23, 6.4, -8], [24, 6.6, -10], L.k); camera.lookAt(25, 3.4, -26); camera.fov = 44; sh(V(26, 0, -26), 20); badge('cyan', 'RÜCKGÄNGIG', W / 2, H * .17, clamp((L.lt - .5) / .2), 1, .9); }, [[.15, 'button_click', .7], [.2, 'rewind', .6]]);
// 15 «Andere sparen ihn für den Tag,»: una pareja mayor en un banco al atardecer, de la mano
shot(16.10, 'W', null, L => { town(L, { dusk: true }); const a = sit(EX[25], -40, 2.55, -9.4, PI / 2, L, { aRx: .6, aRz: .3, aRe: .4, headY: .3 }), b = sit(EX[20], -40, 2.55, -6.4, PI / 2, L, { aLx: .6, aLz: .3, aLe: .4, headY: -.3 }); grin(a, L.T, { mouth: 'smile' }); cara(b, L.T, { expr: 'warm', mouth: 'smile' });
  cm([-25, 6, -8.6], [-27, 5.6, -8], L.k); camera.lookAt(-40, 4.6, -7.9); camera.fov = 42; sh(V(-40, 0, -8), 14); }, [[0, 'birds_evening', .4]]);
// 16 «an dem sie jemanden verlieren, den sie lieben.»: ella sola en el banco con la foto; una lágrima; la mano junto al botón
shot(17.56, 'B', 'slow', L => { town(L, { dusk: true }); const a = sit(EX[25], -40, 2.55, -8, PI / 2, L, { aLx: .7, aRx: .55, aLz: -.15, aRz: -.45, aLe: .9, aRe: 1.2, headX: .3 }); cara(a, L.T, { expr: 'cry', mouth: 'frown' }); tears(a, L.T); attach(PHOTO, a.aL.hand, [.3, -.7, .4], [-.9, .2, 0], .7);
  grade.uniforms.sat.value = 1.0; onFace(a, 6.6, .2, -.6, 40, L.k, 5.2); sh(V(-40, 0, -8), 12); }, [[0, 'sad_piano_hit', .4]]);
// 17 «Aber mein Opa?»: golpe de zoom: mi Opa en su banco, levanta la vista de la talla y guiña un ojo
shot(19.26, 'Z', 'punch', L => { const c = opaBench(L, { btn: false }); cara(c, L.T, { expr: 'warm', eyes: L.lt > .4 ? 'wink' : 'happy', mouth: 'grin' }); applyPose(c, {}); actuar(c, 0, [[0, sitPose({ aLx: 1.1, aRx: 1.2, aLz: -.25, aRz: -.3, aLe: 1.5, aRe: 1.6, headX: -.05 })]], { T: L.T, weight: false });
  onFace(c, 6, .2, .6, 40, L.k, 5); badge('tag', 'OPA', W / 2, H * .16, clamp((L.lt - .05) / .15), 1, 1); sh(OB, 14); }, [[0, 'whoosh_up', .4], [.4, 'wink', .5]]);
// 18 «Er hat seinen für mich benutzt.»: el Opa con la mano en mi cabeza: su barriga sin botón (solo la marca), el mío brillando
shot(20.07, 'S', 'slow', L => { opaS(L); const o = put(opa, OPX, 0, 9.2, 0); opaBtn(o, L.T, false); actuar(o, 0, [[0, { aRx: .85, aLx: .85, aRz: .12, aLz: .12, aRe: .9, aLe: .9, headX: .4 }]], { T: L.T }); cara(o, L.T, { expr: 'warm', mouth: 'smile' });
  const k = put(kl, OPX, 0, 11.3, 0); cara(k, L.T, { expr: 'happy', mouth: 'open_smile' }); actuar(k, 0, [[0, { headX: -.2 }]], { T: L.T });
  cm([OPX + .6, 5.2, 24], [OPX + .3, 4.2, 18.5], L.k); camera.lookAt(OPX, 3.4, 10); camera.fov = 44; sh(V(OPX, 0, 10), 16); }, [[0, 'heartbeat_soft', .4]]);
// 19 «Und ich wusste es nicht einmal.»: yo, pequeño, en la plaza, me encojo de hombros: «?»
shot(21.57, 'F', null, L => { town(L); const c = put(kl, KP.x, 0, KP.z, .2); actuar(c, L.lt, [[0, {}], [.1, GEST.shrug]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'wavy' }); crowdAt(L, KP.x, KP.z - 6, 8, 6, 20, 10, { mode: 'walk' });
  onBody(c, 15, 0, .1, 42, L.k, 12); badge('q', '?', W / 2, H * .2, clamp((L.lt - .2) / .15), 1, 1); sh(KP, 16); }, [[.1, 'hmm', .5]]);

// ---------- el peor día ----------
// 20 «Als ich klein war,»: salgo de casa por la mañana, pequeño, con mi camiseta del 9
shot(23.06, 'W', null, L => { town(L); const c = put(kl, -40 + L.lt * 2.4, 0, 14, PI / 2); actuar(c, 0, [[0, walkP(L.T, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9)) * .1; cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  crowdAt(L, -24, 0, 6, 8, 18, 11, { mode: 'walk' }); cm([-30, 4.4, 24], [-32, 4, 21], L.k); camera.lookAt(-39 + L.lt * 2.4, 2.6, 14); camera.fov = 44; sh(V(-42, 0, 14), 18); badge('tag', '9 JAHRE', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, .9); }, [[0, 'door_open', .5], [.3, 'steps', .4]]);
// 21 «hatte ich den schlimmsten Tag meines Lebens.»: nube gris sobre mí, la plaza se apaga: «SCHLIMMSTER TAG»
shot(24.02, 'C', 'slow', L => { town(L, { dusk: true }); const c = put(kl, KP.x, 0, KP.z, 0); actuar(c, 0, [[0, GEST.slump]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); grade.uniforms.sat.value = .75;
  orb(L.k, V(KP.x, 2.4, KP.z), null, [16, .3, .18, 44], [10, .2, .1, 42]); badge('red', 'SCHLIMMSTER TAG', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, .85); sh(KP, 14); }, [[0, 'thunder_far', .5]]);
// 22 «Weil mein Wecker nicht klingelte,»: mi cuarto: duermo; el despertador, apagado
shot(25.72, 'S', null, L => { meinZimmer(L, { dark: true }); const c = put(kl, ZIX + 13, 3.6, -5.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -PI / 2; applyPose(c, { aLz: .2, aRz: .2 }); cara(c, L.T, { eyes: 'closed', mouth: Math.sin(L.T * 3) > 0 ? 'o' : 'flat' }); c.blob.visible = false;
  show(ALARM, ZIX + 6, 4.4, -10.4, 0, .55); ALARM.userData.show('--:--', '#ff3a3a'); cm([ZIX + 4.6, 11, 3], [ZIX + 5.6, 10, 1.4], L.k); camera.lookAt(ZIX + 12.4, 3.4, -6.8); camera.fov = 46; badge('big', 'Zzz', W * .62, H * .3, clamp(L.lt / .2), 1, .8); }, [[0, 'snore', .5], [.6, 'clock_tick', .4]]);
// 23 «wachte ich erst um 7 Uhr»: me despierto de golpe, ojos como platos
shot(27.35, 'Z', 'punch', L => { meinZimmer(L); const c = put(kl, ZIX + 13, 3.6, -5.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -PI / 2 + easeOut(clamp(L.lt / .35)) * 1.2; applyPose(c, GEST.shock); cara(c, L.T, { expr: 'shock', mouth: 'scream' }); c.blob.visible = false;
  const h = hp(c); cam([h.x - .6, h.y + 1.6, h.z + 6.4], [h.x, h.y + .2, h.z], 42); }, [[0, 'gasp', .6], [0, 'sheet_rustle', .5]]);
// 24 «52 auf.»: el despertador: 7:52 en rojo parpadeando
shot(28.59, 'C', 'punch', L => { meinZimmer(L); show(ALARM, ZIX + 6, 4.4, -10.4, 0, .55); ALARM.userData.show('7:52', '#ff3a3a', true, L.T); cm([ZIX + 6.2, 5.2, -5.2], [ZIX + 6, 4.9, -6.6], L.k); camera.lookAt(ZIX + 6, 4.5, -10.4); camera.fov = 40;
  badge('red', '7:52', W / 2, H * .2, clamp((L.lt - .05) / .15), 1, 1.2); }, [[0, 'alarm_beep', .6]]);
// 25 «Beim Frühstück kippte ich mir in der Eile»: la cocina: como a toda prisa, de pie, la taza al borde
shot(30.00, 'W', null, L => { kuecheS(L); const c = put(kl, KUX - 1, 0, 6.6, PI); actuar(c, 0, [[0, { aRx: 2.2, aRz: -.4, aRe: 2.0, aLx: 1.1, aLe: .6, lean: .12, headX: Math.sin(L.T * 9) * .08 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: Math.sin(L.T * 12) > 0 ? 'o' : 'flat' }); c.root.position.y = Math.abs(Math.sin(L.T * 11)) * .08;
  show(MUG, KUX - 1.4, 3.85, 4.2); cm([KUX + 5, 7.4, 14], [KUX + 4, 7, 12.6], L.k); camera.lookAt(KUX - 1, 3.8, 5.6); camera.fov = 44; }, [[0, 'kitchen_clatter', .5], [.4, 'munch', .5]]);
// 26 «Kakao über die Klamotten,»: el codo da a la taza: cacao volando, mancha marrón en la camiseta
shot(31.54, 'C', 'punch', L => { kuecheS(L); const c = put(kl, KUX - 1, 0, 6.6, PI); const k = clamp(L.lt / .35); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' });
  show(MUG, KUX - 1.4, 3.85, 4.2 + k * .4); MUG.rotation.x = k * 1.6; if (L.lt > .25) { const s = clamp((L.lt - .25) / .3); STAIN.visible = true; c.spine.add(STAIN); STAIN.position.set(.15, 1.45, .6); STAIN.scale.set(s, s * 1.1, 1); show(SPILL, KUX - 1.4, 3.88, 5); SPILL.rotation.x = -PI / 2; SPILL.scale.setScalar(s * 1.2); }
  onBody(c, 9, .3, .12, 42, L.k, 8, .2, 2.8); }, [[.05, 'mug_tip', .7], [.2, 'splash', .7]]);
// 27 «sodass ich auch noch zu»: corro por el patio del colegio con la camiseta manchada
shot(32.68, 'S', null, L => { schulS(L); const c = put(kl, SCX - 6 + L.lt * 2, 0, 10 - L.lt * 9, PI - .2); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .3; cara(c, L.T, { expr: 'worried', mouth: 'o' }); c.spine.add(STAIN); STAIN.visible = true; STAIN.position.set(.15, 1.45, .6); STAIN.scale.set(1, 1.1, 1);
  cam([SCX - 1 + L.lt * 2, 4.2, 18 - L.lt * 9], [SCX - 6 + L.lt * 2, 2.6, 8 - L.lt * 9], 42); sh(V(SCX, 0, 0), 30); }, [[0, 'run_steps', .6], [.2, 'school_bell', .4]]);
// 28 «spät zur Schule kam.»: la maestra en la puerta, brazos cruzados, señala el reloj: «ZU SPÄT!»
shot(33.58, 'Z', null, L => { schulS(L); const t = put(lehr, SCX + 2.4, 0, -21, -.35); actuar(t, L.lt, [[0, GEST.cross], [.4, { aRx: 1.9, aRz: -.3, aRe: 1.6, aLx: 1.2, aLz: -.5, aLe: 1.8 }]], { T: L.T }); cara(t, L.T, { expr: 'angry', mouth: 'frown' });
  const c = put(kl, SCX - 2.6, 0, -16.5, PI - .6); actuar(c, 0, [[0, { ...GEST.cower, crouch: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  cm([SCX - 1, 5, -3], [SCX - .4, 4.6, -5.5], L.k); camera.lookAt(SCX, 3.4, -19); camera.fov = 44; sh(V(SCX, 0, -18), 16); badge('red', 'ZU SPÄT!', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, 1); }, [[.1, 'tsk', .5], [.3, 'clock_tick', .4]]);
// 29 «Und als endlich mein Fußballspiel kam,»: el campo del SV Lindenthal: los dos equipos salen, la grada llena
shot(34.66, 'Z', null, L => { sportS(L); TEAM.forEach((c, i) => { const x = -10 + i * 4; put(c, SPX + x, 0, -2 + L.lt * 1.5, PI); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'happy', mouth: 'smile' }); }); const k = put(kl, SPX + 14, 0, -2 + L.lt * 1.5, PI); actuar(k, 0, [[0, walkP(L.T, 7)]], { T: L.T }); cara(k, L.T, { expr: 'determined', mouth: 'flat' });
  RIV.forEach((c, i) => { put(c, SPX - 8 + i * 4, 0, -14, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, headY: Math.sin(L.T + i) * .3 }]], { T: L.T }); cara(c, L.T + i, { expr: 'smug', mouth: 'smirk' }); });
  crowdAt(L, SPX - 30, 0, 12, 0, 14, 12, { mode: 'sitcheer', seat: 2.65, ry: PI / 2, list: EX }); cm([SPX + 26, 16, 30], [SPX + 20, 12, 22], L.k); camera.lookAt(SPX, 2, -6); camera.fov = 48; sh(V(SPX, 0, -6), 44); }, [[0, 'stadium_crowd', .5], [.3, 'whistle', .5]]);
// 30 «verschoss ich den leichtesten»: el penalti: cojo carrerilla; el portero rival agachado
shot(36.50, 'S', null, L => { sportS(L); const c = put(kl, SPX + 1.6, 0, -18 + Math.min(L.lt, .9) * 3.4, PI); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .25; cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  show(BALL, SPX, .55, -25); const g = put(tw, SPX, 0, -33.6, 0); actuar(g, 0, [[0, { ...GEST.brace, aLz: 1.1, aRz: 1.1 }]], { T: L.T }); cara(g, L.T, { expr: 'determined', mouth: 'grimace' }); g.root.position.x += Math.sin(L.T * 6) * .5;
  cm([SPX + 9, 4, -12], [SPX + 8, 3.8, -13.5], L.k); camera.lookAt(SPX - .5, 2.4, -26); camera.fov = 46; sh(V(SPX, 0, -26), 18); badge('tag', 'ELFMETER', W / 2, H * .16, clamp((L.lt - .2) / .2), 1, .9); }, [[0, 'run_steps', .5], [.2, 'crowd_tense', .4]]);
// 31 «Elfmeter»: ¡pum! el balón sale altísimo por encima de la portería
shot(37.54, 'C', 'punch', L => { sportS(L); const c = put(kl, SPX + .6, 0, -23.6, PI + .1); actuar(c, L.lt, [[0, { lRx: -.9, lLx: .3, aLz: .6, aRz: .6, aLx: .3, lean: -.2 }], [.12, { lRx: 1.5, lRk: .1, lLx: -.2, aLz: .9, aRz: .9, lean: -.35, headX: -.3 }, { dur: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  const k = clamp((L.lt - .12) / .7); const p = arc([SPX, .55, -25], [SPX - 2, 13, -44], 4, k); show(BALL, p.x, p.y, p.z); BALL.rotation.x = -L.T * 20; const g = put(tw, SPX - Math.min(k, .5) * 6, 0, -33.6, 0); actuar(g, 0, [[0, GEST.brace]], { T: L.T });
  cm([SPX + 7, 3, -15], [SPX + 6.4, 3.2, -16], L.k); camera.lookAt(SPX - .5, 3.2 + k * 4, -29); camera.fov = 50; sh(V(SPX, 0, -28), 20); }, [[.12, 'kick', .9], [.3, 'whoosh_ball', .5]]);
// 32 «Lebens.»: el balón vuela por encima de la red y se pierde entre los pinos
shot(38.32, 'W', null, L => { sportS(L); const k = clamp(L.lt / .54); show(BALL, SPX - 2, 13 + k * 4, -46 - k * 16); BALL.rotation.x = -L.T * 20; const g = put(tw, SPX - 3, 0, -33.6, .2); actuar(g, 0, [[0, GEST.point]], { T: L.T }); laughF(g, L.T);
  cm([SPX + 2, 3, -20], [SPX + 2, 3.4, -21], L.k); camera.lookAt(SPX - 2, 9 + k * 3, -46); camera.fov = 50; sh(V(SPX, 0, -36), 24); }, [[0, 'crowd_ohh', .6]]);
// 33 «Deshalb haben wir verloren.»: el marcador 0 : 1; los rivales lo celebran
shot(38.86, 'R', null, L => { sportS(L, { score: [0, 1] }); RIV.forEach((c, i) => { crowdGuy(c, SPX - 6 + i * 3, -42, L, i, { mode: 'cheer', face: V(SPX, 3, -20) }); });
  cm([SPX, 6, -26], [SPX, 8, -30], L.k); camera.lookAt(SPX, 11, -50); camera.fov = 48; sh(V(SPX, 0, -46), 24); badge('red', 'VERLOREN', W / 2, H * .66, clamp((L.lt - .3) / .2), 1, .9); }, [[0, 'buzzer', .5], [.2, 'cheer', .4]]);
// 34 «Wegen mir.»: mis compañeros me miran mal; yo, cabizbajo en medio
shot(39.94, 'I', 'slow', L => { sportS(L, { dusk: true }); const c = put(kl, SPX, 0, -10, 0); actuar(c, 0, [[0, { ...GEST.slump, headX: .22 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  TEAM.slice(0, 4).forEach((t, i) => { const a = -1.3 + i * .85, x = SPX + Math.sin(a + PI) * 5.5, z = -10 + Math.cos(a + PI) * 5.5; put(t, x, 0, z, faceTo(V(x, 0, z), V(SPX, 0, -10))); actuar(t, 0, [[0, i % 2 ? GEST.cross : GEST.point]], { T: L.T }); cara(t, L.T + i, { expr: 'angry', mouth: 'frown' }); });
  orb(L.k, V(SPX, 2.2, -10), null, [14, .1, .3, 44], [9, .05, .2, 42]); sh(V(SPX, 0, -10), 16); }, [[0, 'grumble', .5]]);
// 35 «Ich kam weinend»: vuelvo a casa por la calle, de noche, arrastrando los pies
shot(40.91, 'W', null, L => { town(L, { dusk: true }); const c = put(kl, -20 + L.lt * 2, 0, 24, PI / 2); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), lean: .2, headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'cry', mouth: 'frown' }); c.spine.add(STAIN); STAIN.visible = true; STAIN.position.set(.15, 1.45, .6); STAIN.scale.set(1, 1.1, 1);
  cm([-6, 4, 34], [-8, 3.8, 32], L.k); camera.lookAt(-18 + L.lt * 2, 2.6, 24); camera.fov = 42; sh(V(-18, 0, 24), 16); }, [[0, 'steps_slow', .5], [.3, 'sniff', .5]]);
// 36 «nach Hause.»: primer plano: lloro, lágrimas
shot(41.80, 'F', null, L => { town(L, { dusk: true }); const c = put(kl, -16, 0, 24, .4); actuar(c, 0, [[0, { headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'cry', mouth: Math.sin(L.T * 10) > 0 ? 'frown' : 'grimace' }); tears(c, L.T); onFace(c, 3.4, .1, .3, 40, L.k, 2.8); sh(V(-16, 0, 24), 10); }, [[0, 'sob', .6]]);
