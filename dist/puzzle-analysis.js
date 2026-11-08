import { Chess } from './vendor/chess.js';

export function analyzePuzzle(fen, {signal, onResult, onError, startFen=fen, moves=[], whitePerspective=false}){
 if(signal.aborted)return;
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
   worker.postMessage('position fen '+startFen+(moves.length?' moves '+moves.join(' '):''));
   worker.postMessage('go depth 15 movetime 1500');
   return;
  }
  const line=/^info depth (\d+).*? score (cp|mate) (-?\d+).*? pv (.+)$/.exec(data);
  if(line)analysis=line;
  if(!data.startsWith('bestmove '))return;
  dispose();
  if(!analysis){onError();return}

  const [,depth,kind,score,pv]=analysis;
  const replay=new Chess(fen),lineMoves=[];
  for(const uci of pv.trim().split(/\s+/).slice(0,6)){
   try{
    lineMoves.push(replay.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]}).san);
   }catch{break}
  }
  if(!lineMoves.length){onError();return}
  const value=Number(score);
  const whiteScore=value*(fen.split(' ')[1]==='w'?1:-1);
  const evaluation=whitePerspective
   ? (kind==='mate'?`Mat dla ${whiteScore>0?'białych':'czarnych'} w ${Math.abs(value)}`:new Intl.NumberFormat('pl',{signDisplay:'exceptZero',maximumFractionDigits:2}).format(whiteScore/100))
   : kind==='mate'
   ? (value>0?`Mat w ${value}`:`Przeciwnik matuje w ${Math.abs(value)}`)
   : new Intl.NumberFormat('pl',{signDisplay:'exceptZero',maximumFractionDigits:2}).format(value/100);
  const best=/^bestmove ([a-h][1-8])([a-h][1-8])/.exec(data);
  onResult(`${evaluation} · głębokość ${depth}. Linia: ${lineMoves.join(' ')}.`,best&&{from:best[1],to:best[2]});
 };
 worker.postMessage('uci');
}
