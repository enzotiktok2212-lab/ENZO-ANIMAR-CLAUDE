// ---------- d: el ruido abajo, mi hermano, la calada, el Dampfsammler vuelve (94,35 – 117,9 s) ----------
const BRP = V(KX - 5.4, 0, -.6);                  // mi hermano junto a la máquina (la máquina a su derecha)
const MEP = V(KX + 3, 0, 9);                       // donde llego yo al pie de la escalera
const SMP = V(KX - 6.4, 0, -4.6);                  // la criatura detrás de mi hermano (entre él y la máquina)
const bruAt = (L, ry, pose = {}, face = {}) => { const b = put(bru, BRP.x, 0, BRP.z, ry); actuar(b, 0, [[0, pose]], { T: L.T }); cara(b, L.T, face); return b; };
const holdOld = b => { b.aR.hand.add(OLDV); OLDV.visible = true; OLDV.position.set(0, -.25, .47); OLDV.rotation.set(1.54, 0, 0); OLDV.scale.setScalar(.95); OLDV.userData.setGlow(.3); };

// 70 «Plötzlich hörte ich etwas unten im»: me giro hacia la puerta; por debajo sale una luz cian
shot(94.35, 'F', null, L => { cuartoS(L); const m = put(ich, ZX + 10, 0, 2, 1.2); actuar(m, 0, [[0, { headY: .6, aLx: .3, aRx: .3, lean: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'worried', eyes: 'side_r' });
  FILL.color.setRGB(.6, .9, 1); cm([ZX + 4, 7, 15], [ZX + 4.6, 6.8, 14], L.k); camera.lookAt(ZX + 11.5, 4.6, 2.5); camera.fov = 46; sh(V(ZX + 12, 0, 3), 16); }, [[0, 'thud', .45], [.6, 'creepy_ting', .4]]);
// 71 «Keller. Ich stürmte hinunter.»: bajo la escalera del sótano a toda velocidad
shot(95.67, 'W', null, L => { kellerS(L); const k = clamp(L.lt / 1.3), step = lerp(11, 2, k); const z = 6 - step * 1.3, y = .95 + step * .75;
  const m = put(ich, KX + 17.5, y + Math.abs(Math.sin(L.T * 16)) * .2, z, 0); actuar(m, 0, [[0, { ...walkP(L.T * 1.7, 0), aLx: 1.0, aRx: -.7, lean: .15 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([KX + 7, 6, z + 4], [KX + 8, 5, z + 3], L.k); camera.lookAt(KX + 17.5, y + 3.5, z); camera.fov = 46; sh(V(KX + 16, 0, z), 18); }, [[0, 'steps_run', .6], [.5, 'door_open', .4]]);
// 72 «Und da stand mein kleiner»: el sótano en penumbra: mi hermano pequeño de pie junto a la máquina
shot(96.99, 'Z', null, L => { kellerS(L, { off: .35 }); MACH.userData.setPower(.6); bruAt(L, .5, { aLx: .3, aRx: .9, aRe: 1.4, headX: .2 }, { expr: 'happy' }); holdOld(bru);
  cm([KX + 6, 8, 12], [KX + 4.5, 7.4, 10.5], L.k); camera.lookAt(BRP.x + 1, 3.8, BRP.z - 2); camera.fov = 46; sh(BRP, 20); }, [[0, 'machine_hum', .45], [.6, 'drip', .35]]);
// 73 «Bruder, mit Papas alter»: se da la vuelta y me enseña lo que ha encontrado, muy contento
shot(98.26, 'S', null, L => { kellerS(L, { off: .35 }); const b = bruAt(L, lerp(-.4, .7, easeOut(clamp(L.lt / .5))), { aRx: 1.6, aRz: -.1, aRe: .9, aLx: .4, aLz: .2, aLe: .8 }, { expr: 'happy', mouth: 'open_smile' }); holdOld(b);
  onBody(b, 9, -.15, .1, 42, L.k, 8, -.05); sh(BRP, 14); }, [[0, 'cloth', .35], [.3, 'kids_laugh', .3]]);
// 74 «Vape in der Hand, direkt»: primer plano: la vape negra y vieja de papá en su mano pequeña
shot(99.67, 'C', 'punch', L => { kellerS(L, { off: .35 }); const b = bruAt(L, .7, { aRx: 1.7, aRz: -.05, aRe: .7, headX: .3 }, { expr: 'happy', eyes: 'down', mouth: 'smile' }); holdOld(b); OLDV.userData.setGlow(.5 + Math.sin(L.T * 5) * .3);
  const v = wpos(OLDV); cm([v.x + Math.sin(.7) * 3.4, v.y + 1, v.z + Math.cos(.7) * 3.4], [v.x + Math.sin(.7) * 3.0, v.y + .9, v.z + Math.cos(.7) * 3.0], L.k); camera.lookAt(v.x, v.y + .6, v.z); camera.fov = 40; sh(BRP, 12); }, [[0, 'pling', .45]]);
// 75 «neben der riesigen Maschine.»: plano bajo: mi hermano diminuto al lado de la máquina gigante
shot(101.02, 'R', null, L => { kellerS(L, { off: .35 }); MACH.userData.setPower(.8); const b = bruAt(L, .7, { aRx: 1.3, aRe: .9, headX: -.3, headY: .5 }, { expr: 'happy', eyes: 'up' }); holdOld(b);
  cm([KX + 1, 2.2, 11], [KX + .5, 2.4, 10], L.k); camera.lookAt(KX - 6, 5, -1); camera.fov = 52; sh(MP, 22); }, [[0, 'machine_hum', .5], [.6, 'metal_creak', .35]]);
// 76 «Bevor ich ihn aufhalten konnte,»: corro hacia él con el brazo extendido: «NEIN!»
shot(102.53, 'W', null, L => { kellerS(L, { off: .35 }); const k = clamp(L.lt / 1.4); const m = put(ich, lerp(MEP.x, MEP.x - 3, k), Math.abs(Math.sin(L.T * 14)) * .18, lerp(MEP.z, MEP.z - 3, k), -2.4);
  actuar(m, 0, [[0, { ...walkP(L.T * 1.5, 0), aRx: 1.7, aRz: .1, aRe: .1, lean: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'shout', mouth: 'scream' }); bubble(m, 'NEIN!', clamp((L.lt - .2) / .1), 1.4);
  const b = bruAt(L, .7, { aRx: 1.3, aRe: .9 }, { expr: 'happy' }); holdOld(b);
  cm([KX + 6, 8, 20], [KX + 5, 7.6, 18], L.k); camera.lookAt(KX - 1.5, 3.8, 3); camera.fov = 48; sh(V(KX, 0, 3), 22); }, [[0, 'steps_run', .5], [.25, 'shout_m', .4]]);
// 77 «zog er daran: Pfffffff!»: le da una calada; tose una nube; la máquina responde con un destello
shot(104.03, 'C', null, L => { kellerS(L, { off: .35 }); const b = put(bru, BRP.x, 0, BRP.z, .7); vaper(b, L, 104.0, .35, { expr: 'happy', vape: OLDV, exh: 1.2, pow: 5, size: 1.6, n: 60, dens: .9 }); holdOld(b); MACH.userData.setPower(.8 + clamp((L.T - 104.8) / .4) * 1.2);
  onFace(b, 5.4, .2, .6, 42, L.k, 4.6); sh(BRP, 14); }, [[.2, 'vape_in', .6], [.75, 'vape_out', .6], [1.0, 'cough', .4]]);
// 78 «Das ganze Haus fing an zu beben.»: todo tiembla: polvo de las vigas, tarros que tintinean, la máquina zumba
shot(105.62, 'S', null, L => { kellerS(L, { off: .35 }); SHAKE = .7; MACH.userData.setPower(2); MACH.position.x += Math.sin(L.T * 60) * .08; dust(V(KX - 4, 15, -2), L.t0, L.T, 14, 1.2);
  const b = bruAt(L, .7, { ...GEST.shock }, { expr: 'shock', mouth: 'o' }); holdOld(b); const m = put(ich, MEP.x - 3, 0, MEP.z - 3, -2.4); actuar(m, 0, [[0, { aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: .5, aRe: .5, crouch: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'grimace' });
  cm([KX - 2, 9, 20], [KX - 2, 8.6, 18.5], L.k); camera.lookAt(KX - 2, 4, 2); camera.fov = 50; sh(V(KX, 0, 0), 24); }, [[0, 'machine_shake', .6], [.3, 'glass_rattle', .45], [.7, 'rubble', .35]]);
// 79 «Das Licht ging aus.»: las bombillas parpadean y se apagan una a una
shot(107.00, 'F', null, L => { const off = clamp((L.T - 107.7) / .4); kellerS(L, { off: Math.max(off, Math.sin(L.T * 40) > .6 ? .8 : 0) }); KE.BULBS.forEach((b, i) => { if (L.T > 107.55 + i * .1) { b.l.intensity = 0; b.bl.material.emissiveIntensity = .1; } }); MACH.userData.setPower(.5);
  cm([KX + 2, 7, 14], [KX + 2, 7.5, 13], L.k); camera.lookAt(KX, 11.5, -2); camera.fov = 52; sh(V(KX, 0, 0), 24); }, [[0, 'neon_buzz', .45], [.55, 'power_down', .6]]);
// 80 «Und hinter meinem Bruder»: oscuridad; mi hermano, iluminado solo por el brillo cian de la máquina
shot(108.39, 'Z', null, L => { kellerS(L, { off: 1 }); MACH.userData.setPower(.9); FILL.intensity = 6; FILL.color.setRGB(.5, .9, 1); const b = bruAt(L, .7, { aRx: .9, aRe: 1.2, aLx: .6, aLz: .3, aLe: 1.4, headY: -.2 }, { expr: 'worried', eyes: 'side_l' }); holdOld(b);
  onBody(b, 10, -.1, .08, 42, L.k, 8.6); sh(BRP, 14); }, [[0, 'heartbeat', .55], [.5, 'whisper', .35]]);
// 81 «leuchteten zwei Augen unter einem» (zoom lento): detrás de él, en la oscuridad, se encienden dos ojos cian
shot(109.66, 'I', 'slow', L => { kellerS(L, { off: 1 }); MACH.userData.setPower(.5); FILL.intensity = 4; FILL.color.setRGB(.5, .9, 1); const b = bruAt(L, .7, { aRx: .9, aRe: 1.2, aLx: .6, aLz: .3, aLe: 1.4 }, { expr: 'worried' }); holdOld(b);
  samAt(L, SMP.x, SMP.z, .5, { reach: 0, glow: clamp((L.T - 110.1) / .3), aura: clamp((L.T - 110.4) / .6) * .6 });
  const h = hp(bru); cm([h.x + 3.2, h.y + 1.5, h.z + 10.5], [h.x + 2.4, h.y + 2.5, h.z + 6.5], easeIn(L.k)); camera.lookAt(h.x - .4, h.y + 2.8, h.z - 3); camera.fov = 46; sh(BRP, 16); }, [[.45, 'creepy_ting', .55]]);
// 82 «schwarzen Zylinder auf.»: se revela entera: la chistera, la capucha, los brazos larguísimos abiertos sobre mi hermano
shot(111.10, 'C', 'punch', L => { kellerS(L, { off: 1 }); MACH.userData.setPower(.6); FILL.intensity = 8; FILL.color.setRGB(.6, .5, 1); const b = bruAt(L, .7, { aRx: .9, aRe: 1.2, aLx: .6, aLz: .3, aLe: 1.4 }, { expr: 'worried' }); holdOld(b);
  samAt(L, SMP.x, SMP.z, .5, { reach: .3, aura: 1 }); SMK.haze(V(SMP.x, 1.5, SMP.z), L.T, 14, 4, 1, 3, 4, .35, 71);
  orbit(V(BRP.x - .4, 6.5, BRP.z - 2), lerp(24, 21, L.k), .55, .05, 46); sh(BRP, 20); }, [[0, 'magic_hit', .6], [.2, 'growl', .4]]);
// 83 «Der Dampfsammler war hier.»: primer plano de la criatura: los ojos brillan con fuerza, la garra se acerca
shot(112.74, 'R', null, L => { kellerS(L, { off: 1 }); FILL.intensity = 6; FILL.color.setRGB(.6, .5, 1); bruAt(L, .7, { ...GEST.cower }, { expr: 'scared', mouth: 'o' }); holdOld(bru);
  const s = samAt(L, SMP.x, SMP.z, .5, { reach: clamp(L.lt / 1.2), glow: 1.3, aura: 1 }); const h = hp(s); cam([h.x + Math.sin(.5) * 9, h.y + .2, h.z + Math.cos(.5) * 9], [h.x, h.y - .9, h.z], 42); sh(BRP, 16); }, [[0, 'whisper', .45], [.6, 'growl', .4]]);
// 84 «Und dieses Mal würde ich ihn meine»: yo, decidido, me planto delante de mi hermano con la llave inglesa
shot(114.20, 'W', null, L => { kellerS(L, { off: 1 }); FILL.intensity = 10; FILL.color.setRGB(.6, .8, 1); const m = put(ich, BRP.x + 1.6, 0, BRP.z + 2.0, -2.0); actuar(m, 0, [[0, { aLx: .9, aLz: .9, aLe: .3, aRx: 1.7, aRz: -.2, aRe: .7, lean: .05 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'grimace' });
  onFace(m, 5, .1, -.5, 40, L.k, 4.2); sh(BRP, 14); }, [[0, 'steps_heavy', .45], [.5, 'heartbeat', .45]]);
// 85 «Familie nicht mitnehmen»: plano general: yo entre mi hermano y la criatura, que se alza enorme con su aura
shot(115.80, 'S', null, L => { kellerS(L, { off: 1 }); FILL.intensity = 10; FILL.color.setRGB(.6, .6, 1); const b = put(bru, BRP.x + 3.6, 0, BRP.z + 2.6, -2.3); actuar(b, 0, [[0, GEST.cower]], { T: L.T }); cara(b, L.T, { expr: 'scared' });
  const m = put(ich, BRP.x + 1.2, 0, BRP.z + .8, -2.5); actuar(m, 0, [[0, { aLx: .9, aLz: .9, aLe: .3, aRx: .9, aRz: .9, aRe: .3, lean: .05 }]], { T: L.T }); cara(m, L.T, { expr: 'determined' });
  samAt(L, SMP.x, SMP.z, .6, { reach: .5, aura: 1 }); orbit(V(KX - 4, 6, -1.6), lerp(26, 24, L.k), 1.1, .06, 48); sh(V(KX - 4, 0, -1), 22); }, [[0, 'braam_short', .5]]);
// 86 «lassen.» (zoom lento): primer plano de mis ojos, decidido; los ojos cian se reflejan detrás
shot(116.94, 'Z', 'slow', L => { kellerS(L, { off: 1 }); FILL.intensity = 10; FILL.color.setRGB(.6, .8, 1); const m = put(ich, BRP.x + 1.2, 0, BRP.z + .8, -2.5); actuar(m, 0, [[0, { aLx: .9, aLz: .9, aLe: .3, aRx: .9, aRz: .9, aRe: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  samAt(L, SMP.x, SMP.z, .6, { reach: .5, aura: 1 }); onFace(m, lerp(4.6, 3.6, easeIn(L.k)), .1, .4, 40, 0); sh(BRP, 14); }, [[0, 'heartbeat', .5]]);
