// Local screenshots and responsive/accessibility QA; requires Playwright externally.
// PLAYWRIGHT_MODULE points to its installed module; QA_URL points to local preview.
// node scripts/typography-review.cjs before|after
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const phase = process.argv[2] || 'after';
const base = process.env.QA_URL || 'http://127.0.0.1:4178/walenza-website/';
const output = path.resolve(__dirname, '../qa-output/typography', phase);
const url = route => base + '#' + route;

async function ready(page, route) {
  await page.goto(url(route));
  await page.locator('h1').waitFor();
  await page.locator('img').evaluateAll(images => images.forEach(img => { img.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
}

async function assertLayout(page, label) {
  const issues = await page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('page overflow');
    const textNodes = [...document.querySelectorAll('p,h1,h2,h3,dt,dd,summary,button,a,span,blockquote')];
    for (const el of textNodes) {
      const style = getComputedStyle(el), box = el.getBoundingClientRect();
      if (!box.width || !box.height || style.visibility === 'hidden' || el.closest('dialog:not([open])') || el.classList.contains('skip-link')) continue;
      if (el.textContent.trim() && el.scrollWidth > el.clientWidth + 2 && style.display !== 'inline') issues.push('text overflow: ' + el.className + ' ' + el.textContent.trim().slice(0, 45));
      if (el.childElementCount === 0 && el.textContent.trim() && parseFloat(style.fontSize) < 13) issues.push('small text: ' + el.className);
      if (style.overflow === 'hidden' && el.scrollHeight > el.clientHeight + 2) issues.push('text clipped: ' + el.className);
    }
    for (const selector of ['.header-top', '.nav-inner', '.category-tabs', '.card-caption', '.section-heading', '.specs > div']) {
      for (const group of document.querySelectorAll(selector)) {
        const children = [...group.children].filter(el => { const r = el.getBoundingClientRect(); return r.width && r.height; });
        for (let i = 0; i < children.length; i++) for (let j = i + 1; j < children.length; j++) {
          const a = children[i].getBoundingClientRect(), b = children[j].getBoundingClientRect();
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) issues.push('overlap: ' + selector);
        }
      }
    }
    return issues;
  });
  assert.deepEqual(issues, [], label);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      for (const [name, route] of [['home', '/'], ['catalog', '/kitchens'], ['model', '/kitchens/models/line']]) {
        await ready(page, route);
        await page.screenshot({ path: path.join(output, `${name}-${width}.png`), fullPage: name !== 'home' });
        if (name === 'home') await page.screenshot({ path: path.join(output, `home-full-${width}.png`), fullPage: true });
      }
      await page.getByRole('button', { name: 'Обсудить эту модель' }).click();
      await page.screenshot({ path: path.join(output, `dialog-${width}.png`) });
      await page.keyboard.press('Escape');
    }
    await ready(page, '/');
    await page.getByRole('button', { name: 'Открыть меню' }).click();
    await page.screenshot({ path: path.join(output, 'menu-390.png') });
    await page.locator('.site-header').screenshot({ path: path.join(output, 'menu-only-390.png') });
    if (phase === 'after') {
      const routes = ['/', '/kitchens', '/kitchens/models/line', '/furniture', '/projects', '/projects/quiet-space', '/customers', '/promotions', '/promotions/season', '/about', '/contacts'];
      for (const width of [360, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        for (const route of routes) { await ready(page, route); await assertLayout(page, `${width}px ${route}`); }
        await ready(page, '/');
        if (await page.locator('.menu-toggle').isVisible()) {
          await page.locator('.menu-toggle').click();
          await assertLayout(page, `menu ${width}px`);
        }
        const nav = page.locator('#main-navigation');
        assert.equal(await nav.isVisible(), true, `navigation ${width}px`);
        const navFonts = await nav.locator('a,button').evaluateAll(items => items.map(el => parseFloat(getComputedStyle(el).fontSize)));
        assert.ok(navFonts.every(size => size >= 15 && size <= 16), `menu font ${width}px`);
        await nav.getByRole('button', { name: 'Обсудить проект' }).click();
        const dialog = page.locator('dialog');
        const box = await dialog.boundingBox();
        assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= width + 1 && box.y + box.height <= 845, `dialog viewport ${width}px`);
        await assertLayout(page, `dialog ${width}px`);
        await page.getByRole('button', { name: 'Понятно', exact: true }).focus();
        const confirmBox = await page.getByRole('button', { name: 'Понятно', exact: true }).boundingBox();
        assert.ok(confirmBox.y >= 0 && confirmBox.y + confirmBox.height <= 845, 'confirm reachable through dialog scroll');
        await page.keyboard.press('Tab');
        // Native modal Tab navigation may visit browser chrome between last and first.
        if (await page.evaluate(() => document.activeElement === document.body)) await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => !!document.activeElement.closest('dialog')), true, 'dialog focus trap');
        await page.keyboard.press('Escape');
        assert.equal(await dialog.evaluate(el => el.open), false);
        console.log(`PASS layout, navigation, dialog and focus: ${width}px`);
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await ready(page, '/');
      await page.locator('.skip-link').focus();
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => { const el = document.activeElement; const s = getComputedStyle(el); return { outline: s.outlineStyle, width: parseFloat(s.outlineWidth) }; });
      assert.equal(focus.outline, 'solid'); assert.ok(focus.width >= 2);
      // 200% browser zoom emulation: half CSS viewport, doubled pixel ratio.
      // This checks both responsive reflow and the enlarged physical rendering.
      for (const physicalWidth of [768, 1024, 1440]) {
        const zoomContext = await browser.newContext({ viewport: { width: physicalWidth / 2, height: 500 }, deviceScaleFactor: 2 });
        const zoomPage = await zoomContext.newPage();
        for (const route of routes) { await ready(zoomPage, route); await assertLayout(zoomPage, `200% ${physicalWidth}px ${route}`); }
        await ready(zoomPage, '/kitchens/models/line');
        await zoomPage.getByRole('button', { name: 'Обсудить эту модель' }).click();
        const dialog = zoomPage.locator('dialog'), box = await dialog.boundingBox();
        assert.ok(box.y >= 0 && box.y + box.height <= 501, 'zoom dialog in viewport');
        assert.ok(await dialog.evaluate(el => el.scrollHeight > el.clientHeight), 'zoom dialog can scroll');
        await zoomPage.getByRole('button', { name: 'Понятно', exact: true }).focus();
        const confirm = await zoomPage.getByRole('button', { name: 'Понятно', exact: true }).boundingBox();
        assert.ok(confirm.y >= 0 && confirm.y + confirm.height <= 501, 'zoom confirm reachable');
        await assertLayout(zoomPage, '200% dialog');
        if (physicalWidth === 1440) await zoomPage.screenshot({ path: path.join(output, 'dialog-zoom-200.png') });
        await zoomPage.keyboard.press('Escape');
        if (physicalWidth === 1440) { await ready(zoomPage, '/kitchens'); await zoomPage.screenshot({ path: path.join(output, 'catalog-zoom-200.png') }); }
        await zoomContext.close();
      }
      console.log('PASS visible keyboard outline and 200% zoom emulation at 768/1024/1440 physical pixels.');
    }
    assert.deepEqual(errors, []);
    console.log(`${phase}: screenshots saved to ${output}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
