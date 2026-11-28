// ---------- c: el Vape-Tag, la abuela, el alcalde, mi hermano al cielo, la escalera de nubes, la lluvia, el premio y el castigo (70,41 – 116,1 s) ----------
// cartel de frontera «ÖSTERREICH» (rojo-blanco-rojo) junto a la carretera, lejos (z = 640)
const ASIGN = P_(castSh((() => { const g = new THREE.Group(); for (const s of [-1, 1]) cyl(.25, .25, 9, mat(0x9aa0a8, { metalness: .7 }), 8, g, s * 3.6, 4.5, 0);
  const t = textPlane(9, 5, 450, 250, (c, w, h) => { c.fillStyle = '#ed2939'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(0, h / 3, w, h / 3); c.strokeStyle = '#ffffff'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); c.fillStyle = '#1a1a1a'; c.font = `700 58px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('ÖSTERREICH', w / 2, h / 2 + 3); });
  t.position.set(0, 8, .3); g.add(t); box(9.4, 5.4, .3, mat(0xd8d8d8), .1, g, 0, 8, 0); return g; })()));
// escalera de nubes: escalón i en espiral alrededor de (0, y, -4) subiendo hasta mi hermano (cima ≈ y 44)
const stepPos = i => V(Math.cos(i * .8) * 7, 3 + i * 5, -4 + Math.sin(i * .8) * 7);
const TOPP = V(0, 50, -4);
function stairs(n, L, grow = 0) { STEPS.forEach((s, i) => { if (i >= n) return; const p = stepPos(i); const k = i === n - 1 && grow ? clamp(grow) : 1; s.visible = k > 0; s.position.copy(p); s.scale.set(k, k * .7, k); s.rotation.y = i; }); }
// mi hermano sobre su nube melocotón gigante a la altura y
function broCloud(L, y, o = {}) { show(BIG, o.x ?? 0, y - 3, o.z ?? -4, L.T * .1, o.s ?? 1); BIG.userData.m.color.set(o.col ?? 0xffc0a0); BIG.userData.m.emissive.set(o.col ?? 0xffc0a0);
  put(bro, (o.x ?? 0), y + 2.2, (o.z ?? -4) + 1, o.ry ?? 0); actuar(bro, 0, [[0, o.pose || { aLx: 2.6, aRx: 2.6, aLz: .6 + Math.sin(L.T * 9) * .3, aRz: .6 + Math.sin(L.T * 9 + 1) * .3, lLx: .3, lRx: -.2, crouch: .1 }]], { T: L.T }); cara(bro, L.T, { expr: o.expr || 'shock', mouth: o.mouth || 'scream', eyes: o.eyes || 'terror' }); FACES.push(bro); bro.blob.visible = false; }
// público del Vape-Tag delante del escenario (todos con su vape)
function publico(L, n = 22, mode = 'cheer', o = {}) { crowdBox(L, o.x0 ?? -22, o.x1 ?? 22, o.z0 ?? -12, o.z1 ?? 12, n, o.seed ?? 9, { mode, face: o.face ?? V(0, 5, -26), from: o.from || 0, expr: o.expr }); }
// todos echan la nube hacia arriba a la vez (en POST, después de colocar al público)
function allPuff(L, t0, o = {}) { POST.push(() => { EXS.filter(c => c.root.visible).slice(0, o.n ?? 18).forEach((c, i) => { vaper(c, L, t0 + (i % 5) * .04, .3, { bg: true, expr: 'joy', size: o.size ?? 2.2, pow: o.pow ?? 9, n: o.np ?? 40, up: o.up ?? 1.6, dirUp: o.dirUp ?? 1.2, col: o.col, life: 3 }); }); }); }

// 64 «Vape-Tag.»: el día: la plaza llena, nubes de colores, confeti, fanfarria
shot(70.41, 'Z', 'punch', L => { stadt(L, 'noon'); publico(L, 26, 'cheer'); confetti(V(0, 0, 0), L.t0, L.T, 60, 18); SMK.tint.set(0xffd0f0); SMK.haze(V(0, 18, -6), L.T, 26, 26, 4, 14, 6, .35, 4);
  cm([0, 16, 34, 0, 9, -16, 50], [0, 14, 30, 0, 9, -16, 48], L.k); SHC = V(0, 0, -6); top('VAPE-TAG', (L.lt - .05) * 4, 'gold', .13, 1.1); }, [[.02, 'fanfare', .8], [.2, 'crowd_cheer', .7]]);
// 65 «Die ganze Stadt stand»: desde el escenario: el pueblo entero mirando, con los vapes en alto
shot(71.38, 'S', null, L => { stadt(L, 'noon'); publico(L, 30, i => i % 3 ? 'cheer' : 'look', { z0: -14, z1: 16, face: V(0, 5, -24) }); cm([-6, 10, -18, 0, 4, 6, 50], [6, 10.6, -17, 0, 4, 6, 50], L.k); SHC = V(0, 0, 2); },
  [[.05, 'crowd_cheer', .6], [.5, 'whistle_crowd', .4]]);
// 66 «auf dem Marktplatz.»: vista aérea de la plaza a reventar (grúa que sube)
shot(72.32, 'R', null, L => { stadt(L, 'noon'); publico(L, 34, 'cheer', { x0: -26, x1: 26, z0: -14, z1: 26 }); cm([0, 30, 40, 0, 0, -4, 52], [0, 44, 36, 0, 0, -6, 54], L.k); SHC = V(0, 0, 4); },
  [[.05, 'crowd_murmur', .6], [.4, 'wind_soft', .4]]);
// 67 «Drei,»: el alcalde en el atril cuenta con los dedos
shot(73.35, 'C', 'punch', L => { stadt(L, 'noon'); FEST.PULT.visible = true; pose(mayor, 0, 4, -24.5, 0, L, { aRx: 2.8, aRz: .3, aRe: .3, aLx: .4 }, 'happy', { mouth: 'open_smile' }); FACES.push(mayor); onFace(mayor, 7, 0, .5, 44, L.k, 6); top('3', (L.lt - .02) * 4, 'num', .14, 1.6); },
  [[.02, 'drum_hit', .9], [.05, 'mic_feedback', .3]]);
// 68 «zwei,»: el público levanta los vapes a la vez
shot(73.82, 'W', null, L => { stadt(L, 'noon'); POST.push(() => EXS.filter(c => c.root.visible).forEach(c => holdV(c, L, { raise: .9, pose: { aLx: .3 } }))); publico(L, 18, 'look', { z0: -8, z1: 6 }); cm([0, 6, 18, 0, 5, -2, 46], [3, 6, 16, 0, 5, -2, 46], L.k); top('2', (L.lt - .02) * 4, 'num', .14, 1.6); },
  [[.02, 'drum_hit', .9], [.3, 'cloth_rustle', .5]]);
// 69 «eins…»: yo, entre el público, nervioso, con mi vape
shot(74.32, 'I', 'slow', L => { stadt(L, 'noon'); put(ich, 2, 0, 4, PI + .2); holdV(ich, L, { raise: .7 }); cara(ich, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(ich, L.T, 2); publico(L, 10, 'look', { z0: -6, z1: 10, x0: -10, x1: 12 });
  onFace(ich, 5.4, 0, .4, 42, L.k, 4.4); top('1', (L.lt - .02) * 4, 'num', .14, 1.6); }, [[.02, 'drum_hit', .9], [.2, 'heartbeat', .7]]);
// 70 «PUFF!»: todo el pueblo echa su nube a la vez: una muralla de nubes de colores sube sobre la plaza
shot(74.98, 'C', 'punch', L => { stadt(L, 'noon'); publico(L, 24, 'look', { z0: -12, z1: 10 }); allPuff(L, L.t0 - .55, { n: 24, size: 3, pow: 12, np: 34 }); SMK.haze(V(0, 16, -2), L.T, 20, 24, 4, 12, 7, .25 * clamp(L.lt * 2), 6);
  cm([0, 9, 34, 0, 10, -4, 52], [0, 10, 30, 0, 12, -4, 54], L.k); SHC = V(0, 0, 0); top('PUFF!', (L.lt - .02) * 4, 'big', .13, 1.3); SHAKE = clamp(1 - L.lt * 2) * .8; }, [[.0, 'big_puff', 1], [.05, 'boom', .6], [.3, 'crowd_cheer', .6]]);
// 71 «Omas Wolke hat eine Taube»: la abuela echa su nube y la paloma sale disparada dando vueltas
shot(76.02, 'F', null, L => { stadt(L, 'noon'); put(oma, -3, 0, 14, .5); vaper(oma, L, L.t0 - .1, .3, { expr: 'joy', size: 2, pow: 12, n: 60, dirUp: .3 }); FACES.push(oma);
  const t = Math.max(0, L.lt - .4); show(TAUBE, -3 + 2.5 + t * 22, 7.6 + t * 9, 14 + t * 6, PI / 2, 1.4); TAUBE.rotation.z = -t * 9; TAUBE.userData.pose(L.T, 1);
  orb(L.k, V(-1, 4.6, 15), null, [16, .9, .14, 48], [14, 1.1, .12, 48]); }, [[.05, 'vape_puff', .9], [.4, 'pigeon_coo', .8], [.45, 'whoosh', .6], [.6, 'wings_flap', .6]]);
// 72 «bis nach Österreich gepustet.»: la paloma vuela por encima de los montes hasta el cartel de ÖSTERREICH
shot(77.52, 'P', null, L => { stadt(L, 'noon'); show(ASIGN, 6, 0, 640, PI, 1.2); const p = V(lerp(-4, 4, L.k), 18 - L.k * 6, 600 + L.k * 30); show(TAUBE, p.x, p.y, p.z, 0, 1.6); TAUBE.rotation.z = Math.sin(L.T * 20) * .3; TAUBE.userData.pose(L.T, 1);
  cam([p.x - 3, p.y + 3, p.z - 14], [p.x + 1, p.y - 3, p.z + 12], 50); top('ÖSTERREICH', (L.lt - .3) * 3, 'red', .13); }, [[.05, 'wings_flap', .8], [.4, 'wind_strong', .5], [1.0, 'yodel', .4]]);
// 73 «Die Wolke des Bürgermeisters»: el alcalde da su calada en el escenario
shot(79.05, 'G', null, L => { stadt(L, 'noon'); put(mayor, 0, 4, -24, .25); vaper(mayor, L, L.t0 - .15, .45, { expr: 'smug', size: 1.8, pow: 6, n: 50, dirUp: .8 }); onBody(mayor, 13, .2, .1, 44, L.k, 11, .05); },
  [[.05, 'inhale', .7], [.5, 'big_puff', .8]]);
// 74 «sah genauso aus»: encima del escenario se forma una nube con la cara del alcalde (bigote, gafas, peinado)
shot(80.42, 'Z', 'punch', L => { stadt(L, 'noon'); put(mayor, -4, 4, -24, .3); holdV(mayor, L, { raise: .2 }); cara(mayor, L.T, { expr: 'happy', mouth: 'grin' }); FACES.push(mayor); const k = easeOut(clamp(L.lt / .5));
  show(MCLOUD, 4, 16, -26, -.2, .6 + k * .4); cm([0, 10, 4, 0, 13, -25, 50], [0, 10.4, 2, 0, 13.6, -25, 50], L.k); publico(L, 8, 'point', { z0: -12, z1: -4, x0: -16, x1: 16, face: V(4, 16, -26), expr: 'joy' }); }, [[.05, 'poof', .8], [.4, 'crowd_laugh', .6]]);
// 75 «wie der Bürgermeister.»: comparación: el alcalde y su nube, la misma cara; el pueblo se parte
shot(81.4, 'S', null, L => { stadt(L, 'noon'); pose(mayor, -2.4, 4, -24, .35, L, { aRx: 1.5, aRz: -.1, aRe: .2, aLx: .3 }, 'smug', { mouth: 'grin' }); FACES.push(mayor); show(MCLOUD, 4.6, 9.6, -26, -.25, .62);
  cm([1, 9.6, -4, 1, 8.4, -25, 46], [1.6, 9.4, -6.5, 1, 8.4, -25, 44], L.k); badge('tag', 'GENAU WIE ER', W / 2, H * .14, (L.lt - .1) * 3); }, [[.05, 'crowd_laugh', .7], [.4, 'ding', .4]]);
// 76 «Dann hat mein großer Bruder»: mi hermano sube al escenario con MI Pfirsich-Turbo, chulo
shot(82.0, 'W', null, L => { stadt(L, 'noon'); const x = -10 + easeOut(clamp(L.lt / 1.2)) * 9; put(bro, x, 4, -23, PI / 2 - .3); actuar(bro, 0, [[0, { ...walkP(L.T, 2) }]], { T: L.T }); holdV(bro, L, { special: PFIRSICH, raise: .5, pose: walkP(L.T, 2) }); cara(bro, L.T, { expr: 'smug', mouth: 'smirk' }); FACES.push(bro);
  cm([x + 2, 9, -6, x, 7.6, -23, 44], [x + 1, 9, -8, x, 7.6, -23, 44], L.k); badge('tag', 'MEIN PFIRSICH-TURBO!', W / 2, H * .14, (L.lt - .4) * 3); }, [[.05, 'footsteps_wood', .6], [.4, 'crowd_oooh', .5]]);
// 77 «den Pfirsich-Turbo gezogen.»: la calada interminable: el LED al rojo, se le hincha el pecho
shot(83.51, 'C', 'slow', L => { stadt(L, 'noon'); put(bro, -1, 4, -23, .15); vaper(bro, L, L.t0 - .3, 3, { special: PFIRSICH, expr: 'determined' }); PFIRSICH.userData.setGlow(1.6 + Math.sin(L.T * 30) * .4); bro.spine.scale.set(1 + L.k * .12, 1, 1 + L.k * .12);
  onFace(bro, 5.2, 0, .6, 42, L.k, 4.2); }, [[.0, 'inhale_long', 1], [.6, 'vape_crackle', .8]]);
// 78 «NEIN!»: yo entre el público, gritando con las manos en la cabeza
shot(84.88, 'C', 'punch', L => { stadt(L, 'noon'); pose(ich, 2, 0, 4, PI + .2, L, { ...SHOUT, aLx: 2.6, aRx: 2.6, aLe: 2, aRe: 2 }, 'shock', { mouth: 'scream', eyes: 'terror' }); FACES.push(ich); onFace(ich, 5, .2, -.4, 42, L.k, 4.2); top('NEIN!', (L.lt - .02) * 4, 'red', .13, 1.2); },
  [[.02, 'sting', .8], [.1, 'gasp', .5]]);
// 79 «Seine Wolke war so groß,»: la nube melocotón crece y se traga el escenario entero
shot(85.61, 'R', null, L => { stadt(L, 'noon'); const k = easeOut(clamp(L.lt / 1.3)); show(BIG, 0, 4 + k * 4, -22, L.T * .1, .3 + k * .6); BIG.userData.m.color.set(0xffc0a0); BIG.userData.m.emissive.set(0xffc0a0);
  put(bro, 0, 4 + k * 7, -16, 0); actuar(bro, 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: .8, aRz: .8, lean: -.1 }]], { T: L.T }); cara(bro, L.T, { expr: 'shock', mouth: 'o', eyes: 'wide' }); FACES.push(bro); publico(L, 14, 'shock', { z0: -12, z1: 6 });
  cm([0, 9, 30, 0, 11, -20, 54], [0, 10, 27, 0, 13, -20, 56], L.k); top('SO GROSS', (L.lt - .2) * 3, 'gold', .13); }, [[.02, 'big_puff', 1], [.3, 'rumble', .6], [.6, 'crowd_oooh', .6]]);
// 80 «dass sie ihn in den Himmel gehoben hat.»: la nube sube con él encima hacia el cielo
shot(87.07, 'Z', null, L => { stadt(L, 'noon'); const y = 10 + easeIn(L.k) * 10; broCloud(L, y, { z: -18 }); cm([4, 6, 16, 0, y, -18, 50], [6, 7, 16, 0, y + 2, -18, 54], L.k); badge('tag', 'IN DEN HIMMEL', W / 2, H * .14, (L.lt - .2) * 3); },
  [[.05, 'wind_strong', .7], [.4, 'scream_man', .6]]);
// 81 «Alle haben gepustet,»: todos soplan sus nubes hacia arriba para bajarle
shot(88.61, 'F', null, L => { stadt(L, 'noon'); publico(L, 18, 'look', { z0: -10, z1: 8, face: V(0, 30, -18) }); allPuff(L, L.t0 - .4, { n: 18, size: 2.4, pow: 10, dirUp: 3, up: 3 }); cm([0, 4, 22, 0, 14, -8, 54], [3, 4, 20, 0, 16, -8, 56], L.k); },
  [[.05, 'big_puff', .9], [.3, 'crowd_shout', .5]]);
// 82 «um ihn runterzuholen.»: arriba, las nubes le llegan por debajo… y le empujan
shot(89.55, 'S', null, L => { stadt(L, 'noon'); const y = 24 + L.k * 4; broCloud(L, y, { z: -18 }); SMK.tint.set(0xfff0ff); for (let k = 0; k < 4; k++) SMK.puff(V(-6 + k * 4, y - 10, -18 + k), V(0, 1, 0), L.T, L.t0 - .6 + k * .15, 1.2, { pow: 9, size: 2.4, n: 30, dens: .8, seed: 50 + k, life: 2 });
  cm([0, y - 8, 22, 0, y + 1, -18, 52], [3, y - 7, 20, 0, y + 2, -18, 52], L.k); }, [[.05, 'whoosh_up', .7], [.4, 'scream_man', .5]]);
// 83 «Aber ihre Wolken haben ihn»: sube más, pasa la cúpula dorada del Rathaus
shot(90.57, 'W', null, L => { stadt(L, 'noon'); const y = 34 + L.k * 12; broCloud(L, y, { z: -44, x: 10 }); cm([22, y - 4, -8, 10, y, -44, 50], [24, y + 2, -10, 10, y + 4, -44, 52], L.k); },
  [[.05, 'wind_strong', .7], [.5, 'scream_man', .4]]);
// 84 «nur noch höher geschoben.»: desde arriba: mi hermano diminuto sobre la nube, el pueblo abajo
shot(91.67, 'R', null, L => { stadt(L, 'noon'); const y = 50 + L.k * 6; broCloud(L, y, { z: -10, eyes: 'cry', mouth: 'scream' }); tears(bro, L.T); cm([0, y + 20, 22, 0, y, -10, 56], [0, y + 24, 20, 0, y, -10, 58], L.k); top('HÖHER', (L.lt - .2) * 3, 'red', .13); },
  [[.05, 'wind_strong', .8], [.6, 'cry_man', .5]]);
// 85 «Große Wolken»: las nubes enormes del pueblo se quedan flotando sin llegar a ningún sitio
shot(92.95, 'I', null, L => { stadt(L, 'noon'); SMK.haze(V(0, 26, -10), L.T, 34, 30, 6, 16, 9, .5, 8); publico(L, 14, 'look', { z0: -10, z1: 8, face: V(0, 30, -10), expr: 'sad' }); cm([0, 8, 26, 0, 20, -10, 54], [0, 10, 24, 0, 22, -10, 54], L.k); },
  [[.05, 'wind_soft', .6], [.4, 'crowd_murmur', .5]]);
// 86 «waren nutzlos.»: el público, triste, los vapes bajados
shot(93.75, 'C', null, L => { stadt(L, 'noon'); publico(L, 12, 'look', { z0: -4, z1: 8, x0: -10, x1: 10, expr: 'sad', face: V(0, 4, 30) }); cm([0, 5.6, 24, 0, 4.4, 2, 44], [2, 5.4, 22, 0, 4.4, 2, 44], L.k); top('NUTZLOS', (L.lt - .2) * 3, 'red', .13); },
  [[.05, 'sad_trombone', .6]]);
// 87 «Aber kleine Wolken…»: yo miro mi vape: la idea (zoom lento)
shot(94.85, 'F', 'slow', L => { stadt(L, 'noon'); put(ich, 2, 0, 4, PI + .1); holdV(ich, L, { raise: .55 }); cara(ich, L.T, { expr: L.lt > .6 ? 'determined' : 'think', mouth: L.lt > .6 ? 'smirk' : 'flat' }); FACES.push(ich);
  onFace(ich, 5.6, 0, .6, 42, L.k, 4.4); top('KLEINE WOLKEN', (L.lt - .5) * 3, 'cyan', .13); }, [[.05, 'idea_ding', .7]]);
// 88 «Ich habe gepustet,»: mi nubecita se solidifica en el aire: primer escalón
shot(96.08, 'C', 'punch', L => { stadt(L, 'noon'); put(ich, 4, 0, -2, -1.2); vaper(ich, L, L.t0 - .3, .3, { expr: 'determined', size: .3, n: 10, pow: 1.8 }); stairs(1, L, (L.lt - .4) * 3); onBody(ich, 13, .5, .14, 46, L.k, 11.5, .7); },
  [[.05, 'tiny_puff', .9], [.5, 'pop', .8], [.6, 'sparkle', .5]]);
// 89 «Wolke für Wolke,»: salto de escalón en escalón y voy soplando el siguiente
shot(97.39, 'S', null, L => { stadt(L, 'noon'); const n = 2 + Math.floor(L.lt * 3); stairs(Math.min(n, 5), L); const i = Math.min(3, Math.floor(L.lt * 3)), f = (L.lt * 3) % 1, a = stepPos(i), b = stepPos(i + 1);
  const p = arc([a.x, a.y + .8, a.z], [b.x, b.y + .8, b.z], 2.4, easeInOut(f)); put(ich, p.x, p.y, p.z, faceTo(a, b)); actuar(ich, 0, [[0, { aLx: 2, aRx: 2, aLz: .5, aRz: .5, lLx: .8, lRx: -.3, lLk: .8 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined', mouth: 'o' }); FACES.push(ich); ich.blob.visible = false;
  cm([p.x + 14, p.y + 4, p.z + 14, p.x, p.y + 2, p.z, 50], [p.x + 13, p.y + 6, p.z + 13, p.x, p.y + 3, p.z, 50], L.k); }, [[.05, 'jump', .7], [.35, 'pop', .6], [.68, 'jump', .7], [.9, 'pop', .6]]);
// 90 «eine Treppe bis ganz nach oben.»: plano general: la escalera de nubecitas en espiral hasta mi hermano
shot(98.38, 'R', null, L => { stadt(L, 'noon'); stairs(9, L); broCloud(L, 50, { z: -4, expr: 'shock', mouth: 'o', eyes: 'wide' }); const q = stepPos(Math.min(8, 5 + Math.floor(L.lt * 2))); put(ich, q.x, q.y + .8, q.z, 0); actuar(ich, 0, [[0, climbP(L.T, 0)]], { T: L.T }); cara(ich, L.T, { expr: 'determined' }); ich.blob.visible = false;
  cm([36, 22, 40, 0, 26, -4, 54], [40, 30, 36, 0, 30, -4, 56], L.k); top('TREPPE', (L.lt - .3) * 3, 'cyan', .13); }, [[.05, 'choir_ah', .6], [.6, 'wind_soft', .4]]);
// 91 «Und ich habe meinen Bruder»: arriba: le tiendo la mano y él la agarra
shot(100.17, 'Z', null, L => { stadt(L, 'noon'); stairs(9, L); const s8 = stepPos(8); broCloud(L, 50, { z: -4, ry: -2.2, expr: 'worried', mouth: 'o', eyes: 'worried', pose: { aRx: 1.6, aRz: -.2, aRe: .2, aLx: .6 } });
  put(ich, s8.x, s8.y + .8, s8.z, faceTo(s8, V(0, 0, -3))); actuar(ich, 0, [[0, { aRx: 1.6, aRe: .2, aLx: .5, lean: .1 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined', mouth: 'smile' }); ich.blob.visible = false; FACES.push(ich);
  const c = hp(ich).lerp(hp(bro), .5); cm([c.x + 18, c.y + 2, c.z + 20, c.x, c.y - 1, c.z, 44], [c.x + 16, c.y + 2, c.z + 18, c.x, c.y - 1, c.z, 42], L.k); }, [[.05, 'wind_soft', .5], [.6, 'grab', .8]]);
// 92 «gerettet.»: abrazo en la nube; corazón
shot(101.25, 'I', null, L => { stadt(L, 'noon'); stairs(9, L); const s8 = stepPos(8); put(ich, s8.x, s8.y + .8, s8.z, 2.2); actuar(ich, 0, [[0, 'hug']], { T: L.T }); put(bro, s8.x - 1.6, s8.y + .8, s8.z + .9, 2.2 - PI); actuar(bro, 0, [[0, 'hug']], { T: L.T });
  grin(ich, L.T); cara(bro, L.T, { expr: 'cry', eyes: 'happy', mouth: 'smile' }); FACES.push(ich, bro); ich.blob.visible = bro.blob.visible = false; orb(L.k, s8.clone().add(V(-.8, 3.4, .4)), null, [12, 1.2, .1, 46], [10.5, 1.0, .08, 44]); badge('heart', '', W / 2, H * .2, (L.lt - .1) * 3); top('GERETTET', (L.lt - .1) * 3, 'green', .13); },
  [[.05, 'hug_cloth', .6], [.2, 'choir_ah', .6]]);
// 93 «Und die Pfirsich-Wolke wurde»: la nube melocotón, sola en el cielo, se oscurece y retumba
shot(101.85, 'G', null, L => { stadt(L, 'noon'); const d = L.k; const c = new THREE.Color(0xffc0a0).lerp(new THREE.Color(0xc86a5a), d); show(BIG, 0, 44, -4, L.T * .1, 1.2 + Math.sin(L.T * 10) * .02 * d); BIG.userData.m.color.copy(c); BIG.userData.m.emissive.copy(c);
  cm([0, 20, 34, 0, 40, -4, 54], [0, 22, 30, 0, 42, -4, 54], L.k); if (L.lt > .6 && L.lt < .7) grade.uniforms.flash.value = .5; }, [[.05, 'rumble', .9], [.6, 'thunder', .7]]);
// 94 «zu Pfirsich-Regen.»: llueven melocotones sobre la plaza (caen y rebotan)
shot(103.01, 'C', 'punch', L => { stadt(L, 'noon'); peachRain(V(0, 0, 4), L.t0 - .2, L.T, 40, { h: 28, spread: 16, dur: 1 }); publico(L, 18, 'cheer', { z0: -8, z1: 12, face: V(0, 30, 4) }); cm([0, 10, 34, 0, 8, 4, 52], [0, 9, 31, 0, 7, 4, 52], L.k); top('PFIRSICH-REGEN', (L.lt - .1) * 3, 'gold', .13, .9); },
  [[.05, 'rain_drops', .7], [.2, 'thud', .5], [.4, 'thud', .5], [.6, 'crowd_cheer', .6]]);
// 95 «Gratis-Mittagessen für alle.»: todo el mundo coge melocotones y se los come, felices
shot(104.23, 'W', null, L => { stadt(L, 'noon'); const E = [EXS[0], EXS[1], EXS[2], EXS[3]]; E.forEach((c, i) => { pose(c, -6 + i * 4, 0, 10 + (i % 2) * 2, (i - 1.5) * -.2, L, { aRx: 2 + Math.sin(L.T * 6 + i) * .2, aRe: 1.8, aRz: -.3, headX: .1 }, 'joy', { mouth: Math.sin(L.T * 10 + i) > 0 ? 'grin' : 'ah', eyes: 'happy' }); attach(PEACHES[i], c.aR.hand, [0, -.9, .6], [0, 0, 0], 1.1); FACES.push(c); });
  peachRain(V(0, 0, 4), L.t0 - 1.4, L.T, 20, { h: 28, spread: 18, dur: 1, seed: 4 }); publico(L, 10, 'cheer', { z0: -10, z1: 2 }); cm([-2, 6.6, 26, 0, 4.4, 10, 46], [2, 6.4, 24, 0, 4.4, 10, 46], L.k); top('GRATIS', (L.lt - .2) * 3, 'green', .13); },
  [[.05, 'bite_crunch', .7], [.4, 'yum', .6], [.8, 'crowd_happy', .5]]);
// 96 «Ich habe die Goldene Vape»: en el escenario, el alcalde me entrega la Goldene Vape; confeti
shot(105.87, 'F', null, L => { stadt(L, 'noon'); pose(mayor, -2.2, 4, -23, PI / 2 - .3, L, { aRx: 1.4, aRe: .2, aRz: -.1 }, 'happy', { mouth: 'open_smile' }); pose(ich, 2.2, 4, -23, -PI / 2 + .3, L, { aRx: 1.4, aRe: .3, aLx: 2.6, aLz: .4 }, 'joy', { mouth: 'open_smile', eyes: 'happy' }); FACES.push(ich, mayor);
  holdV(ich, L, { special: GOLDV, raise: .1, pose: { aLx: 2.6, aLz: .4 } }); confetti(V(0, 4, -22), L.t0, L.T, 60, 14); orb(L.k, V(0, 7.4, -23), null, [14, .1, .1, 46], [12, -.05, .08, 44]); top('GEWONNEN!', (L.lt - .2) * 3, 'gold', .13); },
  [[.05, 'fanfare', .8], [.3, 'applause', .7]]);
// 97 «gewonnen,»: levanto el trofeo; el público grita mi nombre
shot(106.83, 'Z', 'punch', L => { stadt(L, 'noon'); put(ich, 0, 4, -23, 0); holdV(ich, L, { special: GOLDV, raise: .3, pose: { aRx: 2.9, aRz: .2, aRe: .2, aLx: 2.6, aLz: .5 } }); actuar(ich, 0, [[0, { aRx: 2.9, aRz: .2, aRe: .2, aLx: 2.6, aLz: .5 }]], { T: L.T }); GOLDV.userData.setGlow(1.5); cara(ich, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' }); FACES.push(ich);
  confetti(V(0, 4, -22), L.t0 - 1, L.T, 60, 14); sparkle(wpos(ich.aR.hand), L.T, 10, 1.4); onBody(ich, 13, 0, .02, 46, L.k, 11); }, [[.05, 'crowd_cheer', .8], [.3, 'sparkle', .6]]);
// 98 «für die kleinste Wolke in der Geschichte.»: con la Goldene Vape echo mi nubecita… y el pueblo la aplaude como si fuera enorme
shot(107.77, 'S', null, L => { stadt(L, 'noon'); put(ich, 0, 4, -23, .2); vaper(ich, L, L.t0 - .1, .4, { special: GOLDV, expr: 'happy', size: .25, n: 8, pow: 1.4 }); publico(L, 16, i => i % 2 ? 'clap' : 'cheer', { z0: -12, z1: 4 });
  onBody(ich, 16, .1, .1, 46, L.k, 13); top('KLEINSTE WOLKE', (L.lt - .2) * 3, 'cyan', .13, .9); badge('tag', 'IN DER GESCHICHTE', W / 2, H * .2, (L.lt - .7) * 3); }, [[.05, 'tiny_puff', .8], [.4, 'applause', .7]]);
// 99 «Jetzt ist mein Gesicht»: el billete nuevo con MI cara gira hacia la cámara
shot(109.31, 'I', null, L => { stadt(L, 'noon'); show(NOTE_I, 0, 9.4, 30, 0, 1); NOTE_I.rotation.set(-.05, (1 - easeOut(clamp(L.lt / .7))) * PI * 1.5, 0); cm([0, 9.4, 35.2, 0, 9.2, 30, 40], [0, 9.4, 34.4, 0, 9.2, 30, 40], L.k); },
  [[.05, 'whoosh', .6], [.5, 'ding_reveal', .7]]);
// 100 «auf dem Geld.»: en la panadería pagan con mis billetes; me llueven billetes alrededor
shot(110.53, 'C', 'punch', L => { stadt(L, 'noon'); pose(ich, 0, 0, 52, 0, L, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }, 'joy', { eyes: 'happy', mouth: 'open_smile' }); FACES.push(ich); notesRain(V(0, 0, 52), L.t0 - .1, L.T, 22, { h: 10, spread: 4.5 });
  onBody(ich, 13, .2, .12, 44, L.k, 11); top('MEIN GESICHT', (L.lt - .1) * 3, 'green', .13); }, [[.05, 'cash_reg', .9], [.2, 'money_rain', .7]]);
// 101 «Und mein Bruder?»: en casa, mi hermano entra por la cocina, encogido, mirando a mamá
shot(111.49, 'W', null, L => { kuecheS(L); pose(bro, UX + 1, 0, 9.5, -.3, L, { crouch: .1, aLx: .4, aRx: .4, aLz: -.2, aRz: -.2, headX: .2 }, 'worried', { mouth: 'grimace' }); sweat(bro, L.T, 2); FACES.push(bro);
  onBody(bro, 13, -.2, .1, 44, L.k, 11); top('MEIN BRUDER?', (L.lt - .1) * 3, 'tag', .13); }, [[.05, 'door_creak', .6], [.3, 'gulp', .6]]);
// 102 «Mama hat ihn»: mamá le quita el vape y le cambia el sabor con cara de juez
shot(112.27, 'F', null, L => { kuecheS(L); put(mama, UX - 1.6, 0, 8, .5); holdV(mama, L, { raise: .55, flav: ['ROSENKOHL', '#7aff6a'], pose: { aLx: 1.3, aLz: -.4, aLe: 1.3 } }); cara(mama, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'squint' }); FACES.push(mama);
  pose(bro, UX + 1.8, 0, 9, -PI / 2 - .4, L, { aLx: .9, aRx: .9, aLz: .3, aRz: .3 }, 'worried', { mouth: 'o' }); cm([UX - 1, 6, 24, UX + .1, 4.4, 8.5, 46], [UX + .4, 5.8, 22, UX + .1, 4.4, 8.5, 44], L.k); }, [[.1, 'button_beep', .9], [.4, 'evil_laugh', .5]]);
// 103 «auf Rosenkohl gestellt.»: él da la calada: nube verde, asco total
shot(113.01, 'P', null, L => { kuecheS(L); put(bro, UX + 1, 0, 9.5, -.2); vaper(bro, L, L.t0 - .15, .4, { expr: 'sad', flav: ['ROSENKOHL', '#7aff6a'], col: 0x7ad85a, after: 'grimace_wide', eyes: L.lt > .6 ? 'squint' : undefined }); if (L.lt > .7) sweat(bro, L.T, 2);
  onFace(bro, 5.4, 0, .7, 42, L.k, 4.6); TINT = 'rgba(40,160,40,.08)'; top('ROSENKOHL', (L.lt - .1) * 3, 'green', .13); }, [[.05, 'vape_puff', .8], [.6, 'gag', .9]]);
// 104 «Für zwei Jahre.»: el calendario de la cocina: «2 JAHRE ROSENKOHL»; mamá sonríe, él llora al fondo
shot(114.25, 'Z', 'slow', L => { kuecheS(L); calDraw('j2'); show(CAL, UX - 9, 9.4, -13.6, 0, .9); pose(mama, UX - 4, 0, 4, .4, L, { aLx: .4, aRx: .4, aLz: .9, aRz: .9, aLe: 1.9, aRe: 1.9 }, 'smug', { mouth: 'grin' }); FACES.push(mama);
  put(bro, UX + 2, 0, 6, -.3); vaper(bro, L, L.t0 + .2, .4, { expr: 'cry', flav: ['ROSENKOHL', '#7aff6a'], col: 0x7ad85a, after: 'grimace', eyes: 'cry' }); tears(bro, L.T);
  cm([UX - 1, 8, 22, UX - 2, 6.4, -2, 50], [UX - 1, 7.8, 19.5, UX - 2, 6.4, -2, 48], L.k); top('2 JAHRE', (L.lt - .1) * 3, 'red', .13, 1.2); }, [[.05, 'page_flip', .7], [.3, 'cry_man', .6], [1.2, 'sad_trombone', .5]]);
