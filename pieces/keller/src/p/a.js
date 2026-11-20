// ---------- a: gancho (zoom infinito) y presentación (0 – 15,35 s) ----------
// Ciclo del zoom infinito, como el original: A ciudad desde el aire → B fachada roja de la casa de Thomas (ventana) → C escalera que baja → D sótano: la maqueta,
// y la cámara se mete en la maqueta hasta que vuelve a ser A. Cada paso empuja la cámara hacia delante (acelera) con rayas de velocidad.
const MC = V(KX, TABLE_Y + 6 * MINI_S, 0);   // centro de la maqueta en el sótano
const zIn = k => easeIn(clamp(k)) * .55 + clamp(k) * .45;
// A: la ciudad desde el aire, empujando hacia la plaza y la casa de Thomas
function stepA(L, v = 0) { use('CI'); day(); plazaLife(L.T, 14, 3 + v); const k = zIn(L.k);
  cm([v * 6, 92, 92, 0, 0, -18, 46], [v * 4, 58, 52, 0, 2, -30, 42], k, x => x); SPEED = .5 * L.k; sh(V(0, 0, -20), 80); }
// B: fachada de ladrillo de la casa de Thomas, la cámara se lanza hacia la ventana blanca del primer piso
function stepB(L, v = 0) { use('CI'); day(); const wx = [-3.25, 3.25, -9.75][v % 3], wy = 11.4; const k = zIn(L.k);
  for (let i = 0; i < 3; i++) stroll(EX[16 + i], [-14 + i * 9, -44], [-6 + i * 9, -44], L.T, 6, i);
  cm([wx * .6, 9, -16, wx, wy, -52, 42], [wx, wy, -44.5, wx, wy, -52, 38], k, x => x); SPEED = .45 * L.k; sh(V(0, 0, -50), 30); }
// C: la escalera que baja al sótano (desde arriba), cayendo hacia la puerta con luz
function stepC(L) { use('TR'); inside(.9, 0); const k = zIn(L.k);
  cm([TX, 36, 8, TX, 6, -30, 52], [TX, 18, -16, TX, 2, -35, 48], k, x => x); SPEED = .5 * L.k; sh(V(TX, 0, -14), 30); }
// D: el sótano: la mesa con la maqueta; la cámara cae dentro de la maqueta (al final encaja con A)
function stepD(L, v = 0) { use('KE'); inside(.95, 0); const k = zIn(L.k);
  const a = [KX + v * 2, 17, 19, KX, TABLE_Y, -2, 50], b = [KX, MC.y + 92 * MINI_S, 92 * MINI_S + .2, KX, MC.y, -18 * MINI_S, 46];
  cm(a, b, k, x => x); SPEED = .5 * L.k; sh(V(KX, 0, 0), 30); }
// ciclo 1: «In dieser Stadt gibt es eine Stadt!»
shot(0, null, null, L => stepA(L, 0), [[0, 'whoosh', .6], [.1, 'city_amb', .4]]);
shot(.51, null, null, L => stepB(L, 0), [[0, 'whoosh', .5]]);
shot(.87, null, null, L => stepC(L), [[0, 'whoosh', .5], [.1, 'steps', .4]]);
shot(1.29, null, null, L => stepD(L, 0), [[0, 'whoosh', .6], [.2, 'sparkle', .4]]);
// ciclo 2: «Und in dieser Stadt gibt es noch eine Stadt!»
shot(2.19, 'C', 'punch', L => stepA(L, 1), [[0, 'impact', .5]]);
shot(2.65, null, null, L => stepB(L, 1), [[0, 'whoosh', .5]]);
shot(2.95, null, null, L => stepC(L), [[0, 'whoosh', .5], [.1, 'steps', .4]]);
shot(3.41, null, null, L => stepD(L, 1), [[0, 'whoosh', .6], [.3, 'sparkle', .4]]);
// ciclo 3: «Und in dieser Stadt – jap – noch eine Stadt!»
shot(4.50, 'C', 'punch', L => stepA(L, -1), [[0, 'impact', .5]]);
shot(5.05, null, null, L => stepB(L, 2), [[0, 'whoosh', .5]]);
shot(5.42, null, null, L => stepC(L), [[0, 'whoosh', .5], [.1, 'steps', .4]]);
shot(5.83, null, null, L => stepD(L, 2), [[0, 'whoosh', .6]]);
shot(6.60, 'F', 'punch', L => stepA(L, 2), [[0, 'impact', .6], [.1, 'sparkle', .5]]);

// «Ich heiße Thomas, und»: yo en el sótano junto a la maqueta, saludo a cámara
shot(7.13, 'W', null, L => { use('KE'); inside(.95, 0); const c = put(ich, KX - 7.5, 0, 3, .3);
  actuar(c, 0, [[0, 'wave']], { T: L.T }); talk(c, L.T, 7.13, 8.31, 'joy', { eyes: 'happy' });
  orb(L.k, V(KX - 6, 3.4, 3), null, [15, .42, .12, 46], [12.5, .3, .1, 46]); sh(V(KX, 0, 4), 22); }, [[0, 'pop', .4], [.2, 'zoom_fast', .3]]);
// «in meiner Stadt hat»: grúa sobre mi ciudad viva (gente en la plaza, coches)
shot(8.31, 'Z', null, L => { use('CI'); day(); plazaLife(L.T, 18, 11);
  cm([-22, 62, 44, 0, 0, -14, 50], [-4, 74, 50, 0, 0, -18, 48], L.k); sh(V(0, 0, 0), 60); }, [[0, 'city_amb', .5], [.4, 'car_pass', .4]]);
// «jeder eine winzige Stadt»: la vecina se inclina sobre SU maqueta (otro sótano, otro ángulo)
shot(9.35, 'S', null, L => { use('KE'); inside(.95, 0); const c = put(pohl, KX + 1, 0, -6.4, 0); actuar(c, 0, [[0, { lean: .35, headX: .4, aLx: 1.0, aRx: 1.0, aLz: -.25, aRz: -.25, aLe: .6, aRe: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile' });
  orb(L.k, V(KX + .5, 3.6, -3), null, [15, -.25, .4, 44], [12.5, -.05, .42, 44]); sh(V(KX, 0, -4), 22); }, [[0, 'swipe', .4], [.3, 'sparkle', .4]]);
// «im Keller.»: corte de la casa de muñecas: el sótano bajo la casa, con su mesa y su maqueta
shot(10.47, 'C', 'punch', L => { use('PU'); day(); const c = put(EX[2], PX + .6, -15, -6.6, 0); actuar(c, 0, [[0, { lean: .12, headX: .12, aRx: .8 + Math.sin(L.T * 3) * .1, aLx: .8, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  cm([PX + 3, -3, 34, PX + 1, -10, -3, 40], [PX + 1.5, -6, 23, PX + .5, -11, -3, 40], L.k); sh(V(PX, 0, 0), 40); }, [[0, 'thud', .5]]);
// «Und die winzigen Leute da unten»: dentro de la maqueta, a ras de suelo: un vecino diminuto pasea entre flores; arriba, mi cara gigante
shot(11.45, 'Z', null, L => { use('KE'); inside(1.0, 0); const s = MINI_S;
  // vecinos diminutos paseando por la plaza de la maqueta (extras reales a escala de la maqueta), la cámara a su altura, retrocediendo delante del primero
  const wz = (13 + L.k * 7) * s, wx = KX + 1 * s;
  [[EX[5], wx, wz, 0], [EX[8], wx - 4.5 * s, wz - 9 * s, 1], [EX[11], wx + 4.5 * s, wz - 11 * s, 2]].forEach(([c, x, z, i]) => { put(c, x, MC.y + .5 * s, z, 0); c.root.scale.setScalar(.95 * s); actuar(c, 0, [[0, walkP(L.T, i * 1.7)]], { T: L.T }); cara(c, L.T + i, { expr: 'joy', eyes: i ? undefined : 'happy', mouth: i ? 'smile' : 'open_smile' }); });
  cm([wx + 1.5 * s, MC.y + 6 * s, wz + 15 * s, wx, MC.y + 4 * s, wz - 3 * s, 46], [wx + 1 * s, MC.y + 5.5 * s, wz + 12 * s, wx, MC.y + 4 * s, wz - 3 * s, 46], L.k); sh(V(KX, 0, 0), 22); }, [[0, 'steps', .4], [.4, 'birds', .4]]);
// «haben eine noch winzigere Stadt»: desde el aire, bajando hacia la casa cortada
shot(12.85, 'W', 'slow', L => { use('PU'); day(); PU.userData.roof.visible = false; const c = put(EX[2], PX + .6, -15, -6.6, 0); actuar(c, 0, [[0, { lean: .12, headX: .12, aRx: .8 + Math.sin(L.T * 3) * .1, aLx: .8, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'smile' });
  cm([PX + 8, 26, 70, PX, -2, -4, 46], [PX + 2, -1, 34, PX, -10, -3, 44], L.k); sh(V(PX, 0, 0), 40); }, [[0, 'whoosh', .4]]);
// «in ihrem Keller.»: primer plano de la mesa del sótano diminuto, con su maqueta aún más pequeña
shot(14.37, 'C', 'punch', L => { use('PU'); day(); const c = put(EX[2], PX + .6, -15, -6.6, 0); actuar(c, 0, [[0, { lean: .12, headX: .12, aRx: .8 + Math.sin(L.T * 3) * .1, aLx: .8, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  cm([PX + 1.5, -6.5, 12, PX + .5, -11, -3, 50], [PX + 1.2, -7.4, 9.5, PX + .5, -11.3, -3, 48], L.k); sh(V(PX, -15, 0), 20); }, [[0, 'impact', .5], [.2, 'sparkle', .4]]);
// (provisional: fin de la prueba del gancho)
shot(15.35, null, null, L => { use('KE'); inside(.95, 0); orbit(MC, 20, 0, .5, 44); sh(V(KX, 0, 0), 22); });
