// One asset record per source file. Models and material pages refer to stable IDs.
export type MediaOrigin = 'customer-original' | 'catalog-image' | 'official-sample' | 'ai-visualization';
export type LibraryMedia = { id: string; path: string; origin: MediaOrigin; alt: string; caption: string; source: string };
export const libraryMedia: Record<string, LibraryMedia> = {
 'rif-customer-kitchen': { id: 'rif-customer-kitchen', path: '/images/kitchens/rif/originals/customer-kitchen.png', origin: 'customer-original', alt: 'Исходное изображение кухни от заказчика: рамочные фасады, без замены на «Риф»', caption: 'Исходная композиция · без замены фасадов', source: 'Заказчик, скриншот 26.10.2026 105055. Статус реального выполненного проекта не установлен.' },
 'rif-catalog': { id: 'rif-catalog', path: '/images/kitchens/rif.jpg', origin: 'catalog-image', alt: 'Каталожная композиция «Риф» с вертикальным рифлением', caption: '«Риф» · изображение из каталога салона', source: 'Сообщество салона ВКонтакте, ранее предоставленный скриншот; docs/KITCHEN_MODELS_REVIEW.md. Другая композиция, не дополнительный ракурс исходной кухни.' },
 'rif-light-source': { id: 'rif-light-source', path: '/images/materials/originals/rif-light.png', origin: 'official-sample', alt: 'Предоставленный светлый образец фасада «Риф» с волнообразным рельефом', caption: 'Официальный образец «Риф» · предоставлен заказчиком', source: 'Заказчик, скриншот 26.10.2026 105325. На изображении указана серия «Премиум Плюс».' },
 'rif-dark-source': { id: 'rif-dark-source', path: '/images/materials/originals/rif-dark.png', origin: 'official-sample', alt: 'Предоставленный тёмный образец фасада «Риф» с вертикальным рельефом', caption: 'Официальный образец «Риф» · предоставлен заказчиком', source: 'Заказчик, скриншот 26.10.2026 105309. Название оттенка и артикул не предоставлены.' },
};
export type SourceCrop = { x: number; y: number; width: number; height: number; sourceWidth: number; sourceHeight: number };
export type MaterialSample = { id: string; name: string; previewLabel: string; category: 'facade'; mediaId: string; displayCrop?: SourceCrop };
export const materialSamples: Record<string, MaterialSample> = {
 'rif-light': { id: 'rif-light', name: 'Риф', previewLabel: 'Светлый образец', category: 'facade', mediaId: 'rif-light-source', displayCrop: { x: 28, y: 52, width: 316, height: 591, sourceWidth: 406, sourceHeight: 733 } },
 'rif-dark': { id: 'rif-dark', name: 'Риф', previewLabel: 'Тёмный образец', category: 'facade', mediaId: 'rif-dark-source', displayCrop: { x: 28, y: 29, width: 327, height: 570, sourceWidth: 398, sourceHeight: 633 } },
};
// Display labels describe the supplied images; they are not official colour names.
export const rifPresentation = {
 galleryMediaIds: ['rif-catalog'],
 aiMediaIds: [] as string[], // Add standalone customer AI files here, explicitly labelled.
 sampleIds: ['rif-light', 'rif-dark'],
 specifications: [
  { label: 'Фасады', value: 'МДФ, 19 мм' },
  { label: 'Покрытие', value: 'Матовая эмаль' },
  { label: 'Рельеф', value: 'Рифлёная фрезеровка' },
 ], // Existing model description from supplied salon materials; never infer from a colour swatch.
};

export type RifFrame = { id: string; title: string; mediaId?: string; crop?: SourceCrop; caption: string };
// All available frames refer to ONE source image. Crops are not new camera angles.
export const rifGalleryFrames: RifFrame[] = [
 { id: 'overview', title: 'Общий вид', mediaId: 'rif-catalog', caption: 'Каталожное изображение «Риф»' },
 { id: 'second-angle', title: 'Второй ракурс', caption: 'Нужна дополнительная визуализация этой же кухни.' },
 { id: 'facade', title: 'Фасад', mediaId: 'rif-catalog', crop: { x: 245, y: 80, width: 240, height: 300, sourceWidth: 670, sourceHeight: 838 }, caption: 'Рифлёный фасад · фрагмент исходного изображения' },
 { id: 'detail', title: 'Витрина', mediaId: 'rif-catalog', crop: { x: 0, y: 0, width: 200, height: 250, sourceWidth: 670, sourceHeight: 838 }, caption: 'Витрина · фрагмент исходного изображения' },
];
