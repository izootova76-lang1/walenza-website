const {chromium}=require('C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.QA_URL||'http://127.0.0.1:4173/walenza-website/';
const out=path.resolve(__dirname,'../qa-output/storage-galleries');fs.mkdirSync(out,{recursive:true});
const errors=[];
async function ready(p){await p.locator('main').waitFor();await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('main img')].map(i=>i.decode().catch(()=>{})))});}
async function clean(p){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow');assert.equal(await p.locator('main img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).length),0,'missing photo');}
const card=(p,id)=>p.locator(`[data-storage-id="${id}"]`);
const gallery=c=>c.locator(':scope > .storage-visual-photo');
const caption=c=>c.locator(':scope > .storage-visual-caption');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 try{
 for(const width of [1440,1024,768,390,320]){
  const p=await b.newPage({viewport:{width,height:1000},hasTouch:width<=390,reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'#/furniture');await ready(p);assert.equal(await p.locator('.storage-direction-card').count(),2);await p.locator('.storage-direction-card').first().click();await p.getByRole('button',{name:/Показать ещё/}).click();await ready(p);
  assert.equal(await p.locator('[data-storage-id]').count(),5);assert.equal(await p.locator('.storage-switch,.wardrobe-category-empty').count(),0);
  for(const id of ['laguna','arka','texture','silhouette','orbita']){
   const c=card(p,id),g=gallery(c);const before=await g.boundingBox();
   const inside=g.getByRole('button',{name:'Наполнение',exact:true});await inside.focus();await inside.press('Space');assert.equal(await inside.getAttribute('aria-pressed'),'true');assert((await g.locator(':scope > img').getAttribute('src')).includes(id+'-interior'));
   await g.getByRole('button',{name:'Фасады',exact:true}).click();assert((await g.locator(':scope > img').getAttribute('src')).includes(id+'-facades'));const after=await g.boundingBox();assert(Math.abs(before.height-after.height)<1,'stable height');
   assert.equal(await caption(c).getByRole('button',{name:/Оставить заявку|Обсудить проект/}).count(),0);
  }
  const c=card(p,'orbita');await caption(c).getByRole('button',{name:/Подробнее/}).click();const dialog=c.locator('dialog[open]');await dialog.waitFor();await dialog.getByRole('button',{name:'Следующее фото',exact:true}).click();await dialog.getByRole('button',{name:'Следующее фото',exact:true}).click();assert((await dialog.locator('.storage-visual-photo > img').getAttribute('src')).includes('orbita-angle'));
  await dialog.getByRole('button',{name:/Обсудить проект/}).click();await p.locator('.contact-dialog[open]').waitFor();assert((await p.locator('.request-context').innerText()).includes('Орбита'));await p.keyboard.press('Escape');assert(await dialog.isVisible());await p.keyboard.press('Escape');
  await clean(p);await p.evaluate(()=>document.activeElement?.blur());if(width===1440||width===390)await p.screenshot({path:path.join(out,`wardrobes-${width}.png`),fullPage:true});
  const listingCTA=p.locator('.storage-editorial .catalog-grid-cta > .catalog-cta');assert.equal(await listingCTA.count(),1);await listingCTA.getByRole('button',{name:/Обсудить проект/}).click();await p.locator('.contact-dialog[open]').waitFor();await p.keyboard.press('Escape');
  await p.locator('.storage-directions-back').click();await p.locator('.storage-direction-card').last().click();await ready(p);assert.equal(await p.locator('[data-storage-id]').count(),2);
  for(const [id,count] of [['gallery',3],['salon-dressing',2]]){
   const c=card(p,id),g=gallery(c);const first=await g.locator(':scope > img').getAttribute('src');
   assert.equal(await g.locator('.storage-photo-states').count(),id==='gallery'?1:0);
   assert((await g.locator('.storage-photo-count').innerText()).includes('1 / '+count));
   for(let i=0;i<count;i++)await g.getByRole('button',{name:'Следующее фото',exact:true}).click();assert.equal(await g.locator(':scope > img').getAttribute('src'),first);
   if(width<=390){await g.getByRole('button',{name:'Следующее фото',exact:true}).tap();await g.evaluate(el=>{const start=new Event('touchstart',{bubbles:true});Object.defineProperty(start,'touches',{value:[{clientX:50,clientY:100}]});el.dispatchEvent(start);const end=new Event('touchend',{bubbles:true});Object.defineProperty(end,'changedTouches',{value:[{clientX:180,clientY:105}]});el.dispatchEvent(end);});assert.equal(await g.locator(':scope > img').getAttribute('src'),first);}
   await g.focus();await g.press('ArrowRight');assert.notEqual(await g.locator(':scope > img').getAttribute('src'),first);await g.press('ArrowLeft');
   await g.getByRole('button',{name:/Увеличить фото/}).click();await c.locator('dialog[open]').waitFor();assert.equal(await c.locator('dialog[open] .storage-visual-photo > img').getAttribute('src'),first);await p.keyboard.press('Escape');
  }
  assert.equal(await p.locator('.storage-extra,.dressing-paired-preview').count(),0);await clean(p);await p.evaluate(()=>document.activeElement?.blur());if(width===1440||width===390)await p.screenshot({path:path.join(out,`dressing-${width}.png`),fullPage:true});
  await p.locator('.storage-directions-back').click();assert.equal(await p.locator('.storage-direction-card').count(),2);
  await p.goto(base+'#/kitchens');assert.equal(await p.locator('.kitchen-direction-card').count(),6);assert.equal(await p.locator('main > .catalog-cta').count(),0);await p.locator('.kitchen-direction-card').first().click();await p.locator('.kitchen-model-grid').waitFor();assert.equal(await p.locator('.kitchen-models-page .catalog-grid-cta > .catalog-cta').count(),1);await p.locator('.kitchen-models-page .catalog-grid-cta > .catalog-cta button').click();await p.locator('.contact-dialog[open]').waitFor();assert((await p.locator('.request-context').innerText()).includes('Кухни'));await p.keyboard.press('Escape');
  await p.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS: 5 widths, all wardrobe pairs, keyboard/touch/swipe, state/geometry, details+context, both dressing galleries+loops, enlargement, single-state, back navigation, kitchen CTA, images and overflow.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
