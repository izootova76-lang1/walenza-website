import { useEffect, useId, useRef, useState } from 'react';
import { type StorageItem } from '../data/storage';
import { type OpenContact } from '../data/content';
import { Arrow } from './UI';

export function StorageCard({ item, onContact }: { item: StorageItem; onContact: OpenContact }) {
 const [state, setState] = useState<'facades' | 'interior'>(item.images.facades ? 'facades' : 'interior');
 const titleId = useId();
 const viewId = useId();
 const paired = !!(item.images.facades && item.images.interior);
 const noun = item.kind === 'dressing' ? 'гардеробной' : 'шкафа';
 const action = state === 'facades' ? `Показать наполнение ${noun} «${item.title}»` : `Показать фасады ${noun} «${item.title}»`;
 const images = <>{(['facades', 'interior'] as const).map(view => {
  const image = item.images[view];
  return image && <img key={view} src={image.src} alt={image.alt} width="960" height="1280" loading="lazy" className={state === view ? 'is-visible' : ''} aria-hidden={state !== view} />;
 })}</>;

 return <article className="storage-card" aria-labelledby={titleId} data-storage-id={item.id}>
  <div className="storage-viewer">
   {paired ? <button type="button" className="storage-image" data-state={state} id={viewId} aria-label={action} onClick={() => setState(state === 'facades' ? 'interior' : 'facades')}>{images}</button> : <div className="storage-image" id={viewId}>{images}</div>}
   {paired && <div className="storage-switch" role="group" aria-label={`Вид ${noun} «${item.title}»`}>
    <button type="button" aria-pressed={state === 'facades'} aria-controls={viewId} onClick={() => setState('facades')}>Фасады</button>
    <button type="button" aria-pressed={state === 'interior'} aria-controls={viewId} onClick={() => setState('interior')}>Наполнение</button>
   </div>}
   <p className="storage-state" role="status">{state === 'facades' ? 'Показаны фасады' : 'Показано внутреннее наполнение'}{paired && <span> · Нажмите на фото для переключения</span>}</p>
  </div>
  <div className="storage-copy">
   <h3 id={titleId}>{item.title}</h3>
   <p>{item.description}</p><p>{item.interiorDescription}</p>
   {item.additional && <details className="storage-extra"><summary>Другой ракурс <span aria-hidden="true">+</span></summary><img src={item.additional.src} alt={item.additional.alt} loading="lazy" width="960" height="1280" /></details>}
   <button className="text-link" onClick={() => onContact({ kind: 'request', context: `${item.kind === 'dressing' ? 'Гардеробная' : 'Шкаф'} «${item.title}»` })}>{item.kind === 'dressing' ? 'Обсудить гардеробную' : 'Обсудить этот шкаф'} <Arrow /></button>
  </div>
 </article>;
}

export function StorageCollection({ items, onContact, dressing = false }: { items: StorageItem[]; onContact: OpenContact; dressing?: boolean }) {
 const [shown, setShown] = useState(2);
 const grid = useRef<HTMLDivElement>(null);
 const previousShown = useRef(shown);
 useEffect(() => {
  if (shown > previousShown.current) grid.current?.querySelectorAll<HTMLElement>('.storage-image')[previousShown.current]?.focus();
  previousShown.current = shown;
 }, [shown]);
 const remaining = items.length - shown;
 return <><div ref={grid} className={`storage-grid${dressing ? ' storage-grid--dressing' : ''}`}>{items.slice(0, shown).map(item => <StorageCard key={item.id} item={item} onContact={onContact} />)}</div>
  {remaining > 0 && <button className="button storage-more" onClick={() => setShown(count => count + 4)}>Показать ещё <span>{remaining}</span><Arrow /></button>}
 </>;
}
