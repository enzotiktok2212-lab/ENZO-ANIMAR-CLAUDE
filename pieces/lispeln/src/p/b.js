// ---------- b: la tienda, la sospecha, el robot y el ayuntamiento de noche (22,84 – 46,10 s) ----------
// Tienda (ZOX): mostrador en (0, -6) mirando +z; Zocker detrás en z = -9; estantería de GTA 5 en la pared este (x = 19.4, z = -2); póster «BALD: GTA 6» en (0, 9.5, -15.75).
// Salón (WZX): tele en (0, -9.6) (pantalla ≈ y 4.5); sofá en (0, 3.2) mirando -z. Plaza del ayuntamiento (RPX): balcón en (0, 15, -31…-26.3); escenario con robot en (0, -14).
// Sala (SAX): atril en (0, -6) mirando +z; alcalde detrás en z = -8.6; telón en z = 4 (x ±15.2 cerrado); espejo en (-12, -10).
function ladenS(L) { use('ZO'); inside(1.0, 36); FILL.color.setRGB(.92, .88, 1); }
function wohnS(L) { use('WZ'); inside(.95, 34); }
function platzS(L, o = {}) { use('RP'); if (o.night) { night(18); renderer.toneMappingExposure = .72; TINT = 'rgba(8,12,60,.36)'; DARK = .12; } else day(); }
function saalS(L) { use('SA'); inside(.85, 30); FILL.color.setRGB(1, .9, .78); }
const ZW = (x, y, z) => V(ZOX + x, y, z), RW = (x, y, z) => V(RPX + x, y, z), SW = (x, y, z) => V(SAX + x, y, z);
// cara dibujada del alcalde (pantallas, móvil): pelo gris con raya, bigote enroscado, cadena
function mayorFace(c, x, y, r, T, talkK = 1) { c.save(); c.translate(x, y); c.fillStyle = '#f0c0a0'; c.beginPath(); c.roundRect(-r, -r, 2 * r, 2 * r, r * .25); c.fill(); c.lineWidth = r * .06; c.strokeStyle = '#1a1a1a'; c.stroke();
  c.fillStyle = '#9a9aa2'; c.beginPath(); c.roundRect(-r * 1.05, -r * 1.15, 2.1 * r, r * .6, r * .2); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(-r * .35, -r * 1.1, r * .06, r * .5);
  c.fillStyle = '#1a1a1a'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * r * .38, -r * .15, r * .1, r * .14, 0, 0, 7); c.fill(); }
  const mo = talkK * (.5 + .5 * Math.sin(T * 24)); c.fillStyle = '#6a1a1a'; c.beginPath(); c.ellipse(0, r * .5, r * .3, r * (.06 + mo * .18), 0, 0, 7); c.fill();
  c.fillStyle = '#8a8a92'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * r * .28, r * .3, r * .3, r * .1, s * -.2, 0, 7); c.fill(); c.beginPath(); c.arc(s * r * .62, r * .2, r * .1, 0, 7); c.fill(); }
  c.fillStyle = '#7a1a2a'; c.fillRect(-r * 1.1, r, r * 2.2, r * .7); c.strokeStyle = '#f0c030'; c.lineWidth = r * .08; c.beginPath(); c.arc(0, r * .95, r * .55, .2, Math.PI - .2); c.stroke(); c.restore(); }
function drawMayorVid(c, w, h, T, text = 'THÜTHE THAHNETHOTHE!') { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5a1a2a'); g.addColorStop(1, '#2a0a1a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < h; i += 6) c.fillRect(0, i, w, 2);
  mayorFace(c, w * .32, h * .5, h * .26, T); c.strokeStyle = '#7aff9a'; c.lineWidth = 6; c.beginPath(); for (let i = 0; i <= 40; i++) { const x = w * .55 + i * w * .01, a = Math.sin(T * 20 + i * .9) * Math.sin(i * .3) * h * .12 * (.6 + .4 * Math.sin(T * 7)); c.lineTo(x, h * .42 + a); } c.stroke();
  c.fillStyle = '#e8141e'; c.beginPath(); c.roundRect(w * .04, h * .06, w * .2, h * .12, 10); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 ${h * .08 | 0}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('● REC', w * .14, h * .125);
  c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, h * .78, w, h * .2); c.fillStyle = '#ffd23f'; c.font = `700 ${h * .1 | 0}px ${FONT}`; c.fillText(text, w / 2, h * .88); }
function drawNews(c, w, h, T) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1a3a8a'); g.addColorStop(1, '#0a1a4a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = '#6a4a2a'; c.fillRect(w * .42, h * .44, w * .16, h * .34); c.fillStyle = '#d8b040'; c.fillRect(w * .4, h * .42, w * .2, h * .04); c.fillStyle = '#2a2a2a'; c.fillRect(w * .495, h * .3, 6, h * .14);
  c.fillStyle = '#ffffff'; c.font = `700 ${h * .26 | 0}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.globalAlpha = .55 + .45 * Math.sin(T * 6); c.fillText('?', w * .5, h * .22); c.globalAlpha = 1;
  c.fillStyle = '#e8141e'; c.fillRect(0, h * .8, w, h * .2); c.fillStyle = '#ffffff'; c.font = `700 ${h * .075 | 0}px ${FONT}`; c.fillText('LIVE: REDE DES BÜRGERMEISTERS', w / 2, h * .86); c.font = `700 ${h * .06 | 0}px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('BÜRGERMEISTER: KEIN BILD', w / 2, h * .94);
  c.fillStyle = '#e8141e'; c.beginPath(); c.roundRect(w * .03, h * .05, w * .14, h * .1, 8); c.fill(); c.fillStyle = '#fff'; c.font = `700 ${h * .06 | 0}px ${FONT}`; c.fillText('LIVE', w * .1, h * .1); }
function drawPhoneRec(c, w, h, T) { c.fillStyle = '#2a1a1a'; c.fillRect(0, 0, w, h); c.fillStyle = '#6a2a3a'; c.fillRect(0, h * .2, w, h * .6); mayorFace(c, w / 2, h * .48, w * .26, T); c.fillStyle = '#e8141e'; c.beginPath(); c.arc(w * .2, h * .08, 12, 0, 7); c.fill();
  c.fillStyle = '#ffffff'; c.font = `700 28px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; const s = Math.floor(T * 1.3) % 60; c.fillText('REC 00:' + String(s).padStart(2, '0'), w * .3, h * .08); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, h * .9, 30, 0, 7); c.fill(); c.fillStyle = '#e8141e'; c.beginPath(); c.arc(w / 2, h * .9, 22, 0, 7); c.fill(); }

// 22 «Thpäter wollte ich mir im Laden»: Jonte entra en la Zockerhöhle y mira las estanterías con los ojos como platos
shot(22.84, 'W', null, L => { ladenS(L); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, ZOX - 15, -1, ZOX - 8, 0); c.root.rotation.y = PI / 2 + .3; cara(c, L.T, { expr: 'joy', eyes: 'wide', mouth: 'open_smile' }); holdBag(c); hero(c);
  const z = put(zock, ZOX, 0, -9, -.3); actuar(z, 0, [[0, 'wave']], { T: L.T }); cara(z, L.T, { expr: 'happy' }); crowdAt(L, ZOX + 10, 6, 2, 3, 5, 21, { mode: 'talk', from: 12, gap: 2 });
  cm([ZOX + 3, 7, 11, ZOX - 10, 4.4, -1, 48], [ZOX + 2, 6.8, 10, ZOX - 8, 4.4, -1, 46], L.k); sh(ZW(-8, 0, 0), 22); }, [[0, 'door_bell', .6], [.2, 'arcade_bleeps', .4], [.5, 'steps', .3]]);
// 23 «GTA Thechth kaufen.»: el póster «BALD: GTA 6» brilla; Jonte lo señala ilusionado; un «6» gigante salta
shot(23.89, 'Z', 'slow', L => { ladenS(L); const c = put(jonte, ZOX + 1.6, 0, -1.5, PI + .3); actuar(c, 0, [[0, { aRx: 2.5, aRz: -.1, aRe: .2, aLx: .6, aLe: 1.6, lean: -.06, headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'up', mouth: 'open_smile' }); holdBag(c); hero(c);
  badge3('gold', '6', ZW(4, 13.5, -14.8), (L.lt - .45) / .25, 1.6);
  cm([ZOX - 1, 7.4, 12, ZOX + 2, 5.5, -10, 50], [ZOX - .5, 7.2, 9.5, ZOX + 2, 5.7, -10, 48], L.k); sh(ZW(2, 0, -6), 20); DOF = 0; }, [[0, 'sparkle', .6], [.5, 'ding', .5]]);
// 24 «„Kann ich GTA Thechth haben, bitte?“»: Jonte en el mostrador, educado, con las manos juntas; el dependiente escucha
shot(25.33, 'S', null, L => { ladenS(L); const c = put(jonte, ZOX - .4, 0, -2.4, PI); talk(c, L.T, 25.33, 26.87, 'happy'); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: -.35, aRz: -.35, aLe: 1.4, aRe: 1.4, lean: .08, headZ: .1 }]], { T: L.T }); spit(c, L.T, 25.33, 6); holdBag(c);
  const z = put(zock, ZOX + .4, 0, -9.4, 0); actuar(z, 0, [[0, 'listen']], { T: L.T }); cara(z, L.T, { expr: 'confused' }); hero(c, z);
  cm([ZOX + 5.5, 7.6, -13.5, ZOX - .4, 4.6, -2.4, 44], [ZOX + 5, 7.4, -12.5, ZOX - .4, 4.7, -2.4, 42], L.k); sh(ZW(0, 0, -5), 18); }, [[0, 'tape', .3], [.4, 'arcade_bleeps', .3]]);
// 25 «Der Verkäufer thagte:»: el dependiente se quita un auricular, se inclina sobre el mostrador
shot(26.87, 'C', null, L => { ladenS(L); const z = put(zock, ZOX + .4, 0, -9, .12); actuar(z, 0, [[0, { aRx: .9, aLx: .9, aRz: -.3, aLz: -.3, aLe: .5, aRe: .5, lean: .18 }]], { T: L.T }); talk(z, L.T, 26.87, 28.1, 'sad'); hero(z);
  onBody(z, 10, .15, .26, 42, L.k, 8.6, null, 5.4); sh(ZW(0, 0, -8), 14); }, [[0, 'thump', .4], [.3, 'headset_off', .4]]);
// 26 «„Tut mir leid, wir haben nur GTA Fünf.“»: se encoge de hombros con una caja de GTA 5 en la mano
shot(28.1, 'F', null, L => { ladenS(L); const z = put(zock, ZOX + .4, 0, -9, .2); talk(z, L.T, 28.1, 29.28, 'sad'); actuar(z, 0, [[0, { aRx: 1.35, aRz: -.25, aRe: .25, aLx: .3, aLz: .5, aLe: 1.6, headZ: .12, sx: .05 }]], { T: L.T }); attach(GAME, z.aR.hand, [0, -.9, .4], [-1.2, 0, 0], 1.3); hero(z);
  const c = put(jonte, ZOX - .8, 0, -2.4, PI - .1); actuar(c, 0, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  cm([ZOX + 5, 9.4, -1.5, ZOX + .4, 5.6, -9, 42], [ZOX + 4.4, 9.1, -2.4, ZOX + .4, 5.6, -9, 40], L.k); sh(ZW(0, 0, -7), 14); }, [[0, 'flash', .3], [.2, 'plastic_box', .5], [.6, 'sad_trombone', .3]]);
// 27 «nur GTA Fünf.»: toda la estantería llena de cajas de GTA 5; un «5» rojo salta; el dependiente la presenta con los brazos
shot(29.28, 'W', 'punch', L => { ladenS(L); const z = put(zock, ZOX + 12.5, 0, 4, -2.3); actuar(z, 0, [[0, { aLx: 1.4, aLz: .6, aLe: .3, aRx: .4 }]], { T: L.T }); cara(z, L.T, { expr: 'happy', mouth: 'grin' }); hero(z);
  badge3('red', 'GTA 5', ZW(19, 15, -2), (L.lt - .1) / .2, 1.3);
  cm([ZOX + 4, 8.5, 6, ZOX + 19, 7.4, -2, 46], [ZOX + 6, 8.2, 5, ZOX + 19, 7.4, -2, 44], L.k); sh(ZW(14, 0, 0), 18); }, [[0, 'impact', .5], [.15, 'pop', .5]]);
// 28 «Ich hatte diethe Regel tho thatt.»: Jonte sale por la calle de mal humor y da una patada a una lata; carteles con TH alrededor
shot(30.33, 'S', null, L => { town(L); const sp = LT.HS[2].position; const bx = sp.x + 13, bz = sp.z; const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, bx + 2, bz - 10, bx + 2.5, bz + 3); c.root.rotation.y = .05; actuar(c, L.lt, [[0, walkP(L.T, 0)], [.8, { lRx: -1.2, lRk: .2, aLx: -.4, aRx: .5, lean: -.08 }, { dur: .15 }], [1.05, walkP(L.T, 0), { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'frown' }); holdBag(c); hero(c);
  dust(V(bx + 2.3, 0, bz - 2), L.t0 + .85, L.T, 6, .4); crowdAt(L, bx + 6, bz - 4, 4, 7, 12, 31, { mode: 'talk', from: 14, gap: 1.6 });
  orb(L.k, V(bx + 2.2, 4.2, bz - 4), V(bx + 2.4, 4.2, bz + 1), [14, .65, .12, 44], [12.5, .55, .1, 44]); sh(V(bx + 2, 0, bz), 22); }, [[0, 'steps', .4], [.8, 'can_kick', .6], [1.1, 'grumble', .4]]);
// 29 «Aber dann fiel mir etwath Theltthameth auf.»: en el sofá de casa, Jonte ve las noticias y entorna los ojos
shot(31.78, 'R', null, L => { wohnS(L); TVC.getContext('2d') && drawNews(TVC.getContext('2d'), 640, 360, L.T); TVT.needsUpdate = true; sit(jonte, WZX, 1.6, 3.0, PI + .2, L, { aLx: .6, aRx: .6, aLe: 1.3, aRe: 1.3, headX: .08, lean: .1 + L.k * .12 }); cara(jonte, L.T, { expr: 'sus' }); hero(jonte);
  orbit(V(WZX, 4.4, 3), lerp(13, 10, L.k), PI + .55, .1, 42); sh(V(WZX, 0, 0), 16); }, [[0, 'whirl', .3], [.2, 'tv_news', .5], [1.2, 'hmm', .5]]);
// 30 «Unther Bürgermeithter war nie im Fernthehen.»: la tele de cerca: «LIVE: Rede des Bürgermeisters» y el atril vacío con un «?»
shot(33.82, 'Z', 'slow', L => { wohnS(L); drawNews(TVC.getContext('2d'), 640, 360, L.T); TVT.needsUpdate = true; sit(jonte, WZX, 1.6, 3.0, PI, L, { aLx: .6, aRx: .6, aLe: 1.3, aRe: 1.3 }); cara(jonte, L.T, { expr: 'sus' });
  cm([WZX, 5.2, 4, WZX, 4.6, -9.4, 46], [WZX, 4.8, -1, WZX, 4.6, -9.4, 44], L.k); sh(V(WZX, 0, -4), 14); DOF = 0; }, [[0, 'tv_static', .3], [.3, 'tv_news', .4]]);
// 31 «Er hielt theine Reden nur durch einen»: en la plaza del ayuntamiento, el robot gigante dorado da el discurso ante la multitud
shot(36.12, 'W', null, L => { platzS(L); RP.ROB.visible = true; RP.STG.visible = true; robotPose(RP.ROB, L.T, .7, 1); crowdAt(L, RPX, 12, 16, 6, 22, 41, { mode: i => ['clap', 'idle', 'talk', 'idle'][i % 4], face: RW(0, 20, -14), full: true }); hero();
  orb(L.k, RW(0, 18, -14), null, [70, .12, .2, 50], [62, .05, .18, 50]); sh(RW(0, 0, -6), 50); }, [[0, 'robot_voice', .6], [.2, 'crowd_murmur', .4], [.8, 'clap', .3]]);
// 32 «riethigen Roboter.»: contrapicado del robot: los ojos se encienden, levanta el brazo; altavoz del pecho vibrando
shot(37.42, 'C', 'punch', L => { platzS(L); RP.ROB.visible = true; RP.STG.visible = true; robotPose(RP.ROB, L.T, 1, 1); RP.ROB.userData.eyes.forEach(e => e.material.emissiveIntensity = 2.5 + Math.sin(L.T * 30) * 1.5);
  crowdAt(L, RPX, 6, 6, 5, 10, 43, { mode: 'shock', face: RW(0, 20, -14), from: 10, gap: 1.2 });
  cm([RPX + 6, 3, 14, RPX, 28, -14, 54], [RPX + 4, 2.6, 11, RPX, 29, -14, 52], L.k); sh(RW(0, 0, -10), 40); DOF = 0; }, [[0, 'robot_stomp', .7], [.2, 'servo', .5]]);
// 33 «Altho schlich ich mich nachtth»: de noche, Jonte cruza la plaza vacía a hurtadillas hacia el ayuntamiento
shot(38.49, 'F', null, L => { platzS(L, { night: true }); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, RPX - 8, 6, RPX - 3, -12); actuar(c, 0, [[0, { ...walkP(L.T * .7, 0), crouch: .25, lean: .3, aLx: .8, aLe: 1.4, aRx: .3, aRe: 1.2 }]], { T: L.T }); c.root.position.y = 0; cara(c, L.T, { expr: 'worried', eyes: 'side_l' }); holdBag(c); hero(c);
  const p = c.root.position; orbit(V(p.x, 4, p.z), lerp(15, 13, L.k), 2.2, .14, 46); sh(V(p.x, 0, p.z), 20); }, [[0, 'night_crickets', .5], [.2, 'sneak_steps', .5], [1.0, 'owl', .3]]);
// 34 «inth Rathauth.»: se cuela por la puerta entreabierta del ayuntamiento y mira atrás
shot(39.93, 'S', null, L => { platzS(L, { night: true }); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, RPX - 1, -22, RPX - .4, -29.6); c.root.position.y = lerp(1.6, 2.4, L.k); actuar(c, 0, [[0, { ...walkP(L.T * .7, 0), crouch: .2, lean: .25 }]], { T: L.T }); c.root.rotation.y = PI - .5; cara(c, L.T, { expr: 'worried', eyes: 'side_r', mouth: 'grimace' }); holdBag(c); hero(c);
  orb(L.k, RW(-.6, 5.5, -26), null, [14, .45, .08, 44], [12, .35, .08, 44]); sh(RW(0, 0, -26), 16); }, [[0, 'door_creak', .6], [.4, 'gulp', .4]]);
// 35 «Und wath ich dort fand, war unglaublich.»: en la sala, Jonte se asoma por el borde del telón; una luz dorada le ilumina la cara
shot(40.63, 'I', 'slow', L => { saalS(L); const c = put(jonte, SAX - 17, 0, 5.6, 2.6); actuar(c, 0, [[0, { aLx: 1.4, aLz: -.4, aLe: 1.2, aRx: .4, lean: .12, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); holdBag(c); hero(c);
  FLASHL.intensity = 260; FLASHL.position.copy(SW(-8, 10, -2)); FLASHL.target.position.copy(SW(-16, 5, 6)); FLASHL.color.setRGB(1, .86, .5);
  cm([SAX - 11.5, 6.2, -2.5, SAX - 17, 5, 5.6, 42], [SAX - 12.5, 6, -.5, SAX - 17, 5, 5.6, 40], L.k); sh(SW(-15, 0, 4), 14); }, [[0, 'curtain_rustle', .5], [.4, 'heartbeat', .4]]);
// 36 «Hinter einem riethigen Vorhang»: el telón rojo se abre (desde detrás de Jonte) y aparece el alcalde en el atril
shot(42.9, 'R', null, L => { saalS(L); const k = easeInOut(clamp(L.lt / 1.3)); SA.TEL.userData.open(k * .9); const m = put(zisch, SAX, 0, -8.6, 0); actuar(m, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.0, aRe: 1.0, headX: .15 }]], { T: L.T }); attach(SA.CARD, m.aR.hand, [0, -.7, .5], [-1.0, 0, 0], .9); SA.CARD.userData.draw('a', (c, w, h) => { txt(c, 'SÜSSE SAHNESOSSE', w / 2, 70, 34, '#1a1a6a'); txt(c, 'SUPER STARKE SPAGHETTI', w / 2, 124, 28, '#1a1a6a'); txt(c, 'SIEBEN SAURE...', w / 2, 178, 30, '#1a1a6a'); }); cara(m, L.T, { expr: 'neutral' }); hero(m);
  const c = put(jonte, SAX - 4, 0, 11, PI + .2); actuar(c, 0, [[0, { aLx: .6, aLe: 1.2, crouch: .1, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'shock' }); holdBag(c);
  cm([SAX - 6, 7, 22, SAX, 6.5, -8, 46], [SAX - 4.5, 6.8, 18, SAX, 6.5, -8, 44], L.k); sh(SW(0, 0, -2), 22); }, [[0, 'curtain_open', .7], [.6, 'whoosh_soft', .3]]);
// 37 «übte der Bürgermeithter theine Rede.»: el alcalde, de frente, carraspea y ensaya mirando sus fichas
shot(44.64, 'W', null, L => { saalS(L); SA.TEL.userData.open(.9); const m = put(zisch, SAX, 0, -8.6, 0); actuar(m, 0, [[0, { aRx: 1.0, aRe: 1.2, aLx: .7, aLz: -.2, aLe: 1.6, headX: .1 + Math.sin(L.T * 3) * .05 }]], { T: L.T }); attach(SA.CARD, m.aR.hand, [0, -.7, .5], [-1.0, 0, 0], .9); SA.CARD.userData.draw('a', (c, w, h) => { txt(c, 'SÜSSE SAHNESOSSE', w / 2, 70, 34, '#1a1a6a'); txt(c, 'SUPER STARKE SPAGHETTI', w / 2, 124, 28, '#1a1a6a'); txt(c, 'SIEBEN SAURE...', w / 2, 178, 30, '#1a1a6a'); });
  cara(m, L.T, { expr: 'neutral', mouth: L.lt < .6 ? 'o' : 'flat' }); hero(m); onBody(m, 13, 0, .06, 40, L.k, 11, .15, 5.4); sh(SW(0, 0, -7), 14); }, [[0, 'throat_clear', .6], [.7, 'paper', .5]]);
