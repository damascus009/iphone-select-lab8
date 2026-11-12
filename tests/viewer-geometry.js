import * as T from 'three';
import {createPhone,setExplosion,componentInfo,modelDimensions} from '../viewer-model.js?v=studio-2';
const lines=[];
function check(condition,message){if(!condition)throw Error(message);lines.push('PASS '+message);}
try{
  const {root,parts}=createPhone(T);
  check(parts.size===34&&componentInfo.length===34,'34 selectable groups, including explicitly schematic layers');
  const base=new Map([...parts].map(([id,g])=>[id,g.position.clone()]));
  for(let cycle=0;cycle<20;cycle++){
    for(const t of [.0,.17,.35,.83,1,.63,.28,0])setExplosion(parts,t);
    for(const g of parts.values())for(const m of g.userData.localMotions||[])check(m.object.position.distanceTo(m.base)===0,'cycle '+cycle+': optical layer return');
    for(const [id,g]of parts)check(g.position.distanceTo(base.get(id))===0,`cycle ${cycle+1}: exact return ${id}`);
  }
  for(const t of [0,.1,.3,.6,1]){
    setExplosion(parts,t);
    const difference=parts.get('vapor').position.clone().sub(parts.get('battery').position);
    check(difference.distanceTo(base.get('vapor').clone().sub(base.get('battery')))<1e-12,'battery / vapor attachment retained at '+t);
  }
  let triangles=0,meshes=0;
  root.traverse(o=>{if(!o.isMesh)return;meshes++;const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;triangles+=(o.geometry.index?.count||p.count)/3;
    for(let i=0;i<p.count;i++){if(!Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)))throw Error('Invalid vertex');const length=Math.hypot(n.getX(i),n.getY(i),n.getZ(i));if(Math.abs(length-1)>1e-4)throw Error('Invalid normal');}
  });
  check(triangles<220000,'triangle budget: '+triangles);check(meshes<180,'batched mesh budget: '+meshes+' from '+root.userData.sourceMeshes);
  setExplosion(parts,0);root.updateMatrixWorld(true);
  const frame=new T.Box3().setFromObject(parts.get('chassis'));
  check(Math.abs(modelDimensions.width/modelDimensions.height-71.9/150)<1e-12,'Apple width / height ratio');
  check(Math.abs(modelDimensions.depth/modelDimensions.height-8.75/150)<1e-12,'Apple depth / height ratio');
  const shell=[...parts.get('chassis').children,...parts.get('back').children,...parts.get('display').children];
  for(const z of [-.0874,-.0825,-.0775,-.05,0,.05,.0675,.0735,.0835,.0874]){
    for(const sign of [-1,1]){
      const ray=new T.Raycaster(new T.Vector3(sign*2,0,z),new T.Vector3(-sign,0,0));
      const hit=ray.intersectObjects(shell,false)[0];
      check(hit&&Math.abs(hit.point.x)>modelDimensions.width/2-.01,`closed side wall z=${z} side=${sign}`);
    }
  }
  // Board and battery occupy disjoint primary volumes (not just a hidden overlap).
  const a=new T.Box3().setFromObject(parts.get('battery')),b=new T.Box3().setFromObject(parts.get('board'));
  check(!a.intersectsBox(b),'battery and logic board do not intersect');
  // Presentation layers must be separated at their final positions.
  setExplosion(parts,1);root.updateMatrixWorld(true);
  const layers=['display','oled','display-shield','display-seal','chassis','board','battery','coil','graphite','rear-shield','back-seal','back','rear','rear-wide','rear-tele'];
  for(let i=0;i<layers.length;i++)for(let j=i+1;j<layers.length;j++){
    const boxA=new T.Box3().setFromObject(parts.get(layers[i])),boxB=new T.Box3().setFromObject(parts.get(layers[j]));
    check(!boxA.intersectsBox(boxB),'exploded separation '+layers[i]+' / '+layers[j]);
  }
  document.querySelector('#results').textContent=lines.filter(l=>!l.includes('cycle')).join('\n')+'\nPASS 20 teardown/reassembly cycles (680 exact position checks)\nALL CHECKS PASSED';
}catch(e){document.querySelector('#results').textContent=lines.slice(-5).join('\n')+'\nFAIL '+e.message;console.error(e);}
