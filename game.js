/* Cloud Dash — standalone Three.js game. World units: metres, fixed simulation: 120 Hz. */
'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const maps=[
 {id:'skyline',name:'Skyline Circuit',length:132,time:120,sky:'#c2e5e9',floor:'#f4d49c',edge:'#6597bc',label:'Khởi động',description:'Đường đua kinh điển giữa những đám mây.',segments:[[-10,39],[42,83],[86,112],[115,140]],gates:[[18,0],[29,2],[98,1.1],[107,3]],spinners:[[52,0],[68,2]]},
 {id:'sunset',name:'Sunset Marathon',length:300,time:210,sky:'#efc9bb',floor:'#f2c8a2',edge:'#b77c99',label:'Đường dài',description:'300 mét hoàng hôn, cổng đôi và những cụm thanh xoay.',segments:[[-10,44],[47,94],[97,144],[147,194],[197,244],[247,308]],gates:[[18,0],[31,2],[109,1],[124,3],[210,2],[228,0]],spinners:[[59,1],[78,3],[160,0],[179,2],[262,1],[281,3]]},
 {id:'aurora',name:'Aurora Expedition',length:480,time:300,sky:'#b9c9e8',floor:'#d0e9e9',edge:'#827fac',label:'Siêu thử thách',description:'480 mét cực quang với 10 đảo và thử thách phối hợp.',segments:[[-10,44],[47,94],[97,144],[147,194],[197,244],[247,294],[297,344],[347,394],[397,444],[447,488]],gates:[[18,0],[31,2],[110,1],[172,3],[210,0],[273,2],[310,1],[372,3],[410,2],[461,0]],spinners:[[59,1],[78,3],[127,0],[159,2],[227,1],[260,3],[327,2],[360,0],[427,1],[472,3]]}
];
configureObstacles(maps);
let activeMap=maps[0],savedBest=null;
const bestKey=()=> 'cloudDashBest:v2:'+activeMap.id;
const showBest=()=>{$('best').textContent=savedBest?`${savedBest.toFixed(2)} giây`:'Chưa có lượt đua'};
function loadBest(){savedBest=null;try{savedBest=Number(localStorage.getItem(bestKey()))||null}catch{}showBest()}
loadBest();
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('world'),antialias:true,alpha:false,powerPreference:'high-performance'});}catch(e){$('error').hidden=false;throw e}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color('#c2e5e9');scene.fog=new THREE.Fog('#c2e5e9',65,220);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,300);
scene.add(new THREE.HemisphereLight(0xffffff,0x6ba3ae,2.5));
const sun=new THREE.DirectionalLight(0xfff8dc,3);sun.position.set(-25,55,-15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-55,right:55,top:90,bottom:-90,near:1,far:180});sun.shadow.bias=-.0007;scene.add(sun);scene.add(sun.target);
const course=new THREE.Group();scene.add(course);
const materials={};function mat(color){return materials[color]||(materials[color]=new THREE.MeshStandardMaterial({color,roughness:.72}))}
function box(w,h,d,color,x,y,z,parent=course){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=true;parent.add(o);return o}
function ball(r,color,x,y,z,parent=course,sx=1,sy=1,sz=1){const o=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),mat(color));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;parent.add(o);return o}
let platforms=[],checkpoints=[];
const gates=[],spinners=[];
function buildCourse(){
 course.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material?.map){o.material.map.dispose();o.material.dispose()}});course.clear();
 platforms=activeMap.segments.map(([a,b])=>({a,b}));checkpoints=platforms.slice(1).map(p=>p.a+1);gates.length=0;spinners.length=0;
 scene.background.set(activeMap.sky);scene.fog.color.set(activeMap.sky);

platforms.forEach((p,i)=>{const len=p.b-p.a,z=(p.a+p.b)/2;box(17,1.3,len,activeMap.edge,0,-.72,z);box(16.8,.18,len,activeMap.floor,0,0,z);for(const x of [-8.15,8.15]){box(.4,.18,len,'#fff4d7',x,.15,z);for(let zz=p.a+1;zz<p.b;zz+=3.5)box(.42,.03,1.1,'#f19f71',x,.26,zz)}
for(let zz=p.a+4;zz<p.b;zz+=8){const arrow=new THREE.Shape();arrow.moveTo(-.48,-.5);arrow.lineTo(0,0);arrow.lineTo(.48,-.5);arrow.lineTo(.48,-.1);arrow.lineTo(0,.4);arrow.lineTo(-.48,-.1);const mesh=new THREE.Mesh(new THREE.ShapeGeometry(arrow),mat('#ffffff'));mesh.rotation.x=-Math.PI/2;mesh.position.set(0,.105,zz);course.add(mesh)}
box(13,.06,.35,'#f5b653',0,.12,p.a+1);
});
// Floating islands, sculpted clouds and air balloons; no external textures.
for(let i=0;i<Math.ceil(activeMap.length/9)+8;i++){const z=i*9-25,x=(i%2?1:-1)*(17+(i*7)%25);const cloud=new THREE.Group();for(let j=0;j<4;j++)ball(2.1+j*.2,'#effbfa',j*2,Math.sin(j)*.5,0,cloud,1.7,.65,1);cloud.position.set(x,-6-(i%3)*3,z);course.add(cloud)}
for(let i=0;i<Math.ceil(activeMap.length/30);i++){const g=new THREE.Group();ball(2,i%2?'#f29c79':'#f3cf73',0,0,0,g,1,1.25,1);box(.9,.6,.8,'#bf9673',0,-3,0,g);for(const x of [-.4,.4])box(.035,1.2,.035,'#f5edd9',x,-2.2,0,g);g.position.set(i%2?26:-27,12+i%3*3,i*30-20);course.add(g)}
for(const [z,phase] of activeMap.gates){const m=box(5.4,2.6,1.05,'#f58b88',0,1.4,z);box(5.5,.25,1.15,'#fff2d1',0,1.15,0,m);gates.push({mesh:m,z,phase,x:0});for(const x of [-7.8,7.8]){box(.3,3.4,.3,'#72b7b0',x,1.8,z);ball(.4,'#fff0bb',x,3.65,z)}}
for(const [z,phase] of activeMap.spinners){const root=new THREE.Group();root.position.set(0,0,z);course.add(root);const bar=box(14,.55,.65,'#e57a9c',0,.73,0,root);box(13.8,.06,.72,'#ffe9d0',0,.29,0,bar);ball(.85,'#8e80c0',0,.5,z);spinners.push({root,z,phase,angle:0});}
buildHazards();
// Finish arch, checkpoint lines and checkerboard.
for(const z of checkpoints){box(15,.035,.7,'#80c7b2',0,.12,z);for(const x of [-8,8]){box(.18,3,.18,'#f8f0d0',x,1.5,z);box(1.3,.8,.08,'#5fae9e',x+(x<0?.6:-.6),2.7,z)}}
for(const x of [-7,7]){box(.9,6,.9,'#eb835c',x,3,activeMap.length);ball(.7,'#ffe6b6',x,6,activeMap.length)}box(15,1.2,.9,'#e87959',0,6,activeMap.length);
function sign(text,w,h){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#fff8db';ctx.font='900 72px Arial';ctx.textAlign='center';ctx.fillText(text,256,90);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,side:THREE.DoubleSide}));m.rotation.y=Math.PI;m.position.set(0,6,activeMap.length-.5);course.add(m)}sign('FINISH',9,2.2);
for(let x=-7;x<7;x++)for(let z=activeMap.length-3;z<activeMap.length;z++)box(1,.03,1,(x+z)%2?'#fff7df':'#4d747c',x+.5,.14,z+.5);
}
buildCourse();
const palette=['#ffce45','#ef83a7','#8f83d4','#62cbb9','#6da9e0','#e9a170','#9cc77b','#e8a4ce','#699fc0','#bd9cde','#edbd65','#9ed9d0'];
function character(color){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.43,.52,4,12),new THREE.MeshStandardMaterial({color,roughness:.6}));body.position.y=.95;body.castShadow=true;g.add(body);const face=ball(.34,'#fff3d8',0,1.12,.32,g,1,.78,.48);for(const x of [-.12,.12])ball(.065,'#24434b',x,1.14,.48,g,.8,1.5,.65);const feet=[ball(.19,color,-.23,.23,.07,g,1,.7,1.5),ball(.19,color,.23,.23,.07,g,1,.7,1.5)];const arms=[ball(.19,color,-.5,.84,0,g,1,1.8,1),ball(.19,color,.5,.84,0,g,1,1.8,1)];scene.add(g);return {g,body,feet,arms,x:0,y:.12,z:0,vx:0,vy:0,vz:0,checkpoint:0,ground:true,finished:false,finishTime:null,falls:0,hit:0,padCooldown:0}}
const player=character(palette[0]),racers=[player];for(let i=1;i<12;i++){const r=character(palette[i]);r.speed=6.2+(i%5)*.36;r.lane=Math.sin(i*8)*5.7;r.seed=i*1.7;racers.push(r)}
const marker=new THREE.Mesh(new THREE.ConeGeometry(.22,.4,3),mat('#ffffff'));marker.rotation.z=Math.PI;scene.add(marker);
let state='lobby',previous='race',simTime=0,elapsed=0,count=3.6,acc=0,last=performance.now(),toastUntil=0,selected=palette[0],sound=false,audio=null;
const keys=new Set();let jumpQueued=false;
function beep(freq=440,len=.1){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=freq;g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+len);o.start();o.stop(audio.currentTime+len)}catch{}}
function toast(s){$('toast').textContent=s;$('toast').style.opacity=1;toastUntil=performance.now()+2000}
function reset(){racers.forEach((r,i)=>{Object.assign(r,{x:(i%4-1.5)*2,z:-5-Math.floor(i/4)*1.7,y:.13,vx:0,vy:0,vz:0,ground:true,checkpoint:0,finished:false,finishTime:null,falls:0,hit:0,padCooldown:0});r.g.rotation.set(0,0,0)});elapsed=0;simTime=0;keys.clear();jumpQueued=false}
function start(){reset();state='countdown';count=3.6;acc=0;$('lobby').hidden=true;$('course-card').hidden=true;$('hud').hidden=false;$('modal').hidden=true;$('touch').hidden=!matchMedia('(pointer:coarse)').matches;document.body.classList.add('playing');beep(350);camera.position.set(player.x,9,player.z-13)}
function goHome(){state='lobby';reset();$('modal').hidden=true;$('lobby').hidden=false;$('course-card').hidden=false;$('hud').hidden=true;$('touch').hidden=true;$('countdown').textContent='';document.body.classList.remove('playing')}
function pause(){if(state==='paused'){state=previous;$('modal').hidden=true;return}if(state!=='race'&&state!=='countdown')return;previous=state;state='paused';keys.clear();jumpQueued=false;$('result-label').textContent='TẠM DỪNG';$('medal').textContent='Ⅱ';$('result-title').textContent='Nghỉ lấy đà nhé.';$('result-desc').textContent='Đường đua vẫn chờ bạn ở phía trước.';$('stats').hidden=true;$('resume').hidden=false;$('modal').hidden=false}
function finish(won){state='result';$('touch').hidden=true;const place=1+racers.filter(r=>r!==player&&r.finished).length;const newBest=won&&(!savedBest||elapsed<savedBest);if(newBest){savedBest=elapsed;try{localStorage.setItem(bestKey(),String(elapsed))}catch{}showBest()}
$('result-label').textContent=newBest?'KỶ LỤC MỚI!':won?'HOÀN THÀNH ĐƯỜNG ĐUA':'HẾT THỜI GIAN';$('medal').textContent=won?'✦':'↻';$('result-title').textContent=won?(place===1?'Chạm tới đỉnh mây!':'Về đích rồi!'):'Thêm một lần nữa?';$('result-desc').textContent=won?'Mỗi cú ngã là một bước gần hơn tới đích.':`${activeMap.time} giây đã hết. Hãy canh nhịp và thử lại nhé.`;$('stats').hidden=false;$('stats').textContent=`${won?'Hạng '+place+' / 12':'Tiến độ '+Math.round(clamp(player.z/activeMap.length,0,1)*100)+'%'} · ${elapsed.toFixed(2)} giây · ${player.falls} lần rơi`;$('resume').hidden=true;$('modal').hidden=false;beep(won?880:220,.5)}
function jump(r){if(r.ground){r.vy=8.4;r.ground=false;if(r===player)beep(550,.09)}}
function groundAt(x,z){return Math.abs(x)<8.3&&platforms.some(p=>z>=p.a&&z<=p.b)}
function respawn(r){r.x=r===player?0:r.lane*.6;r.z=r.checkpoint||-3;r.y=2.5;r.vx=r.vz=r.vy=0;r.ground=false;r.padCooldown=0;r.falls++;if(r===player){toast('↻ Đứng lên nào! Trở lại điểm lưu gần nhất.');beep(190,.16)}}
function updateObstacles(){gates.forEach(g=>{g.x=Math.sin(simTime*1.65+g.phase)*5.4;g.mesh.position.x=g.x});spinners.forEach(s=>{s.angle=simTime*1.35+s.phase;s.root.rotation.y=s.angle});animateHazards()}
function physics(r,dt){if(r.finished)return;let dx=0,dz=0;
if(r===player){dx=(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)-(keys.has('KeyD')||keys.has('ArrowRight')?1:0);dz=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0);if(jumpQueued){jump(r);jumpQueued=false}const n=Math.hypot(dx,dz);if(n>1){dx/=n;dz/=n}}
else{dz=1;let target=r.lane;const upcoming=gates.find(g=>g.z-r.z>0&&g.z-r.z<8);if(upcoming)target=upcoming.x>0?-5.7:5.7;target=hazardAILane(r,target);dx=clamp((target-r.x)*.8,-1,1);if(platforms.some(p=>p.b<activeMap.length&&p.b-r.z<2.2&&p.b-r.z>0)||spinners.some(s=>Math.abs(s.z-r.z)<5&&Math.sin(simTime*3+r.seed)>.35))jump(r)}
const speed=r===player?8.8:r.speed;const steering=r.hit>0?2:11;r.vx+=(dx*speed-r.vx)*Math.min(1,dt*steering);r.vz+=(dz*speed-r.vz)*Math.min(1,dt*steering);r.hit=Math.max(0,r.hit-dt);r.x+=r.vx*dt;r.z+=r.vz*dt;const oldY=r.y;r.vy-=22*dt;r.y+=r.vy*dt;
if(groundAt(r.x,r.z)&&oldY>=.08&&r.y<=.12&&r.vy<=0){r.y=.12;r.vy=0;r.ground=true}else if(!groundAt(r.x,r.z))r.ground=false;
gates.forEach(g=>{const ox=r.x-g.x,oz=r.z-g.z;if(Math.abs(ox)<3.15&&Math.abs(oz)<.96&&r.y<2.8&&r.y>-.8){if(3.15-Math.abs(ox)<.96-Math.abs(oz)){r.x=g.x+Math.sign(ox||1)*3.16;r.vx=Math.sign(ox||1)*6}else{r.z=g.z+Math.sign(oz||-1)*.97;r.vz=Math.sign(oz||-1)*4}r.hit=.18}});
spinners.forEach(s=>{const ux=Math.cos(s.angle),uz=-Math.sin(s.angle),rx=r.x,rz=r.z-s.z,t=clamp(rx*ux+rz*uz,-7,7),cx=t*ux,cz=s.z+t*uz,ox=r.x-cx,oz=r.z-cz,dist=Math.hypot(ox,oz);if(dist<.78&&r.y<1.03&&r.y>-.4){const nx=dist>.001?ox/dist:uz,nz=dist>.001?oz/dist:-ux;r.x=cx+nx*.8;r.z=cz+nz*.8;r.vx=nx*10;r.vz=nz*10;r.vy=3.8;r.hit=.38;r.ground=false;if(r===player&&dist<.6)beep(140,.08)}});
applyHazards(r,dt);
for(const cp of checkpoints)if(r.z>cp&&r.ground&&r.checkpoint<cp){r.checkpoint=cp;if(r===player){toast('✦ Đã lưu điểm hồi sinh');beep(740,.1)}}
if(r.y<-12||r.z<-13)respawn(r);
if(r.z>=activeMap.length&&r.y>=0&&Math.abs(r.x)<8){r.finished=true;r.finishTime=elapsed;if(r===player)finish(true)}
}
function step(dt){simTime+=dt;updateObstacles();if(state==='countdown'){count-=dt;$('countdown').textContent=count>0?String(Math.ceil(count)):'';if(count<=0){state='race';toast('XUẤT PHÁT! Giữ W hoặc ↑ để tiến lên.');beep(880,.2)}return}if(state!=='race')return;elapsed+=dt;for(const r of racers){physics(r,dt);if(state==='result')break}
// Soft body separation makes collisions between racers stable without locking the pack.
for(let i=0;i<racers.length;i++)for(let j=i+1;j<racers.length;j++){const a=racers[i],b=racers[j];if(a.finished||b.finished||Math.abs(a.y-b.y)>1.2)continue;const dx=a.x-b.x,dz=a.z-b.z,d=Math.hypot(dx,dz);if(d>0&&d<.83){const push=(.83-d)*.5;a.x+=dx/d*push;b.x-=dx/d*push;a.z+=dz/d*push;b.z-=dz/d*push}}
if(elapsed>=activeMap.time&&state==='race'){elapsed=activeMap.time;finish(false)}}
function visuals(dt){for(const r of racers){r.g.position.set(r.x,r.y,r.z);const speed=Math.hypot(r.vx,r.vz);if(speed>.3&&state==='race'){r.g.rotation.y=Math.atan2(r.vx,r.vz);r.feet[0].position.z=Math.sin(simTime*15)*.17;r.feet[1].position.z=-Math.sin(simTime*15)*.17;r.arms[0].rotation.x=Math.sin(simTime*15)*.4;r.arms[1].rotation.x=-Math.sin(simTime*15)*.4}else{r.feet.forEach(f=>f.position.z=.07)}r.g.rotation.z=r.hit?Math.sin(simTime*30)*.12:0}
marker.position.set(player.x,player.y+2.3+Math.sin(simTime*3)*.1,player.z);
if(state==='lobby'){sun.position.set(-25,55,-15);sun.target.position.set(0,0,30);camera.position.set(34,33,-34);camera.lookAt(-3,0,43);simTime+=dt*.55;updateObstacles()}else{const target=new THREE.Vector3(player.x*.5,Math.max(player.y,0)+8.5,player.z-13);camera.position.lerp(target,1-Math.exp(-dt*5));camera.lookAt(player.x*.5,Math.max(0,player.y)+.8,player.z+6);sun.position.set(player.x-25,55,player.z-15);sun.target.position.set(0,0,player.z+20)}
if(state==='race'||state==='countdown'){const progress=clamp(player.z/activeMap.length,0,1);$('progress').style.width=progress*100+'%';$('progress-text').textContent=Math.floor(progress*100)+'%';$('rank').textContent=1+racers.filter(r=>r!==player&&(r.finished||r.z>player.z)).length;const remain=Math.ceil(Math.max(0,activeMap.time-elapsed));$('timer').textContent=String(Math.floor(remain/60)).padStart(2,'0')+':'+String(remain%60).padStart(2,'0');$('stage').textContent=`ĐẢO ${Math.min(platforms.length,1+platforms.filter(p=>player.z>p.b).length)} / ${platforms.length} · ${activeMap.name}`}
if(performance.now()>toastUntil)$('toast').style.opacity=0;renderer.render(scene,camera)}
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;if(state==='race'||state==='countdown'){acc+=dt;while(acc>=1/120){step(1/120);acc-=1/120;if(state==='result')break}}else acc=0;visuals(dt)}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}addEventListener('resize',resize);resize();reset();requestAnimationFrame(frame);
addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Escape'&&!e.repeat)pause();if(e.code==='Space'&&!e.repeat&&state==='race')jumpQueued=true;keys.add(e.code)});addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();if(state==='race'||state==='countdown')pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&(state==='race'||state==='countdown'))pause()});
$('start').onclick=start;$('restart').onclick=start;$('resume').onclick=pause;$('pause').onclick=pause;$('home').onclick=goHome;
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'♫':'♪';$('sound').setAttribute('aria-label',sound?'Tắt âm thanh':'Bật âm thanh');toast(sound?'Âm thanh đã bật':'Âm thanh đã tắt');beep()};
document.querySelectorAll('.swatch').forEach(b=>b.onclick=()=>{selected='#'+b.dataset.color;player.body.material.color.set(selected);player.feet.concat(player.arms).forEach(m=>{m.material=mat(selected)});document.querySelectorAll('.swatch').forEach(s=>{s.classList.toggle('selected',s===b);s.setAttribute('aria-pressed',String(s===b))})});
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key)};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.key)});$('jump').onpointerdown=e=>{e.preventDefault();if(state==='race')jumpQueued=true};

function selectMap(id){
 if(state!=='lobby')return;
 const next=maps.find(m=>m.id===id);if(!next)return;
 activeMap=next;buildCourse();reset();loadBest();updateMapUI();
}
function updateMapUI(){
 $('map-select').value=activeMap.id;
 $('map-eyebrow').textContent=activeMap.name.toUpperCase();
 $('map-tags').textContent=`↗ ${activeMap.length} mét · ${platforms.length} đảo     ◷ ${activeMap.time} giây     ♜ 12 tay đua`;
 $('map-title').textContent=activeMap.name;
 $('map-description').textContent=activeMap.description;
 $('map-difficulty').textContent=activeMap.label.toUpperCase();
 $('map-gates').textContent=`${gates.length} cổng · ${spinners.length} thanh xoay`;
 $('map-spinners').textContent=`${hammers.length} búa · ${pushers.length} khối đẩy`;
 $('map-special').textContent=`${belts.length} băng chuyền · ${pads.length} đệm bật`;
 $('map-gaps').textContent=`${platforms.length-1} khe nhảy · ${checkpoints.length} điểm lưu`;
}
$('map-select').onchange=e=>selectMap(e.target.value);
updateMapUI();
