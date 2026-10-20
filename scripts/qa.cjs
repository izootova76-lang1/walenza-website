/* Local review QA. Requires an externally installed Playwright module.
   PLAYWRIGHT_MODULE=absolute module path; QA_URL=local Vite preview URL.
   No forms are submitted, no telephone links are opened, no external services called. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const target=process.env.QA_URL||'http://127.0.0.1:4178/walenza-website/';
const base=target.startsWith('file:')?target:target.replace(/\/?$/,'/');
const go=(page,route)=>page.goto(base+'#'+route);
const source=fs.readFileSync(path.resolve(__dirname,'../src/data/content.ts'),'utf8');
const seeds=[...source.matchAll(/model\('([^']+)', '([^']+)', '(straight|corner|u)', (true|false), \[([^\]]+)\]/g)].map(m=>({id:m[1],title:m[2],layout:m[3],island:m[4]==='true',groups:[...m[5].matchAll(/'([^']+)'/g)].map(x=>x[1])}));
const collections=['top','neoclassic','wood','character','art-deco','classic'];
const materialIds=['facades','components','countertops','hardware'];
const output=path.resolve(__dirname,'../qa-output/review-2026-10-20');
const errors=[],external=[],environmentInjectedHosts=new Set();
async function ready(page,route){await go(page,route);await page.locator('h1').waitFor();await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));}
async function layout(page,label){
 const issues=await page.evaluate(()=>{
  const issues=[];if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page overflow');
  for(const el of document.querySelectorAll('h1,h2,h3,p,dt,dd,button,select,a,.demo-label')){
   const r=el.getBoundingClientRect(),s=getComputedStyle(el);if(!r.width||!r.height||s.visibility==='hidden'||el.classList.contains('skip-link')||el.closest('dialog:not([open])'))continue;
   if(s.display!=='inline'&&el.scrollWidth>el.clientWidth+3)issues.push('text overflow: '+el.className+' '+el.textContent.trim().slice(0,45));
  }
  for(const selector of ['.header-top','.catalog-filters','.section-heading','.specs>div'])for(const group of document.querySelectorAll(selector)){
   const els=[...group.children].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height;});
   for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=els[i].getBoundingClientRect(),b=els[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2)issues.push('overlap '+selector);}
  }
  return issues;
 });assert.deepEqual(issues,[],label);
}
(async()=>{
 assert.equal(seeds.length,12);assert.equal(new Set(seeds.map(m=>m.title)).size,12);
 const hashes=new Set(seeds.map(m=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../public/images/kitchens',m.id+'.svg'))).digest('hex')));assert.equal(hashes.size,12);
 for(const group of collections)assert.ok(seeds.filter(m=>m.groups.includes(group)).length>=2);
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400&&!new URL(r.url()).hostname.endsWith('.kaspersky-labs.com'))errors.push(r.status()+' '+r.url());});page.on('request',r=>{const parsed=new URL(r.url());if(parsed.hostname.endsWith('.kaspersky-labs.com')){environmentInjectedHosts.add(parsed.hostname);return;}if(parsed.origin!==new URL(base).origin&&!r.url().startsWith('data:'))external.push(r.url());});
  const mainRoutes=['/','/kitchens','/furniture','/materials','/projects','/customers','/promotions','/about','/contacts'];
  const routes=[...mainRoutes,...seeds.map(m=>'/kitchens/models/'+m.id),'/projects/quiet-space','/projects/everyday-order','/promotions/season','/promotions/collection','/missing','/kitchens/models/missing','/projects/missing','/promotions/missing'];
  for(const route of routes){await ready(page,route);assert.equal(await page.locator('h1').count(),1,route);assert.equal(await page.locator('form,input,textarea').count(),0);}
  console.log('PASS: '+routes.length+' routes, 12 unique demo visuals, six overlapping collections.');
  await ready(page,'/kitchens');assert.equal(await page.locator('.model-card').count(),6);
  await page.getByRole('button',{name:/Показать ещё/}).click();assert.equal(await page.locator('.model-card').count(),12);
  await page.locator('.model-card').last().click();await page.locator('.breadcrumbs a').click();assert.ok(page.url().includes('shown=12'));assert.equal(await page.locator('.model-card').count(),12);
  for(const group of collections){await ready(page,'/kitchens?collection='+group);assert.equal(await page.locator('.model-card').count(),Math.min(6,seeds.filter(m=>m.groups.includes(group)).length));}
  await ready(page,'/kitchens');
  for(let index=1;index<=6;index++){await page.locator('.collection-buttons button').nth(index).click();assert.equal(new URLSearchParams(new URL(page.url()).hash.split('?')[1]).get('collection'),collections[index-1]);}
  for(const group of ['',...collections])for(const plan of ['','straight','corner','u'])for(const island of ['','with','without']){
   const params=new URLSearchParams();if(group)params.set('collection',group);if(plan)params.set('layout',plan);if(island)params.set('island',island);
   await ready(page,'/kitchens?'+params);
   const expected=seeds.filter(m=>(!group||m.groups.includes(group))&&(!plan||m.layout===plan)&&(!island||m.island===(island==='with'))).length;
   assert.equal(await page.locator('.model-card').count(),Math.min(6,expected),'filter '+params);
   if(!expected)assert.equal(await page.locator('.empty-results').isVisible(),true);
  }
  await ready(page,'/kitchens');await page.locator('.catalog-filters select').nth(0).selectOption('straight');await page.locator('.catalog-filters select').nth(1).selectOption('with');assert.equal(await page.locator('.model-card').count(),1);await page.locator('.model-card').click();await page.getByRole('button',{name:'Хочу похожую кухню'}).click();assert.ok((await page.locator('.request-context').innerText()).includes('Графит'));await page.keyboard.press('Escape');await page.locator('.breadcrumbs a').click();assert.ok(page.url().includes('layout=straight')&&page.url().includes('island=with'));await page.reload();assert.equal(await page.locator('.model-card').count(),1);await page.getByRole('button',{name:'Сбросить фильтры'}).click();assert.equal(await page.locator('.model-card').count(),6);
  await ready(page,'/kitchens?category=island');assert.ok(await page.locator('.model-card').count()>0);
  console.log('PASS: all 84 collection/layout/island combinations, controls, empty state, reset, load more, return, reload and legacy island URL.');
  for(const id of materialIds){await ready(page,'/materials');await page.locator('.material-card').nth(materialIds.indexOf(id)).click();assert.ok(page.url().includes('category='+id));assert.equal(await page.locator('.material-examples article').count(),3);assert.equal(await page.locator('.material-card').count(),4);await page.getByRole('button',{name:'Обсудить материалы'}).click();assert.ok((await page.locator('.request-context').innerText()).includes('Материалы:'));await page.keyboard.press('Escape');await page.getByRole('button',{name:'Закрыть примеры'}).click();assert.equal(await page.locator('.material-examples article').count(),0);}
  for(const topic of ['order','payment','delivery','warranty-care']){await ready(page,'/');await page.locator('.buyer-links a').filter({has:page.locator('h3')}).nth(['order','payment','delivery','warranty-care'].indexOf(topic)).click();assert.equal(await page.locator('#'+topic).getAttribute('open'),'');}
  for(const topic of ['bedrooms','living','children','hallways']){await ready(page,'/');await page.locator('.additional-directions a[href$="'+topic+'"]').click();assert.equal(await page.locator('#'+topic).getAttribute('open'),'');}
  await ready(page,'/contacts');for(const [kind,title] of [['director','Написать директору'],['ai','AI-помощник в Telegram']]){await page.locator('.contact-special button').filter({hasText:title}).click();assert.equal(await page.locator('#contact-dialog-title').innerText(),title);assert.equal(await page.locator('dialog').getAttribute('aria-labelledby'),'contact-dialog-title');assert.equal(await page.locator('dialog input,dialog form').count(),0);await page.keyboard.press('Escape');}
  for(const title of ['MAX','Telegram']){await page.locator('.contact-methods button').filter({hasText:title}).click();assert.ok((await page.locator('#contact-dialog-description').innerText()).includes('не предоставлена'));await page.keyboard.press('Escape');}
  assert.equal(await page.locator('a[href="tel:+79852050212"]').count()>0,true);assert.equal(await page.locator('a[href="tel:+79263364406"]').count()>0,true);
  console.log('PASS: material categories, buyer deep links, additional furniture, real telephone anchors and distinct honest contact scenarios.');
  for(const width of [360,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   for(const route of [...mainRoutes,'/kitchens/models/line','/materials?category=hardware','/customers#order']){await ready(page,route);await layout(page,width+' '+route);}
   const phone=page.locator('.header-phones .primary-phone'),request=page.locator('.header-actions .button');assert.equal(await phone.isVisible(),true);assert.equal(await request.isVisible(),true);
   await ready(page,'/');await request.click();const d=await page.locator('dialog').boundingBox();assert.ok(d.x>=0&&d.y>=0&&d.x+d.width<=width+1&&d.y+d.height<=901);await page.getByRole('button',{name:'Понятно',exact:true}).focus();await page.keyboard.press('Tab');if(await page.evaluate(()=>document.activeElement===document.body))await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement.closest('dialog')),true);await page.keyboard.press('Escape');
   if(await page.locator('.menu-toggle').isVisible()){await page.locator('.menu-toggle').click();await page.locator('#main-navigation').getByRole('link',{name:'Материалы',exact:true}).click();assert.equal(await page.locator('#main-navigation').isVisible(),false);}
   if(width===1440||width===390){for(const [name,route]of[['home','/'],['catalog','/kitchens'],['model','/kitchens/models/balance'],['materials','/materials?category=facades'],['buyers','/customers#payment']]){await ready(page,route);await page.screenshot({path:path.join(output,name+'-'+width+'.png'),fullPage:true});}await ready(page,'/');await page.screenshot({path:path.join(output,'header-'+width+'.png')});}
   console.log('PASS responsive header, layouts, navigation and dialog: '+width+'px');
  }
  const zoom=await browser.newContext({viewport:{width:720,height:500},deviceScaleFactor:2});const zp=await zoom.newPage();for(const route of mainRoutes){await ready(zp,route);await layout(zp,'200% '+route);}await ready(zp,'/');await zp.locator('.header-actions .button').click();const zbox=await zp.locator('dialog').boundingBox();assert.ok(zbox.y>=0&&zbox.y+zbox.height<=501);await zp.getByRole('button',{name:'Понятно',exact:true}).focus();const confirm=await zp.getByRole('button',{name:'Понятно',exact:true}).boundingBox();assert.ok(confirm.y>=0&&confirm.y+confirm.height<=501);await zoom.close();
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log('PASS: 200% zoom emulation, no app JS/HTTP errors, no app third-party requests, no data collection. Environment-injected antivirus hosts: '+environmentInjectedHosts.size);
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({date:'2026-10-20',routes:routes.length,models:seeds.length,filterCombinations:84,widths:[360,390,768,1024,1440],zoom:'200% emulated',errors,external,environmentInjectedHosts:[...environmentInjectedHosts],published:false},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
