import { Link } from 'react-router-dom';
import HomeShowcase from '../components/HomeShowcase';
import ProjectsPresentation from '../components/ProjectPresentation';
import { team, teamText } from '../data/salon';
import { materialCategories, contacts, type OpenContact } from '../data/content';
import { customerSections } from '../data/customerPocket';
import { portfolioProjects } from '../data/portfolio';
import { storageItems } from '../data/storage';
import { Arrow } from '../components/UI';
import { LineIcon, type IconName } from '../components/Editorial';
import '../home-unified.css';

const buyerIcons: Record<string,IconName> = { order:'signed-document', payment:'payment', delivery:'delivery', warranty:'warranty', care:'cloth' };
export default function Home({ onContact }: { onContact: OpenContact }) {
 const kitchen=portfolioProjects.find(project=>project.id==='island')!.photos[0];
 const storage=storageItems.find(item=>item.id==='salon-dressing')!.images.facades!;
 return <>
  <HomeShowcase onContact={onContact}/>
  <div className="home-unified container">
   <section className="home-unified-section" aria-labelledby="home-catalog-title">
    <header className="home-unified-heading"><h2 id="home-catalog-title">Кухни и шкафы</h2></header>
    <div className="home-catalog-directions">
     <Link className="home-catalog-direction" to="/kitchens"><img src={kitchen.image} alt={kitchen.alt} loading="lazy"/><span><strong>Кухни</strong><Arrow/></span></Link>
     <Link className="home-catalog-direction" to="/furniture"><img src={storage.src} alt={storage.alt} loading="lazy"/><span><strong>Шкафы и гардеробные</strong><Arrow/></span></Link>
    </div>
   </section>
   <section className="home-unified-section" aria-label="Проекты и отзывы"><ProjectsPresentation preview/></section>
   <section className="home-unified-section" aria-labelledby="home-materials-title">
    <header className="home-unified-heading"><h2 id="home-materials-title">Материалы и детали</h2><p>Красота мебели начинается с фактур, поверхностей и продуманных деталей</p><Link className="text-link" to="/materials">Все материалы <Arrow/></Link></header>
    <div className="home-material-categories">{materialCategories.map(item=><Link key={item.id} to={`/materials?category=${item.id}`}><img src={item.image} alt={`Демонстрационный образец: ${item.title}`} loading="lazy"/><span><strong>{item.title}</strong><Arrow/></span></Link>)}</div>
    <p className="home-material-note">Изображения образцов — демонстрационные. Окончательный ассортимент предстоит согласовать.</p>
   </section>
   <section className="home-unified-section home-salon-preview" aria-labelledby="home-salon-title">
    <div className="home-salon-copy"><h2 id="home-salon-title">Знакомьтесь, Анна и Татьяна</h2><p>{teamText[0]}</p><Link className="text-link" to="/about">О салоне и команде <Arrow/></Link></div>
    <div className="home-salon-people">{team.map(person=><figure key={person.id}><img src={person.image} alt={person.alt} loading="lazy" width="800" height="1000"/><figcaption>{person.name}</figcaption></figure>)}</div>
   </section>
   <section className="home-unified-section home-buyer-preview" aria-labelledby="home-buyers-title">
    <header className="home-unified-heading"><h2 id="home-buyers-title">Покупателям</h2><p>Заказ, условия и уход за мебелью</p><Link className="text-link" to="/customers">Вся информация <Arrow/></Link></header>
    <div className="home-buyer-links">{customerSections.map(item=><Link key={item.id} to={`/customers#${item.id}`}><LineIcon name={buyerIcons[item.id]}/><span>{item.label}</span><Arrow/></Link>)}</div>
   </section>
   <section className="home-unified-section home-invitation" aria-labelledby="home-invitation-title">
    <div><h2 id="home-invitation-title">Есть идея для вашего интерьера?</h2><p>Расскажите нам о ней — вместе обсудим возможное решение</p><Link className="text-link" to="/contacts">Как нас найти <Arrow/></Link><p className="home-invitation-address">{contacts.address}</p></div>
    <div className="home-invitation-actions"><button type="button" className="button" onClick={()=>onContact({kind:'request'})}>Оставить заявку <Arrow/></button><button type="button" className="button home-director-button" onClick={()=>onContact({kind:'director'})}>Написать директору <Arrow/></button></div>
   </section>
  </div>
 </>;
}
