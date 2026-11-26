// ---------- c: el Gründerfest, Graf con Leben y Tod, la guadaña, Elias ríe, las alas, Mira arde, los nombres (70,28 – 118,79 s) ----------
// Plaza: escenario z = -64 (tablado y = 4.25), atril (0, 4.25, -60); Graf detrás del atril en (0, 4.25, -62.4) mirando +z; Leben (x = -9) y Tod (x = 9) en el escenario.
// Jonas (0, 0, -34) mirando al escenario (ry = PI), Elias (-3.4, 0, -33.4), Mira (3.4, 0, -33.4).
const SY = 4.25, JZ = -34;
function trio(L, o = {}) { const j = pose(jonas, 0, 0, JZ, PI, L, o.j || {}, o.je || 'worried'); const e = pose(elias, -3.4, 0, JZ + .6, PI + .15, L, o.e || { aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, o.ee || 'smug'); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, o.m || {}, o.me || 'happy'); return [j, e, m]; }
function crowdF(L, n = 16, o = {}) { crowdAt(L, o.x ?? 0, o.z ?? -30, n, o.r0 ?? 8, o.r1 ?? 20, o.seed ?? 5, { mode: o.mode || 'cheer', expr: o.expr, gap: o.gap ?? 1.1, face: o.face, avoid: [[0, JZ], [-3.4, JZ + .6], [3.4, JZ + .6]] }); POST.push(() => DX.forEach((c, i) => { if (c.root.visible) engel(c, ...NP[i % 8], L.T, { s: .75 }); })); }
function grafAt(L, p = {}, expr = 'happy', ex = {}) { return pose(graf, 0, SY, -62.4, 0, L, p, expr, ex); }
function todOn(x, y, z, ry, L, p = {}, s = 1) { TOD.root.visible = true; TOD.root.position.set(x, y, z); TOD.root.rotation.y = ry; TOD.root.scale.setScalar(s); TOD.pose(L.T, p); return TOD; }
function lebenOn(x, y, z, ry, L, p = {}, s = 1) { LEBEN.root.visible = true; LEBEN.root.position.set(x, y, z); LEBEN.root.rotation.y = ry; LEBEN.root.scale.setScalar(s); LEBEN.pose(L.T, p); return LEBEN; }
function title(name, sub, k, col) { badge(col, name, W / 2, H * .17, k, 1, 1.25); if (sub) badge('tag', sub, W / 2, H * .255, clamp(k * 1.4 - .3), 1, .9); }

// 65 «Denn dann kam das Gründerfest.»: atardecer: fuegos artificiales sobre la plaza, la pancarta GRÜNDERFEST se ilumina; grúa bajando hacia la fiesta
shot(70.28, 'Z', 'punch', L => { festS(L); crowdF(L, 18, { mode: 'cheer' }); confetti(V(0, 14, -40), L.t0 + .2, L.T, 40, 1.4);
  EMB.burst(V(-14, 34, -70), L.t0 + .15, L.T, 0xff4a8a, 22, 14); EMB.L2 = 0;
  cm([0, 40, 30, 0, 16, -60, 52], [0, 16, 14, 0, 10, -60, 50], L.k, easeOut); sh(V(0, 0, -40), 50); }, [[0, 'impact', .4], [.1, 'firework', .7], [.35, 'cheer', .5], [.6, 'party_horn', .4]]);
// 66 «Die ganze Stadt»: la multitud bailando con sus ángeles revoloteando por encima: lluvia de confeti, guirnaldas
shot(71.99, 'W', null, L => { festS(L); crowdF(L, 22, { mode: i => ['cheer', 'clap', 'wave', 'talk'][i % 4], r0: 4, r1: 22, z: -24 }); confRain(V(0, 0, -24), L.T, 40, 40, 30, 18);
  cm([-18, 14, 4, 0, 4, -26, 50], [18, 12, 6, 0, 4, -26, 50], L.k); sh(V(0, 0, -24), 44); }, [[0, 'swipe', .4], [.1, 'crowd_run', .3], [.3, 'cheer', .5], [.6, 'clap', .4]]);
// 67 «auf dem Marktplatz.»: picado general de la plaza con el escenario al fondo, la fuente y los puestos encendidos
shot(73.05, 'F', null, L => { festS(L); crowdF(L, 22, { mode: 'cheer', r0: 6, r1: 26, z: -26 });
  cm([30, 34, 26, 0, 4, -40, 50], [22, 26, 16, 0, 4, -42, 50], L.k); sh(V(0, 0, -36), 60); }, [[0, 'flash', .3], [.1, 'bells', .4], [.5, 'cheer', .4]]);
// 68 «Und oben auf der Bühne:»: travelling ascendente por la escalera del escenario hasta el atril vacío con el micrófono; foco que se enciende
shot(73.78, 'S', null, L => { festS(L); lp(3, 0, 16, -52, 160, 0xfff0d0, 40); cm([-9, 2, -48, 0, 5, -60, 46], [-4, 8, -50, 0, 7, -60, 44], L.k); sh(V(0, 4, -60), 20); }, [[0, 'swipe', .4], [.2, 'switch', .5], [.4, 'drone', .3]]);
// 69 «Bürgermeister Graf.»: Graf (levita, cadena dorada, monóculo, sombrero tirolés) llega al atril, saluda con la mano a la multitud, sonrisa de político
shot(75.00, 'C', 'punch', L => { festS(L); lp(3, 0, 16, -52, 140, 0xfff0d0, 40); const g = grafAt(L, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 8) * .25, aRe: .3, aLx: .4 }, 'happy', { mouth: 'grin' });
  badge('tag', 'BÜRGERMEISTER GRAF', W / 2, H * .2, clamp((L.lt - .2) / .25)); onBody(g, 20, .3, .05, 42, L.k, 14, -.1, 4); sh(V(0, 4, -62), 20); }, [[0, 'impact', .5], [.1, 'cheer', .5], [.3, 'clap', .5]]);
// 70 «Mit den stärksten Schutzengeln»: zoom lento: detrás de Graf se elevan dos sombras gigantes desde el suelo del escenario; la multitud se calla
shot(76.02, 'Z', 'slow', L => { festS(L); grafAt(L, { aLx: 1.0, aRx: 1.0, aLe: .3, aRe: .3, aLz: .5, aRz: .5 }, 'smug', { mouth: 'grin' }); const up = easeOut(clamp(L.lt / 1.2));
  lebenOn(-9, SY - 13 + up * 13, -65, .15, L, { eyes: up * 4 }); todOn(9, SY - 13 + up * 13, -65, -.15, L, { eyes: up * 4 });
  EMB.rise(V(0, SY, -65), L.T, 0xfff0c0, 24, 10, 30); orb(L.k, V(0, 12, -63), null, [44, 0, .05, 50], [34, 0, .02, 48]); sh(V(0, 4, -62), 30); }, [[0, 'zoom_in', .3], [.1, 'rubble', .5], [.4, 'choir', .5], [.8, 'hum_low', .5]]);
// 71 «der ganzen Welt.»: plano bajo desde la multitud: los tres sobre el escenario: Graf en el centro y los dos colosos detrás, ojos encendidos
shot(77.51, 'F', null, L => { festS(L); grafAt(L, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, aLe: .3, aRe: .3 }, 'smug', { mouth: 'grin' }); lebenOn(-9, SY, -65, .2, L); todOn(9, SY, -65, -.2, L);
  crowdF(L, 10, { mode: 'shock', r0: 10, r1: 16, z: -30, gap: 2.2 }); cm([-6, 3, -24, 0, 12, -64, 52], [4, 3, -26, 0, 12, -64, 52], L.k); sh(V(0, 4, -62), 30); }, [[0, 'flash', .4], [.1, 'braam_short', .6], [.4, 'gasp', .5]]);
// 72 «Leben»: primer plano del Leben: ojos verdes que se encienden, flores que brotan de su corona
shot(78.62, 'C', 'punch', L => { festS(L); const l = lebenOn(-9, SY, -65, .2, L, { eyes: 2 + L.k * 4, orb: 4 }); EMB.rise(V(-9, 14, -64), L.T, 0x8aff6a, 6, 6, 16);
  const h = l.head.getWorldPosition(V(0, 0, 0)); cm([h.x + 2, h.y, h.z + 12, h.x, h.y - 1, h.z, 40], [h.x + 1, h.y - .4, h.z + 8, h.x, h.y - 1, h.z, 38], L.k); sh(V(-9, 4, -65), 16); }, [[0, 'impact', .4], [.1, 'leaves', .6], [.3, 'hum_glow', .5]]);
// 73 «und Tod.»: primer plano del Tod: la calavera bajo la capucha, ojos azules que se encienden
shot(79.32, 'Z', null, L => { festS(L); const t = todOn(9, SY, -65, -.2, L, { eyes: 2 + L.k * 5 }); TINT = 'rgba(10,20,60,.2)';
  const h = t.head.getWorldPosition(V(0, 0, 0)); cm([h.x - 2, h.y - 1, h.z + 11, h.x, h.y - .6, h.z, 40], [h.x - 1, h.y - .4, h.z + 7.5, h.x, h.y - .6, h.z, 38], L.k); sh(V(9, 4, -65), 16); }, [[0, 'zoom_in', .4], [.1, 'creepy_ting', .7], [.3, 'wind', .5]]);
// 74 «Plötzlich zeigte»: Graf se inclina sobre el atril y señala con el dedo hacia la multitud
shot(79.94, 'W', null, L => { festS(L); const g = grafAt(L, { ...POINT, lean: .25, aRx: 1.4 }, 'angry', { mouth: 'grimace' }); lebenOn(-9, SY, -65, .2, L); todOn(9, SY, -65, -.2, L);
  cm([3, 9, -48, 0, 8, -62, 44], [1.5, 8.6, -51, 0, 8, -62, 42], L.k); sh(V(0, 4, -62), 24); }, [[0, 'swipe', .4], [.15, 'gasp', .5], [.4, 'tick', .4]]);
// 75 «der Bürgermeister auf mich.»: contraplano: la multitud se gira hacia Jonas, que se señala a sí mismo («¿yo?»), con Elias y Mira a los lados
shot(80.68, 'C', null, L => { festS(L); trio(L, { j: { aRx: 1.4, aRe: 1.9, aRz: -.3 } }); cara(jonas, L.T, { expr: 'shock', mouth: 'o' }); crowdF(L, 12, { mode: 'point', expr: 'sus', x: 0, z: JZ, r0: 7, r1: 14, gap: 1.3 });
  orb(L.k, V(0, 4.5, JZ), null, [22, PI + .4, .1, 46], [15, PI + .1, .08, 44]); sh(V(0, 0, JZ), 24); }, [[0, 'impact', .4], [.1, 'whisper', .5], [.5, 'heartbeat', .5]]);
// 76 «Dieser Junge hat keine Engel.»: Graf gritando al micrófono, con la cara roja; el micro silba
shot(81.93, 'R', null, L => { festS(L); const g = grafAt(L, { ...POINT, lean: .2 }, 'angry', { mouth: Math.sin(L.T * 14) > 0 ? 'scream' : 'talk_wide' }); talk(g, L.T, 81.93, 83.5, 'angry');
  onFace(g, 8, .2, -1, 40, L.k, 6); sh(V(0, 4, -62), 16); }, [[0, 'whirl', .4], [.05, 'shout_m', .5], [.2, 'radio', .3]]);
// 77 «Er bringt unserer Stadt nur Pech.»: la gente se aparta de Jonas formando un círculo vacío a su alrededor; sólo Elias y Mira se quedan
shot(83.52, 'S', null, L => { festS(L); trio(L); const k = easeOut(clamp(L.lt / 1)); crowdF(L, 16, { mode: 'walk', expr: 'sus', x: 0, z: JZ, r0: 6 + k * 8, r1: 10 + k * 10, gap: .2 }); POST.push(() => DX.forEach(c => { if (c.root.visible) { const p = c.root.position; c.root.rotation.y = Math.atan2(p.x, p.z - JZ); } }));
  orb(L.k, V(0, 3, JZ), null, [26, PI, 1.0, 50], [30, PI + .5, 1.1, 50]); sh(V(0, 0, JZ), 34); }, [[0, 'swipe', .4], [.1, 'crowd_run', .5], [.5, 'sad_tone', .4]]);
// 78 «Tod, erledige das.»: Graf chasquea los dedos sin mirar atrás; el Tod gira la cabeza y sus ojos se encienden al máximo
shot(85.19, 'C', 'punch', L => { festS(L); grafAt(L, { aRx: 1.6, aRz: .5, aRe: .8, headY: .3 }, 'smug', { mouth: 'smirk' }); const t = todOn(9, SY, -65, lerp(-.2, -.7, easeOut(clamp(L.lt / .4))), L, { eyes: 7 }); lebenOn(-9, SY, -65, .2, L);
  cm([-6, 10, -46, 4, 11, -64, 46], [-4, 9.5, -50, 5, 11, -64, 44], L.k); sh(V(0, 4, -62), 24); }, [[0, 'impact', .5], [.05, 'clack', .6], [.2, 'creepy_ting', .6], [.4, 'evil_laugh', .3]]);
// 79 «Und der Tod hob seine Sense.»: zoom lento en contrapicado: el Tod baja flotando del escenario hasta Jonas y alza la guadaña por encima de su cabeza
shot(86.66, 'Z', 'slow', L => { festS(L); trio(L, { j: { aLx: 1.4, aRx: 1.4, aLe: 1.9, aRe: 1.9, lean: -.25, headX: -.3 } }); cara(jonas, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); sweat(jonas, L.T, 2);
  const k = easeInOut(clamp(L.lt / 1.2)); todOn(lerp(9, 0, k), lerp(SY, 0, k), lerp(-65, JZ - 9, k), 0, L, { rx: lerp(-.3, -2.8, clamp((L.lt - .8) / .6)), sx: lerp(1.5, .4, clamp((L.lt - .8) / .6)), eyes: 7 }); TINT = 'rgba(10,10,50,.18)';
  cm([3, 1.4, JZ + 9, 0, 9, JZ - 6, 54], [2, 1.2, JZ + 6, 0, 10, JZ - 6, 50], L.k); sh(V(0, 0, JZ), 24); }, [[0, 'zoom_in', .3], [.1, 'wind', .6], [.9, 'metal_rip', .5], [1.3, 'heartbeat', .6]]);
// 80 «Ich schloss die Augen.»: primer plano de Jonas: aprieta los ojos, se encoge; la sombra de la guadaña le cruza la cara
shot(88.48, 'F', null, L => { festS(L); const [j] = trio(L, { j: { aLx: 1.6, aRx: 1.6, aLe: 2, aRe: 2, crouch: .2, headX: .2 } }); cara(j, L.T, { eyes: 'closed', mouth: 'grimace_wide' }); todOn(0, 0, JZ - 9, 0, L, { rx: -2.8, sx: .4, eyes: 6 }); DARK = .15;
  const h = hp(j); cm([h.x + 3.5, h.y + 2.6, h.z - 6.5, h.x, h.y - .3, h.z, 42], [h.x + 2.6, h.y + 2, h.z - 5, h.x, h.y - .3, h.z, 40], L.k); sh(V(0, 0, JZ), 16); }, [[0, 'flash', .3], [.1, 'gasp', .6], [.5, 'heartbeat', .6]]);
// 81 «Doch dann hörte ich Elias lachen.»: casi a oscuras: Elias, con la cabeza gacha, empieza a reírse, los hombros le tiemblan
shot(89.63, 'B', null, L => { festS(L); const e = pose(elias, -3.4, 0, JZ + .6, PI + .3, L, { headX: lerp(.4, -.2, L.k), lean: .1 + Math.sin(L.T * 18) * .03, aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, 'smug'); laughF(e, L.T); DARK = .3; TINT = 'rgba(30,0,40,.25)';
  pose(jonas, 0, 0, JZ, PI, L, { crouch: .2 }, 'worried'); onFace(e, 9, .4, 1.4, 40, L.k, 6.5); sh(V(0, 0, JZ), 16); }, [[0, 'evil_laugh', .6], [.5, 'laugh_deep', .5]]);
// 82 «Fünfzehn Jahre, sagte er.»: Elias levanta la cabeza, sonrisa ladeada; un «15» morado gira a su lado
shot(91.37, 'C', 'punch', L => { festS(L); const e = pose(elias, -3.4, 0, JZ + .6, PI + .3, L, { aLx: -.2, aRx: -.2, aLe: .5, aRe: .5, headX: -.1 }, 'smug'); talk(e, L.T, 91.37, 93.2, 'smug'); TINT = 'rgba(30,0,40,.15)';
  badge('big', '15 JAHRE', W / 2, H * .2, clamp(L.lt / .2)); onFace(e, 8, .3, -1, 40, L.k, 6); sh(V(-3, 0, JZ), 16); }, [[0, 'impact', .5], [.1, 'magic_hit', .4]]);
// 83 «Fünfzehn Jahre warte ich schon darauf,»: Elias camina despacio hacia el Tod, haciendo crujir los nudillos
shot(93.43, 'W', null, L => { festS(L); const e = walk(elias, L, -3.4, JZ - .4, PI + .3, 1.2, 0, { expr: 'smug', pose: { aLx: 1.0, aRx: 1.0, aLe: 1.6, aRe: 1.6, aLz: -.5, aRz: -.5 } }); talk(e, L.T, 93.43, 95.5, 'smug'); todOn(0, 0, JZ - 9, 0, L, { rx: -2.8, sx: .4, eyes: 6 }); pose(jonas, 0, 0, JZ, PI, L, { crouch: .2 }, 'worried'); pose(mira, 3.4, 0, JZ + .6, PI - .15, L, {}, 'smug');
  cm([-10, 4, JZ - 12, -2, 5, JZ, 46], [-8, 4.4, JZ - 8, -2.5, 5, JZ, 44], L.k); sh(V(0, 0, JZ), 22); }, [[0, 'swipe', .4], [.2, 'crack', .5], [.4, 'back_crack', .6], [.7, 'steps', .4]]);
// 84 «dass es endlich einer versucht.»: los ojos de Elias se vuelven rojos y brillantes; zoom rápido
shot(95.53, 'Z', 'slow', L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, PI + .3, L, { aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, 'angry', { mouth: 'smirk' }); REDEYE.forEach(r => r.visible = L.lt > .4); TINT = 'rgba(40,0,10,.15)';
  onFace(e, 8.5, .1, 0, 40, L.k, 4.4); sh(V(-3, 0, JZ), 16); }, [[0, 'zoom_in', .4], [.4, 'creepy_ting', .7]]);
// 85 «Als ich die Augen öffnete,»: Jonas abre los ojos de golpe, la cara iluminada de morado
shot(97.17, 'F', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ, PI, L, { crouch: .1, headX: -.1 }, 'shock'); cara(j, L.T, L.lt < .2 ? { eyes: 'closed', mouth: 'grimace' } : { expr: 'shock', eyes: 'wide', mouth: 'o' }); lp(3, -2, 6, JZ - 3, 120, 0x9a4aff, 20);
  onFace(j, 6.5, .3, 0, 40, L.k, 5); sh(V(0, 0, JZ), 16); }, [[0, 'flash', .4], [.15, 'gasp', .6]]);
// 86 «rissen schwarze Flügel aus seinem Rücken.»: ¡las alas negras estallan desde la espalda de Elias! Lluvia de plumas negras, destello rojo, temblor
shot(98.69, 'C', 'punch', L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, .4, L, { aLx: .6, aRx: .6, aLz: .6, aRz: .6, aLe: .3, aRe: .3, lean: -.15, headX: -.2 }, 'angry', { mouth: 'grin' }); const k = clamp(L.lt / .45); eliasWings(k, L.T); if (L.lt < .4) SHAKE = 1 - L.lt / .4;
  FEA.fall(V(-2.6, 0, JZ - 2.4), L.T, 0x16141c, .2, 22, 18); if (L.lt < .12) TINT = 'rgba(255,20,40,.45)'; todOn(0, 0, JZ - 9, 0, L, { rx: -2.8, sx: .4, eyes: 6 });
  orb(L.k, V(-2.6, 6, JZ - 2.4), null, [26, PI + .4, .12, 50], [22, PI + .15, .1, 48]); sh(V(-2, 0, JZ), 26); }, [[0, 'impact', .6], [.02, 'metal_rip', .6], [.08, 'feathers', .8], [.2, 'braam', .7], [.5, 'wind', .5]]);
// 87 «aus seinem Rücken.»: desde atrás: las dos alas enormes se despliegan del todo con un golpe de aire que levanta el confeti
shot(99.89, 'R', null, L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, PI + .2, L, { aLx: .4, aRx: .4, aLz: .3, aRz: .3, headX: -.1 }, 'angry'); eliasWings(1, L.T); confetti(V(6, -4, JZ - 8), L.t0, L.T, 14, 1.2);
  orb(L.k, V(-2.6, 7, JZ - 2.4), null, [24, .2, .25, 52], [19, -.25, .18, 50]); sh(V(-2, 0, JZ), 26); }, [[0, 'whirl', .4], [.1, 'wind', .6], [.3, 'feathers', .5]]);
// 88 «Sein Schatten verschluckte den halben Platz.»: cenital: una sombra negra se extiende desde Elias y se traga media plaza; la gente corre
shot(100.57, 'W', null, L => { festS(L); pose(elias, -2.6, 0, JZ - 2.4, PI + .2, L, { aLx: .4, aRx: .4, aLz: .3, aRz: .3 }, 'angry'); eliasWings(1, L.T); pose(jonas, 0, 0, JZ, PI, L, {}, 'shock'); pose(mira, 3.4, 0, JZ + .6, PI - .15, L, {}, 'smug');
  crowdF(L, 20, { mode: 'run', expr: 'shock', x: 0, z: JZ, r0: 12, r1: 30, gap: 0 }); POST.push(() => DX.forEach(c => { if (c.root.visible) { const p = c.root.position; c.root.rotation.y = Math.atan2(p.x, p.z - JZ); } }));
  SHD.visible = true; SHD.position.set(-2.6, .08, JZ - 2.4); SHD.scale.setScalar(lerp(4, 42, easeOut(clamp(L.lt / 1.4)))); hemi.intensity *= lerp(1, .55, L.k);
  cm([0, 60, JZ + 10, 0, 0, JZ - 2, 50], [0, 46, JZ + 6, 0, 0, JZ - 2, 54], L.k); sh(V(0, 0, JZ), 40); }, [[0, 'swipe', .4], [.1, 'drone', .7], [.4, 'crowd_run', .6], [.8, 'scream_girl', .3]]);
// 89 «den halben Platz.»: plano bajo: la oscuridad avanza por los adoquines hacia la cámara, las bombillas de las guirnaldas se apagan
shot(101.93, 'S', null, L => { festS(L); pose(elias, -2.6, 0, JZ - 2.4, PI + .2, L, { aLx: .4, aRx: .4 }, 'angry'); eliasWings(1, L.T); SHD.visible = true; SHD.position.set(-2.6, .08, JZ - 2.4); SHD.scale.setScalar(42 + L.lt * 6);
  hemi.intensity *= .5; FILL.intensity *= .4; for (let i = 0; i < 3; i++) LP[i].intensity *= .3; DARK = .2;
  cm([6, 1.5, JZ + 22, -2, 6, JZ - 2, 50], [4, 1.8, JZ + 17, -2, 7, JZ - 2, 48], L.k); sh(V(0, 0, JZ), 30); }, [[0, 'whoosh_down', .5], [.2, 'switch', .5], [.5, 'hum_low', .5]]);
// 90 «Und Mira?»: Jonas se gira hacia Mira; ella le devuelve una sonrisa tranquila… y le brilla el pelo
shot(103.02, 'F', null, L => { festS(L); const [j, , m] = trio(L, { j: { headY: lerp(0, -.7, easeOut(clamp(L.lt / .3))) } }); cara(j, L.T, { expr: 'shock', mouth: 'o' }); cara(m, L.T, { expr: 'happy', mouth: 'smile' }); eliasWings(1, L.T); glowAt(hp(m), 3, 0xffd890, .15); DARK = .15;
  orb(L.k, V(1.7, 5.5, JZ + .3), null, [13, PI - .7, .1, 42], [10, PI - .4, .1, 40]); sh(V(0, 0, JZ), 18); }, [[0, 'flash', .3], [.1, 'whoosh', .4], [.4, 'hum_glow', .4]]);
// 91 «Mira brannte.»: Mira se envuelve en luz dorada: brasas subiendo, el aire tiembla a su alrededor
shot(103.77, 'C', 'punch', L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { aLx: .4, aRx: .4, aLz: .5, aRz: .5, headX: -.15 }, 'determined'); GOLDEYE.forEach(e => e.visible = true); HANDG.forEach(g => g.visible = true);
  glowAt(hp(m).add(V(0, -1, 0)), 4, 0xffb040, .1); EMB.rise(V(3.4, 0, JZ + .6), L.T, 0xffa020, 6, 14, 44); lp(3, 3.4, 5, JZ + 4, 160, 0xffb040, 24);
  onBody(m, 18, 0, .1, 44, L.k, 13); sh(V(3, 0, JZ), 18); }, [[0, 'impact', .5], [.05, 'fire_whoosh', .7], [.2, 'fire_crackle', .6]]);
// 92 «Acht Flügel»: zoom lento: ocho alas de luz se abren una tras otra detrás de Mira; «8»
shot(105.04, 'Z', 'slow', L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { aLx: .6, aRx: .6, aLz: .7, aRz: .7, aLe: .2, aRe: .2, headX: -.2 }, 'determined'); miraWings(easeOut(clamp(L.lt / 1.1)), L.T, false);
  glowAt(hp(m).add(V(0, -1, 0)), 4, 0xfff0c0, .1); EMB.rise(V(3.4, 0, JZ + .6), L.T, 0xfff0c0, 8, 14, 30); lp(3, 3.4, 6, JZ + 6, 140, 0xfff0d0, 30); BLOOMMAX = .24;
  badge('gold', '8', W / 2, H * .18, clamp((L.lt - .9) / .2), 1, 1.5); onBody(m, 30, .05, .12, 48, L.k, 24); sh(V(3, 0, JZ), 24); }, [[0, 'zoom_in', .3], [.1, 'whoosh_magic', .6], [.3, 'feathers', .5], [.6, 'choir', .6]]);
// 93 «aus reinem, weißem Licht.»: órbita alrededor de Mira con las ocho alas abiertas, plumas blancas cayendo
shot(105.72, 'R', null, L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { aLx: .6, aRx: .6, aLz: .7, aRz: .7, aLe: .2, aRe: .2 }, 'determined'); miraWings(1, L.T, false); FEA.fall(V(3.4, 0, JZ), L.T, 0xffffff, .8, 22, 18);
  glowAt(hp(m).add(V(0, -1, 0)), 4, 0xfff0c0, .1); lp(3, 3.4, 6, JZ + 6, 140, 0xfff0d0, 30); BLOOMMAX = .24; orb(L.k, V(3.4, 7, JZ + .6), null, [30, PI - .6, .15, 50], [26, PI + .5, .1, 50]); sh(V(3, 0, JZ), 26); }, [[0, 'whirl', .4], [.1, 'choir', .5], [.5, 'sparkle', .5]]);
// 94 «Und ihr Heiligenschein»: aparece la aureola sobre su cabeza…
shot(107.45, 'S', null, L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { headX: -.1 }, 'determined'); miraWings(1, L.T, true); HALO.scale.setScalar(easeOut(clamp(L.lt / .4)) * 1.2); BLOOMMAX = .24;
  onFace(m, 9, 1.6, 0, 42, L.k, 7); sh(V(3, 0, JZ), 16); }, [[0, 'swipe', .4], [.1, 'ding_reveal', .6], [.3, 'hum_glow', .5]]);
// 95 «stand in Flammen.»: …y se prende en llamas doradas; primer plano con brasas
shot(108.37, 'C', 'punch', L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { headX: -.15 }, 'determined'); miraWings(1, L.T, true); HALO.scale.setScalar(1.2); EMB.rise(hp(m).add(V(0, 2, 0)), L.T, 0xffa020, 3, 5, 24); BLOOMMAX = .26;
  const h = hp(m); cm([h.x - 2, h.y + 5, h.z - 7, h.x, h.y + 1.6, h.z, 42], [h.x - 1.4, h.y + 4, h.z - 5.4, h.x, h.y + 1.6, h.z, 40], L.k); sh(V(3, 0, JZ), 16); }, [[0, 'fire_whoosh', .7], [.1, 'ignite', .6], [.3, 'fire_crackle', .6]]);
// 96 «Der Tod erstarrte.»: el Tod se congela con la guadaña en alto; escarcha azul, sus ojos parpadean
shot(109.55, 'F', null, L => { festS(L); const t = todOn(0, 0, JZ - 9, 0, L, { rx: -2.8, sx: .4, eyes: Math.sin(L.T * 30) > 0 ? 6 : 1 }); TINT = 'rgba(120,180,255,.16)';
  const h = t.head.getWorldPosition(V(0, 0, 0)); cm([h.x + 6, h.y - 3, h.z + 14, h.x, h.y - 2, h.z, 46], [h.x + 4, h.y - 2.4, h.z + 10.5, h.x, h.y - 2, h.z, 44], L.k); sh(V(0, 0, JZ - 9), 20); }, [[0, 'flash', .4], [.1, 'freeze', .7], [.4, 'glass_crack', .4]]);
// 97 «Nachtiel.»: Elias de frente con las alas negras abiertas; título NACHTIEL en morado
shot(110.73, 'C', 'punch', L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, .1, L, { aLx: .3, aRx: .3, aLz: .5, aRz: .5, headX: -.1 }, 'smug', { mouth: 'smirk' }); eliasWings(1, L.T); FEA.fall(V(-2.6, 0, JZ - 2.4), L.T, 0x16141c, .2, 18, 16, 20); TINT = 'rgba(40,0,70,.2)';
  title('NACHTIEL', null, clamp(L.lt / .2), 'red'); onBody(e, 30, 0, .1, 50, L.k, 24); sh(V(-2, 0, JZ), 26); }, [[0, 'impact', .6], [.05, 'braam', .7], [.3, 'feathers', .4]]);
// 98 «Der Engel der absoluten Dunkelheit.»: grúa lenta alrededor de Nachtiel, ojos rojos, plumas negras cayendo; subtítulo
shot(111.83, 'R', null, L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, .1, L, { aLx: .3, aRx: .3, aLz: .5, aRz: .5 }, 'angry', { mouth: 'smirk' }); eliasWings(1, L.T); FEA.fall(V(-2.6, 0, JZ - 2.4), L.T, 0x16141c, .2, 18, 16, 24); TINT = 'rgba(40,0,70,.22)';
  title('NACHTIEL', 'DER ENGEL DER ABSOLUTEN DUNKELHEIT', 1, 'red'); orb(L.k, V(-2.6, 6, JZ - 2.4), null, [22, -.6, -.05, 50], [24, .5, .2, 50]); sh(V(-2, 0, JZ), 26); }, [[0, 'whirl', .4], [.2, 'drone', .6], [.7, 'wind', .4]]);
// 99 «Das Leben wich zurück.»: el Leben, en el escenario, retrocede flotando con las manos en alto y los ojos muy abiertos
shot(114.19, 'W', null, L => { festS(L); const l = lebenOn(-9, SY, lerp(-65, -69, easeOut(L.k)), .2, L, { rx: -1.6, lx: -1.6, eyes: 2, hx: -.2 });
  const h = l.head.getWorldPosition(V(0, 0, 0)); cm([h.x + 6, h.y - 4, h.z + 22, h.x, h.y - 3, h.z, 46], [h.x + 3, h.y - 3, h.z + 17, h.x, h.y - 3, h.z, 46], L.k); sh(V(-9, 4, -66), 24); }, [[0, 'swipe', .4], [.1, 'leaves', .5], [.4, 'gasp_old', .4]]);
// 100 «Und Lumiel.»: Mira de frente con las ocho alas y la aureola en llamas; título LUMIEL en oro
shot(115.76, 'C', 'punch', L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, -.1, L, { aLx: .6, aRx: .6, aLz: .7, aRz: .7, aLe: .2, aRe: .2 }, 'determined', { mouth: 'smile' }); miraWings(1, L.T, true); HALO.scale.setScalar(1.2); BLOOMMAX = .24; glowAt(hp(m).add(V(0, -1, 0)), 4, 0xfff0c0, .1);
  title('LUMIEL', null, clamp(L.lt / .2), 'gold'); onBody(m, 30, 0, .1, 50, L.k, 24); sh(V(3, 0, JZ), 26); }, [[0, 'impact', .6], [.05, 'magic_hit', .7], [.2, 'choir', .5]]);
// 101 «Der Dämon des absoluten Lichts.»: grúa ascendente sobre Lumiel brillando; subtítulo
shot(116.66, 'Z', null, L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, -.1, L, { aLx: .6, aRx: .6, aLz: .7, aRz: .7, aLe: .2, aRe: .2 }, 'determined'); miraWings(1, L.T, true); HALO.scale.setScalar(1.2); BLOOMMAX = .24; EMB.rise(V(3.4, 0, JZ + .6), L.T, 0xfff0c0, 10, 16, 30);
  title('LUMIEL', 'DER DÄMON DES ABSOLUTEN LICHTS', 1, 'gold'); orb(L.k, V(3.4, 6, JZ + .6), null, [24, .4, -.1, 50], [22, -.3, .3, 50]); sh(V(3, 0, JZ), 26); }, [[0, 'zoom_in', .4], [.2, 'hum_glow', .6], [.6, 'sparkle', .5]]);
