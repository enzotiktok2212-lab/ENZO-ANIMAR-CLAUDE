// ---------- a: gancho, la regla y el colegio (0 – 22,84 s) ----------
// Pueblo (x = 0): plaza z ∈ [-70, 50], carretera hacia +z, pórtico «S verboten» en z = 70. THUPERMARKT = LT.HS[12] (este).
// Colegio (SCX): fachada en z = -26, rótulo en (0, 26.4). Aula (KLX): pizarra en z = -15.45; pupitres x ∈ {-11, 0, 11}, z ∈ {-2, 6, 14} (silla +2.8); puerta x = -19.6, z 4.6…11.2.
function town(L, o = {}) { use('LT'); if (o.night) { night(30); renderer.toneMappingExposure = .9; TINT = 'rgba(10,16,60,.18)'; } else if (o.dusk) dusk(); else day(); }
function schoolS(L) { use('SC'); day(); SCHILD.userData.draw(1); }
function klasseS(L, board = 1) { use('KL'); inside(1.0, 40); KL.BB.userData.draw('d' + board, (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.font = `700 54px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#f4f4f4'; c.fillText('DIKTAT', w / 2, 62); c.font = `700 44px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('THONNE · THAND · THOMMER', w / 2, 140); c.fillStyle = '#ffffff'; c.fillText('S = TH  (!!!)', w / 2, 220); c.strokeStyle = '#ff6a6a'; c.lineWidth = 6; c.beginPath(); c.arc(w / 2 - 92, 206, 34, 0, 7); c.stroke(); }); }
const KW = x => V(KLX + x[0], x[1] ?? 0, x[2]);
// pupitre (q, r) → asiento del alumno
const seatAt = (q, r) => [KLX - 11 + q * 11, -2 + r * 8 + 2.8];
function classKids(L, skip = [], mode = 'sit') { const S_ = [[0, 0], [2, 0], [0, 1], [0, 2], [1, 2], [2, 2], [1, 0]]; S_.forEach(([q, r], i) => { if (skip.some(s => s[0] === q && s[1] === r)) return; const c = KIDS[i]; const [x, z] = seatAt(q, r);
  if (mode === 'hands') { sit(c, x, 2.45, z, PI, L, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); }
  else if (mode === 'laugh') { const j = Math.abs(Math.sin(L.T * 9 + i)); sit(c, x, 2.45, z, PI + Math.sin(i) * .4, L, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: .15 + j * .1 }); laughF(c, L.T + i); }
  else if (mode === 'scared') { sit(c, x, 2.45, z, PI, L, { aLx: 1.2, aRx: 1.2, aLe: 1.8, aRe: 1.8, lean: -.1, headX: -.1 }); cara(c, L.T + i, { expr: 'shock', mouth: 'grimace' }); }
  else { sit(c, x, 2.45, z, PI, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2, headY: Math.sin(L.T * .8 + i) * .25 }); cara(c, L.T + i, { expr: 'neutral' }); } }); }
const walkTo = (c, L, x0, z0, x1, z1, i = 0, run = false) => { const q = L.k; c.root.position.x = lerp(x0, x1, q); c.root.position.z = lerp(z0, z1, q); c.root.rotation.y = Math.atan2(x1 - x0, z1 - z0); c.root.position.y = Math.abs(Math.sin(L.T * (run ? 13 : 9) + i)) * (run ? .35 : .12); actuar(c, 0, [[0, run ? runP(L.T, i) : walkP(L.T, i)]], { T: L.T }); };
const holdBag = c => attach(BAG, c.spine, [0, 1.0, -.95], [0, 0, 0], .9);
function drawBubbleWord(ch, text, k, col = '#ffffff') { bubble(ch, text, k); }
const bannerSign = (g, k) => { const S = g.userData.sign; S.scale.setScalar(1 + .06 * Math.sin(k * 30) * (1 - k)); };

// 1 «In diether Thtadt»: la carretera de Zischelbach con el pórtico y la señal gigante «S verboten»; Jonte camina hacia cámara mirando la señal; zoom lento hacia ella
shot(0, 'C', null, L => { town(L); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, -.8, 38.5, -.4, 41.5); c.root.rotation.y = .05; cara(c, L.T, { expr: 'worried', eyes: 'up' }); holdBag(c); hero(c);
  crowdAt(L, 0, 30, 9, 6, 16, 3, { mode: i => ['walk', 'talk', 'walk', 'point'][i % 4], gap: 1.5, dir: PI * .5 }); bannerSign(GAN, L.k);
  cm([0, 7, 66, 0, 7.4, 36, 50], [0, 7.4, 60, 0, 7.8, 36, 46], L.k, easeOut); sh(V(0, 0, 40), 36); }, [[0, 'whoosh', .5], [.1, 'crowd_murmur', .3], [.5, 'steps', .3]]);
// 2 «itht der Buchthtabe S verboten.»: la señal de cerca; la barra roja golpea la S; vibra
shot(1.05, 'Z', 'punch', L => { town(L); const S = GAN.userData.sign; const k = clamp(L.lt / .35); S.userData.bar.scale.set(easeOut(k), 1, 1); S.rotation.z = Math.sin(L.T * 40) * .03 * (1 - clamp(L.lt / .6));
  crowdAt(L, 0, 26, 6, 6, 12, 5, { mode: 'point', face: V(0, 10, 36), gap: 1.2 });
  cm([3, 7.6, 58, 0, 9.4, 36, 34], [1.5, 8.2, 54, 0, 9.6, 36, 32], L.k); sh(V(0, 0, 36), 26); badge('red', 'VERBOTEN!', W / 2, H * .17, (L.lt - .3) / .25, 1, 1); }, [[0, 'impact', .7], [.05, 'metal_clang', .5], [.3, 'buzzer', .4]]);
// 3 «Wer ihn thagt,»: en la plaza un vecino dice «SSS…» sin querer; dos policías se giran y le señalan
shot(2.48, 'W', null, L => { town(L); const m = put(EX[3], 6, 0, 10, -.3); talk(m, L.T, 2.48, 3.4, 'happy'); actuar(m, 0, [[0, { aRx: .8, aRz: .2, aRe: 1.1, aLx: .3 }]], { T: L.T }); bubble(m, 'SSSERVUS!', (L.lt - .1) / .2); hero(m);
  const c1 = put(COPS[0], 12.5, 0, 3, -.9); actuar(c1, L.lt, [[0, 'idle'], [.25, 'point', { dur: .25 }]], { T: L.T }); cara(c1, L.T, { expr: 'angry', mouth: 'o' }); const c2 = put(COPS[1], 1, 0, 2, .6); actuar(c2, L.lt, [[0, 'idle'], [.35, 'shock', { dur: .25 }]], { T: L.T }); cara(c2, L.T, { expr: 'shock', mouth: 'o' });
  crowdAt(L, 6, 10, 5, 7, 12, 8, { mode: 'shock', from: 4, gap: 1.6, avoid: [[12.5, 3], [1, 2]] });
  orb(L.k, V(6, 4.2, 9), null, [17, -.12, .1, 42], [14, -.2, .08, 42]); sh(V(6, 0, 8), 20); }, [[0, 'gasp', .4], [.3, 'whistle', .6]]);
// 4 «kommt inth Gefängnith.»: los policías le ponen las esposas y lo meten en el coche patrulla
shot(3.4, 'F', null, L => { town(L); const k = easeInOut(L.k); const z = lerp(14, 10.5, k); const m = put(EX[3], 8, 0, z, -.1); actuar(m, 0, [[0, { aLx: -.5, aRx: -.5, aLz: .3, aRz: -.3, aLe: .3, aRe: .3, lean: -.12, headX: -.05, ...shiver(L.T, .8) }]], { T: L.T }); cara(m, L.T, { expr: 'worried', mouth: 'scream' }); hero(m);
  attach(CUFFS, m.aR.hand, [0, -.8, 0], [PI / 2, 0, 0], 1);
  const c1 = put(COPS[0], 5.6, 0, z - .6, .35); actuar(c1, 0, [[0, { aRx: 1.0, aRz: -.6, aRe: .6, aLx: .4, lean: -.08 }]], { T: L.T }); cara(c1, L.T, { expr: 'angry', mouth: 'talk' }); const c2 = put(COPS[1], 10.4, 0, z - .6, -.35); actuar(c2, 0, [[0, { aLx: 1.0, aLz: .6, aLe: .6, aRx: .4, lean: -.08 }]], { T: L.T }); cara(c2, L.T, { expr: 'determined' });
  show(POL, 8, 0, 1.5, PI / 2); crowdAt(L, 8, 8, 6, 9, 14, 9, { mode: 'shock', from: 6, gap: 1.7 });
  onBody(m, 15, .25, .1, 44, L.k, 13, .2, 3.6); sh(V(8, 0, 8), 20); }, [[0, 'siren', .6], [.15, 'cuffs', .6], [.5, 'car_door', .5]]);
// 5 «Und jeder muth ihn»: delante del THUPERMARKT dos vecinas se saludan ceceando (bocadillos «THERVUTH!»)
shot(4.18, 'S', null, L => { town(L); const sp = LT.HS[2].position; const bx = sp.x + 13, bz = sp.z;
  const a = put(EX[4], bx + 1, 0, bz - 2.6, 1.85); talk(a, L.T, 4.18, 4.8, 'happy'); actuar(a, 0, [[0, 'wave']], { T: L.T }); bubble(a, 'THERVUTH!', (L.lt - .05) / .2, 2.2);
  const b = put(EX[6], bx + 1, 0, bz + 2.6, 1.25); talk(b, L.T, 4.8, 5.37, 'happy'); actuar(b, L.lt, [[0, 'idle'], [.5, 'wave', { dur: .2 }]], { T: L.T }); bubble(b, 'THERVUTH!', (L.lt - .6) / .2, 2.2); hero(a, b);
  crowdAt(L, bx + 4, bz, 4, 8, 14, 11, { mode: 'walk', from: 8, gap: 1.6 });
  orb(L.k, V(bx + 1, 4.6, bz), null, [17, 1.45, .1, 42], [15, 1.6, .1, 42]); sh(V(bx, 0, bz), 20); }, [[0, 'chime_shop', .4], [.1, 'giggle', .4], [.6, 'giggle', .4]]);
// 6 «durch T-H erthetzen.»: un pintor en una escalera tacha la S del rótulo del colegio y pinta «TH»
shot(5.37, 'R', null, L => { schoolS(L); SCHILD.userData.draw(clamp(L.lt / 1.0)); const p = put(EX[10], SCX - 9.2, 17.6, -23.6, PI + .5); show(LADDER, SCX - 9.2, 0, -24.4, 0); LADDER.rotation.x = -.06;
  actuar(p, 0, [[0, { aRx: 3.0 + Math.sin(L.T * 9) * .15, aRz: -.1 + Math.sin(L.T * 9) * .2, aRe: .2, aLx: 1.0, aLe: 1.2, lean: -.05 }]], { T: L.T }); attach(BRUSH, p.aR.hand, [0, -.6, 0], [PI, 0, 0], 1); attach(PAINT, p.aL.hand, [0, -.9, 0], [0, 0, 0], .9); cara(p, L.T, { expr: 'determined' }); hero(p);
  crowdAt(L, SCX - 4, -12, 4, 6, 10, 12, { mode: 'point', face: V(SCX - 8, 24, -26), from: 10, gap: 1.4 });
  cm([SCX - 3, 19, -6, SCX - 8.5, 23.5, -25, 40], [SCX - 3.5, 21, -10, SCX - 8.8, 24, -25, 36], L.k); sh(V(SCX - 7, 18, -24), 20); DOF = 0; }, [[0, 'whirl', .3], [.15, 'paint_brush', .6], [.55, 'paint_brush', .6]]);
// 7 «Heute Morgen ging ich zur Schule.»: Jonte va al colegio con la mochila; detrás, el rótulo «THCHULE AM BERG»; otros niños entran
shot(6.54, 'W', null, L => { schoolS(L); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, SCX - 8, 2, SCX - 3, -1); c.root.rotation.y = 2.0; holdBag(c); cara(c, L.T, { expr: 'tired', mouth: 'flat' }); hero(c);
  KIDS.slice(0, 5).forEach((k, i) => { put(k, 0, 0, 0, 0); walkTo(k, L, SCX + 4 + i * 3, 2 - (i % 2) * 4, SCX + 2 + i * 3, -16 - (i % 2) * 3, i); });
  orb(L.k, V(SCX - 5.5, 6.5, 0), V(SCX - 3.5, 7, -1), [19, 1.25, .05, 46], [16.5, 1.15, .04, 46]); sh(V(SCX - 4, 0, -4), 30); }, [[0, 'birds', .4], [.1, 'steps', .5], [.8, 'school_bell', .5]]);
// 8 «Meine Lehrerin schrie:»: Frau Kessler escribe «DIKTAT: THONNE…» en la pizarra y se gira de golpe
shot(7.93, 'C', null, L => { klasseS(L); const t = put(kess, KLX + 3, 0, -12.6, PI); const turn = easeInOut(clamp((L.lt - .15) / .3)); t.root.rotation.y = lerp(PI, .15, turn);
  actuar(t, 0, [[0, turn < .5 ? { aRx: 2.6 + Math.sin(L.T * 12) * .15, aRz: .2, aRe: .3 } : { aRx: 1.6, aRe: .2, aLx: .4, lean: .08 }]], { T: L.T }); cara(t, L.T, { expr: turn < .5 ? 'neutral' : 'angry', mouth: turn < .5 ? 'flat' : 'talk_wide' }); hero(t);
  classKids(L, [[1, 1]]); const j = sit(jonte, ...[seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1]], PI, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'tired' });
  orbit(V(KLX + 2, 6.4, -11), lerp(18, 15, L.k), .08, .12, 44); sh(V(KLX, 0, -8), 22); }, [[0, 'chalk', .6], [.45, 'whoosh_soft', .4], [.7, 'gasp', .3]]);
// 9 «„Thetzt euch hin und theid thtill!“»: primer plano de la profesora gritando y señalando abajo; saliva del ceceo
shot(9.01, 'Z', 'punch', L => { klasseS(L); const t = put(kess, KLX + 3, 0, -10.4, .1); talk(t, L.T, 9.01, 10.54, 'angry'); actuar(t, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .3, aLx: .3, aLz: .2, lean: .1, headX: .05 + Math.sin(L.T * 9) * .04 }]], { T: L.T }); spit(t, L.T, 9.01, 10); hero(t);
  classKids(L, [[1, 1]]); onFace(t, 5.2, .4, .6, 40, L.k, 4.4); sh(V(KLX + 3, 0, -10), 14); }, [[0, 'impact', .5], [.3, 'spit', .4], [.9, 'desk_slam', .4]]);
// 10 «Dann rannte mein bethter Freund»: la puerta se abre de golpe y Bela entra corriendo con la fiambrera
shot(10.54, 'S', null, L => { klasseS(L); DOOR.rotation.y = easeOut(clamp(L.lt / .25)) * 1.45; const b = put(bela, 0, 0, 0, 0); walkTo(b, L, KLX - 20, 8.2, KLX - 12, 10.8, 0, true); attach(BOX, b.aL.hand, [0, -.6, .3], [0, 0, 0], .8);
  cara(b, L.T, { expr: 'shock', mouth: 'scream' }); hero(b); classKids(L, [[1, 1]]); sit(jonte, seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1], PI - .9, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'shock', mouth: 'o' });
  cm([KLX - 5, 7, 14.5, KLX - 16, 4.4, 9, 46], [KLX - 6, 6.6, 14, KLX - 13, 4.4, 10, 44], L.k); sh(V(KLX - 14, 0, 9), 18); }, [[0, 'door_slam', .7], [.1, 'run_steps', .6]]);
// 11 «inth Klathenzimmer.»: Bela corre entre los pupitres hacia cámara; los niños se giran
shot(11.68, 'W', null, L => { klasseS(L); DOOR.rotation.y = 1.45; const b = put(bela, 0, 0, 0, 0); walkTo(b, L, KLX - 11, 10.8, KLX + 1, 10.8, 1, true); attach(BOX, b.aL.hand, [0, -.6, .3], [0, 0, 0], .8); cara(b, L.T, { expr: 'shock', mouth: 'scream' }); hero(b);
  classKids(L, [[1, 1]]); sit(jonte, seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1], PI - 1.3, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'shock' });
  cm([KLX + 9, 9.5, 11.5, KLX - 3, 4, 10.8, 46], [KLX + 8, 9, 11.2, KLX, 4, 10.8, 44], L.k); sh(V(KLX, 0, 10), 18); }, [[0, 'run_steps', .6], [.5, 'chair_scrape', .4]]);
// 12 «„Jemand hat mein Käthebrot geklaut!“»: Bela, desesperado, enseña la fiambrera vacía
shot(12.74, 'F', null, L => { klasseS(L); const b = put(bela, KLX + 2, 0, 10.8, PI / 2); talk(b, L.T, 12.74, 13.9, 'shock'); actuar(b, 0, [[0, { aLx: .55, aLz: -.25, aLe: .8, aRx: .55, aRz: -.25, aRe: .8, headX: -.08, ...shiver(L.T, .5) }]], { T: L.T }); attach(BOX, b.aL.hand, [.5, -.7, .5], [0, 0, 0], .9); spit(b, L.T, 12.74, 6); tears(b, L.T); hero(b);
  classKids(L, [[1, 1]]); onFace(b, 7.4, -.9, 0, 42, L.k, 6.2); sh(V(KLX + 2, 0, 10.8), 14); }, [[0, 'flash', .3], [.1, 'cry', .5], [.6, 'box_rattle', .4]]);
// 13 «geklaut!»: plano detalle de la fiambrera vacía con migas; Bela la sacude boca abajo; un queso pinchado en el borde
shot(13.9, 'C', 'punch', L => { klasseS(L); const b = put(bela, KLX + 2, 0, 10.8, PI / 2); actuar(b, 0, [[0, { aLx: 1.6, aLe: .4, aRx: 1.4, aRe: .6, headX: .2 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [PI * .85 + Math.sin(L.T * 20) * .15, 0, 0], 1.1); cara(b, L.T, { expr: 'cry', mouth: 'scream' }); hero(b);
  dust(wpos(b.aL.hand).add(V(0, -1, 0)), L.t0 + .05, L.T, 8, .3); const hp_ = wpos(b.aL.hand); cm([hp_.x + 4.6, hp_.y + 1.4, hp_.z + .6, hp_.x, hp_.y + .2, hp_.z, 42], [hp_.x + 4, hp_.y + 1.6, hp_.z + .5, hp_.x, hp_.y + .3, hp_.z, 40], L.k); sh(V(KLX + 2, 0, 10.8), 12); DOF = 0; }, [[0, 'impact_soft', .5], [.05, 'box_rattle', .6]]);
// 14 «Ich konnte nicht aufhören zu lachen.»: Jonte en su pupitre se parte de risa y golpea la mesa
shot(14.95, 'W', null, L => { klasseS(L); const [x, z] = seatAt(1, 1); const j = Math.abs(Math.sin(L.T * 10)); sit(jonte, x, 2.45, z, PI + .25, L, { aLx: 1.2 + j * .4, aRx: 1.2 + j * .4, aLe: 1.4, aRe: 1.4, lean: .2 + j * .15, headX: -.1 + j * .1 }); laughF(jonte, L.T); tears(jonte, L.T); hero(jonte);
  classKids(L, [[1, 1]]); const b = put(bela, x + 6, 0, z + 1, -1.2); actuar(b, 0, [[0, { aLx: 1.5, aLe: .8 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [0, 0, 0], .9); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  orbit(V(x, 4.2, z - 1), lerp(11.5, 9.5, L.k), PI - .3, .16, 42); sh(V(x, 0, z), 14); }, [[0, 'laugh_kid', .7], [.3, 'desk_slam', .4], [.9, 'desk_slam', .4]]);
// 15 «zu lachen.»: toda la clase se ríe; Bela hace pucheros con la fiambrera
shot(15.83, 'S', null, L => { klasseS(L); classKids(L, [[1, 1]], 'laugh'); const [x, z] = seatAt(1, 1); const j = Math.abs(Math.sin(L.T * 10)); sit(jonte, x, 2.45, z, PI, L, { aLx: 1.2 + j * .4, aRx: 1.2 + j * .4, aLe: 1.4, aRe: 1.4, lean: .2 + j * .15 }); laughF(jonte, L.T);
  const b = put(bela, KLX + 5.5, 0, 10.8, PI - .3); actuar(b, 0, [[0, { aLx: 1.5, aLe: .8, aRx: .2, headX: .1 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [0, 0, 0], .9); cara(b, L.T, { expr: 'sad', mouth: 'frown' }); hero(b, jonte);
  cm([KLX + 1, 10, -14, KLX + 1, 3.6, 7, 52], [KLX + 1, 9.4, -13, KLX + 1, 3.8, 7, 50], L.k); sh(V(KLX, 0, 4), 26); }, [[0, 'class_laugh', .7], [.6, 'giggle', .4]]);
// 16 «Aber dann thtürmten»: la puerta salta y entra el primer policía de una patada
shot(16.94, 'C', 'punch', L => { klasseS(L); const k = easeOut(clamp(L.lt / .18)); DOOR.rotation.y = k * 1.55; const c = put(COPS[2], 0, 0, 0, 0); walkTo(c, L, KLX - 21, 8, KLX - 15.5, 9.5, 0, true); actuar(c, L.lt, [[0, { lLx: 1.4, lLk: .2, aRx: 1.2, aRe: .3, lean: -.1 }], [.25, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'talk_wide' }); hero(c);
  classKids(L, [[1, 1]], 'scared'); dust(V(KLX - 18, 0, 8), L.t0, L.T, 10, .6);
  cm([KLX - 6, 8, 15, KLX - 17, 4.4, 8.5, 46], [KLX - 7, 7.6, 14.5, KLX - 16, 4.4, 9, 44], L.k); sh(V(KLX - 16, 0, 8), 16); }, [[0, 'door_kick', .8], [.1, 'glass_shake', .4], [.2, 'boots', .5]]);
// 17 «vier Polizithten durch die Tür.»: los cuatro policías en fila dentro del aula; un «4» enorme salta
shot(17.7, 'W', null, L => { klasseS(L); DOOR.rotation.y = 1.55; COPS.forEach((c, i) => { const x = KLX - 16 + i * 3.4, z = 11 - (i % 2) * .5; put(c, 0, 0, 0, 0); walkTo(c, { ...L, k: clamp(L.k * 1.6) }, x - 4, z, x, z, i); c.root.rotation.y = 1.0; if (L.k > .62) actuar(c, 0, [[0, i % 2 ? 'point' : { aLx: .3, aRx: .3, aLz: .2, aRz: -.2, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); cara(c, L.T + i, { expr: 'angry', mouth: i % 2 ? 'talk_wide' : 'flat' }); });
  classKids(L, [[1, 1]], 'scared'); hero(...COPS); badge3('big', '4', V(KLX - 11, 11.5, 10.5), (L.lt - .2) / .2, 1.5);
  cm([KLX + 5, 7.6, 17, KLX - 11, 4.6, 10.5, 50], [KLX + 4, 7.4, 16, KLX - 11, 4.6, 10.5, 48], L.k); sh(V(KLX - 10, 0, 10), 20); }, [[0, 'boots', .6], [.25, 'pop', .6], [.5, 'radio_chatter', .4]]);
// 18 «„Alle thofort die Hände hoch!“»: primer plano del policía gritando con el dedo en alto
shot(19.3, 'Z', 'punch', L => { klasseS(L); const c = put(COPS[1], KLX - 6, 0, 2, .7); talk(c, L.T, 19.3, 20.12, 'angry'); actuar(c, 0, [[0, { aRx: 2.7, aRz: -.1, aRe: .2, aLx: .4, lean: .1 }]], { T: L.T }); spit(c, L.T, 19.3, 8); hero(c);
  classKids(L, [[1, 1]], 'scared'); onFace(c, 5.6, .4, -.8, 40, L.k, 4.8); sh(V(KLX - 6, 0, 2), 14); }, [[0, 'impact', .6], [.2, 'megaphone_buzz', .3]]);
// 19 «die Hände hoch!»: toda la clase y la profesora levantan las manos a la vez
shot(20.12, 'S', null, L => { klasseS(L); classKids(L, [[1, 1]], 'hands'); const [x, z] = seatAt(1, 1); sit(jonte, x, 2.45, z, PI, L, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }); cara(jonte, L.T, { expr: 'shock', mouth: 'o' });
  const t = put(kess, KLX - 13, 0, -9, .6); actuar(t, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }]], { T: L.T }); cara(t, L.T, { expr: 'shock', mouth: 'o' }); hero(jonte, t);
  const b = put(bela, KLX + 5.5, 0, 10.8, PI - .3); actuar(b, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  cm([KLX + 1, 9.6, -14, KLX, 4.4, 6, 52], [KLX + 1, 9, -12.5, KLX, 4.6, 6, 50], L.k, easeOut); sh(V(KLX, 0, 2), 26); }, [[0, 'whoosh_up', .5], [.1, 'cloth', .5]]);
// 20 «Thogar die Polizei»: Jonte con las manos arriba aguantándose la risa (mejillas infladas)
shot(20.87, 'F', null, L => { klasseS(L); const [x, z] = seatAt(1, 1); const j = Math.sin(L.T * 14); sit(jonte, x, 2.45, z, PI - .3, L, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2, lean: .05 + Math.abs(j) * .05 }); cara(jonte, L.T, { expr: 'smug', eyes: 'squint', mouth: j > .4 ? 'grin' : 'wavy' }); hero(jonte);
  classKids(L, [[1, 1]], 'hands'); onFace(jonte, 6, -.4, -.6, 40, L.k, 5.4); sh(V(x, 0, z), 12); }, [[0, 'flash', .3], [.2, 'snort', .5]]);
// 21 «klang lächerlich.»: los policías gritan «THOFORT!» con los bocadillos mientras los niños se ríen por lo bajo
shot(21.69, 'W', null, L => { klasseS(L); COPS.slice(0, 3).forEach((c, i) => { put(c, KLX - 12 + i * 4, 0, 4 - i, .7 - i * .15); talk(c, L.T + i * .3, 21.69, 22.84, 'angry'); actuar(c, 0, [[0, i === 1 ? 'point' : { aRx: 1.2, aRe: .4, lean: .1 }]], { T: L.T }); });
  bubble(COPS[0], 'THOFORT!', (L.lt - .05) / .2); bubble(COPS[2], 'THTILL!', (L.lt - .45) / .2); classKids(L, [[1, 1]], 'laugh'); hero(...COPS.slice(0, 3));
  orbit(V(KLX - 8, 5.6, 3), lerp(19, 17, L.k), 1.0, .12, 44); sh(V(KLX - 8, 0, 3), 18); }, [[0, 'whoosh_soft', .4], [.2, 'giggle', .5], [.6, 'class_laugh', .4]]);
