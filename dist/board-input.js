const NS='http://www.w3.org/2000/svg';
const colors={yellow:'#e8b339',red:'#e55755',blue:'#4a95e5',green:'#58ab68'};
export function squareAt(rect,x,y){
 if(x<rect.left||y<rect.top||x>=rect.right||y>=rect.bottom)return null;
 return 'abcdefgh'[Math.floor((x-rect.left)/rect.width*8)]+(8-Math.floor((y-rect.top)/rect.height*8));
}
export function pieceArrowAllowed(piece,from,to){
 if(!piece||from===to)return true;
 const dx=to.charCodeAt(0)-from.charCodeAt(0),dy=Number(to[1])-Number(from[1]),x=Math.abs(dx),y=Math.abs(dy);
 switch(piece.type){
 case 'n':return x*y===2;
 case 'b':return x===y;
 case 'r':return x===0||y===0;
 case 'q':return x===y||x===0||y===0;
 case 'k':return Math.max(x,y)===1;
 case 'p':{const forward=piece.color==='w'?1:-1;return dy===forward&&x<=1||dx===0&&dy===2*forward&&from[1]===(piece.color==='w'?'2':'7')}
 default:return false;
 }
}
export function pieceAnnotationColor(piece,playerColor='w',circle=false){return circle||!piece?'yellow':piece.color===playerColor?'green':'red'}
export function toggleMark(marks,mark){const i=marks.findIndex(m=>m.from===mark.from&&m.to===mark.to);if(i<0)return [...marks,mark];if(marks[i].color===mark.color)return marks.filter((_,n)=>n!==i);return marks.map((m,n)=>n===i?mark:m)}
const center=s=>[s.charCodeAt(0)-97+.5,8-Number(s[1])+.5];
export function arrowPoints(from,to){
 const a=center(from),b=center(to),dx=b[0]-a[0],dy=b[1]-a[1];
 // Knight arrows bend along the longer leg, as on a chess analysis board.
 return Math.abs(dx)*Math.abs(dy)===2?[a,Math.abs(dx)>Math.abs(dy)?[b[0],a[1]]:[a[0],b[1]],b]:[a,b];
}
export function createBoardInput(){
 let marks=[],key=null,cleanup=()=>{};
 const reset=()=>{cleanup();marks=[];key=null};
 function attach(board,{position,canDrag,move,click,pieceAt=()=>null,playerColor='w'}){
  cleanup();if(key!==position){marks=[];key=position}
  const abort=new AbortController(),signal=abort.signal;let gesture=null,suppressClick=false;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 8 8');svg.setAttribute('class','board-annotations');svg.setAttribute('aria-hidden','true');board.append(svg);
  const node=(tag,attrs)=>{const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);svg.append(el);return el};
  function paint(preview){
   svg.replaceChildren();for(const m of [...marks,...(preview?[preview]:[])]){
    const color=colors[m.color],a=center(m.from);
    if(m.from===m.to){node('circle',{cx:a[0],cy:a[1],r:.39,fill:'none',stroke:color,'stroke-width':.095,opacity:.88});continue}
    const pts=arrowPoints(m.from,m.to),b=pts.at(-1),prev=pts.at(-2),angle=Math.atan2(b[1]-prev[1],b[0]-prev[0]),ux=Math.cos(angle),uy=Math.sin(angle),tip=[b[0]-.05*ux,b[1]-.05*uy],base=[b[0]-.38*ux,b[1]-.38*uy];
    const path=[...pts.slice(0,-1),base].map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' ');
    node('path',{d:path,fill:'none',stroke:color,'stroke-width':.16,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.85});
    node('polygon',{points:[tip,[base[0]-.23*uy,base[1]+.23*ux],[base[0]+.23*uy,base[1]-.23*ux]].map(p=>p.join(',')).join(' '),fill:color,opacity:.9});
   }
  }
  const hit=e=>squareAt(board.getBoundingClientRect(),e.clientX,e.clientY);
  function clearGesture(){if(gesture){gesture.ghost?.remove();gesture.source?.classList.remove('drag-origin');board.querySelector('.drop-hover')?.classList.remove('drop-hover');try{board.releasePointerCapture(gesture.id)}catch{}gesture=null}board.classList.remove('dragging')}
  cleanup=()=>{clearGesture();abort.abort()};
  board.addEventListener('contextmenu',e=>e.preventDefault(),{signal});board.addEventListener('dragstart',e=>e.preventDefault(),{signal});
  board.addEventListener('pointerdown',e=>{
   if(gesture||![0,2].includes(e.button))return;const from=hit(e);if(!from)return;
   if(e.button===2){e.preventDefault();gesture={id:e.pointerId,from,to:from,right:true,piece:pieceAt(from),mods:e};board.setPointerCapture(e.pointerId);return}
   marks=[];paint();const source=board.querySelector(`[data-square="${from}"] .piece`);
   if(!source||!canDrag(from))return;
   gesture={id:e.pointerId,from,x:e.clientX,y:e.clientY,source,drag:false};board.setPointerCapture(e.pointerId);
  },{signal});
  board.addEventListener('pointermove',e=>{
   const g=gesture;if(!g||g.id!==e.pointerId)return;
   const to=hit(e);if(g.right){g.to=to;g.mods=e;paint(to&&pieceArrowAllowed(g.piece,g.from,to)?{from:g.from,to,color:pieceAnnotationColor(g.piece,playerColor,to===g.from)}:null);return}
   if(!g.drag&&Math.hypot(e.clientX-g.x,e.clientY-g.y)<6)return;
   e.preventDefault();if(!g.drag){g.drag=true;g.ghost=g.source.cloneNode(true);g.ghost.classList.add('drag-piece');g.ghost.setAttribute('aria-hidden','true');const size=board.getBoundingClientRect().width/8;Object.assign(g.ghost.style,{width:size+'px',height:size+'px',fontSize:getComputedStyle(g.source).fontSize});document.body.append(g.ghost);g.source.classList.add('drag-origin');board.classList.add('dragging')}
   g.ghost.style.left=e.clientX+'px';g.ghost.style.top=e.clientY+'px';board.querySelector('.drop-hover')?.classList.remove('drop-hover');if(to)board.querySelector(`[data-square="${to}"]`)?.classList.add('drop-hover');
  },{signal});
  board.addEventListener('pointerup',e=>{
   const g=gesture;if(!g||g.id!==e.pointerId)return;const to=hit(e);
   if(g.right){e.preventDefault();if(to&&pieceArrowAllowed(g.piece,g.from,to))marks=toggleMark(marks,{from:g.from,to,color:pieceAnnotationColor(g.piece,playerColor,to===g.from)});clearGesture();paint();return}
   if(g.drag){e.preventDefault();suppressClick=true;clearGesture();if(to&&to!==g.from)move(g.from,to);return}
   suppressClick=true;e.preventDefault();clearGesture();click(g.from);
  },{signal});
  board.addEventListener('pointercancel',()=>{suppressClick=true;clearGesture();paint()},{signal});
  board.addEventListener('lostpointercapture',()=>{clearGesture();paint()},{signal});
  window.addEventListener('blur',()=>{clearGesture();paint()},{signal});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){clearGesture();marks=[];paint()}},{signal});
  board.addEventListener('click',e=>{if(suppressClick){suppressClick=false;e.preventDefault();return}if(e.button!==0)return;const sq=e.target.closest('[data-square]')?.dataset.square;if(sq){marks=[];paint();click(sq)}},{signal});paint();
 }
 return {attach,reset,dispose:()=>cleanup()};
}
