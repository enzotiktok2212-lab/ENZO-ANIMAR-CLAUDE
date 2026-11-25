// ---------- c: la máquina, el test, la idea, los carteles y la cola (94,67 – 147,47 s) ----------
// Nave (X = 5600): máquina en (0, 0, -12) (plataforma r = 8, cúpula a y = 30, cartel en y = 33, z = -4,2); panel en (11, 0, -2) girado -0,5;
// suelo de hormigón; puertas al fondo (z = 45). Halswerk por fuera (X = 4600): valla en z = 8, fachada en z = -30.
const MX = HAX_, MZ = -12;
const broken = (k = 1) => { HA.RINGS.forEach((r, i) => { r.rotation.y = i === 2 ? .3 * k : i === 4 ? -.22 * k : 0; r.position.y = 5 + i * 3.4 - (i === 2 ? 1.2 * k : 0); }); };
const panelP = () => wpos(HA.P);
// el enchufe en el suelo y el cable hasta él
function plugAt(p) { HA.PLUG.position.copy(p); HA.PLUG.visible = true; HA.PLUG.position.x -= HAX_; HA.setCable(V(6, .5, -3), HA.PLUG.position.clone()); HA.CABLE.visible = true; }
function plugIn(k) { const s = wpos(HA.SOCK).sub(V(HAX_, 0, 0)); const a = V(14.5, .5, 1.5); const p = a.clone().lerp(s, easeInOut(clamp(k))); plugAt(V(HAX_ + p.x, p.y, p.z)); HA.PLUG.lookAt(V(HAX_ + s.x + 3, s.y, s.z + 1)); }
const bulb = (c, k) => { if (k <= 0) return; const h = hp(c).add(V(0, 3.2 * sc_(c), 0)); SPARK.forEach((s, i) => { if (i > 0) return; s.visible = true; s.position.copy(h); s.scale.setScalar(spring(clamp(k)) * 5); }); FX2D.push(cx => { const [x, y, z] = proj(h); if (z >= 1) return; const s = spring(clamp(k)); cx.save(); cx.translate(x, y); cx.scale(s * U, s * U); cx.fillStyle = '#fff27a'; cx.strokeStyle = '#1a1a1a'; cx.lineWidth = 8; cx.beginPath(); cx.arc(0, -20, 60, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = '#9aa0aa'; cx.fillRect(-26, 36, 52, 34); cx.strokeRect(-26, 36, 52, 34); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; cx.beginPath(); cx.moveTo(Math.cos(a) * 82, -20 + Math.sin(a) * 82); cx.lineTo(Math.cos(a) * 110, -20 + Math.sin(a) * 110); cx.stroke(); } cx.restore(); }); };

// 69 «Mitten in der Halle steht eine riesige»: la nave se ilumina; Luca, pequeño, de espaldas ante la máquina gigantesca; la cámara sube
shot(94.67, 'F', null, L => { halleS(L); broken(); const c = put(luca, MX, 0, 18, PI); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  const q = easeInOut(L.k); cam([MX + 3, lerp(6, 14, q), 36], [MX, lerp(10, 18, q), MZ], 50); sh(V(MX, 0, 0), 50); }, [[0, 'power_on', .5], [.1, 'lamp_hum', .4], [.6, 'echo_drip', .3]]);
// 70 «kaputte Maschine.»: de cerca: anillos torcidos, telarañas, polvo y chispas sueltas
shot(96.39, 'C', 'punch', L => { halleS(L); broken(); for (let i = 0; i < 4; i++) { const s = SPARK[i + 1], k = (L.T * 2.2 + i / 4) % 1; s.visible = k < .3; s.position.set(MX + 5.6 + k * 2, 11 + i * 2 - k * 4, MZ + 4 + i); s.scale.setScalar(1 - k * 3); }
  cm([MX + 10, 10, MZ + 22, MX, 13, MZ, 46], [MX + 9, 10.4, MZ + 19, MX, 13.4, MZ, 44], L.k); sh(V(MX, 0, MZ), 30); }, [[0, 'impact', .4], [.1, 'sparks', .5], [.6, 'metal_creak', .4]]);
// 71 «Auf dem Schild steht: Hals-Schrumpf-Maschine.» (zoom lento): la cámara sube hasta el cartel amarillo
shot(97.54, 'S', 'slow', L => { halleS(L); broken(); const q = easeInOut(clamp(L.lt / .8)); cm([MX, lerp(18, 31, q), MZ + 26, MX, lerp(22, 33, q), MZ + 7.8, 48], [MX, 31.5, MZ + 19, MX, 33, MZ + 7.8, 44], easeIn(L.k) * .3 + q * .7); sh(V(MX, 0, MZ), 40); }, [[0, 'whoosh_up', .4], [.6, 'ding_reveal', .5]]);
// 72 «Anscheinend konnte sie seit Jahren niemand reparieren.»: el panel apagado «OFFLINE»; Luca se rasca la cabeza
shot(99.77, 'W', null, L => { halleS(L); broken(); HA.SCR('OFFLINE', '#ff4a4a'); plugAt(V(MX + 14.5, .5, 1.5)); const c = put(luca, MX + 9, 0, 4.6, 2.8); actuar(c, L.lt, [[0, { aRx: 2.6, aRe: 1.8, aRz: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  const p = panelP(); cm([p.x + 2, 9, p.z + 16, p.x - 1, 6, p.z, 44], [p.x + 1.5, 9, p.z + 14, p.x - 1, 6, p.z, 42], L.k); sh(V(MX + 10, 0, 0), 25); }, [[0, 'swipe', .4], [.2, 'hum_low', .3], [.8, 'hmm', .5]]);
// 73 «Doch als ich sie mir genauer anschaue,»: Luca se agacha y mira con atención detrás del panel
shot(102.02, 'Z', null, L => { halleS(L); broken(); HA.SCR('OFFLINE', '#ff4a4a'); plugAt(V(MX + 14.5, .5, 1.5)); const c = put(luca, MX + 12.5, 0, 5, 2.6); actuar(c, L.lt, [[0, { crouch: .5, lean: .5, aRx: .8, aLx: .8, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint' });
  orbit(V(MX + 13, 3.5, 3), lerp(14, 12, L.k), 2.2, .25, 44); sh(V(MX + 12, 0, 2), 20); }, [[0, 'zoom_in', .4], [.4, 'cloth', .3]]);
// 74 «sehe ich den Grund:»: los ojos de Luca se abren de golpe
shot(103.68, 'C', 'punch', L => { halleS(L); broken(); const c = put(luca, MX + 12.5, 0, 5, 2.6); actuar(c, L.lt, [[0, { crouch: .5, lean: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); onFace(c, 6, 0, 0, 40, L.k); sh(V(MX + 12, 0, 5), 15); }, [[0, 'impact_soft', .5], [.05, 'gasp', .5]]);
// 75 «ein lockeres Kabel.»: primer plano del enchufe naranja suelto en el suelo, junto a la toma vacía
shot(104.62, 'I', null, L => { halleS(L); broken(); plugAt(V(MX + 14.5, .5, 1.5)); const s = wpos(HA.SOCK); const m = V(MX + 14, 1, 1.4).lerp(s, .4); cm([m.x + 4, m.y + 2.4, m.z + 5, m.x, m.y, m.z, 40], [m.x + 3.4, m.y + 2, m.z + 4.2, m.x, m.y, m.z, 38], L.k); ring2Dp(V(MX + 14.5, .6, 1.5), (L.lt - .2) * 2.5); sh(V(MX + 14, 0, 1), 12); },
  [[0, 'iris_pop', .4], [.3, 'ding', .5]]);
const ring2Dp = (p, k, r = 120) => FX2D.push(cx => { if (k <= 0) return; const [x, y, z] = proj(p); if (z >= 1) return; cx.save(); cx.strokeStyle = '#ff2a3a'; cx.lineWidth = 14; cx.lineCap = 'round'; cx.beginPath(); cx.arc(x, y, r * U, -1.6, -1.6 + 6.4 * clamp(k)); cx.stroke(); cx.restore(); });
// 76 «Also stecke ich es wieder ein»: Luca enchufa el cable en la toma: ¡chispas!
shot(105.77, 'S', null, L => { halleS(L); broken(); const k = clamp((L.lt - .2) / .7); plugIn(k); const c = put(luca, MX + 15.2, 0, 4.4, -2.4); actuar(c, L.lt, [[0, { crouch: .45, aRx: 1.3, aRe: .3, aRz: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  if (k >= 1) { const s = wpos(HA.SOCK); for (let i = 0; i < 6; i++) { const sp = SPARK[i], t = (L.lt - .9) * 3 + i * .1; sp.visible = t < 1; sp.position.copy(s).add(V(Math.cos(i) * t * 2, Math.sin(i * 2) * t * 1.5 + 1, Math.sin(i) * t * 2)); sp.scale.setScalar(Math.max(0, 1 - t)); } HA.SCR('BOOT…', '#ffd23f'); }
  const s = wpos(HA.SOCK); cm([s.x + 4, s.y + 3, s.z + 8, s.x - .5, s.y - .3, s.z, 42], [s.x + 3.4, s.y + 2.6, s.z + 7, s.x - .5, s.y - .3, s.z, 40], L.k); sh(s.clone().setY(0), 15); }, [[0, 'swipe', .4], [.75, 'click_metal', .6], [.8, 'sparks', .6], [.85, 'zap', .5]]);
// 77 «und drücke auf Start.»: el dedo pulsa el gran botón rojo de START
shot(107.13, 'C', 'punch', L => { halleS(L); broken(); plugIn(1); HA.SCR('START', '#2aff6a'); const c = put(luca, MX + 13.6, 0, 1.8, -2.1); const pr = clamp((L.lt - .15) / .2); actuar(c, L.lt, [[0, { aRx: lerp(1.0, 1.5, pr), aRe: lerp(1.0, .3, pr), aRz: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  HA.BTN.material.emissiveIntensity = L.lt > .3 ? 2.4 : .3; HA.BTN.position.y = 5.6 - (L.lt > .3 && L.lt < .55 ? .2 : 0); const b = wpos(HA.BTN); cm([b.x + 3.2, b.y + 3.2, b.z + 2.4, b.x, b.y, b.z, 40], [b.x + 2.8, b.y + 2.8, b.z + 2, b.x, b.y, b.z, 38], L.k); sh(b.clone().setY(0), 12); }, [[0, 'thump', .4], [.3, 'button_click', .7], [.35, 'beep', .5]]);
// 78 «Erst passiert nichts.»: silencio; plano general, Luca espera mirando la máquina, que sigue apagada
shot(108.13, 'W', null, L => { halleS(L); broken(); plugIn(1); HA.SCR('…', '#2aff6a'); const c = put(luca, MX + 6, 0, 8, -2.6); actuar(c, L.lt, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'flat' }); c.head.rotation.z = Math.sin(L.T * 2) * .1;
  cm([MX + 18, 8, 28, MX + 2, 10, MZ + 4, 50], [MX + 17, 8, 27, MX + 2, 10, MZ + 4, 50], L.k); sh(V(MX, 0, 0), 40); }, [[0, 'silence_tick', .4], [.3, 'crickets', .5]]);
// 79 «Dann erwacht die Maschine plötzlich zum Leben.»: los anillos se encienden de abajo arriba, zumbido y destello; Luca retrocede
shot(109.31, 'F', 'punch', L => { halleS(L); broken(clamp(1 - (L.lt - .2) * 3)); plugIn(1); HA.SCR('ONLINE', '#2aff6a'); const k = clamp((L.lt - .1) / 1.2); HA.on(k, L.T); const c = put(luca, MX + 6, 0, 8, -2.6); actuar(c, L.lt, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  if (k > .9) grade.uniforms.flash.value = Math.max(0, 1 - (k - .9) * 10) * .6; cm([MX + 14, 9, 30, MX, 15, MZ, 52], [MX + 10, 10, 26, MX, 16, MZ, 50], L.k); sh(V(MX, 0, 0), 40); }, [[0, 'power_on', .7], [.2, 'machine_hum', .6], [.5, 'hum_glow', .5], [1.3, 'magic_hit', .5]]);
// 80 «Ich weiß sofort, wen ich als Erstes hier reinstelle.» (zoom lento): Luca se frota las manos con una sonrisa pícara ante la máquina encendida
shot(111.19, null, 'slow', L => { halleS(L); HA.on(1, L.T); plugIn(1); const c = put(luca, MX + 4, 0, 6, .3); actuar(c, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.5, aRz: -.5, aLe: 1.4 + Math.sin(L.T * 12) * .2, aRe: 1.4 - Math.sin(L.T * 12) * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'grin', eyes: 'squint' });
  onFace(c, lerp(10, 6.5, easeIn(L.k)), .4, -1.4, 42); sh(V(MX + 4, 0, 6), 25); }, [[0, 'hum_glow', .4], [.6, 'chuckle', .5]]);
// 81 «Aber zuerst brauche ich einen Test.»: Luca se gira hacia la puerta pensativo; en la pantalla: «TEST?»
shot(113.84, 'W', null, L => { halleS(L); HA.on(1, L.T); plugIn(1); HA.SCR('TEST?', '#ffd23f'); const c = put(luca, MX + 9, 0, 4, -.4); actuar(c, L.lt, [[0, 'think']], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  const p = panelP(); cm([p.x - 6, 8, p.z + 16, p.x - 2, 6.5, p.z + 1, 46], [p.x - 5, 8, p.z + 14, p.x - 2, 6.5, p.z + 1, 44], L.k); sh(V(MX + 9, 0, 2), 25); }, [[0, 'swipe', .4], [.3, 'hmm', .5], [.7, 'beep', .4]]);
// 82 «Ich teste sie an einem Arbeiter»: entra un obrero con casco cuyo cuello larguísimo va doblado bajo el techo
shot(115.75, 'S', null, L => { halleS(L); HA.on(1, L.T); const a = put(ARB[0], MX + 4, 0, lerp(34, 14, easeOut(clamp(L.lt / 1.3))), PI + .2); neck(a, 34, L.T, { bend: 1.55, sway: .02 }); actuar(a, L.lt, [[0, walkP(L.T, 1)]], { T: L.T }); cara(a, L.T, { expr: 'happy', mouth: 'smile' });
  const c = put(luca, MX + 10, 0, 6, -.9); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  cm([MX + 22, 12, 30, MX + 4, 16, 14, 56], [MX + 20, 13, 26, MX + 4, 17, 12, 56], L.k); sh(V(MX + 4, 0, 18), 40); }, [[0, 'door_open', .4], [.2, 'steps_heavy', .5], [.8, 'laugh_m', .4]]);
// 83 «mit einem lächerlich langen Hals.»: el obrero sobre la plataforma: la cámara sube por su cuello, que atraviesa todos los anillos hasta la cúpula
shot(117.25, 'Z', null, L => { halleS(L); HA.on(1, L.T); const a = put(ARB[0], MX, 2.3, MZ, .2); neck(a, 25, L.T, { sway: .02 }); actuar(a, L.lt, [[0, 'idle']], { T: L.T }); cara(a, L.T, { expr: 'happy', mouth: 'smile' });
  const q = easeInOut(L.k); cam([MX + 6, lerp(6, 28, q), MZ + 20], [MX, lerp(8, 30, q), MZ], 46); badge('red', 'LÄCHERLICH LANG', W / 2, H * .16, (L.lt - .4) * 4, 1, .75); sh(V(MX, 0, MZ), 30); }, [[0, 'whoosh_up', .5], [.4, 'stretch_creak', .5], [.8, 'laugh_kid', .3]]);
// 84 «Ein greller Laser schießt heraus,»: ¡zas! el láser blanco-azul baja por el centro, los anillos giran y todo destella
shot(118.63, 'F', 'punch', L => { halleS(L); HA.on(1, L.T * 2); const a = put(ARB[0], MX, 2.3, MZ, .2); neck(a, 25, L.T, { sway: .04 }); actuar(a, L.lt, [[0, 'shock']], { T: L.T }); cara(a, L.T, { expr: 'shock', mouth: 'o', eyes: 'closed' });
  const k = clamp(L.lt / .2); HA.LASER.material.opacity = k * (.75 + Math.sin(L.T * 40) * .2); HA.LASER.scale.set(1 + Math.sin(L.T * 30) * .3, 1, 1 + Math.sin(L.T * 30) * .3); HA.GLOW.intensity = 260; grade.uniforms.flash.value = Math.max(0, .5 - L.lt);
  for (let i = 0; i < 16; i++) { const s = SPARK[i], t = (L.T * 1.5 + i / 16) % 1, ang = i * 2.4; s.visible = true; s.position.set(MX + Math.cos(ang) * (2 + t * 6), 3 + (i % 8) * 3.4, MZ + Math.sin(ang) * (2 + t * 6)); s.scale.setScalar((1 - t) * 1.4); }
  cm([MX + 9, 14, MZ + 24, MX, 15, MZ, 52], [MX + 7, 15, MZ + 21, MX, 15, MZ, 52], L.k); sh(V(MX, 0, MZ), 30); }, [[0, 'zap', .7], [.05, 'laser', .6], [.1, 'xray', .5], [.6, 'machine_shake', .5]]);
// 85 «und sein Hals schrumpft sofort auf normale Größe.»: el cuello se recoge de golpe hasta tamaño normal; el obrero se toca el cuello, feliz; «NORMAL!»
shot(120.48, 'C', null, L => { halleS(L); HA.on(1, L.T); HA.LASER.material.opacity = clamp(.6 - L.lt); const n = lerp(25, 0, easeIn(clamp((L.lt - .05) / .7))); const a = put(ARB[0], MX, 2.3, MZ, .2); neck(a, n, L.T, { sway: .02 });
  actuar(a, L.lt, [[0, 'shock'], [.9, { aRx: 2.2, aRe: 1.8, aRz: -.4, aLx: 2.6, aLz: .5 }, { dur: .25 }]], { T: L.T }); cara(a, L.T, L.lt > .9 ? { expr: 'joy', mouth: 'open_smile', eyes: 'happy' } : { expr: 'shock', mouth: 'o' });
  badge('green', 'NORMAL!', W / 2, H * .2, (L.lt - 1.0) * 4, 1, 1.2); const h = hp(a); cm([MX + 3, h.y + 4, MZ + 18, MX, h.y, MZ, 44], [MX + 3, h.y + 3, MZ + 15, MX, h.y - .5, MZ, 44], easeOut(L.k)); sh(V(MX, 0, MZ), 25); }, [[0, 'stretch', .6], [.05, 'whoosh_down', .6], [.75, 'pop_big', .5], [1.0, 'ding_good', .6], [1.1, 'cheer_small', .4]]);
// 86 «In diesem Moment habe ich eine Idee.»: Luca chasquea los dedos: una bombilla se enciende sobre su cabeza
shot(122.95, 'W', null, L => { halleS(L); HA.on(1, L.T); const c = put(luca, MX + 6, 0, 8, -.4); actuar(c, L.lt, [[0, 'idle'], [.9, { aRx: 2.4, aRe: 1.0, aRz: -.2 }, { dur: .15 }]], { T: L.T }); cara(c, L.T, L.lt > 1 ? { expr: 'happy', mouth: 'open_smile', eyes: 'wide' } : { expr: 'neutral' }); bulb(c, (L.lt - 1.0) * 4);
  onBody(c, 14, .3, .1, 44, L.k); sh(V(MX + 6, 0, 8), 25); }, [[0, 'whoosh_soft', .4], [1.0, 'ding', .7]]);
// 87 «Eine Idee, die alles verändert.» (zoom lento): sonrisa decidida de Luca con la máquina brillando detrás
shot(124.8, null, 'slow', L => { halleS(L); HA.on(1, L.T); const c = put(luca, MX + 6, 0, 8, -.4); actuar(c, L.lt, [[0, 'fists']], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grin' }); onFace(c, lerp(10, 6.5, easeIn(L.k)), .3, -1.4, 42); sh(V(MX + 6, 0, 8), 25); }, [[0, 'music_swell', .4]]);
// 88 «Denn in dieser Stadt lügen alle.»: la plaza: cuellos larguísimos por todas partes y bocadillos «NEIN!» por todos lados
shot(126.67, 'F', null, L => { town(L); crowdAt(L, 0, -10, 22, 5, 30, 88, { mode: i => ['talk', 'cross', 'point', 'idle'][i % 4], from: 0, neck: i => 8 + (i * 13) % 34, gap: .7 });
  [[.18, .3, .1], [.78, .26, .3], [.5, .14, .5], [.28, .44, .7], [.72, .46, .9], [.55, .34, 1.2]].forEach(([x, y, t]) => badge('red', 'NEIN!', W * x, H * y, (L.lt - t) * 5, 1, .7));
  cm([0, 16, 40, 0, 20, -14, 56], [0, 17, 34, 0, 21, -14, 56], L.k); sh(V(0, 0, -10), 60); }, [[0, 'flash', .3], [.1, 'shout_crowd', .4], [.5, 'stretch_creak', .4], [1.0, 'stretch', .4]]);
// 89 «Und jeder will seinen Hals zurück.»: dos cuellos enredados, gente triste suspirando con el cuello doblado
shot(128.6, 'S', null, L => { town(L); [[-3, 0, 1.1, 1.2], [3, 0, -1.1, 1.2]].forEach(([x, z, r, b], i) => { const c = put(CR[30 + i], x, 0, z, r); neck(c, 16, L.T, { bend: b, sway: .02 }); cara(c, L.T, { expr: 'sad', mouth: 'flat' }); actuar(c, L.lt, [[0, 'slump']], { T: L.T }); });
  crowdAt(L, 0, -6, 8, 8, 18, 89, { mode: 'idle', expr: 'sad', from: 0, neck: i => [20, 30, 14, 26, 18, 34, 22, 12][i] });
  cm([0, 9, 24, 0, 10, 0, 50], [0, 9.5, 21, 0, 10.5, 0, 48], L.k); sh(V(0, 0, 0), 30); }, [[0, 'swipe', .4], [.2, 'sigh', .5], [.8, 'groan', .4]]);
// 90 «Also hänge ich am nächsten Morgen in der ganzen Stadt»: por la mañana, Luca pega su cartel en la columna de anuncios con una brocha
shot(130.26, 'W', null, L => { town(L); show(LITF, 6, 0, -4, -.6); const c = put(luca, 2.6, 0, 1, 2.4); attach(BROOM, c.aR.hand, [0, -.4, .3], [1.2 + Math.sin(L.T * 10) * .3, 0, 0], .5); actuar(c, L.lt, [[0, { aRx: 2.0 + Math.sin(L.T * 10) * .3, aRe: .4, aLx: 1.4, aLe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  crowdAt(L, 0, -4, 5, 10, 18, 90, { mode: 'walk', from: 0, neck: i => [12, 20, 8, 26, 16][i], speed: 1.5 });
  cm([12, 7, 18, 5, 7, -3, 46], [11, 7, 15.5, 5, 7, -3, 44], L.k); sh(V(5, 0, -2), 25); }, [[0, 'birds_morning', .4], [.2, 'brush', .5], [.8, 'paper', .4]]);
// 91 «Plakate auf.»: carteles amarillos en todas las fachadas y farolas; la cámara barre la calle
shot(132.44, 'R', null, L => { town(L); POSTERS.forEach((p, i) => { show(p, i % 2 ? 42.8 : -42.8, 6, -30 + i * 14, i % 2 ? -PI / 2 : PI / 2); }); show(LITF, 6, 0, -4, -.6);
  crowdAt(L, 0, -10, 8, 6, 22, 91, { mode: 'point', from: 0, neck: i => [10, 18, 6, 24, 14, 28, 9, 20][i], face: V(-42, 6, -16) });
  const a = lerp(-.6, .6, easeInOut(L.k)); cam([0, 8, 20], [Math.sin(a) * 40, 7, 20 - Math.cos(a) * 40], 50); sh(V(0, 0, -10), 50); }, [[0, 'whirl', .4], [.2, 'paper_slap', .5], [.5, 'paper_slap', .5]]);
// 92 «„Hol dir deinen normalen Hals zurück.“»: la gran valla publicitaria en la plaza; los vecinos de cuello largo la leen
shot(133.38, 'Z', null, L => { town(L); show(BILLB, 0, 0, -28, 0); crowdAt(L, 0, -12, 8, 6, 14, 92, { mode: i => i % 2 ? 'point' : 'shock', from: 0, face: V(0, 14, -28), neck: i => [16, 24, 10, 30, 20, 14, 26, 8][i], gap: 1.2 });
  cm([0, 10, 18, 0, 15, -28, 50], [0, 11, 12, 0, 15.6, -28, 48], L.k); sh(V(0, 0, -20), 40); DOF = 0; }, [[0, 'zoom_in', .4], [.2, 'crowd_murmur', .4]]);
// 93 «Nur 999 Euro.»: ¡pum! el precio salta de la valla: «999 €»; lluvia de monedas
shot(135.24, 'C', 'punch', L => { town(L); show(BILLB, 0, 0, -28, 0); crowdAt(L, 0, -12, 8, 6, 14, 92, { mode: 'cheer', from: 0, face: V(0, 14, -28), neck: i => [16, 24, 10, 30, 20, 14, 26, 8][i], gap: 1.2 }); coins(V(0, 12, -18), L.t0, L.T, 24);
  badge('gold', 'NUR 999 €', W / 2, H * .3, L.lt * 5, 1, 1.4); cm([0, 13, 4, 0, 16, -28, 46], [0, 13, 2, 0, 16, -28, 44], L.k); sh(V(0, 0, -20), 40); DOF = 0; }, [[0, 'cash_reg', .7], [.1, 'coins', .5], [.3, 'crowd_cheer', .4]]);
// 94 «Nach wenigen Minuten»: la gente corre hacia la fábrica; cronómetro «5 MIN»
shot(136.8, 'W', null, L => { fabrikS(L); FA.GATE.children.forEach(d => { if (d.name === 'door-1') d.rotation.y = -1.3; if (d.name === 'door1') d.rotation.y = 1.3; }); crowdAt(L, FAX_, 30, 16, 4, 24, 94, { mode: 'run', from: 0, ry: PI, jit: .15, neck: i => 8 + (i * 7) % 26, speed: 6 });
  badge('big', '⏱ 5 MIN', W / 2, H * .16, L.lt * 4, 1, 1); cm([FAX_ + 14, 10, 60, FAX_, 10, 10, 50], [FAX_ + 12, 11, 54, FAX_, 10, 8, 50], L.k); sh(V(FAX_, 0, 20), 50); }, [[0, 'crowd_run', .6], [.1, 'clock_fast', .4]]);
// 95 «stehen dreitausend Leute vor meiner Fabrik Schlange.»: desde el aire: una cola larguísima de cuellos que serpentea hasta la puerta; «3.000»
shot(138.19, 'F', null, L => { fabrikS(L); FA.GATE.children.forEach(d => { if (d.name === 'door-1') d.rotation.y = -1.3; if (d.name === 'door1') d.rotation.y = 1.3; }); queue(L, 34, 0);
  badge('gold', '3.000', W / 2, H * .17, (L.lt - .2) * 4, 1, 1.5); const q = easeInOut(L.k); cm([FAX_ + 40, 60, 110, FAX_ + 4, 8, 30, 50], [FAX_ + 34, 54, 98, FAX_ + 4, 8, 26, 50], q); sh(V(FAX_, 0, 40), 90); }, [[0, 'flash', .3], [.1, 'crowd_murmur', .5], [.4, 'counter_fast', .5], [1.2, 'ding', .4]]);
// cola: personas en zigzag desde la puerta (z = 10) hacia +z
function queue(L, n, from = 0, o = {}) { POST.push(() => { const list = CR.filter(c => !c.root.visible).slice(from, from + n); list.forEach((c, i) => { const row = Math.floor(i / 6), j = i % 6, dir = row % 2 ? -1 : 1; const x = FAX_ + dir * (j - 2.5) * 4.4 + (row % 2 ? 2 : 0), z = 14 + row * 6.5;
  put(c, x, 0, z, PI + (j % 2 ? .2 : -.2)); neck(c, 8 + (i * 11) % 30, L.T, { bend: ((i % 3) - 1) * .1 }); actuar(c, L.lt, [[0, 'idle']], { T: L.T + i }); cara(c, L.T + i, { expr: ['sad', 'neutral', 'happy'][i % 3] }); }); }); }
// 96 «Mein Nachbar.»: Herr Vogt en la cola, con su cuello de diez metros, sonríe avergonzado
shot(140.82, 'C', null, L => { fabrikS(L); const v = put(vogt, FAX_ - 2, 0, 20, PI - .4); neck(v, 26, L.T, { bend: .15 }); actuar(v, L.lt, [[0, 'shrug']], { T: L.T }); cara(v, L.T, { expr: 'happy', mouth: 'grimace' }); queue(L, 18, 0);
  tall(v, 34, -.5, .08, 52, .62); sh(V(FAX_, 0, 20), 30); }, [[0, 'thump', .4], [.2, 'chuckle_m', .4]]);
// 97 «Timo.»: Timo, con su cuello de veinte metros, saluda desde lo alto
shot(141.88, 'W', null, L => { fabrikS(L); const t = put(timo, FAX_ + 2, 0, 26, PI + .3); neck(t, 60, L.T, { bend: .05 }); actuar(t, L.lt, [[0, 'wave']], { T: L.T }); cara(t, L.T, { expr: 'sad', mouth: 'grimace' }); queue(L, 18, 0);
  const h = hp(t); cm([FAX_ - 14, h.y - 6, 48, FAX_ + 2, h.y - 4, 26, 48], [FAX_ - 13, h.y - 5, 46, FAX_ + 2, h.y - 3.4, 26, 48], L.k); sh(V(FAX_, 0, 26), 30); }, [[0, 'whoosh', .4]]);
// 98 «Sogar die Mamas.»: tres mamás con los brazos cruzados y cuellos dobladísimos, en la cola
shot(142.45, 'S', null, L => { fabrikS(L); const m = put(mama, FAX_, 0, 22, PI); neck(m, 30, L.T, { bend: .45 }); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'flat' });
  [[-5, 24], [5, 23]].forEach(([x, z], i) => { const c = put(CR[2 + i * 2], FAX_ + x, 0, z, PI + (i ? -.3 : .3)); neck(c, [24, 34][i], L.T, { bend: [.6, .3][i] }); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); cara(c, L.T, { expr: 'angry' }); });
  cm([FAX_, 12, 52, FAX_, 18, 22, 54], [FAX_, 12.5, 48, FAX_, 18.5, 22, 54], L.k); sh(V(FAX_, 0, 22), 35); }, [[0, 'swipe', .4], [.2, 'tsk', .5]]);
// 99 «Und dann kommt der Bürgermeister,»: en la plaza, la gente se aparta: llega el alcalde con chistera y cadena dorada; su cuello sube fuera de cuadro
shot(143.81, 'W', null, L => { town(L); const b = put(bm, 0, 0, lerp(0, 6, L.k), 0); actuar(b, L.lt, [[0, walkP(L.T * .7, 0)]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'smile' }); neck(b, 80, L.T, { sway: .02 });
  crowdAt(L, 0, 4, 10, 8, 18, 99, { mode: i => i % 2 ? 'clap' : 'shock', from: 0, face: V(0, 6, 4), neck: i => [10, 18, 6, 24, 14, 8, 20, 12, 16, 22][i] });
  cm([0, 5, 30, 0, 9, 0, 54], [0, 6, 27, 0, 12, 0, 56], L.k); sh(V(0, 0, 4), 30); }, [[0, 'fanfare', .5], [.2, 'steps_heavy', .4], [.5, 'crowd_ohh', .4]]);
// 100 «mit einem Hals höher als der Kirchturm.»: junto a la torre de la iglesia, la cabeza del alcalde (con chistera) asoma por encima de la cruz
shot(145.45, 'Z', null, L => { town(L); const b = put(bm, 14, 0, -104, .3); neck(b, 80, L.T, { sway: .01 }); cara(b, L.T, { expr: 'smug', mouth: 'grin' }); actuar(b, L.lt, [[0, 'idle']], { T: L.T }); const h = hp(b);
  const q = easeInOut(L.k); cam([30, lerp(30, h.y - 6, q), -40], [8, lerp(40, h.y - 4, q), -110], 50); badge('tag', 'BÜRGERMEISTER', W / 2, H * .62, (L.lt - .8) * 4, 1, .9); sh(V(8, 0, -110), 60); }, [[0, 'whoosh_up', .5], [.4, 'church_bell', .6], [1.2, 'laugh_deep', .4]]);
