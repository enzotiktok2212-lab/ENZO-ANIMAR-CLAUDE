// ---------- b: colegio, Mats, la espera, los golpes y la mirilla (50,15 – 106,31 s) ----------
// Clase (KLX): puerta con ventanita en x = KLX - 19,6, z = 8; pasillo detrás (x < KLX - 20). Pupitres en x = -11/0/11, z = -2/6/14.
const KD = V(KLX - 19.6, 0, 8);
const kidsAt = (L, list, mode = 'shout', y = 0) => list.forEach(([x, z, ry, i, m]) => { const c = put(KIDS[i], KLX + x, y, z, ry); const mm = m || mode;
  if (mm === 'shout') { actuar(c, 0, [[0, { aRx: 2.3, aRz: .25, aRe: .4, aLx: .5, lean: -.08 + Math.sin(L.T * 9 + i) * .03 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shout', mouth: 'talk_wide' }); }
  else if (mm === 'sit') { sit(c, KLX + x, 3.3, z, ry, L, { aLx: .9, aRx: .9, aLe: 1.4, aRe: 1.4, headY: Math.sin(L.T + i) * .3 }); cara(c, L.T + i, { expr: 'neutral' }); }
  else if (mm === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = j * .4; actuar(c, 0, [[0, { ...GEST.cheer, aLz: .45 + j * .2 }]], { T: L.T }); laughF(c, L.T + i); }
  else if (mm === 'look') { actuar(c, 0, [[0, { headY: .3, lean: .05 }]], { T: L.T }); cara(c, L.T + i, { expr: 'sus' }); } });
const pohlMask = (c, on = 1) => { if (!on) return; attach(MASK, c.head, [0, -.04, .02], [0, 0, 0], 1.04); };
// ---- 33 «In der Schule machen wir Türübungen.»: clase: el cartel TÜRÜBUNG junto a la puerta; una niña lo señala, los demás repasan las reglas
shot(50.15, 'F', null, L => { schule(L); show(DRILL, KLX - 19.4, 9.5, 1.2, PI / 2); kidsAt(L, [[-11, -2, -.7, 0, 'sit'], [0, -2, -.4, 1, 'sit'], [-11, 6, -.8, 3, 'sit'], [0, 6, -.6, 4, 'sit']]);
  const g = put(KIDS[2], KLX - 15, 0, 3, -PI / 2 - .5); actuar(g, L.lt, [[0, 'idle'], [.2, 'point', { dur: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'determined', mouth: Math.sin(L.T * 9) > 0 ? 'talk' : 'flat' });
  cm([KLX + 4, 9, 14, KLX - 16, 7, 3, 46], [KLX + 1, 8.6, 12, KLX - 16, 7, 3, 46], L.k); }, [[0, 'classroom', .5], [.3, 'chalk', .3]]);
// ---- 34 «Herr Pohl klopft an unsere Klassentür,»: por la ventanita de la puerta: Herr Pohl llama; la puerta tiembla
shot(51.88, 'W', null, L => { schule(L); const p = put(pohl, KD.x - 3, 0, KD.z - .4, PI / 2); actuar(p, 0, [[0, knockP(L.T, 0, 3)]], { T: L.T }); pohlMask(p, 1); KDOOR.position.x = KD.x + rattle(L, .05, 3, 3, .06);
  kidsAt(L, [[-11, 6, -1.2, 0, 'look'], [-11, -2, -1.2, 5, 'look']]); cm([KLX - 7, 8, 13, KD.x, 7.2, KD.z, 44], [KLX - 9, 7.8, 12, KD.x, 7.2, KD.z, 44], L.k); }, [[0, 'knock', .8], [.33, 'knock', .8], [.66, 'knock', .8]]);
// ---- 35 «mit einer Gummimaske von unserer Rektorin.»: primer plano a través del cristal: la máscara de goma de la Rektorin (moño gris), saluda despacio
shot(53.42, 'C', 'punch', L => { schule(L); const p = put(pohl, KD.x - 2.4, 0, KD.z, PI / 2); actuar(p, 0, [[0, { ...GEST.wave, aRz: .4 + Math.sin(L.T * 3) * .3, headZ: Math.sin(L.T * 1.5) * .15 }]], { T: L.T }); pohlMask(p, 1);
  const h = hp(p); cam([KD.x + 4.6, h.y + .6, KD.z + .4], [h.x, h.y + .2, h.z], 38); badge('tag', 'REKTORIN', W / 2, H * .17, (L.lt - .5) / .2); }, [[.1, 'creepy_ting', .5], [.5, 'pop', .3]]);
// ---- 36 «Und achtundzwanzig Kinder brüllen:»: toda la clase de pie, gritando hacia la puerta; «28»
shot(55.44, 'S', null, L => { schule(L); kidsAt(L, [[-5.5, 0, -PI / 2 + .2, 0], [-5.5, 4, -PI / 2, 1], [-5.5, 9, -PI / 2 - .2, 2], [5.5, 1, -PI / 2 + .15, 3], [5.5, 6, -PI / 2, 4], [5.5, 11, -PI / 2 - .15, 5], [-14, 10, -PI / 2 - .3, 6], [-14, 1, -PI / 2 + .3, 7]]);
  bigNum('28', (L.lt - .2) / .2, 'gold', .17, 1.3); cm([KLX - 18, 8.4, 5, KLX + 2, 5.6, 5, 54], [KLX - 18, 8, 5.6, KLX + 2, 5.6, 5.6, 54], L.k); }, [[0, 'cheer', .6], [.3, 'shout_m', .4]]);
// ---- 37 «„Das Wort?“»: golpe de zoom a tres niños gritando
shot(57.28, 'C', 'punch', L => { schule(L); kidsAt(L, [[-13.5, 3, -PI / 2 + .25, 2], [-12.5, 6.5, -PI / 2 - .1, 1], [-13, 10, -PI / 2 - .35, 0]]); bigNum('DAS WORT?', (L.lt - .02) / .12, 'red', .18, 1); SHAKE = .4;
  cm([KLX - 19, 6.4, 6.5, KLX - 12, 6, 6.5, 44], [KLX - 18.6, 6.4, 6.5, KLX - 12, 6, 6.5, 44], L.k); }, [[0, 'cheer', .8]]);
// ---- 38 «Reingekommen ist er noch nie.»: en el pasillo, Herr Pohl se quita la máscara, suspira y se va encogido de hombros
shot(57.8, 'W', null, L => { schule(L); const p = put(pohl, KD.x - 3.2 - L.lt * 1.2, 0, KD.z - 1, -PI / 2 - .6); const off = L.lt > .5; actuar(p, L.lt, [[0, { aRx: 2.2, aRe: 1.6 }], [.5, 'shrug', { dur: .3 }]], { T: L.T });
  if (!off) pohlMask(p, 1); else { attach(MASK, p.aR.hand, [0, -1.2, .3], [PI, 0, 0], .9); cara(p, L.T, { expr: 'sad', mouth: 'frown' }); } badge('tag', 'NOCH NIE', W / 2, H * .2, (L.lt - 1.0) / .2);
  cm([KD.x - 3, 7.4, KD.z - 10, KD.x - 4, 6, KD.z - 1, 46], [KD.x - 2, 7.2, KD.z - 9, KD.x - 5, 6, KD.z - 1, 46], L.k); }, [[0, 'rip', .4], [.5, 'sigh', .6], [.9, 'steps', .4]]);
// ---- 39 «Ich bin Mats.»: en su cuarto, Mats se gira hacia la cámara y saluda; etiqueta MATS
shot(59.55, 'Z', null, L => { zimmer(L, false); const c = put(mats, KZX - 2, 0, 1, -.6 + easeOut(clamp(L.lt / .3)) * .6); actuar(c, L.lt, [[0, 'idle'], [.1, 'wave', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  badge('tag', 'MATS', W / 2, H * .18, (L.lt - .1) / .2); onBody(c, 15, 0, .08, 42, L.k, 13); }, [[0, 'whoosh', .4], [.1, 'pop', .4]]);
// ---- 40 «Ich bin zwölf.»: sopla las 12 velas de su tarta en la cocina; «12»
shot(60.35, 'C', null, L => { kuecheS(L); const c = put(mats, KUX, 0, -7.6, 0); actuar(c, 0, [[0, { lean: .32, aLx: .6, aRx: .6, aLe: .6, aRe: .6, headX: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' }); show(CAKE12, KUX, 4.7, -3.4);
  CAKE12.userData.flames.forEach((f, i) => f.visible = L.lt < .3 + i * .02); bigNum('12', (L.lt - .1) / .2, 'gold', .17, 1.3); cm([KUX + 3, 8, 6, KUX, 5.4, -5, 44], [KUX + 2.4, 7.6, 4, KUX, 5.4, -5, 44], L.k); }, [[.2, 'breath', .6], [.4, 'cheer', .3]]);
// ---- 41 «Unser Familienwort ist „Kuschelkeks“.» (zoom lento): Mats, rojo de vergüenza, se tapa la cara; KUSCHELKEKS en rosa
shot(61.14, 'Z', 'slow', L => { flur(L, { h: 15, m: 0 }); const c = put(mats, HAX + 2, 0, -8, PI); actuar(c, L.lt, [[0, 'idle'], [1.0, 'hands_face', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'squint', mouth: 'grimace', blush: 1 });
  badge('gold', 'KUSCHELKEKS', W / 2, H * .18, (L.lt - 1.0) / .2, 1, 1.05); onFace(c, 6.2, -.3, 0, 42, L.k, 4.4); }, [[1.0, 'magic_hit', .4]]);
// ---- 42 «Das habe ich mir mit fünf ausgedacht,»: recuerdo en sepia: Mats con cinco años, en la cama con su galleta, se ríe; «5»
shot(63.4, 'B', null, L => { zimmer(L, true); SEPIA = .55; const c = sit(mats5, KZX - 9, 3.7, -4.6, .2, L, { aRx: 1.2, aRe: 1.4, aLx: .4, lean: Math.sin(L.T * 10) * .05 }); laughF(c, L.T);
  bigNum('5', (L.lt - .2) / .2, 'gold', .13, 1.2); onBody(c, 13, .2, .12, 44, L.k, 11.5); }, [[0, 'film_roll', .4], [.3, 'kids_laugh', .4]]);
// ---- 43 «aus einem Gute-Nacht-Lied, das Mama mir immer vorgesungen hat.»: Mama sentada en la cama le canta; notas que flotan; luz de la lamparita
shot(65.2, 'S', null, L => { zimmer(L, true); SEPIA = .55; const c = sit(mats5, KZX - 10, 3.7, -4.6, .5, L, { aLx: .3, aRx: .3, headY: .3 }); cara(c, L.T, { expr: 'happy', eyes: 'half', mouth: 'smile' });
  const m = sit(mamaB, KZX - 6.6, 3.7, -3.6, -.9, L, { aLx: 1.1, aLz: -.3, aLe: 1.2, aRx: .4, headY: -.3, headZ: Math.sin(L.T * 2) * .12 }); cara(m, L.T, { eyes: 'happy', mouth: Math.sin(L.T * 4) > 0 ? 'o' : 'smile' }); notes(hp(m).add(V(-1, 1, 0)), L.T, 5);
  orb(L.k, V(KZX - 8.4, 5.4, -4), null, [14, .35, .12, 44], [12, .05, .12, 44]); }, [[0, 'lullaby', .8]]);
// ---- 44 «Und jetzt hängt es an mir.»: hoy: Mats (12) se da una palmada en la frente en su cuarto
shot(67.71, 'W', null, L => { zimmer(L, false); const c = put(mats, KZX - 2, 0, 0, .3); actuar(c, L.lt, [[0, 'idle'], [.15, 'facepalm', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'tired', mouth: 'frown' }); onBody(c, 13, .2, .06, 42, L.k, 11.5); }, [[.15, 'slap', .6], [.4, 'sigh', .5]]);
// ---- 45 «Ich würde mich lieber schnappen lassen,»: de noche, unas manos pálidas lo agarran por detrás… y él, tan tranquilo, se encoge de hombros
shot(69.23, 'G', null, L => { strasse(L, { t: 'night' }); const c = put(mats, 2, 0, -60, 0); actuar(c, 0, [[0, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smile' });
  const g = put(CALL[1], 2, 0, -62.6, 0); actuar(g, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.4, aRz: -.4, aLe: .4, aRe: .4, lean: .2 }]], { T: L.T }); creepF(g, L.T, .9); lp(0, 6, 10, -54, 50, 0xffb860, 24);
  orbit(V(2, 6, -61), lerp(15, 13, L.k), .35, .08, 42); sh(V(2, 0, -61), 26); }, [[0, 'glitch', .4], [.1, 'cloth', .6], [.5, 'sigh', .4]]);
// ---- 46 «als es vor meinen Freunden zu sagen.»: en el patio con tres amigos que esperan que lo diga; él se tapa la boca y suda
shot(70.53, 'S', null, L => { strasse(L, { t: 'day' }); const c = put(mats, 0, 0, 40, PI); actuar(c, 0, [[0, { aRx: 2.2, aRz: -.1, aRe: 2.3, aLx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide', mouth: 'flat' }); sweat(c, L.T);
  [[-3.4, 36.6, .5, 4], [3.4, 36.4, -.5, 5], [0, 34.4, 0, 6]].forEach(([x, z, ry, i]) => { const k = put(KIDS[i], x, 0, z, ry); actuar(k, 0, [[0, { lean: .15, aLx: .5, aRx: .5, headX: .1 }]], { T: L.T }); cara(k, L.T + i, { expr: 'happy', mouth: 'open_smile' }); });
  cm([2, 7.4, 52, 0, 5.4, 37, 44], [1, 7.2, 49, 0, 5.4, 37, 44], L.k); sh(V(0, 0, 38), 30); }, [[.1, 'kids_laugh', .5], [.5, 'gulp', .5]]);
// ---- 47 «Papa war auf Montage in Hamburg.»: Papa con chaleco naranja y casco en el puerto de Hamburgo, saludando a la cámara; grúas y contenedores
shot(71.96, 'R', null, L => { hafenS(L); const c = put(papa, HFX + 26, 0, 4, -.2); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  badge('tag', 'HAMBURG', W / 2, H * .17, (L.lt - .2) / .2); orb(L.k, V(HFX + 26, 6, 4), null, [18, -.3, .1, 46], [15, .1, .1, 46]); sh(V(HFX + 26, 0, 4), 40); }, [[0, 'harbor', .6], [.3, 'seagulls', .5]]);
// ---- 48 «Also waren nur ich und meine kleine Schwester Ida zu Hause.»: en el salón: Mats en el sofá con el móvil, Ida en la alfombra jugando con su conejo
shot(73.73, 'F', null, L => { flur(L, { h: 15, m: 50 }); const c = sit(mats, HAX + 22, 3.4, -32.4, 0, L, { aRx: .9, aRe: 1.3, aLx: .8, aLe: 1.3, headX: .25 }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); cara(c, L.T, { expr: 'neutral', eyes: 'down' });
  const i = put(ida, HAX + 26, 0, -22, -.6); actuar(i, 0, [[0, { crouch: .5, lLx: .6, rLx: .6, lLk: 1.1, lRk: 1.1, aLx: 1.4, aRx: 1.4 + Math.sin(L.T * 4) * .3, aLe: .6, aRe: .6 }]], { T: L.T }); attach(BUNNY, i.aL.hand, [0, -.6, .5], [0, 0, 0], .8); laughF(i, L.T);
  cm([HAX + 25, 7.6, -11, HAX + 24, 3.6, -28, 50], [HAX + 25.5, 7.4, -12.5, HAX + 24, 3.6, -28, 50], L.k); }, [[0, 'tv_static', .2], [.5, 'toy', .4], [1.5, 'kids_laugh', .3]]);
// ---- 49 «Sie ist sieben.»: Ida levanta su conejo y sonríe; «7»
shot(76.52, 'C', 'punch', L => { flur(L); const i = put(ida, HAX + 24, 0, -22, 0); actuar(i, 0, [[0, { aLx: 2.6, aRx: 2.6, aLe: .4, aRe: .4, aLz: .2, aRz: .2 }]], { T: L.T }); attach(BUNNY, i.aL.hand, [.6, -.6, .4], [0, 0, 0], .8); laughF(i, L.T);
  bigNum('7', (L.lt - .05) / .15, 'gold', .18, 1.3); onFace(i, 5.6, -.4, 0, 42, L.k, 5); }, [[0, 'pop', .5], [.1, 'kids_laugh', .4]]);
// ---- 50 «Wir haben auf Mama gewartet.»: los dos en la ventana del salón, mirando a la calle; el reloj marca las 16:00
shot(77.1, 'S', null, L => { flur(L, { h: 16, m: 0, day: true }); const c = put(mats, HAX + 20.4, 0, -4.4, 0), i = put(ida, HAX + 23.4, 0, -4.2, 0); actuar(c, 0, [[0, { aLx: .4, aRx: .4, headY: Math.sin(L.T * .7) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral' });
  actuar(i, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: .8, aRe: .8, headX: -.1 }]], { T: L.T }); attach(BUNNY, i.aL.hand, [.5, -.6, .4], [0, 0, 0], .8); cara(i, L.T, { expr: 'happy' });
  bigNum('16:00', (L.lt - .2) / .2, 'big', .15, .9); cm([HAX + 27, 7.6, -17, HAX + 22, 5.6, -1, 44], [HAX + 25, 7.4, -15.5, HAX + 22, 5.6, -1, 44], L.k); }, [[0, 'clock_tick', .5]]);
// ---- 51 «Im Winter geht die Sonne hier um halb fünf unter.»: la calle en invierno con nieve fina; el sol, bajo, entre las montañas; «16:30»
shot(78.55, 'W', null, L => { strasse(L, { t: 'dusk', k: .7 }); AIRM = 'nieve'; show(SUND, 0, lerp(70, 40, L.k), -1100); walk(EXS[2], L, 13, 20, PI, 2.4, 0, { expr: 'neutral' }); breath(EXS[2], L.T);
  bigNum('16:30', (L.lt - .3) / .2, 'gold', .16, .9); cm([-2, 9, 80, 0, 12, -200, 42], [0, 8, 70, 0, 11, -200, 42], L.k); sh(V(0, 0, 40), 60); }, [[0, 'wind', .5], [.4, 'steps_snow', .4]]);
// ---- 52 «Deshalb ist Mama immer spätestens um vier zu Hause.»: de día, Mama sube por el camino a casa saludando con la mano; «16:00»
shot(80.88, 'R', null, L => { strasse(L, { t: 'day' }); const p = PORCH; const c = walk(mama, L, p.x - 13 + L.lt * 2.4, p.z + 1, PI / 2, 0, 0, { expr: 'happy' }); c.root.position.x = p.x - 13 + L.lt * 2.4; actuar(c, 0, [[0, { ...walkP(L.T, 0), ...GEST.wave, aRz: .4 + Math.sin(L.T * 9) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  attach(BAG, c.aL.hand, [0, -1.2, 0], [0, 0, 0], .9); bigNum('16:00', (L.lt - .3) / .2, 'green', .15, .9); orbit(V(c.root.position.x, 5.6, p.z), lerp(16, 14, L.k), -PI / 2 + .25, .1, 44); sh(V(p.x, 0, p.z), 30); }, [[0, 'steps', .5], [.6, 'birds', .4]]);
// ---- 53 «Um halb fünf verschwand die Sonne hinter dem Wald.»: el sol se hunde tras los abetos (time-lapse); las sombras se alargan; «16:30»
shot(83.47, 'F', null, L => { strasse(L, { t: 'dusk', k: lerp(.6, 1, L.k) }); show(SUND, 0, lerp(30, -60, easeIn(L.k)), -1100); show(GOLF2, -24, 0, 40, .2);
  bigNum('16:30', (L.lt - .2) / .2, 'gold', .15, .9); cm([0, 5, 60, 0, 22, -400, 40], [0, 6, 62, 0, 18, -400, 40], L.k); sh(V(0, 0, 0), 60); }, [[0, 'wind', .4], [.5, 'owl', .3]]);
// ---- 54 «Um halb sechs war es stockdunkel.»: la calle de noche, vacía; el hueco del coche de Mama en el camino; «17:30»
shot(86.06, 'W', null, L => { strasse(L, { t: 'night' }); walk(EXS[9], L, -13, -10, 0, 3, 0, { expr: 'worried' }); bigNum('17:30', (L.lt - .2) / .2, 'cyan', .15, .9);
  cm([-6, 12, 26, 36, 2, -22, 46], [-4, 11, 20, 36, 2, -22, 46], L.k); sh(V(30, 0, -20), 40); }, [[0, 'crickets', .5], [.6, 'owl', .4]]);
// ---- 55 «Und Mama war immer noch nicht da.»: en la ventana: Mats, preocupado, con la frente en el cristal; Ida abraza su conejo
shot(87.97, 'S', null, L => { flur(L, { h: 17, m: 50 }); const c = put(mats, HAX + 20.6, 0, -6.4, 0), i = put(ida, HAX + 23.6, 0, -6.6, -.3); actuar(c, 0, [[0, { lean: .1, aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  actuar(i, 0, [[0, 'hug_self']], { T: L.T }); attach(BUNNY, i.spine, [0, 1.2, .9], [0, 0, 0], .8); cara(i, L.T, { expr: 'sad' });
  cm([HAX + 23, 7, -1.2, HAX + 22, 5.2, -6.5, 46], [HAX + 22.6, 6.8, -1.4, HAX + 22, 5.2, -6.5, 42], L.k); }, [[0, 'clock_tick', .5], [.4, 'sigh', .3]]);
// ---- 56 «Um sechs Uhr zehn»: el reloj de pared del pasillo: las agujas saltan a las 18:10
shot(89.45, 'C', 'punch', L => { flur(L, { h: 18, m: Math.min(10, 4 + Math.floor(L.lt * 12)) }); bigNum('18:10', (L.lt - .1) / .15, 'red', .15, 1); cam([HAX + 2.5, 11.2, -3], [HAX + 7.8, 11, -3], 38); }, [[0, 'clock_tick', .8], [.3, 'tick', .6]]);
// ---- 57 «klopfte es.»: la puerta de casa se sacude con tres golpes; Mats e Ida, en el pasillo, giran la cabeza de golpe
shot(90.27, 'C', 'punch', L => { flur(L, { h: 18, m: 10 }); const r = rattle(L, 0, 3, 3.6); HA.front.door.rotation.y = PI - r * .03; const c = put(mats, HAX + 2.4, 0, 6, PI), i = put(ida, HAX - .4, 0, 4, PI - .3);
  const turn = easeOut(clamp(L.lt / .15)); c.root.rotation.y = PI - turn * PI; i.root.rotation.y = PI - .3 - turn * (PI - .4); actuar(c, 0, [[0, 'shock']], { T: L.T }); actuar(i, 0, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); cara(i, L.T, { expr: 'shock', mouth: 'o' });
  cm([HAX + 1.5, 8, -9, HAX + 1.5, 5.4, 16, 46], [HAX + 1.5, 7.6, -7, HAX + 1.5, 5.4, 16, 46], L.k); }, [[0, 'knock', 1], [.28, 'knock', 1], [.56, 'knock', 1]]);
// ---- 58 «„Mats, ich bin’s.»: Mats delante de la puerta; Ida asoma en la escalera; la voz de Mama tras la puerta
shot(91.23, 'S', null, L => { flur(L); const c = put(mats, DOORIN.x - .2, 0, 13.4, 0); actuar(c, 0, [[0, { aLx: .3, aRx: .3, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); const i = put(ida, HAX - 4.4, 2, 4.8, .7); actuar(i, 0, [[0, { aLx: 1.2, aLe: 1.0, lean: .1 }]], { T: L.T }); cara(i, L.T, { expr: 'happy', eyes: 'wide' });
  badge('bubble', 'Mats, ich bin’s.', W / 2, H * .2, (L.lt - .05) / .2); cm([HAX + 5, 7.6, 2, DOORIN.x, 4.6, 15, 46], [HAX + 4.6, 7.4, 3.6, DOORIN.x, 4.6, 15, 46], L.k); }, [[0, 'whisper', .3]]);
// ---- 59 «Lass mich rein.“»: primer plano del pomo y la cadena: el pomo gira de un lado a otro
shot(92.45, 'C', null, L => { flur(L); HA.front.knob.rotation.z = Math.sin(L.T * 14) * .7; HA.front.door.rotation.y = PI - Math.abs(Math.sin(L.T * 14)) * .01; const k = wpos(HA.front.knob);
  cam([k.x - 2.4, k.y + 1.6, k.z - 3.4], [k.x - .6, k.y + .6, k.z], 40); }, [[0, 'door_rattle', .8], [.3, 'chain_rattle', .5]]);
// ---- 60 «Es war Mamas Stimme.»: Ida corre feliz hacia la puerta («Mama!») y Mats la para con el brazo
shot(93.19, 'W', null, L => { flur(L); const i = walk(ida, L, HAX + .2, 6, 0, 3.4, 0, { run: true, face: false }); i.root.position.z = Math.min(i.root.position.z, 12); laughF(i, L.T); bubble(i, 'Mama!', (L.lt - .1) / .2, 1.6);
  const c = put(mats, HAX + 2.4, 0, 13.2, -PI / 2); actuar(c, L.lt, [[0, 'idle'], [.4, { aRx: 1.6, aRz: -.3, aRe: .2, lean: .05 }, { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'o' });
  cm([HAX + 4, 7.2, 22 - 3, HAX + 1.4, 4.4, 10, 50], [HAX + 3.6, 7, 19, HAX + 1.4, 4.4, 10.5, 50], L.k); }, [[0, 'run_cobble', .4], [.4, 'cloth', .5]]);
// ---- 61 «Ich habe durch den Türspion geschaut.»: Mats de puntillas, el ojo pegado a la mirilla (perfil)
shot(94.37, 'Z', null, L => { flur(L); const c = put(mats, DOORIN.x + 1, .5 * easeOut(clamp(L.lt / .4)), 18.2, 0); actuar(c, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: .4, aRe: .4, lean: .12, headX: -.15 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'flat' });
  const h = hp(c); cam([h.x - 7, h.y + .6, h.z - 5], [h.x, h.y - .8, h.z + .4], 44); }, [[.05, 'cloth', .4], [.3, 'wood_creak', .4]]);
// ---- 62 «Und da stand sie, auf der Veranda,»: POV de la mirilla (ojo de pez): Mama en el porche, bajo el farol
shot(96.08, 'I', null, L => { strasse(L, { t: 'night' }); const p = PORCH; const c = put(ding, p.x, p.y, p.z, toDoorM); actuar(c, 0, [[0, { aLx: .08, aRx: .08, aLz: .05, aRz: .05 }]], { T: L.T, breathe: false }); cara(c, L.T, { expr: 'happy', mouth: 'smile', noBlink: true }); lp(0, p.x + 1, 10, p.z + 2.6, 60, 0xffb860, 16); moths(HMW(HM.doorX + 3.2, HM.B + 9.6, HM.frontZ + .8), L.T);
  peephole(L, 1, { ty: 4.6, fov: 100 }); }, [[0, 'creepy_ting', .4], [.3, 'crickets', .3]]);
// ---- 63 «in ihrem Wintermantel.»: POV más cerca: el abrigo camel y la bufanda roja
shot(97.7, 'C', null, L => { strasse(L, { t: 'night' }); const p = PORCH; const c = put(ding, p.x, p.y, p.z - 1.2, toDoorM); actuar(c, 0, [[0, { aLx: .08, aRx: .08 }]], { T: L.T, breathe: false }); cara(c, L.T, { expr: 'happy', mouth: 'smile', noBlink: true }); lp(0, p.x + 1, 10, p.z + 2.6, 60, 0xffb860, 16);
  peephole(L, 1, { look: hp(c).add(V(0, -2.6, 0)), fov: 74 }); }, [[0, 'cloth', .3]]);
// ---- 64 «Sie lächelte.»: POV: la cara de Mama, sonriendo
shot(99.22, 'C', null, L => { strasse(L, { t: 'night' }); const p = PORCH; const c = put(ding, p.x, p.y, p.z - 1.8, toDoorM); actuar(c, 0, [[0, { aLx: .08, aRx: .08 }]], { T: L.T, breathe: false }); cara(c, L.T, { eyes: 'happy', mouth: L.k > .6 ? 'open_smile' : 'smile', noBlink: true }); lp(0, p.x + 1, 10, p.z + 2.6, 60, 0xffb860, 16);
  peephole(L, 1, { look: hp(c).add(V(0, .3, 0)), fov: 72 }); }, [[0, 'creepy_ting', .4]]);
// ---- 65 «Ihr Lächeln ging fast bis zu den Ohren.» (zoom lento): la sonrisa se estira hasta las orejas
shot(100.16, 'Z', 'slow', L => { strasse(L, { t: 'night' }); const p = PORCH; const c = put(ding, p.x, p.y, p.z - 1.8, toDoorM); actuar(c, 0, [[0, { aLx: .08, aRx: .08, headZ: L.k * .1 }]], { T: L.T, breathe: false }); creepF(c, L.T, .1 + easeIn(L.k) * .9); lp(0, p.x + 1, 10, p.z + 2.6, 60, 0xffb860, 16);
  peephole(L, 1, { look: hp(c).add(V(0, .3, 0)), fov: lerp(56, 40, L.k) }); }, [[.3, 'stretch', .5]]);
// ---- 66 «Ich habe mir gesagt:»: Mats se aparta de la puerta y se frota el ojo, pensando
shot(102.3, 'W', null, L => { flur(L); const c = put(mats, DOORIN.x + .6, 0, 17 - easeOut(clamp(L.lt / .4)) * 2, PI); actuar(c, L.lt, [[0, { aRx: 2.2, aRz: -.4, aRe: 2.4, headX: .1 }], [.5, 'think', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: L.lt < .5 ? 'closed' : 'side_l' });
  onFace(c, 6.6, -.2, .8, 42, L.k, 5.6); }, [[0, 'cloth', .4]]);
// ---- 67 «Das macht der Türspion.»: macro de la mirilla dorada en la puerta azul
shot(103.28, 'C', null, L => { flur(L); const p = PEEPW(); cam([p.x + .3, p.y + .2, p.z - lerp(2.6, 1.6, L.k)], [p.x, p.y, p.z], 34); }, [[0, 'click_metal', .4]]);
// ---- 68 «Der zieht jedes Gesicht in die Breite.»: ojo de pez: la cara de Ida, estirada y graciosa, sacando la lengua
shot(104.24, 'F', null, L => { flur(L); const i = put(ida, HAX + 1.5, 0, 8, 0); actuar(i, 0, [[0, { lean: .2, aLx: 1.0, aRx: 1.0, aLz: .3, aRz: .3, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); laughF(i, L.T);
  const h = hp(i); cam([h.x, h.y + .6, h.z + 3.2], [h.x, h.y + .2, h.z], 96); PEEP = 1; }, [[0, 'boing_metal', .4], [.4, 'kids_laugh', .4]]);
