// ---------- b: mis 3 €, Mama, el señor que estornuda, la fiesta, plan 1 (etiqueta), plan 2 (döner), vuelta a casa (23,98 – 46,18 s) ----------
const CAKE = P_(new THREE.Group()); cake(CAKE, 0, 1.3); { const t = textPlane(1.6, 1.2, 160, 120, (c, w, h) => { c.font = `700 100px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 12; c.strokeStyle = '#7a1a4a'; c.strokeText('13', w / 2, h / 2 + 6); c.fillStyle = '#ffd23f'; c.fillText('13', w / 2, h / 2 + 6); }); t.position.set(0, 3.2, 0); t.userData.noOutline = true; CAKE.add(t); CAKE.userData.top = t;
  for (const s of [-.5, .5]) { cyl(.06, .06, .6, mat(0xff8ad0), 6, CAKE, s, 2.2, 0); sphere(.12, new THREE.MeshStandardMaterial({ color: 0xffb030, emissive: 0xff8a10, emissiveIntensity: 3 }), CAKE, s, 2.6, 0, 8, 6); } }
const hats = (...cs) => { for (const c of cs) { const i = POOL.indexOf(c); if (i >= 0) HATS[i].visible = true; } };
const DANCE = (T, i) => { const p = Math.sin(T * 7 + i * 1.3); return { aLx: 2.2 + p * .5, aRx: 2.2 - p * .5, aLz: .5, aRz: .5, aLe: .6, aRe: .6, lean: p * .1, crouch: .08 + Math.abs(p) * .1, headY: p * .25, lLx: Math.max(0, p) * .4, lRx: Math.max(0, -p) * .4, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5 }; };
function dancers(L, list, cx, cz, r0, r1, seed = 1, face) { const r = RNG(seed); list.forEach((c, i) => { const a = r() * PI * 2, d = r0 + r() * (r1 - r0); const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d; const j = Math.abs(Math.sin(L.T * 7 + i)) * .35;
  pose(c, x, j, z, face ? faceTo(V(x, 0, z), face) + (r() - .5) * .8 : r() * PI * 2, L, DANCE(L.T, i), i % 3 ? 'joy' : 'happy', { mouth: i % 2 ? 'laugh' : 'open_smile' }); hats(c); }); }
const PARTY = () => EXS.slice(0, 16);

// 27 «In dreizehn Jahren»: mi escalón, una tarta con un 13 y dos velas; soplo, solo
shot(23.98, 'Z', null, L => { strasseS(L, 'dusk'); sit(ich, SX - 19.4, 1.6, 0, PI / 2, L, { aLx: 1.0, aRx: 1.0, aLe: 1.2, aRe: 1.2, lean: .2 }); cara(ich, L.T, { expr: 'sad', mouth: L.lt > .6 ? 'o' : 'flat' });
  show(CAKE, SX - 16.6, 0, .4, PI / 2, .75); hats(ich); badge('tag', '13 JAHRE', W / 2, H * .13, (L.lt - .2) * 3);
  orb(L.k, V(SX - 18.3, 3, 0), null, [15, PI / 2 + .5, .16, 46], [12.5, PI / 2 + .3, .12, 46]); }, [[0, 'crickets', .5], [.6, 'blow', .5]]);
// 28 «habe ich drei Euro verdient.»: primer plano de mi mano abierta con tres monedas; contador 3 €
shot(25.46, 'F', 'punch', L => { strasseS(L, 'dusk'); pose(ich, SX - 15, 0, 0, PI / 2, L, { aRx: 1.3, aRe: .9, aRz: -.1, aLx: .3, headX: .35 }, 'sad', { mouth: 'flat' });
  const h = ich.aR.hand; for (let i = 0; i < 3; i++) attach(COINS[i], h, [(i - 1) * .32, -.55, .35 + i * .04], [PI / 2 + .3, 0, i], .55);
  onFace(ich, 4.4, -.8, 1.0, 42, L.k, 3.8); money('3 €', (L.lt - .1) * 3, 'gold'); }, [[0, 'coins_hand', .7], [.2, 'sad_horn', .3]]);
// 29 «Zwei von meiner Mama.»: Mama abre la puerta: «HUSS, ESSEN!» → dos monedas me saltan encima
shot(26.42, 'S', null, L => { strasseS(L, 'dusk'); pose(mama, SX - 21.8, 2.4, -1.2, PI / 2, L, { aRx: 1.6, aRz: .2, aRe: .6, aLx: .3 }, 'warm', { mouth: 'open_smile' });
  pose(ich, SX - 16, 0, 4.4, -PI / 2 + 1.2, L, L.lt > .3 ? { aLx: 2.6, aLz: .4, aRx: 2.6, aRz: .4 } : { headY: .4 }, L.lt > .3 ? 'joy' : 'happy', { mouth: 'open_smile' });
  greet(mama, ich, L, 'HUSS, ESSEN!', .05, 0, { n: 2, plus: '+2 €' }); cm([SX + 3, 6.2, 2.6, SX - 19, 5, 2.2, 46], [SX + 2, 6.2, 2.4, SX - 19, 5, 2.2, 46], L.k); }, [[0, 'door_open', .6], [.25, 'coin_jingle', .6]]);
// 30 «Einen von einem Mann,»: un señor con sombrero, en la acera, arruga la nariz… «aaah…»
shot(27.47, 'W', null, L => { strasseS(L, 'dusk'); const b = clamp(L.lt * 1.2); pose(nieser, SX - 12, 0, -1, PI / 2 - .5, L, { headX: -.35 * b, lean: -.15 * b, aRx: 1.9, aRe: 2.2, aRz: -.2 }, 'tired', { eyes: 'squint', mouth: 'ah' });
  pose(ich, SX - 12.5, 0, 4.2, PI - 1.0, L, { headY: .2 }, 'confused'); cm([SX + 5, 5.4, 4, SX - 12.3, 4.2, 1.6, 46], [SX + 4, 5.4, 3.4, SX - 12.3, 4.2, 1.6, 46], L.k); }, [[.1, 'sniff', .6]]);
// 31 «der niesen musste.»: ¡estornudo! «HUSS!» con gotitas; me salta una moneda y la cojo al vuelo
shot(28.53, 'C', 'punch', L => { strasseS(L, 'dusk'); pose(nieser, SX - 12, 0, -1, PI / 2 - .5, L, { headX: .5, lean: .35, aRx: 1.6, aRe: 2.0, aLx: .6 }, 'shock', { eyes: 'closed', mouth: 'scream' });
  const hn = hp(nieser); SPRAY.forEach((p, i) => { const r = RNG(i + 3), t = clamp(L.lt * 2); p.visible = t > 0 && t < 1; p.position.set(hn.x + (2 + r() * 4) * t, hn.y - .2 + (r() - .5) * 2 * t - t * t, hn.z + 1 + (r() - .5) * 3 * t); p.scale.setScalar(1 - t * .5); });
  if (L.lt > 0) bubble(nieser, 'HUSS!', L.lt * 4, 1.4); const j = L.lt > .3 ? Math.max(0, Math.sin((L.lt - .3) * 8)) * .7 : 0;
  pose(ich, SX - 12.5, j, 4.2, PI - 1.0, L, L.lt > .3 ? { aRx: 2.8, aRz: .3, aLx: 1.4, aLz: .5 } : { headY: .2 }, L.lt > .3 ? 'joy' : 'shock', { mouth: 'open_smile' }); coinBurst(hp(ich).add(V(0, 1.4, 0)), L.t0 + .25, L.T, 1, 4, { y0: 0, vy: 6, spread: .4 }); plus(hp(ich).add(V(0, 2.4, 0)), L.t0 + .3, L.T);
  cm([SX + 3, 5.2, 3.4, SX - 12.3, 4.3, 1.6, 46], [SX + 2.4, 5.2, 3, SX - 12.3, 4.3, 1.6, 46], L.k); }, [[0, 'sneeze', .9], [.3, 'coin_jingle', .6]]);
// 32 «Also ging ich zur größten Party des Jahres.»: la fiesta de Krass de noche: guirnaldas, bola de discoteca, gente bailando con gorros; yo entro
shot(29.56, 'I', null, L => { party(L); dancers(L, PARTY(), PX + 6, -12, 2, 11, 3, V(PX, 2, -30)); walk(ich, L, PX + 6, 12, PI, 2.6, 0, { expr: 'happy', mouth: 'smile' }); hats(ich);
  cm([PX + 22, 18, 34, PX + 4, 4, -8, 50], [PX + 16, 12, 28, PX + 5, 4, -6, 48], L.k); badge('tag', 'PARTY DES JAHRES', W / 2, H * .13, (L.lt - .2) * 3); }, [[0, 'party_music', .7], [.2, 'crowd_party', .5]]);
// 33 «des Jahres.»: la pista: DJ con las manos arriba, la bola gira, todos saltan
shot(31.2, 'R', null, L => { party(L); dancers(L, PARTY().slice(0, 10), PX + 2, -16, 2, 7, 5, V(PX, 2, -30)); const dj = EXS[20]; pose(dj, PX, 0, -32.4, 0, L, { aLx: 2.8, aLz: .4, aRx: 2.8, aRz: .4, headX: Math.sin(L.T * 9) * .2 }, 'joy', { mouth: 'laugh' });
  cm([PX + 14, 10, -4, PX, 4.5, -26, 48], [PX + 11, 9.4, -6, PX, 4.5, -26, 46], L.k); }, [[0, 'crowd_party', .6], [.2, 'airhorn', .4]]);
// 34 «Mit einem Plan.»: golpe de zoom a mi cara: sonrisa pícara, dedo en la sien
shot(31.9, 'C', 'punch', L => { party(L); pose(ich, PX + 6, 0, 6, .2, L, { aRx: 2.3, aRz: -.3, aRe: 2.3, aLx: .3 }, 'smug', { mouth: 'smirk' }); hats(ich);
  dancers(L, PARTY().slice(0, 6), PX + 4, -6, 4, 9, 7, V(PX, 2, -30)); onFace(ich, 4.4, 0, -.5, 40, L.k, 3.9); }, [[0, 'whoosh_up', .4], [.2, 'ding_idea', .6]]);
// 35 «Plan eins:»: PLAN 1: saco una etiqueta de nombre y la levanto
shot(32.81, 'Z', null, L => { party(L); pose(ich, PX + 6, 0, 6, .1, L, { aRx: 2.6, aRz: .2, aRe: .4, aLx: .4 }, 'happy', { mouth: 'open_smile' }); hats(ich);
  attach(ich.props.tag, ich.aR.hand, [0, -.6, .4], [0, 0, 0], 1.6); badge('big', 'PLAN 1', W / 2, H * .13, (L.lt - .05) * 3.5);
  dancers(L, PARTY().slice(6, 12), PX + 4, -8, 4, 10, 9, V(PX, 2, -30)); orb(L.k, V(PX + 6, 3.8, 6), null, [14, .2, .1, 46], [12, .05, .08, 46]); }, [[0, 'ding_reveal', .6], [.2, 'paper', .5]]);
// 36 «ein Namensschild.»: la etiqueta pegada en el pecho: HALLO, ICH BIN HUSS
shot(33.65, 'F', null, L => { party(L); pose(ich, PX + 6, 0, 6, 0, L, { aLx: .6, aLz: .5, aLe: 1.6, aRx: .6, aRz: .5, aRe: 1.6, lean: -.06 }, 'smug', { mouth: 'grin' }); hats(ich); ich.props.tag.visible = true;
  const c = wpos(ich.spine).add(V(-.4, 1.3, 0)); cm([PX + 6.2, 4.4, 12, c.x, c.y - .3, c.z, 40], [PX + 6.1, 4.2, 10.5, c.x, c.y - .3, c.z, 38], L.k); }, [[0, 'sticker', .7]]);
// 37 «„Freut mich, Hans!“»: un invitado me estrecha la mano leyendo la etiqueta: «FREUT MICH, HANS!»
shot(34.73, 'W', null, L => { party(L); const g = EXS[17]; hats(g, ich); ich.props.tag.visible = true; const sh = Math.sin(L.T * 14) * .15;
  pose(ich, PX + 7.6, 0, 4, -PI / 2 + .45, L, { aRx: 1.4 + sh, aRe: .3, aRz: -.15 }, 'happy', { mouth: 'open_smile' }); pose(g, PX + 4.4, 0, 4.6, PI / 2 - .3, L, { aRx: 1.4 - sh, aRe: .3, aRz: -.15, headX: .2 }, 'happy', { mouth: 'talk' });
  if (L.lt > .05) bubble(g, 'FREUT MICH, HANS!', (L.lt - .05) * 3.5, 1.5); orb(L.k, V(PX + 6, 3.5, 4.3), null, [17, .35, .1, 46], [15, .2, .08, 46]); }, [[0, 'handshake', .6], [.1, 'crowd_party', .4]]);
// 38 «Null Euro.»: mi cara, sin expresión; 0 € en rojo; la etiqueta se despega y cae
shot(35.82, 'G', 'punch', L => { party(L); hats(ich); pose(ich, PX + 7.6, 0, 4, .1, L, { aLx: .1, aRx: .1 }, 'neutral', { eyes: 'half', mouth: 'flat' });
  const k = clamp(L.lt * 1.6); attach(ich.props.tag, scene, [0, 0, 0]); const c = wpos(ich.spine); ich.props.tag.position.set(c.x - .4 + k * .6, c.y + 1.4 - k * k * 4, c.z + .9); ich.props.tag.rotation.set(0, 0, k * 2.4); ich.props.tag.scale.setScalar(.86);
  onFace(ich, 4.4, -.2, .3, 40, L.k, 4.0); money('0 €', (L.lt - .1) * 3, 'red'); }, [[0, 'sad_trombone', .6]]);
// 39 «Plan zwei:»: PLAN 2: yo detrás del puesto DÖNER GRATIS, con los brazos abiertos
shot(36.57, 'S', null, L => { party(L); hats(ich); pose(ich, PX + 21, 1.4, 8, -PI / 2, L, { aLx: 1.4, aLz: 1.0, aRx: 1.4, aRz: 1.0, aLe: .3, aRe: .3 }, 'happy', { mouth: 'open_smile' });
  badge('big', 'PLAN 2', W / 2, H * .13, (L.lt - .05) * 3.5); cm([PX + 8, 7.4, 11, PX + 20.5, 5.8, 8, 46], [PX + 9.5, 7.2, 10, PX + 20.5, 5.8, 8, 46], L.k); }, [[0, 'ding_reveal', .6], [.2, 'sizzle', .5]]);
// 40 «ein Döner gratis für jeden,»: corto la carne del asador y ofrezco un döner; el cartel lo dice
shot(37.37, 'I', null, L => { party(L); hats(ich); pose(ich, PX + 21, 1.4, 6.4, -PI / 2 - .3, L, { aRx: 1.5, aRe: .4, aLx: .8 + Math.sin(L.T * 10) * .2, aLe: 1.4 }, 'happy', { mouth: 'open_smile' }); attach(WRAPS[0], ich.aR.hand, [0, -.5, .3], [0, 0, 0], .9);
  cm([PX + 8, 7.4, 0, PX + 20.5, 5.8, 6.4, 46], [PX + 9, 7.4, 1, PX + 20.5, 5.8, 6.4, 46], L.k); }, [[0, 'sizzle', .6], [.4, 'knife', .4]]);
// 41 «der meinen Namen sagt.»: me señalo la etiqueta nueva del pecho, esperanzado
shot(38.93, 'Z', null, L => { party(L); hats(ich); ich.props.tag.visible = true; pose(ich, PX + 21, 1.4, 8, -PI / 2, L, { aRx: 1.2, aRz: -.6, aRe: 1.8, aLx: .3 }, 'happy', { mouth: 'grin' });
  onFace(ich, 4.8, -.4, -.4, 42, L.k, 4.2); }, [[.1, 'pling', .5]]);
// 42 «Alle schrien:»: toda la fiesta corre hacia el puesto
shot(40.03, 'R', null, L => { party(L); hats(ich); pose(ich, PX + 21, 1.4, 8, -PI / 2, L, { aLx: 1.4, aLz: .8, aRx: 1.4, aRz: .8 }, 'shock', { mouth: 'o' });
  PARTY().slice(0, 12).forEach((c, i) => { run(c, L, PX - 6 - (i % 4) * 3, 8 + (Math.floor(i / 4) - 1) * 4, PI / 2, 8, i, { expr: 'joy', mouth: 'open_smile', t0: .1 }); hats(c); });
  cm([PX - 4, 9, 30, PX - 4, 3.6, 8, 50], [PX - 2, 8.6, 28, PX - 2, 3.6, 8, 50], L.k); }, [[0, 'stampede', .6]]);
// 43 «„Döner!“»: la multitud ante el mostrador, bocas abiertas: «DÖNER!» «DÖNER!» «DÖNER!»
shot(40.85, 'C', 'punch', L => { party(L); const M = PARTY().slice(0, 9); M.forEach((c, i) => { const x = PX + 12 - (i % 3) * 3.2, z = 4 + Math.floor(i / 3) * 3.4 + (i % 2) * .6; pose(c, x, 0, z, PI / 2 + (z - 8) * -.05, L, { aRx: 2.4 + Math.sin(L.T * 10 + i) * .3, aRz: .2, aRe: .4, headX: -.2 }, 'shout', { mouth: 'scream' }); hats(c); });
  [M[0], M[4], M[8]].forEach((c, i) => { if (L.lt > i * .08) bubble(c, 'DÖNER!', (L.lt - i * .08) * 4, 1.4); }); cm([PX + 21.5, 7.2, 8, PX + 9, 4.2, 7.5, 50], [PX + 21, 7.2, 8, PX + 9, 4.2, 7.5, 48], L.k); }, [[0, 'crowd_shout', .7]]);
// 44 «Ein Junge namens Döner»: el niño llamado Döner, en medio: a cada grito le llueven monedas; su nombre
shot(41.46, 'F', null, L => { party(L); pose(doener, PX + 8, 0, 8, -PI / 2 + .3, L, { aLx: 2.6, aLz: .5, aRx: 2.6, aRz: .5, headX: -.25 }, 'joy', { mouth: 'laugh' }); hats(doener);
  coinBurst(hp(doener).add(V(0, 6, 0)), L.t0 - .4, L.T, 24, 0, { y0: 0, vy: 1, spread: 3, life: 2 }); coinBurst(hp(doener).add(V(0, 1.5, 0)), L.t0 + .3, L.T, 10, 24, { y0: 0, vy: 9, spread: 3 });
  crowdAt(L, PX + 8, 8, 7, 5, 8, 6, { mode: 'point', face: V(PX + 8, 3, 8), list: PARTY() }); badge('tag', 'DÖNER', W / 2, H * .13, (L.lt - .1) * 3);
  orb(L.k, V(PX + 8, 3, 8), null, [16, -PI / 2 + .2, .15, 46], [13.5, -PI / 2 + .4, .1, 46]); }, [[0, 'coins_rain', .8], [.3, 'kid_laugh', .5]]);
// 45 «verdiente zweihundertvierzig Euro.»: el niño abraza su montón de monedas; el contador sube hasta 240 €
shot(42.96, 'Z', 'slow', L => { party(L); hats(doener); pose(doener, PX + 8, 0, 8, -PI / 2 + .3, L, { aLx: 1.2, aLz: .2, aLe: 1.6, aRx: 1.2, aRz: .2, aRe: 1.6, crouch: .1 }, 'joy', { mouth: 'open_smile' });
  for (let i = 0; i < 18; i++) { const c = COINS[i], r = RNG(i + 9); c.visible = true; c.position.set(PX + 6.6 + (r() - .5) * 2, .1 + Math.floor(i / 6) * .12, 8.6 + (r() - .5) * 3); c.rotation.set(-PI / 2, 0, r() * 3); c.scale.setScalar(.8); }
  coinBurst(hp(doener).add(V(0, 7, 0)), L.t0 - .5, L.T, 14, 20, { y0: 0, vy: 1, spread: 2.5, life: 2.4 });
  money(Math.round(lerp(12, 240, easeOut(clamp(L.lt / 1.2)))) + ' €', (L.lt - .05) * 3); onFace(doener, 5.4, .4, .4, 42, L.k, 4.4); }, [[0, 'counter_up', .7], [1.1, 'cash', .7]]);
// 46 «Also ging ich allein nach Hause.»: mi calle de noche: yo, solo, con las manos en los bolsillos, bajo las farolas
shot(44.67, 'B', null, L => { strasseS(L, 'night'); walk(ich, L, SX - 13, 18, PI, 1.6, 0, { expr: 'sad', mouth: 'flat', pose: { aLx: -.2, aRx: -.2, aLe: .6, aRe: .6, headX: .35 } }); lp(0, SX - 10, 12, 10, 50, 0xffc070, 40);
  cm([SX - 12.4, 5.6, 6, SX - 13, 3.6, 16, 44], [SX - 12.4, 5.4, 7.5, SX - 13, 3.6, 15, 44], L.k); }, [[0, 'night_crickets', .6], [.2, 'footsteps_slow', .5]]);
