const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_URL || 'http://127.0.0.1:4178/walenza-website/';
const output = path.resolve(__dirname, '../qa-output/review-2026-10-22');
const go = async (page, route) => { await page.goto(base + '#' + route); await page.locator('h1').waitFor(); };
const stages = ['Консультация', 'Предварительный проект', 'Замер', 'Согласование деталей', 'Договор', 'Производство', 'Доставка и монтаж'];
const reviewTexts = ['Шикарная, ребята вчера всё установили. Я в восторге, спасибо вам!', 'Шкаф и комод установили, я ещё не видела, но сын сказал — мощно, спасибо большое!', 'С заказом всё отлично, спасибо большое. Пользуемся'];
(async () => {
 const browser = await chromium.launch({ headless: true, channel: 'msedge' });
 const errors = [];
 fs.mkdirSync(output, { recursive: true });
 try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await go(page, '/');
  assert.deepEqual(await page.locator('.real-review > p').allTextContents(), ['Виктория', 'Римма', 'Андрей']);
  assert.deepEqual(await page.locator('.real-review blockquote').allTextContents(), reviewTexts.map(text => '«' + text + '»'));
  assert.equal(await page.locator('.real-review img,.real-review .demo-label,.real-review video').count(), 0);
  assert.equal(await page.locator('.order-preview li').count(), 3);
  await go(page, '/about');
  assert.deepEqual(await page.locator('.team-card h3').allTextContents(), ['Анна Ярошинская', 'Татьяна Комарова']);
  assert.equal(await page.locator('.team-portrait img').count(), 2);
  await page.waitForFunction(() => [...document.querySelectorAll('.team-portrait img')].every(img => img.complete && img.naturalWidth > 0));
  assert.deepEqual(await page.locator('.team-card > p').allTextContents(), ['Руководитель салона', 'Руководитель салона']);
  assert.ok((await page.locator('.salon-experience').innerText()).includes('не возраст московского салона'));
  assert.equal(await page.locator('.benefit-grid article').count(), 6);
  assert.ok((await page.locator('.factory-draft-visual figcaption').innerText()).includes('Сгенерированное изображение'));
  assert.ok((await page.locator('.factory-copy').innerText()).includes('Ульяновске'));
  assert.ok(!/3\s?500|3500|собственная фабрика/i.test(await page.locator('.about-page').innerText()));
  await go(page, '/customers#order');
  assert.equal(await page.locator('.visual-topic-grid > a').count(), 5);
  assert.deepEqual(await page.locator('.order-timeline h3').allTextContents(), stages);
  await page.locator('#order').getByRole('button', { name: 'Обсудить проект', exact: true }).click();
  assert.ok((await page.locator('.request-context').innerText()).includes('порядка заказа'));
  await page.keyboard.press('Escape');
  await go(page, '/customers#payment');
  assert.equal(await page.locator('#payment .buyer-conditions li').count(), 5);
  assert.ok((await page.locator('#payment').innerText()).includes('от 30%'));
  await go(page, '/customers#delivery');
  assert.ok((await page.locator('#delivery').innerText()).includes('21–45 рабочих дней'));
  await go(page, '/customers#warranty-care');
  assert.deepEqual(await page.locator('.warranty-facts strong').allTextContents(), ['2 года', 'Более 15 лет']);
  assert.ok((await page.locator('#warranty-care').innerText()).includes('не продлевает гарантию'));
  await page.locator('.visual-topic-grid a[href$="#care"]').click();
  await page.waitForFunction(() => document.getElementById('care').open);
  assert.equal(await page.locator('#care .buyer-conditions li').count(), 3);
  assert.equal(await page.locator('.faq details').count(), 10);
  for (const detail of await page.locator('.faq details').all()) { await detail.locator('summary').click(); assert.equal(await detail.getAttribute('open'), ''); }
  await go(page, '/contacts');
  assert.deepEqual(await page.locator('.contacts-page a[href^="mailto:"]').evaluateAll(links => links.map(link => link.getAttribute('href'))), ['mailto:adorisanna@mail.ru', 'mailto:mxralex24@mail.ru']);
  assert.ok((await page.locator('.address-data').innerText()).includes('Интерьер Холл'));
  assert.ok((await page.locator('.address-data').innerText()).includes('Мебель Рум'));
  assert.equal(await page.locator('.contacts-page a[href*="wa.me"],.contacts-page a[href*="t.me"],.contacts-page a[href*="max.ru"]').count(), 0);
  await page.getByRole('button', { name: 'Записаться в салон', exact: true }).click();
  assert.equal(await page.locator('#contact-dialog-title').innerText(), 'Записаться в салон');
  assert.ok((await page.locator('#contact-dialog-description').innerText()).includes('не подключены'));
  assert.equal(await page.locator('dialog form,dialog input').count(), 0);
  await page.keyboard.press('Escape');
  await go(page, '/projects');
  assert.equal(await page.locator('.project-card .demo-label').count(), 0);
  assert.equal(await page.locator('.project-card').count(), 1);
  assert.ok((await page.locator('.page-heading').innerText()).includes('Реальная мебель')); 
  for (const width of [360, 390, 768, 1024, 1440]) {
   await page.setViewportSize({ width, height: 900 });
   for (const [name, route] of [['about', '/about'], ['order', '/customers#order'], ['payment', '/customers#payment'], ['warranty', '/customers#warranty-care'], ['care', '/customers#care'], ['contacts', '/contacts']]) {
    await go(page, route);
    if (route.includes('#')) await page.waitForFunction(id => document.getElementById(id)?.open, route.split('#')[1]);
    const issues = await page.evaluate(() => {
     const found = []; if (document.documentElement.scrollWidth > innerWidth + 1) found.push('page overflow');
     for (const element of document.querySelectorAll('main h1,main h2,main h3,main p,main li,main button,main summary')) {
      if (element.getBoundingClientRect().height && element.scrollWidth > element.clientWidth + 3) found.push('text overflow: ' + element.textContent.slice(0, 45));
     }
     return found;
    }); assert.deepEqual(issues, [], width + ' ' + route);
    if ([390, 1440].includes(width)) { await page.locator('h1').click(); await page.screenshot({ path: path.join(output, 'content-' + name + '-' + width + '.png'), fullPage: true }); }
   }
   await go(page, '/contacts'); await page.getByRole('button', { name: 'Записаться в салон', exact: true }).click();
   const box = await page.locator('dialog').boundingBox(); assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= width + 1 && box.y + box.height <= 901);
   await page.getByRole('button', { name: 'Понятно', exact: true }).focus(); const close = await page.getByRole('button', { name: 'Понятно', exact: true }).boundingBox(); assert.ok(close.y >= 0 && close.y + close.height <= 901);
   await page.keyboard.press('Escape');
   console.log('PASS content at ' + width + 'px: seven steps, conditions, team, real reviews, email/phone/visit, FAQ and real portfolio.');
  }
  assert.deepEqual(errors, []);
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
