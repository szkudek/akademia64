# Akademia 64

Polska akademia szachowa: interaktywne lekcje, zadania taktyczne, debiuty, gra z komputerem i osobiste postępy.

## Uruchomienie z kontami

Wymagany **Node.js 24 lub nowszy**. Aplikacja nie wymaga instalowania paczek.

```sh
git clone https://github.com/szkudek/akademia64.git
cd akademia64
npm start
```

Otwórz **http://127.0.0.1:4173**. Ten serwer obsługuje zarówno stronę, jak i konta. Sama statyczna strona lub GitHub Pages nie obsługuje logowania.

## Konta

- Rejestracja: nazwa użytkownika, e-mail i hasło o długości minimum 12 znaków.
- Logowanie, wylogowanie oraz automatyczne odtworzenie sesji przez 7 dni.
- Jednorazowy kod ratunkowy pozwala zmienić hasło. Nowy kod zastępuje poprzedni, a reset wylogowuje wszystkie sesje.
- Hasła są haszowane przez scrypt z losową solą. W bazie znajdują się wyłącznie skróty haseł, kodów odzyskiwania i tokenów sesji.
- Sesje korzystają z ciasteczek HttpOnly i SameSite=Strict, a w produkcji dodatkowo Secure.
- Dane użytkowników zapisuje SQLite w `data/academy.sqlite`. Katalog `data/` nie trafia do repozytorium ani do publicznego katalogu strony.
- Próby logowania, zakładania kont i odzyskiwania są ograniczane po stronie serwera.
- Postępy są powiązane z kontem; użytkownik może świadomie połączyć z nimi postępy gościa.
- Przy utracie połączenia ostatni postęp pozostaje w lokalnym cache przypisanym do konkretnego konta. Ponowny login lub powrót połączenia uruchamia zapis.

**Odzyskiwanie przez e-mail, weryfikacja adresu oraz logowanie Google nie są jeszcze podłączone.** Nie wysyłamy żadnych e-maili. Kod ratunkowy trzeba zachować; bez hasła i kodu ta wersja nie zapewnia samodzielnego odzyskania konta.

## Przed publicznym uruchomieniem kont

Ta gałąź przygotowuje pełną wersję lokalną. Do wdrożenia potrzebny jest serwer Node.js z trwałym dyskiem dla SQLite oraz HTTPS — GitHub Pages pozostaje statycznym podglądem.

Ustawienia środowiska:

```sh
NODE_ENV=production \
APP_ORIGIN=https://twoja-domena.example \
DATABASE_PATH=/trwaly-dysk/academy.sqlite \
HOST=0.0.0.0 \
PORT=4173 \
node server/start.mjs
```

`APP_ORIGIN` musi być dokładnym adresem origin strony (bez końcowego ukośnika). Nie ustawiaj produkcji pod zwykłym HTTP — ciasteczka Secure wymagają HTTPS. Serwer nie ufa nagłówkom X-Forwarded-For; za odwrotnym proxy limit prób jest współdzielony dla jego adresu IP. Przed większym ruchem potrzebna będzie konfiguracja limitów na zaufanym proxy.

Przed udostępnieniem kont należy ustalić obsługę poczty i weryfikacji adresów, kopie zapasowe bazy oraz zasady prywatności i usuwania kont. Uprawnienia do bazy i jej kopii powinny być ograniczone do właściciela aplikacji.

## Sprawdzanie zmian

```sh
npm run check
npm test
npm run sync:entry
```

Testy sprawdzają rejestrację, sesje, rozdzielenie danych użytkowników, utratę dostępu po wylogowaniu i resecie, jednorazowe kody ratunkowe, ograniczanie prób, ochronę przed żądaniami z obcej domeny oraz trwałość bazy po restarcie.

Po zmianie `dist/index.html` uruchom `npm run sync:entry` — aktualizuje wejściowy plik w katalogu głównym, używany przez publikację z gałęzi GitHub Pages.

## Podgląd statyczny

```sh
npm run start:static
```

Statyczny podgląd zachowuje naukę gościa. Gdy serwer kont jest niedostępny, interfejs informuje o tym i nie udaje rejestracji.

## Zawartość

- 19 lekcji w sześciu etapach.
- Sześć zadań z podpowiedziami.
- Trzy debiuty do poznania i przećwiczenia.
- Lokalny przeciwnik komputerowy, wskazówki i cofanie ruchów.
- Odznaki, mapa nauki i trzy motywy wyglądu.

Kod aplikacji znajduje się w `dist/`, serwer kont w `server/`, a testy w `test/`. `dist/` jest edytowanym źródłem strony, nie wynikiem kompilacji. Legalność ruchów sprawdza chess.js 1.4.0 na licencji BSD-2-Clause (`dist/vendor/LICENSE-chess.txt`).
