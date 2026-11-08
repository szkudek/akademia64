export const emptyProgress=()=>({done:[],solved:[],days:[],games:0,tactics:[],corrections:[]});
export const lessonIds=[3,4,3,4,3,2].flatMap((n,i)=>Array.from({length:n},(_,j)=>`${i}-${j}`));
export const puzzleIds=['mate1','hanging','backrank','forkreal','promotion','bishop'];
function cleanAttempts(value,latest=false){
 const attempts=Array.isArray(value)?value:[];
 const byId=new Map();
 for(const a of attempts.slice(0,20000)){
  if(!a||typeof a!=='object'||typeof a.id!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(a.id))continue;
  if(!Number.isFinite(a.rating)||a.rating<400||a.rating>3500||typeof a.ok!=='boolean'||!Number.isSafeInteger(a.at)||a.at<0)continue;
  const row={id:a.id,rating:Math.round(a.rating),ok:a.ok,at:a.at};
  const existing=byId.get(row.id);
  const preferred=existing&&(latest?row.at>existing.at||(row.at===existing.at&&row.ok):row.at<existing.at||(row.at===existing.at&&!row.ok));
  if(!existing||preferred)byId.set(row.id,row);
 }
 const sorted=[...byId.values()].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
 return latest?sorted.slice(-5000):sorted.slice(0,5000);
}
export function normalizeProgress(value){
 if(!value||typeof value!=='object')return emptyProgress();
 const list=(key,test,max)=>[...new Set((Array.isArray(value[key])?value[key]:[]).filter(test))].slice(0,max);
 return {
  done:list('done',v=>lessonIds.includes(v),19),
  solved:list('solved',v=>puzzleIds.includes(v)||(typeof v==='string'&&/^li_[A-Za-z0-9_-]{1,32}$/.test(v)),5000),
  days:list('days',v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v)),5000).sort(),
  games:Number.isSafeInteger(value.games)&&value.games>=0?Math.min(value.games,1000000):0,
  tactics:cleanAttempts(value.tactics),
  corrections:cleanAttempts(value.corrections,true)
 };
}
export function pendingCorrections(progress){
 const latest=new Map(progress.tactics.filter(attempt=>!attempt.ok).map(attempt=>[attempt.id,attempt]));
 for(const attempt of progress.corrections)latest.set(attempt.id,attempt);
 return [...latest.values()].filter(attempt=>!attempt.ok).sort((a,b)=>b.at-a.at||a.id.localeCompare(b.id));
}
export function mergeProgress(left,right){
 const a=normalizeProgress(left),b=normalizeProgress(right);
 return normalizeProgress({done:[...a.done,...b.done],solved:[...a.solved,...b.solved],days:[...a.days,...b.days],games:Math.max(a.games,b.games),tactics:[...a.tactics,...b.tactics],corrections:[...a.corrections,...b.corrections]});
}
export function sameProgress(a,b){
 const x=normalizeProgress(a),y=normalizeProgress(b);
 return ['done','solved','days'].every(k=>x[k].length===y[k].length&&x[k].every(v=>y[k].includes(v)))&&x.games===y.games&&JSON.stringify(x.tactics)===JSON.stringify(y.tactics)&&JSON.stringify(x.corrections)===JSON.stringify(y.corrections);
}
