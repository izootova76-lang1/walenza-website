import { VisualHero } from '../components/Editorial';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { materialCategories, type OpenContact } from '../data/content';
import { Arrow, Demo } from '../components/UI';

export default function Materials({ onContact }: { onContact: OpenContact }) {
 const [params, setParams] = useSearchParams();
 const selected = materialCategories.find(item => item.id === params.get('category'));
 const panel = useRef<HTMLElement>(null);
 const firstRender = useRef(true);
 const categoryButtons = useRef(new Map<string, HTMLButtonElement>());

 useEffect(() => {
  if (firstRender.current) { firstRender.current = false; return; }
  if (selected) {
   panel.current?.scrollIntoView({ block: 'nearest' });
   panel.current?.focus({ preventScroll: true });
  }
 }, [selected?.id]);

 return <div className="container page-content materials-page">
  <VisualHero eyebrow="Материалы / Тактильная коллекция" title="Красота, которую хочется трогать" description="Матовые поверхности, тепло дерева, рисунок камня. Найдите сочетания, которые станут характером вашей мебели." image="/images/materials/facades.jpg" alt="Сгенерированная иллюстрация образцов мебельных фасадов" caption="Черновой визуал для согласования · сгенерированные образцы" />
  <div className="materials-grid" role="group" aria-label="Категории материалов">
   {materialCategories.map(item => <button
    ref={button => { if (button) categoryButtons.current.set(item.id, button); else categoryButtons.current.delete(item.id); }}
    className={`material-card ${selected?.id === item.id ? 'is-selected' : ''}`}
    key={item.id} aria-pressed={selected?.id === item.id} aria-controls="material-content"
    onClick={() => setParams({ category: item.id })}>
    <div className="material-card-image"><img src={item.image} alt={`Демонстрационная фотография: ${item.title}`} /><Demo>Демонстрационный визуал</Demo></div>
    <div><h2>{item.title.replace('комплектующие', 'комплек\u00adтующие')}</h2><Arrow /></div>
    <p>{item.description}</p>
   </button>)}
  </div>

  <section id="material-content" ref={panel} tabIndex={-1} className={`material-content ${selected ? 'is-visible' : ''}`} aria-live="polite" aria-labelledby={selected ? 'material-category-title' : undefined}>
   {selected ? <>
    <div className="section-heading"><div><p className="eyebrow">Рассмотреть ближе</p><h2 id="material-category-title">{selected.title}</h2></div>
     <button className="text-link" onClick={() => { setParams({}); categoryButtons.current.get(selected.id)?.focus(); }}>Закрыть описание <span aria-hidden="true">×</span></button>
    </div>
    <p className="material-visual-intro">Демонстрационные изображения помогают сравнить внешний вид. Они не воспроизводят конкретные декоры или изделия перечисленных производителей.</p>
    <div className={`material-visuals ${selected.visuals.length === 1 ? 'material-visuals--single' : ''}`}>
     {selected.visuals.map(visual => <article className="material-visual" key={visual.id}>
      <div className="material-visual-image"><img src={visual.image} alt={visual.alt} loading="lazy" width="960" height="720" />{visual.demo && <Demo>Демонстрационный образец</Demo>}</div>
      <div className="material-visual-copy"><h3>{visual.title}</h3><p>{visual.description}</p></div>
     </article>)}
    </div>
    <details className="material-suppliers" key={selected.id}>
     <summary>Материалы и производители <span aria-hidden="true">+</span></summary>
     <p className="material-supplier-note">Перечень предоставлен заказчиком. Визуальные примеры выше не привязаны к брендам; конкретные серии и декоры уточняются при выборе материалов.</p>
     <div className={`material-details material-details--${selected.id}`}>
     {selected.entries.map(entry => <article className="material-entry" key={entry.title}>
      <h3>{entry.title}</h3>
      {entry.detail && <p className="material-entry-detail">{entry.detail}</p>}
      {entry.brands && <ul className="material-brands" aria-label={`Производители: ${entry.title}`}>{entry.brands.map(brand => <li key={brand}>{brand}</li>)}</ul>}
     </article>)}
     </div>
    </details>
    <button className="button" onClick={() => onContact({ kind: 'request', context: `Материалы: ${selected.title}` })}>Обсудить материалы <Arrow /></button>
   </> : <p className="muted">Выберите категорию, чтобы рассмотреть поверхности и детали.</p>}
  </section>

  <aside className="material-technology" aria-labelledby="pur-title">
   <p className="eyebrow">Технология соединения</p>
   <h2 id="pur-title">PUR-клей</h2>
   <p>По информации заказчика, при работе с ПВХ-плёнкой и кромкой используется PUR-клей. Применение технологии к конкретному изделию уточняется при согласовании проекта.</p>
  </aside>
  <aside className="info-note">Сведения о материалах и производителях предоставлены заказчиком. Фотографии сгенерированы для прототипа и не показывают конкретные декоры перечисленных брендов. Серии, оттенки и доступность уточняются при согласовании проекта.</aside>
  <Link to="/kitchens" className="text-link">Перейти к кухням <Arrow /></Link>
 </div>;
}
