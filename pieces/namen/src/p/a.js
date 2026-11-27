// ---------- a: gancho, la regla, Genau, Krass, Digga, Boah, yo (0 – 23,98 s) ----------
// helpers de esta pieza
function walk(ch, L, x, z, ry, sp = 2.4, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .1, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.expr !== false) cara(ch, L.T + i, { expr: o.expr || 'neutral', mouth: o.mouth }); return ch; }
function run(ch, L, x, z, ry, sp = 9, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 13 + i)) * .35, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...runP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); cara(ch, L.T + i, { expr: o.expr || 'shock', mouth: o.mouth || 'o' }); return ch; }
function pose(ch, x, y, z, ry, L, p = {}, expr = 'neutral', ex = {}) { put(ch, x, y, z, ry); actuar(ch, 0, [[0, typeof p === 'string' ? p : { headY: Math.sin(L.T * .9 + ch.seed) * .12, ...p }]], { T: L.T }); cara(ch, L.T, { expr, ...ex }); return ch; }
const WAVE = (T, i = 0) => ({ aRx: 2.7, aRz: .35 + Math.sin(T * 12 + i) * .35, aRe: .5, aLx: .2, headY: 0 });
const SHOUT = { aRx: 1.2, aRz: .5, aRe: 1.9, aLx: 1.2, aLz: .5, aLe: 1.9, lean: -.08, headX: -.18 };
const money = (t, k, kind = 'gold', y = .12) => badge(kind, t, W / 2, H * y, k);
// saludo: a dice el nombre de b (bocadillo desde la boca) y a b le salta una ráfaga de monedas con «+1 €»
function greet(a, b, L, name, t0, slot = 0, o = {}) { const k = (L.lt - t0) * 3; if (L.lt > t0) bubble(a, name, k, o.dy ?? 1.6); if (L.lt > t0 + .18) { const h = hp(b); coinBurst(h.clone().add(V(0, 1.4, 0)), L.t0 + t0 + .18, L.T, o.n ?? 6, slot, { y0: b.root.position.y, vy: 9, spread: 2.6 }); plus(h.clone().add(V(0, 2.6, 0)), L.t0 + t0 + .2, L.T, o.plus ?? '+1 €'); } }

// 1 «In dieser Stadt bekommst du»: GANCHO. Plaza de Rufingen (la Namensbank al fondo): la gente camina, de pronto se para, se saluda y
// de cada boca sale un bocadillo con un nombre; al nombrado le saltan monedas de euro. Golpe de zoom + zoom lento.
shot(0, 'C', 'hook', L => { stadt(L); const stop = L.lt > .32;
  const A = [EXS[0], EXS[1]], B = [EXS[2], EXS[3]], C2 = [EXS[4], EXS[5]];
  for (const [p, x, z, ry, nm, sl] of [[A, -1.5, 42, -PI / 2 + .55, 'HALLO, LENA!', 0], [B, -9.5, 36, PI / 2, 'MOIN, TOM!', 8], [C2, 9.5, 34, -PI / 2, 'SERVUS, ANNA!', 16]]) {
    const [a, b] = p; if (!stop) { walk(a, L, x - Math.sin(ry) * 1.5, z, ry, 2.2, 1); walk(b, L, x - Math.sin(ry) * 6, z + .5, ry + PI, 2.2, 2); }
    else { pose(a, x + Math.sin(ry) * .2, 0, z, ry, L, WAVE(L.T, sl), 'happy', { mouth: 'open_smile' }); pose(b, x - Math.sin(ry) * 3.0, 0, z + .5, ry + PI, L, { aRx: 2.2, aRz: .4, aRe: .6 }, 'joy', { mouth: 'open_smile' }); greet(a, b, L, nm, .36 + sl * .03, sl, { n: 5 }); } }
  crowdBox(L, -26, 26, -6, 8, 10, 3, { mode: 'walk' }); crowdBox(L, -26, -16, 26, 34, 3, 4, { mode: 'talk' }); crowdBox(L, 16, 26, 26, 34, 3, 5, { mode: 'talk' });
  cm([0, 6.4, 62, 0, 4.6, 38, 46], [0, 6, 57, 0, 4.6, 38, 44], L.k); SHC = V(0, 0, 40); },
  [[.36, 'coin_jingle', .8], [.42, 'cash', .6], [.5, 'crowd_happy', .5], [.0, 'footsteps', .5]]);
// 2 «jedes Mal einen Euro»: delante de la heladería: un chico grita «LENA!» y a Lena le salta otra ráfaga; contador 1 €
shot(1.41, 'Z', 'punch', L => { stadt(L); const lena = EXS[1], paul = EXS[6];
  pose(lena, -38, 0, 64, .5, L, L.lt > .25 ? { aLx: 1.9, aLz: 1.1, aRx: 1.9, aRz: 1.1, aLe: .3, aRe: .3 } : { aRx: .3 }, L.lt > .25 ? 'joy' : 'happy', { mouth: 'open_smile' });
  pose(paul, -34.4, 0, 64.6, -PI / 2 - .3, L, WAVE(L.T, 2), 'happy', { mouth: 'open_smile' }); greet(paul, lena, L, 'LENA!', .12, 20, { n: 8 });
  crowdBox(L, -42, -38, 54, 60, 2, 5, { mode: 'look' }); orb(L.k, V(-36.2, 3.4, 64.3), null, [18, .2, .16, 46], [15.5, .35, .12, 46]);
  money('1 €', (L.lt - .3) * 3); }, [[.15, 'coin_jingle', .8], [.3, 'ding_reveal', .6]]);
// 3 «wenn jemand deinen Namen sagt»: la Namensbank: el marcador gigante con los nombres que más ganan; la cámara sube hacia él
shot(3.01, 'W', null, L => { stadt(L); crowdBox(L, -22, 22, -38, -26, 12, 6, { mode: i => ['look', 'point', 'talk'][i % 3], face: V(0, 18, -48) });
  cm([0, 6, 8, 0, 14, -48, 52], [0, 13, -4, 0, 18, -48, 50], L.k); }, [[.1, 'crowd_murmur', .5], [.6, 'click_set', .5]]);
// 4 «Der Haken:»: Tom, solo, se grita su propio nombre: «TOM! TOM!» … 0 €
shot(4.5, 'F', 'punch', L => { stadt(L); const tom = EXS[3]; pose(tom, 20, 0, 92, -PI / 2 - .3, L, SHOUT, 'shout', { mouth: 'o' }); if (L.lt > .1) bubble(tom, 'TOM! TOM!', (L.lt - .1) * 3, 1.6);
  if (L.lt > .55) { money('0 €', (L.lt - .55) * 3, 'red'); }
  crowdBox(L, 6, 14, 84, 100, 3, 7, { mode: 'look', expr: 'confused' }); orb(L.k, V(20, 3.0, 92), null, [16, -PI / 2 - .3 + .25, .12, 44], [14, -PI / 2 - .3 + .05, .1, 44]); }, [[.1, 'shout_echo', .5], [.6, 'buzzer_wrong', .6]]);
// 5 «Jemand anderes muss ihn sagen»: su amiga llega por detrás: «Hey, TOM!» → monedas, Tom salta
shot(5.9, 'S', null, L => { stadt(L); const tom = EXS[3], fr = EXS[7]; pose(fr, 15.4, 0, 93, PI / 2 - .2, L, WAVE(L.T, 4), 'happy', { mouth: 'open_smile' });
  const j = L.lt > .3 ? Math.max(0, Math.sin((L.lt - .3) * 8)) * .8 : 0; pose(tom, 20, j, 92, -PI / 2 - .1, L, L.lt > .3 ? { aLx: 2.8, aLz: .5, aRx: 2.8, aRz: .5 } : {}, L.lt > .3 ? 'joy' : 'confused', { mouth: L.lt > .3 ? 'open_smile' : undefined });
  greet(fr, tom, L, 'HEY, TOM!', .08, 4, { n: 8 }); orb(L.k, V(17.6, 3.4, 92.5), null, [21, .15, .1, 46], [19, -.08, .08, 46]); money('+1 €', (L.lt - .3) * 3, 'green'); }, [[.3, 'coin_jingle', .8], [.35, 'cash', .5]]);
// 6 «Unser Bürgermeister heißt»: Genau en la escalinata de la Namensbank saluda a la multitud que le aplaude
shot(6.82, 'R', null, L => { stadt(L); pose(genau, 0, 4, -46.5, 0, L, WAVE(L.T, 1), 'happy', { mouth: 'open_smile' });
  crowdBox(L, -20, 20, -42, -36, 12, 8, { mode: i => i % 3 ? 'cheer' : 'clap', face: V(0, 5, -46) }); badge('tag', 'BÜRGERMEISTER', W / 2, H * .12, (L.lt - .15) * 3);
  cm([-5, 9.5, -31, 0, 6.8, -46.5, 46], [4, 9.2, -33, 0, 6.8, -46.5, 44], L.k); SHC = V(0, 4, -40); }, [[0, 'crowd_cheer', .6], [.2, 'applause', .5]]);
// 7 «Genau.»: primer plano de Genau, orgulloso, con la Amtskette; su nombre en grande
shot(7.84, 'C', 'punch', L => { stadt(L); pose(genau, 0, 4, -46.5, .15, L, { aRx: .5, aRz: -.3, aRe: 1.6, aLx: .5, aLz: -.3, aLe: 1.6, lean: -.05 }, 'smug', { mouth: 'grin' });
  onFace(genau, 5.2, -.2, .6, 40, L.k, 4.6); badge('big', 'GENAU', W / 2, H * .13, (L.lt - .05) * 3.5); }, [[0, 'whoosh_up', .5], [.1, 'ding_reveal', .6]]);
// 8 «Genau,»: dos vecinas en la terraza del café asienten: «Genau!» → monedas que salen volando hacia el Rathaus
shot(8.56, 'G', null, L => { stadt(L); const a = EXS[8], b = EXS[9]; pose(a, 35, 0, 55, -PI / 2 + .6, L, { aRx: 1.2, aRe: 1.4, headX: .15 * Math.sin(L.T * 14) }, 'happy', { mouth: 'open_smile' }); pose(b, 32.5, 0, 57.5, PI - .5, L, { aLx: .6 }, 'happy', { mouth: 'smile' });
  if (L.lt > .05) bubble(a, 'GENAU!', (L.lt - .05) * 4, 1.6); coinFly(hp(a).add(V(0, 2, 0)), V(0, 30, -60), L.t0 + .12, L.T, 4, 0, .45); plus(hp(a).add(V(0, 3, 0)), L.t0 + .1, L.T, '+1 € GENAU', 'gold', .8);
  orb(L.k, V(33.8, 3.4, 56.3), null, [18, -.85, .12, 46], [16, -.65, .1, 46]); }, [[.05, 'coin_jingle', .7]]);
// 9 «genau,»: en el puesto del mercado, el panadero y una clienta: «Genau, genau!»
shot(9.08, 'W', null, L => { stadt(L); const a = EXS[10], b = EXS[11]; pose(a, -36, 0, 93, PI / 2, L, { aRx: 1.3, aRz: .2, aRe: 1.2, headX: .2 * Math.sin(L.T * 16) }, 'happy', { mouth: 'open_smile' }); pose(b, -32.4, 0, 94, -PI / 2, L, { aLx: 1.0, aLe: 1.2 }, 'happy', { mouth: 'open_smile' });
  if (L.lt > .02) bubble(b, 'GENAU!', (L.lt - .02) * 4, 1.6); coinFly(hp(b).add(V(0, 2, 0)), V(0, 30, -60), L.t0 + .08, L.T, 4, 4, .4); plus(hp(b).add(V(0, 3, 0)), L.t0 + .08, L.T, '+1 € GENAU', 'gold', .8);
  orb(L.k, V(-34.2, 3.4, 93.5), null, [17, .1, .14, 46], [15.5, -.15, .1, 46]); }, [[.04, 'coin_jingle', .7]]);
// 10 «genau!»: Genau en la plaza con los brazos abiertos: le llueven monedas por todas partes; contador que no para
shot(9.52, 'Z', null, L => { stadt(L); pose(genau, 0, 0, 6, 0, L, { aLx: 2.4, aLz: .9, aRx: 2.4, aRz: .9, headX: -.3 }, 'joy', { mouth: 'open_smile' });
  coinBurst(V(0, 14, 6), L.t0 - .2, L.T, 24, 0, { y0: 0, vy: 2, spread: 5, life: 2 }); crowdAt(L, 0, 6, 8, 9, 13, 4, { mode: 'point', face: V(0, 4, 6) });
  orb(L.k, V(0, 3.6, 6), null, [15, .1, .25, 46], [12, -.1, .18, 46]); money('1.248.112 €', (L.lt - .05) * 3); }, [[0, 'coins_rain', .8], [.3, 'cash', .5]]);
// 11 «Deshalb hat er einen goldenen Whirlpool.»: la villa: Genau sumergido en su jacuzzi de oro, burbujas; zoom lento
shot(10.24, 'P', 'slow', L => { villaS(L); pose(genau, VX, .55, -1, 0, L, { aLx: .2, aLz: 1.35, aRx: .2, aRz: 1.35, aLe: .2, aRe: .2, lean: -.25, lLx: 1.4, lRx: 1.4 }, 'happy', { eyes: 'happy', mouth: 'smile' }); genau.blob.visible = false;
  cm([VX + 10, 13, 32, VX, 3, -1, 46], [VX + 6, 9, 22, VX, 3.6, -1, 44], L.k); badge('gold', 'GOLD', W / 2, H * .13, (L.lt - .5) * 3); }, [[0, 'bubbles', .8], [.2, 'water_jacuzzi', .6]]);
// 12 «Whirlpool.»: Genau lanza monedas al aire que caen sobre el borde dorado y rebotan
shot(11.54, 'F', null, L => { villaS(L); pose(genau, VX, .55, -1, .2, L, { aRx: 2.6 - Math.min(1, L.lt * 3) * .8, aRz: .3, aRe: .3, aLx: .2, aLz: 1.3, lean: -.2, lLx: 1.4, lRx: 1.4 }, 'joy', { mouth: 'laugh' }); genau.blob.visible = false;
  coinBurst(V(VX + 2.6, 5, 1), L.t0 + .05, L.T, 10, 0, { y0: 2.6, vy: 7, spread: 4 }); onFace(genau, 7, .6, 1.4, 42, L.k, 6.2); }, [[.05, 'coin_toss', .8], [.5, 'coins_bounce', .6]]);
// 13 «Dann gibt es ein Mädchen namens Krass.»: Krass pasea por la plaza con su bolso de oro; la gente: «KRASS!» y le saltan monedas
shot(12.36, 'S', null, L => { stadt(L); walk(krass, L, -2, 70, PI, 2.4, 0, { expr: 'smug', mouth: 'smile', pose: { aLx: .5, aLe: 1.3 } });
  const a = EXS[12], b = EXS[13]; pose(a, -7, 0, 66, PI / 2 - .3, L, { aLx: 1.3, aLz: .6, aLe: 1.9, aRx: 1.3, aRz: .6, aRe: 1.9 }, 'shock', { mouth: 'o' }); pose(b, 3, 0, 66, -PI / 2 + .3, L, 'point', 'shock', { mouth: 'o' });
  greet(a, krass, L, 'KRASS!', .2, 0, { n: 5 }); greet(b, krass, L, 'KRASS!', .55, 6, { n: 5 }); crowdBox(L, -24, 24, 80, 90, 5, 9, { mode: 'look', expr: 'shock', face: V(-2, 4, 64) });
  cm([-2, 5, 58, -2, 3.8, 68, 46], [-2, 5, 56.5, -2, 3.8, 66, 46], L.k); }, [[.2, 'coin_jingle', .7], [.55, 'coin_jingle', .7], [0, 'heels', .6]]);
// 14 «Krass.»: primer plano: Krass se baja las gafas de oro y guiña
shot(13.5, 'C', 'punch', L => { stadt(L); const g = clamp(L.lt * 3); pose(krass, -2, 0, 66, .2, L, { aRx: 2.3 - g * .3, aRz: -.2, aRe: 2.0, headX: .08 }, 'smug', { eyes: L.lt > .35 && L.lt < .55 ? 'wink' : 'half', mouth: 'smirk' });
  onFace(krass, 4.6, 0, .5, 40, L.k, 4.1); badge('big', 'KRASS', W / 2, H * .13, (L.lt - .05) * 3.5); }, [[0, 'whoosh_up', .5], [.4, 'sparkle', .6]]);
// 15 «Ihr gehört das Einkaufszentrum.»: el KRASS CENTER: Krass delante, la cámara sube hasta el letrero dorado
shot(14.18, 'Z', null, L => { mallOut(L); pose(krass, KX, 0, -4, 0, L, { aRx: 2.6, aRz: .6, aRe: .3, aLx: .5, aLe: 1.3 }, 'happy', { mouth: 'open_smile' });
  crowdBox(L, KX - 34, KX - 10, -12, 0, 5, 11, { mode: i => i % 2 ? 'walk' : 'look', face: V(KX, 30, -40) }); crowdBox(L, KX + 10, KX + 34, -12, 0, 5, 12, { mode: 'look', face: V(KX, 30, -40) }); cm([KX, 5, 14, KX, 4.5, -4, 50], [KX, 9, 30, KX, 36, -40, 52], L.k, easeIn); }, [[0, 'mall_ambience', .6], [.3, 'ding_reveal', .6]]);
// 16 «Einkaufszentrum.»: dentro: Krass cruza el atrio entre tiendas; los clientes: «KRASS!» → monedas
shot(15.0, 'W', null, L => { mallIn(L); walk(krass, L, KIX, 6, 0, 2.4, 0, { expr: 'smug', mouth: 'smile', pose: { aLx: .5, aLe: 1.3 } });
  const a = EXS[14]; pose(a, KIX - 5, 0, 10, PI / 2 + .3, L, 'point', 'shock', { mouth: 'o' }); greet(a, krass, L, 'KRASS!', .15, 12, { n: 6 });
  crowdBox(L, KIX - 30, KIX + 30, -20, 0, 9, 12, { mode: 'walk' }); cm([KIX + 1.5, 5.5, 21, KIX, 4.4, 7, 46], [KIX + 1, 5.5, 19.5, KIX, 4.4, 7.6, 46], L.k); }, [[.15, 'coin_jingle', .7], [0, 'mall_ambience', .5]]);
// 17 «Der Typ aus dem Fitnessstudio heißt»: DIGGA GYM: Digga hace curl con mancuerna frente al espejo
shot(15.72, 'R', null, L => { gym(L); const c = Math.abs(Math.sin(L.T * 3.2)); pose(digga, GX - 4, 0, -12, .3, L, { aRx: .3 + c * 1.6, aRe: .4 + c * 2.0, aLx: .2, aLz: .3, aLe: .5, lean: -.04 }, 'determined', { mouth: 'grimace' });
  attach(HANT, digga.aR.hand, [0, -.5, .1], [0, PI / 2, 0], .55); sweat(digga, L.T);
  const b = EXS[15]; pose(b, GX + 8, 0, -6, -PI / 2, L, { aLx: 1.5 + Math.sin(L.T * 6) * .3, aRx: 1.5 - Math.sin(L.T * 6) * .3 }, 'determined');
  orb(L.k, V(GX - 3, 4.2, -11), null, [17, .3, .1, 46], [14.5, -.1, .06, 46]); }, [[0, 'gym_clank', .7], [.6, 'grunt', .5]]);
// 18 «Digga.»: Digga, de frente, saca bíceps; su nombre en grande
shot(17.14, 'C', 'punch', L => { gym(L); pose(digga, GX, 0, -8, 0, L, { aLx: 1.6, aLz: 1.4, aLe: 2.3, aRx: 1.6, aRz: 1.4, aRe: 2.3, crouch: .05 }, 'smug', { mouth: 'grin' });
  onBody(digga, 10, .1, .12, 44, L.k, 8.6); badge('big', 'DIGGA', W / 2, H * .13, (L.lt - .05) * 3.5); }, [[0, 'flex_pop', .6], [.1, 'ding_reveal', .6]]);
// 19–21 «Digga, Digga, Digga.»: tres saludos de colegas en el gimnasio; cada uno le hace saltar monedas
for (const [i, t0, tr, nm] of [[0, 17.63, 'G', 'DIGGA!'], [1, 18.08, 'W', 'DIGGA!!'], [2, 18.58, 'Z', 'DIGGAAA!']])
  shot(t0, tr, i === 2 ? 'punch' : null, L => { gym(L); const b = EXS[16 + i], x = GX + [-14, 10, 0][i], z = [-2, 6, -6][i], ry = [.5, -.4, 0][i];
    pose(digga, x + Math.sin(ry) * 3.4, 0, z + Math.cos(ry) * 3.4, ry + PI, L, i === 1 ? { aRx: 2.6, aRz: -.4, aRe: .2 } : { aRx: 1.6, aRe: .3, aLx: .5, aLz: .3 }, 'joy', { mouth: 'open_smile' });
    pose(b, x, 0, z, ry, L, i === 1 ? { aRx: 2.6, aRz: .4, aRe: .2 } : { aRx: 1.6, aRe: .3, lean: .1 }, 'happy', { mouth: 'open_smile' });
    greet(b, digga, L, nm, .03, 8 + i * 8, { n: 7 }); orb(L.k, V(x + Math.sin(ry) * 1.7, 3.8, z + Math.cos(ry) * 1.7), null, [19, ry + PI / 2 + .25, .1, 46], [17, ry + PI / 2 + .1, .08, 46]); }, [[.04, 'fist_bump', .6], [.08, 'coin_jingle', .7]]);
// 22 «Sogar das Baby ist reich.»: mi calle: una niñera empuja el cochecito de oro; Boah, con babero de oro, mueve las manitas
shot(19.04, 'S', null, L => { strasseS(L); const n = EXS[18], z0 = 16 - L.lt * 2.2; walk(n, L, SX + 12, 26, PI, 2.2, 0, { expr: 'happy', mouth: 'smile', pose: { aLx: 1.3, aRx: 1.3, aLe: .3, aRe: .3 } });
  const wz = n.root.position.z - 5.6; show(WAGEN, SX + 12, 0, wz, PI / 2, .9); put(boah, SX + 12, 2.4, wz - .4, PI); actuar(boah, 0, [[0, { aLx: 1.6 + Math.sin(L.T * 9) * .5, aRx: 1.6 - Math.sin(L.T * 9) * .5, lLx: 1.4, lRx: 1.4 }]], { T: L.T }); cara(boah, L.T, { expr: 'joy', mouth: 'open_smile' }); boah.blob.visible = false;
  coinBurst(V(SX + 12, 6, wz - .4), L.t0 + .3, L.T, 6, 0, { y0: 2.4, vy: 5, spread: 1.5 }); cm([SX + 15.5, 6.6, wz - 12, SX + 12, 3.6, wz, 44], [SX + 15, 6.4, wz - 10, SX + 12, 3.6, wz + 1, 44], L.k); }, [[0, 'stroller_roll', .6], [.3, 'baby_giggle', .6]]);
// 23 «Es heißt Boah.»: dos vecinos se asoman al cochecito: «BOAH!» → le llueven monedas al bebé, que se ríe
shot(20.57, 'I', null, L => { strasseS(L); show(WAGEN, SX + 12, 0, 6, -PI / 2, .9); put(boah, SX + 12, 2.4, 6.4, 0); actuar(boah, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4, lLx: 1.4, lRx: 1.4 }]], { T: L.T }); cara(boah, L.T, { expr: 'joy', mouth: 'laugh' }); boah.blob.visible = false;
  const a = EXS[19], b = EXS[20]; pose(a, SX + 8, 0, 5, PI / 2, L, { lean: .35, aLx: 1.2, aLz: .5, aLe: 1.8, aRx: 1.2, aRz: .5, aRe: 1.8 }, 'shock', { mouth: 'o' }); pose(b, SX + 16, 0, 6.6, -PI / 2, L, { lean: .35, aLx: 1.2, aLz: .5, aLe: 1.8, aRx: 1.2, aRz: .5, aRe: 1.8 }, 'shock', { mouth: 'o' });
  greet(a, boah, L, 'BOAH!', .05, 0, { n: 8, dy: 1.4 }); greet(b, boah, L, 'BOAH!', .3, 10, { n: 8, dy: 1.4 }); badge('big', 'BOAH', W / 2, H * .13, (L.lt - .55) * 3);
  cm([SX + 12, 8.5, 21, SX + 12, 3.4, 6, 44], [SX + 12, 8, 18.5, SX + 12, 3.4, 6, 44], L.k); }, [[.05, 'coin_jingle', .7], [.3, 'coin_jingle', .7], [.5, 'baby_laugh', .6]]);
// 24 «Und ich?»: golpe de zoom: yo, sentado solo en el escalón de mi casa
shot(21.51, 'C', 'punch', L => { strasseS(L); sit(ich, SX - 19.4, 1.6, 0, PI / 2, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, headX: .1 }); cara(ich, L.T, { expr: 'sad', mouth: 'flat' });
  crowdBox(L, SX + 10, SX + 16, -20, 20, 3, 14, { mode: 'walk', ry: 0 }); onFace(ich, 4.4, .2, -.6, 42, L.k, 3.8); }, [[0, 'whoosh_soft', .4], [.1, 'crickets', .4]]);
// 25 «Ich heiße Huss.»: me levanto y señalo el buzón con mi nombre: HUSS
shot(22.08, 'F', null, L => { strasseS(L); pose(ich, SX - 18.6, 0, 2.6, PI / 2 + .55, L, { aRx: 1.5, aRz: -.4, aRe: .1, headY: .3 }, 'happy', { mouth: 'smile' });
  cm([SX - 4, 5, 5.4, SX - 18.5, 4.2, 4.0, 46], [SX - 5, 5, 5.0, SX - 18.5, 4.2, 4.1, 46], L.k); badge('tag', 'HUSS', W / 2, H * .13, (L.lt - .2) * 3); }, [[.2, 'pling', .5]]);
// 26 «Niemand sagt ihn.»: la gente pasa a mi lado sin mirarme; yo con la mano levantada, nadie dice nada
shot(22.99, 'W', null, L => { strasseS(L); pose(ich, SX - 13, 0, 0, PI / 2, L, { aRx: 2.4, aRz: .3, aRe: .4 }, 'sad', { mouth: 'flat' });
  walk(EXS[21], L, SX - 11, 14, PI, 2.4, 1); walk(EXS[22], L, SX - 15, -10, 0, 2.2, 2); walk(EXS[23], L, SX - 12, 20, PI, 2.6, 3, { pose: { headY: -.6 } });
  money('0 €', (L.lt - .3) * 3, 'red'); cm([SX + 2, 4.5, 4, SX - 13, 3.8, 0, 44], [SX + 1, 4.5, 1, SX - 13, 3.8, 0, 44], L.k); }, [[0, 'footsteps', .5], [.4, 'crickets', .5]]);
