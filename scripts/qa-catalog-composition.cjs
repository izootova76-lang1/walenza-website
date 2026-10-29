const {chromium}=require('C:/Users/izoto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out=path.resolve(__dirname,'../qa-output/catalog-composition');fs.mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:4173/walenza-website/';
async function rects(p,selector='.catalog-composition'){
 return p.locator(selector).evaluate(el=>({mode:el.dataset.ctaPlacement,cards:[...el.querySelectorAll(':scope > .catalog-grid-item')].map(c=>c.getBoundingClientRect().toJSON()),cta:el.querySelector(':scope > .catalog-grid-cta').getBoundingClientRect().toJSON(),count:el.querySelectorAll(':scope > .catalog-grid-cta .catalog-cta').length}));
}
async function settled(p,selector='.catalog-composition'){
 await p.locator(selector).waitFor();await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('main img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}))});await p.waitForTimeout(100);
}
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const errors=[];
try{
 // Layout-only fixtures: existing photographs, no writes to catalogue data.
 const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4175/walenza-website/#/kitchens');
 for(const width of [1440,1024,390,320]){
  await p.setViewportSize({width,height:1000});
  for(const count of [2,3,4,5,6,8]){
   await p.evaluate(async count=>{
    const R=await import('/walenza-website/node_modules/.vite/deps/react.js'),React=R.default||R;
    const M=await import('/walenza-website/node_modules/.vite/deps/react-dom_client.js'),{createRoot}=M.default||M;
    const {default:CatalogGrid}=await import('/walenza-website/src/components/CatalogGrid.tsx');const {models}=await import('/walenza-website/src/data/content.ts');
    if(window.testRoot){window.testRoot.unmount();document.querySelector('#composition-fixture').remove();}
    const host=document.createElement('div');host.id='composition-fixture';host.className='container kitchen-editorial';document.querySelector('main').append(host);document.querySelector('main').firstElementChild.style.display='none';
    const children=models.slice(0,count).map(m=>React.createElement('article',{key:m.id,className:'pilot-model-card'},React.createElement('div',{className:'card-image'},React.createElement('img',{src:m.image,alt:m.title})),React.createElement('h3',null,m.title)));
    window.testRoot=createRoot(host);window.testRoot.render(React.createElement(CatalogGrid,{className:'kitchen-model-grid',onContact:intent=>{window.testIntent=intent},context:'Проверка композиции'},children));
   },count);
   await settled(p,'#composition-fixture .catalog-composition');const r=await rects(p,'#composition-fixture .catalog-composition');assert.equal(r.count,1);
   const cols=width>1099?3:width>540?2:1;const inset=cols>1&&count%cols===cols-1;assert.equal(r.mode,inset?'cell':'after',`${width}/${count}`);
   const last=r.cards.at(-1);if(inset){assert(Math.abs(r.cta.top-last.top)<2);assert(r.cta.left>=last.right+10);}else assert(r.cta.top>=Math.max(...r.cards.map(c=>c.bottom))+10);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await p.locator('#composition-fixture .catalog-cta button').click();assert.equal(await p.evaluate(()=>window.testIntent.context),'Проверка композиции');
   if([2,3,5].includes(count)&&[1440,390].includes(width))await p.locator('#composition-fixture').screenshot({path:path.join(out,`kitchens-${count}-${width}.png`)});
  }
 }
 await p.close();
 for(const width of [1440,768,390,320]){
  const p=await b.newPage({viewport:{width,height:1000}});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'#/furniture#wardrobes');await settled(p);let r=await rects(p);assert.equal(r.count,1);assert.equal(r.mode,width>1099?'cell':'after');
  await p.getByRole('button',{name:/Показать ещё/}).click();await settled(p);r=await rects(p);assert.equal(r.cards.length,5);assert.equal(r.count,1);assert.equal(r.mode,width>540?'cell':'after');
  await p.goto(base+'#/furniture#dressing');await settled(p);r=await rects(p);assert.equal(r.cards.length,2);assert.equal(r.count,1);
  if(width===1440){assert.equal(r.mode,'height-gap');const shorter=r.cards[1];assert(r.cta.top>=shorter.bottom+10);assert(r.cta.left>=shorter.left-1);assert(r.cta.bottom<=r.cards[0].bottom+1);}
  if(width<=540){assert.equal(r.mode,'after');assert(r.cta.top>Math.max(...r.cards.map(c=>c.bottom)));}
  await p.locator('.catalog-grid-cta button').click();await p.locator('.contact-dialog[open]').waitFor();assert((await p.locator('.request-context').innerText()).includes('Гардеробные'));await p.keyboard.press('Escape');
  if(width===1440||width===390){await p.evaluate(()=>document.activeElement?.blur());await p.screenshot({path:path.join(out,`dressing-${width}.png`),fullPage:true});}
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await p.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS: kitchen counts 2/3/4/5/6/8 at four widths; one CTA, geometric cell/after placement; wardrobes 2/5; dressing height gap and mobile order; context, no overflow or browser errors.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
