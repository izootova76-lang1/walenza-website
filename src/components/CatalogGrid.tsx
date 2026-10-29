import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { type OpenContact } from '../data/content';
import CatalogCTA from './CatalogCTA';
import '../catalog-grid.css';

type Placement = { columns: number; shortColumn?: number; shortHeight?: number };

/** One CTA in reading order; placement follows the actual grid and card heights. */
export default function CatalogGrid({ children, className, onContact, context, fillHeightGaps = false }: {
 children: ReactNode[]; className: string; onContact: OpenContact; context?: string; fillHeightGaps?: boolean;
}) {
 const grid = useRef<HTMLDivElement>(null);
 const [placement, setPlacement] = useState<Placement>({ columns: 1 });
 const count = children.length;
 useLayoutEffect(() => {
  const el = grid.current;
  if (!el) return;
  const measure = () => {
   const style = getComputedStyle(el);
   const columns = style.gridTemplateColumns.split(' ').filter(Boolean).length;
   const next: Placement = { columns };
   const cards = Array.from(el.children).filter(child => child.classList.contains('catalog-grid-item')) as HTMLElement[];
   // Height gaps are used only in a complete final row, with enough room for
   // the compact CTA. In a single column it always follows all furniture.
   if (fillHeightGaps && columns > 1 && count > 0 && count % columns === 0) {
    const heights = cards.slice(-columns).map(card => card.getBoundingClientRect().height);
    const shortest = Math.min(...heights), tallest = Math.max(...heights);
    const gap = parseFloat(style.rowGap) || 0;
    if (tallest - shortest >= 260 + gap) {
     next.shortColumn = heights.indexOf(shortest) + 1;
     next.shortHeight = shortest;
    }
   }
   setPlacement(old => JSON.stringify(old) === JSON.stringify(next) ? old : next);
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(el);
  Array.from(el.children).forEach(child => observer.observe(child));
  document.fonts.ready.then(() => { if (grid.current === el) measure(); });
  return () => observer.disconnect();
 }, [children, count, fillHeightGaps]);
 const { columns, shortColumn, shortHeight } = placement;
 const fillCell = columns > 1 && count % columns === columns - 1;
 const row = Math.ceil(count / columns);
 const tailStart = count - columns;
 return <div ref={grid} className={`${className} catalog-composition`} data-cta-placement={shortColumn ? 'height-gap' : fillCell ? 'cell' : 'after'}
  style={shortColumn ? { gridTemplateRows: `${row > 1 ? `repeat(${row - 1}, auto) ` : ''}${shortHeight}px auto` } : undefined}>
  {children.map((child,index) => <div className="catalog-grid-item" key={(child as {key?:string})?.key || index} style={shortColumn && index >= tailStart ? { gridColumn: index - tailStart + 1, gridRow: index - tailStart + 1 === shortColumn ? row : `${row} / span 2` } : undefined}>{child}</div>)}
  <div className={`catalog-grid-cta${fillCell || shortColumn ? ' is-inset' : ''}`} style={shortColumn ? {gridColumn:shortColumn,gridRow:row+1} : {gridColumn:fillCell ? undefined : '1 / -1'}}><CatalogCTA onContact={onContact} context={context} /></div>
 </div>;
}
