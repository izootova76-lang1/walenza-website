import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { models, type Model, type OpenContact } from '../data/content';
import { type StorageItem } from '../data/storage';
import StorageModelCard from './StorageModelCard';
import { Arrow } from './UI';

type Photo = { image: string; alt: string; caption?: string };
export function LargePhoto({ photos, selected, onChange, label }: { photos: Photo[]; selected: number; onChange: (index: number) => void; label: string }) {
 const dialog = useRef<HTMLDialogElement>(null);
 const heading = useId();
 const move = (step: number) => onChange((selected + step + photos.length) % photos.length);
 return <><button type="button" className="compact-enlarge" aria-label={`Увеличить фото: ${label}`} onClick={() => dialog.current?.showModal()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg></button><dialog ref={dialog} className="compact-photo-dialog" aria-labelledby={heading} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); move(e.key === 'ArrowRight' ? 1 : -1); } }}><header><h2 id={heading}>{label}</h2><button type="button" aria-label="Закрыть фото" onClick={() => dialog.current?.close()}>×</button></header><img src={photos[selected].image} alt={photos[selected].alt} />{photos[selected].caption && <p className="compact-photo-caption">{photos[selected].caption}</p>}<div className="compact-photo-controls"><button type="button" aria-label="Предыдущее фото" onClick={() => move(-1)}>←</button><span aria-live="polite">{selected + 1} из {photos.length}</span><button type="button" aria-label="Следующее фото" onClick={() => move(1)}>→</button></div></dialog></>;
}

export function CompactKitchenSample({ model, onContact, returnTo }: { model: Model; onContact: OpenContact; returnTo: string }) {
 const photos = [{ image: model.image, alt: `Кухня «${model.title}»`, caption: model.imageCaption || model.sourceLabel }, ...(model.additionalImages || []).map(photo => ({ ...photo, caption: photo.alt }))];
 const [selected, setSelected] = useState(0);
 const start = useRef<{ x: number; y: number } | null>(null);
 const move = (step: number) => setSelected(index => (index + step + photos.length) % photos.length);
 const related = models.filter(item => item.id !== model.id).slice(0, 3);
 return <div className="container page-content model-detail-page compact-kitchen-sample">
  <div className="breadcrumbs"><Link to={returnTo}>Кухни</Link><span>/</span><span>{model.title}</span></div>
  <article className="compact-kitchen-layout">
   <header className="compact-kitchen-heading"><h1>{model.title}</h1>{model.workingTitle && <span className="model-title-note">Рабочее название</span>}<p>{model.subtitle.replace(/\.$/, '')}.</p></header>
   <section className="compact-kitchen-gallery" aria-label={`Фотографии кухни «${model.title}»`}>
    <div className="compact-kitchen-photo" tabIndex={0} role="group" aria-label="Ракурсы кухни. Стрелки влево и вправо для переключения." onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } }} onTouchStart={e => { const p = e.touches[0]; start.current = { x: p.clientX, y: p.clientY }; }} onTouchCancel={() => { start.current = null; }} onTouchEnd={e => { if (!start.current) return; const p = e.changedTouches[0], dx = p.clientX - start.current.x, dy = p.clientY - start.current.y; start.current = null; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1); }}>
     {photos.map((photo, index) => <img key={photo.image} src={photo.image} alt={photo.alt} hidden={index !== selected} />)}
     <LargePhoto photos={photos} selected={selected} onChange={setSelected} label={`Кухня «${model.title}»`} />
    </div>
    <div className="compact-thumbnails" role="group" aria-label="Выбрать ракурс">{photos.map((photo, index) => <button type="button" key={photo.image} aria-label={`Ракурс ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={photo.image} alt="" /></button>)}</div>
   </section>
   <div className="compact-kitchen-copy">{!model.workingTitle && !/уточня/i.test(model.facades) && <dl className="compact-specs"><div><dt>Фасады и отделка</dt><dd>{model.facades}</dd></div></dl>}<p className="compact-price">Стоимость — индивидуальный расчёт.</p><button className="button compact-request" onClick={() => onContact({ kind: 'request', context: `Кухня «${model.title}»` })}>Оставить заявку <Arrow /></button><Link className="text-link compact-back" to={returnTo}>Вернуться к выбранным кухням <Arrow /></Link></div>
  </article>
  <section className="compact-related"><h2>Другие идеи для вашей кухни</h2><div>{related.map(item => <Link key={item.id} to={`/kitchens/models/${item.id}?${new URLSearchParams({ return: returnTo })}`}><img src={item.image} alt={`Кухня «${item.title}»`} loading="lazy" /><span>{item.title} <Arrow /></span></Link>)}</div></section>
 </div>;
}

export function CompactStorageSample({ item, onContact }: { item: StorageItem; onContact: OpenContact }) { return <StorageModelCard item={item} onContact={onContact} />; }
