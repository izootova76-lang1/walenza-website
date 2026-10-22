import { assetUrl } from '../assetUrl';

export type IconName = 'project' | 'payment' | 'delivery' | 'warranty' | 'care' | 'location' | 'people';
const paths: Record<IconName, React.ReactNode> = {
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
