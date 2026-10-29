import { assetUrl } from '../assetUrl';

// Original files supplied by the client on 26 October 2026, copied without edits.
// Captions describe visible content, without attributing equipment or operations.
export const factoryPhotos = [
  { file: 'workshop', source: 'Снимок экрана 2026-10-26 141452.png', caption: 'Рабочее пространство фабрики' },
  { file: 'building', source: 'Снимок экрана 2026-10-26 141439.png', caption: 'Здание фабрики' },
  { file: 'team-at-work', source: 'Снимок экрана 2026-10-26 141458.png', caption: 'На производстве' },
  { file: 'workshop-line', source: 'Снимок экрана 2026-10-26 141445.png', caption: 'Внутри производства' },
  { file: 'packed-parts', source: 'Снимок экрана 2026-10-26 141508.png', caption: 'Помещение с упакованными деталями' },
].map(photo => ({ ...photo, image: assetUrl(`/images/factory/${photo.file}.png`), alt: `${photo.caption} WALENZA в Ульяновске` }));
