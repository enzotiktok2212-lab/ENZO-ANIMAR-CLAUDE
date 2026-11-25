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
shot(0, 'C', null, L => { town(L); put(jonte, 0, 0, 86, PI * 0); walkTo(jonte, L, -1.2, 92, -.6, 88.5); jonte.root.rotation.y = .1; cara(jonte, L.T, { expr: 'worried', eyes: 'up' }); holdBag(jonte); hero(jonte);
  crowdAt(L, 0, 66, 8, 7, 16, 3, { mode: i => ['walk', 'talk', 'walk', 'point'][i % 4], gap: 1.4, dir: PI * .5 }); bannerSign(GAN, L.k);
  cm([0, 5.6, 112, 0, 8.6, 70, 50], [0, 6.2, 104, 0, 9, 70, 46], L.k, easeOut); sh(V(0, 0, 80), 36); }, [[0, 'whoosh', .5], [.1, 'crowd_murmur', .3], [.5, 'steps', .3]]);
// 2 «itht der Buchthtabe S verboten.»: la señal de cerca; la barra roja golpea la S; vibra
shot(1.05, 'Z', 'punch', L => { town(L); const S = GAN.userData.sign; const k = clamp(L.lt / .35); S.userData.bar.scale.set(easeOut(k), 1, 1); S.rotation.z = Math.sin(L.T * 40) * .03 * (1 - clamp(L.lt / .6));
  crowdAt(L, 0, 60, 6, 6, 12, 5, { mode: 'point', face: V(0, 10, 70), gap: 1.2 });
  cm([3, 7.6, 92, 0, 9.4, 70, 34], [1.5, 8.2, 88, 0, 9.6, 70, 32], L.k); sh(V(0, 0, 70), 26); badge('red', 'VERBOTEN!', W / 2, H * .17, (L.lt - .3) / .25, 1, 1); }, [[0, 'impact', .7], [.05, 'metal_clang', .5], [.3, 'buzzer', .4]]);
// 3 «Wer ihn thagt,»: en la plaza un vecino dice «SSS…» sin querer; dos policías se giran y le señalan
shot(2.48, 'W', null, L => { town(L); const m = put(EX[3], 6, 0, 10, -.3); talk(m, L.T, 2.48, 3.4, 'happy'); actuar(m, 0, [[0, { aRx: .8, aRz: .2, aRe: 1.1, aLx: .3 }]], { T: L.T }); bubble(m, 'SSSERVUS!', (L.lt - .1) / .2); hero(m);
  const c1 = put(COPS[0], 12.5, 0, 3, -.9); actuar(c1, L.lt, [[0, 'idle'], [.25, 'point', { dur: .25 }]], { T: L.T }); cara(c1, L.T, { expr: 'angry', mouth: 'o' }); const c2 = put(COPS[1], 1, 0, 2, .6); actuar(c2, L.lt, [[0, 'idle'], [.35, 'shock', { dur: .25 }]], { T: L.T }); cara(c2, L.T, { expr: 'shock', mouth: 'o' });
  crowdAt(L, 6, 10, 5, 7, 12, 8, { mode: 'shock', from: 4, gap: 1.6, avoid: [[12.5, 3], [1, 2]] });
  orb(L.k, V(6, 4.2, 9), null, [17, -.12, .1, 42], [14, -.2, .08, 42]); sh(V(6, 0, 8), 20); }, [[0, 'gasp', .4], [.3, 'whistle', .6]]);
// 4 «kommt inth Gefängnith.»: los policías le ponen las esposas y lo meten en el coche patrulla
shot(3.4, 'F', null, L => { town(L); const k = easeInOut(L.k); const m = put(EX[3], lerp(8, 11.6, k), 0, lerp(16, 19, k), PI * .75); actuar(m, 0, [[0, { aLx: -.6, aRx: -.6, aLz: .25, aRz: -.25, aLe: .4, aRe: .4, lean: .18, headX: .1, ...shiver(L.T, .8) }]], { T: L.T }); cara(m, L.T, { expr: 'worried', mouth: 'grimace' }); hero(m);
  attach(CUFFS, m.aR.hand, [0, -.8, 0], [PI / 2, 0, 0], 1);
  const c1 = put(COPS[0], lerp(6.6, 10, k), 0, lerp(13.4, 16.6, k), PI * .75); actuar(c1, 0, [[0, 'push']], { T: L.T }); cara(c1, L.T, { expr: 'angry', mouth: 'talk' }); const c2 = put(COPS[1], lerp(10.6, 14, k), 0, lerp(13, 16, k), PI * .8); actuar(c2, 0, [[0, { aLx: 1.2, aLe: .5, aRx: 1.0, aRe: .6 }]], { T: L.T }); cara(c2, L.T, { expr: 'determined' });
  show(POL, 15.5, 0, 25, .9); POL.traverse(o => { if (o.isMesh && o.material.emissive && o.material.emissiveIntensity > 1) o.material.emissiveIntensity = Math.sin(L.T * 18) > 0 ? 3 : .3; });
  crowdAt(L, 10, 16, 5, 8, 13, 9, { mode: 'shock', from: 6, gap: 1.7 });
  orb(L.k, V(11, 4.4, 17), V(12, 4.4, 18), [19, -1.1, .12, 42], [16, -1.25, .1, 42]); sh(V(12, 0, 18), 22); }, [[0, 'siren', .6], [.15, 'cuffs', .6], [.5, 'car_door', .5]]);
// 5 «Und jeder muth ihn»: delante del THUPERMARKT dos vecinas se saludan ceceando (bocadillos «THERVUTH!»)
shot(4.18, 'S', null, L => { town(L); const sp = LT.HS[12].position; const bx = sp.x - 14, bz = sp.z;
  const a = put(EX[4], bx, 0, bz - 2.6, -.4 + PI * .0); a.root.rotation.y = 1.9; talk(a, L.T, 4.18, 4.8, 'happy'); actuar(a, 0, [[0, 'wave']], { T: L.T }); bubble(a, 'THERVUTH!', (L.lt - .05) / .2, 2.2);
  const b = put(EX[6], bx - 1, 0, bz + 2.8, 1.3); talk(b, L.T, 4.8, 5.37, 'happy'); actuar(b, L.lt, [[0, 'idle'], [.5, 'wave', { dur: .2 }]], { T: L.T }); bubble(b, 'THERVUTH!', (L.lt - .6) / .2, 2.2); hero(a, b);
  crowdAt(L, bx - 6, bz, 4, 8, 14, 11, { mode: 'walk', from: 8, gap: 1.6 });
  orb(L.k, V(bx, 4.4, bz), null, [17, -1.75, .1, 42], [15, -1.6, .1, 42]); sh(V(bx, 0, bz), 20); }, [[0, 'chime_shop', .4], [.1, 'giggle', .4], [.6, 'giggle', .4]]);
// 6 «durch T-H erthetzen.»: un pintor en una escalera tacha la S del rótulo del colegio y pinta «TH»
shot(5.37, 'R', null, L => { schoolS(L); SCHILD.userData.draw(clamp(L.lt / 1.0)); const p = put(EX[10], SCX - 8.3, 17.8, -23.6, PI); show(LADDER, SCX - 8.3, 0, -24.4, 0); LADDER.rotation.x = -.06;
  actuar(p, 0, [[0, { aRx: 3.0 + Math.sin(L.T * 9) * .15, aRz: -.1 + Math.sin(L.T * 9) * .2, aRe: .2, aLx: 1.0, aLe: 1.2, lean: -.05 }]], { T: L.T }); attach(BRUSH, p.aR.hand, [0, -.6, 0], [PI, 0, 0], 1); attach(PAINT, p.aL.hand, [0, -.9, 0], [0, 0, 0], .9); p.root.rotation.y = PI + .4; cara(p, L.T, { expr: 'determined' });
  crowdAt(L, SCX - 4, -12, 4, 6, 10, 12, { mode: 'point', face: V(SCX - 8, 24, -26), from: 10, gap: 1.4 });
  cm([SCX - 1, 18, -2, SCX - 6.5, 23.5, -25, 40], [SCX - 3, 21, -8, SCX - 7, 24, -25, 36], L.k); sh(V(SCX - 7, 18, -24), 20); DOF = 0; }, [[0, 'whirl', .3], [.15, 'paint_brush', .6], [.55, 'paint_brush', .6]]);
// 7 «Heute Morgen ging ich zur Schule.»: Jonte va al colegio con la mochila; detrás, el rótulo «THCHULE AM BERG»; otros niños entran
shot(6.54, 'W', null, L => { schoolS(L); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, SCX - 10, 2, SCX - 3, -2); c.root.rotation.y = 2.1; holdBag(c); cara(c, L.T, { expr: 'tired', mouth: 'flat' }); hero(c);
  KIDS.slice(0, 5).forEach((k, i) => { put(k, 0, 0, 0, 0); walkTo(k, L, SCX + 6 + i * 3, 6 - (i % 2) * 5, SCX + 4 + i * 3, -14 - (i % 2) * 4, i); });
  orb(L.k, V(SCX - 4, 9, -4), V(SCX - 2, 10, -6), [32, -.1, .12, 46], [28, -.02, .14, 46]); sh(V(SCX - 4, 0, -6), 34); }, [[0, 'birds', .4], [.1, 'steps', .5], [.8, 'school_bell', .5]]);
// 8 «Meine Lehrerin schrie:»: Frau Kessler escribe «DIKTAT: THONNE…» en la pizarra y se gira de golpe
shot(7.93, 'C', null, L => { klasseS(L); const t = put(kess, KLX + 3, 0, -12.6, PI); const turn = easeInOut(clamp((L.lt - .45) / .3)); t.root.rotation.y = lerp(PI, .15, turn);
  actuar(t, 0, [[0, turn < .5 ? { aRx: 2.6 + Math.sin(L.T * 12) * .15, aRz: .2, aRe: .3 } : { aRx: 1.6, aRe: .2, aLx: .4, lean: .08 }]], { T: L.T }); cara(t, L.T, { expr: turn < .5 ? 'neutral' : 'angry', mouth: turn < .5 ? 'flat' : 'talk_wide' }); hero(t);
  classKids(L, [[1, 1]]); const j = sit(jonte, ...[seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1]], PI, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'tired' });
  orbit(V(KLX + 2, 6.4, -11), lerp(18, 15, L.k), .08, .12, 44); sh(V(KLX, 0, -8), 22); }, [[0, 'chalk', .6], [.45, 'whoosh_soft', .4], [.7, 'gasp', .3]]);
// 9 «„Thetzt euch hin und theid thtill!“»: primer plano de la profesora gritando y señalando abajo; saliva del ceceo
shot(9.01, 'Z', 'punch', L => { klasseS(L); const t = put(kess, KLX + 3, 0, -10.4, .1); talk(t, L.T, 9.01, 10.54, 'angry'); actuar(t, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .3, aLx: .3, aLz: .2, lean: .1, headX: .05 + Math.sin(L.T * 9) * .04 }]], { T: L.T }); spit(t, L.T, 9.01, 10); hero(t);
  classKids(L, [[1, 1]]); onFace(t, 5.2, .4, .6, 40, L.k, 4.4); sh(V(KLX + 3, 0, -10), 14); }, [[0, 'impact', .5], [.3, 'spit', .4], [.9, 'desk_slam', .4]]);
// 10 «Dann rannte mein bethter Freund»: la puerta se abre de golpe y Bela entra corriendo con la fiambrera
shot(10.54, 'S', null, L => { klasseS(L); DOOR.rotation.y = easeOut(clamp(L.lt / .25)) * 1.45; const b = put(bela, 0, 0, 0, 0); walkTo(b, L, KLX - 18, 8, KLX - 9, 8.4, 0, true); attach(BOX, b.aL.hand, [0, -.6, .3], [0, 0, 0], .8);
  cara(b, L.T, { expr: 'shock', mouth: 'scream' }); hero(b); classKids(L, [[1, 1]]); sit(jonte, seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1], PI - .6, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'shock', mouth: 'o' });
  orb(L.k, V(KLX - 13, 4.4, 8), V(KLX - 9, 4.4, 8.2), [16, .9, .1, 44], [14, .7, .08, 44]); sh(V(KLX - 12, 0, 8), 18); }, [[0, 'door_slam', .7], [.1, 'run_steps', .6]]);
// 11 «inth Klathenzimmer.»: Bela corre entre los pupitres hacia cámara; los niños se giran
shot(11.68, 'W', null, L => { klasseS(L); DOOR.rotation.y = 1.45; const b = put(bela, 0, 0, 0, 0); walkTo(b, L, KLX - 6, 18, KLX + 4, 14.2, 1, true); b.root.rotation.y = 2.4 - .4; attach(BOX, b.aL.hand, [0, -.6, .3], [0, 0, 0], .8); cara(b, L.T, { expr: 'shock', mouth: 'scream' }); hero(b);
  classKids(L, [[1, 1]]); sit(jonte, seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1], PI - 1.0, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'shock' });
  orb(L.k, V(KLX, 4.4, 15), V(KLX + 3, 4.4, 14.4), [15, 1.6, .14, 44], [13, 1.5, .12, 44]); sh(V(KLX, 0, 14), 18); }, [[0, 'run_steps', .6], [.5, 'chair_scrape', .4]]);
// 12 «„Jemand hat mein Käthebrot geklaut!“»: Bela, desesperado, enseña la fiambrera vacía
shot(12.74, 'F', null, L => { klasseS(L); const b = put(bela, KLX + 6, 0, 13, -.5); talk(b, L.T, 12.74, 13.9, 'shock'); actuar(b, 0, [[0, { aLx: 1.5, aLz: -.2, aLe: .8, aRx: 2.6 + Math.sin(L.T * 7) * .2, aRz: .3, aRe: .5, headX: -.08 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [0, 0, 0], .9); spit(b, L.T, 12.74, 6); tears(b, L.T); hero(b);
  classKids(L, [[1, 1], [2, 2]]); onFace(b, 6.6, -.6, 0, 42, L.k, 5.6); sh(V(KLX + 6, 0, 13), 14); }, [[0, 'flash', .3], [.1, 'cry', .5], [.6, 'box_rattle', .4]]);
// 13 «geklaut!»: plano detalle de la fiambrera vacía con migas; Bela la sacude boca abajo; un queso pinchado en el borde
shot(13.9, 'C', 'punch', L => { klasseS(L); const b = put(bela, KLX + 6, 0, 13, -.5); actuar(b, 0, [[0, { aLx: 1.6, aLe: .4, aRx: 1.4, aRe: .6, headX: .2 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [PI * .85 + Math.sin(L.T * 20) * .15, 0, 0], 1.1); cara(b, L.T, { expr: 'cry', mouth: 'scream' }); hero(b);
  dust(wpos(b.aL.hand).add(V(0, -1, 0)), L.t0 + .05, L.T, 8, .3); const hp_ = wpos(b.aL.hand); cm([hp_.x - 2.6, hp_.y + 1.4, hp_.z + 4.4, hp_.x - .3, hp_.y + .2, hp_.z, 40], [hp_.x - 2.2, hp_.y + 1.6, hp_.z + 3.6, hp_.x - .3, hp_.y + .3, hp_.z, 38], L.k); sh(V(KLX + 6, 0, 13), 12); DOF = 0; }, [[0, 'impact_soft', .5], [.05, 'box_rattle', .6]]);
// 14 «Ich konnte nicht aufhören zu lachen.»: Jonte en su pupitre se parte de risa y golpea la mesa
shot(14.95, 'W', null, L => { klasseS(L); const [x, z] = seatAt(1, 1); const j = Math.abs(Math.sin(L.T * 10)); sit(jonte, x, 2.45, z, PI + .25, L, { aLx: 1.2 + j * .4, aRx: 1.2 + j * .4, aLe: 1.4, aRe: 1.4, lean: .2 + j * .15, headX: -.1 + j * .1 }); laughF(jonte, L.T); tears(jonte, L.T); hero(jonte);
  classKids(L, [[1, 1]]); const b = put(bela, x + 6, 0, z + 1, -1.2); actuar(b, 0, [[0, { aLx: 1.5, aLe: .8 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [0, 0, 0], .9); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  orbit(V(x, 4.2, z - 1), lerp(11.5, 9.5, L.k), PI - .3, .16, 42); sh(V(x, 0, z), 14); }, [[0, 'laugh_kid', .7], [.3, 'desk_slam', .4], [.9, 'desk_slam', .4]]);
// 15 «zu lachen.»: toda la clase se ríe; Bela hace pucheros con la fiambrera
shot(15.83, 'S', null, L => { klasseS(L); classKids(L, [[1, 1]], 'laugh'); const [x, z] = seatAt(1, 1); const j = Math.abs(Math.sin(L.T * 10)); sit(jonte, x, 2.45, z, PI, L, { aLx: 1.2 + j * .4, aRx: 1.2 + j * .4, aLe: 1.4, aRe: 1.4, lean: .2 + j * .15 }); laughF(jonte, L.T);
  const b = put(bela, KLX + 3.5, 0, -8, .1); actuar(b, 0, [[0, { aLx: 1.5, aLe: .8, aRx: .2, headX: .1 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [0, 0, 0], .9); cara(b, L.T, { expr: 'sad', mouth: 'frown' }); hero(b, jonte);
  orbit(V(KLX + 1, 5, 2), lerp(30, 27, L.k), PI - .05, .3, 46); sh(V(KLX, 0, 4), 26); }, [[0, 'class_laugh', .7], [.6, 'giggle', .4]]);
// 16 «Aber dann thtürmten»: la puerta salta y entra el primer policía de una patada
shot(16.94, 'C', 'punch', L => { klasseS(L); const k = easeOut(clamp(L.lt / .18)); DOOR.rotation.y = k * 1.55; const c = put(COPS[2], 0, 0, 0, 0); walkTo(c, L, KLX - 21, 8, KLX - 15, 8, 0, true); actuar(c, L.lt, [[0, { lLx: 1.4, lLk: .2, aRx: 1.2, aRe: .3, lean: -.1 }], [.25, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'talk_wide' }); hero(c);
  classKids(L, [[1, 1]], 'scared'); dust(V(KLX - 18, 0, 8), L.t0, L.T, 10, .6);
  orb(L.k, V(KLX - 16, 4.6, 8), null, [14, 1.15, .06, 44], [12, 1.0, .06, 44]); sh(V(KLX - 16, 0, 8), 16); }, [[0, 'door_kick', .8], [.1, 'glass_shake', .4], [.2, 'boots', .5]]);
// 17 «vier Polizithten durch die Tür.»: los cuatro policías en fila dentro del aula; un «4» enorme salta
shot(17.7, 'W', null, L => { klasseS(L); DOOR.rotation.y = 1.55; COPS.forEach((c, i) => { const x = KLX - 13 + i * 3.2, z = 6 - i * .6; put(c, 0, 0, 0, 0); walkTo(c, { ...L, k: clamp(L.k * 1.6) }, x - 5, z + 2, x, z, i); c.root.rotation.y = .95 - i * .12; if (L.k > .62) actuar(c, 0, [[0, i % 2 ? 'point' : { aLx: .3, aRx: .3, aLz: .2, aRz: -.2, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); cara(c, L.T + i, { expr: 'angry', mouth: i % 2 ? 'talk_wide' : 'flat' }); });
  classKids(L, [[1, 1]], 'scared'); hero(...COPS); badge3('big', '4', V(KLX - 8, 12.5, 4), (L.lt - .2) / .2, 1.5);
  orbit(V(KLX - 8, 5, 5), lerp(25, 22, L.k), 1.25, .14, 44); sh(V(KLX - 8, 0, 5), 20); }, [[0, 'boots', .6], [.25, 'pop', .6], [.5, 'radio_chatter', .4]]);
// 18 «„Alle thofort die Hände hoch!“»: primer plano del policía gritando con el dedo en alto
shot(19.3, 'Z', 'punch', L => { klasseS(L); const c = put(COPS[1], KLX - 6, 0, 2, .7); talk(c, L.T, 19.3, 20.12, 'angry'); actuar(c, 0, [[0, { aRx: 2.7, aRz: -.1, aRe: .2, aLx: .4, lean: .1 }]], { T: L.T }); spit(c, L.T, 19.3, 8); hero(c);
  classKids(L, [[1, 1]], 'scared'); onFace(c, 5.6, .4, -.8, 40, L.k, 4.8); sh(V(KLX - 6, 0, 2), 14); }, [[0, 'impact', .6], [.2, 'megaphone_buzz', .3]]);
// 19 «die Hände hoch!»: toda la clase y la profesora levantan las manos a la vez
shot(20.12, 'S', null, L => { klasseS(L); classKids(L, [[1, 1]], 'hands'); const [x, z] = seatAt(1, 1); sit(jonte, x, 2.45, z, PI, L, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }); cara(jonte, L.T, { expr: 'shock', mouth: 'o' });
  const t = put(kess, KLX + 8, 0, -11, -.4); actuar(t, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }]], { T: L.T }); cara(t, L.T, { expr: 'shock', mouth: 'o' }); hero(jonte, t);
  const b = put(bela, KLX + 13, 0, -4, -.6); actuar(b, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  orbit(V(KLX + 3, 5.4, 2), lerp(29, 25, easeOut(L.k)), PI + .25, .2, 46); sh(V(KLX + 3, 0, 2), 26); }, [[0, 'whoosh_up', .5], [.1, 'cloth', .5]]);
// 20 «Thogar die Polizei»: Jonte con las manos arriba aguantándose la risa (mejillas infladas)
shot(20.87, 'F', null, L => { klasseS(L); const [x, z] = seatAt(1, 1); const j = Math.sin(L.T * 14); sit(jonte, x, 2.45, z, PI - .3, L, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2, lean: .05 + Math.abs(j) * .05 }); cara(jonte, L.T, { expr: 'smug', eyes: 'squint', mouth: j > .4 ? 'grin' : 'wavy' }); hero(jonte);
  classKids(L, [[1, 1]], 'hands'); onFace(jonte, 6, -.4, -.6, 40, L.k, 5.4); sh(V(x, 0, z), 12); }, [[0, 'flash', .3], [.2, 'snort', .5]]);
// 21 «klang lächerlich.»: los policías gritan «THOFORT!» con los bocadillos mientras los niños se ríen por lo bajo
shot(21.69, 'W', null, L => { klasseS(L); COPS.slice(0, 3).forEach((c, i) => { put(c, KLX - 12 + i * 4, 0, 4 - i, .7 - i * .15); talk(c, L.T + i * .3, 21.69, 22.84, 'angry'); actuar(c, 0, [[0, i === 1 ? 'point' : { aRx: 1.2, aRe: .4, lean: .1 }]], { T: L.T }); });
  bubble(COPS[0], 'THOFORT!', (L.lt - .05) / .2); bubble(COPS[2], 'THTILL!', (L.lt - .45) / .2); classKids(L, [[1, 1]], 'laugh'); hero(...COPS.slice(0, 3));
  orbit(V(KLX - 8, 5.6, 3), lerp(19, 17, L.k), 1.0, .12, 44); sh(V(KLX - 8, 0, 3), 18); }, [[0, 'whoosh_soft', .4], [.2, 'giggle', .5], [.6, 'class_laugh', .4]]);
