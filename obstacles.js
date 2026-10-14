// Additional course mechanics. Positions are shared by rendering, AI and collision.
'use strict';
const hammers=[],pushers=[],belts=[],pads=[];
function configureObstacles(maps){
 const layouts=[
  {h:[29],p:[52],b:[107],j:[10]},
  {h:[31,124,210],p:[59,179,262],b:[78,228],j:[10,150]},
  {h:[31,110,210,310,410],p:[59,172,273,372,461],b:[78,159,260,360],j:[10,150,300]}
 ];
 maps.forEach((m,i)=>{m.hazards=layouts[i];const replaced=new Set([...layouts[i].h,...layouts[i].p,...layouts[i].b]);m.gates=m.gates.filter(([z])=>!replaced.has(z));m.spinners=m.spinners.filter(([z])=>!replaced.has(z));});
 maps[0].description='Làm quen với búa lắc, khối đẩy và đệm bật xanh.';
 maps[1].description='Búa đung đưa xen kẽ băng chuyền ngược giữa hoàng hôn.';
 maps[2].description='Sáu cơ chế phối hợp trên hành trình 480 mét cực quang.';
}
function buildHazards(){
 hammers.length=pushers.length=belts.length=pads.length=0;
 activeMap.hazards.h.forEach((z,i)=>{
  for(const x of [-7.6,7.6])box(.35,7,.4,'#8a79ad',x,3.5,z);
  box(15.5,.4,.5,'#8a79ad',0,7,z);
  const pivot=new THREE.Group();pivot.position.set(0,6.8,z);course.add(pivot);
  box(.22,4.8,.22,'#f9e6bd',0,-2.4,0,pivot);
  ball(1.25,'#f19b4a',0,-5,0,pivot);
  box(.2,.25,1.8,'#fff2c8',0,-5,-.6,pivot);
  hammers.push({pivot,z,phase:i*1.4,x:0,y:1.8,vx:0});
 });
 activeMap.hazards.p.forEach((z,i)=>{
  const side=i%2?-1:1;
  box(.8,2.8,2.4,'#536d92',side*8.1,1.4,z);
  const mesh=box(1,1.7,1.8,'#f67572',0,.96,z);
  const light=ball(.22,'#ffcf65',side*7.9,3,z);
  pushers.push({mesh,light,z,side,phase:i*1.6,x:side*7.5,width:1,extension:0});
 });
 activeMap.hazards.b.forEach((z,i)=>{
  const direction=i%2?1:-1;
  box(9,.09,7,'#527eaa',0,.14,z);
  const marks=[];for(let j=0;j<7;j++)marks.push(box(8.6,.02,.16,'#b6e6ed',0,.195,z-3+j));
  // White chevrons point in the physical belt direction.
  for(const x of [-2,2]){const a=box(.15,.03,1,'#ffffff',x-.24,.21,z);a.rotation.y=-direction*.55;const b=box(.15,.03,1,'#ffffff',x+.24,.21,z);b.rotation.y=direction*.55;}
  belts.push({z,direction,marks});
 });
 activeMap.hazards.j.forEach(z=>{
  const x=-4;
  box(2.5,.12,2.5,'#36a98e',x,.12,z);
  const top=box(2.1,.08,2.1,'#83efd0',x,.22,z);
  box(.24,.02,1.3,'#ffffff',x,.27,z);box(1.3,.02,.24,'#ffffff',x,.27,z);
  pads.push({x,z,top});
 });
}
function animateHazards(){
 hammers.forEach(h=>{const phase=simTime*1.65+h.phase,a=Math.sin(phase)*1.08,da=Math.cos(phase)*1.782;h.pivot.rotation.z=a;h.x=5*Math.sin(a);h.y=6.8-5*Math.cos(a);h.vx=5*Math.cos(a)*da;});
 pushers.forEach(p=>{p.extension=(Math.sin(simTime*1.5+p.phase)+1)*.5;p.width=.8+p.extension*5.3;p.x=p.side*(8-p.width/2);p.mesh.position.x=p.x;p.mesh.scale.x=p.width;p.light.scale.setScalar(.8+p.extension*.5);});
 belts.forEach(b=>b.marks.forEach((m,i)=>m.position.z=b.z-3.5+((i+simTime*b.direction*2)%7+7)%7));
 pads.forEach(p=>p.top.scale.set(1,1+Math.sin(simTime*4)*.2,1));
}
function applyHazards(r,dt){
 r.padCooldown=Math.max(0,(r.padCooldown||0)-dt);
 for(const h of hammers){
  const dx=r.x-h.x,dy=r.y+.85-h.y,dz=r.z-h.z,d=Math.hypot(dx,dy,dz);
  if(d<1.65&&r.y>-.5){
   const nx=d>.001?dx/d:Math.sign(h.vx)||1,nz=d>.001?dz/d:0;
   const overlap=1.65-d;r.x+=nx*overlap;r.z+=nz*overlap;
   if(r.hit<=0){r.vx=nx*8+h.vx*.7;r.vz=nz*9;r.vy=5;r.ground=false;r.hit=.5;if(r===player){beep(130,.12);toast('BÚA LẮC · Né đầu búa hoặc chờ nó vung lên!');}}
  }
 }
 for(const p of pushers){
  const dx=r.x-p.x,dz=r.z-p.z,hx=p.width/2+.43,hz=1.33;
  if(Math.abs(dx)<hx&&Math.abs(dz)<hz&&r.y<1.85&&r.y>-.8){
   if(hx-Math.abs(dx)<hz-Math.abs(dz)){r.x=p.x+Math.sign(dx||-p.side)*(hx+.01);r.vx=-p.side*10;}
   else{r.z=p.z+Math.sign(dz||-1)*(hz+.01);r.vz=Math.sign(dz||-1)*5;}
   r.hit=.3;
  }
 }
 if(r.ground){
  for(const b of belts)if(Math.abs(r.x)<4.5&&Math.abs(r.z-b.z)<3.5)r.z+=b.direction*3.5*dt;
  for(const p of pads)if(Math.abs(r.x-p.x)<1.2&&Math.abs(r.z-p.z)<1.2&&r.padCooldown===0){r.vy=12;r.ground=false;r.padCooldown=1.2;if(r===player){beep(920,.15);toast('ĐỆM BẬT · Giữ hướng để điều khiển khi bay!');}}
 }
}
function hazardAILane(r,target){
 const p=pushers.find(p=>p.z-r.z>0&&p.z-r.z<9);if(p)target=-p.side*5.4;
 const h=hammers.find(h=>h.z-r.z>0&&h.z-r.z<9);if(h)target=r.lane>=0?6.2:-6.2;
 return target;
}
