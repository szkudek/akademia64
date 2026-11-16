import { createStockfish, formatScore, uciMove } from './stockfish-analysis.js';

export async function analyzePuzzle(fen,{signal,onResult,onError,startFen=fen,moves=[],whitePerspective=false}){
 if(signal.aborted)return;
 let engine;
 try{
  engine=createStockfish(signal);
  const result=await engine.evaluate(fen,{startFen,moves});
  if(signal.aborted)return;
  const value=result.score*(fen.split(' ')[1]==='w'?1:-1);
  const evaluation=!whitePerspective&&result.kind==='mate'
   ? (value>0?`Mat w ${value}`:`Przeciwnik matuje w ${Math.abs(value)}`)
   : formatScore({...result,score:whitePerspective?result.score:value});
  if(!result.san.length){onError();return}
  onResult(`${evaluation} · głębokość ${result.depth}. Linia: ${result.san.slice(0,6).join(' ')}.`,uciMove(result.best));
 }catch{
  if(!signal.aborted)onError();
 }finally{engine?.close()}
}
