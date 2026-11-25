// ---------- b: Granitor, la batalla, el capitán no hace nada (39,8 – 63,3 s) ----------
const GZ = -120;   // el gigante avanza por la avenida
const giant = (L, x, z, ry = 0, o = {}) => { const g = put(gran, x, 0, z, ry); const ph = o.walk === false ? 0 : L.T * .9; actuar(g, L.lt, [[0, o.pose || { lLx: Math.sin(ph * 2) * .45, lRx: -Math.sin(ph * 2) * .45, lLk: Math.max(0, -Math.cos(ph * 2)) * .4, lRk: Math.max(0, Math.cos(ph * 2)) * .4, aLx: -Math.sin(ph * 2) * .35, aRx: Math.sin(ph * 2) * .35, aLz: .2, aRz: .2 }]], { T: L.T }); cara(g, L.T, { expr: o.expr || 'angry', mouth: o.mouth || 'grimace' }); return g; };
const chaos = (L, cx, cz) => { smoke(V(cx, 0, cz), L.T, 3); fire(V(cx + 6, 0, cz + 4), L.T, 1.4, 6); };

// 25 «Dann kam Granitor.» (zoom lento): un pie de piedra gigantesco cae en la avenida; los coches saltan; polvo
shot(tw('Dann', 1), 'C', 'slow', L => { city(); const g = giant(L, DT0, GZ, 0, { pose: { lRx: .6 - easeIn(clamp(L.lt / .7)) * .6, lRk: .4 - clamp(L.lt / .7) * .4, aLz: .3, aRz: .3 } });
  dust(V(DT0 + 4, 0, GZ + 6), L.t0 + .7, L.T, 16, 3); DT.CARS.slice(4, 8).forEach((c, i) => { const j = L.lt > .7 ? Math.max(0, Math.sin((L.lt - .7) * 8)) * 1.6 / (1 + (L.lt - .7) * 3) : 0; c.position.y = j * (1 + i * .2); });
  cm([DT0 + 2, 3, GZ + 80, DT0 + 2, 18, GZ, 56], [DT0 + 2, 4, GZ + 70, DT0 + 2, 22, GZ, 56], L.k); sh(V(DT0, 0, GZ + 10), 60); }, [[0, 'rumble', .7], [.7, 'boom', .9], [.75, 'car_alarm', .5], [1.0, 'debris', .5]]);
// 26 «Ein Riese, so groß wie ein Hochhaus.»: contrapicado: Granitor al lado de un rascacielos, igual de alto; gente corriendo
shot(tw('Ein', 1), 'W', null, L => { city(); const g = giant(L, DT0, GZ + L.lt * 3, 0); runners(L.T, L.lt, GZ + 30, 10, 6, { x: DT0, w: 16, dir: -1, sp: 8 });
  badge('tag', 'HOCHHAUS', W * .3, H * .22, (L.lt - .8) * 3); cm([DT0 + 1, 2, GZ + 74, DT0, 28, GZ, 66], [DT0 + 1, 2, GZ + 68, DT0, 31, GZ, 64], L.k); sh(V(DT0, 0, GZ + 20), 80); }, [[0, 'rumble', .6], [.3, 'crowd_scream', .6], [1.0, 'boom', .5]]);
// 27 «Stahlpranke hielt die Brücke fest.»: en el río, el gigante ha partido el puente de una patada; Stahlpranke sostiene el tramo roto
shot(tw('Stahlpranke', 2), 'F', null, L => { use('BR'); day(); const g = giant(L, BRX - 4, -70, .2, { pose: { lRx: -.6, lRk: .2, aLz: .4, aRz: .4 } }); g.root.position.y = -4;
  const s = hover(stahl, BRX, -1.2, -18, PI * .3, L.T, { pose: { aLx: 3.0, aRx: 3.0, aLz: .25, aRz: .25, aLe: .3, aRe: .3, lLx: .4, lLk: .6 }, a: .1 }); effort(s, L.T); sweat(s, L.T);
  POST.push(() => { const h = hp(stahl); show(CHUNK, h.x, h.y + 2.4, h.z, 0, 1).rotation.z = .08 + Math.sin(L.T * 3) * .03; }); for (let i = 0; i < 3; i++) { const c = BG[i]; put(c, BRX - 4 + i * 4, 9.2 + flyY(L.T, .1), -18, .6); actuar(c, L.lt, [[0, 'hands_head']], { T: L.T + i }); cara(c, L.T + i, { expr: 'shock', mouth: 'scream' }); }
  splashW(V(BRX, -1.5, -18), L.T, .6); cm([BRX + 30, 4, -36, BRX, 6, -20, 54], [BRX + 26, 5, -34, BRX, 6, -20, 52], L.k); sh(V(BRX, 0, -10), 60); }, [[0, 'crash', .8], [.2, 'strain', .6], [.6, 'concrete_creak', .5], [1.2, 'splash', .4]]);
// 28 «Zack zog die Leute aus den Autos.»: Zack pasa como un rayo y deja a la gente a salvo en la acera; estela azul
shot(tw('Zack', 2), 'W', null, L => { city(); const x = DT0 - 8 + ((L.lt * 1.6) % 1) * 16; const z = GZ + 50; const c = put(zack, x, 0, z + Math.sin(L.T * 6) * 2, PI / 2); applyPose(c, runPoseL(L.T * 4)); grin(c, L.T); c.props.wind = 2;
  POST.push(() => trailOn(hp(c).add(V(0, -1.5, 0)), L.T, V(1, 0, 0), 8, 1.5)); for (let i = 0; i < 5; i++) { const p = BG[i]; const done = L.lt > .25 + i * .2; put(p, done ? DT0 + 14 + i * 1.2 : DT0 - 7.6 + (i % 2) * 15, done ? 0 : 1.2, z - 8 + i * 4, done ? -PI / 2 : 0); actuar(p, L.lt, [[0, done ? 'shock' : 'cower']], { T: L.T + i }); cara(p, L.T + i, { expr: 'shock', mouth: 'o' }); }
  giant(L, DT0, GZ - 10, 0); orbit(V(DT0, 3.5, z), lerp(24, 22, L.k), .6, .12, 50); sh(V(DT0, 0, z), 40); }, [[0, 'whoosh_big', .7], [.35, 'whoosh', .5], [.7, 'whoosh', .5], [1.1, 'whoosh', .4]]);
// 29 «Funkel schoss ihm Laser in die Brust,»: Funkel en el aire dispara los dos láseres al pecho del gigante
shot(tw('Funkel', 2), 'C', 'punch', L => { city(); const g = giant(L, DT0, GZ, 0, { walk: false, pose: { lean: -.12, aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: 1.3, aRe: 1.3 }, expr: 'shock', mouth: 'scream' });
  const f = hover(funkel, DT0 + 6, 26, GZ + 40, PI + .2, L.T, { pose: { aLz: .4, aRz: .4, lean: .2 } }); cara(f, L.T, { expr: 'determined', mouth: 'grimace' });
  const tgt = V(DT0, 30, GZ + 5); eyeLaser(f, tgt, L.T, 1.6); sparks(tgt, L.t0 + ((L.lt * 4) | 0) / 4, L.T, 14, 1.4); GLOW.position.copy(tgt); GLOW.color.setRGB(1, .3, .2); GLOW.intensity = 200;
  cm([DT0 + 14, 30, GZ + 66, DT0 + 2, 28, GZ + 10, 54], [DT0 + 12, 30, GZ + 60, DT0 + 2, 28, GZ + 10, 52], L.k); sh(V(DT0, 0, GZ + 20), 80); }, [[0, 'laser', .9], [.3, 'sizzle', .6], [.9, 'laser', .6]]);
// 30 «bis seine Rüstung rot glühte.»: primer plano del pecho de piedra: se pone al rojo vivo, humea
shot(tw('bis', 1), 'Z', null, L => { city(); const g = giant(L, DT0, GZ, 0, { walk: false, pose: { lean: -.12, aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: 1.3, aRe: 1.3 }, expr: 'shock', mouth: 'scream' });
  const k = clamp(L.lt / 1.2); gran.props.armor.forEach(m => { m.emissive.setRGB(1, .2, .05); m.emissiveIntensity = k * 1.4; }); gran.props.crack.emissiveIntensity = 1.2 + k * 3; smoke(V(DT0, 26, GZ + 8), L.T, 2.4);
  badge('red', 'ROT!', W / 2, H * .2, (L.lt - .9) * 3); cm([DT0 + 8, 26, GZ + 52, DT0, 28, GZ + 4, 48], [DT0 + 6, 27, GZ + 44, DT0, 28, GZ + 4, 46], L.k); sh(V(DT0, 0, GZ + 10), 60); }, [[0, 'sizzle', .8], [.5, 'heat_hiss', .6], [1.0, 'growl', .6]]);
// 31 «Und ich?»: el capitán flota tumbado más arriba, con los brazos cruzados, mirando de lado
shot(tw('Und', 5), 'S', null, L => { city(); const c = hover(ich, DT0 - 16, 40, GZ + 30, .6, L.T, { pose: { ...CROSS, lLx: .3, lLk: .5 } }); cara(c, L.T, { expr: 'bored', mouth: 'flat' }); giant(L, DT0, GZ, 0);
  onFace(c, 9, -.4, .3, 42); sh(V(DT0 - 16, 0, GZ + 30), 30); }, [[0, 'whoosh', .4], [.3, 'wind', .5], [.8, 'yawn', .5]]);
// 32 «Ich schwebte nur da und schaute zu.»: plano general: el capitán, pequeño, flota quieto en primer término; detrás, la batalla (láser, humo, el gigante)
shot(tw('Ich', 2), 'W', null, L => { city(); const c = hover(ich, DT0 - 10, 34, GZ + 60, PI + .2, L.T, { pose: CROSS }); cara(c, L.T, { expr: 'bored', mouth: 'flat' });
  const g = giant(L, DT0, GZ, 0, { pose: { lean: -.12, aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: 1.3, aRe: 1.3 } }); const f = hover(funkel, DT0 + 10, 30, GZ + 34, PI + .3, L.T); eyeLaser(f, V(DT0, 30, GZ + 5), L.T, 1.4); chaos(L, DT0 + 6, GZ + 20);
  cm([DT0 - 16, 38, GZ + 76, DT0 - 4, 30, GZ + 30, 54], [DT0 - 14, 37, GZ + 72, DT0 - 4, 30, GZ + 30, 52], L.k); sh(V(DT0, 0, GZ + 30), 80); }, [[0, 'laser', .5], [.4, 'explosion', .5], [1.1, 'wind', .4]]);
// 33 «Dabei hätte ich es in einer Sekunde beenden können.» (zoom lento): levanta un dedo hacia el gigante; «1 SEKUNDE»
shot(tw('Dabei', 2), 'C', 'slow', L => { city(); const c = hover(ich, DT0 - 10, 34, GZ + 60, PI - .1, L.T, { pose: { aRx: 1.7, aRe: .1, aRz: -.1, aLz: .2 } }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); giant(L, DT0, GZ, 0);
  badge('num', '1 SEKUNDE', W / 2, H * .17, (L.lt - .9) * 3); cm([DT0 - 18, 36, GZ + 74, DT0 - 10, 37, GZ + 58, 46], [DT0 - 14, 36.5, GZ + 70, DT0 - 10, 37, GZ + 58, 40], L.k); sh(V(DT0 - 10, 0, GZ + 60), 30); }, [[0, 'tick', .6], [.5, 'tick', .5], [1.0, 'tick', .5]]);
// 34 «Das ist wörtlich mein Name.»: primer plano con sonrisa torcida; el letrero dorado «SOFORT»
shot(tw('Das', 1), 'C', 'punch', L => { city(); const c = hover(ich, DT0 - 10, 34, GZ + 60, PI - .3, L.T, { pose: { aLz: .3, aRz: .3 } }); talk(c, L.T, L.t0, L.t1, 'smug');
  badge('gold', 'SOFORT', W / 2, H * .17, (L.lt - .6) * 3, 1, 1.2); onFace(c, 7, -.4, -.25, 40); sh(V(DT0 - 10, 0, GZ + 60), 30); }, [[0, 'impact', .5], [.6, 'ding', .5]]);
// 35 «Ich hatte nur keine Lust.»: tumbado en el aire con las manos detrás de la cabeza; zetas
shot(tw('Ich', 3), 'R', null, L => { city(); const c = put(ich, DT0 - 10, 34 + flyY(L.T, .3), GZ + 60, PI - .3); c.root.rotation.x = -1.2; actuar(c, L.lt, [[0, { aLx: 2.8, aRx: 2.8, aLe: 2.4, aRe: 2.4, lLx: .3, lRx: -.1, lRk: .6 }]], { T: L.T }); c.props.wind = .3;
  cara(c, L.T, { eyes: 'closed', mouth: 'smirk' }); POST.push(() => { const h = hp(c); ZZZ.visible = true; const k = (L.T * .6) % 1; ZZZ.position.copy(h).add(V(1 + k, 2 + k * 2, 0)); ZZZ.scale.setScalar(.8 + k); ZZZ.material.opacity = 1 - k; ZZZ.lookAt(camera.position); });
  orbit(V(DT0 - 10, 34.5, GZ + 60), lerp(12, 10, L.k), PI - .9, .45, 44); sh(V(DT0 - 10, 0, GZ + 60), 30); }, [[0, 'whoosh', .4], [.3, 'snore', .6]]);
// 36 «Deshalb dauerte es sieben Stunden.»: lapso de tiempo: el cielo pasa de día a atardecer; los héroes, agotados; «7 STUNDEN»
shot(tw('Deshalb'), 'F', null, L => { use('DT'); const k = clamp(L.lt / 1.6); if (k < .5) day(); else dusk(); const g = giant(L, DT0, GZ, 0, { pose: { lLx: Math.sin(L.T * 5) * .3, lRx: -Math.sin(L.T * 5) * .3, aLx: Math.sin(L.T * 6) * 1.2, aRx: -Math.sin(L.T * 6) * 1.2, aLz: .4, aRz: .4 } });
  const s = put(stahl, DT0 - 6, 0, GZ + 40, PI * .9), z = put(zack, DT0 + 5, 0, GZ + 42, PI); [s, z].forEach((h, i) => { actuar(h, L.lt, [[0, { lean: .5, aLx: .6, aRx: .6, aLe: .3, aRe: .3, crouch: .3, lLk: .4, lRk: .4 }]], { T: L.T + i }); sweat(h, L.T); cara(h, L.T + i, { expr: 'sad', mouth: 'open_smile' }); });
  badge('num', (1 + Math.floor(k * 6.99)) + ' STUNDEN', W / 2, H * .17, (L.lt) * 3); cm([DT0, 6, GZ + 64, DT0, 10, GZ + 20, 56], [DT0 + 2, 7, GZ + 60, DT0, 12, GZ + 20, 54], L.k); sh(V(DT0, 0, GZ + 30), 60); }, [[0, 'clock_fast', .7], [.8, 'clock_fast', .6], [1.4, 'ding', .5]]);
// 37 «Granitor entkam,»: el gigante se aleja entre el humo, de espaldas, hacia el horizonte
shot(tw('Granitor', 2), 'W', null, L => { city('dusk'); const g = giant(L, DT0, GZ - 40 - L.lt * 10, PI); smoke(V(DT0 - 4, 0, GZ - 10), L.T, 4);
  cm([DT0 + 4, 4, GZ + 40, DT0, 20, GZ - 40, 54], [DT0 + 3, 4, GZ + 36, DT0, 22, GZ - 50, 52], L.k); sh(V(DT0, 0, GZ - 30), 80); }, [[0, 'rumble', .6], [.4, 'boom', .4], [.9, 'boom', .3]]);
// 38 «und die halbe Stadt war kaputt.»: grúa sobre la avenida destrozada: coches volcados, fuego, escombros; «½ STADT»
shot(tw('und', 2), 'Z', null, L => { city('dusk'); chaos(L, DT0 - 4, GZ + 20); DEBRIS.forEach((d, i) => { const r = RNG(i * 7 + 3); d.visible = true; d.position.set(DT0 - 10 + r() * 20, .5, GZ + 6 + r() * 40); d.rotation.set(r() * 2, r() * 3, r()); });
  DT.CARS.slice(4, 8).forEach((c, i) => { c.rotation.z = i % 2 ? PI : .5; c.position.y = i % 2 ? 2.6 : .4; }); POST.push(() => DT.CARS.slice(4, 8).forEach((c, i) => { }));
  badge('red', '½ STADT KAPUTT', W / 2, H * .17, (L.lt - .4) * 3); cm([DT0 + 10, 16, GZ + 70, DT0, 4, GZ + 20, 52], [DT0 + 8, 26, GZ + 64, DT0, 4, GZ + 20, 52], L.k); sh(V(DT0, 0, GZ + 30), 60); }, [[0, 'fire', .6], [.4, 'siren', .5], [1.0, 'debris', .4]]);
