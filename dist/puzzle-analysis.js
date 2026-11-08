import { Chess } from './vendor/chess.js';

export function analyzePuzzle(fen, {signal, onResult, onError}){
 let worker;
 try{
  worker=new Worker(new URL('./vendor/stockfish/stockfish-19-lite-single.js',import.meta.url));
 }catch{
  onError();
  return;
 }

 const dispose=()=>{
  clearTimeout(timeout);
  signal.removeEventListener('abort',dispose);
  worker.terminate();
 };
 const fail=()=>{dispose();onError()};
 const timeout=setTimeout(fail,20000);
 signal.addEventListener('abort',dispose,{once:true});
 worker.onerror=fail;

 let analysis;
 worker.onmessage=({data})=>{
  if(data==='uciok'){
   worker.postMessage('position fen '+fen);
   worker.postMessage('go depth 15 movetime 1500');
   return;
  }
  const line=/^info depth (\d+).*? score (cp|mate) (-?\d+).*? pv (.+)$/.exec(data);
  if(line)analysis=line;
  if(!data.startsWith('bestmove '))return;
  dispose();
  if(!analysis){onError();return}

  const [,depth,kind,score,pv]=analysis;
  const replay=new Chess(fen),moves=[];
  for(const uci of pv.trim().split(/\s+/).slice(0,6)){
   try{
    moves.push(replay.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]}).san);
   }catch{break}
  }
  if(!moves.length){onError();return}
  const value=Number(score);
  const evaluation=kind==='mate'
   ? (value>0?`Mat w ${value}`:`Przeciwnik matuje w ${Math.abs(value)}`)
   : new Intl.NumberFormat('pl',{signDisplay:'exceptZero',maximumFractionDigits:2}).format(value/100);
  onResult(`${evaluation} · głębokość ${depth}. Linia: ${moves.join(' ')}.`);
 };
 worker.postMessage('uci');
}
