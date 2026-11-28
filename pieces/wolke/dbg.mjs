// node dbg.mjs <url> : carga la pieza con todos los mensajes de consola y mide el tiempo hasta __ready
import { createRequire } from 'module'; import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } }); await serve(p, process.cwd());
p.on('pageerror', e => console.log('pageerror:', e.stack)); p.on('console', m => console.log('console:', m.type(), m.text().slice(0, 300))); p.on('requestfailed', r => console.log('fail', r.url())); p.on('response', r => { if (r.status() >= 400) console.log('404', r.url()); });
const t0 = Date.now(); await p.goto(process.argv[2]);
try { await p.waitForFunction('window.__ready === true', null, { timeout: 200000 }); console.log('ready', (Date.now() - t0) / 1000); } catch (e) { console.log('timeout'); }
await br.close();
