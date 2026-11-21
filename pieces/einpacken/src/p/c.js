// ---------- c: la entrevista, el rechazo, aprendo a freír (54,05 – 86,74 s) ----------
// en el mostrador: el jefe detrás (z = -2.2, mira +z), yo delante (z = 2.6, mira -z)
const counter = (L, o = {}) => { burgIn(L); partyCrowd(L, BX, 14, o.n ?? 6, 9, 16, 31, { mode: 'walk', hats: false, gap: 1.6 });
  const c = put(chef, BX - 1.2, 0, -2.2, 0); const m = put(ich, BX + 1.4, 0, 2.6, PI); return [c, m]; };
const CTOP = 2.7;   // altura de la encimera
// 64 «Dann kam das Gespräch.»: camino hacia la Brötchenburg (de día), decidido
shot(54.05, 'Z', null, L => { burgOut(L); const z = lerp(62, 54, L.k); const c = put(ich, BX + 1, 0, z, PI); actuar(c, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); partyCrowd(L, BX, 54, 6, 6, 14, 33, { mode: 'walk', hats: false });
  cam([BX + 1 + 2.4, 4.4, z + 9.5], [BX + 1, 3.8, z - 4], 46); sh(V(BX, 0, z), 20); }, [[0, 'steps', .5], [.3, 'city_amb', .4]]);
// 65 «Der Chef legte einen Burger»: el jefe deja una hamburguesa sobre el mostrador
shot(55.20, 'W', null, L => { const [c, m] = counter(L); m.root.visible = false; const k = easeInOut(clamp(L.lt / .8)); actuar(c, 0, [[0, { aRx: lerp(.6, 1.2, k), aRz: -.1, aRe: lerp(1.2, .4, k), lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'smile' }); cara(m, L.T, { expr: 'determined', eyes: 'down' });
  const hpos = c.aR.hand.getWorldPosition(V()); show(BUR[0], lerp(hpos.x, BX + .1, k), lerp(hpos.y - .3, CTOP, k), lerp(hpos.z + .2, .2, k), 0, .5);
  orbit(V(BX - 1.0, 3.9, -1.0), lerp(15, 13.5, L.k), 1.3, .14, 44); sh(V(BX, 0, 0), 16); }, [[0, 'steps', .3], [.8, 'plate_slide', .5]]);
// 66 «auf die Theke.»: la hamburguesa en el mostrador (plano detalle), ding
shot(56.50, 'C', 'punch', L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); show(BUR[0], BX + .1, CTOP, .2, 0, .5); cara(c, L.T, { expr: 'smile' });
  cam([BX - 1.0, CTOP + 2.8, 4.4], [BX + .1, CTOP + .3, .2], 38); sh(V(BX, 0, 0), 14); }, [[0, 'ding_soft', .7]]);
// 67 «„Wann immer Sie bereit sind“, sagte er.»: el jefe con su portapapeles, sonriente
shot(57.06, 'F', null, L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .7, aLz: -.2, aLe: 1.5, aRx: .4, aRz: .1, aRe: .6 }]], { T: L.T }); talk(c, L.T, 57.06, 58.9, 'smile'); show(BUR[0], BX + .1, CTOP, .2, 0, .5);
  attach(CLIP, c.aL.hand, [0, -.4, .3], [-.4, 0, 0], .55); onFace(c, 7.5, .2, -1.6, 40, L.k, 6.5); sh(V(BX, 0, 0), 14); }, [[0, 'pages', .4]]);
// 68 «Der Burger war schon eingewickelt.»: ¡ya es un paquete! el jefe parpadea
shot(58.90, 'C', 'punch', L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .7, aLz: -.2, aLe: 1.5, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); attach(CLIP, c.aL.hand, [0, -.4, .3], [-.4, 0, 0], .55);
  show(PARC[0], BX + .1, CTOP, .2, .3, .45 * (1 + Math.sin(clamp(L.lt / .2) * PI) * .2)); dust(V(BX + .3, CTOP, .2), L.t0, L.T, 6, .25); orbit(V(BX - .4, 3.6, -.8), lerp(10, 9, L.k), -.55, .14, 42); sh(V(BX, 0, 0), 14); }, [[0, 'pop', .6], [.2, 'paper', .5]]);
// 69 «Sein Klemmbrett auch.»: el portapapeles envuelto
shot(60.42, 'W', null, L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .45, aLz: -.1, aLe: 1.6, headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' }); attach(CLIP, c.aL.hand, [0, -.4, .3], [-.4, 0, 0], .55); CLIP.userData.wrap.visible = true;
  show(PARC[0], BX + .1, CTOP, .2, .3, .45); const p = wpos(CLIP); cam([p.x - .6, p.y + 1.6, p.z + 6.4], [p.x + .3, p.y + .9, p.z], 40); sh(V(BX, 0, 0), 14); }, [[0, 'paper', .6], [.1, 'pop', .5]]);
// 70 «Und seine Krawatte.»: la corbata envuelta
shot(61.30, 'C', null, L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .45, aLz: -.1, aLe: 1.6, headX: .45 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' }); attach(CLIP, c.aL.hand, [0, -.4, .3], [-.4, 0, 0], .55); CLIP.userData.wrap.visible = true; TIE.userData.wrap.visible = true;
  const h = hp(c); cm([h.x - 1.4, h.y + 1.0, h.z + 8.2, h.x, h.y - .7, h.z, 40], [h.x - 1.1, h.y + .9, h.z + 7.6, h.x, h.y - .8, h.z, 40], L.k); sh(V(BX, 0, 0), 14); }, [[0, 'paper', .6], [.1, 'pop', .5]]);
// 71 «Er war beeindruckt.»: el jefe aplaude, ojos brillantes
shot(62.48, 'F', null, L => { const [c, m] = counter(L); const cl = Math.abs(Math.sin(L.T * 12)); actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3 - cl * .3, aRz: -.3 - cl * .3, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' }); TIE.userData.wrap.visible = true;
  show(PARC[0], BX + .1, CTOP, .2, .3, .45); onFace(c, 8, 0, -1.4, 40, L.k, 7); sparkleBadge(L); sh(V(BX, 0, 0), 14); }, [[0, 'hug', .3], [.1, 'clack', .5], [.3, 'clack', .5]]);
function sparkleBadge(L) { badge('gold', 'WOW', W / 2, H * .2, (L.lt - .2) * 4, 1, .7); }
// 72 «Das sah ich ihm an.»: yo, satisfecho, de espaldas al jefe hacia cámara (contraplano)
shot(63.50, 'S', null, L => { const [c, m] = counter(L); actuar(m, 0, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'smirk' }); TIE.userData.wrap.visible = true; cara(c, L.T, { expr: 'joy' });
  onFace(m, 6, 0, -.9, 40, L.k, 5.4); sh(V(BX, 0, 2), 14); }, [[0, 'sparkle', .4]]);
// 73 «Dann stellte er mir eine einzige Frage:» (zoom lento): el jefe se inclina sobre el mostrador
shot(64.38, null, 'slow', L => { const [c, m] = counter(L); actuar(c, 0, [[0, { lean: .35, aLx: .9, aRx: .9, aLz: -.4, aRz: -.4, aLe: .5, aRe: .5, headX: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' }); TIE.userData.wrap.visible = true;
  badge('q', '?', W / 2, H * .18, (L.lt - .9) * 3, 1, 1); onFace(c, 9, .2, -.8, 42, easeIn(L.k), 6); sh(V(BX, 0, 0), 14); }, [[0, 'heartbeat', .5]]);
// 74 «„Können Sie einen Burger braten?“»: primer plano del jefe; la plancha detrás, con llamas
shot(66.20, 'C', null, L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aRx: 1.2, aRz: .5, aRe: .4, headX: .05 }]], { T: L.T }); talk(c, L.T, 66.2, 67.5, 'sus'); TIE.userData.wrap.visible = true; flames(V(BX, 2.7, -9), L.T, 8);
  const h = hp(c); cam([h.x - 1.6, h.y + .7, h.z + 6.6], [h.x - .1, h.y - .7, h.z - 2], 40); sh(V(BX, 0, 0), 14); }, [[0, 'pan_sizzle', .5], [.3, 'fire_crackle', .4]]);
// 75 «Ich habe noch nie einen Burger gebraten.»: yo sudando, ojos como platos
shot(67.50, 'W', 'punch', L => { const [c, m] = counter(L); actuar(m, 0, [[0, { ...GEST.shock, headX: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' }); sweat(m, L.T, 3);
  onFace(m, 5.4, .1, -1, 40, L.k, 4.6); sh(V(BX, 0, 2), 14); }, [[0, 'gasp', .5], [.6, 'heartbeat', .4]]);
// 76 «Ich habe noch nie einen gegessen.»: miro la hamburguesa en mis manos como si fuera un objeto extraño
shot(69.30, 'F', null, L => { const [c, m] = counter(L); actuar(m, 0, [[0, { aLx: .25, aRx: .25, aLz: -.5, aRz: -.5, aLe: 1.75, aRe: 1.75, headX: .45, headZ: Math.sin(L.T * 3) * .25 }]], { T: L.T }); cara(m, L.T, { expr: 'confused', eyes: 'down' });
  const a = m.aL.hand.getWorldPosition(V()), b = m.aR.hand.getWorldPosition(V()); show(BUR[1], (a.x + b.x) / 2, (a.y + b.y) / 2 + .05, (a.z + b.z) / 2, L.T, .45); badge('q', '?', W / 2 + 160, H * .3, (L.lt - .3) * 4, 1, .6);
  onFace(m, 5.4, .8, -.9, 40, L.k, 4.8); sh(V(BX, 0, 2), 14); }, [[0, 'sniff', .5], [.5, 'pop', .3]]);
// 77 «Ich wickle nur.»: me encojo de hombros y ¡zas! la hamburguesa ya es un paquete
shot(70.75, 'C', null, L => { const [c, m] = counter(L); const w = L.lt > .25; actuar(m, 0, [[0, w ? GEST.shrug : { aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.0, aRe: 1.0 }]], { T: L.T }); cara(m, L.T, { expr: w ? 'smug' : 'neutral', mouth: w ? 'smirk' : 'flat' });
  show(w ? PARC[1] : BUR[1], BX + 1.4, CTOP, 1.0, 0, .45); onFace(m, 6, -.4, -1, 40, L.k, 5.4); sh(V(BX, 0, 2), 14); }, [[.25, 'paper', .6], [.3, 'pop', .5]]);
// 78 «Ich bekam den Job nicht.»: salgo por la puerta de la Brötchenburg cabizbajo; la puerta se cierra; atardecer
shot(71.55, 'Z', null, L => { use('BB'); day(); setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .8, .6); const z = lerp(42, 45.5, L.k); const c = put(ich, BX, 0, z, 0); actuar(c, 0, [[0, { ...walkP(L.T * .5, 0), headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  badge('red', 'ABGELEHNT', W / 2, H * .18, (L.lt - .3) * 4, 1, .8); cam([BX - 2.5, 3, 54], [BX, 3.4, 42], 46); sh(V(BX, 0, 44), 20); }, [[0, 'door_open', .5], [.5, 'slam', .5], [.6, 'sad_tone', .5]]);
// 79 «Im Brief stand:»: en mi cuarto con la carta en la mano
shot(72.80, 'W', null, L => { use('ST'); day(); inside(.8, 16); ST.LO.intensity = 0; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); ST.TW.forEach((t, i) => t.userData.set([30, 30, 30][i])); const c = atDesk({ aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: 1.1, aRe: 1.1, headX: .3 }, L.T); cara(c, L.T, { expr: 'sad', eyes: 'down' });
  const a = c.aL.hand.getWorldPosition(V()), b = c.aR.hand.getWorldPosition(V()); show(LET, (a.x + b.x) / 2, (a.y + b.y) / 2 + .7, (a.z + b.z) / 2 + .1, 0, .42); LET.rotation.x = -.5;
  onFace(c, 6.4, .4, .9, 42, L.k, 5.6); sh(V(SX, 0, -3), 14); }, [[0, 'pages', .6]]);
// 80 «„Danke, dass Sie meine Krawatte eingewickelt haben.“»: la carta en primer plano
shot(73.55, 'C', null, L => { use('ST'); day(); inside(.8, 16); ST.LO.intensity = 0; const c = atDesk({ aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: 1.1, aRe: 1.1, headX: .3 }, L.T); cara(c, L.T, { expr: 'sad', eyes: 'down' });
  const a = c.aL.hand.getWorldPosition(V()), b = c.aR.hand.getWorldPosition(V()); const p = V((a.x + b.x) / 2, (a.y + b.y) / 2 + .7, (a.z + b.z) / 2 + .1); show(LET, p.x, p.y, p.z, 0, .42); LET.rotation.x = -.5; LET.updateMatrixWorld(true);
  const n = V(0, Math.sin(.5), Math.cos(.5)); cm([p.x + n.x * 2.6, p.y + n.y * 2.6 + .1, p.z + n.z * 2.6, p.x, p.y, p.z, 42], [p.x + n.x * 2.2, p.y + n.y * 2.2 + .05, p.z + n.z * 2.2, p.x, p.y - .1, p.z, 42], L.k); sh(V(SX, 0, -3), 14); }, [[0, 'paper', .5]]);
// 81 «Ach… fast.» (zoom lento): yo, triste, una lágrima
shot(75.33, null, 'slow', L => { use('ST'); day(); inside(.7, 14); ST.LO.intensity = 0; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); const c = atDesk({ aLx: .5, aRx: .5, aLz: -.2, aRz: -.2, aLe: 1.2, aRe: 1.2, headX: .2, lean: .05 }, L.T); cara(c, L.T, { expr: 'sad', eyes: 'cry', mouth: 'wavy' }); tears(c, L.T);
  onFace(c, 6, .2, -.6, 40, easeIn(L.k), 4.4); sh(V(SX, 0, -3), 14); }, [[0, 'sad_tone', .5], [.3, 'sigh', .5]]);
// 82 «Fast.»: cabeza en la mesa
shot(76.75, 'C', null, L => { use('ST'); day(); inside(.7, 14); ST.LO.intensity = 0; const c = atDesk({ aLx: 1.2, aRx: 1.2, aLz: -.6, aRz: -.6, aLe: 1.6, aRe: 1.6, lean: .55, headX: .4 }, L.T); cara(c, L.T, { expr: 'sad', eyes: 'closed', mouth: 'frown' });
  orbit(V(SX, 3.2, -2.2), lerp(7.5, 6.8, L.k), -.5, .2, 40); sh(V(SX, 0, -3), 14); }, [[0, 'thud', .4]]);
// 83 «Also bin ich heute Nacht, während die anderen feiern,»: la plaza de noche, fuegos artificiales
shot(77.35, 'W', null, L => { townN(L, 24, -6, 20, 5, 22, 41); partyGuy(udo, -6, 22, 0, L.T, 0, 'laugh'); partyGuy(oma, -9, 20, .3, L.T, 1); partyGuy(kid, -3, 20, -.3, L.T, 2);
  cm([-6, 16, 46, -6, 4, 18, 50], [-6, 7, 33, -6, 4, 20, 48], L.k); sh(V(-6, 0, 20), 30); }, [[0, 'firework', .6], [.4, 'cheer', .5], [1.2, 'firework', .5]]);
// 84 «übrigens,»: yo en mi cuarto, serio, mirando a cámara
shot(79.45, 'C', 'punch', L => { stubeN(L, 12); const c = atDesk({ aLx: .3, aRx: .3, aLz: -.9, aRz: -.9, aLe: 1.9, aRe: 1.9 }, L.T); cara(c, L.T, { expr: 'sus', eyes: 'half', mouth: 'flat' }); onFace(c, 4.8, 0, .4, 38); sh(V(SX, 0, -3), 14); }, [[0, 'thud', .4]]);
// 85 «wieder hier drin und lerne braten.»: la plancha en mi mesa; espátula; llamas y vapor
shot(80.12, 'F', null, L => { stubeN(L, 12); const c = atDesk({ aRx: 1.3, aRz: -.1, aRe: .8 + Math.sin(L.T * 6) * .3, aLx: .8, aLz: -.3, aLe: .9, lean: .1 }, L.T); cara(c, L.T, { expr: 'determined' });
  show(MGR, DESK.x, DESK.y, DESK.z, 0, .5); PAT.forEach((p, i) => { show(p, DESK.x - 1.2 + (i % 3) * 1.2, DESK.y + .55, DESK.z - .3 + Math.floor(i / 3) * .7, 0, .5); p.userData.set(i === 1 ? clamp((L.lt - .5) / .4) : 0, DESK.y + .55); }); attach(SPAT, c.aR.hand, [0, -.5, .3], [-1.4, 0, 0], .55);
  steam(V(DESK.x, DESK.y + .8, DESK.z), L.T, 6); flames(V(DESK.x, DESK.y + .2, DESK.z), L.T, 3); orbit(V(SX, 3.6, -2.2), lerp(10, 9, L.k), .4, .14, 44); sh(V(SX, 0, -3), 14); }, [[0, 'pan_sizzle', .7], [.5, 'ignite', .4]]);
// 86 «Halb fünf Uhr morgens.»: el despertador otra vez (4:30), cuarto azul de madrugada
shot(81.78, 'C', 'punch', L => { use('ST'); inside(.5, 10); ST.LO.intensity = 0; ST.LI.intensity = 20; TINT = 'rgba(30,50,120,.18)'; show(MGR, DESK.x + .6, DESK.y, DESK.z, 0, .5);
  show(ALM, SX - 2.8, 2.3, .4, Math.sin(L.T * 60) * .06, .5); ALM.userData.draw('4:30'); const c = atDesk({ aRx: 1.3, aRe: .8, aLx: .8, aLe: .9 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'wide' });
  cam([SX - 2.2, 3.8, 6], [SX - 1.2, 3.2, -1], 44); sh(V(SX, 0, -2), 14); }, [[0, 'alarm', .7]]);
// 87 «Dreihundert Burger vor dem Frühstück.»: carne volando de vuelta en vuelta, torres de hamburguesas, 300
shot(82.90, 'W', null, L => { use('ST'); inside(.8, 18); ST.LO.intensity = 0; TINT = 'rgba(40,60,130,.06)'; const c = atDesk({ aRx: 1.3, aRz: -.1, aRe: .8 + Math.sin(L.T * 12) * .4, aLx: .8, aLz: -.3, aLe: .9, lean: .1 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'angry' }); sweat(c, L.T, 2);
  show(MGR, DESK.x, DESK.y, DESK.z, 0, .5); PAT.forEach((p, i) => { show(p, DESK.x - 1.2 + (i % 3) * 1.2, DESK.y + .55, DESK.z - .3 + Math.floor(i / 3) * .7, 0, .5); p.userData.set(((L.T * 2.5 + i * .33) % 1), DESK.y + .55); }); attach(SPAT, c.aR.hand, [0, -.5, .3], [-1.4, 0, 0], .55);
  show(TWR[2], SX + 3.4, 2.3, .6, 0, .5); TWR[2].userData.set(Math.min(40, 4 + Math.floor(L.k * 20))); steam(V(DESK.x, DESK.y + .8, DESK.z), L.T, 8); flames(V(DESK.x, DESK.y + .2, DESK.z), L.T, 3);
  badge('gold', String(Math.round(easeOut(L.k) * 300)), W / 2, H * .17, 1, 1, .9); orbit(V(SX + .6, 3.6, -2), lerp(12, 10, L.k), -.4, .16, 46); sh(V(SX, 0, -3), 16); }, [[0, 'pan_sizzle', .6], [.6, 'count', .4], [1.2, 'pan_sizzle', .5]]);
// 88–91 HUSS ×6 (ráfaga 5): dando la vuelta a la carne
shot(84.98, 'C', null, L => hussShot(L, 5, 'top', 'GR'), hussSfx(5, 84.98, 85.37, 'grill'));
shot(85.37, null, null, L => hussShot(L, 5, 'face', 'GR', { side: .3 }), hussSfx(5, 85.37, 85.95));
shot(85.95, 'C', null, L => hussShot(L, 5, 'side', 'GR'), hussSfx(5, 85.95, 86.35, 'grill'));
shot(86.35, null, null, L => hussShot(L, 5, 'low', 'GR'), hussSfx(5, 86.35, 86.74));
