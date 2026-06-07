import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        auth: {
          loginTitle: "Welcome back",
          loginSubtitle: "Log in to continue planning your trip.",
          fillAllFields: "Please fill in all fields.",
          email: "Email",
          password: "Password",
          loginButton: "Log in",
          loginLink: "Log in",
          noAccount: "Don't have an account?",
          createOne: "Create one",
          registerTitle: "Create account",
          registerSubtitle: "Sign up to start planning your trip.",
          name: "Name",
          registerButton: "Create account",
          hasAccount: "Already have an account?",
          loginImageTitle: "Explore smarter",
          loginImageSubtitle:
            "Plan your next journey with weather, budget and local tips.",
          registerImageTitle: "Start your journey",
          registerImageSubtitle:
            "Create an account and plan trips with weather, budget and local tips.",
          namePlaceholder: "Your name",
          emailPlaceholder: "your@example.com",
          loginError: "Could not log in.",
        },
        dashboard: {
          heroSubtitle: "Discover amazing places",
          heroTitleStart: "Where to",
          heroTitleHighlight: "next?",
          heroDescription: "Plan your next journey and manage your trips.",

          loggedAs: "Logged in as",

          travelInspirations: "Travel inspirations",
          noInspirations: "No travel inspirations.",
          inspiration: "Inspiration",
          addToMyTrips: "Add to my trips",
          tripCopied: "Inspiration added to your trips.",
          couldNotCopyTrip: "Could not add inspiration.",

          addNewTrip: "Add new trip",
          addTrip: "Add trip",
          title: "Title",
          tripTitle: "Trip title",
          destination: "Destination",
          description: "Description",
          price: "Price",
          date: "Date",
          noDate: "No date",
          invalidDateRange: "End date cannot be earlier than start date.",

          yourTrips: "Your trips",
          noTrips: "No trips yet.",
          delete: "Delete",

          loadingDetails: "Loading destination details...",
          couldNotLoadDetails: "Could not load destination details.",

          currentWeather: "Current weather",
          temperature: "Temperature",
          humidity: "Humidity",
          windSpeed: "Wind speed",
          weatherDescription: "Description",
          longTermForecastUnavailable:
            "Long-term forecast for the trip date is unavailable. Showing the nearest available forecast.",

          currencyRates: "Currency rates (PLN)",

          inviteUser: "Invite user to this trip",
          userEmail: "User email",
          invite: "Invite",
          remove: "Remove",
          copyTripBeforeInvite: "Add this inspiration to your trips first.",

          checklist: "Trip checklist / packing list",
          tripChecklist: "Trip checklist / packing list",
          addTaskPlaceholder: "Add item to pack or task...",
          add: "Add",
          noTasks: "No tasks for this trip yet. Add some above.",
          copyTripBeforeTasks:
            "This is a public inspiration. Add it to your trips to edit the checklist.",

          adminPanel: "Admin panel",
          noUsers: "No users found.",
          couldNotLoadUsers: "Could not load users.",

          couldNotLoadTrips: "Could not load trips.",
          requiredTripFields: "Title, destination and price are required.",
          couldNotAddTrip: "Could not add trip.",
          couldNotDeleteTrip: "Could not delete trip.",
          couldNotAddTask: "Could not add task.",
          couldNotUpdateTask: "Could not update task status.",
          userInvited: "User invited to trip.",
          couldNotInvite: "Could not invite user.",
          userRemoved: "User removed from trip.",
          couldNotRemove: "Could not remove user from trip.",

          logout: "Log out",
        },
      },
    },

    pl: {
      translation: {
        auth: {
          loginTitle: "Witaj ponownie",
          loginSubtitle: "Zaloguj się, aby kontynuować planowanie podróży.",
          fillAllFields: "Uzupełnij wszystkie pola.",
          email: "Email",
          password: "Hasło",
          loginButton: "Zaloguj się",
          loginLink: "Zaloguj się",
          noAccount: "Nie masz konta?",
          createOne: "Utwórz konto",
          registerTitle: "Utwórz konto",
          registerSubtitle:
            "Zarejestruj się, aby rozpocząć planowanie podróży.",
          name: "Imię",
          registerButton: "Utwórz konto",
          hasAccount: "Masz już konto?",
          loginImageTitle: "Odkrywaj sprytniej",
          loginImageSubtitle:
            "Planuj podróże z pogodą, budżetem i lokalnymi wskazówkami.",
          registerImageTitle: "Rozpocznij podróż",
          registerImageSubtitle:
            "Utwórz konto i planuj podróże z pogodą, budżetem i lokalnymi wskazówkami.",
          namePlaceholder: "Twoje imię",
          emailPlaceholder: "twoj@email.com",
          loginError: "Nie udało się zalogować.",
        },
        dashboard: {
          heroSubtitle: "Odkrywaj wyjątkowe miejsca",
          heroTitleStart: "Dokąd",
          heroTitleHighlight: "teraz?",
          heroDescription:
            "Zaplanuj kolejną podróż i zarządzaj swoimi wyjazdami.",

          loggedAs: "Zalogowano jako",

          travelInspirations: "Inspiracje podróżnicze",
          noInspirations: "Brak inspiracji podróżniczych.",
          inspiration: "Inspiracja",
          addToMyTrips: "Dodaj do moich podróży",
          tripCopied: "Dodano inspirację do Twoich podróży.",
          couldNotCopyTrip: "Nie udało się dodać inspiracji.",

          addNewTrip: "Dodaj nową podróż",
          addTrip: "Dodaj podróż",
          title: "Tytuł",
          tripTitle: "Tytuł podróży",
          destination: "Cel podróży",
          description: "Opis",
          price: "Cena",
          date: "Termin",
          noDate: "Brak terminu",
          invalidDateRange:
            "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.",

          yourTrips: "Twoje podróże",
          noTrips: "Nie masz jeszcze podróży.",
          delete: "Usuń",

          loadingDetails: "Ładowanie szczegółów miejsca...",
          couldNotLoadDetails: "Nie udało się załadować szczegółów miejsca.",

          currentWeather: "Aktualna pogoda",
          temperature: "Temperatura",
          humidity: "Wilgotność",
          windSpeed: "Prędkość wiatru",
          weatherDescription: "Opis",
          longTermForecastUnavailable:
            "Prognoza długoterminowa dla terminu podróży jest niedostępna. Pokazujemy najbliższą dostępną prognozę.",

          currencyRates: "Kursy walut (PLN)",

          inviteUser: "Zaproś użytkownika do tej podróży",
          userEmail: "Email użytkownika",
          invite: "Zaproś",
          remove: "Usuń",
          copyTripBeforeInvite:
            "Najpierw dodaj inspirację do swoich podróży.",

          checklist: "Lista zadań podróży / lista pakowania",
          tripChecklist: "Lista zadań podróży / lista pakowania",
          addTaskPlaceholder: "Dodaj rzecz do spakowania albo zadanie...",
          add: "Dodaj",
          noTasks: "Brak zadań dla tej podróży. Dodaj pierwsze powyżej.",
          copyTripBeforeTasks:
            "To jest publiczna inspiracja. Dodaj ją do swoich podróży, żeby edytować checklistę.",

          adminPanel: "Panel administratora",
          noUsers: "Brak użytkowników.",
          couldNotLoadUsers: "Nie udało się załadować użytkowników.",

          couldNotLoadTrips: "Nie udało się załadować podróży.",
          requiredTripFields: "Tytuł, cel podróży i cena są wymagane.",
          couldNotAddTrip: "Nie udało się dodać podróży.",
          couldNotDeleteTrip: "Nie udało się usunąć podróży.",
          couldNotAddTask: "Nie udało się dodać zadania.",
          couldNotUpdateTask: "Nie udało się zmienić statusu zadania.",
          userInvited: "Użytkownik został zaproszony do podróży.",
          couldNotInvite: "Nie udało się zaprosić użytkownika.",
          userRemoved: "Użytkownik został usunięty z podróży.",
          couldNotRemove: "Nie udało się usunąć użytkownika.",

          logout: "Wyloguj",
        },
      },
    },
  },
  lng: localStorage.getItem("language") || "pl",
  fallbackLng: "pl",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;