import { italianVariations } from './italian-variations.js';
import { caroExtra, spanishExtra, sicilianExtra } from './opening-extra-lines.js';

export const openingCourses = [
  {
    "id": "italian",
    "title": "Partia włoska",
    "eco": "C50",
    "family": "Italian Game",
    "quiz": [
      {
        "q": "Jaki punkt jest naturalnym celem gońca na c4?",
        "a": [
          "f7",
          "a7",
          "h7"
        ],
        "ok": 0,
        "why": "Pion f7 początkowo broni tylko czarny król."
      },
      {
        "q": "Który ruch najczęściej odpowiada na 4.Ng5 w Obronie Dwóch Skoczków?",
        "a": [
          "4...d5",
          "4...h6",
          "4...a6"
        ],
        "ok": 0,
        "why": "4...d5 kontratakuje centrum i gońca c4."
      },
      {
        "q": "Jaka jest idea 4.b4 w Gambicie Evansa?",
        "a": [
          "Wymiana hetmanów",
          "Tempo na gońcu i silne centrum",
          "Natychmiastowa promocja"
        ],
        "ok": 1,
        "why": "Białe oddają pionka, by zagrać c3 i d4 z tempem."
      },
      {
        "q": "Co oznacza plan Nbd2–f1–g3?",
        "a": [
          "Manewr skoczka w Pianissimo",
          "Wymuszoną ofiarę",
          "Roszadę długą"
        ],
        "ok": 0,
        "why": "Skoczek trafia na g3, skąd wspiera centrum i atak."
      },
      {
        "q": "Co umożliwia ruch c3 w spokojnej partii włoskiej?",
        "a": ["Podpiera przyszłe d4 i zwalnia c2 dla gońca", "Broni bezpośrednio pionka e4", "Umożliwia natychmiastową długą roszadę"],
        "ok": 0,
        "why": "Pion c3 kontroluje d4. Jeśli goniec zostanie zaatakowany na b3, może zachować przekątną, wycofując się na c2."
      },
      {
        "q": "Po 3…Nf6 4.Ng5 d5 5.exd5 który ruch czarnych pozwala uniknąć ataku smażonej wątróbki?",
        "a": ["5…Nxd5", "5…Na5", "5…Ke7"],
        "ok": 1,
        "why": "Skoczek atakuje gońca c4. Klasyczne 6.Nxf7 z atakiem hetmana na d5 powstaje po 5…Nxd5."
      },
      {
        "q": "Co czarne powinny sprawdzić przed zdobyciem kolejnego pionka w przyjętym gambicie Evansa?",
        "a": ["Czy białe mogą otworzyć centrum z tempem", "Czy biały król może zrobić długą roszadę w następnym ruchu", "Czy da się zmienić kolor gońca"],
        "ok": 0,
        "why": "Każdy dodatkowy ruch pionem daje białym czas na rozwój. Otwarcie linii przy królu stojącym na e8 może mieć większe znaczenie niż dodatkowy pionek."
      },
      {
        "q": "Jaka jest groźba czarnych po 3…Nd4 4.Nxe5 Qg5?",
        "a": ["Wyłącznie …Qxe5", "Hetman atakuje skoczka e5 i pionka g2", "Czarne mogą od razu zrobić roszadę"],
        "ok": 1,
        "why": "Hetman na g5 atakuje e5 wzdłuż piątego rzędu, a g2 po linii g. Białe muszą uwzględnić obie groźby."
      }
    ],
    "variants": [
      {
        "title": "Podstawowa pozycja Partii Włoskiej",
        "eco": null,
        "desc": "Trzy pierwsze ruchy pokazują główne idee debiutu.",
        "plan": "Cel: rozumieć nacisk gońca na f7 i rozwój skoczka.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1c4"
        ],
        "notes": [
          "Białe zajmują centrum i otwierają drogę gońcowi oraz hetmanowi.",
          "Czarne odpowiadają symetrycznie i kontrolują d4.",
          "Skoczek rozwija się, atakując pion e5.",
          "Skoczek broni e5 i kontroluje d4.",
          "Goniec celuje w f7 i wspiera szybki rozwój."
        ]
      },
      {
        "title": "Giuoco Pianissimo — spokojny plan",
        "eco": null,
        "desc": "System z d3, c3 i stopniowym przygotowaniem d4. Włoskie „bardzo spokojna gra”.",
        "plan": "Białe: O-O, Re1, Nbd2–f1–g3. Czarne: ...d6, ...O-O i ...a6.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1c4",
          "f8c5",
          "d2d3",
          "g8f6",
          "c2c3",
          "d7d6",
          "e1g1",
          "e8g8",
          "f1e1",
          "a7a6",
          "b1d2",
          "c5a7",
          "d2f1"
        ],
        "notes": [
          "Zajęcie centrum.",
          "Symetryczna odpowiedź.",
          "Atak na e5.",
          "Obrona e5.",
          "Aktywny goniec na c4.",
          "Czarne również rozwijają gońca na aktywną przekątną.",
          "Białe wzmacniają e4 i zachowują elastyczność.",
          "Rozwój z naciskiem na e4.",
          "Przygotowanie d4 oraz pole c2 dla gońca.",
          "Stabilna struktura czarnych.",
          "Król białych staje się bezpieczniejszy.",
          "Czarne kończą podstawowy etap zabezpieczania króla.",
          "Wieża wspiera e4 i potencjalny przełom d4.",
          "Czarne przygotowują miejsce dla gońca.",
          "Skoczek rozpoczyna manewr do f1 i g3.",
          "Goniec zachowuje aktywną przekątną.",
          "Skoczek kieruje się na g3, wzmacniając centrum i skrzydło królewskie."
        ]
      },
      {
        "title": "Giuoco Piano — aktywne d4",
        "eco": null,
        "desc": "Klasyczny plan 4.c3 i 5.d4 otwiera centrum szybciej niż Pianissimo.",
        "plan": "Zwróć uwagę na pionową strukturę po wymianach i aktywność hetmana.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1c4",
          "f8c5",
          "c2c3",
          "g8f6",
          "d2d4",
          "e5d4",
          "c3d4",
          "c5b4",
          "b1c3",
          "f6e4",
          "e1g1"
        ],
        "notes": [
          "Kontrola centrum.",
          "Odpowiedź w centrum.",
          "Rozwój i atak e5.",
          "Obrona e5.",
          "Nacisk na f7.",
          "Aktywny rozwój czarnych.",
          "Przygotowanie d4.",
          "Czarne atakują e4.",
          "Białe przełamują centrum.",
          "Czarne wymieniają piony.",
          "Białe odbijają pionem c, budując centrum.",
          "Szach i związanie skoczka c3 w dalszych pozycjach.",
          "Białe rozwijają skoczka i blokują szacha.",
          "Czarne zdobywają pion e4, ale muszą uważać na inicjatywę białych.",
          "Roszada chroni króla i aktywizuje wieżę."
        ]
      },
      {
        "title": "Obrona Dwóch Skoczków — 4.Ng5",
        "eco": null,
        "desc": "Ostra linia, w której białe natychmiast grożą uderzeniem na f7.",
        "plan": "Czarne kontratakują w centrum ruchem ...d5, a następnie ...Na5.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1c4",
          "g8f6",
          "f3g5",
          "d7d5",
          "e4d5",
          "c6a5",
          "c4b5",
          "c7c6",
          "d5c6",
          "b7c6",
          "b5e2",
          "h7h6",
          "g5f3"
        ],
        "notes": [
          "Kontrola centrum.",
          "Czarne zajmują centrum.",
          "Rozwój skoczka.",
          "Obrona e5.",
          "Goniec naciska na f7.",
          "Obrona Dwóch Skoczków: czarne atakują e4.",
          "Skoczek i goniec atakują f7; to konkretna groźba.",
          "Kluczowa odpowiedź: kontratak w centrum.",
          "Białe biją pionka d5.",
          "Czarne atakują gońca, zyskując tempo.",
          "Goniec odchodzi, utrzymując aktywność.",
          "Czarne wspierają centrum i przygotowują odzyskanie pionka.",
          "Białe zdobywają pionka c6.",
          "Czarne odbijają, otwierając linię b.",
          "Goniec wraca na bezpieczne pole.",
          "Czarne pytają skoczka o zamiary.",
          "Skoczek wraca, a pozycja przechodzi do gry środkowej."
        ]
      },
      {
        "title": "Gambit Evansa — 4.b4",
        "eco": null,
        "desc": "Białe poświęcają pionka skrzydłowego, aby zyskać tempa na rozwój i centrum.",
        "plan": "Idea: ...Bxb4, c3, d4, szybka roszada i aktywne figury.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1c4",
          "f8c5",
          "b2b4",
          "c5b4",
          "c2c3",
          "b4a5",
          "d2d4",
          "e5d4",
          "e1g1",
          "d4c3",
          "d1b3"
        ],
        "notes": [
          "Białe zajmują centrum.",
          "Czarne odpowiadają w centrum.",
          "Rozwój skoczka.",
          "Obrona pionka e5.",
          "Aktywny goniec.",
          "Symetryczny rozwój.",
          "Gambit Evansa: pionek za tempo.",
          "Czarne przyjmują gambit.",
          "Białe atakują gońca i przygotowują d4.",
          "Goniec cofa się, tracąc kolejne tempo.",
          "Białe budują silne centrum.",
          "Czarne wymieniają piony.",
          "Białe zabezpieczają króla, utrzymując inicjatywę.",
          "Czarne zdobywają kolejnego pionka.",
          "Hetman naciska na f7 i b7; rekompensata ma charakter dynamiczny."
        ]
      },
      ...italianVariations
    ]
  },
  {
    "id": "caro",
    "title": "Obrona Caro-Kann",
    "eco": "B10",
    "family": "Caro-Kann Defense",
    "quiz": [
      {
        "q": "Jaki jest główny cel ruchu 1...c6?",
        "a": [
          "Przygotować ...d5",
          "Od razu zaatakować króla",
          "Zagrać ...c5 w następnym ruchu"
        ],
        "ok": 0,
        "why": "Pion c6 wspiera centralne ...d5."
      },
      {
        "q": "Dlaczego czarne często grają ...Bf5 przed ...e6?",
        "a": [
          "Aby oddać gońca",
          "Aby rozwinąć gońca poza łańcuch pionów",
          "Aby zrobić długą roszadę"
        ],
        "ok": 1,
        "why": "...e6 ograniczyłoby przekątną gońca c8."
      },
      {
        "q": "Jaki przełom jest typowy przeciwko 3.e5?",
        "a": [
          "...c5",
          "...a5",
          "...h5"
        ],
        "ok": 0,
        "why": "...c5 podważa pionka d4, podstawę centrum białych."
      },
      {
        "q": "Co charakteryzuje atak Panowa?",
        "a": [
          "4.c4 i presja na d5",
          "4.Qh5",
          "Wymuszona wymiana hetmanów"
        ],
        "ok": 0,
        "why": "Ruch c4 zwiększa napięcie w centrum i może prowadzić do izolowanego pionka d."
      },
      {
        "q": "Co oznacza 3.f3?",
        "a": [
          "Wariant fantasy",
          "Wariant wymienny",
          "Wariant zaawansowany"
        ],
        "ok": 0,
        "why": "Wariant fantasy wspiera e4 pionem f, kosztem osłabienia króla."
      }
    ],
    "variants": [
      {
        "title": "Podstawowa pozycja Caro-Kann",
        "eco": null,
        "desc": "Zobacz, jak ...c6 przygotowuje ...d5 i kwestionuje centrum.",
        "plan": "Czarne: ...d5 i rozwój figur. Białe: wybór struktury po drugim ruchu.",
        "moves": [
          "e2e4",
          "c7c6",
          "d2d4",
          "d7d5"
        ],
        "notes": [
          "Białe zajmują centrum i otwierają linie figur.",
          "Czarne przygotowują ...d5, wzmacniając pole d5 pionem c6.",
          "Białe tworzą silny duet pionów e4 i d4.",
          "Czarne atakują centrum. Teraz białe wybierają m.in. 3.Nc3, 3.e5, 3.exd5 lub 3.f3."
        ]
      },
      {
        "title": "Wariant klasyczny — 3.Nc3 dxe4",
        "eco": null,
        "desc": "Typowa pozycja po 4.Nxe4 Bf5: czarne wyprowadzają gońca przed ...e6.",
        "plan": "Czarne: ...Bf5, ...e6, ...Nd7, ...Ngf6 i ...c5. Białe: Ng3, h4–h5 i aktywny rozwój.",
        "moves": [
          "e2e4",
          "c7c6",
          "d2d4",
          "d7d5",
          "b1c3",
          "d5e4",
          "c3e4",
          "c8f5",
          "e4g3",
          "f5g6",
          "h2h4",
          "h7h6",
          "g1f3",
          "b8d7",
          "h4h5",
          "g6h7",
          "f1d3",
          "h7d3",
          "d1d3"
        ],
        "notes": [
          "Zajęcie centrum.",
          "Przygotowanie ...d5.",
          "Wzmocnienie centrum.",
          "Czarne uderzają w e4.",
          "Skoczek broni e4 i zwiększa nacisk na d5.",
          "Czarne upraszczają centrum, wymieniając pionka.",
          "Białe odbijają skoczkiem i rozwijają figurę.",
          "Kluczowy ruch: goniec wychodzi przed ...e6.",
          "Skoczek atakuje gońca i kontroluje e4.",
          "Goniec zachowuje aktywną przekątną.",
          "Białe zdobywają przestrzeń na skrzydle królewskim.",
          "Czarne tworzą pole h7 dla gońca, ale osłabiają nieco ciemne pola.",
          "Rozwój i przygotowanie roszady.",
          "Skoczek rozwija się elastycznie, wspierając ...e5 lub ...c5.",
          "Białe atakują gońca g6 pionem.",
          "Goniec wycofuje się na h7.",
          "Białe rozwijają gońca z atakiem na h7.",
          "Czarne wymieniają aktywnego gońca.",
          "Hetman odbija i wspiera dalszy rozwój."
        ]
      },
      {
        "title": "Wariant zaawansowany — 3.e5",
        "eco": null,
        "desc": "Białe zdobywają przestrzeń; czarne podważają łańcuch pionów.",
        "plan": "Czarne: ...Bf5, ...e6 i ...c5. Białe: Nf3, Be2, O-O i c3.",
        "moves": [
          "e2e4",
          "c7c6",
          "d2d4",
          "d7d5",
          "e4e5",
          "c8f5",
          "g1f3",
          "e7e6",
          "f1e2",
          "c6c5",
          "e1g1",
          "b8c6",
          "c2c3"
        ],
        "notes": [
          "Centrum białych.",
          "Przygotowanie ...d5.",
          "Wzmocnienie centrum.",
          "Czarne kwestionują centrum.",
          "Białe zdobywają przestrzeń, ale zamykają centrum.",
          "Goniec wychodzi poza łańcuch pionów.",
          "Rozwój skoczka i wsparcie d4.",
          "Czarne wzmacniają d5 i otwierają drogę gońcowi f8.",
          "Białe przygotowują roszadę.",
          "Kluczowy przełom: czarne atakują pionka d4.",
          "Białe zabezpieczają króla.",
          "Skoczek zwiększa presję na d4 i e5.",
          "Białe wzmacniają centrum i przygotowują dalszy rozwój."
        ]
      },
      {
        "title": "Wariant wymienny — 3.exd5",
        "eco": null,
        "desc": "Symetryczna struktura nie oznacza automatycznego remisu.",
        "plan": "Obie strony: aktywny rozwój, walka o linię c i pola centralne.",
        "moves": [
          "e2e4",
          "c7c6",
          "d2d4",
          "d7d5",
          "e4d5",
          "c6d5",
          "f1d3",
          "b8c6",
          "c2c3",
          "g8f6",
          "c1f4",
          "c8g4"
        ],
        "notes": [
          "Zajęcie centrum.",
          "Czarne przygotowują ...d5.",
          "Białe tworzą duet pionów.",
          "Czarne kontratakują w centrum.",
          "Białe upraszczają strukturę.",
          "Czarne odbijają pionem c; powstaje symetryczny układ pionów.",
          "Białe rozwijają gońca na aktywne pole.",
          "Skoczek naciska na d4 i e5.",
          "Białe wzmacniają d4 i ograniczają skoczka c6.",
          "Czarne rozwijają skoczka i przygotowują roszadę.",
          "Goniec białych rozwija się przed e3.",
          "Czarne aktywnie wyprowadzają gońca i mogą wywierać nacisk na hetmana."
        ]
      },
      {
        "title": "Atak Panowa — 4.c4",
        "eco": null,
        "desc": "Białe tworzą napięcie w centrum; możliwy izolowany pion d.",
        "plan": "Białe: aktywność i inicjatywa. Czarne: blokada izolowanego pionka i wymiany, jeśli powstanie.",
        "moves": [
          "e2e4",
          "c7c6",
          "d2d4",
          "d7d5",
          "e4d5",
          "c6d5",
          "c2c4",
          "g8f6",
          "b1c3",
          "e7e6",
          "g1f3",
          "f8b4"
        ],
        "notes": [
          "Centrum białych.",
          "Czarne przygotowują ...d5.",
          "Białe wzmacniają centrum.",
          "Czarne atakują centrum.",
          "Wymiana pionów w centrum.",
          "Czarne odbijają pionem c.",
          "Atak Panowa: białe natychmiast podważają pionka d5.",
          "Rozwój skoczka i obrona d5.",
          "Białe zwiększają nacisk na d5.",
          "Czarne wzmacniają d5 i otwierają gońca f8.",
          "Białe rozwijają skoczka.",
          "Goniec wiąże skoczka c3 względem króla i zwiększa nacisk na centrum."
        ]
      },
      {
        "title": "Wariant fantasy — 3.f3",
        "eco": null,
        "desc": "Ambitna próba utrzymania szerokiego centrum.",
        "plan": "Białe: aktywność pionów e4 i f3, szybki rozwój. Czarne: ...dxe4 i kontruderzenie ...e5.",
        "moves": [
          "e2e4",
          "c7c6",
          "d2d4",
          "d7d5",
          "f2f3",
          "d5e4",
          "f3e4",
          "e7e5",
          "g1f3",
          "e5d4",
          "f1c4"
        ],
        "notes": [
          "Białe zajmują centrum.",
          "Czarne szykują ...d5.",
          "Wzmocnienie centrum.",
          "Czarne kwestionują centrum.",
          "Białe bronią e4 pionem f, ale osłabiają przekątną do króla.",
          "Czarne wymieniają pionka d na e4.",
          "Białe odbijają pionem f, utrzymując silne centrum.",
          "Czarne kontratakują w centrum ruchem ...e5.",
          "Skoczek rozwija się, atakując e5.",
          "Czarne wymieniają pionka e na d4.",
          "Białe aktywizują gońca i zwiększają nacisk na f7."
        ]
      },
      {
        "title": "System dwóch skoczków — 2.Nc3 i 3.Nf3",
        "eco": null,
        "desc": "Białe opóźniają d4, zachowując elastyczność.",
        "plan": "Czarne: ...d5, ...Bg4 lub ...Nf6. Białe: spokojny rozwój i d4 w dogodnej chwili.",
        "moves": [
          "e2e4",
          "c7c6",
          "b1c3",
          "d7d5",
          "g1f3",
          "c8g4",
          "h2h3",
          "g4f3",
          "d1f3",
          "e7e6",
          "d2d4"
        ],
        "notes": [
          "Białe zajmują centrum.",
          "Czarne szykują ...d5.",
          "Białe rozwijają skoczka, nie deklarując jeszcze struktury centrum.",
          "Czarne atakują pionka e4.",
          "Drugi skoczek rozwija się, a białe zachowują elastyczność.",
          "Goniec wiąże skoczka f3 z hetmanem.",
          "Białe pytają gońca o zamiary.",
          "Czarne wymieniają gońca na skoczka.",
          "Hetman odbija figurę i kontroluje centrum.",
          "Czarne przygotowują rozwój gońca f8.",
          "Białe budują centrum po przygotowaniu figur."
        ]
      },
      ...caroExtra
    ]
  },
  {
    "id": "spanish",
    "title": "Partia hiszpańska",
    "eco": "C60",
    "family": "Ruy Lopez",
    "quiz": [
      {
        "q": "Jakie ruchy rozpoczynają Partię Hiszpańską?",
        "a": [
          "1.e4 e5 2.Nf3 Nc6 3.Bb5",
          "1.e4 e5 2.Nf3 Nc6 3.Bc4",
          "1.d4 d5 2.c4"
        ],
        "ok": 0,
        "why": "Ruy López powstaje po 3.Bb5 — gońcu atakującym skoczka c6."
      },
      {
        "q": "Jaki jest główny sens ruchu 3.Bb5?",
        "a": [
          "Natychmiastowy mat na f7",
          "Nacisk na skoczka c6 broniącego e5",
          "Atak na wieżę a8"
        ],
        "ok": 1,
        "why": "Goniec atakuje skoczka c6, pośrednio zwiększając presję na e5."
      },
      {
        "q": "Co jest typowym planem białych w wariancie zamkniętym?",
        "a": [
          "c3 i d4",
          "h4 i h5 w każdym wariancie",
          "Wczesne oddanie hetmana"
        ],
        "ok": 0,
        "why": "c3 przygotowuje centralne d4; białe często wspierają je Wie1."
      },
      {
        "q": "Która obrona zaczyna się od 3...Nf6?",
        "a": [
          "Obrona Berlińska",
          "Obrona Morphy’ego",
          "Atak Marshalla"
        ],
        "ok": 0,
        "why": "3...Nf6 to Berlin, natychmiastowy nacisk na e4."
      },
      {
        "q": "Jaką cechę ma wariant wymienny?",
        "a": [
          "Białe zachowują parę gońców",
          "Czarne często mają zdwojone pionki c",
          "Czarne zawsze tracą figurę"
        ],
        "ok": 1,
        "why": "Po 4.Bxc6 dxc6 czarne mają parę gońców, ale zdwojone pionki c."
      },
      {
        "q": "Jaki przełom jest kluczowy w ataku Marshalla?",
        "a": [
          "...d5",
          "...h6",
          "...a5"
        ],
        "ok": 0,
        "why": "Marshall rozpoczyna się od centralnego ...d5, oferującego gambit za inicjatywę."
      }
    ],
    "variants": [
      {
        "title": "Pozycja wyjściowa",
        "eco": null,
        "desc": "Zrozum pierwsze trzy ruchy Partii Hiszpańskiej.",
        "plan": "Białe: presja na c6/e5. Czarne: rozwój i obrona centrum.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1b5"
        ],
        "notes": [
          "Białe zajmują centrum pionem e4.",
          "Czarne odpowiadają symetrycznie i kontrolują d4.",
          "Skoczek atakuje pionka e5 i rozwija się z tempem.",
          "Skoczek broni e5 i kontroluje d4.",
          "Goniec atakuje obrońcę e5 — skoczka c6. To znak rozpoznawczy Partii Hiszpańskiej."
        ]
      },
      {
        "title": "Obrona Morphy’ego",
        "eco": null,
        "desc": "Najważniejsza odpowiedź czarnych: 3...a6.",
        "plan": "Białe: O-O, Wie1, c3, d4. Czarne: ...a6, ...b5, ...Nf6, ...d6.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1b5",
          "a7a6",
          "b5a4",
          "g8f6",
          "e1g1",
          "f8e7",
          "f1e1",
          "b7b5",
          "a4b3",
          "d7d6",
          "c2c3",
          "e8g8"
        ],
        "notes": [
          "Centrum białych.",
          "Czarne utrzymują równowagę w centrum.",
          "Skoczek atakuje e5.",
          "Obrona e5.",
          "Presja na skoczka c6.",
          "Czarne zyskują tempo na gońcu.",
          "Goniec utrzymuje napięcie.",
          "Czarne rozwijają skoczka i atakują e4.",
          "Białe zabezpieczają króla; pion e4 może być chwilowo pozornie niebroniony.",
          "Goniec przygotowuje roszadę i wspiera króla.",
          "Wieża wzmacnia e4 i e-linię.",
          "Czarne zdobywają przestrzeń, atakując gońca.",
          "Goniec pozostaje aktywny na przekątnej a2–g8.",
          "Czarne stabilizują centrum.",
          "Białe przygotowują d4.",
          "Czarne kończą podstawowy rozwój króla."
        ]
      },
      {
        "title": "Wariant zamknięty — plan manewrowy",
        "eco": null,
        "desc": "Klasyczny schemat z ...Na5, ...c5 i białym d4.",
        "plan": "Białe: c3, d4, Nb1–d2–f1–g3. Czarne: ...Na5, ...c5 i aktywność na skrzydle hetmańskim.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1b5",
          "a7a6",
          "b5a4",
          "g8f6",
          "e1g1",
          "f8e7",
          "f1e1",
          "b7b5",
          "a4b3",
          "d7d6",
          "c2c3",
          "e8g8",
          "h2h3",
          "c6a5",
          "b3c2",
          "c7c5",
          "d2d4"
        ],
        "notes": [
          "Zajęcie centrum.",
          "Odpowiedź w centrum.",
          "Atak na e5.",
          "Obrona e5.",
          "Hiszpańskie związanie.",
          "Atak na gońca.",
          "Zachowanie gońca.",
          "Rozwój i nacisk na e4.",
          "Bezpieczny król.",
          "Rozwój gońca.",
          "Obrona e4.",
          "Przestrzeń na skrzydle hetmańskim.",
          "Goniec cofa się na dobrą przekątną.",
          "Wzmocnienie centrum.",
          "Przygotowanie d4.",
          "Roszada czarnych.",
          "Białe zapobiegają ...Bg4 i dają królowi pole h2.",
          "Skoczek atakuje gońca b3 i może wspierać ...c5.",
          "Goniec zachowuje ważną przekątną.",
          "Czarne podważają centrum i zdobywają przestrzeń.",
          "Białe wykonują przygotowany przełom d4."
        ]
      },
      {
        "title": "Obrona Berlińska",
        "eco": null,
        "desc": "Solidna odpowiedź 3...Nf6 i słynna końcówka berlińska.",
        "plan": "Białe: aktywność i pionowa większość na skrzydle królewskim. Czarne: para gońców, solidna struktura i aktywny król.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1b5",
          "g8f6",
          "e1g1",
          "f6e4",
          "d2d4",
          "e4d6",
          "b5c6",
          "d7c6",
          "d4e5",
          "d6f5",
          "d1d8",
          "e8d8"
        ],
        "notes": [
          "Centrum białych.",
          "Symetryczna odpowiedź.",
          "Nacisk na e5.",
          "Obrona pionka.",
          "Hiszpański goniec.",
          "Czarne atakują e4, nie grając ...a6.",
          "Białe roszują, dopuszczając chwilowe zbicie e4.",
          "Skoczek bierze pionka e4.",
          "Białe kontratakują w centrum.",
          "Skoczek odchodzi na d6.",
          "Białe wymieniają gońca za skoczka.",
          "Czarne odbijają pionem d.",
          "Białe odzyskują pionka i otwierają centrum.",
          "Skoczek wraca na f5, broniąc ważnych pól.",
          "Białe proponują wymianę hetmanów.",
          "Król czarnych odbija hetmana; powstaje typowa końcówka berlińska."
        ]
      },
      {
        "title": "Wariant wymienny — 4.Bxc6",
        "eco": null,
        "desc": "Białe wymieniają gońca na skoczka, by osłabić strukturę pionów czarnych.",
        "plan": "Białe: gra przeciwko zdwojonym pionkom c. Czarne: para gońców i aktywna gra.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1b5",
          "a7a6",
          "b5c6",
          "d7c6",
          "e1g1",
          "f8d6",
          "d2d4",
          "e5d4",
          "d1d4"
        ],
        "notes": [
          "Centrum.",
          "Centrum czarnych.",
          "Rozwój skoczka.",
          "Obrona e5.",
          "Atak na obrońcę e5.",
          "Czarne pytają gońca o zamiary.",
          "Białe dobrowolnie oddają parę gońców.",
          "Czarne odbijają pionem d i otrzymują zdwojone pionki c.",
          "Bezpieczny król.",
          "Goniec wspiera e5 i kontroluje centrum.",
          "Białe uderzają w centrum.",
          "Czarne wymieniają pionka e5.",
          "Hetman odbija pionka i centralizuje się; trzeba uważać na tempo ataku na hetmana."
        ]
      },
      {
        "title": "Wariant otwarty — 5...Nxe4",
        "eco": null,
        "desc": "Czarne przejmują pionka e4, licząc na aktywność figur.",
        "plan": "Białe: wykorzystaj inicjatywę i centrum. Czarne: aktywne figury i kontrgra.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1b5",
          "a7a6",
          "b5a4",
          "g8f6",
          "e1g1",
          "f6e4",
          "d2d4",
          "b7b5",
          "a4b3",
          "d7d5"
        ],
        "notes": [
          "Zajęcie centrum.",
          "Symetria.",
          "Rozwój skoczka.",
          "Obrona e5.",
          "Presja na c6.",
          "Atak na gońca.",
          "Odwrót gońca.",
          "Rozwój i nacisk na e4.",
          "Białe roszują.",
          "Czarne wybierają wariant otwarty i biorą pionka.",
          "Białe kontratakują w centrum.",
          "Czarne zdobywają tempo na gońcu.",
          "Goniec wraca na aktywną przekątną.",
          "Czarne zabezpieczają skoczka e4 i walczą o centrum."
        ]
      },
      {
        "title": "Atak Marshalla — idea ...d5",
        "eco": null,
        "desc": "Ostry gambit czarnych przeciwko klasycznemu planowi białych.",
        "plan": "Czarne: inicjatywa za pionka. Białe: dokładna obrona i neutralizacja ataku.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1b5",
          "a7a6",
          "b5a4",
          "g8f6",
          "e1g1",
          "f8e7",
          "f1e1",
          "b7b5",
          "a4b3",
          "e8g8",
          "c2c3",
          "d7d5",
          "e4d5",
          "f6d5"
        ],
        "notes": [
          "Centrum białych.",
          "Odpowiedź czarnych.",
          "Nacisk na e5.",
          "Obrona.",
          "Hiszpański goniec.",
          "Atak na gońca.",
          "Odwrót.",
          "Rozwój skoczka.",
          "Roszada.",
          "Rozwój gońca.",
          "Obrona e4.",
          "Atak na gońca.",
          "Goniec wraca na b3.",
          "Roszada czarnych.",
          "Białe przygotowują d4.",
          "Atak Marshalla: czarne natychmiast uderzają w centrum, oferując gambit.",
          "Białe przyjmują wyzwanie, bijąc pionka d5.",
          "Skoczek odbija na d5; czarne grają na inicjatywę."
        ]
      },
      {
        "title": "Obrona Steinitza — 3...d6",
        "eco": null,
        "desc": "Solidna, ale mniej aktywna obrona e5.",
        "plan": "Białe: szybki rozwój i d4. Czarne: utrzymanie e5 i dokończenie rozwoju.",
        "moves": [
          "e2e4",
          "e7e5",
          "g1f3",
          "b8c6",
          "f1b5",
          "d7d6",
          "d2d4",
          "c8d7",
          "b1c3",
          "g8f6",
          "e1g1",
          "f8e7"
        ],
        "notes": [
          "Białe zajmują centrum.",
          "Czarne odpowiadają w centrum.",
          "Atak na e5.",
          "Obrona e5.",
          "Nacisk na skoczka c6.",
          "Czarne bronią e5 pionem, ale ograniczają gońca f8.",
          "Białe od razu wykorzystują możliwość przełomu d4.",
          "Czarne rozwijają gońca i chronią skoczka c6.",
          "Rozwój i presja na centrum.",
          "Rozwój skoczka.",
          "Roszada białych.",
          "Czarne przygotowują roszadę."
        ]
      },
      ...spanishExtra
    ]
  },
  {
    "id": "sicilian",
    "title": "Obrona sycylijska",
    "eco": "B20",
    "family": "Sicilian Defense",
    "quiz": [
      {
        "q": "Jaka jest główna idea 1...c5?",
        "a": [
          "Natychmiastowa kontrola pola d4 z flanki",
          "Atak na pionka h2",
          "Przygotowanie ...f5 w drugim ruchu"
        ],
        "ok": 0,
        "why": "Pion c5 kontroluje d4 i tworzy asymetryczną walkę o centrum."
      },
      {
        "q": "Która linia jest charakterystyczna dla sycylijskiej otwartej?",
        "a": [
          "2.c3",
          "2.Nf3, a następnie d4",
          "2.f4 bez Nc3"
        ],
        "ok": 1,
        "why": "Białe zwykle grają Nf3 i d4, a czarne wymieniają pionka c na d."
      },
      {
        "q": "Co oznacza 5...a6 w Najdorfie?",
        "a": [
          "Oddanie pionka",
          "Ograniczenie Nb5 i przygotowanie ...b5",
          "Przygotowanie ...h5"
        ],
        "ok": 1,
        "why": "...a6 zabiera białemu skoczkowi pole b5 i wspiera ekspansję skrzydła hetmańskiego."
      },
      {
        "q": "Jaki jest typowy plan w Smoku?",
        "a": [
          "...g6 i ...Bg7",
          "...f6 i ...Kf7",
          "...b6 i ...Ba6 zawsze"
        ],
        "ok": 0,
        "why": "Fianchetto gońca na g7 jest znakiem rozpoznawczym Smoka."
      },
      {
        "q": "Jaką słabość pozostawia 5...e5 w Swiesznikowie?",
        "a": [
          "Pole d5",
          "Pole h8",
          "Pion a7"
        ],
        "ok": 0,
        "why": "Pole d5 jest potencjalną placówką białych figur."
      },
      {
        "q": "Dlaczego przełom ...d5 jest tak ważny?",
        "a": [
          "Otwiera kontrgrę w centrum i wyrównuje przestrzeń",
          "Zawsze wygrywa figurę",
          "Pozwala zrobić drugą roszadę"
        ],
        "ok": 0,
        "why": "...d5 często uwalnia pozycję czarnych, ale trzeba go odpowiednio przygotować."
      },
      {
        "q": "Co wyróżnia wariant Ałapina?",
        "a": [
          "2.c3",
          "2.Bc4",
          "2.Qh5"
        ],
        "ok": 0,
        "why": "2.c3 przygotowuje d4 i silne centrum pionowe."
      },
      {
        "q": "Jak należy oceniać atak przy przeciwnych roszadach?",
        "a": [
          "Liczy się szybkość ataku i bezpieczeństwo własnego króla",
          "Można ignorować centrum",
          "Zawsze wygrywa strona z białymi"
        ],
        "ok": 0,
        "why": "Tempo, otwarte linie i profilaktyka są kluczowe przy przeciwnych roszadach."
      }
    ],
    "variants": [
      {
        "title": "Podstawy obrony sycylijskiej",
        "eco": "B20",
        "desc": "Czarne od razu walczą o pole d4 pionem z flanki.",
        "plan": "Białe zajmują centrum; czarne odpowiadają asymetrycznie, unikając symetrii 1...e5.",
        "moves": [
          "e2e4",
          "c7c5"
        ],
        "notes": []
      },
      {
        "title": "Sycylijska otwarta",
        "eco": "B30",
        "desc": "Typowy szkielet otwartej sycylijskiej.",
        "plan": "Centralna wymiana otwiera linię c dla czarnych; białe mają przestrzeń i aktywne figury.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "d7d6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g8f6",
          "b1c3"
        ],
        "notes": []
      },
      {
        "title": "Wariant Najdorfa",
        "eco": "B90",
        "desc": "Elastyczny ruch ...a6 ogranicza skok Nb5 i przygotowuje ...b5.",
        "plan": "Najdorf nie polega na natychmiastowym ataku: czarne przygotowują kontrgrę na skrzydle hetmańskim.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "d7d6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g8f6",
          "b1c3",
          "a7a6"
        ],
        "notes": []
      },
      {
        "title": "Atak angielski przeciw Najdorfowi",
        "eco": "B90",
        "desc": "Białe planują Qd2, O-O-O i g4; czarne szukają kontrgry ...b5.",
        "plan": "Po ...e5 skoczek ustępuje na b3; białe stabilizują centrum przed atakiem pionami.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "d7d6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g8f6",
          "b1c3",
          "a7a6",
          "c1e3",
          "e7e5",
          "d4b3",
          "c8e6",
          "f2f3"
        ],
        "notes": []
      },
      {
        "title": "Wariant Smoka",
        "eco": "B70",
        "desc": "Fianchetto gońca g7 tworzy presję na przekątnej a1–h8.",
        "plan": "Białe często grają f3, Qd2 i długą roszadę; czarne naciskają na c3 i linię c.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "d7d6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g8f6",
          "b1c3",
          "g7g6",
          "c1e3",
          "f8g7"
        ],
        "notes": []
      },
      {
        "title": "Atak jugosłowiański",
        "eco": "B76",
        "desc": "Przeciwne roszady mogą prowadzić do wyścigu ataków.",
        "plan": "Plan białych: Bc4, O-O-O, h4–h5; plan czarnych: ...Nc6, ...Rc8, ...Ne5 i nacisk na c3.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "d7d6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g8f6",
          "b1c3",
          "g7g6",
          "c1e3",
          "f8g7",
          "f2f3",
          "e8g8",
          "d1d2"
        ],
        "notes": []
      },
      {
        "title": "Wariant Scheveningen",
        "eco": "B80",
        "desc": "Piony e6 i d6 tworzą zwartą, elastyczną strukturę.",
        "plan": "Czarne zwykle dążą do ...a6, ...Qc7 i przełomów ...d5 lub ...b5.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "d7d6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g8f6",
          "b1c3",
          "e7e6"
        ],
        "notes": []
      },
      {
        "title": "Wariant klasyczny",
        "eco": "B56",
        "desc": "Czarne rozwijają oba skoczki i zachowują różne struktury.",
        "plan": "Białe mogą wybrać Bg5, Bc4 lub Be2; czarne muszą uważać na presję w centrum.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "d7d6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g8f6",
          "b1c3",
          "b8c6"
        ],
        "notes": []
      },
      {
        "title": "Wariant Swiesznikowa",
        "eco": "B33",
        "desc": "Aktywne ...e5 zyskuje tempo, ale osłabia pole d5.",
        "plan": "Białe zwykle odpowiadają Nb5; czarne akceptują słabość d5 w zamian za aktywność.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "b8c6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g8f6",
          "b1c3",
          "e7e5"
        ],
        "notes": []
      },
      {
        "title": "Sycylijska zamknięta",
        "eco": "B23",
        "desc": "Białe rezygnują z wczesnego d4 i budują atak na skrzydle królewskim.",
        "plan": "Typowe plany białych: d3, f4 i Nf3; czarne grają ...d6, ...e6 i ...Rb8.",
        "moves": [
          "e2e4",
          "c7c5",
          "b1c3",
          "b8c6",
          "g2g3",
          "g7g6",
          "f1g2",
          "f8g7"
        ],
        "notes": []
      },
      {
        "title": "Wariant Ałapina",
        "eco": "B22",
        "desc": "Białe przygotowują szerokie centrum c3–d4–e5.",
        "plan": "Czarne powinny naciskać na centrum ruchami ...cxd4 i ...d6, zamiast biernie czekać.",
        "moves": [
          "e2e4",
          "c7c5",
          "c2c3",
          "g8f6",
          "e4e5",
          "f6d5",
          "d2d4"
        ],
        "notes": []
      },
      {
        "title": "Atak Grand Prix",
        "eco": "B23",
        "desc": "Bezpośredni plan ataku białych na króla.",
        "plan": "Białe często grają Bc4, d3, O-O i Qe1–h4; czarne kontratakują w centrum.",
        "moves": [
          "e2e4",
          "c7c5",
          "b1c3",
          "b8c6",
          "f2f4",
          "g7g6",
          "g1f3",
          "f8g7"
        ],
        "notes": []
      },
      {
        "title": "Wariant przyspieszonego Smoka",
        "eco": "B34",
        "desc": "Czarne fianchettują gońca bez wcześniejszego ...d6.",
        "plan": "Brak ...d6 pozwala szybciej zagrać ...d5, ale białe mogą zastosować system Maroczego z c4.",
        "moves": [
          "e2e4",
          "c7c5",
          "g1f3",
          "b8c6",
          "d2d4",
          "c5d4",
          "f3d4",
          "g7g6"
        ],
        "notes": []
      },
      ...sicilianExtra
    ]
  }
];
