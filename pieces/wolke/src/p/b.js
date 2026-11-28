// ---------- b: la Geheimwaffe, Marlon, la cámara, el hermano, el melocotón (39,18 – 70,41 s) ----------
// valla de madera blanca entre la acera y el jardín de Marlon (a lo largo de z, en x = SX + 17)
const FENCE = P_((() => { const g = new THREE.Group(); const w = mat(0xf8f6f0, { roughness: .6 }); for (let k = 0; k < 15; k++) { box(.5, 3.2, .8, w, .08, g, 0, 1.6, -14 + k * 2); const t = new THREE.Mesh(new THREE.ConeGeometry(.45, .7, 4), w); t.position.set(0, 3.5, -14 + k * 2); t.rotation.y = PI / 4; g.add(t); }
  for (const y of [1, 2.4]) box(.3, .4, 30, w, .05, g, -.3, y, 0); return castSh(g); })());
// cartelitos de lo que robó Marlon (4): gnomo, bici, maceta, buzón
const LOOT = [0xd8323a, 0x2a6ad8, 0xffb020, 0x2ab86a].map((c, i) => P_(castSh((() => { const g = new THREE.Group(); if (i === 0) { cyl(.6, .8, 1.8, mat(0x2a6ad8), 10, g, 0, .9, 0); sphere(.55, mat(0xf2c4a0), g, 0, 2.2, 0, 10, 8); const h = new THREE.Mesh(new THREE.ConeGeometry(.6, 1.4, 10), mat(0xd8323a)); h.position.y = 3.1; g.add(h); }
  else if (i === 1) { for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.TorusGeometry(1, .12, 6, 20), mat(0x1a1a1a)); w.position.set(s * 1.3, 1, 0); g.add(w); } box(2.6, .2, .2, mat(c), .05, g, 0, 1.6, 0); }
  else if (i === 2) { cyl(.9, .7, 1.4, mat(0xb85a2a), 10, g, 0, .7, 0); sphere(1, mat(0xff6aa8), g, 0, 2, 0, 8, 6); }
  else { cyl(.12, .12, 3, mat(0x2a2a30), 6, g, 0, 1.5, 0); box(1.4, 1.1, 2, mat(0xffd23f), .2, g, 0, 3.4, 0); } return g; })())));
// marco de cámara de vigilancia (2D): REC parpadeando, hora, esquinas
const cctv = (T, txt) => FX2D.push(c => { c.save(); c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 8; const m = 70, l = 110;
  for (const [x, y, dx, dy] of [[m, m + 120, 1, 1], [W - m, m + 120, -1, 1], [m, H - m - 380, 1, -1], [W - m, H - m - 380, -1, -1]]) { c.beginPath(); c.moveTo(x, y + dy * l); c.lineTo(x, y); c.lineTo(x + dx * l, y); c.stroke(); }
  c.font = `700 56px ${FONT}`; c.textBaseline = 'middle'; if (Math.floor(T * 2) % 2) { c.fillStyle = '#ff2020'; c.beginPath(); c.arc(m + 50, m + 170, 18, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.textAlign = 'left'; c.fillText('REC', m + 80, m + 172);
  c.textAlign = 'right'; c.font = `700 40px ${FONT}`; c.fillText(txt, W - m - 20, m + 172); c.fillStyle = 'rgba(255,255,255,.05)'; for (let y = 0; y < H; y += 6) c.fillRect(0, y, W, 2); c.restore(); });
// cronómetro de entrenamiento (2D)
const stopwatch = (s, k) => badge('num', s, W / 2, H * .14, k);

// 37 «Dieses Jahr hatte ich eine Geheimwaffe:»: mi cuarto de noche: abro la caja fuerte y sale una luz naranja
shot(38.93, 'R', null, L => { zimmer(L, true); show(SAFE, KX - 2, 0, -9, .5, 1); SAFE.userData.door.rotation.y = -easeOut(clamp(L.lt / .9)) * 1.6; SAFE.userData.glow.intensity = 30 * clamp(L.lt / .6);
  pose(ich, KX + 1.2, 0, -5.4, faceTo(V(KX + 1.2, 0, -5.4), V(KX - 2, 0, -9)), L, { crouch: .45, lean: .3, aRx: 1.4, aRe: .4, aLx: .6, headX: .2 }, 'smug', { mouth: 'smirk' }); FACES.push(ich);
  cm([KX - 5.5, 8, -11, KX + 1.2, 3.6, -5.4, 48], [KX - 5, 7.6, -10.6, KX + 1.2, 3.8, -5.4, 44], L.k); badge('tag', 'GEHEIMWAFFE', W / 2, H * .14, (L.lt - .4) * 3); },
  [[.05, 'safe_dial', .8], [.5, 'door_creak', .6], [.8, 'choir_ah', .5]]);
// 38 «Pfirsich-Turbo Supreme.»: el vape melocotón con dorado, brillando en mi mano; destellos y zoom lento
shot(40.54, 'F', 'slow', L => { zimmer(L, true); put(ich, KX + 1, 0, -4, .5); holdV(ich, L, { special: PFIRSICH, raise: .62, pose: { aLx: .4 } }); PFIRSICH.userData.setGlow(1.2 + Math.sin(L.T * 5) * .3); cara(ich, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  PFIRSICH.updateMatrixWorld(true); const p = PFIRSICH.localToWorld(V(0, .7, 0)); cam([p.x + 2.2, p.y + .8, p.z + 3.6 - L.k * .6], [p.x, p.y + .2, p.z], 40); sparkle(p, L.T, 14, 1.4); lp(2, p.x + 1, p.y + 1, p.z + 1, 20, 0xff9a6a, 8);
  SMK.tint.set(0xffb090); SMK.puff(PFIRSICH.localToWorld(V(0, 1.45, 0)), V(0, 1, 0), L.T, L.t0, 1.6, { pow: 1.2, size: .35, n: 24, dens: .7, seed: 12, life: 1.6 }); top('PFIRSICH-TURBO', (L.lt - .05) * 3, 'gold', .12, .85); top('SUPREME', (L.lt - .9) * 3, 'red', .19, .8); },
  [[.05, 'sparkle', .9], [.9, 'ding_reveal', .7]]);
// 39 «Drei Monatsgehälter.»: pagué tres sobres de sueldo: los lanzo uno a uno sobre la cama
shot(42.28, 'Z', 'punch', L => { zimmer(L, true); pose(ich, KX - 3, 0, 3, -.9, L, { aRx: 1.5, aRe: .3, aLx: .5, lean: .1 }, 'worried', { mouth: 'grimace' }); sweat(ich, L.T, 2); FACES.push(ich);
  ENV.forEach((e, i) => { const k = clamp((L.lt - .1 - i * .28) / .35); const a = [KX - 4.4, 5.4, 3.6], b = [KX - 9 + (i - 1) * 1.8, 4.75, 1 + i * .8]; const p = arc(a, b, 1.6, easeOut(k)); e.visible = k > 0; e.position.copy(p); e.rotation.set(k > .99 ? -PI / 2 : k * 6, i, 0); });
  cm([KX + 3, 7.4, 13, KX - 5, 4.2, 2.4, 46], [KX + 2, 7.2, 12, KX - 5, 4.2, 2.4, 44], L.k); top('3 MONATSGEHÄLTER', (L.lt - .1) * 3, 'green', .13, .85); }, [[.1, 'paper_slap', .7], [.38, 'paper_slap', .7], [.66, 'paper_slap', .7], [.8, 'cash_reg', .6]]);
// 40 «Und ich wusste genau,»: en la calle, delante de mi casa, miro fijamente hacia la casa de enfrente
shot(43.63, 'S', null, L => { strasseS(L); pose(ich, SX - 6, 0, -8, PI / 2 + .25, L, { aLx: .2, aRx: .2, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9 }, 'angry', { mouth: 'frown' }); FACES.push(ich);
  crowdBox(L, SX - 4, SX + 4, 14, 30, 3, 21, { mode: 'walk', dir: PI / 2 }); onBody(ich, 12, -.2, .1, 44, L.k, 10.5, -.05); }, [[.05, 'street_amb', .6], [.3, 'hmph', .6]]);
// 41 «wer sie geklaut hat.»: primer plano: entrecierro los ojos
shot(44.67, 'C', 'punch', L => { strasseS(L); pose(ich, SX - 6, 0, -8, PI / 2 - .15, L, { headX: .05 }, 'sus', { mouth: 'flat', eyes: 'squint' }); FACES.push(ich); onFace(ich, 4.6, 0, .4, 40, L.k, 3.9); },
  [[.05, 'sus_sting', .8]]);
// 42 «Marlon von nebenan.»: Marlon, apoyado en la valla de su jardín, sonrisa chulesca
shot(45.6, 'W', null, L => { strasseS(L); show(FENCE, SX + 17.5, 0, -40, 0, 1); pose(marlon, SX + 19.2, 0, -40, -PI / 2 + .2, L, { lean: .18, aLx: 1.2, aLz: -.1, aLe: 1.1, aRx: .9, aRz: -.1, aRe: 1.4, headY: Math.sin(L.T * 2) * .1 }, 'smug', { mouth: 'smirk' }); FACES.push(marlon);
  onBody(marlon, 13, -.15, .1, 44, L.k, 11, .05); top('MARLON', (L.lt - .2) * 3, 'big', .13); }, [[.05, 'whistle', .6], [.4, 'gum_pop', .5]]);
// 43 «Er hat schon viermal»: de noche, Marlon cruza la calle de puntillas con un gnomo robado
shot(46.9, 'I', null, L => { strasseS(L, 'night'); const x = SX + 6 - L.lt * 4; put(marlon, x, 0, -4, -PI / 2); actuar(marlon, 0, [[0, { ...walkP(L.T * .6, 1), crouch: .25, lean: .25, aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(marlon, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'side_r' }); FACES.push(marlon);
  show(LOOT[0], x - .4, 1.6, -5.6, -PI / 2, .6); onBody(marlon, 14, .35, .12, 44, L.k, 12, .25); }, [[.05, 'sneak_steps', .8], [.4, 'cricket', .5]]);
// 44 «geklaut.»: en su jardín, el botín de los cuatro robos (gnomo, bici, maceta, buzón) y «4×»
shot(47.8, 'C', 'punch', L => { strasseS(L); show(FENCE, SX + 17.5, 0, -40, 0, 1); LOOT.forEach((o, i) => show(o, SX + 21 + (i % 2) * 3, 0, -44 + i * 2.6, -PI / 2 + .3, 1)); pose(marlon, SX + 23, 0, -6, -PI / 2 - .3, L, { aRx: 2.6, aRz: .3, aLx: .3 }, 'smug', { mouth: 'grin' }); FACES.push(marlon);
  cm([SX + 4, 7, -30, SX + 22, 3.4, -40, 48], [SX + 5, 6.6, -31, SX + 22, 3.4, -40, 46], L.k); top('4×', (L.lt - .05) * 4, 'red', .13, 1.3); }, [[.05, 'impact', .6], [.2, 'cash', .5]]);
// 45 «Ich habe ihn gefragt, ob er sie gesehen hat.»: en la valla: le pregunto; bocadillo «MEINE VAPE?»
shot(48.58, 'R', null, L => { strasseS(L); show(FENCE, SX + 17.5, 0, -40, 0, 1); pose(ich, SX + 15.6, 0, -40, PI / 2, L, { aRx: 1.1, aRz: -.2, aRe: 1.4, aLx: .3 }, 'worried'); talk(ich, L.T, 48.58, 50.29, 'worried');
  pose(marlon, SX + 19.4, 0, -40, -PI / 2, L, { aLx: .3, aRx: .3, aLz: .7, aRz: .7, aLe: 1.8, aRe: 1.8 }, 'smug', { mouth: 'smirk' }); FACES.push(ich, marlon); bubble(ich, 'MEINE VAPE?', (L.lt - .2) * 3, 1.6);
  cm([SX + 17.5, 5.6, -24, SX + 17.5, 4.2, -40, 46], [SX + 17.5 + 1.2, 5.4, -25.5, SX + 17.5, 4.2, -40, 44], L.k); }, [[.05, 'talk_mumble', .5]]);
// 46 «Er meinte:»: Marlon, primer plano, se ríe por lo bajo
shot(50.29, 'G', null, L => { strasseS(L); show(FENCE, SX + 17.5, 0, -40, 0, 1); pose(marlon, SX + 19.4, 0, -40, -PI / 2 + .2, L, { aLx: .3, aRx: .3, aLz: .7, aRz: .7, aLe: 1.8, aRe: 1.8, headX: Math.sin(L.T * 12) * .04 }, 'smug', { mouth: 'grin', eyes: 'squint' }); FACES.push(marlon);
  onFace(marlon, 4.8, 0, .6, 42, L.k, 4.1); }, [[.05, 'snicker', .8]]);
// 47 «„Hast du unter deinem Hintern nachgeschaut?"»: Marlon me señala el culo; bocadillo
shot(51.44, 'F', null, L => { strasseS(L); show(FENCE, SX + 17.5, 0, -40, 0, 1); pose(marlon, SX + 19.4, 0, -40, -PI / 2 - .2, L, { aRx: 1.1, aRz: -.1, aRe: .1, lean: .1, aLx: .3 }, 'smug', { mouth: 'open_smile' }); talk(marlon, L.T, 50.41, 52.5, 'smug');
  pose(ich, SX + 15.6, 0, -40, PI / 2 + .3, L, { aLx: .3, aRx: .3 }, 'confused', { mouth: 'o' }); FACES.push(ich, marlon); bubble(marlon, 'UNTERM HINTERN?', (L.lt - .1) * 3, 1.6);
  cm([SX + 16, 5, -21, SX + 17.5, 3.4, -40, 46], [SX + 15, 5, -22, SX + 17.5, 3.4, -40, 44], L.k); }, [[.05, 'talk_mumble', .5], [.6, 'cartoon_boing', .4]]);
// 48 «Hab ich.»: me giro y me miro el trasero (de verdad)
shot(52.5, 'S', null, L => { strasseS(L); pose(ich, SX + 14, 0, -36, PI / 2 - .9, L, { twist: .9 * easeOut(clamp(L.lt * 3)), headY: 1.1 * easeOut(clamp(L.lt * 3)), headX: .35, lean: .1, aLx: .6, aRx: -.4 }, 'confused', { mouth: 'o' }); FACES.push(ich);
  onBody(ich, 12, 1.3, .12, 44, L.k, 10.5, 1.1); }, [[.05, 'cloth_rustle', .7], [.4, 'hmm', .5]]);
// 49 «Da war sie nicht.»: nada; me encojo de hombros, «?»
shot(53.44, 'Z', null, L => { strasseS(L); pose(ich, SX + 14, 0, -36, PI / 2 + .4, L, GEST.shrug ?? { aLx: .6, aRx: .6, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6 }, 'confused', { mouth: 'wavy' }); FACES.push(ich);
  onFace(ich, 6, 0, -.5, 42, L.k, 5.3); top('?', (L.lt - .1) * 3, 'q', .14); }, [[.05, 'shrug', .6], [.3, 'sad_trombone', .4]]);
// 50 «Aber sein Zimmer roch»: la casa de Marlon: por su ventana sale un aroma naranja que serpentea hasta la calle
shot(54.32, 'W', null, L => { strasseS(L); SMK.tint.set(0xffa070); for (let k = 0; k < 3; k++) SMK.puff(V(SX + 24, 10 - k, -40 + k * 2), V(-1, .05, .2), L.T, L.t0 - 1.5 + k * .3, 2.5, { pow: 2.4, size: 1.5, n: 30, dens: .75, seed: 30 + k, life: 3.5, up: .1 });
  show(FENCE, SX + 17.5, 0, -40, 0, 1); cm([SX - 4, 8, -22, SX + 22, 8, -40, 48], [SX - 2, 8.6, -24, SX + 22, 8.4, -40, 46], L.k); top('ROCH NACH…', (L.lt - .2) * 3, 'gold', .13, .85); }, [[.05, 'wind_soft', .6], [.3, 'sniff', .6]]);
// 51 «nach Pfirsich.»: olfateo con los ojos cerrados, el aroma naranja me rodea
shot(55.06, 'P', null, L => { strasseS(L); pose(ich, SX + 14, 0, -36, PI / 2 + .3, L, { headX: -.2 + Math.sin(L.T * 10) * .04, lean: -.06 }, 'happy', { eyes: 'closed', mouth: 'o' }); FACES.push(ich);
  SMK.tint.set(0xffa070); SMK.puff(hp(ich).add(V(3, 1, -1)), V(-1, .1, .4), L.T, L.t0 - 1, 2.2, { pow: 1.6, size: .9, n: 26, dens: .6, seed: 33, life: 3 }); onFace(ich, 5.2, 0, .8, 42, L.k, 4.5); top('PFIRSICH', (L.lt - .1) * 3, 'gold', .14); },
  [[.05, 'sniff', .9], [.5, 'sparkle', .4]]);
// 52 «Also habe ich eine Kamera»: de día en mi cuarto, subo una camarita a la estantería, entre los libros
shot(56.1, 'R', null, L => { zimmer(L, false); pose(ich, KX + 9.6, 0, -6.4, PI - .1, L, { aRx: 2.6, aRz: .1, aRe: .4, aLx: 2.3, aLz: -.2, aLe: .5, headX: -.25 }, 'determined', { mouth: 'flat' }); FACES.push(ich);
  show(CAMP, KX + 10.6, 9.2 + clamp(1 - L.lt * 2) * .6, -9.6, 0, 1); cm([KX + 2, 7.4, -3, KX + 9.6, 6.6, -8, 48], [KX + 3, 7.2, -3.6, KX + 9.6, 6.6, -8, 46], L.k); badge('tag', 'KAMERA', W / 2, H * .14, (L.lt - .3) * 3); },
  [[.05, 'footsteps_wood', .5], [.5, 'click_set', .7]]);
// 53 «in meinem Zimmer versteckt.»: la cámara escondida entre los libros; la lucecita roja parpadea
shot(57.36, 'I', 'slow', L => { zimmer(L, false); show(CAMP, KX + 10.6, 9.2, -9.6, .25, 1); CAMP.userData.led.visible = Math.floor(L.T * 3) % 2 === 0; cm([KX + 9.2, 9.6, -4.6, KX + 10.6, 9.2, -9.6, 38], [KX + 9.6, 9.4, -6.2, KX + 10.6, 9.2, -9.6, 36], L.k); DOF = 2; },
  [[.05, 'beep_small', .7], [.7, 'beep_small', .7]]);
// 54 «Als ich mir das Video angeschaut habe,»: de noche, en la cama con el portátil; la pantalla me ilumina la cara
shot(58.79, 'B', null, L => { zimmer(L, true); sit(ich, KX - 8, 4.4, -1, PI / 2 + .35, L, { aLx: 1.1, aRx: 1.1, aLe: 1.2, aRe: 1.2, headX: .15 }); cara(ich, L.T, { expr: 'worried', mouth: 'o' }); FACES.push(ich);
  show(LAP, KX - 5.6, 4.6, -.1, -PI / 2 + .35, 1); LAP.userData.draw((c, w, h) => { c.fillStyle = '#1a2a3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff3030'; c.font = `700 30px ${FONT}`; c.fillText('● REC', 18, 40); c.fillStyle = '#9ab0c0'; c.fillRect(40, 70, 240, 110); });
  lp(2, KX - 5, 6.6, -.4, 26, 0x7ab8ff, 10); cm([KX - .5, 7.6, -4.4, KX - 7.6, 5.6, -.6, 44], [KX - 1.4, 7.4, -4, KX - 7.6, 5.6, -.6, 42], L.k); }, [[.05, 'laptop_open', .7], [.4, 'keyboard', .5]]);
// 55 «war es nicht Marlon.»: la grabación (blanco y negro): se abre la puerta de mi cuarto, entra una sombra
shot(60.67, 'G', null, L => { zimmer(L, true); KZ.DOOR.rotation.y = -easeOut(clamp(L.lt / .8)) * 1.2; put(bro, KX + 16, 0, 2, -PI / 2); actuar(bro, 0, [[0, { crouch: .2, lean: .2, aLx: .6, aRx: .6 }]], { T: L.T }); cara(bro, L.T, { expr: 'sus', mouth: 'flat' }); DARK = .25;
  cam([KX + 10.4, 10, -9.4], [KX + 6, 3.6, 2], 60); BW = 1; cctv(L.T, '03:12'); badge('red', 'NICHT MARLON', W / 2, H * .62, (L.lt - .4) * 3, 1, .8); }, [[.05, 'door_creak', .8], [.3, 'tape_hiss', .5]]);
// 56 «Es war mein großer Bruder.»: en la grabación, mi hermano coge el vape de la caja fuerte (zoom lento hasta su cara)
shot(61.76, 'Z', 'slow', L => { zimmer(L, true); show(SAFE, KX - 2, 0, -9, .5, 1); SAFE.userData.door.rotation.y = -1.6; pose(bro, KX - .4, 0, -5.6, faceTo(V(KX - .4, 0, -5.6), V(KX + 10.4, 0, -9.4)) - .5, L, { crouch: .3, lean: .25, aRx: 1.6, aRe: .5 }, 'smug', { mouth: 'smirk' }); holdV(bro, L, { special: PFIRSICH, raise: .2, pose: { crouch: .3, lean: .25 } });
  const h = hp(bro); cm([KX + 10.4, 10, -9.4, h.x, h.y - 1, h.z, 60], [KX + 10.4, 10, -9.4, h.x, h.y, h.z, 30], L.k); BW = 1; DARK = .2; cctv(L.T, '03:13'); top('BRUDER?!', (L.lt - .6) * 3, 'red', .13); }, [[.05, 'tape_hiss', .5], [.7, 'gasp', .7]]);
// 57 «Er hat heimlich trainiert.»: de noche, en el salón, mi hermano entrena: caladas enormes y cronómetro
shot(63.51, 'F', null, L => { strasseS(L, 'night'); lp(0, SX + 8, 12, 22, 60, 0xffc070, 40); put(bro, SX + 4, 0, 18, -.4); vaper(bro, L, L.t0 - .3, .5, { expr: 'determined', size: 2.6, pow: 9, n: 80, up: 1 }); sweat(bro, L.T, 2);
  onBody(bro, 13, -.2, .12, 46, L.k, 11, .1); stopwatch('00:' + String(42 + Math.floor(L.lt * 9)).padStart(2, '0'), (L.lt) * 4); badge('tag', 'HEIMLICH', W / 2, H * .2, (L.lt - .3) * 3); }, [[.05, 'stopwatch', .8], [.3, 'big_puff', .8], [.9, 'heavy_breath', .6]]);
// 58 «Und Marlons Zimmer»: el cuarto de Marlon (morado), él tumbado en la cama, satisfecho
shot(64.95, 'S', null, L => { zimmer(L, false, true); sit(marlon, MX - 9, 4.4, -2, PI / 2 + .1, L, { lean: -.35, aLx: 2.8, aRx: 2.8, aLe: 2.4, aRe: 2.4, lLx: .2, lRx: .2, lLk: 0, lRk: 0 }); cara(marlon, L.T, { expr: 'happy', eyes: 'half', mouth: 'smile' }); FACES.push(marlon);
  cm([MX + 4, 8, 9, MX - 7, 4.6, -2, 46], [MX + 3, 7.6, 7.6, MX - 7, 4.6, -2, 44], L.k); badge('tag', 'MARLONS ZIMMER', W / 2, H * .14, (L.lt - .2) * 3); }, [[.05, 'room_amb', .5], [.3, 'yawn', .5]]);
// 59 «roch nach Pfirsich,»: el aroma naranja flota por todo su cuarto
shot(65.73, 'W', null, L => { zimmer(L, false, true); sit(marlon, MX - 9, 4.4, -2, PI / 2 + .1, L, { lean: -.35, aLx: 2.8, aRx: 2.8, aLe: 2.4, aRe: 2.4 }); cara(marlon, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' }); FACES.push(marlon);
  SMK.tint.set(0xffa070); SMK.haze(V(MX - 4, 7, -2), L.T, 22, 7, 2, 5, 3.2, .35, 9); cm([MX - 1, 6, 6, MX - 8, 5, -2, 46], [MX, 6.4, 5, MX - 8, 5.2, -2, 44], L.k); top('PFIRSICH', (L.lt - .2) * 3, 'gold', .13); }, [[.05, 'sniff', .7], [.4, 'sparkle', .4]]);
// 60 «weil er einen echten Pfirsich»: Marlon se sienta y saca un melocotón de verdad, enorme
shot(66.77, 'C', 'punch', L => { zimmer(L, false, true); sit(marlon, MX - 7.4, 4.4, -1, PI / 2 + .2, L, { aRx: 1.5, aRe: 1.4, aRz: -.2, aLx: .5 }); cara(marlon, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' }); FACES.push(marlon);
  attach(BIGPEACH, marlon.aR.hand, [0, -.9, .6], [0, 0, 0], .95); onFace(marlon, 6, 0, .9, 42, L.k, 5.2); top('ECHTER PFIRSICH', (L.lt - .2) * 3, 'gold', .13, .85); }, [[.05, 'pop', .6], [.3, 'ding', .5]]);
// 61 «gegessen hat.»: le pega un mordisco; salpica zumo
shot(68.02, 'F', null, L => { zimmer(L, false, true); sit(marlon, MX - 7.4, 4.4, -1, PI / 2 + .2, L, { aRx: 2.2 - Math.sin(L.lt * 9) * .15, aRe: 1.8, aRz: -.3, aLx: .5, headX: .12 }); cara(marlon, L.T, { expr: 'happy', mouth: L.lt > .3 ? 'grin' : 'ah', eyes: 'closed' }); FACES.push(marlon);
  attach(BIGPEACH, marlon.aR.hand, [0, -.9, .6], [0, 0, 0], .95); SPRAY.forEach((s, i) => { if (i > 14 || L.lt < .3) return; const r = RNG(i * 7 + 1), t = L.lt - .3, h = hp(marlon); s.visible = true; s.material.color.set(0xffc060); s.position.set(h.x + (r() - .3) * 3 * t + 1.2, h.y + .2 + 4 * t - 12 * t * t, h.z + (r() - .5) * 3 * t); });
  onFace(marlon, 4.6, 0, -.7, 42, L.k, 4); }, [[.25, 'bite_crunch', 1], [.4, 'slurp', .7]]);
// 62 «Mit Haut und Haaren.»: el melocotón mordido de muy cerca: la pelusa, el mordisco, el zumo
shot(68.75, 'I', null, L => { zimmer(L, false, true); show(BIGPEACH, MX, 6, 0, L.T * .8, 2.4); cm([MX + 3, 10.4, 9.4, MX, 7.8, 0, 40], [MX + 2.2, 10, 8.4, MX, 7.8, 0, 40], L.k); DOF = 2; top('MIT HAUT', (L.lt - .05) * 3.5, 'gold', .14); top('UND HAAREN', (L.lt - .5) * 3.5, 'red', .2); },
  [[.05, 'chew_wet', .9], [.5, 'chew_wet', .7]]);
// 63 «Ekelhaft.»: yo en la acera, cara de asco total, verde
shot(69.89, 'C', 'punch', L => { strasseS(L); pose(ich, SX + 14, 0, -36, PI / 2 + .3, L, { aLx: 1.6, aLz: -.3, aLe: 2.2, lean: -.15, headX: -.1 }, 'sad', { mouth: 'grimace_wide', eyes: 'squint' }); FACES.push(ich); TINT = 'rgba(60,180,40,.12)';
  onFace(ich, 4.6, 0, .5, 40, L.k, 3.9); top('EKELHAFT', (L.lt - .05) * 4, 'green', .14); }, [[.02, 'gag', 1]]);
