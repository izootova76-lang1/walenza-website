import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { assetUrl } from '../assetUrl';
import { interiorSlides as slides } from '../data/interiorCarousel';
import type { OpenContact } from '../data/content';
import { Arrow } from './UI';
import '../interior-carousel.css';

const DURATION = 900;
const INTERVAL = 7000;

export default function HomeShowcase({ onContact }: { onContact: OpenContact }) {
 const [active, setActive] = useState(0);
 const [previous, setPrevious] = useState<number | null>(null);
 const [paused, setPaused] = useState(false);
 const [hovered, setHovered] = useState(false);
 const [focused, setFocused] = useState(false);
 const [visible, setVisible] = useState(true);
 const [inView, setInView] = useState(true);
 const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [announcement, setAnnouncement] = useState('');
 const [failure, setFailure] = useState('');
 const section = useRef<HTMLElement>(null);
 const images = useRef<(HTMLImageElement | null)[]>([]);
 const activeRef = useRef(0);
 const busy = useRef(false);
 const queued = useRef<number | null>(null);
 const finishTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 const alive = useRef(true);
 const touch = useRef<{ x: number; y: number } | null>(null);
 const slidesId = useId();
 const autoRunning = !paused && !reduced && !hovered && !focused && visible && inView;

 const select = useCallback(async function show(index: number) {
  if (index === activeRef.current && !busy.current) return;
  if (busy.current) { queued.current = index; return; }
  busy.current = true;
  const image = images.current[index];
  try {
   // Keep the outgoing image opaque until the incoming image is decoded.
   if (!image) throw new Error('Missing image');
   await image.decode();
   if (!alive.current) return;
   if (!image.naturalWidth) throw new Error('Invalid image');
   setFailure('');
   setPrevious(activeRef.current);
   activeRef.current = index;
   setActive(index);
   const finish = () => {
    setPrevious(null);
    busy.current = false;
    const next = queued.current;
    queued.current = null;
    if (next !== null && next !== activeRef.current) void show(next);
   };
   if (reduced) finish();
   else finishTimer.current = setTimeout(finish, DURATION);
  } catch {
   if (alive.current) { setFailure('Не удалось загрузить следующий интерьер. Текущий кадр сохранён.'); setPaused(true); }
   busy.current = false;
   queued.current = null;
  }
 }, [reduced]);

 function manual(index: number) {
  setPaused(true);
  setAnnouncement(`Интерьер ${index + 1} из ${slides.length}. ${slides[index].alt}`);
  void select(index);
 }
 const move = (direction: number) => manual((activeRef.current + direction + slides.length) % slides.length);

 useEffect(() => {
  alive.current = true;
  return () => { alive.current = false; clearTimeout(finishTimer.current); };
 }, []);
 useEffect(() => {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const change = () => {
   setReduced(media.matches);
   if (media.matches) {
    setPaused(true);
    clearTimeout(finishTimer.current);
    setPrevious(null);
    busy.current = false;
    queued.current = null;
   }
  };
  media.addEventListener('change', change);
  return () => media.removeEventListener('change', change);
 }, []);
 useEffect(() => {
  const change = () => setVisible(!document.hidden);
  change(); document.addEventListener('visibilitychange', change);
  const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting));
  if (section.current) observer.observe(section.current);
  return () => { document.removeEventListener('visibilitychange', change); observer.disconnect(); };
 }, []);
 useEffect(() => {
  if (!autoRunning) return;
  const timer = setTimeout(() => void select((activeRef.current + 1) % slides.length), INTERVAL);
  return () => clearTimeout(timer);
 }, [active, autoRunning, select]);

 return <section ref={section} className="interior-hero" aria-label="Интерьерные фотографии WALENZA" aria-roledescription="карусель"
  onMouseEnter={event => { if (event.buttons === 0 && matchMedia('(hover: hover)').matches) setHovered(true); }} onMouseLeave={() => setHovered(false)}
  onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
  onKeyDown={event => {
   if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
   if (event.key === 'Home') { event.preventDefault(); manual(0); }
   if (event.key === 'End') { event.preventDefault(); manual(slides.length - 1); }
  }}
  onTouchStart={event => { setPaused(true); touch.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }}
  onTouchMove={event => { if (event.touches.length !== 1) touch.current = null; }} onTouchCancel={() => { touch.current = null; }}
  onTouchEnd={event => {
   if (!touch.current) return;
   const dx = event.changedTouches[0].clientX - touch.current.x, dy = event.changedTouches[0].clientY - touch.current.y;
   touch.current = null;
   if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
  }}>
  <div className="interior-hero-images" id={slidesId} tabIndex={0} role="group" aria-label="Фотографии интерьеров. Стрелки влево и вправо переключают кадры.">
   {slides.map((slide, index) => <picture key={slide.id} className={`interior-hero-slide${active === index ? ' is-active' : ''}${previous === index ? ' is-previous' : ''}`} data-slide={index + 1} data-fit={'fit' in slide ? slide.fit : 'cover'} aria-hidden={active !== index}>
    <source media="(max-width: 767px)" srcSet={assetUrl(`/images/interior-carousel/${slide.id}-mobile.webp`)} />
    <img ref={element => { images.current[index] = element; }} src={assetUrl(`/images/interior-carousel/${slide.id}-large.webp`)} width={slide.width} height={slide.height} alt={slide.alt} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'low'} decoding="async" />
   </picture>)}
  </div>
  <div className="interior-hero-shade" aria-hidden="true" />
  <div className="interior-hero-copy">
   <h1>Дом начинается<br />с ваших идей.</h1>
   <p>Кухни и шкафы на заказ</p>
   <button type="button" className="button interior-hero-cta" onClick={() => { setPaused(true); onContact({ kind: 'request', context: 'Индивидуальный проект' }); }}>Обсудить проект <Arrow /></button>
  </div>
  <div className="interior-hero-controls">
   <div className="interior-hero-arrows"><button type="button" aria-label="Предыдущий интерьер" aria-controls={slidesId} onClick={() => move(-1)}>←</button><button type="button" aria-label="Следующий интерьер" aria-controls={slidesId} onClick={() => move(1)}>→</button></div>
   <div className="interior-hero-dots" role="group" aria-label="Выбрать интерьер">{slides.map((slide, index) => <button type="button" key={slide.id} aria-label={`Показать интерьер ${index + 1}`} aria-pressed={index === active} aria-controls={slidesId} onClick={() => manual(index)}><span /></button>)}</div>
   <button type="button" className="interior-hero-play" disabled={reduced} aria-label={reduced ? 'Автосмена отключена: уменьшение движения' : paused ? 'Включить автоматическую смену' : 'Приостановить автоматическую смену'} aria-controls={slidesId} onClick={() => setPaused(value => !value)}>
    <svg viewBox="0 0 24 24" aria-hidden="true">{paused || reduced ? <path d="m9 5 10 7-10 7Z" /> : <><path d="M8 5v14" /><path d="M16 5v14" /></>}</svg>
   </button>
  </div>
  <span className="interior-hero-announcement" aria-live="polite" aria-atomic="true">{failure || announcement}</span>
 </section>;
}
