// ---------- b: la ciudad del café, los mayores y Tchibo (35,8 – 65,3 s) ----------
// 25 «Deshalb sind die Büros hier leer»: oficina vacía: monitores apagados, sillas giradas, polvo y una planta seca; una sola persona recoge su caja y se va
shot(35.84, 'W', null, L => { bueroS(L); const c = put(CR[17], BUX + 4 - L.lt * 3, 0, 4, -PI / 2); actuar(c, 0, [[0, { ...runP(L.T, 1), aLx: 1.3, aRx: 1.3, aLe: 1.4, aRe: 1.4, lean: .05 }]], { T: L.T }); grin(c, L.T); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .3;
  dust(V(BUX, 0, 2), L.t0, L.T, 10, 1.2); cm([BUX + 14, 9, 20, BUX, 5, -2, 48], [BUX + 9, 8, 16, BUX, 5, -2, 46], L.k); sh(V(BUX, 0, 0), 30); }, [[0, 'office_empty', .5], [.2, 'footsteps_fast', .5], [.9, 'door_close', .4]]);
// 26 «und die Cafés voll.»: el Café Bohne a reventar: todas las mesas llenas, gente de pie en la barra, el barista no da abasto
shot(37.12, 'Z', null, L => { cafe(L); const b = put(barista, CIX - 6, 0, -13.2, 0); actuar(b, L.lt, [[0, { aRx: 1.2, aRe: .8, aLx: 1.1, aLe: .9, twist: Math.sin(L.T * 9) * .2 }]], { T: L.T }); sweat(b, L.T, 2); cara(b, L.T, { expr: 'happy', mouth: 'open_smile' }); MASCH.visible = false;
  const seats = []; for (const [x, z] of CI.TB) for (const dx of [-1, 1]) seats.push([CIX + x + dx * 2.6, z, dx < 0 ? PI / 2 : -PI / 2]);
  POST.push(() => { const L2 = CR.filter(c => !c.root.visible); seats.forEach(([x, z, ry], i) => { const c = L2[i]; if (!c) return; sit2(c, x, z, ry, 2.6); crowdDrink(c, x, z, L, i, {}, i % 3 ? 'sitdrink' : 'sitprost'); }); });
  crowdAt(L, CIX, -6, 6, 2, 6, 31, { mode: 'drink', list: REN, gap: 2.2 }); orbit(V(CIX, 6, 1), lerp(26, 22, L.k), .25, .28, 50); sh(V(CIX, 0, 2), 26); }, [[0, 'cafe_busy', .6], [.4, 'steam_wand', .4], [.8, 'cup_clink', .4]]);
// 27 «Gezählt wird mit einem Kaffeezähler»: primerísimo plano de la muñeca: el reloj dorado KAFFEEZÄHLER, un dedo lo toca y la pantalla se enciende
shot(38.48, 'C', 'punch', L => { town(L, { morning: 1 }); const c = put(CR[18], 0, 0, 12, 0); actuar(c, 0, [[0, { aLx: 1.5, aLz: -.5, aLe: 1.5, aRx: 1.2, aRz: -.2, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); const m = meterOf(c); m.userData.set(L.lt < .5 ? '' : '3 Tassen', L.lt < .5 ? '' : '36 €');
  const w = wpos(m); cm([w.x + 1.2, w.y + 1.6, w.z + 4.6, w.x, w.y, w.z, 34], [w.x + .9, w.y + 1.2, w.z + 3.6, w.x, w.y, w.z, 32], L.k); sh(V(0, 0, 12), 14); DOF = 1.6; }, [[0, 'beep', .6], [.5, 'power_on', .5]]);
// 28 «am Handgelenk.»: la vecina da un sorbo y el reloj de su muñeca sube a +12 € con una chispa; cámara orbita
shot(40.02, 'W', null, L => { town(L, { morning: 1 }); const c = put(CR[19], 2, 0, 18, -.3); drink(c, L, L.t0 - .1, .35, { meter: true, expr: 'happy', pose: { aLx: 1.3, aLz: -.4, aLe: 1.4 } }); meterOf(c).userData.set('4 Tassen', '48 €'); cashPop(c, '+12 €', clamp((L.lt - .4) / .2), 'green', .9);
  crowdAt(L, 2, 12, 6, 7, 13, 32, { mode: i => ['walk', 'drink'][i % 2], gap: 1.6 }); orbit(V(2, 4.6, 18), lerp(10, 9, L.k), -.6, .12, 42); sh(V(2, 0, 18), 16); }, [[0, 'sip', .5], [.4, 'beep', .5]]);
// 29 «Und seit hier jeder Kaffee trinkt,»: mañana en la plaza: gente con vasos para llevar trotando, patinando y en bici, con energía
shot(40.84, 'S', null, L => { town(L, { morning: 1 }); crowdAt(L, 0, 4, 12, 4, 16, 34, { mode: i => i % 3 === 2 ? 'cheer' : 'run', speed: 7, dir: 0, jit: 0, gap: .4, ry: PI / 2 + .3 }); leaves(V(0, 0, 10), L.T, 30, 40, 20, 18);
  POST.push(() => CR.filter(c => c.root.visible).forEach((c, i) => { if (i % 2) { const cu = CUPS[i % 20]; attach(cu, c.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], .9); cu.userData.level(.7); } }));
  cm([-18, 6, 32, 0, 5, 4, 48], [-10, 6.5, 30, 2, 5, 4, 46], L.k); sh(V(0, 0, 6), 34); }, [[0, 'footsteps_fast', .5], [.3, 'bike_bell', .5], [.8, 'whistle_happy', .4]]);
// 30 «ist niemand mehr müde.»: el tranvía amarillo entra en la plaza y el conductor saluda sonriente con su taza; los de dentro también
shot(42.50, 'W', null, L => { town(L, { morning: 1, tram: lerp(40, 10, easeOut(L.k)) }); const z = RT.TRAM.position.z; const d = put(barista, -26, 1.6, z + 7.5, 0); d.blob.visible = false; actuar(d, 0, [[0, 'wave']], { T: L.T }); cara(d, L.T, { expr: 'joy', mouth: 'open_smile' });
  const cu = CUPS[5]; attach(cu, d.aL.hand, [.84, -.2, -.72], [PI / 2, 0, 0], .9); cu.userData.level(.6); bubble(d, 'Guten Morgen!', clamp((L.lt - .2) / .2), 2.2);
  crowdAt(L, -16, z, 6, 5, 10, 36, { mode: 'wave', gap: 1.2 }); cm([-12, 7, z + 26, -26, 6, z + 6, 44], [-14, 7, z + 22, -26, 6, z + 7, 42], L.k); sh(V(-24, 0, z + 6), 26); }, [[0, 'tram_bell', .7], [.3, 'tram_pass', .5], [.6, 'hello', .3]]);
// 31 «Am reichsten sind übrigens»: terraza de los mayores: señoras y señores con abrigos, joyas y fajos de billetes sobre la mesa, brindando con sus tazas
shot(43.76, 'F', null, L => { town(L, { morning: 1 }); const h = cafeNear(-20); const tx = Math.sign(h.x) * 40; terrace(L, h, 4, i => ['sitprost', 'sitdrink', 'sitprost', 'sithold'][i], { list: REN });
  for (let i = 0; i < 6; i++) { const b = BILL[i]; b.visible = true; b.position.set(tx - 1 + (i % 3) * .9, 4.1 + (i / 3 | 0) * .12, h.z - 3.2 + (i % 2) * .5); b.rotation.set(-PI / 2, i, 0); }
  coins(V(tx, 1, h.z), L.t0, L.T, 12); orbit(V(tx, 4.4, h.z), lerp(17, 15, L.k), (h.x < 0 ? 1 : -1) * 1.1, .16, 44); sh(V(tx, 0, h.z), 20); }, [[0, 'cup_clink', .5], [.4, 'laugh_old', .5], [.9, 'coins', .4]]);
// 32 «die über Fünfundfünfzig.»: zoom a un señor con gorra plana y gafas de piloto que levanta su taza; sello dorado «55+»
shot(45.20, 'C', 'punch', L => { town(L, { morning: 1 }); const h = cafeNear(-20); const tx = Math.sign(h.x) * 40; terrace(L, h, 4, i => i === 0 ? 'sitprost' : 'sithold', { list: [REN[0], REN[1], REN[2], REN[3]] });
  POST.push(() => { badge('gold', '55+', W / 2, H * .22, clamp(L.lt / .2), 1, 1.6); }); orbit(V(tx, 5.2, h.z - 5.6), lerp(9, 8, L.k), (h.x < 0 ? 1 : -1) * .5, .1, 40); sh(V(tx, 0, h.z), 16); }, [[0, 'stamp', .7], [.1, 'cha_ching', .5]]);
// 33 «Vierzig Jahre lang jeden Morgen eine Tasse,»: amanecer: un abuelo en el balcón de su casa de entramado con su taza humeante; el calendario vuela de año en año
shot(46.30, 'W', null, L => { town(L, { morning: 1 }); const c = put(REN[4], 0, 0, 30, PI); drink(c, L, L.t0 + .6, .6, { expr: 'warm', after: 'joy', steam: 1 }); const yr = 1985 + Math.floor(clamp(L.lt / 1.9) * 40);
  badge('big', String(yr), W / 2, H * .2, clamp(L.lt / .15), 1, 1.1); badge('tag', '40 JAHRE', W / 2, H * .3, clamp((L.lt - 1.4) / .2), 1, 1); leaves(V(0, 0, 26), L.T, 20, 20, 10, 14);
  orbit(V(0, 5, 30), lerp(12, 10, L.k), PI + .4, .1, 42); sh(V(0, 0, 30), 18); }, [[0, 'birds_morning', .5], [.2, 'page_flip', .4], [.8, 'page_flip', .4], [1.4, 'sip', .5]]);
// 34 «und um drei Kaffee und Kuchen.»: en la cocina de Oma: las amigas de Oma alrededor de la mesa con la tarta Selva Negra; el cuco da las tres
shot(48.92, 'C', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); drinkLoop(o, L, 0, { sit: true, pose: SITP }); const f = sit2(REN[1], TB.x + 3, -4.4, 0); prost(f, L, .8, { sit: true, pose: SITP }); laughF(f, L.T);
  const g2 = put(REN[3], TB.x + 8, 0, -1, -PI / 2 - .3); drinkLoop(g2, L, 2); const g3 = put(REN[5], TB.x - 8, 0, -1, PI / 2 + .3); actuar(g3, 0, [[0, { aRx: 1.2, aRe: 1.2 }]], { T: L.T }); laughF(g3, L.T);
  DS1.userData.draw('15', (cc, w, h) => { cc.fillStyle = '#fbf6ee'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#1a1a1a'; cc.font = `700 170px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('15:00', w / 2, h / 2 + 8); }); show(DS1, TB.x + 6, 10.5, -12.4, 0, .36);
  orbit(V(TB.x, 5, -2), lerp(19, 16, L.k), -.12, .2, 46); sh(V(TB.x, 0, -2), 18); }, [[0, 'cuckoo', .6], [.6, 'laugh_old', .5], [1.2, 'cup_clink', .4]]);
// 35 «Deshalb fahren hier die Rentner Sportwagen,»: tres deportivos amarillos cruzan la plaza a toda velocidad con jubilados con gafas de sol al volante; hojas que vuelan
shot(51.15, 'Z', null, L => { town(L, { morning: 1 }); const P = [REN[0], REN[3], REN[2]]; CARS.forEach((c, i) => { const r = c.root || c; r.visible = true; const z = 70 - (L.lt * 34) - i * 14; r.position.set(-10 + i * 10, 0, z); r.rotation.y = PI;
    const d = P[i]; put(d, r.position.x - .9, 1.3, z + 1.2, PI); d.blob.visible = false; actuar(d, 0, [[0, sitPose({ aRx: 1.2, aRe: .8, aLx: i === 1 ? 2.8 : 1.2, aLz: i === 1 ? .4 : 0 })]], { T: L.T, weight: false }); laughF(d, L.T + i); });
  leaves(V(0, 0, 40), L.T * 3, 40, 40, 30, 12); dust(V(0, 0, 50 - L.lt * 30), L.t0, L.T, 12, 1.4); cm([0, 4, 10, 0, 3, 50, 48], [6, 4.5, 14, 0, 3, 30, 46], L.k); sh(V(0, 0, 40), 34); },
  [[0, 'engine_rev', .7], [.3, 'car_pass', .6], [.9, 'horn_toot', .5], [1.2, 'laugh_old', .4]]);
// 36 «und die Jugendlichen Fahrrad.»: tres chavales pedaleando con cara de pena junto al bordillo; un deportivo los adelanta y los despeina
shot(53.29, 'W', null, L => { town(L, { morning: 1 }); JUG.slice(0, 3).forEach((c, i) => { const b = BIKES[i]; const z = 40 - L.lt * 6 - i * 5; show(b, 14 + i * 2.4, 0, z, PI, 1); put(c, 14 + i * 2.4, .9, z, PI); c.blob.visible = false; const p = Math.sin(L.T * 9 + i); actuar(c, 0, [[0, sitPose({ lLx: 1.2 + p * .4, lRx: 1.2 - p * .4, lLk: 1.2, lRk: 1.2, aLx: 1.2, aRx: 1.2, lean: .25 })]], { T: L.T, weight: false }); cara(c, L.T + i, { expr: 'sad', mouth: 'frown' }); });
  const r = CARS[0].root || CARS[0]; r.visible = true; r.position.set(6, 0, 20 + 40 - L.lt * 60); r.rotation.y = PI; leaves(V(10, 0, 30), L.T * 2.4, 30, 20, 20, 10);
  orbit(V(16, 4, 34 - L.lt * 6), lerp(18, 16, L.k), PI - .5, .12, 44); sh(V(16, 0, 32), 24); }, [[0, 'bike_chain', .5], [.4, 'car_pass', .6], [.9, 'sigh', .4]]);
// 37 «Aber gezählt wird nur richtig guter Kaffee.»: un señor bebe café de máquina aguado: su reloj marca 0 € con una X roja; pierde la sonrisa
shot(54.96, 'S', null, L => { town(L, { morning: 1 }); const c = put(CR[20], 0, 0, 14, 0); const cu = CUPS[8]; drink(c, L, L.t0 + .1, .4, { kind: cu, meter: true, expr: 'happy', after: 'sad', afterMouth: 'frown' }); meterOf(c).userData.set('0 Tassen', '0 €', '#ff4a4a');
  if (L.lt > .9) badge('red', 'X  0 €', W / 2, H * .22, clamp((L.lt - .9) / .2), 1, 1.1); crowdAt(L, 0, 6, 6, 7, 13, 38, { mode: 'drink', gap: 1.4 });
  dcam(c, L.k, 10, -.9, 5.2, 42); sh(V(0, 0, 14), 16); }, [[0, 'sip', .5], [.9, 'error_buzz', .6]]);
// 38 «Und das Verrückte:»: Jacky, la peluquera, se gira hacia cámara con una sonrisa traviesa y la ceja levantada
shot(57.44, 'C', 'punch', L => { town(L, { morning: 1 }); const c = put(jacky, 4, 0, 16, -.2); actuar(c, L.lt, [[0, {}], [.1, 'lean_in', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  crowdAt(L, 4, 8, 6, 6, 12, 40, { mode: 'drink', gap: 1.6 }); onFace(c, 5.6, .4, -.6, 40, L.k); sh(V(4, 0, 16), 14); }, [[0, 'whoosh', .4], [.2, 'ding_reveal', .4]]);
// 39 «Der beste ist nicht der teuerste.»: un señor de traje bebe de una taza de oro con etiqueta de 39,99 €: su reloj da +1 €; a su lado un abuelo con su taza normal recibe una lluvia
shot(58.36, 'W', null, L => { town(L, { morning: 1 }); const a = put(CR[21], -2.4, 0, 12, .35), b = put(REN[2], 2.4, 0, 12, -.35); const g = CUPS[10]; g.traverse(o => { if (o.isMesh && o.material && o.material.color && !o.userData.noOutline) {} });
  drink(a, L, L.t0 + .1, .35, { meter: true, expr: 'smug', after: 'sad', afterMouth: 'frown' }); meterOf(a).userData.set('1 Tasse', '+1 €', '#ff8a4a'); drink(b, L, L.t0 + .15, .35, { meter: true, expr: 'happy', after: 'joy' }); meterOf(b).userData.set('1 Tasse', '+24 €');
  badge('tag', '39,99 €', W * .3, H * .3, clamp(L.lt / .2), 1, .8); badge('tag', '4,99 €', W * .7, H * .3, clamp((L.lt - .2) / .2), 1, .8); if (L.lt > .8) billFall(V(4, 0, 12), L.t0 + .8, L.T, 30, 6, 4, 10);
  orbit(V(0, 5.4, 12), lerp(14, 12, L.k), 0, .1, 44); sh(V(0, 0, 12), 16); }, [[0, 'sip', .4], [.7, 'error_buzz', .4], [.8, 'money_rain', .6]]);
// 40 «Tchibo zum Beispiel.»: la tienda Tchibo de la plaza: zoom a la estantería llena de paquetes azules con su precio
shot(60.08, 'Z', null, L => { tchiboS(L); crowdAt(L, TLX, 0, 5, 4, 9, 42, { mode: i => ['walk', 'point'][i % 2], face: V(TLX, 5, -13), gap: 1.6 });
  cm([TLX - 3, 6.5, 6, TLX, 5.2, -13, 46], [TLX - 1.5, 6, -1, TLX, 5.4, -13, 40], L.k); sh(V(TLX, 0, -6), 20); DOF = 0; }, [[0, 'shop_bell', .6], [.4, 'whoosh_soft', .3]]);
// 41 «Kostet wenig,»: en la caja, un abuelo paga el paquete con una moneda y la cajera sonríe: 4,99 €
shot(61.22, 'C', null, L => { tchiboS(L); const k = put(CR[22], TLX + 10, 0, -6.4, 0); actuar(k, 0, [[0, { aRx: 1.1, aRe: .6 }]], { T: L.T }); cara(k, L.T, { expr: 'happy', mouth: 'smile' }); const c = put(REN[0], TLX + 10, 0, 0, PI); actuar(c, L.lt, [[0, { aRx: .4 }], [.1, { aRx: 1.3, aRe: .4 }, { dur: .3 }]], { T: L.T }); grin(c, L.T);
  show(PACKS.TCHIBO[0], TLX + 9, 4.5, -3.8, .3, 1); badge('gold', '4,99 €', W / 2, H * .22, clamp(L.lt / .2), 1, 1.1); CAMK = 1; orbit(V(TLX + 10, 5, -3), lerp(8.5, 7.5, L.k), PI / 2 - .3, .14, 42); sh(V(TLX + 10, 0, -3), 14); }, [[0, 'register', .6], [.2, 'coins', .5]]);
// 42 «schmeckt wie im Café,»: en casa, el abuelo prepara la taza, la huele, cierra los ojos de gusto; al fondo se ve un café elegante como en un sueño
shot(61.75 + .6, 'W', null, L => { cafe(L); const c = put(REN[0], CIX + 4, 0, 4, -.2); drink(c, L, L.t0 + .1, .4, { expr: 'warm', after: 'joy', steam: 1 }); confRain(V(CIX + 4, 2, 4), L.T, 20, 8, 6, 10);
  onFace(c, 5.6, .6, -1.2, 40, L.k); sh(V(CIX + 4, 0, 4), 14); }, [[0, 'sniff', .5], [.2, 'sip', .5], [.6, 'aah_old', .5]]);
// 43 «und jede Tasse zählt doppelt.»: el abuelo bebe su Tchibo y el reloj marca ×2: caen DOS billetes a la vez; «×2» dorado
shot(63.37, 'C', 'punch', L => { town(L, { morning: 1 }); const c = put(REN[0], 0, 0, 12, 0); drink(c, L, L.t0 - .2, .3, { meter: true, after: 'joy' }); meterOf(c).userData.set('×2', '+24 €', '#ffd23f'); show(PACKS.TCHIBO[1], 2.8, 0, 12.6, -.3, 1.4);
  billDrop(c, L.t0 + .1, L.T, 2, 1.2); badge('gold', '×2', W / 2, H * .22, clamp((L.lt - .1) / .2), 1, 1.8); cashPop(c, '+24 €', clamp((L.lt - .3) / .2), 'green', 1); crowdAt(L, 0, 6, 6, 6, 12, 44, { mode: 'clap', gap: 1.4 });
  dcam(c, L.k, 10, -.85, 5.2, 42); sh(V(0, 0, 12), 16); }, [[0, 'cash_reg', .7], [.1, 'cash_reg', .5], [.3, 'sparkle', .5]]);
