const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.QA_URL || 'http://127.0.0.1:4173/walenza-website/';
const out=path.resolve(__dirname,'../qa-output/interior-carousel');fs.mkdirSync(out,{recursive:true});
const checks=[],errors=[];
const pass=name=>{checks.push(name);console.log('PASS',name)};
const active=p=>p.locator('.interior-hero-slide.is-active').getAttribute('data-slide');
async function swipe(p,dx,dy){await p.locator('.interior-hero').evaluate((el,{dx,dy})=>{
 const start=new Touch({identifier:1,target:el,clientX:200,clientY:250}),end=new Touch({identifier:1,target:el,clientX:200+dx,clientY:250+dy});
 el.dispatchEvent(new TouchEvent('touchstart',{touches:[start],changedTouches:[start],bubbles:true}));
 el.dispatchEvent(new TouchEvent('touchend',{touches:[],changedTouches:[end],bubbles:true}));
},{dx,dy})}
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const width of [1920,1440,1024,768,767,600,430,390,375,360,320]){
   const p=await b.newPage({viewport:{width,height:1000},hasTouch:width<700,reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
   await p.goto(base+'#/');await p.evaluate(()=>document.fonts.ready);
   await p.locator('.interior-hero img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));
   await p.waitForFunction(()=>[...document.querySelectorAll('.interior-hero img')].every(e=>e.complete&&e.naturalWidth));
   assert.equal(await p.locator('.interior-hero-slide').count(),8);
   const before=await p.locator('.interior-hero').boundingBox(),copy=await p.locator('.interior-hero-copy').boundingBox();
   for(let i=0;i<8;i++){
    await p.getByRole('button',{name:`Показать интерьер ${i+1}`,exact:true}).click();
    await p.waitForFunction(i=>document.querySelector('.interior-hero-slide.is-active').dataset.slide===String(i+1),i);
    const h=await p.locator('.interior-hero').boundingBox(),c=await p.locator('.interior-hero-copy').boundingBox();
    assert.equal(h.height,before.height);assert.equal(c.y-h.y,copy.y-before.y);assert.equal(c.height,copy.height);
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
    const styles=await p.locator('.interior-hero h1').evaluate(e=>({color:getComputedStyle(e).color,size:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight),height:e.getBoundingClientRect().height,border:parseFloat(getComputedStyle(e).borderLeftWidth)}));
    assert(Math.abs(styles.height-styles.line*2)<2,'heading must remain two lines');
    if(width<=767){
     assert.notEqual(styles.color,'rgb(255, 255, 255)');assert.equal(styles.border,4);assert(styles.size>=22&&styles.size<=25);
     const photoArea=await p.locator('.interior-hero-images').boundingBox();
     assert(c.y>=photoArea.y+photoArea.height-1,'mobile text must not cover photographs');
     const cta=await p.locator('.interior-hero-cta').boundingBox();assert(cta.y>=photoArea.y+photoArea.height-1,'mobile CTA must not cover furniture');
     assert.equal(await p.locator('.interior-hero-shade').isVisible(),false,'no photo shade needed outside text');
    }else{assert.equal(styles.color,'rgb(255, 255, 255)');assert(styles.border>=5);}
    if(width>=1024)assert(styles.size>=56&&styles.size<=64);
    const image=await p.locator('.interior-hero-slide.is-active img').evaluate(e=>({src:e.currentSrc,fit:getComputedStyle(e).objectFit}));
    assert(image.src.includes(width<=767?'mobile.webp':'large.webp'));
    if(width<=767){assert.equal(image.fit,'contain');const bar=await p.locator('.interior-hero-controls').boundingBox();assert(bar.height>=38&&bar.height<=44,'compact mobile controls');}
    if([1440,390].includes(width))await p.locator('.interior-hero').screenshot({path:path.join(out,`${width}-slide-${i+1}.png`)});
   }
   await p.getByRole('button',{name:'Следующий интерьер',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='1');
   await p.getByRole('button',{name:'Предыдущий интерьер',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='8');
   await p.locator('.interior-hero-images').focus();await p.keyboard.press('Home');await p.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='1');
   await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='2');
   if(width===390){await swipe(p,-110,0);await p.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='3');await swipe(p,0,130);assert.equal(await active(p),'3')}
   await p.getByRole('button',{name:'Обсудить проект',exact:true}).click();await p.locator('.contact-dialog[open]').waitFor();assert.equal(await p.locator('#contact-dialog-title').innerText(),'Оставить заявку');await p.keyboard.press('Escape');
   assert(await p.getByRole('button',{name:'Автосмена отключена: уменьшение движения'}).isDisabled());
   pass(`${width}px: all 8 frames, stable layout, heading, controls, keyboard, CTA, reduced motion`);await p.close();
  }
  const p=await b.newPage({viewport:{width:1440,height:1100}});p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'#/');
  await p.locator('.interior-hero img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await p.waitForFunction(()=>[...document.querySelectorAll('.interior-hero img')].every(e=>e.complete&&e.naturalWidth));
  await p.getByRole('button',{name:'Показать интерьер 8',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='8');await p.waitForTimeout(1000);
  const monitor=p.evaluate(()=>new Promise(resolve=>{const result=[],start=performance.now();function sample(){const es=[...document.querySelectorAll('.interior-hero-slide')];result.push(es.some(e=>Number(getComputedStyle(e).opacity)>.999&&e.querySelector('img').complete&&e.querySelector('img').naturalWidth>0));if(performance.now()-start<1400)requestAnimationFrame(sample);else resolve(result)}sample()}));
  await p.getByRole('button',{name:'Следующий интерьер',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='1');
  await p.waitForTimeout(300);const transition=await p.locator('.interior-hero-slide.is-active').evaluate(e=>({opacity:Number(getComputedStyle(e).opacity),duration:getComputedStyle(e).transitionDuration}));assert(transition.opacity>0&&transition.opacity<1);assert.equal(transition.duration,'0.9s');assert((await monitor).every(Boolean),'a loaded opaque frame must remain throughout transition');
  pass('real 900ms last-to-first crossfade keeps an opaque decoded photograph under incoming frame');await p.close();
  // Browser clock exercises actual 7-second timers without a minute-long wait.
  const auto=await b.newPage({viewport:{width:1440,height:1100}});await auto.clock.install();await auto.goto(base+'#/');
  await auto.locator('.interior-hero img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await auto.waitForFunction(()=>[...document.querySelectorAll('.interior-hero img')].every(e=>e.complete&&e.naturalWidth));
  await auto.mouse.move(0,0);await auto.clock.runFor(7100);await auto.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='2');
  for(let i=3;i<=8;i++){await auto.clock.runFor(7100);await auto.waitForFunction(i=>document.querySelector('.interior-hero-slide.is-active').dataset.slide===String(i),i)}await auto.clock.runFor(7100);await auto.waitForFunction(()=>document.querySelector('.interior-hero-slide.is-active').dataset.slide==='1');
  await auto.getByRole('button',{name:'Приостановить автоматическую смену',exact:true}).click();await auto.mouse.move(0,0);await auto.clock.runFor(15000);assert.equal(await active(auto),'1');
  await auto.getByRole('button',{name:'Включить автоматическую смену',exact:true}).click();await auto.getByRole('button',{name:'Включить автоматическую смену',exact:true}).count().catch(()=>0);
  await auto.locator('.interior-hero-play').evaluate(e=>e.blur());await auto.mouse.move(0,0);await auto.clock.runFor(7100);assert.equal(await active(auto),'2');
  await auto.locator('.interior-hero').hover();const held=await active(auto);await auto.clock.runFor(14000);assert.equal(await active(auto),held);
  pass('7-second automatic cycle through all 8 frames, last-to-first, explicit pause/resume and hover pause');await auto.close();
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({checks,errors},null,2));console.log('ALL PASS');
 }finally{await b.close()}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
