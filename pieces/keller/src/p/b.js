// ---------- b: la pesadilla, el niño diminuto, la lupa, otro Thomas (15,35 – 47,88 s) ----------
const kel = (L, lamp = 110) => { use('KE'); inside(1.0, 0); KE.userData.LAMPS.forEach(l => l.intensity = lamp); sh(V(KX, 0, 0), 20); };
// yo detrás de la mesa (lado norte), mirando la maqueta (+z)
const atTable = (ch, T, pose = {}, x = KX, z = -6.6) => { put(ch, x, 0, z, 0); actuar(ch, 0, [[0, { lean: .3, headX: .35, aLx: .9, aRx: .9, aLz: -.2, aRz: -.2, aLe: .5, aRe: .5, ...pose }]], { T }); return ch; };
// personaje a escala de maqueta, en coordenadas de la ciudad (x, z)
const tiny = (c, x, z, ry = 0, f = 1) => { put(c, KX + x * MINI_S, MC.y + .5 * MINI_S, z * MINI_S, ry); c.root.scale.setScalar((c.spec.scale || 1) * MINI_S * f); return c; };
const mw = (x, y, z) => V(KX + x * MINI_S, MC.y + y * MINI_S, z * MINI_S);   // punto de la maqueta
const sneeze = (T, t0) => { const k = T - t0; if (k < 0) return {}; return k < .35 ? { headX: -.35 * easeOut(k / .35), lean: -.15 } : { headX: .5, lean: .45 }; };

// «Klingt cool, oder?»: a ras de la maqueta; yo, gigante, sonriendo detrás de los tejados
shot(15.35, 'Z', null, L => { kel(L); atTable(ich, L.T, { headX: .25 }); talk(ich, L.T, 15.35, 16.2, 'joy', { eyes: 'happy' });
  const h = hp(ich); cm([KX + 6 * MINI_S, MC.y + 44 * MINI_S, 100 * MINI_S, h.x, h.y - .2, h.z, 50], [KX + 4 * MINI_S, MC.y + 40 * MINI_S, 90 * MINI_S, h.x, h.y - .1, h.z, 48], L.k); }, [[0, 'whoosh', .4], [.3, 'sparkle', .4]]);
// «Glaub mir,»: primer plano, me pongo serio
shot(16.37, 'C', 'punch', L => { kel(L); atTable(ich, L.T, { headX: .05, lean: .1 }); talk(ich, L.T, 16.37, 17.0, 'sus', { eyes: 'half', mouth: 'flat' });
  onFace(ich, 5.2, .8, .4, 42, L.k, 4.6); }, [[0, 'thud', .4]]);
// «es ist ein Albtraum.» (zoom lento): me tapo la cara, la maqueta delante
shot(17.09, null, 'slow', L => { kel(L, 70); atTable(ich, L.T, { ...GEST.facepalm, lean: .1 }); cara(ich, L.T, { expr: 'sad', eyes: 'closed', mouth: 'frown' });
  orb(L.k, V(KX, 3.6, -6), null, [13, 0, .38, 44], [10, 0, .34, 42]); }, [[0, 'groan', .4]]);
// «Wenn ich niese,»: echo la cabeza atrás… ¡achís! sobre la maqueta
shot(18.40, 'W', null, L => { kel(L); const t0 = 18.95; atTable(ich, L.T, { ...sneeze(L.T, t0), aLx: .6, aRx: .6 }); cara(ich, L.T, L.T < t0 ? { expr: 'shock', eyes: 'squint', mouth: 'o' } : { eyes: 'closed', mouth: 'shout' });
  if (L.T > t0 + .3) for (let i = 0; i < 8; i++) { const d = SWEAT[i % 3]; }
  dust(V(KX, MC.y + .3, -1.5), t0 + .3, L.T, 14, .5); orb(L.k, V(KX, 3.6, -4.5), null, [12, .5, .42, 46], [11, .42, .4, 46]); }, [[.4, 'gasp', .4], [.55, 'sneeze', .7]]);
// «bekommt die Stadt unter mir einen Tornado.»: el tornado arrasa la plaza
shot(19.24, 'Z', 'punch', L => { use('CI'); day(); TOR.visible = true; TOR.position.set(-6 + L.k * 10, 0, -6); TOR.userData.update(L.T); setSky([.32, .38, .5], [.5, .55, .62], [.7, .72, .76]);
  [EX[0], EX[1], EX[3], EX[4]].forEach((c, i) => { const x = 18 + i * 5 - L.k * 6, z = 14 + (i % 2) * 6; put(c, x, .5, z, -Math.PI / 2 - .3); actuar(c, 0, [[0, runPoseK(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: 'shout' }); });
  cm([22, 14, 30, 0, 16, -6, 56], [18, 12, 26, 0, 18, -6, 56], L.k); SHAKE = .4; sh(V(0, 0, 0), 60); }, [[0, 'wind', .8], [.4, 'rumble', .5]]);
// «Wenn die niesen,»: un vecino diminuto estornuda en la plaza
shot(21.15, 'S', null, L => { use('CI'); day(); plazaLife(L.T, 10, 21, (x, z) => Math.abs(x - 2) < 7 && Math.abs(z - 22) < 8); const c = EX[7]; const t0 = 21.6;
  put(c, 2, .5, 22, -.3); actuar(c, 0, [[0, { ...sneeze(L.T, t0), aLx: .5, aRx: .5, aLe: 1.6, aRe: 1.6 }]], { T: L.T }); cara(c, L.T, L.T < t0 ? { expr: 'shock', eyes: 'squint', mouth: 'o' } : { eyes: 'closed', mouth: 'shout' });
  dust(V(2, 3, 24), t0 + .2, L.T, 10, .3); orbit(V(2, 3.6, 22), lerp(11, 9.5, L.k), -.3, .12, 44); sh(V(2, 0, 22), 16); }, [[.4, 'sneeze', .6]]);
// «bekommt die nächste ein Erdbeben.»: la ciudad tiembla, grietas y polvo
shot(22.05, 'C', 'punch', L => { use('CI'); day(); const q = Math.sin(L.T * 40) * .4;
  [EX[9], EX[10], EX[12]].forEach((c, i) => { put(c, -10 + i * 7, .5, 26 - i * 2, .2); actuar(c, 0, [[0, { ...GEST.shock, lean: Math.sin(L.T * 20 + i) * .2 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: 'shout' }); });
  dust(V(-4, 0, 22), 22.1, L.T, 16, 1.4); cm([-4 + q, 12, 52, -4, 6, 0, 50], [-4 - q, 10, 46, -4, 6, -4, 50], L.k); SHAKE = 1; sh(V(0, 0, 10), 50); }, [[0, 'rumble', .8], [.3, 'crash', .5]]);
// «Neun Städte tiefer»: bajada en picado por la escalera de nuevo, el contador sube 1…9
shot(23.65, 'Z', null, L => { day(); scene.fog.density = 0; use('CI', 'FT', 'HK'); CITY.userData.CARS.forEach(c => c.visible = false); const u = (L.k * 3) % 1; const p = hookCam(hookU(u)); CITY.visible = p.z >= -52.6;
  CITY.userData.TH.userData.doorPiv.rotation.y = 1.55; SPEED = .7; if (p.z < -52.6) sh(V(HMC.x, HMC.y, HMC.z), 12); else sh(V(0, 0, -30), 90);
  badge('gold', String(Math.min(9, 1 + Math.floor(L.k * 9))), W / 2, H * .2, 1, 1, 1.4); }, [[0, 'whoosh', .6], [.5, 'whoosh', .5], [1.0, 'whoosh', .5]]);
// «ist gerade das Rathaus explodiert!»: el Rathaus revienta
shot(24.95, 'C', 'punch', L => { use('CI'); day(); const t0 = 25.55, k = clamp((L.T - t0) / 1.3); EXP.visible = true; EXP.position.set(0, 10, 58); EXP.userData.set(k, 14); CITY.userData.RH.g.visible = k < .12;
  [EX[13], EX[14]].forEach((c, i) => { put(c, -6 + i * 12, .5, 34, Math.PI + (i ? .3 : -.3)); actuar(c, 0, [[0, L.T > t0 ? GEST.shock : { aLx: .2 }]], { T: L.T }); cara(c, L.T, { expr: L.T > t0 ? 'shock' : 'neutral', mouth: L.T > t0 ? 'shout' : 'flat' }); });
  cm([4, 14, 6, 0, 12, 58, 50], [3, 13, 10, 0, 13, 58, 52], L.k); if (L.T > t0) SHAKE = 1 - k; sh(V(0, 0, 50), 40); }, [[.55, 'explosion', .9], [.7, 'crash', .5]]);
// «Tschuldigung!»: yo, avergonzado, mano en la nuca, humo saliendo de la maqueta
shot(26.17, 'W', null, L => { kel(L); atTable(ich, L.T, { aRx: 2.5, aRz: .1, aRe: 2.0, headX: .1, headZ: .15, lean: .05 }); cara(ich, L.T, { expr: 'worried', eyes: 'happy', mouth: 'grimace' });
  dust(mw(0, 0, 50), 26.0, L.T, 10, .25); onFace(ich, 5.4, -.2, -.5, 42, L.k, 4.8); }, [[0, 'pop', .4]]);
// «Aber eines Tages fiel mir etwas Seltsames auf.» (zoom lento): me acerco a la maqueta, extrañado
shot(27.08, null, 'slow', L => { kel(L, 70); atTable(ich, L.T, { lean: .45, headX: .5, headY: Math.sin(L.T * 1.5) * .2 }); cara(ich, L.T, { expr: 'confused', mouth: 'o' });
  orb(L.k, V(KX, 3.6, -5), null, [13, -.5, .45, 44], [10, -.4, .42, 42]); }, [[0, 'whoosh', .3]]);
// «Klar.»: cara de listillo
shot(29.70, 'C', 'punch', L => { kel(L); atTable(ich, L.T, { headX: 0, lean: .05, ...GEST.cross }); cara(ich, L.T, { expr: 'smug', mouth: 'smirk' }); onFace(ich, 4.8, .8, .6, 42, L.k, 4.3); }, [[0, 'pop', .4]]);
// «Mir fällt immer was auf.»: saco la lupa y guiño
shot(30.18, 'S', null, L => { kel(L); atTable(ich, L.T, { lean: .05, headX: 0, aRx: 1.9, aRz: -.2, aRe: .8 }); talk(ich, L.T, 30.18, 31.2, 'smug', { eyes: 'half' });
  attach(LUPE, ich.aR.hand, [0, -.6, .4], [0, 0, 0], .7); onFace(ich, 5.6, .8, -.6, 44, L.k, 5); }, [[0, 'sparkle', .5]]);
// «In meiner winzigen Stadt stand ein winziger Junge»: en la maqueta, un niño diminuto solo en la acera (¡igualito a mí!)
shot(31.35, 'Z', null, L => { kel(L); tiny(ichT, 4, 44, Math.PI); actuar(ichT, 0, [[0, idlePoseK(L.T)]], { T: L.T }); cara(ichT, L.T, { expr: 'neutral', mouth: 'flat' });
  const p = mw(4, 2.6, 44); cm([p.x + 8 * MINI_S, p.y + 6 * MINI_S, p.z - 26 * MINI_S, p.x, p.y, p.z, 44], [p.x + 6 * MINI_S, p.y + 4 * MINI_S, p.z - 19 * MINI_S, p.x, p.y, p.z, 42], L.k); }, [[0, 'whoosh', .4], [.3, 'birds', .3]]);
// «und redete mit niemandem.»: habla solo, gesticulando, nadie alrededor
shot(33.77, 'W', null, L => { kel(L); tiny(ichT, 4, 44, Math.PI - .4); actuar(ichT, 0, [[0, { aLx: .6 + Math.sin(L.T * 6) * .3, aLe: 1.2, aRx: .3, headY: Math.sin(L.T * 2) * .3 }]], { T: L.T }); cara(ichT, L.T, { expr: 'talk', mouth: kitLips(L.T, [[33.7, 35.1]]) || 'talk' });
  bubble(ichT, '…', clamp((L.T - 33.9) * 4), 2.6); const p = mw(4, 2.6, 44); orbit(p, lerp(16, 13, L.k) * MINI_S, 2.5, .15, 42); }, [[0, 'mumble', .4]]);
// «Ich holte meine Lupe.»: la cojo de la estantería
shot(35.23, 'C', null, L => { kel(L); const c = put(ich, KX - 25.5, 0, -8, -Math.PI / 2 + 1.1); const k = easeOut(clamp(L.lt / .6)); actuar(c, 0, [[0, { aRx: lerp(1.2, 1.8, k), aRz: .1, aRe: .4, headX: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  attach(LUPE, c.aR.hand, [0, -.6, .4], [0, 0, 0], .7); cm([KX - 21.5, 4.8, 3, KX - 26.5, 4, -9, 48], [KX - 22.5, 4.6, 2, KX - 26.5, 4, -9, 46], L.k); sh(V(KX - 25, 0, -8), 14); }, [[0, 'grab', .5]]);
// «Er sagte:»: miro por la lupa (la lupa llena el plano, dentro el niño diminuto)
const lensShot = (L, who, x, z, talkA, talkB, pose = null) => { kel(L); tiny(who, x, z, Math.PI); actuar(who, 0, [[0, pose || idlePoseK(L.T)]], { T: L.T }); talkA != null ? talk(who, L.T, talkA, talkB, 'joy') : cara(who, L.T, { expr: 'neutral' });
  const p = mw(x, 3, z); const c = V(p.x, p.y + 1.6 * MINI_S, p.z); const cp = V(p.x + 2 * MINI_S, p.y + 10 * MINI_S, p.z - 30 * MINI_S); cam([cp.x, cp.y, cp.z], [c.x, c.y, c.z], lerp(30, 26, L.k));
  const d = c.clone().sub(cp).normalize(); show(LUPE, cp.x + d.x * .9, cp.y + d.y * .9 + .02, cp.z + d.z * .9, 0, .13); LUPE.lookAt(cp); LUPE.rotateY(Math.PI); };
shot(36.32, 'I', null, L => lensShot(L, ichT, 4, 44, null), [[0, 'sparkle', .5]]);
// «„Ich heiße Thomas, und in meiner Stadt …"»: ¡saluda igual que yo!
shot(36.99, null, null, L => lensShot(L, ichT, 4, 44, 36.99, 39.1, 'wave'), [[0, 'pop', .4]]);
// «Moment, das ist mein Satz!»: me aparto de la lupa, indignado
shot(39.11, 'C', 'punch', L => { kel(L); atTable(ich, L.T, { lean: .1, headX: 0, aRx: 1.3, aRe: .6, aLx: .4 }); attach(LUPE, ich.aR.hand, [0, -.6, .4], [0, 0, 0], .7); talk(ich, L.T, 39.11, 40.7, 'angry', { eyes: 'wide' });
  bubble(ich, 'HEY!', clamp((L.T - 39.2) * 4), 2.2); onFace(ich, 5.6, .8, .5, 44, L.k, 4.8); }, [[0, 'record_scratch', .6]]);
// «Ich schaute eine Stadt tiefer:»: bajada rápida otra vez (sin cortes)
shot(40.81, 'Z', null, L => { day(); scene.fog.density = 0; use('CI', 'FT', 'HK'); CITY.userData.CARS.forEach(c => c.visible = false); const p = hookCam(hookU(L.k)); CITY.visible = p.z >= -52.6; CITY.userData.TH.userData.doorPiv.rotation.y = 1.55; SPEED = .6;
  if (p.z < -52.6) sh(V(HMC.x, HMC.y, HMC.z), 12); else sh(V(0, 0, -30), 90); }, [[0, 'whoosh', .6], [.6, 'whoosh', .4]]);
// «noch ein Thomas.»: por la lupa, otro Thomas diminuto (en otra esquina)
shot(42.29, 'F', null, L => lensShot(L, ichT2, -26, 20, null, null, { aLx: .2, aRx: .2, headY: Math.sin(L.T * 2) * .2 }), [[0, 'sparkle', .5]]);
// «„Klingt cool, oder?"»: el otro Thomas lo dice, guiñando
shot(43.20, null, null, L => lensShot(L, ichT2, -26, 20, 43.2, 44.05, { aRx: 1.6, aRz: .3, aRe: .8 }), [[0, 'pop', .4]]);
// «Und noch einer.»: en la casa de muñecas, otro Thomas en su sótano
shot(44.32, 'W', null, L => { use('PU'); day(); const c = put(ichG, PX + .6, -15, -6.6, 0); c.root.scale.setScalar(.9); actuar(c, 0, [[0, { lean: .2, headX: .2, aRx: .8, aLx: .8, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'smile' });
  cm([PX + 2, -7, 16, PX + .5, -10.5, -4, 48], [PX + 1.5, -8, 12, PX + .5, -10.5, -4, 46], L.k); sh(V(PX, -15, 0), 20); }, [[0, 'whoosh', .4]]);
// «„Aber eines Tages fiel mir etwas Seltsames auf."»: ese Thomas también se extraña, igual que yo
shot(45.26, 'C', 'slow', L => { use('PU'); day(); const c = put(ichG, PX + .6, -15, -6.6, 0); c.root.scale.setScalar(.9); actuar(c, 0, [[0, { lean: .35, headX: .4, headY: Math.sin(L.T * 1.5) * .2, aRx: .8, aLx: .8 }]], { T: L.T }); talk(c, L.T, 45.26, 47.7, 'confused');
  cm([PX + 1.2, -9, 7, PX + .6, -10.6, -6.6, 44], [PX + 1, -9.4, 5.5, PX + .6, -10.6, -6.6, 40], L.k); sh(V(PX, -15, 0), 20); }, [[0, 'mumble', .3]]);
