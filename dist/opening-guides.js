export const openingGuides = {
  italian: {
    idea: 'Po 1.e4 e5 2.Nf3 Nc6 3.Bc4 białe szybko rozwijają figury. Goniec na c4 patrzy na f7, którego na początku broni tylko król. Prawdziwa walka toczy się jednak o centrum, zwłaszcza o pole d4.',
    white: 'W spokojnej grze d3 zabezpiecza e4, c3 przygotowuje d4, a krótka roszada pozwala bezpiecznie włączyć wieżę do gry. Jeśli centrum pozostaje zamknięte, skoczek może przejść z b1 przez d2 i f1 na g3.',
    black: 'Po ...Bc5 czarne naciskają na f2 i mogą dokończyć rozwój przez ...Nf6, ...d6 i roszadę. Przy odpowiednim przygotowaniu ...d5 wyzwala centrum. Po bezpośrednim ...Nf6 czarne od razu atakują e4.',
    branches: 'Pianissimo pokazuje, jak przygotować d4 bez pośpiechu. W Obronie Dwóch Skoczków ruch Ng5 zmienia grę w taktyczną walkę o f7. Gambit Evansa oddaje pionka b, by uzyskać tempo na gońcu i zbudować centrum.',
    warning: 'Sam nacisk na f7 nie wystarcza do ataku. Przed Ng5 sprawdź, czy czarne mogą odpowiedzieć ...d5, atakując centrum i gońca na c4.',
    takeaway: 'Po 3.Bc4 zobacz, jak czarne rozwijają kolejną figurę. Po ...Bc5 możesz porównać spokojne d3 z aktywnym c3 i d4. Po ...Nf6 najpierw zauważ groźbę zbicia na e4.',
  },
  caro: {
    idea: 'Po 1.e4 c6 czarne przygotowują ...d5. Pion c6 podpiera d5, a goniec z c8 może wyjść przed zagraniem ...e6.',
    white: 'Po e5 białe zdobywają przestrzeń i ograniczają skoczka g8. W wariancie klasycznym bronią e4 przez Nc3 lub Nd2. Po wymianie na d5 ruch c4 w ataku Panowa stawia czarnym inne zadanie, walkę o otwarte linie i izolowanego pionka.',
    black: 'W zamkniętym centrum szukaj przełamania ...c5 u podstawy łańcucha pionów. Gdy goniec wyjdzie na f5, pilnuj, czy białe mogą zyskać na nim tempo przez g4 lub h4.',
    branches: 'Porównaj wariant z e5, gdzie centrum jest zamknięte, z wymiennym, gdzie struktura szybko staje się symetryczna. Panow zmienia ją przez szybkie c4.',
    warning: 'W wariancie z e5 automatyczne ...e6 może zamknąć własnego gońca na c8. Najpierw sprawdź, czy może rozwinąć się na f5 lub g4.',
    takeaway: 'Po ...d5 spójrz na białego pionka e4. Ruch e5 zamyka centrum, exd5 prowadzi do wymiany, a Nc3 lub Nd2 pozwala na razie utrzymać napięcie.',
  },
  spanish: {
    idea: 'Po 1.e4 e5 2.Nf3 Nc6 3.Bb5 białe wywierają nacisk na skoczka c6, który broni pionka e5. Ten nacisk pomaga białym walczyć o centrum podczas rozwoju.',
    white: 'W głównych zamkniętych liniach po roszadzie wieża na e1 broni e4. Ruch c3 przygotowuje d4, a goniec często wycofuje się przez a4 i b3, zachowując przekątną w stronę f7.',
    black: 'Ruchy ...a6 i ...b5 zdobywają przestrzeń i odpychają gońca. ...Nf6 atakuje e4. W strukturze zamkniętej ...d6 zabezpiecza e5, a dobrze przygotowane ...d5 może otworzyć centrum.',
    branches: 'W wariancie wymiennym Bxc6 zmienia strukturę pionów czarnych. Obrona berlińska przez ...Nf6 od razu atakuje e4. W zamkniętej hiszpańskiej obie strony dłużej manewrują przed otwarciem centrum.',
    warning: 'Po Bxc6 dxc6 pion e5 może wyglądać na wolny. Po Nxe5 czarne mogą zagrać ...Qd4, atakując skoczka i pionka e4.',
    takeaway: 'Porównaj pozycje po Bxc6 i Ba4. W pierwszej białe zmieniają strukturę pionów czarnych. W drugiej zachowują gońca i mogą dalej przygotowywać roszadę oraz d4.',
  },
  sicilian: {
    idea: 'Po 1.e4 c5 czarne walczą o d4 pionem z flanki. Jeśli białe zagrają d4 i nastąpi ...cxd4, czarne wymieniają pionka z linii c za centralnego pionka d. Obie strony dostają różne możliwości ataku.',
    white: 'W otwartej sycylijskiej Nf3 i d4 przyspieszają rozwój. Przy przeciwnych roszadach białe często atakują skrzydło królewskie, ale najpierw warto sprawdzić, czy czarne mogą otworzyć centrum.',
    black: 'Półotwarta linia c daje wieży pole do działania, a dobrze przygotowane ...d5 wyrównuje walkę w centrum. W wielu ustawieniach ...a6 i ...b5 pozwalają zdobyć przestrzeń na skrzydle hetmańskim.',
    branches: 'Najdorf używa ...a6, m.in. by kontrolować b5. W Smoku ...g6 i ...Bg7 kierują gońca na długą przekątną. Alapin z 2.c3 przygotowuje d4 i prowadzi do innej struktury.',
    warning: 'Plany zależą od struktury. Zanim skopiujesz atak pionami z innego wariantu, sprawdź, gdzie stoją króle i czy przeciwnik grozi przełamaniem w centrum.',
    takeaway: 'Po wymianie na d4 znajdź półotwarte linie. Na linii c nie ma już czarnego pionka, więc czarne mogą ustawić tam wieżę. Białe mogą wykorzystać linię d do nacisku na pionka d6, jeśli czarne zagrały ...d6.',
  },
};

const sicilianMoveNotes = {
  e2e4: 'Białe zajmują centrum i otwierają drogę gońcowi z f1.',
  c7c5: 'Czarne kontrolują d4 pionkiem z flanki i tworzą asymetrię w centrum.',
  g1f3: 'Skoczek rozwija się i wspiera d4, skąd może odbić pionka po wymianie.',
  d7d6: 'Pion broni c5, kontroluje e5 i otwiera drogę gońcowi z c8.',
  d2d4: 'Białe podważają pionka c5 i próbują otworzyć centrum dla figur.',
  c5d4: 'Czarne wymieniają pionka c za pionka d. Po odbiciu zyskają półotwartą linię c.',
  f3d4: 'Białe odzyskują pionka i umieszczają skoczka w centrum, skąd kontroluje c6 i f5.',
  g8f6: 'Skoczek rozwija się z atakiem na pionka e4.',
  b1c3: 'Skoczek broni e4, kontroluje d5 i wprowadza do gry kolejną figurę.',
  a7a6: 'Najdorf kontroluje pole b5 i przygotowuje zdobywanie przestrzeni przez ...b5.',
  c1e3: 'Goniec rozwija się, zwalnia c1 pod długą roszadę i może wspierać atak na skrzydle królewskim.',
  e7e5: 'Pion zajmuje centrum i atakuje skoczka d4, ale zostawia białym pole d5.',
  d4b3: 'Skoczek ustępuje spod ataku pionka e5 i zachowuje kontrolę nad c5.',
  c8e6: 'Goniec naciska na skoczka b3 po przekątnej e6–d5–c4–b3.',
  f2f3: 'Pion wzmacnia e4 i przygotowuje g4. Białe zwykle planują długą roszadę.',
  g7g6: 'Czarne przygotowują rozwój gońca na długiej przekątnej z g7.',
  f8g7: 'Goniec zajmuje przekątną w stronę centrum. Jego zasięg wzrośnie, gdy znikną figury zasłaniające przekątną.',
  e8g8: 'Roszada zabezpiecza króla i wprowadza wieżę do gry. Po długiej roszadzie białych powstaną cele na przeciwnych skrzydłach.',
  d1d2: 'Hetman zwalnia d1 pod długą roszadę i wspiera gońca na e3, który może pójść na h6.',
  e7e6: 'Piony d6 i e6 kontrolują e5 i d5. Czarne otwierają drogę gońcowi z f8.',
  b8c6: 'Skoczek rozwija się i zwiększa kontrolę d4 oraz e5.',
  g2g3: 'Białe przygotowują rozwój gońca na g2 oraz krótką roszadę.',
  f1g2: 'Goniec wzmacnia pionka e4 i może działać w centrum, gdy otworzy się długa przekątna.',
  c2c3: 'Białe przygotowują d4. Po ...cxd4 pionek c może odbić i utrzymać pionka w centrum.',
  e4e5: 'Białe zdobywają przestrzeń i atakują skoczka f6, ale muszą potem podeprzeć wysuniętego pionka.',
  f6d5: 'Skoczek ucieka spod ataku i wykorzystuje centralne pole d5.',
  f2f4: 'Pion wspiera e5 i zapowiada atak na skrzydle królewskim, kosztem części osłony własnego króla.',
};

export function sicilianNotes(moves) {
  const specific = moves[2] === 'c2c3' ? {
    d2d4: 'Białe podpierają e5 i wykorzystują pionka c3 do obrony nowego centrum.',
  } : moves[2] === 'b1c3' ? {
    b1c3: 'Białe rozwijają skoczka, bronią e4 i odkładają otwarcie centrum ruchem d4.',
    g1f3: 'Skoczek rozwija się pod krótką roszadę i wspiera pola d4 oraz e5.',
  } : {};
  return moves.map(move => specific[move] || sicilianMoveNotes[move]);
}
