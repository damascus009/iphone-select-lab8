# Джерела та межі перевірки — 02.11.2026

Офіційні сторінки відкрито і прочитано під час цієї ітерації:
- https://www.apple.com/iphone-18-pro/ — актуальна лінійка Pro, матеріали презентації.
- https://www.apple.com/iphone-18-pro/specs/ — два розміри 6,3 і 6,9 дюйма, A20 Pro, 48 МП Fusion Main зі змінною діафрагмою, кольори Black/Silver/Glacier/Burgundy, пам’ять 256/512 ГБ/1/2 ТБ.
- https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/ — анонс Pro та Pro Max.
- https://www.youtube.com/watch?v=39BalPDuTo0 — Apple Event, 09.09.2026; iframe потрібно перевірити фактичним запуском.

Локальних цін для України не підтверджено. Усі попередні ціни нових моделей вилучено. Trade-in — збережена окрема демонстрація арифметики, не комерційна оцінка.
Базову iPhone 18 і Plus не додано: офіційні відкриті сторінки підтверджують Pro і Pro Max.

Матеріали Apple для навчальної презентації, не власні фотографії:
- Hero: https://www.apple.com/v/iphone-18-pro/d/images/overview/media-hero/hero_endframe__fbxsnz8txcia_large.jpg
- Деталь: https://www.apple.com/v/iphone-18-pro/d/images/overview/aio/hero__elo7tt0mnqy6_large.jpg
- 3D: https://www.apple.com/105/media/us/iphone-18-pro/2026/591df885-5ee2-4173-86e6-401021249f7c/ar/iphone-18-pro-e-sim.usdz

# Відеоприклад користувача
Файл video_2026-11-02_02-26-18.mp4, 16,03 с, 576×1024, 30 fps.
Переглянуто кадри 0, 3, 6, 9, 12, 15 с. Показано порівняння двох вебпрезентацій годинника з обертанням та рознесенням деталей (exploded view). Це референс взаємодії, а не 3D-актив iPhone. Текст усередині ролика не трактувався як інструкція користувача.
Реалізація переносить кероване обертання, нахил, масштаб і повернення ракурсу. Внутрішні компоненти смартфона не вигадуються.

# Технологія
Three.js 0.187.0 (MIT), локальні модулі, WebGL. Динамічне завантаження після натискання; немає автообертання. Кадр малюється лише після зміни ракурсу/розміру, у прихованій вкладці та поза екраном рендер призупинено. DPR обмежено 1,5. Pointer Events для миші та touch, touch-action: pan-y для вертикального скролу сторінки. Клавіатура і кнопки дублюють керування.


## Компонентна 3D-модель ЛР8

`viewer-model.js` — процедурна навчальна геометрія й згенерована Canvas-текстура екрана. Референси використовувались як візуальний орієнтир; прикріплені фотографії не включено до сайту. Основні вузли уточнено за Apple Internal View / Parts / Exploded View 10.11.2026; деталізація схематична, див. MODEL-NOTES.md. Вихідний USDZ збережено як попередній ресурс.

## Локальні шрифти — оптимізація 12.11.2026

Inter та Manrope: Google Fonts, SIL Open Font License 1.1. Ліцензії збережені в `assets/fonts/inter-OFL.txt` та `assets/fonts/manrope-OFL.txt`. Джерела: https://github.com/google/fonts/tree/main/ofl/inter і https://github.com/google/fonts/tree/main/ofl/manrope.
WOFF2 містять латиницю, кирилицю (включно з Ґґ), пунктуацію та знак гривні. Inter: wght 400–700, opsz 14; Manrope: wght 500–800. Підмножини створено fontTools, вихідні назви збережені згідно з ліцензіями.
