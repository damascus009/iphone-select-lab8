from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED,ZIP_STORED
from lxml import etree as E
from PIL import Image
from io import BytesIO
import json,textwrap
B=Path(__file__).resolve().parents[1]
source=B/'report/Горобець_ПП-24-1_РГР_звіт.odt'
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
link('Опублікований сайт РГР:', 'https://iphone-select-rgr.vercel.app/')
link('Гілка РГР:', 'https://github.com/damascus009/iphone-select-lab8/tree/rgr/development')
link('Pull Request із виправленнями:', 'https://github.com/damascus009/iphone-select-lab8/pull/7')
link('Коміт функціональних змін:', 'https://github.com/damascus009/iphone-select-lab8/commit/876898681d15b6fc80ac39ec0359d2717358d44a')
link('Коміт перевірки публікації:', 'https://github.com/damascus009/iphone-select-lab8/commit/e5cb947c8af91ab4e373013aae6e4e2940263122')
link('Успішний GitHub Actions:', 'https://github.com/damascus009/iphone-select-lab8/actions/runs/45218646998')
link('Лабораторна №9 — попередній етап:', 'https://iphone-select-lab9.vercel.app/#feedback')
p('Оновлено 23.11.2026. Звіт описує фактично реалізовану й опубліковану версію. Основні файли звіту збережено під попередніми назвами; звіти лабораторних робіт не змінювалися.')
pic('site-qr.png','QR-код опублікованого сайту','Для відкриття РГР на власному пристрої використайте QR-код.',4)
h('Зміст',True)
for s in ['1. Мета, аудиторія та межі','2. Архітектура й виконані зауваження','3. Каталог і перевірені джерела','4. Теми, адаптивність і галерея','5. Trade-in, форма та інтерактивність','6. Перевірки й результати','7. Lighthouse до та після','8. Prompt Log і походження медіа','9. Публікація та висновки']:p(s)
h('1. Мета, аудиторія та межі')
p('Мета — доопрацювати наявний багатосторінковий iPhone Select за зауваженнями викладача: покращити доступність, вибір моделей, медіа, перевірки та доказовість звіту. Аудиторія — відвідувачі, які хочуть порівняти характеристики смартфонів і спробувати навчальні інструменти вибору. Інтерв’ю користувачів і дослідження конкурентів у цьому етапі не проводилися.')
p('Сайт є навчальним прототипом. Каталог містить реальні моделі iPhone 14–16; ціни й наявність не підтверджено. Кошик зберігає модель і кількість у браузері, а оформлення створює лише навчальний підсумок. Немає продажу, оплати, доставки або надсилання замовлення продавцю. Trade-in використовує умовну формулу, а не ринкову оцінку.')
p('Особистий кабінет має окремий серверний API Supabase. Це не означає надсилання форми звернення: її обробник виконує лише клієнтську валідацію. 360°-модель залишається схематичним концептом; її внутрішня будова не видається за підтверджене ремонтне креслення Apple.')
h('2. Архітектура й виконані зауваження',True)
table(['Сторінка','Призначення'],[['index.html','Hero, переваги, три кроки вибору, 12 FAQ'],['catalog.html','10 моделей, фільтри, галерея, порівняння, конфігуратор, Trade-in, кошик'],['about.html','Опис проєкту, сценарії й узгоджений FAQ'],['contacts.html','Демонстраційна форма, карта, особистий кабінет'],['viewer.html','Наявна модель Three.js, розбирання, збирання й відео за запитом']],[4,12.4])
p('Збережено HTML5, локально зібраний Tailwind CSS, Vanilla JavaScript та наявний Three.js. Hero і п’ятисторінкова структура не переписувалися. Список моделей має одне джерело — data.json. Генератор створює статичні картки, таблицю, списки та резервний модуль; перевірка --check виявляє розбіжності.')
table(['Зауваження / лабораторна','Реалізація'],[['Контраст','Спільні кольори теми; виправлено текст, кнопки, поля, помилки, модальні вікна й елементи 360°.'],['Адаптивність і SVG','Перевірено п’ять ширин у двох темах, viewBox і декоративні SVG. Матеріалів SVGA у використаних сторінках немає.'],['Дубль головної','Замість повторної секції — три послідовні кроки з переходами до інструментів.'],['Вибір моделі','Нативний список, пошук, скидання й повідомлення про відсутність результатів; залежні колір і пам’ять.'],['Лабораторна №10','Вибірково адаптовано галерею: Swiper 12.2.0 та Fancybox 5.0.36. Typed.js не додавався, оскільки анімований текст не потрібний для сценарію.'],['Лабораторна №11','Чиста функція Trade-in, три параметри, перевірка некоректних значень і 50 повторних дій.'],['Лабораторна №12','Аудит до/після, оптимізовані WebP, SEO-файли, перевірка CI та окрема публікація РГР.']],[4.4,12])
h('3. Каталог і перевірені джерела',True)
p('Характеристики звірено 22.11.2026 з офіційними специфікаціями Apple. Обрано десять підтверджених моделей, без припущень про iPhone 18 Pro. Кольори збережено за назвами Apple. Картки не містять вигаданих цін. Діагоналі номінальні, фактична видима область екрана менша.')
catalog=json.loads((B.parent/'data.json').read_text())
table(['Модель','Екран / чип','Пам’ять, ГБ'],[[x['name'],str(x['display'])+' / '+x['chip'],', '.join(map(str,x['storage']))] for x in catalog['products']],[4.5,6,5.9])
for x in catalog['products']:link(x['name']+':',x['source'])
p('Пошук фільтрує картки й порівняння. Вибір зі списку синхронізує конфігуратор; несумісні варіанти пам’яті не пропонуються. Для iPhone 16 Pro Max доступні 256, 512 і 1024 ГБ, але не 128 ГБ. Кошик навмисно зберігає лише модель і кількість, про що повідомлено біля конфігуратора.')
h('4. Теми, адаптивність і галерея',True)
p('Спільні CSS-змінні задають основний і допоміжний текст, фон, акцент та межі. Для клавіатури додано виразний фокус. Світла тема не застосовує суцільну інверсію. Збереження теми та реакцію на системні налаштування перевірено модульними тестами.')
pic('catalog-light-2026-11-22.png','Каталог у світлій темі на комп’ютері','На світлому фоні текст карток і контролів залишається читабельним.',8)
pic('catalog-desktop-dark-2026-11-23.png','Опублікований каталог у темній темі','Темну версію повторно відкрито після публікації на Vercel.',8)
h('Мобільні ширини',True)
p('Нижче наведено браузерні скриншоти ширини 375 px. Це емуляція розміру вікна, а не перевірка на фізичному телефоні.')
pic('catalog-mobile-light-2026-11-22.png','Каталог, 375 px, світла тема','Мобільний список моделей і поля не виходять за межі екрана.',9)
pic('catalog-mobile-dark-2026-11-22.png','Каталог, 375 px, темна тема','Той самий сценарій у темній темі.',9)
h('Шість нових AI-концепцій',True)
p('Галерея містить шість зображень, справді створених для цього проєкту інструментом OpenAI image_gen.imagegen 22.11.2026. Збережено оригінальні PNG і точні промпти. Для сайту виготовлено WebP шириною 400, 800 і 1200 px із заданими розмірами й alt. Це авторські концепції, а не офіційні фотографії Apple.')
pic('gallery-light-2026-11-22.png','Адаптивна галерея AI-концепцій','Зображення об’єднані приглушеною Burgundy-палітрою.',8)
p('CDN: Swiper 12.2.0 (ESM) і Fancybox 5.0.36 (JS/CSS) завантажуються через jsDelivr лише поблизу галереї. Стару версію Swiper з main не дубльовано. Автопрокручування спочатку вимкнено; користувач може ввімкнути його явно. Є пауза під час фокуса, наведення, прихованої вкладки та відкритого lightbox. Враховано prefers-reduced-motion, Escape і повернення фокуса. Без CDN доступні всі шість зображень як звичайні посилання.')
h('5. Trade-in, форма та інтерактивність',True)
p('Формула: округлення(база моделі × коефіцієнт пам’яті × коефіцієнт стану). Пам’ять: 128 → 1; 256 → 1,1; 512 → 1,2; 1024 → 1,3. Стан: добрий → 1; задовільний → 0,75; ремонт → 0,45. Усі бази й коефіцієнти навчальні. Наприклад, iPhone 16: 11 000 × 1,1 × 0,75 = 9 075 грн.')
table(['Сценарій / дані','Очікувано','Фактично','Статус'],[['16 / 128 / good','11 000','11 000','PASS'],['16 / 256 / used','9 075','9 075','PASS'],['16 Pro Max / 1024 / repair','9 945','9 945','PASS'],['15 / 128 / good','9 000','9 000','PASS'],['Pro Max / 128; невідома модель; NaN; Infinity','Відхилення','Відхилено','PASS'],['50 повторних розрахунків 16 / 256 / used','Завжди 9 075','Завжди 9 075','PASS']],[6.4,3.4,3.4,1.2])
pic('trade-in-2026-11-22.png','Trade-in із трьома параметрами','Логіку винесено в trade-in.mjs; DOM лише показує перевірений результат.',7)
p('Форма звернення не має маршруту надсилання. Після правильної валідації dialog прямо повідомляє: «Форму заповнено правильно. Це навчальна демонстрація — повідомлення не надсилалося». Перевірено помилки, скидання, Escape й повернення фокуса. Серверних обіцянок або повідомлення про доставку немає.')
pic('form-mobile-light-2026-11-22.png','Правдиве повідомлення демонстраційної форми','Форма й особистий кабінет описані окремо, без суперечливих тверджень про сервер.',8)
h('6. Перевірки й результати',True)
table(['Перевірка','Фактичний результат'],[['Модульні тести','36 правил валідації; каталог; тема; кошик; HTTP-захист API; Trade-in — PASS.'],['Структура','П’ять сторінок: локальні ресурси, посилання, унікальні ID, один h1, навігація й ізоляція модулів — PASS.'],['Адаптивність','320, 375, 768, 1024, 1440 px × 5 сторінок × 2 теми: 50 станів без горизонтального переповнення.'],['axe 4.10.3','23.11: 10 станів сторінка/тема, 0 автоматично визначених violations; є incomplete-пункти для ручної оцінки.'],['3D','Один renderer, повторне завантаження, вибір 34 компонентів, збирання, вид збоку, масштабування, touch/pinch, скасування дотику, context loss/retry — PASS.'],['Галерея','Навігація, Fancybox, Escape/фокус; при CSP-блокуванні CDN шість посилань залишаються доступними.'],['Публічна версія','Усі 5 сторінок, data.json, robots.txt, sitemap.xml — HTTP 200; каталог збігається з локальними даними.'],['Особистий кабінет','GET /api/account: 200, user:null, private/no-store. Повторний повний цикл реєстрації/входу цим етапом не підтверджено.'],['GitHub Actions','PR #7, запуск 45218646998 — success; встановлення залежностей та перевірку пакета додано.']],[4.3,12.1])
p('Докази збережено в rgr/evidence. Автоматичний аудит не є сертифікацією WCAG: він не доводить усі кольорові поєднання поверх фотографій, кожен hover-стан або повну роботу екранного читача. Окрема фізична перевірка iOS/Android, Firefox/Safari та W3C-валідатор у цьому етапі не виконувалися.')
h('7. Lighthouse до та після',True)
p('Порівняно ту саму опубліковану головну сторінку https://iphone-select-rgr.vercel.app/. До: 22.11.2026; після: 23.11.2026. В обох випадках Lighthouse 12.8.2, Chrome 158.0.8127.36, мобільний стандартний і desktop-профілі. Це окремі лабораторні запуски з можливою мережевою варіативністю, а не польові дані користувачів.')
rows=[]
for mode in ['mobile','desktop']:
 for phase in ['before','after']:
  d=json.loads((B/'evidence/audit-2026-11-22'/f'{phase}-{mode}.json').read_text())
  rows.append([mode+' / '+('до' if phase=='before' else 'після')]+[str(round(d['categories'][k]['score']*100)) for k in ['performance','accessibility','best-practices','seo']])
table(['Режим','P','A','BP','SEO'],rows,[6.4,2.5,2.5,2.5,2.5])
rows=[]
for mode in ['mobile','desktop']:
 for phase in ['before','after']:
  d=json.loads((B/'evidence/audit-2026-11-22'/f'{phase}-{mode}.json').read_text())
  rows.append([mode+' / '+('до' if phase=='before' else 'після')]+[d['audits'][k]['displayValue'] for k in ['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time']])
table(['Режим','FCP','LCP','CLS','TBT'],rows,[6.4,2.5,2.5,2.5,2.5])
p('Підсумкові бали збережено: mobile 99/100/100/100, desktop 100/100/100/100. У цих запусках TBT зменшився зі 110 до 0 мс на mobile та з 10 до 0 мс на desktop. Самі ці два вимірювання не доводять стабільного прискорення для всіх користувачів. INP не вимірювався. Аудит головної не переноситься на весь каталог чи активний WebGL.')
p('Оптимізація: нові зображення мають responsive WebP; 3D імпортується за дією користувача; галерея — поблизу viewport. Головне зображення Hero не переведено на lazy loading. Додано robots.txt і sitemap.xml; canonical та Open Graph відповідають окремій адресі РГР. Пакет публікації виключає звіти, оригінали медіа й облікові дані.')
h('8. Prompt Log і походження медіа',True)
p('Завдання поточного етапу надано користувачем у вигляді технічного промпту про виправлення зауважень викладача та вимоги №10–12. Асистент: OpenAI Codex. Уточнювальні запити користувача «продовж роботу» означали продовження цього завдання. Первинні промпти всіх успадкованих зображень не підтверджені; їх не оголошено новими AI-матеріалами.')
p('Нижче наведено точні промпти шести нових генерацій. Інструмент: OpenAI image_gen.imagegen; дата: 22.11.2026. Оригінали: rgr/media-originals/ai-concept-1.png … ai-concept-6.png; машинозчитуваний журнал: prompt-log.json. Подальша зміна розмірів і WebP-компресія є оптимізацією, а не окремими AI-генераціями.')
log=json.loads((B/'media-originals/prompt-log.json').read_text())
for x in log['images']:
 h('Зображення '+str(x['image']));p(x['prompt'])
h('9. Публікація та висновки',True)
p('Зміни підготовлено в fix/rgr-accessibility-media від rgr/development та передано в PR #7. Гілка main лабораторної №10 не змінювалася. Успішну production-збірку Vercel dpl_Efuiuuw2svVZRQCSwDjJ3BTM7vRp опубліковано 23.11.2026 на окремій адресі РГР; після цього перевірено публічні сторінки та виконано Lighthouse.')
p('Наявний .github/workflows/rgr.yml розширено перевіркою Trade-in, синхронності каталогу, HTTP-захисту й пакета публікації. Релізне завдання обмежене rgr/development, потребує RGR_AUTODEPLOY та VERCEL_TOKEN у середовищі rgr-production. Успішний PR-запуск перевіряє код; він сам не доводить виконання автодеплою. Цю публікацію виконано через авторизований Vercel CLI.')
p('Виконано основні зауваження: читабельні теми, адаптивні SVG та контролі, усунення дубля на головній, десять перевірених моделей, доступний вибір, нова галерея, правдиве повідомлення форми, 12 узгоджених FAQ і протестований Trade-in. Збережено Hero, наявний 360°-переглядач, серверний кабінет та навчальний кошик.')
p('Залишаються обмеження: 3D і AI-композиції концептуальні; платежів і реальних замовлень немає; контактна форма нічого не надсилає. CDN, карта, відео й валютний інформер залежать від мережі. Повне тестування фізичних пристроїв, Safari/Firefox, екранного читача та всіх динамічних контрастних станів потребує окремої перевірки. Джерела характеристик наведено явно, але майбутні зміни продуктів або сервісів цим звітом не гарантуються.')

# Preserve reference cover, typography and only images used in this report.
data={i.filename:z.read(i.filename) for i in z.infolist() if i.filename!='mimetype'}
styles=E.fromstring(data['styles.xml'])
master=styles.find('office:master-styles',ns)
for old in list(master):
 if old.get(q('style','name'))=='RTitlePage': master.remove(old)
standard=master.find('style:master-page',ns)
for old in list(standard):
 if old.tag==q('style','footer'): standard.remove(old)
for old in list(styles.find('office:styles',ns)):
 if old.get(q('style','name'))=='RPageNumber': styles.find('office:styles',ns).remove(old)
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
