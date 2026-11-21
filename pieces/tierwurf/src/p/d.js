// ---------- d: la espera, el temblor, el Strawberry Elephant de oro, la riqueza y el giro final (115,2 – 161,4 s) ----------
// ojos gigantes tras las montañas (iris ámbar, pupila negra, párpados para parpadear)
const EYES = (() => { const g = new THREE.Group(); scene.add(g); const lids = []; for (const s of [-1, 1]) { const e = new THREE.Group(); e.position.x = s * 1.4; g.add(e); const w = sphere(1, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.2, 1.4), toneMapped: false, fog: false }), e, 0, 0, 0, 24, 16); w.scale.set(1, .62, .3);
  const ir = sphere(.42, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 1.3, .2), toneMapped: false, fog: false }), e, 0, 0, .22, 18, 12); ir.scale.z = .3; const pu = sphere(.2, new THREE.MeshBasicMaterial({ color: 0x000000, fog: false }), e, 0, 0, .32, 14, 10); pu.scale.set(.55, 1.2, .3);
  lids.push(e); } g.userData.blink = k => lids.forEach(e => e.scale.y = Math.max(.04, 1 - k)); return g; })();
const PILE = (() => { const g = new THREE.Group(); scene.add(g); const m = sphere(6, GOLD(), g, 0, -1.4, 0, 28, 14); m.scale.set(1, .55, 1); for (let i = 0; i < 46; i++) { const r = RNG(i + 3); const a = r() * 6.283, rr = r() * 5.4; const c = cyl(.55, .55, .14, GOLD(), 16, g, Math.cos(a) * rr, Math.max(.2, 1.9 * Math.sqrt(Math.max(0, 1 - (rr / 6) ** 2)) - 1.2) + .3, Math.sin(a) * rr); c.rotation.set(r() * 2, r() * 6, r() * 2); } outline(g, 1.4); return g; })();
const CROWN = (() => { const g = new THREE.Group(); scene.add(g); cyl(.78, .72, .5, GOLD(), 20, g, 0, 0, 0); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const s = new THREE.Mesh(new THREE.ConeGeometry(.2, .55, 6), GOLD()); s.position.set(Math.cos(a) * .7, .48, Math.sin(a) * .7); g.add(s); sphere(.11, mat(0xff2a4a, { roughness: .2 }), g, Math.cos(a) * .76, .05, Math.sin(a) * .76, 8, 6); } outline(g, 1.4); return g; })();
const POND = (() => { const g = new THREE.Group(); scene.add(g); cyl(5.4, 5.6, 1.4, GOLD(), 32, g, 0, .7, 0); const w = cyl(5, 5, .12, new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: .6, roughness: .12, emissive: 0x8a6a00, emissiveIntensity: .6 }), 32, g, 0, 1.3, 0); for (let i = 0; i < 30; i++) { const r = RNG(i * 3 + 1), a = r() * 6.283, rr = r() * 4.4; const c = cyl(.45, .45, .12, GOLD(), 14, g, Math.cos(a) * rr, 1.4, Math.sin(a) * rr); c.rotation.set(r() * .6, r() * 6, r() * .6); }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, .35, 10, 24), mat(0xff4a6a, { roughness: .4 })); ring.rotation.x = Math.PI / 2; ring.position.y = 1.5; g.add(ring); g.userData.ring = ring; outline(g, 1.4); return g; })();
PROPS.push(EYES, PILE, CROWN, POND);
const shadesK = (() => { const g = new THREE.Group(); scene.add(g); box(1.25, .1, .1, mat(0x111111), .02, g, 0, 0, 0); for (const s of [-1, 1]) box(.5, .32, .08, mat(0x111111, { roughness: .1, metalness: .6 }), .04, g, s * .32, -.12, 0); return g; })(); PROPS.push(shadesK);
const nightField = () => { use('FE'); night(); };
// 75 «Dann Stille.»: el campo vacío, yo solo y Kalle, el viento
shot(115.15, 'I', null, L => { field(); const me = put(ich, FX, 0, -2, PI); armsK(me, 1); actuar(me, L.lt, [[0, { headX: -.3, aLz: .1, aRz: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'neutral', look: [0, .4] }); beast(KALLE, FX + 2.2, 0, -1.6, PI + .3).pose(L.T, { headX: -.3 });
  orb(L.k, V(FX + .6, 2.8, -2), null, [22, PI - .6, .3, 46], [24, PI - .55, .34, 46]); sh(V(FX, 0, -2), 30); }, [[0, 'wind', .55], [.4, 'silence_tick', .35]]);
// 76 «Eine Stunde.»: sentado en la hierba
shot(115.95, 'C', null, L => { field(); dayNight(.9); const me = put(ich, FX, 0, -2, PI + .3); armsK(me, 1); applyPose(me, { hipY: .95, lLx: 1.5, lRx: 1.5, lLk: 1.9, lRk: 1.9, aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2, aLz: -.2, aRz: -.2, headX: -.25, lean: .15 }); cara(me, L.T, { expr: 'bored', look: [0, .5] });
  beast(KALLE, FX + 2, 0, -1, PI + .4).pose(L.T, { face: { eyes: 'half' } }); orb(L.k, V(FX + .6, 2, -1.6), null, [12, PI - .7, .12, 44], [11, PI - .75, .1, 44]); sh(V(FX, 0, -2), 30); badge('big', '1 STUNDE', W / 2, H * .15, (L.lt - .05) * 3, 1, .95); }, [[0, 'clock_tick', .5], [.4, 'clock_tick', .5]]);
// 77 «Zwei Stunden.»: tumbado boca arriba, el cielo se pone naranja
shot(116.73, 'C', null, L => { field(); setSky([.3, .4, .8], [.9, .6, .5], [1, .7, .4]); sun.color.setRGB(1, .75, .5); const me = lieOn(ich, FX, .6, 1.6, 0, 0); armsK(me, 1); cara(me, L.T, { expr: 'bored', mouth: 'flat', look: [0, -.5] });
  beast(KALLE, FX + 2.2, 0, -1, PI + .6).pose(L.T, { face: { eyes: 'closed' } }); orb(L.k, V(FX, 1, -.6), null, [12, .3, .85, 46], [11, .25, .88, 46]); sh(V(FX, 0, -1), 30); badge('big', '2 STUNDEN', W / 2, H * .15, (L.lt - .05) * 3, 1, .95); }, [[0, 'clock_tick', .5], [.4, 'clock_tick', .5], [.6, 'sigh_kid', .4]]);
// 78 «Nichts.»: el cielo vacío, de cerca mi cara triste
shot(117.55, 'Z', null, L => { field(); setSky([.3, .4, .8], [.9, .6, .5], [1, .7, .4]); const me = put(ich, FX, 0, -2, PI + .2); armsK(me, 1); actuar(me, L.lt, [[0, { headX: .15, lean: .1, aLz: .04, aRz: .04 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' });
  orb(L.k, V(FX, 4.4, -2), null, [8, PI + .3, .04, 40], [7.2, PI + .28, .03, 38]); sh(V(FX, 0, -2), 20); }, [[0, 'sad_tone', .45], [.3, 'wind', .4]]);
// 79 «Plötzlich fing der Boden an zu beben.»: todo tiembla, me levanto de golpe
shot(118.18, 'W', null, L => { field(); SHAKE = .55; const me = put(ich, FX, 0, -2, PI + .2); armsK(me, 1); actuar(me, L.lt, [[0, 'brace'], [.6, 'shock', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'scared', mouth: 'o' });
  const b = beast(KALLE, FX + 2.2, Math.abs(Math.sin(L.T * 18)) * .4, -1.4, PI + .3); b.pose(L.T, { face: { eyes: 'wide', mouth: 'open' } }); dust(V(FX - 1, 0, -7), Math.floor(L.lt / .5) * .5, L.lt, 8, .35);
  orb(L.k, V(FX + .8, 3.4, -2), null, [14, PI - .5, .12, 46], [13, PI - .55, .1, 46]); sh(V(FX, 0, -2), 30); }, [[0, 'rumble', .6], [.4, 'rubble', .5], [1.0, 'machine_shake', .45], [1.4, 'gasp', .4]]);
// 80–82 «Bumm, bumm, bumm!»: la calle, el baño y la casa del alcalde saltan con cada golpe
shot(119.98, 'C', 'punch', L => { street(); SHAKE = 1 - clamp(L.lt / .5); const c = put(K[0], 0, Math.max(0, .8 - L.lt * 3), 2, 0); actuar(c, L.lt, [[0, 'shock'], [.2, 'cower', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'scared', mouth: 'o' }); beast(TG[0], 3.4, Math.max(0, 1.2 - L.lt * 4), -1, -.3).pose(L.T, { face: { eyes: 'wide', mouth: 'open' } });
  orb(L.k, V(1.4, 3.6, 0), null, [14, .2, .12, 46], [13, .18, .1, 46]); sh(V(0, 0, 0), 30); }, [[0, 'boom', .7], [.15, 'glass_rattle', .45]]);
shot(120.53, 'C', 'punch', L => { use('BA'); inside(); SHAKE = 1 - clamp(L.lt / .5); const b = beast(FR, BX - .8, 2.5 + Math.max(0, 1.4 - L.lt * 4), -6, PI / 2, .7); b.pose(L.T, { sit: 1, neckX: -.5, face: { eyes: 'wide' } }); BA.foam.position.y = Math.max(0, .8 - L.lt * 2);
  cm([BX + 9, 11, 3, BX + 2, 5.4, -6, 46], [BX + 8.4, 10.8, 2.4, BX + 2, 5.4, -6, 46], L.k); }, [[0, 'boom', .7], [.05, 'splash', .55]]);
shot(121.05, 'C', 'punch', L => { use('KS'); day(); SHAKE = 1 - clamp(L.lt / .5); const m = put(mayor, CX + 2.4, 0, 3, -.4); actuar(m, L.lt, [[0, 'shock']], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' }); const b = beast(TR, CX - 3.6, 0, 3, .5); b.pose(L.T, { open: .6, face: { eyes: 'wide' } });
  orb(L.k, V(CX - .4, 4, 3), null, [17, .1, .14, 46], [16, .08, .12, 46]); sh(V(CX, 0, 3), 30); }, [[0, 'boom', .75], [.1, 'gasp', .4]]);
// 83 «Irgendwas flog über die Berge.»: un destello dorado sobre las montañas; yo lo señalo
shot(121.58, 'W', null, L => { field(); const p = V(FX - 40 + L.lt * 30, 60 + Math.sin(L.T * 2) * 3, -200 + L.lt * 10); const b = beast(EG, p.x, p.y, p.z, 1.2, 5); b.pose(L.T, { fly: 1 });
  const me = put(ich, FX + 1.6, 0, -9, PI - .4); armsK(me, 1); actuar(me, L.lt, [[0, 'point']], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' }); badge3('q', '!', p.clone().add(V(0, 26, 0)), (L.lt - .4) * 3, .8);
  cam([FX - 2, 4.5, -2], [FX - 14, 40, -200], 52); sh(V(FX, 0, 0), 30); }, [[0, 'whoosh_up', .45], [.3, 'sparkle', .5], [.9, 'jet', .4]]);
// 84 «Ein Strawberry Elephant aus purem Gold,» (zoom lento): el elefante de fresa de oro con alas, acercándose
shot(123.24, null, 'slow', L => { field(); const b = beast(EG, FX, 18 + Math.sin(L.T * 2) * 1.2, -40 + L.lt * 6, .15, 1.5); b.pose(L.T, { fly: 1, trunkUp: 1, face: { eyes: 'open' } });
  orb(L.k, V(FX, 18 + 7.5 * 1.5, -40 + L.lt * 6), null, [44, .25, -.05, 50], [34, .2, -.08, 46]); rareTag(b, 'OG', (L.lt - .9) * 3, 12); }, [[0, 'choir', .5], [.4, 'sparkle', .5], [1.2, 'wind', .4], [2.0, 'magic_hit', .4]]);
// 85 «größer als unsere ganze Schule.»: pasa volando por encima del colegio
shot(125.84, 'S', null, L => { street(); const b = beast(EG, -20 + L.lt * 22, 42, -236 + 6, PI / 2 - .3, 4.2); b.pose(L.T, { fly: 1 });
  cam([4, 4, -150], [0, 30, -236], 52); sh(V(0, 0, -230), 80); badge('big', 'GRÖSSER ALS DIE SCHULE', W / 2, H * .14, (L.lt - .3) * 3, 1, .6); }, [[0, 'jet', .5], [.4, 'wind', .45], [1.0, 'aah', .4]]);
// 86 «Er landete direkt vor mir»: aterriza en el campo con un golpe y polvo
shot(127.68, 'Z', null, L => { field(); const y = Math.max(0, 22 - L.lt * 28); const b = beast(EG, FX - 1, y, -24, .1, 2.2); b.pose(L.T, { fly: y > 0, face: { eyes: 'open' } }); if (y <= 0) { SHAKE = Math.max(0, 1 - (L.lt - .78) * 3); dust(V(FX - 1, 0, -24), .78, L.lt, 16, 1.6); }
  const me = put(ich, FX + 4, 0, -2, PI + .5); armsK(me, 1); actuar(me, L.lt, [[0, 'shock'], [.8, 'recoil', { dur: .2 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' });
  cam([FX + 13, 6, 8], [FX - 1, 9, -20], 52); sh(V(FX, 0, -14), 40); }, [[0, 'whoosh_down', .5], [.78, 'impact', .8], [.8, 'rubble', .5], [1.0, 'gasp', .4]]);
// 87 «und verbeugte sich.»: se inclina ante mí; yo con la boca abierta
shot(129.02, 'C', null, L => { field(); const bw = easeInOut(clamp((L.lt - .1) / .6)); const b = beast(EG, FX - 1, 0, -22, .1, 2.2); b.pose(L.T, { bow: bw, face: { eyes: bw > .5 ? 'closed' : 'open' } });
  const me = put(ich, FX + 3.6, 0, -4, PI + .3); armsK(me, 1); actuar(me, L.lt, [[0, 'shock'], [.7, 'hands_face', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' });
  cam([FX + 17, 8, 6], [FX, 7.5, -16], 50); sh(V(FX, 0, -14), 40); }, [[.1, 'growl', .4], [.4, 'choir', .45], [.8, 'gasp', .4]]);
// 88 «Über die ganze Straße regnete es Münzen.»: lluvia de monedas, todos celebran
shot(130.28, 'F', null, L => { street(); OR.FEST.visible = true; coinRain(V(0, 0, -10), L.T, 40, 14, 14, 22, .8); const P = [[K[1], -3, -4], [XT[1], 2.6, -6], [K[5], -1, -10], [oma, 4.6, -12], [K[3], -5, -12]];
  P.forEach(([c, x, z], i) => { put(c, x, Math.abs(Math.sin(L.T * 5 + i)) * .5, z, Math.sin(i) * .3); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); grin(c, L.T + i); });
  cm([0, 5, 12, 0, 6, -8, 50], [0, 4.4, 9, 0, 6.4, -8, 48], L.k); sh(V(0, 0, -8), 30); }, [[0, 'money_rain', .6], [.4, 'cheer', .5], [1.2, 'coins', .45], [1.8, 'cheer', .4]]);
// 89 «Ich war das reichste Kind der Stadt.»: en lo alto de una montaña de oro, con corona y gafas de sol
shot(132.75, 'W', null, L => { street(); show(PILE, 0, 0, -6, L.T * .1, 1); const me = put(ich, 0, 2.3, -6, .1); armsK(me, 1); actuar(me, L.lt, [[0, 'cheer']], { T: L.T }); grin(me, L.T); attach(CROWN, me.head, [0, 1.55, 0], [0, 0, .08], 1); attach(shadesK, me.head, [0, .85, .66], [0, 0, 0], 1);
  coinRain(V(0, 0, -6), L.T, 24, 10, 10, 18, 1.1); beast(EG, -9, 0, -26, .4, 1.4).pose(L.T, { trunkUp: 1 });
  orb(L.k, V(0, 5.6, -6), null, [17, .15, .12, 46], [15, .12, .1, 46]); sh(V(0, 0, -8), 30); badge('gold', 'REICHSTES KIND', W / 2, H * .14, (L.lt - .3) * 3, 1, .75); }, [[0, 'cash_reg', .5], [.3, 'coins', .5], [.9, 'cheer', .4], [1.5, 'sparkle', .45]]);
// 90 «Und Kalle bekam seinen eigenen goldenen Teich.»: Kalle flota en su estanque de oro con flotador y gafas
shot(134.65, 'R', null, L => { garden(); show(POND, TX - 4, 0, 0, 0, 1); const b = beast(KALLE, TX - 4, .3 + Math.sin(L.T * 2) * .15, 0, .3, 1); b.pose(L.T, { face: { eyes: 'happy', mouth: 'grin' } }); b.root.rotation.z = Math.sin(L.T * 1.5) * .08; attach(shadesK, b.head, [0, .78, .62], [0, 0, 0], .9);
  sparks_(V(TX - 4, 2, 0), L.T); orb(L.k, V(TX - 4, 2.6, 0), null, [13, .5, .3, 44], [11.5, .45, .28, 42]); sh(V(TX - 4, 0, 0), 30); badge('gold', 'GOLDENER TEICH', W / 2, H * .14, (L.lt - .4) * 3, 1, .75); }, [[0, 'water_bloop', .5], [.4, 'sparkle', .5], [1.2, 'splash', .35], [1.8, 'toy', .35]]);
function sparks_(c, T) { CONF.forEach((f, i) => { if (i >= 20) return; const r = RNG(i * 3 + 2), k = (T * .6 + r()) % 1; f.visible = true; f.position.set(c.x + (r() - .5) * 9, c.y + k * 6, c.z + (r() - .5) * 9); f.rotation.set(T * 3 + i, T * 2, 0); f.scale.setScalar(.6); }); }
// 91 «Aber in der Nacht hörte ich ein seltsames Pfeifen am Himmel.» (zoom lento): de noche en la calle, escucho mirando arriba
shot(137.57, null, 'slow', L => { street(); night(); const me = put(ich, 0, 0, 4, .15); armsK(me, .5); actuar(me, L.lt, [[0, 'idle'], [.6, { ...GEST.listen, headX: -.45 }, { dur: .5 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', mouth: 'flat', look: [0, -.6] });
  orb(L.k, V(0, 4.2, 4), null, [12, .3, -.12, 44], [9, .25, -.1, 40]); sh(V(0, 0, 4), 30); }, [[0, 'crickets', .4], [.6, 'whistle', .55], [1.8, 'whistle', .6]]);
// 92 «Bumm!»: destello e impacto en la plaza
shot(140.69, 'F', 'punch', L => { use('MA'); night(); const k = clamp(L.lt / .25); show(GIANT.karotte, MX + 4, lerp(60, 30, k), -24, 0, 30).rotation.set(0, 0, .25); dust(V(MX + 4, 0, -24), .2, L.lt, 20, 3); grade.uniforms.flash.value = Math.max(0, .8 - L.lt * 2);
  cam([MX - 6, 8, 40], [MX + 2, 20, -20], 54); sh(V(MX, 0, -10), 60); }, [[0, 'whistle', .4], [.2, 'explosion', .8], [.25, 'rubble', .5]]);
// 93 «Eine riesige Karotte krachte auf den Marktplatz,»: clavada en la plaza junto a la fuente; la gente sale a mirar
shot(141.29, 'W', null, L => { use('MA'); night(); show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); [[K[0], -6, 10], [XT[1], 2, 12], [K[4], 6, 9]].forEach(([c, x, z], i) => { put(c, MX + x, 0, z, PI - .1); actuar(c, L.lt, [[0, 'shock']], { T: L.T + i }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); });
  cm([MX - 4, 6, 34, MX + 2, 22, -20, 56], [MX - 6, 5, 30, MX + 2, 26, -20, 56], L.k); sh(V(MX, 0, 0), 60); }, [[0, 'rubble', .5], [.6, 'murmur', .4], [1.4, 'gasp', .4], [2.2, 'siren', .3]]);
// 94 «so hoch wie ein Wolkenkratzer.»: panorámica vertical: la zanahoria junto a los rascacielos
shot(144.09, 'S', null, L => { use('MA'); night(); show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); const k = easeInOut(L.k);
  cam([MX + 16, 4, 26], [MX + 4, lerp(10, 70, k), -40], 58); sh(V(MX, 0, -20), 80); badge('big', 'WOLKENKRATZER', W / 2, H * .14, (L.lt - .8) * 3, 1, .7); }, [[0, 'whoosh_up', .5], [.5, 'wind', .45], [1.2, 'ding_reveal', .4]]);
// 95 «Dann ein Apfel.»: cae una manzana gigante
shot(145.93, 'C', 'punch', L => { use('MA'); night(); const k = clamp(L.lt / .3); show(GIANT.apfel, MX - 30, lerp(80, 22, easeIn(k)), -10, L.T * .3, 22); if (k >= 1) { dust(V(MX - 30, 0, -10), .3, L.lt, 16, 2.6); SHAKE = Math.max(0, 1 - (L.lt - .3) * 3); }
  show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); cam([MX - 10, 6, 40], [MX - 22, 18, -10], 54); sh(V(MX - 20, 0, -10), 60); }, [[0, 'whistle', .4], [.3, 'impact', .8], [.35, 'rubble', .5]]);
// 96 «Dann ein Steak, so groß wie ein Fußballfeld.»: un filete enorme tapa todo el campo de lanzamiento
shot(147.04, 'W', null, L => { nightField(); const k = clamp(L.lt / .4); show(GIANT.steak, FX, lerp(60, 5, easeIn(k)), -50, .3, 32); if (k >= 1) { dust(V(FX, 0, -50), .4, L.lt, 16, 4); SHAKE = Math.max(0, 1 - (L.lt - .4) * 3); }
  const q = easeInOut(L.k); cam([FX + 40, lerp(50, 70, q), lerp(60, 40, q)], [FX, 0, -50], 58); sh(V(FX, 0, -50), 100); badge('big', 'FUSSBALLFELD', W / 2, H * .14, (L.lt - 1.2) * 3, 1, .7); }, [[0, 'whistle', .4], [.4, 'explosion', .8], [.5, 'rubble', .5], [1.6, 'wind', .4]]);
// 97 «Alle liefen langsam darauf zu.»: la gente camina despacio hacia la zanahoria gigante
shot(149.97, 'Z', null, L => { use('MA'); night(); show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); const P = [K[0], XT[1], K[4], lehrer, K[7], XT[3], oma];
  P.forEach((c, i) => { const r = RNG(i * 5 + 1); r(); caminar(c, L.lt, { x: MX - 8 + (i % 4) * 3, z: 30 - (i >> 2) * 4 + r() * 2, ry: PI + .2, speed: 1.6, accel: .01, T: L.T + i }); grin(c, L.T + i, { eyes: 'happy' }); });
  cm([MX - 9, 5.5, 47, MX + 1, 14, -24, 54], [MX - 9, 5.2, 44, MX + 1, 15, -24, 54], L.k); sh(V(MX - 10, 0, 10), 50); }, [[0, 'steps_heavy', .4], [.6, 'steps', .4], [1.2, 'steps_heavy', .4], [1.5, 'murmur', .3]]);
// 98 «Lächelnd.»: caras sonrientes de cerca, iluminadas en naranja
shot(151.85, 'C', null, L => { use('MA'); night(); const P = [[K[0], -1.8], [XT[1], 0], [K[4], 1.8]]; P.forEach(([c, x], i) => { put(c, MX + x, 0, 10 - Math.abs(x) * .4, 0); applyPose(c, { headZ: (i - 1) * .12 }); cara(c, L.T, { eyes: 'happy', mouth: 'grin', noBlink: 1 }); });
  FILL.color.setRGB(1, .6, .3); orb(L.k, V(MX, 4.8, 10), null, [9, 0, .02, 44], [8, 0, .01, 42]); sh(V(MX, 0, 10), 30); }, [[0, 'creepy_ting', .5], [.3, 'heartbeat', .45]]);
// 99 «Da hab ich es kapiert:» (zoom lento): mi cara al entenderlo
shot(152.49, null, 'slow', L => { street(); night(); const me = put(ich, 0, 0, 4, .1); armsK(me, 1); actuar(me, L.lt, [[0, 'shock']], { T: L.T }); cara(me, L.T, { expr: 'scared', mouth: 'o', noBlink: 1 });
  orb(L.k, V(0, 4.4, 4), null, [10, .15, .02, 42], [7, .1, .02, 36]); sh(V(0, 0, 4), 20); }, [[0, 'heartbeat', .5], [.6, 'heartbeat', .5]]);
// 100 «Wir waren nicht die Einzigen, die Essen werfen.»: plano aéreo: la plaza con la comida gigante clavada como en nuestro campo
shot(153.66, 'W', null, L => { use('MA'); night(); show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); show(GIANT.apfel, MX - 30, 22, -10, 0, 22); const q = easeInOut(L.k);
  cam([MX + 10, lerp(90, 140, q), lerp(90, 110, q)], [MX - 8, 0, -16], 56); sh(V(MX, 0, -10), 120); }, [[0, 'whoosh_up', .5], [.5, 'drone', .45], [1.4, 'tension_str', .45]]);
// 101 «Und irgendwo hinter den Bergen»: las montañas de noche bajo la luna
shot(155.85, 'S', null, L => { nightField(); const q = easeInOut(L.k); cam([FX + lerp(-10, 10, q), 6, 10], [FX, 50, -300], 52); sh(V(FX, 0, -40), 60); }, [[0, 'wind', .5], [.6, 'owl', .4], [1.2, 'drone', .4]]);
// 102 «wartet etwas sehr, sehr Großes» (zoom lento): dos ojos gigantes se abren detrás de las montañas
shot(157.47, null, 'slow', L => { nightField(); const up = easeOut(clamp(L.lt / 1.2)); show(EYES, FX + 6, lerp(40, 110, up), -300, 0, 34); EYES.userData.blink(1 - clamp((L.lt - .6) / .5));
  orb(L.k, V(FX + 4, 70, -300), null, [330, 0, -.12, 46], [270, 0, -.13, 40]); }, [[0, 'drone', .5], [.6, 'growl', .55], [1.4, 'heartbeat', .5]]);
// 103 «darauf, wer angerannt kommt.»: yo delante, aterrado; detrás, los ojos gigantes miran
shot(159.73, 'Z', null, L => { nightField(); show(EYES, FX + 6, 110, -300, 0, 34); EYES.userData.blink(L.lt > 1.2 && L.lt < 1.35 ? 1 : 0); const me = put(ich, FX, 0, 0, .1); armsK(me, 1); actuar(me, L.lt, [[0, 'brace']], { T: L.T }); cara(me, L.T, { expr: 'scared', mouth: 'o', noBlink: 1 });
  cam([FX + 1, 3.2, 12], [FX + 2, 16, -60], 56); sh(V(FX, 0, 0), 30); }, [[0, 'impact_soft', .5], [.3, 'heartbeat', .55], [1.0, 'growl', .5]]);
