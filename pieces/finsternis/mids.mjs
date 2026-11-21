// node mids.mjs <url> <outdir> <planos "1,2,3"|all> [frac]
import { createRequire } from 'module'; import fs from 'fs';
const { chromium } = createRequire('/home/user/ENZO-ANIMAR-CLAUDE/pieces/finsternis/')('playwright');
const [url, out, list, frac = '.6'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
await p.goto(url); await p.waitForFunction('window.__ready === true', null, { timeout: 300000 });
const shots = await p.evaluate('window.SHOTS'); console.log('shots', shots.length);
const ns = list === 'all' ? shots.map((_, i) => i + 1) : list.split(',').map(Number);
const el = await p.$('#stage');
for (const n of ns) { const [a, b] = shots[n - 1]; const t = a + (b - a) * +frac; await p.evaluate(t => window.renderAt(t), t); await el.screenshot({ path: `${out}/s${String(n).padStart(2, '0')}.png` }); }
await br.close();
