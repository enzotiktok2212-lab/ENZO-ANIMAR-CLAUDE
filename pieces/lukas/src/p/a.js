// ---------- a: gancho, el patio, la Mensa, «Fehler», mi hermana (0 – 30,87 s) ----------
const HOUSE = V(14.5, 0, 91.3);          // delante de la puerta de la casa familiar (mira a +x)
const YARD = V(-22, 0, -38);             // patio del colegio (cartel en (-24, -54))
const SIGNP = V(12, 6.1, 240);           // cartel de bienvenida
const MA = V(KX - 12.6, 0, -4);          // delante del Automat de la Mensa (mirando -x)
const BOYZ = BOYS(CROWD), GIRLX = GIRLZ(CROWD);
const welcomeKids = (L, tagA, tagB) => [[KIDS[10], -4.2], [KIDS[1], 4.2]].forEach(([p, dx], i) => { const r = .25, x = SIGNP.x + Math.cos(r) * dx + Math.sin(r) * 3, z = SIGNP.z - Math.sin(r) * dx + Math.cos(r) * 3; put(p, x, 0, z, r); if (tagA) p.setTag(i ? tagB : tagA); actuar(p, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .35, aRe: .5 }]], { T: L.T }); cara(p, L.T + i, { expr: 'happy', mouth: 'open_smile' }); });
const yardKids = (L, n = 16, o = {}) => crowdAt(L, YARD.x, YARD.z, n, 4, 15, o.seed || 7, { list: [...KIDS, ...EX.slice(0, 10)], full: true, ...o });

// 1 «In dieser Stadt heißt jeder» (zoom lento): cartel LUKASHAUSEN – Einwohner: 5000 Lukas + Mias; un niño y una niña saludan
shot(0, 'C', 'slow', L => { town(L); welcomeKids(L);
  orb(L.k, SIGNP, null, [29, .25, .04, 42], [24.5, .25, .03, 42]); sh(SIGNP, 26); }, [[0, 'birds', .5], [.4, 'ding_soft', .4]]);
// 2 «Junge Lukas»: la plaza: un grupo de chicos saluda con su placa LUKAS
shot(1.61, 'W', 'punch', L => { town(L); const c = V(-6, 0, 12); const b = BOYZ[3]; put(b, c.x, 0, c.z, 0); actuar(b, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5, aLx: 2.7, aLz: .4 + Math.cos(L.T * 9) * .35, aLe: .5 }]], { T: L.T }); grin(b, L.T);
  crowdAt(L, c.x, c.z - 4, 12, 5, 12, 3, { mode: 'wave', list: BOYZ.filter(x => x !== b), gap: 1.0 });
  orb(L.k, V(c.x, 3.4, c.z), null, [15, .1, .2, 44], [12.5, .05, .14, 44]); sh(c, 22); }, [[0, 'cheer', .45], [.2, 'crowd_run', .3]]);
// 3 «und jedes Mädchen Mia…»: delante de la fuente, las chicas saludan con su placa MIA
shot(2.57, 'S', null, L => { town(L); const c = V(-18, 0, -14); const g = GIRLX[0]; put(g, c.x, 0, c.z, .3); actuar(g, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5, aLx: .8, aLz: -.5, aLe: 1.8 }]], { T: L.T }); grin(g, L.T);
  crowdAt(L, c.x, c.z - 3, GIRLX.length - 1, 4.5, 10, 4, { mode: 'wave', list: GIRLX.slice(1), gap: 1.1 });
  orb(L.k, V(c.x, 3.2, c.z), null, [13, .45, .16, 44], [11, .3, .12, 44]); sh(c, 20); }, [[0, 'kids_laugh', .4], [.3, 'pop', .4]]);
// 4 «nur ich nicht.» (zoom lento): yo en medio de todos, con mi placa LEON escrita a mano, aburrido
shot(3.82, 'Z', 'slow', L => { town(L); const c = V(-8, 0, 20); put(me, c.x, 0, c.z, .05); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half', mouth: 'flat' });
  crowdAt(L, c.x, c.z - 2, 16, 3.5, 11, 5, { mode: 'wave', gap: .9 });
  orb(L.k, V(c.x, 3.0, c.z), null, [13, .05, .12, 42], [8.5, .02, .08, 40], easeIn); sh(c, 18); }, [[0, 'sigh_kid', .45]]);
// 5 «In der Pause»: grúa sobre el patio del colegio: niños jugando, el cartel LUKAS-UND-MIA-GRUNDSCHULE
shot(4.81, 'I', null, L => { town(L); yardKids(L, 18, { mode: 'cheer', seed: 51 });
  cm([YARD.x + 6, 24, YARD.z + 34], [YARD.x + 4, 18, YARD.z + 28], L.k); camera.lookAt(YARD.x - 1, 3, YARD.z - 8); camera.fov = 48; sh(YARD, 30); }, [[0, 'school_bell', .45], [.2, 'kids_laugh', .45]]);
// 6 «wenn einer „Lukas!"»: un niño con las manos en la boca grita LUKAS!
shot(5.83, 'C', null, L => { town(L); const p = V(YARD.x + 6, 0, YARD.z + 8); const k = KIDS[2]; put(k, p.x, 0, p.z, -.4); actuar(k, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.12, headX: -.2 }]], { T: L.T }); cara(k, L.T, { expr: 'shout', mouth: 'talk_wide' });
  bubble(k, 'LUKAS!', clamp((L.lt - .25) / .1), 1.6); crowdAt(L, p.x, p.z - 3, 5, 6, 12, 61, { mode: 'idle', list: KIDS.slice(5) });
  onBody(k, 8.4, .15, .08, 42, L.k, 7.4); sh(p, 14); }, [[0, 'kids_laugh', .3], [.3, 'shout_m', .5]]);
// 7 «ruft, und dreihundert Köpfe»: grúa: todos los chicos del patio se giran a la vez; «300»
shot(7.11, 'F', null, L => { town(L); crowdAt(L, YARD.x, YARD.z, 22, 3, 15, 71, { mode: 'turn', turnAt: L.t0 + .35, full: true, list: [...BOYZ, ...GIRLX], jit: .2, expr: 'happy' });
  cm([YARD.x + 4, 22, YARD.z + 28], [YARD.x + 2, 17, YARD.z + 24], L.k); camera.lookAt(YARD.x, 2, YARD.z); camera.fov = 48; badge('gold', '300', W / 2, H * .15, clamp((L.lt - .45) / .15), 1, .95); sh(YARD, 26); }, [[0, 'whoosh_soft', .4], [.35, 'crowd_run', .45]]);
// 8 «drehen sich gleichzeitig um.»: plano bajo: la fila de chicos se gira de golpe hacia cámara
shot(8.59, 'W', null, L => { town(L); const p = V(YARD.x, 0, YARD.z - 2); crowdGrid(L, p.x, p.z, 6, 2, 3.2, 3.4, { mode: 'turn', turnAt: L.t0 + .15, list: BOYZ, face: V(p.x, 3, p.z + 30), seed: 8, expr: 'happy' });
  cm([p.x - 2, 3.2, p.z + 11], [p.x + 2, 3.0, p.z + 10], L.k); camera.lookAt(p.x, 3.4, p.z + 1); camera.fov = 50; sh(p, 18); }, [[0, 'whoosh_soft', .45], [.2, 'cloth', .4]]);
// 9 «Und wenn jemand „Mia!"»: una niña grita MIA!
shot(10.44, 'S', null, L => { town(L); const p = V(YARD.x - 7, 0, YARD.z + 6); const g = GIRLX[2]; put(g, p.x, 0, p.z, .4); actuar(g, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.1, headX: -.2 }]], { T: L.T }); cara(g, L.T, { expr: 'shout', mouth: 'talk_wide' });
  bubble(g, 'MIA!', clamp((L.lt - .7) / .1), 1.6); onBody(g, 8.2, -.15, .08, 42, L.k, 7.2); sh(p, 14); }, [[0, 'kids_laugh', .3], [.75, 'shout_m', .45]]);
// 10 «ruft, dreht sich die andere Hälfte»: ahora se giran todas las chicas (los chicos ni se mueven)
shot(11.76, 'C', null, L => { town(L); const p = V(YARD.x, 0, YARD.z); crowdGrid(L, p.x, p.z, 6, 2, 3.2, 3.4, { mode: 'turn', turnAt: L.t0 + .6, list: GIRLX, face: V(p.x, 3, p.z + 30), seed: 10, expr: 'happy' });
  crowdGrid(L, p.x, p.z + 7, 5, 1, 3.6, 3.4, { mode: 'idle', list: BOYZ.slice(6), face: V(p.x - 30, 3, p.z + 8), seed: 11 });
  cm([p.x + 3, 6, p.z + 18], [p.x + 1, 5.5, p.z + 16], L.k); camera.lookAt(p.x, 3, p.z + 2); camera.fov = 50; sh(p, 18); }, [[0, 'whoosh_soft', .4], [.6, 'crowd_run', .35]]);
// 11 «vom Schulhof um.»: vista cenital: chicos a un lado, chicas al otro, todos mirando a cámara
shot(13.10, 'R', null, L => { town(L); crowdGrid(L, YARD.x - 7, YARD.z, 4, 3, 3.4, 3.4, { mode: 'wave', list: BOYZ, seed: 12 }); crowdGrid(L, YARD.x + 7, YARD.z, 3, 3, 3.4, 3.4, { mode: 'wave', list: GIRLX, seed: 13 });
  cm([YARD.x, 30, YARD.z + 16], [YARD.x, 26, YARD.z + 14], L.k); camera.lookAt(YARD.x, 0, YARD.z + 2); camera.fov = 46; sh(YARD, 24); }, [[0, 'whirl', .3], [.3, 'kids_laugh', .4]]);
// 12 «Ich heiße Leon.»: yo, señalando mi placa escrita a mano: LEON
shot(14.40, 'C', 'punch', L => { town(L); const p = V(YARD.x + 3, 0, YARD.z + 10); put(me, p.x, 0, p.z, .2); actuar(me, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .3, headZ: .12 }]], { T: L.T }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' });
  crowdAt(L, p.x, p.z - 5, 6, 6, 12, 120, { mode: 'idle', list: KIDS.slice(3) });
  onBody(me, 7.6, .05, .06, 40, L.k, 6.8); sh(p, 14); }, [[0, 'thump', .4], [.2, 'tape', .4]]);
// 13 «Mama sagt, ich sah bei meiner Geburt»: Mama con mi foto de bebé en la puerta de casa; yo de brazos cruzados
const photoFront = (c, fwd = 1.2, y = 2.0, side = 0) => { const a = c.root.rotation.y, p = c.root.position; show(PHOTO, p.x + Math.sin(a) * fwd + Math.cos(a) * side, y, p.z + Math.cos(a) * fwd - Math.sin(a) * side, a, .85); };
shot(15.38, 'W', null, L => { town(L); put(mama, HOUSE.x + 1, 0, HOUSE.z - 1, PI / 2 + .25); actuar(mama, 0, [[0, { aLx: .8, aLz: -.5, aLe: .7, aRx: .8, aRz: -.5, aRe: .7, headZ: .15 + Math.sin(L.T * 3) * .05 }]], { T: L.T }); talk(mama, L.T, 15.3, 16.8);
  photoFront(mama); put(me, HOUSE.x + 3.4, 0, HOUSE.z - 4.2, PI / 2 - .7); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half' });
  onBody(mama, 11, -.45, .08, 42, L.k, 10, -.35); sh(HOUSE, 16); }, [[0, 'door_creak', .35], [.4, 'hmm', .3]]);
// 14 «einfach nicht aus wie ein Lukas.»: la foto de bebé; Mama inclina la cabeza: «kein Lukas?»
shot(16.80, 'Z', null, L => { town(L); put(mama, HOUSE.x + 1, 0, HOUSE.z - 1, PI / 2 + .25); actuar(mama, 0, [[0, { aLx: .8, aLz: -.5, aLe: .7, aRx: .8, aRz: -.5, aRe: .7, headZ: .3 }]], { T: L.T }); cara(mama, L.T, { expr: 'confused', mouth: 'wavy' });
  photoFront(mama); const a = mama.root.rotation.y, h = hp(mama);
  cm([h.x + Math.sin(a) * 7.5, h.y - .6, h.z + Math.cos(a) * 7.5], [h.x + Math.sin(a) * 6.4, h.y - .6, h.z + Math.cos(a) * 6.4], L.k); camera.lookAt(h.x, h.y - .9, h.z); camera.fov = 40;
  badge('red', 'kein Lukas?', W / 2, H * .16, clamp((L.lt - .5) / .15), 1, .8); sh(HOUSE, 14); }, [[0, 'pop', .4], [.5, 'sad_tone', .3]]);
// 15 «Sogar der Automat in der Mensa»: la Mensa: niños comiendo en las mesas; al fondo el Automat rojo
shot(18.63, 'F', null, L => { mensa(L); classKids(L, { skip: -1, expr: 'happy', face: V(KX, 0, -20) });
  cm([KX + 10, 11, 18], [KX + 7, 10, 15], L.k); camera.lookAt(KX - 12, 4.5, -4); camera.fov = 50; sh(V(KX - 4, 0, 2), 24); }, [[0, 'cafeteria', .45], [.3, 'cutlery', .4]]);
// 16 «hat nur zwei Knöpfe:»: el Automat de cerca: solo dos botones; «2»
shot(20.13, 'S', null, L => { mensa(L); const c = put(me, MA.x + .8, 0, MA.z + 4.4, -PI / 2 - .5); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.2, aRe: .3, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'wavy' });
  cm([KX - 7, 6.6, -1.5], [KX - 8, 6.4, -2.6], L.k); camera.lookAt(KX - 16, 5.6, -4); camera.fov = 44; badge('gold', '2', W * .74, H * .2, clamp((L.lt - .35) / .12), 1, 1); sh(V(KX - 15, 0, -4), 14); }, [[0, 'machine_hum', .4], [.35, 'pop', .45]]);
// 17 «Lukas und Mia.»: primer plano de los botones: se ilumina LUKAS… y luego MIA
shot(21.15, 'C', 'punch', L => { mensa(L); AUTO.userData.press(clamp((L.T - 21.15) / .1) * (L.T < 21.7 ? 1 : 0), clamp((L.T - 21.81) / .1));
  cm([KX - 12.4, 6.0, -1.4], [KX - 13.0, 5.8, -1.7], L.k); camera.lookAt(KX - 16, 5.8, -2.6); camera.fov = 40; sh(V(KX - 15, 0, -4), 10); }, [[0, 'button', .55], [.66, 'button', .55]]);
// 18 «Deshalb sagen alle nicht Leon zu mir,»: en el patio, los niños me señalan y se ríen
shot(22.42, 'W', null, L => { town(L); const p = V(YARD.x, 0, YARD.z - 4); put(me, p.x, 0, p.z + 4, 0); actuar(me, 0, [[0, { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.6, aRe: 1.6, headX: .2 }]], { T: L.T }); cara(me, L.T, { expr: 'sad' });
  crowdAt(L, p.x, p.z + 4, 8, 4.5, 8, 18, { mode: 'point', list: KIDS, gap: 1.0, face: V(p.x, 3, p.z + 4) });
  orb(L.k, V(p.x, 2.8, p.z + 4), null, [12, -.25, .14, 42], [10.5, -.1, .12, 42]); sh(p, 18); }, [[0, 'kids_laugh', .45], [.5, 'murmur', .35]]);
// 19 «sondern „Fehler".»: un niño me señala gritando FEHLER!
shot(24.34, 'C', null, L => { town(L); const p = V(YARD.x, 0, YARD.z - 8); [KIDS[5], KIDS[2], KIDS[7]].forEach((k, i) => crowdGuy(k, p.x + (i - 1) * 3.4, p.z - Math.abs(i - 1) * 1.2, L, i, { mode: i === 1 ? 'point' : 'laugh', face: V(p.x, 0, p.z + 12) }));
  bubble(KIDS[2], 'FEHLER!', clamp((L.lt - .2) / .1), 1.6); orb(L.k, V(p.x, 2.4, p.z), null, [10.5, .05, .06, 44], [9, 0, .04, 44]); sh(p, 14); }, [[0, 'kids_laugh', .55], [.25, 'laugh_m', .3]]);
// 20 «Der Fehler»: los niños levantan la pancarta FEHLER detrás de mí; yo hundido
shot(25.00, 'S', null, L => { town(L); const p = V(YARD.x + 12, 0, YARD.z - 8); show(FSIGN, p.x, 1.6, p.z - 3, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), 0, p.z - 3.6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLz: i ? .1 : -.1, aRz: i ? -.1 : .1, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, GEST.slump]], { T: L.T }); cara(me, L.T, { expr: 'sad', eyes: 'down' });
  orb(L.k, V(p.x, 4.8, p.z - 1.5), null, [16, -.1, .06, 44], [14, 0, .05, 44]); sh(p, 16); }, [[0, 'paper', .5], [.3, 'kids_laugh', .35]]);
// 21 «der Stadt.»: primer plano: lágrima, la pancarta detrás
shot(25.81, 'Z', 'punch', L => { town(L); const p = V(YARD.x + 12, 0, YARD.z - 8); show(FSIGN, p.x, 1.6, p.z - 3, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), 0, p.z - 3.6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { headX: .1, aLx: .1, aRx: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'cry', eyes: 'cry', mouth: 'frown' }); tears(me, L.T);
  cm([p.x + .4, 4.4, p.z + 7.6], [p.x + .3, 4.4, p.z + 6.6], L.k); camera.lookAt(p.x, 4.6, p.z - 2); camera.fov = 42; sh(p, 12); }, [[0, 'sad_tone', .5]]);
// 22 «Die Einzige, die Leon zu mir sagt,»: mi hermana pequeña corre hacia mí gritando «Leon!»
shot(26.62, 'W', null, L => { town(L); const b = put(bru, 22, Math.abs(Math.sin(L.T * 14)) * .2, 74 + L.lt * 4.2, 0); actuar(b, 0, [[0, { ...walkP(L.T, 0, 14), aRx: 2.6, aRz: .4, aRe: .3 }]], { T: L.T }); laughF(b, L.T);
  bubble(b, 'Leon!', clamp((L.lt - .6) / .1), 1.6); const bp = b.root.position; orbit(V(bp.x, 2.2, bp.z), 9.5, .25, .06, 42); sh(bp, 14); }, [[0, 'steps_run', .5], [.6, 'kids_laugh', .3]]);
// 23 «ist meine kleine Schwester.»: nos chocamos la mano
shot(28.28, 'F', null, L => { town(L); const p = V(22, 0, 84); put(me, p.x - 1.5, 0, p.z, PI / 2 - .55); put(bru, p.x + 1.5, 0, p.z, -PI / 2 + .55); const hf = L.lt > .3;
  actuar(me, 0, [[0, { aRx: hf ? 2.5 : 2.1, aRz: hf ? -.5 : -.2, aRe: .2 }]], { T: L.T }); actuar(bru, 0, [[0, { aLx: hf ? 2.7 : 2.3, aLz: hf ? -.4 : -.2, aLe: .2 }]], { T: L.T }); grin(me, L.T); laughF(bru, L.T);
  if (hf) confetti(V(p.x, -2, p.z), L.t0 + .3, L.T, 24, .5); orb(L.k, V(p.x, 2.6, p.z), null, [9.5, .05, .08, 42], [8.5, 0, .06, 42]); sh(p, 14); }, [[.3, 'slap', .55], [.35, 'kids_laugh', .3]]);
// 24 «Sie heißt natürlich Mia.»: mi hermana señala su placa MIA; yo detrás, cara de póquer
shot(29.53, 'C', 'punch', L => { town(L); const p = V(22, 0, 84); put(bru, p.x + .8, 0, p.z + 1.5, -.15); actuar(bru, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .3, headZ: -.1 }]], { T: L.T }); grin(bru, L.T);
  put(me, p.x - 1.6, 0, p.z - 1.6, .3); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half', mouth: 'flat' });
  orb(L.k, V(p.x - .2, 2.7, p.z), null, [10, .05, .08, 40], [8.8, .02, .06, 40]); sh(p, 12); }, [[0, 'pop', .45], [.5, 'sigh_kid', .3]]);
