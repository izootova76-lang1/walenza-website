import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../assetUrl';
import { Arrow } from '../components/UI';
import { models, type OpenContact } from '../data/content';
import { libraryMedia, materialSamples, rifPresentation, rifGalleryFrames, type SourceCrop } from '../data/materialLibrary';

// Pending frame descriptions remain in the source data, outside the public gallery.
const availableFrames = rifGalleryFrames.flatMap(frame => frame.mediaId && libraryMedia[frame.mediaId] ? [{ ...frame, mediaId: frame.mediaId }] : []);

// CSS viewport only: original files, colour and pixel geometry remain intact.
function SourceImage({ mediaId, crop, alt }: { mediaId: string; crop?: SourceCrop; alt?: string }) {
 const media = libraryMedia[mediaId];
 const style = crop ? { aspectRatio: `${crop.width}/${crop.height}`, '--source-width': `${crop.sourceWidth / crop.width * 100}%`, '--source-left': `${-crop.x / crop.width * 100}%`, '--source-top': `${-crop.y / crop.height * 100}%` } as CSSProperties : undefined;
 return <span className={`rif-source-image${crop ? ' is-cropped' : ''}`} style={style}><img src={assetUrl(media.path)} alt={alt ?? media.alt} /></span>;
}
export default function RifPrototype({ onContact, returnTo }: { onContact: OpenContact; returnTo: string }) {
 const [active, setActive] = useState(0);
 const [sampleId, setSampleId] = useState(rifPresentation.sampleIds[0]);
 const [zoom, setZoom] = useState(false);
 const sampleDialog = useRef<HTMLDialogElement>(null);
 const galleryDialog = useRef<HTMLDialogElement>(null);
 const frame = availableFrames[active];
 const sample = materialSamples[sampleId];
 const selectSample = (id: string) => { setSampleId(id); setZoom(false); sampleDialog.current?.showModal(); };
 const move = (step: number) => setActive(index => (index + step + availableFrames.length) % availableFrames.length);
 const touch = useRef<{ x: number; y: number } | null>(null);
 return <div className="container page-content compact-kitchen-sample rif-prototype">
  <div className="breadcrumbs"><Link to={returnTo}>Кухни</Link><span>/</span><span>Риф</span></div>
  <article className="rif-layout">
   <header className="rif-heading"><h1>Риф</h1><p>Рифлёные фасады с выразительным вертикальным ритмом.</p></header>
   <section className="rif-gallery" aria-label="Изображения кухни «Риф»">
    <div className="rif-main-photo" tabIndex={0} role="group" aria-label="Изображения кухни. Переключение стрелками влево и вправо." onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } }} onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchCancel={() => { touch.current = null; }} onTouchEnd={e => { if (!touch.current) return; const dx = e.changedTouches[0].clientX - touch.current.x, dy = e.changedTouches[0].clientY - touch.current.y; touch.current = null; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1); }}>
     <SourceImage mediaId={frame.mediaId} crop={frame.crop} alt={`Риф — ${frame.title.toLowerCase()}. ${frame.caption}`} /><button type="button" className="compact-enlarge" aria-label="Увеличить изображение кухни" onClick={() => galleryDialog.current?.showModal()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg></button>
    </div>
    <div className="rif-thumbnails" style={{ gridTemplateColumns: `repeat(${availableFrames.length}, minmax(0, 1fr))` }} role="group" aria-label="Выбрать изображение кухни">{availableFrames.map((item, index) => <button key={item.id} type="button" aria-label={item.title} aria-pressed={active === index} onClick={() => setActive(index)}><SourceImage mediaId={item.mediaId} crop={item.crop} alt="" /><span>{item.title}</span></button>)}</div>
    <p className="rif-photo-caption" aria-live="polite">{frame.caption}</p>
   </section>
   <div className="rif-copy">
    <dl className="compact-specs">{rifPresentation.specifications.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>
    <section className="rif-samples" aria-labelledby="rif-samples-title"><h2 id="rif-samples-title">Образцы фасада</h2><div className="rif-sample-options">{rifPresentation.sampleIds.map(id => { const entry = materialSamples[id]; return <button key={id} type="button" className="rif-sample" aria-label={`Рассмотреть: ${entry.name} — ${entry.previewLabel.toLowerCase()}`} aria-haspopup="dialog" onClick={() => selectSample(id)}><span className="rif-sample-preview"><SourceImage mediaId={entry.mediaId} crop={entry.displayCrop} /></span><span>{entry.name}</span><small>{entry.previewLabel}</small></button>; })}</div><p className="rif-material-note">Оттенок и фактура на экране могут отличаться. Посмотрите настоящие образцы в салоне.</p></section>
    <p className="compact-price">Стоимость — индивидуальный расчёт.</p><button className="button compact-request" onClick={() => onContact({ kind: 'request', context: 'Кухня «Риф»' })}>Оставить заявку <Arrow /></button>
   </div>
  </article>
  <section className="compact-related"><h2>Другие идеи для вашей кухни</h2><div>{models.filter(model => model.id !== 'rif').slice(0, 3).map(model => <Link key={model.id} to={`/kitchens/models/${model.id}?${new URLSearchParams({ return: returnTo })}`}><img src={model.image} alt={`Кухня «${model.title}»`} loading="lazy" /><span>{model.title} <Arrow /></span></Link>)}</div></section>
  <dialog ref={galleryDialog} className="rif-gallery-dialog" aria-labelledby="rif-gallery-dialog-title" onClick={e => { if (e.target === e.currentTarget) galleryDialog.current?.close(); }} onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } }}>
   <header><h2 id="rif-gallery-dialog-title">Риф — {frame.title.toLowerCase()}</h2><button type="button" aria-label="Закрыть изображение" onClick={() => galleryDialog.current?.close()}>×</button></header>
   <div className="rif-gallery-inspect">{frame.mediaId && <SourceImage mediaId={frame.mediaId} crop={frame.crop} alt={`Риф — ${frame.title.toLowerCase()}. ${frame.caption}`} />}</div>
   <footer><button type="button" aria-label="Предыдущее изображение" onClick={() => move(-1)}>←</button><p aria-live="polite">{frame.caption}</p><button type="button" aria-label="Следующее изображение" onClick={() => move(1)}>→</button></footer>
  </dialog>
  <dialog ref={sampleDialog} className="rif-sample-dialog" aria-labelledby="rif-sample-dialog-title" onClose={() => setZoom(false)} onClick={e => { if (e.target === e.currentTarget) sampleDialog.current?.close(); }}>
   <header><h2 id="rif-sample-dialog-title">Риф</h2><button type="button" aria-label="Закрыть образец" onClick={() => sampleDialog.current?.close()}>×</button></header>
   <div className="rif-sample-shades" role="group" aria-label="Выбрать образец фасада">{rifPresentation.sampleIds.map(id => <button type="button" key={id} aria-label={materialSamples[id].previewLabel} aria-pressed={sampleId === id} onClick={() => { setSampleId(id); setZoom(false); }}>{id === 'rif-light' ? 'Светлый' : 'Тёмный'}</button>)}</div>
   <div className={`rif-sample-inspect${zoom ? ' is-zoomed' : ''}`} style={{ '--sample-ratio': `${sample.displayCrop!.width}/${sample.displayCrop!.height}` } as CSSProperties} tabIndex={zoom ? 0 : undefined} aria-label={`${sample.previewLabel}: рельеф крупным планом`}><SourceImage mediaId={sample.mediaId} crop={sample.displayCrop} /></div>
   <button className="rif-relief-toggle" type="button" aria-pressed={zoom} onClick={() => setZoom(value => !value)}>{zoom ? 'Показать целиком' : 'Увеличить рельеф'}</button>
   <p className="rif-material-note">Оттенок и фактура могут отличаться. Настоящие образцы — в салоне.</p>
  </dialog>
 </div>;
}
