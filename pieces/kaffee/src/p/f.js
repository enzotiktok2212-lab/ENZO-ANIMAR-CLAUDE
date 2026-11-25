// ---------- f: planos intercalados para que la media sea ~1,2 s (cada uno con otro entorno o ángulo y su acción) ----------
// «Geld auf deinem Konto.»: primer plano del móvil del abuelo: el saldo salta y caen monedas sobre la pantalla
shot(4.35, 'C', 'punch', L => { town(L, { morning: 1 }); const c = sit2(REN[0], -16.6, -18, PI / 2, 2.4); actuar(c, 0, [[0, sitPose({ aLx: 1.2, aLe: 1.6, aLz: .2, headX: .3 })]], { T: L.T, weight: false }); grin(c, L.T);
  const hw = wpos(c.aL.hand); show(PHONE, hw.x + .4, hw.y + .7, hw.z + .2, 1.2, .9); PHONE.rotation.x = -.2; const k = clamp(L.lt / .5); PHONE.userData.draw(c_ => drawBankApp(c_, 300, 560, euro(492 + Math.round(12 * k)), '+12 € KAFFEE', '#5aff9a'));
  const w = wpos(PHONE); coins(w.clone().add(V(0, 1, 0)), L.t0, L.T, 10); cm([w.x + 3, w.y + 1.6, w.z + 1.2, w.x, w.y, w.z, 34], [w.x + 2.4, w.y + 1.3, w.z + 1, w.x, w.y, w.z, 32], L.k); sh(V(-16, 0, -18), 12); DOF = 1.4; }, [[0, 'notify', .6], [.2, 'coins', .5]]);
// «Mensch auf der Erde.»: plano cenital de la plaza: toda la ciudad mirando hacia arriba, a mí, de pie en la fuente; billetes volando
shot(14.76, 'Z', null, L => { town(L, { morning: 1 }); const c = put(ich, 0, 2.2, 4, 0); actuar(c, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .6, aRz: .6, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T); setHUD(50, '#ffd23f');
  crowdAt(L, 0, 4, 22, 6, 18, 17, { mode: i => ['point', 'shock', 'cheer'][i % 3], face: V(0, 6, 4), full: true }); billRain(V(0, 0, 4), L.T, 80, 30, 24, 18);
  cm([0, 44, 26, 0, 2, 2, 46], [0, 40, 20, 0, 2, 2, 44], L.k); sh(V(0, 0, 4), 34); }, [[0, 'crowd_ooh', .5], [.4, 'money_rain', .5]]);
// «kein Wort sagt.»: primerísimo plano de Oma: mirada asesina por encima de las gafas, ni un músculo
shot(21.43, 'C', 'punch', L => { kuecheS(L); const o = omaSeat(oma, L, -3); actuar(o, 0, [[0, sitPose({ aRx: .7, aRe: 1.1, headX: -.1 })]], { T: L.T, weight: false }); cara(o, L.T, { expr: 'angry', eyes: 'squint', mouth: 'flat' });
  onFace(o, 3.8, .2, -.2, 34, L.k, 3.2); sh(V(TB.x - 3, 0, -4), 10); }, [[0, 'cricket', .5], [.3, 'tick', .3]]);
// «meine Oma.»: con la taza aún en la boca, a Oma se le iluminan los ojos y le salen corazones
shot(23.40, 'W', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); drink(o, L, L.t0 - .3, .25, { sit: true, pose: SITP, after: 'joy', afterMouth: 'open_smile' }); badge('heart', '', W * .34, H * .3, clamp((L.lt - .2) / .2), 1, .7); badge('heart', '', W * .66, H * .27, clamp((L.lt - .35) / .2), 1, .6);
  onFace(o, 5.2, .6, .9, 38, L.k); sh(V(TB.x - 3, 0, -4), 12); }, [[0, 'aah_old', .5], [.3, 'pling', .4]]);
// «trotzdem wie ein Baby.»: Oma con gorro de dormir abrazada a un cojín, chupándose el pulgar, con una sonrisa de bebé
shot(27.10, 'C', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .3, headZ: .3, aLx: 1.6, aLe: 2.2, aLz: -.2, aRx: 1.0, aRe: 1.6, aRz: -.3 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: 'smile' }); zzz(o, L.T, 1);
  CAMK = 1; onFace(o, 4.4, .4, .6, 38, L.k); sh(V(OKX + 6, 0, -5), 12); }, [[0, 'baby_coo', .5], [.6, 'snore', .4]]);
// «wird Billionär.»: la plaza se convierte en una fuente de oro: billetes saliendo de la cafetera gigante; HUD 1 Bio. €
shot(32.45, 'F', 'punch', L => { town(L, { dusk: 1 }); setHUD(50, '#ffd23f'); billBurst(V(0, 14, -8), L.t0, L.T, 40, 1.6, 0); billBurst(V(0, 14, -8), L.t0 + .3, L.T, 40, 1.4, 40); confRain(V(0, 4, -8), L.T, 50, 30, 20, 22);
  crowdAt(L, 0, 6, 10, 8, 14, 23, { mode: 'cheer', gap: 1 }); badge('gold', '1 BILLION €', W / 2, H * .24, clamp(L.lt / .2), 1, 1.3); cm([0, 9, 34, 0, 12, -8, 50], [0, 10, 28, 0, 13, -8, 48], L.k); sh(V(0, 0, -4), 30); }, [[0, 'money_burst', .6], [.2, 'cha_ching', .6]]);
// «jeden Morgen eine Tasse,»: amanecer en la cocina de una abuela: abre la cortina con la taza humeante y el sol le da en la cara
shot(47.64, 'W', null, L => { kuecheS(L); sun.intensity = 0; const o = put(REN[1], TB.x - 4, 0, -9.6, .35); drink(o, L, L.t0 + .4, .5, { expr: 'warm', after: 'joy', steam: 1 }); confRain(V(TB.x - 4, 6, -11), L.T, 12, 6, 2, 6);
  CAMK = 1; onBody(o, 10, 1.0, .12, 40, L.k, 9, .9, 4.4); sh(V(TB.x - 4, 0, -9), 12); }, [[0, 'curtain', .5], [.4, 'sip', .5], [.8, 'birds_morning', .4]]);
// «Kaffee und Kuchen.»: primer plano: el cuchillo corta la Selva Negra y las tazas chocan sobre la mesa de cuadros
shot(49.69, 'C', 'punch', L => { kuecheS(L); show(KUCH[0], TB.x, 4.3, -1, L.lt * .4, 1.3); [0, 1, 2].forEach(i => { const t = CUPS[i]; show(t, TB.x - 2.6 + i * 2.6, 4.3 + Math.max(0, Math.sin(clamp((L.lt - .2) / .4) * PI)) * 1.2, 1.4 - Math.abs(i - 1) * .4, 0, .8); t.userData.level(.8); t.userData.steam(L.T, 1); });
  cm([TB.x, 9, 7, TB.x, 4.8, -.4, 36], [TB.x, 8.4, 6, TB.x, 4.8, -.4, 34], L.k); sh(V(TB.x, 0, 0), 10); DOF = 1.4; }, [[0, 'knife_cake', .5], [.4, 'cup_clink', .6]]);
// «Rentner Sportwagen,»: primer plano del abuelo al volante, gafas de piloto, bufanda al viento, riendo
shot(52.33, 'C', null, L => { town(L, { morning: 1 }); const r = CARS[0].root || CARS[0]; r.visible = true; r.position.set(0, 0, 30 - L.lt * 4); r.rotation.y = PI; const d = put(REN[0], .9, sitY(REN[0], 1.9), r.position.z + .8, PI); d.blob.visible = false;
  actuar(d, 0, [[0, sitPose({ aRx: 1.3, aRe: .9, aLx: 2.7, aLz: .3, aLe: .3 })]], { T: L.T, weight: false }); laughF(d, L.T); leaves(hp(d), L.T * 3, 20, 10, 10, 8); speedLines(.6, Math.floor(L.T * 15));
  onFace(d, 5.6, .6, -.8, 40, L.k); sh(V(0, 0, 28), 14); }, [[0, 'engine_rev', .6], [.3, 'laugh_old', .5]]);
// «richtig guter Kaffee.»: el barista le da una taza de verdad: el reloj se pone verde con un ✓
shot(56.06, 'W', 'punch', L => { cafe(L); const c = put(CR[20], CIX + 2, 0, -6.2, .3); CAMK = 1; drink(c, L, L.t0 + .05, .35, { meter: true, expr: 'happy', after: 'joy' }); meterOf(c).userData.set('✓ GUT', '+12 €'); const b = put(barista, CIX + .4, 0, -13.2, 0); actuar(b, 0, [[0, 'cheer']], { T: L.T }); laughF(b, L.T);
  badge('green', '✓', W / 2, H * .22, clamp((L.lt - .4) / .15), 1, 1.6); dcam(c, L.k, 10, .7, 5, 42); sh(V(CIX + 2, 0, -7), 16); }, [[0, 'sip', .5], [.4, 'ding', .6]]);
// «jede Tasse»: la cafetera de filtro llena una taza con café Tchibo recién hecho, humo y brillo
shot(63.71, 'Z', null, L => { cafe(L); const K = KAN[0]; show(K, CIX + 1, 4.6 + 1.4, -9.4, 0, 1); K.rotation.z = .9; K.userData.level(.6); const t = CUPS[2]; show(t, CIX, 4.6, -9.4, 0, 1.2); t.userData.level(clamp(L.lt / .6) * .8); t.userData.steam(L.T, 1); show(PACKS.TCHIBO[2], CIX + 2.6, 4.6, -10, -.3, 1);
  cm([CIX + 1, 8, -4.6, CIX + .6, 5.6, -9.4, 34], [CIX + 1, 7.6, -5.4, CIX + .6, 5.6, -9.4, 32], L.k); sh(V(CIX + 6, 0, -9), 10); DOF = 1.4; }, [[0, 'pour', .6]]);
// «kein Zufall:»: Jacky guiña un ojo a cámara señalando el nombre del paquete
shot(68.43, 'C', 'punch', L => { salonS(L); const j = put(jacky, SAX + 1, 0, 1.2, PI - .2); actuar(j, 0, [[0, { aRx: 1.6, aRz: .3, aRe: .2, lean: .05 }]], { T: L.T }); cara(j, L.T, { expr: 'smug', eyes: L.lt > .2 && L.lt < .6 ? 'wink' : 'happy', mouth: 'smirk' }); show(PACKS.JACOBS[0], SAX + 3.8, 3.4, 2.4, PI - .3, 1.4);
  orbit(V(SAX + 2, 5.6, 1.6), lerp(10, 9, L.k), PI - .3, .1, 42); sh(V(SAX + 2, 0, 1.6), 12); }, [[0, 'wink', .6]]);
// «goldene Krone,»: la corona baja girando a cámara lenta entre destellos
shot(71.69, 'Z', null, L => { salonS(L); const cr = CROWNS[2]; show(cr, SAX, 9 - L.lt * 1.6, 1.2, L.T * 2.4, 1.4); confRain(V(SAX, 6, 1.2), L.T, 20, 6, 4, 8);
  cm([SAX, 10, 7, SAX, 8.4, 1.2, 34], [SAX, 9.4, 6, SAX, 7.8, 1.2, 32], L.k); sh(V(SAX, 0, 1), 10); DOF = 1.4; }, [[0, 'sparkle', .6], [.2, 'choir', .3]]);
// «brüht nur mit Melitta.»: primer plano del chorro de agua cayendo en el filtro rojo, el café gotea en la jarra
shot(78.14, 'C', null, L => { zahnS(L); const K = KAN[1]; show(K, ZAX - 3.4, 3.6, 1.2, 0, 1); K.userData.level(clamp(.25 + L.lt * .25)); K.userData.steam(L.T, 1); show(FILT, ZAX - 3.4, 6.1, 1.2, 0, 1);
  for (let i = 0; i < 4; i++) { const d = DROP; d.visible = true; d.position.set(ZAX - 3.4, 6.0 - ((L.T * 1.6) % 1) * 2.2, 1.2); }
  cm([ZAX - 2, 8.6, 6.4, ZAX - 3.4, 6, 1.2, 34], [ZAX - 2.4, 8.2, 5.6, ZAX - 3.4, 6, 1.2, 32], L.k); sh(V(ZAX - 3, 0, 1), 10); DOF = 1.4; }, [[0, 'pour', .5], [.4, 'drip', .5]]);
// «in Dresden,»: en sepia, una calle antigua al atardecer con farolas de gas; un cartel «DRESDEN 1908»
shot(83.00, 'W', null, L => { town(L, { dusk: 1 }); grade.uniforms.sepia.value = .9; crowdAt(L, 0, 30, 6, 4, 12, 70, { mode: 'walk', gap: .8 }); badge('tag', 'DRESDEN · 1908', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1);
  cm([10, 8, 70, 0, 8, 20, 46], [6, 8, 64, 0, 8, 20, 44], L.k); sh(V(0, 0, 40), 30); }, [[0, 'old_film', .5], [.2, 'horse_cart', .4]]);
// «während der Predigt.»: desde los bancos: los fieles se miran unos a otros cuando el cura sorbe por el micrófono
shot(95.73, 'C', null, L => { kircheS(L); POST.push(() => { const l = CR.filter(c => !c.root.visible); [[-11.6, 6.6], [-6.4, 6.6], [6.4, 6.6]].forEach(([x, z], i) => { const c = l[i]; sit2(c, KIX + x, z, PI, 2.5); actuar(c, 0, [[0, sitPose({ headY: (i % 2 ? .5 : -.5) })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'confused', eyes: i % 2 ? 'side_l' : 'side_r', mouth: 'o' }); }); });
  const p = put(pfarrer, KIX - 11, 9.2, -10, .5); p.blob.visible = false; drink(p, L, L.t0, .6, { pose: { aLx: 2.6, aLz: .3, aLe: .4 } }); CAMK = 1; orbit(V(KIX - 6, 6, 4), lerp(20, 18, L.k), PI + .3, .45, 46); sh(V(KIX - 6, 0, 2), 20); }, [[0, 'slurp_mic', .7], [.5, 'murmur', .4]]);
// «Wasser in seine Tasse»: primer plano de la pintura marrón cayendo del pincel en el agua de la taza
shot(102.40, 'C', 'punch', L => { town(L, { dusk: 1 }); const cu = CUPS[12]; show(cu, -37, 3, -48, 0, 1.4); cu.userData.level(.8); const d = DROP; d.visible = true; d.position.set(-37, 5.4 - ((L.T * 1.8) % 1) * 2.2, -48); d.scale.set(1.4, 2.4, 1.4);
  cm([-36, 6.6, -44.4, -37, 4.2, -48, 34], [-36.4, 6.2, -45, -37, 4.2, -48, 32], L.k); sh(V(-37, 0, -48), 10); DOF = 1.4; }, [[0, 'drip', .6], [.4, 'stir', .5]]);
// «gab es ein Problem:»: primer plano de la mesa: fajos de billetes, joyas, coronas… y una silla vacía con mi taza vacía
shot(111.78, 'C', null, L => { kuecheS(L); for (let i = 0; i < 10; i++) { const b = BILL[i]; b.visible = true; b.position.set(TB.x - 4 + (i % 5) * 1.8, 4.4 + (i / 5 | 0) * .14, -1.4 + (i % 2) * .6); b.rotation.set(-PI / 2, i * .4, 0); } show(CROWNS[0], TB.x - 2, 4.3, .8, 0, .8); show(CROWNS[1], TB.x + 1.6, 4.3, .4, 1, .8);
  const t = CUPS[6]; show(t, TB.x + 4, 4.3, 1.6, 0, .9); t.userData.level(0); cm([TB.x + 2, 9.4, 8, TB.x, 4.4, 0, 40], [TB.x + 1, 9, 7, TB.x, 4.4, 0, 38], L.k); sh(V(TB.x, 0, 0), 12); DOF = 1.2; }, [[0, 'coins', .5], [.5, 'hmm', .4]]);
// «zitterten meine Hände.»: primerísimo plano de mis manos temblando con la taza
shot(117.61, 'C', 'punch', L => { kuecheS(L); const c = put(ich, TB.x, 0, 3.4, PI + .1); actuar(c, 0, [[0, tremble(L.T, 3)]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace_wide' }); const e = ESP[0]; attach(e, c.aR.hand, [-.62, -.2, -.5], [PI / 2 + Math.sin(L.T * 55) * .2, 0, 0], 1.1);
  const w = wpos(e); cm([w.x + .6, w.y + 1.2, w.z - 3.6, w.x, w.y, w.z, 34], [w.x + .4, w.y + 1, w.z - 3, w.x, w.y, w.z, 32], L.k); sh(V(TB.x, 0, 3), 10); DOF = 1.4; }, [[0, 'cup_rattle', .8]]);
// «der Familie ohne einen Cent.»: sacudo mi hucha de cerdito: no suena nada; sale una polilla
shot(120.47, 'C', null, L => { zimmerS(L); const c = put(ich, ZIX, 0, 0, 0); actuar(c, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.3, aRz: -.3, aLe: .8 + Math.sin(L.T * 20) * .3, aRe: .8 + Math.sin(L.T * 20) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); const h = hp(c);
  if (ZI.pig) show(ZI.pig, h.x, h.y - 2.6 + Math.sin(L.T * 20) * .3, h.z + 1.6, 0, 1); show(MOTH, h.x + Math.sin(L.T * 3), h.y + L.lt * 2, h.z + 2, 0, .9); MOTH.children.forEach(w => { if (w.name) w.rotation.y = Math.sin(L.T * 30) * .8 * (w.name === 'w1' ? 1 : -1); });
  onBody(c, 9, 0, .1, 40, L.k, 8, 0, 4.6); sh(V(ZIX, 0, 0), 12); }, [[0, 'shake_empty', .6], [.6, 'moth', .4]]);
// «in den Keller schickte,»: la puerta del sótano se abre crujiendo: escaleras oscuras y una bombilla al fondo
shot(123.59, 'Z', null, L => { kellerS(L); CAMK = 1; KE.BL.intensity = 40; cm([KEX - 10, 13, -8, KEX - 10, 7, 4, 50], [KEX - 10, 12.4, -6.6, KEX - 10, 6, 4, 48], L.k); sh(V(KEX - 8, 0, 0), 16); }, [[0, 'door_creak', .7], [.5, 'drip_echo', .4]]);
// «Kaffeedose aus Blech.»: mi mano saca la lata de detrás de los tarros, el polvo cae
shot(127.67, 'C', null, L => { kellerS(L); const c = put(ich, DOSEP.x, 0, -6.2, PI); actuar(c, 0, [[0, { aRx: 1.5, aRe: .3, aLx: 1.2, aLe: .6, lean: .3, crouch: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); dust(DOSEP.clone().add(V(0, 1, 1)), L.t0, L.T, 10, .6);
  CAMK = 1; orbit(V(DOSEP.x, 3.4, -7), lerp(10, 9, L.k), PI / 2 + .45, .14, 42); sh(V(DOSEP.x, 0, -8), 10); }, [[0, 'tin_lift', .5], [.3, 'dust_fall', .4]]);
// «und kochte mir eine Tasse.»: la cafetera gotea dentro de la jarra en la cocina a oscuras, con un brillo dorado
shot(134.33, 'C', null, L => { kuecheS(L, { night: 1 }); const K = KAN[2]; show(K, TB.x + 1.8, 4.3, -3.4, 0, 1.2); K.userData.level(clamp(.2 + L.lt * .4)); K.userData.steam(L.T, 1); show(FILT, TB.x + 1.8, 7.1, -3.4, 0, 1.2); bloom.strength = .45;
  cm([TB.x + 3, 8.6, 3.4, TB.x + 1.8, 6, -3.4, 34], [TB.x + 2.6, 8.2, 2.6, TB.x + 1.8, 6, -3.4, 32], L.k); sh(V(TB.x, 0, -3), 10); DOF = 1.4; }, [[0, 'drip', .5], [.5, 'magic_shimmer', .4]]);
// «Kaffee meines Lebens.»: la taza en primer plano con un corazón de espuma, humo dorado subiendo
shot(137.77, 'F', null, L => { kuecheS(L, { night: 1 }); const t = MUGS.get(ich) || mugOf(ich); show(t, TB.x, 4.3, -1, L.lt * .3, 1.6); t.userData.level(.85); t.userData.steam(L.T, 1); confRain(V(TB.x, 4.3, -1), L.T, 16, 3, 3, 5); bloom.strength = .5;
  cm([TB.x, 9, 2.8, TB.x, 5.6, -1, 34], [TB.x, 8.6, 2.2, TB.x, 5.6, -1, 30], L.k); sh(V(TB.x, 0, -1), 8); DOF = 1.4; }, [[0, 'choir', .5]]);
// «noch einen Löffel.»: primer plano de la cuchara hundiéndose en el café molido que brilla
shot(140.00, 'C', 'punch', L => { kuecheS(L, { night: 1 }); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1.3); DOSE.userData.open(1); DOSE.userData.glow(.6); const d = wpos(DOSE); show(SPOON, d.x, d.y + 3.2 - Math.sin(clamp(L.lt / .6) * PI) * .8, d.z + .4, 0, 1.3); SPOON.rotation.x = .9;
  cm([d.x + .6, d.y + 5.6, d.z + 3.4, d.x, d.y + 2.4, d.z, 32], [d.x + .4, d.y + 5.2, d.z + 2.8, d.x, d.y + 2.4, d.z, 30], L.k); sh(d, 8); DOF = 1.4; }, [[0, 'spoon_scoop', .7]]);
// «ganze Tchibo-Filiale.»: fuera, en la plaza: la tienda Tchibo con un lazo rojo gigante y el cartel VERKAUFT; yo en la puerta haciendo una reverencia
shot(158.39, 'F', 'punch', L => { town(L, { morning: 1 }); const h = HSN('TCHIBO') || RT.HS[13]; const fx = h.x * .9, fz = h.z; const c = put(ich, fx, 0, fz - 2, h.x < 0 ? PI / 2 : -PI / 2); actuar(c, 0, [[0, { lean: .35, aRx: .4, aLx: 2.2, aLz: .5 }]], { T: L.T }); laughF(c, L.T);
  DS3.userData.draw('verkauft3', (cc, w, hh) => { cc.fillStyle = '#c8202a'; cc.fillRect(0, 0, w, hh); cc.fillStyle = '#ffffff'; cc.font = `700 110px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('VERKAUFT!', w / 2, hh / 2 + 6); }); show(DS3, fx + (h.x < 0 ? -2 : 2), 9.5, fz, h.x < 0 ? PI / 2 : -PI / 2, .7);
  confetti(V(fx, 4, fz), L.t0, L.T, 50, 1); crowdAt(L, fx * .7, fz, 6, 5, 10, 72, { mode: 'clap', gap: 1.6 }); orbit(V(fx, 6, fz), lerp(20, 17, L.k), h.x < 0 ? PI / 2 : -PI / 2, .14, 46); sh(V(fx, 0, fz), 22); }, [[0, 'crowd_cheer', .5], [.2, 'party_horn', .5]]);
// «die Wirtschaft zusammen.»: pánico en la plaza: la gente corre, los billetes vuelan con el viento sin que nadie los recoja
shot(164.01, 'W', 'punch', L => { town(L, { dusk: 1 }); crowdAt(L, 0, 6, 14, 4, 16, 74, { mode: i => i % 3 === 2 ? 'shock' : 'run', speed: 9, gap: .3 }); billRain(V(0, 0, 6), L.T * 2.4, 90, 40, 30, 14); leaves(V(0, 0, 10), L.T * 3, 40, 40, 30, 12); SHAKE = .3;
  cm([0, 7, 34, 0, 5, 0, 48], [4, 7.5, 30, 0, 5, 0, 46], L.k); sh(V(0, 0, 6), 30); }, [[0, 'crowd_panic', .6], [.4, 'wind', .5]]);
// «plötzlich eine Million.»: primer plano de la etiqueta del Brötchen: «1.000.000 €»
shot(166.13, 'C', 'punch', L => { town(L, { morning: 1 }); show(BROT, 0, 3, 10, 0, 1.6); cm([0, 6.4, 18, 0, 4.4, 10, 36], [0, 6.2, 16.4, 0, 4.4, 10, 34], L.k); sh(V(0, 0, 10), 10); DOF = 1.4; }, [[0, 'stamp', .6], [.2, 'gasp', .4]]);
// «hundert Euro.»: un billete de 100 aterriza en la mano de la vecina dormida, que sonríe sin despertarse
shot(172.92, 'C', 'punch', L => { zimmerS(L, { night: 1 }); const c = put(CR[1], ZIX - 7, 3.5, -2.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .12, 0, 0); c.blob.visible = false; CAMK = 1; actuar(c, 0, [[0, { aRx: .9, aRz: .5, aRe: .4, headX: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'smile' });
  billFall(V(ZIX - 6, 2, -3.6), L.t0, L.T, 12, 3, 2, 8); cashPop(c, '+100 €', clamp(L.lt / .2), 'green', 1.2); const h = hp(c); cm([h.x + 4, h.y + 8, h.z + 6, h.x + 1, h.y, h.z, 40], [h.x + 3.4, h.y + 7, h.z + 5, h.x + 1, h.y, h.z, 38], L.k); sh(V(ZIX - 6, 0, -3), 12); }, [[0, 'cash_reg', .6], [.3, 'snore', .4]]);
// «keine Minute mehr geschlafen.»: por la mañana, zombi, con ojeras enormes, me sirvo café… del revés
shot(176.22, 'W', null, L => { kuecheS(L); const c = put(ich, TB.x, 0, -6.4, 0); actuar(c, 0, [[0, { aRx: 1.3, aRe: .7, aLx: 1.0, aLe: 1.0, headX: .3, headZ: .15, lean: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'half', mouth: 'flat' }); sweat(c, L.T, 1);
  const K = KAN[2]; attach(K, c.aR.hand, [-.3, -.6, -.6], [PI / 2 + 1.2, 0, 0], .8); K.userData.level(.6); meterOf(c).userData.set('SCHLAF', '0 €', '#ff4a4a'); onBody(c, 10, -.2, .1, 42, L.k, 9, -.2, 4.4); sh(V(TB.x, 0, -6), 12); }, [[0, 'yawn', .5], [.6, 'pour', .5]]);
// «Ärmsten der Stadt.»: nuestras dos caras de pena, de cerca, con las hojas cayendo
shot(179.57, 'C', 'punch', L => { town(L, { night: 1 }); const c = sit2(ich, -16.6, -19, PI / 2, 2.4), p = sit2(pfarrer, -16.6, -21.6, PI / 2, 2.4); [c, p].forEach((x, i) => { actuar(x, 0, [[0, sitPose({ aRx: .8, aRe: 1.4, headX: .25, headY: i ? .3 : -.3 })]], { T: L.T, weight: false }); cara(x, L.T + i, { expr: 'sad', mouth: 'frown' }); }); tears(c, L.T, 0);
  leaves(V(-16, 0, -20), L.T, 16, 8, 8, 10); orbit(V(-16.6, 6, -20.3), lerp(9, 8, L.k), PI / 2, .08, 40); sh(V(-16, 0, -20), 12); }, [[0, 'sad_trombone', .5]]);
// «sie wie ein Baby.»: Oma, de cerca, sonríe dormida con burbujita de saliva; el reloj sube
shot(185.05, 'C', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .3, headZ: .3, aLx: 1.6, aLe: 2.2, aLz: -.2 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: 'smile' }); zzz(o, L.T, 1);
  meterOf(o).userData.set('SCHLAF', '+900 €', '#9ad8ff'); CAMK = 1; onFace(o, 4.4, .4, -.4, 36, L.k); sh(V(OKX + 6, 0, -5), 12); }, [[0, 'snore', .5], [.4, 'baby_coo', .4]]);
// «in den Keller geschickt hat?»: flashback en sepia de mí bajando por primera vez las escaleras del sótano
shot(187.40, 'W', null, L => { kellerS(L); grade.uniforms.sepia.value = .8; const k = clamp(L.lt / 1.2); const c = put(ich, KEX - 10, lerp(9.8, 7.4, k), lerp(-4, -1.2, k), 0); c.blob.visible = false; actuar(c, 0, [[0, { ...walkP(L.T, 1), aRx: .8, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral' });
  orbit(V(KEX - 10, 8, -2), lerp(13, 11, L.k), 0, .35, 44); sh(V(KEX - 8, 0, -2), 16); }, [[0, 'old_film', .4], [.3, 'stairs_creak', .5]]);
// «mich schon wieder»: primer plano de mi cara de terror, me tiembla el labio
shot(191.27, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x + 11, 0, 4, -PI / 2 - .4); actuar(c, 0, [[0, { ...GEST.shock, headZ: Math.sin(L.T * 30) * .03 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace_wide' }); sweat(c, L.T, 3);
  onFace(c, 4.4, .3, .3, 36, L.k); sh(V(TB.x + 11, 0, 4), 10); }, [[0, 'gulp_nervous', .6], [.3, 'heartbeat', .5]]);
