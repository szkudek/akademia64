import { Chess } from './vendor/chess.js';

export function readGame(pgn){
 const game=new Chess();
 game.loadPgn(pgn.replace(/^\uFEFF/,''));
 const moves=game.history({verbose:true});
 if(!moves.length)throw new Error('Brak posunięć');
 const positions=[{fen:moves[0].before,move:null}];
 for(const move of moves)positions.push({fen:move.after,move:[move.from,move.to]});
 return {moves,positions,players:[game.getHeaders().White,game.getHeaders().Black].filter(Boolean).join(' – ')};
}
