const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function capture() {
  const outDir = path.join(__dirname, '..', 'docs', 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    // Dark theme
    const contextDark = await browser.newContext({ viewport: { width: 1365, height: 900 } });
    const pageDark = await contextDark.newPage();
    // Ensure theme is set before page load
    await pageDark.addInitScript(() => {
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    });
    await pageDark.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    await pageDark.screenshot({ path: path.join(outDir, 'dark.png'), fullPage: true });
    await contextDark.close();

    // Light theme
    const contextLight = await browser.newContext({ viewport: { width: 1365, height: 900 } });
    const pageLight = await contextLight.newPage();
    await pageLight.addInitScript(() => {
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    });
    await pageLight.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    await pageLight.screenshot({ path: path.join(outDir, 'light.png'), fullPage: true });
    await contextLight.close();

    console.log('Screenshots saved to', outDir);
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
