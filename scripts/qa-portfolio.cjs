const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
const base=process.env.QA_URL||'http://127.0.0.1:4173/walenza-website/';
(async()=>{fs.mkdirSync('qa-output/portfolio',{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const go=async(route)=>{await page.goto(base+'#'+route);await page.locator('h1').waitFor();};
 const overflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page overflow');
 const dialogBounds=async()=>assert.ok(await page.locator('.portfolio-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'dialog overflow');
 for(const width of [1440,1280,1024,768,390,320]){
  await page.setViewportSize({width,height:900});await go('/projects');assert.equal(await page.locator('h1').innerText(),'Портфолио');assert.equal(await page.locator('.portfolio-project').count(),13);assert.equal(await page.locator('.portfolio-grid>.portfolio-entry').nth(3).locator('.portfolio-review-pocket').count(),1);
  await page.locator('.portfolio-cover img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));await page.waitForFunction(()=>[...document.querySelectorAll('.portfolio-cover img')].every(i=>i.complete&&i.naturalWidth));await page.waitForTimeout(150);
  await overflow();
  const geometry=await page.locator('.portfolio-entry').evaluateAll(els=>els.map(el=>{const b=el.firstElementChild.getBoundingClientRect();return{x:b.x,y:b.y,r:b.right,b:b.bottom,w:b.width,h:b.height}}));
  for(let i=0;i<geometry.length;i++)for(let j=i+1;j<geometry.length;j++){const a=geometry[i],b=geometry[j];assert.ok(!(a.x<b.r-1&&a.r>b.x+1&&a.y<b.b-1&&a.b>b.y+1),`overlap ${width} ${i}/${j}`)}
  assert.ok(await page.locator('.portfolio-cover img').evaluateAll(imgs=>imgs.every(i=>Math.abs(i.width/i.height-i.naturalWidth/i.naturalHeight)<.01)),'natural ratios');
  if(width===1440||width===390){await page.screenshot({path:`qa-output/portfolio/page-${width}.png`,fullPage:true});}
  // All projects and every actual angle; single photographs have no dead controls.
  for(let i=0;i<13;i++){
   await page.locator('.portfolio-project').nth(i).click();await page.locator('.portfolio-dialog[open]').waitFor();await dialogBounds();
   await page.locator('.portfolio-main-photo>img').evaluate(i=>i.decode());
   const thumbs=page.locator('.portfolio-thumbnails button'),count=await thumbs.count();
   if(count){for(let j=0;j<count;j++){await thumbs.nth(j).click();await page.locator('.portfolio-main-photo>img').evaluate(i=>i.decode());assert.equal(await thumbs.nth(j).getAttribute('aria-pressed'),'true');}await page.getByRole('button',{name:'Следующее фото проекта',exact:true}).click();assert.equal(await thumbs.first().getAttribute('aria-pressed'),'true');await page.keyboard.press('ArrowRight');assert.equal(await thumbs.nth(1).getAttribute('aria-pressed'),'true');}
   else assert.equal(await page.locator('.portfolio-gallery-controls').count(),0);
   if(i===3){await thumbs.nth(1).click();assert.match(await page.locator('.portfolio-project-gallery figcaption').innerText(),/ИИ-стилизация/);if(width===1440||width===390)await page.screenshot({path:`qa-output/portfolio/arched-${width}.png`});}
   assert.equal(await page.locator('.quick-contact').isVisible(),false,'help hidden during modal');
   await page.keyboard.press('Escape');await page.locator('.portfolio-dialog[open]').waitFor({state:'detached'});assert.ok(await page.locator('.portfolio-project').nth(i).evaluate(el=>document.activeElement===el),'focus restored');
  }
  // Existing full-size viewer remains usable inside the project dialog.
  await page.locator('.portfolio-project').first().click();await page.getByRole('button',{name:/Увеличить фото/}).click();await page.locator('.compact-photo-dialog[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('.portfolio-dialog[open]').count(),1);assert.equal(await page.locator('.portfolio-project-gallery').count(),1);await page.keyboard.press('Escape');await page.locator('.portfolio-dialog[open]').waitFor({state:'detached'});
  await page.locator('.portfolio-review-pocket').focus();await page.keyboard.press('Enter');await page.locator('.portfolio-review-files').waitFor();assert.equal(await page.locator('.portfolio-review-file').count(),4);await dialogBounds();
  if(width===1440||width===390){await page.locator('.portfolio-review-files').evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));await page.screenshot({path:`qa-output/portfolio/reviews-${width}.png`});}
  const expected=['Шикарная, ребята вчера всё установили. Я в восторге, спасибо вам!','Шкаф и комод установили, я ещё не видела, но сын сказал — мощно, спасибо большое!','С заказом всё отлично, спасибо большое. Пользуемся'];
  for(let i=0;i<3;i++){await page.locator('.portfolio-review-file').nth(i).click();assert.equal(await page.locator('.portfolio-full-review blockquote').innerText(),expected[i]);await dialogBounds();await page.locator('.portfolio-back').click();}
  await page.locator('.portfolio-video-file').click();const v=page.locator('.portfolio-video');assert.equal(await v.getAttribute('autoplay'),null);assert.equal(await v.evaluate(v=>v.paused),true);await dialogBounds();
  if(width===1440){await v.evaluate(async v=>{v.muted=true;await v.play();});await page.waitForFunction(()=>document.querySelector('.portfolio-video').currentTime>.1);await page.keyboard.press('Escape');await page.locator('.portfolio-video').waitFor({state:'detached'});}
  else{await page.locator('.portfolio-back').click();await page.keyboard.press('Escape');}
  await overflow();console.log('PASS width',width);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await go('/projects');await page.locator('.portfolio-review-pocket').click();assert.equal(await page.locator('.portfolio-review-files').evaluate(el=>getComputedStyle(el).animationName),'none');await page.keyboard.press('Escape');
 await go('/');await page.getByRole('button',{name:'Открыть меню',exact:true}).click();await page.locator('.journal-menu-dialog a[href="#/projects"]').click();await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='Портфолио');
 await page.locator('.portfolio-project').nth(1).click();await page.locator('.portfolio-project-gallery figure').evaluate(target=>{const start=new Touch({identifier:1,target,clientX:260,clientY:150});target.dispatchEvent(new TouchEvent('touchstart',{touches:[start],bubbles:true}));const end=new Touch({identifier:1,target,clientX:80,clientY:150});target.dispatchEvent(new TouchEvent('touchend',{changedTouches:[end],bubbles:true}));});assert.equal(await page.locator('.portfolio-thumbnails button').nth(1).getAttribute('aria-pressed'),'true');await page.keyboard.press('Escape');
 await page.setViewportSize({width:1440,height:900});await go('/');await page.locator('header a[href="#/projects"]').first().click();await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='Портфолио');assert.match(await page.title(),/Портфолио/);
 await go('/projects/quiet-space');assert.equal(await page.locator('h1').innerText(),'Мягкий свет');assert.equal(await page.locator('.journal-gallery figure').count(),3);assert.equal(await page.locator('.project-video-section video').count(),1);
 await go('/projects/everyday-order');await page.waitForURL('**#/projects');assert.deepEqual(errors,[]);console.log('PASS navigation, legacy routes, 13 galleries, 3 full reviews, video playback, focus, Escape, full-size viewer, reduced motion, no overlap/overflow.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
