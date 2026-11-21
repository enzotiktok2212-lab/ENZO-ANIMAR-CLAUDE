// ---------- c: cientos de Thomas, la tapa del cielo, el ojo gigante, el brezel y el oro (47,88 – 89,80 s) ----------
// la ciudad bajo la tapa: el techo gigante sustituye al cielo
const underLid = (L) => { use('CI'); day(); CITY.userData.CARS.forEach(c => c.visible = false); DECK.visible = true; sky.sky.visible = false; scene.fog.density = 0; hemi.intensity = 1.1; };
// Thomas gigante inclinado sobre la ciudad (sobre la tapa no: dentro de su sótano), con la lupa delante del ojo
const giant = (L, pose = {}, S = .9 / MINI_S) => { const g = put(ichG, 0, -(TABLE_Y + .23) / MINI_S + 26, -110, 0); g.root.scale.setScalar(S); actuar(g, 0, [[0, { lean: .35, headX: -.15, aRx: 2.3, aRz: -.25, aRe: 1.9, aLx: .3, aLe: .4, ...pose }]], { T: L.T }); return g; };

// «Hunderte Thomas,»: mosaico de cientos de mí, todos con su maqueta
shot(47.88, 'Z', 'punch', L => { kel(L); atTable(ich, L.T, { headX: .25 }); talk(ich, L.T, 47.88, 50.5, 'joy'); orbit(V(KX, 3.6, -3), 13, .3, .25, 44); const n = Math.round(lerp(2, 7, easeIn(L.k))); GRID = [n, Math.round(n * 1.6), 1]; }, [[0, 'whoosh', .5], [.4, 'crowd', .5]]);
// «und alle sagten genau dasselbe.»: cientos hablando a la vez
shot(48.98, 'S', null, L => { kel(L); atTable(ich, L.T, { headX: .1, lean: .1, aRx: 1.2 + Math.sin(L.T * 5) * .2, aRe: .8 }); talk(ich, L.T, 48.98, 50.5, 'talk'); onFace(ich, 5, 0, .3, 42, L.k, 4.4); GRID = [6, 10, 1]; }, [[0, 'crowd', .5]]);
// «Und da verstand ich es.» (zoom lento): fuera, delante de mi casa, me quedo helado
shot(50.69, 'C', 'slow', L => { use('CI'); day(); const c = put(ich, 3.25, .5, -45, 0); actuar(c, 0, [[0, { aLx: .1, aRx: .1, headX: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(c, 6.4, .6, .4, 44, L.k, 4.6); CITY.userData.CARS.forEach(c => c.visible = false); sh(V(3, 0, -44), 18); }, [[0, 'heartbeat', .5]]);
// «Ganz langsam schaute ich nach oben.» (zoom lento): plano bajo, levanto la cabeza
shot(52.09, null, 'slow', L => { use('CI'); day(); const c = put(ich, 3.25, .5, -45, 0); const k = easeInOut(L.k); actuar(c, 0, [[0, { headX: lerp(0, -.6, k), lean: lerp(0, -.15, k), aLx: .1, aRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide', mouth: 'o' });
  CITY.userData.CARS.forEach(c => c.visible = false); cm([5.5, 1.8, -36, 3.25, 5.4, -45, 50], [5, 1.6, -37.5, 3.25, 5.8, -45, 46], L.k); sh(V(3, 0, -44), 18); }, [[0, 'whoosh', .3]]);
// «Der Himmel hatte einen Deckel.»: mirando arriba: en vez de cielo, un techo de madera gigante
shot(53.84, 'F', 'punch', L => { underLid(L); plazaLife(L.T, 12, 53); cm([0, 8, 40, 0, 200, -240, 64], [0, 8, 40, 20, 230, -260, 62], L.k); sh(V(0, 0, 0), 60); }, [[0, 'braam', .8]]);
// «Und ein riesiges Auge starrte»: un ojo gigante (mi cara enorme) asoma sobre los tejados
shot(55.72, 'Z', 'slow', L => { underLid(L); giant(L); cara(ichG, L.T, { expr: 'neutral', eyes: 'normal', mouth: 'flat' }); const h = hp(ichG);
  cm([3, 4, 30, h.x, h.y - 6, h.z, 56], [3, 4, 22, h.x, h.y - 4, h.z, 48], L.k); sh(V(0, 0, 0), 60); }, [[0, 'rumble', .5]]);
// «durch eine Lupe auf mich herab.»: la lupa gigante delante del ojo
shot(57.46, 'C', 'punch', L => { underLid(L); giant(L, { aRx: 2.6, aRz: -.45, aRe: 2.3 }); cara(ichG, L.T, { expr: 'neutral', eyes: 'wide', mouth: 'o' }); attach(LUPE2, ichG.aR.hand, [0, -.6, .45], [0, 0, 0], .9);
  const h = hp(ichG); cm([0, 4, 20, h.x, h.y + 6, h.z, 40], [0, 4, 16, h.x, h.y + 6, h.z, 36], L.k); sh(V(0, 0, -30), 60); }, [[0, 'sparkle', .5]]);
// «Das war ich.»: primer plano, en shock
shot(58.94, 'W', null, L => { use('CI'); day(); const c = put(ich, 3.25, .5, -45, 0); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); talk(c, L.T, 58.94, 59.7, 'shock', { eyes: 'wide' }); onFace(c, 4.2, 0, -.4, 40, L.k, 3.6); sh(V(3, 0, -44), 18); }, [[0, 'gasp', .5]]);
// «Ein Riesen-Thomas!»: plano enorme: mi cara gigante sobre la ciudad
shot(59.97, 'C', 'punch', L => { underLid(L); giant(L, { aRx: .6, aRe: .4 }); cara(ichG, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); plazaLife(L.T, 12, 60);
  const h = hp(ichG); cm([-16, 6, 40, h.x, h.y - 14, h.z, 58], [-12, 6, 34, h.x, h.y - 12, h.z, 56], L.k); sh(V(0, 0, 0), 60); }, [[0, 'impact', .6], [.2, 'crowd_gasp', .5]]);
// «Ich winkte.»: yo, abajo, saludo hacia arriba
shot(61.30, 'S', null, L => { use('CI'); day(); const c = put(ich, 3.25, .5, -45, 0); actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); orbit(V(3.25, 3.4, -44), lerp(12, 10.5, L.k), .3, .1, 44); sh(V(3, 0, -44), 18); }, [[0, 'pop', .4]]);
// «Er winkte.»: el gigante saluda (desde el suelo, contrapicado)
shot(62.08, 'W', null, L => { underLid(L); giant(L, { aRx: 2.8, aRz: .5 + Math.sin(L.T * 9) * .38, aRe: .4, lean: .25 }); cara(ichG, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' });
  const h = hp(ichG); cm([-6, 3, 26, h.x, h.y + 4, h.z, 58], [-6, 3, 22, h.x, h.y + 4, h.z, 54], L.k); sh(V(0, 0, 0), 60); }, [[0, 'whoosh', .4]]);
// «Der winzige Thomas winkte auch.»: en la maqueta, el diminuto saluda
shot(62.83, 'C', null, L => { kel(L); tiny(ichT, 4, 44, Math.PI); actuar(ichT, 0, [[0, 'wave']], { T: L.T }); cara(ichT, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' });
  const p = mw(4, 3, 44); orbit(p, lerp(15, 12, L.k) * MINI_S, Math.PI, .2, 44); }, [[0, 'pop', .4]]);
// «Wir machen alle genau dasselbe,»: tres franjas: los tres a la vez
shot(64.70, 'Z', null, L => { kel(L); atTable(ich, L.T, { lean: .05, headX: 0, ...{ aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .38, aRe: .5 } }); cara(ich, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); onFace(ich, 5.4, 0, 0, 44, L.k, 5); GRID = [1, 3, 1]; }, [[0, 'whoosh', .4]]);
// «genau zur selben Zeit.»: los relojes marcan lo mismo (grid de 3×3)
shot(66.43, 'S', null, L => { kel(L); atTable(ich, L.T, { lean: .05, headX: 0, aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .38, aRe: .5 }); cara(ich, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); onFace(ich, 6, 0, .2, 44, L.k, 5.5); GRID = [3, 3, 1]; }, [[0, 'clock_tick', .5]]);
// «Also hatte ich eine Idee.»: bombilla encima de la cabeza
shot(68.04, 'C', 'punch', L => { kel(L); atTable(ich, L.T, { lean: .05, headX: -.1, aRx: 1.9, aRz: -.1, aRe: 2.2 }); cara(ich, L.T, { expr: 'joy', eyes: 'wide', mouth: 'open_smile' }); const h = hp(ich); show(BULB, h.x + .4, h.y + 2.6, h.z, 0, spring(clamp((L.T - 68.3) * 2)) * .6);
  onFace(ich, 6.4, 1.6, -.3, 48, L.k, 5.8); }, [[.25, 'ding', .7]]);
// «Ich ließ eine Brezel in meine winzige Stadt fallen.»: suelto el brezel sobre la maqueta
shot(69.63, 'W', null, L => { kel(L); atTable(ich, L.T, { lean: .35, headX: .45, aRx: 1.6, aRz: -.1, aRe: .3 }); cara(ich, L.T, { expr: 'smug', mouth: 'smirk' }); const t0 = 70.6, k = clamp((L.T - t0) / .7);
  const hpos = wpos(ich.aR.hand); if (L.T < t0) show(BRZ, hpos.x, hpos.y - .4, hpos.z + .2, 0, .45); else show(BRZ, lerp(hpos.x, KX + 6 * MINI_S, k), lerp(hpos.y - .4, MC.y + 2 * MINI_S, k * k), lerp(hpos.z + .2, 10 * MINI_S, k), k * 3, .45 * (1 - k * .5));
  orb(L.k, V(KX, 3.2, -2), null, [12, .7, .3, 46], [10.5, .6, .28, 46]); }, [[.95, 'whoosh', .5]]);
// «Eine Sekunde später:»: en la calle, todos miran arriba: una sombra crece
shot(72.21, 'Z', 'slow', L => { use('CI'); day(); plazaLife(L.T, 6, 72); [EX[15], EX[16], EX[17]].forEach((c, i) => { put(c, 7 + i * 5, .5, 22 - (i % 2) * 2, Math.PI + (i - 1) * .3); actuar(c, 0, [[0, { headX: -.6, lean: -.1, aRx: i === 1 ? 2.0 : .2, aRe: .2 }]], { T: L.T }); cara(c, L.T + i, { expr: 'worried', eyes: 'wide', mouth: 'o' }); });
  const k = easeIn(L.k); show(BRZ, 12, 48 - k * 26, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; cm([12, 3.5, 4, 12, 18, 40, 60], [12, 3.5, 7, 12, 18, 40, 58], L.k); sh(V(12, 0, 30), 40); }, [[0, 'whistle_fall', .6]]);
// «BUMM!»
shot(73.07, 'C', 'punch', L => { use('CI'); day(); show(BRZ, 12, 1.5, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; dust(V(12, 0, 36), 73.07, L.T, 16, 2.5); SHAKE = 1 - L.k;
  cm([24, 14, 20, 12, 4, 38, 54], [23, 13, 21, 12, 4, 38, 52], L.k); sh(V(12, 0, 36), 40); }, [[0, 'boom', 1], [.1, 'crash', .5]]);
// «Eine Brezel, so groß wie ein Haus,»: el brezel junto a las casas, la gente alucina
shot(73.99, 'W', null, L => { use('CI'); day(); show(BRZ, 12, 1.5, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; [EX[15], EX[16], EX[17], EX[18]].forEach((c, i) => { put(c, -2 + i * 5, .3, 16 - (i % 2) * 2, Math.PI * .85); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: i % 2 ? 'open_smile' : 'o' }); });
  cm([-20, 30, -10, 12, 6, 40, 50], [-14, 26, -6, 12, 6, 40, 48], L.k); sh(V(6, 0, 30), 40); }, [[0, 'crowd_gasp', .5]]);
// «landete in meiner Straße.»: yo salgo corriendo de casa hacia el brezel
shot(75.83, 'S', null, L => { use('CI'); day(); show(BRZ, 12, 1.5, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; const c = put(ich, lerp(4, 9, L.k), .5, lerp(10, 24, L.k), .35); actuar(c, 0, [[0, runPoseK(L.T)]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  const p = wpos(c.root); orbit(V(p.x, 3.4, p.z), 12, .35 + 1.2, .15, 46); sh(V(p.x, 0, p.z), 20); }, [[0, 'steps', .6]]);
// «Unendlich Brezeln!»: abrazado al brezel gigante, mordiéndolo
shot(77.48, 'C', 'punch', L => { use('CI'); day(); show(BRZ, 12, 1.5, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; const c = put(ich, 10, .5, 26, Math.PI); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.2, aRz: -.2, aLe: 1.2, aRe: 1.2, lean: -.05 }]], { T: L.T }); laughF(c, L.T); const hm = wpos(c.aR.hand); show(BRZ2, hm.x - .6, hm.y + .3, hm.z - .4, 0, .55);
  badge('gold', '∞', W / 2, H * .2, clamp((L.T - 77.6) * 3), 1, 1.2); orbit(V(10, 3.6, 26), lerp(11, 9.5, L.k), Math.PI + .25, .12, 46); sh(V(9, 0, 30), 20); }, [[0, 'ding', .7], [.2, 'crunch', .5]]);
// «Dann probierte ich einen Goldbarren.»: sostengo un lingote sobre la maqueta
shot(78.94, 'W', null, L => { kel(L); atTable(ich, L.T, { lean: .3, headX: .4, aRx: 1.6, aRz: -.1, aRe: .3 }); cara(ich, L.T, { expr: 'smug', mouth: 'grin' }); const hpos = wpos(ich.aR.hand); show(GB, hpos.x, hpos.y - .45, hpos.z + .2, 0, .5);
  orb(L.k, V(KX, 3.6, -4.5), null, [11, .55, .4, 46], [9.5, .45, .38, 46]); }, [[0, 'sparkle', .5], [.4, 'coins', .4]]);
// «BUMM!»: el lingote gigante cae en la calle
shot(80.45, 'C', 'punch', L => { use('CI'); day(); show(GB, -38, 0, 12, 1.6, 6); show(CAR_P, -38, 0, 12, 0, 1); CAR_P.scale.set(1, .25, 1); dust(V(-38, 0, 12), 80.45, L.T, 16, 2.4); SHAKE = 1 - L.k;
  cm([-20, 10, 6, -38, 3, 12, 52], [-21, 9, 7, -38, 3, 12, 50], L.k); sh(V(-38, 0, 12), 30); }, [[0, 'boom', 1], [.05, 'metal_crash', .6]]);
// «Er zerquetschte das Auto von Frau Pohl.»: Frau Pohl ante su coche aplastado
shot(80.96, 'W', null, L => { use('CI'); day(); show(GB, -38, 0, 12, 1.6, 6); show(CAR_P, -38, 0, 12, 0, 1); CAR_P.scale.set(1, .25, 1); const c = put(pohl, -26, .5, 18, 1.1); actuar(c, 0, [[0, { ...GEST.shock, aLx: 2.4, aRx: 2.4, aLe: 1.8, aRe: 1.8 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'shout' });
  bubble(pohl, 'MEIN AUTO!', clamp((L.T - 81.4) * 4), 2.3); cm([-14, 6, 26, -32, 3, 14, 50], [-15, 5.6, 25, -32, 3, 14, 48], L.k); sh(V(-32, 0, 16), 24); }, [[0, 'gasp', .5], [.6, 'car_alarm', .5]]);
// «Schon wieder: Tschuldigung!»: yo, encogido, sonrisa culpable
shot(83.44, 'C', null, L => { kel(L); atTable(ich, L.T, { aRx: 2.5, aRz: .1, aRe: 2.0, aLx: 2.5, aLz: .1, aLe: 2.0, headX: .1, lean: .05, crouch: .15 }); cara(ich, L.T, { expr: 'worried', eyes: 'happy', mouth: 'grimace' }); sweat(ich, L.T);
  onFace(ich, 4.6, 0, .5, 42, L.k, 4.1); }, [[0, 'pop', .4]]);
// «Ich war der reichste Thomas der Welt.»: sentado en un montón de oro, con gafas de sol
shot(84.99, 'Z', 'punch', L => { use('CI'); day(); show(GPILE, 3.25, 0, -34, 0, 1.6); const c = put(ich, 3.25, 3.6, -34, 0); actuar(c, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 1.4, lRk: 1.4, aLx: 2.4, aRx: 2.4, aLz: .4, aRz: .4, hipY: Math.sin(L.T * 5) * .1 }]], { T: L.T }); laughF(c, L.T);
  confRain(V(3.25, 0, -34), L.T, 50, 16, 12, 16); orbit(V(3.25, 5, -34), lerp(14, 12, L.k), -.2, .12, 46); sh(V(3.25, 0, -34), 20); }, [[0, 'coins', .7], [.3, 'cheer', .4]]);
// «Na ja, genauso reich wie jeder andere Thomas.»: mosaico: todos igual de ricos
shot(86.97, 'S', null, L => { use('CI'); day(); show(GPILE, 3.25, 0, -34, 0, 1.6); const c = put(ich, 3.25, 3.6, -34, 0); actuar(c, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 1.4, lRk: 1.4, aLx: .3, aRx: .3, headY: Math.sin(L.T) * .2 }]], { T: L.T }); talk(c, L.T, 86.97, 89.5, 'sus', { eyes: 'half' });
  orbit(V(3.25, 5, -34), 12, -.2, .12, 46); sh(V(3.25, 0, -34), 20); GRID = L.k < .3 ? null : [3, 4, 1]; }, [[.3, 'whoosh', .4]]);
