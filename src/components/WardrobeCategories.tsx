import { Link, useSearchParams } from 'react-router-dom';
import { type OpenContact } from '../data/content';
import { storageItems, wardrobeCategories, type WardrobeDoorType } from '../data/storage';
import { StorageCollection } from './StorageCard';

export default function WardrobeCategories({ onContact }: { onContact: OpenContact }) {
 const [params] = useSearchParams();
 const categories = wardrobeCategories.map(category => ({ ...category, items: storageItems.filter(item => item.kind === 'wardrobe' && item.doorType === category.id) })).filter(category => category.items.length > 0);
 const active = categories.find(category => category.id === params.get('doors')) || categories[0];
 if (!active) return null;
 const categoryLink = (id: WardrobeDoorType) => { const next = new URLSearchParams(params); next.set('doors', id); return { pathname: '/furniture', search: `?${next}`, hash: '#wardrobes' }; };
 return <div className="wardrobe-categories">
  {categories.length > 1 ? <nav className="wardrobe-category-switch" aria-label="Тип открывания шкафа">{categories.map(category => <Link key={category.id} to={categoryLink(category.id)} aria-current={category.id === active.id ? 'true' : undefined} aria-controls="wardrobe-category-content">{category.title}</Link>)}</nav> : <h2 className="storage-category-title">{active.title}</h2>}
  <div id="wardrobe-category-content" role="region" aria-label={active.title}>
   {active.items.length > 0 ? <StorageCollection key={active.id} items={active.items} onContact={onContact} /> : <p className="wardrobe-category-empty">Предварительный просмотр категории. Подтверждённые модели и фотографии шкафов-купе пока не добавлены.</p>}
  </div>
 </div>;
}
