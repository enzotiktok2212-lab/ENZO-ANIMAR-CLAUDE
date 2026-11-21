import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
const [url, out, ...vs] = process.argv.slice(2);
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
await p.goto(url); await p.waitForFunction('window.__ready === true', null, { timeout: 300000 });
for (const v of vs) { await p.evaluate(v => window.shot(+v), v); await p.screenshot({ path: `${out}-${v}.png` }); } await br.close();
