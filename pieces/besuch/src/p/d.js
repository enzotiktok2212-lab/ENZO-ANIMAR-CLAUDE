// ---------- d: el reflejo, la verdad, la despedida (68,3 – 100,3 s) ----------
// en la orilla: Mia (TXX(3), 30) y yo (TXX(5.4), 30), de cara al norte (al sol). Yo soy el visitante: sin reflejo.
const MZ = 30, MX = TXX(3), IX = TXX(5.4);
const pond = (late = 0) => { teichOn(); visitor(ich); if (late) { setSky([.12, .12, .4], [.75, .35, .5], [1, .5, .3]); SUNM.position.y = 400 - late * 160; scene.fog.color.setRGB(.9, .6, .6); } else SUNM.position.y = 400; };
const pair = (ry = PI) => { put(mia, MX, .1, MZ, ry); put(ich, IX, .1, MZ, ry); };
const hugPose = { crouch: .35, lean: .28, aLx: 1.35, aRx: 1.35, aLz: -.55, aRz: -.55, aLe: 1.25, aRe: 1.25, headX: .25 }, hugMia = { aLx: 2.3, aRx: 2.3, aLz: -.45, aRz: -.45, aLe: .9, aRe: .9, headX: -.25 };
const hug = (cx, rI = PI / 2) => { put(ich, cx + .55, .1, MZ, -PI / 2 + .25); put(mia, cx - .55, .1, MZ, PI / 2 + .25); };
// 46 «Im Eis:»: yo miro el hielo a mis pies y me quedo helado
shot(68.30, 'C', 'punch', L => { pond(); pair(PI); actuar(ich, L.lt, [[0, { headX: .5, lean: .15 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', eyes: 'down' }); actuar(mia, L.lt, [[0, { headX: .4 }]], { T: L.T }); cara(mia, L.T, { expr: 'sad', eyes: 'down' });
  orbit(V(IX - .6, 3.4, MZ), lerp(9, 7.5, L.k), PI - .25, .05, 44); sh(V(IX, 0, MZ), 20); }, [[0, 'freeze', .6], [.1, 'glass_crack', .3]]);
// 47 «Mias Spiegelbild.»: cámara baja sobre el hielo: el reflejo de Mia, del revés
shot(69.16, 'F', null, L => { pond(); pair(PI); actuar(mia, L.lt, [[0, { headX: .4 }]], { T: L.T }); cry(mia, L.T); actuar(ich, L.lt, [[0, { headX: .5 }]], { T: L.T });
  const k = easeInOut(L.k); cam([MX - .6, lerp(2.2, 1.6, k), MZ - lerp(9, 7.5, k)], [MX, .2, MZ - 2], 46); sh(V(MX, 0, MZ), 20); }, [[0, 'creepy_ting', .5], [.4, 'sparkle', .3]]);
// 48 «Daneben: keiner.» (zoom lento): Mia y yo; en el hielo solo está su reflejo; en mi sitio, nada
shot(70.50, 'S', 'slow', L => { pond(); pair(PI); actuar(mia, L.lt, [[0, { headX: .3 }]], { T: L.T }); cara(mia, L.T, { expr: 'sad' }); actuar(ich, L.lt, [[0, { headX: .5 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', eyes: 'down' });
  const k = easeInOut(L.k); cam([lerp(TXX(4.2), IX + .2, k), lerp(3.2, 2.0, k), MZ - lerp(12, 7, k)], [lerp(TXX(4.2), IX, k), lerp(1.4, .3, k), MZ - 1.5], 46); sh(V(TXX(4), 0, MZ), 20);
  badge('red', 'KEINER', W / 2, H * .15, (L.lt - .7) * 3, 1, .9); }, [[0, 'heartbeat', .6], [.6, 'heartbeat', .6]]);
// 49 «Im Schnee nur eine Spur:»: me giro y miro atrás: en la nieve solo hay una fila de huellas, las de Mia
shot(71.82, 'W', null, L => { pond(); put(mia, MX, .1, MZ, PI); const c = put(ich, IX, .1, MZ, lerp(PI, .3, easeInOut(clamp(L.lt / .6)))); cara(c, L.T, { expr: 'shock' }); cara(mia, L.T, { expr: 'sad' });
  cm([TXX(1), 7, 60], [TXX(1.5), 6.5, 54], L.k); camera.lookAt(TXX(4.5), 1.5, 34); sh(V(TXX(6), 0, 44), 30); badge('tag', 'NUR EINE SPUR', W / 2, H * .15, (L.lt - .3) * 3, 1, .85); }, [[0, 'steps_snow', .4], [.3, 'wind', .5]]);
// 50 «kleine Stiefel.»: primer plano de las huellas pequeñas en la nieve, la cámara las sigue
shot(73.62, 'Z', null, L => { pond(); const z = lerp(52, 46, L.k); cam([TXX(8.4), 2.4, z + 5], [TXX(7.6), .1, z], 44); sh(V(TXX(10), 0, z), 15); }, [[0, 'steps_snow', .6], [.5, 'wind', .3]]);
// 51 «Mia hielt meine Hand nicht fest, damit sie bleibt.»: nuestras manos agarradas, muy fuerte; Mia llora
shot(74.74, 'R', null, L => { pond(); put(mia, MX + .9, .1, MZ, PI - .3); put(ich, IX - .4, .1, MZ, PI + .3); actuar(mia, L.lt, [[0, { aRx: .6, aRz: .45, aRe: .5, headY: -.5, headX: -.2 }]], { T: L.T, extra: shiver(L.T, .3) }); actuar(ich, L.lt, [[0, { aLx: .6, aLz: .45, aLe: .5, headY: .4, headX: .3 }]], { T: L.T });
  cry(mia, L.T); cara(ich, L.T, { expr: 'sad' }); const h = V((MX + IX) / 2 + .2, 1.6, MZ); cm([h.x - 1.4, 2.8, h.z - 8.4], [h.x - 1, 2.6, h.z - 7.4], L.k); camera.lookAt(h.x, 1.8, h.z); sh(h, 15); }, [[0, 'cloth', .4], [.4, 'sniff', .5]]);
// 52 «Sie wollte sich an mich erinnern.»: Mia me mira hacia arriba, memorizando mi cara
shot(77.50, 'F', null, L => { pond(); const m = put(mia, MX + .6, .1, MZ, PI / 2 - .5), c = put(ich, IX, .1, MZ, -PI / 2); actuar(m, L.lt, [[0, { headX: -.45, aRx: .6, aRz: .4 }]], { T: L.T }); cry(m, L.T); cara(c, L.T, { expr: 'sad' });
  cm([MX + 3.6, 3.4, MZ - 5.4], [MX + 3.2, 3.2, MZ - 4.8], L.k); camera.lookAt(MX + .6, 2, MZ); sh(V(MX, 0, MZ), 15); }, [[0, 'heartbeat', .4], [.5, 'sniff', .4]]);
// 53 «Die Spiegel,»: ráfaga: los espejos tapados del salón
shot(79.12, 'C', 'punch', L => { stubeOn(); grade.uniforms.sepia.value = .25; cam([SX(-12), 5.5, lerp(6, 4, L.k)], [SX(-12.5), 5.4, lerp(5, 3, L.k)], 48); camera.lookAt(SX(-19.7), 5.2, 1); }, [[0, 'cloth', .5], [.1, 'whoosh', .3]]);
// 54 «die Pfannkuchen,»: ráfaga: las tortitas
shot(79.94, 'C', 'punch', L => { stubeOn(); grade.uniforms.sepia.value = .25; show(PANC, SX(-1), 3.1, -3, L.lt, 1); orbit(V(SX(-1), 4.2, -3), lerp(6.5, 5.6, L.k), -.4, .4, 42); }, [[0, 'plate_slide', .5]]);
// 55 «Papas Blick.»: ráfaga: Papa mirándome con lágrimas
shot(80.92, 'C', 'punch', L => { town(); grade.uniforms.sepia.value = .25; const d = hz(4.7, 8.6); const p = put(papa, d.x, 0, d.z, PI / 2 + .3); cry(p, L.T); onFace(p, lerp(4.6, 4, L.k), -.3, .3, 40); sh(d, 20); }, [[0, 'sad_tone', .5]]);
// 56 «Es war nie Mias Besuchstag.» (zoom lento): mi cara al comprenderlo
shot(81.88, 'I', 'slow', L => { pond(); const c = put(ich, IX, .1, MZ, PI - .2); actuar(c, L.lt, [[0, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); put(mia, MX, .1, MZ, PI);
  onFace(c, lerp(7, 4.4, L.k), -.3, 0, 40); sh(V(IX, 0, MZ), 15); }, [[0, 'heartbeat', .6], [.8, 'heartbeat', .6]]);
// 57 «Es war meiner.»: golpe: yo de pie sobre el hielo… y en el hielo no estoy; «MEINER»
shot(83.80, 'C', 'punch', L => { pond(); pair(PI); actuar(ich, L.lt, [[0, 'shock']], { T: L.T }); cara(ich, L.T, { expr: 'shock' }); cry(mia, L.T);
  cam([IX - .8, 1.8, MZ - lerp(9, 8, L.k)], [IX - .6, 1.1, MZ], 46); sh(V(IX, 0, MZ), 15); badge('red', 'MEINER', W / 2, H * .6, (L.lt - .05) * 3, 1, 1.1); }, [[0, 'braam', .7], [.05, 'impact', .5]]);
// 58 «Warum hast du nichts gesagt?»: le pregunto a Mia, con lágrimas
shot(84.86, 'W', null, L => { pond(); const c = put(ich, IX, .1, MZ, -PI / 2 + .5), m = put(mia, MX, .1, MZ, PI / 2 - .3); actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); talk(c, L.T, 84.86, 86.1, 'sad'); tears(c, L.T); cara(m, L.T, { expr: 'sad' });
  onFace(c, lerp(6, 5, L.k), -.2, .8, 42); sh(V(IX, 0, MZ), 15); }, [[0, 'sniff', .4], [.5, 'wind', .3]]);
// 59 «Das ist die Regel, flüsterte sie.»: Mia susurra llorando
shot(86.10, 'S', null, L => { pond(); const m = put(mia, MX, .1, MZ, PI - .2); put(ich, IX, .1, MZ, -PI / 2 + .5); actuar(m, L.lt, [[0, { headX: .2, aRx: .4 }]], { T: L.T }); talk(m, L.T, 86.1, 87.6, 'sad'); tears(m, L.T);
  onFace(m, lerp(5.2, 4.4, L.k), .4, -.8, 40); sh(V(MX, 0, MZ), 15); }, [[0, 'whisper', .6], [.8, 'sniff', .4]]);
// 60 «Die Sonne ging unter.»: plano general al contraluz: el sol se esconde detrás del molino; los dos sobre el hielo
shot(88.62, 'F', null, L => { pond(L.k); pair(PI); actuar(mia, L.lt, [[0, handR]], { T: L.T }); actuar(ich, L.lt, [[0, handL]], { T: L.T });
  orbit(V(TXX(4.2), 4, MZ - 4), lerp(30, 34, L.k), lerp(-.05, .05, L.k), .12, 50); sh(V(TXX(4), 0, MZ), 30); }, [[0, 'wind', .6], [.3, 'strings', .4]]);
// 61 «Ich hab nie Danke gesagt.»: Mia, con lágrimas, me lo dice
shot(89.92, 'R', null, L => { pond(1); const m = put(mia, MX, .1, MZ, PI - .2); put(ich, IX, .1, MZ, -PI / 2 + .4); talk(m, L.T, 89.92, 91, 'sad'); tears(m, L.T); actuar(m, L.lt, [[0, { aLx: .8, aRx: .8, aLe: 1.6, aRe: 1.6 }]], { T: L.T });
  onFace(m, lerp(5, 4.3, L.k), .4, -.8, 40); sh(V(MX, 0, MZ), 15); }, [[0, 'cry_girl', .3], [.6, 'sniff', .4]]);
// 62 «Ich drückte sie, so fest ich konnte.»: el abrazo, la cámara gira alrededor
shot(91.58, 'C', null, L => { pond(1); hug(TXX(4.2)); actuar(ich, L.lt, [[0, hugPose]], { T: L.T }); actuar(mia, L.lt, [[0, hugMia]], { T: L.T }); cara(ich, L.T, { expr: 'sad', eyes: 'closed' }); cry(mia, L.T, 2);
  orbit(V(TXX(4.2), 2.6, MZ), lerp(8, 7, L.k), lerp(PI - .9, PI - .2, L.k), .1, 44); sh(V(TXX(4), 0, MZ), 15); }, [[0, 'hug', .7], [.3, 'cloth', .4], [.8, 'strings', .3]]);
// 63 «Ich würde es immer wieder tun.»: mi cara sobre su hombro: sonrío con lágrimas
shot(93.86, 'Z', null, L => { pond(1); hug(TXX(4.2)); actuar(ich, L.lt, [[0, hugPose]], { T: L.T }); actuar(mia, L.lt, [[0, hugMia]], { T: L.T }); actuar(ich, L.lt, [[0, { ...hugPose, crouch: .05, headX: 0 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy', eyes: 'happy', mouth: kitLips(L.T, spoken(93.86, 95.5)) || 'smile' }); tears(ich, L.T);
  onFace(ich, lerp(5, 4.4, L.k), .9, 0, 40); sh(V(TXX(4), 0, MZ), 15); }, [[0, 'sniff', .4], [.5, 'piano_note', .4]]);
// 64 «Immer.»: plano general del abrazo con el sol en el horizonte
shot(95.56, 'F', null, L => { pond(1.4); hug(TXX(4.2)); actuar(ich, L.lt, [[0, hugPose]], { T: L.T }); actuar(mia, L.lt, [[0, hugMia]], { T: L.T }); cara(ich, L.T, { expr: 'happy', eyes: 'closed' }); cara(mia, L.T, { expr: 'sad', eyes: 'closed' });
  orbit(V(TXX(4.2), 3, MZ - 2), lerp(16, 19, L.k), -.05, .1, 46); sh(V(TXX(4), 0, MZ), 20); }, [[0, 'strings', .4], [.2, 'wind', .3]]);
// 65 «Und sie rief meinen Namen über den Teich,»: me deshago en destellos entre sus brazos; Mia grita mi nombre
shot(96.18, 'S', null, L => { pond(1.6); const k = clamp(L.lt / 1.6); hug(TXX(4.2)); ich.root.scale.setScalar(sc_(ich) * (1 - easeIn(k) * .95)); ich.root.visible = k < .97; actuar(ich, L.lt, [[0, hugPose]], { T: L.T }); cara(ich, L.T, { expr: 'happy', eyes: 'closed' }); SPK.run(V(TXX(4.75), .1, MZ), k, L.T, 2.2, 4);
  actuar(mia, L.lt, [[0, hugMia], [.9, { aLx: 2.0, aRx: 2.0, aLz: -.9, aRz: -.9, aLe: 2.1, aRe: 2.1, headX: -.35 }, { dur: .4 }]], { T: L.T }); cara(mia, L.T, { expr: 'sad', mouth: L.lt > .9 ? 'open' : 'frown' }); tears(mia, L.T);
  orbit(V(TXX(4.2), 2.4, MZ), lerp(9, 7, L.k), PI - .4, .12, 44); sh(V(TXX(4), 0, MZ), 15); }, [[0, 'sparkle', .7], [.2, 'magic_hit', .4], [1.0, 'cry_girl', .3]]);
// 66 «bis ich fort war.»: Mia sola sobre el hielo; la cámara sube y se aleja; una sola fila de huellas
shot(98.42, 'I', null, L => { pond(2); const m = put(mia, TXX(3.6), .1, MZ, PI); actuar(m, L.lt, [[0, { aLx: 2.0, aRx: 2.0, aLz: -.9, aRz: -.9, aLe: 2.1, aRe: 2.1, headX: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'sad', mouth: 'open' }); tears(m, L.T);
  const k = easeInOut(L.k); cam([TXX(3.6) - lerp(2, 6, k), lerp(4, 18, k), MZ + lerp(9, 26, k)], [TXX(3.6), 1.5, MZ - lerp(0, 6, k)], 48); sh(V(TXX(4), 0, MZ + 6), 40); }, [[0, 'wind', .6], [.4, 'sad_tone', .5], [1.2, 'piano_note', .4]]);
