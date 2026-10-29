import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { contacts } from '../data/content';
import { ContactIcon } from './Brand';
import '../quick-contact.css';

export default function QuickContact() {
 const {pathname,search,hash}=useLocation();
 const panel=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const textarea=useRef<HTMLTextAreaElement>(null),body=useRef<HTMLDivElement>(null);
 const id=useId(),heading=useId(),inputId=useId(),noticeId=useId();
 const [view,setView]=useState<'home'|'contacts'|'ai'>('home');
 const [draft,setDraft]=useState('');
 const [viewport,setViewport]=useState({height:window.visualViewport?.height??window.innerHeight,top:window.visualViewport?.offsetTop??0});
 const [open,setOpen]=useState(false),[placement,setPlacement]=useState({bottom:16,hidden:false});
 useEffect(()=>{panel.current?.hidePopover();},[pathname,search,hash]);
 useEffect(()=>{
  const update=()=>{
   setViewport({height:window.visualViewport?.height??window.innerHeight,top:window.visualViewport?.offsetTop??0});
   if(document.activeElement===textarea.current)requestAnimationFrame(()=>{if(body.current)body.current.scrollTop=body.current.scrollHeight;});
  };
  window.visualViewport?.addEventListener('resize',update);window.visualViewport?.addEventListener('scroll',update);window.addEventListener('resize',update);
  return()=>{window.visualViewport?.removeEventListener('resize',update);window.visualViewport?.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
 },[]);
 useEffect(()=>{
  if(!open)return;
  if(view==='ai')textarea.current?.focus({preventScroll:true});
  else panel.current?.querySelector<HTMLElement>('[data-help-first]')?.focus({preventScroll:true});
 },[open,view]);
 useLayoutEffect(()=>{
  if(open&&view==='ai'&&document.activeElement===textarea.current&&body.current)body.current.scrollTop=body.current.scrollHeight;
 },[viewport.height,viewport.top,open,view]);
 useEffect(()=>{
  let frame=0;
  const measure=()=>{
   const blocked=!!document.querySelector('dialog[open]');
   if(blocked){panel.current?.hidePopover();setPlacement(old=>old.hidden?old:{...old,hidden:true});return;}
   if(open)return;
   const size=112,height=48,right=12,edge=12;
   const obstacles=Array.from(document.querySelectorAll<HTMLElement>('header,nav,main img,main iframe,main button,main a,main input,main summary,main p,main h1,main h2,main h3,main dt,main dd,footer a')).filter(el=>!el.closest('.quick-contact')).map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.height);
   let bottom: number | undefined;
   for(let offset=16;offset<=Math.min(300,innerHeight*.4);offset+=60){
    const x=innerWidth-right-size,y=innerHeight-offset-height;
    if(y<edge)continue;
    if(!obstacles.some(r=>x<r.right+6&&x+size>r.left-6&&y<r.bottom+6&&y+height>r.top-6)){bottom=offset;break;}
   }
   // On photo-heavy screens keep controls unobstructed. The launcher returns
   // as soon as a safe area is available, and is absent during modal viewing.
   const next={bottom:bottom??16,hidden:bottom===undefined};
   setPlacement(old=>old.bottom===next.bottom&&old.hidden===next.hidden?old:next);
  };
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
  const observer=new MutationObserver(schedule);observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
  const resize=new ResizeObserver(schedule);resize.observe(document.body);
  window.addEventListener('scroll',schedule,true);window.addEventListener('resize',schedule);measure();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();window.removeEventListener('scroll',schedule,true);window.removeEventListener('resize',schedule);};
 },[open,pathname,search,hash]);
 return <div className="quick-contact" hidden={placement.hidden} style={{bottom:`max(${placement.bottom}px, env(safe-area-inset-bottom))`}}>
  <button ref={trigger} className="quick-contact-trigger" type="button" aria-label={open?'Закрыть помощь':'Помощь'} title="Помощь" aria-expanded={open} aria-controls={id} onClick={()=>{if(open)panel.current?.hidePopover();else {setView('home');panel.current?.showPopover();}}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 4h16v12H9l-5 4V4Z"/><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 4M12 14h.01"/></svg><span>Помощь</span></button>
  <div ref={panel} id={id} popover="auto" className={`quick-contact-panel help-panel help-panel--${view}`} role="region" aria-labelledby={heading} style={{'--help-height':`${viewport.height}px`,'--help-top':`${viewport.top}px`} as React.CSSProperties} onToggle={event=>setOpen((event.nativeEvent as ToggleEvent).newState==='open')}>
   <header>{view!=='home'&&<button type="button" className="help-back" aria-label="К выбору помощи" onClick={()=>setView('home')}>←</button>}<h2 id={heading}>{view==='ai'?<><SparkIcon />AI-помощник WALENZA</>:view==='contacts'?'Связаться с салоном':'Помощь'}</h2><button type="button" aria-label="Закрыть помощь" onClick={()=>{panel.current?.hidePopover();trigger.current?.focus();}}>×</button></header>
   {view==='home'&&<div className="help-choices"><button data-help-first type="button" onClick={()=>setView('ai')}><SparkIcon /><span>AI-помощник WALENZA<small>Демонстрация интерфейса</small></span><span aria-hidden="true">→</span></button><button type="button" onClick={()=>setView('contacts')}><ContactIcon name="phone" /><span>Связаться с салоном<small>Телефон, почта, ВКонтакте</small></span><span aria-hidden="true">→</span></button></div>}
   {view==='contacts'&&<div className="help-contact-links"><a data-help-first href={contacts.phoneHref}><ContactIcon name="phone" /><span>Позвонить в салон<small>{contacts.phone}</small></span></a>
   <a href={`mailto:${contacts.emails[0]}`}><ContactIcon name="mail" /><span>Написать на почту<small>{contacts.emails[0]}</small></span></a>
   <a href={contacts.vkUrl} target="_blank" rel="noopener noreferrer"><span className="quick-contact-vk" aria-hidden="true">VK</span><span>ВКонтакте</span></a></div>}
   {view==='ai'&&<><p className="help-demo-notice" id={noticeId}>Демонстрация интерфейса. Сообщения пока не отправляются.</p><div className="help-ai-body" ref={body}><p className="help-demo-greeting">Здравствуйте! Здесь будет помощник WALENZA. Сейчас можно проверить панель и сохранить черновик вопроса.</p><div className="help-composer"><label htmlFor={inputId}>Ваш вопрос</label><textarea ref={textarea} id={inputId} value={draft} onChange={event=>setDraft(event.target.value)} aria-describedby={noticeId} placeholder="Напишите вопрос" rows={4} /><div className="help-composer-footer"><span>Черновик сохраняется при закрытии панели</span><button type="button" disabled>Отправить</button></div></div></div></>}
  </div>
 </div>;
}

function SparkIcon(){return <svg className="help-spark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="m10 3 2.4 6.6L19 12l-6.6 2.4L10 21l-2.4-6.6L1 12l6.6-2.4L10 3ZM19 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/></svg>;}
