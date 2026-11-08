import { createBoardInput } from './board-input.js?v=20261108-board-flip';
import { accounts } from './accounts.js?v=20261108-rating-reset';
import { normalizeProgress, pendingCorrections } from './progress.js?v=20261108-rating-reset';
import { Chess } from './vendor/chess.js';
import { openingChapter } from './opening-chapter.js?v=20261108-caro-videos';
import { lichessPuzzles } from './puzzle-bank.js';
import { ratingFromAttempts, rateAttempt, ratedAttempts, choosePuzzle, STARTING_RATING, RATING_VERSION, PUZZLE_RATING_RANGE } from './tactics-rating.js?v=20261108-rating-match';
import { analyzePuzzle } from './puzzle-analysis.js';
import { openSoundSettings, soundMove, unlockChessSound } from './chess-sound.js?v=20261108-recorded-clicks';
const boardInput=createBoardInput();
const $=s=>document.querySelector(s);const main=$('#main');
const icons={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
const names={k:'król',q:'hetman',r:'wieża',b:'goniec',n:'skoczek',p:'pion'};
const puzzleColors={orange:'pomarańczowy',green:'zielony',red:'czerwony',blue:'niebieski'};
let puzzleAnalysis;
function puzzlePiece(type,color){
 return icons[type];
}
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
for(const [i,p] of originalPuzzles.entries())p.rating=900+i*80;
const themesPL={mate:'Mat',mateIn1:'Mat w 1',mateIn2:'Mat w 2',mateIn3:'Mat w 3',fork:'Widełki',pin:'Związanie',skewer:'Rentgen',discoveredAttack:'Atak z odsłony',endgame:'Końcówka',sacrifice:'Poświęcenie',hangingPiece:'Niebroniona figura',defensiveMove:'Obrona',promotion:'Promocja',trappedPiece:'Uwięziona figura',backRankMate:'Mat na ostatniej linii',doubleCheck:'Podwójny szach'};
for(const row of lichessPuzzles){
 puzzles.push({
  id:'li_'+row.id,source:'lichess',title:'Znajdź najlepszą kontynuację',
  category:row.themes.map(t=>themesPL[t]).find(Boolean)||'Taktyka',
  rating:row.rating,fen:row.fen,line:row.line,
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
function today(){return new Date().toLocaleDateString('sv-SE')}
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
function updateLevel(){$('#level-name').textContent=state.done.length>=all.length?'Absolwent podstaw':state.done.length>=10?'Odkrywca szachów':'Początkujący'}
function progress(){return Math.round(state.done.length/all.length*100)}
function nextLesson(){return all.find(l=>!state.done.includes(l.id))||all[0]}
function mini(fen='start',marked=[],renderPiece=p=>icons[p.type]){const g=fen==='start'?new Chess():new Chess(fen);return `<div class="mini-board" aria-hidden="true">${g.board().flatMap((row,r)=>row.map((p,c)=>`<span class="${(r+c)%2?'dark':''} ${p?.color==='w'?'white':''} ${marked.includes('abcdefgh'[c]+(8-r))?'marked':''}">${p?renderPiece(p):''}</span>`)).join('')}</div>`}
function openingDiagram(moves,marked,caption){
 const position=new Chess();
 moves.forEach(move=>position.move(move));
 return `<figure class="opening-diagram">${mini(position.fen(),marked)}<figcaption>${caption}</figcaption></figure>`;
}
function pathHTML(){return `<div class="path modern-path">${units.map((u,i)=>{const count=u.lessons.filter((l,j)=>state.done.includes(`${i}-${j}`)).length;const lesson=u.lessons.findIndex((l,j)=>!state.done.includes(`${i}-${j}`));const current=nextLesson().ui===i;return `<a href="#lesson/${i}-${lesson<0?0:lesson}" class="path-node ${count===u.lessons.length?'done':current?'current':''}"><div class="path-node-top"><span class="node-circle">${count===u.lessons.length?'✓':u.icon}</span><span class="stage-number">0${i+1}</span></div><strong>${['Szachownica','Twoja armia','Bezpieczny król','Zasady specjalne','Plan gry','Pierwsza partia'][i]}</strong><div class="stage-meta"><span>${count} / ${u.lessons.length} lekcji</span><span>${current?'Teraz':count===u.lessons.length?'Ukończone':'→'}</span></div><div class="progress"><span style="width:${count/u.lessons.length*100}%"></span></div></a>`}).join('')}</div>`}
function home(){
 queueMicrotask(updatePuzzleBankCount);
 const l=nextLesson(),percent=progress();
 const dayTasks=[state.done.length>0,state.solved.length>0,state.games>0].filter(Boolean).length;
 main.innerHTML=`<header class="academy-banner"><div class="banner-copy"><div class="banner-kicker"><span></span> AKADEMIA 64 <span class="banner-kicker-line"></span> SZTUKA DOBREGO RUCHU</div><h1>Wielka gra.<br><em>Zaczyna się od Ciebie.</em></h1><p>Odkrywaj, ćwicz, graj. Z każdym ruchem buduj swoją szachową pewność.</p><a class="banner-link" href="#learn">Odkryj swoją ścieżkę <span aria-hidden="true">↗</span></a></div><div class="banner-art" aria-hidden="true"><div class="banner-halo"></div><div class="banner-board"></div><svg class="banner-chess" viewBox="0 0 380 300" fill="none"><defs><linearGradient id="ivory-piece" x1="160" y1="60" x2="260" y2="260" gradientUnits="userSpaceOnUse"><stop stop-color="#fff7da"/><stop offset=".5" stop-color="#e6d2a4"/><stop offset="1" stop-color="#a58c58"/></linearGradient><linearGradient id="green-piece" x1="40" y1="100" x2="180" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#819b74"/><stop offset="1" stop-color="#273f30"/></linearGradient></defs><ellipse cx="225" cy="264" rx="95" ry="13" fill="#091c15" opacity=".35"/><ellipse cx="107" cy="269" rx="63" ry="10" fill="#091c15" opacity=".3"/><g fill="url(#green-piece)" stroke="#b3c5a0" stroke-width="1.2" stroke-linejoin="round"><path d="M61 243c0-4 3-7 7-7h80c4 0 7 3 7 7l7 13c1 3-1 6-4 6H58c-4 0-5-3-4-6l7-13Z"/><path d="M94 168h28c-1 28 1 45 18 62H76c17-17 19-34 18-62Z"/><rect x="85" y="157" width="46" height="12" rx="5"/><path d="M108 103c-9 11-27 24-27 37 0 12 12 19 27 19s27-7 27-19c0-13-18-26-27-37Z"/><circle cx="108" cy="96" r="7"/><path d="M73 229h70c5 0 8 3 8 7v4H65v-4c0-4 3-7 8-7Z"/></g><path d="m113 116-13 24" stroke="#243e2b" stroke-width="4.5" stroke-linecap="round"/><path d="M119 126c5 5 8 10 8 15 0 6-4 10-10 12M99 177c0 18-2 32-8 43M72 247h70" stroke="#c2d2ad" stroke-width="2" stroke-linecap="round" opacity=".5"/><g fill="url(#ivory-piece)" stroke="#f5e7bf" stroke-width="1.1"><path d="M193 52h17V35h13v17h17v13h-17v24h-13V65h-17V52Z"/><path d="m184 97 13-12h40l13 12-10 35h-47l-9-35Z"/><path d="M196 142h41c-1 38 0 60 23 83h-87c23-23 24-45 23-83Z"/><rect x="187" y="131" width="59" height="12" rx="5"/><path d="M175 225h83l12 18H164l11-18Z"/><rect x="157" y="244" width="121" height="17" rx="6"/></g><path d="M202 153c0 25-2 42-10 57M199 99h33" stroke="#fff8e1" stroke-width="3" stroke-linecap="round" opacity=".55"/></svg><span class="banner-coordinate coordinate-a">a</span><span class="banner-coordinate coordinate-h">h</span><span class="banner-art-label">64 POLA. NIESKOŃCZENIE MOŻLIWOŚCI.</span></div></header>
 <div class="hero-grid"><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="hero-status-dot"></span> ${state.done.length?'KONTYNUUJ SWOJĄ ŚCIEŻKĘ':'ZACZNIJ OD MAŁEGO KROKU'}</div><h2>${state.done.length?l.title:'Poznaj grę.<br>Odkryj możliwości.'}</h2><p>${state.done.length?'Kolejna lekcja, kolejna umiejętność. Wróć dokładnie tam, gdzie kończy się Twój ostatni trening.':'Szachy zaczynają się od jednego ruchu. Przejdziemy z Tobą całą drogę — od zasad po pierwszą partię.'}</p><div class="hero-meta"><span>◷ &nbsp; 5–8 min</span><span class="hero-meta-divider"></span><span>Interaktywna lekcja</span></div><a class="btn light" href="#lesson/${l.id}">${state.done.length?'Kontynuuj naukę':'Rozpocznij naukę'} <span>↗</span></a><div class="hero-course-note">OD ZERA DO PIERWSZEJ PARTII <span>·</span> ${percent}% ukończone</div></div><div class="hero-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="hero-board-wrap">${mini('r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4')}</div><div class="board-floating-note"><span>♞</span><div>Każda partia to nowy początek.<small>Zrób swój pierwszy ruch.</small></div></div></div></section>
 <section class="daily-card"><div class="card-heading"><div><div class="eyebrow">MAŁY PLAN, DUŻY POSTĘP</div><h3>Dobry rytm nauki</h3></div><span class="daily-count">${dayTasks}<small>/3</small></span></div><div class="daily-list"><a class="daily-item" href="#lesson/${l.id}"><span class="step-icon ${state.done.length?'completed':''}">${state.done.length?'✓':'01'}</span><div><strong>Poznaj nowy temat</strong><small>${l.title}</small></div><span>↗</span></a><a class="daily-item" href="#puzzles"><span class="step-icon ${state.solved.length?'completed':''}">${state.solved.length?'✓':'02'}</span><div><strong>Znajdź dobry ruch</strong><small>Krótkie zadanie na rozgrzewkę</small></div><span>↗</span></a><a class="daily-item" href="#play"><span class="step-icon ${state.games?'completed':''}">${state.games?'✓':'03'}</span><div><strong>Zagraj bez pośpiechu</strong><small>Partia treningowa bez zegara</small></div><span>↗</span></a></div><div class="daily-footer"><span class="live-dot"></span><span>Regularność jest ważniejsza niż tempo.</span></div></section></div>
 <div class="stats"><a href="#learn" class="stat"><div><div class="stat-name">Ukończone lekcje</div><div class="stat-value">${state.done.length}<small> / ${all.length}</small></div><span class="stat-detail">Budujesz solidne podstawy</span></div><span class="stat-icon">▤</span></a><a href="#puzzles" class="stat"><div><div class="stat-name">Rozwiązane zadania</div><div class="stat-value">${state.solved.length}<small data-puzzle-count data-prefix=" / "></small></div><span class="stat-detail">Trenujesz szachową intuicję</span></div><span class="stat-icon">♟</span></a><a href="#achievements" class="stat"><div><div class="stat-name">Zdobyte odznaki</div><div class="stat-value">${earnedCount()}<small> / ${units.length}</small></div><span class="stat-detail">Małe sukcesy mają znaczenie</span></div><span class="stat-icon">✧</span></a></div>
 <div class="dashboard-bottom"><section class="course-section"><div class="section-heading"><div><div class="eyebrow">KROK PO KROKU</div><h2>Twoja mapa nauki</h2></div><a class="text-link" href="#learn">Cały kurs <span>↗</span></a></div><div class="course-overview"><div class="course-top"><div><h3>Od zera do pierwszej partii</h3><p>6 etapów <span>·</span> ${all.length} praktycznych lekcji</p></div><span class="course-tag">PODSTAWY</span></div>${pathHTML()}<div class="course-bottom"><div class="course-progress-info"><strong>${percent}%</strong><span>Twojej pierwszej ścieżki</span></div><a class="text-link" href="#lesson/${l.id}">Zrób kolejny krok <span>→</span></a></div></div></section><section class="insight-section"><div class="section-heading"><div><div class="eyebrow">CHWILA NA REFLEKSJĘ</div><h2>Przy szachownicy</h2></div><span class="tiny">✧</span></div><div class="quote-card"><div class="insight-mark">“</div><div class="eyebrow">WARTO ZAPAMIĘTAĆ</div><blockquote>Dobry ruch zaczyna się od dobrego pytania.</blockquote><p>Co grozi przeciwnik? Zanim przesuniesz figurę, daj sobie chwilę na spojrzenie na całą planszę.</p><a class="text-link" href="#play">Sprawdź to w grze <span>↗</span></a><span class="quote-piece" aria-hidden="true">♞</span></div></section></div>`;
}
function earned(i){return units[i].lessons.every((l,j)=>state.done.includes(`${i}-${j}`))}function earnedCount(){return units.filter((u,i)=>earned(i)).length}
function learn(){main.innerHTML=`<div class="page-intro"><div class="eyebrow">TWOJA ŚCIEŻKA</div><h1>Małe kroki. Solidne podstawy.</h1><p>Od pierwszego ruchu do samodzielnej partii. Idź po kolei lub wybierz temat, który Cię ciekawi.</p></div><div class="map-summary"><div><h3>Od zera do pierwszej partii</h3><p>${state.done.length} z ${all.length} lekcji · ${units.length} etapów</p></div><div><div class="progress-label"><span>Twój postęp</span><span>${progress()}%</span></div><div class="progress"><span style="width:${progress()}%"></span></div></div></div><div class="units">${units.map((u,i)=>`<section class="unit"><div class="unit-header"><div class="unit-emblem">${u.icon}</div><div><div class="eyebrow">ETAP 0${i+1}</div><h2>${u.title}</h2></div></div>${u.lessons.map((l,j)=>`<a class="lesson-link ${state.done.includes(`${i}-${j}`)?'done':''}" href="#lesson/${i}-${j}"><span class="lesson-status">${state.done.includes(`${i}-${j}`)?'✓':j+1}</span><span>${l.title}</span><small>${l.type==='game'?'Partia':'5–8 min'} &nbsp; →</small></a>`).join('')}<div class="badge-row">✧ &nbsp; ${earned(i)?'Zdobyta odznaka:':'Odznaka etapu:'} ${u.badge}</div></section>`).join('')}</div>`}
let game=null,selected=null,targets=[],lastMove=null,context=null,solvedNow=false,aiTimer=null,gameToken=0,openingStep=0,openingMode='show',hintCount=0;
function boardHTML(g,highlight=lastMove){
const flipped=context?.flipped;
const position=g.board();
return `<div class="board ${context?.kind==='puzzle'?'puzzle-board':''}" role="group" aria-label="Interaktywna szachownica">${position.flatMap((row,viewRow)=>row.map((_,viewCol)=>{const r=flipped?7-viewRow:viewRow,c=flipped?7-viewCol:viewCol,p=position[r][c];const sq='abcdefgh'[c]+(8-r);return `<button class="square ${(r+c)%2?'dark':''} ${context?.reviewPly==null&&selected===sq?'selected':''} ${context?.reviewPly==null&&targets.includes(sq)&&(context?.kind!=='play'||$('#show-targets')?.checked!==false)?'target':''} ${highlight?.includes(sq)?'last':''}" data-square="${sq}" aria-label="${sq}${p?`, ${p.color==='w'?'biały':'czarny'} ${names[p.type]}`:', puste pole'}">${p?`<span class="piece ${p.color==='w'?'white':''}">${context?.kind==='puzzle'?puzzlePiece(p.type,p.color):icons[p.type]}</span>`:''}${viewCol===0?`<span class="coord rank">${8-r}</span>`:''}${viewRow===7?`<span class="coord">${'abcdefgh'[c]}</span>`:''}</button>`})).join('')}</div>`}
function canDragPiece(sq){if(solvedNow||!game||!context||context.reviewPly!=null)return false;if(context.kind==='opening'&&(openingMode==='show'||openingStep>=context.item.line.length))return false;if(context.kind==='play'&&(game.turn()!=='w'||game.isGameOver()))return false;if(context.kind==='lesson'&&['square','quiz','game'].includes(context.item.type))return false;return game.get(sq)?.color===game.turn()}
function drawBoard(){
 if(!$('#board-host'))return;
 const preview=context?.positions?.[context.reviewPly];
 const boardGame=preview?new Chess(preview.fen):game;
 $('#board-host').innerHTML=preview?boardHTML(boardGame,preview.move):boardHTML(boardGame);
 updateBoardNavigation();
 boardInput.attach($('#board-host .board'),{position:boardGame.fen(),flipped:context?.flipped,drawing:context?.drawing,pieceAt:sq=>boardGame.get(sq),playerColor:context?.kind==='play'?'w':boardGame.turn(),canDrag:canDragPiece,click:clickSquare,move:(from,to)=>{if(!canDragPiece(from))return;selected=from;targets=game.moves({square:from,verbose:true}).map(m=>m.to);clickSquare(to)}})}
function setupBoard(fen){puzzleAnalysis?.abort();cancelPromotion?.();boardInput.reset();game=fen==='start'?new Chess():new Chess(fen);context.positions=[{fen:game.fen(),move:null}];context.reviewPly=null;selected=null;targets=[];lastMove=null;solvedNow=false}
function practiceShell(panel,label='Ćwiczenie',bottom='Białe · Twój ruch'){main.innerHTML=`<a href="${context.kind==='lesson'?'#learn':context.kind==='puzzle'?'#puzzles':context.kind==='opening'?'#openings':'#home'}" class="back-link">← &nbsp; ${context.kind==='lesson'?'Wróć do mapy':context.kind==='puzzle'?'Miszmasz':context.kind==='opening'?'Wszystkie debiuty':'Moja akademia'}</a><div class="practice-layout"><section class="board-card"><div class="board-label"><span>${label}</span><span id="board-top">${context.kind==='play'?'Komputer · czarne':'Odkrywaj na szachownicy'}</span></div><div id="board-host"></div><div class="board-label bottom"><span id="board-bottom">${bottom}</span><span id="board-review" aria-live="polite" hidden></span>${boardControls()}</div></section><section class="lesson-panel">${panel}</section></div>`;bindBoardControls();drawBoard()}
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
  event.currentTarget.setAttribute('aria-pressed',String(context.flipped));
  drawBoard();
 };
}
function boardNavigationRange(){
 if(context.kind==='opening'&&openingMode==='show')return {current:openingStep,last:context.item.line.length};
 const last=context.positions.length-1;
 return {current:context.reviewPly??last,last};
}
function updateBoardNavigation(){
 const {current,last}=boardNavigationRange();
 for(const [action] of boardNavigation){
  $('[data-board-nav="'+action+'"]').disabled=action==='first'||action==='previous'?current===0:current===last;
 }
 const reviewing=context.reviewPly!=null;
 $('#board-bottom').hidden=reviewing;
 const review=$('#board-review');
 review.hidden=!reviewing;
 review.textContent=reviewing?`Pozycja ${current} z ${last}`:'';
}
function showBoardPosition(action){
 const {current,last}=boardNavigationRange();
 const destination={first:0,previous:current-1,next:current+1,last}[action];
 if(destination<0||destination>last||destination===current)return;
 if(context.kind==='opening'&&openingMode==='show'){goToOpeningStep(destination);return}
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
  for(const type of ['q','n','r','b']){const button=document.createElement('button');button.type='button';button.className='promotion-choice';button.setAttribute('aria-label',names[type]);button.innerHTML=`<span class="piece ${pawn.color==='w'?'white':''}">${context.kind==='puzzle'?puzzlePiece(type,pawn.color):icons[type]}</span>`;button.onclick=e=>{e.stopPropagation();finish(type)};column.append(button)}
  overlay.append(column);overlay.addEventListener('pointerdown',e=>e.stopPropagation());overlay.addEventListener('contextmenu',e=>e.preventDefault());overlay.addEventListener('click',e=>{e.stopPropagation();if(e.target===overlay)finish(null)});
  overlay.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();finish(null)}if(e.key==='Tab'){e.preventDefault();const buttons=[...column.children],i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?3:1))%4].focus()}});
  board.append(overlay);column.firstElementChild.focus();
 });
}

async function clickSquare(sq){if(cancelPromotion)return;if(solvedNow||!game||context?.reviewPly!=null)return;if(context.kind==='opening'&&(openingMode==='show'||openingStep>=context.item.line.length))return;if(context.kind==='play'&&(game.turn()!=='w'||game.isGameOver()))return;
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
if(context.kind==='opening'){const expected=new Chess(game.fen());const m=expected.move(context.item.line[openingStep]);if(m.from!==from||m.to!==sq||(m.promotion&&promotion!==m.promotion)){soundMove(null,{answer:'incorrect'});feedback('Ten ruch jest legalny, ale ćwiczymy inny wariant. Skorzystaj z podpowiedzi.','error');return}moveOnBoard(move,{answer:'correct'});openingStep++;lastMove=[from,sq];selected=null;targets=[];drawBoard();updateOpening();return}
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
   rating:row[3],fen:row[1],line:row[2].split(' '),
   text:'Znajdź i wykonaj całą kombinację. Przeciwnik odpowie automatycznie.',
   hint:'Sprawdź najpierw szachy, bicia i groźby.'});
 }
 if(!puzzleId)loadedPuzzleShards.add(shard.file);
 return true;
}
async function openMixedPuzzle(){
 const token=++mixedRequest;
 const previous=location.hash;
 const rating=ratingFromAttempts(state.tactics).rating;
 const unavailable=new Set([...state.tactics.map(attempt=>attempt.id),...recentlySeenPuzzles]);
 const closestUnseen=()=>puzzles.reduce((distance,puzzle)=>
  unavailable.has(puzzle.id)?distance:Math.min(distance,Math.abs(puzzle.rating-rating)),Infinity);
 if(!loadedPuzzleShards.size||closestUnseen()>PUZZLE_RATING_RANGE){
  if(previous==='#puzzles'||previous===''||previous==='#home'){
   main.innerHTML='<div class="page-intro"><h1>Miszmasz</h1><p role="status">Dobieranie zadania do Twojego rankingu…</p></div>';
  }
  try{
   let closest=closestUnseen();
   while(token===mixedRequest&&location.hash===previous){
    if(!await fetchPuzzleShard(rating,closest))break;
    closest=closestUnseen();
    if(closest<=PUZZLE_RATING_RANGE)break;
   }
  }
  catch(error){console.warn('Baza zadań:',error);/* zachowaj dotychczasowe zadania */ }
 }
 if(token!==mixedRequest||location.hash!==previous)return;
 puzzle(nextMixedPuzzle());
}
let recentlySeenPuzzles=[];
function nextMixedPuzzle(){
 const p=choosePuzzle(puzzles,state.tactics,recentlySeenPuzzles);
 recentlySeenPuzzles.push(p.id);
 if(recentlySeenPuzzles.length>25)recentlySeenPuzzles.shift();
 return p.id;
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
  link.href=puzzleHref(attempt);
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
 if(!already)state.tactics.push({id,rating,ok,at,ratingVersion:RATING_VERSION});
 const updateCorrection=!ok||(previous??first)?.ok===false;
 if(updateCorrection){
  state.corrections=state.corrections.filter(attempt=>attempt.id!==id);
  state.corrections.push({id,rating,ok,at:Math.max(at,(previous?.at??0)+1)});
 }
 if(!already||updateCorrection)save();
 renderCorrectionLink();
 const after=ratingFromAttempts(state.tactics).rating;
 const change=after-before;
 ctx.tileResult={ok,delta:already?0:change,repeat:already};
 const label=already?'Powtórka bez punktów':(change>=0?'+':'')+change+' pkt';
 const status=document.querySelector('#tactic-result');
 if(status)status.textContent=label;
 updateTacticsStats();
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
 const attempts=[...(state.tactics||[])].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
 const ratings={legacy:null,current:null};
 const history=attempts.map(attempt=>{
  const archived=attempt.ratingVersion!==RATING_VERSION;
  const group=archived?'legacy':'current';
  const previous=ratings[group];
  const next=rateAttempt(previous,attempt);
  const delta=next.rating-(previous?.rating??STARTING_RATING);
  ratings[group]=next;
  return {id:attempt.id,rating:attempt.rating,ok:attempt.ok,delta,archived};
 });
 const latest=history.filter(a=>!ctx.tileResult||a.id!==ctx.item.id).slice(-11);
 const current=ctx.tileResult||null;
 const tiles=[...latest,{id:ctx.item.id,rating:ctx.item.rating,ok:current?.ok,delta:current?.delta??null,pending:!current,repeat:current?.repeat}];
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
  el.setAttribute('title',item.pending?'Bieżące zadanie — oczekiwanie na wynik':(item.ok?'Poprawne':'Błędne')+' · '+(item.delta>0?'+':'')+item.delta+' pkt'+(item.repeat?' · powtórka':'')+(item.archived?' · przed resetem rankingu':''));
  el.setAttribute('aria-label','Otwórz zadanie '+item.id+' · '+el.title);
  list.append(el);
 }
}
function puzzleList(filter='Wszystkie'){const list=filter==='Wszystkie'?puzzles:puzzles.filter(p=>p.category===filter);main.innerHTML=`<div class="page-intro"><div class="eyebrow">TRENING UWAŻNOŚCI</div><h1>Znajdź ten jeden dobry ruch.</h1><p>Ćwicz rozpoznawanie okazji. Bez zegara, z podpowiedzią, zawsze we własnym tempie.</p></div><div class="filters">${['Wszystkie','Mat w jednym','Podwójny atak','Zdobywanie figur'].map(f=>`<button class="filter ${f===filter?'active':''}" data-filter="${f}">${f}</button>`).join('')}</div><div class="puzzle-cards">${list.map(p=>`<a href="#puzzle/${p.id}" class="puzzle-card"><div class="puzzle-art">${mini(p.fen,[],piece=>puzzlePiece(piece.type,piece.color))}</div><div class="puzzle-body"><div class="eyebrow">${p.category}</div><h3>${p.title}</h3><p>${p.level}</p></div><div class="puzzle-footer"><span>${state.solved.includes(p.id)?'✓ Rozwiązane':'Białe zaczynają'}</span><span>Rozwiąż &nbsp; →</span></div></a>`).join('')}</div>`;document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>puzzleList(b.dataset.filter))}
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

async function openPuzzle(id,rating){
 if(puzzles.some(item=>item.id===id)){puzzle(id);return}
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
 if(puzzles.some(item=>item.id===id))puzzle(id);
 else main.innerHTML='<p role="alert">Nie znaleziono zadania. <a href="#puzzles">Wylosuj inne zadanie</a>.</p>';
}
function puzzle(id){
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
  <div class="puzzle-task-heading"><span class="eyebrow">MISZMASZ · ${p.category}</span><span><span data-puzzle-count data-prefix="Baza "></span><span> · ranking ${p.rating}</span></span></div>
  <div class="tactic-stats" aria-label="Ranking taktyczny"><span><small>Twój ranking Glicko-2</small><strong id="tactic-rating">${STARTING_RATING}</strong> <small id="tactic-rd">±350</small></span><span><small>Ocenione próby</small><strong id="tactic-count">0</strong></span><span><small>Skuteczność</small><strong id="tactic-accuracy">—</strong></span></div>
  <div class="tactic-result" id="tactic-result" role="status"></div>
  <h2>${p.title}</h2>
  <div class="instruction puzzle-turn"><span class="turn-pawn ${white?'white':'black'}" aria-hidden="true">♟</span><span>${white?'Ruch białych':'Ruch czarnych'}<br>${p.text}</span></div>
  <div id="feedback" class="feedback" aria-live="polite">${state.solved.includes(id)?'To zadanie masz już rozwiązane. Powtórz je dla utrwalenia.':'Wybierz figurę i wskaż pole docelowe.'}</div>
  <div class="lesson-actions">
   <a class="btn outline" id="puzzle-corrections" href="#corrections">Poprawka</a>
   <button class="btn outline" id="hint">Podpowiedź</button>
   <button class="text-link" id="show-puzzle-solution">Pokaż rozwiązanie</button>
   <button class="btn" id="next-puzzle" type="button" hidden>Kolejne zadanie →</button>
  </div>
  <section class="puzzle-analysis">
   <h3>Analiza zadania</h3>
   <p id="puzzle-answer">Rozwiąż zadanie lub pokaż rozwiązanie, aby zobaczyć analizę.</p>
   <p id="stockfish-result" role="status"></p>
   <a href="https://github.com/nmrugg/stockfish.js/tree/v19.0.1">Źródła Stockfish.js 19.0.1 (GPLv3)</a>
  </section>`, 'Pozycja treningowa',context.turnLabel);
 updatePuzzleBankCount();

 main.querySelector('.board-card').insertAdjacentHTML('beforeend',`
  <section class="tactic-history" aria-label="Historia punktów z ostatnich zadań">
   <div class="tactic-history-heading">
    <strong>Ostatnie zadania</strong>
    <span>Zmiana rankingu</span>
   </div>
   <div class="tactic-tiles" id="tactic-tiles" aria-live="polite"></div>
  </section>`);
 $('#next-puzzle').onclick=()=>openMixedPuzzle();
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
 const showCourseBoard=course&&location.hash.endsWith('/board');
 context={kind:'opening',item:o};
 openingStep=0;
 openingMode='show';
 setupBoard('start');
 practiceShell(`
  <div class="eyebrow">WARSZTAT DEBIUTOWY${o.eco?' · '+e(o.eco):''}</div>
  <h2>${e(course?.title||o.title)}</h2>
  <div class="opening-example">
  ${course?`<label class="opening-variant-label">Wybierz wariant do prześledzenia
    <select id="course-variant">${course.variants.map((variant,i)=>`<option value="course-${course.id}-${i}">${e(variant.title)}</option>`).join('')}</select>
  </label>`:''}
  <p>${e(o.desc||'Przykładowy przebieg wariantu z katalogu ECO.')}</p>
  ${o.plan?`<p><strong>Na co zwrócić uwagę</strong><br>${e(o.plan)}</p>`:''}
  </div>
  ${o.relatedCourse?`<p><a class="text-link" href="#opening/course-${o.relatedCourse.id}-0">Przeczytaj lekcję o całym debiucie →</a></p>`:''}
  <div class="opening-walkthrough">
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
  boardCard.prepend(example);
  boardCard.append(walkthrough);
  lesson.append(title,layout);
 }
 main.replaceChildren(lesson);
 if(course){
  const variants=$('#course-variant');
  variants.value=id;
  variants.onchange=()=>{location.hash='opening/'+variants.value+'/board'};
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
 $('#opening-next').onclick=()=>goToOpeningStep(openingStep+1);
 $('#opening-prev').onclick=()=>goToOpeningStep(openingStep-1);
 $('#opening-hint').onclick=()=>{
  if(openingStep>=o.line.length)return;
  const move=new Chess(game.fen()).move(o.line[openingStep]);
  feedback(`Ruch ${openingStep+1}: ${names[move.piece]} z ${move.from} na ${move.to}.`);
 };
 updateOpening();
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
 openingMode=mode;openingStep=0;setupBoard('start');drawBoard();
 for(const [id,value] of [['show-mode','show'],['practice-mode','practice']]){
  const button=$('#'+id);
  button.classList.toggle('active',mode===value);
  button.setAttribute('aria-pressed',String(mode===value));
 }
 $('#opening-next').hidden=mode==='practice';
 $('#opening-hint').hidden=mode==='show';
 updateOpening();
}
function updateOpening(){
 const {item:o}=context;
 const moves=$('#opening-moves');
 moves.replaceChildren(...o.line.map((move,index)=>{
  const token=document.createElement('span');
  token.className='move'+(index===openingStep-1?' current':'');
  token.textContent=(index%2===0?Math.floor(index/2+1)+'. ':'')+
   (openingMode==='practice'&&index>=openingStep?'…':move);
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
function achievements(){main.innerHTML=`<div class="page-intro"><div class="eyebrow">ŚLADY TWOJEGO ROZWOJU</div><h1>Umiejętności, z których możesz być dumny.</h1><p>Każda odznaka oznacza ukończony etap. Zbieraj doświadczenia i wracaj do nauki wtedy, kiedy masz ochotę.</p></div><div class="achievements-grid">${units.map((u,i)=>`<div class="achievement ${earned(i)?'earned':''}"><div class="medal">${u.icon}</div><h3>${u.badge}</h3><p>Ukończ etap „${u.title}”.</p><small>${earned(i)?'✓ ZDOBYTA':`${u.lessons.filter((l,j)=>state.done.includes(`${i}-${j}`)).length} / ${u.lessons.length} LEKCJI`}</small></div>`).join('')}</div><div class="empty-note">${state.days.length?`Masz za sobą ${state.days.length} ${state.days.length===1?'dzień':'dni'} aktywnej nauki. `:''}Odznaki zostają z Tobą. Przerwa w nauce nie odbiera żadnego osiągnięcia.</div>`}
function route(){puzzleAnalysis?.abort();cancelPromotion?.();boardInput.dispose();clearTimeout(aiTimer);gameToken++;context=null;const [page='home',id,rating]=(location.hash.slice(1)||'home').split('/');const navPage={lesson:'learn',puzzle:'puzzles',corrections:'puzzles',opening:'openings'}[page]||page;const labels={home:'Moja akademia',learn:'Mapa nauki',puzzles:'Zadania',openings:'Debiuty',play:'Gra treningowa',achievements:'Osiągnięcia'};$('#breadcrumb').textContent=labels[navPage]||'Moja akademia';document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===navPage);if(a.dataset.nav===navPage)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});$('.sidebar').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');const routes={home,learn,lesson:()=>lesson(id),puzzles:()=>openMixedPuzzle(),corrections:correctionsPage,puzzle:()=>openPuzzle(id,rating),openings:()=>openingsPage(id),opening:()=>opening(id),play,achievements};(routes[page]||home)();updateLevel();window.scrollTo(0,0)}
window.addEventListener('hashchange',route);route();
await accounts.start(progress=>{state=progress;route()});
