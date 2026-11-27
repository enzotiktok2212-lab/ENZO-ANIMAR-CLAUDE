// ---------- d: la pared de agua, la carrera de Jonte, Mama, el BUMM, la lluvia, el Rathaus (110 – 144,1 s) ----------
// 81 «Die Welle war jetzt eine Wand»: la ola ocupa todo el cuadro; gente diminuta corriendo delante
shot(110.0, 'P', 'punch', L => { kueste(L, { t: 'storm' }); wave(L.T, 520 - L.lt * 20, 82, .6, { glow: .55 }); crowdBox(L, -60, 60, 300, 380, 14, 65, { mode: 'run', ry: () => PI, speed: 11 });
  cm([10, 4, 240, 0, 46, 520, 62], [8, 4, 236, 0, 50, 520, 62], L.k); }, [[0, 'wave_roar', .9]]);
// 82 «Höher als die Klippen»: de perfil: la ola más alta que el acantilado y el pueblo
shot(111.38, 'W', 'slow', L => { kueste(L, { t: 'storm' }); wave(L.T, 330 - L.lt * 20, 82, .6, { glow: .5 }); crowdBox(L, -40, 40, -7, -10, 10, 67, { y: CH, mode: 'shock', face: V(0, 40, 300) });
  cm([-320, 40, 150, 0, 40, 170, 56], [-300, 42, 160, 0, 42, 170, 54], L.k); }, [[0, 'rumble_far', .8]]);
// 83 «Dunkelgrün»: primer plano de la cara de la ola, verde oscuro y translúcida
shot(112.99, 'F', null, L => { kueste(L, { t: 'day' }); wave(L.T, 300, 82, .6, { glow: .8 }); cm([20, 14, 200, 0, 70, 300, 52], [18, 16, 204, 0, 72, 300, 50], L.k); }, [[0, 'water_rush', .7]]);
// 84 «und die Sonne schien durch sie hindurch»: contraluz: el sol brilla a través de la cresta (verde esmeralda)
shot(113.88, 'R', null, L => { kueste(L, { t: 'day' }); SUND.set(0, .35, 1).normalize(); wave(L.T, 300, 82, .65, { glow: 1.1 }); cm([-10, 12, 200, 0, 80, 330, 56], [-8, 14, 206, 0, 82, 330, 56], L.k); BLOOMMAX = .5; bloom.strength = .5; }, [[0, 'shimmer', .6]]);
// 85 «Ich rutschte den Mast hinunter»: Jonte se desliza por el mástil abrazado a él
shot(115.35, 'S', null, L => { kueste(L, { t: 'storm' }); const p = mastP(1, lerp(.8, .3, easeIn(L.k))); put(jonte, p.x, p.y - 2, p.z + 1.2, PI); actuar(jonte, 0, [[0, { aLx: 2.6, aRx: 2.6, aLe: 1.2, aRe: 1.2, lLx: .6, lRx: .6, lLk: 1, lRk: 1 }]], { T: L.T, weight: false }); jonte.blob.visible = false; cara(jonte, L.T, { expr: 'shock', mouth: 'scream' });
  attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55); cm([p.x - 16, p.y - 4, p.z - 20, p.x, p.y, p.z, 50], [p.x - 15, p.y - 6, p.z - 19, p.x, p.y - 2, p.z, 50], L.k); }, [[0, 'slide_rope', .8]]);
// 86 «und rannte die fast sechs Kilometer zurück»: Jonte corre hacia cámara con todas sus fuerzas; la ola detrás
shot(116.61, 'Z', null, L => { kueste(L, { t: 'storm' }); run(jonte, L, 0, 260, PI, 9, 0, { expr: 'determined', mouth: 'grimace' }); attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55); wave(L.T, 420, 82, .6, { glow: .5 });
  const p = jonte.root.position; cm([p.x + 2, 5, p.z - 14, p.x, 5, p.z + 60, 52], [p.x + 2, 5, p.z - 12, p.x, 6, p.z + 60, 52], L.k); badge('gold', '6 KM', W / 2, H * .2, (L.lt - .2) * 3); }, [[0, 'footsteps_run', .8], [0, 'heavy_breath', .7]]);
// 87 «zurück»: travelling lateral, Jonte corriendo entre charcos que salpican
shot(117.6, 'W', null, L => { kueste(L, { t: 'storm' }); run(jonte, L, 0, 160, PI, 9, 0, { expr: 'determined', mouth: 'grimace' }); attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55); const p = jonte.root.position;
  cm([p.x + 14, 3, p.z, p.x, 3, p.z, 46], [p.x + 14, 3, p.z - 2, p.x, 3, p.z - 2, 46], L.k); }, [[0, 'splash_step', .7]]);
// 88 «Ich erreichte die Leiter»: Jonte llega al pie de la escalera y se agarra
shot(118.56, 'C', null, L => { kueste(L, { t: 'storm' }); const x = LX(6); const k = clamp(L.lt / .5); if (k < 1) run(jonte, L, x, 26, PI, 12, 0, { expr: 'determined', mouth: 'grimace' }); else onLadder(jonte, 6, .02 + (L.lt - .5) * .08, L, 0, { sp: 2 });
  cm([x + 10, 4, 34, x, 6, 14, 50], [x + 9, 5, 32, x, 7, 14, 50], L.k); }, [[.4, 'wood_clack', .7]]);
// 89 «und kletterte los»: picado: sube peldaño a peldaño, la arena muy abajo
shot(119.66, 'S', null, L => { kueste(L, { t: 'storm' }); onLadder(jonte, 6, .15 + L.k * .2, L, 0, { sp: 2, expr: 'determined', mouth: 'grimace' }); const p = jonte.root.position; cm([p.x + 3, p.y + 12, p.z + 6, p.x, p.y - 4, p.z + 2, 54], [p.x + 3, p.y + 11, p.z + 5, p.x, p.y - 4, p.z + 2, 54], L.k); }, [[0, 'ladder_steps', .7]]);
// 90 «Hinter mir wurde das Brüllen lauter»: desde detrás de Jonte en la escalera: la ola enorme llegando
shot(120.65, 'Z', 'slow', L => { kueste(L, { t: 'storm' }); onLadder(jonte, 6, .45 + L.k * .2, L, 0, { sp: 2, expr: 'shock', mouth: 'scream' }); wave(L.T, lerp(220, 130, L.k), 84, .7, { glow: .55 }); const p = jonte.root.position; SHAKE = .2 + L.k * .4;
  cm([p.x - 4, p.y + 4, p.z - 2, p.x + 4, p.y + 10, 200, 60], [p.x - 3, p.y + 3, p.z - 3, p.x + 4, p.y + 14, 200, 60], L.k); }, [[0, 'wave_roar', 1]]);
// 91 «Eine Hand packte mich am Handgelenk»: primer plano: una mano agarra la muñeca de Jonte en el último peldaño
shot(122.37, 'C', 'punch', L => { kueste(L, { t: 'storm' }); const x = LX(6); onLadder(jonte, 6, .93, L, 0, { sp: .3, expr: 'shock', mouth: 'o' });
  put(mama, x, CH, -4.8, 0); actuar(mama, 0, [[0, { aRx: 2.3, aRe: .1, lean: .55, crouch: .25, aLx: 1.2, headX: .4 }]], { T: L.T }); cara(mama, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([x + 9, CH + 3, 12, x, CH + 1, -1, 44], [x + 8, CH + 3, 10, x, CH + 1, -1, 42], L.k); }, [[0, 'grab', .8]]);
// 92 «und zog mich hoch»: Mama tira de él por encima de la barandilla
shot(124.03, 'W', null, L => { kueste(L, { t: 'storm' }); const x = LX(6), k = easeInOut(clamp(L.lt / .8)); put(jonte, x, lerp(CH - 3, CH + .3, k), lerp(1, -7, k), lerp(PI, 0, k)); actuar(jonte, 0, [[0, { aRx: 2.8, aLx: 1.6, lLx: .8, lLk: 1 }]], { T: L.T, weight: false }); cara(jonte, L.T, { expr: 'shock', mouth: 'o' }); jonte.blob.visible = false;
  pose(mama, x + 1, CH, -9.5, 0, L, { aRx: 1.8 - k * .6, aLx: 1.8 - k * .6, lean: -.3, crouch: .2 }, 'determined', { mouth: 'grimace' });
  cm([x + 12, CH + 6, -22, x, CH + 2, -5, 46], [x + 10, CH + 6, -20, x, CH + 2, -5, 46], L.k); }, [[0, 'heave', .7]]);
// 93 «Mama.»: abrazo; la cara de Mama aliviada
shot(124.94, 'I', null, L => { kueste(L, { t: 'storm' }); const x = LX(6); pose(mama, x, CH, -12, PI + .3, L, { aLx: 1.4, aRx: 1.4, aLz: -.5, aRz: -.5, aLe: 1.4, aRe: 1.4 }, 'relief', { mouth: 'smile' }); tears(mama, L.T);
  pose(jonte, x - .6, CH, -13.6, .3, L, { aLx: 1.3, aRx: 1.3, aLz: -.5, aRz: -.5, aLe: 1.3, aRe: 1.3 }, 'relief'); onFace(mama, 7, .3, 1.5, 42, L.k, 5.5); }, [[0, 'soft_air', .5]]);
// 94 «Die Welle krachte unter uns gegen die Klippen»: desde arriba: la ola rompe contra el acantilado, la gente agarrada a la barandilla
shot(125.43, 'S', null, L => { kueste(L, { t: 'storm', sea: 1, seaY: lerp(8, 30, L.k) }); wave(L.T, lerp(80, 24, L.k), 82, lerp(.6, .95, L.k), { glow: .5 }); crowdBox(L, -30, 30, -7, -10, 12, 69, { y: CH, mode: 'shock', ry: () => PI });
  cm([-18, CH + 14, -18, 0, 18, 60, 58], [-16, CH + 15, -20, 0, 16, 60, 60], L.k); SHAKE = .3 + L.k * .5; }, [[0, 'wave_crash', 1]]);
// 95 «BUMM!»: impacto: columna de espuma blanca, destello y sacudida
shot(127.33, 'C', 'punch', L => { kueste(L, { t: 'storm', sea: 1, seaY: 30 }); SPRITZ.userData.burst(V(0, 20, 10), L.lt * 1.2, { h: 160, sx: 300 }); SHAKE = 1 - L.k * .5; grade.uniforms.flash.value = Math.max(0, .7 - L.lt * 2);
  cm([60, 30, 140, 0, 50, 0, 60], [56, 32, 136, 0, 54, 0, 60], L.k); badge('big', 'BUMM!', W / 2, H * .2, L.lt * 4, 1, 1.4); }, [[0, 'boom', 1], [0, 'wave_crash', .8]]);
// 96 «Das Wasser schoss vierzig Meter in die Luft»: la columna de agua sube por encima de los tejados; 40 METER
shot(128.06, 'Z', null, L => { kueste(L, { t: 'storm', sea: 1, seaY: 28 }); SPRITZ.userData.burst(V(0, 20, 10), .9 + L.lt * .9, { h: 160, sx: 300 }); crowdBox(L, -30, 30, -8, -14, 10, 71, { y: CH, mode: 'shock', face: V(0, 120, 20) });
  cm([10, CH + 4, -20, 0, CH + 60, 20, 62], [8, CH + 3, -18, 0, CH + 70, 20, 62], L.k); badge('cyan', '40 METER', W / 2, H * .2, (L.lt - .6) * 3, 1, 1.2); }, [[0, 'water_rush', .7]]);
// 97 «Und fiel wie Regen auf die ganze Stadt»: lluvia sobre el pueblo, la gente alza los brazos; arcoíris
shot(130.28, 'F', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -20), L.T, { r: 60, h: 60 }); BOGEN.visible = true; BOGEN.position.set(-200, -300, -1500); BOGEN.lookAt(camera.position);
  crowdBox(L, -30, 30, -10, -24, 14, 73, { y: CH, mode: i => i % 2 ? 'cheer' : 'look', face: V(0, CH + 40, 30), expr: 'joy' });
  cm([0, CH + 6, 20, 0, CH + 12, -60, 56], [0, CH + 7, 14, 0, CH + 14, -60, 56], L.k); }, [[0, 'rain', .8]]);
// 98 «Ich sah mich um»: Jonte empapado mira a su alrededor
shot(132.48, 'S', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -14), L.T, { r: 30, h: 40 }); pose(jonte, 0, CH, -12, PI + Math.sin(L.T * 1.5) * .6, L, { headY: Math.sin(L.T * 2) * .5 }, 'shock', { mouth: 'o' });
  cm([1, CH + 6, -24, 0, CH + 4.5, -10, 44], [1, CH + 5.6, -22, 0, CH + 4.5, -10, 42], L.k); }, [[0, 'rain', .6]]);
// 99 «Jede Familie»: una familia se abraza bajo la lluvia
shot(133.42, 'W', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -14), L.T, { r: 30, h: 40 }); const H_ = { aLx: 1.4, aRx: 1.4, aLz: -.5, aRz: -.5, aLe: 1.3, aRe: 1.3 };
  pose(NB[0], -2, CH, -12, PI - .6, L, H_, 'relief', { mouth: 'smile' }); pose(NB[2], 1.6, CH, -12.6, PI + .6, L, H_, 'relief', { mouth: 'smile' }); pose(NB[3], 0, CH, -14.2, PI, L, { ...H_, aLz: .3, aRz: .3 }, 'joy');
  cm([0, CH + 5, -24, 0, CH + 3.4, -11, 44], [0, CH + 5, -22, 0, CH + 3.4, -11, 42], L.k); }, [[0, 'cheer_soft', .5]]);
// 100 «Jedes Kind»: los niños saltan en los charcos del paseo
shot(134.32, 'C', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -14), L.T, { r: 30, h: 40 }); crowdBox(L, -8, 8, -10, -14, 4, 75, { y: CH, mode: 'cheer', list: [NB[8], NB[13], NB[18], NB[23]] });
  cm([0, CH + 3.5, -24, 0, CH + 3, -11, 44], [0, CH + 3.8, -22, 0, CH + 3, -11, 42], L.k); }, [[0, 'kids_laugh', .6], [.2, 'splash_step', .6]]);
// 101 «Jede Oma»: dos abuelas ríen a carcajadas, chorreando
shot(135.22, 'R', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -14), L.T, { r: 30, h: 40 }); pose(NB[5], -2, CH, -12, PI - .4, L, { aLx: 1.2, aLe: 1.6 }, 'joy'); laughF(NB[5], L.T); pose(NB[15], 2, CH, -12, PI + .4, L, { aRx: 2.4, aRe: .4 }, 'joy'); laughF(NB[15], L.T + 1);
  cm([0, CH + 4.6, -24, 0, CH + 3.8, -11, 42], [0, CH + 4.6, -22, 0, CH + 3.8, -11, 40], L.k); }, [[0, 'laugh_old', .6]]);
// 102 «Alle hatten es geschafft»: el pueblo alza a Jonte a hombros; confeti de agua y gaviotas que vuelven
shot(136.0, 'Z', 'punch', L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); put(jonte, 0, CH + 4 + Math.abs(Math.sin(L.T * 6)) * 1.2, -12, PI); actuar(jonte, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5 }]], { T: L.T, weight: false }); laughF(jonte, L.T); jonte.blob.visible = false; attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 1.4], .55);
  crowdAt(L, 0, -12, 14, 3, 9, 77, { y: CH, mode: 'cheer', list: [mama, opa, papa, broesel, ...NB] }); MOEW.fly(L.T, V(-40, CH + 30, 20), V(1, 0, .2), { lt: L.lt, n: 14, speed: 10 });
  cm([0, CH + 7, -24.5, 0, CH + 6, -9, 54], [0, CH + 7.5, -23, 0, CH + 6, -9, 52], L.k); }, [[0, 'crowd_cheer', .8]]);
// 103 «Jetzt hängt Opas Muschelhorn im Rathaus»: la sala del Rathaus, la caracola en su placa; Opa y Jonte delante
shot(137.31, 'B', null, L => { saal(L); pose(opa, RHX - 6, 0, -22, .35, L, { headY: -.3 }, 'warm', { mouth: 'smile' }); pose(jonte, RHX + 6, 0, -22, -.35, L, { headY: .3, aRx: 1.4, aRe: .1, aRz: -.4 }, 'happy', { mouth: 'smile' });
  cm([RHX + 4, 13, 4, RHX, 12, -26, 50], [RHX + 3, 13, 0, RHX, 12.5, -26, 48], L.k); }, [[0, 'room_hall', .5]]);
// 104 «Und in hundert Jahren»: zoom lento a la placa «NÄCHSTE EBBE: MITTAGS BLASEN»
shot(139.27, 'F', 'slow', L => { saal(L); cm([RHX, 11, -12, RHX, 10.4, -29, 44], [RHX, 10.8, -18, RHX, 10.4, -29, 40], L.k); badge('gold', '100 JAHRE', W / 2, H * .22, (L.lt - .3) * 3); }, [[0, 'clock_tick', .5]]);
// 105 «am Mittag, wird es jemand blasen»: primer plano de la caracola brillando a la luz de la ventana
shot(140.6, 'I', null, L => { saal(L); const h = wpos(HORN2); cm([h.x + 4, h.y - 1, h.z + 10, h.x, h.y, h.z, 40], [h.x + 3, h.y - .8, h.z + 8.5, h.x, h.y, h.z, 38], L.k); }, [[0, 'sparkle', .6]]);
// 106 «Nur für den Fall»: final: Jonte guiña el ojo a cámara junto a Opa; detrás, por la ventana, el mar tranquilo
shot(142.33, 'W', null, L => { saal(L); pose(opa, RHX - 2.4, 0, -20, .2, L, {}, 'warm', { mouth: 'smile' }); pose(jonte, RHX + 2, 0, -19, -.15, L, { aRx: 1.4, aRe: 1.6, aRz: .3 }, 'happy', { eyes: 'wink', mouth: 'smirk' }); BUCKET.visible = false;
  onFace(jonte, 9, .6, -2, 44, L.k, 7.5); }, [[0, 'pling', .6]]);
