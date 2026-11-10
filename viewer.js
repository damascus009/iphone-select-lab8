// Heavy modules load only after the visitor opens the viewer.
const host=document.querySelector('#phone-viewer'), start=document.querySelector('#viewer-load'), status=document.querySelector('#viewer-status');
const buttons=[...document.querySelectorAll('[data-view]')], panel=document.querySelector('#component-panel'), list=document.querySelector('#component-list'), tooltip=document.querySelector('#viewer-tooltip');
let loading=false, cleanup=()=>{};
start.addEventListener('click',async()=>{
  if(loading || host.dataset.ready==='true')return;
  loading=true;start.disabled=true;status.textContent='Створення 3D-моделі…';
  let renderer,env,scene,frame=0,ro,io;
  const events=new AbortController();
  const on=(target,event,handler,opts={})=>target.addEventListener(event,handler,{...opts,signal:events.signal});
  cleanup=()=>{
    events.abort();cancelAnimationFrame(frame);ro?.disconnect();io?.disconnect();
    const textures=new Set(),materials=new Set();scene?.traverse(o=>{o.geometry?.dispose();for(const m of [o.material].flat().filter(Boolean)){if(materials.has(m))continue;materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value);m.dispose();}});
    textures.forEach(t=>t.dispose());env?.dispose();renderer?.dispose();renderer?.domElement.remove();
    list.replaceChildren();panel.hidden=true;tooltip.hidden=true;host.dataset.ready='false';buttons.forEach(b=>b.disabled=true);
  };
  try{
    const [T,{RoomEnvironment},{createPhone,componentInfo,setExplosion}]=await Promise.all([import('three'),import('./vendor/three/addons/environments/RoomEnvironment.js'),import('./viewer-model.js?v=refine-3')]);
    renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    scene=new T.Scene();const pmrem=new T.PMREMGenerator(renderer), room=new RoomEnvironment();env=pmrem.fromScene(room,.04);scene.environment=env.texture;scene.environmentIntensity=.65;room.dispose();pmrem.dispose();
    const {root,parts}=createPhone(T);scene.add(root);
    const key=new T.DirectionalLight('#fff4e8',2.2);key.position.set(-3,4,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=4;key.shadow.camera.bottom=-4;key.shadow.normalBias=.012;key.shadow.bias=-.0001;scene.add(key);
    const rim=new T.DirectionalLight('#e4ebf2',1.1);rim.position.set(3,1,-4);scene.add(rim);scene.add(new T.HemisphereLight('#e8e8ec','#4b4141',.55));
    const camera=new T.PerspectiveCamera(36,1,.01,100),raycaster=new T.Raycaster(),point=new T.Vector2();
    let yaw=Math.PI+.35,pitch=-.12,zoom=1,progress=0,target=0,last=0,visible=true,selected=null,hovered=null;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');host.append(canvas);
    const invalidate=()=>{if(!frame)frame=requestAnimationFrame(render);};
    function render(time){
      frame=0;if(!visible||document.hidden)return;
      const dt=Math.min((time-last)/1000,.05);last=time;
      progress=reduced.matches?target:T.MathUtils.damp(progress,target,6,dt);if(Math.abs(progress-target)<.001)progress=target;
      setExplosion(parts,progress);
      root.rotation.set(pitch,yaw,0);
      const radius=1.85+progress*.70;const fov=camera.fov*Math.PI/180;const distance=radius/Math.sin(Math.min(fov/2,Math.atan(Math.tan(fov/2)*camera.aspect)));
      camera.position.z=distance/zoom;renderer.render(scene,camera);
      host.dataset.angle=String(Math.round(yaw*180/Math.PI));host.dataset.zoom=zoom.toFixed(2);host.dataset.explosion=progress.toFixed(3);host.dataset.triangles=String(renderer.info.render.triangles);host.dataset.drawCalls=String(renderer.info.render.calls);
      if(progress!==target)invalidate();
    }
    function highlight(){
      for(const [id,g]of parts){
        const active=id===selected||id===hovered;
        const seen=new Set();g.traverse(o=>{if(!o.isMesh||seen.has(o.material))return;seen.add(o.material);
          const m=o.material;m.emissive.copy(active?new T.Color(id===selected?'#413b2e':'#303b40'):m.userData.restEmissive);
          m.emissiveIntensity=active ? .30 :m.userData.restIntensity;
        });
      }invalidate();
    }
    function select(id){selected=id;panel.hidden=!id;for(const b of list.children)b.setAttribute('aria-pressed',String(b.dataset.part===id));if(id){const info=componentInfo.find(x=>x[0]===id);document.querySelector('#component-source').href=info[4];document.querySelector('#component-title').textContent=info[1];document.querySelector('#component-description').textContent=info[2];document.querySelector('#component-specs').textContent=info[3];}highlight();}
    function announce(){status.textContent=`${target?'Розібраний':'Зібраний'} iPhone · масштаб ${Math.round(zoom*100)}%. Оберіть деталь на моделі або у списку.`;}
    function command(action){
      if(action==='left')yaw-=Math.PI/8;if(action==='right')yaw+=Math.PI/8;
      if(action==='front'){yaw=0;pitch=0;}if(action==='back'){yaw=Math.PI;pitch=0;}if(action==='side'){yaw=Math.PI/2;pitch=0;}
      if(action==='up')pitch-=.15;if(action==='down')pitch+=.15;
      if(action==='in')zoom=Math.min(1.7,zoom+.1);if(action==='out')zoom=Math.max(.65,zoom-.1);
      if(action==='explode'){target=1;yaw=-.85;pitch=-.23;zoom=1;}
      if(action==='assemble')target=0;
      if(action==='reset'){target=0;yaw=Math.PI+.35;pitch=-.12;zoom=1;hovered=null;tooltip.hidden=true;select(null);}
      buttons.filter(b=>['explode','assemble'].includes(b.dataset.view)).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===(target?'explode':'assemble'))));
      tooltip.hidden=true;hovered=null;highlight();invalidate();announce();
    }
    for(const b of buttons){b.disabled=false;on(b,'click',()=>command(b.dataset.view));}
    for(const [id,name]of componentInfo){const b=document.createElement('button');b.type='button';b.dataset.part=id;b.textContent=name;b.setAttribute('aria-pressed','false');on(b,'click',()=>select(id));list.append(b);}
    on(document.querySelector('#component-close'),'click',()=>{select(null);host.focus({preventScroll:true});});
    on(host,'keydown',e=>{const action={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down','+':'in','=':'in','-':'out',Home:'reset',e:'explode',E:'explode',c:'assemble',C:'assemble'}[e.key];if(action){e.preventDefault();command(action);}if(e.key==='Escape')select(null);});
    function pick(e){const r=canvas.getBoundingClientRect();point.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);raycaster.setFromCamera(point,camera);return raycaster.intersectObject(root,true)[0]?.object.userData.part||null;}
    let pointer=null;
    on(canvas,'pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,yaw,pitch,moved:false};canvas.setPointerCapture(e.pointerId);host.focus({preventScroll:true});});
    on(canvas,'pointermove',e=>{
      if(pointer&&pointer.id===e.pointerId){const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(Math.hypot(dx,dy)>6)pointer.moved=true;if(pointer.moved){yaw=pointer.yaw+dx*.009;pitch=pointer.pitch+dy*.006;host.classList.add('dragging');tooltip.hidden=true;invalidate();}return;}
      hovered=pick(e);canvas.style.cursor=hovered?'pointer':'grab';tooltip.hidden=!hovered;
      if(hovered)tooltip.textContent=componentInfo.find(x=>x[0]===hovered)[1]+' · натисніть для опису';highlight();
    });
    const release=e=>{if(!pointer||pointer.id!==e.pointerId)return;const click=!pointer.moved&&e.type==='pointerup';pointer=null;host.classList.remove('dragging');if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(click)select(pick(e));announce();};
    on(canvas,'pointerup',release);on(canvas,'pointercancel',release);on(canvas,'lostpointercapture',release);
    on(canvas,'pointerleave',()=>{hovered=null;tooltip.hidden=true;highlight();});
    on(canvas,'wheel',e=>{e.preventDefault();command(e.deltaY<0?'in':'out');},{passive:false});
    on(canvas,'webglcontextlost',e=>{e.preventDefault();cleanup();loading=false;start.hidden=false;start.disabled=false;document.querySelector('#viewer-poster').hidden=false;status.textContent='3D-контекст втрачено. Натисніть «Відкрити 360°», щоб відновити.';});
    const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();invalidate();};
    ro=new ResizeObserver(resize);ro.observe(host);io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){last=performance.now();invalidate();}});io.observe(host);
    on(document,'visibilitychange',()=>{last=performance.now();invalidate();});on(reduced,'change',invalidate);
    document.querySelector('#viewer-poster').hidden=true;start.hidden=true;host.dataset.ready='true';loading=false;resize();command('reset');host.focus({preventScroll:true});
  }catch(error){cleanup();loading=false;start.disabled=false;start.hidden=false;document.querySelector('#viewer-poster').hidden=false;status.textContent='Не вдалося відкрити 3D. Перевірте WebGL і доступність файлів, потім спробуйте ще раз.';console.error('iPhone 360:',error);}
});
window.addEventListener('pagehide',e=>{if(!e.persisted)cleanup();});
