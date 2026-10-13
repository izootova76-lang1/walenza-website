# GitHub Pages

Репозиторий: `izootova76-lang1/walenza-website`.

Адрес сайта: `https://izootova76-lang1.github.io/walenza-website/`.

## Технология и изменения

Сохранены React + TypeScript + Vite, компоненты, данные и оформление. Для статического размещения:

- `vite.config.ts`: `base: '/walenza-website/'`.
- `src/main.tsx`: HashRouter вместо BrowserRouter.
- `src/assetUrl.ts`: единое построение public-путей через `import.meta.env.BASE_URL`.
- Иллюстрации остаются локальными; favicon и файлы сборки получают префикс репозитория.
- Внутренние якоря и ссылка пропуска меню сохраняют текущий маршрут.
- На всех страницах видна согласованная пометка о предварительной версии.
- `public/.nojekyll`: маркер статического сайта.
- `.github/workflows/deploy-pages.yml`: установка по lock-файлу, проверка TypeScript, сборка Vite и публикация `dist` официальными Actions, закреплёнными по SHA.

## Настройки репозитория

1. Отдельный репозиторий `walenza-website`, ветка `main`. В публикацию исходников не включать `node_modules`, `dist`, QA-снимки, ключи и токены.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. При push в `main` запускается Deploy WALENZA to GitHub Pages. Ручной повтор: Actions → workflow → Run workflow.
4. В Settings → Actions нужно разрешить запуск workflow и используемых официальных actions. Если environment `github-pages` требует ручного одобрения, одобрить deployment.
5. Проверять завершение build/deploy, HTTP 200 и интерфейс опубликованного URL. Успешная локальная сборка сама по себе не подтверждает публикацию.

## Обновление

После редактирования выполните `npm.cmd run build`, проверьте `npm.cmd run preview`, затем отправьте изменения в `main`. GitHub соберёт и опубликует их автоматически. Токены в коде и пользовательские secrets для этого workflow не требуются.

## Если публикация блокируется

- Нет авторизации CLI: `gh auth login --hostname github.com --web`; не пересылать токен в чат.
- Нет доступа к репозиторию: владелец должен предоставить права на push и настройку Pages.
- Pages не настроен: выбрать GitHub Actions в Settings → Pages, затем повторить workflow.
- Actions ограничены: разрешить workflow и официальные actions в настройках репозитория или аккаунта.
- Доступность Pages для приватного репозитория зависит от плана GitHub; для открытого предварительного просмотра используется публичный репозиторий.
- Ошибка сборки: открыть журнал Actions и устранить её до повторной публикации.

Официальные инструкции: [Vite — GitHub Pages](https://vite.dev/guide/static-deploy#github-pages), [GitHub — custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
