// A schematic, procedural assembly. Dimensions and internals are illustrative.
export const componentInfo = [
  ['display', 'Дисплей', 'Відображає зображення й приймає дотики.', 'Скло, панель та сенсорний шар; роздільність і діагональ не задані.'],
  ['battery', 'Акумулятор', 'Живить електроніку телефона.', 'Схематичний літій-іонний акумулятор; ємність не підтверджена.'],
  ['board', 'Основна плата', 'З’єднує та координує електронні компоненти.', 'Багатошарова плата, провідні доріжки, роз’єми та контролери.'],
  ['processor', 'Процесор', 'Обробляє обчислення, графіку та дані.', 'Умовний SoC; назва, техпроцес і продуктивність не заявляються.'],
  ['rear', 'Модуль задніх камер', 'Перетворює світло на фото й відео.', 'Три схематичні оптичні модулі; характеристики сенсорів не задані.'],
  ['front', 'Фронтальна камера', 'Забезпечує селфі та відеозв’язок.', 'Умовний об’єктив і сенсор у верхній частині дисплея.'],
  ['chassis', 'Корпус і рама', 'Захищає та утримує внутрішні деталі.', 'Burgundy-покриття, рамка, задня панель і бічні кнопки.'],
  ['speakers', 'Динаміки', 'Перетворюють електричний сигнал на звук.', 'Умовні верхній і нижній акустичні модулі.'],
  ['coil', 'Котушка заряджання', 'Приймає енергію через магнітне поле.', 'Схематична мідна обмотка; потужність заряджання не задана.']
];

export function createPhone(T) {
  const root = new T.Group(), parts = new Map();
  const mat = (color, metalness=.5, roughness=.3) => new T.MeshStandardMaterial({color,metalness,roughness});
  const burgundy=mat('#48212e',.8,.26), edge=mat('#a76b78',.85,.2), black=mat('#101217',.3,.3), silver=mat('#a0a8b5',.9,.23), copper=mat('#cf8c4c',.85,.25), pcb=mat('#143d38',.5,.45), glass=mat('#071a30',.75,.12);
  function part(id, base, offset) { const g=new T.Group(); g.name=id; g.position.set(...base); g.userData={id,base:g.position.clone(),offset:new T.Vector3(...offset)}; root.add(g); parts.set(id,g); return g; }
  function mesh(g, geometry, material, pos=[0,0,0]) { const m=new T.Mesh(geometry,material.clone()); m.position.set(...pos); m.userData.part=g.userData.id; g.add(m); return m; }
  function slab(g,w,h,d,r,material,pos=[0,0,0]) {
    const s=new T.Shape(), x=-w/2,y=-h/2;
    s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r); s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h); s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r); s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y);
    const geo=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:2,steps:1,curveSegments:12}); geo.translate(0,0,-d/2);
    return mesh(g,geo,material,pos);
  }
  const chassis=part('chassis',[0,0,-.13],[0,0,-1.35]);
  slab(chassis,1.42,2.95,.09,.22,burgundy);
  // Thin side rails leave the internals open when the display lifts away.
  for(const x of [-.695,.695]) slab(chassis,.025,2.55,.19,.01,edge,[x,0,.08]);
  for(const y of [-1.45,1.45]) slab(chassis,1.02,.025,.19,.01,edge,[0,y,.08]);
  for(const [x,y,h] of [[.724,.45,.36],[-.724,.35,.23],[-.724,.7,.23]]) slab(chassis,.025,h,.08,.01,burgundy,[x,y,.06]);
  slab(chassis,.21,.045,.01,.018,black,[0,-1.465,.07]).rotation.x=Math.PI/2;
  for(let i=0;i<10;i++) mesh(chassis,new T.SphereGeometry(.013,8,6),black,[(i<5?-.5:.22)+(i%5)*.065,-1.47,.07]);
  slab(chassis,1.29,1.98,.008,.19,mat('#3d202a',.6,.36),[0,-.39,-.054]);
  // A small stylized fruit emblem, built as geometry on the rear panel.
  const emblem=new T.Shape();emblem.moveTo(0,.105);emblem.bezierCurveTo(.15,.20,.22,.07,.14,-.08);emblem.bezierCurveTo(.08,-.21,.02,-.13,0,-.14);emblem.bezierCurveTo(-.04,-.13,-.11,-.21,-.17,-.06);emblem.bezierCurveTo(-.23,.10,-.12,.20,0,.105);
  const logo=mesh(chassis,new T.ShapeGeometry(emblem,20),mat('#985768',.65,.4),[0,-.22,-.082]);logo.rotation.y=Math.PI;
  const leaf=mesh(chassis,new T.SphereGeometry(.055,16,12),mat('#985768',.65,.4),[-.035,-.035,-.082]);leaf.scale.set(.5,1.1,.08);leaf.rotation.z=-.6;
  const display=part('display',[0,0,.12],[0,0,1.55]);
  slab(display,1.40,2.93,.045,.21,silver); slab(display,1.35,2.88,.018,.2,black,[0,0,.031]);
  const c=document.createElement('canvas'); c.width=512;c.height=1024; const ctx=c.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,512,1024);grad.addColorStop(0,'#130f29');grad.addColorStop(.5,'#723d6d');grad.addColorStop(1,'#100d23');ctx.fillStyle=grad;ctx.fillRect(0,0,512,1024);
  for(let i=0;i<4;i++){const glow=ctx.createRadialGradient(100+i*140,650-i*130,5,100+i*140,650-i*130,360);glow.addColorStop(0,'#df93c780');glow.addColorStop(.6,'#bd649940');glow.addColorStop(1,'#1b092000');ctx.fillStyle=glow;ctx.fillRect(0,0,512,1024);}
  ctx.fillStyle='#ffffffdd';ctx.textAlign='center';ctx.font='300 92px sans-serif';ctx.fillText('9:41',256,245);ctx.font='24px sans-serif';ctx.fillText('iPhone Select',256,305);
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
  const screen=slab(display,1.29,2.81,.006,.18,new T.MeshStandardMaterial({map:texture,emissiveMap:texture,emissive:0xffffff,emissiveIntensity:.25,roughness:.25}),[0,0,.047]);
  const uv=screen.geometry.attributes.uv, vertices=screen.geometry.attributes.position;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(vertices.getX(i)+.645)/1.29,(vertices.getY(i)+1.405)/2.81);
  slab(display,.34,.082,.015,.04,black,[0,1.25,.063]);
  const battery=part('battery',[-.16,-.25,.015],[-.18,0,.75]);slab(battery,.89,1.64,.08,.08,black);
  for(const y of [-.6,.6]) slab(battery,.7,.016,.009,.005,silver,[0,y,.05]);
  const board=part('board',[.49,.07,.005],[.75,0,.1]);slab(board,.28,2.17,.045,.04,pcb);
  for(let i=0;i<14;i++){slab(board,.12,.07,.018,.006,i%3?black:silver,[0,-.9+i*.14,.035]);slab(board,.012,.11,.004,.003,copper,[.10,-.9+i*.14,.025]);}
  const cpu=part('processor',[.49,.55,.06],[.9,.18,.9]);slab(cpu,.24,.27,.04,.025,silver);slab(cpu,.20,.23,.01,.01,black,[0,0,.028]);
  for(let i=0;i<7;i++)for(const x of [-.13,.13])slab(cpu,.035,.012,.012,.002,copper,[x,-.105+i*.035,0]);
  const rear=part('rear',[0,.99,-.215],[-.55,.65,-.5]);slab(rear,1.25,.78,.08,.16,burgundy);
  for(const [x,y] of [[.37,.19],[.37,-.19],[-.05,0]]){
    const ring=mesh(rear,new T.CylinderGeometry(.18,.18,.08,48),edge,[x,y,-.08]); ring.rotation.x=Math.PI/2;
    const lens=mesh(rear,new T.CylinderGeometry(.143,.143,.085,48),black,[x,y,-.105]);lens.rotation.x=Math.PI/2;
    const optic=mesh(rear,new T.SphereGeometry(.092,24,16),glass,[x,y,-.15]);optic.scale.z=.28;
    mesh(rear,new T.SphereGeometry(.023,12,8),silver,[x-.025,y+.035,-.174]);
  }
  const flash=mesh(rear,new T.CylinderGeometry(.068,.068,.012,24),mat('#eee5d7',.1,.2),[-.43,.19,-.052]);flash.rotation.x=Math.PI/2;
  const front=part('front',[0,1.25,.09],[.65,.5,1.15]);slab(front,.29,.07,.02,.03,black);mesh(front,new T.SphereGeometry(.029,16,12),glass,[.08,0,.025]);
  const speakers=part('speakers',[0,0,-.005],[-.75,-.25,.2]);
  for(const y of [-1.27,1.32]) {slab(speakers,.67,.12,.06,.035,black,[0,y,0]);for(let i=0;i<8;i++)slab(speakers,.025,.07,.006,.01,silver,[-.25+i*.07,y,.04]);}
  const coil=part('coil',[0,-.22,-.066],[0,0,-.65]);
  for(let i=0;i<9;i++)mesh(coil,new T.TorusGeometry(.29+i*.019,.007,6,64),copper);
  for(const g of parts.values())g.traverse(o=>{if(o.isMesh)o.userData.part=g.name;});
  return {root,parts};
}
