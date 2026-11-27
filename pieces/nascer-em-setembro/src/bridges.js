// =====================================================================
//  CAMERAS — every shot moves: a slow push on its focus (set-up 1), or a closer push (set-up 2),
//  plus a short shake on the scenes that land a gag. BRIDGES = [] (every boundary is a hard cut).
// =====================================================================
const ERA_BG = SHOT_LIST.map(() => '#fff7ea');
function pieceCam(era, t) {
  const [t0, sc, p] = SHOT_LIST[era], t1 = ERA_LIST[era][1], c = SCENE_CAM[sc] || {}, f = c.focus || [540, 950];
  const u = clamp((t - t0) / Math.max(0.1, t1 - t0)), close = p.setup === 2;
  // transition into the shot: a punch-in zoom that settles (stronger on chapter cuts)
  const chap = CHAPTER(sc) && p.setup === 1, punch = 1 + (chap ? 0.28 : 0.08) * Math.exp(-(t - t0) * (chap ? 9 : 14));
  const z0 = close ? (c.z2 ?? 1.3) : (c.z1 ?? 1.06), z = (z0 + 0.07 * EZ.io(u)) * punch;
  const drift = Math.sin((t0 * 3.7) % TAU) * 16 * u;   // a small sideways drift, different per shot
  let to = close ? [540 + drift, 900] : [f[0] + drift, f[1]];
  if (c.shake) { const k = Math.exp(-(t - p.base) * 4) * 14; to = [to[0] + Math.sin(t * 61) * k, to[1] + Math.cos(t * 47) * k]; }
  return camOf({ z, p: f, to });
}
const BRIDGES = [];
function CHAPTER(sc) { return ['ageCard', 'title', 'goodNews', 'months', 'december', 'note'].includes(sc); }
