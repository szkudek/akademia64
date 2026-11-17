import { Chess } from './vendor/chess.js';

export function readGame(pgn){
 const game=new Chess();
 game.loadPgn(pgn.replace(/^\uFEFF/,''));
 const moves=game.history({verbose:true});
 if(!moves.length)throw new Error('Brak posunięć');
 const positions=[{fen:moves[0].before,move:null}];
 for(const move of moves)positions.push({fen:move.after,move:[move.from,move.to]});
 const {White,Black,Result}=game.getHeaders();
 const outcome=Result==='1-0'?'w':Result==='0-1'?'b':Result==='1/2-1/2'?'draw':null;
 const players=[White,Black].filter(name=>name&&name!=='?').join(' – ');
 return {moves,positions,outcome,players};
}

export function terminalEvaluation(position){
 if(position.isCheckmate())return {kind:'mate',score:position.turn()==='w'?-1:1,finished:true};
 if(position.isDraw())return {kind:'cp',score:0,finished:true};
 return null;
}

// A forced mate outranks any numeric evaluation. Centipawn thresholds apply
// only to positions where the engine has not reported mate.
export function reviewMove(move,before,after){
 if(!before?.best||!after)return null;
 if(move.lan===before.best)return {label:'Najlepszy',severity:0};
 const side=move.color==='w'?1:-1;
 const oldValue=before.score*side,newValue=after.score*side;
 if(before.kind==='mate'||after.kind==='mate'){
  const outcome=(evaluation,value)=>evaluation.kind==='mate'?Math.sign(value):0;
  return outcome(before,oldValue)>outcome(after,newValue)
   ? {label:'Duży błąd',severity:3} : {label:'Zagrany',severity:0};
 }
 const loss=Math.max(0,oldValue-newValue);
 if(loss>=250)return {label:'Duży błąd',severity:3,loss};
 if(loss>=120)return {label:'Błąd',severity:2,loss};
 if(loss>=60)return {label:'Niedokładność',severity:1,loss};
 return {label:'Zagrany',severity:0,loss};
}

export function graphValue({kind,score}){
 return kind==='mate'?Math.sign(score)*600:Math.max(-600,Math.min(600,score));
}

export function moveLabel(move){
 return move.before.split(' ')[5]+(move.color==='w'?'. ':'… ')+move.san;
}
