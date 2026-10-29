import { Link } from 'react-router-dom';
import { promotions, type Promotion } from '../data/content';
import { Arrow } from '../components/UI';
import { LineIcon } from '../components/Editorial';
import '../promotions-editorial.css';

export function PromotionsOverview() {
 return <div className="container page-content promotions-editorial">
  <header className="promotions-heading"><h1>Акции</h1><p>Предложения салона</p></header>
  <p className="promotions-prototype-note">Примеры карточек для проверки раздела. Действующие акции, скидки и сроки не заявлены.</p>
  <div className="promotions-editorial-grid">{promotions.map(item=><Link key={item.id} className="promotion-editorial-card" to={`/promotions/${item.id}`}>
   <span className="promotion-card-top"><LineIcon name={item.id==='season'?'clock':'samples'}/>{item.demo&&<span className="promotion-demo-label">Демонстрационная акция</span>}</span>
   <h2>{item.title}</h2><p>{item.description}</p><span className="promotion-card-action">Посмотреть пример <Arrow/></span>
  </Link>)}</div>
 </div>;
}

export function PromotionPresentation({ item }: { item: Promotion }) {
 return <div className="container page-content promotions-editorial promotion-editorial-detail">
  <Link className="promotions-back" to="/promotions"><span aria-hidden="true">←</span> Все акции</Link>
  <header className="promotions-heading"><h1>{item.title}</h1><p>{item.description}</p></header>
  {item.demo&&<span className="promotion-demo-label">Демонстрационная акция</span>}
  <section className="promotion-conditions" aria-labelledby="promotion-conditions-title"><LineIcon name="project"/><div><h2 id="promotion-conditions-title">Условия пока не утверждены</h2><p>Здесь появятся состав предложения, период действия, ограничения и порядок участия. Этот пример не является действующей акцией.</p></div></section>
  <nav className="promotion-detail-actions" aria-label="Дальнейшие действия"><Link className="text-link" to="/promotions">Вернуться к акциям <Arrow/></Link><Link className="button" to="/kitchens">Познакомиться с моделями <Arrow/></Link></nav>
 </div>;
}
