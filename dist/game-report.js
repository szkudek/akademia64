import { formatScore } from './stockfish-analysis.js';
import { graphValue, moveLabel, reviewMove } from './game-analysis.js';

export function renderGameReport(root,{moves,evaluations,current,side,select,practice}){
 const points=evaluations.map((evaluation,ply)=>[10+380*ply/moves.length,60-50*graphValue(evaluation)/600]);
 const steps=moves.slice(0,evaluations.length-1).map((move,index)=>({
  move, ply:index+1, review:reviewMove(move,evaluations[index],evaluations[index+1])
 }));
 const errors=steps.filter(({move,review})=>review?.severity>=2&&(side==='both'||move.color===side));
 const selected=points[current];
 root.hidden=!points.length;
 if(root.hidden){root.replaceChildren();return}
 root.innerHTML=`
  <figure class="analysis-graph">
   <figcaption>Przewaga białych i czarnych</figcaption>
   <svg viewBox="0 0 400 120" role="img" aria-label="Wykres oceny Stockfisha z perspektywy białych">
    <line x1="10" y1="60" x2="390" y2="60" class="analysis-axis"/>
    <polyline points="${points.map(point=>point.join(',')).join(' ')}" class="analysis-curve"/>
    ${errors.map(({ply})=>`<circle cx="${points[ply][0]}" cy="${points[ply][1]}" r="4" class="analysis-error-mark"/>`).join('')}
    ${selected?`<line x1="${selected[0]}" y1="10" x2="${selected[0]}" y2="110" class="analysis-cursor"/><circle cx="${selected[0]}" cy="${selected[1]}" r="4" class="analysis-current-mark"/>`:''}
   </svg>
   <input id="analysis-scrubber" type="range" aria-label="Pozycja na wykresie" min="0" max="${points.length-1}" value="${Math.min(current,points.length-1)}" ${points.length<2?'disabled':''}>
   <p class="tiny">Góra: przewaga białych · dół: przewaga czarnych. Wykres pokazuje oceny w skali od −6 do +6.</p>
  </figure>
  <h2>Kluczowe błędy</h2>
  <div id="analysis-errors"></div>`;
 root.querySelector('#analysis-scrubber').onchange=event=>select(Number(event.target.value));
 const list=root.querySelector('#analysis-errors');
 if(!errors.length){list.textContent='Brak wykrytych błędów w ocenionych ruchach wybranego koloru.';return}
 for(const {move,ply,review} of errors){
  const row=document.createElement('div');
  row.className='analysis-error-row';
  const inspect=document.createElement('button');
  inspect.type='button';inspect.className='text-link';
  inspect.textContent=`${moveLabel(move)} · ${review.label}`;
  inspect.title=formatScore(evaluations[ply]);
  inspect.onclick=()=>select(ply);
  row.append(inspect);
  const exercise=document.createElement('button');
  exercise.type='button';exercise.className='btn outline';
  exercise.textContent='Przećwicz';
  exercise.setAttribute('aria-label','Przećwicz ruch '+moveLabel(move));
  exercise.onclick=()=>practice(ply);
  row.append(exercise);
  list.append(row);
 }
}
