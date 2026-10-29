import { Link } from 'react-router-dom';
import { assetUrl } from '../assetUrl';

export function Brand() {
 return <Link className="brand-logo" to="/" aria-label="WALENZA — главная"><img src={assetUrl('/images/brand/walenza-original.png')} alt="Walenza" width="992" height="242" /></Link>;
}
export function ContactIcon({ name }: { name: 'phone' | 'clock' | 'location' | 'mail' }) {
 return <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'phone' ? <path d="m5 3 4 1 1 5-3 2c2 3 3 4 6 6l2-3 5 1 1 4c-1 4-8 2-12-2S1 4 5 3Z" /> : name === 'clock' ? <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></> : name === 'mail' ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></> : <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>}</svg>;
}
