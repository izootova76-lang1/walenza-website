const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {pathToFileURL}=require('node:url');const path=require('node:path');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const context=await browser.newContext({offline:true,viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const file=pathToFileURL(path.resolve(__dirname,'../review/WALENZA-preview.html')).href;
 for(const route of ['/','/kitchens','/materials','/customers#payment','/contacts']){await page.goto(file+'#'+route);await page.locator('h1').waitFor();await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route);}
 await page.goto(file+'#/kitchens');await page.locator('.collection-mobile select').selectOption('art-deco');await page.waitForFunction(()=>document.querySelectorAll('.model-card').length===2);await page.locator('.model-card').first().click();await page.getByRole('button',{name:'Хочу похожую кухню'}).click();assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);await page.keyboard.press('Escape');await page.locator('.breadcrumbs a').click();assert.ok(page.url().includes('collection=art-deco'));
 await page.goto(file+'#/materials');await page.locator('.material-card').first().click();await page.locator('.material-examples article').first().waitFor();assert.equal(await page.locator('.material-examples article').count(),3);
 await page.getByRole('button',{name:'Закрыть примеры'}).click();await page.waitForFunction(()=>!document.querySelector('.material-examples'));
 assert.deepEqual(errors,[]);console.log('PASS: standalone HTML in offline browser; images, routes, filters, model return, material expansion, buyer deep link and contact dialog.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
