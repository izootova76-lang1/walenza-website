import { useEffect, useId, useRef, useState } from 'react';
import { reviews, projects, type Project } from '../data/content';
import { portfolioProjects, type PortfolioProject } from '../data/portfolio';
import { Arrow } from './UI';
import { LargePhoto } from './CompactSamples';
import '../portfolio.css';

// Keep existing detail routes and video anchors working.
export function ProjectVideo({ project }: { project: Project }) {
 const video=project.videoReview;
 return video ? <section className="project-video-section project-video-compact" aria-labelledby="project-video-title"><video controls playsInline preload="none" src={video.src} poster={video.poster} aria-label={video.title}/><div><h2 id="project-video-title">Отзыв клиента</h2><p>{project.title}</p></div></section> : null;
}
type View = {kind:'project';project:PortfolioProject} | {kind:'reviews'} | {kind:'text';index:number} | {kind:'video'};
function Quote(){return <svg viewBox="0 0 40 32" fill="currentColor" aria-hidden="true"><path d="M3 29V17C3 7 8 3 17 2v6c-5 1-7 3-7 7h8v14H3Zm20 0V17c0-10 5-14 14-15v6c-5 1-7 3-7 7h8v14H23Z"/></svg>;}
function Play(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m10 7 7 5-7 5V7Z"/></svg>;}

export default function ProjectsPresentation(){
 const grid=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),video=useRef<HTMLVideoElement>(null),opener=useRef<HTMLElement|null>(null);
 const [view,setView]=useState<View|null>(null),[selected,setSelected]=useState(0);
 const heading=useId(),touch=useRef<{x:number;y:number}|null>(null);
 const videoReview=projects.find(p=>p.videoReview)?.videoReview;
 // Natural photograph proportions; packed columns keep DOM and keyboard order.
 useEffect(()=>{
  const el=grid.current;if(!el)return;let frame=0;
  const layout=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const columns=innerWidth<=640?1:innerWidth<=1000?2:3,ends=Array(columns).fill(1);
   Array.from(el.children).forEach(card=>{const node=card as HTMLElement,inner=node.firstElementChild as HTMLElement;
    if(columns===1){node.style.removeProperty('grid-row');node.style.removeProperty('grid-column');return;}
    const col=ends.indexOf(Math.min(...ends)),height=Math.ceil(inner.getBoundingClientRect().height)+24;
    node.style.gridColumn=String(col+1);node.style.gridRow=`${ends[col]} / span ${height}`;ends[col]+=height;
   });
  });};
  const observer=new ResizeObserver(layout);observer.observe(el);Array.from(el.children).forEach(card=>observer.observe(card.firstElementChild!));window.addEventListener('resize',layout);layout();
  return()=>{observer.disconnect();window.removeEventListener('resize',layout);cancelAnimationFrame(frame);};
 },[]);
 useEffect(()=>{if(view&&!dialog.current?.open)dialog.current?.showModal();},[view]);
 useEffect(()=>{if(view)dialog.current?.querySelector<HTMLElement>('[data-view-focus]')?.focus();},[view]);
 const open=(next:View)=>{opener.current=document.activeElement as HTMLElement;setSelected(0);setView(next);};
 const close=()=>{video.current?.pause();setView(null);dialog.current?.close();opener.current?.focus({preventScroll:true});};
 const back=()=>{video.current?.pause();setView({kind:'reviews'});};
 const photos=view?.kind==='project'?view.project.photos:[];
 const move=(step:number)=>setSelected(i=>(i+step+photos.length)%photos.length);
 const pocket=<div className="portfolio-entry" key="reviews"><button type="button" className="portfolio-review-pocket" onClick={()=>open({kind:'reviews'})} aria-haspopup="dialog"><span className="portfolio-paper-stack" aria-hidden="true"><i/><i/><i/></span><span className="portfolio-pocket-face"><Quote/><span className="portfolio-pocket-title">Отзывы клиентов</span><strong>У каждого дома<br/>своя история.</strong><span>А у наших клиентов — свои впечатления</span><span className="portfolio-pocket-invitation">Посмотреть отзывы <Arrow/></span></span></button></div>;
 const cards=portfolioProjects.map(project=><article className="portfolio-entry" key={project.id}><button type="button" className="portfolio-project" onClick={()=>open({kind:'project',project})} aria-haspopup="dialog" aria-label={`Рассмотреть: ${project.title}`}><span className="portfolio-cover"><img src={project.photos[0].image} alt={project.photos[0].alt} loading="lazy"/><span className="portfolio-photo-arrow"><Arrow/></span></span><span className="portfolio-caption"><strong>{project.title}</strong>{project.visual&&<small>Предоставленный визуал</small>}</span></button></article>);
 cards.splice(3,0,pocket);
 return <div className="container page-content portfolio-page">
  <header className="portfolio-heading"><h1>Портфолио</h1><p>Интерьеры, в которых идеи стали реальностью</p></header>
  <div className="portfolio-grid" ref={grid}>{cards}</div>
  <dialog ref={dialog} className={`portfolio-dialog${view?.kind==='project'?' portfolio-dialog--project':''}`} aria-labelledby={heading} onClick={e=>{if(e.target===e.currentTarget)close();}} onCancel={e=>{if(e.target===e.currentTarget){e.preventDefault();close();}}} onKeyDown={e=>{if(view?.kind==='project'&&(e.key==='ArrowRight'||e.key==='ArrowLeft')&&!document.querySelector('.compact-photo-dialog[open]')){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}}>
   {view&&<><header className="portfolio-dialog-heading"><div>{(view.kind==='text'||view.kind==='video')&&<button type="button" data-view-focus className="portfolio-back" onClick={back}>← К отзывам</button>}<h2 id={heading}>{view.kind==='project'?view.project.title:view.kind==='text'?reviews[view.index].title:view.kind==='video'?'Видеоотзыв клиента':'Отзывы клиентов'}</h2></div><button type="button" data-view-focus={view.kind==='project'||view.kind==='reviews'?true:undefined} className="portfolio-close" aria-label="Закрыть просмотр" onClick={close}>×</button></header>
    {view.kind==='project'&&<div className="portfolio-project-gallery">
     <figure onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const start=touch.current;if(start){const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);}touch.current=null;}}><div className="portfolio-main-photo"><img src={photos[selected].image} alt={photos[selected].alt}/><LargePhoto photos={photos} selected={selected} onChange={setSelected} label={view.project.title}/></div><figcaption aria-live="polite">{photos[selected].caption}</figcaption></figure>
     {photos.length>1&&<><div className="portfolio-gallery-controls"><button type="button" aria-label="Предыдущее фото проекта" onClick={()=>move(-1)}>←</button><span aria-live="polite">{selected+1} из {photos.length}</span><button type="button" aria-label="Следующее фото проекта" onClick={()=>move(1)}>→</button></div><div className="portfolio-thumbnails" role="group" aria-label="Выбор фотографии">{photos.map((p,i)=><button type="button" key={p.image} aria-label={`${i+1}. ${p.alt}`} aria-pressed={selected===i} onClick={()=>setSelected(i)}><img src={p.image} alt=""/><small>{p.caption}</small></button>)}</div></>}
     {view.project.note&&<p className="portfolio-origin-note">{view.project.note}</p>}
    </div>}
    {view.kind==='reviews'&&<div className="portfolio-review-files">{reviews.map((review,index)=><button type="button" key={review.id} className="portfolio-review-file" onClick={()=>setView({kind:'text',index})}><Quote/><strong>{review.title}</strong><span>{review.text}</span><span className="portfolio-file-link">Читать отзыв <Arrow/></span></button>)}<button type="button" className="portfolio-review-file portfolio-video-file" onClick={()=>setView({kind:'video'})}>{videoReview&&<img src={videoReview.poster} alt=""/>}<Play/><strong>Видеоотзыв клиента</strong><span className="portfolio-file-link">Смотреть <Arrow/></span></button></div>}
    {view.kind==='text'&&<article className="portfolio-full-review"><Quote/><blockquote>{reviews[view.index].text}</blockquote><p>{reviews[view.index].title}</p></article>}
    {view.kind==='video'&&(videoReview?<video ref={video} className="portfolio-video" controls playsInline preload="metadata" src={videoReview.src} poster={videoReview.poster} aria-label={videoReview.title}/>:<p>Видео пока не добавлено. Демонстрация интерфейса.</p>)}
   </>}
  </dialog>
 </div>;
}
