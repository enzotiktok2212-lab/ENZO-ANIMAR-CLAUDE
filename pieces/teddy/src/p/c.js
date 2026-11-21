// ---------- c: el juicio, OLLIE, la ejecución con pelotas de tenis y el final (98,47 – 157,5 s) ----------
const ROPE = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0xc8a060, { roughness: 1 }); for (let k = 0; k < 4; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.35, .14, 6, 20), m); r.rotation.x = PI / 2; r.position.y = 1.7 + k * .78; r.scale.set(1.05, 1, .85); g.add(r); } return g; })();
const PILE = (() => { const t = canvasTexBalls(); const m = new THREE.Mesh(new THREE.SphereGeometry(3.4, 24, 12, 0, PI * 2, 0, PI / 2), mat(0xffffff, { map: t, roughness: .7 })); scene.add(m); return m; })();
function canvasTexBalls() { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#b8d020'; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 160; i++) { const px = (i * 47) % 256, py = (i * 83) % 256; x.fillStyle = i % 2 ? '#d8f03a' : '#c8e030'; x.beginPath(); x.arc(px, py, 14, 0, 7); x.fill(); x.strokeStyle = '#f4f4e8'; x.lineWidth = 2; x.beginPath(); x.arc(px - 6, py, 10, -1, 1); x.stroke(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); return t; }
PROPS.push(ROPE, PILE);
const headCam = (ch, back = 3, up = 5, side = 1.5, fov = 44, tgt = 0) => { const h = hp(ch), f = ch.root.position, d = V(h.x - f.x, 0, h.z - f.z).normalize(), sd = V(-d.z, 0, d.x); cam([h.x + d.x * back + sd.x * side, h.y + up, h.z + d.z * back + sd.z * side], [h.x - d.x * tgt, h.y, h.z - d.z * tgt], fov); };
const ICHP = () => { const [x, z] = ring(0); return V(x, 0, z); };
const scrDraw = (key, fn) => GR.scr.userData.s.userData.draw(key, fn);
const faces12 = (c, w, h, hl = -1, mark = null) => { c.fillStyle = '#1a0a1a'; c.fillRect(0, 0, w, h); const cols = ['#7a4a26', '#3a6ae8', '#e0302a', '#1a1414', '#8a4ad8', '#f0b088', '#b8a0d8', '#5a3a1e', '#f0d870', '#2a2018', '#101014', '#4a2a14'];
  for (let i = 0; i < 12; i++) { const x = (i % 6) * w / 6 + w / 12, y = Math.floor(i / 6) * h / 2 + h / 4, r = h * .17; c.globalAlpha = hl < 0 || hl === i ? 1 : .3; c.fillStyle = cols[i]; c.fillRect(x - r, y - r, r * 2, r * .8); c.fillStyle = '#f2c8a8'; c.fillRect(x - r * .8, y - r * .3, r * 1.6, r * 1.2); c.fillStyle = '#111'; c.fillRect(x - r * .4, y + r * .05, r * .2, r * .2); c.fillRect(x + r * .2, y + r * .05, r * .2, r * .2); }
  c.globalAlpha = 1; if (mark) { c.font = `700 ${h * .3}px Cap`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 16; c.strokeStyle = '#000'; c.strokeText(mark[0], w / 2, h / 2); c.fillStyle = mark[1]; c.fillText(mark[0], w / 2, h / 2); } };
const trialKids = (L, gest = i => 'idle', face = i => ({ expr: 'worried' }), skip = [1, 5]) => KIDS.forEach((c, i) => { if (skip.includes(i)) return; atPod(c, i, L, [[0, gest(i)]], face(i)); });

// 62 «Der Bär hüpfte neben mich»: el osito entra dando saltitos y se planta a mi lado delante de los números
shot(98.47, 'W', null, L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; const me = put(ich, ZAX - 3, 0, -4, PI + .2); actuar(me, L.lt, [[0, 'idle'], [.6, 'recoil', { dur: .25 }]], { T: L.T }); cara(me, L.T, { expr: L.lt > .6 ? 'shock' : 'worried' });
  const k = clamp(L.lt / 1.1), hop = Math.abs(Math.sin(L.lt * 9)) * 1.6 * (1 - k * .7); bear(lerp(ZAX + 10, ZAX + 1.6, easeOut(k)), hop, lerp(4, -4.4, easeOut(k)), -.6, { legs: L.T * 12, aL: 1, aR: 1, mouth: .6 }, .95);
  cm([ZAX - 1, 7, 12, ZAX, 4.5, -4, 48], [ZAX - .5, 6.6, 10, ZAX, 4.5, -4, 46], L.k); }, [[0, 'swipe', .3], [.1, 'jump_small', .5], [.4, 'jump_small', .5], [.7, 'jump_small', .5], [1.0, 'land', .4]]);
// 63 «Na endlich!»: brazos arriba, confeti; yo me aparto
shot(99.99, 'Z', 'punch', L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; bear(ZAX + 1.6, Math.abs(Math.sin(L.lt * 8)) * .8, -4.4, -.3, { aL: 2.7, aR: 2.7, aLz: .8, aRz: .8, mouth: .9, glow: 2.2 }, .95); confetti(V(ZAX + 1.6, 2, -4.4), 0, L.lt, 40, .8);
  const me = put(ich, ZAX - 3, 0, -4, PI - .3); actuar(me, L.lt, [[0, 'recoil']], { T: L.T }); cara(me, L.T, { expr: 'shock' }); orbit(V(ZAX + 1.6, 4, -4.4), lerp(11, 9.5, L.k), -.1, .1, 44); }, [[0, 'party_horn', .5], [.1, 'confetti', .5], [.3, 'evil_laugh', .4]]);
// 64 «Jetzt gibt’s ein Klassengericht» (zoom lento): la sala del juicio desde arriba; la cámara baja hacia el anillo y el trono
shot(101.01, 'F', 'slow', L => { use('GR'); inside(.7, 25); trialKids(L, i => i % 2 ? 'cross' : 'idle', i => ({ expr: 'scared' })); bear(GRX, 6, -24, 0, { sit: 1, aL: 1.6, aR: 1.6, aLz: .9, aRz: .9, mouth: tedM(L.T, 101, 102.7), glow: 2 }, 1.3);
  cm([GRX, 32, 22, GRX, 2, -6, 50], [GRX, 18, 20, GRX, 4, -8, 48], L.k); }, [[0, 'flash', .3], [.1, 'choir', .5], [.5, 'curtain', .4]]);
// 65 «Ihr stimmt ab, wer es war»: los alumnos pulsan sus botones; en la gran pantalla las 12 caras
shot(102.68, 'W', null, L => { use('GR'); inside(.7, 25); scrDraw('f12', (c, w, h) => faces12(c, w, h)); trialKids(L, i => ({ aRx: 1.1 + Math.max(0, Math.sin(L.T * 6 + i)) * .3, aRe: .6, headX: .3 }), i => ({ expr: 'worried', eyes: 'down' }));
  bear(GRX, 6, -24, 0, { sit: 1, aR: 2, mouth: tedM(L.T, 102.6, 104.2) }, 1.3); cm([GRX - 10, 12, 14, GRX, 14, -24, 50], [GRX - 7, 13, 12, GRX, 15, -24, 50], L.k); }, [[0, 'swipe', .3], [.2, 'button', .5], [.5, 'button', .4], [.8, 'beep', .4], [1.1, 'button', .4]]);
// 66 «Habt ihr recht, wird nur der Täter bestraft»: la pantalla marca a uno solo: «RICHTIG»
shot(104.17, 'C', 'punch', L => { use('GR'); inside(.7, 25); scrDraw('ok', (c, w, h) => faces12(c, w, h, 7, ['RICHTIG', '#3ae86a'])); bear(GRX, 6, -24, 0, { sit: 1, aR: 2.4, aRz: -.3, mouth: tedM(L.T, 104.1, 106.4), glow: 2 }, 1.3);
  trialKids(L, i => 'idle', i => ({ expr: 'worried' })); cm([GRX + 2, 14, 2, GRX, 18, -26, 46], [GRX + 1.4, 15, -2, GRX, 18.4, -26, 46], L.k); }, [[0, 'impact', .4], [.2, 'chime', .5]]);
// 67 «Liegt ihr falsch, kommt der Täter frei»: la pantalla en rojo «FALSCH»: la verja del internado se abre para una sombra
shot(106.37, 'W', null, L => { town(); gate(easeOut(clamp(L.lt / 1.2))); DARK = .35; TINT = 'rgba(60,0,40,.25)'; walkC(reich, L.lt, 0, -30, 0, 3, L.T); cara(reich, L.T, { expr: 'smug', mouth: 'smirk' });
  badge('red', 'FALSCH', W / 2, H * .2, (L.lt - .1) * 3, 1, .9); cm([4, 6, -6, 0, 5, -26, 46], [3, 5.8, -9, 0, 5, -26, 44], L.k); sh(V(0, 0, -24)); }, [[0, 'buzzer', .5], [.3, 'metal_creak', .5], [.8, 'steps', .4], [1.6, 'evil_laugh', .3]]);
// 68 «und alle anderen werden bestraft»: alarma roja en la sala; todos se agarran la cabeza
shot(108.92, 'R', 'punch', L => { use('GR'); inside(.6, 20); scrDraw('bad', (c, w, h) => faces12(c, w, h, -1, ['ALLE', '#ff2030'])); TINT = Math.floor(L.T * 4) % 2 ? 'rgba(255,0,30,.25)' : 'rgba(255,0,30,.08)';
  trialKids(L, i => i % 2 ? 'hands_head' : 'shock', i => ({ expr: 'scared', eyes: 'terror', mouth: 'scream' })); bear(GRX, 6, -24, 0, { sit: 1, aL: 1.4, aR: 1.4, mouth: .9, glow: 3 }, 1.3);
  orb(L.k, V(GRX, 4, 0), null, [24, .8, .35, 50], [22, .3, .3, 50]); }, [[0, 'alarm', .5], [.2, 'scream_girl', .4], [.6, 'gasp', .4], [1.2, 'alarm_soft', .4]]);
// 69 «Es war mein Zimmer»: yo en mi atril, sudando
shot(110.86, 'Z', null, L => { use('GR'); inside(.7, 25); const me = atPod(ich, 0, L, [[0, { aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lean: .1 }]], { expr: 'scared', mouth: 'grimace' }); sweat(me, L.T, 2);
  const p = ICHP(); cam([p.x + 1.4, 6.8, p.z - lerp(9, 7.6, L.k)], [p.x, 5.4, p.z], 42); }, [[0, 'zoom_in', .3], [.2, 'heartbeat', .5]]);
// 70 «Also zeigten alle auf mich»: todos me señalan desde sus atriles
shot(111.96, 'C', 'punch', L => { use('GR'); inside(.7, 25); const p = ICHP(); KIDS.forEach((c, i) => { if (i === 1 || i === 5) return; const [x, z] = ring(i); put(c, x, 0, z, i ? Math.atan2(p.x - x, p.z - z) : PI); actuar(c, L.lt, [[0, i ? 'point' : 'shock']], { T: L.T + i }); cara(c, L.T + i, i ? { expr: 'angry', mouth: 'talk_wide' } : { expr: 'scared', eyes: 'terror', mouth: 'scream' }); });
  cam([p.x - 2.4, 8.6, p.z + 3.4], [GRX, 4.4, -2], 52); }, [[0, 'impact', .5], [.1, 'shout_m', .5], [.5, 'gasp', .3]]);
// 71 «Alle – außer einem stillen Mädchen mit Kopfhörern»: ella con los brazos cruzados, sin señalar; los de al lado sí señalan
shot(113.66, 'W', null, L => { use('GR'); inside(.7, 25); const p = ICHP(); KIDS.forEach((c, i) => { if ([0, 1, 5].includes(i)) return; const [x, z] = ring(i); put(c, x, 0, z, i === 6 ? ring(6)[2] : Math.atan2(p.x - x, p.z - z)); actuar(c, L.lt, [[0, i === 6 ? 'cross' : 'point']], { T: L.T + i }); cara(c, L.T + i, i === 6 ? { expr: 'neutral', eyes: 'half', mouth: 'flat' } : { expr: 'angry' }); });
  const [sx, sz] = ring(6); cm([sx + 4, 7.6, sz + 13, sx, 5.6, sz, 44], [sx + 2.6, 7.2, sz + 11, sx, 5.6, sz, 42], L.k); badge3('tag', '?', V(sx, 9.4, sz), (L.lt - .8) * 3); }, [[0, 'swipe', .3], [.4, 'creepy_ting', .4], [1.4, 'hum', .3]]);
// 72 «das sonst nie redete»: se baja los auriculares despacio
shot(116.42, 'Z', 'punch', L => { use('GR'); inside(.7, 25); const s = atPod(still, 6, L, [[0, 'cross'], [.2, { aLx: 2.5, aRx: 2.5, aLz: .4, aRz: .4, aLe: 2, aRe: 2, headX: .1 }, { dur: .4 }]], { expr: 'neutral', eyes: 'half', mouth: 'flat' });
  onFace(s, 7.6, -1.2, .5, 40, L.k, 6.8); }, [[0, 'impact', .3], [.3, 'cloth', .4]]);
// 73 «Sie sagte, ich könne es gar nicht gewesen sein»: habla; todos se giran hacia ella
shot(117.67, 'F', null, L => { use('GR'); inside(.7, 25); const [sx, sz] = ring(6); KIDS.forEach((c, i) => { if ([1, 5].includes(i)) return; const [x, z, ry] = ring(i); put(c, x, 0, z, i === 6 ? ry : lerp(ry, Math.atan2(sx - x, sz - z), easeOut(clamp((L.lt - .2) / .5)))); actuar(c, L.lt, [[0, i === 6 ? { aRx: 1.2, aRz: -.2, aRe: .3 } : 'idle']], { T: L.T + i }); i === 6 ? talk(c, L.T, 117.6, 119.9, 'neutral') : cara(c, L.T + i, { expr: 'shock' }); });
  bubble(still, 'Er war es nicht.', (L.lt - .3) * 3); cm([GRX + 8, 10, 4, sx, 5, sz, 50], [GRX + 6, 9, 2, sx, 5, sz, 48], L.k); }, [[0, 'flash', .2], [.2, 'whisper', .4], [.7, 'gasp', .4]]);
// 74 «Ich schaute mir die Zahlen nochmal an»: miro la foto de los números en mi atril
shot(119.92, 'S', null, L => { use('GR'); inside(.7, 25); const me = atPod(ich, 0, L, [[0, { aRx: 1.5, aRe: 1.3, aLx: 1.5, aLe: 1.3, headX: .35 }]], { expr: 'confused', eyes: 'down' }); show(PHOTO, GRX, 4.6, 10.4, PI, 1.2); PHOTO.rotation.x = .3;
  cam([GRX + .8, 7.6, lerp(2.4, 3.6, L.k)], [GRX, 5.8, 11], 44); }, [[0, 'swipe', .3], [.2, 'paper', .5], [1.0, 'tick', .3]]);
// 75 «Und dann drehte ich das Foto auf den Kopf»: giro la foto 180 grados
shot(121.61, 'R', null, L => { use('GR'); inside(.7, 25); const me = atPod(ich, 0, L, [[0, { aRx: 1.5, aRe: 1.3, aLx: 1.5, aLe: 1.3, headX: .35 }]], { expr: 'determined' }); const r = easeInOut(clamp((L.lt - .4) / .9)) * PI; show(PHOTO, GRX, 4.6, 10.4, PI, 1.2); PHOTO.rotation.set(.3, PI, r);
  cam([GRX + .4, 5.8, 4.6], [GRX, 5, 10.4], 38); }, [[0, 'whirl', .3], [.4, 'paper', .5], [1.3, 'click_metal', .4]]);
// 76 «Kopfüber stand da ein Name»: los números del revés se convierten en letras
shot(123.81, 'C', 'slow', L => { use('GR'); inside(.5, 20); DARK = .55; const r = easeInOut(clamp(L.lt / 1.1));
  BAD_.push({ kind: 'fn', on: true, fn: c => { c.translate(W / 2, H * .42); c.rotate(PI * r); c.font = `700 ${230}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 30; c.strokeStyle = '#3a0010'; c.strokeText('31770', 0, 0); c.fillStyle = '#ff2a5a'; c.fillText('31770', 0, 0); } });
  trialKids(L, i => 'lean_in', i => ({ expr: 'shock' })); bear(GRX, 6, -24, 0, { sit: 1, mouth: .5, glow: 2 }, 1.3);
  cam([GRX, 8, 20], [GRX, 5, 0], 50); }, [[0, 'whoosh', .4], [.4, 'clock_spin', .5], [1.1, 'magic_hit', .5]]);
// 77 «OLLIE»: el nombre gigante; en la pantalla se ilumina su cara
shot(125.27, 'Z', 'punch', L => { use('GR'); inside(.7, 25); scrDraw('ollie', (c, w, h) => faces12(c, w, h, 2, ['OLLIE', '#ffd23f'])); badge('gold', 'OLLIE', W / 2, H * .24, L.lt * 4, 1, 1.2); trialKids(L, i => i === 2 ? 'recoil' : 'shock', i => ({ expr: 'shock' }));
  cm([GRX - 6, 14, 10, GRX, 18, -26, 50], [GRX - 5, 14.4, 8, GRX, 18, -26, 48], L.k); }, [[0, 'impact', .6], [.05, 'braam_short', .6], [.2, 'gasp', .5]]);
// 78 «Ollie, der Tennisspieler» (zoom lento): Ollie en su atril, sudando, con la raqueta a la espalda
shot(125.9, 'F', 'slow', L => { use('GR'); inside(.7, 25); const o = atPod(ollie, 2, L, [[0, { aLx: .3, aRx: .3, headX: .1 }]], { expr: 'scared', eyes: 'side_l', mouth: 'grimace' }); sweat(o, L.T, 2); attach(RACK, o.spine, [.4, .6, -.9], [0, 0, .5], 1);
  badge('tag', 'TENNISSPIELER', W / 2, H * .2, (L.lt - .3) * 3); onFace(o, 10, -1.2, .8, 42, L.k, 7.6); }, [[0, 'flash', .3], [.3, 'heartbeat', .6]]);
// 79 «Er schrie, Mira sei mit der Schere»: Ollie grita y se defiende con los brazos
shot(127.47, 'C', 'punch', L => { use('GR'); inside(.7, 25); const o = atPod(ollie, 2, L, [[0, { aLx: 1.8, aRx: 1.8, aLz: .5, aRz: .5, aLe: .6, aRe: .6, lean: -.1 }]], {}); talk(o, L.T, 127.4, 129.5, 'angry', { mouth: 'scream' }); bubble(o, 'Sie wollte mich…!', (L.lt - .2) * 3);
  onFace(o, 9, -1, -.8, 42, L.k, 8); }, [[0, 'impact', .4], [.1, 'shout_m', .6]]);
// 80 «auf ihn losgegangen» (recuerdo sepia): de noche, Mira se lanza con las tijeras; Ollie para con la raqueta
shot(128.85, 'W', null, L => { use('ZA'); night(); inside(.5, 20); sepia(.75); DARK = .2; const lunge = easeOut(clamp(L.lt / .4)); const m = put(mira, ZAX - 4 + lunge * 2, 0, -2, PI / 2 + .2); actuar(m, L.lt, [[0, { aRx: 2.4, aRe: .4, lean: .3 * lunge, aLx: .6 }]], { T: L.T }); cara(m, L.T, { expr: 'angry', eyes: 'angry', mouth: 'grimace_wide' }); inHand(SCI, m, 'R', [0, -.7, .3], [PI / 2, 0, 0], 1.2);
  const o = put(ollie, ZAX + 2.4, 0, -1.6, -PI / 2 - .2); actuar(o, L.lt, [[0, { aRx: 2.0, aRz: -.4, aRe: .8, aLx: 1.6, lean: -.2 }]], { T: L.T }); cara(o, L.T, { expr: 'scared', eyes: 'terror', mouth: 'scream' }); inHand(RACK, o, 'R', [0, -.4, .2], [PI / 2 + .3, 0, 0]);
  orb(L.k, V(ZAX - .4, 4.4, -1.8), null, [13, .1, .12, 46], [11.5, -.15, .12, 46]); }, [[0, 'swipe', .3], [.2, 'whoosh', .5], [.4, 'metal_hit', .6], [.6, 'scream_girl', .3]]);
// 81 «er habe sich nur gewehrt»: Ollie con las manos en alto, llorando
shot(130.11, 'R', null, L => { use('GR'); inside(.7, 25); const o = atPod(ollie, 2, L, [[0, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, aLe: .4, aRe: .4, headX: .1 }]], { expr: 'sad', mouth: 'frown' }); const h = hp(o);
  TEAR.forEach((t, i) => { t.visible = true; const k = (L.T * 1.2 + i * .5) % 1; t.position.copy(h).add(V(i ? -.35 : .35, .9 - k * 1.2, .65)); }); onFace(o, 9.5, -1.2, .6, 42, L.k, 8.4); }, [[0, 'whirl', .3], [.3, 'sob', .5]]);
// 82 «Und dann verstanden wir, warum sie das Zimmer tauschen wollte»: me doy cuenta: «!» encima de mi cabeza
shot(131.37, 'Z', 'punch', L => { use('GR'); inside(.7, 25); const me = atPod(ich, 0, L, [[0, 'think'], [1.2, 'shock', { dur: .25 }]], { expr: L.lt > 1.2 ? 'shock' : 'confused', mouth: L.lt > 1.2 ? 'o' : 'flat' });
  badge3('q', '!', hp(me).add(V(0, 3.4, 0)), (L.lt - 1.2) * 4); const p = ICHP(); cam([p.x - 1, 6.8, p.z - lerp(9, 7.4, L.k)], [p.x, 5.6, p.z], 42); }, [[0, 'impact', .4], [.5, 'tick', .3], [1.2, 'ding_soft', .6]]);
// 83 «Sie wollte ihn ausschalten» (recuerdo): Mira avanza de noche por el pasillo con las tijeras hacia la puerta de Ollie
shot(133.98, 'F', null, L => { use('FL'); night(); inside(.45, 15); sepia(.7); const m = walkC(mira, L.lt, FLX + 2, 2, PI, 1.6, L.T, { aRx: 1.2, aRe: .3 }); cara(mira, L.T, { expr: 'angry', eyes: 'squint', mouth: 'smirk' }); inHand(SCI, mira, 'R', [0, -.7, .3], [PI / 2, 0, 0], 1.2);
  cm([FLX + 5, 6, -18, FLX + 2, 5, 0, 46], [FLX + 4, 5.8, -15, FLX + 2, 5, -1, 44], L.k); }, [[0, 'flash', .3], [.1, 'steps', .3], [.6, 'creepy_ting', .4], [1.2, 'heartbeat', .4]]);
// 84 «und es mir anhängen»: en mi habitación, Mira señala mi cama con una sonrisa malvada
shot(135.48, 'W', null, L => { use('ZA'); night(); inside(.5, 20); sepia(.7); const m = put(mira, ZAX - 2, 0, 2, -PI / 2 - .6); actuar(m, L.lt, [[0, 'point']], { T: L.T }); cara(m, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' }); inHand(SCI, m, 'L', [0, -.7, .3], [PI / 2, 0, 0], 1.2);
  ZA.nums.visible = L.lt > .8; orb(L.k, V(ZAX - 2.4, 4.4, 1), null, [12, -2.0, .1, 46], [10.5, -2.3, .1, 46]); }, [[0, 'swipe', .3], [.3, 'evil_laugh', .3], [.9, 'lid_click', .4]]);
// 85 «Der Bär band Ollie an einen Netzpfosten»: pista de tenis de noche; el osito tira de la cuerda
shot(137.01, 'C', 'punch', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; const o = put(ollie, px, 0, 1.4, PI); applyPose(o, { aLx: -.2, aRx: -.2, aLz: -.1, aRz: -.1, headX: -.1 }); actuar(o, L.lt, [[0, { aLz: -.05, aRz: -.05 }]], { T: L.T, extra: shiver(L.T, 1.5) }); cara(o, L.T, { expr: 'scared', eyes: 'terror', mouth: 'scream' });
  show(ROPE, px, 0, .8); ROPE.scale.setScalar(1 + Math.sin(L.T * 10) * .02); bear(px - 4.5, 0, -1.5, PI / 2 + .3, { aL: 1.4, aR: 1.4, lean: -.3 - Math.max(0, Math.sin(L.lt * 6)) * .2, mouth: .7, glow: 2 }, .95);
  cm([px - 12, 8, 10, px - 2, 4.5, 0, 48], [px - 10, 7.6, 8, px - 2, 4.5, 0, 46], L.k); }, [[0, 'impact', .4], [.2, 'tug', .5], [.6, 'tug', .5], [1.2, 'scream_girl', .2], [1.6, 'evil_laugh', .3]]);
// 86 «Eine Ballmaschine»: la máquina azul entra rodando; el osito pulsa el botón
shot(139.25, 'W', null, L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; const k = easeOut(clamp(L.lt / .9)); show(BM, lerp(TNX + 30, px, k), 0, lerp(26, 20, k), PI); put(ollie, px, 0, 1.4, PI); cara(ollie, L.T, { expr: 'scared' }); show(ROPE, px, 0, .8);
  bear(px + 3.4, 0, 22, -PI / 2, { aR: L.lt > .9 ? 1.6 : 1, mouth: .8 }, .9); cm([px - 10, 8, 32, px, 4, 18, 48], [px - 8, 7.4, 30, px, 4, 18, 46], L.k); }, [[0, 'swipe', .3], [.1, 'wheels', .6], [.9, 'button', .6], [1.0, 'machine_hum', .5]]);
// 87 «feuerte zweitausend Tennisbälle auf ihn»: las pelotas salen en chorro; contador hasta 2000
shot(140.51, 'C', 'punch', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; show(BM, px, 0, 20, PI); const o = put(ollie, px, 0, 1.4, PI); actuar(o, L.lt, [[0, 'cower']], { T: L.T, extra: shiver(L.T, 2) }); cara(o, L.T, { expr: 'scared', eyes: 'closed', mouth: 'scream' }); show(ROPE, px, 0, .8);
  BALLS.forEach((b, i) => { const ph = (L.lt * 4 + i / BALLS.length) % 1; b.visible = true; b.position.set(px + Math.sin(i * 7) * .8, 2.6 + Math.sin(ph * PI) * 1.4 + Math.cos(i) * .6, lerp(18, 1.8, ph)); });
  badge('num', String(Math.min(2000, Math.round(easeIn(clamp(L.lt / 1.7)) * 2000))), W / 2, H * .2, L.lt * 4, 1, 1); cm([px - 9, 6.6, 12, px, 3.6, 7, 48], [px - 8, 6.2, 11, px, 3.6, 6, 46], L.k); }, [[0, 'impact', .5], [.05, 'machine_shake', .5], [.15, 'kick', .5], [.4, 'kick', .5], [.65, 'kick', .5], [.9, 'kick', .5], [1.15, 'kick', .5], [1.5, 'kick', .5]]);
// 88 «bis er sich nicht mehr bewegte» (zoom lento): la cámara se aleja: Ollie hundido en un montón de pelotas; los alumnos miran tras la valla
shot(142.37, 'F', 'slow', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; show(BM, px, 0, 20, PI); const o = put(ollie, px, 0, 1.4, PI); applyPose(o, { headX: .7, aLx: -.1, aRx: -.1, lean: .25, crouch: .3 }); cara(o, L.T, { eyes: 'closed', mouth: 'flat', noBlink: 1 }); show(ROPE, px, 0, .8);
  show(PILE, px, 0, 1.8, 0); PILE.scale.set(1, .6 + L.k * .25, 1); [ich, koch, hack, spiel].forEach((c, i) => { put(c, TNX + 29, 0, 4 - i * 4, -PI / 2); actuar(c, L.lt, [[0, i % 2 ? 'hands_face' : 'hands_head']], { T: L.T + i }); cara(c, L.T + i, { expr: 'shock' }); });
  cm([px - 6, 8, 12, px + 2, 3, 1, 46], [px - 12, 12, 22, px + 3, 3, 1, 48], L.k); }, [[0, 'rubble', .4], [.4, 'silence_tick', .4], [1.0, 'sad_tone', .4]]);
// 89 «Hihihi!»: el osito se ríe dando botes encima de la máquina
shot(143.73, 'Z', 'punch', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; show(BM, px, 0, 20, PI); bear(px, 6.8 + Math.abs(Math.sin(L.lt * 9)) * .8, 20, PI + .3, { aL: 1.8 + Math.sin(L.T * 18) * .3, aR: 1.8 - Math.sin(L.T * 18) * .3, aLz: .3, aRz: .3, mouth: .9, lean: Math.sin(L.T * 12) * .1, glow: 2.4 }, .9);
  orbit(V(px, 9.6, 20), lerp(11, 9.5, L.k), PI + .3, .12, 44); }, [[0, 'evil_laugh', .7], [.2, 'boing_metal', .4], [.6, 'boing_metal', .3]]);
// 90 «Wer ist der Nächste?»: se gira hacia la cámara; el ojo de corazón se enciende al máximo
shot(144.78, 'C', 'punch', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 60); const px = TNX + 18.5; show(BM, px, 0, 20, PI); bear(px, 6.8, 20, PI + lerp(.3, 0, easeOut(clamp(L.lt / .4))), { aR: 1.6, aRz: -.1, mouth: tedM(L.T, 144.7, 146), glow: 4, brow: .5, headZ: .15 }, .9); TINT = 'rgba(120,0,30,.18)';
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x + .3, h.y + .4, h.z - lerp(7, 5.4, easeIn(L.k))], [h.x, h.y - .3, h.z], 40); }, [[0, 'slam', .5], [.2, 'creepy_ting', .5], [.9, 'heartbeat', .5]]);
// 91 «In dieser Nacht lag ich in einem Bett»: en la habitación rosa de Mira, tumbado y despierto
shot(145.99, 'I', null, L => { use('ZB'); night(); inside(.4, 15); lie(ich, ZBX - 8, 3.4, -5.6, 0); applyPose(ich, { aLx: .2, aRx: .2, aLz: .3, aRz: .3 }); cara(ich, L.T, { expr: 'sad', eyes: 'half', mouth: 'flat' });
  headCam(ich, lerp(-5, -4.2, L.k), 5, .8, 44, -.8); }, [[0, 'iris_pop', .3], [.3, 'crickets', .4], [1.4, 'clock_tick', .3]]);
// 92 «das nicht meins war»: los pósteres y la colcha rosa de Mira; yo me giro
shot(147.79, 'W', null, L => { use('ZB'); night(); inside(.4, 15); lie(ich, ZBX - 8, 3.4, -5.6, 0); applyPose(ich, { headY: -.6 + Math.sin(L.lt) * .1 }); cara(ich, L.T, { expr: 'sad', eyes: 'side_l' });
  cm([ZBX + 4, 10, 4, ZBX - 2, 9, -12, 48], [ZBX + 2, 10.4, 2, ZBX - 4, 8, -12, 48], L.k); }, [[0, 'swipe', .3], [.4, 'sigh', .4]]);
// 93 «Und ich dachte an den Bären»: mi cara de cerca, mirando al techo
shot(148.98, 'F', null, L => { use('ZB'); night(); inside(.4, 15); lie(ich, ZBX - 8, 3.4, -5.6, 0); cara(ich, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' }); const h = hp(ich);
  cam([h.x + .3, h.y + lerp(6, 5, L.k), h.z + 1.2], [h.x, h.y, h.z + .2], 40); }, [[0, 'flash', .2], [.3, 'lullaby', .4]]);
// 94 «Fünf Jahre lang lag er jede Nacht neben mir» (recuerdo cálido): yo de pequeño abrazado al osito de peluche
shot(150.08, 'F', 'slow', L => { use('KZ'); inside(.5, 20); grade.uniforms.sepia.value = .25; const me = lie(ich, KZX, 3.3, -4.6, 0); ich.root.scale.setScalar(.62); applyPose(me, { aLx: .7, aRx: .7, aLz: -.5, aRz: -.5, aLe: 1.7, aRe: 1.7 }); cara(me, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smirk', noBlink: 1 });
  { const h = hp(ich); show(TOY, h.x + 1.6, 2.4, h.z, -.5, .8); } TOY.rotation.z = .3; badge('tag', '5 JAHRE', W / 2, H * .2, (L.lt - .2) * 3);
  ZZZ.forEach((z, i) => { const k = (L.T * .5 + i / 3) % 1; z.visible = true; z.position.set(KZX - 1 + k * 2, 5 + k * 3, -6 + i * .2); z.scale.setScalar(.5 + k); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  headCam(ich, lerp(-3.4, -2.8, L.k), 3.6, .4, 44, -1.5); }, [[0, 'flash', .3], [.2, 'lullaby', .5], [1.2, 'snore', .2]]);
// 95 «in meinem Kinderzimmer»: el cuarto de niño entero con la lucecita de noche
shot(152.11, 'W', null, L => { use('KZ'); inside(.5, 20); grade.uniforms.sepia.value = .25; const me = lie(ich, KZX, 3.3, -4.6, 0); ich.root.scale.setScalar(.62); applyPose(me, { aLx: .7, aRx: .7, aLz: -.5, aRz: -.5, aLe: 1.7, aRe: 1.7 }); cara(me, L.T, { eyes: 'closed', mouth: 'smirk', noBlink: 1 });
  { const h = hp(ich); show(TOY, h.x + 1.6, 2.4, h.z, -.5, .8); } TOY.rotation.z = .3; headCam(ich, -7, 6, lerp(-4, -2, L.k), 50, 1); }, [[0, 'swipe', .3], [.4, 'chime', .3]]);
// 96 «Jetzt wollte er mich zum Mörder machen» (zoom lento): el osito en su trono a oscuras; solo brilla el ojo de corazón
shot(153.82, 'C', 'slow', L => { use('GR'); inside(.2, 8); DARK = .35; bear(GRX, 6, -24, 0, { sit: 1, aL: .6, aR: .6, mouth: .25, glow: 3 + L.k * 3, brow: .5, headX: .1 }, 1.3);
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x, h.y + .8, h.z + lerp(16, 8, easeIn(L.k))], [h.x, h.y - .6, h.z], 42); }, [[0, 'slam', .4], [.2, 'heartbeat', .6], [1.2, 'creepy_ting', .4]]);
// 97 «Und trotzdem vermisse ich ihn»: en la cama de Mira abrazo el osito pequeño; una lágrima. La cámara se aleja
shot(155.72, 'F', null, L => { use('ZB'); night(); inside(.45, 18); lie(ich, ZBX - 8, 3.4, -5.6, .3); applyPose(ich, { aLx: .7, aRx: .7, aLz: -.5, aRz: -.5, aLe: 1.7, aRe: 1.7 }); cara(ich, L.T, { expr: 'sad', eyes: 'closed', mouth: 'frown', noBlink: 1 }); { const h = hp(ich); show(TOY, h.x + 1.5, 3.3, h.z - .4, -.4, .8); } TOY.rotation.z = .4;
  const h = hp(ich); TEAR.forEach((t, i) => { if (i) return; t.visible = true; const k = (L.T * .7) % 1; t.position.copy(h).add(V(.45, .3, .3 - k * .8)); });
  headCam(ich, lerp(-3.4, -6, L.k), lerp(3.6, 6.5, L.k), .8, 44, -.6); }, [[0, 'flash', .2], [.3, 'sob', .4], [.8, 'lullaby', .4], [1.5, 'piano_note', .4]]);
