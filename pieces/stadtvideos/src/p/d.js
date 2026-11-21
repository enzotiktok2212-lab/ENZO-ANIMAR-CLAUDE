// ===== 85,2–97,1 s: me descubren y el botón =====
const _q = new THREE.Quaternion();
function camsTurn(k, tgt) { TR.CAMS.forEach((c, i) => { const kk = clamp(k * 1.4 - i * .04); c.hd.quaternion.identity(); c.hd.lookAt(tgt); _q.copy(c.hd.quaternion); c.hd.quaternion.identity().slerp(_q, easeInOut(kk)); }); }
const meMid = (L, pose, expr = 'scared') => { put(ich, TX, 0, -8, .1); actuar(ich, L.lt, [[0, pose]], { T: L.T }); cara(ich, L.T, { expr }); };
const siren = (L, on = 1) => { TR.SL.intensity = on * (220 + Math.sin(L.T * 12) * 120); TR.BEAM.visible = on > 0; TR.BEAM.rotation.y = L.T * 5; TR.dome.material.emissiveIntensity = on ? 2.5 : .3; TR.L.intensity = on ? 50 : 140; };
// 54 «Plötzlich drehten sich alle Kameras zu mir.» — todas las cámaras de las paredes y la gigante giran hacia mí; pilotos rojos
shot(85.18, 'C', null, L => { use('TR'); inside(.5, 10); camPose(L); const k = clamp((L.lt - .2) / .9); meMid(L, { ...GEST.recoil, headX: -.3 }, 'shock'); const h = hp(ich); camsTurn(k, h); TR.CAM.yaw.rotation.y = lerp(0, PI, easeInOut(k)); TR.CAM.head.rotation.x = lerp(.35, .7, k);
  cm([TX + 8, 5, -16, TX, 18, 4, 64], [TX + 7, 5, -15, TX, 17, 4, 62], L.k); sh(V(TX, 0, -4), 30); }, [[0, 'impact', .6], [.2, 'machine_shake', .5], [.4, 'ratchet', .5], [.8, 'click_set', .5], [1.4, 'ratchet', .4], [2.0, 'click_set', .3]]);
// 55 «Eine Sirene ging los,» — sirena roja girando en el techo; todo se tiñe de rojo
shot(87.74, 'R', null, L => { use('TR'); inside(.4, 0); camPose(L); siren(L); camsTurn(1, hp(ich)); meMid(L, GEST.hands_head, 'scared'); TR.CAM.yaw.rotation.y = PI; TINT = `rgba(200,0,0,${.12 + Math.max(0, Math.sin(L.T * 12)) * .1})`;
  cm([TX + 3, 20, -14, TX, 34, 0, 56], [TX + 2, 22, -12, TX, 35, 0, 54], L.k); sh(V(TX, 0, -4), 30); }, [[0, 'siren', .9], [.6, 'alarm', .5]]);
// 56 «und auf jedem Bildschirm war auf einmal nur noch ich.» — zoom lento: las 500 pantallas muestran mi cara asustada
shot(89.06, 'F', 'slow', L => { use('TR'); inside(.4, 0); camPose(L); siren(L, .6); camsTurn(1, hp(ich)); TR.CAM.yaw.rotation.y = PI; TR.panels.forEach((p, i) => { p.material.map = TR.texM[i]; }); TINT = 'rgba(200,0,0,.1)';
  meMid(L, { ...GEST.hands_head }, 'shock'); ich.root.rotation.y = PI; cm([TX + 5, 5.6, -16, TX + 1, 6, -6, 50], [TX + 8, 10, -22, TX + 2, 10, 0, 72], L.k, easeIn); sh(V(TX, 0, -6), 30); }, [[0, 'glitch', .6], [.1, 'tv_static', .5], [.4, 'siren', .5]]);
// 57 «Neben der Kamera leuchtete ein roter Knopf:» — giro la cabeza: un botón rojo que brilla en su pedestal
shot(91.74, 'W', null, L => { use('TR'); inside(.4, 0); camPose(L); siren(L, .6); camsTurn(1, hp(ich)); TR.panels.forEach((p, i) => { p.material.map = TR.texM[i]; }); TR.bt.material.emissiveIntensity = .6 + Math.sin(L.T * 6) * .4; TINT = 'rgba(200,0,0,.08)';
  meMid(L, { headY: -.9, aRx: 1.3, aRe: .2, twist: -.2 }, 'determined'); const b = wpos(TR.BTN); cm([TX - 5, 6, -15, b.x - 2, 4, b.z, 52], [TX - 4, 6, -14, b.x - 1, 4.4, b.z, 50], L.k); sh(V(TX + 4, 0, -6), 25); }, [[0, 'siren', .4], [.4, 'hum_low', .5], [1.2, 'ding_reveal', .5]]);
// 58 (sigue) — el botón de cerca, latiendo
shot(93.14, 'Z', null, L => { use('TR'); inside(.4, 0); camPose(L); siren(L, .5); TR.bt.material.emissiveIntensity = .7 + Math.sin(L.T * 8) * .5; TR.panels.forEach((p, i) => { p.material.map = TR.texM[i]; }); const b = wpos(TR.BTN), a = TR.BTN.rotation.y, f = V(Math.sin(a), 0, Math.cos(a));
  cm([b.x + f.x * 9, 7.4, b.z + f.z * 9, b.x, 4, b.z, 46], [b.x + f.x * 7.4, 7.2, b.z + f.z * 7.4, b.x, 4.2, b.z, 44], L.k); sh(b, 15); }, [[0, 'heartbeat', .6], [.5, 'heartbeat', .5]]);
// 59 «ALLES LÖSCHEN.» — golpe de zoom al rótulo
shot(94.12, 'C', null, L => { use('TR'); inside(.4, 0); siren(L, .5); TR.bt.material.emissiveIntensity = 1.1; TR.panels.forEach((p, i) => { p.material.map = TR.texM[i]; }); const b = wpos(TR.BTN), a = TR.BTN.rotation.y, f = V(Math.sin(a), 0, Math.cos(a)); const k = easeOut(clamp(L.lt / .2));
  cm([b.x + f.x * 8, 4.8, b.z + f.z * 8, b.x, 3.8, b.z, 46], [b.x + f.x * 5.6, 4.2, b.z + f.z * 5.6, b.x, 3.8, b.z, 42], k); sh(b, 15); }, [[0, 'impact', .8], [.1, 'braam_short', .5]]);
// 60 «Ich bin hingerannt und habe draufgehauen.» — corro hacia el botón y lo aporreo: destello, todas las pantallas se apagan
shot(95.15, 'F', null, L => { use('TR'); inside(.4, 0); camPose(L); const hit = 96.25, after = L.T > hit; siren(L, after ? 0 : .6); TR.panels.forEach((p, i) => { p.material.map = after ? TR.texO[i] : TR.texM[i]; });
  const b = wpos(TR.BTN), a = TR.BTN.rotation.y, f = V(Math.sin(a), 0, Math.cos(a)), st = V(b.x + f.x * 12, 0, b.z + f.z * 12), en = V(b.x + f.x * 2.6, 0, b.z + f.z * 2.6); const k = clamp(L.lt / 1.0);
  const p = st.clone().lerp(en, easeOut(k)); put(ich, p.x, 0, p.z, a + PI); if (k < 1) applyPose(ich, runPose(L.T * 1.6)); else actuar(ich, L.lt - 1.0, [[0, { aRx: 2.9, aRe: .3, lean: .1 }], [.08, { aRx: .9, aRe: .1, lean: .45, crouch: .2, headX: .3 }, { dur: .1 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined', mouth: after ? 'scream' : 'grimace' });
  TR.cap.position.y = after ? 4.4 : 4.6; if (after) { grade.uniforms.flash.value = Math.max(0, .9 - (L.T - hit) * 3); TR.L.intensity = 60; } cm([b.x + f.x * 6 + 6, 6, b.z + f.z * 6 - 2, b.x + f.x * 3, 4, b.z + f.z * 3, 54], [b.x + f.x * 5 + 5, 5.6, b.z + f.z * 5 - 1.6, b.x + f.x * 2, 4, b.z + f.z * 2, 50], L.k); sh(b, 20); },
  [[0, 'steps_run', .6], [.5, 'steps_run', .5], [1.1, 'slam', .9], [1.12, 'button', .7], [1.2, 'power_on', .3], [1.3, 'glass_crack', .3]]);
const runPose = T => { const s = Math.sin(T * 14), c = Math.cos(T * 14); return { lLx: s, lRx: -s, lLk: Math.max(0, -c) * 1.4 + .1, lRk: Math.max(0, c) * 1.4 + .1, aLx: -s * 1.1, aRx: s * 1.1, aLe: 1.3, aRe: 1.3, lean: .3, hipY: 2.05 + Math.abs(c) * .2 }; };

// ===== 97,1–105,8 s: la mañana, la fiesta =====
const DANCE = (T, i = 0) => { const s = Math.sin(T * 7 + i), c = Math.cos(T * 7 + i); return { aLx: 2.5 + s * .4, aRx: 2.5 - s * .4, aLz: .5, aRz: .5, aLe: .4, aRe: .4, crouch: Math.abs(s) * .18, twist: Math.sin(T * 3.5 + i) * .35, headZ: s * .15, lLx: Math.max(0, s) * .3, lLk: Math.max(0, s) * .5 }; };
// 61 «Am nächsten Morgen:» — amanecer sobre la ciudad
shot(97.11, 'F', null, L => { city(L, 'morning'); bigVid('plain'); ST.big.userData.draw('off2', (c, w, h) => { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); }); cm([30, 50, 40, 0, 14, -70, 54], [26, 46, 34, 0, 14, -70, 52], L.k); sh(V(0, 0, -40), 60); }, [[0, 'rooster', .6], [.3, 'birds', .5]]);
// 62 «keine Lava,» — el pasillo del colegio normal; los alumnos andan tranquilos; yo respiro aliviado
shot(97.77, 'W', null, L => { use('FL'); inside(.9); put(ich, FX, 0, -8, 0); actuar(ich, L.lt, [[0, { lean: -.05, headX: -.15, aLz: .3, aRz: .3 }]], { T: L.T }); cara(ich, L.T, { expr: 'relief', mouth: 'smile' }); [[K[0], -4, -20, 0], [K[5], 4, -26, PI], [er, -2, -34, 0]].forEach(([c, x, z, ry], i) => { caminar(c, L.lt, { x: FX + x, z, ry, speed: 2.2, T: L.T + i }); cara(c, L.T + i, { expr: 'smile' }); });
  cm([FX + 1.4, 5, 5, FX, 3.6, -12, 50], [FX + 1.2, 5, 3.6, FX, 3.6, -12, 48], L.k); sh(V(FX, 0, -12), 30); }, [[0, 'sigh', .5], [.4, 'steps', .4], [.8, 'kids_chatter', .3]]);
// 63 «kein Mammut.» — delante de la casa de la Oma solo quedan las huellas; la Oma se encoge de hombros
shot(99.01, 'C', null, L => { use('NB'); morning(); NB.PRINTS.visible = true; put(oma, NX - 17, 0, 8, .6); actuar(oma, L.lt, [[0, 'shrug']], { T: L.T }); cara(oma, L.T, { expr: 'confused', mouth: 'smile' });
  cm([NX - 11, 6, 22, NX - 17, 2.4, 3, 50], [NX - 11.4, 5.6, 20, NX - 17, 2.4, 3, 48], L.k); sh(V(NX - 15, 0, 4), 25); }, [[0, 'birds', .5], [.3, 'hmm', .4]]);
// 64 «Die ganze Stadt hat auf der Straße getanzt,» — fiesta en la plaza: todos bailan, confeti
shot(99.85, 'S', null, L => { city(L); bigVid('plain'); ST.big.userData.draw('fest', (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ff5a85'); g.addColorStop(1, '#ffd23f'); c.fillStyle = g; c.fillRect(0, 0, w, h); txt(c, 'FREI!', w / 2, h * .45, w * .35, '#fff', '#1a1a1a', 14); });
  const D = [[ich, 0, 8], [K[0], -4, 4], [K[4], 4, 3], [sie, -7, -2], [K[1], 7, -3], [mayor, -2, -6], [FW[0], 3, -8], [lena, -6, -12], [K[6], 6, -13], [kasse, 0, -16], [fahrer, -9, -18], [K[2], 9, -19]];
  D.forEach(([c, x, z], i) => { put(c, x, 0, z, Math.sin(L.T * 2 + i) * .4); actuar(c, L.lt, [[0, DANCE(L.T, i)]], { T: L.T + i, breathe: false }); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }); confetti(V(0, 6, 0), 99.9, L.T);
  cm([0, 4, 26, 0, 3.6, 0, 52], [2, 5, 22, 0, 3.6, 0, 50], L.k); sh(V(0, 0, -4), 40); }, [[0, 'cheer', .7], [.2, 'confetti', .6], [.5, 'party_horn', .5], [1.2, 'firework', .5], [1.8, 'cheer', .5]]);
// 65 «und Oma hat ihre 1.499 Euro zurückbekommen.» — la Oma enseña la tableta: «ERSTATTUNG +1.499 €»
shot(102.13, 'Z', null, L => { city(L); ST.big.userData.draw('fest', () => {}); put(oma, 1, 0, 10, -.2); actuar(oma, L.lt, [[0, { ...SHOW, aLx: 2.6, aLz: .5, aLe: .3 }]], { T: L.T, extra: { aLz: .5 + Math.sin(L.T * 9) * .3 } }); cara(oma, L.T, { expr: 'joy', mouth: 'open_smile', blush: 1 });
  attach(TAB, oma.aR.hand, [0, -.95, .05], [1.65, 0, 0], .8); TAB.userData.draw('refund', (c, w, h) => drawRefund(c, w, h)); badge('num', '+1.499 €', W / 2, H * .17, (L.lt - .3) * 2.5, 1, 1.3);
  const h = hp(oma); cm([h.x + .6, h.y, h.z + 8.4, h.x, h.y - 1.2, h.z, 46], [h.x + .5, h.y, h.z + 7.4, h.x, h.y - 1.2, h.z, 44], L.k); sh(V(1, 0, 10), 20); }, [[0, 'ding_reveal', .6], [.3, 'cash_reg', .6], [1.0, 'laugh_old', .5]]);
// 66 (sigue) — la Oma baila bajo una lluvia de billetes; yo aplaudo a su lado
shot(103.9, 'W', null, L => { city(L); ST.big.userData.draw('fest', () => {}); put(oma, -1.6, 0, 10, .2); actuar(oma, L.lt, [[0, DANCE(L.T, 2)]], { T: L.T, breathe: false }); cara(oma, L.T, { expr: 'joy', mouth: 'open_smile' }); put(ich, 2.6, 0, 9, -.4); actuar(ich, L.lt, [[0, 'cheer']], { T: L.T }); cara(ich, L.T, { expr: 'joy', mouth: 'open_smile' });
  cashRain(V(0, 2, 10), 103.9, L.T); cm([.4, 4.4, 24, .4, 3.4, 9, 48], [.4, 4.2, 22, .4, 3.4, 9, 46], L.k); sh(V(0, 0, 9), 20); }, [[0, 'money_rain', .6], [.5, 'cheer', .4], [1.2, 'coins', .4]]);

// ===== 105,8–121,7 s: el giro final =====
const drawTV = (c, w, h, kind, o = {}) => { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); const vw = h * .5625; c.save(); c.translate((w - vw) / 2, 0); drawVid(c, vw, h, kind, o); c.restore(); };
const bedMe = (L, up = 0, expr = 'shock') => { if (up < .5) { put(ich, ZX + 13, 3.5, -5.6, 0); ich.root.rotation.x = -PI / 2; applyPose(ich, { aLz: .3, aRz: .3 }); cara(ich, L.T, { eyes: 'closed', mouth: 'flat', noBlink: true }); }
  else { sit(ich, ZX + 13, 3.4, -8.6, -.56); applyPose(ich, { ...SIT, lLx: 1.5, lRx: 1.5, lLk: .1, lRk: .1, aLz: .3, aRz: .3, aLx: .3, aRx: .3, ...shiver(L.T, 1) }); cara(ich, L.T, { expr }); } };
const nightRoom = (k = 0) => { use('ZI'); inside(.18, 0); ZI.LMP.intensity = 0; ZI.BLUE.intensity = 70 * k; };
// 67 «Aber in der nächsten Nacht,» — mi cuarto a oscuras; duermo
shot(105.75, 'F', null, L => { nightRoom(0); ZI.tvS.userData.draw('off', (c, w, h) => { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); }); ZI.clk.userData.draw('443', (c, w, h) => drawClock(c, w, h, '4:43')); bedMe(L, 0);
  cm([ZX + 6, 10, 6, ZX + 13, 3.6, -7, 50], [ZX + 6.6, 9.4, 4.6, ZX + 13, 3.6, -7, 48], L.k); sh(V(ZX + 10, 0, -6), 15); }, [[0, 'crickets', .4], [.3, 'snore', .4], [.8, 'clock_tick', .3]]);
// 68 «um 4:44 Uhr,» — el despertador cambia a 4:44
shot(106.83, 'Z', null, L => { nightRoom(0); ZI.clk.userData.draw(L.lt > .3 ? '444' : '443', (c, w, h) => drawClock(c, w, h, L.lt > .3 ? '4:44' : '4:43')); bedMe(L, 0); const q = wpos(ZI.clk);
  cm([q.x + .6, q.y + .6, q.z + 3.6, q.x, q.y, q.z, 40], [q.x + .4, q.y + .5, q.z + 2.8, q.x, q.y, q.z, 36], L.k); sh(q, 10); }, [[0, 'clock_tick', .6], [.3, 'tick', .7], [.6, 'creepy_ting', .5]]);
// 69 «ist mein Fernseher von allein angegangen.» — la tele se enciende sola (nieve y luz azul); me incorporo de golpe
shot(108.13, 'C', null, L => { const on = L.lt > .3; nightRoom(on ? 1 : 0); ZI.tvS.userData.draw(on ? (L.lt < .8 ? 'st' + Math.floor(L.T * 15) : 'nv') : 'off', (c, w, h) => { if (!on) { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); return; } if (L.lt < .8) { const r = RNG(Math.floor(L.T * 15)); for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) { const v = r() * 255 | 0; c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(x, y, 3, 3); } } else drawTV(c, w, h, 'plain', { ui: false }); });
  bedMe(L, L.lt > .9 ? 1 : 0, 'shock'); cm([ZX + 5, 8, 8, ZX + 9, 5, -4, 56], [ZX + 5, 7.6, 7, ZX + 10, 5, -5, 54], L.k); sh(V(ZX + 8, 0, -2), 20); }, [[.3, 'power_on', .6], [.32, 'tv_static', .6], [1.0, 'gasp', .6], [1.5, 'blanket', .4]]);
// 70 «Ein neues Video:» — la tele: «NEUES VIDEO»
shot(110.71, 'Z', null, L => { nightRoom(1); ZI.tvS.userData.draw('neu', (c, w, h) => { drawTV(c, w, h, 'plain', { ui: false }); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff3a5a'; c.beginPath(); c.roundRect(w * .2, h * .35, w * .6, h * .3, 16); c.fill(); txt(c, 'NEUES VIDEO', w / 2, h * .5, h * .12, '#fff'); }); bedMe(L, 1);
  const q = wpos(ZI.tvS); cm([q.x - 1, q.y + .4, q.z - 10, q.x, q.y, q.z, 46], [q.x - .8, q.y + .3, q.z - 8.6, q.x, q.y, q.z, 44], L.k); sh(q, 15); }, [[0, 'notif', .7], [.4, 'creepy_ting', .4]]);
// 71 «In dieser Stadt verschwindet ein Junge, der zu viel wusste.» — zoom lento: en la tele, un chico (yo) se desvanece; yo, aterrado, en la cama
shot(111.51, 'F', 'slow', L => { nightRoom(1); ZI.tvS.userData.draw('j' + Math.round(L.k * 12), (c, w, h) => drawTV(c, w, h, 'junge', { fade: L.k, prog: L.k })); bedMe(L, 1, 'scared');
  const q = wpos(ZI.tvS); cm([ZX + 16.5, 9, -13.5, q.x, q.y - 1, q.z, 54], [ZX + 16, 8.6, -12.4, q.x + 1, q.y - .8, q.z, 44], L.k, easeIn); sh(V(ZX + 8, 0, 0), 25); }, [[0, 'creepy_ting', .5], [1.2, 'heartbeat', .5], [2.2, 'heartbeat', .5]]);
// 72 «Vier Millionen Aufrufe in einer Minute.» — el contador de visitas se dispara hasta 4.000.000
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
shot(114.87, 'C', null, L => { nightRoom(1); const n = Math.round(4000000 * easeOut(clamp(L.lt / 2.2)) / 1000) * 1000; ZI.tvS.userData.draw('v' + n, (c, w, h) => drawTV(c, w, h, 'junge', { fade: 1, views: fmt(n), prog: 1 })); bedMe(L, 1, 'shock');
  const q = wpos(ZI.tvS); cm([q.x - .6, q.y + .2, q.z - 7.6, q.x, q.y - .3, q.z, 46], [q.x - .5, q.y + .2, q.z - 6.8, q.x, q.y - .3, q.z, 44], L.k); badge('num', fmt(n), W / 2, H * .18, L.lt * 3, 1, 1.2); sh(q, 15); }, [[0, 'notif', .5], [.3, 'tick_down', .5], [.6, 'notif', .4], [1.0, 'notif', .4], [1.4, 'notif', .4], [2.0, 'ding_soft', .4]]);
// 73 «Und hochgeladen hat es ein Kanal namens …» — zoom lento al nombre del canal, que tarda en cargar
shot(117.77, 'Z', 'slow', L => { nightRoom(1); const dots = '.'.repeat(1 + Math.floor(L.lt * 3) % 3); ZI.tvS.userData.draw('ch' + dots, (c, w, h) => { drawTV(c, w, h, 'junge', { fade: 1, ui: false }); chanBox(c, w, h, null, '@' + dots, '#fff'); });
  bedMe(L, 1, 'scared'); const q = wpos(ZI.tvS); cm([q.x, q.y, q.z - 9, q.x, q.y - .5, q.z, 44], [q.x, q.y - .2, q.z - 6.6, q.x, q.y - .6, q.z, 42], L.k, easeIn); sh(q, 15); }, [[0, 'heartbeat', .5], [.8, 'heartbeat', .6]]);
const chanBox = (c, w, h, C, name, col) => { const vw = h * .5625, x0 = (w - vw) / 2; c.fillStyle = 'rgba(0,0,0,.7)'; c.fillRect(x0, h * .28, vw, h * .5); txt(c, 'Hochgeladen von', w / 2, h * .36, vw * .1, '#d8d8e8');
  if (C) faceIcon(c, w / 2, h * .5, vw * .14, C, 'evil'); else { c.fillStyle = '#5a5a66'; c.beginPath(); c.arc(w / 2, h * .5, vw * .14, 0, 7); c.fill(); } txt(c, name, w / 2, h * .67, vw * .17, col, '#000', 6); };
// 74 «Jonas.» — en la tele: el avatar de Jonas, «@JONAS»
shot(120.01, 'C', null, L => { nightRoom(1); ZI.tvS.userData.draw('jonas', (c, w, h) => { drawTV(c, w, h, 'junge', { fade: 1, ui: false }); chanBox(c, w, h, JONAS_C, '@JONAS', '#ffd23f'); });
  bedMe(L, 1, 'shock'); const q = wpos(ZI.tvS); cam([q.x, q.y - .2, q.z - 6.2], [q.x, q.y - .6, q.z], 42); sh(q, 15); }, [[0, 'impact', .8], [.02, 'braam', .9]]);
// 75 (final) — Jonas en su cuarto a oscuras, iluminado por las pantallas, sonríe con malicia
shot(120.65, 'C', null, L => { use('JZ'); inside(.12, 0); JZ.LMP.intensity = 0; JZ.BLUE.intensity = 60; JZ.lapS.userData.draw('jn', (c, w, h) => drawVid(c, w, h, 'junge', { fade: 1 })); sit(jonas, JX - 6, 3.25, -6.4, PI); actuar(jonas, L.lt, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3, headX: -.05 }]], { T: L.T }); cara(jonas, L.T, { expr: 'sus', mouth: 'smirk', eyes: 'squint' });
  onFace(jonas, 6, .1, 1.2, 44, L.k, 4.6); sh(V(JX - 6, 0, -8), 15); }, [[0, 'evil_laugh', .7]]);
// portadas: 0 = yo en la plaza entre la gente con móviles y la pantalla gigante; 1 = la sala de las 500 pantallas con mi cara
COVERS.push({ i: 0, k: .9, cam: () => cam([0, 3.2, 17.5], [0, 2.8, 4], 50), l2: 'SCHAUT JEDER DIESE VIDEOS…' }, { i: 55, k: .6, cam: () => cam([TX - 6, 6, -18.5], [TX + .6, 5.6, -7], 56), l2: '…UND DANN SAH ICH MICH' });
