import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { contacts, navigation, primaryNavigation, type OpenContact } from '../data/content';
import { assetUrl } from '../assetUrl';
import { Brand, ContactIcon } from './Brand';
import { Arrow } from './UI';
const previews: Record<string, string> = { '/kitchens':'/images/kitchens/contour.jpg', '/furniture':'/images/storage/laguna-facades.jpg', '/projects':'/images/projects/soft-light.jpg', '/materials':'/images/materials/facades.jpg', '/about':'/images/team/anna.jpg' };
export default function PilotHeader({ onContact }: { onContact: OpenContact }) {
 const [open, setOpen] = useState(false);
 const [preview, setPreview] = useState('/kitchens');
 const dialog = useRef<HTMLDialogElement>(null);
 const location = useLocation();
 useEffect(() => { setOpen(false); }, [location.pathname, location.search, location.hash]);
 useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
 useEffect(() => { if (!open) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, [open]);
 const contact = (kind: 'request' | 'director') => { setOpen(false); onContact({ kind }); };
 return <><a className="skip-link" href="#main" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus(); }}>К содержимому</a>
  <header className="journal-header">
   <div className="journal-header-top"><div className="container journal-header-bar"><Brand />
    <nav className="journal-desktop-nav" aria-label="Основная навигация">{primaryNavigation.map(item => <NavLink key={item.path} to={item.path}>{item.label}</NavLink>)}</nav>
    <button className="journal-menu-toggle" aria-label="Открыть меню" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><span>Меню</span><span className="menu-lines" aria-hidden="true"><i /><i /></span></button>
   </div></div>
   <div className="container journal-header-contacts"><Link className="header-location" to="/contacts"><ContactIcon name="location" /><span>{contacts.address}</span></Link><div className="header-hours"><ContactIcon name="clock" /><strong>{contacts.hours}</strong></div><div className="journal-header-phones"><a href={contacts.phoneHref}><ContactIcon name="phone" /><strong>{contacts.phone}</strong></a><a href={contacts.extraPhoneHref}><ContactIcon name="phone" /><strong>{contacts.extraPhone}</strong></a></div></div>
  </header>
  <dialog ref={dialog} className="pilot-menu-dialog journal-menu-dialog" aria-labelledby="pilot-menu-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}><div className="pilot-menu-body">
   <div className="pilot-menu-heading"><h2 id="pilot-menu-title">Разделы сайта</h2><button className="pilot-close" aria-label="Закрыть меню" onClick={() => setOpen(false)}>×</button></div>
   <div className="journal-menu-layout"><nav aria-label="Разделы сайта">{navigation.filter(item => item.path !== '/').map(item => <NavLink key={item.path} className={['/kitchens','/furniture','/projects'].includes(item.path) ? 'menu-primary' : ''} to={item.path} onMouseEnter={() => setPreview(item.path)} onFocus={() => setPreview(item.path)}>{item.label}<Arrow /></NavLink>)}</nav><div className="journal-menu-preview"><img src={assetUrl(previews[preview] || '/images/kitchens/contour.jpg')} alt="" /><span>{preview === '/materials' ? 'Демонстрационные образцы' : navigation.find(item => item.path === preview)?.label}</span></div></div>
   <div className="pilot-menu-contacts"><a href={contacts.phoneHref}>{contacts.phone}</a><a href={contacts.extraPhoneHref}>{contacts.extraPhone}</a><p>{contacts.address}</p><p>Часы работы: {contacts.hours}</p></div>
   <div className="journal-menu-actions"><button className="button" onClick={() => contact('request')}>Оставить заявку <Arrow /></button><button className="text-link" onClick={() => contact('director')}>Написать директору <Arrow /></button></div>
  </div></dialog>
 </>;
}
