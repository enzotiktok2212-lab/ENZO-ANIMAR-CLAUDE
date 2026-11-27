// ---------- b: los mensajes, los caracoles, Lotte, el estornudo, «vorausgegangen», el viaje y el pescador (50,02 – 100,68 s) ----------
// salto con pirueta (Lotte): gira 360° mientras está en el aire
function drehSprung(ch, L, tp, zc, v, ry, o = {}) { const s = springer(ch, ch === lotte ? o.x : o.x, o.z, ry, L, tp, zc, v, 0, o); const z = o.z, d = L.lt - (tp + (z - zc) / v), u = clamp((d + JD / 2) / JD);
  ch.root.rotation.y = ry + easeInOut(u) * Math.PI * 2 * (o.turns ?? 1); for (const b of [ch.aL, ch.aR]) b.sh.rotation.y = 0; return s; }
// pedestal suelto (sockel) para escenas fuera de D1
const PED2 = [0, 1, 2].map(() => P_(sockel(null, 0, 0)));
const SNOWDISC = P_(new THREE.Mesh(new THREE.CircleGeometry(90, 40), mat(0xf2f6fc, { roughness: .8 }))); SNOWDISC.rotation.x = -Math.PI / 2; SNOWDISC.receiveShadow = true;
// lazo rojo de Lotte (lo que queda de ella)
const LAZO = P_(new THREE.Group()); { const m = mat(0xd8202a, { roughness: .5 }); for (const s of [-1, 1]) { const b = box(.7, .45, .2, m, .1, LAZO, s * .4, 0, 0); b.rotation.z = s * .5; } sphere(.18, m, LAZO, 0, 0, 0, 8, 6); box(.18, .8, .1, m, .04, LAZO, -.15, -.5, 0).rotation.z = .3; }
const STEIN = P_(new THREE.Group()); { const st = mat(0xa8a090, { roughness: .9 }); const k = box(2.4, 1.2, 1.6, st, .4, STEIN, 0, .6, 0); }
const BUNDLE = P_(new THREE.Group()); { cyl(.1, .1, 6, mat(0x8a5a32), 6, BUNDLE, 0, 0, 0).rotation.z = Math.PI / 2; const b = sphere(1, mat(0xd8323a, { roughness: 1 }), BUNDLE, 2.8, -.6, 0, 10, 8); b.scale.set(1, .9, 1); for (let k = 0; k < 12; k++) sphere(.12, mat(0xffffff), b, Math.cos(k) * .9, Math.sin(k * 2) * .5, Math.sin(k) * .9, 5, 4); }
// las dos manos del pescador agarrando la manga (a la altura del codo)
function agarrar(a, b) { const e = wpos(b.aL.el); return e; }

// 48 «Auch Nachrichten reisen mit der Welle.»: un Rufer grita un mensaje al siguiente («MORGEN REGEN!»)
shot(50.019, 'S', null, L => { welt(L, -60, -60); const pA = [-64, -60], pB = [-48, -76]; show(PED2[0], pA[0], 0, pA[1]); show(PED2[1], pB[0], 0, pB[1]);
  const a = put(DX[2], pA[0], 2.3, pA[1], .8); a.root.scale.setScalar(.72); a.blob.visible = false; rufen(a, L, 1, 1); BAD_.push({ kind: 'bubble', text: 'MORGEN REGEN!', w3: hp(a).add(V(0, 3, 0)), s: spring(clamp(L.lt / .15) * 1.6), a: 1, on: true });
  const b = put(DX[4], pB[0], 2.3, pB[1], -2.4); b.root.scale.setScalar(.72); b.blob.visible = false; actuar(b, 0, [[0, GEST.listen]], { T: L.T }); hornHang(b, 2); cara(b, L.T, { expr: 'confused' });
  onBody(a, 15, 1.0, .06, 44, L.k, 13); sh(V(pA[0], 0, pA[1]), 24); }, [[0, 'horn_blow', .7], [.15, 'shout_kid', .6]]);
// 49 «Aber sie kommen nicht immer gleich an.»: el siguiente lo repite mal: «MORGEN … SEGEN?»
shot(51.625, 'W', null, L => { welt(L, -48, -76); const pB = [-48, -76]; show(PED2[1], pB[0], 0, pB[1]); const b = put(DX[4], pB[0], 2.3, pB[1], .3); b.root.scale.setScalar(.72); b.blob.visible = false; rufen(b, L, 2, clamp(L.lt / .2), { f: { eyes: 'squint', mouth: 'grimace' } });
  BAD_.push({ kind: 'bubble', text: 'MORGEN … SEGEN?', w3: hp(b).add(V(0, 3, 0)), s: spring(clamp((L.lt - .2) / .15) * 1.6), a: 1, on: L.lt > .2 });
  onFace(b, 8, -.4, 2, 40, L.k, 6.5); sh(V(pB[0], 0, pB[1]), 18); }, [[.2, 'horn_blow', .6], [.6, 'wrong_buzz', .4]]);
// 50 «Letzten Winter hat jemand gerufen:»: un pueblo lejano bajo la nieve; un Rufer tiritando grita por su trompetilla
shot(53.144, 'F', null, L => { welt(L, -300, -260, { snow: true, grass: false }); show(SNOWDISC, -300, .08, -256); show(PED2[0], -300, 0, -252); const a = put(DX[5], -300, 2.3, -252, .4); a.blob.visible = false; rufen(a, L, 1, .9, { f: { eyes: 'squint', mouth: 'grimace' } });
  a.root.position.x += Math.sin(L.T * 40) * .05; for (const [c, x, z] of [[DX[6], -308, -262], [DX[7], -292, -264]]) { put(c, x, 0, z, .3); actuar(c, 0, [[0, GEST.hug_self]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'wavy' }); c.root.position.x += Math.sin(L.T * 35 + x) * .05; }
  onBody(a, 16, .3, .08, 44, L.k, 14); sh(V(-300, 0, -255), 24); }, [[0, 'wind_cold', .7], [.4, 'shiver', .4]]);
// 51 «„Schickt mehr Decken!“»: la burbuja con las mantas
shot(54.884, 'C', 'punch', L => { welt(L, -300, -260, { snow: true, grass: false }); show(SNOWDISC, -300, .08, -256); show(PED2[0], -300, 0, -252); const a = put(DX[5], -300, 2.3, -252, .4); a.blob.visible = false; rufen(a, L, 1, 1);
  show(DECKE, -297.5, 9.6 + Math.sin(L.T * 3) * .2, -249, L.T, 1.0); onFace(a, 9, .2, 3, 42, L.k, 7.5); badge('tag', 'SCHICKT MEHR DECKEN!', W / 2, H * .15, clamp(L.lt / .12), 1, 1.15); sh(V(-300, 0, -252), 18); }, [[0, 'horn_blow', .8], [.05, 'shout_man', .6]]);
// 52 «Bei uns kamen»: llega un carro… lleno de caracoles; los vecinos se miran
shot(56.216, 'W', null, L => { welt(L, 0, 20); const x = 6 - L.lt * 3; show(KARREN, x, 0, 20, 0); const p = put(DX[12], x + 5.4, 0, 20, -PI / 2); actuar(p, 0, [[0, { ...walkP(L.T, 0), ...PUSH }]], { T: L.T }); cara(p, L.T, { expr: 'smile' });
  SNAILS.slice(0, 9).forEach((sn, i) => show(sn, x - 1.6 + (i % 3) * 1.4, 2.0 + Math.floor(i / 3) * .5, 19 - .9 + (i % 2) * 1.6, i, .7));
  [[oma, -6, 17, .5], [DX[13], -9, 22, .7], [ich, -4, 23, .3]].forEach(([c, x2, z2, r], i) => { put(c, x2, 0, z2, r); actuar(c, 0, [[0, i === 2 ? GEST.facepalm : 'shrug']], { T: L.T }); cara(c, L.T, { expr: i === 2 ? 'tired' : 'confused' }); });
  orbit(V(1, 3, 20), lerp(30, 27, L.k), .05, .16, 46); sh(V(0, 0, 20), 24); }, [[0, 'cart_wheels', .6], [.4, 'murmur', .5]]);
// 53 «Schnecken an.»: primer plano: un caracol baja del carro y se pasea por una bota
shot(56.976, 'Z', null, L => { welt(L, 0, 20); show(KARREN, 4, 0, 20, 0); SNAILS.slice(0, 9).forEach((sn, i) => show(sn, 2.4 + (i % 3) * 1.4, 2.0 + Math.floor(i / 3) * .5, 19.1 + (i % 2) * 1.6, i, .7)); const sn = show(SNAILS[10], 1.2 - L.lt * .4, 0, 23, -PI / 2 + .3, 1.1);
  const o = put(oma, -1.5, 0, 24, .5); actuar(o, 0, [[0, { aLx: .8, aRx: .8, aLz: .4, aRz: .4, aLe: 1.6, aRe: 1.6, lean: .2, headX: .45 }]], { T: L.T }); cara(o, L.T, { eyes: 'wide', mouth: 'o' });
  cm([4.5, 4, 32, 1.4, 2, 22, 42], [4, 3.8, 31, 1.4, 2, 22, 40], L.k); sh(V(1, 0, 23), 14); }, [[0, 'snail_slime', .6], [.3, 'oma_huh', .5]]);
// 54 «Lotte ist nie einfach nur gesprungen.»: Lotte salta con una pirueta completa; las trenzas vuelan
shot(57.671, 'S', null, L => { welt(L, 0, 12); const tp = .9, zc = 12; cuerda(L, tp, zc, VV); drehSprung(lotte, L, tp, zc, VV, 0, { x: 0, z: 12, J: 4, pose: { aLz: .9, aRz: .9 }, f: { expr: 'joy' } });
  vecinos(L, [[-7, 6, .2], [7, 5, -.2]], tp, zc, VV, 8); orbit(V(0, 4, 12), lerp(15, 13, L.k), 0, .08, 44); badge3('tag', 'LOTTE', hp(lotte).add(V(0, 2.4, 0)), clamp((L.lt - .1) / .2)); sh(V(0, 0, 12), 22); }, [[.1, 'sparkle', .4], [.8, 'jump_spin', .6]]);
// 55 «Sie hat immer eine Drehung eingebaut.»: desde abajo, a cámara lenta: Lotte gira en el aire justo sobre la cuerda
shot(59.594, 'W', null, L => { welt(L, 0, 12); const tp = .55, zc = 12, v = 60; cuerda(L, tp, zc, v); drehSprung(lotte, L, tp, zc, v, .3, { x: 0, z: 12, J: 4.4, pose: { aLx: 2.6, aRx: 2.6, aLz: .3, aRz: .3 }, f: { eyes: 'closed', mouth: 'open_smile', noBlink: true } });
  cm([2.4, 1.0, 19, 0, 5.4, 12, 46], [2, 1.0, 18.4, 0, 5.8, 12, 44], L.k); sh(V(0, 0, 12), 18); }, [[.4, 'rope_swish', .5], [.5, 'whoosh_soft', .5]]);
// 56 «eingebaut.»: los vecinos aplauden su pirueta
shot(60.654, 'F', null, L => { welt(L, 0, 12); const l = put(lotte, 0, 0, 12, 0); actuar(l, 0, [[0, { aLz: 1.2, aRz: 1.2, aLx: .4, aRx: .4 }]], { T: L.T }); grin(l, L.T);
  [[DX[14], -5, 7, .4], [DX[15], 5, 7, -.4], [oma, -2.6, 5, .2], [DX[16], 3, 4.5, -.2]].forEach(([c, x, z, r], i) => crowdGuy(c, x, z, L, i, { mode: 'clap', ry: r }));
  orbit(V(0, 3.6, 10), lerp(15, 13, L.k), .25, .12, 44); sh(V(0, 0, 15), 18); }, [[0, 'clap', .7], [.2, 'cheer_small', .5]]);
// Lotte y yo sentados en el murete de una parcela (D1, x = 17, z = 8,5: muro sur en z = 15)
const MUR = [17, 15];
function banco(L, o = {}) { welt(L, MUR[0], MUR[1] + 6, o); const l = sit(lotte, MUR[0] - 1.4, 1.35, MUR[1] + .2, 0, L, { aLx: .4, aRx: .4, ...(o.lp || {}) }); const i = sit(ich, MUR[0] + 1.6, 1.35, MUR[1] + .2, 0, L, { aLx: .3, aRx: .3, ...(o.ip || {}) }); hornHang(i, 0); return [l, i]; }
// 57 «„Wenn wir das schon für immer machen“,»: Lotte, sentada a mi lado en el murete, me lo explica con las manos
shot(61.361, 'C', null, L => { const [l, i] = banco(L, { lp: { aRx: 1 + Math.sin(L.T * 4) * .3, aRz: -.3, aRe: 1.2, headY: -.3 }, ip: { headY: .4 } }); talk(l, L.T, 61.3, 62.7, 'happy'); cara(i, L.T, { expr: 'smile', eyes: 'side_l' });
  l.root.rotation.y = -.3; i.root.rotation.y = .3; orbit(V(MUR[0], 3.6, MUR[1]), lerp(13, 11.5, L.k), -.1, .1, 42); sh(V(MUR[0], 0, MUR[1]), 16); }, [[0, 'birds', .4]]);
// 58 «hat sie gesagt, „dann soll es»: se levanta de un salto con otra pirueta y los brazos abiertos
shot(63.001, 'S', null, L => { welt(L, 0, 24); const tp = .55, zc = 24; cuerda(L, tp, zc, VV); drehSprung(lotte, L, tp, zc, VV, 0, { x: 0, z: 24, J: 4, pose: { aLz: 1.4, aRz: 1.4, aLx: .3, aRx: .3 }, f: { expr: 'joy' } }); talk(lotte, L.T, 63.6, 65.3, 'happy');
  orbit(V(0, 4.2, 24), lerp(13, 11.5, L.k), .35, .1, 44); sh(V(0, 0, 24), 18); }, [[.45, 'jump_spin', .6]]);
// 59 «wenigstens schön aussehen.“»: aterriza como una bailarina, brazos arriba; destellos
shot(64.502, 'Z', null, L => { welt(L, 0, 24); const l = put(lotte, 0, 0, 24, .2); actuar(l, 0, [[0, { aLx: 2.7, aRx: 2.7, aLz: .4, aRz: .4, lRx: -.4, lRk: .5, headX: -.15 }]], { T: L.T }); talk(l, L.T, 64.5, 65.3, 'happy');
  SPARK.forEach((s, i) => { const a = i / SPARK.length * 6.28 + L.T, r = 3 + Math.sin(L.T * 2 + i) * .6; s.visible = true; s.position.set(Math.cos(a) * r, 3 + Math.sin(i * 2.1 + L.T * 3) * 2.4, 24 + Math.sin(a) * r); });
  onBody(l, 10, .1, .1, 42, L.k, 8.6); sh(V(0, 0, 24), 16); }, [[0, 'sparkle', .6], [.3, 'chime', .4]]);
// 60 «Sie war meine beste Freundin.»: al atardecer, los dos en el murete, riéndonos
shot(65.523, 'W', null, L => { const [l, i] = banco(L, { dusk: true, lp: { aLx: 1.4, aLz: -.5, aLe: 1.6 }, ip: { aRx: .9, aRe: 1.4 } }); laughF(l, L.T); laughF(i, L.T + .3); l.root.rotation.y = -.35; i.root.rotation.y = .35;
  orbit(V(MUR[0], 3.4, MUR[1]), lerp(15, 13, L.k), .3, .06, 42); sh(V(MUR[0], 0, MUR[1]), 16); }, [[0, 'laugh_kids', .6]]);
// 61 «Und ich war ihr Rufer.»: yo en el pedestal gritando su «¡salta!»; ella salta abajo, mirándome
shot(66.919, 'C', null, L => { welt(L, 8, 14); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], PI - .1); c.blob.visible = false; rufen(c, L, 0, clamp(L.lt / .2));
  const tp = .7, zc = 2; cuerda(L, tp, zc, VV); drehSprung(lotte, L, tp, zc, VV, .1, { x: p[0] - 1, z: 2, J: 3.8, f: { expr: 'joy' } });
  cm([p[0] + 3, 10, p[1] + 9, p[0] - 1, 4, p[1] - 6, 44], [p[0] + 2.6, 10.4, p[1] + 8, p[0] - 1, 4, p[1] - 6, 44], L.k); sh(V(p[0], 0, p[1] - 3), 20); }, [[0, 'horn_blow', .6], [.6, 'jump_spin', .5]]);
// 62 «Letzten Herbst musste ich»: otoño, atardecer naranja; en el pedestal, la nariz me pica
shot(68.005, 'W', null, L => { welt(L, 8, 8, { dusk: true }); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; hornHang(c, 0); const k = clamp(L.lt / .9);
  actuar(c, 0, [[0, { aRx: .4 }], [.3, { lean: -.18 * k, headX: -.3 * k, aRx: 1.9, aRz: -.6, aRe: 2.2 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { eyes: k > .4 ? 'squint' : 'half', mouth: k > .4 ? 'o' : 'wavy', noBlink: true });
  CONF.forEach((f, i) => { if (i > 18) return; const r = RNG(i + 3); f.visible = true; f.material.color.setHex([0xd8601a, 0xe8a020, 0xb8401a][i % 3]); f.position.set(p[0] + (r() - .5) * 14, 2 + ((r() * 12 - L.T * 2) % 12 + 12) % 12, p[1] + (r() - .5) * 10 + 4); f.rotation.set(L.T * 2 + i, L.T + i, 0); });
  onFace(c, 8, -.6, .8, 40, L.k, 6); sh(V(p[0], 0, p[1]), 16); }, [[0, 'wind', .4], [.3, 'sniff', .6]]);
// 63 «niesen.»: ¡ATCHÍS! la cabeza da un golpe adelante; gotitas por todas partes
shot(69.025, 'C', 'punch', L => { welt(L, 8, 8, { dusk: true }); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; hornHang(c, 0);
  actuar(c, 0, [[0, { lean: -.2, headX: -.35, aRx: 1.9, aRz: -.6, aRe: 2.2 }], [.04, { lean: .45, headX: .5, aRx: .6, aLx: .4, crouch: .1 }, { dur: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'scream', noBlink: true });
  const h = hp(c); spray(SPRAY, h.clone().add(V(0, -.2, .8)), V(0, -.2, 1), L.t0 + .05, L.T, 30, 1.2, 5); onFace(c, 8, -.4, 2.6, 40, L.k, 7); SHAKE = clamp(1 - L.lt / .3); sh(V(p[0], 0, p[1]), 16); }, [[0, 'sneeze', 1]]);
// 64 «Ein einziges Mal.»: me quedo con los ojos muy abiertos; «1×»
shot(69.537, 'Z', null, L => { welt(L, 8, 8, { dusk: true }); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; hornHang(c, 0); actuar(c, 0, [[0, { aRx: .9, aRe: 1.8, aRz: -.3, headX: .05 }]], { T: L.T }); cara(c, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true });
  onFace(c, 6, -.4, 0, 38, L.k, 5); bigNum('1×', clamp((L.lt - .1) / .15), 'red', .17, 1.1); sh(V(p[0], 0, p[1]), 14); }, [[.1, 'pling_low', .5]]);
// 65 «Mein „Spring!“»: grito «SPRING!»… tarde
shot(70.584, 'C', 'punch', L => { welt(L, 8, 8, { dusk: true }); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], PI - .15); c.blob.visible = false; rufen(c, L, 0, 1, { f: { eyes: 'terror' } });
  onFace(c, 7, -.4, -4, 40, L.k, 6); badge('red', 'SPRING!', W / 2, H * .17, clamp(L.lt / .1), 1, 1.1); sh(V(p[0], 0, p[1]), 14); }, [[0, 'horn_blow', .9], [.02, 'shout_kid', .8]]);
// 66 «kam zu spät.»: Lotte se gira hacia mí; detrás de ella ya llega la cuerda
shot(71.084, 'S', null, L => { welt(L, 7, 0, { dusk: true }); const l = put(lotte, 7, 0, 2, .4); actuar(l, 0, [[0, { headY: .5, aLx: .3, aRx: .3 }], [.4, 'recoil', { dur: .3 }]], { T: L.T }); cara(l, L.T, { eyes: L.lt > .4 ? 'wide' : 'normal', mouth: L.lt > .4 ? 'o' : 'smile', noBlink: true });
  cuerda(L, 1.35, 2, VV); onBody(l, 10, -.2, .08, 42, L.k, 8.5); sh(V(7, 0, 2), 16); }, [[.2, 'rope_far', .7], [.45, 'gasp_girl', .5]]);
// 67 «Das Seil hat sie erwischt» (zoom lento): la cuerda le golpea las piernas y la levanta
shot(72.265, 'F', 'slow', L => { welt(L, 7, 4, { dusk: true }); const tp = .55, zc = 2, v = 28, z = zc + v * (L.lt - tp); cuerda(L, tp, zc, v); const caught = L.lt > tp;
  const l = put(lotte, 7, caught ? ropeY(z) + .4 + (L.lt - tp) * 3 : 0, caught ? z - .6 : 2, .4); l.blob.visible = !caught; if (caught) l.root.rotation.set(-.6 - (L.lt - tp) * 2, .4, (L.lt - tp) * 4);
  actuar(l, 0, [[0, 'recoil'], [tp, { aLx: 2.6, aRx: 2.4, aLz: .8, aRz: .7, lLx: -.5, lRx: .6, lLk: .9 }, { dur: .15 }]], { T: L.T }); cara(l, L.T, { eyes: 'terror', mouth: 'scream', noBlink: true });
  orbit(V(7, 3.4, 3), lerp(14, 11, L.k), .7, .06, 42); sh(V(7, 0, 3), 16); }, [[.5, 'rope_hit', .8], [.55, 'scream_girl', .6]]);
// 68 «und mitgenommen,»: la cuerda se la lleva por la pradera, dando vueltas, las trenzas al viento
shot(73.385, 'W', null, L => { welt(L, 7, 30, { dusk: true }); const v = 40, z = 6 + v * L.lt; cuerda(L, 0, 6, v); const l = put(lotte, 7, ropeY(z) + 1.2, z, 0); l.blob.visible = false; l.root.rotation.set(-1 + L.lt * 4, 0, L.lt * 8);
  actuar(l, 0, [[0, { aLx: 2.6, aRx: 2.2, aLz: .9, aRz: .7, lLx: -.5, lRx: .7 }]], { T: L.T }); cara(l, L.T, { eyes: 'terror', mouth: 'o', noBlink: true }); cam([10, 13, z - 15], [7, 2.2, z], 44); sh(V(7, 0, z), 24); }, [[0, 'rope_drag', .7], [.2, 'scream_far', .5]]);
// 69 «bis hinter den Horizont.»: desde el pueblo: un puntito en la cuerda que se aleja hasta el horizonte
shot(74.098, 'Z', null, L => { welt(L, 7, 10, { dusk: true }); const z = 80 + 900 * easeIn(L.k); const phi = -Math.asin(clamp(z / AZ)); setRope(phi); const l = put(lotte, 7, ropeY(z) + 1.2, z, 0); l.blob.visible = false; l.root.rotation.set(-1, 0, L.T * 8); l.root.scale.setScalar(2.2);
  const i = put(ich, 7, 0, 6, PI); actuar(i, 0, [[0, { aRx: 1.7, aRe: .1, aLx: .3 }]], { T: L.T }); cara(i, L.T, { expr: 'shock' }); cam([7.6, 6.4, -6], [7, 4.4, 200], 40); sh(V(7, 0, 8), 18); }, [[0, 'wind', .6], [.6, 'rope_far', .5]]);
// 70 «Und sie hat sich dabei noch gedreht.»: teleobjetivo: lejos, Lotte todavía hace su pirueta encima de la cuerda
shot(75.293, 'S', null, L => { welt(L, 7, 600, { dusk: true, grass: false }); const z = 640 + L.lt * 60; setRope(-Math.asin(clamp(z / AZ))); const l = put(lotte, 7, ropeY(z) + 2.2, z, L.T * 5); l.blob.visible = false;
  actuar(l, 0, [[0, { aLz: 1.3, aRz: 1.3, aLx: .3, aRx: .3, lRx: .4, lRk: .6 }]], { T: L.T }); cara(l, L.T, { eyes: 'closed', mouth: 'smile', noBlink: true }); cam([12, 7, z - 34], [7, 5, z], 22); sh(V(7, 0, z), 24); }, [[0, 'music_box', .5]]);
// 71 «Wir sagen nicht „verpasst“.» (fundido): el pueblo en círculo, cabizbajo
shot(76.725, 'W', null, L => { welt(L, 0, 0, { dusk: true }); const ring = [oma, mutter, DX[17], DX[18], DX[19], DX[20], DX[21], DX[22]]; ring.forEach((c, i) => { const a = i / ring.length * 6.28 + .3; put(c, Math.cos(a) * 6, 0, -14 + Math.sin(a) * 6, Math.atan2(-Math.cos(a), -Math.sin(a))); actuar(c, 0, [[0, { headX: .5, aLx: .3, aRx: .3, aLz: -.3, aRz: -.3, aLe: 1, aRe: 1 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'sad', eyes: 'down' }); });
  show(STEIN, 0, 0, -14); orbit(V(0, 2, -14), lerp(24, 21, L.k), .3, .5, 44); sh(V(0, 0, -14), 22); }, [[0, 'wind_soft', .5]]);
// 72 «Wir sagen: „vorausgegangen“.»: la abuela deja el lazo rojo de Lotte sobre la piedra; «VORAUSGEGANGEN»
shot(78.042, 'W', null, L => { welt(L, 0, -12, { dusk: true }); show(STEIN, 0, 0, -14); const o = put(oma, 0, 0, -11.4, PI); actuar(o, 0, [[0, { lean: .45, headX: .4, aRx: 1.2, aLx: .3, crouch: .2 }]], { T: L.T }); cara(o, L.T, { expr: 'sad' });
  show(LAZO, 0, 1.45, -13.6, 0, .9); onBody(o, 12, .55, .25, 42, L.k, 10.5); badge('tag', 'VORAUSGEGANGEN', W / 2, H * .16, clamp((L.lt - .35) / .2), 1, 1); sh(V(0, 0, -13), 16); }, [[.2, 'cloth', .4], [.4, 'chime_sad', .5]]);
// 73 «Und keiner schaut, wohin sie gehen.»: todos se tapan los ojos o dan la espalda al horizonte
shot(79.486, 'S', null, L => { welt(L, 0, 10, { dusk: true }); [[DX[17], -6, 6], [DX[18], -2, 9], [DX[19], 3, 7], [DX[20], 7, 10], [mutter, -4, 13], [DX[21], 5, 14]].forEach(([c, x, z], i) => { put(c, x, 0, z, (i % 2 ? .3 : -.2)); actuar(c, 0, [[0, i % 2 ? GEST.hands_face : { aLx: 2.0, aLz: -.2, aLe: 2.3, headX: .2, headY: .6 }]], { T: L.T + i }); cara(c, L.T + i, { eyes: 'closed', mouth: 'frown', noBlink: true }); });
  orbit(V(0, 4, 10), lerp(20, 18, L.k), .1, .12, 44); sh(V(0, 0, 10), 20); }, [[0, 'murmur_low', .5]]);
// 74 «Das bringt Unglück.»: la abuela me advierte con el dedo
shot(80.989, 'C', null, L => { welt(L, 0, 12, { dusk: true }); const o = put(oma, 0, 0, 12, 0); actuar(o, 0, [[0, { aRx: 1.9, aRz: -.3, aRe: 1.3, lean: .1, headX: .1, sx: Math.sin(L.T * 12) * .0 }], [0, { aRz: -.3 + Math.sin(L.T * 14) * .25 }, { dur: .2 }]], { T: L.T }); talk(o, L.T, 80.9, 81.8, 'angry');
  onFace(o, 6.5, -.4, .8, 40, L.k, 5.6); sh(V(0, 0, 12), 14); }, [[0, 'tsk', .6]]);
// 75 «Ich habe hingeschaut.»: el único que mira al horizonte: yo, entre los que dan la espalda
shot(81.912, 'Z', null, L => { welt(L, 0, 10, { dusk: true }); [[DX[17], -5, 8], [DX[18], 5, 8], [DX[19], -3, 4], [DX[20], 4, 3]].forEach(([c, x, z], i) => { put(c, x, 0, z, 0); actuar(c, 0, [[0, { headX: .45, aLx: .3, aRx: .3 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'sad', eyes: 'closed' }); });
  const c = put(ich, 0, 0, 6, PI); hornHang(c, 0); actuar(c, 0, [[0, { aLx: .1, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); cm([0, 6.2, -10, 0, 5.4, 6, 40], [0, 6.4, -7.6, 0, 5.6, 6, 38], L.k); sh(V(0, 0, 6), 18); }, [[0, 'heartbeat', .5]]);
// 76 «Das Seil zieht immer in dieselbe Richtung.»: la cuerda en lo alto del cielo; prendas y siluetas se deslizan por ella hacia la torre
shot(82.812, 'W', null, L => { welt(L, 0, 0, { dusk: true, grass: false }); setRope(PI); DX.slice(0, 7).forEach((c, i) => { const x = 140 + ((L.lt * 130 + i * 160) % 1100); const p = ropePt(x, PI); put(c, p.x, p.y - 4.5, p.z, -PI / 2); c.blob.visible = false; c.root.scale.setScalar(2.4); actuar(c, 0, [[0, { aLx: 3, aRx: 3, aLe: .2, aRe: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' }); });
  cam([-60, 2, 30], [500, 300, -10], 50); }, [[0, 'wind_high', .6], [.4, 'rope_creak', .5]]);
// 77 «Zu dem, der es schwingt.» (zoom lento): la torre y su manivela, lejos
shot(84.831, 'W', 'slow', L => { welt(L, 900, 0, { dusk: true, grass: false }); wolken(); setRope(.6 + L.lt * .8); cm([800, 20, 120, TX, 230, 0, 30], [820, 22, 110, TX, 220, 0, 22], L.k); sh(V(TX, 0, 0), 80); }, [[0, 'crank', .6]]);
// 78 «Also bin ich losgelaufen.»: me voy del pueblo con mi hatillo y la trompetilla; miro atrás una vez
shot(86.313, 'S', null, L => { welt(L, 46, 0, { dusk: true }); const c = walkTo(ich, L, 44 + L.lt * 3, 0, PI / 2); attach(BUNDLE, c.aR.hand, [0, -.3, 0], [0, 0, -1.1], .8); hornHang(c, 0); actuar(c, 0, [[0, { ...walkP(L.T, 0), aRx: 2.4, aRz: -.4, aRe: 1.6, headY: L.lt > .5 ? -.9 : 0 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: L.lt > .5 ? 'side_r' : 'normal' });
  onBody(c, 13, -.9, .06, 42, L.k, 11.5); sh(V(46, 0, 0), 20); }, [[0, 'steps_grass', .6]]);
// andar hacia ry
function walkTo(ch, L, x, z, ry, i = 0) { put(ch, x, Math.abs(Math.sin(L.T * 9 + i)) * .1, z, ry); actuar(ch, 0, [[0, walkP(L.T, i)]], { T: L.T }); return ch; }
// 79 «Immer neun Sekunden am Stück.»: camino por la pradera; la cuerda pasa, salto y sigo andando
shot(87.626, 'W', null, L => { welt(L, 200, 6); const x = 196 + L.lt * 3, tp = .8, zc = 6; cuerda(L, tp, zc, VV); const c = put(ich, x, 0, 6, PI / 2); const s = salto(c, L, tp, zc, VV); attach(BUNDLE, c.aR.hand, [0, -.3, 0], [0, 0, -1.1], .8); hornHang(c, 0);
  actuar(c, 0, [[0, { ...walkP(L.T, 0), ...(s.k > 0 ? s.pose : {}), aRx: 2.4, aRz: -.4, aRe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); orbit(V(x, 3.6, 6), lerp(14, 12, L.k), PI / 2 - 1.1, .08, 44); badge('gold', '9', W * .8, H * .14, clamp(L.lt / .15), 1, .9); sh(V(x, 0, 6), 20); }, [[0, 'steps_grass', .5], [.75, 'jump', .5]]);
// 80 «Niemand läuft auf dieses Ding zu.»: un grupo camina en dirección contraria; yo, solo, voy hacia la torre
shot(89.239, 'Z', null, L => { welt(L, 300, 40); const c = walkTo(ich, L, 296 + L.lt * 3, 40, PI / 2); hornHang(c, 0); cara(c, L.T, { expr: 'determined' });
  [[DX[22], 0], [DX[23], 1], [DX[24], 2], [DX[25], 3]].forEach(([d, i]) => { walkTo(d, L, 312 - L.lt * 3 - i * 1.5, 44 + (i % 2) * 2.4 - i * .5, -PI / 2, i); cara(d, L.T + i, { expr: 'sus', eyes: 'side_r' }); });
  orbit(V(304, 3.6, 42), lerp(26, 23, L.k), .15, .1, 44); sh(V(304, 0, 42), 26); }, [[0, 'steps_grass', .6]]);
// 81 «Die Leute haben aufgehört, mich zu grüßen.»: saludo a los de un pueblo; me dan la espalda
shot(90.874, 'S', null, L => { welt(L, 420, 226); const c = put(ich, 420, 0, 232, PI); hornHang(c, 0); actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'smile' });
  [[DX[26], 415, 222], [DX[27], 421, 220], [DX[28], 426, 223]].forEach(([d, x, z], i) => { put(d, x, 0, z, lerp(0, PI, clamp((L.lt - .2 - i * .12) / .3))); actuar(d, 0, [[0, { aLz: -.1, aRz: -.1, headX: .1 }]], { T: L.T + i }); cara(d, L.T + i, { expr: 'sus' }); });
  cm([436, 6, 232, 420, 4.4, 226, 44], [435, 6, 231, 420, 4.4, 226, 42], L.k); sh(V(421, 0, 226), 18); }, [[.3, 'cloth', .4], [.5, 'sigh', .4]]);
// 82 «Im letzten Dorf»: el pueblo de pescadores junto al lago, al atardecer
shot(92.636, 'W', null, L => { welt(L, FX, 10, { dusk: true }); [[DX[1], FX - 10, 12], [DX[2], FX + 6, 18], [DX[3], FX + 16, 10]].forEach(([d, x, z], i) => crowdGuy(d, x, z, L, i, { mode: i === 1 ? 'talk' : 'idle', ry: .3 }));
  cm([FX - 40, 26, -40, FX, 2, 30, 46], [FX - 36, 24, -36, FX, 2, 30, 46], L.k); sh(V(FX, 0, 20), 60); }, [[0, 'gulls', .6], [.2, 'water_lap', .5]]);
// pescador y yo (yo en FX, 20; él a mi izquierda)
const FZ = 8, FXX = FX + 10;
function fischer2(L, o = {}) { welt(L, FXX, FZ, { dusk: true }); const f = put(fischer, FXX - 2.2, 0, FZ, PI - .9 + (o.fr ?? 0)), i = put(ich, FXX + 2, 0, FZ, PI + .9 + (o.ir ?? 0)); hornHang(i, 0); return [f, i]; }
// 83 «hat mich ein alter Fischer am Ärmel gepackt,»: me agarra de la manga
shot(93.656, 'C', null, L => { const [f, i] = fischer2(L); actuar(f, 0, [[0, {}], [.25, { aRx: 1.5, aRz: -.25, aRe: .2, lean: .2 }, { dur: .2 }]], { T: L.T }); cara(f, L.T, { expr: 'worried' }); actuar(i, 0, [[0, { aLx: .7, aLz: .2 }], [.35, { aLx: .9, aLz: .4, headY: .5, lean: -.08 }, { dur: .2 }]], { T: L.T }); cara(i, L.T, { eyes: L.lt > .35 ? 'wide' : 'normal', mouth: 'o' });
  orbit(V(FXX, 4, FZ), lerp(14, 12, L.k), PI + .05, .08, 42); sh(V(FXX, 0, FZ), 16); }, [[.25, 'grab_cloth', .6], [.4, 'gasp', .4]]);
// 84 «zwischen zwei Sprüngen.»: saltamos los dos y él no me suelta
shot(95.136, 'F', null, L => { welt(L, FXX, FZ, { dusk: true }); const tp = .5, zc = FZ; cuerda(L, tp, zc, VV); springer(fischer, FXX - 2.2, FZ, PI - .9, L, tp, zc, VV, 0, { pose: { aRx: 1.5, aRz: -.25, aRe: .2 }, f: { expr: 'worried' } }); springer(ich, FXX + 2, FZ, PI + .9, L, tp, zc, VV, 1, { pose: { aLx: .9, aLz: .4 }, f: { expr: 'worried' } }); hornHang(ich, 0);
  orbit(V(FXX, 4.4, FZ), lerp(16, 14, L.k), PI + .4, .05, 44); sh(V(FXX, 0, FZ), 18); }, [[.4, 'rope_swish', .6], [.5, 'jump', .5], [.55, 'jump', .4]]);
// 85 «„Da lang geht keiner, Rufer.“»: primer plano del pescador, señalando hacia la torre
shot(96.179, 'C', null, L => { const [f, i] = fischer2(L); actuar(f, 0, [[0, { aRx: 1.5, aRz: -.25, aRe: .2, aLx: 1.55, aLz: .5, aLe: .1, headY: .2 }]], { T: L.T }); talk(f, L.T, 96.1, 97.6, 'worried'); cara(i, L.T, { expr: 'worried' });
  onFace(f, 6.5, -.4, 1.4, 40, L.k, 5.6); sh(V(FXX, 0, FZ), 14); }, [[0, 'wind_soft', .4]]);
// 86 «„Und wer hat Ihnen dann erzählt, was da ist?“»: yo, serio, le pregunto
shot(97.763, 'S', null, L => { const [f, i] = fischer2(L); actuar(f, 0, [[0, { aRx: 1.5, aRz: -.25, aRe: .2 }]], { T: L.T }); cara(f, L.T, { expr: 'worried' }); actuar(i, 0, [[0, { aLx: .9, aLz: .4, headY: .4 }]], { T: L.T }); talk(i, L.T, 97.7, 99.5, 'determined');
  onFace(i, 6.5, -.4, -1.4, 40, L.k, 5.6); sh(V(FXX, 0, FZ), 14); }, [[0, 'heartbeat', .4]]);
// 87 «Er hat mich losgelassen.»: me suelta y baja la mirada; yo sigo mi camino
shot(99.586, 'W', null, L => { const [f, i] = fischer2(L); actuar(f, 0, [[0, { aRx: 1.5, aRz: -.25, aRe: .2 }], [.2, { aRx: .2, headX: .5, aRz: .1 }, { dur: .4 }]], { T: L.T }); cara(f, L.T, { expr: 'sad', eyes: 'down' }); actuar(i, 0, [[0, { aLx: .4, headY: .3 }]], { T: L.T }); cara(i, L.T, { expr: 'sad' });
  orbit(V(FXX, 4, FZ), lerp(13, 15, L.k), PI - .3, .1, 42); sh(V(FXX, 0, FZ), 16); }, [[.2, 'cloth', .4], [.5, 'water_lap', .4]]);
