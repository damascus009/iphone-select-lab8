from pathlib import Path
from bs4 import BeautifulSoup
pages=['index.html','catalog.html','about.html','contacts.html','viewer.html']
for page in pages:
 s=BeautifulSoup(Path(page).read_text(),'html.parser')
 ids=[x['id'] for x in s.select('[id]')]
 assert len(ids)==len(set(ids)),page
 assert len(s.find_all('h1'))==1,page
 assert len(s.select('[aria-current=page]'))==2,page
 for a in s.select('a[href]'):
  h=a['href'];f,_,frag=h.partition('#')
  if h.startswith(('http','mailto:','tel:')):continue
  target=Path(f or page);assert target.exists(),(page,h)
  if frag:assert BeautifulSoup(target.read_text(),'html.parser').find(id=frag),(page,h)
 for x in s.select('[src],link[href]'):
  h=x.get('src',x.get('href','')).split('?')[0]
  if h and not h.startswith(('http','data:')):assert Path(h).exists(),(page,h)
 scripts=[x.get('src') for x in s.select('script[src]')]
 assert ('assets/js/catalog.js' in scripts)==(page=='catalog.html')
 assert ('assets/js/validation.js' in scripts)==(page=='contacts.html')
 assert any('viewer.js' in (x or '') for x in scripts)==(page=='viewer.html')
 if page=='viewer.html':
  raw=Path(page).read_text();assert raw.index('type="importmap"')<raw.index('type="module"')
 print('PASS',page,'links, resources, IDs, h1, navigation, module isolation')
