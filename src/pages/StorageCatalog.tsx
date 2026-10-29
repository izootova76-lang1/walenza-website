import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { furnitureDirections, type OpenContact } from '../data/content';
import { storageItems } from '../data/storage';
import WardrobeCategories from '../components/WardrobeCategories';
import { StorageCollection } from '../components/StorageCard';
import { Arrow, Demo, SectionHeading } from '../components/UI';
import '../storage-catalog.css';

export default function StorageCatalog({ onContact }: { onContact: OpenContact }) {
 const { hash } = useLocation();
 const id = hash.slice(1);
 const wardrobes = id === 'wardrobes', dressing = id === 'dressing';
 const additional = id === 'additional' || furnitureDirections.some(item => item.id === id);
 const selection = wardrobes || dressing || additional;
 useEffect(() => {
  if (!id || id === 'wardrobes' || id === 'dressing') window.scrollTo({ top: 0, behavior: 'instant' });
 }, [id]);
 const directions = [
  { id: 'wardrobes', title: 'Шкафы', item: storageItems.find(item => item.kind === 'wardrobe') },
  { id: 'dressing', title: 'Гардеробные', item: storageItems.find(item => item.kind === 'dressing') },
 ];
 return <div className="container page-content storage-editorial">
  {selection && <Link className="storage-directions-back" to="/furniture"><span aria-hidden="true">←</span> К выбору направлений</Link>}
  <header className="storage-editorial-heading"><h1>{dressing ? 'Гардеробные' : additional ? 'Корпусная мебель' : 'Шкафы'}</h1>{!selection && <p>Снаружи — стиль. Внутри — порядок.</p>}</header>
  {!selection && <div className="storage-direction-grid">{directions.map(direction => {
   const photo = direction.item?.images.facades || direction.item?.images.interior;
   return photo && <Link className="storage-direction-card" key={direction.id} to={`/furniture#${direction.id}`}><div className="storage-direction-photo"><img src={photo.src} alt={photo.alt} /></div><div className="storage-direction-caption"><h2>{direction.title}</h2><Arrow /></div></Link>;
  })}</div>}
  {wardrobes && <section id="wardrobes" aria-label="Модели шкафов"><WardrobeCategories onContact={onContact} /></section>}
  {dressing && <section id="dressing" aria-label="Модели гардеробных"><StorageCollection items={storageItems.filter(item => item.kind === 'dressing')} onContact={onContact} dressing /></section>}
  {additional && <section id="additional"><SectionHeading eyebrow="Дополнительная корпусная мебель" title="Для других комнат и привычек" /><div className="furniture-directions">{furnitureDirections.map(item => <details key={item.id} id={item.id}><summary>{item.title}<span aria-hidden="true">+</span></summary><div><Demo>Демонстрационное направление</Demo><p>{item.text}</p><button className="text-link" onClick={() => onContact({ kind: 'request', context: item.title })}>Обсудить задачу <Arrow /></button></div></details>)}</div></section>}
  <footer className="storage-catalog-foot"><p>Визуалы предоставлены заказчиком. Названия изделий — рабочие, для согласования прототипа. Материалы, размеры и комплектация уточняются индивидуально. Стоимость — индивидуальный расчёт.</p><Link className="text-link" to="/materials">Посмотреть материалы <Arrow /></Link></footer>
 </div>;
}
