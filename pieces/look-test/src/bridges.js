const ERA_BG = ['#d8efe6', '#f3e3c8'];
function pieceCam(era, t) { return era === 0 ? camOf({ z: 1.12 + 0.03 * t, p: [520, 1050], to: [540, 1000] }) : camOf({ z: 1.0 + 0.03 * (t - 3), p: [540, 1050], to: [540, 1050] }); }
const BRIDGES = [];
