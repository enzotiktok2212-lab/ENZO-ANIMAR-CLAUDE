// prueba
shot(0, 'C', 'slow', L => { town(L); const row = [EX[0], TR[1], EX[2], TR[3], EX[4]]; row.forEach((c, i) => { put(c, -8 + i * 4, 0, 34, 0); drink(c, L, .1 + i * .05, 1.0, { meter: true, bg: i !== 2 }); });
  tableFolk(L, 2, -1, 3); tableFolk(L, 3, 1, 3, 'sitprost', 3); billFall(V(0, 0, 34), L.t0 + .8, L.T, 50, 22, 8, 14);
  cm([0, 6, 70, 0, 5, 30, 44], [0, 6, 56, 0, 5.4, 30, 42], L.k); sh(V(0, 0, 30), 30); });
shot(1.5, 'W', null, L => { town(L); const c = put(huber, 0, 0, 30, 0); drink(c, L, L.t0, 1.0, { meter: true }); onFace(c, 8, 0, -1.2, 40, L.k, 7); sh(V(0, 0, 30), 16); });
shot(3, 'F', null, L => { zelt(L); crowdAt(L, BZX, -10, 14, 4, 20, 3, { mode: i => ['drink', 'prost', 'talk'][i % 3] }); orbit(V(BZX, 6, -6), 40, 0, .2, 50); sh(V(BZX, 0, -10), 40); });
shot(4.5, 'S', null, L => { kellerS(L); FLASHL.intensity = 900; FLASHL.position.set(KEX, 8, 6); FLASHL.target.position.set(KEX, 5.4, -18); cm([KEX, 7, 4], [KEX, 6.6, -4], L.k); camera.lookAt(KEX, 5.8, -18.5); camera.fov = 44; sh(V(KEX, 0, -10), 20); });
shot(6, 'R', null, L => { klosterS(L); cm([KLX, 14, 60], [KLX, 16, 50], L.k); camera.lookAt(KLX, 18, -30); camera.fov = 50; sh(V(KLX, 0, -20), 50); });
shot(7.5, 'I', null, L => { bueroS(L); cm([BUX, 9, 14], [BUX + 3, 9, 11], L.k); camera.lookAt(BUX, 5, -8); camera.fov = 50; sh(V(BUX, 0, 0), 26); });
shot(9, 'Z', null, L => { sudS(L); const m = put(moench, SUX, 0, 4, 0); talk(m, L.T, 0, 1, 'happy'); cm([SUX, 9, 30], [SUX, 9, 26], L.k); camera.lookAt(SUX, 8, -6); camera.fov = 50; sh(V(SUX, 0, 0), 26); });
shot(10.5, 'W', null, L => { seeS(L); const c = put(huber, SVX - 6, 0, 0, 0); attach(KEYS, c.aR.hand, [0, -.8, .3]); actuar(c, 0, [[0, { aRx: 2.4, aRz: .3 }]], { T: L.T }); grin(c, L.T); cm([SVX - 4, 8, 40], [SVX - 4, 8, 34], L.k); camera.lookAt(SVX - 2, 10, -20); camera.fov = 50; sh(V(SVX, 0, -10), 50); });
shot(12, 'W', null, L => { amtS(L); const c = put(kranzl, AMX, 0, -9.5, 0); talk(c, L.T, 0, 1, 'smug'); cm([AMX, 8, 10], [AMX, 8, 7], L.k); camera.lookAt(AMX, 6.5, -8); camera.fov = 46; sh(V(AMX, 0, -6), 20); });
shot(13.5, 'W', null, L => { altS(L); cm([ABX, 8, 30], [ABX, 8, 24], L.k); camera.lookAt(ABX, 10, -20); camera.fov = 50; sh(V(ABX, 0, -20), 40); });
shot(15, 'W', null, L => { minS(L); MI.scr.userData.draw((c, w, h) => { c.fillStyle = '#1a2a4a'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `700 80px ${FONT}`; c.textAlign = 'center'; c.fillText('TEST', w / 2, h / 2); }); BEA.forEach((b, i) => { put(b, MIX - 8 + i * 8, 0, -6, 0); talk(b, L.T, 0, 1); }); cm([MIX, 10, 26], [MIX, 10, 22], L.k); camera.lookAt(MIX, 9, -10); camera.fov = 50; sh(V(MIX, 0, -6), 30); });
shot(16.5, 'W', null, L => { regalS(L, 900); cm([RGX, 8, 12], [RGX, 8, 6], L.k); camera.lookAt(RGX, 6, -16); camera.fov = 46; sh(V(RGX, 0, -8), 26); });
