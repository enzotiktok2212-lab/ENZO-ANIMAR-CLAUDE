// ---------- d: la gloria, la calle, la donación, los MacBooks y el remate (103,0 – 134,6 s) ----------
// Escenario de la plaza: STAGE en (0, 0, 20) mirando +z (tablero a 3,2). Letrero de la calle en (36, 0, 26). FRAUENHAUS: fachada este x = 43, z = -17,5.
const STZ = 20, SGX = -28, SGZ = 12;
const stageOn = () => { STAGE.g.visible = true; STAGE.g.position.set(0, 0, STZ); STAGE.g.rotation.y = 0; };
const signOn = (L, k = 0) => { if (SSIGN.SIGN.parent !== SSIGN.g) SSIGN.g.add(SSIGN.SIGN); show(SSIGN.g, SGX, 0, SGZ, .5); SSIGN.SIGN.rotation.set(0, 0, k * .9); SSIGN.SIGN.position.set(k * 1.5, 13.2 - k * 3, 0); };

// 77 «Die Frauen haben mich gefeiert.»: en la plaza me lanzan al aire; confeti
shot(102.99, 'W', null, L => { town(L); const j = Math.abs(Math.sin(L.lt * 4)); const c = put(benC, 0, 6 + j * 4, 8, 0); c.blob.visible = false; actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .2, aRe: .2, lLx: -.3, lRx: .3 }]], { T: L.T }); laughF(c, L.T);
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; const w = put(EX[i], Math.cos(a) * 3, 0, 8 + Math.sin(a) * 3, a + PI / 2 + PI); actuar(w, 0, [[0, { aLx: 2.9, aRx: 2.9, aLe: .2, aRe: .2 }]], { T: L.T }); laughF(w, L.T + i); w.root.rotation.y = faceTo(w.root.position, V(0, 0, 8)); }
  crowdAt(L, 0, 4, 10, 8, 20, 16, { mode: 'cheer', from: 6 }); confRain(V(0, 0, 8), L.T, 70, 24, 24, 20); orb(L.k, V(0, 7, 8), null, [26, .1, .05, 48], [22, -.1, .02, 46]); sh(V(0, 0, 6), 26); }, [[0, 'cheer', .6], [.2, 'party_horn', .5], [.5, 'confetti', .4]]);
// 78 «Die Bürgermeisterin hat mir einen Orden gegeben.»: en el escenario, la alcaldesa me cuelga la medalla; pancarta HELD DER FRAUENRECHTE
shot(104.67, 'C', null, L => { town(L); stageOn(); const c = put(benC, 1.6, 3.2, STZ + 1, -.25); actuar(c, 0, [[0, { headX: .2, aLx: .2, aRx: .2 }]], { T: L.T }); grin(c, L.T); const m = put(bm, -1.8, 3.2, STZ + 1, .5); const k = clamp(L.lt / .7); actuar(m, 0, [[0, { aLx: lerp(1.2, 1.8, k), aRx: lerp(1.2, 1.8, k), aLe: lerp(1.2, .6, k), aRe: lerp(1.2, .6, k), lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'smile' });
  show(MEDAL, lerp(-.4, 1.5, k), lerp(9.4, 8.6, k) + 3.2 - 3.2, STZ + 1.6, -.25); crowdAt(L, 0, STZ + 12, 10, 3, 12, 17, { mode: 'clap' });
  cm([6, 10, STZ + 22], [3, 9, STZ + 15], L.k); camera.lookAt(0, 8, STZ); camera.fov = 44; sh(V(0, 0, STZ + 4), 22); }, [[0, 'fanfare', .4], [.6, 'click_metal', .4], [.7, 'cheer', .4]]);
// 79 «Orden gegeben.»: primer plano de la medalla de oro brillando en mi pecho
shot(105.89, 'Z', 'punch', L => { town(L); stageOn(); const c = put(benC, 1.6, 3.2, STZ + 1, -.25); grin(c, L.T); const n = wpos(c.spine).add(V(.15, .9, .9)); show(MEDAL, n.x, n.y, n.z + .1, -.25); MEDAL.rotation.z = Math.sin(L.T * 3) * .15;
  cm([n.x + 1.2, n.y + .4, n.z + 6], [n.x + .9, n.y + .3, n.z + 4.8], L.k); camera.lookAt(n.x, n.y + .2, n.z); camera.fov = 40; sh(V(0, 0, STZ), 10); }, [[0, 'sparkle', .6], [.1, 'ding_soft', .5]]);
// 80 «Sie haben sogar eine Straße nach mir benannt.»: descubren el letrero azul: «Ben-Hartmann-Straße»; la gente aplaude
shot(106.51, 'S', null, L => { town(L, { statue: false }); signOn(L); const c = put(benC, SGX + 3.5, 0, SGZ + 5, .2); actuar(c, 0, [[0, { aRx: 2.6, aRz: .4, aRe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'gasp' }); crowdAt(L, SGX + 4, SGZ + 10, 8, 4, 12, 18, { mode: 'clap', face: V(SGX, 0, SGZ) });
  cm([SGX + 12, 6, SGZ + 22], [SGX + 8, 10, SGZ + 16], L.k); camera.lookAt(SGX, 11.5, SGZ); camera.fov = 44; sh(V(SGX + 2, 0, SGZ + 4), 22); }, [[0, 'cheer', .5], [.2, 'bells', .4]]);
// 81 «Straße nach mir benannt.»: el letrero de cerca
shot(107.53, 'C', null, L => { town(L, { statue: false }); signOn(L); const s = wpos(SSIGN.SIGN); cm([s.x + 4, s.y - 1.4, s.z + 9], [s.x + 3, s.y - .8, s.z + 7.4], L.k); camera.lookAt(s.x, s.y, s.z); camera.fov = 40; sh(V(SGX, 0, SGZ), 16); }, [[0, 'magic_hit', .4]]);
// 82 «Aber ich habe das Schild selbst abgeschraubt.»: subo la escalera con el destornillador
shot(108.76, 'Z', null, L => { town(L, { statue: false }); signOn(L); show(LADDER, SGX + .5, 0, SGZ + 1, .5); LADDER.rotation.x = -.12; const y = lerp(2, 4.2, easeOut(clamp(L.lt / .6))); const c = put(benC, SGX + 1.1, y, SGZ + 2.1, PI + .5); c.blob.visible = false; actuar(c, 0, [[0, { aRx: 2.8, aRz: .2, aRe: .4, aLx: 2.2, aLe: .6, lLx: .4, lLk: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); attach(SCREW, c.aR.hand, [0, -.4, .3], [PI / 2, 0, 0], 1);
  crowdAt(L, SGX + 4, SGZ + 14, 5, 4, 10, 19, { mode: 'point', face: V(SGX, 6, SGZ) }); cm([SGX + 13, 8, SGZ + 18], [SGX + 10, 10, SGZ + 14], L.k); camera.lookAt(SGX, 9, SGZ + 1); camera.fov = 46; sh(V(SGX, 0, SGZ + 2), 18); }, [[0, 'wood_creak', .5], [.4, 'steps', .3]]);
// 83 «abgeschraubt.»: el tornillo gira y sale; el letrero se inclina
shot(110.06, 'C', 'punch', L => { town(L, { statue: false }); const k = easeIn(clamp((L.lt - .25) / .4)); signOn(L, k); const sc = SSIGN.SCR[1]; sc.position.z = .2 + clamp(L.lt / .25) * .6; sc.rotation.y = L.T * 20;
  const s = wpos(SSIGN.SIGN); cm([s.x + 6.5, s.y + .6, s.z + 5], [s.x + 5.8, s.y + .4, s.z + 4], L.k); camera.lookAt(s.x + 3.5, s.y, s.z); camera.fov = 40; sh(V(SGX, 0, SGZ), 14); }, [[0, 'ratchet', .7], [.35, 'metal_creak', .5]]);
// 84 «Denn ein Mann sollte keine Straße dafür kriegen,»: abajo, con el letrero en las manos, niego con la cabeza humilde; las mujeres suspiran (corazones)
shot(110.82, 'W', null, L => { town(L, { statue: false }); const c = put(benC, SGX + 6, 0, SGZ + 8, .2); actuar(c, 0, [[0, { ...GEST.hold, headY: Math.sin(L.T * 7) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'relief' }); attach(SSIGN.SIGN, c.aL.hand, [1.2, -.6, .9], [0, -PI / 2, 0], .55);
  crowdAt(L, SGX + 6, SGZ + 8, 8, 5, 12, 20, { mode: 'idle', expr: 'love', face: V(SGX + 6, 0, SGZ + 8) }); hearts(V(SGX + 6, 6, SGZ + 8), L.t0, L.T, 8, .9); onBody(c, 16, 0, .1, 44, L.k, 13); sh(V(SGX + 6, 0, SGZ + 8), 18); }, [[0, 'gasp_f', .4], [.3, 'hug', .3]]);
// 85 «dass er einfach das Richtige tut.»: entrego el letrero a una vecina y sonrío modesto
shot(112.91, 'S', null, L => { town(L, { statue: false }); const c = put(benC, SGX + 6, 0, SGZ + 8, .2); actuar(c, 0, [[0, { aRx: 1.4, aRe: .4, aLx: 1.4, aLe: .4, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'smile' }); const w = put(EX[4], SGX + 2.6, 0, SGZ + 10.4, .9 + PI / 2 + .3); actuar(w, 0, [[0, { aLx: 1.4, aRx: 1.4, aLe: .5, aRe: .5 }]], { T: L.T }); cara(w, L.T, { expr: 'love' });
  orb(L.k, V(SGX + 4.4, 4.6, SGZ + 9), null, [15, -.3, .12, 44], [13, -.45, .1, 44]); sh(V(SGX + 4, 0, SGZ + 9), 14); }, [[0, 'whoosh', .3], [.3, 'ding_soft', .4]]);
// 86 «Deshalb habe ich das ganze Preisgeld,»: abro un maletín lleno de billetes
shot(114.57, 'C', null, L => { town(L, { statue: false }); const c = put(benC, -30, 0, -14, PI / 2); actuar(c, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: .8, aRe: .8 }]], { T: L.T }); grin(c, L.T); coins(V(-27, 2, -14), L.t0, L.T, 10);
  onBody(c, 16, -.2, .12, 44, L.k, 13); sh(V(-30, 0, -14), 14); }, [[0, 'briefcase', .6], [.3, 'money_rain', .5]]);
// 87 «50.000 Euro,»: el cheque gigante: 50.000 €
shot(116.10, 'Z', 'punch', L => { town(L, { statue: false }); const c = put(benC, 38, 0, 13.5, -PI / 2); actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .3, aRz: .3, aLe: .4, aRe: .4 }]], { T: L.T }); grin(c, L.T); show(CHECK, 36.2, 7.8, 13.5, -PI / 2);
  badge('gold', '50.000 €', W / 2, H * .19, clamp(L.lt / .12), 1, 1.1); cm([22, 8, 15], [25, 8, 14], L.k); camera.lookAt(37, 6.4, 13.5); camera.fov = 46; sh(V(36, 0, 13.5), 16); }, [[0, 'cash', .6], [.05, 'impact', .4]]);
// 88 «dem Frauenhaus gespendet.»: delante del FRAUENHAUS, las mujeres reciben el cheque y me abrazan
shot(117.39, 'W', null, L => { town(L, { statue: false }); const c = put(benC, 36, 0, 16, -PI / 2 - .3); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.4, aRz: -.4, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'relief' });
  for (let i = 0; i < 3; i++) { const w = put(EX[i * 3 + 1], 39.5, 0, 12 + i * 2.2, -PI / 2 + .4 - i * .2); actuar(w, 0, [[0, i === 1 ? { aLx: 2.0, aRx: 2.0, aLe: .4, aRe: .4 } : { aLx: 1.3, aRx: 1.3, aLz: -.4, aRz: -.4, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(w, L.T + i, { expr: 'joy' }); }
  show(CHECK, 39.8, 8, 14, -PI / 2, .7); hearts(V(38, 7, 14), L.t0, L.T, 6, .8); cm([18, 7, 25], [22, 6.6, 21], L.k); camera.lookAt(40, 6, 14); camera.fov = 46; sh(V(38, 0, 14), 18); }, [[0, 'hug', .5], [.3, 'cheer', .4], [.6, 'kids_laugh', .2]]);
// 89 «Und ich habe sogar gratis Programmierkurse für Mädchen gestartet.»: aula con portátiles: chicas programando; pizarra «PROGRAMMIEREN»
const laps = (L, n = 6) => { for (let i = 0; i < n; i++) { const x = KLX - 11 + (i % 3) * 11, z = -2 + Math.floor(i / 3) * 8; show(LAPS[i], x, 3.9, z, PI); LAPS[i].userData.S && LAPS[i].userData.S.draw && LAPS[i].userData.S.draw(Math.floor(L.T * 6), (c, w, h) => { c.fillStyle = '#14161e'; c.fillRect(0, 0, w, h); for (let k = 0; k < 9; k++) { c.fillStyle = ['#5aff9a', '#7ad8ff', '#ffd23f', '#ff8ad0'][(k + i) % 4]; c.fillRect(14 + (k % 3) * 12, 14 + k * 20, 60 + ((k * 37 + i * 11 + Math.floor(L.T * 6)) % 180), 8); } }); } };
shot(118.91, 'S', null, L => { klasseS(L, { board: ['PROGRAMMIEREN', 'GRATIS · NUR FÜR MÄDCHEN'] }); laps(L); for (let i = 0; i < 6; i++) { const c = EX[i * 2 + 1], x = KLX - 11 + (i % 3) * 11, z = -2 + Math.floor(i / 3) * 8; sit(c, x, SEAT, z - 2.8, 0, L, { aLx: 1.3, aRx: 1.3, aLe: 1.4 + Math.sin(L.T * 20 + i) * .1, aRe: 1.4, headX: .25 }); cara(c, L.T + i, { expr: 'determined' }); }
  cm([KLX - 14, 10, -14], [KLX - 9, 9, -11], L.k); camera.lookAt(KLX + 2, 4, 4); camera.fov = 48; sh(V(KLX, 0, 2), 22); }, [[0, 'clack', .6], [.4, 'clack', .5], [.8, 'clack', .5]]);
// 90 «für Mädchen gestartet.»: primer plano: una chica teclea y sonríe; en la pantalla, código de colores
shot(120.63, 'C', null, L => { klasseS(L, { board: ['PROGRAMMIEREN', 'GRATIS · NUR FÜR MÄDCHEN'] }); laps(L, 1); const c = sit(mia, KLX - 11, SEAT, -4.8, 0, L, { aLx: 1.3, aRx: 1.3, aLe: 1.4 + Math.sin(L.T * 20) * .15, aRe: 1.4, headX: .3 }); grin(c, L.T);
  cm([KLX - 8.4, 6.4, .6], [KLX - 9, 6, -.6], L.k); camera.lookAt(KLX - 11, 4.6, -4.6); camera.fov = 42; sh(V(KLX - 11, 0, -3), 10); }, [[0, 'clack', .6], [.5, 'notif', .4]]);
// 91 «Jede hat ihr eigenes MacBook bekommen.»: todas levantan su portátil gritando de alegría; yo aplaudo al fondo
shot(121.47, 'F', null, L => { klasseS(L, { board: ['PROGRAMMIEREN', 'GRATIS · NUR FÜR MÄDCHEN'] }); for (let i = 0; i < 6; i++) { const c = EX[i * 2 + 1], x = KLX - 11 + (i % 3) * 11, z = -2 + Math.floor(i / 3) * 8; const j = Math.abs(Math.sin(L.T * 7 + i)); put(c, x, j * .5, z + 2, PI); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .2, aRz: .2, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T + i); attach(LAPS[i], c.aR.hand, [-.9, -.8, 0], [0, 0, 0], .6); }
  const b = put(benC, KLX + 6, 0, -9, .2); actuar(b, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - Math.abs(Math.sin(L.T * 14)) * .25, aRz: -.2 - Math.abs(Math.sin(L.T * 14)) * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); grin(b, L.T);
  cm([KLX + 4, 9, 24], [KLX + 2, 8.6, 20], L.k); camera.lookAt(KLX, 5, 0); camera.fov = 48; sh(V(KLX, 0, 2), 24); }, [[0, 'cheer', .6], [.2, 'kids_laugh', .4]]);
// 92 «Am Ende war ich der größte Feminist der ganzen Stadt.»: grúa lenta: yo en el escenario con el puño en alto, la estatua al fondo, la plaza llena
shot(123.50, 'W', 'slow', L => { town(L); stageOn(); const c = put(benC, 0, 3.2, STZ + 1, 0); actuar(c, 0, [[0, { aRx: 2.9, aRz: .1, aRe: .1, aLx: .3 }]], { T: L.T }); grin(c, L.T); halo(c, L.T);
  crowdAt(L, 0, STZ + 14, 20, 3, 18, 21, { mode: i => i % 2 ? 'cheer' : 'clap', face: V(0, 0, STZ) }); confRain(V(0, 0, STZ + 6), L.T, 50, 26, 20, 22);
  cm([0, 6, STZ + 34], [0, 20, STZ + 48], L.k); camera.lookAt(0, lerp(7, 14, L.k), STZ - 10); camera.fov = 46; sh(V(0, 0, STZ + 6), 34); }, [[0, 'cheer', .5], [.3, 'choir', .4]]);
// 93 «Und trotzdem habe ich bis heute keine Freundin.»: al atardecer, solo en un banco; una pareja pasa de la mano
shot(126.22, 'C', null, L => { town(L, { dusk: true, statue: false }); const c = sit(benC, -40, 2.4, 6, PI / 2, L, { headX: .45, aLx: .4, aRx: .4, aLe: .8, aRe: .8 }); cara(c, L.T, { expr: 'sad' });
  for (let i = 0; i < 2; i++) { const w = put([jana, kevin][i], -30 + L.lt * 3, 0, 1 + i * 2.2, PI / 2); actuar(w, 0, [[0, { ...walkP(L.T, i), [i ? 'aLx' : 'aRx']: .5, [i ? 'aLz' : 'aRz']: -.4 }]], { T: L.T }); cara(w, L.T + i, { expr: 'love' }); }
  orb(L.k, V(-38, 4, 5), null, [17, 1.25, .12, 44], [14, 1.4, .1, 44]); sh(V(-36, 0, 4), 18); }, [[0, 'sad_tone', .5], [.3, 'birds', .2]]);
// 94 «keine Freundin.»: primer plano triste; una lágrima
shot(127.62, 'I', null, L => { town(L, { dusk: true, statue: false }); const c = sit(benC, -40, 2.4, 6, PI / 2, L, { headX: .2 }); cara(c, L.T, { expr: 'cry' }); tears(c, L.T); onFace(c, 6.4, 0, 0, 40, L.k, 5.6); sh(V(-40, 0, 6), 10); }, [[0, 'sniff', .5]]);
// 95 «Die Letzte hat gesagt:»: flashback en el café: Jana frente a mí, yo con flores
shot(128.55, 'S', null, L => { restS(L); const b = sit(benC, REX, RSEAT, 3.4, PI, L, { aRx: 1.4, aRe: .6, aLx: 1.1, aLe: 1.2 }); grin(b, L.T); const j = sit(jana, REX, RSEAT, -3.4, 0, L, { aLx: 1.1, aRx: 1.1, aLe: 1.4, aRe: 1.4 }); cara(j, L.T, { expr: 'smile' });
  orb(L.k, V(REX, 4.4, 0), null, [17, 1.3, .16, 44], [14.5, 1.45, .14, 44]); sh(V(REX, 0, 0), 14); }, [[0, 'piano_note', .4]]);
// 96 «Du bist echt süß.»: Jana me lo dice (labios) y me pellizca la mejilla
shot(129.55, 'C', null, L => { restS(L); const j = sit(jana, REX, RSEAT, -3.4, 0, L, { aRx: 2.0, aRz: -.1, aRe: .6, aLx: 1.1, aLe: 1.4, lean: .1 }); talk(j, L.T, 129.55, 130.53, 'smile'); hearts(V(REX, 7, -2), L.t0, L.T, 3, .5);
  onFace(j, 6.4, .2, 3.4, 42, L.k, 5.6); sh(V(REX, 0, -3), 12); }, [[0, 'pop', .3]]);
// 97 «Aber ich stehe eher auf Bad Boys.»: ella mira por la ventana soñadora; yo me quedo blanco
shot(130.64, 'Z', null, L => { restS(L); const b = sit(benC, REX, RSEAT, 3.4, PI, L, { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2 }); cara(b, L.T, { expr: 'shock' }); const j = sit(jana, REX, RSEAT, -3.4, 0, L, { headY: -.7, headX: -.2, aRx: 1.9, aRz: -.4, aRe: 2.2 }); talk(j, L.T, 130.64, 132.12, 'love');
  cm([REX - 7.4, 6.9, 1.2], [REX - 6.6, 6.6, .4], L.k); camera.lookAt(REX, 5.6, -3.2); camera.fov = 44; sh(V(REX, 0, 0), 12); }, [[0, 'sad_tone', .4]]);
// 98 «Auf die, die noch drinsitzen.»: desde dentro de la celda, por encima del hombro de Kevin (M-∞): Jana le saluda enamorada desde fuera; yo, al lado, me tapo la cara
shot(132.42, 'C', 'punch', L => { zelleS(L, { tally: 'LEBENSLANG', n: 20 }); const k = put(kevinJ, ZEX + 3.4, 0, 4.6, -.5); actuar(k, 0, [[0, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 8) * .25, aRe: .4, aLx: 1.6, aLe: 1.8 }]], { T: L.T }); cara(k, L.T, { expr: 'wink' });
  const j = put(jana, ZEX - 2, 0, 10.6, PI + .25); actuar(j, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .3, aRe: .3, headZ: .2 }]], { T: L.T }); cara(j, L.T, { expr: 'love' }); hearts(V(ZEX - 2, 7.5, 10), L.t0, L.T, 5, .6);
  const b = put(benC, ZEX - 7, 0, 11.8, PI + .7); actuar(b, 0, [[0, 'facepalm']], { T: L.T }); cara(b, L.T, { expr: 'sad' });
  cm([ZEX + 5.2, 6.6, -1.6], [ZEX + 4.4, 6.3, .2], L.k); camera.lookAt(ZEX - 2.6, 5.2, 10); camera.fov = 48; sh(V(ZEX, 0, 6), 16); }, [[0, 'slam', .4], [.3, 'laugh_deep', .3], [.7, 'sad_tone', .5], [1.4, 'boing_metal', .3]]);
