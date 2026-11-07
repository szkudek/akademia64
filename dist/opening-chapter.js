import { italianLesson } from './italian-lesson.js';

const diagrams = {
  caro: {
    start: [['e4', 'c6', 'd4', 'd5'], ['c6', 'd5', 'e4'], 'Pion z c6 podpiera d5. Z d5 czarne naciskają na e4.'],
    example: [['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5'], ['e5', 'd4', 'f5'], 'Po 3.e5 Gf5 goniec wyszedł przed łańcuch pionów. Białe mogą spróbować zaatakować go ruchem g4.'],
    pitfall: 'Po e5 i ...Gf5 białe mogą zyskać tempo na gońcu ruchem g4. Zanim ruszysz pionem g, sprawdź też, czy osłabienie własnego króla jest warte tego tempa.',
  },
  spanish: {
    start: [['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], ['b5', 'c6', 'e5'], 'Goniec b5 atakuje skoczka c6, który broni pionka e5.'],
    example: [['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6', 'Nxe5', 'Qd4'], ['d4', 'e5', 'e4'], 'Hetman na d4 atakuje jednocześnie skoczka e5 i pionka e4.'],
    pitfall: 'Po 5.Sxe5 Hd4 białe mogą wycofać skoczka, ale wtedy czarne mogą odzyskać pionka na e4. Przed biciem sprawdź, czy przeciwnik ma ruch z podwójnym atakiem.',
  },
  sicilian: {
    start: [['e4', 'c5'], ['e4', 'c5', 'd4'], 'Piony e4 i c5 walczą o centrum. Czarne kontrolują d4 z linii c.'],
    example: [['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6'], ['f6', 'e4', 'd4'], 'Po …Sf6 skoczek naciska na e4. Białe mogą rozwinąć skoczka na c3 i jednocześnie obronić pionka.'],
    pitfall: 'Po wymianie na d4 spójrz, którą figurę czarne rozwijają z groźbą. Jeśli zagrały …Sf6, przed rozpoczęciem ataku sprawdź, czy pionek e4 ma obronę.',
  },
};

function boardLink(courseId, index, label) {
  return `<a class="btn outline opening-board-link" href="#opening/course-${courseId}-${index}/board">${label} →</a>`;
}

export function openingChapter(course, guide, diagram, e) {
  if (course.id === 'italian') return italianLesson(diagram, (index, label) => boardLink(course.id, index, label));
  const { start, example, pitfall } = diagrams[course.id];
  return `<article class="opening-chapter" aria-labelledby="opening-title">
    <header class="opening-chapter-header">
      <div class="eyebrow">LEKCJA DEBIUTOWA · ECO ${e(course.eco)}</div>
      <h2 id="opening-title">${e(course.title)}</h2>
      <p>${e(guide.takeaway)}</p>
      ${boardLink(course.id, 0, 'Sprawdź debiut')}
    </header>
    <section class="opening-section">
      <h3>1. Jak powstaje ten debiut?</h3>
      <div class="opening-position"><p>${e(guide.idea)}</p>${diagram(...start)}</div>
    </section>
    <section class="opening-section">
      <h3>2. Plany białych i czarnych</h3>
      <div class="opening-plans">
        <section><h4>Białe</h4><p>${e(guide.white)}</p></section>
        <section><h4>Czarne</h4><p>${e(guide.black)}</p></section>
      </div>
    </section>
    <section class="opening-section">
      <h3>3. Warianty i ich sens</h3>
      <p class="opening-variants-intro">${e(guide.branches)}</p>
      <div class="opening-plans">${course.variants.slice(1).map((variant, index) => `<section>
        <h4>${e(variant.title)}</h4>
        <p>${e(variant.desc)}</p>
        <p><strong>Na co zwrócić uwagę</strong><br>${e(variant.plan)}</p>
        ${boardLink(course.id, index + 1, 'Zobacz wariant na szachownicy')}
      </section>`).join('')}</div>
    </section>
    <section class="opening-section">
      <h3>4. Pułapki i typowe błędy</h3>
      <div class="opening-position">
        <div><p>${e(guide.warning)}</p><p>${pitfall}</p></div>
        ${diagram(...example)}
      </div>
    </section>
  </article>`;
}
