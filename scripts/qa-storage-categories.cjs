const {chromium}=require('C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('assert'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const out=path.resolve('qa-output/storage-categories');
const base=pathToFileURL(path.resolve('review/WALENZA-storage-categories.html')).href;
const before=JSON.parse(fs.readFileSync(path.join(out,'before.json'),'utf8'));
// Existing mobile CSS hides the desktop-only hint. Compare substantive copy and image hashes.
const normalize=cards=>cards.map(card=>({...card,text:card.text.replace(' · Нажмите на фото для переключения',''),images:card.images.map(src=>require('crypto').createHash('sha256').update(src).digest('hex'))}));
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge'});const results=[];
 for(const width of [360,390,768,1440]){
  const p=await b.newPage({viewport:{width,height:1000},hasTouch:width<701});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'#/furniture#wardrobes');await p.locator('.wardrobe-category-switch').waitFor();await p.evaluate(()=>document.fonts.ready);
  assert.equal(await p.locator('.wardrobe-category-switch a').count(),1);assert.equal(await p.locator('.wardrobe-category-switch [aria-current]').innerText(),'Распашные шкафы');
  await p.locator('#wardrobes .storage-more').click();
  const after=await p.locator('[data-storage-id]').evaluateAll(es=>es.map(e=>({id:e.dataset.storageId,text:e.innerText,images:[...e.querySelectorAll('img')].map(i=>i.src)})));
  assert.deepStrictEqual(normalize(after),normalize(before),'All six card texts, images and order must remain unchanged');
  const dressingText=await p.locator('#dressing').innerText();
  const first=p.locator('[data-storage-id=laguna]');await first.getByRole('button',{name:'Наполнение',exact:true}).click();assert.equal(await first.getByRole('button',{name:'Наполнение',exact:true}).getAttribute('aria-pressed'),'true');await first.getByRole('button',{name:'Фасады',exact:true}).click();
  await p.goto(base+'#/furniture?doors=sliding#wardrobes');assert.equal(await p.locator('.wardrobe-category-switch a').count(),1);assert.equal(await p.locator('.wardrobe-category-empty').count(),0);assert(await p.locator('[data-storage-id=laguna]').isVisible());
  await p.goto(base+'#/furniture?preview=storage#wardrobes');await p.locator('.wardrobe-category-switch a').last().waitFor();assert.equal(await p.locator('.wardrobe-category-switch a').count(),2);
  await p.locator('#wardrobes img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await p.waitForFunction(()=>[...document.querySelectorAll('#wardrobes img')].every(e=>e.complete&&e.naturalWidth>0));
  if([390,1440].includes(width))await p.locator('.wardrobe-categories').screenshot({path:path.join(out,`hinged-${width}.png`)});
  const sliding=p.locator('.wardrobe-category-switch a').last();await sliding.focus();await p.keyboard.press('Enter');await p.locator('.wardrobe-category-empty').waitFor();assert.equal(await p.locator('#wardrobes [data-storage-id]').count(),0);assert.equal(await p.locator('.wardrobe-category-switch [aria-current]').innerText(),'Шкафы-купе');assert.equal(await p.locator('#dressing').innerText(),dressingText);
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if([390,1440].includes(width))await p.locator('.wardrobe-categories').screenshot({path:path.join(out,`sliding-preview-${width}.png`)});
  await p.goBack();await p.locator('[data-storage-id=laguna]').waitFor();assert.equal(await p.locator('.wardrobe-category-switch [aria-current]').innerText(),'Распашные шкафы');
  await p.locator('.storage-navigation a').nth(1).click();assert(p.url().endsWith('#dressing'));assert.equal(await p.locator('#dressing').innerText(),dressingText);
  await p.getByRole('button',{name:'Открыть меню',exact:true}).click();const menu=p.locator('.journal-menu-dialog');await menu.getByRole('link',{name:'Шкафы и мебель',exact:false}).click();await p.locator('.wardrobe-category-switch').waitFor();assert.equal(await p.locator('.wardrobe-category-switch a').count(),1);assert.equal(await p.locator('.wardrobe-category-switch [aria-current]').innerText(),'Распашные шкафы');assert(!(await menu.evaluate(e=>e.open)));
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(errors.length,0,errors.join('\n'));
  results.push({width,unchangedCards:6,publicSlidingHidden:true,previewSwitch:true,dressingUnchanged:true,menu:true,mobileNoOverflow:true});await p.close();
 }
 await b.close();fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
