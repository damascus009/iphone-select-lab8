from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED,ZIP_STORED
from lxml import etree as E
from PIL import Image
from io import BytesIO
import json,textwrap
B=Path(__file__).resolve().parents[1]
source=Path('/home/damask/Документи/веб/Горобець_ПП-24-1_РГР_звіт.odt')
z=ZipFile(source);r=E.fromstring(z.read('content.xml'));ns=r.nsmap;q=lambda p,n:'{'+ns[p]+'}'+n
body=r.find('.//office:text',ns);auto=r.find('office:automatic-styles',ns)
for e in list(body)[10:]:body.remove(e)
# Remove previously generated styles before rebuilding from an updated report.
for e in list(auto):
 if e.get(q('style','name'),'').startswith('R'):auto.remove(e)
for e in body.iter():
 if e.text:e.text=e.text.replace('сайт-лендинг iPhone Select','багатосторінковий сайт iPhone Select')
 if e.tail:e.tail=e.tail.replace('сайт-лендинг iPhone Select','багатосторінковий сайт iPhone Select')
def style(name,size=12,props=None,text=None,parent='Standard'):
 st=E.SubElement(auto,q('style','style'),{q('style','name'):name,q('style','family'):'paragraph',q('style','parent-style-name'):parent})
 attrs={q('fo','margin-top'):'0cm',q('fo','margin-bottom'):'0.18cm',q('fo','line-height'):'115%',q('fo','text-align'):'justify',q('fo','orphans'):'2',q('fo','widows'):'2'};attrs.update(props or {})
 E.SubElement(st,q('style','paragraph-properties'),attrs);tx={q('fo','font-family'):'Times New Roman',q('fo','font-size'):str(size)+'pt',q('fo','color'):'#000000'};tx.update(text or {});E.SubElement(st,q('style','text-properties'),tx)
style('RBody');style('RH',14,{q('fo','keep-with-next'):'always',q('fo','margin-top'):'0.3cm'},{q('fo','font-weight'):'bold'})
style('RFirst',14,{q('fo','keep-with-next'):'always',q('fo','break-before'):'page'},{q('fo','font-weight'):'bold'})
style('RCode',8,{q('fo','text-align'):'left',q('fo','line-height'):'105%',q('fo','margin-bottom'):'0cm'},{q('fo','font-family'):'Liberation Mono'})
style('RCaption',10,{q('fo','text-align'):'center',q('fo','keep-together'):'always'})
style('RLead',12,{q('fo','keep-with-next'):'always'})
style('RImage',12,{q('fo','text-align'):'center',q('fo','keep-with-next'):'always',q('fo','margin-bottom'):'0cm'})
style('RCell',9.5,{q('fo','text-align'):'left',q('fo','line-height'):'108%',q('fo','margin-bottom'):'0.05cm'})
style('RCellHead',9.5,{q('fo','text-align'):'left',q('fo','keep-with-next'):'always'},{q('fo','font-weight'):'bold'})
for name,bg in [('RCellStyle',None),('RHeadStyle','#eeeeee')]:
 st=E.SubElement(auto,q('style','style'),{q('style','name'):name,q('style','family'):'table-cell'});a={q('fo','padding'):'0.12cm',q('fo','border'):'0.5pt solid #999999'}
 if bg:a[q('fo','background-color')]=bg
 E.SubElement(st,q('style','table-cell-properties'),a)
def p(t,sty='RBody',parent=None):
 e=E.SubElement(body if parent is None else parent,q('text','p'),{q('text','style-name'):sty});e.text=str(t);return e
def h(t,first=False):p(t,'RFirst' if first else 'RH')
def code(t):
 for line in t.splitlines():
  for part in textwrap.wrap(line,95,replace_whitespace=False,drop_whitespace=False) or ['']:p(part,'RCode')
def link(label,url):
 a=p(label+' ');e=E.SubElement(a,q('text','a'),{q('xlink','href'):url,q('xlink','type'):'simple'});e.text=url
images={};fig=0
def pic(file,caption,lead,maxh=9):
 global fig
 f=B/'evidence'/file
 assert f.exists(),f
 fig+=1;p(lead,'RLead');im=Image.open(f).convert('RGB');w,hh=im.size;scale=min(16.4/w,maxh/hh);dest=f'Pictures/RGR-{fig}.jpg';buf=BytesIO();im.save(buf,'JPEG',quality=94);images[dest]=buf.getvalue();a=p('','RImage');fr=E.SubElement(a,q('draw','frame'),{q('draw','name'):f'Рисунок {fig}',q('text','anchor-type'):'as-char',q('svg','width'):f'{w*scale:.3f}cm',q('svg','height'):f'{hh*scale:.3f}cm'});E.SubElement(fr,q('draw','image'),{q('xlink','href'):dest,q('xlink','type'):'simple',q('xlink','show'):'embed',q('xlink','actuate'):'onLoad'});p(f'Рисунок {fig} - {caption}','RCaption')
def table(head,rows,widths=None):
 num=len(body);t=E.SubElement(body,q('table','table'),{q('table','name'):f'RTable{num}'});widths=widths or [16.4/len(head)]*len(head)
 for i,w in enumerate(widths):
  name=f'RCol{num}_{i}';st=E.SubElement(auto,q('style','style'),{q('style','name'):name,q('style','family'):'table-column'});E.SubElement(st,q('style','table-column-properties'),{q('style','column-width'):f'{w:.3f}cm'});E.SubElement(t,q('table','table-column'),{q('table','style-name'):name})
 for i,row in enumerate([head]+rows):
  parent=E.SubElement(t,q('table','table-header-rows')) if i==0 else t;tr=E.SubElement(parent,q('table','table-row'))
  for text in row:
   c=E.SubElement(tr,q('table','table-cell'),{q('table','style-name'):'RHeadStyle' if i==0 else 'RCellStyle',q('office','value-type'):'string'});p(text,'RCellHead' if i==0 else 'RCell',c)

h('Посилання на проєкт',True)
link('Сайт РГР:', 'https://iphone-select-rgr.vercel.app/')
link('Репозиторій і гілка РГР:', 'https://github.com/damascus009/iphone-select-lab8/tree/rgr/development')
link('Звіт і докази перевірок:', 'https://github.com/damascus009/iphone-select-lab8/tree/rgr/development/rgr')
link('Лабораторна №9 (попередній етап):', 'https://iphone-select-lab9.vercel.app/#feedback')
p('Стан на 16.11.2026: посилання ведуть на базову опубліковану версію. Розширення з розділу 9 поки збережено локально; його публікація й запуск GitHub Actions не підтверджені.')
p('Посилання лабораторної №9 звірено з наданим звітом. РГР має окрему публікацію; лабораторна залишається попереднім етапом.')
h('Зміст',True)
sections=[('1. Мета та дослідницький бриф',2),('2. Архітектура та вимоги',3),('3. Інтерактивність і CDN',4),('4. Інтерфейс: п’ять сторінок',5),('5. Тестування',10),('6. Lighthouse-аудит',11),('7. Промпт-паспорт',12),('8. Публікація та висновки',13)]
for title,page in sections:p(f'{title} — с. {page+1}')
p('9. Оновлення та фактичний стан на 16.11.2026 — с. 15')
h('1. Мета та дослідницький бриф')
p('Мета — доопрацювати наявний iPhone Select до багатосторінкового навчального MVP, зберегти дизайн і тематичну інтерактивність, перевірити результат і опублікувати окремо від лабораторної №9. Звіт оновлено 16.11.2026. Базову публікацію, скриншоти й аудит від 15.11.2026 збережено; нові локальні функції та їхні перевірки наведено в розділі 9.')
p('Проблема: під час вибору смартфона користувачеві потрібно зіставити моделі, колір, пам’ять і сценарій обміну попереднього пристрою. Цільова аудиторія — відвідувачі, які знайомляться з лінійкою iPhone та хочуть оглянути навчальний 3D-макет.')
p('Цінність прототипу — послідовний шлях від каталогу й порівняння до конфігурації, демонстраційного Trade-in та форми запитання. Окрема 360°-сторінка дає змогу обертати й розбирати модель. Бриф сформовано за завданням користувача; інтерв’ю, опитування та окремий аналіз конкурентів не проводилися.')
p('Критерії приймання: п’ять самостійних адрес; спільна адаптивна навігація; збережені функції; CDN-галерея з резервним відображенням; відсутність переповнення на п’яти ширинах; реальні тести, аудит, Git-гілка й окрема публікація.')
p('Межі: це навчальний прототип, а не магазин. Немає оплати, справжнього продажу, серверного надсилання форми чи комерційної оцінки Trade-in. Локальне навчальне оформлення додано 16.11.2026; воно не створює замовлення продавцю. Внутрішня будова 3D-моделі позначена як схематична; вона не є ремонтним кресленням.')

h('2. Архітектура та вимоги',True)
p('Використано HTML5, локально зібраний Tailwind CSS 4.3.3, Vanilla JavaScript та наявний локальний Three.js. Публічні сторінки відкриваються без маршрутизатора. Базова публікація статична; у локальній версії додано серверний API облікових записів Supabase (розділ 9). Burgundy-палітру, Hero, шрифти й зображення збережено.')
table(['Адреса','Призначення'],[['index.html','Головна: Hero, переваги, послуги, переходи'],['catalog.html','Моделі, пошук, галерея, порівняння, конфігуратор, Trade-in'],['about.html','Призначення, аудиторія, сценарії, межі та FAQ'],['contacts.html','Клієнтська валідація, доступний dialog, демокарта'],['viewer.html','Наявний 360° огляд, розбирання, відео за запитом']],[4,12.4])
p('Схема переходів: спільне меню → кожна з п’яти сторінок. Головна → Каталог → Порівняння → Конфігуратор → Trade-in → Контакти. Із каталогу та footer доступна сторінка 360°. Поточну сторінку позначено aria-current="page" у desktop і mobile меню.')
table(['Файл / каталог','Відповідальність'],[['assets/js/common.js','Закриття меню, Escape, демонстраційна підписка, відео за кнопкою'],['assets/js/catalog.js, gallery.js','Пошук, конфігуратор, Trade-in та Swiper лише в каталозі'],['assets/js/validation.js, validation-rules.mjs','DOM-стани форми та чисті правила перевірки'],['viewer.js, viewer-model.js, vendor/three','Наявна модель і контролер; імпорт лише після дії користувача'],['tailwind-input.css, custom-styles.css, site-v1.css','Вихідні стилі та зібраний CSS; pages.css — нова структура'],['tests/, rgr/evidence/','Відтворювані перевірки та фактичні результати']],[7,9.4])
p('Карта імпортів Three.js розташована перед модульними скриптами. Сторінки без 3D не підключають контролер моделі; код форми завантажується лише на контактах. Внутрішні посилання та ресурси перевіряє tests/pages-structure.py.')
p('Для продуктивності збережено responsive WebP і локальні WOFF2. Hero запитує один відповідний файл (desktop — 23 970 байтів). Модель і відео завантажуються за запитом; заставка має object-fit:contain без спотворення пропорцій.')

h('3. Інтерактивність і CDN',True)
table(['Компонент','Поведінка'],[['Пошук','Фільтрує картки; показує стан без збігів; очищення відновлює список'],['Конфігуратор','Оновлює модель, колір, пам’ять; не вигадує ціну або замовлення'],['Trade-in','Демонстраційна сума за моделлю і станом; захист від нечислових параметрів'],['Форма','Порожні/неправильні значення → помилки й фокус; правильні → dialog; закриття → reset'],['360°','Завантаження за кнопкою, обертання, масштаб, розбирання, деталі, збирання'],['Мобільне меню','Нативний details/summary, закриття після переходу та Escape']],[4,12.4])
p('Форма: ім’я 2–80 Unicode-символів після trim; email до 254 символів із перевіркою формату; телефон +380 та рівно 9 ASCII-цифр без пробілів; повідомлення 10–2000 символів; обов’язкова згода. Успішна форма лише імітує надсилання. Дані не передаються на сервер.')
p('У каталозі додано Swiper 12.2.0 через jsDelivr. Зафіксована версія обрана за офіційним журналом змін. Динамічний import охоплений try/catch: початкова локальна сітка з трьома зображеннями залишається доступною, якщо CDN не працює.')
link('Документація:', 'https://swiperjs.com/get-started')
link('Журнал версій:', 'https://swiperjs.com/changelog')
p('На вузькому екрані відображається один слайд, від 768 px — два. Є доступні кнопки попереднього/наступного зображення; стрілки працюють, коли галерея у фокусі. Автоматичного гортання немає. prefers-reduced-motion задає нульову тривалість переходу, зокрема після зміни налаштування.')
p('Аварійний сценарій перевірено окремою локальною сторінкою з CSP, що блокує зовнішні скрипти. Відображено повідомлення про недоступність інтерактивної галереї; усі три зображення лишилися в DOM і сітці. Локальне підключення Three.js не змінювалося.')
p('Код 3D не переписувався: збережено 34 вибірні групи. Тести перевіряють повторне точне повернення позицій, дотик, pinch zoom і відновлення після втрати контексту. Наявність тестів не підтверджує фізичну точність схематичної конструкції.')

for page,label in [('index','Головна'),('catalog','Каталог'),('about','Про проєкт'),('contacts','Контакти'),('viewer','360° огляд')]:
 h(('4. Інтерфейс: п’ять сторінок' if page=='index' else '4. Інтерфейс — продовження'),True)
 p(label+' — актуальна опублікована сторінка, 15.11.2026. Знімки виконано у Chromium; 1440 і 375 px — ширина viewport, не фізичні пристрої.')
 pic(page+'-1440.jpg',label+' на desktop (1440 px)','Верхня частина сторінки у широкому вікні.',9)
 pic(page+'-375.jpg',label+' на mobile (375 px)','Верхня частина сторінки у вузькому вікні.',9)

h('5. Тестування',True)
p('Перевірки виконано в Chromium через браузерні інструменти та тестові сторінки. Firefox і Safari не перевірені; реальних Android/iOS-пристроїв не було. Сенсорні жести перевірено синтетичними подіями у тесті контролера.')
table(['Перевірка','Фактичний результат'],[['Правила форми','36/36 тестів, включно з мінімумом/максимумом і неправильним форматом'],['Сторінки й функції','84/84: 5 сторінок × 5 ширин × 3 структурні ознаки + 9 сценаріїв'],['Ширини','320, 375, 768, 1024, 1440 px — без горизонтального переповнення'],['Статична структура','5 сторінок: посилання, IDs, ресурси, h1, навігація, ізоляція модулів'],['Ресурси','8 перевірок: CSS, локальні шрифти, один Hero <30 КБ, відкладений 3D'],['3D-геометрія','Усі перевірки пройдені; 20 циклів — 680 точних повернень позицій'],['3D-взаємодія','Завантаження, вибір 34 груп, обертання, zoom, touch, pinch, cleanup/retry'],['Без WebGL','Кнопка повтору доступна; покинутих canvas немає'],['CDN недоступний','Локальний fallback: повідомлення та 3 доступні зображення']],[4.4,12])
p('На опублікованому сайті додатково перевірено галерею кнопкою й стрілками, мобільне меню та Escape, правильне заповнення форми й Escape у dialog, відкриття 360°, розбирання/збирання, бічний ракурс, масштаб і reset. Перезавантаження та прямі адреси перевірені браузером і Lighthouse.')
p('Форма не надсилала дані: використано навчальні тестові значення. Збережено скриншот успішного dialog. Помилок власних ресурсів у фінальних аудитах не виявлено; зовнішні віджети залежать від доступності своїх сервісів.')
p('Артефакти: rgr/evidence/validation.txt, pages.txt, structure.txt, performance.txt, viewer-geometry.txt, viewer-interaction.txt, viewer-no-webgl.txt, gallery-offline.txt. tests/pages.html відтворює адаптивні й функціональні перевірки; npm test у версії від 15.11.2026 перевіряв правила форми; 16.11.2026 набір розширено (розділ 9).')
p('131 118 трикутників та 118 пакетованих mesh замість 672 — показники тесту наявної 3D-моделі. Вони не є вимірюванням FPS на слабкому смартфоні. Профілювання фізичних пристроїв залишається окремим завданням.')

h('6. Lighthouse-аудит',True)
p('Аудити базової опублікованої версії виконано 15.11.2026, 16:45–16:47 UTC, Lighthouse 12.8.2 / Chrome 157.0.8103.78. Для кожної сторінки збережено JSON та HTML у rgr/evidence/lighthouse/. Попередній запуск окремо збережено у before/.')
rows=json.loads((B/'evidence/lighthouse-summary.json').read_text())
table(['Сторінка / режим','Perf.','A11y','Best','SEO'],[[x['page']+' / '+x['mode']]+[str(v) for v in x['scores'].values()] for x in rows],[6.4,2.5,2.5,2.5,2.5])
pic('lighthouse-summary.jpg','Підсумок десяти фінальних Lighthouse-звітів','Знімок таблиці, сформованої з фактичних JSON; вихідні інтерактивні HTML-звіти збережено окремо.',7.5)
p('Виправлено: відсутній widget.css у публікації, порядок заголовків, ARIA-роль слайдів, розтягування заставки, раннє завантаження YouTube. Усі категорії перевищили орієнтир 85. Це лабораторні вимірювання одного запуску на адресу й режим, а не польові Core Web Vitals.')
p('3D і відео не запускаються автоматично. Lighthouse оцінює початкову сторінку; він не вимірює плавність активної 3D-сцени й не гарантує повної доступності для всіх допоміжних технологій.')

h('7. Промпт-паспорт',True)
p('Інструмент допомоги — Codex. Запити нижче є фактичними повідомленнями користувача або стислим описом його прикріпленого завдання. Ручна самостійна робота студента й невідомі промпти генерації попередніх зображень не приписуються.')
table(['Фактичний запит','Результат / перевірка'],[['«Доопрацюй мій наявний сайт iPhone Select для розрахунково-графічної роботи…»','П’ять сторінок, окрема гілка, CDN, тести, публікація, оновлення звіту'],['«і вот сама методичка»','Критерії включено в бриф та перевірку відповідності; додаткові вимоги не оголошено виконаними автоматично'],['«продовж роботу»','Відновлено перевірки після переривання; завершено аудит, докази та звіт']],[7,9.4])
p('Критичний аналіз першого результату: автоматичний розподіл секцій дав невдалий порядок h1 на контактах і сторінці про проєкт. Порядок виправлено; у перевірці кожна сторінка має один h1. Swiper додавав роль group до figure — слайди замінено на div із підписом; фінальна доступність 100.')
p('Помилка публікації: маніфест не містив widget.css. Додано файл і повторено деплой. Заставка 3D мала object-fit:fill — виправлено на contain. Відео перенесено за явну кнопку, що прибрало зайве початкове завантаження стороннього контенту.')
p('Спроба встановлення залежностей у наявному дереві завершилася помилкою npm Arborist. Робочі файли не видалялися: Tailwind зібрано наявними залежностями, аудит встановлено в тимчасовій папці. Автоматичне прив’язування нового Vercel-проєкту до Git недоступне через відсутню інтеграцію; використано файловий API.')
p('Після зміни viewport окремі перші скриншоти показували проміжний кадр. Їх повторено після стабілізації відображення. Документ перевірено через експорт PDF і перегляд усіх сторінок. Повний журнал рішень: rgr/notes/Prompt-Log.md.')
p('Роль ШІ — підготовка змін, перевірок та пояснень. Під час захисту студент має самостійно пояснити фільтр, Trade-in, регулярні вирази, importmap, fallback галереї, межі аудиту та відмінність навчального макета від технічного креслення.')

h('8. Публікація та висновки',True)
link('Гілка РГР:', 'https://github.com/damascus009/iphone-select-lab8/tree/rgr/development')
link('Окремий сайт РГР:', 'https://iphone-select-rgr.vercel.app/')
link('Лабораторна №9 (збережена):', 'https://iphone-select-lab9.vercel.app/')
p('Гілку rgr/development створено від актуального main c06bd9b. Базу лабораторної №9 зафіксовано тегом lab9-final; наявні теги не перезаписувалися. Злиття в main і force push не виконувалися.')
p('Для РГР створено окремий безплатний Vercel-проєкт iphone-select-rgr. Файловий деплой містить лише публічні сторінки, стилі, модулі, шрифти й оптимізовані зображення. Тести та звіт не потрапляють до публічного каталогу. Публікація ручна через API; Git-автодеплой не налаштований.')
p('Результат: лендинг перетворено на п’ять сторінок зі спільною навігацією, збережено тематичні функції та оформлення, додано доступну CDN-галерею з fallback, виправлено проблеми аудиту. Lighthouse: 98–100 за продуктивність і 100 за інші категорії на всіх сторінках; браузерні функціональні тести пройдені.')
h('Стан розширення та обмеження')
p('Локально додано світлу/темну тему зі збереженням, власний data.json через fetch із резервними картками та Open Graph/Twitter Card для п’яти сторінок. Підготовлено GitHub Actions для перевірок і деплою лише гілки РГР; запуск у GitHub і налаштування секрету деплою ще не підтверджені. Vercel Analytics увімкнено на платформі; клієнтський код підготовлено, але ще не опубліковано. Унікальне ШІ-походження всіх медіа й первинні промпти не підтверджені.')
p('16.11.2026 реалізовано серверний вхід, сесію та вихід через Supabase; перевірено на тимчасовому тестовому акаунті. Доставка підтвердження реєстрації та повідомлень ще не перевірена. За рішенням власника платіжні сервіси виключено: додано локальний навчальний кошик із кількістю, видаленням і підсумком без надсилання та оплати. Ці зміни ще не опубліковано. Firefox, Safari, реальні мобільні пристрої, повна перевірка екранним читачем та W3C-валідатором не виконані.')
p('16.11.2026 повторно перевірено специфікації Apple: дисплеї, A20 Pro, камеру зі змінною діафрагмою, пам’ять і кольори. Це не підтверджує внутрішню геометрію 3D: вона залишається схематичною. Зовнішні CDN, карта, відео та валютний інформер залежать від мережі й сторонніх сервісів. Оцінки аудиту не слід переносити на всі пристрої та майбутні запуски.')
p('Наступні кроки — завершення поштового сценарію, публікація розширення та запуск CI/CD, перевірка на фізичних пристроях і Firefox/Safari та поглиблена перевірка доступності. Основний багатосторінковий MVP і окрема публікація підготовлені для демонстрації.')
h('9. Оновлення та фактичний стан на 16.11.2026',True)
p('Розділ фіксує зміни після базової публікації. Зміни внесено в наявні файли проєкту; новий сайт або 3D-переглядач не створювалися. На момент підготовки звіту розширення ще не опубліковано й не підтверджено запуском у GitHub Actions.')
table(['Можливість','Фактичний стан'],[
 ['Світла / темна тема','Реалізовано локально: localStorage, системна тема, синхронізація вкладок і обробка недоступного сховища.'],
 ['Власні дані каталогу','data.json і fetch: перевірка структури, таймаут, резервні HTML-картки при помилці.'],
 ['Open Graph','Для п’яти сторінок підготовлено canonical, OG і Twitter Card; спільне зображення JPEG 1200 × 630.'],
 ['Навчальний кошик','Дві моделі, кількість 1–9, видалення, збереження у браузері та підсумок без надсилання.'],
 ['Облікові записи','Серверний API Supabase: вхід, HttpOnly-сесія та вихід перевірені на одноразовому тестовому акаунті.'],
 ['Реєстрація й пошта','Код реєстрації підготовлено; доставку підтвердження та реальне надсилання форми не підтверджено.'],
 ['Аналітика','Vercel Analytics увімкнено на платформі. Клієнтський код підготовлено, але ще не опубліковано; отримання подій не перевірено.'],
 ['CI/CD','Workflow підготовлено; секрет деплою та фактичний запуск у GitHub ще не підтверджені.']],[4.4,12])
p('Власник відмовився від Shopify після повідомлення про платний тариф після пробного періоду та обрав лише навчальне оформлення. Платіжний сервіс не підключено; дані картки не запитуються. Кошик не має серверного збереження та не є системою реальних замовлень.')
p('Аналітика обмежена доменом РГР, враховує Do Not Track та очищає query/hash URL перед надсиланням. Значення полів форми не передаються як власні аналітичні події. Перевірка цієї поведінки після публікації залишається необхідною.')

h('9. Оновлення — скриншоти локальної версії',True)
p('Реальні скриншоти локального сайту, 16.11.2026. Вони підтверджують вигляд інтерфейсу, але не публікацію змін. Вузький екран перевірено зміною viewport браузера, не на фізичному телефоні.')
pic('catalog-light-2026-11-16.jpg','Каталог у світлій темі','Тема змінює оформлення наявної сторінки.',9)
pic('cart-desktop-2026-11-16.jpg','Навчальний кошик і підсумок на широкому екрані','Підсумок явно повідомляє про відсутність оплати, доставки й надсилання.',9)

h('9. Оновлення — перевірки та змінені файли',True)
pic('cart-mobile-2026-11-16.jpg','Навчальний кошик на вузькому екрані','Viewport 390 px; область контенту 375 px зі смугою прокрутки. Горизонтального переповнення не виявлено.',8.5)
p('Автоматично пройдено: 36 правил форми; перевірки каталогу (схема, дублікати, HTTP-помилка, offline, неправильний JSON); теми (збереження, заблоковане сховище, системний режим, зміна в іншій вкладці); кошика (пошкоджені дані, ліміт, видалення, підсумок); захисту API (метод, Origin, тип і розмір запиту, no-store). Структурні перевірки п’яти сторінок і форми також пройдені.')
p('У браузері перевірено додавання двох моделей, підсумок, збереження після reload, зміну кількості та видалення. Через справжній Supabase перевірено створення тимчасового QA-користувача, вхід, HttpOnly-cookie, авторизовану сесію та вихід; після тесту акаунт видалено. Листів цей тест не надсилав. Це не замінює перевірку реєстрації та API після деплою.')
p('Змінені групи файлів: п’ять HTML-сторінок; assets/css/pages.css; theme.js, catalog-data.mjs, catalog.js, cart.js, cart-state.mjs, account.js, common.js; data.json і social-preview.jpg; api/account.js та lib/http.cjs; тести, workflow .github/workflows/rgr.yml і пакування публікації. Докладний локальний статус: rgr/NEW-FEATURES.md.')
p('Нове social-preview.jpg є програмною композицією на основі успадкованого зображення, а не новою ШІ-генерацією. Первинне походження всіх старих медіа не підтверджено. Показники Lighthouse в розділі 6 стосуються лише версії від 15.11.2026; після публікації розширення потрібен новий аудит.')

# Preserve reference cover, typography and only images used in this report.
data={i.filename:z.read(i.filename) for i in z.infolist() if i.filename!='mimetype'}
styles=E.fromstring(data['styles.xml'])
master=styles.find('office:master-styles',ns)
standard=master.find('style:master-page',ns)
footer=E.SubElement(standard,q('style','footer'))
fp=E.SubElement(footer,q('text','p'),{q('text','style-name'):'RPageNumber'})
E.SubElement(fp,q('text','page-number'),{q('text','select-page'):'current'}).text='1'
st=E.SubElement(styles.find('office:styles',ns),q('style','style'),{q('style','name'):'RPageNumber',q('style','family'):'paragraph'})
E.SubElement(st,q('style','paragraph-properties'),{q('fo','text-align'):'center'})
E.SubElement(st,q('style','text-properties'),{q('fo','font-family'):'Times New Roman',q('fo','font-size'):'10pt'})
first=E.SubElement(master,q('style','master-page'),dict(standard.attrib));first.set(q('style','name'),'RTitlePage');first.set(q('style','next-style-name'),standard.get(q('style','name')))
for st in auto:
 if st.get(q('style','name'))=='P1':st.set(q('style','master-page-name'),'RTitlePage')
 if st.get(q('style','name'))=='RFirst':st.set(q('style','master-page-name'),standard.get(q('style','name')))
data['styles.xml']=E.tostring(styles,encoding='UTF-8',xml_declaration=True)
refs=set(r.xpath('//@xlink:href',namespaces=ns));manifest=E.fromstring(data['META-INF/manifest.xml']);m='urn:oasis:names:tc:opendocument:xmlns:manifest:1.0'
for k in list(data):
 if k.startswith('Pictures/') and k not in refs:del data[k]
for e in list(manifest):
 if e.get('{'+m+'}full-path','').startswith('Pictures/') and e.get('{'+m+'}full-path') not in refs:manifest.remove(e)
for k in images:E.SubElement(manifest,'{'+m+'}file-entry',{'{'+m+'}full-path':k,'{'+m+'}media-type':'image/jpeg'})
data.update(images);data['content.xml']=E.tostring(r,encoding='UTF-8',xml_declaration=True);data['META-INF/manifest.xml']=E.tostring(manifest,encoding='UTF-8',xml_declaration=True)
meta=E.fromstring(data['meta.xml'])
for e in meta.iter():
 if e.tag==q('dc','title'):e.text='РГР - Розроблення та публікація вебпродукту iPhone Select'
 if e.tag==q('dc','subject'):e.text='Багатосторінковий MVP, тести та окрема публікація РГР'
data['meta.xml']=E.tostring(meta,encoding='UTF-8',xml_declaration=True)
with ZipFile(B/'report/Горобець_ПП-24-1_РГР_звіт.odt','w',ZIP_DEFLATED) as out:
 out.writestr('mimetype','application/vnd.oasis.opendocument.text',compress_type=ZIP_STORED)
 for k,v in data.items():out.writestr(k,v)
print('Report built; figures',fig)
