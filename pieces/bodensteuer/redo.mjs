// node redo.mjs <url> <framesDir> <planos completos "1,3,59"> [transiciones "W,S"]
// Vuelve a renderizar los planos indicados y los fotogramas de las transiciones de esos tipos.
import { createRequire } from 'module'; import fs from 'fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [url, dir, full, trs] = process.argv.slice(2);
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto(url); await p.waitForFunction('window.__ready === true', null, { timeout: 300000 });
const shots = await p.evaluate('window.SHOTS'); const set = new Set();
for (const n of (full || '').split(',').filter(Boolean).map(Number)) { const [a, b] = shots[n - 1]; for (let f = Math.ceil(a * 30); f < Math.ceil(b * 30); f++) set.add(f); }
const TRW = { W: 3, Z: 3, F: 2, S: 3, R: 4, I: 5, C: 4 };
for (const [a, b, tr] of shots) if (tr && (trs || '').split(',').includes(tr)) { const c = Math.round(b * 30); for (let f = c - TRW[tr] - 1; f <= c + TRW[tr] + 1; f++) set.add(f); }
const list = [...set].filter(f => f >= 0 && f < 3645).sort((x, y) => x - y); console.log('rehaciendo', list.length);
const el = await p.$('#stage');
for (const f of list) { await p.evaluate(t => window.renderAt(t), f / 30); await el.screenshot({ path: `${dir}/f${String(f).padStart(5, '0')}.png` }); }
await br.close(); console.log('hecho');
