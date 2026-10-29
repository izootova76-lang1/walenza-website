import ProjectsPresentation, { ProjectVideo } from '../components/ProjectPresentation';
import { PromotionsOverview, PromotionPresentation } from './Promotions';
import ContactsPage from './Contacts';
import PhotoGallery from '../components/PhotoGallery';
import PilotCustomers from './PilotCustomers';
import { assetUrl } from '../assetUrl';
import { LineIcon, VisualHero } from '../components/Editorial';
import { team, teamText, benefits } from '../data/salon';
import StorageCatalog from './StorageCatalog';
import { Link, Navigate, useParams } from 'react-router-dom';
import { contentRepository, type OpenContact } from '../data/content';
import { Arrow, ContactBlock, Demo, PageHeading, ProjectCard, SectionHeading } from '../components/UI';

export function Furniture({ onContact }: { onContact: OpenContact }) { return <StorageCatalog onContact={onContact} />; }

export function Projects() { return <ProjectsPresentation />; }
export function ProjectDetail({ onContact }: { onContact: OpenContact }) {
 const { id } = useParams(); const project = contentRepository.projects.find(item => item.id === id);
 if (id === 'everyday-order') return <Navigate to="/projects" replace />;
 if (!project) return <NotFound />;
 const review = project.reviewId ? contentRepository.reviews.find(item => item.id === project.reviewId) : undefined;
 return <div className="container page-content"><div className="breadcrumbs"><Link to="/projects">Портфолио</Link><span>/</span><span>{project.demo ? 'Макет проекта' : project.title}</span></div>
  <PageHeading eyebrow={project.demo ? 'Демонстрационный макет' : 'Реализованный проект / На согласовании'} title={project.title} description={project.description} />
  {project.videoReview && <Link className="text-link project-video-link" to={`/projects/${project.id}#project-video-title`}>Смотреть видеоотзыв <Arrow /></Link>}
  <PhotoGallery label="Фотографии проекта" photos={[{image:project.image,alt:project.title},...(project.additionalImages || [])]} />
  {project.demo ? <div className="two-columns section"><div><h2>Место для истории проекта</h2><p>Добавим тип мебели, согласованные фотографии и известные особенности после окончательного отбора работ заказчиком. В первоначальную подборку войдёт до десяти проектов.</p></div><div className="info-note"><Demo>Макет, не выполненная работа</Demo><p>Фотография модели и интерьерный визуал не подтверждают реализацию проекта салоном. Отзывы не связываются с этим макетом.</p></div></div> : <section className="section">{project.furnitureType && <p className="eyebrow">{project.furnitureType}</p>}{project.features?.map(text => <p key={text}>{text}</p>)}</section>}
  {project.videoReview && <ProjectVideo project={project} />}
  {!project.demo && review && <article className="review-card real-review"><blockquote>«{review.text}»</blockquote><p>{review.title}</p></article>}
  <ContactBlock onContact={onContact} />
 </div>;
}
export function Customers({ onContact }: { onContact: OpenContact }) { return <PilotCustomers onContact={onContact} />; }

export function Promotions() { return <PromotionsOverview />; }
export function PromotionDetail() { const { id } = useParams(); const item = contentRepository.promotions.find(promotion => promotion.id === id); return item ? <PromotionPresentation item={item} /> : <NotFound />; }
export function About() {
 return <div className="container page-content about-page editorial-page">
  <VisualHero eyebrow="О салоне" title="Мебель с вниманием к вам" description="Московский салон кухонь, шкафов и гардеробных на заказ. Помогаем соединить красоту, удобство и ваш образ жизни." image="/images/visit/salon.jpg" alt="Реальный салон Walenza под вывеской «Интерьер Холл»" caption="Салон в ТЦ «Город Косино» · фото предоставлено заказчиком" />
  <div className="salon-values">{([{icon:'project',title:'Индивидуальный проект',text:'Под ваши размеры, привычки и пространство.',to:'/kitchens'}, {icon:'people',title:'Рядом на каждом этапе',text:'От первой идеи до установки мебели.',to:'/customers#order'}, {icon:'location',title:'Москва и область',text:'Встречаемся в салоне, обсуждаем дистанционно.',to:'/contacts'}] as const).map(item => <Link key={item.title} to={item.to}><LineIcon name={item.icon} /><h2>{item.title}</h2><p>{item.text}</p><Arrow /></Link>)}</div>
  <div className="salon-story"><div><h2>Ближе к вашим идеям</h2><p>Московский салон появился по запросам клиентов и дизайнеров, которые хотели обсуждать и заказывать мебель непосредственно в Москве.</p><p>Здесь можно познакомиться с образцами, подобрать материалы и обсудить мебель для своего пространства — от кухни до системы хранения.</p><Link className="text-link" to="/contacts">Приехать в салон <Arrow /></Link></div><aside className="salon-experience"><strong>19 лет</strong><span>опыта команды в мебельной сфере</span><p>Это опыт команды, а не возраст московского салона.</p></aside></div>
  <section className="section team-section"><SectionHeading eyebrow="Люди за проектом" title="Знакомьтесь, Анна и Татьяна" /><div className="team-intro">{teamText.map(text => <p key={text}>{text}</p>)}</div><div className="team-grid">{team.map(person => <article className="team-card" key={person.id}>
   <div className="team-portrait">{person.image ? <img src={person.image} alt={person.alt} loading="lazy" width="640" height="800" /> : <div className="team-photo-pending"><span>{person.photoNote}</span><p>Место для согласованного портрета</p></div>}</div><h3>{person.name}</h3><p>{person.role}</p>
  </article>)}</div></section>
  <section className="factory-block"><div className="factory-copy"><p className="eyebrow">Производство</p><h2>Фабрика WALENZA в Ульяновске</h2><p>Мебельная фабрика WALENZA расположена в Ульяновске и занимается производством кухонь и мебели по индивидуальным проектам.</p><p>Производственный процесс включает подготовку деталей, изготовление, комплектацию и контроль качества.</p><p>В московском салоне WALENZA клиенты могут познакомиться с образцами, выбрать материалы и обсудить будущий проект с командой.</p></div><figure className="factory-draft-visual"><img src={assetUrl('/images/editorial/process-draft.jpg')} alt="Сгенерированная иллюстрация мебельного производства, не фотография фабрики WALENZA" loading="lazy" /><figcaption><span>Черновой визуал для согласования</span>Сгенерированное изображение. Заменим после получения реальных фото производства.</figcaption></figure></section>
  <section className="section"><SectionHeading eyebrow="Наш подход" title="Внимание к вашему проекту" /><div className="benefit-grid">{benefits.map(item => <article key={item.title}><LineIcon name="project" /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
  <Link className="button" to="/contacts">Обсудить проект <Arrow /></Link>
 </div>;
}

export function Contacts({ onContact }: { onContact: OpenContact }) { return <ContactsPage onContact={onContact} />; }

export function NotFound() { return <div className="container page-content"><PageHeading eyebrow="404 / Страница не найдена" title="Вернёмся к знакомству" description="Такой страницы в прототипе нет. Вы можете продолжить с главной страницы или каталога." /><Link className="button" to="/">На главную <Arrow /></Link></div>; }
