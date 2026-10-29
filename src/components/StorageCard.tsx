import { useEffect, useRef, useState } from 'react';
import { type StorageItem } from '../data/storage';
import { type OpenContact } from '../data/content';
import { Arrow } from './UI';
import { CompactStorageSample } from './CompactSamples';
import CatalogGrid from './CatalogGrid';

export function StorageCard({ item, onContact }: { item: StorageItem; onContact: OpenContact }) {
 return <CompactStorageSample item={item} onContact={onContact} />;
}

export function StorageCollection({ items, onContact, dressing = false }: { items: StorageItem[]; onContact: OpenContact; dressing?: boolean }) {
 const [shown, setShown] = useState(2);
 const grid = useRef<HTMLDivElement>(null);
 const previousShown = useRef(shown);
 useEffect(() => {
  if (shown > previousShown.current) grid.current?.querySelectorAll<HTMLElement>('.storage-visual-photo')[previousShown.current]?.focus();
  previousShown.current = shown;
 }, [shown]);
 const remaining = items.length - shown;
 return <><div ref={grid}><CatalogGrid className={`storage-visual-grid${dressing ? ' storage-visual-grid--dressing' : ''}`} onContact={onContact} context={dressing ? 'Гардеробные' : 'Шкафы'} fillHeightGaps>{items.slice(0, shown).map(item => <StorageCard key={item.id} item={item} onContact={onContact} />)}</CatalogGrid></div>
  {remaining > 0 && <button className="button storage-more" onClick={() => setShown(count => count + 4)}>Показать ещё <span>{remaining}</span><Arrow /></button>}
 </>;
}
