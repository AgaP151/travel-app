import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useState } from "react";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const { t } = useTranslation();
const [formData, setFormData] = useState({
  name: "",
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

  if (!formData.name || !formData.email || !formData.password) {
    setError(t("auth.fillAllFields"));
    return;
  }

  setError("");

  const response = await registerUser(formData);
  console.log("Register response:", response);
  setSuccessMessage(response.message);
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
            <h2>{t("auth.registerImageTitle")}</h2>
<p>{t("auth.registerImageSubtitle")}</p>
          </div>
        </div>

        <div className="auth-form">
          <h1>{t("auth.registerTitle")}</h1>
          <p className="auth-subtitle">{t("auth.registerSubtitle")}</p>
{error && <p className="auth-error">{error}</p>}

{successMessage && <p className="auth-success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
            <label>
              {t("auth.name")}
             <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
 placeholder={t("auth.namePlaceholder")}
/>
            </label>

            <label>
              {t("auth.email")}
              <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder={t("auth.emailPlaceholder")}
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
/>
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