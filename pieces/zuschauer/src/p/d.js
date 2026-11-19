// ---------- d: Glanz dispara a Opa, el cohete da la vuelta a la ciudad, la estatua, ∞, la Robbe alcaldesa, Papa en chanclas, mi pelo (145,02 – 175,2 s) ----------
const GL = V(-6, 0, -30);   // Glanz en la plaza (delante de la carroza)
const glanzLaunch = (L, aim, o = {}) => { town(L, 'storm'); STORM.visible = true; STORM.userData.at(V(DOMX, 172, DOMZ - 10), 1); const g = put(glanz, GL.x, 0, GL.z, faceTo(GL, DTOP()) + (o.dry || 0));
  actuar(g, 0, [[0, aim ? { aRx: 2.0, aRz: -.1, aRe: .2, aLx: 1.9, aLz: -.4, aLe: .5, headX: -.2, lean: -.1 } : { aRx: 1.0, aRe: 1.0, aLx: 1.0, aLe: 1.0 }]], { T: L.T }); cara(g, L.T, o.face || { expr: 'angry', eyes: 'angry', mouth: 'grimace' });
  attach(LAUNCH, g.aR.hand, [0, -.6, .2], [PI / 2 - .35, 0, 0], 1.05); return g; };
const tp = () => DTOP().add(V(0, 3.4, 0));
// trayectoria: de Glanz a Opa, vuelta alrededor de Opa, vuelta a la ciudad, persecución por la calle, estatua
const R1 = u => { const a = V(GL.x, 6, GL.z), b = tp(); return a.clone().lerp(b, u).add(V(0, Math.sin(u * PI) * 20, 0)); };
const orbitOpa = u => { const t = tp(); const a = u * PI * 2 + PI * .75; return V(t.x + Math.sin(a) * 7, t.y + Math.sin(u * PI) * 2, t.z + Math.cos(a) * 7); };
const lap = u => { const t = tp(); const a = u * PI * 1.6; return V(lerp(t.x, 0, u) + Math.cos(a) * 60, lerp(t.y, 40, u), lerp(t.z, -20, u) + Math.sin(a) * 60); };
// 108 «Also schnappte sich Glanz selbst»: le arranca el lanzacohetes a un soldado
shot(145.02, 'W', null, L => { town(L, 'storm'); const k = clamp(L.lt / .5); const g = put(glanz, GL.x, 0, GL.z, .6); actuar(g, 0, [[0, { aRx: lerp(1.2, 1.6, k), aRz: -.3, aRe: .3, lean: .1 }]], { T: L.T }); cara(g, L.T, { expr: 'angry', eyes: 'angry', mouth: 'grimace' }); const s = put(SOL[4], GL.x + 3.6, 0, GL.z + 2.4, -2.2); actuar(s, 0, [[0, GEST.shock]], { T: L.T }); cara(s, L.T, { expr: 'shock', mouth: 'o' });
  attach(LAUNCH, k < .6 ? s.aR.hand : g.aR.hand, [0, -.6, .2], [PI / 2, 0, 0], 1.05); orbit(V(GL.x + 1.8, 4, GL.z + 1.2), 15, -.4, .1, 44); sh(GL, 14); }, [[.3, 'grab', .6], [.4, 'metal_hit', .4]]);
// «einen Raketenwerfer»: se lo apoya al hombro, apunta hacia el Dom
shot(146.06, 'C', 'punch', L => { const g = glanzLaunch(L, true); orbit(V(GL.x, 4.6, GL.z), 12, g.root.rotation.y - 1.25, .08, 44); badge('red', 'RAKETENWERFER', W / 2, H * .15, (L.lt - .2) * 3, 1, .85); sh(GL, 12); }, [[0, 'click_set', .7], [.4, 'ratchet', .5]]);
cut(146.62, null, [0.7, 1, 0], [[0, 'tick', .4]]);
// 109 «und schoss auf Opa.»: ¡fuego! el cohete sale hacia la aguja
shot(147.32, 'F', null, L => { const g = glanzLaunch(L, true); rocketPath(0, R1, L.k * .35); grade.uniforms.flash.value = L.lt < .1 ? .4 : 0; orbit(V(GL.x, 5, GL.z), 18, faceTo(GL, DTOP()) + 1.1, .15, 48); sh(GL, 20); }, [[0, 'ignite', .8], [.1, 'whoosh', .7]]);
cut(147.96, null, [0.5, 1.1, 0], [[0, 'pling', .4]]);
// 110 «Opa bewegte sich nicht.»: Opa tranquilo; el cohete se acerca por detrás de la cámara
shot(148.69, 'S', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, faceTo(t, GL), L.T); auraOn(c, L.T); rocketPath(0, R1, .6 + L.k * .3); onFace(c, 7.6, .4, .8, 42, L.k, 6.6); sh(t, 14); }, [[0, 'whoosh', .5], [.4, 'wind', .4]]);
cut(149.48, null, [0.6, 1, 0], [[0, 'whoosh_soft', .4]]);
// 111 «Die Rakete flog um ihn herum,»: órbita alrededor de Opa con estela
shot(150.01, 'Z', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, faceTo(t, GL), L.T); auraOn(c, L.T); rocketPath(0, orbitOpa, L.k * .95, 18); orbit(V(t.x, t.y + 3, t.z), 22, faceTo(t, GL) + .4, .25, 46); sh(t, 20); }, [[0, 'whoosh', .6], [.6, 'whoosh_soft', .5]]);
cut(150.85, null, [1.2, 1, 0], [[0, 'cloth', .4]]);
// 112 «drehte eine Runde über die Stadt»: vista aérea, el cohete da la vuelta a Glanzheim
shot(151.66, 'W', null, L => { town(L, 'storm'); rocketPath(0, lap, .1 + L.k * .8, 22); const p = ROCK[0].position; cam([20, 150, 120], [p.x * .5, 20, p.z * .5 - 30], 52); sh(V(0, 0, -40), 120); }, [[0, 'whoosh_up', .6], [.4, 'jet', .4]]);
// 113 «und jagte den Bürgermeister die Straße entlang,»: Glanz corre aterrorizado, el cohete detrás
const chase = u => V(26, 6 - u * 3, 60 - u * 70);
shot(152.82, 'C', null, L => { town(L); const z = 50 - L.lt * 9; const g = put(glanz, 26, 0, z, PI); actuar(g, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); sweat(g, L.T); rocketPath(0, u => V(26, 5.5, z + 10 - u * .2), .5);
  orbit(V(26, 3.6, z), 16, PI - .25, .12, 46); sh(V(26, 0, z), 20); }, [[0, 'steps_run', .6], [.1, 'scream_girl', .3]]);
shot(153.66, 'S', null, L => { town(L); const z = 42 - L.lt * 9; const g = put(glanz, 26, 0, z, PI); actuar(g, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); rocketPath(0, u => V(26, 5, z + 7 + Math.sin(L.T * 9) * .4 - u), .5);
  crowdAt(L, 26, z, 8, 8, 18, 53, { mode: 'point' }); orbit(V(26, 4, z + 3), 24, -.7, .18, 48); sh(V(26, 0, z), 24); }, [[0, 'run_cobble', .6], [.4, 'whoosh', .5]]);
shot(154.34, 'R', null, L => { town(L); const z = 36 - L.lt * 10; const g = put(glanz, 26, 0, z, PI); actuar(g, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); rocketPath(0, u => V(26, 4.8, z + 6 - u), .5);
  const h = hp(g); cam([h.x + 2.6, h.y + 1, h.z - 10.5], [h.x, h.y - 1.2, h.z], 44); sh(V(26, 0, z), 14); }, [[0, 'scream_girl', .4]]);
// 114 «direkt in seine eigene riesige Goldstatue.»: corre hacia la estatua… el cohete impacta
shot(155.18, 'W', null, L => { town(L); const k = L.k; const p = V(lerp(24, STX + 1, k), 0, lerp(-10, STZ + 7, k)); const g = put(glanz, p.x, 0, p.z, faceTo(p, V(STX, 0, STZ))); actuar(g, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); put(STAT, STX, 6, STZ, 0);
  orbit(V(STX + 2, 8, STZ + 8), lerp(44, 38, k), .2, .15, 50); sh(V(STX, 0, STZ), 40); }, [[0, 'run_cobble', .5]]);
shot(156.25, 'C', 'punch', L => { town(L); const g = put(glanz, STX + 1, 0, STZ + 7, PI); actuar(g, 0, [[0, GEST.cower]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); put(STAT, STX, 6, STZ, 0); if (L.lt < .3) rocketPath(0, u => V(STX + 30 - u * 30, 20 - u * 4, STZ + 20 - u * 20), L.lt / .3); else boom(0, V(STX, 14, STZ + 3), L.t0 + .3, L.T, 1.8);
  orbit(V(STX, 10, STZ), 40, -.3, .15, 50); SHAKE = L.lt > .3 ? .5 : 0; sh(V(STX, 0, STZ), 40); }, [[.3, 'explosion', 1], [.4, 'metal_rip', .6]]);
cut(156.79, null, [-.5, 1, 0], [[0, 'swipe', .4]]);
// 115 «Der Kopf fiel ab»: la cabeza dorada se tambalea y cae
shot(157.69, 'S', null, L => { town(L); put(STAT, STX, 6, STZ, 0); STATHEAD.visible = false; const k = clamp(L.lt / 1.0); const top = V(STX, 6 + 4.15 * 3.1 + .3, STZ); const p = top.clone().lerp(V(STX + .5, 0, STZ + 7), easeIn(k)); show(GHEAD, p.x, p.y, p.z, 0, 3.1); GHEAD.rotation.set(k * 1.2, 0, k * .4);
  const g = put(glanz, STX + 1, 0, STZ + 7, PI); actuar(g, 0, [[0, GEST.cower]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'up', mouth: 'scream' }); dust(V(STX, 6, STZ), L.t0 - .3, L.T, 8, 1.4); orbit(V(STX, 12, STZ + 2), 36, .3, .1, 50); sh(V(STX, 0, STZ), 40); }, [[0, 'metal_creak', .6], [.5, 'whoosh_down', .6]]);
// 116 «und machte ihn platt»: ¡PLAF!
shot(158.85, 'C', 'punch', L => { town(L); put(STAT, STX, 6, STZ, 0); STATHEAD.visible = false; show(GHEAD, STX + .5, 2.2, STZ + 7, 0, 3.1); GHEAD.rotation.set(1.2, 0, .4); const g = put(glanz, STX + 2.6, 0, STZ + 9.4, PI); g.root.scale.set(1.3, .12, 1.4); dust(V(STX, 0, STZ + 7), L.t0, L.T, 14, 1.6);
  orbit(V(STX + 1, 3, STZ + 8), 18, .4, .25, 46); SHAKE = L.lt < .2 ? .7 : 0; badge('red', 'PLATT!', W / 2, H * .17, (L.lt - .1) * 4, 1, 1.2); sh(V(STX, 0, STZ + 7), 20); }, [[0, 'slam', 1], [.1, 'rubble', .6]]);
// «wie ein Schnitzel.»: Glanz aplastado como un escalope (vista cenital, piernas asomando)
shot(159.69, 'Z', null, L => { town(L); show(GHEAD, STX + .5, 2.2, STZ + 7, 0, 3.1); GHEAD.rotation.set(1.2, 0, .4); const g = put(glanz, STX + 2.6, .1, STZ + 9.4, PI); g.root.scale.set(1.3, .12, 1.4); cara(g, L.T, { expr: 'confused', eyes: 'closed', mouth: 'wavy' }); crowdAt(L, STX, STZ + 9, 10, 7, 16, 55, { mode: 'point', face: V(STX, 0, STZ + 9) });
  cam([STX + 3, 22, STZ + 16], [STX + 1.5, 0, STZ + 8.5], 46); badge('gold', 'SCHNITZEL', W / 2, H * .17, (L.lt - .2) * 3, 1, 1); sh(V(STX, 0, STZ + 8), 20); }, [[0, 'pan_sizzle', .5], [.3, 'laugh_m', .4]]);
// 117 «Der Aura-Meter versuchte es nicht einmal mehr.»: la aguja da vueltas, chispas
shot(160.69, 'W', null, L => { town(L); METER.userData.set(75 + Math.sin(L.T * 30) * 75, 'OPA'); dust(V(-6, 46, -89), L.t0, L.T, 8, .8); grade.uniforms.flash.value = Math.max(0, Math.sin(L.T * 22)) * .1; orbit(V(-6, 49, -91), lerp(36, 32, L.k), .2, .05, 44); SHAKE = .25; sh(V(-6, 40, -91), 30); }, [[0, 'sparks', .6], [.3, 'glitch', .5]]);
shot(161.91, 'C', null, L => { town(L); const t = DTOP(); const c = opaCool(t.x, t.y, t.z, faceTo(t, GL), L.T, { wind: .8 }); mtag(c, 'OPA', Math.round(150 + L.lt * 900), 1); orbit(V(t.x, t.y + 3.2, t.z), 15, faceTo(t, GL) + .3, .05, 44); sh(t, 14); }, [[0, 'riser_short', .5]]);
// 118 «Er zeigte nur noch: unendlich.» (zoom lento): la placa OPA ∞
shot(162.78, 'F', 'slow', L => { town(L); METER.userData.set(150, 'OPA', 'inf'); orbit(V(-6, 48, -91), lerp(36, 28, L.k), -.1, .02, 44); sh(V(-6, 40, -91), 30); }, [[0, 'choir', .5]]);
shot(163.79, 'C', 'punch', L => { town(L); METER.userData.set(150, 'OPA', 'inf'); const t = DTOP(); const c = opaCool(t.x, t.y, t.z, faceTo(t, GL), L.T, { wind: .8 }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); onFace(c, 7, .2, .3, 40, L.k, 6); badge('gold', '∞', W / 2, H * .15, (L.lt - .2) * 3, 1, 1.6); sh(t, 14); }, [[0, 'ding_reveal', .7]]);
// 119 «Jetzt ist Aura-Farmen Pflicht,»: todo el pueblo posando chulo; cartel nuevo PFLICHT
const PF = (() => { const p = plakat(scene, 'AURA-FARMEN', 'PFLICHT!', 10, 5, '#1aa04a'); p.visible = false; PROPS.push(p); return p; })();
shot(164.62, 'W', null, L => { town(L); crowdAt(L, P0.x, P0.z + 10, 20, 4, 22, 57, { mode: 'cheer' }); EX.slice(0, 8).forEach((c, i) => { if (c.root.visible) { actuar(c, 0, [[0, COOL]], { T: L.T }); cara(c, L.T + i, { expr: 'smug', mouth: 'smirk' }); } }); show(PF, P0.x, 9, P0.z + 2, 0);
  orb(L.k, V(P0.x, 6, P0.z + 6), null, [34, .05, .2, 50], [30, -.05, .18, 50]); sh(V(P0.x, 0, P0.z + 6), 30); }, [[0, 'cheer', .6], [.3, 'stamp', .5]]);
shot(165.76, 'C', 'punch', L => { town(L); show(PF, P0.x, 9, P0.z + 2, 0); const c = put(EX[16], P0.x, 0, P0.z + 6, 0); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); orbit(V(P0.x, 5.2, P0.z + 5), 19, .1, .08, 46); sh(P0, 14); }, [[0, 'impact', .6]]);
// 120 «und die Robbe ist unsere neue Bürgermeisterin.»: la Robbe en la escalinata del Rathaus con la cadena de alcalde, confeti
const CHAIN = (() => { const g = new THREE.Group(); scene.add(g); const gm = mat(0xe9c23a, { metalness: .9, roughness: .2, emissive: 0x5a4000, emissiveIntensity: .25 }); for (let i = 0; i < 13; i++) { const a = Math.PI + i / 12 * Math.PI; box(.3, .2, .12, gm, .04, g, Math.cos(a) * 1.2, Math.sin(a) * 1.0, 0); } const m = cyl(.5, .5, .12, gm, 18, g, 0, -1.1, 0); m.rotation.x = PI / 2; outline(g, 1); g.visible = false; PROPS.push(g); return g; })();
shot(166.12, 'S', null, L => { town(L); const r = robbe(-6, 3.6, -79, 0, L.T, { salute: 1 }); attach(CHAIN, r.body, [0, 3.6, 1.2], [0, 0, 0], 1); confRain(V(-6, 3.6, -76), L.T, 50, 16, 10, 14); crowdAt(L, -6, -64, 16, 3, 16, 59, { mode: 'cheer', face: V(-6, 4, -79) });
  orbit(V(-6, 7.6, -79), lerp(16, 13.5, L.k), -.2, .05, 44); sh(V(-6, 0, -79), 16); }, [[0, 'fanfare', .6], [.2, 'cheer', .5]]);
shot(167.22, 'Z', null, L => { town(L); const r = robbe(-6, 3.6, -79, 0, L.T, { clap: 1, bounce: 1 }); attach(CHAIN, r.body, [0, 3.6, 1.2], [0, 0, 0], 1); confRain(V(-6, 3.6, -76), L.T, 60, 16, 10, 14); fireworks(V(-6, 20, -100), L.T, 3, 14); badge('gold', 'BÜRGERMEISTERIN', W / 2, H * .15, (L.lt - .2) * 3, 1, .85);
  orbit(V(-6, 6.8, -79), lerp(11, 9.5, L.k), .25, .05, 42); sh(V(-6, 0, -79), 14); }, [[0, 'confetti', .5], [.3, 'firework', .5], [.6, 'clap', .5]]);
// 121 «Papa hat Opas Pose in Badelatschen probiert.»: Papa encima de la valla del jardín, brazos cruzados, en chanclas
const PW = V(20.5, 0, 100);   // valla delante de la casa (HAUS en (4, 0, 96))
const papaPose = (L, wob = 0, fall = 0) => { town(L); const c = put(papa, PW.x, 1.5 - fall * 1.2, PW.z, PI / 2); c.root.rotation.z = Math.sin(L.T * 9) * .12 * wob + fall * 1.2; actuar(c, 0, [[0, fall ? GEST.shock : { ...COOL, aLz: -.72 + Math.sin(L.T * 9) * .3 * wob }]], { T: L.T }); cara(c, L.T, fall ? { expr: 'shock', mouth: 'scream' } : { expr: wob ? 'worried' : 'smug', mouth: wob ? 'grimace' : 'smirk' });
  for (const l of [c.lL, c.lR]) l.shoe.material = SLIPM; return c; };
const SLIPM = mat(0x2a8ad8, { roughness: .5 });
shot(168.39, 'W', null, L => { const c = papaPose(L); orb(L.k, V(PW.x, 4.6, PW.z), null, [17, PI / 2 + .35, .1, 44], [15, PI / 2 + .2, .1, 44]); sh(PW, 18); }, [[0, 'whistle_inno', .4]]);
shot(169.45, 'F', null, L => { const c = papaPose(L, .3); const p = wpos(c.lL.kn); cm([p.x + 8, 2.2, p.z + 4.5, p.x, 1.2, p.z, 42], [p.x + 13, 5, p.z + 6.5, p.x, 3.6, p.z, 48], L.k); badge('gold', 'BADELATSCHEN', W / 2, H * .17, (L.lt - .2) * 3, 1, .9); sh(PW, 10); }, [[0, 'squeak', .5], [.4, 'squeak', .4]]);
cut(170.19, null, [-0.6, 1, 0], [[0, 'tick', .4]]);
// 122 «Er hielt drei Sekunden durch.»: tiembla… 3·2·1… y se cae al seto
shot(170.72, 'S', null, L => { const c = papaPose(L, 1); sweat(c, L.T); const n = 3 - Math.floor(L.lt / .2); badge('num', String(Math.max(1, n)), W / 2, H * .16, ((L.lt % .2) / .2) * 2 + .3, 1, 1.2); orbit(V(PW.x, 4.6, PW.z), 14, PI / 2 + .25, .1, 44); sh(PW, 16); }, [[0, 'tick', .5], [.2, 'tick', .5], [.4, 'tick', .5]]);
shot(171.32, 'C', 'punch', L => { const q = clamp(L.lt / .3); const c = papaPose(L, 0, q); if (q >= 1) dizzy(c, L.T); badge('red', '3 SEK.', W / 2, H * .16, (L.lt - .2) * 3, 1, 1.1); orbit(V(PW.x, 3.4, PW.z), 15, PI / 2 - .3, .15, 44); sh(PW, 16); }, [[.2, 'crash_wood', .7], [.3, 'leaves', .5]]);
// 123 «Und ich?»
shot(172.24, 'Z', null, L => { town(L); const c = ichCool(P0.x, P0.z + 8, 0, L.T, { expr: 'smug', mouth: 'smirk' }); setHair(c, false); BOWL.visible = false; onFace(c, 7, .2, .3, 40, L.k, 6.2); sh(P0, 14); }, [[0, 'whoosh_soft', .5]]);
// 124 «Ich bin endlich den Suppenschüssel-Schnitt los.»: me revuelvo el pelo — ¡pelo cool! — capucha al viento, el pueblo aplaude
shot(172.79, 'C', 'punch', L => { town(L); const c = ichCool(P0.x, P0.z + 8, 0, L.T, { pose: { aRx: 2.8, aRz: .1, aRe: 2.1, aLx: .3, aLz: -.3, aLe: .6, headX: -.15 }, expr: 'smug', mouth: 'smirk' }); setHair(c, true); breeze(c, L.T, 2.4, 14); onFace(c, 7.4, .2, -.3, 40, L.k, 6.6); sh(P0, 14); }, [[0, 'sparkle', .7], [.2, 'wind', .5]]);
shot(173.46, 'I', 'slow', L => { town(L); const c = ichCool(P0.x, P0.z + 8, 0, L.T, { wind: 1.6 }); setHair(c, true); breeze(c, L.T, 2.6, 18); mtag(c, 'ICH', 150, 1); crowdAt(L, P0.x, P0.z + 8, 18, 6, 22, 61, { mode: 'cheer' }); confRain(V(P0.x, 0, P0.z + 8), L.T, 50, 18, 14, 14);
  orb(L.k, V(P0.x, 4, P0.z + 8), null, [20, .05, .12, 46], [13, 0, .1, 44]); sh(V(P0.x, 0, P0.z + 8), 24); }, [[0, 'cheer', .5], [.4, 'confetti', .4]]);
