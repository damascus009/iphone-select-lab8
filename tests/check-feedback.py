from pathlib import Path
from lxml import etree as E
import json
b=Path(__file__).resolve().parents[1];r=E.HTML((b/'index.html').read_text());ids=r.xpath('//@id');form=r.xpath('//form[@id="feedbackForm"]')[0]
scripts=r.xpath('//script'); maps=[e for e in scripts if e.get('type')=='importmap']; modules=[e for e in scripts if e.get('type')=='module']
map_first=bool(len(maps)==1 and all(scripts.index(maps[0])<scripts.index(m) for m in modules))
checks={'importmap_before_all_modules':map_first,'unique_ids':len(ids)==len(set(ids)),'one_h1':len(r.xpath('//h1'))==1,'fields':{},'missing_local':[]}
for field in form.xpath('.//input|.//textarea'):
 i=field.get('id');refs=field.get('aria-describedby','').split();checks['fields'][i]=bool(field.get('name') and field.get('required') is not None and form.xpath('.//label[@for=$v]',v=i) and refs and all(x in ids for x in refs) and field.get('aria-invalid')=='false')
for src in r.xpath('//script/@src|//link[@rel="stylesheet"]/@href|//img/@src'):
 src=src.split('?')[0]
 if not src.startswith(('http','//')) and not (b/src).exists():checks['missing_local'].append(src)
assert checks['importmap_before_all_modules'] and checks['unique_ids'] and checks['one_h1'] and all(checks['fields'].values()) and not checks['missing_local']
print(json.dumps(checks,ensure_ascii=False,indent=2))
