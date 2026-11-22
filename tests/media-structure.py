from pathlib import Path
from lxml import etree as E
import json
p=Path(__file__).resolve().parents[1];r=E.HTML((p/'index.html').read_text())
js=r.xpath('//script/@src');css=r.xpath('//link[@rel="stylesheet"]/@href');region=r.xpath('//*[@id="media-lab"]')[0]
checks={'slides':len(region.xpath('.//article[contains(@class,"swiper-slide")]'))>=5,'album':len(region.xpath('.//a[@data-fancybox="coffee-gallery"]'))>=3,'single_swiper':len([x for x in js if 'swiper@11.2.10' in x])==1,'single_fancybox':len([x for x in js if '@fancyapps/ui@5.0.36' in x])==1,'typed':any('typed.js@2.0.12' in x for x in js),'css':all(any(v in x for x in css) for v in ['swiper@11.2.10','@fancyapps/ui@5.0.36']),'init_after_libraries':js.index('assets/js/media.js')>max(i for i,x in enumerate(js) if 'cdn.jsdelivr.net' in x),'local_gallery':all((p/x).is_file() for x in region.xpath('.//a[@data-fancybox]/@href'))}
assert all(checks.values()),checks
print(json.dumps(checks,indent=2))
