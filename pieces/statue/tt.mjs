// node tt.mjs <outdir> <t1,t2,...> [js antes]: fotogramas sueltos por tiempo
import { createRequire } from 'module'; import fs from 'fs'; import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [out, list, pre = ''] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } }); await serve(p, process.cwd());
p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto('http://pieza/index.html'); await p.waitForFunction('window.__ready === true', null, { timeout: 120000 });
if (pre) console.log(await p.evaluate(pre));
const el = await p.$('#stage');
for (const t of list.split(',')) { await p.evaluate(t => window.renderAt(t), +t); await el.screenshot({ path: `${out}/t${t}.png` }); }
await br.close();
