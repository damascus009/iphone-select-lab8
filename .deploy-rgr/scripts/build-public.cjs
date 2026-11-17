// Publish only browser assets; server source and credentials never enter public/.
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'public');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','catalog.html','about.html','contacts.html','viewer.html','currency-widget.html','widget.css','site-v1.css','viewer.js','viewer-model.js','data.json','assets','vendor']){
 fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true,filter:src=>!path.basename(src).startsWith('.')});
}
console.log('Public assets prepared. Server code and environment files excluded.');
