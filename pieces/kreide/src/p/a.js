// ===== Parte 1: la regla, la ciudad, Emil, Krümel, Lea (0 – 47,1 s) =====
const KNEEL = { crouch: .5, lLx: 1.3, lLk: 1.9, lRx: -.1, lRk: 1.5, lean: .35, aRx: 1.1, aRe: .5, aLx: .4, aLe: .8, headX: .35 };
const SIT = { crouch: .9, lLx: 1.5, lRx: 1.5, lLk: .3, lRk: .3, lean: -.05, aLx: .3, aRx: .3 };
const RIDE = { crouch: .55, lLx: 1.3, lRx: 1.3, lLk: 1.2, lRk: 1.2, lLz: -.4, lRz: .4 };
const drawP = (T, sp = 9, o = {}) => ({ ...KNEEL, aRx: 1.25 + Math.sin(T * sp) * .28, aRz: Math.cos(T * sp) * .35, aRe: .45 + Math.sin(T * sp * 1.3) * .2, headX: .45, ...o });
const RIDEP = (T, i, scared = 0) => ({ ...RIDE, aLx: scared ? 1.0 : 2.6 + Math.sin(T * 6 + i) * .3, aRx: scared ? 1.0 : 2.4 + Math.cos(T * 6 + i) * .3, aLz: .4, aRz: .4, aLe: scared ? 1.5 : .3, aRe: scared ? 1.5 : .3, lean: scared ? .4 : -.1, headX: scared ? .2 : -.2, ...(scared ? shiver(T, 1.5) : {}) });
// gente de fondo: [ch, x, z, ry, modo, fase]
function bg(L, list) { for (const [ch, x, z, ry, m, ph = 0] of list) { const T = L.T + ph;
  if (m === 'walk' || m === 'run' || m === 'umbwalk') { caminar(ch, L.lt + ph, { x, z, ry, speed: m === 'run' ? 8 : 3.2, run: m === 'run', T, extra: m === 'umbwalk' ? walkArmsUmb(T) : undefined }); if (m === 'umbwalk') umbIn(ch, (ph * 7 | 0) % 6); cara(ch, T, { expr: m === 'run' ? 'shock' : 'happy', mouth: m === 'run' ? 'o' : 'smile' }); continue; }
  put(ch, x, 0, z, ry);
  if (m === 'draw') { applyPose(ch, drawP(T, 8 + ph)); chalkIn(ch, [CHALK2, CHALK3][(ph * 3 | 0) % 2]); cara(ch, T, { expr: 'happy', mouth: 'smile' }); }
  else if (m === 'cheer') { actuar(ch, L.lt, [[0, 'cheer']], { T }); laughF(ch, T); }
  else if (m === 'point') { actuar(ch, L.lt, [[0, 'point']], { T }); cara(ch, T, { expr: 'shock', mouth: 'o' }); }
  else if (m === 'look') { actuar(ch, L.lt, [[0, { headX: -.5, aLx: .3, aRx: .3 }]], { T }); cara(ch, T, { expr: 'shock', mouth: 'o' }); }
  else if (m === 'scared') { actuar(ch, L.lt, [[0, 'hands_face']], { T, extra: shiver(T) }); cara(ch, T, { expr: 'shock', mouth: 'grimace' }); }
  else if (m === 'umb') { umbIn(ch, (ph * 7 | 0) % 6); actuar(ch, L.lt, [[0, { aRx: 1.3, aRe: 1.4, aRz: -.1 }]], { T }); cara(ch, T, { expr: 'happy', mouth: 'smile' }); }
  else if (m === 'clap') { actuar(ch, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.35 + Math.abs(Math.sin(T * 9)) * .3, aRz: -.35 + Math.abs(Math.sin(T * 9)) * .3, aLe: .6, aRe: .6 }]], { T }); grin(ch, T); }
  else { actuar(ch, L.lt, [[0, 'idle']], { T }); cara(ch, T, { expr: 'happy' }); } } }
const walkArmsUmb = T => ({ aRx: 1.3, aRe: 1.4, aRz: -.1 });
const PLAZA_BG = (L, n = 120, mode = 'sway') => crowdAt(L.T, grid(-56, -76, 46, -40, n, 3, 0), mode);
// ---------- 1 · GANCHO: «In dieser Stadt wird alles, was du mit Kreide malst, lebendig …» ----------
// Emil dibuja a Krümel en el suelo y salta vivo; alrededor, monopatines, monigotes y el dragón cobran vida. Zoom lento hacia Emil.
shot(0, 'Z', null, L => { town(); PLAZA_BG(L, 90, 'cheer'); const T = L.T;
  put(emil, 0, 0, 0, .15); applyPose(emil, L.lt < 1.2 ? drawP(T, 11) : { ...KNEEL, aRx: 2.6, aRz: .4, aRe: .2, headX: -.1, lean: .1 }); chalkIn(emil); cara(emil, T, L.lt < 1.2 ? { expr: 'determined', mouth: 'smile' } : { eyes: 'wide', mouth: 'open_smile' });
  const kk = clamp((L.lt - .9) / .5); show(KRU, 2.6, 0, 3.2, -.3, Math.max(.01, spring(kk))); KRU.userData.anim(T, L.lt > 1.4 ? 1 : 0); KRU.position.y = L.lt > 1.4 ? Math.abs(Math.sin(T * 7)) * .8 : 0; puff(V(2.6, .6, 3.2), .9, T, 8, .35);
  dec(DC.dog, 2.6, 3.2, -.3, 1 - clamp((L.lt - .9) / .3));
  SKATE.forEach((s, i) => { const x = -18 + ((T * 9 + i * 9) % 36), z = -10 - i * 5; show(s, x, 0, z, PI / 2); put(K[i], x, .6, z, PI / 2); applyPose(K[i], { crouch: .25, aLz: .6, aRz: .6, lLx: .2, lRx: -.2, lean: .1 }); cara(K[i], T, { expr: 'happy', mouth: 'open_smile' }); });
  STK.update(T, [[-9, 0, -4, .4], [-12, 0, -8, .2], [9, 0, -6, -.4], [12, 0, -12, -.2], [-6, 0, -16, 0]]);
  DRA.g.visible = true; DRA.update(T, dpath(30 - L.lt * 6, 19, -26, 60, 2, -.15));
  bg(L, [[XT[0], -7, 4, .4, 'draw', .2], [XT[1], 8, -2, -.3, 'cheer'], [lea, -4, -6, .2, 'draw', .5]]);
  orb(L.k, V(1.0, 3.4, 1.6), null, [15, 0, .15, 50], [11, .05, .12, 46], easeOut); sh(V(0, 0, -6), 34); },
  [[.05, 'chalk', .8], [.6, 'chalk', .6], [.95, 'pop', .9], [1.05, 'sparkle', .7], [1.5, 'bark', .7]]);
// ---------- 1b · «… malst, lebendig …» : el dragón de tiza se despega del suelo con los niños subiéndose; monopatines y monigotes alrededor (zoom lento) ----------
shot(1.88, 'C', 'slow', L => { town(); PLAZA_BG(L, 110, 'cheer'); const T = L.T; const up = easeOut(clamp(L.lt / 1.3));
  DRA.g.visible = true; DRA.update(T, (s, t) => { const p = dpath(16, 1 + up * 15, -14, 60, up * 2, -.1)(s, t); p.y = Math.max(.8, p.y - s * up * 8); return p; }); riders(T, 0, RIDERS().slice(0, Math.min(7, 2 + Math.floor(L.lt * 6))));
  puff(V(0, 1, -14), L.t0, T, 16, 1.2, GDUST, 1.4);
  SKATE.slice(0, 2).forEach((s_, i) => { const x = -10 + i * 18 - L.lt * 6 * (i ? 1 : -1), z = 6 + i * 2; show(s_, x, 0, z, PI / 2 * (i ? -1 : 1)); put(K[6 + i], x, .6, z, PI / 2 * (i ? -1 : 1)); applyPose(K[6 + i], { crouch: .25, aLz: .7, aRz: .7, lean: .1 }); cara(K[6 + i], T, { eyes: 'happy', mouth: 'open_smile' }); });
  STK.update(T, [[-9, 0, 2, .5], [9, 0, 0, -.5], [-14, 0, -6, .3], [14, 0, -8, -.3]]);
  bg(L, [[emil, -2.5, 8, .2, 'cheer'], [lea, 2.5, 8, -.2, 'cheer', .3]]); show(KRU, 0, 0, 9, 0, .8); KRU.userData.anim(T, 1); KRU.position.y = Math.abs(Math.sin(T * 7)) * .8;
  orb(L.k, V(0, 7, -2), null, [42, 0, .12, 50], [30, .02, .14, 46], easeIn); sh(V(0, 0, -6), 40); },
  [[0, 'magic_hit', .8], [.1, 'growl', .7], [.4, 'kids_laugh', .6], [.9, 'wheels', .5], [1.2, 'cheer', .5]]);
// ---------- 2 · «bis es regnet.» : una nube negra, la primera gota cae sobre una flor de tiza y se derrite ----------
shot(3.54, 'F', 'punch', L => { town('storm'); const T = L.T; CLO.set(V(0, 0, -20), T, 1, 120, 55); RAIN.update(T, V(0, 0, 0), .3 + L.k * .7, 50, 40, 50);
  put(emil, 0, 0, 0, .1); actuar(emil, L.lt, [[0, { headX: -.55, aLx: .5, aRx: .5, aLz: .4, aRz: .4 }]], { T }); cara(emil, T, { expr: 'shock', mouth: 'o' }); show(KRU, 3.6, 0, 1.4, -.4); KRU.userData.anim(T, 0);
  STK.update(T, [[-3.2, 0, 1.2, .5, Math.max(.05, .8 - easeIn(L.k) * .75)]], 'wave'); puff(V(-3.2, .5, 1.2), L.t0 + .3, T, 8, .4);
  orbit(V(0, 2.8, .5), 16, .1, .25, 46); sh(V(0, 0, 0), 20); }, [[0, 'thunder', .9], [.1, 'rain', .7], [.4, 'drip', .7], [.6, 'water_bloop', .6]]);
// ---------- 3 · «Kinder malen sich Skateboards auf den Gehweg» ----------
shot(4.60, 'W', null, L => { town(); const T = L.T, X = 26 + 9, Z = 150;
  [[K[0], 0, 'draw', 0], [K[4], 4.5, 'draw', .4], [K[2], -4.5, 'draw', .7]].forEach(([c, dz, m, ph], i) => { put(c, X, 0, Z + dz, -PI / 2 + .25); applyPose(c, drawP(T + ph, 10)); chalkIn(c, [CHALK1, CHALK2, CHALK3][i]); cara(c, T, { expr: 'happy', mouth: 'smile' }); });
  const kk = clamp((L.lt - 1.1) / .4); show(SKATE[0], X - 3.5, 0, Z - 2.5, PI / 2, Math.max(.01, spring(kk))); puff(V(X - 3.5, .6, Z - 2.5), 1.1, T, 8, .4);
  dec(DC.skate, X - 3.5, Z - 2.5, PI / 2, 1 - kk);
  bg(L, [[XT[3], X + 4, Z - 14, PI, 'walk'], [XT[5], X - 18, Z - 8, .4, 'idle']]);
  orb(L.k, V(X - 1.6, 1.4, Z - .8), null, [17, -1.2, .75, 46], [15, -1.35, .72, 44]); sh(V(X, 0, Z), 20); }, [[.1, 'chalk', .8], [.7, 'chalk', .7], [1.1, 'pop', .9], [1.2, 'sparkle', .6]]);
// ---------- 4 · «und fahren damit zur Schule.» : bajan la calle en monopatines de tiza hacia el colegio ----------
shot(6.60, 'Z', null, L => { town(); const T = L.T, z0 = 150 + L.lt * 16;
  [[K[0], -2.5, 0], [K[4], 2.5, 2.4], [K[2], 0, -2.6], [K[6], -5, -5]].forEach(([c, dx, dz], i) => { const x = 26 + dx, z = z0 + dz + Math.sin(T * 2 + i) * .5; show(SKATE[i], x, 0, z, 0); put(c, x, .6, z, 0); applyPose(c, { crouch: .3, aLz: .7 + Math.sin(T * 3 + i) * .2, aRz: .7, aLe: .3, aRe: .3, lLx: .25, lRx: -.25, lean: .15, headX: -.1 }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); });
  bg(L, [[XT[6], 26 + 9, z0 + 18, PI, 'walk'], [XT[1], 26 - 9, z0 + 26, PI, 'umbwalk', .3]]);
  cam([26 + Math.sin(L.k * 2) * 2, 9, z0 - 19 + L.k * 2], [26, 1.4, z0 + 20], 46); sh(V(26, 0, z0), 30); }, [[0, 'wheels', .8], [.6, 'kids_laugh', .6], [1.1, 'wheels', .6]]);
// ---------- 5 · «Der Postbote malt an jeden Zaun eine Tür,» ----------
shot(8.14, 'S', null, L => { town(); const T = L.T; FD.userData.open(0);
  put(post, -30.6, 0, 148.6, PI - .45); const dr = L.lt < 1.8; actuar(post, L.lt, [[0, { aRx: 1.7 + Math.sin(T * 7) * .35, aRz: -.2 + Math.cos(T * 7) * .3, aRe: .3, lean: .1, aLx: .2 }]], { T }); chalkIn(post, CHALK2); cara(post, T, { expr: 'happy', mouth: 'smile' });
  attach(BAG, post.spine, [1.3, .3, .6], [0, 0, 0], .8);
  show(LETTER[0], -27, 4.6, 146.3, 0); LETTER[0].visible = false;
  bg(L, [[XT[2], -18, 160, -PI / 2, 'walk', .2]]);
  orb(L.k, V(-29.6, 3.2, 147.5), null, [20, 1.3, .14, 44], [17, 1.1, .12, 42]); sh(V(-30, 0, 146), 20); }, [[0, 'chalk', .9], [.8, 'chalk', .8], [1.6, 'chalk', .7], [2.2, 'sparkle', .5]]);
// ---------- 6 · «damit er nie mehr außen herumlaufen muss.» : abre la puerta de tiza y pasa al jardín ----------
shot(10.68, 'R', null, L => { town(); const T = L.T; const op = easeOut(clamp(L.lt / .5)); FD.userData.open(op);
  caminar(post, Math.max(0, L.lt - .3), { x: -30, z: 149.5, ry: PI, speed: 4.6, T, extra: { aRx: .9, aRe: 1.2 } }); attach(BAG, post.spine, [1.3, .3, .6], [0, 0, 0], .8); cara(post, T, { expr: 'happy', mouth: 'open_smile' }); attach(LETTER[1], post.aR.hand, [0, -.6, .3], [0, 0, 0], 1);
  bg(L, [[XT[5], -24.5, 140, PI - .3, 'clap']]);
  orb(L.k, V(-30, 3.2, 145), V(-30, 3.2, 143), [17, PI - .45, .12, 44], [15, PI - .2, .12, 44]); sh(V(-30, 0, 146), 20); }, [[0, 'door_open', .8], [.3, 'steps', .7], [1.0, 'steps', .6], [1.5, 'paper', .5]]);
// ---------- 7 · «Aber Regen wischt alles weg.» : la lluvia borra un dibujo y un monopatín de tiza se deshace ----------
shot(12.77, 'C', 'punch', L => { town('storm'); const T = L.T; CLO.set(V(0, 0, 0), T, 1, 140, 60); RAIN.update(T, V(0, 0, 0), 1, 40, 40, 40);
  const m = easeIn(L.k); show(SKATE[1], 0, 0, 0, .4, 1); SKATE[1].scale.set(1 + m * .4, Math.max(.05, 1 - m), 1 + m * .4); puff(V(0, .5, 0), .2, T, 14, .7);
  put(K[3], -2.8, 0, -1.2, .4); actuar(K[3], L.lt, [[0, 'hands_head']], { T }); cara(K[3], T, { expr: 'shock', mouth: 'grimace' });
  STK.update(T, [[2.6, 0, -1.4, -.4, Math.max(.05, .8 - m * .75)]], 'wave');
  orbit(V(0, 2, -.6), 15, .05, .36, 46); sh(V(0, 0, 0), 20); }, [[0, 'rain', .8], [.3, 'water_bloop', .7], [.8, 'drip', .6], [1.2, 'gasp', .5]]);
// ---------- 8 · «Deshalb hat hier jeder immer einen Regenschirm dabei –» : calle con todos llevando paraguas ----------
shot(14.61, 'W', null, L => { town(); const T = L.T;
  bg(L, [[XT[0], -6, 22, 0, 'umbwalk', .1], [XT[2], 2, 14, 0, 'umbwalk', .5], [XT[6], 8, 26, .2, 'umbwalk', .9], [XT[3], -12, 10, .1, 'umbwalk', 1.3], [XT[5], 12, 6, -.1, 'umbwalk', 1.7]]);
  put(emil, -1, 0, 30 + L.lt * 3.2, 0); caminar(emil, L.lt, { x: -1, z: 30, ry: 0, speed: 3.2, T }); umbIn(emil, 0, .8); cara(emil, T, { expr: 'happy', mouth: 'smile' });
  crowdAt(T, grid(-50, -70, 40, -30, 80, 5, 0), 'sway');
  orb(L.k, V(-1, 3, 36), V(-1, 3, 42), [22, .1, .12, 46], [20, -.1, .12, 46]); sh(V(0, 0, 26), 40); }, [[0, 'steps', .7], [.8, 'umbrella', .6], [1.6, 'steps', .6], [2.0, 'birds', .4]]);
// ---------- 9 · «sogar bei strahlendem Sonnenschein.» : la abuela en el café, sol a tope, con el paraguas abierto ----------
shot(17.09, 'F', null, L => { town(); const T = L.T; bloom.strength = .5; bloom.threshold = .7; grade.uniforms.lift.value = .04;
  put(XT[5], 33, 0, -33, -PI / 2 - .3); applyPose(XT[5], { ...SIT, crouch: .45, lLx: 1.3, lRx: 1.3, lLk: 1.3, lRk: 1.3, aRx: 1.4, aRe: 1.3 }); umbIn(XT[5], 1, .9); cara(XT[5], T, { expr: 'happy', mouth: 'smile', eyes: 'squint' }); sweat(XT[5], T);
  put(XT[6], 29.5, 0, -36, -PI / 2 + .1); applyPose(XT[6], { aRx: 1.3, aRe: 1.4 }); umbIn(XT[6], 4, .9); cara(XT[6], T, { expr: 'happy', mouth: 'smile' });
  badge3('gold', '☀ 31°', V(31, 13, -34), (L.lt - .2) * 2);
  orb(L.k, V(31.4, 4.4, -34.5), null, [21, -1.45, .1, 46], [18, -1.3, .08, 44]); sh(V(32, 0, -34), 20); }, [[0, 'sparkle', .6], [.3, 'sip', .6], [.9, 'birds', .4]]);
// ---------- 10 · «Und das Geräusch, vor dem hier alle am meisten Angst haben,» : la gente se queda helada mirando arriba ----------
shot(18.89, 'Z', 'slow', L => { town(); const T = L.T; grade.uniforms.sat.value = 1.3;
  bg(L, [[XT[0], -4, 0, .2, 'scared'], [XT[2], 4, -2, -.2, 'look'], [XT[3], 0, -5, 0, 'scared', .3], [K[1], -7.5, -3, .4, 'look'], [K[5], 7.5, -4, -.3, 'scared', .6]]);
  crowdAt(T, grid(-40, -60, 30, -16, 70, 9, 0), 'still', true);
  orb(L.k, V(0, 4, -2), null, [26, 0, .1, 46], [17, .05, .06, 44], easeIn); sh(V(0, 0, -2), 30); }, [[0, 'wind', .6], [.6, 'heartbeat', .8], [1.6, 'heartbeat', .7]]);
// ---------- 11 · «ist die Regensirene.» : la sirena desde abajo, empieza a girar ----------
shot(21.75, 'C', 'punch', L => { town(); const T = L.T; SIR.userData.on(T, L.lt > .2);
  bg(L, [[K[3], -36 + 2.5, -16 + 4, PI * .2, 'look'], [XT[4], -36 - 3, -16 + 5, -.2, 'scared']]);
  orb(L.k, V(-36, 11, -16), null, [34, .75, -.2, 48], [30, .85, -.24, 46]); sh(V(-36, 0, -16), 24); }, [[.15, 'siren', 1.0]]);
// ---------- 12 · «Sobald sie heult, rennen alle los,» : la plaza entera corre ----------
shot(22.99, 'W', null, L => { town(); const T = L.T; SIR.userData.on(T, true);
  bg(L, [[XT[0], -10, 20, 0, 'run'], [XT[1], 2, 14, .2, 'run', .3], [XT[2], 10, 24, -.2, 'run', .6], [K[0], -4, 8, .1, 'run', .2], [K[4], 6, 2, -.1, 'run', .5], [XT[3], -14, 0, .3, 'run', .8], [K[2], 14, 10, -.3, 'run', .1]]);
  crowdAt(T, grid(-50, -60, 40, -10, 90, 7, 0), 'cheer');
  orb(L.k, V(0, 3, 22 + L.lt * 7), null, [18, 0, .12, 48], [16, .12, .12, 48]); sh(V(0, 0, 20), 40); }, [[0, 'crowd_run', .9], [.4, 'siren', .5], [1.2, 'shout_m', .4]]);
// ---------- 13 · «um ihre Bilder zu retten.» : cogen sus dibujos vivos (gata, monopatín, monigote) y los ponen a salvo ----------
shot(24.89, 'S', null, L => { town(); const T = L.T; SIR.userData.on(T, true);
  const wq = caminar(XT[0], L.lt, { x: -6, z: 18, ry: .15, speed: 7, run: true, T, extra: { aLx: 1.2, aRx: 1.2, aLe: .7, aRe: .7, aLz: -.25, aRz: -.25 } }); const cp = loc(XT[0], 0, 1.2, 2.2); show(CAT, cp.x, cp.y, cp.z, .15 + PI / 2, .42); CAT.userData.anim(T); cara(XT[0], T, { expr: 'shock', mouth: 'o' });
  caminar(K[1], L.lt, { x: 1, z: 12, ry: .1, speed: 8, run: true, T }); attach(SKATE[2], K[1].aR.hand, [0, -.6, .8], [PI / 2, 0, 0], .7 / .66); cara(K[1], T, { expr: 'determined', mouth: 'o' });
  caminar(K[7], L.lt, { x: 6, z: 8, ry: -.1, speed: 7.5, run: true, T }); cara(K[7], T, { expr: 'shock', mouth: 'o' }); STK.update(T, [[6 + Math.sin(-.1) * 7.5 * L.lt + 1.6, 0, 8 + 7.5 * L.lt, 0, .55]], 'dance');
  orb(L.k, V(-2.5, 3, 20 + L.lt * 7), null, [14, .15, .12, 46], [13, 0, .12, 46]); sh(V(0, 0, 18), 30); }, [[0, 'run_cobble', .8], [.4, 'meow', .6]]);
// ---------- 14 · «Ich heiße Emil.» ----------
shot(25.83, 'I', 'punch', L => { town(); PLAZA_BG(L, 70); const T = L.T;
  put(emil, 0, 0, 0, .1); actuar(emil, L.lt, [[0, 'wave']], { T }); chalkIn(emil); talk(emil, T, L.t0, L.t1, 'happy'); show(KRU, 3.2, 0, 1.2, -.4); KRU.userData.anim(T, 0);
  badge3('tag', 'EMIL', hp(emil).add(V(0, 2.4, 0)), (L.lt - .15) * 2.5);
  bg(L, [[XT[1], -9, -10, .3, 'draw', .4], [K[2], 8, -12, -.4, 'draw', .1]]);
  orb(L.k, V(.8, 2.6, 0), null, [13, .3, .12, 44], [12, .1, .1, 44]); sh(V(0, 0, 0), 20); }, [[0, 'pop', .7], [.3, 'bark', .5]]);
// ---------- 15 · «Ich bin elf» ----------
shot(26.98, 'C', null, L => { town(); PLAZA_BG(L, 70); const T = L.T;
  put(emil, 0, 0, 0, -.2); actuar(emil, L.lt, [[0, { aRx: 2.6, aRz: .1, aRe: .2, aLx: 2.6, aLz: .1, aLe: .2 }]], { T }); grin(emil, T);
  badge3('big', '11', hp(emil).add(V(0, 3, 0)), (L.lt - .1) * 3, 1.3);
  orb(L.k, V(0, 2.8, 0), null, [11, -.2, .2, 44], [10, -.35, .2, 44]); sh(V(0, 0, 0), 20); }, [[.1, 'ding_soft', .8]]);
// ---------- 16 · «und male schlechter als jeder andere in dieser Stadt.» : todos hacen obras maestras; lo de Emil es un garabato ----------
shot(27.78, 'W', null, L => { town(); const T = L.T;
  put(emil, 0, 0, 0, 0); applyPose(emil, drawP(T, 12)); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'frown' });
  dec(DC.scrib, 0, 3.4, 0); dec(DC.mast1, -4.2, 3.6, .2); dec(DC.mast2, 4.4, 3.6, -.2);
  bg(L, [[XT[0], -4.4, 0, .1, 'draw', .3], [XT[1], 4.6, 0, -.1, 'draw', .6], [K[5], -3.2, -6, .2, 'point'], [K[6], 3.4, -6.5, -.2, 'cheer']]);
  orb(L.k, V(0, 2.2, 0), null, [24, -.15, .42, 46], [21, .15, .4, 46]); sh(V(0, 0, 0), 24); }, [[0, 'chalk', .8], [.9, 'kids_laugh', .6], [1.6, 'chalk', .6]]);
// ---------- 17 · «Egal, was ich male –» : Emil dibuja deprisa con la lengua fuera ----------
shot(30.25, 'S', null, L => { town(); const T = L.T;
  put(emil, 0, 0, 0, .3); applyPose(emil, drawP(T, 15, { headX: .5 })); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'grimace' }); puff(V(0, .3, 2), L.t0 + .3, T, 6, .25);
  orbit(V(0, 2.2, .6), 11 - L.k * 1.5, .3 - L.k * .2, .16, 44); sh(V(0, 0, 0), 14); }, [[0, 'chalk', 1], [.5, 'chalk', .8]]);
// ---------- 18 · «am Ende wird es immer ein Strichmännchen.» : un monigote se levanta del dibujo y saluda; Emil se tapa la cara ----------
shot(31.46, 'Z', null, L => { town(); PLAZA_BG(L, 60); const T = L.T;
  put(emil, -2.2, 0, 0, .55); actuar(emil, L.lt, [[0, { ...KNEEL, aRx: .4 }], [1.0, { ...KNEEL, aRx: 2.3, aRz: -.45, aRe: 2.35, headX: .34 }]], { T }); cara(emil, T, L.lt > 1.0 ? { eyes: 'closed', mouth: 'frown' } : { expr: 'shock', mouth: 'o' });
  const kk = spring(clamp((L.lt - .15) / .5)); STK.update(T, [[1.6, 0, 1, -.6, Math.max(.01, kk * .9)]], 'wave'); puff(V(1.6, .6, 1), L.t0 + .1, T, 6, .3);
  orb(L.k, V(-.2, 2.6, .5), null, [15, .05, .15, 44], [13, -.1, .15, 44]); sh(V(0, 0, 0), 16); }, [[.1, 'pop', .9], [.3, 'sparkle', .5], [1.0, 'sigh', .6]]);
// ---------- 19 · «Mein Hund Krümel ist ein Kreis mit vier Strichen.» ----------
shot(33.68, 'F', null, L => { town(); PLAZA_BG(L, 50); const T = L.T;
  show(KRU, 0, 0, 0, 0, 1.15); KRU.userData.anim(T, 0); KRU.position.y = Math.abs(Math.sin(T * 6)) * .6;
  put(emil, -3.4, 0, -1.8, .5); actuar(emil, L.lt, [[0, 'point_l']], { T }); grin(emil, T); chalkIn(emil);
  badge3('big', '4', V(0, 7.5, 0), (L.lt - 1.6) * 3, 1.2);
  orb(L.k, V(-1.4, 2.8, -.5), null, [15, .2, .12, 44], [13, .05, .1, 42]); sh(V(0, 0, 0), 14); }, [[0, 'bark', .8], [.9, 'spring', .5], [1.7, 'ding_soft', .8]]);
// ---------- 20 · «Na gut, drei. Einen hab ich vergessen.» : Krümel cojea con tres patas; Emil se encoge de hombros ----------
shot(36.26, 'C', 'punch', L => { town(); PLAZA_BG(L, 50); const T = L.T;
  show(KRU, -L.lt * 1.2 + .6, 0, 0, -PI / 2 + .4, 1.1); KRU.userData.anim(T, 1); KRU.rotation.z = Math.sin(T * 9) * .12;
  put(emil, 3.5, 0, -1, -.4); actuar(emil, L.lt, [[0, 'shrug']], { T }); talk(emil, T, L.t0, L.t1, 'happy', { eyes: 'happy' });
  badge3('red', '3', V(0, 7, 0), (L.lt - .3) * 3, 1.2);
  orb(L.k, V(1.2, 2.6, 0), null, [15, -.1, .15, 44], [14, .1, .15, 44]); sh(V(0, 0, 0), 14); }, [[.1, 'boing_metal', .6], [.5, 'ding_soft', .6], [1.2, 'bark', .5]]);
// ---------- 21 · «Lea, die beste Künstlerin der Stadt,» : Lea dibuja, la gente aplaude ----------
shot(38.29, 'W', null, L => { town(); const T = L.T;
  put(lea, 0, 0, 0, 0); applyPose(lea, drawP(T, 6, { headX: .3 })); chalkIn(lea, CHALK2); cara(lea, T, { expr: 'happy', mouth: 'smile', eyes: L.lt > 1 ? 'happy' : 'normal' });
  badge3('tag', 'LEA', hp(lea).add(V(0, 2.5, 0)), (L.lt - .1) * 2.5);
  bg(L, [[XT[1], -4, -6, .4, 'clap'], [XT[2], 4.5, -6, -.4, 'clap', .2], [K[4], -2.6, -7, .2, 'cheer'], [XT[6], 2.8, -8, -.1, 'clap', .5]]);
  crowdAt(T, grid(-20, -30, 20, -12, 40, 4, 0), 'cheer');
  orb(L.k, V(0, 2.4, -1), null, [17, .1, .2, 46], [14, -.1, .18, 44]); sh(V(0, 0, -2), 24); }, [[0, 'clap', .8], [.6, 'cheer', .6], [1.2, 'chalk', .5]]);
// ---------- 22 · «hat fünf Tage an ihrer Katze gemalt.» : la gata de tiza detallada se levanta y estira ----------
shot(40.38, 'Z', null, L => { town(); const T = L.T; const kk = spring(clamp((L.lt - .2) / .6));
  show(CAT, 1, 0, 0, .3, Math.max(.01, kk * 1.1)); CAT.userData.anim(T); puff(V(1, 1, 0), L.t0 + .2, T, 8, .4);
  put(lea, -4.4, 0, -1.8, .6); actuar(lea, L.lt, [[0, 'cheer']], { T }); laughF(lea, T);
  badge3('gold', '5 TAGE', V(0, 9.5, 0), (L.lt - .3) * 2.5, 1.1);
  orb(L.k, V(-1, 3, 0), null, [19, .35, .12, 44], [17, .15, .1, 44]); sh(V(0, 0, 0), 18); }, [[.2, 'magic_hit', .7], [.4, 'meow', .8], [.6, 'ding_soft', .6], [1.2, 'sparkle', .5]]);
// ---------- 23 · «Für Krümel hab ich drei Sekunden gebraucht –» : garabato rapidísimo y ¡pop! ----------
shot(42.67, 'C', 'punch', L => { town(); const T = L.T;
  put(emil, 0, 0, 0, .2); applyPose(emil, drawP(T, 22)); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'grimace' });
  const kk = spring(clamp((L.lt - .9) / .4)); show(KRU, 3.6, 0, .6, -.5, Math.max(.01, kk)); KRU.userData.anim(T, 1); puff(V(3.6, .6, .6), L.t0 + .9, T, 6, .3);
  badge3('blue', '3 SEK', V(1.5, 7.5, 0), (L.lt - .1) * 3, 1.1);
  orb(L.k, V(1.6, 2.4, .4), null, [15, .3, .2, 44], [14, .15, .18, 44]); sh(V(0, 0, 0), 14); }, [[0, 'chalk', 1], [.4, 'tick', .6], [.9, 'pop', .9], [1.2, 'bark', .6]]);
// ---------- 24 · «und trotzdem ist er der beste Hund der Welt.» : abrazo con Krümel al atardecer ----------
shot(44.83, 'F', null, L => { town('morning'); const T = L.T;
  put(emil, -1.2, 0, 0, .5); actuar(emil, L.lt, [[0, { ...KNEEL, aLx: 1.3, aRx: 1.3, aLz: -.5, aRz: -.5, aLe: 1.3, aRe: 1.3, headX: .1, lean: .2, headY: .3 }]], { T }); cara(emil, T, { eyes: 'happy', mouth: 'open_smile' });
  show(KRU, 1.1, 0, 1.6, -.5, .9); KRU.userData.anim(T, 0); KRU.rotation.z = Math.sin(T * 4) * .1;
  badge3('gold', '♥', V(0, 7, 1), (L.lt - .3) * 2, 1.2);
  orb(L.k, V(.2, 2.5, .6), null, [15, .1, .1, 44], [13, .3, .08, 42]); sh(V(0, 0, 0), 14); }, [[0, 'hug', .7], [.4, 'bark', .5], [1.0, 'sparkle', .5], [1.6, 'kids_laugh', .4]]);
