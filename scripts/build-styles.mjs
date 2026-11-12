// One render-blocking request; keep editable styles and generated Tailwind separate.
import {readFileSync,writeFileSync} from 'node:fs';
const css=['fonts.css','tailwind.css','custom-styles.css'].map(file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')).join('\n');
writeFileSync(new URL('../site-v1.css',import.meta.url),css);
