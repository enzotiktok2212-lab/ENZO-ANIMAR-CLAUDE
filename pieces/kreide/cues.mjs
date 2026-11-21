// node cues.mjs → audio/cues.json y audio/shots.json (lee window.CUES / window.SHOTS de la página)
import { createRequire } from 'module'; import fs from 'fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto('http://localhost:8779/index.html'); await p.waitForFunction('window.__ready === true', null, { timeout: 120000 });
fs.writeFileSync('audio/cues.json', JSON.stringify(await p.evaluate('window.CUES'))); fs.writeFileSync('audio/shots.json', JSON.stringify(await p.evaluate('window.SHOTS'))); await br.close();
