// Self-contained, offline HTML for client review. No deployment or network calls.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const assets = {};
function collect(directory) {
 for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
  const full = path.join(directory, entry.name);
  if (entry.isDirectory()) collect(full);
  else if (/\.(svg|jpg|png|webp|mp4|ttf|vtt)$/.test(entry.name)) {
   const key = path.relative(path.join(root, 'public'), full).split(path.sep).join('/');
   const mime = entry.name.endsWith('.vtt') ? 'text/vtt' : entry.name.endsWith('.ttf') ? 'font/ttf' : entry.name.endsWith('.mp4') ? 'video/mp4' : entry.name.endsWith('.svg') ? 'image/svg+xml' : entry.name.endsWith('.jpg') ? 'image/jpeg' : entry.name.endsWith('.webp') ? 'image/webp' : 'image/png';
   assets[key] = `data:${mime};base64,${fs.readFileSync(full).toString('base64')}`;
  }
 }
}
collect(path.join(root, 'public'));
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const local = url => path.join(dist, url.replace(/^\/walenza-website\//, ''));
html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g, (_, href) => { const css = fs.readFileSync(local(href), 'utf8').replace(/url\((["']?)([^)"']+)\1\)/g, (match, quote, url) => { const key = url.replace(/^\/walenza-website\//, '').replace(/^\//, ''); return assets[key] ? `url("${assets[key]}")` : match; }); return `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`; });
html = html.replace(/<link[^>]+rel="icon"[^>]*>/g, `<link rel="icon" href="${assets['favicon.svg']}">`);
html = html.replace(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g, (_, src) => `<script>window.__WALENZA_PREVIEW_ASSETS__=${JSON.stringify(assets)};</script><script type="module">${fs.readFileSync(local(src), 'utf8').replace(/<\/script/gi, '<\\/script')}</script>`);
const output = path.join(root, 'review');
const licenses = Object.fromEntries(fs.readdirSync(path.join(root, 'public/fonts')).filter(name => /\.txt$/i.test(name)).map(name => [name, fs.readFileSync(path.join(root, 'public/fonts', name), 'utf8')]));
html = html.replace('</body>', `<script type="application/json" id="font-license-notices">${JSON.stringify(licenses).replace(/</g, '\\u003c')}</script></body>`);
fs.mkdirSync(output, { recursive: true });
if (process.argv.includes('--final')) {
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/";</script>');
 const previewPath = path.join(output, 'WALENZA-review.html');
 fs.writeFileSync(previewPath, html);
 console.log('Unified local review: '+previewPath);
 process.exit(0);
}
if (process.argv.includes('--storage-categories')) {
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/furniture?preview=storage#wardrobes";</script>');
 const toolbar = '<nav aria-label="Предварительный просмотр каталога" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:10px 20px;background:#e9ebed;color:#292c30;font:14px Arial"><span>Категории шкафов · локальное согласование</span><a style="color:#711f38;padding:8px" href="#/furniture?preview=storage#wardrobes">Предпросмотр категорий</a><a style="color:#711f38;padding:8px" href="#/furniture#wardrobes">Вид для посетителя</a><a style="color:#711f38;padding:8px" href="#/furniture#dressing">Гардеробные</a></nav>';
 html = html.replace('<body>', `<body>${toolbar}`);
 const previewPath = path.join(output, 'WALENZA-storage-categories.html');
 fs.writeFileSync(previewPath, html);
 console.log(`Standalone wardrobe categories: ${previewPath} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
 process.exit(0);
}
if (process.argv.includes('--about-compact')) {
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/about?layout=compact";</script>');
 const toolbar = '<nav aria-label="Сравнение страницы О салоне" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:10px 20px;background:#e9ebed;color:#292c30;font:14px Arial"><span>О салоне · локальное сравнение</span><a style="color:#711f38;padding:8px" href="#/about?design=planes">Прежний вариант</a><a style="color:#711f38;padding:8px" href="#/about?layout=compact">Компактный вариант</a></nav>';
 html = html.replace('<body>', `<body>${toolbar}`);
 const previewPath = path.join(output, 'WALENZA-about-compact.html');
 fs.writeFileSync(previewPath, html);
 console.log(`Standalone About: ${previewPath} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
 process.exit(0);
}
if (process.argv.includes('--interior-planes')) {
 const reviewCss = fs.readFileSync(path.join(root, 'scripts/fixtures/interior-plane-review.css'), 'utf8');
 const reviewJs = fs.readFileSync(path.join(root, 'scripts/fixtures/interior-plane-review.js'), 'utf8');
 const toolbar = '<nav id="plane-review-tools" aria-label="Сравнение оформления"><span>Пробное оформление · интерьерные плоскости</span><button type="button" data-plane-mode="current" aria-pressed="false">Текущее</button><button type="button" data-plane-mode="planes" aria-pressed="true">Плоскости</button><a data-plane-route="/" href="#/?design=planes">Главная</a><a data-plane-route="/customers/pocket" href="#/customers/pocket?design=planes#order">Покупателям</a><a data-plane-route="/about" href="#/about?design=planes">О салоне</a></nav>';
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/?design=planes";</script>');
 html = html.replace('</head>', `<style>${reviewCss}</style></head>`).replace('<body>', `<body>${toolbar}`).replace('</body>', `<script>${reviewJs}</script></body>`);
 const previewPath = path.join(output, 'WALENZA-interior-planes.html');
 fs.writeFileSync(previewPath, html);
 console.log(`Standalone interior planes: ${previewPath} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
 process.exit(0);
}
if (process.argv.includes('--order-steps')) {
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/customers/pocket#order";</script>');
 const previewPath = path.join(output, 'WALENZA-order-steps.html');
 fs.writeFileSync(previewPath, html);
 console.log(`Standalone order steps: ${previewPath} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
 process.exit(0);
}
if (process.argv.includes('--customer-interiors')) {
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/customers/pocket#care";</script>');
 const previewPath = path.join(output, 'WALENZA-customer-interiors.html');
 fs.writeFileSync(previewPath, html);
 console.log(`Standalone customer interiors: ${previewPath} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
 process.exit(0);
}
if (process.argv.includes('--customer-pocket')) {
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/customers/pocket";</script>');
 const previewPath = path.join(output, 'WALENZA-customer-pocket.html');
 fs.writeFileSync(previewPath, html);
 console.log(`Standalone customer pocket: ${previewPath} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
 process.exit(0);
}
if (process.argv.includes('--rif')) {
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/kitchens/models/rif";</script>');
 const samplePath = path.join(output, 'WALENZA-rif-preview.html');
 fs.writeFileSync(samplePath, html);
 console.log(`Standalone Rif: ${samplePath} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
 process.exit(0);
}
if (process.argv.includes('--compact-samples')) {
 html = html.replace('<head>', '<head><script>if(!location.hash)location.hash="/kitchens/models/golden-stripe";</script>');
 const samplePath = path.join(output, 'WALENZA-compact-samples.html');
 fs.writeFileSync(samplePath, html);
 console.log(`Standalone samples: ${samplePath} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
 process.exit(0);
}
fs.writeFileSync(path.join(output, 'WALENZA-preview.html'), html);
fs.writeFileSync(path.join(output, 'WALENZA-pilot-preview.html'), html);
fs.writeFileSync(path.join(output, 'WALENZA-journal-preview.html'), html);
fs.writeFileSync(path.join(output, 'КАК ОТКРЫТЬ.txt'), 'WALENZA — локальная версия от 24 октября 2026 года.\n\nОткройте WALENZA-preview.html в современном браузере (Edge, Chrome, Firefox или Safari). Сервер и интернет для просмотра фотографий и видео не нужны. Интерактивная Яндекс Карта и внешние ссылки требуют интернета. Можно переслать один HTML-файл: фотографии и сокращённое видео включены внутрь.\n\nФотографии мебели и руководителей, отзывы и видео предоставлены заказчиком. Визуалы образцов материалов и макеты акций демонстрационные. Новые сведения на согласовании. Перечень материалов и производителей предоставлен заказчиком. Телефоны и адрес получены из задания. Заявки не отправляются, Telegram-бот запланирован, MAX обсуждается. Ссылка ВКонтакте и карта салона подключены. Эта версия не опубликована. На публичной ссылке остаётся предыдущая версия.\n');
console.log(`Standalone review: ${path.join(output, 'WALENZA-preview.html')} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
