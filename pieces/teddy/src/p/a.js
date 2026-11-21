// ---------- a: gancho, la regla, los mejores del país, el sorteo, el aula blindada, el gimnasio y Mira (0 – 45,45 s) ----------
const bear = (x, y, z, ry = 0, p = {}, s = 1) => { teddy.root.visible = true; teddy.root.position.set(x, y, z); teddy.root.rotation.set(0, ry, 0); teddy.root.scale.setScalar(s); teddy.pose(p); return teddy; };
const tedM = (T, a, b) => { const w = spoken(a, b).find(w => T >= w[0] && T < w[1]); if (!w) return .12; const k = (T - w[0]) / Math.max(.08, w[1] - w[0]), n = Math.max(1, Math.round((w[1] - w[0]) / .15)); return .25 + .75 * Math.abs(Math.sin(k * Math.PI * n)); };
const SIT = { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 2.0 };
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, extra) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .05, T, extra });
const lie = (ch, x, y, z, ry = 0) => { put(ch, x, y, z, 0); ch.root.rotation.order = 'YXZ'; ch.root.rotation.set(-PI / 2, ry, 0); return ch; };
const gate = k => ST.gate.forEach((w, i) => w.rotation.y = (i ? -1 : 1) * 1.35 * k);
const inHand = (obj, ch, side = 'R', p = [0, -.55, .35], r = [0, 0, 0], s = 1) => attach(obj, ch[side === 'R' ? 'aR' : 'aL'].hand, p, r, s);
const ring = (i, r = 12.4) => { const a = i / 12 * PI * 2; return [GRX + Math.sin(a) * r, Math.cos(a) * r, a + PI]; };
const atPod = (c, i, L, keys = [[0, 'idle']], face = {}) => { const [x, z, ry] = ring(i); put(c, x, 0, z, ry); actuar(c, L.lt, keys, { T: L.T + i }); cara(c, L.T + i, face); return c; };
const sepia = (v = .8) => { grade.uniforms.sepia.value = v; grade.uniforms.vig.value = .7; };
// atrezo propio de esta parte
const ICE = cyl(9, 9, .16, mat(0xd8f2ff, { roughness: .08, metalness: .2 }), 40, scene); const PANCAKE = (() => { const p = sphere(.7, mat(0xf0c060, { roughness: .8 }), scene, 0, 0, 0, 14, 8); p.scale.y = .25; return p; })();
const FIRE = Array.from({ length: 6 }, (_, i) => sphere(.5, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.2 + i * .1, .2), toneMapped: false, transparent: true, opacity: .8 }), scene, 0, 0, 0, 8, 6));
const NOTE2 = textPlane(1.8, 1.3, 180, 130, (c, w, h) => { c.fillStyle = '#fffbe8'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8e8ff'; for (let y = 30; y < h; y += 22) c.fillRect(0, y, w, 2); txt(c, 'Komm in die', w / 2, h * .38, 26, '#2a1a3a'); txt(c, 'TURNHALLE', w / 2, h * .7, 30, '#d8283a'); }); NOTE2.material.side = THREE.DoubleSide; scene.add(NOTE2);
const MEDAL = (() => { const g = new THREE.Group(); scene.add(g); const m = cyl(.6, .6, .12, mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .4 }), 20, g, 0, 0, 0); m.rotation.x = Math.PI / 2; const r = box(.3, 1.4, .05, mat(0xd8283a), .02, g, 0, .9, -.05); return g; })();
const TROPHY = (() => { const g = new THREE.Group(); scene.add(g); const gm = mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }); cyl(.5, .7, .4, gm, 14, g, 0, .2, 0); cyl(.12, .12, .8, gm, 8, g, 0, .8, 0); cyl(.8, .3, 1.2, gm, 16, g, 0, 1.8, 0); return g; })();
PROPS.push(ICE, PANCAKE, ...FIRE, NOTE2, MEDAL, TROPHY);

// 1 «In meiner Welt ist der einzige Weg, die Schule zu verlassen» (golpe de zoom + zoom lento): yo en mi atril del juicio, nervioso; a los lados otros alumnos en los suyos; la cámara se acerca poco a poco
shot(0, 'Z', 'slow', L => { use('GR'); inside(.75, 28); KIDS.forEach((c, i) => { const [x, z, ry] = ring(i); put(c, x, 0, z, ry + (i ? Math.sin(L.T * 1.3 + i) * .4 : 0)); actuar(c, L.lt, [[0, i ? ['cross', 'hug_self', 'think'][i % 3] : { aLx: 1.1, aRx: 1.1, aLe: .5, aRe: .5, lean: .12 }]], { T: L.T + i, extra: i ? {} : shiver(L.T, .8) }); cara(c, L.T + i, i ? { expr: ['worried', 'sus', 'scared'][i % 3] } : { expr: 'scared', eyes: 'wide', mouth: 'grimace' }); });
  sweat(ich, L.T, 2); cm([GRX, 8, -12, GRX, 5.2, 12.4, 50], [GRX, 6.6, 1.5, GRX, 5, 12.4, 46], L.k, easeIn); }, [[0, 'impact', .6], [.2, 'choir', .5], [1.2, 'heartbeat', .5], [2.4, 'whisper', .3]]);
// 2 «einen Mitschüler zu töten und damit davonzukommen»: el anillo visto desde un lado: los alumnos se señalan unos a otros, acusándose
shot(3.19, 'W', 'punch', L => { use('GR'); inside(.75, 28); const tg = [3, 7, 9, 10, 1, 11, 2, 0, 5, 4, 6, 8];
  KIDS.forEach((c, i) => { const [x, z] = ring(i), [tx, tz] = ring(tg[i]); put(c, x, 0, z, Math.atan2(tx - x, tz - z)); actuar(c, L.lt, [[0, 'idle'], [.15 + (i % 4) * .12, i % 3 ? 'point' : 'shock', { dur: .25 }]], { T: L.T + i }); cara(c, L.T + i, { expr: i % 3 ? 'angry' : 'shock', mouth: i % 3 ? 'talk_wide' : 'o' }); });
  cm([GRX + 2, 9, 4, GRX, 4.6, -12.4, 50], [GRX - 2, 8.6, 1, GRX, 4.6, -12.4, 48], L.k); }, [[0, 'impact', .5], [.3, 'shout_m', .4], [.9, 'gasp', .4], [1.6, 'shout_m', .3]]);
// 3 «Und der Direktor ist ein Teddybär»: primer plano del osito en el trono: mitad rosa, mitad gris, ojo de corazón; saluda
shot(5.72, 'C', 'punch', L => { use('GR'); inside(.75, 28); bear(GRX, 6, -24, 0, { sit: 1, aR: 2.5 + Math.sin(L.T * 9) * .3, aRz: .5, aL: .6, mouth: tedM(L.T, 5.7, 7.6) + .2, headZ: Math.sin(L.T * 3) * .12, glow: 2.4 }, 1.3);
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x - .6, h.y + .2, h.z + lerp(14, 11, easeOut(L.k))], [h.x, h.y - 1.6, h.z], 44); }, [[0, 'slam', .5], [.2, 'boing_metal', .4], [1.2, 'evil_laugh', .4]]);
// 4 «Das Verrückte:» yo detrás de los barrotes de la verja, encogiéndome de hombros
shot(7.66, 'W', 'punch', L => { town(); gate(0); const me = put(ich, 0, 0, -25.6, 0); actuar(me, L.lt, [[0, { aLx: 2.0, aRx: 2.0, aLz: .28, aRz: .28, aLe: .55, aRe: .55 }], [.3, 'shrug', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' });
  cam([.6, 5.6, -14], [0, 5, -25.6], 44); sh(V(0, 0, -26)); }, [[0, 'impact', .4], [.2, 'metal_creak', .4]]);
// 5 «Ich bin überhaupt nichts Besonderes»: la verja en plano general, yo pequeño detrás; cartel «0 TALENTE»
shot(8.5, 'Z', null, L => { town(); gate(0); const me = put(ich, 0, 0, -27, 0); actuar(me, L.lt, [[0, 'shrug']], { T: L.T }); cara(me, L.T, { expr: 'sad' });
  TOWN.slice(2, 5).forEach((c, i) => { walkC(c, L.lt, [-11, 11, -12][i], [-8, 4, 4][i], i % 2 ? PI : 0, 3, L.T + i); cara(c, L.T + i, {}); });
  badge('tag', '0 TALENTE', W / 2, H * .2, (L.lt - .4) * 3); cm([0, 9, 14, 0, 9, -26, 50], [0, 8.6, 8, 0, 8.6, -26, 50], L.k); sh(V(0, 0, -20), 40); }, [[0, 'zoom_in', .3], [.3, 'sad_tone', .4], [.8, 'wind', .3]]);
// 6 «Auf diese Schule kommen nur die Besten»: vista de dron del internado con la torre del reloj; los alumnos con trofeos entran por la verja abierta
shot(10.16, 'Z', null, L => { town(); gate(1); OTHERS.slice(0, 8).forEach((c, i) => { walkC(c, L.lt + i * .1, -6 + (i % 4) * 4, -14 - Math.floor(i / 4) * 5, PI, 2.8, L.T + i); cara(c, L.T + i, { expr: 'smug' }); });
  cm([0, 20, -52, 0, 3, -17, 50], [0, 14, -42, 0, 3.4, -19, 48], L.k); sh(V(0, 0, -30), 60); }, [[0, 'zoom_in', .4], [.2, 'bells', .4], [.6, 'steps', .4]]);
// 7 «des ganzen Landes»: delante de la verja posan los mejores; la gente de la ciudad hace fotos (destellos)
shot(11.88, 'S', null, L => { town(); gate(1); [mira, ollie, koch, hack, reich, schwimm].forEach((c, i) => { put(c, -8.5 + i * 3.4, 0, -16, 0); actuar(c, L.lt, [[0, i % 2 ? 'cheer' : 'wave']], { T: L.T + i }); cara(c, L.T + i, { expr: 'happy' }); });
  inHand(TROPHY, ollie, 'R', [0, -.6, .3], [0, 0, 0], .7); inHand(MEDAL, mira, 'L', [0, -.5, .5]);
  TOWN.slice(0, 5).forEach((c, i) => { put(c, [-12, -10.5, 10.5, 12, -13.5][i], 0, -4 - (i % 2) * 3, faceTo(V([-12, -10.5, 10.5, 12, -13.5][i], 0, -4), V(0, 0, -16))); actuar(c, L.lt, [[0, { aRx: 1.9, aLx: 1.9, aRe: .9, aLe: .9, aRz: -.2, aLz: -.2 }]], { T: L.T + i }); });
  if (Math.floor(L.lt * 6) % 3 === 0) grade.uniforms.flash.value = .25; cm([-6, 6, 10, -1, 5, -16, 46], [4, 5.6, 8, 1, 5, -16, 46], L.k); sh(V(0, 0, -12)); }, [[0, 'swipe', .3], [.2, 'flash', .4], [.6, 'flash', .35], [.9, 'cheer', .4]]);
// 8 «Die beste Eiskunstläuferin»: Mira gira sobre el hielo con los patines, la medalla brilla
shot(13.15, 'R', 'punch', L => { town(); gate(1); show(ICE, 0, .08, -33); const m = put(mira, 0, .2, -33, Math.sin(L.lt * 6) * .7); SKATES.forEach(s => s.visible = true); applyPose(m, { aLx: .5, aRx: .5, aLz: 1.4, aRz: 1.4, aLe: .1, aRe: .1, lLx: -.6, lLk: 1.2, headX: -.1 }); cara(m, L.T, { expr: 'happy', eyes: 'closed' });
  badge('tag', 'WELTMEISTERIN', W / 2, H * .2, (L.lt - .3) * 3); orb(L.k, V(0, 3.8, -33), null, [14, .2, .2, 46], [12, -.2, .16, 46]); sh(V(0, 0, -33)); }, [[0, 'whoosh', .4], [.2, 'steps_snow', .5], [.6, 'sparkle', .5], [1.0, 'cheer', .3]]);
// 9 «der beste Tennisspieler»: Ollie saca en la pista de tenis: lanza la pelota y golpea
shot(14.75, 'W', null, L => { use('TN'); day(); TN.lights.forEach(l => l.intensity = 0); const o = put(ollie, TNX - 4, 0, 30, PI + .3); const hit = clamp((L.lt - .55) / .2);
  applyPose(o, { aLx: 2.8 * (1 - hit), aLz: .2, aRx: lerp(2.6, .8, hit), aRz: lerp(.6, -.3, hit), aRe: lerp(1.8, .2, hit), lean: lerp(-.25, .35, hit), twist: lerp(.4, -.5, hit), headX: lerp(-.5, .1, hit) }); cara(o, L.T, { expr: 'determined', mouth: hit > 0 && hit < 1 ? 'talk_wide' : 'smirk' });
  inHand(RACK, o, 'R', [0, -.5, .2], [PI / 2, 0, 0], 1); const b = BALLS[0]; b.visible = true; b.position.copy(L.lt < .55 ? loc(o, -1.4, 9 + Math.sin(L.lt / .55 * PI) * 2.5, .8) : loc(o, 0, 9.6, 1 + (L.lt - .55) * 60));
  orbit(V(TNX - 4, 5, 30), lerp(15, 12.5, L.k), PI + .5, .1, 48); sh(V(TNX, 0, 26)); }, [[0, 'swipe', .3], [.55, 'kick', .6], [.6, 'whoosh', .4], [.9, 'cheer', .3]]);
// 10 «der beste Koch»: el cocinero lanza un crêpe con la sartén entre llamas, delante de las casas
shot(16.01, 'Z', 'punch', L => { town(); const k = put(koch, -2, 0, 52, .25); const f = (L.lt * 1.6) % 1; applyPose(k, { aRx: 1.3 + Math.sin(f * PI) * .5, aRe: .5, aLx: .7, aLe: 1.2, lean: .05, headX: -.3 * Math.sin(f * PI) }); cara(k, L.T, { expr: 'happy', mouth: 'open_smile' });
  inHand(PAN, k, 'R', [0, -.6, .9], [PI / 2, 0, 0]); const pp = loc(k, -1.5, 4.6, 3.2); show(PANCAKE, pp.x, pp.y + Math.sin(f * PI) * 4, pp.z, 0).rotation.x = f * PI * 2;
  FIRE.forEach((s, i) => { s.visible = true; const q = (L.T * 2 + i / 6) % 1; s.position.set(pp.x + Math.sin(i * 2) * .5, pp.y - .4 + q * 2.2, pp.z + Math.cos(i * 2) * .5); s.scale.setScalar(1 - q); });
  onFace(k, 11, -1.2, -1, 44, L.k, 9); sh(V(-2, 0, 52)); }, [[0, 'impact', .4], [.1, 'fire_whoosh', .5], [.3, 'pan_sizzle', .5]]);
// 11 «die beste Hackerin»: la hacker teclea en su portátil, luz verde en la cara, «ZUGRIFF ✓»
shot(16.93, 'F', null, L => { use('KL'); inside(.6, 25); const h = put(hack, KLX + 4.2, .4, 2.5 + 2.8, PI); applyPose(h, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: .9 + Math.sin(L.T * 30) * .1, aRe: .9 - Math.sin(L.T * 30) * .1, headX: .2 }); cara(h, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  show(LAP, KLX + 2.6, 4.25, 3.0, .4); badge('green', 'ZUGRIFF ✓', W / 2, H * .22, (L.lt - .5) * 3, 1, .8); cm([KLX + 5.6, 6.8, -1.2, KLX + 4.2, 4.4, 5.3, 42], [KLX + 5.3, 6.6, -.4, KLX + 4.2, 4.4, 5.3, 40], L.k); }, [[0, 'flash', .3], [.1, 'keys', .6], [.6, 'beep', .4]]);
// 12 «Aber jedes Jahr wird ein ganz normales»: en la calle gira el bombo de la lotería; la gente mira
shot(18.03, 'S', null, L => { town(); gate(0); show(DRUM, 0, 0, 10, 0, 1.1); DRUM.userData.d.rotation.x = L.T * 8;
  TOWN.slice(0, 4).forEach((p, i) => { put(p, [-10, -7.5, 7.5, 10][i], 0, 9 + (i % 2), faceTo(V([-10, -7.5, 7.5, 10][i], 0, 9), V(0, 0, 10))); actuar(p, L.lt, [[0, i % 2 ? 'lean_in' : 'hands_face']], { T: L.T + i }); cara(p, L.T + i, { expr: 'shock' }); });
  orb(L.k, V(1.6, 5.2, 9), null, [16, .35, .14, 46], [14, .6, .12, 46]); sh(V(0, 0, 12)); }, [[0, 'swipe', .3], [.1, 'gears', .5], [.5, 'machine_shake', .4]]);
// 13 «Kind ausgelost»: sale una bola y el billete dorado «GEWONNEN!»
shot(19.47, 'C', 'punch', L => { town(); show(DRUM, 0, 0, 10, 0, 1.1); DRUM.userData.d.rotation.x = L.T * 2; const k = easeOut(clamp(L.lt / .5)); show(TICK, 0, 7 + k * 2.2, 14.5, 0, k * .7); TICK.rotation.z = Math.sin(L.T * 4) * .08;
  const c = put(TOWN[6], 3.6, 0, 6.6, -.5); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); confetti(V(0, 4, 13), .2, L.lt, 30, .6);
  cm([1, 7.4, 30, 0, 7, 11, 44], [.5, 7.2, 26, 0, 7, 11, 44], L.k); sh(V(0, 0, 12)); }, [[0, 'pop', .6], [.2, 'confetti', .5], [.4, 'chime', .5]]);
// 14 «Einfach aus Glück»: el billete vuela por la calle y me cae en las manos; me quedo con la boca abierta
shot(21.0, 'W', null, L => { town(); const me = put(ich, -3, 0, 46, .3); actuar(me, L.lt, [[0, 'idle'], [.35, { aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9, aLz: -.15, aRz: -.15 }, { dur: .25 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' });
  const k = clamp(L.lt / .45); if (k < 1) { show(TICK, lerp(6, -2.6, k), 8 - k * 3.6 + Math.sin(k * 9) * .5, lerp(50, 48.6, k), 0, .7); TICK.rotation.z = k * 6; } else inHand(TICK, me, 'R', [-.8, -.7, .5], [0, 0, 0], .7);
  onFace(me, 10, -1.2, -.8, 44, L.k, 8.5); sh(V(-3, 0, 46)); }, [[0, 'swipe', .3], [.1, 'paper', .5], [.45, 'sparkle', .5]]);
// 15 «Dieses Jahr war ich das»: me señalo a mí mismo con el billete; confeti y la gente aplaude
shot(21.86, 'Z', 'punch', L => { town(); const me = put(ich, -3, 0, 46, 0); actuar(me, L.lt, [[0, { aRx: .9, aRz: -.6, aRe: 2.0, aLx: 2.6, aLz: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'wide' }); inHand(TICK, me, 'L', [0, -.7, .3], [0, 0, 0], .8);
  confRain(V(-3, 0, 46), L.T, 40, 18, 10, 14); TOWN.slice(0, 5).forEach((c, i) => { put(c, -12 + i * 4.6 + (i > 1 ? 4 : 0), 0, 40 - (i % 2) * 2, faceTo(V(-12 + i * 4.6, 0, 40), V(-3, 0, 46))); actuar(c, L.lt, [[0, i % 2 ? 'cheer' : 'wave']], { T: L.T + i }); cara(c, L.T + i, { expr: 'happy' }); });
  orbit(V(-3, 3.8, 46), lerp(15, 12, easeOut(L.k)), .1, .12, 46); sh(V(-3, 0, 44)); }, [[0, 'impact', .5], [.1, 'confetti', .5], [.3, 'cheer', .5], [.8, 'clap', .4]]);
// 16 «Ich lief durch das Schultor»: entro por la verja abierta con la mochila; detrás, la ciudad
shot(23.42, 'F', null, L => { town(); gate(1); const me = walkC(ich, L.lt, 0, -18, PI, 3, L.T); cara(ich, L.T, { expr: 'happy' });
  cm([1, 5.6, -30, 0, 4.4, -19, 44], [.8, 5.4, -28, 0, 4.4, -21, 44], L.k); sh(V(0, 0, -22)); }, [[0, 'flash', .3], [.1, 'steps', .5], [.6, 'metal_creak', .4]]);
// 17 «und plötzlich wurde alles schwarz» (zoom lento): la verja se cierra de golpe detrás de mí, me giro y todo se funde a negro
shot(24.52, 'C', 'slow', L => { town(); const sl = clamp((L.lt - .2) / .3); gate(1 - easeIn(sl)); const me = put(ich, 0, 0, -27, PI); me.root.rotation.y = PI + (L.lt > .55 ? .5 : 0); actuar(me, L.lt, [[0, 'idle'], [.55, 'shock', { dur: .2 }], [1.2, 'slump', { dur: .5 }]], { T: L.T }); cara(me, L.T, { expr: L.lt > .55 ? 'shock' : 'happy', mouth: L.lt > .55 ? 'scream' : 'flat' });
  DARK = clamp((L.lt - 1.1) / .8); cm([0, 5.8, -44, 0, 4.6, -27, 44], [0, 5.4, -36, 0, 4.6, -27, 40], L.k); sh(V(0, 0, -26)); }, [[.45, 'slam', .7], [.5, 'chain_rattle', .5], [.7, 'gasp', .4], [1.2, 'whoosh_down', .4]]);
// 18 «Ich wachte in einem Klassenzimmer auf»: levanto la cabeza del pupitre, mareado; el aula vacía
shot(26.51, 'I', null, L => { use('KL'); inside(.85, 40); const me = put(ich, KLX - 4.4, .4, 5.3, PI); const up = easeOut(clamp((L.lt - .3) / .8)); applyPose(me, { ...SIT, aLx: 1.4, aRx: 1.4, aLe: 1.6, aRe: 1.6, lean: lerp(1.0, .1, up), headX: lerp(.4, -.1, up), headY: Math.sin(L.T * 2) * .3 * up }); cara(me, L.T, { expr: 'confused', eyes: up < .3 ? 'closed' : 'half', mouth: 'flat' });
  DARK = 1 - clamp(L.lt / .5); cm([KLX - 4.4, 6.4, -6, KLX - 4.4, 5, 5, 46], [KLX - 4.4, 6.6, -3.4, KLX - 4.4, 5, 5, 46], L.k); }, [[0, 'iris_pop', .3], [.3, 'yawn_big', .4], [.9, 'chair_roll', .3]]);
// 19 «Die Fenster waren mit Eisenplatten zugeschraubt»: golpeo la placa de hierro de la ventana; tornillos y rendija de luz
shot(28.48, 'W', null, L => { use('KL'); inside(.85, 40); const me = put(ich, KLX + 16.6, 0, -8, PI / 2); const kn = Math.max(0, Math.sin(L.lt * 12)); actuar(me, L.lt, [[0, { aRx: 1.8, aRe: .4 + kn * .5, aRz: -.1, aLx: .4, lean: .05 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', mouth: 'grimace' });
  cm([KLX + 11.4, 6.2, .8, KLX + 16.8, 4.4, -8, 50], [KLX + 12.2, 6, -.4, KLX + 16.8, 4.4, -8, 48], L.k); }, [[0, 'swipe', .3], [.2, 'metal_hit', .6], [.5, 'metal_hit', .5], [.8, 'metal_hit', .5], [1.4, 'ratchet', .4]]);
// 20 «und in jeder Ecke hing eine Kamera»: una cámara de la esquina gira hacia mí con su luz roja; yo la miro desde abajo
shot(30.64, 'Z', 'punch', L => { use('KL'); inside(.85, 40); KL.cams[0].rotation.y = PI / 4 + Math.sin(L.lt * 3) * .5; const me = put(ich, KLX - 12, 0, -6, PI + .7); actuar(me, L.lt, [[0, { headX: -.6, aLx: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', eyes: 'wide' });
  cm([KLX - 14, 15.6, -10, KLX - 18.4, 18, -14.4, 46], [KLX - 15, 16.2, -11, KLX - 18.4, 18, -14.4, 40], L.k); }, [[0, 'impact', .4], [.1, 'gears', .4], [.4, 'beep', .4]]);
// 21 «Auf meinem Pult lag ein Zettel»: cojo la nota de mi pupitre
shot(32.67, 'S', null, L => { use('KL'); inside(.85, 40); const me = put(ich, KLX - 4.4, 0, 9, PI); const k = clamp((L.lt - .3) / .4); actuar(me, L.lt, [[0, 'idle'], [.2, { aRx: 1.3, aRe: .4, lean: .3, headX: .4 }, { dur: .3 }], [.8, { aRx: 1.6, aRe: 1.4, headX: .2, lean: .05 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'confused' });
  if (L.lt > .8) { KL.note.visible = false; const hp2 = loc(me, -.6, 3.6, 2.2); show(NOTE2, hp2.x, hp2.y, hp2.z, 0, 1); } cm([KLX - 2, 8.6, .5, KLX - 4.4, 5, 8.4, 46], [KLX - 2.4, 8.4, 1.6, KLX - 4.4, 5, 8.6, 46], L.k); if (NOTE2.visible) NOTE2.lookAt(camera.position); }, [[0, 'swipe', .3], [.6, 'paper', .5]]);
// 22 «Komm in die Turnhalle»: la nota sobre el pupitre, de cerca; yo detrás alargando la mano
shot(34.15, 'C', 'punch', L => { use('KL'); inside(.85, 40); KL.note.rotation.z = PI; const me = put(ich, KLX - 4.4, .4, 5.3, PI); applyPose(me, { ...SIT, aRx: 1.3, aRe: .3, aLx: .9, aLe: 1, headX: .1, lean: .25 }); cara(me, L.T, { expr: 'worried', eyes: 'down' });
  cm([KLX - 4.2, 9.4, -1.6, KLX - 4.4, 3.4, 3.6, 46], [KLX - 4.3, 8.8, -.6, KLX - 4.4, 3.4, 3.6, 42], L.k); }, [[0, 'impact', .4], [.2, 'paper', .4]]);
// 23 «Dort warteten schon elf andere Schüler» (zoom lento): entro al gimnasio; los once se giran a mirarme
shot(35.29, 'F', 'slow', L => { use('TH'); inside(.85, 40); OTHERS.forEach((c, i) => { const x = -12 + (i % 6) * 4.8, z = -6 - Math.floor(i / 6) * 4.5; const r0 = faceTo(V(x, 0, z), V(0, 0, 16)); put(c, THX + x, 0, z, lerp(PI, r0, easeInOut(clamp((L.lt - .3 - i * .05) / .4)))); actuar(c, L.lt, [[0, 'idle'], [.5 + i * .04, i % 3 ? 'cross' : 'listen']], { T: L.T + i }); cara(c, L.T + i, { expr: 'sus' }); });
  const me = walkC(ich, L.lt, THX, 18, PI, 1.6, L.T); cara(ich, L.T, { expr: 'worried' });
  cm([THX, 9, 25, THX, 5, -6, 50], [THX, 8, 20, THX, 5, -6, 50], L.k); }, [[0, 'flash', .3], [.1, 'door_open', .5], [.5, 'steps', .3], [1.0, 'whisper', .4]]);
// 24 «Eine davon kannte ich aus der Grundschule»: la señalo, sorprendido
shot(37.39, 'W', 'punch', L => { use('TH'); inside(.85, 40); const me = put(ich, THX - 2, 0, 8, PI - .3); actuar(me, L.lt, [[0, 'shock'], [.4, 'point', { dur: .25 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' });
  put(mira, THX - 6, 0, -2, .3); cara(mira, L.T, {}); onFace(me, 10, -1.2, 1.2, 44, L.k, 8.5); }, [[0, 'impact', .4], [.3, 'gasp', .4]]);
// 25 «Mira,»: Mira de cerca, se gira y saluda; su nombre aparece
shot(39.29, 'Z', null, L => { use('TH'); inside(.85, 40); const m = put(mira, THX - 6, 0, -2, lerp(PI, .3, easeOut(clamp(L.lt / .4)))); actuar(m, L.lt, [[0, 'idle'], [.35, 'wave', { dur: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' }); inHand(MEDAL, m, 'L', [0, -.5, .5]);
  badge('tag', 'MIRA', W / 2, H * .18, (L.lt - .2) * 3); onFace(m, 10, -1.4, -.6, 42, L.k, 8.6); }, [[0, 'zoom_in', .3], [.35, 'sparkle', .5], [.6, 'whoosh_up', .3]]);
// 26 «inzwischen echte Eiskunstlauf-Weltmeisterin»: Mira en el podio con la medalla de oro y el trofeo, confeti y focos
shot(40.63, 'R', 'punch', L => { use('TH'); inside(.8, 30); TH.spots.forEach(s => s.intensity = 175); show(ICE, THX - 9, 4.25, -21, 0, .5); const m = put(mira, THX - 9, 4.4, -21, Math.sin(L.T * 2) * .3); SKATES.forEach(s => s.visible = true); actuar(m, L.lt, [[0, 'cheer']], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' });
  inHand(TROPHY, m, 'R', [0, -.6, .3], [0, 0, 0], .8); confRain(V(THX - 9, 4, -21), L.T, 40, 14, 8, 16); badge('gold', 'WELTMEISTERIN', W / 2, H * .2, (L.lt - .2) * 3, 1, .7);
  orbit(V(THX - 9, 7.6, -21), lerp(15, 12, easeOut(L.k)), .2, .1, 44); }, [[0, 'impact', .5], [.1, 'cheer', .5], [.3, 'confetti', .4], [.8, 'bells', .3]]);
// 27 «Ich hatte nie mit ihr geredet» (recuerdo sepia): de pequeños en primaria: yo solo al fondo, ella riendo con sus amigas
shot(42.24, 'F', null, L => { use('KL'); inside(.85, 40); sepia(.85); const me = put(ich, KLX - 4.4, .4, 10 + 2.8, PI + .5); ich.root.scale.setScalar(.7); applyPose(me, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.5, aRe: 1.5, headX: .1 }); cara(me, L.T, { expr: 'sad', eyes: 'side_l' });
  [[mira, 0, -1, .6], [zopf, 1.6, 1, -2.4], [schwimm, -1, 1.6, 2.4]].forEach(([c, x, z, ry], i) => { put(c, KLX + x, 0, z, ry); c.root.scale.setScalar(.65); actuar(c, L.lt, [[0, i ? 'hands_face' : 'shrug']], { T: L.T + i }); laughF(c, L.T + i); });
  cm([KLX + 1, 7, 18, KLX - 1.5, 2.8, 4, 50], [KLX + .6, 6.6, 16.5, KLX - 1.5, 2.8, 4, 48], L.k); }, [[0, 'flash', .3], [.2, 'kids_laugh', .4], [.8, 'sigh', .4]]);
// 28 «Trotzdem erinnerte sie sich an mich»: en el gimnasio Mira me sonríe y saluda; me pongo rojo (corazoncitos)
shot(43.63, 'W', null, L => { use('TH'); inside(.85, 40); const m = put(mira, THX - 3.2, 0, 2, .7); actuar(m, L.lt, [[0, 'wave']], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' });
  const me = put(ich, THX + 3, 0, 4.4, -1.5); actuar(me, L.lt, [[0, 'idle'], [.4, 'hands_face', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'grin', blush: 1 }); const hp_ = hp(me);
  HEARTS.forEach((z, i) => { const k = (L.T * .6 + i / 5) % 1; z.visible = true; z.position.set(hp_.x + Math.sin(i * 1.7 + L.T) * 1.4, hp_.y + 1 + k * 3.4, hp_.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  orb(L.k, V(THX, 4.6, 3.2), null, [20, 0, .1, 44], [18, .15, .1, 44]); }, [[0, 'swipe', .3], [.3, 'sparkle', .4], [.6, 'heartbeat', .4], [1.2, 'kids_laugh', .3]]);
