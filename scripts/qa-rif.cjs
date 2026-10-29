const { chromium } = require('C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs'), path = require('path'), assert = require('assert');
const out = path.resolve('qa-output/rif-gallery-v2'); fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const base=process.argv[2]||'http://127.0.0.1:4178/walenza-website/'; const offline=base.startsWith('file:'); const results=[];
 for(const [width,height] of [[360,740],[390,900],[390,667],[768,900],[1024,900],[1440,900]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<761}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'#/kitchens/models/rif?return=%2Fkitchens%3Fshown%3D12');if(!offline)assert.equal(response.status(),200);
  const root=page.locator('.rif-prototype');await root.waitFor();await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.querySelectorAll('.rif-prototype img')].every(i=>i.complete&&i.naturalWidth>0));
  assert.equal(await root.locator('.rif-thumbnails button').count(),4);
  const sources=await root.locator('.rif-thumbnails img').evaluateAll(es=>es.map(e=>e.getAttribute('src')));assert.equal(new Set(sources).size,1);assert.equal(sources.length,3);
  assert(!/Blum|Boyard|RAL|Тиффани|7016|6034|уточняется/.test(await root.innerText()));
  await root.getByRole('button',{name:'Фасад',exact:true}).click();assert((await root.locator('.rif-photo-caption').innerText()).includes('фрагмент'));
  const crop=await root.locator('.rif-main-photo .is-cropped img').evaluate(img=>{const b=img.getBoundingClientRect();return Math.abs(b.width/b.height-img.naturalWidth/img.naturalHeight)});assert(crop<.002);
  await root.getByRole('button',{name:'Увеличить изображение кухни',exact:true}).click();const gallery=root.locator('.rif-gallery-dialog');assert(await gallery.evaluate(e=>e.open));
  await page.keyboard.press('ArrowRight');assert((await gallery.locator('h2').innerText()).includes('витрина'));
  await page.keyboard.press('ArrowRight');assert((await gallery.locator('h2').innerText()).includes('общий вид'));await page.keyboard.press('Escape');
  await root.getByRole('button',{name:'Второй ракурс — нужна визуализация',exact:true}).click();assert((await root.locator('.rif-missing-frame').innerText()).includes('Нужна дополнительная визуализация'));assert.equal(await root.locator('.rif-main-photo img').count(),0);
  await root.getByRole('button',{name:'Общий вид',exact:true}).click();const before=await root.locator('.rif-main-photo').innerHTML();
  const light=root.getByRole('button',{name:'Рассмотреть: Риф — светлый образец',exact:true});if(width<761)await light.tap();else await light.click();const dialog=root.locator('.rif-sample-dialog');assert(await dialog.evaluate(e=>e.open));
  assert.equal(await dialog.locator('h2').innerText(),'Риф');
  await dialog.getByRole('button',{name:'Увеличить рельеф',exact:true}).click();assert(await dialog.locator('.rif-sample-inspect').evaluate(e=>e.scrollHeight>e.clientHeight||e.scrollWidth>e.clientWidth));
  await dialog.getByRole('button',{name:'Тёмный образец',exact:true}).click();assert.equal(await dialog.getByRole('button',{name:'Тёмный образец',exact:true}).getAttribute('aria-pressed'),'true');assert.equal(await root.locator('.rif-main-photo').innerHTML(),before);
  const bounds=await dialog.evaluate(e=>{const b=e.getBoundingClientRect();return {width:b.width,height:b.height,top:b.top,bottom:b.bottom,scroll:e.scrollHeight>e.clientHeight+1}});
  assert(bounds.width<=320);assert(bounds.top>=0&&bounds.bottom<=height);assert(!bounds.scroll);
  if([390,1440].includes(width)&&height===900){await dialog.screenshot({path:path.join(out,`sample-${width}.png`)});}
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Рассмотреть: Риф — светлый образец');
  await root.getByRole('button',{name:'Оставить заявку',exact:true}).click();assert((await page.locator('dialog[open]').innerText()).includes('Кухня «Риф»'));await page.keyboard.press('Escape');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if([390,1440].includes(width)&&height===900){await root.locator('h1').click();await root.screenshot({path:path.join(out,`rif-${width}.png`)});}
  assert.equal(errors.length,0,errors.join('\n'));results.push({width,height,gallerySlots:4,availableImages:3,secondAngleMissing:true,sameSource:true,sampleDialog:bounds,contextPreserved:true});await page.close();
 }
 const page=await browser.newPage();await page.goto(base+'#/kitchens/models/golden-stripe');await page.locator('.compact-kitchen-layout').waitFor();assert.equal(await page.locator('.rif-prototype').count(),0);await page.goto(base+'#/furniture');await page.locator('.compact-storage-sample[data-storage-id=laguna]').waitFor();assert.equal(await page.locator('.rif-prototype').count(),0);
 await browser.close();fs.writeFileSync(path.join(out,`checks${offline?'-offline':''}.json`),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
