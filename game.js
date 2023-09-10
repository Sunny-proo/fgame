const canvas=document.querySelector("#canvas");
canvas.width=innerWidth;
canvas.style.background="rgba(0,0,0,0.9)"
canvas.height=innerHeight;
const context=canvas.getContext("2d");
function player(){
    context.beginPath();
    context.arc(canvas.width/2,canvas.height/2,15,0,2*Math.PI);
    context.fillStyle="white";
    context.fill()
}

player()
class projectile{
    constructor(x,y,r,sx,sy){
        this.r=r;
        this.x=x;
        this.y=y;
        this.sx=sx;
       this.sy=sy;

        
    }
    
    draw(){ 

    context.beginPath();
    context.arc(this.x,this.y,this.r,0,2*Math.PI);
        context.fillStyle="white";
        context.fill();
    
   
    }
    update(){
        
        
        player();
        this.draw();
        this.x+=this.sx;
        this.y+=this.sy;
        
}}
class Enemy{
    constructor(x,y,r,color,sx,sy){
        this.x=x;
        this.y=y;
        this.r=r;
        // this.vel=velo
        this.sx=sx;
        this.sy=sy;
       this.color=color;
       

        
    }
    
    draw(){ 
    context.beginPath();
    context.arc(this.x,this.y,this.r,0,2*Math.PI);
        context.fillStyle=this.color;
        context.fill();
    
   
    }
    update(){
        
        
       
        this.draw();
        this.x+=this.sx;
        this.y+=this.sy;
        
}}
part=[];
let fric=0.99;
class Particle{
    constructor(x,y,r,color,sx,sy){
        this.x=x;
        this.y=y;
        this.r=r;
        // this.vel=velo
        this.alpha=1;
        this.sx=sx;
        this.sy=sy;
       this.color=color;
       

        
    }
    
    draw(){ 
        context.save();
        context.globalAlpha=this.alpha;
    context.beginPath();
    context.arc(this.x,this.y,this.r,0,2*Math.PI);
        context.fillStyle=this.color;
        context.fill();
    
   context.restore();
    }
    update(){

        this.draw();
        this.sx*=fric;
        this.sy*=fric;
        this.alpha-=0.01
        this.x+=this.sx;
        this.y+=this.sy;
        
}}
              

Enemies=[];
let projects=new projectile();
const prj=[];
function spawnEnemies(){
    
    setInterval(()=>{
        let a,b;
        const r=Math.floor(Math.random()*30+10)
        if(Math.random()<0.5){
       
         a=Math.random()<0.5 ? 0-r :canvas.width+r
         b=Math.random()*canvas.height
        }else{
            b=Math.random()<0.5 ? 0-r :canvas.height+r
         a=Math.random()*canvas.width
        }
    let color=`hsl(${Math.random()*360},50%,50%)`
    const angle=Math.atan2(canvas.height/2-b,canvas.width/2-a);
    
     const vel={
        lx:Math.cos(angle),
        ly:Math.sin(angle)
     }

        Enemies.push(new Enemy(a,b,r,color,vel.lx,vel.ly))
    },1000);
}
let aid;
 let updaterec=function(){
    
    context.fillStyle='rgba(0,0,0,0.1)'
    context.fillRect(0,0,canvas.width,canvas.height)
    
    aid=requestAnimationFrame(updaterec);
    player()
      for(p of part){
          p.update()
        if(p.alpha<=0){
            part.splice(part.indexOf(p),1);
        }}
   for(pr of prj){

    pr.update();
    if(pr.x-pr.r<0 ){
        let idx2=prj.indexOf(pr)
        setTimeout(()=>{
           
       prj.splice(idx2,1),0
        })
    }
    
   }
   for(e of Enemies){
    e.update();
    let dist=Math.hypot(canvas.width/2-e.x,canvas.height/2-e.y);
    if(dist<e.r+20){
        cancelAnimationFrame(aid);
    }
    for(p of prj){
        let dist=Math.hypot(p.x-e.x,p.y-e.y);
            if(dist<e.r+p.r){
            for(let i=0;i<e.r*2;i++){
                part.push(new Particle(p.x,p.y,Math.random()*3,e.color,(Math.random()-0.5)*(Math.random()*6),(Math.random()-0.5)*(Math.random()*6)))
            }
            let idx=Enemies.indexOf(e);
           
            let idx2=prj.indexOf(p)
                 if(e.r-10>10){
                gsap.to(e,{r:e.r-10})
                
                setTimeout(()=>{
               prj.splice(idx2,1),0
                })}else{
            setTimeout(()=>{
                Enemies.splice(idx,1)
           prj.splice(idx2,1),0
            })}
           
        }
    }
   }
}

 canvas.addEventListener("click",(event)=>{
     
      console.log(prj)
     const angle=Math.atan2(event.clientY-canvas.height/2,event.clientX-canvas.width/2);
     
     const speed={
        x:Math.cos(angle),
        y:Math.sin(angle)
     }
     
     
    prj.push(new projectile(canvas.width/2,canvas.height/2,5,speed.x*5,speed.y*5))
    
    
 });
 updaterec();
 spawnEnemies();
