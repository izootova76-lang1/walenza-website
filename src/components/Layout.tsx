import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { contacts, navigation, primaryNavigation, type ContactIntent, type OpenContact } from '../data/content';
import { Arrow } from './UI';
export function Header({ onContact }: { onContact: OpenContact }) {
 const [open, setOpen] = useState(false);
 const location = useLocation(); const toggleRef = useRef<HTMLButtonElement>(null);
 useEffect(() => { setOpen(false); }, [location.pathname, location.search, location.hash]);
 return <><a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); document.getElementById('main')?.scrollIntoView(); }}>К содержимому</a>
 <header className="site-header"><div className="header-top container">
  <Link className="logo" to="/" aria-label="WALENZA — главная">WALENZA<span>мебель, которая становится домом</span></Link>
  <div className="header-address"><p>{contacts.address}</p><span>Часы работы: {contacts.hours}</span></div>
  <div className="header-phones"><a className="primary-phone" href={contacts.phoneHref}>{contacts.phone}</a><a href={contacts.extraPhoneHref}>{contacts.extraPhone}</a></div>
  <div className="header-actions"><button className="button" onClick={() => onContact()}>Оставить заявку <Arrow /></button><button className="director-link" onClick={() => onContact({ kind: 'director' })}>Написать директору <Arrow /></button></div>
  <button className="menu-toggle" ref={toggleRef} aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
 </div><nav id="main-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Основная навигация" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } }}><div className="container nav-inner">{primaryNavigation.map(item => <NavLink key={item.path} to={item.path}>{item.label}</NavLink>)}<div className="mobile-secondary-nav"><Link to="/about">О салоне</Link><Link to="/promotions">Акции</Link></div></div></nav></header></>;
}
export function Footer() {
 return <footer className="site-footer container"><div className="footer-main"><div><Link className="logo" to="/">WALENZA</Link><p>Кухни, шкафы и мебель по индивидуальному заказу.</p><p className="muted">Рабочее название и палитра на согласовании.</p></div><div className="footer-links">{navigation.filter(item => item.path !== '/').map(item => <Link key={item.path} to={item.path}>{item.label}</Link>)}</div><div><a className="text-link" href={contacts.phoneHref}>{contacts.phone}</a><p>{contacts.address}</p><p>{contacts.hours}</p><Link to="/contacts" className="text-link">Способы связи <Arrow /></Link></div></div><div className="footer-bottom"><span>WALENZA · Архитектурный прототип</span><span>Кухни — по материалам салона; распределение по направлениям предварительное. Отзывы и новые сведения — на согласовании. Визуалы материалов и макеты акций — демонстрационные.</span></div></footer>;
}
export function ScrollAndTitle() {
 const { pathname, search, hash } = useLocation();
 const previousPath = useRef<string | null>(null);
 useEffect(() => {
  const anchor = hash ? document.getElementById(hash.slice(1)) : null;
  if (anchor) { if (anchor instanceof HTMLDetailsElement) anchor.open = true; anchor.scrollIntoView(); }
  else if (previousPath.current !== pathname) window.scrollTo({ top: 0, behavior: 'instant' });
  const section = navigation.find(item => item.path !== '/' && pathname.startsWith(item.path));
  document.title = `${section?.label || (pathname === '/' ? 'Мебель для вашей жизни' : 'Страница не найдена')} — WALENZA`;
  const target = anchor || (previousPath.current !== pathname ? document.getElementById('main') : null); if (anchor) anchor.setAttribute('tabindex', '-1'); target?.focus({ preventScroll: true });
  previousPath.current = pathname;
 }, [pathname, search, hash]);
 return null;
}
const dialogCopy = {
 visit: { title: 'Записаться в салон', text: 'Чтобы согласовать дату и время встречи, позвоните в салон или напишите на электронную почту. Онлайн-запись и подтверждение бронирования в прототипе не подключены.' },
 request: { title: 'Оставить заявку', text: 'Это предварительный просмотр сценария заявки. Поля ввода и отправка пока не подключены. Сейчас можно позвонить в салон или написать на электронную почту.' },
 director: { title: 'Написать директору', text: 'Это прямое обращение к Анне Ярошинской. Отдельный контакт для обращения к руководителю пока не предоставлен и требует подтверждения. Сообщение из прототипа не отправляется.' },
 max: { title: 'MAX — связь с салоном', text: 'Прямая ссылка салона в MAX пока не предоставлена. Это демонстрация будущего перехода, приложение мессенджера не открывается.' },
 telegram: { title: 'Telegram — связь с салоном', text: 'Прямая ссылка салона в Telegram пока не предоставлена. Этот канал предназначен для связи с сотрудником; это не AI-помощник.' },
 ai: { title: 'AI-помощник в Telegram', text: 'Будущий AI-помощник будет работать в отдельном Telegram-боте. Бот и его адрес пока не подключены. Встроенного чата на сайте нет.' },
};
export function ContactDialog({ intent, onClose, onContact }: { intent: ContactIntent | null; onClose: () => void; onContact: OpenContact }) {
 const ref = useRef<HTMLDialogElement>(null); const copy = dialogCopy[intent?.kind || 'request'];
 useEffect(() => { if (intent && !ref.current?.open) ref.current?.showModal(); else if (!intent && ref.current?.open) ref.current.close(); }, [intent]);
 return <dialog ref={ref} className="contact-dialog" aria-labelledby="contact-dialog-title" aria-describedby="contact-dialog-description" onCancel={onClose} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div className="dialog-body"><button className="dialog-close" aria-label="Закрыть окно" onClick={onClose}>✕</button><p className="eyebrow">WALENZA · Демонстрационный сценарий</p><h2 id="contact-dialog-title">{copy.title}</h2>{intent?.context && <p className="request-context">Выбранное решение: <strong>{intent.context}</strong></p>}<p id="contact-dialog-description">{copy.text}</p>
 {(intent?.kind === 'request' || intent?.kind === 'visit') && <div className="contact-methods"><a href={contacts.phoneHref}><strong>Позвонить в салон</strong><span>{contacts.phone}</span></a>{contacts.emails.map(email => <a key={email} href={`mailto:${email}`}><strong>Написать в салон</strong><span>{email}</span></a>)}{contacts.maxUrl && <a href={contacts.maxUrl}>MAX <Arrow /></a>}{contacts.telegramUrl && <a href={contacts.telegramUrl}>Telegram <Arrow /></a>}</div>}
 <p className="muted">Никакие данные не сохраняются и не отправляются.</p><button className="button" onClick={onClose}>Понятно <Arrow /></button></div></dialog>;
}
