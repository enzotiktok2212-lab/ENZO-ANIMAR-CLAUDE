// ---------- a: gancho (supervillano, poder del polvo), avispas, la Liga der Supers (0 – 39,8 s) ----------
// atrezo propio de los planos
const FERRY = (() => { const g = new THREE.Group(); scene.add(g); const w = mat(0xf4f4f4, { roughness: .4 }), r = mat(0xd8323a, { roughness: .4 });
  box(10, 3, 30, w, 1, g, 0, 1.5, 0); box(10.2, .8, 30.2, r, .2, g, 0, .3, 0); box(8, 3.4, 16, w, .4, g, 0, 4.6, -2); box(6, 2.6, 8, w, .4, g, 0, 7.6, -4); cyl(1.2, 1.2, 4, r, 14, g, 0, 10.6, -6);
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) box(.1, 1, 1.6, mat(0x3a8ad8, { roughness: .1 }), .02, g, s * 4.02, 4.8, -8 + i * 2.6); const t = textPlane(8, 1.4, 400, 70, (c, ww, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, ww, h); txt2(c, 'FÄHRE 3', ww / 2, h / 2 + 3, 50, '#d8323a'); }, .2); t.position.set(5.06, 2, 4); t.rotation.y = PI / 2; g.add(t);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const DUCK = (() => { const g = new THREE.Group(); scene.add(g); const y = mat(0xffd21a, { roughness: .3 }); const b = sphere(3, y, g, 0, 2.6, 0, 20, 14); b.scale.set(1, .75, 1.3); sphere(1.8, y, g, 0, 5.4, 2.4, 18, 12); const bk = new THREE.Mesh(new THREE.ConeGeometry(.7, 1.6, 12), mat(0xff8a1a)); bk.rotation.x = PI / 2; bk.position.set(0, 5.2, 4.6); g.add(bk);
  for (const s of [-1, 1]) { sphere(.32, mat(0x101010), g, s * .8, 6, 3.8, 10, 8); sphere(.1, mat(0xffffff), g, s * .8 + .1, 6.15, 4.1, 6, 4); } const t = sphere(1, y, g, 0, 3.4, -3.8, 10, 8); t.scale.set(.8, .6, 1); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const CHUNK = (() => { const g = new THREE.Group(); scene.add(g); const st = mat(0xb8a888, { roughness: .9 }); box(16, 1.4, 12, st, .1, g, 0, 0, 0); box(16, .1, 10, mat(0x4a4e5a), 0, g, 0, .75, 0); for (const z of [-5.6, 5.6]) box(16, 2.4, .8, st, .1, g, 0, 1.6, z); for (let k = 0; k < 6; k++) box(.6 + (k % 2) * .4, 1, .6, st, .1, g, -8.4, -.4 + (k % 3) * .4, -5 + k * 2);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const PANEL = (() => { const s = new THREE.Group(); scene.add(s); const sc = fernseher(s); sc.scale.setScalar(1.4); s.userData.scr = sc.userData.scr; s.visible = false; PROPS.push(s); return s; })();
const LBAN = (() => { const p = textPlane(30, 8, 1200, 320, (c, w, h) => { c.fillStyle = '#141a3a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d9a531'; c.lineWidth = 16; c.strokeRect(8, 8, w - 16, h - 16); txt2(c, 'LIGA DER GRÖSSE', w / 2, h * .42, 150, '#ffd23f'); txt2(c, '⌛  KAPITÄN SOFORT  ⌛', w / 2, h * .78, 60, '#c89aff'); }, .6); scene.add(p); p.visible = false; PROPS.push(p); return p; })();
const flash = (L, a = .12) => { grade.uniforms.flash.value = Math.max(0, 1 - L.lt / a) * .9; };
const purple = (L, s = 1) => { TINT = `rgba(120,40,220,${(.12 + Math.sin(L.T * 12) * .04) * s})`; };
const DT0 = DTX;
const effort = (ch, T) => cara(ch, T, { expr: 'determined', mouth: Math.sin(T * 30) > 0 ? 'grimace' : 'open_smile' });
function splashW(c, T, k = 1) { TRL.forEach((m, i) => { const r = RNG(i * 5 + 2), t = (T * .8 + r()) % 1; m.visible = true; const a = r() * 6.283; m.position.set(c.x + Math.cos(a) * (3 + t * 6), c.y + Math.sin(t * PI) * 6 * k, c.z + Math.sin(a) * (3 + t * 6)); m.scale.setScalar(1.2 - t * .6); }); }

// 1 «In dieser Stadt bin ich der Superschurke.» (zoom lento): al atardecer, el capitán flota sobre la avenida llena de gente que mira hacia arriba; la cámara sube hacia él
shot(0, 'C', 'slow', L => { city('dusk'); const c = hover(ich, DT0, 14, -40, 0, L.T, { pose: { ...CROSS, lLx: .2, lRx: -.1, lLk: .4 } }); smug(c, L.T);
  crowdGrid(DT0, -34, 7, 8, 2.8, PI, 0, 0); stands(L.T, 'still', true);
  cm([DT0 + 2, 6, 12, DT0, 10, -40, 60], [DT0 + 1, 8, -2, DT0, 12, -40, 52], L.k, easeOut); sh(V(DT0, 0, -36), 60); }, [[0, 'zoom_fast', .9], [.1, 'wind', .5], [.6, 'whoosh', .3], [1.4, 'crowd_gasp', .4]]);
// 2 «Und gestern habe ich endlich die ganze Stadt übernommen.»: sobre el Rathaus de Hufenbach cuelga su bandera morada; él aterriza en el balcón con los brazos abiertos
shot(tw('Und', 1), 'R', null, L => { town('dusk'); const c = hover(ich, -6, 21 - easeOut(clamp(L.lt / .6)) * 4, -78, 0, L.T, { pose: { aLx: 1.6, aLz: 1.2, aRx: 1.6, aRz: 1.2, aLe: .1, aRe: .1 }, fly: .4 }); grin(c, L.T);
  show(LBAN, -6, 31, -82.6, 0, .55); crowdGrid(-6, -60, 10, 7, 3, PI, 0, 0); stands(L.T, 'still', true);
  cm([-6, 8, -12, -6, 14, -78, 58], [-6, 11, -30, -6, 17, -78, 50], L.k); sh(V(-6, 0, -70), 60); }, [[0, 'swoosh', .6], [.4, 'land', .5], [.9, 'crowd_murmur', .4], [1.6, 'bell', .3]]);
// 3 «Mein Name ist Kapitän Sofort.» golpe de zoom: primer plano frontal, la capa ondea, el nombre en dorado
shot(tw('Mein', 1), 'C', 'punch', L => { city('dusk'); const c = hover(ich, DT0, 8, -60, 0, L.T, { pose: { aLz: .3, aRz: .3, aRx: .3, aRe: .4 }, wind: 1.2 }); talk(c, L.T, L.t0, L.t1, 'smug', { mouth: kitLips(L.T, spoken(L.t0, L.t1)) || 'smirk' });
  badge('gold', 'KAPITÄN SOFORT', W / 2, H * .17, (L.lt - .55) * 3); onFace(c, 8, -.6, .25 - L.k * .3, 40); sh(V(DT0, 0, -60), 30); }, [[0, 'impact', .6], [.7, 'ding', .5], [1.2, 'wind', .3]]);
// 4 «Denn wenn ich entscheide, dass du weg bist,»: por la acera corre un ladrón con un saco; el capitán, de espaldas a cámara, lo señala con el dedo
shot(tw('Denn', 1), 'W', null, L => { city('dusk'); const d = put(dieb, DT0 + 16, 0, -40 - L.lt * 5, PI); applyPose(d, runPoseL(L.T * 1.8)); cara(d, L.T, { expr: 'smug', mouth: 'grin' });
  const c = hover(ich, DT0 + 4, 7, -6, faceTo(V(DT0 + 4, 0, -6), d.root.position), L.T, { pose: { ...GEST.point, lLx: .2, lLk: .4 }, a: .2 }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  folk(DT0 + 16, -46, 5, 6, 12, L.T, 4, { mode: 'mix' });
  cm([DT0 - 6, 9, 4, DT0 + 10, 5, -34, 48], [DT0 - 4, 8.5, 1, DT0 + 11, 5, -36, 46], L.k); sh(V(DT0 + 10, 0, -30), 40); }, [[0, 'whoosh', .5], [.2, 'footsteps_run', .5], [.9, 'point', .3]]);
// 5 «dann bist du weg.»: el ladrón en plano medio, mira atrás asustado… y desaparece: polvo
shot(tw('dann', 1), 'C', null, L => { city('dusk'); const d = put(dieb, DT0 + 16, 0, -48, PI * .9); actuar(d, L.lt, [[0, runPoseL(L.T * 1.8)], [.2, 'recoil', { dur: .15 }]], { T: L.T }); cara(d, L.T, { expr: 'shock', mouth: 'scream' });
  const gone = poof(d, tw('weg', 2) - .05, L.T, 0, 1); orbit(V(DT0 + 16, 3.8, -48), lerp(17, 15, L.k), PI * .9 + .5, .1, 44); sh(V(DT0 + 16, 0, -48), 30); }, [[0, 'gasp', .5], [tw('weg', 2) - tw('dann', 1) - .05, 'poof', .9]]);
// 6 «Sofort.» golpe: el montoncito de polvo humea en la acera; el saco cae al lado
shot(tw('Sofort', 2), 'F', 'punch', L => { city('dusk'); show(PILES[0], DT0 + 16, 0, -48, 0, 1.1); dust(V(DT0 + 16, 0, -48), L.t0 - .3, L.T, 8, .5); badge('red', 'SOFORT!', W / 2, H * .2, (L.lt - .1) * 3);
  orbit(V(DT0 + 16, 1.4, -48), lerp(9, 7, easeOut(L.k)), -1.2, .35, 42); sh(V(DT0 + 16, 0, -48), 20); }, [[0, 'boom', .7], [.2, 'sand', .4]]);
// 7 «Kein Blitz, kein Geräusch.»: travelling lateral: los peatones se quedan quietos mirando el polvo, en silencio
shot(tw('Kein', 1), 'S', null, L => { city('dusk'); show(PILES[0], DT0 + 16, 0, -48, 0, 1.1); const a = put(XT[3], DT0 + 12, 0, -52, -.6), b = put(K[1], DT0 + 19.5, 0, -53, .5), c = put(XT[1], DT0 + 13, 0, -43, PI - .6);
  [a, b, c].forEach((x, i) => { actuar(x, L.lt + i * .2, [[0, i === 1 ? 'hands_face' : 'shock']], { T: L.T }); cara(x, L.T + i, { expr: 'shock', mouth: 'o' }); });
  cm([DT0 + 21, 5, -34, DT0 + 15, 2.5, -49, 48], [DT0 + 20, 5, -31, DT0 + 15, 2.5, -49, 48], L.k); sh(V(DT0 + 16, 0, -48), 30); }, [[0, 'silence_hit', .5], [.6, 'wind', .3], [1.2, 'heartbeat', .4]]);
// 8 «Nur ein kleiner Haufen Staub,»: macro: los granitos de polvo aún resbalan por el montón
shot(tw('Nur', 1), 'Z', null, L => { city('dusk'); show(PILES[0], DT0 + 16, 0, -48, L.T * .05, 1.1); GRAIN.forEach((g, i) => { if (i > 14) return; const r = RNG(i + 4), k = (L.T * .5 + r()) % 1, a = r() * 6.283; g.visible = true; g.position.set(DT0 + 16 + Math.cos(a) * (.2 + k * 1.4), 1.4 - k * 1.3, -48 + Math.sin(a) * (.2 + k * 1.4)); });
  orbit(V(DT0 + 16, .8, -48), lerp(4.2, 3.4, L.k), -.3 + L.k * .4, .12, 40); sh(V(DT0 + 16, 0, -48), 12); }, [[0, 'sand', .6], [.8, 'sand', .4]]);
// 9 «genau da, wo du gerade noch standest.»: plano cenital: la silueta de tiza alrededor del montón; la gente da un rodeo
shot(tw('genau', 1), 'W', null, L => { city('dusk'); show(PILES[0], DT0 + 16, 0, -48, 0, 1.1); for (let i = 0; i < 3; i++) { const c = BG[i]; const z = -58 + i * 3 + L.lt * 4; put(c, DT0 + 13 + (Math.abs(z + 48) < 4 ? -2.5 : 0), 0, z, 0); applyPose(c, walkP(L.T * 1.4 + i)); cara(c, L.T + i, { expr: 'worried', mouth: 'flat' }); }
  cm([DT0 + 16, 22, -40, DT0 + 16, 0, -48.5, 46], [DT0 + 16, 17, -44, DT0 + 16, 0, -48.5, 46], L.k); sh(V(DT0 + 16, 0, -48), 30); }, [[0, 'whoosh', .4], [.4, 'footsteps', .4], [1.0, 'footsteps', .3]]);
// 10 «Als ich acht war,» (recuerdo, sepia): el pequeño capitán con toalla de capa en el jardín de casa
shot(tw('Als', 1), 'I', null, L => { town(); sepia(); const k = put(klein, 16, 0, 92, PI / 2 + .3); actuar(k, L.lt, [[0, 'idle'], [.3, 'cheer', { dur: .4 }]], { T: L.T }); grin(k, L.T); k.props.wind = .9;
  badge('num', '8 JAHRE', W / 2, H * .2, (L.lt - .2) * 3); orbit(V(16, 2.6, 92), lerp(11, 9, L.k), PI / 2 + .1, .15, 44); sh(V(14, 0, 94), 30); }, [[0, 'magic', .5], [.3, 'birds', .4], [.8, 'ding', .4]]);
// 11 «haben mich die Wespen genervt.»: una nube de avispas le rodea la cabeza; manotea y pone mala cara
shot(tw('haben', 1), 'C', null, L => { town(); sepia(); const k = put(klein, 16, 0, 92, PI / 2 + .3); actuar(k, L.lt, [[0, { aLx: 2 + Math.sin(L.T * 14) * .6, aRx: 2 - Math.sin(L.T * 14) * .6, aLe: 1, aRe: 1, headY: Math.sin(L.T * 9) * .3 }]], { T: L.T }); cara(k, L.T, { expr: 'angry', mouth: 'grimace' });
  wasps(hp(k), L.T, 12, 2.2, { s: 1.3 }); onFace(k, 9, -.6, -.2 + L.k * .3, 42); sh(V(16, 0, 92), 20); }, [[0, 'buzz', .8], [.6, 'swat', .5], [1.1, 'buzz', .6]]);
// 12 «Seitdem gibt es hier keine einzige Wespe mehr.» destello: cierra los ojos, las avispas se vuelven polvo y caen; el cartel «0 WESPEN»
shot(tw('Seitdem'), 'F', null, L => { town(); sepia(); const k = put(klein, 16, 0, 92, PI / 2 + .3); actuar(k, L.lt, [[0, 'cross']], { T: L.T }); cara(k, L.T, { eyes: L.lt < .6 ? 'closed' : 'happy', mouth: 'smirk' });
  if (L.lt < .4) wasps(hp(k), L.T, 12, 2.6, { s: .9 }); else GRAIN.forEach((g, i) => { if (i > 11) return; const r = RNG(i * 3 + 1), t = L.lt - .4; g.visible = true; const a = r() * 6.283; g.position.set(16 + Math.cos(a) * 2.4, Math.max(.1, 5 - t * t * 9), 92 + Math.sin(a) * 2.4); });
  badge('num', '0 WESPEN', W / 2, H * .2, (L.lt - .8) * 3); orbit(V(16, 3, 92), lerp(9, 11, L.k), PI / 2 + .5, .12, 44); sh(V(16, 0, 92), 20); }, [[0, 'magic', .5], [.4, 'poof', .6], [.9, 'ding', .5], [1.4, 'birds', .3]]);
// 13 «Dabei war ich früher ein Held.»: hace años, en la plaza: el capitán con traje de héroe saluda en un desfile; confeti
shot(tw('Dabei', 1), 'W', null, L => { town(); const c = put(ich, -6, 0, -20, 0); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); grin(c, L.T); confRain(V(-6, 0, -20), L.T, 50, 24, 20, 18);
  folk(-6, -20, 12, 7, 16, L.T, 13, { mode: 'cheer' }); orbit(V(-6, 4.6, -20), lerp(14, 11, L.k), .3 - L.k * .4, .1, 46); sh(V(-6, 0, -20), 30); }, [[0, 'cheer', .7], [.4, 'confetti', .4], [.9, 'fanfare', .4]]);
// 14 «In der Liga der Supers.»: grúa en la sala de la Liga: el letrero, la mesa redonda y los cinco sentados
const LIGA_SEATS = (L, ex = {}) => { const ppl = [stahl, zack, ich, funkel, alles]; ppl.forEach((c, i) => { const a = PI + (i - 2) * .5; const x = TRX + Math.sin(a) * 11.5, z = -2 + Math.cos(a) * 11.5; put(c, x, 1.75, z, a + PI); actuar(c, L.lt + i * .3, [[0, { ...SIT, ...(ex[i] || {}) }]], { T: L.T + i }); c.props.wind = .1; }); return ppl; };
shot(tw('In', 2), 'R', null, L => { use('TR'); inside(.9, 40); const ppl = LIGA_SEATS(L); ppl.forEach((c, i) => cara(c, L.T + i, { expr: 'smile' }));
  cm([TRX + 6, 17, 26, TRX, 4, -9, 50], [TRX + 2, 14, 22, TRX, 4, -10, 48], L.k); sh(V(TRX, 0, -2), 40); }, [[0, 'swoosh', .6], [.4, 'hum', .4], [1.0, 'chair', .3]]);
// 15 «Wir waren fünf.»: los cinco posan en fila sobre la azotea al atardecer, capas al viento; «5»
shot(tw('Wir'), 'Z', null, L => { city('dusk'); const ppl = [stahl, zack, ich, funkel, alles]; ppl.forEach((c, i) => { put(c, DT0 - 8 + i * 4, 0, -150 - Math.abs(i - 2) * 1.2, 0); actuar(c, L.lt + i * .2, [[0, ['fists', 'point', 'cross', 'fists', 'wave'][i]]], { T: L.T + i }); c.props.wind = 1.4; grin(c, L.T + i); });
  badge('num', '5', W / 2, H * .18, (L.lt - .3) * 3, 1, 1.3); orbit(V(DT0, 4.4, -151), lerp(20, 17, L.k), -.15 + L.k * .3, .06, 44); sh(V(DT0, 0, -150), 40); }, [[0, 'whoosh', .5], [.4, 'ding', .5], [.6, 'wind', .4]]);
// 16 «Stahlpranke hob ganze Fähren hoch.»: en el río, Stahlpranke levanta un ferry entero por encima de la cabeza
shot(tw('Stahlpranke', 1), 'C', null, L => { use('BR'); day(); const up = easeOut(clamp(L.lt / .8)); const s = hover(stahl, BRX, 4 + up * 6, -40, .2, L.T, { pose: { aLx: 3.0, aRx: 3.0, aLz: .3, aRz: .3, aLe: .2, aRe: .2 }, a: .2 }); effort(s, L.T);
  POST.push(() => { const h = hp(s); show(FERRY, h.x, h.y + 2.4, h.z, .2 + PI / 2, .6); }); splashW(V(BRX, -1.5, -40), L.T, up);
  orbit(V(BRX, 9 + up * 5, -40), lerp(46, 40, L.k), .5, .02, 50); sh(V(BRX, 0, -40), 50); }, [[0, 'splash', .7], [.3, 'strain', .5], [.8, 'water_drip', .4]]);
// 17 «Zack war der Schnellste der Welt.»: Zack cruza la avenida como un rayo dejando estela; los coches se quedan atrás
shot(tw('Zack', 1), 'W', null, L => { city(); const z = 40 - L.lt * 60; const c = put(zack, DT0 - 3, 0, z, PI); applyPose(c, runPoseL(L.T * 4)); c.props.wind = 2; grin(c, L.T);
  POST.push(() => trailOn(hp(c).add(V(0, -1.5, 0)), L.T, V(0, 0, -1), 8, 1.6)); confRain(V(DT0 - 3, 0, z + 4), L.T, 0);
  cam([DT0 + 3, 3, z - 16], [DT0 - 3, 3.4, z], 44); sh(V(DT0, 0, z), 30); }, [[0, 'whoosh_big', .8], [.4, 'wind', .5], [.9, 'car_pass', .3]]);
// 18 «Funkel schoss Laser aus den Augen.»: Funkel, en el aire, dispara dos láseres a una diana en la azotea; chispas
shot(tw('Funkel', 1), 'F', null, L => { city(); const f = hover(funkel, DT0 + 2, 12, -60, -.7, L.T, { pose: { aLz: .4, aRz: .4 } }); cara(f, L.T, { expr: 'determined', mouth: 'grimace' });
  const tgt = V(DT0 - 12, 6, -66); eyeLaser(f, tgt, L.T); sparks(tgt, L.t0 + ((L.lt * 3) | 0) / 3, L.T, 14, .6); GLOW.position.copy(tgt); GLOW.color.setRGB(1, .3, .2); GLOW.intensity = 60;
  cm([DT0 + 10, 13, -46, DT0 - 2, 10, -64, 48], [DT0 + 8, 12.5, -48, DT0 - 3, 10, -64, 46], L.k); sh(V(DT0, 0, -62), 30); }, [[0, 'laser', .8], [.4, 'sizzle', .5], [.9, 'laser', .5]]);
// 19 «Und Herr Alleskann»: el amable Herr Alleskann sonríe y toca un coche aparcado con un dedo
shot(tw('Und', 2), 'S', null, L => { city(); const a = put(alles, DT0 + 5, 0, -84, -PI / 2 + .3); actuar(a, L.lt, [[0, 'idle'], [.3, 'point', { dur: .4 }]], { T: L.T }); grin(a, L.T);
  orbit(V(DT0 + 3, 4.4, -84), lerp(14, 12, L.k), -.5 + L.k * .2, .1, 44); sh(V(DT0 + 3, 0, -84), 30); }, [[0, 'whoosh', .4], [.5, 'magic', .4]]);
// 20 «verwandelte alles in etwas anderes.»: ¡puf!: el coche se convierte en un pato de goma gigante; él se ríe
shot(tw('verwandelte'), 'C', 'punch', L => { city(); const a = put(alles, DT0 + 5, 0, -84, -PI / 2 + .3); actuar(a, L.lt, [[0, 'point'], [.6, 'cheer', { dur: .3 }]], { T: L.T }); laughF(a, L.T);
  const k = clamp((L.lt - .15) / .25); show(DUCK, DT0 + 1, 0, -84, PI / 2, .1 + k * .9); sparks(V(DT0 + 1, 3, -84), L.t0 + .15, L.T, 14, .8); confetti(V(DT0 + 1, -2, -84), L.t0 + .15, L.T, 30, .6);
  orbit(V(DT0 + 3, 4.4, -84), lerp(24, 21, L.k), -.6, .12, 46); sh(V(DT0 + 2, 0, -84), 30); }, [[0, 'magic', .7], [.2, 'squeak', .7], [.8, 'laugh', .4]]);
// 21 «Und ich?»: el capitán en la sala de la Liga, apoyado en la pared, se encoge de hombros, aburrido
shot(tw('Und', 3), 'Z', null, L => { use('TR'); inside(.9, 40); const c = put(ich, TRX + 18, 0, -12, -.8); actuar(c, L.lt, [[0, 'cross'], [.2, 'shrug', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'bored', mouth: 'flat' });
  onFace(c, 7, -.3, .2, 40, L.k, 6); sh(V(TRX + 18, 0, -12), 20); }, [[0, 'whoosh', .4], [.3, 'sigh', .5]]);
// 22 «Ich stand auf jedem Foto in der Mitte.»: foto de grupo en la plaza: los cinco posan, él en el centro; flashes de los fotógrafos
shot(tw('Ich', 1), 'F', null, L => { town(); const ppl = [stahl, zack, ich, funkel, alles]; ppl.forEach((c, i) => { put(c, -14 + i * 4, 0, -30 - Math.abs(i - 2) * .8, 0); actuar(c, L.lt, [[0, ['fists', 'point', 'cross', 'wave', 'cheer'][i]]], { T: L.T + i }); grin(c, L.T + i); });
  if (((L.lt * 4) | 0) % 2 === 0) grade.uniforms.flash.value = .5 * Math.max(0, 1 - ((L.lt * 4) % 1) * 4); for (let i = 0; i < 4; i++) { const c = BG[i], sx = i % 2 ? 1 : -1; put(c, -6 + sx * (10 + (i >> 1) * 3), 0, -20 - (i >> 1) * 2, faceTo(V(-6 + sx * 10, 0, -20), V(-6, 0, -30))); actuar(c, L.lt, [[0, 'phone_look']], { T: L.T + i }); cara(c, L.T + i, { expr: 'happy', mouth: 'smile' }); }
  badge('tag', 'MITTE', W / 2, H * .2, (L.lt - .8) * 3); cm([-6, 4.6, -6, -6, 4, -30, 42], [-6, 4.4, -10, -6, 4, -30, 40], L.k); sh(V(-6, 0, -28), 30); }, [[0, 'camera_shutter', .7], [.25, 'camera_shutter', .6], [.5, 'camera_shutter', .6], [.9, 'cheer', .4]]);
// 23 «Aber nur, weil ich der Stärkste war.»: en la pantalla de la Liga, la barra de fuerza del capitán se sale del gráfico
shot(tw('Aber', 1), 'W', null, L => { use('TR'); inside(.9, 40); const p = show(PANEL, TRX - 14, 0, -16, .5); p.position.y = 2; const k = clamp(L.lt / 1.2);
  tvDraw(p.userData.scr, 'bars' + Math.round(k * 20), (c, w, h) => { c.fillStyle = '#0e1430'; c.fillRect(0, 0, w, h); txt2(c, 'STÄRKE', w / 2, 34, 36, '#ffd23f'); const N = ['STAHL', 'ZACK', 'FUNKEL', 'ALLES', 'SOFORT'], V_ = [.55, .4, .5, .45, 1.6], C_ = ['#ff8a1a', '#1a6aff', '#d8202a', '#7ad8b8', '#8a3ad8'];
    N.forEach((n, i) => { const y = 80 + i * 48; txt2(c, n, 70, y + 14, 22, '#ffffff'); c.fillStyle = C_[i]; c.fillRect(130, y, Math.min(w - 140, (w - 160) * V_[i] * k), 30); }); });
  const c = put(ich, TRX - 6, 0, -8, .4); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); smug(c, L.T);
  cm([TRX + 2, 7.5, 12, TRX - 9, 5.5, -13, 50], [TRX + 1, 7.5, 9, TRX - 9, 5.5, -13, 48], L.k); sh(V(TRX - 10, 0, -12), 30); }, [[0, 'whoosh', .4], [.2, 'beep', .4], [.9, 'power_up', .6]]);
// 24 «Und weil sie Angst hatten, was ich sonst tun würde.»: él en primer término, aburrido; detrás los cuatro cuchichean y sudan
shot(tw('Und', 4), 'S', null, L => { use('TR'); inside(.9, 40); const c = put(ich, TRX + 2, 0, 17, PI * .05); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); cara(c, L.T, { expr: 'bored', mouth: 'flat' });
  LIGA.forEach((h, i) => { put(h, TRX - 6 + i * 3.6, 0, 9.5 - (i % 2), faceTo(V(TRX - 6 + i * 3.6, 0, 9), V(TRX + 2, 0, 17)) * .6); actuar(h, L.lt + i * .2, [[0, i % 2 ? 'hug_self' : 'lean_in']], { T: L.T + i }); cara(h, L.T + i, { expr: 'worried', mouth: 'wavy' }); if (i === 1) sweat(h, L.T); });
  cm([TRX + 4, 6.5, 30, TRX, 4.5, 12, 46], [TRX + 2, 6, 28, TRX - 1, 4.5, 11, 44], L.k); sh(V(TRX, 0, 0), 30); }, [[0, 'whoosh', .4], [.5, 'whisper', .5], [1.3, 'gulp', .5]]);
