import { type OpenContact } from '../data/content';
import { Arrow } from './UI';
import '../catalog-cta.css';

export default function CatalogCTA({ onContact, context }: { onContact: OpenContact; context?: string }) {
 return <aside className="catalog-cta"><div><h2>Понравилось решение?</h2><p>Расскажите о своих идеях — обсудим, как воплотить их в вашем доме</p></div><button type="button" className="button" onClick={() => onContact({ kind: 'request', context })}>Обсудить проект <Arrow /></button></aside>;
}
