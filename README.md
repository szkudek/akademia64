# Akademia 64

Interaktywna akademia szachowa: 19 lekcji, sześć zadań, trzy debiuty, trening z komputerem, mapa nauki i odznaki. Trzy motywy: jasny, ciemny oraz systemowy.

## Uruchomienie

Aplikacja jest statyczna. Konta obsługuje Firebase Authentication, a postępy Cloud Firestore. Nie jest potrzebny własny serwer kont ani płatny plan Firebase.

```sh
git clone https://github.com/szkudek/akademia64.git
cd akademia64
npm start
```

Wymagany Node.js 20+. Podgląd: http://127.0.0.1:4173. Można również użyć `python3 -m http.server 4173 --directory dist`.

Projekt Firebase używany wyłącznie przez tę aplikację: **akademia64-89e49**. Konfiguracja klienta jest w `dist/firebase-config.js`. To publiczne identyfikatory aplikacji webowej; dostęp do danych kontrolują reguły Firestore. Nie należy tu umieszczać kont serwisowych, kluczy prywatnych ani danych administratora.

## Konfiguracja projektu Firebase

1. Authentication → Sign-in method: włącz **Email/Password**. Google pozostaje wyłączone.
2. Authentication → Settings → Authorized domains: dodaj **szkudek.github.io**. Do testów dodaj **localhost** i **127.0.0.1**, jeśli nie występują na liście. Wpisuj same nazwy hostów, bez protokołu i ścieżki.
3. Firestore Database: utwórz domyślną bazę **Standard edition** w wybranej lokalizacji europejskiej, w trybie produkcyjnym.
4. Firestore Database → Rules: wklej zawartość pliku [`firestore.rules`](firestore.rules) i kliknij **Publish**. Sama obecność pliku w repozytorium nie aktualizuje reguł w chmurze.
5. Authentication → Settings → Password policy: ustaw minimalną długość hasła **12 znaków** w trybie wymuszania. Formularz ma ten sam limit, ale polityka po stronie Firebase zapobiega jego pominięciu.
6. Authentication → Settings: włącz ochronę przed ujawnianiem istnienia adresów e-mail, jeśli nie jest aktywna.
7. Authentication → Templates: sprawdź nazwę nadawcy i polskie szablony wiadomości potwierdzenia oraz resetowania hasła.

Alternatywnie właściciel projektu może opublikować reguły po lokalnym zalogowaniu w oficjalnym Firebase CLI:

```sh
firebase login
firebase deploy --only firestore:rules --project akademia64-89e49
```

Polecenie ma jawnie wskazany projekt Akademii. Nie dotyczy innych projektów na koncie. Konfiguracja `.firebaserc` wskazuje ten sam identyfikator.

## Jak działają konta

- Rejestracja: nazwa, e-mail i hasło. Hasłami zarządza Firebase — aplikacja nie zapisuje ich w przeglądarce ani we własnej bazie.
- Po rejestracji użytkownik klika w profilu **Wyślij link potwierdzający**. Po otwarciu linku z poczty wraca do profilu i klika **Adres już potwierdzony — sprawdź**.
- Synchronizacja z Firestore jest dozwolona dopiero po weryfikacji e-maila. Do tego czasu można normalnie się uczyć; postępy zostają w lokalnym cache przypisanym do tego konta.
- Reset hasła korzysta ze standardowej wiadomości Firebase, bez wcześniejszych kodów ratunkowych.
- Sesja jest odtwarzana przez Firebase SDK. Wylogowanie i zmiana konta rozdzielają lokalne cache użytkowników.
- Postępy gościa pozostają osobno. Przy zweryfikowanym koncie użytkownik może je przenieść przyciskiem w profilu.
- Synchronizacja łączy ukończone lekcje, zadania i dni aktywności w transakcji. Liczba ukończonych partii jest łączona przez maksimum; równoczesne partie na dwóch urządzeniach mogą zostać policzone jako jedna.
- Zapis jest opóźniony o 900 ms i wykonywany po zmianach, aby ograniczyć zużycie darmowego limitu. Nie pobieramy całych kolekcji i nie utrzymujemy stałych nasłuchów Firestore.

Dokument użytkownika: `users/{uid}/progress/main`. Reguły pozwalają czytać i zmieniać wyłącznie własny dokument po potwierdzeniu e-maila. Pozostałe ścieżki są domyślnie zablokowane. Metadane profilu (nazwa i e-mail) są w Authentication; nie tworzymy publicznego katalogu użytkowników.

Bez internetu nadal działa nauka gościa i lokalny zapis. Do zalogowania oraz synchronizacji potrzebne jest połączenie z Firebase i dostęp do oficjalnego CDN `www.gstatic.com`. Jeśli wczytanie SDK się nie powiedzie, przycisk logowania umożliwia ponowną próbę.

Dotychczasowe lokalne konta SQLite były wersją rozwojową i nie są automatycznie migrowane do Firebase. Postępy gościa można zaimportować przez profil.

## Sprawdzanie zmian

```sh
npm run check
npm test
npm run sync:entry
```

Testy adaptera Firebase korzystają z izolowanych atrap SDK: sprawdzają rejestrację, weryfikację, reset, wylogowanie, izolację kont, wyścig zmiany sesji podczas transakcji i łączenie postępów. Nie tworzą kont w prawdziwym projekcie i nie wysyłają wiadomości.

Reguły w `firestore.rules` wymagają publikacji w projekcie. Testy z atrapami nie zastępują testu reguł na emulatorze Firebase ani sprawdzenia rejestracji i weryfikacji prawdziwego adresu przed publicznym startem.

## Pliki i publikacja

- `dist/index.html` — układ aplikacji.
- `dist/styles.css` — wygląd i motywy.
- `dist/app.js` — lekcje, zadania i gra.
- `dist/accounts.js` — formularze kont i obsługa zapisu.
- `dist/firebase-service.js` — adapter Authentication i Firestore; SDK 13.1.0 z oficjalnego CDN Google.
- `dist/progress.js` — normalizacja i łączenie postępów.
- `server/` — opcjonalny lokalny serwer statyczny; nie przechowuje kont.
- `test/` — testy automatyczne.

`dist/` jest edytowanym źródłem aplikacji. Po zmianie `dist/index.html` uruchom `npm run sync:entry`, aby zaktualizować wejście w katalogu głównym używane przez GitHub Pages przy publikacji z gałęzi. Workflow Pages publikuje sam katalog `dist/`.

Firebase Authentication i Firestore działają również z GitHub Pages po publikacji aplikacji i konfiguracji chmury. Nie wymaga to przenoszenia strony na inny hosting. Google Sign-In pozostaje kolejnym etapem.

Legalność ruchów sprawdza chess.js 1.4.0, licencja BSD-2-Clause w `dist/vendor/LICENSE-chess.txt`.
