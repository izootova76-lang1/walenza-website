import { Link } from 'react-router-dom';
import { collections, type Model } from '../data/content';
import { Arrow } from './UI';

// Presentation choices only. Membership still comes from each existing model.
const covers: Record<string, { modelId: string; position?: string }> = {
 top: { modelId: 'rif', position: '50% 47%' },
 neoclassic: { modelId: 'verona', position: '50% 52%' },
 wood: { modelId: 'contour', position: '50% 52%' },
 character: { modelId: 'terracotta', position: '50% 55%' },
 'art-deco': { modelId: 'oak-room', position: '50% 55%' },
 classic: { modelId: 'olive', position: '50% 68%' },
};

export default function KitchenDirections({ models }: { models: Model[] }) {
 return <nav className="kitchen-direction-grid" aria-label="Направления кухонь">
  {collections.map(direction => {
   const cover = covers[direction.id];
   const model = models.find(item => item.id === cover?.modelId && item.collections.includes(direction.id));
   if (!model) return <div className="kitchen-direction-unavailable" key={direction.id}><h2>{direction.title}</h2><p>Обложка направления ожидает материалов.</p></div>;
   return <Link key={direction.id} className="kitchen-direction-card" to={`/kitchens?${new URLSearchParams({ collection: direction.id })}`} data-direction={direction.id} data-cover-model={model.id}>
    <div className="kitchen-direction-photo"><img src={model.image} alt={`Кухня «${model.title}» — пример направления «${direction.title}»`} style={{ objectPosition: cover.position }} loading="lazy" /></div>
    <div className="kitchen-direction-caption"><h2>{direction.title}</h2><Arrow /></div>
   </Link>;
  })}
 </nav>;
}
