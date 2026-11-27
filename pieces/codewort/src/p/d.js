// ---------- d: la Kammer, el Golf y las dos puertas (163,97 – 225,6 s) ----------
const BACKOUT = V(HAX, 0, -48.2), KAMMERD = HA.kammer.pos;
const kammerKids = (L, o = {}) => { kammerS(L); const c = sit(mats, KAX - 1.6, 1.0, -5, .1, L, { aLx: 1.1, aRx: 1.1, aLe: 1.6, aRe: 1.6, lean: .15, ...(o.mp || {}) }); const i = sit(ida, KAX + 1.6, .9, -4.8, -.3, L, { aLx: 1.3, aRx: 1.3, aLe: 1.6, aRe: 1.6, lean: .1, ...(o.ip || {}) }); attach(BUNNY, i.spine, [0, 1.2, .9], [0, 0, 0], .8); return { c, i }; };
// ---- 106 «Ich habe aufgelegt.»: Mats cuelga de un toque y baja el móvil
shot(163.97, 'C', null, L => { const c = hallMats(L, { x: .4, z: 9, ry: PI - .2, pose: L.lt < .3 ? GEST.phone_look : { aRx: .4, aRe: .6 } }); cara(c, L.T, { expr: 'scared', mouth: 'flat' }); onFace(c, 6, -.4, .3, 42, L.k, 5.4); }, [[.15, 'button', .6]]);
// ---- 107 «Ich konnte es nicht ertragen, alles zweimal zu hören.»: se tapa los oídos y resbala por la pared hasta el suelo
shot(165.14, 'W', null, L => { flur(L); const k = easeInOut(clamp(L.lt / 1.6)); const c = put(mats, HAX + 6.8, 0, 4, -PI / 2 - .2); actuar(c, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: -.3, aRz: -.3, aLe: 2.5, aRe: 2.5, crouch: .1 + k * .55, lean: .1 + k * .2, lLx: k * .7, lRx: k * .7, lLk: k * 1.2, lRk: k * 1.2, headX: .2 }]], { T: L.T, extra: shiver(L.T, 1.2) }); cara(c, L.T, { eyes: 'closed', mouth: 'grimace' });
  onBody(c, 12, 0, .12, 42, L.k, 10); }, [[0, 'cloth', .5], [.6, 'slide', .4], [1.4, 'thud', .3]]);
// ---- 108 «Ida stand oben an der Treppe,»: contrapicado de la escalera: Ida arriba, en el rellano
shot(167.96, 'S', null, L => { flur(L); const p = HA.landing; const i = put(ida, p.x + 1.2, p.y, p.z + 1.6, 0); actuar(i, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2, headX: .2 }]], { T: L.T }); attach(BUNNY, i.spine, [0, 1.2, .9], [0, 0, 0], .8); cara(i, L.T, { expr: 'worried' });
  cm([HAX - 4.6, 4, 12, p.x + 1.2, p.y + 4, p.z, 30], [HAX - 4.6, 4.4, 10, p.x + 1.2, p.y + 4.2, p.z, 26], L.k); }, [[.2, 'wood_creak', .5]]);
// ---- 109 «im Schlafanzug,»: Ida, medio dormida, se frota un ojo con su pijama de estrellas
shot(169.37, 'C', null, L => { flur(L); const p = HA.landing; const i = put(ida, p.x + 1.2, p.y, p.z + 1.6, 0); actuar(i, 0, [[0, { aRx: 2.2, aRz: -.3, aRe: 2.3, aLx: .4, headX: .15 }]], { T: L.T }); cara(i, L.T, { expr: 'tired', eyes: 'half', mouth: 'o' }); onBody(i, 9, 0, .05, 44, L.k, 8); }, [[0, 'yawn_f', .5]]);
// ---- 110 «mit ihrem Kuscheltier im Arm.»: el conejo de peluche, apretado contra su pecho
shot(170.35, 'Z', null, L => { flur(L); const p = HA.landing; const i = put(ida, p.x + 1.2, p.y, p.z + 1.6, 0); actuar(i, 0, [[0, 'hug_self']], { T: L.T }); attach(BUNNY, i.spine, [0, 1.2, .9], [0, 0, 0], .8); cara(i, L.T, { expr: 'sad', mouth: 'flat' }); onFace(i, 4.6, -1.0, 0, 42, L.k, 4.0); }, [[0, 'cloth', .4]]);
// ---- 111 «Ich habe sie in die Abstellkammer unter der Treppe getragen.»: Mats lleva a Ida a caballito hasta la puertecita bajo la escalera, que está abierta
shot(171.67, 'W', null, L => { flur(L); HA.kammer.door.rotation.y = PI / 2 + 1.4; const c = walk(mats, L, HAX + 3, 2, PI + .28, 2.4, 0, { face: false, pose: { aLx: .8, aRx: .8, aLe: 1.6, aRe: 1.6, lean: .2 } }); cara(c, L.T, { expr: 'determined' });
  attach(ida.root, c.spine, [0, .3, -1.5], [0, 0, 0], .76); ida.root.visible = true; actuar(ida, 0, [[0, { aLx: 1.9, aRx: 1.9, aLz: -.6, aRz: -.6, aLe: .9, aRe: .9, lLx: 1.2, lRx: 1.2, lLk: 1.4, lRk: 1.4 }]], { T: L.T }); cara(ida, L.T, { expr: 'worried' });
  cm([HAX + 3, 7.4, -18, HAX + 2, 4.6, -1, 48], [HAX + 3, 7.2, -16.5, HAX + 2, 4.6, -1, 48], L.k); }, [[0, 'steps', .5], [1.4, 'wood_creak', .5]]);
// ---- 112 «Wir saßen im Dunkeln auf den Schuhen,»: dentro de la Kammer: los dos sentados sobre los zapatos; la rendija de luz bajo la puerta
shot(174.26, 'F', null, L => { const { c, i } = kammerKids(L); cara(c, L.T, { expr: 'worried' }); cara(i, L.T, { expr: 'sad' }); cm([KAX + 4, 6.4, 5, KAX, 3, -4.8, 50], [KAX + 3.4, 6, 4, KAX, 3, -4.8, 48], L.k); }, [[0, 'cloth', .4], [.5, 'drip', .3]]);
// ---- 113 «die Tür zu.»: la puerta se cierra desde dentro y la rendija se estrecha hasta la oscuridad
shot(175.97, 'C', null, L => { kammerS(L); const k = easeIn(clamp(L.lt / .6)); KA.door.rotation.y = (1 - k) * -1.1; KA.slit.material.emissiveIntensity = 4; const c = put(mats, KAX - .4, 0, 5.6, PI); actuar(c, 0, [[0, { aRx: 1.6, aRe: .4, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' });
  DARK = k * .35; cm([KAX - 1, 6, -4, KAX, 4.4, 8.6, 50], [KAX - 1, 6, -3.4, KAX, 4.4, 8.6, 50], L.k); }, [[.4, 'door_crash', .3], [.5, 'click_metal', .5]]);
// ---- 114 «Sie fragte, ob Mama schon da ist.»: Ida, en la penumbra azul, susurra
shot(176.82, 'S', null, L => { const { c, i } = kammerKids(L, { ip: { headY: -.4 } }); talk(i, L.T, 176.82, 178.43, 'sad'); cara(c, L.T, { expr: 'worried' }); onFace(i, 4.4, -.5, .3, 42, L.k, 3.9); }, [[0, 'whisper', .6]]);
// ---- 115 «Ich sagte: „Fast.“»: Mats le sonríe forzado
shot(178.43, 'C', null, L => { const { c, i } = kammerKids(L, { mp: { headY: .4 } }); cara(c, L.T, { eyes: 'half', mouth: kitLips(L.T, spoken(179.2, 179.8)) || 'smile' }); cara(i, L.T, { expr: 'sad' }); onFace(c, 4.6, -.4, -.4, 42, L.k, 4.0); bubble(c, 'Fast.', (L.lt - .8) / .2, 1.6); }, [[.8, 'whisper', .5]]);
// ---- 116 «Sie fragte, warum wir in der Kammer sitzen.»: Ida inclina la cabeza, confusa
shot(179.76, 'W', null, L => { const { c, i } = kammerKids(L, { ip: { headZ: .3, headY: -.4 } }); talk(i, L.T, 179.76, 181.55, 'confused'); cara(c, L.T, { expr: 'worried' }); onFace(i, 4.4, -.4, .2, 42, L.k, 3.9); }, [[0, 'whisper', .5]]);
// ---- 117 «Ich sagte: „Das ist eine Türübung.“»: Mats se lleva el dedo a los labios; TÜRÜBUNG
shot(181.55, 'C', null, L => { const { c, i } = kammerKids(L, { mp: { aRx: 2.3, aRz: .1, aRe: 2.6, headY: .4 } }); cara(c, L.T, { eyes: 'half', mouth: 'flat' }); cara(i, L.T, { expr: 'sad' }); badge('tag', 'TÜRÜBUNG', W / 2, H * .18, (L.lt - .6) / .2); onFace(c, 4.8, -.3, -.4, 42, L.k, 4.2); }, [[.1, 'whisper', .6], [.6, 'pop', .3]]);
// ---- 118 «Und ich dachte immer wieder dasselbe.» (zoom lento): los ojos de Mats en la oscuridad; interrogaciones que giran
shot(183.42, 'Z', 'slow', L => { const { c } = kammerKids(L); cara(c, L.T, { eyes: Math.sin(L.T * 2) > 0 ? 'side_l' : 'side_r', mouth: 'flat' }); onFace(c, 5, -.2, 0, 40, L.k, 3.6);
  for (let k = 0; k < 3; k++) { const a = L.T * 1.5 + k * 2.1; badge('q', '?', W / 2 + Math.cos(a) * 300, H * .38 + Math.sin(a) * 160, (L.lt - k * .2) / .2, .9, .6); } }, [[0, 'hum_low', .5]]);
// ---- 119 «Niemand kennt unser Wort außer uns.»: recuerdo cálido: Mama, Mats e Ida abrazados en el sofá; «NUR WIR»
shot(185.21, 'B', null, L => { flur(L, { h: 20, m: 0 }); SEPIA = .35; const m = sit(mamaB, HAX + 24, 3.4, -32.4, 0, L, { aLx: 1.2, aRx: 1.2, aLz: -1.2, aRz: -1.2, aLe: .3, aRe: .3 }); laughF(m, L.T); const c = sit(mats, HAX + 20.6, 3.4, -32.2, .2, L, { aRx: 1.4, aRz: -.6, aRe: .5 }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  const i = sit(ida, HAX + 27.2, 3.4, -32.2, -.2, L, { aLx: 1.4, aLz: -.6, aLe: .5 }); laughF(i, L.T + .3); badge('tag', 'NUR WIR', W / 2, H * .17, (L.lt - .3) / .2); cm([HAX + 24, 7.4, -18, HAX + 24, 5, -32, 46], [HAX + 24, 7, -20, HAX + 24, 5, -32, 46], L.k); }, [[0, 'film_roll', .3], [.3, 'kids_laugh', .3]]);
// ---- 120 «Nicht Frau Kessler.»: la Kessler en su porche niega con la cabeza; X
shot(187.07, 'C', null, L => { strasse(L, { t: 'night' }); const p = KPORCH; const c = put(kessler, p.x + 2.4, p.y, p.z + .6, toDoorK + 1.4); actuar(c, 0, [[0, { ...GEST.shrug, headY: Math.sin(L.T * 9) * .4 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'frown' });
  badge('x', '', W / 2, H * .17, (L.lt - .4) / .2, 1, .9); lp(0, p.x + 4, 9, p.z + 4, 60, 0xffb860, 20); onFace(c, 6, -.3, 0, 42, L.k, 5.2); }, [[.4, 'thud', .4]]);
// ---- 121 «Nicht meine Freunde.»: los tres amigos se encogen de hombros; X
shot(188.4, 'W', null, L => { strasse(L, { t: 'day' }); [[-3.4, 36.6, .4, 4], [0, 35.6, 0, 5], [3.4, 36.6, -.4, 6]].forEach(([x, z, ry, i]) => { const k = put(KIDS[i], x, 0, z, ry); actuar(k, 0, [[0, 'shrug']], { T: L.T + i }); cara(k, L.T + i, { expr: 'confused' }); });
  badge('x', '', W / 2, H * .17, (L.lt - .3) / .2, 1, .9); cm([0, 7.4, 50, 0, 5.4, 36, 44], [0, 7.2, 48, 0, 5.4, 36, 44], L.k); sh(V(0, 0, 36), 30); }, [[.3, 'thud', .4]]);
// ---- 122 «Woher kannte dieses Ding also „Kuschelkeks“?» (zoom lento): de nuevo en la Kammer, los ojos de Mats muy abiertos; «?»
shot(189.38, 'Z', 'slow', L => { const { c, i } = kammerKids(L); cara(c, L.T, { eyes: 'terror', mouth: 'flat' }); cara(i, L.T, { eyes: 'closed', mouth: 'flat' }); onFace(c, 5.4, -.2, 0, 40, L.k, 3.4); badge('q', '?', W / 2, H * .16, (L.lt - 1.2) / .2, 1, 1); }, [[1.2, 'creepy_ting', .5]]);
// ---- 123 «Irgendwann wurde es draußen still.»: fuera: la calle de noche, quieta; el viento mueve las copas; nadie
shot(191.93, 'B', null, L => { strasse(L, { t: 'night' }); scene.fog.density = .004; cm([10, 6, -14, 30, 6, -1.5, 46], [10, 6.2, -10, 30, 6, -1.5, 46], L.k); sh(V(30, 0, 0), 40); }, [[0, 'wind', .5], [.6, 'owl', .4]]);
// ---- 124 «Ich bin aus der Kammer geschlichen»: la puertecita se abre y Mats sale de puntillas, agachado
shot(193.75, 'S', null, L => { flur(L); HA.kammer.door.rotation.y = PI / 2 + easeOut(clamp(L.lt / .4)) * 1.3; const k = KAMMERD; const c = put(mats, k.x + .4 + L.lt * 1.6, 0, k.z, PI / 2); actuar(c, 0, [[0, { ...GEST.sneak, lLx: .65 + Math.sin(L.T * 6) * .3, lRx: .15 - Math.sin(L.T * 6) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'scared', eyes: 'side_r' });
  cm([k.x + 9, 6, k.z + 7, k.x + 1.6, 3.6, k.z, 48], [k.x + 8.4, 5.6, k.z + 6, k.x + 2.2, 3.6, k.z, 48], L.k); }, [[0, 'wood_creak', .6], [.5, 'steps', .3]]);
// ---- 125 «und habe noch mal durch den Türspion geschaut.»: otra vez el ojo en la mirilla (perfil)
shot(195.27, 'Z', null, L => { flur(L); const c = put(mats, DOORIN.x + 1, .5, 18.2, 0); actuar(c, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: .4, aRe: .4, lean: .12, headX: -.15 }]], { T: L.T, extra: shiver(L.T, .5) }); cara(c, L.T, { eyes: 'squint', mouth: 'flat' });
  const h = hp(c); cam([h.x - 7.4, h.y + .8, h.z - 6], [h.x, h.y - 1, h.z + .4], 44); }, [[0, 'cloth', .4]]);
// ---- 126 «Das Verandalicht war an.»: POV: el farol del porche encendido, las polillas dando vueltas
shot(197.15, 'I', null, L => { strasse(L, { t: 'night' }); const lpos = HMW(HM.doorX + 3.2, HM.B + 9.6, HM.frontZ + .8); moths(lpos, L.T); lp(0, lpos.x, lpos.y, lpos.z, 40, 0xffb860, 16); peephole(L, 1, { look: lpos.clone().add(V(-2, -1, 0)), fov: 70 }); }, [[0, 'hum', .4]]);
// ---- 127 «Und darunter stand niemand.»: POV: el porche vacío
shot(198.39, 'C', null, L => { strasse(L, { t: 'night' }); lp(0, PORCH.x, 10, PORCH.z + 2, 50, 0xffb860, 18); peephole(L, 1, { ty: 4.6, fov: 100 }); }, [[0, 'wind', .4]]);
// ---- 128 «Die Veranda war leer.» (zoom lento): desde la calle: el porche vacío bajo el farol
shot(199.75, 'Z', 'slow', L => { strasse(L, { t: 'night' }); moths(HMW(HM.doorX + 3.2, HM.B + 9.6, HM.frontZ + .8), L.T); cm([PORCH.x - 22, 6.4, PORCH.z, PORCH.x, 6, PORCH.z, 44], [PORCH.x - 13, 6.4, PORCH.z, PORCH.x, 6.2, PORCH.z, 40], L.k); sh(V(PORCH.x, 0, PORCH.z), 26); }, [[.2, 'crickets', .4]]);
// ---- 129 «Dann huschten Scheinwerfer über die Wohnzimmerwand.»: la luz de unos faros barre la pared del salón; Mats se gira
shot(200.91, 'W', null, L => { flur(L, { dark: true }); HA.sweep.material.opacity = Math.sin(clamp(L.lt / 2) * PI); HA.sweep.position.x = lerp(-6, 16, clamp(L.lt / 2)) + 16; const c = put(mats, HAX + 14, 0, -20, -.6 - L.k * .8); actuar(c, 0, [[0, { aLx: .3, aRx: .3, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  cm([HAX + 10, 7, -6, HAX + 22, 6, -38, 50], [HAX + 11, 7, -8, HAX + 22, 6, -38, 50], L.k); }, [[0, 'car_pass', .6]]);
// ---- 130 «Ich hörte Mamas alten Golf in die Einfahrt fahren.»: el Golf rojo gira hacia el camino de grava con los faros encendidos
shot(203.19, 'R', null, L => { strasse(L, { t: 'night' }); const k = easeOut(clamp(L.lt / 2)); show(GOLF, lerp(2, 30, k), 0, lerp(-6, -22, k), lerp(PI, PI / 2, k)); GOLF.userData.lights(1);
  cm([16, 8, 14, 30, 3, -22, 46], [18, 7.6, 12, 30, 3, -22, 46], L.k); sh(V(30, 0, -20), 30); }, [[0, 'car', .7], [1.2, 'gravel', .6]]);
// ---- 131 «Die Autotür knallte.»: la puerta del coche se cierra de golpe
shot(205.28, 'C', 'punch', L => { strasse(L, { t: 'night' }); show(GOLF, 34, 0, -22, PI / 2); GOLF.userData.lights(1); GOLF.userData.door.rotation.y = -(1 - easeIn(clamp(L.lt / .25))) * 1.1; const d = wpos(GOLF.userData.door);
  cam([d.x - 9, d.y + 4.4, d.z - 9], [d.x + 1.6, d.y + 1.6, d.z], 44); }, [[.2, 'car_door', 1]]);
// ---- 132 «Schritte auf dem Kies.»: plano bajo: unos pies con botas pisan la grava, junto al coche
shot(206.39, 'W', null, L => { strasse(L, { t: 'night' }); show(GOLF, 34, 0, -22, PI / 2); GOLF.userData.lights(1); const m = walk(mama, L, 30, -16, -PI / 2 + .3, 2.4, 0, { face: false }); m.setFace({ eyes: 'normal', mouth: 'flat' });
  const p = m.root.position; cam([p.x - 4, 1.4, p.z + 3], [p.x, 1, p.z], 46); }, [[0, 'gravel', .8]]);
// ---- 133 «Schnelle Schritte.»: los pies corren
shot(207.44, 'C', null, L => { strasse(L, { t: 'night' }); show(GOLF, 34, 0, -22, PI / 2); GOLF.userData.lights(1); const m = walk(mama, L, 28, -15, -PI / 2 + .4, 7, 0, { run: true, face: false }); const p = m.root.position; cam([p.x - 3, 1.6, p.z + 3.4], [p.x, 1, p.z], 48); }, [[0, 'gravel', 1]]);
// ---- 134 «Als würde jemand rennen.»: una silueta corre hacia la casa a contraluz de los faros
shot(208.28, 'S', null, L => { strasse(L, { t: 'night' }); show(GOLF, 34, 0, -22, PI / 2); GOLF.userData.lights(1); const m = walk(mama, L, 24, -18, .9, 7, 0, { run: true, face: false }); m.setFace({ eyes: 'closed', mouth: 'flat' }); const p = m.root.position;
  cm([12, 6, -28, p.x, 4.6, p.z, 46], [13, 6, -27, p.x, 4.6, p.z, 46], L.k); sh(V(p.x, 0, p.z), 30); }, [[0, 'run_cobble', .7]]);
// ---- 135 «Dann gar nichts mehr.»: el camino vacío: la puerta del coche abierta, los faros encendidos, nadie
shot(209.26, 'B', null, L => { strasse(L, { t: 'night' }); show(GOLF, 34, 0, -22, PI / 2); GOLF.userData.lights(1); GOLF.userData.door.rotation.y = -1.1; DARK = .15 * L.k; cm([14, 9, -40, 32, 3, -20, 46], [15, 8.6, -38, 32, 3, -20, 44], L.k); sh(V(32, 0, -20), 30); }, [[0, 'silence_tick', .5]]);
// ---- 136 «Ich stand im Flur, hielt die Luft an, Idas Hand in meiner.» (zoom lento): los dos de la mano en el pasillo, quietos
shot(210.37, 'Z', 'slow', L => { flur(L, { dark: true }); const c = put(mats, HAX + .4, 0, -4, PI), i = put(ida, HAX + 2.6, 0, -4.4, PI - .2); actuar(c, 0, [[0, { aLx: .4, aLz: -.2, aLe: .2, headX: .05 }]], { T: L.T, breathe: false, extra: shiver(L.T, .5) }); actuar(i, 0, [[0, { aRx: .6, aRz: -.2, aLx: 1.3, aLe: 1.6 }]], { T: L.T, extra: shiver(L.T, .6) });
  attach(BUNNY, i.aL.hand, [.4, -.7, .4], [0, 0, 0], .8); cara(c, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); cara(i, L.T, { expr: 'scared' }); cm([HAX + 1.5, 6.4, -18, HAX + 1.5, 5, -4, 48], [HAX + 1.5, 6, -14, HAX + 1.5, 5, -4, 44], L.k); }, [[.3, 'breath', .4], [1.4, 'heartbeat', .5]]);
// ---- 137 «Klopf.»: la puerta de casa se sacude (golpe)
shot(213.19, 'C', 'punch', L => { flur(L, { dark: true }); HA.front.door.rotation.y = PI - rattle(L, 0, 1, 2) * .04; const p = PEEPW(); cam([p.x - 1, p.y - 2, p.z - 9], [p.x, p.y - 3, p.z], 46); }, [[0, 'knock', 1]]);
// ---- 138 «Klopf.»: Mats da un respingo
shot(214.02, 'C', 'punch', L => { flur(L, { dark: true }); const c = put(mats, HAX + .4, 0, -4, 0); actuar(c, L.lt, [[0, 'recoil']], { T: L.T }); cara(c, L.T, { eyes: 'terror', mouth: 'o' }); onFace(c, 4.6, -.3, 0, 40, L.k, 4.2); }, [[0, 'knock', 1]]);
// ---- 139 «Klopf.»: Ida aprieta el conejo
shot(214.71, 'C', 'punch', L => { flur(L, { dark: true }); const i = put(ida, HAX + 2.6, 0, -4.4, 0); actuar(i, 0, [[0, 'hug_self']], { T: L.T }); attach(BUNNY, i.spine, [0, 1.2, .9], [0, 0, 0], .8); cara(i, L.T, { eyes: 'terror', mouth: 'o' }); onFace(i, 4, -.6, 0, 40, L.k, 3.6); }, [[0, 'knock', 1]]);
// ---- 140 «An der Haustür.»: plano amplio del pasillo: los dos niños, de espaldas, frente a la puerta de casa
shot(215.19, 'W', null, L => { flur(L, { dark: true }); const c = put(mats, HAX + .4, 0, -4, 0), i = put(ida, HAX + 2.6, 0, -4.4, -.1); actuar(c, 0, [[0, { aLx: .4 }]], { T: L.T }); actuar(i, 0, [[0, { aRx: .6, aLx: 1.3, aLe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' }); cara(i, L.T, { expr: 'scared' });
  cm([HAX + 1.5, 9, -26, HAX + 1.5, 5.4, 19, 46], [HAX + 1.5, 8.6, -22, HAX + 1.5, 5.4, 19, 46], L.k); }, [[0, 'wind', .3]]);
// ---- 141 «„Mats, ich bin’s!“»: la puerta de casa; por las ventanitas, la silueta de Mama
shot(216.25, 'C', null, L => { flur(L, { dark: true }); HA.side.forEach(s => s.material.opacity = .25); const d = put(ding, DOORIN.x + 4.1, 0, 22.4, PI); creepF(d, L.T, .8); lp(0, DOORIN.x + 4.1, 8, 25, 80, 0xffb060, 16);
  badge('bubble', 'Mats, ich bin’s!', W / 2, H * .2, (L.lt - .05) / .2); cm([DOORIN.x, 6.6, 8, DOORIN.x + 3, 6.2, 20, 44], [DOORIN.x + .4, 6.6, 10, DOORIN.x + 3, 6.2, 20, 40], L.k); }, [[0, 'creepy_ting', .5]]);
// ---- 142 «Und bevor ich mich überhaupt umdrehen konnte:» (zoom lento): Mats empieza a girarse muy despacio
shot(217.57, 'Z', 'slow', L => { flur(L, { dark: true }); const c = put(mats, HAX + .4, 0, -4, easeInOut(L.k) * .9); actuar(c, 0, [[0, { aLx: .4, headY: easeInOut(L.k) * .8 }]], { T: L.T, extra: shiver(L.T, .5) }); cara(c, L.T, { eyes: 'side_l', mouth: 'flat', noBlink: true }); onFace(c, 5.6, -.2, 0, 40, L.k, 4.2); }, [[0, 'breath', .4]]);
// ---- 143 «Klopf.»: la puerta trasera se sacude; tras sus cristales, una silueta
shot(220.04, 'C', 'punch', L => { flur(L, { dark: true }); HA.back.door.rotation.y = rattle(L, 0, 1, 2) * .04; const d = put(ding, HAX + 1, 2.2, -48.4, 0); creepF(d, L.T, .8); cam([HAX + 1, 7, -36], [HAX + 1, 6.6, -46], 44); }, [[0, 'knock', 1]]);
// ---- 144 «Klopf.»: los dos se han dado la vuelta: caras de pánico
shot(220.69, 'C', 'punch', L => { flur(L, { dark: true }); const c = put(mats, HAX + .4, 0, -4, PI), i = put(ida, HAX + 2.6, 0, -4.4, PI); actuar(c, 0, [[0, 'shock']], { T: L.T }); actuar(i, 0, [[0, 'shock']], { T: L.T }); cara(c, L.T, { eyes: 'terror', mouth: 'o' }); cara(i, L.T, { eyes: 'terror', mouth: 'o' });
  cm([HAX + 1.5, 6.4, -13, HAX + 1.5, 5, -4, 44], [HAX + 1.5, 6.2, -12, HAX + 1.5, 5, -4, 42], L.k); }, [[0, 'knock', 1]]);
// ---- 145 «Klopf.»: más cerca de los cristales de la puerta trasera: la sonrisa
shot(221.41, 'C', 'punch', L => { flur(L, { dark: true }); HA.back.door.rotation.y = rattle(L, 0, 1, 2) * .04; const d = put(ding, HAX + 1, 2.2, -48, 0); creepF(d, L.T, 1); cam([HAX + 1, 7.2, -41], [HAX + 1, 7, -46], 40); }, [[0, 'knock', 1]]);
// ---- 146 «An der Hintertür.»: plano amplio: los niños en medio del pasillo, entre las dos puertas
shot(222.0, 'W', null, L => { flur(L, { dark: true }); const c = put(mats, HAX + .4, 0, -4, PI), i = put(ida, HAX + 2.6, 0, -4.4, PI); actuar(c, 0, [[0, { aLx: .4 }]], { T: L.T, extra: shiver(L.T, .6) }); actuar(i, 0, [[0, 'hug_self']], { T: L.T }); cara(c, L.T, { expr: 'scared' }); cara(i, L.T, { expr: 'scared' });
  const d = put(ding, HAX + 1, 2.2, -48.4, 0); creepF(d, L.T, .9); cm([HAX + 1.5, 9.6, 17, HAX + 1.5, 5, -30, 46], [HAX + 1.5, 9.2, 15, HAX + 1.5, 5, -30, 46], L.k); }, [[0, 'wind', .3]]);
// ---- 147 «„Mats, ich bin’s!“» (pantalla partida): arriba la puerta de casa con su silueta, abajo la puerta trasera con la otra; fundido
shot(223.35, 'Z', 'slow', L => { flur(L, { dark: true }); HA.side.forEach(s => s.material.opacity = .25); const d = put(ding, DOORIN.x + 4.1, 0, 22.4, PI); creepF(d, L.T, 1); lp(0, DOORIN.x + 4.1, 8, 25, 80, 0xffb060, 16); cm([DOORIN.x + 1, 6.6, 10, DOORIN.x + 4, 6.4, 20, 40], [DOORIN.x + 1.6, 6.6, 12.5, DOORIN.x + 4, 6.4, 20, 34], L.k); }, [[0, 'creepy_ting', .6]],
  L => { flur(L, { dark: true }); const d = put(ding, HAX + 1, 2.2, -48, 0); creepF(d, L.T, 1); cm([HAX + 1, 7.4, -36, HAX + 1, 6.8, -46, 46], [HAX + 1, 7.4, -39, HAX + 1, 6.8, -46, 42], L.k); });
