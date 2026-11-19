// ---------- c: la Aura-Parade, el bebé, 180, los puntos rojos, «Feuer!», Opa en la aguja, la bala y el cohete vuelven (101,20 – 145,02 s) ----------
const FL = V(-6, 0, -40);            // carroza (Glanz encima, mira a +z)
const FLTOP = V(-6, 5.3, -41);
const BAL = V(-50.8, 17.25, 30);     // borde del balcón (el bebé cae desde aquí)
const CATCH = V(-44.5, 0, 30);       // donde estoy yo (mirando a +x… de lado a la cámara)
const MOM = EX[2];
const parade = (L, o = {}) => { town(L); FLOAT.visible = true; FLOAT.position.copy(FL); const g = put(glanz, FLTOP.x, FLTOP.y, FLTOP.z, 0); actuar(g, 0, [[0, o.gPose || { ...GEST.wave, aRz: .3 + Math.sin(L.T * 8) * .3 }]], { T: L.T }); if (o.gFace) cara(g, L.T, o.gFace); else grin(g, L.T); return g; };
const balc = (L, k) => { const m = put(MOM, BAL.x - 1.6, BAL.y, BAL.z + 1.2, PI / 2); actuar(m, 0, [[0, k > 0 ? { aLx: 2.2, aRx: 2.2, aLe: .2, aRe: .2, lean: .4 } : GEST.hold]], { T: L.T }); cara(m, L.T, k > 0 ? { expr: 'shock', eyes: 'terror', mouth: 'scream' } : { expr: 'happy', mouth: 'smile' }); return m; };
// trayectoria de caída del bebé: del balcón a mi mano (k 0..1)
const fallP = k => V(lerp(BAL.x + .4, CATCH.x - .2, k), lerp(BAL.y + 2.6, 8.4, k * k), BAL.z);
const meCatch = (L, look = 0) => { const me = put(ich, CATCH.x, 0, CATCH.z, PI / 2 + .9); actuar(me, 0, [[0, { aRx: 3.0, aRz: .15, aRe: .1, aLx: .25, aLz: -.4, aLe: 1.3, headY: look, lean: -.04 }]], { T: L.T }); flap(me, L.T, 1.4); cara(me, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); return me; };
const babyOn = (me, L) => { me.root.updateMatrixWorld(true); const p = me.aR.hand.getWorldPosition(V(0, 0, 0)); const b = put(baby, p.x, p.y + .2, p.z, PI / 2 + .9); b.root.rotation.z = .1; actuar(b, 0, [[0, GEST.cheer]], { T: L.T }); cara(b, L.T, { expr: 'joy', mouth: 'open_smile' }); return b; };

// 77 «Am nächsten Tag war»: la carroza dorada de Glanz entra en la plaza, confeti
shot(101.20, 'Z', null, L => { const g = parade(L); crowdAt(L, FL.x, FL.z + 8, 18, 9, 26, 41, { mode: 'clap', face: FLTOP }); confRain(V(FL.x, 0, FL.z + 4), L.T, 60, 24, 20, 18); orb(L.k, V(FL.x, 6, FL.z + 2), null, [40, .35, .25, 50], [34, .25, .22, 50]); sh(FL, 40); }, [[0, 'party_horn', .6], [.2, 'cheer', .5], [.5, 'confetti', .4]]);
shot(102.38, 'C', 'punch', L => { const g = parade(L); confRain(V(FL.x, 0, FL.z + 4), L.T, 50, 16, 14, 16); orbit(V(FLTOP.x, FLTOP.y + 3.4, FLTOP.z), lerp(14, 12.5, L.k), -.25, .02, 44); badge('gold', 'AURA-PARADE', W / 2, H * .15, (L.lt - .2) * 3, 1, .9); sh(FL, 20); }, [[0, 'impact', .5], [.2, 'fanfare', .5]]);
cut(102.68, null, [0.6, 1.3, 0], [[0, 'pling', .4]]);
// 78 «bei der alle klatschen müssen,»: la gente aplaude con cara de sufrimiento; un soldado vigila
shot(103.66, 'W', null, L => { parade(L); const ppl = EX.slice(14, 19); ppl.forEach((c, i) => { const x = FL.x - 8 + i * 4, z = FL.z + 24 + (i % 2) * 2; put(c, x, 0, z, PI); actuar(c, 0, [[0, clapP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'worried', mouth: 'grimace' }); });
  soldat(3, FL.x + 9, 0, FL.z + 28, PI + .4, L.T, { pose: GEST.cross, rifle: false }); orbit(V(FL.x, 4, FL.z + 25), lerp(14, 12.5, L.k), PI - .15, .14, 44); sh(V(FL.x, 0, FL.z + 18), 20); }, [[0, 'clap_crowd', .6]]);
shot(104.25, 'S', null, L => { parade(L); crowdAt(L, FL.x, FL.z + 6, 18, 8, 24, 43, { mode: 'clap', face: FLTOP }); soldat(4, FL.x + 9, 0, FL.z + 6, -.6, L.T, { pose: GEST.point, rifle: false, expr: 'angry' }); orbit(V(FL.x + 4, 4, FL.z + 8), lerp(26, 23, L.k), .55, .2, 48); sh(FL, 30); }, [[0, 'clap_crowd', .5], [.3, 'whistle', .4]]);
// 79 «bis ihre Hände glühen.»: manos rojas brillando
shot(105.03, 'F', null, L => { parade(L); const c = put(EX[19], FL.x + 2, 0, FL.z + 18, PI); actuar(c, 0, [[0, clapP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'cry', mouth: 'grimace_wide' }); glowHands(c, 0); steam(hp(c).add(V(0, -1, -1.5)), L.T, 4);
  const h = hp(c); cam([h.x - 2, h.y - .2, h.z - 6.5], [h.x, h.y - 1.4, h.z], 40); sh(V(FL.x, 0, FL.z + 18), 12); }, [[0, 'sizzle', .5], [.2, 'clap', .5]]);
shot(105.73, 'C', 'punch', L => { parade(L); crowdAt(L, FL.x, FL.z + 6, 16, 8, 22, 45, { mode: 'clap', face: FLTOP, glow: true }); orbit(V(FL.x, 4, FL.z + 14), 18, PI - .3, .25, 46); sh(FL, 24); }, [[0, 'fire_crackle', .5], [.1, 'clap_crowd', .5]]);
// 80 «Doch genau da» (zoom lento): el balcón con la madre y el bebé, sobre la plaza
shot(106.24, 'I', 'slow', L => { parade(L); balc(L, 0); const b = put(baby, BAL.x - .4, BAL.y + 3.2, BAL.z + 1.2, PI / 2); actuar(b, 0, [[0, GEST.cheer]], { T: L.T }); cara(b, L.T, { expr: 'joy', mouth: 'open_smile' });
  orbit(V(BAL.x - .5, BAL.y + 3.4, BAL.z + .8), lerp(20, 14, L.k), PI / 2 + .25, -.05, 44); sh(V(BAL.x, 0, BAL.z), 24); }, []);
// 81 «fiel ein Baby»: se le escapa de los brazos
shot(107.02, 'C', null, L => { parade(L); balc(L, 1); const k = clamp(L.lt / 1.8) * .3; const b = put(baby, ...fallP(k).toArray(), PI / 2); b.root.rotation.z = L.lt * 4; actuar(b, 0, [[0, GEST.shock]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  orbit(V(BAL.x + 1, BAL.y + 2.6, BAL.z), 15, PI / 2 + .5, .05, 44); sh(V(BAL.x, 0, BAL.z), 24); }, [[0, 'scream_girl', .5], [.1, 'whoosh_down', .5]]);
// «von einem Balkon.»: cae a lo largo de la fachada
shot(107.84, 'S', null, L => { parade(L); balc(L, 1); const k = .3 + L.k * .55; const p = fallP(k); const b = put(baby, p.x, p.y, p.z, PI / 2); b.root.rotation.z = L.T * 4; actuar(b, 0, [[0, GEST.shock]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  cam([p.x + 9, p.y + 4, p.z + 9], [p.x, p.y, p.z], 46); crowdAt(L, CATCH.x + 6, CATCH.z, 6, 6, 14, 47, { mode: 'shock', from: 20 }); sh(V(BAL.x, 0, BAL.z), 24); }, [[0, 'gasp', .5], [.3, 'whoosh_down', .4]]);
// 82 «Ich fing es»: lo atrapo con una mano, sin mirar
shot(108.86, 'W', 'punch', L => { parade(L); const me = meCatch(L, -.9); const k = clamp(.85 + L.lt / .25 * .15); if (k < 1) { const p = fallP(k); const b = put(baby, p.x, p.y, p.z, PI / 2); actuar(b, 0, [[0, GEST.shock]], { T: L.T }); } else babyOn(me, L);
  orbit(V(CATCH.x - 1, 5, CATCH.z), lerp(15, 13.5, L.k), PI / 2 + 1.1, .1, 46); sh(CATCH, 20); }, [[.08, 'catch', .7], [.1, 'impact_soft', .5]]);
// «mit einer Hand,»: plano detalle de la mano con el bebé encima
shot(109.40, 'C', null, L => { parade(L); const me = meCatch(L, -.9); const b = babyOn(me, L); const p = hp(b); cam([p.x + 3.6, p.y - .6, p.z + 4.8], [p.x, p.y - .4, p.z], 40); badge('gold', '1 HAND', W / 2, H * .16, (L.lt - .2) * 3); sh(CATCH, 12); }, [[0, 'baby_gasp', .4]]);
// 83 «ohne hinzusehen,»: mi cara mirando a otro lado, chulo
shot(110.08, 'R', null, L => { parade(L); const me = meCatch(L, -1.0); babyOn(me, L); const h = hp(me); cam([h.x + 8, h.y + .5, h.z + 1.2], [h.x, h.y - .4, h.z], 40); sh(CATCH, 12); }, [[0, 'sparkle', .5]]);
// 84 «während mein Hoodie im Wind flatterte.» (zoom lento): contrapicado heroico, capucha al viento, hojas
shot(110.96, 'Z', null, L => { parade(L); const me = meCatch(L, -.9); babyOn(me, L); breeze(me, L.T, 2.6, 16); orbit(V(CATCH.x, 5.2, CATCH.z), 13, PI / 2 + .3, -.12, 46); sh(CATCH, 14); }, [[0, 'wind', .6], [.2, 'cloth', .5]]);
shot(111.74, 'I', 'slow', L => { parade(L); const me = meCatch(L, -.9); babyOn(me, L); breeze(me, L.T, 2.6, 16); const h = hp(me); cam([h.x + 4.5, 1.4, h.z - 6], [h.x, h.y - 1, h.z], 46); sh(CATCH, 14); }, []);
// 85 «Die ganze Stadt hielt den Atem an.»: todos congelados con la boca abierta; Glanz también
shot(112.58, 'F', null, L => { parade(L, { gPose: GEST.shock, gFace: { expr: 'shock', mouth: 'o' } }); crowdAt(L, CATCH.x + 4, CATCH.z, 16, 7, 22, 49, { mode: 'shock', face: V(CATCH.x, 0, CATCH.z) }); const me = meCatch(L, -.9); babyOn(me, L);
  orbit(V(CATCH.x + 3, 4, CATCH.z), lerp(28, 25, L.k), PI / 2 - .35, .25, 48); sh(CATCH, 30); }, [[0, 'gasp', .6], [.3, 'silence_tick', .4]]);
shot(113.36, 'S', null, L => { const g = parade(L, { gPose: GEST.shock, gFace: { expr: 'shock', eyes: 'wide', mouth: 'o' } }); onFace(g, 7, .2, .4, 40, L.k, 6); sh(FL, 14); }, [[0, 'gulp', .5]]);
// 86 «Mein Meter sprang auf hundertachtzig.»: la aguja se pasa de rosca; la placa ICH 180 echa chispas
shot(114.55, 'C', 'punch', L => { town(L); const v = lerp(98, 180, easeOut(clamp(L.lt / .6))); METER.userData.set(Math.min(v, 150) + Math.sin(L.T * 60) * 3 * (v > 150), 'ICH'); METER.userData.set(v > 150 ? 150 : v, 'ICH'); orbit(V(-6, 51, -91), 27, .1, .05, 44); SHAKE = .4; sh(V(-6, 40, -91), 30); }, [[0, 'riser_short', .6], [.5, 'sparks', .6]]);
shot(115.45, 'W', null, L => { town(L); METER.userData.set(150, 'ICH'); METER.children.forEach(c => { if (c.userData && c.userData.set) {} }); const p = METER.position; badge('red', '180', W / 2, H * .14, L.lt * 4, 1, 1.4); dust(V(p.x, p.y - 10, p.z + 2), L.t0, L.T, 10, .7); grade.uniforms.flash.value = Math.max(0, Math.sin(L.T * 25)) * .1;
  orbit(V(-6, 50, -91), lerp(30, 27, L.k), -.2, .05, 44); SHAKE = .3; sh(V(-6, 40, -91), 30); }, [[0, 'alarm', .6], [.2, 'glass_crack', .5]]);
// 87 «Das Baby auf neunzig.»: el bebé, gafas de sol puestas, su placa 90
shot(116.40, 'F', null, L => { parade(L); const me = meCatch(L, -.9); const b = babyOn(me, L); attach(SHADES, b.head, [0, .9, .72], [0, 0, 0], 1.25); cara(b, L.T, { expr: 'smug', mouth: 'smirk' }); mtag(b, 'BABY', 90, (L.lt - .1) * 3, 2.6);
  const p = hp(b); cam([p.x + 4.4, p.y + .4, p.z - 5.6], [p.x, p.y - .8, p.z], 42); sh(CATCH, 12); }, [[0, 'pling', .5], [.3, 'baby_gasp', .4]]);
shot(117.10, 'C', null, L => { parade(L); const me = meCatch(L, 0); const b = babyOn(me, L); attach(SHADES, b.head, [0, .9, .72], [0, 0, 0], 1.25); cara(b, L.T, { expr: 'smug', mouth: 'smirk' }); cara(me, L.T, { expr: 'joy', mouth: 'grin' }); mtag(me, 'ICH', 180, 1); orbit(V(CATCH.x, 5.4, CATCH.z), 11.5, PI / 2 + .5, .05, 44); sh(CATCH, 12); }, [[0, 'cheer', .3]]);
// 88 «Sirenen,»: luces rojas y azules, soldados corriendo
shot(117.80, 'W', null, L => { parade(L); const r = Math.sin(L.T * 18) > 0; TINT = r ? 'rgba(255,30,40,.18)' : 'rgba(30,80,255,.18)'; for (let i = 0; i < 4; i++) { const c = put(SOL[i], CATCH.x + 16 - L.lt * 8 + (i % 2) * 2, 0, CATCH.z + (i - 1.5) * 3, -PI / 2); actuar(c, 0, [[0, runP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'determined', eyes: 'angry' }); }
  cam([CATCH.x + 4, 5, CATCH.z + 16], [CATCH.x + 12, 3, CATCH.z], 46); sh(V(CATCH.x + 12, 0, CATCH.z), 24); }, [[0, 'siren', .7], [.2, 'steps_run', .5]]);
// 89 «Hubschrauber,»: dos helicópteros sobre los tejados
shot(118.50, 'S', null, L => { town(L); for (let k = 0; k < 2; k++) { show(HELI[k], CATCH.x + 18 + k * 16, 26 + k * 4 + Math.sin(L.T * 2 + k), CATCH.z - 10 + k * 14, -PI / 2 + .3); HELI[k].userData.spin(L.T); HELI[k].userData.sp.intensity = 400; }
  cam([CATCH.x - 2, 6, CATCH.z - 12], [CATCH.x + 26, 26, CATCH.z + 2], 50); sh(V(CATCH.x + 20, 0, CATCH.z), 40); }, [[0, 'heli', .8]]);
// 90 «sieben rote Punkte auf meiner Stirn.»: aparecen uno a uno
shot(119.26, 'C', 'punch', L => { parade(L); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); onFace(me, 6.6, .3, 0, 40, L.k, 5.8); dots(me, Math.min(7, 1 + Math.floor(L.lt / .1)), L.T); badge('red', String(Math.min(7, 1 + Math.floor(L.lt / .1))), W * .82, H * .2, 1, 1, .9); sh(CATCH, 12); }, [[0, 'blink', .5], [.2, 'blink', .4], [.4, 'blink', .4], [.6, 'blink', .4]]);
shot(120.08, 'Z', null, L => { parade(L); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'worried', eyes: 'up', mouth: 'grimace' }); sweat(me, L.T); dots(me, 7, L.T); const h = hp(me); const a = me.root.rotation.y; cam([h.x + Math.sin(a) * 4.4, h.y + 2.2, h.z + Math.cos(a) * 4.4], [h.x, h.y + .5, h.z], 38); badge('red', '7', W / 2, H * .15, 1, 1, 1.1); sh(CATCH, 12); }, [[0, 'heartbeat', .6]]);
// 91 «Einer davon gehörte der Robbe.»: francotiradores en los tejados… y la Robbe con su fusil
shot(120.96, 'W', null, L => { town(L); for (let i = 0; i < 3; i++) soldat(i, [-13, -8, -3][i], 23.3, -86, .5, L.T, { laser: 90, rifle: i }); cm([2, 30, -62, -8, 25, -86, 46], [1, 29.5, -63, -8, 25, -86, 46], L.k); sh(V(-6, 23, -86), 20); }, [[0, 'click_set', .6], [.3, 'click_set', .5]]);
shot(121.84, 'C', 'punch', L => { town(L); const r = robbe(20, 23.3, -86, .5, L.T, { headX: .1 }); attach(RIF[3], r.fl[1], [-.2, -.8, .6], [PI / 2, 0, 0], 1.1); RIF[3].userData.laser.visible = true; RIF[3].userData.laser.scale.y = 80; r.eyes[0].scale.y = .15;
  orbit(V(20, 27, -86), lerp(11, 9.5, L.k), .25, .05, 42); badge('gold', 'ROBBE', W / 2, H * .15, (L.lt - .1) * 3); sh(V(20, 23, -86), 12); }, [[0, 'toy', .6], [.2, 'click_metal', .5]]);
// 92 «Glanz schrie:»
shot(122.49, 'S', null, L => { const g = parade(L, { gPose: { ...GEST.point, aRx: 2.2 }, gFace: { expr: 'angry', eyes: 'angry', mouth: 'scream' } }); orbit(V(FLTOP.x, FLTOP.y + 3.2, FLTOP.z), lerp(15, 13, L.k), .35, .05, 44); sh(FL, 16); }, [[0, 'shout_m', .5]]);
// 93 «„Niemand ist cooler als ich!»: primer plano gritando, venas, saliva
shot(123.27, 'C', 'punch', L => { const g = parade(L, { gPose: { aLx: 1.0, aRx: 1.0, aLz: .4, aRz: .4, aLe: 2.0, aRe: 2.0, lean: .2 }, gFace: { expr: 'angry', eyes: 'angry', mouth: 'scream' } }); onFace(g, 6.4, 0, .2, 40, L.k, 5.4); SHAKE = .25; sh(FL, 12); }, [[0, 'impact', .6], [.1, 'shout_crowd', .3]]);
shot(124.11, 'R', null, L => { const g = parade(L, { gPose: { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, lean: -.1, headX: -.3 }, gFace: { expr: 'angry', eyes: 'angry', mouth: 'scream' } }); orbit(V(FLTOP.x, FLTOP.y + 3.6, FLTOP.z), 12, -.4, -.25, 46); sh(FL, 14); }, [[0, 'evil_laugh', .3]]);
// 94 «Feuer!»: todos disparan — destello
shot(124.99, 'F', 'punch', L => { town(L); for (let i = 0; i < 3; i++) soldat(i, [-13, -8, -3][i], 23.3, -86, .5, L.T, { laser: 90, rifle: i }); grade.uniforms.flash.value = L.lt < .06 ? .45 : 0; cm([2, 30, -62, -8, 25, -86, 46], [2, 30, -62, -8, 25, -86, 42], L.k); sh(V(-6, 23, -86), 20); }, [[0, 'impact', .9], [.03, 'boom', .6]]);
// 95 «dann krachte ein Donner über dem Dom,»: el cielo se oscurece, rayo sobre el Dom
shot(125.63, 'C', null, L => { town(L, 'storm'); const t = DTOP(); BOLT.visible = true; BOLT.position.set(t.x, t.y + 46, t.z); BOLT.scale.setScalar(5); grade.uniforms.flash.value = L.lt < .06 ? .45 : 0; RAIN.update(L.T, t.clone().add(V(0, -40, 30)), 60, 60, 60, true); orbit(V(t.x, t.y - 30, t.z), 150, .2, .05, 50); sh(t, 80); }, [[0, 'thunder', 1]]);
shot(126.47, 'W', null, L => { town(L, 'storm'); const t = DTOP(); crowdAt(L, CATCH.x + 10, CATCH.z, 14, 4, 20, 51, { mode: 'point', face: t }); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'shock', mouth: 'o' }); me.root.rotation.y = faceTo(V(CATCH.x, 0, CATCH.z), t);
  cam([CATCH.x - 4, 3, CATCH.z + 14], [t.x, t.y - 30, t.z], 52); sh(V(CATCH.x, 0, CATCH.z), 30); }, [[0, 'gasp', .5], [.2, 'wind_howl', .4]]);
// 96 «und die Wolken öffneten sich in einem perfekten Kreis.»
shot(127.37, 'Z', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), .4 + L.k * .3); orbit(V(t.x, t.y - 20, t.z), 170, .3, .25, 50); sh(t, 60); }, [[0, 'wind_rise', .6]]);
shot(128.45, 'F', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), .6 + L.k * .4); cam([t.x + 3, t.y + 170, t.z + 8], [t.x, t.y, t.z], 50); sh(t, 60); }, [[0, 'sunrise_shine', .6], [.4, 'choir', .5]]);
cut(129.03, null, [0, 0.7, 0], [[0, 'whoosh_soft', .4]]);
// 97 «Oben auf der Spitze,»: la cámara sube por la aguja hasta la figura
shot(130.24, 'S', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, 0, L.T); DARK = .35; auraOn(c, L.T, .9); cm([t.x + 4, t.y - 40, t.z + 26, t.x, t.y - 20, t.z, 50], [t.x + 4, t.y + 2, t.z + 18, t.x, t.y + 3, t.z, 46], L.k); sh(t, 30); }, [[0, 'swoosh_up', .6]]);
// 98 «mit verschränkten Armen»: brazos cruzados, contraluz
shot(131.30, 'C', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, 0, L.T); DARK = .3; auraOn(c, L.T); const h = hp(c); cam([h.x + 2.4, h.y - 1.2, h.z + 8], [h.x, h.y - .4, h.z], 42); sh(t, 14); }, [[0, 'cloth', .5]]);
// 99 «und wehendem Mantel,»: el abrigo ondea, plano lateral
shot(132.20, 'W', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, 0, L.T, { wind: 1.8 }); DARK = .25; auraOn(c, L.T); orbit(V(t.x, t.y + 2.6, t.z), 13, .55, .02, 44); sh(t, 14); }, [[0, 'wind', .6], [.2, 'cloth', .5]]);
cut(132.84, null, [-0.9, 1, 0], [[0, 'cloth', .4]]);
// 100 «stand Opa.» (zoom lento): la cara de Opa a la luz — ¡es él!
shot(133.46, 'I', 'slow', L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, 0, L.T, { eyes: 'half' }); auraOn(c, L.T, 1.2); onFace(c, 7, .2, 0, 40, L.k, 5.4); badge('gold', 'OPA?!', W / 2, H * .15, (L.lt - .3) * 3, 1, 1.1); sh(t, 14); }, []);
// 101 «Die Kugel blieb mitten in der Luft stehen,»: la bala llega… y se para delante de mi frente
const bulletAt = (me, d) => { const h = hp(me); const a = me.root.rotation.y; BUL.visible = true; BUL.position.set(h.x + Math.sin(a) * d, h.y + .95, h.z + Math.cos(a) * d); BUL.lookAt(h.x, h.y + .95, h.z); return BUL.position.clone(); };
shot(134.27, 'Z', null, L => { town(L, 'storm'); STORM.visible = true; STORM.userData.at(V(DOMX, 172, DOMZ - 10), 1); const me = meCatch(L, 0); babyOn(me, L); const p = bulletAt(me, lerp(20, 2.2, easeOut(L.k))); const h = hp(me); cam([h.x + Math.sin(me.root.rotation.y) * 9 + 3, h.y + 1.6, h.z + Math.cos(me.root.rotation.y) * 9], [h.x, h.y + .2, h.z], 42); sh(CATCH, 14); }, [[0, 'whoosh', .6]]);
shot(134.97, 'C', 'punch', L => { town(L, 'storm'); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); const p = bulletAt(me, 2.2 + Math.sin(L.T * 30) * .03); BUL.userData.trail.visible = false; const h = hp(me);
  { const a = me.root.rotation.y; cam([(p.x + h.x) / 2 + (Math.sin(a) * .8 - Math.cos(a)) * 7, h.y + 1.2, (p.z + h.z) / 2 + (Math.cos(a) * .8 + Math.sin(a)) * 7], [(p.x + h.x) / 2, h.y + .1, (p.z + h.z) / 2], 42); } badge('gold', 'STOPP', W / 2, H * .15, (L.lt - .2) * 3); sh(CATCH, 12); }, [[0, 'freeze', .7], [.2, 'tick', .4]]);
// 102 «drehte um»: la bala gira 180°
shot(136.21, 'R', null, L => { town(L, 'storm'); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'shock', mouth: 'o' }); const p = bulletAt(me, 2.2); BUL.userData.trail.visible = false; BUL.rotateY(PI * easeInOut(clamp(L.lt / .5))); const h = hp(me);
  { const a = me.root.rotation.y; cam([(p.x + h.x) / 2 + (Math.sin(a) * .8 - Math.cos(a)) * 7, h.y + 1.2, (p.z + h.z) / 2 + (Math.cos(a) * .8 + Math.sin(a)) * 7], [(p.x + h.x) / 2, h.y + .1, (p.z + h.z) / 2], 42); } sh(CATCH, 12); }, [[0, 'whirl', .6]]);
// 103 «und flog direkt zurück zu den Scharfschützen.»: vuelve a los tejados; los francotiradores caen
shot(136.93, 'W', null, L => { town(L, 'storm'); const a = V(CATCH.x + 2, 8, CATCH.z), b = V(-6, 26, -86); const p = a.clone().lerp(b, L.k); BUL.visible = true; BUL.position.copy(p); BUL.lookAt(b); BUL.scale.setScalar(3); cam([p.x - 6, p.y + 3, p.z + 10], [p.x + (b.x - a.x) * .05, p.y, p.z + (b.z - a.z) * .05], 50); sh(p, 30); }, [[0, 'whoosh', .7]]);
shot(137.81, 'F', 'punch', L => { town(L, 'storm'); const q = clamp((L.lt - .08) / .3); const c = soldat(0, 8, 23.3, -86, .25, L.T, { rifle: 0, pose: q > 0 ? { ...GEST.recoil, crouch: .3 * q } : AIM, expr: q > 0 ? 'shock' : 'determined', eyes: q > 0 ? 'terror' : 'squint', mouth: q > 0 ? 'scream' : 'flat' }); c.root.rotation.x = -q * .3; if (q >= 1) dizzy(c, L.T);
  const s2 = soldat(1, 13, 23.3, -88, .15, L.T, { rifle: 1, pose: q > 0 ? GEST.shock : AIM, expr: q > 0 ? 'shock' : 'determined', mouth: q > 0 ? 'o' : 'flat' }); grade.uniforms.flash.value = L.lt < .08 ? .5 : 0;
  cm([17, 28.4, -73, 9.5, 26, -86, 46], [16, 28, -74, 9.5, 26, -86, 44], L.k); sh(V(9, 23, -86), 16); }, [[0, 'impact', .7], [.12, 'thud', .5], [.24, 'thud', .5]]);
// 104 «Die Rakete machte eine Kehrtwende»: el cohete del helicóptero da la vuelta en U
const HP = V(CATCH.x + 34, 30, CATCH.z + 10);
const uturn = u => { const a = HP.clone().add(V(-2, -2, 0)); if (u < .5) { const k = u / .5; return a.clone().lerp(V(CATCH.x + 6, 10, CATCH.z + 4), k); } const k = (u - .5) / .5; const c = V(CATCH.x + 6, 10, CATCH.z + 4); const ang = k * PI; return V(c.x + Math.sin(ang) * 6 * (1 - k) + (HP.x - c.x) * k * k, c.y + (HP.y - c.y) * k, c.z + Math.cos(ang) * 6 - 6 + (HP.z - c.z) * k); };
shot(138.89, 'S', null, L => { town(L, 'storm'); show(HELI[0], HP.x, HP.y, HP.z, -PI / 2); HELI[0].userData.spin(L.T); rocketPath(0, uturn, .1 + L.k * .4); const p = ROCK[0].position; cam([CATCH.x - 8, 6, CATCH.z + 22], [p.x, p.y, p.z], 48); sh(CATCH, 30); }, [[0, 'ignite', .6], [.1, 'whoosh', .6]]);
shot(139.63, 'R', null, L => { town(L, 'storm'); show(HELI[0], HP.x, HP.y, HP.z, -PI / 2); HELI[0].userData.spin(L.T); rocketPath(0, uturn, .5 + L.k * .35); const p = ROCK[0].position; cam([p.x - 4, p.y + 5, p.z + 14], [p.x, p.y, p.z], 46); badge('gold', 'U-TURN', W / 2, H * .15, (L.lt - .2) * 3); sh(p, 30); }, [[0, 'whoosh_up', .6]]);
// 105 «und knallte in ihren eigenen Hubschrauber.»
shot(140.55, 'W', null, L => { town(L, 'storm'); show(HELI[0], HP.x, HP.y, HP.z, -PI / 2); HELI[0].userData.spin(L.T); rocketPath(0, uturn, .85 + L.k * .15); cam([HP.x - 22, HP.y - 4, HP.z + 22], [HP.x, HP.y, HP.z], 46); sh(HP, 30); }, [[0, 'whoosh', .6]]);
shot(141.33, 'C', 'punch', L => { town(L, 'storm'); boom(0, HP, L.t0, L.T, 2.6); boom(1, HP.clone().add(V(4, -4, 2)), L.t0 + .3, L.T, 1.8); if (L.lt < .1) { show(HELI[0], HP.x, HP.y, HP.z, -PI / 2); } cam([HP.x - 34, HP.y - 10, HP.z + 34], [HP.x, HP.y, HP.z], 50); SHAKE = .5; sh(HP, 40); }, [[0, 'explosion', 1], [.3, 'boom', .7], [.6, 'rubble', .5]]);
// 106 «Nur die Robbe überlebte.»: la Robbe baja en paracaídas entre el humo
const CHUTE = (() => { const g = new THREE.Group(); scene.add(g); const c = new THREE.Mesh(new THREE.SphereGeometry(5, 20, 10, 0, 6.283, 0, 1.2), mat(0xff8a3a, { roughness: .6, side: THREE.DoubleSide })); c.position.y = 9; g.add(c); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; const l = cyl(.04, .04, 8, mat(0xffffff), 4, g, Math.cos(a) * 2.2, 5, Math.sin(a) * 2.2); l.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5); } outline(g, 1); g.visible = false; PROPS.push(g); return g; })();
shot(142.54, 'F', null, L => { town(L, 'storm'); const y = 24 - L.lt * 6; const r = robbe(CATCH.x + 16, y, CATCH.z, -PI / 2 + .4, L.T, { headX: -.1 }); show(CHUTE, CATCH.x + 16, y, CATCH.z, 0); dust(V(HP.x, HP.y - 8, HP.z), L.t0 - .4, L.T, 10, 2); orbit(V(CATCH.x + 16, y + 4, CATCH.z), 20, -.6, .05, 46); sh(V(CATCH.x + 16, 0, CATCH.z), 20); }, [[0, 'whoosh_soft', .5], [.3, 'wind', .4]]);
cut(143.14, null, [0.6, 0.9, 0], [[0, 'swipe', .4]]);
// 107 «Sie klatschte einfach.»: aterriza y aplaude con las aletas
shot(143.80, 'C', 'punch', L => { town(L, 'storm'); const r = robbe(CATCH.x + 8, 0, CATCH.z, -PI / 2 + .4, L.T, { clap: 1, rate: 10 }); orbit(V(CATCH.x + 8, 3.4, CATCH.z), lerp(10, 9, L.k), -PI / 2 + .6, .05, 42); sh(V(CATCH.x + 8, 0, CATCH.z), 12); }, [[0, 'clap', .6], [.25, 'clap', .6], [.5, 'clap', .6], [.75, 'clap', .6]]);
