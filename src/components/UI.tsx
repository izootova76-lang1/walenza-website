import { Link } from 'react-router-dom';
import { contentRepository, type Model, type Project } from '../data/content';

export function Arrow() { return <span aria-hidden="true">↗</span>; }
export function Demo({ children = 'Демонстрационный пример' }: { children?: React.ReactNode }) { return <span className="demo-label">{children}</span>; }
export function SectionHeading({ eyebrow, title, to, link }: { eyebrow: string; title: string; to?: string; link?: string }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{to && <Link className="text-link" to={to}>{link || 'Смотреть все'} <Arrow /></Link>}</div>;
}
export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}
export function ModelCard({ model }: { model: Model }) {
  return <Link className={`model-card image-${model.id}`} to={`/kitchens/models/${model.id}`}><div className="card-image"><img src={model.image} alt={`Концептуальная иллюстрация кухни «${model.title}»`} loading="lazy" /><Demo /><span className="image-arrow"><Arrow /></span></div><div className="card-caption"><div><h3>{model.title}</h3><p>{model.subtitle}</p></div><span className="small-index">{model.category === 'straight' ? 'Прямая' : model.category === 'corner' ? 'Угловая' : 'С островом'}</span></div></Link>;
}
export function ProjectCard({ project }: { project: Project }) {
  return <Link className="project-card" to={`/projects/${project.id}`}><div className="card-image"><img src={project.image} alt={`Демонстрационная иллюстрация: ${project.title}`} loading="lazy" /><Demo /><span className="image-arrow"><Arrow /></span></div><h3>{project.title}</h3><p>Пример оформления проекта</p></Link>;
}
export function Steps() { return <ol className="steps">{contentRepository.steps.map((step, i) => <li key={step.title}><span className="step-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>; }
export function FAQ() { return <div className="faq">{contentRepository.faq.map(item => <details key={item.id}><summary>{item.question}<span aria-hidden="true">+</span></summary><p><Demo>Демонстрационный FAQ</Demo></p><p>{item.answer}</p></details>)}</div>; }
export function ContactBlock({ onContact }: { onContact: () => void }) { return <section className="contact-strip"><div><p className="eyebrow">Давайте начнём с разговора</p><h2>У каждого пространства<br />своя история.</h2><p>Кухни и шкафы на заказ для Москвы и Московской области.</p></div><div><button className="button light" onClick={onContact}>Обсудить ваш проект <Arrow /></button><p className="contact-footnote">Демонстрация обращения.<br />Контакты салона ожидают подтверждения.</p><Link className="text-link" to="/contacts">Перейти к контактам <Arrow /></Link></div></section>; }
