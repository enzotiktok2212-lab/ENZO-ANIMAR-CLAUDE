// ---------- d: el giro final: R y L prohibidas (74,58 – 95,9 s) ----------
const balcony = (L, o = {}) => { const m = put(zisch, RPX + (o.x ?? 0), 15.4, -28.2, o.ry ?? 0); return m; };
// 58 «Aber dann lächelte der Bürgermeister.»: el alcalde sonríe despacio, de lado; zoom lento con viñeta
shot(74.58, 'I', 'slow', L => { platzS(L); const m = balcony(L); actuar(m, 0, [[0, { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.5, aRe: 1.5, headX: .08 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', eyes: L.k > .4 ? 'squint' : 'half', mouth: L.k > .35 ? 'smirk' : 'flat' }); hero(m);
  onFace(m, 6.2, -.2, -.9, 40, L.k, 4.6); sh(RW(0, 15, -28), 10); }, [[0, 'music_stop', .4], [.4, 'evil_chime', .4]]);
// 59 «„Allerdings:»: levanta el índice, triunfal
shot(76.55, 'C', 'punch', L => { platzS(L); const m = balcony(L); actuar(m, 0, [[0, { aRx: 2.8, aRz: -.15, aRe: .1, aLx: .4, aLz: -.3, aLe: 1.4, lean: -.04 }]], { T: L.T }); talk(m, L.T, 76.55, 77.41, 'smug'); hero(m);
  onBody(m, 11, .2, .02, 40, L.k, 9.5, null, 4.6); sh(RW(0, 15, -28), 10); }, [[0, 'impact', .5], [.1, 'ding', .4]]);
// 60 «Ab morgen sind R»: en la barandilla del balcón aparece de golpe la señal de la «R» prohibida
shot(77.41, 'F', null, L => { platzS(L); RP.BANS.visible = true; const [r, l] = RP.BANS.children; r.scale.setScalar(spring(clamp(L.lt / .3) * 1.4)); l.scale.setScalar(.001); const m = balcony(L); actuar(m, 0, [[0, 'point_l']], { T: L.T }); talk(m, L.T, 77.41, 78.43, 'smug'); hero(m);
  cm([RPX - 3, 17, -10, RPX - 2.5, 20.5, -27, 44], [RPX - 3.2, 18, -13, RPX - 2.5, 20.8, -27, 42], L.k); sh(RW(0, 15, -27), 14); }, [[0, 'pop', .6], [.1, 'stamp', .6]]);
// 61 «und L verboten.“»: la «L» también; los dos carteles junto al alcalde que se frota las manos
shot(78.43, 'C', null, L => { platzS(L); RP.BANS.visible = true; const [r, l] = RP.BANS.children; r.scale.setScalar(1); l.scale.setScalar(spring(clamp(L.lt / .3) * 1.4)); const m = balcony(L); const j = Math.sin(L.T * 14); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.5 - j * .1, aRz: -.5 + j * .1, aLe: 1.5, aRe: 1.5 }]], { T: L.T }); talk(m, L.T, 78.43, 79.91, 'smug'); hero(m);
  crowdAt(L, RPX, -10, 8, 3, 10, 73, { mode: 'shock', face: RW(0, 15, -31), full: true });
  orbit(RW(0, 18.5, -27), lerp(26, 22, L.k), .12, .02, 44); sh(RW(0, 15, -27), 16); }, [[0, 'pop', .6], [.1, 'stamp', .6], [.5, 'evil_laugh', .4]]);
// 62 «Die ganze Menge wuwde stiww.»: la plaza en silencio; nadie se mueve; una bola de papel rueda; hojas al viento
shot(79.91, 'S', null, L => { platzS(L); RP.BANS.visible = true; crowdAt(L, RPX, 4, 20, 3, 16, 75, { mode: 'silent', face: RW(0, 15, -31), full: true }); dust(RW(-6, 0, -4), L.t0, L.T, 6, .3);
  cm([RPX + 6, 10, -20, RPX, 4.5, 6, 50], [RPX + 5, 10.4, -18, RPX, 4.6, 6, 48], L.k); sh(RW(0, 0, 4), 34); grade.uniforms.sat.value = .9; }, [[0, 'wind', .6], [.6, 'crickets', .5]]);
// 63 «Dann wief ein Powizist:»: un policía levanta el megáfono entre la gente
shot(81.33, 'W', null, L => { platzS(L); RP.BANS.visible = true; const c = put(COPS[3], RPX - 6, 0, 4, .4); actuar(c, 0, [[0, { aRx: 1.7, aRz: -.2, aRe: 1.5, aLx: .3 }]], { T: L.T }); attach(MEGA, c.aR.hand, [0, -.7, .6], [-.2, 0, 0], 1.0); cara(c, L.T, { expr: 'determined', mouth: 'flat' }); hero(c);
  crowdAt(L, RPX - 6, 0, 8, 5, 11, 77, { mode: 'silent', gap: 1.8, avoid: [[RPX - 6, 4]] });
  onBody(c, 12, .3, .1, 42, L.k, 10, .2, 4.6); sh(RW(-6, 0, 4), 14); }, [[0, 'megaphone_on', .6]]);
// 64 «„Awwe bweiben wuhig!“»: primer plano del policía gritando por el megáfono
shot(82.94, 'Z', 'punch', L => { platzS(L); const c = put(COPS[3], RPX - 6, 0, 4, .4); actuar(c, 0, [[0, { aRx: 1.7, aRz: -.2, aRe: 1.5, aLx: .3, lean: .08 }]], { T: L.T }); attach(MEGA, c.aR.hand, [0, -.7, .6], [-.2, 0, 0], 1.0); talk(c, L.T, 82.94, 84.23, 'angry'); hero(c);
  onFace(c, 6.4, .2, -1.4, 40, L.k, 5.4); sh(RW(-6, 0, 4), 10); }, [[0, 'megaphone_buzz', .5], [.3, 'impact_soft', .3]]);
// 65 «Ein Mann schwie:»: el hombre de la camisa rosa grita con las manos en la cabeza; detrás echa humo su deportivo plateado
shot(84.23, 'C', null, L => { platzS(L); const m = put(pmann, RPX + 14, 0, 10, -.5); actuar(m, 0, [[0, 'hands_head']], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'scream' }); hero(m); show(PORSCHE, RPX + 20, 0, 2, -.6); smoke(RW(21.5, 2.5, -1.5), L.T, 20, true);
  orbit(RW(16, 5, 7), lerp(17, 15, L.k), -.25, .12, 44); sh(RW(17, 0, 6), 18); }, [[0, 'car_alarm', .6], [.2, 'scream_man', .5], [.4, 'fire_crackle', .4]]);
// 66 «„Mein Powsche bwennt!“»: el deportivo con fuego y humo; él salta de desesperación; matrícula «Z-PS 911»
shot(85.05, 'F', null, L => { platzS(L); const m = put(pmann, RPX + 14, 0, 12, -.2); const j = Math.abs(Math.sin(L.T * 9)); m.root.position.y = j * .5; actuar(m, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .6, aRe: .6, headX: -.15 }]], { T: L.T }); talk(m, L.T, 85.05, 86.31, 'shock'); hero(m);
  show(PORSCHE, RPX + 20, 0, 2, -.6); smoke(RW(21.5, 2.5, -1.5), L.T, 26, true);
  cm([RPX + 6, 6, 26, RPX + 18, 4, 3, 46], [RPX + 8, 6.5, 23, RPX + 18, 4, 3, 44], L.k); sh(RW(18, 0, 5), 20); }, [[0, 'fire_whoosh', .6], [.3, 'car_alarm', .5]]);
// 67 «Und meine Wehwewin wief:»: la profesora Kessler, entre la gente, grita haciendo bocina con las manos
shot(86.31, 'W', null, L => { platzS(L); const t = put(kess, RPX - 10, 0, 12, .5); actuar(t, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: -.6, aRz: -.6, aLe: 1.9, aRe: 1.9, lean: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'angry', mouth: 'talk_wide' }); hero(t);
  KIDS.slice(0, 5).forEach((k, i) => { const x = RPX - 14 + i * 2.6, z = 18 + (i % 2) * 2; put(k, x, 0, z, PI - .3); crowdGuy(k, x, z, L, i, { mode: 'silent', ry: PI - .3 }); });
  onBody(t, 11, .2, .1, 42, L.k, 9.4, null, 4.4); sh(RW(-10, 0, 12), 14); }, [[0, 'whistle', .5]]);
// 68 «„Kindew, awwe ins Kwassenzimmew!“»: los niños salen corriendo hacia el colegio mientras ella los empuja
shot(87.68, 'S', null, L => { platzS(L); const t = put(kess, 0, 0, 0, 0); walkTo(t, L, RPX - 10, 12, RPX - 6, 22); actuar(t, 0, [[0, { ...walkP(L.T, 0), aRx: 1.6, aRe: .3 }]], { T: L.T }); talk(t, L.T, 87.68, 89.59, 'angry'); hero(t);
  KIDS.slice(0, 6).forEach((k, i) => { put(k, 0, 0, 0, 0); walkTo(k, L, RPX - 13 + i * 2.4, 16 + (i % 2) * 2, RPX - 9 + i * 2.4, 34 + (i % 2) * 2, i, true); cara(k, L.T + i, { expr: 'shock', mouth: 'o' }); });
  orb(L.k, RW(-7, 4, 20), RW(-5, 4, 26), [22, 1.3, .14, 46], [20, 1.1, .14, 46]); sh(RW(-6, 0, 24), 22); }, [[0, 'run_steps', .6], [.3, 'kids_scream', .4]]);
// 69 «Ich sah den Büwgewmeistew an.»: Jonte se gira despacio hacia el balcón, furioso
shot(89.59, 'R', null, L => { platzS(L); RP.BANS.visible = true; const c = put(jonte, RPX + 1, 0, 2, lerp(.8, PI, easeInOut(clamp(L.lt / .9)))); actuar(c, 0, [[0, { aLx: .2, aRx: .2, aLz: .3, aRz: -.3, headX: -.25, sx: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'frown' }); holdBag(c); hero(c);
  crowdAt(L, RPX + 1, 8, 8, 5, 10, 79, { mode: 'silent', gap: 1.9, avoid: [[RPX + 1, 2]] });
  cm([RPX - 3, 5.4, -6.5, RPX + 1, 5.2, 2, 44], [RPX - 2, 5.3, -5, RPX + 1, 5.3, 2, 42], L.k); sh(RW(1, 0, 2), 14); }, [[0, 'whoosh_soft', .3], [.5, 'heartbeat', .4]]);
// 70 «„Das ist doch nicht dein Ewnst!“»: Jonte, de frente y desde abajo, grita con los brazos abiertos hacia el balcón
shot(91.2, 'C', 'punch', L => { platzS(L); const c = put(jonte, RPX + 1, 0, 2, PI); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: .9, aRz: .9, aLe: .5, aRe: .5, headX: -.15 }]], { T: L.T }); talk(c, L.T, 91.2, 92.53, 'angry'); hero(c);
  onFace(c, 6.4, .6, .3, 42, L.k, 5.4); sh(RW(1, 0, 2), 12); }, [[0, 'impact', .5], [.2, 'gasp', .3]]);
// 71 «Und ew wächewte.»: el alcalde sonríe con una sonrisa enorme; zoom lento con viñeta
shot(92.53, 'I', 'slow', L => { platzS(L); RP.BANS.visible = true; const m = balcony(L); actuar(m, 0, [[0, { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.5, aRe: 1.5, headZ: .12 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' }); hero(m);
  onFace(m, 6, -.2, .5, 40, L.k, 4.4); sh(RW(0, 15, -28), 10); }, [[0, 'evil_chime', .5]]);
// 72 «Sehw witzig, odew?»: guiña un ojo y se encoge de hombros; la cámara se aleja y se ven las dos señales R y L sobre la plaza callada
shot(93.67, 'Z', null, L => { platzS(L); RP.BANS.visible = true; const m = balcony(L); actuar(m, 0, [[0, L.lt < .8 ? 'shrug' : { aRx: 2.4, aRz: .4, aRe: .3, aLx: .4 }]], { T: L.T }); talk(m, L.T, 93.67, 94.85, 'smug'); if (L.lt > .35 && L.lt < .7) cara(m, L.T, { expr: 'smug', eyes: 'wink', mouth: 'grin' }); hero(m);
  crowdAt(L, RPX, -6, 12, 4, 14, 81, { mode: 'silent', face: RW(0, 15, -31), full: true });
  orbit(RW(0, 18, -28), lerp(16, 36, easeInOut(L.k)), .05, .04, 44); sh(RW(0, 15, -24), 26); }, [[0, 'wink_ding', .5], [.9, 'trombone_wah', .4]]);
