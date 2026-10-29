import { CompactKitchenSample } from '../components/CompactSamples';
import RifPrototype from './RifPrototype';
import { useEffect, useRef } from 'react';
import PilotModelCard from '../components/PilotModelCard';
import KitchenDirections from '../components/KitchenDirections';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { collections, layouts, models, primaryCatalogGroupId, selectCatalogModels, approvedTopModelNames, type OpenContact, type Model } from '../data/content';
import { Arrow } from '../components/UI';
import { NotFound } from './Sections';
import CatalogGrid from '../components/CatalogGrid';
import CatalogCTA from '../components/CatalogCTA';
import '../kitchen-catalog.css';

const layoutLabels: Record<string, string> = { straight: 'Прямые', corner: 'Угловые', u: 'П-образные' };
const prototypeNote = 'Рабочий каталог для согласования. Названия, характеристики и состав направлений уточняются.';

export function Kitchens({ catalogGroupId = primaryCatalogGroupId, onContact }: { catalogGroupId?: string; onContact: OpenContact }) {
 const catalogModels = selectCatalogModels(catalogGroupId);
 const [params, setParams] = useSearchParams();
 const location = useLocation();
 const selectedDirection = collections.find(item => item.id === params.get('collection'));
 const collection = selectedDirection?.id || '';
 const legacy = params.get('category');
 const layoutValue = params.get('layout') || (legacy !== 'island' ? legacy : '');
 const layout = layouts.some(item => item.id === layoutValue) ? layoutValue! : '';
 const island = ['with', 'without'].includes(params.get('island') || '') ? params.get('island')! : legacy === 'island' ? 'with' : '';
 // Previously shared filter/pagination URLs continue to open the model listing.
 const listing = !!(collection || layout || island || params.has('shown') || params.get('view') === 'all');
 const directionModels = catalogModels.filter(model => !collection || model.collections.includes(collection));
 const matches = (model: Model) => (!layout || model.layout === layout) && (!island || model.island === (island === 'with'));
 const filtered = directionModels.filter(matches);
 if (collection === 'top') filtered.sort((a, b) => approvedTopModelNames.indexOf(a.title) - approvedTopModelNames.indexOf(b.title));
 const requestedShown = Number(params.get('shown'));
 const shown = Number.isSafeInteger(requestedShown) && requestedShown >= 6 && requestedShown % 6 === 0 ? Math.min(requestedShown, Math.max(6, Math.ceil(directionModels.length / 6) * 6)) : 6;
 const availableLayouts = layouts.filter(item => directionModels.some(model => model.layout === item.id && (!island || model.island === (island === 'with'))));
 const withIsland = directionModels.some(model => model.island === true && (!layout || model.layout === layout));
 const showFilters = (directionModels.length >= 4 && (availableLayouts.length > 1 || withIsland)) || !!(layout || island);
 const returnTo = location.pathname + location.search;
 const heading = useRef<HTMLHeadingElement>(null);
 const viewKey = listing ? collection || 'all' : 'directions';
 const previousView = useRef(viewKey);
 useEffect(() => {
  if (previousView.current !== viewKey) {
   window.scrollTo({ top: 0, behavior: 'instant' });
   heading.current?.focus({ preventScroll: true });
  }
  previousView.current = viewKey;
 }, [viewKey]);

 function updateFilter(key: 'layout' | 'island' | 'all', value = '') {
  const next = new URLSearchParams(params);
  next.delete('category'); next.delete('shown');
  // Canonicalise legacy filters without losing the other independent facet.
  if (layout) next.set('layout', layout); else next.delete('layout');
  if (island) next.set('island', island); else next.delete('island');
  if (!collection) next.set('view', 'all');
  if (key === 'all') { next.delete('layout'); next.delete('island'); }
  else if (value) next.set(key, value); else next.delete(key);
  setParams(next);
 }

 if (!listing) return <div className="container page-content kitchen-editorial kitchen-directions-page">
  <header className="kitchen-editorial-heading"><h1 ref={heading} tabIndex={-1}>Кухни</h1><p>У каждой свой характер.</p></header>
  <KitchenDirections models={catalogModels} />
  <div className="kitchen-catalog-foot"><Link className="text-link" to="/kitchens?view=all">Все модели <Arrow /></Link><p>{prototypeNote}</p></div>
 </div>;

 return <div className="container page-content kitchen-editorial kitchen-models-page">
  <Link className="kitchen-directions-back" to="/kitchens"><span aria-hidden="true">←</span> Все направления</Link>
  <header className="kitchen-selection-heading"><h1 ref={heading} tabIndex={-1}>{selectedDirection?.title || 'Все кухни'}</h1><p className="kitchen-result-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'модель' : filtered.length >= 2 && filtered.length <= 4 ? 'модели' : 'моделей'}</p></header>
  {showFilters && <div className="kitchen-layout-filter" role="group" aria-label="Планировка кухни">
   <button type="button" aria-pressed={!layout && !island} onClick={() => updateFilter('all')}>Все</button>
   {availableLayouts.map(item => <button key={item.id} type="button" aria-pressed={layout === item.id} onClick={() => updateFilter('layout', layout === item.id ? '' : item.id)}>{layoutLabels[item.id]}</button>)}
   {(withIsland || island === 'with') && <button type="button" aria-pressed={island === 'with'} onClick={() => updateFilter('island', island === 'with' ? '' : 'with')}>С островом</button>}
   {island === 'without' && <button type="button" aria-pressed="true" onClick={() => updateFilter('island')}>Без острова <span aria-hidden="true">×</span></button>}
   {layout && !availableLayouts.some(item => item.id === layout) && <button type="button" aria-pressed="true" onClick={() => updateFilter('layout')}>{layoutLabels[layout]} <span aria-hidden="true">×</span></button>}
  </div>}
  {filtered.length ? <CatalogGrid className="kitchen-model-grid" onContact={onContact} context={selectedDirection ? `Кухни: ${selectedDirection.title}` : 'Кухни'}>{filtered.slice(0, shown).map(model => <PilotModelCard key={model.id} model={model} returnTo={returnTo} />)}</CatalogGrid> : <div className="kitchen-empty"><h2>В этой подборке нет такого сочетания</h2><p>Можно посмотреть остальные модели направления.</p><button type="button" className="text-link" onClick={() => updateFilter('all')}>Сбросить планировку <Arrow /></button></div>}
  {filtered.length > shown && <button type="button" className="kitchen-show-more" onClick={() => { const next = new URLSearchParams(params); next.set('shown', String(shown + 6)); setParams(next); }}>Показать ещё {Math.min(6, filtered.length - shown)} <Arrow /></button>}
  {!filtered.length && <CatalogCTA onContact={onContact} context={selectedDirection ? `Кухни: ${selectedDirection.title}` : 'Кухни'} />}
  <footer className="kitchen-catalog-foot"><Link className="text-link" to="/kitchens">Все направления <Arrow /></Link><p>{prototypeNote}</p></footer>
 </div>;
}

export function ModelDetail({ onContact }: { onContact: OpenContact }) {
 const { id } = useParams(); const [params] = useSearchParams(); const model = models.find(item => item.id === id);
 if (!model) return <NotFound />;
 const candidate = params.get('return') || '/kitchens';
 const returnTo = /^\/kitchens(?:\?[^#]*)?$/.test(candidate) ? candidate : '/kitchens';
 if (model.id === 'rif') return <RifPrototype key={model.id} returnTo={returnTo} onContact={onContact} />;
 return <CompactKitchenSample key={model.id} model={model} returnTo={returnTo} onContact={onContact} />;
}
