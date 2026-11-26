# Messenger

Учебный проект клиентской части мессенджера.

Демо: [dynamic-clafoutis-808e9b.netlify.app](https://dynamic-clafoutis-808e9b.netlify.app/).

## Требования

- Node.js 20.19 или новее
- npm

## Установка и запуск

```bash
npm install
npm run dev
```

Vite запустит приложение на `http://localhost:3000`. Порт можно переопределить переменной окружения `PORT`.

`npm run start` сначала проверяет типы и собирает production-версию, затем запускает Vite. Чтобы собрать файлы без запуска сервера, выполни `npm run build`. Результат сборки находится в `dist/`.

## Команды

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Запустить сервер разработки Vite |
| `npm run start` | Собрать проект и запустить Vite |
| `npm run build` | Проверить типы и собрать production-версию |
| `npm run preview` | Просмотреть production-сборку |
| `npm run prebuild` | Проверить TypeScript без генерации файлов |
| `npm run lint` | Проверить TypeScript, стили через Stylelint и код через ESLint |
| `npm run format` | Проверить форматирование Prettier |
| `npm run format:fix` | Форматировать файлы через Prettier |
| `npm run check` | Выполнить сборку, линтеры и проверку форматирования |

Pre-commit hook запускает `lint-staged` для подготовленных к коммиту файлов.

## Архитектура

Приложение организовано по MVC:

- `src/models` — данные приложения; сейчас используются тестовые данные.
- `src/views` и `src/pages` — рендеринг страниц на Handlebars.
- `src/controllers` — маршрутизация по URL и обработка событий приложения.
- `src/components` — переиспользуемые UI-компоненты и базовый класс `Block`.
- `src/constants`, `src/types`, `src/utils` — конфигурация, типы и общие функции.

Страницы чатов, входа и регистрации, профиля, редактирования профиля и пароля, а также страницы ошибок рендерятся на клиенте. Формы используют общую валидацию; при успешной отправке заполненные значения выводятся в консоль.

## Технологии

- TypeScript
- Handlebars
- Vite
- PostCSS
- ESLint и Stylelint
