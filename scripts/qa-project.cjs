const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.QA_URL||'http://127.0.0.1:4178/walenza-website/';
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const go=async(route)=>{await page.goto(base+'#'+route);await page.locator('h1').waitFor();};
 await go('/projects');assert.equal(await page.locator('.project-card').count(),1);assert.equal(await page.locator('.project-card .demo-label').count(),0);
 assert.ok(await page.locator('.project-card .card-image').evaluate(el=>Math.abs(el.clientHeight-el.querySelector('img').clientHeight)<2),'project card photo fills frame');
 await page.locator('.project-card').click();await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='Мягкий свет');assert.equal(await page.locator('h1').innerText(),'Мягкий свет');assert.equal(await page.locator('.journal-gallery figure').count(),3);
 const video=page.locator('.project-video-section video');assert.equal(await video.getAttribute('preload'),'none');assert.equal(await video.getAttribute('autoplay'),null);assert.notEqual(await video.getAttribute('playsinline'),null);
 await page.locator('.project-video-link').click();await video.scrollIntoViewIfNeeded();
 const metadata=await video.evaluate(async v=>{v.load();await new Promise((ok,no)=>{v.onloadedmetadata=ok;v.onerror=()=>no(new Error(v.error?.message||'video error'));});v.muted=true;await v.play();await new Promise(ok=>{const timer=setInterval(()=>{if(v.currentTime>.2){clearInterval(timer);ok();}},50);});v.pause();return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,time:v.currentTime};});
 assert.ok(metadata.duration>50&&metadata.duration<52,JSON.stringify(metadata));assert.equal(metadata.width,720);assert.equal(metadata.height,1280);
 await video.evaluate(async v=>{for(const time of [5.8,6.1,44.4,44.7,50]){v.currentTime=time;await new Promise(ok=>{v.onseeked=ok;});}v.currentTime=0;});
 await go('/');assert.equal(await page.locator('.home-real-projects .project-card').count(),1);assert.equal(await page.locator('.real-review').count(),3);
 await page.getByRole('link',{name:'Смотреть видеоотзыв',exact:true}).click();assert.ok(page.url().includes('#project-video-title'));
 const out=path.resolve(__dirname,'../qa-output/video-review');fs.mkdirSync(out,{recursive:true});
 for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:900});for(const route of ['/projects','/projects/quiet-space']){await go(route);await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' '+width);if(width===390||width===1440)await page.screenshot({path:path.join(out,`project-${route.endsWith('quiet-space')?'detail':'gallery'}-${width}.png`),fullPage:true});}}
 await go('/projects/everyday-order');await page.waitForURL('**#/projects');assert.deepEqual(errors,[]);console.log('PASS real project: three images, 51-second playable video, seeking across cuts, home links, legacy redirect, no autoplay, 360–1440px. '+JSON.stringify(metadata));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
