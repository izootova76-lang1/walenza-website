import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navigation } from '../data/content';
import { Arrow } from './UI';

export function Header({ onContact }: { onContact: () => void }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);
  return <><a className="skip-link" href="#main" onClick={event => { event.preventDefault(); const main = document.getElementById('main'); main?.focus(); main?.scrollIntoView(); }}>К содержимому</a><header className="site-header"><div className="header-top container"><Link className="logo" to="/" aria-label="WALENZA — главная">WALENZA<span>мебель, которая становится домом</span></Link><p className="header-region">Мебель на заказ<br /><span>Москва и Московская область</span></p><div className="header-contact"><span>Контакты уточняются</span><button onClick={onContact}>Телефон · MAX · Telegram <Arrow /></button></div><button className="menu-toggle" ref={toggleRef} aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button></div><nav id="main-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Основная навигация" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } }}><div className="container nav-inner">{navigation.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'}>{item.label}</NavLink>)}<button onClick={onContact}>Обсудить проект <Arrow /></button></div></nav></header></>;
}
export function Footer() { return <footer className="site-footer container"><div className="footer-main"><div><Link className="logo" to="/">WALENZA</Link><p>Кухни. Шкафы. Ваше пространство.</p></div><div className="footer-links">{navigation.slice(1).map(item => <Link key={item.path} to={item.path}>{item.label}</Link>)}</div><div><p>Москва и Московская область</p><Link className="text-link" to="/contacts">Способы связи <Arrow /></Link><p className="muted">Данные ожидают подтверждения</p></div></div><div className="footer-bottom"><span>WALENZA · Архитектурный прототип</span><span>Все иллюстрации, модели, проекты, отзывы и акции — демонстрационные.</span></div></footer>; }
export function ScrollAndTitle() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    const anchor = hash ? document.getElementById(hash.slice(1)) : null;
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
    const section = navigation.find(item => item.path !== '/' && pathname.startsWith(item.path));
    document.title = `${section?.label || (pathname === '/' ? 'Мебель для вашей жизни' : 'Страница не найдена')} — WALENZA`;
    const focusTarget = anchor || document.getElementById('main');
    if (anchor) anchor.setAttribute('tabindex', '-1');
    focusTarget?.focus({ preventScroll: true });
  }, [pathname, search, hash]);
  return null;
}
export function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open && !ref.current?.open) ref.current?.showModal(); else if (!open && ref.current?.open) ref.current.close(); }, [open]);
  return <dialog ref={ref} className="contact-dialog" onCancel={onClose} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div className="dialog-body"><button className="dialog-close" aria-label="Закрыть окно" onClick={onClose}>✕</button><p className="eyebrow">WALENZA · Прототип</p><h2>Обсудим ваше пространство</h2><p>Здесь будут доступны телефон, MAX и Telegram. Подтверждённые реквизиты пока не предоставлены.</p><div className="contact-methods">{['Телефон', 'MAX', 'Telegram'].map(method => <div key={method}><strong>{method}</strong><span>Ожидает подтверждения</span></div>)}</div><p className="muted">Это демонстрационное окно: данные не собираются, сообщения не отправляются. Telegram AI-консультант предусмотрен для будущего этапа.</p><button className="button" onClick={onClose}>Понятно <Arrow /></button></div></dialog>;
}
