// node render.mjs <url> <outdir> [t1,t2,...]   sin lista: todos los fotogramas a 30 fps
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs';
const [url, out, list] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
p.on('console', m => { if (m.type() === 'error') console.log('page:', m.text()); });
p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto(url); await p.waitForFunction('window.__ready === true', null, { timeout: 120000 });
const dur = await p.evaluate('window.DUR'), fps = await p.evaluate('window.FPS');
const times = list ? list.split(',').map(Number) : Array.from({ length: Math.round(dur * fps) }, (_, i) => i / fps);
const el = await p.$('#stage'); const t0 = Date.now();
for (let i = 0; i < times.length; i++) {
  await p.evaluate(t => window.renderAt(t), times[i]);
  await el.screenshot({ path: `${out}/f${String(i).padStart(4, '0')}.png` });
  if (i % 30 === 0) console.log(i, ((Date.now() - t0) / 1000).toFixed(1) + 's');
}
await b.close();
