import { contentRepository } from '../data/content';

export function DisclosureMark() {
 return <svg className="pocket-disclosure-mark" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><path d="M4 10h12"/><path d="M10 4v12"/></svg>;
}
export default function PocketFAQ() {
 const items = contentRepository.faq;
 const middle = Math.ceil(items.length / 2);
 return <div className="pocket-faq-board">{[items.slice(0, middle), items.slice(middle)].map((column, index) => <div className="pocket-faq-column" key={index}>{column.map(item => <details className="pocket-faq-card" key={item.id} data-faq-id={item.id}><summary><span>{item.question}</span><DisclosureMark /></summary><div className="pocket-faq-answer"><p>{item.answer}</p></div></details>)}</div>)}</div>;
}
