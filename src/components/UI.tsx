import { Link, useLocation } from 'react-router-dom';
import { contentRepository, layouts, type Model, type Project, type OpenContact } from '../data/content';
export function Arrow() { return <span aria-hidden="true">↗</span>; }
export function Demo({ children = 'Демонстрационный пример' }: { children?: React.ReactNode }) { return <span className="demo-label">{children}</span>; }
export function SectionHeading({ eyebrow, title, to, link, ruled = false }: { eyebrow: string; title: string; to?: string; link?: string; ruled?: boolean }) {
 return <div className="section-heading"><div><p className={`eyebrow${ruled ? ' eyebrow--ruled' : ''}`}>{eyebrow}</p><h2>{title}</h2></div>{to && <Link className="text-link" to={to}>{link || 'Смотреть все'} <Arrow /></Link>}</div>;
}
export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
 return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}
export function ModelCard({ model, returnTo }: { model: Model; returnTo?: string }) {
 const location = useLocation();
 const back = returnTo || (location.pathname === '/kitchens' ? location.pathname + location.search : '/kitchens');
 const target = `/kitchens/models/${model.id}?${new URLSearchParams({ return: back })}`;
 return <Link className="model-card" to={target}><div className="card-image"><img src={model.image} alt={`Демонстрационный визуал кухни «${model.title}»`} loading="lazy" /><Demo /><span className="image-arrow"><Arrow /></span></div><div className="card-caption"><div><h3>{model.title}</h3><p>{model.subtitle}</p></div><span className="small-index">{layouts.find(item => item.id === model.layout)?.title}{model.island ? ' · с островом' : ''}</span></div></Link>;
}
export function ProjectCard({ project }: { project: Project }) {
 return <Link className="project-card" to={`/projects/${project.id}`}><div className="card-image"><img src={project.image} alt={`Демонстрационная иллюстрация: ${project.title}`} loading="lazy" /><Demo /><span className="image-arrow"><Arrow /></span></div><h3>{project.title}</h3><p>Пример оформления проекта</p></Link>;
}
export function Steps() { return <ol className="steps">{contentRepository.steps.map(step => <li key={step.title}><span className="step-marker" aria-hidden="true" /><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>; }
export function FAQ() { return <div className="faq">{contentRepository.faq.map(item => <details key={item.id}><summary>{item.question}<span aria-hidden="true">+</span></summary><p><Demo>Демонстрационный FAQ</Demo></p><p>{item.answer}</p></details>)}</div>; }
export function ContactBlock({ onContact }: { onContact: OpenContact }) {
 const { contacts } = contentRepository;
 return <section className="contact-strip"><div><p className="eyebrow">Давайте начнём с разговора</p><h2>У каждого пространства<br />своя история.</h2><p>{contacts.address}</p><p>{contacts.hours} · <a href={contacts.phoneHref}>{contacts.phone}</a></p></div><div><button className="button light" onClick={() => onContact()}>Оставить заявку <Arrow /></button><p className="contact-footnote">Демонстрационный сценарий.<br />Форма пока не собирает и не отправляет данные.</p><button className="text-link" onClick={() => onContact({ kind: 'director' })}>Написать директору <Arrow /></button><Link className="text-link" to="/contacts">Все способы связи <Arrow /></Link></div></section>;
}
