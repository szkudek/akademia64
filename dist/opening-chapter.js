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

// Add approved materials here with title, description, author, channel, channelHandle,
// youtubeId, level, and optional duration or thumbnail size.
const videosByCourse = {
  italian: [{
    youtubeId: 's6xm8u8M54c',
    title: 'Partia Włoska w 15 minut!',
    description: 'Poradnik do partii włoskiej.',
    author: 'DawidCzerwTV',
    channel: 'DawidCzerwTV',
    channelHandle: 'DawidCzerwTV',
    thumbnail: 'maxresdefault',
    level: 'Podstawy',
  }, {
    youtubeId: 'OemMy40ovTQ',
    title: 'PARTIA WŁOSKA - Debiuty szachowe w 10 minut! Szachy Dla Początkujących | Michał Kanarkiewicz',
    description: 'Wprowadzenie do partii włoskiej dla początkujących.',
    author: 'Michał Kanarkiewicz',
    channel: 'Michał Kanarkiewicz Podcast',
    channelHandle: 'MichalKanarkiewicz',
    thumbnail: 'maxresdefault',
    level: 'Podstawy',
  }, {
    youtubeId: 'JK0-YsASkes',
    title: 'DEBIUTY 2.0 | #1 -  PARTIA WŁOSKA',
    description: 'Odcinek o partii włoskiej z serii Debiuty 2.0.',
    author: 'Marianczello Dominoni',
    channel: 'Marianczello Dominoni',
    channelHandle: 'MarianczelloDominoni',
    thumbnail: 'maxresdefault',
    level: 'Podstawy',
  }],
  caro: [{
    youtubeId: 'WIhh3C-VsTQ',
    title: 'PROSTE i SKUTECZNE debiuty szachowe - Obrona Caro-Kann #1',
    description: 'Pierwsza część poradnika AntonChess o obronie Caro-Kann.',
    author: 'AntonChess',
    channel: 'AntonChess',
    channelHandle: 'antonchess',
    thumbnail: 'maxresdefault',
    level: 'Podstawy',
    youtubeOnly: true,
  }, {
    youtubeId: 'O4YPLdbXArc',
    title: 'Szachy z Dawidem: Caro-kann w 15 minut!',
    description: 'Wprowadzenie do obrony Caro-Kann z serii „Szachy z Dawidem”.',
    author: 'DawidCzerwTV',
    channel: 'Chess.com: Polska',
    channelHandle: 'chesscomPL',
    level: 'Podstawy',
    start: 72,
  }, {
    youtubeId: 'jWLyBDsefZE',
    title: 'Sekrety w Caro-Kannie! || Debiut w 30 minut #1',
    description: 'Pierwszy odcinek serii „Debiut w 30 minut” poświęcony obronie Caro-Kann.',
    author: 'EliteChessTeam',
    channel: 'EliteChessTeam',
    channelHandle: 'EliteChessTeam',
    thumbnail: 'maxresdefault',
    level: 'Warianty i plany',
    start: 30,
  }, {
    youtubeId: '0aYYe7lAlgc',
    title: 'DEBIUTY 2.0 | #9 - Obrona Caro-Kann',
    description: 'Odcinek o obronie Caro-Kann z serii Debiuty 2.0.',
    author: 'Marianczello Dominoni',
    channel: 'Marianczello Dominoni',
    channelHandle: 'MarianczelloDominoni',
    thumbnail: 'maxresdefault',
    level: 'Warianty i plany',
    start: 149,
  }, {
    youtubeId: 'x9V4pzpfXEc',
    title: 'GRAM OBRONĘ CARO-KANN!',
    description: 'Przykład gry obroną Caro-Kann w praktyce.',
    author: 'DawidCzerwTV',
    channel: 'DawidCzerwTV',
    channelHandle: 'DawidCzerwTV',
    thumbnail: 'maxresdefault',
    level: 'Praktyka',
  }],
};

function videoThumbnail(video) {
  const id = encodeURIComponent(video.youtubeId);
  const size = encodeURIComponent(video.thumbnail ?? 'mqdefault');
  return `https://i.ytimg.com/vi/${id}/${size}.jpg`;
}

function videoCard(video, e, index) {
  const id = encodeURIComponent(video.youtubeId);
  const title = e(video.title);
  const channel = video.channelHandle
    ? `<a href="https://www.youtube.com/@${encodeURIComponent(video.channelHandle.replace(/^@/, ''))}" target="_blank" rel="noopener noreferrer">${e(video.channel)}</a>`
    : e(video.channel);
  const start = video.start ? encodeURIComponent(video.start) : '';
  const watchUrl = `https://www.youtube.com/watch?v=${id}${start ? `&amp;t=${start}s` : ''}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ''}`;
  const cover = `<span class="opening-video-cover">
    <img src="${videoThumbnail(video)}" alt="" loading="lazy" referrerpolicy="no-referrer">
    <span class="opening-video-play" aria-hidden="true">▶</span>
  </span>`;
  const player = `<template><iframe class="opening-video-player" src="${embedUrl}" title="${title}" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></template><div class="opening-video-player-host"></div>`;
  return `<section class="opening-video-feature" id="opening-video-${index}"${index ? ' hidden' : ''}>
    ${video.youtubeOnly ? `<a class="opening-video-youtube-link" href="${watchUrl}" target="_blank" rel="noopener noreferrer">
      ${cover}
      <span class="opening-video-demo-label">Obejrzyj na YouTube ↗</span>
    </a>` : `<details class="opening-video-demo" data-youtube-player>
      <summary>
        ${cover}
        <span class="opening-video-demo-label">Pokaż odtwarzacz YouTube</span>
      </summary>
      ${player}
    </details>`}
    <div class="opening-video-copy">
      <div class="opening-video-badges">
        <span>YouTube</span>
        <span>${e(video.level)}</span>
        ${video.duration ? `<span>${e(video.duration)}</span>` : ''}
      </div>
      <h4>${title}</h4>
      <p>${e(video.description)}</p>
      <dl class="opening-video-credits">
        <div><dt>Autor</dt><dd>${e(video.author)}</dd></div>
        <div><dt>Kanał YouTube</dt><dd>${channel}</dd></div>
      </dl>
      ${video.youtubeOnly ? '' : `<a class="btn outline" href="${watchUrl}" target="_blank" rel="noopener noreferrer">Otwórz oryginał na YouTube ↗</a>`}
    </div>
  </section>`;
}

function videoPlaylist(videos, e) {
  return `<details class="opening-video-playlist" open>
    <summary>Inne materiały wideo <span>(${videos.length})</span></summary>
    <ol>${videos.map((video, index) => `<li>
      <button type="button" class="opening-video-choice" aria-controls="opening-video-${index}"${index ? '' : ' aria-current="true"'}>
        <img class="opening-video-thumb" src="${videoThumbnail(video)}" alt="" width="96" height="54" loading="lazy" referrerpolicy="no-referrer">
        <span><strong>${e(video.title)}</strong><small>${e(video.channel)}${video.duration ? ` · ${e(video.duration)}` : ''}</small></span>
      </button>
    </li>`).join('')}</ol>
  </details>`;
}

function videoPreview(course, e) {
  const videos = videosByCourse[course.id] ?? [];
  return `<section class="opening-section opening-videos" aria-labelledby="opening-videos-title">
    <div class="eyebrow">MATERIAŁY UZUPEŁNIAJĄCE</div>
    <h3 id="opening-videos-title">Poradniki wideo</h3>
    ${videos.length ? `<div class="opening-video-grid${videos.length > 1 ? ' opening-video-grid-with-playlist' : ''}">
      <div class="opening-video-stage">${videos.map((video, index) => videoCard(video, e, index)).join('')}</div>
      ${videos.length > 1 ? videoPlaylist(videos, e) : ''}
    </div>`
      : '<p>Poradniki wideo do tego debiutu pojawią się tutaj.</p>'}
  </section>`;
}

export function openingChapter(course, guide, diagram, e) {
  const previews = (...indices) => `<div class="opening-gif-grid">${indices.map(index => {
    const title = e(course.variants[index].title);
    return `<figure class="opening-gif">
      <div class="opening-preview" role="img" data-opening-preview="course-${e(course.id)}-${index}" aria-label="Szachownica — ${title}">
        <div class="opening-preview-board"></div>
        <div class="opening-preview-move" aria-hidden="true"></div>
      </div>
      ${indices.length > 1 ? `<figcaption>${title}</figcaption>` : ''}
    </figure>`;
  }).join('')}</div>`;
  const videos = videoPreview(course, e);
  if (course.id === 'italian') return italianLesson(diagram, (index, label) => boardLink(course.id, index, label), course.variants, e, previews, videos);
  const { start, example, pitfall } = diagrams[course.id];
  const study = openingStudy[course.id];
  return `<article class="opening-chapter" aria-labelledby="opening-title">
    <header class="opening-chapter-header">
      <div class="eyebrow">LEKCJA DEBIUTOWA · ECO ${e(course.eco)}</div>
      <h2 id="opening-title">${e(course.title)}</h2>
      <p>${e(guide.takeaway)}</p>
      ${boardLink(course.id, 0, 'Sprawdź debiut')}
    </header>
    ${videos}
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
