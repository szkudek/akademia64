const starts = {
  caro: ['e4 c6 d4 d5', ['Białe zajmują centrum.', 'Czarne przygotowują …d5.', 'Białe budują centrum dwoma pionami.', 'Czarne podważają pionka e4.']],
  spanish: ['e4 e5 Nf3 Nc6 Bb5', ['Białe zajmują centrum.', 'Czarne odpowiadają symetrycznie.', 'Skoczek atakuje e5.', 'Skoczek broni e5.', 'Goniec naciska na obrońcę pionka e5.']],
  sicilian: ['e4 c5', ['Białe zajmują centrum.', 'Czarne walczą o d4 pionkiem z flanki.']],
};

function line(course, eco, title, desc, plan, moves, notes) {
  const [start, startNotes] = starts[course];
  return { eco, title, desc, plan, san: (start + ' ' + moves).split(' '), notes: [...startNotes, ...notes] };
}

export const caroExtra = [
  line('caro', 'B17', 'Pułapka w wariancie Karpowa — 6.Nd6#',
    'Hetman na e2 wiąże pionka e7. Po odruchowym …Ngf6 czarny król dostaje mata.',
    'Przed rozwojem skoczka sprawdź szach Nd6 i ustal, czy pion e7 może legalnie zbić.',
    'Nd2 dxe4 Nxe4 Nd7 Qe2 Ngf6 Nd6#', [
      'Skoczek wspiera e4.', 'Czarne wymieniają pionka w centrum.', 'Skoczek odzyskuje pionka.',
      'Skoczek d7 wspiera pole f6, ale zabiera królowi pole ucieczki.', 'Hetman wiąże pionka e7 do króla.',
      'Skoczek rozwija się na f6, nie przerywając związania.', 'Skoczek matuje. Pion e7 nie może go zbić.',
    ]),
  line('caro', 'B17', 'Wariant Karpowa — obrona 5…e6',
    'Pion schodzi z e7, a goniec f8 zyskuje dostęp do d6.',
    'Porównaj z matem po 5…Ngf6. Tutaj na 6.Nd6+ czarne mogą zbić skoczka gońcem.',
    'Nd2 dxe4 Nxe4 Nd7 Qe2 e6 Nd6+ Bxd6', [
      'Skoczek broni e4.', 'Czarne otwierają centrum.', 'Białe odbijają skoczkiem.',
      'Czarne przygotowują rozwój skoczka g8.', 'Białe grożą skokiem na d6.',
      'Czarne otwierają przekątną f8–e7–d6.', 'Białe sprawdzają, czy dawny motyw nadal działa.',
      'Goniec zbija szachującego skoczka.',
    ]),
  line('caro', 'B12', 'Wariant Tala — goniec bez odwrotu',
    'Po 4.h4 e6 białe mogą zagrać g4, h5 i f3, odbierając gońcowi pola.',
    'Po 4.h4 rozważ 4…h5, które kontroluje g4 i pozostawia gońcowi drogę odwrotu.',
    'e5 Bf5 h4 e6 g4 Bg6 h5 Be4 f3 Bxc2 Qxc2', [
      'Białe zdobywają przestrzeń.', 'Goniec wychodzi poza łańcuch pionów.', 'Białe przygotowują g4 i h5.',
      'Czarne wzmacniają d5, ale muszą liczyć się z atakiem na gońca.', 'Pion atakuje gońca.',
      'Goniec cofa się na g6.', 'Kolejny pion atakuje gońca i zamyka mu drogę powrotną.',
      'Goniec wchodzi na e4.', 'Pion f3 odbiera gońcowi e4.', 'Goniec bierze pionka, ale nie może się uratować.',
      'Hetman odbija. Białe zyskały gońca za pionka.',
    ]),
  line('caro', 'B15', 'Tartakower — zdwojone piony i aktywny goniec',
    'Po …exf6 czarne przyjmują zdwojone piony i otwierają drogę gońcowi f8.',
    'Pion f6 kontroluje e5. Porównaj szybkość rozwoju czarnych z długoterminową słabością zdwojonych pionów.',
    'Nc3 dxe4 Nxe4 Nf6 Nxf6+ exf6 c3 Bd6 Bd3 O-O', [
      'Białe bronią e4.', 'Czarne wymieniają pionka d.', 'Skoczek odbija.', 'Czarne atakują skoczka e4.',
      'Białe wymieniają skoczki z szachem.', 'Pion e bierze na f6 i otwiera przekątną gońca.',
      'Białe podpierają d4.', 'Goniec rozwija się i patrzy na h2.',
      'Białe rozwijają gońca w stronę h7.', 'Czarne zabezpieczają króla.',
    ]),
  line('caro', 'B12', 'Wariant Tala — obrona gońca przez 4…h5',
    'Czarne hamują g4. Po 5.Bd3 mogą wymienić gońca, zanim białe zaczną go ścigać pionami.',
    'Porównaj z ustawieniem po …e6. Pion h5 kontroluje g4, ale osłabia też część osłony czarnego króla.',
    'e5 Bf5 h4 h5 Bd3 Bxd3 Qxd3 e6', [
      'Białe zyskują przestrzeń.', 'Goniec wychodzi przed łańcuch pionów.', 'Białe szykują atak pionami.',
      'Czarne kontrolują g4 i dają gońcowi możliwość odwrotu na g6 bez ataku h5.',
      'Białe proponują wymianę gońców.', 'Czarne wymieniają gońca i kończą pościg.',
      'Hetman odbija i broni d4.', 'Czarne wzmacniają d5.',
    ]),
];

export const spanishExtra = [
  line('spanish', 'C71', 'Pułapka Arki Noego — goniec w potrzasku',
    'Czarne zyskują tempa na hetmanie i zamykają gońca b3 pionami a6, b5 i c4.',
    'Zanim odbijesz hetmanem na d4, policz …c5 i sprawdź drogę odwrotu gońca. Po 4…d6 można wcześniej wybrać 5.O-O.',
    'a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Qxd4 c5 Qd5 Be6 Qc6+ Bd7 Qd5 c4', [
      'Pion atakuje gońca.', 'Goniec zachowuje nacisk na c6.', 'Czarne podpierają e5.',
      'Białe otwierają centrum przed roszadą.', 'Czarne odpychają gońca.', 'Goniec cofa się na b3.',
      'Czarne zabierają pionka d4.', 'Białe wymieniają skoczki.', 'Czarne odbijają pionkiem e.',
      'Hetman odzyskuje pionka, ale wchodzi w zasięg …c5.', 'Pion atakuje hetmana i szykuje …c4.',
      'Hetman naciska na a8.', 'Goniec rozwija się z atakiem na hetmana.', 'Białe dają szacha.',
      'Goniec zasłania szacha.', 'Hetman wraca na d5.', 'Pion atakuje gońca b3 i odbiera mu pole c4.',
    ]),
  line('spanish', 'C72', 'Przeciw Arce Noego — najpierw 5.O-O',
    'Białe zabezpieczają króla i zachowują możliwość przygotowania d4 po c3.',
    'Po …b5 goniec cofa się na b3. Ruch c3 otwiera mu drogę odwrotu na c2.',
    'a6 Ba4 d6 O-O b5 Bb3 Nf6 c3', [
      'Czarne atakują gońca.', 'Goniec pozostaje na przekątnej do c6.', 'Czarne bronią e5.',
      'Białe najpierw zabezpieczają króla.', 'Czarne zdobywają przestrzeń.', 'Goniec wycofuje się na b3.',
      'Skoczek atakuje e4.', 'Białe szykują d4 i zwalniają c2 dla gońca.',
    ]),
  line('spanish', 'C65', 'Pułapka Mortimera — …c6 po biciu na e5',
    'Po 4…Ne7 pion e5 wygląda na wolny. Bicie pozwala czarnym atakować gońca z tempem.',
    'Zamiast 5.Nxe5 można zagrać 5.O-O. Przed biciem sprawdź, co …c6 zrobi z gońcem b5.',
    'Nf6 d3 Ne7 Nxe5 c6', [
      'Czarne atakują e4.', 'Białe podpierają pionka.', 'Skoczek opuszcza c6 i odsłania przynętę na e5.',
      'Białe zabierają pionka.', 'Czarne atakują gońca b5, a po jego odwrocie mogą rozważyć …Qa5+ z atakiem na skoczka e5.',
    ]),
  line('spanish', 'C88', 'Anty-Marshall — 8.a4 przed c3',
    'Białe od razu podważają pionka b5 i wybierają inną pozycję niż klasyczny Marshall.',
    'Porównaj 8.a4 z 8.c3 d5. Ruch a4 stawia czarnym pytanie o b5, choć nie wyklucza każdego przyszłego …d5.',
    'a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O a4', [
      'Czarne atakują gońca.', 'Białe zachowują nacisk na c6.', 'Skoczek atakuje e4.', 'Białe robią roszadę.',
      'Czarne przygotowują roszadę.', 'Wieża broni e4.', 'Czarne odpychają gońca.',
      'Goniec kieruje się na f7.', 'Czarne zabezpieczają króla.', 'Białe atakują podstawę skrzydła hetmańskiego.',
    ]),
  line('spanish', 'C65', 'Przeciw pułapce Mortimera — 5.O-O',
    'Białe zabezpieczają króla, zachowując obronę pionka e4.',
    'Po …c6 goniec może odejść na a4. Białe nie mają wysuniętego skoczka e5, którego mógłby zaatakować hetman.',
    'Nf6 d3 Ne7 O-O c6 Ba4', [
      'Czarne atakują e4.', 'Pion d3 broni e4.', 'Skoczek odchodzi z c6 i zostawia pionka e5.',
      'Białe wybierają roszadę.', 'Czarne atakują gońca.', 'Goniec odchodzi i nadal kontroluje przekątną a4–e8.',
    ]),
];

const morra = 'd4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Qc7 Qe2 Nf6 O-O Ng4';
const morraNotes = [
  'Białe otwierają centrum.', 'Czarne wymieniają pionka c za pionka d.', 'Białe oferują pionka c za tempo rozwoju.',
  'Czarne przyjmują gambit.', 'Białe odzyskują pionka na c3 i rozwijają skoczka.', 'Czarne rozwijają skoczka i kontrolują d4.',
  'Białe rozwijają skoczka pod roszadę.', 'Czarne otwierają drogę gońcowi z f8.', 'Goniec naciska na f7.',
  'Hetman patrzy na h2 po przekątnej c7–d6–e5–f4–g3–h2.', 'Białe łączą figury w centrum.',
  'Czarne rozwijają skoczka.', 'Białe zabezpieczają króla.', 'Skoczek z g4 wspiera atak hetmana na h2.',
];

export const sicilianExtra = [
  line('sicilian', 'B21', 'Pułapka syberyjska — 9.h3 i mat na h2',
    'W gambicie Smitha–Morry po 9.h3 skok …Nd4 atakuje hetmana i przeciąża skoczka f3.',
    'Sprawdź, skąd czarny hetman atakuje h2. Po 8…Ng4 można od razu zaatakować go ruchem 9.Nb5.',
    morra + ' h3 Nd4 Nxd4 Qh2#', [...morraNotes,
      'Białe atakują skoczka, ale przeoczają groźbę na h2.', 'Skoczek d4 atakuje hetmana e2 i grozi zbiciem na f3 z szachem.',
      'Skoczek z f3 zbija na d4, odsłaniając h2.', 'Hetman matuje na h2. Skoczek g4 broni pola wejścia.',
    ]),
  line('sicilian', 'B21', 'Przeciw pułapce syberyjskiej — 9.Nb5',
    'Skoczek atakuje hetmana na c7 i zmusza czarne do decyzji.',
    'Po …Qb8 nadal kontroluj przekątną do h2. Obrona z tempem daje szansę na rozwój zamiast gonienia skoczka pionkiem h.',
    morra + ' Nb5 Qb8', [...morraNotes,
      'Skoczek atakuje hetmana na c7.', 'Hetman cofa się. Nadal patrzy w stronę h2, więc białe muszą pilnować tej przekątnej.',
    ]),
  line('sicilian', 'B97', 'Najdorf — zatruty pionek b2',
    'Czarne biorą pionka na b2, a białe atakują hetmana wieżą i zyskują czas.',
    'Dla białych 8.Qd2 pozwala wejść w tę linię. Dla czarnych …Qxb2 wymaga policzenia Rb1 i drogi odwrotu.',
    'Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Qb6 Qd2 Qxb2 Rb1 Qa3', [
      'Białe szykują d4.', 'Czarne kontrolują e5.', 'Białe otwierają centrum.', 'Czarne wymieniają pionka c.',
      'Skoczek zajmuje d4.', 'Czarne atakują e4.', 'Białe bronią e4.', 'Czarne kontrolują b5.',
      'Goniec zwiększa nacisk na skoczka f6.', 'Czarne wzmacniają kontrolę d5.', 'Białe przygotowują nacisk na e5.',
      'Hetman naciska na b2 i d4.', 'Białe rozwijają hetmana i zostawiają b2 do wzięcia.',
      'Czarne zdobywają pionka, ale hetman oddala się od króla.', 'Wieża atakuje hetmana z tempem.',
      'Hetman ucieka na a3. Białe mogą wykorzystać czas na rozwój i otwarcie linii.',
    ]),
  line('sicilian', 'B33', 'Swiesznikow — pole d5 za aktywność',
    'Czarne grają …e5 z atakiem na skoczka, ale oddają białym pole d5.',
    'Słabe pole ma znaczenie, jeśli można je zająć. Czarne zdobywają tempa i szukają aktywnej gry na skrzydle hetmańskim.',
    'Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5', [
      'Białe szykują d4.', 'Czarne rozwijają skoczka.', 'Białe otwierają centrum.', 'Czarne wymieniają pionka c.',
      'Białe odbijają skoczkiem.', 'Czarne atakują e4.', 'Skoczek broni e4.',
      'Czarne atakują skoczka d4, zostawiając pole d5.', 'Skoczek z d4 idzie na b5 i naciska na d6.',
      'Czarne stabilizują e5.', 'Goniec wiąże skoczka f6 do hetmana.', 'Pion atakuje skoczka b5.',
      'Skoczek wycofuje się na a3.', 'Czarne zyskują przestrzeń i mogą rozważyć …b4.',
    ]),
  line('sicilian', 'B77', 'Smok — atak jugosłowiański i przeciwne roszady',
    'Białe robią długą roszadę i mogą szykować h4, a czarne zyskują cele na linii c.',
    'Policz tempo obu ataków. Sprawdź, kto pierwszy może otworzyć linię do króla lub przeprowadzić przełom …d5.',
    'Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O', [
      'Białe przygotowują d4.', 'Czarne kontrolują e5.', 'Białe otwierają centrum.', 'Czarne wymieniają pionka c.',
      'Białe odbijają skoczkiem.', 'Czarne naciskają na e4.', 'Skoczek broni e4.',
      'Czarne przygotowują rozwój gońca na g7.', 'Goniec przygotowuje długą roszadę.',
      'Goniec zajmuje długą przekątną.', 'Białe wzmacniają e4 i kontrolują g4.',
      'Czarny król chowa się na g8.', 'Białe zwalniają d1 i szykują długą roszadę.',
      'Czarne zwiększają nacisk na d4.', 'Goniec naciska na f7 i kontroluje d5.',
      'Czarne rozwijają gońca i zwalniają c8 dla wieży.', 'Biały król staje na c1. Obie strony mogą otwierać linie na przeciwnych skrzydłach.',
    ]),
];
