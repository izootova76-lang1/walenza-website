import { assetUrl } from '../assetUrl';

export type IconName = 'project' | 'payment' | 'delivery' | 'warranty' | 'care' | 'location' | 'people' | 'cloth' | 'climate' | 'wood' | 'finish' | 'worktop' | 'glass' | 'mechanism' | 'push' | 'clock' | 'tools' | 'measure' | 'samples' | 'signed-document';
const paths: Record<IconName, React.ReactNode> = {
 samples: <><path d="M4 4h5v16H4ZM9 6l4-2 6 13-5 2M9 19h12v-6h-4"/><circle cx="6.5" cy="17" r=".8"/></>,
 'signed-document': <><path d="M13 3H4v18h16v-8M8 7h4M8 11h3M7 17h5M14 14l1-4 5-5 3 3-5 5-4 1ZM19 6l3 3"/></>,
 cloth: <><path d="m4 5 13-2 3 15-13 3L4 5Z"/><path d="m7 8 7-1M8 12l7-1M9 16l7-1"/></>,
 climate: <><path d="M9 3v11a4 4 0 1 0 4 0V3a2 2 0 0 0-4 0ZM11 10v7"/><circle cx="19" cy="7" r="2"/><path d="M19 2v1M19 11v1M14 7h1M23 7h-1"/></>,
 wood: <><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 3c5 5-4 9 1 18M13 3c6 6-5 11 1 18M17 3c4 5-4 11 3 15"/></>,
 finish: <><rect x="4" y="3" width="12" height="5" rx="1"/><path d="M16 5h4v7h-9v3M9 15h4v6H9Z"/></>,
 worktop: <><path d="M3 8h18v4H3ZM5 12v8M19 12v8M9 8V5h6v3"/><path d="M9 16h6"/></>,
 glass: <><path d="m7 3-1 7a6 6 0 0 0 12 0l-1-7H7ZM12 16v5M8 21h8M6 9h12"/></>,
 mechanism: <><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 12h18M9 8h6M9 16h6"/></>,
 push: <><rect x="13" y="3" width="8" height="18" rx="1"/><path d="M3 12h12M9 7l5 5-5 5"/></>,
 clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
 tools: <><path d="M14 4a5 5 0 0 0-5 7L3 17a3 3 0 0 0 4 4l6-6a5 5 0 0 0 7-6l-4 3-3-3 3-4-2-1Z"/></>,
 measure: <><path d="M4 5h16v14H4ZM4 9h3M4 13h2M4 17h3M9 5v3M13 5v2M17 5v3"/></>,
 project: <><path d="m5 15 10-10 4 4L9 19l-5 1 1-5Z" /><path d="m13 7 4 4M4 4h5M4 8h2" /></>,
 payment: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
 delivery: <><path d="M3 6h11v12H3ZM14 10h4l3 4v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
 warranty: <><path d="M12 3c3 2 5 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6c3 0 5-1 8-3Z" /><path d="m8 12 3 3 5-6" /></>,
 care: <><path d="M5 19C1 8 11 4 20 4c0 10-4 18-13 14M5 21 16 9" /></>,
 location: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
 people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 15c2 0 3 2 3 4v2" /></>,
};
export function LineIcon({ name }: { name: IconName }) { return <span className={`editorial-icon editorial-icon--${name}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg></span>; }
export function VisualHero({ eyebrow, title, description, image, alt, caption }: { eyebrow: string; title: string; description: string; image: string; alt: string; caption: string }) {
 return <header className="visual-page-hero"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="visual-hero-description">{description}</p><span className="editorial-rule" aria-hidden="true" /></div><figure><img src={assetUrl(image)} alt={alt} fetchPriority="high" /><figcaption>{caption}</figcaption></figure></header>;
}
