const pieces={
p:`<ellipse cx="50" cy="78" rx="23" ry="5"/><path d="M35 73 L40 49 Q35 42 37 35 Q40 27 50 27 Q60 27 63 35 Q65 42 60 49 L65 73 Z"/><circle cx="50" cy="24" r="12"/><path d="M34 73 H66 M38 56 H62"/>`,
r:`<path d="M27 25 H36 V34 H44 V25 H56 V34 H64 V25 H73 V43 H67 L64 71 H72 V79 H28 V71 H36 L33 43 H27 Z"/><path d="M32 43 H68 M36 70 H64 M33 77 H67"/>`,
n:`<path d="M29 76 H72 V69 H64 Q64 57 69 49 Q67 42 61 38 Q56 30 52 22 Q40 15 32 23 L25 39 L18 46 Q17 50 23 54 Q29 55 34 51 L41 47 Q46 54 40 67 H29 Z"/><circle cx="45" cy="30" r="2.8" class="eye"/><path d="M28 41 L40 40 M29 69 H68 M29 76 H72"/>`,
b:`<path d="M31 76 H69 V69 H63 L60 60 Q67 52 62 41 Q59 34 54 31 Q61 22 50 18 Q39 22 46 31 Q38 36 37 43 Q33 52 40 60 L37 69 H31 Z"/><path d="M42 34 L59 51 M37 60 H63 M34 69 H66 M31 76 H69"/><circle cx="50" cy="20" r="3"/>`,
q:`<path d="M29 68 L22 33 L39 48 L50 23 L61 48 L78 33 L71 68 Z"/><circle cx="20" cy="30" r="5"/><circle cx="50" cy="19" r="5"/><circle cx="80" cy="30" r="5"/><path d="M28 67 H72 V76 H28 Z M33 61 H67"/>`,
k:`<path d="M48 12 H52 V22 H62 V26 H52 V34 H48 V26 H38 V22 H48 Z"/><path d="M35 72 Q27 55 34 42 Q38 35 44 35 H56 Q64 35 66 43 Q73 55 65 72 Z"/><path d="M29 72 H71 V79 H29 Z M35 49 H65 M36 70 H64"/>`
};
const pieceCache={};
export function svgPiece(letter){if(pieceCache[letter])return pieceCache[letter];const white=letter===letter.toUpperCase(),shape=pieces[letter.toLowerCase()];const fill=white?'#f8f8ec':'#27302f',stroke=white?'#333e38':'#e8e5d6';const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><g fill="${fill}" stroke="${stroke}" stroke-width="${white?3.6:2.25}" stroke-linecap="round" stroke-linejoin="round">${shape}</g></svg>`;return pieceCache[letter]=svg}
