import { buyerTopics, steps } from './content';
import { buyerContent } from './salon';
import { careGuides } from './care';
import { installationRates } from './services';
export type CustomerSectionId = 'order' | 'payment' | 'delivery' | 'warranty' | 'care';
const sectionDefinitions: { id: CustomerSectionId; label: string; sourceId: string }[] = [
 { id: 'order', label: 'Заказ', sourceId: 'order' }, { id: 'payment', label: 'Оплата', sourceId: 'payment' }, { id: 'delivery', label: 'Доставка', sourceId: 'delivery' }, { id: 'warranty', label: 'Гарантия', sourceId: 'warranty-care' }, { id: 'care', label: 'Уход', sourceId: 'care' },
];
export const customerSections = sectionDefinitions.map(section => ({ ...section, topic: buyerTopics.find(topic => topic.id === section.sourceId)!, content: buyerContent[section.sourceId] }));
export { steps, careGuides, installationRates };
// Existing delivery information from PilotCustomers; no new commercial conditions.
export const accessRates = [
 ['Замер в Москве и других районах Московской области', '2 000 ₽'],
 ['Замер в Раменском и Раменском районе', '1 000 ₽'],
 ['Ручной подъём при отсутствии подходящего грузового лифта', '1 000 ₽ за этаж'],
 ['Если часть деталей не помещается в лифт', '300 ₽ за этаж'],
 ['Подъём с подземного паркинга до лифта', '2 000 ₽; при двух этажах паркинга — 2 500 ₽'],
 ['Занос и подъём бытовой техники', '200 ₽ за единицу; крупногабаритной — 500 ₽ за единицу. Без подходящего лифта — за каждый этаж.'],
];
export const deliveryNotes = {
 access: 'Базовая доставка и занос за 6 000 ₽ для Косино, Выхино и Люберец не дублируются отдельным тарифом за занос. Дополнительный ручной подъём и особые условия согласовываются заранее.',
 assembly: 'Сборка мебели — 10% стоимости мебели, не менее 5 000 ₽. Состав работ и итоговая стоимость согласовываются для вашего заказа.',
 installation: 'Расходные материалы для монтажа и подключения приобретаются отдельно. Газовое оборудование подключает профильный специалист; сборщики салона газовые приборы не подключают. Работы, которых нет в перечне, согласовываются отдельно.',
 preparation: ['Освободите помещение от посторонних предметов. До установки мебели подготовьте электрические, сантехнические и газовые коммуникации с профильными специалистами по согласованному проекту.', 'Заранее сообщите монтажникам о скрытой проводке, трубах и особенностях стен. Согласуйте доступ в помещение и присутствие покупателя или представителя во время работ. Точки подключения техники должны быть готовы к установке.'],
};
