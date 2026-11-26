// ---------- c: la bufanda, la lluvia y la cuenta atrás (88,37 – 127,21 s) ----------
// 72 «Eines Tages brachte sie einen Schal mit»: Mia llega con una bufanda de rayas mostaza y azul en las manos, sonriendo
shot(88.37, 'W', null, L => { platz(L); statues(L); const c = walk(mia, L, P.x + 3, BZ - 4, PI, 1.4, 0, { pose: { aLx: 1.2, aRx: 1.2, aLe: 1.1, aRe: 1.1, aLz: -.15, aRz: -.15 }, f: { expr: 'happy', mouth: 'smile' } }); attach(SCARFH, c.aR.hand, [.8, -.9, .8], [0, 0, 0], 1);
  onBody(c, 12, .2, .1, 42, L.k, 10.4, .1, 3); sh(V(P.x, 0, BZ - 6), 22); }, [[0, 'whoosh', .4], [.1, 'steps', .4], [.6, 'cloth', .4]]);
// 73 «und wickelte ihn um den Sockel,»: Mia, subida al pedestal, enrolla la bufanda en la columnita que hay entre los dos
shot(89.87, 'C', 'punch', L => { platz(L); statues(L, { fe: { eyes: 'side_l', mouth: 'o', noBlink: true } }); SO.SCARF.visible = L.lt > .7; const m = put(mia, P.x + .3, TOP, P.z + 2.2, PI + .1); m.blob.visible = false; const r = Math.sin(L.T * 7);
  actuar(m, 0, [[0, { aLx: 1.6 + r * .3, aRx: 1.6 - r * .3, aLe: 1.2, aRe: 1.2, aLz: -.4, aRz: -.4, headX: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'smile' }); if (L.lt <= .7) attach(SCARFH, m.aR.hand, [.6, -.8, .6], [0, 0, 0], 1);
  cm([P.x + 6, TOP + 7, P.z + 14, P.x, TOP + 4.6, P.z, 44], [P.x + 4.6, TOP + 6.6, P.z + 12, P.x, TOP + 4.8, P.z, 42], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'impact', .4], [.2, 'cloth', .6], [.8, 'cloth', .4]]);
// 74 «genau zwischen Jonas und mich.»: la bufanda enrollada, justo en medio de las dos estatuas; travelling de un lado a otro
shot(91.55, 'S', null, L => { platz(L); statues(L, { fe: { eyes: 'side_l', mouth: 'smile', noBlink: true }, je: { eyes: 'side_r', mouth: 'flat', noBlink: true } }); SO.SCARF.visible = true;
  cm([P.x - 5, TOP + 6, P.z + 12, P.x, TOP + 4.4, P.z, 44], [P.x + 5, TOP + 6, P.z + 12, P.x, TOP + 4.4, P.z, 44], L.k); }, [[0, 'swipe', .4], [.3, 'soft_chime', .4]]);
// 75 «„Damit euch nicht kalt ist.“»: Mia, abajo, nos sonríe con las manos juntas; vaho en el aire frío, hojas que caen
shot(93.11, 'F', null, L => { platz(L, { dusk: true }); const m = put(mia, P.x, 0, P.z + 9, PI); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.5, aRe: 1.5, aLz: -.35, aRz: -.35, headX: -.3 }]], { T: L.T }); talk(m, L.T, 93.1, 94.3, 'warm');
  onFace(m, 5.6, -.4, .3, 40, L.k, 4.8); }, [[0, 'flash', .3], [.3, 'wind_soft', .4]]);
// 76 «Und ich habe mich in sie verliebt,»: mi cara de piedra con las mejillas sonrosadas y corazones que suben
shot(94.39, 'C', 'slow', L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'happy', mouth: 'smile', noBlink: true } }); hearts(hp(finn).add(V(0, 1, 1)), L.T, 6, 2.6); onFace(finn, 6, -.3, 0, 40, L.k, 4.6); }, [[.1, 'heartbeat', .5], [.5, 'sparkle', .4]]);
// 77 «ohne auch nur blinzeln zu können.»: primerísimo plano de mis ojos: una hoja seca cae justo delante y no puedo parpadear
shot(95.96, 'C', 'punch', L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'wide', mouth: 'flat', noBlink: true } }); const h = hp(finn).add(V(0, .7, 1.2));
  FX2D.push(c => { const [x, y] = proj(h.clone().add(V(Math.sin(L.T * 3) * .6, 1.6 - L.lt * 1.8, 0))); c.save(); c.translate(x, y); c.rotate(L.T * 2); c.fillStyle = '#c8701a'; c.strokeStyle = '#6a3a0a'; c.lineWidth = 6; c.beginPath(); c.ellipse(0, 0, 70, 34, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-70, 0); c.lineTo(70, 0); c.stroke(); c.restore(); });
  onFace(finn, 3.2, .3, 0, 38, L.k, 2.9); }, [[0, 'impact', .4], [.3, 'leaves', .5]]);
// 78 «Ich zählte die Stunden bis halb fünf.»: el reloj del Rathaus gira deprisa; los números saltan 13:00 → 16:30
shot(97.51, 'R', null, L => { platz(L); statues(L); const c = HB.clock.pos; const hrs = ['13:00', '14:00', '15:00', '16:00', '16:30'][Math.min(4, Math.floor(L.lt / .38))];
  cm([c.x - 6, c.y - 10, c.z + 36, c.x, c.y - 1, c.z, 42], [c.x - 3, c.y - 7, c.z + 28, c.x, c.y - .6, c.z, 40], L.k); bigNum(hrs, 1, hrs === '16:30' ? 'gold' : 'big', .26, 1.15); }, [[0, 'clock_spin', .5], [.4, 'clock_tick', .5], [.8, 'clock_tick', .5], [1.2, 'clock_tick', .5], [1.55, 'ding_soft', .5]]);
// 79 «Die Regentage,»: lluvia sobre la plaza vacía; el banco de enfrente mojado y vacío
shot(99.39, 'W', null, L => { platz(L, { rain: true }); statues(L); RAIN.userData.update(L.T, V(P.x, 0, BZ)); cm([P.x - 6, 6, BZ + 14, P.x, 2.6, BZ, 44], [P.x - 4, 5.6, BZ + 12, P.x, 2.6, BZ, 42], L.k); sh(V(P.x, 0, BZ), 24); }, [[0, 'whoosh', .4], [.05, 'rain', .7], [.6, 'thunder', .3]]);
// 80 «an denen sie nicht kam,»: plano de la calle por donde viene Mia: nadie, solo paraguas que pasan
shot(100.05, 'S', null, L => { platz(L, { rain: true }); RAIN.userData.update(L.T, V(P.x, 0, P.z + 60)); walk(EXS[1], L, P.x - 10, P.z + 62, PI / 2, 3, 0, { pose: { aRx: 2.8, aRe: .3 }, expr: 'tired' }); walk(EXS[5], L, P.x + 12, P.z + 70, -PI / 2, 3, 1, { pose: { aRx: 2.8, aRe: .3 }, expr: 'tired' });
  cm([P.x, 6, P.z + 34, P.x, 4, P.z + 80, 46], [P.x, 5.6, P.z + 38, P.x, 4, P.z + 80, 44], L.k); sh(V(P.x, 0, P.z + 60), 30); }, [[0, 'swipe', .4], [.05, 'rain', .7], [.3, 'puddle_steps', .5]]);
// 81 «waren die schlimmsten der Woche.» (zoom lento): yo bajo la lluvia, el agua me cae por la cara de piedra como lágrimas
shot(101.15, 'C', 'slow', L => { platz(L, { rain: true }); statues(L, { fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); RAIN.userData.update(L.T, hp(finn)); tears(finn, L.T); onFace(finn, 6, -.2, .3, 40, L.k, 4.6); }, [[0, 'rain', .7]]);
// 82 «An einem Samstag»: Mia llega cabizbaja, arrastrando los pies; «SAMSTAG»
shot(102.48, 'W', null, L => { platz(L, { dusk: true }); statues(L); const c = walk(mia, L, P.x, BZ - 3 + 10, PI, 1.0, 0, { pose: { headX: .45, aLx: .1, aRx: .1, lean: .12 }, f: { expr: 'sad' } });
  onBody(c, 13, .3, .12, 42, L.k, 11.4, .2, 3.2); bigNum('SAMSTAG', clamp((L.lt - .2) / .2), 'gold', .19, .9); sh(V(P.x, 0, BZ), 22); }, [[0, 'whoosh', .4], [.1, 'steps', .4], [.3, 'pling', .3]]);
// 83 «kam sie mit verweinten Augen.»: primer plano de Mia llorando en el banco, se frota los ojos rojos
shot(103.22, 'C', 'punch', L => { platz(L, { dusk: true }); miaBench(L, { aRx: 2.4, aRe: 2.3, aRz: -.5, headX: .15 }); cara(mia, L.T, { expr: 'cry', eyes: 'cry', mouth: 'wavy' }); tears(mia, L.T); onFace(mia, 5.2, 0, .5, 40, L.k, 4.4); }, [[0, 'impact', .4], [.2, 'sob_girl', .6]]);
// 84 «„In sechs Tagen»: Mia levanta un cartelito hecho a mano: «6 TAGE» con casillas
shot(104.79, 'Z', null, L => { platz(L, { dusk: true }); miaBench(L, { aLx: 1.6, aRx: 1.6, aLe: .9, aRe: .9, aLz: -.2, aRz: -.2 }); talk(mia, L.T, 104.7, 105.6, 'cry'); tears(mia, L.T); const h = hp(mia); show(SIGN6, h.x, h.y - 2.6, h.z - 1.4, PI);
  onBody(mia, 9, 0, .1, 40, L.k, 8, 0, 4.2); }, [[0, 'zoom_in', .4], [.1, 'paper', .5], [.3, 'sniff', .4]]);
// 85 «bin ich seit einem Jahr allein.“»: Mia sola en el banco, plano amplio, la plaza vacía a su alrededor; «1 JAHR»
shot(105.55, 'S', null, L => { platz(L, { dusk: true }); miaBench(L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, headX: .4 }); talk(mia, L.T, 105.5, 106.9, 'cry');
  cm([P.x - 3, 10, BZ - 20, P.x, 3, BZ, 46], [P.x - 2, 12, BZ - 22, P.x, 3, BZ, 48], L.k); bigNum('1 JAHR', clamp((L.lt - .4) / .2), 'red', .19, 1); sh(V(P.x, 0, BZ), 26); }, [[0, 'swipe', .4], [.4, 'sad_sting', .5]]);
// 86 «Ich wollte schreien.»: mi cara de piedra se agrieta un poco por la fuerza: ojos desesperados, la cámara tiembla
shot(106.95, 'C', 'punch', L => { platz(L, { dusk: true }); statues(L, { fe: { expr: 'angry', eyes: 'wide', mouth: 'grimace', noBlink: true } }); SHAKE = .35; TINT = 'rgba(180,20,30,.12)'; stoneDust(hp(finn), L.t0 + .1, L.T, 8, .6);
  onFace(finn, 4.6, -.2, 0, 40, L.k, 3.8); }, [[0, 'strain', .6], [.1, 'stone_crack', .6], [.3, 'heartbeat', .6]]);
// 87 «Ich wollte von meinem Sockel springen»: (lo imagino, en tono soñado) salto del pedestal, ya con color, con los brazos abiertos
shot(108.16, 'F', null, L => { platz(L, { dusk: true }); statues(L, { finn: false }); const u = clamp(L.lt / 1.1); const f = put(finn, P.x + SPX, TOP * (1 - u) + 4 * u * (1 - u) * 3, P.z + u * 10, 0); actuar(f, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .5, aRz: .5, lLx: .8, lLk: 1.2, lRk: .4 }]], { T: L.T }); cara(f, L.T, { expr: 'happy', mouth: 'open_smile' });
  TINT = 'rgba(255,190,230,.18)'; cm([P.x + 14, 6, P.z + 24, P.x + 2, 6, P.z + 4, 46], [P.x + 12, 5.6, P.z + 26, P.x + 2, 5, P.z + 8, 44], L.k); sh(V(P.x, 0, P.z + 6), 24); }, [[0, 'dream_harp', .5], [.3, 'whoosh_up', .4]]);
// 88 «und ihre Hand nehmen.»: (soñado) le cojo la mano a Mia en el banco; ella sonríe sorprendida
shot(109.5, 'C', 'punch', L => { platz(L, { dusk: true }); const m = miaBench(L, { aLx: 1.0, aLz: .4, aLe: .2, headX: -.1, headY: .4 }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' });
  const f = put(finn, P.x + 3.4, 0, BZ - 2.6, -PI / 2 - .6); actuar(f, 0, [[0, { aRx: 1.1, aRz: -.15, aRe: .2, lean: .1 }]], { T: L.T }); grin(f, L.T); TINT = 'rgba(255,190,230,.18)'; hearts(V(P.x + 1.6, 6, BZ - 1.6), L.T, 4, 1.6);
  cm([P.x + 1, 6.8, BZ - 12, P.x + 1.6, 4.4, BZ - 1, 42], [P.x + 1.2, 6.6, BZ - 10.6, P.x + 1.6, 4.4, BZ - 1, 40], L.k); }, [[0, 'impact', .3], [.2, 'sparkle', .5], [.7, 'record_scratch', .3]]);
// 89 «Sie zählte die Tage,»: en su cuarto, Mia tacha un día en su calendario con rotulador; Brezel la mira
shot(110.53, 'W', null, L => { miaRoom(L); const m = put(mia, MZX - 2, 0, -8.6, PI); if (m.pack) m.pack.visible = false; const k = clamp((L.lt - .3) / .5); actuar(m, 0, [[0, { aRx: 2.2 + Math.sin(L.T * 14) * .08 * k, aRe: .5, aRz: -.1, aLx: .2 }]], { T: L.T });
  show(CAL, MZX - 2.6, 8.8, -11.7); CALP.userData.draw((x, w, h) => { x.fillStyle = '#fff0f6'; x.fillRect(0, 0, w, h); x.fillStyle = '#2ab86a'; x.fillRect(0, 0, w, 70); txt(x, 'NOCH 6 TAGE', w / 2, 40, 40, '#ffffff'); x.strokeStyle = '#1a1a22'; x.lineWidth = 4; for (let q = 0; q < 7; q++) { const cx = 40 + (q % 4) * 86, cy = 130 + Math.floor(q / 4) * 140; x.strokeRect(cx, cy, 60, 60); if (q < 1 || (q === 1 && k > .5)) { x.strokeStyle = '#d8323a'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 60, cy + 60); x.moveTo(cx + 60, cy); x.lineTo(cx, cy + 60); x.stroke(); x.strokeStyle = '#1a1a22'; } } });
  show(DOG, MZX + 3, 0, -4, -PI * .7); DOG.userData.pose(L.T, .4, 0); DOG.userData.slipper.visible = false;
  cm([MZX + 3, 9, -1, MZX - 2.4, 7.6, -11, 46], [MZX + 2, 8.8, -2.4, MZX - 2.4, 7.8, -11, 44], L.k); }, [[0, 'whoosh', .4], [.3, 'marker', .6]]);
// 90 «genau wie ich sie damals gezählt hatte.»: (recuerdo) yo en mi cuarto, igual, tachando mi calendario; tono sepia
shot(111.63, 'R', null, L => { myRoom(L); const c = put(finn, KZX - 2, 0, -8.6, PI); const k = clamp((L.lt - .3) / .6); actuar(c, 0, [[0, { aRx: 2.2 + Math.sin(L.T * 14) * .08 * k, aRe: .5, aRz: -.1, aLx: .2 }]], { T: L.T });
  show(CAL, KZX - 2.6, 8.8, -11.7); CALP.userData.draw((x, w, h) => { x.fillStyle = '#fbf6e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#d8323a'; x.fillRect(0, 0, w, 70); txt(x, 'NOCH 6 TAGE', w / 2, 40, 40, '#ffffff'); x.strokeStyle = '#1a1a22'; x.lineWidth = 4; for (let q = 0; q < 7; q++) { const cx = 40 + (q % 4) * 86, cy = 130 + Math.floor(q / 4) * 140; x.strokeRect(cx, cy, 60, 60); if (q < 1 || (q === 1 && k > .5)) { x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 60, cy + 60); x.moveTo(cx + 60, cy); x.lineTo(cx, cy + 60); x.stroke(); } } });
  grade.uniforms.sepia.value = .55; cm([KZX + 3, 9, -1, KZX - 2.4, 7.6, -11, 46], [KZX + 2, 8.8, -2.4, KZX - 2.4, 7.8, -11, 44], L.k); }, [[0, 'whirl', .4], [.3, 'marker', .6]]);
// 91 «Da verstand ich, warum sie kam.» (zoom lento): mis ojos de piedra se abren: lo entiendo
shot(113.5, 'Z', 'slow', L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: L.lt > .6 ? 'wide' : 'half', mouth: 'o', noBlink: true } }); onFace(finn, 6.4, -.3, -.3, 40, L.k, 4.4); }, []);
// 92 «Sie wusste, dass hier jemand war, der sie versteht.»: Mia mira hacia el pedestal con una sonrisa triste; plano a dos: ella abajo, yo arriba al fondo
shot(114.99, 'F', null, L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'smile', noBlink: true } }); miaBench(L, { headX: -.3 }); cara(mia, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' });
  cm([P.x - 2.4, 6.4, BZ - 9, P.x + 2, 7, P.z, 46], [P.x - 2, 6.2, BZ - 7.6, P.x + 2, 7.4, P.z, 44], L.k); sh(V(P.x, 0, (BZ + P.z) / 2), 26); }, [[0, 'flash', .3], [.3, 'soft_chime', .4]]);
// 93 «Drei Tage vorher»: «NOCH 3 TAGE»: Mia en el banco por la tarde
shot(117.15, 'C', 'punch', L => { platz(L, { dusk: true }); statues(L); miaBench(L); cara(mia, L.T, { expr: 'warm' }); cm([P.x + 8, 7, BZ + 10, P.x, 4, BZ, 44], [P.x + 7, 6.8, BZ + 9, P.x, 4, BZ, 42], L.k); bigNum('NOCH 3 TAGE', clamp((L.lt - .1) / .2), 'gold', .19, .95); sh(V(P.x, 0, BZ), 22); }, [[0, 'impact', .4], [.1, 'pling', .4]]);
// 94 «blieb sie länger als je zuvor.»: se hace de noche y Mia sigue en el banco: se encienden las farolas una a una
shot(117.95, 'W', null, L => { const n = L.lt > .9; platz(L, n ? { night: true } : { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'smile', noBlink: true } }); miaBench(L, { headX: -.25 }); cara(mia, L.T, { expr: 'warm' });
  cm([P.x + 16, 12, BZ + 18, P.x, 5, (BZ + P.z) / 2, 48], [P.x + 14, 11, BZ + 16, P.x, 5, (BZ + P.z) / 2, 46], L.k); sh(V(P.x, 0, (BZ + P.z) / 2), 34); }, [[0, 'whoosh', .4], [.9, 'lamp_on', .5], [1.1, 'crickets', .4]]);
// 95 «Bevor sie ging, legte sie ihre Hand auf den Sockel.»: primer plano: la mano de Mia sobre el mármol, junto a la placa «FINN»
shot(119.71, 'S', null, L => { platz(L, { night: true }); const m = put(mia, P.x + SPX, 0, P.z + 6.2, PI); const u = easeOut(clamp((L.lt - .2) / .5)); actuar(m, 0, [[0, { aRx: lerp(.2, 1.4, u), aRe: .2, aRz: .1, headX: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'warm', eyes: 'closed', mouth: 'smile' });
  cm([P.x + SPX + 4, 5, P.z + 10, P.x + SPX, 3.2, P.z + 4.4, 42], [P.x + SPX + 3, 4.4, P.z + 9, P.x + SPX, 3, P.z + 4.4, 40], L.k); }, [[0, 'swipe', .4], [.5, 'stone_tap', .5], [.7, 'heartbeat', .5]]);
// 96 «„Ich werde mutig sein.“»: Mia aprieta el puño, decidida, mirando arriba
shot(122.08, 'C', 'punch', L => { platz(L, { night: true }); const m = put(mia, P.x + SPX, 0, P.z + 6.2, PI); actuar(m, 0, [[0, { aRx: 1.6, aRe: 2.0, aRz: -.3, aLx: .2, headX: -.25 }]], { T: L.T }); talk(m, L.T, 122.0, 123.4, 'determined');
  onFace(m, 5.4, -.4, .4, 40, L.k, 4.6); }, [[0, 'impact', .4], [.5, 'fist', .4]]);
// 97 «Einen Tag vorher kam sie nicht.»: el banco vacío, solo palomas picoteando; «NOCH 1 TAG»
shot(123.49, 'W', null, L => { platz(L); statues(L, { fe: { eyes: 'side_l', mouth: 'flat', noBlink: true } }); for (let i = 0; i < 4; i++) dove(i, P.x - 3 + i * 2, 0, BZ - 2 - (i % 2) * 1.6, i * 1.3, L.T);
  cm([P.x - 4, 5, BZ - 12, P.x, 2.4, BZ, 44], [P.x - 3, 4.8, BZ - 10, P.x, 2.4, BZ, 42], L.k); bigNum('NOCH 1 TAG', clamp((L.lt - .2) / .2), 'red', .19, .95); sh(V(P.x, 0, BZ), 20); }, [[0, 'whoosh', .4], [.2, 'pigeon_coo', .5], [.3, 'pling', .3]]);
// 98 «Ich habe die ganze Nacht»: de noche, mis ojos clavados en la calle; la luna
shot(125.11, 'C', 'punch', L => { platz(L, { night: true }); statues(L, { fe: { eyes: 'side_r', mouth: 'flat', noBlink: true } }); onFace(finn, 5.6, -.3, .6, 40, L.k, 4.6); }, [[0, 'impact', .4], [.2, 'owl', .4]]);
// 99 «auf die Straße gestarrt.»: la calle vacía de noche, desde detrás del pedestal hacia la entrada de la plaza: nadie
shot(125.73, 'S', null, L => { platz(L, { night: true }); statues(L); cm([P.x + 6, 12, P.z - 6, P.x + 6, 3, P.z + 70, 50], [P.x + 6, 11, P.z - 2, P.x + 6, 3, P.z + 72, 48], L.k); sh(V(P.x, 0, P.z + 30), 50); }, [[0, 'swipe', .4], [.2, 'wind_night', .5]]);
