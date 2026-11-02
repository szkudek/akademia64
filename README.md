# Akademia 64

Polska akademia szachowa: nauka od podstaw, interaktywne ćwiczenia i spokojny trening na szachownicy.

## Aktualna wersja

- Mapa nauki: 19 lekcji w sześciu etapach.
- Sześć zadań taktycznych z podpowiedziami.
- Trzy warsztaty debiutowe: partia włoska, gambit hetmański i obrona sycylijska.
- Gra białymi z lokalnym przeciwnikiem komputerowym, podpowiedzi i cofanie ruchów.
- Odznaki i postępy zapisywane w tej przeglądarce.
- Motywy jasny, ciemny i systemowy z zapamiętywaniem wyboru.
- Układ dostosowany do komputerów i telefonów.

## Uruchomienie lokalne

Wymagany Python 3. Nie trzeba instalować zależności ani budować aplikacji.

```sh
git clone https://github.com/szkudek/akademia64.git
cd akademia64
python3 -m http.server 4173 --directory dist
```

Otwórz http://localhost:4173. Stronę należy uruchamiać przez serwer HTTP, ponieważ korzysta z modułów JavaScript.

Z Node.js można sprawdzić składnię poleceniem `npm run check`.

## Struktura

- `dist/index.html` — główny układ i nawigacja.
- `dist/styles.css` — wygląd, układ responsywny i motywy.
- `dist/app.js` — lekcje, zadania, debiuty i gra.
- `dist/theme.js` — wybór motywu i ustawienia systemowe.
- `dist/vendor/` — lokalna kopia chess.js i jej licencja.

`dist/` zawiera gotową statyczną stronę. Nie jest generowanym katalogiem kompilacji — tutaj edytujemy pliki aplikacji.

## Dane i ograniczenia

Postępy i wybór motywu są zapisywane w localStorage. Nie ma kont, synchronizacji między urządzeniami ani generatywnego trenera AI. Komputer korzysta z prostego wyszukiwania minimax i oceny materiału. Legalność ruchów sprawdza chess.js 1.4.0, udostępnione na licencji BSD-2-Clause w `dist/vendor/LICENSE-chess.txt`.

## Repozytorium

Głównym repozytorium kodu jest https://github.com/szkudek/akademia64.

Katalog `dist/` można opublikować na hostingu obsługującym statyczne strony. Sam zapis zmian w tym repozytorium nie uruchamia publikacji.
