import { useId, useRef, useState } from 'react';
import { contacts, type OpenContact } from '../data/content';
import { assetUrl } from '../assetUrl';
import { ContactIcon } from '../components/Brand';
import { Arrow } from '../components/UI';
import '../contacts-editorial.css';

const routePhotos = [
 { image: assetUrl('/images/visit/entrance.jpg'), alt: 'Вход № 2 в ТЦ «Город Косино»: стеклянные двери с оранжевой полосой', caption: 'Вход № 2' },
 { image: assetUrl('/images/visit/escalator.jpg'), alt: 'Эскалатор под вывеской «Интерьер Холл»', caption: 'Эскалатор к «Интерьер Холл»' },
 { image: assetUrl('/images/visit/salon.jpg'), alt: 'Подход к салону WALENZA: вывеска слева под «Интерьер Холл»', caption: 'Салон WALENZA слева' },
 { image: assetUrl('/images/visit/entrance-detail.jpg'), alt: 'Вход № 2 крупным планом: табличка рядом с дверями', caption: 'Вход крупным планом' },
];

function RoutePhotos() {
 const [selected, setSelected] = useState(0);
 const dialog = useRef<HTMLDialogElement>(null), title=useId();
 const move=(step:number)=>setSelected(index=>(index+step+routePhotos.length)%routePhotos.length);
 return <section className="contact-route-photos" aria-labelledby="contact-route-title"><h2 id="contact-route-title">Как пройти к салону</h2>
  <div className="contact-route-strip">{routePhotos.slice(0,3).map((photo,index)=><figure key={photo.image}><button type="button" aria-label={`Увеличить: ${photo.caption}`} onClick={()=>{setSelected(index);dialog.current?.showModal();}}><img src={photo.image} alt={photo.alt} loading="lazy" /></button><figcaption>{photo.caption}</figcaption></figure>)}</div>
  <dialog ref={dialog} className="contact-route-dialog" aria-labelledby={title} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}}}>
   <header><h2 id={title}>Как пройти к салону</h2><button type="button" aria-label="Закрыть фотографии маршрута" onClick={()=>dialog.current?.close()}>×</button></header>
   <img src={routePhotos[selected].image} alt={routePhotos[selected].alt} />
   <footer><p>{routePhotos[selected].caption}</p><div><button type="button" aria-label="Предыдущее фото маршрута" onClick={()=>move(-1)}>←</button><span role="status" aria-live="polite">{selected+1} / {routePhotos.length}</span><button type="button" aria-label="Следующее фото маршрута" onClick={()=>move(1)}>→</button></div></footer>
  </dialog>
 </section>;
}

export default function ContactsPage({ onContact }: { onContact: OpenContact }) {
 return <div className="container page-content contact-editorial-page">
  <header className="contact-editorial-heading"><h1>Как нас найти</h1><p>Приходите в салон или свяжитесь с нами</p></header>
  <div className="contact-editorial-layout">
   <div className="contact-editorial-data">
    <div className="contact-editorial-detail"><ContactIcon name="location" /><div><h2>Адрес салона</h2><p className="contact-editorial-address">{contacts.address}</p><p className="contact-editorial-landmarks">{contacts.landmarks}</p></div></div>
    <div className="contact-editorial-detail"><ContactIcon name="clock" /><div><h2>Часы работы</h2><p>{contacts.hours}</p></div></div>
    <div className="contact-editorial-detail"><ContactIcon name="phone" /><div className="contact-channel-content"><h2>Телефоны</h2><div className="contact-channel-row"><div className="contact-channel-values"><a href={contacts.phoneHref}>{contacts.phone}</a><a href={contacts.extraPhoneHref}>{contacts.extraPhone}</a></div><a className="button contact-call-action" href={contacts.phoneHref}>Позвонить в салон <Arrow /></a></div></div></div>
    <div className="contact-editorial-detail"><ContactIcon name="mail" /><div className="contact-channel-content"><h2>Электронная почта</h2><div className="contact-channel-row"><div className="contact-channel-values">{contacts.emails.map(email=><a key={email} href={`mailto:${email}`}>{email}</a>)}</div><a className="contact-action-link contact-mail-action" href={`mailto:${contacts.emails[0]}`}>Написать на почту <Arrow /></a></div></div></div>
    <div className="contact-editorial-actions" aria-label="Связаться с салоном"><button type="button" className="button" onClick={()=>onContact({kind:'request',context:'Страница контактов'})}>Оставить заявку <Arrow /></button><button type="button" className="button contact-director-action" onClick={()=>onContact({kind:'director'})}>Написать директору <Arrow /></button></div>
    <a className="text-link contact-editorial-vk" href={contacts.vkUrl} target="_blank" rel="noopener noreferrer">ВКонтакте <Arrow /></a>
   </div>
   <div className="contact-editorial-location">
    <div className="contact-editorial-map"><iframe src={contacts.mapWidgetUrl} title="Салон WALENZA на Яндекс Картах" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><div><a href={contacts.mapRouteUrl} target="_blank" rel="noopener noreferrer">Построить маршрут <Arrow /></a><a href={contacts.mapUrl} target="_blank" rel="noopener noreferrer">Открыть Яндекс Карты <Arrow /></a></div></div>
    <RoutePhotos />
   </div>
  </div>
 </div>;
}
