import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

function RegisterPage() {
  const { t } = useTranslation();

  return (
    <main className="auth-page">
        <LanguageSwitcher />
      <section className="auth-card">
        <div className="auth-image">
          <div className="auth-image-overlay">
            <h2>Start your journey</h2>
            <p>Create an account and plan trips with weather, budget and local tips.</p>
          </div>
        </div>

        <div className="auth-form">
          <h1>{t("auth.registerTitle")}</h1>
          <p className="auth-subtitle">{t("auth.registerSubtitle")}</p>

          <form>
            <label>
              {t("auth.name")}
              <input type="text" placeholder="Your name" />
            </label>

            <label>
              {t("auth.email")}
              <input type="email" placeholder="you@example.com" />
            </label>

            <label>
              {t("auth.password")}
              <input type="password" placeholder="••••••••" />
            </label>

            <button type="submit">{t("auth.registerButton")}</button>
          </form>

          <p className="auth-switch">
            {t("auth.hasAccount")} <a href="/login">{t("auth.loginLink")}</a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;