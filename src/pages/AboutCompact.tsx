import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow } from '../components/UI';
import { team } from '../data/salon';
import { type OpenContact } from '../data/content';
import { factoryPhotos } from '../data/factory';
import '../catalog-cta.css';
import '../about-editorial.css';

function FactoryGallery() {
 const [selected, setSelected] = useState(0);
 const dialog = useRef<HTMLDialogElement>(null);
 const title = useId();
 const move = (step: number) => setSelected(index => (index + step + factoryPhotos.length) % factoryPhotos.length);
 const open = (index: number) => { setSelected(index); dialog.current?.showModal(); };
 return <div className="salon-factory-gallery">
  <div className="salon-factory-grid">{[0, 3, 2].map(index => {
   const photo = factoryPhotos[index];
   return <figure key={photo.file}><button type="button" onClick={() => open(index)} aria-label={`Увеличить: ${photo.caption}`}><img src={photo.image} alt={photo.alt} loading="lazy" /><span className="salon-photo-zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg></span></button><figcaption>{photo.caption}</figcaption></figure>;
  })}</div>
  <dialog ref={dialog} className="salon-photo-dialog" aria-labelledby={title} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
   <header><h2 id={title}>Фабрика WALENZA</h2><button type="button" aria-label="Закрыть фотографии фабрики" onClick={() => dialog.current?.close()}>×</button></header>
   <img src={factoryPhotos[selected].image} alt={factoryPhotos[selected].alt} />
   <footer><p>{factoryPhotos[selected].caption}</p><div><button type="button" aria-label="Предыдущее фото фабрики" onClick={() => move(-1)}>←</button><span role="status" aria-live="polite">{selected + 1} / {factoryPhotos.length}</span><button type="button" aria-label="Следующее фото фабрики" onClick={() => move(1)}>→</button></div></footer>
  </dialog>
 </div>;
}

export default function AboutCompact({ onContact }: { onContact: OpenContact }) {
 return <div className="container page-content salon-editorial-page">
  <header className="salon-editorial-heading"><h1>О салоне</h1><p>От первой идеи — до вашей мебели</p></header>
  <section className="salon-intro" aria-label="Московский салон и его команда">
   <div className="salon-intro-copy">
    <p className="salon-intro-lead">Московский салон WALENZA — кухни, шкафы и гардеробные на заказ. Здесь можно познакомиться с образцами, подобрать материалы и обсудить мебель для своего пространства.</p>
    <p>Анна Ярошинская и Татьяна Комарова помогают пройти путь от первой идеи до установки готовой мебели — с проектированием и сопровождением заказа.</p>
    <dl className="salon-interaction"><div><dt>Обсуждение дистанционно</dt><dd>Предварительный проект можно обсудить без поездки в салон.</dd></div><div><dt>Выездное проектирование</dt><dd>По запросу. Формат и условия выезда согласовываются отдельно.</dd></div></dl>
    <Link className="text-link salon-order-link" to="/customers#order">Как мы работаем <Arrow /></Link>
   </div>
   <div className="salon-team-portraits">{team.map(person => <figure key={person.id} data-person={person.id}><img src={person.image} alt={person.alt} width="800" height="1000" fetchPriority="high" /><figcaption><span>{person.name}</span><small>{person.role}</small></figcaption></figure>)}</div>
  </section>
  <section className="salon-production" aria-labelledby="salon-factory-title">
   <div className="salon-production-heading"><h2 id="salon-factory-title">Фабрика WALENZA</h2><p>Фабрика расположена в Ульяновске и производит кухни и мебель по индивидуальным проектам.</p></div>
   <FactoryGallery />
   <p className="salon-factory-source">Фотографии производства предоставлены заказчиком.</p>
  </section>
  <aside className="catalog-cta salon-invitation"><div><h2>Есть идея для вашего интерьера?</h2><p>Расскажите нам о ней — вместе обсудим возможное решение</p></div><button type="button" className="button" onClick={() => onContact({ kind: 'request', context: 'Знакомство с салоном WALENZA' })}>Обсудить проект <Arrow /></button></aside>
 </div>;
}
