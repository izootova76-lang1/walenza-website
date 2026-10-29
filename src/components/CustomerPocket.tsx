import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { customerSections, careGuides, installationRates, accessRates, deliveryNotes, type CustomerSectionId } from '../data/customerPocket';
import { type OpenContact } from '../data/content';
import { Arrow } from './UI';
import { LineIcon, type IconName } from './Editorial';
import { DisclosureMark } from './PocketFAQ';
import OrderStepTiles from './OrderStepTiles';

const careIcons: IconName[] = ['cloth','climate','wood','finish','worktop','glass','mechanism','push'];
const deliveryIcons: IconName[] = ['clock','delivery','people','payment'];
const folderIcons: IconName[] = ['signed-document','payment','delivery','warranty','cloth'];
function CareTiles() {
 const [selected,setSelected] = useState(0);
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const grid=useRef<HTMLDivElement>(null);
 return <div className="pocket-care-browser"><div className="pocket-care-tiles" ref={grid} role="group" aria-label="Темы ухода за мебелью">{careGuides.map((guide,index)=><button key={guide.title} ref={el=>{buttons.current[index]=el}} id={`care-topic-${index}`} type="button" aria-pressed={selected===index} aria-controls="pocket-care-recommendation" onClick={()=>setSelected(index)} onKeyDown={event=>{const columns=getComputedStyle(grid.current!).gridTemplateColumns.split(' ').length;let next=index;if(event.key==='ArrowRight')next=(index+1)%careGuides.length;else if(event.key==='ArrowLeft')next=(index+careGuides.length-1)%careGuides.length;else if(event.key==='ArrowDown')next=Math.min(index+columns,careGuides.length-1);else if(event.key==='ArrowUp')next=Math.max(index-columns,0);else if(event.key==='Home')next=0;else if(event.key==='End')next=careGuides.length-1;else return;event.preventDefault();buttons.current[next]?.focus();}}><LineIcon name={careIcons[index]}/><span>{guide.title}</span></button>)}</div><section className="pocket-care-recommendation" id="pocket-care-recommendation" aria-labelledby={`care-topic-${selected}`} role="region" aria-live="polite"><h3>{careGuides[selected].title}</h3><p>{careGuides[selected].text}</p></section></div>;
}
function TopicBody({ id, onContact }: { id: CustomerSectionId; onContact: OpenContact }) {
 const section = customerSections.find(item => item.id === id)!;
 const content = section.content;
 const contactNote = id==='care' ? `${section.topic.text} ${content.points![2]}` : id==='payment' ? section.topic.summary : id==='order' ? 'Детали конкретного заказа, точные сроки и состав услуг фиксируются в договоре.' : null;
 return <>
  {id === 'order' && <OrderStepTiles />}
  {id === 'payment' && <><div className="pocket-payment-stages"><section><LineIcon name="payment"/><div><h3>Предоплата</h3><p>{content.points![0]}</p></div></section><section><LineIcon name="warranty"/><div><h3>Окончательный расчёт</h3><p>{content.points![1]}</p></div></section></div><section className="pocket-payment-services"><h3>Оплата услуг</h3><ul className="pocket-conditions">{content.points!.slice(2).map(text => <li key={text}>{text}</li>)}</ul></section></>}
  {id === 'delivery' && <><div className="pocket-delivery-conditions">{content.paragraphs!.map((text,index) => <section key={text}><LineIcon name={deliveryIcons[index]}/><div><h3>{['Изготовление','Доставка и занос','Согласование времени','Стоимость услуг'][index]}</h3><p>{text}</p></div></section>)}</div><div className="pocket-subsections"><details><summary><LineIcon name="measure"/><span className="pocket-summary-label">Замер и подъём</span><DisclosureMark/></summary><dl className="pocket-rates">{accessRates.map(([title,price]) => <div key={title}><dt>{title}</dt><dd>{price}</dd></div>)}</dl><p>{deliveryNotes.access}</p></details><details><summary><LineIcon name="tools"/><span className="pocket-summary-label">Сборка и дополнительные работы</span><DisclosureMark/></summary><p>{deliveryNotes.assembly}</p><dl className="pocket-rates">{installationRates.map(rate => <div key={rate.title}><dt>{rate.title}</dt><dd>{rate.price}</dd></div>)}</dl><p>{deliveryNotes.installation}</p></details><details><summary><LineIcon name="project"/><span className="pocket-summary-label">Подготовка к установке</span><DisclosureMark/></summary>{deliveryNotes.preparation.map(text => <p key={text}>{text}</p>)}</details></div></>}
  {id === 'warranty' && <><section className="pocket-warranty-card"><LineIcon name="warranty"/><div><h3>Гарантия на мебель</h3>{content.paragraphs?.map(text => <p key={text}>{text}</p>)}</div></section><details className="pocket-guarantee-question"><summary><LineIcon name="people"/><span className="pocket-summary-label">Вопрос по гарантии</span><DisclosureMark/></summary><p>{section.topic.text}</p></details></>}
  {id === 'care' && <CareTiles/>}
  <div className={`pocket-contact-row${contactNote ? '' : ' pocket-contact-row--action'}`}>{contactNote && <p>{contactNote}</p>}<button className="button" type="button" onClick={() => onContact({ kind: 'request', context: id === 'order' ? 'Обсуждение проекта и порядка заказа' : `Вопрос об условиях заказа: ${section.label.toLowerCase()}` })}>{id === 'order' ? 'Оставить заявку' : 'Задать вопрос'}<Arrow /></button></div>
 </>;
}
export default function CustomerPocket({ onContact }: { onContact: OpenContact }) {
 const location = useLocation(), navigate = useNavigate();
 const hashId = location.hash.slice(1) === 'warranty-care' ? 'warranty' : location.hash.slice(1);
 const requested = customerSections.find(section => section.id === hashId)?.id ?? null;
 const [activeId,setActiveId] = useState<CustomerSectionId | null>(requested);
 const [displayId,setDisplayId] = useState<CustomerSectionId>(requested ?? 'order');
 const tabs=useRef(new Map<CustomerSectionId,HTMLButtonElement>());
 useEffect(()=>{if(!activeId)return;const frame=requestAnimationFrame(()=>{const button=tabs.current.get(activeId),row=button?.parentElement;if(!button||!row)return;const b=button.getBoundingClientRect(),r=row.getBoundingClientRect();const shift=b.left<r.left?b.left-r.left:b.right>r.right?b.right-r.right:0;if(shift)row.scrollBy({left:shift,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});return()=>cancelAnimationFrame(frame)},[activeId]);
 useEffect(()=>{setActiveId(requested);if(requested)setDisplayId(requested)},[requested]);
 const activate=(id:CustomerSectionId)=>{setDisplayId(id);setActiveId(id);navigate({pathname:location.pathname,search:location.search,hash:`#${id}`},{replace:true,preventScrollReset:true});};
 const collapse=()=>{const previous=activeId;setActiveId(null);navigate({pathname:location.pathname,search:location.search,hash:''},{replace:true,preventScrollReset:true});if(previous)tabs.current.get(previous)?.focus({preventScroll:true});};
 const section=customerSections.find(item=>item.id===displayId)!;
 return <section className={`customer-pocket${activeId ? ' is-open' : ''}`} aria-label="Условия для покупателей">
  <div className="pocket-shell">
   <div className="pocket-tabs" role="group" aria-label="Разделы для покупателей">{customerSections.map((item,index)=><button key={item.id} id={`pocket-tab-${item.id}`} type="button" aria-expanded={activeId===item.id} aria-controls="customer-pocket-panel" ref={element=>{if(element)tabs.current.set(item.id,element);else tabs.current.delete(item.id)}} onClick={()=>activate(item.id)} onKeyDown={event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%customerSections.length;else if(event.key==='ArrowLeft')next=(index+customerSections.length-1)%customerSections.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=customerSections.length-1;else return;event.preventDefault();tabs.current.get(customerSections[next].id)?.focus();}}><span className="pocket-folder-back" aria-hidden="true"/><span className="pocket-folder-cards" aria-hidden="true"><span/><span/><span/></span><span className="pocket-folder-front" aria-hidden="true"/><span className="pocket-folder-label"><LineIcon name={folderIcons[index]}/><span>{item.label}</span></span></button>)}</div>
   <div className="pocket-panel-wrap"><div className="pocket-panel-clip" inert={activeId===null} aria-hidden={activeId===null}><section id="customer-pocket-panel" className="pocket-panel" role="region" aria-labelledby={`pocket-tab-${displayId}`}>
    <header className="pocket-panel-heading"><h2>{section.topic.title}</h2><button type="button" className="pocket-collapse" onClick={collapse}>Свернуть<span aria-hidden="true">−</span></button></header>
    <div className="pocket-topic-content" key={displayId}><TopicBody id={displayId} onContact={onContact}/></div>
   </section></div></div>
  </div>
 </section>;
}
