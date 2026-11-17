import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const source=readFileSync('assets/js/theme.js','utf8');
function boot(saved, blocked=false) {
 const callbacks={},mediaCallbacks={},windowCallbacks={},attrs={};
 const button={textContent:'',setAttribute:(k,v)=>attrs[k]=v,addEventListener:(k,v)=>callbacks[k]=v};
 const root={dataset:{},style:{}};
 const storage={getItem:()=>{if(blocked)throw Error();return saved;},setItem:(k,v)=>{if(blocked)throw Error();saved=v;}};
 const media={matches:false,addEventListener:(k,v)=>mediaCallbacks[k]=v};
 vm.runInNewContext(source,{localStorage:storage,document:{documentElement:root,querySelector:s=>s==='#theme-toggle'?button:{setAttribute(){}},addEventListener:(k,v)=>callbacks[k]=v},window:{matchMedia:()=>media,addEventListener:(k,v)=>windowCallbacks[k]=v}});
 callbacks.DOMContentLoaded();return{root,attrs,callbacks,media,mediaCallbacks,windowCallbacks,saved:()=>saved};
}
const a=boot(null);assert.equal(a.root.dataset.theme,'dark');a.callbacks.click();assert.equal(a.saved(),'light');assert.equal(boot(a.saved()).root.dataset.theme,'light');assert.equal(a.attrs['aria-pressed'],'true');
a.media.matches=false;a.mediaCallbacks.change();assert.equal(a.root.dataset.theme,'light');
a.windowCallbacks.storage({key:'iphone-select-theme',newValue:'dark'});assert.equal(a.root.dataset.theme,'dark');
const b=boot(null,true);b.callbacks.click();assert.equal(b.root.dataset.theme,'light');
const c=boot('invalid');c.media.matches=true;c.mediaCallbacks.change();assert.equal(c.root.dataset.theme,'light');
console.log('PASS theme: persistence, blocked storage, system preference, cross-tab change, accessible state');
