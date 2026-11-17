import { cleanPuzzleThemes, puzzleThemes, summarizePuzzleThemes } from './puzzle-themes.js';
import { dailyTrainingPlan, trainingMinutes, trainingSegments } from './training-plan.js';
import { academyLevel, localDay, profileActivity, xpSources } from './profile-progress.js';
import { endgames, endgameOutcome } from './endgames.js';
import { createBoardInput } from './board-input.js?v=20261108-free-analysis';
import { accounts } from './accounts.js?v=20261116-release';
import { normalizeProgress, pendingCorrections } from './progress.js?v=20261116-release';
import { Chess } from './vendor/chess.js';
import { openingChapter } from './opening-chapter.js?v=20261108-shared-board';
import { lichessPuzzles } from './puzzle-bank.js';
import { ratingFromAttempts, ratedAttempts, choosePuzzle, STARTING_RATING, RATING_VERSION, PUZZLE_RATING_RANGE } from './tactics-rating.js?v=20261108-rating-match';
import { analyzePuzzle } from './puzzle-analysis.js?v=20261116-eval-bar';
import { moveLabel, readGame, reviewMove, terminalEvaluation } from './game-analysis.js?v=20261117-pgn-text';
import { createStockfish, formatScore, uciMove } from './stockfish-analysis.js';
import { renderGameReport } from './game-report.js?v=20261116-practiced-markers';
import { openSoundSettings, soundMove, unlockChessSound } from './chess-sound.js?v=20261108-recorded-clicks';
const boardInput=createBoardInput();
const $=s=>document.querySelector(s);const main=$('#main');
const icons={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
const names={k:'król',q:'hetman',r:'wieża',b:'goniec',n:'skoczek',p:'pion'};
const puzzleColors={orange:'pomarańczowy',green:'zielony',red:'czerwony',blue:'niebieski'};
let puzzleAnalysis;
const units=[
{title:'Poznaj szachownicę',icon:'▦',badge:'Pierwszy krok',lessons:[
{title:'Twoje 64 pola',text:'Szachownica ma 64 pola: 8 rzędów i 8 kolumn. Ustaw ją tak, aby prawe dolne pole było jasne. Każde pole ma nazwę — literę kolumny i numer rzędu.',fen:'start',type:'square',target:'h1',task:'Kliknij pole h1 — jasny prawy dolny narożnik.',hint:'Litery biegną od a do h, a numery od 1 na dole do 8 na górze.'},
{title:'Ustawienie figur',text:'Białe figury stoją na pierwszym rzędzie, a piony na drugim. Czarne zajmują rzędy ósmy i siódmy. Hetman zaczyna na polu swojego koloru: biały na d1, czarny na d8.',fen:'start',type:'quiz',question:'Na którym polu zaczyna biały hetman?',options:['e1','d1','d8'],answer:1,explain:'Biały hetman stoi na jasnym polu d1, obok króla na e1.'},
{title:'Kto wykonuje pierwszy ruch?',text:'Białe zawsze zaczynają. Potem gracze wykonują ruchy na zmianę. Celem jest danie mata królowi przeciwnika — atak, przed którym nie ma legalnej obrony.',fen:'start',type:'quiz',question:'Jaki jest cel partii szachowej?',options:['Zbić wszystkie piony','Zbić króla','Dać mata królowi przeciwnika'],answer:2,explain:'Króla nie zbijamy. Mat kończy partię, gdy atakowanego króla nie da się uratować.'}]},
{title:'Poznaj swoją armię',icon:'♞',badge:'Znam swoją armię',lessons:[
{title:'Wieża i goniec',text:'Wieża porusza się po liniach prostych: w pionie i poziomie. Goniec chodzi po przekątnych i przez całą partię zostaje na polach jednego koloru. Żadna z tych figur nie przeskakuje innych figur.',fen:'7k/8/8/8/3R4/8/8/K7 w - - 0 1',type:'move',target:['d4','d7'],task:'Przesuń wieżę z d4 na d7.',hint:'Kliknij wieżę na d4, a następnie pole d7 w tej samej kolumnie.'},
{title:'Hetman i król',text:'Hetman łączy ruchy wieży i gońca: chodzi prosto i po przekątnych. Król porusza się o jedno pole w dowolnym kierunku, ale nie może wejść na pole atakowane przez przeciwnika.',fen:'7k/8/8/8/3Q4/8/8/K7 w - - 0 1',type:'move',target:['d4','g7'],task:'Przesuń hetmana po przekątnej z d4 na g7.',hint:'Przekątna prowadzi przez e5 i f6 do g7.'},
{title:'Wyjątkowy skoczek',text:'Skoczek wykonuje ruch w kształcie litery L: dwa pola w jednym kierunku i jedno w bok. Może przeskakiwać inne figury. Po każdym ruchu trafia na pole innego koloru.',fen:'7k/8/8/8/3N4/8/8/K7 w - - 0 1',type:'move',target:['d4','f5'],task:'Przeskocz skoczkiem z d4 na f5.',hint:'Dwa pola w prawo i jedno do góry — to pole f5.'},
{title:'Piony: ruch i bicie',text:'Biały pion idzie w kierunku ósmego rzędu. Porusza się o jedno pole prosto, a ze swojego pola startowego może ruszyć o dwa, jeśli droga jest wolna. Bije o jedno pole po przekątnej do przodu.',fen:'7k/8/8/3p4/4P3/8/8/K7 w - - 0 1',type:'move',target:['e4','d5'],task:'Zbij czarnego piona na d5 pionem z e4.',hint:'Pion bije po przekątnej, a nie prosto przed siebie.'}]},
{title:'Zadbaj o króla',icon:'♚',badge:'Strażnik króla',lessons:[
{title:'Ucieczka spod szacha',text:'Szach oznacza, że król jest atakowany. Trzeba odpowiedzieć od razu. Możesz odejść królem, zbić atakującą figurę lub zasłonić linię ataku, jeśli pozycja na to pozwala.',fen:'4r2k/8/8/8/8/8/8/4K3 w - - 0 1',type:'move',target:['e1','d1'],task:'Wieża szachuje po linii e. Odsuń króla z e1 na d1.',hint:'Pole d1 leży poza kolumną atakowaną przez wieżę.'},
{title:'Twój pierwszy mat',text:'Mat to szach, przed którym nie ma legalnej obrony. Spójrz: czarny król jest na h8, a biały król na f6 chroni pola wokół g7.',fen:'7k/8/5KQ1/8/8/8/8/8 w - - 0 1',type:'move',target:['g6','g7'],task:'Daj mata: przesuń hetmana z g6 na g7.',hint:'Na g7 hetman szachuje i odbiera pola ucieczki. Chroni go biały król.'},
{title:'Pat to remis',text:'Pat występuje, gdy gracz nie ma żadnego legalnego ruchu, ale jego król nie jest szachowany. To remis. W tej pozycji ruch mają czarne: król na h8 nie jest atakowany, ale nie ma dokąd pójść.',fen:'7k/5K2/6Q1/8/8/8/8/8 b - - 0 1',type:'quiz',question:'Jak kończy się ta pozycja przy ruchu czarnych?',options:['Wygraną białych — mat','Remisem — pat','Czarne muszą pominąć ruch'],answer:1,explain:'Król nie jest szachowany i nie ma legalnego ruchu. To pat, czyli remis.'}]},
{title:'Zasady specjalne',icon:'♜',badge:'Zasady opanowane',lessons:[
{title:'Roszada',text:'Roszada to wspólny ruch króla i wieży. Król przesuwa się o dwa pola w stronę wieży, a wieża staje obok niego z drugiej strony. Obie figury nie mogły się wcześniej ruszać. Droga musi być wolna, a król nie może być szachowany ani przejść przez atakowane pole.',fen:'4k3/8/8/8/8/8/8/4K2R w K - 0 1',type:'move',target:['e1','g1'],task:'Wykonaj krótką roszadę: przesuń króla z e1 na g1.',hint:'Kliknij króla, potem g1. Wieża automatycznie przejdzie z h1 na f1.'},
{title:'Promocja piona',text:'Gdy pion dotrze do ostatniego rzędu, zamienia się w hetmana, wieżę, gońca lub skoczka. Zwykle wybieramy hetmana. W ćwiczeniach i grze możesz wybrać figurę promocji.',fen:'7k/P7/8/8/8/8/8/7K w - - 0 1',type:'move',target:['a7','a8'],task:'Doprowadź piona z a7 na a8 i wybierz hetmana.',hint:'Pion jest o krok od ostatniego rzędu.',promotion:'q'},
{title:'Bicie w przelocie',text:'Jeśli pion przeciwnika ruszy ze startu o dwa pola i stanie obok Twojego piona na piątym rzędzie (dla białych), możesz zbić go tak, jakby przesunął się tylko o jedno pole. Ten ruch jest możliwy wyłącznie od razu po jego ruchu.',fen:'7k/8/8/3pP3/8/8/8/K7 w - d6 0 2',type:'move',target:['e5','d6'],task:'Czarne właśnie zagrały d7–d5. Zbij w przelocie: e5–d6.',hint:'Biały pion idzie na d6, a czarny pion znika z d5.'},
{title:'Kiedy partia jest remisowa?',text:'Oprócz pata remis może nastąpić m.in. przy braku materiału do dania mata, po uzgodnieniu graczy lub przy powtarzaniu pozycji. W szachach turniejowych część remisów wymaga zgłoszenia; nasz trening kończy partię automatycznie po trzecim wystąpieniu tej samej pozycji lub 50 ruchach każdej strony bez bicia i ruchu pionem.',fen:'7k/8/8/8/8/8/8/K7 w - - 0 1',type:'quiz',question:'Na planszy zostały tylko dwa króle. Jaki jest wynik?',options:['Gra trwa do zbicia króla','Remis — nie da się dać mata','Wygrywa strona mająca ruch'],answer:1,explain:'Dwa samotne króle nie mogą dać sobie mata. Partia jest remisowa.'}]},
{title:'Graj z pomysłem',icon:'♝',badge:'Pierwszy plan',lessons:[
{title:'Zauważ zagrożenie',text:'Przed własnym ruchem sprawdź, co atakuje przeciwnik. Niechroniona figura może zostać zbita. W tej pozycji czarna wieża na d8 atakuje Twoją wieżę na d4.',fen:'3r3k/8/8/8/3R4/8/8/K7 w - - 0 1',type:'move',target:['d4','d8'],task:'Usuń zagrożenie: zbij czarną wieżę na d8.',hint:'Twoja wieża także atakuje po kolumnie d. Możesz zbić napastnika.'},
{title:'Wartość figur',text:'Orientacyjne wartości pomagają oceniać wymiany: pion 1, skoczek 3, goniec 3, wieża 5, hetman 9. Król nie ma ceny. Pozycja i bezpieczeństwo króla mogą być ważniejsze od samych punktów.',fen:'start',type:'quiz',question:'Która figura ma zwykle największą wartość materialną?',options:['Wieża','Hetman','Skoczek'],answer:1,explain:'Hetman jest wart orientacyjnie 9 pionów. Pamiętaj jednak o konkretnej pozycji.'},
{title:'Dobry początek partii',text:'Na początku walcz o centrum, wprowadzaj skoczki i gońce do gry i przygotuj bezpieczeństwo króla. Nie musisz znać długich wariantów. Zacznij od ruchu, który pomaga figurom działać.',fen:'start',type:'move',target:['e2','e4'],task:'Zajmij centrum pionem: zagraj e2–e4.',hint:'Pierwszy ruch piona może wynosić dwa pola. Ruch e4 otwiera drogę gońcowi i hetmanowi.'}]},
{title:'Twoja pierwsza partia',icon:'✧',badge:'Pierwsza partia',lessons:[
{title:'Rutyna przed ruchem',text:'Daj sobie chwilę przed każdym ruchem. Zapytaj: czy mój król jest bezpieczny? Co grozi przeciwnik? Czy po moim ruchu jakaś figura zostanie bez obrony?',fen:'start',type:'quiz',question:'Co warto zrobić przed wykonaniem ruchu?',options:['Zagrać jak najszybciej','Sprawdzić zagrożenia i skutki swojego ruchu','Zawsze ruszyć hetmanem'],answer:1,explain:'Krótka kontrola zagrożeń pomaga uniknąć wielu prostych błędów.'},
{title:'Zagraj bez pośpiechu',text:'Czas wykorzystać to, czego się nauczyłeś. W grze treningowej grasz białymi, bez zegara. Możesz prosić o wskazówkę i cofać ruchy. Nie musisz wygrać, żeby zrobić postęp.',fen:'start',type:'game',task:'Rozegraj partię do zakończenia. Wróć tutaj, aby zobaczyć postępy.'}]}];
const all=units.flatMap((u,ui)=>u.lessons.map((l,li)=>({...l,id:`${ui}-${li}`,ui,li})));
const puzzles=[
{id:'mate1',title:'Ostatni krok do mata',category:'Mat w jednym',level:'Początkujący',fen:'7k/8/5KQ1/8/8/8/8/8 w - - 0 1',target:['g6','g7'],text:'Białe zaczynają. Znajdź ruch, który kończy partię.',hint:'Hetman na g7 jest chroniony przez króla.'},
{id:'hanging',title:'Prezent od przeciwnika',category:'Zdobywanie figur',level:'Początkujący',fen:'7k/8/8/8/3q4/8/8/K2R4 w - - 0 1',target:['d1','d4'],text:'Czarny hetman pozostał bez obrony. Znajdź najlepsze bicie.',hint:'Wieża może zbić hetmana w tej samej kolumnie.'},
{id:'backrank',title:'Mat na ostatniej linii',category:'Mat w jednym',level:'Podstawowy',fen:'6k1/5ppp/8/8/8/8/8/K3R3 w - - 0 1',target:['e1','e8'],text:'Czarny król jest zamknięty przez własne piony. Daj mata.',hint:'Wieża na e8 odcina całą ósmą linię.'},
{id:'forkreal',title:'Skoczek atakuje podwójnie',category:'Podwójny atak',level:'Podstawowy',fen:'8/3r3k/8/8/4N3/8/8/K7 w - - 0 1',target:['e4','f6'],text:'Znajdź szacha skoczkiem, który jednocześnie atakuje wieżę na d7.',hint:'Skoczek z f6 atakuje zarówno h7, jak i d7.'},
{id:'promotion',title:'Pion z wielkim planem',category:'Zdobywanie figur',level:'Początkujący',fen:'7k/P7/8/8/8/8/8/7K w - - 0 1',target:['a7','a8'],text:'Zamień przewagę piona w hetmana. Doprowadź go do końca planszy.',hint:'Przesuń pion na a8 i wybierz hetmana.',promotion:'q'},
{id:'bishop',title:'Przekątna okazja',category:'Zdobywanie figur',level:'Początkujący',fen:'7k/8/6r1/8/8/3B4/8/K7 w - - 0 1',target:['d3','g6'],text:'Znajdź niechronioną wieżę i zdobądź ją gońcem.',hint:'Z d3 przekątna biegnie przez e4 i f5 do g6.'}
];
const originalPuzzles=puzzles.slice();
const originalThemes={
 mate1:['mate','mateIn1'], hanging:['hangingPiece'], backrank:['mate','mateIn1','backRankMate'],
 forkreal:['fork'], promotion:['promotion'], bishop:['hangingPiece']
};
for(const p of originalPuzzles)p.themes=originalThemes[p.id];
for(const [i,p] of originalPuzzles.entries())p.rating=900+i*80;
const themesPL=puzzleThemes;
for(const row of lichessPuzzles){
 puzzles.push({
  id:'li_'+row.id,source:'lichess',title:'Znajdź najlepszą kontynuację',
  category:row.themes.map(t=>themesPL[t]).find(Boolean)||'Taktyka',
  rating:row.rating,fen:row.fen,line:row.line,themes:cleanPuzzleThemes(row.themes),
  text:'Znajdź i wykonaj całą taktyczną kontynuację. Po Twoim ruchu przeciwnik odpowie automatycznie.',
  hint:'Sprawdź szachy, bicia i groźby. Przyjrzyj się niebronionym figurom.'
 });
}
const openings=[{id:'italian',title:'Partia włoska',tag:'Otwarta gra · białe',pieces:'♝♞',desc:'Szybki rozwój figur i spojrzenie na słabe pole f7.',line:['e4','e5','Nf3','Nc6','Bc4','Bc5'],notes:['Zajmujesz centrum i otwierasz przekątną gońcowi.','Czarne również zajmują centrum.','Skoczek rozwija się i atakuje piona e5.','Czarne rozwijają skoczka i bronią piona e5.','Goniec patrzy na f7. To charakterystyczny ruch partii włoskiej.','Czarne rozwijają gońca. Dalej warto przygotować roszadę i walczyć o centrum.']},
{id:'queens',title:'Gambit hetmański',tag:'Zamknięta gra · białe',pieces:'♛♟',desc:'Walcz o centrum i buduj solidną pozycję.',line:['d4','d5','c4','e6','Nc3','Nf6'],notes:['Zajmujesz centrum i otwierasz drogę gońcowi.','Czarne odpowiadają symetrycznie.','Pion c4 naciska na d5. Tak powstaje gambit hetmański.','Czarne wzmacniają d5: to gambit hetmański nieprzyjęty.','Skoczek wywiera nacisk na centrum.','Czarne rozwijają figurę i kontrolują e4. Przygotuj rozwój gońca i roszadę.']},
{id:'sicilian',title:'Obrona sycylijska',tag:'Asymetryczna gra · czarne',pieces:'♞♟',desc:'Poznaj aktywną odpowiedź czarnych na pierwszy ruch e4.',line:['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6'],notes:['Białe zajmują centrum.','Czarne naciskają na d4 pionem z kolumny c. To obrona sycylijska.','Białe rozwijają skoczka.','Czarne wspierają centrum i otwierają drogę gońcowi.','Białe otwierają centrum.','Czarne wymieniają piona c na centralnego piona d.','Skoczek odbija piona i zajmuje aktywne pole.','Czarne atakują e4. Powstaje dynamiczna, asymetryczna pozycja.']}];
let state;try{state=JSON.parse(localStorage.getItem('akademia64-v1')||'{}')}catch{state={}}
state=normalizeProgress(state);
function save(){if(!accounts.saveProgress(state))toast('Przeglądarka nie pozwala zapisać postępów.');updateLevel()}
function today(){return localDay()}
function activity(){if(!state.days.includes(today()))state.days.push(today());save()}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');setTimeout(()=>$('#toast').classList.remove('visible'),3500)}
function dialog(title,text){$('#dialog-content').innerHTML=`<div class="eyebrow">AKADEMIA 64</div><h2>${title}</h2><p>${text}</p><button class="btn" id="dialog-ok">Rozumiem <span>→</span></button>`;$('#dialog').showModal();$('#dialog-ok').onclick=()=>$('#dialog').close()}
$('#dialog .dialog-close').onclick=()=>$('#dialog').close();$('#dialog').onclick=e=>{if(e.target===$('#dialog'))$('#dialog').close()};
for(const event of ['pointerup','click','keydown']){
 document.addEventListener(event,()=>{if($('#board-host'))unlockChessSound()},{capture:true,passive:true});
}
$('#help-button').onclick=()=>dialog('Twoja droga do dobrej gry','Zacznij od mapy nauki albo wybierz zadania. Na szachownicy kliknij figurę, a potem pole docelowe. Lekcje i trening są bez limitu czasu. Gra treningowa używa lokalnego przeciwnika komputerowego; rozmowa z trenerem AI nie jest jeszcze dostępna.');
$('#storage-info').onclick=()=>accounts.showStorageInfo();
$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').onclick=()=>{const open=$('.sidebar').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open))};
$('.sidebar nav').addEventListener('click',event=>{
 const link=event.target.closest('[data-nav]');
 const toggle=$('.menu-toggle');
 if(link?.hash===(location.hash||'#home')&&toggle.getAttribute('aria-expanded')==='true'){
  toggle.click();
  toggle.focus();
 }
});
function updateLevel(){$('#level-name').textContent='Poziom '+academyLevel(state,completedEndgames().size).level}
function progress(){return Math.round(state.done.length/all.length*100)}
function nextLesson(){return all.find(l=>!state.done.includes(l.id))||all[0]}
function pieceHTML(type,color){return `<span class="piece ${color==='w'?'white':''}" data-piece-type="${type}">${icons[type]}</span>`}
function mini(position='start',marked=[]){
 const board=position instanceof Chess?position:position==='start'?new Chess():new Chess(position);
 return `<div class="mini-board" aria-hidden="true">${board.board().flatMap((row,r)=>row.map((piece,c)=>`<span class="${(r+c)%2?'dark':''} ${marked.includes('abcdefgh'[c]+(8-r))?'marked':''}">${piece?pieceHTML(piece.type,piece.color):''}</span>`)).join('')}</div>`;
}
let stopOpeningPreviews;
function startOpeningPreviews(container,library){
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const previews=Array.from(container.querySelectorAll('[data-opening-preview]'),host=>{
  const {line}=library.getOpening(host.dataset.openingPreview,Chess);
  const board=new Chess();
  const frames=[{fen:board.fen(),marked:[],label:'Start'}];
  line.forEach((san,index)=>{
   const {from,to}=board.move(san);
   frames.push({fen:board.fen(),marked:[from,to],label:Math.floor(index/2+1)+(index%2?'… ':'. ')+san});
  });
  let index;
  function render(next){
   index=next;
   const {fen,marked,label}=frames[index];
   host.querySelector('.opening-preview-board').innerHTML=mini(fen,marked);
   host.querySelector('.opening-preview-move').textContent=label;
  }
  render(reducedMotion.matches?frames.length-1:0);
  return {host,advance(){render((index+1)%frames.length);return index===frames.length-1?1550:650},renderLast(){render(frames.length-1)},timer:null};
 });
 function stop(preview){clearTimeout(preview.timer);preview.timer=null}
 function start(preview){
  if(preview.timer!==null)return;
  if(reducedMotion.matches){preview.renderLast();return}
  const tick=()=>{preview.timer=setTimeout(tick,preview.advance())};
  preview.timer=setTimeout(tick,650);
 }
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   const preview=previews.find(item=>item.host===entry.target);
   if(entry.isIntersecting)start(preview);else stop(preview);
  }
 });
 for(const preview of previews)observer.observe(preview.host);
 const motionChanged=()=>{
  for(const preview of previews){
   stop(preview);
   if(reducedMotion.matches)preview.renderLast();
   observer.unobserve(preview.host);
   observer.observe(preview.host);
  }
 };
 reducedMotion.addEventListener('change',motionChanged);
 stopOpeningPreviews=()=>{
  observer.disconnect();
  for(const preview of previews)stop(preview);
  reducedMotion.removeEventListener('change',motionChanged);
 };
}
function openingDiagram(moves,marked,caption){
 const position=new Chess();
 moves.forEach(move=>position.move(move));
 return `<figure class="opening-diagram">${mini(position,marked)}<figcaption>${caption}</figcaption></figure>`;
}
function pathHTML(){return `<div class="path modern-path">${units.map((u,i)=>{const count=u.lessons.filter((l,j)=>state.done.includes(`${i}-${j}`)).length;const lesson=u.lessons.findIndex((l,j)=>!state.done.includes(`${i}-${j}`));const current=nextLesson().ui===i;return `<a href="#lesson/${i}-${lesson<0?0:lesson}" class="path-node ${count===u.lessons.length?'done':current?'current':''}"><div class="path-node-top"><span class="node-circle">${count===u.lessons.length?'✓':u.icon}</span><span class="stage-number">0${i+1}</span></div><strong>${['Szachownica','Twoja armia','Bezpieczny król','Zasady specjalne','Plan gry','Pierwsza partia'][i]}</strong><div class="stage-meta"><span>${count} / ${u.lessons.length} lekcji</span><span>${current?'Teraz':count===u.lessons.length?'Ukończone':'→'}</span></div><div class="progress"><span style="width:${count/u.lessons.length*100}%"></span></div></a>`}).join('')}</div>`}
function home(){
 queueMicrotask(updatePuzzleBankCount);
 const l=nextLesson(),percent=progress();
 const dayTasks=[state.done.length>0,state.solved.length>0,state.games>0].filter(Boolean).length;
 main.innerHTML=`<header class="academy-banner"><div class="banner-copy"><div class="banner-kicker"><span></span> AKADEMIA 64 <span class="banner-kicker-line"></span> SZTUKA DOBREGO RUCHU</div><h1>Wielka gra.<br><em>Zaczyna się od Ciebie.</em></h1><p>Odkrywaj, ćwicz, graj. Z każdym ruchem buduj swoją szachową pewność.</p><a class="banner-link" href="#learn">Odkryj swoją ścieżkę <span aria-hidden="true">↗</span></a></div><div class="banner-art" aria-hidden="true"><div class="banner-halo"></div><div class="banner-board"></div><svg class="banner-chess" viewBox="0 0 380 300" fill="none"><defs><linearGradient id="ivory-piece" x1="160" y1="60" x2="260" y2="260" gradientUnits="userSpaceOnUse"><stop stop-color="#fff7da"/><stop offset=".5" stop-color="#e6d2a4"/><stop offset="1" stop-color="#a58c58"/></linearGradient><linearGradient id="green-piece" x1="40" y1="100" x2="180" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#819b74"/><stop offset="1" stop-color="#273f30"/></linearGradient></defs><ellipse cx="225" cy="264" rx="95" ry="13" fill="#091c15" opacity=".35"/><ellipse cx="107" cy="269" rx="63" ry="10" fill="#091c15" opacity=".3"/><g fill="url(#green-piece)" stroke="#b3c5a0" stroke-width="1.2" stroke-linejoin="round"><path d="M61 243c0-4 3-7 7-7h80c4 0 7 3 7 7l7 13c1 3-1 6-4 6H58c-4 0-5-3-4-6l7-13Z"/><path d="M94 168h28c-1 28 1 45 18 62H76c17-17 19-34 18-62Z"/><rect x="85" y="157" width="46" height="12" rx="5"/><path d="M108 103c-9 11-27 24-27 37 0 12 12 19 27 19s27-7 27-19c0-13-18-26-27-37Z"/><circle cx="108" cy="96" r="7"/><path d="M73 229h70c5 0 8 3 8 7v4H65v-4c0-4 3-7 8-7Z"/></g><path d="m113 116-13 24" stroke="#243e2b" stroke-width="4.5" stroke-linecap="round"/><path d="M119 126c5 5 8 10 8 15 0 6-4 10-10 12M99 177c0 18-2 32-8 43M72 247h70" stroke="#c2d2ad" stroke-width="2" stroke-linecap="round" opacity=".5"/><g fill="url(#ivory-piece)" stroke="#f5e7bf" stroke-width="1.1"><path d="M193 52h17V35h13v17h17v13h-17v24h-13V65h-17V52Z"/><path d="m184 97 13-12h40l13 12-10 35h-47l-9-35Z"/><path d="M196 142h41c-1 38 0 60 23 83h-87c23-23 24-45 23-83Z"/><rect x="187" y="131" width="59" height="12" rx="5"/><path d="M175 225h83l12 18H164l11-18Z"/><rect x="157" y="244" width="121" height="17" rx="6"/></g><path d="M202 153c0 25-2 42-10 57M199 99h33" stroke="#fff8e1" stroke-width="3" stroke-linecap="round" opacity=".55"/></svg><span class="banner-coordinate coordinate-a">a</span><span class="banner-coordinate coordinate-h">h</span><span class="banner-art-label">64 POLA. NIESKOŃCZENIE MOŻLIWOŚCI.</span></div></header>
 <div class="hero-grid"><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="hero-status-dot"></span> ${state.done.length?'KONTYNUUJ SWOJĄ ŚCIEŻKĘ':'ZACZNIJ OD MAŁEGO KROKU'}</div><h2>${state.done.length?l.title:'Poznaj grę.<br>Odkryj możliwości.'}</h2><p>${state.done.length?'Kolejna lekcja, kolejna umiejętność. Wróć dokładnie tam, gdzie kończy się Twój ostatni trening.':'Szachy zaczynają się od jednego ruchu. Przejdziemy z Tobą całą drogę — od zasad po pierwszą partię.'}</p><div class="hero-meta"><span>◷ &nbsp; 5–8 min</span><span class="hero-meta-divider"></span><span>Interaktywna lekcja</span></div><a class="btn light" href="#lesson/${l.id}">${state.done.length?'Kontynuuj naukę':'Rozpocznij naukę'} <span>↗</span></a><div class="hero-course-note">OD ZERA DO PIERWSZEJ PARTII <span>·</span> ${percent}% ukończone</div></div><div class="hero-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="hero-board-wrap">${mini('r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4')}</div><div class="board-floating-note"><span>♞</span><div>Każda partia to nowy początek.<small>Zrób swój pierwszy ruch.</small></div></div></div></section>
 <section class="daily-card"><div class="card-heading"><div><div class="eyebrow">MAŁY PLAN, DUŻY POSTĘP</div><h3>Dobry rytm nauki</h3></div><span class="daily-count">${dayTasks}<small>/3</small></span></div><div class="daily-list"><a class="daily-item" href="#lesson/${l.id}"><span class="step-icon ${state.done.length?'completed':''}">${state.done.length?'✓':'01'}</span><div><strong>Poznaj nowy temat</strong><small>${l.title}</small></div><span>↗</span></a><a class="daily-item" href="#puzzles"><span class="step-icon ${state.solved.length?'completed':''}">${state.solved.length?'✓':'02'}</span><div><strong>Znajdź dobry ruch</strong><small>Krótkie zadanie na rozgrzewkę</small></div><span>↗</span></a><a class="daily-item" href="#play"><span class="step-icon ${state.games?'completed':''}">${state.games?'✓':'03'}</span><div><strong>Zagraj bez pośpiechu</strong><small>Partia treningowa bez zegara</small></div><span>↗</span></a></div><div class="daily-footer"><a class="btn outline" href="#training">Ułóż plan treningowy →</a></div></section></div>
 <div class="stats"><a href="#learn" class="stat"><div><div class="stat-name">Ukończone lekcje</div><div class="stat-value">${state.done.length}<small> / ${all.length}</small></div><span class="stat-detail">Budujesz solidne podstawy</span></div><span class="stat-icon">▤</span></a><a href="#puzzles" class="stat"><div><div class="stat-name">Rozwiązane zadania</div><div class="stat-value">${state.solved.length}<small data-puzzle-count data-prefix=" / "></small></div><span class="stat-detail">Trenujesz szachową intuicję</span></div><span class="stat-icon">♟</span></a><div class="stat"><div><div class="stat-name">Zdobyte odznaki</div><div class="stat-value">${earnedCount()}<small> / ${units.length+1}</small></div></div><span class="stat-icon" aria-hidden="true">✧</span></div></div>
 <div class="dashboard-bottom"><section class="course-section"><div class="section-heading"><div><div class="eyebrow">KROK PO KROKU</div><h2>Twoja mapa nauki</h2></div><a class="text-link" href="#learn">Cały kurs <span>↗</span></a></div><div class="course-overview"><div class="course-top"><div><h3>Od zera do pierwszej partii</h3><p>6 etapów <span>·</span> ${all.length} praktycznych lekcji</p></div><span class="course-tag">PODSTAWY</span></div>${pathHTML()}<div class="course-bottom"><div class="course-progress-info"><strong>${percent}%</strong><span>Twojej pierwszej ścieżki</span></div><a class="text-link" href="#lesson/${l.id}">Zrób kolejny krok <span>→</span></a></div></div></section><section class="insight-section"><div class="section-heading"><div><div class="eyebrow">CHWILA NA REFLEKSJĘ</div><h2>Przy szachownicy</h2></div><span class="tiny">✧</span></div><div class="quote-card"><div class="insight-mark">“</div><div class="eyebrow">WARTO ZAPAMIĘTAĆ</div><blockquote>Dobry ruch zaczyna się od dobrego pytania.</blockquote><p>Co grozi przeciwnik? Zanim przesuniesz figurę, daj sobie chwilę na spojrzenie na całą planszę.</p><a class="text-link" href="#play">Sprawdź to w grze <span>↗</span></a><span class="quote-piece" aria-hidden="true">♞</span></div></section></div>`;
}
function earned(i){return units[i].lessons.every((l,j)=>state.done.includes(`${i}-${j}`))}function earnedCount(){return units.filter((u,i)=>earned(i)).length+Number(completedEndgames().size===endgames.length)}
function learn(){main.innerHTML=`<div class="page-intro"><div class="eyebrow">TWOJA ŚCIEŻKA</div><h1>Małe kroki. Solidne podstawy.</h1><p>Od pierwszego ruchu do samodzielnej partii. Idź po kolei lub wybierz temat, który Cię ciekawi.</p></div><div class="map-summary"><div><h3>Od zera do pierwszej partii</h3><p>${state.done.length} z ${all.length} lekcji · ${units.length} etapów</p></div><div><div class="progress-label"><span>Twój postęp</span><span>${progress()}%</span></div><div class="progress"><span style="width:${progress()}%"></span></div></div></div><a href="#endgames" class="lesson-link endgame-entry"><span class="lesson-status">♔</span><span><strong>Akademia końcówek</strong><br>Maty, piony i wieże</span><small>6 lekcji →</small></a><div class="units">${units.map((u,i)=>`<section class="unit"><div class="unit-header"><div class="unit-emblem">${u.icon}</div><div><div class="eyebrow">ETAP 0${i+1}</div><h2>${u.title}</h2></div></div>${u.lessons.map((l,j)=>`<a class="lesson-link ${state.done.includes(`${i}-${j}`)?'done':''}" href="#lesson/${i}-${j}"><span class="lesson-status">${state.done.includes(`${i}-${j}`)?'✓':j+1}</span><span>${l.title}</span><small>${l.type==='game'?'Partia':'5–8 min'} &nbsp; →</small></a>`).join('')}<div class="badge-row">✧ &nbsp; ${earned(i)?'Zdobyta odznaka:':'Odznaka etapu:'} ${u.badge}</div></section>`).join('')}</div>`}
let game=null,selected=null,targets=[],lastMove=null,context=null,solvedNow=false,aiTimer=null,gameToken=0,openingStep=0,openingMode='show',hintCount=0;
function freeAnalysis(){return context?.kind==='analysis'&&!context.imported}
function boardHTML(g,highlight=lastMove,outcome=null){
 const flipped=context?.flipped;
 const live=context?.reviewPly==null||freeAnalysis();
 const position=g.board();
 const squares=position.flatMap((row,viewRow)=>row.map((_,viewCol)=>{
  const r=flipped?7-viewRow:viewRow,c=flipped?7-viewCol:viewCol;
  const piece=position[r][c];
  const square='abcdefgh'[c]+(8-r);
  const result=piece?.type==='k'&&outcome?(outcome==='draw'?'draw':piece.color===outcome?'win':'loss'):'';
  const player={win:', zwycięzca',loss:', przegrany',draw:', remis'}[result]??'';
  const symbol=result==='draw'?'½':'⚑';
  const description=piece?', '+(piece.color==='w'?'biały':'czarny')+' '+names[piece.type]:', puste pole';
  const target=live&&targets.includes(square)&&(context?.kind!=='play'||$('#show-targets')?.checked!==false);
  return '<button '+(context?.imported?'disabled ':'')+
   'class="square '+((r+c)%2?'dark ':'')+(live&&selected===square?'selected ':'')+(target?'target ':'')+(highlight?.includes(square)?'last':'')+
   '" data-square="'+square+'" aria-label="'+square+description+player+'">'+
   (piece?pieceHTML(piece.type,piece.color):'')+
   (result?'<span class="king-result '+result+'" aria-hidden="true">'+symbol+'</span>':'')+
   (viewCol===0?'<span class="coord rank">'+(8-r)+'</span>':'')+
   (viewRow===7?'<span class="coord">'+'abcdefgh'[c]+'</span>':'')+'</button>';
 }));
 const mode=context?.imported?'analysis-replay':context?.kind==='puzzle'?'puzzle-board':'';
 return '<div class="board '+mode+'" role="group" aria-label="Interaktywna szachownica">'+squares.join('')+'</div>';
}
function canDragPiece(sq){if(solvedNow||!game||!context||context.imported||context.reviewPly!=null&&!freeAnalysis())return false;if(context.kind==='opening'&&(openingMode==='show'||openingStep>=context.item.line.length))return false;if(context.kind==='endgame'&&game.turn()!==context.side)return false;if(context.kind==='play'&&(game.turn()!=='w'||game.isGameOver()))return false;if(context.kind==='lesson'&&['square','quiz','game'].includes(context.item.type))return false;return game.get(sq)?.color===game.turn()}
function drawBoard(){
 if(!$('#board-host'))return;
 const preview=context?.positions?.[context.reviewPly];
 const boardGame=preview&&!freeAnalysis()?new Chess(preview.fen):game;
 $('#board-host').innerHTML=boardHTML(boardGame,preview?preview.move:lastMove,boardOutcome(boardGame,preview));
 updateBoardNavigation();
 boardInput.attach($('#board-host .board'),{position:boardGame.fen(),flipped:context?.flipped,drawing:context?.drawing,suggestion:context?.suggestion,pieceAt:sq=>boardGame.get(sq),playerColor:context?.kind==='play'?'w':boardGame.turn(),canDrag:canDragPiece,click:clickSquare,move:(from,to)=>{if(!canDragPiece(from))return;selected=from;targets=game.moves({square:from,verbose:true}).map(m=>m.to);clickSquare(to)}})}
function boardOutcome(position,preview){
 if(position.isCheckmate())return position.turn()==='w'?'b':'w';
 if(context.imported){
  return preview?null:context.importOutcome??(position.isDraw()?'draw':null);
 }
 const canDraw=['play','analysis','endgame'].includes(context.kind)||context.kind==='puzzle'&&solvedNow;
 return canDraw&&position.isDraw()?'draw':null;
}
function setupBoard(fen){puzzleAnalysis?.abort();cancelPromotion?.();boardInput.reset();game=fen==='start'?new Chess():new Chess(fen);context.positions=[{fen:game.fen(),move:null}];context.reviewPly=null;selected=null;targets=[];lastMove=null;solvedNow=false}
function practiceShell(panel,label='Ćwiczenie',bottom='Białe · Twój ruch'){main.innerHTML=`<a href="${context.kind==='lesson'?'#learn':context.kind==='puzzle'?'#puzzles':context.kind==='opening'?'#openings':context.kind==='endgame'?'#endgames':'#home'}" class="back-link">← &nbsp; ${context.kind==='lesson'?'Wróć do mapy':context.kind==='puzzle'?'Miszmasz':context.kind==='opening'?'Wszystkie debiuty':context.kind==='endgame'?'Akademia końcówek':'Moja akademia'}</a><div class="practice-layout" data-activity="${context.kind}"><section class="board-card"><div class="board-label"><span>${label}</span><span id="board-top">${context.kind==='play'?'Komputer · czarne':'Odkrywaj na szachownicy'}</span></div>${context.kind==='analysis'?analysisBoardMarkup():'<div id="board-host"></div>'}<div class="board-label bottom"><span id="board-bottom">${bottom}</span><span id="board-review" aria-live="polite" hidden></span>${boardControls()}</div></section><section class="lesson-panel">${panel}</section></div>`;bindBoardControls();drawBoard()}
const boardNavigation=[
 ['first','Do początku','M6 5v14M18 6l-6 6 6 6'],
 ['previous','Ruch wstecz','M15 6l-6 6 6 6'],
 ['next','Ruch naprzód','M9 6l6 6-6 6'],
 ['last','Do końca','M18 5v14M6 6l6 6-6 6']
];
function boardControls(){
 const navigation=boardNavigation.map(([action,label,path])=>`<button class="board-control-button" type="button" data-board-nav="${action}" aria-label="${label}" title="${label}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`).join('');
 return `<div class="board-controls" role="group" aria-label="Sterowanie szachownicą">${navigation}<button class="board-control-button" id="flip-board" type="button" aria-label="Odwróć szachownicę" aria-pressed="${Boolean(context.flipped)}" title="Odwróć szachownicę"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M4 9a8 8 0 0 1 13.7-3.8L20 7.5M20 3v4.5h-4.5M20 15a8 8 0 0 1-13.7 3.8L4 16.5M4 21v-4.5h4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="8" y="8" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.25"/><path d="M8 8h4v4H8zm4 4h4v4h-4z" fill="currentColor"/></svg></button><button class="board-control-button" id="chess-sound-settings" type="button" aria-label="Ustawienia dźwięku" title="Ustawienia dźwięku" aria-haspopup="dialog"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12 0a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
}
function bindBoardControls(){
 $('#chess-sound-settings').onclick=()=>openSoundSettings($('#dialog'),$('#dialog-content'));
 for(const [action] of boardNavigation){
  $('[data-board-nav="'+action+'"]').onclick=()=>showBoardPosition(action);
 }
 $('#flip-board').onclick=event=>{
  cancelPromotion?.();
  context.flipped=!context.flipped;
  if(context.kind==='analysis')$('#analysis-board').dataset.flipped=String(context.flipped);
  event.currentTarget.setAttribute('aria-pressed',String(context.flipped));
  drawBoard();
 };
}
function boardNavigationRange(){
 if(context.kind==='opening'&&openingMode==='trainer')return {current:openingStep,last:openingStep,locked:true};
 if(context.kind==='opening'&&openingMode==='show')return {current:openingStep,last:context.item.line.length};
 const last=context.positions.length-1;
 return {current:context.reviewPly??last,last};
}
function updateBoardNavigation(){
 const {current,last,locked}=boardNavigationRange();
 for(const [action] of boardNavigation){
  $('[data-board-nav="'+action+'"]').disabled=Boolean(locked)||(action==='first'||action==='previous'?current===0:current===last);
 }
 const reviewing=context.reviewPly!=null;
 $('#board-bottom').hidden=reviewing;
 const review=$('#board-review');
 review.hidden=!reviewing;
 review.textContent=reviewing?`Pozycja ${current} z ${last}`:'';
}
function showBoardPosition(action){
 const {current,last,locked}=boardNavigationRange();
 if(locked)return;
 const destination={first:0,previous:current-1,next:current+1,last}[action];
 if(destination<0||destination>last||destination===current)return;
 if(context.kind==='opening'&&openingMode==='show'){goToOpeningStep(destination);return}
 if(context.kind==='analysis'){navigateAnalysis(destination);return}
 cancelPromotion?.();
 selected=null;targets=[];
 context.reviewPly=destination===last?null:destination;
 drawBoard();
}
function moveOnBoard(move,sound={}){
 const played=game.move(move);
 if(played){
  context.positions.push({fen:game.fen(),move:[played.from,played.to]});
  if(sound)soundMove(played,{...sound,mate:game.isCheckmate()});
 }
 return played;
}
function undoBoardMove(){
 if(game.undo())context.positions.pop();
 context.reviewPly=null;
}
function feedback(text,kind=''){const el=$('#feedback');if(el){el.textContent=text;el.className='feedback '+kind}}
function lesson(id){const l=all.find(x=>x.id===id);if(!l){location.hash='learn';return}context={kind:'lesson',item:l};hintCount=0;setupBoard(l.fen);practiceShell(`<div class="eyebrow">ETAP ${l.ui+1} · ${units[l.ui].title}</div><div class="lesson-counter">Lekcja ${all.indexOf(l)+1} z ${all.length}<div class="progress"><span style="width:${(all.indexOf(l)+1)/all.length*100}%"></span></div></div><h2>${l.title}</h2><p>${l.text}</p>${l.type==='quiz'?`<div class="instruction">${l.question}</div><div class="quiz-options">${l.options.map((o,i)=>`<button class="quiz-option" data-answer="${i}">${o}</button>`).join('')}</div>`:`<div class="instruction">${l.task}</div>`}<div id="feedback" class="feedback">${state.done.includes(id)?'Ta lekcja jest już ukończona. Możesz ją powtórzyć.':l.type==='quiz'?'Wybierz odpowiedź.':l.type==='game'?'Twoja pierwsza pełna partia czeka.':'Spróbuj samodzielnie. W razie potrzeby skorzystaj z podpowiedzi.'}</div><div class="lesson-actions">${l.type==='game'?`<a class="btn" href="#play">Rozpocznij partię →</a>`:`<button class="btn" id="next-lesson" hidden>Dalej →</button>${l.type!=='quiz'?'<button class="btn outline" id="hint">Podpowiedź</button>':''}<button class="text-link" id="reset-exercise">Od początku</button>`}</div>`,l.type==='quiz'?'Spójrz na pozycję':'Twoja lekcja',l.fen.includes(' b ')?'Czarne · analiza pozycji':'Białe · ćwiczenie');
if(l.type==='quiz')document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(solvedNow)return;if(+b.dataset.answer===l.answer){b.classList.add('correct');success(l.explain)}else feedback('To jeszcze nie ta odpowiedź. Spójrz ponownie na wyjaśnienie i spróbuj jeszcze raz.','error')});if($('#hint'))$('#hint').onclick=()=>{hintCount++;feedback(l.hint);};if($('#reset-exercise'))$('#reset-exercise').onclick=()=>lesson(id);
}
function success(message){solvedNow=true;selected=null;targets=[];drawBoard();feedback(message||'Świetnie! Ten ruch wykonuje zadanie.','success');activity();if(context.kind==='lesson'){const before=earned(context.item.ui);if(!state.done.includes(context.item.id))state.done.push(context.item.id);save();if(!before&&earned(context.item.ui))toast(`✧ Nowa odznaka: ${units[context.item.ui].badge}`);const next=all[all.indexOf(context.item)+1];const b=$('#next-lesson');if(b){b.hidden=false;b.textContent=next?'Następna lekcja →':'Wróć do mapy →';b.onclick=()=>{location.hash=next?`lesson/${next.id}`:'learn'}}}else if(context.kind==='puzzle'){if(!state.solved.includes(context.item.id))state.solved.push(context.item.id);save();finishPuzzle()}}
let cancelPromotion=null;
function promotionFor(from,to){
 const pawn=game.get(from);if(pawn?.type!=='p'||!['8','1'].includes(to[1]))return Promise.resolve('q');
 return new Promise(resolve=>{
  const board=$('#board-host .board');if(!board){resolve(null);return}
  const overlay=document.createElement('div');overlay.className='promotion-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Wybierz figurę do promocji');
  const file=to.charCodeAt(0)-97;
  const atTop=(to[1]==='8')!==Boolean(context.flipped);
  const column=document.createElement('div');column.className='promotion-choices';
  column.style.left=((context.flipped?7-file:file)*12.5)+'%';
  column.style[atTop?'top':'bottom']='0';
  if(!atTop)column.style.flexDirection='column-reverse';
  let finished=false;const previous=document.activeElement;
  const finish=value=>{if(finished)return;finished=true;overlay.remove();cancelPromotion=null;resolve(value);if(previous?.isConnected)previous.focus()};cancelPromotion=()=>finish(null);
  for(const type of ['q','n','r','b']){const button=document.createElement('button');button.type='button';button.className='promotion-choice';button.setAttribute('aria-label',names[type]);button.innerHTML=pieceHTML(type,pawn.color);button.onclick=e=>{e.stopPropagation();finish(type)};column.append(button)}
  overlay.append(column);overlay.addEventListener('pointerdown',e=>e.stopPropagation());overlay.addEventListener('contextmenu',e=>e.preventDefault());overlay.addEventListener('click',e=>{e.stopPropagation();if(e.target===overlay)finish(null)});
  overlay.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();finish(null)}if(e.key==='Tab'){e.preventDefault();const buttons=[...column.children],i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?3:1))%4].focus()}});
  board.append(overlay);column.firstElementChild.focus();
 });
}

async function clickSquare(sq){if(cancelPromotion)return;if(solvedNow||!game||context?.imported||context?.reviewPly!=null&&!freeAnalysis())return;if(context.kind==='opening'&&(openingMode==='show'||openingStep>=context.item.line.length))return;if(context.kind==='endgame'&&game.turn()!==context.side)return;if(context.kind==='play'&&(game.turn()!=='w'||game.isGameOver()))return;
if(context.item?.type==='square'){if(sq===context.item.target)success('Dokładnie! h1 to jasny prawy dolny narożnik.');else feedback('Sprawdź literę kolumny i numer rzędu. Poszukaj pola h1.','error');return}
if(context.kind==='lesson'&&['quiz','game'].includes(context.item.type))return;
if(selected){const from=selected;const moves=game.moves({square:from,verbose:true});if(moves.some(m=>m.to===sq)){const activeGame=game,activeContext=context;const promotion=await promotionFor(from,sq);if(game!==activeGame||context!==activeContext)return;if(promotion===null)return;const move={from,to:sq,promotion};if(context.kind==='puzzle'){
 const ctx=context, expected=ctx.item.line?ctx.item.line[ctx.step]:ctx.item.target.join('')+(ctx.item.promotion||'');
 const uci=from+sq+(promotion||'');
 if(uci!==expected&&uci.slice(0,4)!==expected.slice(0,4)){
  soundMove(null,{answer:'incorrect'});
  recordTactic(false);
  feedback('Ten ruch nie jest rozwiązaniem. Ranking został rozliczony; możesz ćwiczyć dalej lub przejść do kolejnego zadania.','error');
  selected=null;targets=[];drawBoard();return;
 }
 if(expected.length===5&&promotion!==expected[4]){
  soundMove(null,{answer:'incorrect'});
  recordTactic(false);feedback('Wybierz właściwą figurę promocji.','error');selected=null;targets=[];drawBoard();return;
 }
 const played=moveOnBoard(move,null);
 if(!played)return;
 lastMove=[from,sq];selected=null;targets=[];
 if(!ctx.item.line||ctx.step===ctx.item.line.length-1){
  soundMove(played,{answer:'correct',mate:game.isCheckmate()});
  recordTactic(!ctx.assisted&&!ctx.failed);
  success(game.isCheckmate()?'Mat! Pełna kontynuacja rozwiązana.':'Świetnie! Cała kombinacja została rozwiązana.');
 }else{
  ctx.step++;
  const answer=ctx.item.line[ctx.step],reply=moveOnBoard({from:answer.slice(0,2),to:answer.slice(2,4),promotion:answer[4]||'q'},null);
  soundMove(played,{reply,answer:'correct',mate:game.isCheckmate()});
  if(!reply){feedback('Błąd danych zadania — odpowiedź przeciwnika jest nielegalna.','error');return}
  lastMove=[reply.from,reply.to];
  ctx.step++;drawBoard();
  feedback('Dobrze! Przeciwnik odpowiedział '+reply.san+'. Znajdź kolejny ruch.');
 }
 return;
}
if(context.kind==='lesson'){const t=context.item.target;if(from!==t[0]||sq!==t[1]||(context.item.promotion&&promotion!==context.item.promotion)){soundMove(null,{answer:'incorrect'});feedback('To legalny ruch, ale cel ćwiczenia jest inny. Spróbuj jeszcze raz.','error');selected=null;targets=[];drawBoard();return}moveOnBoard(move,{answer:'correct'});lastMove=[from,sq];success(game.isCheckmate()?'Mat! Król przeciwnika nie ma obrony. Doskonały ruch.':'Dobrze! Właśnie udało Ci się zastosować tę zasadę.');return}
if(context.kind==='opening'){playOpeningMove(move);return}
if(context.kind==='endgame'){playEndgameMove(move);return}
if(context.kind==='analysisExercise'){checkAnalysisExercise(move);return}
if(freeAnalysis()){playAnalysisMove(move);return}
if(context.kind==='play'){moveOnBoard(move);lastMove=[from,sq];selected=null;targets=[];activity();drawBoard();updateGame();if(!game.isGameOver())scheduleAI();return}}
}
const p=game.get(sq);if(p&&p.color===game.turn()){selected=sq;targets=game.moves({square:sq,verbose:true}).map(m=>m.to)}else{selected=null;targets=[]}drawBoard()}
let lichessIndex=null;
let puzzleIndexLoading=null;
const loadedPuzzleShards=new Set();
let mixedRequest=0;
async function loadPuzzleIndex(){
 if(lichessIndex)return lichessIndex;
 if(!puzzleIndexLoading)puzzleIndexLoading=fetch(new URL('puzzle-index.json',import.meta.url),{cache:'no-cache'}).then(r=>{
  if(!r.ok)throw Error('Baza zadań jest jeszcze przygotowywana.');
  return r.json();
 }).then(data=>{
  if(!data||!Number.isSafeInteger(data.count)||data.count<1||!Array.isArray(data.shards))throw Error('Niepoprawny indeks bazy zadań.');
  lichessIndex=data;
  return data;
 }).finally(()=>{puzzleIndexLoading=null;});
 return puzzleIndexLoading;
}
async function updatePuzzleBankCount(){
 const label=main.querySelector('[data-puzzle-count]');
 if(!label)return;
 try{
  const {count}=await loadPuzzleIndex();
  label.textContent=label.dataset.prefix+String(count).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
 }catch(error){
  console.warn('Baza zadań:',error);
 }
}
async function fetchPuzzleShard(rating,maxDistance){
 const index=await loadPuzzleIndex();
 const unused=index.shards.filter(item=>!loadedPuzzleShards.has(item.file));
 if(!unused.length)return false;
 const ordered=unused.map(item=>({...item,distance:rating<item.min?item.min-rating:rating>item.max?rating-item.max:0}))
  .sort((a,b)=>a.distance-b.distance);
 if(ordered[0].distance>maxDistance)return false;
 const options=ordered.filter(item=>item.distance===ordered[0].distance);
 const shard=options[Math.floor(Math.random()*options.length)];
 return loadPuzzleShard(shard);
}
async function loadPuzzleShard(shard,puzzleId){
 const response=await fetch(new URL('puzzles/'+encodeURIComponent(shard.file),import.meta.url));
 if(!response.ok)throw Error('Nie udało się pobrać paczki zadań.');
 const rows=await response.json();
 if(!Array.isArray(rows)||rows.length!==shard.count)throw Error('Uszkodzona paczka zadań.');
 const candidates=puzzleId?rows.filter(row=>'li_'+row?.[0]===puzzleId):rows;
 const existing=new Set(puzzles.map(p=>p.id));
 for(const row of candidates){
  if(!Array.isArray(row)||row.length!==5||typeof row[0]!=='string'||typeof row[2]!=='string')continue;
  const id='li_'+row[0];
  if(existing.has(id))continue;
  const themes=row[4].split(' ');
  puzzles.push({id,source:'lichess',title:'Znajdź najlepszą kontynuację',
   category:themes.map(t=>themesPL[t]).find(Boolean)||'Taktyka',
   rating:row[3],fen:row[1],line:row[2].split(' '),themes:cleanPuzzleThemes(themes),
   text:'Znajdź i wykonaj całą kombinację. Przeciwnik odpowie automatycznie.',
   hint:'Sprawdź najpierw szachy, bicia i groźby.'});
 }
 if(!puzzleId)loadedPuzzleShards.add(shard.file);
 return true;
}
async function openMixedPuzzle(theme){
 theme=Object.hasOwn(puzzleThemes,theme)?theme:undefined;
 const token=++mixedRequest;
 const previous=location.hash;
 const rating=ratingFromAttempts(state.tactics).rating;
 const unavailable=new Set([...state.tactics.map(attempt=>attempt.id),...recentlySeenPuzzles]);
 const pool=()=>theme?puzzles.filter(puzzle=>puzzle.themes.includes(theme)):puzzles;
 const closestUnseen=()=>pool().reduce((distance,puzzle)=>
  unavailable.has(puzzle.id)?distance:Math.min(distance,Math.abs(puzzle.rating-rating)),Infinity);
 if(!loadedPuzzleShards.size||closestUnseen()>PUZZLE_RATING_RANGE){
  if(!context&&(previous.startsWith('#puzzles')||previous===''||previous==='#home')){
   main.innerHTML=`<div class="page-intro"><h1>${theme?puzzleThemes[theme]:'Miszmasz'}</h1><p role="status">Dobieranie zadania do Twojego rankingu…</p></div>`;
  }
  try{
   let closest=closestUnseen();
   let searched=0;
   while(token===mixedRequest&&location.hash===previous&&(!theme||searched<5)){
    if(!await fetchPuzzleShard(rating,theme?Math.max(closest,PUZZLE_RATING_RANGE):closest))break;
    searched++;
    closest=closestUnseen();
    if(closest<=PUZZLE_RATING_RANGE)break;
   }
  }
  catch(error){console.warn('Baza zadań:',error);/* zachowaj dotychczasowe zadania */ }
 }
 if(token!==mixedRequest||location.hash!==previous)return;
 const options=pool();
 if(!options.length){
  main.innerHTML=`<div class="page-intro"><h1>Zadania</h1><p role="status">Brak dostępnych zadań dla tego motywu. Spróbuj ponownie lub wybierz inny motyw.</p></div>${puzzleTraining(theme)}<button class="btn" id="retry-puzzle-theme">Spróbuj ponownie</button>`;
  bindPuzzleTraining();
  $('#retry-puzzle-theme').onclick=()=>openMixedPuzzle(theme);
  return;
 }
 puzzle(nextMixedPuzzle(options),theme);
}
let recentlySeenPuzzles=[];
function nextMixedPuzzle(pool){
 const p=choosePuzzle(pool,state.tactics,recentlySeenPuzzles);
 recentlySeenPuzzles.push(p.id);
 if(recentlySeenPuzzles.length>25)recentlySeenPuzzles.shift();
 return p.id;
}
function puzzleTraining(theme){
 return `<div class="tactic-training">
  <label for="puzzle-theme">Motyw taktyczny</label>
  <select id="puzzle-theme"><option value="">Wszystkie motywy</option>${Object.entries(puzzleThemes).map(([id,label])=>`<option value="${id}"${theme===id?' selected':''}>${label}</option>`).join('')}</select>
  <p id="puzzle-recommendation" hidden><a class="text-link"></a></p>
  <details class="tactic-theme-details"><summary>Skuteczność według motywów</summary><div id="puzzle-theme-stats"></div></details>
 </div>`;
}
function bindPuzzleTraining(){
 $('#puzzle-theme').onchange=event=>{
  const theme=event.target.value;
  const hash=theme?'#puzzles/'+theme:'#puzzles';
  if(location.hash===hash)openMixedPuzzle(theme);
  else location.hash=hash;
 };
 updatePuzzleThemeStats();
}
function updatePuzzleThemeStats(){
 const {rows,recommended,unclassified}=summarizePuzzleThemes(state.tactics,new Map(puzzles.map(p=>[p.id,p])));
 const suggestion=$('#puzzle-recommendation');
 const link=suggestion.querySelector('a');
 suggestion.hidden=!recommended||recommended===$('#puzzle-theme').value;
 if(recommended){
  link.href='#puzzles/'+recommended;
  link.textContent='Polecany trening: '+puzzleThemes[recommended];
 }
 const results=rows.map(({theme,correct,total})=>`<li><a href="#puzzles/${theme}">${puzzleThemes[theme]}</a><span>${correct}/${total} · ${Math.round(100*correct/total)}%</span></li>`);
 $('#puzzle-theme-stats').innerHTML=`<p class="tiny">Liczy się pierwsza próba każdego zadania. Jedno zadanie może mieć kilka motywów.</p>${results.length?`<ul>${results.join('')}</ul>`:'<p>Rozwiąż zadania, aby zobaczyć wyniki.</p>'}${unclassified?`<p class="tiny">Starsze próby bez rozpoznanego motywu: ${unclassified}.</p>`:''}`;
}
function renderCorrectionLink(){
 $('#puzzle-corrections').textContent='Poprawka ('+pendingCorrections(state).length+')';
}
function correctionsPage(){
 main.innerHTML=`<a class="back-link" href="#puzzles">← &nbsp; Miszmasz</a><div class="page-intro"><h1>Poprawka</h1><p>Wróć do zadań zakończonych błędem. Zadanie zniknie z listy po poprawnym rozwiązaniu bez podpowiedzi.</p></div><ul class="correction-list"></ul>`;
 const list=main.querySelector('.correction-list');
 for(const attempt of pendingCorrections(state)){
  const puzzle=puzzles.find(item=>item.id===attempt.id);
  const row=document.createElement('li');
  const link=document.createElement('a');
  link.href=puzzleHref(attempt)+'/corrections';
  link.textContent=(puzzle?.source==='lichess'||!puzzle?'Zadanie '+attempt.id.replace(/^li_/,''):puzzle.title)+' · '+attempt.rating;
  row.append(link);
  list.append(row);
 }
 if(!list.children.length){
  const empty=document.createElement('p');
  empty.className='empty-note';
  empty.textContent='Nie masz zadań do poprawy.';
  list.replaceWith(empty);
 }
}
function puzzleHref({id,rating}){
 return '#puzzle/'+encodeURIComponent(id)+'/'+rating;
}
const sessionTacticResults=[];
function recordTactic(ok){
 const ctx=context;
 if(!ctx||ctx.kind!=='puzzle'||ctx.recorded)return;
 ctx.recorded=true;ctx.failed=!ok;
 const {id,rating}=ctx.item;
 const previous=state.corrections.find(attempt=>attempt.id===id);
 const first=state.tactics.find(attempt=>attempt.id===id);
 const already=Boolean(first);
 const before=ratingFromAttempts(state.tactics).rating;
 const at=Date.now();
 if(!already)state.tactics.push({id,rating,ok,at,ratingVersion:RATING_VERSION,themes:ctx.item.themes});
 const learnedThemes=first&&!first.themes&&ctx.item.themes.length>0;
 if(learnedThemes)first.themes=ctx.item.themes;
 const updateCorrection=!ok||(previous??first)?.ok===false;
 if(updateCorrection){
  state.corrections=state.corrections.filter(attempt=>attempt.id!==id);
  state.corrections.push({id,rating,ok,at:Math.max(at,(previous?.at??0)+1)});
 }
 if(!already||updateCorrection||learnedThemes)save();
 renderCorrectionLink();
 const after=ratingFromAttempts(state.tactics).rating;
 const change=after-before;
 ctx.tileResult={id,rating,ok,delta:already?0:change,repeat:already};
 sessionTacticResults.push(ctx.tileResult);
 if(sessionTacticResults.length>12)sessionTacticResults.shift();
 const label=already?'Powtórka bez punktów':(change>=0?'+':'')+change+' pkt';
 const status=document.querySelector('#tactic-result');
 if(status)status.textContent=label;
 updateTacticsStats();
 updatePuzzleThemeStats();
 renderTacticTiles();
 if(!ok)$('#next-puzzle').hidden=false;
}
function updateTacticsStats(){
 const attempts=ratedAttempts(state.tactics);
 const rated=ratingFromAttempts(attempts);
 const score=document.querySelector('#tactic-rating');
 if(!score)return;
 score.textContent=rated.rating;
 document.querySelector('#tactic-rd').textContent='±'+rated.rd;
 document.querySelector('#tactic-count').textContent=String(attempts.length);
 document.querySelector('#tactic-accuracy').textContent=attempts.length?Math.round(100*attempts.filter(a=>a.ok).length/attempts.length)+'%':'—';
}
function renderTacticTiles(){
 const list=document.querySelector('#tactic-tiles');
 const ctx=context;
 if(!list||ctx?.kind!=='puzzle')return;
 const current=ctx.tileResult;
 const latest=sessionTacticResults.filter(item=>item!==current).slice(-11);
 const tiles=[...latest,current??{id:ctx.item.id,rating:ctx.item.rating,pending:true}];
 list.replaceChildren();
 for(const item of tiles){
  const el=document.createElement('a');
  const hash=puzzleHref(item);
  el.href=hash;
  el.onclick=event=>{
   if(location.hash!==hash||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   event.preventDefault();
   route();
  };
  el.className='tactic-tile '+(item.pending?'pending':item.ok?'correct':'incorrect');
  el.textContent=item.pending?'?':(item.delta>0?'+':'')+item.delta;
  el.setAttribute('title',item.pending?'Bieżące zadanie — oczekiwanie na wynik':(item.ok?'Poprawne':'Błędne')+' · '+(item.delta>0?'+':'')+item.delta+' pkt'+(item.repeat?' · powtórka':''));
  el.setAttribute('aria-label','Otwórz zadanie '+item.id+' · '+el.title);
  list.append(el);
 }
}
function puzzleList(filter='Wszystkie'){const list=filter==='Wszystkie'?puzzles:puzzles.filter(p=>p.category===filter);main.innerHTML=`<div class="page-intro"><div class="eyebrow">TRENING UWAŻNOŚCI</div><h1>Znajdź ten jeden dobry ruch.</h1><p>Ćwicz rozpoznawanie okazji. Bez zegara, z podpowiedzią, zawsze we własnym tempie.</p></div><div class="filters">${['Wszystkie','Mat w jednym','Podwójny atak','Zdobywanie figur'].map(f=>`<button class="filter ${f===filter?'active':''}" data-filter="${f}">${f}</button>`).join('')}</div><div class="puzzle-cards">${list.map(p=>`<a href="#puzzle/${p.id}" class="puzzle-card"><div class="puzzle-art">${mini(p.fen)}</div><div class="puzzle-body"><div class="eyebrow">${p.category}</div><h3>${p.title}</h3><p>${p.level}</p></div><div class="puzzle-footer"><span>${state.solved.includes(p.id)?'✓ Rozwiązane':'Białe zaczynają'}</span><span>Rozwiąż &nbsp; →</span></div></a>`).join('')}</div>`;document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>puzzleList(b.dataset.filter))}
function finishPuzzle(){
 const p=context.item;
 $('#next-puzzle').hidden=false;
 $('#show-puzzle-solution').disabled=true;
 $('#hint').disabled=true;
 const initial=new Chess(context.puzzleStartFen);
 const uci=p.line?p.line[1]:p.target.join('')+(p.promotion||'');
 const answer=initial.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]||p.promotion||'q'});
 $('#puzzle-answer').textContent=answer?'Rozwiązanie · '+answer.san:'Rozwiązanie zakończone';
 const result=$('#stockfish-result');
 result.textContent='Stockfish analizuje pozycję wyjściową…';
 puzzleAnalysis=new AbortController();
 analyzePuzzle(context.puzzleStartFen,{
  signal:puzzleAnalysis.signal,
  onResult:line=>{result.textContent='Stockfish · '+line},
  onError:()=>{result.textContent='Nie udało się uruchomić analizy Stockfish.'}
 });
}

async function openPuzzle(id,rating,review){
 if(puzzles.some(item=>item.id===id)){puzzle(id,undefined,review);return}
 const puzzleRating=Number(rating??state.tactics.find(attempt=>attempt.id===id)?.rating);
 if(!/^li_[A-Za-z0-9_-]+$/.test(id)){puzzle(id);return}
 const token=gameToken;
 main.innerHTML='<p role="status">Wczytywanie zadania…</p>';
 try{
  const index=await loadPuzzleIndex();
  if(token!==gameToken)return;
  if(index.lookup){
   const key=id.slice(3);
   const prefix=key.slice(0,2).toLowerCase();
   const response=await fetch(new URL(index.lookup+'/'+prefix+'.json?v='+index.count,import.meta.url));
   if(response.ok){
    const slots=await response.json();
    const shard=Object.hasOwn(slots,key)?index.shards[slots[key]]:null;
    if(shard&&token===gameToken)await loadPuzzleShard(shard,id);
   }else if(response.status!==404)throw Error('Nie udało się odczytać indeksu zadania.');
  }else if(Number.isInteger(puzzleRating)){
   for(const shard of index.shards){
    if(token!==gameToken)return;
    if(puzzleRating<shard.min||puzzleRating>shard.max||loadedPuzzleShards.has(shard.file))continue;
    await loadPuzzleShard(shard,id);
    if(puzzles.some(item=>item.id===id))break;
   }
  }
 }catch(error){
  if(token===gameToken)main.innerHTML='<p role="alert">Nie udało się wczytać zadania. Odśwież stronę lub <a href="#puzzles">wylosuj inne zadanie</a>.</p>';
  return;
 }
 if(token!==gameToken)return;
 if(puzzles.some(item=>item.id===id))puzzle(id,undefined,review);
 else main.innerHTML='<p role="alert">Nie znaleziono zadania. <a href="#puzzles">Wylosuj inne zadanie</a>.</p>';
}
function puzzle(id,theme,review=false){
 const p=puzzles.find(item=>item.id===id);
 if(!p){location.hash='puzzles';return}
 const drawing={enabled:false,color:'orange'};
 context={kind:'puzzle',item:p,drawing,step:1,recorded:false,failed:false,assisted:false};
 setupBoard(p.fen);
 if(p.line){
  const u=p.line[0],openingMove=game.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||'q'});
  if(!openingMove){main.innerHTML='<p role="alert">Nie udało się wczytać tego zadania. <a href="#puzzles">Wylosuj kolejne</a></p>';return}
  lastMove=[openingMove.from,openingMove.to];
 }
 context.puzzleStartFen=game.fen();
 context.positions=[{fen:context.puzzleStartFen,move:lastMove}];
 const white=game.turn()==='w';
 context.flipped=!white;
 context.turnLabel=white?'Białe · Twój ruch':'Czarne · Twój ruch';
 const index=puzzles.indexOf(p);
 practiceShell(`
  <div class="puzzle-task-heading"><span class="eyebrow">${review?'Poprawka':theme?puzzleThemes[theme]:'Miszmasz · '+p.category}</span><span><span data-puzzle-count data-prefix="Baza "></span><span> · ranking ${p.rating}</span></span></div>
  <div class="tactic-stats" aria-label="Ranking taktyczny"><span><small>Twój ranking Glicko-2</small><strong id="tactic-rating">${STARTING_RATING}</strong> <small id="tactic-rd">±350</small></span><span><small>Ocenione próby</small><strong id="tactic-count">0</strong></span><span><small>Skuteczność</small><strong id="tactic-accuracy">—</strong></span></div>
  ${puzzleTraining(theme)}
  <div class="tactic-result" id="tactic-result" role="status"></div>
  <h2>${p.title}</h2>
  <div class="instruction puzzle-turn"><span class="turn-pawn ${white?'white':'black'}" aria-hidden="true">♟</span><span>${white?'Ruch białych':'Ruch czarnych'}<br>${p.text}</span></div>
  <section class="tactic-history" aria-label="Historia punktów z ostatnich zadań">
   <div class="tactic-history-heading">
    <strong>Ostatnie zadania</strong>
    <span>Zmiana rankingu</span>
   </div>
   <div class="tactic-tiles" id="tactic-tiles" aria-live="polite"></div>
  </section>
  <div id="feedback" class="feedback" aria-live="polite">${state.solved.includes(id)?'To zadanie masz już rozwiązane. Powtórz je dla utrwalenia.':''}</div>
  <section class="puzzle-analysis">
   <h3>Analiza zadania</h3>
   <p id="puzzle-answer">Rozwiąż zadanie lub pokaż rozwiązanie, aby zobaczyć analizę.</p>
   <p id="stockfish-result" role="status"></p>
   <a href="https://github.com/nmrugg/stockfish.js/tree/v19.0.1">Źródła Stockfish.js 19.0.1 (GPLv3)</a>
  </section>
  <div class="lesson-actions">
   <a class="btn outline" id="puzzle-corrections" href="#corrections">Poprawka</a>
   <button class="btn outline" id="hint">Podpowiedź</button>
   <button class="text-link" id="show-puzzle-solution">Pokaż rozwiązanie</button>
   <button class="btn" id="next-puzzle" type="button" hidden>${review?'Wróć do poprawek':'Kolejne zadanie →'}</button>
  </div>`, 'Pozycja treningowa',context.turnLabel);
 updatePuzzleBankCount();
 $('#next-puzzle').onclick=()=>{
  if(review)location.hash='corrections';
  else openMixedPuzzle(theme);
 };
 bindPuzzleTraining();
 updateTacticsStats();
 renderTacticTiles();
 renderCorrectionLink();
 $('#hint').onclick=()=>{context.assisted=true;recordTactic(false);feedback(p.hint+' · Próba rankingowa zakończona, możesz nadal ćwiczyć.');};
 $('#show-puzzle-solution').onclick=()=>{
  cancelPromotion?.();
  recordTactic(false);
  const initial=new Chess(context.puzzleStartFen);
  const solution=(p.line?p.line.slice(1):[p.target.join('')+(p.promotion||'')]);
  const moves=[];
  context.positions.length=1;
  context.reviewPly=null;
  for(const u of solution){
   const m=initial.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||'q'});
   if(!m)break;
   moves.push(m.san);
   context.positions.push({fen:initial.fen(),move:[m.from,m.to]});
  }
  game=initial;
  lastMove=context.positions.at(-1).move;
  selected=null;targets=[];solvedNow=true;
  drawBoard();
  feedback('Rozwiązanie: '+moves.join(' ')+' · Nie przyznano punktów za tę próbę.');
  finishPuzzle();
 };
}
async function loadOpeningLibrary(){
 const routeHash=location.hash;
 main.innerHTML='<p role="status">Wczytywanie biblioteki debiutów…</p>';
 try{
  const library=await import('./opening-library.js');
  return location.hash===routeHash?library:null;
 }catch{
  if(location.hash===routeHash)main.innerHTML='<div class="page-intro"><h1>Biblioteka debiutów</h1><p>Nie udało się wczytać katalogu.</p><button class="btn" id="opening-retry">Spróbuj ponownie</button></div>';
  $('#opening-retry')?.addEventListener('click',()=>location.reload());
  return null;
 }
}
async function openingsPage(id){
 if(id!=='catalog')return opening('course-italian-0');
 const library=await loadOpeningLibrary();
 library?.renderOpeningLibrary(main);
}
async function opening(id){
 const library=await loadOpeningLibrary();
 if(!library)return;
 const o=openings.find(item=>item.id===id)||library.getOpening(id,Chess);
 if(!o){location.hash='openings';return}
 const e=library.escapeHTML;
 const course=o.course;
 const guide=o.guide;
 const trainOpening=location.hash.endsWith('/trainer');
 const showCourseBoard=course&&(trainOpening||location.hash.endsWith('/board'));
 context={kind:'opening',item:o};
 openingStep=0;
 openingMode='show';
 setupBoard('start');
 practiceShell(`
  <div class="eyebrow">WARSZTAT DEBIUTOWY${o.eco?' · '+e(o.eco):''}</div>
  <h2>${e(course?.title||o.title)}</h2>
  <div class="opening-example">
  ${course?`<label class="opening-variant-label">Wybierz wariant
    <select id="course-variant">${course.variants.map((variant,i)=>`<option value="course-${course.id}-${i}">${e(variant.title)}</option>`).join('')}</select>
  </label>`:''}
  <p>${e(o.desc||'Przykładowy przebieg wariantu z katalogu ECO.')}</p>
  ${o.plan?`<p><strong>Na co zwrócić uwagę</strong><br>${e(o.plan)}</p>`:''}
  </div>
  ${o.relatedCourse?`<p><a class="text-link" href="#opening/course-${o.relatedCourse.id}-0">Przeczytaj lekcję o całym debiucie →</a></p>`:''}
  <div class="opening-walkthrough">
  <div class="opening-training">
   <button class="btn outline" type="button" id="trainer-mode" aria-pressed="false">Sprawdź swoją pamięć</button>
   <div id="opening-training-options" hidden>
    <label for="opening-training-side">Graj jako</label>
    <select id="opening-training-side"><option value="w">Białe</option><option value="b" ${o.line.length<2?'disabled':''}>Czarne</option></select>
    <button class="btn outline" type="button" id="opening-restart">Od początku</button>
   </div>
   <p class="tiny" id="opening-training-progress" hidden></p>
  </div>
  <div class="lesson-actions opening-board-actions"><button class="btn outline" id="opening-prev">← Wstecz</button><button class="btn" id="opening-next">Następny ruch →</button><button class="btn outline" id="opening-hint" hidden>Podpowiedź</button></div>
  <h3 class="opening-move-heading" id="opening-move-heading">Pozycja wyjściowa</h3>
  <div id="feedback" class="feedback opening-explanation" role="status"></div>
  <div id="opening-moves" class="moves"></div>
  <p class="opening-notation"><strong>Notacja SAN</strong><br>N – skoczek, B – goniec, R – wieża, Q – hetman, K – król. Pion zapisujemy bez litery, np. e4. O-O oznacza krótką roszadę, a O-O-O długą.</p>
  <details class="opening-guide-details"><summary>Powtórka ruchów</summary>
    <div class="filters"><button class="filter active" id="show-mode" aria-pressed="true">Pokaż ruchy</button><button class="filter" id="practice-mode" aria-pressed="false">Zagraj ruchy samodzielnie</button></div>
  </details>
  </div>
  ${o.family?`<a class="text-link" id="opening-related" href="#openings/catalog">Więcej wariantów z tej rodziny →</a>`:''}
  ${course?.quiz.length?`<details class="opening-quiz"><summary>Sprawdź się · ${course.quiz.length} pytań</summary>
    ${course.quiz.map((question,i)=>`<section class="opening-question"><h3>${i+1}. ${e(question.q)}</h3><div class="quiz-options">${question.a.map((answer,j)=>`<button class="quiz-option" data-choice="${j}">${e(answer)}</button>`).join('')}</div><p role="status" class="opening-answer" hidden></p></section>`).join('')}
  </details>`:''}
 `,e(course?.title||o.title));
 const layout=main.querySelector('.practice-layout');
 layout.classList.add('opening-lesson-layout');
 const boardCard=layout.querySelector('.board-card');
 const example=layout.querySelector('.opening-example');
 const walkthrough=layout.querySelector('.opening-walkthrough');
 const lesson=document.createElement('section');
 lesson.className='opening-workshop';
 lesson.innerHTML=library.openingPicker(course?.id,id);
 const title=layout.querySelector('.lesson-panel > h2');
 title.className='opening-workshop-title';
 if(course){
  const panel=layout.querySelector('.lesson-panel');
  const chapter=document.createElement('div');
  chapter.innerHTML=openingChapter(course,guide,openingDiagram,e);
  chapter.querySelectorAll('[data-youtube-player]').forEach(player=>{
   const host=player.querySelector('.opening-video-player-host');
   player.addEventListener('toggle',()=>{
    if(player.open) host.replaceChildren(player.querySelector('template').content.cloneNode(true));
    else host.replaceChildren();
   });
  });
  const playlist=chapter.querySelector('.opening-video-playlist');
  if(playlist){
   const videos=playlist.closest('.opening-videos');
   const compact=matchMedia('(max-width: 760px)');
   playlist.open=!compact.matches;
   playlist.addEventListener('click',event=>{
    const choice=event.target.closest('.opening-video-choice');
    if(!choice)return;
    const previous=playlist.querySelector('[aria-current]');
    if(previous!==choice){
     const oldCard=videos.querySelector('#'+previous.getAttribute('aria-controls'));
     const oldPlayer=oldCard.querySelector('[data-youtube-player]');
     if(oldPlayer)oldPlayer.open=false;
     oldCard.hidden=true;
     previous.removeAttribute('aria-current');
     choice.setAttribute('aria-current','true');
    }
    const card=videos.querySelector('#'+choice.getAttribute('aria-controls'));
    card.hidden=false;
    const player=card.querySelector('[data-youtube-player]');
    if(player)player.open=true;
    if(compact.matches){
     playlist.open=false;
     card.querySelector('summary, .opening-video-youtube-link').focus();
    }
   });
  }
  const explorer=document.createElement('details');
  explorer.className='opening-explorer';
  explorer.open=showCourseBoard;
  explorer.innerHTML='<summary class="btn">Sprawdź debiut <span aria-hidden="true">▾</span></summary>';
  const boardLayout=document.createElement('div');
  boardLayout.className='opening-board-layout';
  const boardPanel=document.createElement('aside');
  boardPanel.className='opening-board-panel';
  boardPanel.setAttribute('aria-label','Wariant i przebieg ruchów');
  boardPanel.append(example,walkthrough);
  boardLayout.append(boardCard,boardPanel);
  explorer.append(boardLayout);
  chapter.querySelectorAll('.opening-board-link').forEach(link=>{
   link.addEventListener('click',event=>{
    if(link.hash!==location.hash)return;
    event.preventDefault();
    explorer.open=true;
    explorer.scrollIntoView({block:'start'});
   });
  });
  lesson.append(chapter.firstElementChild,explorer);
  const followup=document.createElement('div');
  followup.className='opening-followup';
  followup.append(panel.querySelector('.opening-quiz'),panel.querySelector('#opening-related'));
  lesson.append(followup);
 }else{
  const panel=layout.querySelector('.lesson-panel');
  panel.prepend(example,walkthrough);
  lesson.append(title,layout);
 }
 main.replaceChildren(lesson);
 if(course)startOpeningPreviews(lesson,library);
 if(course){
  const variants=$('#course-variant');
  variants.value=id;
  variants.onchange=()=>{location.hash='opening/'+variants.value+(openingMode==='trainer'?'/trainer':'/board')};
  main.querySelectorAll('.opening-question').forEach((element,index)=>{
   const question=course.quiz[index];
   const status=element.querySelector('.opening-answer');
   element.querySelectorAll('[data-choice]').forEach(button=>{
    button.onclick=()=>{
     const correct=Number(button.dataset.choice)===question.ok;
     soundMove(null,{answer:correct?'correct':'incorrect'});
     status.hidden=false;
     status.textContent=correct?question.why:'Spróbuj jeszcze raz.';
     if(correct){button.classList.add('correct');element.querySelectorAll('[data-choice]').forEach(answer=>{answer.disabled=true})}
    };
   });
  });
 }
 $('#opening-related')?.addEventListener('click',()=>library.focusOpeningFamily(o.family));
 $('#show-mode').onclick=()=>resetOpening('show');
 $('#practice-mode').onclick=()=>resetOpening('practice');
 $('#trainer-mode').onclick=()=>resetOpening(openingMode==='trainer'?'show':'trainer');
 $('#opening-training-side').onchange=()=>resetOpening('trainer');
 $('#opening-restart').onclick=()=>resetOpening('trainer');
 $('#opening-next').onclick=()=>goToOpeningStep(openingStep+1);
 $('#opening-prev').onclick=()=>goToOpeningStep(openingStep-1);
 $('#opening-hint').onclick=()=>{
  if(openingStep>=o.line.length)return;
  const move=new Chess(game.fen()).move(o.line[openingStep]);
  if(context.trainer){
   context.trainer.assisted.add(openingStep);
   feedback(openingTrainingHint(move));
   return;
  }
  feedback(`Ruch ${openingStep+1}: ${names[move.piece]} z ${move.from} na ${move.to}.`);
 };
 if(trainOpening)resetOpening('trainer');
 else updateOpening();
 if(showCourseBoard) $('.opening-explorer').scrollIntoView({block:'start'});
}
function goToOpeningStep(destination){
 const {line}=context.item;
 if(destination<0||destination>line.length)return;
 cancelPromotion?.();
 while(openingStep>destination){undoBoardMove();openingStep--}
 const playNext=destination===openingStep+1;
 while(openingStep<destination){
  moveOnBoard(line[openingStep],playNext?{}:null);
  openingStep++;
 }
 context.reviewPly=null;
 lastMove=context.positions.at(-1).move;
 selected=null;targets=[];
 drawBoard();updateOpening();
}
function resetOpening(mode){
 const training=mode==='trainer';
 const side=$('#opening-training-side').value;
 if(training&&!context.trainer)context.preTrainingFlip=context.flipped;
 if(!training&&context.trainer)context.flipped=context.preTrainingFlip;
 context.trainer=training?{side,assisted:new Set(),independent:0,total:0}:null;
 if(training)context.flipped=side==='b';
 $('#flip-board').setAttribute('aria-pressed',String(Boolean(context.flipped)));
 openingMode=mode;openingStep=0;setupBoard('start');
 const reply=playOpeningReply();
 $('#opening-training-options').hidden=!training;
 $('#opening-training-progress').hidden=!training;
 for(const [id,value] of [['show-mode','show'],['practice-mode','practice'],['trainer-mode','trainer']]){
  const button=$('#'+id);
  button.classList.toggle('active',mode===value);
  button.setAttribute('aria-pressed',String(mode===value));
 }
 $('#opening-prev').hidden=training;
 $('#opening-next').hidden=mode!=='show';
 $('#opening-hint').hidden=mode==='show';
 drawBoard();
 updateOpening({reply});
}
function openingTrainingHint(move){
 const note=context.item.notes?.[openingStep];
 return `W tym wariancie zagraj ${move.san} (${move.from} → ${move.to}).${note?' '+note:''}`;
}
function playOpeningReply(){
 const trainer=context.trainer;
 if(!trainer||openingStep>=context.item.line.length||game.turn()===trainer.side)return;
 const reply=moveOnBoard(context.item.line[openingStep],null);
 openingStep++;
 lastMove=[reply.from,reply.to];
 return reply;
}
function playOpeningMove(move){
 const expected=new Chess(game.fen()).move(context.item.line[openingStep]);
 const trainer=context.trainer;
 if(expected.from!==move.from||expected.to!==move.to||(expected.promotion&&expected.promotion!==move.promotion)){
  soundMove(null,{answer:'incorrect'});
  if(trainer){
   trainer.assisted.add(openingStep);
   feedback('Ten ruch nie należy do ćwiczonego wariantu. '+openingTrainingHint(expected),'error');
   selected=null;targets=[];
   drawBoard();
  }else feedback('Ten ruch jest legalny, ale ćwiczymy inny wariant. Skorzystaj z podpowiedzi.','error');
  return;
 }
 const played=moveOnBoard(move,null);
 if(trainer){
  trainer.total++;
  if(!trainer.assisted.has(openingStep))trainer.independent++;
 }
 openingStep++;
 lastMove=[played.from,played.to];
 const reply=playOpeningReply();
 soundMove(played,{reply,answer:'correct',mate:game.isCheckmate()});
 selected=null;targets=[];
 drawBoard();
 updateOpening({played,reply});
}
function updateOpening({played,reply}={}){
 const {item:o}=context;
 const moves=$('#opening-moves');
 moves.replaceChildren(...o.line.map((move,index)=>{
  const token=document.createElement('span');
  token.className='move'+(index===openingStep-1?' current':'');
  token.textContent=(index%2===0?Math.floor(index/2+1)+'. ':'')+
   (openingMode!=='show'&&index>=openingStep?'…':move);
  return token;
 }));
 const complete=openingStep===o.line.length;
 $('#opening-prev').disabled=openingStep===0;
 $('#opening-next').disabled=complete;
 $('#opening-hint').disabled=complete;
 const turn=game.turn()==='w'?'Ruch białych':'Ruch czarnych';
 $('#board-bottom').textContent=complete?'Koniec wariantu':`${turn} · ${openingStep+1} z ${o.line.length}`;
 const note=o.notes?.[openingStep-1];
 const move=game.history({verbose:true}).at(-1);
 const number=Math.ceil(openingStep/2);
 $('#opening-move-heading').textContent=move
  ? `${number}${move.color==='w'?'.':'…'} ${move.san} · ${move.color==='w'?'białe':'czarne'}`
  : 'Pozycja wyjściowa';
 const trainer=context.trainer;
 if(trainer){
  const side=trainer.side==='w'?'białe':'czarne';
  const ownNote=played&&o.notes?.[openingStep-(reply?2:1)];
  const sequence=[played&&`Dobrze, ${played.san}.`,ownNote,reply&&`Komputer: ${reply.san}.`,reply&&note].filter(Boolean);
  sequence.push(complete?'Wariant ukończony.':`Twój ruch · ${side}.`);
  $('#opening-training-progress').textContent=`Bez podpowiedzi i błędów: ${trainer.independent}/${trainer.total} Twoich ruchów.`;
  $('#board-bottom').textContent=complete?'Koniec treningu':`Twój ruch · ${side}`;
  feedback(sequence.join(' '),complete?'success':'');
  if(complete)activity();
  return;
 }
 if(complete){
  feedback(note||'To ostatni ruch w tym przykładzie.','success');
  if(openingMode==='practice')activity();
 }else{
  feedback(note||(openingMode==='show'
   ? (openingStep?`Zobacz, jak zmienia się pozycja po ruchu z ${move.from} na ${move.to}.`:'Przejdź do pierwszego ruchu i obserwuj zaznaczone pola na planszy.')
   : 'Odtwórz poznany wariant, grając obiema stronami.'));
 }
}
const val={p:100,n:320,b:330,r:500,q:900,k:0};let gameFinished=false;
function evaluate(g){if(g.isCheckmate())return g.turn()==='b'?-100000:100000;if(g.isDraw())return 0;let score=0;g.board().forEach((row,r)=>row.forEach((p,c)=>{if(!p)return;let v=val[p.type];const center=3.5-Math.abs(3.5-c)+3.5-Math.abs(3.5-r);if(['n','b'].includes(p.type))v+=center*7;if(p.type==='p')v+=(p.color==='b'?r:7-r)*7;score+=(p.color==='b'?1:-1)*v}));return score}
function search(g,depth,alpha,beta){if(depth===0||g.isGameOver())return evaluate(g);const max=g.turn()==='b';let best=max?-Infinity:Infinity;const moves=g.moves({verbose:true}).sort((a,b)=>(val[b.captured]||0)-(val[a.captured]||0));for(const m of moves){g.move(m);const v=search(g,depth-1,alpha,beta);g.undo();best=max?Math.max(best,v):Math.min(best,v);if(max)alpha=Math.max(alpha,best);else beta=Math.min(beta,best);if(beta<=alpha)break}return best}
function chooseMove(g,depth=2){const max=g.turn()==='b';let best=max?-Infinity:Infinity,chosen=null;const moves=g.moves({verbose:true}).sort((a,b)=>(val[b.captured]||0)-(val[a.captured]||0));for(const m of moves){g.move(m);const v=search(g,depth-1,-Infinity,Infinity);g.undo();if(chosen===null||(max?v>best:v<best)){best=v;chosen=m}}return chosen}
function scheduleAI(){const token=gameToken;$('#board-top').textContent='Komputer myśli…';aiTimer=setTimeout(()=>{if(token!==gameToken||context.kind!=='play')return;const level=$('#difficulty').value;const moves=game.moves({verbose:true});let m;if(level==='easy'&&Math.random()<.65)m=moves[Math.floor(Math.random()*moves.length)];else m=chooseMove(game,level==='medium'?2:1);if(m){moveOnBoard(m);lastMove=[m.from,m.to];drawBoard();updateGame()}},350)}
function play(){context={kind:'play'};setupBoard('start');gameFinished=false;practiceShell(`<div class="eyebrow">SPOKOJNY TRENING · BEZ ZEGARA</div><h2>Twój ruch.</h2><p>Graj białymi przeciwko komputerowi. Sprawdzaj zagrożenia, próbuj pomysłów i korzystaj z pomocy.</p><div class="game-controls"><label for="difficulty" class="tiny">Poziom</label><select id="difficulty"><option value="easy">Pierwsze kroki</option><option value="medium">Uważny przeciwnik</option></select></div><div id="feedback" class="feedback">Zacznij od walki o centrum i rozwoju figur.</div><div class="lesson-actions"><button class="btn" id="game-hint">Wskazówka</button><button class="btn outline" id="undo">Cofnij</button><button class="text-link" id="new-game">Nowa partia</button></div><label class="settings-row"><input type="checkbox" id="show-targets" checked> Pokazuj legalne ruchy</label><div class="history" id="history"></div><p class="tiny">Przeciwnik i wskazówki działają lokalnie. Trener prowadzący rozmowę z AI pojawi się w kolejnej wersji.</p>`, 'Gra treningowa','Ty · białe');$('#new-game').onclick=()=>{if(game.history().length&&!game.isGameOver()&&!confirm('Rozpocząć nową partię? Bieżąca pozycja zostanie zastąpiona.'))return;clearTimeout(aiTimer);gameToken++;play()};$('#undo').onclick=()=>{clearTimeout(aiTimer);gameToken++;if(!game.history().length)return;if(game.turn()==='w')undoBoardMove();undoBoardMove();lastMove=null;selected=null;targets=[];drawBoard();updateGame();feedback('Ruch cofnięty. Spójrz na pozycję jeszcze raz.');};$('#game-hint').onclick=()=>{if(game.turn()!=='w'||game.isGameOver())return;const m=chooseMove(game,2);if(m){selected=m.from;targets=[m.to];drawBoard();feedback(`Rozważ ruch: ${names[m.piece]} z ${m.from} na ${m.to}.${m.captured?' Możesz zbić figurę przeciwnika.':m.san.includes('+')?' Ten ruch daje szacha.':' Sprawdź, jakie pola kontroluje figura po tym ruchu.'}`)}};$('#show-targets').onchange=()=>drawBoard();updateGame()}

function updateGame(){const h=game.history();$('#history').innerHTML=h.map((m,i)=>`${i%2===0?`<span>${i/2+1}.</span>`:''}<span>${m}</span>`).join('');$('#history').scrollTop=$('#history').scrollHeight;$('#undo').disabled=h.length===0||gameFinished;$('#game-hint').disabled=game.turn()!=='w'||game.isGameOver();$('#board-top').textContent='Komputer · czarne';$('#board-bottom').textContent=game.turn()==='w'?'Ty · białe · Twój ruch':'Czarne · ruch komputera';if(game.isGameOver()){let message=game.isCheckmate()?(game.turn()==='b'?'Mat! Wygrywasz. Dobra robota.':'Mat. Komputer wygrywa. Każda partia to nowe doświadczenie.'):'Remis. '+(game.isStalemate()?'Król nie jest szachowany i nie ma legalnego ruchu — pat.':game.isInsufficientMaterial()?'Brakuje materiału do mata.':game.isThreefoldRepetition()?'Pozycja powtórzyła się trzykrotnie.':'Osiągnięto limit ruchów bez bicia i ruchu pionem.');feedback(message,'success');$('#board-bottom').textContent='Partia zakończona';if(!gameFinished){gameFinished=true;$('#undo').disabled=true;state.games++;if(!state.done.includes('5-1'))state.done.push('5-1');activity();toast('✧ Pierwsza pełna partia zapisana w postępach.')}}else feedback(game.isCheck()?'Szach! Zadbaj o bezpieczeństwo swojego króla.':game.turn()==='w'?'Twój ruch. Co grozi przeciwnik? Czy wszystkie figury są bezpieczne?':'Komputer przygotowuje odpowiedź.');}
let gameAnalysis, fullGameAnalysis;
function analysisPosition(ply){
 const position=new Chess(context.positions[0].fen);
 for(const move of context.moves.slice(0,ply))position.move(move);
 return position;
}
const shortAnalysisScore=new Intl.NumberFormat('pl',{signDisplay:'exceptZero',maximumFractionDigits:1});
function analysisBoardMarkup(){
 return `<div id="analysis-board" class="analysis-board" data-flipped="${Boolean(context.flipped)}">
  <div id="analysis-evaluation" class="analysis-evaluation" data-evaluated="false" role="img" aria-label="Ocena pozycji: brak">
   <span class="analysis-evaluation-white" aria-hidden="true"></span>
   <span class="analysis-evaluation-value" aria-hidden="true">—</span>
  </div>
  <div id="board-host"></div>
 </div>`;
}
function showAnalysisEvaluation(evaluation){
 const bar=$('#analysis-evaluation');
 const mate=evaluation?.kind==='mate';
 const white=!evaluation?50:mate?(evaluation.score>0?100:0):50+50*Math.tanh(evaluation.score/400);
 const value=!evaluation?'—':mate?(evaluation.finished?'Mat':'M'+Math.abs(evaluation.score)):shortAnalysisScore.format(evaluation.score/100);
 const label=mate&&evaluation.finished?'Mat. Wygrywają '+(evaluation.score>0?'białe.':'czarne.'):evaluation?formatScore(evaluation):'Brak oceny';
 bar.style.setProperty('--white-share',white+'%');
 bar.dataset.evaluated=String(Boolean(evaluation));
 bar.title=label;
 bar.setAttribute('aria-label','Ocena pozycji: '+label);
 bar.querySelector('.analysis-evaluation-value').textContent=value;
}
function updateAnalysisSuggestion(){
 const engine=$('#analysis-engine').checked;
 const checkbox=$('#analysis-show-best');
 checkbox.disabled=!engine;
 context.suggestion=engine&&checkbox.checked&&context.analysisBestMove
  ?{...context.analysisBestMove,color:'blue'}:null;
 boardInput.setSuggestion(context.suggestion);
}
function updateAnalysisEngine(position,ply){
 gameAnalysis?.abort();
 context.analysisBestMove=null;
 updateAnalysisSuggestion();
 const result=$('#analysis-result');
 const cached=context.evaluations[ply];
 showAnalysisEvaluation(cached);
 if(cached){
  const played=ply?context.moves[ply-1]:null;
  const before=context.evaluations[ply-1];
  const review=played&&reviewMove(played,before,cached);
  const loss=review?.loss>0?` · strata ${formatScore({kind:'cp',score:review.loss}).replace(/^\+/,'')}`:'';
  const previous=review?`${moveLabel(played)} · ${review.label}${loss}. Najlepszy wariant przed ruchem: ${before.san.join(' ')}. `:'';
  const line=cached.finished?(cached.kind==='mate'?'Mat.':'Remis.'):`Ocena: ${formatScore(cached)} · głębokość ${cached.depth}. Wariant: ${cached.san.join(' ')}.`;
  result.textContent=previous+line;
  context.analysisBestMove=cached.best?uciMove(cached.best):null;
  updateAnalysisSuggestion();
  return;
 }
 if(fullGameAnalysis){result.textContent='Ta pozycja czeka na ocenę.';return}
 if(!$('#analysis-engine').checked){
  result.textContent='Stockfish wyłączony.';
  return;
 }
 if(position.isGameOver()){
  showAnalysisEvaluation(terminalEvaluation(position));
  result.textContent=position.isCheckmate()
   ? `Mat. Wygrywają ${position.turn()==='w'?'czarne':'białe'}.`
   : 'Remis w tej pozycji.';
  return;
 }
 gameAnalysis=new AbortController();
 result.textContent='Stockfish analizuje pozycję…';
 analyzePuzzle(position.fen(),{
  signal:gameAnalysis.signal,
  startFen:context.positions[0].fen,
  moves:context.moves.slice(0,ply).map(move=>move.lan),
  whitePerspective:true,
  onResult:(message,best,evaluation)=>{
   showAnalysisEvaluation(evaluation);
   result.textContent=message;
   context.analysisBestMove=best;
   updateAnalysisSuggestion();
  },
  onError:()=>{result.textContent='Stockfish nie zwrócił oceny. Wyłącz i włącz silnik, aby spróbować ponownie.'}
 });
}
function showAnalysisPosition(ply,position=analysisPosition(ply)){
 cancelPromotion?.();
 selected=null;targets=[];
 const last=context.positions.length-1;
 context.reviewPly=ply===last?null:ply;
 game=position;
 lastMove=context.positions[ply].move;
 context.suggestion=null;
 $('#board-bottom').textContent=position.turn()==='w'?'Ruch białych':'Ruch czarnych';
 drawBoard();
 $('#analysis-moves').querySelector('[aria-current]')?.removeAttribute('aria-current');
 $('#analysis-moves').children[ply].setAttribute('aria-current','step');
 keepAnalysisMoveVisible();
 updateAnalysisEngine(position,ply);
 updateGameReport();
}
function navigateAnalysis(ply){
 const {current}=boardNavigationRange();
 if(ply===current)return;
 const move=context.moves[(ply>current?ply:current)-1];
 soundMove(move);
 showAnalysisPosition(ply);
}
function keepAnalysisMoveVisible(){
 const panel=$('#analysis-panel-moves');
 const move=$('#analysis-moves [aria-current]');
 if(panel.hidden||!move)return;
 const bounds=panel.getBoundingClientRect();
 const item=move.getBoundingClientRect();
 if(item.top<bounds.top)panel.scrollTop+=item.top-bounds.top;
 else if(item.bottom>bounds.bottom)panel.scrollTop+=item.bottom-bounds.bottom;
}
function renderAnalysisMoves(){
 const buttons=document.createDocumentFragment();
 ['Start',...context.moves.map(moveLabel)].forEach((label,ply)=>{
  const button=document.createElement('button');
  button.type='button';
  button.className='btn outline';
  button.textContent=label;
  button.dataset.ply=ply;
  button.onclick=()=>navigateAnalysis(ply);
  buttons.append(button);
 });
 $('#analysis-moves').replaceChildren(buttons);
}
function playAnalysisMove(move){
 const {current}=boardNavigationRange();
 stopFullAnalysis();
 context.evaluations.length=Math.min(context.evaluations.length,current+1);
 context.positions.length=current+1;
 context.moves.length=current;
 for(const ply of context.solvedErrors)if(ply>current)context.solvedErrors.delete(ply);
 context.moves.push(moveOnBoard(move));
 renderAnalysisMoves();
 showAnalysisPosition(current+1,game);
}
function updateGameReport(){
 const {moves,evaluations,side}=context;
 const {current}=boardNavigationRange();
 $('#analysis-all').disabled=!moves.length||Boolean(fullGameAnalysis)||evaluations.length===moves.length+1;
 $('#analysis-stop').hidden=!fullGameAnalysis;
 $('#analysis-all').textContent=evaluations.length===moves.length+1?'Analiza gotowa':evaluations.length?'Wznów analizę':'Analizuj całą partię';
 const labels=$('#analysis-moves').children;
 for(let ply=1;ply<labels.length;ply++){
  const review=reviewMove(moves[ply-1],evaluations[ply-1],evaluations[ply]);
  const label=labels[ply];
  label.dataset.severity=review?.severity??0;
  label.textContent=moveLabel(moves[ply-1])+(review?.severity?' · '+review.label:'');
 }
 const root=$('#analysis-report');
 const focusSlider=document.activeElement?.id==='analysis-scrubber';
 renderGameReport(root,{moves,evaluations,current,side,solvedErrors:context.solvedErrors,select:navigateAnalysis,practice:startAnalysisExercise});
 $('#analysis-report-empty').hidden=!root.hidden;
 if(focusSlider)$('#analysis-scrubber')?.focus({preventScroll:true});
}
function stopFullAnalysis(){
 fullGameAnalysis?.abort();
 fullGameAnalysis=null;
 $('#analysis-progress').textContent='';
}
async function runFullAnalysis(){
 if(fullGameAnalysis||!context.moves.length)return;
 gameAnalysis?.abort();
 const controller=new AbortController();
 fullGameAnalysis=controller;
 const {moves,positions,evaluations}=context;
 const replay=analysisPosition(Math.max(0,evaluations.length-1));
 const startFen=positions[0].fen;
 const finalPly=moves.length;
 const status=$('#analysis-progress');
 let engine;
 try{
  updateGameReport();
  updateAnalysisEngine(analysisPosition(boardNavigationRange().current),boardNavigationRange().current);
  status.textContent='Uruchamianie Stockfisha…';
  for(let ply=evaluations.length;ply<=finalPly;ply++){
   if(ply>0)replay.move(moves[ply-1]);
   const evaluation=terminalEvaluation(replay)??await (engine??=createStockfish(controller.signal)).evaluate(replay.fen(),{
    startFen,moves:moves.slice(0,ply).map(move=>move.lan),limit:'depth 14 movetime 350'
   });
   controller.signal.throwIfAborted();
   evaluations.push(evaluation);
   status.textContent=`Oceniono ${ply} z ${finalPly} półruchów…`;
   const {current}=boardNavigationRange();
   if(current===ply)updateAnalysisEngine(replay,current);
   if(ply%5===0||current===ply)updateGameReport();
  }
  status.textContent=`Analiza gotowa · ${finalPly} półruchów.`;
 }catch{
  if(controller.signal.aborted)return;
  status.textContent='Analiza została przerwana przez błąd silnika. Możesz ją wznowić.';
  $('#analysis-all').textContent='Wznów analizę';
 }finally{
  engine?.close();
  if(fullGameAnalysis===controller){
   fullGameAnalysis=null;
   updateGameReport();
   const {current}=boardNavigationRange();
   updateAnalysisEngine(analysisPosition(current),current);
  }
 }
}
function startAnalysisExercise(ply){
 stopFullAnalysis();
 gameAnalysis?.abort();
 const saved={...context,engineEnabled:$('#analysis-engine').checked,showBest:$('#analysis-show-best').checked,suggestion:null};
 const answer=saved.evaluations[ply-1];
 const original=saved.moves[ply-1];
 const back=()=>analysisPage(saved,ply);
 context={kind:'analysisExercise',answer,onCorrect:()=>saved.solvedErrors.add(ply),flipped:original.color==='b'};
 setupBoard(original.before);
 practiceShell(`
  <h1>Ćwiczenie z partii</h1>
  <p>Pozycja przed ${original.before.split(' ')[5]}. ruchem. Znajdź ruch polecany przez Stockfisha.</p>
  <div id="feedback" class="feedback" role="status">Graj ${original.color==='w'?'białymi':'czarnymi'}.</div>
  <div class="lesson-actions">
   <button class="btn outline" id="analysis-answer" type="button">Pokaż rozwiązanie</button>
   <button class="btn" id="analysis-back" type="button">Wróć do analizy</button>
  </div>`, 'Ćwiczenie z partii',original.color==='w'?'Ruch białych':'Ruch czarnych');
 $('#analysis-back').onclick=back;
 $('#analysis-answer').onclick=()=>{
  cancelPromotion?.();
  finishAnalysisExercise(uciMove(answer.best),false);
 };
 $('#analysis-back').focus();
 window.scrollTo(0,0);
}
function checkAnalysisExercise(move){
 const played=game.moves({square:move.from,verbose:true}).find(candidate=>
  candidate.to===move.to&&(!candidate.promotion||candidate.promotion===move.promotion));
 if(played?.lan===context.answer.best){finishAnalysisExercise(move,true);return}
 selected=null;targets=[];
 feedback('Stockfish wskazał inny ruch. Spróbuj jeszcze raz lub pokaż rozwiązanie.','error');
 drawBoard();
}
function finishAnalysisExercise(move,correct){
 const played=game.move(move);
 if(correct)context.onCorrect();
 lastMove=[played.from,played.to];
 solvedNow=true;selected=null;targets=[];
 drawBoard();
 $('#analysis-answer').disabled=true;
 feedback(`${correct?'Dobrze!':'Rozwiązanie.'} Wariant Stockfisha: ${context.answer.san.join(' ')}.`,correct?'success':'');
}
function analysisPage(saved,ply=0){
 context={kind:'analysis',moves:[],evaluations:[],solvedErrors:new Set(),side:'both',...saved};
 if(!saved)setupBoard('start');
 else{
  boardInput.reset();
  solvedNow=false;
  game=analysisPosition(ply);
 }
 const tabs=[['moves','Ruchy'],['engine','Silnik'],['report','Raport'],['pgn','PGN']];
 practiceShell(`
  <div class="analysis-workspace">
   <div class="analysis-header">
    <h1>Analiza partii 2.0</h1>
    <p id="analysis-game-name" class="tiny"></p>
    <div class="analysis-tabs" role="tablist" aria-label="Panel analizy">
     ${tabs.map(([id,label])=>`<button class="btn outline" type="button" id="analysis-tab-${id}" role="tab" aria-controls="analysis-panel-${id}" aria-selected="false" tabindex="-1">${label}</button>`).join('')}
    </div>
   </div>
   <div class="analysis-tab-panel" id="analysis-panel-moves" role="tabpanel" aria-labelledby="analysis-tab-moves" hidden>
    <div id="analysis-moves" class="analysis-moves" role="group" aria-label="Posunięcia partii"></div>
   </div>
   <div class="analysis-tab-panel" id="analysis-panel-engine" role="tabpanel" aria-labelledby="analysis-tab-engine" hidden>
  <label class="settings-row"><input type="checkbox" id="analysis-engine"> Włącz Stockfisha</label>
  <label class="settings-row"><input type="checkbox" id="analysis-show-best"> Pokaż najlepszy ruch</label>
  <div class="feedback" id="analysis-result" role="status"></div>
  <p class="tiny">Dodatnia ocena oznacza przewagę białych.</p>
  <div class="analysis-options">
   <label for="analysis-side">Czyje błędy ćwiczyć?</label>
   <select id="analysis-side"><option value="both">Obie strony</option><option value="w">Białe</option><option value="b">Czarne</option></select>
   <div class="lesson-actions"><button class="btn" id="analysis-all" type="button">Analizuj całą partię</button><button class="btn outline" id="analysis-stop" type="button" hidden>Zatrzymaj</button></div>
   <p id="analysis-progress" class="tiny" role="status"></p>
  </div>
   </div>
   <div class="analysis-tab-panel" id="analysis-panel-report" role="tabpanel" aria-labelledby="analysis-tab-report" tabindex="0" hidden>
    <p id="analysis-report-empty">Uruchom analizę całej partii w zakładce Silnik, aby zobaczyć wykres i kluczowe błędy.</p>
    <section id="analysis-report" hidden></section>
   </div>
   <div class="analysis-tab-panel" id="analysis-panel-pgn" role="tabpanel" aria-labelledby="analysis-tab-pgn" hidden>
    <label class="account-field"><span>Plik PGN (jedna partia, do 1 MB)</span><input id="analysis-file" type="file" accept=".pgn,application/x-chess-pgn"></label>
    <form id="analysis-pgn-form">
     <label class="account-field"><span>Wklej tekst PGN</span><textarea id="analysis-pgn-text" rows="6" spellcheck="false" autocapitalize="off"></textarea></label>
     <button class="btn" type="submit">Wczytaj partię</button>
    </form>
    <p id="analysis-import-status" class="tiny" role="status"></p>
    <button class="btn outline" type="button" id="analysis-reset">Nowa analiza</button>
   </div>
  </div>`, 'Analiza Partii','Ruch białych');

 const tabButtons=tabs.map(([id])=>$('#analysis-tab-'+id));
 const selectTab=(tab,focus=false)=>{
  for(const button of tabButtons){
   const active=button===tab;
   button.setAttribute('aria-selected',String(active));
   button.tabIndex=active?0:-1;
   document.getElementById(button.getAttribute('aria-controls')).hidden=!active;
  }
  if(focus)tab.focus();
  if(tab===tabButtons[0])keepAnalysisMoveVisible();
 };
 tabButtons.forEach((button,index)=>{
  button.onclick=()=>selectTab(button);
  button.onkeydown=event=>{
   const destination={ArrowLeft:(index+tabButtons.length-1)%tabButtons.length,ArrowRight:(index+1)%tabButtons.length,Home:0,End:tabButtons.length-1}[event.key];
   if(destination===undefined)return;
   event.preventDefault();
   selectTab(tabButtons[destination],true);
  };
 });
 selectTab(tabButtons[saved?2:0]);

 const fileInput=$('#analysis-file');
 const pgnText=$('#analysis-pgn-text');
 const importStatus=$('#analysis-import-status');
 const gameName=$('#analysis-game-name');
 let importId=0;
 gameName.textContent=context.importLabel??'';
 $('#analysis-side').value=context.side;
 $('#analysis-side').onchange=event=>{context.side=event.target.value;updateGameReport()};
 $('#analysis-engine').checked=Boolean(saved?.engineEnabled);
 $('#analysis-show-best').checked=Boolean(saved?.showBest);
 $('#analysis-show-best').onchange=updateAnalysisSuggestion;
 $('#analysis-all').onclick=runFullAnalysis;
 $('#analysis-stop').onclick=()=>{stopFullAnalysis();showAnalysisPosition(boardNavigationRange().current)};
 $('#analysis-engine').onchange=()=>{
  const {current}=boardNavigationRange();
  updateAnalysisEngine(analysisPosition(current),current);
 };
 $('#analysis-reset').onclick=()=>{
  importId++;
  stopFullAnalysis();
  context.evaluations=[];
  context.solvedErrors.clear();
  context.importLabel='';
  context.importOutcome=null;
  pgnText.value='';
  importStatus.textContent='';
  gameName.textContent='';
  context.imported=false;
  context.moves=[];
  setupBoard('start');
  renderAnalysisMoves();
  showAnalysisPosition(0);
  selectTab(tabButtons[0],true);
 };
 const importGame=async(source,label)=>{
  const id=++importId;
  if(source.size>1_000_000){
   importStatus.textContent='PGN przekracza limit 1 MB.';
   return;
  }
  importStatus.textContent='Wczytuję partię…';
  try{
   const pgn=(await source.text()).trim();
   if(!fileInput.isConnected||id!==importId)return;
   if(!pgn){
    importStatus.textContent='Brak tekstu PGN. Wklej zapis partii albo wybierz plik.';
    return;
   }
   const parsed=readGame(pgn);
   stopFullAnalysis();
   context.evaluations=[];
   context.solvedErrors.clear();
   context.imported=true;
   context.importOutcome=parsed.outcome;
   context.moves=parsed.moves;
   context.positions=parsed.positions;
   game=new Chess(parsed.positions.at(-1).fen);
   renderAnalysisMoves();
   context.importLabel=`${parsed.players||label} · ${parsed.moves.length} półruchów`;
   gameName.textContent=context.importLabel;
   pgnText.value='';
   importStatus.textContent='';
   showAnalysisPosition(0);
   selectTab(tabButtons[0],true);
  }catch{
   if(fileInput.isConnected&&id===importId)importStatus.textContent='Nie udało się odczytać PGN. Podaj zapis jednej poprawnej partii.';
  }
 };
 fileInput.onchange=()=>{
  const file=fileInput.files[0];
  if(!file)return;
  fileInput.value='';
  return importGame(file,file.name);
 };
 $('#analysis-pgn-form').onsubmit=event=>{
  event.preventDefault();
  return importGame(new Blob([pgnText.value]),'Wklejona partia');
 };
 renderAnalysisMoves();
 showAnalysisPosition(ply);
}
function endgameProgressKey(){
 return 'akademia64-endgames-'+(accounts.user?.id??'guest');
}
function completedEndgames(){
 try{
  const saved=JSON.parse(localStorage.getItem(endgameProgressKey()));
  return new Set(endgames.filter(exercise=>Array.isArray(saved)&&saved.includes(exercise.id)).map(exercise=>exercise.id));
 }catch{return new Set()}
}
function endgamePage(id){
 const exercise=endgames.find(item=>item.id===id);
 if(exercise){startEndgame(exercise);return}
 const completed=completedEndgames();
 main.innerHTML=`
  <a class="back-link" href="#learn">← &nbsp; Mapa nauki</a>
  <div class="page-intro"><h1>Akademia końcówek</h1><p>Przećwicz podstawowe maty, końcówki pionowe i ustawienie wieży. Ukończone lekcje: ${completed.size} z ${endgames.length}.</p></div>
  <section class="unit" aria-label="Lekcje końcówek">
  ${endgames.map((item,index)=>`<a class="lesson-link ${completed.has(item.id)?'done':''}" href="#endgames/${item.id}"><span class="lesson-status">${completed.has(item.id)?'✓':index+1}</span><span><strong>${item.title}</strong><br>${item.goal}</span><small>Ćwicz →</small></a>`).join('')}
  </section>`;
}
function startEndgame(exercise){
 context?.defenseController?.abort();
 const side=exercise.side??'w';
 context={kind:'endgame',item:exercise,side,flipped:side==='b',progressKey:endgameProgressKey()};
 setupBoard(exercise.fen);
 const next=endgames[endgames.indexOf(exercise)+1];
 const player=side==='w'?'białymi':'czarnymi';
 practiceShell(`
  <h1>${exercise.title}</h1>
  <p>${exercise.lesson}</p>
  <div class="instruction"><strong>Cel ćwiczenia</strong><br>${exercise.goal}</div>
  <div id="feedback" class="feedback" role="status">Zagraj ${player}.</div>
  <div class="lesson-actions">
   <button class="btn outline" id="endgame-hint" type="button">Podpowiedź</button>
   <button class="btn outline" id="endgame-restart" type="button">Zacznij od nowa</button>
   <a class="btn" id="endgame-next" href="${next?'#endgames/'+next.id:'#endgames'}" hidden>${next?'Następna lekcja':'Wróć do akademii'}</a>
  </div>`, 'Akademia końcówek', 'Twój ruch');
 $('#board-top').textContent=`Grasz ${player}`;
 $('#endgame-hint').onclick=()=>feedback(exercise.hint);
 $('#endgame-restart').onclick=()=>{startEndgame(exercise);$('#endgame-restart').focus()};
}
function finishEndgame(outcome){
 context.defenseController?.abort();
 solvedNow=true;
 $('#endgame-hint').disabled=true;
 $('#board-bottom').textContent=outcome==='success'?'Lekcja ukończona':'Koniec ćwiczenia';
 if(outcome==='success'){
  if(context.progressKey===endgameProgressKey()){
   const done=completedEndgames();
   done.add(context.item.id);
   try{localStorage.setItem(context.progressKey,JSON.stringify([...done]))}catch{}
   activity();
  }
  $('#endgame-next').hidden=false;
  feedback('Dobrze! Cel ćwiczenia został osiągnięty.','success');
 }else{
  feedback(outcome==='draw'?(game.isStalemate()?'Pat. Spróbuj ponownie i przed szachem matującym zostaw królowi pole ucieczki.':'Remis. Spróbuj ponownie.'):'Przeciwnik dał mata. Spróbuj ponownie.','error');
 }
 drawBoard();
}
function playEndgameMove(move){
 const exercise=context.item;
 if(exercise.objective==='move'){
  const lan=move.from+move.to;
  if(!exercise.answers.includes(lan)){
   selected=null;targets=[];drawBoard();
   feedback('Spróbuj jeszcze raz. '+exercise.hint,'error');
   return;
  }
 }
 const played=moveOnBoard(move);
 lastMove=[played.from,played.to];
 selected=null;targets=[];
 const outcome=endgameOutcome(game,exercise,played);
 if(outcome){finishEndgame(outcome);return}
 $('#board-bottom').textContent='Ruch komputera';
 feedback('Komputer szuka odpowiedzi…');
 drawBoard();
 replyInEndgame();
}
async function replyInEndgame(){
 const active=context;
 const position=game;
 let reply;
 if(!active.defenseFailed){
  active.defenseController??=new AbortController();
  try{
   active.defenseEngine??=createStockfish(active.defenseController.signal);
   const result=await active.defenseEngine.evaluate(position.fen(),{
    startFen:active.item.fen,moves:position.history({verbose:true}).map(move=>move.lan),limit:'depth 13 movetime 350'
   });
   reply=uciMove(result.best);
  }catch{
   if(active!==context||active.defenseController.signal.aborted)return;
   active.defenseFailed=true;
   active.defenseEngine?.close();
  }
 }
 if(active!==context||game!==position||active.defenseController?.signal.aborted)return;
 const played=moveOnBoard(reply??chooseMove(position));
 lastMove=[played.from,played.to];
 context.reviewPly=null;
 const outcome=endgameOutcome(position,active.item,played);
 if(outcome){finishEndgame(outcome);return}
 $('#board-bottom').textContent='Twój ruch';
 feedback(`Komputer zagrał ${played.san}. ${active.item.goal}`);
 drawBoard();
}
const inMemoryTrainingPlans=new Map();
function trainingPlanPage(){
 const storageKey='akademia64-training-'+(accounts.user?.id??'guest');
 const data={
  day:today(),progress:state,lessons:all,endgames,
  completedEndgames:completedEndgames(),correctionCount:pendingCorrections(state).length
 };
 let saved=inMemoryTrainingPlans.get(storageKey);
 if(!saved){
  try{saved=JSON.parse(localStorage.getItem(storageKey))}catch{}
 }
 const plan=dailyTrainingPlan(data,saved);
 const savePlan=()=>{
  inMemoryTrainingPlans.set(storageKey,plan);
  try{localStorage.setItem(storageKey,JSON.stringify(plan))}catch{}
 };
 savePlan();
 main.innerHTML=`
  <a class="back-link" href="#home">← &nbsp; Moja akademia</a>
  <div class="page-intro"><h1>Plan treningowy</h1><p>Wybierz, ile masz dziś czasu. Po każdym ćwiczeniu wróć do planu i oznacz je jako wykonane.</p></div>
  <section class="training-plan" aria-label="Dzisiejszy trening">
   <div class="training-plan-header">
    <label class="account-field" for="training-duration"><span>Czas sesji</span><select id="training-duration">
     ${Object.keys(trainingMinutes).map(minutes=>`<option value="${minutes}">${minutes} minut</option>`).join('')}
    </select></label>
    <span id="training-status" role="status"></span>
    <progress id="training-completion" max="4" aria-label="Ukończone ćwiczenia"></progress>
   </div>
   <ol id="training-segments"></ol>
  </section>`;
 const duration=$('#training-duration');
 duration.value=String(plan.duration);
 function updateStatus(){
  const finished=plan.done[plan.duration].length;
  $('#training-completion').value=finished;
  $('#training-status').textContent=finished===4?'Plan na dziś ukończony.':`${finished} z 4 ćwiczeń ukończonych`;
 }
 function renderSegments(){
  $('#training-segments').innerHTML=trainingSegments(plan,data).map(segment=>`
   <li class="training-segment">
    <div class="training-segment-body"><span class="tiny">${segment.category} · ${segment.minutes} min</span>
     <h2>${segment.title}</h2><p>${segment.instruction}</p>
     <a class="text-link" href="${segment.href}">Otwórz ćwiczenie →</a>
    </div>
    <label class="training-segment-check"><input type="checkbox" data-segment="${segment.id}" ${plan.done[plan.duration].includes(segment.id)?'checked':''}> Wykonane</label>
   </li>`).join('');
  updateStatus();
 }
 duration.onchange=()=>{
  plan.duration=Number(duration.value);
  savePlan();
  renderSegments();
 };
 $('#training-segments').onchange=event=>{
  const {segment}=event.target.dataset;
  if(!segment)return;
  const done=new Set(plan.done[plan.duration]);
  if(event.target.checked)done.add(segment);
  else done.delete(segment);
  plan.done[plan.duration]=[...done];
  savePlan();
  updateStatus();
 };
 renderSegments();
}
function playerProfile(){
 const endgameCount=completedEndgames().size;
 const {streak,days,recent}=profileActivity(state);
 const {xp,level,current,target}=academyLevel(state,endgameCount,days);
 const rating=ratingFromAttempts(state.tactics).rating;
 const dateFormat=new Intl.DateTimeFormat('pl-PL',{dateStyle:'medium',timeZone:'UTC'});
 const badge=(icon,title,description,count,total)=>`
  <article class="achievement ${count===total?'earned':''}">
   <div class="medal" aria-hidden="true">${icon}</div><h3>${title}</h3><p>${description}</p>
   <small>${count===total?'✓ ZDOBYTA':`${count} / ${total} LEKCJI`}</small>
  </article>`;
 const stats=[
  ['Lekcje podstaw',`${state.done.length} / ${all.length}`],
  ['Lekcje końcówek',`${endgameCount} / ${endgames.length}`],
  ['Rozwiązane zadania',state.solved.length],
  ['Partie treningowe',state.games]
 ];
 main.innerHTML=`
  <div class="page-intro"><h1>Profil gracza</h1></div>
  <div class="profile-overview">
   <section class="profile-card" aria-labelledby="profile-level-title">
    <h2 id="profile-level-title">Poziom ${level}</h2>
    <p>${xp.toLocaleString('pl-PL')} XP łącznie</p>
    <label for="profile-xp">${current} / ${target} XP do poziomu ${level+1}</label>
    <progress id="profile-xp" max="${target}" value="${current}"></progress>
    <details><summary>Jak zdobywasz XP?</summary><ul>${xpSources.map(source=>`<li>${source.label} · +${source.points} XP</li>`).join('')}</ul>
    <p class="tiny">XP za lekcję albo zadanie otrzymujesz przy pierwszym ukończeniu. Lekcje końcówek zapisują się w tej przeglądarce.</p></details>
   </section>
   <section class="profile-card" aria-labelledby="profile-stats-title">
    <h2 id="profile-stats-title">Statystyki</h2>
    <dl class="profile-stats">${[...stats,['Ranking taktyczny Glicko-2',rating]].map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>
   </section>
  </div>
  <section class="profile-card profile-activity" aria-labelledby="profile-activity-title">
   <h2 id="profile-activity-title">Historia aktywności</h2>
   <dl class="profile-stats"><div><dt>Dni z treningiem</dt><dd>${days}</dd></div><div><dt>Bieżąca seria dni</dt><dd>${streak}</dd></div></dl>
   ${recent.length?`<h3>Ostatnie dni treningu</h3><ul class="profile-history">${recent.map(({day,attempts,correct})=>`<li><time datetime="${day}">${dateFormat.format(new Date(day+'T00:00:00Z'))}</time><span>${attempts?`Poprawne próby w zadaniach: ${correct} / ${attempts}`:'Aktywność w akademii'}</span></li>`).join('')}</ul>`:'<p>Historia pojawi się po pierwszym treningu.</p>'}
  </section>
  <section aria-labelledby="profile-badges-title">
   <h2 id="profile-badges-title">Osiągnięcia</h2>
   <div class="achievements-grid">${units.map((unit,index)=>badge(unit.icon,unit.badge,`Ukończ etap „${unit.title}”.`,unit.lessons.filter((_,j)=>state.done.includes(`${index}-${j}`)).length,unit.lessons.length)).join('')}
    ${badge('♔','Znawca końcówek','Ukończ Akademię końcówek.',endgameCount,endgames.length)}
   </div>
  </section>`;
}
function route(){context?.defenseController?.abort();fullGameAnalysis?.abort();fullGameAnalysis=null;gameAnalysis?.abort();stopOpeningPreviews?.();stopOpeningPreviews=null;puzzleAnalysis?.abort();cancelPromotion?.();boardInput.dispose();clearTimeout(aiTimer);gameToken++;context=null;const [page='home',id,rating,mode]=(location.hash.slice(1)||'home').split('/');const navPage={endgames:'learn',lesson:'learn',puzzle:'puzzles',corrections:'puzzles',opening:'openings'}[page]||page;const labels={home:'Moja akademia',training:'Plan treningowy',learn:'Mapa nauki',puzzles:'Zadania',openings:'Debiuty',play:'Gra treningowa',analysis:'Analiza Partii',profile:'Profil gracza',achievements:'Profil gracza'};$('#breadcrumb').textContent=labels[navPage]||'Moja akademia';document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===navPage);if(a.dataset.nav===navPage)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});$('.sidebar').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');const routes={home,learn,training:trainingPlanPage,endgames:()=>endgamePage(id),lesson:()=>lesson(id),puzzles:()=>openMixedPuzzle(id),corrections:correctionsPage,puzzle:()=>openPuzzle(id,rating,mode==='corrections'),openings:()=>openingsPage(id),opening:()=>opening(id),play,analysis:analysisPage,profile:playerProfile,achievements:playerProfile};(routes[page]||home)();updateLevel();window.scrollTo(0,0)}
window.addEventListener('hashchange',route);route();
await accounts.start((progress,{background=false}={})=>{
 state=progress;
 if(background){
  if(['#profile','#achievements'].includes(location.hash))playerProfile();
  if(context?.kind==='puzzle'){updateTacticsStats();renderCorrectionLink();updatePuzzleThemeStats()}
  updateLevel();
 }else if(['analysis','analysisExercise','endgame'].includes(context?.kind))updateLevel();
 else route();
});
