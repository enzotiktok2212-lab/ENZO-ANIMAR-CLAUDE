// ---------- b: los Jungs, la ventana, la rutina (To-do, Schatz, bañera), Leckerli, Körbchen (36,06 – 81,25 s) ----------
const SOF = V(WX - 10, 0, -10);   // sofá (mira +z), asiento a y ≈ 3.3
const sofaSit = (L, c, dx, pose = {}) => { put(c, SOF.x + dx, sitY(c, 3.3), SOF.z + 1.0, 0); actuar(c, 0, [[0, seatPose({ aLx: .5, aRx: .5, aLe: .8, aRe: .8, ...pose })]], { T: L.T }); return c; };
// móvil delante del pecho, mirando a la cámara (se orienta después de colocar la cámara)
const phoneAt = (ch, scr, fwd = 1.7, dy = -.2, sc = 1) => { phoneScr(scr); POST.push(() => { const h = hp(ch), a = ch.root.rotation.y, s = ch.spec.scale || 1; show(PHONE, h.x + Math.sin(a) * fwd * s, h.y + dy * s, h.z + Math.cos(a) * fwd * s, 0, sc); PHONE.lookAt(camera.position); }); };
const holdPhone = { aRx: 1.25, aRz: -.25, aRe: 1.5, aLx: 1.15, aLz: -.25, aLe: 1.5, headX: .3 };
// Lukas tumbado de lado en la cesta (cabeza hacia -x, cara a +z)
const KB = V(WX + 10, 0, 4.5);
const inBasket = (L, o = {}) => { put(me, KB.x + 2.7, 1.25, KB.z + .2, 0); me.root.rotation.z = PI / 2; actuar(me, 0, [[0, { lLx: 1.5, lRx: 1.3, lLk: 1.9, lRk: 1.9, aLx: 1.3, aRx: 1.0, aLe: 1.7, aRe: 1.5, headX: .15, headZ: -.15, ...o }]], { T: L.T }); };
// Svenja tumbada en la cama (boca arriba, cabeza en la almohada izquierda)
const svBed = (L, o = {}) => { put(sv, WX + 7.2, 3.15, -7.4, 0); sv.root.rotation.x = -PI / 2; actuar(sv, 0, [[0, { aLx: .1, aRx: .1, ...o }]], { T: L.T }); };
const BLANK = (() => { const b = new THREE.Mesh(new THREE.BoxGeometry(5.6, .7, 6.4), mat(0xff6aa8, { roughness: .95 })); b.castShadow = b.receiveShadow = true; scene.add(b); PROPS.push(b); outline(b, 1.8); return b; })();

// 27 «Natürlich fragen mich die Jungs trotzdem,»: en el sofá, Lukas recibe un mensaje de los Jungs
shot(36.06, 'W', null, L => { home(L); sofaSit(L, me, 0, holdPhone); cara(me, L.T, { expr: 'happy', eyes: 'down', mouth: 'open_smile' }); phoneAt(me, 'JUNGS|Heute Abend/zocken?|', 1.9, -.6, 1.15);
  cm([SOF.x + 1.4, 6.6, SOF.z + 12], [SOF.x + 1, 6.4, SOF.z + 10.6], L.k); camera.lookAt(SOF.x, 5.6, SOF.z + 1); camera.fov = 44; }, [[0, 'notif', .5], [.4, 'vibrate', .35]]);
// 28 «ob ich heute Abend mitkomme.»: los tres Jungs en la calle al atardecer: «Kommst du mit?»
shot(37.46, 'S', null, L => { fen(L, { dusk: 1 }); const p = V(FX - 2, 0, 18); JU.forEach((c, i) => { put(c, p.x - 4 + i * 4, 0, p.z + (i === 1 ? -1.2 : 0), -.1 + (i - 1) * -.15); actuar(c, 0, [[0, i === 1 ? { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5 } : i === 0 ? GEST.point : { aLx: .6, aLe: 1.6, aRx: .4 }]], { T: L.T }); cara(c, L.T + i, { expr: 'happy', mouth: i === 1 ? 'open_smile' : 'smile' }); });
  bubble(JU[1], 'Kommst du mit?', clamp((L.lt - .1) / .1), 1.4); orb(L.k, V(p.x, 3.8, p.z), null, [17, -.1, .1, 46], [15, -.02, .08, 46]); sh(p, 20); }, [[0, 'car_pass', .3], [.2, 'laugh_m', .3]]);
// 29 «Aber Svenja sagt Nein.»: Svenja en el sofá, brazos cruzados: «Nein.»; Lukas sentado en el suelo, triste
shot(38.86, 'F', null, L => { home(L); sofaSit(L, sv, 2.6, GEST.cross); const k = clamp((L.T - 39.88) / .1); cara(sv, L.T, { expr: k ? 'angry' : 'neutral', mouth: k ? 'talk' : 'flat', eyes: k ? 'squint' : undefined }); bubble(sv, 'Nein.', k, 1.2);
  put(me, SOF.x - 2.6, 0, SOF.z + 6.4, PI - .5); actuar(me, 0, [[0, SITZ({ headX: -.3, aLx: 1.6, aRx: 1.6, aLe: 1.2, aRe: 1.2 })]], { T: L.T }); cara(me, L.T, { expr: k ? 'sad' : 'happy', mouth: k ? 'frown' : 'smile' });
  orb(L.k, V(SOF.x, 4.2, SOF.z + 3.2), null, [15, .25, .1, 46], [13.6, .15, .08, 46]); }, [[1.0, 'sad_tone', .35]]);
// 30 «Also sitze ich am Fenster»: dentro, Lukas de rodillas en la ventana, mirando a la calle al atardecer
const WIN = V(FX, 5.8, -1.3);
shot(40.44, 'C', null, L => { fen(L, { dusk: 1 }); put(me, WIN.x, WIN.y, WIN.z, 0); actuar(me, 0, [[0, SITZ({ aLx: 1.5, aRx: 1.5, aLe: 1.3, aRe: 1.3, headX: .1, lean: .15 })]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown', eyes: 'worried' });
  cm([WIN.x + 6.5, 12, WIN.z - 9], [WIN.x + 5.5, 11.6, WIN.z - 8], L.k); camera.lookAt(WIN.x - .4, 9.4, WIN.z + 1); camera.fov = 46; }, [[0, 'sigh', .4], [.6, 'clock_tick', .3]]);
// 31 «und schaue ihnen nach,»: fuera: los Jungs se alejan por la acera; detrás, Lukas en la ventana
shot(41.6, 'Z', null, L => { fen(L, { dusk: 1 }); put(me, WIN.x, WIN.y, WIN.z + .6, 0); actuar(me, 0, [[0, SITZ({ aLx: 1.6, aRx: 1.6, aLe: 1.4, aRe: 1.4, lean: .2 })]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown', eyes: 'side_r' });
  JU.forEach((c, i) => { walkTo(c, FX + 3 + i * 3.2, 9 + (i % 2) * 1.6, PI / 2 - .25, 3.4, L, i); cara(c, L.T + i, { expr: 'happy', mouth: 'smile' }); });
  cm([FX - 7, 7, 30], [FX - 5.5, 7.4, 27], L.k); camera.lookAt(FX + 1.4, 7.6, 3); camera.fov = 44; sh(V(FX, 0, 10), 26); }, [[0, 'steps', .4], [.5, 'laugh_m', .2]]);
// 32 «die Nase an der Scheibe.» (golpe de zoom): la cara de Lukas pegada al cristal, el cristal se empaña
shot(42.6, 'C', 'punch', L => { fen(L, { dusk: 1, smudge: .25 + Math.sin(L.T * 3) * .1 }); put(me, WIN.x, WIN.y, WIN.z + .55, 0); actuar(me, 0, [[0, SITZ({ aLx: 2.0, aRx: 2.0, aLe: 1.0, aRe: 1.0, aLz: .45, aRz: .45, lean: .35, headX: -.35 })]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'o', eyes: 'worried' });
  FE.SMUDGE.position.y = hp(me).y + .7; cm([WIN.x + .3, 10.4, 7.4], [WIN.x + .2, 10.3, 6.6], L.k); camera.lookAt(WIN.x, 9.6, 0); camera.fov = 40; sh(V(FX, 0, 4), 16); }, [[0, 'hand_glass', .5], [.4, 'whisper', .15]]);
// 33 «Inzwischen fragen mich die Jungs gar nicht mehr.»: tumbado en la cesta, el móvil: «Keine neuen Nachrichten»
shot(43.77, 'R', null, L => { home(L); inBasket(L, { aRx: 1.6, aRe: 1.3 }); cara(me, L.T, { expr: 'sad', mouth: 'frown', eyes: 'down' }); phoneScr('JUNGS|Keine neuen/Nachrichten|'); POST.push(() => { const h = hp(me); show(PHONE, h.x + .6, h.y - .8, h.z + 2.2, 0, 1.0); PHONE.lookAt(camera.position); });
  orb(L.k, V(KB.x - .8, 1.8, KB.z), null, [10.5, .15, .32, 46], [9.4, .05, .3, 46]); }, [[0, 'silence_tick', .35], [.7, 'sigh', .35]]);
// 34 «Weil es sowieso nichts bringt,»: en la calle, los Jungs se encogen de hombros
shot(45.6, 'W', null, L => { fen(L, { dusk: 1 }); const p = V(FX + 10, 0, 20); JU.forEach((c, i) => { put(c, p.x - 4 + i * 4, 0, p.z + (i === 1 ? -1 : 0), -.35 + (i - 1) * -.1); actuar(c, 0, [[0, GEST.shrug]], { T: L.T }); cara(c, L.T + i, { expr: 'confused', mouth: 'flat' }); });
  orb(L.k, V(p.x, 3.8, p.z), null, [16, -.35, .1, 46], [14.5, -.25, .08, 46]); sh(p, 20); }, [[0, 'cloth', .4], [.4, 'hmm', .35]]);
// 35 «schreiben sie gleich Svenja.»: el móvil de Svenja: «Darf Lukas heute raus?» — «Nein.»
shot(46.85, 'S', null, L => { home(L); sofaSit(L, sv, 0, holdPhone); cara(sv, L.T, { expr: 'smug', eyes: 'down', mouth: 'smile' }); const k = L.T > 47.5; phoneAt(sv, 'JUNGS|Darf Lukas/heute raus?|' + (k ? 'Nein.' : ''), 1.9, -.6, 1.15);
  cm([SOF.x - 1.2, 6.6, SOF.z + 11], [SOF.x - 1, 6.4, SOF.z + 9.8], L.k); camera.lookAt(SOF.x, 5.6, SOF.z + 1); camera.fov = 44; }, [[0, 'notif', .45], [.6, 'click_set', .4]]);
// 36 «Kennt ihr auch so einen Good Boy wie Lukas?» (zoom lento): Lukas en la cesta, ojos de cachorro a cámara
shot(48.12, 'Z', 'slow', L => { home(L); put(me, KB.x, .8, KB.z, 0); actuar(me, 0, [[0, SITZ({ headX: -.05, headZ: .25 + Math.sin(L.T * 2) * .05, aLx: 1.3, aRx: 1.3, aLe: 1.5, aRe: 1.5 })]], { T: L.T }); cara(me, L.T, { expr: 'sad', eyes: 'worried', mouth: 'smile' });
  badge('gold', 'GOOD BOY?', W * .5, H * .17, clamp((L.T - 48.92) / .12), 1, .9); onFace(me, lerp(7, 4.6, easeIn(L.k)), -.3, 0, 42); }, [[0, 'whisper', .2]]);
// 37 «Dann markiert ihn.»: Lukas señala a la cámara con la pata y guiña
shot(50.0, 'C', null, L => { home(L); put(me, KB.x, .8, KB.z, 0); actuar(me, 0, [[0, SITZ({ aRx: 1.55, aRz: -.05, aRe: .05, headZ: -.1 })]], { T: L.T }); cara(me, L.T, { expr: 'smug', eyes: L.T > 50.4 ? 'squint' : 'happy', mouth: 'grin' });
  badge('green', '@ MARKIEREN', W * .5, H * .17, clamp((L.T - 50.2) / .12), 1, .8); onFace(me, 5.4, -.2, -.4, 44, L.k, 4.8); }, [[0, 'pop', .45], [.3, 'click_set', .35]]);
// 38 «Mein Tag beginnt um halb sechs,»: de noche aún: suena el despertador 5:30; Lukas se despierta de golpe en la cama
const lukBed = (L, up = 0) => { put(me, WX + 12.8, 3.15 + up * .2, -7.4 + up * 2.6, 0); me.root.rotation.x = lerp(-PI / 2, -.05, up); actuar(me, 0, [[0, { aLx: lerp(.1, .9, up), aRx: lerp(.1, .9, up), aLe: up, aRe: up, lLx: up * 1.5, lRx: up * 1.5 }]], { T: L.T }); };
shot(51.12, 'F', null, L => { home(L, { night: 1 }); const up = easeOut(clamp((L.T - 51.5) / .25)); lukBed(L, up); svBed(L); show(BLANK, WX + 10, 3.2, -4.4, 0); cara(sv, L.T, { eyes: 'closed', mouth: 'flat' }); cara(me, L.T, { expr: up > .5 ? 'shock' : 'neutral', eyes: up > .5 ? 'wide' : 'closed', mouth: up > .5 ? 'o' : 'flat' });
  WO.ALARM.position.y = 3.3 + Math.abs(Math.sin(L.T * 40)) * .08; badge('num', '5:30', W * .5, H * .17, clamp((L.T - 51.94) / .12)); FILL.intensity = 30;
  cm([WX + 16.8, 6.6, -3], [WX + 16.4, 6.4, -3.6], L.k); camera.lookAt(WX + 12.6, 4.4, -10.6); camera.fov = 46; }, [[0, 'alarm', .45], [.4, 'gasp', .3]]);
// 39 «denn da liegt schon die To-do-Liste»: sentado en la cama, la lista sobre su almohada
shot(52.72, 'W', null, L => { home(L, { night: 1 }); lukBed(L, 1); svBed(L); show(BLANK, WX + 10, 3.2, -4.4, 0); cara(sv, L.T, { eyes: 'closed', mouth: 'flat' }); cara(me, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' }); todoDraw(0); show(TODO, WX + 12.8, 3.75, -11.6, .15, .9); FILL.intensity = 30;
  cm([WX + 15, 9.6, -1.4], [WX + 14.6, 9.4, -2.2], L.k); camera.lookAt(WX + 12.8, 4.6, -9.4); camera.fov = 46; }, [[0, 'paper', .5], [.6, 'blanket', .35]]);
// 40 «auf meinem Kopfkissen.»: la lista de cerca
shot(53.98, 'I', null, L => { home(L, { night: 1 }); todoDraw(0); show(TODO, WX + 12.8, 3.75, -11.6, .15, .9); FILL.intensity = 40; lukBed(L, 1); cara(me, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' });
  cm([WX + 12.9, 9.6, -9.6], [WX + 12.85, 9.0, -10.2], L.k); camera.lookAt(WX + 12.8, 3.8, -11.7); camera.fov = 40; }, [[0, 'paper', .4]]);
// 41 «Abwasch, Fenster,»: en la cocina, Lukas friega a toda velocidad; la lista se va tachando
const SINK = V(WX - 14, 0, -9.6);
shot(54.8, 'S', null, L => { home(L); put(me, SINK.x, 0, SINK.z, PI); const f = Math.sin(L.T * 26); actuar(me, 0, [[0, { aLx: 1.3, aRx: 1.3 + f * .25, aLe: .9, aRe: .9 + f * .2, aLz: -.25, aRz: -.25 + f * .1, lean: .15, headX: .25 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  inHand(PLATE, me, 'L', [0, -.6, .3], [PI / 2, 0, 0], 1); splash(V(SINK.x, 6.4, SINK.z - 3.2), 54.9, L.T, .4); todoDraw(L.T > 55.65 ? 2 : 1); badge('green', L.T > 55.65 ? 'FENSTER' : 'ABWASCH', W * .5, H * .17, clamp((L.T - 54.85) / .1), 1, .75);
  cm([SINK.x - 6, 9, SINK.z - 1], [SINK.x - 5.4, 9, SINK.z - .4], L.k); camera.lookAt(SINK.x, 5.6, SINK.z - 2); camera.fov = 48; }, [[0, 'water_bloop', .45], [.3, 'porcelain', .4], [.85, 'brush', .4]]);
// 42 «Müll, Wäsche.»: Lukas carga la bolsa de basura y la cesta de la colada a la vez
shot(56.0, 'C', null, L => { home(L); walkTo(me, WX - 4, -4, PI / 2, 5, L, 0, 14); actuar(me, 0, [[0, { ...walkP(L.T, 0, 14), aLx: 1.2, aRx: 1.2, aLe: .6, aRe: .6, aLz: -.3, aRz: -.3 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  const h = hp(me); show(LAUNDRY, h.x + 2.2, h.y - 3.6, h.z + .2, 0, 1); inHand(TRASH, me, 'R', [0, -1.4, 0], [0, 0, 0], .8); todoDraw(4); badge('green', L.T > 56.7 ? 'WÄSCHE' : 'MÜLL', W * .5, H * .17, clamp((L.T - 56.23) / .1), 1, .75);
  orb(L.k, V(h.x, 3.6, h.z), null, [13, .15, .1, 46], [12, .05, .08, 46]); }, [[0, 'trash_hit', .4], [.6, 'cloth', .45]]);
// 43 «Und ganz unten, unterstrichen:»: la lista: abajo del todo, «lächeln», subrayado en rojo
shot(57.24, 'Z', null, L => { home(L); todoDraw(4, clamp((L.T - 57.84) / .6)); show(TODO, WX + 12.8, 3.75, -11.6, .15, .9); put(me, WX + 12.8, 0, -5.4, PI); actuar(me, 0, [[0, { aRx: 1.0, aRe: .8, lean: .3, headX: .45 }]], { T: L.T }); cara(me, L.T, { expr: 'confused', eyes: 'down' });
  cm([WX + 12.85, 8.8, -10.0], [WX + 12.82, 8.0, -10.6], L.k); camera.lookAt(WX + 12.8, 3.8, -12.4); camera.fov = 38; }, [[.6, 'pencil', .5]]);
// 44 «lächeln.» (golpe de zoom): Lukas fuerza una sonrisa enorme
shot(58.59, 'C', 'punch', L => { home(L); put(me, WX + 2, 0, 2, 0); actuar(me, 0, [[0, { aLx: .2, aRx: .2, aLz: .15, aRz: .15, headZ: .05 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'wide', mouth: 'grin' }); sweat(me, L.T, 1);
  onFace(me, 4.0, -.1, .2, 42, L.k, 3.6); }, [[0, 'sparkle', .45]]);
// 45 «Sobald Svenja Schatz ruft,»: Svenja en el sofá llama: «Schatz?»
shot(59.43, 'W', null, L => { home(L); sofaSit(L, sv, 0, { aRx: 2.3, aRz: -.4, aRe: 2.0, headY: .2, headZ: .1 }); const k = clamp((L.T - 60.25) / .1); cara(sv, L.T, { expr: 'happy', mouth: k ? 'o' : 'smile' }); bubble(sv, 'Schatz?', k, 1.2); inHand(CUPS[0], sv, 'L', [0, -.75, .25]);
  onBody(sv, 12, .2, .12, 44, L.k, 10.4); }, [[.8, 'pling', .35]]);
// 46 «bin ich in zwei Sekunden da.»: Lukas cruza el piso a cuatro patas a toda velocidad; cronómetro «2 SEK»
shot(61.03, 'S', null, L => { home(L); const t = L.lt; crawl(me, WX + 14 - t * 13, 2, -PI / 2, 0, L, 0, { wv: 1.6, extra: { lean: 1.4 } }); cara(me, L.T, { expr: 'determined', mouth: 'grin' }); dust(V(WX + 14 - t * 13, 0, 2), 61.1, L.T, 6, .5);
  badge('num', '2 SEK', W * .5, H * .17, clamp((L.T - 61.33) / .12)); orb(L.k, V(WX + 10 - t * 13, 2.4, 2), null, [15, .05, .12, 50], [15, -.15, .1, 50]); }, [[0, 'steps_run', .5], [.2, 'whoosh', .35], [.9, 'land', .35]]);
// 47 «Mein Rekord: 1,6 Sekunden,»: el cronómetro marca 1,6 s; Lukas celebra detrás
shot(62.54, 'F', null, L => { home(L); const s = Math.min(1.6, (L.T - 62.54) * 2.2); watchDraw(L.T < 63.12 ? s : 1.6); show(WATCH, WX + .8, 6.4, 3.4, 0, 1.3); WATCH.lookAt(camera.position);
  put(me, WX - 1.4, 0, -1, .25); actuar(me, 0, [[0, SITZ({ aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .2, aRe: .2, headX: -.25 })]], { T: L.T }); laughF(me, L.T); badge('gold', 'REKORD!', W * .5, H * .16, clamp((L.T - 62.76) / .12), 1, .9); confetti(V(WX - 1.4, 3, -1), 63.1, L.T, 40, .6);
  cm([WX + 1.4, 7.2, 12], [WX + 1.2, 7.0, 10.8], L.k); camera.lookAt(WX + .2, 5.6, 0); camera.fov = 44; POST.push(() => WATCH.lookAt(camera.position)); }, [[0, 'watch_click', .55], [.6, 'ding_reveal', .4], [.7, 'party_horn', .3]]);
// 48 «direkt aus»: en la bañera, relajado entre la espuma… oye la llamada
shot(64.1, 'Z', null, L => { bath(L); const T0 = V(BX, 0, -6.5); put(me, T0.x + 1.5, 1.4, T0.z, -PI / 2); me.root.rotation.z = -.9; actuar(me, 0, [[0, { aLx: .4, aRx: .4, aLz: .9, aRz: .9, aLe: 1.8, aRe: 1.8, lLx: 1.4, lRx: 1.4, headX: .5 }]], { T: L.T });
  const k = L.T > 64.8; cara(me, L.T, { expr: k ? 'shock' : 'happy', eyes: k ? 'wide' : 'closed', mouth: k ? 'o' : 'smile' }); FOAMH.visible = true;
  cm([BX + 3, 9.4, 4.4], [BX + 2.5, 9.0, 3.4], L.k); camera.lookAt(BX + .6, 4.6, -6.5); camera.fov = 44; }, [[0, 'water_bloop', .45], [.5, 'drip', .35]]);
// 49 «der Badewanne.»: salta fuera de la bañera; salpica agua y espuma
shot(65.25, 'C', 'punch', L => { bath(L); const t = clamp(L.lt / .6); const x = BX + lerp(1, -2, t), y = lerp(1.6, 0, t) + Math.sin(t * PI) * 4.4, z = lerp(-6.5, -1.5, t); put(me, x, y, z, .2); actuar(me, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, lLx: .9 * (1 - t), lRx: .4, lLk: 1.2 * Math.sin(t * PI), lRk: 1.0 * Math.sin(t * PI), lean: .1 }]], { T: L.T });
  cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'talk_wide' }); FOAMH.visible = true; FEET.set(true); splash(V(BX, 4.2, -6.5), 65.3, L.T, 1.4);
  cm([BX + 2, 8.8, 9.8], [BX + 1.6, 8.6, 9.0], L.k); camera.lookAt(BX - .4, 5.4, -3.6); camera.fov = 48; }, [[0, 'splash', .6], [.5, 'land', .4]]);
// 50 «Mit Schaum auf dem Kopf»: Lukas llega con espuma en la cabeza, goteando
shot(66.22, 'R', null, L => { home(L); put(me, SOF.x + 1, 0, SOF.z + 7.6, PI + .15); actuar(me, 0, [[0, { aLx: .2, aRx: .4, aLz: .2, aRz: .3, headX: -.05 }]], { T: L.T }); grin(me, L.T); FOAMH.visible = true; FEET.set(true); sweat(me, L.T, 2);
  onFace(me, 5.2, .2, .3, 42, L.k, 4.6); }, [[0, 'drip', .45], [.4, 'pop', .3]]);
// 51 «und nur einer Socke.»: plano de pies: un calcetín rosa a rayas y un pie descalzo; Svenja levanta una ceja
shot(67.24, 'C', null, L => { home(L); put(me, SOF.x + 1, 0, SOF.z + 7.6, PI + .15); actuar(me, 0, [[0, { aLx: .2, aRx: .4, aLz: .2, aRz: .3 }]], { T: L.T }); grin(me, L.T); FOAMH.visible = true; FEET.set(true);
  sofaSit(L, sv, 0, GEST.cross); cara(sv, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' }); badge('red', 'NUR 1 SOCKE', W * .5, H * .17, clamp((L.T - 67.6) / .12), 1, .8);
  cm([SOF.x + 4.8, 2.4, SOF.z + 12.6], [SOF.x + 4.4, 3.2, SOF.z + 12.2], L.k); camera.lookAt(SOF.x + .6, 3.2, SOF.z + 3); camera.fov = 50; }, [[0, 'drip', .4], [.5, 'hmm', .35]]);
// 52 «Für jeden Abwasch»: Lukas deja un plato reluciente
shot(68.67, 'W', null, L => { home(L); put(me, SINK.x + 1.2, 0, SINK.z + 1.4, PI - .5); actuar(me, 0, [[0, { aLx: 1.6, aRx: 1.3, aLe: .5, aRe: .9, lean: .05, headX: .1 }]], { T: L.T }); grin(me, L.T); inHand(PLATE, me, 'L', [0, -.6, .3], [PI / 2, 0, 0], 1.1); inHand(RAG, me, 'R', [0, -.6, .3]);
  const h = hp(me); hearts(V(h.x, h.y - 1, h.z - 1.5), L.T); onBody(me, 12.5, -.35, .12, 46, L.k, 11, -.25); }, [[0, 'porcelain', .45], [.4, 'sparkle', .45]]);
// 53 «gibt es ein Leckerli.»: Svenja le lanza una galletita; él la atrapa con la boca
shot(69.63, 'S', null, L => { home(L); const P0 = V(WX - 6, 0, -4); put(sv, P0.x, 0, P0.z, -PI / 2); put(me, P0.x - 5, 0, P0.z, PI / 2); actuar(me, 0, [[0, SITZ({ headX: -.4 })]], { T: L.T });
  const t = clamp((L.T - 69.75) / .45); actuar(sv, 0, [[0, { aRx: lerp(1.6, 1.0, t), aRz: -.1, aRe: lerp(.6, .1, t), aLx: .3 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'smile' }); cara(me, L.T, { expr: 'happy', eyes: t >= 1 ? 'happy' : 'up', mouth: t >= 1 ? 'grin' : 'o' });
  const a = wpos(sv.aR.hand), b = hp(me).add(V(.6, .5, 0)); show(TREAT, lerp(a.x, b.x, t), lerp(a.y, b.y, t) + Math.sin(t * PI) * 1.6, lerp(a.z, b.z, t), t * 8, 1.4); if (t >= 1) TREAT.visible = false;
  badge('gold', 'LECKERLI', W * .5, H * .17, clamp((L.T - 70.23) / .12), 1, .8); orb(L.k, V(P0.x - 2.5, 3.6, P0.z), null, [15, .1, .12, 46], [13.6, .02, .1, 46]); }, [[.1, 'throw', .4], [.55, 'chew', .5]]);
// 54 «Und wenn ich alles richtig mache,»: todo reluce; Svenja revisa con el dedo y le da el visto bueno
shot(70.87, 'F', null, L => { home(L); const P0 = V(WX - 10, 0, -2); put(sv, P0.x + 2.4, 0, P0.z, -.4); actuar(sv, 0, [[0, { aRx: 1.9, aRz: .2, aRe: .9, aLx: .4, headY: .2 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'smile', eyes: 'happy' });
  put(me, P0.x - 2.2, 0, P0.z + 1.2, .5); actuar(me, 0, [[0, SITZ({ headX: -.2 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  orb(L.k, V(P0.x, 3.6, P0.z + .6), null, [15, .05, .14, 46], [13.6, -.05, .12, 46]); }, [[0, 'sparkle', .5], [.6, 'ding_soft', .35]]);
// 55 «krault sie mich hinterm Ohr,»: Svenja le rasca detrás de la oreja; él cierra los ojos de gusto
shot(72.11, 'I', null, L => { home(L); const P0 = V(WX - 10, 0, -4); sofaSit(L, sv, 1.4, { aRx: 1.2, aRz: -.45, aRe: 1.1 + Math.sin(L.T * 18) * .15, lean: .15, headX: .2 }); cara(sv, L.T, { expr: 'happy', mouth: 'smile', eyes: 'happy' });
  put(me, SOF.x - .1, 0, SOF.z + 5.0, PI * .15); actuar(me, 0, [[0, SITZ({ headZ: .35 + Math.sin(L.T * 18) * .05, headX: -.1 })]], { T: L.T }); cara(me, L.T, { eyes: 'closed', mouth: 'open_smile', blush: 1 }); hearts(hp(me).add(V(0, 1.6, 0)), L.T);
  orb(L.k, V(SOF.x + .4, 4.2, SOF.z + 3.6), null, [13, .25, .1, 44], [11.8, .18, .08, 44]); }, [[0, 'cloth', .4], [.5, 'sigh', .3]]);
// 56 «bis mein Bein zappelt.»: la pierna de Lukas patalea sin control
shot(73.85, 'Z', null, L => { home(L); sofaSit(L, sv, 1.4, { aRx: 1.2, aRz: -.45, aRe: 1.1 + Math.sin(L.T * 18) * .15, lean: .15, headX: .2 }); cara(sv, L.T, { expr: 'happy', mouth: 'laugh', eyes: 'happy' });
  put(me, SOF.x - .1, 0, SOF.z + 5.0, PI * .15); const kick = Math.sin(L.T * 34); actuar(me, 0, [[0, SITZ({ headZ: .35, headX: -.1, lRx: .9 + kick * .6, lRk: .6 + kick * .4, hipY: 1.55 })]], { T: L.T }); cara(me, L.T, { eyes: 'happy', mouth: 'laugh', blush: 1 });
  dust(V(SOF.x + .6, 0, SOF.z + 5.6), 74.0, L.T, 6, .3); orb(L.k, V(SOF.x, 2.2, SOF.z + 5), null, [10.5, .55, .1, 44], [9.4, .45, .08, 44]); }, [[0, 'thump', .45], [.3, 'thump', .4], [.6, 'thump', .35], [.9, 'laugh_m', .25]]);
// 57 «Mache ich dagegen etwas falsch,»: un plato roto en el suelo; Svenja, manos en las caderas; Lukas, culpable
shot(75.55, 'S', null, L => { home(L); const P0 = V(SINK.x + 4, 0, SINK.z + 4); SHARDS.forEach((s, i) => show(s, P0.x + Math.cos(i * 1.1) * (.8 + i * .2), .05, P0.z + 1.6 + Math.sin(i * 1.1) * .7, i));
  put(sv, P0.x + 4, 0, P0.z - .4, -PI / 2 + .3); actuar(sv, 0, [[0, { aLx: .3, aRx: .3, aLz: .7, aRz: .7, aLe: 1.9, aRe: 1.9, headX: .1 }]], { T: L.T }); cara(sv, L.T, { expr: 'angry', mouth: 'frown' });
  put(me, P0.x - 2.6, 0, P0.z + .6, PI / 2 - .2); actuar(me, 0, [[0, SITZ({ headX: .35, aLx: 1.6, aRx: 1.6, aLe: 1.8, aRe: 1.8, aLz: -.35, aRz: -.35 })]], { T: L.T }); cara(me, L.T, { expr: 'worried', eyes: 'down', mouth: 'frown' }); sweat(me, L.T, 2);
  orb(L.k, V(P0.x + .6, 3.6, P0.z + .6), null, [17, .1, .14, 48], [15.6, .02, .12, 48]); }, [[0, 'porcelain_break', .5], [.6, 'gasp_f', .3]]);
// 58 «schlafe ich im Körbchen vor dem Bett.»: de noche, Lukas hecho un ovillo en la cesta; Svenja en la cama
shot(77.14, 'W', null, L => { home(L, { night: 1 }); inBasket(L); cara(me, L.T, { eyes: 'closed', mouth: 'flat' }); svBed(L); show(BLANK, WX + 10, 3.2, -4.4, 0); cara(sv, L.T, { eyes: 'closed', mouth: 'flat' }); FILL.intensity = 30;
  cm([WX + 4, 11, 16], [WX + 4.6, 10.4, 15], L.k); camera.lookAt(WX + 9.6, 2.6, -1); camera.fov = 48; }, [[0, 'crickets', .4], [.5, 'blanket', .35]]);
// 59 «Das Körbchen ist übrigens»: primer plano: Lukas, feliz y calentito en la cesta
shot(78.79, 'C', null, L => { home(L, { night: 1 }); inBasket(L, { headX: .25 }); cara(me, L.T, { eyes: 'closed', mouth: 'smile', blush: 1 }); FILL.intensity = 34; ZZ.visible = true; const h = hp(me); ZZ.position.set(h.x - .5, h.y + 1.6 + (L.T % 1) * 1.2, h.z + .8); ZZ.lookAt(camera.position);
  orb(L.k, V(KB.x - 1.4, 1.8, KB.z), null, [8.5, .1, .25, 44], [7.6, .02, .22, 44]); POST.push(() => ZZ.lookAt(camera.position)); }, [[0, 'snore', .45], [.6, 'zzz', .35]]);
// 60 «bequemer als das Bett.»: Svenja da vueltas en la cama, despierta y gruñona; él ronca feliz
shot(79.83, 'Z', null, L => { home(L, { night: 1 }); svBed(L, { aLx: 2.4, aLz: .5, aLe: 1.8 }); sv.root.rotation.z = Math.sin(L.T * 4) * .25; show(BLANK, WX + 10, 3.2, -4.4, 0); cara(sv, L.T, { expr: 'angry', eyes: 'squint', mouth: 'frown' }); inBasket(L); cara(me, L.T, { eyes: 'closed', mouth: 'smile' }); FILL.intensity = 34;
  cm([WX + 14, 10.6, 2], [WX + 13.4, 10.2, 1], L.k); camera.lookAt(WX + 8.4, 3.0, -6.6); camera.fov = 46; }, [[0, 'bed_creak', .45], [.4, 'snore', .35]]);
