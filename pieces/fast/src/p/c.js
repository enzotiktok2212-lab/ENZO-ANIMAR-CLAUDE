// ---------- c: la competición: Fahrerin, Dönermann, Jonas (robo), mi carrera, el botón, la verdad, Papa (79,7 – 120,6 s) ----------
const X0 = PCX;
const rope = (i, L, amp = .35, ph = 0) => { const r = PC.ROPES[i]; const a = Math.sin(L.T * 2.6 + ph) * amp; r.rotation.x = a; return a; };
const ropeHand = (i, a, y = 5) => V(X0, 15.6 - y * Math.cos(a), PC.ROPES[i].position.z - y * Math.sin(a));
const onRope = (ch, i, a, T) => { const h = ropeHand(i, a, 4.6); put(ch, h.x, h.y - 5.9 * sc_(ch), h.z + .1, PI); applyPose(ch, HANG(T)); ch.root.rotation.x = a * .8; };
const onBars = (ch, z, T) => { put(ch, X0, 11.4 - 5.9 * sc_(ch) - .1, z, PI); const sw = Math.sin(T * 7); applyPose(ch, { ...HANG(T), aLx: 2.95 + sw * .25, aRx: 2.95 - sw * .25, lLx: .5 + sw * .4, lRx: .5 - sw * .4 }); };
const step = k => PC.STEPS[k];
const onStep = (ch, k, T, pose = {}) => { const s = step(k); put(ch, X0 + s.x, s.h + .35, s.z, PI); applyPose(ch, pose); return s; };
const wallY = z => { const lz = z - 24; if (lz >= 4) return 0; if (lz <= 0) return 8.5; const a = Math.asin(clamp((4 - lz) / 4)); return 4 - Math.cos(a) * 4 + .3; };
// 63 «Dann ertönte der Pfiff.»: el árbitro sopla el silbato con el brazo arriba
shot(79.71, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); const s = put(schiri, X0 + 9, 0, 36, .5); num(s); actuar(s, L.lt, [[0, { aRx: 2.9, aRz: .2, aRe: .2, aLx: 1.6, aLe: 2.4, aLz: -.4, headX: .1 }]], { T: L.T }); cara(s, L.T, { expr: 'determined', mouth: 'o' });
  orbit(hp(s).add(V(0, -.4, 0)), lerp(10, 8, L.k), .55 + L.k * .2, .05, 44); sh(V(X0 + 9, 0, 36), 20); }, [[0, 'whistle', .8]]);
// 64 «Zuerst die Straßenbahnfahrerin.»: ella (870) sale corriendo desde la salida
shot(81.15, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const f = fahrerin; runC(f, L.lt, X0, 44, PI, 6.5, L.T, { y: 1.2 }); num(f, 870); cara(f, L.T, { expr: 'determined' }); orbit(V(X0, 4.2, f.root.position.z), lerp(15, 13, L.k), PI - .4 + L.k * .2, .08, 46); sh(V(X0, 0, 40), 30); }, [[0, 'steps_run', .6], [.3, 'crowd_cheer', .5]]);
// 65 «Am Seil:»: se columpia de cuerda en cuerda sobre el agua
shot(82.82, 'C', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const a = rope(1, L, .45); onRope(fahrerin, 1, a, L.T); num(fahrerin, 870); cara(fahrerin, L.T, { expr: 'determined' }); orbit(V(X0, 9, 7.5), lerp(17, 15, L.k), -1.45 - L.k * .2, .06, 46); sh(V(X0, 0, 7), 30); }, [[0, 'rope_creak', .6], [.2, 'whoosh', .4]]);
// 66 «fast.»: se le escapa la cuerda y cae al agua: ¡splash!
shot(83.26, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer', true); sbDraw(0); const a = rope(1, L, .3); const f = fahrerin; const q = clamp(L.lt / .45); const h = ropeHand(1, a, 4.6); put(f, h.x + .5, lerp(h.y - 5.9 * .95, -.6, easeIn(q)), h.z - 1.2, PI); applyPose(f, { aLx: 2.6, aRx: 2.2, aLz: .7, aRz: .9, lLx: .4, lRx: -.3, lLk: .6 }); f.root.rotation.x = -.3 * q; num(f, 870); cara(f, L.T, { expr: 'scream' });
  splash(V(X0 + .5, .2, h.z - 1.2), 83.26 + .42, L.T, 1.2); orbit(V(X0, 5, 6.4), lerp(16, 14, L.k), -1.5, .12, 46); sh(V(X0, 0, 6), 30); }, [[0, 'scream_short', .4], [.42, 'splash_big', .8], [.6, 'crowd_ooh', .6]]);
// 67 «Dann der Dönermann.»: el del döner (920) sale como un toro
shot(84.12, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const d = doenm; runC(d, L.lt, X0, 44, PI, 7, L.T, { y: 1.2 }); num(d, 920); cara(d, L.T, { expr: 'angry' }); orbit(V(X0, 4.6, d.root.position.z), lerp(15, 13, L.k), PI + .4 - L.k * .2, .08, 46); sh(V(X0, 0, 40), 30); }, [[0, 'steps_run', .6], [.2, 'grunt', .4]]);
// 68 «An den Stangen:»: barra a barra por encima del agua
shot(85.08, 'C', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const z = lerp(-6, -12, L.k); onBars(doenm, z, L.T); num(doenm, 920); cara(doenm, L.T, { expr: 'determined' }); sweat(doenm, L.T, 2); orbit(V(X0, 8, z), lerp(15, 13, L.k), PI / 2 + .9, .02, 46); sh(V(X0, 0, -10), 30); }, [[0, 'metal_clank', .6], [.25, 'metal_clank', .5]]);
// 69 «fast.»: a la última barra se le resbala la mano: al agua
shot(85.62, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer', true); sbDraw(0); const d = doenm, q = clamp(L.lt / .4); put(d, X0, lerp(11.4 - 5.9 * 1.04, -.8, easeIn(q)), -14.5, PI); applyPose(d, { aLx: 2.8, aRx: 2.2, aLz: .5, aRz: .8, lLx: .5, lRx: -.2 }); num(d, 920); cara(d, L.T, { expr: 'scream' });
  splash(V(X0, .2, -14.5), 85.62 + .38, L.T, 1.3); orbit(V(X0, 6, -14.5), lerp(16, 14, L.k), PI / 2 - .15, .25, 46); sh(V(X0, 0, -14), 30); }, [[0, 'slip', .5], [.38, 'splash_big', .8], [.55, 'crowd_ooh', .6]]);
// 70 «Dann Jonas.»: Jonas (990) en la salida, chulo, se truena los dedos
shot(86.16, 'Z', 'punch', L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const j = put(jonas, X0, 1.2, 44.5, PI); num(j); actuar(j, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.6, aRz: -.6, aLe: 1.8, aRe: 1.8 }], [.6, FLEX, { dur: .3 }]], { T: L.T }); grin(j, L.T);
  orbit(hp(j).add(V(0, -.8, 0)), lerp(13, 10, L.k), PI + .25 - L.k * .4, .04, 44); sh(V(X0, 0, 44), 30); }, [[0, 'knuckles', .6], [.6, 'crowd_cheer', .6]]);
// 71 «Er kam weiter als alle.»: sube la pared de un tirón, pasa las cuerdas y las barras (montaje)
shot(87.38, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const j = jonas; num(j); const q = L.k;
  if (q < .45) { const z = lerp(32, 21.5, q / .45); runC(j, L.lt, X0, 32, PI, 8, L.T); j.root.position.z = z; j.root.position.y = wallY(z); cara(j, L.T, { expr: 'determined' }); cam([X0 + 3, 13, 18], [X0, 4, 28], 48); }
  else if (q < .75) { const a = rope(2, L, .5); onRope(j, 2, a, L.T); cara(j, L.T, { expr: 'grin' }); orbit(V(X0, 9, 4), 17, -.9, .06, 46); }
  else { const z = lerp(-8, -15, (q - .75) / .25); onBars(j, z, L.T); cara(j, L.T, { expr: 'grin' }); orbit(V(X0, 8, z), 15, PI / 2 + .9, .02, 46); } sh(V(X0, 0, 10), 50); }, [[0, 'steps_run', .5], [.5, 'rope_creak', .5], [1.0, 'metal_clank', .5], [.2, 'crowd_cheer', .6]]);
// 72 «Doch an der allerletzten Stufe»: salta de escalón en escalón hasta el último (amarillo)
shot(88.90, 'S', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const j = jonas; num(j); const f = L.lt / 1.2 * 4; const k = Math.min(3, Math.floor(f)), t = f - k; const a = step(k), b = step(Math.min(4, k + 1)); const p = arc(V(X0 + a.x, a.h + .35, a.z), V(X0 + b.x, b.h + .35, b.z), 1.6, clamp(t)); put(j, p.x, p.y, p.z, PI); applyPose(j, t < .9 ? { aLx: 2, aRx: 2, aLz: .5, aRz: .5, lLx: .8, lLk: 1, lRx: -.2 } : {}); cara(j, L.T, { expr: 'determined' });
  if (f >= 4) { onStep(j, 4, L.T, { aLx: 1, aRx: 1 }); } orbit(V(X0, 12.5, -28.5), lerp(23, 20, L.k), PI / 2 - .35, .1, 46); sh(V(X0, 0, -28), 30); }, [[0, 'jump', .5], [.3, 'land', .4], [.6, 'land', .4], [.9, 'land', .4], [1.2, 'heartbeat', .5]]);
// 73 «griff der Beinahe-Mann zu.»: el hombre gris surge junto al último escalón y le arranca la fuerza; 990 → 0
shot(90.28, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const j = jonas; onStep(j, 4, L.T, { aLx: .8, aRx: .8, lean: .1 }); numDrop(j, (L.lt - .4) * 2); cara(j, L.T, { expr: L.lt > .5 ? 'shock' : 'determined' }); const s4 = step(4);
  const s3 = step(3); const b = put(bm, X0 + s3.x + .6, s3.h + .35 - 2.6 * (1 - clamp(L.lt * 3)), s3.z + .4, -2.25); actuar(b, L.lt, [[0, 'reach'], [.7, { aRx: 1.0, aRe: 1.6, lean: -.1 }, { dur: .3 }]], { T: L.T }); cara(b, L.T, { expr: 'grin', mouth: 'grin' }); steal(j, (L.lt - .3) / .7);
  orbit(V(X0, 15, s4.z + 1.4), lerp(22, 19, L.k), -PI / 2 + .3, .06, 46); DARK = .15; sh(V(X0, 0, -32), 30); }, [[0, 'whoosh_dark', .6], [.3, 'magic_suck', .7], [.8, 'power_down', .6]]);
// 74 «Und Jonas fiel.»: cae de espaldas al colchón azul, a cámara lenta
shot(91.75, 'S', null, L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const j = jonas; const s4 = step(4); const q = clamp(L.lt / .8); put(j, X0 + s4.x + q * 1.5, lerp(s4.h + .35, .4, easeIn(q)), s4.z + q * 2, PI); j.root.rotation.x = -q * 1.4; applyPose(j, { aLx: 2.4, aRx: 2.2, aLz: .9, aRz: .9, lLx: .8, lRx: .4 }); num(j, 0, 1, 'red'); cara(j, L.T, { expr: 'scream' });
  if (L.lt > .8) dust(V(X0 + s4.x + 1.5, .2, s4.z + 2), 91.75 + .8, L.T, 10, .6); orbit(V(X0 + s4.x + 1, 7, s4.z + 1.5), lerp(22, 19, L.k), -PI / 2 + .35, .1, 46); sh(V(X0, 0, -30), 30); }, [[0, 'whoosh_slow', .5], [.8, 'thud', .8], [.9, 'crowd_ooh', .6]]);
// 75–76 «AH! ALMOST ×3»: solo Jonas, sentado en el colchón, decepcionado, diciéndolo
shot(92.90, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const s4 = step(4); const j = put(jonas, X0 + s4.x + 1.5, .3, s4.z + 3, .5); actuar(j, L.lt, [[0, { ...SIT, ...GEST.hands_head, crouch: 1.3 }], [1.1, { ...SIT, crouch: 1.3, aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .15 }, { dur: .5 }]], { T: L.T, extra: { headY: Math.sin(L.T * 7) * .15 } }); num(j, 0, 1, 'red'); talk(j, L.T, 92.90, 94.97, 'sad');
  orbit(hp(j).add(V(0, -.3, 0)), lerp(12, 8.5, L.k), .5 + .3 - L.k * .15, .1, 44); sh(V(X0, 0, -28), 20); }, [[0, 'groan', .5], [1.2, 'sigh', .4]]);
// 77 «Dann war ich dran.»: yo en la salida, con mi 7; aprieto los puños (zoom lento)
shot(94.97, 'Z', 'slow', L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); const c = put(ich, X0, 1.2, 44.5, PI); num(c, 7); actuar(c, L.lt, [[0, 'idle'], [.4, 'fists', { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  orbit(hp(c).add(V(0, -.6, 0)), lerp(15, 9.5, easeIn(L.k)), PI, .03, 44); sh(V(X0, 0, 44), 20); }, [[0, 'heartbeat', .6], [.5, 'crowd_murmur', .4]]);
// 78–83 «HUSS!» ×6: salgo disparado (cortes rápidos)
const H3 = [96.08, 96.38, 96.70, 96.99, 97.30, 97.61];
H3.forEach((t0, i) => shot(t0, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const c = ich; const z0 = 43 - i * 2.2; runC(c, L.lt, X0 + (i % 2 ? .8 : -.8), z0, PI, 11, L.T, { y: 1.2 }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, i);
  const ya = [PI - .5, PI + .6, PI / 2 + .3, -PI / 2 - .3, PI - .2, PI + .9][i]; orbit(V(c.root.position.x, 3.6, c.root.position.z), [10, 9, 12, 11, 8.5, 10][i], ya, [.05, .1, .2, .05, .02, .15][i], 46); sh(V(X0, 0, 38), 30); }, [[0, i % 2 ? 'steps_run' : 'whoosh', .6]]));
// 84 «Die Wand:»: corro rampa arriba
shot(97.97, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const c = ich; const z = lerp(31, 24.6, easeOut(L.k)); runC(c, L.lt, X0, 31, PI, 9, L.T); c.root.position.z = z; c.root.position.y = wallY(z); num(c, 7); cara(c, L.T, { expr: 'determined' });
  cm([X0 + 15, 6, 31, X0, 4.5, 26.5, 48], [X0 + 14, 7, 28, X0, 5.5, 25.5, 46], L.k); sh(V(X0, 0, 26), 30); }, [[0, 'steps_run', .6], [.4, 'rubber', .5]]);
// 85 «Meine Finger rutschten ab.»: colgado del borde de la pared; los dedos resbalan, sudor
shot(98.61, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const c = ich; const slip = Math.sin(L.T * 10) > .4 ? .25 : 0; put(c, X0, 8.5 - 5.9 * .82 - .2 - slip, 24.4, PI); applyPose(c, { ...HANG(L.T), lean: -.15 }); num(c, 7); cara(c, L.T, { expr: 'scared' }); sweat(c, L.T, 3);
  cm([X0 + 9.5, 8, 28.5, X0, 6.4, 24.4, 46], [X0 + 8.5, 7.6, 27.6, X0, 6.4, 24.4, 44], L.k); sh(V(X0, 0, 24), 20); }, [[0, 'slip', .6], [.5, 'scrape', .5], [.9, 'crowd_ooh', .5]]);
// 86 «Das Seil brannte in meinen Händen.»: en la cuerda, me sale humo de las manos; aprieto los dientes
shot(99.80, 'S', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const a = rope(0, L, .5, 1); onRope(ich, 0, a, L.T); num(ich, 7); cara(ich, L.T, { expr: 'angry', mouth: 'grimace_wide' }); const hh = wpos(ich.aR.hand); smoke(hh.add(V(0, .4, 0)), L.T, .3);
  orbit(V(X0, 10, 11 - Math.sin(a) * 4), lerp(13, 11, L.k), -2.3 + L.k * .3, .04, 44); sh(V(X0, 0, 10), 30); }, [[0, 'rope_creak', .6], [.3, 'sizzle', .6], [.8, 'grunt', .5]]);
// 87 «Und dann die letzte Stufe.»: salto al último escalón amarillo; plano bajo
shot(101.60, 'Z', null, L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const c = ich; const a = step(3), b = step(4); const q = clamp(L.lt / .7); const p = arc(V(X0 + a.x, a.h + .35, a.z), V(X0 + b.x, b.h + .35, b.z), 1.8, q); put(c, p.x, p.y, p.z, PI); applyPose(c, q < 1 ? { aLx: 2.2, aRx: 2.2, aLz: .5, aRz: .5, lLx: .8, lLk: 1 } : { aLx: .9, aRx: .9, aLz: .4, aRz: .4, crouch: .2 }); num(c, 7); cara(c, L.T, { expr: 'determined' });
  cm([X0 + 13, 7, -24, X0 + b.x, b.h + 2.5, b.z, 48], [X0 + 12, 8, -27, X0 + b.x, b.h + 3, b.z, 46], L.k); sh(V(X0, 0, -30), 30); }, [[0, 'jump', .6], [.7, 'land', .6], [1.0, 'heartbeat', .6]]);
// 88 «Genau da, wo alle fallen.»: la grada contiene el aliento: Jonas (0), la Fahrerin y el Dönermann, preocupados
shot(103.30, 'W', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); [[jonas, 21.5, -24, -PI / 2], [fahrerin, 21.5, -20.5, -PI / 2 + .2], [doenm, 21.5, -27.5, -PI / 2 - .2]].forEach(([k, x, z, ry], i) => { put(k, X0 + x, 1.4, z, ry); if (k === jonas) num(k, 0, 1, 'red'); else num(k); actuar(k, L.lt, [[0, i ? 'hands_face' : 'cower']], { T: L.T + i }); cara(k, L.T + i, { expr: 'worried' }); });
  orbit(V(X0 + 21.5, 5.8, -24), lerp(18, 15, L.k), -PI / 2 + .5 - L.k * .4, .06, 46); sh(V(X0 + 21, 0, -24), 20); }, [[0, 'heartbeat', .7], [.5, 'crowd_murmur', .3]]);
// 89 «Der Beinahe-Mann griff nach mir …» (zoom lento): la mano gris se acerca a mi 7
shot(105.10, 'F', 'slow', L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); DARK = .18; const c = ich; const s4 = onStep(c, 4, L.T, { aLx: .9, aRx: .9, aLz: .4, aRz: .4, crouch: .2 }); num(c, 7); cara(c, L.T, { expr: 'scared' }); const s3 = step(3); const b = put(bm, X0 + s3.x + .6, s3.h + .35 - 2.6 * (1 - clamp(L.lt * 1.5)), s3.z + .4, -2.25); actuar(b, L.lt, [[0, { aRx: lerp(.6, 1.9, easeInOut(L.k)), aRe: .2, lean: lerp(0, .25, L.k) }]], { T: L.T }); cara(b, L.T, { expr: 'grin', mouth: 'grin' });
  orbit(V(X0, s4.h + 4, s4.z + 1.4), lerp(22, 14, easeIn(L.k)), -PI / 2 + .3, .06, 46); sh(V(X0, 0, -32), 30); }, [[0, 'whoosh_dark', .6], [.4, 'creepy_laugh', .4]]);
// 90 «und ließ los.»: la retira con asco; yo salto hacia la torre
shot(106.42, 'C', 'punch', L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); const c = ich, s4 = step(4); const q = clamp((L.lt - .4) / .6); const p = arc(V(X0 + s4.x, s4.h + .35, s4.z), V(X0, 12, -35.2), 2, q); put(c, p.x, p.y, p.z, PI); applyPose(c, q > 0 ? { aLx: 2.6, aRx: 2.6, lLx: .9, lLk: 1.2 } : { aLx: .9, aRx: .9, crouch: .3 }); num(c, 7); cara(c, L.T, { expr: 'determined' });
  const s3 = step(3); const b = put(bm, X0 + s3.x + .6, s3.h + .35, s3.z + .4, -2.25); actuar(b, L.lt, [[0, { aRx: 1.9, aRe: .2, lean: .25 }], [.15, { aRx: .8, aRz: -.5, aRe: 1.2, lean: -.1, headY: .4 }, { dur: .3 }]], { T: L.T }); cara(b, L.T, { expr: 'bored', mouth: 'frown' });
  orbit(V(X0, s4.h + 4, s4.z), lerp(19, 22, L.k), -PI / 2 + .35 - L.k * .2, .08, 46); sh(V(X0, 0, -32), 30); }, [[0, 'pfft', .6], [.4, 'jump', .6]]);
// 91 «Und dann:»: trepo los últimos agarres de la torre
shot(107.58, 'S', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); const c = ich; const y = lerp(13.5, 20.6 - 5.4, easeOut(L.k)); put(c, X0, y, -35.3, PI); const cl = Math.sin(L.T * 12); applyPose(c, { aLx: 2.6 + cl * .3, aRx: 2.6 - cl * .3, lLx: .8 + cl * .4, lRx: .8 - cl * .4, lLk: 1, lRk: 1 }); num(c, 7); cara(c, L.T, { expr: 'determined' });
  cm([X0 + 11, y + 3, -29, X0, y + 2.5, -35.3, 48], [X0 + 10, y + 3.5, -30, X0, y + 3, -35.3, 46], L.k); sh(V(X0, 0, -36), 30); }, [[0, 'climb', .6]]);
// 92 «der Knopf.»: ¡golpe! la mano sobre el botón dorado; destello
shot(107.96, 'C', 'punch', L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); const c = put(ich, X0, 20.8, -36.6, PI); const hit = clamp(L.lt / .15); actuar(c, L.lt, [[0, { aRx: 2.6, aRe: .2 }], [.05, { aRx: 1.3, aRe: .1, lean: .25 }, { dur: .1 }]], { T: L.T }); num(c, 7); cara(c, L.T, { expr: 'shout' }); PC.BTN.position.y = 2.9 - .35 * hit; PC.BTNL.intensity = 10 + hit * 15;
  if (L.lt < .12) grade.uniforms.flash.value = 0; else grade.uniforms.flash.value = Math.max(0, .55 - (L.lt - .12) * 2.5); orbit(V(X0, 23.4, -37.6), lerp(9, 7.5, L.k), PI - .7, .25, 44); sh(V(X0, 20, -38), 20); }, [[.1, 'button_slam', 1], [.12, 'impact', .8]]);
// 93 «Die Gläser zersprangen.»: estallan los frascos; las bolas de luz salen volando por el cielo
shot(108.99, 'F', null, L => { use('PC'); stands(L.T, 'cheer', true); sbDraw(1, 'GEDRÜCKT!', true); PC.SHELF.userData.J.forEach(j => j.visible = false); PC.vit.visible = false; PC.BTNL.intensity = 120; const c = put(ich, X0, 20.8, -36.6, 0); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); num(c, 7); cara(c, L.T, { expr: 'joy' });
  SHARDS.forEach((s, i) => { const r = RNG(i * 3 + 2), t = L.lt; s.visible = true; s.position.set(X0 - 5 + r() * 10 + (r() - .5) * t * 14, 23 + r() * 6 + t * 6 - t * t * 8, -44 + (r() - .5) * 3 + t * 6 * r()); s.rotation.set(t * 8 + i, t * 6, 0); });
  ORBS.forEach((o, i) => { const r = RNG(i * 7 + 5), t = L.lt; show(o, X0 - 6 + i * 1.3 + (r() - .5) * t * 30, 24 + t * 14 * (.6 + r() * .6), -44 + t * 18 * (r() - .2), 0, 1); });
  cm([X0 + 9, 29, -18, X0, 25, -42, 50], [X0 + 11, 31, -12, X0, 28, -44, 52], L.k); sh(V(X0, 0, -38), 30); }, [[0, 'glass_shatter', 1], [.3, 'magic_release', .7]]);
// 94 «Und die ganze Stadt wurde still.»: las gradas en silencio; el marcador: 1
shot(110.08, 'W', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN', false); const p = wpos(PC.SB); cm([X0 - 10, 12, 0, X0 + 12, 18, -30, 48], [X0 - 12, 13, -4, X0 + 14, 20, -34, 46], L.k); sh(V(X0, 0, -10), 50); }, [[0, 'silence_wind', .6], [.6, 'heartbeat', .4]]);
// 95 «Jonas kam zu mir und fragte:»: junto a la pista, Jonas (con su 990 de vuelta) se acerca a mí
const ME = [X0 + 13, -20], JO = [X0 + 17, -20];
shot(111.92, 'S', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN'); const c = put(ich, ME[0], 0, ME[1], PI / 2); num(c, 7); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'happy' }); const j = jonas; walkC(j, L.lt, X0 + 20.5, -17.9, -2.11, 2.6, L.T, { stopAt: 1.2 }); num(j, 990); cara(j, L.T, { expr: 'gasp' });
  orbit(V(X0 + 15.6, 4, -19.4), lerp(19, 16, L.k), .2 + L.k * .15, .08, 46); sh(V(X0 + 15, 0, -20), 30); }, [[0, 'steps', .5]]);
// 96 «„Wie hast du das geschafft?“»: primer plano de Jonas preguntando
shot(113.63, 'C', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN'); const j = put(jonas, JO[0], 0, JO[1], -PI / 2); num(j, 990); actuar(j, L.lt, [[0, 'shrug']], { T: L.T }); talk(j, L.T, 113.56, 114.86, 'confused');
  orbit(hp(j).add(V(0, -.2, 0)), lerp(10, 8.5, L.k), -PI / 2 + .4, .04, 42); sh(V(JO[0], 0, JO[1]), 20); }, [[0, 'hmm', .3]]);
// 97 «Ich sagte ihm die Wahrheit:»: yo le miro y sonrío
shot(114.82, 'W', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN'); const c = put(ich, ME[0], 0, ME[1], PI / 2); num(c, 7); actuar(c, L.lt, [[0, { aRx: .6, aRe: .8 }]], { T: L.T }); talk(c, L.T, 114.76, 115.86, 'smile');
  orbit(hp(c).add(V(0, -.4, 0)), lerp(11, 9, L.k), PI / 2 - .5 + L.k * .3, .05, 42); sh(V(ME[0], 0, ME[1]), 20); }, [[0, 'breath', .3]]);
// 98 «„Ich hab einfach nicht bei fast aufgehört.“» (zoom lento): mi cara, la frase
shot(115.90, 'Z', 'slow', L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN'); const c = put(ich, ME[0], 0, ME[1], PI / 2); num(c, 7); actuar(c, L.lt, [[0, { aRx: .8, aRe: 1.2, aRz: -.2 }]], { T: L.T }); talk(c, L.T, 115.86, 117.86, 'determined');
  orbit(hp(c).add(V(0, -.2, 0)), lerp(11, 7, easeIn(L.k)), PI / 2 - .1, .03, 42); sh(V(ME[0], 0, ME[1]), 20); }, [[0, 'heartbeat', .4]]);
// 99 «Papa rannte zu mir»: Papa cruza el campo corriendo con los brazos abiertos
shot(117.88, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(1, 'NACH 20 JAHREN'); const p = papa; runC(p, L.lt, X0 + 21, -30, -.69, 6.5, L.T, { extra: { aLx: 1.4, aRx: 1.4, aLz: .8, aRz: .8 } }); num(p); cara(p, L.T, { expr: 'joy' });
  orbit(V(p.root.position.x, 4.5, p.root.position.z), lerp(16, 14, L.k), -.69 + .45, .06, 46); sh(V(X0 + 17, 0, -25), 30); }, [[0, 'steps_run', .5], [.4, 'crowd_cheer', .5]]);
// 100 «und umarmte mich.»: el abrazo; Papa me levanta del suelo
shot(119.08, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer'); sbDraw(1, 'NACH 20 JAHREN'); const p = put(papa, ME[0] + 1.8, 0, ME[1], -PI / 2), c = put(ich, ME[0], .6 + Math.sin(clamp(L.lt * 2) * PI / 2) * .8, ME[1], PI / 2); num(p); actuar(p, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: 1.2, aRe: 1.2, lean: .15 }]], { T: L.T }); cara(p, L.T, { expr: 'joy', eyes: 'closed' }); applyPose(c, { aLx: 1.6, aRx: 1.6, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2 }); cara(c, L.T, { expr: 'joy', eyes: 'closed' });
  hearts(hp(p).add(V(0, 1, 0)), L.T); orbit(V(ME[0] + 1.2, 5.2, ME[1]), lerp(13, 11, L.k), -PI / 2 + 1.05 - L.k * .2, .06, 44); sh(V(ME[0], 0, ME[1]), 20); }, [[0, 'hug', .6], [.3, 'aww', .4]]);
// 101 «Er weinte.»: primer plano de Papa llorando de alegría
shot(119.95, 'Z', null, L => { use('PC'); stands(L.T, 'still'); sbDraw(1, 'NACH 20 JAHREN'); const p = put(papa, ME[0] + 1.8, 0, ME[1], -PI / 2); num(p); actuar(p, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: 1.2, aRe: 1.2, lean: .1 }]], { T: L.T, extra: shiver(L.T, .5) }); cara(p, L.T, { expr: 'cry', mouth: 'smile' }); tears(p, L.T);
  orbit(hp(p).add(V(0, -.2, 0)), lerp(8.5, 7, L.k), -PI / 2 + .25, .05, 42); sh(V(ME[0], 0, ME[1]), 20); }, [[0, 'sniff', .5], [.3, 'soft_piano', .4]]);
