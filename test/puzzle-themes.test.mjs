import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeProgress, normalizeProgress } from '../dist/progress.js';
import { summarizePuzzleThemes } from '../dist/puzzle-themes.js';

test('adding themes to a stored attempt survives synchronization in either direction',()=>{
 const first={id:'li_test',rating:700,ok:false,at:100,ratingVersion:2};
 const older={tactics:[first]};
 const enriched={tactics:[{...first,themes:['pin','pin','fork','constructor','unknown']}]};
 const expected={...first,themes:['fork','pin']};
 assert.deepEqual(normalizeProgress(enriched).tactics,[expected]);
 assert.deepEqual(mergeProgress(older,enriched).tactics,[expected]);
 assert.deepEqual(mergeProgress(enriched,older).tactics,[expected]);
});

test('theme stats count all motifs and recommend a weak motif after three attempts',()=>{
 const known=new Map([['old',{themes:['fork']}]]);
 const attempts=[
  {id:'one',ok:false,themes:['pin','fork']},
  {id:'two',ok:true,themes:['pin']},
  {id:'three',ok:false,themes:['pin']},
  {id:'old',ok:false},
  {id:'unknown',ok:false}
 ];
 assert.equal(summarizePuzzleThemes(attempts.slice(0,2),known).recommended,undefined);
 const {rows,unclassified,recommended}=summarizePuzzleThemes(attempts,known);
 assert.deepEqual(rows,[{theme:'fork',total:2,correct:0},{theme:'pin',total:3,correct:1}]);
 assert.equal(unclassified,1);
 assert.equal(recommended,'pin');
});
