import { assetUrl } from '../assetUrl';
export type Layout = 'straight' | 'corner' | 'u';
export type Model = { id: string; title: string; layout: Layout; island: boolean; collections: string[]; subtitle: string; image: string; demo: boolean };
export type Project = { id: string; title: string; description: string; image: string; demo: boolean };
export type Promotion = { id: string; title: string; description: string; demo: boolean };
export type ContactIntent = { kind: 'request' | 'director' | 'max' | 'telegram' | 'ai'; context?: string };
export type OpenContact = (intent?: ContactIntent) => void;
export const navigation = [
 { path: '/', label: 'Главная' }, { path: '/kitchens', label: 'Кухни' }, { path: '/furniture', label: 'Шкафы и мебель' },
 { path: '/projects', label: 'Проекты' }, { path: '/materials', label: 'Материалы' }, { path: '/customers', label: 'Покупателям' },
 { path: '/promotions', label: 'Акции' }, { path: '/about', label: 'О салоне' }, { path: '/contacts', label: 'Контакты' },
];
export const primaryNavigation = navigation.filter(item => !['/', '/promotions', '/about'].includes(item.path));
export const collections = [
 { id: 'top', title: 'Топовые стильные кухни' }, { id: 'neoclassic', title: 'Неоклассические кухни' },
 { id: 'wood', title: 'Кухни с древесным акцентом' }, { id: 'character', title: 'Кухни с мужским характером' },
 { id: 'art-deco', title: 'Кухни в стиле арт-деко' }, { id: 'classic', title: 'Кухни в классическом стиле' },
];
export const layouts: { id: Layout; title: string }[] = [{ id: 'straight', title: 'Прямая' }, { id: 'corner', title: 'Угловая' }, { id: 'u', title: 'П-образная' }];
const model = (id: string, title: string, layout: Layout, island: boolean, groups: string[], subtitle: string): Model => ({ id, title, layout, island, collections: groups, subtitle, image: assetUrl(`/images/kitchens/${id}.svg`), demo: true });
export const models: Model[] = [
 model('line', 'Линия', 'straight', false, ['top', 'wood'], 'Светлый фон и выразительная фактура'),
 model('balance', 'Баланс', 'corner', true, ['neoclassic', 'top'], 'Мягкие оттенки и рамочные фасады'),
 model('rhythm', 'Ритм', 'u', true, ['art-deco', 'top'], 'Ритмичная геометрия и контрасты'),
 model('grove', 'Роща', 'corner', false, ['wood'], 'Тёплые фактуры в спокойном пространстве'),
 model('graphite', 'Графит', 'straight', true, ['character', 'wood'], 'Тёмные плоскости и лаконичные линии'),
 model('heritage', 'Наследие', 'u', false, ['classic'], 'Симметрия и выразительное обрамление'),
 model('horizon', 'Горизонт', 'corner', false, ['top', 'character'], 'Чистая композиция и глубокий цвет'),
 model('ivory', 'Слоновая кость', 'straight', false, ['neoclassic', 'classic'], 'Светлая интерпретация классических форм'),
 model('amber', 'Янтарь', 'u', true, ['wood', 'top'], 'Тёплая композиция с отдельным островом'),
 model('contour', 'Контур', 'u', false, ['character'], 'Строгие объёмы и графичные акценты'),
 model('crescent', 'Полумесяц', 'corner', true, ['art-deco'], 'Арочные детали и декоративный ритм'),
 model('estate', 'Усадьба', 'corner', false, ['classic', 'neoclassic'], 'Традиционная композиция в тёплых тонах'),
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
export const buyerTopics = [
 { id: 'order', title: 'Как заказать', summary: 'От знакомства с задачей до согласования проекта.', text: 'Предварительная схема приведена ниже. Порядок замера, согласования проекта и заключения договора требует подтверждения салоном.' },
 { id: 'payment', title: 'Оплата', summary: 'Порядок расчётов согласуется с заказом.', text: 'Способы оплаты, этапность и необходимые документы пока не утверждены. В прототипе оплата не принимается.' },
 { id: 'delivery', title: 'Доставка и установка', summary: 'Что предстоит уточнить до оформления заказа.', text: 'География, стоимость, сроки, условия подъёма и установки требуют подтверждения. Прототип не устанавливает эти условия.' },
 { id: 'warranty-care', title: 'Гарантия и уход', summary: 'Условия обслуживания и рекомендации для выбранного решения.', text: 'Гарантийные условия должны быть подтверждены. Рекомендации по уходу будут зависеть от согласованных материалов и инструкций изготовителей.' },
];
export const faq = [
 { id: 'estimate', question: 'Как подготовиться к обсуждению кухни?', answer: 'Можно заранее сформулировать пожелания и выбрать понравившиеся примеры. Окончательный перечень данных для индивидуального расчёта салону предстоит подтвердить.', demo: true },
 { id: 'example', question: 'Можно ли заказать кухню точно как на картинке?', answer: 'Иллюстрации демонстрационные. Они помогают обсудить направление; материалы, конфигурация и возможность реализации должны подтверждаться отдельно.', demo: true },
];
export const contacts = {
 phone: '+7 (985) 205-02-12', phoneHref: 'tel:+79852050212', extraPhone: '+7 (926) 336-44-06', extraPhoneHref: 'tel:+79263364406',
 address: 'Москва, Новоухтомское шоссе, д. 2А, ТЦ «Город Косино», 3-й этаж', hours: '10:00–22:00', region: 'Москва и Московская область', director: 'Анна',
 maxUrl: null, telegramUrl: null, directorUrl: null, aiUrl: null,
};
export const furnitureDirections = [
 { id: 'bedrooms', title: 'Спальни', text: 'Пример направления: хранение и мебель для спальни. Состав предложений предстоит согласовать.' },
 { id: 'living', title: 'Гостиные', text: 'Пример направления: композиции для гостиной. Изображения и комплектации ожидают подтверждения.' },
 { id: 'children', title: 'Детские', text: 'Пример направления: мебель для детского пространства. Ассортимент и требования требуют согласования.' },
 { id: 'hallways', title: 'Прихожие', text: 'Пример направления: хранение во входной зоне. Подробности появятся после наполнения.' },
];
export const materialCategories = [
 { id: 'facades', title: 'Фасадные материалы', image: assetUrl('/images/materials/facades.jpg'), description: 'Фактура и цвет задают настроение мебели.', examples: ['Светлая гладкая поверхность', 'Выразительная древесная фактура', 'Приглушённый цвет и рамочная композиция'] },
 { id: 'components', title: 'Каркасы и комплектующие', image: assetUrl('/images/materials/components.jpg'), description: 'Основа композиции и организация внутреннего пространства.', examples: ['Светлая внутренняя поверхность', 'Полки и разделители пространства', 'Условный пример соединений'] },
 { id: 'countertops', title: 'Столешницы', image: assetUrl('/images/materials/countertops.jpg'), description: 'Поверхности, которые связывают интерьер воедино.', examples: ['Светлая поверхность с мягким рисунком', 'Тёмная выразительная поверхность', 'Спокойная однородная фактура'] },
 { id: 'hardware', title: 'Фурнитура', image: assetUrl('/images/materials/hardware.jpg'), description: 'Детали ежедневного взаимодействия с мебелью.', examples: ['Пример петли', 'Пример направляющей', 'Пример ручки'] },
];
export const contentRepository = { models, projects, reviews, promotions, steps, faq, contacts, collections, layouts, buyerTopics, furnitureDirections, materialCategories };
