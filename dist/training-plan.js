export const trainingMinutes={
 10:[3,3,2,2],
 20:[5,6,5,4],
 30:[7,9,7,7]
};

const openings=[
 ['course-italian-0','Partia włoska'],
 ['course-caro-0','Obrona Caro-Kann'],
 ['course-spanish-0','Partia hiszpańska'],
 ['course-sicilian-0','Obrona sycylijska']
];
const segments=['lesson','tactics','opening','endgame'];

export function dailyTrainingPlan({day,progress,lessons,endgames,completedEndgames,correctionCount},saved){
 const dayIndex=Math.floor(Date.parse(day)/86_400_000);
 const rotate=list=>list[dayIndex%list.length];
 const nextLesson=lessons.find(lesson=>!progress.done.includes(lesson.id))??rotate(lessons);
 const nextEndgame=endgames.find(exercise=>!completedEndgames.has(exercise.id))??rotate(endgames);
 const today=saved?.day===day?saved:null;
 const stored=today?.targets;
 const targets={
  lesson:lessons.find(lesson=>lesson.id===stored?.lesson)?.id??nextLesson.id,
  tactics:['corrections','puzzles'].includes(stored?.tactics)?stored.tactics:correctionCount?'corrections':'puzzles',
  opening:openings.find(([id])=>id===stored?.opening)?.[0]??rotate(openings)[0],
  endgame:endgames.find(exercise=>exercise.id===stored?.endgame)?.id??nextEndgame.id
 };
 const done=Object.fromEntries(Object.keys(trainingMinutes).map(minutes=>[
  minutes,segments.filter(id=>Array.isArray(today?.done?.[minutes])&&today.done[minutes].includes(id))
 ]));
 const duration=Number(today?.duration);
 return {day,duration:Object.hasOwn(trainingMinutes,duration)?duration:10,targets,done};
}

export function trainingSegments(plan,{lessons,endgames,correctionCount}){
 const {lesson,tactics,opening,endgame}=plan.targets;
 const [openingId,openingName]=openings.find(([id])=>id===opening);
 const resumeCorrection=tactics==='corrections'&&correctionCount>0;
 const tasks=[
  ['Lekcja podstaw',lessons.find(item=>item.id===lesson).title,'#lesson/'+lesson,'Przejdź lekcję i wykonaj ćwiczenie.'],
  ['Taktyka',resumeCorrection?'Powtórz błędy':'Rozwiąż zadania',resumeCorrection?'#corrections':'#puzzles',resumeCorrection?'Wybierz zadanie z Poprawki i rozwiąż je bez podpowiedzi.':'Rozwiązuj zadania dopasowane do swojego rankingu.'],
  ['Debiut',openingName,'#opening/'+openingId+'/trainer','Odtwórz ruchy wariantu z pamięci.'],
  ['Końcówka',endgames.find(item=>item.id===endgame).title,'#endgames/'+endgame,'Rozegraj pozycję i osiągnij podany cel.']
 ];
 return tasks.map(([category,title,href,instruction],index)=>({
  id:segments[index],category,title,href,instruction,minutes:trainingMinutes[plan.duration][index]
 }));
}
