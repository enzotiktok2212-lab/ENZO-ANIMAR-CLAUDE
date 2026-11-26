// ---------- b: mismo minuto, nadie vio sus ángeles, el pasillo, la tribuna, manos calientes (31,93 – 70,28 s) ----------
// Flur: pasillo x ∈ ±11 (taquillas a x = ±9,8, frente a ±8,3), techo 16, suelo z ∈ [20, -80]. Tribuna: escalón r (0–3) en x = SPX - 28 - 3r, altura 1,6 + 1,6r.
function carry(j, m, L, pose = {}) { m.root.updateMatrixWorld(true); const a = wpos(m.aL.hand), b = wpos(m.aR.hand), c = a.add(b).multiplyScalar(.5); const ry = m.root.rotation.y, rx = Math.cos(ry), rz = -Math.sin(ry);
  put(j, c.x - rx * 2.6 + Math.sin(m.root.rotation.y) * .9, c.y - 1.0, c.z - rz * 2.6 + Math.cos(m.root.rotation.y) * .6, ry); j.root.rotation.z = -1.45; actuar(j, 0, [[0, { lLx: .9, lRx: .9, lLk: 1.1, lRk: 1.1, aLx: .6, aRx: .3, ...pose }]], { T: L.T, weight: false }); j.blob.visible = false; return j; }
const FX = FLX, TRX = r => SPX - 28 - 3 * r, TRY = r => 1.6 + 1.6 * r;
function kidsFlur(L, list, z0, o = {}) { list.forEach((c, i) => { const s = i % 2 ? 1 : -1, z = z0 - Math.floor(i / 2) * 6 - (i % 3); pose(c, FX + s * (3.6 + (i % 3) * .4), 0, z, s > 0 ? -PI / 2 + .5 : PI / 2 - .5, L, o.pose || { aLx: .2, aRx: .2, headY: Math.sin(L.T + i) * .3 }, o.expr || 'neutral', o.ex || {}); if (o.angels !== false) engel(c, ...NP[(i + 3) % 8], L.T, { s: .7 }); }); }

// 32 «Geboren am selben Tag»: tres cunitas juntas; tres bebés (Jonas turquesa, Elias morado, Mira naranja) sin ángeles, entre bebés que sí los tienen
shot(31.93, 'W', null, L => { nursery(L); const T3 = [NU.CR[6], NU.CR[7], NU.CR[8]]; [BABY[1], BABY[4], BABY[5]].forEach((b, i) => cribBaby(b, T3[i], L, { expr: 'happy', mouth: i === 1 ? 'smirk' : 'open_smile' }));
  for (const [i, j] of [[5, 0], [9, 2]]) { const b = cribBaby(BABY[[0, 2][j / 2]], NU.CR[i], L); engel(b, ...NP[j], L.T, { s: .55, spread: 3.4, up: 1.3, look: 0 }); }
  const c = V(NUX, 4, 2); orb(L.k, c, null, [26, -.35, .5, 46], [19, .2, .42, 44]); sh(c, 26); }, [[0, 'swipe', .4], [.2, 'baby_gasp', .4], [.6, 'lullaby', .3]]);
// 33 «wie ich.»: los tres bebés se giran a la vez y se miran entre ellos, sonriendo
shot(33.09, 'C', 'punch', L => { nursery(L); const T3 = [NU.CR[6], NU.CR[7], NU.CR[8]]; [BABY[1], BABY[4], BABY[5]].forEach((b, i) => { cribBaby(b, T3[i], L, { expr: 'happy', mouth: 'laugh', ry: (1 - i) * .5 }); });
  const c = V(NUX, 3.4, 2); cm([c.x - 3, c.y + 8, c.z + 13, c.x, c.y, c.z, 44], [c.x + 1, c.y + 6.4, c.z + 10, c.x, c.y, c.z, 42], L.k); sh(c, 18); }, [[0, 'impact', .4], [.1, 'kids_laugh', .5]]);
// 34 «Im selben Krankenhaus.»: grúa hacia el rótulo SÄUGLINGSSTATION con toda la sala debajo
shot(33.49, 'Z', null, L => { nursery(L); NU.CR.forEach((cr, i) => { const b = cribBaby(BABY[i % 8], cr, L); if (![6, 7, 8].includes(i)) engel(b, ...NP[i % 8], L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); });
  cm([NUX - 4, 6, 22, NUX, 6, 0, 52], [NUX - 1, 13, 14, NUX, 13.5, -17, 50], L.k); sh(V(NUX, 0, 0), 30); }, [[0, 'zoom_in', .4], [.1, 'whoosh_up', .5], [.5, 'monitor_beep', .4]]);
// 35 «Sogar in derselben Minute:»: las tres tarjetas de las cunas en fila, todas con «3:17»; travelling
shot(34.70, 'S', null, L => { nursery(L); const T3 = [NU.CR[6], NU.CR[7], NU.CR[8]]; [BABY[1], BABY[4], BABY[5]].forEach((b, i) => cribBaby(b, T3[i], L, { expr: 'happy' }));
  T3.forEach((cr, i) => badge3('gold', '3:17', V(NUX + cr.x, 5.2, cr.z + 1.3), clamp((L.lt - .1 - i * .18) / .2), .7));
  cm([NUX - 6, 9, 18, NUX - 2, 4, 2, 46], [NUX + 4, 9, 18, NUX + 4, 4, 2, 46], L.k, x => x); sh(V(NUX, 0, 2), 22); }, [[0, 'swipe', .4], [.1, 'tick', .5], [.3, 'tick', .5], [.5, 'tick', .5]]);
// 36 «drei Uhr siebzehn.»: el reloj grande de la sala: la aguja salta a las 3:17; golpe de zoom
shot(35.94, 'C', 'punch', L => { nursery(L); const m = L.lt < .3 ? 16 : 17; NU.CLK.userData.set(3, m); const c = V(NUX + 16, 12, -17.4);
  badge('gold', '3:17', W / 2, H * .22, clamp((L.lt - .3) / .2), 1, 1.3); cm([c.x - 3, c.y - 1.5, c.z + 15, c.x, c.y, c.z, 40], [c.x - 1, c.y - .6, c.z + 9.5, c.x, c.y, c.z, 38], L.k); }, [[0, 'impact', .5], [.3, 'clock_tick', .7], [.35, 'ding_reveal', .5]]);
// 37 «Und das Komische daran:»: el pasillo del instituto: Elias y Mira (15) junto a sus taquillas; alrededor, todos los alumnos con sus ángeles… ellos dos sin ninguno
shot(37.24, 'R', null, L => { flurS(L); kidsFlur(L, DX.slice(0, 6), 2); pose(elias, FX - 2.2, 0, -8, .2, L, { aLx: -.2, aRx: -.2, aLe: .4, aRe: .4 }, 'smug'); pose(mira, FX + 2.2, 0, -8, -.2, L, { aRx: .9, aRe: 1.4 }, 'happy');
  show(BOOKS[1], 0, 0, 0); attach(BOOKS[1], mira.aR.hand, [0, -.2, .4], [PI / 2, 0, 0], .9);
  orb(L.k, V(FX, 4, -8), null, [22, .3, .12, 46], [15, -.15, .1, 44]); sh(V(FX, 0, -6), 26); }, [[0, 'whirl', .4], [.1, 'classroom', .5], [.5, 'locker', .4]]);
// 38 «Ihre Engel hat auch nie jemand gesehen.»: dos compañeras con lupa miran detrás de los hombros de Elias y Mira, buscando… nada
shot(38.34, 'W', null, L => { flurS(L); pose(elias, FX - 2.4, 0, -8, 0, L, { aLx: -.2, aRx: -.2, aLe: .4, aRe: .4 }, 'smug'); pose(mira, FX + 2.4, 0, -8, 0, L, {}, 'happy');
  const a = pose(DX[6], FX - 5.4, 0, -10.6, .8, L, { aRx: 1.4, aRe: .6, lean: .3, twist: .3, headX: .3 }, 'confused'); const b = pose(DX[7], FX + 5.4, 0, -10.6, -.8, L, { aLx: 1.4, aLe: .6, lean: .3, twist: -.3, headX: .3 }, 'confused');
  engel(a, 'laut', 'leise', L.T, { s: .7 }); engel(b, 'glueck', 'pech', L.T, { s: .7 }); badge('q', '?', W * .3, H * .22, clamp((L.lt - .4) / .2)); badge('q', '?', W * .7, H * .22, clamp((L.lt - .6) / .2));
  orb(L.k, V(FX, 4.5, -9), null, [16, -.25, .14, 44], [12, .2, .12, 42]); sh(V(FX, 0, -8), 20); }, [[0, 'swipe', .4], [.2, 'sniff', .4], [.6, 'whisper', .4]]);
// 39 «Elias meinte,»: Elias apoyado en la taquilla, se encoge de hombros con media sonrisa
shot(40.27, 'Z', null, L => { flurS(L); const e = pose(elias, FX - 6.6, 0, -12, PI / 2 - .2, L, { lean: -.15, aLx: .3, aRx: .3, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5, headZ: .15 }, 'smug', { mouth: 'smirk' }); talk(e, L.T, 40.27, 42.1, 'smug');
  onBody(e, 15, .25, .1, 42, L.k, 10, -.1); sh(V(FX, 0, -12), 18); }, [[0, 'zoom_in', .4], [.2, 'cloth', .4]]);
// 40 «seine sind schüchtern.»: dos ángeles diminutos (en su imaginación) se tapan la cara detrás de su taquilla entreabierta; bocadillo «schüchtern»
shot(41.13, 'C', null, L => { flurS(L); const e = pose(elias, FX - 6.6, 0, -12, PI / 2 - .2, L, { lean: -.15, aRx: 1.0, aRe: 1.2, aRz: .3 }, 'smug', { mouth: 'grin' });
  bubble(e, 'schüchtern…', clamp((L.lt - .1) / .25), 2.2); onFace(e, 7.5, .2, 1.2, 42, L.k, 5.8); sh(V(FX, 0, -12), 18); }, [[0, 'impact', .3], [.1, 'pop', .5], [.4, 'whistle_inno', .4]]);
// 41 «Mira meinte,»: Mira, junto a su taquilla con fotos de playa, gira la cabeza y guiña un ojo
shot(42.12, 'F', null, L => { flurS(L); const m = pose(mira, FX + 6.6, 0, -16, -PI / 2 + .2, L, { aLx: .9, aLe: 1.4, aLz: .2, headZ: -.1 }, 'happy', { eyes: L.lt > .3 ? 'wink' : 'happy', mouth: 'grin' }); talk(m, L.T, 42.12, 43.9, 'happy');
  onBody(m, 15, -.25, .1, 42, L.k, 10, .1); sh(V(FX, 0, -16), 18); }, [[0, 'flash', .3], [.3, 'ding_soft', .4]]);
// 42 «ihre sind im Urlaub.»: bocadillo «im Urlaub 🌴»; Mira se pone unas gafas de sol imaginarias y sonríe; zoom
shot(42.92, 'S', null, L => { flurS(L); const m = pose(mira, FX + 6.6, 0, -16, -PI / 2 + .2, L, { aLx: 2.2, aRx: 2.2, aLe: 1.9, aRe: 1.9, aLz: .3, aRz: .3 }, 'happy', { eyes: 'happy', mouth: 'grin' });
  bubble(m, 'im Urlaub ☀', clamp((L.lt - .1) / .25), 2.2); onFace(m, 7.5, .2, -1.2, 42, L.k, 5.8); sh(V(FX, 0, -16), 18); }, [[0, 'swipe', .4], [.1, 'pop', .5], [.4, 'birds', .3]]);
// 43 «Aber jedes Mal,»: el pasillo: Jonas acorralado contra las taquillas por tres matones (con sus ángeles de brazos cruzados)
shot(43.96, 'Z', null, L => { flurS(L); const j = pose(jonas, FX - 7.2, 0, -20, PI / 2, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, lean: -.15, crouch: .1 }, 'worried'); sweat(j, L.T, 1);
  [[-2.4, -17.6], [-1.2, -20.4], [-2.8, -23]].forEach(([x, z], i) => { const c = pose([kevin, ZW[0], ZW[1]][i], FX + x, 0, z, 0, L, { aRx: .9 + Math.sin(L.T * 6 + i) * .4, aRe: .5, lean: .15 }, 'angry', { mouth: 'grin' }); c.root.rotation.y = faceTo(c.root.position, j.root.position); engel(c, ...[['frieden', 'krieg'], ['feuer', 'wasser'], ['feuer', 'wasser']][i], L.T, { s: .7 }); });
  cm([FX + 5, 6.5, -34, FX - 5, 3.6, -20, 46], [FX + 4, 6, -30, FX - 5, 3.6, -20, 44], L.k); sh(V(FX, 0, -20), 20); }, [[0, 'zoom_in', .4], [.1, 'laugh_deep', .5], [.6, 'locker', .4]]);
// 44 «wenn mich jemand fertigmachte,»: le tiran los libros de las manos y caen al suelo; Jonas se encoge
shot(44.82, 'W', null, L => { flurS(L); const j = pose(jonas, FX - 7.2, 0, -20, PI / 2, L, { aLx: .4, aRx: .4, lean: -.1, crouch: .2, headX: .3 }, 'sad'); const k = pose(kevin, FX - 2.4, 0, -20, -PI / 2, L, { aRx: 1.2 + Math.sin(clamp(L.lt / .3) * PI) * .6, aRe: .2, lean: .2 }, 'angry', { mouth: 'grin' }); engel(k, 'frieden', 'krieg', L.T, { s: .7 });
  BOOKS.forEach((b, i) => { const f = clamp((L.lt - .2 - i * .06) / .5); show(b, FX - 6.4 + i * .5, lerp(4, .2, f * f) , -19.4 + i * .3, i, 1); b.rotation.set(f * (2 + i), i, f * 3); });
  cm([FX + 2, 3.4, -10, FX - 5, 3, -20, 44], [FX + 1, 4.4, -13, FX - 5, 3, -20, 42], L.k); sh(V(FX, 0, -20), 18); }, [[0, 'swipe', .4], [.25, 'paper', .5], [.5, 'thud', .5], [.6, 'laugh_deep', .4]]);
// 45 «waren die beiden plötzlich da.»: al fondo del pasillo aparecen Elias y Mira, caminando decididos hacia cámara; un viento les mueve el pelo
shot(46.18, 'F', null, L => { flurS(L); walk(elias, L, FX - 2.6, -54, 0, 4.2, 0, { expr: 'determined' }); walk(mira, L, FX + 2.6, -54.6, 0, 4.2, 1.4, { expr: 'determined' });
  cm([FX, 3, -32, FX, 4, -54, 44], [FX, 3.4, -38, FX, 4, -52, 40], L.k); sh(V(FX, 0, -48), 22); }, [[0, 'flash', .4], [.05, 'wind', .5], [.2, 'steps', .6], [.6, 'braam_short', .4]]);
// 46 «Als Kevins Kriegsengel»: Kevin, enorme, con su ángel Krieg encima del hombro; el ángel se crece (escala) y se arremanga
shot(47.78, 'C', 'punch', L => { flurS(L); const k = pose(kevin, FX - 1, 0, -20, PI - .35, L, { aLx: .3, aRx: .3, aLz: -.4, aRz: -.4, aLe: 1.6, aRe: 1.6, lean: .05 }, 'angry', { mouth: 'grin' });
  const A = engel(k, 'frieden', 'krieg', L.T, { s: 1, up: 1.4, spread: 3 }); if (A[1]) A[1].scale.setScalar(lerp(1, 1.5, easeOut(clamp(L.lt / .6))));
  cm([FX + 3, 6.5, -36, FX - 1, 5.6, -20, 46], [FX + 1, 6.2, -31, FX - 1, 5.8, -20, 44], L.k); sh(V(FX, 0, -20), 18); }, [[0, 'impact', .5], [.1, 'growl', .5], [.4, 'whoosh_up', .4]]);
// 47 «mich gegen den Spind knallte,»: el Kriegsengel empuja a Jonas con las dos manos y ¡BAM! contra la taquilla, que se abolla; sacudida
shot(48.90, 'C', null, L => { flurS(L); const hit = clamp((L.lt - .25) / .12); const j = put(jonas, FX - lerp(4.5, 7.1, hit), 0, -20, PI / 2); actuar(j, 0, [[0, { aLx: .9 * hit, aRx: .9 * hit, aLz: .6, aRz: .6, lean: -.4 * hit, headX: -.3 * hit }]], { T: L.T }); cara(j, L.T, hit > .5 ? { expr: 'shock', eyes: 'squint', mouth: 'grimace_wide' } : { expr: 'worried' });
  const a = angel('krieg', FX - lerp(2, 4.6, hit), 6.2, -20, -PI / 2, L.T, 1.8, 4); a.userData.body.rotation.z = -.3 * hit; if (hit > 0 && hit < 1) SHAKE = 1; if (L.lt > .25 && L.lt < .55) SHAKE = 1 - (L.lt - .25) / .3;
  dust(V(FX - 8, 3, -20), L.t0 + .3, L.T, 8, .6); cm([FX + 3, 5, -12, FX - 6, 4, -20, 44], [FX + 2, 4.6, -14, FX - 6.4, 4, -20, 42], L.k); sh(V(FX, 0, -20), 18); }, [[0, 'whoosh', .4], [.25, 'metal_hit', .8], [.3, 'locker', .6], [.35, 'gasp', .5]]);
// 48 «bog Elias um die Ecke.»: contrapicado: Elias dobla la esquina del pasillo con las manos en los bolsillos, tranquilísimo; la luz del techo parpadea una vez
shot(50.38, 'R', null, L => { flurS(L); const e = walk(elias, L, FX - 3, -30, 0, 2.6, 0, { expr: 'smug', pose: { aLx: -.25, aRx: -.25, aLe: .5, aRe: .5, aLz: .05, aRz: .05 } });
  if (Math.abs(L.lt - .5) < .06) { renderer.toneMappingExposure *= .4; }
  const p = e.root.position; cm([p.x + 3, 1.2, p.z + 9, p.x, 5.4, p.z, 46], [p.x + 1.4, 1.6, p.z + 6.6, p.x, 5.6, p.z, 44], L.k); sh(p, 18); }, [[0, 'whirl', .4], [.1, 'steps', .6], [.5, 'switch', .4]]);
// 49 «Und genau in dem Moment»: primer plano de Elias: levanta la vista hacia Kevin y sus ojos brillan rojos un instante
shot(51.36, 'Z', 'slow', L => { flurS(L); const e = pose(elias, FX - 3, 0, -24, .1, L, { aLx: -.25, aRx: -.25, aLe: .5, aRe: .5, headX: -.08 }, 'smug', { mouth: 'smirk' }); REDEYE.forEach(r => r.visible = L.lt > .9);
  onFace(e, 7.5, .1, .4, 40, L.k, 4.6); sh(V(FX, 0, -24), 16); }, [[0, 'zoom_in', .3], [.9, 'creepy_ting', .6]]);
// 50 «ging im ganzen Flur»: los fluorescentes del pasillo se apagan uno tras otro hacia cámara, CLAC CLAC CLAC
shot(52.87, 'W', null, L => { flurS(L); const z0 = -70 + L.lt * 60; for (const l of FLL) { if (l.position.z < z0 - 0) l.intensity = 0; } for (const m of FLG) if (m.position.z < z0) m.material.emissiveIntensity = 0; hemi.intensity = lerp(.9, .2, L.k); FILL.intensity = lerp(36, 6, L.k);
  pose(kevin, FX - 1, 0, -20, -PI / 2 + .3, L, { aRx: .8, headY: -.6 }, 'confused'); pose(jonas, FX - 7.1, 0, -20, PI / 2, L, { crouch: .2 }, 'worried'); pose(elias, FX - 3, 0, -26, .1, L, {}, 'smug');
  cm([FX + 4, 12, 6, FX, 6, -40, 48], [FX + 2, 10, 0, FX, 6, -40, 46], L.k); sh(V(FX, 0, -20), 20); }, [[0, 'switch', .6], [.2, 'switch', .6], [.4, 'switch', .6], [.6, 'switch', .6], [.75, 'hum_low', .4]]);
// 51 «das Licht aus.»: negro total; sólo dos ojos rojos que brillan en la oscuridad y un golpe sordo
shot(54.05, 'B', null, L => { flurS(L, { dark: true }); const e = pose(elias, FX - 3, 0, -22, 0, L, {}, 'angry'); REDEYE.forEach(r => r.visible = true); DARK = .55;
  onFace(e, 9, 0, 0, 40, L.k, 7); }, [[0, 'switch', .6], [.3, 'whoosh', .4], [.5, 'thud', .7], [.62, 'impact', .6], [.7, 'metal_hit', .5]]);
// 52 «Als es wieder anging,»: las luces parpadean y vuelven: el pasillo vacío… Elias ya está apoyado en otra taquilla, silbando
shot(54.98, 'F', null, L => { flurS(L); const fl = L.lt < .4 && Math.sin(L.lt * 70) > 0; if (fl) { for (const l of FLL) l.intensity = 0; renderer.toneMappingExposure = .45; }
  pose(elias, FX + 3.4, 0, -16, -.4, L, { lean: -.1, aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, 'smug', { mouth: 'o' }); pose(jonas, FX - 3.4, 0, -20, .4, L, { aLx: .5, aRx: .5, headY: .5 }, 'shock', { mouth: 'o' });
  cm([FX - 1, 6, 2, FX, 4, -18, 46], [FX + 1, 5.4, -3, FX, 4, -18, 44], L.k); sh(V(FX, 0, -18), 20); }, [[0, 'flash', .4], [.05, 'hum_glow', .5], [.2, 'switch', .5], [.6, 'whistle_inno', .5]]);
// 53 «lag Kevin am Boden.»: picado: Kevin tumbado boca arriba, mareado, con estrellitas; su Kriegsengel tirado a su lado, con el casco torcido
shot(56.13, 'Z', null, L => { flurS(L); const k = put(kevin, FX - 1, .5, -20, 0); k.root.rotation.x = -PI / 2; actuar(k, 0, [[0, { aLz: .9, aRz: .9, lLx: .2, lRx: -.2 }]], { T: L.T, weight: false }); cara(k, L.T, { eyes: 'squint', mouth: 'wavy' }); k.blob.visible = false;
  const a = angel('krieg', FX + 3, .9, -18.5, 0, L.T, 1.3, 2, 0); a.rotation.z = PI / 2; const h = hp(k);
  FX2D.push(c => { const [x, y] = proj(h.clone().add(V(0, 1.6, 0))); for (let i = 0; i < 5; i++) { const a_ = L.T * 3 + i * 1.26; c.save(); c.translate(x + Math.cos(a_) * 120, y + Math.sin(a_) * 40); c.font = `700 ${60 * U}px ${FONT}`; c.fillStyle = '#ffe07a'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 8; c.textAlign = 'center'; c.strokeText('★', 0, 0); c.fillText('★', 0, 0); c.restore(); } });
  cm([FX + 1, 15, -9, FX - 1, 0, -20, 46], [FX + .5, 12, -13, FX - 1, 0, -20, 44], L.k); sh(V(FX, 0, -20), 16); }, [[0, 'zoom_in', .4], [.1, 'shiver', .3], [.3, 'boing_metal', .4]]);
// 54 «Und keiner hatte gesehen,»: los alumnos asoman por todo el pasillo mirando a todos lados, desconcertados (sus ángeles también)
shot(57.23, 'R', null, L => { flurS(L); kidsFlur(L, DX.slice(0, 6), -8, { pose: { aLx: .5, aRx: .5, aLe: 1.4, aRe: 1.4, aLz: -.4, aRz: -.4, headY: Math.sin(L.T * 4) * .5 }, expr: 'confused' }); pose(jonas, FX - 7.1, 0, -20, PI / 2 + .4, L, { headY: Math.sin(L.T * 3) * .5 }, 'confused');
  cm([FX - 3, 6, 4, FX, 4, -14, 50], [FX + 3, 5.5, 1, FX, 4, -14, 50], L.k); sh(V(FX, 0, -12), 26); }, [[0, 'whirl', .4], [.2, 'whisper', .5], [.6, 'classroom', .4]]);
// 55 «was passiert war.»: Elias, de espaldas a la escena, se aleja silbando con las manos detrás de la cabeza; Mira le da un codazo cómplice
shot(58.25, 'S', null, L => { flurS(L); walk(elias, L, FX - 2, -26, PI, 2, 0, { expr: 'smug', pose: { aLx: 2.8, aRx: 2.8, aLe: 2, aRe: 2, aLz: .3, aRz: .3 } }); elias.root.rotation.y = PI; walk(mira, L, FX + 2, -26.4, PI, 2, 1, { expr: 'happy', mouth: 'grin' });
  orb(L.k, V(FX, 4, -26 - L.lt * 2), null, [-20, .4, .12, 46], [-15, -.1, .1, 44]); sh(V(FX, 0, -30), 18); }, [[0, 'swipe', .4], [.1, 'whistle_inno', .6], [.5, 'steps', .4]]);
// 56 «Als mich die Zwillinge Lukas und Leon»: la tribuna del campo: los gemelos (sudaderas naranjas iguales, LU/LE) arriba del todo, sonriendo con malicia, uno a cada lado de Jonas
shot(59.29, 'W', null, L => { sportS(L); const x = TRX(3), y = TRY(3), z = 0; const j = pose(jonas, x, y, z, PI / 2, L, { aLx: .3, aRx: .3, headY: Math.sin(L.T * 3) * .3 }, 'worried'); sweat(j, L.T, 1);
  ZW.forEach((c, i) => { const s = i ? 1 : -1; pose(c, x - .6, y, z + s * 3.2, PI / 2 - s * .5, L, { aLx: .6, aRx: .6, aLe: 1.4, aRe: 1.4, aLz: -.4, aRz: -.4 }, 'smug', { mouth: 'grin' }); engel(c, 'feuer', 'wasser', L.T, { s: .7 }); });
  for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) { const c = DX[r * 2 + k + 10]; sit(c, TRX(r) + .2, TRY(r) + .7, -10 + k * 18 + r * 2, PI / 2, L, { aLx: .4, aRx: .4 }); cara(c, L.T, { expr: 'happy' }); }
  orb(L.k, V(x, y + 4, z), null, [24, PI / 2 + .45, .1, 46], [17, PI / 2 + .1, .05, 44]); sh(V(x, 0, z), 26); }, [[0, 'swipe', .4], [.1, 'crowd_run', .2], [.4, 'laugh_deep', .5]]);
// 57 «von der obersten Reihe der Tribüne»: plano desde abajo del campo: la tribuna altísima, Jonas en la última fila entre los gemelos; «REIHE 4»
shot(60.75, 'Z', null, L => { sportS(L); const x = TRX(3), y = TRY(3), z = 0; pose(jonas, x, y, z, PI / 2, L, { aLx: .3, aRx: .3 }, 'worried'); ZW.forEach((c, i) => { const s = i ? 1 : -1; pose(c, x - .6, y, z + s * 3.2, PI / 2 - s * .4, L, { aLx: .9, aRx: .9, aLe: .3, aRe: .3 }, 'smug', { mouth: 'grin' }); });
  badge('red', 'REIHE 4', W / 2, H * .18, clamp((L.lt - .2) / .2), 1, .8); cm([SPX - 4, 1.5, 6, x, y + 3, z, 50], [SPX - 10, 1.4, 3, x, y + 4, z, 46], L.k); sh(V(x, 0, z), 26); }, [[0, 'zoom_in', .4], [.2, 'wind', .4]]);
// 58 «schubsten,»: los gemelos empujan a Jonas a la vez por la espalda; sale despedido hacia delante, brazos al aire
shot(62.19, 'C', 'punch', L => { sportS(L); const x = TRX(3), y = TRY(3), z = 0; const pu = clamp(L.lt / .2); const f = clamp((L.lt - .15) / .5);
  const j = put(jonas, x + f * 6, y + f * 1.5 - f * f * 3, z, PI / 2); j.root.rotation.z = -f * .6; actuar(j, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .6, aRz: .6, lLx: -.6, lRx: .5 }]], { T: L.T }); cara(j, L.T, { expr: 'shock', mouth: 'scream' });
  ZW.forEach((c, i) => { const s = i ? 1 : -1; pose(c, x - .4 + pu * .8, y, z + s * 2.2, PI / 2, L, { ...PUSH, aLx: 1.5 * pu, aRx: 1.5 * pu }, 'angry', { mouth: 'grin' }); });
  orb(L.k, V(x + 2, y + 3, z), null, [20, PI / 2 + .9, .2, 46], [16, PI / 2 + .6, .1, 44]); sh(V(x, 0, z), 22); }, [[0, 'impact', .5], [.05, 'kick', .5], [.15, 'scream_girl', .3], [.2, 'whoosh_down', .6]]);
// 59 «kam ich nie unten an.»: cámara lenta: Jonas cayendo de espaldas por el aire, la mochila abierta soltando hojas; el suelo se acerca
shot(62.85, 'R', 'slow', L => { sportS(L); const k = L.k; const p = V(TRX(1) + 2 + k * 4, lerp(8, 3.2, k), 0); const j = put(jonas, p.x, p.y, p.z, PI / 2); j.root.rotation.z = -1.2 - k * .4; actuar(j, 0, [[0, { aLx: 2.8 + Math.sin(L.T * 5) * .2, aRx: 2.6, aLz: .8, aRz: .8, lLx: .8, lRx: -.4, lRk: .6 }]], { T: L.T }); cara(j, L.T, { expr: 'shock', mouth: 'scream', eyes: 'closed' }); j.blob.visible = false;
  for (let i = 0; i < 4; i++) { const b = show(BOOKS[i], p.x - 2 + i * 1.2, p.y + 2 + i * .6 - k, p.z - 2 + i, 0); b.rotation.set(L.T * (1 + i), i, L.T * 2); }
  orbit(p, lerp(26, 20, k), PI / 2 + .5, .05, 46); sh(p, 20); }, [[0, 'whirl', .4], [.1, 'wind', .6], [.3, 'heartbeat', .5]]);
// 60 «Denn Mira fing mich auf.»: ¡Mira aparece debajo y lo coge en brazos sin esfuerzo! Polvo, sus pies apenas se hunden
shot(64.10, 'F', null, L => { sportS(L); const mx = TRX(0) + 6, mz = 0; const k = clamp(L.lt / .18); const m = pose(mira, mx, 0, mz, PI / 2 - .3, L, { ...CATCH, crouch: .25 - k * .1 }, 'happy', { mouth: 'grin' });
  const j = carry(jonas, m, L); j.root.position.y += lerp(5, 0, easeOut(k)); cara(j, L.T, { expr: 'shock', mouth: 'o' });
  dust(V(mx, 0, mz), L.t0 + .15, L.T, 10, .8); onBody(m, 26, .25, .3, 44, L.k, 19, -.1); sh(V(mx, 0, mz), 18); }, [[0, 'flash', .4], [.15, 'land', .7], [.2, 'hug', .4], [.4, 'gasp', .4]]);
// 61 «Ihre Hände waren warm.»: primer plano de las manos de Mira bajo la espalda de Jonas: brillan naranja
shot(65.36, 'Z', null, L => { sportS(L); const mx = TRX(0) + 6, mz = 0; const m = pose(mira, mx, 0, mz, PI / 2 - .3, L, { ...CATCH, crouch: .15 }, 'happy'); const j = carry(jonas, m, L, { aLx: 1.6, lLx: .8, lRx: .8, lLk: .9, lRk: .9 }); cara(j, L.T, { expr: 'confused' });
  HANDG.forEach(g => { g.visible = true; g.scale.setScalar(.8 + Math.sin(L.T * 9) * .15 + L.k * .4); }); EMB.rise(wpos(mira.aR.hand), L.T, 0xffa030, 2, 4, 14);
  const p = wpos(mira.aR.hand); cm([p.x + 5, p.y + 2, p.z + 6, p.x, p.y, p.z, 42], [p.x + 3.4, p.y + 1.4, p.z + 4.4, p.x, p.y, p.z, 40], L.k); sh(p, 12); }, [[0, 'zoom_in', .4], [.1, 'hum_glow', .6], [.4, 'fire_crackle', .3]]);
// 62 «Viel zu warm.»: a Jonas le sale vapor de la chaqueta, suda; mira a Mira; los ojos de ella relampaguean dorados un instante
shot(66.62, 'C', 'punch', L => { sportS(L); const mx = TRX(0) + 6, mz = 0; const m = pose(mira, mx, 0, mz, PI / 2 - .3, L, { ...CATCH, crouch: .15 }, 'happy', { mouth: 'smile' }); GOLDEYE.forEach(e => e.visible = L.lt > .35 && L.lt < .6); const j = carry(jonas, m, L, { aLx: 1.6, lLx: .8, lRx: .8, lLk: .9, lRk: .9, headY: -.6 }); cara(j, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' }); sweat(j, L.T, 2);
  HANDG.forEach(g => { g.visible = true; g.scale.setScalar(1.2); }); EMB.rise(hp(j).add(V(0, -1, 0)), L.T, 0xffffff, 3, 6, 20);
  const p = hp(j).lerp(hp(m), .5); orb(L.k, p.clone().add(V(0, 1, 0)), null, [17, 1.6, .35, 42], [13, 1.2, .3, 40]); sh(p, 14); }, [[0, 'impact', .4], [.1, 'steam', .6], [.35, 'magic_hit', .4], [.5, 'gulp', .5]]);
// 63 «Ich habe nie Fragen gestellt.»: atardecer: los tres caminan por la calle; Jonas se encoge de hombros, sonriendo
shot(67.50, 'W', null, L => { town(L, { dusk: true }); walk(jonas, L, 30, -2, PI, 2, 0, { expr: 'happy', pose: { aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, aLx: .3, aRx: .3 } }); walk(elias, L, 26.6, -1.4, PI, 2, 1.2, { expr: 'smug' }); walk(mira, L, 33.4, -1.6, PI, 2, 2.2, { expr: 'happy' });
  orb(L.k, V(30, 4, -2 - L.lt * 2), null, [-18, 0, .1, 46], [-14, -.45, .14, 44]); POST.push(() => { for (const c of [jonas, elias, mira]) c.root.rotation.y = PI; }); sh(V(30, 0, -4), 22); }, [[0, 'swipe', .4], [.1, 'steps', .5], [.4, 'birds', .3]]);
// 64 «Hätte ich aber besser.»: zoom lento: en la pared de la casa, sus sombras alargadas… las de Elias y Mira tienen ALAS
shot(68.99, 'C', 'slow', L => { town(L, { dusk: true }); for (const [c, x, i] of [[elias, -3.2, 1], [jonas, 0, 0], [mira, 3.2, 2]]) walk(c, L, x, 10, PI, 1.4, i, { expr: i ? 'smug' : 'happy' });
  WE.visible = true; WE.userData.spread(1, L.T); WE.userData.ghost(true); WM.visible = true; WM.userData.spread(1, L.T); WM.userData.ghost(true); hemi.intensity = .35; FILL.intensity = 8; sun.intensity = 3.6;
  sh(V(0, 0, 0), 30); sun.position.set(0, 12, 40); sun.target.position.set(0, 0, -10); cm([3, 18, 22, 0, 0, 0, 48], [-2, 22, 20, 0, 0, -2, 52], L.k); }, [[0, 'impact', .3], [.4, 'creepy_ting', .5], [.8, 'whoosh_magic', .4]]);
