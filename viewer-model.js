// Existing procedural assembly, visually refined against user references (2026-11-12).
// 1 scene unit = 50 mm. External proportions are specified; internal meshes are
// simplified interpretations of the repair illustrations, NOT manufacturing CAD.
export const modelDimensions = Object.freeze({width:1.438,height:3,depth:.175,frameBack:-.0775,frameFront:.0675});
const manual='https://support.apple.com/en-us/127390';
const schematic='Геометрія та дрібні елементи схематичні; не ремонтне креслення.';
export const componentInfo = [
 ['display','Дисплей','Відображає зображення та приймає дотики.','Модуль і його клейовий контур наведено в Apple Exploded View.'],
 ['battery','Акумулятор','Забезпечує живлення пристрою.','Форма спрощена за ілюстрацією; парний вузол із випарною камерою.'],
 ['vapor','Випарна камера','Розподіляє тепло від електроніки.','Apple позначає її прикріпленою до акумулятора: у макеті вони рухаються разом.'],
 ['board','Системна плата','З’єднує обчислювальні та периферійні вузли.','Форма плати, доріжки та розміщення мікросхем уточнені за візуальним референсом і є схематичними.'],
 ['processor','Процесор','Обробляє дані та графіку.','Навчальна вставка: точні корпус, контакти й координати чипа не підтверджені посібником.'],
 ['shields','Екрани плати','Екранують електронні компоненти.','Контури спрощено за виглядом плати; внутрішня структура не заявляється.'],
 ['rear','Основний модуль камери','Формують фото й відео.','Окремий корпус оптики, кріплення та шлейф. Оптична будова схематична.'],
 ['camera-cover','Захисні вікна камер','Захищають оптику від зовнішнього впливу.','Знижений рельєф — візуальна апроксимація; висота виступу не є заводським розміром.'],
 ['front','Фронтальна камера','Забезпечує фронтальне зображення.','Окремий вузол за переліком Apple; лінзи та конектор спрощені.'],
 ['faceid','Сенсори Face ID','Забезпечують роботу TrueDepth.','Face ID підтверджено Apple; поділ на сенсори та їхня геометрія в макеті схематичні.'],
 ['chassis','Корпус і рама','Утримує та захищає вузли.','Габаритне співвідношення 71,9 × 150 × 8,75 мм за Apple Tech Specs; суцільний замкнений периметр.'],
 ['back','Задня панель','Закриває задню частину корпусу.','Окремий вузол Back glass у посібнику Apple.'],
 ['speakers','Нижній динамік','Відтворює звук.','Окремий модуль у нижній частині за Internal View. Макет варіанта eSIM.'],
 ['top-speaker','Верхній динамік','Відтворює звук у верхній частині.','Окремий модуль і захисна решітка за Exploded View.'],
 ['taptic','Taptic Engine','Створює тактильний відгук.','Документований нижній вузол; металевий кожух і кріплення спрощені.'],
 ['usb','USB-C','Забезпечує дротове підключення та живлення.','Роз’єм, шлейф і накладка присутні в переліку Apple. Контакти схематичні.'],
 ['microphone','Основний мікрофон','Перетворює звук на електричний сигнал.','Документований нижній вузол; розміри й акустичний канал умовні.'],
 ['coil','Бездротове заряджання','Приймає енергію через магнітне поле.','Розташування в зоні задньої панелі узгоджене зі схемою; витки та магніти схематичні.'],
 ['antenna','Антенний модуль','Забезпечує радіозв’язок.','mmWave позначено Apple лише для деяких моделей; геометрія й доріжки схематичні.'],
 ['flex','Шлейфи й конектори','З’єднують плату з іншими вузлами.','Конектори дисплея, батареї й датчика освітлення документовані; маршрути шлейфів схематичні.'],
 ['cowlings','Захисні накладки конекторів','Фіксують і захищають з’єднання.','Накладки дисплея, батареї, USB-C та задньої панелі наведені в Parts.'],
 ['fasteners','Кріплення та заземлення','Фіксують модулі й забезпечують контакт із корпусом.','Кількість, різьба та координати показаних гвинтів умовні; це не карта сервісних гвинтів.'],
 ['display-seal','Контур дисплея','Ущільнює з’єднання дисплея й корпусу.','Display adhesive документований Apple; товщина умовна.'],
 ['back-seal','Контур задньої панелі','Ущільнює задню панель.','Back glass adhesive документований Apple; товщина умовна.']
 ,['oled','OLED і сенсорний шар','Формує зображення під захисним склом.','Окремий навчальний шар за візуальним референсом.'],
 ['display-shield','Опорна пластина дисплея','Підтримує екранний модуль.','Схематична пластина з кріпленнями й контактами.'],
 ['rear-shield','Опорна пластина задньої панелі','Підтримує задній вузол.','Навчальна геометрія за референсом, не заводська деталь.'],
 ['graphite','Графітовий шар','Ілюструє розподіл тепла.','Контур і товщина умовні.'],
 ['rear-wide','Другий модуль камери','Окремий оптичний модуль.','Внутрішня оптика схематична.'],
 ['rear-tele','Третій модуль камери','Окремий оптичний модуль.','Внутрішня оптика схематична.'],
 ['optics','Оптичні елементи','Ілюструють багатошарову оптику.','Лінзи рознесені для огляду; це не реальна схема об’єктива.'],
 ['optics-mid','Оптика другого модуля','Ілюструє лінзову групу.','Схематична оптика за референсом.'],
 ['optics-inner','Оптика третього модуля','Ілюструє лінзову групу.','Схематична оптика за референсом.'],
 ['brackets','Внутрішні кронштейни','Ілюструють кріплення модулів.','Форма, кількість і розташування за візуальним референсом.']
].map(([id,name,purpose,detail])=>[id,name,purpose,detail+' '+schematic,manual]);

export function createPhone(T) {
  const root = new T.Group(), parts = new Map();
  const {width:W,height:H,frameBack:BACK,frameFront:FRONT}=modelDimensions;
  const R=.205;
  const mat=(color,metalness=.5,roughness=.45)=>new T.MeshStandardMaterial({color,metalness,roughness});
  const burgundy=mat('#35151e',.62,.37), edge=mat('#59323c',.72,.31), black=mat('#111418',.1,.58), silver=mat('#8b9095',.8,.4), copper=mat('#ad7845',.75,.4), pcb=mat('#172c29',.2,.6), graphite=mat('#24262a',.3,.65);
  const glass=new T.MeshPhysicalMaterial({color:'#03070c',metalness:.06,roughness:.10,clearcoat:1,clearcoatRoughness:.12,ior:1.5});
  const materials=new Map();
  function part(id,base,offset,stage=.2) {
    const g=new T.Group();g.name=id;g.position.set(...base);
    g.userData={id,base:g.position.clone(),offset:new T.Vector3(...offset),stage};root.add(g);parts.set(id,g);return g;
  }
  function mesh(g,geometry,material,pos=[0,0,0]) {
    // Share materials within a selectable group, never across groups.
    const key=g.name+':'+material.uuid;
    if(!materials.has(key)){const m=material.clone();m.userData.restEmissive=m.emissive.clone();m.userData.restIntensity=m.emissiveIntensity;materials.set(key,m);}
    const m=new T.Mesh(geometry,materials.get(key));m.position.set(...pos);m.userData.part=g.name;m.castShadow=true;m.receiveShadow=true;g.add(m);return m;
  }
  function rounded(w,h,r,Type=T.Shape){const s=new Type(),x=-w/2,y=-h/2;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
  }
  function slab(g,w,h,d,r,material,pos=[0,0,0]){
    // Bevels stay INSIDE requested bounds. Shared mating planes remain exact.
    const b=Math.min(.007,d*.23,r*.20),s=rounded(w-2*b,h-2*b,Math.max(.0001,r-b));
    const geo=new T.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:Math.max(w,h)<.55?1:3,steps:1,curveSegments:Math.max(w,h)<.55?3:12});geo.translate(0,0,-(d-2*b)/2);return mesh(g,geo,material,pos);
  }
  function ring(g,w,h,r,inset,d,material,pos=[0,0,0]){
    const s=rounded(w,h,r);s.holes.push(rounded(w-inset*2,h-inset*2,r-inset,T.Path));
    const geo=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:16,steps:1});geo.translate(0,0,-d/2);return mesh(g,geo,material,pos);
  }
  function disc(g,r,d,material,pos){const o=mesh(g,new T.CylinderGeometry(r,r,d,32),material,pos);o.rotation.x=Math.PI/2;return o;}
  function ribbon(g,points,width=.045){for(let i=1;i<points.length;i++){const a=new T.Vector3(...points[i-1]),b=new T.Vector3(...points[i]),delta=b.clone().sub(a);const o=mesh(g,new T.BoxGeometry(width,delta.length(),.003),copper,a.clone().add(b).multiplyScalar(.5).toArray());o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());}}
  function connector(g,x,y,z,w=.12){slab(g,w,.045,.012,.006,black,[x,y,z]);for(let i=0;i<6;i++)slab(g,.008,.033,.002,.001,copper,[x-w*.38+i*w*.152,y,z+.007]);}
  function screw(g,x,y,z){disc(g,.017,.009,silver,[x,y,z]);slab(g,.020,.004,.001,.001,black,[x,y,z+.005]);slab(g,.004,.020,.001,.001,black,[x,y,z+.005]);}
  function label(g,text,w,h,pos,color='#aeb1b3'){
    const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#151719';ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.textAlign='center';ctx.font='26px sans-serif';ctx.fillText(text,256,73);
    const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;
    return mesh(g,new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.8}),pos);
  }
  // Closed machined perimeter, replacing the four disconnected old rails.
  const chassis=part('chassis',[0,0,0],[0,0,0],0);
  // Small bevels stay within the shared front/back mating planes.
  const frameShape=rounded(W-.008,H-.008,R-.004);
  frameShape.holes.push(rounded(W-.072,H-.072,R-.036,T.Path));
  const frameGeo=new T.ExtrudeGeometry(frameShape,{depth:FRONT-BACK-.008,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:3,curveSegments:20,steps:1});
  frameGeo.translate(0,0,BACK+.004);mesh(chassis,frameGeo,burgundy);
  // Button capsules stay close to the side wall; all positions share the same datum.
  for(const [x,y,h] of [[W/2+.004,.55,.31],[-W/2-.004,.35,.20],[-W/2-.004,.64,.20],[-W/2-.004,.96,.11],[W/2+.004,-.5,.24]]){
    const gasket=slab(chassis,.052,h+.012,.003,.024,black,[Math.sign(x)*(W/2+.001),y,-.002]);gasket.rotation.y=Math.PI/2;
    const button=slab(chassis,.044,h,.012,.021,edge,[x,y,-.002]);button.rotation.y=Math.PI/2;
  }
  for(const x of [-W/2-.0003,W/2+.0003])for(const y of [-1.07,1.07])slab(chassis,.001,.027,.142,.0004,mat('#78716d',.05,.75),[x,y,-.005]);
  const back=part('back',[0,0,-.0825],[0,0,-1.2],0);
  slab(back,W,H,.01,R,burgundy);
  // A continuous back finish replaces the mismatched grey inset.
  slab(back,W-.035,H-.035,.0006,R-.018,mat('#32151e',.32,.42),[0,0,-.0053]);
  const emblem=new T.Shape();emblem.moveTo(0,.105);emblem.bezierCurveTo(.15,.20,.22,.07,.14,-.08);emblem.bezierCurveTo(.08,-.21,.02,-.13,0,-.14);emblem.bezierCurveTo(-.04,-.13,-.11,-.21,-.17,-.06);emblem.bezierCurveTo(-.23,.10,-.12,.20,0,.105);
  const logo=mesh(back,new T.ShapeGeometry(emblem,12),mat('#655255',.55,.5),[0,-.25,-.0058]);logo.rotation.y=Math.PI;
  const leaf=mesh(back,new T.SphereGeometry(.045,12,8),mat('#655255',.55,.5),[-.035,-.065,-.006]);leaf.scale.set(.5,1.1,.01);leaf.rotation.z=-.6;
  const display=part('display',[0,0,FRONT],[0,0,2.45],0);
  slab(display,W,H,.012,R,edge,[0,0,.006]);slab(display,W,H,.008,R,black,[0,0,.016]);
  const c=document.createElement('canvas'); c.width=512;c.height=1024; const ctx=c.getContext('2d');
  ctx.fillStyle='#13070d';ctx.fillRect(0,0,512,1024);
  // Burgundy arcs generated locally, matching the supplied visual direction.
  for(const [cx,cy,rx,ry]of [[-170,-170,850,650],[700,1060,850,650]]){
    const grad=ctx.createRadialGradient(cx,cy,100,cx,cy,850);
    grad.addColorStop(0,'#190911');grad.addColorStop(.65,'#39121f');grad.addColorStop(.90,'#602738');grad.addColorStop(1,'#a46270');
    ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#b27b8780';ctx.lineWidth=1.3;ctx.stroke();
  }
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
  const screen=slab(display,1.33,2.89,.0004,.175,new T.MeshPhysicalMaterial({map:texture,emissiveMap:texture,emissive:0xffffff,emissiveIntensity:.15,roughness:.22,metalness:0,clearcoat:.45,clearcoatRoughness:.18}),[0,0,.0202]);
  const uv=screen.geometry.attributes.uv, vertices=screen.geometry.attributes.position;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(vertices.getX(i)+.665)/1.33,(vertices.getY(i)+1.445)/2.89);
  slab(display,.32,.075,.0006,.037,black,[0,1.31,.0207]);
  slab(display,.34,.009,.0005,.004,silver,[0,-1.36,.0207]);
  const oled=part('oled',[0,0,.063],[0,0,0],.10);
  slab(oled,1.31,2.83,.005,.17,black);
  ring(oled,1.32,2.84,.17,.009,.002,copper,[0,0,.0038]);
  ribbon(oled,[[.48,-.9,-.004],[.48,-1.25,-.004],[.24,-1.25,-.004]],.075);connector(oled,.24,-1.25,-.006);
  const displayShield=part('display-shield',[0,0,.056],[0,0,0],.16);
  slab(displayShield,1.29,2.81,.005,.16,silver);
  for(const x of [-.59,.59])for(const y of [-1.1,-.55,0,.55,1.1]){
    ring(displayShield,.065,.10,.018,.012,.003,graphite,[x,y,.004]);
  }
  slab(displayShield,1.15,2.50,.001,.13,graphite,[0,0,-.0035]);
  const displaySeal=part('display-seal',[0,0,FRONT-.001],[0,0,2.05],.08);
  ring(displaySeal,W-.072,H-.072,R-.036,.012,.002,black);
  const backSeal=part('back-seal',[0,0,BACK+.001],[0,0,-.85],.08);
  ring(backSeal,W-.072,H-.072,R-.036,.012,.002,black);

  const battery=part('battery',[.18,-.40,-.006],[0,0,1.30],.22);
  slab(battery,.86,1.48,.074,.065,silver);
  slab(battery,.82,1.44,.003,.05,black,[0,0,.0385]);
  label(battery,'Li-ion  ·  SCHEMATIC',.67,.16,[0,-.12,.0402]);
  for(const x of [-.35,.35])slab(battery,.026,1.39,.002,.007,graphite,[x,0,.040]);
  for(const y of [-.64,.64]){slab(battery,.14,.03,.004,.008,graphite,[-.27,y,.041]);slab(battery,.14,.03,.004,.008,graphite,[.27,y,.041]);}
  connector(battery,.20,.75,.015);
  const vapor=part('vapor',[.18,-.40,.036],[0,0,1.30],.22);
  slab(vapor,.87,1.49,.006,.065,graphite);
  // The thermal plate and battery keep their assembled relationship throughout.
  for(let i=0;i<7;i++)slab(vapor,.006,1.37,.001,.002,silver,[-.33+i*.11,0,.0036]);
  label(vapor,'THERMAL ASSEMBLY',.65,.10,[0,.5,.0042]);

  const board=part('board',[-.48,.13,-.008],[-.60,.12,.63],.32);
  slab(board,.36,2.12,.018,.045,pcb);

  // Unequal packages and passive banks replace the repetitive chip grid.
  for(const [x,y,w,h]of [[0,.85,.21,.18],[-.03,.55,.16,.22],[.02,.19,.22,.24],[0,-.20,.24,.28],[0,-.60,.22,.25],[0,-.90,.24,.12]]){
    slab(board,w,h,.014,.008,black,[x,y,.016]);
    for(let i=0;i<8;i++)for(const side of [-1,1])slab(board,.012,.006,.004,.001,copper,[x+side*(w/2+.006),y-h*.4+i*h*.114,.014]);
  }
  for(let i=0;i<64;i++){
    const x=i%2?-.145:.145,y=-.96+Math.floor(i/2)*.060;
    slab(board,.024,.023,.009,.002,i%3?silver:black,[x,y,.014]);
  }
  for(let i=0;i<14;i++){disc(board,.009,.001,copper,[-.08+(i%4)*.054,-.32+Math.floor(i/4)*.19,.010]);}
  for(let i=0;i<10;i++)slab(board,.004,1.95,.001,.001,copper,[-.155+i*.032,0,.0098]);
  for(const y of [-1.01,1.01])screw(board,0,y,.015);
  connector(board,0,-1.02,.019,.18);
  const cpu=part('processor',[-.48,.32,.022],[-.60,.12,1.00],.4);
  slab(cpu,.23,.22,.012,.012,black);label(cpu,'SoC',.17,.06,[0,0,.0066]);
  for(let i=0;i<8;i++)for(const x of [-.12,.12])slab(cpu,.014,.008,.004,.001,copper,[x,-.09+i*.026,0]);
  const shields=part('shields',[-.48,.13,.045],[-.60,.12,1.32],.15);
  for(const [x,y,w,h]of [[0,.55,.32,.60],[0,-.19,.32,.50],[0,-.70,.30,.32]]){
    slab(shields,w,h,.006,.024,silver,[x,y,0]);ring(shields,w-.024,h-.024,.018,.007,.004,graphite,[x,y,.005]);
  }

  const cameraCenters=[[.38,1.13,'rear'],[.38,.73,'rear-wide'],[0,.93,'rear-tele']];
  for(const [x,y,id]of cameraCenters){
    const rear=part(id,[x,y,-.008],[0,0,0],.30);
    slab(rear,.33,.34,.080,.045,silver);slab(rear,.30,.31,.004,.035,black,[0,0,.042]);
    for(const xx of [-.139,.139])for(const yy of [-.143,.143])screw(rear,xx,yy,.045);
    disc(rear,.122,.008,black,[0,0,-.044]);disc(rear,.092,.001,glass,[0,0,-.049]);
    disc(rear,.105,.008,black,[0,0,.048]);disc(rear,.070,.003,glass,[0,0,.054]);
    ribbon(rear,[[0,-.1,.046],[0,-.24,.046],[-.08,-.24,.046]],.045);connector(rear,-.08,-.24,.050,.09);
  }
  for(const [cameraIndex,id]of ['optics','optics-mid','optics-inner'].entries()){
    const [x,y]=cameraCenters[cameraIndex];
    const optics=part(id,[x,y,-.062],[0,0,0],.35);
    optics.userData.unbatched=true;optics.userData.localMotions=[];
    for(let i=0;i<3;i++){
      const lens=disc(optics,.078-i*.008,.001,glass,[0,0,-i*.003]);
      const rim=mesh(optics,new T.TorusGeometry(.078-i*.008,.002,4,32),silver,[0,0,-i*.003]);
      for(const o of [lens,rim])optics.userData.localMotions.push({object:o,base:o.position.clone(),offset:new T.Vector3(0,0,-i*.20)});
    }
  }
  // A shallow exterior plateau with dark, planar sapphire-like windows.
  const cover=part('camera-cover',[0,1.02,-.0935],[0,0,-1.2],0);
  slab(cover,1.30,.91,.012,.16,burgundy);
  for(const [x,y]of [[.38,.11],[.38,-.29],[0,-.09]]){
    disc(cover,.169,.004,edge,[x,y,-.009]);
    disc(cover,.157,.003,black,[x,y,-.0135]);
    disc(cover,.145,.001,glass,[x,y,-.0155]);
    disc(cover,.061,.0008,black,[x,y,-.0164]);
    disc(cover,.035,.0007,glass,[x,y,-.0172]);
    disc(cover,.013,.0004,mat('#4b6a80',.35,.17),[x-.012,y+.014,-.0178]);
    const coating=mesh(cover,new T.TorusGeometry(.093,.0014,4,32),mat('#263c49',.4,.23),[x,y,-.0162]);
  }
  disc(cover,.052,.001,mat('#c8c6bb',.05,.55),[-.43,.15,-.0066]);
  disc(cover,.045,.001,black,[-.43,-.20,-.0066]);
  disc(cover,.009,.001,black,[-.43,-.07,-.0066]);
  const front=part('front',[.12,1.34,.015],[.27,.43,1.16],.20);
  slab(front,.18,.12,.06,.025,silver);disc(front,.043,.005,glass,[0,0,.033]);connector(front,-.13,0,0,.08);
  const faceid=part('faceid',[-.12,1.34,.015],[-.27,.43,1.16],.20);
  slab(faceid,.25,.10,.045,.02,black);for(const x of [-.075,.075])disc(faceid,.027,.003,glass,[x,0,.024]);

  function speaker(id,x,y,w,h,offset){const g=part(id,[x,y,-.003],offset,.28);slab(g,w,h,.075,.035,black);slab(g,w*.68,h*.55,.004,.02,graphite,[0,0,.039]);for(let i=0;i<9;i++)slab(g,.014,h*.38,.001,.003,silver,[-w*.30+i*w*.075,0,.042]);screw(g,-w*.4,0,.04);screw(g,w*.4,0,.04);return g;}
  speaker('speakers',-.40,-1.26,.44,.26,[-.42,-.32,.70]);
  speaker('top-speaker',-.41,1.36,.35,.10,[-.45,.43,1.30]);
  const taptic=part('taptic',[.34,-1.26,-.003],[.42,-.32,.70],.28);
  slab(taptic,.42,.21,.078,.028,silver);slab(taptic,.36,.16,.002,.015,graphite,[0,0,.040]);label(taptic,'TAPTIC',.27,.07,[0,0,.0415]);screw(taptic,-.18,0,.043);screw(taptic,.18,0,.043);
  const usb=part('usb',[0,-1.445,-.003],[0,-.45,.40],.32);
  const socket=ring(usb,.19,.064,.028,.009,.075,silver);socket.rotation.x=Math.PI/2;
  slab(usb,.12,.06,.009,.004,black,[0,0,0]);
  for(let i=0;i<12;i++)slab(usb,.005,.044,.001,.001,copper,[-.05+i*.009,0,.005]);
  ribbon(usb,[[0,.04,.02],[0,.15,.02],[.19,.15,.02],[.19,.28,.02]],.05);
  // Dark aperture on the exterior bottom surface (not a second floating port).
  const aperture=slab(chassis,.198,.066,.0004,.029,black,[0,-H/2-.0002,-.003]);aperture.rotation.x=Math.PI/2;
  for(const x of [-.48,-.42,-.36,-.30,.30,.36,.42,.48]){const o=disc(chassis,.011,.0005,black,[x,-H/2-.0003,-.003]);o.rotation.x=0;}
  const mic=part('microphone',[.24,-1.445,-.004],[.38,-.53,.2],.32);
  slab(mic,.10,.07,.036,.015,silver);disc(mic,.013,.001,black,[0,0,.019]);ribbon(mic,[[0,0,-.02],[.10,0,-.02],[.10,.10,-.02]],.025);

  const coil=part('coil',[0,-.4,-.065],[0,0,-.50],.22);
  disc(coil,.48,.005,graphite,[0,0,0]);
  for(let i=0;i<24;i++)mesh(coil,new T.TorusGeometry(.14+i*.012,.0035,4,64),copper,[0,0,.006]);
  for(let i=0;i<16;i++){const a=i*Math.PI/8,o=slab(coil,.055,.13,.004,.008,silver,[Math.sin(a)*.449,Math.cos(a)*.449,.005]);o.rotation.z=-a;}
  ribbon(coil,[[.12,.43,0],[.12,.71,0],[.3,.71,0]],.05);
  const antenna=part('antenna',[.53,1.35,-.015],[.40,.40,.4],.32);
  slab(antenna,.20,.08,.03,.018,black);for(let i=0;i<5;i++)slab(antenna,.012,.05,.001,.002,copper,[-.065+i*.032,0,.016]);
  const flex=part('flex',[0,0,.040],[0,0,.85],.25);
  ribbon(flex,[[-.58,.24,0],[-.58,-.4,0],[-.32,-.4,0]],.045);
  ribbon(flex,[[.23,.31,0],[.48,.31,0],[.48,.48,0]],.045);
  for(const [x,y]of [[-.58,.24],[-.32,-.4],[.23,.31],[.48,.48]])connector(flex,x,y,.006);
  const cowlings=part('cowlings',[0,0,.054],[0,0,1.65],.12);
  for(const [x,y,w,h]of [[-.58,.24,.13,.09],[.23,.31,.17,.09],[.16,-1.05,.12,.07]]){slab(cowlings,w,h,.004,.009,silver,[x,y,0]);screw(cowlings,x-w*.34,y,.006);}
  const fasteners=part('fasteners',[0,0,.047],[0,0,1.85],.04);
  for(const x of [-.65,.65])for(const y of [-1.2,-.7,0,.65,1.2]){
    screw(fasteners,x,y,0);slab(chassis,.036,.058,.06,.009,silver,[x,y,-.025]);
    slab(fasteners,.018,.045,.003,.004,copper,[x,y+.035,0]);
  }
  const rearShield=part('rear-shield',[0,0,-.073],[0,0,0],.12);
  ring(rearShield,1.31,2.85,.17,.07,.003,silver);
  for(const x of [-.53,.53])slab(rearShield,.12,2.38,.003,.025,silver,[x,0,0]);
  for(const y of [-1.1,.32])slab(rearShield,1.12,.12,.003,.025,silver,[0,y,0]);
  const graphiteLayer=part('graphite',[0,-.4,-.069],[0,0,0],.18);
  ring(graphiteLayer,1.18,1.72,.10,.085,.002,graphite);
  const brackets=part('brackets',[0,0,.049],[0,0,0],.24);
  for(const x of [-.62,.62])for(const y of [-.9,-.2,.65]){
    ring(brackets,.08,.28,.02,.013,.004,silver,[x,y,0]);
    disc(brackets,.012,.002,black,[x,y+.10,.003]);
  }
  // Exploded layout follows the reference's readable left-to-right layers.
  // The final locations are presentation coordinates, not a repair sequence.
  const layout={
    display:[-.55,0,2.5],oled:[-.40,0,1.95],'display-shield':[-.25,0,1.4],'display-seal':[0,0,.8],
    chassis:[0,0,0],brackets:[-.12,0,-.4],board:[.65,-.03,-.85],processor:[.65,-.03,-.45],shields:[.28,0,-.1],
    battery:[.65,-.04,-1.45],vapor:[.65,-.04,-1.45],rear:[.27,.60,-1.45],'rear-wide':[.27,.45,-1.45],'rear-tele':[.65,-.30,-1.45],
    optics:[.27,.60,-1.95],'optics-mid':[.27,.45,-1.95],'optics-inner':[.65,-.30,-1.95],coil:[.8,-.12,-2.25],graphite:[.85,0,-2.65],'rear-shield':[1,0,-3.10],
    'back-seal':[1,0,-3.60],back:[1,0,-4.1],'camera-cover':[1,0,-4.1],
    front:[-.35,.45,1.1],faceid:[-.45,.45,1.65],'top-speaker':[-.25,.45,2.2],antenna:[.35,.45,0],
    speakers:[-.25,-.38,-.6],taptic:[.20,-.38,-1.45],usb:[0,-.48,-1.8],microphone:[.38,-.48,-2.2],
    flex:[-.2,-.10,-1.1],cowlings:[-.55,.20,.40],fasteners:[0,-.28,.55]
  };
  for(const [id,g]of parts){g.userData.offset.set(...layout[id]);}
  for(const g of parts.values())g.traverse(o=>{if(o.isMesh)o.userData.part=g.name;});
  // Static sub-meshes with the same material are batched per selectable part.
  // Main components remain independent groups with their own raycast identity.
  let sourceMeshes=0;
  for(const g of parts.values()){
    if(g.userData.unbatched){sourceMeshes+=g.children.length;continue;}
    const batches=new Map();
    for(const o of [...g.children]){
      if(!o.isMesh)continue;sourceMeshes++;o.updateMatrix();
      const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();geo.applyMatrix4(o.matrix);
      if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material).push(geo);
      o.geometry.dispose();g.remove(o);
    }
    for(const [material,geometries]of batches){
      const combined=new T.BufferGeometry();
      for(const [name,size]of [['position',3],['normal',3],['uv',2]]){
        const array=new Float32Array(geometries.reduce((n,geo)=>n+geo.attributes[name].array.length,0));let at=0;
        for(const geo of geometries){array.set(geo.attributes[name].array,at);at+=geo.attributes[name].array.length;}
        combined.setAttribute(name,new T.BufferAttribute(array,size));
      }
      combined.computeBoundingSphere();combined.computeBoundingBox();
      const o=new T.Mesh(combined,material);o.userData.part=g.name;o.castShadow=true;o.receiveShadow=true;g.add(o);
      geometries.forEach(geo=>geo.dispose());
    }
  }
  root.userData.sourceMeshes=sourceMeshes;
  root.userData.materials=[...materials.values()];
  return {root,parts};
}

// Reversible staged translation. No incremental transforms or floating-point drift.
export function setExplosion(parts,progress){
  const p=Math.max(0,Math.min(1,progress));
  for(const g of parts.values()){
    const t=Math.max(0,Math.min(1,(p-g.userData.stage)/.60));
    const eased=t*t*(3-2*t);
    g.position.copy(g.userData.base).addScaledVector(g.userData.offset,eased);
    for(const m of g.userData.localMotions||[])m.object.position.copy(m.base).addScaledVector(m.offset,eased);
  }
}
