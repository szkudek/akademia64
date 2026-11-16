import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from '../dist/vendor/chess.js';
import { readGame, reviewMove, terminalEvaluation } from '../dist/game-analysis.js';

const cp=(score,best)=>({kind:'cp',score,best});
const mate=(score,best)=>({kind:'mate',score,best});

test('PGN replay retains initial FEN, promotion and final position',()=>{
 const parsed=readGame('[SetUp "1"]\n[FEN "7k/P7/8/8/8/8/8/7K w - - 0 23"]\n\n23. a8=Q+ *');
 assert.equal(parsed.moves[0].lan,'a7a8q');
 assert.equal(parsed.positions[0].fen.split(' ').at(-1),'23');
 assert.deepEqual(parsed.positions[1].move,['a7','a8']);
 assert.equal(new Chess(parsed.positions[1].fen).get('a8').type,'q');
 assert.throws(()=>readGame('1. e9'));
});

test('move classifications use the mover perspective and distinguish forced mate',()=>{
 assert.deepEqual(reviewMove({color:'b',lan:'a7a6'},cp(-150,'e7e5'),cp(110)),
  {label:'Duży błąd',severity:3,loss:260});
 assert.equal(reviewMove({color:'w',lan:'a2a4'},cp(220,'e2e4'),mate(-1)).severity,3);
 assert.equal(reviewMove({color:'b',lan:'h4e1'},mate(-1,'h4e1'),mate(-1)).label,'Najlepszy');
 const game=new Chess();
 game.loadPgn('1. f3 e5 2. g4 Qh4#');
 assert.deepEqual(terminalEvaluation(game),{kind:'mate',score:-1,finished:true});
});
