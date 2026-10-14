// Headless logic checks using the bundled Three.js; no packages required.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const THREE={...require('./vendor/three.min.js')};
THREE.WebGLRenderer=class{constructor(){this.shadowMap={}}setPixelRatio(){}setSize(){}render(){}};
const elements=new Map();const element=()=>({hidden:false,style:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},getContext(){return {fillText(){}}}});
const sandbox={THREE,assert,console,performance:{now:()=>0},document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},createElement:element,querySelectorAll:()=>[],body:element(),addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},innerWidth:1280,innerHeight:720,devicePixelRatio:1,requestAnimationFrame(){},addEventListener(){},matchMedia:()=>({matches:false})};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/obstacles.js','utf8')+'\n'+fs.readFileSync(__dirname+'/game.js','utf8')+`
assert.equal(racers.length,12);
start();for(let i=0;i<450;i++)step(1/120);assert.equal(state,'race');
pause();assert.equal(state,'paused');pause();assert.equal(state,'race');
reset();state='race';keys.add('KeyD');physics(player,1/120);assert.ok(player.x < -3,'Right key moves toward screen-right');keys.clear();
Object.assign(player,{x:0,z:37,y:.12,vx:0,vz:8.8,vy:0,ground:true});keys.add('KeyW');jump(player);for(let i=0;i<95;i++)physics(player,1/120);assert.ok(player.z>42&&player.y>=.1,'Jump clears first gap');keys.clear();
Object.assign(player,{x:12,y:-13,z:55,checkpoint:43});physics(player,1/120);assert.equal(player.z,43);assert.equal(player.falls,1);
Object.assign(player,{x:0,y:.12,z:131.99,vz:8.8,ground:true});keys.add('KeyW');physics(player,1/120);assert.equal(state,'result');assert.ok(player.finished);
start();state='race';elapsed=119.999;step(1/120);assert.equal(state,'result');assert.equal(elapsed,120);
start();state='race';for(let i=0;i<3600;i++)step(1/120);assert.ok(racers.slice(1).every(r=>Number.isFinite(r.x)&&Number.isFinite(r.y)&&Number.isFinite(r.z)));assert.ok(racers.some(r=>r!==player&&r.z>43),'AI passes first checkpoint');
for(const map of maps){
 goHome();selectMap(map.id);assert.equal(activeMap.id,map.id);assert.equal(checkpoints.length,platforms.length-1);
 const childCount=course.children.length;selectMap(map.id);assert.equal(course.children.length,childCount,'Map switching does not accumulate scene objects');
 for(let i=0;i<platforms.length-1;i++){
  reset();state='race';const edge=platforms[i].b;
  Object.assign(player,{x:0,z:edge-2,y:.12,vx:0,vz:8.8,vy:0,ground:true});keys.add('KeyW');jump(player);
  for(let t=0;t<100;t++)physics(player,1/120);
  assert.ok(player.z>platforms[i+1].a&&player.y>=.1,'Every gap is jumpable: '+map.id+' '+i);
 }
 reset();state='race';Object.assign(player,{x:0,z:map.length-.01,y:.12,vz:8.8,ground:true});keys.add('KeyW');physics(player,1/120);assert.ok(player.finished);assert.equal(state,'result');
 start();state='race';elapsed=map.time-.001;step(1/120);assert.equal(elapsed,map.time);assert.equal(state,'result');
 start();state='race';for(let t=0;t<Math.min(map.time-1,160)*120;t++)step(1/120);
 assert.ok(racers.slice(1).some(r=>r.finished),'At least one AI completes '+map.id);
 assert.ok(racers.every(r=>Number.isFinite(r.x)&&Number.isFinite(r.y)&&Number.isFinite(r.z)));
 console.log('PASS map:',map.name,'length:',map.length,'AI finishers:',racers.filter(r=>r.finished).length);
}
goHome();selectMap('skyline');start();state='race';updateObstacles();
reset();Object.assign(player,{x:pads[0].x,z:pads[0].z,y:.12,ground:true});applyHazards(player,1/120);assert.equal(player.vy,12);assert.equal(player.ground,false);
reset();Object.assign(player,{x:0,z:belts[0].z,y:.12,ground:true});const before=player.z;applyHazards(player,1/120);assert.ok(player.z<before,'Reverse conveyor carries grounded racers');
player.ground=false;const airborne=player.z;applyHazards(player,1/120);assert.equal(player.z,airborne,'Conveyor does not move airborne racers');
reset();const hammer=hammers[0];Object.assign(player,{x:hammer.x+.3,z:hammer.z,y:hammer.y-.85,ground:true});applyHazards(player,1/120);assert.ok(player.hit>0&&player.vy>0,'Hammer knocks racer upward');
reset();const piston=pushers[0];Object.assign(player,{x:piston.x,z:piston.z,y:.12,ground:true});applyHazards(player,1/120);assert.ok(Math.abs(player.z-piston.z)>1.33||Math.abs(player.x-piston.x)>piston.width/2+.43,'Pusher resolves overlap');
console.log('PASS: new obstacle collision, boost and conveyor behavior');
console.log('PASS: race start, pause/resume, controls, gap jump, respawn, finish, timeout, AI simulation.');
`,sandbox);
