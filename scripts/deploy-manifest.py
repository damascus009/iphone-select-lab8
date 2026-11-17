"""List only public runtime files, never reports, tests, originals or credentials."""
from pathlib import Path
import hashlib,json
paths=[Path(p) for p in ['index.html','catalog.html','about.html','contacts.html','viewer.html','currency-widget.html','widget.css','site-v1.css','viewer.js','viewer-model.js','vercel.json','package.json','pnpm-lock.yaml','scripts/build-public.cjs','data.json','assets/images/social-preview.jpg']]
for folder,pattern in [('api','*.js'),('lib','*.cjs'),('assets/css','*.css'),('assets/js','*'),('assets/icons','*'),('assets/fonts','*.woff2'),('assets/images','*-v1.webp'),('vendor/three','*.js'),('vendor/three/addons','*.js')]:
 paths+=list(Path(folder).rglob(pattern))
paths=sorted(set(p for p in paths if p.is_file()))
print(json.dumps([{'file':str(p),'sha':hashlib.sha1(p.read_bytes()).hexdigest(),'size':p.stat().st_size} for p in paths]))
