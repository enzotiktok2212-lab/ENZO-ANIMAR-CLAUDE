// ---------- a: gancho, Glanz y el Aura-Meter, el Kommando Robbe, los castigos, la aura negativa (0 – 54,30 s) ----------
const P0 = V(-6, 0, -22);   // centro de la plaza delante del Rathaus
const cool1 = EX[3], cool2 = EX[9], cool3 = EX[15];
// pose «aura farming»: un brazo en el pelo, el otro en el bolsillo, inclinado hacia atrás
const FARM = { aRx: 2.6, aRz: .2, aRe: 1.9, aLx: .25, aLz: -.25, aLe: .8, lean: -.12, headX: -.18, headZ: .1, lLx: .15, lRx: -.1 };
// caída cómica (zap): de pie → de espaldas en el suelo, con estrellitas
function zap(c, x, z, ry, L, tz, o = {}) { const q = clamp((L.T - tz) / .28), e = easeIn(q); put(c, x, e * .6, z, ry); c.root.rotation.x = -e * PI / 2; actuar(c, 0, [[0, q > 0 ? GEST.shock : (o.pose || FARM)]], { T: L.T }); cara(c, L.T, q > 0 ? { expr: 'shock', eyes: 'terror', mouth: 'scream' } : { expr: 'smug', mouth: 'smirk' }); if (q >= 1) dizzy(c, L.T); return q; }

// 1 «In dieser Stadt» (zoom lento): la plaza llena, el Aura-Meter arriba; un chico hace aura farming y ya tiene el punto láser en la frente
shot(0, 'Z', 'slow', L => { town(L); meter(lerp(92, 99, L.k), 'TIM'); const c = put(cool1, P0.x, 0, P0.z, 0); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); crowdAt(L, P0.x, P0.z, 16, 7, 24, 3, { mode: 'point' });
  orb(L.k, V(P0.x, 12, P0.z), V(P0.x, 4.4, P0.z), [30, .02, .34, 50], [11, .0, .1, 44]); if (L.lt > .4) dots(c, 1, L.T); sh(V(P0.x, 0, P0.z), 40); }, [[0, 'whoosh_up', .6], [.1, 'city_amb', .4], [.5, 'blink', .4]]);
// 2 «ist Aura-Farmen verboten.»: cartel AURA VERBOTEN y una chica que posa delante (golpe de zoom)
shot(1.09, 'C', 'punch', L => { town(L); const c = put(cool2, -27, 0, 24, PI / 2 + .5); actuar(c, 0, [[0, { ...FARM, aRx: 2.7, aLx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); crowdAt(L, -27, 24, 6, 6, 14, 5, { from: 16, mode: 'walk' });
  badge('red', 'VERBOTEN!', W / 2, H * .17, (L.lt - .5) * 3); orbit(V(-27, 5, 24), lerp(15, 13, L.k), PI / 2 + .5, .1, 46); sh(V(-28, 0, 22), 20); }, [[0, 'impact', .7], [.5, 'stamp', .7]]);
cut(1.87, null, [0.5, 0.8, 0], [[0, 'whoosh_soft', .4]]);
// 3 «Sieh länger als»: primer plano de un chico con gafas de sol, sonrisa chula, viento
shot(2.43, 'W', null, L => { town(L); const c = put(cool3, 20, 0, -30, -.4); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); breeze(c, L.T, 2.6, 10);
  onFace(c, 7.6, .2, .8, 40, L.k, 6.8); sh(V(20, 0, -30), 14); }, [[0, 'wind', .5], [.2, 'sparkle', .5]]);
// 4 «drei Sekunden»: cuenta atrás 3·2·1 encima de él, su placa sube a 99
shot(3.25, 'F', null, L => { town(L); const c = put(cool3, 20, 0, -30, -.4); actuar(c, 0, [[0, { ...FARM, aRx: 2.4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  const n = 3 - Math.floor(L.lt / .24); mtag(c, 'NICO', Math.round(lerp(96, 99, L.k)), 1); badge('num', String(Math.max(1, n)), W * .78, H * .3, ((L.lt % .24) / .24) * 2 + .3, 1, 1.3);
  orbit(V(20, 3.6, -30), lerp(15, 13.5, L.k), -.55, .1, 44); sh(V(20, 0, -30), 14); }, [[0, 'tick', .6], [.24, 'tick', .6], [.48, 'tick', .7]]);
// 5 «zu cool aus,»: se coloca las gafas; el Aura-Meter marca 100 en rojo
shot(3.95, 'S', null, L => { town(L); meter(lerp(99, 100, clamp(L.k * 2)), 'NICO'); const c = put(cool3, -6, 0, -64, 0); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  orbit(V(-6, 46, -84), lerp(46, 40, L.k), .08, .22, 46); sh(V(-6, 0, -70), 50); }, [[0, 'alarm_soft', .6], [.3, 'ding_reveal', .5]]);
// 6 «und ein Scharfschütze»: francotirador en el tejado del Rathaus apuntando, láser rojo
shot(4.73, 'C', 'punch', L => { town(L); soldat(0, 8, 23.3, -86, .25, L.T, { laser: 40 });
  cm([15, 28, -75, 8, 26.6, -86, 44], [13.5, 27.6, -76, 8, 26.6, -86, 42], L.k); sh(V(9, 23, -86), 16); }, [[0, 'click_set', .7], [.4, 'metal_hit', .4]]);
// 7 «erledigt dich»: punto en la frente, destello, cae de espaldas
shot(5.77, 'F', null, L => { town(L); const c = cool3; const q = zap(c, 20, -30, -.4, L, L.t0 + .3); if (q <= 0) dots(c, 1, L.T); if (q > 0 && q < .5) grade.uniforms.flash.value = .5;
  show(SHADES, 20 + q * 2.5, 6 + q * 2 - q * q * 5, -29 + q, q * 6); orbit(V(20, 3.4 - q * 1.6, -30), 12, -.4, .16, 44); crowdAt(L, 20, -30, 6, 9, 16, 7, { mode: 'shock', from: 20 }); sh(V(20, 0, -30), 14); }, [[.3, 'impact', .8], [.36, 'thud', .6], [.5, 'gasp', .5]]);
// 8 «aus drei Kilometern Entfernung.»: la cámara se aleja del tejado hasta la torre del Dom; cartel 3 KM
shot(6.47, 'Z', null, L => { town(L); const sx = DOMX + 13 - 8, sz = DOMZ + 45 + 8; soldat(2, sx, 70.5, sz, -.5, L.T, { laser: 120 }); const p = V(sx, 74, sz);
  cm([p.x + 2, p.y + 1.5, p.z + 9, p.x, p.y - .5, p.z, 40], [p.x + 40, p.y + 40, p.z + 90, p.x - 10, p.y - 30, p.z - 20, 52], L.k, easeIn); badge('gold', '3 KM', W / 2, H * .18, (L.lt - .3) * 3); sh(p, 30); }, [[0, 'zoom_out', .6], [.3, 'wind', .4]]);
cut(7.33, null, [0.4, 1, 0], [[0, 'cloth', .4]]);
// 9 «Und schuld daran ist»: fachada del Rathaus, la cámara sube por la escalinata
shot(8.01, 'W', null, L => { town(L); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, GEST.wave]], { T: L.T }); grin(g, L.T); crowdAt(L, -6, -60, 14, 4, 16, 9, { mode: 'clap', face: V(-6, 4, -79) });
  orb(L.k, V(-6, 8, -79), null, [40, -.3, .2, 48], [32, -.15, .14, 46]); sh(V(-6, 0, -75), 40); }, [[0, 'cheer', .5], [.2, 'steps', .3]]);
// 10 «unser Bürgermeister,»: Glanz saluda desde la escalinata (contrapicado)
shot(9.07, 'C', 'punch', L => { town(L); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, { ...GEST.wave, aRz: .3 + Math.sin(L.T * 9) * .3 }]], { T: L.T }); grin(g, L.T);
  orbit(V(-6, 8.4, -79), lerp(14, 12.5, L.k), .25, -.02, 44); sh(V(-6, 0, -79), 16); }, [[0, 'impact_soft', .6], [.2, 'cheer', .4]]);
// 11 «Konrad Glanz,» (zoom lento): primer plano, se baja las gafas doradas, nombre
shot(9.77, 'I', 'slow', L => { town(L); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, { aRx: 2.2, aRz: -.3, aRe: 2.2, headX: -.1 }]], { T: L.T }); talk(g, L.T, 9.77, 10.97, 'smug');
  onFace(g, 6.2, .1, -.6, 40, L.k, 5.2); badge('tag', 'BÜRGERMEISTER KONRAD GLANZ', W / 2, H * .17, (L.lt - .2) * 3, 1, .8); sh(V(-6, 0, -79), 12); }, [[0, 'sparkle', .5]]);
// 12 «denn niemand darf cooler sein»: Glanz señala con el dedo a la multitud, la gente se encoge
shot(10.97, 'S', null, L => { town(L); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, GEST.point]], { T: L.T }); cara(g, L.T, { expr: 'angry', mouth: 'grimace' }); crowdAt(L, -6, -64, 14, 3, 14, 11, { mode: 'cower', face: V(-6, 4, -79) });
  orb(L.k, V(-6, 6, -74), null, [24, .75, .18, 48], [22, .65, .16, 48]); sh(V(-6, 0, -68), 26); }, [[0, 'whoosh', .4], [.3, 'murmur', .4]]);
// 13 «als er.»: Glanz se mira en un espejo de mano, brillo dorado
shot(12.21, 'R', null, L => { town(L); const g = put(glanz, -6, 3.6, -79, .3); actuar(g, 0, [[0, GEST.cross]], { T: L.T }); grin(g, L.T); hearts(hp(g).add(V(0, 1.5, 0)), L.T); orbit(V(-6, 8.4, -79), 14.5, .55, .08, 42); sh(V(-6, 0, -79), 12); }, [[0, 'sparkle', .6]]);
// 14 «Deshalb hängt oben am Rathaus»: grúa desde la plaza hasta lo alto del Rathaus
shot(12.95, 'Z', null, L => { town(L); crowdAt(L, -6, -40, 14, 6, 20, 13, { mode: 'walk' }); cm([-6, 6, -20, -6, 20, -90, 50], [-6, 38, -40, -6, 54, -91, 48], L.k, easeInOut); sh(V(-6, 0, -60), 50); }, [[0, 'swoosh_up', .6], [.4, 'wind', .3]]);
cut(13.77, null, [-0.4, 1, 0], [[0, 'swipe', .4]]);
// 15 «der Aura-Meter.» (zoom lento): el medidor gigante, la aguja oscila
shot(14.35, 'F', 'slow', L => { town(L); meter(60 + Math.sin(L.T * 5) * 30, 'LIVE'); orbit(V(-6, 53, -91), lerp(30, 24, L.k), -.12, .05, 44); sh(V(-6, 30, -91), 40); }, [[0, 'machine_hum', .5], [.3, 'ticks', .5]]);
// 16 «Er misst die Aura von jedem,»: la plaza con placas sobre cada cabeza
const TAGS = [['LUKAS', 23], ['PIA', 41], ['EMIR', 12], ['ANNA', 57], ['JONAS', 8], ['MIA', 34], ['FELIX', 66], ['LEA', 19]];
shot(15.52, 'W', null, L => { town(L); const list = EX.slice(8, 16); list.forEach((c, i) => { const x = -18 + (i % 4) * 8 + (i > 3 ? 4 : 0), z = -24 - (i > 3 ? 9 : 0); put(c, x, 0, z, Math.sin(i) * .3); actuar(c, 0, [[0, walkP(L.T, i, 4)]], { T: L.T }); cara(c, L.T + i, { expr: 'neutral' }); mtag(c, TAGS[i][0], TAGS[i][1], (L.lt - i * .08) * 3); });
  orb(L.k, V(-4, 5, -28), null, [26, .1, .22, 48], [23, -.05, .2, 48]); sh(V(-6, 0, -28), 30); }, [[0, 'murmur', .4], [.3, 'pling', .4], [.7, 'pling', .3]]);
cut(16.3, null, [0.5, 0.85, 0], [[0, 'tick', .4]]);
// 17 «live,»: el medidor salta de nombre en nombre
shot(17.18, 'C', 'punch', L => { town(L); const i = Math.floor(L.lt / .14) % TAGS.length; meter(TAGS[i][1], TAGS[i][0]); orbit(V(-6, 50, -91), 32, .15, .02, 42); badge('red', '● LIVE', W / 2, H * .16, L.lt * 4, 1, .8); sh(V(-6, 40, -91), 30); }, [[0, 'glitch', .5], [.2, 'ticks', .4]]);
// 18 «rund um die Uhr.»: de noche, el medidor brilla sobre los tejados (la luna pasa)
shot(17.74, 'S', null, L => { town(L, 'night'); meter(40 + Math.sin(L.T * 3) * 20, 'NACHT'); orb(L.k, V(-6, 46, -91), null, [80, .55, .12, 50], [70, .35, .14, 50]); badge('gold', '24 / 7', W / 2, H * .17, (L.lt - .1) * 3); sh(V(-6, 0, -91), 60); }, [[0, 'clock_tick', .5], [.3, 'owl', .3]]);
// 19 «Glanz steht immer auf hundert.»: Glanz posa al lado de su placa GLANZ 100
shot(18.62, 'I', null, L => { town(L); meter(100, 'GLANZ'); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, GEST.cross]], { T: L.T }); grin(g, L.T);
  orb(L.k, V(-6, 9, -79), null, [16, -.35, .1, 46], [14, -.2, .1, 46]); badge('gold', '100', W / 2, H * .17, (L.lt - .9) * 3, 1, 1.1); sh(V(-6, 0, -79), 16); }, [[0, 'ding_soft', .5], [.9, 'cash', .5]]);
cut(19.44, null, [0.6, 0.8, 0], [[0, 'pling', .4]]);
// 20 «Wer die hundert erreicht,»: un vecino baila chulo, su placa sube a 100
shot(20.31, 'W', null, L => { town(L); const c = put(EX[21], 6, 0, 10, -.3); actuar(c, 0, [[0, { ...FARM, hipY: Math.sin(L.T * 8) * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); mtag(c, 'TOBI', Math.round(lerp(94, 100, L.k)), 1);
  orbit(V(6, 3.8, 10), lerp(13, 11.5, L.k), -.3, .12, 44); sh(V(6, 0, 10), 16); }, [[0, 'pling', .5], [.7, 'alarm_soft', .6]]);
// 21 «wird gelöscht,»: puf — desaparece en una nube con chispas (solo quedan los zapatos)
shot(21.41, 'C', null, L => { town(L); const t = L.lt - .12; if (t < 0) { const c = put(EX[21], 6, 0, 10, -.3); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); dots(c, 1, L.T); } else { show(SHOES, 6, 0, 10, -.3); boom(0, V(6, 0, 10), L.t0 + .12, L.T, .7); }
  crowdAt(L, 6, 10, 6, 7, 14, 15, { from: 22, mode: 'shock' }); orbit(V(6, 4.4, 10), 13, -.25, .14, 46); badge('red', 'GELÖSCHT', W / 2, H * .17, (L.lt - .2) * 3); sh(V(6, 0, 10), 16); }, [[.12, 'explosion', .7], [.2, 'gasp', .5]]);
// 22 «und zwar von seiner Spezialeinheit,»: el helicóptero aterriza en la plaza, los soldados bajan corriendo
shot(22.11, 'Z', null, L => { town(L); const hy = lerp(18, 6.5, easeOut(clamp(L.k * 1.4))); show(HELI[0], -6, hy, -50, 0); HELI[0].userData.spin(L.T); dust(V(-6, 0, -50), L.t0, L.T, 12, 2);
  for (let i = 0; i < 4; i++) { const c = put(SOL[i], -12 + i * 4, 0, -40 + Math.min(L.lt, 1) * 6, 0); actuar(c, 0, [[0, runP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'determined', eyes: 'squint' }); }
  orbit(V(-6, 5.5, -38), lerp(30, 26, L.k), .3, .12, 48); sh(V(-6, 0, -44), 30); }, [[0, 'heli', .8], [.5, 'steps_run', .5]]);
cut(22.77, null, [-0.6, 0.9, 2], [[0, 'whoosh_soft', .4]]);
// 23 «dem Kommando Robbe:»: rótulo KOMMANDO ROBBE en el costado del helicóptero
shot(23.83, 'S', 'punch', L => { town(L); show(HELI[0], -6, 6.5, -50, 0); HELI[0].userData.spin(L.T); soldat(4, 0, 0, -44, .4, L.T, { pose: { aRx: 2.7, aRz: .1, aRe: 1.6 }, rifle: false });
  cm([20, 7, -44, -5, 5.6, -51, 44], [19, 6.8, -46, -4, 5.6, -51, 44], L.k); sh(V(-6, 0, -50), 20); }, [[0, 'impact', .6], [.2, 'heli', .5]]);
// 24 «sechs Soldaten»: los seis en fila saludando (badge 6)
shot(25.05, 'W', null, L => { town(L); for (let i = 0; i < 6; i++) { const c = put(SOL[i], -10.2 + (i % 3) * 4.2 + (i > 2 ? 2.1 : 0), 0, -36 - (i > 2 ? 4 : 0), 0); const s = L.lt > i * .07; actuar(c, 0, [[0, s ? { aRx: 2.6, aRz: .45, aRe: 2.5, headX: -.05 } : {}]], { T: L.T }); cara(c, L.T + i, { expr: 'determined', eyes: 'squint', mouth: 'flat' }); }
  show(HELI[0], -6, 6.5, -56, 0); HELI[0].userData.spin(L.T); orb(L.k, V(-5, 4.6, -38), null, [24, .12, .12, 46], [21, -.08, .1, 46]); badge('gold', '6', W / 2, H * .17, (L.lt - .2) * 3, 1, 1.2); sh(V(-6, 0, -38), 22); }, [[0, 'steps_heavy', .6], [.2, 'stamp', .5]]);
// 25 «und eine echte»: la fila sigue… y al final hay un hueco bajo
shot(25.91, 'S', null, L => { town(L); for (let i = 3; i < 6; i++) { const c = put(SOL[i], -16 + i * 4.2, 0, -36, -.15); actuar(c, 0, [[0, { aRx: 2.6, aRz: .45, aRe: 2.5 }]], { T: L.T }); cara(c, L.T + i, { expr: 'determined', eyes: 'squint' }); } robbe(-16 + 6 * 4.2, 0, -36, 0, L.T, { salute: 1 });
  cm([-2, 6, -18, -1, 4.6, -36, 42], [7, 5, -22, 8, 3.2, -36, 42], L.k); sh(V(0, 0, -36), 20); }, [[0, 'whoosh_soft', .5]]);
// 26 «Robbe.» (golpe de zoom): la foca con casco saluda con la aleta
shot(26.53, 'C', 'punch', L => { town(L); robbe(9.2, 0, -36, 0, L.T, { salute: 1 }); orbit(V(9.2, 3.6, -36), lerp(9, 8, L.k), .15, .05, 42); badge('gold', 'ROBBE', W / 2, H * .17, L.lt * 4); sh(V(9, 0, -36), 12); }, [[0, 'impact', .7], [.05, 'toy', .6]]);
// 27 «Sonnenbrille» : de noche, una chica se pone gafas de sol bajo la farola
shot(26.97, 'F', null, L => { town(L, 'night'); const c = put(EX[5], 30, 0, 20, -.6); const k = clamp(L.lt / .45); actuar(c, 0, [[0, { aLx: lerp(.4, 2.4, k), aLz: -.2, aLe: lerp(.4, 2.2, k), aRx: lerp(.4, 2.4, k), aRz: -.2, aRe: lerp(.4, 2.2, k) }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  attach(SHADES, c.head, [0, lerp(1.7, .78, k), .68], [0, 0, 0], 1.0); onFace(c, 6.2, 0, .4, 40, L.k, 5.4); sh(V(30, 0, 20), 12); }, [[0, 'cloth', .5], [.4, 'click_metal', .5]]);
// 28 «nach acht Uhr abends?»: el reloj del Rathaus marca las 20:01
shot(27.80, 'S', null, L => { town(L, 'night'); show(UHR, 34, 0, 26, -.6); const c = put(EX[5], 31.5, 0, 22, -.6); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); attach(SHADES, c.head, [0, .78, .68]); orbit(V(32.5, 8.5, 24), lerp(22, 20, L.k), -.55, .02, 46); badge('gold', '20:01', W / 2, H * .17, (L.lt - .1) * 3, 1, 1.1); sh(V(-6, 0, -84), 30); }, [[0, 'clock_tick', .6], [.3, 'bell_far', .4]]);
// 29 «Abgeschossen.»: punto en la frente, destello y de espaldas; las gafas vuelan
shot(28.74, 'C', 'punch', L => { town(L, 'night'); const q = zap(EX[5], 30, 20, -.6, L, L.t0 + .1); if (q <= 0) dots(EX[5], 1, L.T); if (q > 0 && q < .4) grade.uniforms.flash.value = .55;
  show(SHADES, 30 + q * 2, 6 + q * 3 - q * q * 5, 20.5, q * 8); orbit(V(30, 3 - q * 1.4, 20), 11, -.5, .2, 46); badge('red', 'ABGESCHOSSEN', W / 2, H * .17, (L.lt - .2) * 3); sh(V(30, 0, 20), 12); }, [[.1, 'impact', .8], [.16, 'thud', .6]]);
// 30 «Du gehst von einer Explosion weg,»: camina hacia cámara, gran explosión detrás
shot(29.55, 'W', null, L => { town(L); const z = 30 + L.lt * 3; const c = put(EX[8], 26, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); attach(SHADES, c.head, [0, .78, .68]); boom(0, V(26, 0, 10), L.t0 + .1, L.T, 1.6);
  orbit(V(26, 4, z), 14, .05, .08, 44); sh(V(26, 0, z), 24); }, [[.1, 'explosion', .8], [.4, 'steps', .4]]);
cut(30.17, null, [0.5, 1.2, 0], [[0, 'cloth', .4]]);
// 31 «ohne dich umzudrehen?»: primer plano, ni se gira; el fuego se refleja
shot(31.13, 'R', null, L => { town(L); const z = 34.5 + L.lt * 3; const c = put(EX[8], 26, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); attach(SHADES, c.head, [0, .78, .68]); boom(0, V(26, 0, 12), L.t0 - 1.1, L.T, 1.6);
  onFace(c, 7.6, 0, -.5, 40, L.k, 6.8); sh(V(26, 0, z), 16); }, [[0, 'fire_roar', .5]]);
// 32 «Dann schicken sie»: el helicóptero dispara un cohete
shot(32.16, 'S', null, L => { town(L); show(HELI[1], 26, 30, -20, PI); HELI[1].userData.spin(L.T); rocketPath(0, u => V(26, 28 - u * 26, -16 + u * 52), L.k * .6);
  cm([40, 30, -6, 26, 28, -20, 50], [38, 29, -2, 26, 24, -12, 50], L.k); sh(V(26, 0, 0), 40); }, [[0, 'heli', .6], [.1, 'ignite', .7], [.2, 'whoosh', .6]]);
// 33 «eine noch größere.»: explosión gigante que lo engulle (el tipo vuela cómicamente)
shot(32.86, 'C', 'punch', L => { town(L); boom(1, V(26, 0, 38), L.t0 + .05, L.T, 3.2); const t = L.lt; if (t < .1) { const c = put(EX[8], 26, 0, 38, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); }
  else { const c = put(EX[8], 26 + t * 4, 2 + t * 14 - t * t * 8, 38 + t * 10, 0); c.root.rotation.x = t * 6; actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); }
  orbit(V(26, 8, 40), 42, .25, .15, 50); badge('red', 'XXL', W / 2, H * .17, (t - .2) * 3, 1, 1.1); sh(V(26, 0, 38), 40); }, [[.05, 'explosion', 1], [.1, 'boom', .8]]);
// 34 «Deine Schuhe laufen alleine weiter.»: entre el humo, solo los zapatos siguen andando
shot(33.78, 'F', null, L => { town(L); const z = 40 + L.lt * 3.2, st = Math.sin(L.T * 9); show(SHOES, 26, Math.max(0, st) * .3, z, 0, 1); SHOES.children.forEach((m, i) => { m.position.z = (i < 2 ? 1 : -1) * st * .5; });
  dust(V(26, 0, z - 6), L.t0 - .3, L.T, 10, 1.4); cm([30, 2.5, z + 9, 26, .8, z, 40], [29, 2.2, z + 8, 26, .8, z, 40], L.k); sh(V(26, 0, z), 12); }, [[0, 'steps', .6], [.6, 'steps', .5]]);
shot(34.61, 'W', null, L => { town(L); const z = 42.6 + L.lt * 3.2, st = Math.sin(L.T * 9); show(SHOES, 26, Math.max(0, st) * .3, z, 0, 1); SHOES.children.forEach((m, i) => { m.position.z = (i < 2 ? 1 : -1) * st * .5; }); crowdAt(L, 26, z, 5, 6, 12, 19, { mode: 'shock', from: 6 });
  orbit(V(26, 1.5, z), 9, -.6, .3, 44); sh(V(26, 0, z), 14); }, [[0, 'steps', .5], [.3, 'gasp', .4]]);
// 35 «Du lehnst lässig mit einem Fuß»: apoyado en la farola, un pie arriba
const LT = V(-30, 0, 46);
const leaner = (L) => { show(LAT, LT.x, 0, LT.z, PI / 2); const c = put(EX[13], LT.x, 0, LT.z + 1.3, .35); actuar(c, 0, [[0, { lean: -.1, aRx: .2, aRz: -.3, aRe: .5, aLx: 2.5, aLz: .25, aLe: 2.1, lRx: -.45, lRk: 1.5, headX: -.12 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); return c; };
shot(35.45, 'S', null, L => { town(L); leaner(L); orb(L.k, V(LT.x + .3, 4.2, LT.z + 1), null, [14, .55, .12, 44], [12, .35, .1, 44]); sh(LT, 16); }, [[0, 'whistle', .4], [.4, 'cloth', .4]]);
shot(36.30, 'Z', null, L => { town(L); leaner(L); cm([LT.x + 6, 2, LT.z + 11, LT.x, 2, LT.z + .6, 42], [LT.x + 5, 3.4, LT.z + 11, LT.x, 3.4, LT.z + .6, 42], L.k); sh(LT, 10); }, [[0, 'metal_hit', .3]]);
// 36 «an einer Laterne?»: la farola entera con su cartel, picado
shot(36.77, 'F', null, L => { town(L); leaner(L); orbit(V(LT.x, 6.5, LT.z + .6), lerp(18, 16, L.k), .9, .32, 46); sh(LT, 16); }, [[0, 'neon_buzz', .4]]);
// 37 «Dann sprengen sie die Laterne,»: cohete → la farola revienta
shot(37.73, 'C', null, L => { town(L); const t = L.lt; if (t < .4) { leaner(L); rocketPath(0, u => V(LT.x + 60 - u * 59, 30 - u * 22, LT.z - 30 + u * 30), t / .4); } else { boom(0, V(LT.x, 4, LT.z), L.t0 + .4, L.T, 1.4); const c = put(EX[13], LT.x + 2 + (t - .4) * 6, 1 + (t - .4) * 8, LT.z, 0); c.root.rotation.z = (t - .4) * 5; actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' }); }
  orbit(V(LT.x, 6, LT.z), 26, -.9, .15, 48); sh(LT, 24); }, [[0, 'whoosh', .6], [.4, 'explosion', .9]]);
cut(38.27, null, [0.4, 0.9, 0], [[0, 'swipe', .4]]);
// 38 «die Straße»: la calle entera estalla (explosiones en cadena)
shot(39.07, 'W', 'punch', L => { town(L); for (let k = 0; k < 2; k++) boom(k, V(LT.x + 8 + k * 14, 0, LT.z - 6 - k * 10), L.t0 + k * .25, L.T, 2.2); crowdAt(L, LT.x + 14, LT.z - 10, 8, 12, 22, 23, { mode: 'cower', from: 10 });
  orbit(V(LT.x + 12, 6, LT.z - 8), 44, -.6, .3, 50); sh(V(LT.x + 12, 0, LT.z - 8), 40); }, [[0, 'boom', .8], [.25, 'explosion', .8], [.4, 'rubble', .5]]);
// 39 «und dich.»: él sale volando por el cielo dando vueltas
shot(39.91, 'R', null, L => { town(L); const t = L.lt + .5; const c = put(EX[13], LT.x + t * 10, 6 + t * 12, LT.z - t * 6, 0); c.root.rotation.set(t * 5, 0, t * 3); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' });
  const p = hp(c); cam([p.x - 10, p.y - 3, p.z + 10], [p.x, p.y - 1, p.z], 44); sh(p, 20); }, [[0, 'scream_girl', .4], [.1, 'whoosh_up', .5]]);
// 40 «Ein Junge warf eine Papierkugel»: el niño lanza la bola de papel de espaldas a la papelera
const JB = V(2, 0, 24), BIN = V(2, 0, 16);
const thrower = (L, k) => { show(MUE, BIN.x, 0, BIN.z, 0); const c = put(junge, JB.x, 0, JB.z, 0); actuar(c, 0, [[0, { aRx: lerp(3.0, 2.2, k), aRz: lerp(-.3, .2, k), aRe: lerp(1.6, .1, k), aLx: .3, lean: -.05, headX: -.1, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); return c; };
shot(40.44, 'F', null, L => { town(L); const c = thrower(L, clamp((L.lt - .7) / .2)); const k = clamp((L.lt - .8) / 1.2); BALL.visible = true; BALL.position.copy(L.lt < .8 ? hp(c).add(V(.8, 1.6, -.3)) : arc([JB.x + .8, 7, JB.z - .3], [BIN.x, 3.9, BIN.z], 3, k)); BALL.rotation.set(L.T * 5, L.T * 3, 0);
  crowdAt(L, JB.x, JB.z, 5, 7, 14, 29, { from: 24 }); orbit(V(JB.x, 3.6, JB.z - 3), lerp(14, 12.5, L.k), .5, .12, 44); sh(V(JB.x, 0, JB.z), 16); }, [[.7, 'throw', .6], [.8, 'paper', .5]]);
cut(41.2, null, [-0.6, 0.9, 0], [[0, 'tick', .4]]);
// 41 «in den Mülleimer, ohne hinzusehen.»: la bola entra limpia en la papelera
shot(41.84, 'S', null, L => { town(L); thrower(L, 1); const k = clamp(.4 + L.lt / 1.2); BALL.visible = true; BALL.position.copy(arc([JB.x + .8, 7, JB.z - .3], [BIN.x, 3.9, BIN.z], 3, k)); BALL.rotation.set(L.T * 5, L.T * 3, 0);
  orbit(V(BIN.x, 3.5, BIN.z + 1), lerp(10, 8.5, L.k), -.7, .25, 44); sh(BIN, 14); }, [[.7, 'trash_hit', .6], [.8, 'ding_soft', .5]]);
shot(42.82, 'Z', null, L => { town(L); const c = thrower(L, 1); onFace(c, 6.2, 0, .4, 40, L.k, 5.4); sh(JB, 10); }, [[0, 'sparkle', .5]]);
// 42 «Sie erwischten ihn mitten im Wurf,»: congelado a mitad del lanzamiento con el punto rojo, destello y al suelo con estrellitas
shot(43.56, 'C', 'punch', L => { town(L); show(MUE, BIN.x, 0, BIN.z, 0); const q = zap(junge, JB.x, JB.z, 0, L, L.t0 + .55, { pose: { aRx: 2.6, aRz: 0, aRe: .8, aLx: .3, headY: .3 } }); if (q <= 0) { dots(junge, 1, L.T); TINT = 'rgba(40,60,120,.25)'; } if (q > 0 && q < .4) grade.uniforms.flash.value = .5;
  orbit(V(JB.x, 3 - q * 1.5, JB.z), 11, .7, .14, 44); sh(JB, 12); }, [[0, 'freeze', .6], [.55, 'impact', .7], [.62, 'thud', .5]]);
cut(44.19, null, [.25, 1, 0], [[0, 'pling', .4]]);
// 43 «und danach sprengten sie den Mülleimer,»: cohete a la papelera
shot(44.91, 'W', null, L => { town(L); const t = L.lt; if (t < .5) { show(MUE, BIN.x, 0, BIN.z, 0); rocketPath(1, u => V(BIN.x + 50 - u * 50, 40 - u * 37, BIN.z - 40 + u * 40), t / .5); } else boom(1, V(BIN.x, 1, BIN.z), L.t0 + .5, L.T, 1.4);
  const q = zap(junge, JB.x, JB.z, 0, L, -9); orbit(V(BIN.x, 4, BIN.z + 2), 20, -.4, .2, 48); sh(BIN, 20); }, [[0, 'whoosh', .6], [.5, 'explosion', .9]]);
shot(45.91, 'F', null, L => { town(L); boom(1, V(BIN.x, 1, BIN.z), L.t0 - .5, L.T, 1.0); crowdAt(L, BIN.x, BIN.z, 6, 9, 16, 31, { mode: 'shock', from: 0 }); orbit(V(BIN.x, 5, BIN.z), 30, .2, .2, 50); sh(BIN, 22); }, [[0, 'rubble', .6], [.3, 'gasp', .4]]);
// 44 «weil der Wurf perfekt war.» (zoom lento): repetición a cámara lenta, la bola en el aire con 10/10
shot(46.91, 'I', 'slow', L => { town(L); show(MUE, BIN.x, 0, BIN.z, 0); const k = .55 + L.k * .2; BALL.visible = true; BALL.position.copy(arc([JB.x + .8, 7, JB.z - .3], [BIN.x, 3.9, BIN.z], 3, k)); BALL.rotation.set(L.T, L.T * .6, 0); BALL.scale.setScalar(1.4);
  cam([BALL.position.x + 5, BALL.position.y + .4, BALL.position.z + 6], [BALL.position.x, BALL.position.y - 1.4, BALL.position.z], 40); grade.uniforms.sepia.value = .3; badge('green', 'PERFEKT 10/10', W / 2, H * .18, (L.lt - .3) * 3); sh(BIN, 12); }, [[0, 'sparkle', .5], [.4, 'choir', .4]]);
// 45 «Also sammeln jetzt alle negative Aura:»: la calle llena de gente haciendo el ridículo, placas bajas
const NEG = [['OLAF', 3], ['UTE', 7], ['KAI', 2], ['SVEN', 5], ['BEA', 1], ['TOM', 4]];
shot(48.30, 'W', null, L => { town(L); EX.slice(0, 6).forEach((c, i) => { const x = -16 + i * 5.4, z = -6 - (i % 2) * 5; put(c, x, 0, z, Math.sin(i * 2) * .4); actuar(c, 0, [[0, i % 2 ? GEST.shrug : { aLx: 2.8, aRx: .2, aLz: .4, headZ: .3, crouch: .15, lLx: .5, lLk: 1 }]], { T: L.T }); cara(c, L.T + i, { expr: 'confused', mouth: i % 2 ? 'wavy' : 'grin' }); mtag(c, NEG[i][0], NEG[i][1], (L.lt - i * .1) * 3); });
  SOCKM.forEach(m => m.visible = true); FANNY.forEach(f => f.visible = true); orb(L.k, V(-3, 4.5, -8), null, [26, -.15, .15, 48], [23, .05, .14, 48]); sh(V(-3, 0, -8), 26); }, [[0, 'murmur', .5], [.4, 'boing_metal', .4]]);
shot(49.42, 'R', null, L => { town(L); const c = put(EX[4], -6, 0, -8, 0); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .6, aRz: .6, hipY: Math.sin(L.T * 10) * .3, crouch: .2, headZ: Math.sin(L.T * 10) * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'grin', eyes: 'closed' }); mtag(c, 'BEA', 1, 1);
  orbit(V(-6, 4, -8), lerp(11, 9.5, L.k), .3, .1, 44); sh(V(-6, 0, -8), 14); }, [[0, 'toy', .5], [.4, 'laugh_m', .4]]);
// 46 «Socken in Sandalen,»: calcetines blancos con sandalias (plano de pies → él orgulloso)
shot(50.60, 'F', null, L => { town(L); const c = put(EX[0], -4, 0, 4, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, aLz: -.4, aRz: -.4, aLe: 1.8, aRe: 1.8, lean: -.1, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'grin' }); SOCKM.forEach(m => m.visible = true);
  cm([-4, 1.6, 10.5, -4, 1.0, 4, 42], [-4, 4.2, 14.5, -4, 3.2, 4, 44], clamp(L.k * 1.6), easeInOut); sh(V(-4, 0, 4), 10); }, [[0, 'cloth', .5], [.5, 'boing_metal', .4]]);
// 47 «Bauchtaschen,»: riñonera turquesa, posa orgulloso
shot(51.78, 'S', 'punch', L => { town(L); const c = put(EX[3], 4, 0, 2, -.2); FANNY[0].visible = true; actuar(c, 0, [[0, { aLx: .4, aLz: -.6, aLe: 1.2, aRx: .4, aRz: -.6, aRe: 1.2, hipY: .2, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'grin' });
  orbit(V(4, 3.4, 2), 9.5, -.3, .08, 42); sh(V(4, 0, 2), 10); }, [[0, 'zip', .6]]);
// 48 «und absichtlich gegen Glastüren laufen.»: camina directo contra la puerta de cristal — ¡bonk!
const GD = V(-14, 0, 10);
shot(52.32, 'W', null, L => { town(L); show(GDOOR, GD.x, 0, GD.z, 0); const z = GD.z + 5 - Math.min(L.lt, .95) * 5; const hit = L.lt > .95; const c = put(EX[6], GD.x, 0, hit ? GD.z + .7 : z, PI); actuar(c, 0, [[0, hit ? GEST.recoil : walkP(L.T, 0, 8)]], { T: L.T }); cara(c, L.T, hit ? { expr: 'shock', eyes: 'closed', mouth: 'grimace' } : { expr: 'joy', mouth: 'grin' });
  orbit(V(GD.x, 4, GD.z + 1.5), 12, PI + .35, .1, 44); sh(GD, 14); }, [[.2, 'steps', .4], [.95, 'hand_glass', .8]]);
shot(53.45, 'C', 'punch', L => { town(L); show(GDOOR, GD.x, 0, GD.z, 0); const c = put(EX[6], GD.x, 0, GD.z + .9, PI); actuar(c, 0, [[0, GEST.recoil]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'closed', mouth: 'wavy' }); dizzy(c, L.T); mtag(c, 'KAI', 0, 1);
  orbit(V(GD.x, 3.6, GD.z + 1), 9, PI - .4, .1, 42); sh(GD, 12); }, [[0, 'glass_rattle', .6], [.2, 'toy', .4]]);
