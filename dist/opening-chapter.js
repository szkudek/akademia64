import { italianLesson } from './italian-lesson.js';
import { openingStudy } from './opening-study.js';

const diagrams = {
  caro: {
    start: [['e4', 'c6', 'd4', 'd5'], ['c6', 'd5', 'e4'], 'Pion z c6 podpiera d5. Z d5 czarne naciskają na e4.'],
    example: [['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5'], ['e5', 'd4', 'f5'], 'Po 3.e5 Bf5 goniec wyszedł przed łańcuch pionów. Białe mogą spróbować zaatakować go ruchem g4.'],
    pitfall: 'Po e5 i ...Bf5 białe mogą zyskać tempo na gońcu ruchem g4. Zanim ruszysz pionem g, sprawdź też, czy osłabienie własnego króla jest warte tego tempa.',
  },
  spanish: {
    start: [['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], ['b5', 'c6', 'e5'], 'Goniec b5 atakuje skoczka c6, który broni pionka e5.'],
    example: [['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6', 'Nxe5', 'Qd4'], ['d4', 'e5', 'e4'], 'Hetman na d4 atakuje jednocześnie skoczka e5 i pionka e4.'],
    pitfall: 'Po 5.Nxe5 Qd4 białe mogą wycofać skoczka, ale wtedy czarne mogą odzyskać pionka na e4. Przed biciem sprawdź, czy przeciwnik ma ruch z podwójnym atakiem.',
  },
  sicilian: {
    start: [['e4', 'c5'], ['e4', 'c5', 'd4'], 'Piony e4 i c5 walczą o centrum. Czarne kontrolują d4 z linii c.'],
    example: [['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6'], ['f6', 'e4', 'd4'], 'Po …Nf6 skoczek naciska na e4. Białe mogą rozwinąć skoczka na c3 i jednocześnie obronić pionka.'],
    pitfall: 'Po wymianie na d4 spójrz, którą figurę czarne rozwijają z groźbą. Jeśli zagrały …Nf6, przed rozpoczęciem ataku sprawdź, czy pionek e4 ma obronę.',
  },
};

function boardLink(courseId, index, label) {
  return `<a class="btn outline opening-board-link" href="#opening/course-${courseId}-${index}/board">${label} →</a>`;
}

export function openingChapter(course, guide, diagram, e) {
  const previews = (...indices) => `<div class="opening-gif-grid">${indices.map(index => {
    const asset = e(new URL(`./opening-gifs/${course.id}-${index}`, import.meta.url).href);
    const title = e(course.variants[index].title);
    return `<figure class="opening-gif">
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcset="${asset}.png">
        <img src="${asset}.gif" alt="Szachownica — ${title}" width="192" height="212" loading="lazy" decoding="async">
      </picture>
      ${indices.length > 1 ? `<figcaption>${title}</figcaption>` : ''}
    </figure>`;
  }).join('')}</div>`;
  if (course.id === 'italian') return italianLesson(diagram, (index, label) => boardLink(course.id, index, label), course.variants, e, previews);
  const { start, example, pitfall } = diagrams[course.id];
  const study = openingStudy[course.id];
  return `<article class="opening-chapter" aria-labelledby="opening-title">
    <header class="opening-chapter-header">
      <div class="eyebrow">LEKCJA DEBIUTOWA · ECO ${e(course.eco)}</div>
      <h2 id="opening-title">${e(course.title)}</h2>
      <p>${e(guide.takeaway)}</p>
      ${boardLink(course.id, 0, 'Sprawdź debiut')}
    </header>
    <section class="opening-section">
      <h3>1. Jak powstaje ten debiut?</h3>
      <div class="opening-position"><div><p>${e(guide.idea)}</p>${previews(0)}</div>${diagram(...start)}</div>
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
        ${previews(index + 1)}
        ${boardLink(course.id, index + 1, 'Zobacz wariant na szachownicy')}
      </section>`).join('')}</div>
    </section>
    <section class="opening-section">
      <h3>4. Pułapki i jak się przed nimi bronić</h3>
      <div class="opening-position">
        <div><p>${e(guide.warning)}</p><p>${pitfall}</p></div>
        ${diagram(...example)}
      </div>
      <div class="opening-plans">${study.traps.map(([title, warning, defense, links]) => `<section>
        <h4>${e(title)}</h4>
        <p><strong>Sygnał ostrzegawczy</strong><br>${e(warning)}</p>
        <p><strong>Jak się bronić</strong><br>${e(defense)}</p>
        ${previews(...links.map(([index]) => index))}
        ${links.map(([index, label]) => boardLink(course.id, index, e(label))).join(' ')}
      </section>`).join('')}</div>
    </section>
    <section class="opening-section">
      <h3>5. Struktury pionowe i przełomy</h3>
      <div class="opening-plans">${study.structures.map(([title, explanation]) => `<section>
        <h4>${e(title)}</h4><p>${e(explanation)}</p>
      </section>`).join('')}</div>
    </section>
    <section class="opening-section">
      <h3>6. Przystanki do samodzielnej analizy</h3>
      <div class="opening-plans">${study.questions.map(([question, answer]) => `<section>
        <p>${e(question)}</p>
        <details class="opening-guide-details"><summary>Pokaż odpowiedź</summary><p>${e(answer)}</p></details>
      </section>`).join('')}</div>
    </section>
    <section class="opening-section">
      <h3>7. Jak ćwiczyć i gdzie szukać dalszych partii</h3>
      <p>${e(study.practice)}</p>
      <ul class="opening-sources">${study.sources.map(([title, url]) => `<li><a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(title)}</a></li>`).join('')}</ul>
    </section>
  </article>`;
}
