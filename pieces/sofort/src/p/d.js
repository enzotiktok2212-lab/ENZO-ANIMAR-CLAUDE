// ---------- d: cárceles en silencio, estatua, miedo del alcalde, tanques, cárcel, juicio, escalinata, Rathaus, final (101,1 – 174,1 s) ----------
const BOOTH = (() => { const g = new THREE.Group(); scene.add(g); box(4, 7, 4, mat(0xd8d4cc, { roughness: .8 }), .1, g, 0, 3.5, 0); box(4.4, .5, 4.4, mat(0x8a2a2a), .1, g, 0, 7.2, 0); box(3, 2, .2, mat(0x9ad0f4, { roughness: .1, metalness: .4 }), .02, g, 0, 4.6, 2.02);
  const s = textPlane(3.4, .8, 270, 64, (c, w, h) => { c.fillStyle = '#1a2a5a'; c.fillRect(0, 0, w, h); txt2(c, 'WACHE', w / 2, h / 2 + 3, 44, '#ffffff'); }, .3); s.position.set(0, 6.4, 2.06); g.add(s); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const GCAP = (() => { const m = mat(0x1a2a5a); const g = new THREE.Group(); scene.add(g); cyl(.78, .74, .5, m, 20, g, 0, .25, 0); box(1.6, .1, 1.1, mat(0x101010), .05, g, 0, 0, .45); g.visible = false; PROPS.push(g); return g; })();
const DESK = (() => { const g = new THREE.Group(); scene.add(g); box(12, .6, 5, mat(0x5a3218, { roughness: .4 }), .1, g, 0, 4, 0); box(11.6, 3.8, 4.6, mat(0x4a2410, { roughness: .5 }), .1, g, 0, 1.9, 0);
  const sc = textPlane(4, 3, 320, 240, (c, w, h) => { c.fillStyle = '#f4e8c8'; c.fillRect(0, 0, w, h); txt2(c, 'NEUE REGELN', w / 2, 34, 36, '#3a2010'); ['1. Ich entscheide.', '2. Wer Nein sagt …', '3. ???'].forEach((t, i) => { c.font = `700 26px ${FONT}`; c.textAlign = 'left'; c.fillStyle = '#3a2010'; c.fillText(t, 26, 90 + i * 50); }); }, .3);
  sc.rotation.x = -PI / 2; sc.position.set(0, 4.32, .6); g.add(sc); const q = cyl(.06, .02, 2.2, mat(0xffffff), 6, g, 2, 5.2, .8); q.rotation.z = -.6; g.userData.quill = q; g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const office = () => { use('TR'); night(30); inside(.85, 40); TR.T.visible = false; TR.sg.visible = false; OSIGN.visible = true; };
const ROOFY = 6.4, STZ = -354;   // escalinata del Landgericht (DT)
const court = () => { use('GE'); inside(.9, 40); };
const JUDGE = (L, ex = {}) => { const j = put(richter, GEX, 6.6, -17.5, 0); actuar(j, L.lt, [[0, { ...SIT, aLx: .9, aRx: .9, aLe: .9, aRe: .9, ...ex }]], { T: L.T }); return j; };
const DOCKC = (L, pose = 'idle', ry = PI) => { const c = put(ich, GEX, 0, 1.6, ry); actuar(c, L.lt, [[0, pose]], { T: L.T }); c.props.wind = .2; return c; };
const officials = (L, skip = []) => { const p = put(polizist, GEX - 15, 0, -9, PI / 2 - .3), m = put(mayor, GEX + 15, 0, -9, -PI / 2 + .3); [p, m].forEach((c, i) => { if (skip.includes(c)) { c.root.visible = false; return; } actuar(c, L.lt, [[0, i ? 'cross' : 'idle']], { T: L.T + i }); cara(c, L.T + i, { expr: 'smug', mouth: 'flat' }); }); return [p, m]; };
const gallery = (L, mode = 'still', silent = false) => { crowdGrid(GEX, 10, 12, 4, 4, PI, 0, .9); stands(L.T, mode, silent); };

// 63 «Plötzlich wurde jedes Gefängnis»: la cárcel de noche; el foco barre el patio… y se apaga
shot(tw('Plötzlich'), 'C', null, L => { use('KN'); night(20); KN.SPOT.intensity = L.lt < 1 ? 600 : 0; KN.beam.visible = L.lt < 1; KN.beam.rotation.y = Math.sin(L.T) * .5; DARK = L.lt > 1 ? .25 : 0;
  cm([KNX + 30, 14, 60, KNX, 12, -15, 50], [KNX + 22, 18, 46, KNX, 12, -15, 48], L.k); sh(V(KNX, 0, -10), 60); }, [[0, 'whoosh', .5], [.3, 'night_ambience', .5], [1.0, 'power_down', .7]]);
// 64 «gleichzeitig still.»: dentro de una celda: sobre la cama solo queda un montoncito de polvo y el uniforme a rayas
shot(tw('gleichzeitig'), 'I', null, L => { use('ZE'); inside(.7, 30); show(PILES[0], ZEX - 5, 2.6, -6, 0, .9); dust(V(ZEX - 5, 2.4, -6), L.t0 - .2, L.T, 6, .5);
  cm([ZEX + 3, 6.5, 6, ZEX - 4.5, 2.6, -6, 48], [ZEX + 2, 6, 5, ZEX - 4.5, 2.6, -6, 46], L.k); sh(V(ZEX, 0, -4), 20); }, [[0, 'silence_hit', .6], [.4, 'sand', .4], [.9, 'drip', .3]]);
// 65 «Über Nacht fiel die Kriminalität auf null.»: la pantalla de la plaza: la curva cae en picado hasta 0
shot(tw('Über'), 'W', null, L => { town('morning'); BIGTV.visible = true; const k = clamp(L.lt / 1.6); tvDraw(BIGTV.userData.scr, 'crime' + Math.round(k * 30), (c, w, h) => { c.fillStyle = '#0e1430'; c.fillRect(0, 0, w, h); txt2(c, 'KRIMINALITÄT', w / 2, 34, 34, '#ffd23f');
    c.strokeStyle = '#ff4a4a'; c.lineWidth = 8; c.beginPath(); const N = 30; for (let i = 0; i <= N * k; i++) { const x = 30 + i / N * (w - 60), v = i < 12 ? .75 + Math.sin(i * 1.3) * .08 : Math.max(0, .75 - (i - 12) / 6); c.lineTo(x, h - 30 - v * (h - 90)); } c.stroke(); });
  badge('green', 'NULL', W / 2, H * .17, (L.lt - 1.2) * 3, 1, 1.2); crowdGrid(-6, -46, 10, 6, 3, PI, 0, 0); stands(L.T, 'still', true);
  cm([-6, 12, -12, -6, 22, -70, 52], [-6, 14, -20, -6, 22, -70, 48], L.k); sh(V(-6, 0, -50), 50); }, [[0, 'beep', .4], [.4, 'slide_down', .6], [1.3, 'ding', .6]]);
// 66 «Sie bauten mir eine Statue.»: la estatua de piedra del capitán en la plaza; grúa hacia arriba; la gente aplaude
shot(tw('Sie', 2), 'R', null, L => { town(); SOCK.visible = true; const st = put(statue, -6, 7.2, -30, 0); actuar(st, 0, [[0, { aRx: 2.9, aRz: .3, aRe: .1, aLz: .2 }]], { T: 0 }); cara(st, 0, { eyes: 'normal', mouth: 'smirk', noBlink: true });
  folk(-6, -30, 10, 10, 18, L.T, 31, { mode: 'cheer', face: V(-6, 0, -30) }); confRain(V(-6, 4, -30), L.T, 40, 30, 20, 30);
  cm([-6, 3, -4, -6, 12, -30, 54], [-6, 9, -10, -6, 16, -30, 52], L.k); sh(V(-6, 0, -26), 40); }, [[0, 'whoosh', .4], [.2, 'cheer', .7], [.8, 'fanfare', .4]]);
// 67 «Kinder trugen meinen Umhang zur Schule.»: niños con capas negras y violetas corren por la calle hacia el colegio
shot(tw('Kinder'), 'S', null, L => { town(); for (let i = 0; i < 6; i++) { const c = K[i]; const z = 60 - i * 3.2 - L.lt * 6; put(c, 22 + (i % 3) * 3, 0, z, PI); c.root.scale.setScalar(.7); applyPose(c, runPoseL(L.T * 1.6 + i)); capeOn(c); c.props.wind = 1.4; c.props.fly = .3; grin(c, L.T + i); }
  orbit(V(25, 3, 50 - L.lt * 6), lerp(16, 14, L.k), PI + .5, .12, 46); sh(V(25, 0, 48), 30); }, [[0, 'kids_laugh', .6], [.4, 'footsteps_run', .5], [1.0, 'school_bell', .4]]);
// 68 «Aber der Bürgermeister bekam Angst.»: el alcalde, escondido tras una columna del Rathaus, mira la estatua y suda
shot(tw('Aber', 3), 'W', null, L => { town(); const m = put(mayor, -16, 0, -64, PI * .85); actuar(m, L.lt, [[0, 'hug_self']], { T: L.T }); cara(m, L.T, { expr: 'worried', mouth: 'wavy' }); sweat(m, L.T);
  badge('tag', 'BÜRGERMEISTER', W / 2, H * .2, (L.lt - .3) * 3); onFace(m, 8, -.3, .4, 42); sh(V(-16, 0, -64), 20); }, [[0, 'whoosh', .4], [.4, 'gulp', .6], [1.2, 'heartbeat', .4]]);
// 69 «Nicht vor den Verbrechern.»: el alcalde mira un montoncito de polvo en la acera y niega con la cabeza
shot(tw('Nicht', 1), 'C', null, L => { town(); show(PILES[0], -10, 0, -66, 0, .9); const m = put(mayor, -13, 0, -70, .6); actuar(m, L.lt, [[0, { headY: Math.sin(L.T * 8) * .4, headX: .25, lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'sad', mouth: 'frown' });
  orbit(V(-11.5, 3, -68), 10, .9, .2, 44); sh(V(-12, 0, -68), 20); }, [[0, 'whoosh', .3], [.3, 'tsk', .5]]);
// 70 «Vor mir.» golpe: contrapicado del capitán, sonriendo, con aura violeta
shot(tw('Vor', 1), 'C', 'punch', L => { town(); const c = hover(ich, -6, 1.2, -50, 0, L.T, { pose: CROSS, a: .1 }); smug(c, L.T); purple(L, .8);
  cm([-6, 1.4, -40, -6, 7, -50, 46], [-6, 1.6, -41, -6, 7.2, -50, 44], L.k); sh(V(-6, 0, -50), 20); }, [[0, 'braam', .6], [.3, 'power_up', .4]]);
// 71 «Denn wenn ich entscheide, wer ein Verbrecher ist …»: pasea entre la gente y la señala uno a uno; todos se encogen
shot(tw('Denn', 2), 'W', null, L => { town(); const c = put(ich, -6 + L.lt * 2, 0, -40, PI * .6); applyPose(c, { ...walkP(L.T), aRx: 1.6, aRe: .1 }); cara(c, L.T, { expr: 'sus', mouth: 'smirk' });
  for (let i = 0; i < 5; i++) { const p = BG[i]; put(p, -14 + i * 4, 0, -34 + (i % 2) * 2, PI * .9); actuar(p, L.lt, [[0, 'cower']], { T: L.T + i }); cara(p, L.T + i, { expr: 'worried', mouth: 'wavy' }); }
  POST.push(() => { QM.visible = true; QM.position.copy(hp(BG[2])).add(V(0, 2.4, 0)); QM.lookAt(camera.position); }); cm([-6, 7, -18, -4, 4, -38, 48], [-3, 7, -20, -2, 4, -38, 46], L.k); sh(V(-4, 0, -36), 30); }, [[0, 'footsteps', .4], [.6, 'tension', .5], [1.4, 'gasp', .4]]);
// 72 «was entscheide ich dann noch?» (zoom lento): sus ojos se entrecierran; viñeta
shot(tw('was', 2), 'Z', 'slow', L => { town('dusk'); const c = put(ich, -6, 0, -40, 0); actuar(c, L.lt, [[0, CROSS]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'smirk' }); purple(L, L.k);
  onFace(c, 6, -.1, .15, 38, L.k, 4); sh(V(-6, 0, -40), 20); }, [[0, 'tension', .5]]);
// 73 «Also standen zwölf Panzer auf meinem Rasen.»: doce tanques aparcados en el césped y la calle de su casa; «12»
const tanks = (L, n = 12, aim = 0) => { TANKS.forEach((t, i) => { if (i >= n) return; const r = (i / 4) | 0, c = i % 4; show(t, 30 + c * 13, 0, 78 + r * 16 + (c % 2) * 3, -PI / 2); t.userData.tur.rotation.y = aim * Math.sin(i) * .2; }); };
shot(tw('Also', 2), 'C', null, L => { town(); tanks(L); badge('num', '12 PANZER', W / 2, H * .17, (L.lt - .6) * 3);
  cm([36, 74, 150, 44, 0, 96, 50], [34, 80, 146, 44, 0, 98, 48], L.k); sh(V(40, 0, 96), 60); }, [[0, 'tank_engine', .8], [.6, 'ding', .4], [1.0, 'tank_tracks', .5]]);
// 74 «Panzer auf meinem Rasen.»: de cerca: las torretas giran hacia la puerta; soldados apuntan
shot(tw('Panzer'), 'S', null, L => { town(); tanks(L, 12, 1); TANKS[0].userData.tur.rotation.y = -.2 + L.k * .2; SOLD.forEach((s, i) => { put(s, 20 + (i % 2) * 2, 0, 88 + i * 4, -PI / 2); actuar(s, L.lt, [[0, { aLx: 1.4, aRx: 1.5, aLe: .5, aRe: 1.2 }]], { T: L.T + i }); cara(s, L.T + i, { expr: 'determined', mouth: 'flat' }); });
  cm([14, 7, 70, 32, 3, 94, 50], [15, 7, 72, 32, 3, 96, 48], L.k); sh(V(26, 0, 92), 40); }, [[0, 'turret', .7], [.5, 'gun_cock', .5]]);
// 75 «Und ich ließ mich verhaften.»: en la puerta de casa, tiende las muñecas; aparecen las esposas
shot(tw('Und', 8), 'W', null, L => { town(); tanks(L, 12, 1); const c = put(ich, 13, 0, 96, PI / 2); actuar(c, L.lt, [[0, 'idle'], [.2, { aLx: 1.4, aRx: 1.4, aLz: -.25, aRz: -.25, aLe: .3, aRe: .3 }, { dur: .4 }]], { T: L.T }); smug(c, L.T);
  const s = put(SOLD[0], 17, 0, 96, -PI / 2); actuar(s, L.lt, [[0, 'reach']], { T: L.T }); cara(s, L.T, { expr: 'worried', mouth: 'flat' }); if (L.lt > .6) POST.push(() => { const a = wpos(ich.aL.hand), b = wpos(ich.aR.hand); show(CUFFS, (a.x + b.x) / 2, (a.y + b.y) / 2 - .3, (a.z + b.z) / 2, PI / 2); });
  orbit(V(15, 4.4, 96), lerp(11, 9.5, L.k), .25, .1, 44); sh(V(15, 0, 96), 20); }, [[0, 'footsteps', .4], [.6, 'handcuffs', .8]]);
// 76 «Ich hätte die ganze Armee zu Staub machen können.»: él mira los tanques… y por un instante (tinte violeta) los ve todos convertidos en montones de polvo
shot(tw('Ich', 6), 'F', null, L => { town(); const vis = L.lt > .9; if (!vis) tanks(L, 12, 1); else { purple(L, 1.2); TANKS.forEach((t, i) => { const r = (i / 4) | 0, c = i % 4; show(PILES[i % 6], 30 + c * 13, 0, 78 + r * 16 + (c % 2) * 3, 0, 3.4); }); }
  const c = put(ich, 13, 0, 96, PI / 2 + .2); actuar(c, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.25, aRz: -.25, aLe: .3, aRe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', mouth: 'smirk' });
  cm([6, 9, 76, 28, 3, 94, 58], [7, 9, 77, 28, 3, 95, 56], L.k); sh(V(30, 0, 94), 60); }, [[0, 'whoosh', .4], [.9, 'poof', .8], [1.0, 'braam', .4]]);
// 77 «Aber dann wäre ich ja der Böse.»: guiña un ojo a cámara, con las esposas puestas
shot(tw('Aber', 4), 'C', 'punch', L => { town(); const c = put(ich, 13, 0, 96, PI / 2); actuar(c, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.25, aRz: -.25, aLe: .3, aRe: .3 }]], { T: L.T }); cara(c, L.T, { eyes: L.lt > .5 ? 'wink' : 'normal', mouth: 'smirk', noBlink: true });
  POST.push(() => { const a = wpos(ich.aL.hand), b = wpos(ich.aR.hand); show(CUFFS, (a.x + b.x) / 2, (a.y + b.y) / 2 - .3, (a.z + b.z) / 2, PI / 2); }); badge('tag', 'DER BÖSE?', W / 2, H * .2, (L.lt - .3) * 3); onFace(c, 7, -.1, .2, 40); sh(V(13, 0, 96), 20); }, [[0, 'impact', .4], [.5, 'wink', .6]]);
// 78 «Während ich im Gefängnis saß,»: en la celda, sentado en la cama, piernas cruzadas, tan tranquilo
shot(tw('Während'), 'I', null, L => { use('ZE'); inside(.75, 40); const c = put(ich, ZEX - 5, 1.6, -6, .3); actuar(c, L.lt, [[0, { ...SIT, lLx: 1.5, lRx: 1.2, lRk: 1.8, aLx: 2.6, aRx: 2.6, aLe: 2.4, aRe: 2.4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); c.props.wind = .1;
  cm([ZEX + 3, 6, 15, ZEX - 4, 3.6, -6, 46], [ZEX + 1, 6, 13, ZEX - 4.5, 3.6, -6, 44], L.k); sh(V(ZEX, 0, -4), 20); }, [[0, 'cell_door', .6], [.6, 'drip', .3]]);
// 79 «marschierten Tausende mit meinem Gesicht auf ihren Schildern:»: la calle frente a la cárcel llena de gente con pancartas; «TAUSENDE»
shot(tw('marschierten'), 'W', null, L => { use('KN'); day(); crowdGrid(KNX, 10, 12, 14, 2.8, PI, 0, 0); stands(L.T, 'cheer', false); SIGNS.forEach((g, i) => { const r = RNG(i * 5 + 2); show(g, KNX - 14 + r() * 28, Math.abs(Math.sin(L.T * 4 + i)) * .5, 12 + r() * 30, PI); });
  badge('num', 'TAUSENDE', W / 2, H * .16, (L.lt - .5) * 3); cm([KNX + 14, 18, 60, KNX, 4, 20, 54], [KNX + 10, 22, 56, KNX, 4, 18, 52], L.k); sh(V(KNX, 0, 24), 60); }, [[0, 'crowd_march', .7], [.5, 'chant', .6], [1.2, 'drum', .5]]);
// 80 «„Freiheit für den Kapitän!“»: de cerca: pancartas con su cara arriba y abajo; la gente grita
shot(tw('Freiheit'), 'C', 'punch', L => { use('KN'); day(); for (let i = 0; i < 5; i++) { const c = BG[i]; put(c, KNX - 8 + i * 4, 0, 16 + (i % 2) * 2, PI); actuar(c, L.lt, [[0, { aRx: 2.8, aRz: .2, aRe: .2, aLz: .2 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'angry', mouth: 'scream' });
    POST.push(() => { const h = wpos(c.aR.hand); show(SIGNS[i], h.x, h.y - 3 + Math.sin(L.T * 6 + i) * .3, h.z, PI); }); } crowdGrid(KNX, 22, 10, 6, 2.8, PI, 0, 0); stands(L.T, 'cheer', false);
  cm([KNX + 2, 7, -4, KNX, 7, 18, 52], [KNX + 1, 7.4, -2, KNX, 7.4, 18, 50], L.k); sh(V(KNX, 0, 18), 30); }, [[0, 'chant', .8], [.6, 'crowd_cheer', .5]]);
// 81 «Genau das war der Plan.» (zoom lento): en la celda, sonríe a cámara
shot(tw('Genau'), 'Z', 'slow', L => { use('ZE'); inside(.7, 40); const c = put(ich, ZEX - 5, 1.6, -6, .3); actuar(c, L.lt, [[0, { ...SIT, lLx: 1.5, lRx: 1.2, lRk: 1.8, aLx: 2.6, aRx: 2.6, aLe: 2.4, aRe: 2.4 }]], { T: L.T }); grin(c, L.T, { eyes: 'squint' }); purple(L, .5 * L.k);
  onFace(c, 8, -.3, 0, 40, L.k, 5.5); sh(V(ZEX - 5, 0, -6), 20); }, [[0, 'tension', .4], [1.2, 'chuckle', .5]]);
// 82 «Mein Prozess lief auf jedem Sender.»: en un salón, una familia ve el juicio en la tele: «LIVE: PROZESS GEGEN KAPITÄN SOFORT»
shot(tw('Mein', 2), 'W', null, L => { use('WO'); inside(.9, 40); const tv = show(TV, WOX + 4, 2, -13, 0, 1.3); news(tv.userData.scr, 'PROZESS', 'KAPITÄN SOFORT VOR GERICHT');
  const m = put(mama, WOX + 2.4, 0, 1, PI), k = put(K[2], WOX + 5.8, 0, 1.5, PI + .1); k.root.scale.setScalar(.75); [m, k].forEach((c, i) => { actuar(c, L.lt, [[0, i ? 'shock' : 'hands_face']], { T: L.T + i }); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); });
  cm([WOX + 4, 8, 13, WOX + 4, 5, -12, 50], [WOX + 4, 7, 10, WOX + 4, 5, -12, 48], L.k); sh(V(WOX + 3, 0, -4), 30); }, [[0, 'tv_news', .7], [.6, 'gasp', .4]]);
// 83 «Als der Richter fragte, ob ich noch etwas sagen wolle,»: el juez, desde lo alto, se inclina y pregunta
shot(tw('Als', 2), 'S', null, L => { court(); const j = JUDGE(L, { lean: .25 }); talk(j, L.T, L.t0, L.t1, 'sus'); DOCKC(L); gallery(L);
  cm([GEX + 4, 8, -4, GEX, 9.5, -17, 46], [GEX + 3, 8.4, -6, GEX, 9.5, -17, 44], L.k); sh(V(GEX, 0, -12), 30); }, [[0, 'gavel', .6], [.4, 'murmur', .4]]);
// 84 «stand ich auf.»: se levanta en el banquillo; la capa se abre
shot(tw('stand', 2), 'C', 'punch', L => { court(); JUDGE(L); const c = DOCKC(L, 'idle'); c.root.position.y = -1.2 + easeOut(clamp(L.lt / .4)) * 1.2; c.props.wind = 1.4; c.props.fly = .3; smug(c, L.T); gallery(L, 'still', true);
  cm([GEX + 2, 5.5, -7, GEX, 5, 1.6, 46], [GEX + 1.5, 5.4, -5.5, GEX, 5, 1.6, 44], L.k); sh(V(GEX, 0, 0), 20); }, [[0, 'cloth', .6], [.2, 'impact', .4]]);
// 85 «Ich sagte, dass die Leute in diesem Saal»: señala alrededor: al juez, al policía, al alcalde
shot(tw('Ich', 7), 'W', null, L => { court(); JUDGE(L); const c = DOCKC(L, 'point', PI - .9 + L.k * 1.8); talk(c, L.T, L.t0, L.t1, 'angry'); officials(L); gallery(L);
  cm([GEX + 2, 11, -11, GEX, 4.5, 2, 54], [GEX - 2, 11, -11, GEX, 4.5, 2, 52], L.k); sh(V(GEX, 0, -4), 40); }, [[0, 'whoosh', .4], [.4, 'murmur', .5]]);
// 86 «Verbrecher achtzig Jahre lang laufen ließen.»: la tribuna, escandalizada; «80 JAHRE»
shot(tw('Verbrecher', 3), 'C', null, L => { court(); gallery(L, 'still', true); const off = officials(L); off.forEach((c, i) => cara(c, L.T + i, { expr: 'shock', mouth: 'o' }));
  badge('num', '80 JAHRE', W / 2, H * .17, (L.lt - .4) * 3); cm([GEX + 6, 7, -4, GEX + 15, 4.6, -9, 46], [GEX + 7, 7, -4.5, GEX + 15, 4.6, -9, 44], L.k); sh(V(GEX + 14, 0, -9), 20); }, [[0, 'crowd_gasp', .6], [.5, 'ding', .5]]);
// 87 «Und dass die Stadt mich nur deshalb überhaupt brauchte.»: abre los brazos, como un salvador
shot(tw('Und', 9), 'S', null, L => { court(); const c = DOCKC(L, { aLx: 1.2, aRx: 1.2, aLz: 1.0, aRz: 1.0, aLe: .2, aRe: .2 }); talk(c, L.T, L.t0, L.t1, 'smug'); c.props.wind = 1; JUDGE(L);
  onFace(c, 10, -.4, .2 - L.k * .4, 44); sh(V(GEX, 0, 0), 20); }, [[0, 'whoosh', .4], [.6, 'choir', .4]]);
// 88 «Dann schaute ich in die Kamera.»: vista desde la cámara de TV: él mira directo al objetivo; «LIVE»
shot(tw('Dann', 3), 'Z', null, L => { court(); const cp = wpos(GE.CAMS[0]).add(V(0, 5.6, 0)).lerp(V(GEX, 5.6, 1.6), .25); const c = DOCKC(L, 'idle', faceTo(V(GEX, 0, 1.6), cp)); cara(c, L.T, { expr: 'sus', mouth: 'flat' }); JUDGE(L);
  TINT = 'rgba(40,60,80,.12)'; badge('red', '● LIVE', W * .22, H * .1, 1, 1, .6); cm([cp.x, cp.y, cp.z, GEX, 5, 1.6, 40], [cp.x * .97 + GEX * .03, cp.y, cp.z * .9 + 1.6 * .1, GEX, 5, 1.6, 30], L.k); sh(V(GEX, 0, 0), 30); }, [[0, 'camera_zoom', .6], [.5, 'beep', .3]]);
// 89 «Und ich dachte an jeden Richter.»: el juez… puf; queda polvo en el sillón
shot(tw('Und', 10), 'C', null, L => { court(); const j = JUDGE(L); cara(j, L.T, { expr: 'shock', mouth: 'o' }); poof(j, tw('Richter', 2) + .1, L.T, 0, 1);
  cm([GEX + 3, 9, -6, GEX, 8, -17, 46], [GEX + 2.4, 9, -7.4, GEX, 8, -17, 44], L.k); sh(V(GEX, 0, -15), 20); }, [[0, 'tension', .4], [tw('Richter', 2) - tw('Und', 10) + .1, 'poof', .9]]);
// 90 «Jeden Polizisten.»: el policía de la sala… puf
shot(tw('Jeden', 4), 'W', null, L => { court(); const [p] = officials(L); cara(p, L.T, { expr: 'shock', mouth: 'o' }); poof(p, L.t0 + .45, L.T, 1, 1);
  orbit(V(GEX - 15, 4.4, -9), 10, PI / 2 + .2, .1, 44); sh(V(GEX - 15, 0, -9), 20); }, [[0, 'whoosh', .3], [.45, 'poof', .9]]);
// 91 «Jeden Politiker.»: el alcalde… puf; su cadena de oro cae sobre el polvo
shot(tw('Jeden', 5), 'W', null, L => { court(); const [, m] = officials(L); cara(m, L.T, { expr: 'shock', mouth: 'scream' }); poof(m, L.t0 + .4, L.T, 2, 1);
  orbit(V(GEX + 15, 4.6, -9), 10, -PI / 2 - .2, .1, 44); sh(V(GEX + 15, 0, -9), 20); }, [[0, 'whoosh', .3], [.4, 'poof', .9]]);
// 92 «Der Saal wurde still.»: plano general: montoncitos de polvo donde estaban; la tribuna, petrificada; la luz LIVE sigue encendida
shot(tw('Der', 1), 'I', null, L => { court(); show(PILES[0], GEX, 6.1, -17.5, 0, .8); show(PILES[1], GEX - 15, 0, -9, 0, 1); show(PILES[2], GEX + 15, 0, -9, 0, 1); DOCKC(L); gallery(L, 'still', true); DARK = .1;
  cm([GEX, 20, 20, GEX, 3, -8, 54], [GEX, 18, 18, GEX, 3, -8, 52], L.k); sh(V(GEX, 0, -6), 40); }, [[0, 'silence_hit', .7], [.6, 'clock_tick', .4]]);
// 93 «Nur der Stuhl des Richters drehte sich noch.» (zoom lento): el sillón vacío gira despacio; polvo en el asiento
shot(tw('Nur', 2), 'C', 'slow', L => { court(); GE.CHAIR.rotation.y = L.T * 1.4; POST.push(() => { const p = wpos(GE.CHAIR); show(PILES[0], p.x, p.y + 2.8, p.z, 0, .7); });
  cm([GEX + 4, 12, -2, GEX, 8, -17.5, 46], [GEX + 3, 11.4, -5, GEX, 8, -17.5, 40], L.k); sh(V(GEX, 0, -16), 20); }, [[0, 'chair_creak', .7], [.8, 'chair_creak', .5]]);
// 94 «Draußen auf der Treppe warteten Tausende.»: sale por la puerta del Landgericht a lo alto de la escalinata; la avenida, llena
shot(tw('Draußen'), 'W', null, L => { city(); const c = put(ich, DT0, ROOFY, STZ - 2 + L.lt * 2, 0); applyPose(c, walkP(L.T)); smug(c, L.T); crowdGrid(DT0, -332, 9, 12, 2.6, PI, 0, 0); stands(L.T, 'still', true);
  cm([DT0 + 16, 14, -334, DT0, 6, -350, 58], [DT0 + 15, 15, -332, DT0, 6, -350, 56], L.k); sh(V(DT0, 0, -330), 60); }, [[0, 'door_open', .6], [.5, 'crowd_murmur', .5]]);
// 95 «Aber keiner jubelte mehr.»: caras de la gente en primera fila: miedo, silencio
shot(tw('Aber', 5), 'S', null, L => { city(); for (let i = 0; i < 5; i++) { const c = BG[i]; put(c, DT0 - 8 + i * 4, 0, -334 + (i % 2) * 2, PI); actuar(c, L.lt, [[0, i % 2 ? 'hug_self' : 'idle']], { T: L.T + i }); cara(c, L.T + i, { expr: 'worried', mouth: 'flat' }); } crowdGrid(DT0, -326, 9, 8, 2.6, PI, 0, 0); stands(L.T, 'still', true);
  cm([DT0 - 6, 5, -344, DT0, 4.4, -333, 46], [DT0 + 6, 5, -344, DT0, 4.4, -333, 46], L.k); sh(V(DT0, 0, -334), 30); }, [[0, 'silence_hit', .5], [.6, 'wind', .4]]);
// 96 «Also machte ich es einfach:»: levanta un dedo en lo alto de la escalinata
shot(tw('Also', 3), 'C', null, L => { city(); const c = put(ich, DT0, ROOFY, STZ + 1, 0); actuar(c, L.lt, [[0, 'idle'], [.2, { aRx: 2.8, aRe: .1, aRz: .1 }, { dur: .4 }]], { T: L.T }); smug(c, L.T); c.props.wind = 1;
  onFace(c, 9, -.2, .3, 42); sh(V(DT0, 0, STZ), 20); }, [[0, 'whoosh', .4], [.4, 'ding', .4]]);
// 97 «„Wer ein Verbrechen begeht,»: contrapicado desde la multitud: él habla desde arriba; el Landgericht detrás
shot(tw('Wer'), 'W', null, L => { city(); const c = put(ich, DT0, ROOFY, STZ + 1, 0); actuar(c, L.lt, [[0, { aRx: 1.6, aRe: .2, aLz: .2 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'angry'); c.props.wind = 1.2; crowdGrid(DT0, -332, 9, 6, 2.6, PI, 0, 0); stands(L.T, 'still', true);
  cm([DT0 + 2, 4, -318, DT0, 10, STZ, 50], [DT0 + 1, 4.5, -322, DT0, 10.5, STZ, 48], L.k); sh(V(DT0, 0, -340), 40); }, [[0, 'whoosh', .3], [.5, 'crowd_murmur', .3]]);
// 98 «wird sofort zu Staub.“» golpe: primer plano; el letrero rojo
shot(tw('wird'), 'C', 'punch', L => { city(); const c = put(ich, DT0, ROOFY, STZ + 1, 0); actuar(c, L.lt, [[0, { aRx: 1.7, aRe: .1 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'angry'); purple(L, .7);
  badge('red', 'SOFORT ZU STAUB', W / 2, H * .17, (L.lt - .1) * 3); onFace(c, 6.5, -.2, -.2, 40); sh(V(DT0, 0, STZ), 20); }, [[0, 'impact', .7], [.2, 'braam', .5]]);
// 99 «Und dann jubelten sie.»: plano aéreo: toda la avenida salta y aplaude
shot(tw('Und', 11), 'R', null, L => { city(); crowdGrid(DT0, -332, 9, 20, 2.6, PI, 0, 0); stands(L.T, 'cheer', false); const c = put(ich, DT0, ROOFY, STZ + 1, 0); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); grin(c, L.T); confRain(V(DT0, 0, -320), L.T, 50, 24, 40, 20);
  cm([DT0 + 16, 40, -270, DT0, 0, -330, 52], [DT0 + 12, 46, -276, DT0, 0, -332, 50], L.k); sh(V(DT0, 0, -320), 80); }, [[0, 'crowd_cheer', .8], [.6, 'confetti', .4]]);
// 100 «Vor allem, weil sie Angst hatten, es nicht zu tun.»: dos personas aplauden con sonrisa forzada, sudando y mirándose de reojo
shot(tw('Vor', 2), 'S', null, L => { city(); const a = put(XT[3], DT0 - 1.8, 0, -332, PI + .3), b = put(K[4], DT0 + 1.8, 0, -332, PI - .3); [a, b].forEach((c, i) => { actuar(c, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.2 + Math.abs(Math.sin(L.T * 10)) * .3, aRz: -.2 + Math.abs(Math.sin(L.T * 10)) * .3, aLe: 1.4, aRe: 1.4 }]], { T: L.T + i }); cara(c, L.T + i, { eyes: i ? 'side_l' : 'side_r', mouth: 'grimace' }); sweat(c, L.T + i); });
  cm([DT0, 5, -343, DT0, 4.6, -332, 44], [DT0, 5, -341, DT0, 4.6, -332, 42], L.k); sh(V(DT0, 0, -332), 20); }, [[0, 'clap', .6], [.4, 'clap', .5], [.9, 'gulp', .5], [1.3, 'clap', .4]]);
// 101 «Bis zum Mittag stand eine Schlange um den ganzen Block.»: plano aéreo de Hufenbach: una cola larguísima de gente con capas; «12:00»
shot(tw('Bis'), 'W', null, L => { town(); crowdGrid(26, 34, 2, 60, 2.6, PI, 0, 0); stands(L.T, 'sway', false); for (let i = 0; i < 6; i++) { const c = BG[i]; put(c, 25 + (i % 2) * 2, 0, 18 + i * 2.6, PI); capeOn(c); actuar(c, L.lt, [[0, 'idle']], { T: L.T + i }); cara(c, L.T + i, { expr: 'worried', mouth: 'flat' }); }
  const c = put(ich, 26, 0, 12, 0); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); badge('num', '12:00', W / 2, H * .16, (L.lt - .4) * 3); cm([2, 46, 24, 26, 0, 64, 52], [4, 52, 20, 26, 0, 70, 50], L.k); sh(V(26, 0, 70), 120); }, [[0, 'whoosh', .4], [.4, 'crowd_murmur', .5], [1.0, 'bell', .6]]);
// 102 «Alle wollten in meine Liga.»: él les va poniendo capas negras y violetas
shot(tw('Alle'), 'C', null, L => { town(); const c = put(ich, 26, 0, 12, 0); actuar(c, L.lt, [[0, { aRx: 1.3, aRe: .3, aLz: .2 }]], { T: L.T }); smug(c, L.T);
  for (let i = 0; i < 4; i++) { const p = BG[i]; put(p, 26 + (i ? (i % 2 ? 1.4 : -1.4) : 0), 0, 16 + i * 2.6, PI); capeOn(p); p.props.wind = 1; actuar(p, L.lt, [[0, i ? 'idle' : 'cheer']], { T: L.T + i }); cara(p, L.T + i, { expr: i ? 'worried' : 'happy', mouth: i ? 'flat' : 'smile' }); }
  cm([33, 7, 8, 26, 4.4, 15, 46], [32, 7, 10, 26, 4.4, 15, 44], L.k); sh(V(26, 0, 14), 20); }, [[0, 'cloth', .6], [.5, 'cheer', .3], [1.0, 'cloth', .5]]);
// 103 «Dann ging ich ins Rathaus.»: camina por la plaza vacía hacia el Rathaus, de espaldas, la capa al viento
shot(tw('Dann', 4), 'W', null, L => { town(); const c = put(ich, -6, 0, -40 - L.lt * 4, PI); applyPose(c, walkP(L.T)); c.props.wind = 1.2;
  cm([-4, 6, -18, -6, 8, -80, 50], [-4, 6, -24, -6, 8, -80, 48], L.k); sh(V(-6, 0, -50), 40); }, [[0, 'footsteps', .6], [.8, 'wind', .4]]);
// 104 «Keine Wachen.»: la garita de la guardia, vacía: un montoncito de polvo y la gorra en el suelo
shot(tw('Keine'), 'C', null, L => { town(); show(BOOTH, 6, 0, -74, 0); show(PILES[0], 6, 0, -70.6, 0, .9); show(GCAP, 7.2, .1, -69.8, .4);
  orbit(V(6.5, 1.6, -71), lerp(9, 8, L.k), .5, .2, 44); sh(V(6, 0, -72), 20); }, [[0, 'wind', .5], [.3, 'silence_hit', .4]]);
// 105 «Niemand, der Nein sagte.»: sube la escalinata del Rathaus; las puertas se abren solas
shot(tw('Niemand'), 'S', null, L => { town(); const c = put(ich, -6, 0, -70 - L.lt * 3, PI); applyPose(c, walkP(L.T)); c.props.wind = .8;
  cm([-12, 4, -56, -6, 6, -80, 50], [-10, 4.4, -60, -6, 6, -82, 48], L.k); sh(V(-6, 0, -74), 30); }, [[0, 'door_creak', .6], [.6, 'footsteps', .4]]);
// 106 «Das war gestern.»: el Rathaus al atardecer con su pancarta; grúa hacia atrás
shot(tw('Das', 2), 'I', null, L => { town('dusk'); show(LBAN, -6, 31, -82.6, 0, .55);
  cm([-6, 14, -50, -6, 20, -84, 50], [-6, 22, -30, -6, 20, -84, 52], L.k); sh(V(-6, 0, -70), 60); }, [[0, 'whoosh', .4], [.5, 'bell', .5]]);
// 107 «Heute schreibe ich die neuen Regeln.»: en el despacho del alcalde, de noche, escribe en un pergamino «NEUE REGELN»
shot(tw('Heute', 2), 'F', null, L => { office(); show(DESK, TRX, 0, 4, 0); const c = put(ich, TRX, .8, -.4, 0); actuar(c, L.lt, [[0, { ...SIT, crouch: .7, aRx: 1.2, aRe: 1.2 + Math.sin(L.T * 9) * .15, aLx: .9, aLe: 1.4, lean: .25, headX: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); c.props.wind = .1;
  badge('tag', 'NEUE REGELN', W / 2, H * .2, (L.lt - .5) * 3); cm([TRX + 3, 11, 13, TRX, 4.3, 4.4, 46], [TRX + 2, 10, 11.5, TRX, 4.3, 4.4, 44], L.k); sh(V(TRX, 0, 3), 20); }, [[0, 'quill', .7], [.6, 'quill', .6], [1.2, 'paper', .4]]);
// 108 «Ich habe nur noch nicht entschieden …» (zoom lento): levanta la mirada del papel, despacio
shot(tw('Ich', 8), 'Z', 'slow', L => { office(); show(DESK, TRX, 0, 4, 0); const c = put(ich, TRX, .8, -.4, 0); actuar(c, L.lt, [[0, { ...SIT, crouch: .7, aRx: 1.2, aRe: 1.2, aLx: .9, aLe: 1.4, lean: .25 - L.k * .25, headX: .35 - L.k * .45 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' }); purple(L, L.k * .6);
  cm([TRX, 7.4, 13, TRX, 6.2, -.4, 44], [TRX, 7, 9.5, TRX, 6.4, -.4, 38], L.k); sh(V(TRX, 0, 2), 20); }, [[0, 'tension', .5]]);
// 109 «was alles als Verbrechen zählt.»: te señala a ti (a cámara); oscuridad violeta; fin
shot(tw('was', 3), 'C', 'punch', L => { office(); show(DESK, TRX, 0, 4, 0); const c = put(ich, TRX, .8, -.4, 0); actuar(c, L.lt, [[0, { ...SIT, crouch: .7, aRx: 1.6, aRe: .05, aRz: -.05, aLx: .9, aLe: 1.4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' }); purple(L, 1);
  DARK = clamp((L.lt - 1.1) / .5) * .6; cm([TRX + .5, 7, 9, TRX, 6.4, -.4, 40], [TRX + .3, 6.9, 8, TRX, 6.4, -.4, 36], L.k); sh(V(TRX, 0, 2), 20); }, [[0, 'impact', .7], [.3, 'braam', .6], [1.2, 'heartbeat', .5]]);
