// ---------- a: ayudas comunes ----------
const sc_ = ch => ch.spec.scale || 1;
const headC = ch => hp(ch).add(V(0, .65 * sc_(ch), 0));
const stubeOn = (fill = 40) => { use('ST'); inside(1.0, fill); SNOWF = 0; };
const teichOn = () => { use('TE'); sunset(); setSky([.2, .22, .58], [.92, .5, .55], [1, .66, .36]); sun.position; SUNM.visible = true; scene.fog.color.setRGB(1, .78, .66); scene.fog.density = .0016; SNOWF = .35; };
const fhOn = () => { use('FH'); sunset(); setSky([.25, .35, .78], [.75, .6, .78], [1, .8, .6]); SNOWF = .8; };
const SX = x => STX + x, TXX = x => TX + x, FXX = x => FX + x;
// lágrimas que caen de los ojos
function tears(ch, T, n = 2) { const h = hp(ch), s = sc_(ch), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < n; i++) { const k = (T * .9 + i * .5) % 1, sd = i % 2 ? -1 : 1; const t = TEAR[i]; t.visible = true; t.position.set(h.x + fx * .62 * s + fz * sd * .32 * s, h.y + (.55 - k * 1.0) * s, h.z + fz * .62 * s - fx * sd * .32 * s); t.scale.set(s, 1.4 * s, s); } }
// caras tristes con lágrimas
const cry = (ch, T, ex = {}) => { cara(ch, T, { expr: 'sad', mouth: 'frown', ...ex }); tears(ch, T); };
// de la mano: brazo derecho de a con brazo izquierdo de b
const handR = { aRx: .35, aRz: -.35, aRe: .2 }, handL = { aLx: .35, aLz: -.35, aLe: .2 };
// gente del pueblo caminando / haciendo cosas (K, KD), en un arco detrás del centro
function folk(cx, cz, lt, T, n = 8, r0 = 8, r1 = 22, seed = 1, o = {}) { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx);
  const L = [...K, ...KD].slice(0, n); L.forEach((c, i) => { const a = ac + Math.PI + (r() - .5) * 2.2, d = r0 + r() * (r1 - r0); const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d, ry = r() * 6.283;
    if (i % 3 === 0 && !o.still) caminar(c, lt + i, { x: x - Math.sin(ry) * 3, z: z - Math.cos(ry) * 3, ry, speed: 2.4, T }); else { put(c, x, 0, z, Math.atan2(camera.position.x - x, camera.position.z - z) + (r() - .5) * 1.4); actuar(c, lt, [[0, [GEST.wave, 'idle', GEST.point, GEST.cheer, GEST.shrug][i % 5]]], { T: T + i }); }
    cara(c, T + i, { expr: o.expr || 'happy' }); }); }
// huellas dinámicas del niño visitante (aparecen según avanza)
const KPR = prints(HB.G, [[-34, 52], [-34, 20]], 'small', 1.1); KPR.visible = false;
const showPrints = (G, k) => { G.visible = true; const n = G.children.length; G.children.forEach((c, i) => c.visible = i < n * k); };
// visitante con brillo suave (borde dorado) — se usa poco, para que el giro no se vea venir
const HOUSE = () => wpos(HB.HAUS);
const hz = (lx, lz) => V(4 + lz, 0, 96 - lx);   // local de HB.HAUS -> mundo
const CAP = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x6a5a48, { roughness: .9 }); box(1.5, .38, 1.42, m, .18, g, 0, .2, 0); const b = box(1.3, .12, .8, m, .05, g, 0, .05, .9); outline(g, 1.5); g.visible = false; return g; })();
PROPS.push(CAP);
