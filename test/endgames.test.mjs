import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from '../dist/vendor/chess.js';
import { endgameOutcome, endgames } from '../dist/endgames.js';

test('each lesson starts from a playable position with the advertised side to move',()=>{
 for(const exercise of endgames){
  const board=new Chess(exercise.fen);
  assert.equal(board.turn(),exercise.side??'w',exercise.id);
  assert.equal(board.isGameOver(),false,exercise.id);
  const legalMoves=board.moves({verbose:true});
  for(const answer of exercise.answers??[]){
   const move=legalMoves.find(candidate=>candidate.lan===answer);
   assert.ok(move,exercise.id+' '+answer);
   const replay=new Chess(exercise.fen);
   assert.equal(endgameOutcome(replay,exercise,replay.move(move)),'success');
  }
  if(exercise.answers){
   const wrong=legalMoves.find(move=>!exercise.answers.includes(move.lan));
   assert.equal(endgameOutcome(board,exercise,board.move(wrong)),null);
  }
 }
});

test('checkmate completes a lesson and stalemate is reported as a draw',()=>{
 const exercise=endgames.find(item=>item.id==='mat-hetmanem');
 const mate=new Chess('7k/8/5KQ1/8/8/8/8/8 w - - 0 1');
 assert.equal(endgameOutcome(mate,exercise,mate.move('Qg7#')),'success');
 const stalemate=new Chess('7k/8/6K1/5Q2/8/8/8/8 w - - 0 1');
 assert.equal(endgameOutcome(stalemate,exercise,stalemate.move('Qf7')),'draw');
});

test('promotion needs a rook or queen that survives the next move',()=>{
 const exercise=endgames.find(item=>item.id==='promocja');
 const safe=new Chess('8/4P2k/4K3/8/8/8/8/8 w - - 0 1');
 assert.equal(endgameOutcome(safe,exercise,safe.move('e8=Q')),'success');
 const exposed=new Chess('8/4Pk2/2K5/8/8/8/8/8 w - - 0 1');
 assert.equal(endgameOutcome(exposed,exercise,exposed.move('e8=Q')),null);
});
