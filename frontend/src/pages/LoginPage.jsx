import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { loginUser } from "../services/authService";

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setSuccessMessage("");
      setError(t("auth.fillAllFields"));
      return;
    }

    setError("");

    const response = await loginUser(formData);
    console.log("Login response:", response);

    if (response.token) {
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
      return;
    }

    setError(response.message || t("auth.loginError"));
  }

  return (
    <main className="auth-page">
      <div className="auth-actions">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <section className="auth-card">
        <div className="auth-image">
          <div className="auth-image-overlay">
            <h2>{t("auth.loginImageTitle")}</h2>
            <p>{t("auth.loginImageSubtitle")}</p>
          </div>
        </div>

        <div className="auth-form">
          <h1>{t("auth.loginTitle")}</h1>
          <p className="auth-subtitle">{t("auth.loginSubtitle")}</p>

          {error && <p className="auth-error">{error}</p>}
          {successMessage && <p className="auth-success">{successMessage}</p>}

          <form onSubmit={handleSubmit}>
            <label>
              {t("auth.email")}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("auth.emailPlaceholder")}
                autoComplete="email"
              />
            </label>

            <label>
              {t("auth.password")}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
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