// ---------- a: gancho (zoom infinito CONTINUO, sin cortes) y presentación (0 – 15,35 s) ----------
// Un solo movimiento de cámara por ciclo, en un espacio conectado: la ciudad desde el aire → la puerta de la casa de Thomas (se abre) → el pasillo →
// la escalera que baja → el sótano justo debajo de la casa → la maqueta de la mesa. La pose final dentro de la maqueta es exactamente la pose inicial
// a escala, así que el siguiente ciclo empieza en la ciudad grande sin que se note: zoom infinito.
const MC = V(KX, TABLE_Y + 6 * MINI_S, 0);   // centro de la maqueta del sótano de los demás planos
const HP0 = [[0, 100, 36], [0, 0, -30], 46];   // pose aérea de la ciudad (relativa al centro de la plaza)
const toMini = p => V(HMC.x + p[0] * MINI_S, HMC.y + p[1] * MINI_S, HMC.z + p[2] * MINI_S);
const HK_KEYS = [   // u, posición, objetivo, fov
  [0, V(...HP0[0]), V(...HP0[1]), 46], [.16, V(1.5, 42, -6), V(3.25, 4, -52), 46], [.30, V(3.25, 3.6, -41), V(3.25, 3.2, -60), 50], [.37, V(3.25, 3.4, -51.5), V(3.25, 2.4, -62), 54],
  [.44, V(3.25, 3.2, -56), V(3.25, -8, -68), 56], [.58, V(3.25, -9.5, -69), V(3.25, -21, -86), 56], [.70, V(3.25, -16.5, -86), V(3.25, -23, -102), 52], [.84, V(3.25, -17.5, -96), V(3.25, -23, -104.5), 48],
  [1, toMini(HP0[0]), toMini(HP0[1]), 46]];
const HK_P = new THREE.CatmullRomCurve3(HK_KEYS.map(k => k[1]), false, 'centripetal'), HK_T = new THREE.CatmullRomCurve3(HK_KEYS.map(k => k[2]), false, 'centripetal');
function hookCam(u) { u = clamp(u); let i = 0; while (i < HK_KEYS.length - 2 && u > HK_KEYS[i + 1][0]) i++; const a = HK_KEYS[i], b = HK_KEYS[i + 1], f = clamp((u - a[0]) / (b[0] - a[0])), t = (i + f) / (HK_KEYS.length - 1);
  const p = HK_P.getPoint(t), q = HK_T.getPoint(t); cam([p.x, p.y, p.z], [q.x, q.y, q.z], lerp(a[3], b[3], easeInOut(f))); return p; }
// la velocidad dentro de cada ciclo: arranca rápido, se frena un pelín en la puerta y acelera al caer en la maqueta
const hookU = k => clamp(k * .82 + .18 * easeIn(k));
function hookLoop(L, cycles) { day(); scene.fog.density = 0; use('CI', 'FT', 'HK'); CITY.userData.CARS.forEach(c => c.visible = false);
  // ciclo actual según la hora absoluta
  let c = 0; while (c + 1 < cycles.length && L.T >= cycles[c + 1]) c++; const t0 = cycles[c], t1 = c + 1 < cycles.length ? cycles[c + 1] : t0 + 2.2, u = hookU((L.T - t0) / (t1 - t0));
  const p = hookCam(u); CITY.userData.TH.userData.doorPiv.rotation.y = 1.55 * easeOut(clamp((u - .2) / .12));
  const under = p.z < -52.6; CITY.visible = !under;   // bajo la casa no se ve la ciudad (y no tapa el sol de la maqueta)
  SPEED = .35 + .35 * Math.sin(u * Math.PI); BLUR = .006 * Math.sin(u * Math.PI);
  if (under) sh(V(HMC.x, HMC.y, HMC.z), 12); else sh(V(0, 0, -30), 90);
  // golpe de zoom al empezar cada frase (sin corte)
  const since = L.T - t0; if (c > 0 && since < .2) camera.fov *= lerp(.75, 1, easeOut(since / .2)); }
const HOOK_C = [0, 2.19, 4.50, 6.60, 8.8];
shot(0, 'W', null, L => hookLoop(L, HOOK_C), [[0, 'whoosh', .6], [.45, 'door', .5], [.75, 'steps', .5], [1.15, 'whoosh', .5], [1.5, 'sparkle', .4],
  [2.19, 'impact', .5], [2.64, 'door', .5], [2.95, 'steps', .5], [3.4, 'whoosh', .5], [3.8, 'sparkle', .4], [4.50, 'impact', .5], [4.95, 'door', .5], [5.25, 'steps', .5], [5.7, 'whoosh', .5], [6.1, 'sparkle', .4], [6.60, 'impact', .6]]);

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
