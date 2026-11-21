// ---------- a: gancho, paseo del domingo, Currywurst, parque con Benni (0 – 36,06 s) ----------
// paseo: ella anda (mano derecha adelantada con la correa), él gatea delante; vuelve el ángulo de marcha
function strollW(c, x0, z0, ry, v, L, i = 0, extra = {}) { const d = v * L.lt; put(c, x0 + Math.sin(ry) * d, Math.abs(Math.sin(L.T * 9 + i)) * .12 * (c.spec.scale || 1), z0 + Math.cos(ry) * d, ry); const p = walkP(L.T, i); actuar(c, 0, [[0, { ...p, aRx: .75, aRe: .35, aRz: .05, ...extra }]], { T: L.T }); return c; }
function crawl(c, x0, z0, ry, v, L, i = 0, o = {}) { const d = v * L.lt; put(c, x0 + Math.sin(ry) * d, 0, z0 + Math.cos(ry) * d, ry); actuar(c, 0, [[0, DOGP(L.T * 1.3 + i, o.wv ?? (v > 0 ? 1 : .25), o)]], { T: L.T }); return c; }
// pareja paseando: ella en (x, z), él 5.2 por delante en la dirección ry
function pair(L, w, m, x, z, ry, v, i, o = {}) { strollW(w, x, z, ry, v, L, i); crawl(m, x + Math.sin(ry) * 5.2, z + Math.cos(ry) * 5.2, ry, v, L, i); lead(w, m, { sag: .8 });
  cara(w, L.T + i, { expr: o.wexpr || 'happy' }); cara(m, L.T + i * 2, { expr: 'happy', mouth: i % 2 ? 'open_smile' : 'grin' }); if (o.cup !== false) inHand(CUPS[i % CUPS.length], w, 'L', [0, -.75, .25]); }
const SV0 = V(0, 0, 14);   // punto del paseo de Svenja y Lukas en la plaza

// 1 «In dieser Stadt» (golpe de zoom inicial): de lado: filas de parejas cruzan la plaza (ellas con café, ellos a cuatro patas con correa)
shot(0, null, null, L => { town(L); WURST.visible = false; const rows = [[4, 1], [-6, -1], [-16, 1]];
  for (let i = 0; i < 6; i++) { const r = rows[i % 3], k = Math.floor(i / 3); const ry = r[1] > 0 ? PI / 2 : -PI / 2; const x0 = (r[1] > 0 ? -12 : 12) + k * 14 * r[1] * -1 + (i % 3) * 3 * r[1]; pair(L, FR[i], MA[i], x0, r[0], ry, 3.2, i); }
  orb(L.k, V(0, 3.4, -6), V(1, 3.4, -6), [36, 0, .1, 46], [32, 0, .08, 46], easeOut); sh(V(0, 0, -6), 34); }, [[0, 'city_amb', .5], [.3, 'birds', .4], [.5, 'steps', .35]]);
// 2 «hat jede Frau einen Good Boy.»: de lado y enteros: Svenja pasea con su café y la correa; Lukas gatea delante con su collar, feliz
shot(1.14, 'W', null, L => { town(L); const x = SV0.x - 3 + L.lt * 1.6; strollW(sv, x, SV0.z, PI / 2, 0, L, 0); inHand(CUPS[0], sv, 'L', [0, -.75, .25]);
  cara(sv, L.T, { expr: 'happy', mouth: L.T > 2.0 ? 'open_smile' : 'smile', eyes: L.T > 2.0 ? 'happy' : undefined });
  crawl(me, x + 5.4, SV0.z, PI / 2, 0, L, 0, { wv: 1 }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' }); lead(sv, me, { sag: .7 });
  [[FR[1], MA[1], -10], [FR[2], MA[2], 8]].forEach(([w, m, dx], i) => pair(L, w, m, SV0.x + dx, SV0.z - 16, PI / 2, 1.6, i + 1));
  bubble(sv, 'Good Boy!', clamp((L.T - 2.0) / .12), 1.4);
  orb(L.k, V(x + 3.6, 3.0, SV0.z), V(x + 3.8, 3.0, SV0.z), [23, .06, .06, 46], [21.5, .02, .05, 46]); sh(SV0, 24); }, [[.05, 'chain_rattle', .45], [.85, 'pop', .4]]);
// 3 «Und das ist nicht ihr Hund.»: un perro salchicha de verdad mira, confundido; Svenja pasa de largo
shot(2.8, 'S', null, L => { town(L); show(DOG, SV0.x - 3, 0, SV0.z + 3, .5, 1.15); DOG.rotation.y = .5 + Math.sin(L.T * 3) * .15; DOG.position.y = 0;
  strollW(sv, SV0.x + 2.5, SV0.z - 2, -.3, 1.4, L, 0); cara(sv, L.T, { expr: 'happy' }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); lead(sv, null, { to: V(SV0.x + 1.0, .2, SV0.z + 6), sag: .3 });
  badge('q', '?', W * .5, H * .3, clamp((L.T - 3.5) / .12)); badge('red', 'KEIN HUND', W * .5, H * .17, clamp((L.T - 3.97) / .12), 1, .8);
  orb(L.k, V(SV0.x - 1.6, 2.2, SV0.z + 3), null, [12, .45, .12, 44], [10.5, .3, .1, 44]); sh(SV0, 18); }, [[0, 'bark', .55], [.7, 'boing_metal', .3]]);
// 4 «Es ist ihr Mann.» (golpe de zoom): Lukas a cuatro patas con collar, mueve el culete; Svenja detrás sujeta la correa
shot(4.38, 'C', 'punch', L => { town(L); const p = V(SV0.x, 0, SV0.z + 6); crawl(me, p.x, p.z, 0, 0, L, 0, { wv: .2, extra: { twist: Math.sin(L.T * 12) * .12 } }); me.root.rotation.z = Math.sin(L.T * 12) * .04; cara(me, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' });
  put(sv, p.x + .8, 0, p.z - 5.4, 0); actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: .5, aLe: 1.6, aLz: -.25 }]], { T: L.T }); cara(sv, L.T, { expr: 'smile' }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); lead(sv, me, { sag: .6 });
  crowdAt(L, p.x, p.z - 14, 5, 6, 12, 7, { mode: 'idle', list: FR, from: 4 });
  orb(L.k, V(p.x + .2, 2.8, p.z - 1.6), null, [14, .2, .12, 46], [12.4, .12, .1, 46]); sh(p, 18); }, [[0, 'chain_rattle', .5], [.35, 'sniff', .45]]);
// 5 «Sie entscheidet,»: Svenja señala el suelo: «Sitz!»
shot(5.55, 'F', null, L => { town(L); put(sv, SV0.x, 0, SV0.z, 0); actuar(sv, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .1, aLx: .4, aLe: 1.7, aLz: -.3, lean: .08, headX: .12 }]], { T: L.T }); talk(sv, L.T, 5.6, 6.3, 'determined', { eyes: 'angry' });
  crawl(me, SV0.x + .3, SV0.z + 5.4, PI, 0, L, 0); cara(me, L.T, { expr: 'happy' }); lead(sv, me, { sag: .9 }); bubble(sv, 'Sitz!', clamp((L.lt - .05) / .1), 1.4);
  orb(L.k, V(SV0.x + .2, 3.2, SV0.z + 2.7), null, [19, 1.3, .12, 46], [17.5, 1.2, .1, 46]); sh(SV0, 20); }, [[0, 'whistle', .35]]);
// 6 «er gehorcht.»: Lukas se sienta como un perro, orgulloso
shot(6.3, 'Z', null, L => { town(L); const p = V(SV0.x + .3, 0, SV0.z + 5.4); put(me, p.x, 0, p.z, 0); const k = easeOut(clamp(L.lt / .3)); actuar(me, 0, [[0, mixP(DOGP(L.T, 0), SITZ({ headX: -.2 }), k)]], { T: L.T }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile', eyes: k > .8 ? 'happy' : 'normal' });
  put(sv, p.x - .6, 0, p.z - 5.6, 0); actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: 1.2, aLz: -.6, aLe: 1.8 }]], { T: L.T }); cara(sv, L.T, { expr: 'smug' }); lead(sv, me, { sag: .8 });
  orb(L.k, V(p.x, 3.0, p.z - 1), null, [12, -.3, .12, 44], [10, -.18, .1, 44]); sh(p, 18); }, [[0, 'thud', .4], [.2, 'cloth', .4]]);
// 7 «Ich bin Lukas,»: primer plano de Lukas sentado, saluda con la pata; placa con su nombre
shot(7.25, 'R', null, L => { town(L); const p = V(SV0.x + .3, 0, SV0.z + 5.4); put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, SITZ({ aRx: 2.3 + Math.sin(L.T * 10) * .2, aRe: .6, aRz: .3, headZ: .1 })]], { T: L.T }); talk(me, L.T, 7.3, 8.1, 'happy');
  badge('tag', 'LUKAS', W * .5, H * .2, clamp((L.T - 7.64) / .12)); crowdAt(L, p.x, p.z - 6, 4, 8, 14, 3, { mode: 'idle', list: FR, from: 6 });
  onFace(me, 5.2, -.2, .3, 42, L.k, 4.4); sh(p, 16); }, [[0, 'pop', .45], [.4, 'bark', .25]]);
// 8 «und ich bin der bravste Good Boy»: Svenja le cuelga una medalla «Nr. 1» del collar
shot(8.6, 'I', null, L => { town(L); const p = V(SV0.x + .3, 0, SV0.z + 5.4); put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, SITZ({ headX: -.25 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  put(sv, p.x + .2, 0, p.z - 3.6, 0); actuar(sv, 0, [[0, { aRx: 1.2, aRe: .7, aLx: 1.2, aLe: .7, lean: .25, headX: .3 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'smile' });
  attach(MEDAL, me.collar, [0, -.9, .62], [0, 0, 0], .9); MEDAL.rotation.z = Math.sin(L.T * 5) * .15;
  badge('gold', 'BRAVSTER', W * .5, H * .17, clamp((L.T - 8.91) / .12), 1, .85); confetti(V(p.x, 3, p.z), 9.35, L.T, 40, .6);
  orb(L.k, V(p.x, 3.2, p.z - 1.2), null, [10.5, .45, .14, 42], [9, .3, .12, 42]); sh(p, 16); }, [[.1, 'coin_flip', .4], [.3, 'sparkle', .5], [.75, 'party_horn', .3]]);
// 9 «der ganzen Stadt.» (zoom lento): la plaza aplaude a Lukas sentado en la fuente
shot(9.75, 'Z', 'slow', L => { town(L); const p = V(-18, 0, -14); put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, SITZ({ headX: -.25, aRx: 2.6, aRz: .3, aRe: .4 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); attach(MEDAL, me.collar, [0, -.9, .62], [0, 0, 0], .9);
  put(sv, p.x - 3.4, 0, p.z - 1, .3); actuar(sv, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .3, aLx: .5, aLe: 1.5 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'open_smile' });
  crowdAt(L, p.x, p.z, 10, 7, 13, 11, { mode: 'clap', list: FR, from: 2 }); crowdAt(L, p.x, p.z, 4, 11, 16, 5, { mode: 'cheer', list: FR, from: 12 });
  orbit(V(p.x, 3, p.z), lerp(24, 14, easeIn(L.k)), .12, .2, 44); sh(p, 24); }, [[0, 'cheer', .45], [.3, 'confetti', .3]]);
// 10 «Denn jeden Sonntag geht hier»: el reloj del Rathaus toca las campanas: «SONNTAG»
shot(10.95, 'W', null, L => { town(L); cm([-4, 6.5, -28], [-4.6, 7.2, -33], L.k); camera.lookAt(-6, 13, -92); camera.fov = 46;
  [[FR[0], MA[0], -14, -60, -.2], [FR[1], MA[1], 6, -64, .2]].forEach(([w, m, x, z, ry], i) => pair(L, w, m, x, z, PI + ry, 2.2, i));
  badge('tag', 'SONNTAG', W * .5, H * .16, clamp((L.T - 11.49) / .12)); sh(V(-6, 0, -70), 40); }, [[0, 'bell_big', .45], [.6, 'bells', .35]]);
// 11 «die ganze Stadt Gassi.»: desde arriba, una calle llena de parejas que vienen hacia la cámara
shot(12.25, 'S', null, L => { town(L); for (let i = 0; i < 10; i++) { const x = (i % 2 ? 7 : -7) + (i % 3 - 1) * 2, z = 6 - Math.floor(i / 2) * 11; pair(L, FR[i], MA[i], x, z, PI * 0 + (i % 2 ? -.06 : .06), 3, i); }
  orb(L.k, V(0, 2, 6), V(0, 2, 10), [40, .02, .5, 46], [36, -.05, .44, 46]); sh(V(0, 0, -10), 44); }, [[0, 'steps', .45], [.5, 'chain_rattle', .35]]);
// 12 «Die Frauen tragen den Kaffee,»: dos amigas pasean con su café y charlan; las correas van hacia delante
shot(13.65, 'C', null, L => { town(L); const z0 = 0; strollW(FR[3], -1.8, z0, 0, 2.2, L, 0); strollW(FR[5], 1.8, z0, 0, 2.2, L, 1);
  inHand(CUPS[3], FR[3], 'L', [0, -.75, .25]); inHand(CUPS[4], FR[5], 'L', [0, -.75, .25]); talk(FR[3], L.T, 13.7, 14.3, 'happy'); cara(FR[5], L.T, { expr: 'happy', mouth: L.T > 14.3 ? 'laugh' : 'smile', eyes: 'happy' });
  crawl(MA[3], -2.4, z0 + 9, 0, 2.2, L, 0); crawl(MA[5], 2.6, z0 + 9, 0, 2.2, L, 1); lead(FR[3], MA[3], { sag: .8 }); lead(FR[5], MA[5], { sag: .8 }); MA[3].root.visible = MA[5].root.visible = true;
  const zc = z0 + 2.2 * L.lt; cm([.6, 6.0, zc + 13.4], [.5, 5.9, zc + 12.2], L.k); camera.lookAt(0, 4.4, zc); camera.fov = 44; const c = V(0, 0, zc); sh(c, 18); }, [[0, 'sip', .45], [.6, 'laugh_m', .25]]);
// 13 «und die Männer laufen an der Leine.»: plano bajo: los hombres gatean en fila hacia la cámara, felices
shot(14.98, 'R', null, L => { town(L); for (let i = 0; i < 4; i++) { const x = -6 + i * 4, z = -4 + (i % 2) * 2; crawl(MA[6 + i], x, z, 0, 2.4, L, i); strollW(FR[6 + i], x - .2, z - 5.2, 0, 2.4, L, i); lead(FR[6 + i], MA[6 + i], { sag: .8 }); cara(MA[6 + i], L.T + i, { expr: 'happy', mouth: ['open_smile', 'grin', 'laugh', 'open_smile'][i], eyes: 'happy' }); cara(FR[6 + i], L.T + i, { expr: 'happy' }); }
  const c = V(0, 1.6, 2.4 * L.lt); cam([c.x, 2.4, c.z + 13], [c.x, 2.2, c.z - 2], 52); sh(c, 20); }, [[0, 'crawl', .45], [.4, 'chain_rattle', .4]]);
// 14 «Vor der Currywurstbude»: la Currywurstbude (ventanilla hacia +z); Lukas se acerca olfateando, nariz en alto
const CWB = V(6.8, 0, 42.6);   // delante de la ventanilla (la Bude está en (6, 36), ventanilla en z ≈ 38.7)
shot(16.6, 'F', null, L => { town(L); WURST.visible = true; put(FR[15], 6.6, 0, 37.0, 0); actuar(FR[15], 0, [[0, { aRx: 1.2, aRe: .8, aLx: .4 }]], { T: L.T }); cara(FR[15], L.T, { expr: 'happy' }); inHand(CW, FR[15], 'R', [0, -.6, .6]);
  crawl(me, 12, 48.5, -2.41, 1.6, L, 0, { headX: -.25 + Math.sin(L.T * 9) * .1 }); cara(me, L.T, { expr: 'happy', mouth: 'o', eyes: 'up' });
  orb(L.k, V(8, 3.6, 42), null, [24, .55, .12, 46], [21, .45, .1, 46]); sh(CWB, 22); }, [[0, 'pan_sizzle', .5], [.6, 'sniff', .5]]);
// 15 «ziehe ich so fest an der Leine,»: Lukas tira hacia la Bude; la correa tensa; Svenja arrastrada
shot(17.95, 'W', null, L => { town(L); WURST.visible = true; const p = V(CWB.x, 0, CWB.z + 1.2 - L.lt * .5); crawl(me, p.x, p.z, PI, 0, L, 0, { wv: 1.2, extra: { lean: 1.38, crouch: .1 } }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  put(sv, p.x, 0, p.z + 5.6, PI); actuar(sv, 0, [[0, { aRx: 1.4, aRe: .1, aLx: .9, aLe: .3, lean: .35, lLx: .5, lRx: -.3 }]], { T: L.T }); cara(sv, L.T, { expr: 'shock', mouth: 'o' }); lead(sv, me, { taut: 1 });
  orb(L.k, V(p.x, 3.0, p.z + 1.6), null, [21, PI / 2 + .15, .1, 48], [19.4, PI / 2 + .05, .08, 48]); sh(p, 18); }, [[0, 'tug', .55], [.5, 'strain', .4]]);
// 16 «dass Svenja fast hinfällt.»: Svenja tropieza hacia delante, brazos al aire, el café salpica
shot(19.2, 'S', null, L => { town(L); WURST.visible = true; const p = V(CWB.x, 0, CWB.z + 5.4); const w = Math.sin(L.T * 14); put(sv, p.x, 0, p.z, PI); actuar(sv, 0, [[0, { lean: .5 + Math.sin(L.T * 5) * .08, aLx: 2.4 + w * .4, aLz: .6, aRx: 1.6 - w * .4, aRz: .5, aRe: .2, lLx: .7, lRx: -.4, lLk: .3, headX: -.2 }]], { T: L.T });
  cara(sv, L.T, { expr: 'shock', mouth: 'talk_wide', eyes: 'wide' }); crawl(me, p.x, p.z - 5.4, PI, 0, L, 0, { wv: 1.2 }); cara(me, L.T, { expr: 'happy' }); lead(sv, me, { taut: 1 });
  splash(V(p.x, 6, p.z - .6), 19.4, L.T, .5); onBody(sv, 12.5, -1.0, .14, 46, L.k, 11); sh(p, 18); }, [[0, 'gasp_f', .5], [.3, 'cup_rattle', .4], [.8, 'splash', .25]]);
// 17 «Doch ein einziges Aus reicht,»: Svenja recupera el equilibrio y grita «Aus!»
shot(20.6, 'C', null, L => { town(L); WURST.visible = true; const p = V(CWB.x, 0, CWB.z + 5.4); put(sv, p.x, 0, p.z, PI - .3); const k = clamp((L.T - 21.4) / .15); actuar(sv, 0, [[0, { aRx: lerp(.8, 1.5, k), aRz: -.1, aRe: lerp(.4, .05, k), aLx: .3, lean: -.05, headX: -.05 }]], { T: L.T });
  talk(sv, L.T, 21.4, 21.9, k > 0 ? 'angry' : 'neutral', { eyes: k > 0 ? 'angry' : undefined }); bubble(sv, 'AUS!', k, 1.4);
  crawl(me, p.x - .6, p.z - 5.4, PI + .3, 0, L, 0, { wv: 0 }); attach(WURSTL, me.head, [0, .2, .9], [0, PI / 2, 0], 1.0); cara(me, L.T, { expr: 'happy', mouth: 'grin' }); lead(sv, me, { sag: .5 });
  onBody(sv, 13.5, -.95, .14, 46, L.k, 12, -.85); sh(p, 18); }, [[.8, 'slap', .35]]);
// 18 «und die Wurst liegt auf dem Boden.»: Lukas se gira, triste; la wurst se le cae de la boca
shot(22.35, 'Z', null, L => { town(L); WURST.visible = true; const p = V(CWB.x, 0, CWB.z); const ry = .35; crawl(me, p.x, p.z, ry, 0, L, 0, { wv: 0, headX: .2 }); cara(me, L.T, { expr: 'sad', mouth: 'o' });
  const t = clamp((L.T - 22.6) / .5); const m0 = hp(me).add(V(Math.sin(ry) * .9, -.2, Math.cos(ry) * .9)); show(WURSTL, m0.x + Math.sin(ry) * t * .8, lerp(m0.y, .25, easeIn(t)), m0.z + Math.cos(ry) * t * .8, PI / 2 + t * 2.5); if (t >= 1) WURSTL.position.y = .25 + Math.abs(Math.sin((L.T - 23.1) * 12)) * .3 * Math.max(0, 1 - (L.T - 23.1) * 3);
  dust(V(m0.x, 0, m0.z + .8), 23.1, L.T, 6, .4); orb(L.k, V(p.x + .6, 1.8, p.z + 1.8), null, [10.5, ry + .45, .12, 44], [9.2, ry + .3, .1, 44]); sh(p, 14); }, [[.25, 'whoosh_down', .35], [.75, 'thud', .5]]);
// 19 «Die Tauben freuen sich.»: las palomas picotean la wurst; Lukas mira, triste
shot(23.85, 'I', null, L => { town(L); WURST.visible = true; const w = V(CWB.x + 1.2, 0, CWB.z + 3.6); show(WURSTL, w.x, .25, w.z, .4);
  PIGS.forEach((pg, i) => { const a = i / 6 * 6.283 + .3, r = 1.7 + (i % 2) * .5; show(pg, w.x + Math.cos(a) * r, 0, w.z + Math.sin(a) * r, Math.atan2(-Math.cos(a), -Math.sin(a)), .9); pg.userData.head.position.y = 1.25 - Math.max(0, Math.sin(L.T * 14 + i * 2)) * .4; pg.rotation.x = Math.max(0, Math.sin(L.T * 14 + i * 2)) * .3; });
  crawl(me, w.x - 4.6, w.z - 2.4, 1.1, 0, L, 0, { wv: 0 }); cara(me, L.T, { expr: 'sad', mouth: 'frown' }); hearts(V(w.x, 2.4, w.z), L.T);
  orb(L.k, V(w.x - 1.2, 1.6, w.z - .6), null, [12, .3, .3, 46], [10.6, .42, .26, 46]); sh(w, 14); }, [[0, 'feathers', .45], [.4, 'pling', .35]]);
// ---------- parque ----------
const PK = V(PX, 0, -4);
const park2 = (L, o = {}) => { parkS(L); crawl(me, PK.x - 3.3, PK.z, PI / 2, 0, L, 0, { wv: .3, ...o.me }); crawl(ben, PK.x + 3.3, PK.z + .3, -PI / 2, 0, L, 1, { wv: .3, ...o.ben });
  put(sv, PK.x - 9.6, 0, PK.z - .4, PI / 2); put(jana, PK.x + 9.6, 0, PK.z + .6, -PI / 2); lead(sv, me, { sag: 1 }); lead(jana, ben, { sag: 1 }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); inHand(CUPS[1], jana, 'L', [0, -.75, .25]); };
// 20 «Im Park beschnuppere ich Benni,»: en el parque, Lukas olfatea a Benni
shot(25.2, 'W', null, L => { park2(L, { me: { headX: -.1 + Math.sin(L.T * 12) * .08, headY: .2 } }); cara(me, L.T, { expr: 'curious', mouth: 'o', eyes: 'squint' }); cara(ben, L.T, { expr: 'confused', eyes: 'side_l' });
  actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: .5, aLe: 1.6, aLz: -.25 }]], { T: L.T }); actuar(jana, 0, [[0, { aRx: .8, aRe: .3, aLx: .5, aLe: 1.6, aLz: -.25 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy' }); cara(jana, L.T, { expr: 'happy' });
  orb(L.k, V(PK.x - .4, 2.4, PK.z), null, [19, .3, .14, 46], [17.6, .22, .12, 46]); sh(PK, 18); }, [[0, 'birds', .4], [.4, 'sniff', .55]]);
// 21 «und Benni beschnuppert mich.»: contraplano: Benni olfatea a Lukas
shot(26.85, 'S', null, L => { park2(L, { ben: { headX: -.1 + Math.sin(L.T * 12) * .08, headY: -.2 } }); cara(ben, L.T, { expr: 'curious', mouth: 'o', eyes: 'squint' }); cara(me, L.T, { expr: 'confused', eyes: 'side_r', mouth: 'flat' });
  actuar(sv, 0, [[0, { aRx: .8, aRe: .3 }]], { T: L.T }); actuar(jana, 0, [[0, { aRx: .8, aRe: .3 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy' }); cara(jana, L.T, { expr: 'happy' });
  orb(L.k, V(PK.x + .4, 2.4, PK.z), null, [19, -.3, .14, 46], [17.6, -.22, .12, 46]); sh(PK, 18); }, [[0, 'sniff', .5], [.5, 'sniff', .35]]);
// 22 «Eigentlich wollten wir uns nur begrüßen.»: los dos, de rodillas, se dan la mano, cortados
shot(27.95, 'F', null, L => { parkS(L); const sh_ = Math.sin(L.T * 9) * .2; put(me, PK.x - 1.6, 0, PK.z, PI / 2 - .25); put(ben, PK.x + 1.6, 0, PK.z, -PI / 2 + .25);
  actuar(me, 0, [[0, SITZ({ aRx: 1.35 + sh_, aRz: .1, aRe: .2, headX: .1 })]], { T: L.T }); actuar(ben, 0, [[0, SITZ({ aRx: 1.35 - sh_, aRz: .1, aRe: .2, headX: .1 })]], { T: L.T });
  cara(me, L.T, { expr: 'worried', mouth: 'flat', eyes: 'side_r' }); cara(ben, L.T, { expr: 'worried', mouth: 'flat', eyes: 'side_l' }); sweat(me, L.T, 2);
  orb(L.k, V(PK.x, 3.0, PK.z), null, [14, 0, .12, 44], [12.6, .06, .1, 44]); sh(PK, 16); }, [[.2, 'cough', .35], [.9, 'cloth', .35]]);
// 23 «Aber unsere Freundinnen sind begeistert:»: Svenja y Jana, manos en las mejillas, corazones
shot(29.85, 'C', null, L => { parkS(L); const p = V(PK.x, 0, PK.z - 6); put(sv, p.x - 1.7, 0, p.z, .25); put(jana, p.x + 1.7, 0, p.z, -.25);
  for (const c of [sv, jana]) { actuar(c, 0, [[0, { aLx: 2.05, aLz: -.18, aRx: 2.05, aRz: -.18, aLe: 2.25, aRe: 2.25, headZ: Math.sin(L.T * 4) * .12, crouch: Math.abs(Math.sin(L.T * 6)) * .06 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' }); }
  hearts(V(p.x, 7.4, p.z + .6), L.T); orb(L.k, V(p.x, 4.4, p.z), null, [12, .1, .12, 42], [10.5, -.05, .1, 42]); sh(p, 16); }, [[0, 'gasp_f', .4], [.5, 'sparkle', .45]]);
// 24 «Schau mal, die zwei mögen sich!»: Jana señala a los dos chicos; Svenja, emocionada
shot(31.75, 'R', null, L => { parkS(L); crawl(me, PK.x - 3.3, PK.z, PI / 2, 0, L, 0, { wv: .7 }); crawl(ben, PK.x + 3.3, PK.z + .3, -PI / 2, 0, L, 1, { wv: .7 }); cara(me, L.T, { expr: 'happy', mouth: 'grin' }); cara(ben, L.T, { expr: 'happy', mouth: 'grin' });
  put(jana, PK.x + 6.2, 0, PK.z - 4.2, -.75); put(sv, PK.x - 6.2, 0, PK.z - 4.2, .75); lead(sv, me, { sag: .8 }); lead(jana, ben, { sag: .8, hand: 'L' });
  actuar(jana, 0, [[0, { aRx: 1.45, aRz: -.15, aRe: .1, aLx: .8, aLe: .3, headY: -.2 }]], { T: L.T }); talk(jana, L.T, 31.8, 33.4, 'joy'); actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: 2.0, aLz: -.2, aLe: 2.2 }]], { T: L.T }); cara(sv, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  bubble(jana, L.T < 32.4 ? 'Schau mal!' : 'Die zwei mögen sich!', clamp((L.T - 31.82) / .1), 1.3); hearts(V(PK.x, 3.4, PK.z), L.T);
  orb(L.k, V(PK.x, 3.2, PK.z - 1.8), null, [23, .1, .14, 52], [21.5, -.04, .12, 52]); sh(PK, 20); }, [[0, 'laugh_m', .25], [.1, 'pop', .4]]);
// 25 «Seitdem haben wir jeden Donnerstag»: el calendario de la pared: «DONNERSTAG – SPIELDATE mit Benni»; Lukas lo señala con la pata, feliz
shot(33.45, 'I', null, L => { home(L); const cx = WX - 21.55; show(CAL, cx, 9.4, -4, PI / 2, 1.1); const camP = V(WX - 8, 7.2, 5); const p = V(WX - 17.5, 0, -1.6); put(me, p.x, 0, p.z, faceTo(p, camP));
  actuar(me, 0, [[0, SITZ({ aLx: 2.4, aLz: .5, aLe: .3, headX: -.1, headY: .15 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); me.root.rotation.z = Math.sin(L.T * 10) * .03;
  cm([camP.x, camP.y, camP.z], [camP.x - 1.5, camP.y - .2, camP.z - 1.6], L.k); camera.lookAt(WX - 19, 6.6, -3); camera.fov = 46; }, [[0, 'pages', .45], [.5, 'pencil', .3]]);
// 26 «ein Spieldate.»: Lukas y Benni corren tras la pelota en el parque; ellas charlan en el banco con su café
shot(34.6, 'Z', null, L => { parkS(L); const t = L.lt; show(BALL, PK.x + 6 - t * 5, .6 + Math.abs(Math.sin(t * 7)) * 1.6, PK.z + 6, t * 8);
  crawl(me, PK.x + 9.5 - t * 4.6, PK.z + 4.6, -PI / 2 - .1, 0, L, 0, { wv: 1.3 }); crawl(ben, PK.x + 10 - t * 4.4, PK.z + 7.6, -PI / 2 + .1, 0, L, 1, { wv: 1.3 }); cara(me, L.T, { expr: 'joy', eyes: 'happy', mouth: 'laugh' }); cara(ben, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  const B = V(PX - 14, 0, -10); put(sv, B.x - 1.4, sitY(sv, 2.3), B.z - .4, 0); put(jana, B.x + 1.4, sitY(jana, 2.3), B.z - .4, 0); for (const c of [sv, jana]) actuar(c, 0, [[0, seatPose({ aLx: .9, aLe: 1.4, aRx: .5, aRe: .8 })]], { T: L.T });
  talk(sv, L.T, 34.6, 35.6, 'happy'); cara(jana, L.T, { expr: 'happy', mouth: 'smile' }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); inHand(CUPS[1], jana, 'L', [0, -.75, .25]);
  orb(L.k, V(PK.x + 4, 2.4, PK.z + 5), null, [18, -.3, .16, 48], [16, -.4, .14, 48]); sh(PK, 26); }, [[0, 'run_grass', .45], [.3, 'kids_laugh', .2], [.7, 'boing_metal', .25]]);
