// ---------- c: las tres verdades, la fiesta y el final (59,59 – 94,6 s) ----------
// Torre de la Kirche: centro (-106, ·, -6), cara +x en x = -99, balcón a y = 46, reloj a y = 52. Yo en el balcón mirando a +x.
const TWX = -98.3, TWY = 46.5, TWZ = -6;
const onTower = (L, pose, f = { expr: 'determined' }) => { const c = put(ich, TWX, TWY, TWZ, PI / 2); actuar(c, 0, [[0, pose]], { T: L.T }); c.blob.visible = false; cara(c, L.T, f); return c; };
const CUP = { aLx: 2.0, aRx: 2.0, aLz: -.5, aRz: -.5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.1 };
const shout = (L, a, b) => { const c = onTower(L, CUP, { eyes: 'angry', mouth: kitLips(L.T, spoken(a, b)) || 'talk_wide' }); return c; };
// 48 «Also bin ich auf den»: cruzo la plaza corriendo hacia la iglesia
shot(59.59, 'W', null, L => { town(L); const d = 9 * L.lt; const c = put(ich, -20 - d, Math.abs(Math.sin(L.T * 13)) * .3, -2, -PI / 2); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); floaters(L, FL().slice(0, 5), V(-30, 0, -10), 20, 26, 38, 17);
  const p = c.root.position; orbit(V(p.x, 5, p.z), 17, -PI / 2 - .55, .14, 46); sh(V(p.x, 0, p.z), 30); }, [[0, 'run_steps', .6]]);
// 49 «Kirchturm geklettert.»: trepo por la pared de la torre; grúa hacia arriba con el reloj encima
shot(60.31, 'Z', null, L => { town(L); const y = lerp(30, 40, L.k), cl = Math.sin(L.T * 8); const c = put(ich, TWX - .3, y, TWZ, -PI / 2); c.blob.visible = false; actuar(c, 0, [[0, { aLx: 2.8 + cl * .3, aRx: 2.8 - cl * .3, aLe: .4, aRe: .4, lLx: .8 + cl * .5, lRx: .8 - cl * .5, lLk: 1, lRk: 1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([TWX + 16, y - 2, TWZ + 8, TWX, y + 4, TWZ, 48], [TWX + 14, y + 2, TWZ + 6, TWX, y + 6, TWZ, 48], L.k); sh(V(TWX, y, TWZ), 30); }, [[0, 'climb', .6], [.6, 'wind', .4]]);
// 50 «„Herr Bürgermeister,»: en el balcón de la torre, grito con las manos en la boca; abajo la ciudad
shot(61.4, 'C', 'punch', L => { town(L); const c = shout(L, 61.4, 62.4); orb(L.k, hc(c).add(V(0, -1.4, 0)), null, [14, PI / 2 + .45, .05, 42], [12, PI / 2 + .3, .05, 42]); sh(V(TWX, TWY, TWZ), 26); }, [[0, 'shout', .5]]);
// 51 «bei Ihren Reden schlafen sogar die Tauben ein.“»: el alcalde flotando con tres palomas dormidas en la cabeza; «Zzz»
const MY = V(-44, 50, -8);
shot(62.44, 'S', null, L => { town(L); const c = flot(mayor, L, MY.x, MY.y, MY.z, -PI / 2 + .2, 3.6, 0, { expr: 'worried' }); const h = hc(c), top = h.y + 2.4;
  [[-1.6, 0], [0, .4], [1.6, -.2]].forEach(([dx, dz], i) => { const p = dove(i, h.x + dz, top + .1, h.z + dx, -PI / 2 + i * .4, L.T, 0); p.rotation.x = .2; }); badge3('big', 'Zzz', h.clone().add(V(0, 5.4, 0)), clamp(L.lt / .3), .7);
  orb(L.k, h.add(V(0, -.6, 0)), null, [22, -PI / 2 + .55, .05, 44], [19, -PI / 2 + .35, .05, 44]); sh(V(MY.x, MY.y - 6, MY.z), 30); }, [[0, 'snore', .6], [.6, 'coo', .4]]);
// 52 «Runter kam er.»: se le encoge la cabeza y cae hacia la plaza; las palomas salen volando
shot(64.58, 'F', null, L => { town(L); const k = clamp(L.lt / .3), f = easeIn(clamp((L.lt - .2) / .55)); const c = flot(mayor, L, MY.x, MY.y - f * 44, MY.z, -PI / 2 + .2, lerp(3.6, 1, k), 0, { f: { eyes: 'wide', mouth: 'scream' }, pose: { aLz: 2.4, aRz: 2.4 } });
  for (let i = 0; i < 3; i++) dove(i, MY.x + i * 2 + L.lt * 8, MY.y + 4 + L.lt * 10 + i, MY.z - 2 + i * 2, -PI / 2, L.T, 1);
  { const h = hc(c); cam([h.x + 15, h.y + 4 + L.k * 3, h.z + 17], [h.x, h.y - 2, h.z], 46); } sh(V(MY.x, 10, MY.z), 40); }, [[0, 'deflate', .7], [.25, 'fall_whistle', .6], [.3, 'wings_flap', .5]]);
// 53 «„Paketbote,»: grito otra vez desde la torre, ahora girado a la izquierda
shot(65.65, 'C', null, L => { town(L); const c = shout(L, 65.65, 66.4); c.root.rotation.y = PI / 2 + .4; orb(L.k, hc(c).add(V(0, -1.4, 0)), null, [13, PI / 2 + .9, .1, 42], [11.5, PI / 2 + .75, .08, 42]); sh(V(TWX, TWY, TWZ), 26); }, [[0, 'shout', .5]]);
// 54 «du gibst meine Pakete immer beim Nachbarn ab.“»: el repartidor flota con sus paquetes, pillado, sudando
const BY = V(-74, 48, 14);
shot(66.41, 'W', null, L => { town(L); const c = flot(bote, L, BY.x, BY.y, BY.z, -PI / 2 - .3, 3.4, 2, { f: { expr: 'worried', mouth: 'grimace' }, pose: { aLx: 1.2, aRx: 1.2, aLe: 1.4, aRe: 1.4, aLz: -.2, aRz: -.2 } }); sweat(c, L.T);
  const p = c.root.position; [0, 1, 2].forEach(i => show(PAK[i], p.x - 1.6, p.y + 2.6 + i * 1.6 + Math.sin(L.T * 2 + i) * .1, p.z + (i - 1) * .3, i * .3, .8)); show(PAK[3], p.x + .4, p.y + 1, p.z + 2.6, .4, .7);
  orb(L.k, hc(c).add(V(0, -2.4, 0)), null, [24, -PI / 2 - .7, .05, 44], [21, -PI / 2 - .5, .05, 44]); sh(V(BY.x, BY.y - 6, BY.z), 30); }, [[0, 'whoosh_soft', .4], [.6, 'gulp', .6]]);
// 55 «„Dreimal.“»: levanto tres dedos; «3×»
shot(68.53, 'C', 'punch', L => { town(L); const c = onTower(L, { aRx: 2.6, aRz: -.1, aRe: .4, aLx: .5, aLe: 1.4, headX: -.05 }, { expr: 'angry', mouth: L.T < 69 ? 'talk_wide' : 'flat' }); orb(L.k, hc(c).add(V(0, -1.2, 0)), null, [12, PI / 2 + .1, .03, 40], [10.5, PI / 2 + .2, .03, 40]);
  bigNum('3×', clamp(L.lt / .15), 'red', .1, 1.4); sh(V(TWX, TWY, TWZ), 26); }, [[0, 'impact_soft', .6]]);
// 56 «Runter kam er.»: el repartidor se deshincha y cae sobre el techo de su furgoneta; los paquetes rebotan
shot(69.31, 'F', null, L => { town(L); show(VAN, 26, 0, VZ, 0); const k = clamp(L.lt / .45); const y = lerp(30, 7.3, easeIn(k)); const c = put(bote, 26, y, VZ - 1, .3); kopf(c, lerp(3.4, 1, clamp(L.lt / .25))); c.blob.visible = false;
  actuar(c, 0, [[0, k < 1 ? { aLz: 2.4, aRz: 2.4, lLx: .3 } : { aLz: .3, aRz: .3, crouch: .25 * Math.exp(-(L.lt - .45) * 6), lLk: .4, lRk: .4 }]], { T: L.T, weight: false }); cara(c, L.T, k < 1 ? { eyes: 'wide', mouth: 'scream' } : { eyes: 'squint', mouth: 'wavy' });
  [0, 1, 2].forEach(i => { const t = Math.max(0, L.lt - .45 - i * .05); show(PAK[i], 26 + (i - 1) * 3, 7.2 + Math.max(0, 5 * t - 14 * t * t) + (k < 1 ? 30 * (1 - easeIn(k)) + 2 : 0), VZ + 2 + i, i, .8); });
  orb(L.k, V(26, 7, VZ), null, [26, .5, .22, 46], [23, .4, .2, 46]); sh(V(26, 0, VZ), 30); }, [[0, 'deflate', .6], [.45, 'metal_thud', .9], [.55, 'box_drop', .5]]);
// 57 «„Oma, dein Kartoffelsalat»: Oma flota orgullosa con su ensalada de patatas
const OY = V(-72, 46, -26);
shot(70.26, 'S', null, L => { town(L); const c = flot(oma, L, OY.x, OY.y, OY.z, -PI / 2 + .5, 3.2, 3, { f: { expr: 'happy' }, pose: { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2, aLz: -.25, aRz: -.25 } }); const h = hc(c), p = c.root.position;
  const d = V(Math.sin(c.root.rotation.y), 0, Math.cos(c.root.rotation.y)); show(SALAT, p.x + d.x * 2.6, p.y + 2.6, p.z + d.z * 2.6, 0, 1.1);
  orb(L.k, h.add(V(0, -2.6, 0)), null, [22, -PI / 2 + .9, .05, 44], [19, -PI / 2 + .7, .05, 44]); sh(V(OY.x, OY.y - 6, OY.z), 30); }, [[0, 'whoosh_soft', .4]]);
// 58 «schmeckt nach Radiergummi.“»: Oma se ofende, boca abierta; la ensalada se le inclina
shot(71.5, 'C', 'punch', L => { town(L); const c = flot(oma, L, OY.x, OY.y, OY.z, -PI / 2 + .5, 3.2, 3, { f: { eyes: 'wide', mouth: 'grimace_wide' }, pose: { aLx: 1.1, aRx: 1.1, aLe: 1.2, aRe: 1.2, lean: -.12 } }); const p = c.root.position;
  const d = V(Math.sin(c.root.rotation.y), 0, Math.cos(c.root.rotation.y)); const s = show(SALAT, p.x + d.x * 2.6, p.y + 2.4, p.z + d.z * 2.6, 0, 1.1); s.rotation.z = .5;
  fcam(c, 20, L.k, 17, .1, -2.2, 42); bigNum('RADIERGUMMI?!', clamp((L.lt - .3) / .2), 'red', .1, .8); sh(V(OY.x, OY.y - 6, OY.z), 30); }, [[0, 'gasp', .6], [.3, 'record_scratch', .5]]);
// 59 «Sie kam so schnell runter,»: cae en picado hasta el césped de su jardín: ¡BUM! nube de polvo
shot(73.01, 'Z', null, L => { town(L); const k = clamp(L.lt / .5); const c = put(oma, -30, (1 - easeIn(k)) * 40, 12, PI / 2); kopf(c, lerp(3.2, 1, clamp(L.lt / .2))); actuar(c, 0, [[0, k < 1 ? { aLz: 2.6, aRz: 2.6 } : { aLz: .4, aRz: .4, crouch: .3 * Math.exp(-(L.lt - .5) * 6) }]], { T: L.T, weight: false }); cara(c, L.T, k < 1 ? { eyes: 'terror', mouth: 'scream' } : { eyes: 'squint', mouth: 'grimace' });
  if (k >= 1) dust(V(-30, 0, 12), L.t0 + .5, L.T, 16, 1.2); orb(L.k, V(-30, 4, 12), null, [22, PI / 2 + .3, .12, 46], [19, PI / 2 + .1, .1, 46]); sh(V(-30, 0, 12), 30); }, [[0, 'fall_whistle', .6], [.5, 'boom', .9]]);
// 60 «dass sie heute noch sauer auf mich ist.»: Oma con los brazos cruzados me fulmina con la mirada; yo sonrío nervioso
shot(74.61, 'W', null, L => { town(L); const o = put(oma, -30, 0, 12, PI / 2 - .45); actuar(o, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.75, aRz: -.75, aLe: 1.7, aRe: 1.7, headY: Math.sin(L.T * 2) * .1 }]], { T: L.T }); cara(o, L.T, { expr: 'angry' });
  const c = put(ich, -24, 0, 13, -PI / 2 + .55); actuar(c, 0, [[0, { aRx: 2.2, aRz: .2, aRe: 1.2, headZ: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'grimace' }); sweat(c, L.T, 1);
  orb(L.k, V(-27, 5, 13.5), null, [21, .1, .12, 44], [18, .25, .12, 44]); sh(V(-27, 0, 14), 26); bigNum('HEUTE NOCH', clamp((L.lt - .3) / .2), 'gold', .1, .8); }, [[0, 'grumble', .6]]);
// 61 «Einer nach dem anderen»: los vecinos caen uno tras otro en la plaza (cabezas que se deshinchan)
shot(76.22, 'S', null, L => { town(L); FL().forEach((c, i) => { const t0 = i * .08, k = clamp((L.lt - t0) / .4); const r = RNG(i * 3 + 1); const x = (r() - .5) * 26, z = PZ - 8 + (r() - .5) * 16; put(c, x, (1 - easeIn(k)) * (30 + r() * 10), z, r() * 6.28); kopf(c, k < 1 ? lerp(3, 1, k) : 1); c.blob.visible = k >= 1;
    actuar(c, 0, [[0, k < 1 ? floatP(L.T, i) : { crouch: .25 * Math.exp(-(L.lt - t0 - .4) * 6) }]], { T: L.T, weight: false }); cara(c, L.T, k < 1 ? { eyes: 'wide', mouth: 'o' } : { expr: 'relief' }); });
  cm([10, 14, PZ + 40, 0, 16, PZ - 8, 54], [8, 11, PZ + 36, 0, 12, PZ - 8, 54], L.k); sh(V(0, 0, PZ - 8), 40); }, [[0, 'thud', .5], [.3, 'thud', .5], [.6, 'thud', .5]]);
// 62 «landete die ganze Stadt.»: toda la ciudad en el suelo, celebrando; me rodean
shot(77.08, 'F', null, L => { town(L); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, 'cheer']], { T: L.T }); laughF(c, L.T);
  extras(L, FL(), [[-6, PZ - 4, .5], [6, PZ - 5, -.5], [-11, PZ - 9, .4], [11, PZ - 10, -.4], [-3, PZ - 12, .1], [3, PZ - 13, -.1], [-15, PZ - 2, .9], [15, PZ - 1, -.9], [-8, PZ - 17, .3], [8, PZ - 18, -.3], [0, PZ - 20, 0]], 'cheer');
  orb(L.k, V(0, 6, PZ - 6), null, [30, 0, .22, 46], [25, .1, .2, 46]); sh(V(0, 0, PZ - 8), 34); }, [[0, 'crowd_cheer', .7]]);
// fiesta de noche en la plaza: guirnaldas de luces, gorros de fiesta, globos
const partyNight = L => { town(L, { night: true, z: PZ - 10 }); show(LICHT, 0, 0, PZ - 6, 0, 1); show(BALL, -12, 0, PZ - 8, 0, 1.6); show(BALL2, 12, 0, PZ - 10, 0, 1.6); };
const hats = (list) => list.forEach(c => { const i = POOL.indexOf(c); if (i >= 0) HATS[i].visible = true; });
// 63 «An dem Abend hat mir die ganze Stadt eine Party»: plaza de noche con luces; la ciudad entera me aplaude
shot(78.55, 'B', null, L => { partyNight(L); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, { aRx: 2.8, aRz: .4, aRe: .2, aLx: 2.8, aLz: .4, aLe: .2 }]], { T: L.T }); laughF(c, L.T);
  const L_ = FL(); extras(L, L_, [[-6, PZ - 4, .5], [6, PZ - 5, -.5], [-11, PZ - 9, .4], [11, PZ - 10, -.4], [-3, PZ - 12, .1], [3, PZ - 13, -.1], [-15, PZ - 2, .9], [15, PZ - 1, -.9], [-8, PZ - 17, .3], [8, PZ - 18, -.3], [0, PZ - 20, 0]], ['clap', 'cheer']); hats([ich, ...L_]);
  cm([0, 14, PZ + 30, 0, 6, PZ - 6, 46], [0, 9, PZ + 22, 0, 6, PZ - 6, 46], L.k); sh(V(0, 0, PZ - 8), 34); }, [[0, 'party_horn', .6], [.3, 'crowd_cheer', .6]]);
// 64 «eine Party geschmissen.»: confeti, gente bailando a mi alrededor; órbita
shot(80.17, 'C', null, L => { partyNight(L); const c = put(ich, 0, 0, PZ, .2); actuar(c, 0, [[0, 'cheer']], { T: L.T }); laughF(c, L.T); const L_ = FL().slice(0, 6); extras(L, L_, [[-6, PZ - 3, .6], [6, PZ - 4, -.6], [-9, PZ - 9, .4], [9, PZ - 9, -.4], [-3, PZ - 12, .1], [3, PZ - 12, -.1]], 'cheer'); hats([ich, ...L_]);
  confetti(V(0, 4, PZ - 4), L.t0, L.T, 40, 1.2); orb(L.k, V(0, 6, PZ - 4), null, [20, -.5, .14, 44], [18, .3, .14, 44]); sh(V(0, 0, PZ - 4), 30); }, [[0, 'confetti_pop', .7]]);
// 65 «Mit Haribo bis unter die Decke.»: en la sala de fiestas, una montaña de ositos y bolsas de Haribo hasta el techo; yo encima
shot(81.38, 'Z', null, L => { party(L); show(BERG, SAX, 0, -2, 0, 1.6); HAR.forEach((h, i) => show(h, SAX - 10 + (i % 3) * 10 + (i > 2 ? 5 : 0), i > 2 ? 4 : .2, 4 + (i > 2 ? -6 : 0), (i - 2) * .3, 1.4));
  SA.DB.visible = false; const c = put(ich, SAX, 5.6, 1, 0); actuar(c, 0, [[0, 'cheer']], { T: L.T }); laughF(c, L.T); hats([ich]); cm([SAX + 4, 4, 26, SAX, 6, -2, 50], [SAX + 2, 7, 23, SAX, 9, -2, 50], L.k); }, [[0, 'whoosh_up', .5], [.3, 'candy_rustle', .6]]);
// 66 «Dann sagte Jonas:»: Jonas se acerca entre la gente de la fiesta
shot(82.94, 'W', null, L => { partyNight(L); const c = put(ich, 2.4, 0, PZ, -.4); actuar(c, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); const j = walk(jonas, L, -6, PZ - 2, 1.1, 2.4, 1, { expr: 'happy' }); hats([ich, jonas]);
  extras(L, EXS.slice(0, 4), [[-10, PZ - 12, .3], [8, PZ - 12, -.3], [-2, PZ - 16, 0], [14, PZ - 6, -.8]], 'cheer'); { const p = j.root.position; orb(L.k, V((p.x + 2.4) / 2, 5, PZ - 1), null, [30, 0, .12, 46], [26, 0, .12, 46]); } sh(V(0, 0, PZ), 30); }, [[0, 'steps', .4]]);
// 67 «„Digga, du bist der coolste Typ»: Jonas me pone el pulgar arriba; bocadillo
shot(83.75, 'C', 'punch', L => { partyNight(L); const j = put(jonas, -2.2, 0, PZ, .5); actuar(j, 0, [[0, { aRx: 1.7, aRz: -.2, aRe: 1.2, aLx: .6, aLz: .5, aLe: .5 }]], { T: L.T }); talk(j, L.T, 83.75, 86.1, 'happy'); hats([jonas]);
  fcam(j, 12, L.k, 10, .1, -1.4, 40); bubble(j, 'COOLSTER TYP!', clamp((L.lt - .7) / .2), 2.2); sh(V(0, 0, PZ), 26); }, [[0, 'whoosh_soft', .4]]);
// 68 «der Stadt.“»: yo, halagado, me sonrojo con una sonrisa enorme
shot(84.91, 'S', null, L => { partyNight(L); const c = put(ich, 2.4, 0, PZ, -.4); actuar(c, 0, [[0, { aRx: 2.4, aRz: .3, aRe: 1.9, headZ: .12, aLx: .2 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'grin', blush: 1 }); hats([ich]);
  fcam(c, 10, L.k, 8.5, -.1, -1.1, 40); sh(V(0, 0, PZ), 26); }, [[0, 'aww', .5], [.3, 'sparkle', .4]]);
// 69 «Und ich konnte nicht anders.»: me aguanto: mofletes hinchados, tiemblo y sudo (zoom lento)
shot(86.39, 'Z', 'slow', L => { partyNight(L); const c = put(ich, 2.4, 0, PZ, -.2); actuar(c, 0, [[0, { aLx: .4, aRx: .4, aLe: 1.5, aRe: 1.5, ...shiver(L.T, 4 + L.k * 6) }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grimace', blush: 1 }); sweat(c, L.T); hats([ich]);
  fcam(c, 11, L.k, 7.5, 0, -1, 40); sh(V(0, 0, PZ), 26); }, []);
// 70 «HUSS!»: ¡HUSS! y mi cabeza se infla de golpe (1 → 4,5)
shot(88.07, 'F', 'punch', L => { partyNight(L); const c = put(ich, 2.4, 0, PZ, -.2); hussPose(c, L); kopf(c, pop(1, 4.5, L.lt / .3)); hussFX(L, 0, .1, 1.1); hats([ich]);
  extras(L, EXS.slice(0, 3), [[-6, PZ - 6, .4], [9, PZ - 8, -.4], [-1, PZ - 12, 0]], 'shock'); fcam(c, 24, L.k, 22, 0, -2.8, 44); sh(V(0, 0, PZ), 30); }, [[0, 'huss', 1], [.03, 'balloon_inflate', .9]]);
// 71 «Mein Kopf schoss durch die Wolken.»: mi cabeza gigante sube atravesando el mar de nubes
shot(88.61, 'W', null, L => { sky_(L, { night: true }); const y = lerp(-34, 4, easeOut(clamp(L.lt / 1.3))); const c = put(ich, WKX, y, -60, 0); kopf(c, 9); c.blob.visible = false; actuar(c, 0, [[0, { aLz: .3, aRz: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'wide', mouth: 'open_smile' });
  cm([WKX + 18, 34, -14, WKX, 12, -60, 50], [WKX + 14, 38, -20, WKX, 16, -60, 50], L.k); }, [[0, 'whoosh_up', .8], [.3, 'rocket', .5]]);
// 72 «Und jetzt traut sich in der ganzen Stadt keiner mehr,»: la gente en la plaza de noche mira al cielo en silencio, tapándose la boca
shot(90.4, 'S', null, L => { town(L, { night: true }); const L_ = [...FL(), ...KIDS]; extras(L, L_, [[-6, PZ - 2, .3], [5, PZ - 3, -.3], [-11, PZ - 8, .2], [10, PZ - 9, -.2], [-2, PZ - 11, 0], [3, PZ - 14, 0], [-15, PZ - 4, .6], [14, PZ - 2, -.6], [-8, PZ - 16, .2], [8, PZ - 17, -.2], [0, PZ - 20, 0], [-4, PZ + 3, .1], [4, PZ + 3, -.1], [-13, PZ + 2, .4], [13, PZ + 2, -.4]], 'idle');
  L_.forEach((c, i) => { actuar(c, 0, [[0, { aRx: 2.2, aRz: -.2, aRe: 2.2, headX: -.5 }]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'flat' }); });
  cm([0, 6, PZ + 26, 0, 7, PZ - 6, 50], [0, 6, PZ + 22, 0, 8, PZ - 6, 50], L.k); sh(V(0, 0, PZ - 6), 34); }, [[0, 'crickets', .6]]);
// 73 «mir die Wahrheit zu sagen.»: yo por encima de las nubes, sonrisa chulesca bajo la luna; la cámara se aleja despacio
shot(92.0, 'F', null, L => { sky_(L, { night: true }); const c = put(ich, WKX, 4, -60, 0); kopf(c, 9); c.blob.visible = false; actuar(c, 0, [[0, {}]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  const h = hc(c); orb(L.k, h.add(V(0, -1, 0)), null, [36, .15, .1, 46], [54, .3, .2, 46], easeOut); }, [[0, 'wind', .5], [.5, 'ding_reveal', .4]]);
