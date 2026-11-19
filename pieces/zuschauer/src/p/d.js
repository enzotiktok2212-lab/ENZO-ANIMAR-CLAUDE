// ---------- d: «Er ist geblieben», la fiesta, el zoom infinito, el túnel, el sofá dorado con «DU», el bucle (68,13 – 93,9 s) ----------
// 47 «Er ist geblieben.»: el pulgar se va hacia arriba, vuelve el sol, todos saltan
shot(68.13, 'F', null, L => { town(L); const q = easeIn(clamp(L.lt / .8)); daumenAt(TX, 40 + q * 120, TZ + 4, L.T); tafelAt(L.T, { gold: 1 }); TAF.userData.bulbs(1, L.T, 1); crowdTafel(L, 'cheer', 47, { gold: 1 }); confetti(V(TX, 4, TZ + 12), L.t0 + .1, L.T, 70, 1.4);
  cm([TX + 3, 5, TZ + 36, TX, 12, TZ, 46], [TX + 2, 5.4, TZ + 33, TX, 12.5, TZ, 44], L.k); sh(V(TX, 0, TZ + 10), 30); }, [[0, 'whoosh_up', .8], [.1, 'cheer', .8], [.2, 'confetti', .6], [.5, 'party_horn', .5]]);
// 48 «Die ganze Stadt hat geschrien.»: fuegos artificiales; Papa sube al chico a hombros
shot(69.14, 'C', null, L => { town(L); tafelAt(L.T, { gold: 1 }); TAF.userData.bulbs(1, L.T, 1); const p = put(papa, TX, 0, TZ + 20, 0); actuar(p, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .2, aRz: .2, aLe: .6, aRe: .6, headX: -.2 }]], { T: L.T }); cara(p, L.T, { expr: 'joy', mouth: 'laugh' });
  const h = hp(p); const j = put(junge, h.x, h.y + .2, h.z - .2, 0); actuar(j, 0, [[0, { ...GEST.cheer, lLx: -1.4, lRx: -1.4, lLk: 1.4, lRk: 1.4 }]], { T: L.T }); cara(j, L.T, { expr: 'joy', mouth: 'open_smile' });
  crowdAt(L, TX, TZ + 20, 18, 4, 16, 48, { mode: 'cheer' }); fireworks(V(TX, 10, TZ - 10), L.T); onFace(p, 6, 1.8, -.4, 46, L.k, 5.2); sh(V(TX, 0, TZ + 20), 26); }, [[0, 'firework', .6], [.2, 'cheer', .7], [.6, 'firework', .5], [1.0, 'whistle', .4]]);
cut(70.0, 'C', [.7, 1.3, 4], [[0, 'firework', .6], [.3, 'clap_crowd', .6]]);
// 49 «Und als es wieder ruhig war, sagte Papa:»: atardecer tranquilo; Papa, móvil en mano, te habla
const PP = V(TX + 2, 0, TZ + 30);
function papaPhone(L, o = {}) { town(L); setSky([.3, .3, .7], [.9, .55, .45], [1, .75, .45]); sun.color.setRGB(1, .7, .45); tafelAt(L.T, { gold: 1 }); const p = put(papa, PP.x, 0, PP.z, 0); actuar(p, 0, [[0, { aRx: 1.3, aRz: -.15, aRe: .5, aLx: .2, headX: .05 }]], { T: L.T }); talk(p, L.T, 71.9, 74, 'happy');
  p.root.updateMatrixWorld(true); const h = hp(p); PH.visible = true; PH.scale.setScalar(o.s ?? 1.1); PH.position.copy(h).add(V(.9, -1.2, 2.2)); PH.lookAt(PH.position.clone().add(V(0, 0, 10))); PH.userData.set('plain', { prog: .9 }); return p; }
shot(70.81, 'W', null, L => { const p = papaPhone(L); crowdAt(L, PP.x, PP.z, 10, 6, 16, 49, { mode: 'stare' }); onFace(p, 5, .6, .4, 42, L.k, 4.4); sh(PP, 24); }, [[0, 'whoosh', .5], [.2, 'birds', .4], [.9, 'wind', .3]]);
cut(71.8, 'C', [-.45, .8, .3], [[0, 'whoosh', .3], [.2, 'mobile', .4]]);
// 50 «Zoom rein. Ins Handy.»: la cámara se mete en el móvil de Papa (efecto Droste: el vídeo dentro del vídeo)
shot(72.72, 'Z', null, L => { const p = papaPhone(L, { s: 1.4 }); const ph = wpos(PH); droste(PHS, 6); const e = easeIn(L.k); cm([ph.x, ph.y + .1, ph.z + 7, ph.x, ph.y, ph.z, 40], [ph.x, ph.y, ph.z + 1.25, ph.x, ph.y, ph.z, 40], e, x => x); sh(PP, 24); }, [[0, 'zoom_in', .8], [.4, 'whoosh', .5], [.9, 'magic_hit', .5]]);
// 51 «In dein Zimmer.»: tu cuarto de noche: tú en la cama con el móvil
shot(74.03, 'Z', null, L => { zimmerN(L); const c = duBed(L, { glow: 26, expr: 'happy', mouth: 'smile' }); droste(PHS, 6); const ph = wpos(PH); cm([ZX + 13, 8.5, 9, BEDP.x, 4.6, BEDP.z, 44], [ph.x + .2, ph.y + .4, ph.z + 4.5, ph.x, ph.y, ph.z, 40], easeIn(L.k), x => x); sh(BEDP, 14); }, [[0, 'zoom_in', .7], [.3, 'cloth', .4]]);
// 52 «In dein Handy.»: tu pantalla, cada vez más cerca
shot(74.82, 'Z', null, L => { zimmerN(L); duBed(L, { glow: 26, expr: 'happy', mouth: 'smile' }); droste(PHS, 7); const ph = wpos(PH); PH.updateMatrixWorld(true); const n = V(0, 0, 1).applyQuaternion(PH.getWorldQuaternion(new THREE.Quaternion())); cm([ph.x + n.x * 3.4, ph.y + n.y * 3.4, ph.z + n.z * 3.4, ph.x, ph.y, ph.z, 40], [ph.x + n.x * .95, ph.y + n.y * .95, ph.z + n.z * .95, ph.x, ph.y, ph.z, 40], easeIn(L.k), x => x); sh(BEDP, 14); }, [[0, 'zoom_in', .7], [.4, 'glitch', .4]]);
// 53 «In unsere Stadt.»: desde el cielo, en picado hacia el móvil gigante de la plaza
shot(75.64, 'Z', null, L => { town(L); RH.userData.draw({}); droste(RH.userData.scr, 6); crowdAt(L, HX, HZ + 10, 14, 6, 18, 53, { mode: 'wave' }); const c = V(HX, 10.2, HZ); const f = V(Math.sin(-.25), 0, Math.cos(-.25));
  cm([c.x + f.x * 70, 60, c.z + f.z * 70, c.x, 6, c.z, 46], [c.x + f.x * 11.5, 10.6, c.z + f.z * 11.5, c.x, 10.2, c.z, 44], easeIn(L.k), x => x); sh(V(HX, 0, HZ), 40); }, [[0, 'whoosh_down', .7], [.5, 'zoom_in', .6], [.8, 'city_amb', .4]]);
// 54 «In dein Zimmer.»: otra vez tu cuarto, desde la tele
shot(76.75, 'Z', null, L => { zimmerN(L); duBed(L, { glow: 26, expr: 'happy', mouth: 'smile' }); droste(PHS, 7); const ph = wpos(PH); cm([ZX + 4, 9, 11, BEDP.x, 4.4, BEDP.z, 44], [ph.x - .3, ph.y + .3, ph.z + 3.6, ph.x, ph.y, ph.z, 40], easeIn(L.k), x => x); sh(BEDP, 14); }, [[0, 'zoom_in', .7], [.4, 'whoosh', .4]]);
// 55 «Für immer.»: espiral infinita: la pantalla dentro de la pantalla, girando
shot(77.7, 'R', null, L => { zimmerN(L); duBed(L, { glow: 26, expr: 'happy', mouth: 'smile' }); droste(PHS, 10); const ph = wpos(PH); PH.updateMatrixWorld(true); const n = V(0, 0, 1).applyQuaternion(PH.getWorldQuaternion(new THREE.Quaternion())); const d = lerp(2.2, 1.0, easeIn(L.k)); cam([ph.x + n.x * d, ph.y + n.y * d, ph.z + n.z * d], [ph.x, ph.y, ph.z], 40); ROLL = L.lt * 2.4; sh(BEDP, 14); }, [[0, 'whoosh', .6], [.2, 'clock_spin', .6], [.5, 'magic_hit', .5]]);
// 56 «Denn hinter dem letzten Bild war ein Tunnel.»: un túnel de marcos de pantalla que brillan; la cámara vuela dentro
function tunnel(L, z0, z1) { use('TUN'); MODE = 'in'; renderer.toneMappingExposure = 1; hemi.intensity = .4; sun.intensity = 0; FILL.intensity = 0; bloom.strength = .5; bloom.threshold = .6; scene.fog.color.setRGB(.02, .02, .06); scene.fog.density = .004; setSky([0, 0, .02], [0, 0, .04], [.02, .02, .06]);
  TUN.fr.forEach((f, i) => f.rotation.z = L.T * .4 + i * .15); const z = lerp(z0, z1, L.k); cam([NX + Math.sin(L.T * 1.3) * .6, Math.cos(L.T * 1.1) * .6, z], [NX, 0, z - 30], 60); }
shot(78.49, 'Z', null, L => { tunnel(L, 20, -60); }, [[0, 'whoosh', .7], [.3, 'drone', .6], [1.0, 'whoosh', .5], [1.6, 'whoosh', .5]]);
// 57 «Und ganz am Ende des Tunnels»: la luz al final, cada vez más cerca
shot(80.64, 'F', null, L => { tunnel(L, -120, -225); grade.uniforms.flash.value = Math.max(0, (L.k - .7) / .3) * .7; }, [[0, 'whoosh', .6], [.5, 'choir', .5], [1.0, 'riser_short', .5]]);
// 58 «stand ein goldenes Sofa auf unserem Marktplatz.» (zoom lento): el sofá dorado bajo el foco; el pueblo aplaude alrededor
function sofaScene(L, mode = 'clap', seed = 58) { town(L); BEAM.visible = true; rowAt(L, SX, SZ - 3, 9, 11, -1.6, -.55, mode, seed, { from: 0, face: V(SX, 0, SZ + 26) }); rowAt(L, SX, SZ - 3, 9, 11, .55, 1.6, mode, seed + 1, { from: 9, face: V(SX, 0, SZ + 26) }); }
shot(81.98, 'F', 'slow', L => { sofaScene(L); confRain(V(SX, 0, SZ + 4), L.T, 50, 30, 20, 18); orb(L.k, V(SX, 4, SZ), null, [38, .4, .16, 46], [24, .15, .12, 42]); sh(V(SX, 0, SZ), 30); }, [[0, 'flash', .6], [.1, 'choir', .6], [.4, 'clap_crowd', .6], [1.4, 'sparkle', .5]]);
cut(83.4, 'C', [-.6, .9, 1], [[0, 'whoosh', .4], [.2, 'fanfare', .4]]);
// 59 «Mit deinem Namen drauf.»: la placa roja con «DU»
shot(84.8, 'C', 'punch', L => { sofaScene(L, 'clap', 59); const p = V(SX, 5.4, SZ - .9); cm([SX + .8, 6.4, SZ + 9, p.x, p.y, p.z, 40], [SX + .5, 6.0, SZ + 6.5, p.x, p.y, p.z, 38], L.k); sh(V(SX, 0, SZ), 20); }, [[0, 'impact', .6], [.1, 'sparkle', .7], [.6, 'ding_soft', .5]]);
// 60 «Weil du der Erste bist, der geblieben ist.»: Papa presenta el sofá; «#1»
shot(86.2, 'W', null, L => { sofaScene(L, 'cheer', 60); const p = put(papa, SX + 6.5, 0, SZ + 6, -.5); actuar(p, 0, [[0, { aLx: 1.2, aLz: .9, aLe: .2, aRx: .3, headX: -.05 }]], { T: L.T }); cara(p, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); const r = put(krause, SX - 6, 0, SZ + 6.5, .5); actuar(r, 0, [[0, { aLx: 1.2, aLz: -.6, aLe: 1.9, aRx: 1.2, aRz: -.6, aRe: 1.9 }]], { T: L.T }); cara(r, L.T, { expr: 'happy', eyes: 'cry', mouth: 'smile' }); tears(r, L.T);
  cm([SX, 7, SZ + 26, SX, 4.5, SZ + 3, 46], [SX, 7.2, SZ + 23, SX, 4.6, SZ + 3, 44], L.k); badge('gold', '#1', W / 2, H * .2, (L.lt - .2) * 3); sh(V(SX, 0, SZ + 4), 26); }, [[0, 'whoosh', .5], [.2, 'fanfare', .5], [.6, 'cheer', .5]]);
cut(87.4, 'C', [.5, .75, .5], [[0, 'whoosh', .4], [.2, 'clap', .5]]);
// 61 «Du schaust diese Stadt nämlich nicht.»: todo el pueblo, en filas, te mira y sonríe
shot(88.59, 'Z', null, L => { town(L); setSky([.3, .3, .7], [.9, .55, .45], [1, .75, .45]); sun.color.setRGB(1, .75, .5); rowAt(L, P0.x, P0.z - 30, 9, 22, -.34, .34, 'stare', 61, { from: 0, face: V(P0.x, 0, 40) }); rowAt(L, P0.x, P0.z - 30, 9, 17, -.42, .42, 'stare', 62, { from: 9, face: V(P0.x, 0, 40) });
  for (const [ch, x] of [[frieda, -4.5], [kalle, -1.5], [opa, 1.5], [krause, 4.5]]) { put(ch, P0.x + x, 0, P0.z - 4, 0); actuar(ch, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(ch, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' }); }
  cm([P0.x, 5.2, P0.z + 15, P0.x, 4.2, P0.z - 6, 46], [P0.x, 4.9, P0.z + 11, P0.x, 4.3, P0.z - 6, 44], L.k); sh(P0, 30); }, [[0, 'zoom_in', .5], [.3, 'strings', .5], [1.0, 'heartbeat', .4]]);
// 62 «Du wohnst hier.»: desde el sofá (tus ojos): todos te saludan; Papa te tiende la mano
shot(90.24, 'C', 'punch', L => { sofaScene(L, 'wave', 62); const p = put(papa, SX, 0, SZ + 6.5, PI); actuar(p, 0, [[0, { aRx: 1.5, aRe: .2, aLx: .3, lean: .1 }]], { T: L.T }); cara(p, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); const j = put(junge, SX - 3.5, 0, SZ + 7.5, PI + .3); actuar(j, 0, [[0, { ...GEST.wave, aRz: .4 + Math.sin(L.T * 8) * .3 }]], { T: L.T }); cara(j, L.T, { expr: 'joy', mouth: 'open_smile' });
  crowdAt(L, SX, SZ + 10, 12, 6, 14, 62, { from: 18, mode: 'wave' }); cm([SX, 5.6, SZ + 1, SX, 4.6, SZ + 12, 50], [SX, 5.6, SZ + 1.5, SX, 4.6, SZ + 12, 48], L.k); sh(V(SX, 0, SZ + 8), 24); }, [[0, 'impact', .4], [.1, 'cheer', .5], [.5, 'kids_laugh', .4]]);
// 63 «Also … in dieser Stadt … alle –»: vuelta al principio (bucle): la plaza, la gente corriendo, la Tafel al fondo
shot(91.24, 'W', null, L => { hookStreet(L); }, [[0, 'whoosh', .6], [.1, 'run_cobble', .6], [.5, 'cheer', .4]]);
cut(92.5, 'C', [.35, .6, -.4], [[0, 'whoosh', .4], [.2, 'kids_laugh', .4]]);
