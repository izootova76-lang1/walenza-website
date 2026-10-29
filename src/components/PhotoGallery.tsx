import { useRef, useState } from 'react';

export type GalleryPhoto = { image: string; alt: string; caption?: string };
export default function PhotoGallery({ photos, label, compact = false }: { photos: GalleryPhoto[]; label: string; compact?: boolean }) {
 const track = useRef<HTMLDivElement>(null);
 const [active, setActive] = useState(0);
 const move = (step: number) => { const next = Math.max(0, Math.min(photos.length - 1, active + step)); track.current?.children[next]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest', inline: 'start' }); };
 return <section className={`journal-gallery${compact ? ' journal-gallery--compact' : ''}`} aria-label={label}>
  <div ref={track} className="journal-gallery-track" tabIndex={0} role="region" aria-label={`${label}. Используйте стрелки влево и вправо или прокрутку.`} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }} onScroll={() => { const el = track.current; if (!el) return; const nearest = [...el.children].reduce((best, child, index) => Math.abs((child as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft) < Math.abs((el.children[best] as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft) ? index : best, 0); setActive(nearest); }}>
   {photos.map(photo => <figure key={photo.image}><img src={photo.image} alt={photo.alt} loading="lazy" /><figcaption>{photo.caption || photo.alt}</figcaption></figure>)}
  </div>
  {photos.length > 1 && <div className="journal-gallery-controls"><span aria-live="polite">{active + 1} из {photos.length}</span><button type="button" aria-label="Предыдущее фото" disabled={active === 0} onClick={() => move(-1)}>←</button><button type="button" aria-label="Следующее фото" disabled={active === photos.length - 1} onClick={() => move(1)}>→</button></div>}
 </section>;
}
