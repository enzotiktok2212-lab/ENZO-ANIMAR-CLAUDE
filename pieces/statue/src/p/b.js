// ---------- b: la vida de estatua y Mia (48,09 – 88,37 s) ----------
// 39 «In den ersten Monaten»: la plaza en otoño, hojas cayendo; mi ex (coleta rubia, top rosa) cruza la plaza
shot(48.09, 'W', null, L => { platz(L, { dusk: true }); statues(L); walk(ex, L, P.x - 14, P.z + 26, PI / 2, 2.4, 0, { expr: 'happy' }); extras(L, EXS.slice(0, 3), SPOTS.slice(2));
  const e = ex.root.position; cm([e.x + 6, 9, e.z + 22, e.x, 4.6, e.z, 46], [e.x + 5, 8.6, e.z + 19, e.x, 4.6, e.z, 44], L.k); sh(V(e.x, 0, e.z), 30); }, [[0, 'whoosh', .4], [.2, 'leaves', .5]]);
// 40 «lief meine Ex jeden Tag»: mi ex, de frente, camina mirando el móvil y sonriendo; «JEDEN TAG»
shot(49.33, 'C', 'punch', L => { platz(L); const c = walk(ex, L, P.x - 2, P.z + 36, PI / 2 + .3, 2.2, 0, { pose: { aRx: 1.2, aRe: 1.4 }, f: { expr: 'happy', mouth: 'smile' } }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9);
  onBody(c, 11, 0, .1, 42, L.k, 9.4); bigNum('JEDEN TAG', clamp((L.lt - .2) / .2), 'gold', .19, .95); }, [[0, 'impact', .4], [.2, 'steps', .5]]);
// 41 «über den Platz.»: desde arriba, mi ex cruza por delante del pedestal; las estatuas la miran
shot(50.39, 'S', null, L => { platz(L); statues(L, { fe: { eyes: 'down', mouth: 'flat', noBlink: true } }); walk(ex, L, P.x - 8, P.z + 14, PI / 2, 2.6, 0, { expr: 'happy' });
  const e = ex.root.position; cm([e.x + 3, 16, e.z + 18, e.x, 3, e.z, 48], [e.x + 2, 15, e.z + 16, e.x, 3, e.z, 46], L.k); sh(V(e.x, 0, e.z), 26); }, [[0, 'swipe', .4], [.1, 'steps', .4]]);
// 42 «Hand in Hand mit einem anderen.»: mi ex de la mano con un chico de gorra; se ríen y se balancean las manos
shot(51.31, 'C', 'punch', L => { platz(L); const sw = Math.sin(L.T * 4) * .4; const a = walk(ex, L, P.x - 1.6, P.z + 30, PI / 2 + .25, 1.6, 0, { pose: { aRx: .3 + sw, aRz: -.25 }, f: { expr: 'happy', mouth: 'laugh' } }); const b = walk(exF, L, P.x - 1.6 - 2.6 * Math.cos(PI / 2 + .25 - PI / 2) * 0, P.z + 32.4, PI / 2 + .25, 1.6, 1, { pose: { aLx: .3 + sw, aLz: .25 }, f: { expr: 'happy', mouth: 'open_smile' } });
  const m = a.root.position.clone().add(b.root.position).multiplyScalar(.5); orbit(V(m.x, 4.4, m.z), lerp(13, 11, L.k), PI / 2 + .25, .1, 42); hearts(V(m.x, 8, m.z), L.T, 3, 2); sh(V(m.x, 0, m.z), 20); }, [[0, 'impact', .4], [.2, 'girls_laugh', .4], [.4, 'steps', .4]]);
// 43 «Sie hat nie»: mis ojos de piedra miran hacia abajo, tristes
shot(52.55, 'F', null, L => { platz(L); statues(L, { fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); onFace(finn, 5.4, .8, -.4, 40, L.k, 4.6); }, [[0, 'flash', .3], [.3, 'sad_sting', .5]]);
// 44 «nach oben geschaut.»: picado desde lo alto del pedestal: la pareja pasa por debajo sin levantar la vista
shot(53.38, 'C', 'slow', L => { platz(L); statues(L); walk(ex, L, P.x - 6, P.z + 9, PI / 2, 2.2, 0, { f: { expr: 'happy', mouth: 'smile' } }); walk(exF, L, P.x - 6, P.z + 11.4, PI / 2, 2.2, 1, { f: { expr: 'happy' } });
  const h = hp(finn); cm([h.x + 1, h.y + 3, h.z + 1, P.x - 5.5, 1.6, P.z + 10, 50], [h.x + 1, h.y + 3.4, h.z + 1, P.x - 4, 1.6, P.z + 10, 46], L.k); sh(V(P.x, 0, P.z + 10), 22); }, []);
// 45 «Kinder kletterten auf meinen Sockel.»: tres niños trepan al pedestal y uno se me cuelga de la pierna
shot(54.45, 'W', null, L => { platz(L); statues(L, { fe: { eyes: 'side_r', mouth: 'grimace', noBlink: true } });
  const k0 = put(KIDS[0], P.x + 5.2, TOP, P.z + 1.6, -.3); actuar(k0, 0, [[0, { aLx: 2.4, aRx: 1.6, aLe: .4, aRe: .8, lean: .2 }]], { T: L.T }); laughF(k0, L.T); k0.blob.visible = false;
  const u = clamp(L.lt / 1.2); const k1 = put(KIDS[1], P.x - 1, lerp(0, TOP, u), P.z + 4.4, PI); actuar(k1, 0, [[0, { aLx: 2.9, aRx: 2.9, aLe: .4 + Math.sin(L.T * 10) * .3, aRe: .4, lLx: .8 + Math.sin(L.T * 10) * .5, lLk: 1.2, lean: -.1 }]], { T: L.T }); cara(k1, L.T, { expr: 'determined' });
  const k2 = put(KIDS[2], P.x + 8.4, 0, P.z + 7, -.6); actuar(k2, 0, [[0, 'cheer']], { T: L.T }); laughF(k2, L.T);
  cm([P.x + 6, 7, P.z + 24, P.x + 2, 5.4, P.z + 2, 46], [P.x + 5, 6.8, P.z + 21, P.x + 2, 5.4, P.z + 2, 44], L.k); sh(V(P.x, 0, P.z + 4), 22); }, [[0, 'whoosh', .4], [.1, 'kids_laugh', .5], [.6, 'climb', .5]]);
// 46 «Tauben setzten sich»: tres palomas bajan aleteando hacia mi cabeza
shot(56.06, 'C', 'punch', L => { platz(L); statues(L, { fe: { eyes: 'up', mouth: 'grimace', noBlink: true } }); const h = hp(finn);
  for (let i = 0; i < 3; i++) { const u = clamp((L.lt - i * .12) / .55); dove(i, lerp(h.x + 6 - i * 5, h.x - .6 + i * .6, u), lerp(h.y + 9, h.y + 1.1 + (i === 1 ? .4 : 0), u), lerp(h.z + 4, h.z - .2 + (i - 1) * .3, u), -.3 + i * .4, L.T, 1 - u * .9); }
  onFace(finn, 6.4, 1.2, .4, 42, L.k, 5.6); }, [[0, 'impact', .4], [.05, 'wings_flap', .6], [.5, 'pigeon_coo', .5]]);
// 47 «auf meinen Kopf.»: plano de mi cabeza con las tres palomas encima; una me mira a los ojos; yo bizqueo hacia arriba
shot(56.98, 'S', null, L => { platz(L); statues(L, { fe: { eyes: 'up', mouth: 'wavy', noBlink: true } }); const h = hp(finn); for (let i = 0; i < 3; i++) dove(i, h.x - .6 + i * .6, h.y + 1.1 + (i === 1 ? .4 : 0), h.z - .2 + (i - 1) * .3, -.3 + i * .6, L.T);
  onFace(finn, 4.4, 1.6, -.4, 40, L.k, 4); }, [[0, 'swipe', .4], [.2, 'pigeon_coo', .6]]);
// 48 «Und ein alter Mann erzählte mir»: de noche, un abuelo con chaqueta de punto se sienta al pie del pedestal y me habla mirando arriba
shot(57.81, 'W', null, L => { platz(L, { night: true }); statues(L, { fe: { eyes: 'down', mouth: 'flat', noBlink: true } }); const o = sit(opa, P.x + SPX, 1.5, P.z + 5.2, 0, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2, headX: -.35 }); talk(o, L.T, 57.8, 59.1, 'sad'); o.root.position.y = sitY(o, 1.5);
  cm([P.x + 10, 6, P.z + 22, P.x + 3, 5.4, P.z + 2, 46], [P.x + 9, 6.4, P.z + 20, P.x + 3, 5.8, P.z + 2, 44], L.k); sh(V(P.x, 0, P.z + 4), 24); }, [[0, 'whoosh', .4], [.1, 'crickets', .4], [.4, 'old_sigh', .5]]);
// 49 «eine ganze Nacht lang seinen Kummer,»: primer plano del abuelo llorando, se seca las lágrimas con un pañuelo; la luna detrás; «GANZE NACHT»
shot(59.09, 'C', 'punch', L => { platz(L, { night: true }); const o = sit(opa, P.x + SPX, 1.5, P.z + 5.2, 0, L, { aRx: 2.0, aRe: 2.0, aRz: -.4, aLx: .5, headX: -.2 }); talk(o, L.T, 59.0, 60.8, 'cry'); tears(o, L.T);
  onFace(o, 5.4, 0, .6, 40, L.k, 4.6); bigNum('GANZE NACHT', clamp((L.lt - .4) / .2), 'gold', .19, .9); }, [[0, 'impact', .4], [.2, 'sob_old', .5]]);
// 50 «während er zu meinen Füßen saß.»: contrapicado: el abuelo encogido a mis pies de piedra, yo le miro desde arriba con pena
shot(60.83, 'S', null, L => { platz(L, { night: true }); statues(L, { fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); const o = sit(opa, P.x + SPX, 1.5, P.z + 5.2, 0, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, lean: .35, headX: .3 }); cara(o, L.T, { expr: 'sad' });
  cm([P.x + 14, 2.6, P.z + 20, P.x + SPX, 6.4, P.z + 2, 50], [P.x + 13, 2.4, P.z + 19, P.x + SPX, 6.6, P.z + 2, 48], L.k); sh(V(P.x, 0, P.z + 4), 22); }, [[0, 'swipe', .4], [.3, 'owl', .4]]);
// 51 «Bis an einem Donnerstag»: tarde dorada en la plaza, palomas que echan a volar; «DONNERSTAG»
shot(62.28, 'Z', null, L => { platz(L, { dusk: true }); statues(L); for (let i = 0; i < 5; i++) { const u = L.lt * 3; dove(i, P.x - 8 + i * 4 + u * (i - 2), .2 + u * (3 + i), P.z + 22 + u * 2, i, L.T, clamp(L.lt * 4)); }
  extras(L, EXS.slice(10, 13), SPOTS); cm([P.x, 5, P.z + 46, P.x, 6, P.z, 48], [P.x, 6, P.z + 40, P.x, 6.6, P.z, 46], L.k); bigNum('DONNERSTAG', clamp((L.lt - .4) / .2), 'gold', .19, .9); sh(V(P.x, 0, P.z + 20), 34); }, [[0, 'zoom_in', .4], [.1, 'wings_flap', .5], [.4, 'pling', .4]]);
// 52 «ein Mädchen»: entra en la plaza una chica con chaqueta verde, mochila morada y pinza amarilla, andando hacia la cámara
shot(63.32, 'C', 'punch', L => { platz(L, { dusk: true }); const c = walk(mia, L, P.x, P.z + 34, PI, 1.6, 0, { f: { expr: 'neutral' } }); const p = c.root.position; orbit(V(p.x, 4.2, p.z), lerp(13, 11, L.k), PI, .1, 42); sh(V(p.x, 0, p.z), 22); }, [[0, 'impact', .4], [.1, 'steps', .5], [.5, 'soft_chime', .4]]);
// 53 «mit einer grünen Jacke auftauchte.»: travelling vertical por la chaqueta verde hasta su cara tímida
shot(64.24, 'S', null, L => { platz(L, { dusk: true }); const c = walk(mia, L, P.x, P.z + 32.4, PI, 1.2, 0, { f: { expr: 'warm', mouth: 'smile' } }); const h = hp(c);
  cm([h.x, h.y - 3.2, h.z - 7, h.x, h.y - 3, h.z, 40], [h.x, h.y + .6, h.z - 7.4, h.x, h.y + .3, h.z, 40], L.k); }, [[0, 'swipe', .4], [.2, 'cloth', .5]]);
// 54 «Sie setzte sich auf die Bank gegenüber»: se sienta en el banco de enfrente; detrás, el pedestal con nosotros dos
shot(65.67, 'W', null, L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'flat', noBlink: true } }); miaBench(L); cara(mia, L.T, { expr: 'neutral' });
  cm([P.x + 13, 5, BZ - 2, P.x - 1, 4.6, BZ - 12, 46], [P.x + 12, 5.2, BZ - 4, P.x - 1, 4.8, BZ - 12, 44], L.k); sh(V(P.x, 0, BZ - 10), 30); }, [[0, 'whoosh', .4], [.4, 'bench_creak', .5]]);
// 55 «und schaute verlegen nach oben.»: Mia levanta la vista hacia mí, se sonroja y se coloca el pelo
shot(67.01, 'C', 'slow', L => { platz(L, { dusk: true }); miaBench(L, { headX: -.35, aRx: 1.9, aRe: 2.2, aRz: -.5 }); cara(mia, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' });
  onFace(mia, 5.4, -.6, .4, 40, L.k, 4.4); }, [[.2, 'cloth', .4]]);
// 56 «„Hallo.»: Mia saluda tímidamente con la mano
shot(68.73, 'C', 'punch', L => { platz(L, { dusk: true }); miaBench(L, { aRx: 2.4, aRz: .3 + Math.sin(L.T * 10) * .2, aRe: .6, headX: -.3 }); talk(mia, L.T, 68.7, 69.2, 'warm'); onBody(mia, 9, 0, .12, 42, L.k, 8, 0, 4.2); }, [[0, 'impact', .4], [.1, 'girl_hi', .4]]);
// 57 «Ich weiß, das ist komisch.»: se frota la nuca, avergonzada
shot(69.28, 'S', null, L => { platz(L, { dusk: true }); miaBench(L, { aRx: 2.6, aRe: 2.2, aRz: -.6, headX: -.15, headZ: .15 }); talk(mia, L.T, 69.2, 70.5, 'worried'); onFace(mia, 5.4, 0, -.8, 40, L.k, 4.6); }, [[0, 'swipe', .4]]);
// 58 «Aber ich musste mit jemandem reden.“»: contraplano: mi cara de piedra, los ojos muy abiertos, sorprendido
shot(70.51, 'C', 'slow', L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'wide', mouth: 'o', noBlink: true } }); onFace(finn, 6, -.5, .3, 40, L.k, 4.4); }, []);
// 59 «Am nächsten Tag kam sie wieder,»: otro día: Mia llega con un helado y saluda hacia el pedestal; «FREITAG»
shot(71.97, 'W', null, L => { platz(L); statues(L); const c = walk(mia, L, P.x + 10, BZ + 4, -PI * .7, 1.8, 0, { pose: { aRx: 2.6, aRz: .3, aRe: .4 }, f: { expr: 'happy', mouth: 'open_smile' } });
  const p = c.root.position; orbit(V(p.x, 4.2, p.z), 13, -PI * .7 + .4, .12, 44); bigNum('FREITAG', clamp((L.lt - .2) / .2), 'gold', .19, .9); sh(V(p.x, 0, p.z), 22); }, [[0, 'whoosh', .4], [.2, 'steps', .4], [.2, 'pling', .3]]);
// 60 «und am Tag danach auch.»: otro día más: Mia ya sentada, con la mochila al lado, nos cuenta algo con las manos; «SAMSTAG»
shot(73.21, 'S', null, L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'smile', noBlink: true } }); miaBench(L, { aRx: 1.2 + Math.sin(L.T * 6) * .3, aRe: 1.4, aLx: 1.0, aLe: 1.6 - Math.sin(L.T * 6) * .3 }); talk(mia, L.T, 73.2, 74.7, 'happy');
  cm([P.x - 9, 7, BZ - 18, P.x, 4, BZ, 44], [P.x - 8, 6.8, BZ - 16, P.x, 4, BZ, 42], L.k); bigNum('SAMSTAG', clamp((L.lt - .2) / .2), 'gold', .19, .9); sh(V(P.x, 0, BZ - 6), 26); }, [[0, 'swipe', .4], [.2, 'pling', .3]]);
// 61 «Immer um halb fünf,»: el reloj del Rathaus marca las cuatro y media; «16:30»
shot(74.73, 'Z', null, L => { platz(L, { dusk: true }); statues(L); const c = HB.clock.pos; cm([c.x + 4, c.y - 6, c.z + 30, c.x, c.y - 1, c.z, 40], [c.x + 2, c.y - 4, c.z + 22, c.x, c.y - .6, c.z, 38], L.k); bigNum('16:30', clamp((L.lt - .1) / .2), 'gold', .26, 1.2); }, [[0, 'zoom_in', .4], [.1, 'church_bell', .6]]);
// 62 «nach der Schule.»: en clase, suena el timbre: Mia mete los libros en la mochila y sale corriendo
shot(75.61, 'C', 'punch', L => { school(L); const c = put(mia, KLX + 6, 0, 2 - L.lt * 3, PI - .4); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  [[-11, -2], [0, 6], [-11, 6]].forEach(([x, z], i) => { const s = sit(EXS[i + 4], KLX + x, 3.3, z, 0, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6 }); cara(s, L.T, { expr: 'tired' }); });
  cm([KLX - 2, 9, 16, KLX + 3, 4.6, 0, 46], [KLX - 1, 8.6, 14, KLX + 4, 4.6, -1, 44], L.k); }, [[0, 'school_bell', .6], [.2, 'chair_scrape', .4], [.4, 'steps', .5]]);
// 63 «Sie erzählte mir von ihrer Lehrerin,»: Mia en el banco, imitando con gestos a la profesora (dedo en alto, cara seria)
shot(76.72, 'W', null, L => { platz(L, { dusk: true }); miaBench(L, { aRx: 2.7, aRe: .4, aRz: -.1, headY: .2 }); talk(mia, L.T, 76.7, 78.1, 'angry'); onBody(mia, 9.4, .4, .12, 42, L.k, 8.4, .3, 4.0); }, [[0, 'whoosh', .4], [.4, 'girl_talk', .3]]);
// 64 «die sie ständig anschrie.»: en clase, la Lehrerin (chaqueta roja, moño gris) le grita a Mia, que se encoge en su pupitre
shot(78.09, 'C', 'punch', L => { school(L); const t = put(lehrerin, KLX - 1, 0, 1.2, 0); actuar(t, 0, [[0, { aRx: 2.2, aRe: .3, aRz: -.2, aLz: .5, aLe: 1.5, lean: .15, headX: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'shout', mouth: 'o' });
  const m = sit(mia, KLX, 3.3, 6, PI, L, { aLx: 1.5, aRx: 1.5, aLe: 1.9, aRe: 1.9, lean: .15, headX: .3 }); if (m.pack) m.pack.visible = false; cara(m, L.T, { expr: 'worried', eyes: 'closed', mouth: 'grimace' }); SHAKE = .15;
  cm([KLX + 9, 8, 9, KLX - .5, 5.6, 3, 44], [KLX + 8, 7.8, 8, KLX - .5, 5.6, 3, 42], L.k); }, [[0, 'impact', .4], [.1, 'teacher_shout', .6]]);
// 65 «Von Brezel,»: en casa de Mia: Brezel, un perro salchicha con collar rojo, corre moviendo la cola; «BREZEL»
shot(79.16, 'C', 'punch', L => { miaRoom(L); const d = show(DOG, MZX - 4 + L.lt * 3, 0, 2, PI / 2); DOG.userData.slipper.visible = false; DOG.userData.pose(L.T, 1, 1);
  cm([MZX + 2, 4.6, 12, MZX - 2 + L.lt * 2, 2, 2, 42], [MZX + 3, 4.2, 10, MZX - 1 + L.lt * 2.4, 2, 2, 40], L.k); badge('tag', 'BREZEL', W / 2, H * .2, clamp((L.lt - .3) / .2)); }, [[0, 'impact', .4], [.1, 'dog_bark', .6], [.6, 'paws', .4]]);
// 66 «ihrem Hund, der ihre Hausschuhe fraß.»: Brezel mordisquea una zapatilla rosa y Mia tira de ella riéndose
shot(80.38, 'W', null, L => { miaRoom(L); const d = show(DOG, MZX - 2, 0, 3, -PI / 2 + .3); DOG.userData.pose(L.T, 1, 0); d.rotation.z = Math.sin(L.T * 12) * .04;
  const m = put(mia, MZX - 7.6, 0, 3.6, PI / 2 - .2); if (m.pack) m.pack.visible = false; actuar(m, 0, [[0, { aLx: 1.3, aRx: 1.3, aLe: .3, aRe: .3, lean: -.2 + Math.sin(L.T * 12) * .05, lLx: -.3, lRx: .3 }]], { T: L.T }); laughF(m, L.T);
  cm([MZX - 4.6, 6.4, 16, MZX - 4.8, 3.2, 3, 44], [MZX - 4.8, 6, 14, MZX - 4.8, 3.2, 3, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'dog_growl', .6], [.6, 'girls_laugh', .4]]);
// 67 «Und dass sie Angst vor»: centro comercial: Mia, al pie de la escalera mecánica, se agarra a la mochila
shot(82.08, 'S', null, L => { mallS(L); const m = put(mia, MLX + .4, 0, 7, PI); actuar(m, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, ...shiver(L.T, 1) }]], { T: L.T }); cara(m, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(m, L.T, 1);
  extras(L, EXS.slice(12, 15), [[MLX - 18, 12, PI / 2], [MLX + 16, 4, -PI / 2], [MLX - 10, -12, 0]]);
  cm([MLX + 6, 7, 22, MLX, 6, 2, 46], [MLX + 5, 6.8, 20, MLX, 6.4, 2, 44], L.k); sh(V(MLX, 0, 0), 30); }, [[0, 'swipe', .4], [.1, 'mall_amb', .5], [.3, 'escalator', .4]]);
// 68 «Rolltreppen hatte.»: primer plano de Mia temblando mirando los escalones que suben; «ROLLTREPPE»
shot(82.95, 'C', 'punch', L => { mallS(L); const m = put(mia, MLX + .4, 0, 7, PI); actuar(m, 0, [[0, { aLx: 1.8, aRx: 1.8, aLe: 2.0, aRe: 2.0, aLz: -.3, aRz: -.3, ...shiver(L.T, 2) }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace' });
  onFace(m, 5.2, 0, -.6, 40, L.k, 4.4); badge('tag', 'ROLLTREPPE', W / 2, H * .2, clamp((L.lt - .2) / .2)); }, [[0, 'impact', .4], [.1, 'escalator', .5], [.3, 'gulp', .5]]);
// 69 «Manchmal las sie mir laut aus einem Buch vor.»: Mia en el banco, con un libro abierto, lee en voz alta gesticulando
shot(83.91, 'F', null, L => { platz(L, { dusk: true }); miaBench(L, { aLx: 1.3, aRx: 1.3, aLe: 1.6, aRe: 1.6, aLz: -.1, aRz: -.1, headX: .25 }); attach(BOOK, mia.aR.hand, [-.7, -.6, .6], [.9, 0, 0], 1.2); talk(mia, L.T, 83.9, 85.8, 'happy');
  onBody(mia, 9, -.3, .14, 42, L.k, 8, -.2, 4.0); }, [[0, 'flash', .3], [.2, 'pages', .6]]);
// 70 «Manchmal saß sie einfach still da»: Mia en silencio, abrazada a las rodillas, con el sol bajando detrás
shot(85.85, 'W', null, L => { platz(L, { dusk: true }); miaBench(L, { lLx: 2.2, rLx: 2.2, lLk: 2.4, lRk: 2.4, aLx: 1.2, aRx: 1.2, aLe: 1.8, aRe: 1.8, aLz: -.3, aRz: -.3, headX: .1 }); cara(mia, L.T, { expr: 'warm', eyes: 'half' });
  cm([P.x - 8, 5, BZ - 14, P.x, 4, BZ, 44], [P.x - 7, 5.2, BZ - 13, P.x, 4.2, BZ, 42], L.k); sh(V(P.x, 0, BZ), 22); }, [[0, 'whoosh', .4], [.3, 'wind_soft', .4]]);
// 71 «und schaute nach oben.»: gran plano: Mia en el banco mirando arriba, las dos estatuas al fondo con la luz dorada
shot(87.27, 'S', null, L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'smile', noBlink: true } }); miaBench(L, { headX: -.35 }); cara(mia, L.T, { expr: 'warm', eyes: 'happy' });
  cm([P.x + 14, 5, BZ + 2, P.x, 6, P.z + 10, 48], [P.x + 13, 5.6, BZ, P.x, 6.4, P.z + 10, 46], L.k); sh(V(P.x, 0, P.z + 12), 30); }, [[0, 'swipe', .4]]);
