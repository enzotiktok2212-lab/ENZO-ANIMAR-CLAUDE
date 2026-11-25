// ---------- c: la casa vacía, los guardias y la prueba del farol (97,95 – 146,41 s) ----------
// Casa de Brandt: la puerta DB (fila derecha, x = +15). Túnel: Ben cava en (STX + 2,5, -100) mirando -z; Krause llega por -z y se para delante (z = -103,6).
const DB = MT.DOORS.filter(d => d.x > 0).sort((a, b) => Math.abs(a.z + 20) - Math.abs(b.z + 20))[0];
const BENP = V(STX + 2.5, 0, -100);
function benDig(L, o = {}) { const b = put(ben, BENP.x, 0, BENP.z, PI); if (o.dig !== false) dig(b, L, 0, { face: false, sp: o.sp ?? 1 }); else { b.shovel.visible = true; actuar(b, 0, [[0, { aRx: .7, aLx: .7, aRe: .4, aLe: .4, lean: .05, ...(o.pose || {}) }]], { T: L.T }); } cara(b, L.T, o.face || { eyes: 'wide', mouth: 'flat', noBlink: true }); return b; }
function krauseAt(L, z = -103.6, h = 1, o = {}) { const k = put(krause, BENP.x - .3, 0, z, 0); lanternUp(k, L, h, o); cara(k, L.T, o.face || { expr: 'sus' }); return k; }
const guardRow = (L, z, n = 12, o = {}) => GUARDS.slice(0, n).forEach((g, i) => { const x = (i - (n - 1) / 2) * 3.2; put(g, STX + x, 0, z - Math.abs(i - (n - 1) / 2) * .9, 0); lanternUp(g, L, o.h ?? .55, { light: i === 1, k: 30 }); cara(g, L.T, { expr: o.expr || 'sus' }); });

// 84 «Am Morgen: sein Haus»: de día, la casa de Brandt: la puerta entreabierta, nadie; hojas que vuelan; la cámara se acerca
shot(97.95, 'B', null, L => { gasse(L, { day: true }); DB.pv.rotation.y = -.7; crowdAt(L, 6, DB.z + 20, 3, 8, 14, 3, { list: DX, mode: 'walk' });
  cm([-4, 7, DB.z + 16, 14, 5, DB.z, 46], [-1, 6.6, DB.z + 10, 14, 5, DB.z, 44], L.k); sh(V(10, 0, DB.z), 26); }, [[0, 'soft_air', .3], [.1, 'wind', .5], [.5, 'wood_creak', .5]]);
// 85 «leer.»: por la puerta abierta: dentro, oscuro y vacío; el felpudo con «BRANDT»
shot(98.81, 'C', 'punch', L => { gasse(L, { day: true }); DB.pv.rotation.y = -1.4; cm([5, 6, DB.z - 1, 15, 4.6, DB.z - .6, 40], [6.6, 5.6, DB.z - .8, 15, 4.6, DB.z - .6, 38], L.k); }, [[0, 'impact', .4], [.2, 'creepy_ting', .5]]);
// 86 «Am Abend:»: atardecer: la misma casa con la luz del porche encendida
shot(99.71, 'W', null, L => { gasse(L, { dawn: true }); cm([-4, 8, DB.z + 14, 15, 6, DB.z, 46], [-2, 7.6, DB.z + 11, 15, 6, DB.z, 44], L.k); sh(V(10, 0, DB.z), 26); }, [[0, 'whoosh', .4], [.2, 'crickets', .5]]);
// 87 «ein neuer Mann darin.»: un hombre nuevo (chaqueta de punto verde, gafas) sale al porche y saluda con una sonrisa enorme
shot(100.55, 'C', 'punch', L => { gasse(L, { dawn: true }); DB.pv.rotation.y = -1.5; const n = put(neuer, 12.4, 0, DB.z, -PI / 2); actuar(n, 0, [[0, 'wave']], { T: L.T }); grin(n, L.T); onBody(n, 12, 0, .1, 42, L.k, 10); sh(V(12, 0, DB.z), 20); }, [[0, 'impact', .4], [.1, 'door_open', .5], [.3, 'whistle', .3]]);
// 88 «Woher er kommt?»: Ben (con su Fanta) le pregunta desde la acera, curioso
shot(101.59, 'S', null, L => { gasse(L, { dawn: true }); const b = put(benT, 4, 0, DB.z + 2, PI / 2 - .2); attach(FANTA[0], b.aL.hand, [0, -.5, .45], [PI / 2, 0, 0], .6); actuar(b, 0, [[0, { aLx: .9, aLe: .6, aRx: .6, aRz: .4, aRe: 1.2, headY: .1 }]], { T: L.T }); talk(b, L.T, 101.5, 102.5, 'confused');
  const n = put(neuer, 12.4, 0, DB.z, -PI / 2); grin(n, L.T); onBody(b, 9, -.4, .1, 42, L.k, 8, -.3, 3); }, [[0, 'swipe', .4], [.2, 'pop', .3]]);
// 89 «Ach, von hier und da.»: el hombre nuevo se encoge de hombros y señala vagamente a todas partes, sonrisa rara
shot(102.52, 'W', null, L => { gasse(L, { dawn: true }); const n = put(neuer, 12.4, 0, DB.z, -PI / 2); const s = Math.sin(L.T * 3); actuar(n, 0, [[0, { aRx: 1.4, aRz: .6 + s * .5, aRe: .2, aLz: .5, aLe: 1.2, headZ: .15 }]], { T: L.T }); talk(n, L.T, 102.5, 103.3, 'happy'); bubble(n, 'VON HIER UND DA…', clamp(L.lt / .2));
  onFace(n, 6, 0, 0, 40, L.k, 5.2); }, [[0, 'whoosh', .4], [.4, 'creepy_ting', .4]]);
// 90 «Aber die zwei haben»: recuerdo en el túnel: el panadero y Krause, de cerca, girándose
shot(103.72, 'F', null, L => { tunnel(L, -116); const a = put(baecker, STX - 1.8, 0, -116, -.2), b = put(krause, STX + 1.8, 0, -116.4, .2); lanternUp(a, L, .4, { light: false }); lanternUp(b, L, .4); cara(a, L.T, { expr: 'sus' }); cara(b, L.T, { expr: 'sus' });
  cm([STX, 7.4, -104, STX, 6.4, -116, 40], [STX, 7.2, -105.5, STX, 6.4, -116, 38], L.k); }, [[0, 'flash', .3], [.1, 'creepy_ting', .5]]);
// 91 «geblinzelt.» (zoom lento): primerísimo plano de Krause: parpadea; destello de rayitas
shot(104.58, 'C', 'slow', L => { tunnel(L, -116); const b = put(krause, STX + 1.8, 0, -116.4, 0); lanternUp(b, L, .4); const bl = L.lt > .3 && L.lt < .5; cara(b, L.T, { expr: 'sus', eyes: bl ? 'closed' : 'squint' }); blinkFX(b, (L.lt - .25) / .35);
  onFace(b, 4, 0, 0, 36, L.k, 3.2); }, [[.3, 'blink', .7]]);
// 92 «Und Schlafwandler»: travelling por una fila de sonámbulos cavando, ojos abiertos
shot(105.43, 'W', null, L => { tunnel(L, -80); [SL[1], SL[6], SL[11], SL[16]].forEach((c, i) => { put(c, STX - 4.5 + i * 3, 0, -80 - (i % 2), PI); dig(c, L, i); }); cm([STX - 6, 6, -71, STX - 4, 5, -80, 40], [STX + 4, 6, -71, STX + 3, 5, -80, 40], L.k, x => x); }, [[0, 'swipe', .4], [.2, 'shovel', .5]]);
// 93 «blinzeln nie.»: primer plano de una sonámbula: ojos abiertos de par en par, ni un parpadeo
shot(106.29, 'C', 'punch', L => { tunnel(L, -80); const c = put(SL[6], STX - 1.5, 0, -80, 0); actuar(c, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); sleepFace(c, L.T); onFace(c, 4.2, 0, 0, 38, L.k, 3.6); }, [[0, 'impact', .4], [.2, 'creepy_ting', .4]]);
// 94 «Der eine war der Bäcker.»: el panadero con su gorro y el farol, de frente; «BÄCKER»
shot(107.05, 'W', null, L => { tunnel(L, -90); const a = put(baecker, STX, 0, -90, 0); lanternUp(a, L, .7); cara(a, L.T, { expr: 'sus' }); diggers(L, SL, -96, [-7, 7]);
  onBody(a, 10, .15, .1, 42, L.k, 8.6, .1, 3.6); badge('tag', 'BÄCKER', W / 2, H * .2, clamp((L.lt - .7) / .2)); }, [[0, 'whoosh', .4], [.7, 'pop', .4]]);
// 95 «Der andere»: Krause aparece detrás, en la penumbra, con el farol
shot(108.42, 'S', null, L => { tunnel(L, -100); const k = put(krause, STX, 0, -100, 0); lanternUp(k, L, .5, { k: 40 }); cara(k, L.T, { expr: 'angry' }); diggers(L, SL, -106, [-7, 7]); onBody(k, 12, -.2, .08, 42, L.k, 10.5); }, [[0, 'swipe', .4], [.2, 'creepy_ting', .5]]);
// 96 «Herr Krause,»: golpe de zoom a su cara: cejas gruesas, mirada dura
shot(109.14, 'C', 'punch', L => { tunnel(L, -100); const k = put(krause, STX, 0, -100, 0); lanternUp(k, L, .5, { k: 40 }); cara(k, L.T, { expr: 'angry' }); onFace(k, 4.6, 0, 0, 38, L.k, 4); badge('tag', 'HERR KRAUSE', W / 2, H * .2, clamp((L.lt - .2) / .2)); }, [[0, 'impact', .6], [.2, 'braam_short', .4]]);
// 97 «mein Sportlehrer.»: de día en el patio: Krause pita el silbato y los niños corren; Ben (camiseta amarilla) le mira de reojo
shot(109.86, 'W', null, L => { schulS(L); const k = put(krause, SCX, 0, -4, 0); actuar(k, 0, [[0, { aRx: 2.2, aRe: 2.1, aRz: -.3, aLz: .4, lean: -.05 }]], { T: L.T }); cara(k, L.T, { expr: 'shout', mouth: 'o' });
  crowdAt(L, SCX, 4, 6, 5, 9, 9, { list: DX, mode: 'run', dir: PI / 2 }); POST.push(() => DX.forEach(c => { if (c.root.visible) c.root.scale.setScalar(.72); })); const b = put(benT, SCX - 3.6, 0, 3, PI - .6); cara(b, L.T, { expr: 'sus', eyes: 'side_r' });
  onBody(k, 15, 0, .12, 44, L.k, 13); sh(V(SCX, 0, 0), 24); }, [[0, 'whoosh', .4], [.1, 'whistle', .7], [.3, 'run_grass', .4]]);
// 98 «Also zähle ich nachts.»: Ben cava y mira de reojo a izquierda y derecha
shot(110.75, 'S', null, L => { tunnel(L, -100); benDig(L, { face: { eyes: Math.sin(L.T * 4) > 0 ? 'side_l' : 'side_r', mouth: 'flat' } }); diggers(L, SL, -96, [-7, -2.5, 7], { avoid: [[2.5, -100]] }); onFace(ben, 4.6, 0, .4, 40, L.k, 4); }, [[0, 'swipe', .4], [.1, 'shovel', .4]]);
// 99 «nachts.»: sus dedos cuentan escondidos junto a la pala: 1, 2, 3…
shot(111.49, 'C', null, L => { tunnel(L, -100); const b = benDig(L, { dig: false, pose: { aLx: 1.2, aLe: 1.4, aLz: -.2 } }); const n = 1 + Math.floor(L.lt / .16); badge('num', String(Math.min(n, 5)), W / 2, H * .3, 1);
  b.root.updateMatrixWorld(true); const h = b.aL.hand.getWorldPosition(V(0, 0, 0)); cm([h.x - 1, h.y + 1.6, h.z - 4, h.x, h.y, h.z, 38], [h.x - .8, h.y + 1.4, h.z - 3.4, h.x, h.y, h.z, 36], L.k); }, [[0, 'tick', .5], [.16, 'tick', .5], [.32, 'tick', .5], [.48, 'tick', .5]]);
// 100 «Zwölf Leute im Tunnel»: plano general del túnel: los faroles de los guardias se encienden uno a uno entre los que cavan; contador hasta 12
shot(112.14, 'W', null, L => { tunnel(L, -80); diggers(L, SL, -60, [-6, -2, 2, 6]); const n = Math.min(12, 1 + Math.floor(L.lt / .08)); GUARDS.slice(0, n).forEach((g, i) => { put(g, STX + [-9, 9][i % 2] * .9, 0, -62 - i * 6, i % 2 ? -PI / 2 : PI / 2); lanternUp(g, L, .6, { light: false }); cara(g, L.T, { expr: 'sus' }); });
  cm([STX, 16, -40, STX, 3, -100, 48], [STX, 15, -44, STX, 3, -104, 48], L.k); bigNum(String(n), 1, 'gold', .2, 1.3); }, [[0, 'whoosh', .4], [.05, 'pling', .3], [.3, 'pling', .3], [.6, 'pling', .3], [.9, 'ding_soft', .5]]);
// 101 «blinzeln.»: un guardia de bigote parpadea a cámara
shot(113.2, 'C', 'punch', L => { tunnel(L, -80); const g = put(WA[1], STX, 0, -80, 0); lanternUp(g, L, .6); cara(g, L.T, { expr: 'sus', eyes: L.lt > .2 && L.lt < .38 ? 'closed' : 'squint' }); blinkFX(g, (L.lt - .15) / .3); onFace(g, 4.4, 0, 0, 38, L.k, 3.8); }, [[.2, 'blink', .7]]);
// 102 «Sie graben nicht.»: dos guardias de brazos cruzados miran a los que cavan; ellos no tienen pala
shot(113.85, 'W', null, L => { tunnel(L, -90); diggers(L, SL, -92, [-7, -2.5, 2.5, 7]); const a = put(WA[2], STX - 4, 0, -86, PI + .2), b = put(WA[3], STX + 4, 0, -86, PI - .2); for (const g of [a, b]) { actuar(g, 0, [[0, GEST.cross]], { T: L.T }); cara(g, L.T, { expr: 'smug' }); }
  cm([STX, 7, -76, STX, 4, -92, 46], [STX, 7, -78, STX, 4, -92, 44], L.k); }, [[0, 'whoosh', .4], [.1, 'shovel', .5], [.5, 'shovel', .4]]);
// 103 «Sie leuchten jedem mit»: un guardia acerca el farol a la cara de un sonámbulo que cava
shot(114.89, 'S', null, L => { tunnel(L, -90); const c = put(SL[12], STX - 1.6, 0, -90, PI / 2); dig(c, L, 0, { sp: .6 }); const g = put(WA[4], STX + 2.4, 0, -90, -PI / 2); lanternUp(g, L, lerp(.4, 1, clamp(L.lt / .5))); cara(g, L.T, { expr: 'sus' });
  cm([STX, 7, -80, STX + .4, 5.4, -90, 42], [STX, 6.8, -82, STX + .4, 5.4, -90, 40], L.k); }, [[0, 'swipe', .4], [.2, 'metal_creak', .4]]);
// 104 «Laternen in die Augen.»: primer plano: el farol pegado a sus ojos abiertos; ni se inmuta
shot(115.93, 'C', 'punch', L => { tunnel(L, -90); const c = put(SL[12], STX - 1.6, 0, -90, PI / 2); actuar(c, 0, [[0, { aLx: .4, aRx: .4 }]], { T: L.T }); sleepFace(c, L.T); const g = put(WA[4], STX + 2.4, 0, -90, -PI / 2); lanternUp(g, L, 1, { k: 46 });
  c.root.rotation.y = .3; onFace(c, 4.2, 0, .6, 38, L.k, 3.6); c.root.rotation.y = PI / 2; }, [[0, 'impact', .4], [.1, 'hum_low', .4]]);
// 105 «Sie suchen jeden,»: un guardia avanza por la fila mirando cara por cara (travelling hacia atrás)
shot(117.17, 'W', null, L => { tunnel(L, -96); diggers(L, SL, -88, [-7, -3, 3, 7]); const g = guardWalk(WA[5], L, STX, -108, 0, 3, 0, .8); lanternUp(g, L, .8, { pose: walkP(L.T * .8, 0) }); const p = g.root.position; orbit(V(p.x, 5.4, p.z), 10, 0, .08, 42); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 106 «der wach ist.»: el guardia se agacha y mira de cerca a un niño, sospechando
shot(117.95, 'C', 'punch', L => { tunnel(L, -96); const c = put(SL.filter(x => x.kid)[2], STX + 1, 0, -96, 0); actuar(c, 0, [[0, { aLx: .4, aRx: .4 }]], { T: L.T }); sleepFace(c, L.T); const g = put(WA[5], STX + 1, 0, -99.2, 0); lanternUp(g, L, .9, { pose: { lean: .5, crouch: .4 } }); cara(g, L.T, { expr: 'sus' });
  cm([STX + 6.4, 6, -96, STX + 1, 4.4, -98, 40], [STX + 5.8, 5.8, -96.4, STX + 1, 4.4, -98, 38], L.k); }, [[0, 'impact', .4], [.2, 'sniff', .5]]);
// 107 «Wir schlafwandeln nicht einfach.» (zoom lento): el túnel lleno, todos cavando a la vez
shot(118.97, 'F', 'slow', L => { tunnel(L, -60); diggers(L, SL, -40, [-7, -3, 1, 5]); cm([STX + 1, 14, -18, STX, 4, -70, 48], [STX + 1, 12, -26, STX, 4, -74, 46], L.k); sh(V(STX, 0, -50), 50); }, [[0, 'flash', .3], [.1, 'shovel', .5], [.5, 'shovel', .5]]);
// 108 «einfach.»: montones de tierra enormes a los lados; la tierra vuela
shot(119.85, 'C', null, L => { tunnel(L, -140); diggers(L, SL.slice(0, 12), -136, [-3, 3]); dust(V(STX, 0, -138), L.t0, L.T, 14, .7); cm([STX + 8, 10, -124, STX - 2, 3, -150, 46], [STX + 7, 9, -128, STX - 2, 3, -150, 44], L.k); }, [[0, 'shovel', .5], [.3, 'rubble', .5]]);
// 109 «Jemand lässt uns»: al fondo del túnel, donde no llega la luz, una silueta enorme con un farol vigila (solo se ve la luz)
shot(120.82, 'B', null, L => { tunnel(L, -200, { h: .45, fill: 14 }); diggers(L, SL.slice(0, 8), -190, [-4, 4]); const g = put(WA[6], STX, 0, -232, 0); lanternUp(g, L, .9, { k: 30 }); g.setFace({ eyes: 'squint', mouth: 'flat' });
  cm([STX, 7, -178, STX, 6, -232, 42], [STX, 7, -182, STX, 6, -232, 40], L.k); }, [[0, 'soft_air', .3], [.2, 'hum_low', .5]]);
// 110 «arbeiten.»: una vagoneta llena de tierra empujada por dos sonámbulos sobre los raíles
shot(121.54, 'W', null, L => { tunnel(L, -60); const z = -60; [SL[20], SL[21]].forEach((c, i) => { put(c, STX + (i ? 1.6 : -1.6), 0, z + 5.4, PI); actuar(c, 0, [[0, { ...sleepP(L.T, i), aLx: 1.4, aRx: 1.4, aLe: .2, aRe: .2, lean: .3 }]], { T: L.T }); sleepFace(c, L.T); });
  ST.g.updateMatrixWorld(true); cm([STX + 7, 6, z + 14, STX, 3, z, 44], [STX + 6, 6, z + 12, STX, 3, z, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'wheels', .6]]);
// 111 «Und die Zwölf»: los doce guardias en fila, frente a cámara, con sus faroles
shot(122.44, 'C', 'punch', L => { tunnel(L, -110); guardRow(L, -110); cm([STX, 7, -86, STX, 5, -112, 48], [STX, 7, -88, STX, 5, -112, 48], L.k); bigNum('12', clamp((L.lt - .1) / .2), 'gold', .2, 1.2); }, [[0, 'impact', .5], [.1, 'braam_short', .5]]);
// 112 «sind die Wächter.» (zoom lento): la cámara se acerca a Krause en el centro de la fila; «WÄCHTER»
shot(123.28, 'F', 'slow', L => { tunnel(L, -110); guardRow(L, -110); onFace(krause, 7, 0, 0, 40, L.k, 5); badge('red', 'WÄCHTER', W / 2, H * .2, clamp((L.lt - .2) / .2)); }, [[0, 'flash', .3]]);
// 113 «Seitdem erkenne ich sie»: de día en la calle, Ben camina mirando de reojo a la gente que pasa
shot(124.14, 'W', null, L => { gasse(L, { day: true }); const b = put(benT, 2, 0, 6 - L.lt * 2, PI); actuar(b, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(b, L.T, { expr: 'sus', eyes: Math.sin(L.T * 3) > 0 ? 'side_l' : 'side_r' });
  crowdAt(L, 2, -6, 5, 6, 12, 11, { list: DX, mode: 'walk' }); onBody(b, 10, 0, .08, 42, L.k, 9, 0, 3); sh(V(2, 0, 2), 20); }, [[0, 'whoosh', .4], [.1, 'city_amb', .4], [.2, 'steps', .5]]);
// 114 «auch am Tag.»: el panadero pasa sonriendo con una cesta de pan; Ben le sigue con la mirada
shot(125.06, 'S', null, L => { gasse(L, { day: true }); const a = put(baecker, -2 + L.lt * 2.6, 0, -2, PI / 2); actuar(a, 0, [[0, { ...walkP(L.T, 1), aRx: 1.1, aRe: 1.3 }]], { T: L.T }); grin(a, L.T); const bs = attach(PLATE[0], a.aR.hand, [0, -.5, .8], [0, 0, 0], 1.6);
  const b = put(benT, 4, 0, 4, PI - .4); cara(b, L.T, { expr: 'sus', eyes: 'side_r' }); cm([0, 7, 14, 2, 5, -1, 44], [1, 7, 13, 3, 5, -1, 42], L.k); sh(V(1, 0, 0), 20); }, [[0, 'swipe', .4], [.1, 'steps', .5]]);
// 115 «Alle haben Blasen.»: manos de la gente del pueblo con ampollas: una vecina cuenta monedas
shot(125.97, 'C', 'punch', L => { gasse(L, { day: true }); const c = put(DX[2], 0, 0, 10, 0); c.blis.visible = true; actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLe: 1.3, aRe: 1.3, aLz: -.1, aRz: -.1, headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  onBody(c, 7.4, 0, .14, 38, L.k, 6.6, 0, 3.6); }, [[0, 'impact', .4], [.2, 'coin_flip', .5]]);
// 116 «Die Wächter haben»: Krause enseña las palmas: limpísimas, brillan
shot(127.08, 'W', null, L => { schulS(L); const k = put(krause, SCX, 0, 0, 0); actuar(k, 0, [[0, { aLx: 1.4, aRx: 1.4, aLe: 1.0, aRe: 1.0, aLz: -.3, aRz: -.3 }]], { T: L.T }); grin(k, L.T); onBody(k, 8, 0, .12, 40, L.k, 7, 0, 3.8);
  FX2D.push(c => { for (let i = 0; i < 5; i++) { const a = L.T * 2 + i * 1.3; c.fillStyle = '#ffffff'; c.globalAlpha = .5 + .5 * Math.sin(a * 3); c.beginPath(); c.arc(W / 2 + Math.cos(a) * 180, H * .46 + Math.sin(a * 1.3) * 90, 12, 0, 7); c.fill(); } c.globalAlpha = 1; }); }, [[0, 'whoosh', .4], [.2, 'sparkle', .6]]);
// 117 «saubere Hände.»: Ben compara: sus manos llenas de ampollas
shot(127.82, 'C', 'punch', L => { schulS(L); const b = put(benT, SCX, 0, 0, 0); b.blis.visible = true; actuar(b, 0, [[0, { aLx: 1.4, aRx: 1.4, aLe: 1.1, aRe: 1.1, aLz: -.2, aRz: -.2, headX: .3 }]], { T: L.T }); cara(b, L.T, { expr: 'sad' }); onBody(b, 7, 0, .14, 38, L.k, 6, 0, 3.4); }, [[0, 'impact', .4], [.2, 'sigh', .5]]);
// 118 «Ich glaube, jeder hat so einen»: un vecino en su porche finge regar las flores pero no le quita ojo a Ben
shot(128.9, 'W', null, L => { gasse(L, { day: true }); const d = MT.DOORS.filter(d => d.x < 0)[3]; const g = put(WA[7], -12.4, 0, d.z + 3, PI / 2 + .2); actuar(g, 0, [[0, { aRx: 1.2, aRe: .3, headY: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'sus', eyes: 'side_r' });
  onBody(g, 12, .2, .1, 42, L.k, 10.5); }, [[0, 'whoosh', .4], [.2, 'pour', .4], [.6, 'birds', .3]]);
// 119 «in seiner Straße.»: Ben le devuelve la mirada de reojo, desconfiado
shot(130.06, 'C', 'punch', L => { gasse(L, { day: true }); const b = put(benT, 0, 0, 8, -PI / 2 + .5); cara(b, L.T, { expr: 'sus', eyes: 'side_l' }); actuar(b, 0, [[0, GEST.cross]], { T: L.T }); onFace(b, 5, 0, 0, 40, L.k, 4.4); }, [[0, 'impact', .4], [.2, 'tick', .3]]);
// 120 «Letzte Nacht rieselt mir Staub»: túnel: Ben cava; del techo empieza a caer polvo justo encima de él
shot(131.22, 'B', null, L => { tunnel(L, -100); benDig(L); diggers(L, SL, -96, [-7, -2.5, 7], { avoid: [[2.5, -100]] }); dustFall(V(BENP.x, 6, BENP.z), L.t0 + .2, L.T, 18);
  cm([BENP.x + 6, 9, BENP.z - 8, BENP.x, 6, BENP.z, 44], [BENP.x + 5, 8.6, BENP.z - 7, BENP.x, 6, BENP.z, 42], L.k); }, [[0, 'soft_air', .3], [.2, 'rubble', .6], [.5, 'sprinkle', .5]]);
// 121 «von der Decke»: el polvo cae de la viga del techo (contrapicado)
shot(132.28, 'S', null, L => { tunnel(L, -100); benDig(L); dustFall(V(BENP.x, 8, BENP.z), L.t0 - .5, L.T, 24); cm([BENP.x - 2, 5, BENP.z - 5, BENP.x, 17, BENP.z, 50], [BENP.x - 2, 5, BENP.z - 5, BENP.x, 15, BENP.z, 48], L.k); }, [[0, 'swipe', .4], [.2, 'sprinkle', .6]]);
// 122 «in die Augen.»: primerísimo plano: el polvo le entra en los ojos; se le ponen rojos y lloran, pero no parpadea
shot(133.1, 'C', 'punch', L => { tunnel(L, -100); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true } }); b.red.visible = true; tears(b, L.T); dustFall(V(BENP.x, 4, BENP.z), L.t0 - .3, L.T, 10); onFace(b, 3.4, 0, 0, 36, L.k, 2.9); }, [[0, 'impact', .4], [.2, 'shiver', .5]]);
// 123 «Und Herr Krause kommt»: Krause avanza por el pasillo entre los que cavan, farol en alto, hacia la cámara
shot(133.76, 'W', null, L => { tunnel(L, -110); diggers(L, SL, -104, [-7, -3, 6], { avoid: [[2.5, -100]] }); const k = guardWalk(krause, L, BENP.x - .3, -126, 0, 3.2, 0, .9); lanternUp(k, L, .9, { pose: walkP(L.T * .8, 0) }); cara(k, L.T, { expr: 'sus' });
  const p = k.root.position; orbit(V(p.x, 5.4, p.z), 12, .1, .06, 42); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 124 «die Reihe entlang.»: mira cara por cara, farol a un lado y al otro
shot(134.38, 'S', null, L => { tunnel(L, -110); diggers(L, SL, -104, [-7, -3, 6], { avoid: [[2.5, -100]] }); const k = guardWalk(krause, L, BENP.x - .3, -114, 0, 2.6, 0, .9); k.root.rotation.y = Math.sin(L.T * 3) * .6; lanternUp(k, L, .9); cara(k, L.T, { expr: 'sus' });
  onFace(k, 6.6, 0, 0, 40, L.k, 6); }, [[0, 'swipe', .4], [.1, 'steps', .5], [.6, 'sniff', .4]]);
// 125 «Er bleibt vor mir stehen.»: los pies de Krause se paran junto a la pala de Ben
shot(135.22, 'C', 'punch', L => { tunnel(L, -102); benDig(L, { dig: false }); const k = krauseAt(L, -103.6 - Math.max(0, .4 - L.lt) * 4, .3); cm([BENP.x + 3, 1.6, BENP.z - 2, BENP.x, 1, BENP.z - 3, 40], [BENP.x + 2.6, 1.5, BENP.z - 2.2, BENP.x, 1, BENP.z - 3, 38], L.k); }, [[0, 'impact', .5], [.3, 'steps', .5]]);
// 126 «stehen.»: contrapicado desde Ben: Krause le mira desde arriba
shot(135.78, 'W', null, L => { tunnel(L, -102); benDig(L, { dig: false }); const k = krauseAt(L, -103.6, .4, { face: { expr: 'sus' } }); cm([BENP.x + .6, 3.6, BENP.z + .6, BENP.x - .2, 8.2, BENP.z - 3.6, 50], [BENP.x + .6, 3.4, BENP.z + .2, BENP.x - .2, 8.4, BENP.z - 3.6, 48], L.k); }, [[0, 'swipe', .4], [.2, 'heartbeat', .6]]);
// 127 «Die Laterne direkt»: Krause levanta el farol hasta la cara de Ben
shot(136.72, 'S', null, L => { tunnel(L, -102); benDig(L, { dig: false }); krauseAt(L, -103.6, lerp(.3, 1, clamp(L.lt / .6)), { k: 50 }); cm([BENP.x + 6, 7, BENP.z - 1.6, BENP.x - .2, 5, BENP.z - 1.8, 42], [BENP.x + 5.4, 6.8, BENP.z - 1.6, BENP.x - .2, 5, BENP.z - 1.8, 40], L.k); }, [[0, 'whoosh', .4], [.2, 'metal_creak', .5]]);
// 128 «vor meinem Gesicht.» (zoom lento): la luz del farol en la cara de Ben, que aguanta con los ojos abiertos
shot(137.56, 'F', 'slow', L => { tunnel(L, -102); const b = benDig(L, { dig: false }); krauseAt(L, -103.6, 1, { k: 60 }); onFace(b, 4.4, 0, -.8, 38, L.k, 3.4); }, [[0, 'flash', .3]]);
// 129 «Fünfzehn Sekunden.»: los ojos de Ben, enormes; «15 SEK.»
shot(138.36, 'C', 'punch', L => { tunnel(L, -102); const b = benDig(L, { dig: false }); krauseAt(L, -103.6, 1, { k: 60 }); onFace(b, 3, 0, 0, 34, L.k, 2.7); bigNum('15 SEK.', clamp(L.lt / .2), 'big', .2, 1.1); }, [[0, 'impact', .5], [.05, 'tick', .6], [.5, 'tick', .5]]);
// 130 «Sekunden.»: la cara de Krause detrás del farol, buscando el parpadeo
shot(139.2, 'S', null, L => { tunnel(L, -102); benDig(L, { dig: false }); const k = krauseAt(L, -103.6, 1, { k: 50, face: { expr: 'sus', eyes: 'squint' } }); onFace(k, 4.6, 0, .8, 38, L.k, 4); }, [[0, 'swipe', .4], [.2, 'tick', .5]]);
// 131 «Dreißig.»: los ojos de Ben empiezan a ponerse rojos; «30 SEK.»
shot(139.86, 'C', 'punch', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true } }); b.red.visible = L.lt > .3; krauseAt(L, -103.6, 1, { k: 60 }); onFace(b, 3, 0, 0, 34, L.k, 2.6); bigNum('30 SEK.', clamp(L.lt / .2), 'big', .2, 1.1); }, [[0, 'impact', .5], [.05, 'tick', .6], [.5, 'tick', .5]]);
// 132 «Meine Augen brennen.»: rojos, con lágrimas; le tiembla la cara
shot(140.88, 'W', null, L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true }, pose: shiver(L.T, 1.4) }); b.red.visible = true; tears(b, L.T); krauseAt(L, -103.6, 1, { k: 60 }); onFace(b, 3.6, 0, .5, 36, L.k, 3.2); }, [[0, 'swipe', .4], [.1, 'fire_crackle', .5], [.4, 'shiver', .5]]);
// 133 «Fünfundvierzig.»: «45 SEK.» en rojo; Ben suda
shot(141.7, 'C', 'punch', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true }, pose: shiver(L.T, 1.6) }); b.red.visible = true; tears(b, L.T); sweat(b, L.T, 2); krauseAt(L, -103.6, 1, { k: 60 }); onFace(b, 3.2, 0, 0, 34, L.k, 2.8); bigNum('45 SEK.', clamp(L.lt / .2), 'red', .2, 1.1); }, [[0, 'impact', .5], [.05, 'tick', .6], [.4, 'heartbeat', .6]]);
// 134 «Fünfundvierzig.» → el farol en primer plano, la llama tiembla
shot(142.4, 'S', null, L => { tunnel(L, -102); benDig(L, { dig: false }); const k = krauseAt(L, -103.6, 1, { k: 60 + Math.sin(L.T * 30) * 10 }); k.root.updateMatrixWorld(true); const w = k.lantern.userData.bulb.getWorldPosition(V(0, 0, 0)); cm([w.x + 2.2, w.y + .6, w.z + 2.4, w.x, w.y, w.z, 40], [w.x + 1.8, w.y + .5, w.z + 2, w.x, w.y, w.z, 38], L.k); }, [[0, 'swipe', .4], [.1, 'fire_crackle', .6]]);
// 135 «Ich denke an Herrn Brandt.»: recuerdo: el gorro azul de Brandt tirado en la boca oscura del túnel lateral
shot(143.18, 'B', null, L => { tunnel(L, -120, { h: .4, fill: 10 }); show(CAPF, STX - 11, 0, -119, .4, 1.1); grade.uniforms.sepia.value = .5; cm([STX - 4, 4.6, -116, STX - 12, 1.2, -120, 42], [STX - 5.4, 4, -117.4, STX - 12, 1.2, -120, 40], L.k); }, [[0, 'soft_air', .3], [.2, 'sad_tone', .4]]);
// 136 «Sechzig.»: «60 SEK.» con latido; los ojos de Ben, rojos y temblando
shot(144.38, 'C', 'punch', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true }, pose: shiver(L.T, 2) }); b.red.visible = true; tears(b, L.T); sweat(b, L.T, 2); krauseAt(L, -103.6, 1, { k: 60 }); onFace(b, 2.8, 0, 0, 32, L.k, 2.5); bigNum('60 SEK.', clamp(L.lt / .2), 'red', .2, 1.2); SHAKE = .25; }, [[0, 'impact', .6], [.05, 'heartbeat', .7]]);
// 137 «Gleich blinzle ich.» (zoom lento): los párpados le tiemblan; la viñeta se cierra
shot(145.28, 'F', 'slow', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: Math.sin(L.T * 40) > .6 ? 'half' : 'wide', mouth: 'grimace', noBlink: true }, pose: shiver(L.T, 2.4) }); b.red.visible = true; tears(b, L.T); krauseAt(L, -103.6, 1, { k: 60 }); onFace(b, 2.8, 0, 0, 32, L.k, 2.2); }, [[0, 'flash', .3], [.2, 'heartbeat', .7]]);
