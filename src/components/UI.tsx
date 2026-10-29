import { Link, useLocation } from 'react-router-dom';
import { orderSummary } from '../data/salon';
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
 return <Link className="model-card" to={target}><div className="card-image"><img src={model.image} alt={`${model.demo ? 'Демонстрационный визуал кухни' : 'Кухня'} «${model.title}»`} loading="lazy" />{model.demo && <Demo />}<span className="image-arrow"><Arrow /></span></div><div className="card-caption"><div><h3>{model.title}</h3>{model.workingTitle && <span className="model-title-note">Рабочее название</span>}<p>{model.subtitle}</p></div><span className="small-index">{layouts.find(item => item.id === model.layout)?.title}{model.island ? ' · с островом' : ''}</span></div></Link>;
}
export function ProjectCard({ project }: { project: Project }) {
 return <Link className="project-card" to={`/projects/${project.id}`}><div className="card-image"><img src={project.image} alt={`${project.demo ? 'Демонстрационная иллюстрация: ' : ''}${project.title}`} loading="lazy" />{project.demo && <Demo>Демонстрационный макет</Demo>}<span className="image-arrow"><Arrow /></span></div><div className="project-card-copy"><p className="eyebrow">{project.videoReview ? 'Фото и видеоотзыв' : 'История интерьера'}</p><h3>{project.title}</h3><p>{project.demo ? 'Пример оформления проекта' : project.furnitureType}</p><span className="project-card-action">Рассмотреть проект <Arrow /></span></div></Link>;
}
export function Steps({ compact = false }: { compact?: boolean }) { return <ol className={compact ? 'order-preview' : 'order-timeline'}>{(compact ? orderSummary : contentRepository.steps).map(step => <li key={step.title}>{!compact && <span className="order-dot" aria-hidden="true" />}<h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>; }
export function FAQ() { return <div className="faq">{contentRepository.faq.map(item => <details key={item.id}><summary>{item.question}<span aria-hidden="true">+</span></summary>{item.demo && <p><Demo>Демонстрационный FAQ</Demo></p>}<p>{item.answer}</p></details>)}</div>; }

export function ContactBlock({ onContact }: { onContact: OpenContact }) {
 const { contacts } = contentRepository;
 return <section className="contact-strip"><div><p className="eyebrow">Давайте начнём с разговора</p><h2>У каждого пространства<br />своя история.</h2><p>{contacts.address}</p><p>{contacts.hours} · <a href={contacts.phoneHref}>{contacts.phone}</a></p></div><div><button className="button light" onClick={() => onContact()}>Оставить заявку <Arrow /></button><p className="contact-footnote">Обсудим пожелания и удобный формат встречи.<br />Онлайн-отправка заявки пока не подключена.</p><button className="text-link" onClick={() => onContact({ kind: 'director' })}>Написать директору <Arrow /></button><Link className="text-link" to="/contacts">Все способы связи <Arrow /></Link></div></section>;
}
