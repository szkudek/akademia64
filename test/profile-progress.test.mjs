import test from 'node:test';
import assert from 'node:assert/strict';
import { academyLevel, profileActivity } from '../dist/profile-progress.js';
import { normalizeProgress, mergeProgress } from '../dist/progress.js';

test('XP derives from deduplicated completions and advances at the level boundary',()=>{
 const old=normalizeProgress({done:['0-0','0-0'],solved:['mate1','mate1'],games:1,days:['2026-11-15']});
 assert.deepEqual(academyLevel(old,1,1),{xp:100,level:2,current:0,target:100});
 assert.deepEqual(academyLevel(mergeProgress(old,old),1,1),academyLevel(old,1,1));
 assert.equal(academyLevel({...old,tactics:[{id:'mate1',at:0,ok:false,rating:900}]},1,1).xp,100);
});

test('profile includes historical tactics and calculates a calendar-day streak',()=>{
 const attemptAt=new Date(2026,10,15,12).getTime();
 const progress=normalizeProgress({days:['2026-11-14','2026-11-16','2026-11-18'],tactics:[
  {id:'mate1',at:attemptAt,ok:true,rating:900},
  {id:'hanging',at:attemptAt,ok:false,rating:980}
 ]});
 const activity=profileActivity(progress,'2026-11-16');
 assert.equal(activity.streak,3);
 assert.equal(activity.days,3);
 assert.deepEqual(activity.recent[1],{day:'2026-11-15',attempts:2,correct:1});
 assert.equal(profileActivity(progress,'2026-11-17').streak,3);
 assert.equal(profileActivity(progress,'2026-11-20').streak,0);
});
