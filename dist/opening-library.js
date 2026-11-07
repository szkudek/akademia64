import { openingGuides, sicilianNotes } from './opening-guides.js';
import rows from './opening-catalog.js';
import { openingCourses } from './opening-courses.js';

export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

const aliases = {
  'Italian Game': 'Partia włoska',
  'Ruy Lopez': 'Partia hiszpańska',
  'Caro-Kann Defense': 'Obrona Caro-Kann',
  'Sicilian Defense': 'Obrona sycylijska',
  'French Defense': 'Obrona francuska',
  "Queen's Gambit Declined": 'Gambit hetmański nieprzyjęty',
  "Queen's Gambit Accepted": 'Gambit hetmański przyjęty',
  "Queen's Gambit": 'Gambit hetmański',
  'English Opening': 'Partia angielska',
  'Scotch Game': 'Partia szkocka',
  'Scandinavian Defense': 'Obrona skandynawska',
  'Slav Defense': 'Obrona słowiańska',
  'London System': 'System londyński',
  "King's Indian Defense": 'Obrona królewsko-indyjska',
  'Nimzo-Indian Defense': 'Obrona nimzoindyjska',
  'Grünfeld Defense': 'Obrona Grünfelda',
  'Catalan Opening': 'Partia katalońska',
};
const normalize = value => value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replaceAll('ł', 'l');
const polish = move => move.replace(/^[NBRQK]|(?<==)[NBRQK]/g, piece => ({ N: 'S', B: 'G', R: 'W', Q: 'H', K: 'K' })[piece]);
export const formatLine = line => line.map((move, i) => (i % 2 ? '' : Math.floor(i / 2) + 1 + '. ') + move).join(' ');

const catalog = rows.map(([eco, name, moves], index) => {
  const [family, ...variation] = name.split(': ');
  const title = [aliases[family] || family, ...variation].join(': ');
  const line = moves.split(' ');
  return {
    id: 'eco-' + index, eco, family, title, line,
    search: normalize([eco, name, title, moves, formatLine(line), formatLine(line.map(polish))].join(' ')),
  };
});
const families = [...new Set(catalog.map(item => item.family))].sort((a,b) =>
  (aliases[a] || a).localeCompare(aliases[b] || b, 'pl'));
const courseById = new Map(openingCourses.map(course => [course.id, course]));
const filters = { query: '', family: '', move: '', eco: '', page: 0 };
const pageSize = 18;
const e = escapeHTML;

export function getOpening(id, Chess) {
  const courseMatch = /^course-([a-z]+)-(\d+)$/.exec(id);
  if (courseMatch) {
    const course = courseById.get(courseMatch[1]);
    const variant = course?.variants[Number(courseMatch[2])];
    if (!variant) return null;
    const board = new Chess();
    const line = (variant.san || variant.moves).map(move => board.move(variant.san ? move : {
      from: move.slice(0, 2), to: move.slice(2, 4), promotion: move[4],
    }).san);
    const notes = course.id === 'sicilian' && !variant.san ? sicilianNotes(variant.moves) : variant.notes;
    return { ...variant, id, course, guide: openingGuides[course.id], notes, line, family: course.family, eco: variant.eco || course.eco };
  }
  if (!/^eco-\d+$/.test(id)) return null;
  const item = catalog[Number(id.slice(4))];
  if (!item) return null;
  const relatedCourse = openingCourses.find(course => course.family === item.family);
  return { ...item, relatedCourse };
}

export function focusOpeningFamily(family) {
  Object.assign(filters, { query: '', family, move: '', eco: '', page: 0 });
}

export function openingPicker(activeCourse, activeId) {
  const ecoRanges = { italian: 'C50–C59', caro: 'B10–B19', spanish: 'C60–C99', sicilian: 'B20–B99' };
  return `<header class="opening-banner">
    <h1>Biblioteka debiutów</h1>
    <p>Cztery lekcje, interaktywne warianty i quizy.</p>
  </header>
  <nav class="opening-picker" aria-labelledby="opening-picker-title">
    <h2 id="opening-picker-title">Wybierz debiut</h2>
    <div class="opening-picker-grid">${openingCourses.map(course => {
      const active = course.id === activeCourse;
      return `<a href="#opening/${active ? activeId : `course-${course.id}-0`}"${active ? ' aria-current="page"' : ''}>
        <strong>${e(course.title)}</strong><span>ECO ${ecoRanges[course.id] || e(course.eco)}</span>
      </a>`;
    }).join('')}</div>
    <p>Przeglądaj warianty na szachownicy, poznaj plany obu stron i sprawdź się w quizie.</p>
    <a class="opening-catalog-link" href="#openings/catalog">Otwórz katalog ECO →</a>
  </nav>`;
}

export function renderOpeningLibrary(root) {
  root.innerHTML = `<section class="opening-library">
    <div class="page-intro"><div class="eyebrow">AKADEMIA 64 · DEBIUTY</div>
      <h1>Biblioteka debiutów</h1><p>Zobacz, o co walczą obie strony, jak wybór wariantu zmienia plan i dlaczego wykonuje się poszczególne ruchy.</p>
    </div>
    <section class="opening-start" aria-labelledby="opening-start-title">
      <div class="section-heading"><div><div class="eyebrow">NAUKA KROK PO KROKU</div><h2 id="opening-start-title">Zacznij od lekcji</h2></div></div>
      <div class="opening-course-grid">${openingCourses.map((course, i) => `<a class="opening-course" href="#opening/course-${course.id}-0">
        <span class="opening-course-icon" aria-hidden="true">${['♝','♟','♞','♜'][i]}</span>
        <div class="eyebrow">${e(course.eco)} · ${course.variants.length} wariantów</div>
        <h3>${e(course.title)}</h3><p>${e(course.variants[0].desc)}</p><span class="opening-course-link">Otwórz lekcję →</span>
      </a>`).join('')}</div>
    </section>
    <section class="opening-index" aria-labelledby="opening-index-title">
      <div class="section-heading"><div><div class="eyebrow">KATALOG ECO · A00–E99</div><h2 id="opening-index-title">Katalog debiutów i wariantów</h2></div></div>
      <p>Tu znajdziesz zapis linii do przejrzenia na planszy. Pełne objaśnienia są dostępne w lekcjach powyżej.</p>
      <div class="opening-filter-grid">
        <label>Szukaj<input id="opening-query" type="search" placeholder="Nazwa, ECO lub ruchy, np. 1. e4 c5"></label>
        <label>Rodzina<select id="opening-family"><option value="">Wszystkie rodziny</option>${families.map(f => `<option value="${e(f)}">${e(aliases[f] || f)}</option>`).join('')}</select></label>
        <label>Pierwszy ruch<select id="opening-first"><option value="">Dowolny</option><option>e4</option><option>d4</option><option>c4</option><option>Nf3</option><option value="other">Pozostałe</option></select></label>
        <label>Tom ECO<select id="opening-eco"><option value="">A–E</option>${[...'ABCDE'].map(letter => `<option>${letter}</option>`).join('')}</select></label>
      </div>
      <p id="opening-count" class="opening-count" role="status"></p>
      <div id="opening-results" class="opening-results"></div>
      <div id="opening-pagination" class="opening-pagination"></div>
      <p class="opening-source">Nazwy i ruchy: <a href="https://github.com/lichess-org/chess-openings" target="_blank" rel="noopener">Lichess Chess Openings (CC0)</a>. Nazwy głównych debiutów podano także po polsku.</p>
    </section>
  </section>`;
  const find = id => root.querySelector('#' + id);
  const query = find('opening-query');
  const family = find('opening-family');
  const first = find('opening-first');
  const eco = find('opening-eco');
  query.value = filters.query;
  family.value = filters.family;
  first.value = filters.move;
  eco.value = filters.eco;
  function renderResults() {
    const terms = normalize(filters.query).trim().split(/\s+/).filter(Boolean);
    const found = catalog.filter(item =>
      (!filters.family || item.family === filters.family) &&
      (!filters.eco || item.eco.startsWith(filters.eco)) &&
      (!filters.move || (filters.move === 'other'
        ? !['e4', 'd4', 'c4', 'Nf3'].includes(item.line[0])
        : item.line[0] === filters.move)) &&
      terms.every(term => item.search.includes(term)));
    const pages = Math.max(1, Math.ceil(found.length / pageSize));
    filters.page = Math.min(filters.page, pages - 1);
    const start = filters.page * pageSize;
    find('opening-count').textContent = found.length
      ? `${start + 1}–${Math.min(start + pageSize, found.length)} z ${found.length.toLocaleString('pl-PL')} linii`
      : 'Nie znaleziono linii pasujących do filtrów.';
    find('opening-results').innerHTML = found.slice(start, start + pageSize).map(item => `<a class="opening-result" href="#opening/${item.id}">
      <span class="opening-eco">${e(item.eco)}</span><span class="opening-result-text"><strong>${e(item.title)}</strong>
      <span>${e(formatLine(item.line.slice(0, 8)))}${item.line.length > 8 ? ' …' : ''}</span></span><span aria-hidden="true">→</span></a>`).join('');
    const pagination = find('opening-pagination');
    pagination.innerHTML = pages > 1
      ? `<button type="button" class="btn outline" ${filters.page ? '' : 'disabled'}>← Poprzednia</button><span>Strona ${filters.page + 1} z ${pages}</span><button type="button" class="btn outline" ${filters.page + 1 < pages ? '' : 'disabled'}>Następna →</button>`
      : '';
    pagination.querySelectorAll('button').forEach((button, index) => {
      button.onclick = () => {
        filters.page += index ? 1 : -1;
        renderResults();
        find('opening-count').scrollIntoView({ block: 'nearest' });
        pagination.querySelectorAll('button')[index]?.focus({ preventScroll: true });
      };
    });
  }
  function applyFilters() {
    Object.assign(filters, { query: query.value, family: family.value, move: first.value, eco: eco.value, page: 0 });
    renderResults();
  }
  query.oninput = applyFilters;
  family.onchange = first.onchange = eco.onchange = applyFilters;
  renderResults();
  if (filters.family) find('opening-index-title').scrollIntoView({ block: 'start' });
}
