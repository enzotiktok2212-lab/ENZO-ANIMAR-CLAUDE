// ===== 50,5–60,6 s: los vídeos se cumplen =====
const hop = (c, L, x, z, ry, ph = 0, h = 1.6) => { const t = (L.lt + ph) % .9; c.root.visible = true; c.root.rotation.set(0, ry, 0); saltar(c, t, 0, { h, dur: .45, base: [x, 0, z] }); };
function steam(L, n = 40) { FL.STEAM.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 7 + 2), ph = (L.T * .5 + r()) % 1; s.visible = true; s.position.set(-8 + r() * 16, ph * 6, -40 + r() * 50); s.scale.setScalar(.6 + ph * 2); s.material.opacity = .4 * (1 - ph); }); }
// 34 «Am nächsten Morgen war der Schulboden so heiß,» — pasillo del colegio: el suelo al rojo, vapor; los alumnos dan saltitos
shot(50.53, 'F', null, L => { use('FL'); inside(.9); FL.hot.emissiveIntensity = .55 + Math.sin(L.T * 3) * .1; steam(L); hop(ich, L, FX, -8, 0, 0, 1.4); cara(ich, L.T, { expr: 'shock', mouth: 'scream' });
  hop(K[0], L, FX - 5, -16, .3, .3, 1.8); cara(K[0], L.T, { expr: 'scared' }); hop(K[5], L, FX + 5, -20, -.3, .6, 1.5); cara(K[5], L.T, { expr: 'shock' }); hop(er, L, FX - 2, -28, .1, .15, 1.6); cara(er, L.T, { expr: 'scared' });
  cm([FX + 1.5, 5.4, 9, FX, 3.4, -12, 50], [FX + 1.2, 5, 6.5, FX, 3.4, -12, 48], L.k); sh(V(FX, 0, -12), 30); }, [[0, 'pan_sizzle', .6], [.3, 'jump_small', .5], [.7, 'steam', .5], [1.2, 'jump_small', .5], [1.8, 'gasp', .4]]);
// 35 «dass meine Sohlen geschmolzen sind.» — mis zapatillas: la suela gotea derretida y echa humo
shot(52.95, 'C', null, L => { use('FL'); inside(.9); FL.hot.emissiveIntensity = .6; steam(L, 20); put(ich, FX, .15, -8, .2); actuar(ich, L.lt, [[0, { lLx: .2, lRx: -.1, aLz: .5, aRz: .5, aLe: .6, aRe: .6, headX: .4, ...shiver(L.T, 1.4) }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', mouth: 'scream' });
  const f = V(FX, .2, -8); DRIP.forEach((d, i) => { const r = RNG(i * 5 + 1), ph = (L.T * 1.2 + r()) % 1; d.visible = true; d.position.set(f.x + (i % 2 ? .55 : -.55) + (r() - .5) * .6, .25 - ph * .25, f.z + .2 + (r() - .5) * .9); d.scale.set(1, 1 + ph * 2, 1); }); smoke(V(FX, .2, -7.6), L.T, .35, 14, 0x8a8a92);
  cm([FX + 2.8, .7, -4.4, FX, .25, -8, 50], [FX + 2.4, .7, -5, FX, .3, -8, 46], L.k); sh(V(FX, 0, -8), 12); }, [[0, 'pan_sizzle', .7], [.4, 'drip', .5], [.8, 'steam', .5], [1.2, 'drip', .4]]);
// 36 «Und vor Omas Haus stand ein echtes Mammut.» — zoom lento: delante de la casa de la Oma, un mamut gigante de verdad; la Oma en la puerta con la boca abierta
shot(54.63, 'W', 'slow', L => { use('NB'); morning(); const M = MAM[0]; M.root.visible = true; M.root.position.set(NX - 2, 0, 3); M.root.rotation.y = .9; M.pose(L.T, 0, { trunkUp: 1, headY: -.3 });
  put(oma, NX - 18.6, 0, 9, PI / 2 + .3); actuar(oma, L.lt, [[0, 'shock']], { T: L.T }); cara(oma, L.T, { expr: 'shock', mouth: 'o' }); attach(BOWLS[0], oma.aR.hand, [0, -.7, .3], [0, 0, 0], .5);
  cm([NX + 5, 5, 40, NX - 7, 8, 3, 54], [NX + 3, 5.4, 30, NX - 7, 8, 3, 50], L.k, easeIn); sh(V(NX - 10, 0, 4), 40); }, [[0, 'birds', .4], [.3, 'steps_heavy', .6], [1.2, 'growl', .4]]);
// 37 «Die Videos zeigen nicht, was passiert.» — yo en la plaza, enseño el móvil con el vídeo del mamut, muy preocupado
shot(57.29, 'Z', null, L => { city(L, 'morning'); bigVid('mammut'); put(ich, -2, 0, 12, .15); actuar(ich, L.lt, [[0, SHOW]], { T: L.T }); talk(ich, L.T, 57.29, 59.52, 'worried'); holdShow(0, ich, 'mammut', { prog: .7 });
  const h = hp(ich), q = wpos(PH[0]), m = h.clone().add(q).multiplyScalar(.5); cm([m.x + 1, m.y + .8, m.z + 9, m.x, m.y + .3, m.z, 46], [m.x + .8, m.y + .7, m.z + 8, m.x, m.y + .3, m.z, 44], L.k); sh(V(-2, 0, 12), 20); }, [[0, 'click_metal', .4], [.5, 'heartbeat', .5], [1.4, 'notif', .3]]);
// 38 «Sie bestimmen es.» — golpe de zoom a la pantalla gigante, que se tiñe de rojo
shot(59.52, 'C', null, L => { city(L, 'morning'); ST.big.userData.draw('red', (c, w, h) => { drawVid(c, w, h, 'lava', { ui: false }); c.fillStyle = 'rgba(200,0,20,.45)'; c.fillRect(0, 0, w, h); txt(c, 'IN DIESER STADT…', w / 2, h * .12, w * .09, '#fff', '#000', 8); }); TINT = 'rgba(160,0,20,.12)';
  const k = easeOut(clamp(L.lt / .25)); cam([0, lerp(4, 8, k), lerp(-20, -34, k)], [0, 32, -64], lerp(60, 48, k)); sh(V(0, 0, -50), 30); }, [[0, 'impact', .8], [.05, 'boom', .5], [.5, 'hum_low', .4]]);

// ===== 60,6–68,3 s: la pista =====
const meDesk = (L, pose = {}) => { sit(ich, ZX - 6, 3.25, -6.4, PI); actuar(ich, L.lt, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: .7, aRe: .7, headX: .1, ...pose }]], { T: L.T }); };
const lapIns = (L, d0 = 3.2, d1 = 2.6) => { const q = wpos(ZI.lapS), d = lerp(d0, d1, easeInOut(L.k)); cam([q.x + .3, q.y + .5, q.z + d], [q.x, q.y, q.z], 44); };
// 39 «Also habe ich jedes Video» — en mi escritorio, decidido, con el portátil
shot(60.6, 'S', null, L => { use('ZI'); inside(.8); ZI.lapS.userData.draw('p' + Math.round(L.k * 6), (c, w, h) => drawPause(c, w, h, L.k * .3)); meDesk(L, { headX: .15 }); cara(ich, L.T, { expr: 'determined' });
  onFace(ich, 6, .4, 3, 50, L.k, 5.4); sh(V(ZX - 6, 0, -8), 15); }, [[0, 'keys', .5], [.6, 'click_metal', .4], [1.0, 'keys', .4]]);
// 40 «Bild für Bild angehalten.» — la pantalla: pausa, fotograma a fotograma
shot(62.0, 'Z', null, L => { use('ZI'); inside(.8); const k = L.k; ZI.lapS.userData.draw('p2' + Math.round(k * 10), (c, w, h) => drawPause(c, w, h, .3 + k * .6)); meDesk(L); lapIns(L); sh(V(ZX - 6, 0, -8), 15); }, [[0, 'click_metal', .5], [.4, 'click_metal', .5], [.8, 'click_metal', .5], [1.2, 'click_metal', .5], [1.6, 'click_metal', .4]]);
// 41 «Und in jedem einzelnen sieht man im Hintergrund» — vídeo tras vídeo, siempre un círculo rojo en el mismo sitio del fondo
shot(63.77, 'C', null, L => { use('ZI'); inside(.8); const kind = ['lava', 'mammut', 'plain'][Math.floor(L.lt / .7) % 3]; ZI.lapS.userData.draw('clue' + kind, (c, w, h) => { c.fillStyle = '#1a1c24'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * .3, 0); drawClue(c, w * .4, h, kind, 0); c.restore(); }); meDesk(L); lapIns(L, 3, 2.7); sh(V(ZX - 6, 0, -8), 15); }, [[0, 'pop', .5], [.7, 'pop', .5], [1.4, 'pop', .5], [1.8, 'hmm', .4]]);
// 42 «dieselbe Uhr:» — zoom lento dentro del vídeo hasta el reloj de la torre
shot(65.91, 'Z', 'slow', L => { use('ZI'); inside(.8); const z = easeIn(L.k); ZI.lapS.userData.draw('cz' + Math.round(z * 20), (c, w, h) => { c.fillStyle = '#1a1c24'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * .3, 0); drawClue(c, w * .4, h, 'mammut', z); c.restore(); }); meDesk(L); lapIns(L, 2.6, 2.2); sh(V(ZX - 6, 0, -8), 15); }, [[0, 'clock_tick', .5], [.5, 'clock_tick', .5]]);
// 43 «die vom Rathausturm.» — grúa hacia arriba: la torre del reloj del Rathaus al final de la plaza
shot(67.02, 'F', null, L => { city(L); bigVid('plain'); cm([6, 4, -150, 0, 34, -226, 52], [3, 26, -170, 0, 52, -226, 46], L.k); sh(V(0, 0, -200), 60); }, [[0, 'bell_far', .6], [.4, 'birds', .4], [.9, 'clock_tick', .4]]);

// ===== 68,3–85,2 s: la torre por dentro =====
// 44 «Um vier Uhr nachts» — de noche, me acerco a escondidas a la torre (capucha), con la linterna del móvil
shot(68.3, 'W', null, L => { city(L, 'night'); bigVid('plain'); const p = caminar(ich, L.lt, { x: 4, z: -196, ry: PI, speed: 3, T: L.T, extra: { ...GEST.sneak, crouch: .3 } }); cara(ich, L.T, { expr: 'scared', eyes: 'side_l' });
  badge('num', '4:00 UHR', W / 2, H * .14, (L.lt - .1) * 2.5); cm([p.x + 5, 4.4, p.z + 10, p.x, 4, p.z - 8, 54], [p.x + 4.4, 4.2, p.z + 9, p.x, 4.4, p.z - 8, 52], L.k); sh(V(p.x, 0, p.z), 30); }, [[0, 'crickets', .5], [.2, 'steps', .4], [.5, 'owl', .4], [.7, 'steps', .3]]);
// 45 «bin ich durchs Lüftungsgitter» — arranco la rejilla de ventilación de la fachada
shot(69.18, 'C', null, L => { city(L, 'night'); const k = easeIn(clamp((L.lt - .3) / .6)); ST.GRILL.position.set(2.2 + k * .4, 2.4 - k * 2.1, .5 + k * 1.6); ST.GRILL.rotation.set(-k * 1.4, 0, k * .3);
  put(ich, 4, 0, -219.4, PI); actuar(ich, L.lt, [[0, { ...GEST.sneak, aLx: 1.4, aRx: 1.4, aLe: .5, aRe: .5 }], [.3, { crouch: .35, lean: -.15, aLx: .8, aRx: .8, aLe: .9, aRe: .9, lLx: .3, lLk: .4 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined' });
  cm([12, 3.8, -213, 4, 2.6, -221.5, 50], [11, 3.6, -214, 4, 2.6, -221.5, 48], L.k); sh(V(4, 0, -220), 15); }, [[0, 'metal_creak', .6], [.5, 'metal_rip', .5], [.9, 'metal_hit', .5]]);
// 46 «in den Turm geklettert.» — dentro del conducto: gateo hacia la luz
shot(70.3, 'R', null, L => { use('SC'); inside(.4, 25); const z = 2 - L.lt * 2.2; put(ich, SX, 1.0, z, PI); ich.root.rotation.set(-1.2, PI, 0); const s = Math.sin(L.T * 7);
  applyPose(ich, { aLx: 1.4 + s * .4, aRx: 1.4 - s * .4, aLe: .3, aRe: .3, lLx: -.2, lRx: -.2, lLk: 1.4 + s * .3, lRk: 1.4 - s * .3, headX: -.9 }); cara(ich, L.T, { expr: 'determined' });
  cam([SX + .8, 3.4, z - 7.5], [SX, 2.2, z], 56); sh(V(SX, 0, z), 12); }, [[0, 'crawl', .6], [.5, 'metal_creak', .4], [.9, 'crawl', .5]]);
// 47 «Hinter dem Ziffernblatt:» — detrás de la esfera del reloj: mi silueta contra los números al revés; engranajes girando
shot(71.48, 'I', null, L => { use('HU'); inside(.35, 0); HU.GEARS.forEach((g, i) => g.rotation.z = L.T * (i % 2 ? .6 : -.8)); HU.dust.forEach((d, i) => { const r = RNG(i * 3 + 1); d.position.set(-6 + r() * 12, 4 + ((r() * 14 + L.T * .3) % 14), -4 + r() * 6); });
  put(ich, UX + .5, 0, -2, PI + .1); actuar(ich, L.lt, [[0, { headX: -.25, aLz: .15, aRz: .15 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock' });
  cm([UX + 2.4, 3, 11, UX, 6, -6, 56], [UX + 2, 3.2, 9.6, UX, 6.4, -6, 54], L.k); sh(V(UX, 0, -3), 15); }, [[0, 'gears', .6], [.4, 'clock_tick', .5], [.8, 'clock_tick', .4]]);
// 48 «ein Raum voller Bildschirme.» — zoom lento hacia atrás: la sala circular con cientos de pantallas; yo diminuto en el centro
shot(72.48, 'F', 'slow', L => { use('TR'); inside(.5, 0); put(ich, TX, 0, -12, .2); actuar(ich, L.lt, [[0, { headX: -.3, headY: .4, aLz: .3, aRz: .3, aLe: .4, aRe: .4 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', mouth: 'o' }); camPose(L, 0);
  cm([TX + 6, 6, -17, TX + 9, 8, 4, 50], [TX + 8, 12, -22, TX + 10, 12, 8, 70], L.k, easeIn); sh(V(TX, 0, 0), 30); }, [[0, 'machine_hum', .5], [.3, 'hum_low', .4]]);
function camPose(L, look = 0, tgt = null) { const C = TR.CAM; C.arm1.rotation.x = .25 + Math.sin(L.T * .7) * .05; C.arm2.rotation.x = .55; C.head.rotation.x = .35; C.yaw.rotation.y = Math.sin(L.T * .4) * .3; C.rec.material.emissiveIntensity = Math.sin(L.T * 6) > 0 ? 2 : .2; }
// 49 «Über fünfhundert.» — panorámica por la pared de pantallas; «500+»
shot(74.36, 'W', null, L => { use('TR'); inside(.5, 0); camPose(L); const a = lerp(-.4, .5, easeInOut(L.k)); cam([TX + Math.sin(a) * 6, 14, Math.cos(a) * 6], [TX + Math.sin(a) * 24, 16, Math.cos(a) * 24], 56); badge('num', 'ÜBER 500', W / 2, H * .45, (L.lt - .1) * 2.5, 1, 1.4); sh(V(TX, 0, 0), 30); }, [[0, 'tv_static', .4], [.2, 'pop', .6], [.8, 'machine_hum', .4]]);
// 50 «Auf jedem ein Haus aus unserer Stadt.» — de cerca: casas en las pantallas (la de la Oma con el mamut); yo señalo
shot(75.74, 'C', null, L => { use('TR'); inside(.5, 20); camPose(L); const a = .8; put(ich, TX + Math.sin(a) * 15, 0, Math.cos(a) * 15, a + .2); actuar(ich, L.lt, [[0, 'idle'], [.3, { ...GEST.point, aRx: 2.0 }]], { T: L.T, extra: { headY: -.2, headX: -.3 } }); cara(ich, L.T, { expr: 'shock' });
  const p = V(TX + Math.sin(a) * 15, 0, Math.cos(a) * 15); cm([p.x - 7, 6.4, p.z - 2, p.x + 5, 10, p.z + 5, 52], [p.x - 6, 6.6, p.z - 1.4, p.x + 5, 10.4, p.z + 5, 50], L.k); sh(p, 20); }, [[0, 'tv_static', .4], [.4, 'gasp', .5], [1.2, 'pop', .3]]);
// 51 «Und in der Mitte eine riesige Kamera,» — tilt hacia arriba por la cámara gigante en su brazo robótico; el piloto REC parpadea
shot(77.9, 'S', null, L => { use('TR'); inside(.5, 10); camPose(L); put(ich, TX + 3, 0, -10, -.3); actuar(ich, L.lt, [[0, { headX: -.6, lean: -.1, aLz: .2, aRz: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'scared' });
  cm([TX + 6, 2, -22, TX + 2, 6, -6, 60], [TX + 6, 3, -22, TX + 1, 19, 0, 56], L.k); sh(V(TX, 0, -4), 30); }, [[0, 'machine_hum', .6], [.4, 'metal_creak', .5], [1.2, 'click_set', .4], [1.8, 'hum_low', .3]]);
// 52 «die ganz von allein das nächste Video geschnitten hat:» — la mesa de montaje: los deslizadores se mueven solos; en la previsualización avanza el vídeo; no hay nadie
const preVid = (L, k) => TR.PRE.userData.draw('pre' + Math.round(k * 30), (c, w, h) => { c.fillStyle = '#10131c'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * .34, 0); drawVid(c, w * .32, h * .78, 'atmen', { prog: k }); c.restore(); c.fillStyle = '#2a2e3a'; c.fillRect(0, h * .8, w, h * .2);
  for (let i = 0; i < 9; i++) { c.fillStyle = ['#3fa8ff', '#ff8a3a', '#2ec46a'][i % 3]; c.fillRect(i * w / 9 + 2, h * .84, w / 9 - 4, h * .06); } c.fillStyle = '#ff2a2a'; c.fillRect(k * w, h * .8, 4, h * .2); txt(c, 'AUTO-SCHNITT…', w * .16, h * .1, h * .06, '#ffd23f'); });
shot(80.14, 'Z', null, L => { use('TR'); inside(.5, 20); camPose(L); preVid(L, L.k); TR.slider.forEach((s, i) => s.position.x = -3 + i * 1.2 + Math.sin(L.T * 3 + i) * .3);
  put(ich, TX - 3, 0, -2, -.9); actuar(ich, L.lt, [[0, { headX: .1, aLx: .4, aRx: .4 }]], { T: L.T }); cara(ich, L.T, { expr: 'confused' });
  const q = wpos(TR.PRE), f = V(Math.sin(.9), 0, Math.cos(.9)); cm([q.x + f.x * 9 + 2, q.y + 1, q.z + f.z * 9, q.x, q.y - 2.4, q.z, 50], [q.x + f.x * 7.6 + 1.6, q.y + .8, q.z + f.z * 7.6, q.x, q.y - 2.2, q.z, 48], L.k); sh(q, 20); }, [[0, 'keys', .5], [.5, 'click_metal', .4], [1.0, 'tape', .4], [1.6, 'keys', .4], [2.2, 'click_metal', .3]]);
// 53 «In dieser Stadt zahlt jeder fürs Atmen.» — la previsualización de cerca: el próximo vídeo; me tapo la boca aguantando la respiración
shot(82.8, 'C', null, L => { use('TR'); inside(.5, 20); camPose(L); preVid(L, .3 + L.k * .6); put(ich, TX - 3, 0, -2, -.9); actuar(ich, L.lt, [[0, { ...GEST.hands_face, aRx: 1.9, aLx: 1.9 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', blush: 1 });
  const q = wpos(TR.PRE), f = V(Math.sin(.9), 0, Math.cos(.9)); cm([q.x + f.x * 4.6, q.y + .2, q.z + f.z * 4.6, q.x, q.y, q.z, 48], [q.x + f.x * 4, q.y + .1, q.z + f.z * 4, q.x, q.y, q.z, 46], L.k); sh(q, 20); }, [[0, 'gasp', .5], [.5, 'coins', .5], [1.0, 'breath', .5], [1.7, 'cash_reg', .4]]);
