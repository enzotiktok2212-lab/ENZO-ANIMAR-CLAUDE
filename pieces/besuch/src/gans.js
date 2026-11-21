// Gänse — ganso articulado (primeros planos) y bandada instanciada (cientos de gansos baratos de renderizar).
// Medidas: un personaje mide ~7,5; un ganso, ~3,4 hasta la coronilla (cuello estirado).
import { THREE, mat, box, cyl, sphere, rbox, canvasTex, RNG, clamp, lerp } from './engine.js';

// colores: [cuerpo, alas, vientre/cuello]
export const GCOL = [[0xf6f4ee, 0xe2dfd6, 0xffffff], [0xf6f4ee, 0xd8d4ca, 0xffffff], [0x9a9ca6, 0x6e707c, 0xc4c6ce], [0x8c8274, 0x5e5448, 0xd6d0c2], [0xf6f4ee, 0x9a9ca6, 0xffffff], [0xb8b2a6, 0x7a7266, 0xe4e0d6]];
const ORANGE = 0xff8a1e;

// ojo de ganso dibujado: almendra blanca, iris marrón-ámbar, pupila, brillo, párpado del color de la cabeza y ceja
const EYEC = new Map();
export function gooseEye(state, lid) { const k = state + lid; if (EYEC.has(k)) return EYEC.get(k);
  const t = canvasTex(128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); const cx = 64, cy = 66, rx = 40, ry = 34;
    const lidC = '#' + lid.toString(16).padStart(6, '0');
    if (state === 'closed' || state === 'happy') { c.strokeStyle = '#1a1a1a'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); if (state === 'closed') c.arc(cx, cy - 10, 34, .25 * Math.PI, .75 * Math.PI); else c.arc(cx, cy + 22, 34, 1.2 * Math.PI, 1.8 * Math.PI); c.stroke(); return; }
    c.save(); c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, 7); c.fillStyle = '#fbfbf6'; c.fill(); c.clip();
    const lx = state === 'side_l' ? -14 : state === 'side_r' ? 14 : state === 'up' ? 0 : 0, ly = state === 'up' ? -10 : state === 'down' ? 10 : 2;
    c.fillStyle = '#6a3a14'; c.beginPath(); c.arc(cx + lx, cy + ly, 22, 0, 7); c.fill(); c.fillStyle = '#141008'; c.beginPath(); c.arc(cx + lx, cy + ly, 13, 0, 7); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(cx + lx - 7, cy + ly - 8, 6, 0, 7); c.fill();
    // párpado superior (cubre según el estado)
    const cover = { normal: .18, side_l: .2, side_r: .2, up: .05, down: .45, half: .5, angry: .42, sus: .55, sad: .4, wide: 0 }[state] ?? .18;
    c.fillStyle = lidC; if (state === 'angry') { c.beginPath(); c.moveTo(0, 0); c.lineTo(w, 0); c.lineTo(w, cy - ry + 2 * ry * .55); c.lineTo(0, cy - ry + 2 * ry * .2); c.closePath(); c.fill(); }
    else if (state === 'sad') { c.beginPath(); c.moveTo(0, 0); c.lineTo(w, 0); c.lineTo(w, cy - ry + 2 * ry * .2); c.lineTo(0, cy - ry + 2 * ry * .55); c.closePath(); c.fill(); }
    else c.fillRect(0, 0, w, cy - ry + 2 * ry * cover);
    c.restore(); c.strokeStyle = '#2a2420'; c.lineWidth = 5; c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, 7); c.stroke();
    // línea del párpado
    if (state !== 'wide') { const yl = state === 'angry' || state === 'sad' ? null : cy - ry + 2 * ry * cover; if (yl) { c.beginPath(); c.moveTo(cx - rx * Math.sqrt(1 - ((yl - cy) / ry) ** 2), yl); c.lineTo(cx + rx * Math.sqrt(1 - ((yl - cy) / ry) ** 2), yl); c.lineWidth = 6; c.stroke(); } }
    // ceja (gansos expresivos)
    c.strokeStyle = '#3a3430'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath();
    if (state === 'angry') { c.moveTo(cx - 36, cy - 52); c.lineTo(cx + 34, cy - 36); } else if (state === 'sad' || state === 'sus') { c.moveTo(cx - 34, cy - 38); c.lineTo(cx + 32, cy - 50); } else if (state === 'wide') { c.moveTo(cx - 30, cy - 58); c.quadraticCurveTo(cx, cy - 66, cx + 30, cy - 58); } else { c.moveTo(cx - 30, cy - 48); c.quadraticCurveTo(cx, cy - 54, cx + 30, cy - 48); }
    c.stroke(); }); EYEC.set(k, t); return t; }

// ---------- ganso articulado ----------
export function makeGoose(scene, ci = 0, o = {}) { const [cb, cw, cn] = GCOL[ci % GCOL.length];
  const root = new THREE.Group(); scene.add(root); const body = new THREE.Group(); body.position.y = 1.45; root.add(body);
  const mb = mat(cb, { roughness: .78 }), mw = mat(cw, { roughness: .8 }), mn = mat(cn, { roughness: .78 }), mo = mat(ORANGE, { roughness: .45 });
  // cuerpo: torso redondeado + pecho + cola levantada
  const tor = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), mb); tor.scale.set(.95, .8, 1.35); body.add(tor);
  const chest = new THREE.Mesh(new THREE.SphereGeometry(.78, 20, 14), mn); chest.position.set(0, .12, .82); body.add(chest);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.0, 10), mw); tail.position.set(0, .42, -1.42); tail.rotation.x = -2.1; tail.scale.set(1.2, 1, .55); body.add(tail);
  // alas (pivotan en el hombro para aletear)
  const wings = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * .82, .38, .45); body.add(p); const w = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), mw); w.scale.set(.22, .52, 1.25); w.position.set(0, -.08, -.75); w.rotation.x = .12; p.add(w);
    for (let k = 0; k < 3; k++) { const f = box(.08, .1, .9 - k * .18, mat(cw === cb ? 0xcfcac0 : 0x4a4640), .04, p, s * .14, -.28 - k * .14, -.9 - k * .2); } return p; });
  // patas
  const legs = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * .38, -.5, .1); body.add(p); cyl(.11, .1, 1.0, mo, 8, p, 0, -.5, 0); const ft = new THREE.Group(); ft.position.y = -1.0; p.add(ft);
    const webs = new THREE.Shape(); webs.moveTo(0, -.08); webs.lineTo(-.34, .5); webs.lineTo(-.1, .42); webs.lineTo(0, .56); webs.lineTo(.1, .42); webs.lineTo(.34, .5); webs.closePath(); const wf = new THREE.Mesh(new THREE.ExtrudeGeometry(webs, { depth: .07, bevelEnabled: false }), mo); wf.rotation.x = Math.PI / 2; wf.position.y = .04; ft.add(wf); return p; });
  // cuello: dos segmentos articulados + cabeza
  const n1 = new THREE.Group(); n1.position.set(0, .45, 1.0); body.add(n1); const s1 = new THREE.Mesh(rbox(.56, .95, .56, .26), mn); s1.position.y = .45; n1.add(s1);
  const n2 = new THREE.Group(); n2.position.y = .85; n1.add(n2); const s2 = new THREE.Mesh(rbox(.5, .9, .5, .24), mn); s2.position.y = .42; n2.add(s2);
  const head = new THREE.Group(); head.position.y = .86; n2.add(head); const hd = new THREE.Mesh(rbox(.66, .62, .82, .3), mn); hd.position.set(0, .1, .1); head.add(hd);
  const beakU = new THREE.Group(); beakU.position.set(0, .06, .48); head.add(beakU); const bu = new THREE.Mesh(rbox(.36, .2, .62, .09), mo); bu.position.set(0, .04, .26); beakU.add(bu); sphere(.13, mat(0xff7a10), beakU, 0, .14, .0, 10, 8);
  box(.06, .03, .05, mat(0x6a3a10), .01, beakU, -.06, .12, .5); box(.06, .03, .05, mat(0x6a3a10), .01, beakU, .06, .12, .5);
  const beakL = new THREE.Group(); beakL.position.set(0, -.04, .48); head.add(beakL); const bl = new THREE.Mesh(rbox(.3, .12, .52, .05), mat(0xe8761a)); bl.position.set(0, -.02, .22); beakL.add(bl);
  // ojos: planos con textura a los lados de la cabeza, un poco hacia delante
  const eyes = [-1, 1].map(s => { const e = new THREE.Mesh(new THREE.PlaneGeometry(.34, .34), new THREE.MeshStandardMaterial({ map: gooseEye('normal', cn), transparent: true, roughness: .4, polygonOffset: true, polygonOffsetFactor: -2 })); e.position.set(s * .335, .2, .26); e.rotation.y = s * (Math.PI / 2 - .55); head.add(e); return e; });
  // adorno opcional: lazo/collar
  if (o.bow != null) { const bw = mat(o.bow, { roughness: .5 }); const r = new THREE.Mesh(new THREE.TorusGeometry(.3, .07, 6, 18), bw); r.rotation.x = Math.PI / 2; r.position.y = .25; n1.add(r); for (const s of [-1, 1]) { const l = box(.3, .22, .1, bw, .05, n1, s * .2, .25, .32); l.rotation.z = s * .5; } }
  root.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  const G = { root, body, n1, n2, head, beakU, beakL, wings, legs, eyes, lid: cn, seed: o.seed ?? ci * 7 + 1, scale: o.scale ?? 1 }; root.scale.setScalar(G.scale);
  G.setEyes = st => { const t = gooseEye(st, cn); for (const e of eyes) if (e.material.map !== t) { e.material.map = t; e.material.needsUpdate = true; } };
  return G; }
// pose del ganso: {walk (fase en ciclos), stride, neck (estirar 0..1), pitch (cabeza arriba/abajo), yaw (girar cabeza), honk 0..1, flap 0..1, shake 0..1, eyes}
export function poseGoose(G, T, p = {}) { const w = p.walk ?? 0, ph = w * Math.PI * 2, mv = p.moving ?? (p.walk != null ? 1 : 0), sd = G.seed;
  // contoneo: balanceo lateral y subir/bajar con cada paso
  G.body.rotation.z = Math.sin(ph) * .12 * mv; G.body.position.y = 1.45 + Math.abs(Math.cos(ph)) * .08 * mv + Math.sin(T * 2.1 + sd) * .015; G.body.rotation.x = (p.lean ?? 0) + Math.sin(T * 1.7 + sd) * .015;
  G.legs[0].rotation.x = Math.sin(ph) * .55 * mv; G.legs[1].rotation.x = -Math.sin(ph) * .55 * mv;
  const bob = Math.sin(ph * 2) * .1 * mv, idle = Math.sin(T * 1.3 + sd) * .06, nk = p.neck ?? .5;
  G.n1.rotation.x = lerp(.55, -.05, nk) + bob + idle; G.n2.rotation.x = lerp(.35, -.12, nk) - bob * .5 - idle * .5;
  G.n1.rotation.y = (p.yaw ?? 0) * .4; G.n2.rotation.y = (p.yaw ?? 0) * .35 + (p.shake ? Math.sin(T * 26) * .5 * p.shake : 0);
  G.head.rotation.x = -(G.n1.rotation.x + G.n2.rotation.x) + (p.pitch ?? 0) + Math.sin(T * 2.7 + sd) * .04; G.head.rotation.y = (p.yaw ?? 0) * .25 + (p.shake ? Math.sin(T * 26 + .6) * .35 * p.shake : 0);
  G.head.rotation.z = (p.tilt ?? 0) + Math.sin(T * .9 + sd) * .05;
  const hk = p.honk ?? 0; G.beakL.rotation.x = hk * .55; G.beakU.rotation.x = -hk * .12;
  const fl = p.flap ?? 0; G.wings.forEach((wg, i) => { const s = i ? 1 : -1; wg.rotation.z = s * fl * (.4 + Math.sin(T * 22 + i) * .9 * fl); wg.rotation.y = s * fl * .3; });
  if (p.eyes) G.setEyes(p.eyes); }
// ganso que camina hacia ry desde (x,z): devuelve la posición
export function gooseWalk(G, lt, o) { const sp = o.speed ?? 2.2, d = Math.max(0, lt) * sp; const x = o.x + Math.sin(o.ry) * d, z = o.z + Math.cos(o.ry) * d;
  G.root.visible = true; G.root.position.set(x, o.y ?? 0, z); G.root.rotation.set(0, o.ry, 0); poseGoose(G, o.T ?? lt, { walk: d / 1.7, moving: sp > 0 ? 1 : 0, ...(o.p || {}) }); return { x, z }; }

// ---------- bandada instanciada ----------
// cada ganso: {x, z, ry, ph (fase), walk (0/1), ci (color), s (escala), look (giro de cabeza), honk, y}
export function makeHerd(scene, max = 700) {
  const g = new THREE.Group(); scene.add(g);
  const geo = { tor: new THREE.SphereGeometry(1, 10, 7), chest: new THREE.SphereGeometry(.78, 8, 6), wing: new THREE.SphereGeometry(1, 8, 5), neck: new THREE.CylinderGeometry(.27, .29, 1.75, 8), head: rbox(.66, .62, .82, .2), beak: new THREE.BoxGeometry(.36, .2, .62), leg: new THREE.CylinderGeometry(.11, .1, 1, 6), foot: new THREE.BoxGeometry(.6, .06, .55), eye: new THREE.SphereGeometry(.085, 6, 4), tail: new THREE.ConeGeometry(.5, 1, 6) };
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .8 }), orange = mat(ORANGE, { roughness: .45 }), dark = mat(0x16120e, { roughness: .2 });
  const parts = {}; const mkI = (k, m, n = max) => { const im = new THREE.InstancedMesh(geo[k], m, n); im.castShadow = ['tor', 'neck', 'head'].includes(k); im.receiveShadow = true; im.frustumCulled = false; im.count = 0; g.add(im); parts[k] = im; return im; };
  mkI('tor', white); mkI('chest', white); mkI('wing', white, max * 2); mkI('neck', white); mkI('head', white); mkI('tail', white); mkI('beak', orange); mkI('leg', orange, max * 2); mkI('foot', orange, max * 2); mkI('eye', dark, max * 2);
  const M = new THREE.Matrix4(), L = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), S = new THREE.Vector3(), C = new THREE.Color();
  const comp = (px, py, pz, rx, ry, rz, sx, sy, sz) => { E.set(rx, ry, rz); Q.setFromEuler(E); P.set(px, py, pz); S.set(sx, sy, sz); return L.compose(P, Q, S); };
  let list = [];
  const H = { g, parts, set(l) { list = l; }, get list() { return list; },
    update(T) { const n = Math.min(list.length, max); const cnt = { tor: 0, chest: 0, wing: 0, neck: 0, head: 0, tail: 0, beak: 0, leg: 0, foot: 0, eye: 0 };
      const put = (k, mtx, col) => { const im = parts[k], i = cnt[k]++; im.setMatrixAt(i, M.clone().multiply(mtx)); if (col != null) im.setColorAt(i, C.setHex(col)); };
      for (let i = 0; i < n; i++) { const q = list[i]; if (q.hide) continue; const r = RNG(i * 13 + 5), ph = (q.ph ?? r()) * 6.283 + (q.walk ? T * (q.wsp ?? 7) : 0), mv = q.walk ? 1 : 0, sc = q.s ?? (.9 + r() * .2);
        const [cb, cw, cn] = GCOL[(q.ci ?? Math.floor(r() * 6)) % GCOL.length];
        const bobY = Math.abs(Math.cos(ph)) * .08 * mv, roll = Math.sin(ph) * .12 * mv;
        E.set(0, q.ry ?? 0, roll); Q.setFromEuler(E); P.set(q.x, (q.y ?? 0) + (1.45 + bobY) * sc, q.z); S.set(sc, sc, sc); M.compose(P, Q, S);
        put('tor', comp(0, 0, 0, 0, 0, 0, .95, .8, 1.35), cb); put('chest', comp(0, .12, .82, 0, 0, 0, 1, 1, 1), cn); put('tail', comp(0, .42, -1.42, -2.1, 0, 0, 1.2, 1, .55), cw);
        for (const s of [-1, 1]) put('wing', comp(s * .82, .3, -.3, .12, 0, s * (q.flap ? Math.sin(T * 22 + i) * .8 : 0), .22, .52, 1.25), cw);
        for (const s of [-1, 1]) { const a = (s > 0 ? 1 : -1) * Math.sin(ph) * .5 * mv; put('leg', comp(s * .38, -1.0 + Math.cos(a) * 0, .1 + Math.sin(a) * .5, a, 0, 0, 1, 1, 1)); put('foot', comp(s * .38, -1.47, .3 + Math.sin(a) * 1.0, 0, 0, 0, 1, 1, 1)); }
        // cuello inclinado hacia delante + cabeza (mira: q.look en yaw, q.up en pitch)
        const nb = Math.sin(ph * 2) * .1 * mv + Math.sin(T * 1.3 + i) * .05, lean = .28 + nb + (q.down ? .9 : 0), ly = (q.look ?? 0);
        const ny = .45 + Math.cos(lean) * .87, nz = 1.0 + Math.sin(lean) * .87; put('neck', comp(Math.sin(ly) * .15, ny, nz, lean, ly * .5, 0, 1, 1, 1), cn);
        const hy = .45 + Math.cos(lean) * 1.75 + .05, hz = 1.0 + Math.sin(lean) * 1.75 + .05 + (q.down ? .1 : 0), hx = Math.sin(ly) * .4;
        put('head', comp(hx, hy, hz, (q.up ?? 0), ly, 0, 1, 1, 1), cn);
        const ca = Math.cos(ly), sa = Math.sin(ly); put('beak', comp(hx + sa * .62, hy + .02 - (q.up ?? 0) * .3, hz + ca * .62, (q.up ?? 0) - (q.honk ? Math.max(0, Math.sin(T * 9 + i)) * .3 : 0), ly, 0, 1, 1, 1));
        for (const s of [-1, 1]) put('eye', comp(hx + ca * s * .3 + sa * .25, hy + .14, hz - sa * s * .3 + ca * .25, 0, 0, 0, 1, 1, 1)); }
      for (const k in parts) { const im = parts[k]; im.count = cnt[k]; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; } } };
  return H; }
// formaciones
export function field(cx, cz, w, d, n, seed = 1, o = {}) { const r = RNG(seed), out = []; const cols = Math.max(1, Math.round(Math.sqrt(n * w / d))), rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) { const c = i % cols, rw = Math.floor(i / cols); const x = cx - w / 2 + (c + .5 + (r() - .5) * .7) * w / cols, z = cz - d / 2 + (rw + .5 + (r() - .5) * .7) * d / rows;
    if (o.hole && Math.hypot(x - o.hole[0], z - o.hole[1]) < o.hole[2]) continue; out.push({ x, z, ry: (o.ry ?? 0) + (r() - .5) * (o.spread ?? .8), ph: r(), walk: o.walk ? 1 : 0, ci: Math.floor(r() * 6), look: (r() - .5) * (o.lookSpread ?? .8), honk: r() < (o.honk ?? .15) }); } return out; }
// todos miran a un punto
export function lookAt(list, px, pz) { for (const q of list) { const a = Math.atan2(px - q.x, pz - q.z); q.ry = a + (q.ry - a) * .15; q.look = 0; } return list; }
