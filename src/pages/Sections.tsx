import { assetUrl } from '../assetUrl';
import { LineIcon, VisualHero, type IconName } from '../components/Editorial';
import { team, teamText, benefits, buyerContent } from '../data/salon';
import { storageItems } from '../data/storage';
import { StorageCollection } from '../components/StorageCard';
import { Link, Navigate, useParams, useLocation } from 'react-router-dom';
import { contentRepository, buyerTopics, furnitureDirections, contacts, type OpenContact } from '../data/content';
import { Arrow, ContactBlock, Demo, FAQ, PageHeading, ProjectCard, SectionHeading, Steps } from '../components/UI';

export function Furniture({ onContact }: { onContact: OpenContact }) {
 return <div className="container page-content furniture-page">
  <VisualHero eyebrow="Шкафы и мебель / Индивидуальные пространства" title="Пространство для порядка" description="Снаружи — часть интерьера. Внутри — место для ваших вещей. Переключайте фасады и наполнение, чтобы рассмотреть мебель ближе." image="/images/storage/laguna-facades.jpg" alt="Шкаф WALENZA с голубыми фасадами" caption="Реальная мебель · фасады и внутреннее наполнение" />
  <nav className="storage-navigation" aria-label="Направления корпусной мебели"><Link to="/furniture#wardrobes">Шкафы <Arrow /></Link><Link to="/furniture#dressing">Гардеробные <Arrow /></Link><Link to="/furniture#additional">Другие направления <Arrow /></Link></nav>
  <p className="storage-review-note">Визуалы предоставлены заказчиком. Названия изделий — рабочие, для согласования прототипа. Материалы, размеры и комплектация уточняются индивидуально.</p>
  <section id="wardrobes" className="section storage-section" aria-labelledby="wardrobes-title"><div className="section-heading"><div><p className="eyebrow">Фасады и внутреннее наполнение</p><h2 id="wardrobes-title">Шкафы</h2></div></div><StorageCollection items={storageItems.filter(item => item.kind === 'wardrobe')} onContact={onContact} /></section>
  <section id="dressing" className="section storage-section" aria-labelledby="dressing-title"><div className="section-heading"><div><p className="eyebrow">Всё на своём месте</p><h2 id="dressing-title">Гардеробные</h2></div></div><StorageCollection items={storageItems.filter(item => item.kind === 'dressing')} onContact={onContact} dressing /></section>
  <section id="additional"><SectionHeading eyebrow="Дополнительная корпусная мебель" title="Для других комнат и привычек" /><div className="furniture-directions">{furnitureDirections.map(item => <details key={item.id} id={item.id}><summary>{item.title}<span aria-hidden="true">+</span></summary><div><Demo>Демонстрационное направление</Demo><p>{item.text}</p><button className="text-link" onClick={() => onContact({ kind: 'request', context: item.title })}>Обсудить задачу <Arrow /></button></div></details>)}</div></section>
  <aside className="info-note">Показанные композиции помогают обсудить внешний вид и организацию хранения. Итоговые материалы, наполнение и стоимость определяются для вашего проекта. Стоимость — индивидуальный расчёт.</aside><Link className="text-link" to="/materials">Посмотреть материалы <Arrow /></Link>
 </div>;
}

export function Projects() { return <div className="container page-content projects-page"><PageHeading eyebrow="Галерея / Проекты" title="Проекты WALENZA" description="Реальная мебель в интерьерах наших клиентов. Рассмотрите общий вид и детали проекта, посмотрите видеоотзыв о кухне с продолжением в гостиную." /><div className="project-grid">{contentRepository.projects.map(project => <ProjectCard key={project.id} project={project} />)}</div></div>; }
export function ProjectDetail({ onContact }: { onContact: OpenContact }) {
 const { id } = useParams(); const project = contentRepository.projects.find(item => item.id === id);
 if (id === 'everyday-order') return <Navigate to="/projects" replace />;
 if (!project) return <NotFound />;
 const review = project.reviewId ? contentRepository.reviews.find(item => item.id === project.reviewId) : undefined;
 return <div className="container page-content"><div className="breadcrumbs"><Link to="/projects">Проекты</Link><span>/</span><span>{project.demo ? 'Макет проекта' : project.title}</span></div>
  <PageHeading eyebrow={project.demo ? 'Демонстрационный макет' : 'Реализованный проект / На согласовании'} title={project.title} description={project.description} />
  {project.videoReview && <Link className="text-link project-video-link" to={`/projects/${project.id}#project-video-title`}>Смотреть видеоотзыв <Arrow /></Link>}
  <img className="project-detail-image project-detail-hero" src={project.image} alt={project.title + (project.demo ? ' — демонстрационная иллюстрация' : '')} />
  <div className="project-photo-gallery">{project.additionalImages?.map(photo => <img className="project-detail-image" key={photo.image} src={photo.image} alt={photo.alt} loading="lazy" />)}</div>
  {project.demo ? <div className="two-columns section"><div><h2>Место для истории проекта</h2><p>Добавим тип мебели, согласованные фотографии и известные особенности после окончательного отбора работ заказчиком. В первоначальную подборку войдёт до десяти проектов.</p></div><div className="info-note"><Demo>Макет, не выполненная работа</Demo><p>Фотография модели и интерьерный визуал не подтверждают реализацию проекта салоном. Отзывы не связываются с этим макетом.</p></div></div> : <section className="section">{project.furnitureType && <p className="eyebrow">{project.furnitureType}</p>}{project.features?.map(text => <p key={text}>{text}</p>)}</section>}
  {project.videoReview && <section className="section project-video-section" aria-labelledby="project-video-title"><div><p className="eyebrow">Впечатления после установки</p><h2 id="project-video-title">Отзыв клиента</h2><p>О кухне, которая продолжается в гостиную, и впечатлениях от готовой мебели.</p><p className="muted">Сокращённая версия предоставленного видео. Включите звук, чтобы услышать клиента.</p></div><video controls playsInline preload="none" src={project.videoReview.src} poster={project.videoReview.poster} aria-label={project.videoReview.title} /></section>}
  {!project.demo && review && <article className="review-card real-review"><blockquote>«{review.text}»</blockquote><p>{review.title}</p></article>}
  <ContactBlock onContact={onContact} />
 </div>;
}
export function Customers({ onContact }: { onContact: OpenContact }) {
 const { hash } = useLocation();
 const activeTopic = hash ? hash.slice(1) : 'order';
 const icons: Record<string, IconName> = { order: 'project', payment: 'payment', delivery: 'delivery', 'warranty-care': 'warranty', care: 'care' };
 return <div className="container page-content customers-page editorial-page">
  <VisualHero eyebrow="WALENZA / Покупателям" title="Всё начинается с вашей идеи" description="Понятный путь от первого разговора до готовой мебели. Здесь — этапы заказа, условия и забота о деталях." image="/images/kitchens/contour.jpg" alt="Реальная кухня WALENZA: древесные фасады и светлая рабочая поверхность" caption="Мебель WALENZA · фото предоставлено заказчиком" />
  <p className="approval-note">Условия из брифа салона — на согласовании. Детали конкретного заказа фиксируются в договоре.</p>
  <nav className="buyer-topic-nav visual-topic-grid" aria-label="Темы для покупателей">{buyerTopics.map(item => <Link key={item.id} to={`/customers#${item.id}`} aria-current={activeTopic === item.id ? 'location' : undefined}><LineIcon name={icons[item.id]} /><h2>{item.title}</h2><p>{item.summary}</p><Arrow /></Link>)}</nav>
  <aside className="buyer-visual-note"><img src={assetUrl('/images/projects/soft-light-detail.jpg')} alt="Детали рабочей поверхности и фасадов реальной кухни" loading="lazy" /><div><p className="eyebrow">Забота о деталях</p><h2>Продумано для вашей жизни</h2><div className="buyer-key-facts"><p><strong>от 30%</strong><span>предоплата за мебель</span></p><p><strong>21–45</strong><span>рабочих дней · ориентир изготовления</span></p></div><p className="muted">Точные сроки, комплектация и стоимость — в вашем договоре.</p></div></aside>
  <div className="buyer-topics">{buyerTopics.map(item => <details key={item.id} id={item.id} open={activeTopic === item.id}>
   <summary><div className="buyer-panel-heading"><LineIcon name={icons[item.id]} /><h2>{item.title}</h2></div><span aria-hidden="true">+</span></summary><div>
    <p>{item.text}</p>
    {item.id === 'order' ? <><div className="visual-order-steps"><Steps /></div><button className="button" onClick={() => onContact({ kind: 'request', context: 'Обсуждение проекта и порядка заказа' })}>Обсудить проект <Arrow /></button></> : <>
     {item.id === 'warranty-care' && <div className="warranty-facts"><p><strong>2 года</strong><span>Гарантия на мебель</span></p><p><strong>Более 15 лет</strong><span>Заявленный срок службы</span></p></div>}
     {buyerContent[item.id]?.points && <ul className="buyer-conditions">{buyerContent[item.id].points!.map(text => <li key={text}>{text}</li>)}</ul>}
     {buyerContent[item.id]?.paragraphs?.map(text => <p key={text}>{text}</p>)}
    </>}
   </div>
  </details>)}</div>
  <aside className="editorial-help"><div><p className="eyebrow">Остались вопросы?</p><h2>Начнём с разговора</h2><p>Поможем разобраться с материалами и порядком заказа.</p></div><button className="button" onClick={() => onContact({ kind: 'request', context: 'Вопрос об условиях заказа' })}>Задать вопрос <Arrow /></button></aside>
  <section className="section"><SectionHeading eyebrow="Перед разговором" title="Частые вопросы" /><FAQ /></section>
 </div>;
}

export function Promotions() { return <div className="container page-content"><PageHeading eyebrow="Салон / Акции" title="Будущие предложения" description="Примеры карточек для проверки раздела. Действующие акции, скидки и сроки не заявлены." /><div className="promotion-grid">{contentRepository.promotions.map((item, i) => <Link className={`promotion-card promotion-${i}`} key={item.id} to={`/promotions/${item.id}`}><Demo>Демонстрационная акция</Demo><h2>{item.title}</h2><p>{item.description}</p><span className="text-link">Посмотреть пример <Arrow /></span></Link>)}</div></div>; }
export function PromotionDetail() { const { id } = useParams(); const item = contentRepository.promotions.find(promotion => promotion.id === id); if (!item) return <NotFound />; return <div className="container page-content"><div className="breadcrumbs"><Link to="/promotions">Акции</Link><span>/</span><span>Пример карточки</span></div><PageHeading eyebrow="Демонстрационная акция" title={item.title} description={item.description} /><div className="info-note"><h3>Условия пока не утверждены</h3><p>Здесь появятся состав предложения, период действия, ограничения и порядок участия. Этот пример не является действующей акцией.</p></div><Link className="button" to="/kitchens">Познакомиться с моделями <Arrow /></Link></div>; }
export function About() {
 return <div className="container page-content about-page editorial-page">
  <VisualHero eyebrow="WALENZA / О салоне" title="Мебель с вниманием к вам" description="Московский салон кухонь, шкафов и гардеробных на заказ. Помогаем соединить красоту, удобство и ваш образ жизни." image="/images/kitchens/terracotta.jpg" alt="Реальная кухня WALENZA в светлом интерьере с обеденной зоной" caption="Мебель WALENZA · фото предоставлено заказчиком" />
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

export function Contacts({ onContact }: { onContact: OpenContact }) {
 return <div className="container page-content contacts-page">
  <VisualHero eyebrow="Контакты / Давайте познакомимся" title="Ваши идеи. Наш следующий разговор." description="Обсудим мебель, материалы и ваш будущий интерьер. Встречаемся в московском салоне, общаемся дистанционно." image="/images/kitchens/dining.jpg" alt="Обеденная зона и витрина из предоставленных фотографий мебели" caption="Мебель из материалов заказчика · интерьер для вдохновения" />
  <div className="contacts-layout"><div><h2>Связаться с салоном</h2>
   <div className="contact-methods"><a href={contacts.phoneHref}><strong>Основной телефон</strong><span>{contacts.phone}</span></a><a href={contacts.extraPhoneHref}><strong>Дополнительный телефон</strong><span>{contacts.extraPhone}</span></a>{contacts.emails.map(email => <a key={email} href={`mailto:${email}`}><strong>Электронная почта</strong><span>{email}</span></a>)}</div>
   <div className="contact-actions"><a className="button" href={contacts.phoneHref}>Позвонить <Arrow /></a><button className="button" onClick={() => onContact()}>Оставить заявку <Arrow /></button><button className="text-link" onClick={() => onContact({ kind: 'visit', context: 'Встреча в московском салоне' })}>Записаться в салон <Arrow /></button></div>
   <div className="address-data"><h3>Адрес салона</h3><p>{contacts.address}</p><p>{contacts.landmarks}</p><h3>Часы работы</h3><p>{contacts.hours}</p></div>
   <div className="confirmed-messengers">{contacts.maxUrl && <a className="text-link" href={contacts.maxUrl}>MAX <Arrow /></a>}{contacts.telegramUrl && <a className="text-link" href={contacts.telegramUrl}>Telegram <Arrow /></a>}{!contacts.maxUrl && !contacts.telegramUrl && <p className="muted">MAX и Telegram: подтверждённые ссылки ожидаются.</p>}</div>
  </div><div className="contact-special"><article><p className="eyebrow">Личное обращение</p><h2>Написать директору</h2><p>Прямое обращение к Анне Ярошинской. Отдельный контакт для этого обращения уточняется; сообщение из прототипа не отправляется.</p><button className="text-link" onClick={() => onContact({ kind: 'director' })}>Написать директору <Arrow /></button></article><article><p className="eyebrow">Отдельный будущий бот</p><h2>AI-помощник в Telegram</h2><p>Будущий отдельный бот. Адрес и база знаний ещё не подключены; это не контакт директора и не сотрудник салона.</p><button className="text-link" onClick={() => onContact({ kind: 'ai' })}>AI-помощник в Telegram <Arrow /></button></article></div></div>
  <aside className="info-note">Контакты предоставлены в брифе и находятся на согласовании. Дни работы и точка входа в ТЦ требуют уточнения. Онлайн-заявка и бронирование времени пока не подключены.</aside>
 </div>;
}

export function NotFound() { return <div className="container page-content"><PageHeading eyebrow="404 / Страница не найдена" title="Вернёмся к знакомству" description="Такой страницы в прототипе нет. Вы можете продолжить с главной страницы или каталога." /><Link className="button" to="/">На главную <Arrow /></Link></div>; }
