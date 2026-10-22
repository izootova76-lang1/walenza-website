import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../assetUrl';
import { Arrow } from './UI';

const slides = [
 { id: 'terracotta', title: 'Графит и тёплые акценты', detail: 'terracotta-fragment', to: '/kitchens/models/terracotta', alt: 'Серая кухня с выразительным фартуком, барной стойкой и круглым обеденным столом', detailAlt: 'Фрагмент серой кухни: стеклянный фасад, фартук и рабочая поверхность' },
 { id: 'contour', title: 'Древесная фактура и чёткие линии', detail: 'contour-fragment', to: '/kitchens/models/contour', alt: 'Угловая кухня с древесными фасадами, светлой столешницей и тёмными деталями', detailAlt: 'Древесный рисунок фасадов и линии выдвижных ящиков крупным планом' },
 { id: 'olive', title: 'Спокойный цвет, выразительные детали', detail: 'olive-fragment', to: '/kitchens/models/olive', alt: 'Зелёная П-образная кухня с рамочными фасадами в помещении с деревянными балками', detailAlt: 'Фрагмент зелёных рамочных фасадов и стеклянных вставок' },
 { id: 'oak-room', title: 'Тепло дерева и лёгкость стекла', detail: 'oak-fragment', to: '/kitchens/models/oak-room', alt: 'Кухня с древесными фасадами, стеклянной витриной и круглым столом', detailAlt: 'Фрагмент высокой стеклянной витрины с посудой' },
 { id: 'dining', title: 'Место для долгих разговоров', detail: 'dining-fragment', to: '/kitchens', alt: 'Обеденная зона с зелёным диваном, столом и подсвеченной стеклянной витриной', detailAlt: 'Посуда на стеклянных полках подсвеченной витрины' },
];

export default function HomeShowcase() {
 const [active, setActive] = useState(0);
 const startTouch = useRef<{ x: number; y: number } | null>(null);
 const slidesId = useId();
 const move = (direction: number) => setActive(current => (current + direction + slides.length) % slides.length);
 const current = slides[active];
 return <section className="home-showcase container" aria-label="Кухни в интерьере" aria-roledescription="карусель">
  <div className="showcase-intro"><p className="eyebrow">WALENZA / пространство для жизни</p><h1>Дом начинается<br />с ваших идей.</h1><p>Кухни, шкафы и мебель на заказ.<br />Для вашего пространства и привычек.</p><Link className="button" to="/kitchens">Найти свою кухню <Arrow /></Link><p className="showcase-signature">Продумать. Выбрать. Создать.</p></div>
  <div className="showcase-gallery">
   <div className="showcase-frames" id={slidesId} tabIndex={0} role="group" aria-label="Фотографии интерьера. Для просмотра используйте стрелки влево и вправо."
    onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}
    onTouchStart={event => { if (event.touches.length !== 1) { startTouch.current = null; return; } const touch = event.touches[0]; startTouch.current = { x: touch.clientX, y: touch.clientY }; }}
    onTouchMove={event => { if (event.touches.length !== 1) startTouch.current = null; }}
    onTouchCancel={() => { startTouch.current = null; }}
    onTouchEnd={event => {
     if (!startTouch.current) return;
     const touch = event.changedTouches[0];
     const dx = touch.clientX - startTouch.current.x, dy = touch.clientY - startTouch.current.y;
     startTouch.current = null;
     if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
    }}>
    {slides.map((slide, index) => <div key={slide.id} className="showcase-slide" hidden={index !== active} role="group" aria-roledescription="слайд" aria-label={`${index + 1} из ${slides.length}: ${slide.title}`}>
     <img className="showcase-main-image" src={assetUrl(`/images/kitchens/${slide.id}.jpg`)} alt={slide.alt} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} width="1400" height="1000" />
     <img className="showcase-detail-image" src={assetUrl(`/images/showcase/${slide.detail}.jpg`)} alt={slide.detailAlt} loading={index === 0 ? 'eager' : 'lazy'} width="440" height="900" />
    </div>)}
   </div>
   <div className="showcase-caption"><p role="status" aria-live="polite">{current.title}</p><Link className="text-link" to={current.to}>{current.id === 'dining' ? 'Посмотреть кухни' : 'Рассмотреть кухню'} <Arrow /></Link></div>
   <div className="showcase-controls"><button type="button" aria-label="Предыдущая композиция" aria-controls={slidesId} onClick={() => move(-1)}>←</button><div className="showcase-dots" role="group" aria-label="Выбрать композицию">{slides.map((slide, index) => <button type="button" key={slide.id} aria-label={`Показать: ${slide.title}`} aria-pressed={active === index} aria-controls={slidesId} onClick={() => setActive(index)}><span aria-hidden="true" /></button>)}</div><button type="button" aria-label="Следующая композиция" aria-controls={slidesId} onClick={() => move(1)}>→</button></div>
  </div>
 </section>;
}
