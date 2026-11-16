import { Chess } from './vendor/chess.js';

export const uciMove = uci => ({
 from:uci.slice(0,2), to:uci.slice(2,4), promotion:uci[4]
});

export function formatScore({kind, score}){
 if(kind==='mate')return score===0?'Mat':`Mat dla ${score>0?'białych':'czarnych'} w ${Math.abs(score)}`;
 return new Intl.NumberFormat('pl',{signDisplay:'exceptZero',maximumFractionDigits:2}).format(score/100);
}

export function createStockfish(signal){
 signal.throwIfAborted();
 const worker=new Worker(new URL('./vendor/stockfish/stockfish-19-lite-single.js',import.meta.url));
 let pending, timer;
 function close(){
  settle(signal.reason??new Error('Silnik został zatrzymany.'));
  worker.terminate();
  signal.removeEventListener('abort',close);
 }
 function settle(error,value){
  if(!pending)return;
  clearTimeout(timer);
  const {resolve,reject}=pending;
  pending=null;
  if(error)reject(error);
  else resolve(value);
 }
 function wait(send,receive){
  signal.throwIfAborted();
  return new Promise((resolve,reject)=>{
   pending={resolve,reject,receive};
   timer=setTimeout(()=>settle(new Error('Stockfish nie odpowiedział.')),20000);
   try{send()}catch(error){settle(error)}
  });
 }
 worker.onerror=()=>settle(new Error('Błąd uruchamiania Stockfisha.'));
 worker.onmessage=({data})=>pending?.receive(data);
 signal.addEventListener('abort',close,{once:true});
 const ready=wait(()=>worker.postMessage('uci'),data=>{if(data==='uciok')settle(null);});
 return {
  close,
  async evaluate(fen,{startFen=fen,moves=[],limit='depth 15 movetime 1500'}={}){
   await ready;
   let evaluation;
   const color=fen.split(' ')[1]==='w'?1:-1;
   return wait(()=>{
    worker.postMessage('position fen '+startFen+(moves.length?' moves '+moves.join(' '):''));
    worker.postMessage('go '+limit);
   },data=>{
    const info=/^info depth (\d+).*? score (cp|mate) (-?\d+)(?!\S).*? pv (.+)$/.exec(data);
    if(info&&!/\b(?:upperbound|lowerbound)\b/.test(data)){
     const [,depth,kind,value,pv]=info;
     evaluation={depth:Number(depth),kind,score:Number(value)*color,pv:pv.trim().split(/\s+/)};
    }
    if(!data.startsWith('bestmove '))return;
    if(!evaluation){settle(new Error('Brak oceny pozycji.'));return}
    const replay=new Chess(fen);
    const san=[];
    for(const uci of evaluation.pv.slice(0,8)){
     try{san.push(replay.move(uciMove(uci)).san)}catch{break}
    }
    const [,best]=data.split(' ');
    settle(null,{...evaluation,san,best});
   });
  }
 };
}
