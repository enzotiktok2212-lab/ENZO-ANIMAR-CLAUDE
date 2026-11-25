// ---------- c: la noche en la torre, el polvo, la Liga der Größe, borra a los criminales (63,3 – 101,1 s) ----------
// sala de la Liga de noche: el capitán junto al ventanal, los cuatro frente a él (lado +z de la mesa)
const tower = () => { use('TR'); inside(.8, 30); TR.T.position.set(0, 0, -12); };
const HX = [TRX - 9, TRX - 3, TRX + 3, TRX + 9];   // posiciones de los cuatro (z = 12)
const ichT = (L, ry = PI, ex = {}) => { const c = put(ich, TRX, 0, 13, ry); actuar(c, L.lt, [[0, ex.pose || 'cross']], { T: L.T }); return c; };
const heroesT = (L, poses = [], exprs = []) => LIGA.map((h, i) => { put(h, HX[i], 0, 4 - Math.abs(i - 1.5) * .8, faceTo(V(HX[i], 0, 4), V(TRX, 0, 13))); actuar(h, L.lt + i * .2, [[0, poses[i] || 'idle']], { T: L.T + i }); cara(h, L.T + i, { expr: exprs[i] || 'angry', mouth: 'frown' }); return h; });

// 39 «In der Nacht nannte mich Zack einen Feigling.»: Zack le señala, a gritos; bocadillo «FEIGLING!»
shot(tw('In', 3), 'I', null, L => { tower(); heroesT(L, ['cross', 'point', 'cross', 'idle'], ['angry', 'shout', 'angry', 'sad']); talk(zack, L.T, tw('nannte'), L.t1, 'shout'); ichT(L);
  bubble(zack, 'FEIGLING!', (L.lt - .9) * 3); onFace(zack, 9, -.5, .25, 42); sh(V(TRX, 0, 8), 30); }, [[0, 'night_ambience', .5], [.5, 'shout', .5], [1.3, 'impact', .4]]);
// 40 «Stahlpranke wollte meinen Umhang zurück.»: Stahlpranke tira de la capa del capitán con su puño de acero
shot(tw('Stahlpranke', 3), 'S', null, L => { tower(); const c = ichT(L, PI * .8); cara(c, L.T, { expr: 'bored', mouth: 'flat' }); const s = put(stahl, TRX - 3, 0, 10, faceTo(V(TRX - 3, 0, 10), V(TRX, 0, 13))); actuar(s, L.lt, [[0, 'idle'], [.3, { aRx: 1.4, aRe: .3, lean: -.2, aLz: .3 }, { dur: .3 }]], { T: L.T }); cara(s, L.T, { expr: 'angry', mouth: 'grimace' });
  c.props.wind = 1.6; ich.props.cape.rotation.y = -.4 * clamp((L.lt - .3) * 3); badge('tag', 'UMHANG ZURÜCK!', W / 2, H * .2, (L.lt - .5) * 3);
  orbit(V(TRX - 1.5, 4.4, 11.5), lerp(13, 11, L.k), -1.2, .12, 44); sh(V(TRX, 0, 11), 20); }, [[0, 'whoosh', .4], [.4, 'cloth_tug', .7], [.9, 'grunt', .4]]);
// 41 «Und Herr Alleskann, der Netteste von allen,»: Herr Alleskann, triste y amable, se quita las gafas
shot(tw('Und', 6), 'W', null, L => { tower(); heroesT(L, ['cross', 'cross', 'cross', 'idle'], ['angry', 'angry', 'angry', 'sad']); const a = alles; actuar(a, L.lt, [[0, 'idle'], [.4, { aRx: 2.0, aRe: 2.0, aRz: -.3, headX: .2 }, { dur: .5 }]], { T: L.T }); cara(a, L.T, { expr: 'sad', mouth: 'frown' });
  badge('green', 'DER NETTESTE', W / 2, H * .2, (L.lt - 1.2) * 3); onFace(a, 8, -.4, -.2 + L.k * .3, 40, L.k, 7); sh(V(HX[3], 0, 4), 20); }, [[0, 'whoosh', .4], [.6, 'soft_piano', .5]]);
// 42 «sagte ganz leise:» (zoom lento): primer plano: se acerca y habla muy bajo; todo se oscurece
shot(tw('sagte', 1), 'Z', 'slow', L => { tower(); heroesT(L, ['cross', 'cross', 'cross', 'idle'], ['angry', 'angry', 'angry', 'sad']); talk(alles, L.T, L.t0, L.t1 + 3, 'sad');
  DARK = .2 * L.k; onFace(alles, 6, -.4, .1, 40, L.k, 4.6); sh(V(HX[3], 0, 4), 20); }, [[0, 'whisper', .4], [.4, 'heartbeat', .4]]);
// 43 «„Heute wurden Menschen verletzt,»: recuerdo de la avenida rota: un hospital de campaña, gente con vendas y muletas
shot(tw('Heute', 1), 'F', null, L => { city('dusk'); smoke(V(DT0 - 6, 0, GZ + 10), L.T, 3); for (let i = 0; i < 5; i++) { const c = BG[i]; put(c, DT0 - 6 + i * 3, 0, GZ + 40 - (i % 2) * 2, PI * .1 + (i - 2) * .2); actuar(c, L.lt, [[0, i % 2 ? 'hug_self' : 'slump']], { T: L.T + i }); cara(c, L.T + i, { expr: 'sad', mouth: 'frown' }); }
  POST.push(() => BG.slice(0, 5).forEach((c, i) => { const h = hp(c); })); TINT = 'rgba(255,60,40,.08)';
  badge('red', 'VERLETZT', W / 2, H * .2, (L.lt - .4) * 3); cm([DT0, 5, GZ + 54, DT0, 3.5, GZ + 38, 46], [DT0 + 2, 5, GZ + 52, DT0, 3.5, GZ + 38, 44], L.k); sh(V(DT0, 0, GZ + 40), 30); }, [[0, 'siren', .5], [.3, 'cough', .4], [.9, 'crying', .3]]);
// 44 «nur weil dir langweilig war.“»: el capitán bosteza mientras Herr Alleskann se lo dice
shot(tw('nur', 4), 'C', null, L => { tower(); const c = ichT(L, PI * .9, { pose: 'cross' }); cara(c, L.T, { expr: 'bored', eyes: 'half', mouth: L.lt > .3 ? 'yawn' : 'flat' }); put(alles, TRX + 3.5, 0, 9, faceTo(V(TRX + 3.5, 0, 9), V(TRX, 0, 13))); actuar(alles, L.lt, [[0, { aRx: 1.2, aRe: .6 }]], { T: L.T }); talk(alles, L.T, L.t0, L.t1, 'sad');
  badge('tag', 'LANGWEILIG', W / 2, H * .2, (L.lt - .5) * 3); cm([TRX - 8, 6.5, 4, TRX + 1.5, 5, 11.5, 48], [TRX - 7, 6.5, 5, TRX + 1.5, 5, 11.5, 46], L.k); sh(V(TRX, 0, 11), 20); }, [[0, 'whoosh', .3], [.4, 'yawn', .6]]);
// 45 «Da wurde mir etwas klar:» (zoom lento): primerísimo plano de sus ojos; se le ilumina una idea; viñeta
shot(tw('Da'), 'C', 'slow', L => { tower(); const c = ichT(L, PI); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' }); purple(L, L.k);
  onFace(c, 5, -.1, 0, 36, L.k, 3.2); sh(V(TRX, 0, 13), 20); }, [[0, 'tension', .5], [.6, 'heartbeat', .5]]);
// 46 «Keiner von ihnen konnte mich aufhalten.»: contrapicado desde detrás del capitán: los cuatro pequeños y él enorme, con aura violeta
shot(tw('Keiner'), 'W', null, L => { tower(); const c = ichT(L, PI); heroesT(L, ['brace', 'brace', 'fists', 'idle'], ['worried', 'worried', 'angry', 'sad']); purple(L, .8);
  cm([TRX + 2, 2, 19, TRX, 6, 2, 60], [TRX + 1.5, 2.2, 18.5, TRX, 6.5, 2, 58], L.k); sh(V(TRX, 0, 8), 30); }, [[0, 'power_up', .6], [.5, 'rumble', .4]]);
// 47 «Sie hofften nur, dass ich es nie merke.»: los cuatro se miran entre ellos, sudando
shot(tw('Sie', 1), 'S', null, L => { tower(); heroesT(L, ['hug_self', 'cower', 'brace', 'idle'], ['worried', 'worried', 'worried', 'sad']); LIGA.forEach((h, i) => { h.root.rotation.y += Math.sin(L.T * 2 + i) * .4; sweat(h, L.T); });
  cm([TRX + 3, 6, 18, TRX, 4.6, 3, 52], [TRX - 3, 6, 18, TRX, 4.6, 3, 52], L.k); sh(V(TRX, 0, 4), 30); }, [[0, 'whoosh', .3], [.4, 'gulp', .5], [1.0, 'whisper', .4]]);
// 48 «Dann griff Herr Alleskann nach meiner Schulter.» (zoom lento): la mano amable se posa en su hombro
shot(tw('Dann', 2), 'C', 'slow', L => { tower(); const c = ichT(L, PI * .95); cara(c, L.T, { expr: 'angry', mouth: 'flat' }); const a = put(alles, TRX + 2.2, 0, 10.5, faceTo(V(TRX + 2.2, 0, 10.5), V(TRX, 0, 13)) - .3);
  actuar(a, L.lt, [[0, 'idle'], [.2, { aLx: 1.5, aLe: .3, aLz: -.4, lean: .1 }, { dur: .8 }]], { T: L.T }); cara(a, L.T, { expr: 'sad', mouth: 'smile' });
  cm([TRX + 5, 7, 19, TRX + 1, 5.6, 12, 46], [TRX + 3.5, 6.6, 18, TRX + 1, 5.6, 12, 42], L.k); sh(V(TRX, 0, 12), 20); }, [[0, 'tension', .4], [.9, 'cloth', .4]]);
// 49 «Ich weiß nicht mehr, ob ich es entschieden habe.»: cierra los ojos; destello violeta; la sala tiembla
shot(tw('Ich', 4), 'F', null, L => { tower(); const c = ichT(L, PI); cara(c, L.T, { eyes: 'closed', mouth: 'flat' }); purple(L, 1.8); SHAKE = .5; grade.uniforms.flash.value = Math.max(0, .7 - L.lt * .8);
  onFace(c, 6, -.2, .15, 40, L.k, 5); sh(V(TRX, 0, 13), 20); }, [[0, 'whoosh_big', .6], [.1, 'poof', .9], [.3, 'poof', .8], [.5, 'poof', .8], [.7, 'poof', .8]]);
// 50 «Ich erinnere mich nur an die Stille.»: la sala vacía; las sillas giran solas; silencio
shot(tw('Ich', 5), 'I', null, L => { tower(); TR.CHAIRS.forEach((c, i) => c.rotation.y = (PI + (i - 2) * .5 + PI) + Math.sin(L.T * .8 + i) * .2); DARK = .15;
  cm([TRX + 12, 12, 26, TRX, 3, 0, 52], [TRX + 8, 11, 24, TRX, 3, 0, 50], L.k); sh(V(TRX, 0, 4), 30); }, [[0, 'silence_hit', .6], [.6, 'chair_creak', .4]]);
// 51 «Vier Umhänge auf dem Boden.»: cenital: cuatro capas de colores en el suelo; «4»
shot(tw('Vier', 1), 'C', 'punch', L => { tower(); capesFloor(V(TRX + 1, 0, 4), L.T); badge('num', '4', W / 2, H * .18, (L.lt - .2) * 3, 1, 1.3);
  cm([TRX + 1, 18, 14, TRX + 1, 0, 4.5, 50], [TRX + 1, 16, 13, TRX + 1, 0, 4.5, 48], L.k); sh(V(TRX, 0, 4), 20); }, [[0, 'impact', .5], [.3, 'cloth', .4]]);
// 52 «Vier kleine Haufen Staub.» (zoom lento): cuatro montoncitos; sobre uno, las gafas redondas de Herr Alleskann
shot(tw('Vier', 2), 'S', 'slow', L => { tower(); capesFloor(V(TRX + 1, 0, 4), L.T); for (let i = 0; i < 4; i++) show(PILES[i], TRX - 2.3 + i * 2.2, 0, 4 + (i % 2) * 1.8 - .9, 0, .55);
  cm([TRX + 1, 5, 19, TRX + 1, 1, 5, 50], [TRX + 1, 3.6, 15, TRX + 1, .8, 5, 46], L.k); sh(V(TRX, 0, 5), 20); }, [[0, 'sand', .6], [.8, 'wind', .3]]);
// 53 «Am nächsten Morgen sagte ich der Stadt:»: rueda de prensa al amanecer delante del Rathaus; micrófonos y mucha gente
shot(tw('Am'), 'W', null, L => { town('morning'); const c = put(ich, -6, 0, -66, 0); actuar(c, L.lt, [[0, { aLx: .4, aRx: 1.2, aRe: .8, aLz: .2 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'smug'); show(MICS, -6, -1.4, -63, 0);
  crowdGrid(-6, -48, 10, 6, 3, PI, 0, 0); stands(L.T, 'still', false); cm([-6, 12, -18, -6, 5, -66, 50], [-6, 11, -26, -6, 5, -66, 46], L.k); sh(V(-6, 0, -50), 50); }, [[0, 'camera_shutter', .5], [.3, 'crowd_murmur', .5], [.9, 'camera_shutter', .4]]);
// 54 «Die Liga war nicht gut genug.»: primer plano al micrófono; en la pantalla de la plaza: «LIGA: NICHT GUT GENUG»
shot(tw('Die', 1), 'C', null, L => { town('morning'); const c = put(ich, -6, 0, -66, 0); actuar(c, L.lt, [[0, { aLx: .4, aRx: 1.2, aRe: .8, aLz: .2 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'angry'); show(MICS, -6, -1.4, -63, 0);
  badge('red', 'NICHT GUT GENUG', W / 2, H * .18, (L.lt - .4) * 3); onFace(c, 9, .2, .3, 42); sh(V(-6, 0, -66), 20); }, [[0, 'whoosh', .4], [.4, 'crowd_gasp', .5]]);
// 55 «Aber ich schon.»: sonrisa, pulgar al pecho
shot(tw('Aber', 2), 'C', 'punch', L => { town('morning'); const c = put(ich, -6, 0, -66, 0); actuar(c, L.lt, [[0, { aRx: 1.6, aRz: -.6, aRe: 2.3, aLz: .2 }]], { T: L.T }); grin(c, L.T); show(MICS, -6, -1.4, -63, 0);
  onFace(c, 6.5, -.1, -.3, 40); sh(V(-6, 0, -66), 20); }, [[0, 'impact', .5], [.3, 'ding', .5]]);
// 56 «Also gründete ich ein neues Team:»: cae la tela y aparece la gran pancarta del Rathaus
shot(tw('Also', 1), 'W', null, L => { town('morning'); const k = clamp(L.lt / .9); show(LBAN, -6, 31 + (1 - easeOut(k)) * 0, -82.6, 0, .55); LBAN.scale.y = .55 * easeOut(k); const c = put(ich, -6, 0, -66, PI); actuar(c, L.lt, [[0, 'point']], { T: L.T });
  crowdGrid(-6, -40, 10, 7, 3, PI, 0, 0); stands(L.T, 'still', false); cm([-6, 8, -30, -6, 22, -80, 54], [-6, 10, -36, -6, 26, -80, 50], L.k); sh(V(-6, 0, -60), 50); }, [[0, 'cloth', .6], [.5, 'fanfare', .6]]);
// 57 «die Liga der Größe.»: la pancarta de cerca con confeti
shot(tw('die', 8), 'Z', null, L => { town('morning'); show(LBAN, -6, 31, -82.6, 0, .55); confRain(V(-6, 20, -80), L.T, 60, 24, 10, 16);
  cm([-6, 26, -50, -6, 31, -82, 46], [-6, 28, -56, -6, 31, -82, 44], L.k); sh(V(-6, 0, -80), 50); }, [[0, 'confetti', .6], [.3, 'cheer', .5]]);
// 58 «Und um es zu beweisen, schloss ich die Augen»: en el balcón, cierra los ojos y flota; el aura violeta crece
shot(tw('Und', 7), 'R', null, L => { town('morning'); const c = hover(ich, -6, 18 + L.lt * .8, -76, 0, L.T, { pose: { aLz: .8, aRz: .8, aLe: .2, aRe: .2 } }); cara(c, L.T, { eyes: L.lt > 1 ? 'closed' : 'normal', mouth: 'flat' }); purple(L, clamp(L.lt / 2));
  onFace(c, 10, -.4, .15, 44, L.k, 8); sh(V(-6, 0, -76), 30); }, [[0, 'riser_short', .5], [1.0, 'power_up', .6]]);
// 59 «und dachte an jeden Verbrecher.»: la pantalla gigante de la plaza llena de fichas de criminales
shot(tw('und', 3), 'F', null, L => { town('morning'); BIGTV.visible = true; tvDraw(BIGTV.userData.scr, 'wanted', (c, w, h) => { c.fillStyle = '#1a1a22'; c.fillRect(0, 0, w, h); for (let i = 0; i < 18; i++) { const x = 20 + (i % 6) * 90, y = 20 + Math.floor(i / 6) * 100; c.fillStyle = '#f4e8c8'; c.fillRect(x, y, 80, 92); c.fillStyle = ['#e8b08a', '#c88a5a', '#f2c8a8'][i % 3]; c.fillRect(x + 22, y + 14, 36, 36); c.fillStyle = '#1a1a1a'; c.fillRect(x + 22, y + 10, 36, 10); c.fillRect(x + 30, y + 28, 5, 5); c.fillRect(x + 45, y + 28, 5, 5); txt2(c, 'GESUCHT', x + 40, y + 74, 14, '#d8323a'); } });
  cm([-6, 18, -30, -6, 22, -70, 50], [-6, 20, -38, -6, 22, -70, 46], L.k); sh(V(-6, 0, -60), 50); }, [[0, 'static', .4], [.3, 'beep', .5], [.9, 'tension', .4]]);
// 60 «Jeden Dieb.»: un ladrón con antifaz sale de una tienda con una bolsa… puf
shot(tw('Jeden', 1), 'C', null, L => { town(); const d = put(dieb, 30, 0, -30, -PI / 2); applyPose(d, runPoseL(L.T * 1.6)); d.root.position.x -= L.lt * 3; cara(d, L.T, { expr: 'shock', mouth: 'grin' }); poof(d, L.t0 + .45, L.T, 0);
  orbit(V(28, 3.4, -30), 11, -PI / 2 + .6, .1, 44); sh(V(28, 0, -30), 20); }, [[0, 'whoosh', .4], [.45, 'poof', .9]]);
// 61 «Jeden Schläger.»: en un callejón, un matón agarra a un chaval por la sudadera… puf; el chaval se queda boquiabierto
shot(tw('Jeden', 2), 'W', null, L => { town(); const b = put(K[3], -40, 0, 30, PI / 2), v = put(K[6], -36.6, 0, 30, -PI / 2); v.root.scale.setScalar(.8); actuar(b, L.lt, [[0, { aRx: 1.5, aRe: .4, lean: .15, aLx: .9, aLe: 2 }]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'grimace' });
  actuar(v, L.lt, [[0, 'cower'], [.6, 'shock', { dur: .3 }]], { T: L.T }); cara(v, L.T, { expr: 'shock', mouth: L.lt > .5 ? 'o' : 'frown' }); poof(b, L.t0 + .45, L.T, 1);
  orbit(V(-38.3, 3.4, 30), 11, .2, .1, 44); sh(V(-38, 0, 30), 20); }, [[0, 'punch_air', .4], [.45, 'poof', .9], [.8, 'gasp', .4]]);
// 62 «Jeden, der je ein Fahrrad geklaut hat.»: un tipo huye en una bici robada… puf: la bici sigue rodando sola
shot(tw('Jeden', 3), 'S', null, L => { town(); const z = 40 - L.lt * 9; const d = put(K[0], 26, .9, z, PI); applyPose(d, { ...SIT, crouch: .3, lLx: 1.2 + Math.sin(L.T * 9) * .4, lRx: 1.2 - Math.sin(L.T * 9) * .4, lLk: 1.2, lRk: 1.2, aLx: 1.3, aRx: 1.3, aLe: .4, aRe: .4, lean: .3 }); cara(d, L.T, { expr: 'smug', mouth: 'grin' });
  show(BIKE, 26, 0, z, 0, 1.4); const gone = poof(d, tw('geklaut') - .1, L.T, 2, .8); if (gone) { BIKE.rotation.z = Math.min(.6, (L.T - tw('geklaut')) * .6); }
  orbit(V(26, 3, z), 14, -.9, .12, 44); sh(V(26, 0, z), 20); }, [[0, 'bike_bell', .5], [.3, 'bike', .5], [tw('geklaut') - tw('Jeden', 3) - .1, 'poof', .9], [1.3, 'bike_crash', .5]]);
