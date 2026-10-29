import { Link } from 'react-router-dom';
import { type Model } from '../data/content';
import { Arrow } from './UI';

export default function PilotModelCard({ model, returnTo }: { model: Model; returnTo: string }) {
 const target = `/kitchens/models/${model.id}?${new URLSearchParams({ return: returnTo })}`;
 return <article className="model-card pilot-model-card" data-model-id={model.id}><Link className="pilot-model-main" to={target} aria-label={`Кухня «${model.title}» — рассмотреть модель`}>
  <div className="card-image"><img src={model.image} alt={`Кухня «${model.title}»`} loading="lazy" /></div>
  <div className="card-caption"><h3>{model.title}</h3><Arrow /></div>
 </Link></article>;
}
