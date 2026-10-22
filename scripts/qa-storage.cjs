const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_URL || 'http://127.0.0.1:4178/walenza-website/';
const output = path.resolve(__dirname, '../qa-output/review-2026-10-22');
const ids = ['laguna', 'arka', 'texture', 'silhouette', 'orbita', 'gallery'];
const cardFor = (page, id) => page.locator(`[data-storage-id="${id}"]`);
async function imagesReady(page) {
 await page.locator('img').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
 await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
}

(async () => {
 const browser = await chromium.launch({ headless: true, channel: 'msedge' });
 const errors = [];
 fs.mkdirSync(output, { recursive: true });
 try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [360, 390, 768, 1024, 1440]) {
   await page.setViewportSize({ width, height: 900 });
   await page.goto(base + '#/furniture'); await page.reload();
   await cardFor(page, 'laguna').waitFor();
   assert.equal(await page.locator('#wardrobes .storage-card').count(), 2);
   assert.equal(await page.locator('#dressing .storage-card').count(), 1);
   await page.locator('.storage-more').click();
   await page.waitForFunction(() => document.querySelectorAll('#wardrobes .storage-card').length === 5);
   assert.equal(await cardFor(page, 'texture').locator('.storage-image').evaluate(el => el === document.activeElement), true);
   assert.equal(await page.locator('.storage-more').count(), 0);
   await imagesReady(page);
   for (const id of ids) {
    const card = cardFor(page, id), image = card.locator('.storage-image');
    const before = await image.boundingBox();
    await image.click();
    await page.waitForFunction(key => document.querySelector(`[data-storage-id="${key}"] .storage-image`).dataset.state === 'interior', id);
    assert.equal(await card.getByRole('button', { name: 'Наполнение', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await card.locator('.storage-image img[aria-hidden="false"]').count(), 1);
    const after = await image.boundingBox();
    assert.equal(after.height, before.height); assert.equal(after.width, before.width);
    await card.getByRole('button', { name: 'Фасады', exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await image.getAttribute('data-state'), 'facades');
    await image.focus(); await page.keyboard.press('Space');
    assert.equal(await image.getAttribute('data-state'), 'interior');
    await image.click();
    assert.equal(await image.getAttribute('data-state'), 'facades');
   }
   await cardFor(page, 'laguna').locator('.storage-image').click();
   assert.equal(await cardFor(page, 'arka').locator('.storage-image').getAttribute('data-state'), 'facades');
   for (const id of ['orbita', 'gallery']) {
    await cardFor(page, id).locator('.storage-extra summary').click();
    assert.equal(await cardFor(page, id).locator('.storage-extra').getAttribute('open'), '');
   }
   for (const id of ['laguna', 'gallery']) {
    const card = cardFor(page, id);
    const title = await card.locator('h3').innerText();
    await card.locator('.storage-copy > button').click();
    assert.ok((await page.locator('.request-context').innerText()).includes(title));
    await page.keyboard.press('Escape');
   }
   const issues = await page.evaluate(() => {
    const found = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) found.push('page overflow');
    for (const element of document.querySelectorAll('.storage-card h3,.storage-card p,.storage-card button,.storage-card summary')) {
     if (element.getBoundingClientRect().height && element.scrollWidth > element.clientWidth + 2) found.push('text overflow: ' + element.textContent);
    }
    return found;
   }); assert.deepEqual(issues, [], width + 'px');
   if ([390, 1440].includes(width)) {
    await page.locator('#wardrobes-title').click();
    await page.locator('#wardrobes .storage-card').first().screenshot({ animations: 'disabled', path: path.join(output, `storage-open-${width}.png`) });
    await cardFor(page, 'laguna').locator('.storage-image').click();
    await page.locator('#wardrobes-title').click();
    await page.locator('#wardrobes .storage-card').first().screenshot({ animations: 'disabled', path: path.join(output, `storage-closed-${width}.png`) });
    await page.locator('#dressing').screenshot({ animations: 'disabled', path: path.join(output, `dressing-${width}.png`) });
   }
   console.log('PASS storage: five wardrobes, one dressing, independent states, fixed image size, keyboard, more, alternate angles and context at ' + width + 'px');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await cardFor(page, 'laguna').locator('.storage-image img').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  assert.deepEqual(errors, []);
  console.log('PASS reduced motion; no storage JavaScript errors.');
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
