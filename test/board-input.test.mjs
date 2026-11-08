import test from 'node:test';
import assert from 'node:assert/strict';
import {squareAt,pieceAnnotationColor,pieceArrowAllowed,toggleMark,arrowPoints} from '../dist/board-input.js';
test('pointer coordinates map all board edges and reject outside drops',()=>{
 const r={left:100,top:200,right:900,bottom:1000,width:800,height:800};
 assert.equal(squareAt(r,100,200),'a8');assert.equal(squareAt(r,899,999),'h1');assert.equal(squareAt(r,550,650),'e4');
 for(const [x,y] of [[99,200],[900,200],[100,199],[100,1000]])assert.equal(squareAt(r,x,y),null);
});
test('arrow colors follow the player side and circles are always yellow',()=>{
 assert.equal(pieceAnnotationColor({color:'w'},'w'),'green');assert.equal(pieceAnnotationColor({color:'b'},'w'),'red');
 assert.equal(pieceAnnotationColor({color:'b'},'b'),'green');assert.equal(pieceAnnotationColor({color:'w'},'b'),'red');
 assert.equal(pieceAnnotationColor({color:'b'},'w',true),'yellow');assert.equal(pieceAnnotationColor(null),'yellow');
});
test('piece arrows follow movement geometry, including pawn direction and knight L',()=>{
 const allows=(type,from,to,color='w')=>pieceArrowAllowed({type,color},from,to);
 assert.ok(allows('n','g1','f3'));assert.ok(!allows('n','g1','g3'));
 assert.ok(allows('b','c1','h6'));assert.ok(!allows('b','c1','c4'));
 assert.ok(allows('r','a1','a8'));assert.ok(!allows('r','a1','b2'));
 assert.ok(allows('q','d1','h5'));assert.ok(!allows('q','d1','e4'));
 assert.ok(allows('k','e1','e2'));assert.ok(!allows('k','e1','e3'));
 assert.ok(allows('p','e2','e4'));assert.ok(allows('p','e2','f3'));assert.ok(!allows('p','e3','e5'));assert.ok(!allows('p','e3','e2'));
 assert.ok(allows('p','e7','e5','b'));assert.ok(!allows('p','e7','e8','b'));
});
test('repeating an annotation removes it and another color replaces it',()=>{
 const a={from:'e2',to:'e4',color:'yellow'},b={from:'d4',to:'d4',color:'red'};
 const marks=toggleMark(toggleMark([],a),b);assert.equal(marks.length,2);assert.deepEqual(toggleMark(marks,a),[b]);
 const recolored=toggleMark(marks,{...a,color:'blue'});assert.equal(recolored.length,2);assert.equal(recolored[0].color,'blue');
});
test('knight arrows bend on their long leg and ordinary arrows stay straight',()=>{
 assert.deepEqual(arrowPoints('g1','f3'),[[6.5,7.5],[6.5,5.5],[5.5,5.5]]);
 assert.deepEqual(arrowPoints('b1','d2'),[[1.5,7.5],[3.5,7.5],[3.5,6.5]]);
 assert.equal(arrowPoints('e2','e4').length,2);assert.equal(arrowPoints('a1','h8').length,2);
});
test('right-button gestures render arrows, toggle circles and clear without making moves', async()=>{
 const {createBoardInput}=await import('../dist/board-input.js');
 class El extends EventTarget{
  constructor(){super();this.children=[];this.attrs={};this.classList={remove(){},add(){}}}
  setAttribute(k,v){this.attrs[k]=v}append(el){this.children.push(el)}replaceChildren(){this.children=[]}
  querySelector(){return null}setPointerCapture(){}releasePointerCapture(){}
  getBoundingClientRect(){return {left:0,top:0,right:800,bottom:800,width:800,height:800}}
 }
 const previousDoc=globalThis.document,previousWindow=globalThis.window;
 globalThis.document={createElementNS:()=>new El()};globalThis.window=new El();
 const board=new El(),input=createBoardInput();let moves=0,clicks=0;
 const fire=(type,x,y,button=2,extra={})=>{const e=new Event(type,{cancelable:true});Object.assign(e,{clientX:x,clientY:y,button,pointerId:1,...extra});board.dispatchEvent(e)};
 try{
  input.attach(board,{position:'start',canDrag:()=>false,move:()=>moves++,click:()=>clicks++});
  fire('pointerdown',450,650);fire('pointermove',450,450);fire('pointerup',450,450);
  const svg=board.children[0];assert.equal(svg.children.length,2);assert.equal(svg.children[0].attrs.stroke,'#e8b339');
  fire('pointerdown',350,450);fire('pointerup',350,450);assert.equal(svg.children.length,3);
  fire('pointerdown',350,450);fire('pointerup',350,450);assert.equal(svg.children.length,2);
  fire('pointerdown',450,450,0);assert.equal(svg.children.length,0);assert.equal(moves,0);assert.equal(clicks,0);

  const puzzleBoard=new El(),drawing={enabled:false,color:'blue'};
  input.attach(puzzleBoard,{position:'puzzle',drawing,pieceAt:()=>({type:'p',color:'w'}),canDrag:()=>false,move:()=>moves++,click:()=>clicks++});
  const draw=(type,x,y,props)=>puzzleBoard.dispatchEvent(Object.assign(new Event(type,{cancelable:true}),{
   clientX:x,clientY:y,pointerId:1,button:2,...props
  }));
  const overlay=puzzleBoard.children[0];
  draw('pointerdown',450,650);draw('pointermove',50,450,{shiftKey:true});draw('pointerup',50,450,{shiftKey:true});
  assert.equal(overlay.children[0].attrs.stroke,'#58b56f');
  draw('pointerdown',450,650);draw('pointerup',50,450,{ctrlKey:true});
  assert.equal(overlay.children[0].attrs.stroke,'#e66a64');
  draw('pointerdown',450,650);draw('pointerup',50,450,{altKey:true});
  assert.equal(overlay.children[0].attrs.stroke,'#5ba7e6');
  drawing.enabled=true;
  draw('pointerdown',350,450,{button:0,pointerType:'touch'});draw('pointerup',350,450,{button:0,pointerType:'touch'});
  assert.equal(overlay.children.at(-1).attrs.fill,'#5ba7e6');
  assert.equal(moves,0);assert.equal(clicks,0);
  input.clearMarks();
  assert.equal(overlay.children.length,0);
 }finally{input.dispose();globalThis.document=previousDoc;globalThis.window=previousWindow}
});
