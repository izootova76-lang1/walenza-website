import { useEffect, useRef, useState, useId } from 'react';
import { reviews, type Review } from '../data/content';

export default function CustomerReviews({ items = reviews }: { items?: readonly Review[] }) {
 const [mobile,setMobile]=useState(()=>matchMedia('(max-width: 700px)').matches);
 const [active,setActive]=useState(0);
 const track=useRef<HTMLDivElement>(null),id=useId();
 const visible=mobile?1:3,max=Math.max(0,items.length-visible),controls=items.length>visible;
 useEffect(()=>{const query=matchMedia('(max-width: 700px)');const change=()=>setMobile(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change)},[]);
 useEffect(()=>{setActive(0);if(track.current)track.current.scrollLeft=0},[mobile,items.length]);
 const select=(index:number)=>{const next=Math.max(0,Math.min(index,max));setActive(next);const child=track.current?.children[next] as HTMLElement|undefined;if(child&&track.current)track.current.scrollTo({left:child.offsetLeft-(track.current.children[0] as HTMLElement).offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 if(!items.length)return null;
 return <section className="customer-reviews-shelf" aria-labelledby={id}>
  <h2 id={id}>Отзывы покупателей</h2>
  <div className="customer-review-window"><div className="customer-review-track" ref={track} role="region" tabIndex={controls?0:undefined} aria-label="Отзывы покупателей. Пролистывайте или используйте кнопки." onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select((active+(event.key==='ArrowRight'?1:-1)+max+1)%(max+1))}}} onScroll={()=>{const el=track.current;if(!el?.children[0])return;const first=el.children[0] as HTMLElement,step=first.getBoundingClientRect().width+18;setActive(Math.min(max,Math.max(0,Math.round(el.scrollLeft/step))))}}>
   {items.map((review,index)=><article key={review.id} className="customer-review-card" aria-hidden={index<active||index>=active+visible} data-review-id={review.id}><span className="customer-review-quote" aria-hidden="true">“</span><blockquote>{review.text}</blockquote><p>{review.title}</p></article>)}
  </div><div className="customer-review-pocket-edge" aria-hidden="true" /></div>
  {controls&&<div className="customer-review-controls"><button type="button" aria-label="Предыдущие отзывы" onClick={()=>select((active-1+max+1)%(max+1))}>←</button>{mobile&&<div className="customer-review-dots" role="group" aria-label="Выбрать отзыв">{items.map((review,index)=><button type="button" key={review.id} aria-label={`Отзыв ${index+1}: ${review.title}`} aria-pressed={active===index} onClick={()=>select(index)}><span/></button>)}</div>}<button type="button" aria-label="Следующие отзывы" onClick={()=>select((active+1)%(max+1))}>→</button></div>}
 </section>;
}
