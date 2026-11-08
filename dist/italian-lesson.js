export function italianLesson(diagram, boardLink, variants, e, previews) {
  const extra = variants.map((variant, index) => ({ variant, index })).filter(({ variant }) => variant.group);
  const groups = new Set(extra.map(({ variant }) => variant.group));
  return `<article class="opening-chapter" aria-labelledby="opening-title">
    <header class="opening-chapter-header">
      <div class="eyebrow">LEKCJA DEBIUTOWA · ECO C50–C59</div>
      <h2 id="opening-title">Partia włoska</h2>
      <p>Wyprowadź figury, zabezpiecz króla i zdecyduj, kiedy otworzyć centrum. Po tej lekcji rozpoznasz spokojny plan z d3 oraz pozycje, w których warto szybciej zagrać d4.</p>
      ${boardLink(0, 'Sprawdź debiut')}
    </header>

    <section class="opening-section">
      <h3>1. Jak powstaje partia włoska?</h3>
      <div class="opening-position">
        <div>
          <p class="opening-line">1. e4 e5 2. Nf3 Nc6 3. Bc4</p>
          <p>Pionki e4 i e5 zajmują centrum. Skoczek z f3 atakuje pionka e5, a skoczek z c6 go broni. Ruch <strong>3.Bc4</strong> wyprowadza gońca i otwiera drogę do krótkiej roszady.</p>
          <p>Goniec c4 celuje w f7, którego broni tylko czarny król. Jednocześnie patrzy na d5, ważne pole dla czarnych. Zaznaczone pola pokazują, dlaczego ta sama figura pomaga zarówno w ataku na króla, jak i w walce o centrum.</p>
          ${previews(0)}
        </div>
        ${diagram(['e4','e5','Nf3','Nc6','Bc4'], ['c4','d5','f7'], 'Po 3.Bc4 goniec z c4 kontroluje d5 i atakuje f7.')}
      </div>
    </section>

    <section class="opening-section">
      <h3>2. Plany białych i czarnych</h3>
      <div class="opening-plans">
        <section>
          <h4>Białe</h4>
          <p><strong>Zabezpiecz e4 i króla.</strong> Ruch d3 podpiera pionka e4. Po krótkiej roszadzie wieża może przejść na e1 i dołożyć obronę tego pionka.</p>
          <p><strong>Przygotuj d4.</strong> Pion z c2 może stanąć na c3 i podeprzeć d4. Zanim zagrasz d4, sprawdź, kto odzyska pionka po wymianie i czy po otwarciu centrum czarne mają szacha z b4.</p>
        </section>
        <section>
          <h4>Czarne</h4>
          <p><strong>Wybierz odpowiedź na Bc4.</strong> Ruch ...Bc5 rozwija gońca i kieruje go na f2. Ruch ...Nf6 od razu atakuje pionka e4 i prowadzi do obrony dwóch skoczków.</p>
          <p><strong>Szukaj okazji do ...d5.</strong> Po rozwinięciu figur i zabezpieczeniu króla przełom ...d5 może uderzyć w e4 i otworzyć linie. W ostrym wariancie z Ng5 to także sposób na natychmiastowy kontratak.</p>
        </section>
      </div>
    </section>

    <section class="opening-section">
      <h3>3. Cztery warianty i ich sens</h3>
      <div class="opening-plans">
        <section>
          <h4>Giuoco Pianissimo</h4>
          <p class="opening-line">3…Bc5 4.d3 Nf6 5.c3</p>
          <p>Białe najpierw podpierają e4, a potem przygotowują d4. To dobry wariant na początek: można spokojnie zrobić roszadę i dopiero wtedy ocenić, czy otworzyć centrum.</p>
          ${previews(1)}
          ${boardLink(1, 'Zobacz Pianissimo na szachownicy')}
        </section>
        <section>
          <h4>Giuoco Piano z szybkim d4</h4>
          <p class="opening-line">3…Bc5 4.c3 Nf6 5.d4</p>
          <p>Białe zajmują centrum szybciej. Po 5…exd4 6.cxd4 pion z c3 trafia na d4, ale czarne mogą zagrać 6…Bb4+ i wykorzystać położenie króla na e1.</p>
          ${previews(2)}
          ${boardLink(2, 'Zobacz Giuoco Piano na szachownicy')}
        </section>
        <section>
          <h4>Obrona dwóch skoczków</h4>
          <p class="opening-line">3…Nf6 4.Ng5 d5</p>
          <p>Skoczek dołącza do gońca w ataku na f7. Czarne odpowiadają w centrum: pion na d5 atakuje jednocześnie gońca c4 i pionka e4.</p>
          ${previews(3)}
          ${boardLink(3, 'Zobacz obronę dwóch skoczków')}
        </section>
        <section>
          <h4>Gambit Evansa</h4>
          <p class="opening-line">3…Bc5 4.b4 Bxb4 5.c3</p>
          <p>Białe oddają pionka b. Ruch c3 atakuje gońca i przygotowuje d4. W zamian za materiał białe zyskują czas na rozwój i budowę centrum.</p>
          ${previews(4)}
          ${boardLink(4, 'Zobacz gambit Evansa na szachownicy')}
        </section>
      </div>
    </section>

    <section class="opening-section">
      <h3>4. Pułapki i jak się przed nimi bronić</h3>
      <div class="opening-position">
        <div>
          <h4>Gdy atak na f7 przesłania centrum</h4>
          <p>Po <strong>3…Nf6 4.Ng5</strong> białe grożą zbiciem na f7. Odpowiedź <strong>4…d5</strong> zasłania przekątną gońca c4–f7. Po 5.exd5 czarne mogą zagrać 5…Na5, atakując gońca c4. Przed Ng5 prześledź tę odpowiedź w wariancie obrony dwóch skoczków.</p>
          <h4>Gdy d4 otwiera linię do własnego króla</h4>
          <p>Po 4.c3 Nf6 5.d4 exd4 6.cxd4 sprawdź szacha <strong>6…Bb4+</strong>. Pole d2 jest puste, więc goniec widzi króla na e1. Ruch 7.Nc3 zasłania przekątną, lecz skoczek jest związany i czarne mogą zbić pionka e4 skoczkiem.</p>
        </div>
        ${diagram(['e4','e5','Nf3','Nc6','Bc4','Nf6','Ng5','d5'], ['d5','e4','c4'], 'Po 4…d5 pion na d5 atakuje c4 i e4 oraz blokuje przekątną do f7.')}
      </div>
      <div class="opening-plans">
        <section>
          <h4>Blackburne–Kostić: pion e5 jest przynętą</h4>
          <p><strong>Sygnał dla białych:</strong> 3…Nd4 pozostawia pionka e5 bez obrony. Po 4.Nxe5 Qg5 hetman atakuje e5 i g2, a 5.Nxf7 nie daje szacha.</p>
          <p><strong>Jak się bronić:</strong> 4.Nxd4 usuwa skoczka i omija pułapkę. Po 4…exd4 można zrobić roszadę. Porównaj tę pozycję z linią, w której białe biorą przynętę i dostają mata na f3.</p>
          ${previews(15, 17)}
          ${boardLink(15, 'Zobacz pułapkę')}
          ${boardLink(17, 'Zobacz obronę 4.Nxd4')}
        </section>
        <section>
          <h4>Mat Legala: hetman na d1 jest przynętą</h4>
          <p><strong>Sygnał dla czarnych:</strong> po 3…d6 4.Nc3 Bg4 5.h3 Bh5 6.Nxe5 goniec może zbić hetmana. Jednak po 6…Bxd1 następuje 7.Bxf7+ Ke7 8.Nd5#.</p>
          <p><strong>Jak się bronić:</strong> po 6.Nxe5 zbij skoczkiem: 6…Nxe5. Białe odzyskają figurę przez 7.Qxh5 i zostaną z dodatkowym pionkiem. Pułapce można zapobiec wcześniej, grając 5…Bxf3 zamiast 5…Bh5.</p>
          ${previews(18, 19)}
          ${boardLink(18, 'Zobacz mata Legala')}
          ${boardLink(19, 'Zobacz obronę 6…Nxe5')}
        </section>
        <section>
          <h4>Atak smażonej wątróbki: uważaj na 5…Nxd5</h4>
          <p><strong>Sygnał dla czarnych:</strong> po 4.Ng5 d5 5.exd5 naturalne odbicie skoczkiem pozwala na 6.Nxf7. Po przyjęciu ofiary hetman daje szacha z f3 i atakuje skoczka d5.</p>
          <p><strong>Jak się bronić:</strong> wybierz 5…Na5, atakując gońca c4. Po 6.Bb5+ c6 7.dxc6 bxc6 czarne mają otwarte linie i mogą rozwijać figury z tempem, mimo straty pionka.</p>
          ${previews(7, 3)}
          ${boardLink(7, 'Zobacz atak 6.Nxf7')}
          ${boardLink(3, 'Zobacz obronę 5…Na5')}
        </section>
        <section>
          <h4>Traxler: sprawdź szacha na f2 przed biciem</h4>
          <p><strong>Sygnał dla białych:</strong> po 4.Ng5 Bc5 bicie 5.Nxf7 grozi hetmanowi i wieży. Czarne mogą odpowiedzieć 5…Bxf2+ i prowadzić atak z szachami.</p>
          <p><strong>Jak się bronić:</strong> rozważ 5.Bxf7+. Szach zmusza czarne do reakcji. Po 5…Ke7 można wycofać gońca na b3. Przed kolejnym ruchem oceń nacisk na f2.</p>
          ${previews(9, 20)}
          ${boardLink(9, 'Zobacz kontratak po 5.Nxf7')}
          ${boardLink(20, 'Zobacz odpowiedź 5.Bxf7+')}
        </section>
        <section>
          <h4>Gambit Jerome’a: zasłoń szacha hetmana</h4>
          <p><strong>Sygnał dla czarnych:</strong> po 3…Bc5 4.Bxf7+ Kxf7 5.Nxe5+ białe próbują ściągnąć króla na otwartą przekątną.</p>
          <p><strong>Jak się bronić:</strong> 5…Nxe5 zbija szachującego skoczka. Po 6.Qh5+ odpowiedź 6…Ng6 zasłania przekątną. Pion h7 broni skoczka, więc przed biciem na g6 białe muszą policzyć …hxg6.</p>
          ${previews(21)}
          ${boardLink(21, 'Zobacz obronę gambitu Jerome’a')}
        </section>
      </div>
    </section>

    <section class="opening-section">
      <h3>5. Struktury pionowe i przełomy</h3>
      <div class="opening-position">
        <div>
          <h4>Spokojne centrum: d3 i e4 przeciw d6 i e5</h4>
          <p>Obie strony bronią własnego pionka e pionkiem d. Gdy białe grają c3, mogą przygotować d4 i wycofać gońca przez b3 na c2. Czarne mogą przygotować …d5, ustawić wieżę na e8 albo zyskać przestrzeń przez …a6 i …b5, jeśli centrum jest bezpieczne.</p>
          <p><strong>Sprawdź d4 w trzech krokach.</strong> Najpierw policz, co się stanie po …exd4. Potem sprawdź, czy po cxd4 przeciwnik może zagrać …Bb4+ lub zbić na e4. Na koniec porównaj bezpieczeństwo królów i aktywność wież po otwarciu linii. Ta sama pozycja może wymagać przygotowania d4 albo pozwalać na nie od razu.</p>
        </div>
        ${diagram(['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6','d3','d6','O-O','O-O','Re1'], ['c3','d3','d4','d6','e4','e5'], 'Po 7.Re1 białe wsparły e4 i przygotowały d4. Czarne nadal mogą przygotować własne …d5.')}
      </div>
      <div class="opening-plans">
        <section>
          <h4>Otwarte centrum: piony c i e wymieniają się na d4</h4>
          <p>Po 4.c3 Nf6 5.d4 exd4 6.cxd4 białe mają piony na d4 i e4. Mogą zyskać przestrzeń ruchem e5 lub d5, ale najpierw muszą utrzymać oba piony. Czarne mogą naciskać na centrum ruchem …Bb4+ i figurami skierowanymi na e4 lub d4.</p>
          <p>Jeśli pion e4 zniknie, pion d4 może zostać izolowany, czyli bez przyjaznego pionka na sąsiednich liniach. Daje białym kontrolę nad c5 i e5 oraz szansę na przełom d5. Czarne mogą ustawić przed nim figurę na d5 i po wymianach zwiększyć nacisk na d4.</p>
        </section>
        <section>
          <h4>Manewry figur w Pianissimo</h4>
          <p>Typowa trasa białego skoczka to b1–d2–f1–g3. Najpierw roszada przenosi wieżę na f1, a Re1 zwalnia to pole dla skoczka. Z g3 skoczek broni e4 i może naciskać na f5. Trasa d2–c4 bywa użyteczna, gdy białe chcą naciskać na e5 lub zaatakować gońca b6.</p>
          <p>Ruch h3 kontroluje g4, ale kosztuje tempo. Ruch a4 kontroluje b5 i bywa odpowiedzią na plan …a6 i …b5. Przy każdym ruchu pionem sprawdź, czy ważniejszy jest rozwój figury albo obrona centrum.</p>
        </section>
      </div>
    </section>

    <section class="opening-section">
      <h3>6. Repertuar rozszerzony i partia wzorcowa</h3>
      <p class="opening-variants-intro">Najpierw porównaj spokojne ustawienia po …Bc5 i …Nf6. W ostrych liniach ucz się odpowiedzi na ruch przeciwnika: po Ng5 inne zadanie stawia …d5, a inne …Bc5. Każdy przykład możesz przejść ruch po ruchu lub odtworzyć samodzielnie.</p>
      ${[...groups].map(group => `<details class="opening-guide-details italian-variant-group" open>
        <summary>${e(group)}</summary>
        <div class="opening-plans">${extra.filter(({ variant }) => variant.group === group).map(({ variant, index }) => `<section>
          <h4>${e(variant.title)}</h4>
          <p>${e(variant.desc)}</p>
          <p><strong>Na co zwrócić uwagę</strong><br>${e(variant.plan)}</p>
          ${previews(index)}
          ${boardLink(index, 'Przejdź do przykładu')}
        </section>`).join('')}</div>
      </details>`).join('')}
    </section>

    <section class="opening-section">
      <h3>7. Przystanki do samodzielnej analizy</h3>
      <div class="opening-position">
        <div>
          <h4>Dwa cele po ruchu hetmana</h4>
          <p>Po 3…Nd4 4.Nxe5 Qg5 jest ruch białych. Wskaż oba cele hetmana. Czy 5.Nxf7 daje białym czas na zbicie wieży h8?</p>
          <details class="opening-guide-details"><summary>Pokaż odpowiedź</summary>
            <p>Hetman atakuje skoczka e5 i pionka g2. Ruch 5.Nxf7 grozi wieży, ale bez szacha. Czarne mogą zagrać 5…Qxg2, zaatakować wieżę h1 i w pokazanej linii zakończyć partię matem …Nf3.</p>
          </details>
          <h4>Ta sama pozycja z innej kolejności ruchów</h4>
          <p>Porównaj 3…Bc5 4.d3 Nf6 5.c3 z 3…Nf6 4.d3 Bc5 5.c3. Gdzie stoją oba czarne skoczki i oba białe pionki c oraz d? Kto jest na ruchu?</p>
          <details class="opening-guide-details"><summary>Pokaż odpowiedź</summary>
            <p>Po obu sekwencjach czarne skoczki są na c6 i f6, białe piony na c3 i d3, a ruch mają czarne. To transpozycja. Na wcześniejszym etapie kolejność ma znaczenie, bo po 3…Nf6 pion e4 jest już atakowany.</p>
          </details>
          <h4>Atak z szachem przed obroną</h4>
          <p>W partii Anderssen–Dufresne zatrzymaj odtwarzanie po 19…Qxf3. Czarne grożą biciem na g2. Znajdź pierwszy szach białych i sprawdź, którą linię otworzy późniejsza ofiara hetmana.</p>
          <details class="opening-guide-details"><summary>Pokaż odpowiedź</summary>
            <p>20.Rxe7+ rozpoczyna serię szachów. Po 20…Nxe7 21.Qxd7+ Kxd7 22.Bf5+ zejście gońca z d3 odsłania szacha wieży z d1. To właśnie ta wieża tłumaczy sens wcześniejszego 19.Rad1.</p>
          </details>
        </div>
        ${diagram(['e4','e5','Nf3','Nc6','Bc4','Nd4','Nxe5','Qg5'], ['g5','g2','e5'], 'Po 4…Qg5 hetman atakuje jednocześnie e5 i g2. Czy widzisz oba kierunki ataku?')}
      </div>
    </section>

    <section class="opening-section">
      <h3>8. Jak ćwiczyć i gdzie szukać dalszych partii</h3>
      <p>Rozegraj Pianissimo obiema stronami i zatrzymaj się przed d4 lub …d5. Spróbuj uzasadnić przełom jednym zdaniem. Następnie porównaj dwa przykłady z f7: atak smażonej wątróbki i kontratak Traxlera. Sprawdź, w którym z nich pierwszego szacha dają białe, a w którym czarne.</p>
      <p>Gambit Evansa dobrze pokazuje grę opartą na przewadze rozwoju. W partii Anderssen–Dufresne z 1852 r. zwróć uwagę, kiedy białe przestają inwestować w centrum i zaczynają grać kolejne szachy. W katalogu ECO znajdziesz więcej odgałęzień, m.in. obronę paryską, 3…h6 i warianty z wczesnym d4.</p>
      <ul class="opening-sources">
        <li><a href="https://github.com/lichess-org/chess-openings/blob/master/c.tsv" target="_blank" rel="noopener noreferrer">Lichess Chess Openings — nazwy, kody ECO i zapisy wariantów</a></li>
        <li><a href="https://chessforheroes.uk/wp-content/uploads/2023/10/chess-heroes-openings-0323-amazon.pdf#page=109" target="_blank" rel="noopener noreferrer">Richard James, Chess Heroes: Openings — rozdział o partii włoskiej</a></li>
        <li><a href="https://www.scacco.it/data/attachments/10102/modernized-italian-game.pdf" target="_blank" rel="noopener noreferrer">Alexander Kalinin i Nikolai Kalinichenko, The Modernized Italian Game for White — fragment książki o współczesnym Pianissimo</a></li>
        <li><a href="https://www.chesshistory.com/winter/extra/evergreen.html" target="_blank" rel="noopener noreferrer">Edward Winter, The Evergreen Game — źródła i historia partii Anderssen–Dufresne</a></li>
        <li><a href="https://www.chess.com/terms/legals-mate-chess" target="_blank" rel="noopener noreferrer">Chess.com — mat Legala i jego mechanizm</a></li>
        <li><a href="https://www.chess.com/openings/Italian-Game-Traxler-Bishop-Sacrifice-Line-5...Ke7" target="_blank" rel="noopener noreferrer">Chess.com — wariant Traxlera po 5.Bxf7+ Ke7</a></li>
      </ul>
    </section>
  </article>`;
}
