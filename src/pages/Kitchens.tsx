import { VisualHero } from '../components/Editorial';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { collections, layouts, models, manufacturers, primaryCatalogGroupId, selectCatalogModels, type OpenContact } from '../data/content';
import { Arrow, Demo, ModelCard, SectionHeading } from '../components/UI';
import { NotFound } from './Sections';

export function Kitchens({ catalogGroupId = primaryCatalogGroupId }: { catalogGroupId?: string }) {
 const catalogModels = selectCatalogModels(catalogGroupId);
 const [params, setParams] = useSearchParams(); const location = useLocation();
 const collection = collections.some(item => item.id === params.get('collection')) ? params.get('collection')! : '';
 const legacy = params.get('category');
 const layoutValue = params.get('layout') || (legacy !== 'island' ? legacy : '');
 const layout = layouts.some(item => item.id === layoutValue) ? layoutValue! : '';
 const island = ['with', 'without'].includes(params.get('island') || '') ? params.get('island')! : legacy === 'island' ? 'with' : '';
 const requestedShown = Number(params.get('shown'));
 const shown = Number.isSafeInteger(requestedShown) && requestedShown >= 6 && requestedShown % 6 === 0 ? Math.min(requestedShown, Math.max(6, Math.ceil(catalogModels.length / 6) * 6)) : 6;
 const filtered = catalogModels.filter(model => (!collection || model.collections.includes(collection)) && (!layout || model.layout === layout) && (!island || model.island === (island === 'with')));
 const update = (key: string, value: string) => { const next = new URLSearchParams(); if (collection) next.set('collection', collection); if (layout) next.set('layout', layout); if (island) next.set('island', island); if (value) next.set(key, value); else next.delete(key); setParams(next); };
 const active = !!(collection || layout || island);
 const returnTo = location.pathname + location.search;
 return <div className="container page-content kitchen-catalog"><VisualHero eyebrow="Кухни / Коллекция WALENZA" title="Найдите свой характер кухни" description="Свет, фактура и ваши привычки. Выберите настроение и планировку, а детали мы обсудим вместе." image="/images/kitchens/oak-room.jpg" alt="Кухня WALENZA: древесная фактура, светлые поверхности и витрина" caption="Реальная мебель · материалы заказчика" />
 <div className="catalog-layout"><aside className="collection-picker" aria-label="Выбор коллекции"><p className="eyebrow">Шесть направлений</p><div className="collection-buttons"><button aria-pressed={!collection} onClick={() => update('collection', '')}>Все кухни <span>{catalogModels.length}</span></button>{collections.map(item => <button key={item.id} aria-pressed={collection === item.id} onClick={() => update('collection', item.id)}>{item.title}<span>{catalogModels.filter(model => model.collections.includes(item.id)).length}</span></button>)}</div><label className="collection-mobile">Направление<select value={collection} onChange={event => update('collection', event.target.value)}><option value="">Все кухни · {catalogModels.length}</option>{collections.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label><p className="muted">Коллекции пересекаются: одна модель может относиться к нескольким направлениям.</p></aside>
 <div className="catalog-results"><div className="catalog-filters"><label>Планировка<select value={layout} onChange={event => update('layout', event.target.value)}><option value="">Любая планировка</option>{layouts.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label>Остров<select value={island} onChange={event => update('island', event.target.value)}><option value="">Не важно</option><option value="with">С островом</option><option value="without">Без острова</option></select></label><button className="filter-reset" onClick={() => setParams({})} disabled={!active && shown === 6}>Сбросить фильтры</button></div>
 <div className="catalog-status" role="status">Показано {Math.min(shown, filtered.length)} из {filtered.length} моделей{collection ? ` · ${collections.find(item => item.id === collection)?.title}` : ' · общий обзор'}</div>
 {filtered.length ? <div className="model-grid">{filtered.slice(0, shown).map(model => <ModelCard key={model.id} model={model} returnTo={returnTo} />)}</div> : <div className="empty-results"><h2>Такого сочетания пока нет</h2><p>Среди предоставленных моделей пока нет подтверждённого сочетания этих признаков. Другая планировка или наличие отдельного острова обсуждаются при проектировании.</p><button className="button" onClick={() => setParams({})}>Показать все кухни <Arrow /></button></div>}
 {filtered.length > shown && <button className="button show-more" onClick={() => { const next = new URLSearchParams(params); next.set('shown', String(shown + 6)); setParams(next); }}>Показать ещё {Math.min(6, filtered.length - shown)} <Arrow /></button>}
 </div></div><aside className="info-note">Изображения и сведения предоставлены заказчиком и из сообщества салона. Названия новых композиций рабочие, характеристики части моделей уточняются. Направления и планировки определены предварительно. Не на всех изображениях можно уверенно определить отдельный остров. Стоимость — индивидуальный расчёт.</aside></div>;
}

export function ModelDetail({ onContact }: { onContact: OpenContact }) {
 const { id } = useParams(); const [params] = useSearchParams(); const model = models.find(item => item.id === id);
 if (!model) return <NotFound />;
 const manufacturer = manufacturers.find(item => item.id === model.manufacturerId);
 const relatedModels = selectCatalogModels(model.catalogGroupId).filter(item => item.id !== model.id);
 const candidate = params.get('return') || '/kitchens';
 const returnTo = /^\/kitchens(?:\?[^#]*)?$/.test(candidate) ? candidate : '/kitchens';
 return <div className="container page-content model-detail-page">
  <div className="breadcrumbs"><Link to={returnTo}>Кухни</Link><span>/</span><span>{model.title}</span></div>
  <div className="detail-layout">
   <div className="model-photo-stack">
    <figure className="detail-image"><img src={model.image} alt={`Кухня «${model.title}» — предоставленное изображение`} />{model.demo && <Demo />}<figcaption>{model.imageCaption || model.sourceLabel || 'Изображение из сообщества салона ВКонтакте'}</figcaption></figure>
    {model.additionalImages?.map(photo => <figure className="detail-image" key={photo.image}><img src={photo.image} alt={photo.alt} loading="lazy" /><figcaption>Дополнительные ракурсы и детали кухни</figcaption></figure>)}
   </div>
   <div className="detail-copy">
    <p className="eyebrow">Модель из каталога салона</p><h1>{model.title}</h1>{model.workingTitle && <p className="model-title-note">Рабочее название для прототипа</p>}<p className="lead">{model.subtitle}</p>
    <p>Сведения приведены по материалам заказчика и сообщества салона. Направления и планировка предварительно определены по изображениям и будут уточнены при согласовании.</p>
    <dl className="specs">
     {manufacturer && <div><dt>Производитель</dt><dd>{manufacturer.name}</dd></div>}
     <div><dt>Фасады</dt><dd>{model.facades}</dd></div>
     <div><dt>Цвета</dt><dd>{model.colors}</dd></div>
     <div><dt>Фурнитура</dt><dd>{model.hardware}</dd></div>
     <div><dt>Планировка по изображению</dt><dd>{layouts.find(item => item.id === model.layout)?.title}</dd></div>
     <div><dt>Отдельный остров</dt><dd>{model.island === null ? 'По изображению нельзя уверенно определить' : model.island ? 'Показан на изображении' : 'На изображении не показан'}</dd></div>
     <div><dt>Направления</dt><dd>{collections.filter(item => model.collections.includes(item.id)).map(item => item.title).join(' · ')}</dd></div>
     <div><dt>Стоимость</dt><dd>Индивидуальный расчёт</dd></div>
    </dl>
    <p className="model-customization">{model.customization}</p>
    <button className="button" onClick={() => onContact({ kind: 'request', context: `Кухня «${model.title}»` })}>Хочу похожую кухню <Arrow /></button>
    <Link className="text-link catalog-back" to={returnTo}>Вернуться к выбранным кухням <Arrow /></Link>
   </div>
  </div>
  <section className="section"><SectionHeading eyebrow="Продолжить знакомство" title="Другие идеи для вашей кухни" /><div className="model-grid">{relatedModels.slice(0, 3).map(item => <ModelCard key={item.id} model={item} returnTo={returnTo} />)}</div></section>
 </div>;
}
