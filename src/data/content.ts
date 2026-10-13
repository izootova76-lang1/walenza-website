import { assetUrl } from '../assetUrl';
export type Model = { id: string; title: string; category: 'straight' | 'corner' | 'island'; subtitle: string; image: string; demo: true };
export type Project = { id: string; title: string; description: string; image: string; demo: true };
export type Promotion = { id: string; title: string; description: string; demo: true };

export const navigation = [
  { path: '/', label: 'Главная' }, { path: '/kitchens', label: 'Кухни' },
  { path: '/furniture', label: 'Корпусная мебель' }, { path: '/projects', label: 'Проекты' },
  { path: '/customers', label: 'Покупателям' }, { path: '/promotions', label: 'Акции' },
  { path: '/about', label: 'О салоне' }, { path: '/contacts', label: 'Контакты' },
];
export const categories = [ { id: 'all', title: 'Все модели' }, { id: 'straight', title: 'Прямые' }, { id: 'corner', title: 'Угловые' }, { id: 'island', title: 'С островом' } ];
export const models: Model[] = [
  { id: 'line', title: 'Линия', category: 'straight', subtitle: 'Спокойная геометрия', image: assetUrl('/images/kitchen.svg'), demo: true },
  { id: 'balance', title: 'Баланс', category: 'corner', subtitle: 'Пространство для повседневности', image: assetUrl('/images/kitchen-corner.svg'), demo: true },
  { id: 'rhythm', title: 'Ритм', category: 'island', subtitle: 'Остров как центр пространства', image: assetUrl('/images/kitchen.svg'), demo: true },
];
export const projects: Project[] = [
  { id: 'quiet-space', title: 'Пространство в мягких тонах', description: 'Пример страницы проекта с кухней и островом. Иллюстрация показывает структуру будущей галереи.', image: assetUrl('/images/kitchen.svg'), demo: true },
  { id: 'everyday-order', title: 'Порядок в деталях', description: 'Пример страницы проекта с системой хранения. Фотографии и описание реальной работы будут добавлены после согласования.', image: assetUrl('/images/wardrobe.svg'), demo: true },
];
export const reviews = [
  { id: 'review-1', title: 'О выборе планировки', text: '«В этом блоке будет отзыв о том, как проходило обсуждение планировки и выбор мебели».', demo: true },
  { id: 'review-2', title: 'О процессе заказа', text: '«Здесь можно будет прочитать впечатления заказчика о взаимодействии с салоном».', demo: true },
];
export const promotions: Promotion[] = [
  { id: 'season', title: 'Сезонное предложение', description: 'Демонстрация карточки акции. Состав предложения, даты и условия ещё не утверждены.', demo: true },
  { id: 'collection', title: 'Предложение для коллекции', description: 'Место для будущего предложения по моделям. Действующая скидка не заявлена.', demo: true },
];
export const steps = [
  { title: 'Знакомство с задачей', text: 'Обсуждение пространства, пожеланий и сценариев использования.' },
  { title: 'Планировка и проект', text: 'Проработка расположения мебели и деталей будущего решения.' },
  { title: 'Согласование заказа', text: 'Уточнение комплектации и индивидуального расчёта.' },
  { title: 'Реализация', text: 'Изготовление, доставка и установка — порядок и условия нужно подтвердить.' },
];
export const faq = [
  { id: 'estimate', question: 'Как получить индивидуальный расчёт?', answer: 'В будущем здесь будут подтверждённые способы обращения и перечень данных для расчёта. В прототипе заявки не отправляются.', demo: true },
  { id: 'delivery', question: 'Как организованы доставка и установка?', answer: 'География, стоимость, сроки и порядок доставки и установки пока не утверждены.', demo: true },
  { id: 'warranty', question: 'Какая гарантия предусмотрена?', answer: 'Гарантийные условия требуют подтверждения. Прототип не устанавливает срок или объём гарантии.', demo: true },
  { id: 'care', question: 'Как ухаживать за мебелью?', answer: 'Рекомендации появятся после согласования материалов и получения инструкций изготовителей.', demo: true },
];
export const contacts = { phone: null, maxUrl: null, telegramUrl: null, address: null, hours: null, region: 'Москва и Московская область' };

// Единая точка чтения контента. В следующем этапе адаптер можно заменить данными CMS.
export const contentRepository = { models, projects, reviews, promotions, steps, faq, contacts };
