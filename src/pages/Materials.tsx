import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { materialCategories, type MaterialCategory, type OpenContact } from '../data/content';
import { Arrow } from '../components/UI';
import { LineIcon } from '../components/Editorial';
import '../catalog-cta.css';
import '../materials-editorial.css';

const visualCopy: Record<string,string> = {
 matte: 'Мягкий цвет и спокойная поверхность.',
 gloss: 'Блеск и отражения на светлом фасаде.',
 wood: 'Рисунок волокон и переходы древесных оттенков.',
 carcass: 'Внутренние поверхности, полки и образец ЛДСП на срезе.',
 hpl: 'Поверхность и торец столешницы с древесным или однотонным декором.',
 stone: 'Светлая поверхность с мелкими вкраплениями.',
 quartz: 'Минеральный рисунок и мягкие прожилки.',
 hardware: 'Выдвижной ящик, направляющая и мебельная петля.',
};

function MaterialsSuppliers({category,decorated=false}:{category:MaterialCategory;decorated?:boolean}){
 return <details className="materials-editorial-suppliers">
  <summary>{decorated&&<LineIcon name="samples"/>}<span className="materials-disclosure-label">Материалы и производители</span><span className="materials-disclosure-mark" aria-hidden="true">+</span></summary>
  <div className="materials-disclosure-body"><p className="materials-supplier-note">Перечень предоставлен заказчиком; образцы не привязаны к конкретным брендам.</p><div className="materials-supplier-grid">{category.entries.map(entry=><article key={entry.title}><h3>{entry.title}</h3>{entry.detail&&<p>{entry.detail}</p>}{entry.brands&&<ul aria-label={`Производители: ${entry.title}`}>{entry.brands.map(brand=><li key={brand}>{brand}</li>)}</ul>}</article>)}</div></div>
 </details>;
}

function MaterialsTechnology({decorated=false}:{decorated?:boolean}){
 return <details className="materials-editorial-technology"><summary>{decorated&&<LineIcon name="tools"/>}<span className="materials-disclosure-label">Технологии и особенности производства</span><span className="materials-disclosure-mark" aria-hidden="true">+</span></summary><div className="materials-disclosure-body"><h3>PUR-клей</h3><p>По информации заказчика, при работе с ПВХ-плёнкой и кромкой используется PUR-клей. Применение технологии к конкретному изделию уточняется при согласовании проекта.</p></div></details>;
}

function MaterialsCTA({onContact,compact=false}:{onContact:OpenContact;compact?:boolean}){
 return <aside className={`materials-final-cta ${compact?'materials-composition-cta':'catalog-cta'}`}><div>{compact?<h3>Понравилось сочетание материалов?</h3>:<h2>Понравилось сочетание материалов?</h2>}<p>Обсудим, какие решения подойдут вашему проекту</p></div><button type="button" className="button" onClick={()=>onContact({kind:'request',context:'Материалы и детали'})}>Обсудить проект <Arrow/></button></aside>;
}

export default function Materials({ onContact }: { onContact: OpenContact }) {
 const [params, setParams] = useSearchParams();
 const selected = materialCategories.find(item => item.id === params.get('category'));
 const singleVisual=selected?.visuals.length===1?selected.visuals[0]:null;
 const panel = useRef<HTMLElement>(null);
 const categoryButtons = useRef(new Map<string, HTMLButtonElement>());

 const choose = (id?: string) => {
  const next = new URLSearchParams(params);
  if (id) next.set('category',id); else next.delete('category');
  setParams(next,{preventScrollReset:true});
 };
 const close = () => { choose(); if(selected)categoryButtons.current.get(selected.id)?.focus(); };

 useEffect(() => {
  if (selected) {
   panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
   panel.current?.focus({ preventScroll: true });
  }
 }, [selected?.id]);

 return <div className="container page-content materials-page materials-editorial-page">
  <header className="materials-editorial-heading"><h1>Материалы и детали</h1><p>Красота мебели начинается с фактур, поверхностей и продуманных деталей</p></header>
  <p className="materials-editorial-note">Изображения представлены для знакомства с фактурами и деталями. Конкретные материалы и варианты исполнения уточняются при согласовании проекта.</p>
  <div className="materials-choice-grid" role="group" aria-label="Категории материалов">
   {materialCategories.map(item => <button
    ref={button => { if (button) categoryButtons.current.set(item.id, button); else categoryButtons.current.delete(item.id); }}
    className="materials-choice" type="button"
    key={item.id} aria-expanded={selected?.id === item.id} aria-controls={selected ? 'material-content' : undefined}
    onClick={() => choose(item.id)}>
    <div className="materials-editorial-image"><img src={item.image} alt={`Демонстрационная фотография: ${item.title}`} /><span className="materials-demo-label">Демонстрационный образец</span></div>
    <div className="materials-choice-caption"><h2>{item.title}</h2><Arrow /></div>
    <p>{item.description}</p><span className="materials-choice-hint">Подробнее</span>
   </button>)}
  </div>

  {selected && <section id="material-content" key={selected.id} ref={panel} tabIndex={-1} className="materials-editorial-detail" aria-labelledby="material-category-title" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();close();}}}>
   {singleVisual?<div className="materials-single-layout materials-detail-visual">
    <div className="materials-editorial-image"><img src={singleVisual.image} alt={singleVisual.alt} loading="lazy" width="960" height="720"/>{singleVisual.demo&&<span className="materials-demo-label">Демонстрационный образец</span>}</div>
    <div className="materials-single-copy">
     <div className="materials-single-intro"><div className="materials-detail-heading"><h2 id="material-category-title">{selected.title}</h2><button type="button" className="materials-close" onClick={close}>Закрыть <span aria-hidden="true">×</span></button></div><p>{visualCopy[singleVisual.id]||singleVisual.description}</p></div>
     <div className="materials-single-disclosures"><MaterialsSuppliers category={selected} decorated/><MaterialsTechnology decorated/></div>
     <MaterialsCTA onContact={onContact} compact/>
    </div>
   </div>:<>
    <div className="materials-detail-heading"><h2 id="material-category-title">{selected.title}</h2>
     <button type="button" className="materials-close" onClick={close}>Закрыть <span aria-hidden="true">×</span></button>
    </div>
    <div className={`materials-detail-visuals${selected.visuals.length === 1 ? ' is-single' : ''}`}>
     {selected.visuals.map(visual => <article className="materials-detail-visual" key={visual.id}>
      <div className="materials-editorial-image"><img src={visual.image} alt={visual.alt} loading="lazy" width="960" height="720" />{visual.demo && <span className="materials-demo-label">Демонстрационный образец</span>}</div>
      <div className="materials-visual-caption"><h3>{visual.title}</h3><p>{visualCopy[visual.id] || visual.description}</p></div>
     </article>)}
    </div>
    <MaterialsSuppliers category={selected}/>
   </>}
  </section>}

  {!singleVisual&&<><MaterialsTechnology/><MaterialsCTA onContact={onContact}/></>}
  <Link to="/kitchens" className="text-link materials-kitchens-link">Перейти к кухням <Arrow /></Link>
 </div>;
}
