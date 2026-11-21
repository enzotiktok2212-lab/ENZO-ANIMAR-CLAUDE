// ---------- d: ¿quién está arriba?, la escalera, el zepelín, el móvil, el pulgar y tu sótano (89,80 – 129,15 s) ----------
// el vacío de arriba del todo: suelo de tablones bajo las estrellas (VX = 3000)
const VX = 3000; const VOID = (() => { const g = new THREE.Group(); g.position.x = VX; scene.add(g); const f = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0xffffff, { map: (() => { const t = KE.children[0].material.map.clone(); t.repeat.set(30, 30); t.needsUpdate = true; return t; })(), roughness: .8, color: 0x9a7a5a })); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  const lid = new THREE.Group(); lid.position.set(0, 0, 0); g.add(lid); box(8, .6, 8, mat(0x6a4224, { roughness: .7 }), .1, lid, 0, .3, 0); for (let i = -3; i <= 3; i++) box(.15, .62, 8, mat(0x4a2e18), 0, lid, i * 1.1, .31, 0);
  const hole = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.8, 1.5, 1.0), toneMapped: false })); hole.rotation.x = -Math.PI / 2; hole.position.y = .02; g.add(hole);
  g.userData = { lid, hole }; outline(g, 1.2); return g; })(); SETS.VO = VOID;
// postales de la ciudad (para «tu ciudad»)
const POST_T = Array.from({ length: 6 }, (_, i) => { const p = textPlane(6, 9, 240, 360, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#4a9aff'); g.addColorStop(1, '#bfe2ff'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#62c84e'; c.fillRect(0, h * .62, w, h * .38);
  for (let k = 0; k < 4; k++) { const x = 14 + k * 56 + (i * 9) % 20, y = h * .62 - 70 - (k % 2) * 20; c.fillStyle = (k + i) % 2 ? '#f6d04a' : '#d8402e'; c.fillRect(x, y, 46, 70 + (k % 2) * 20); c.fillStyle = (k + i) % 2 ? '#d8402e' : '#f2b83a'; c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x + 23, y - 30); c.lineTo(x + 52, y); c.fill(); c.fillStyle = '#9fd2f2'; c.fillRect(x + 8, y + 14, 12, 14); c.fillRect(x + 26, y + 14, 12, 14); }
  c.fillStyle = '#e8e6e2'; c.fillRect(0, h * .78, w, 26); c.lineWidth = 14; c.strokeStyle = '#ffffff'; c.strokeRect(0, 0, w, h); }); p.material.side = THREE.DoubleSide; scene.add(p); PROPS.push(p); return p; });
const sunset = () => { day(); setSky([.25, .25, .7], [.95, .5, .35], [1, .75, .4]); sun.color.setRGB(1, .7, .45); sun.intensity = 2.2; hemi.color.setRGB(1, .8, .7); hemi.intensity = 1.0; };
const voidN = () => { use('VO'); night(30); hemi.intensity = .9; FILL.intensity = 40; };
const RIDGE = V(0, 33.2, -58);   // caballete del tejado de mi casa
const handyAt = (z = -40, s = 1) => { show(HANDY, VX, 0, z, 0, s); HANDY.userData.glow.forEach(b => b.visible = true); };
const fanBehind = (L, z = -40, look = 0) => { const f = put(fan, VX, -44, z - 22, 0); f.root.scale.setScalar(16); actuar(f, 0, [[0, { headX: .1 + look, aRx: 1.2, aLx: 1.2, aRe: 1.4, aLe: 1.4 }]], { T: L.T }); cara(f, L.T, { expr: 'neutral', eyes: 'half', mouth: 'flat' }); return f; };

// «Aber eine Sache musste ich wissen:»: al atardecer, sentado en el tejado, pensativo
shot(89.80, 'F', null, L => { use('CI'); sunset(); const c = put(ich, RIDGE.x, RIDGE.y, RIDGE.z, .3); actuar(c, 0, [[0, { ...GEST.think, lLx: .1 }]], { T: L.T }); talk(c, L.T, 89.8, 91.3, 'confused');
  orbit(V(RIDGE.x, RIDGE.y + 3.4, RIDGE.z), lerp(14, 12, L.k), .5, .08, 46); sh(RIDGE, 20); }, [[0, 'wind', .4], [.3, 'birds', .3]]);
// «Wer sitzt ganz oben?» (zoom lento): miro arriba, a la tapa
shot(91.51, null, 'slow', L => { use('CI'); sunset(); DECK.visible = true; sky.sky.visible = false; const c = put(ich, RIDGE.x, RIDGE.y, RIDGE.z, 0); actuar(c, 0, [[0, { headX: -.6, lean: -.1, aRx: 1.9, aRz: -.1, aRe: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'wide' });
  cm([RIDGE.x + 3, RIDGE.y + 1.2, RIDGE.z + 9, RIDGE.x, RIDGE.y + 6.5, RIDGE.z - 2, 56], [RIDGE.x + 2.4, RIDGE.y + 1.2, RIDGE.z + 8, RIDGE.x, RIDGE.y + 7, RIDGE.z - 2, 52], L.k); sh(RIDGE, 20); }, [[0, 'wind', .4]]);
// «Also baute ich eine Leiter»: subo la escalera de mano desde el tejado
shot(93.06, 'W', null, L => { use('CI'); sunset(); show(LEI, RIDGE.x, RIDGE.y, RIDGE.z - 2, 0, 1); LEI.scale.y = 6; const c = put(ich, RIDGE.x, RIDGE.y + 2 + L.k * 8, RIDGE.z - .9, Math.PI); const s = Math.sin(L.T * 8); actuar(c, 0, [[0, { aLx: 2.6 + s * .3, aRx: 2.6 - s * .3, lLx: .6 + s * .5, lRx: .6 - s * .5, lLk: .8, lRk: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([RIDGE.x + 10, RIDGE.y + 2, RIDGE.z + 12, RIDGE.x, RIDGE.y + 6 + L.k * 6, RIDGE.z, 50], [RIDGE.x + 8, RIDGE.y + 6, RIDGE.z + 10, RIDGE.x, RIDGE.y + 10 + L.k * 6, RIDGE.z, 50], L.k); sh(RIDGE, 30); }, [[0, 'wood_creak', .5], [.4, 'steps', .4]]);
// «und kletterte durch den Deckel»: contrapicado: la escalera llega a una trampilla con luz en el techo gigante
shot(94.46, 'Z', null, L => { use('CI'); sunset(); DECK.visible = true; sky.sky.visible = false; show(LEI, 0, 0, -58, 0, 1); LEI.scale.set(3, 24, 3); BULB.visible = false;
  const c = put(ich, 0, 380 + L.k * 140, -56.5, Math.PI); c.root.scale.setScalar(3); const s = Math.sin(L.T * 8); actuar(c, 0, [[0, { aLx: 2.6 + s * .3, aRx: 2.6 - s * .3, lLx: .6 + s * .5, lRx: .6 - s * .5 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([30, 300, 20, 0, 560, -58, 50], [26, 340, 16, 0, 560, -58, 48], L.k); sh(V(0, 300, -58), 120); }, [[0, 'wood_creak', .5], [.6, 'whoosh', .4]]);
// «in einen größeren Keller.»: salgo de la maqueta a la mesa de un sótano enorme (yo diminuto)
shot(95.52, 'F', 'punch', L => { kel(L); tiny(ichT, 40, 0, Math.PI, 1); ichT.root.position.set(KX + 5.1, TABLE_Y, 1); ichT.root.rotation.y = Math.PI + .5; actuar(ichT, 0, [[0, { headX: -.5, aLx: .5, aRx: .5, aLz: .6, aRz: .6 }]], { T: L.T }); cara(ichT, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  cm([KX + 5.5, TABLE_Y + .14, 1.75, KX + 3, TABLE_Y + 3.4, -8, 72], [KX + 5.6, TABLE_Y + .14, 2.0, KX + 2, TABLE_Y + 4.4, -8, 72], L.k); }, [[0, 'whoosh', .5]]);
// «Dann in einen noch größeren.»: la cámara se aleja: la mesa, el sótano entero, yo un puntito
shot(96.88, 'W', null, L => { kel(L); tiny(ichT, 0, 0, 0, 1); ichT.root.position.set(KX + 4.8, TABLE_Y, 1); cara(ichT, L.T, { expr: 'shock' });
  cm([KX + 6, TABLE_Y + .6, 3, KX + 4.8, TABLE_Y + .2, 1, 50], [KX + 18, 18, 20, KX + 2, 2, 0, 52], easeIn(L.k)); }, [[0, 'whoosh', .5]]);
// «Und noch einen!»: otro sótano todavía mayor (la casa de muñecas), alejándose
shot(98.35, 'C', 'punch', L => { use('PU'); day(); cm([PX + 1, -10, 4, PX, -11.6, -2, 50], [PX + 4, 4, 52, PX, -8, -2, 44], easeIn(L.k)); sh(V(PX, -15, 0), 30); }, [[0, 'whoosh', .5]]);
// «Nach achtzig Städten»: el contador 80 sobre mi cabeza al pie de una escalera colosal
shot(99.36, 'Z', null, L => { use('TR'); inside(.9, 0); const c = put(ich, TX, 26 - 13 * 1.9 - .1 + .3, -33, Math.PI); c.root.scale.setScalar(.25); actuar(c, 0, [[0, { headX: -.5, lean: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  badge('gold', String(Math.round(lerp(60, 80, clamp(L.k * 1.4)))), W / 2, H * .2, 1, 1, 1.2); cm([TX + 2.8, 2.6, -35.3, TX, 5, -24, 58], [TX + 2.6, 2.6, -35.2, TX, 5.6, -24, 56], L.k); sh(V(TX, 0, -20), 30); }, [[0, 'count', .5]]);
// «waren die Treppenstufen so riesig,»: intento subir un escalón más alto que yo
shot(100.66, 'S', null, L => { use('TR'); inside(.9, 0); const c = put(ich, TX - 1, 26 - 13 * 1.9 + .3, -32.6, Math.PI); c.root.scale.setScalar(.35); const s = Math.sin(L.T * 10); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, lLx: .8 + s * .3, lLk: 1.2, headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' }); sweat(c, L.T);
  cm([TX + 3, 3.4, -35, TX - 1, 2.4, -32.4, 56], [TX + 2.8, 3.3, -35.1, TX - 1, 2.4, -32.4, 54], L.k); sh(V(TX, 0, -30), 20); }, [[0, 'grunt', .5]]);
// «dass ich einen Zeppelin brauchte.»: subo en mi zepelín por la escalera gigante
shot(102.14, 'C', 'punch', L => { use('TR'); inside(.95, 0); const z = lerp(-30, -12, L.k), y = 26 + z * .79 + 5; show(ZEP, TX, y, z, Math.PI, .45); ZEP.rotation.x = -.35; ZEP.userData.prop.rotation.z = L.T * 40;
  const c = put(ich, TX, 0, 0, Math.PI); c.root.scale.setScalar(.12); const gp = V(TX, y - 2.7 * .45 + .15, z + .3 * .45); c.root.position.copy(gp).add(V(0, -.2, 0)); actuar(c, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T);
  const zc = z - 8; cam([TX + 2.6, Math.max(y + 2, 26 + zc * .79 + 3), zc], [TX, y - .4, z], 52); sh(V(TX, y, z), 20); }, [[0, 'propeller', .6]]);
// «Endlich erreichte ich den letzten Deckel.»: de noche, la última trampilla en el vacío
shot(103.58, 'W', 'slow', L => { voidN(); show(LEI, VX, -26, 0, 0, 1); const c = put(ich, VX, -8 + L.k * 3, 1.1, Math.PI); const s = Math.sin(L.T * 8); actuar(c, 0, [[0, { aLx: 2.6 + s * .2, aRx: 2.6 - s * .2, lLx: .4 + s * .3, lRx: .4 - s * .3, headX: -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  VOID.userData.lid.position.y = 0; VOID.userData.hole.visible = false; cm([VX + 10, -6, 14, VX, -2, 0, 50], [VX + 8, -5, 12, VX, -1, 0, 48], L.k); sh(V(VX, 0, 0), 20); }, [[0, 'wood_creak', .5]]);
// «Ich drückte ihn auf.»: empujo la tapa, sale luz
shot(105.57, 'C', 'punch', L => { voidN(); show(LEI, VX, -26, 0, 0, 1); const k = easeOut(clamp(L.lt / .6)); VOID.userData.lid.position.set(-k * 6, k * 1.5, 0); VOID.userData.lid.rotation.z = k * .8; VOID.userData.hole.visible = true;
  const c = put(ich, VX, -3.5 + k * 2.5, 1, Math.PI); actuar(c, 0, [[0, { aLx: 3.0, aRx: 3.0, aLz: .1, aRz: .1, aLe: .2, aRe: .2, headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([VX + 9, 3, 12, VX, 0, 0, 50], [VX + 8, 4, 11, VX, .5, 0, 48], L.k); sh(V(VX, 0, 0), 20); }, [[0, 'creak', .6], [.3, 'thud', .5]]);
// «Keine Stadt.»: arriba no hay nada: tablones y estrellas
shot(106.64, 'F', null, L => { voidN(); VOID.userData.lid.position.set(-6, 0, 0); const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { headY: Math.sin(L.T * 2) * .5 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  cm([VX - 30, 22, 50, VX, 2, 6, 46], [VX - 26, 20, 46, VX, 2, 6, 44], L.k); sh(V(VX, 0, 8), 20); }, [[0, 'wind', .4]]);
// «Kein Thomas.»: solo yo
shot(107.43, 'S', null, L => { voidN(); const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { ...GEST.shrug }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); orbit(V(VX, 3, 8), lerp(13, 11, L.k), .4, .1, 44); sh(V(VX, 0, 8), 20); }, [[0, 'crickets', .5]]);
// «Nur ein gigantisches, leuchtendes Rechteck.» (zoom lento): el rectángulo de luz delante de mí
shot(108.03, 'Z', 'slow', L => { voidN(); handyAt(-40); const c = put(ich, VX, 0, 8, Math.PI); actuar(c, 0, [[0, { headX: -.4, lean: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); FILL.intensity = 60;
  cm([VX + 6, 3, 26, VX, 30, -40, 52], [VX + 4, 3, 22, VX, 34, -40, 54], L.k); sh(V(VX, 0, 0), 30); }, [[0, 'hum', .6]]);
// «Ein Handy.»
shot(110.78, 'C', 'punch', L => { voidN(); handyAt(-40); const c = put(ich, VX, 0, 8, Math.PI); actuar(c, 0, [[0, GEST.point]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); cm([VX - 30, 20, 60, VX, 36, -40, 54], [VX - 26, 22, 56, VX, 36, -40, 54], L.k); sh(V(VX, 0, 0), 30); }, [[0, 'phone_buzz', .5]]);
// «Und dahinter ein Gesicht.»: detrás del cristal, una cara enorme (la tuya), iluminada por la pantalla
shot(111.55, 'W', 'slow', L => { voidN(); handyAt(-40); fanBehind(L); FILL.intensity = 30; const h = hp(fan); cm([VX + 2, 10, 14, h.x, h.y - 6, h.z, 50], [VX + 1.5, 14, 6, h.x, h.y - 6, h.z, 46], L.k); sh(V(VX, 0, -40), 60); }, [[0, 'heartbeat', .5]]);
// «Deins.»: primer plano de tu cara a través del cristal
shot(112.84, 'C', 'punch', L => { voidN(); handyAt(-40); fanBehind(L); const h = hp(fan); cm([h.x, h.y + 6, -18, h.x, h.y + 4, h.z, 40], [h.x, h.y + 6, -22, h.x, h.y + 4, h.z, 38], L.k); sh(V(VX, 0, -40), 60); }, [[0, 'braam', .7]]);
// «Da verstand ich es endlich:» (zoom lento)
shot(113.44, null, 'slow', L => { voidN(); handyAt(-40); FILL.intensity = 50; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, GEST.think]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide' }); orbit(V(VX, 3.6, 8), lerp(11, 9, L.k), .3, .08, 44); sh(V(VX, 0, 8), 20); }, [[0, 'whoosh', .3]]);
// «Die größte Stadt von allen ist deine Stadt.»: postales de tu ciudad flotando a mi alrededor
shot(114.80, 'Z', null, L => { voidN(); FILL.intensity = 60; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: .9, aRz: .9, headY: Math.sin(L.T) * .3 }]], { T: L.T }); talk(c, L.T, 114.8, 117, 'shock');
  POST_T.forEach((p, i) => { const a = i / 6 * 6.283 + L.T * .5; p.visible = true; p.position.set(VX + Math.cos(a) * 9, 5 + Math.sin(L.T * 2 + i) * .6, 8 + Math.sin(a) * 9); p.lookAt(camera.position); p.scale.setScalar(.6); });
  orbit(V(VX, 4, 8), lerp(22, 19, L.k), .2, .14, 46); POST.push(() => POST_T.forEach(p => p.lookAt(camera.position))); sh(V(VX, 0, 8), 20); }, [[0, 'sparkle', .6]]);
// «Und du hast uns die ganze Zeit zugeschaut.»: te señalo a ti
shot(117.27, 'C', 'punch', L => { voidN(); FILL.intensity = 50; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { aRx: 1.62, aRz: -.08, aRe: .05, aLz: .12, aLe: .25 }]], { T: L.T }); talk(c, L.T, 117.27, 119.3, 'sus', { eyes: 'half' }); orbit(V(VX, 3.6, 8), lerp(10, 8.5, L.k), .15, .08, 44); sh(V(VX, 0, 8), 20); }, [[0, 'pop', .4]]);
// «Dann kam ein riesiger Daumen.»: el pulgar baja desde arriba
shot(119.52, 'W', 'slow', L => { voidN(); FILL.intensity = 50; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { headX: -.5, lean: -.15, ...GEST.shock }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  show(THUMB, VX + 2, lerp(50, 16, easeInOut(L.k)), 2, 0, .7); THUMB.rotation.set(.3, 0, -.4); cm([VX + 5, 3.5, 24, VX, 10, 4, 62], [VX + 5, 3.5, 23, VX, 9, 4, 62], L.k); sh(V(VX, 0, 8), 30); }, [[0, 'rumble', .5]]);
// «Nein, nein, nein!»: corro mientras el pulgar barre
shot(121.13, 'C', 'punch', L => { voidN(); FILL.intensity = 50; const c = put(ich, VX + lerp(-2, 6, L.k), 0, 8, Math.PI / 2); actuar(c, 0, [[0, { ...runPoseK(L.T), aLx: 2.8, aRx: 2.8 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'shout' });
  show(THUMB, VX + lerp(-16, 2, easeIn(L.k)), 7, 6, 0, .7); THUMB.rotation.set(.2, 0, -1.2); orbit(V(VX + 2, 3.4, 8), 15, 0, .12, 50); SHAKE = .4; sh(V(VX, 0, 8), 30); }, [[0, 'whoosh', .6], [.3, 'scream', .4]]);
// «Nicht weiterscrollen!»: me pego al cristal, con las manos contra la pantalla (vista desde tu móvil)
shot(122.33, 'Z', null, L => { voidN(); FILL.intensity = 60; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { aLx: 1.7, aRx: 1.7, aLz: .5, aRz: .5, aLe: .3, aRe: .3, lean: .25 }]], { T: L.T }); talk(c, L.T, 122.33, 123.4, 'shout', { eyes: 'wide' });
  const h = hp(c); cam([h.x, h.y, h.z + 8 - L.k * .6], [h.x, h.y - .9, h.z], 52); SHAKE = .3; sh(V(VX, 0, 8), 20); }, [[0, 'glass_knock', .6]]);
// «Okay.»: el pulgar se va
shot(123.37, 'S', null, L => { voidN(); FILL.intensity = 50; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); show(THUMB, VX + 2, lerp(16, 60, easeIn(L.k)), 2, 0, .7); THUMB.rotation.set(.3, 0, -.4);
  cm([VX + 5, 3.5, 24, VX, 9, 4, 62], [VX + 5, 3.5, 23, VX, 10, 4, 62], L.k); sh(V(VX, 0, 8), 30); }, [[0, 'whoosh', .4]]);
// «Gut. Du bist noch da.»: alivio, sonrisa
shot(124.22, 'C', null, L => { voidN(); FILL.intensity = 60; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, lean: -.05 }]], { T: L.T }); talk(c, L.T, 124.22, 125.3, 'relief', { eyes: 'happy' }); orbit(V(VX, 4.2, 8), lerp(9, 7.5, L.k), .25, .06, 44); sh(V(VX, 0, 8), 20); }, [[0, 'sigh', .5]]);
// «Nur eine Frage:»: me acerco a la cámara, serio
shot(125.51, 'W', null, L => { voidN(); FILL.intensity = 60; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { lean: .2, headX: .1, aRx: 1.4, aRz: -.1, aRe: 1.2 }]], { T: L.T }); talk(c, L.T, 125.51, 126.3, 'sus', { eyes: 'half' }); orbit(V(VX, 3.8, 8), lerp(9, 7.8, L.k), -.2, .06, 44); sh(V(VX, 0, 8), 20); }, [[0, 'whoosh', .3]]);
// «Warst du schon mal in deinem Keller?» (zoom lento): tu cuarto de noche, tú en la cama con el móvil; detrás, la puerta del sótano se entreabre
shot(126.47, 'F', 'slow', L => { use('ZI'); inside(.35, 0); night(0); hemi.intensity = .5; scene.fog.density = 0; const f = put(fan, 2394, 2.2, -10.5, 0); actuar(f, 0, [[0, { lean: -.2, aLx: 1.3, aRx: 1.3, aLe: 1.4, aRe: 1.4, lLx: 1.5, lRx: 1.5, headX: .3 }]], { T: L.T }); FILL.intensity = 25; FILL.color.setRGB(.5, .7, 1); cara(f, L.T, { expr: 'neutral', eyes: 'half' });
  ZIM.userData.door.rotation.y = -easeInOut(L.k) * .9; ZIM.userData.pl.intensity = 30 + L.k * 60; cm([2399, 11, 5, 2395, 4.6, -10.5, 50], [2399, 10.5, 3.5, 2395.5, 4.8, -11, 48], L.k); sh(V(2400, 0, 0), 30); }, [[0, 'creak', .6]]);
// «Denn vielleicht …»: la cámara cruza la puerta, baja al sótano y cae en la maqueta… (vuelve al principio)
shot(128.14, 'Z', null, L => { day(); scene.fog.density = 0; use('CI', 'FT', 'HK'); CITY.userData.CARS.forEach(c => c.visible = false); const p = hookCam(hookU(.36 + L.k * .64)); CITY.visible = p.z >= -52.6; CITY.userData.TH.userData.doorPiv.rotation.y = 1.55; SPEED = .6;
  if (p.z < -52.6) sh(V(HMC.x, HMC.y, HMC.z), 12); else sh(V(0, 0, -30), 90); }, [[0, 'whoosh', .6], [.5, 'riser_short', .5]]);
