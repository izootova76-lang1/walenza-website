// Dev-only integration check. Fixtures exist only in this browser tab's memory.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.QA_URL || 'http://127.0.0.1:4178/walenza-website/';

(async () => {
 const browser = await chromium.launch({ headless: true, channel: 'msedge' });
 const page = await browser.newPage();
 const dataUrl = new URL('src/data/content.ts', base).href;
 try {
  await page.goto(base + '#/kitchens');
  await page.locator('h1').waitFor();
  const result = await page.evaluate(async url => {
   const data = await import(url);
   const { models, manufacturers, catalogGroups, selectCatalogModels, primaryCatalogGroupId } = data;
   if (models.some(model => model.manufacturerId !== null)) throw Error('Demo model claims a factory');
   if (new Set(models.map(model => model.id)).size !== models.length) throw Error('Duplicate model IDs');
   if (models.some(model => !catalogGroups.some(group => group.id === model.catalogGroupId))) throw Error('Missing catalog group');
   const originalCount = selectCatalogModels(primaryCatalogGroupId).length;
   catalogGroups.push({ id: '__qa-other', title: 'QA only' });
   manufacturers.push({ id: '__qa-factory', name: 'Тестовая фабрика (QA)' });
   models.push(
    { ...models[0], id: '__qa-other-a', catalogGroupId: '__qa-other', manufacturerId: '__qa-factory', title: 'QA other A' },
    { ...models[1], id: '__qa-other-b', catalogGroupId: '__qa-other', manufacturerId: null, title: 'QA other B' },
   );
   return {
    originalCount,
    mainCount: selectCatalogModels(primaryCatalogGroupId).length,
    otherIds: selectCatalogModels('__qa-other').map(model => model.id),
    unknownCount: selectCatalogModels('__qa-unknown').length,
   };
  }, dataUrl);
  assert.equal(result.mainCount, result.originalCount);
  assert.deepEqual(result.otherIds, ['__qa-other-a', '__qa-other-b']);
  assert.equal(result.unknownCount, 0);
  // Force an ordinary route update so the mounted catalogue recalculates its counts.
  await page.goto(base + '#/kitchens?shown=18');
  await page.getByRole('link', { name: /Арфа/ }).waitFor();
  assert.equal(await page.locator('.model-card').count(), result.originalCount);
  assert.equal(await page.locator('.collection-buttons button').first().locator('span').innerText(), String(result.originalCount));
  assert.equal(await page.getByRole('link', { name: /QA other/ }).count(), 0);
  await page.goto(base + '#/kitchens/models/arfa');
  await page.locator('h1').waitFor();
  assert.equal(await page.locator('.specs dt').filter({ hasText: /^Производитель$/ }).count(), 0);
  assert.equal(await page.getByRole('link', { name: /QA other/ }).count(), 0);
  await page.goto(base + '#/kitchens/models/__qa-other-a');
  await page.getByRole('heading', { level: 1, name: 'QA other A' }).waitFor();
  assert.equal(await page.locator('.specs dd').filter({ hasText: 'Тестовая фабрика (QA)' }).count(), 1);
  assert.deepEqual(await page.locator('.model-card h3').allTextContents(), ['QA other B']);
  console.log('PASS: unassigned demo factories; group isolation in catalogue, counts and related models; manufacturer lookup; existing detail routes.');
 } finally {
  await page.evaluate(async url => {
   const data = await import(url);
   for (const items of [data.models, data.manufacturers, data.catalogGroups]) {
    for (let i = items.length - 1; i >= 0; i--) if (items[i].id.startsWith('__qa-')) items.splice(i, 1);
   }
  }, dataUrl).catch(() => {});
  await browser.close();
 }
})().catch(error => { console.error(error); process.exit(1); });
