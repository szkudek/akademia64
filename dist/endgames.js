export const endgames=[
 {
  id:'mat-hetmanem',title:'Mat hetmanem',goal:'Daj mata samotnemu królowi.',
  lesson:'Hetman ogranicza przestrzeń króla przeciwnika. Stopniowo zacieśniaj obszar, a gdy król zostanie przy krawędzi, podejdź własnym królem, żeby wesprzeć mata.',
  hint:'Zostaw przeciwnikowi legalne pole, dopóki Twój król nie podejdzie. Król bez legalnego ruchu i bez szacha oznacza pat.',
  fen:'8/8/4k3/8/3Q4/4K3/8/8 w - - 0 1',objective:'mate'
 },
 {
  id:'mat-wieza',title:'Mat wieżą',goal:'Daj mata, współpracując królem i wieżą.',
  lesson:'Odetnij królowi rząd lub kolumnę wieżą i podejdź swoim królem. Gdy króle staną naprzeciw siebie z jednym wolnym polem między nimi, szach wieżą z boku odpycha przeciwnika w stronę krawędzi.',
  hint:'Chroń wieżę przed biciem. Przy krawędzi ustaw króla tak, by kontrolował pola ucieczki, i daj szacha wieżą.',
  fen:'8/8/4k3/8/8/4K3/R7/8 w - - 0 1',objective:'mate'
 },
 {
  id:'opozycja',title:'Opozycja królów',goal:'Uzyskaj bezpośrednią opozycję.',
  lesson:'Króle stoją w bezpośredniej opozycji, gdy są na jednej linii z jednym wolnym polem między nimi. Strona na ruchu musi ustąpić, jeśli pozycja wymaga ruchu królem i nie ma ruchu wyczekującego.',
  hint:'Ustaw białego króla na e4. Między królami pozostanie e5, a ruch przypadnie czarnym.',
  fen:'8/8/4k3/8/8/4K3/3P4/8 w - - 0 1',objective:'move',answers:['e3e4']
 },
 {
  id:'kwadrat-piona',title:'Kwadrat piona',goal:'Wejdź czarnym królem do kwadratu białego piona.',
  lesson:'Wyobraź sobie kwadrat od piona do pola promocji. Pion na a5 potrzebuje trzech ruchów do a8, więc kwadrat sięga do linii d. Gdy możesz wejść do kwadratu na swoim ruchu, zwykle zdążysz zatrzymać wolnego piona.',
  hint:'Król z e8 może wejść do kwadratu przez d7 albo d8.',
  fen:'4k3/8/8/P7/8/8/8/7K b - - 0 1',objective:'move',answers:['e8d7','e8d8'],side:'b'
 },
 {
  id:'promocja',title:'Król i pion przeciwko królowi',goal:'Doprowadź piona do bezpiecznej promocji na hetmana lub wieżę.',
  lesson:'Król może zająć pole przed pionem i osłonić drogę do promocji. W tej pozycji biały król na e6 chroni pole e7 i kontroluje sąsiednie pola na siódmej linii.',
  hint:'Sprawdź, czy król przeciwnika może wejść na pole promocji. Utrzymuj białego króla blisko piona.',
  fen:'8/7k/4K3/4P3/8/8/8/8 w - - 0 1',objective:'promotion'
 },
 {
  id:'wieza-za-pionem',title:'Wieża za wolnym pionem',goal:'Ustaw białą wieżę za własnym wolnym pionem.',
  lesson:'Wieża stojąca za wolnym pionem może go bronić z dużej odległości i zachować swobodę ruchu. To przydatna zasada w końcówkach wieżowych. Przed zastosowaniem sprawdź szachy i groźby przeciwnika.',
  hint:'Przenieś wieżę z b1 na a1. Będzie wspierała piona na linii a.',
  fen:'7r/6k1/P7/8/8/8/6K1/1R6 w - - 0 1',objective:'move',answers:['b1a1']
 }
];

export function endgameOutcome(position,exercise,move){
 if(exercise.objective==='move')return exercise.answers.includes(move.lan)?'success':null;
 if(position.isCheckmate())return position.turn()!==(exercise.side??'w')?'success':'lost';
 if(position.isDraw())return 'draw';
 if(exercise.objective==='promotion'&&['q','r'].includes(move.promotion)&&
  !position.moves({verbose:true}).some(reply=>reply.to===move.to))return 'success';
 return null;
}
