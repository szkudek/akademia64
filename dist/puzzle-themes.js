export const puzzleThemes = Object.freeze({
 mate:'Mat', mateIn1:'Mat w 1', mateIn2:'Mat w 2', mateIn3:'Mat w 3',
 fork:'Widełki', pin:'Związanie', skewer:'Rentgen', discoveredAttack:'Atak z odsłony',
 endgame:'Końcówka', sacrifice:'Poświęcenie', hangingPiece:'Niebroniona figura',
 defensiveMove:'Obrona', promotion:'Promocja', trappedPiece:'Uwięziona figura',
 backRankMate:'Mat na ostatniej linii', doubleCheck:'Podwójny szach'
});

export function cleanPuzzleThemes(themes){
 if(!Array.isArray(themes))return [];
 return [...new Set(themes.filter(theme=>typeof theme==='string'&&Object.hasOwn(puzzleThemes,theme)))].sort();
}

export function summarizePuzzleThemes(attempts,knownPuzzles){
 const stats=new Map();
 let unclassified=0;
 for(const attempt of attempts){
  const themes=attempt.themes??knownPuzzles.get(attempt.id)?.themes??[];
  if(!themes.length)unclassified++;
  for(const theme of themes){
   const row=stats.get(theme)??{theme,total:0,correct:0};
   row.total++;
   if(attempt.ok)row.correct++;
   stats.set(theme,row);
  }
 }
 const rows=[...stats.values()].sort((a,b)=>a.correct/a.total-b.correct/b.total||b.total-a.total||a.theme.localeCompare(b.theme));
 return {rows,unclassified,recommended:rows.find(row=>row.total>=3&&row.correct/row.total<0.7)?.theme};
}
