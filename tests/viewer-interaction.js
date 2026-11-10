// Standalone test fixture; no changes to browser/OS preferences.
const output=document.querySelector('#results'),host=document.querySelector('#phone-viewer'),lines=[];
const check=(value,name)=>{if(!value)throw Error(name);lines.push('PASS '+name);};
const until=async(predicate)=>{const end=performance.now()+10000;while(!predicate()){if(performance.now()>end)throw Error('Timed out waiting for viewer');await new Promise(r=>setTimeout(r,20));}};
const mode=new URLSearchParams(location.search).get('mode');
if(mode==='no-webgl'){
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);};
}else{
  const original=window.matchMedia;
  window.matchMedia=query=>query==='(prefers-reduced-motion: reduce)'?Object.assign(new EventTarget(),{matches:true,media:query}):original.call(window,query);
}
try{
  await import('../viewer.js?v=refine-5');
  document.querySelector('#viewer-load').click();
  if(mode==='no-webgl'){
    await until(()=>document.querySelector('#viewer-status').textContent.includes('Не вдалося'));
    check(!document.querySelector('#viewer-load').disabled,'retry available without WebGL');
    check(host.querySelectorAll('canvas').length===0,'no abandoned canvas after error');
  }else{
    await until(()=>host.dataset.ready==='true'&&host.dataset.explosion==='0.000');
    check(host.querySelectorAll('canvas').length===1,'single renderer after loading');
    document.querySelector('#viewer-load').click();check(host.querySelectorAll('canvas').length===1,'duplicate load ignored');
    document.querySelector('[data-view="explode"]').click();await until(()=>host.dataset.explosion==='1.000');check(true,'reduced-motion explosion completes immediately');
    for(const button of document.querySelectorAll('#component-list button')){button.click();check(!document.querySelector('#component-panel').hidden&&document.querySelector('#component-title').textContent===button.textContent,'selection '+button.dataset.part);}
    document.querySelector('[data-view="assemble"]').click();await until(()=>host.dataset.explosion==='0.000');check(true,'reduced-motion assembly');
    document.querySelector('[data-view="side"]').click();await until(()=>host.dataset.angle==='90');check(true,'side view exactly 90 degrees');
    host.dispatchEvent(new KeyboardEvent('keydown',{key:'+',bubbles:true}));await until(()=>host.dataset.zoom==='1.10');check(true,'keyboard zoom');
    document.querySelector('[data-view="reset"]').click();await until(()=>host.dataset.zoom==='1.00');check(document.querySelector('#component-panel').hidden,'reset clears selection');
    // Synthetic context-loss event verifies the UI/resource recovery path only.
    host.querySelector('canvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true}));
    check(host.querySelectorAll('canvas').length===0&&!document.querySelector('#viewer-load').hidden,'context loss cleanup');
    document.querySelector('#viewer-load').click();await until(()=>host.dataset.ready==='true');check(host.querySelectorAll('canvas').length===1,'context loss retry');
  }
  output.textContent=lines.join('\n')+'\nALL CHECKS PASSED';
}catch(e){output.textContent=lines.join('\n')+'\nFAIL '+e.message;console.error(e);}
