import { useId, useRef, useState } from 'react';
import { type StorageItem } from '../data/storage';
import { type OpenContact } from '../data/content';
import CatalogCTA from './CatalogCTA';
import { Arrow } from './UI';
import '../storage-gallery.css';

function DoorIcon({ open }: { open: boolean }) {
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">{open ? <><path d="M7 4h10v16H7M7 4 2 2v20l5-2M17 4l5-2v20l-5-2M7 10h10M12 10v10" /><path d="M4 11v2M20 11v2" /></> : <><path d="M3 3h18v18H3ZM12 3v18M9 11v3M15 11v3" /></>}</svg>;
}

export default function StorageModelCard({ item, onContact }: { item: StorageItem; onContact: OpenContact }) {
 const titleId = useId(), dialogTitle = useId();
 const modal = useRef<HTMLDialogElement>(null);
 const touch = useRef<{x:number;y:number} | null>(null);
 const [selected, setSelected] = useState(0);
 const states = (['facades', 'interior'] as const).flatMap(state => {
  const photo = item.images[state];
  return photo ? [{ ...photo, state, label: state === 'facades' ? 'Фасады' : 'Наполнение' }] : [];
 });
 const photos = [...states, ...(item.additional ? [{ ...item.additional, state: 'detail' as const, label: 'Детали' }] : [])];
 const current = photos[selected];
 const dressing = item.kind === 'dressing';
 const hasPair = !!item.images.facades && !!item.images.interior;
 const context = item.id === 'salon-dressing' ? item.title : `${dressing ? 'Гардеробная' : 'Шкаф'} «${item.title}»`;
 const description = current?.state === 'interior' ? item.interiorDescription : item.description;
 const move = (step: number) => setSelected(index => (index + step + photos.length) % photos.length);
 const open = () => modal.current?.showModal();
 const gallery = (expanded = false) => current && <div className={`storage-visual-photo${expanded ? ' is-expanded' : ''}`} style={{ aspectRatio: expanded ? undefined : item.photoAspectRatio || '3/4' }} role="region" tabIndex={0} aria-label={`Фотографии: ${context}. Стрелки влево и вправо для просмотра.`}
  onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1); } }}
  onTouchStart={event => { const p=event.touches[0];touch.current={x:p.clientX,y:p.clientY}; }} onTouchCancel={() => { touch.current=null; }} onTouchEnd={event => { if(!touch.current)return;const p=event.changedTouches[0],dx=p.clientX-touch.current.x,dy=p.clientY-touch.current.y;touch.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)move(dx<0?1:-1); }}>
  <img src={current.src} alt={current.alt} />
  {hasPair && <div className="storage-photo-states" role="group" aria-label={`Состояние: ${item.title}`}>{states.map((photo,index) => <button key={photo.state} type="button" title={photo.label} aria-label={photo.label} aria-pressed={current.state === photo.state} onClick={() => setSelected(index)}><DoorIcon open={photo.state === 'interior'} /><span>{photo.label}</span></button>)}</div>}
  {(dressing || expanded) && photos.length > 1 && <><button type="button" className="storage-photo-prev" aria-label="Предыдущее фото" onClick={() => move(-1)}>←</button><button type="button" className="storage-photo-next" aria-label="Следующее фото" onClick={() => move(1)}>→</button><span className="storage-photo-count" role="status" aria-live="polite">{selected+1} / {photos.length}</span></>}
  {!expanded && <button type="button" className="storage-photo-enlarge" aria-label={`Увеличить фото: ${item.title}`} onClick={open}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg></button>}
 </div>;
 return <article className={`storage-visual-card${dressing ? ' storage-dressing-card' : ''}`} data-storage-id={item.id} aria-labelledby={titleId}>
  {gallery()}
  <div className="storage-visual-caption"><h3 id={titleId}>{item.title}</h3><p>{description}</p><button type="button" className="storage-model-details" onClick={open}>Подробнее <Arrow /></button></div>
  <dialog ref={modal} className="storage-model-dialog" aria-labelledby={dialogTitle} onClick={event => {if(event.target===event.currentTarget)modal.current?.close();}}>
   <header><h2 id={dialogTitle}>{item.title}</h2><button type="button" className="storage-model-close" aria-label="Закрыть просмотр модели" onClick={() => modal.current?.close()}>×</button></header>
   {gallery(true)}<p className="storage-model-description">{description}</p>
   <CatalogCTA context={context} onContact={onContact} />
  </dialog>
 </article>;
}
