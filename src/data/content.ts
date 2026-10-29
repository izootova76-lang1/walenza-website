import { assetUrl } from '../assetUrl';
export type Layout = 'straight' | 'corner' | 'u';
export type Manufacturer = { id: string; name: string };
export type CatalogGroup = { id: string; title: string };
// Каталожная принадлежность не является утверждением о фабрике-изготовителе.
export const manufacturers: Manufacturer[] = [];
export const catalogGroups: CatalogGroup[] = [{ id: 'walenza', title: 'WALENZA' }];
export const primaryCatalogGroupId = 'walenza';
export type Model = { id: string; catalogGroupId: string; manufacturerId: string | null; title: string; workingTitle?: boolean; sourceLabel?: string; imageCaption?: string; layout: Layout; island: boolean | null; collections: string[]; subtitle: string; image: string; demo: boolean; facades: string; colors: string; hardware: string; customization: string; additionalImages?: { image: string; alt: string }[] };
export type Project = { id: string; title: string; description: string; image: string; demo: boolean; furnitureType?: string; additionalImages?: { image: string; alt: string }[]; features?: string[]; reviewId?: string; videoReview?: { src: string; poster: string; title: string } };
export type Promotion = { id: string; title: string; description: string; demo: boolean };
export type ContactIntent = { kind: 'request' | 'visit' | 'director' | 'max' | 'telegram' | 'ai'; context?: string };
export type OpenContact = (intent?: ContactIntent) => void;
export const navigation = [
 { path: '/', label: 'Главная' }, { path: '/kitchens', label: 'Кухни' }, { path: '/furniture', label: 'Шкафы и мебель' },
 { path: '/projects', label: 'Портфолио' }, { path: '/materials', label: 'Материалы' }, { path: '/customers', label: 'Покупателям' },
 { path: '/promotions', label: 'Акции' }, { path: '/about', label: 'О салоне' }, { path: '/contacts', label: 'Контакты' },
];
export const primaryNavigation = navigation.filter(item => !['/', '/promotions', '/about'].includes(item.path));
export const collections = [
 { id: 'top', title: 'Топовые стильные кухни' }, { id: 'neoclassic', title: 'Неоклассические кухни' },
 { id: 'wood', title: 'Кухни с древесным акцентом' }, { id: 'character', title: 'Кухни с мужским характером' },
 { id: 'art-deco', title: 'Кухни в стиле арт-деко' }, { id: 'classic', title: 'Кухни в классическом стиле' },
];
export const layouts: { id: Layout; title: string }[] = [{ id: 'straight', title: 'Прямая' }, { id: 'corner', title: 'Угловая' }, { id: 'u', title: 'П-образная' }];
const model = (id: string, title: string, layout: Layout, island: boolean | null, groups: string[], subtitle: string, facades: string, colors = 'Палитры RAL, CS, NCS — по описанию салона'): Model => ({ id, catalogGroupId: primaryCatalogGroupId, manufacturerId: null, title, layout, island, collections: groups, subtitle, image: assetUrl(`/images/kitchens/${id}.jpg`), demo: false, facades, colors, hardware: 'Blum или Boyard — на выбор', customization: 'По описанию салона: сочетание с другими фасадами, выбор материала столешницы и нестандартные размеры. Итоговая комплектация согласуется индивидуально.' });
// У новых фотографий нет технических описаний: не наследуем сведения других кухонь.
const photographedModel = (id: string, title: string, layout: Layout, groups: string[], subtitle: string, additional: string[] = []): Model => ({
 ...model(id, title, layout, false, groups, subtitle, 'Материал и отделка фасадов уточняются', 'Доступные цвета и декоры уточняются'),
 workingTitle: true, sourceLabel: 'Изображение предоставлено заказчиком', hardware: 'Марка и комплектация уточняются',
 customization: 'Размеры, материалы и наполнение подбираются при обсуждении индивидуального проекта.',
 additionalImages: additional.map(name => ({ image: assetUrl(`/images/kitchens/${name}.jpg`), alt: `Кухня «${title}»: детали предоставленного изображения` })),
});
const sourceModels: Model[] = [
 photographedModel('terracotta', 'Терракота', 'corner', ['top', 'character'], 'Графитовые плоскости, выразительный фартук и тёплые акценты обеденной зоны', ['terracotta-details', 'terracotta-triptych']),
 photographedModel('olive', 'Олива', 'u', ['top', 'neoclassic', 'classic'], 'Приглушённый зелёный, рамочные фасады и светлая рабочая поверхность', ['olive-details']),
 photographedModel('oak-room', 'Дубрава', 'corner', ['top', 'wood', 'art-deco'], 'Древесный рисунок, рифлёный акцент и высокая стеклянная витрина'),
 photographedModel('contour', 'Контур', 'corner', ['top', 'wood', 'character'], 'Тёплая древесная фактура, чёткие линии и контрастные тёмные детали', ['contour-details']),
 { ...photographedModel('graphite', 'Графит', 'corner', ['top', 'character'], 'Тёмные фасады и тёплое внутреннее пространство с подсвеченной витриной'), imageCaption: 'На предоставленном изображении показано внутреннее наполнение кухни' },
 model('arfa', 'Арфа', 'straight', false, ['top', 'character', 'art-deco'], 'Тёмные матовые фасады, рифлёный акцент и выразительный рисунок фартука', 'МДФ 19 мм с рифлёной фрезеровкой, покрытие матовой эмалью'),
 model('brooklyn', 'Бруклин', 'corner', false, ['neoclassic', 'wood'], 'Светлые фасады с тонкой рамкой и древесный акцент', 'МДФ 19 мм, матовая эмаль, фрезеровка «тонкая рамка»'),
 model('street', 'Стрит', 'straight', false, ['top', 'wood', 'character'], 'Строгая геометрия, спокойные фасады и тёплая древесная фактура', 'Экстраматовая МДФ-плита, покрытая нанопластиком Uniton', 'Палитра производителя'),
 model('villa', 'Вилла', 'straight', false, ['top'], 'Тёплый цвет, гладкие фасады и интегрированные ручки', 'МДФ 19 мм с интегрированной ручкой, покрытие матовой эмалью'),
 model('rif', 'Риф', 'corner', false, ['top', 'art-deco'], 'Рифлёные поверхности, мягкие оттенки и закруглённая деталь', 'МДФ 19 мм с рифлёной фрезеровкой, покрытие матовой эмалью'),
 { ...model('golden-stripe', 'Золотая полоса', 'corner', null, ['top', 'art-deco'], 'Вертикальный ритм фасадов и тонкая вставка под золото', 'МДФ с матовой эмалью; две фрезеровки соединены пластиковой или металлической вставкой, имитирующей золото'), additionalImages: [{ image: assetUrl('/images/kitchens/golden-stripe-alt.jpg'), alt: 'Кухня «Золотая полоса»: дополнительный вариант композиции из сообщества салона' }] },
 model('scandinavia', 'Скандинавия', 'corner', null, ['top', 'wood'], 'Древесный рисунок, светлые поверхности и выразительный фартук', 'МДФ, облицованная с двух сторон пластиком ETERNO', 'Палитра производителя; в описании указано несколько коллекций'),
 model('verona', 'Верона', 'straight', false, ['neoclassic', 'classic'], 'Фигурные рамочные фасады в глубоком цвете и светлые верхние шкафы', 'МДФ 22 мм с фигурной фрезеровкой, покрытие матовой эмалью'),

 // User confirmed this photograph and its separate island on 28 October.
 // Neutral working caption; direction and technical specification are not assigned.
 { ...photographedModel('island-kitchen', 'Кухня с островом', 'straight', [], 'Композиция с отдельным островом. Реальная кухня WALENZA, фотография предоставлена заказчиком.'), island: true, sourceLabel: 'Фотография реальной кухни WALENZA. Наличие отдельного острова подтверждено заказчиком.' },

];
// Approved list supplied by the client, 26 October. Missing models are not fabricated.
export const approvedTopModelNames = ['Риф', 'Дюна', 'Бруклин', 'Градини', 'Флирт', 'Амаретто'];
export const models: Model[] = sourceModels.map(item => ({ ...item, collections: [...item.collections.filter(id => id !== 'top'), ...(approvedTopModelNames.includes(item.title) ? ['top'] : [])] }));
export function selectCatalogModels(groupId: string, source: readonly Model[] = models): Model[] {
 return source.filter(item => item.catalogGroupId === groupId);
}
export const projects: Project[] = [
 { id: 'quiet-space', title: 'Мягкий свет', description: 'Кухня с продолжением в гостиную: спокойные серо-голубые фасады, тёплые акценты и подсвеченные витрины. Фотографии и видеоотзыв предоставлены заказчиком.', image: assetUrl('/images/projects/soft-light.jpg'), demo: false, furnitureType: 'Кухня и продолжение в гостиную',
 additionalImages: [
  { image: assetUrl('/images/projects/soft-light-worktop.jpg'), alt: 'Кухня «Мягкий свет»: рабочая зона и подсвеченные витрины' },
  { image: assetUrl('/images/projects/soft-light-detail.jpg'), alt: 'Кухня «Мягкий свет»: мойка, рабочая поверхность и детали фасадов' },
 ],
 features: ['Единая композиция связывает кухонную зону и продолжение в гостиную.', 'Рамочные фасады, ручки тёплого оттенка и витрины с подсветкой создают спокойный ритм интерьера.', 'Название «Мягкий свет» — рабочее, для прототипа. Размеры, материалы и комплектация обсуждаются индивидуально. Стоимость — индивидуальный расчёт.'],
 videoReview: { src: assetUrl('/videos/soft-light-review.mp4'), poster: assetUrl('/images/projects/review-poster.jpg'), title: 'Видеоотзыв клиента о кухне и продолжении в гостиную' } },
];
export type Review = { id: string; title: string; text: string; demo: boolean; videoUrl?: string; videoPoster?: string; captionsUrl?: string };
export const reviews: Review[] = [
 { id: 'victoria', title: 'Виктория', text: 'Шикарная, ребята вчера всё установили. Я в восторге, спасибо вам!', demo: false },
 { id: 'rimma', title: 'Римма', text: 'Шкаф и комод установили, я ещё не видела, но сын сказал — мощно, спасибо большое!', demo: false },
 { id: 'andrey', title: 'Андрей', text: 'С заказом всё отлично, спасибо большое. Пользуемся', demo: false },
];
export const promotions: Promotion[] = [
 { id: 'season', title: 'Сезонное предложение', description: 'Демонстрация карточки акции. Состав предложения, даты и условия ещё не утверждены.', demo: true },
 { id: 'collection', title: 'Предложение для коллекции', description: 'Место для будущего предложения по моделям. Действующая скидка не заявлена.', demo: true },
];
export const steps = [
 { title: 'Консультация', text: 'Обсуждаем пожелания, размеры, стиль и примерный бюджет. Знакомим с возможностями производства и материалами.' },
 { title: 'Предварительный проект', text: 'Подготавливаем проект и ориентировочный расчёт стоимости. Работа возможна в салоне или дистанционно.' },
 { title: 'Замер', text: 'Согласовываем время замера помещения. После него уточняем проект с учётом реальных размеров.' },
 { title: 'Согласование деталей', text: 'Выбираем фасады, цвета, материалы, столешницу, фурнитуру и внутреннее наполнение. Уточняем окончательную стоимость мебели и услуг.' },
 { title: 'Договор', text: 'Оформляем договор, принимаем предоплату и передаём проект на техническое согласование.' },
 { title: 'Производство', text: 'После необходимых проверок заказ поступает в производство и проходит контроль качества.' },
 { title: 'Доставка и монтаж', text: 'Согласовываем дату доставки, устанавливаем мебель и проводим приёмку выполненных работ.' },
];
export const buyerTopics = [
 { id: 'order', title: 'Как заказать', summary: 'Семь этапов — от консультации до установки.', text: 'Обсудим идею, согласуем проект и материалы, затем пройдём путь изготовления и установки.' },
 { id: 'payment', title: 'Оплата', summary: 'Порядок расчётов фиксируется в договоре.', text: 'Размер предоплаты и сроки платежей согласовываются для конкретного заказа.' },
 { id: 'delivery', title: 'Сроки, доставка и монтаж', summary: 'Изготовление — от 21 рабочего дня, в зависимости от материала.', text: 'Точный срок изготовления фиксируется в договоре. Дату и время доставки согласовываем с клиентом индивидуально.' },
 { id: 'warranty-care', title: 'Гарантия', summary: 'Гарантия на мебель — 24 месяца.', text: 'Подробные условия для выбранной мебели фиксируются при оформлении заказа.' },
 { id: 'care', title: 'Уход', summary: 'Простые привычки для вашей мебели.', text: 'Рекомендации зависят от выбранных материалов.' },
];
export const faq = [
 { id: 'timing', question: 'Сколько времени изготавливается мебель?', answer: 'От 21 рабочего дня. Срок зависит от материала и особенностей проекта; точный срок фиксируется в договоре.', demo: false },
 { id: 'remote', question: 'Можно ли обсудить проект дистанционно?', answer: 'Да, предварительный проект можно обсудить дистанционно. Удобный формат и необходимые материалы согласуйте с командой салона.', demo: false },
 { id: 'dimensions', question: 'Можно ли изготовить мебель по нестандартным размерам?', answer: 'Салон работает с индивидуальными проектами. Размеры и техническую возможность исполнения конкретного изделия уточняем после обсуждения и замера.', demo: false },
 { id: 'estimate', question: 'Как рассчитывается стоимость?', answer: 'Индивидуально, с учётом размеров, материалов и комплектации. Доставка, подъём и монтаж согласовываются отдельно; окончательная стоимость фиксируется при оформлении заказа.', demo: false },
 { id: 'facades', question: 'Какие варианты фасадов существуют?', answer: 'В предоставленном списке есть МДФ в плёнке ПВХ, матовая и глянцевая эмаль, пластик, шпон и мультишпон. Конкретные серии, декоры и применение к выбранной модели обсуждаются отдельно.', demo: false },
 { id: 'hardware', question: 'Можно ли выбрать фурнитуру?', answer: 'В перечне салона представлены Blum и Boyard. Подходящие механизмы и комплектацию подбираем под конкретный проект.', demo: false },
 { id: 'installation', question: 'Как организованы доставка и монтаж?', answer: 'Дата и время доставки согласовываются индивидуально. В районе Косино, Выхино и Люберец доставка и занос стоят 6 000 ₽. Для других районов стоимость рассчитывается с учётом расстояния от склада в Раменском. Подъём и монтаж согласовываются с учётом условий заказа. После установки проводится приёмка выполненных работ.', demo: false },
 { id: 'warranty', question: 'Какой гарантийный срок?', answer: 'Гарантия на мебель — 24 месяца. Подробные условия для конкретного изделия фиксируются при оформлении договора.', demo: false },
 { id: 'care', question: 'Как правильно ухаживать за фасадами и столешницами?', answer: 'Уход зависит от поверхности. Используйте мягкую ткань, своевременно удаляйте влагу и применяйте подходящие для выбранного материала средства с учётом рекомендаций изготовителя.', demo: false },
 { id: 'designer', question: 'Можно ли заказать мебель по проекту дизайнера?', answer: 'Передайте проект команде салона: обсудим задачу, материалы и возможность изготовления. Технические решения и условия требуют индивидуального согласования.', demo: false },
];
export const contacts = {
 phone: '+7 (985) 205-02-12', phoneHref: 'tel:+79852050212', extraPhone: '+7 (926) 336-44-06', extraPhoneHref: 'tel:+79263364406',
 address: 'Москва, Новоухтомское шоссе, д. 2А, ТЦ «Город Косино», 3-й этаж', hours: '10:00–22:00', region: 'Москва и Московская область', director: 'Анна Ярошинская', salonName: 'Walenza мебель', landmarks: 'Ориентиры: «Интерьер Холл» и «Мебель Рум»', emails: ['adorisanna@mail.ru', 'mxralex24@mail.ru'],
 vkUrl: 'https://vk.com/walenzamebel', mapUrl: 'https://yandex.ru/maps/org/walenza/95327657475/', mapRouteUrl: 'https://yandex.ru/maps/?rtext=~55.713090%2C37.845917&rtt=auto&ruri=~ymapsbm1%3A%2F%2Forg%3Foid%3D95327657475', mapWidgetUrl: 'https://yandex.ru/map-widget/v1/?mode=search&oid=95327657475&ol=biz&lang=ru_RU&z=16',
 maxUrl: null, telegramUrl: null, directorUrl: null, aiUrl: null,
};
export const furnitureDirections = [
 { id: 'bedrooms', title: 'Спальни', text: 'Пример направления: хранение и мебель для спальни. Состав предложений предстоит согласовать.' },
 { id: 'living', title: 'Гостиные', text: 'Пример направления: композиции для гостиной. Изображения и комплектации ожидают подтверждения.' },
 { id: 'children', title: 'Детские', text: 'Пример направления: мебель для детского пространства. Ассортимент и требования требуют согласования.' },
 { id: 'hallways', title: 'Прихожие', text: 'Пример направления: хранение во входной зоне. Подробности появятся после наполнения.' },
];
export type MaterialEntry = { title: string; detail?: string; brands?: string[] };
export type MaterialVisual = { id: string; title: string; description: string; image: string; alt: string; demo: boolean };
export type MaterialCategory = { id: string; title: string; image: string; description: string; visuals: MaterialVisual[]; entries: MaterialEntry[] };
const materialVisual = (id: string, title: string, description: string, alt: string): MaterialVisual => ({ id, title, description, image: assetUrl(`/images/materials/samples/${id}.jpg`), alt, demo: true });
export const materialCategories: MaterialCategory[] = [
 { id: 'facades', title: 'Фасадные материалы', image: assetUrl('/images/materials/facades.jpg'), description: 'Фактура и цвет задают настроение мебели.', visuals: [
  materialVisual('matte', 'Матовые поверхности', 'Мягкий цвет и спокойная поверхность без ярких отражений. Здесь — пример в приглушённом зелёном оттенке.', 'Сгенерированный пример: матовый зелёный фасад крупным планом'),
  materialVisual('gloss', 'Глянцевые поверхности', 'Свет и отражения становятся частью композиции. На светлом фасаде хорошо заметен характер блеска.', 'Сгенерированный пример: светлый глянцевый фасад с отражением окна'),
  materialVisual('wood', 'Древесные фактуры', 'Рисунок волокон, переходы оттенков и ощущение тепла. Пример помогает представить древесный акцент в мебели.', 'Сгенерированный пример: три образца с древесным рисунком от светлого до тёмного'),
 ], entries: [
  { title: 'МДФ Egger' }, { title: 'МДФ в плёнке ПВХ' }, { title: 'Крашеный МДФ', detail: 'Матовый и глянцевый' },
  { title: 'Eterno' }, { title: 'Rehau' }, { title: 'Пластик Arpa' }, { title: 'Шпон и мультишпон' },
 ] },
 { id: 'components', title: 'Каркасы и комплектующие', image: assetUrl('/images/materials/components.jpg'), description: 'Основа композиции и организация внутреннего пространства.', visuals: [
  materialVisual('carcass', 'Основа мебели — в деталях', 'Открытый корпус показывает внутренние поверхности и полки, а отдельный образец — древесный декор и структуру ЛДСП на срезе.', 'Сгенерированный пример: светлый открытый корпус с полкой и образец ЛДСП с древесным декором'),
 ], entries: [
  { title: 'ЛДСП для каркасов', brands: ['Egger', 'Lamarty', 'Kronospan', 'Uvadrev'] },
 ] },
 { id: 'countertops', title: 'Столешницы', image: assetUrl('/images/materials/countertops.jpg'), description: 'Поверхности, которые связывают интерьер воедино.', visuals: [
  materialVisual('hpl', 'HPL', 'Древесный или спокойный однотонный декор. На примере видны поверхность и торец столешницы.', 'Сгенерированный пример: столешницы с древесным и серым декором, виден срез плиты'),
  materialVisual('stone', 'Искусственный камень', 'Светлые оттенки и мелкий рисунок поверхности. Крупный план помогает рассмотреть фактуру и край.', 'Сгенерированный пример: два светлых образца искусственного камня с мелкими вкраплениями'),
  materialVisual('quartz', 'Кварцевый агломерат', 'Минеральный рисунок и мягкие прожилки. Здесь показан один из возможных визуальных характеров поверхности.', 'Сгенерированный пример: светлая столешница с минеральным рисунком и тёмный образец на фоне'),
 ], entries: [
  { title: 'HPL', brands: ['Мир столешниц', 'Союз', 'Slotex'] },
  { title: 'Искусственный камень', brands: ['Formax', 'Primax', 'Staron', 'Grandex'] },
  { title: 'Кварцевый агломерат', brands: ['Avant', 'Radianz', 'Cerastoun'] },
 ] },
 { id: 'hardware', title: 'Фурнитура', image: assetUrl('/images/materials/hardware.jpg'), description: 'Детали ежедневного взаимодействия с мебелью.', visuals: [
  materialVisual('hardware', 'Как устроено движение', 'Направляющие выдвижного ящика и мебельная петля показаны вблизи. Конкретные механизмы и их возможности подбираются под проект.', 'Сгенерированный пример: открытый деревянный ящик с металлической направляющей и мебельная петля на столешнице'),
 ], entries: [
  { title: 'Blum' }, { title: 'Boyard' },
 ] },
];
export const contentRepository = { models, manufacturers, catalogGroups, projects, reviews, promotions, steps, faq, contacts, collections, layouts, buyerTopics, furnitureDirections, materialCategories };
