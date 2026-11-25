// ---------- b: la rima, la mina, Lena y Herr Brandt (47,15 – 97,95 s) ----------
// Túnel (STX): los sonámbulos cavan mirando a -z (ry = PI) en filas; túnel lateral a la izquierda (x = STX - 13, z ∈ [-128, -112]).
// Cocina (KUX): mesa en el centro; sillas (±3,4, ±5,6). Ben en (3,4, -5,6) mirando +z, Lena enfrente (3,4, 5,6) mirando -z.
function withScale(ch, s, fn) { const o = ch.spec.scale; ch.spec.scale = s; ch.root.scale.setScalar(s); fn(); ch.spec.scale = o; }
// fila de cavadores en el túnel: n personas a partir de z0 hacia -z, en columnas x (lista)
function diggers(L, list, z0, xs = [-6, -2, 2, 6], o = {}) { list.forEach((c, i) => { if (c.root.visible) return; const x = xs[i % xs.length], z = z0 - Math.floor(i / xs.length) * (o.dz ?? 6) - (i % 2) * 1.2; if (o.avoid && o.avoid.some(p => Math.hypot(p[0] - x, p[1] - z) < 3)) return; put(c, STX + x, 0, z, PI + (i % 3 - 1) * .25); dig(c, L, i, { sp: c.kid ? 1.7 : 1 }); }); }
const sepia = () => { grade.uniforms.sepia.value = .85; TINT = 'rgba(80,50,10,.12)'; grade.uniforms.vig.value = .7; };
// Lena y Ben frente a frente en la mesa (anstarren): k = tensión 0..1
function stareTable(L, o = {}) { kitchen(L, { night: o.night ?? true }); const b = sit(benT, KUX + 3.4, 2.8, -5.6, 0, L, { aLx: .5, aRx: .5, aLe: .8, aRe: .8, lean: .25 }); const l = sit(lenaT, KUX + 3.4, 2.8, 5.6, PI, L, { aLx: .5, aRx: .5, aLe: .8, aRe: .8, lean: .25 }); return [b, l]; }

// 37 «Dann fällt mir der Reim ein,»: en la cama, Ben levanta el dedo: ¡se acuerda! — «!» encima
shot(47.15, 'C', 'punch', L => { benRoom(L); sitBed(ben, KZX, L, { aRx: 2.6, aRe: .3, aRz: -.2, aLx: .3, headX: -.1 }); KZ.quilt.position.y = 4.6; cara(ben, L.T, { expr: 'lookup', eyes: 'up', mouth: 'o' }); badge('q', '!', W / 2 + 120, H * .26, clamp((L.lt - .3) / .2), 1, 1.2);
  onFace(ben, 5.2, 0, .6, 40, L.k, 4.4); }, [[0, 'impact', .4], [.3, 'ding_soft', .6]]);
// 38 «den hier jedes Kind kennt:»: de día en la calle: dos niños giran la comba y otro salta en el centro, cantando
shot(48.47, 'W', null, L => { gasse(L, { day: true }); const a = put(MEY[2], -4.6, 0, 30, PI / 2), c = put(kumpel, 4.6, 0, 30, -PI / 2), j = put(benT, 0, 0, 30.4, 0); const ph = L.T * 6.5, r = Math.sin(ph);
  actuar(a, 0, [[0, { aRx: 1.0 + r * .5, aRe: .4, aRz: -.1 }]], { T: L.T }); actuar(c, 0, [[0, { aLx: 1.0 - r * .5, aLe: .4, aLz: -.1 }]], { T: L.T }); laughF(a, L.T); laughF(c, L.T);
  const hop = Math.max(0, Math.sin(ph + PI)); j.root.position.y = hop * 1.3; actuar(j, 0, [[0, { lLk: .6 * hop, lRk: .6 * hop, aLx: .3, aRx: .3, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(j, L.T);
  ROPE.visible = true; a.root.updateMatrixWorld(true); c.root.updateMatrixWorld(true); const pa = a.aR.hand.getWorldPosition(V(0, 0, 0)), pc = c.aL.hand.getWorldPosition(V(0, 0, 0)); ROPE.userData.set(pa, pc, -1.6 * Math.cos(ph) + .4);
  orbit(V(0, 3.6, 30), lerp(19, 17, L.k), .1, .1, 50); sh(V(0, 0, 30), 20); }, [[0, 'whoosh', .4], [.1, 'kids_laugh', .5], [.3, 'jump_small', .5], [.8, 'jump_small', .5]]);
// 39 «Bist du wach um drei,»: la rima pintada con tiza en el suelo, de arriba: la cámara se desliza sobre «BIST DU WACH UM DREI»
shot(49.85, 'S', null, L => { gasse(L, { day: true }); MT.RHYME.visible = true; cm([-2, 15, 33, 0, 0, 26.6, 42], [2, 15, 31, 0, 0, 25.8, 42], L.k); DOF = 0; }, [[0, 'swipe', .4], [.1, 'chalk', .6]]);
// 40 «tu als ob»: zoom a «TU ALS OB» (amarillo) y una niña salta a la pata coja por encima
shot(51.04, 'C', 'punch', L => { gasse(L, { day: true }); MT.RHYME.visible = true; const j = put(DX[2], lerp(-6, 6, L.k), 0, 33.5, PI / 2); j.root.scale.setScalar(.72); j.root.position.y = Math.abs(Math.sin(L.T * 9)) * 1.1; actuar(j, 0, [[0, { lLx: .3, lLk: 1.2, aLx: .4, aRx: .4, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(j, L.T);
  cm([0, 11, 38, 0, 0, 31.6, 40], [0, 9, 37, 0, 0, 31.8, 38], L.k); DOF = 0; }, [[0, 'impact', .4], [.2, 'jump_small', .5], [.6, 'jump_small', .5]]);
// 41 «und lauf dabei.»: los niños cantan la rima en corro mientras la comba gira (de frente, centrados)
shot(51.97, 'F', null, L => { gasse(L, { day: true }); const K = [benT, kumpel, MEY[2], DX[5]]; K.forEach((c, i) => { const a = i / 4 * 6.283 + L.T * .8; const x = Math.cos(a) * 4, z = 30 + Math.sin(a) * 4; put(c, x, 0, z, a + PI / 2); if (c === DX[5]) c.root.scale.setScalar(.72); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); talk(c, L.T, 51.9, 52.6, 'happy'); });
  orbit(V(0, 3, 30), 15, 0, .25, 44); sh(V(0, 0, 30), 20); }, [[0, 'flash', .3], [.1, 'kids_laugh', .5]]);
// 42 «Meine Schwester Lena»: de noche, Lena (sudadera, guantes) apoyada en el marco de la puerta del cuarto de Ben, brazos cruzados
shot(52.57, 'W', null, L => { benRoom(L); KZ.DOOR.rotation.y = -1.3; const l = put(lenaT, KZX + 13.6, 0, 2, -PI / 2 + .35); actuar(l, 0, [[0, { ...(GEST.cross || { aLx: 1.2, aRx: 1.2, aLe: 1.9, aRe: 1.9, aLz: -.5, aRz: -.5 }), lean: -.05, headZ: .1 }]], { T: L.T }); cara(l, L.T, { expr: 'smug' });
  onBody(l, 13, -.15, .08, 42, L.k, 11.5); badge('tag', 'LENA', W / 2, H * .2, clamp((L.lt - .5) / .2)); }, [[0, 'whoosh', .4], [.2, 'wood_creak', .4], [.5, 'pop', .4]]);
// 43 «lässt ihn mich jeden Abend»: Lena sentada al pie de la cama, el dedo índice levantado, le hace recitar
shot(53.56, 'S', null, L => { benRoom(L); sitBed(ben, KZX, L, { aLx: .3, aRx: .3 }); KZ.quilt.position.y = 4.6; const l = put(lenaT, KZX - 5.2, sitY(lenaT, 4.3), 3.4, -PI / 2 - .5); actuar(l, 0, [[0, { ...sitPose(), aRx: 2.3, aRe: .5, aRz: -.1, aLx: .4 }]], { T: L.T, weight: false }); talk(l, L.T, 53.5, 54.7, 'determined');
  cara(ben, L.T, { expr: 'bored', eyes: 'half' }); cm([KZX - 6.6, 8.6, -11.2, KZX - 6.2, 5, 1.6, 46], [KZX - 6.6, 8.4, -11, KZX - 6.2, 5, 1.6, 44], L.k); }, [[0, 'swipe', .4], [.3, 'tick', .4]]);
// 44 «aufsagen.»: Ben recita aburrido mirando al techo; la rima en un bocadillo
shot(54.78, 'C', 'punch', L => { benRoom(L); sitBed(ben, KZX, L, { aLx: .3, aRx: .3, headX: -.2 }); KZ.quilt.position.y = 4.6; talk(ben, L.T, 54.7, 55.5, 'bored'); bubble(ben, 'BIST DU WACH UM DREI…', clamp((L.lt - .1) / .2));
  onFace(ben, 5.6, 0, -.5, 40, L.k, 5); }, [[0, 'impact', .4], [.1, 'pop', .4]]);
// 45 «Seit ich vier bin.»: recuerdo en sepia: Ben pequeño (4) en la cama y Lena niña le enseña la rima con el dedo; «4»
shot(55.57, 'B', null, L => { benRoom(L); sepia(); withScale(ben, .5, () => { sitBed(ben, KZX, L, { aLx: .3, aRx: .3 }); talk(ben, L.T, 55.5, 56.6, 'happy'); }); KZ.quilt.position.y = 3.9;
  withScale(lenaT, .66, () => { const l = put(lenaT, KZX - 5.4, 0, -2, -PI / 2 - .2); actuar(l, 0, [[0, { aRx: 2.3, aRe: .5, aRz: -.1 }]], { T: L.T }); talk(l, L.T, 55.5, 56.6, 'happy'); });
  cm([KZX + 1, 7.4, 6, KZX - 7.4, 3.6, -3, 44], [KZX, 7.2, 5, KZX - 7.4, 3.6, -3, 42], L.k); bigNum('4', clamp((L.lt - .4) / .2), 'gold', .22, 1.2); }, [[0, 'soft_air', .4], [.2, 'film_roll', .4], [.45, 'pling', .4]]);
// 46 «Also reiße ich die Augen auf»: en la calle de noche, primerísimo plano: Ben abre los ojos de golpe (golpe de zoom)
shot(56.66, 'C', 'punch', L => { gasse(L, { z: 10 }); doorsOpen(); const b = sleepWalk(ben, L, 0, 10, PI, .6, 0, { face: false }); cara(ben, L.T, L.lt < .25 ? { eyes: 'half', mouth: 'flat' } : { eyes: 'wide', mouth: 'flat' });
  march(L, SL, 0, 15, PI, { cols: 3, speed: .6 }); onFace(b, 3.6, 0, 0, 38, L.k, 3); sh(V(0, 0, 10), 18); }, [[0, 'impact', .5], [.25, 'gasp', .5]]);
// 47 «und laufe mit.»: Ben sale de casa y se pone en la fila detrás de Mama y Papa, imitando el paso
shot(57.96, 'W', null, L => { gasse(L, { z: 0 }); doorsOpen(); sleepWalk(mama, L, 0, 4, PI, 2.2, 0); sleepWalk(papa, L, 4.4, 5, PI, 2.2, 1); sleepWalk(ben, L, 1.6, 10, PI, 2.4, 2, { ex: { eyes: 'wide' } }); march(L, SL.slice(0, 16), 0, 17, PI, { cols: 4, speed: 2.2 });
  const p = ben.root.position; orbit(V(p.x, 3.6, p.z - 1), lerp(15, 13, L.k), -1.1, .12, 44); sh(V(0, 0, p.z), 24); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 48 «Zum Berg hinter der Stadt.»: por detrás de la columna: la marcha sale del pueblo hacia el Berg con la boca de la mina iluminada al fondo (grúa)
shot(59.09, 'S', null, L => { gasse(L, { z: -150 }); doorsOpen(); march(L, SL, 0, -150, PI, { cols: 4, speed: 2.2, sz: 5 }); march(L, [ben, mama, papa], 0, -146, PI, { cols: 3, speed: 2.2 });
  cm([0, 14, -110, 0, 20, -360, 50], [0, 26, -118, 0, 26, -360, 50], L.k); sh(V(0, 0, -150), 60); }, [[0, 'swipe', .4], [.1, 'steps', .5], [.6, 'wind', .5]]);
// 49 «Ein Tunnel,»: la boca de la mina de frente, centrada: los sonámbulos entran en fila bajo el letrero
shot(60.52, 'C', 'punch', L => { mineOut(L); march(L, SL, STX, 28, PI, { cols: 3, speed: 2.4 }); cm([STX, 9, 62, STX, 13, 0, 46], [STX, 9, 56, STX, 13, 0, 46], L.k); sh(V(STX, 0, 20), 46); }, [[0, 'impact', .4], [.1, 'wind', .5], [.3, 'steps', .5]]);
// 50 «ein Haufen Schaufeln.»: el montón de palas a la entrada; manos que cogen una cada uno
shot(61.29, 'W', null, L => { tunnel(L, -10); march(L, SL.slice(4), STX + 2, -2, PI, { cols: 2, speed: 1.6 }); const c = put(SL[0], STX + 4, 0, -9, PI / 2); const k = clamp(L.lt / .6); actuar(c, 0, [[0, { aRx: lerp(.5, 1.3, k), aRe: .3, lean: .3 * (1 - k) }]], { T: L.T }); sleepFace(c, L.T); if (k > .7) c.shovel.visible = true;
  cm([STX + 1, 8, -2, STX + 7, 1.5, -10, 44], [STX + 1.4, 7.4, -3, STX + 7, 1.5, -10, 42], L.k); }, [[0, 'whoosh', .4], [.2, 'shovel', .6], [.6, 'click_metal', .5]]);
// 51 «Jeder nimmt eine»: un sonámbulo saca una pala del montón y se la apoya en el hombro, ojos abiertos (centrado)
shot(62.45, 'C', null, L => { tunnel(L, -10); const c = put(SL[5], STX + 3, 0, -6, PI / 2 + .6); const k = clamp(L.lt / .5); c.shovel.visible = true; c.shovel.rotation.set(lerp(1.6, .3, k), 0, 0); actuar(c, 0, [[0, { aRx: lerp(.6, 1.9, k), aRe: lerp(.2, 1.6, k), aRz: -.1 }]], { T: L.T }); sleepFace(c, L.T);
  march(L, SL.slice(10), STX - 2, -2, PI, { cols: 2, speed: 1.6 }); onBody(c, 12, .1, .06, 42, L.k, 10.4); }, [[0, 'shovel', .6], [.4, 'cloth', .4]]);
// 52 «und gräbt.»: el túnel en profundidad: filas de sonámbulos cavando a la vez, la tierra vuela
shot(63.15, 'F', null, L => { tunnel(L, -40); diggers(L, SL, -20, [-7, -2.5, 2.5, 7]); cm([STX, 13, 2, STX, 4, -50, 46], [STX, 12, -4, STX, 4, -54, 46], L.k); sh(V(STX, 0, -40), 46); dust(V(STX, 0, -26), L.t0 + .1, L.T, 10, .6); }, [[0, 'flash', .3], [.1, 'shovel', .6], [.4, 'shovel', .5], [.7, 'rubble', .4]]);
// 53 «Die Kinder am schnellsten.»: los niños cavan rapidísimo; la tierra salta detrás de ellos
shot(64.12, 'C', 'punch', L => { tunnel(L, -84); const K = SL.filter(c => c.kid); K.forEach((c, i) => { put(c, STX - 5 + i * 3.4, 0, -84 - (i % 2) * 2, PI); dig(c, L, i, { sp: 2.6 }); }); dust(V(STX, 0, -84), L.t0, L.T, 14, .5);
  diggers(L, SL.filter(c => !c.kid), -96); orbit(V(STX, 3.2, -84), lerp(14, 12, L.k), PI + .15, .12, 44); sh(V(STX, 0, -86), 24); }, [[0, 'impact', .4], [.05, 'shovel', .6], [.25, 'shovel', .6], [.45, 'shovel', .6], [.65, 'shovel', .6]]);
// 54 «Keiner weiß, warum.»: primer plano de una niña cavando con la mirada vacía; «?»
shot(65.39, 'W', null, L => { tunnel(L, -84); const c = put(SL.filter(c => c.kid)[1], STX, 0, -84, PI); dig(c, L, 0, { sp: 2.2 }); diggers(L, SL, -92);
  onBody(c, 9, 0, .1, 40, L.k, 8, 0, 2.6); badge('q', '?', W / 2 + 150, H * .3, clamp((L.lt - .3) / .2)); }, [[0, 'whoosh', .4], [.1, 'shovel', .5], [.4, 'creepy_ting', .5]]);
// 55 «Mich bemerkt keiner.»: Ben cava entre los mayores con los ojos abiertos; un guardia con farol pasa por detrás sin fijarse
shot(66.58, 'S', null, L => { tunnel(L, -80); put(ben, STX, 0, -80, PI); dig(ben, L, 0, { face: false }); cara(ben, L.T, { eyes: 'wide', mouth: 'flat' }); diggers(L, SL, -76, [-6, -3, 6], { avoid: [[0, -80]] });
  guardWalk(WA[0], L, STX + 8, -70, PI, 3, 0); onBody(ben, 10, PI * 0 + .5, .1, 42, L.k, 9, .6, 2.8); sh(V(STX, 0, -80), 24); }, [[0, 'swipe', .4], [.1, 'shovel', .5], [.3, 'steps', .5]]);
// 56 «Ich bin der Anstarr-Champion»: el patio del colegio: Ben y un compañero se miran cara a cara sin parpadear; los niños alrededor; el otro parpadea
shot(67.71, 'C', 'punch', L => { schulS(L); const b = put(benT, SCX - 2, 0, 0, PI / 2), k = put(kumpel, SCX + 2, 0, 0, -PI / 2); actuar(b, 0, [[0, { lean: .25, aLx: .2, aRx: .2 }]], { T: L.T }); actuar(k, 0, [[0, { lean: .25 }]], { T: L.T });
  cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); cara(k, L.T, L.lt > .9 ? { eyes: 'closed', mouth: 'grimace' } : { eyes: 'wide', mouth: 'grimace', noBlink: true }); if (L.lt > .9) blinkFX(k, (L.lt - .9) / .3);
  crowdAt(L, SCX, 0, 6, 6, 9, 4, { list: DX, mode: 'point', expr: 'gasp', gap: 1.7 }); cm([SCX, 5.4, 12, SCX, 4.6, 0, 40], [SCX, 5.2, 10, SCX, 4.6, 0, 38], L.k); sh(V(SCX, 0, 0), 20); POST.push(() => DX.forEach(c => { if (c.root.visible) c.root.scale.setScalar(.72); })); },
  [[0, 'impact', .4], [.1, 'kids_laugh', .3], [.9, 'blink', .6]]);
// 57 «der ganzen Schule.»: Ben levanta la copa con un ojo dibujado; los niños aplauden, confeti
shot(69.01, 'F', null, L => { schulS(L); const b = put(benT, SCX, 0, 0, 0); const t = attach(TROPHY, b.aR.hand, [0, -.6, .3], [-PI / 2, 0, 0], .55); actuar(b, 0, [[0, { aRx: 2.9, aRe: .2, aRz: -.1, aLx: 1.0, aLz: .6 }]], { T: L.T }); t.rotation.x = -PI / 2 + 2.9 - .3; laughF(b, L.T);
  crowdAt(L, SCX, 0, 7, 6, 10, 5, { list: DX, mode: i => ['cheer', 'clap'][i % 2] }); POST.push(() => DX.forEach(c => { if (c.root.visible) c.root.scale.setScalar(.72); })); confetti(V(SCX, 2, 0), L.t0, L.T, 40);
  onBody(b, 13, 0, .1, 44, L.k, 11, 0, 3.4); sh(V(SCX, 0, 0), 20); }, [[0, 'flash', .3], [.1, 'cheer', .5], [.2, 'confetti', .5]]);
// 58 «Nur Lena schlägt mich.»: en la mesa de la cena, Ben y Lena se miran; a Ben se le llenan los ojos de lágrimas, parpadea; Lena sonríe
shot(70.2, 'W', null, L => { const [b, l] = stareTable(L); cara(b, L.T, L.lt > .8 ? { eyes: 'closed', mouth: 'grimace' } : { eyes: 'wide', mouth: 'grimace', noBlink: true }); if (L.lt > .5 && L.lt < .8) tears(b, L.T); if (L.lt > .8) blinkFX(b, (L.lt - .8) / .3);
  cara(l, L.T, L.lt > .9 ? { expr: 'smug' } : { eyes: 'wide', mouth: 'smirk', noBlink: true }); cm([KUX + 5.2, 7.6, 11, KUX + 3.4, 5.8, -5.6, 40], [KUX + 5, 7.4, 10, KUX + 3.4, 5.8, -5.6, 38], L.k); }, [[0, 'whoosh', .4], [.6, 'tick', .4], [.8, 'blink', .6], [.95, 'laugh_deep', .3]]);
// 59 «Sie ist fünfzehn»: primer plano de Lena, aburrida, auriculares fuera; «15»
shot(71.58, 'C', 'punch', L => { const [b, l] = stareTable(L); cara(l, L.T, { expr: 'bored' }); onFace(l, 5, 0, 0, 40, L.k, 4.4); bigNum('15', clamp((L.lt - .2) / .2), 'gold', .22, 1.2); }, [[0, 'impact', .4], [.2, 'pling', .4]]);
// 60 «und hasst mich.»: Lena pone los ojos en blanco, se cruza de brazos y gira la cara; Ben baja la mirada
shot(72.58, 'S', null, L => { const [b, l] = stareTable(L); const k = clamp(L.lt / .4); actuar(l, 0, [[0, { ...sitPose(), aLx: 1.2, aRx: 1.2, aLe: 1.9, aRe: 1.9, aLz: -.5, aRz: -.5, headY: .7 * k }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'bored', eyes: L.lt < .4 ? 'up' : 'half' }); cara(b, L.T, { expr: 'sad' });
  onFace(l, 6.4, 0, 1, 42, L.k, 5.6); }, [[0, 'swipe', .4], [.2, 'sigh', .5]]);
// 61 «Sie klaut meine Fanta.»: Lena le quita la Fanta de la mano a Ben, da un trago y se va; Ben estira el brazo
shot(73.5, 'W', null, L => { kitchen(L); const b = put(benT, KUX + 2, 0, 3, -PI / 2 + .3); const k = clamp(L.lt / .35); const l = put(lenaT, KUX - 1 - k * 1.5 + clamp(L.lt - .5) * -3, 0, 3.4, PI / 2 - .2);
  const f = attach(FANTA[0], k < .5 ? b.aR.hand : l.aR.hand, [0, -.5, .45], [PI / 2, 0, 0], .6); actuar(b, 0, [[0, { aRx: 1.5, aRe: .2 }]], { T: L.T }); cara(b, L.T, { expr: k > .5 ? 'angry' : 'happy', mouth: k > .5 ? 'o' : 'smile' });
  actuar(l, 0, [[0, { aRx: k > .5 ? 2.4 : 1.5, aRe: k > .5 ? .5 : .2, aRz: -.3 }]], { T: L.T }); cara(l, L.T, { expr: 'smug' });
  cm([KUX + .5, 7, 15, KUX + .5, 5, 3, 42], [KUX + .5, 7, 13.5, KUX + .5, 5, 3, 40], L.k); }, [[0, 'whoosh', .4], [.15, 'swipe', .5], [.5, 'gulp', .5]]);
// 62 «Sie trägt immer Handschuhe,»: primer plano de las manos de Lena con guantes de punto verdes, sujetando una cuchara
shot(74.76, 'C', 'punch', L => { kitchen(L); const l = sit(lenaT, KUX + 3.4, 2.8, 5.6, PI, L, {}); actuar(l, 0, [[0, { ...sitPose(), aLx: 1.2, aRx: 1.2, aLe: .9, aRe: .9, aLz: -.1, aRz: -.1, lean: .2 }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'bored' });
  l.root.updateMatrixWorld(true); const h = l.aR.hand.getWorldPosition(V(0, 0, 0)); cm([h.x + 3, h.y + 2.6, h.z - 5, h.x - .8, h.y - .2, h.z, 40], [h.x + 2.6, h.y + 2.2, h.z - 4.2, h.x - .8, h.y - .2, h.z, 38], L.k); }, [[0, 'impact', .4], [.2, 'cloth', .5]]);
// 63 «sogar beim Frühstück.»: desayuno: todos comen; Lena con los guantes puestos come cereales
shot(76.06, 'W', null, L => { kitchen(L); const l = sit(lenaT, KUX + 3.4, 2.8, 5.6, PI, L, {}); const sp = Math.sin(L.T * 5); actuar(l, 0, [[0, { ...sitPose(), aRx: 1.3 + sp * .4, aRe: 1.2 + sp * .5, aLx: .6, aLe: .9, lean: .15 }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'bored' });
  const m = sit(mama, KUX - 3.4, 2.8, -5.6, 0, L, { aRx: .9, aRe: 1.2 }); cara(m, L.T, { expr: 'happy' }); const p = sit(papa, KUX - 3.4, 2.8, 5.6, PI, L, { aRx: .9, aRe: 1.2 }); cara(p, L.T, { expr: 'neutral' });
  const b = sit(benT, KUX + 3.4, 2.8, -5.6, 0, L, { aRx: .9, aRe: 1.2 }); cara(b, L.T, { expr: 'happy' }); for (let i = 0; i < 4; i++) show(PLATE[i], KUX + [3.4, -3.4, -3.4, 3.4][i], 4.75, [2.4, -2.4, 2.4, -2.4][i]);
  cm([KUX, 15.6, 6, KUX, 3, 0, 64], [KUX, 15.4, 5.4, KUX, 3, 0, 62], L.k); }, [[0, 'swipe', .4], [.1, 'spoon', .5], [.5, 'chew', .4]]);
// 64 «Und für Guten Morgen»: Mama la saluda con la mano: «GUTEN MORGEN!»
shot(77.27, 'C', 'punch', L => { kitchen(L); const m = sit(mama, KUX - 3.4, 2.8, -5.6, 0, L, {}); actuar(m, 0, [[0, { ...sitPose(), aRx: 2.6, aRz: Math.sin(L.T * 12) * .3 + .2, aRe: .3 }]], { T: L.T, weight: false }); talk(m, L.T, 77.2, 78, 'happy'); bubble(m, 'GUTEN MORGEN!', clamp(L.lt / .2));
  onFace(m, 6, 0, 0, 40, L.k, 5.2); }, [[0, 'impact', .4], [.1, 'pop', .4]]);
// 65 «ist sie zu müde.»: Lena deja caer la cabeza sobre la mesa, bosteza, ojos medio cerrados
shot(78.01, 'S', null, L => { kitchen(L); const l = sit(lenaT, KUX + 3.4, 2.8, 5.6, PI, L, {}); const k = easeIn(clamp(L.lt / .5)); actuar(l, 0, [[0, { ...sitPose(), lean: .7 * k, headX: .3 * k, aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3 }]], { T: L.T, weight: false });
  cara(l, L.T, k < 1 ? { expr: 'yawn', eyes: 'closed', mouth: 'yawn' } : { expr: 'tired', eyes: 'half' }); onFace(l, 6.4, 1.4, 1.2, 42, L.k, 5.6); }, [[0, 'swipe', .4], [.1, 'yawn_f', .6], [.6, 'thud', .4]]);
// 66 «Mit mir macht sie nur eins:»: por la noche, Lena se señala los ojos con dos dedos y luego a Ben: «te vigilo»
shot(79.01, 'W', null, L => { const [b, l] = stareTable(L); const k = clamp(L.lt / .45); actuar(l, 0, [[0, { ...sitPose(), aRx: 2.0 + (k < 1 ? .4 : 0), aRe: k < 1 ? 1.8 : .3, aRz: -.2, lean: .2 }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'sus' }); cara(b, L.T, { expr: 'gasp' });
  onFace(l, 6, 0, .8, 40, L.k, 5.4); }, [[0, 'whoosh', .4], [.4, 'swipe', .4]]);
// 67 «nur eins:» → Ben traga saliva y se prepara, se frota las manos
shot(79.95, 'C', null, L => { const [b, l] = stareTable(L); const r = Math.sin(L.T * 14) * .15; actuar(b, 0, [[0, { ...sitPose(), aLx: 1.3, aRx: 1.3, aLe: 1.4, aRe: 1.4, aLz: -.3 + r, aRz: -.3 - r, lean: .2 }]], { T: L.T, weight: false }); cara(b, L.T, { expr: 'determined' });
  onFace(b, 5.4, 0, -.6, 40, L.k, 4.8); }, [[0, 'gulp', .6], [.3, 'cloth', .5]]);
// 68 «Anstarren.»: plano partido: los ojos de Lena y los de Ben, enormes (golpe de zoom)
shot(80.91, 'C', 'punch', L => { const [b, l] = stareTable(L); cara(l, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true });
  onFace(l, 3.4, 0, 0, 34, L.k, 2.8); }, [[0, 'impact', .5], [.1, 'braam_short', .5]]);
// 69 «Jeden Abend.»: la mesa entera desde arriba: los padres comen tranquilos y los dos hermanos se miran fijamente
shot(81.64, 'W', null, L => { const [b, l] = stareTable(L); cara(l, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true });
  const m = sit(mama, KUX - 3.4, 2.8, -5.6, 0, L, { aRx: .9 + Math.sin(L.T * 5) * .3, aRe: 1.2 }); cara(m, L.T, { expr: 'happy' }); const p = sit(papa, KUX - 3.4, 2.8, 5.6, PI, L, { aRx: .9, aRe: 1.2 }); cara(p, L.T, { expr: 'neutral' });
  for (let i = 0; i < 4; i++) show(PLATE[i], KUX + [3.4, -3.4, -3.4, 3.4][i], 4.75, [2.4, -2.4, 2.4, -2.4][i]); cm([KUX, 15.6, 7, KUX, 3, 0, 64], [KUX, 15.4, 6.4, KUX, 3, 0, 62], L.k); }, [[0, 'whoosh', .4], [.2, 'clock_tick', .4]]);
// 70 «Der Verlierer»: Ben parpadea (pierde); Lena levanta el puño
shot(82.62, 'C', 'punch', L => { const [b, l] = stareTable(L); cara(b, L.T, L.lt > .2 ? { eyes: 'closed', mouth: 'grimace' } : { eyes: 'wide', mouth: 'grimace' }); blinkFX(b, (L.lt - .2) / .3);
  actuar(l, 0, [[0, { ...sitPose(), aRx: 2.8, aRe: 1.8, aRz: -.2 }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'joy' }); cm([KUX + 5.4, 7.8, 11, KUX + 3.4, 5.8, -5.6, 42], [KUX + 5.2, 7.6, 10, KUX + 3.4, 5.8, -5.6, 40], L.k); }, [[0, 'blink', .6], [.25, 'cheer', .3]]);
// 71 «bringt den Müll raus.»: Lena señala el cubo de basura; Ben suspira
shot(83.38, 'S', null, L => { kitchen(L, { night: true }); const l = put(lenaT, KUX - 6, 0, 5.4, -PI / 2 - .2); actuar(l, 0, [[0, { aRx: 1.6, aRz: .1, aRe: .1 }]], { T: L.T }); cara(l, L.T, { expr: 'smug' });
  const b = put(benT, KUX - 8, 0, 8.5, PI - .5); actuar(b, 0, [[0, { lean: .15, headX: .3, aLz: .1, aRz: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'sad', mouth: 'wavy' });
  cm([KUX + 4, 7.5, 3, KUX - 8, 4.5, 6, 46], [KUX + 3, 7.4, 3.4, KUX - 8, 4.5, 6, 44], L.k); }, [[0, 'swipe', .4], [.3, 'sigh', .5]]);
// 72 «Ich bringe ihn raus,»: Ben arrastra una bolsa de basura enorme por la calle al anochecer hasta los cubos
shot(84.38, 'W', null, L => { gasse(L, { dawn: true }); const b0 = MT.BINS[0].position; const b = put(benT, b0.x - 6 + L.lt * 2.2, 0, b0.z + 4, PI / 2 + .3); const bg = attach(BAG, b.aR.hand, [0, -.6, -1.4], [0, 0, 0], .8); actuar(b, 0, [[0, { ...walkP(L.T * .7, 0), aRx: -.4, aRe: 0, lean: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'tired' });
  cm([b0.x - 16, 6.4, b0.z + 9, b0.x - 4, 4, b0.z + 3, 44], [b0.x - 15, 6.2, b0.z + 8, b0.x - 3, 4, b0.z + 3, 42], L.k); sh(V(b0.x - 4, 0, b0.z), 20); }, [[0, 'whoosh', .4], [.1, 'cloth', .5], [.5, 'steps', .4]]);
// 73 «seit ich vier bin.»: tira la bolsa al cubo (¡pum!) y suspira; «4»
shot(85.48, 'C', 'punch', L => { gasse(L, { dawn: true }); const b0 = MT.BINS[0].position; const b = put(benT, b0.x - 3, 0, b0.z + 1, PI / 2 - .2); const k = clamp(L.lt / .4); show(BAG, lerp(b0.x - 1.8, b0.x, k), lerp(3, 4.2, k) + Math.sin(k * PI) * 2, b0.z, 0, .8);
  actuar(b, 0, [[0, { aRx: lerp(.5, 2.4, k), aLx: lerp(.5, 2.2, k), aRe: .4, aLe: .4 }]], { T: L.T }); cara(b, L.T, { expr: 'tired', mouth: 'wavy' }); bigNum('4', clamp((L.lt - .4) / .2), 'gold', .22, 1.2);
  cm([b0.x - 12, 6.4, b0.z + 7, b0.x - 2, 4, b0.z + 1, 44], [b0.x - 11, 6.2, b0.z + 6.4, b0.x - 2, 4, b0.z + 1, 42], L.k); sh(V(b0.x, 0, b0.z), 20); }, [[.35, 'trash_hit', .6], [.5, 'sigh', .5], [.45, 'pling', .3]]);
// 74 «Dann, letzten Monat,» (zoom lento): el túnel, todos cavando en silencio; la cámara avanza despacio
shot(86.57, 'B', 'slow', L => { tunnel(L, -100); diggers(L, SL, -92, [-6, -2, 2, 6], { avoid: [[0, -106]] }); put(brandt, STX, 0, -106, PI); dig(brandt, L, 3); put(ben, STX + 1, 0, -100, PI); dig(ben, L, 1, { face: false }); cara(ben, L.T, { eyes: 'wide', mouth: 'flat' });
  cm([STX + 2, 9, -84, STX, 4, -106, 46], [STX + 1.6, 8, -90, STX, 4, -106, 44], L.k); sh(V(STX, 0, -100), 30); }, [[0, 'soft_air', .3], [.1, 'shovel', .4], [.6, 'shovel', .4]]);
// 75 «wacht Herr Brandt auf.»: Herr Brandt (gorro azul de dormir) deja de cavar, parpadea y mira a su alrededor
shot(87.69, 'C', 'punch', L => { tunnel(L, -106); const c = put(brandt, STX, 0, -106, PI - .3); const k = clamp(L.lt / .4); c.shovel.visible = true; c.shovel.rotation.set(.25, 0, 0); actuar(c, 0, [[0, { ...digPose(0, 0), lean: lerp(.4, 0, k), crouch: lerp(.3, 0, k), headY: k > .8 ? Math.sin(L.T * 4) * .4 : 0 }]], { T: L.T });
  cara(c, L.T, L.lt < .35 ? { eyes: 'wide', mouth: 'flat' } : L.lt < .5 ? { eyes: 'closed', mouth: 'flat' } : { expr: 'confused' }); blinkFX(c, (L.lt - .35) / .3); diggers(L, SL, -112, [-6, 6]);
  c.root.rotation.y = 0; onFace(c, 6, 0, 0, 40, L.k, 5); }, [[0, 'impact', .4], [.35, 'blink', .6], [.6, 'gasp_old', .5]]);
// 76 «Direkt vor mir.»: por encima del hombro de Ben: Brandt justo delante; Ben se queda helado
shot(89.06, 'W', null, L => { tunnel(L, -104); const c = put(brandt, STX, 0, -108, 0); actuar(c, 0, [[0, { headY: Math.sin(L.T * 5) * .4, aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' }); c.shovel.visible = true;
  put(ben, STX + .8, 0, -101, PI); ben.shovel.visible = true; actuar(ben, 0, [[0, { aRx: .6, aLx: .6, aLe: .4, aRe: .4, ...shiver(L.T, .6) }]], { T: L.T }); diggers(L, SL, -112, [-6, 6]);
  cm([STX + 3.2, 8.4, -96, STX - .2, 5.4, -108, 42], [STX + 2.8, 8.2, -97, STX - .2, 5.4, -108, 40], L.k); }, [[0, 'swipe', .4], [.2, 'heartbeat', .6]]);
// 77 «Er lässt die Schaufel fallen:»: la pala cae al suelo y rebota (clang)
shot(90.08, 'C', 'punch', L => { tunnel(L, -106); const c = put(brandt, STX, 0, -108, 0); actuar(c, 0, [[0, { aLx: .7, aRx: .7, aLe: .3, aRe: .3, aLz: .3, aRz: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock' });
  const k = clamp(L.lt / .35); const s = show(LOOSE[0], STX + 1.2, lerp(3.4, .3, easeIn(k)) + (k >= 1 ? Math.abs(Math.sin((L.lt - .35) * 14)) * .4 * Math.exp(-(L.lt - .35) * 6) : 0), -105, 0); s.rotation.set(0, .4, lerp(.2, PI / 2 - .05, easeIn(k)));
  cm([STX + 4, 2.6, -100.5, STX + 1, 1.2, -105, 40], [STX + 3.6, 2.4, -101, STX + 1, 1.2, -105, 38], L.k); }, [[.33, 'boing_metal', .7], [.45, 'clack', .5]]);
// 78 «Wo bin ich?»: Brandt, desorientado, levanta las manos y gira sobre sí mismo; bocadillo
shot(91.47, 'W', null, L => { tunnel(L, -106); const c = put(brandt, STX, 0, -108, Math.sin(L.T * 2) * .6); actuar(c, 0, [[0, GEST.shrug || { aLx: .8, aRx: .8, aLz: .6, aRz: .6, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); talk(c, L.T, 91.4, 92.3, 'confused'); bubble(c, 'WO BIN ICH?', clamp(L.lt / .2));
  diggers(L, SL, -114, [-6, -2.5, 2.5, 6]); onBody(c, 12, 0, .1, 42, L.k, 10); sh(V(STX, 0, -108), 24); }, [[0, 'whoosh', .4], [.1, 'gasp_old', .5]]);
// 79 «Zwei Leute drehen sich um»: más adelante, dos figuras con farol (el panadero y Herr Krause) se dan la vuelta despacio
shot(92.33, 'S', null, L => { tunnel(L, -116); const k = easeInOut(clamp(L.lt / .9)); const a = put(baecker, STX - 2.2, 0, -116, lerp(PI, 0, k)), b = put(krause, STX + 2.4, 0, -116.6, lerp(PI, 0, k)); lanternUp(a, L, .3, { light: false }); lanternUp(b, L, .3); cara(a, L.T, { expr: 'sus' }); cara(b, L.T, { expr: 'sus' });
  const c = put(brandt, STX, 0, -109, PI); cara(c, L.T, { expr: 'confused' }); cm([STX, 7, -100, STX, 5, -116, 42], [STX, 6.8, -102, STX, 5, -116, 40], L.k); }, [[0, 'swipe', .4], [.3, 'metal_creak', .4], [.6, 'creepy_ting', .5]]);
// 80 «und führen ihn»: cada uno le agarra de un brazo
shot(93.55, 'C', 'punch', L => { tunnel(L, -110); const c = put(brandt, STX, 0, -110, PI / 4); actuar(c, 0, [[0, { aLz: .6, aRz: .6, aLx: .2, aRx: .2, lean: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' });
  const a = put(baecker, STX - 2.6, 0, -109, PI / 4 + .6), b = put(krause, STX + 2.6, 0, -111.4, PI / 4 - .6); actuar(a, 0, [[0, { aRx: 1.2, aRe: .3, aRz: -.4 }]], { T: L.T }); actuar(b, 0, [[0, { aLx: 1.2, aLe: .3, aLz: -.4 }]], { T: L.T }); lanternUp(b, L, .2); cara(a, L.T, { expr: 'angry' }); cara(b, L.T, { expr: 'angry' });
  onBody(c, 13, 0, .1, 42, L.k, 11.5); }, [[0, 'impact', .4], [.1, 'cloth', .6], [.3, 'tug', .4]]);
// 81 «in einen Seitentunnel.»: plano general: se lo llevan hacia la boca oscura del túnel lateral
shot(94.51, 'W', null, L => { tunnel(L, -116); const ry = -2.36, d = L.lt * 3, sx = Math.sin(ry), sz = Math.cos(ry); const c = put(brandt, STX - 2 + sx * d, 0, -108 + sz * d, ry); actuar(c, 0, [[0, { ...walkP(L.T, 0), aLz: .5, aRz: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' });
  const a = put(baecker, c.root.position.x + 1.9, 0, c.root.position.z - 1.9, ry), b = put(krause, c.root.position.x - 1.9, 0, c.root.position.z + 1.9, ry); [a, b].forEach((g, i) => { actuar(g, 0, [[0, walkP(L.T, i + 1)]], { T: L.T }); g.lantern.visible = true; }); lanternUp(b, L, .2);
  diggers(L, SL, -100, [3, 7]); cm([STX + 9, 9, -98, STX - 8, 5, -118, 46], [STX + 8, 9, -100, STX - 9, 5, -119, 44], L.k); sh(V(STX - 6, 0, -114), 30); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 82 «Ins Dunkle.»: las tres siluetas desaparecen en la oscuridad del túnel lateral; el farol se aleja
shot(95.61, 'F', null, L => { tunnel(L, -120); const d = 2 + L.lt * 3; const c = put(brandt, STX - 13 - d, 0, -120, -PI / 2); actuar(c, 0, [[0, walkP(L.T, 0)]], { T: L.T }); const a = put(baecker, STX - 13 - d, 0, -122, -PI / 2), b = put(krause, STX - 13 - d, 0, -118, -PI / 2); [a, b].forEach((g, i) => actuar(g, 0, [[0, walkP(L.T, i + 1)]], { T: L.T })); lanternUp(b, L, .1, { k: 22 });
  cm([STX - 2, 6, -120, STX - 20, 5, -120, 44], [STX - 3, 6, -120, STX - 20, 5, -120, 42], L.k); }, [[0, 'flash', .3], [.1, 'steps', .5], [.5, 'wind', .5]]);
// 83 «Er kam nie wieder raus.» (zoom lento): la boca vacía y oscura; en el suelo, el gorro de dormir azul de Brandt
shot(96.45, 'B', 'slow', L => { tunnel(L, -120); show(CAPF, STX - 11, 0, -119, .4, 1.1); cm([STX - 1, 5, -114, STX - 14, 2, -120, 44], [STX - 4, 4, -117, STX - 14, 1.5, -120, 40], L.k); }, [[0, 'soft_air', .3], [.2, 'sad_tone', .4]]);
