const shapes = {
  p: '<path d="M13 36h22l-3-6c-3-3-4-6-4-10a7 7 0 1 0-8 0c0 4-1 7-4 10z"/>',
  n: '<path d="M10 35h27c0-13-4-22-13-25l-3-5-2 7L8 23l4 6 9-5c-1 5-5 8-11 11z"/><circle cx="22" cy="16" r="1.4" fill="var(--piece-detail)" stroke="none"/>',
  b: '<path d="M14 36h20l-3-7c4-3 4-7 1-11l-8-9-8 9c-3 4-3 8 1 11z"/><circle cx="24" cy="7" r="3"/><path d="m27 15-6 8M17 29h14" fill="none" stroke="var(--piece-detail)"/>',
  r: '<path d="M11 36h26l-5-7V19l4-5V7h-7v6h-3V7h-4v6h-3V7h-7v7l4 5v10z"/><path d="M16 19h16M16 29h16" fill="none" stroke="var(--piece-detail)"/>',
  q: '<path d="m13 34 2-7L9 12l10 9 5-12 5 12 10-9-6 15 2 7z"/><circle cx="9" cy="10" r="3"/><circle cx="24" cy="7" r="3"/><circle cx="39" cy="10" r="3"/><path d="M15 27h18" stroke="var(--piece-detail)"/>',
  k: '<path d="M24 4v10m-5-6h10" fill="none" stroke="var(--piece-detail)"/><path d="M14 35h20l-1-8c12-12-2-18-9-9-7-9-21-3-9 9z"/><path d="M24 18v9m-9 0h18" fill="none" stroke="var(--piece-detail)"/>',
};

export function openingPiece({ type, color }) {
  return `<span class="piece opening-piece ${color === 'w' ? 'white' : ''}" aria-hidden="true">
    <svg viewBox="0 0 48 48" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" focusable="false">
      ${shapes[type]}
      <path d="M13 35h22l4 5v3H9v-3z"/>
      <path d="M12 40h24" fill="none" stroke="var(--piece-detail)"/>
    </svg>
  </span>`;
}
