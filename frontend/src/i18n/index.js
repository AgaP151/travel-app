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
          registerSubtitle: "Zarejestruj się, aby rozpocząć planowanie podróży.",
          name: "Imię",
          registerButton: "Utwórz konto",
          hasAccount: "Masz już konto?",
        },
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;