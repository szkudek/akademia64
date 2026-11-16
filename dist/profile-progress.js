export const xpSources=[
 {key:'lessons',label:'Lekcja podstaw',points:30},
 {key:'endgames',label:'Lekcja końcówek',points:40},
 {key:'puzzles',label:'Rozwiązane zadanie',points:10},
 {key:'games',label:'Ukończona partia treningowa',points:15},
 {key:'days',label:'Dzień aktywności',points:5}
];

export function academyLevel(progress,endgameCount,dayCount=activityByDay(progress,localDay()).size){
 const counts={
  lessons:progress.done.length,endgames:endgameCount,puzzles:progress.solved.length,
  games:progress.games,days:dayCount
 };
 const xp=xpSources.reduce((total,{key,points})=>total+counts[key]*points,0);
 return {xp,level:1+Math.floor(xp/100),current:xp%100,target:100};
}

export function localDay(date=new Date()){
 const year=date.getFullYear();
 const month=String(date.getMonth()+1).padStart(2,'0');
 const day=String(date.getDate()).padStart(2,'0');
 return `${year}-${month}-${day}`;
}

function activityByDay(progress,today){
 const byDay=new Map(progress.days.filter(day=>day<=today).map(day=>[day,{day,attempts:0,correct:0}]));
 for(const attempt of progress.tactics){
  const date=new Date(attempt.at);
  if(!Number.isFinite(date.getTime()))continue;
  const day=localDay(date);
  if(day>today)continue;
  const row=byDay.get(day)??{day,attempts:0,correct:0};
  row.attempts++;
  if(attempt.ok)row.correct++;
  byDay.set(day,row);
 }
 return byDay;
}

export function profileActivity(progress,today=localDay()){
 const byDay=activityByDay(progress,today);
 const cursor=new Date(today+'T00:00:00Z');
 if(!byDay.has(today))cursor.setUTCDate(cursor.getUTCDate()-1);
 let streak=0;
 while(byDay.has(cursor.toISOString().slice(0,10))){
  streak++;
  cursor.setUTCDate(cursor.getUTCDate()-1);
 }
 return {streak,days:byDay.size,recent:[...byDay.values()].sort((a,b)=>b.day.localeCompare(a.day)).slice(0,7)};
}
