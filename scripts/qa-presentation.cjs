const {chromium}=require('C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const base=process.argv[2]||'http://127.0.0.1:4178/walenza-website/';const offline=base.startsWith('file:');
const out=path.resolve('qa-output/presentation-2026-10-27');fs.mkdirSync(out,{recursive:true});
const report=[];
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});
for(const width of [1440,1024,768,390]){
 const p=await b.newPage({viewport:{width,height:1000},hasTouch:width<701,reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'#/furniture');
 const go=async route=>{await p.evaluate(async route=>{location.hash=route;await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)},route);await p.waitForTimeout(60);};
 const noOverflow=async()=>assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page overflow');
 const images=async()=>{await p.locator('main img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await p.waitForFunction(()=>[...document.querySelectorAll('main img')].every(e=>e.complete&&e.naturalWidth));};
 await p.evaluate(()=>document.fonts.ready);await p.locator('#wardrobes .storage-more').click();await images();
 const second=p.locator('[data-storage-id=arka]');const secondState=await second.locator('.storage-image').getAttribute('data-state');
 for(const card of await p.locator('.compact-storage-sample').all()){
  const before=await card.boundingBox(),photoBefore=await card.locator('.compact-storage-photo').boundingBox();assert(photoBefore.width>100&&photoBefore.height>100,'Photo must occupy real space');
  await card.getByRole('button',{name:'Внутри',exact:true}).click();assert.equal(await card.getByRole('button',{name:'Внутри',exact:true}).getAttribute('aria-pressed'),'true');const after=await card.boundingBox();assert(Math.abs(after.height-before.height)<1,'Paired image/description must not change card height');const photoAfter=await card.locator('.compact-storage-photo').boundingBox();assert.equal(photoBefore.height,photoAfter.height);
  if(await card.getAttribute('data-storage-id')==='laguna')assert.equal(await second.locator('.storage-image').getAttribute('data-state'),secondState,'Models must switch independently');
  await card.getByRole('button',{name:'Снаружи',exact:true}).click();
  await card.locator('.compact-enlarge').click();assert(await card.locator('dialog').evaluate(e=>e.open));await p.keyboard.press('ArrowRight');await p.keyboard.press('Escape');
 }
 assert.equal(await p.locator('.compact-storage-sample').count(),6);assert.equal(await p.locator('.wardrobe-category-switch a').count(),1);
 const dressing=await p.locator('#dressing .compact-storage-sample').boundingBox(),grid=await p.locator('#dressing .storage-grid').boundingBox();assert(Math.abs(dressing.width-grid.width)<1);
 await go('/furniture');await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(out,`storage-${width}.png`),fullPage:true});await noOverflow();
 await go('/furniture?preview=storage&doors=sliding#wardrobes');assert.equal(await p.locator('#wardrobes [data-storage-id]').count(),0);assert(await p.locator('.wardrobe-category-empty').isVisible());
 await go('/customers#order');await p.locator('.pocket-order-tiles').waitFor();assert.equal(await p.locator('.pocket-tabs > button').count(),5);assert.equal(await p.locator('.pocket-folder-back').count(),5);assert.equal(await p.locator('.pocket-folder-cards > span').count(),15);assert.equal(await p.locator('.buyer-visual-note').count(),0);
 for(const topic of ['payment','delivery','warranty','care','order']){
  await p.locator('#pocket-tab-'+topic).click();await p.waitForTimeout(40);assert.equal(await p.locator('#pocket-tab-'+topic).getAttribute('aria-expanded'),'true');
  if(topic==='care'){assert.equal(await p.locator('.pocket-care-tiles button').count(),8);await p.locator('.pocket-care-tiles button').last().click();}
  if(topic==='order'){assert.equal(await p.locator('.pocket-order-tiles button').count(),7);if(width===1440)assert.equal((await p.locator('.pocket-order-tiles').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)),12);await p.locator('.pocket-order-tiles button').last().click();}
  if(topic==='delivery')await p.locator('.pocket-subsections details').evaluateAll(es=>es.forEach(e=>e.open=true));
  await noOverflow();const panel=await p.locator('.pocket-panel').boundingBox(),row=await p.locator('.pocket-tabs').boundingBox();assert(panel.y>=row.y+row.height,'Panel must follow pockets');
  if([390,1440].includes(width)&&['care','order','payment'].includes(topic))await p.locator('.customer-pocket').screenshot({path:path.join(out,`pocket-${topic}-${width}.png`)});
 }
 await p.locator('#pocket-tab-care').click();if(width===390){const r=await p.locator('.pocket-tabs').boundingBox(),selected=await p.locator('#pocket-tab-care').boundingBox();assert(selected.x>=r.x-1&&selected.x+selected.width<=r.x+r.width+1,'Selected pocket is scrolled into view');}
 await p.locator('.pocket-faq-card summary').first().click();assert(await p.locator('.pocket-faq-card').first().evaluate(e=>e.open));await p.locator('.pocket-collapse').click();assert(await p.locator('.pocket-panel-clip').evaluate(e=>e.inert));
 await go('/customers#order');await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(out,`buyers-${width}.png`),fullPage:true});
 await go('/projects');await p.locator('.project-preview-card').waitFor();await images();assert.equal(await p.locator('.project-preview-card').count(),1);assert.equal(await p.locator('video').count(),1);
 const main=p.locator('.project-preview-photo > img'),before=await main.getAttribute('src');await p.locator('.project-preview-thumbnails button').last().click();assert.notEqual(await main.getAttribute('src'),before);await p.locator('.project-preview-thumbnails button').first().click();
 assert.equal(await p.locator('.customer-review-card').count(),3);assert.equal(await p.locator('.customer-review-card[aria-hidden=false]').count(),width<701?1:3);
 assert.equal(await p.locator('.customer-review-controls > button').count(),width<701?2:0);
 if(width<701){await p.getByRole('button',{name:'Следующие отзывы',exact:true}).click();await p.waitForTimeout(50);assert.equal(await p.locator('.customer-review-card[aria-hidden=false]').getAttribute('data-review-id'),'rimma');await p.getByRole('button',{name:'Отзыв 3: Андрей'}).click();await p.waitForTimeout(50);assert.equal(await p.locator('.customer-review-card[aria-hidden=false]').getAttribute('data-review-id'),'andrey');await p.getByRole('button',{name:'Отзыв 1: Виктория'}).click();await p.waitForTimeout(50);}
 const names=await p.locator('.customer-review-card > p').allTextContents();assert.deepStrictEqual(names,['Виктория','Римма','Андрей']);
 const edge=await p.locator('.customer-review-pocket-edge').boundingBox();for(const name of await p.locator('.customer-review-card[aria-hidden=false] > p').all()){const r=await name.boundingBox();assert(r.y+r.height<=edge.y,'Pocket must not hide reviewer names');}
 await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(out,`projects-${width}.png`),fullPage:true});
 await p.locator('.project-preview-photo').click();await p.locator('.journal-gallery').waitFor();assert.equal(await p.locator('.journal-gallery img').count(),3);assert.equal(await p.locator('.project-video-compact').count(),1);await p.locator('video').evaluate(async e=>{e.muted=true;await e.play()});await p.waitForFunction(()=>document.querySelector('video').currentTime>.1);await p.locator('video').evaluate(e=>e.pause());
 await p.getByRole('button',{name:'Оставить заявку',exact:true}).first().click();assert(await p.locator('.contact-dialog').evaluate(e=>e.open));await p.keyboard.press('Escape');await noOverflow();
 if(!offline){
  // Temporary in-memory data only. No test review is written into source or production assets.
  await p.evaluate(async()=>{const url=performance.getEntriesByType('resource').find(e=>e.name.includes('/src/data/content.ts')).name;const source=await import(url);window.__reviewTestSource=source;source.reviews.push({...source.reviews[1],id:'temporary-fourth',text:Array(7).fill(source.reviews[1].text).join(' ')});});
  try{await go('/projects');await p.locator('[data-review-id=temporary-fourth]').waitFor();assert.equal(await p.locator('.customer-review-card').count(),4);assert.equal(await p.locator('.customer-review-controls > button').count(),2);await p.getByRole('button',{name:'Следующие отзывы',exact:true}).click();await p.waitForTimeout(50);if(width>=701)assert.equal(await p.locator('[data-review-id=temporary-fourth]').getAttribute('aria-hidden'),'false');else{await p.getByRole('button',{name:'Отзыв 4: Римма'}).click();await p.waitForTimeout(50);}
   const text=p.locator('[data-review-id=temporary-fourth] blockquote'),name=p.locator('[data-review-id=temporary-fourth] > p'),front=await p.locator('.customer-review-pocket-edge').boundingBox();const tr=await text.boundingBox(),nr=await name.boundingBox();assert(tr.y+tr.height<nr.y&&nr.y+nr.height<=front.y);await noOverflow();await p.locator('.customer-reviews-shelf').screenshot({path:path.join(out,`temporary-fourth-${width}.png`)});
  }finally{await p.evaluate(()=>{const source=window.__reviewTestSource;source.reviews.splice(source.reviews.findIndex(r=>r.id==='temporary-fourth'),1);delete window.__reviewTestSource;});}
  await go('/');await go('/projects');assert.equal(await p.locator('.customer-review-card').count(),3);
 }
 assert.equal(errors.length,0,errors.join('\n'));report.push({width,stablePhotoFrames:true,independentModels:true,dressingFullWidth:true,fiveLayeredPockets:true,orderAndCare:true,oneRealProject:true,linkedVideo:true,threeOriginalReviews:true,temporaryFourthRemoved:!offline,noOverflow:true});await p.close();console.log('PASS '+width);
}
await b.close();fs.writeFileSync(path.join(out,`checks${offline?'-offline':''}.json`),JSON.stringify(report,null,2));})().catch(e=>{console.error(e);process.exit(1)});
