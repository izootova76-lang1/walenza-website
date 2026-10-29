import { assetUrl } from '../assetUrl';
import { projects } from './content';
import { storageItems } from './storage';
export type PortfolioPhoto = { image: string; alt: string; caption: string };
export type PortfolioProject = { id: string; title: string; photos: PortfolioPhoto[]; note?: string; visual?: boolean };
const photo = (path: string, alt: string, caption = 'Реальный проект'): PortfolioPhoto => ({ image: assetUrl(`/images/${path}`), alt, caption });
const kitchen = (id: string, title: string, files: string[]): PortfolioProject => ({ id, title, photos: files.map((file, i) => photo(`kitchens/${file}.jpg`, `${title}: ${i ? 'детали' : 'общий вид'}`)) });
// Separate presentation data leaves the prototype catalogue and home untouched.
export const portfolioProjects: PortfolioProject[] = [
 kitchen('island', 'Кухня с островом', ['island-kitchen']),
 kitchen('log-house', 'Кухня в бревенчатом доме', ['olive', 'olive-details']),
 { id: 'soft-light', title: 'Кухня и гостиная', photos: [photo('projects/soft-light.jpg', 'Кухня и продолжение в гостиную'), ...(projects[0].additionalImages || []).map(p => ({ ...p, caption: 'Реальный проект' }))] },
 { id: 'arched-windows', title: 'Кухня с арочными окнами', photos: [
  photo('kitchens/terracotta.jpg', 'Установленная графитовая кухня с арочными окнами'),
  photo('portfolio/arched-vision.webp', 'Интерьерное видение той же кухни: белые кресла и шторы', 'Интерьерное видение · ИИ-стилизация'),
  photo('portfolio/arched-cabinets.webp', 'Крупный план навесных шкафов', 'Предоставленный крупный план'),
  photo('portfolio/arched-worktop.webp', 'Рабочая поверхность и варочная панель', 'Предоставленный крупный план'),
  photo('portfolio/arched-sink.webp', 'Мойка и смеситель', 'Предоставленный крупный план'),
  photo('portfolio/arched-light.webp', 'Серебристая геометрическая люстра', 'Предоставленный крупный план'),
 ], note: 'Интерьерное видение дополнено с помощью ИИ. Происхождение крупных планов требует уточнения; они не обозначены документальными фотографиями.' },
 kitchen('wood', 'Кухня с древесными фасадами', ['contour', 'contour-details']),
 kitchen('display', 'Кухня с высокой витриной', ['oak-room']),
 ...storageItems.map(item => ({
  id: `storage-${item.id}`,
  title: ({ laguna: 'Шкаф с жалюзийными фасадами', arka: 'Шкаф с розовой аркой', texture: 'Шкаф с древесным рисунком', silhouette: 'Шкаф со стеклянной секцией', orbita: 'Шкаф с геометрическими фасадами', gallery: 'Светлая гардеробная', 'salon-dressing': 'Гардеробная в салоне' } as Record<string, string>)[item.id],
  visual: item.id !== 'salon-dressing',
  note: item.id === 'salon-dressing' ? undefined : 'Предоставленные визуалы. Документальное происхождение и статус выполненной работы пока не подтверждены.',
  photos: [item.images.facades, item.images.interior, item.additional].filter((p): p is NonNullable<typeof p> => !!p).map(p => ({ image: p.src, alt: p.alt, caption: item.id === 'salon-dressing' ? 'Реальный проект · фото салона' : 'Предоставленный визуал' })),
 })),
];
