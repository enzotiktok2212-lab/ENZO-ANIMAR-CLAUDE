// ===== Parte 3b: el rescate, Smaragd estalla, la noche de los monigotes, el jardín (202,2 – 255,6 s) =====
// ---------- 106 · «Der Regen fraß den Drachen vom Schwanz her auf –» : la cola se deshace a chorros ----------
shot(202.18, 'S', 'slow', L => { const T = L.T; storm_(L, 1, V(-10, 30, -3), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .35 + L.k * .3 }); const p = DRA.seat(11); put(lina, p.x, p.y - .2, p.z, PI / 2 + .4); applyPose(lina, { ...RIDE, lean: .5, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3, ...shiver(T, 2) }); cara(lina, T, { expr: 'shock', mouth: 'grimace' }); show(SLD, 0, 0, 0);
  orb(L.k, V(-10, 30, -3), null, [50, -.25, .05, 48], [40, -.15, .05, 46], easeIn); sh(V(-10, 0, -3), 50); }, [[0, 'drip', .8], [.5, 'drip', .8], [1.0, 'water_bloop', .7], [1.6, 'drip', .7]]);
// ---------- 107 · «und meine Rutsche von oben.» : la cima del tobogán se derrite ----------
shot(204.80, 'C', null, L => { const T = L.T; storm_(L, 1, V(0, 25, 0), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .04 + L.k * .1); puff(V(0, 28 - L.k * 3, 0), L.t0, T, 10, .7, DUST, 1.4); DRA.g.visible = true; DRA.update(T, DP, { melt: .62 });
  orbit(V(0, 26, 0), 22, .8, -.05, 46); sh(V(0, 0, 0), 40); }, [[0, 'drip', .8], [.6, 'water_bloop', .6]]);
// ---------- 108 · «Also kletterte ich hoch.» : Emil sube por los escalones ----------
shot(206.23, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 15, 0), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .14);
  const y = 4 + L.lt * 9; put(emil, 0, y, -2.1, 0); applyPose(emil, { aLx: 2.6 + Math.sin(T * 10) * .4, aRx: 2.6 - Math.sin(T * 10) * .4, aLe: .4, aRe: .4, lLx: .8 + Math.sin(T * 10) * .6, lRx: .8 - Math.sin(T * 10) * .6, lLk: .8, lRk: .8, lean: .1, headX: -.4 }); cara(emil, T, { expr: 'determined', mouth: 'grimace' });
  orbit(V(0, y + 2, -1.6), 14, PI / 2 + .55, -.05, 46); sh(V(0, 0, 0), 30); }, [[0, 'steps', .8], [.3, 'steps', .7], [.6, 'steps', .7], [.9, 'strain', .5]]);
// ---------- 109 · «Ich packte Lina,» ----------
shot(207.51, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 30, 0), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .14); DRA.g.visible = true; DRA.update(T, DP, { melt: .64 });
  const p = DRA.seat(11); put(lina, p.x, p.y - .2, p.z, PI / 2 + .4); applyPose(lina, { ...RIDE, aLx: 1.6, aRx: 1.6, aLz: .3, aRz: .3, aLe: .3, aRe: .3, lean: .2 }); cara(lina, T, { expr: 'shock', mouth: 'o' });
  put(emil, p.x + 1.6, p.y - 1.4, p.z + 2.2, -2.2); applyPose(emil, { aRx: 1.8, aRe: .3, aLx: 1.8, aLe: .3, lean: .3 }); cara(emil, T, { expr: 'determined', mouth: 'talk_wide' });
  orbit(p.clone().add(V(.8, .6, 1)), 16, 1.2, .6, 44); sh(V(0, 0, 0), 40); }, [[0, 'tug', .7], [.2, 'gasp', .5]]);
// ---------- 110 · «Lina packte Krümel,» ----------
shot(208.79, 'S', null, L => { const T = L.T; storm_(L, 1, V(0, 30, 0), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .15); const P = SLD.userData.P(0); const b = V(P.x, P.y + 1.1, P.z + .6);
  put(emil, b.x, b.y, b.z, 0); applyPose(emil, { ...SIT, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3 }); cara(emil, T, { expr: 'determined', mouth: 'smile' });
  put(lina, b.x, b.y + .1, b.z + 1.6, 0); applyPose(lina, { ...SIT, aLx: 1.5, aRx: 1.5, aLz: -.3, aRz: -.3, aLe: .9, aRe: .9 }); cara(lina, T, { eyes: 'wide', mouth: 'o' }); show(KRU, b.x, b.y - .6, b.z + 3.1, 0, .6); KRU.userData.anim(T, 1);
  orbit(b.clone().add(V(0, 1.2, 1.5)), 10, .5, .2, 44); sh(V(0, 0, 0), 40); }, [[0, 'bark', .8], [.3, 'tug', .6]]);
// ---------- 111 · «und wir rutschten los.» : ¡wiii! bajan a toda velocidad ----------
shot(209.77, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 18, 14), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .15 + L.k * .2); const s = easeIn(clamp(L.lt / 2.4)) * .45;
  const P = SLD.userData.P(s); const b = V(P.x, P.y + 1.1, P.z);
  put(emil, b.x, b.y, b.z, 0); applyPose(emil, { ...SIT, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3 }); cara(emil, T, { eyes: 'wide', mouth: 'open_smile' });
  put(lina, b.x, b.y + .1, b.z + 1.4, 0); applyPose(lina, { ...SIT, aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9 }); cara(lina, T, { eyes: 'wide', mouth: 'open_smile' }); show(KRU, b.x, b.y - .6, b.z + 2.8, 0, .6); KRU.userData.anim(T, 1);
  cam([b.x + 5, b.y + 3, b.z + 12], [b.x, b.y + 1, b.z], 48); sh(V(0, 0, 10), 40); }, [[0, 'whoosh_down', 1], [.3, 'kids_laugh', .6], [.8, 'bark', .5]]);
// ---------- 112 · «Hinter uns schmolz die Rutsche weg, Stufe für Stufe.» : cámara detrás; el tobogán desaparece a su paso ----------
shot(211.21, 'S', null, L => { const T = L.T; storm_(L, 1, V(0, 12, 20), 1); show(SLD, 0, 0, 0); const s = .45 + L.k * .4; SLD.userData.set(1, Math.min(.95, 1 - (1 - s) * 1.25 + .1)); const P = SLD.userData.P(s); const b = V(P.x, P.y + 1.1, P.z);
  put(emil, b.x, b.y, b.z, 0); applyPose(emil, { ...SIT, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3, headY: L.lt > 1.3 ? .9 : 0 }); cara(emil, T, { eyes: 'wide', mouth: 'o' });
  put(lina, b.x, b.y + .1, b.z + 1.4, 0); applyPose(lina, { ...SIT, aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9 }); cara(lina, T, { eyes: 'closed', mouth: 'grimace' }); show(KRU, b.x, b.y - .6, b.z + 2.8, 0, .6); KRU.userData.anim(T, 1);
  puff(V(0, P.y + 4, P.z - 5), L.t0, T, 10, .7, DUST, 3);
  cam([b.x - 12, b.y + 7, b.z - 7], [b.x, b.y + 1, b.z + 2], 50); sh(V(0, 0, 12), 40); }, [[0, 'drip', .8], [.5, 'water_bloop', .6], [1.0, 'drip', .7], [1.6, 'water_bloop', .6], [2.2, 'drip', .6]]);
// ---------- 113 · «Wir flogen unten raus –» : salen volando al final, a cámara lenta ----------
shot(214.27, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 5, 36), .9); show(SLD, 0, 0, 0); SLD.userData.set(1, .8); const k = L.k, b = arc([0, 1.8, 34], [0, 2.4, 41], 3.5, k);
  put(emil, b.x, b.y, b.z, 0); emil.root.rotation.x = -.3; applyPose(emil, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, lLx: .6, lRx: -.3, lLk: .5 }); cara(emil, T, { eyes: 'wide', mouth: 'open_smile' });
  put(lina, b.x - 1.4, b.y + .5, b.z + .8, .2); applyPose(lina, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }); cara(lina, T, { eyes: 'wide', mouth: 'o' }); show(KRU, b.x + 1.6, b.y + .6, b.z + 1, -.3, .6); KRU.userData.anim(T, 1);
  orb(k, V(0, 6, 38), null, [21, .5, .08, 46], [20, .3, .08, 46]); sh(V(0, 0, 36), 24); }, [[0, 'whoosh_up', .6], [.4, 'kids_laugh', .5]]);
// ---------- 114 · «direkt in die Arme des alten Mannes.» : el anciano los atrapa; tintinean las llaves ----------
shot(215.67, 'C', null, L => { const T = L.T; storm_(L, 1, V(0, 5, 42), .9); const k = clamp(L.lt / .35), b = arc([0, 2.4, 40], [0, 2.2, 42.2], 1, k);
  put(opa, 0, 0, 43.6, PI); keysOn(); actuar(opa, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5 }], [.35, { aLx: 1.2, aRx: 1.2, aLz: -.5, aRz: -.5, aLe: 1.4, aRe: 1.4, crouch: .2, lean: .1 }]], { T }); cara(opa, T, L.lt > .35 ? { eyes: 'happy', mouth: 'open_smile' } : { expr: 'shock', mouth: 'o' });
  put(emil, b.x - 2.3, b.y - .4, b.z - .4, PI * (k > .9)); applyPose(emil, { aLx: 1.4, aRx: 1.4, aLz: -.4, aRz: -.4, aLe: 1.2, aRe: 1.2 }); cara(emil, T, { eyes: 'happy', mouth: 'open_smile' });
  put(lina, b.x + 2.2, b.y - .2, b.z - .2, PI * (k > .9)); applyPose(lina, { aLx: 1.4, aRx: 1.4, aLe: 1.2, aRe: 1.2 }); laughF(lina, T); show(KRU, b.x + 3.6, 0, b.z - 1, PI, .6); KRU.userData.anim(T, 1);
  orb(L.k, V(0, 4.4, 42.5), null, [15, PI + .2, .35, 44], [13, PI + .1, .32, 44]); sh(V(0, 0, 42), 20); }, [[.3, 'land', .8], [.35, 'keys', .9], [.6, 'hug', .7], [1.2, 'laugh_old', .6]]);
// ---------- 115 · «Dann zerplatzte Smaragd zu einer riesigen Wolke aus grünem Kreidestaub.» : explosión verde (zoom lento + golpe) ----------
shot(217.74, 'F', 'slow', L => { const T = L.T; storm_(L, 1 - L.k * .3, V(0, 30, -3), .8); const pop = L.lt > .25; DRA.g.visible = !pop; if (!pop) DRA.update(T, DP, { melt: .8 });
  puff(V(0, 33, -3), L.t0 + .25, T, 40, 4.5, GDUST, 2.6); crowdAt(T, grid(-30, -20, 30, 30, 90, 16, 0), 'still', true);
  orb(L.k, V(0, 26, -3), null, [70, .15, -.1, 50], [56, .1, -.12, 46], easeIn); sh(V(0, 0, -3), 60); }, [[.25, 'explosion', .9], [.3, 'magic_hit', .7], [.6, 'wind', .6], [1.2, 'sparkle', .5]]);
// ---------- 116 · «… aus grünem Kreidestaub.» : el polvo verde cae sobre la gente como nieve ----------
shot(219.86, 'W', null, L => { const T = L.T; town('storm'); storm(.6); RAIN.update(T, V(0, 0, 10), .3);
  GDUST.forEach((d, i) => { const r = RNG(i * 3 + 1); d.visible = true; d.position.set((r() - .5) * 30, 14 - ((T * 1.5 + r() * 14) % 14), (r() - .5) * 20); d.scale.setScalar(1 + r() * .8); d.material.opacity = .6; });
  bg(L, [[XT[0], -4, 0, .3, 'look'], [XT[2], 4, -2, -.3, 'look', .3], [K[1], 0, -4, 0, 'look', .6], [lea, -7.5, -3, .5, 'scared']]); crowdAt(T, grid(-30, -30, 30, -10, 70, 17, 0), 'still');
  orb(L.k, V(0, 4, -1), null, [20, .1, .1, 46], [18, -.05, .1, 46]); sh(V(0, 0, 0), 24); }, [[0, 'sprinkle', .7], [.8, 'wind', .5]]);
// ---------- 117 · «Und einfach so hörte der Regen auf.» : sale el sol, un rayo de luz ----------
shot(221.71, 'F', null, L => { const T = L.T; town(); storm(1 - L.k); RAIN.update(T, V(0, 0, 0), clamp(1 - L.lt / .8)); CLO.set(V(0, 0, -10), T, 1 - L.k, 160, 70); bloom.strength = .2 + L.k * .2;
  put(emil, 0, 0, 0, 0); actuar(emil, L.lt, [[0, { headX: -.5 }], [.8, { headX: -.3, aLx: .5, aRx: .5, aLz: .6, aRz: .6 }]], { T }); cara(emil, T, { eyes: L.lt > .8 ? 'happy' : 'wide', mouth: 'open_smile' }); show(KRU, 2.6, 0, .8, -.4, .8); KRU.userData.anim(T, 0);
  orb(L.k, V(.6, 3, 0), null, [14, .2, -.15, 46], [12, .1, -.2, 46]); sh(V(0, 0, 0), 16); }, [[0, 'sunrise_shine', .7], [.5, 'birds', .6]]);
// ---------- 118 · «Alle senkten ihre Schirme.» ----------
shot(223.85, 'S', null, L => { const T = L.T; town(); const U_ = umbRoof(1).map(u => [u[0], -L.k * 5, u[2], .6 * L.k, 0, 0, 1 - L.k * .3]); UMF.set(U_); crowdAt(T, roofPeople(U_), 'cheer');
  orbit(V(0, 4, 10), 50 - L.k * 6, .05, .45, 50); sh(V(0, 0, 10), 60); }, [[0, 'umbrella', .6], [.4, 'umbrella', .5], [.8, 'cheer', .6]]);
// ---------- 119 · «Smaragd war weg.» : Lea mira el cielo vacío ----------
shot(225.09, 'Z', null, L => { const T = L.T; town(); put(lea, 0, 0, 0, .2); actuar(lea, L.lt, [[0, { headX: -.45, aLx: .2, aRx: .2 }]], { T }); cara(lea, T, { expr: 'sad', mouth: 'frown' }); GDUST.forEach((d, i) => { if (i > 10) return; const r = RNG(i); d.visible = true; d.position.set((r() - .5) * 10, 8 + r() * 6 - L.lt, -6 + (r() - .5) * 4); d.scale.setScalar(.3); d.material.opacity = .4; });
  orb(L.k, V(0, 4, -1), null, [13, -.3, -.2, 46], [12, -.4, -.25, 46]); sh(V(0, 0, 0), 16); }, [[0, 'sad_tone', .5]]);
// ---------- 120 · «Meine Rutsche war weg.» : un charco donde estaba el tobogán ----------
shot(226.35, 'C', null, L => { const T = L.T; town(); dec(DC.slide, 0, 8, 0, .3); put(emil, 1.4, 0, 2, -.3); actuar(emil, L.lt, [[0, 'shrug']], { T }); cara(emil, T, { expr: 'sad', mouth: 'smile' });
  orb(L.k, V(.6, 2.4, 3), null, [14, .3, .35, 46], [13, .15, .35, 46]); sh(V(0, 0, 2), 16); }, [[0, 'water_bloop', .5]]);
// ---------- 121 · «Aber jedes einzelne Kind war in Sicherheit.» : abrazos y vítores ----------
shot(227.43, 'W', null, L => { const T = L.T; town(); bloom.strength = .3;
  bg(L, [[K[0], -4, 0, .3, 'cheer'], [K[1], 0, -1, 0, 'cheer', .3], [K[2], 4, 0, -.3, 'cheer', .6], [K[3], -2, -4, .2, 'clap'], [K[4], 2.4, -4, -.2, 'cheer', .2], [XT[0], -7, -3, .5, 'clap'], [XT[6], 7, -3, -.5, 'clap', .4]]);
  confetti(V(0, 4, -2), L.t0 + .2, T, 40); crowdAt(T, grid(-30, -30, 30, -10, 70, 18, 0), 'cheer');
  orb(L.k, V(0, 3, -1.5), null, [19, .15, .12, 46], [17, -.1, .12, 46]); sh(V(0, 0, 0), 24); }, [[0, 'cheer', .9], [.2, 'confetti', .6], [.8, 'kids_laugh', .7], [1.6, 'clap', .6]]);
// ---------- 122 · «Und der alte Mann war immer noch da.» : el anciano al sol (zoom lento) ----------
shot(229.88, 'F', 'slow', L => { const T = L.T; town('morning'); put(opa, 0, 0, 0, 0); keysOn(); actuar(opa, L.lt, [[0, 'idle']], { T }); cara(opa, T, { expr: 'happy', mouth: 'smile' }); bloom.strength = .32;
  crowdAt(T, grid(-30, -36, 30, -14, 50, 19, 0), 'sway');
  orb(L.k, V(0, 3.6, 0), null, [22, .1, .1, 46], [13, 0, .08, 42], easeIn); sh(V(0, 0, 0), 16); }, [[0, 'strings', .5], [.8, 'keys', .4]]);
// ---------- 123 · «Kein einziger Fleck – und immer noch voller Schlüssel.» : guiña el ojo, sacude las llaves ----------
shot(231.59, 'C', null, L => { const T = L.T; town('morning'); put(opa, 0, 0, 0, -.2); keysOn(); actuar(opa, L.lt, [[0, { aRx: 1.0, aRz: -.4, aRe: 1.2 }], [1.4, { aRx: 2.6, aRz: .3, aRe: .2, aLx: .3 }]], { T, extra: { sx: Math.sin(T * 14) * .05 } }); cara(opa, T, L.lt > 1.4 ? { eyes: 'squint', mouth: 'grin' } : { expr: 'happy', mouth: 'smile' });
  badge3('gold', '🔑', hp(opa).add(V(1.8, 1.8, 0)), (L.lt - 1.4) * 2.5, 1);
  onFace(opa, 9, .3, .8, 40, L.k, 7.5); sh(V(0, 0, 0), 16); }, [[0, 'keys', .8], [1.4, 'keys', .9], [1.5, 'sparkle', .5]]);
// ---------- 124 · «Lea fragte mich, ob ich ihr beibringe, Strichmännchen zu malen.» ----------
shot(234.37, 'S', null, L => { const T = L.T; town('morning');
  put(lea, -1.6, 0, 0, .5); actuar(lea, L.lt, [[0, { aLx: .7, aLe: 1.2, aRx: .7, aRe: 1.2, headZ: .15 }], [1.4, drawP(T, 9)]], { T }); chalkIn(lea, CHALK2); talk(lea, T, L.t0, L.t1, 'happy');
  put(emil, 1.8, 0, .2, -.5); actuar(emil, L.lt, [[0, 'idle'], [.9, drawP(T, 9)]], { T }); chalkIn(emil); cara(emil, T, { eyes: 'happy', mouth: 'open_smile' });
  DC.sticks.forEach((d, i) => { if (i < 2) dec(d, -1.2 + i * 2.6, 3.2, 0, clamp(L.lt - 1.6 - i * .4)); }); if (L.lt > 2.2) STK.update(T, [[.2, 0, 3.6, 0, .5]], 'dance');
  orb(L.k, V(.2, 2.5, 1), null, [16, -.15, .25, 46], [14, .1, .28, 46]); sh(V(0, 0, 0), 16); }, [[0, 'kids_laugh', .4], [1.4, 'chalk', .8], [2.2, 'pop', .6]]);
const nightDark = () => { hemi.intensity = .5; sun.intensity = .45; renderer.toneMappingExposure = .92; FILL.intensity = 45; FILL.color.setRGB(1, .85, .6); bloom.strength = .5; bloom.threshold = .7; };
// ---------- 125 · «Und noch in derselben Nacht hat die ganze Stadt» : de noche, todos con tizas y linternas ----------
const NIGHT_STK = (n, T, mode = 'dance', y0 = 0) => { const L_ = []; for (let i = 0; i < n; i++) { const r = RNG(i * 7 + 3); L_.push([-40 + r() * 80, y0, -50 + r() * 90, (r() - .5) * 1.4, .8 + r() * .5]); } STK.update(T, L_, mode); };
shot(237.42, 'F', null, L => { const T = L.T; town('night'); nightDark();
  bg(L, [[XT[0], -6, 2, .3, 'draw', .1], [XT[1], 5, 0, -.2, 'draw', .4], [K[0], -1, 5, 0, 'draw', .2], [K[4], 9, 6, -.4, 'draw', .5], [XT[6], -10, -4, .5, 'draw', .3], [lea, 2, -5, .1, 'draw', .6], [emil, -3, -9, .2, 'draw', .8]]);
  DC.sticks.forEach((d, i) => dec(d, -12 + i * 3.4, -2 + (i % 3) * 4, (i - 4) * .2)); crowdAt(T, grid(-40, -50, 40, -20, 60, 20, 0), 'sway');
  orb(L.k, V(0, 3, 0), null, [26, -.2, .3, 48], [23, .15, .28, 48]); sh(V(0, 0, 0), 30); }, [[0, 'crickets', .6], [.2, 'chalk', .7], [.9, 'chalk', .6], [1.6, 'chalk', .5]]);
// ---------- 126 · «den Marktplatz mit Strichmännchen vollgemalt.» : vista aérea: la plaza llena de monigotes que se levantan ----------
shot(239.74, 'Z', null, L => { const T = L.T; town('night'); nightDark(); NIGHT_STK(Math.floor(15 + L.k * 45), T, 'wave'); DC.sticks.forEach((d, i) => dec(d, -20 + i * 6, 10 - (i % 3) * 12, i * .4));
  crowdAt(T, grid(-50, -60, 40, -30, 70, 21, 0), 'cheer');
  orbit(V(0, 0, -6), 80 - L.k * 12, .1 + L.k * .2, .75, 50); sh(V(0, 0, -6), 60); }, [[0, 'pop', .5], [.4, 'pop', .4], [.8, 'pop', .5], [1.2, 'sparkle', .5], [1.8, 'cheer', .5]]);
// ---------- 127 · «Hunderte – und alle haben getanzt.» : fiesta nocturna de monigotes bailando ----------
shot(242.18, 'W', null, L => { const T = L.T; town('night'); nightDark(); bloom.strength = .45; NIGHT_STK(60, T, 'dance'); confetti(V(0, 6, -10), L.t0, T, 40, 1.4);
  bg(L, [[emil, -2, 8, .1, 'cheer'], [lea, 2, 7.5, -.1, 'cheer', .3]]); show(KRU, 0, 0, 10, 0, .8); KRU.userData.anim(T, 1); KRU.position.y = Math.abs(Math.sin(T * 7)) * .8;
  badge('big', 'HUNDERTE!', W / 2, H * .17, (L.lt - .05) * 2.5, 1, 1);
  orb(L.k, V(0, 4, 4), null, [26, -.15, .15, 48], [23, .15, .15, 48]); sh(V(0, 0, 0), 40); }, [[0, 'party_horn', .6], [.3, 'cheer', .8], [.8, 'kids_laugh', .6], [1.4, 'clap', .6]]);
// ---------- 128 · «Manchmal schaut mich der alte Mann an,» : en el jardín, el anciano mira a Emil pensativo (zoom lento) ----------
shot(244.42, 'F', 'slow', L => { use('GT'); sunset(); const T = L.T; put(opa, GTX - 2.4, 0, 2, .7); keysOn(); actuar(opa, L.lt, [[0, { aLx: .3, aRx: .3, headZ: .15, headX: .1 }]], { T }); cara(opa, T, { expr: 'neutral', mouth: 'smile' });
  put(emil, GTX + 2.6, 0, 3.4, -1.0); applyPose(emil, KNEEL); chalkIn(emil); cara(emil, T, { expr: 'happy', mouth: 'smile' }); show(KRU, GTX + 5.5, 0, 4.6, -.6, .8); KRU.userData.anim(T, 0);
  orb(L.k, V(GTX - .4, 3.6, 2.4), null, [18, .45, .1, 44], [12, .35, .08, 40], easeIn); sh(V(GTX, 0, 2), 20); }, [[0, 'birds', .5], [.6, 'tension_str', .4], [1.2, 'wind', .3]]);
// ---------- 129 · «als würde er warten, dass ich mich an etwas erinnere.» : Emil le devuelve la mirada; parpadeo de glitch ----------
shot(246.16, 'C', null, L => { use('GT'); sunset(); const T = L.T; put(emil, GTX + 3, 0, 3.6, -1.0); actuar(emil, L.lt, [[0, { headY: -.2 }]], { T }); cara(emil, T, { expr: 'confused', mouth: 'flat' }); put(opa, GTX - 2.4, 0, 2, .7); keysOn(); cara(opa, T, { expr: 'happy', mouth: 'smile' });
  if (L.lt > 1.6 && L.lt < 2.0) { GL = .5; grade.uniforms.sepia.value = .7; }
  onFace(emil, 9, .3, -.6, 40, L.k, 7); sh(V(GTX, 0, 3), 20); }, [[0, 'heartbeat', .5], [1.6, 'glitch', .6], [1.7, 'keys', .3]]);
// ---------- 130 · «Er wohnt jetzt in unserem Gartenhäuschen.» : el anciano saluda desde la puerta de la caseta ----------
shot(248.71, 'W', null, L => { use('GT'); day(); const T = L.T; GT.door.rotation.y = -1.2; put(opa, GTX + 0, 0, -3.6, .1); keysOn(); actuar(opa, L.lt, [[0, 'wave']], { T }); grin(opa, T);
  put(emil, GTX + 6, 0, 4, -.4); actuar(emil, L.lt, [[0, 'wave']], { T }); grin(emil, T); show(KRU, GTX + 3, 0, 5, -.2, .8); KRU.userData.anim(T, 1);
  orb(L.k, V(GTX + 2, 5, -2), null, [32, .25, .1, 46], [28, .15, .1, 46]); sh(V(GTX, 0, -4), 30); }, [[0, 'door_creak', .6], [.4, 'birds', .5], [1.0, 'laugh_old', .5]]);
// ---------- 131 · «Und seitdem findet bei uns keiner mehr seinen Schlüssel.» : las llaves de Papá salen volando hacia la caseta ----------
shot(250.52, 'S', null, L => { use('GT'); day(); const T = L.T; GT.door.rotation.y = -1.2;
  put(XT[6], GTX + 9, 0, 7, -1.0); actuar(XT[6], L.lt, [[0, { aLx: .4, aRx: .4, aLz: .3, aRz: .3, headX: .4 }], [.9, 'shock']], { T }); cara(XT[6], T, L.lt > .9 ? { expr: 'shock', mouth: 'o' } : { expr: 'confused', mouth: 'flat' });
  put(XT[5], GTX + 12.5, 0, 5, -1.3); actuar(XT[5], L.lt, [[0, 'shrug']], { T }); cara(XT[5], T, { expr: 'confused', mouth: 'frown' });
  keysFly(V(GTX, 4, -4), L.t0 + .9, T, 6, [loc(XT[6], .6, 2.5, .8), loc(XT[5], .6, 2.5, .8)]);
  put(opa, GTX + 0, 0, -3.6, .6); keysOn(); laughF(opa, T);
  orb(L.k, V(GTX + 5.5, 4, 2), null, [28, .3, .1, 48], [25, .2, .1, 48]); sh(V(GTX + 6, 0, 0), 30); }, [[0, 'rummage', .7], [.9, 'keys', .9], [1.0, 'whoosh_up', .5], [1.6, 'laugh_old', .6], [2.2, 'keys', .5]]);
// ---------- 132 · «Wenn dir das gefallen hat, folg mir für mehr.» : los tres saludan; al final, un fallo de imagen fugaz ----------
shot(253.22, 'F', null, L => { use('GT'); day(); const T = L.T;
  put(emil, GTX, 0, 4, 0); actuar(emil, L.lt, [[0, 'wave']], { T }); talk(emil, T, L.t0, L.t1, 'happy', { eyes: 'happy' }); put(opa, GTX - 3.6, 0, 2.6, .3); keysOn(); actuar(opa, L.lt, [[0, 'wave']], { T }); grin(opa, T);
  show(KRU, GTX + 3, 0, 5, -.3, .8); KRU.userData.anim(T, 1); KRU.position.y = Math.abs(Math.sin(T * 6)) * .6;
  badge('tag', 'FOLGEN ✚', W / 2, H * .17, (L.lt - .6) * 2.5, 1, 1.2);
  if (L.lt > L.d - .3) GL = (L.lt - (L.d - .3)) / .3;
  orb(L.k, V(GTX - .6, 3.2, 3.4), null, [16, 0, .1, 44], [14, .05, .1, 44]); sh(V(GTX, 0, 3), 20); }, [[0, 'pop', .6], [.6, 'notif', .7], [1.0, 'bark', .5], [2.1, 'glitch', .6]]);
