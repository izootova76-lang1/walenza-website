/* Browser QA: install Playwright separately if needed, then:
   $env:PLAYWRIGHT_MODULE = 'absolute/path/to/playwright'
   $env:QA_URL = 'http://127.0.0.1:4173/walenza-website/'
   node scripts/qa.cjs
   Uses Microsoft Edge on Windows. No dependency is added to the application.
*/
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const base = (process.env.QA_URL || 'http://127.0.0.1:4173/walenza-website/').replace(/\/?$/, '/');
  const routeUrl = route => base + '#' + route;
  const output = path.resolve(__dirname, '../qa-output');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
    const routes = ['/', '/kitchens', '/kitchens?category=straight', '/kitchens?category=corner', '/kitchens?category=island', '/kitchens/models/line', '/kitchens/models/balance', '/kitchens/models/rhythm', '/furniture', '/projects', '/projects/quiet-space', '/projects/everyday-order', '/customers', '/promotions', '/promotions/season', '/promotions/collection', '/about', '/contacts', '/missing', '/kitchens/models/missing', '/projects/missing', '/promotions/missing'];
    const internalLinks = new Set();
    for (const route of routes) {
      const navigationResponse = await page.goto(routeUrl(route));
      // Hash-only changes stay in the document. Reload also verifies shared deep links.
      const response = navigationResponse || await page.reload();
      assert.equal(response.status(), 200, route);
      await page.locator('h1').waitFor();
      assert.equal(await page.locator('h1').count(), 1, 'one h1: ' + route);
      assert.equal(await page.locator('form,input,textarea').count(), 0, 'no data collection: ' + route);
      assert.equal(await page.locator('.review-notice').innerText(), 'Предварительная версия сайта. Структура и наполнение находятся на согласовании');
      await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
      await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
      assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), 'images: ' + route);
      for (const href of await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
        const routeHref = new URL(href, page.url()).hash.slice(1);
        if (routeHref.startsWith('/') && !routeHref.includes('#')) internalLinks.add(routeHref);
        assert.ok(!/^(https?:|tel:|mailto:)/.test(href), 'no unconfirmed external contact: ' + href);
      }
    }
    console.log('Routes and assets checked. Checking interactive scenarios…');
    for (const href of internalLinks) assert.ok(routes.includes(href), 'covered link: ' + href);
    await page.goto(routeUrl('/'));
    await page.getByRole('link', { name: 'Найти свою кухню' }).click();
    await page.getByRole('button', { name: 'Угловые', exact: true }).click();
    assert.ok(page.url().endsWith('/kitchens?category=corner'));
    assert.equal(await page.locator('.model-card').count(), 1);
    await page.locator('.model-card').click();
    assert.ok(page.url().endsWith('/kitchens/models/balance'));
    await page.reload();
    await page.getByRole('heading', { name: 'Баланс', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Обсудить эту модель' }).click();
    assert.equal(await page.locator('dialog').evaluate(dialog => dialog.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').evaluate(dialog => dialog.open), false);
    await page.goBack();
    assert.equal(await page.getByRole('button', { name: 'Угловые', exact: true }).getAttribute('aria-pressed'), 'true');
    await page.goto(routeUrl('/furniture'));
    await page.getByRole('link', { name: 'Гардеробные', exact: true }).click();
    assert.ok(page.url().endsWith('/furniture#dressing'));
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'dressing');
    const anchorUrl = page.url();
    await page.locator('.skip-link').focus();
    await page.locator('.skip-link').click();
    assert.equal(page.url(), anchorUrl, 'skip link preserves route');
    await page.goto(routeUrl('/customers'));
    await page.locator('.faq summary').first().click();
    assert.equal(await page.locator('.faq details').first().getAttribute('open'), '');
    for (const width of [1440, 800, 390, 320]) {
      console.log(`Checking viewport ${width}px…`);
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes.slice(0, 18)) {
        await page.goto(routeUrl(route));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow: ${width} ${route}`);
      }
      if (width === 1440 || width === 390) {
        await page.goto(routeUrl('/'));
        await page.screenshot({ path: path.join(output, `home-${width}.png`), fullPage: true });
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(routeUrl('/'));
    const toggle = page.getByRole('button', { name: 'Открыть меню' });
    assert.equal(await toggle.isVisible(), true);
    await toggle.click();
    assert.equal(await page.locator('#main-navigation').isVisible(), true);
    await page.locator('#main-navigation').getByRole('link', { name: 'Контакты', exact: true }).click();
    assert.ok(page.url().endsWith('/contacts'));
    assert.equal(await page.locator('#main-navigation').isVisible(), false);
    await page.locator('.contact-methods button').filter({ hasText: 'Telegram' }).click();
    assert.equal(await page.locator('dialog').evaluate(dialog => dialog.open), true);
    await page.getByRole('button', { name: 'Понятно', exact: true }).click();
    assert.equal(await page.locator('dialog').evaluate(dialog => dialog.open), false);
    assert.deepEqual(errors, []);
    console.log(`PASS: ${routes.length} routes, ${internalLinks.size} internal links, categories/history, model/contact dialog, FAQ, mobile menu, images, 320–1440px, no forms or JS errors.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
