export function italianLesson(diagram, boardLink) {
  return `<article class="opening-chapter" aria-labelledby="opening-title">
    <header class="opening-chapter-header">
      <div class="eyebrow">LEKCJA DEBIUTOWA · ECO C50–C54</div>
      <h2 id="opening-title">Partia włoska</h2>
      <p>Wyprowadź figury, zabezpiecz króla i zdecyduj, kiedy otworzyć centrum. Po tej lekcji rozpoznasz spokojny plan z d3 oraz pozycje, w których warto szybciej zagrać d4.</p>
      ${boardLink(0, 'Sprawdź debiut')}
    </header>

    <section class="opening-section">
      <h3>1. Jak powstaje partia włoska?</h3>
      <div class="opening-position">
        <div>
          <p class="opening-line">1. e4 e5 2. Sf3 Sc6 3. Gc4</p>
          <p>Pionki e4 i e5 zajmują centrum. Skoczek z f3 atakuje pionka e5, a skoczek z c6 go broni. Ruch <strong>3.Gc4</strong> wyprowadza gońca i otwiera drogę do krótkiej roszady.</p>
          <p>Goniec c4 celuje w f7, którego broni tylko czarny król. Jednocześnie patrzy na d5, ważne pole dla czarnych. Zaznaczone pola pokazują, dlaczego ta sama figura pomaga zarówno w ataku na króla, jak i w walce o centrum.</p>
        </div>
        ${diagram(['e4','e5','Nf3','Nc6','Bc4'], ['c4','d5','f7'], 'Po 3.Gc4 goniec z c4 kontroluje d5 i atakuje f7.')}
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
          <p><strong>Wybierz odpowiedź na Gc4.</strong> Ruch ...Gc5 rozwija gońca i kieruje go na f2. Ruch ...Sf6 od razu atakuje pionka e4 i prowadzi do obrony dwóch skoczków.</p>
          <p><strong>Szukaj okazji do ...d5.</strong> Po rozwinięciu figur i zabezpieczeniu króla przełom ...d5 może uderzyć w e4 i otworzyć linie. W ostrym wariancie z Sg5 to także sposób na natychmiastowy kontratak.</p>
        </section>
      </div>
    </section>

    <section class="opening-section">
      <h3>3. Cztery warianty i ich sens</h3>
      <div class="opening-plans">
        <section>
          <h4>Giuoco Pianissimo</h4>
          <p class="opening-line">3…Gc5 4.d3 Sf6 5.c3</p>
          <p>Białe najpierw podpierają e4, a potem przygotowują d4. To dobry wariant na początek: można spokojnie zrobić roszadę i dopiero wtedy ocenić, czy otworzyć centrum.</p>
          ${boardLink(1, 'Zobacz Pianissimo na szachownicy')}
        </section>
        <section>
          <h4>Giuoco Piano z szybkim d4</h4>
          <p class="opening-line">3…Gc5 4.c3 Sf6 5.d4</p>
          <p>Białe zajmują centrum szybciej. Po 5…exd4 6.cxd4 pion z c3 trafia na d4, ale czarne mogą zagrać 6…Gb4+ i wykorzystać położenie króla na e1.</p>
          ${boardLink(2, 'Zobacz Giuoco Piano na szachownicy')}
        </section>
        <section>
          <h4>Obrona dwóch skoczków</h4>
          <p class="opening-line">3…Sf6 4.Sg5 d5</p>
          <p>Skoczek dołącza do gońca w ataku na f7. Czarne odpowiadają w centrum: pion na d5 atakuje jednocześnie gońca c4 i pionka e4.</p>
          ${boardLink(3, 'Zobacz obronę dwóch skoczków')}
        </section>
        <section>
          <h4>Gambit Evansa</h4>
          <p class="opening-line">3…Gc5 4.b4 Gxb4 5.c3</p>
          <p>Białe oddają pionka b. Ruch c3 atakuje gońca i przygotowuje d4. W zamian za materiał białe zyskują czas na rozwój i budowę centrum.</p>
          ${boardLink(4, 'Zobacz gambit Evansa na szachownicy')}
        </section>
      </div>
    </section>

    <section class="opening-section">
      <h3>4. Pułapki i typowe błędy</h3>
      <div class="opening-position">
        <div>
          <h4>Gdy atak na f7 przesłania centrum</h4>
          <p>Po <strong>3…Sf6 4.Sg5</strong> białe grożą zbiciem na f7. Odpowiedź <strong>4…d5</strong> zasłania przekątną gońca c4–f7. Po 5.exd5 czarne mogą zagrać 5…Sa5, atakując gońca c4. Przed Sg5 prześledź tę odpowiedź w wariancie obrony dwóch skoczków.</p>
          <h4>Gdy d4 otwiera linię do własnego króla</h4>
          <p>Po 4.c3 Sf6 5.d4 exd4 6.cxd4 sprawdź szacha <strong>6…Gb4+</strong>. Pole d2 jest puste, więc goniec widzi króla na e1. Ruch 7.Sc3 zasłania przekątną, lecz skoczek jest związany i czarne mogą zbić pionka e4 skoczkiem.</p>
        </div>
        ${diagram(['e4','e5','Nf3','Nc6','Bc4','Nf6','Ng5','d5'], ['d5','e4','c4'], 'Po 4…d5 pion na d5 atakuje c4 i e4 oraz blokuje przekątną do f7.')}
      </div>
    </section>
  </article>`;
}
