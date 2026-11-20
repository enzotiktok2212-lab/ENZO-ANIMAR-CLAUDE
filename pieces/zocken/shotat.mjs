import { createRequire } from 'module'; import fs from 'fs'; const { chromium } = createRequire(import.meta.url)('playwright');
const [out, ...ts] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('pageerror:', e.message)); await p.goto('http://localhost:8795/index.html'); await p.waitForFunction('window.__ready === true', null, { timeout: 120000 });
const el = await p.$('#stage'); for (const t of ts) { await p.evaluate(t => window.renderAt(t), +t); await el.screenshot({ path: `${out}/s${Math.round(t * 100)}.png` }); } await br.close();
