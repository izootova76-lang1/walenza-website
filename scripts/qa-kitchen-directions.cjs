const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-output/kitchen-directions');fs.mkdirSync(out,{recursive:true});
const base=process.env.QA_URL || 'http://127.0.0.1:4173/walenza-website/';
// Read the actual existing dataset without editing it or requiring a dev server.
const data={};const compiled=ts.transpileModule(fs.readFileSync(path.join(root,'src/data/content.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
new Function('require','exports',compiled)(id=>{if(id==='../assetUrl')return{assetUrl:p=>p};throw Error('Unexpected import '+id)},data);
const checks=[],errors=[],pass=name=>{checks.push(name);console.log('PASS',name)};
async function images(p){await p.locator('main img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await p.waitForFunction(()=>[...document.querySelectorAll('main img')].every(e=>e.complete&&e.naturalWidth))}
async function noOverflow(p){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow')}
const ids=p=>p.locator('.pilot-model-card').evaluateAll(es=>es.map(e=>e.dataset.modelId));
const directionModels=id=>{const items=data.models.filter(m=>!id||m.collections.includes(id));if(id==='top')items.sort((a,b)=>data.approvedTopModelNames.indexOf(a.title)-data.approvedTopModelNames.indexOf(b.title));return items};
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});try{
 for(const width of [1440,1024,768,390,360,320]){
  const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
  for(const direction of data.collections){
   await p.goto(base+'#/kitchens');await p.locator('.kitchen-direction-card').first().waitFor();await images(p);await p.evaluate(()=>document.fonts.ready);
   assert.equal(await p.locator('.kitchen-direction-card').count(),6);assert.equal(await p.locator('.pilot-model-card').count(),0);assert.equal(await p.locator('h1').innerText(),'Кухни');
   const columns=await p.locator('.kitchen-direction-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);assert.equal(columns,width>900?3:width>540?2:1);
   for(const card of await p.locator('.kitchen-direction-card').all()){
    const group=await card.getAttribute('data-direction'),modelId=await card.getAttribute('data-cover-model'),model=data.models.find(m=>m.id===modelId);
    assert(model&&model.collections.includes(group),'cover must belong to the direction');assert(!(await card.locator('img').getAttribute('src')).includes('interior-carousel'));
   }
   if(direction.id==='top'&&[1440,768,390].includes(width))await p.locator('.kitchen-editorial').screenshot({path:path.join(out,`directions-${width}.png`)});
   await p.locator(`[data-direction="${direction.id}"]`).click();await p.getByRole('heading',{name:direction.title,exact:true,level:1}).waitFor();
   const expected=directionModels(direction.id);assert.deepEqual(await ids(p),expected.slice(0,6).map(m=>m.id));await images(p);await noOverflow(p);
   if(expected.length<4)assert.equal(await p.locator('.kitchen-layout-filter').count(),0,'small groups should not be cluttered with filters');
   if(!expected.some(m=>m.island===true))assert.equal(await p.getByRole('button',{name:'С островом',exact:true}).count(),0);
   const labels={straight:'Прямые',corner:'Угловые',u:'П-образные'};
   for(const [layout,label]of Object.entries(labels)){
    const button=p.getByRole('button',{name:label,exact:true});if(!await button.count())continue;
    await button.click();assert.deepEqual(await ids(p),expected.filter(m=>m.layout===layout).slice(0,6).map(m=>m.id));assert.equal(await button.getAttribute('aria-pressed'),'true');
    assert(expected.some(m=>m.layout===layout),'no empty filter choices');await p.getByRole('button',{name:'Все',exact:true}).click();
   }
   const card=p.locator('.pilot-model-card a').first();const href=await card.getAttribute('href');assert(href.startsWith('#/kitchens/models/'));await card.click();await p.locator('.breadcrumbs').waitFor();
   assert.equal(await p.locator('h1').innerText(),expected[0].title);await p.locator('.breadcrumbs a').first().click();await p.locator('.pilot-model-card').first().waitFor();assert.deepEqual(await ids(p),expected.slice(0,6).map(m=>m.id));
   if(direction.id==='wood'&&[1440,390].includes(width))await p.locator('.kitchen-editorial').screenshot({path:path.join(out,`wood-${width}.png`)});
   await p.locator('.kitchen-directions-back').click();await p.locator('.kitchen-direction-card').first().waitFor();await noOverflow(p);
  }
  pass(`${width}px: six directions, existing covers/membership, genuine filters, model links and return`);await p.close();
 }
 for(const width of [1440,390]){
  const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
  for(const model of data.models){
   const route=`/kitchens/models/${model.id}?${new URLSearchParams({return:'/kitchens?view=all&shown=18'})}`;
   await p.goto(base+'#'+route);await p.locator('h1').waitFor();await images(p);assert.equal(await p.locator('h1').innerText(),model.title);
   if(model.id==='rif'){
    await p.locator('.rif-thumbnails button').nth(2).click();await p.locator('.rif-gallery .compact-enlarge').click();await p.locator('.rif-gallery-dialog[open]').waitFor();await p.keyboard.press('ArrowRight');await p.keyboard.press('Escape');
    await p.locator('.rif-sample').first().click();await p.locator('.rif-sample-dialog[open]').waitFor();await p.getByRole('button',{name:'Тёмный образец',exact:true}).click();await p.getByRole('button',{name:'Увеличить рельеф',exact:true}).click();await p.keyboard.press('Escape');
   }else{
    const thumbs=p.locator('.compact-thumbnails button');assert.equal(await thumbs.count(),1+(model.additionalImages?.length||0));await thumbs.last().click();
    const selected=await thumbs.last().getAttribute('aria-pressed');assert.equal(selected,'true');await p.locator('.compact-kitchen-photo .compact-enlarge').click();await p.locator('.compact-photo-dialog[open]').waitFor();await p.keyboard.press('ArrowRight');await p.keyboard.press('Escape');
   }
   await p.getByRole('button',{name:'Оставить заявку',exact:true}).first().click();await p.locator('.contact-dialog[open]').waitFor();await p.keyboard.press('Escape');
   await p.locator('.breadcrumbs a').first().click();await p.locator('.pilot-model-card').first().waitFor();assert.deepEqual(await ids(p),data.models.map(m=>m.id));assert(p.url().endsWith('#/kitchens?view=all&shown=18'));await noOverflow(p);
  }
  pass(`${width}px: all ${data.models.length} existing model pages, galleries, enlargement, CTA, full state return and Rif samples`);await p.close();
 }
 const p=await b.newPage({reducedMotion:'reduce'});await p.goto(base+'#/kitchens?view=all');await p.locator('.pilot-model-card').first().waitFor();assert.equal((await ids(p)).length,6);
 await p.locator('.kitchen-show-more').click();await p.waitForFunction(()=>document.querySelectorAll('.pilot-model-card').length===12);assert.equal((await ids(p)).length,12);await p.locator('.kitchen-show-more').click();await p.waitForFunction(count=>document.querySelectorAll('.pilot-model-card').length===count,data.models.length);assert.equal((await ids(p)).length,data.models.length);
 for(const query of ['layout=u','category=u','layout=corner&island=without','category=island','collection=top&layout=u','collection=wood&layout=straight','shown=18']){
  await p.goto(base+'#/kitchens?'+query);await p.locator('.kitchen-selection-heading').waitFor();const q=new URLSearchParams(query),group=q.get('collection')||'',layout=q.get('layout')||(q.get('category')==='island'?'':q.get('category'))||'',island=q.get('island')||(q.get('category')==='island'?'with':'');
  const expected=directionModels(group).filter(m=>(!layout||m.layout===layout)&&(!island||m.island===(island==='with')));assert.deepEqual(await ids(p),expected.slice(0,q.has('shown')?18:6).map(m=>m.id));
  if(!expected.length){assert(await p.locator('.kitchen-empty').isVisible());await p.getByRole('button',{name:'Сбросить планировку',exact:true}).click();await p.locator('.pilot-model-card').first().waitFor()}
 }
 pass('pagination and previously shared layout/island/collection/shown URLs remain functional');
 await p.goto(base+'#/kitchens?view=all');await p.getByRole('button',{name:'С островом',exact:true}).click();
 assert.deepEqual(await ids(p),['island-kitchen']);await p.locator('.pilot-model-card a').click();await p.getByRole('heading',{name:'Кухня с островом',exact:true,level:1}).waitFor();
 assert.equal(await p.locator('.model-title-note').innerText(),'Рабочее название');assert((await p.locator('.compact-kitchen-photo img').first().getAttribute('src')).endsWith('/island-kitchen.jpg'));
 await p.locator('.breadcrumbs a').first().click();await p.locator('.pilot-model-card').first().waitFor();assert.deepEqual(await ids(p),['island-kitchen']);
 pass('new user-confirmed island kitchen: working title, real image, island switch and filtered return');await p.close();assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({checks,errors,covers:{top:'rif',neoclassic:'verona',wood:'contour',character:'terracotta','art-deco':'oak-room',classic:'olive'}},null,2));console.log('ALL PASS');
}finally{await b.close()}})().catch(e=>{console.error(e.stack);process.exitCode=1});
