// ---------- b: flotar, el alcalde, la ventana, el bastoncillo, la verdad (29,40 – 59,59 s) ----------
// gente flotando sobre los tejados alrededor de c (cabezas 2,6–4,2)
function floaters(L, list, c, r = 30, y0 = 30, y1 = 55, seed = 3) { const rr = RNG(seed); list.forEach((ch, i) => { const a = rr() * 6.283, d = 6 + rr() * r; flot(ch, L, c.x + Math.cos(a) * d, y0 + rr() * (y1 - y0), c.z + Math.sin(a) * d * .6, rr() * 6.28, 2.6 + rr() * 1.6, i, { expr: ['happy', 'shock', 'worried', 'joy'][i % 4] }); }); }
const FL = () => [...EXS.slice(0, 8), ...VEC.slice(1, 4)];
// 27 «Wenn dein Kopf zu groß wird,»: a un vecino se le hincha la cabeza (2,4 → 4) y se pone de puntillas
shot(29.4, 'S', null, L => { town(L); const c = put(VEC[3], 0, 0, PZ, 0); const k = clamp(L.lt / 1.3); kopf(c, lerp(2.4, 4, easeInOut(k))); c.root.position.y = k * .5; actuar(c, 0, [[0, { aLz: .4 + k * .4, aRz: .4 + k * .4, lLx: -.1 * k, lRx: .1 * k, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'o' });
  extras(L, EXS.slice(8, 10), [[-12, PZ - 10, .4], [12, PZ - 12, -.4]], 'point', { heads: [2.2, 2.6] }); fcam(c, 24, L.k, 21, .2, -2.6, 44); sh(V(0, 0, PZ), 30); }, [[0, 'balloon_inflate', .7], [.6, 'creak', .4]]);
// 28 «fängst du an zu schweben.»: despega del suelo y sube; la cámara le sigue hacia arriba con los tejados detrás
shot(30.92, 'W', null, L => { town(L); const y = easeIn(clamp(L.lt / 1.1)) * 9; const c = flot(VEC[3], L, 0, y, PZ, 0, 4, 0, { expr: 'shock' }); c.root.position.y = y;
  extras(L, EXS.slice(8, 10), [[-12, PZ - 10, .4], [12, PZ - 12, -.4]], 'shock', { heads: [2.2, 2.6] }); cm([0, 6, PZ + 26, 0, 9, PZ, 46], [0, 15, PZ + 24, 0, 16, PZ, 46], L.k); sh(V(0, 0, PZ), 32); }, [[0, 'whoosh_up', .6], [.3, 'crowd_gasp', .4]]);
// Freibad (FBX): atril en z = 19 mirando a +z, cinta roja en z = 24, el público en z 30–38 mirando a -z; piscina detrás del alcalde
const PUB = (L, mode = 'clap', heads = [2.2, 1.8, 2.6, 2, 2.8, 2.4]) => extras(L, EXS.slice(0, 6), [[FBX - 9, 31, PI + .3], [FBX - 3, 33, PI + .1], [FBX + 3, 32, PI - .1], [FBX + 9, 31, PI - .3], [FBX - 6, 38, PI], [FBX + 6, 38, PI]], mode, { heads });
// 29 «Der Bürgermeister hat gehusst,»: el alcalde da su discurso en el atril del Freibad nuevo; el público aplaude
shot(32.22, 'Z', null, L => { pool(L); const c = put(mayor, FBX, .4, 16.6, 0); actuar(c, 0, [[0, { aRx: 1.3 + Math.sin(L.T * 4) * .3, aRz: -.2, aRe: .9, aLx: .7, aLe: 1.2 }]], { T: L.T }); talk(c, L.T, 30, 40, 'happy');
  PUB(L); orb(L.k, V(FBX, 7, 18), null, [30, .35, .32, 44], [25, .2, .3, 44]); sh(V(FBX, 0, 22), 36); bigNum('NEUES FREIBAD', clamp((L.lt - .2) / .2), 'gold', .12, .8); }, [[0, 'crowd_applause', .5], [.2, 'mic_feedback', .3]]);
// 30 «als er das neue Freibad eröffnet hat.»: baja con las tijeras gigantes y corta la cinta roja: ¡CLIC!
shot(33.46, 'C', null, L => { pool(L); const c = put(mayor, FBX - 1.5, .4, 22.2, 0); const k = clamp((L.lt - .7) / .2); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.1, aRe: .6 - k * .4, lean: .15, headX: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  attach(SCHERE, c.aR.hand, [0, -.8, .8], [PI / 2, 0, 0], 1); const r = BAND.userData.ribbon; r.visible = k < 1; BAND.userData.bow.visible = k < 1;
  PUB(L, 'cheer'); orb(L.k, V(FBX - 1, 5.5, 23), null, [18, 1.25, .12, 44], [15, 1.1, .12, 44]); sh(V(FBX, 0, 24), 30); }, [[.7, 'scissors', .8], [.8, 'crowd_cheer', .5]]);
// 31 «HUSS!»: de la emoción, ¡HUSS! y la cabeza del alcalde se infla (1 → 3,6)
shot(35.21, 'F', 'punch', L => { pool(L); const c = put(mayor, FBX, .4, 16.6, 0); hussPose(c, L); kopf(c, pop(1, 3.6, L.lt / .3)); hussFX(L, 0, .1, 1);
  PUB(L, 'shock'); fcam(c, 26, L.k, 23, .15, -1, 44, .3); sh(V(FBX, 0, 20), 34); }, [[0, 'huss', 1], [.03, 'balloon_inflate', .8]]);
// 32 «Und ist direkt vom Rednerpult weggeflogen.»: sale volando del atril hacia el cielo; el público señala hacia arriba
shot(35.76, 'W', null, L => { pool(L); const y = .4 + easeIn(clamp(L.lt / 1.7)) * 22; const c = flot(mayor, L, FBX, y, 16.6, 0, 3.6, 0, { expr: 'shock' }); c.root.position.y = y;
  PUB(L, 'point'); cm([FBX + 6, 5, 52, FBX, 8, 16, 48], [FBX + 4, 9, 48, FBX, 19, 16, 48], L.k); sh(V(FBX, 0, 24), 40); }, [[0, 'whoosh_up', .7], [.4, 'crowd_gasp', .5], [1, 'balloon_squeak', .4]]);
// 33 «Bis Sonntag»: contrapicado desde la plaza: cabezas gigantes flotando entre los tejados; «SONNTAG»
shot(37.86, 'S', null, L => { town(L); floaters(L, FL(), V(0, 0, 10), 26, 22, 44, 5); cm([6, 3, 64, 0, 30, 0, 50], [2, 3, 58, 0, 34, 0, 50], L.k); bigNum('SONNTAG', clamp((L.lt - .1) / .2), 'gold', .12, 1); sh(V(0, 0, 20), 60); }, [[0, 'whoosh_soft', .4], [.2, 'church_bell', .5]]);
// 34 «schwebte die halbe Stadt über den Dächern.»: plano aéreo sobre los tejados de Hufenbach con la media ciudad flotando
shot(39.04, 'Z', null, L => { town(L); floaters(L, FL(), V(-10, 0, 0), 40, 34, 52, 9); floaters(L, [mayor, bote, ...KIDS.slice(0, 2)], V(10, 0, -20), 30, 36, 50, 11);
  cm([60, 70, 80, -6, 30, -6, 50], [50, 62, 66, -6, 32, -6, 50], L.k); sh(V(0, 0, -6), 80); }, [[0, 'wind', .5], [.5, 'birds', .4]]);
// fachada con mi ventana (FNX): hueco x ∈ [-4, 4], y ∈ [8, 15]; yo dentro en z = -3 mirando a +z; fuera flota la gente en z ≈ +4
const ME_IN = (L, f = { expr: 'happy' }, pose = { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }) => { const c = put(ich, FNX, 7.8, -2.6, 0); actuar(c, 0, [[0, pose]], { T: L.T }); cara(c, L.T, f); return c; };
// 35 «Oma schwebte an meinem Fenster vorbei.»: Oma (cabeza enorme) pasa flotando por delante de mi ventana; yo la miro asombrado
shot(41.07, 'W', null, L => { window_(L); ME_IN(L, { expr: 'gasp' }); flot(oma, L, FNX + lerp(-10, 6, L.k), 6.4, 5, PI / 2 - .4, 2.6, 0, { expr: 'happy' });
  cm([FNX + 6, 13, 34, FNX, 13, 0, 46], [FNX + 3, 13, 30, FNX, 13, 0, 46], L.k); sh(V(FNX, 0, 2), 30); }, [[0, 'whoosh_soft', .5], [.4, 'wind', .4]]);
// 36 «Mit ihrer Gießkanne.»: riega las flores de mi jardinera con la regadera verde
shot(43.08, 'C', null, L => { window_(L); ME_IN(L, { expr: 'happy' }); const c = flot(oma, L, FNX + 3, 6, 4.6, -.5, 2.6, 0, { expr: 'happy', pose: { aRx: 1.4, aRz: .2, aRe: .4, aLx: .3 } }); attach(KANNE, c.aR.hand, [0, -.8, .5], [0, PI / 2, .5 + Math.sin(L.T * 3) * .1], .8);
  orb(L.k, V(FNX + 1.5, 11.5, 2), null, [18, -.3, .08, 44], [15, -.15, .08, 44]); sh(V(FNX, 0, 2), 28); }, [[0, 'water_pour', .6]]);
// 37 «Sie hat gewinkt.»: me saluda con la mano; yo le devuelvo el saludo desde la ventana
shot(44.18, 'F', null, L => { window_(L); ME_IN(L, { expr: 'happy', mouth: 'open_smile' }, { aRx: 2.8, aRz: .3 + Math.sin(L.T * 10) * .3, aRe: .3, aLx: .3 }); const c = flot(oma, L, FNX + 3.6, 6, 5, -.55, 2.6, 0, { f: { expr: 'joy' }, pose: { aLx: 2.8, aLz: -.3 - Math.sin(L.T * 10) * .3, aLe: .3 } });
  orb(L.k, V(FNX + 1.5, 12, 2), null, [16, .35, .06, 42], [14, .2, .06, 42]); sh(V(FNX, 0, 2), 28); }, [[0, 'pling', .4]]);
// 38 «Dann kam Jonas angeschwebt und fragte mich:»: Jonas llega flotando de lado con la cabeza gigante
shot(44.98, 'S', null, L => { window_(L); ME_IN(L, { expr: 'neutral' }); flot(jonas, L, FNX + lerp(14, 4.6, easeOut(L.k)), 6.2, 5, -.45, 4, 1, { expr: 'happy' });
  orb(L.k, V(FNX + 5, 12.5, 4), null, [28, .3, .08, 46], [24, .15, .08, 46]); sh(V(FNX, 0, 2), 30); }, [[0, 'whoosh_in', .6]]);
// 39 «„Seh ich cool aus?“»: posa con gafas de sol imaginarias, sacando pecho
shot(47.23, 'C', 'punch', L => { window_(L); const c = flot(jonas, L, FNX + 4.6, 6.2, 5, -.5, 4, 1, { pose: { aRx: 2.6, aRz: -.3, aRe: 1.9, aLz: .6, lean: -.1 } }); talk(c, L.T, 47.23, 48, 'smug');
  fcam(c, 22, L.k, 19, .1, -2.4, 42); sh(V(FNX, 0, 2), 30); bigNum('COOL?', clamp((L.lt - .2) / .2), 'gold', .1, .9); }, [[0, 'pose', .5]]);
// 40 «Ich sagte: „Nein.“»: yo, serio, desde la ventana: «NEIN»
shot(48.17, 'W', null, L => { window_(L); const c = ME_IN(L, { expr: 'bored' }, { aRx: 1.1, aRz: -.3, aRe: 1.2, aLx: .4, headY: L.T > 48.92 ? Math.sin(L.T * 11) * .2 : 0 }); talk(c, L.T, 48.9, 49.2, 'bored');
  orb(L.k, hc(c).add(V(0, -1, 0)), null, [12, 0, .04, 40], [10.5, .1, .04, 40]); bigNum('NEIN.', clamp((L.T - 48.92) / .15), 'red', .12, 1); sh(V(FNX, 0, 0), 26); }, [[.75, 'buzzer', .5]]);
// 41 «Du siehst aus wie ein Wattestäbchen.»: junto a Jonas aparece un bastoncillo gigante con su misma silueta
shot(49.41, 'Z', null, L => { window_(L); const c = flot(jonas, L, FNX + 2.2, 6.2, 5, 0, 4, 1, { expr: 'shock' }); const k = clamp((L.lt - .5) / .3); const st = show(STAB, FNX + 8, 13.5 + Math.sin(L.T * 1.3 + 1) * .5, 5, 0, 1.75 * spring(k)); st.rotation.z = .08;
  orb(L.k, V(FNX + 5, 12.5, 5), null, [30, 0, .06, 44], [27, .05, .06, 44]); sh(V(FNX, 0, 2), 30); }, [[.5, 'pop', .6], [.7, 'boing', .5]]);
// 42 «Sein Kopf schrumpfte.»: la cabeza se le deshincha (4 → 1) silbando como un globo
shot(51.03, 'C', 'punch', L => { window_(L); const k = easeInOut(clamp(L.lt / .9)); const c = flot(jonas, L, FNX + 3.2, 6.2 - k * .5, 5, -.3, lerp(4, 1, k), 1, { f: { eyes: 'wide', mouth: 'o' } }); c.head.rotation.z = Math.sin(L.T * 30) * .1 * (1 - k);
  orb(L.k, V(FNX + 3, 11, 5), null, [22, -.2, .08, 44], [18, -.1, .08, 44]); sh(V(FNX, 0, 2), 30); }, [[0, 'deflate', .9]]);
// 43 «Und er fiel direkt in seine Turnschuhe.»: cae al césped de la plaza justo dentro de sus zapatillas: ¡PLOF!
shot(52.66, 'F', null, L => { town(L); const k = clamp(L.lt / .7); const c = put(jonas, 0, (1 - easeIn(k)) * 26, PZ, .1); actuar(c, 0, [[0, k < 1 ? { aLz: 2.4, aRz: 2.4, lLx: .3, lRx: -.2 } : { aLz: .2, aRz: .2, lLk: .3, lRk: .3, crouch: .2 * Math.exp(-(L.lt - .7) * 6) }]], { T: L.T, weight: false }); cara(c, L.T, k < 1 ? { eyes: 'wide', mouth: 'scream' } : { eyes: 'squint', mouth: 'wavy' });
  show(SCHUHE, 0, 0, PZ + .4, .1, 1); if (k >= 1) dust(V(0, 0, PZ + 2), L.t0 + .7, L.T, 8, .35); extras(L, EXS.slice(9, 11), [[-9, PZ - 6, .5], [9, PZ - 8, -.5]], 'point', { heads: [2.6, 3] });
  orb(L.k, V(0, 4.6, PZ), null, [17, .2, .14, 44], [15, .1, .12, 44]); sh(V(0, 0, PZ), 28); }, [[0, 'fall_whistle', .6], [.7, 'thud', .9], [.75, 'shoe_squeak', .5]]);
// 44 «Da hab ich es kapiert.»: en mi ventana se me enciende una bombilla encima de la cabeza
shot(54.77, 'Z', 'punch', L => { window_(L); const c = ME_IN(L, { expr: 'gasp' }, { aRx: 2.4, aRz: .1, aRe: 1.6, aLx: .3 }); const h = hc(c); const k = clamp(L.lt / .2); show(BULB, h.x, h.y + 2.6 + Math.sin(L.T * 4) * .1, h.z, 0, .9 * spring(k));
  orb(L.k, h.add(V(0, .2, 0)), null, [13, -.15, .05, 40], [11, 0, .05, 40]); sh(V(FNX, 0, 0), 26); }, [[0, 'ding_idea', .8]]);
// 45 «Nur eine Sache macht»: en la plaza, miro hacia arriba a la gente flotando; la cámara sube por detrás de mí
shot(55.69, 'S', null, L => { town(L); const c = put(ich, 0, 0, PZ, PI); actuar(c, 0, [[0, { headX: -.45, aRx: .5, aRe: .9 }]], { T: L.T }); cara(c, L.T, { expr: 'think' });
  floaters(L, FL(), V(0, 0, 0), 24, 20, 40, 13); cm([7, 4, PZ + 12, 0, 18, PZ - 10, 50], [5, 6, PZ + 10, 0, 22, PZ - 14, 50], L.k); sh(V(0, 0, PZ - 6), 40); }, [[0, 'whoosh_soft', .4], [.4, 'wind', .3]]);
// 46 «einen großen Kopf wieder klein.»: Jonas, ya con la cabeza normal y sus zapatillas, me sonríe aliviado; al fondo los demás siguen flotando
shot(57.16, 'W', null, L => { town(L); const j = put(jonas, -2.4, 0, PZ, .45); actuar(j, 0, [[0, { aRx: 2.7, aRz: .2, aRe: .3 }]], { T: L.T }); cara(j, L.T, { expr: 'relief' }); show(SCHUHE, -2.4, 0, PZ + .4, .45, 1);
  const c = put(ich, 2.6, 0, PZ + 1, -.5); actuar(c, 0, [[0, { aLx: .4, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); floaters(L, FL().slice(0, 6), V(0, 0, PZ - 30), 20, 24, 36, 15);
  orb(L.k, V(0, 5, PZ), null, [17, -.3, .14, 44], [15, -.15, .12, 44]); sh(V(0, 0, PZ), 30); bigNum('KLEIN', clamp((L.lt - .7) / .2), 'green', .12, .9); }, [[.1, 'pling', .4]]);
// 47 «Die Wahrheit.»: primer plano decidido, zoom lento; «DIE WAHRHEIT» en dorado
shot(58.76, 'C', 'slow', L => { town(L); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLe: 1.6, aRe: 1.6, aLz: .2, aRz: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  fcam(c, 11, L.k, 8.5, 0, -.9, 40); bigNum('DIE WAHRHEIT', clamp(L.lt / .15), 'gold', .1, .9); sh(V(0, 0, PZ), 26); }, []);
