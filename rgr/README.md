# iPhone Select — РГР

Окрема версія на `rgr/development`, створена з `c06bd9b` (lab9-final).
Публікація: https://iphone-select-rgr.vercel.app/
Лабораторна №9: https://iphone-select-lab9.vercel.app/ — окремий незмінений проєкт.

## Структура
- `index.html` — Hero, переваги, послуги.
- `catalog.html` — пошук, галерея Swiper, порівняння, конфігуратор, Trade-in.
- `about.html` — аудиторія, сценарії, межі прототипу, FAQ.
- `contacts.html` — валідована демоформа та карта.
- `viewer.html` — наявна Three.js модель, відео за запитом.
- `assets/js/common.js` — спільне меню та демопідписка.
- `assets/js/catalog.js`, `gallery.js` — логіка лише каталогу.
- `assets/js/validation*.js`, `validation-rules.mjs` — форма лише контактів.

## Запуск і перевірка
Потрібні Node.js 22 та Python 3. Для статичного запуску достатньо `python3 -m http.server 8098` у корені.
`npm test` — 36 тестів валідації; `npm run build:css` — перебудова CSS.
`python3 tests/pages-structure.py` — перевірка посилань, ресурсів, заголовків та ізоляції модулів (потрібен BeautifulSoup).
У браузері відкрити `tests/pages.html`, `tests/performance.html`, `tests/viewer-geometry.html`, `tests/viewer-interaction.html`, `tests/viewer-interaction.html?mode=no-webgl`, `tests/gallery-offline.html`.

Swiper **12.2.0**, MIT, динамічний імпорт через jsDelivr. Офіційна документація: https://swiperjs.com/get-started ; версії: https://swiperjs.com/changelog . Без CDN залишається статична сітка зображень. Three.js локальний.

Публікацію виконано через Vercel Source Files API, не автоматично з Git. `scripts/deploy-manifest.py` формує список лише публічних файлів. Тести, звіти, початкові великі зображення та цей каталог на сайт не потрапляють. Для наступних оновлень потрібна повторна публікація.

## Докази
`evidence/`: актуальні скриншоти, результати тестів, десять фінальних Lighthouse JSON/HTML та попередній аудит у `lighthouse/before/`.
`report/`: редагований ODT і PDF. `notes/`: перевірки й фактичний Prompt Log.

Lighthouse оцінює початкове завантаження. 3D і відео завантажуються після натискання; активний рендерер перевірено окремо. Перевірки проведені в Chromium та емуляції ширин, не на фізичних телефонах. Firefox/Safari не перевірені. Навчальний прототип не надсилає заявки та не приймає оплату.
