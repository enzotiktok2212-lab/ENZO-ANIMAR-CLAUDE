// ---------- c: yo, el estómago pequeño y el goldener Krug (77,9 – 103,7 s) ----------
// Felix en la plaza (0, 0, 9). Cervecería abandonada (ABX): puerta tapiada en (0, -20,4). Sótano (KEX): balda con el Krug en (0, 5.4, -18.3), barriles a x = ±13.
// barrigas para los grandullones de la comparación
const BELLY = [0, 1].map(() => { const b = P_(sphere(1.4, mat(0xf4f4f0, { roughness: .8 }), null, 0, 0, 0, 18, 12)); b.scale.set(1, .9, .8); return b; });
// chorro de cerveza (botella → Krug)
const STREAM = P_(cyl(.09, .07, 1, mat(0xf6a81c, { emissive: 0x8a4a00, emissiveIntensity: .5, roughness: .1, transparent: true, opacity: .9 }), 8, null));
function streamTo(a, b) { STREAM.visible = true; const d = b.clone().sub(a); STREAM.position.copy(a).addScaledVector(d, .5); STREAM.scale.set(1, d.length(), 1); STREAM.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }
// Felix con la linterna: el foco sale de la mano izquierda en la dirección en la que mira
function linterna(c, target) { attach(FLASH, c.aL.hand, [0, -.7, .3], [PI / 2, 0, 0], 1); const p = wpos(FLASH); FLASHL.intensity = 160; FLASHL.position.copy(p); FLASHL.target.position.copy(target); FLASHL.color.setRGB(1, .94, .78); }
const KGP = V(KEX, 5.4, -18.3);
// placa de rayos X (2D) con el estómago diminuto
function xray(L, k) { FX2D.push(c => { if (k <= 0) return; const s = spring(clamp(k) * 1.3), x = W * .7, y = H * .36; c.save(); c.translate(x, y); c.scale(s, s); c.rotate(.06); c.fillStyle = '#0a1a2e'; c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.beginPath(); c.roundRect(-190, -250, 380, 500, 26); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(190,230,255,.75)'; c.lineWidth = 10; c.beginPath(); c.roundRect(-70, -220, 140, 140, 40); c.stroke(); c.beginPath(); c.moveTo(0, -80); c.lineTo(0, 170); c.stroke(); for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(0, -40 + i * 28, 110 - i * 4, 14, 0, Math.PI, 0); c.stroke(); }
  const pul = 1 + Math.sin(L.T * 8) * .08; c.fillStyle = '#ff4a6a'; c.beginPath(); c.ellipse(-22, 150, 16 * pul, 11 * pul, -.4, 0, 7); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.beginPath(); c.arc(-22, 150, 44, 0, 7); c.stroke();
  c.fillStyle = '#ffd23f'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.fillText('MAGEN: MINI', 0, 225); c.restore(); }); }

// 65 «Und ich?»: Felix, gorro mostaza y sudadera gris, en medio de la plaza; todos beben a su alrededor y él saluda con timidez
shot(77.94, 'Z', null, L => { town(L); const c = put(felix, 0, 0, 9, 0); actuar(c, L.lt, [[0, 'idle'], [.1, 'wave', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); meterOf(c).userData.set('0 Bier', '0 €');
  crowdAt(L, 0, 9, 10, 6, 14, 71, { mode: i => ['drink', 'prost'][i % 2], gap: 1.1 }); onBody(c, 16, 0, .12, 44, L.k, 13, 0, 4); sh(V(0, 0, 9), 24); }, [[0, 'zoom_in', .4], [.15, 'hey', .4]]);
// 66 «Ich hatte keinen einzigen Cent.»: abre la cartera: vacía; sale volando una polilla. Bierzähler: 0 €
shot(78.54, 'W', null, L => { town(L); const c = put(felix, 0, 0, 9, 0); actuar(c, 0, [[0, { aLx: 1.0, aLe: 1.0, aLz: -.35, aRx: 1.0, aRe: 1.0, aRz: -.35, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' }); meterOf(c).userData.set('0 Bier', '0 €', '#ff4a4a');
  const wp = hp(c).add(V(0, -2.0, 1.6)); show(WALLET, wp.x, wp.y, wp.z, 0, 1); WALLET.rotation.x = .9; const t = clamp((L.lt - .3) / 1.2); show(MOTH, wp.x + t * 3, wp.y + .5 + t * 5 + Math.sin(L.T * 10) * .3, wp.z + t * 2, 0, 1); MOTH.children.forEach(w => { if (w.name) w.rotation.y = (w.name === 'w1' ? 1 : -1) * Math.sin(L.T * 30) * .9; });
  badge('red', '0,00 €', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, 1.1); onFace(c, 7.6, .4, -.3, 40, L.k, 6.6); sh(V(0, 0, 9), 14); }, [[0, 'wallet', .5], [.3, 'moth', .6], [.6, 'sad_trombone', .4]]);
// 67 «Denn ich habe den kleinsten Magen»: radiografía junto a Felix: el estómago es diminuto; él se toca la barriga avergonzado
shot(80.24, 'S', null, L => { town(L, { bg: false }); const c = put(felix, -6, 0, 6, .3); actuar(c, 0, [[0, { aRx: .8, aRe: 1.6, aRz: -.4, aLx: .6, aLe: 1.5, aLz: -.4, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'frown' }); xray(L, clamp((L.lt - .1) / .25));
  onBody(c, 15, .15, .1, 44, L.k, 13, .2, 4.4); sh(V(-6, 0, 6), 18); }, [[0, 'xray', .6], [.3, 'heartbeat', .4]]);
// 68 «der ganzen Stadt.»: Felix, flaquito, entre dos grandullones con barrigas enormes que se ríen
shot(81.56, 'F', null, L => { town(L, { bg: false }); const c = put(felix, 0, 0, 6, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, lean: -.04, headY: Math.sin(L.T * 3) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'frown' });
  [TR[0], TR[2]].forEach((g, i) => { put(g, (i ? 1 : -1) * 4.6, 0, 6.4, (i ? -1 : 1) * .3); g.root.scale.setScalar(1.18); attach(BELLY[i], g.spine, [0, .8, .55], [0, 0, 0], 1); holdOnly(g, L, { pose: { aLx: .4, aLz: .3, lean: -.12 } }); laughF(g, L.T + i); });
  orbit(V(0, 5.4, 6), lerp(25, 22, L.k), 0, .1, 46); sh(V(0, 0, 6), 18); }, [[0, 'flash', .4], [.1, 'laugh_m', .5], [.4, 'boing', .4]]);
// 69 «Während die anderen eine Maß»: en la mesa, los demás se beben una Maß tras otra; las vacías se apilan
shot(82.42, 'W', null, L => { town(L); for (let i = 0; i < 4; i++) { const c = sit2(CR[30 + i], -18.8 + i * 3.2 + (i > 1 ? .8 : 0), 21.7, 0); drink(c, L, L.t0 - (i * .3) % .8, .55, { sit: true, pose: SITP, bg: true, expr: 'happy', up: .15, dn: .15 }); }
  for (let i = 0; i < 6; i++) { const m = KRUG[i]; show(m, -9.6 + (i % 2) * 1.1, 4.15 + Math.floor(i / 2) * 1.32, 24.6, 0, 1); m.userData.level(0, 0); }
  orbit(V(-14, 5, 21.7), lerp(17, 15, L.k), -.4, .16, 46); sh(V(-14, 0, 22), 18); }, [[0, 'gulp', .5], [.4, 'glass_down', .5], [.8, 'gulp', .4], [1.2, 'glass_down', .5]]);
// 70 «nach der anderen leerten,»: Resi deja en la mesa jarras vacías una tras otra: ¡clonc, clonc, clonc!
shot(84.09, 'C', null, L => { town(L); const c = put(resi, 14, 0, 19.4, 0); const j = Math.floor(L.lt / .25); actuar(c, 0, [[0, { aRx: 1.0 + Math.abs(Math.sin(L.lt / .25 * PI)) * .5, aRe: .8, aLx: .6, lean: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'joy' });
  for (let i = 0; i <= Math.min(j, 6); i++) { const m = KRUG[i]; show(m, 10.5 + i * 1.2, 4.15, 23, 0, 1); m.userData.level(0, 0); } 
  cm([14, 8.5, 32, 13, 5, 23, 40], [14, 8, 30, 13, 5, 23, 38], L.k); sh(V(14, 0, 23), 16); }, [[0, 'glass_down', .6], [.25, 'glass_down', .6], [.5, 'glass_down', .6], [.75, 'glass_down', .6]]);
// 71 «schaffte ich ein einziges Bier.»: Felix sentado bebe su única Maß con esfuerzo, sudando
shot(85.13, 'S', null, L => { town(L); const c = sit2(felix, 14, 21.7, 0); drink(c, L, L.t0 + .1, 1.2, { sit: true, pose: SITP, meter: true, expr: 'worried', eyesD: 'squint', l1: .0 }); sweat(c, L.T, 2); meterOf(c).userData.set('0 Bier', '0 €');
  tableFolk(L, 1, -1, 2, 'sitdrink', 6, { dx: 6 }); dcam(c, L.k, 11, -1.0, 4.2); sh(V(14, 0, 22), 16); }, [[0, 'swipe', .4], [.1, 'gulp_long', .5], [.8, 'cough', .3]]);
// 72 «20 Euro.»: un único billete de 20 cae girando; él lo mira decepcionado
shot(86.82, 'Z', 'punch', L => { town(L); const c = sit2(felix, 14, 21.7, 0); holdOnly(c, L, { sit: true, pose: { ...SITP, headX: .1 } }); mugOf(c).userData.level(0, 0); cara(c, L.T, { expr: 'bored', mouth: 'flat' }); meterOf(c).userData.set('1 Bier', '20 €'); setHUD(1);
  billDrop(c, L.t0, L.T, 1); badge('green', '+20 €', W / 2, H * .2, clamp(L.lt / .2), 1, .9); onFace(c, 6.6, .3, .4, 40, L.k, 5.8); sh(V(14, 0, 22), 14); }, [[0, 'cash', .5], [.3, 'paper', .4], [.6, 'sad_trombone', .3]]);
// 73 «Dann kam der Schluckauf.»: ¡HICKS! Felix da un respingo con cada hipo; los de la mesa se ríen
shot(87.84, 'R', null, L => { town(L); const ts = [L.t0 + .15, L.t0 + .75, L.t0 + 1.3]; const j = hipPose(L.T, ts); const c = put(felix, 14, j * .7, 17, 0); actuar(c, 0, [[0, { aLx: .4 + j, aRx: .4 + j, aLz: .3, aRz: .3, headX: -j * .3, lean: -j * .1 }]], { T: L.T }); cara(c, L.T, { expr: j > .3 ? 'shock' : 'worried', mouth: j > .3 ? 'o' : 'frown' });
  ts.forEach((t, i) => hicks(c, clamp((L.T - t) / .15) * (L.T - t < .5 ? 1 : 0), .9, i % 2 ? -1 : 1)); crowdAt(L, 14, 17, 5, 6, 11, 73, { mode: 'cheer', gap: 1.4 });
  onBody(c, 15, .1, .12, 44, L.k, 12.5, 0, 4); sh(V(14, 0, 20), 18); }, [[.15, 'hiccup', .9], [.75, 'hiccup', .9], [1.3, 'hiccup', .9], [.4, 'laugh_m', .4]]);
// 74 «Bis ich eines Nachts etwas fand.»: de noche, Felix camina solo por la calle con una linterna
shot(89.38, 'B', null, L => { town(L, { night: true, bg: false }); const c = put(felix, -30, 0, 40 - L.lt * 3, PI); actuar(c, 0, [[0, { ...walkP(L.T, 0), aLx: 1.3, aLe: .3 }]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9)) * .1; cara(c, L.T, { expr: 'worried', eyes: 'side_l' }); linterna(c, V(-30, 0, 20 - L.lt * 3));
  orbit(V(-30, 4.4, 40 - L.lt * 3), lerp(18, 15, L.k), PI - .5, .14, 46); sh(V(-30, 0, 36), 24); }, [[0, 'night_amb', .6], [.2, 'steps', .4], [.5, 'owl', .3]]);
// 75 «Im Keller einer verlassenen Brauerei,»: la cervecería abandonada de noche; Felix se cuela entre las tablas de la puerta
shot(91.21, 'W', null, L => { altS(L); const c = put(felix, ABX + lerp(6, 1, easeOut(clamp(L.lt / 1))), 0, -17.8, PI + .5); actuar(c, 0, [[0, { ...walkP(L.T * .7, 0), crouch: .3, lean: .25, aLx: 1.3, aLe: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); linterna(c, V(ABX, 4, -21));
  cm([ABX + 8, 9, 24, ABX, 11, -20, 50], [ABX + 6, 8, 16, ABX, 9, -20, 48], L.k); sh(V(ABX, 0, -16), 36); DOF = 0; }, [[0, 'wind', .5], [.3, 'creak', .6], [.8, 'wood_crack', .4]]);
// 76 «ganz hinten unter Spinnweben:»: en el sótano, el haz de la linterna atraviesa telarañas y barriles; Felix avanza encogido
shot(93.07, 'S', null, L => { kellerS(L); KE.GK.visible = true; const c = put(felix, KEX + 1.5, 0, -2 - L.lt * 2.4, PI); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), crouch: .2, lean: .15, aLx: 1.4, aLe: .3, headY: Math.sin(L.T * 2) * .4 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' }); linterna(c, KGP);
  KE.GK.userData.setGlow(.2); beam(L, V(KEX + 6, 6, -4), L.T); orbit(V(KEX + 1.5, 4.6, -3 - L.lt * 2.4), lerp(13, 11, L.k), PI - .5, .16, 46); sh(V(KEX, 0, -8), 22); }, [[0, 'drip', .5], [.3, 'creak', .4], [.6, 'rat', .3]]);
// 77 «einen goldenen Krug.» (zoom lento): en la última balda, entre botellas polvorientas, el goldener Krug brilla
shot(94.66, 'F', 'slow', L => { kellerS(L); KE.GK.visible = true; KE.GK.userData.setGlow(.35 + Math.sin(L.T * 3) * .15); FLASHL.intensity = 130; FLASHL.position.set(KEX + 2, 7, -6); FLASHL.target.position.copy(KGP);
  confetti(KGP.clone().add(V(0, 1, 0)), L.t0 + .2, L.T, 12, .3); cm([KEX + 1.2, 7, -7, KEX, 6.2, -18.3, 40], [KEX + .4, 6.6, -12.4, KEX, 6.3, -18.3, 34], L.k, easeIn); sh(V(KEX, 0, -16), 14); DOF = 0; }, [[0, 'shimmer', .6], [.3, 'choir', .5]]);
// 78 «Darauf stand:»: Felix lo coge y le quita el polvo con la manga
shot(95.96, 'C', null, L => { kellerS(L); KE.GK.visible = false; const c = put(felix, KEX, 0, -14, 0); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.3, aRz: .1, aLx: 1.3, aLe: 1.2 + Math.sin(L.T * 14) * .2, aLz: -.4, headX: .3 }]], { T: L.T }); attach(GK2, c.aR.hand, [-.86, -.2, -.66], [PI / 2, 0, 0], .78); GK2.userData.setGlow(.3); GK2.userData.fill(0);
  cara(c, L.T, { expr: 'gasp' }); FLASHL.intensity = 130; FLASHL.position.set(KEX + 3, 8, -6); FLASHL.target.position.set(KEX, 5, -14); dust(wpos(GK2), L.t0 + .2, L.T, 8, .4);
  onFace(c, 7, -.2, .8, 40, L.k, 6); sh(V(KEX, 0, -14), 14); }, [[0, 'wipe', .6], [.4, 'wipe', .5]]);
// 79 «„Warnung:»: primer plano de la placa grabada del Krug
shot(96.52, 'Z', null, L => { kellerS(L); show(GK2, KEX, 4, -14, 0, 1); GK2.userData.setGlow(.3); GK2.userData.fill(0); GK2.userData.setLid(0); FLASHL.intensity = 130; FLASHL.position.set(KEX + 2, 8, -8); FLASHL.target.position.set(KEX, 4.7, -14);
  cm([KEX + .3, 5.2, -8.6, KEX, 4.8, -14, 30], [KEX + .2, 5.1, -9.6, KEX, 4.8, -14, 28], L.k); sh(V(KEX, 0, -14), 8); DOF = 0; }, [[0, 'zoom_in', .4], [.1, 'warning', .6]]);
// 80 «Niemals mehr»: la cámara baja por el grabado
shot(97.55, 'S', null, L => { kellerS(L); show(GK2, KEX, 4, -14, 0, 1); GK2.userData.setGlow(.3); GK2.userData.fill(0); FLASHL.intensity = 130; FLASHL.position.set(KEX + 2, 8, -8); FLASHL.target.position.set(KEX, 4.7, -14);
  badge('red', 'NIEMALS MEHR', W / 2, H * .2, clamp(L.lt / .2), 1, 1); cm([KEX - .4, 4.9, -10, KEX, 4.75, -14, 24], [KEX + .4, 4.8, -10, KEX, 4.75, -14, 24], L.k); sh(V(KEX, 0, -14), 8); DOF = 0; }, [[0, 'tense', .5]]);
// 81 «als ein Bier."»: Felix lee y traga saliva
shot(98.39, 'C', 'punch', L => { kellerS(L); KE.GK.visible = false; const c = put(felix, KEX, 0, -14, 0); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.4, aRz: .1, headX: .32 }]], { T: L.T }); attach(GK2, c.aR.hand, [-.86, -.2, -.66], [PI / 2, 0, 0], .78); GK2.userData.setGlow(.3); cara(c, L.T, { expr: 'worried', mouth: 'o' });
  badge('red', 'NUR 1 BIER!', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1); FLASHL.intensity = 130; FLASHL.position.set(KEX + 3, 8, -6); FLASHL.target.position.set(KEX, 5, -14); onFace(c, 5.6, .1, .5, 40, L.k, 5); sh(V(KEX, 0, -14), 12); }, [[0, 'gulp_nervous', .6], [.2, 'thump', .4]]);
// 82 «Also füllte ich ihn natürlich»: sonrisa traviesa; deja el Krug sobre un barril y saca una Weihenstephaner
shot(99.55, 'W', null, L => { kellerS(L); KE.GK.visible = false; const c = put(felix, KEX + 1, 0, -10, -.3); actuar(c, 0, [[0, { aLx: 1.6, aLe: 1.0, aLz: -.2, aRx: .3 }]], { T: L.T }); attach(BW, c.aL.hand, [0, -.7, .3], [-.3, 0, 0], .8); cara(c, L.T, { expr: 'wink' });
  show(GK2, KEX - 2.4, 3.6, -9.4, .3, .9); GK2.userData.setGlow(.3); GK2.userData.fill(0); const f = FASS[0]; show(f, KEX - 2.4, 0, -9.4, 0, .9); FLASHL.intensity = 130; FLASHL.position.set(KEX + 4, 9, -2); FLASHL.target.position.set(KEX, 4, -10);
  onBody(c, 13, -.5, .12, 44, L.k, 11, -.4, 4.4); sh(V(KEX, 0, -10), 14); }, [[0, 'swipe', .4], [.2, 'chuckle_m', .5], [.6, 'bottle_open', .6]]);
// 83 «bis zum Rand.»: vierte la Weihenstephaner en el Krug; la espuma sube hasta el borde
shot(100.77, 'F', null, L => { kellerS(L); const c = put(felix, KEX - .2, 0, -9.6, -PI / 2 + .25); const k = clamp(L.lt / 1.0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.3, aLe: .6, headX: .35, headY: .2 }]], { T: L.T }); attach(BW, c.aL.hand, [0, -.6, .4], [-.3 - k * 1.2, 0, 0], .8); cara(c, L.T, { expr: 'happy', eyes: 'down' });
  show(GK2, KEX - 2.4, 3.6, -9.4, .3, .9); GK2.userData.setGlow(.3); GK2.userData.fill(k); show(FASS[0], KEX - 2.4, 0, -9.4, 0, .9); POST.push(() => { BW.updateMatrixWorld(true); const top = BW.localToWorld(V(0, 2.55, 0)); streamTo(top, V(KEX - 2.4, 3.6 + 1.5 * .9 * k + .2, -9.4)); });
  FLASHL.intensity = 130; FLASHL.position.set(KEX + 3, 9, -3); FLASHL.target.position.set(KEX - 2.4, 4, -9.4); cm([KEX - 1, 6.4, -2.6, KEX - 2.2, 4.8, -9.4, 38], [KEX - 1.2, 6.2, -4, KEX - 2.2, 4.8, -9.4, 36], L.k); sh(V(KEX, 0, -9), 12); }, [[0, 'pour', .8], [.6, 'fizz', .6]]);
// 84 «Mit Weihenstephaner, versteht sich.»: Felix guiña el ojo con la botella junto a la cara, la etiqueta bien visible
shot(101.91, 'R', null, L => { kellerS(L); const c = put(felix, KEX, 0, -9, 0); actuar(c, 0, [[0, { aLx: 2.2, aLz: -.25, aLe: 1.7, headY: .15 }]], { T: L.T }); POST.push(() => { const h = c.aL.hand.localToWorld(V(0, -.6, .6)); show(BW, h.x, h.y - 1.2, h.z, 0, 1.3); BW.rotation.y = Math.atan2(camera.position.x - h.x, camera.position.z - h.z) + PI; }); cara(c, L.T, { expr: 'wink', mouth: 'smirk' });
  FLASHL.intensity = 130; FLASHL.position.set(KEX + 3, 9, -2); FLASHL.target.position.set(KEX, 6, -9); confetti(hp(c).add(V(0, 1, 0)), L.t0, L.T, 16, .35); onFace(c, 6.4, .2, -.5, 40, L.k, 5.6); sh(V(KEX, 0, -9), 12); }, [[0, 'whirl', .4], [.2, 'wink', .5], [.4, 'sparkle', .4]]);
