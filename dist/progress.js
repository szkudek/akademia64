export const emptyProgress=()=>({done:[],solved:[],days:[],games:0});
export const lessonIds=[3,4,3,4,3,2].flatMap((n,i)=>Array.from({length:n},(_,j)=>`${i}-${j}`));
export const puzzleIds=['mate1','hanging','backrank','forkreal','promotion','bishop'];
export function normalizeProgress(value){
  if(!value||typeof value!=='object')return emptyProgress();
  const list=(key,test,max)=>[...new Set((Array.isArray(value[key])?value[key]:[]).filter(test))].slice(0,max);
  return {
    done:list('done',v=>lessonIds.includes(v),19),
    solved:list('solved',v=>puzzleIds.includes(v),6),
    days:list('days',v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v)),5000).sort(),
    games:Number.isSafeInteger(value.games)&&value.games>=0?Math.min(value.games,1000000):0
  };
}
export function mergeProgress(left,right){
  const a=normalizeProgress(left),b=normalizeProgress(right);
  return normalizeProgress({done:[...a.done,...b.done],solved:[...a.solved,...b.solved],days:[...a.days,...b.days],games:Math.max(a.games,b.games)});
}
export function sameProgress(a,b){return ['done','solved','days'].every(k=>a[k].length===b[k].length&&a[k].every(v=>b[k].includes(v)))&&a.games===b.games}
