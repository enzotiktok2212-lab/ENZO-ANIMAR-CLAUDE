import { createRequire } from 'module'; import { serve } from './serve.mjs'; const { chromium } = createRequire(import.meta.url)('playwright');
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('pageerror:', e.message));
await serve(p, process.cwd()); await p.goto('http://pieza/index.html?ss=3'); await p.waitForFunction('window.__ready === true', null, { timeout: 300000 });
for (const v of [0, 1]) { await p.evaluate(v => window.renderCover(v), v); await (await p.$('#stage')).screenshot({ path: `renders/portada-${v + 1}.png` }); } await br.close();
