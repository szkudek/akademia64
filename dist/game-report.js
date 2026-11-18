import { formatScore } from './stockfish-analysis.js';
import { graphValue, moveLabel, reviewMove } from './game-analysis.js';

export function renderGameReport(root,{moves,evaluations,current,side,solvedErrors,select,practice,interactive=true}){
 const focusedPly=root.contains(document.activeElement)?document.activeElement?.dataset.errorPly:null;
 const points=evaluations.map((evaluation,ply)=>[10+380*ply/moves.length,60-50*graphValue(evaluation)/600]);
 const steps=moves.slice(0,evaluations.length-1).map((move,index)=>({
  move, ply:index+1, review:reviewMove(move,evaluations[index],evaluations[index+1])
 }));
 const errors=steps.filter(({move,review})=>review?.severity>=2&&(side==='both'||move.color===side));
 const remaining=errors.filter(({ply})=>!solvedErrors.has(ply));
 const selected=points[current];
 const selectedError=errors.some(({ply})=>ply===current);
 root.hidden=!points.length;
 if(root.hidden){root.replaceChildren();return}
 root.innerHTML=`
  <figure class="analysis-graph">
   <figcaption>Przewaga białych i czarnych</figcaption>
   <svg viewBox="0 0 400 120" role="${interactive?'group':'img'}" aria-label="Wykres oceny Stockfisha z perspektywy białych">
    <line x1="10" y1="60" x2="390" y2="60" class="analysis-axis"/>
    <polyline points="${points.map(point=>point.join(',')).join(' ')}" class="analysis-curve"/>
    ${selected?`<line x1="${selected[0]}" y1="10" x2="${selected[0]}" y2="110" class="analysis-cursor"/>`:''}
    ${errors.map(({ply,move,review})=>{
     const mark=`<circle cx="${points[ply][0]}" cy="${points[ply][1]}" r="4" class="analysis-error-mark${solvedErrors.has(ply)?' practiced':''}"/>`;
     if(!interactive)return mark;
     const description=moveLabel(move)+' — '+review.label+(solvedErrors.has(ply)?' · przećwiczony':'');
     return `<g class="analysis-error-button" data-error-ply="${ply}" role="button" tabindex="0" aria-label="${description}"${ply===current?' aria-current="step"':''}>
      <title>${description}</title>
      <circle class="analysis-error-hit" cx="${points[ply][0]}" cy="${points[ply][1]}" r="8"/>
      ${mark}
     </g>`;
    }).join('')}
    ${selected?`<circle cx="${selected[0]}" cy="${selected[1]}" r="${selectedError?6:4}" class="analysis-current-mark${selectedError?' ring':''}"/>`:''}
   </svg>
   <input id="analysis-scrubber" type="range" aria-label="Pozycja na wykresie" min="0" max="${points.length-1}" value="${Math.min(current,points.length-1)}" ${points.length<2?'disabled':''}>
   <p class="tiny">Góra: przewaga białych · dół: przewaga czarnych. Wykres pokazuje oceny w skali od −6 do +6.</p>
   ${errors.length?'<p class="tiny">Czerwone kółka: błędy do przećwiczenia. Zielone: błędy przećwiczone.</p>':''}
  </figure>
  <h2>Kluczowe błędy</h2>
  <div id="analysis-errors"></div>`;
 root.querySelector('#analysis-scrubber').onchange=event=>select(Number(event.target.value));
 // Resolve the closest dot from the pointer position, including overlapping hit areas.
 // The root survives report rerenders while Stockfish streams fresh evaluations.
 const selectMarker=event=>{
  if(!interactive||event.button!==0)return;
  const svg=root.querySelector('.analysis-graph svg');
  const matrix=svg?.getScreenCTM();
  if(!matrix)return;
  const point=svg.createSVGPoint();
  point.x=event.clientX;point.y=event.clientY;
  const position=point.matrixTransform(matrix.inverse());
  let nearest=null,distance=Infinity;
  for(const error of errors){
   const [x,y]=points[error.ply];
   const squared=(position.x-x)**2+(position.y-y)**2;
   if(squared<distance){nearest=error.ply;distance=squared}
  }
  if(nearest!==null&&distance<=64)select(nearest);
 };
 root.onpointerdown=event=>{if(event.pointerType==='mouse')selectMarker(event)};
 root.onclick=selectMarker;
 for(const marker of root.querySelectorAll('[data-error-ply]')){
  marker.onkeydown=event=>{
   if(event.key!=='Enter'&&event.key!==' ')return;
   event.preventDefault();
   select(Number(marker.dataset.errorPly));
  };
 }
 if(focusedPly)root.querySelector('[data-error-ply="'+focusedPly+'"]')?.focus({preventScroll:true});
 const list=root.querySelector('#analysis-errors');
 if(!remaining.length){
  list.textContent=errors.length?'Wszystkie kluczowe błędy wybranego koloru zostały przećwiczone.':'Brak wykrytych błędów w ocenionych ruchach wybranego koloru.';
  return;
 }
 for(const {move,ply,review} of remaining){
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
