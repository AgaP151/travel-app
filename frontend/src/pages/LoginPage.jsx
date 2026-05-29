import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

function LoginPage() {
    const { t } = useTranslation();
  return (
    <main className="auth-page">
        <LanguageSwitcher />
      <section className="auth-card">
        <div className="auth-image">
          <div className="auth-image-overlay">
            <h2>Explore smarter</h2>
            <p>Plan your next journey with weather, budget and local tips.</p>
          </div>
        </div>

        <div className="auth-form">
          <h1>{t("auth.loginTitle")}</h1>
          <p className="auth-subtitle">{t("auth.loginSubtitle")}</p>

          <form>
            <label>
              {t("auth.email")}

              <input type="email" placeholder="you@example.com" />
            </label>

            <label>
              {t("auth.password")}
              <input type="password" placeholder="••••••••" />
            </label>

            <button type="submit">{t("auth.loginButton")}</button>
          </form>

          <p className="auth-switch">
            {t("auth.noAccount")} <a href="/register">{t("auth.createOne")}</a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;