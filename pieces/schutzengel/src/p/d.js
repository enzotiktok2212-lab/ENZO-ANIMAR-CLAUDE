// ---------- d: la pelea, el rayo blanco y negro, el alcalde escondido, las alas plegadas, el final (118,79 – 162,4 s) ----------
const TZ = JZ - 9;   // donde flota el Tod (delante del trío)
function fightBase(L, o = {}) { festS(L); BLOOMMAX = .28; const e = pose(elias, o.ex ?? -2.6, 0, o.ez ?? JZ - 2.4, o.ery ?? PI, L, o.e || { aLx: .3, aRx: .3, aLz: .4, aRz: .4 }, o.ee || 'angry', { mouth: 'smirk' }); eliasWings(1, L.T);
  const m = pose(mira, o.mx ?? 3.4, 0, o.mz ?? JZ - 1.6, o.mry ?? PI, L, o.m || { aLx: .5, aRx: .5, aLz: .6, aRz: .6 }, o.me || 'determined'); miraWings(1, L.T, true); HALO.scale.setScalar(1.2);
  if (o.jonas !== false) pose(jonas, 0, 0, JZ + 3, PI, L, { crouch: .15, aLx: .8, aRx: .8, aLe: 1.6, aRe: 1.6 }, 'shock', { mouth: 'o' }); return [e, m]; }
const staffTip = () => { LEBEN.root.updateMatrixWorld(true); return LEBEN.orb.getWorldPosition(V(0, 0, 0)); };

// 102 «Trotzdem schlug der Tod zuerst zu.»: el Tod se descongela y lanza un tajo horizontal enorme con la guadaña hacia Elias; estela azul
shot(118.79, 'C', 'punch', L => { const [e] = fightBase(L); const sw = easeIn(clamp((L.lt - .4) / .5)); todOn(0, 0, TZ, -.3, L, { rx: lerp(-2.8, -1.2, sw), rz: lerp(.15, -1.6, sw), sx: lerp(.4, 1.4, sw), eyes: 7 }); TINT = 'rgba(20,30,80,.15)';
  if (sw > .2) EMB.burst(V(-1.5, 8, TZ + 3), L.t0 + .6, L.T, 0x9ae8ff, 20, 9);
  cm([10, 5, TZ + 14, -1, 7, TZ + 2, 50], [7, 5.4, TZ + 10, -1, 7, TZ + 2, 48], L.k); sh(V(0, 0, TZ + 3), 26); }, [[0, 'impact', .4], [.1, 'growl', .5], [.45, 'whoosh', .8], [.8, 'metal_rip', .5]]);
// 103 «Aber Nachtiel fing die Sense»: ¡CLANG! Elias atrapa la hoja con una mano; chispas azules y moradas, el suelo se agrieta
shot(120.86, 'F', null, L => { const [e] = fightBase(L, { e: { aRx: 1.6, aRz: .3, aRe: .2, aLx: .3, lean: .2, lLx: -.4, lRx: .5 } }); todOn(0, 0, TZ, -.3, L, { rx: -1.2, rz: -1.6, sx: 1.4, eyes: 7 });
  const hp_ = wpos(elias.aR.hand); EMB.burst(hp_, L.t0 + .05, L.T, 0xb08aff, 30, 12); if (L.lt < .3) SHAKE = 1 - L.lt / .3; dust(V(-2.6, 0, JZ - 2.4), L.t0, L.T, 10, .8);
  cm([hp_.x + 8, hp_.y + 1, hp_.z + 12, hp_.x, hp_.y - .5, hp_.z, 46], [hp_.x + 6, hp_.y + .6, hp_.z + 9, hp_.x, hp_.y - .5, hp_.z, 44], L.k); sh(V(-2, 0, JZ), 22); }, [[0, 'metal_hit', .9], [.02, 'sparks', .7], [.1, 'impact', .6], [.4, 'rubble', .4]]);
// 104 «mit nur einer Hand.»: primer plano: la mano de Elias apretando el filo brillante sin un rasguño; sonrisa ladeada
shot(122.06, 'Z', null, L => { const [e] = fightBase(L, { e: { aRx: 1.6, aRz: .3, aRe: .2, aLx: -.2, aLe: .5 } , ee: 'smug' }); todOn(0, 0, TZ, -.3, L, { rx: -1.2, rz: -1.6, sx: 1.4, eyes: 7 }); TINT = 'rgba(40,0,70,.15)';
  badge('red', '1 HAND', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, .9); const h = hp(e); cm([h.x + 3, h.y + .5, h.z + 9, h.x + 1, h.y - .8, h.z, 42], [h.x + 2.2, h.y + .3, h.z + 6.5, h.x + 1, h.y - .8, h.z, 40], L.k); sh(V(-2, 0, JZ), 18); }, [[0, 'zoom_in', .4], [.1, 'hum_low', .5], [.3, 'metal_creak', .5]]);
// 105 «Und brach sie einfach in zwei Teile.»: ¡CRACK! la guadaña se parte en dos; la hoja sale girando por el aire; destello
shot(123.22, 'C', 'punch', L => { fightBase(L, { e: { aRx: 1.6 - clamp((L.lt - .2) / .2) * .8, aRz: .3, aLx: .3, lean: .1 } }); const t = todOn(0, 0, TZ, -.3, L, { rx: -1.2, rz: -1.6, sx: 1.4, eyes: 7 }); t.snap(clamp((L.lt - .2) / 1.2)); if (L.lt > .2 && L.lt < .3) TINT = 'rgba(255,255,255,.6)';
  EMB.burst(V(-1, 8, TZ + 4), L.t0 + .2, L.T, 0x9ae8ff, 26, 12); if (L.lt > .2 && L.lt < .45) SHAKE = 1;
  cm([12, 6, TZ + 16, -1, 7, TZ + 2, 50], [9, 7, TZ + 13, -1, 8, TZ + 2, 50], L.k); sh(V(0, 0, TZ + 3), 26); }, [[0, 'impact', .5], [.2, 'glass_break', .6], [.22, 'crash_wood', .7], [.35, 'whirl', .5], [.9, 'metal_hit', .4]]);
// 106 «Dann schoss das Leben einen Strahl,»: el Leben en el escenario alza su bastón: el orbe se carga y dispara un rayo verde enorme
shot(125.14, 'W', null, L => { festS(L); const l = lebenOn(-9, SY, -66, .35, L, { rx: -2.2, eyes: 5, orb: 6 }); const tip = staffTip(); const k = clamp((L.lt - .4) / .3);
  if (k > 0) { BEAM[0].visible = true; BEAM[0].userData.set(tip, tip.clone().lerp(V(3.4, 6, JZ - 1.6), k), 1.2, L.T); } EMB.rise(tip, L.T, 0x8aff6a, 3, 4, 20); lp(3, -9, 14, -60, 120 + k * 200, 0x6aff5a, 50);
  cm([-24, 6, -40, -8, 12, -62, 50], [-20, 8, -46, -8, 12, -62, 50], L.k); sh(V(-9, 4, -64), 30); }, [[0, 'swipe', .4], [.1, 'power_on', .6], [.4, 'zap', .8], [.5, 'hum_glow', .6]]);
// 107 «der den ganzen Platz»: el rayo verde barre la plaza: allí donde toca, brotan árboles, helechos y flores a toda velocidad
shot(127.20, 'S', null, L => { festS(L); lebenOn(-9, SY, -66, .35, L, { rx: -2.2, eyes: 5, orb: 6 }); const tip = staffTip(); const tg = V(lerp(-30, 30, L.k), 0, lerp(-20, -40, L.k)); BEAM[0].visible = true; BEAM[0].userData.set(tip, tg, 1.1, L.T);
  JUNG.visible = true; JUNG.userData.grow(L.k * .8); EMB.burst(tg, L.t0 + L.lt - .1, L.T, 0x8aff6a, 14, 6); lp(3, tg.x, 6, tg.z, 160, 0x6aff5a, 40);
  cm([0, 30, 10, 0, 0, -36, 52], [10, 24, 4, 0, 0, -36, 52], L.k); sh(V(0, 0, -36), 50); }, [[0, 'swipe', .4], [.05, 'zap', .6], [.2, 'leaves', .7], [.6, 'rubble', .4]]);
// 108 «in einen Dschungel verwandelte.»: la plaza convertida en selva: lianas sobre las casas, flores gigantes; la gente asoma entre las plantas
shot(128.24, 'Z', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(.8 + L.k * .2); crowdF(L, 10, { mode: 'shock', r0: 18, r1: 30, z: -30 });
  badge('green', 'DSCHUNGEL!', W / 2, H * .2, clamp((L.lt - .1) / .2), 1, .9); cm([-30, 10, 10, 0, 6, -30, 50], [-22, 14, 2, 0, 5, -32, 50], L.k); sh(V(0, 0, -30), 50); }, [[0, 'zoom_in', .4], [.1, 'birds', .5], [.3, 'leaves', .5], [.6, 'whinny', .2]]);
// 109 «Doch Lumiel schlug einfach mitten durch.»: Mira vuela contra el rayo verde y lo parte de un puñetazo: el rayo estalla en chispas
shot(129.49, 'C', 'punch', L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1); lebenOn(-9, SY, -66, .35, L, { rx: -2.2, eyes: 5, orb: 6 }); const tip = staffTip();
  const fly = easeOut(clamp(L.lt / .5)); const mp = V(lerp(3.4, -2, fly), lerp(0, 6, fly), lerp(JZ - 1.6, -50, fly)); const m = put(mira, mp.x, mp.y, mp.z, PI + .4); actuar(m, 0, [[0, { aRx: 2.8, aRe: .1, aLx: .4, aLz: .6, lean: .5, lLx: -.6, lRx: .4 }]], { T: L.T, weight: false }); cara(m, L.T, { expr: 'angry', mouth: 'grimace' }); m.blob.visible = false; miraWings(1, L.T, true); HALO.scale.setScalar(1.2);
  const hit = wpos(m.aR.hand); if (L.lt < .5) { BEAM[0].visible = true; BEAM[0].userData.set(tip, hit, 1.1, L.T); } else { EMB.burst(hit, L.t0 + .5, L.T, 0x8aff6a, 40, 14); if (L.lt < .7) TINT = 'rgba(200,255,200,.4)'; SHAKE = L.lt < .8 ? 1 : 0; }
  BLOOMMAX = .32; cm([12, 10, -26, -4, 8, -52, 50], [8, 9, -32, -4, 8, -52, 48], L.k); sh(V(-4, 0, -50), 30); }, [[0, 'whoosh_up', .6], [.45, 'impact', .9], [.5, 'explosion', .6], [.55, 'sparks', .5]]);
// 110 «mitten durch.»: Mira aterriza junto a Elias con el puño humeante, las ocho alas abiertas
shot(130.89, 'F', null, L => { const [e, m] = fightBase(L, { m: { aRx: 1.2, aRe: 1.6, aLx: .4, aLz: .6 }, me: 'smug' }); JUNG.visible = true; JUNG.userData.grow(1); EMB.rise(wpos(mira.aR.hand), L.T, 0xffffff, 1.4, 4, 14);
  orb(L.k, V(.4, 6, JZ - 2), null, [26, PI + .3, .1, 50], [22, PI - .15, .1, 50]); sh(V(0, 0, JZ), 26); }, [[0, 'flash', .3], [.05, 'land', .7], [.2, 'steam', .4]]);
// 111 «Und dann nahmen sich die beiden an den Händen.»: Elias y Mira se miran, asienten y se dan la mano; luz y oscuridad se mezclan en sus manos
shot(131.92, 'R', null, L => { const k = easeOut(clamp(L.lt / .6)); const [e, m] = fightBase(L, { ex: -2.6 + k * 1.4, mx: 3.4 - k * 1.4, ez: JZ - 2, mz: JZ - 2, ery: PI - .4, mry: PI + .4, e: { aLx: 1.2 * k, aLz: -.3 * k, aLe: .2 }, m: { aRx: 1.2 * k, aRz: .3 * k, aRe: .2 }, ee: 'smug', me: 'smug' }); JUNG.visible = true; JUNG.userData.grow(1);
  const hm = wpos(elias.aL.hand).lerp(wpos(mira.aR.hand), .5); glowAt(hm, 1.5 + k, 0xffffff, .3 * k); EMB.rise(hm, L.T, L.T * 8 % 2 > 1 ? 0xffffff : 0x8a3aff, 2, 4, 20);
  orb(L.k, V(0, 6, JZ - 2), null, [22, .5, .1, 48], [16, -.2, .1, 46]); sh(V(0, 0, JZ), 22); }, [[0, 'whirl', .4], [.2, 'hug', .4], [.5, 'hum_glow', .6], [.8, 'magic_hit', .4]]);
// 112 «Dunkelheit und Licht.»: espiral: alas negras y blancas giran alrededor de las manos unidas
shot(134.13, 'Z', null, L => { const [e, m] = fightBase(L, { ex: -1.2, mx: 2, ez: JZ - 2, mz: JZ - 2, ery: PI - .4, mry: PI + .4, e: { aLx: 1.2, aLz: -.3, aLe: .2 }, m: { aRx: 1.2, aRz: .3, aRe: .2 }, ee: 'determined' }); JUNG.visible = true; JUNG.userData.grow(1);
  const hm = wpos(elias.aL.hand).lerp(wpos(mira.aR.hand), .5); glowAt(hm, 3, 0xffffff, .35); FEA.fall(hm.clone().add(V(0, -6, 0)), L.T * 2, L.T * 4 % 2 > 1 ? 0xffffff : 0x16141c, .5, 10, 12, 28);
  orb(0, hm, null, [lerp(14, 9, L.k), PI + L.k * 1.4, .15, 46], [0, 0, 0]); sh(V(0, 0, JZ), 20); }, [[0, 'zoom_in', .4], [.1, 'feathers', .6], [.3, 'choir', .5]]);
// 113 «Zu einem einzigen Strahl verdreht.»: zoom lento: de sus manos sale un rayo trenzado, blanco y negro, que atraviesa al Tod y al Leben
shot(135.17, 'C', 'slow', L => { const [e, m] = fightBase(L, { ex: -1.2, mx: 2, ez: JZ - 2, mz: JZ - 2, ery: PI - .2, mry: PI + .2, e: { aLx: 1.6, aLz: -.2, aLe: .1, aRx: .4 }, m: { aRx: 1.6, aRz: .2, aRe: .1, aLx: .4 }, ee: 'determined' }); JUNG.visible = true; JUNG.userData.grow(1);
  todOn(0, 0, TZ - 10, 0, L, { eyes: 7 }); lebenOn(-9, SY, -66, .35, L, { eyes: 5 }); const hm = wpos(elias.aL.hand).lerp(wpos(mira.aR.hand), .5); const k = easeOut(clamp((L.lt - .3) / .6));
  for (const [b, dx] of [[BEAM[1], .9], [BEAM[2], -.9]]) { b.visible = k > 0; const tw = V(Math.sin(L.T * 20) * dx, Math.cos(L.T * 20) * dx, 0); b.userData.set(hm.clone().add(tw), hm.clone().lerp(V(-4, 9, -66), k).add(tw.multiplyScalar(-1)), 1.4, L.T); }
  BLOOMMAX = .35; if (k > 0) lp(3, 0, 10, JZ - 20, 260, 0xffffff, 60); cm([8, 4, JZ + 12, -2, 8, -54, 50], [5, 4.6, JZ + 8, -2, 8, -54, 46], L.k); sh(V(0, 0, JZ - 10), 40); }, [[0, 'riser_short', .5], [.3, 'zap', .9], [.35, 'fire_whoosh', .6], [.6, 'explosion', .5]]);
// 114 «Drei Sekunden lang»: el impacto: TODO se vuelve blanco y negro; las figuras de Tod y Leben se deshacen en luz; «3 SEKUNDEN»
shot(137.32, 'F', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1); BW = 1; BLOOMMAX = .4; const d = clamp(L.lt / .9);
  todOn(0, 0, TZ - 10, 0, L, { eyes: 7 }, 1 - d * .9); lebenOn(-9, SY, -66, .35, L, { eyes: 5 }, 1 - d * .9); EMB.burst(V(-4, 9, -60), L.t0, L.T, 0xffffff, 44, 16); grade.uniforms.flash.value = lerp(.9, 0, clamp(L.lt / .4));
  badge('big', '3 SEKUNDEN', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, .9); cm([0, 8, -20, -4, 10, -62, 54], [0, 10, -26, -4, 10, -62, 52], L.k); sh(V(0, 0, -50), 40); }, [[0, 'explosion', .9], [.05, 'impact', .8], [.3, 'braam', .7]]);
// 115 «war der ganze Himmel»: vista de la ciudad desde lo alto, en blanco y negro, el cielo partido en dos (mitad negra, mitad blanca)
shot(138.26, 'W', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1); BW = 1; setSky([0, 0, 0], [.5, .5, .5], [1, 1, 1]); sun.intensity = 3.5;
  cm([-60, 50, 60, 0, 30, -60, 56], [-40, 60, 50, 0, 40, -60, 56], L.k); sh(V(0, 0, -30), 60); }, [[0, 'swipe', .4], [.1, 'hum_low', .6], [.4, 'wind', .6]]);
// 116 «nur noch schwarz und weiß.»: la gente de la plaza, en blanco y negro, mira al cielo con la boca abierta; nada se mueve
shot(139.28, 'Z', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1); BW = 1; crowdF(L, 12, { mode: 'shock', r0: 10, r1: 20, z: -24 }); POST.push(() => DX.forEach(c => { if (c.root.visible) c.head.rotation.x = -.5; }));
  cm([4, 3, 4, 0, 8, -24, 50], [2, 3.4, -2, 0, 9, -24, 50], L.k); sh(V(0, 0, -24), 40); }, [[0, 'zoom_in', .4], [.1, 'silence_tick', .6], [.5, 'heartbeat', .4]]);
// 117 «Als er wieder klar wurde,»: el color vuelve en una ola desde el centro; humo y plumas flotando
shot(140.83, 'F', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1 - L.k * .6); BW = 1 - easeOut(L.k); FEA.fall(V(0, 0, -50), L.T, 0xffffff, .6, 30, 16, 16); dust(V(0, 4, -64), L.t0, L.T, 18, 2);
  cm([10, 8, -30, 0, 8, -62, 50], [6, 9, -36, 0, 8, -62, 48], L.k); sh(V(0, 4, -62), 30); }, [[0, 'flash', .4], [.1, 'wind', .5], [.4, 'chime', .5]]);
// 118 «waren Leben und Tod verschwunden.»: el escenario: donde estaban, sólo quedan dos marcas quemadas y la media guadaña en el suelo
shot(142.08, 'S', null, L => { festS(L); SHD.visible = true; SHD.position.set(0, SY + .05, -65); SHD.scale.setScalar(9);
  FEA.fall(V(0, SY, -62), L.T, 0x16141c, .2, 20, 12, 14);
  cm([-12, 12, -40, 0, 5, -64, 50], [-6, 10, -44, 0, 5, -64, 48], L.k); sh(V(0, 4, -62), 26); }, [[0, 'swipe', .4], [.1, 'wind', .4], [.4, 'sad_tone', .3]]);
// 119 «Und der Bürgermeister versteckte sich»: Graf agachado detrás del atril, temblando, con el sombrero torcido
shot(143.92, 'C', 'punch', L => { festS(L); const g = put(graf, 0, SY, -62.6, 0); actuar(g, 0, [[0, { crouch: .9, lean: .3, aLx: 2.2, aRx: 2.2, aLe: 1.6, aRe: 1.6, headX: .2 }]], { T: L.T }); shiver(g, L.T); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'grimace' }); sweat(g, L.T, 2);
  cm([6, 9, -72, 0, 5.5, -62, 46], [4, 8.4, -69, 0, 5.5, -62, 44], L.k); sh(V(0, 4, -62), 18); }, [[0, 'impact', .4], [.1, 'shiver', .5], [.4, 'gulp', .5]]);
// 120 «hinter seinem Rednerpult.»: de frente: sólo asoman los ojos y el sombrero por encima del atril, que tiembla
shot(145.24, 'R', null, L => { festS(L); const g = put(graf, 0, SY - 1.4, -62.6, 0); actuar(g, 0, [[0, { crouch: .7, aLx: 1.9, aRx: 1.9, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'o' }); g.root.position.x = Math.sin(L.T * 40) * .06;
  cm([1.5, 8, -48, 0, 7, -61, 42], [.8, 7.6, -51, 0, 7, -61, 40], L.k); sh(V(0, 4, -62), 18); }, [[0, 'whirl', .4], [.2, 'shiver', .5], [.6, 'kids_laugh', .3]]);
// 121 «Meine besten Freunde falteten ihre Flügel zusammen»: Elias y Mira pliegan las alas a la vez, despacio; las plumas caen
shot(146.71, 'W', null, L => { festS(L); const f = 1 - easeInOut(clamp(L.lt / 1.6)); const e = pose(elias, -2.6, 0, JZ - 2.4, PI, L, { aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, 'smug'); WE.visible = true; WE.userData.spread(f, L.T); REDEYE.forEach(r => r.visible = f > .3);
  const m = pose(mira, 3.4, 0, JZ - 1.6, PI, L, {}, 'happy'); miraWings(f, L.T, f > .2); HALO.scale.setScalar(Math.max(.01, f) * 1.2); GOLDEYE.forEach(g => g.visible = f > .3); FEA.fall(V(0, 0, JZ - 2), L.T, 0xffffff, .6, 16, 12, 12);
  orb(L.k, V(.4, 6, JZ - 2), null, [28, 0, .1, 50], [22, .3, .1, 48]); sh(V(0, 0, JZ), 24); }, [[0, 'swipe', .4], [.2, 'feathers', .6], [.6, 'cloth', .5], [1.2, 'whoosh_down', .4]]);
// 122 «und drehten sich um,»: se dan la vuelta hacia Jonas como si nada; Elias se mete las manos en los bolsillos
shot(148.95, 'R', null, L => { festS(L); const t = easeInOut(clamp(L.lt / .6)); pose(elias, -2.6, 0, JZ - 2.4, lerp(PI, .2, t), L, { aLx: -.25, aRx: -.25, aLe: .5, aRe: .5 }, 'smug', { mouth: 'smirk' }); pose(mira, 3.4, 0, JZ - 1.6, lerp(PI, -.2, t), L, { aLx: .2, aRx: .2 }, 'happy', { mouth: 'grin' });
  pose(jonas, 0, 0, JZ + 3, PI, L, {}, 'shock', { mouth: 'o' }); orb(L.k, V(0, 5, JZ), null, [20, PI - .5, .12, 46], [15, PI - .2, .1, 46]); sh(V(0, 0, JZ), 22); }, [[0, 'whirl', .4], [.1, 'steps', .4], [.4, 'whistle_inno', .5]]);
// 123 «als wäre nichts passiert.»: plano a la altura de Jonas: sus amigos delante, normales, saludando; detrás, la plaza destrozada
shot(150.09, 'F', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(.4); pose(elias, -2.6, 0, JZ - 2.4, .2, L, { aLx: -.25, aRx: -.25, aLe: .5, aRe: .5 }, 'smug'); pose(mira, 3.4, 0, JZ - 1.6, -.2, L, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 9) * .2, aRe: .3 }, 'happy', { mouth: 'grin' });
  cm([0, 5.4, JZ + 12, 0, 5, JZ - 2, 46], [0, 5.4, JZ + 9, 0, 5, JZ - 2, 44], L.k); sh(V(0, 0, JZ), 22); }, [[0, 'flash', .3], [.2, 'chime', .4]]);
// 124 «Du warst nie leer,»: Mira se acerca y le pone la mano en el pecho a Jonas, sonriendo con ternura
shot(151.46, 'C', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, PI, L, {}, 'sad'); const m = pose(mira, 1.6, 0, JZ - .6, -.3 + PI * 0, L, { aRx: 1.3, aRe: .3, aRz: -.3 }, 'warm', { mouth: 'smile' }); m.root.rotation.y = faceTo(m.root.position, j.root.position); talk(m, L.T, 151.46, 152.6, 'warm');
  tears(j, L.T, 0); const c = hp(m).lerp(hp(j), .5); orb(L.k, c, null, [13, -1.3, .05, 42], [10, -1.05, .05, 40]); sh(V(0, 0, JZ), 16); }, [[0, 'impact', .2], [.1, 'strings', .5], [.4, 'sniff', .4]]);
// 125 «sagte Mira.»: primer plano de Mira, guiño
shot(152.61, 'S', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, PI, L, {}, 'sad'); const m = pose(mira, 1.6, 0, JZ - .6, 0, L, { aRx: 1.3, aRe: .3, aRz: -.3 }, 'warm', { eyes: L.lt > .2 ? 'wink' : 'happy', mouth: 'grin' }); m.root.rotation.y = faceTo(m.root.position, j.root.position);
  onFace(m, 6.5, .2, 0, 40, L.k, 5.2); sh(V(0, 0, JZ), 16); }, [[0, 'swipe', .4], [.2, 'ding_soft', .4]]);
// 126 «Wir sind nur nie von deiner Seite gewichen,»: Elias le pasa el brazo por los hombros a Jonas; los tres juntos, los amigos a sus lados (como dos ángeles)
shot(153.09, 'Z', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, 0, L, {}, 'happy', { mouth: 'open_smile' }); tears(j, L.T, 0); const e = pose(elias, -2.6, 0, JZ + 3, .15, L, { aRx: 1.8, aRz: -.9, aRe: .3 }, 'warm'); talk(e, L.T, 153.09, 155.2, 'warm'); pose(mira, 2.6, 0, JZ + 3, -.15, L, { aLx: 1.8, aLz: .9, aLe: .3 }, 'happy', { mouth: 'smile' });
  onBody(j, 22, 0, .1, 44, L.k, 15); sh(V(0, 0, JZ + 3), 20); }, [[0, 'zoom_in', .4], [.2, 'hug', .5], [.5, 'strings', .4]]);
// 127 «sagte Elias.»: Elias le revuelve el pelo a Jonas, sonrisa de verdad
shot(155.24, 'C', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, 0, L, { headZ: Math.sin(L.T * 14) * .1 }, 'happy', { eyes: 'happy', mouth: 'laugh' }); const e = pose(elias, -2.4, 0, JZ + 3, .5, L, { aRx: 2.6, aRz: -.8, aRe: .4 + Math.sin(L.T * 14) * .2 }, 'happy', { mouth: 'grin' });
  const c = hp(j).lerp(hp(e), .5); orb(L.k, c, null, [11, .5, .05, 42], [8.5, .2, .05, 40]); sh(V(0, 0, JZ), 16); }, [[0, 'impact', .2], [.2, 'laugh_deep', .5], [.4, 'kids_laugh', .3]]);
// 128 «Also ja.»: Jonas mira a cámara y se encoge de hombros con una sonrisa enorme
shot(156.14, 'F', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, 0, L, { aLx: .3, aRx: .3, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5 }, 'happy', { mouth: 'grin' });
  onFace(j, 7, .2, 0, 40, L.k, 5.4); sh(V(0, 0, JZ), 16); }, [[0, 'flash', .3], [.2, 'ding_soft', .4]]);
// 129 «In dieser Welt hat jeder zwei Schutzengel.»: noche, la plaza recuperada: la gente con sus angelitos de dos en dos, farolillos; grúa subiendo
shot(156.77, 'W', null, L => { festS(L); crowdF(L, 20, { mode: i => ['talk', 'wave', 'cheer', 'clap'][i % 4], r0: 6, r1: 24, z: -24 }); confRain(V(0, 0, -24), L.T, 30, 40, 30, 18);
  cm([0, 5, 10, 0, 6, -30, 50], [0, 22, 20, 0, 4, -30, 52], L.k); sh(V(0, 0, -24), 44); }, [[0, 'swipe', .4], [.1, 'bells', .5], [.5, 'cheer', .4], [1.2, 'choir', .4]]);
// 130 «Meine tun nur so,»: los tres se alejan por la calle iluminada, de espaldas; Jonas en medio
shot(159.08, 'R', null, L => { town(L, { night: true }); for (const [c, x, i] of [[elias, -3.2, 1], [jonas, 0, 0], [mira, 3.2, 2]]) walk(c, L, x, 10, PI, 2.2, i, { expr: 'happy' });
  orb(L.k, V(0, 5, 10 - L.lt * 2.2), null, [16, .25, .15, 46], [20, 0, .2, 46]); sh(V(0, 0, 8), 24); }, [[0, 'whirl', .4], [.1, 'steps', .5], [.5, 'owl', .3]]);
// 131 «als wären sie meine besten Freunde.»: plano final: sus sombras alargadas en el suelo bajo la farola… las de Elias y Mira tienen alas
shot(160.10, 'Z', 'slow', L => { town(L, { night: true }); for (const [c, x, i] of [[elias, -3.2, 1], [jonas, 0, 0], [mira, 3.2, 2]]) walk(c, L, x, 4, PI, 1.8, i, { expr: 'happy' }); sun.intensity = 2.4;
  WE.visible = true; WE.userData.spread(1, L.T); WE.userData.ghost(true); WM.visible = true; WM.userData.spread(1, L.T); WM.userData.ghost(true);
  sh(V(0, 0, 0), 30); sun.position.set(0, 26, 40); sun.target.position.set(0, 0, -10); cm([0, 22, 14, 0, 0, -8, 50], [0, 26, 18, 0, 0, -10, 54], L.k); }, [[0, 'zoom_in', .3], [.2, 'whoosh_magic', .5], [.6, 'lullaby', .4], [1.4, 'ding_reveal', .6]]);
