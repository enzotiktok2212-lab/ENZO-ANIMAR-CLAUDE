// ---------- ayudantes de los planos ----------
const sgn = (T, s = 0) => ({ aRx: 1.25 + Math.sin(T * 6.3 + s) * .35, aRz: -.1 + Math.sin(T * 4.1 + s) * .15, aRe: 1.5 + Math.sin(T * 7.7 + s * 2) * .45, aLx: 1.0 + Math.cos(T * 5.2 + s) * .3, aLe: 1.6 + Math.sin(T * 6.1 + s) * .3, headX: .05, headZ: Math.sin(T * 2 + s) * .08 });   // lengua de signos
// gente por la calle (de día): n vecinos alrededor de z = zc, unos caminan, otros charlan por señas o se quedan mirando; skip = índices de NB que no se usan
function crowd(L, zc = 0, n = 14, sd = 1, o = {}) { const r = RNG(sd * 31 + 7); const used = new Set(o.skip || []); let k = 0;
  for (let j = 0; j < 24 && k < n; j++) { const id = (j * 7 + sd * 5) % 24; if (used.has(id)) continue; used.add(id); k++; const c = NB[id];
    const x = (r() - .5) * (o.w ?? 26), z = zc + (r() - .5) * (o.span ?? 70), m = r(); if (o.clear && Math.abs(x - o.clear[0]) < 5 && Math.abs(z - o.clear[1]) < 6) continue;
    if (m < (o.walk ?? .45)) caminar(c, L.lt + r() * 4, { x, z, ry: r() < .5 ? 0 : PI, speed: 2.2 + r() * 1.4, T: L.T + id });
    else { put(c, x, 0, z, o.face != null ? o.face + (r() - .5) * 1.2 : r() * 6.28); actuar(c, L.lt, [[0, m < .8 ? (T => sgn(T, id)) : o.pose || {}]], { T: L.T + id }); }
    cara(c, L.T + id, { expr: o.expr || (m > .9 ? 'smile' : 'neutral') }); } }
// vecinos de pie mirando hacia un punto (reacción en grupo)
function group(L, list, pos, look, pose = {}, expr = 'neutral') { list.forEach(([id, dx, dz], i) => { const c = put(NB[id], pos.x + dx, 0, pos.z + dz, faceTo(V(pos.x + dx, 0, pos.z + dz), look)); actuar(c, L.lt, [[0, typeof pose === 'function' ? T => pose(T, i) : pose]], { T: L.T + i }); cara(c, L.T + i, { expr }); }); }
// golpes: brazo derecho que golpea en los instantes ts (tiempo local)
const knockP = (lt, ts) => { let e = 1.5; for (const t of ts) { const d = lt - t; if (d > -.12 && d < .2) e = 1.5 - Math.max(0, 1 - Math.abs(d) / .12) * .9; } return { ...GEST.knock, aRe: e, aRx: 1.55 + (1.5 - e) * .25 }; };
// el monstruo andando: piernas y brazos que se balancean, avanza por la calle
const mwalk = (T, sp = 1, base = MP.stalk) => ({ ...base, lLx: Math.sin(T * 2.2 * sp) * .45, lRx: -Math.sin(T * 2.2 * sp) * .45, lLk: Math.max(0, Math.sin(T * 2.2 * sp + 1.2)) * .6, lRk: Math.max(0, -Math.sin(T * 2.2 * sp + 1.2)) * .6, aLx: (base.aLx || 0) - Math.sin(T * 2.2 * sp) * .25, aRx: (base.aRx || 0) + Math.sin(T * 2.2 * sp) * .25 });
const DORF = (n = 'day') => { use('DF'); if (n === 'night') night(); else if (n === 'dusk') dusk(); else day(); };
// tumbado boca arriba en mi cama (cabeza hacia la almohada)
const BEDP = () => V(ZX - 6, 3.45, -4.4);
function lie(ch, L, extra = {}) { const p = BEDP(); ch.root.visible = true; ch.root.position.copy(p); ch.root.rotation.set(-PI / 2, 0, 0); applyPose(ch, { aLz: .12, aRz: .12, ...extra }); return ch; }
const faceUp = ch => hp(ch).add(V(0, .7, -.3));   // centro de la cara de alguien tumbado
// mamá en su cama de abajo (cocina), tumbada de lado mirando al techo
function lieMama(L, extra = {}) { mama.root.visible = true; mama.root.position.set(KX + 13.2, 3.5, 9); mama.root.rotation.set(-PI / 2, -PI / 2, 0); applyPose(mama, { aLz: .1, aRz: .1, ...extra }); return mama; }
// cerilla en la mano derecha
const matchIn = (ch, lit, T) => { attach(MATCH, ch.aR.hand, [0, -.55, .35], [PI * .55, 0, 0], 1.3); MATCH.userData.lit(lit, T); return MATCH; };
// cámara mirando a la cara de alguien tumbado, desde arriba y un lado
function lieCam(ch, dist, side = 0, fov = 40, k = 0, dist2 = null, up = 0) { const f = faceUp(ch), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k)); cam([f.x + side, f.y + d, f.z + d * .45 + up], [f.x, f.y, f.z - .2], fov); }
// el monstruo junto a mi cama alarga las garras hasta un punto (la cara): se coloca de modo que las manos lleguen ahí
function monReach(L, target, o = {}) { const p = { ...MP.loom, crouch: .45, lean: .75, headX: .7, aLx: 1.15, aRx: 1.15, aLe: .5, aRe: .5, aLz: -.05, aRz: -.05, curl: .2, ...(o.pose || {}) };
  mon(p, V(0, 0, 0), o.ry ?? -PI / 2, L.T, o.talk ?? .5, o.wide ?? 0, o.focus || null); MON.root.updateMatrixWorld(true);
  const hs = o.one ? wpos(MON.aR.hand) : wpos(MON.aL.hand).add(wpos(MON.aR.hand)).multiplyScalar(.5); MON.root.position.add(target.clone().sub(hs).add(V(0, 1.2, 0))); MON.root.updateMatrixWorld(true);
  if (o.focus) MON.mouths(L.T, o.talk ?? .5, o.wide ?? 0, MON.head.worldToLocal(o.focus.clone())); }
// sentado en una silla (la silla mira hacia ry)
function sit(ch, x, z, ry, extra = {}) { put(ch, x, 1.35, z, ry); applyPose(ch, { lLx: 1.5, lRx: 1.5, lLk: -1.5, lRk: -1.5, ...extra }); return ch; }
