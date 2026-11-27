// ---------- d: la otra torre, «nadie sabe quién empezó», el mensaje con la ola y la cuenta 998 – 999 (152,43 – 195,4 s) ----------
// muro con Lotte y yo dentro, agarrados de las muñecas (yo a su derecha)
function juntos(L, o = {}) { const list = []; let d = 0; for (let i = 0; i < 20; i++) list.push(i === 12 ? lotte : i === 13 ? ich : DX[d++]); winterIch(ich);
  return turmNah(L, 40, { rows: 4, cols: 5, list, face: n => n === 13 ? (o.lf || { expr: 'warm' }) : n === 14 ? (o.if || { expr: 'determined' }) : (o.ff ? o.ff(n) : { expr: 'tired' }), ...o }); }
const RED = 'rgba(160,0,20,.22)';
const GLOWBALL = P_(new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: .35, depthWrite: false, toneMapped: false })));

// 129 «„Das schlimmste Niesen meines Lebens.“»: yo, con lágrimas y media sonrisa
shot(152.43, 'C', null, L => { const { p, c } = nosotros(L, { lf: { eyes: 'happy', mouth: 'smile' } }); talk(c, L.T, 152.4, 153.9, 'sad', { mouth: kitLips(L.T, spoken(152.4, 153.9)) || 'smile' }); tears(c, L.T); const h = hp(c);
  cm([h.x - 6.4, h.y + .2, h.z - .6, h.x, h.y - .3, h.z, 38], [h.x - 5.8, h.y + .2, h.z - .5, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, [[0, 'sniff', .4]]);
// 130 «„Warum dreht ihr das Seil?“»
shot(154.274, 'S', null, L => { const { p, c } = nosotros(L, { lf: { expr: 'neutral' }, ip: { headY: -.4 } }); talk(c, L.T, 154.2, 155.3, 'confused'); const h = hp(c); cm([h.x - 6.4, h.y + .4, h.z + 1.4, h.x, h.y - .3, h.z, 38], [h.x - 6, h.y + .4, h.z + 1.2, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, [[0, 'wind_high', .3]]);
// 131 «„Schau mal geradeaus.“»: Lotte señala con la barbilla, al frente
shot(155.442, 'C', null, L => { const { p } = nosotros(L); applyPose(lotte, { aLz: 1.45, aRz: 1.45, aLe: .1, aRe: .1, headX: -.15 + Math.sin(L.T * 6) * .08 }); talk(lotte, L.T, 155.4, 156.5, 'determined'); cm([p.x - 6.4, p.y + .5, p.z + 1.2, p.x, p.y - .3, p.z, 38], [p.x - 6, p.y + .5, p.z + 1.1, p.x, p.y - .3, p.z, 36], L.k); sh(p, 12); }, [[0, 'whoosh_soft', .3]]);
// 132 «Am anderen Ende dieser flachen Welt»: desde lo alto de la torre: el mundo plano entero, la cuerda, los pueblos… y al fondo, otra torre
shot(156.517, 'W', null, L => { welt(L, 0, 0, { grass: false, rings: true }); setRope(.4 + L.lt * .7); TURM2.visible = true; scene.fog.density = .00018; cm([TX - 70, 150, 30, -TX, 150, 0, 40], [TX - 90, 146, 26, -TX, 160, 0, 36], L.k); sh(V(0, 0, 0), 200); }, [[0, 'wind_high', .6]]);
// 133 «stand noch ein Turm.» (zoom lento): teleobjetivo: la otra torre, igual que la nuestra, girando su manivela
shot(158.117, 'Z', 'slow', L => { welt(L, -900, 0, { grass: false, rings: true }); setRope(.8 + L.lt * .7); scene.fog.density = .00016; cm([TX - 100, 140, 0, -TX, 210, 0, 11], [TX - 100, 140, 0, -TX, 210, 0, 8], L.k); }, [[0, 'rumble', .6]]);
// 134 «„Die drehen auch.»: la manivela de la otra torre, girando
shot(159.294, 'C', null, L => { welt(L, -XT + 100, 0, { grass: false, rings: false }); setRope(L.lt * 2.2); const h = wpos(TURM2.userData.crank); cm([h.x + 70, h.y - 20, 70, h.x, h.y - 4, 0, 42], [h.x + 64, h.y - 16, 62, h.x, h.y - 4, 0, 42], L.k); sh(h, 60); }, [[0, 'crank', .8]]);
// 135 «Wenn wir zuerst aufhören,»: Lotte, seria
shot(160.231, 'S', null, L => { const { p } = nosotros(L, { lf: { expr: 'worried' } }); talk(lotte, L.T, 160.2, 161.3, 'worried'); cm([p.x - 6.6, p.y + .5, p.z + .8, p.x, p.y - .3, p.z, 38], [p.x - 6, p.y + .5, p.z + .7, p.x, p.y - .3, p.z, 36], L.k); sh(p, 12); }, [[0, 'heartbeat', .4]]);
// 136 «fällt das Seil auf alle, die wir kennen.“»: (imaginado, tono rojo) la cuerda cae floja sobre nuestro pueblo; todos se agachan aterrados
shot(161.471, 'W', null, L => { welt(L, 0, 0, { dusk: true }); const k = easeIn(clamp(L.lt / .9)); setRope(0); ROPE.position.y = 0; const y = lerp(60, 0, k);
  ROPE.userData.set(0); ROPE.position.y = y; [[oma, -5, 4], [mutter, 4, 3], [DX[10], -1, -4], [DX[11], 7, -6], [DX[12], -8, -6], [suppeM, 1, 8]].forEach(([c, x, z], i) => { put(c, x, 0, z, (i % 2 ? .3 : -.3)); actuar(c, 0, [[0, GEST.cower]], { T: L.T + i }); cara(c, L.T + i, { expr: 'terror', mouth: 'scream' }); });
  if (L.lt > .9) dust(V(0, 0, 0), L.t0 + .9, L.T, 20, 3); orbit(V(0, 12, 0), lerp(34, 30, L.k), .2, .06, 50); TINT = RED; sh(V(0, 0, 0), 30); }, [[.2, 'rope_falling', .7], [.9, 'boom', .8], [.95, 'screams', .6]]);
// 137 «„Und wer sind die?“»
shot(163.13, 'C', null, L => { const { c } = nosotros(L, { lf: { expr: 'sad' } }); talk(c, L.T, 163.1, 163.8, 'confused'); const h = hp(c); cm([h.x - 6.4, h.y + .2, h.z - .6, h.x, h.y - .3, h.z, 38], [h.x - 6, h.y + .2, h.z - .5, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, []);
// 138 «„Alle, die die kennen.“»: al otro lado del mundo, otros pueblos que saltan igual que el nuestro
shot(163.923, 'W', null, L => { welt(L, -700, 30); const tp = .4, zc = 30; cuerda(L, tp, zc, VV); vecinos(L, [[-706, 26, .2], [-700, 30, 0], [-694, 27, -.2], [-710, 34, .3], [-690, 35, -.3], [-703, 38, .1]], tp, zc, VV, 0, { f: { expr: 'happy' } });
  show(PARC, -700, 0, 14, 0); orbit(V(-700, 3.6, 30), lerp(24, 21, L.k), .1, .12, 44); sh(V(-700, 0, 30), 24); }, [[.3, 'rope_swish', .5], [.4, 'jump_crowd', .5]]);
// 139 «„Und wer hat angefangen?“»
shot(164.977, 'C', null, L => { const { c } = nosotros(L, { lf: { expr: 'sad' } }); talk(c, L.T, 164.9, 165.86, 'determined'); const h = hp(c); cm([h.x - 6.4, h.y + .4, h.z + 1, h.x, h.y - .3, h.z, 38], [h.x - 6, h.y + .4, h.z + .9, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, []);
// 140 «„Das weiß keiner mehr.“»: Lotte, triste, mira abajo
shot(165.857, 'S', null, L => { const { p } = nosotros(L); applyPose(lotte, { aLz: 1.45, aRz: 1.45, aLe: .1, aRe: .1, headX: .3, headZ: .15 }); talk(lotte, L.T, 165.86, 166.9, 'sad'); cm([p.x - 6.4, p.y + 1, p.z - .4, p.x, p.y - .3, p.z, 38], [p.x - 6, p.y + 1, p.z - .3, p.x, p.y - .3, p.z, 36], L.k); sh(p, 12); }, [[0, 'chime_sad', .4]]);
// 141 «Jede Seite glaubt,»: nuestra torre, vista desde el otro lado del mundo… también parece un monstruo (rojo)
shot(167.089, 'W', null, L => { welt(L, 1300, 0, { grass: false, dusk: true, rings: true }); setRope(2 + L.lt * .8); scene.fog.density = .0004; cm([1200, 20, -160, TX, 230, 0, 40], [1206, 22, -150, TX, 240, 0, 38], L.k); TINT = 'rgba(200,0,30,.22)'; sh(V(TX, 0, 0), 80); }, [[0, 'braam', .6], [.3, 'growl', .4]]);
// 142 «das Monster ist die andere.»: la otra torre, roja y amenazante
shot(168.229, 'Z', 'punch', L => { welt(L, -1300, 0, { grass: false, dusk: true, rings: true }); setRope(2.6 + L.lt * .8); scene.fog.density = .0004; cm([-1200, 20, 160, -TX, 230, 0, 40], [-1206, 22, 150, -TX, 240, 0, 38], L.k); TINT = 'rgba(200,0,30,.28)'; SHAKE = .3; sh(V(-TX, 0, 0), 80); }, [[0, 'braam', .8], [.2, 'growl', .5]]);
// 143 «Also habe ich das Einzige gemacht,»: saco mi trompetilla
shot(169.37, 'S', null, L => { const W_ = lotteWand(L, { lf: { expr: 'worried' } }); const q = surf(45.6, 2.05, 2.6); const c = put(ich, q.x, q.y, q.z, -PI / 2 + .2); c.blob.visible = false; winterIch(c); attach(HORNS[0], c.aR.hand, [0, -.4, .4], [-1.2 + clamp(L.lt / .6) * 1.2, 0, 0], .85);
  actuar(c, 0, [[0, { aLz: 1.45, aLe: .1, aRx: .4, aRe: .3 }], [.3, { aLz: 1.45, aLe: .1, aRx: 1.4, aRz: -.2, aRe: 1.6, headX: .1 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); const h = hp(c);
  cm([h.x - 8, h.y - .6, h.z - 1.6, h.x, h.y - 1.4, h.z, 40], [h.x - 7.4, h.y - .6, h.z - 1.4, h.x, h.y - 1.4, h.z, 38], L.k); sh(h, 14); }, [[.3, 'horn_grab', .6]]);
// 144 «was ein Rufer machen kann.»: me pongo de pie sobre unos hombros y levanto la trompetilla hacia el mundo
shot(170.89, 'C', null, L => { const W_ = lotteWand(L, { lf: { expr: 'worried' } }); const q = surf(48.6, 2.05, 3); const c = put(ich, q.x, q.y, q.z, -PI / 2); c.blob.visible = false; winterIch(c); rufen(c, L, 0, clamp((L.lt - .5) / .3)); const h = hp(c);
  cm([h.x - 12, h.y - 3, h.z + 4, h.x, h.y - .6, h.z, 44], [h.x - 11, h.y - 2.6, h.z + 3.6, h.x, h.y - .6, h.z, 42], L.k); sh(h, 16); }, [[.2, 'wind_high', .4], [.5, 'inhale', .5]]);
// 145 «Ich habe eine Nachricht mit der Welle losgeschickt:»: desde detrás de mí: grito hacia el mundo de abajo
shot(172.093, 'W', null, L => { const W_ = lotteWand(L); const q = surf(48.6, 2.05, 3); const c = put(ich, q.x, q.y, q.z, -PI / 2); c.blob.visible = false; winterIch(c); rufen(c, L, 0, 1); const h = hp(c);
  for (let k = 0; k < 3; k++) { const ph = (L.lt * 1.2 + k / 3) % 1; FX2D.push(x => { x.save(); x.strokeStyle = `rgba(255,240,180,${(1 - ph) * .8})`; x.lineWidth = 12; x.beginPath(); x.arc(W / 2, H * .44, 80 + ph * 420, -2.6, -.5); x.stroke(); x.restore(); }); }
  cm([h.x - 12, h.y - 2, h.z + 4, h.x, h.y - .6, h.z, 44], [h.x - 11.4, h.y - 1.8, h.z + 3.8, h.x, h.y - .6, h.z, 44], L.k); sh(h, 30); }, [[0, 'horn_blow', .9], [.1, 'shout_kid', .7]]);
// 146 «„Beide Seiten:»
shot(174.34, 'C', 'punch', L => { const W_ = lotteWand(L); const q = surf(48.6, 2.05, 3); const c = put(ich, q.x, q.y, q.z, -PI / 2); c.blob.visible = false; winterIch(c); rufen(c, L, 0, 1); onFace(c, 7, -.4, -4.5, 40, L.k, 6); badge('tag', 'BEIDE SEITEN:', W / 2, H * .15, clamp(L.lt / .1), 1, 1.2); sh(hp(c), 14); }, [[0, 'horn_blow', .8]]);
// 147 «Hört auf bei Sprung tausend.“»: «STOPP BEI SPRUNG 1000»
shot(174.96, 'Z', 'punch', L => { const W_ = lotteWand(L); const q = surf(48.6, 2.05, 3); const c = put(ich, q.x, q.y, q.z, -PI / 2); c.blob.visible = false; winterIch(c); rufen(c, L, 0, 1); onFace(c, 8, -.6, -4.8, 40, L.k, 6.4);
  bigNum('SPRUNG 1000', clamp((L.lt - .9) / .15), 'red', .17, 1.15); badge('tag', 'HÖRT AUF BEI…', W / 2, H * .1, clamp(L.lt / .1), 1, 1); sh(hp(c), 14); }, [[0, 'horn_blow', .8], [.9, 'impact', .7]]);
// 148 «Sie muss quer über die ganze Welt.»: a vista de pájaro: la ola de brazos cruza la pradera de pueblo en pueblo
shot(177.189, 'W', null, L => { welt(L, 300, 0); const list = DX; list.forEach((c, i) => { const x = 420 - i * 14, z = Math.sin(i * 1.7) * 30; put(c, x, 0, z, -PI / 2); const k = clamp(1 - Math.abs(x - (440 - L.lt * 260)) / 40); actuar(c, 0, [[0, { aLx: 2.8 * k + .1, aRx: 2.8 * k + .1, aLz: .4, aRz: .4 }]], { T: L.T + i }); cara(c, L.T + i, k > .3 ? { expr: 'shout', mouth: 'scream' } : { expr: 'neutral' }); c.root.scale.setScalar(1.6); });
  cm([520, 130, 140, 160, 0, 0, 50], [500, 126, 136, 140, 0, 0, 50], L.k); sh(V(250, 0, 0), 200); }, [[0, 'crowd_wave', .9]]);
// 149 «Von Mund zu Mund.»: tres Rufer, uno detrás de otro, se pasan el mensaje
shot(179.075, 'S', null, L => { welt(L, 0, -30); [[DX[2], -14, -40], [DX[4], 0, -30], [DX[6], 14, -20]].forEach(([c, x, z], i) => { put(c, x, 2.3, z, -.4); c.root.scale.setScalar(.72); c.blob.visible = false; const on = clamp((L.lt - i * .28) / .12) * clamp((i * .28 + .4 - L.lt) / .1 + 1);
    if (on > .1) rufen(c, L, i + 1, on); else { actuar(c, 0, [[0, GEST.listen]], { T: L.T }); hornHang(c, i + 1); cara(c, L.T, { expr: 'determined' }); } });
  PEDS.forEach((p, i) => show(p, [-14, 0, 14][i], 0, [-40, -30, -20][i])); badge('tag', '…SPRUNG 1000!', W / 2, H * .14, clamp(L.lt / .15), 1, 1);
  cm([-30, 9, -58, 2, 4, -30, 44], [-26, 9, -54, -2, 4, -30, 44], L.k); sh(V(0, 0, -30), 30); }, [[0, 'horn_blow', .6], [.28, 'horn_blow', .6], [.56, 'horn_blow', .6]]);
// 150 «Wenn sie richtig ankommt,»: al otro lado, junto a la otra torre, un Rufer lo recibe y asiente
shot(180.238, 'W', null, L => { welt(L, -1100, 20, { dusk: true }); show(PED2[0], -1100, 0, 20); const a = put(DX[8], -1100, 2.3, 20, .6); a.blob.visible = false; actuar(a, 0, [[0, GEST.listen], [.6, { headX: .2 + Math.sin(L.T * 10) * .15 }, { dur: .2 }]], { T: L.T }); hornHang(a, 3); cara(a, L.T, { expr: L.lt > .6 ? 'happy' : 'determined' });
  BAD_.push({ kind: 'bubble', text: 'SPRUNG 1000!', w3: hp(a).add(V(0, 3, 0)), s: spring(clamp((L.lt - .1) / .15) * 1.6), a: 1, on: L.lt > .1 }); onBody(a, 16, .6, .1, 44, L.k, 14); sh(V(-1100, 0, 20), 24); }, [[.1, 'horn_far', .5], [.7, 'nod', .4]]);
// 151 «muss nie wieder jemand springen.»: (imaginado) la cuerda quieta en el suelo; la gente tumbada en la hierba, los niños corren, luz dorada
shot(181.473, 'F', null, L => { welt(L, 0, 10); setRope(0); [[oma, -6, 8], [mutter, 4, 6], [DX[14], -2, 14]].forEach(([c, x, z], i) => { put(c, x, .6, z, .3); c.root.rotation.x = -PI / 2; c.blob.visible = false; applyPose(c, { aLx: 2.8, aRx: 2.6, aLz: .4, aRz: .5 }); cara(c, L.T + i, { eyes: 'closed', mouth: 'smile', noBlink: true }); });
  [[DX[15], -8], [DX[16], 6]].forEach(([c, x], i) => { const z = 2 + L.lt * 8 + i * 3; put(c, x + L.lt * 4, Math.abs(Math.sin(L.T * 12 + i)) * .3, z, .4); actuar(c, 0, [[0, runP(L.T, i)]], { T: L.T }); c.root.scale.setScalar(.6); laughF(c, L.T + i); });
  confRain(V(0, 0, 10), L.T, 30, 20, 20, 14); orbit(V(0, 2, 9), lerp(22, 19, L.k), .2, .3, 46); sh(V(0, 0, 9), 24); }, [[0, 'birds', .6], [.2, 'laugh_kids', .5], [.4, 'music_box', .4]]);
// 152 «Wenn sie als Schnecke ankommt,»: el mensaje llega mal: un Rufer, con un caracol en la mano: «SCHNECKE?»
shot(183.055, 'C', 'punch', L => { welt(L, -300, -260); show(PED2[0], -300, 0, -252); const a = put(DX[5], -300, 2.3, -252, .4); a.blob.visible = false; actuar(a, 0, [[0, { aLx: 1.6, aLe: 1.0, aLz: .3, headX: .25, headY: .2 }]], { T: L.T }); cara(a, L.T, { expr: 'confused', mouth: 'o' });
  attach(SNAILS[12], a.aL.hand, [0, -.6, .7], [0, 0, 0], .9); onBody(a, 11, .3, .08, 40, L.k, 9.5); badge('tag', 'SCHNECKE?', W / 2, H * .15, clamp(L.lt / .12), 1, 1.2); sh(V(-300, 0, -252), 18); }, [[0, 'wrong_buzz', .6], [.2, 'snail_slime', .4]]);
// 153 «lässt eine Seite los.»: en la otra torre, las manos se sueltan
shot(184.529, 'S', null, L => { const W_ = turmNah(L, 40, { rows: 3, cols: 4, list: DX.slice(10, 22) }); const u = clamp((L.lt - .3) / .4); W_.forEach((c, i) => { applyPose(c, { aLz: lerp(1.45, .2, u), aRz: lerp(1.45, .2, u), aLx: u * 1.2, aRx: u * 1.2, aLe: .2, aRe: .2 }); cara(c, L.T + i, u > .3 ? { eyes: 'terror', mouth: 'scream' } : { expr: 'tired' }); });
  const p = surf(48); cm([p.x - 22, p.y + 2, p.z, p.x, p.y, p.z, 40], [p.x - 20, p.y + 2, p.z, p.x, p.y, p.z, 40], L.k); TINT = 'rgba(200,0,30,.18)'; sh(p, 24); }, [[.3, 'release', .6], [.5, 'gasp_crowd', .6]]);
// 154 «Und die andere nicht.»: la cuerda da un latigazo y se desploma; oscuridad
shot(185.861, 'W', null, L => { welt(L, 0, 0, { dusk: true, grass: false, rings: false }); const k = easeIn(clamp(L.lt / .9)); setRope(PI); ROPE.position.y = -k * 390; cm([0, 3, 70, 0, 160, 0, 64], [0, 3, 68, 0, 120, 0, 64], L.k); DARK = clamp((L.lt - .5) / .4) * .55; TINT = RED; SHAKE = k * .6; }, [[0, 'whip', .9], [.5, 'boom', .8]]);
// 155 «Ich bin raufgeklettert,»: subo por el muro hacia Lotte
shot(186.97, 'Z', null, L => { const W_ = lotteWand(L, { lf: { expr: 'warm' } }); const q = surf(lerp(40.6, 44.6, L.k), 2.05, 2.8); const c = put(ich, q.x, q.y, q.z, PI / 2 - .4); c.blob.visible = false; winterIch(c); actuar(c, 0, [[0, KLETTER(L.T)]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'up' });
  const p = hp(lotte); cm([p.x - 18, p.y - 4, p.z + 3, p.x, p.y - 4, p.z, 44], [p.x - 16, p.y - 3, p.z + 2.6, p.x, p.y - 3.4, p.z, 44], L.k); sh(p, 20); }, [[0, 'climb', .6]]);
// 156 «bis Lotte mein Handgelenk gepackt hat.»: su mano agarra la mía
shot(188.05, 'C', null, L => { const W_ = juntos(L, { lf: { expr: 'warm' }, if: { expr: 'happy' } }); applyPose(lotte, { aLz: 1.45, aRz: 1.45, aLe: .1, aRe: .1 }); const h = hp(lotte).lerp(hp(ich), .5).add(V(0, -1.2, 0));
  cm([h.x - 13, h.y + .6, h.z, h.x, h.y, h.z, 40], [h.x - 12, h.y + .6, h.z, h.x, h.y, h.z, 38], L.k); sh(h, 12); }, [[.1, 'grip', .7], [.3, 'chime', .5]]);
// 157 «Jetzt zählen wir laut.»: los dos en el muro, entre todos; todos abren la boca para contar
shot(189.829, 'W', null, L => { juntos(L, { lf: { expr: 'determined', mouth: 'talk' }, if: { expr: 'determined', mouth: 'talk' }, ff: n => ({ expr: 'determined', mouth: Math.sin(L.T * 9 + n) > 0 ? 'talk' : 'o' }) }); const p = hp(lotte).lerp(hp(ich), .5);
  cm([p.x - 26, p.y + 2, p.z + 2, p.x, p.y - 1, p.z, 44], [p.x - 22, p.y + 1.5, p.z + 1.6, p.x, p.y - 1, p.z, 42], L.k); sh(p, 26); }, [[0, 'crowd_murmur', .6]]);
// 158 «Neunhundertachtundneunzig.» (zoom lento): «998»; nuestras caras, la cuerda pasa por debajo
shot(191.08, 'W', 'slow', L => { juntos(L, { lf: { expr: 'determined', mouth: kitLips(L.T, spoken(191, 192.6)) || 'flat' }, if: { expr: 'determined', mouth: kitLips(L.T, spoken(191, 192.6)) || 'flat' }, phi: 1.2 + L.lt * .8 }); const p = hp(lotte).lerp(hp(ich), .5);
  cm([p.x - 15, p.y + 3, p.z + 1, p.x, p.y + 1.8, p.z, 40], [p.x - 13, p.y + 3, p.z + .8, p.x, p.y + 1.8, p.z, 38], L.k); bigNum('998', clamp(L.lt / .15), 'gold', .16, 1.5); sh(p, 14); }, [[0, 'drum', .7]]);
// 159 «Neunhundertneunundneunzig.»: «999»: la cámara sale disparada hacia el mundo; la cuerda en lo alto, a punto…
shot(192.88, 'C', 'punch', L => { juntos(L, { lf: { eyes: 'closed', mouth: 'flat', noBlink: true }, if: { eyes: 'closed', mouth: 'flat', noBlink: true }, phi: 2.6 + L.lt * .4 }); const p = hp(lotte).lerp(hp(ich), .5);
  cm([p.x - 11, p.y + 2.4, p.z + .6, p.x, p.y + 1.8, p.z, 38], [p.x - 60, p.y + 30, p.z + 20, p.x, p.y - 10, p.z, 50], L.k, easeIn); bigNum('999', clamp(L.lt / .12), 'red', .16, 1.8); DARK = clamp((L.lt - 2.2) / .3); sh(p, 30); }, [[0, 'drum', .9], [.05, 'heartbeat', .7], [2.2, 'riser_cut', .6]]);
