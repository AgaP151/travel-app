# Social Trip Planner / travel-app

Aplikacja webowa do planowania podróży wykonana jako projekt zaliczeniowy. System umożliwia rejestrację i logowanie użytkowników, tworzenie własnych podróży, korzystanie z publicznych inspiracji oraz pobieranie dodatkowych informacji o kierunku podróży.

## Wdrożona aplikacja

* Frontend: https://travel-app-mocha-delta.vercel.app
* Backend API: https://travel-app-api-lzua.onrender.com

Uwaga: wejście na główny adres backendu może zwracać `403 Forbidden`, ponieważ endpointy są zabezpieczone przez Spring Security.

## Technologie

* Frontend: React, Vite, JavaScript, SCSS, React Router, i18next
* Backend: Java 17, Spring Boot, Spring MVC, Spring Security, JWT
* Baza danych: PostgreSQL, Flyway
* ORM: JPA/Hibernate
* Cache: Spring Cache
* Deployment: Vercel, Render
* Dependency manager: Maven, npm

## Najważniejsze funkcje

* rejestracja i logowanie użytkownika,
* uwierzytelnianie JWT,
* tworzenie, wyświetlanie i usuwanie podróży,
* publiczne inspiracje podróżnicze,
* kopiowanie inspiracji do własnych podróży,
* lista uczestników podróży,
* checklista zadań,
* przełączanie języka PL/EN,
* przełączanie motywu jasnego/ciemnego,
* responsywny interfejs,
* integracja z zewnętrznymi API: zdjęcia, pogoda, waluty.

## Uruchomienie lokalne

### 1. Baza danych

W katalogu głównym projektu:

```bash
docker compose up -d
```

Nie używać `docker compose down -v`, jeśli lokalne dane w bazie mają zostać zachowane.

### 2. Backend

Backend korzysta z pliku `backend/.env`, który nie jest commitowany do repozytorium.

Przykładowe zmienne:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/travel_app
SPRING_DATASOURCE_USERNAME=travel_user
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_long_jwt_secret
PEXELS_API_KEY=your_pexels_key
WEATHER_API_KEY=your_weather_key
CURRENCY_API_KEY=your_currency_key
```

Uruchomienie backendu:

```bash
./run-backend.sh
```

Backend lokalnie działa pod adresem:

```text
http://localhost:8080
```

### 3. Frontend

W katalogu `frontend`:

```bash
npm install
npm run dev
```

Frontend lokalnie działa pod adresem:

```text
http://localhost:5173
```

Przykładowe ustawienie `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Na produkcji:

```env
VITE_API_URL=https://travel-app-api-lzua.onrender.com/api
```

## Dokumentacja projektu

Szczegółowe sprawozdanie projektowe znajduje się w pliku PDF przygotowanym w LaTeX.


