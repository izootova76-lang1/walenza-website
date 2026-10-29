const {chromium}=require('C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const out=path.resolve('qa-output/about-compact');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const base=process.argv[2]||'http://127.0.0.1:4178/walenza-website/';const results=[];
 for(const width of [360,390,768,1440]){
  const p=await browser.newPage({viewport:{width,height:1000},hasTouch:width<701});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'#/about?design=planes');await p.locator('.about-page').waitFor();const oldHeight=(await p.locator('#main').boundingBox()).height;
  await p.goto(base+'#/about?layout=compact&design=planes');await p.locator('.about-compact-page').waitFor();assert.equal(await p.locator('.interior-plane-study').count(),0,'Old split background must not apply to trial');
  await p.evaluate(()=>document.fonts.ready);await p.locator('img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await p.waitForFunction(()=>[...document.images].every(e=>e.complete&&e.naturalWidth>0));
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');
  assert.equal(await p.locator('.about-compact-page img[src*="process-draft"]').count(),0);
  assert.equal(await p.locator('.about-compact-page img[src*="/visit/"]').count(),0,'Route photographs belong to Contacts');
  assert.equal(await p.locator('.about-introduction .about-team-media figure').count(),2);
  assert.equal(await p.locator('.about-team-media figure').count(),2);
  assert((await p.locator('.about-team-media figure').first().innerText()).includes('Анна Ярошинская'));
  assert((await p.locator('.about-team-media figure').last().innerText()).includes('Татьяна Комарова'));
  const copy=await p.locator('.about-compact-page').innerText();for(const text of ['19 лет','не возраст московского салона','Формат и условия выезда согласовываются отдельно','без поездки в салон','с руководителями салона'])assert(copy.includes(text),text);
  const newHeight=(await p.locator('#main').boundingBox()).height;assert(newHeight<oldHeight,'Trial should be more compact');
  if([390,1440].includes(width)){await p.screenshot({path:path.join(out,`about-${width}.png`),fullPage:true});await p.locator('.about-people').screenshot({path:path.join(out,`team-${width}.png`)});}
  const photo=p.locator('.about-factory-main > img');const seen=new Set();
  for(let index=0;index<5;index++){
   seen.add(await photo.getAttribute('src'));await p.getByRole('button',{name:'Следующее фото фабрики',exact:true}).click();await p.waitForFunction(()=>{const e=document.querySelector('.about-factory-main>img');return e.complete&&e.naturalWidth>0;});
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }assert.equal(seen.size,5);
  const before=await photo.getAttribute('src');const preview=p.locator('.about-factory-previews button').first();await preview.focus();await p.keyboard.press('Enter');assert.notEqual(await photo.getAttribute('src'),before);assert(await preview.evaluate(e=>e===document.activeElement),'Focus retained after selecting preview');
  const enlarge=p.getByRole('button',{name:'Увеличить фото: Фабрика WALENZA в Ульяновске',exact:true});await enlarge.click();const dialog=p.locator('.about-factory-main dialog');assert(await dialog.evaluate(e=>e.open));const src=await dialog.locator('img').getAttribute('src');await p.keyboard.press('ArrowRight');assert.notEqual(await dialog.locator('img').getAttribute('src'),src);await p.keyboard.press('Escape');assert(!(await dialog.evaluate(e=>e.open)));assert(await enlarge.evaluate(e=>e===document.activeElement));
  await p.getByRole('link',{name:'Приехать в салон',exact:true}).click();await p.waitForURL('**#/contacts');assert.equal(await p.locator('.about-compact-page').count(),0);
  // Trial parameter cannot change unrelated routes; baseline About also remains available.
  for(const route of ['/','/customers/pocket','/kitchens','/furniture']){await p.goto(base+'#'+route+'?layout=compact');assert.equal(await p.locator('.about-compact-page').count(),0);}
  assert.equal(errors.length,0,errors.join('\n'));results.push({width,oldHeight,newHeight,reduction:Math.round((1-newHeight/oldHeight)*100)+'%',allFivePhotos:true,keyboardAndDialog:true,noHorizontalOverflow:true});await p.close();
 }
 await browser.close();fs.writeFileSync(path.join(out,`checks${base.startsWith('file:')?'-offline':''}.json`),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
