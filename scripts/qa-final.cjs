const {chromium}=require('C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert'),{pathToFileURL}=require('url');
const out=path.resolve('qa-output/final');fs.mkdirSync(out,{recursive:true});
const base=process.argv[2]||pathToFileURL(path.resolve('review/WALENZA-review.html')).href;
const models=['terracotta','olive','oak-room','contour','graphite','arfa','brooklyn','street','villa','rif','golden-stripe','scandinavia','verona'];
const routes=['/','/kitchens','/furniture','/customers','/about','/materials','/projects','/projects/quiet-space','/contacts','/promotions','/promotions/season','/promotions/collection',...models.map(id=>'/kitchens/models/'+id)];
const checks=[],issues=[],links=new Set();
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge'});
 for(const width of [1440,1024,768,390,360]){
  const p=await b.newPage({viewport:{width,height:1000},hasTouch:width<761});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  // External map is an internet dependency, not an offline prototype asset.
  await p.route(/^https?:/,route=>/^https?:/.test(base)&&route.request().url().startsWith(new URL(base).origin)?route.continue():route.abort());
  await p.goto(base+'#/');
  const go=async route=>{await p.evaluate(async route=>{location.hash=route;await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)},route);await p.locator('main h1').waitFor();};
  const overflow=async route=>{const state=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('#main *')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&s.position!=='absolute'&&r.left<-2&&r.right>innerWidth+2}).slice(0,4).map(e=>e.className)}));if(state.scroll>width+1)issues.push({width,route,type:'overflow',...state});};
  for(const route of routes){
   await go(route);await p.evaluate(()=>document.fonts.ready);
   await p.locator('#main img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));
   await p.waitForFunction(()=>[...document.querySelectorAll('#main img')].every(e=>e.complete),{},{timeout:15000});
   const broken=await p.locator('#main img').evaluateAll(es=>es.filter(e=>!e.naturalWidth).map(e=>e.getAttribute('src')?.slice(0,160)));if(broken.length)issues.push({width,route,type:'broken-images',broken});
   assert(!(await p.locator('main h1').innerText()).includes('Страница не найдена'),route);
   await overflow(route);
   for(const href of await p.locator('a[href]').evaluateAll(es=>es.map(e=>e.getAttribute('href'))))if(href?.startsWith('#/'))links.add(href.slice(1));
   assert.equal(await p.locator('.journal-header-phones a[href^="tel:"]').count(),2);
   if([1440,390].includes(width)&&['/','/kitchens','/furniture','/customers','/about','/materials','/projects','/contacts','/kitchens/models/brooklyn','/kitchens/models/rif'].includes(route)){
    await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(out,route==='/'?`home-${width}.png`:`${route.slice(1).replaceAll('/','-')}-${width}.png`),fullPage:true});
   }
   if(route.startsWith('/kitchens/models/')&&!route.endsWith('/rif')){
    const imgs=await p.locator('.compact-kitchen-photo>img').count();
    if(imgs>1){await p.locator('.compact-thumbnails button').last().click();assert.equal(await p.locator('.compact-thumbnails button').last().getAttribute('aria-pressed'),'true');}
    await p.locator('.compact-kitchen-photo>.compact-enlarge').click();assert(await p.locator('.compact-photo-dialog').first().evaluate(e=>e.open));await p.keyboard.press('Escape');
    const spec=await p.locator('.compact-kitchen-copy').innerText();assert(!spec.includes('уточняется'));assert(!spec.includes('Blum'));
    await p.getByRole('button',{name:'Оставить заявку',exact:true}).first().click();assert(await p.locator('.contact-dialog').evaluate(e=>e.open));assert((await p.locator('.contact-dialog .request-context').innerText()).includes(await p.locator('main h1').innerText()));assert.equal(await p.locator('.contact-dialog form').count(),0);await p.keyboard.press('Escape');
   }
   checks.push({width,route,images:true});
  }
  await go('/kitchens?collection=top');assert.deepStrictEqual(await p.locator('.pilot-model-card h3').allTextContents(),['Риф','Бруклин']);
  // Gallery state and return link stay tied to the same model and selected catalogue.
  await p.locator('.pilot-model-main').last().click();await p.locator('.compact-kitchen-sample').waitFor();assert((await p.locator('.compact-back').getAttribute('href')).includes('collection=top'));
  await go('/furniture');await p.locator('#wardrobes .storage-more').click();assert.equal(await p.locator('.compact-storage-sample').count(),6);assert.equal(await p.locator('.wardrobe-category-switch a').count(),1);
  for(const card of await p.locator('.compact-storage-sample').all()){await card.getByRole('button',{name:'Внутри',exact:true}).click();assert.equal(await card.getByRole('button',{name:'Внутри',exact:true}).getAttribute('aria-pressed'),'true');await card.getByRole('button',{name:'Снаружи',exact:true}).click();}
  const cardMetrics=await p.locator('.compact-storage-sample').evaluateAll(es=>es.map(e=>({id:e.dataset.storageId,height:e.getBoundingClientRect().height})));fs.writeFileSync(path.join(out,`storage-metrics-${width}.json`),JSON.stringify(cardMetrics,null,2));await overflow('/furniture-expanded');
  await go('/furniture?preview=storage&doors=sliding#wardrobes');assert.equal(await p.locator('#wardrobes [data-storage-id]').count(),0);assert(await p.locator('.wardrobe-category-empty').isVisible());assert.equal(await p.locator('#dressing [data-storage-id]').count(),1);
  await go('/customers#order');assert.equal(await p.locator('.pocket-order-tiles button').count(),7);
  for(const topic of ['payment','delivery','warranty','care','order']){
   await p.locator('#pocket-tab-'+topic).click();await p.locator('.pocket-topic-content').waitFor();
   if(topic==='delivery')await p.locator('.pocket-subsections details').evaluateAll(es=>es.forEach(e=>e.open=true));
   if(topic==='care'){assert.equal(await p.locator('.pocket-care-tiles button').count(),8);for(const button of await p.locator('.pocket-care-tiles button').all()){await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');}}
   if(topic==='order'){for(const button of await p.locator('.pocket-order-tiles button').all()){await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');}}
   await overflow('/customers#'+topic);
   if([1440,390].includes(width)&&['order','payment','delivery','care'].includes(topic))await p.locator('.customer-pocket').screenshot({path:path.join(out,`customers-${topic}-${width}.png`)});
  }
  const faq=p.locator('.pocket-faq-card').first();if(await faq.count()){await faq.locator('summary').click();assert(await faq.evaluate(e=>e.open));}
  await p.locator('.pocket-collapse').click();assert(await p.locator('.pocket-panel-clip').evaluate(e=>e.inert));
  await go('/');const first=await p.locator('.showcase-slide:not([hidden])').getAttribute('aria-label');for(let i=0;i<5;i++)await p.getByRole('button',{name:'Следующая композиция',exact:true}).click();assert.equal(await p.locator('.showcase-slide:not([hidden])').getAttribute('aria-label'),first);await p.getByRole('button',{name:'Деталь',exact:true}).click();
  await p.getByRole('button',{name:'Открыть меню',exact:true}).click();const menu=p.locator('.journal-menu-dialog');await menu.getByRole('link',{name:'Покупателям',exact:false}).click();await p.locator('.customer-pocket').waitFor();assert(!(await menu.evaluate(e=>e.open)));
  await p.getByRole('button',{name:'Открыть меню',exact:true}).click();await menu.getByRole('link',{name:'О салоне',exact:false}).click();await p.locator('.about-compact-page').waitFor();assert.equal(await p.locator('.about-compact-page img[src*="/visit/"]').count(),0);
  await go('/materials');for(const button of await p.locator('.materials-grid button').all()){await button.click();await overflow('/materials-selected');}
  await go('/contacts');assert.equal(await p.locator('.journal-contact-data a[href^="tel:"]').count(),3);assert((await p.locator('.journal-map a').getAttribute('href')).startsWith('https://'));assert.equal(await p.locator('.journal-visit-route img').count(),4);
  await go('/projects/quiet-space');assert.equal(await p.locator('video[controls]').count(),1);const video=await p.locator('video').evaluate(e=>e.getAttribute('src'));assert(video.startsWith('data:video/mp4')||/^https?:/.test(base));
  if(errors.length)issues.push({width,type:'runtime',errors});
  console.log(`Checked ${width}px: ${routes.length} routes plus user scenarios`);await p.close();
 }
 // Resolve links collected from every route, including query/anchor links.
 const p=await b.newPage();await p.goto(base+'#/');for(const route of links){await p.evaluate(async route=>{location.hash=route;await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)},route);const text=await p.locator('main h1').innerText();if(text.includes('Страница не найдена'))issues.push({route,type:'broken-link'});}await p.close();
 await b.close();fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({routes:checks.length,internalLinks:links.size,checks,issues},null,2));assert.equal(issues.length,0,JSON.stringify(issues,null,2));console.log(`PASS: ${checks.length} route/viewport checks, ${links.size} internal links; no broken images, runtime errors or horizontal overflow.`);
})().catch(e=>{fs.writeFileSync(path.join(out,'failure.txt'),String(e.stack));console.error(e);process.exit(1)});
