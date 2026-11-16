import test from 'node:test';
import assert from 'node:assert/strict';
import { dailyTrainingPlan, trainingSegments } from '../dist/training-plan.js';

const data={
 day:'2026-11-16',
 progress:{done:['0-0']},
 lessons:[{id:'0-0',title:'Pierwsza lekcja'},{id:'0-1',title:'Druga lekcja'}],
 endgames:[{id:'mat-hetmanem',title:'Mat hetmanem'},{id:'mat-wieza',title:'Mat wieżą'}],
 completedEndgames:new Set(['mat-hetmanem']),
 correctionCount:2
};

test('daily plan fills each time budget and prioritizes the next lessons and corrections',()=>{
 const plan=dailyTrainingPlan(data);
 assert.deepEqual([plan.targets.lesson,plan.targets.endgame],['0-1','mat-wieza']);
 for(const duration of [10,20,30]){
  const tasks=trainingSegments({...plan,duration},data);
  assert.equal(tasks.reduce((total,task)=>total+task.minutes,0),duration);
  assert.equal(tasks[1].href,'#corrections');
  assert.match(tasks[2].href,/^#opening\/course-.+\/trainer$/);
  assert.equal(tasks[3].href,'#endgames/mat-wieza');
 }
 assert.equal(trainingSegments(plan,{...data,correctionCount:0})[1].href,'#puzzles');
});

test('the same day restores selection, exercise targets and separate checklists',()=>{
 const first=dailyTrainingPlan(data);
 const saved={...first,duration:20,done:{10:['tactics'],20:['lesson','lesson','bad']}};
 const completed={...data,progress:{done:['0-0','0-1']},completedEndgames:new Set(['mat-hetmanem','mat-wieza'])};
 const restored=dailyTrainingPlan(completed,saved);
 assert.equal(restored.duration,20);
 assert.deepEqual(restored.targets,first.targets);
 assert.deepEqual(restored.done,{10:['tactics'],20:['lesson'],30:[]});
 const tomorrow=dailyTrainingPlan({...completed,day:'2026-11-17'},saved);
 assert.equal(tomorrow.duration,10);
 assert.deepEqual(tomorrow.done,{10:[],20:[],30:[]});
 assert.notEqual(tomorrow.targets.opening,first.targets.opening);
});
