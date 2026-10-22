const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_URL || 'http://127.0.0.1:4178/walenza-website/';
const output = path.resolve(__dirname, '../qa-output/review-2026-10-22');
const targets = ['terracotta', 'contour', 'olive', 'oak-room', 'dining'];
async function swipe(frame, dx, dy) {
 await frame.evaluate((element, { dx, dy }) => {
  const start = new Touch({ identifier: 1, target: element, clientX: 250, clientY: 150 });
  const end = new Touch({ identifier: 1, target: element, clientX: 250 + dx, clientY: 150 + dy });
  element.dispatchEvent(new TouchEvent('touchstart', { touches: [start], changedTouches: [start], bubbles: true }));
  element.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [end], bubbles: true }));
 }, { dx, dy });
}
(async () => {
 const browser = await chromium.launch({ headless: true, channel: 'msedge' });
 const errors = [];
 fs.mkdirSync(output, { recursive: true });
 try {
  const page = await browser.newPage({ hasTouch: true });
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [360, 390, 768, 1024, 1440]) {
   await page.setViewportSize({ width, height: 1000 });
   await page.goto(base + '#/'); await page.reload();
   const frame = page.locator('.showcase-frames');
   await frame.waitFor();
   const dots = page.locator('.showcase-dots button');
   assert.equal(await dots.count(), 5);
   await page.locator('.showcase-slide img').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
   await page.waitForFunction(() => [...document.querySelectorAll('.showcase-slide img')].every(image => image.complete && image.naturalWidth));
   const initial = await frame.boundingBox();
   for (let index = 0; index < 5; index++) {
    await dots.nth(index).click();
    assert.equal(await page.locator('.showcase-slide:visible').count(), 1);
    assert.equal(await page.locator('.showcase-dots button[aria-pressed="true"]').count(), 1);
    assert.ok((await page.locator('.showcase-slide:visible .showcase-main-image').getAttribute('src')).endsWith('/' + targets[index] + '.jpg'));
    const target = await page.locator('.showcase-caption a').getAttribute('href');
    assert.equal(target, targets[index] === 'dining' ? '#/kitchens' : '#/kitchens/models/' + targets[index]);
    const current = await frame.boundingBox();
    assert.equal(current.width, initial.width); assert.equal(current.height, initial.height);
    const boxes = await page.locator('.showcase-slide:visible img').evaluateAll(images => images.map(image => image.getBoundingClientRect().toJSON()));
    assert.ok(boxes[1].x >= boxes[0].right + 4);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
   }
   await page.getByRole('button', { name: 'Следующая композиция', exact: true }).click();
   assert.equal(await dots.first().getAttribute('aria-pressed'), 'true');
   await page.getByRole('button', { name: 'Предыдущая композиция', exact: true }).click();
   assert.equal(await dots.last().getAttribute('aria-pressed'), 'true');
   await frame.focus(); await page.keyboard.press('ArrowRight');
   assert.equal(await dots.first().getAttribute('aria-pressed'), 'true');
   await swipe(frame, -100, 5);
   assert.equal(await dots.nth(1).getAttribute('aria-pressed'), 'true');
   await swipe(frame, 5, 160);
   assert.equal(await dots.nth(1).getAttribute('aria-pressed'), 'true');
   await swipe(frame, 100, 5);
   assert.equal(await dots.first().getAttribute('aria-pressed'), 'true');
   if ([390, 1440].includes(width)) {
    await page.locator('.home-showcase h1').click();
    await page.locator('.home-showcase').screenshot({ path: path.join(output, 'home-real-showcase-' + width + '.png') });
   }
   console.log('PASS showcase: 5 compositions, dots/arrows/wrap/keyboard/swipe, vertical scroll, model links and stable frame at ' + width + 'px');
  }
  assert.deepEqual(errors, []);
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
