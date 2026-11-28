// ---------- portadas (fuera del vídeo; python3 armar_cover.py && node cover.mjs) ----------
// Con circulito rojo ajustado al protagonista (pedido por el usuario para esta pieza).
// 1 «jacuzzi»: yo en el jacuzzi de oro con lluvia de monedas; Genau, Krass y Digga alrededor señalándome y gritando HUSS.
// 2 «marcador»: la NAMENSBANK con HUSS el 1.º (1.000.000 €); yo delante sobre una montaña de monedas, la gente señalándome.
function coverWord(c, t, x, y, size, font, fill, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, (o.maxW || W * .9) / tw); c.scale(k, k);
  c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 28; c.shadowOffsetY = 12; c.lineWidth = o.lw || 20; c.strokeStyle = o.stroke || '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size * .8, 0, 0); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
// círculo rojo a mano alzada (dos trazos ligeramente desfasados) alrededor de (x, y)
function redCircle(c, x, y, rx, ry) { c.save(); c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 16; c.shadowOffsetY = 6;
  for (const [lw, col, d] of [[30, '#ffffff', 0], [20, '#ff1a1a', 0]]) { c.lineWidth = lw; c.strokeStyle = col; c.beginPath();
    for (let i = 0; i <= 120; i++) { const a = -1.9 + i / 120 * (6.283 + .5), w = 1 + Math.sin(a * 3 + 1) * .03 + (i > 100 ? (i - 100) * .004 : 0); const px = x + Math.cos(a) * rx * w, py = y + Math.sin(a) * ry * w; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
  c.restore(); }
function coverShot(build) { COVER = { cam() {} }; const s = { t0: 50, t1: 51, tr: null, zoom: null, fn: build, sfx: [] }; S.push(s); FX2D.length = 0; renderShot(S.length - 1, 50.5, null, 0); S.pop(); COVER = null;
  grade.uniforms.sat.value = 1.45; octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H); octx.restore(); for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); }
let POOLDONE = false;
function poolDetail() { if (POOLDONE) return; POOLDONE = true; const WP = VI.WP, R = 7;
  const caus = canvasTex(512, 512, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2); g.addColorStop(0, '#4fe0e8'); g.addColorStop(.7, '#18b4cc'); g.addColorStop(1, '#0a7a9a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    const r = RNG(31); c.lineWidth = 3; for (let i = 0; i < 260; i++) { c.strokeStyle = `rgba(220,255,255,${.12 + r() * .3})`; const x = r() * w, y = r() * h, s = 10 + r() * 26; c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + s, y - s * .6, x + s * 1.6, y + s * .4, x + s * 2.2, y); c.stroke(); } });
  const water = WP.userData.water; water.material = new THREE.MeshBasicMaterial({ map: caus, color: 0xd8ffff }); water.position.y = 2.66;
  const mos = canvasTex(1024, 128, (c, w, h) => { c.fillStyle = '#f4f0e8'; c.fillRect(0, 0, w, h); const cols = ['#1a6aa8', '#2a9ac8', '#f4f0e8', '#0a4a7a', '#d8b040'];
    for (let y = 0; y < 4; y++) for (let x = 0; x < 64; x++) { c.fillStyle = (x + y) % 4 === 0 ? '#d8b040' : cols[(x * 7 + y * 3) % 4]; c.fillRect(x * 16 + 1, 34 + y * 16 + 1, 14, 14); } c.fillStyle = '#c89a20'; c.fillRect(0, 0, w, 22); c.fillRect(0, h - 22, w, 22); });
  mos.wrapS = THREE.RepeatWrapping; mos.repeat.set(3, 1); const marble = new THREE.MeshStandardMaterial({ color: 0xf2eee6, roughness: .3 });
  WP.children.forEach(o => { if (o.isMesh && o.geometry.type === 'CylinderGeometry') o.material = [new THREE.MeshStandardMaterial({ map: mos, roughness: .35, metalness: .15 }), o.material, o.material];
    if (o.isMesh && o.geometry.type === 'BoxGeometry') o.material = marble; });
  const foam = new THREE.Mesh(new THREE.TorusGeometry(R - .15, .22, 8, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9, transparent: true, opacity: .85 })); foam.rotation.x = PI / 2; foam.position.y = 2.7; foam.userData.noOutline = true; WP.add(foam);
  for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2; const l = sphere(.28, new THREE.MeshStandardMaterial({ color: 0xbff8ff, emissive: 0x6af0ff, emissiveIntensity: 2.2 }), WP, Math.cos(a) * (R + .6), 3.1, Math.sin(a) * (R + .6), 10, 8); l.userData.noOutline = true; }
  const duck = new THREE.Group(); duck.position.set(3.2, 2.7, 2.6); duck.rotation.y = -.8; WP.add(duck); const dy = mat(0xffd21a, { roughness: .4 });
  const db = sphere(.75, dy, duck, 0, .35, 0, 16, 12); db.scale.set(1.25, .8, 1); sphere(.48, dy, duck, .55, 1.05, 0, 14, 10); const bk = new THREE.Mesh(new THREE.ConeGeometry(.2, .5, 10), mat(0xff7a1a)); bk.rotation.z = -PI / 2; bk.position.set(1.1, 1.0, 0); duck.add(bk);
  for (const s2 of [-1, 1]) sphere(.08, mat(0x111111), duck, .85, 1.2, s2 * .25, 8, 6);
  const glass = new THREE.Group(); glass.position.set(-6.4, 3.1, 3.6); WP.add(glass); const gm2 = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .05, transparent: true, opacity: .5 });
  cyl(.05, .05, .6, gm2, 8, glass, 0, .3, 0); const cup = cyl(.32, .06, .7, gm2, 12, glass, 0, .95, 0); cyl(.27, .08, .45, mat(0xffd8a0, { emissive: 0xffa040, emissiveIntensity: .3 }), 12, glass, 0, .9, 0); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); const c = octx;
  if (v === 0) { let HC;
    coverShot(L => { villaS(L, 'noon', .55); poolDetail();
      pose(ich, VX, .55, -1, 0, L, { aLx: .2, aLz: 1.35, aRx: .2, aRz: 1.35, aLe: .2, aRe: .2, lean: -.25, lLx: 1.4, lRx: 1.4 }, 'joy', { eyes: 'happy', mouth: 'laugh' }); ich.blob.visible = false;
      const pt = { aRx: 1.7, aRz: .05, aRe: .05, aLx: 1.3, aLz: .5, aLe: 1.6, lean: -.1 };
      pose(genau, VX - 4.8, 0, 7.6, 1.35, L, pt, 'shout', { mouth: 'scream' }); pose(digga, VX + 4.4, 0, 7.8, -1.35, L, pt, 'shout', { mouth: 'scream' });
      bubble(genau, 'HUSS!', 1, 1.3); bubble(digga, 'HUSS!', 1, 1.3);
      for (let i = 0; i < 40; i++) { const r = RNG(i + 300), a = r() * PI * 2, d = 3 + r() * 9; const k = COINS[i]; k.visible = true; k.position.set(VX + Math.cos(a) * d, 6.5 + r() * 9, -4 + Math.sin(a) * d * .5); k.rotation.set(r() * 3, r() * 3, r() * 3); k.scale.setScalar(1.1); }
      cam([VX + 1.5, 9.5, 27], [VX, 3.6, 0], 50); SHC = V(VX, 0, 0); HC = hp(ich); });
    const [x, y] = proj(HC.clone().add(V(0, -.2, 0)));
    const tg = c.createLinearGradient(0, 0, 0, 760); tg.addColorStop(0, 'rgba(8,14,40,.85)'); tg.addColorStop(1, 'rgba(8,14,40,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, 760);
    coverWord(c, 'IN DIESER STADT GIBT ES', W / 2, 330, 70, 'Lilita', '#ffffff', { lw: 16, stroke: '#0a0e1e' });
    coverWord(c, '1 € FÜR', W / 2, 490, 160, 'Lucky', ['#fff6a8', '#ffb81a'], { lw: 30, stroke: '#2a1400', rot: -.02 });
    coverWord(c, 'DEINEN NAMEN!', W / 2, 620, 112, 'Lucky', ['#ffffff', '#dfe8ff'], { lw: 24, stroke: '#0a0e1e', rot: -.02 });
    redCircle(c, x, y, 150, 185);
  } else { let HC;
    coverShot(L => { stadt(L, 'day', 'ende'); if (!window.__MOUND) { const m = new THREE.Mesh(new THREE.ConeGeometry(3.4, 3.4, 40, 4), new THREE.MeshStandardMaterial({ color: 0xffc830, metalness: .75, roughness: .3, map: canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#e8a820'; c.fillRect(0, 0, w, h); const r = RNG(5); for (let i = 0; i < 260; i++) { c.fillStyle = ['#fff0a0', '#ffd23f', '#c88a10'][i % 3]; c.beginPath(); c.ellipse(r() * w, r() * h, 9, 6, r() * 3, 0, 7); c.fill(); c.strokeStyle = '#8a5a00'; c.lineWidth = 1.5; c.stroke(); } }) })); m.position.set(0, 1.7, -18); m.castShadow = m.receiveShadow = true; scene.add(m); window.__MOUND = m; } RF.g.traverse(o => { if (!o.isMesh && !o.isLine) return; const b = new THREE.Box3().setFromObject(o), cz = (b.min.z + b.max.z) / 2, cy = (b.min.y + b.max.y) / 2; if (Math.abs(cz + 24) < 3 && cy > 6 && cy < 14.5 && b.max.y < 15) o.visible = false; });
      for (let i = 0; i < 40; i++) { const r = RNG(i + 70), a = r() * PI * 2, d = Math.sqrt(r()) * 3; const k = COINS[i]; k.visible = true; k.position.set(Math.cos(a) * d * 1.1, .1 + (3.4 - d * 1.1) * .95 + r() * .2, -18 + Math.sin(a) * d * 1.1 + .4); k.rotation.set(-PI / 2 + (r() - .5), r() * 3, 0); k.scale.setScalar(.9); }
      pose(ich, 0, 3.3, -18, 0, L, { aLx: 2.8, aLz: .5, aRx: 2.8, aRz: .5 }, 'joy', { mouth: 'laugh' });
      crowdBox(L, -13, -4.5, -14, -6, 4, 9, { mode: 'point', face: V(0, 3, -18) }); crowdBox(L, 4.5, 13, -14, -6, 4, 19, { mode: 'point', face: V(0, 3, -18), from: 4 });
      cam([0, 3.2, 14], [0, 14.5, -40], 60); SHC = V(0, 0, -24); HC = hp(ich); });
    const [x, y] = proj(HC.clone().add(V(0, -.3, 0)));
    window.__y2 = y;
    const tg = c.createLinearGradient(0, 0, 0, 760); tg.addColorStop(0, 'rgba(8,14,40,.88)'); tg.addColorStop(1, 'rgba(8,14,40,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, 760);
    coverWord(c, 'NIEMAND SAGT MEINEN NAMEN…', W / 2, 330, 66, 'Lilita', '#ffffff', { lw: 16, stroke: '#0a0e1e' });
    coverWord(c, 'BIS ICH', W / 2, 460, 116, 'Lucky', ['#ffffff', '#dfe8ff'], { lw: 24, stroke: '#0a0e1e', rot: -.02 });
    coverWord(c, 'MILLIONÄR BIN!', W / 2, 600, 124, 'Lucky', ['#fff6a8', '#ffb81a'], { lw: 26, stroke: '#2a1400', rot: -.02 });
    redCircle(c, x, y, 190, 240);
  } };
