// ---------- ayudantes de los planos ----------
// vigilantes en arco alrededor del monstruo, mirándolo, con la linterna levantada
const RING = (L, list, a0, a1, r, o = {}) => list.forEach((c, i) => { const a = lerp(a0, a1, list.length > 1 ? i / (list.length - 1) : .5), x = Math.sin(a) * r, z = Math.cos(a) * r; put(c, x, 0, z, a + PI);
  actuar(c, L.lt, [[0, o.pose || { aRx: 2.0 + (i % 3) * .12, aRz: -.05, aRe: .1, headX: -.45, aLz: .15 }]], { T: L.T + i * .7 }); if (o.torch !== false && (o.ti ?? 1) + i < 8) torch((o.ti ?? 1) + i, c); cara(c, L.T, { expr: o.expr || 'determined' }); });
const GUARDS = () => [WA[0], WA[1], WA[2], WA[3], WA[4], WA[5], benno];
const flash3 = (L, on = .25) => { grade.uniforms.sepia.value = on; };   // tono de recuerdo en el flashback
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
const look2 = (a, b, k = .5) => a.clone().lerp(b, k);

