// ---------- b: todos se aprovechan de mí, el Oldtimer y la fábrica (58,89 – 94,67 s) ----------
// Aula (X = 2200): pupitres en x ∈ {-11, 0, 11}, z ∈ {-2, 6, 14}; pizarra en z = -15,5. Patio del colegio (X = 8600): puerta en (0, -24), patio z > -20.
// Sótano (X = 3000): 36 × 40, techo a 14. Barrio (X = 3800): carretera en x ∈ [-8, 8], aceras en ±10, casas en x = ±27.
// Halswerk (X = 4600): valla y puerta en z = 8, fachada en z = -30.
const KX = 2200, SUX_ = 8600, KEX_ = 3000, BAX_ = 3800, FAX_ = 4600, HAX_ = 5600;
const jaB = (c, k, dy = 1.4) => bubble(c, 'JA!', k, dy);
const sitDesk = (c, L, pose = {}) => sit(c, KX, 2.4, 8.8, Math.PI, L, { aLx: 1.2, aRx: 1.2, aLe: .6, aRe: .6, ...pose });
{ const tag = textPlane(1.6, .7, 160, 70, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 12); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.stroke(); ntxt(c, 'HALSWERK', w / 2, h / 2 + 2, 24, '#1a1a1a'); }); tag.position.set(0, -1.4, .05); KEYS.add(tag); }
// lluvia de espuma al lavar el coche
function foam(c, T, n = 14, r = 2.4) { FOAMP.forEach((f, i) => { if (i >= n) return; const rr = RNG(i * 7 + 3), k = (T * .6 + rr()) % 1; f.visible = true; f.position.set(c.x + (rr() - .5) * r * 2, c.y + (rr() - .3) * 1.4 + k * .6, c.z + (rr() - .5) * r); f.scale.setScalar((.25 + rr() * .35) * (1 - k * .5)); }); }
// anillo rojo dibujado alrededor de un personaje (2D)
const ring2D = (ch, k, r = 170) => FX2D.push(cx => { if (k <= 0) return; const [x, y, z] = proj(hp(ch).add(V(0, .7 * sc_(ch), 0))); if (z >= 1) return; cx.save(); cx.strokeStyle = '#ff2a3a'; cx.lineWidth = 16; cx.lineCap = 'round'; cx.beginPath(); cx.arc(x, y, r * U, -1.6, -1.6 + 6.4 * clamp(k)); cx.stroke(); cx.restore(); });

// 43 «„Machst du meine Hausaufgaben?“»: en clase, un compañero de cuello largo le deja a Luca una torre de cuadernos en el pupitre
shot(58.89, 'W', null, L => { klasseS(L); sitDesk(luca, L); cara(luca, L.T, { expr: 'happy', mouth: 'smile' }); show(BOOKS, KX - .6, 3.75, 6.2, .1, 1.1);
  const p = put(CR[6], KX - 4.2, 0, 4, 1.2); neck(p, 9, L.T, { bend: .7 }); actuar(p, L.lt, [[0, { aRx: 1.3, aRe: .4, aRz: -.2, aLx: .3 }]], { T: L.T }); talk(p, L.T, L.t0, L.t1, 'smug');
  [[KX - 11, -2], [KX + 11, -2], [KX - 11, 6], [KX + 11, 6]].forEach(([x, z], i) => { const c = CR[10 + i]; sit(c, x, 2.4, z + 2.8, Math.PI, L, { aLx: 1.2, aRx: 1.2, aLe: .6, aRe: .6 }); neck(c, [4, 12, 7, 16][i], L.T, { bend: .2 }); cara(c, L.T, { expr: 'neutral' }); });
  cm([KX + 2, 8, -6, KX - 1, 5.5, 7, 46], [KX + 1.5, 7.6, -4, KX - 1, 5.5, 7, 44], L.k); sh(V(KX, 0, 4), 25); }, [[0, 'whoosh_soft', .4], [.1, 'classroom', .4], [.6, 'book_drop', .5], [.65, 'paper_slap', .5]]);
// 44 «Ja!»: Luca levanta el pulgar sonriendo detrás de la torre de cuadernos
shot(60.24, 'C', 'punch', L => { klasseS(L); sitDesk(luca, L, { aRx: 1.6, aRe: 1.6, aRz: -.3 }); cara(luca, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' }); show(BOOKS, KX - .6, 3.75, 6.2, .1, 1.1); jaB(luca, L.lt * 6);
  onFace(luca, 7, 0, 0, 40, L.k); sh(V(KX, 0, 6), 20); }, [[0, 'pop', .5], [.05, 'ding_good', .4]]);
// 45 «„Krieg ich dein Pausenbrot?“»: en el patio, Marco (chaqueta azul con «M») alarga la mano hacia el Brezel de Luca
shot(60.85, 'S', null, L => { schuleS(L); const c = put(luca, SUX_ - 3, 0, 2, .7); attach(BROT, c.aR.hand, [0, -.8, .4], [0, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: 1.1, aRe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  const m = put(marco, SUX_ + 3.6, 0, 3, -1.8); neck(m, 3.5, L.T); actuar(m, L.lt, [[0, { aRx: lerp(.4, 1.4, clamp(L.lt * 2)), aRe: .3, aLx: .2 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'smug');
  crowdAt(L, SUX_, -8, 6, 10, 22, 45, { mode: 'talk', from: 0, neck: i => [3, 9, 5, 14, 2, 7][i] });
  orbit(V(SUX_ + .3, 5, 2.5), lerp(19, 17, L.k), .1, .08, 46); sh(V(SUX_, 0, 2), 30); }, [[0, 'swipe', .4], [.1, 'kids_chatter', .4]]);
// 46 «Ja!»: Luca se lo da sonriendo; Marco se lo arrebata
shot(62.11, 'C', null, L => { schuleS(L); const c = put(luca, SUX_ - 3, 0, 2, .7); actuar(c, L.lt, [[0, { aRx: 1.4, aRe: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); jaB(c, L.lt * 6);
  const m = put(marco, SUX_ + 3.6, 0, 3, -1.8); neck(m, 3.5, L.T); attach(BROT, m.aR.hand, [0, -.8, .4], [0, 0, 0], 1); actuar(m, L.lt, [[0, { aRx: 1.0, aRe: .9 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'grin' });
  orbit(V(SUX_ + .3, 5.2, 2.5), 16, -.1, .08, 44); sh(V(SUX_, 0, 2), 25); }, [[0, 'grab', .5], [.05, 'cloth', .4]]);
// 47 «Das war Marco.»: Marco, de cerca, muerde el Brezel con chulería; etiqueta «MARCO»
shot(62.75, 'Z', 'punch', L => { schuleS(L); const m = put(marco, SUX_, 0, 2, 0); neck(m, 3.5, L.T); attach(BROT, m.aR.hand, [0, -.8, .4], [0, 0, 0], 1); actuar(m, L.lt, [[0, { aRx: 2.0, aRe: 1.6, aRz: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: Math.sin(L.T * 14) > 0 ? 'o' : 'grin' });
  badge('tag', 'MARCO', W / 2, H * .2, (L.lt - .15) * 4, 1, 1.2); onFace(m, 8, -1, 0, 42, L.k); sh(V(SUX_, 0, 2), 20); }, [[0, 'impact_soft', .4], [.1, 'munch', .6]]);
// 48 «Merk ihn dir.» (zoom lento): un círculo rojo se dibuja alrededor de Marco; la viñeta se cierra
shot(63.8, null, 'slow', L => { schuleS(L); const m = put(marco, SUX_, 0, 2, 0); neck(m, 3.5, L.T); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'grin' }); ring2D(m, (L.lt - .05) * 2.2, 200);
  onFace(m, lerp(9, 7, easeIn(L.k)), -1, 0, 42); sh(V(SUX_, 0, 2), 20); }, [[0, 'marker', .5], [.2, 'tension_hit', .4]]);
// 49 «Er kommt noch zurück.»: Marco se aleja por el patio, se gira y sonríe de lado; tono oscuro
shot(64.5, 'B', null, L => { schuleS(L); const m = put(marco, SUX_, 0, lerp(4, -6, L.k), Math.PI); actuar(m, L.lt, [[0, walkP(L.T, 2)]], { T: L.T }); m.root.rotation.y = Math.PI; m.head.rotation.y = 2.4; cara(m, L.T, { expr: 'smug', mouth: 'grin', eyes: 'squint' }); neck(m, 3.5, L.T); m.head.rotation.y += Math.PI - .5;
  TINT = 'rgba(30,10,40,.25)'; cm([SUX_ + 3, 5, 16, SUX_, 5, lerp(2, -6, L.k), 44], [SUX_ + 2, 5, 14, SUX_, 5, lerp(2, -6, L.k), 44], L.k); sh(V(SUX_, 0, -2), 25); }, [[0, 'steps', .4], [.3, 'evil_laugh', .4], [.6, 'tension_low', .4]]);
// 50 «„Räumst du meinen ganzen Keller auf?“»: en un sótano lleno de trastos, la vecina asoma la cabeza por la escalera con el cuello doblado bajo el techo
shot(65.6, 'W', null, L => { kellerS(L); const c = put(luca, KEX_ + 2, 0, 4, -.4); attach(BROOM, c.aR.hand, [0, -.4, .3], [.3, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: .8, aRe: .6, aLx: .7, aLe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  const v = put(CR[9], KEX_ - 10, 0, -6, .8); neck(v, 16, L.T, { bend: 1.4, sway: .02 }); talk(v, L.T, L.t0, L.t1, 'happy'); actuar(v, L.lt, [[0, 'point']], { T: L.T });
  for (let i = 0; i < 6; i++) { const b = DUST[i]; b.visible = true; b.material.opacity = .5; b.position.set(KEX_ - 4 + i * 2.2, 1 + (i % 2), 2 + (i % 3)); b.scale.setScalar(1.2 + (i % 3) * .4); }
  cm([KEX_ + 4, 7, 18, KEX_ - 2, 6.5, -1, 48], [KEX_ + 3.5, 7, 16, KEX_ - 2, 6.5, -1, 46], L.k); sh(V(KEX_, 0, 0), 25); }, [[0, 'door_creak', .4], [.2, 'cave_drip', .3], [.6, 'hello_f', .3]]);
// 51 «Ja!»: Luca barre con energía, polvo por todas partes
shot(67.45, 'C', 'punch', L => { kellerS(L); const c = put(luca, KEX_ + 2, 0, 4, -.4); attach(BROOM, c.aR.hand, [0, -.4, .3], [.3 + Math.sin(L.T * 16) * .5, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: .8 + Math.sin(L.T * 16) * .3, aRe: .6, aLx: .7, aLe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' }); jaB(c, L.lt * 6);
  dust(V(KEX_ + 2, 0, 5.5), L.t0, L.T, 12, 1.2); onBody(c, 13, -.2, .1, 44, L.k); sh(V(KEX_, 0, 2), 20); }, [[0, 'brush', .6], [.1, 'dust_puff', .5]]);
// 52 «Jeder nutzt mich aus.»: en la plaza, tres vecinos le cuelgan bolsas y cajas a Luca, que se tambalea
shot(68.0, 'S', null, L => { town(L); const c = put(luca, 0, 0, 2, 0); actuar(c, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: 1.0, aRe: 1.0, crouch: .12 + Math.sin(L.T * 7) * .04, lean: Math.sin(L.T * 3) * .06 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  attach(BOOKS, c.aL.hand, [.9, -.5, .9], [0, 0, 0], 1); [[-5, 3, .9], [5, 4, -1.0], [0, -4, 0]].forEach(([x, z, r], i) => { const p = put(CR[i + 24], x, 0, z, r); neck(p, [8, 14, 20][i], L.T, { bend: .4 }); actuar(p, L.lt, [[0, { aRx: 1.4, aRe: .3 }]], { T: L.T }); cara(p, L.T, { expr: 'happy', mouth: 'open_smile' }); });
  onBody(c, 18, .25, .12, 48, L.k); sh(V(0, 0, 2), 25); }, [[0, 'swipe', .4], [.2, 'box_drop', .5], [.7, 'strain', .5]]);
// 53 «Weil ich immer Ja sage.»: Luca asiente sin parar; «JA!» «JA!» «JA!» a su alrededor
shot(69.28, 'F', null, L => { town(L); const c = put(luca, 0, 0, 4, 0); actuar(c, L.lt, [[0, { aRx: 1.6, aRe: 1.6, aRz: -.2 }]], { T: L.T }); nod(c, L.T, 1); cara(c, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' });
  [.05, .35, .7].forEach((t, i) => badge('green', 'JA!', W * [.25, .75, .5][i], H * [.3, .26, .16][i], (L.lt - t) * 5, 1, .9));
  onBody(c, 14, 0, .1, 44, L.k); sh(V(0, 0, 4), 25); }, [[.05, 'pop', .5], [.35, 'pop', .5], [.7, 'pop', .5]]);
// 54 «Bis zu dem Tag, der alles verändert hat.» (zoom lento): amanecer sobre el barrio; Luca, de espaldas, mira el sol que sale
shot(70.64, 'B', 'slow', L => { barrioS(L); dusk(); setSky([.2, .36, .8], [.9, .6, .5], [1, .8, .5]); const c = put(luca, BAX_, 0, 10, Math.PI); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'neutral' });
  cm([BAX_ + 2, 5, 24, BAX_, 8, -60, 46], [BAX_ + 1.4, 5, 19, BAX_, 9, -60, 44], easeIn(L.k)); sh(V(BAX_, 0, 0), 40); }, [[0, 'birds_morning', .5], [.3, 'sunrise_shine', .4]]);
// 55 «Während ich das Auto vom Nachbarn wasche,»: Luca lava con una esponja el Porsche rojo de Vogt; espuma y cubo
shot(72.83, 'W', null, L => { barrioS(L); show(PORSCHE, BAX_ + 12, 0, -4, -.6); const c = put(luca, BAX_ + 7.6, 0, -.6, 2.2); attach(SPONGE, c.aR.hand, [0, -.8, .3], [0, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: 1.2 + Math.sin(L.T * 9) * .3, aRz: Math.cos(L.T * 9) * .3, aRe: .5, aLx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  show(BUCKET, BAX_ + 6, 0, 2.4, 0); foam(V(BAX_ + 10.4, 2.6, -2.4), L.T, 16, 2.6);
  orbit(V(BAX_ + 9.6, 3.6, -1.6), lerp(20, 17, L.k), -.9, .12, 46); sh(V(BAX_ + 10, 0, -2), 25); }, [[0, 'whoosh_soft', .4], [.1, 'water_slosh', .5], [.6, 'squeak', .4], [1.0, 'bubbles', .4]]);
// 56 «hält neben mir ein goldener Oldtimer.»: un Oldtimer dorado llega por la calle y frena junto a Luca; destellos
shot(74.69, 'S', null, L => { barrioS(L); show(PORSCHE, BAX_ + 12, 0, -4, -.6); const c = put(luca, BAX_ + 7.6, 0, -.6, 2.2); c.root.rotation.y = lerp(2.2, -1.9, easeInOut(clamp((L.lt - .6) / .5))); attach(SPONGE, c.aR.hand, [0, -.8, .3], [0, 0, 0], 1); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: L.lt > 1 ? 'shock' : 'happy', mouth: L.lt > 1 ? 'o' : 'smile' });
  const z = lerp(-60, 2, easeOut(clamp(L.lt / 1.3))); show(OLD, BAX_ + 2, 0, z, 0); SPARK.forEach((s, i) => { if (i > 6) return; const k = (L.T * 1.6 + i / 7) % 1; s.visible = true; s.position.set(BAX_ + 2 + [-2, 2, 0, -1.5, 1.6, 0, 2.4][i], [3, 4, 5, 2.2, 2.6, 3.4, 4.4][i], z + [4, -2, 0, 6, 2, -4, 3][i]); s.scale.setScalar(Math.sin(k * Math.PI) * 1.6); });
  cm([BAX_ + 14, 6, 16, BAX_ + 3, 3, lerp(-20, 0, easeOut(clamp(L.lt / 1.3))), 46], [BAX_ + 13, 6, 15, BAX_ + 3, 3, 0, 44], L.k); sh(V(BAX_ + 4, 0, 0), 30); }, [[0, 'engine', .6], [.4, 'honk', .4], [1.1, 'brakes_squeak', .6], [1.3, 'sparkle', .5]]);
// 57 «Ein seltsamer alter Mann steigt aus.» (zoom lento): Herr Kranich baja del coche con su bastón dorado y su sombrero
shot(76.58, 'F', 'slow', L => { barrioS(L); show(OLD, BAX_ + 2, 0, 2, 0); const k = put(kranich, BAX_ - .8, 0, lerp(2, 5, easeOut(clamp(L.lt / .8))), .5); attach(CANE, k.aR.hand, [0, -1.6, .3], [0, 0, 0], 1); actuar(k, L.lt, [[0, walkP(L.T * .5, 0)], [.8, 'idle', { dur: .3 }]], { T: L.T }); cara(k, L.T, { expr: 'sus', mouth: 'smile', eyes: 'squint' }); neck(k, 1, L.T);
  orbit(V(BAX_ - .6, 4.8, 4.4), lerp(17, 12, easeIn(L.k)), .7, .1, 44); sh(V(BAX_, 0, 3), 25); }, [[0, 'truck_door', .5], [.4, 'cane_tap', .5], [.9, 'cane_tap', .5], [1.2, 'mystery', .4]]);
// 58 «„Hey, Junge.“»: Kranich se quita el sombrero y saluda; detrás, el Oldtimer
shot(78.7, 'C', null, L => { barrioS(L); show(OLD, BAX_ + 2, 0, 2, 0); const k = put(kranich, BAX_ - .8, 0, 5, .9); attach(CANE, k.aL.hand, [0, -1.6, .3], [0, 0, 0], 1); actuar(k, L.lt, [[0, 'wave']], { T: L.T }); talk(k, L.T, L.t0, L.t1, 'happy'); neck(k, 1, L.T);
  onFace(k, 9, -.5, .6, 42, L.k); sh(V(BAX_, 0, 4), 20); }, [[0, 'thump', .3], [.05, 'hey', .4]]);
// 59 «„Willst du meine Firma haben?“»: Kranich señala a Luca con el bastón; Luca, sorprendido, con la esponja aún en la mano
shot(79.61, 'W', null, L => { barrioS(L); show(OLD, BAX_ + 2, 0, 2, 0); const k = put(kranich, BAX_ - .8, 0, 5, .9); attach(CANE, k.aR.hand, [0, -1.6, .3], [1.3, 0, 0], 1); actuar(k, L.lt, [[0, { aRx: 1.5, aRe: .1, aLx: .2 }]], { T: L.T }); talk(k, L.T, L.t0, L.t1, 'sus'); neck(k, 1, L.T);
  const c = put(luca, BAX_ + 6, 0, 7, -1.9); attach(SPONGE, c.aR.hand, [0, -.8, .3], [0, 0, 0], 1); actuar(c, L.lt, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  orbit(V(BAX_ + 2.6, 4.8, 6), lerp(20, 18, L.k), -.1 + PI, .1, 46); sh(V(BAX_ + 2, 0, 6), 25); }, [[0, 'whoosh_soft', .4], [.4, 'question', .4]]);
// 60 «Natürlich sage ich: Ja!»: Luca da un salto de alegría: «JA!»
shot(80.88, 'C', 'punch', L => { barrioS(L); const c = put(luca, BAX_ + 6, Math.max(0, Math.sin(clamp((L.lt - .8) / .5) * PI) * 2.5), 7, -1.9); actuar(c, L.lt, [[0, 'idle'], [.8, 'cheer', { dur: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' }); jaB(c, (L.lt - .85) * 5, 1.6);
  show(OLD, BAX_ + 2, 0, 2, 0); onBody(c, 15, 0, .1, 44, L.k); sh(V(BAX_ + 6, 0, 7), 20); }, [[0, 'impact_soft', .4], [.85, 'jump', .5], [.9, 'cheer_small', .4]]);
// 61 «Er drückt mir die Schlüssel zu einer riesigen»: primer plano de las manos: el manojo de llaves con la etiqueta «HALSWERK» pasa a la mano de Luca
shot(82.36, 'Z', null, L => { barrioS(L); const k = put(kranich, BAX_ + 2.4, 0, 5.6, PI / 2 + .1); neck(k, 1, L.T); const c = put(luca, BAX_ + 6.6, 0, 5.6, -PI / 2 - .1); actuar(k, L.lt, [[0, { aRx: 1.4, aRe: .3, aRz: .2 }]], { T: L.T }); actuar(c, L.lt, [[0, { aLx: 1.3, aLe: .5, aLz: -.2 }]], { T: L.T });
  const hand = L.lt < .7 ? k.aR.hand : c.aL.hand; attach(KEYS, hand, [0, -.9, .3], [0, 0, 0], 1.2); cara(c, L.T, { expr: 'happy', mouth: 'o' }); cara(k, L.T, { expr: 'happy', mouth: 'smile' });
  const m = V(BAX_ + 4.5, 4.4, 5.6); cm([m.x + .5, m.y + 1.2, m.z + 7, m.x, m.y - .3, m.z, 40], [m.x + .4, m.y + 1, m.z + 6, m.x, m.y - .3, m.z, 38], L.k); sh(m.clone().setY(0), 15); }, [[0, 'zoom_in', .4], [.5, 'keys', .7], [1.2, 'ding', .4]]);
// 62 «Fabrik in die Hand.»: destello de la fábrica gigante con las letras HALSWERK
shot(84.04, 'F', null, L => { fabrikS(L); cm([FAX_ - 10, 10, 60, FAX_, 16, -30, 50], [FAX_ - 6, 11, 54, FAX_, 17, -30, 50], L.k); sh(V(FAX_, 0, -20), 70); }, [[0, 'flash', .4], [.1, 'reveal', .4]]);
// 63 «Und weg ist er.»: el Oldtimer sale disparado dejando una nube de polvo; Luca se queda con las llaves, perplejo
shot(84.86, 'W', null, L => { barrioS(L); const z = lerp(2, -90, easeIn(clamp(L.lt / 1.1))); show(OLD, BAX_ + 2, 0, z, PI); dust(V(BAX_ + 2, 0, z + 4), L.t0, L.T, 14, 1.4);
  const c = put(luca, BAX_ + 6, 0, 7, -2.6); attach(KEYS, c.aL.hand, [0, -.9, .3], [0, 0, 0], 1.2); actuar(c, L.lt, [[0, { aLx: 1.3, aLe: .5, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'o' }); c.head.rotation.y = .4;
  cm([BAX_ + 9, 5, 20, BAX_ + 4, 4, -10, 48], [BAX_ + 8.5, 5, 18, BAX_ + 4, 4, -14, 48], L.k); sh(V(BAX_ + 4, 0, 0), 30); }, [[0, 'engine', .6], [.1, 'whoosh', .5], [.6, 'car_pass', .4]]);
// 64 «Aber es gibt ein Problem.» (zoom lento): la fábrica abandonada, la viñeta se cierra
shot(86.11, 'B', 'slow', L => { fabrikS(L); setSky([.3, .42, .7], [.6, .7, .86], [.8, .86, .94]); cm([FAX_, 8, 70, FAX_, 12, -20, 46], [FAX_, 8, 56, FAX_, 12, -20, 42], easeIn(L.k)); sh(V(FAX_, 0, -10), 70); }, [[0, 'crow', .5], [.3, 'wind', .4]]);
// 65 «Die Fabrik steht seit Jahren leer.»: Luca, pequeñito, ante la valla con el cartel GESCHLOSSEN y los hierbajos; vuela el polvo
shot(87.35, 'S', null, L => { fabrikS(L); const c = put(luca, FAX_ + 1, 0, 14, PI); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); attach(KEYS, c.aL.hand, [0, -.9, .3], [0, 0, 0], 1.2); dust(V(FAX_ - 8 + L.lt * 6, 0, 12), L.t0, L.T, 6, 1.2);
  cm([FAX_ + 8, 6, 34, FAX_, 7, 4, 46], [FAX_ + 6, 6, 30, FAX_, 7, 4, 46], L.k); sh(V(FAX_, 0, 8), 30); }, [[0, 'swipe', .4], [.2, 'wind', .5], [.6, 'metal_creak', .4]]);
// 66 «Und die Firma ist komplett pleite.»: Luca mira el móvil: «FIRMENKONTO 0,00 €»; un sello rojo «PLEITE»
shot(89.14, 'C', null, L => { fabrikS(L); const c = put(luca, FAX_ + 1, 0, 14, 0); handyP(c, 1.3); PH.userData.S.draw('pleite', (cx, w, h) => drawBankApp(cx, w, h, '0,00 €', 'FIRMENKONTO', '#ff4a4a')); actuar(c, L.lt, [[0, 'phone_look']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  FX2D.push(cx => { const k = clamp((L.lt - .5) * 5); if (k <= 0) return; const s = lerp(2.2, 1, easeOut(k)); cx.save(); cx.translate(W * .5, H * .2); cx.rotate(-.18); cx.scale(s * U, s * U); cx.globalAlpha = k; cx.strokeStyle = '#e8202a'; cx.lineWidth = 14; cx.strokeRect(-230, -70, 460, 140); ntxt(cx, 'PLEITE', 0, 4, 110, '#e8202a'); cx.restore(); });
  onBody(c, 12, 0, .15, 44, L.k, null, null, 4); sh(V(FAX_, 0, 14), 20); }, [[0, 'phone_vibrate', .4], [.5, 'stamp', .7], [.6, 'sad_trombone', .4]]);
// 67 «Trotzdem gehe ich rein.»: Luca empuja la puerta de la valla, que se abre chirriando, y entra decidido
shot(90.99, 'W', null, L => { fabrikS(L); const o = easeOut(clamp(L.lt / .7)); FA.GATE.children.forEach(d => { if (d.name === 'door-1') d.rotation.y = -o * 1.3; if (d.name === 'door1') d.rotation.y = o * 1.3; });
  const c = put(luca, FAX_, 0, lerp(13, 4, clamp((L.lt - .2) / 1.2)), PI); actuar(c, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLe: .2, aRe: .2 }], [.6, walkP(L.T, 0), { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([FAX_ + 4, 6, 28, FAX_, 6, 0, 46], [FAX_ + 3, 6, 24, FAX_, 6, -4, 46], L.k); sh(V(FAX_, 0, 6), 25); }, [[0, 'metal_creak', .6], [.2, 'chain_rattle', .4], [.7, 'steps', .5]]);
const _gateReset = () => FA.GATE.children.forEach(d => { if (d.name && d.name.startsWith('door')) d.rotation.y = 0; });
// 68 «Und was ich da finde, ändert alles.» (zoom lento): dentro de la nave en penumbra, Luca de espaldas ante la silueta de algo enorme cubierto de polvo
shot(92.37, 'B', 'slow', L => { _gateReset(); halleS(L); hemi.intensity = .35; FILL.intensity = 8; renderer.toneMappingExposure = .7; const c = put(luca, HAX_, 0, 22, PI); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  beamDust(V(HAX_, 0, 6), L.T); cm([HAX_ + 2, 7, 36, HAX_, 14, -12, 46], [HAX_ + 1.5, 7, 30, HAX_, 15, -12, 42], easeIn(L.k)); sh(V(HAX_, 0, 0), 50); }, [[0, 'door_creak', .5], [.3, 'echo_drip', .4], [1, 'tension_low', .4]]);
function beamDust(c, T) { DUST.forEach((d, i) => { const r = RNG(i * 9 + 2); d.visible = true; d.position.set(c.x + (r() - .5) * 20, ((T * .3 + r()) % 1) * 24, c.z + (r() - .5) * 20); d.scale.setScalar(.08 + r() * .1); d.material.opacity = .7; }); }
