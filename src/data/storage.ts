import { assetUrl } from '../assetUrl';

export type StoragePhoto = { src: string; alt: string };
export type WardrobeDoorType = 'hinged' | 'sliding';
export type StorageItem = {
 id: string;
 kind: 'wardrobe' | 'dressing';
 // Set only when the opening mechanism is confirmed. Never inferred from kind.
 doorType?: WardrobeDoorType;
 title: string;
 description: string;
 interiorDescription: string;
 images: { facades?: StoragePhoto; interior?: StoragePhoto };
 additional?: StoragePhoto;
 photoAspectRatio?: '4/3';
};
const photo = (id: string, alt: string): StoragePhoto => ({ src: assetUrl(`/images/storage/${id}.jpg`), alt });

export const wardrobeCategories: { id: WardrobeDoorType; title: string }[] = [
 { id: 'hinged', title: 'Распашные шкафы' },
 { id: 'sliding', title: 'Шкафы-купе' },
];

export const storageItems: StorageItem[] = [
 { id: 'laguna', kind: 'wardrobe', doorType: 'hinged', title: 'Лагуна', description: 'Приглушённый голубой оттенок, жалюзийные фасады и открытые боковые полки.', interiorDescription: 'Секции для одежды на плечиках, полки и выдвижные ящики.', images: { facades: photo('laguna-facades', 'Шкаф «Лагуна» с закрытыми голубыми фасадами'), interior: photo('laguna-interior', 'Шкаф «Лагуна»: открытые двери, полки, штанги и выдвинутые ящики') } },
 { id: 'arka', kind: 'wardrobe', doorType: 'hinged', title: 'Арка', description: 'Пудровый акцент с арочным рисунком и круглой составной ручкой.', interiorDescription: 'Отделение для одежды на плечиках, полки и два ящика.', images: { facades: photo('arka-facades', 'Шкаф «Арка» с закрытыми фасадами и розовым арочным акцентом'), interior: photo('arka-interior', 'Шкаф «Арка»: секция с одеждой на плечиках, полки и ящики') } },
 { id: 'texture', kind: 'wardrobe', doorType: 'hinged', title: 'Текстура', description: 'Выразительный древесный рисунок и лаконичные вертикальные ручки.', interiorDescription: 'Секции разной высоты, полки и ящики. На изображении также виден доступ к техническим люкам.', images: { facades: photo('texture-facades', 'Шкаф «Текстура» с закрытыми фасадами с древесным рисунком'), interior: photo('texture-interior', 'Шкаф «Текстура» с открытыми дверями, штангами, полками и ящиками') } },
 { id: 'silhouette', kind: 'wardrobe', doorType: 'hinged', title: 'Силуэт', description: 'Светлые поверхности, рифлёная деталь и узкая витрина в тёмном обрамлении.', interiorDescription: 'Длинная секция для одежды, полки, ящики и боковая стеклянная витрина.', images: { facades: photo('silhouette-facades', 'Шкаф «Силуэт» с закрытыми светлыми фасадами и стеклянной витриной'), interior: photo('silhouette-interior', 'Шкаф «Силуэт»: открытые секции со штангой, полками и ящиками') } },
 { id: 'orbita', kind: 'wardrobe', doorType: 'hinged', title: 'Орбита', description: 'Круговой рисунок на светлых фасадах и тёплый свет боковой витрины.', interiorDescription: 'Полки, секция для одежды на плечиках, выдвижные ящики и витрина.', images: { facades: photo('orbita-facades', 'Шкаф «Орбита»: закрытые белые фасады с круговым рисунком и подсвеченная витрина'), interior: photo('orbita-interior', 'Шкаф «Орбита» с открытыми дверями и выдвинутыми ящиками') }, additional: photo('orbita-angle', 'Шкаф «Орбита»: боковой ракурс с подсвеченной витриной') },
 { id: 'gallery', kind: 'dressing', title: 'Галерея', description: 'Светлая гардеробная с рамочными фасадами и акцентами под золото.', interiorDescription: 'Высокие секции для одежды, несколько уровней штанг и верхние полки.', images: { facades: photo('gallery-facades', 'Гардеробная «Галерея» с закрытыми светлыми фасадами'), interior: photo('gallery-interior', 'Гардеробная «Галерея»: открытые секции для хранения одежды') }, additional: photo('gallery-angle', 'Гардеробная «Галерея»: боковой ракурс со стеклянной витриной') },
 { id: 'salon-dressing', kind: 'dressing', title: 'Гардеробная в салоне', description: 'Реальные фотографии салона WALENZA. Название модели пока не указано.', interiorDescription: '', photoAspectRatio: '4/3', images: { facades: photo('salon-dressing-overview', 'Гардеробная в салоне WALENZA: общий вид с закрытыми фасадами и витринами') }, additional: photo('salon-dressing-details', 'Коллаж деталей той же гардеробной: фасады, ручки и подсвеченная витрина') },
];
