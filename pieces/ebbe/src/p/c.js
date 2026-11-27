// ---------- c: las conchas cantan, la ola se forma, el Muschelhorn, la huida (67,5 – 110 s) ----------
const SC = V(-50, 0, 880);   // donde Jonte recoge las conchas, junto al barco pirata
// 51 «Am Mittag hob ich eine Muschel auf»: mediodía; Jonte se agacha y recoge una concha
shot(67.53, 'C', null, L => { kueste(L, { t: 'noon' }); const k = easeInOut(clamp(L.lt / .8)); pose(jonte, SC.x, 0, SC.z, .4, L, { crouch: .5 - k * .3, lean: .5 - k * .3, aRx: 1.4 + k * .6, aRe: .3 + k * .6, headX: .4 - k * .2 }, 'happy', { mouth: 'smile' });
  attach(SHELLS[2], jonte.aR.hand, [0, -.5, .3], [0, 0, 0], 1.1); onBody(jonte, 12, .3, .25, 44, L.k, 10); }, [[.2, 'shell_clink', .6]]);
// 52 «Sie sang»: la concha suelta notas; Jonte abre mucho los ojos
shot(69.31, 'F', 'punch', L => { kueste(L, { t: 'noon' }); pose(jonte, SC.x, 0, SC.z, .4, L, { aRx: 2.2, aRz: .3, aRe: 1.8 }, 'shock', { mouth: 'o' }); attach(SHELLS[2], jonte.aR.hand, [0, -.5, .3], [0, 0, 0], 1.1);
  notes(wpos(SHELLS[2]), L.T, 5, .9); onFace(jonte, 6, .3, 1.2, 40, L.k, 5); }, [[0, 'shell_sing1', .8]]);
// 53 «Dann noch eine»: otra concha en la arena empieza a cantar a su lado
shot(69.88, 'S', null, L => { kueste(L, { t: 'noon' }); show(SHELLS[4], SC.x + 3, .25, SC.z + 4, 1, 1.4); notes(V(SC.x + 3, .5, SC.z + 4), L.T, 4, .8); pose(jonte, SC.x, 0, SC.z, 1.2, L, { headX: .3 }, 'shock', { mouth: 'o' });
  cm([SC.x + 6, 2, SC.z + 9, SC.x + 3, .8, SC.z + 4, 38], [SC.x + 5.5, 1.8, SC.z + 8, SC.x + 3, .8, SC.z + 4, 36], L.k); }, [[0, 'shell_sing2', .8]]);
// 54 «Und noch eine»: y otra, más allá
shot(70.52, 'R', null, L => { kueste(L, { t: 'noon' }); show(SHELLS[5], SC.x - 4, .25, SC.z + 6, 2, 1.4); notes(V(SC.x - 4, .5, SC.z + 6), L.T, 4, .8); show(SHELLS[4], SC.x + 3, .25, SC.z + 4, 1, 1.4); notes(V(SC.x + 3, .5, SC.z + 4), L.T + .3, 4, .8, 4);
  cm([SC.x - 8, 2.4, SC.z + 12, SC.x - 3, .8, SC.z + 5, 40], [SC.x - 7, 2.2, SC.z + 11, SC.x - 3, .8, SC.z + 5, 38], L.k); }, [[0, 'shell_sing3', .8]]);
// 55 «Alle Muscheln auf dem Meeresboden sangen gleichzeitig»: plano general: notas brotando de toda la arena hasta el horizonte; Jonte en medio
shot(71.57, 'Z', 'punch', L => { kueste(L, { t: 'noon' }); pose(jonte, SC.x, 0, SC.z, PI, L, { aLx: .4, aRx: .4, aLz: .4, aRz: .4 }, 'shock', { mouth: 'o' });
  for (let i = 0; i < 14; i++) { const r = RNG(i * 3 + 1); NOTES[i].visible = true; const k = (L.T * .6 + r()) % 1; NOTES[i].position.set(SC.x + (r() - .5) * 60, k * 9 + 1, SC.z - 6 - r() * 50); NOTES[i].scale.setScalar(2.2 * Math.sin(k * PI) + .2); NOTES[i].material.opacity = Math.sin(k * PI); NOTES[i].lookAt(camera.position); }
  cm([SC.x, 5, SC.z + 22, SC.x, 4, SC.z - 30, 54], [SC.x, 8, SC.z + 26, SC.x, 4, SC.z - 30, 54], L.k); }, [[0, 'shells_choir', .9]]);
// 56 «Stunden zu früh»: Jonte mira el reloj de la torre a lo lejos… y al cartel en su cabeza: 12:00 (debía ser al atardecer)
shot(74.28, 'G', null, L => { kueste(L, { t: 'noon' }); pose(jonte, SC.x, 0, SC.z, PI + .3, L, { aLx: 1.2, aLe: 1.6, headX: -.1 }, 'worried'); sweat(jonte, L.T);
  onFace(jonte, 7, .4, -1.5, 42, L.k); jonte.root.rotation.y = .3; badge('red', '12:00 — ZU FRÜH!', W / 2, H * .22, (L.lt - .15) * 3, 1, .8); }, [[0, 'clock_tick', .7]]);
// 57 «Ich sah zum Horizont»: de espaldas, Jonte mira al mar lejano; el horizonte se ve oscuro
shot(75.38, 'B', null, L => { kueste(L, { t: 'storm' }); pose(jonte, SC.x, 0, SC.z, PI, L, { headX: -.1 }, 'worried'); wave(L.T, 2400, 18, .1, { glow: .2 });
  cm([SC.x + 3, 6, SC.z - 10, SC.x, 6, SC.z + 600, 40], [SC.x + 2, 6.4, SC.z - 8, SC.x, 7, SC.z + 600, 38], L.k); }, [[0, 'wind_strong', .6]]);
// 58 «Er stieg»: zoom lento al horizonte: una línea verde oscura que crece
shot(76.6, 'Z', 'slow', L => { kueste(L, { t: 'storm' }); wave(L.T, 2200, lerp(18, 40, L.k), .2, { glow: .2 }); cm([SC.x, 8, SC.z + 30, SC.x, 12, SC.z + 900, 30], [SC.x, 8, SC.z + 40, SC.x, 14, SC.z + 900, 22], L.k); }, [[0, 'rumble_far', .8]]);
// 59 «Das Meer war nicht für einen Tag weggegangen»: cielo que se oscurece sobre el barco pirata; la gente aún tranquila
shot(77.38, 'W', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 2100, 44, .25, { glow: .2 }); const S_ = MW.SCHIFF.position; crowdBox(L, S_.x - 40, S_.x + 40, S_.z - 120, S_.z - 60, 8, 41, { mode: 'look', face: V(0, 0, 0), expr: 'happy' });
  cm([S_.x - 60, 10, S_.z - 160, S_.x, 26, S_.z + 300, 54], [S_.x - 56, 12, S_.z - 150, S_.x, 26, S_.z + 300, 54], L.k); }, [[0, 'wind_strong', .6]]);
// 60 «Es hatte nur Luft geholt»: el mar retrocede aún más y se levanta como si inhalara (sonido de succión)
shot(79.58, 'P', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 1900, lerp(44, 66, L.k), lerp(.25, .4, L.k), { glow: .35 }); cm([0, 30, 1500, 0, 40, 1900, 56], [0, 26, 1520, 0, 44, 1900, 56], L.k); }, [[0, 'water_suck', .9]]);
// 61 «Für die größte Welle seit hundert Jahren»: la ola enorme, verde, con la cresta blanca; zoom lento
shot(81.19, 'F', 'slow', L => { kueste(L, { t: 'storm' }); wave(L.T, 1700, lerp(66, 80, L.k), .5, { glow: .5 }); cm([30, 10, 1450, 0, 50, 1700, 58], [24, 12, 1480, 0, 54, 1700, 54], L.k); badge('red', '100 JAHRE', W / 2, H * .2, (L.lt - 1) * 3, 1, .9); }, [[0, 'wave_roar', .8]]);
// 62 «Und die ganze Stadt stand kilometerweit draußen»: vista aérea: familias dispersas por el fondo marino, diminutas, haciendo picnic
shot(83.18, 'S', null, L => { kueste(L, { t: 'storm' }); crowdBox(L, -80, 80, 500, 900, 30, 43, { mode: i => ['dig', 'look', 'talk', 'walk', 'clap'][i % 5], expr: 'happy' });
  cm([0, 110, 500, 0, 0, 800, 56], [0, 120, 540, 0, 0, 840, 56], L.k); badge('tag', 'KILOMETERWEIT', W / 2, H * .2, (L.lt - .2) * 3); }, [[0, 'wind_strong', .5]]);
// 63 «auf dem Meeresboden»: una familia de picnic ríe sobre una manta, de espaldas al mar
shot(86.12, 'C', null, L => { kueste(L, { t: 'storm' }); const c = V(-30, 0, 620); const bl = PLAQ; [NB[1], NB[6], NB[11]].forEach((p_, i) => { sit(p_, c.x - 3 + i * 3, .8, c.z, -.2 + i * .2, L, { aRx: 1 + Math.sin(L.T * 3 + i) * .3, aRe: 1 }); laughF(p_, L.T + i); });
  pose(broesel, c.x + 6, 0, c.z + 2, -.4, L, { aRx: 2.4, aRe: .4 }, 'joy'); laughF(broesel, L.T); cm([c.x + 2, 5, c.z + 16, c.x + 1, 2.8, c.z, 44], [c.x + 1, 4.6, c.z + 14, c.x + 1, 2.8, c.z, 42], L.k); }, [[0, 'picnic_laugh', .6]]);
// 64 «Ich schrie»: Jonte grita con las manos en la boca
shot(87.32, 'Z', 'punch', L => { kueste(L, { t: 'storm' }); pose(jonte, SC.x, 0, SC.z - 60, PI, L, { aLx: 2.3, aRx: 2.3, aLz: -.2, aRz: -.2, aLe: 1.8, aRe: 1.8, lean: .1 }, 'shout', { mouth: 'scream' }); jonte.root.rotation.y = 0;
  onFace(jonte, 6, .3, 1.5, 42, L.k, 5); }, [[0, 'kid_shout', .7]]);
// 65 «Niemand hörte mich»: la gente lejos, sin girarse; su voz se pierde en el viento
shot(88.04, 'I', null, L => { kueste(L, { t: 'storm' }); crowdBox(L, -40, 40, 360, 420, 10, 47, { mode: i => ['dig', 'talk', 'look'][i % 3], face: V(0, 0, 0), expr: 'happy' }); pose(jonte, 0, 0, 470, PI, L, { aLx: 2.3, aRx: 2.3, aLe: 1.8, aRe: 1.8 }, 'shout', { mouth: 'scream' });
  cm([6, 7, 486, 0, 3, 380, 46], [5, 7.5, 488, 0, 3, 380, 44], L.k); }, [[0, 'wind_strong', .7]]);
// 66 «Dann dachte ich an Opas Muschelhorn»: Jonte saca el Muschelhorn de la mochila/cubo; recuerdo de Opa (tono cálido)
shot(89.2, 'F', null, L => { kueste(L, { t: 'storm' }); pose(jonte, SC.x, 0, SC.z - 30, 0, L, { aRx: lerp(.6, 1.6, easeOut(clamp(L.lt / .6))), aRe: .6, aLx: .4 }, 'determined'); attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55);
  const h = wpos(HORN); cm([h.x + 4, h.y + 2.4, h.z + 7, h.x, h.y + .8, h.z, 42], [h.x + 3.4, h.y + 2, h.z + 6, h.x, h.y + .8, h.z, 40], L.k); }, [[0, 'sparkle', .6]]);
// 67 «Ich kletterte auf den Mast»: Jonte trepa por el mástil inclinado del barco pirata
shot(91.17, 'W', null, L => { kueste(L, { t: 'storm' }); const p = mastP(1, lerp(.3, .55, L.k)); put(jonte, p.x, p.y - 2, p.z + 1.2, PI); actuar(jonte, 0, [[0, climbP(L.T, 0)]], { T: L.T, weight: false }); jonte.blob.visible = false; cara(jonte, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([p.x - 16, p.y - 10, p.z - 22, p.x, p.y, p.z, 50], [p.x - 15, p.y - 8, p.z - 20, p.x, p.y + 1, p.z, 50], L.k); }, [[0, 'wood_creak', .7], [.2, 'rope_creak', .5]]);
// 68 «des Piratenschiffs»: plano general del barco con Jonte arriba, la ola a lo lejos
shot(92.39, 'Z', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 1600, 74, .5, { glow: .45 }); const p = mastP(1, .7); put(jonte, p.x, p.y - 2, p.z + 1.2, PI); actuar(jonte, 0, [[0, climbP(L.T, 0)]], { T: L.T, weight: false }); jonte.blob.visible = false;
  const S_ = MW.SCHIFF.position; cm([S_.x - 40, 8, S_.z - 80, S_.x, 30, S_.z + 100, 54], [S_.x - 36, 10, S_.z - 72, S_.x, 32, S_.z + 100, 54], L.k); }, [[0, 'wave_roar', .5]]);
// 69 «Ich holte so tief Luft»: en la cofa, Jonte inspira hondo, pecho hinchado, la caracola en los labios
shot(93.39, 'S', null, L => { kueste(L, { t: 'storm' }); const p = mastP(1, .86); const ins = easeOut(clamp(L.lt / 1.2)); pose(jonte, p.x, p.y + .2, p.z, .2, L, { aRx: 2.2, aRe: 1.8, aLx: 2, aLe: 1.6, headX: -.2 * ins, lean: -.1 * ins, sx: 1 + ins * .06 }, 'determined', { mouth: 'o' }); jonte.blob.visible = false;
  attach(HORN, jonte.aR.hand, [.5, -.4, .6], [0, 0, .6], .55); onFace(jonte, 6, .4, 2, 42, L.k, 5); }, [[0, 'inhale_deep', .9]]);
// 70 «wie noch nie in meinem Leben»: zoom lento a su cara con las mejillas hinchadas
shot(94.85, 'I', 'slow', L => { kueste(L, { t: 'storm' }); const p = mastP(1, .86); pose(jonte, p.x, p.y + .2, p.z, .2, L, { aRx: 2.3, aRe: 1.9, aLx: 2.1, aLe: 1.7, headX: -.25 }, 'determined', { mouth: 'o', eyes: 'squint' }); jonte.blob.visible = false;
  attach(HORN, jonte.aR.hand, [.5, -.4, .6], [0, 0, .6], .55); onFace(jonte, 5, .3, -1.5, 40, L.k, 3.6); }, []);
// 71 «Und ich blies»: ¡sopla! anillos de sonido salen de la caracola; golpe de zoom
shot(96.03, 'C', 'punch', L => { kueste(L, { t: 'storm' }); const p = mastP(1, .86); pose(jonte, p.x, p.y + .2, p.z, .2, L, { aRx: 2.3, aRe: 1.9, aLx: 2.1, aLe: 1.7, headX: -.1 }, 'determined', { mouth: 'o', eyes: 'closed' }); jonte.blob.visible = false;
  attach(HORN, jonte.aR.hand, [.5, -.4, .6], [0, 0, .6], .55); const h = wpos(HORN); RINGS.forEach((r, i) => { const q = (L.lt * 1.4 - i * .2); if (q <= 0 || q > 1) return; r.visible = true; r.position.copy(h); r.lookAt(h.clone().add(V(Math.sin(.2), 0, Math.cos(.2)))); r.scale.setScalar(1 + q * 14); r.material.opacity = .5 * (1 - q); });
  SHAKE = .4; onFace(jonte, 9, 1, 3, 46, L.k, 8); }, [[0, 'horn_blast', 1]]);
// 72 «Der Ton rollte über den Meeresboden wie Donner»: anillos gigantes recorren el fondo marino, los charcos vibran, la arena salta
shot(97.14, 'Z', null, L => { kueste(L, { t: 'storm' }); const S_ = MW.SCHIFF.position; rings(V(S_.x, 0, S_.z), L.k, 4, 420, 2); SHAKE = .25; crowdBox(L, -60, 60, 420, 600, 14, 51, { mode: 'look', face: V(S_.x, 20, S_.z), expr: 'shock' });
  cm([S_.x + 60, 70, S_.z - 260, S_.x, 0, S_.z - 60, 60], [S_.x + 50, 80, S_.z - 280, S_.x, 0, S_.z - 60, 60], L.k); }, [[0, 'thunder_roll', .8]]);
// 73 «Alle drehten sich um»: las familias del fondo marino se giran a la vez hacia el sonido
shot(99.73, 'W', null, L => { kueste(L, { t: 'storm' }); crowdBox(L, -24, 24, 440, 470, 12, 53, { mode: 'look', ry: i => lerp(0, PI, easeInOut(clamp(L.k * 1.6 - i * .05))), expr: 'shock' });
  cm([0, 6, 420, 0, 4, 460, 48], [0, 6.5, 424, 0, 4, 460, 46], L.k); }, [[0, 'crowd_gasp', .7]]);
// 74 «Sie sahen die Welle»: por encima de sus hombros: la ola gigante en el horizonte
shot(100.94, 'B', 'punch', L => { kueste(L, { t: 'storm' }); wave(L.T, 1300, 80, .55, { glow: .5 }); crowdBox(L, -20, 20, 460, 470, 8, 55, { mode: 'shock', ry: () => 0 });
  cm([4, 9, 440, 0, 30, 1300, 54], [3, 9.5, 444, 0, 32, 1300, 52], L.k); }, [[0, 'wave_roar', .8], [0, 'crowd_scream', .6]]);
// 75 «Und sie rannten»: todos corren hacia cámara, la ola detrás
shot(101.78, 'C', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 1250, 80, .55, { glow: .5 }); crowdBox(L, -22, 22, 470, 500, 12, 57, { mode: 'run', ry: () => PI, speed: 10, expr: 'shock' });
  cm([0, 6, 430 - L.lt * 10, 0, 8, 520, 54], [0, 6, 424 - L.lt * 10, 0, 8, 520, 54], L.k); }, [[0, 'footsteps_run', .8], [0, 'crowd_scream', .5]]);
// 76 «Familien rasten zwischen den Wracks hindurch»: travelling lateral junto al carguero oxidado
shot(102.92, 'S', null, L => { kueste(L, { t: 'storm' }); const Wr = MW.WRACKS[1].position; crowdBox(L, Wr.x - 20, Wr.x + 10, Wr.z + 10, Wr.z + 30, 10, 59, { mode: 'run', ry: () => PI, speed: 11 }); run(mama, L, Wr.x - 4, Wr.z + 20, PI, 11, 2);
  cm([Wr.x + 26, 5, Wr.z + 10 - L.lt * 11, Wr.x - 4, 5, Wr.z + 10 - L.lt * 11, 52], [Wr.x + 24, 5, Wr.z + 6 - L.lt * 11, Wr.x - 4, 5, Wr.z + 6 - L.lt * 11, 52], L.k); }, [[0, 'footsteps_run', .7], [.2, 'metal_creak', .5]]);
// 77 «Wracks hindurch»: bajo la proa de otro pecio, gente saltando las rocas
shot(104.2, 'R', null, L => { kueste(L, { t: 'storm' }); const Wr = MW.WRACKS[0].position; crowdBox(L, Wr.x - 10, Wr.x + 14, Wr.z + 6, Wr.z + 26, 8, 61, { mode: 'run', ry: () => PI + .3, speed: 11 });
  cm([Wr.x + 4, 2, Wr.z - 16, Wr.x, 6, Wr.z + 20, 58], [Wr.x + 3, 2.2, Wr.z - 18, Wr.x, 6, Wr.z + 20, 58], L.k); }, [[0, 'footsteps_run', .7]]);
// 78 «Papas mit Kindern auf den Schultern»: Papa Ole corre con un niño a hombros
shot(105.15, 'W', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 900, 80, .6, { glow: .5 }); run(papa, L, 6, 300, PI, 10, 1); const kid = NB[13]; put(kid, 0, 0, 0, 0); papa.spine.add(kid.root); kid.root.position.set(0, .9, -.4); kid.root.rotation.set(0, 0, 0); kid.root.scale.setScalar(.9); actuar(kid, 0, [[0, sitPose({ aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4 })]], { T: L.T, weight: false }); kid.blob.visible = false; cara(kid, L.T, { expr: 'shock', mouth: 'o' });
  const p = papa.root.position; cm([p.x + 3, 7, p.z - 12, p.x, 6, p.z, 50], [p.x + 3, 7, p.z - 11, p.x, 6, p.z, 50], L.k); }, [[0, 'footsteps_run', .7], [0, 'heavy_breath', .5]]);
// 79 «Omas, die die Leitern … hochkletterten»: abuelas subiendo las escaleras a toda velocidad
shot(106.79, 'S', null, L => { kueste(L, { t: 'storm' }); const om = [NB[5], NB[15], NB[25], NB[35]]; om.forEach((c, i) => onLadder(c, 4 + i, .2 + i * .12 + L.k * .5, L, i, { sp: 2.2, expr: 'determined', mouth: 'grimace' }));
  cm([LX(5) + 24, 10, 54, LX(5) + 12, 24, 4, 52], [LX(5) + 20, 16, 50, LX(5) + 12, 30, 4, 52], L.k); }, [[0, 'ladder_steps', .8]]);
// 80 «schneller … als ich es je gesehen hatte»: picado desde arriba: las escaleras llenas de gente subiendo rapidísimo
shot(107.95, 'Z', null, L => { kueste(L, { t: 'storm' }); for (let i = 3; i < 9; i++) for (let j = 0; j < 3; j++) onLadder(NB[(i * 3 + j) % 40], i, .1 + j * .3 + L.k * .2, L, i * 3 + j, { sp: 2.2, expr: 'shock' });
  crowdBox(L, -60, 60, -7, -10, 8, 63, { y: CH, mode: 'point', face: V(0, 0, 60), list: [mama, opa, ...NB.slice(36)] });
  cm([LX(5) + 4, CH + 24, -14, LX(5) + 4, 22, 10, 56], [LX(5) + 4, CH + 27, -16, LX(5) + 4, 22, 12, 56], L.k); }, [[0, 'ladder_steps', .8], [.3, 'crowd_scream', .4]]);
