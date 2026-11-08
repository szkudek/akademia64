// Glicko-2: ranking treningowy Akademia64, skala zbliżona do Lichess.
const SCALE=173.7178, TAU=0.5;
export const STARTING_RATING=700;
const init=()=>({rating:STARTING_RATING,rd:350,vol:0.06});
const f=(x,delta,phi,v,a)=>Math.exp(x)*(delta*delta-phi*phi-v-Math.exp(x))/(2*Math.pow(phi*phi+v+Math.exp(x),2))-(x-a)/(TAU*TAU);
export function ratePuzzle(state,puzzleRating,success){
 const input=state||init();let mu=(input.rating-1500)/SCALE, phi=Math.max(30,Math.min(350,input.rd))/SCALE;
 const opponentPhi=100/SCALE;
 const g=1/Math.sqrt(1+3*opponentPhi*opponentPhi/(Math.PI*Math.PI));
 const expected=1/(1+Math.exp(-g*(mu-(puzzleRating-1500)/SCALE)));
 const v=1/(g*g*expected*(1-expected));
 const delta=v*g*((success?1:0)-expected);
 const a=Math.log(input.vol*input.vol);let A=a,B;
 if(delta*delta>phi*phi+v)B=Math.log(delta*delta-phi*phi-v);
 else {let k=1;while(f(a-k*TAU,delta,phi,v,a)<0&&k<100)k++;B=a-k*TAU;}
 let fa=f(A,delta,phi,v,a),fb=f(B,delta,phi,v,a);
 for(let n=0;n<100&&Math.abs(B-A)>1e-7;n++){
  const C=A+(A-B)*fa/(fb-fa);const fc=f(C,delta,phi,v,a);
  if(fc*fb<0){A=B;fa=fb}else fa/=2;
  B=C;fb=fc;
 }
 const vol=Math.exp(A/2),phiStar=Math.sqrt(phi*phi+vol*vol);
 const nextPhi=1/Math.sqrt(1/(phiStar*phiStar)+1/v);
 const nextMu=mu+nextPhi*nextPhi*g*((success?1:0)-expected);
 return {rating:Math.round(1500+SCALE*nextMu),rd:Math.round(Math.max(30,Math.min(350,SCALE*nextPhi))),vol};
}
export function ratingFromAttempts(attempts){
 const sorted=[...(attempts||[])].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
 return sorted.reduce((s,a)=>ratePuzzle(s,a.rating,a.ok),init());
}
export function choosePuzzle(pool,attempts,recent=[]){
 const completed=new Set((attempts||[]).map(a=>a.id));
 const fresh=pool.filter(p=>!completed.has(p.id));
 const available=fresh.length?fresh:pool;
 const rating=ratingFromAttempts(attempts).rating;
 const sorted=[...available].sort((a,b)=>Math.abs(a.rating-rating)-Math.abs(b.rating-rating));
 const near=sorted.slice(0,Math.min(18,sorted.length));
 const eligible=near.filter(p=>!recent.includes(p.id));
 const options=eligible.length?eligible:near;
 return options[Math.floor(Math.random()*options.length)];
}
