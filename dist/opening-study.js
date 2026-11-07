export const openingStudy = {
  caro: {
    structures: [
      ['Zamknięte centrum po 3.e5', 'Białe mają przestrzeń, ale d4 jest podstawą ich łańcucha. Czarne mogą uderzyć …c5, by zmusić białe do obrony lub wymiany. Białe wybierają między spokojnym Nf3 i Be2 a ekspansją h4 lub g4. Przed ruchem pionkiem skrzydłowym sprawdź, gdzie schowa się twój król.'],
      ['Wariant wymienny i atak Panowa', 'Po exd5 cxd5 czarne mają półotwartą linię c, a białe półotwartą linię e. Po Bd3 można spokojnie rozwijać figury i patrzeć na h7. Po c4 i wymianach biały pion d4 może zostać izolowany. Białym daje pola c5 i e5 oraz możliwość d5. Czarne mogą blokować go na d5 i wymieniać aktywne figury.'],
      ['Wariant klasyczny i Tartakower', 'W klasycznym ustawieniu …Bf5 warto wyprowadzić gońca przed …e6. W Tartakowerze po …exf6 czarne mają zdwojone piony, lecz uwalniają gońca f8. Pion f6 kontroluje e5, a po …Bd6 i roszadzie czarne mają konkretne cele na skrzydle królewskim.'],
    ],
    traps: [
      ['Mat na d6 w wariancie Karpowa', 'Po 4…Nd7 5.Qe2 pion e7 jest związany. 5…Ngf6 pozwala na 6.Nd6#.', 'Po 5…e6 goniec f8 uzyskuje dostęp do d6 i może zbić skoczka po szachu.', [[7, 'Zobacz mata'], [8, 'Sprawdź obronę …e6']]],
      ['Goniec f5 w wariancie Tala', 'Po 4.h4 e6 ruchy g4 i h5 mogą zapędzić gońca na e4. Pion f3 wypycha go również z tego pola.', 'Rozważ 4…h5. Pion h5 kontroluje g4. Zanim zagrasz …e6, policz, gdzie goniec ucieknie po g4 i h5.', [[9, 'Prześledź pościg za gońcem'], [11, 'Sprawdź obronę …h5']]],
    ],
    questions: [
      ['Po 3.e5 Bf5 4.Nf3 e6 które pole czarne powinny podważyć, żeby naruszyć cały łańcuch?', 'Pole d4. Po przygotowanym …c5 czarne atakują podstawę łańcucha. Pion e5 może stracić oparcie, jeśli dojdzie do wymian na d4.'],
      ['W Panowie białe mają izolowanego pionka d4. Kiedy warto wymieniać figury?', 'Czarne chętnie wymieniają aktywne figury białych, jeśli zachowują blokadę d5. Białe zwykle potrzebują aktywnych figur, żeby zagrozić przełomem d5 lub wykorzystać pola c5 i e5.'],
    ],
    practice: 'Przejdź wariant zaawansowany i Panowa po obu stronach. W pierwszym wskaż podstawę łańcucha pionów, w drugim znajdź pole blokady. Następnie odtwórz oba przykłady wariantu Karpowa i sprawdź, jak jeden ruch pionem zmienia dostęp gońca do d6.',
    sources: [
      ['Lichess — klasyfikacja ECO i zapisy wariantów', 'https://github.com/lichess-org/chess-openings/blob/master/b.tsv'],
      ['Chess.com — Caro-Kann, warianty i partie mistrzowskie', 'https://www.chess.com/openings/Caro-Kann-Defense'],
    ],
  },
  spanish: {
    structures: [
      ['Zamknięta hiszpańska i przygotowanie d4', 'W typowym ustawieniu białe grają Re1, c3 i d4. Goniec z b3 może wrócić na c2, gdy c3 zwolni pole odwrotu. Skoczek z b1 może przejść przez d2 i f1 na g3. Czarne po …d6 chronią e5 i szukają …d5 lub …c5, zależnie od ustawienia figur.'],
      ['Wariant wymienny i większości pionowe', 'Po Bxc6 dxc6 czarne mają parę gońców oraz zdwojone piony c. Białe mogą dążyć do końcówki, w której po wymianie pionów d i e ich większość na skrzydle królewskim łatwiej utworzy wolnego pionka. Czarne chcą otwierać pozycję dla gońców i wykorzystywać półotwartą linię d.'],
      ['Berlin, otwarta hiszpańska i Marshall', 'W berlińskiej końcówce po wymianie hetmanów czarny król traci roszadę, ale zagrożenie matem maleje, a para gońców zyskuje znaczenie. W otwartej hiszpańskiej …Nxe4 jest częścią walki o centrum. W Marshallu czarne oddają pionka po …d5, by rozwinąć figury z tempem i skierować je na króla.'],
    ],
    traps: [
      ['Arka Noego i goniec b3', 'Po wczesnym d4 i odbiciu Qxd4 czarne mogą zagrać …c5 z tempem. W pokazanej linii …c4 domyka pułapkę.', 'Po 4…d6 można wcześniej zrobić 5.O-O, a po odwrocie gońca na b3 przygotować c3 i pole c2.', [[8, 'Zobacz pułapkę'], [9, 'Sprawdź ustawienie z roszadą']]],
      ['Mortimer i pozornie darmowy pion e5', 'Po 4…Ne7 5.Nxe5 c6 czarne atakują gońca, a w części wariantów mogą zagrać …Qa5+ z podwójnym atakiem.', 'Zamiast brać pionka możesz zrobić 5.O-O. Przed biciem sprawdź odpowiedź …c6 i możliwe szachy hetmana.', [[10, 'Sprawdź motyw …c6'], [12, 'Zobacz obronę 5.O-O']]],
      ['Jak ominąć klasyczny atak Marshalla', 'Po 7…O-O ruch 8.c3 daje czarnym możliwość 8…d5. Przyjęcie ofiary wymaga obrony przed aktywnymi figurami.', 'Jeśli wolisz inną strukturę, wybierz 8.a4 i od razu zaatakuj b5. Późniejsze …d5 wciąż jest możliwe.', [[11, 'Zobacz Anty-Marshalla']]],
    ],
    questions: [
      ['Po wymianie na c6 pion e5 wygląda na niebroniony. Co grozi po Nxe5?', 'W pokazanej pozycji …Qd4 atakuje skoczka e5 i pionka e4. Sprawdź obie groźby przed wzięciem pionka.'],
      ['Po …a6 i …b5 twój goniec stoi na b3. Który ruch pionem daje mu dodatkowe pole odwrotu?', 'c3 zwalnia c2. Przy okazji wspiera przyszłe d4. Zawsze sprawdź, czy masz czas na c3 przed wejściem czarnego pionka na c4.'],
    ],
    practice: 'Porównaj wariant wymienny z zamkniętym. W pierwszym wskaż większości pionowe i zaplanuj wymianę figur. W drugim wybierz moment d4. Potem odtwórz Marshalla i Anty-Marshalla, zatrzymując się przed ósmym ruchem białych.',
    sources: [
      ['Lichess — klasyfikacja ECO i zapisy wariantów', 'https://github.com/lichess-org/chess-openings/blob/master/c.tsv'],
      ['Chess.com — zapis pułapki Arki Noego', 'https://www.chess.com/openings/Ruy-Lopez-Opening-Morphy-Defense-Modern-Steinitz-Noahs-Ark-Trap'],
      ['Chess.com — atak Marshalla', 'https://www.chess.com/openings/Ruy-Lopez-Opening-Marshall-Attack'],
    ],
  },
  sicilian: {
    structures: [
      ['Otwarta sycylijska i nierówne linie', 'Po d4 cxd4 i odbiciu skoczkiem czarne mają półotwartą linię c, a białe półotwartą linię d. Białe mogą naciskać na d6 i używać d5 jako pola dla figur. Czarne często celują w c2 i przygotowują …d5. Przed przełomem policz, kto odbije na d5 i które figury zyskają linie.'],
      ['Najdorf i Swiesznikow', 'Najdorfowe …a6 kontroluje b5 i przygotowuje …b5. W układach z …e5 czarne zyskują tempo na skoczku, ale d5 przestaje być bronione przez piony c i e. W Swiesznikowie czarne od razu przyjmują ten kompromis i szukają aktywności. Przy ustawieniu …e6 i …d6 czarne zwykle dłużej zachowują możliwość …d5.'],
      ['Smok, przyspieszony Smok i układ Maroczego', 'Goniec g7 działa po długiej przekątnej i może wspierać nacisk na skrzydle hetmańskim. Przy przeciwnych roszadach porównaj tempo ataków oraz możliwość otwarcia centrum. W przyspieszonym Smoku czarne mogą zagrać …d5 w jednym ruchu. Białe mogą ograniczyć ten przełom pionami c4 i e4, tworząc układ Maroczego.'],
    ],
    traps: [
      ['Pułapka syberyjska w gambicie Smitha–Morry', 'Po …Qc7 i …Ng4 pion h2 jest celem. 9.h3 Nd4 atakuje hetmana e2, a po 10.Nxd4 następuje …Qh2#.', '9.Nb5 atakuje hetmana na c7 z tempem. Po …Qb8 nadal pilnuj przekątnej do h2.', [[13, 'Zobacz mata na h2'], [14, 'Sprawdź odpowiedź 9.Nb5']]],
      ['Zatruty pionek b2 w Najdorfie', 'Po …Qb6 i …Qxb2 białe atakują hetmana przez Rb1. Zdobyty pionek kosztuje czarne czas, który białe mogą wykorzystać na rozwój.', 'Przed …Qxb2 policz Rb1 i drogę odwrotu. W tej linii hetman może zejść na a3. To obustronnie ostry wariant, więc samo bicie nie rozstrzyga partii.', [[15, 'Sprawdź wędrówkę hetmana']]],
    ],
    questions: [
      ['Po …Nf6 w otwartej sycylijskiej e4 jest atakowane. Jak obronić je ruchem rozwijającym?', 'Nc3 broni e4 i zwiększa kontrolę d5. Przy okazji rozwija figurę, zamiast poświęcać tempo na samą obronę pionka.'],
      ['Po …e5 w Swiesznikowie czarne oddają białym pole d5. Co dostają w zamian?', 'Atakują skoczka d4 z tempem i mogą zdobywać przestrzeń przez …a6 i …b5. Przewaga białych na d5 liczy się dopiero wtedy, gdy mogą bezpiecznie ustawić tam figurę.'],
    ],
    practice: 'Zacznij od otwartej sycylijskiej i Alapina. W każdej pozycji wskaż, czym białe odbijają na d4. Potem przejdź Smoka i Swiesznikowa, a w pułapce syberyjskiej zatrzymaj się po …Ng4 i samodzielnie znajdź obronę z tempem.',
    sources: [
      ['Lichess — klasyfikacja ECO, Smith–Morra i inne warianty', 'https://github.com/lichess-org/chess-openings/blob/master/b.tsv'],
      ['Chess.com — zapis wariantu zatrutego pionka w Najdorfie', 'https://www.chess.com/openings/Sicilian-Defense-Open-Najdorf-Poisoned-Pawn-Variation'],
    ],
  },
};
