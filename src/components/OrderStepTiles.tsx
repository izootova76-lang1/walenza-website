import { useRef, useState } from 'react';
import { steps } from '../data/customerPocket';
import { LineIcon, type IconName } from './Editorial';

const icons: IconName[] = ['people', 'project', 'measure', 'samples', 'signed-document', 'tools', 'delivery'];

export default function OrderStepTiles() {
 const [activeOrderStep, setActiveOrderStep] = useState(0);
 const explanation = useRef<HTMLElement>(null);
 const select = (index: number) => {
  setActiveOrderStep(index);
  // On phones the single-column list can be taller than the screen. Reveal only
  // as much of the explanation as needed, preserving focus on the chosen tile.
  requestAnimationFrame(() => {
   const panel = explanation.current;
   if (!panel || !matchMedia('(max-width: 760px)').matches) return;
   const bounds = panel.getBoundingClientRect();
   if (bounds.top >= 0 && bounds.bottom <= innerHeight) return;
   panel.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
 };
 return <div className="pocket-order-browser">
  <div className="pocket-order-tiles" role="group" aria-label="Этапы заказа">{steps.map((step, index) => <button key={step.title} id={`order-step-${index}`} type="button" aria-pressed={activeOrderStep === index} aria-controls="pocket-order-explanation" onClick={() => select(index)}><LineIcon name={icons[index]} /><span>{step.title}</span></button>)}</div>
  <section ref={explanation} className="pocket-order-explanation" id="pocket-order-explanation" role="region" aria-labelledby={`order-step-${activeOrderStep}`} aria-live="polite"><h3>{steps[activeOrderStep].title}</h3><p>{steps[activeOrderStep].text}</p></section>
 </div>;
}
