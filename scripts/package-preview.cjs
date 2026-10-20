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
  else if (/\.(svg|jpg|png|webp)$/.test(entry.name)) {
   const key = path.relative(path.join(root, 'public'), full).split(path.sep).join('/');
   const mime = entry.name.endsWith('.svg') ? 'image/svg+xml' : entry.name.endsWith('.jpg') ? 'image/jpeg' : entry.name.endsWith('.webp') ? 'image/webp' : 'image/png';
   assets[key] = `data:${mime};base64,${fs.readFileSync(full).toString('base64')}`;
  }
 }
}
collect(path.join(root, 'public'));
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const local = url => path.join(dist, url.replace(/^\/walenza-website\//, ''));
html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g, (_, href) => `<style>${fs.readFileSync(local(href), 'utf8').replace(/<\/style/gi, '<\\/style')}</style>`);
html = html.replace(/<link[^>]+rel="icon"[^>]*>/g, `<link rel="icon" href="${assets['favicon.svg']}">`);
html = html.replace(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g, (_, src) => `<script>window.__WALENZA_PREVIEW_ASSETS__=${JSON.stringify(assets)};</script><script type="module">${fs.readFileSync(local(src), 'utf8').replace(/<\/script/gi, '<\\/script')}</script>`);
const output = path.join(root, 'review');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'WALENZA-preview.html'), html);
fs.writeFileSync(path.join(output, 'КАК ОТКРЫТЬ.txt'), 'WALENZA — предварительная версия от 20 октября 2026 года.\n\nОткройте WALENZA-preview.html в современном браузере (Edge, Chrome, Firefox или Safari). Сервер и интернет для просмотра изображений не нужны. Можно переслать один HTML-файл.\n\nКухни, материалы, проекты, отзывы и акции демонстрационные. Телефоны и адрес получены из задания. Заявки не отправляются, AI и мессенджеры не подключены. Сайт не опубликован.\n');
console.log(`Standalone review: ${path.join(output, 'WALENZA-preview.html')} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
